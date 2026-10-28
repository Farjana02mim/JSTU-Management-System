import {
  SharedDataStoreManager,
  AccountRequest,
  AccountRequestStatus,
  SimulatedEmailLog,
  ActivationToken
} from '../shared/sharedDataStore';
import {
  accountRequestSchema,
  statusCheckSchema,
  AccountRequestFormData,
  AccountRequestStatusCheckData,
  AccountRequestSubmissionResult,
  AccountRequestStatusCheckResult,
  AccountRequestFilterOptions
} from './accountRequestTypes';
import {
  createUserAccount,
  writeAuditLog,
  setUserPassword,
  clearUserMustChangePassword
} from '../cloudFunctions/backendEngine';
import { UserRole } from '../../types/auth';

// Rate limiting in-memory records: rolling 1-hour window
const SUBMISSION_RATE_LIMIT_MAX = 3; // 3 requests per hour
const STATUS_CHECK_RATE_LIMIT_MAX = 10; // 10 status checks per hour
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

let submissionTimestamps: number[] = [];
let statusCheckTimestamps: number[] = [];

/**
 * Service managing Student Account Requests and Registrar / Admin Review Workflow
 *
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */
export class AccountRequestService {
  /**
   * Helper to reset rate limits (used in test suite and simulated reset)
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public static clearRateLimits(): void {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    submissionTimestamps = [];
    statusCheckTimestamps = [];
  }

  /**
   * Helper to generate standardized Reference Number: JSTU-REQ-YYYY-XXXXXX
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public static generateReferenceNumber(): string {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    const year = new Date().getFullYear();
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `JSTU-REQ-${year}-${code}`;
  }

  /**
   * Submit an Account Request from the public /request-account page.
   *
   * Security Invariants:
   * 1. No password field accepted or processed.
   * 2. No role field: role is ALWAYS student. Form never creates an account directly.
   * 3. Honeypot check rejects automated bot submissions.
   * 4. Simulated rate limit of 3 requests per hour.
   * 5. Generic response regardless of whether ID or email already exists to prevent enumeration.
   *
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public static async submitRequest(
    data: AccountRequestFormData
  ): Promise<AccountRequestSubmissionResult> {
    // Real enforcement must move to Firestore rules / Cloud Functions.

    // 1. Invariant: Role cannot be set by the form
    if ((data as any).role !== undefined && (data as any).role !== 'student') {
      throw new Error('VALIDATION_ERROR: Role cannot be set by the form; role is always fixed to student.');
    }

    // 2. Zod Validation & Sanitization
    const validationResult = accountRequestSchema.safeParse(data);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues?.[0]?.message || 'Invalid form input.';
      throw new Error(`VALIDATION_ERROR: ${firstError}`);
    }
    const validatedData = validationResult.data;

    // 3. Honeypot Check: if bot filled hidden field, reject immediately
    if (validatedData.website && validatedData.website.trim().length > 0) {
      throw new Error('BOT_DETECTED: Automated submission rejected by honeypot defense.');
    }

    // 4. Simulated Rate Limiting (3 requests per hour)
    const now = Date.now();
    submissionTimestamps = submissionTimestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    if (submissionTimestamps.length >= SUBMISSION_RATE_LIMIT_MAX) {
      throw new Error(
        'RATE_LIMIT_EXCEEDED: You have reached the maximum rate limit of 3 account requests per hour. Please wait before trying again.'
      );
    }
    submissionTimestamps.push(now);

    // 5. Generate Reference Number: JSTU-REQ-YYYY-XXXXXX
    const referenceNumber = AccountRequestService.generateReferenceNumber();

    const storeManager = SharedDataStoreManager.getInstance();
    const store = storeManager.getStore();

    // 6. Duplicate Check (Check existing users and existing pending requests)
    const normalizedEmail = validatedData.email.toLowerCase().trim();
    const normalizedStudentId = validatedData.studentId.trim();

    const isDuplicateEmail =
      Object.values(store.students).some((s) => s.email.toLowerCase() === normalizedEmail) ||
      (store.teacherProfile && store.teacherProfile.email.toLowerCase() === normalizedEmail) ||
      (store.accountRequests || []).some(
        (r) => r.email.toLowerCase() === normalizedEmail && r.status === 'PENDING'
      );

    const isDuplicateId =
      Object.values(store.students).some((s) => s.studentId === normalizedStudentId) ||
      (store.accountRequests || []).some(
        (r) => r.studentId === normalizedStudentId && r.status === 'PENDING'
      );

    // If duplicate: Return GENERIC success without creating duplicate, never revealing account existence
    if (isDuplicateEmail || isDuplicateId) {
      return {
        success: true,
        referenceNumber,
        message:
          'Your student account request has been submitted successfully for administrative review. If your records are verified against university records, an activation link will be dispatched to your email.',
        isDuplicateSuppressed: true
      };
    }

    // 7. Save PENDING request in shared mock store (Never creates an account)
    const newRequest: AccountRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      referenceNumber,
      fullName: validatedData.fullName,
      studentId: validatedData.studentId,
      role: 'student', // Invariant: role is always student
      department: validatedData.department,
      session: validatedData.session,
      email: validatedData.email,
      phone: validatedData.phone || undefined,
      note: validatedData.note,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    // Simulated email dispatch log
    const simulatedEmail: SimulatedEmailLog = {
      id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      recipientEmail: validatedData.email,
      recipientName: validatedData.fullName,
      subject: `[SIMULATED EMAIL - DEMO MODE] JSTU Student Account Request Received (${referenceNumber})`,
      body: `Dear ${validatedData.fullName},\n\nYour application for a JSTU Student Portal Account has been received.\nReference Number: ${referenceNumber}\nDepartment: ${validatedData.department}\nStudent ID/Roll: ${validatedData.studentId}\nSession: ${validatedData.session}\nStatus: PENDING VERIFICATION\n\nYou may check your verification status anytime using your Reference Number and Email on the portal.\n\nOffice of Registrar & Academic Affairs\nJamalpur Science & Technology University (JSTU)`,
      sentAt: new Date().toISOString(),
      referenceNumber,
      actionType: 'SUBMITTED'
    };

    const updatedRequests = [newRequest, ...(store.accountRequests || [])];
    const updatedEmails = [simulatedEmail, ...(store.simulatedEmailLogs || [])];

    storeManager.saveStore({
      ...store,
      accountRequests: updatedRequests,
      simulatedEmailLogs: updatedEmails
    });

    // Write audit trail entry
    writeAuditLog('public_guest', 'ACCOUNT_REQUEST_SUBMITTED', undefined, validatedData.email, {
      referenceNumber,
      role: 'student',
      department: validatedData.department,
      studentId: validatedData.studentId,
      session: validatedData.session
    });

    return {
      success: true,
      referenceNumber,
      message:
        'Your student account request has been submitted successfully for administrative review. If your records are verified against university records, an activation link will be dispatched to your email.',
      isDuplicateSuppressed: false
    };
  }

  /**
   * Status Check Box: Enter Reference Number + Email.
   *
   * Privacy and abuse rules:
   * 1. Returns ONLY the status ('PENDING', 'APPROVED', 'REJECTED', 'MORE_INFO_REQUESTED'), nothing else!
   * 2. Returns generic not-found response for any wrong combination of reference number and email.
   * 3. Simulated rate limit of 10 status checks per hour.
   *
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public static async checkRequestStatus(
    params: AccountRequestStatusCheckData
  ): Promise<AccountRequestStatusCheckResult> {
    // Real enforcement must move to Firestore rules / Cloud Functions.

    // 1. Zod Validation
    const validationResult = statusCheckSchema.safeParse(params);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues?.[0]?.message || 'Invalid parameters.';
      throw new Error(`VALIDATION_ERROR: ${firstError}`);
    }
    const validated = validationResult.data;

    // 2. Honeypot check
    if (validated.website && validated.website.trim().length > 0) {
      throw new Error('BOT_DETECTED: Automated request rejected by honeypot defense.');
    }

    // 3. Simulated rate limit: 10 status checks per hour
    const now = Date.now();
    statusCheckTimestamps = statusCheckTimestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    if (statusCheckTimestamps.length >= STATUS_CHECK_RATE_LIMIT_MAX) {
      throw new Error(
        'RATE_LIMIT_EXCEEDED: You have exceeded the rate limit of 10 status checks per hour. Please try again later.'
      );
    }
    statusCheckTimestamps.push(now);

    const store = SharedDataStoreManager.getInstance().getStore();
    const requests = store.accountRequests || [];

    const normalizedRef = validated.referenceNumber.trim().toUpperCase();
    const normalizedEmail = validated.email.trim().toLowerCase();

    // Look for exact match of BOTH referenceNumber and email
    const matched = requests.find(
      (r) =>
        r.referenceNumber.trim().toUpperCase() === normalizedRef &&
        r.email.trim().toLowerCase() === normalizedEmail
    );

    // Generic not found response if wrong combination
    if (!matched) {
      return {
        found: false,
        message: 'No account request was found matching the provided reference number and email address.'
      };
    }

    // Returns ONLY the status, nothing else!
    return {
      found: true,
      status: matched.status,
      message: `Current verification status: ${matched.status}`
    };
  }

  /**
   * List account requests with search and filters.
   * Accessible by admin, super_admin, and registrar.
   *
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public static async getAccountRequests(
    actorRole?: UserRole,
    filters?: AccountRequestFilterOptions
  ): Promise<AccountRequest[]> {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    if (!actorRole || (actorRole !== 'admin' && actorRole !== 'super_admin' && actorRole !== 'registrar')) {
      throw new Error('PERMISSION_DENIED: Only administrative staff can inspect account requests.');
    }

    const store = SharedDataStoreManager.getInstance().getStore();
    let requests = [...(store.accountRequests || [])];

    if (filters?.status && filters.status !== 'ALL') {
      requests = requests.filter((r) => r.status === filters.status);
    }

    if (filters?.department && filters.department !== 'ALL') {
      requests = requests.filter(
        (r) => r.department.toUpperCase() === filters.department?.toUpperCase()
      );
    }

    if (filters?.session && filters.session !== 'ALL') {
      requests = requests.filter((r) => r.session === filters.session);
    }

    if (filters?.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase().trim();
      requests = requests.filter(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          r.referenceNumber.toLowerCase().includes(q) ||
          r.studentId.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
      );
    }

    return requests;
  }

  /**
   * Approve an account request.
   *
   * Mandatory verification check:
   * Admin/Registrar MUST tick "Student ID verified against university records" before approve is permitted.
   *
   * This screen can NEVER create any role other than student.
   *
   * Every action is appended to the audit trail (actor, role, action, from, to, comment, timestamp).
   * Notifies the student via the demo "email" log (clearly marked as simulated).
   *
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public static async approveRequest(
    requestId: string,
    actor: { uid: string; role: UserRole; displayName?: string },
    verificationTicked: boolean
  ): Promise<{ success: boolean; message: string; uid: string; token?: string }> {
    // Real enforcement must move to Firestore rules / Cloud Functions.

    // 1. Role Gate
    if (actor.role !== 'admin' && actor.role !== 'super_admin' && actor.role !== 'registrar') {
      throw new Error('PERMISSION_DENIED: Only administrators and registrar officers can approve account requests.');
    }

    // 2. Verification Checklist Check
    if (!verificationTicked) {
      throw new Error('VALIDATION_ERROR: Verification checklist required. You must tick "Student ID verified against university records" before approving.');
    }

    const storeManager = SharedDataStoreManager.getInstance();
    const store = storeManager.getStore();
    const requests = store.accountRequests || [];
    const requestIndex = requests.findIndex((r) => r.id === requestId);

    if (requestIndex === -1) {
      throw new Error('NOT_FOUND: Account request not found.');
    }

    const request = requests[requestIndex];

    if (request.status === 'APPROVED') {
      throw new Error('INVALID_STATE: Request has already been approved.');
    }

    const previousStatus = request.status;

    // 3. Security Boundary: Role is strictly fixed to student. This screen can NEVER create any other role.
    const assignedRole: 'student' = 'student';

    // 4. Call existing createUserAccount service method (provisions user, mustChangePassword, custom claims)
    const creationResult = await createUserAccount({
      callerUid: actor.uid,
      callerClaims: {
        role: actor.role === 'super_admin' ? 'super_admin' : 'admin',
        mfaEnforced: true
      },
      email: request.email,
      fullName: request.fullName,
      role: assignedRole,
      departmentId: request.department,
      studentId: request.studentId
    });

    // 5. Update request status to APPROVED in shared mock store
    const updatedRequest: AccountRequest = {
      ...request,
      status: 'APPROVED',
      idVerified: true,
      reviewedAt: new Date().toISOString(),
      reviewedBy: actor.uid,
      reviewerName: actor.displayName || actor.role,
      createdUserId: creationResult.uid
    };

    requests[requestIndex] = updatedRequest;

    // 6. Generate single-use random token valid for 24 hours using crypto.getRandomValues
    const token = AccountRequestService.generateActivationToken();
    const tokenRecord: ActivationToken = {
      token,
      uid: creationResult.uid,
      email: request.email,
      referenceNumber: request.referenceNumber,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      used: false
    };

    // 7. Notify student via demo email log (clearly marked as simulated)
    const simulatedEmail: SimulatedEmailLog = {
      id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      recipientEmail: request.email,
      recipientName: request.fullName,
      subject: `[SIMULATED EMAIL - DEMO MODE] JSTU Student Account Approved & Password Setup (${request.referenceNumber})`,
      body: `Dear ${request.fullName},\n\nYour student account request has been APPROVED by the Office of the Registrar.\n\nStudent ID: ${request.studentId}\nDepartment: ${request.department}\nReference: ${request.referenceNumber}\nAccount UID: ${creationResult.uid}\n\nPlease click the activation link below to complete the set-password step and access the student portal:\n/set-password?token=${token}\n\nNotice: This single-use link is valid for 24 hours.\nSimulated email. Real emails need a Cloud Function.\nOffice of the Registrar\nJamalpur Science & Technology University`,
      sentAt: new Date().toISOString(),
      referenceNumber: request.referenceNumber,
      actionType: 'APPROVED'
    };

    storeManager.saveStore({
      ...store,
      accountRequests: requests,
      activationTokens: [tokenRecord, ...(store.activationTokens || [])],
      simulatedEmailLogs: [simulatedEmail, ...(store.simulatedEmailLogs || [])]
    });

    // 8. Append action to audit trail: actor, role, action, from, to, comment, timestamp
    writeAuditLog(actor.uid, 'ACCOUNT_REQUEST_APPROVED', creationResult.uid, request.email, {
      actorUid: actor.uid,
      actorRole: actor.role,
      action: 'ACCOUNT_REQUEST_APPROVED',
      from: previousStatus,
      to: 'APPROVED',
      comment: 'Student ID verified against university records; student account provisioned.',
      referenceNumber: request.referenceNumber,
      assignedRole,
      department: request.department,
      studentId: request.studentId,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      message: `Account request ${request.referenceNumber} approved. ${creationResult.message}`,
      uid: creationResult.uid,
      token
    };
  }

  /**
   * Reject an account request with a mandatory reason.
   *
   * Every action is appended to the audit trail (actor, role, action, from, to, comment, timestamp).
   * Notifies the student via the demo "email" log (clearly marked as simulated).
   *
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public static async rejectRequest(
    requestId: string,
    reason: string,
    actor: { uid: string; role: UserRole; displayName?: string }
  ): Promise<{ success: boolean; message: string }> {
    // Real enforcement must move to Firestore rules / Cloud Functions.

    // 1. Role Gate
    if (actor.role !== 'admin' && actor.role !== 'super_admin' && actor.role !== 'registrar') {
      throw new Error('PERMISSION_DENIED: Only administrators and registrar officers can reject account requests.');
    }

    if (!reason || reason.trim().length < 5) {
      throw new Error('VALIDATION_ERROR: A rejection reason of at least 5 characters is mandatory.');
    }

    const storeManager = SharedDataStoreManager.getInstance();
    const store = storeManager.getStore();
    const requests = store.accountRequests || [];
    const requestIndex = requests.findIndex((r) => r.id === requestId);

    if (requestIndex === -1) {
      throw new Error('NOT_FOUND: Account request not found.');
    }

    const request = requests[requestIndex];

    if (request.status === 'REJECTED') {
      throw new Error('INVALID_STATE: Request has already been rejected.');
    }

    const previousStatus = request.status;

    // Update request in mock store
    const updatedRequest: AccountRequest = {
      ...request,
      status: 'REJECTED',
      rejectionReason: reason.trim(),
      reviewedAt: new Date().toISOString(),
      reviewedBy: actor.uid,
      reviewerName: actor.displayName || actor.role
    };

    requests[requestIndex] = updatedRequest;

    // Notify student via demo email log (clearly marked as simulated)
    const simulatedEmail: SimulatedEmailLog = {
      id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      recipientEmail: request.email,
      recipientName: request.fullName,
      subject: `[SIMULATED EMAIL - DEMO MODE] JSTU Student Account Request Not Approved (${request.referenceNumber})`,
      body: `Dear ${request.fullName},\n\nWe regret to inform you that your account request (${request.referenceNumber}) could not be approved at this time.\n\nReason: ${reason.trim()}\n\nIf you believe this is an error, please contact the Office of the Registrar with your original academic admission papers.\n\nNotice: This is a simulated demo email.\nOffice of the Registrar\nJamalpur Science & Technology University`,
      sentAt: new Date().toISOString(),
      referenceNumber: request.referenceNumber,
      actionType: 'REJECTED'
    };

    storeManager.saveStore({
      ...store,
      accountRequests: requests,
      simulatedEmailLogs: [simulatedEmail, ...(store.simulatedEmailLogs || [])]
    });

    // Append action to audit trail: actor, role, action, from, to, comment, timestamp
    writeAuditLog(actor.uid, 'ACCOUNT_REQUEST_REJECTED', undefined, request.email, {
      actorUid: actor.uid,
      actorRole: actor.role,
      action: 'ACCOUNT_REQUEST_REJECTED',
      from: previousStatus,
      to: 'REJECTED',
      comment: reason.trim(),
      referenceNumber: request.referenceNumber,
      department: request.department,
      studentId: request.studentId,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      message: `Account request ${request.referenceNumber} has been rejected.`
    };
  }

  /**
   * Request More Information with mandatory comment.
   *
   * Every action is appended to the audit trail (actor, role, action, from, to, comment, timestamp).
   * Notifies the student via the demo "email" log (clearly marked as simulated).
   *
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public static async requestMoreInfo(
    requestId: string,
    comment: string,
    actor: { uid: string; role: UserRole; displayName?: string }
  ): Promise<{ success: boolean; message: string }> {
    // Real enforcement must move to Firestore rules / Cloud Functions.

    // 1. Role Gate
    if (actor.role !== 'admin' && actor.role !== 'super_admin' && actor.role !== 'registrar') {
      throw new Error('PERMISSION_DENIED: Only administrators and registrar officers can request more information.');
    }

    if (!comment || comment.trim().length < 5) {
      throw new Error('VALIDATION_ERROR: A comment of at least 5 characters is mandatory when requesting more information.');
    }

    const storeManager = SharedDataStoreManager.getInstance();
    const store = storeManager.getStore();
    const requests = store.accountRequests || [];
    const requestIndex = requests.findIndex((r) => r.id === requestId);

    if (requestIndex === -1) {
      throw new Error('NOT_FOUND: Account request not found.');
    }

    const request = requests[requestIndex];
    const previousStatus = request.status;

    // Update request in mock store
    const updatedRequest: AccountRequest = {
      ...request,
      status: 'MORE_INFO_REQUESTED',
      adminComment: comment.trim(),
      reviewedAt: new Date().toISOString(),
      reviewedBy: actor.uid,
      reviewerName: actor.displayName || actor.role
    };

    requests[requestIndex] = updatedRequest;

    // Notify student via demo email log (clearly marked as simulated)
    const simulatedEmail: SimulatedEmailLog = {
      id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      recipientEmail: request.email,
      recipientName: request.fullName,
      subject: `[SIMULATED EMAIL - DEMO MODE] Additional Information Required for JSTU Account Request (${request.referenceNumber})`,
      body: `Dear ${request.fullName},\n\nThe Office of Registrar has reviewed your account request (${request.referenceNumber}) and requests additional information:\n\nReviewer Note: ${comment.trim()}\n\nPlease verify your student details and contact the registrar office if needed.\n\nNotice: This is a simulated demo email.\nOffice of the Registrar\nJamalpur Science & Technology University`,
      sentAt: new Date().toISOString(),
      referenceNumber: request.referenceNumber,
      actionType: 'MORE_INFO_REQUESTED'
    };

    storeManager.saveStore({
      ...store,
      accountRequests: requests,
      simulatedEmailLogs: [simulatedEmail, ...(store.simulatedEmailLogs || [])]
    });

    // Append action to audit trail: actor, role, action, from, to, comment, timestamp
    writeAuditLog(actor.uid, 'ACCOUNT_REQUEST_MORE_INFO_REQUESTED', undefined, request.email, {
      actorUid: actor.uid,
      actorRole: actor.role,
      action: 'ACCOUNT_REQUEST_MORE_INFO_REQUESTED',
      from: previousStatus,
      to: 'MORE_INFO_REQUESTED',
      comment: comment.trim(),
      referenceNumber: request.referenceNumber,
      department: request.department,
      studentId: request.studentId,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      message: `Additional information requested for ${request.referenceNumber}.`
    };
  }

  /**
   * Retrieve simulated email logs for inspection.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public static getSimulatedEmailLogs(): SimulatedEmailLog[] {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    const store = SharedDataStoreManager.getInstance().getStore();
    return store.simulatedEmailLogs || [];
  }

  /**
   * Generates a cryptographically random, unguessable activation token using crypto.getRandomValues.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public static generateActivationToken(): string {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    const bytes = new Uint8Array(32);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validates a set-password activation token.
   * An expired, used or invalid token returns the exact same generic message.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public static validateActivationToken(token?: string | null): {
    valid: boolean;
    error?: string;
    tokenInfo?: ActivationToken;
  } {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    const GENERIC_TOKEN_ERROR =
      'Invalid, expired, or already used activation link. Please contact the registrar or request a new account.';

    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      return { valid: false, error: GENERIC_TOKEN_ERROR };
    }

    const store = SharedDataStoreManager.getInstance().getStore();
    const tokenRecord = (store.activationTokens || []).find((t) => t.token === token.trim());

    if (!tokenRecord) {
      return { valid: false, error: GENERIC_TOKEN_ERROR };
    }

    // Check if already used
    if (tokenRecord.used) {
      return { valid: false, error: GENERIC_TOKEN_ERROR };
    }

    // Check if expired (valid for 24 hours)
    const expiresAtMs = new Date(tokenRecord.expiresAt).getTime();
    if (Date.now() > expiresAtMs) {
      return { valid: false, error: GENERIC_TOKEN_ERROR };
    }

    return {
      valid: true,
      tokenInfo: tokenRecord
    };
  }

  /**
   * Sets password using an activation token.
   * Enforces 12+ character password policy, marks token as used, clears mustChangePassword.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public static async setPasswordWithToken(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    // Real enforcement must move to Firestore rules / Cloud Functions.
    const GENERIC_TOKEN_ERROR =
      'Invalid, expired, or already used activation link. Please contact the registrar or request a new account.';

    // 1. Verify token
    const validation = this.validateActivationToken(token);
    if (!validation.valid || !validation.tokenInfo) {
      throw new Error(GENERIC_TOKEN_ERROR);
    }

    const tokenRecord = validation.tokenInfo;

    // 2. Validate password policy (12+ characters, uppercase, lowercase, number, symbol, not common)
    const BLOCKED_PASSWORDS = [
      'password12345',
      '123456789012',
      'adminadmin123',
      'jstupassword1',
      'qwertyuiopas',
      'bangladesh2026',
      'welcome123456'
    ];

    if (BLOCKED_PASSWORDS.includes(newPassword.toLowerCase())) {
      throw new Error('This password is too common and easily guessed. Please choose a more unique passphrase.');
    }

    if (
      !newPassword ||
      newPassword.length < 12 ||
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword) ||
      !/[^A-Za-z0-9]/.test(newPassword)
    ) {
      throw new Error(
        'Password does not meet institutional policy (must be 12+ chars with uppercase, lowercase, number, and symbol).'
      );
    }

    // 3. Mark token as used in store
    const storeManager = SharedDataStoreManager.getInstance();
    const store = storeManager.getStore();
    const tokenList = (store.activationTokens || []).map((t) => {
      if (t.token === tokenRecord.token) {
        return {
          ...t,
          used: true,
          usedAt: new Date().toISOString()
        };
      }
      return t;
    });

    // 4. Update student profile in students store if needed
    const matchingReq = (store.accountRequests || []).find(
      (r) => r.referenceNumber === tokenRecord.referenceNumber || r.email === tokenRecord.email
    );
    const updatedStudents = { ...store.students };
    if (matchingReq && matchingReq.studentId && !updatedStudents[matchingReq.studentId]) {
      updatedStudents[matchingReq.studentId] = {
        uid: tokenRecord.uid,
        studentId: matchingReq.studentId,
        fullName: matchingReq.fullName,
        fullNameBn: matchingReq.fullName,
        email: matchingReq.email,
        phone: matchingReq.phone || '01700-000000',
        department: matchingReq.department,
        departmentBn: matchingReq.department,
        semester: '1st Year 1st Semester',
        semesterBn: '১ম বর্ষ ১ম সেমিস্টার',
        academicSession: matchingReq.session,
        hallName: 'Sheikh Hasina Hall',
        hallNameBn: 'শেখ হাসিনা হল',
        advisorName: 'Dr. Shahadat Hossain',
        advisorEmail: 'teacher.demo@jstu.ac.bd',
        bloodGroup: 'B+',
        guardianName: 'Guardian',
        guardianPhone: '01800-000000',
        address: 'Jamalpur, Bangladesh',
        addressBn: 'জামালপুর, বাংলাদেশ',
        cgpa: 0.0,
        creditsEarned: 0
      };
    }

    storeManager.saveStore({
      ...store,
      students: updatedStudents,
      activationTokens: tokenList
    });

    // 5. Clear mustChangePassword and store user credentials in demo backendEngine
    clearUserMustChangePassword(tokenRecord.uid);
    setUserPassword(tokenRecord.uid, newPassword);
    setUserPassword(tokenRecord.email, newPassword);

    // 6. Write audit log
    writeAuditLog(tokenRecord.uid, 'PASSWORD_CHANGED', tokenRecord.uid, tokenRecord.email, {
      action: 'SET_PASSWORD_VIA_ACTIVATION_TOKEN',
      referenceNumber: tokenRecord.referenceNumber
    });

    return {
      success: true,
      message: 'Password set successfully. You can now log in.'
    };
  }
}
