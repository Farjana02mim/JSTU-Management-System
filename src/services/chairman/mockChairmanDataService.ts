/**
 * JSTU Smart Campus — Mock Chairman Data Service
 * 
 * Interacts with SharedDataStoreManager and MarksLifecycleService.
 * Enforces department scope and delegates state machine transitions.
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */

import {
  ChairmanDataService,
  ChairmanDashboardData,
  ChairmanCourseSheetSummary,
  ChairmanSheetDetail,
  ChairmanSheetStatistics
} from './types';
import { MarksLifecycleActor, MarksAuditEntry, MarksTransitionResult, MarksLifecyclePermissionError } from '../marks/lifecycleTypes';
import { getMarksLifecycleService, MarksLifecycleService } from '../marks/marksLifecycleService';
import { SharedDataStoreManager } from '../shared/sharedDataStore';

export class MockChairmanDataService implements ChairmanDataService {
  private storeManager: SharedDataStoreManager;
  private lifecycleService: MarksLifecycleService;

  constructor() {
    this.storeManager = SharedDataStoreManager.getInstance();
    this.lifecycleService = getMarksLifecycleService();
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async getDashboardData(
    chairmanEmailOrUid: string,
    departmentId: string = 'CSE'
  ): Promise<ChairmanDashboardData> {
    const sheets = await this.getDepartmentCourseSheets(chairmanEmailOrUid, departmentId);

    const pendingVerificationCount = sheets.filter((s) => s.status === 'SUBMITTED').length;
    const verifiedCount = sheets.filter((s) => s.status === 'VERIFIED').length;
    const draftCount = sheets.filter((s) => s.status === 'DRAFT').length;
    const publishedCount = sheets.filter((s) => s.status === 'PUBLISHED').length;
    const returnedCount = sheets.filter((s) => s.status === 'RETURNED_TO_TEACHER').length;
    const totalAnomalies = sheets.reduce((acc, s) => acc + s.anomalyCount, 0);

    return {
      departmentId,
      departmentName: departmentId === 'CSE' ? 'Computer Science & Engineering' : departmentId,
      departmentNameBn: departmentId === 'CSE' ? 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং' : departmentId,
      totalCourses: sheets.length,
      pendingVerificationCount,
      verifiedCount,
      draftCount,
      publishedCount,
      returnedCount,
      totalAnomalies,
      recentSheets: sheets,
      facultyMembersCount: 14
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async getDepartmentCourseSheets(
    chairmanEmailOrUid: string,
    departmentId: string = 'CSE',
    statusFilter?: string
  ): Promise<ChairmanCourseSheetSummary[]> {
    const store = this.storeManager.getStore();
    const deptUpper = departmentId.toUpperCase();

    // Filter courses under chairman's department
    const deptCourses = store.courses.filter(
      (c) => (c.department || '').toUpperCase() === deptUpper
    );

    const summaries: ChairmanCourseSheetSummary[] = [];

    for (const course of deptCourses) {
      const sheet = course.marksSheet;
      const anomalies = this.lifecycleService.detectSheetAnomalies(sheet, course.enrolledStudents);
      const hasErrors = anomalies.some((a) => a.severity === 'error');

      if (!statusFilter || statusFilter === 'all' || sheet.status.toLowerCase() === statusFilter.toLowerCase()) {
        summaries.push({
          courseCode: course.code,
          courseTitle: course.title,
          courseTitleBn: course.titleBn,
          credits: course.credits,
          semester: course.semester,
          semesterBn: course.semesterBn,
          department: course.department,
          instructorName: course.instructor,
          instructorEmail: course.instructorEmail,
          status: sheet.status,
          enrolledCount: course.enrolledStudents.length,
          lastUpdated: sheet.lastSavedAt,
          submittedAt: sheet.submittedAt,
          verifiedAt: sheet.verifiedAt,
          anomalyCount: anomalies.length,
          hasErrors,
          anomalies
        });
      }
    }

    return summaries;
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async getSheetDetail(
    chairmanEmailOrUid: string,
    departmentId: string,
    courseCode: string
  ): Promise<ChairmanSheetDetail> {
    const store = this.storeManager.getStore();
    const course = store.courses.find((c) => c.code.toLowerCase() === courseCode.toLowerCase());

    if (!course) {
      throw new Error(`Course with code "${courseCode}" not found.`);
    }

    // Department scope validation: Chairman cannot inspect or act outside their department
    const chairmanDept = (departmentId || 'CSE').toUpperCase();
    const courseDept = (course.department || '').toUpperCase();
    if (chairmanDept !== courseDept) {
      throw new MarksLifecyclePermissionError(
        `Department Scope Violation: Department Chairman of "${chairmanDept}" does not have authority to scrutinize course "${course.code}" under department "${courseDept}".`
      );
    }

    const sheet = course.marksSheet;
    const anomalies = this.lifecycleService.detectSheetAnomalies(sheet, course.enrolledStudents);

    // Compute sheet statistics
    const entries = Object.values(sheet.entries || {});
    let totalMarksSum = 0;
    let highestMarks = 0;
    let lowestMarks = 100;
    let passedCount = 0;
    let failedCount = 0;
    const gradeCounts: Record<string, number> = {
      'A+': 0, 'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 'B-': 0, 'C+': 0, 'C': 0, 'D': 0, 'F': 0
    };

    entries.forEach((entry) => {
      totalMarksSum += entry.total;
      if (entry.total > highestMarks) highestMarks = entry.total;
      if (entry.total < lowestMarks) lowestMarks = entry.total;

      if (entry.letterGrade === 'F' || entry.total < 40) {
        failedCount++;
      } else {
        passedCount++;
      }

      if (gradeCounts[entry.letterGrade] !== undefined) {
        gradeCounts[entry.letterGrade]++;
      }
    });

    const averageMarks = entries.length > 0 ? Math.round((totalMarksSum / entries.length) * 10) / 10 : 0;
    if (entries.length === 0) lowestMarks = 0;

    const stats: ChairmanSheetStatistics = {
      enrolledCount: course.enrolledStudents.length,
      submittedCount: entries.length,
      passedCount,
      failedCount,
      averageMarks,
      highestMarks,
      lowestMarks,
      gradeCounts
    };

    return {
      courseCode: course.code,
      courseTitle: course.title,
      courseTitleBn: course.titleBn,
      credits: course.credits,
      semester: course.semester,
      semesterBn: course.semesterBn,
      department: course.department,
      instructorName: course.instructor,
      instructorEmail: course.instructorEmail,
      status: sheet.status,
      submittedAt: sheet.submittedAt,
      verifiedAt: sheet.verifiedAt,
      returnComment: sheet.returnComment,
      lastSavedAt: sheet.lastSavedAt,
      enrolledStudents: course.enrolledStudents,
      entries: sheet.entries,
      anomalies,
      auditTrail: sheet.auditTrail || [],
      stats
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async verifySheet(
    actor: MarksLifecycleActor,
    courseCode: string
  ): Promise<MarksTransitionResult> {
    // Delegated to state machine transition! UI never changes status directly.
    return this.lifecycleService.transition(courseCode, 'VERIFY', actor);
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async returnSheet(
    actor: MarksLifecycleActor,
    courseCode: string,
    comment: string
  ): Promise<MarksTransitionResult> {
    // Delegated to state machine transition! Comment is required.
    return this.lifecycleService.transition(courseCode, 'RETURN_TO_TEACHER', actor, comment);
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async getAuditHistory(courseCode: string): Promise<MarksAuditEntry[]> {
    return this.lifecycleService.getAuditHistory(courseCode);
  }
}

let chairmanDataServiceInstance: ChairmanDataService | null = null;
export function getChairmanDataService(): ChairmanDataService {
  if (!chairmanDataServiceInstance) {
    chairmanDataServiceInstance = new MockChairmanDataService();
  }
  return chairmanDataServiceInstance;
}
