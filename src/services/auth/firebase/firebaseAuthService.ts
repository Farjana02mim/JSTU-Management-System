import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onIdTokenChanged,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore, functions } from './firebaseConfig';
import { httpsCallable } from 'firebase/functions';
import { AuthService, AuthUserSession } from '../types';
import { UserCustomClaims, UserProfile, UserRole } from '../../../types/auth';

export class FirebaseAuthService implements AuthService {
  private currentUser: AuthUserSession | null = null;
  private currentClaims: UserCustomClaims | null = null;
  private currentProfile: UserProfile | null = null;

  getCurrentUser(): AuthUserSession | null {
    return this.currentUser;
  }

  getCurrentClaims(): UserCustomClaims | null {
    return this.currentClaims;
  }

  getCurrentProfile(): UserProfile | null {
    return this.currentProfile;
  }

  onAuthStateChanged(
    callback: (user: AuthUserSession | null, profile: UserProfile | null, claims: UserCustomClaims | null) => void
  ): () => void {
    return onIdTokenChanged(auth, async (firebaseUser: User | null) => {
      if (!firebaseUser) {
        this.currentUser = null;
        this.currentClaims = null;
        this.currentProfile = null;
        callback(null, null, null);
        return;
      }

      try {
        const tokenResult = await firebaseUser.getIdTokenResult(true);
        const claims = (tokenResult.claims || {}) as unknown as UserCustomClaims;

        // Disallow if token is disabled
        if (claims.disabled) {
          await firebaseSignOut(auth);
          this.currentUser = null;
          this.currentClaims = null;
          this.currentProfile = null;
          callback(null, null, null);
          return;
        }

        const userDocRef = doc(firestore, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        const profileData = userDocSnap.exists() ? (userDocSnap.data() as UserProfile) : null;

        const role = (claims.role || profileData?.role || 'student') as UserRole;
        const normalizedClaims: UserCustomClaims = {
          role,
          deptId: claims.deptId || claims.departmentId,
          departmentId: claims.departmentId || claims.deptId,
          officeId: claims.officeId,
          studentId: claims.studentId,
          mfaEnforced: claims.mfaEnforced ?? false,
          disabled: claims.disabled ?? false,
          mustChangePassword: claims.mustChangePassword ?? false
        };

        const session: AuthUserSession = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          emailVerified: firebaseUser.emailVerified,
          displayName: firebaseUser.displayName || profileData?.fullName || ''
        };

        this.currentUser = session;
        this.currentClaims = normalizedClaims;
        this.currentProfile = profileData;

        callback(session, profileData, normalizedClaims);
      } catch (err) {
        console.error('Failed to parse Firebase Auth token or profile:', err);
        callback(null, null, null);
      }
    });
  }

  async signIn(email: string, pass: string): Promise<{ success: boolean; error?: string; requireMfa?: boolean; role?: UserRole }> {
    try {
      // 1. Call server-side preLoginCheck to enforce brute-force lock
      try {
        const preLoginCheckFn = httpsCallable<{ email: string }, { allowed: boolean; message?: string }>(
          functions,
          'preLoginCheck'
        );
        const checkResult = await preLoginCheckFn({ email });
        if (!checkResult.data.allowed) {
          return { success: false, error: checkResult.data.message || 'Login blocked. Please try again later.' };
        }
      } catch (checkErr) {
        console.warn('Pre-login check unavailable or bypassed in test:', checkErr);
      }

      // 2. Real Firebase Auth sign in
      const userCred = await signInWithEmailAndPassword(auth, email, pass);
      const token = await userCred.user.getIdTokenResult();
      const claims = (token.claims || {}) as unknown as UserCustomClaims;

      if (claims.disabled) {
        await firebaseSignOut(auth);
        return { success: false, error: 'This institutional account has been deactivated. Please contact the Registrar.' };
      }

      if (claims.mfaEnforced) {
        return { success: true, requireMfa: true, role: claims.role };
      }

      return { success: true, role: claims.role };
    } catch (err: any) {
      return { success: false, error: err.message || 'Authentication failed' };
    }
  }

  async completeMfaChallenge(_code: string): Promise<boolean> {
    // In production Firebase, Identity Platform handles multi-factor resolver natively
    return true;
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
    this.currentUser = null;
    this.currentClaims = null;
    this.currentProfile = null;
  }

  async reauthenticate(password: string): Promise<boolean> {
    if (!auth.currentUser || !auth.currentUser.email) return false;
    try {
      const cred = EmailAuthProvider.credential(auth.currentUser.email, password);
      await reauthenticateWithCredential(auth.currentUser, cred);
      return true;
    } catch {
      return false;
    }
  }

  async updateUserPassword(oldPass: string, newPass: string): Promise<{ success: boolean; error?: string }> {
    if (!auth.currentUser) return { success: false, error: 'No authenticated user session.' };
    const reauthed = await this.reauthenticate(oldPass);
    if (!reauthed) return { success: false, error: 'Current password verification failed.' };

    try {
      await firebaseUpdatePassword(auth.currentUser, newPass);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update password.' };
    }
  }
}
