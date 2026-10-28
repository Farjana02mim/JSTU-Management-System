import { UserRole, UserCustomClaims, UserProfile, AuditLogEntry } from '../../types/auth';

export interface AuthUserSession {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName?: string;
}

export interface AuthService {
  signIn(email: string, pass: string): Promise<{ success: boolean; error?: string; requireMfa?: boolean; role?: UserRole }>;
  signOut(): Promise<void>;
  completeMfaChallenge(code: string): Promise<boolean>;
  updateUserPassword(oldPass: string, newPass: string): Promise<{ success: boolean; error?: string }>;
  onAuthStateChanged(
    callback: (user: AuthUserSession | null, profile: UserProfile | null, claims: UserCustomClaims | null) => void
  ): () => void;
  reauthenticate(password: string): Promise<boolean>;
  getCurrentUser(): AuthUserSession | null;
  getCurrentClaims(): UserCustomClaims | null;
  getCurrentProfile(): UserProfile | null;
}

export interface CreateUserParams {
  email: string;
  fullName: string;
  role: UserRole;
  departmentId?: string;
  officeId?: string;
  studentId?: string;
}

export interface UserAdminService {
  createUserAccount(params: CreateUserParams): Promise<{ uid: string; message: string }>;
  setUserRole(targetUid: string, newRole: UserRole, departmentId?: string): Promise<{ success: boolean; message: string }>;
  disableUser(targetUid: string, reason: string): Promise<{ success: boolean }>;
  enableUser(targetUid: string): Promise<{ success: boolean }>;
  getAllUsers(): Promise<{ profile: UserProfile; claims: UserCustomClaims }[]>;
}

export interface AuditService {
  getAuditLogs(): Promise<AuditLogEntry[]>;
}
