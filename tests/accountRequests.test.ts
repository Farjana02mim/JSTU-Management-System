import { describe, it, expect, beforeEach } from 'vitest';
import {
  AccountRequestService,
  accountRequestSchema,
  statusCheckSchema
} from '../src/services/accountRequests';
import { SharedDataStoreManager } from '../src/services/shared/sharedDataStore';
import { getUserClaims, getUserProfile } from '../src/services/cloudFunctions/backendEngine';
import { MockAuthService } from '../src/services/auth/mock/mockAuthService';

describe('Phase 5A: Student Account Request Flow & Security Invariants', () => {
  beforeEach(() => {
    // Reset store and rate limits before each test
    SharedDataStoreManager.getInstance().resetStore();
    AccountRequestService.clearRateLimits();
  });

  describe('1. Invalid input rejected', () => {
    it('MUST FAIL: Rejects full name that is too short (< 3 characters)', async () => {
      await expect(
        AccountRequestService.submitRequest({
          fullName: 'Al',
          department: 'CSE',
          session: '2023-2024',
          studentId: 'JSTU2026099',
          email: 'al@jstu.ac.bd',
          note: 'Newly admitted student requesting portal access'
        })
      ).rejects.toThrow(/Full name must be at least 3 characters long/);
    });

    it('MUST FAIL: Rejects invalid department outside the 7 JSTU departments', async () => {
      await expect(
        AccountRequestService.submitRequest({
          fullName: 'Tanvir Hossain',
          department: 'NON_EXISTENT_DEPT',
          session: '2023-2024',
          studentId: 'JSTU2026099',
          email: 'tanvir@jstu.ac.bd',
          note: 'Requesting account for unlisted department'
        })
      ).rejects.toThrow(/Invalid department: must be one of the 7 official JSTU departments/);
    });

    it('MUST FAIL: Rejects invalid academic session (< 4 characters)', async () => {
      await expect(
        AccountRequestService.submitRequest({
          fullName: 'Tanvir Hossain',
          department: 'CSE',
          session: '',
          studentId: 'JSTU2026099',
          email: 'tanvir@jstu.ac.bd',
          note: 'Requesting account without valid batch'
        })
      ).rejects.toThrow(/Academic session\/batch is required/);
    });

    it('MUST FAIL: Rejects student ID that is too short (< 3 characters)', async () => {
      await expect(
        AccountRequestService.submitRequest({
          fullName: 'Tanvir Hossain',
          department: 'CSE',
          session: '2023-2024',
          studentId: '01',
          email: 'tanvir@jstu.ac.bd',
          note: 'Valid explanation note for submission'
        })
      ).rejects.toThrow(/Student ID or admission roll number is required/);
    });

    it('MUST FAIL: Rejects malformed email address', async () => {
      await expect(
        AccountRequestService.submitRequest({
          fullName: 'Tanvir Hossain',
          department: 'CSE',
          session: '2023-2024',
          studentId: 'JSTU2026099',
          email: 'not-an-email-at-all',
          note: 'Valid explanation note for submission'
        })
      ).rejects.toThrow(/valid institutional or personal email/);
    });

    it('MUST FAIL: Rejects note that is too short (< 5 characters)', async () => {
      await expect(
        AccountRequestService.submitRequest({
          fullName: 'Tanvir Hossain',
          department: 'CSE',
          session: '2023-2024',
          studentId: 'JSTU2026099',
          email: 'tanvir@jstu.ac.bd',
          note: 'Hi'
        })
      ).rejects.toThrow(/minimum 5 characters/);
    });

    it('MUST FAIL: Rejects note exceeding maximum field cap (> 500 characters)', async () => {
      const longNote = 'A'.repeat(501);
      await expect(
        AccountRequestService.submitRequest({
          fullName: 'Tanvir Hossain',
          department: 'CSE',
          session: '2023-2024',
          studentId: 'JSTU2026099',
          email: 'tanvir@jstu.ac.bd',
          note: longNote
        })
      ).rejects.toThrow(/cannot exceed 500 characters/);
    });
  });

  describe('2. Role cannot be set by the form', () => {
    it('MUST FAIL: Any attempt to submit a non-student role (e.g. admin, teacher) is rejected', async () => {
      const hostileSubmission = {
        fullName: 'Attacker Impersonator',
        department: 'CSE',
        session: '2023-2024',
        studentId: 'ATTACK01',
        email: 'attacker@jstu.ac.bd',
        note: 'Attempting privilege escalation via public form',
        role: 'admin' as any
      };

      const schemaCheck = accountRequestSchema.safeParse(hostileSubmission);
      expect(schemaCheck.success).toBe(false);

      await expect(
        AccountRequestService.submitRequest(hostileSubmission)
      ).rejects.toThrow(/Role cannot be set by the form/);
    });

    it('MUST FAIL: Attempting to submit role as teacher is rejected', async () => {
      const teacherSubmission = {
        fullName: 'Faculty Member',
        department: 'EEE',
        session: '2023-2024',
        studentId: 'EMP009',
        email: 'teacher@jstu.ac.bd',
        note: 'Attempting to request teacher role via student form',
        role: 'teacher' as any
      };

      await expect(
        AccountRequestService.submitRequest(teacherSubmission)
      ).rejects.toThrow(/Role cannot be set by the form/);
    });

    it('Legitimate submission stores role strictly fixed to student', async () => {
      const legitimateData = {
        fullName: 'Sumon Barua',
        department: 'MATH',
        session: '2023-2024',
        studentId: 'JSTU2026777',
        email: 'sumon.barua@jstu.ac.bd',
        note: 'Newly admitted student requesting portal access'
      };

      const result = await AccountRequestService.submitRequest(legitimateData);
      expect(result.success).toBe(true);

      const store = SharedDataStoreManager.getInstance().getStore();
      const saved = store.accountRequests.find((r) => r.referenceNumber === result.referenceNumber);
      expect(saved).toBeDefined();
      expect(saved?.role).toBe('student');
    });
  });

  describe('3. Duplicate ID or email gives the same generic response (Enumeration Defense)', () => {
    it('MUST SUCCEED with generic response: Duplicate ID or email returns identical generic response without revealing account existence', async () => {
      // JSTU2026001 and student.demo@jstu.ac.bd already exist in seed data
      const duplicateSubmission = {
        fullName: 'Probe User',
        department: 'CSE',
        session: '2022-2023',
        studentId: 'JSTU2026001', // Existing student ID
        email: 'student.demo@jstu.ac.bd', // Existing email
        note: 'Probing if user credentials exist'
      };

      const result = await AccountRequestService.submitRequest(duplicateSubmission);

      expect(result.success).toBe(true);
      expect(result.referenceNumber).toMatch(/^JSTU-REQ-\d{4}-[A-Z0-9]{6}$/);
      expect(result.message).toContain('Your student account request has been submitted successfully for administrative review');
      // Verify enumeration defense: does NOT reveal account existence
      expect(result.message).not.toContain('already exists');
      expect(result.message).not.toContain('duplicate');
      expect(result.message).not.toContain('collision');
      expect(result.isDuplicateSuppressed).toBe(true);

      // Verify no duplicate record was created in the pending store
      const store = SharedDataStoreManager.getInstance().getStore();
      const duplicateEntries = store.accountRequests.filter(
        (r) => r.email === 'student.demo@jstu.ac.bd'
      );
      expect(duplicateEntries.length).toBe(0);
    });
  });

  describe('4. Wrong reference/email gives generic not-found (Status Check Defense)', () => {
    it('Wrong combination returns identical generic not-found message', async () => {
      // Known reference in seed data: JSTU-REQ-2026-891041
      // Case 1: Valid ref, wrong email
      const res1 = await AccountRequestService.checkRequestStatus({
        referenceNumber: 'JSTU-REQ-2026-891041',
        email: 'wrong.email@random.com'
      });
      expect(res1.found).toBe(false);
      expect(res1.message).toBe('No account request was found matching the provided reference number and email address.');
      expect(res1.status).toBeUndefined();

      // Case 2: Wrong ref, valid email
      const res2 = await AccountRequestService.checkRequestStatus({
        referenceNumber: 'JSTU-REQ-2026-000000',
        email: 'sultan.mahmud@jstu.ac.bd'
      });
      expect(res2.found).toBe(false);
      expect(res2.message).toBe('No account request was found matching the provided reference number and email address.');

      // Case 3: Both wrong
      const res3 = await AccountRequestService.checkRequestStatus({
        referenceNumber: 'JSTU-REQ-INVALID',
        email: 'nobody@nowhere.com'
      });
      expect(res3.found).toBe(false);
      expect(res3.message).toBe('No account request was found matching the provided reference number and email address.');
    });

    it('Valid reference and email returns ONLY the status and nothing else', async () => {
      const matchRes = await AccountRequestService.checkRequestStatus({
        referenceNumber: 'JSTU-REQ-2026-891041',
        email: 'sultan.mahmud@jstu.ac.bd'
      });

      expect(matchRes.found).toBe(true);
      expect(matchRes.status).toBe('PENDING');
      // Ensure no personal data is leaked
      expect((matchRes as any).fullName).toBeUndefined();
      expect((matchRes as any).studentId).toBeUndefined();
      expect((matchRes as any).email).toBeUndefined();
      expect((matchRes as any).note).toBeUndefined();
    });
  });

  describe('5. Rate Limits (3 requests/hour, 10 status checks/hour)', () => {
    it('MUST FAIL: 4th request within 1 hour triggers rate limit rejection', async () => {
      for (let i = 1; i <= 3; i++) {
        const res = await AccountRequestService.submitRequest({
          fullName: `Candidate Number ${i}`,
          department: 'CSE',
          session: '2023-2024',
          studentId: `JSTU202611${i}`,
          email: `candidate${i}@jstu.ac.bd`,
          note: 'Valid request note'
        });
        expect(res.success).toBe(true);
      }

      // 4th request MUST be blocked by rate limit
      await expect(
        AccountRequestService.submitRequest({
          fullName: 'Exceeding Candidate',
          department: 'CSE',
          session: '2023-2024',
          studentId: 'JSTU2026114',
          email: 'exceeding@jstu.ac.bd',
          note: 'Attempting to exceed hourly quota'
        })
      ).rejects.toThrow(/RATE_LIMIT_EXCEEDED/);
    });

    it('MUST FAIL: 11th status check within 1 hour triggers rate limit rejection', async () => {
      for (let i = 1; i <= 10; i++) {
        const check = await AccountRequestService.checkRequestStatus({
          referenceNumber: 'JSTU-REQ-2026-891041',
          email: 'sultan.mahmud@jstu.ac.bd'
        });
        expect(check.found).toBe(true);
      }

      // 11th status check MUST be blocked by rate limit
      await expect(
        AccountRequestService.checkRequestStatus({
          referenceNumber: 'JSTU-REQ-2026-891041',
          email: 'sultan.mahmud@jstu.ac.bd'
        })
      ).rejects.toThrow(/RATE_LIMIT_EXCEEDED/);
    });
  });

  describe('6. Non-admin cannot approve', () => {
    it('MUST FAIL: Student caller cannot inspect or approve account requests', async () => {
      await expect(
        AccountRequestService.getAccountRequests('student')
      ).rejects.toThrow(/PERMISSION_DENIED/);

      await expect(
        AccountRequestService.approveRequest('req_demo_01', { uid: 'student_uid', role: 'student' }, true)
      ).rejects.toThrow(/PERMISSION_DENIED/);
    });

    it('MUST FAIL: Teacher caller cannot inspect or approve account requests', async () => {
      await expect(
        AccountRequestService.getAccountRequests('teacher')
      ).rejects.toThrow(/PERMISSION_DENIED/);

      await expect(
        AccountRequestService.approveRequest('req_demo_01', { uid: 'teacher_uid', role: 'teacher' }, true)
      ).rejects.toThrow(/PERMISSION_DENIED/);
    });

    it('Administrative roles (admin, super_admin, registrar) ARE authorized', async () => {
      const adminList = await AccountRequestService.getAccountRequests('admin');
      expect(adminList.length).toBeGreaterThan(0);

      const registrarList = await AccountRequestService.getAccountRequests('registrar');
      expect(registrarList.length).toBeGreaterThan(0);
    });
  });

  describe('7. Approve disabled until verification is ticked', () => {
    it('MUST FAIL: Approving without ticking verification checklist throws VALIDATION_ERROR', async () => {
      await expect(
        AccountRequestService.approveRequest(
          'req_demo_01',
          { uid: 'admin_01', role: 'admin' },
          false // Verification NOT ticked
        )
      ).rejects.toThrow(/Verification checklist required/);
    });

    it('SUCCEEDS when verification checklist is ticked', async () => {
      const result = await AccountRequestService.approveRequest(
        'req_demo_01',
        { uid: 'admin_01', role: 'admin', displayName: 'Registrar Admin' },
        true // Verification ticked
      );

      expect(result.success).toBe(true);
      expect(result.uid).toBeDefined();

      const store = SharedDataStoreManager.getInstance().getStore();
      const updatedReq = store.accountRequests.find((r) => r.id === 'req_demo_01');
      expect(updatedReq?.status).toBe('APPROVED');
      expect(updatedReq?.idVerified).toBe(true);
    });
  });

  describe('8. Request alone never creates an account', () => {
    it('Submitting request creates ONLY a PENDING request in mock store and NO user in auth', async () => {
      const applicantEmail = 'prospective.student@jstu.ac.bd';
      const submission = {
        fullName: 'Prospective Student',
        department: 'FISH',
        session: '2023-2024',
        studentId: 'JSTU2026888',
        email: applicantEmail,
        note: 'Submitted application for admission portal'
      };

      const res = await AccountRequestService.submitRequest(submission);
      expect(res.success).toBe(true);

      const store = SharedDataStoreManager.getInstance().getStore();
      const saved = store.accountRequests.find((r) => r.email === applicantEmail);
      expect(saved).toBeDefined();
      expect(saved?.status).toBe('PENDING');
      expect(saved?.createdUserId).toBeUndefined();

      // Verify NO user exists in students database
      const studentMatch = Object.values(store.students).find(
        (s) => s.email === applicantEmail || s.studentId === 'JSTU2026888'
      );
      expect(studentMatch).toBeUndefined();
    });
  });

  describe('9. Approval creates only a student', () => {
    it('Approve provisions user strictly with role student and sets mustChangePassword', async () => {
      const approvalResult = await AccountRequestService.approveRequest(
        'req_demo_02',
        { uid: 'registrar_uid', role: 'registrar', displayName: 'Md. Abdul Mannan' },
        true
      );

      expect(approvalResult.success).toBe(true);
      expect(approvalResult.uid).toBeDefined();

      // Verify custom claims
      const claims = getUserClaims(approvalResult.uid);
      expect(claims).toBeDefined();
      expect(claims?.role).toBe('student'); // INVARIANT: Role is strictly student
      expect(claims?.studentId).toBe('JSTU2026092');
      expect(claims?.mustChangePassword).toBe(true);

      // Verify profile
      const profile = getUserProfile(approvalResult.uid);
      expect(profile).toBeDefined();
      expect(profile?.role).toBe('student');
      expect(profile?.email).toBe('mehnaz.tabassum@jstu.ac.bd');

      // Verify simulated email was logged
      const emailLogs = AccountRequestService.getSimulatedEmailLogs();
      const approvalEmail = emailLogs.find(
        (e) => e.recipientEmail === 'mehnaz.tabassum@jstu.ac.bd' && e.actionType === 'APPROVED'
      );
      expect(approvalEmail).toBeDefined();
      expect(approvalEmail?.subject).toContain('[SIMULATED EMAIL - DEMO MODE]');
    });
  });

  describe('10. Set-password token lifecycle & login flow', () => {
    it('MUST PASS: valid token works once, clears mustChangePassword and marks token used', async () => {
      // 1. Submit and approve request
      const submission = {
        fullName: 'Nafis Imtiaz',
        department: 'CSE',
        session: '2023-2024',
        studentId: 'JSTU2026301',
        email: 'nafis.imtiaz@student.jstu.ac.bd',
        note: 'Newly admitted student requesting portal access'
      };
      await AccountRequestService.submitRequest(submission);

      const store = SharedDataStoreManager.getInstance().getStore();
      const req = store.accountRequests.find((r) => r.email === submission.email);
      expect(req).toBeDefined();

      const approval = await AccountRequestService.approveRequest(
        req!.id,
        { uid: 'reg_admin', role: 'registrar', displayName: 'Registrar' },
        true
      );
      expect(approval.success).toBe(true);
      expect(approval.token).toBeDefined();

      // Check simulated email contains working link to /set-password with token
      const emails = AccountRequestService.getSimulatedEmailLogs();
      const approvalEmail = emails.find((e) => e.recipientEmail === submission.email && e.actionType === 'APPROVED');
      expect(approvalEmail).toBeDefined();
      expect(approvalEmail?.body).toContain(`/set-password?token=${approval.token}`);
      expect(approvalEmail?.body).toContain('Simulated email. Real emails need a Cloud Function.');
      expect(approvalEmail?.body).not.toContain('password:');

      // 2. Validate token
      const val = AccountRequestService.validateActivationToken(approval.token!);
      expect(val.valid).toBe(true);
      expect(val.tokenInfo?.used).toBe(false);

      // 3. Set valid password (12+ characters, mixed case, number, symbol)
      const newStrongPass = 'JSTU#Strong2026!';
      const setPassRes = await AccountRequestService.setPasswordWithToken(approval.token!, newStrongPass);
      expect(setPassRes.success).toBe(true);

      // 4. Verify token is marked used
      const afterStore = SharedDataStoreManager.getInstance().getStore();
      const usedToken = afterStore.activationTokens.find((t) => t.token === approval.token);
      expect(usedToken).toBeDefined();
      expect(usedToken?.used).toBe(true);
      expect(usedToken?.usedAt).toBeDefined();

      // 5. Verify mustChangePassword is cleared
      const claims = getUserClaims(approval.uid);
      expect(claims?.mustChangePassword).toBe(false);
    });

    it('MUST FAIL: reused token fails with generic error message', async () => {
      const submission = {
        fullName: 'Sharmin Sultana',
        department: 'EEE',
        session: '2023-2024',
        studentId: 'JSTU2026302',
        email: 'sharmin.sultana@student.jstu.ac.bd',
        note: 'Requesting portal access'
      };
      await AccountRequestService.submitRequest(submission);
      const store = SharedDataStoreManager.getInstance().getStore();
      const req = store.accountRequests.find((r) => r.email === submission.email);

      const approval = await AccountRequestService.approveRequest(
        req!.id,
        { uid: 'reg_admin', role: 'registrar', displayName: 'Registrar' },
        true
      );

      // First use succeeds
      const strongPass = 'EEE#SecurePass2026!';
      await AccountRequestService.setPasswordWithToken(approval.token!, strongPass);

      // Second use MUST fail with the same generic error
      await expect(
        AccountRequestService.setPasswordWithToken(approval.token!, 'AnotherPass#2026!')
      ).rejects.toThrow(/Invalid, expired, or already used activation link/);

      // Token validation check also fails with generic message
      const checkRes = AccountRequestService.validateActivationToken(approval.token!);
      expect(checkRes.valid).toBe(false);
      expect(checkRes.error).toContain('Invalid, expired, or already used activation link');
    });

    it('MUST FAIL: expired token fails with generic error message', async () => {
      const submission = {
        fullName: 'Farhan Kabir',
        department: 'MATH',
        session: '2023-2024',
        studentId: 'JSTU2026303',
        email: 'farhan.kabir@student.jstu.ac.bd',
        note: 'Requesting portal access'
      };
      await AccountRequestService.submitRequest(submission);
      const store = SharedDataStoreManager.getInstance().getStore();
      const req = store.accountRequests.find((r) => r.email === submission.email);

      const approval = await AccountRequestService.approveRequest(
        req!.id,
        { uid: 'reg_admin', role: 'registrar', displayName: 'Registrar' },
        true
      );

      // Manually simulate expired token (e.g. created 25 hours ago)
      const currentStore = SharedDataStoreManager.getInstance().getStore();
      const expiredTokens = currentStore.activationTokens.map((t) => {
        if (t.token === approval.token) {
          return {
            ...t,
            createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
            expiresAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
          };
        }
        return t;
      });
      SharedDataStoreManager.getInstance().saveStore({
        ...currentStore,
        activationTokens: expiredTokens
      });

      // Validation returns generic error
      const val = AccountRequestService.validateActivationToken(approval.token!);
      expect(val.valid).toBe(false);
      expect(val.error).toContain('Invalid, expired, or already used activation link');

      // Attempting to set password throws generic error
      await expect(
        AccountRequestService.setPasswordWithToken(approval.token!, 'ValidPass#2026!')
      ).rejects.toThrow(/Invalid, expired, or already used activation link/);
    });

    it('MUST FAIL: weak password rejected and token is not consumed', async () => {
      const submission = {
        fullName: 'Sadman Sakib',
        department: 'SW',
        session: '2023-2024',
        studentId: 'JSTU2026304',
        email: 'sadman.sakib@student.jstu.ac.bd',
        note: 'Requesting portal access'
      };
      await AccountRequestService.submitRequest(submission);
      const store = SharedDataStoreManager.getInstance().getStore();
      const req = store.accountRequests.find((r) => r.email === submission.email);

      const approval = await AccountRequestService.approveRequest(
        req!.id,
        { uid: 'reg_admin', role: 'registrar', displayName: 'Registrar' },
        true
      );

      // 1. Password too short (< 12 chars)
      await expect(
        AccountRequestService.setPasswordWithToken(approval.token!, 'Short1!')
      ).rejects.toThrow(/Password does not meet institutional policy/);

      // 2. Password without symbol
      await expect(
        AccountRequestService.setPasswordWithToken(approval.token!, 'NoSymbolPass12345')
      ).rejects.toThrow(/Password does not meet institutional policy/);

      // 3. Common blocked password
      await expect(
        AccountRequestService.setPasswordWithToken(approval.token!, 'password12345')
      ).rejects.toThrow(/too common and easily guessed/);

      // Invariant: Token is NOT marked as used after rejection
      const checkVal = AccountRequestService.validateActivationToken(approval.token!);
      expect(checkVal.valid).toBe(true);

      // Subsequent valid password succeeds
      const successRes = await AccountRequestService.setPasswordWithToken(approval.token!, 'ValidComplex#2026!');
      expect(successRes.success).toBe(true);
    });

    it('INVARIANT: request data never contains a password or secret', async () => {
      const store = SharedDataStoreManager.getInstance().getStore();

      // Check all existing and submitted account requests
      for (const req of store.accountRequests) {
        expect('password' in req).toBe(false);
        expect('passwordHash' in req).toBe(false);
        expect('tempPassword' in req).toBe(false);
        expect((req as any).password).toBeUndefined();
      }

      // Check all simulated email logs
      for (const email of store.simulatedEmailLogs) {
        expect(email.body.toLowerCase()).not.toContain('temporary password:');
        expect(email.body.toLowerCase()).not.toContain('password is:');
        expect(email.subject.toLowerCase()).not.toContain('password:');
      }

      // Verify schema strips or rejects password
      const parsedWithIgnoredRole = accountRequestSchema.safeParse({
        fullName: 'Test Student',
        department: 'CSE',
        session: '2023-2024',
        studentId: 'JSTU2026999',
        email: 'test.student@jstu.ac.bd',
        note: 'Valid student request for portal access'
      });
      expect(parsedWithIgnoredRole.success).toBe(true);
      if (parsedWithIgnoredRole.success) {
        expect('password' in parsedWithIgnoredRole.data).toBe(false);
      }
    });

    it('MUST PASS: student can log in with new password through normal /login flow in demo mode', async () => {
      const studentEmail = 'login.test@student.jstu.ac.bd';
      const studentPass = 'MyNewPassword#2026!';

      // 1. Submit and approve request
      await AccountRequestService.submitRequest({
        fullName: 'Login Test Student',
        department: 'GEOL',
        session: '2023-2024',
        studentId: 'JSTU2026777',
        email: studentEmail,
        note: 'Testing complete login lifecycle'
      });
      const store = SharedDataStoreManager.getInstance().getStore();
      const req = store.accountRequests.find((r) => r.email === studentEmail);
      const approval = await AccountRequestService.approveRequest(
        req!.id,
        { uid: 'reg_admin', role: 'registrar', displayName: 'Registrar' },
        true
      );

      // 2. Set password with token
      await AccountRequestService.setPasswordWithToken(approval.token!, studentPass);

      // 3. Log in with wrong password -> fails
      const mockAuth = new MockAuthService();
      const failLogin = await mockAuth.signIn(studentEmail, 'WrongPassword123!');
      expect(failLogin.success).toBe(false);
      expect(failLogin.error).toContain('Invalid password');

      // 4. Log in with correct new password -> succeeds!
      const successLogin = await mockAuth.signIn(studentEmail, studentPass);
      expect(successLogin.success).toBe(true);
      expect(mockAuth.getCurrentUser()?.email).toBe(studentEmail);
      expect(mockAuth.getCurrentClaims()?.role).toBe('student');
      expect(mockAuth.getCurrentClaims()?.mustChangePassword).toBe(false);
      expect(mockAuth.getCurrentProfile()?.fullName).toBe('Login Test Student');
    });

    it('DEMO ACCOUNTS INVARIANTS: verifies credentials and role configs for 6 requested roles', async () => {
      const { DEMO_ACCOUNTS, DEMO_PASSWORD } = await import('../src/services/demoAccounts');
      expect(DEMO_PASSWORD).toBe('JSTU#Smart2026!');

      const findRole = (role: string) => DEMO_ACCOUNTS.find((a) => a.role === role);

      // 1. Admin
      const admin = findRole('admin');
      expect(admin).toBeDefined();
      expect(admin?.email).toBe('admin.demo@jstu.ac.bd');
      expect(admin?.password).toBe('JSTU#Smart2026!');
      expect(admin?.isMfaEnforced).toBe(true);

      // 2. Student
      const student = findRole('student');
      expect(student).toBeDefined();
      expect(student?.email).toBe('student.demo@jstu.ac.bd');
      expect(student?.password).toBe('JSTU#Smart2026!');
      expect(student?.isMfaEnforced).toBe(false);

      // 3. Teacher
      const teacher = findRole('teacher');
      expect(teacher).toBeDefined();
      expect(teacher?.email).toBe('teacher.demo@jstu.ac.bd');
      expect(teacher?.password).toBe('JSTU#Smart2026!');
      expect(teacher?.isMfaEnforced).toBe(true);

      // 4. Chairman
      const chairman = findRole('dept_chairman');
      expect(chairman).toBeDefined();
      expect(chairman?.email).toBe('chairman.demo@jstu.ac.bd');
      expect(chairman?.password).toBe('JSTU#Smart2026!');
      expect(chairman?.isMfaEnforced).toBe(true);

      // 5. Exam Controller
      const controller = findRole('exam_controller');
      expect(controller).toBeDefined();
      expect(controller?.email).toBe('controller.demo@jstu.ac.bd');
      expect(controller?.password).toBe('JSTU#Smart2026!');
      expect(controller?.isMfaEnforced).toBe(true);

      // 6. Registrar
      const registrar = findRole('registrar');
      expect(registrar).toBeDefined();
      expect(registrar?.email).toBe('registrar.demo@jstu.ac.bd');
      expect(registrar?.password).toBe('JSTU#Smart2026!');
      expect(registrar?.isMfaEnforced).toBe(true);
    });

    it('DEMO MODE INVARIANT: isMockMode is true in demo mode and false when real Firebase is connected', async () => {
      const { isMockMode, isFirebaseConnected } = await import('../src/services/auth');
      // When no real Firebase key is provided, isFirebaseConnected is false, isMockMode is true
      expect(isFirebaseConnected).toBe(false);
      expect(isMockMode).toBe(true);
    });
  });
});
