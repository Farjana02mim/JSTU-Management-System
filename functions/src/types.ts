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
  deptId?: string;
  officeId?: string;
  studentId?: string;
  mfaEnforced?: boolean;
  disabled?: boolean;
  mustChangePassword?: boolean;
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
