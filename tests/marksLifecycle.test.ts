import { describe, it, expect, beforeEach } from 'vitest';
import { MarksLifecycleService } from '../src/services/marks/marksLifecycleService';
import {
  MarksLifecyclePermissionError,
  MarksLifecycleValidationError,
  MarksLifecycleActor
} from '../src/services/marks/lifecycleTypes';
import { SharedDataStoreManager } from '../src/services/shared/sharedDataStore';
import {
  marksToGrade,
  calculateSGPA,
  calculateCGPA,
  calculateCumulativeFromCourses
} from '../src/config/grading';

describe('Phase 3C-1: Marks Lifecycle State Machine & Audit Trail', () => {
  let lifecycleService: MarksLifecycleService;
  let storeManager: SharedDataStoreManager;

  // Mock Actors
  const teacherActor: MarksLifecycleActor = {
    uid: 'demo_teacher_01',
    email: 'teacher.demo@jstu.ac.bd',
    fullName: 'Dr. Shahadat Hossain',
    role: 'teacher',
    departmentId: 'CSE'
  };

  const unassignedTeacherActor: MarksLifecycleActor = {
    uid: 'demo_faculty_unassigned',
    email: 'unassigned.teacher@jstu.ac.bd',
    fullName: 'Dr. Unassigned Teacher',
    role: 'teacher',
    departmentId: 'CSE'
  };

  const cseChairmanActor: MarksLifecycleActor = {
    uid: 'demo_chairman_01',
    email: 'chairman.demo@jstu.ac.bd',
    fullName: 'Prof. Dr. Chairman CSE',
    role: 'dept_chairman',
    departmentId: 'CSE'
  };

  const eeeChairmanActor: MarksLifecycleActor = {
    uid: 'demo_chairman_eee',
    email: 'chairman.eee@jstu.ac.bd',
    fullName: 'Prof. Dr. Chairman EEE',
    role: 'dept_chairman',
    departmentId: 'EEE'
  };

  const controllerActor: MarksLifecycleActor = {
    uid: 'demo_controller_01',
    email: 'controller.demo@jstu.ac.bd',
    fullName: 'Dr. Md. Mokhlesur Rahman',
    role: 'exam_controller',
    officeId: 'EXAM_CONTROLLER'
  };

  beforeEach(() => {
    storeManager = SharedDataStoreManager.getInstance();
    storeManager.resetStore();
    lifecycleService = MarksLifecycleService.getInstance();
  });

  describe('1. Legal State Machine Transitions', () => {
    it('allows assigned teacher to SUBMIT marks sheet from DRAFT', async () => {
      // CSE-3205 is initialized as DRAFT in seed data
      const { sheet: beforeSheet } = await lifecycleService.getSheet('CSE-3205');
      expect(beforeSheet.status).toBe('DRAFT');

      const result = await lifecycleService.transition('CSE-3205', 'SUBMIT', teacherActor);
      expect(result.success).toBe(true);
      expect(result.previousStatus).toBe('DRAFT');
      expect(result.newStatus).toBe('SUBMITTED');

      const { sheet: afterSheet } = await lifecycleService.getSheet('CSE-3205');
      expect(afterSheet.status).toBe('SUBMITTED');
    });

    it('allows department Chairman to VERIFY marks sheet from SUBMITTED', async () => {
      // CSE-3201 is seeded in SUBMITTED status
      const { sheet: beforeSheet } = await lifecycleService.getSheet('CSE-3201');
      expect(beforeSheet.status).toBe('SUBMITTED');

      const result = await lifecycleService.transition('CSE-3201', 'VERIFY', cseChairmanActor);
      expect(result.success).toBe(true);
      expect(result.previousStatus).toBe('SUBMITTED');
      expect(result.newStatus).toBe('VERIFIED');

      const { sheet: afterSheet } = await lifecycleService.getSheet('CSE-3201');
      expect(afterSheet.status).toBe('VERIFIED');
    });

    it('allows department Chairman to RETURN_TO_TEACHER with mandatory comment', async () => {
      // CSE-3201 is in SUBMITTED status
      const comment = 'Total marks in student 04 does not match. Please recheck class test evaluation.';
      const result = await lifecycleService.transition(
        'CSE-3201',
        'RETURN_TO_TEACHER',
        cseChairmanActor,
        comment
      );

      expect(result.success).toBe(true);
      expect(result.newStatus).toBe('RETURNED_TO_TEACHER');

      const { sheet } = await lifecycleService.getSheet('CSE-3201');
      expect(sheet.status).toBe('RETURNED_TO_TEACHER');
      expect(sheet.returnComment).toBe(comment);
    });

    it('allows teacher to re-submit marks after RETURNED_TO_TEACHER', async () => {
      // First return to teacher
      await lifecycleService.transition(
        'CSE-3201',
        'RETURN_TO_TEACHER',
        cseChairmanActor,
        'Revision required for final component.'
      );

      // Now teacher re-submits
      const resubmit = await lifecycleService.transition('CSE-3201', 'SUBMIT', teacherActor);
      expect(resubmit.success).toBe(true);
      expect(resubmit.previousStatus).toBe('RETURNED_TO_TEACHER');
      expect(resubmit.newStatus).toBe('SUBMITTED');
    });

    it('allows Exam Controller to PUBLISH results from VERIFIED', async () => {
      // CSE-1101 is seeded in VERIFIED status
      const { sheet: beforeSheet } = await lifecycleService.getSheet('CSE-1101');
      expect(beforeSheet.status).toBe('VERIFIED');

      const result = await lifecycleService.transition('CSE-1101', 'PUBLISH', controllerActor);
      expect(result.success).toBe(true);
      expect(result.previousStatus).toBe('VERIFIED');
      expect(result.newStatus).toBe('PUBLISHED');

      const { sheet: afterSheet } = await lifecycleService.getSheet('CSE-1101');
      expect(afterSheet.status).toBe('PUBLISHED');
    });
  });

  describe('2. Illegal Transitions & Security Checks', () => {
    it('ILLEGAL: Teacher cannot PUBLISH results', async () => {
      await expect(
        lifecycleService.transition('CSE-1101', 'PUBLISH', teacherActor)
      ).rejects.toThrow(MarksLifecyclePermissionError);
    });

    it('ILLEGAL: Chairman cannot PUBLISH results', async () => {
      await expect(
        lifecycleService.transition('CSE-1101', 'PUBLISH', cseChairmanActor)
      ).rejects.toThrow(MarksLifecyclePermissionError);
    });

    it('ILLEGAL: Chairman cannot act on another department (Scope Check)', async () => {
      // EEE-2101 is under department 'EEE'. CSE Chairman tries to verify.
      await expect(
        lifecycleService.transition('EEE-2101', 'VERIFY', cseChairmanActor)
      ).rejects.toThrow(MarksLifecyclePermissionError);

      // CSE Chairman tries to return EEE course
      await expect(
        lifecycleService.transition(
          'EEE-2101',
          'RETURN_TO_TEACHER',
          cseChairmanActor,
          'Attempting cross-department return'
        )
      ).rejects.toThrow(MarksLifecyclePermissionError);
    });

    it('ILLEGAL: Skipping from SUBMITTED directly to PUBLISHED without Chairman verification', async () => {
      // CSE-3201 is in SUBMITTED status. Controller tries to publish directly.
      await expect(
        lifecycleService.transition('CSE-3201', 'PUBLISH', controllerActor)
      ).rejects.toThrow(MarksLifecycleValidationError);
    });

    it('ILLEGAL: Skipping from DRAFT directly to VERIFIED', async () => {
      // CSE-3205 is in DRAFT status
      await expect(
        lifecycleService.transition('CSE-3205', 'VERIFY', cseChairmanActor)
      ).rejects.toThrow(MarksLifecycleValidationError);
    });

    it('ILLEGAL: Skipping from DRAFT directly to PUBLISHED', async () => {
      // CSE-3205 is in DRAFT status
      await expect(
        lifecycleService.transition('CSE-3205', 'PUBLISH', controllerActor)
      ).rejects.toThrow(MarksLifecycleValidationError);
    });

    it('ILLEGAL: Chairman RETURN_TO_TEACHER without mandatory comment', async () => {
      // Without comment
      await expect(
        lifecycleService.transition('CSE-3201', 'RETURN_TO_TEACHER', cseChairmanActor, '')
      ).rejects.toThrow(MarksLifecycleValidationError);

      // With comment shorter than 5 chars
      await expect(
        lifecycleService.transition('CSE-3201', 'RETURN_TO_TEACHER', cseChairmanActor, 'bad')
      ).rejects.toThrow(MarksLifecycleValidationError);

      // With only whitespace
      await expect(
        lifecycleService.transition('CSE-3201', 'RETURN_TO_TEACHER', cseChairmanActor, '     ')
      ).rejects.toThrow(MarksLifecycleValidationError);
    });

    it('ILLEGAL: Direct edit / state transition after PUBLISHED (Immutability check)', async () => {
      // First publish CSE-1101
      await lifecycleService.transition('CSE-1101', 'PUBLISH', controllerActor);

      // Now attempt any further transition
      await expect(
        lifecycleService.transition('CSE-1101', 'SUBMIT', teacherActor)
      ).rejects.toThrow(MarksLifecyclePermissionError);

      await expect(
        lifecycleService.transition('CSE-1101', 'VERIFY', cseChairmanActor)
      ).rejects.toThrow(MarksLifecyclePermissionError);

      await expect(
        lifecycleService.transition('CSE-1101', 'RETURN_TO_TEACHER', cseChairmanActor, 'Revision note')
      ).rejects.toThrow(MarksLifecyclePermissionError);
    });

    it('ILLEGAL: Teacher cannot submit course not assigned to them', async () => {
      // CSE-3205 is assigned to Dr. Shahadat, not to unassignedTeacherActor
      await expect(
        lifecycleService.transition('CSE-3205', 'SUBMIT', unassignedTeacherActor)
      ).rejects.toThrow(MarksLifecyclePermissionError);
    });
  });

  describe('3. Append-Only Audit Trail Behavior', () => {
    it('appends an audit log for each lifecycle transition with full metadata', async () => {
      const historyBefore = await lifecycleService.getAuditHistory('CSE-3201');
      const countBefore = historyBefore.length;

      // 1. Verify sheet
      const verifyResult = await lifecycleService.transition(
        'CSE-3201',
        'VERIFY',
        cseChairmanActor,
        'Scrutinized and verified by CSE Chairman.'
      );

      const historyAfter1 = await lifecycleService.getAuditHistory('CSE-3201');
      expect(historyAfter1.length).toBe(countBefore + 1);

      const lastEntry = historyAfter1[historyAfter1.length - 1];
      expect(lastEntry.actorUid).toBe(cseChairmanActor.uid);
      expect(lastEntry.role).toBe('dept_chairman');
      expect(lastEntry.action).toBe('VERIFY');
      expect(lastEntry.fromStatus).toBe('SUBMITTED');
      expect(lastEntry.toStatus).toBe('VERIFIED');
      expect(lastEntry.comment).toBe('Scrutinized and verified by CSE Chairman.');
      expect(lastEntry.timestamp).toBeDefined();

      // 2. Publish sheet
      await lifecycleService.transition('CSE-3201', 'PUBLISH', controllerActor);
      const historyAfter2 = await lifecycleService.getAuditHistory('CSE-3201');
      expect(historyAfter2.length).toBe(countBefore + 2);
      expect(historyAfter2[historyAfter2.length - 1].action).toBe('PUBLISH');
      expect(historyAfter2[historyAfter2.length - 1].toStatus).toBe('PUBLISHED');
    });

    it('ensures audit history cannot be mutated through returned references', async () => {
      const history = await lifecycleService.getAuditHistory('CSE-3201');
      const originalLength = history.length;

      // Attempt to mutate the returned array
      history.pop();
      expect(history.length).toBe(originalLength - 1);

      // Verify that internal store retains all entries
      const freshHistory = await lifecycleService.getAuditHistory('CSE-3201');
      expect(freshHistory.length).toBe(originalLength);
    });
  });

  describe('4. GPA/CGPA Edge Cases & Pure Calculations', () => {
    it('handles zero credits gracefully without divide-by-zero or NaN', () => {
      const courses = [
        { credits: 0, marks: 85, gradePoint: 4.00 },
        { credits: 0, marks: 90, gradePoint: 4.00 }
      ];
      expect(calculateSGPA(courses)).toBe(0.00);
      expect(calculateCGPA([{ credits: 0, sgpa: 4.00 }])).toBe(0.00);
    });

    it('handles empty course list by returning 0.00', () => {
      expect(calculateSGPA([])).toBe(0.00);
      expect(calculateCGPA([])).toBe(0.00);
      expect(calculateCumulativeFromCourses([])).toEqual({
        cgpa: 0.00,
        totalEarnedCredits: 0,
        totalAttemptedCredits: 0
      });
    });

    it('handles F grade: 0.00 gradePoint is counted in credits attempted and lowers SGPA', () => {
      // Course 1: 3 credits A+ (4.00)
      // Course 2: 3 credits F (0.00)
      // Weighted = (3*4 + 3*0) / 6 = 12 / 6 = 2.00
      const courses = [
        { credits: 3.0, marks: 85, gradePoint: 4.00 },
        { credits: 3.0, marks: 32, gradePoint: 0.00 }
      ];
      expect(calculateSGPA(courses)).toBe(2.00);
    });

    it('handles Retake / Course Replacement: highest grade replaces earlier attempt', () => {
      const allAttempts = [
        { code: 'CSE-1101', credits: 3.0, gradePoint: 2.00 }, // First attempt: D (2.00)
        { code: 'CSE-1101', credits: 3.0, gradePoint: 3.75, isRetake: true }, // Retake: A (3.75)
        { code: 'CSE-1102', credits: 1.5, gradePoint: 4.00 }
      ];

      const result = calculateCumulativeFromCourses(allAttempts);
      // Effective: CSE-1101 has 3.75 (weight = 11.25), CSE-1102 has 4.00 (weight = 6.0)
      // Total attempted = 4.5 credits, Weighted = 17.25
      // CGPA = 17.25 / 4.5 = 3.83
      expect(result.cgpa).toBe(3.83);
      expect(result.totalEarnedCredits).toBe(4.5);
    });

    it('correctly maps boundary scores to UGC scale', () => {
      expect(marksToGrade(80)).toEqual({ letterGrade: 'A+', gradePoint: 4.00 });
      expect(marksToGrade(79.9)).toEqual({ letterGrade: 'A', gradePoint: 3.75 });
      expect(marksToGrade(40.0)).toEqual({ letterGrade: 'D', gradePoint: 2.00 });
      expect(marksToGrade(39.9)).toEqual({ letterGrade: 'F', gradePoint: 0.00 });
      expect(marksToGrade(0)).toEqual({ letterGrade: 'F', gradePoint: 0.00 });
    });
  });

  describe('5. Phase 3C-2: Controller Transitions, Immutability & Correction Versioning', () => {
    it('LEGAL: Controller publishes verified sheet and notifies student and teacher', async () => {
      // CSE-1101 is seeded as VERIFIED
      const result = await lifecycleService.transition('CSE-1101', 'PUBLISH', controllerActor);
      expect(result.success).toBe(true);
      expect(result.previousStatus).toBe('VERIFIED');
      expect(result.newStatus).toBe('PUBLISHED');

      const { sheet } = await lifecycleService.getSheet('CSE-1101');
      expect(sheet.status).toBe('PUBLISHED');
      expect(sheet.publishedAt).toBeDefined();

      const store = storeManager.getStore();
      const studentNotif = store.studentNotifications.find((n) => n.title.includes('CSE-1101'));
      expect(studentNotif).toBeDefined();
    });

    it('LEGAL: Controller returns verified sheet to chairman with comment', async () => {
      const result = await lifecycleService.transition(
        'CSE-1101',
        'RETURN_TO_CHAIRMAN',
        controllerActor,
        'Marks tabulation discrepancy detected in question breakdown'
      );
      expect(result.success).toBe(true);
      expect(result.newStatus).toBe('SUBMITTED');

      const { sheet } = await lifecycleService.getSheet('CSE-1101');
      expect(sheet.status).toBe('SUBMITTED');
      expect(sheet.returnComment).toContain('discrepancy');
    });

    it('ILLEGAL: Controller returns to chairman without mandatory comment', async () => {
      await expect(
        lifecycleService.transition('CSE-1101', 'RETURN_TO_CHAIRMAN', controllerActor, '')
      ).rejects.toThrow(MarksLifecycleValidationError);

      await expect(
        lifecycleService.transition('CSE-1101', 'RETURN_TO_CHAIRMAN', controllerActor, 'bad')
      ).rejects.toThrow(MarksLifecycleValidationError);
    });

    it('ILLEGAL: Skipping from SUBMITTED directly to PUBLISHED is strictly rejected', async () => {
      // CSE-3201 is in SUBMITTED
      await expect(
        lifecycleService.transition('CSE-3201', 'PUBLISH', controllerActor)
      ).rejects.toThrow(MarksLifecycleValidationError);
    });

    it('ILLEGAL: Editing or direct state transition after PUBLISHED is rejected', async () => {
      // Publish CSE-1101
      await lifecycleService.transition('CSE-1101', 'PUBLISH', controllerActor);

      // Any attempt to transition directly is rejected
      await expect(
        lifecycleService.transition('CSE-1101', 'SUBMIT', teacherActor)
      ).rejects.toThrow(MarksLifecyclePermissionError);

      await expect(
        lifecycleService.transition('CSE-1101', 'VERIFY', cseChairmanActor)
      ).rejects.toThrow(MarksLifecyclePermissionError);

      await expect(
        lifecycleService.transition('CSE-1101', 'PUBLISH', controllerActor)
      ).rejects.toThrow(MarksLifecyclePermissionError);
    });

    it('LEGAL: Correction flow creates new version with snapshots and retains prior history', async () => {
      // 1. Publish CSE-1101 first
      await lifecycleService.transition('CSE-1101', 'PUBLISH', controllerActor);

      const { sheet: initialSheet } = await lifecycleService.getSheet('CSE-1101');
      const student1 = 'JSTU2026001';
      const origFinal = initialSheet.entries[student1].finalExam ?? 40;

      // 2. Teacher requests correction
      const correction = await lifecycleService.requestCorrection(
        'CSE-1101',
        {
          studentId: student1,
          field: 'finalExam',
          newValue: 48,
          reason: 'Re-scrutiny found question 3(b) marks were omitted in script totaling.'
        },
        teacherActor
      );

      expect(correction.id).toBeDefined();
      expect(correction.status).toBe('PENDING');
      expect(correction.originalValue).toBe(origFinal);
      expect(correction.newValue).toBe(48);

      // Verify that published marks did NOT change yet before approval
      const { sheet: pendingSheet } = await lifecycleService.getSheet('CSE-1101');
      expect(pendingSheet.entries[student1].finalExam).toBe(origFinal);

      // 3. Controller approves correction
      const { snapshot, newVersion } = await lifecycleService.approveCorrection(
        'CSE-1101',
        correction.id,
        controllerActor,
        'Approved after physical script verification.'
      );

      expect(newVersion).toBe(2);
      expect(snapshot.versionNumber).toBe(1);
      expect(snapshot.entries[student1].finalExam).toBe(origFinal);

      // 4. Verify updated sheet has new version and updated mark
      const { sheet: updatedSheet } = await lifecycleService.getSheet('CSE-1101');
      expect(updatedSheet.currentVersion).toBe(2);
      expect(updatedSheet.entries[student1].finalExam).toBe(48);
      expect(updatedSheet.versions?.length).toBe(1);
      expect(updatedSheet.versions?.[0].versionNumber).toBe(1);

      // 5. Verify audit trail appended approval
      const audit = await lifecycleService.getAuditHistory('CSE-1101');
      const approveLog = audit.find((a) => a.action === 'APPROVE_CORRECTION');
      expect(approveLog).toBeDefined();
      expect(approveLog?.actorUid).toBe(controllerActor.uid);
    });

    it('ILLEGAL: Non-controller cannot approve or reject corrections', async () => {
      await lifecycleService.transition('CSE-1101', 'PUBLISH', controllerActor);

      const correction = await lifecycleService.requestCorrection(
        'CSE-1101',
        {
          studentId: 'JSTU2026001',
          field: 'finalExam',
          newValue: 45,
          reason: 'Correction justification text'
        },
        teacherActor
      );

      await expect(
        lifecycleService.approveCorrection('CSE-1101', correction.id, teacherActor)
      ).rejects.toThrow(MarksLifecyclePermissionError);

      await expect(
        lifecycleService.approveCorrection('CSE-1101', correction.id, cseChairmanActor)
      ).rejects.toThrow(MarksLifecyclePermissionError);

      await expect(
        lifecycleService.rejectCorrection('CSE-1101', correction.id, teacherActor, 'Reason')
      ).rejects.toThrow(MarksLifecyclePermissionError);
    });

    it('LEGAL: Bulk publish transitions all verified courses under department', async () => {
      // Seed EEE course as VERIFIED for testing bulk publish
      const store = storeManager.getStore();
      const eeeCourse = store.courses.find((c) => c.code === 'EEE-2101')!;
      eeeCourse.marksSheet.status = 'VERIFIED';
      storeManager.saveStore(store);

      const res = await lifecycleService.bulkPublishDepartment('EEE', controllerActor);
      expect(res.publishedCourses).toContain('EEE-2101');

      const { sheet } = await lifecycleService.getSheet('EEE-2101');
      expect(sheet.status).toBe('PUBLISHED');
    });
  });
});
