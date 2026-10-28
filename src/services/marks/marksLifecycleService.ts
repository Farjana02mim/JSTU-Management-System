/**
 * JSTU Smart Campus — Marks Lifecycle State Machine Service
 * 
 * Enforces rigid state machine transitions and role-based department scopes:
 * DRAFT -> SUBMITTED -> VERIFIED -> PUBLISHED (or RETURNED_TO_TEACHER)
 * 
 * Append-only audit trail logging for all transitions.
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */

import {
  MarksSheetStatus,
  MarksLifecycleAction,
  MarksLifecycleActor,
  MarksAuditEntry,
  MarksAnomaly,
  MarksTransitionResult,
  MarksLifecyclePermissionError,
  MarksLifecycleValidationError,
  MarksCorrectionRequest,
  MarksSheetVersionSnapshot
} from './lifecycleTypes';
import { SharedDataStoreManager, CourseMarksSheet, SharedCourse, EnrolledStudentRef } from '../shared/sharedDataStore';
import { MARKS_LIMITS, computeTotalMarks } from '../../utils/marksCalculator';

export class MarksLifecycleService {
  private static instance: MarksLifecycleService | null = null;
  private storeManager: SharedDataStoreManager;

  constructor() {
    this.storeManager = SharedDataStoreManager.getInstance();
  }

  public static getInstance(): MarksLifecycleService {
    if (!MarksLifecycleService.instance) {
      MarksLifecycleService.instance = new MarksLifecycleService();
    }
    return MarksLifecycleService.instance;
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async getSheet(courseCodeOrSheetId: string): Promise<{
    course: SharedCourse;
    sheet: CourseMarksSheet;
    anomalies: MarksAnomaly[];
  }> {
    const store = this.storeManager.getStore();
    const course = store.courses.find(
      (c) => c.code.toLowerCase() === courseCodeOrSheetId.toLowerCase() ||
             c.marksSheet.id === courseCodeOrSheetId ||
             c.id === courseCodeOrSheetId
    );

    if (!course) {
      throw new Error(`Course or Result Sheet "${courseCodeOrSheetId}" not found.`);
    }

    const sheet = course.marksSheet;
    if (!sheet.auditTrail) {
      sheet.auditTrail = [];
    }

    const anomalies = this.detectSheetAnomalies(sheet, course.enrolledStudents);

    return { course, sheet, anomalies };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public detectSheetAnomalies(sheet: CourseMarksSheet, enrolledStudents: EnrolledStudentRef[]): MarksAnomaly[] {
    const anomalies: MarksAnomaly[] = [];
    const entries = Object.values(sheet.entries || {});

    if (entries.length === 0) {
      anomalies.push({
        type: 'missing_entry',
        severity: 'warning',
        message: 'No student marks entries recorded on this tabulation sheet.',
        messageBn: 'এই মার্কস শিটে কোনো শিক্ষার্থীর নম্বর লিপিবদ্ধ করা হয়নি।'
      });
      return anomalies;
    }

    let failCount = 0;
    const studentMap = new Map(enrolledStudents.map((s) => [s.studentId, s.name]));

    for (const entry of entries) {
      const studentName = studentMap.get(entry.studentId) || entry.studentId;

      // 1. Check Ceiling Limits
      if (entry.attendance < MARKS_LIMITS.attendance.min || entry.attendance > MARKS_LIMITS.attendance.max) {
        anomalies.push({
          type: 'marks_ceiling',
          severity: 'error',
          studentId: entry.studentId,
          studentName,
          field: 'attendance',
          message: `${studentName} attendance marks (${entry.attendance}) exceeds institutional limit [${MARKS_LIMITS.attendance.min}-${MARKS_LIMITS.attendance.max}].`,
          messageBn: `${studentName}-এর উপস্থিতি নম্বর (${entry.attendance}) নির্ধারিত সীমা অতিক্রম করেছে।`
        });
      }

      if (entry.classTests < MARKS_LIMITS.classTests.min || entry.classTests > MARKS_LIMITS.classTests.max) {
        anomalies.push({
          type: 'marks_ceiling',
          severity: 'error',
          studentId: entry.studentId,
          studentName,
          field: 'classTests',
          message: `${studentName} class test marks (${entry.classTests}) exceeds limit [${MARKS_LIMITS.classTests.min}-${MARKS_LIMITS.classTests.max}].`,
          messageBn: `${studentName}-এর ক্লাস টেস্ট নম্বর (${entry.classTests}) নির্ধারিত সীমা অতিক্রম করেছে।`
        });
      }

      if (entry.midterm < MARKS_LIMITS.midterm.min || entry.midterm > MARKS_LIMITS.midterm.max) {
        anomalies.push({
          type: 'marks_ceiling',
          severity: 'error',
          studentId: entry.studentId,
          studentName,
          field: 'midterm',
          message: `${studentName} midterm marks (${entry.midterm}) exceeds limit [${MARKS_LIMITS.midterm.min}-${MARKS_LIMITS.midterm.max}].`,
          messageBn: `${studentName}-এর মিডটার্ম নম্বর (${entry.midterm}) নির্ধারিত সীমা অতিক্রম করেছে।`
        });
      }

      if (entry.finalExam !== undefined) {
        if (entry.finalExam < MARKS_LIMITS.finalExam.min || entry.finalExam > MARKS_LIMITS.finalExam.max) {
          anomalies.push({
            type: 'marks_ceiling',
            severity: 'error',
            studentId: entry.studentId,
            studentName,
            field: 'finalExam',
            message: `${studentName} semester final marks (${entry.finalExam}) exceeds limit [${MARKS_LIMITS.finalExam.min}-${MARKS_LIMITS.finalExam.max}].`,
            messageBn: `${studentName}-এর ফাইনাল পরীক্ষা নম্বর (${entry.finalExam}) নির্ধারিত সীমা অতিক্রম করেছে।`
          });
        }
      }

      // 2. Total Mismatch Check
      const finalVal = entry.finalExam || 0;
      const expectedTotal = Math.round((entry.attendance + entry.classTests + entry.midterm + finalVal) * 10) / 10;
      const recordedTotal = Math.round(entry.total * 10) / 10;
      if (Math.abs(expectedTotal - recordedTotal) > 0.05) {
        anomalies.push({
          type: 'total_mismatch',
          severity: 'error',
          studentId: entry.studentId,
          studentName,
          field: 'total',
          message: `${studentName} total marks discrepancy: Recorded ${recordedTotal}, but sum is ${expectedTotal}.`,
          messageBn: `${studentName}-এর মোট নম্বরে গরমিল: রেকর্ডকৃত ${recordedTotal}, কিন্তু হিসাব অনুযায়ী ${expectedTotal}।`
        });
      }

      // 3. Count F grades
      if (entry.letterGrade === 'F' || entry.total < 40) {
        failCount++;
      }
    }

    // 4. High Failure Rate Alert (threshold >= 25% of enrolled)
    const failureRate = Math.round((failCount / entries.length) * 100);
    if (entries.length >= 3 && failureRate >= 25) {
      anomalies.push({
        type: 'high_failure_rate',
        severity: 'warning',
        message: `High failure rate alert: ${failCount} of ${entries.length} students (${failureRate}%) failed. Scrutiny required.`,
        messageBn: `উচ্চ অনুত্তীর্ণ হারের সতর্কতা: ${entries.length} জনের মধ্যে ${failCount} জন (${failureRate}%) অনুত্তীর্ণ। বিশেষ পুনঃনিরীক্ষণ প্রয়োজন।`,
        details: { failCount, totalStudents: entries.length, failureRate }
      });
    }

    return anomalies;
  }

  /**
   * The core State Machine Transition function.
   * transition(resultSheetId, action, actor, comment?)
   * 
   * Strict enforcement of actor role, department scope, and current status.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public async transition(
    resultSheetId: string,
    action: MarksLifecycleAction,
    actor: MarksLifecycleActor,
    comment?: string
  ): Promise<MarksTransitionResult> {
    const store = this.storeManager.getStore();
    const course = store.courses.find(
      (c) => c.code.toLowerCase() === resultSheetId.toLowerCase() ||
             c.marksSheet.id === resultSheetId ||
             c.id === resultSheetId
    );

    if (!course) {
      throw new Error(`Result Sheet or Course "${resultSheetId}" not found in institutional database.`);
    }

    const sheet = course.marksSheet;
    if (!sheet.auditTrail) {
      sheet.auditTrail = [];
    }

    const prevStatus = sheet.status;

    // RULE: PUBLISHED sheets are immutable and locked
    if (prevStatus === 'PUBLISHED') {
      throw new MarksLifecyclePermissionError(
        `Result sheet for ${course.code} is PUBLISHED and immutable. Direct state transition is strictly prohibited.`
      );
    }

    let nextStatus: MarksSheetStatus;

    switch (action) {
      case 'SUBMIT': {
        // Teacher submits marks sheet
        if (actor.role !== 'teacher' && actor.role !== 'super_admin') {
          throw new MarksLifecyclePermissionError(
            `Unauthorized action: Only assigned course teachers can submit marks sheets. User role "${actor.role}" is denied.`
          );
        }

        // Scope check: Teacher must be assigned to this course
        const isDemoTeacher =
          actor.uid === store.teacherProfile.uid ||
          actor.email.toLowerCase() === store.teacherProfile.email.toLowerCase();

        const isAssigned =
          (isDemoTeacher && store.teacherProfile.assignedCourseCodes.includes(course.code)) ||
          course.instructorUid === actor.uid ||
          course.instructorEmail.toLowerCase() === actor.email.toLowerCase();

        if (!isAssigned && actor.role !== 'super_admin') {
          throw new MarksLifecyclePermissionError(
            `Scope Violation: Teacher "${actor.email}" is not assigned to course "${course.code}". Access denied.`
          );
        }

        // Allowed status check: only from DRAFT or RETURNED_TO_TEACHER
        if (prevStatus !== 'DRAFT' && prevStatus !== 'RETURNED_TO_TEACHER') {
          throw new MarksLifecycleValidationError(
            `Illegal State Transition: Cannot SUBMIT sheet with current status "${prevStatus}". Allowed prior statuses: DRAFT or RETURNED_TO_TEACHER.`
          );
        }

        nextStatus = 'SUBMITTED';
        sheet.submittedAt = new Date().toISOString();

        // Notification to Department Chairman
        store.teacherNotifications.unshift({
          id: `t-notif-${Date.now()}`,
          title: `Marks Sheet Submitted: ${course.code}`,
          titleBn: `মার্কস শিট জমা দেওয়া হয়েছে: ${course.code}`,
          message: `Tabulation marks sheet for ${course.code} submitted to Chairman for departmental scrutiny.`,
          messageBn: `${course.code} কোর্সের মার্কস শিট চেয়ারম্যানের অনুমোদনের জন্য জমা দেওয়া হয়েছে।`,
          category: 'marks',
          timestamp: new Date().toISOString(),
          read: false,
          link: `/chairman`
        });
        break;
      }

      case 'VERIFY': {
        // Chairman verifies marks sheet
        if (actor.role !== 'dept_chairman' && actor.role !== 'super_admin') {
          throw new MarksLifecyclePermissionError(
            `Unauthorized action: Only the Department Chairman can verify marks sheets. User role "${actor.role}" is denied.`
          );
        }

        // Scope check: Chairman department must match course department
        const actorDept = (actor.departmentId || '').toUpperCase();
        const courseDept = (course.department || '').toUpperCase();
        if (actorDept !== courseDept && actor.role !== 'super_admin') {
          throw new MarksLifecyclePermissionError(
            `Department Scope Violation: Chairman of department "${actorDept}" cannot verify courses under "${courseDept}".`
          );
        }

        // Allowed status check: strictly from SUBMITTED
        if (prevStatus !== 'SUBMITTED') {
          throw new MarksLifecycleValidationError(
            `Illegal State Transition: Cannot VERIFY sheet with current status "${prevStatus}". Verification is only permitted from SUBMITTED.`
          );
        }

        nextStatus = 'VERIFIED';
        sheet.verifiedAt = new Date().toISOString();

        // Notification to Course Teacher
        store.teacherNotifications.unshift({
          id: `t-notif-verified-${Date.now()}`,
          title: `Marks Sheet Verified: ${course.code}`,
          titleBn: `মার্কস শিট অনুমোদিত: ${course.code}`,
          message: `Dept. Chairman has verified and endorsed marks for ${course.code}. Forwarded to Exam Controller.`,
          messageBn: `বিভাগীয় চেয়ারম্যান ${course.code} কোর্সের মার্কস অনুমোদন করেছেন এবং পরীক্ষা নিয়ন্ত্রক দপ্তরে প্রেরণ করেছেন।`,
          category: 'marks',
          timestamp: new Date().toISOString(),
          read: false,
          link: `/teacher/marks/${course.code}`
        });
        break;
      }

      case 'RETURN_TO_TEACHER': {
        // Chairman returns marks sheet to teacher
        if (actor.role !== 'dept_chairman' && actor.role !== 'super_admin') {
          throw new MarksLifecyclePermissionError(
            `Unauthorized action: Only the Department Chairman can return marks sheets. User role "${actor.role}" is denied.`
          );
        }

        // Scope check: Chairman department must match course department
        const actorDept = (actor.departmentId || '').toUpperCase();
        const courseDept = (course.department || '').toUpperCase();
        if (actorDept !== courseDept && actor.role !== 'super_admin') {
          throw new MarksLifecyclePermissionError(
            `Department Scope Violation: Chairman of department "${actorDept}" cannot return courses under "${courseDept}".`
          );
        }

        // Allowed status check: strictly from SUBMITTED
        if (prevStatus !== 'SUBMITTED') {
          throw new MarksLifecycleValidationError(
            `Illegal State Transition: Cannot RETURN sheet with current status "${prevStatus}". Return is only permitted from SUBMITTED.`
          );
        }

        // Mandatory comment check
        if (!comment || comment.trim().length < 5) {
          throw new MarksLifecycleValidationError(
            'Mandatory Review Comment Required: A clear explanation (minimum 5 characters) must be provided when returning a marks sheet.'
          );
        }

        nextStatus = 'RETURNED_TO_TEACHER';
        sheet.returnComment = comment.trim();

        // Notification to Course Teacher
        store.teacherNotifications.unshift({
          id: `t-notif-returned-${Date.now()}`,
          title: `Marks Sheet Returned: ${course.code}`,
          titleBn: `মার্কস শিট সংশোধনের জন্য ফেরত পাঠানো হয়েছে: ${course.code}`,
          message: `Chairman returned ${course.code} marks sheet. Note: "${comment.trim()}"`,
          messageBn: `চেয়ারম্যান ${course.code} মার্কস শিট ফেরত পাঠিয়েছেন। মন্তব্য: "${comment.trim()}"`,
          category: 'marks',
          timestamp: new Date().toISOString(),
          read: false,
          link: `/teacher/marks/${course.code}`
        });
        break;
      }

      case 'PUBLISH': {
        // Exam Controller publishes result
        if (actor.role !== 'exam_controller' && actor.role !== 'super_admin') {
          throw new MarksLifecyclePermissionError(
            `Unauthorized action: Only the Office of the Controller of Examinations can publish results. User role "${actor.role}" is denied.`
          );
        }

        // Allowed status check: strictly from VERIFIED (skipping SUBMITTED -> PUBLISHED is illegal)
        if (prevStatus !== 'VERIFIED') {
          throw new MarksLifecycleValidationError(
            `Illegal State Transition: Cannot PUBLISH sheet with status "${prevStatus}". Publication requires prior Chairman verification (status must be VERIFIED).`
          );
        }

        nextStatus = 'PUBLISHED';
        sheet.publishedAt = new Date().toISOString();

        // 1. Notify Enrolled Students of official publication
        store.studentNotifications.unshift({
          id: `s-notif-published-${course.code}-${Date.now()}`,
          title: `Result Published: ${course.code}`,
          titleBn: `ফলাফল প্রকাশিত হয়েছে: ${course.code}`,
          message: `Controller of Examinations has officially published final grades for ${course.code} (${course.title}). SGPA and CGPA updated.`,
          messageBn: `পরীক্ষা নিয়ন্ত্রক দপ্তর কর্তৃক ${course.code} কোর্সের চূড়ান্ত ফলাফল প্রকাশিত হয়েছে। সিজিপিএ হালনাগাদ করা হয়েছে।`,
          category: 'academic',
          timestamp: new Date().toISOString(),
          read: false,
          link: '/student/results'
        });

        // 2. Notify Course Teacher of publication
        store.teacherNotifications.unshift({
          id: `t-notif-published-${course.code}-${Date.now()}`,
          title: `Course Results Published: ${course.code}`,
          titleBn: `কোর্সের ফলাফল প্রকাশিত: ${course.code}`,
          message: `Official tabulation sheet for ${course.code} is now PUBLISHED and locked for students.`,
          messageBn: `${course.code} কোর্সের চূড়ান্ত ফলাফল আনুষ্ঠানিকভাবে প্রকাশিত হয়েছে এবং শিক্ষার্থীদের জন্য উন্মুক্ত।`,
          category: 'marks',
          timestamp: new Date().toISOString(),
          read: false,
          link: `/teacher/marks`
        });
        break;
      }

      case 'RETURN_TO_CHAIRMAN': {
        if (actor.role !== 'exam_controller' && actor.role !== 'super_admin') {
          throw new MarksLifecyclePermissionError(
            `Unauthorized action: Only the Exam Controller can return marks to Chairman. User role "${actor.role}" is denied.`
          );
        }

        if (prevStatus !== 'VERIFIED') {
          throw new MarksLifecycleValidationError(
            `Illegal State Transition: Cannot return to Chairman from status "${prevStatus}". Must be in VERIFIED status.`
          );
        }

        if (!comment || comment.trim().length < 5) {
          throw new MarksLifecycleValidationError(
            'Mandatory comment required when returning marks sheet to Department Chairman.'
          );
        }

        nextStatus = 'SUBMITTED';
        sheet.returnComment = comment.trim();

        // Notify Department Chairman and Teacher
        store.teacherNotifications.unshift({
          id: `t-notif-ret-ch-${Date.now()}`,
          title: `Marks Returned by Exam Controller: ${course.code}`,
          titleBn: `পরীক্ষা নিয়ন্ত্রক কর্তৃক মার্কস ফেরত: ${course.code}`,
          message: `Exam Controller returned ${course.code} tabulation sheet for review. Reason: "${comment.trim()}"`,
          messageBn: `পরীক্ষা নিয়ন্ত্রক ${course.code} মার্কস শিট পর্যালোচনার জন্য ফেরত পাঠিয়েছেন। কারণ: "${comment.trim()}"`,
          category: 'marks',
          timestamp: new Date().toISOString(),
          read: false,
          link: '/chairman'
        });
        break;
      }

      default:
        throw new MarksLifecycleValidationError(`Unrecognized lifecycle action: "${action}".`);
    }

    // Apply state change
    sheet.status = nextStatus;
    sheet.lastSavedAt = new Date().toISOString();

    // Append-only Audit Trail Entry
    const auditEntry: MarksAuditEntry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      resultSheetId: sheet.id || `sheet-${course.code}`,
      courseCode: course.code,
      actorUid: actor.uid,
      actorName: actor.fullName || actor.email,
      actorEmail: actor.email,
      role: actor.role,
      action,
      fromStatus: prevStatus,
      toStatus: nextStatus,
      comment: comment?.trim() || undefined,
      timestamp: new Date().toISOString()
    };

    sheet.auditTrail.push(auditEntry);

    // Save persisted state
    this.storeManager.saveStore(store);

    const anomalies = this.detectSheetAnomalies(sheet, course.enrolledStudents);

    return {
      success: true,
      previousStatus: prevStatus,
      newStatus: nextStatus,
      courseCode: course.code,
      auditEntry,
      anomalies,
      message: `Successfully transitioned ${course.code} from ${prevStatus} to ${nextStatus}.`
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async getAuditHistory(courseCode: string): Promise<MarksAuditEntry[]> {
    const { sheet } = await this.getSheet(courseCode);
    // Return a shallow copy; audit trail is append-only with no modification methods
    return [...(sheet.auditTrail || [])];
  }

  /**
   * Request a correction on an immutable PUBLISHED result sheet.
   * Can be requested by assigned Teacher or Department Chairman.
   * Creates a formal pending correction record; the old version remains intact.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public async requestCorrection(
    courseCode: string,
    params: {
      studentId: string;
      field: 'attendance' | 'classTests' | 'midterm' | 'finalExam';
      newValue: number;
      reason: string;
    },
    actor: MarksLifecycleActor
  ): Promise<MarksCorrectionRequest> {
    const store = this.storeManager.getStore();
    const course = store.courses.find((c) => c.code.toLowerCase() === courseCode.toLowerCase());
    if (!course) {
      throw new Error(`Course "${courseCode}" not found.`);
    }

    const sheet = course.marksSheet;
    if (sheet.status !== 'PUBLISHED') {
      throw new MarksLifecycleValidationError(
        `Correction requests are only applicable to PUBLISHED result sheets. Current status: "${sheet.status}".`
      );
    }

    // Role check: Teacher (assigned) or Chairman (same dept)
    if (actor.role === 'teacher') {
      const isAssigned =
        store.teacherProfile.assignedCourseCodes.includes(course.code) ||
        course.instructorUid === actor.uid ||
        course.instructorEmail.toLowerCase() === actor.email.toLowerCase();
      if (!isAssigned) {
        throw new MarksLifecyclePermissionError(
          `Scope Violation: Teacher "${actor.email}" is not assigned to course "${course.code}".`
        );
      }
    } else if (actor.role === 'dept_chairman') {
      const actorDept = (actor.departmentId || '').toUpperCase();
      const courseDept = (course.department || '').toUpperCase();
      if (actorDept !== courseDept) {
        throw new MarksLifecyclePermissionError(
          `Department Scope Violation: Chairman of "${actorDept}" cannot request correction for course under "${courseDept}".`
        );
      }
    } else if (actor.role !== 'super_admin') {
      throw new MarksLifecyclePermissionError(
        `Unauthorized: Only assigned Teachers or Department Chairmen can request corrections. User role "${actor.role}" is denied.`
      );
    }

    // Reason validation
    if (!params.reason || params.reason.trim().length < 5) {
      throw new MarksLifecycleValidationError(
        'Mandatory justification required: Reason must be at least 5 characters long.'
      );
    }

    const currentEntry = sheet.entries[params.studentId];
    if (!currentEntry) {
      throw new MarksLifecycleValidationError(
        `Student "${params.studentId}" not found on marks sheet for ${course.code}.`
      );
    }

    const originalValue = currentEntry[params.field] ?? 0;

    // Validate limit for field
    if (params.field === 'attendance' && (params.newValue < MARKS_LIMITS.attendance.min || params.newValue > MARKS_LIMITS.attendance.max)) {
      throw new MarksLifecycleValidationError(`Attendance marks must be between ${MARKS_LIMITS.attendance.min} and ${MARKS_LIMITS.attendance.max}.`);
    }
    if (params.field === 'classTests' && (params.newValue < MARKS_LIMITS.classTests.min || params.newValue > MARKS_LIMITS.classTests.max)) {
      throw new MarksLifecycleValidationError(`Class tests marks must be between ${MARKS_LIMITS.classTests.min} and ${MARKS_LIMITS.classTests.max}.`);
    }
    if (params.field === 'midterm' && (params.newValue < MARKS_LIMITS.midterm.min || params.newValue > MARKS_LIMITS.midterm.max)) {
      throw new MarksLifecycleValidationError(`Midterm marks must be between ${MARKS_LIMITS.midterm.min} and ${MARKS_LIMITS.midterm.max}.`);
    }
    if (params.field === 'finalExam' && (params.newValue < MARKS_LIMITS.finalExam.min || params.newValue > MARKS_LIMITS.finalExam.max)) {
      throw new MarksLifecycleValidationError(`Final exam marks must be between ${MARKS_LIMITS.finalExam.min} and ${MARKS_LIMITS.finalExam.max}.`);
    }

    if (!sheet.corrections) {
      sheet.corrections = [];
    }

    const studentInfo = course.enrolledStudents.find((s) => s.studentId === params.studentId);

    const correction: MarksCorrectionRequest = {
      id: `corr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      versionNumber: (sheet.currentVersion || 1) + 1,
      resultSheetId: sheet.id || `sheet-${course.code}`,
      courseCode: course.code,
      studentId: params.studentId,
      studentName: studentInfo?.name || params.studentId,
      field: params.field,
      originalValue,
      newValue: params.newValue,
      reason: params.reason.trim(),
      requesterUid: actor.uid,
      requesterName: actor.fullName || actor.email,
      requesterEmail: actor.email,
      requesterRole: (actor.role as any) || 'teacher',
      requestedAt: new Date().toISOString(),
      status: 'PENDING'
    };

    sheet.corrections.push(correction);

    // Append to audit trail
    const auditEntry: MarksAuditEntry = {
      id: `audit-corr-req-${Date.now()}`,
      resultSheetId: sheet.id || `sheet-${course.code}`,
      courseCode: course.code,
      actorUid: actor.uid,
      actorName: actor.fullName || actor.email,
      actorEmail: actor.email,
      role: actor.role,
      action: 'REQUEST_CORRECTION',
      fromStatus: 'PUBLISHED',
      toStatus: 'PUBLISHED',
      comment: `Correction requested for student ${params.studentId} (${params.field}: ${originalValue} -> ${params.newValue}). Reason: ${params.reason.trim()}`,
      timestamp: new Date().toISOString()
    };
    sheet.auditTrail.push(auditEntry);

    this.storeManager.saveStore(store);

    return correction;
  }

  /**
   * Exam Controller approves a correction.
   * Immutability guarantee: creates a NEW version snapshot in `versions` array
   * and increments `currentVersion`. The prior version history stays visible.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public async approveCorrection(
    courseCode: string,
    correctionId: string,
    actor: MarksLifecycleActor,
    approvalComment?: string
  ): Promise<{ snapshot: MarksSheetVersionSnapshot; newVersion: number }> {
    if (actor.role !== 'exam_controller' && actor.role !== 'super_admin') {
      throw new MarksLifecyclePermissionError(
        `Unauthorized action: Only the Exam Controller can approve corrections. Role "${actor.role}" is denied.`
      );
    }

    const store = this.storeManager.getStore();
    const course = store.courses.find((c) => c.code.toLowerCase() === courseCode.toLowerCase());
    if (!course) {
      throw new Error(`Course "${courseCode}" not found.`);
    }

    const sheet = course.marksSheet;
    const correction = sheet.corrections?.find((c) => c.id === correctionId);
    if (!correction) {
      throw new Error(`Correction request "${correctionId}" not found.`);
    }

    if (correction.status !== 'PENDING') {
      throw new MarksLifecycleValidationError(
        `Correction request "${correctionId}" is already ${correction.status}.`
      );
    }

    if (!sheet.versions) {
      sheet.versions = [];
    }

    // 1. Snapshot the CURRENT version before updating
    const priorVersionSnapshot: MarksSheetVersionSnapshot = {
      versionNumber: sheet.currentVersion || 1,
      createdAt: sheet.lastSavedAt || new Date().toISOString(),
      createdReason: `Pre-correction snapshot before v${(sheet.currentVersion || 1) + 1}`,
      entries: JSON.parse(JSON.stringify(sheet.entries)),
      correctionRequestId: correction.id,
      approvedBy: actor.email
    };
    sheet.versions.push(priorVersionSnapshot);

    // 2. Increment version number
    const newVersionNum = (sheet.currentVersion || 1) + 1;
    sheet.currentVersion = newVersionNum;

    // 3. Apply the correction to sheet.entries
    const currentEntry = sheet.entries[correction.studentId];
    if (currentEntry) {
      (currentEntry as any)[correction.field] = correction.newValue;
      const recomputed = computeTotalMarks({
        attendance: currentEntry.attendance,
        classTests: currentEntry.classTests,
        midterm: currentEntry.midterm,
        finalExam: currentEntry.finalExam
      });
      currentEntry.total = recomputed.totalMarks;
      currentEntry.letterGrade = recomputed.letterGrade;
      currentEntry.gradePoint = recomputed.gradePoint;
    }

    // 4. Mark correction approved
    correction.status = 'APPROVED';
    correction.approverUid = actor.uid;
    correction.approverName = actor.fullName || actor.email;
    correction.approverEmail = actor.email;
    correction.approverRole = actor.role;
    correction.reviewedAt = new Date().toISOString();
    correction.reviewComment = approvalComment?.trim() || undefined;

    sheet.lastSavedAt = new Date().toISOString();

    // 5. Append to audit trail
    const auditEntry: MarksAuditEntry = {
      id: `audit-corr-app-${Date.now()}`,
      resultSheetId: sheet.id || `sheet-${course.code}`,
      courseCode: course.code,
      actorUid: actor.uid,
      actorName: actor.fullName || actor.email,
      actorEmail: actor.email,
      role: actor.role,
      action: 'APPROVE_CORRECTION',
      fromStatus: 'PUBLISHED',
      toStatus: 'PUBLISHED',
      comment: `Approved correction #${correction.id} for ${correction.studentId}. Version bumped to v${newVersionNum}. Reason: ${correction.reason}`,
      timestamp: new Date().toISOString()
    };
    sheet.auditTrail.push(auditEntry);

    // 6. Notify student of grade correction
    store.studentNotifications.unshift({
      id: `s-notif-corr-${Date.now()}`,
      title: `Grade Correction Published: ${course.code}`,
      titleBn: `গ্রেড সংশোধন অনুমোদিত: ${course.code}`,
      message: `An approved grade revision (Version ${newVersionNum}) has been applied to ${course.code}.`,
      messageBn: `${course.code} কোর্সে একটি অনুমোদিত গ্রেড সংশোধন (সংস্করণ ${newVersionNum}) কার্যকর করা হয়েছে।`,
      category: 'academic',
      timestamp: new Date().toISOString(),
      read: false,
      link: '/student/results'
    });

    this.storeManager.saveStore(store);

    return { snapshot: priorVersionSnapshot, newVersion: newVersionNum };
  }

  /**
   * Exam Controller rejects a correction.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public async rejectCorrection(
    courseCode: string,
    correctionId: string,
    actor: MarksLifecycleActor,
    rejectionReason: string
  ): Promise<MarksCorrectionRequest> {
    if (actor.role !== 'exam_controller' && actor.role !== 'super_admin') {
      throw new MarksLifecyclePermissionError(
        `Unauthorized action: Only the Exam Controller can reject corrections. Role "${actor.role}" is denied.`
      );
    }

    if (!rejectionReason || rejectionReason.trim().length < 5) {
      throw new MarksLifecycleValidationError(
        'Mandatory rejection reason required (at least 5 characters).'
      );
    }

    const store = this.storeManager.getStore();
    const course = store.courses.find((c) => c.code.toLowerCase() === courseCode.toLowerCase());
    if (!course) {
      throw new Error(`Course "${courseCode}" not found.`);
    }

    const sheet = course.marksSheet;
    const correction = sheet.corrections?.find((c) => c.id === correctionId);
    if (!correction) {
      throw new Error(`Correction request "${correctionId}" not found.`);
    }

    if (correction.status !== 'PENDING') {
      throw new MarksLifecycleValidationError(
        `Correction request "${correctionId}" is already ${correction.status}.`
      );
    }

    correction.status = 'REJECTED';
    correction.approverUid = actor.uid;
    correction.approverName = actor.fullName || actor.email;
    correction.approverEmail = actor.email;
    correction.approverRole = actor.role;
    correction.reviewedAt = new Date().toISOString();
    correction.reviewComment = rejectionReason.trim();

    const auditEntry: MarksAuditEntry = {
      id: `audit-corr-rej-${Date.now()}`,
      resultSheetId: sheet.id || `sheet-${course.code}`,
      courseCode: course.code,
      actorUid: actor.uid,
      actorName: actor.fullName || actor.email,
      actorEmail: actor.email,
      role: actor.role,
      action: 'REJECT_CORRECTION',
      fromStatus: 'PUBLISHED',
      toStatus: 'PUBLISHED',
      comment: `Correction request #${correction.id} rejected. Reason: "${rejectionReason.trim()}"`,
      timestamp: new Date().toISOString()
    };
    sheet.auditTrail.push(auditEntry);

    this.storeManager.saveStore(store);

    return correction;
  }

  /**
   * Bulk publish all VERIFIED sheets for a given department.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public async bulkPublishDepartment(
    departmentId: string,
    actor: MarksLifecycleActor
  ): Promise<{ publishedCourses: string[]; skippedCourses: string[] }> {
    if (actor.role !== 'exam_controller' && actor.role !== 'super_admin') {
      throw new MarksLifecyclePermissionError(
        `Unauthorized action: Only the Exam Controller can bulk publish results. User role "${actor.role}" is denied.`
      );
    }

    const store = this.storeManager.getStore();
    const deptUpper = departmentId.toUpperCase();
    const deptCourses = store.courses.filter(
      (c) => (c.department || '').toUpperCase() === deptUpper
    );

    const publishedCourses: string[] = [];
    const skippedCourses: string[] = [];

    for (const course of deptCourses) {
      if (course.marksSheet.status === 'VERIFIED') {
        await this.transition(course.code, 'PUBLISH', actor);
        publishedCourses.push(course.code);
      } else {
        skippedCourses.push(course.code);
      }
    }

    return { publishedCourses, skippedCourses };
  }
}

let marksLifecycleInstance: MarksLifecycleService | null = null;
export function getMarksLifecycleService(): MarksLifecycleService {
  if (!marksLifecycleInstance) {
    marksLifecycleInstance = new MarksLifecycleService();
  }
  return marksLifecycleInstance;
}
