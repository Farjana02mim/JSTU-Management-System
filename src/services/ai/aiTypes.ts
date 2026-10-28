import { UserRole } from '../../types/auth';

/**
 * Authenticated Session Context passed strictly to AI Tools and Services.
 * CRITICAL SECURITY PRINCIPLE:
 * Tools NEVER accept studentId, email, or identity parameters from model or user queries.
 * All data access is strictly bound to this session object.
 */
export interface AuthSessionContext {
  uid: string;
  role: UserRole;
  departmentId?: string;
  deptId?: string;
  studentId?: string;
  fullName: string;
  email: string;
}

export type AIToolName =
  | 'getMyAttendance'
  | 'getMyRoutine'
  | 'getMyPublishedResults'
  | 'getMyApplications'
  | 'getMyFeeStatus'
  | 'getLatestNotices'
  | 'getApplicationRequirements'
  | 'getUniversityInfo';

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
  isFallback?: boolean;
  error?: string;
}

export interface AIServiceResponse {
  reply: string;
  sources: string[];
  isFallback: boolean;
  toolsUsed: string[];
}

export interface AIService {
  sendMessage(
    prompt: string,
    history: AIChatMessage[],
    session: AuthSessionContext,
    lang?: 'en' | 'bn'
  ): Promise<AIServiceResponse>;
}

// Tool output data types (minimal fields only, strictly no sensitive data)
export interface AttendanceCourseSummary {
  courseCode: string;
  courseTitle: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
}

export interface AttendanceToolOutput {
  role: string;
  department?: string;
  courses: AttendanceCourseSummary[];
  overallAttendancePercentage: number;
  warningNote?: string;
}

export interface ScheduleItemSummary {
  day: string;
  timeSlot: string;
  courseCode: string;
  courseTitle: string;
  room: string;
}

export interface RoutineToolOutput {
  role: string;
  department?: string;
  schedule: ScheduleItemSummary[];
}

export interface PublishedCourseGrade {
  courseCode: string;
  courseTitle: string;
  credit: number;
  grade: string;
  gradePoint: number;
}

export interface PublishedSemesterResultSummary {
  semesterId: string;
  semesterName: string;
  sgpa: number;
  cgpa: number;
  status: 'published';
  courses: PublishedCourseGrade[];
}

export interface ResultsToolOutput {
  role: string;
  publishedSemesters: PublishedSemesterResultSummary[];
  totalPublishedCredits: number;
  cumulativeCGPA: number;
  note?: string;
}

export interface ApplicationItemSummary {
  applicationNumber: string;
  type: string;
  status: string;
  currentStepRole: string;
  submittedAt: string;
  updatedAt: string;
}

export interface ApplicationsToolOutput {
  role: string;
  applications: ApplicationItemSummary[];
  totalActive: number;
}

export interface FeeStatusToolOutput {
  semester: string;
  tuitionFee: number;
  examFee: number;
  labFee: number;
  libraryFee: number;
  otherDues: number;
  totalDue: number;
  totalPaid: number;
  isCleared: boolean;
  paymentStatus: 'CLEARED' | 'PENDING' | 'OVERDUE';
}

export interface NoticeSummaryItem {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  publishDate: string;
  summary: string;
  summaryBn: string;
  department: string;
  referenceNumber: string;
  isImportant?: boolean;
}

export interface NoticesToolOutput {
  notices: NoticeSummaryItem[];
  _untrustedDataNotice: string;
}

export interface PolicyToolOutput {
  matchedType?: string;
  titleEn: string;
  titleBn: string;
  approvalChain: string[];
  requiredDocuments: { en: string; bn: string }[];
  fee: { amountBdt: number; descriptionEn: string; descriptionBn: string };
  processingDays: number;
  eligibilityEn: string;
  eligibilityBn: string;
  rulesEn: string[];
  rulesBn: string[];
}

export interface UniversityInfoToolOutput {
  universityName: string;
  established: number;
  location: string;
  campusSize: string;
  faculties: { id: string; name: string; nameBn: string }[];
  departments: { id: string; code: string; name: string; nameBn: string; faculty: string }[];
  keyOffices: { id: string; name: string; nameBn: string; officerInCharge: string }[];
}
