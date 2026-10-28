export interface StudentOverviewStats {
  cgpa: number;
  completedCredits: number;
  currentSemesterCredits: number;
  overallAttendanceRate: number;
  pendingAssignmentsCount: number;
  unpaidFeesCount: number;
  unreadNotificationsCount: number;
}

export interface TodayClassItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  courseTitleBn: string;
  timeSlot: string;
  room: string;
  instructor: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface StudentDashboardData {
  stats: StudentOverviewStats;
  todayClasses: TodayClassItem[];
  departmentNotices: {
    id: string;
    title: string;
    titleBn: string;
    date: string;
    category: string;
    isImportant?: boolean;
  }[];
  quickActions: {
    title: string;
    titleBn: string;
    to: string;
    icon: string;
  }[];
}

export interface CourseItem {
  id: string;
  code: string;
  title: string;
  titleBn: string;
  credits: number;
  semester: string;
  department: string;
  instructor: string;
  instructorEmail: string;
  attendancePercentage: number;
  color?: string;
}

export interface CourseMaterial {
  id: string;
  title: string;
  fileType: 'pdf' | 'slide' | 'doc';
  fileSize: string;
  uploadDate: string;
  downloadUrl: string;
}

export interface CourseAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface CourseDetail extends CourseItem {
  syllabusOverview: string;
  syllabusOverviewBn: string;
  materials: CourseMaterial[];
  announcements: CourseAnnouncement[];
  attendanceBreakdown: {
    totalClasses: number;
    attendedClasses: number;
    percentage: number;
  };
  marksBreakdown: {
    classAttendance: number; // max 10
    quizzes: number; // max 20
    midterm: number; // max 30
    semesterFinal?: number; // max 40
    totalEstimated: number; // out of 100
    letterGrade?: string;
  };
}

export interface AttendanceCourse {
  code: string;
  title: string;
  titleBn: string;
  credits: number;
  attended: number;
  total: number;
  percentage: number;
  status: 'safe' | 'warning' | 'critical'; // green >=75, yellow 60-74, red <60
}

export interface CourseResultRecord {
  code: string;
  title: string;
  titleBn: string;
  credits: number;
  marks?: number;
  letterGrade?: string;
  gradePoint?: number;
  status?: 'PUBLISHED' | 'PENDING' | 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'RETURNED_TO_TEACHER';
  isPending?: boolean;
}

export interface SemesterResult {
  semesterNumber: number;
  semesterName: string;
  semesterNameBn: string;
  session: string;
  courses: CourseResultRecord[];
  totalCredits: number;
  earnedCredits: number;
  sgpa: number;
  cumulativeCgpa: number;
  status: 'published' | 'in_progress';
}

export interface ClassScheduleItem {
  id: string;
  day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
  timeSlot: string;
  courseCode: string;
  courseTitle: string;
  room: string;
  instructor: string;
}

export interface AssignmentItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  status: 'pending' | 'submitted' | 'graded';
  submittedAt?: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  score?: number;
  feedback?: string;
}

export interface FeeInvoiceItem {
  id: string;
  invoiceNumber: string;
  title: string;
  titleBn: string;
  category: 'Tuition' | 'Exam' | 'Hall' | 'Library' | 'Registration';
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid';
  paidAt?: string;
  transactionId?: string;
  paymentMethod?: string;
}

export interface FeeBreakdown {
  studentId: string;
  currentSemester: string;
  totalPayable: number;
  totalPaid: number;
  totalDue: number;
  invoices: FeeInvoiceItem[];
}

export interface StudentNotification {
  id: string;
  title: string;
  titleBn: string;
  message: string;
  messageBn: string;
  category: 'academic' | 'exam' | 'fee' | 'urgent';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface StudentProfileData {
  uid: string;
  studentId: string; // e.g. "JSTU2026001"
  fullName: string;
  fullNameBn: string;
  email: string;
  phone: string;
  department: string;
  departmentBn: string;
  semester: string;
  semesterBn: string;
  academicSession: string;
  hallName: string;
  hallNameBn: string;
  advisorName: string;
  advisorEmail: string;
  bloodGroup: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  addressBn: string;
  cgpa: number;
  creditsEarned: number;
}

/**
 * StudentDataService Interface
 * All components must interact with this service.
 * In production, a Firestore implementation will replace the Mock implementation.
 */
export interface StudentDataService {
  // Real enforcement must move to Firestore rules / Cloud Functions.
  getDashboardData(studentUid: string): Promise<StudentDashboardData>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getCourses(studentUid: string): Promise<CourseItem[]>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getCourseDetail(studentUid: string, courseCode: string): Promise<CourseDetail | null>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getAttendance(studentUid: string): Promise<AttendanceCourse[]>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getResults(studentUid: string): Promise<SemesterResult[]>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getClassRoutine(studentUid: string): Promise<Record<string, ClassScheduleItem[]>>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getAssignments(studentUid: string): Promise<AssignmentItem[]>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  submitAssignment(
    studentUid: string,
    assignmentId: string,
    file: { name: string; size: number }
  ): Promise<{ success: boolean; message: string }>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getFees(studentUid: string): Promise<FeeBreakdown>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  payFee(
    studentUid: string,
    invoiceId: string,
    method: string
  ): Promise<{ success: boolean; transactionId: string; message: string }>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getNotifications(studentUid: string): Promise<StudentNotification[]>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  markNotificationRead(studentUid: string, notificationId: string): Promise<void>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getProfile(studentUid: string): Promise<StudentProfileData>;

  // Reset local demo data
  resetDemoData(): void;
}
