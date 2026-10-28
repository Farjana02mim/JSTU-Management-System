import { UserAdminService, CreateUserParams } from '../types';
import { UserRole, UserProfile, UserCustomClaims } from '../../../types/auth';
import {
  createUserAccount,
  setUserRole,
  disableUser,
  enableUser,
  getAllUsers,
  getUserClaims
} from '../../cloudFunctions/backendEngine';

export class MockUserAdminService implements UserAdminService {
  private getCallerContext() {
    // In mock mode, find the currently active session or fallback to mock super_admin
    const fallbackClaims: UserCustomClaims = { role: 'super_admin', mfaEnforced: true };
    return { callerUid: 'mock_super_admin', callerClaims: fallbackClaims };
  }

  async createUserAccount(params: CreateUserParams): Promise<{ uid: string; message: string }> {
    const { callerUid, callerClaims } = this.getCallerContext();
    return createUserAccount({
      callerUid,
      callerClaims,
      email: params.email,
      fullName: params.fullName,
      role: params.role,
      departmentId: params.departmentId,
      officeId: params.officeId,
      studentId: params.studentId
    });
  }

  async setUserRole(targetUid: string, newRole: UserRole, departmentId?: string): Promise<{ success: boolean; message: string }> {
    const { callerUid, callerClaims } = this.getCallerContext();
    return setUserRole(callerUid, callerClaims, targetUid, newRole, departmentId);
  }

  async disableUser(targetUid: string, reason: string): Promise<{ success: boolean }> {
    const { callerUid, callerClaims } = this.getCallerContext();
    return disableUser(callerUid, callerClaims, targetUid, reason);
  }

  async enableUser(targetUid: string): Promise<{ success: boolean }> {
    const { callerUid, callerClaims } = this.getCallerContext();
    return enableUser(callerUid, callerClaims, targetUid);
  }

  async getAllUsers(): Promise<{ profile: UserProfile; claims: UserCustomClaims }[]> {
    const { callerUid, callerClaims } = this.getCallerContext();
    return getAllUsers(callerUid, callerClaims);
  }
}
