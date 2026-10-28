import { UserRole, UserProfile, UserCustomClaims } from '../types/auth';
import { seedBackendUser } from './cloudFunctions/backendEngine';

export interface DemoAccount {
  uid: string;
  email: string;
  password: string;
  fullName: string;
  fullNameBn: string;
  role: UserRole;
  departmentId?: string;
  officeId?: string;
  studentId?: string;
  isMfaEnforced: boolean;
  disabled?: boolean;
  mustChangePassword?: boolean;
  targetDashboard: string;
}

export const DEMO_PASSWORD = 'JSTU#Smart2026!';

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    uid: 'demo_student_01',
    email: 'student.demo@jstu.ac.bd',
    password: DEMO_PASSWORD,
    fullName: 'Tanvir Ahmed',
    fullNameBn: 'তানভীর আহমেদ',
    role: 'student',
    departmentId: 'CSE',
    studentId: 'JSTU2026001',
    isMfaEnforced: false, // Students do not require MFA
    targetDashboard: '/student'
  },
  {
    uid: 'demo_teacher_01',
    email: 'teacher.demo@jstu.ac.bd',
    password: DEMO_PASSWORD,
    fullName: 'Dr. Shahadat Hossain',
    fullNameBn: 'ড. শাহাদাত হোসেন',
    role: 'teacher',
    departmentId: 'CSE',
    isMfaEnforced: true,
    targetDashboard: '/teacher'
  },
  {
    uid: 'demo_chairman_01',
    email: 'chairman.demo@jstu.ac.bd',
    password: DEMO_PASSWORD,
    fullName: 'Prof. Dr. Chairman CSE',
    fullNameBn: 'অধ্যাপক ড. চেয়ারম্যান সিএসই',
    role: 'dept_chairman',
    departmentId: 'CSE',
    isMfaEnforced: true,
    targetDashboard: '/chairman'
  },
  {
    uid: 'demo_registrar_01',
    email: 'registrar.demo@jstu.ac.bd',
    password: DEMO_PASSWORD,
    fullName: 'Md. Abdul Mannan',
    fullNameBn: 'মো. আবদুল মান্নান',
    role: 'registrar',
    officeId: 'REGISTRAR',
    isMfaEnforced: true,
    targetDashboard: '/office/registrar'
  },
  {
    uid: 'demo_controller_01',
    email: 'controller.demo@jstu.ac.bd',
    password: DEMO_PASSWORD,
    fullName: 'Dr. Md. Mokhlesur Rahman',
    fullNameBn: 'ড. মো. মোখলেসুর রহমান',
    role: 'exam_controller',
    officeId: 'EXAM_CONTROLLER',
    isMfaEnforced: true,
    targetDashboard: '/office/exam_controller'
  },
  {
    uid: 'demo_accounts_01',
    email: 'accounts.demo@jstu.ac.bd',
    password: DEMO_PASSWORD,
    fullName: 'A. K. M. Saiful Islam',
    fullNameBn: 'এ. কে. এম. সাইফুল ইসলাম',
    role: 'account_officer',
    officeId: 'ACCOUNTS',
    isMfaEnforced: true,
    targetDashboard: '/office/account_officer'
  },
  {
    uid: 'demo_library_01',
    email: 'library.demo@jstu.ac.bd',
    password: DEMO_PASSWORD,
    fullName: 'Syed Nurul Huda',
    fullNameBn: 'সৈয়দ নুরুল হুদা',
    role: 'library_officer',
    officeId: 'LIBRARY',
    isMfaEnforced: true,
    targetDashboard: '/office/library_officer'
  },
  {
    uid: 'demo_admin_01',
    email: 'admin.demo@jstu.ac.bd',
    password: DEMO_PASSWORD,
    fullName: 'Engr. Mahbub Alam (ICT Cell)',
    fullNameBn: 'ইঞ্জি. মাহবুব আলম (আইসিটি সেল)',
    role: 'admin',
    isMfaEnforced: true,
    targetDashboard: '/admin'
  },
  {
    uid: 'demo_superadmin_01',
    email: 'superadmin.demo@jstu.ac.bd',
    password: DEMO_PASSWORD,
    fullName: 'Prof. Dr. Vice Chancellor',
    fullNameBn: 'উপাচার্য ও প্রধান প্রশাসক',
    role: 'super_admin',
    isMfaEnforced: true,
    targetDashboard: '/admin'
  }
];

export function initializeDemoSeed() {
  DEMO_ACCOUNTS.forEach((acc) => {
    const profile: UserProfile = {
      uid: acc.uid,
      email: acc.email,
      fullName: acc.fullName,
      fullNameBn: acc.fullNameBn,
      role: acc.role,
      departmentId: acc.departmentId,
      officeId: acc.officeId,
      studentId: acc.studentId,
      isMfaEnforced: acc.isMfaEnforced,
      disabled: false,
      mustChangePassword: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z'
    };

    const claims: UserCustomClaims = {
      role: acc.role,
      departmentId: acc.departmentId,
      deptId: acc.departmentId,
      officeId: acc.officeId,
      studentId: acc.studentId,
      mfaEnforced: acc.isMfaEnforced,
      disabled: false
    };

    seedBackendUser(profile, claims);
  });

  // Print demo credentials to console in emulator/development mode only
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    console.info(
      '%c[JSTU Firebase Emulator] Demo Accounts Initialized (Password for all: ' + DEMO_PASSWORD + ')',
      'background: #0A2540; color: #F59E0B; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
    );
    console.table(
      DEMO_ACCOUNTS.map((a) => ({
        Role: a.role,
        Email: a.email,
        Department: a.departmentId || a.officeId || '-',
        MFA: a.isMfaEnforced ? 'Mandatory' : 'Optional',
        Route: a.targetDashboard
      }))
    );
  }
}
