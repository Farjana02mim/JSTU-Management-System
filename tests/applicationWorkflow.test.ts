import { describe, it, expect, beforeEach } from 'vitest';
import { ApplicationWorkflowService } from '../src/services/workflow/applicationWorkflowService';
import {
  WorkflowActor,
  WorkflowPermissionError,
  WorkflowValidationError
} from '../src/services/workflow/workflowTypes';
import { SharedDataStoreManager } from '../src/services/shared/sharedDataStore';
import { WORKFLOW_CONFIGS, ApplicationType } from '../src/config/workflows';

describe('Phase 4A: Paperless Application Workflow State Machine & Security Tests', () => {
  let workflowService: ApplicationWorkflowService;
  let storeManager: SharedDataStoreManager;

  // Mock Actors
  const studentActor: WorkflowActor = {
    uid: 'demo_student_01',
    email: 'student.demo@jstu.ac.bd',
    fullName: 'Tanvir Ahmed',
    role: 'student',
    studentId: 'JSTU2026001',
    departmentId: 'CSE'
  };

  const otherStudentActor: WorkflowActor = {
    uid: 'demo_student_02',
    email: 'sadia.2026002@jstu.ac.bd',
    fullName: 'Sadia Afrin',
    role: 'student',
    studentId: 'JSTU2026002',
    departmentId: 'CSE'
  };

  const cseChairmanActor: WorkflowActor = {
    uid: 'demo_chairman_01',
    email: 'chairman.demo@jstu.ac.bd',
    fullName: 'Prof. Dr. Chairman CSE',
    role: 'dept_chairman',
    departmentId: 'CSE'
  };

  const eeeChairmanActor: WorkflowActor = {
    uid: 'demo_chairman_eee',
    email: 'chairman.eee@jstu.ac.bd',
    fullName: 'Prof. Dr. Chairman EEE',
    role: 'dept_chairman',
    departmentId: 'EEE'
  };

  const controllerActor: WorkflowActor = {
    uid: 'demo_controller_01',
    email: 'controller.demo@jstu.ac.bd',
    fullName: 'Dr. Md. Mokhlesur Rahman',
    role: 'exam_controller',
    officeId: 'EXAM_CONTROLLER'
  };

  const registrarActor: WorkflowActor = {
    uid: 'demo_registrar_01',
    email: 'registrar.demo@jstu.ac.bd',
    fullName: 'Md. Abdul Mannan',
    role: 'registrar',
    officeId: 'REGISTRAR'
  };

  const teacherActor: WorkflowActor = {
    uid: 'demo_teacher_01',
    email: 'teacher.demo@jstu.ac.bd',
    fullName: 'Dr. Shahadat Hossain',
    role: 'teacher',
    departmentId: 'CSE'
  };

  beforeEach(() => {
    storeManager = SharedDataStoreManager.getInstance();
    storeManager.resetStore();
    workflowService = ApplicationWorkflowService.getInstance();
  });

  describe('1. Application Number & Configuration Verification', () => {
    it('generates unique application number matching JSTU-APP-YYYY-XXXXXX', () => {
      const currentYear = new Date().getFullYear();
      const appNumber = workflowService.generateApplicationNumber();
      const regex = new RegExp(`^JSTU-APP-${currentYear}-\\d{6}$`);
      expect(appNumber).toMatch(regex);
    });

    it('contains all 8 required application workflow types in WORKFLOW_CONFIGS', () => {
      const expectedTypes: ApplicationType[] = [
        'transcript',
        'certificate',
        'testimonial',
        'leave',
        'course_withdrawal',
        'scholarship',
        'clearance',
        'exam_permission'
      ];

      for (const type of expectedTypes) {
        expect(WORKFLOW_CONFIGS[type]).toBeDefined();
        expect(WORKFLOW_CONFIGS[type].chain.length).toBeGreaterThan(0);
        expect(WORKFLOW_CONFIGS[type].fields.length).toBeGreaterThan(0);
      }
    });
  });

  describe('2. Legal Transitions for Each of the 8 Chains', () => {
    it('Chain 1: Transcript Request (Student -> Chairman -> Controller -> Registrar -> APPROVED)', async () => {
      // 1. Submit
      const app = await workflowService.submitApplication(
        'transcript',
        { transcriptType: 'complete', copiesCount: 2, purpose: 'Foreign university admission' },
        studentActor
      );
      expect(app.status).toBe('UNDER_REVIEW');
      expect(app.currentStepIndex).toBe(0);
      expect(app.chain.length).toBe(3);

      // 2. Chairman Approve (Step 0)
      const res1 = await workflowService.transition(app.id, 'APPROVE', cseChairmanActor, 'Department records verified.');
      expect(res1.newStatus).toBe('UNDER_REVIEW');
      expect(res1.application.currentStepIndex).toBe(1);

      // 3. Controller Approve (Step 1)
      const res2 = await workflowService.transition(app.id, 'APPROVE', controllerActor, 'Marks tabulated and confirmed.');
      expect(res2.newStatus).toBe('UNDER_REVIEW');
      expect(res2.application.currentStepIndex).toBe(2);

      // 4. Registrar Approve (Step 2 - final)
      const res3 = await workflowService.transition(app.id, 'APPROVE', registrarActor, 'Official transcript seal affixed.');
      expect(res3.newStatus).toBe('APPROVED');
      expect(res3.application.status).toBe('APPROVED');
      expect(res3.application.completedAt).toBeDefined();

      // Check audit trail length (1 submit + 3 approves = 4 entries)
      expect(res3.application.auditTrail.length).toBe(4);
    });

    it('Chain 2: Certificate Request (Student -> Chairman -> Controller -> Registrar -> APPROVED)', async () => {
      const mockAttachment = {
        name: 'ssc_hsc_clearance.pdf',
        size: 1024 * 500,
        type: 'application/pdf',
        uploadedAt: new Date().toISOString()
      };

      const app = await workflowService.submitApplication(
        'certificate',
        { certificateCategory: 'provisional', passingYear: '2025-2026', reason: 'Graduation convocation' },
        studentActor,
        mockAttachment
      );
      expect(app.status).toBe('UNDER_REVIEW');

      // Chairman
      await workflowService.transition(app.id, 'APPROVE', cseChairmanActor, 'Degree requirement fulfilled');
      // Controller
      await workflowService.transition(app.id, 'APPROVE', controllerActor, 'Tabulation confirmed without dues');
      // Registrar
      const finalRes = await workflowService.transition(app.id, 'APPROVE', registrarActor, 'Certificate printed and registered');
      expect(finalRes.newStatus).toBe('APPROVED');
    });

    it('Chain 3: Testimonial Request (Student -> Chairman -> APPROVED)', async () => {
      const app = await workflowService.submitApplication(
        'testimonial',
        { purpose: 'job', extraActivities: 'Competitive programming contest participation' },
        studentActor
      );
      expect(app.chain.length).toBe(1);

      // Chairman is single step
      const res = await workflowService.transition(app.id, 'APPROVE', cseChairmanActor, 'Exemplary character and conduct.');
      expect(res.newStatus).toBe('APPROVED');
      expect(res.application.status).toBe('APPROVED');
    });

    it('Chain 4: Leave of Absence (Student -> Chairman -> APPROVED)', async () => {
      const app = await workflowService.submitApplication(
        'leave',
        { leaveType: 'medical', startDate: '2026-10-10', endDate: '2026-10-15', reason: 'Viral fever hospitalization' },
        studentActor
      );
      expect(app.chain.length).toBe(1);

      const res = await workflowService.transition(app.id, 'APPROVE', cseChairmanActor, 'Medical leave approved for 5 days.');
      expect(res.newStatus).toBe('APPROVED');
    });

    it('Chain 5: Course Withdrawal (Student -> Chairman -> Controller -> APPROVED)', async () => {
      const app = await workflowService.submitApplication(
        'course_withdrawal',
        { courseCode: 'CSE-3201', reason: 'Excessive credit load and course sequencing' },
        studentActor
      );
      expect(app.chain.length).toBe(2);

      await workflowService.transition(app.id, 'APPROVE', cseChairmanActor, 'Department recommendation granted.');
      const res = await workflowService.transition(app.id, 'APPROVE', controllerActor, 'Course drop registered before exam deadline.');
      expect(res.newStatus).toBe('APPROVED');
    });

    it('Chain 6: Scholarship (Student -> Chairman -> Registrar -> APPROVED)', async () => {
      const mockAttachment = {
        name: 'income_certificate.pdf',
        size: 1024 * 300,
        type: 'application/pdf',
        uploadedAt: new Date().toISOString()
      };

      const app = await workflowService.submitApplication(
        'scholarship',
        { scholarshipType: 'dean_merit', currentCgpa: '3.92', annualIncome: 120000, statement: 'Top of class academic distinction' },
        studentActor,
        mockAttachment
      );
      expect(app.chain.length).toBe(2);

      await workflowService.transition(app.id, 'APPROVE', cseChairmanActor, 'Dean list verification confirmed.');
      const res = await workflowService.transition(app.id, 'APPROVE', registrarActor, 'Stipend disbursement authorized.');
      expect(res.newStatus).toBe('APPROVED');
    });

    it('Chain 7: Clearance (Student -> Chairman -> Controller -> Registrar -> APPROVED)', async () => {
      const app = await workflowService.submitApplication(
        'clearance',
        { clearanceReason: 'graduation', declaration: 'All lab equipment and library books returned.' },
        studentActor
      );
      expect(app.chain.length).toBe(3);

      await workflowService.transition(app.id, 'APPROVE', cseChairmanActor, 'Department lab clearances complete.');
      await workflowService.transition(app.id, 'APPROVE', controllerActor, 'Exam dues cleared.');
      const res = await workflowService.transition(app.id, 'APPROVE', registrarActor, 'Final institutional clearance stamped.');
      expect(res.newStatus).toBe('APPROVED');
    });

    it('Chain 8: Exam Permission (Student -> Chairman -> Controller -> APPROVED)', async () => {
      const app = await workflowService.submitApplication(
        'exam_permission',
        { examinationTitle: '6th Semester Final', permissionReason: 'attendance_condonation', justification: 'Hospitalized for 2 weeks with dengue.' },
        studentActor
      );
      expect(app.chain.length).toBe(2);

      await workflowService.transition(app.id, 'APPROVE', cseChairmanActor, 'Medical ground verified by university medical board.');
      const res = await workflowService.transition(app.id, 'APPROVE', controllerActor, 'Admit card issued with condonation fee.');
      expect(res.newStatus).toBe('APPROVED');
    });
  });

  describe('3. Illegal Transitions & Security Invariants', () => {
    it('MUST FAIL: Step skipping (Controller attempts to approve Step 0 before Chairman)', async () => {
      const app = await workflowService.submitApplication(
        'transcript',
        { transcriptType: 'complete', copiesCount: 1, purpose: 'Test' },
        studentActor
      );
      expect(app.currentStepIndex).toBe(0);

      await expect(
        workflowService.transition(app.id, 'APPROVE', controllerActor, 'Attempting early approval')
      ).rejects.toThrow(WorkflowPermissionError);
    });

    it('MUST FAIL: Step skipping (Registrar attempts to approve Step 0 or Step 1 prematurely)', async () => {
      const app = await workflowService.submitApplication(
        'transcript',
        { transcriptType: 'complete', copiesCount: 1, purpose: 'Test' },
        studentActor
      );

      await expect(
        workflowService.transition(app.id, 'APPROVE', registrarActor, 'Premature registrar sign-off')
      ).rejects.toThrow(WorkflowPermissionError);
    });

    it('MUST FAIL: Wrong approver (Teacher attempts to approve an application)', async () => {
      const app = await workflowService.submitApplication(
        'testimonial',
        { purpose: 'job' },
        studentActor
      );

      await expect(
        workflowService.transition(app.id, 'APPROVE', teacherActor, 'Faculty endorsement')
      ).rejects.toThrow(WorkflowPermissionError);
    });

    it('MUST FAIL: Student attempts to approve own application', async () => {
      const app = await workflowService.submitApplication(
        'leave',
        { leaveType: 'family', startDate: '2026-10-10', endDate: '2026-10-12', reason: 'Family emergency' },
        studentActor
      );

      await expect(
        workflowService.transition(app.id, 'APPROVE', studentActor, 'Self-approving my leave')
      ).rejects.toThrow(WorkflowPermissionError);
    });

    it('MUST FAIL: Student attempts to reject or return own application', async () => {
      const app = await workflowService.submitApplication(
        'leave',
        { leaveType: 'family', startDate: '2026-10-10', endDate: '2026-10-12', reason: 'Family emergency' },
        studentActor
      );

      await expect(
        workflowService.transition(app.id, 'REJECT', studentActor, 'Self-rejecting application')
      ).rejects.toThrow(WorkflowPermissionError);

      await expect(
        workflowService.transition(app.id, 'RETURN_FOR_CORRECTION', studentActor, 'Self-returning application')
      ).rejects.toThrow(WorkflowPermissionError);
    });

    it('MUST FAIL: Wrong Department Chairman (EEE Chairman attempts to act on CSE student application)', async () => {
      const app = await workflowService.submitApplication(
        'transcript',
        { transcriptType: 'complete', copiesCount: 1, purpose: 'Visa verification' },
        studentActor // CSE student
      );

      await expect(
        workflowService.transition(app.id, 'APPROVE', eeeChairmanActor, 'EEE Chairman approving CSE student')
      ).rejects.toThrow(WorkflowPermissionError);
    });

    it('MUST FAIL: Reject without mandatory reason (empty or shorter than 5 characters)', async () => {
      const app = await workflowService.submitApplication(
        'testimonial',
        { purpose: 'internship' },
        studentActor
      );

      // Missing reason
      await expect(
        workflowService.transition(app.id, 'REJECT', cseChairmanActor, '')
      ).rejects.toThrow(WorkflowValidationError);

      // Too short reason (< 5 chars)
      await expect(
        workflowService.transition(app.id, 'REJECT', cseChairmanActor, 'No')
      ).rejects.toThrow(WorkflowValidationError);
    });

    it('MUST FAIL: Return for correction without mandatory note', async () => {
      const app = await workflowService.submitApplication(
        'testimonial',
        { purpose: 'internship' },
        studentActor
      );

      await expect(
        workflowService.transition(app.id, 'RETURN_FOR_CORRECTION', cseChairmanActor, '   ')
      ).rejects.toThrow(WorkflowValidationError);

      await expect(
        workflowService.transition(app.id, 'RETURN_FOR_CORRECTION', cseChairmanActor, 'Bad')
      ).rejects.toThrow(WorkflowValidationError);
    });

    it('MUST FAIL: Acting after terminal state APPROVED', async () => {
      const app = await workflowService.submitApplication(
        'testimonial',
        { purpose: 'job' },
        studentActor
      );

      // Transition to APPROVED
      await workflowService.transition(app.id, 'APPROVE', cseChairmanActor, 'Approved testimonial.');
      const approvedApp = await workflowService.getApplication(app.id);
      expect(approvedApp.status).toBe('APPROVED');

      // Attempt further approval
      await expect(
        workflowService.transition(app.id, 'APPROVE', cseChairmanActor, 'Attempting to approve again')
      ).rejects.toThrow(WorkflowPermissionError);

      // Attempt rejection after approved
      await expect(
        workflowService.transition(app.id, 'REJECT', cseChairmanActor, 'Attempting to reject approved application')
      ).rejects.toThrow(WorkflowPermissionError);
    });

    it('MUST FAIL: Acting after terminal state REJECTED', async () => {
      const app = await workflowService.submitApplication(
        'testimonial',
        { purpose: 'job' },
        studentActor
      );

      // Transition to REJECTED
      await workflowService.transition(app.id, 'REJECT', cseChairmanActor, 'Disciplinary action pending; testimonial denied.');
      const rejectedApp = await workflowService.getApplication(app.id);
      expect(rejectedApp.status).toBe('REJECTED');

      // Attempt approval after rejected
      await expect(
        workflowService.transition(app.id, 'APPROVE', cseChairmanActor, 'Attempting to approve rejected')
      ).rejects.toThrow(WorkflowPermissionError);

      // Attempt return after rejected
      await expect(
        workflowService.transition(app.id, 'RETURN_FOR_CORRECTION', cseChairmanActor, 'Attempting return on rejected')
      ).rejects.toThrow(WorkflowPermissionError);
    });
  });

  describe('4. Return for Correction & Resubmission Lifecycle', () => {
    it('allows Chairman to return application, and student to resubmit with corrections', async () => {
      const app = await workflowService.submitApplication(
        'transcript',
        { transcriptType: 'complete', copiesCount: 1, purpose: 'Needs better details' },
        studentActor
      );

      // Chairman returns for correction
      const returnRes = await workflowService.transition(
        app.id,
        'RETURN_FOR_CORRECTION',
        cseChairmanActor,
        'Please clarify intended university address and provide proof of payment.'
      );
      expect(returnRes.newStatus).toBe('RETURNED_FOR_CORRECTION');
      expect(returnRes.application.returnComment).toContain('Please clarify');

      // Other student cannot resubmit someone else's application
      await expect(
        workflowService.transition(app.id, 'RESUBMIT', otherStudentActor)
      ).rejects.toThrow(WorkflowPermissionError);

      // Applicant student resubmits
      const resubmitRes = await workflowService.transition(app.id, 'RESUBMIT', studentActor);
      expect(resubmitRes.newStatus).toBe('UNDER_REVIEW');
      expect(resubmitRes.application.status).toBe('UNDER_REVIEW');
      expect(resubmitRes.application.returnComment).toBeUndefined();

      // Chain resumes at Chairman (Step 0)
      const approveRes = await workflowService.transition(
        app.id,
        'APPROVE',
        cseChairmanActor,
        'Revised documentation accepted.'
      );
      expect(approveRes.application.currentStepIndex).toBe(1);
    });

    it('MUST FAIL: Resubmit an application that is not in RETURNED_FOR_CORRECTION', async () => {
      const app = await workflowService.submitApplication(
        'testimonial',
        { purpose: 'job' },
        studentActor
      );
      // Status is UNDER_REVIEW
      await expect(
        workflowService.transition(app.id, 'RESUBMIT', studentActor)
      ).rejects.toThrow(WorkflowValidationError);
    });
  });

  describe('5. Approver Inbox Queries & Dashboard Counters', () => {
    it('returns accurate pending counters and inbox items for each approver', async () => {
      // Clean slate check
      const initialCounts = await workflowService.getApproverCounts(cseChairmanActor);
      expect(initialCounts.pendingCount).toBe(1); // 1 pending transcript in seed data

      // Submit new application
      await workflowService.submitApplication(
        'leave',
        { leaveType: 'medical', startDate: '2026-11-01', endDate: '2026-11-04', reason: 'Medical treatment' },
        studentActor
      );

      const updatedCounts = await workflowService.getApproverCounts(cseChairmanActor);
      expect(updatedCounts.pendingCount).toBe(initialCounts.pendingCount + 1);

      // Query inbox
      const inbox = await workflowService.getApproverInbox(cseChairmanActor, 'PENDING');
      expect(inbox.length).toBe(updatedCounts.pendingCount);
    });
  });
});
