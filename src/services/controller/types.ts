/**
 * JSTU Smart Campus — Exam Controller Service Types & Interfaces
 * 
 * Compliant with JSTU Controller of Examinations Ordinance.
 * All methods require RBAC enforcement comment:
 * // Real enforcement must move to Firestore rules / Cloud Functions.
 */

import {
  MarksSheetStatus,
  MarksAuditEntry,
  MarksAnomaly,
  MarksTransitionResult,
  MarksLifecycleActor,
  MarksCorrectionRequest,
  MarksSheetVersionSnapshot
} from '../marks/lifecycleTypes';
import { EnrolledStudentRef, StudentMarksRecord } from '../shared/sharedDataStore';

export interface ExamControllerDashboardData {
  totalCoursesCount: number;
  awaitingPublicationCount: number;
  publishedCount: number;
  verifiedCount: number;
  submittedCount: number;
  draftCount: number;
  pendingCorrectionsCount: number;
  departments: Array<{
    departmentId: string;
    departmentName: string;
    verifiedCount: number;
    publishedCount: number;
    totalCount: number;
  }>;
}

export interface ControllerCourseSheetSummary {
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
  currentVersion: number;
  enrolledCount: number;
  submittedAt?: string;
  verifiedAt?: string;
  publishedAt?: string;
  lastUpdated: string;
  anomalyCount: number;
  pendingCorrectionsCount: number;
}

export interface ControllerSheetDetail {
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
  currentVersion: number;
  submittedAt?: string;
  verifiedAt?: string;
  publishedAt?: string;
  returnComment?: string;
  lastSavedAt: string;
  enrolledStudents: EnrolledStudentRef[];
  entries: Record<string, StudentMarksRecord>;
  anomalies: MarksAnomaly[];
  auditTrail: MarksAuditEntry[];
  corrections: MarksCorrectionRequest[];
  versions: MarksSheetVersionSnapshot[];
  statistics: {
    enrolledCount: number;
    passedCount: number;
    failedCount: number;
    averageMarks: number;
    highestMarks: number;
    lowestMarks: number;
    gradeCounts: Record<string, number>;
  };
}

export interface ExamControllerDataService {
  getDashboard(actorEmailOrUid: string): Promise<ExamControllerDashboardData>;
  getSheets(params?: {
    department?: string;
    semester?: string;
    status?: string;
    searchQuery?: string;
  }): Promise<ControllerCourseSheetSummary[]>;
  getSheetDetail(courseCode: string): Promise<ControllerSheetDetail>;
  publishSheet(
    courseCode: string,
    actor: MarksLifecycleActor
  ): Promise<MarksTransitionResult>;
  returnSheet(
    courseCode: string,
    comment: string,
    actor: MarksLifecycleActor
  ): Promise<MarksTransitionResult>;
  bulkPublishDepartment(
    departmentId: string,
    actor: MarksLifecycleActor
  ): Promise<{ publishedCourses: string[]; skippedCourses: string[] }>;
  approveCorrection(
    courseCode: string,
    correctionId: string,
    actor: MarksLifecycleActor,
    comment?: string
  ): Promise<{ snapshot: MarksSheetVersionSnapshot; newVersion: number }>;
  rejectCorrection(
    courseCode: string,
    correctionId: string,
    actor: MarksLifecycleActor,
    reason: string
  ): Promise<MarksCorrectionRequest>;
}
