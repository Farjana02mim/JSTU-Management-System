/**
 * JSTU Smart Campus — Marks Lifecycle State Machine Types & Error Definitions
 * 
 * Compliant with JSTU Academic Ordinance and Examination Regulations.
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */

export type MarksSheetStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'VERIFIED'
  | 'PUBLISHED'
  | 'RETURNED_TO_TEACHER';

export type MarksLifecycleAction =
  | 'SUBMIT'
  | 'VERIFY'
  | 'RETURN_TO_TEACHER'
  | 'PUBLISH'
  | 'RETURN_TO_CHAIRMAN'
  | 'REQUEST_CORRECTION'
  | 'APPROVE_CORRECTION'
  | 'REJECT_CORRECTION';

export interface MarksLifecycleActor {
  uid: string;
  email: string;
  fullName?: string;
  fullNameBn?: string;
  role: 'teacher' | 'dept_chairman' | 'exam_controller' | 'super_admin' | string;
  departmentId?: string;
  officeId?: string;
}

export interface MarksCorrectionRequest {
  id: string;
  versionNumber: number;
  resultSheetId: string;
  courseCode: string;
  studentId: string;
  studentName?: string;
  field: 'attendance' | 'classTests' | 'midterm' | 'finalExam' | 'total';
  originalValue: number;
  newValue: number;
  reason: string;
  requesterUid: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: 'teacher' | 'dept_chairman';
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approverUid?: string;
  approverName?: string;
  approverEmail?: string;
  approverRole?: string;
  reviewedAt?: string;
  reviewComment?: string;
}

export interface MarksSheetVersionSnapshot {
  versionNumber: number;
  createdAt: string;
  createdReason: string;
  entries: Record<string, import('../shared/sharedDataStore').StudentMarksRecord>;
  correctionRequestId?: string;
  approvedBy?: string;
}

export interface MarksAuditEntry {
  id: string;
  resultSheetId: string;
  courseCode: string;
  actorUid: string;
  actorName: string;
  actorEmail: string;
  role: string;
  action: MarksLifecycleAction;
  fromStatus: MarksSheetStatus;
  toStatus: MarksSheetStatus;
  comment?: string;
  timestamp: string;
}

export interface MarksAnomaly {
  type: 'marks_ceiling' | 'total_mismatch' | 'high_failure_rate' | 'missing_entry';
  severity: 'error' | 'warning';
  studentId?: string;
  studentName?: string;
  field?: string;
  message: string;
  messageBn?: string;
  details?: Record<string, unknown>;
}

export interface MarksTransitionResult {
  success: boolean;
  previousStatus: MarksSheetStatus;
  newStatus: MarksSheetStatus;
  courseCode: string;
  auditEntry: MarksAuditEntry;
  anomalies: MarksAnomaly[];
  message: string;
}

/**
 * Thrown when an actor does not have authorization, department scope,
 * course assignment, or attempts an illegal action for their role.
 */
export class MarksLifecyclePermissionError extends Error {
  public code = 'PERMISSION_DENIED';
  constructor(message: string) {
    super(message);
    this.name = 'MarksLifecyclePermissionError';
    Object.setPrototypeOf(this, MarksLifecyclePermissionError.prototype);
  }
}

/**
 * Thrown when validation rules fail (e.g. missing mandatory comment, invalid status transition).
 */
export class MarksLifecycleValidationError extends Error {
  public code = 'VALIDATION_FAILED';
  constructor(message: string) {
    super(message);
    this.name = 'MarksLifecycleValidationError';
    Object.setPrototypeOf(this, MarksLifecycleValidationError.prototype);
  }
}
