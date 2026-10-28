export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'registrar'
  | 'exam_controller'
  | 'dept_chairman'
  | 'teacher'
  | 'student'
  | 'account_officer'
  | 'library_officer';

export interface UserCustomClaims {
  role: UserRole;
  departmentId?: string;
  deptId?: string; // Aliased
  officeId?: string;
  studentId?: string; // e.g. "JSTU2026001"
  mfaEnforced?: boolean;
  disabled?: boolean;
  mustChangePassword?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  fullNameBn?: string;
  role: UserRole;
  departmentId?: string;
  officeId?: string;
  studentId?: string;
  phoneNumber?: string;
  isMfaEnforced: boolean;
  mustChangePassword?: boolean;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorUid: string;
  actorEmail?: string;
  actorRole?: string;
  action:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILURE'
    | 'ACCOUNT_CREATED'
    | 'ROLE_CHANGED'
    | 'ACCOUNT_DISABLED'
    | 'PASSWORD_RESET_REQUESTED'
    | 'PASSWORD_CHANGED'
    | 'SESSION_REVOKED'
    | 'BRUTE_FORCE_SUSPECTED'
    | 'AI_ASSISTANT_QUERY'
    | 'ACCOUNT_REQUEST_SUBMITTED'
    | 'ACCOUNT_REQUEST_APPROVED'
    | 'ACCOUNT_REQUEST_REJECTED'
    | 'ACCOUNT_REQUEST_MORE_INFO_REQUESTED';
  targetUid?: string;
  targetEmail?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string; // ISO 8601
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 100,
  admin: 80,
  registrar: 60,
  exam_controller: 60,
  dept_chairman: 50,
  teacher: 40,
  account_officer: 40,
  library_officer: 40,
  student: 10
};

export const STAFF_ROLES: UserRole[] = [
  'super_admin',
  'admin',
  'registrar',
  'exam_controller',
  'dept_chairman',
  'teacher',
  'account_officer',
  'library_officer'
];

export function isStaffRole(role: UserRole): boolean {
  return role !== 'student';
}
