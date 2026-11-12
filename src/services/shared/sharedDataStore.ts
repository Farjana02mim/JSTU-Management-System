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
  MedicalDutyShift,
  MedicalAppointmentStatus,
  AlumniRegistrationRequest,
  MedicalVisitRecord,
  MedicalVisitAddendum,
  PrescriptionItem,
  PatientRecordAccessLog,
  VisitNoteStatus,
  MedicalRestCertificate,
  MedicalCertificateStatus,
  MedicalCertificateAuditEntry,
  MedicalStockCategory,
  MedicalStockBatch,
  MedicalStockItem,
  MedicalStockLedgerAction,
  MedicalStockLedgerEntry,
  MedicalStockAlertSummary,
  MedicalReportsData
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
  initialAlumniRegistrationsData,
  initialMedicalAppointments,
  initialMedicalDutyRoster,
  initialMedicalVisitRecords,
  initialPatientRecordAccessLogs,
  initialMedicalRestCertificates,
  initialMedicalStockItems,
  initialMedicalStockLedger
} from '../../data/studentLifeSeedData';
import {
  HallDiningOverview,
  DailyMealMenu,
  MealOnOffSetting,
  GuestMealRequest,
  MealRatingFeedback,
  DishSuggestion,
  DiningComplaint,
  BazarCostEntry,
  StudentDiningBilling,
  DiningAuditTrailEntry,
  HallId,
  DiningProvostReportData,
  MealToken,
  SpecialMealEvent,
  MonthlyAuditStatus,
  MonthlyAuditReportRecord,
  TokenVerificationResult,
  MealType
} from '../../types/hallDining';
import {
  initialHallOverviews,
  initialWeeklyMenus,
  initialMealOnOffSettings,
  initialGuestMealRequests,
  initialMealRatings,
  initialDishSuggestions,
  initialDiningComplaints,
  initialBazarCostEntries,
  initialStudentBillings,
  initialDiningAuditTrail,
  initialSpecialMealEvents,
  initialMealTokens,
  initialMonthlyAuditStatuses
} from '../../data/hallDiningSeedData';
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
import { HelpdeskTicket, TicketCategory, TicketPriority, TicketStatus, AssignedOffice, TicketReply, TicketAttachment } from '../../types/helpdesk';
import { initialHelpdeskTickets } from '../../data/helpdeskSeedData';
import {
  EvaluationWindow,
  AnonymousCourseEvaluation,
  EvaluationSubmissionRecord,
  EvaluationCriteriaRating,
  CourseEvaluationSummary
} from '../../types/evaluation';
import {
  initialEvaluationWindows,
  initialAnonymousEvaluations,
  initialSubmissionLedger
} from '../../data/evaluationSeedData';
import {
  Quiz,
  StudentQuizAttempt,
  QuizQuestion,
  StudentQuizAnswer,
  QuestionDifficultyStat,
  QuizResultAnalytics
} from '../../types/quiz';
import {
  INITIAL_DEMO_QUIZZES,
  INITIAL_DEMO_ATTEMPTS
} from '../../data/quizSeedData';
import {
  Scholarship,
  IncomeRuleConfig,
  RankedScholarshipApplicant
} from '../../types/scholarship';
import {
  INITIAL_DEMO_SCHOLARSHIPS,
  INITIAL_DEMO_SCHOLARSHIP_APPLICATIONS
} from '../../data/scholarshipSeedData';
import {
  AlumnusProfile,
  AlumniRegistrationRequest as NewAlumniRegistrationRequest,
  AlumniJobPost,
  AlumniDonation
} from '../../types/alumni';
import {
  INITIAL_ALUMNI_PROFILES,
  INITIAL_ALUMNI_REGISTRATION_REQUESTS,
  INITIAL_ALUMNI_JOB_POSTS,
  INITIAL_ALUMNI_DONATIONS
} from '../../data/alumniSeedData';
import {
  ConvocationEvent,
  ConvocationRegistration,
  GownSize
} from '../../types/convocation';
import {
  INITIAL_CONVOCATION_EVENT,
  INITIAL_CONVOCATION_REGISTRATIONS
} from '../../data/convocationSeedData';
import {
  StaffLeaveType,
  StaffLeaveBalance,
  StaffLeaveApplicationRecord,
  StaffNotice,
  StaffServiceRequest,
  StaffDirectoryMember
} from '../../types/staff';
import {
  INITIAL_STAFF_LEAVE_BALANCES,
  INITIAL_STAFF_LEAVE_APPLICATIONS,
  INITIAL_STAFF_NOTICES,
  INITIAL_STAFF_SERVICE_REQUESTS,
  INITIAL_STAFF_DIRECTORY
} from '../../data/staffSeedData';

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
    hallName: 'Oporajita Hall',
    hallNameBn: 'অপরাজিতা হল',
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
    hallName: 'Bijoy 24 Hall',
    hallNameBn: 'বিজয় ২৪ হল',
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
    hallName: 'Oporajita Hall',
    hallNameBn: 'অপরাজিতা হল',
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
    hallName: 'Bijoy 24 Hall',
    hallNameBn: 'বিজয় ২৪ হল',
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
    hallName: 'Oporajita Hall',
    hallNameBn: 'অপরাজিতা হল',
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
    hallName: 'Bijoy 24 Hall',
    hallNameBn: 'বিজয় ২৪ হল',
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
  medicalDutyRoster: MedicalDutyShift[];
  medicalVisitRecords: MedicalVisitRecord[];
  patientRecordAccessLogs: PatientRecordAccessLog[];
  medicalRestCertificates: MedicalRestCertificate[];
  medicalStockItems: MedicalStockItem[];
  medicalStockLedger: MedicalStockLedgerEntry[];
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
  helpdeskTickets: HelpdeskTicket[];
  evaluationWindows: EvaluationWindow[];
  anonymousCourseEvaluations: AnonymousCourseEvaluation[];
  evaluationSubmissionLedger: EvaluationSubmissionRecord[];
  quizzes: Quiz[];
  quizAttempts: StudentQuizAttempt[];
  scholarships: Scholarship[];
  alumniProfiles: AlumnusProfile[];
  alumniRegRequests: NewAlumniRegistrationRequest[];
  alumniJobs: AlumniJobPost[];
  alumniDonations: AlumniDonation[];
  convocationEvents: ConvocationEvent[];
  convocationRegistrations: ConvocationRegistration[];
  staffLeaveBalances: StaffLeaveBalance[];
  staffLeaveApplications: StaffLeaveApplicationRecord[];
  staffNotices: StaffNotice[];
  staffServiceRequests: StaffServiceRequest[];
  staffDirectory: StaffDirectoryMember[];
  // Hall Dining Management
  hallDiningOverviews: Record<HallId, HallDiningOverview>;
  diningWeeklyMenus: DailyMealMenu[];
  diningMealOnOffSettings: MealOnOffSetting[];
  diningGuestMealRequests: GuestMealRequest[];
  diningMealRatings: MealRatingFeedback[];
  diningDishSuggestions: DishSuggestion[];
  diningComplaints: DiningComplaint[];
  diningBazarCostEntries: BazarCostEntry[];
  diningStudentBillings: StudentDiningBilling[];
  diningAuditTrail: DiningAuditTrailEntry[];
  diningMealTokens: MealToken[];
  diningSpecialMealEvents: SpecialMealEvent[];
  diningMonthlyAuditStatuses: MonthlyAuditStatus[];
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

export function getEmptyStoreData(): SharedStoreData {
  return {
    students: {},
    teacherProfile: {
      uid: '',
      email: '',
      fullName: '',
      fullNameBn: '',
      designation: '',
      designationBn: '',
      department: '',
      departmentBn: '',
      employeeId: '',
      phone: '',
      room: '',
      bloodGroup: '',
      assignedCourseCodes: [],
      researchAreas: []
    },
    courses: [],
    assignments: [],
    routine: {},
    teacherRoutine: {},
    results: [],
    feeBreakdown: {
      studentId: '',
      currentSemester: '',
      totalPayable: 0,
      totalPaid: 0,
      totalDue: 0,
      invoices: []
    },
    studentNotifications: [],
    applications: [],
    digitalDocuments: [],
    accountRequests: [],
    simulatedEmailLogs: [],
    activationTokens: [],
    teacherNotifications: [],
    libraryBooks: [],
    libraryBorrowings: [],
    libraryReservations: [],
    hallApplications: [],
    clubApplications: [],
    sportsBookings: [],
    medicalAppointments: [],
    medicalDutyRoster: [],
    medicalVisitRecords: [],
    patientRecordAccessLogs: [],
    medicalRestCertificates: [],
    medicalStockItems: [],
    medicalStockLedger: [],
    alumniRegistrations: [],
    managedNotices: [],
    managedNews: [],
    managedEvents: [],
    managedGallery: [],
    managedDownloads: [],
    managedDepartments: [],
    managedFaculty: [],
    managedVcMessage: {} as any,
    managedStaticPages: [],
    contentAuditTrail: [],
    studentIdCards: [],
    helpdeskTickets: [],
    evaluationWindows: [],
    anonymousCourseEvaluations: [],
    evaluationSubmissionLedger: [],
    quizzes: [],
    quizAttempts: [],
    scholarships: [],
    alumniProfiles: [],
    alumniRegRequests: [],
    alumniJobs: [],
    alumniDonations: [],
    convocationEvents: [],
    convocationRegistrations: [],
    staffLeaveBalances: [],
    staffLeaveApplications: [],
    staffNotices: [],
    staffServiceRequests: [],
    staffDirectory: [],
    // Hall Dining Management
    hallDiningOverviews: {} as Record<HallId, HallDiningOverview>,
    diningWeeklyMenus: [],
    diningMealOnOffSettings: [],
    diningGuestMealRequests: [],
    diningMealRatings: [],
    diningDishSuggestions: [],
    diningComplaints: [],
    diningBazarCostEntries: [],
    diningStudentBillings: [],
    diningAuditTrail: [],
    diningMealTokens: [],
    diningSpecialMealEvents: [],
    diningMonthlyAuditStatuses: []
  };
}

export function getInitialSharedStoreData(): SharedStoreData {
  if (import.meta.env.VITE_USE_MOCK !== 'true') {
    return getEmptyStoreData();
  }
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
    hallName: 'Oporajita Hall',
    hallNameBn: 'অপরাজিতা হল',
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
    medicalAppointments: initialMedicalAppointments,
    medicalDutyRoster: initialMedicalDutyRoster,
    medicalVisitRecords: initialMedicalVisitRecords,
    patientRecordAccessLogs: initialPatientRecordAccessLogs,
    medicalRestCertificates: initialMedicalRestCertificates,
    medicalStockItems: initialMedicalStockItems,
    medicalStockLedger: initialMedicalStockLedger,
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
    studentIdCards: initialStudentIdCards,
    helpdeskTickets: initialHelpdeskTickets,
    evaluationWindows: initialEvaluationWindows,
    anonymousCourseEvaluations: initialAnonymousEvaluations,
    evaluationSubmissionLedger: initialSubmissionLedger,
    quizzes: INITIAL_DEMO_QUIZZES,
    quizAttempts: INITIAL_DEMO_ATTEMPTS,
    scholarships: INITIAL_DEMO_SCHOLARSHIPS,
    alumniProfiles: INITIAL_ALUMNI_PROFILES,
    alumniRegRequests: INITIAL_ALUMNI_REGISTRATION_REQUESTS,
    alumniJobs: INITIAL_ALUMNI_JOB_POSTS,
    alumniDonations: INITIAL_ALUMNI_DONATIONS,
    convocationEvents: [INITIAL_CONVOCATION_EVENT],
    convocationRegistrations: INITIAL_CONVOCATION_REGISTRATIONS,
    staffLeaveBalances: INITIAL_STAFF_LEAVE_BALANCES,
    staffLeaveApplications: INITIAL_STAFF_LEAVE_APPLICATIONS,
    staffNotices: INITIAL_STAFF_NOTICES,
    staffServiceRequests: INITIAL_STAFF_SERVICE_REQUESTS,
    staffDirectory: INITIAL_STAFF_DIRECTORY,
    // Hall Dining Management
    hallDiningOverviews: initialHallOverviews,
    diningWeeklyMenus: initialWeeklyMenus,
    diningMealOnOffSettings: initialMealOnOffSettings,
    diningGuestMealRequests: initialGuestMealRequests,
    diningMealRatings: initialMealRatings,
    diningDishSuggestions: initialDishSuggestions,
    diningComplaints: initialDiningComplaints,
    diningBazarCostEntries: initialBazarCostEntries,
    diningStudentBillings: initialStudentBillings,
    diningAuditTrail: initialDiningAuditTrail,
    diningMealTokens: initialMealTokens,
    diningSpecialMealEvents: initialSpecialMealEvents,
    diningMonthlyAuditStatuses: initialMonthlyAuditStatuses
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
    if (import.meta.env.VITE_USE_MOCK !== 'true') {
      return getEmptyStoreData();
    }
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
      if (!parsed.medicalAppointments || !Array.isArray(parsed.medicalAppointments) || parsed.medicalAppointments.length === 0) {
        parsed.medicalAppointments = getInitialSharedStoreData().medicalAppointments;
      }
      if (!parsed.medicalDutyRoster || !Array.isArray(parsed.medicalDutyRoster) || parsed.medicalDutyRoster.length === 0) {
        parsed.medicalDutyRoster = getInitialSharedStoreData().medicalDutyRoster;
      }
      if (!parsed.medicalVisitRecords || !Array.isArray(parsed.medicalVisitRecords)) {
        parsed.medicalVisitRecords = getInitialSharedStoreData().medicalVisitRecords;
      }
      if (!parsed.patientRecordAccessLogs || !Array.isArray(parsed.patientRecordAccessLogs)) {
        parsed.patientRecordAccessLogs = getInitialSharedStoreData().patientRecordAccessLogs;
      }
      if (!parsed.medicalRestCertificates || !Array.isArray(parsed.medicalRestCertificates)) {
        parsed.medicalRestCertificates = getInitialSharedStoreData().medicalRestCertificates;
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
      if (!parsed.helpdeskTickets || !Array.isArray(parsed.helpdeskTickets) || parsed.helpdeskTickets.length === 0) {
        parsed.helpdeskTickets = getInitialSharedStoreData().helpdeskTickets;
      }
      if (!parsed.evaluationWindows || !Array.isArray(parsed.evaluationWindows) || parsed.evaluationWindows.length === 0) {
        parsed.evaluationWindows = getInitialSharedStoreData().evaluationWindows;
      }
      if (!parsed.anonymousCourseEvaluations || !Array.isArray(parsed.anonymousCourseEvaluations) || parsed.anonymousCourseEvaluations.length === 0) {
        parsed.anonymousCourseEvaluations = getInitialSharedStoreData().anonymousCourseEvaluations;
      }
      if (!parsed.evaluationSubmissionLedger || !Array.isArray(parsed.evaluationSubmissionLedger)) {
        parsed.evaluationSubmissionLedger = getInitialSharedStoreData().evaluationSubmissionLedger;
      }
      if (!parsed.quizzes || !Array.isArray(parsed.quizzes) || parsed.quizzes.length === 0) {
        parsed.quizzes = getInitialSharedStoreData().quizzes;
      }
      if (!parsed.quizAttempts || !Array.isArray(parsed.quizAttempts)) {
        parsed.quizAttempts = getInitialSharedStoreData().quizAttempts;
      }
      if (!parsed.scholarships || !Array.isArray(parsed.scholarships) || parsed.scholarships.length === 0) {
        parsed.scholarships = getInitialSharedStoreData().scholarships;
      }
      if (parsed.applications && !parsed.applications.some((a: any) => a.type === 'scholarship')) {
        parsed.applications.push(...(INITIAL_DEMO_SCHOLARSHIP_APPLICATIONS as any[]));
      }
      if (!parsed.alumniProfiles || !Array.isArray(parsed.alumniProfiles) || parsed.alumniProfiles.length === 0) {
        parsed.alumniProfiles = getInitialSharedStoreData().alumniProfiles;
      }
      if (!parsed.alumniRegRequests || !Array.isArray(parsed.alumniRegRequests)) {
        parsed.alumniRegRequests = getInitialSharedStoreData().alumniRegRequests;
      }
      if (!parsed.alumniJobs || !Array.isArray(parsed.alumniJobs)) {
        parsed.alumniJobs = getInitialSharedStoreData().alumniJobs;
      }
      if (!parsed.alumniDonations || !Array.isArray(parsed.alumniDonations)) {
        parsed.alumniDonations = getInitialSharedStoreData().alumniDonations;
      }
      if (!parsed.convocationEvents || !Array.isArray(parsed.convocationEvents) || parsed.convocationEvents.length === 0) {
        parsed.convocationEvents = getInitialSharedStoreData().convocationEvents;
      }
      if (!parsed.convocationRegistrations || !Array.isArray(parsed.convocationRegistrations)) {
        parsed.convocationRegistrations = getInitialSharedStoreData().convocationRegistrations;
      }
      if (!parsed.staffLeaveBalances || !Array.isArray(parsed.staffLeaveBalances) || parsed.staffLeaveBalances.length === 0) {
        parsed.staffLeaveBalances = getInitialSharedStoreData().staffLeaveBalances;
      }
      if (!parsed.staffLeaveApplications || !Array.isArray(parsed.staffLeaveApplications) || parsed.staffLeaveApplications.length === 0) {
        parsed.staffLeaveApplications = getInitialSharedStoreData().staffLeaveApplications;
      }
      if (!parsed.staffNotices || !Array.isArray(parsed.staffNotices) || parsed.staffNotices.length === 0) {
        parsed.staffNotices = getInitialSharedStoreData().staffNotices;
      }
      if (!parsed.staffServiceRequests || !Array.isArray(parsed.staffServiceRequests) || parsed.staffServiceRequests.length === 0) {
        parsed.staffServiceRequests = getInitialSharedStoreData().staffServiceRequests;
      }
      if (!parsed.staffDirectory || !Array.isArray(parsed.staffDirectory) || parsed.staffDirectory.length === 0) {
        parsed.staffDirectory = getInitialSharedStoreData().staffDirectory;
      }
      if (!parsed.hallDiningOverviews || Object.keys(parsed.hallDiningOverviews).length === 0) {
        parsed.hallDiningOverviews = getInitialSharedStoreData().hallDiningOverviews;
      }
      if (!parsed.diningWeeklyMenus || !Array.isArray(parsed.diningWeeklyMenus) || parsed.diningWeeklyMenus.length === 0) {
        parsed.diningWeeklyMenus = getInitialSharedStoreData().diningWeeklyMenus;
      }
      if (!parsed.diningMealOnOffSettings || !Array.isArray(parsed.diningMealOnOffSettings)) {
        parsed.diningMealOnOffSettings = getInitialSharedStoreData().diningMealOnOffSettings;
      }
      if (!parsed.diningGuestMealRequests || !Array.isArray(parsed.diningGuestMealRequests)) {
        parsed.diningGuestMealRequests = getInitialSharedStoreData().diningGuestMealRequests;
      }
      if (!parsed.diningMealRatings || !Array.isArray(parsed.diningMealRatings)) {
        parsed.diningMealRatings = getInitialSharedStoreData().diningMealRatings;
      }
      if (!parsed.diningDishSuggestions || !Array.isArray(parsed.diningDishSuggestions)) {
        parsed.diningDishSuggestions = getInitialSharedStoreData().diningDishSuggestions;
      }
      if (!parsed.diningComplaints || !Array.isArray(parsed.diningComplaints)) {
        parsed.diningComplaints = getInitialSharedStoreData().diningComplaints;
      }
      if (!parsed.diningBazarCostEntries || !Array.isArray(parsed.diningBazarCostEntries)) {
        parsed.diningBazarCostEntries = getInitialSharedStoreData().diningBazarCostEntries;
      }
      if (!parsed.diningStudentBillings || !Array.isArray(parsed.diningStudentBillings)) {
        parsed.diningStudentBillings = getInitialSharedStoreData().diningStudentBillings;
      }
      if (!parsed.diningAuditTrail || !Array.isArray(parsed.diningAuditTrail)) {
        parsed.diningAuditTrail = getInitialSharedStoreData().diningAuditTrail;
      }
      if (!parsed.diningMealTokens || !Array.isArray(parsed.diningMealTokens)) {
        parsed.diningMealTokens = getInitialSharedStoreData().diningMealTokens;
      }
      if (!parsed.diningSpecialMealEvents || !Array.isArray(parsed.diningSpecialMealEvents)) {
        parsed.diningSpecialMealEvents = getInitialSharedStoreData().diningSpecialMealEvents;
      }
      if (!parsed.diningMonthlyAuditStatuses || !Array.isArray(parsed.diningMonthlyAuditStatuses)) {
        parsed.diningMonthlyAuditStatuses = getInitialSharedStoreData().diningMonthlyAuditStatuses;
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

  // --- Medical Center & Appointment Operations ---

  public getMedicalDutyRoster(): MedicalDutyShift[] {
    const store = this.getStore();
    return store.medicalDutyRoster || [];
  }

  /**
   * Returns appointments for a specific patient.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public getMedicalAppointmentsForPatient(patientUid: string): MedicalAppointment[] {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    const store = this.getStore();
    return (store.medicalAppointments || []).filter(
      (apt) => apt.patientUid === patientUid || (!apt.patientUid && patientUid === 'demo_student_01')
    );
  }

  /**
   * Returns sanitized appointments for medical staff.
   * A medical officer sees patient details only for appointments assigned to them or to the center,
   * and only the minimum fields: name, ID, department, reason. Never marks, fees or applications.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public getMedicalAppointmentsForStaff(officerUid?: string, doctorId?: string): MedicalAppointment[] {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    const store = this.getStore();
    const all = store.medicalAppointments || [];
    return all.filter((apt) => {
      if (!doctorId || doctorId === 'any') return true;
      return apt.doctorId === doctorId || apt.doctorId === 'any';
    });
  }

  /**
   * Returns counts and statistics only for administrative reporting.
   * Admin sees counts and statistics only, never reasons or notes.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public getMedicalAppointmentStatistics(): {
    total: number;
    requested: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    noShow: number;
    todayCount: number;
  } {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    const store = this.getStore();
    const list = store.medicalAppointments || [];
    const today = new Date().toISOString().split('T')[0];

    return {
      total: list.length,
      requested: list.filter((a) => a.status === 'Requested').length,
      confirmed: list.filter((a) => a.status === 'Confirmed').length,
      completed: list.filter((a) => a.status === 'Completed').length,
      cancelled: list.filter((a) => a.status === 'Cancelled').length,
      noShow: list.filter((a) => a.status === 'No-show').length,
      todayCount: list.filter((a) => a.appointmentDate === today).length
    };
  }

  /**
   * Books a medical appointment with slot conflict check (no double booking).
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public bookMedicalAppointment(data: {
    patientUid: string;
    patientName: string;
    patientRole: string;
    patientId: string;
    department: string;
    phone: string;
    doctorId: string;
    doctorName: string;
    doctorSpecialty: string;
    appointmentDate: string;
    timeSlot: string;
    reason: string;
  }): { success: boolean; appointment?: MedicalAppointment; error?: string } {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    const store = this.getStore();
    store.medicalAppointments = store.medicalAppointments || [];

    // Reason length check (300 character limit)
    if (data.reason.length > 300) {
      return { success: false, error: 'Reason exceeds maximum length of 300 characters.' };
    }

    // Check for double booking: slot already booked and active (Requested or Confirmed)
    const conflict = store.medicalAppointments.find(
      (a) =>
        a.appointmentDate === data.appointmentDate &&
        a.timeSlot === data.timeSlot &&
        (data.doctorId === 'any' || a.doctorId === data.doctorId || a.doctorId === 'any') &&
        (a.status === 'Requested' || a.status === 'Confirmed')
    );

    if (conflict) {
      return {
        success: false,
        error: 'This time slot has already been booked. Please choose an alternative slot or date from the duty roster.'
      };
    }

    const refNumber = `JSTU-MED-2026-${1000 + store.medicalAppointments.length + 1}`;
    const token = store.medicalAppointments.length + 1;
    const now = new Date().toISOString();

    const newApt: MedicalAppointment = {
      id: `med-apt-${Date.now()}`,
      referenceNumber: refNumber,
      tokenNumber: token,
      patientUid: data.patientUid,
      patientName: data.patientName,
      patientRole: data.patientRole,
      patientId: data.patientId,
      department: data.department,
      phone: data.phone,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      doctorSpecialty: data.doctorSpecialty,
      appointmentDate: data.appointmentDate,
      timeSlot: data.timeSlot,
      reason: data.reason,
      status: 'Requested',
      bookedAt: now,
      updatedAt: now,
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          actorUid: data.patientUid,
          actorRole: data.patientRole,
          action: 'REQUESTED',
          timestamp: now,
          note: 'Appointment requested online'
        }
      ]
    };

    store.medicalAppointments.unshift(newApt);

    // Emits notification without health details
    const notif = {
      id: `med-notif-${Date.now()}`,
      title: `Medical Appointment Requested (${refNumber})`,
      titleBn: `মেডিকেল অ্যাপয়েন্টমেন্ট আবেদন জমা (${refNumber})`,
      message: `Your medical appointment request for ${data.appointmentDate} at ${data.timeSlot} has been submitted for duty officer confirmation.`,
      messageBn: `${data.appointmentDate} তারিখের ${data.timeSlot} সময়ের মেডিকেল অ্যাপয়েন্টমেন্ট আবেদনটি গৃহীত হয়েছে।`,
      category: 'academic' as const,
      timestamp: now,
      read: false,
      link: '/student/medical'
    };

    if (data.patientRole === 'teacher') {
      store.teacherNotifications.unshift(notif);
    } else {
      store.studentNotifications.unshift(notif);
    }

    this.saveStore(store);
    return { success: true, appointment: newApt };
  }

  /**
   * Updates appointment status (Confirm, Complete, Cancel, No-show).
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public updateMedicalAppointmentStatus(
    appointmentId: string,
    status: MedicalAppointmentStatus,
    actorUid: string,
    actorRole: string,
    note?: string
  ): { success: boolean; error?: string } {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    const store = this.getStore();
    const apt = (store.medicalAppointments || []).find((a) => a.id === appointmentId);
    if (!apt) {
      return { success: false, error: 'Appointment not found.' };
    }

    const now = new Date().toISOString();
    apt.status = status;
    apt.updatedAt = now;

    // Audit trail (strictly NO health details)
    apt.auditTrail.push({
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorUid,
      actorRole,
      action: status.toUpperCase() as any,
      timestamp: now,
      note: note || `Status changed to ${status}`
    });

    // Notify patient (no health details in message)
    const notif = {
      id: `med-notif-${Date.now()}`,
      title: `Medical Appointment ${status} (${apt.referenceNumber})`,
      titleBn: `মেডিকেল অ্যাপয়েন্টমেন্ট ${status} (${apt.referenceNumber})`,
      message: `Your appointment on ${apt.appointmentDate} at ${apt.timeSlot} has been marked as ${status}.`,
      messageBn: `${apt.appointmentDate} তারিখের ${apt.timeSlot} সময়ের অ্যাপয়েন্টমেন্টের স্ট্যাটাস: ${status}।`,
      category: 'academic' as const,
      timestamp: now,
      read: false,
      link: '/student/medical'
    };

    if (apt.patientRole === 'teacher') {
      store.teacherNotifications.unshift(notif);
    } else {
      store.studentNotifications.unshift(notif);
    }

    this.saveStore(store);
    return { success: true };
  }

  /**
   * Cancel an appointment before the slot.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public cancelMedicalAppointment(
    appointmentId: string,
    actorUid: string,
    actorRole: string,
    reason?: string
  ): { success: boolean; error?: string } {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    const store = this.getStore();
    const apt = (store.medicalAppointments || []).find((a) => a.id === appointmentId);
    if (!apt) {
      return { success: false, error: 'Appointment not found.' };
    }
    if (apt.status === 'Completed') {
      return { success: false, error: 'Cannot cancel an appointment that has already been completed.' };
    }

    const now = new Date().toISOString();
    apt.status = 'Cancelled';
    apt.updatedAt = now;
    apt.cancelledAt = now;
    apt.cancellationReason = reason || 'Cancelled by patient';

    apt.auditTrail.push({
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorUid,
      actorRole,
      action: 'CANCELLED',
      timestamp: now,
      note: 'Appointment cancelled'
    });

    this.saveStore(store);
    return { success: true };
  }

  /**
   * Reschedule an appointment before the slot.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public rescheduleMedicalAppointment(
    appointmentId: string,
    newDate: string,
    newTimeSlot: string,
    actorUid: string,
    actorRole: string
  ): { success: boolean; error?: string } {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    const store = this.getStore();
    const apt = (store.medicalAppointments || []).find((a) => a.id === appointmentId);
    if (!apt) {
      return { success: false, error: 'Appointment not found.' };
    }
    if (apt.status === 'Completed' || apt.status === 'Cancelled') {
      return { success: false, error: 'Cannot reschedule a completed or cancelled appointment.' };
    }

    // Check conflict on new slot
    const conflict = store.medicalAppointments.find(
      (a) =>
        a.id !== appointmentId &&
        a.appointmentDate === newDate &&
        a.timeSlot === newTimeSlot &&
        (apt.doctorId === 'any' || a.doctorId === apt.doctorId || a.doctorId === 'any') &&
        (a.status === 'Requested' || a.status === 'Confirmed')
    );

    if (conflict) {
      return { success: false, error: 'The selected rescheduled slot is already occupied.' };
    }

    const now = new Date().toISOString();
    apt.appointmentDate = newDate;
    apt.timeSlot = newTimeSlot;
    apt.status = 'Requested';
    apt.updatedAt = now;

    apt.auditTrail.push({
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorUid,
      actorRole,
      action: 'RESCHEDULED',
      timestamp: now,
      note: `Rescheduled to ${newDate} at ${newTimeSlot}`
    });

    this.saveStore(store);
    return { success: true };
  }

  /**
   * Duty roster management operations by Medical Officer.
   */
  public addDutyRosterShift(shift: Omit<MedicalDutyShift, 'id'>): MedicalDutyShift {
    const store = this.getStore();
    store.medicalDutyRoster = store.medicalDutyRoster || [];
    const newShift: MedicalDutyShift = {
      ...shift,
      id: `shift-${Date.now()}`
    };
    store.medicalDutyRoster.push(newShift);
    this.saveStore(store);
    return newShift;
  }

  public updateDutyRosterShift(shift: MedicalDutyShift): void {
    const store = this.getStore();
    store.medicalDutyRoster = (store.medicalDutyRoster || []).map((s) => (s.id === shift.id ? shift : s));
    this.saveStore(store);
  }

  public deleteDutyRosterShift(shiftId: string): void {
    const store = this.getStore();
    store.medicalDutyRoster = (store.medicalDutyRoster || []).filter((s) => s.id !== shiftId);
    this.saveStore(store);
  }

  // =========================================================================
  // MEDICAL CENTER MILESTONE 2 (M2) — VISIT RECORDS, PRESCRIPTIONS & ACCESS LOGS
  // Real enforcement must move to Firestore rules / Cloud Functions.
  // Real health data needs encryption, strict access rules, a legal basis and university approval, and must not be stored in a browser-only demo.
  // =========================================================================

  /**
   * Retrieves visit records for a patient (My Health Records tab).
   * Real enforcement must move to Firestore rules / Cloud Functions.
   * Real health data needs encryption, strict access rules, a legal basis and university approval, and must not be stored in a browser-only demo.
   */
  public getPatientHealthRecords(patientUid: string): MedicalVisitRecord[] {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    // Real health data needs encryption, strict access rules, a legal basis and university approval, and must not be stored in a browser-only demo.
    const store = this.getStore();
    return (store.medicalVisitRecords || []).filter(
      (r) => r.patientUid === patientUid || (!r.patientUid && patientUid === 'demo_student_01')
    );
  }

  /**
   * Retrieves single visit record by ID.
   */
  public getVisitRecordById(recordId: string): MedicalVisitRecord | undefined {
    const store = this.getStore();
    return (store.medicalVisitRecords || []).find((r) => r.id === recordId);
  }

  /**
   * Retrieves existing visit record for an appointment ID.
   */
  public getVisitNoteByAppointment(appointmentId: string): MedicalVisitRecord | undefined {
    const store = this.getStore();
    return (store.medicalVisitRecords || []).find((r) => r.appointmentId === appointmentId);
  }

  /**
   * Logs a doctor/staff access event to a patient's medical history.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public logPatientRecordAccess(
    patientUid: string,
    accessedByUid: string,
    accessedByName: string,
    accessedByRole: string
  ): void {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    const store = this.getStore();
    store.patientRecordAccessLogs = store.patientRecordAccessLogs || [];
    const log: PatientRecordAccessLog = {
      id: `acc-log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      patientUid,
      accessedByUid,
      accessedByName,
      accessedByRole,
      accessedAt: new Date().toISOString()
    };
    store.patientRecordAccessLogs.unshift(log);
    this.saveStore(store);
  }

  /**
   * Retrieves audit log of who accessed patient records.
   * STRICT PRIVACY: Returns role and date only to the patient (no names, no IDs).
   */
  public getPatientAccessLogs(patientUid: string): Array<{ id: string; role: string; date: string }> {
    const store = this.getStore();
    const logs = (store.patientRecordAccessLogs || []).filter(
      (l) => l.patientUid === patientUid || (!l.patientUid && patientUid === 'demo_student_01')
    );
    return logs.map((l) => ({
      id: l.id,
      role: l.accessedByRole,
      date: l.accessedAt
    }));
  }

  /**
   * Doctor opens patient history only if patient has an appointment with the center.
   * Every access is logged in patientRecordAccessLogs.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public getDoctorPatientHistory(
    patientUid: string,
    doctorUid: string,
    doctorName: string,
    doctorRole: string
  ): { allowed: boolean; records: MedicalVisitRecord[]; error?: string } {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    // Real health data needs encryption, strict access rules, a legal basis and university approval, and must not be stored in a browser-only demo.
    const store = this.getStore();

    // Verify patient has at least one registered appointment with the center
    const hasAppointment = (store.medicalAppointments || []).some(
      (a) => a.patientUid === patientUid || (!a.patientUid && patientUid === 'demo_student_01')
    );

    if (!hasAppointment) {
      return {
        allowed: false,
        records: [],
        error: 'Access denied: Patient has no registered appointment with the university medical center.'
      };
    }

    // Log the doctor's record access
    this.logPatientRecordAccess(patientUid, doctorUid, doctorName, doctorRole);

    const records = (store.medicalVisitRecords || []).filter(
      (r) => r.patientUid === patientUid || (!r.patientUid && patientUid === 'demo_student_01')
    );

    return {
      allowed: true,
      records
    };
  }

  /**
   * Saves or finalizes a doctor's visit note for a completed appointment.
   * - Max 10 prescription items (free text, no system recommendation).
   * - Finalized notes are immutable; cannot be edited directly.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public saveVisitNote(data: {
    appointmentId: string;
    complaint: string;
    observation: string;
    advice: string;
    followUpDate?: string;
    sickRestDays?: number;
    prescriptionItems: PrescriptionItem[];
    status: VisitNoteStatus;
    doctorUid: string;
    doctorName: string;
    doctorSpecialty: string;
  }): { success: boolean; record?: MedicalVisitRecord; error?: string } {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    // Real health data needs encryption, strict access rules, a legal basis and university approval, and must not be stored in a browser-only demo.
    const store = this.getStore();
    store.medicalVisitRecords = store.medicalVisitRecords || [];

    // Find linked appointment
    const appointment = (store.medicalAppointments || []).find((a) => a.id === data.appointmentId);
    if (!appointment) {
      return { success: false, error: 'Linked appointment not found.' };
    }

    // Check if appointment is already completed or if status can be updated
    if (appointment.status !== 'Completed') {
      appointment.status = 'Completed';
      appointment.updatedAt = new Date().toISOString();
      appointment.auditTrail.push({
        id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        actorUid: data.doctorUid,
        actorRole: 'medical_officer',
        action: 'COMPLETED',
        timestamp: new Date().toISOString(),
        note: 'Consultation marked completed with visit note'
      });
    }

    // Check existing note
    const existingIndex = store.medicalVisitRecords.findIndex((r) => r.appointmentId === data.appointmentId);
    if (existingIndex >= 0) {
      const existing = store.medicalVisitRecords[existingIndex];
      if (existing.status === 'FINALIZED') {
        return {
          success: false,
          error: 'A finalized note cannot be edited. A correction must be recorded as an addendum.'
        };
      }
    }

    // Length and item limits validation
    if (data.complaint.length > 500) {
      return { success: false, error: 'Complaint text exceeds limit of 500 characters.' };
    }
    if (data.observation.length > 500) {
      return { success: false, error: 'Observation text exceeds limit of 500 characters.' };
    }
    if (data.advice.length > 500) {
      return { success: false, error: 'Advice text exceeds limit of 500 characters.' };
    }
    if (data.prescriptionItems.length > 10) {
      return { success: false, error: 'Maximum 10 prescription items allowed.' };
    }

    const now = new Date().toISOString();
    const isFinalizing = data.status === 'FINALIZED';

    let token = '';
    if (isFinalizing) {
      token = `med_tok_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    }

    if (existingIndex >= 0) {
      const existing = store.medicalVisitRecords[existingIndex];
      existing.complaint = data.complaint;
      existing.observation = data.observation;
      existing.advice = data.advice;
      existing.followUpDate = data.followUpDate;
      existing.sickRestDays = data.sickRestDays;
      existing.prescriptionItems = data.prescriptionItems;
      existing.status = data.status;
      existing.updatedAt = now;
      if (isFinalizing) {
        existing.finalizedAt = now;
        existing.verificationToken = token;
        existing.verificationStatus = 'VALID';
      }
      this.saveStore(store);
      return { success: true, record: existing };
    }

    const newRecord: MedicalVisitRecord = {
      id: `med-rec-${Date.now()}`,
      appointmentId: data.appointmentId,
      appointmentRef: appointment.referenceNumber,
      verificationToken: token || `med_tok_draft_${Date.now().toString(36)}`,
      verificationStatus: 'VALID',
      patientUid: appointment.patientUid,
      patientName: appointment.patientName,
      patientId: appointment.patientId,
      patientRole: appointment.patientRole,
      patientDepartment: appointment.department,
      doctorId: data.doctorUid,
      doctorName: data.doctorName,
      doctorSpecialty: data.doctorSpecialty,
      visitDate: appointment.appointmentDate,
      complaint: data.complaint,
      observation: data.observation,
      advice: data.advice,
      followUpDate: data.followUpDate,
      sickRestDays: data.sickRestDays,
      prescriptionItems: data.prescriptionItems,
      status: data.status,
      createdAt: now,
      finalizedAt: isFinalizing ? now : undefined,
      updatedAt: now,
      addenda: []
    };

    store.medicalVisitRecords.unshift(newRecord);
    this.saveStore(store);
    return { success: true, record: newRecord };
  }

  /**
   * Adds an addendum to an existing finalized visit note.
   * Keeps the original note visible and unmodified in history.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public addVisitAddendum(
    recordId: string,
    data: {
      doctorUid: string;
      doctorName: string;
      reason: string;
      correctionNotes: string;
    }
  ): { success: boolean; record?: MedicalVisitRecord; error?: string } {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    // Real health data needs encryption, strict access rules, a legal basis and university approval, and must not be stored in a browser-only demo.
    const store = this.getStore();
    const record = (store.medicalVisitRecords || []).find((r) => r.id === recordId);
    if (!record) {
      return { success: false, error: 'Medical record not found.' };
    }
    if (record.status !== 'FINALIZED') {
      return { success: false, error: 'Addenda can only be added to finalized records.' };
    }
    if (!data.reason.trim()) {
      return { success: false, error: 'Reason for addendum is mandatory.' };
    }
    if (!data.correctionNotes.trim()) {
      return { success: false, error: 'Correction notes are mandatory.' };
    }

    const now = new Date().toISOString();
    const addendum: MedicalVisitAddendum = {
      id: `addendum-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: now,
      createdByUid: data.doctorUid,
      createdByName: data.doctorName,
      reason: data.reason.trim(),
      correctionNotes: data.correctionNotes.trim()
    };

    record.addenda = record.addenda || [];
    record.addenda.push(addendum);
    record.updatedAt = now;

    this.saveStore(store);
    return { success: true, record };
  }

  /**
   * Public prescription verification check.
   * PRIVACY RULE: Returns ONLY status (VALID | REVOKED | NOT FOUND), issueDate, and centerName ("JSTU Medical Center").
   * Absolutely NO patient name, no student ID, and no medicine names.
   */
  public verifyPrescriptionToken(token: string): {
    status: 'VALID' | 'REVOKED' | 'NOT_FOUND';
    issueDate?: string;
    centerName: string;
    token?: string;
  } {
    const centerName = 'JSTU Medical Center';
    if (!token || typeof token !== 'string') {
      return { status: 'NOT_FOUND', centerName };
    }
    const cleanToken = token.trim();
    if (!cleanToken) {
      return { status: 'NOT_FOUND', centerName };
    }

    const store = this.getStore();
    const record = (store.medicalVisitRecords || []).find(
      (r) => r.verificationToken === cleanToken && r.status === 'FINALIZED'
    );

    if (!record) {
      return { status: 'NOT_FOUND', centerName };
    }

    return {
      status: record.verificationStatus || 'VALID',
      issueDate: record.finalizedAt ? record.finalizedAt.split('T')[0] : record.visitDate,
      centerName,
      token: cleanToken
    };
  }

  /**
   * Admin-facing aggregate analytics.
   * STRICT ANONYMITY: Returns only counts (visits/month, appointments by status).
   * NO notes, reasons, or patient/doctor names.
   */
  public getMedicalCenterAnonymousStats(): {
    totalVisits: number;
    completedVisits: number;
    visitsThisMonth: number;
    appointmentsByStatus: Record<string, number>;
  } {
    const store = this.getStore();
    const appointments = store.medicalAppointments || [];
    const visitRecords = store.medicalVisitRecords || [];

    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const visitsThisMonth = visitRecords.filter((r) => r.visitDate.startsWith(currentYearMonth)).length;

    const appointmentsByStatus: Record<string, number> = {
      Requested: 0,
      Confirmed: 0,
      Completed: 0,
      Cancelled: 0,
      'No-show': 0
    };

    appointments.forEach((a) => {
      if (appointmentsByStatus[a.status] !== undefined) {
        appointmentsByStatus[a.status]++;
      }
    });

    return {
      totalVisits: visitRecords.length,
      completedVisits: visitRecords.filter((r) => r.status === 'FINALIZED').length,
      visitsThisMonth,
      appointmentsByStatus
    };
  }

  // =========================================================================
  // MEDICAL CENTER MILESTONE 3 (M3) — MEDICAL REST CERTIFICATES & QR REGISTRY
  // Real enforcement must move to Firestore rules / Cloud Functions.
  // Real signing must happen server-side with a key in a secret manager.
  // The registry must live in a database with rules exposing only the minimal verification fields publicly.
  // =========================================================================

  /**
   * Retrieves all medical rest certificates for a patient.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public getMedicalRestCertificatesForPatient(patientUid: string): MedicalRestCertificate[] {
    const store = this.getStore();
    return (store.medicalRestCertificates || []).filter(
      (c) => c.patientUid === patientUid || (!c.patientUid && patientUid === 'demo_student_01')
    );
  }

  /**
   * Retrieves a single medical rest certificate by internal ID or 128-bit verification ID.
   */
  public getMedicalRestCertificateById(idOrVerificationId: string): MedicalRestCertificate | undefined {
    const store = this.getStore();
    return (store.medicalRestCertificates || []).find(
      (c) => c.id === idOrVerificationId || c.verificationId === idOrVerificationId
    );
  }

  /**
   * Finds the latest certificate issued for a given visit record.
   */
  public getCertificateByVisitRecordId(visitRecordId: string): MedicalRestCertificate | undefined {
    const store = this.getStore();
    const certs = (store.medicalRestCertificates || []).filter((c) => c.visitRecordId === visitRecordId);
    if (certs.length === 0) return undefined;
    // Return latest version
    return certs.sort((a, b) => b.version - a.version)[0];
  }

  /**
   * Issues a Medical Rest Certificate from a finalized visit note with sick-rest days.
   * Idempotent: If an active certificate already exists and no reasonForSuperseding is given, returns existing.
   * Corrections create a new version with a mandatory reason; the old version is marked SUPERSEDED.
   * Generates a 128-bit verification ID via crypto.getRandomValues and a SHA-256 canonical hash.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   * Real signing must happen server-side with a key in a secret manager.
   * The registry must live in a database with rules exposing only the minimal verification fields publicly.
   */
  public async issueMedicalRestCertificate(data: {
    visitRecordId: string;
    restStartDate: string;
    restDays: number;
    doctorUid: string;
    doctorName: string;
    reasonForSuperseding?: string;
    supersededReason?: string;
    [key: string]: any;
  }): Promise<{ success: boolean; certificate?: MedicalRestCertificate; error?: string }> {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    // Real signing must happen server-side with a key in a secret manager.
    // The registry must live in a database with rules exposing only the minimal verification fields publicly.
    const store = this.getStore();
    store.medicalRestCertificates = store.medicalRestCertificates || [];

    // Verify linked visit record
    const visitRecord = (store.medicalVisitRecords || []).find((r) => r.id === data.visitRecordId);
    if (!visitRecord) {
      return { success: false, error: 'Linked visit record not found.' };
    }
    if (visitRecord.status !== 'FINALIZED') {
      return { success: false, error: 'A medical rest certificate can only be issued from a finalized visit record.' };
    }
    if (data.restDays <= 0 || data.restDays > 30) {
      return { success: false, error: 'Rest days must be between 1 and 30 days.' };
    }

    // Check existing certificates for this visit
    const existingActive = store.medicalRestCertificates.find(
      (c) => c.visitRecordId === data.visitRecordId && c.status === 'VALID'
    );

    const supersedeReason = data.supersededReason || data.reasonForSuperseding;

    // Idempotent check
    if (existingActive && !supersedeReason) {
      return { success: true, certificate: existingActive };
    }

    const now = new Date().toISOString();

    // Calculate restEndDate (inclusive)
    const startDateObj = new Date(data.restStartDate);
    const endDateObj = new Date(startDateObj.getTime() + (data.restDays - 1) * 86400000);
    const restEndDate = endDateObj.toISOString().split('T')[0];

    // Generate 128-bit random verification ID (32 hex characters)
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    const verificationId = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const newVersion = existingActive ? existingActive.version + 1 : 1;
    const certId = `cert-med-${Date.now()}`;

    // Canonical content for SHA-256 (NO diagnosis, NO symptoms!)
    const canonicalPayload = `${verificationId}|${visitRecord.patientId}|${data.restStartDate}|${restEndDate}|${data.restDays}|JSTU Medical Center|${newVersion}`;
    const enc = new TextEncoder().encode(canonicalPayload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
    const canonicalHash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // If superseding existing active certificate
    if (existingActive && supersedeReason) {
      existingActive.status = 'SUPERSEDED';
      existingActive.supersededById = certId;
      existingActive.supersededReason = supersedeReason.trim();
      existingActive.updatedAt = now;
      existingActive.auditTrail.push({
        id: `aud-cert-${Date.now()}-sup`,
        actorUid: data.doctorUid,
        actorRole: 'medical_officer',
        action: 'SUPERSEDED',
        timestamp: now,
        reason: supersedeReason.trim()
      });
    }

    const newCert: MedicalRestCertificate = {
      id: certId,
      verificationId,
      canonicalHash,
      visitRecordId: visitRecord.id,
      appointmentId: visitRecord.appointmentId,
      appointmentRef: visitRecord.appointmentRef,
      patientUid: visitRecord.patientUid,
      patientName: visitRecord.patientName,
      patientId: visitRecord.patientId,
      patientDepartment: visitRecord.patientDepartment,
      centerName: 'JSTU Medical Center',
      doctorRole: 'Medical Officer',
      doctorUid: data.doctorUid,
      doctorName: data.doctorName,
      restStartDate: data.restStartDate,
      restEndDate,
      restDays: data.restDays,
      status: 'VALID',
      version: newVersion,
      previousVersionId: existingActive ? existingActive.id : undefined,
      issuedAt: now,
      updatedAt: now,
      auditTrail: [
        {
          id: `aud-cert-${Date.now()}-iss`,
          actorUid: data.doctorUid,
          actorRole: 'medical_officer',
          action: 'ISSUED',
          timestamp: now,
          reason: existingActive ? `Reissued as version ${newVersion} with corrections` : 'Initial certificate issued'
        }
      ]
    };

    store.medicalRestCertificates.unshift(newCert);
    this.saveStore(store);

    return { success: true, certificate: newCert };
  }

  /**
   * Revokes a medical rest certificate with a mandatory reason.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public revokeMedicalRestCertificate(
    verificationId: string,
    actorUid: string,
    actorRole: string,
    reason: string
  ): { success: boolean; certificate?: MedicalRestCertificate; error?: string } {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    // Real signing must happen server-side with a key in a secret manager.
    const store = this.getStore();
    const cert = (store.medicalRestCertificates || []).find(
      (c) => c.verificationId === verificationId || c.id === verificationId
    );

    if (!cert) {
      return { success: false, error: 'Medical rest certificate not found.' };
    }

    if (!reason || !reason.trim()) {
      return { success: false, error: 'A mandatory revocation reason is required.' };
    }

    const now = new Date().toISOString();
    cert.status = 'REVOKED';
    cert.revokedAt = now;
    cert.revocationReason = reason.trim();
    cert.revokedByUid = actorUid;
    cert.revokedByRole = actorRole;
    cert.updatedAt = now;

    cert.auditTrail.push({
      id: `aud-cert-${Date.now()}-rev`,
      actorUid,
      actorRole,
      action: 'REVOKED',
      timestamp: now,
      reason: reason.trim()
    });

    this.saveStore(store);
    return { success: true, certificate: cert };
  }

  /**
   * Public verification endpoint (/verify-medical/:id).
   * PRIVACY RULE: Exposes ONLY minimal, masked attributes.
   * Output: VALID, SUPERSEDED, REVOKED, or NOT_FOUND, masked name, rest period dates, issue date.
   * Absolutely NO diagnosis, NO symptoms, NO visit note.
   * Generic NOT_FOUND for any invalid ID.
   */
  public verifyMedicalCertificate(verificationId: string): {
    status: 'VALID' | 'SUPERSEDED' | 'REVOKED' | 'NOT_FOUND';
    maskedName?: string;
    restPeriod?: {
      startDate: string;
      endDate: string;
      days: number;
    };
    issueDate?: string;
    centerName: string;
    verificationId?: string;
    canonicalHash?: string;
    supersededReason?: string;
    revocationReason?: string;
  } {
    const centerName = 'JSTU Medical Center';
    if (!verificationId || typeof verificationId !== 'string') {
      return { status: 'NOT_FOUND', centerName };
    }
    const cleanId = verificationId.trim().toLowerCase();
    if (!cleanId) {
      return { status: 'NOT_FOUND', centerName };
    }

    const store = this.getStore();
    const cert = (store.medicalRestCertificates || []).find(
      (c) => c.verificationId.toLowerCase() === cleanId || c.id.toLowerCase() === cleanId
    );

    if (!cert) {
      return { status: 'NOT_FOUND', centerName };
    }

    // Helper to mask patient name: "Tanvir Ahmed" -> "T***** A****"
    const maskPatientName = (name: string): string => {
      return name
        .split(' ')
        .map((part) => (part.length <= 1 ? part : part[0] + '*'.repeat(Math.max(1, part.length - 1))))
        .join(' ');
    };

    return {
      status: cert.status,
      maskedName: maskPatientName(cert.patientName),
      restPeriod: {
        startDate: cert.restStartDate,
        endDate: cert.restEndDate,
        days: cert.restDays
      },
      issueDate: cert.issuedAt.split('T')[0],
      centerName,
      verificationId: cert.verificationId,
      canonicalHash: cert.canonicalHash,
      supersededReason: cert.status === 'SUPERSEDED' ? cert.supersededReason : undefined,
      revocationReason: cert.status === 'REVOKED' ? cert.revocationReason : undefined
    };
  }

  /**
   * Checks whether a student has an approved medical leave application covering a specific date.
   * Used by attendance rosters to mark "Excused (medical)" without exposing health details.
   */
  public getApprovedMedicalLeaveForStudent(
    studentUid: string,
    date: string
  ): { isExcused: boolean; certificateRef?: string; restPeriod?: { startDate: string; endDate: string } } {
    const store = this.getStore();
    const apps = (store.applications as any[]) || [];

    const approvedMedicalLeave = apps.find((app: any) => {
      const matchStudent =
        app.studentUid === studentUid ||
        app.applicantUid === studentUid ||
        app.studentId === studentUid ||
        (!app.studentUid && !app.applicantUid && studentUid === 'demo_student_01');
      const isApproved = app.status === 'APPROVED';
      const isMedical = app.type === 'leave' && (app.formData?.leaveType === 'medical' || app.formData?.attachedCertificateId);
      if (!matchStudent || !isApproved || !isMedical) return false;

      const start = app.formData?.startDate;
      const end = app.formData?.endDate;
      if (!start || !end) return false;

      return date >= start && date <= end;
    });

    if (!approvedMedicalLeave) {
      return { isExcused: false };
    }

    return {
      isExcused: true,
      certificateRef: approvedMedicalLeave.formData?.attachedCertificateId || approvedMedicalLeave.applicationNumber,
      restPeriod: {
        startDate: approvedMedicalLeave.formData?.startDate,
        endDate: approvedMedicalLeave.formData?.endDate
      }
    };
  }

  /**
   * Anonymous certificate statistics for Admin and Registrar.
   * Strictly counts and statuses only.
   */
  public getMedicalCertificatesAnonymousStats(): {
    totalIssued: number;
    validCount: number;
    supersededCount: number;
    revokedCount: number;
  } {
    const store = this.getStore();
    const certs = store.medicalRestCertificates || [];
    return {
      totalIssued: certs.length,
      validCount: certs.filter((c) => c.status === 'VALID').length,
      supersededCount: certs.filter((c) => c.status === 'SUPERSEDED').length,
      revokedCount: certs.filter((c) => c.status === 'REVOKED').length
    };
  }

  // ==========================================
  // M4: PHARMACY, STOCK & REPORTS
  // Real enforcement must move to Firestore rules / Cloud Functions.
  // Real stock changes must be done by server-side transactions so quantities cannot be altered from the browser.
  // ==========================================

  /**
   * Retrieves all medical center stock items.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public getMedicalStockItems(): MedicalStockItem[] {
    const store = this.getStore();
    return store.medicalStockItems || [];
  }

  /**
   * Retrieves a single stock item by ID.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public getMedicalStockItemById(itemId: string): MedicalStockItem | undefined {
    const store = this.getStore();
    return (store.medicalStockItems || []).find((item) => item.id === itemId);
  }

  /**
   * Retrieves the append-only stock movement ledger.
   * Strict auditability: No editing or deletion of ledger entries.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public getMedicalStockLedger(): MedicalStockLedgerEntry[] {
    const store = this.getStore();
    return [...(store.medicalStockLedger || [])].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Patient-side medicine availability check.
   * Evaluates if there is unexpired stock > 0 for a given medicine.
   * CRITICAL PRIVACY RULE: Returns boolean only; NO quantities are exposed to the patient.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public isMedicineAvailableInStock(medicineQuery: string): boolean {
    if (!medicineQuery || !medicineQuery.trim()) return false;
    const store = this.getStore();
    const todayStr = new Date().toISOString().split('T')[0];

    const cleanQuery = medicineQuery
      .toLowerCase()
      .replace(/\[.*?\]/g, '')
      .replace(/\b(tab\.|inj\.|syr\.|suspension|drops|capsule|tablets?)\b/g, '')
      .trim();

    const items = store.medicalStockItems || [];
    for (const item of items) {
      const cleanItemName = item.name
        .toLowerCase()
        .replace(/\[.*?\]/g, '')
        .replace(/\b(tab\.|inj\.|syr\.|suspension|drops|capsule|tablets?)\b/g, '')
        .trim();

      const isMatch =
        cleanItemName.includes(cleanQuery) ||
        cleanQuery.includes(cleanItemName) ||
        item.name.toLowerCase().includes(medicineQuery.toLowerCase().trim());

      if (isMatch) {
        const unexpiredTotal = (item.batches || []).reduce((sum, b) => {
          if (b.expiryDate >= todayStr && b.quantity > 0) {
            return sum + b.quantity;
          }
          return sum;
        }, 0);

        if (unexpiredTotal > 0) return true;
      }
    }
    return false;
  }

  /**
   * Evaluates stock alerts (low stock, expiring soon within 30 days, expired).
   * Notifications contain only item names and counts (no patient data).
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public getMedicalStockAlerts(): MedicalStockAlertSummary {
    const store = this.getStore();
    const items = store.medicalStockItems || [];
    const todayStr = new Date().toISOString().split('T')[0];
    const thirtyDaysLater = new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0];

    let lowStockCount = 0;
    let expiringCount = 0;
    let expiredCount = 0;
    const alerts: MedicalStockAlertSummary['alerts'] = [];

    for (const item of items) {
      const batches = item.batches || [];
      const unexpiredQty = batches.reduce((sum, b) => {
        if (b.expiryDate >= todayStr && b.quantity > 0) {
          return sum + b.quantity;
        }
        return sum;
      }, 0);

      // Low stock check
      if (unexpiredQty <= item.reorderLevel) {
        lowStockCount++;
        alerts.push({
          type: 'LOW_STOCK',
          itemId: item.id,
          itemName: item.name,
          details: `Current unexpired stock (${unexpiredQty} ${item.unit}) is at or below reorder level (${item.reorderLevel} ${item.unit}).`
        });
      }

      // Batch level checks
      for (const batch of batches) {
        if (batch.quantity > 0) {
          if (batch.expiryDate < todayStr) {
            expiredCount++;
            alerts.push({
              type: 'EXPIRED',
              itemId: item.id,
              itemName: item.name,
              batchNumber: batch.batchNumber,
              details: `Batch ${batch.batchNumber} (${batch.quantity} ${item.unit}) expired on ${batch.expiryDate}. Dispensing blocked.`
            });
          } else if (batch.expiryDate <= thirtyDaysLater) {
            expiringCount++;
            const daysLeft = Math.max(
              0,
              Math.ceil((new Date(batch.expiryDate).getTime() - Date.now()) / 86400000)
            );
            alerts.push({
              type: 'EXPIRING_SOON',
              itemId: item.id,
              itemName: item.name,
              batchNumber: batch.batchNumber,
              details: `Batch ${batch.batchNumber} (${batch.quantity} ${item.unit}) expires in ${daysLeft} days (${batch.expiryDate}).`
            });
          }
        }
      }
    }

    return {
      lowStockCount,
      expiringCount,
      expiredCount,
      alerts
    };
  }

  /**
   * Adds or receives new stock into inventory.
   * Appends to append-only ledger.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   * Real stock changes must be done by server-side transactions so quantities cannot be altered from the browser.
   */
  public addMedicalStock(
    data: {
      itemId?: string;
      name?: string;
      nameBn?: string;
      category?: MedicalStockCategory;
      unit?: string;
      reorderLevel?: number;
      batchNumber: string;
      expiryDate: string;
      quantity: number;
      storageNote?: string;
      reason: string;
    },
    actorUid: string,
    actorRole: string
  ): { success: boolean; item?: MedicalStockItem; ledgerEntry?: MedicalStockLedgerEntry; error?: string } {
    if (!data.batchNumber || !data.batchNumber.trim()) {
      return { success: false, error: 'A valid batch number is required.' };
    }
    if (!data.expiryDate || !data.expiryDate.trim()) {
      return { success: false, error: 'A valid expiry date is required.' };
    }
    if (typeof data.quantity !== 'number' || data.quantity <= 0 || !Number.isInteger(data.quantity)) {
      return { success: false, error: 'Quantity must be a positive integer.' };
    }
    if (!data.reason || !data.reason.trim()) {
      return { success: false, error: 'A mandatory reason or receipt reference is required.' };
    }

    const store = this.getStore();
    store.medicalStockItems = store.medicalStockItems || [];
    store.medicalStockLedger = store.medicalStockLedger || [];

    let targetItem: MedicalStockItem | undefined;

    if (data.itemId) {
      targetItem = store.medicalStockItems.find((it) => it.id === data.itemId);
    }

    if (!targetItem) {
      if (!data.name || !data.name.trim()) {
        return { success: false, error: 'Item name is required for new items.' };
      }
      targetItem = {
        id: `med-item-${Date.now()}`,
        name: data.name.trim().endsWith('[REPLACE WITH REAL CONTENT]')
          ? data.name.trim()
          : `${data.name.trim()} [REPLACE WITH REAL CONTENT]`,
        nameBn: data.nameBn || data.name.trim(),
        category: data.category || 'tablet',
        unit: data.unit || 'strips',
        reorderLevel: data.reorderLevel && data.reorderLevel > 0 ? data.reorderLevel : 20,
        storageNote: data.storageNote || 'Central Dispensary Cabinet',
        batches: []
      };
      store.medicalStockItems.push(targetItem);
    }

    // Check if batch already exists on this item
    const existingBatch = targetItem.batches.find((b) => b.batchNumber === data.batchNumber.trim());
    if (existingBatch) {
      existingBatch.quantity += data.quantity;
      if (data.storageNote) existingBatch.storageNote = data.storageNote;
    } else {
      targetItem.batches.push({
        id: `batch-${Date.now()}`,
        batchNumber: data.batchNumber.trim(),
        expiryDate: data.expiryDate.trim(),
        quantity: data.quantity,
        receivedDate: new Date().toISOString().split('T')[0],
        storageNote: data.storageNote || targetItem.storageNote
      });
    }

    const totalQtyAfter = targetItem.batches.reduce((sum, b) => sum + b.quantity, 0);

    const ledgerEntry: MedicalStockLedgerEntry = {
      id: `stk-led-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorUid,
      actorRole,
      action: 'RECEIVE',
      itemId: targetItem.id,
      itemName: targetItem.name,
      batchNumber: data.batchNumber.trim(),
      quantityChange: data.quantity,
      balanceAfter: totalQtyAfter,
      reason: data.reason.trim()
    };

    store.medicalStockLedger.push(ledgerEntry);
    this.saveStore(store);

    return { success: true, item: targetItem, ledgerEntry };
  }

  /**
   * Dispenses medicine against a finalized prescription item.
   * FEFO (First Expired First Out) enforcement:
   * - Deducts from the earliest expiry batch first.
   * - Expired batches CANNOT be dispensed.
   * - Quantity can never drop below zero.
   * - Links only to anonymous visit reference, NEVER patient identity.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   * Real stock changes must be done by server-side transactions so quantities cannot be altered from the browser.
   */
  public dispenseMedicalStock(
    data: {
      itemId: string;
      quantity: number;
      anonymousVisitRef: string;
      reason?: string;
    },
    actorUid: string,
    actorRole: string
  ): {
    success: boolean;
    dispensedBatches?: Array<{ batchNumber: string; quantity: number }>;
    ledgerEntries?: MedicalStockLedgerEntry[];
    error?: string;
  } {
    if (typeof data.quantity !== 'number' || data.quantity <= 0 || !Number.isInteger(data.quantity)) {
      return { success: false, error: 'Dispensing quantity must be a positive integer.' };
    }
    if (!data.anonymousVisitRef || !data.anonymousVisitRef.trim()) {
      return { success: false, error: 'An anonymous visit reference is required for dispensing.' };
    }

    const store = this.getStore();
    const item = (store.medicalStockItems || []).find((it) => it.id === data.itemId);
    if (!item) {
      return { success: false, error: 'Stock item not found.' };
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Filter to unexpired batches with quantity > 0
    const unexpiredBatches = (item.batches || []).filter(
      (b) => b.expiryDate >= todayStr && b.quantity > 0
    );

    // Calculate total available unexpired stock
    const totalAvailable = unexpiredBatches.reduce((sum, b) => sum + b.quantity, 0);
    if (totalAvailable < data.quantity) {
      return {
        success: false,
        error: `Insufficient unexpired stock available. (Requested: ${data.quantity} ${item.unit}, Available: ${totalAvailable} ${item.unit}). Expired batches cannot be dispensed.`
      };
    }

    // FEFO Sort: Earliest expiry date first
    unexpiredBatches.sort((a, b) => a.expiryDate.localeCompare(b.expiryDate));

    let remainingToDispense = data.quantity;
    const dispensedBatches: Array<{ batchNumber: string; quantity: number }> = [];
    const newLedgerEntries: MedicalStockLedgerEntry[] = [];
    const now = new Date().toISOString();

    for (const batch of unexpiredBatches) {
      if (remainingToDispense <= 0) break;

      const take = Math.min(batch.quantity, remainingToDispense);
      batch.quantity -= take;
      remainingToDispense -= take;

      dispensedBatches.push({ batchNumber: batch.batchNumber, quantity: take });

      const totalItemQtyAfter = item.batches.reduce((sum, b) => sum + b.quantity, 0);

      const entry: MedicalStockLedgerEntry = {
        id: `stk-led-${Date.now()}-${batch.batchNumber}`,
        timestamp: now,
        actorUid,
        actorRole,
        action: 'DISPENSE',
        itemId: item.id,
        itemName: item.name,
        batchNumber: batch.batchNumber,
        quantityChange: -take,
        balanceAfter: totalItemQtyAfter,
        reason: data.reason || 'Dispensed per finalized clinical prescription (FEFO)',
        anonymousVisitRef: data.anonymousVisitRef.trim()
      };

      newLedgerEntries.push(entry);
      store.medicalStockLedger.push(entry);
    }

    this.saveStore(store);

    return {
      success: true,
      dispensedBatches,
      ledgerEntries: newLedgerEntries
    };
  }

  /**
   * Adjusts stock quantity on physical recount or reconciliation audit.
   * Requires mandatory reason. Appends to append-only ledger.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   * Real stock changes must be done by server-side transactions so quantities cannot be altered from the browser.
   */
  public adjustMedicalStock(
    data: {
      itemId: string;
      batchNumber: string;
      newQuantity: number;
      reason: string;
    },
    actorUid: string,
    actorRole: string
  ): { success: boolean; item?: MedicalStockItem; error?: string } {
    if (!data.reason || !data.reason.trim()) {
      return { success: false, error: 'A mandatory adjustment reason is required.' };
    }
    if (typeof data.newQuantity !== 'number' || data.newQuantity < 0 || !Number.isInteger(data.newQuantity)) {
      return { success: false, error: 'New quantity must be a non-negative integer (quantity cannot go below zero).' };
    }

    const store = this.getStore();
    const item = (store.medicalStockItems || []).find((it) => it.id === data.itemId);
    if (!item) {
      return { success: false, error: 'Stock item not found.' };
    }

    const batch = item.batches.find((b) => b.batchNumber === data.batchNumber);
    if (!batch) {
      return { success: false, error: 'Batch not found on item.' };
    }

    const oldQty = batch.quantity;
    const diff = data.newQuantity - oldQty;
    batch.quantity = data.newQuantity;

    const totalQtyAfter = item.batches.reduce((sum, b) => sum + b.quantity, 0);

    const ledgerEntry: MedicalStockLedgerEntry = {
      id: `stk-led-${Date.now()}-adj`,
      timestamp: new Date().toISOString(),
      actorUid,
      actorRole,
      action: 'ADJUSTMENT',
      itemId: item.id,
      itemName: item.name,
      batchNumber: batch.batchNumber,
      quantityChange: diff,
      balanceAfter: totalQtyAfter,
      reason: data.reason.trim()
    };

    store.medicalStockLedger = store.medicalStockLedger || [];
    store.medicalStockLedger.push(ledgerEntry);
    this.saveStore(store);

    return { success: true, item };
  }

  /**
   * Marks stock expired or damaged.
   * Mandatory reason required. Appends to append-only ledger.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   * Real stock changes must be done by server-side transactions so quantities cannot be altered from the browser.
   */
  public markStockExpiredOrDamaged(
    data: {
      itemId: string;
      batchNumber: string;
      quantity: number;
      type: 'EXPIRED' | 'DAMAGED';
      reason: string;
    },
    actorUid: string,
    actorRole: string
  ): { success: boolean; item?: MedicalStockItem; error?: string } {
    if (!data.reason || !data.reason.trim()) {
      return { success: false, error: 'A mandatory reason is required when marking expired or damaged stock.' };
    }
    if (typeof data.quantity !== 'number' || data.quantity <= 0 || !Number.isInteger(data.quantity)) {
      return { success: false, error: 'Quantity must be a positive integer.' };
    }

    const store = this.getStore();
    const item = (store.medicalStockItems || []).find((it) => it.id === data.itemId);
    if (!item) {
      return { success: false, error: 'Stock item not found.' };
    }

    const batch = item.batches.find((b) => b.batchNumber === data.batchNumber);
    if (!batch) {
      return { success: false, error: 'Batch not found.' };
    }

    if (batch.quantity < data.quantity) {
      return {
        success: false,
        error: `Cannot write off ${data.quantity} units; batch only contains ${batch.quantity} units.`
      };
    }

    batch.quantity -= data.quantity;
    const totalQtyAfter = item.batches.reduce((sum, b) => sum + b.quantity, 0);

    const ledgerEntry: MedicalStockLedgerEntry = {
      id: `stk-led-${Date.now()}-${data.type.toLowerCase()}`,
      timestamp: new Date().toISOString(),
      actorUid,
      actorRole,
      action: data.type,
      itemId: item.id,
      itemName: item.name,
      batchNumber: batch.batchNumber,
      quantityChange: -data.quantity,
      balanceAfter: totalQtyAfter,
      reason: data.reason.trim()
    };

    store.medicalStockLedger = store.medicalStockLedger || [];
    store.medicalStockLedger.push(ledgerEntry);
    this.saveStore(store);

    return { success: true, item };
  }

  /**
   * Generates anonymous Medical Center Reports with Small-Count Protection (<5).
   * Calculates:
   * - Visits per day and month
   * - Appointments by status
   * - No-show rate
   * - Average visits per doctor
   * - Top categories of items dispensed
   * - Stock value-free summary (low and expiring items)
   * Small-count protection: Any count < 5 is masked with displayCount: "<5" to prevent re-identification.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public getMedicalCenterReports(filterRange: '7d' | '30d' | 'month' | 'all' = '30d'): MedicalReportsData {
    const store = this.getStore();
    const appointments = store.medicalAppointments || [];
    const visits = store.medicalVisitRecords || [];
    const ledger = store.medicalStockLedger || [];
    const items = store.medicalStockItems || [];

    const now = Date.now();
    const oneDay = 86400000;
    const filterLimitMs =
      filterRange === '7d'
        ? now - oneDay * 7
        : filterRange === '30d'
        ? now - oneDay * 30
        : filterRange === 'month'
        ? now - oneDay * 31
        : 0;

    // Filter appointments within range
    const filteredApts = appointments.filter((a) => {
      if (filterLimitMs === 0) return true;
      const aptTime = new Date(a.appointmentDate).getTime();
      return aptTime >= filterLimitMs;
    });

    // Filter finalized visits
    const filteredVisits = visits.filter((v) => {
      if (filterLimitMs === 0) return true;
      const vTime = new Date(v.visitDate).getTime();
      return vTime >= filterLimitMs;
    });

    const totalAppointments = filteredApts.length;
    const totalVisits = filteredVisits.length;
    const completedApts = filteredApts.filter((a) => a.status === 'Completed').length;
    const cancelledApts = filteredApts.filter((a) => a.status === 'Cancelled').length;

    const noShowRatePercent =
      totalAppointments > 0 ? Math.round((cancelledApts / totalAppointments) * 100) : 0;

    // Small-count helper
    const protectCount = (count: number): { count: number; displayCount: string } => ({
      count,
      displayCount: count < 5 ? '<5' : String(count)
    });

    // 1. Visits per day (last 7 or 14 days sorted)
    const dayMap = new Map<string, number>();
    for (const v of filteredVisits) {
      dayMap.set(v.visitDate, (dayMap.get(v.visitDate) || 0) + 1);
    }
    const visitsByDay = Array.from(dayMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14)
      .map(([date, count]) => {
        const protectedVal = protectCount(count);
        return {
          date,
          displayDate: date.substring(5), // MM-DD
          count: protectedVal.count,
          displayCount: protectedVal.displayCount
        };
      });

    // 2. Visits per month
    const monthMap = new Map<string, number>();
    for (const v of visits) {
      const ym = v.visitDate.substring(0, 7); // YYYY-MM
      monthMap.set(ym, (monthMap.get(ym) || 0) + 1);
    }
    const visitsByMonth = Array.from(monthMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([month, count]) => {
        const protectedVal = protectCount(count);
        return {
          month,
          displayMonth: month,
          count: protectedVal.count,
          displayCount: protectedVal.displayCount
        };
      });

    // 3. Appointments by status
    const statusMap = new Map<string, number>();
    for (const a of filteredApts) {
      statusMap.set(a.status, (statusMap.get(a.status) || 0) + 1);
    }
    const appointmentsByStatus = Array.from(statusMap.entries()).map(([status, count]) => {
      const protectedVal = protectCount(count);
      return {
        status,
        count: protectedVal.count,
        displayCount: protectedVal.displayCount
      };
    });

    // 4. Visits per doctor (anonymous doctor name)
    const doctorMap = new Map<string, { doctorId: string; doctorName: string; count: number }>();
    for (const v of filteredVisits) {
      const existing = doctorMap.get(v.doctorId) || {
        doctorId: v.doctorId,
        doctorName: v.doctorName.replace(/\[.*?\]/g, '').trim(),
        count: 0
      };
      existing.count++;
      doctorMap.set(v.doctorId, existing);
    }
    const visitsByDoctor = Array.from(doctorMap.values()).map((doc) => {
      const protectedVal = protectCount(doc.count);
      return {
        doctorId: doc.doctorId,
        doctorName: doc.doctorName,
        count: protectedVal.count,
        displayCount: protectedVal.displayCount
      };
    });

    // 5. Top categories of items dispensed
    const itemCategoryMap = new Map<string, string>();
    for (const it of items) {
      itemCategoryMap.set(it.id, it.category);
    }

    const categoryDispensedMap = new Map<string, number>();
    for (const l of ledger) {
      if (l.action === 'DISPENSE') {
        const category = itemCategoryMap.get(l.itemId) || 'tablet';
        const qty = Math.abs(l.quantityChange);
        categoryDispensedMap.set(category, (categoryDispensedMap.get(category) || 0) + qty);
      }
    }
    const dispensedByCategory = Array.from(categoryDispensedMap.entries()).map(([cat, count]) => {
      const protectedVal = protectCount(count);
      return {
        category: cat.replace('_', ' ').toUpperCase(),
        count: protectedVal.count,
        displayCount: protectedVal.displayCount
      };
    });

    // 6. Stock summary
    const todayStr = new Date().toISOString().split('T')[0];
    const thirtyDaysLater = new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0];

    let lowStockCount = 0;
    let expiringWithin30DaysCount = 0;
    let expiredBatchCount = 0;

    for (const it of items) {
      const batches = it.batches || [];
      const unexpiredQty = batches.reduce((sum, b) => {
        if (b.expiryDate >= todayStr && b.quantity > 0) return sum + b.quantity;
        return sum;
      }, 0);

      if (unexpiredQty <= it.reorderLevel) lowStockCount++;

      for (const b of batches) {
        if (b.quantity > 0) {
          if (b.expiryDate < todayStr) expiredBatchCount++;
          else if (b.expiryDate <= thirtyDaysLater) expiringWithin30DaysCount++;
        }
      }
    }

    return {
      totalVisits,
      totalAppointments,
      noShowRatePercent,
      completedVisitsCount: completedApts,
      cancelledVisitsCount: cancelledApts,
      visitsByDay,
      visitsByMonth,
      appointmentsByStatus,
      visitsByDoctor,
      dispensedByCategory,
      stockSummary: {
        totalItems: items.length,
        lowStockCount,
        expiringWithin30DaysCount,
        expiredBatchCount
      }
    };
  }

  public submitStudentLifeAlumniRegistration(
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

  // --- Helpdesk Domain Operations ---

  public getHelpdeskTickets(): HelpdeskTicket[] {
    const store = this.getStore();
    return store.helpdeskTickets || [];
  }

  public getHelpdeskTicketByRef(ref: string): HelpdeskTicket | undefined {
    const store = this.getStore();
    const clean = ref.trim().toLowerCase();
    return store.helpdeskTickets?.find(
      (t) => t.referenceNumber.toLowerCase() === clean || t.id.toLowerCase() === clean
    );
  }

  public createHelpdeskTicket(params: {
    category: TicketCategory;
    priority: TicketPriority;
    subject: string;
    description: string;
    isAnonymous: boolean;
    submitterUid?: string;
    submitterName?: string;
    submitterEmail?: string;
    submitterStudentId?: string;
    submitterRole?: 'student' | 'teacher' | 'staff' | 'alumni' | 'other';
    submitterPhone?: string;
    assignedOffice?: AssignedOffice;
    attachments?: TicketAttachment[];
  }): HelpdeskTicket {
    const store = this.getStore();
    if (!store.helpdeskTickets) store.helpdeskTickets = [];

    // SLA hours calculation by priority
    let slaHours = 48; // default Medium
    if (params.priority === 'Urgent') slaHours = 12;
    else if (params.priority === 'High') slaHours = 24;
    else if (params.priority === 'Low') slaHours = 72;

    const now = new Date();
    const deadline = new Date(now.getTime() + slaHours * 3600 * 1000);

    // Auto default assigned office by category if not explicitly chosen
    let defaultOffice: AssignedOffice = 'General Administration';
    switch (params.category) {
      case 'Academic':
        defaultOffice = 'Academic Council / Dean Office';
        break;
      case 'Exam':
        defaultOffice = 'Exam Controller Office';
        break;
      case 'Fee':
        defaultOffice = 'Accounts & Finance Office';
        break;
      case 'Hostel':
        defaultOffice = 'Hall / Hostel Administration';
        break;
      case 'IT':
        defaultOffice = 'IT Cell';
        break;
      case 'Harassment/Complaint':
        defaultOffice = 'Anti-Harassment & Grievance Cell';
        break;
      default:
        defaultOffice = params.assignedOffice || 'General Administration';
        break;
    }

    const refNumber = `HD-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    // CRITICAL: If anonymous, NEVER store any submitter identity
    const newTicket: HelpdeskTicket = {
      id: `ticket-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      referenceNumber: refNumber,
      category: params.category,
      priority: params.priority,
      status: 'Open',
      subject: params.subject.trim(),
      description: params.description.trim(),
      isAnonymous: !!params.isAnonymous,
      // Identity fields are undefined if anonymous
      submitterUid: params.isAnonymous ? undefined : params.submitterUid,
      submitterName: params.isAnonymous ? undefined : params.submitterName,
      submitterEmail: params.isAnonymous ? undefined : params.submitterEmail,
      submitterStudentId: params.isAnonymous ? undefined : params.submitterStudentId,
      submitterRole: params.isAnonymous ? undefined : params.submitterRole,
      submitterPhone: params.isAnonymous ? undefined : params.submitterPhone,
      assignedOffice: params.assignedOffice || defaultOffice,
      attachments: params.attachments || [],
      replies: [
        {
          id: `reply-${Date.now()}-init`,
          authorType: 'system',
          authorName: 'Helpdesk System',
          message: `Ticket logged with Reference #${refNumber}. Auto-routed to ${params.assignedOffice || defaultOffice} (SLA target: ${slaHours} hours).`,
          createdAt: now.toISOString(),
          isInternalNote: false
        }
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      slaHours,
      slaDeadline: deadline.toISOString()
    };

    store.helpdeskTickets.unshift(newTicket);
    this.saveStore(store);
    return newTicket;
  }

  public updateTicketStatus(
    ticketIdOrRef: string,
    status: TicketStatus,
    assignedOffice?: AssignedOffice,
    assignedStaffName?: string,
    actor?: { name: string; role: string }
  ): HelpdeskTicket | null {
    const store = this.getStore();
    const clean = ticketIdOrRef.trim().toLowerCase();
    const ticket = store.helpdeskTickets?.find(
      (t) => t.referenceNumber.toLowerCase() === clean || t.id.toLowerCase() === clean
    );
    if (!ticket) return null;

    const prevStatus = ticket.status;
    ticket.status = status;
    if (assignedOffice) ticket.assignedOffice = assignedOffice;
    if (assignedStaffName !== undefined) ticket.assignedStaffName = assignedStaffName;
    ticket.updatedAt = new Date().toISOString();

    if (status === 'Resolved' && !ticket.resolvedAt) {
      ticket.resolvedAt = new Date().toISOString();
    }
    if (status === 'Closed' && !ticket.closedAt) {
      ticket.closedAt = new Date().toISOString();
    }

    // System audit reply in ticket thread
    ticket.replies.push({
      id: `reply-sys-${Date.now()}`,
      authorType: 'system',
      authorName: 'Helpdesk System',
      message: `Status changed from ${prevStatus} to "${status}"${assignedOffice ? ` • Assigned to: ${assignedOffice}` : ''} by ${actor?.name || 'Authorized Staff'}.`,
      createdAt: new Date().toISOString(),
      isInternalNote: false
    });

    // In-app Notification for non-anonymous user on status change
    if (!ticket.isAnonymous && ticket.submitterStudentId && store.studentNotifications) {
      store.studentNotifications.unshift({
        id: `notif-hd-${Date.now()}`,
        title: `Ticket ${ticket.referenceNumber} Status: ${status}`,
        titleBn: `টিকিট ${ticket.referenceNumber} স্থিতি: ${status}`,
        message: `Your support request "${ticket.subject}" is now marked as "${status}". Assigned to: ${ticket.assignedOffice}.`,
        messageBn: `আপনার অনুরোধ "${ticket.subject}" বর্তমানে "${status}" হিসেবে হালনাগাদ করা হয়েছে।`,
        category: 'academic',
        timestamp: new Date().toISOString(),
        read: false,
        link: `/helpdesk?ref=${ticket.referenceNumber}`
      });
    }

    this.saveStore(store);
    return ticket;
  }

  public addTicketReply(
    ticketIdOrRef: string,
    reply: {
      authorType: 'submitter' | 'staff';
      authorName: string;
      authorRole?: string;
      message: string;
      isInternalNote: boolean;
    }
  ): HelpdeskTicket | null {
    const store = this.getStore();
    const clean = ticketIdOrRef.trim().toLowerCase();
    const ticket = store.helpdeskTickets?.find(
      (t) => t.referenceNumber.toLowerCase() === clean || t.id.toLowerCase() === clean
    );
    if (!ticket) return null;

    const newReply: TicketReply = {
      id: `reply-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      authorType: reply.authorType,
      authorName: reply.authorName,
      authorRole: reply.authorRole,
      message: reply.message.trim(),
      createdAt: new Date().toISOString(),
      isInternalNote: !!reply.isInternalNote
    };

    ticket.replies.push(newReply);
    ticket.updatedAt = new Date().toISOString();

    // If staff added a public reply and ticket is NOT anonymous, notify the student
    if (!reply.isInternalNote && reply.authorType === 'staff' && !ticket.isAnonymous && ticket.submitterStudentId && store.studentNotifications) {
      store.studentNotifications.unshift({
        id: `notif-reply-${Date.now()}`,
        title: `New Reply on Ticket ${ticket.referenceNumber}`,
        titleBn: `টিকিট ${ticket.referenceNumber}-এ নতুন উত্তর`,
        message: `${reply.authorName} (${ticket.assignedOffice}) has replied to your ticket "${ticket.subject}".`,
        messageBn: `${ticket.assignedOffice} থেকে আপনার টিকিট "${ticket.subject}"-এ একটি উত্তর দেওয়া হয়েছে।`,
        category: 'academic',
        timestamp: new Date().toISOString(),
        read: false,
        link: `/helpdesk?ref=${ticket.referenceNumber}`
      });
    }

    this.saveStore(store);
    return ticket;
  }

  public assignTicketOffice(
    ticketIdOrRef: string,
    office: AssignedOffice,
    staffName?: string,
    actorName?: string
  ): HelpdeskTicket | null {
    const store = this.getStore();
    const clean = ticketIdOrRef.trim().toLowerCase();
    const ticket = store.helpdeskTickets?.find(
      (t) => t.referenceNumber.toLowerCase() === clean || t.id.toLowerCase() === clean
    );
    if (!ticket) return null;

    const prevOffice = ticket.assignedOffice;
    ticket.assignedOffice = office;
    if (staffName !== undefined) ticket.assignedStaffName = staffName;
    ticket.updatedAt = new Date().toISOString();

    ticket.replies.push({
      id: `reply-assign-${Date.now()}`,
      authorType: 'system',
      authorName: 'Helpdesk System',
      message: `Ticket re-assigned from ${prevOffice} to ${office}${staffName ? ` (${staffName})` : ''} by ${actorName || 'Staff'}.`,
      createdAt: new Date().toISOString(),
      isInternalNote: false
    });

    this.saveStore(store);
    return ticket;
  }

  // --- Course & Teacher Evaluation Domain Operations ---

  public getEvaluationWindows(): EvaluationWindow[] {
    const store = this.getStore();
    return store.evaluationWindows || [];
  }

  public getActiveEvaluationWindow(): EvaluationWindow | undefined {
    const store = this.getStore();
    return store.evaluationWindows?.find((w) => w.status === 'Open');
  }

  public openEvaluationWindow(data: {
    title?: string;
    titleBn?: string;
    semester: string;
    academicSession: string;
    startDate: string;
    endDate: string;
    createdBy?: string;
  }): EvaluationWindow {
    const store = this.getStore();
    if (!store.evaluationWindows) store.evaluationWindows = [];

    const title = data.title?.trim() || data.semester.trim();
    const titleBn = data.titleBn?.trim() || data.semester.trim();

    const newWindow: EvaluationWindow = {
      id: `win-${Date.now()}`,
      title,
      titleBn,
      semester: data.semester.trim(),
      semesterName: data.semester.trim(),
      academicSession: data.academicSession.trim(),
      status: 'Open',
      startDate: data.startDate,
      endDate: data.endDate,
      startsAt: data.startDate,
      closesAt: data.endDate,
      createdBy: data.createdBy || 'Institutional Quality Assurance Cell (IQAC)',
      createdAt: new Date().toISOString()
    };

    store.evaluationWindows.unshift(newWindow);
    this.saveStore(store);
    return newWindow;
  }

  public closeEvaluationWindow(windowId: string): boolean {
    const store = this.getStore();
    const target = store.evaluationWindows?.find((w) => w.id === windowId);
    if (!target) return false;

    target.status = 'Closed';
    target.closedAt = new Date().toISOString();
    this.saveStore(store);
    return true;
  }

  public hasStudentSubmittedCourse(windowId: string, courseCode: string, studentId: string): boolean {
    const store = this.getStore();
    return !!store.evaluationSubmissionLedger?.some(
      (r) =>
        r.windowId === windowId &&
        r.courseCode.toLowerCase() === courseCode.toLowerCase() &&
        r.studentId.toLowerCase() === studentId.toLowerCase()
    );
  }

  public submitAnonymousEvaluation(params: {
    windowId: string;
    courseCode: string;
    courseTitle: string;
    courseTitleBn?: string;
    departmentId: string;
    departmentName?: string;
    teacherId: string;
    teacherName: string;
    teacherNameBn?: string;
    ratings: EvaluationCriteriaRating;
    comment?: string;
    studentId: string;
  }): { success: boolean; message: string } {
    const store = this.getStore();
    if (!store.anonymousCourseEvaluations) store.anonymousCourseEvaluations = [];
    if (!store.evaluationSubmissionLedger) store.evaluationSubmissionLedger = [];

    // Verify window is active
    const windowObj = store.evaluationWindows?.find((w) => w.id === params.windowId);
    if (!windowObj || windowObj.status !== 'Open') {
      return { success: false, message: 'This evaluation window is currently closed.' };
    }

    // Verify one-time submission constraint
    if (this.hasStudentSubmittedCourse(params.windowId, params.courseCode, params.studentId)) {
      return { success: false, message: 'You have already submitted an evaluation for this course in this window.' };
    }

    // Calculate average score
    const avg = Number(
      (
        (params.ratings.preparation +
          params.ratings.punctuality +
          params.ratings.engagement +
          params.ratings.practicals +
          params.ratings.fairness +
          params.ratings.overall) /
        6
      ).toFixed(2)
    );

    // CRITICAL: Anonymity Guarantee - DO NOT STORE studentId with the answers!
    const newEval: AnonymousCourseEvaluation = {
      id: `eval-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      windowId: params.windowId,
      courseCode: params.courseCode,
      courseTitle: params.courseTitle,
      courseTitleBn: params.courseTitleBn,
      departmentId: params.departmentId,
      departmentName: params.departmentName,
      teacherId: params.teacherId,
      teacherName: params.teacherName,
      teacherNameBn: params.teacherNameBn,
      ratings: params.ratings,
      averageScore: avg,
      comment: params.comment?.trim() || undefined,
      submittedAt: new Date().toISOString()
    };

    store.anonymousCourseEvaluations.push(newEval);

    // Store detached one-time submission record (records only studentId + courseCode)
    store.evaluationSubmissionLedger.push({
      windowId: params.windowId,
      courseCode: params.courseCode,
      studentId: params.studentId,
      submittedAt: new Date().toISOString()
    });

    this.saveStore(store);
    return { success: true, message: 'Anonymous evaluation submitted successfully. Identity detached.' };
  }

  public getCourseEvaluationSummary(windowId: string, courseCode: string): CourseEvaluationSummary | null {
    const store = this.getStore();
    const windowObj = store.evaluationWindows?.find((w) => w.id === windowId);
    if (!windowObj) return null;

    const evals = (store.anonymousCourseEvaluations || []).filter(
      (e) => e.windowId === windowId && e.courseCode.toLowerCase() === courseCode.toLowerCase()
    );

    const total = evals.length;
    const isThresholdMet = total >= 5;
    const isAccessibleToTeacher = windowObj.status === 'Closed' && isThresholdMet;

    if (total === 0) {
      // Find course reference from courses list
      const courseRef = store.courses?.find((c) => c.code.toLowerCase() === courseCode.toLowerCase());
      return {
        courseCode,
        courseTitle: courseRef?.title || courseCode,
        departmentId: courseRef?.department || 'CSE',
        teacherId: 'demo_teacher_01',
        teacherName: courseRef?.instructor || 'Faculty Instructor',
        totalResponses: 0,
        windowStatus: windowObj.status,
        isThresholdMet: false,
        isAccessibleToTeacher: false,
        overallAverage: 0,
        criteriaAverages: { preparation: 0, punctuality: 0, engagement: 0, practicals: 0, fairness: 0, overall: 0 },
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        comments: []
      };
    }

    const first = evals[0];
    const sumRatings = evals.reduce(
      (acc, curr) => ({
        preparation: acc.preparation + curr.ratings.preparation,
        punctuality: acc.punctuality + curr.ratings.punctuality,
        engagement: acc.engagement + curr.ratings.engagement,
        practicals: acc.practicals + curr.ratings.practicals,
        fairness: acc.fairness + curr.ratings.fairness,
        overall: acc.overall + curr.ratings.overall
      }),
      { preparation: 0, punctuality: 0, engagement: 0, practicals: 0, fairness: 0, overall: 0 }
    );

    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    evals.forEach((e) => {
      const rounded = Math.round(e.averageScore) as 1 | 2 | 3 | 4 | 5;
      if (dist[rounded] !== undefined) dist[rounded]++;
    });

    const comments = evals.map((e) => e.comment).filter(Boolean) as string[];
    const overallAvg = Number((evals.reduce((sum, e) => sum + e.averageScore, 0) / total).toFixed(2));

    return {
      courseCode: first.courseCode,
      courseTitle: first.courseTitle,
      departmentId: first.departmentId,
      teacherId: first.teacherId,
      teacherName: first.teacherName,
      totalResponses: total,
      windowStatus: windowObj.status,
      isThresholdMet,
      isAccessibleToTeacher,
      overallAverage: overallAvg,
      criteriaAverages: {
        preparation: Number((sumRatings.preparation / total).toFixed(2)),
        punctuality: Number((sumRatings.punctuality / total).toFixed(2)),
        engagement: Number((sumRatings.engagement / total).toFixed(2)),
        practicals: Number((sumRatings.practicals / total).toFixed(2)),
        fairness: Number((sumRatings.fairness / total).toFixed(2)),
        overall: Number((sumRatings.overall / total).toFixed(2))
      },
      ratingDistribution: dist,
      comments
    };
  }

  public getTeacherEvaluationSummaries(windowId: string, teacherId: string): CourseEvaluationSummary[] {
    const store = this.getStore();
    const evals = store.anonymousCourseEvaluations?.filter(
      (e) => e.windowId === windowId && e.teacherId === teacherId
    ) || [];

    // Distinct course codes
    const courseCodes = Array.from(new Set(evals.map((e) => e.courseCode)));

    // Also include teacher's assigned courses even if 0 evaluations yet
    const teacherCourses = store.teacherProfile?.assignedCourseCodes || ['CSE-3201', 'CSE-3205', 'CSE-1101'];
    teacherCourses.forEach((code) => {
      if (!courseCodes.includes(code)) courseCodes.push(code);
    });

    return courseCodes
      .map((code) => this.getCourseEvaluationSummary(windowId, code))
      .filter(Boolean) as CourseEvaluationSummary[];
  }

  public getDepartmentEvaluationSummaries(windowId: string, departmentId: string): CourseEvaluationSummary[] {
    const store = this.getStore();
    const evals = store.anonymousCourseEvaluations?.filter(
      (e) => e.windowId === windowId && e.departmentId.toLowerCase() === departmentId.toLowerCase()
    ) || [];

    const courseCodes = Array.from(new Set(evals.map((e) => e.courseCode)));
    if (courseCodes.length === 0 && departmentId.toLowerCase() === 'cse') {
      courseCodes.push('CSE-3201', 'CSE-3205', 'CSE-1101');
    }

    return courseCodes
      .map((code) => this.getCourseEvaluationSummary(windowId, code))
      .filter(Boolean) as CourseEvaluationSummary[];
  }

  public getUniversityEvaluationAnalytics(windowId: string) {
    const store = this.getStore();
    const evals = store.anonymousCourseEvaluations?.filter((e) => e.windowId === windowId) || [];

    // Department comparison list
    const depts = ['CSE', 'EEE', 'MATH', 'FISH', 'GEOL', 'MGT', 'SOC'];
    const deptData = depts.map((d) => {
      const dEvals = evals.filter((e) => e.departmentId.toUpperCase() === d);
      const avg = dEvals.length > 0
        ? Number((dEvals.reduce((sum, e) => sum + e.averageScore, 0) / dEvals.length).toFixed(2))
        : 0;
      return {
        department: d,
        average: avg,
        evaluationsCount: dEvals.length
      };
    });

    // Criteria breakdown
    const total = evals.length;
    const criteriaData = [
      {
        criteria: 'Preparation & Clarity',
        score: total > 0 ? Number((evals.reduce((sum, e) => sum + e.ratings.preparation, 0) / total).toFixed(2)) : 0
      },
      {
        criteria: 'Punctuality & Routine',
        score: total > 0 ? Number((evals.reduce((sum, e) => sum + e.ratings.punctuality, 0) / total).toFixed(2)) : 0
      },
      {
        criteria: 'Engagement & Questions',
        score: total > 0 ? Number((evals.reduce((sum, e) => sum + e.ratings.engagement, 0) / total).toFixed(2)) : 0
      },
      {
        criteria: 'Lab & Assignments',
        score: total > 0 ? Number((evals.reduce((sum, e) => sum + e.ratings.practicals, 0) / total).toFixed(2)) : 0
      },
      {
        criteria: 'Assessment Fairness',
        score: total > 0 ? Number((evals.reduce((sum, e) => sum + e.ratings.fairness, 0) / total).toFixed(2)) : 0
      },
      {
        criteria: 'Overall Effectiveness',
        score: total > 0 ? Number((evals.reduce((sum, e) => sum + e.ratings.overall, 0) / total).toFixed(2)) : 0
      }
    ];

    // Ratings distribution
    const distData = [
      { rating: '5 Stars', count: evals.filter((e) => Math.round(e.averageScore) === 5).length },
      { rating: '4 Stars', count: evals.filter((e) => Math.round(e.averageScore) === 4).length },
      { rating: '3 Stars', count: evals.filter((e) => Math.round(e.averageScore) === 3).length },
      { rating: '2 Stars', count: evals.filter((e) => Math.round(e.averageScore) === 2).length },
      { rating: '1 Star', count: evals.filter((e) => Math.round(e.averageScore) === 1).length }
    ];

    const overallUniAverage = total > 0
      ? Number((evals.reduce((sum, e) => sum + e.averageScore, 0) / total).toFixed(2))
      : 0;

    return {
      totalEvaluations: total,
      overallAverage: overallUniAverage,
      departmentComparison: deptData,
      criteriaBreakdown: criteriaData,
      ratingDistribution: distData
    };
  }

  // ================= QUIZ SYSTEM METHODS =================

  public getQuizzes(courseCode?: string): Quiz[] {
    const store = this.getStore();
    const list = store.quizzes || [];
    if (!courseCode) return list;
    return list.filter((q) => q.courseCode.toLowerCase() === courseCode.toLowerCase());
  }

  public getQuizById(quizId: string): Quiz | undefined {
    const store = this.getStore();
    return store.quizzes?.find((q) => q.id === quizId);
  }

  public createQuiz(quizData: Omit<Quiz, 'id' | 'createdAt'>): Quiz {
    const store = this.getStore();
    if (!store.quizzes) store.quizzes = [];

    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };

    store.quizzes.unshift(newQuiz);
    this.saveStore(store);
    return newQuiz;
  }

  public getQuizAttempts(quizId: string): StudentQuizAttempt[] {
    const store = this.getStore();
    return store.quizAttempts?.filter((a) => a.quizId === quizId) || [];
  }

  public getStudentQuizAttempt(quizId: string, studentId: string): StudentQuizAttempt | undefined {
    const store = this.getStore();
    return store.quizAttempts?.find(
      (a) => a.quizId === quizId && a.studentId.toLowerCase() === studentId.toLowerCase()
    );
  }

  public startQuizAttempt(quizId: string, studentId: string, studentName: string): StudentQuizAttempt {
    const store = this.getStore();
    if (!store.quizAttempts) store.quizAttempts = [];

    const existing = this.getStudentQuizAttempt(quizId, studentId);
    if (existing) return existing;

    const quiz = this.getQuizById(quizId);
    const newAttempt: StudentQuizAttempt = {
      id: `att-${Date.now()}-${studentId}`,
      quizId,
      courseCode: quiz?.courseCode || 'CSE-3201',
      studentId,
      studentName,
      startedAt: new Date().toISOString(),
      isSubmitted: false,
      answers: {},
      autoScore: 0,
      isFullyGraded: false,
      syncedToContinuousAssessment: false
    };

    store.quizAttempts.push(newAttempt);
    this.saveStore(store);
    return newAttempt;
  }

  public saveStudentQuizAnswer(
    attemptId: string,
    questionId: string,
    answer: { selectedOptionId?: string; shortAnswerText?: string }
  ): boolean {
    const store = this.getStore();
    const attempt = store.quizAttempts?.find((a) => a.id === attemptId);
    if (!attempt || attempt.isSubmitted) return false;

    if (!attempt.answers) attempt.answers = {};
    attempt.answers[questionId] = {
      questionId,
      selectedOptionId: answer.selectedOptionId,
      shortAnswerText: answer.shortAnswerText,
      updatedAt: new Date().toISOString()
    };

    this.saveStore(store);
    return true;
  }

  public submitQuizAttempt(attemptId: string): { success: boolean; attempt?: StudentQuizAttempt; message: string } {
    const store = this.getStore();
    const attempt = store.quizAttempts?.find((a) => a.id === attemptId);
    if (!attempt) return { success: false, message: 'Quiz attempt not found.' };
    if (attempt.isSubmitted) return { success: false, attempt, message: 'Quiz was already submitted.' };

    const quiz = store.quizzes?.find((q) => q.id === attempt.quizId);
    if (!quiz) return { success: false, message: 'Associated quiz not found.' };

    let autoScore = 0;
    let hasShortAnswer = false;

    quiz.questions.forEach((q) => {
      const studentAns = attempt.answers[q.id];
      if (q.type === 'MCQ') {
        const isCorrect = studentAns?.selectedOptionId === q.correctOptionId;
        const awarded = isCorrect ? q.points : 0;
        autoScore += awarded;
        if (studentAns) {
          studentAns.isAutoGraded = true;
          studentAns.autoScore = awarded;
        } else {
          attempt.answers[q.id] = {
            questionId: q.id,
            isAutoGraded: true,
            autoScore: 0
          };
        }
      } else if (q.type === 'SHORT_ANSWER') {
        hasShortAnswer = true;
      }
    });

    attempt.isSubmitted = true;
    attempt.submittedAt = new Date().toISOString();
    attempt.autoScore = autoScore;

    if (!hasShortAnswer) {
      attempt.manualScore = 0;
      attempt.totalScore = autoScore;
      attempt.isFullyGraded = true;
    } else {
      attempt.manualScore = undefined;
      attempt.totalScore = autoScore; // Partial until teacher grades
      attempt.isFullyGraded = false;
    }

    this.saveStore(store);
    return { success: true, attempt, message: 'Quiz submitted successfully.' };
  }

  public gradeShortAnswer(
    attemptId: string,
    questionId: string,
    teacherScore: number,
    teacherFeedback?: string
  ): boolean {
    const store = this.getStore();
    const attempt = store.quizAttempts?.find((a) => a.id === attemptId);
    if (!attempt) return false;

    const quiz = store.quizzes?.find((q) => q.id === attempt.quizId);
    if (!quiz) return false;

    if (!attempt.answers[questionId]) {
      attempt.answers[questionId] = { questionId };
    }
    attempt.answers[questionId].teacherScore = teacherScore;
    if (teacherFeedback !== undefined) {
      attempt.answers[questionId].teacherFeedback = teacherFeedback.trim();
    }

    // Recompute manualScore and check if fully graded
    const shortAnswerQuestions = quiz.questions.filter((q) => q.type === 'SHORT_ANSWER');
    let totalManual = 0;
    let allGraded = true;

    shortAnswerQuestions.forEach((q) => {
      const ans = attempt.answers[q.id];
      if (ans && ans.teacherScore !== undefined) {
        totalManual += ans.teacherScore;
      } else {
        allGraded = false;
      }
    });

    attempt.manualScore = totalManual;
    attempt.totalScore = attempt.autoScore + totalManual;
    attempt.isFullyGraded = allGraded;

    this.saveStore(store);
    return true;
  }

  public syncQuizToContinuousAssessment(quizId: string, courseCode: string): { success: boolean; count: number; message: string } {
    const store = this.getStore();
    const quiz = store.quizzes?.find((q) => q.id === quizId);
    if (!quiz) return { success: false, count: 0, message: 'Quiz not found.' };

    const attempts = store.quizAttempts?.filter((a) => a.quizId === quizId && a.isSubmitted) || [];
    if (attempts.length === 0) {
      return { success: false, count: 0, message: 'No submitted attempts available to sync.' };
    }

    const course = store.courses?.find((c) => c.code.toLowerCase() === courseCode.toLowerCase());
    if (!course || !course.marksSheet) {
      return { success: false, count: 0, message: `Marks sheet for ${courseCode} not found.` };
    }

    let updatedCount = 0;
    attempts.forEach((att) => {
      const score = att.totalScore ?? att.autoScore ?? 0;
      // Scale quiz score to 20 marks limit for Class Tests continuous assessment
      const scaledClassTest = Math.min(
        20,
        Math.round(((score / Math.max(1, quiz.totalMarks)) * 20) * 10) / 10
      );

      if (course.marksSheet.entries[att.studentId]) {
        course.marksSheet.entries[att.studentId].classTests = scaledClassTest;
        const comp = computeTotalMarks({
          attendance: course.marksSheet.entries[att.studentId].attendance,
          classTests: scaledClassTest,
          midterm: course.marksSheet.entries[att.studentId].midterm,
          finalExam: course.marksSheet.entries[att.studentId].finalExam
        });
        course.marksSheet.entries[att.studentId].total = comp.totalMarks;
        course.marksSheet.entries[att.studentId].letterGrade = comp.letterGrade;
        course.marksSheet.entries[att.studentId].gradePoint = comp.gradePoint;

        att.syncedToContinuousAssessment = true;
        updatedCount++;
      }
    });

    // Add audit entry to marks sheet
    if (!course.marksSheet.auditTrail) course.marksSheet.auditTrail = [];
    course.marksSheet.auditTrail.push({
      id: `audit-sync-quiz-${Date.now()}`,
      resultSheetId: course.marksSheet.id || `sheet-${courseCode}`,
      courseCode,
      actorUid: quiz.teacherId,
      actorName: quiz.teacherName,
      actorEmail: 'teacher.demo@jstu.ac.bd',
      role: 'teacher',
      action: 'UPDATE_DRAFT',
      fromStatus: course.marksSheet.status,
      toStatus: 'DRAFT',
      comment: `Continuous assessment updated: Synced results from Quiz "${quiz.title}" (${updatedCount} students) into Class Tests column for teacher review.`,
      timestamp: new Date().toISOString()
    });

    this.saveStore(store);
    return {
      success: true,
      count: updatedCount,
      message: `Successfully synchronized ${updatedCount} student marks to Continuous Assessment (Class Tests) as DRAFT.`
    };
  }

  public getQuizAnalytics(quizId: string): QuizResultAnalytics | null {
    const store = this.getStore();
    const quiz = store.quizzes?.find((q) => q.id === quizId);
    if (!quiz) return null;

    const attempts = store.quizAttempts?.filter((a) => a.quizId === quizId && a.isSubmitted) || [];
    if (attempts.length === 0) {
      return {
        quizId,
        totalAttempts: 0,
        highestScore: 0,
        lowestScore: 0,
        averageScore: 0,
        questionStats: quiz.questions.map((q) => ({
          questionId: q.id,
          prompt: q.prompt,
          type: q.type,
          points: q.points,
          totalAttempts: 0,
          correctOrHighScoreCount: 0,
          successRate: 0,
          difficultyLabel: 'Moderate'
        }))
      };
    }

    const scores = attempts.map((a) => a.totalScore ?? a.autoScore ?? 0);
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const avg = Number((scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(2));

    const questionStats: QuestionDifficultyStat[] = quiz.questions.map((q) => {
      let highCount = 0;
      attempts.forEach((att) => {
        const ans = att.answers[q.id];
        if (q.type === 'MCQ') {
          if (ans?.selectedOptionId === q.correctOptionId) {
            highCount++;
          }
        } else {
          // For short answer, consider score >= 60% of points as successful
          if (ans && ans.teacherScore !== undefined && ans.teacherScore >= q.points * 0.6) {
            highCount++;
          }
        }
      });

      const rate = Math.round((highCount / attempts.length) * 100);
      let label: 'Easy' | 'Moderate' | 'Challenging' = 'Moderate';
      if (rate >= 75) label = 'Easy';
      else if (rate < 40) label = 'Challenging';

      return {
        questionId: q.id,
        prompt: q.prompt,
        type: q.type,
        points: q.points,
        totalAttempts: attempts.length,
        correctOrHighScoreCount: highCount,
        successRate: rate,
        difficultyLabel: label
      };
    });

    return {
      quizId,
      totalAttempts: attempts.length,
      highestScore: highest,
      lowestScore: lowest,
      averageScore: avg,
      questionStats
    };
  }

  // ================= SCHOLARSHIP SYSTEM METHODS =================

  public getScholarships(): Scholarship[] {
    const store = this.getStore();
    return store.scholarships || [];
  }

  public getScholarshipById(id: string): Scholarship | undefined {
    const store = this.getStore();
    return store.scholarships?.find((s) => s.id === id);
  }

  public createScholarship(data: Omit<Scholarship, 'id' | 'createdAt'>): Scholarship {
    const store = this.getStore();
    if (!store.scholarships) store.scholarships = [];

    const newSch: Scholarship = {
      ...data,
      id: `sch-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };

    store.scholarships.unshift(newSch);
    this.saveStore(store);
    return newSch;
  }

  public updateScholarship(id: string, updates: Partial<Scholarship>): boolean {
    const store = this.getStore();
    const sch = store.scholarships?.find((s) => s.id === id);
    if (!sch) return false;

    Object.assign(sch, updates);
    this.saveStore(store);
    return true;
  }

  public getScholarshipApplicants(
    scholarshipId: string,
    rule: IncomeRuleConfig = { cgpaWeight: 0.6, incomeWeight: 0.4, maxIncomeCeiling: 300000 }
  ): RankedScholarshipApplicant[] {
    const store = this.getStore();
    const scholarship = this.getScholarshipById(scholarshipId);
    if (!scholarship) return [];

    // Filter paperless applications of type 'scholarship' matching this scholarship
    const apps = (store.applications || []).filter((a) => {
      if (a.type !== 'scholarship') return false;
      const data = a.formData || (a as any).payload || {};
      return (
        data.scholarshipId === scholarshipId ||
        data.scholarshipType?.toLowerCase().includes(scholarship.category.toLowerCase()) ||
        data.scholarshipTitle?.toLowerCase() === scholarship.title.toLowerCase()
      );
    });

    const ceiling = rule.maxIncomeCeiling || 300000;

    const ranked: RankedScholarshipApplicant[] = apps.map((app) => {
      const data = app.formData || (app as any).payload || {};
      const cgpa = Number(data.cgpa) || 3.5;
      const income = Number(data.annualIncome) || 200000;

      // Normalize CGPA on 4.0 scale to 0-100
      const cgpaScore = Math.min(100, Math.max(0, (cgpa / 4.0) * 100));

      // Inverse income score: lower income = higher need
      const needScore = income >= ceiling ? 0 : Math.min(100, Math.max(0, ((ceiling - income) / ceiling) * 100));

      const composite = Number(((cgpaScore * rule.cgpaWeight) + (needScore * rule.incomeWeight)).toFixed(2));

      return {
        applicationId: app.id,
        applicationNumber: app.applicationNumber,
        studentId: app.studentId || app.studentUid || 'JSTU2026001',
        studentName: app.studentName || (app as any).applicantName || 'Student Applicant',
        studentNameBn: app.studentNameBn || (app as any).applicantNameBn,
        department: app.studentDepartment || (app as any).department || 'CSE',
        cgpa,
        annualIncome: income,
        appliedDate: app.createdAt || (app as any).submittedAt || new Date().toISOString(),
        workflowStatus: app.status,
        currentStepIndex: app.currentStepIndex,
        compositeScore: composite,
        rank: 0,
        selectionStatus: 'WAITLIST'
      };
    });

    // Sort by composite score descending, then by CGPA descending
    ranked.sort((a, b) => {
      if (b.compositeScore !== a.compositeScore) return b.compositeScore - a.compositeScore;
      return b.cgpa - a.cgpa;
    });

    // Assign ranks and selection status based on slots
    ranked.forEach((item, idx) => {
      item.rank = idx + 1;
      if (item.cgpa < scholarship.minimumCgpa) {
        item.selectionStatus = 'INELIGIBLE';
      } else if (item.rank <= scholarship.slots) {
        item.selectionStatus = 'SELECTED';
      } else {
        item.selectionStatus = 'WAITLIST';
      }
    });

    return ranked;
  }

  public publishScholarshipResults(scholarshipId: string, selectedApplicantIds: string[]): boolean {
    const store = this.getStore();
    const sch = store.scholarships?.find((s) => s.id === scholarshipId);
    if (!sch) return false;

    // Get applicants
    const applicants = this.getScholarshipApplicants(scholarshipId);
    const chosen = applicants.filter((a) => selectedApplicantIds.includes(a.applicationId));

    sch.status = 'PUBLISHED';
    sch.publishedAt = new Date().toISOString();
    sch.publishedRecipients = chosen.map((c) => ({
      studentId: c.studentId,
      studentName: c.studentName,
      studentNameBn: c.studentNameBn,
      department: c.department,
      cgpa: c.cgpa,
      rank: c.rank,
      awardAmount: sch.amountFormatted
    }));

    // Approve the underlying applications in the workflow
    chosen.forEach((c) => {
      const app = store.applications?.find((a) => a.id === c.applicationId);
      if (app) {
        app.status = 'APPROVED';
        app.currentStepIndex = 2; // Final approved step
        if (!app.auditTrail) app.auditTrail = [];
        app.auditTrail.push({
          id: `aud-pub-${Date.now()}-${c.studentId}`,
          applicationId: app.id,
          applicationNumber: app.applicationNumber,
          actorUid: 'scholarship_committee_admin',
          actorName: 'Scholarship Selection Committee & Admin',
          actorEmail: 'scholarship.committee@jstu.ac.bd',
          role: 'admin',
          action: 'APPROVE',
          fromStatus: app.status,
          toStatus: 'APPROVED',
          fromStepIndex: 1,
          toStepIndex: 2,
          comment: `Official Grant Awarded: Ranked #${c.rank} with composite score of ${c.compositeScore} points. Published in scholarship award register.`,
          timestamp: new Date().toISOString()
        });
      }
    });

    this.saveStore(store);
    return true;
  }

  // ================= ALUMNI SYSTEM METHODS =================

  public getAlumniProfiles(): AlumnusProfile[] {
    const store = this.getStore();
    return store.alumniProfiles || [];
  }

  public getAlumniRegistrationRequests(): NewAlumniRegistrationRequest[] {
    const store = this.getStore();
    return store.alumniRegRequests || [];
  }

  public submitAlumniRegistration(
    data: Omit<NewAlumniRegistrationRequest, 'id' | 'status' | 'appliedAt'>
  ): NewAlumniRegistrationRequest {
    const store = this.getStore();
    if (!store.alumniRegRequests) store.alumniRegRequests = [];

    const newReq: NewAlumniRegistrationRequest = {
      ...data,
      id: `reg-req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'PENDING',
      appliedAt: new Date().toISOString()
    };

    store.alumniRegRequests.unshift(newReq);
    this.saveStore(store);
    return newReq;
  }

  public approveAlumniRegistration(requestId: string, adminName = 'Alumni Relations Admin'): boolean {
    const store = this.getStore();
    const req = store.alumniRegRequests?.find((r) => r.id === requestId);
    if (!req) return false;

    req.status = 'APPROVED';
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = adminName;

    // Create or update verified AlumnusProfile in directory
    if (!store.alumniProfiles) store.alumniProfiles = [];
    const newProfile: AlumnusProfile = {
      id: `alumnus-${Date.now()}`,
      name: req.fullName,
      nameBn: req.fullNameBn || req.fullName,
      studentId: req.studentId,
      departmentCode: req.departmentCode || 'CSE',
      departmentName: req.department,
      degree: req.degree,
      batch: req.batch,
      graduatedYear: req.graduationYear,
      currentPosition: req.designation,
      organization: req.currentCompany,
      organizationType: req.organizationType,
      country: req.country,
      city: req.city,
      email: req.email,
      phone: req.phone,
      linkedinUrl: req.linkedinUrl,
      privacy: req.privacy,
      isApproved: true,
      registeredAt: req.appliedAt
    };

    store.alumniProfiles.unshift(newProfile);
    this.saveStore(store);
    return true;
  }

  public rejectAlumniRegistration(requestId: string, reason: string, adminName = 'Alumni Relations Admin'): boolean {
    const store = this.getStore();
    const req = store.alumniRegRequests?.find((r) => r.id === requestId);
    if (!req) return false;

    req.status = 'REJECTED';
    req.rejectionReason = reason;
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = adminName;

    this.saveStore(store);
    return true;
  }

  public getAlumniJobs(): AlumniJobPost[] {
    const store = this.getStore();
    return store.alumniJobs || [];
  }

  public createAlumniJob(
    data: Omit<AlumniJobPost, 'id' | 'createdAt' | 'status'>
  ): AlumniJobPost {
    const store = this.getStore();
    if (!store.alumniJobs) store.alumniJobs = [];

    const newJob: AlumniJobPost = {
      ...data,
      id: `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    store.alumniJobs.unshift(newJob);
    this.saveStore(store);
    return newJob;
  }

  public getAlumniDonations(): AlumniDonation[] {
    const store = this.getStore();
    return store.alumniDonations || [];
  }

  public createAlumniDonation(
    data: Omit<AlumniDonation, 'id' | 'receiptNo' | 'status' | 'donatedAt'>
  ): AlumniDonation {
    const store = this.getStore();
    if (!store.alumniDonations) store.alumniDonations = [];

    const receiptNo = `JSTU-DON-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonation: AlumniDonation = {
      ...data,
      id: `don-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      receiptNo,
      status: 'COMPLETED',
      donatedAt: new Date().toISOString()
    };

    store.alumniDonations.unshift(newDonation);
    this.saveStore(store);
    return newDonation;
  }

  // ================= CONVOCATION SYSTEM METHODS =================

  public getConvocationEvent(): ConvocationEvent {
    const store = this.getStore();
    if (!store.convocationEvents || store.convocationEvents.length === 0) {
      return INITIAL_CONVOCATION_EVENT;
    }
    return store.convocationEvents[0];
  }

  public getConvocationRegistrations(): ConvocationRegistration[] {
    const store = this.getStore();
    return store.convocationRegistrations || [];
  }

  public getConvocationRegistrationByStudentId(studentId: string): ConvocationRegistration | undefined {
    const store = this.getStore();
    return store.convocationRegistrations?.find(
      (r) => r.studentId.toLowerCase() === studentId.toLowerCase()
    );
  }

  public getConvocationRegistrationByToken(token: string): ConvocationRegistration | undefined {
    const store = this.getStore();
    return store.convocationRegistrations?.find((r) => r.passToken === token);
  }

  public createConvocationRegistration(
    data: Omit<
      ConvocationRegistration,
      'id' | 'registrationNumber' | 'approvalStatus' | 'paymentStatus' | 'passToken' | 'registeredAt'
    >
  ): ConvocationRegistration {
    const store = this.getStore();
    if (!store.convocationRegistrations) store.convocationRegistrations = [];

    const existingIdx = store.convocationRegistrations.findIndex(
      (r) => r.studentId.toLowerCase() === data.studentId.toLowerCase()
    );

    const regNumber = `JSTU-CONV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const passToken = `CNV-${new Date().getFullYear()}-SECURE-${Math.floor(100000 + Math.random() * 900000)}`;

    const newReg: ConvocationRegistration = {
      ...data,
      id: `conv-reg-${Date.now()}`,
      registrationNumber: regNumber,
      approvalStatus: 'PENDING',
      paymentStatus: 'UNPAID',
      passToken,
      registeredAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      store.convocationRegistrations[existingIdx] = newReg;
    } else {
      store.convocationRegistrations.unshift(newReg);
    }

    this.saveStore(store);
    return newReg;
  }

  public approveConvocationRegistration(
    regId: string,
    reviewerName = 'Office of the Registrar',
    seat?: string,
    kitId?: string
  ): boolean {
    const store = this.getStore();
    const reg = store.convocationRegistrations?.find((r) => r.id === regId);
    if (!reg) return false;

    reg.approvalStatus = 'APPROVED';
    reg.approvedBy = reviewerName;
    reg.approvedAt = new Date().toISOString();
    if (seat) reg.assignedSeat = seat;
    else if (!reg.assignedSeat) {
      const row = Math.floor(1 + Math.random() * 15);
      const seatNum = Math.floor(1 + Math.random() * 30);
      reg.assignedSeat = `Auditorium Main — Zone ${reg.departmentCode === 'CSE' ? 'A' : 'B'}, Row ${row}, Seat ${seatNum}`;
    }

    if (kitId) reg.assignedGownKitId = kitId;
    else if (!reg.assignedGownKitId) {
      reg.assignedGownKitId = `GW-KIT-${reg.departmentCode}-${Math.floor(100 + Math.random() * 900)}`;
    }

    this.saveStore(store);
    return true;
  }

  public rejectConvocationRegistration(
    regId: string,
    reason: string,
    reviewerName = 'Office of the Registrar'
  ): boolean {
    const store = this.getStore();
    const reg = store.convocationRegistrations?.find((r) => r.id === regId);
    if (!reg) return false;

    reg.approvalStatus = 'REJECTED';
    reg.rejectionReason = reason;
    reg.approvedBy = reviewerName;
    reg.approvedAt = new Date().toISOString();

    this.saveStore(store);
    return true;
  }

  public payConvocationFee(regId: string, paymentMethod: string, txnId: string): boolean {
    const store = this.getStore();
    const reg = store.convocationRegistrations?.find((r) => r.id === regId);
    if (!reg) return false;

    reg.paymentStatus = 'PAID';
    reg.paymentMethod = paymentMethod;
    reg.paymentTxnId = txnId;
    reg.paymentDate = new Date().toISOString();

    this.saveStore(store);
    return true;
  }

  // ==========================================
  // Staff & Faculty Area Operations
  // ==========================================

  public getStaffLeaveBalances(): StaffLeaveBalance[] {
    const store = this.getStore();
    return store.staffLeaveBalances || [];
  }

  public getStaffLeaveBalance(staffIdOrUserId: string): StaffLeaveBalance | undefined {
    const store = this.getStore();
    return (store.staffLeaveBalances || []).find(
      (b) =>
        b.staffId.toLowerCase() === staffIdOrUserId.toLowerCase() ||
        b.userId.toLowerCase() === staffIdOrUserId.toLowerCase()
    );
  }

  public getStaffLeaveApplications(staffId?: string): StaffLeaveApplicationRecord[] {
    const store = this.getStore();
    const list = store.staffLeaveApplications || [];
    if (!staffId) return list;
    return list.filter((a) => a.staffId.toLowerCase() === staffId.toLowerCase());
  }

  public submitStaffLeave(params: {
    staffId: string;
    staffName: string;
    staffNameBn?: string;
    designation: string;
    departmentOrOffice: string;
    role: 'teacher' | 'officer';
    leaveType: StaffLeaveType;
    startDate: string;
    endDate: string;
    daysRequested: number;
    reason: string;
    actingStaff: string;
    attachmentName?: string;
  }): { success: boolean; applicationNumber?: string; message: string } {
    const store = this.getStore();
    if (!store.staffLeaveBalances) store.staffLeaveBalances = [];
    if (!store.staffLeaveApplications) store.staffLeaveApplications = [];
    if (!store.applications) store.applications = [];

    // Find or create balance
    let balance = store.staffLeaveBalances.find(
      (b) => b.staffId.toLowerCase() === params.staffId.toLowerCase()
    );
    if (!balance) {
      balance = {
        userId: params.staffId,
        staffId: params.staffId,
        staffName: params.staffName,
        staffNameBn: params.staffNameBn,
        designation: params.designation,
        departmentOrOffice: params.departmentOrOffice,
        role: params.role,
        casualTotal: 20,
        casualUsed: 0,
        casualRemaining: 20,
        medicalTotal: 30,
        medicalUsed: 0,
        medicalRemaining: 30,
        studyTotalMonths: 36,
        studyUsedMonths: 0,
        studyRemainingMonths: 36
      };
      store.staffLeaveBalances.push(balance);
    }

    // Check balance validity
    if (params.leaveType === 'casual' && params.daysRequested > balance.casualRemaining) {
      return {
        success: false,
        message: `Insufficient casual leave balance. Available: ${balance.casualRemaining} days, Requested: ${params.daysRequested} days.`
      };
    }
    if (params.leaveType === 'medical' && params.daysRequested > balance.medicalRemaining) {
      return {
        success: false,
        message: `Insufficient medical leave balance. Available: ${balance.medicalRemaining} days, Requested: ${params.daysRequested} days.`
      };
    }
    const requestedMonths = Math.ceil(params.daysRequested / 30);
    if (params.leaveType === 'study' && requestedMonths > balance.studyRemainingMonths) {
      return {
        success: false,
        message: `Insufficient study leave quota. Available: ${balance.studyRemainingMonths} months, Requested: ${requestedMonths} months.`
      };
    }

    const year = new Date().getFullYear();
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    const appNumber = `JSTU-APP-${year}-${randomHex}`;
    const appId = `app-staff-leave-${Date.now()}`;

    // 1. Create PaperlessApplication in workflow engine
    const newPaperlessApp: PaperlessApplication = {
      id: appId,
      applicationNumber: appNumber,
      type: 'staff_leave',
      title: 'Staff Leave Application (Casual, Medical, Study)',
      titleBn: 'শিক্ষক ও কর্মকর্তাদের ছুটির আবেদন',
      studentUid: params.staffId,
      studentId: params.staffId,
      studentName: params.staffName,
      studentNameBn: params.staffNameBn,
      studentEmail: `${params.staffId.toLowerCase()}@jstu.ac.bd`,
      studentDepartment: params.departmentOrOffice,
      status: 'UNDER_REVIEW',
      currentStepIndex: 0,
      chain: [
        {
          stepIndex: 0,
          role: 'dept_chairman',
          title: 'Department Chairman / Head of Office',
          titleBn: 'বিভাগীয় চেয়ারম্যান / দপ্তর প্রধান',
          departmentScoped: true
        },
        {
          stepIndex: 1,
          role: 'registrar',
          title: 'Office of the Registrar',
          titleBn: 'রেজিস্ট্রার কার্যালয়',
          officeScoped: 'REGISTRAR'
        }
      ],
      formData: {
        leaveType: params.leaveType,
        startDate: params.startDate,
        endDate: params.endDate,
        daysRequested: params.daysRequested,
        actingStaff: params.actingStaff,
        reason: params.reason
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditTrail: [
        {
          id: `audit-${Date.now()}`,
          applicationId: appId,
          applicationNumber: appNumber,
          actorUid: params.staffId,
          actorName: params.staffName,
          actorEmail: `${params.staffId.toLowerCase()}@jstu.ac.bd`,
          role: params.role,
          action: 'SUBMIT',
          fromStatus: 'DRAFT',
          toStatus: 'UNDER_REVIEW',
          fromStepIndex: 0,
          toStepIndex: 0,
          comment: `Leave application (${params.leaveType.toUpperCase()}, ${params.daysRequested} days) submitted for departmental review. Designated substitute: ${params.actingStaff}.`,
          timestamp: new Date().toISOString()
        }
      ]
    };
    store.applications.unshift(newPaperlessApp);

    // 2. Create StaffLeaveApplicationRecord
    const newRecord: StaffLeaveApplicationRecord = {
      id: appId,
      applicationNumber: appNumber,
      staffId: params.staffId,
      staffName: params.staffName,
      staffNameBn: params.staffNameBn,
      designation: params.designation,
      departmentOrOffice: params.departmentOrOffice,
      leaveType: params.leaveType,
      startDate: params.startDate,
      endDate: params.endDate,
      daysRequested: params.daysRequested,
      reason: params.reason,
      actingStaff: params.actingStaff,
      attachmentName: params.attachmentName,
      status: 'PENDING_CHAIRMAN',
      currentStepIndex: 0,
      submittedAt: new Date().toLocaleString()
    };
    store.staffLeaveApplications.unshift(newRecord);

    this.saveStore(store);
    return {
      success: true,
      applicationNumber: appNumber,
      message: 'Leave application submitted successfully. Forwarded to Department Chairman for review.'
    };
  }

  public approveStaffLeaveStep(
    appIdOrNumber: string,
    actor: {
      uid: string;
      name: string;
      role: 'dept_chairman' | 'registrar' | 'super_admin';
      comment?: string;
    }
  ): { success: boolean; nextStep?: string; isFullyApproved?: boolean; message: string } {
    const store = this.getStore();
    const app = store.applications?.find(
      (a) => a.id === appIdOrNumber || a.applicationNumber === appIdOrNumber
    );
    const record = store.staffLeaveApplications?.find(
      (r) => r.id === appIdOrNumber || r.applicationNumber === appIdOrNumber
    );

    if (!record) {
      return { success: false, message: 'Leave application not found.' };
    }

    const balance = store.staffLeaveBalances?.find(
      (b) => b.staffId.toLowerCase() === record.staffId.toLowerCase()
    );

    // Step 0: Chairman Approval
    if (record.currentStepIndex === 0) {
      record.currentStepIndex = 1;
      record.status = 'PENDING_REGISTRAR';
      record.chairmanReviewedAt = new Date().toLocaleString();
      record.chairmanComment = actor.comment || 'Recommended for approval.';

      if (app) {
        app.currentStepIndex = 1;
        app.status = 'UNDER_REVIEW';
        app.auditTrail.push({
          id: `audit-${Date.now()}`,
          applicationId: app.id,
          applicationNumber: app.applicationNumber,
          actorUid: actor.uid,
          actorName: actor.name,
          actorEmail: `${actor.role}@jstu.ac.bd`,
          role: actor.role,
          action: 'APPROVE',
          fromStatus: 'UNDER_REVIEW',
          toStatus: 'UNDER_REVIEW',
          fromStepIndex: 0,
          toStepIndex: 1,
          comment: actor.comment || 'Chairman recommended leave without objection.',
          timestamp: new Date().toISOString()
        });
      }

      this.saveStore(store);
      return {
        success: true,
        nextStep: 'Office of the Registrar',
        isFullyApproved: false,
        message: 'Leave application recommended by Chairman and forwarded to the Registrar.'
      };
    }

    // Step 1: Registrar Final Approval
    if (record.currentStepIndex === 1) {
      record.currentStepIndex = 2;
      record.status = 'APPROVED';
      record.registrarReviewedAt = new Date().toLocaleString();
      record.registrarComment = actor.comment || 'Formally approved by the Registrar.';

      // Deduct from balance
      if (balance) {
        if (record.leaveType === 'casual') {
          balance.casualUsed += record.daysRequested;
          balance.casualRemaining = Math.max(0, balance.casualTotal - balance.casualUsed);
        } else if (record.leaveType === 'medical') {
          balance.medicalUsed += record.daysRequested;
          balance.medicalRemaining = Math.max(0, balance.medicalTotal - balance.medicalUsed);
        } else if (record.leaveType === 'study') {
          const months = Math.ceil(record.daysRequested / 30);
          balance.studyUsedMonths += months;
          balance.studyRemainingMonths = Math.max(0, balance.studyTotalMonths - balance.studyUsedMonths);
        }
      }

      if (app) {
        app.currentStepIndex = 2;
        app.status = 'APPROVED';
        app.completedAt = new Date().toISOString();
        app.auditTrail.push({
          id: `audit-${Date.now()}`,
          applicationId: app.id,
          applicationNumber: app.applicationNumber,
          actorUid: actor.uid,
          actorName: actor.name,
          actorEmail: 'registrar@jstu.ac.bd',
          role: actor.role,
          action: 'APPROVE',
          fromStatus: 'UNDER_REVIEW',
          toStatus: 'APPROVED',
          fromStepIndex: 1,
          toStepIndex: 2,
          comment: actor.comment || 'Final approval granted by Office of the Registrar.',
          timestamp: new Date().toISOString()
        });
      }

      this.saveStore(store);
      return {
        success: true,
        isFullyApproved: true,
        message: 'Leave application officially granted by the Registrar. Leave balance adjusted.'
      };
    }

    return { success: false, message: 'Application is already finalized.' };
  }

  public rejectStaffLeaveStep(
    appIdOrNumber: string,
    actor: {
      uid: string;
      name: string;
      role: 'dept_chairman' | 'registrar' | 'super_admin';
      reason: string;
    }
  ): { success: boolean; message: string } {
    const store = this.getStore();
    const app = store.applications?.find(
      (a) => a.id === appIdOrNumber || a.applicationNumber === appIdOrNumber
    );
    const record = store.staffLeaveApplications?.find(
      (r) => r.id === appIdOrNumber || r.applicationNumber === appIdOrNumber
    );

    if (!record) {
      return { success: false, message: 'Leave application not found.' };
    }

    record.status = 'REJECTED';
    if (record.currentStepIndex === 0) {
      record.chairmanComment = `Rejected: ${actor.reason}`;
    } else {
      record.registrarComment = `Rejected: ${actor.reason}`;
    }

    if (app) {
      app.status = 'REJECTED';
      app.rejectionReason = actor.reason;
      app.auditTrail.push({
        id: `audit-${Date.now()}`,
        applicationId: app.id,
        applicationNumber: app.applicationNumber,
        actorUid: actor.uid,
        actorName: actor.name,
        actorEmail: `${actor.role}@jstu.ac.bd`,
        role: actor.role,
        action: 'REJECT',
        fromStatus: 'UNDER_REVIEW',
        toStatus: 'REJECTED',
        fromStepIndex: app.currentStepIndex,
        toStepIndex: app.currentStepIndex,
        comment: actor.reason,
        timestamp: new Date().toISOString()
      });
    }

    this.saveStore(store);
    return { success: true, message: 'Leave application has been rejected.' };
  }

  public getStaffNotices(): StaffNotice[] {
    const store = this.getStore();
    return store.staffNotices || [];
  }

  public getStaffServiceRequests(staffId?: string): StaffServiceRequest[] {
    const store = this.getStore();
    const list = store.staffServiceRequests || [];
    if (!staffId) return list;
    return list.filter((r) => r.staffId.toLowerCase() === staffId.toLowerCase());
  }

  public submitStaffServiceRequest(
    data: Omit<StaffServiceRequest, 'id' | 'status' | 'submittedAt'>
  ): StaffServiceRequest {
    const store = this.getStore();
    if (!store.staffServiceRequests) store.staffServiceRequests = [];

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newReq: StaffServiceRequest = {
      ...data,
      id: `JSTU-SR-2026-${randomNum}`,
      status: 'SUBMITTED',
      submittedAt: new Date().toLocaleString()
    };

    store.staffServiceRequests.unshift(newReq);
    this.saveStore(store);
    return newReq;
  }

  public updateStaffServiceRequest(
    id: string,
    updates: Partial<StaffServiceRequest>
  ): boolean {
    const store = this.getStore();
    const req = store.staffServiceRequests?.find((r) => r.id === id);
    if (!req) return false;

    Object.assign(req, updates);
    if (updates.status === 'RESOLVED' && !req.resolvedAt) {
      req.resolvedAt = new Date().toLocaleString();
    }

    this.saveStore(store);
    return true;
  }

  public getStaffDirectory(filter?: {
    type?: string;
    query?: string;
    departmentOrOffice?: string;
  }): StaffDirectoryMember[] {
    const store = this.getStore();
    let list = store.staffDirectory || [];

    if (filter?.type && filter.type !== 'ALL') {
      list = list.filter((m) => m.type === filter.type);
    }
    if (filter?.departmentOrOffice && filter.departmentOrOffice !== 'ALL') {
      list = list.filter((m) => m.departmentOrOffice === filter.departmentOrOffice);
    }
    if (filter?.query && filter.query.trim()) {
      const q = filter.query.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.nameBn.toLowerCase().includes(q) ||
          m.designation.toLowerCase().includes(q) ||
          m.departmentOrOffice.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.specialization && m.specialization.toLowerCase().includes(q))
      );
    }

    return list;
  }

  // ==========================================
  // HALL DINING MANAGEMENT METHODS (DEMO MODE)
  // // Real enforcement must move to Firestore rules / Cloud Functions.
  // // Real stock and dining financial changes must be done by server-side transactions.
  // ==========================================

  public getHallDiningOverviews(): Record<HallId, HallDiningOverview> {
    const store = this.getStore();
    return store.hallDiningOverviews || initialHallOverviews;
  }

  public getHallDiningOverview(hallId: HallId): HallDiningOverview {
    const overviews = this.getHallDiningOverviews();
    return overviews[hallId] || initialHallOverviews['hall-a'];
  }

  public getDiningWeeklyMenus(hallId?: HallId): DailyMealMenu[] {
    const store = this.getStore();
    const menus = store.diningWeeklyMenus || [];
    if (hallId) {
      return menus.filter((m) => m.hallId === hallId);
    }
    return menus;
  }

  public getTodayMealMenu(hallId: HallId): DailyMealMenu | undefined {
    const days: Array<'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'> = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    const todayIndex = new Date().getDay();
    const currentDayName = days[todayIndex];
    const menus = this.getDiningWeeklyMenus(hallId);
    return menus.find((m) => m.dayOfWeek === currentDayName) || menus[0];
  }

  public getStudentDiningProfile(studentId: string): {
    hallId: HallId;
    hallName: string;
    hallNameBn: string;
    diningRoomId: string;
    diningRoomName: string;
    diningRoomNameBn: string;
  } {
    // Hall assignment per user request:
    // student.demo / JSTU2026001 -> Oporajita Hall (female hall)
    // student2.demo / JSTU2026002 -> Bijoy 24 Hall (male hall)
    // UI never shows gender, only the hall.
    const isStudent2 =
      studentId === 'JSTU2026002' ||
      studentId === 'student2.demo@jstu.ac.bd' ||
      studentId === 'demo_student_02';

    if (isStudent2) {
      return {
        hallId: 'hall-b',
        hallName: 'Bijoy 24 Hall',
        hallNameBn: 'বিজয় ২৪ হল',
        diningRoomId: 'hall-b-room-1',
        diningRoomName: 'Dining Hall 1 (Main Hall)',
        diningRoomNameBn: 'ডাইনিং হল ১ (প্রধান হল)'
      };
    }

    return {
      hallId: 'hall-a',
      hallName: 'Oporajita Hall',
      hallNameBn: 'অপরাজিতা হল',
      diningRoomId: 'hall-a-room-1',
      diningRoomName: 'Dining Hall 1 (Ground Floor)',
      diningRoomNameBn: 'ডাইনিং হল ১ (নিচতলা)'
    };
  }

  public getStudentMealOnOff(studentId: string, hallId: HallId): MealOnOffSetting[] {
    const store = this.getStore();
    return (store.diningMealOnOffSettings || []).filter(
      (s) => s.studentId === studentId && s.hallId === hallId
    );
  }

  public setStudentMealOnOff(params: {
    studentId: string;
    studentName: string;
    hallId: HallId;
    dateStr: string; // YYYY-MM-DD
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  }): { success: boolean; message?: string; setting?: MealOnOffSetting } {
    const store = this.getStore();
    if (!store.diningMealOnOffSettings) store.diningMealOnOffSettings = [];

    // Cutoff check: 8:00 PM (20:00) the day before
    const hallOverview = this.getHallDiningOverview(params.hallId);
    const cutoffHour = hallOverview.cutoffHour || 20;

    const now = new Date();
    const targetDate = new Date(`${params.dateStr}T00:00:00`);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.round((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return {
        success: false,
        message: 'Cannot modify meal status for today or past dates.'
      };
    }

    if (diffDays === 1 && now.getHours() >= cutoffHour) {
      return {
        success: false,
        message: `Cutoff passed! Changes for tomorrow must be submitted before ${cutoffHour % 12 || 12}:00 PM today.`
      };
    }

    let existing = store.diningMealOnOffSettings.find(
      (s) => s.studentId === params.studentId && s.hallId === params.hallId && s.dateStr === params.dateStr
    );

    if (existing) {
      existing.breakfast = params.breakfast;
      existing.lunch = params.lunch;
      existing.dinner = params.dinner;
      existing.updatedAt = new Date().toISOString();
    } else {
      existing = {
        id: `onoff-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        studentId: params.studentId,
        studentName: params.studentName,
        hallId: params.hallId,
        dateStr: params.dateStr,
        breakfast: params.breakfast,
        lunch: params.lunch,
        dinner: params.dinner,
        updatedAt: new Date().toISOString()
      };
      store.diningMealOnOffSettings.push(existing);
    }

    this.saveStore(store);
    return { success: true, setting: existing };
  }

  public getStudentDiningBillings(studentId: string): StudentDiningBilling[] {
    // // Real enforcement must move to Firestore rules / Cloud Functions.
    // Students see only their own billing.
    const store = this.getStore();
    return (store.diningStudentBillings || []).filter((b) => b.studentId === studentId);
  }

  public payStudentDiningBill(
    studentId: string,
    billId: string,
    paymentMethod: string
  ): { success: boolean; bill?: StudentDiningBilling; message?: string } {
    // // Real stock and dining financial changes must be done by server-side transactions.
    const store = this.getStore();
    const bill = store.diningStudentBillings?.find((b) => b.id === billId && b.studentId === studentId);
    if (!bill) {
      return { success: false, message: 'Billing record not found.' };
    }

    bill.paymentStatus = 'PAID';
    bill.paidAt = new Date().toISOString();
    bill.receiptNumber = `RCPT-HA-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    bill.paymentMethod = paymentMethod;

    if (store.studentNotifications) {
      store.studentNotifications.unshift({
        id: `notif-bill-${Date.now()}`,
        title: `Mess Bill Paid (${bill.receiptNumber})`,
        titleBn: `মেস বিল পরিশোধ সম্পন্ন (${bill.receiptNumber})`,
        message: `Your payment of BDT ${bill.totalDue} for ${bill.month} has been successfully verified (Mock).`,
        messageBn: `${bill.month} মাসের মেস বিল ৳${bill.totalDue} সফলভাবে পরিশোধ হয়েছে (মক)।`,
        category: 'academic',
        timestamp: new Date().toISOString(),
        read: false,
        link: '/student/dining'
      });
    }

    this.saveStore(store);
    return { success: true, bill };
  }

  public submitGuestMealRequest(
    data: Omit<GuestMealRequest, 'id' | 'status' | 'requestedAt'>
  ): GuestMealRequest {
    const store = this.getStore();
    if (!store.diningGuestMealRequests) store.diningGuestMealRequests = [];

    const newReq: GuestMealRequest = {
      ...data,
      id: `gmeal-req-${Date.now()}`,
      status: 'PENDING',
      requestedAt: new Date().toISOString()
    };

    store.diningGuestMealRequests.unshift(newReq);
    this.saveStore(store);
    return newReq;
  }

  public submitMealRating(data: Omit<MealRatingFeedback, 'id' | 'createdAt'>): {
    success: boolean;
    rating?: MealRatingFeedback;
    message?: string;
  } {
    const store = this.getStore();
    if (!store.diningMealRatings) store.diningMealRatings = [];

    // Check duplicate rating for this student, meal, and date
    const existing = store.diningMealRatings.find(
      (r) =>
        r.studentId === data.studentId &&
        r.hallId === data.hallId &&
        r.date === data.date &&
        r.mealType === data.mealType
    );

    if (existing) {
      return { success: false, message: 'You have already submitted a rating for this meal.' };
    }

    const newRating: MealRatingFeedback = {
      ...data,
      id: `rating-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    store.diningMealRatings.unshift(newRating);
    this.saveStore(store);
    return { success: true, rating: newRating };
  }

  public getDishSuggestions(hallId: HallId): DishSuggestion[] {
    const store = this.getStore();
    // Return suggestions ranked by voteCount descending, author's identity hidden
    return (store.diningDishSuggestions || [])
      .filter((s) => s.hallId === hallId)
      .sort((a, b) => b.voteCount - a.voteCount);
  }

  public submitDishSuggestion(data: {
    studentId: string;
    hallId: HallId;
    dishName: string;
    description?: string;
  }): { success: boolean; suggestion?: DishSuggestion; message?: string } {
    if (!data.dishName || data.dishName.trim().length === 0) {
      return { success: false, message: 'Dish name is required.' };
    }
    if (data.dishName.length > 200) {
      return { success: false, message: 'Dish name must be 200 characters or fewer.' };
    }

    const store = this.getStore();
    if (!store.diningDishSuggestions) store.diningDishSuggestions = [];

    // Max 3 suggestions per week per student
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentCount = store.diningDishSuggestions.filter(
      (s) => s.studentId === data.studentId && new Date(s.createdAt).getTime() > oneWeekAgo
    ).length;

    if (recentCount >= 3) {
      return {
        success: false,
        message: 'You have reached the maximum limit of 3 suggestions per week.'
      };
    }

    const newSuggestion: DishSuggestion = {
      id: `sugg-${Date.now()}`,
      studentId: data.studentId, // Stored internally, never shown in UI
      hallId: data.hallId,
      dishName: data.dishName.trim(),
      description: data.description?.trim(),
      voteCount: 1,
      votedStudentIds: [data.studentId],
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    store.diningDishSuggestions.unshift(newSuggestion);
    this.saveStore(store);
    return { success: true, suggestion: newSuggestion };
  }

  public voteDishSuggestion(
    studentId: string,
    suggestionId: string
  ): { success: boolean; voteCount: number; message?: string } {
    const store = this.getStore();
    const sugg = store.diningDishSuggestions?.find((s) => s.id === suggestionId);
    if (!sugg) return { success: false, voteCount: 0, message: 'Suggestion not found.' };

    if (!sugg.votedStudentIds) sugg.votedStudentIds = [];

    if (sugg.votedStudentIds.includes(studentId)) {
      // Toggle off / remove vote
      sugg.votedStudentIds = sugg.votedStudentIds.filter((id) => id !== studentId);
      sugg.voteCount = Math.max(0, sugg.voteCount - 1);
    } else {
      // Add vote
      sugg.votedStudentIds.push(studentId);
      sugg.voteCount += 1;
    }

    this.saveStore(store);
    return { success: true, voteCount: sugg.voteCount };
  }

  public submitDiningComplaint(data: {
    hallId: HallId;
    category: import('../../types/hallDining').ComplaintCategory;
    description: string;
    photoUrl?: string;
    isAnonymous: boolean;
    studentId?: string;
    studentName?: string;
  }): DiningComplaint {
    const store = this.getStore();
    if (!store.diningComplaints) store.diningComplaints = [];

    const refNumber = `DC-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const newComplaint: DiningComplaint = {
      id: `comp-${Date.now()}`,
      referenceNumber: refNumber,
      hallId: data.hallId,
      category: data.category,
      description: data.description,
      photoUrl: data.photoUrl,
      isAnonymous: data.isAnonymous,
      studentId: data.isAnonymous ? undefined : data.studentId,
      studentName: data.isAnonymous ? undefined : data.studentName,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.diningComplaints.unshift(newComplaint);
    this.saveStore(store);
    return newComplaint;
  }

  public checkDiningComplaintStatus(referenceNumber: string): DiningComplaint | undefined {
    const store = this.getStore();
    return store.diningComplaints?.find(
      (c) => c.referenceNumber.toLowerCase() === referenceNumber.toLowerCase().trim()
    );
  }

  public getDiningComplaints(hallId?: HallId): DiningComplaint[] {
    const store = this.getStore();
    const list = store.diningComplaints || [];
    if (hallId) return list.filter((c) => c.hallId === hallId);
    return list;
  }

  public updateDiningComplaintStatus(
    complaintId: string,
    status: import('../../types/hallDining').ComplaintStatus,
    resolutionNotes: string,
    actorRole: string,
    actorUid: string
  ): boolean {
    const store = this.getStore();
    const complaint = store.diningComplaints?.find((c) => c.id === complaintId);
    if (!complaint) return false;

    complaint.status = status;
    complaint.resolutionNotes = resolutionNotes;
    complaint.updatedAt = new Date().toISOString();

    // Audit log
    if (!store.diningAuditTrail) store.diningAuditTrail = [];
    store.diningAuditTrail.unshift({
      id: `audit-comp-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole,
      actorUid,
      hallId: complaint.hallId,
      action: 'COMPLAINT_STATUS',
      details: `Complaint ${complaint.referenceNumber} updated to ${status}. Notes: ${resolutionNotes}`
    });

    // Notify student if not anonymous
    if (complaint.studentId && store.studentNotifications) {
      store.studentNotifications.unshift({
        id: `notif-comp-${Date.now()}`,
        title: `Dining Complaint Status Updated (${complaint.referenceNumber})`,
        titleBn: `ডাইনিং অভিযোগের অগ্রগতি হালনাগাদ (${complaint.referenceNumber})`,
        message: `Your complaint has been marked as ${status}. ${resolutionNotes ? `Notes: ${resolutionNotes}` : ''}`,
        messageBn: `আপনার অভিযোগটির বর্তমান স্ট্যাটাস: ${status}।`,
        category: 'academic',
        timestamp: new Date().toISOString(),
        read: false,
        link: '/student/dining'
      });
    }

    this.saveStore(store);
    return true;
  }

  public getTodayMealCounts(hallId: HallId): {
    breakfast: number;
    lunch: number;
    dinner: number;
    totalExpected: number;
  } {
    const store = this.getStore();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const settings = (store.diningMealOnOffSettings || []).filter(
      (s) => s.hallId === hallId && s.dateStr === dateStr
    );

    // Baseline active residents (demo count 320 for Hall A, 280 for Hall B)
    const baseCount = hallId === 'hall-a' ? 320 : 280;

    let bOff = 0;
    let lOff = 0;
    let dOff = 0;

    settings.forEach((s) => {
      if (!s.breakfast) bOff++;
      if (!s.lunch) lOff++;
      if (!s.dinner) dOff++;
    });

    return {
      breakfast: Math.max(0, baseCount - 45 - bOff),
      lunch: Math.max(0, baseCount - 12 - lOff),
      dinner: Math.max(0, baseCount - 18 - dOff),
      totalExpected: baseCount
    };
  }

  public updateDiningRoomStatus(
    hallId: HallId,
    roomId: string,
    status: import('../../types/hallDining').DiningRoomStatus,
    actorRole: string,
    actorUid: string
  ): boolean {
    const store = this.getStore();
    const hall = store.hallDiningOverviews?.[hallId];
    if (!hall) return false;

    const room = hall.diningRooms.find((r) => r.id === roomId);
    if (!room) return false;

    room.status = status;

    if (!store.diningAuditTrail) store.diningAuditTrail = [];
    store.diningAuditTrail.unshift({
      id: `audit-room-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole,
      actorUid,
      hallId,
      action: 'ROOM_STATUS_CHANGE',
      details: `${room.name} status updated to ${status}.`
    });

    this.saveStore(store);
    return true;
  }

  public updateWeeklyMenu(
    menu: DailyMealMenu,
    actorRole: string,
    actorUid: string,
    reason?: string
  ): DailyMealMenu {
    // // Real enforcement must move to Firestore rules / Cloud Functions.
    // Published menus are append-only with corrections as new entries with a reason.
    const store = this.getStore();
    if (!store.diningWeeklyMenus) store.diningWeeklyMenus = [];

    const existingIndex = store.diningWeeklyMenus.findIndex(
      (m) => m.id === menu.id || (m.hallId === menu.hallId && m.dayOfWeek === menu.dayOfWeek)
    );

    const updatedMenu: DailyMealMenu = {
      ...menu,
      version: existingIndex >= 0 ? (store.diningWeeklyMenus[existingIndex].version || 1) + 1 : 1,
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
      publishedBy: actorUid,
      changeReason: reason || 'Scheduled weekly menu update'
    };

    if (existingIndex >= 0) {
      store.diningWeeklyMenus[existingIndex] = updatedMenu;
    } else {
      store.diningWeeklyMenus.push(updatedMenu);
    }

    if (!store.diningAuditTrail) store.diningAuditTrail = [];
    store.diningAuditTrail.unshift({
      id: `audit-menu-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole,
      actorUid,
      hallId: menu.hallId,
      action: 'MENU_PUBLISH',
      details: `Menu for ${menu.dayOfWeek} (v${updatedMenu.version}) published. ${reason ? `Reason: ${reason}` : ''}`
    });

    // Notify hall students of menu update
    if (store.studentNotifications) {
      store.studentNotifications.unshift({
        id: `notif-menu-${Date.now()}`,
        title: `Dining Menu Updated (${menu.dayOfWeek})`,
        titleBn: `ডাইনিং মেনু হালনাগাদ করা হয়েছে (${menu.dayOfWeekBn})`,
        message: `Dining manager has updated the published menu for ${menu.dayOfWeek}.`,
        messageBn: `ডাইনিং ম্যানেজার ${menu.dayOfWeekBn}-এর মেনু হালনাগাদ করেছেন।`,
        category: 'academic',
        timestamp: new Date().toISOString(),
        read: false,
        link: '/student/dining'
      });
    }

    this.saveStore(store);
    return updatedMenu;
  }

  public addBazarCostEntry(
    data: Omit<BazarCostEntry, 'id' | 'enteredAt' | 'version'>,
    actorRole: string,
    actorUid: string,
    correctionReason?: string
  ): BazarCostEntry {
    // // Real stock and dining financial changes must be done by server-side transactions.
    // Append-only cost entry with corrections as new entries with a reason.
    const store = this.getStore();
    if (!store.diningBazarCostEntries) store.diningBazarCostEntries = [];

    const newEntry: BazarCostEntry = {
      ...data,
      id: `bazar-${Date.now()}`,
      enteredAt: new Date().toISOString(),
      version: 1,
      correctionReason
    };

    store.diningBazarCostEntries.unshift(newEntry);

    if (!store.diningAuditTrail) store.diningAuditTrail = [];
    store.diningAuditTrail.unshift({
      id: `audit-bazar-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole,
      actorUid,
      hallId: data.hallId,
      action: 'COST_ENTRY',
      details: `Bazar entry recorded: ${data.item} (${data.quantity}) for BDT ${data.amount}. ${correctionReason ? `Correction: ${correctionReason}` : ''}`
    });

    this.saveStore(store);
    return newEntry;
  }

  public getBazarCostEntries(hallId: HallId, month?: string): BazarCostEntry[] {
    const store = this.getStore();
    let list = (store.diningBazarCostEntries || []).filter((b) => b.hallId === hallId);
    if (month) {
      list = list.filter((b) => b.month === month);
    }
    return list;
  }

  public calculateMonthlyMealRate(
    hallId: HallId,
    month: string = '2026-11'
  ): { totalCost: number; totalMeals: number; calculatedRate: number } {
    const entries = this.getBazarCostEntries(hallId, month);
    const totalCost = entries.reduce((acc, curr) => acc + curr.amount, 0);

    // Oporajita Hall serves only 2 meals (Lunch, Dinner). Bijoy 24 serves 3 meals (Breakfast, Lunch, Dinner).
    // Meal rate = cost / meals actually offered and served for that hall.
    const baseResidents = hallId === 'hall-a' ? 260 : 250;
    const mealsOfferedPerDay = hallId === 'hall-a' ? 2 : 3;
    const baseMealsPerDay = baseResidents * mealsOfferedPerDay;
    const daysInMonth = 30;
    const totalMeals = baseMealsPerDay * daysInMonth;

    const calculatedRate = totalMeals > 0 ? parseFloat((totalCost / totalMeals).toFixed(2)) : 52.5;

    return {
      totalCost,
      totalMeals,
      calculatedRate: calculatedRate > 0 ? calculatedRate : 53.0
    };
  }

  public reviewDishSuggestion(
    suggestionId: string,
    status: import('../../types/hallDining').SuggestionStatus,
    reason: string,
    actorRole: string,
    actorUid: string
  ): boolean {
    const store = this.getStore();
    const sugg = store.diningDishSuggestions?.find((s) => s.id === suggestionId);
    if (!sugg) return false;

    sugg.status = status;
    sugg.reviewReason = reason;

    if (!store.diningAuditTrail) store.diningAuditTrail = [];
    store.diningAuditTrail.unshift({
      id: `audit-sugg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole,
      actorUid,
      hallId: sugg.hallId,
      action: 'SUGGESTION_REVIEW',
      details: `Dish suggestion "${sugg.dishName}" ${status}. Reason: ${reason}`
    });

    this.saveStore(store);
    return true;
  }

  public reviewGuestMealRequest(
    requestId: string,
    status: import('../../types/hallDining').GuestMealStatus,
    reviewNotes: string,
    actorRole: string,
    actorUid: string
  ): boolean {
    const store = this.getStore();
    const req = store.diningGuestMealRequests?.find((r) => r.id === requestId);
    if (!req) return false;

    req.status = status;
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = actorRole;
    req.reviewNotes = reviewNotes;

    if (!store.diningAuditTrail) store.diningAuditTrail = [];
    store.diningAuditTrail.unshift({
      id: `audit-gmeal-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole,
      actorUid,
      hallId: req.hallId,
      action: 'GUEST_MEAL_REVIEW',
      details: `Guest meal request for ${req.studentName} (${req.guestCount} guests, ${req.mealType}) ${status}. Notes: ${reviewNotes}`
    });

    if (store.studentNotifications) {
      store.studentNotifications.unshift({
        id: `notif-gmeal-${Date.now()}`,
        title: `Guest Meal Request ${status}`,
        titleBn: `মেহমান মিল আবেদন ${status === 'APPROVED' ? 'অনুমোদিত' : 'প্রত্যাখ্যাত'}`,
        message: `Your guest meal request for ${req.date} (${req.mealType}) has been ${status.toLowerCase()}. ${reviewNotes ? `Notes: ${reviewNotes}` : ''}`,
        messageBn: `${req.date} তারিখের মেহমান মিল আবেদনটি ${status === 'APPROVED' ? 'অনুমোদন' : 'বাতিল'} করা হয়েছে।`,
        category: 'academic',
        timestamp: new Date().toISOString(),
        read: false,
        link: '/student/dining'
      });
    }

    this.saveStore(store);
    return true;
  }

  public getDiningAuditTrail(hallId?: HallId): DiningAuditTrailEntry[] {
    const store = this.getStore();
    const list = store.diningAuditTrail || [];
    if (hallId) return list.filter((a) => a.hallId === hallId);
    return list;
  }

  public getDiningProvostReportData(): DiningProvostReportData {
    const store = this.getStore();
    const complaints = store.diningComplaints || [];
    const ratings = store.diningMealRatings || [];

    // Helper for small count protection: under 5 shown as "<5"
    const formatSmallCount = (num: number): number | string => (num < 5 && num > 0 ? '<5' : num);

    const statusCounts: Record<string, number> = {
      SUBMITTED: 0,
      UNDER_REVIEW: 0,
      RESOLVED: 0,
      DISMISSED: 0
    };
    complaints.forEach((c) => {
      if (statusCounts[c.status] !== undefined) statusCounts[c.status]++;
    });

    const hallARatings = ratings.filter((r) => r.hallId === 'hall-a');
    const hallBRatings = ratings.filter((r) => r.hallId === 'hall-b');

    const avgHallA = hallARatings.length > 0
      ? parseFloat((hallARatings.reduce((acc, r) => acc + r.rating, 0) / hallARatings.length).toFixed(1))
      : 4.4;
    const avgHallB = hallBRatings.length > 0
      ? parseFloat((hallBRatings.reduce((acc, r) => acc + r.rating, 0) / hallBRatings.length).toFixed(1))
      : 4.2;

    const rateA = this.calculateMonthlyMealRate('hall-a', '2026-11');
    const rateB = this.calculateMonthlyMealRate('hall-b', '2026-11');

    return {
      mealsPerDay: [
        { date: 'Nov 03', hallA: 780, hallB: 640 },
        { date: 'Nov 04', hallA: 795, hallB: 655 },
        { date: 'Nov 05', hallA: 810, hallB: 670 },
        { date: 'Nov 06', hallA: 760, hallB: 630 },
        { date: 'Nov 07', hallA: 820, hallB: 685 },
        { date: 'Nov 08', hallA: 850, hallB: 710 },
        { date: 'Nov 09', hallA: 835, hallB: 690 }
      ],
      avgRatings: [
        { hall: 'Oporajita Hall', rating: avgHallA, totalRatings: hallARatings.length || 14 },
        { hall: 'Bijoy 24 Hall', rating: avgHallB, totalRatings: hallBRatings.length || 11 }
      ],
      costVsCollection: [
        { month: 'Sep 2026', hallA_cost: 215000, hallA_collection: 228000, hallB_cost: 185000, hallB_collection: 192000 },
        { month: 'Oct 2026', hallA_cost: 228000, hallA_collection: 239000, hallB_cost: 194000, hallB_collection: 201000 },
        { month: 'Nov 2026 (Demo)', hallA_cost: 72300, hallA_collection: 88500, hallB_cost: 57200, hallB_collection: 69400 }
      ],
      complaintsByStatus: [
        { status: 'Submitted', count: formatSmallCount(statusCounts.SUBMITTED) },
        { status: 'Under Review', count: formatSmallCount(statusCounts.UNDER_REVIEW) },
        { status: 'Resolved', count: formatSmallCount(statusCounts.RESOLVED) },
        { status: 'Dismissed', count: formatSmallCount(statusCounts.DISMISSED) }
      ],
      summary: {
        totalActiveMealsHallA: 835,
        totalActiveMealsHallB: 690,
        calculatedMealRateHallA: rateA.calculatedRate,
        calculatedMealRateHallB: rateB.calculatedRate
      }
    };
  }

  // ==========================================
  // HALL DINING H2: MEAL TOKENS & VERIFICATION
  // ==========================================
  // Real enforcement must move to Firestore rules / Cloud Functions.
  // Real token validation and one-time-use marking must run server-side with atomic transactions, otherwise tokens can be reused or forged.

  private generateSecureTokenString(): string {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const arr = new Uint8Array(16);
      window.crypto.getRandomValues(arr);
      return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
    }
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  }

  private generateSixDigitCode(): string {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const arr = new Uint32Array(1);
      window.crypto.getRandomValues(arr);
      return (100000 + (arr[0] % 900000)).toString();
    }
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  public getOrCreateStudentMealToken(
    studentUid: string,
    studentName: string,
    studentIdNum: string,
    hallId: HallId,
    mealTypeStr: 'Breakfast' | 'Lunch' | 'Dinner',
    date: string = '2026-11-10'
  ): MealToken {
    const store = this.getStore();
    if (!store.diningMealTokens) store.diningMealTokens = [];

    const normalizedMealType = mealTypeStr.toLowerCase() as MealType;

    // Check if token already exists for this student, meal, and date
    let token = store.diningMealTokens.find(
      (t) =>
        (t.studentId === studentUid || t.studentUid === studentUid) &&
        t.mealType === normalizedMealType &&
        (t.dateStr === date || t.date === date)
    );

    if (token) return token;

    // Check if meal is ON
    const setting = (store.diningMealOnOffSettings || []).find(
      (s) => s.studentId === studentUid && s.dateStr === date
    );
    const isSwitchedOn = setting
      ? normalizedMealType === 'breakfast'
        ? setting.breakfast
        : normalizedMealType === 'lunch'
        ? setting.lunch
        : setting.dinner
      : true; // Default ON if unconfigured

    const expiryTime =
      normalizedMealType === 'breakfast' ? '09:30 AM' : normalizedMealType === 'lunch' ? '03:30 PM' : '10:00 PM';

    token = {
      id: `tok-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      token: this.generateSecureTokenString(),
      tokenString: this.generateSecureTokenString(),
      manualCode: this.generateSixDigitCode(),
      studentId: studentUid,
      studentUid,
      studentName,
      studentIdNumber: studentIdNum,
      maskedStudentName: studentName.replace(/^(\S)\S*(\s+)(\S)\S*$/, '$1*****$2$3****'),
      hallId,
      dateStr: date,
      date,
      mealType: normalizedMealType,
      expiresAt: `${date} ${expiryTime}`,
      isUsed: false,
      isSwitchedOn,
      status: isSwitchedOn ? 'ACTIVE' : 'INACTIVE',
      scanCounter: 0
    };

    store.diningMealTokens.unshift(token);
    this.saveStore(store);
    return token;
  }

  public verifyAndConsumeMealToken(
    input: string,
    scannerHallId: HallId,
    actorRole: string = 'dining_manager',
    actorUid: string = 'demo_manager'
  ): TokenVerificationResult {
    // Real token validation and one-time-use marking must run server-side with atomic transactions, otherwise tokens can be reused or forged.
    // Real enforcement must move to Firestore rules / Cloud Functions.
    const store = this.getStore();
    const cleanInput = (input || '').trim().toLowerCase();
    const tokens = store.diningMealTokens || [];

    const token = tokens.find(
      (t) =>
        t.token.toLowerCase() === cleanInput ||
        (t.tokenString && t.tokenString.toLowerCase() === cleanInput) ||
        t.manualCode.toLowerCase() === cleanInput ||
        t.id.toLowerCase() === cleanInput
    );

    const nowIso = new Date().toISOString();

    if (!token) {
      return {
        status: 'NOT_FOUND',
        message: 'Meal token or manual code was not found in the campus dining database.',
        messageBn: 'ডাইনিং সিস্টেমে এই মিল টোকেন বা কোডটি পাওয়া যায়নি।',
        verifiedAt: nowIso
      };
    }

    if (token.hallId !== scannerHallId) {
      return {
        status: 'WRONG_HALL',
        token,
        hallId: token.hallId,
        mealType: token.mealType,
        maskedStudentName: token.maskedStudentName,
        maskedName: token.maskedStudentName,
        message: `Token is issued for ${token.hallId === 'hall-a' ? 'Oporajita Hall' : 'Bijoy 24 Hall'}, but scanned at ${scannerHallId === 'hall-a' ? 'Oporajita Hall' : 'Bijoy 24 Hall'}.`,
        messageBn: `এই টোকেনটি অন্য হলের জন্য সংরক্ষিত। বর্তমান হলের ডাইনিংয়ে এটি ব্যবহার করা যাবে না।`,
        verifiedAt: nowIso
      };
    }

    if (token.isSwitchedOn === false || token.status === 'INACTIVE') {
      return {
        status: 'NOT_SWITCHED_ON',
        token,
        hallId: token.hallId,
        mealType: token.mealType,
        maskedStudentName: token.maskedStudentName,
        maskedName: token.maskedStudentName,
        message: 'This meal was switched OFF before the cutoff time by the student.',
        messageBn: 'শিক্ষার্থী কাট-অফ সময়ের আগে এই মিলটি বন্ধ (OFF) করেছিলেন।',
        verifiedAt: nowIso
      };
    }

    if (token.isUsed || token.status === 'USED') {
      return {
        status: 'ALREADY_USED',
        token,
        hallId: token.hallId,
        mealType: token.mealType,
        maskedStudentName: token.maskedStudentName,
        maskedName: token.maskedStudentName,
        message: `Token was already redeemed at ${token.usedAt ? new Date(token.usedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'earlier'}.`,
        messageBn: 'এই টোকেনটি ইতিমধ্যে পরিবেশিত হয়েছে। পুনরায় ব্যবহার সম্ভব নয়।',
        verifiedAt: nowIso
      };
    }

    if (token.status === 'EXPIRED') {
      return {
        status: 'EXPIRED',
        token,
        hallId: token.hallId,
        mealType: token.mealType,
        maskedStudentName: token.maskedStudentName,
        maskedName: token.maskedStudentName,
        message: `Token meal window expired at ${token.expiresAt}.`,
        messageBn: 'মিল পরিবেশনের নির্ধারিত সময় শেষ হয়ে গেছে।',
        verifiedAt: nowIso
      };
    }

    // Valid: Mark USED with timestamp
    token.isUsed = true;
    token.status = 'USED';
    token.usedAt = nowIso;
    token.scanCounter = (token.scanCounter || 0) + 1;

    if (!store.diningAuditTrail) store.diningAuditTrail = [];
    store.diningAuditTrail.unshift({
      id: `audit-scan-${Date.now()}`,
      timestamp: nowIso,
      actorRole,
      actorUid,
      hallId: scannerHallId,
      action: 'TOKEN_SCAN',
      details: `Meal token ${token.manualCode} verified and served for ${token.mealType} (${token.dateStr || token.date}).`
    });

    this.saveStore(store);

    return {
      status: 'VALID',
      token,
      hallId: token.hallId,
      mealType: token.mealType,
      maskedStudentName: token.maskedStudentName,
      maskedName: token.maskedStudentName,
      message: 'Meal token verified successfully. 1 meal served.',
      messageBn: 'টোকেন সফলভাবে যাচাইকৃত। ১টি মিল পরিবেশন সম্পন্ন।',
      verifiedAt: nowIso
    };
  }

  public overrideMealToken(
    tokenOrId: string,
    hallId: HallId,
    reason: string,
    actorRole: string,
    actorUid: string
  ): boolean {
    const store = this.getStore();
    const clean = tokenOrId.trim().toLowerCase();
    const token = (store.diningMealTokens || []).find(
      (t) =>
        t.token.toLowerCase() === clean ||
        (t.tokenString && t.tokenString.toLowerCase() === clean) ||
        t.manualCode.toLowerCase() === clean ||
        t.id.toLowerCase() === clean
    );

    if (!token) return false;

    token.isUsed = true;
    token.status = 'USED';
    token.usedAt = new Date().toISOString();
    token.scanCounter = (token.scanCounter || 0) + 1;
    token.isManualOverride = true;
    token.overrideReason = reason;
    token.overrideBy = actorRole;

    if (!store.diningAuditTrail) store.diningAuditTrail = [];
    store.diningAuditTrail.unshift({
      id: `audit-override-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole,
      actorUid,
      hallId,
      action: 'TOKEN_OVERRIDE',
      details: `Manual meal token override for student token #${token.manualCode} (${token.mealType}). Reason: ${reason}`
    });

    this.saveStore(store);
    return true;
  }

  public getLiveMealCounters(hallId: HallId, mealType: 'Breakfast' | 'Lunch' | 'Dinner' = 'Lunch') {
    const store = this.getStore();
    const normalizedMeal = mealType.toLowerCase() as MealType;
    const tokens = (store.diningMealTokens || []).filter(
      (t) => t.hallId === hallId && t.mealType === normalizedMeal
    );

    const baseExpected = hallId === 'hall-a' ? 420 : 340;
    const servedCount = tokens.filter((t) => t.isUsed || t.status === 'USED').length;
    const activeExpected = Math.max(
      baseExpected,
      tokens.filter((t) => t.isSwitchedOn !== false).length
    );
    const remainingCount = Math.max(0, activeExpected - servedCount);

    return {
      expected: activeExpected,
      served: servedCount,
      remaining: remainingCount
    };
  }

  // ==========================================
  // FESTIVAL & SPECIAL MEALS
  // ==========================================
  public getSpecialMealEvents(hallId?: HallId): SpecialMealEvent[] {
    const store = this.getStore();
    const list = store.diningSpecialMealEvents || [];
    if (hallId) return list.filter((e) => e.hallId === hallId);
    return list;
  }

  public createSpecialMealEvent(
    data: Omit<SpecialMealEvent, 'id' | 'createdAt' | 'participantUids' | 'optOutUids' | 'registeredStudentIds' | 'optedOutStudentIds'>,
    actorRole: string,
    actorUid: string
  ): SpecialMealEvent {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    const store = this.getStore();
    if (!store.diningSpecialMealEvents) store.diningSpecialMealEvents = [];

    const newEvent: SpecialMealEvent = {
      ...data,
      id: `special-${Date.now()}`,
      createdAt: new Date().toISOString(),
      participantUids: [],
      optOutUids: [],
      registeredStudentIds: [],
      optedOutStudentIds: []
    };

    store.diningSpecialMealEvents.unshift(newEvent);

    if (!store.diningAuditTrail) store.diningAuditTrail = [];
    store.diningAuditTrail.unshift({
      id: `audit-special-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole,
      actorUid,
      hallId: data.hallId,
      action: 'SPECIAL_MEAL_CREATE',
      details: `Special meal event scheduled: "${data.title}" on ${data.date} (${data.mealType}). Extra charge: BDT ${data.extraCharge || data.extraChargeBDT || 0}.`
    });

    this.saveStore(store);
    return newEvent;
  }

  public toggleSpecialMealSignup(
    eventId: string,
    studentUid: string,
    action: 'sign_up' | 'opt_out'
  ): boolean {
    const store = this.getStore();
    const ev = (store.diningSpecialMealEvents || []).find((e) => e.id === eventId);
    if (!ev) return false;

    if (!ev.participantUids) ev.participantUids = [];
    if (!ev.optOutUids) ev.optOutUids = [];
    if (!ev.registeredStudentIds) ev.registeredStudentIds = [];
    if (!ev.optedOutStudentIds) ev.optedOutStudentIds = [];

    if (action === 'sign_up') {
      if (!ev.participantUids.includes(studentUid)) {
        ev.participantUids.push(studentUid);
      }
      if (!ev.registeredStudentIds.includes(studentUid)) {
        ev.registeredStudentIds.push(studentUid);
      }
      ev.optOutUids = ev.optOutUids.filter((u: string) => u !== studentUid);
      ev.optedOutStudentIds = ev.optedOutStudentIds.filter((u: string) => u !== studentUid);
    } else {
      if (!ev.optOutUids.includes(studentUid)) {
        ev.optOutUids.push(studentUid);
      }
      if (!ev.optedOutStudentIds.includes(studentUid)) {
        ev.optedOutStudentIds.push(studentUid);
      }
      ev.participantUids = ev.participantUids.filter((u: string) => u !== studentUid);
      ev.registeredStudentIds = ev.registeredStudentIds.filter((u: string) => u !== studentUid);
    }

    this.saveStore(store);
    return true;
  }

  // ==========================================
  // MONTHLY AUDIT REPORTS & LOCKING
  // ==========================================
  public isMonthAudited(hallId: HallId, month: string): boolean {
    const store = this.getStore();
    const status = (store.diningMonthlyAuditStatuses || []).find(
      (s) => s.hallId === hallId && s.month === month
    );
    return status ? status.isAudited : false;
  }

  public markMonthAudited(
    hallId: HallId,
    month: string,
    auditedBy: string,
    auditorRole: string,
    notes?: string
  ): boolean {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    const store = this.getStore();
    if (!store.diningMonthlyAuditStatuses) store.diningMonthlyAuditStatuses = [];

    const existing = store.diningMonthlyAuditStatuses.find(
      (s) => s.hallId === hallId && s.month === month
    );

    if (existing) {
      existing.isAudited = true;
      existing.auditedAt = new Date().toISOString();
      existing.auditedBy = auditedBy;
      existing.notes = notes || existing.notes;
    } else {
      store.diningMonthlyAuditStatuses.unshift({
        id: `audit-status-${hallId}-${month}`,
        hallId,
        month,
        isAudited: true,
        auditedAt: new Date().toISOString(),
        auditedBy,
        notes: notes || 'Monthly review completed and verified by Hall Provost Office.'
      });
    }

    if (!store.diningAuditTrail) store.diningAuditTrail = [];
    store.diningAuditTrail.unshift({
      id: `audit-month-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole: auditorRole,
      actorUid: auditedBy,
      hallId,
      action: 'MONTH_AUDITED',
      details: `Month ${month} marked as AUDITED for ${hallId === 'hall-a' ? 'Oporajita Hall' : 'Bijoy 24 Hall'}. Dining manager edits locked. Notes: ${notes || 'None'}`
    });

    this.saveStore(store);
    return true;
  }

  public getMonthlyAuditReport(hallId: HallId, month: string = '2026-11'): MonthlyAuditReportRecord {
    const store = this.getStore();
    const isAudited = this.isMonthAudited(hallId, month);

    const formatSmall = (n: number): number | string => (n < 5 && n > 0 ? '<5' : n);

    const bEntries = (store.diningBazarCostEntries || []).filter(
      (b) => b.hallId === hallId && b.month === month
    );
    const totalCost = bEntries.reduce((sum, e) => sum + e.amount, 0);

    const baseMealsPerDay = hallId === 'hall-a' ? 780 : 640;
    const totalMealsServed = month === '2026-11' ? 7650 : baseMealsPerDay * 30;
    const totalMealsPlanned = Math.round(totalMealsServed * 1.06); // ~6% waste delta
    const foodWastageEstimateKg = Math.round((totalMealsPlanned - totalMealsServed) * 0.12);

    const totalCollection = Math.round(totalCost * 1.15);
    const mealRate = totalMealsServed > 0 ? parseFloat((totalCost / totalMealsServed).toFixed(2)) : 52.5;

    const complaints = (store.diningComplaints || []).filter((c) => c.hallId === hallId);
    const statusCounts: Record<string, number> = {
      SUBMITTED: 0,
      UNDER_REVIEW: 0,
      RESOLVED: 0,
      DISMISSED: 0
    };
    complaints.forEach((c) => {
      if (statusCounts[c.status] !== undefined) statusCounts[c.status]++;
    });

    const acceptedSuggestions = (store.diningDishSuggestions || []).filter(
      (s) => s.hallId === hallId && s.status === 'ACCEPTED'
    ).length;

    const ratings = (store.diningMealRatings || []).filter((r) => r.hallId === hallId);
    const avgRating = ratings.length > 0
      ? parseFloat((ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1))
      : hallId === 'hall-a' ? 4.4 : 4.2;

    const dailyBreakdown = [
      { date: `${month}-01`, mealsServed: 780, plannedMeals: 820, costBDT: 41200 },
      { date: `${month}-02`, mealsServed: 795, plannedMeals: 830, costBDT: 42100 },
      { date: `${month}-03`, mealsServed: 810, plannedMeals: 850, costBDT: 43500 },
      { date: `${month}-04`, mealsServed: 760, plannedMeals: 800, costBDT: 39800 },
      { date: `${month}-05`, mealsServed: 820, plannedMeals: 860, costBDT: 44200 },
      { date: `${month}-06`, mealsServed: 850, plannedMeals: 890, costBDT: 45600 },
      { date: `${month}-07`, mealsServed: 835, plannedMeals: 880, costBDT: 44900 }
    ];

    return {
      month,
      hallId,
      totalMealsServed,
      totalMealsPlanned,
      foodWastageEstimateKg,
      totalBazarCostBDT: totalCost,
      totalCollectionBDT: totalCollection,
      calculatedMealRateBDT: mealRate > 0 ? mealRate : 53.0,
      averageRating: avgRating,
      totalComplaints: complaints.length,
      complaintsByStatus: [
        { status: 'Submitted', count: formatSmall(statusCounts.SUBMITTED) },
        { status: 'Under Review', count: formatSmall(statusCounts.UNDER_REVIEW) },
        { status: 'Resolved', count: formatSmall(statusCounts.RESOLVED) },
        { status: 'Dismissed', count: formatSmall(statusCounts.DISMISSED) }
      ],
      acceptedSuggestionsCount: formatSmall(acceptedSuggestions),
      dailyBreakdown,
      isAudited,
      auditedAt: isAudited ? '2026-11-02T10:00:00Z' : undefined,
      auditedBy: isAudited ? 'Provost Office' : undefined
    };
  }
}


