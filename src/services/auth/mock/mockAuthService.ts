import { AuthService, AuthUserSession } from '../types';
import { UserRole, UserCustomClaims, UserProfile } from '../../../types/auth';
import { DEMO_ACCOUNTS, DEMO_PASSWORD, initializeDemoSeed } from '../../demoAccounts';
import {
  getUserClaims,
  getUserProfile,
  getUserProfileByEmail,
  getUserPassword,
  setUserPassword,
  clearUserMustChangePassword,
  isSessionRevoked,
  recordAuthAttempt,
  writeAuditLog
} from '../../cloudFunctions/backendEngine';

export class MockAuthService implements AuthService {
  private currentUser: AuthUserSession | null = null;
  private currentClaims: UserCustomClaims | null = null;
  private currentProfile: UserProfile | null = null;
  private listeners: Array<(user: AuthUserSession | null, profile: UserProfile | null, claims: UserCustomClaims | null) => void> = [];

  constructor() {
    initializeDemoSeed();
  }

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
    this.listeners.push(callback);
    callback(this.currentUser, this.currentProfile, this.currentClaims);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.currentUser, this.currentProfile, this.currentClaims);
    }
  }

  async signIn(email: string, pass: string): Promise<{ success: boolean; error?: string; requireMfa?: boolean; role?: UserRole }> {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check built-in demo accounts FIRST:
    // Built-in demo accounts always sign in with DEMO_PASSWORD ('JSTU#Smart2026!'),
    // independent of any stored or approved-student credentials.
    const builtInAccount = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === normalizedEmail);
    if (builtInAccount) {
      const attempt = recordAuthAttempt(builtInAccount.email, false);
      if (attempt.blocked) {
        return { success: false, error: attempt.message || 'Account temporarily locked due to too many failed attempts.' };
      }

      if (pass !== DEMO_PASSWORD) {
        return { success: false, error: 'Invalid password. Security attempt logged.' };
      }

      recordAuthAttempt(builtInAccount.email, true);

      const userSession: AuthUserSession = {
        uid: builtInAccount.uid,
        email: builtInAccount.email,
        emailVerified: true,
        displayName: builtInAccount.fullName
      };

      const claims: UserCustomClaims = {
        role: builtInAccount.role,
        departmentId: builtInAccount.departmentId,
        deptId: builtInAccount.departmentId,
        officeId: builtInAccount.officeId,
        studentId: builtInAccount.studentId,
        mfaEnforced: builtInAccount.isMfaEnforced,
        disabled: builtInAccount.disabled,
        mustChangePassword: builtInAccount.mustChangePassword
      };

      const profile: UserProfile = {
        uid: builtInAccount.uid,
        email: builtInAccount.email,
        fullName: builtInAccount.fullName,
        fullNameBn: builtInAccount.fullNameBn,
        role: builtInAccount.role,
        departmentId: builtInAccount.departmentId,
        officeId: builtInAccount.officeId,
        studentId: builtInAccount.studentId,
        isMfaEnforced: builtInAccount.isMfaEnforced,
        disabled: !!builtInAccount.disabled,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.currentUser = userSession;
      this.currentClaims = claims;
      this.currentProfile = profile;

      writeAuditLog(userSession.uid, 'LOGIN_SUCCESS', undefined, userSession.email, {
        role: claims.role,
        mfaEnforced: claims.mfaEnforced
      });

      this.notify();

      if (claims.mfaEnforced) {
        return { success: true, requireMfa: true, role: claims.role };
      }

      return { success: true, role: claims.role };
    }

    // 2. Check dynamically provisioned users / approved students (from backendEngine)
    const attempt = recordAuthAttempt(email, false);
    if (attempt.blocked) {
      return { success: false, error: attempt.message || 'Account temporarily locked due to too many failed attempts.' };
    }

    const dynamicProfile = getUserProfileByEmail(email);
    if (dynamicProfile) {
      const dynamicClaims = getUserClaims(dynamicProfile.uid);
      const storedPass = getUserPassword(dynamicProfile.uid) || getUserPassword(email);

      if (!storedPass || pass !== storedPass) {
        return { success: false, error: 'Invalid password. Security attempt logged.' };
      }

      recordAuthAttempt(email, true);

      const userSession: AuthUserSession = {
        uid: dynamicProfile.uid,
        email: dynamicProfile.email,
        emailVerified: true,
        displayName: dynamicProfile.fullName
      };

      const claims: UserCustomClaims = dynamicClaims || {
        role: dynamicProfile.role,
        departmentId: dynamicProfile.departmentId,
        deptId: dynamicProfile.departmentId,
        officeId: dynamicProfile.officeId,
        studentId: dynamicProfile.studentId,
        mfaEnforced: dynamicProfile.isMfaEnforced || false,
        disabled: !!dynamicProfile.disabled,
        mustChangePassword: false
      };

      this.currentUser = userSession;
      this.currentClaims = claims;
      this.currentProfile = dynamicProfile;

      writeAuditLog(userSession.uid, 'LOGIN_SUCCESS', undefined, userSession.email, {
        role: claims.role,
        mfaEnforced: claims.mfaEnforced
      });

      this.notify();

      if (claims.mfaEnforced) {
        return { success: true, requireMfa: true, role: claims.role };
      }

      return { success: true, role: claims.role };
    }

    return { success: false, error: 'Invalid institutional credentials or unauthorized user.' };
  }

  async completeMfaChallenge(code: string): Promise<boolean> {
    if (code === '123456') {
      return true;
    }
    return false;
  }

  async signOut(): Promise<void> {
    if (this.currentUser) {
      writeAuditLog(this.currentUser.uid, 'LOGIN_SUCCESS', undefined, this.currentUser.email, {
        action: 'USER_LOGOUT'
      });
    }
    this.currentUser = null;
    this.currentClaims = null;
    this.currentProfile = null;
    this.notify();
  }

  async reauthenticate(password: string): Promise<boolean> {
    if (this.currentUser) {
      const customPass = getUserPassword(this.currentUser.uid) || getUserPassword(this.currentUser.email);
      if (customPass) return password === customPass;
    }
    return password === DEMO_PASSWORD;
  }

  async updateUserPassword(oldPass: string, newPass: string): Promise<{ success: boolean; error?: string }> {
    if (this.currentUser) {
      setUserPassword(this.currentUser.uid, newPass);
      setUserPassword(this.currentUser.email, newPass);
      clearUserMustChangePassword(this.currentUser.uid);
      if (this.currentClaims) {
        this.currentClaims = { ...this.currentClaims, mustChangePassword: false };
      }
      writeAuditLog(this.currentUser.uid, 'PASSWORD_CHANGED', this.currentUser.uid, this.currentUser.email);
      this.notify();
    }
    return { success: true };
  }
}
