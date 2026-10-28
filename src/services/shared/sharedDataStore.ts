/**
 * JSTU Smart Campus — Unified Shared Demo Data Store
 * 
 * Single source of truth for Phase 3 cross-role flow.
 * Both StudentDataService and TeacherDataService read and write here.
 * Persisted in browser localStorage under 'jstu_demo_shared_data_v2'.
 */

import { StudentProfileData, SemesterResult, ClassScheduleItem, FeeBreakdown, StudentNotification } from '../student/types';
import { MARKS_LIMITS, computeTotalMarks, calculateAttendanceMetrics } from '../../utils/marksCalculator';
import { MarksSheetStatus, MarksAuditEntry, MarksCorrectionRequest, MarksSheetVersionSnapshot } from '../marks/lifecycleTypes';
import { PaperlessApplication } from '../workflow/workflowTypes';
import { DigitalDocument } from '../documents/documentTypes';
import { Book, BookBorrowing, BookReservation } from '../../types/library';
import {
  HallSeatApplication,
  ClubMembershipApplication,
  SportsBooking,
  MedicalAppointment,
  AlumniRegistrationRequest
} from '../../types/studentLife';
import {
  ManagedNoticeItem,
  ManagedNewsItem,
  ManagedEventItem,
  ManagedGalleryItem,
  ManagedDownloadItem,
  ManagedDepartmentItem,
  ManagedFacultyItem,
  ManagedVcMessageItem,
  ManagedStaticPageItem,
  ContentAuditEntry,
  ContentSectionKey,
  ContentStatus
} from '../../types/contentManagement';
import {
  initialBooksData,
  initialBorrowingsData,
  initialReservationsData
} from '../../data/librarySeedData';
import {
  initialHallApplicationsData,
  initialAlumniRegistrationsData
} from '../../data/studentLifeSeedData';
import {
  initialManagedNotices,
  initialManagedNews,
  initialManagedEvents,
  initialManagedGallery,
  initialManagedDownloads,
  initialManagedDepartments,
  initialManagedFaculty,
  initialManagedVcMessage,
  initialManagedStaticPages,
  initialContentAuditTrail
} from '../../data/contentManagementSeedData';
import { StudentIDCard, IDCardStatus } from '../idCard/idCardService';

export const SHARED_STORAGE_KEY = 'jstu_demo_shared_data_v2';

export const initialStudentIdCards: StudentIDCard[] = [
  {
    id: 'card-jstu-2026-001',
    studentId: 'JSTU2026001',
    name: 'Tanvir Ahmed',
    nameBn: 'তানভীর আহমেদ',
    department: 'Computer Science & Engineering',
    departmentBn: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং',
    faculty: 'Faculty of Engineering & Technology',
    facultyBn: 'প্রকৌশল ও প্রযুক্তি অনুষদ',
    session: '2022-2023',
    bloodGroup: 'B+',
    issueDate: '2023-01-15',
    validUntil: '2027-06-30',
    status: 'Active',
    verificationToken: 'tok_tanvir_jstu_7a8f9b',
    hallName: 'Shahid Rafiq Hall',
    hallNameBn: 'শহীদ রফিক হল',
    emergencyContact: '+880 1812-987654',
    gender: 'male',
    avatarSeed: 'tanvir_ahmed',
    updatedAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'card-jstu-2026-002',
    studentId: 'JSTU2026002',
    name: 'Sadia Afrin',
    nameBn: 'সাদিয়া আফরিন',
    department: 'Electrical & Electronic Engineering',
    departmentBn: 'ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং',
    faculty: 'Faculty of Engineering & Technology',
    facultyBn: 'প্রকৌশল ও প্রযুক্তি অনুষদ',
    session: '2022-2023',
    bloodGroup: 'O+',
    issueDate: '2023-01-15',
    validUntil: '2027-06-30',
    status: 'Active',
    verificationToken: 'tok_sadia_jstu_3c9d2e',
    hallName: 'Begum Rokeya Hall',
    hallNameBn: 'বেগম রোকেয়া হল',
    emergencyContact: '+880 1715-443322',
    gender: 'female',
    avatarSeed: 'sadia_afrin',
    updatedAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'card-jstu-2026-003',
    studentId: 'JSTU2026003',
    name: 'Mahmudur Rahman',
    nameBn: 'মাহমুদুর রহমান',
    department: 'Mathematics',
    departmentBn: 'গণিত বিভাগ',
    faculty: 'Faculty of Science',
    facultyBn: 'বিজ্ঞান অনুষদ',
    session: '2021-2022',
    bloodGroup: 'A+',
    issueDate: '2022-01-15',
    validUntil: '2026-06-30',
    status: 'Lost',
    statusReason: 'Student reported card lost on campus quadrangle on Sep 12, 2026. Flagged by Registrar.',
    verificationToken: 'tok_mahmud_jstu_5e1f8a',
    hallName: 'Shahid Rafiq Hall',
    hallNameBn: 'শহীদ রফিক হল',
    emergencyContact: '+880 1911-332211',
    gender: 'male',
    avatarSeed: 'mahmud_rahman',
    updatedAt: '2026-09-12T14:30:00Z'
  },
  {
    id: 'card-jstu-2026-004',
    studentId: 'JSTU2026004',
    name: 'Nusrat Jahan',
    nameBn: 'নুসরাত জাহান',
    department: 'Fisheries & Marine Science',
    departmentBn: 'মৎস্য ও সামুদ্রিক বিজ্ঞান',
    faculty: 'Faculty of Fisheries',
    facultyBn: 'মৎস্যবিজ্ঞান অনুষদ',
    session: '2021-2022',
    bloodGroup: 'AB+',
    issueDate: '2022-01-15',
    validUntil: '2026-06-30',
    status: 'Revoked',
    statusReason: 'Administrative hold: ID card revoked by Registrar following disciplinary board resolution #42.',
    verificationToken: 'tok_nusrat_jstu_9b4c7d',
    hallName: 'Begum Rokeya Hall',
    hallNameBn: 'বেগম রোকেয়া হল',
    emergencyContact: '+880 1718-887766',
    gender: 'female',
    avatarSeed: 'nusrat_jahan',
    updatedAt: '2026-08-20T09:15:00Z'
  },
  {
    id: 'card-jstu-2026-005',
    studentId: 'JSTU2026005',
    name: 'Arif Faisal',
    nameBn: 'আরিফ ফয়সাল',
    department: 'Geology & Mining',
    departmentBn: 'ভূতত্ত্ব ও খনি বিভাগ',
    faculty: 'Faculty of Earth Sciences',
    facultyBn: 'ভূ-বিজ্ঞান অনুষদ',
    session: '2019-2020',
    bloodGroup: 'B-',
    issueDate: '2020-01-15',
    validUntil: '2024-06-30',
    status: 'Expired',
    statusReason: 'Card reached end of academic validity on June 30, 2024 upon graduation.',
    verificationToken: 'tok_arif_jstu_2a6b4e',
    hallName: 'Shahid Rafiq Hall',
    hallNameBn: 'শহীদ রফিক হল',
    emergencyContact: '+880 1512-334455',
    gender: 'male',
    avatarSeed: 'arif_faisal',
    updatedAt: '2024-07-01T00:00:00Z'
  },
  {
    id: 'card-jstu-2026-006',
    studentId: 'JSTU2026006',
    name: 'Fahmida Haque',
    nameBn: 'ফাহমিদা হক',
    department: 'Management',
    departmentBn: 'ব্যবস্থাপনা বিভাগ',
    faculty: 'Faculty of Business Studies',
    facultyBn: 'ব্যবসায় শিক্ষা অনুষদ',
    session: '2023-2024',
    bloodGroup: 'O-',
    issueDate: '2024-01-15',
    validUntil: '2028-06-30',
    status: 'Active',
    verificationToken: 'tok_fahmida_jstu_8e3c1d',
    hallName: 'Begum Rokeya Hall',
    hallNameBn: 'বেগম রোকেয়া হল',
    emergencyContact: '+880 1612-445566',
    gender: 'female',
    avatarSeed: 'fahmida_haque',
    updatedAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'card-jstu-2026-007',
    studentId: 'JSTU2026007',
    name: 'Rashedul Islam',
    nameBn: 'রাশেদুল ইসলাম',
    department: 'Social Work',
    departmentBn: 'সমাজকর্ম বিভাগ',
    faculty: 'Faculty of Social Sciences',
    facultyBn: 'সামাজিক বিজ্ঞান অনুষদ',
    session: '2023-2024',
    bloodGroup: 'A-',
    issueDate: '2024-01-15',
    validUntil: '2028-06-30',
    status: 'Active',
    verificationToken: 'tok_rashed_jstu_4f7a2c',
    hallName: 'Shahid Rafiq Hall',
    hallNameBn: 'শহীদ রফিক হল',
    emergencyContact: '+880 1719-223344',
    gender: 'male',
    avatarSeed: 'rashed_islam',
    updatedAt: '2026-01-15T10:00:00Z'
  }
];

export interface EnrolledStudentRef {
  studentId: string;
  name: string;
  nameBn: string;
  email: string;
  avatar?: string;
  rollNumber: string;
}

export interface CourseMaterialRef {
  id: string;
  title: string;
  fileType: 'pdf' | 'slide' | 'doc';
  fileSize: string;
  uploadDate: string;
  downloadUrl: string;
}

export interface CourseAnnouncementRef {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface DailyAttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  topic?: string;
  takenAt: string;
  records: {
    studentId: string;
    status: 'present' | 'absent';
  }[];
}

export interface StudentMarksRecord {
  studentId: string;
  attendance: number; // max 10
  classTests: number; // max 20
  midterm: number; // max 20
  finalExam?: number; // max 50
  total: number;
  letterGrade: string;
  gradePoint: number;
}

export interface CourseMarksSheet {
  id?: string;
  courseCode: string;
  status: MarksSheetStatus;
  submittedAt?: string;
  verifiedAt?: string;
  publishedAt?: string;
  lastSavedAt: string;
  returnComment?: string;
  currentVersion: number;
  versions?: MarksSheetVersionSnapshot[];
  corrections?: MarksCorrectionRequest[];
  entries: Record<string, StudentMarksRecord>;
  auditTrail: MarksAuditEntry[];
}

export interface SharedCourse {
  id: string;
  code: string;
  title: string;
  titleBn: string;
  credits: number;
  semester: string;
  semesterBn: string;
  department: string;
  instructor: string;
  instructorEmail: string;
  instructorUid: string;
  syllabusOverview: string;
  syllabusOverviewBn: string;
  enrolledStudents: EnrolledStudentRef[];
  materials: CourseMaterialRef[];
  announcements: CourseAnnouncementRef[];
  attendanceSessions: DailyAttendanceRecord[];
  marksSheet: CourseMarksSheet;
  // Aggregate stats cached for fast reads
  baseTotalClasses: number;
}

export interface SharedAssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  status: 'submitted' | 'graded';
  score?: number;
  feedback?: string;
  gradedAt?: string;
}

export interface SharedAssignment {
  id: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  createdAt: string;
  createdBy: string;
  submissions: SharedAssignmentSubmission[];
}

export interface SharedTeacherProfile {
  uid: string;
  email: string;
  fullName: string;
  fullNameBn: string;
  designation: string;
  designationBn: string;
  department: string;
  departmentBn: string;
  employeeId: string;
  phone: string;
  room: string;
  bloodGroup: string;
  assignedCourseCodes: string[];
  researchAreas: string[];
}

export type AccountRequestRole = 'student';
export type AccountRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'MORE_INFO_REQUESTED';

export interface AccountRequest {
  id: string;
  referenceNumber: string; // JSTU-REQ-YYYY-XXXXXX
  fullName: string;
  studentId: string; // studentId or admission roll
  role: 'student'; // Role is always student
  department: string;
  session: string; // e.g. "2022-2023"
  email: string;
  phone?: string;
  note: string;
  status: AccountRequestStatus;
  idVerified?: boolean;
  adminComment?: string;
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewerName?: string;
  createdUserId?: string;
}

export interface SimulatedEmailLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  body: string;
  sentAt: string;
  referenceNumber?: string;
  actionType: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'MORE_INFO_REQUESTED';
}

export interface ActivationToken {
  token: string;
  uid: string;
  email: string;
  referenceNumber: string;
  createdAt: string; // ISO string
  expiresAt: string; // ISO string (24 hours after creation)
  used: boolean;
  usedAt?: string;
}

export interface SharedStoreData {
  students: Record<string, StudentProfileData>;
  teacherProfile: SharedTeacherProfile;
  courses: SharedCourse[];
  assignments: SharedAssignment[];
  routine: Record<string, ClassScheduleItem[]>;
  teacherRoutine: Record<string, {
    id: string;
    day: string;
    timeSlot: string;
    courseCode: string;
    courseTitle: string;
    room: string;
    enrolledCount: number;
  }[]>;
  results: SemesterResult[];
  feeBreakdown: FeeBreakdown;
  studentNotifications: StudentNotification[];
  applications: PaperlessApplication[];
  digitalDocuments: DigitalDocument[];
  accountRequests: AccountRequest[];
  simulatedEmailLogs: SimulatedEmailLog[];
  activationTokens: ActivationToken[];
  teacherNotifications: {
    id: string;
    title: string;
    titleBn: string;
    message: string;
    messageBn: string;
    category: 'academic' | 'marks' | 'submission' | 'urgent';
    timestamp: string;
    read: boolean;
    link?: string;
  }[];
  notices?: import('../../types').Notice[];
  libraryBooks: Book[];
  libraryBorrowings: BookBorrowing[];
  libraryReservations: BookReservation[];
  hallApplications: HallSeatApplication[];
  clubApplications: ClubMembershipApplication[];
  sportsBookings: SportsBooking[];
  medicalAppointments: MedicalAppointment[];
  alumniRegistrations: AlumniRegistrationRequest[];
  managedNotices: ManagedNoticeItem[];
  managedNews: ManagedNewsItem[];
  managedEvents: ManagedEventItem[];
  managedGallery: ManagedGalleryItem[];
  managedDownloads: ManagedDownloadItem[];
  managedDepartments: ManagedDepartmentItem[];
  managedFaculty: ManagedFacultyItem[];
  managedVcMessage: ManagedVcMessageItem;
  managedStaticPages: ManagedStaticPageItem[];
  contentAuditTrail: ContentAuditEntry[];
  studentIdCards: StudentIDCard[];
}

// 12 Realistic Students for CSE 6th Semester
const DEMO_ENROLLED_STUDENTS: EnrolledStudentRef[] = [
  { studentId: 'JSTU2026001', rollNumber: '01', name: 'Tanvir Ahmed', nameBn: 'তানভীর আহমেদ', email: 'student.demo@jstu.ac.bd' },
  { studentId: 'JSTU2026002', rollNumber: '02', name: 'Sadia Afrin', nameBn: 'সাদিয়া আফরিন', email: 'sadia.2026002@jstu.ac.bd' },
  { studentId: 'JSTU2026003', rollNumber: '03', name: 'Mahmudur Rahman', nameBn: 'মাহমুদুর রহমান', email: 'mahmud.2026003@jstu.ac.bd' },
  { studentId: 'JSTU2026004', rollNumber: '04', name: 'Nusrat Jahan', nameBn: 'নুসরাত জাহান', email: 'nusrat.2026004@jstu.ac.bd' },
  { studentId: 'JSTU2026005', rollNumber: '05', name: 'Arif Faisal', nameBn: 'আরিফ ফয়সাল', email: 'arif.2026005@jstu.ac.bd' },
  { studentId: 'JSTU2026006', rollNumber: '06', name: 'Fahmida Haque', nameBn: 'ফাহমিদা হক', email: 'fahmida.2026006@jstu.ac.bd' },
  { studentId: 'JSTU2026007', rollNumber: '07', name: 'Rashedul Islam', nameBn: 'রাশেদুল ইসলাম', email: 'rashed.2026007@jstu.ac.bd' },
  { studentId: 'JSTU2026008', rollNumber: '08', name: 'Sumaiya Akter', nameBn: 'সুমাইয়া আক্তার', email: 'sumaiya.2026008@jstu.ac.bd' },
  { studentId: 'JSTU2026009', rollNumber: '09', name: 'Mehedi Hasan', nameBn: 'মেহেদী হাসান', email: 'mehedi.2026009@jstu.ac.bd' },
  { studentId: 'JSTU2026010', rollNumber: '10', name: 'Anika Tabassum', nameBn: 'আনিকা তাবাসসুম', email: 'anika.2026010@jstu.ac.bd' },
  { studentId: 'JSTU2026011', rollNumber: '11', name: 'Shakil Ahmed', nameBn: 'শাকিল আহমেদ', email: 'shakil.2026011@jstu.ac.bd' },
  { studentId: 'JSTU2026012', rollNumber: '12', name: 'Tasnim Zara', nameBn: 'তাসনিম যারা', email: 'tasnim.2026012@jstu.ac.bd' }
];

export function getInitialSharedStoreData(): SharedStoreData {
  const teacherEmail = 'teacher.demo@jstu.ac.bd';
  const teacherUid = 'demo_teacher_01';
  const teacherName = 'Dr. Shahadat Hossain';
  const teacherNameBn = 'ড. শাহাদাত হোসেন';

  const teacherProfile: SharedTeacherProfile = {
    uid: teacherUid,
    email: teacherEmail,
    fullName: teacherName,
    fullNameBn: teacherNameBn,
    designation: 'Associate Professor',
    designationBn: 'সহযোগী অধ্যাপক',
    department: 'Computer Science & Engineering',
    departmentBn: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং',
    employeeId: 'EMP-CSE-0042',
    phone: '+880 1713-987654',
    room: 'Academic Building 2, Faculty Suite 305',
    bloodGroup: 'O+',
    assignedCourseCodes: ['CSE-3201', 'CSE-3205', 'CSE-1101'],
    researchAreas: ['Compilers & Program Analysis', 'Software Architecture', 'Applied Artificial Intelligence']
  };

  const studentProfile: StudentProfileData = {
    uid: 'demo_student_01',
    studentId: 'JSTU2026001',
    fullName: 'Tanvir Ahmed',
    fullNameBn: 'তানভীর আহমেদ',
    email: 'student.demo@jstu.ac.bd',
    phone: '+880 1711-234567',
    department: 'Computer Science & Engineering',
    departmentBn: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং',
    semester: '6th Semester (3rd Year 2nd Term)',
    semesterBn: '৬ষ্ঠ সেমিস্টার (৩য় বর্ষ ২য় টার্ম)',
    academicSession: '2023-2024',
    hallName: 'Shahid Rafiq Hall',
    hallNameBn: 'শহীদ রফিক হল',
    advisorName: 'Dr. Shahadat Hossain',
    advisorEmail: teacherEmail,
    bloodGroup: 'B+',
    guardianName: 'Md. Rafiqul Islam',
    guardianPhone: '+880 1812-987654',
    address: 'Jamalpur Sadar, Jamalpur-2000, Bangladesh',
    addressBn: 'জামালপুর সদর, Jamalpur-২০০০, বাংলাদেশ',
    cgpa: 3.82,
    creditsEarned: 104.0
  };

  // Helper to build initial marks sheet for enrolled students
  const buildInitialMarksSheet = (
    courseCode: string,
    initialStatus: MarksSheetStatus = 'DRAFT',
    includeFinal: boolean = true
  ): CourseMarksSheet => {
    const entries: Record<string, StudentMarksRecord> = {};
    DEMO_ENROLLED_STUDENTS.forEach((st, idx) => {
      // Vary marks slightly per student
      const att = Math.min(10, 8.5 + (idx % 3) * 0.5);
      const ct = Math.min(20, 16 + (idx % 4));
      const mid = Math.min(20, 15 + (idx % 5));
      const finalVal = includeFinal ? Math.min(50, 36 + (idx % 12)) : undefined;
      const computed = computeTotalMarks({ attendance: att, classTests: ct, midterm: mid, finalExam: finalVal });
      entries[st.studentId] = {
        studentId: st.studentId,
        attendance: computed.attendance,
        classTests: computed.classTests,
        midterm: computed.midterm,
        finalExam: finalVal,
        total: computed.totalMarks,
        letterGrade: computed.letterGrade,
        gradePoint: computed.gradePoint
      };
    });

    const auditTrail: MarksAuditEntry[] = [];
    if (initialStatus === 'SUBMITTED' || initialStatus === 'VERIFIED') {
      auditTrail.push({
        id: `audit-seed-sub-${courseCode}`,
        resultSheetId: `sheet-${courseCode}`,
        courseCode,
        actorUid: teacherUid,
        actorName: teacherName,
        actorEmail: teacherEmail,
        role: 'teacher',
        action: 'SUBMIT',
        fromStatus: 'DRAFT',
        toStatus: 'SUBMITTED',
        comment: 'Continuous assessment and semester final marks compiled and submitted for departmental verification.',
        timestamp: '2026-10-03T11:30:00Z'
      });
    }

    if (initialStatus === 'VERIFIED') {
      auditTrail.push({
        id: `audit-seed-ver-${courseCode}`,
        resultSheetId: `sheet-${courseCode}`,
        courseCode,
        actorUid: 'demo_chairman_01',
        actorName: 'Prof. Dr. Chairman CSE',
        actorEmail: 'chairman.demo@jstu.ac.bd',
        role: 'dept_chairman',
        action: 'VERIFY',
        fromStatus: 'SUBMITTED',
        toStatus: 'VERIFIED',
        comment: 'Tabulation sheet verified and found in order. Endorsed for publication.',
        timestamp: '2026-10-04T14:15:00Z'
      });
    }

    return {
      id: `sheet-${courseCode}`,
      courseCode,
      status: initialStatus,
      submittedAt: initialStatus !== 'DRAFT' ? '2026-10-03T11:30:00Z' : undefined,
      verifiedAt: initialStatus === 'VERIFIED' ? '2026-10-04T14:15:00Z' : undefined,
      lastSavedAt: '2026-10-04T14:15:00Z',
      currentVersion: 1,
      versions: [],
      corrections: [],
      entries,
      auditTrail
    };
  };

  // Helper to build initial attendance sessions
  const buildInitialAttendanceSessions = (courseCode: string): DailyAttendanceRecord[] => {
    return [
      {
        id: `att-${courseCode}-01`,
        date: '2026-09-27',
        topic: 'Introduction & Course Syllabus',
        takenAt: '2026-09-27T09:15:00Z',
        records: DEMO_ENROLLED_STUDENTS.map((st) => ({ studentId: st.studentId, status: 'present' as const }))
      },
      {
        id: `att-${courseCode}-02`,
        date: '2026-09-29',
        topic: 'Fundamental Concepts & Architecture',
        takenAt: '2026-09-29T09:10:00Z',
        records: DEMO_ENROLLED_STUDENTS.map((st, i) => ({
          studentId: st.studentId,
          status: i === 3 ? 'absent' : 'present' // Nusrat absent
        }))
      },
      {
        id: `att-${courseCode}-03`,
        date: '2026-10-04',
        topic: 'Core Methodologies & Lab Demonstrations',
        takenAt: '2026-10-04T09:20:00Z',
        records: DEMO_ENROLLED_STUDENTS.map((st, i) => ({
          studentId: st.studentId,
          status: i === 5 ? 'absent' : 'present' // Fahmida absent
        }))
      }
    ];
  };

  const courses: SharedCourse[] = [
    // 1. CSE-3201: Assigned to Dr. Shahadat Hossain (Teacher) & Taken by Tanvir (Student)
    {
      id: 'cse-3201',
      code: 'CSE-3201',
      title: 'Compiler Design',
      titleBn: 'কম্পাইলার ডিজাইন',
      credits: 3.0,
      semester: '6th Semester',
      semesterBn: '৬ষ্ঠ সেমিস্টার',
      department: 'CSE',
      instructor: teacherName,
      instructorEmail: teacherEmail,
      instructorUid: teacherUid,
      syllabusOverview: 'Lexical analysis, syntax-directed translation, symbol tables, code generation and optimization.',
      syllabusOverviewBn: 'লেক্সিক্যাল অ্যানালাইসিস, সিনট্যাক্স অ্যানালাইসিস, সিম্বল টেবিল এবং কোড অপটিমাইজেশন।',
      enrolledStudents: DEMO_ENROLLED_STUDENTS,
      baseTotalClasses: 25,
      materials: [
        { id: 'mat-1', title: 'Lecture 01-03: Lexical Analysis & Lex Tools.pdf', fileType: 'pdf', fileSize: '2.4 MB', uploadDate: '2026-09-12', downloadUrl: '#' },
        { id: 'mat-2', title: 'Lecture 04-06: Context Free Grammars & Top-Down Parsing.pdf', fileType: 'pdf', fileSize: '3.1 MB', uploadDate: '2026-09-24', downloadUrl: '#' },
        { id: 'mat-3', title: 'Compiler Lab Manual & Bison Tutorial.pdf', fileType: 'pdf', fileSize: '1.8 MB', uploadDate: '2026-10-01', downloadUrl: '#' }
      ],
      announcements: [
        { id: 'ann-1', title: 'Midterm Exam Syllabus Coverage', content: 'Chapters 1 to 4 will be included in the Midterm examination scheduled for next week.', date: '2026-10-02', author: teacherName }
      ],
      attendanceSessions: buildInitialAttendanceSessions('CSE-3201'),
      marksSheet: buildInitialMarksSheet('CSE-3201', 'SUBMITTED', true)
    },

    // 2. CSE-3205: Assigned to Dr. Shahadat Hossain (Teacher) & Taken by Tanvir (Student)
    {
      id: 'cse-3205',
      code: 'CSE-3205',
      title: 'Software Engineering & Design Patterns',
      titleBn: 'সফটওয়্যার ইঞ্জিনিয়ারিং ও ডিজাইন প্যাটার্নস',
      credits: 3.0,
      semester: '6th Semester',
      semesterBn: '৬ষ্ঠ সেমিস্টার',
      department: 'CSE',
      instructor: teacherName,
      instructorEmail: teacherEmail,
      instructorUid: teacherUid,
      syllabusOverview: 'Agile methodologies, clean architecture, SOLID principles, Gang of Four design patterns, CI/CD pipelines.',
      syllabusOverviewBn: 'অ্যাজাইল মেথডোলজি, সফটওয়্যার আর্কিটেকচার, গ্যাং অব ফোর ডিজাইন প্যাটার্ন ও টেস্টিং।',
      enrolledStudents: DEMO_ENROLLED_STUDENTS,
      baseTotalClasses: 25,
      materials: [
        { id: 'mat-6', title: 'Creational & Structural Patterns Guide.pdf', fileType: 'pdf', fileSize: '2.9 MB', uploadDate: '2026-09-18', downloadUrl: '#' },
        { id: 'mat-7', title: 'Software Requirement Specification (SRS) Template.pdf', fileType: 'pdf', fileSize: '980 KB', uploadDate: '2026-09-29', downloadUrl: '#' }
      ],
      announcements: [
        { id: 'ann-3', title: 'Low Attendance Notice', content: 'Students with attendance below 75% will require Chairman approval before sitting for semester final exams.', date: '2026-10-01', author: teacherName }
      ],
      attendanceSessions: [
        {
          id: 'att-CSE-3205-01',
          date: '2026-09-28',
          topic: 'SOLID Principles in Practice',
          takenAt: '2026-09-28T10:45:00Z',
          records: DEMO_ENROLLED_STUDENTS.map((st) => ({
            studentId: st.studentId,
            status: st.studentId === 'JSTU2026001' ? 'absent' : 'present' // Tanvir absent in one class
          }))
        }
      ],
      marksSheet: buildInitialMarksSheet('CSE-3205', 'DRAFT', false)
    },

    // 3. CSE-1101: Assigned to Dr. Shahadat Hossain (Teacher) - 1st Semester course
    {
      id: 'cse-1101',
      code: 'CSE-1101',
      title: 'Structured Programming Language',
      titleBn: 'স্ট্রাকচার্ড প্রোগ্রামিং ল্যাঙ্গুয়েজ',
      credits: 3.0,
      semester: '1st Semester',
      semesterBn: '১ম সেমিস্টার',
      department: 'CSE',
      instructor: teacherName,
      instructorEmail: teacherEmail,
      instructorUid: teacherUid,
      syllabusOverview: 'C programming fundamentals, pointers, memory allocation, file I/O, recursion.',
      syllabusOverviewBn: 'সি প্রোগ্রামিং, পয়েন্টার, ডাইনামিক মেমরি অ্যালোকোশন এবং ফাইল অপারেশন।',
      enrolledStudents: [
        { studentId: 'JSTU2026101', rollNumber: '01', name: 'Hasan Mahmud', nameBn: 'হাসান মাহমুদ', email: 'hasan.2026101@jstu.ac.bd' },
        { studentId: 'JSTU2026102', rollNumber: '02', name: 'Nafisa Ali', nameBn: 'নাফিসা আলী', email: 'nafisa.2026102@jstu.ac.bd' },
        { studentId: 'JSTU2026103', rollNumber: '03', name: 'Kamran Habib', nameBn: 'কামরান হাবীব', email: 'kamran.2026103@jstu.ac.bd' }
      ],
      baseTotalClasses: 18,
      materials: [
        { id: 'mat-1101-1', title: 'C Syntax & Control Structures Handbook.pdf', fileType: 'pdf', fileSize: '1.9 MB', uploadDate: '2026-09-10', downloadUrl: '#' }
      ],
      announcements: [
        { id: 'ann-1101-1', title: 'Lab Evaluation 01 Notice', content: 'Hands-on pointers coding test will take place this Thursday.', date: '2026-10-01', author: teacherName }
      ],
      attendanceSessions: buildInitialAttendanceSessions('CSE-1101'),
      marksSheet: buildInitialMarksSheet('CSE-1101', 'VERIFIED', true)
    },

    // 4. CSE-3203: UNASSIGNED to Dr. Shahadat (Instructor: Dr. Syeda Fatima)
    {
      id: 'cse-3203',
      code: 'CSE-3203',
      title: 'Computer Networks',
      titleBn: 'কম্পিউটার নেটওয়ার্কস',
      credits: 3.0,
      semester: '6th Semester',
      semesterBn: '৬ষ্ঠ সেমিস্টার',
      department: 'CSE',
      instructor: 'Dr. Syeda Fatima',
      instructorEmail: 'fatima.cse@jstu.ac.bd',
      instructorUid: 'demo_faculty_fatima',
      syllabusOverview: 'OSI and TCP/IP reference architectures, routing protocols (OSPF, BGP), transport layer sockets, subnetting.',
      syllabusOverviewBn: 'ওএসআই এবং টিসিপি/আইপি স্থাপত্য, রাউটিং প্রটোকল, প্যাকেট স্যুইচিং এবং নেটওয়ার্ক নিরাপত্তা।',
      enrolledStudents: DEMO_ENROLLED_STUDENTS,
      baseTotalClasses: 25,
      materials: [
        { id: 'mat-4', title: 'Network Layers & Transport Architecture.pdf', fileType: 'pdf', fileSize: '4.2 MB', uploadDate: '2026-09-15', downloadUrl: '#' }
      ],
      announcements: [
        { id: 'ann-2', title: 'Lab Assignment 02 Deadline', content: 'Submit Packet Tracer topology screenshots before Thursday midnight.', date: '2026-10-03', author: 'Dr. Syeda Fatima' }
      ],
      attendanceSessions: buildInitialAttendanceSessions('CSE-3203'),
      marksSheet: buildInitialMarksSheet('CSE-3203', 'SUBMITTED', true)
    },

    // 5. CSE-3207: UNASSIGNED to Dr. Shahadat (Instructor: Dr. Nahid Sultana)
    {
      id: 'cse-3207',
      code: 'CSE-3207',
      title: 'Artificial Intelligence & Machine Learning',
      titleBn: 'আর্টিফিশিয়াল ইন্টেলিজেন্স ও মেশিন লার্নিং',
      credits: 3.0,
      semester: '6th Semester',
      semesterBn: '৬ষ্ঠ সেমিস্টার',
      department: 'CSE',
      instructor: 'Dr. Nahid Sultana',
      instructorEmail: 'nahid.cse@jstu.ac.bd',
      instructorUid: 'demo_faculty_nahid',
      syllabusOverview: 'Search algorithms (A*, minimax), supervised & unsupervised learning, neural network fundamentals, NLP basics.',
      syllabusOverviewBn: 'সার্চ অ্যালগরিদম, রিগ্রেশন, ক্লাসিফিকেশন, নিউরাল নেটওয়ার্ক এবং ন্যাচারাল ল্যাঙ্গুয়েজ প্রসেসিং।',
      enrolledStudents: DEMO_ENROLLED_STUDENTS,
      baseTotalClasses: 25,
      materials: [
        { id: 'mat-8', title: 'Heuristic Search & Game Playing.pdf', fileType: 'pdf', fileSize: '3.5 MB', uploadDate: '2026-09-10', downloadUrl: '#' }
      ],
      announcements: [],
      attendanceSessions: buildInitialAttendanceSessions('CSE-3207'),
      marksSheet: buildInitialMarksSheet('CSE-3207', 'DRAFT', true)
    },

    // 6. EEE-2101: Different Department (EEE) to test Chairman Department Scope
    {
      id: 'eee-2101',
      code: 'EEE-2101',
      title: 'Electrical Circuits & Network Analysis',
      titleBn: 'ইলেকট্রিক্যাল সার্কিটস ও নেটওয়ার্ক অ্যানালাইসিস',
      credits: 3.0,
      semester: '3rd Semester',
      semesterBn: '৩য় সেমিস্টার',
      department: 'EEE',
      instructor: 'Prof. Dr. Farhan Tanvir (EEE)',
      instructorEmail: 'farhan.eee@jstu.ac.bd',
      instructorUid: 'demo_faculty_eee',
      syllabusOverview: 'Mesh and nodal analysis, Thevenin and Norton theorems, AC sinusoidal steady-state analysis.',
      syllabusOverviewBn: 'মেশ ও নোডাল অ্যানালাইসিস, থেভেনিন ও নরটন উপপাদ্য এবং এসি সার্কিট।',
      enrolledStudents: [
        { studentId: 'JSTU2025201', rollNumber: '01', name: 'Zubair Hossain', nameBn: 'জুবায়ের হোসেন', email: 'zubair.2025201@jstu.ac.bd' },
        { studentId: 'JSTU2025202', rollNumber: '02', name: 'Nabila Karim', nameBn: 'নাবিলা করিম', email: 'nabila.2025202@jstu.ac.bd' }
      ],
      baseTotalClasses: 22,
      materials: [],
      announcements: [],
      attendanceSessions: [],
      marksSheet: buildInitialMarksSheet('EEE-2101', 'SUBMITTED', true)
    }
  ];

  const assignments: SharedAssignment[] = [
    {
      id: 'asg-1',
      courseCode: 'CSE-3201',
      courseTitle: 'Compiler Design',
      title: 'Assignment 02: Lexical Analyzer using Flex for C subset',
      description: 'Implement a lexical scanner using Flex that extracts keywords, identifiers, numeric literals, and multi-line comments. Provide output token stream.',
      dueDate: '2026-10-14T23:59:59Z',
      maxMarks: 20,
      createdAt: '2026-10-01T10:00:00Z',
      createdBy: teacherName,
      submissions: [
        {
          id: 'sub-asg1-02',
          assignmentId: 'asg-1',
          studentId: 'JSTU2026002',
          studentName: 'Sadia Afrin',
          studentEmail: 'sadia.2026002@jstu.ac.bd',
          submittedAt: '2026-10-04T12:30:00Z',
          fileName: 'Sadia_JSTU2026002_Lexical_Flex.pdf',
          fileSize: '1.2 MB',
          fileUrl: '#',
          status: 'submitted'
        },
        {
          id: 'sub-asg1-03',
          assignmentId: 'asg-1',
          studentId: 'JSTU2026003',
          studentName: 'Mahmudur Rahman',
          studentEmail: 'mahmud.2026003@jstu.ac.bd',
          submittedAt: '2026-10-04T15:10:00Z',
          fileName: 'Mahmud_JSTU2026003_Scanner.pdf',
          fileSize: '2.1 MB',
          fileUrl: '#',
          status: 'submitted'
        }
      ]
    },
    {
      id: 'asg-3',
      courseCode: 'CSE-3205',
      courseTitle: 'Software Engineering',
      title: 'Assignment 01: Requirement Analysis & Class Diagram',
      description: 'Develop full UML Use Case and Class diagrams for the JSTU Smart Paperless Campus Clearance workflow adhering to SOLID principles.',
      dueDate: '2026-09-25T23:59:59Z',
      maxMarks: 20,
      createdAt: '2026-09-15T09:00:00Z',
      createdBy: teacherName,
      submissions: [
        {
          id: 'sub-asg3-01',
          assignmentId: 'asg-3',
          studentId: 'JSTU2026001',
          studentName: 'Tanvir Ahmed',
          studentEmail: 'student.demo@jstu.ac.bd',
          submittedAt: '2026-09-24T18:45:00Z',
          fileName: 'Tanvir_JSTU2026001_SE_UML_SRS.pdf',
          fileSize: '2.1 MB',
          fileUrl: '#',
          status: 'graded',
          score: 18.5,
          feedback: 'Excellent adherence to SOLID principles and comprehensive boundary-control-entity class structure.',
          gradedAt: '2026-09-27T14:00:00Z'
        },
        {
          id: 'sub-asg3-02',
          assignmentId: 'asg-3',
          studentId: 'JSTU2026002',
          studentName: 'Sadia Afrin',
          studentEmail: 'sadia.2026002@jstu.ac.bd',
          submittedAt: '2026-09-24T20:10:00Z',
          fileName: 'Sadia_JSTU2026002_SE_ClassDiagram.pdf',
          fileSize: '1.8 MB',
          fileUrl: '#',
          status: 'submitted'
        }
      ]
    }
  ];

  const routine: Record<string, ClassScheduleItem[]> = {
    Sunday: [
      { id: 'r-1', day: 'Sunday', timeSlot: '09:00 AM - 10:20 AM', courseCode: 'CSE-3201', courseTitle: 'Compiler Design', room: 'Academic Building 2, Room 402', instructor: teacherName },
      { id: 'r-2', day: 'Sunday', timeSlot: '10:30 AM - 11:50 AM', courseCode: 'CSE-3203', courseTitle: 'Computer Networks', room: 'Academic Building 2, Room 402', instructor: 'Dr. Syeda Fatima' },
      { id: 'r-3', day: 'Sunday', timeSlot: '02:00 PM - 04:30 PM', courseCode: 'CSE-3208', courseTitle: 'AI Lab', room: 'Computer Lab 3 (Ground Floor)', instructor: 'Dr. Nahid Sultana' }
    ],
    Monday: [
      { id: 'r-4', day: 'Monday', timeSlot: '09:00 AM - 10:20 AM', courseCode: 'CSE-3207', courseTitle: 'Artificial Intelligence', room: 'Academic Building 2, Room 402', instructor: 'Dr. Nahid Sultana' },
      { id: 'r-5', day: 'Monday', timeSlot: '10:30 AM - 11:50 AM', courseCode: 'CSE-3205', courseTitle: 'Software Engineering', room: 'Academic Building 2, Room 402', instructor: teacherName }
    ],
    Tuesday: [
      { id: 'r-6', day: 'Tuesday', timeSlot: '09:00 AM - 10:20 AM', courseCode: 'CSE-3201', courseTitle: 'Compiler Design', room: 'Academic Building 2, Room 402', instructor: teacherName },
      { id: 'r-7', day: 'Tuesday', timeSlot: '10:30 AM - 11:50 AM', courseCode: 'CSE-3203', courseTitle: 'Computer Networks', room: 'Academic Building 2, Room 402', instructor: 'Dr. Syeda Fatima' }
    ],
    Wednesday: [
      { id: 'r-9', day: 'Wednesday', timeSlot: '09:00 AM - 10:20 AM', courseCode: 'CSE-3207', courseTitle: 'Artificial Intelligence', room: 'Academic Building 2, Room 402', instructor: 'Dr. Nahid Sultana' },
      { id: 'r-10', day: 'Wednesday', timeSlot: '10:30 AM - 11:50 AM', courseCode: 'CSE-3205', courseTitle: 'Software Engineering', room: 'Academic Building 2, Room 402', instructor: teacherName }
    ],
    Thursday: [
      { id: 'r-11', day: 'Thursday', timeSlot: '10:00 AM - 12:00 PM', courseCode: 'CSE-1101', courseTitle: 'Structured Programming', room: 'Academic Building 1, Room 204', instructor: teacherName }
    ]
  };

  const teacherRoutine: SharedStoreData['teacherRoutine'] = {
    Sunday: [
      { id: 'tr-1', day: 'Sunday', timeSlot: '09:00 AM - 10:20 AM', courseCode: 'CSE-3201', courseTitle: 'Compiler Design (6th Sem)', room: 'Academic Building 2, Room 402', enrolledCount: 12 }
    ],
    Monday: [
      { id: 'tr-2', day: 'Monday', timeSlot: '10:30 AM - 11:50 AM', courseCode: 'CSE-3205', courseTitle: 'Software Engineering (6th Sem)', room: 'Academic Building 2, Room 402', enrolledCount: 12 },
      { id: 'tr-3', day: 'Monday', timeSlot: '02:00 PM - 03:30 PM', courseCode: 'CSE-1101', courseTitle: 'Structured Programming (1st Sem)', room: 'Academic Building 1, Room 204', enrolledCount: 3 }
    ],
    Tuesday: [
      { id: 'tr-4', day: 'Tuesday', timeSlot: '09:00 AM - 10:20 AM', courseCode: 'CSE-3201', courseTitle: 'Compiler Design (6th Sem)', room: 'Academic Building 2, Room 402', enrolledCount: 12 }
    ],
    Wednesday: [
      { id: 'tr-5', day: 'Wednesday', timeSlot: '10:30 AM - 11:50 AM', courseCode: 'CSE-3205', courseTitle: 'Software Engineering (6th Sem)', room: 'Academic Building 2, Room 402', enrolledCount: 12 }
    ],
    Thursday: [
      { id: 'tr-6', day: 'Thursday', timeSlot: '10:00 AM - 12:00 PM', courseCode: 'CSE-1101', courseTitle: 'Structured Programming (1st Sem)', room: 'Academic Building 1, Room 204', enrolledCount: 3 }
    ]
  };

  const results: SemesterResult[] = [
    {
      semesterNumber: 1,
      semesterName: '1st Semester (1st Year 1st Term)',
      semesterNameBn: '১ম সেমিস্টার (১ম বর্ষ ১ম টার্ম)',
      session: '2023-2024',
      status: 'published',
      totalCredits: 20.5,
      earnedCredits: 20.5,
      sgpa: 3.82,
      cumulativeCgpa: 3.82,
      courses: [
        { code: 'CSE-1101', title: 'Structured Programming', titleBn: 'স্ট্রাকচার্ড প্রোগ্রামিং', credits: 3.0, marks: 84, letterGrade: 'A+', gradePoint: 4.00 }
      ]
    }
  ];

  const feeBreakdown: FeeBreakdown = {
    studentId: 'JSTU2026001',
    currentSemester: '6th Semester (Fall 2026)',
    totalPayable: 14200,
    totalPaid: 9500,
    totalDue: 4700,
    invoices: [
      {
        id: 'inv-101',
        invoiceNumber: 'INV-2026-6S-01',
        title: '6th Semester Tuition & Laboratory Fee',
        titleBn: '৬ষ্ঠ সেমিস্টার টিউশন ও ল্যাবরেটরি ফি',
        category: 'Tuition',
        amount: 6500,
        dueDate: '2026-09-15',
        status: 'paid',
        paidAt: '2026-09-10T14:32:00Z',
        transactionId: 'TXN-BKASH-9X87123A',
        paymentMethod: 'bKash Online'
      },
      {
        id: 'inv-103',
        invoiceNumber: 'INV-2026-6S-03',
        title: 'Semester Final Examination Fee (Fall 2026)',
        titleBn: 'সেমিস্টার ফাইনাল পরীক্ষা ফি (ফল ২০২৬)',
        category: 'Exam',
        amount: 4700,
        dueDate: '2026-10-20',
        status: 'unpaid'
      }
    ]
  };

  const studentNotifications: StudentNotification[] = [
    {
      id: 'notif-1',
      title: 'Admit Card Clearance Window Open',
      titleBn: 'প্রবেশপত্র ক্লিয়ারেন্স উইন্ডো উন্মুক্ত',
      message: 'Students are advised to clear outstanding semester examination fees before 20 October 2026.',
      messageBn: 'পরীক্ষার প্রবেশপত্র পেতে আগামী ২০ অক্টোবরের মধ্যে বকেয়া ফি পরিশোধ করুন।',
      category: 'fee',
      timestamp: '2026-10-04T09:00:00Z',
      read: false,
      link: '/student/fees'
    },
    {
      id: 'notif-2',
      title: 'Compiler Design Assignment 02 Released',
      titleBn: 'কম্পাইলার ডিজাইন অ্যাসাইনমেন্ট ০২ প্রকাশ',
      message: 'Assignment 02 on Lexical Analyzer with Flex has been posted by Dr. Shahadat Hossain. Due: 14 Oct 2026.',
      messageBn: 'ড. শাহাদাত হোসেন ফ্লেক্স দিয়ে লেক্সিক্যাল অ্যানালাইজার তৈরির অ্যাসাইনমেন্ট জমা দেওয়ার শেষ তারিখ ১৪ অক্টোবর নির্ধারণ করেছেন।',
      category: 'academic',
      timestamp: '2026-10-02T14:20:00Z',
      read: false,
      link: '/student/assignments'
    }
  ];

  const teacherNotifications: SharedStoreData['teacherNotifications'] = [
    {
      id: 't-notif-1',
      title: 'New Assignment Submissions Ready for Evaluation',
      titleBn: 'মূল্যায়নের জন্য নতুন অ্যাসাইনমেন্ট জমা পড়েছে',
      message: 'Sadia Afrin & Mahmudur Rahman submitted solutions for CSE-3201 Assignment 02.',
      messageBn: 'সাদিয়া আফরিন ও মাহমুদুর রহমান সিএসই-৩২০১ অ্যাসাইনমেন্ট ২ এর সমাধান জমা দিয়েছেন।',
      category: 'submission',
      timestamp: '2026-10-04T15:15:00Z',
      read: false,
      link: '/teacher/assignments'
    },
    {
      id: 't-notif-2',
      title: 'Continuous Assessment Marks Entry Window Active',
      titleBn: 'ধারাবাহিক মূল্যায়ন মার্কস এন্ট্রি উন্মুক্ত',
      message: 'Dept. of CSE Chairman has opened continuous marks entry for 6th Semester Fall 2026.',
      messageBn: 'সিএসই বিভাগের চেয়ারম্যান ফল ২০২৬ এর ধারাবাহিক মূল্যায়নের মার্কস এন্ট্রি অনুমোদন করেছেন।',
      category: 'marks',
      timestamp: '2026-10-02T08:30:00Z',
      read: true,
      link: '/teacher/marks'
    }
  ];

  return {
    students: {
      'JSTU2026001': studentProfile
    },
    teacherProfile,
    courses,
    assignments,
    routine,
    teacherRoutine,
    results,
    feeBreakdown,
    studentNotifications,
    applications: [
      {
        id: 'app-transcript-01',
        applicationNumber: 'JSTU-APP-2026-100234',
        type: 'transcript',
        title: 'Official Academic Transcript Request',
        titleBn: 'অফিসিয়াল একাডেমিক ট্রান্সক্রিপ্ট আবেদন',
        studentUid: 'demo_student_01',
        studentId: 'JSTU2026001',
        studentName: 'Tanvir Ahmed',
        studentNameBn: 'তানভীর আহমেদ',
        studentEmail: 'student.demo@jstu.ac.bd',
        studentDepartment: 'CSE',
        status: 'UNDER_REVIEW',
        currentStepIndex: 0,
        chain: [
          { stepIndex: 0, role: 'dept_chairman', title: 'Department Chairman', titleBn: 'বিভাগীয় চেয়ারম্যান', departmentScoped: true },
          { stepIndex: 1, role: 'exam_controller', title: 'Controller of Examinations', titleBn: 'পরীক্ষা নিয়ন্ত্রক', officeScoped: 'EXAM_CONTROLLER' },
          { stepIndex: 2, role: 'registrar', title: 'Registrar', titleBn: 'রেজিস্ট্রার', officeScoped: 'REGISTRAR' }
        ],
        formData: {
          transcriptType: 'partial',
          copiesCount: 2,
          purpose: 'Higher study application submission for graduate studies.',
          deliveryMode: 'counter'
        },
        createdAt: '2026-10-04T09:30:00Z',
        updatedAt: '2026-10-04T09:30:00Z',
        auditTrail: [
          {
            id: 'audit-app-1',
            applicationId: 'app-transcript-01',
            applicationNumber: 'JSTU-APP-2026-100234',
            actorUid: 'demo_student_01',
            actorName: 'Tanvir Ahmed',
            actorEmail: 'student.demo@jstu.ac.bd',
            role: 'student',
            action: 'SUBMIT',
            fromStatus: 'DRAFT',
            toStatus: 'UNDER_REVIEW',
            fromStepIndex: 0,
            toStepIndex: 0,
            comment: 'Application submitted with required academic justification.',
            timestamp: '2026-10-04T09:30:00Z'
          }
        ]
      },
      {
        id: 'app-testimonial-01',
        applicationNumber: 'JSTU-APP-2026-100235',
        type: 'testimonial',
        title: 'Character & Academic Testimonial',
        titleBn: 'চারিত্রিক ও একাডেমিক প্রশংসাপত্র আবেদন',
        studentUid: 'demo_student_01',
        studentId: 'JSTU2026001',
        studentName: 'Tanvir Ahmed',
        studentNameBn: 'তানভীর আহমেদ',
        studentEmail: 'student.demo@jstu.ac.bd',
        studentDepartment: 'CSE',
        status: 'APPROVED',
        currentStepIndex: 1,
        chain: [
          { stepIndex: 0, role: 'dept_chairman', title: 'Department Chairman', titleBn: 'বিভাগীয় চেয়ারম্যান', departmentScoped: true }
        ],
        formData: {
          purpose: 'internship',
          extraActivities: 'Executive Member, JSTU Computer Club; ICPC Regional Contestant.'
        },
        createdAt: '2026-10-02T10:15:00Z',
        updatedAt: '2026-10-03T14:20:00Z',
        completedAt: '2026-10-03T14:20:00Z',
        auditTrail: [
          {
            id: 'audit-app-2a',
            applicationId: 'app-testimonial-01',
            applicationNumber: 'JSTU-APP-2026-100235',
            actorUid: 'demo_student_01',
            actorName: 'Tanvir Ahmed',
            actorEmail: 'student.demo@jstu.ac.bd',
            role: 'student',
            action: 'SUBMIT',
            fromStatus: 'DRAFT',
            toStatus: 'UNDER_REVIEW',
            fromStepIndex: 0,
            toStepIndex: 0,
            comment: 'Submitted for industrial attachment verification.',
            timestamp: '2026-10-02T10:15:00Z'
          },
          {
            id: 'audit-app-2b',
            applicationId: 'app-testimonial-01',
            applicationNumber: 'JSTU-APP-2026-100235',
            actorUid: 'demo_chairman_01',
            actorName: 'Prof. Dr. Chairman CSE',
            actorEmail: 'chairman.demo@jstu.ac.bd',
            role: 'dept_chairman',
            action: 'APPROVE',
            fromStatus: 'UNDER_REVIEW',
            toStatus: 'APPROVED',
            fromStepIndex: 0,
            toStepIndex: 1,
            comment: 'Testimonial approved. Excellent academic standing and exemplary conduct.',
            timestamp: '2026-10-03T14:20:00Z'
          }
        ]
      }
    ],
    teacherNotifications,
    digitalDocuments: [
      {
        id: 'doc-testimonial-01',
        verificationId: '7f9c2d1b8e4a3f65021c9b8a7d6e5f41',
        applicationId: 'app-testimonial-01',
        applicationNumber: 'JSTU-APP-2026-100235',
        documentType: 'testimonial',
        title: 'Character & Academic Conduct Testimonial',
        titleBn: 'চারিত্রিক ও একাডেমিক প্রশংসাপত্র',
        studentUid: 'demo_student_01',
        studentId: 'JSTU2026001',
        studentName: 'Tanvir Ahmed',
        studentNameBn: 'তানভীর আহমেদ',
        studentDepartment: 'CSE',
        program: 'B.Sc. in Computer Science & Engineering',
        canonicalHash: 'a7991c915f11ed92ef0213206df6c3e2249d05fdc1595b79dec2dec136fd50c1',
        canonicalPayload: {
          verificationId: '7f9c2d1b8e4a3f65021c9b8a7d6e5f41',
          documentType: 'testimonial',
          applicationNumber: 'JSTU-APP-2026-100235',
          studentId: 'JSTU2026001',
          studentName: 'Tanvir Ahmed',
          department: 'CSE',
          issueDate: '2026-10-03T14:20:00Z',
          summaryData: {
            purpose: 'Industrial Attachment / Internship',
            conduct: 'Exemplary'
          }
        },
        verificationUrl: '/verify/7f9c2d1b8e4a3f65021c9b8a7d6e5f41',
        issueDate: '2026-10-03T14:20:00Z',
        issuerRole: 'dept_chairman',
        issuerUid: 'demo_chairman_01',
        issuerName: 'Prof. Dr. Chairman CSE',
        status: 'VALID',
        contentPayload: {
          purpose: 'Industrial Attachment / Internship',
          recommendation: 'Testimonial approved. Excellent academic standing and exemplary conduct.'
        },
        createdAt: '2026-10-03T14:20:00Z',
        updatedAt: '2026-10-03T14:20:00Z'
      },
      {
        id: 'doc-eee-testimonial-01',
        verificationId: '8a1c3d2b9e5f4g76132d0c9b8e7f6a52',
        applicationId: 'app-eee-testimonial-01',
        applicationNumber: 'JSTU-APP-2026-100237',
        documentType: 'testimonial',
        title: 'Character & Conduct Testimonial',
        titleBn: 'চারিত্রিক ও আচার-ব্যবহার প্রশংসাপত্র',
        studentUid: 'demo_student_eee_01',
        studentId: 'JSTU2025201',
        studentName: 'Zubair Hossain',
        studentNameBn: 'জুবায়ের হোসেন',
        studentDepartment: 'EEE',
        program: 'B.Sc. in Electrical & Electronic Engineering',
        canonicalHash: 'b8112d026f22fe03ef132417eef7d4e3350e160e1606c80efd3efd247fe61d12',
        canonicalPayload: {
          verificationId: '8a1c3d2b9e5f4g76132d0c9b8e7f6a52',
          documentType: 'testimonial',
          applicationNumber: 'JSTU-APP-2026-100237',
          studentId: 'JSTU2025201',
          studentName: 'Zubair Hossain',
          department: 'EEE',
          issueDate: '2026-09-19T14:00:00Z',
          summaryData: {
            purpose: 'Industrial Training at DESCO',
            conduct: 'Good'
          }
        },
        verificationUrl: '/verify/8a1c3d2b9e5f4g76132d0c9b8e7f6a52',
        issueDate: '2026-09-19T14:00:00Z',
        issuerRole: 'dept_chairman',
        issuerUid: 'demo_chairman_eee',
        issuerName: 'Prof. Dr. Chairman EEE',
        status: 'VALID',
        contentPayload: {
          purpose: 'Industrial Training at DESCO',
          recommendation: 'Approved for institutional internship.'
        },
        createdAt: '2026-09-19T14:00:00Z',
        updatedAt: '2026-09-19T14:00:00Z'
      }
    ],
    accountRequests: [
      {
        id: 'req_demo_01',
        referenceNumber: 'JSTU-REQ-2026-891041',
        fullName: 'Sultan Mahmud',
        studentId: 'JSTU2026045',
        role: 'student',
        department: 'CSE',
        session: '2022-2023',
        email: 'sultan.mahmud@jstu.ac.bd',
        phone: '+880 1712-345678',
        note: 'Newly enrolled 6th semester undergraduate. Need portal access for course registration and routine.',
        status: 'PENDING',
        createdAt: '2026-10-08T09:30:00Z'
      },
      {
        id: 'req_demo_02',
        referenceNumber: 'JSTU-REQ-2026-891052',
        fullName: 'Mehnaz Tabassum',
        studentId: 'JSTU2026092',
        role: 'student',
        department: 'EEE',
        session: '2023-2024',
        email: 'mehnaz.tabassum@jstu.ac.bd',
        phone: '+880 1819-456789',
        note: 'Newly admitted student in EEE department. Requesting student account activation.',
        status: 'PENDING',
        createdAt: '2026-10-08T11:15:00Z'
      },
      {
        id: 'req_demo_03',
        referenceNumber: 'JSTU-REQ-2026-891013',
        fullName: 'Kazi Farhan',
        studentId: 'JSTU2026999',
        role: 'student',
        department: 'MATH',
        session: '2021-2022',
        email: 'kazi.farhan@gmail.com',
        phone: '+880 1611-112233',
        note: 'Seeking access to library catalog and campus portal.',
        status: 'REJECTED',
        rejectionReason: 'Invalid student ID verification against university registrar database.',
        reviewedAt: '2026-10-07T14:20:00Z',
        reviewedBy: 'mock_admin_uid',
        reviewerName: 'Academic Registrar Admin',
        createdAt: '2026-10-07T10:00:00Z'
      }
    ],
    simulatedEmailLogs: [
      {
        id: 'sim_email_init_01',
        recipientEmail: 'sultan.mahmud@jstu.ac.bd',
        recipientName: 'Sultan Mahmud',
        subject: '[SIMULATED EMAIL - DEMO MODE] JSTU Student Account Request Received (JSTU-REQ-2026-891041)',
        body: 'Dear Sultan Mahmud, your account request (Ref: JSTU-REQ-2026-891041) has been received. You can track status on the portal.',
        sentAt: '2026-10-08T09:30:00Z',
        referenceNumber: 'JSTU-REQ-2026-891041',
        actionType: 'SUBMITTED'
      }
    ],
    activationTokens: [],
    libraryBooks: initialBooksData,
    libraryBorrowings: initialBorrowingsData,
    libraryReservations: initialReservationsData,
    hallApplications: initialHallApplicationsData,
    clubApplications: [],
    sportsBookings: [],
    medicalAppointments: [],
    alumniRegistrations: initialAlumniRegistrationsData,
    managedNotices: initialManagedNotices,
    managedNews: initialManagedNews,
    managedEvents: initialManagedEvents,
    managedGallery: initialManagedGallery,
    managedDownloads: initialManagedDownloads,
    managedDepartments: initialManagedDepartments,
    managedFaculty: initialManagedFaculty,
    managedVcMessage: initialManagedVcMessage,
    managedStaticPages: initialManagedStaticPages,
    contentAuditTrail: initialContentAuditTrail,
    studentIdCards: initialStudentIdCards
  };
}

export class SharedDataStoreManager {
  private static instance: SharedDataStoreManager | null = null;
  private inMemoryStore: SharedStoreData | null = null;

  public static getInstance(): SharedDataStoreManager {
    if (!SharedDataStoreManager.instance) {
      SharedDataStoreManager.instance = new SharedDataStoreManager();
    }
    return SharedDataStoreManager.instance;
  }

  public getStore(): SharedStoreData {
    if (typeof window === 'undefined') {
      if (!this.inMemoryStore) {
        this.inMemoryStore = getInitialSharedStoreData();
      }
      return this.inMemoryStore;
    }

    try {
      const stored = localStorage.getItem(SHARED_STORAGE_KEY);
      if (!stored) {
        const initial = this.inMemoryStore || getInitialSharedStoreData();
        this.inMemoryStore = initial;
        try {
          localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(initial));
        } catch {
          // in-memory fallback
        }
        return initial;
      }
      const parsed = JSON.parse(stored);
      if (!parsed.applications) {
        parsed.applications = getInitialSharedStoreData().applications;
      }
      if (!parsed.digitalDocuments) {
        parsed.digitalDocuments = getInitialSharedStoreData().digitalDocuments;
      }
      if (!parsed.accountRequests) {
        parsed.accountRequests = getInitialSharedStoreData().accountRequests;
      }
      if (!parsed.simulatedEmailLogs) {
        parsed.simulatedEmailLogs = getInitialSharedStoreData().simulatedEmailLogs;
      }
      if (!parsed.activationTokens) {
        parsed.activationTokens = [];
      }
      if (!parsed.libraryBooks || !Array.isArray(parsed.libraryBooks) || parsed.libraryBooks.length === 0) {
        parsed.libraryBooks = getInitialSharedStoreData().libraryBooks;
      }
      if (!parsed.libraryBorrowings || !Array.isArray(parsed.libraryBorrowings)) {
        parsed.libraryBorrowings = getInitialSharedStoreData().libraryBorrowings;
      }
      if (!parsed.libraryReservations || !Array.isArray(parsed.libraryReservations)) {
        parsed.libraryReservations = getInitialSharedStoreData().libraryReservations;
      }
      if (!parsed.hallApplications || !Array.isArray(parsed.hallApplications)) {
        parsed.hallApplications = getInitialSharedStoreData().hallApplications;
      }
      if (!parsed.clubApplications || !Array.isArray(parsed.clubApplications)) {
        parsed.clubApplications = [];
      }
      if (!parsed.sportsBookings || !Array.isArray(parsed.sportsBookings)) {
        parsed.sportsBookings = [];
      }
      if (!parsed.medicalAppointments || !Array.isArray(parsed.medicalAppointments)) {
        parsed.medicalAppointments = [];
      }
      if (!parsed.alumniRegistrations || !Array.isArray(parsed.alumniRegistrations)) {
        parsed.alumniRegistrations = getInitialSharedStoreData().alumniRegistrations;
      }
      if (!parsed.managedNotices || !Array.isArray(parsed.managedNotices) || parsed.managedNotices.length === 0) {
        parsed.managedNotices = getInitialSharedStoreData().managedNotices;
      }
      if (!parsed.managedNews || !Array.isArray(parsed.managedNews) || parsed.managedNews.length === 0) {
        parsed.managedNews = getInitialSharedStoreData().managedNews;
      }
      if (!parsed.managedEvents || !Array.isArray(parsed.managedEvents) || parsed.managedEvents.length === 0) {
        parsed.managedEvents = getInitialSharedStoreData().managedEvents;
      }
      if (!parsed.managedGallery || !Array.isArray(parsed.managedGallery) || parsed.managedGallery.length === 0) {
        parsed.managedGallery = getInitialSharedStoreData().managedGallery;
      }
      if (!parsed.managedDownloads || !Array.isArray(parsed.managedDownloads) || parsed.managedDownloads.length === 0) {
        parsed.managedDownloads = getInitialSharedStoreData().managedDownloads;
      }
      if (!parsed.managedDepartments || !Array.isArray(parsed.managedDepartments) || parsed.managedDepartments.length === 0) {
        parsed.managedDepartments = getInitialSharedStoreData().managedDepartments;
      } else {
        parsed.managedDepartments = parsed.managedDepartments.map((d: any) => {
          if (!d.degreesOffered || !Array.isArray(d.degreesOffered) || d.degreesOffered.length === 0) {
            const seed = initialManagedDepartments.find(
              (sd: ManagedDepartmentItem) => sd.id.toLowerCase() === (d.id || '').toLowerCase() || sd.code.toLowerCase() === (d.code || '').toLowerCase()
            );
            return {
              ...d,
              degreesOffered: seed?.degreesOffered || ['B.Sc. (Engg.) in ' + (d.name || 'Engineering')],
              degreesOfferedBn: seed?.degreesOfferedBn || ['বি.এস-সি. (ইঞ্জিনিয়ারিং)']
            };
          }
          return d;
        });
      }
      if (!parsed.managedFaculty || !Array.isArray(parsed.managedFaculty) || parsed.managedFaculty.length === 0) {
        parsed.managedFaculty = getInitialSharedStoreData().managedFaculty;
      }
      if (!parsed.managedVcMessage || typeof parsed.managedVcMessage !== 'object' || !parsed.managedVcMessage.speech) {
        parsed.managedVcMessage = getInitialSharedStoreData().managedVcMessage;
      }
      if (!parsed.managedStaticPages || !Array.isArray(parsed.managedStaticPages) || parsed.managedStaticPages.length === 0) {
        parsed.managedStaticPages = getInitialSharedStoreData().managedStaticPages;
      }
      if (!parsed.contentAuditTrail || !Array.isArray(parsed.contentAuditTrail)) {
        parsed.contentAuditTrail = getInitialSharedStoreData().contentAuditTrail;
      }
      if (!parsed.studentIdCards || !Array.isArray(parsed.studentIdCards) || parsed.studentIdCards.length === 0) {
        parsed.studentIdCards = getInitialSharedStoreData().studentIdCards;
      }
      this.inMemoryStore = parsed;
      return parsed;
    } catch {
      // In-memory fallback if localStorage is blocked
      if (!this.inMemoryStore) {
        this.inMemoryStore = getInitialSharedStoreData();
      }
      return this.inMemoryStore;
    }
  }

  public saveStore(data: SharedStoreData): void {
    this.inMemoryStore = data;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(data));
      }
    } catch {
      // Storage blocked; inMemoryStore already saved above
    }
  }

  public resetStore(): void {
    this.inMemoryStore = getInitialSharedStoreData();
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(SHARED_STORAGE_KEY);
        localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(this.inMemoryStore));
      }
    } catch {
      // Storage blocked; inMemoryStore already reset above
    }
  }

  // --- Library Domain Operations ---

  public reserveBook(params: {
    studentId: string;
    studentName: string;
    studentRoll: string;
    bookId: string;
  }): { success: boolean; reservation?: BookReservation; message: string } {
    const store = this.getStore();
    const book = store.libraryBooks.find((b) => b.id === params.bookId);
    if (!book) {
      return { success: false, message: 'Book not found in library catalog.' };
    }

    const existingReservation = store.libraryReservations.find(
      (r) => r.bookId === params.bookId && r.studentId === params.studentId && r.status === 'pending'
    );
    if (existingReservation) {
      return { success: false, message: 'You already have an active reservation for this book.' };
    }

    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + 7);

    const pendingCount = store.libraryReservations.filter((r) => r.bookId === params.bookId && r.status === 'pending').length;

    const newReservation: BookReservation = {
      id: `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      bookId: book.id,
      bookTitle: book.title,
      bookTitleBn: book.titleBn,
      studentId: params.studentId,
      studentName: params.studentName,
      studentRoll: params.studentRoll,
      reservedAt: now.toISOString(),
      expiryDate: expiry.toISOString().split('T')[0],
      status: 'pending',
      priorityPosition: pendingCount + 1
    };

    store.libraryReservations.unshift(newReservation);
    this.saveStore(store);
    return { success: true, reservation: newReservation, message: 'Book reserved successfully! You will be notified when ready.' };
  }

  public cancelReservation(reservationId: string): boolean {
    const store = this.getStore();
    const idx = store.libraryReservations.findIndex((r) => r.id === reservationId);
    if (idx === -1) return false;
    store.libraryReservations[idx].status = 'cancelled';
    this.saveStore(store);
    return true;
  }

  public renewBorrowing(borrowingId: string): { success: boolean; borrowing?: BookBorrowing; message: string } {
    const store = this.getStore();
    const borrowing = store.libraryBorrowings.find((b) => b.id === borrowingId);
    if (!borrowing) {
      return { success: false, message: 'Borrowing record not found.' };
    }
    if (borrowing.status === 'returned') {
      return { success: false, message: 'Cannot renew a book that has already been returned.' };
    }
    if (borrowing.renewalCount >= 2) {
      return { success: false, message: 'Maximum renewal limit (2 times) reached. Please return the book to the counter.' };
    }

    const currentDue = new Date(borrowing.dueDate);
    currentDue.setDate(currentDue.getDate() + 14); // extend 14 days
    borrowing.dueDate = currentDue.toISOString().split('T')[0];
    borrowing.renewalCount += 1;
    borrowing.status = 'active'; // clear overdue if renewed
    borrowing.fineAmount = 0;

    this.saveStore(store);
    return { success: true, borrowing, message: `Successfully renewed until ${borrowing.dueDate}.` };
  }

  public issueBook(params: {
    bookId: string;
    studentId: string;
    studentName: string;
    studentRoll: string;
    dueDateDays?: number;
    officerName?: string;
  }): { success: boolean; borrowing?: BookBorrowing; message: string } {
    const store = this.getStore();
    const book = store.libraryBooks.find((b) => b.id === params.bookId);
    if (!book) return { success: false, message: 'Book not found.' };
    if (book.availableCopies <= 0) {
      return { success: false, message: 'No copies currently available on shelf.' };
    }

    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + (params.dueDateDays || 21));

    const newBorrowing: BookBorrowing = {
      id: `bor-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookTitleBn: book.titleBn,
      bookIsbn: book.isbn,
      callNumber: book.callNumber,
      studentId: params.studentId,
      studentName: params.studentName,
      studentRoll: params.studentRoll,
      issueDate: today.toISOString().split('T')[0],
      dueDate: due.toISOString().split('T')[0],
      status: 'active',
      renewalCount: 0,
      fineAmount: 0,
      issuedBy: params.officerName || 'Syed Nurul Huda (Library Officer)'
    };

    book.availableCopies = Math.max(0, book.availableCopies - 1);
    store.libraryBorrowings.unshift(newBorrowing);

    // If student had a reservation, fulfill it
    const res = store.libraryReservations.find(
      (r) => r.bookId === params.bookId && r.studentId === params.studentId && r.status === 'pending'
    );
    if (res) {
      res.status = 'fulfilled';
    }

    this.saveStore(store);
    return { success: true, borrowing: newBorrowing, message: `Book issued to ${params.studentName} (Roll: ${params.studentRoll}).` };
  }

  public returnBook(borrowingId: string): { success: boolean; fineCalculated: number; message: string } {
    const store = this.getStore();
    const borrowing = store.libraryBorrowings.find((b) => b.id === borrowingId);
    if (!borrowing) return { success: false, fineCalculated: 0, message: 'Record not found.' };
    if (borrowing.status === 'returned') return { success: false, fineCalculated: 0, message: 'Already returned.' };

    const todayStr = new Date().toISOString().split('T')[0];
    borrowing.returnDate = todayStr;
    borrowing.status = 'returned';

    // Calculate fine: 5 BDT per day overdue
    const due = new Date(borrowing.dueDate);
    const today = new Date();
    let fine = 0;
    if (today > due) {
      const diffDays = Math.ceil((today.getTime() - due.getTime()) / (1000 * 3600 * 24));
      if (diffDays > 0) fine = diffDays * 5;
    }
    borrowing.fineAmount = fine;
    borrowing.finePaid = fine > 0;

    const book = store.libraryBooks.find((b) => b.id === borrowing.bookId);
    if (book) {
      book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
    }

    this.saveStore(store);
    return {
      success: true,
      fineCalculated: fine,
      message: fine > 0 ? `Book returned. Overdue fine of ৳${fine} settled.` : 'Book returned on time with zero dues.'
    };
  }

  public addBook(bookData: Omit<Book, 'id'>): Book {
    const store = this.getStore();
    const newBook: Book = {
      ...bookData,
      id: `book-${Date.now()}`
    };
    store.libraryBooks.unshift(newBook);
    this.saveStore(store);
    return newBook;
  }

  public updateBook(bookId: string, updates: Partial<Book>): Book | null {
    const store = this.getStore();
    const idx = store.libraryBooks.findIndex((b) => b.id === bookId);
    if (idx === -1) return null;
    store.libraryBooks[idx] = { ...store.libraryBooks[idx], ...updates };
    this.saveStore(store);
    return store.libraryBooks[idx];
  }

  public deleteBook(bookId: string): boolean {
    const store = this.getStore();
    const idx = store.libraryBooks.findIndex((b) => b.id === bookId);
    if (idx === -1) return false;
    store.libraryBooks.splice(idx, 1);
    this.saveStore(store);
    return true;
  }

  // --- Student Life Domain Operations ---

  public submitHallApplication(
    app: Omit<HallSeatApplication, 'id' | 'referenceId' | 'status' | 'appliedAt'>
  ): HallSeatApplication {
    const store = this.getStore();
    const refNum = `JSTU-HALL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: HallSeatApplication = {
      ...app,
      id: `hall-app-${Date.now()}`,
      referenceId: refNum,
      status: 'submitted',
      appliedAt: new Date().toISOString()
    };
    store.hallApplications.unshift(newApp);
    this.saveStore(store);
    return newApp;
  }

  public submitClubApplication(
    app: Omit<ClubMembershipApplication, 'id' | 'status' | 'appliedAt'>
  ): ClubMembershipApplication {
    const store = this.getStore();
    const newApp: ClubMembershipApplication = {
      ...app,
      id: `club-app-${Date.now()}`,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };
    store.clubApplications.unshift(newApp);
    this.saveStore(store);
    return newApp;
  }

  public submitSportsBooking(
    booking: Omit<SportsBooking, 'id' | 'status' | 'bookedAt'>
  ): SportsBooking {
    const store = this.getStore();
    const newBooking: SportsBooking = {
      ...booking,
      id: `sport-book-${Date.now()}`,
      status: 'confirmed',
      bookedAt: new Date().toISOString()
    };
    store.sportsBookings.unshift(newBooking);
    this.saveStore(store);
    return newBooking;
  }

  public submitMedicalAppointment(
    apt: Omit<MedicalAppointment, 'id' | 'tokenNumber' | 'status' | 'bookedAt'>
  ): MedicalAppointment {
    const store = this.getStore();
    const token = store.medicalAppointments.length + 12;
    const newApt: MedicalAppointment = {
      ...apt,
      id: `med-apt-${Date.now()}`,
      tokenNumber: token,
      status: 'confirmed',
      bookedAt: new Date().toISOString()
    };
    store.medicalAppointments.unshift(newApt);
    this.saveStore(store);
    return newApt;
  }

  public submitAlumniRegistration(
    reg: Omit<AlumniRegistrationRequest, 'id' | 'status' | 'appliedAt'>
  ): AlumniRegistrationRequest {
    const store = this.getStore();
    const newReg: AlumniRegistrationRequest = {
      ...reg,
      id: `alm-reg-${Date.now()}`,
      status: 'submitted',
      appliedAt: new Date().toISOString()
    };
    store.alumniRegistrations.unshift(newReg);
    this.saveStore(store);
    return newReg;
  }

  // --- Content Management Operations ---

  public addContentAudit(entry: Omit<ContentAuditEntry, 'id' | 'timestamp'>): ContentAuditEntry {
    const store = this.getStore();
    const newEntry: ContentAuditEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    if (!store.contentAuditTrail) {
      store.contentAuditTrail = [];
    }
    store.contentAuditTrail.unshift(newEntry);
    this.saveStore(store);
    return newEntry;
  }

  public updateManagedVcMessage(
    item: ManagedVcMessageItem,
    actor: { uid: string; name: string; email: string; role: string }
  ): void {
    const store = this.getStore();
    const prev = store.managedVcMessage;
    const now = new Date().toISOString();
    const updated: ManagedVcMessageItem = {
      ...item,
      updatedAt: now,
      updatedBy: actor.name
    };
    store.managedVcMessage = updated;
    this.saveStore(store);

    this.addContentAudit({
      contentId: item.id || 'vc_message',
      contentType: 'vc_message',
      contentTitle: item.title || 'Vice Chancellor Message',
      action: item.status === 'published' ? 'PUBLISHED' : item.status === 'archived' ? 'ARCHIVED' : 'UPDATED',
      actorUid: actor.uid,
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.role,
      changesSummary: `Updated VC Message speech & details. Status: ${item.status}`,
      previousStatus: prev?.status,
      newStatus: item.status
    });
  }

  public saveManagedItem(
    section: ContentSectionKey,
    item: any,
    actor: { uid: string; name: string; email: string; role: string; department?: string },
    actionOverride?: 'CREATED' | 'UPDATED' | 'PUBLISHED' | 'ARCHIVED' | 'DRAFTED'
  ): any {
    const store = this.getStore();
    const now = new Date().toISOString();
    let isNew = false;
    let prevStatus: ContentStatus | undefined = undefined;

    if (!item.id) {
      item.id = `${section.slice(0, 3)}-${Date.now()}`;
      isNew = true;
    }

    const updatedItem = {
      ...item,
      updatedAt: now,
      updatedBy: actor.name
    };

    switch (section) {
      case 'notices': {
        const list = store.managedNotices || [];
        const idx = list.findIndex((x) => x.id === item.id);
        if (idx >= 0) {
          prevStatus = list[idx].status;
          list[idx] = updatedItem;
        } else {
          isNew = true;
          list.unshift(updatedItem);
        }
        store.managedNotices = list;
        break;
      }
      case 'news': {
        const list = store.managedNews || [];
        const idx = list.findIndex((x) => x.id === item.id);
        if (idx >= 0) {
          prevStatus = list[idx].status;
          list[idx] = updatedItem;
        } else {
          isNew = true;
          list.unshift(updatedItem);
        }
        store.managedNews = list;
        break;
      }
      case 'events': {
        const list = store.managedEvents || [];
        const idx = list.findIndex((x) => x.id === item.id);
        if (idx >= 0) {
          prevStatus = list[idx].status;
          list[idx] = updatedItem;
        } else {
          isNew = true;
          list.unshift(updatedItem);
        }
        store.managedEvents = list;
        break;
      }
      case 'gallery': {
        const list = store.managedGallery || [];
        const idx = list.findIndex((x) => x.id === item.id);
        if (idx >= 0) {
          prevStatus = list[idx].status;
          list[idx] = updatedItem;
        } else {
          isNew = true;
          list.unshift(updatedItem);
        }
        store.managedGallery = list;
        break;
      }
      case 'downloads': {
        const list = store.managedDownloads || [];
        const idx = list.findIndex((x) => x.id === item.id);
        if (idx >= 0) {
          prevStatus = list[idx].status;
          list[idx] = updatedItem;
        } else {
          isNew = true;
          list.unshift(updatedItem);
        }
        store.managedDownloads = list;
        break;
      }
      case 'departments': {
        const list = store.managedDepartments || [];
        const idx = list.findIndex((x) => x.id === item.id || x.code === item.code);
        if (idx >= 0) {
          prevStatus = list[idx].status;
          list[idx] = updatedItem;
        } else {
          isNew = true;
          list.push(updatedItem);
        }
        store.managedDepartments = list;
        break;
      }
      case 'faculty': {
        const list = store.managedFaculty || [];
        const idx = list.findIndex((x) => x.id === item.id);
        if (idx >= 0) {
          prevStatus = list[idx].status;
          list[idx] = updatedItem;
        } else {
          isNew = true;
          list.unshift(updatedItem);
        }
        store.managedFaculty = list;
        break;
      }
      case 'static_pages': {
        const list = store.managedStaticPages || [];
        const idx = list.findIndex((x) => x.id === item.id || x.slug === item.slug);
        if (idx >= 0) {
          prevStatus = list[idx].status;
          list[idx] = updatedItem;
        } else {
          isNew = true;
          list.push(updatedItem);
        }
        store.managedStaticPages = list;
        break;
      }
      case 'vc_message': {
        this.updateManagedVcMessage(updatedItem, actor);
        return updatedItem;
      }
    }

    this.saveStore(store);

    const computedAction =
      actionOverride ||
      (isNew
        ? updatedItem.status === 'published'
          ? 'PUBLISHED'
          : 'CREATED'
        : updatedItem.status === 'published' && prevStatus !== 'published'
        ? 'PUBLISHED'
        : updatedItem.status === 'archived' && prevStatus !== 'archived'
        ? 'ARCHIVED'
        : 'UPDATED');

    const itemTitle = updatedItem.title || updatedItem.name || updatedItem.code || updatedItem.id;

    this.addContentAudit({
      contentId: updatedItem.id,
      contentType: section,
      contentTitle: itemTitle,
      action: computedAction,
      actorUid: actor.uid,
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.role,
      actorDepartment: actor.department,
      changesSummary: isNew
        ? `Created new ${section} item: "${itemTitle}". Status: ${updatedItem.status}`
        : `Updated ${section} item: "${itemTitle}". Status: ${updatedItem.status}`,
      previousStatus: prevStatus,
      newStatus: updatedItem.status
    });

    return updatedItem;
  }

  public deleteManagedItem(
    section: ContentSectionKey,
    itemId: string,
    actor: { uid: string; name: string; email: string; role: string; department?: string }
  ): boolean {
    const store = this.getStore();
    let deletedTitle = itemId;

    switch (section) {
      case 'notices': {
        const item = store.managedNotices?.find((x) => x.id === itemId);
        if (item) deletedTitle = item.title;
        store.managedNotices = store.managedNotices?.filter((x) => x.id !== itemId) || [];
        break;
      }
      case 'news': {
        const item = store.managedNews?.find((x) => x.id === itemId);
        if (item) deletedTitle = item.title;
        store.managedNews = store.managedNews?.filter((x) => x.id !== itemId) || [];
        break;
      }
      case 'events': {
        const item = store.managedEvents?.find((x) => x.id === itemId);
        if (item) deletedTitle = item.title;
        store.managedEvents = store.managedEvents?.filter((x) => x.id !== itemId) || [];
        break;
      }
      case 'gallery': {
        const item = store.managedGallery?.find((x) => x.id === itemId);
        if (item) deletedTitle = item.title;
        store.managedGallery = store.managedGallery?.filter((x) => x.id !== itemId) || [];
        break;
      }
      case 'downloads': {
        const item = store.managedDownloads?.find((x) => x.id === itemId);
        if (item) deletedTitle = item.title;
        store.managedDownloads = store.managedDownloads?.filter((x) => x.id !== itemId) || [];
        break;
      }
      case 'departments': {
        const item = store.managedDepartments?.find((x) => x.id === itemId);
        if (item) deletedTitle = item.name;
        store.managedDepartments = store.managedDepartments?.filter((x) => x.id !== itemId) || [];
        break;
      }
      case 'faculty': {
        const item = store.managedFaculty?.find((x) => x.id === itemId);
        if (item) deletedTitle = item.name;
        store.managedFaculty = store.managedFaculty?.filter((x) => x.id !== itemId) || [];
        break;
      }
      case 'static_pages': {
        const item = store.managedStaticPages?.find((x) => x.id === itemId);
        if (item) deletedTitle = item.title;
        store.managedStaticPages = store.managedStaticPages?.filter((x) => x.id !== itemId) || [];
        break;
      }
      default:
        return false;
    }

    this.saveStore(store);

    this.addContentAudit({
      contentId: itemId,
      contentType: section,
      contentTitle: deletedTitle,
      action: 'DELETED',
      actorUid: actor.uid,
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.role,
      actorDepartment: actor.department,
      changesSummary: `Deleted ${section} item: "${deletedTitle}".`
    });

    return true;
  }

  // --- Student Digital ID Card Management ---

  public getIdCards(): StudentIDCard[] {
    const store = this.getStore();
    return store.studentIdCards || [];
  }

  public getIdCardByStudentId(studentId: string): StudentIDCard | undefined {
    const store = this.getStore();
    return store.studentIdCards?.find(
      (c) => c.studentId.trim().toLowerCase() === studentId.trim().toLowerCase()
    );
  }

  public getIdCardByToken(token: string): StudentIDCard | undefined {
    const store = this.getStore();
    return store.studentIdCards?.find(
      (c) => c.verificationToken.trim().toLowerCase() === token.trim().toLowerCase()
    );
  }

  public updateIdCardStatus(
    idOrStudentId: string,
    status: IDCardStatus,
    reason?: string,
    actorName?: string
  ): StudentIDCard | null {
    const store = this.getStore();
    if (!store.studentIdCards) store.studentIdCards = [];
    const target = store.studentIdCards.find(
      (c) =>
        c.id === idOrStudentId ||
        c.studentId.trim().toLowerCase() === idOrStudentId.trim().toLowerCase()
    );
    if (!target) return null;

    target.status = status;
    target.statusReason =
      reason || `Status updated to ${status} by ${actorName || 'Office of the Registrar'}`;
    target.updatedAt = new Date().toISOString();

    this.saveStore(store);
    return target;
  }
}

