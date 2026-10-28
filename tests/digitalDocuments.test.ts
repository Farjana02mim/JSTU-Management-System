import { describe, it, expect, beforeEach } from 'vitest';
import { DigitalDocumentService } from '../src/services/documents/digitalDocumentService';
import { ApplicationWorkflowService } from '../src/services/workflow/applicationWorkflowService';
import { SharedDataStoreManager } from '../src/services/shared/sharedDataStore';
import { WorkflowActor, WorkflowPermissionError, WorkflowValidationError } from '../src/services/workflow/workflowTypes';

describe('Phase 4B: Digital Documents + QR Verification Unit Tests', () => {
  let docService: DigitalDocumentService;
  let workflowService: ApplicationWorkflowService;
  let storeManager: SharedDataStoreManager;

  const studentActor: WorkflowActor = {
    uid: 'demo_student_01',
    email: 'student.demo@jstu.ac.bd',
    fullName: 'Tanvir Ahmed',
    role: 'student',
    studentId: 'JSTU2026001',
    departmentId: 'CSE'
  };

  const chairmanActor: WorkflowActor = {
    uid: 'demo_chairman_01',
    email: 'chairman.demo@jstu.ac.bd',
    fullName: 'Prof. Dr. Chairman CSE',
    role: 'dept_chairman',
    departmentId: 'CSE'
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
    docService = DigitalDocumentService.getInstance();
    docService.resetRateLimits();
  });

  describe('1. Issuance Preconditions & Idempotency', () => {
    it('MUST FAIL: Reject issuing document on an application that is not APPROVED', async () => {
      // Create a new application (starts in UNDER_REVIEW)
      const app = await workflowService.submitApplication(
        'testimonial',
        { purpose: 'job' },
        studentActor
      );
      expect(app.status).toBe('UNDER_REVIEW');

      // Attempting to issue document on UNDER_REVIEW application must fail
      await expect(
        docService.issueDocument(app.id, registrarActor)
      ).rejects.toThrow(WorkflowValidationError);
    });

    it('SUCCESS: Issue document only when application reaches APPROVED', async () => {
      const app = await workflowService.submitApplication(
        'testimonial',
        { purpose: 'job' },
        studentActor
      );

      // Chairman approves single-step chain -> becomes APPROVED
      const res = await workflowService.transition(app.id, 'APPROVE', chairmanActor, 'Conduct is exemplary.');
      expect(res.newStatus).toBe('APPROVED');

      // Now issuing must succeed
      const doc = await docService.issueDocument(app.id, registrarActor);
      expect(doc).toBeDefined();
      expect(doc.applicationId).toBe(app.id);
      expect(doc.status).toBe('VALID');
      expect(doc.documentType).toBe('testimonial');
      expect(doc.verificationId).toHaveLength(32);
      expect(doc.canonicalHash).toHaveLength(64);
    });

    it('IDEMPOTENCY: Repeated issuance requests return existing document without duplicates', async () => {
      const app = await workflowService.submitApplication(
        'leave',
        { leaveType: 'medical', startDate: '2026-10-12', endDate: '2026-10-15', reason: 'Medical recovery' },
        studentActor
      );

      await workflowService.transition(app.id, 'APPROVE', chairmanActor, 'Approved by chairman');

      const storeBefore = storeManager.getStore();
      const countBefore = storeBefore.digitalDocuments.length;

      // First issuance
      const doc1 = await docService.issueDocument(app.id, registrarActor);
      const storeAfterFirst = storeManager.getStore();
      expect(storeAfterFirst.digitalDocuments.length).toBe(countBefore + 1);

      // Second issuance of the same application
      const doc2 = await docService.issueDocument(app.id, registrarActor);
      const storeAfterSecond = storeManager.getStore();

      expect(doc1.id).toBe(doc2.id);
      expect(doc1.verificationId).toBe(doc2.verificationId);
      expect(doc1.canonicalHash).toBe(doc2.canonicalHash);
      // No duplicate was added to the collection
      expect(storeAfterSecond.digitalDocuments.length).toBe(storeAfterFirst.digitalDocuments.length);
    });
  });

  describe('2. Verification ID Uniqueness and Cryptographic Format', () => {
    it('generates 128-bit unguessable random verification IDs matching 32 lowercase hex characters', () => {
      const token = docService.generateVerificationId();
      expect(token).toMatch(/^[0-9a-f]{32}$/);
    });

    it('produces 100% unique tokens across successive generations (zero collisions)', () => {
      const tokenSet = new Set<string>();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const token = docService.generateVerificationId();
        expect(tokenSet.has(token)).toBe(false);
        tokenSet.add(token);
      }

      expect(tokenSet.size).toBe(iterations);
    });
  });

  describe('3. Cryptographic Hash Stability & Tamper Detection', () => {
    it('computes stable and deterministic SHA-256 hashes for identical canonical content', async () => {
      const payload = {
        verificationId: '7f9c2d1b8e4a3f65021c9b8a7d6e5f41',
        studentId: 'JSTU2026001',
        department: 'CSE',
        status: 'VALID',
        data: { grade: 'A', marks: 85 }
      };

      const serialized1 = docService.serializeCanonical(payload);
      const hash1 = await docService.computeSha256(serialized1);

      const serialized2 = docService.serializeCanonical(payload);
      const hash2 = await docService.computeSha256(serialized2);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
      expect(hash1).toMatch(/^[0-9a-f]{64}$/);
    });

    it('TAMPER DETECTION: reports HASH MATCH for authentic content and MISMATCH for altered content', async () => {
      // Seed document doc-testimonial-01
      const doc = await docService.getDocument('doc-testimonial-01');
      expect(doc).toBeDefined();
      if (!doc) return;

      // 1. Authentic candidate payload -> Match
      const matchCheck = await docService.verifyTamper(doc.verificationId, doc.canonicalPayload);
      expect(matchCheck.isMatch).toBe(true);
      expect(matchCheck.computedHash).toBe(doc.canonicalHash);

      // 2. Tampered candidate payload (e.g. student name altered) -> Mismatch
      const tamperedPayload = JSON.parse(JSON.stringify(doc.canonicalPayload));
      tamperedPayload.studentName = 'Impostor Name';

      const mismatchCheck = await docService.verifyTamper(doc.verificationId, tamperedPayload);
      expect(mismatchCheck.isMatch).toBe(false);
      expect(mismatchCheck.computedHash).not.toBe(doc.canonicalHash);
    });
  });

  describe('4. Revocation Authorization & Invariants', () => {
    it('MUST FAIL: Reject revocation attempt by non-registrar actors (e.g. Teacher or Chairman)', async () => {
      const doc = await docService.getDocument('doc-testimonial-01');
      expect(doc).toBeDefined();
      if (!doc) return;

      // Teacher attempts revocation -> Rejected
      await expect(
        docService.revokeDocument(doc.verificationId, 'Suspected academic fraud', teacherActor)
      ).rejects.toThrow(WorkflowPermissionError);

      // Chairman attempts revocation -> Rejected
      await expect(
        docService.revokeDocument(doc.verificationId, 'Chairman cancelling document', chairmanActor)
      ).rejects.toThrow(WorkflowPermissionError);
    });

    it('MUST FAIL: Reject revocation without a mandatory explanation reason (min 5 chars)', async () => {
      const doc = await docService.getDocument('doc-testimonial-01');
      expect(doc).toBeDefined();
      if (!doc) return;

      // Empty reason
      await expect(
        docService.revokeDocument(doc.verificationId, '', registrarActor)
      ).rejects.toThrow(WorkflowValidationError);

      // Too short (< 5 chars)
      await expect(
        docService.revokeDocument(doc.verificationId, 'No', registrarActor)
      ).rejects.toThrow(WorkflowValidationError);
    });

    it('SUCCESS: Registrar can revoke document, which permanently updates the verification status', async () => {
      const doc = await docService.getDocument('doc-testimonial-01');
      expect(doc).toBeDefined();
      if (!doc) return;

      const revokedDoc = await docService.revokeDocument(
        doc.verificationId,
        'Disciplinary sanction imposed by Academic Council.',
        registrarActor
      );

      expect(revokedDoc.status).toBe('REVOKED');
      expect(revokedDoc.revocationReason).toBe('Disciplinary sanction imposed by Academic Council.');
      expect(revokedDoc.revokedAt).toBeDefined();

      // Check public verification returns REVOKED
      const publicResult = await docService.verifyDocument(doc.verificationId, 'test-verifier');
      expect(publicResult.status).toBe('REVOKED');
      expect(publicResult.revocationReason).toBe('Disciplinary sanction imposed by Academic Council.');
    });
  });

  describe('5. Public Verification Privacy & Security Invariants', () => {
    it('verification response contains strictly minimal data and NO sensitive fields', async () => {
      // Seed document for Tanvir Ahmed
      const publicResult = await docService.verifyDocument('7f9c2d1b8e4a3f65021c9b8a7d6e5f41', 'privacy-test-client');

      expect(publicResult.status).toBe('VALID');
      expect(publicResult.maskedStudentName).toBe('T****r A***d');
      expect(publicResult.department).toBe('CSE');

      // MUST NOT contain sensitive fields
      const resultObj = publicResult as any;
      expect(resultObj.studentId).toBeUndefined();
      expect(resultObj.cgpa).toBeUndefined();
      expect(resultObj.marks).toBeUndefined();
      expect(resultObj.studentEmail).toBeUndefined();
      expect(resultObj.phone).toBeUndefined();
      expect(resultObj.rollNumber).toBeUndefined();
      expect(resultObj.grades).toBeUndefined();
    });

    it('INVALID ID gives generic NOT_FOUND response with no internal hints', async () => {
      const arbitraryInvalidIds = [
        '00000000000000000000000000000000',
        'random_invalid_token_xyz',
        'invalid-12345',
        ''
      ];

      for (const invalidId of arbitraryInvalidIds) {
        const result = await docService.verifyDocument(invalidId, 'arbitrary-test-client');
        expect(result.status).toBe('NOT_FOUND');
        expect(result.maskedStudentName).toBeUndefined();
        expect(result.department).toBeUndefined();
        expect(result.message).toContain('No institutional academic credential found');
      }
    });

    it('RATE LIMIT: Enforces maximum 10 lookups per minute per client', async () => {
      const clientId = 'rate-limit-test-user';
      const validToken = '7f9c2d1b8e4a3f65021c9b8a7d6e5f41';

      // 10 lookups should all succeed
      for (let i = 0; i < 10; i++) {
        const res = await docService.verifyDocument(validToken, clientId);
        expect(res.status).toBe('VALID');
      }

      // 11th lookup in the same minute MUST be rate-limited
      const rateLimitedRes = await docService.verifyDocument(validToken, clientId);
      expect(rateLimitedRes.status).toBe('NOT_FOUND');
      expect(rateLimitedRes.message).toContain('Rate limit exceeded');
    });
  });
});
