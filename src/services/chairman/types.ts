/**
 * JSTU Smart Campus — Chairman Service Types & Interfaces
 * 
 * Compliant with JSTU Departmental Examination Committee rules.
 * All methods require RBAC enforcement comment:
 * // Real enforcement must move to Firestore rules / Cloud Functions.
 */

import { MarksSheetStatus, MarksAuditEntry, MarksAnomaly, MarksTransitionResult, MarksLifecycleActor } from '../marks/lifecycleTypes';
import { EnrolledStudentRef, StudentMarksRecord } from '../shared/sharedDataStore';

export interface ChairmanCourseSheetSummary {
  courseCode: string;
  courseTitle: string;
  courseTitleBn: string;
  credits: number;
  semester: string;
  semesterBn: string;
  department: string;
  instructorName: string;
  instructorEmail: string;
  status: MarksSheetStatus;
  enrolledCount: number;
  lastUpdated: string;
  submittedAt?: string;
  verifiedAt?: string;
  anomalyCount: number;
  hasErrors: boolean;
  anomalies: MarksAnomaly[];
}

export interface ChairmanSheetStatistics {
  enrolledCount: number;
  submittedCount: number;
  passedCount: number;
  failedCount: number;
  averageMarks: number;
  highestMarks: number;
  lowestMarks: number;
  gradeCounts: Record<string, number>;
}

export interface ChairmanSheetDetail {
  courseCode: string;
  courseTitle: string;
  courseTitleBn: string;
  credits: number;
  semester: string;
  semesterBn: string;
  department: string;
  instructorName: string;
  instructorEmail: string;
  status: MarksSheetStatus;
  submittedAt?: string;
  verifiedAt?: string;
  returnComment?: string;
  lastSavedAt: string;
  enrolledStudents: EnrolledStudentRef[];
  entries: Record<string, StudentMarksRecord>;
  anomalies: MarksAnomaly[];
  auditTrail: MarksAuditEntry[];
  stats: ChairmanSheetStatistics;
}

export interface ChairmanDashboardData {
  departmentId: string;
  departmentName: string;
  departmentNameBn: string;
  totalCourses: number;
  pendingVerificationCount: number;
  verifiedCount: number;
  draftCount: number;
  publishedCount: number;
  returnedCount: number;
  totalAnomalies: number;
  recentSheets: ChairmanCourseSheetSummary[];
  facultyMembersCount: number;
}

export interface ChairmanDataService {
  // Real enforcement must move to Firestore rules / Cloud Functions.
  getDashboardData(chairmanEmailOrUid: string, departmentId?: string): Promise<ChairmanDashboardData>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getDepartmentCourseSheets(
    chairmanEmailOrUid: string,
    departmentId?: string,
    statusFilter?: string
  ): Promise<ChairmanCourseSheetSummary[]>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getSheetDetail(
    chairmanEmailOrUid: string,
    departmentId: string,
    courseCode: string
  ): Promise<ChairmanSheetDetail>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  verifySheet(
    actor: MarksLifecycleActor,
    courseCode: string
  ): Promise<MarksTransitionResult>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  returnSheet(
    actor: MarksLifecycleActor,
    courseCode: string,
    comment: string
  ): Promise<MarksTransitionResult>;

  // Real enforcement must move to Firestore rules / Cloud Functions.
  getAuditHistory(courseCode: string): Promise<MarksAuditEntry[]>;
}
