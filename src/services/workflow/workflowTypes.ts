/**
 * JSTU Smart Campus — Paperless Application Workflow Types & Error Definitions
 * 
 * Compliant with JSTU Administrative Ordinance and Examination Regulations.
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */

import type { ApplicationType, ApplicationStatus, ApproverRole, WorkflowStepConfig } from '../../config/workflows';
export type { ApplicationType, ApplicationStatus, ApproverRole, WorkflowStepConfig };

export type WorkflowAction =
  | 'SUBMIT'
  | 'APPROVE'
  | 'REJECT'
  | 'RETURN_FOR_CORRECTION'
  | 'RESUBMIT';

export interface WorkflowActor {
  uid: string;
  email: string;
  fullName: string;
  fullNameBn?: string;
  role: 'student' | 'dept_chairman' | 'exam_controller' | 'registrar' | 'super_admin' | string;
  departmentId?: string;
  officeId?: string;
  studentId?: string;
}

export interface ApplicationAttachment {
  name: string;
  size: number;
  type: string;
  dataUrl?: string; // Simulated base64 data for demo mode
  uploadedAt: string;
}

export interface ApplicationAuditEntry {
  id: string;
  applicationId: string;
  applicationNumber: string;
  actorUid: string;
  actorName: string;
  actorEmail: string;
  role: string;
  action: WorkflowAction;
  fromStatus: ApplicationStatus;
  toStatus: ApplicationStatus;
  fromStepIndex: number;
  toStepIndex: number;
  comment?: string;
  timestamp: string;
}

export interface PaperlessApplication {
  id: string;
  applicationNumber: string; // Format: JSTU-APP-YYYY-XXXXXX
  type: ApplicationType;
  title: string;
  titleBn: string;
  
  // Student metadata
  studentUid: string;
  studentId: string;
  studentName: string;
  studentNameBn?: string;
  studentEmail: string;
  studentDepartment: string;
  
  // Workflow chain & progress
  status: ApplicationStatus;
  currentStepIndex: number; // 0-indexed into chain. Terminal status stops progression.
  chain: WorkflowStepConfig[];
  
  // Form payload & files
  formData: Record<string, any>;
  attachment?: ApplicationAttachment;
  
  // Correction tracking
  returnComment?: string;
  rejectionReason?: string;
  
  // Timestamps & Audit
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  auditTrail: ApplicationAuditEntry[];
}

export interface ApplicationTransitionResult {
  success: boolean;
  application: PaperlessApplication;
  previousStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  auditEntry: ApplicationAuditEntry;
  message: string;
}

/**
 * Thrown when an actor does not have authorization, department scope,
 * or is attempting an out-of-turn approval/rejection.
 */
export class WorkflowPermissionError extends Error {
  public code = 'PERMISSION_DENIED';
  constructor(message: string) {
    super(message);
    this.name = 'WorkflowPermissionError';
    Object.setPrototypeOf(this, WorkflowPermissionError.prototype);
  }
}

/**
 * Thrown when validation rules fail (e.g. missing mandatory comment, invalid status transition).
 */
export class WorkflowValidationError extends Error {
  public code = 'VALIDATION_FAILED';
  constructor(message: string) {
    super(message);
    this.name = 'WorkflowValidationError';
    Object.setPrototypeOf(this, WorkflowValidationError.prototype);
  }
}
