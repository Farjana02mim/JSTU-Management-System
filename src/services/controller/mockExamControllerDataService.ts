/**
 * JSTU Smart Campus — Mock Exam Controller Data Service
 * 
 * Interacts with SharedDataStoreManager and MarksLifecycleService.
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */

import {
  ExamControllerDataService,
  ExamControllerDashboardData,
  ControllerCourseSheetSummary,
  ControllerSheetDetail
} from './types';
import {
  MarksLifecycleActor,
  MarksTransitionResult,
  MarksCorrectionRequest,
  MarksSheetVersionSnapshot
} from '../marks/lifecycleTypes';
import { getMarksLifecycleService, MarksLifecycleService } from '../marks/marksLifecycleService';
import { SharedDataStoreManager } from '../shared/sharedDataStore';

export class MockExamControllerDataService implements ExamControllerDataService {
  private storeManager: SharedDataStoreManager;
  private lifecycleService: MarksLifecycleService;

  constructor() {
    this.storeManager = SharedDataStoreManager.getInstance();
    this.lifecycleService = getMarksLifecycleService();
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async getDashboard(_actorEmailOrUid: string): Promise<ExamControllerDashboardData> {
    const store = this.storeManager.getStore();
    const courses = store.courses;

    let awaitingPublicationCount = 0;
    let publishedCount = 0;
    let verifiedCount = 0;
    let submittedCount = 0;
    let draftCount = 0;
    let pendingCorrectionsCount = 0;

    const deptMap = new Map<string, { verified: number; published: number; total: number }>();

    for (const c of courses) {
      const st = c.marksSheet.status;
      if (st === 'VERIFIED') {
        awaitingPublicationCount++;
        verifiedCount++;
      } else if (st === 'PUBLISHED') {
        publishedCount++;
      } else if (st === 'SUBMITTED') {
        submittedCount++;
      } else if (st === 'DRAFT') {
        draftCount++;
      }

      const pendingCorr = (c.marksSheet.corrections || []).filter((cr) => cr.status === 'PENDING').length;
      pendingCorrectionsCount += pendingCorr;

      const dept = (c.department || 'GENERAL').toUpperCase();
      const currentDept = deptMap.get(dept) || { verified: 0, published: 0, total: 0 };
      currentDept.total++;
      if (st === 'VERIFIED') currentDept.verified++;
      if (st === 'PUBLISHED') currentDept.published++;
      deptMap.set(dept, currentDept);
    }

    const departments = Array.from(deptMap.entries()).map(([departmentId, data]) => ({
      departmentId,
      departmentName: departmentId === 'CSE' ? 'Computer Science & Engineering' : departmentId === 'EEE' ? 'Electrical & Electronic Engineering' : departmentId,
      verifiedCount: data.verified,
      publishedCount: data.published,
      totalCount: data.total
    }));

    return {
      totalCoursesCount: courses.length,
      awaitingPublicationCount,
      publishedCount,
      verifiedCount,
      submittedCount,
      draftCount,
      pendingCorrectionsCount,
      departments
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async getSheets(params?: {
    department?: string;
    semester?: string;
    status?: string;
    searchQuery?: string;
  }): Promise<ControllerCourseSheetSummary[]> {
    const store = this.storeManager.getStore();
    let courses = store.courses;

    if (params?.department && params.department !== 'all') {
      const dUpper = params.department.toUpperCase();
      courses = courses.filter((c) => (c.department || '').toUpperCase() === dUpper);
    }

    if (params?.semester && params.semester !== 'all') {
      courses = courses.filter((c) => c.semester.toLowerCase().includes(params.semester!.toLowerCase()));
    }

    if (params?.status && params.status !== 'all') {
      courses = courses.filter((c) => c.marksSheet.status.toLowerCase() === params.status!.toLowerCase());
    }

    if (params?.searchQuery && params.searchQuery.trim().length > 0) {
      const q = params.searchQuery.trim().toLowerCase();
      courses = courses.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q)
      );
    }

    return courses.map((c) => {
      const anomalies = this.lifecycleService.detectSheetAnomalies(c.marksSheet, c.enrolledStudents);
      const pendingCorr = (c.marksSheet.corrections || []).filter((cr) => cr.status === 'PENDING').length;

      return {
        courseCode: c.code,
        courseTitle: c.title,
        courseTitleBn: c.titleBn,
        credits: c.credits,
        semester: c.semester,
        semesterBn: c.semesterBn,
        department: c.department,
        instructorName: c.instructor,
        instructorEmail: c.instructorEmail,
        status: c.marksSheet.status,
        currentVersion: c.marksSheet.currentVersion || 1,
        enrolledCount: c.enrolledStudents.length,
        submittedAt: c.marksSheet.submittedAt,
        verifiedAt: c.marksSheet.verifiedAt,
        publishedAt: c.marksSheet.publishedAt,
        lastUpdated: c.marksSheet.lastSavedAt,
        anomalyCount: anomalies.length,
        pendingCorrectionsCount: pendingCorr
      };
    });
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async getSheetDetail(courseCode: string): Promise<ControllerSheetDetail> {
    const store = this.storeManager.getStore();
    const course = store.courses.find((c) => c.code.toLowerCase() === courseCode.toLowerCase());
    if (!course) {
      throw new Error(`Course "${courseCode}" not found.`);
    }

    const sheet = course.marksSheet;
    const anomalies = this.lifecycleService.detectSheetAnomalies(sheet, course.enrolledStudents);
    const entries = Object.values(sheet.entries || {});

    let passedCount = 0;
    let failedCount = 0;
    let totalMarksSum = 0;
    let highestMarks = 0;
    let lowestMarks = entries.length > 0 ? 100 : 0;
    const gradeCounts: Record<string, number> = {};

    entries.forEach((e) => {
      totalMarksSum += e.total;
      if (e.total > highestMarks) highestMarks = e.total;
      if (e.total < lowestMarks) lowestMarks = e.total;

      if (e.letterGrade === 'F' || e.total < 40) {
        failedCount++;
      } else {
        passedCount++;
      }

      gradeCounts[e.letterGrade] = (gradeCounts[e.letterGrade] || 0) + 1;
    });

    const averageMarks = entries.length > 0 ? Math.round((totalMarksSum / entries.length) * 10) / 10 : 0;

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
      currentVersion: sheet.currentVersion || 1,
      submittedAt: sheet.submittedAt,
      verifiedAt: sheet.verifiedAt,
      publishedAt: sheet.publishedAt,
      returnComment: sheet.returnComment,
      lastSavedAt: sheet.lastSavedAt,
      enrolledStudents: course.enrolledStudents,
      entries: sheet.entries,
      anomalies,
      auditTrail: sheet.auditTrail || [],
      corrections: sheet.corrections || [],
      versions: sheet.versions || [],
      statistics: {
        enrolledCount: course.enrolledStudents.length,
        passedCount,
        failedCount,
        averageMarks,
        highestMarks,
        lowestMarks,
        gradeCounts
      }
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async publishSheet(
    courseCode: string,
    actor: MarksLifecycleActor
  ): Promise<MarksTransitionResult> {
    return this.lifecycleService.transition(courseCode, 'PUBLISH', actor);
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async returnSheet(
    courseCode: string,
    comment: string,
    actor: MarksLifecycleActor
  ): Promise<MarksTransitionResult> {
    return this.lifecycleService.transition(courseCode, 'RETURN_TO_CHAIRMAN', actor, comment);
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async bulkPublishDepartment(
    departmentId: string,
    actor: MarksLifecycleActor
  ): Promise<{ publishedCourses: string[]; skippedCourses: string[] }> {
    return this.lifecycleService.bulkPublishDepartment(departmentId, actor);
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async approveCorrection(
    courseCode: string,
    correctionId: string,
    actor: MarksLifecycleActor,
    comment?: string
  ): Promise<{ snapshot: MarksSheetVersionSnapshot; newVersion: number }> {
    return this.lifecycleService.approveCorrection(courseCode, correctionId, actor, comment);
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async rejectCorrection(
    courseCode: string,
    correctionId: string,
    actor: MarksLifecycleActor,
    reason: string
  ): Promise<MarksCorrectionRequest> {
    return this.lifecycleService.rejectCorrection(courseCode, correctionId, actor, reason);
  }
}

let controllerServiceInstance: MockExamControllerDataService | null = null;
export function getExamControllerDataService(): MockExamControllerDataService {
  if (!controllerServiceInstance) {
    controllerServiceInstance = new MockExamControllerDataService();
  }
  return controllerServiceInstance;
}
