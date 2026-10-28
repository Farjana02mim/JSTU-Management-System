import { httpsCallable } from 'firebase/functions';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { functions, firestore } from './firebaseConfig';
import { UserAdminService, CreateUserParams } from '../types';
import { UserRole, UserProfile, UserCustomClaims } from '../../../types/auth';

export class FirebaseUserAdminService implements UserAdminService {
  async createUserAccount(params: CreateUserParams): Promise<{ uid: string; message: string }> {
    const fn = httpsCallable<CreateUserParams, { uid: string; message: string }>(functions, 'createUserAccount');
    const result = await fn(params);
    return result.data;
  }

  async setUserRole(targetUid: string, newRole: UserRole, departmentId?: string): Promise<{ success: boolean; message: string }> {
    const fn = httpsCallable<
      { targetUid: string; newRole: UserRole; departmentId?: string },
      { success: boolean; message: string }
    >(functions, 'setUserRole');
    const result = await fn({ targetUid, newRole, departmentId });
    return result.data;
  }

  async disableUser(targetUid: string, reason: string): Promise<{ success: boolean }> {
    const fn = httpsCallable<{ targetUid: string; reason: string }, { success: boolean }>(functions, 'disableUser');
    const result = await fn({ targetUid, reason });
    return result.data;
  }

  async enableUser(targetUid: string): Promise<{ success: boolean }> {
    const fn = httpsCallable<{ targetUid: string }, { success: boolean }>(functions, 'enableUser');
    const result = await fn({ targetUid });
    return result.data;
  }

  async getAllUsers(): Promise<{ profile: UserProfile; claims: UserCustomClaims }[]> {
    // Read profiles directly from users collection (rules permit read by admin / registrar)
    const q = query(collection(firestore, 'users'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const profile = d.data() as UserProfile;
      const claims: UserCustomClaims = {
        role: profile.role,
        departmentId: profile.departmentId,
        deptId: profile.departmentId,
        officeId: profile.officeId,
        studentId: profile.studentId,
        mfaEnforced: profile.isMfaEnforced,
        disabled: profile.disabled
      };
      return { profile, claims };
    });
  }
}
