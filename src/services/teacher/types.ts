/**
 * JSTU Smart Campus — Teacher Service Types & Interface
 * All methods require RBAC enforcement comment:
 * // Real enforcement must move to Firestore rules / Cloud Functions.
 */

import { EnrolledStudentRef, CourseMaterialRef, CourseAnnouncementRef, DailyAttendanceRecord, StudentMarksRecord, CourseMarksSheet } from '../shared/sharedDataStore';
import { MarksSheetStatus } from '../marks/lifecycleTypes';

export type { CourseMarksSheet, StudentMarksRecord, EnrolledStudentRef, CourseMaterialRef, CourseAnnouncementRef, DailyAttendanceRecord, MarksSheetStatus };

export class TeacherPermissionError extends Error {
  public courseCode: string;
  public teacherEmail: string;

  constructor(courseCode: string, teacherEmail: string, message?: string) {
    super(
      message ||
      `Permission Denied: Teacher "${teacherEmail}" is not assigned to course "${courseCode}". Institutional security policies prohibit unauthorized course modifications.`
    );
    this.name = 'TeacherPermissionError';
    this.courseCode = courseCode;
    this.teacherEmail = teacherEmail;
  }
}

export interface TeacherOverviewStats {
  assignedCoursesCount: number;
  totalEnrolledStudents: number;
  pendingAssignmentsToGrade: number;
  pendingMarksSheetsCount: number;
  upcomingClassesCountToday: number;
  unreadNotificationsCount: number;
}

export interface TeacherTodayClassItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  timeSlot: string;
  room: string;
  enrolledStudentsCount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface TeacherDashboardData {
  stats: TeacherOverviewStats;
  todayClasses: TeacherTodayClassItem[];
  recentSubmissions: {
    submissionId: string;
    assignmentTitle: string;
    courseCode: string;
    studentName: string;
    studentId: string;
    submittedAt: string;
  }[];
  quickActions: {
    title: string;
    titleBn: string;
    to: string;
    icon: string;
  }[];
  notifications: {
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
}

export interface TeacherCourseSummary {
  id: string;
  code: string;
  title: string;
  titleBn: string;
  credits: number;
  semester: string;
  semesterBn: string;
  department: string;
  enrolledCount: number;
  totalClassesHeld: number;
  averageAttendanceRate: number;
  marksStatus: MarksSheetStatus;
  pendingSubmissionsCount: number;
}

export interface TeacherEnrolledStudentDetail extends EnrolledStudentRef {
  attendedClasses: number;
  totalClasses: number;
  attendancePercentage: number;
  attendanceStatus: 'safe' | 'warning' | 'critical';
  currentTotalMarks: number;
  letterGrade: string;
}

export interface TeacherCourseDetail {
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
  syllabusOverview: string;
  syllabusOverviewBn: string;
  enrolledStudents: TeacherEnrolledStudentDetail[];
  materials: CourseMaterialRef[];
  announcements: CourseAnnouncementRef[];
  marksSheet: CourseMarksSheet;
  attendanceSessionsCount: number;
  averageAttendancePercentage: number;
}

export interface SaveAttendanceParams {
  courseCode: string;
  date: string; // YYYY-MM-DD
  topic?: string;
  records: {
    studentId: string;
    status: 'present' | 'absent';
  }[];
}

export interface CourseAttendanceReport {
  courseCode: string;
  totalSessions: number;
  sessions: DailyAttendanceRecord[];
  studentSummaries: {
    studentId: string;
    name: string;
    nameBn: string;
    attended: number;
    total: number;
    percentage: number;
    status: 'safe' | 'warning' | 'critical';
  }[];
}

export interface CreateAssignmentParams {
  courseCode: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
}

export interface GradeSubmissionParams {
  assignmentId: string;
  submissionId: string;
  score: number;
  feedback?: string;
}

export interface AddMaterialParams {
  courseCode: string;
  title: string;
  fileType: 'pdf' | 'slide' | 'doc';
  fileSize: string;
  fileName: string;
}

export interface PublishAnnouncementParams {
  courseCode: string;
  title: string;
  content: string;
}

export interface SaveMarksParams {
  courseCode: string;
  entries: Record<string, {
    attendance: number;
    classTests: number;
    midterm: number;
    finalExam?: number;
  }>;
  submitToChairman?: boolean;
}

export interface TeacherRoutineItem {
  id: string;
  day: string;
  timeSlot: string;
  courseCode: string;
  courseTitle: string;
  room: string;
  enrolledCount: number;
}

export interface TeacherProfileInfo {
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

/**
 * TeacherDataService Interface
 */
export interface TeacherDataService {
  // Real enforcement must move to Firestore rules / Cloud Functions.
  getDashboardData(teacherEmailOrUid: string): Promise<TeacherDashboardData>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getAssignedCourses(teacherEmailOrUid: string): Promise<TeacherCourseSummary[]>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getCourseDetail(teacherEmailOrUid: string, courseCode: string): Promise<TeacherCourseDetail>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getAttendanceSheet(teacherEmailOrUid: string, courseCode: string, date: string): Promise<{
    date: string;
    existingSession: DailyAttendanceRecord | null;
    students: {
      studentId: string;
      rollNumber: string;
      name: string;
      nameBn: string;
      status: 'present' | 'absent';
    }[];
  }>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  saveAttendance(teacherEmailOrUid: string, params: SaveAttendanceParams): Promise<{
    success: boolean;
    message: string;
    session: DailyAttendanceRecord;
  }>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getAttendanceReport(teacherEmailOrUid: string, courseCode: string): Promise<CourseAttendanceReport>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getAssignments(teacherEmailOrUid: string): Promise<any[]>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  createAssignment(teacherEmailOrUid: string, params: CreateAssignmentParams): Promise<{
    success: boolean;
    assignmentId: string;
    message: string;
  }>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  gradeSubmission(teacherEmailOrUid: string, params: GradeSubmissionParams): Promise<{
    success: boolean;
    message: string;
  }>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getMaterials(teacherEmailOrUid: string): Promise<{ courseCode: string; courseTitle: string; materials: CourseMaterialRef[] }[]>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  addMaterial(teacherEmailOrUid: string, params: AddMaterialParams): Promise<{
    success: boolean;
    materialId: string;
    message: string;
  }>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  deleteMaterial(teacherEmailOrUid: string, courseCode: string, materialId: string): Promise<{
    success: boolean;
    message: string;
  }>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getAnnouncements(teacherEmailOrUid: string): Promise<{ courseCode: string; courseTitle: string; announcements: CourseAnnouncementRef[] }[]>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  publishAnnouncement(teacherEmailOrUid: string, params: PublishAnnouncementParams): Promise<{
    success: boolean;
    announcementId: string;
    message: string;
  }>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getMarksSheet(teacherEmailOrUid: string, courseCode: string): Promise<CourseMarksSheet>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  saveMarks(teacherEmailOrUid: string, params: SaveMarksParams): Promise<{
    success: boolean;
    sheet: CourseMarksSheet;
    message: string;
  }>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getRoutine(teacherEmailOrUid: string): Promise<Record<string, TeacherRoutineItem[]>>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getProfile(teacherEmailOrUid: string): Promise<TeacherProfileInfo>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  resetDemoData(): void;
}
