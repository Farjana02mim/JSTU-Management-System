/**
 * JSTU Smart Campus — Admin & Chairman Analytics Dashboard Types
 *
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */

export interface AnalyticsStatCards {
  totalStudents: number;
  totalTeachers: number;
  totalDepartments: number;
  departmentCode?: string;
  pendingApplications: number;
  pendingAccountRequests: number;
  documentsIssued: number;
}

export interface StudentsPerDepartmentItem {
  department: string;
  departmentBn: string;
  students: number;
  facultyCount: number;
  color?: string;
}

export interface ApplicationStatusBreakdownItem {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  label: string;
  labelBn: string;
  count: number;
  percentage: number;
  color: string;
}

export interface AttendancePerDepartmentItem {
  department: string;
  departmentBn: string;
  courseCode?: string;
  courseTitle?: string;
  averageAttendance: number; // percentage (0-100)
}

export interface GradeDistributionItem {
  grade: string;
  count: number;
  percentage: number;
  gpa: number;
  color: string;
}

export interface FeeComparisonData {
  totalCollected: number;
  totalDue: number;
  totalPayable: number;
  collectionRate: number; // percentage
  categories: {
    category: string;
    categoryBn: string;
    collected: number;
    due: number;
  }[];
}

export interface ApplicationsPerMonthItem {
  month: string;
  monthBn: string;
  count: number;
  approved: number;
  pending: number;
  rejected: number;
}

export interface ActivityFeedItem {
  id: string;
  role: string;
  roleBn: string;
  action: string;
  actionBn: string;
  timestamp: string;
  timeAgo: string;
  timeAgoBn: string;
  statusType: 'success' | 'warning' | 'info' | 'neutral';
}

export interface DashboardAnalyticsData {
  isDemoData: boolean;
  departmentScoped: boolean;
  departmentId?: string;
  departmentName?: string;
  departmentNameBn?: string;
  statCards: AnalyticsStatCards;
  studentsPerDepartment: StudentsPerDepartmentItem[];
  applicationStatusBreakdown: ApplicationStatusBreakdownItem[];
  averageAttendance: AttendancePerDepartmentItem[];
  gradeDistribution: GradeDistributionItem[];
  feeComparison: FeeComparisonData;
  applicationsPerMonth: ApplicationsPerMonthItem[];
  recentActivities: ActivityFeedItem[];
}

export interface AnalyticsService {
  getAdminAnalytics(): Promise<DashboardAnalyticsData>;
  getDepartmentAnalytics(departmentId: string): Promise<DashboardAnalyticsData>;
}
