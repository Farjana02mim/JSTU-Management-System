/**
 * JSTU Smart Campus — Paperless Application Workflow State Machine Service
 * 
 * Enforces rigid state machine transitions, approval chains, role authorization,
 * and department scopes.
 * Append-only audit trail logging for all transitions.
 * 
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */

import {
  ApplicationType,
  ApplicationStatus,
  WORKFLOW_CONFIGS,
  WorkflowDefinition
} from '../../config/workflows';
import {
  PaperlessApplication,
  WorkflowAction,
  WorkflowActor,
  ApplicationAuditEntry,
  ApplicationTransitionResult,
  ApplicationAttachment,
  WorkflowPermissionError,
  WorkflowValidationError
} from './workflowTypes';
import { SharedDataStoreManager } from '../shared/sharedDataStore';

export class ApplicationWorkflowService {
  private static instance: ApplicationWorkflowService | null = null;
  private storeManager: SharedDataStoreManager;

  constructor() {
    this.storeManager = SharedDataStoreManager.getInstance();
  }

  public static getInstance(): ApplicationWorkflowService {
    if (!ApplicationWorkflowService.instance) {
      ApplicationWorkflowService.instance = new ApplicationWorkflowService();
    }
    return ApplicationWorkflowService.instance;
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public generateApplicationNumber(): string {
    const year = new Date().getFullYear();
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    return `JSTU-APP-${year}-${randomHex}`;
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async getApplication(applicationIdOrNumber: string): Promise<PaperlessApplication> {
    const store = this.storeManager.getStore();
    const app = store.applications.find(
      (a) =>
        a.id.toLowerCase() === applicationIdOrNumber.toLowerCase() ||
        a.applicationNumber.toLowerCase() === applicationIdOrNumber.toLowerCase()
    );

    if (!app) {
      throw new Error(`Application "${applicationIdOrNumber}" not found in institutional records.`);
    }

    if (!app.auditTrail) {
      app.auditTrail = [];
    }

    return app;
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async getStudentApplications(studentIdOrUid: string): Promise<PaperlessApplication[]> {
    const store = this.storeManager.getStore();
    return store.applications.filter(
      (a) =>
        a.studentId.toLowerCase() === studentIdOrUid.toLowerCase() ||
        a.studentUid.toLowerCase() === studentIdOrUid.toLowerCase()
    );
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async getApproverInbox(
    actor: WorkflowActor,
    statusFilter: string = 'PENDING'
  ): Promise<PaperlessApplication[]> {
    const store = this.storeManager.getStore();
    const apps = store.applications;

    return apps.filter((app) => {
      // Terminal states
      if (statusFilter === 'PENDING') {
        if (app.status === 'APPROVED' || app.status === 'REJECTED' || app.status === 'DRAFT') {
          return false;
        }

        const currentStep = app.chain[app.currentStepIndex];
        if (!currentStep) return false;

        // Role check
        if (actor.role !== currentStep.role && actor.role !== 'super_admin') {
          return false;
        }

        // Scope check for Chairman
        if (currentStep.departmentScoped) {
          const actorDept = (actor.departmentId || '').toUpperCase();
          const appDept = (app.studentDepartment || '').toUpperCase();
          if (actorDept !== appDept && actor.role !== 'super_admin') {
            return false;
          }
        }

        return true;
      }

      if (statusFilter === 'all') {
        return true;
      }

      return app.status.toLowerCase() === statusFilter.toLowerCase();
    });
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async getApproverCounts(actor: WorkflowActor): Promise<{
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    returnedCount: number;
  }> {
    const store = this.storeManager.getStore();
    const apps = store.applications;

    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;
    let returnedCount = 0;

    for (const app of apps) {
      // Check if actor has ever acted on it or is currently the step
      const currentStep = app.chain[app.currentStepIndex];
      const isCurrentStepApprover =
        currentStep &&
        (actor.role === currentStep.role || actor.role === 'super_admin') &&
        (!currentStep.departmentScoped ||
          (actor.departmentId || '').toUpperCase() === (app.studentDepartment || '').toUpperCase() ||
          actor.role === 'super_admin');

      if (app.status === 'UNDER_REVIEW' && isCurrentStepApprover) {
        pendingCount++;
      }

      // Check audit entries by this actor role
      const hasAudited = app.auditTrail.some(
        (entry) => entry.actorUid === actor.uid || entry.role === actor.role
      );
      if (hasAudited) {
        if (app.status === 'APPROVED') approvedCount++;
        if (app.status === 'REJECTED') rejectedCount++;
        if (app.status === 'RETURNED_FOR_CORRECTION') returnedCount++;
      }
    }

    return { pendingCount, approvedCount, rejectedCount, returnedCount };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async submitApplication(
    type: ApplicationType,
    formData: Record<string, any>,
    actor: WorkflowActor,
    attachment?: ApplicationAttachment
  ): Promise<PaperlessApplication> {
    const config = WORKFLOW_CONFIGS[type];
    if (!config) {
      throw new WorkflowValidationError(`Invalid application type "${type}".`);
    }

    if (actor.role !== 'student' && actor.role !== 'super_admin') {
      throw new WorkflowPermissionError('Only enrolled students can initiate paperless applications.');
    }

    // Attachment validation if required
    if (config.attachmentRequired && !attachment) {
      throw new WorkflowValidationError(
        `Supporting PDF attachment is mandatory for ${config.title}.`
      );
    }

    if (attachment) {
      if (attachment.size > (config.maxAttachmentSizeBytes || 5 * 1024 * 1024)) {
        throw new WorkflowValidationError(
          `Attachment size exceeds maximum limit of ${(config.maxAttachmentSizeBytes || 5 * 1024 * 1024) / (1024 * 1024)}MB.`
        );
      }
    }

    const store = this.storeManager.getStore();
    const appNumber = this.generateApplicationNumber();
    const appId = `app-${type}-${Date.now()}`;

    const newApp: PaperlessApplication = {
      id: appId,
      applicationNumber: appNumber,
      type,
      title: config.title,
      titleBn: config.titleBn,
      studentUid: actor.uid,
      studentId: actor.studentId || 'JSTU2026001',
      studentName: actor.fullName,
      studentNameBn: actor.fullNameBn,
      studentEmail: actor.email,
      studentDepartment: actor.departmentId || 'CSE',
      status: 'UNDER_REVIEW',
      currentStepIndex: 0,
      chain: config.chain,
      formData,
      attachment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditTrail: [
        {
          id: `audit-sub-${Date.now()}`,
          applicationId: appId,
          applicationNumber: appNumber,
          actorUid: actor.uid,
          actorName: actor.fullName,
          actorEmail: actor.email,
          role: actor.role,
          action: 'SUBMIT',
          fromStatus: 'DRAFT',
          toStatus: 'UNDER_REVIEW',
          fromStepIndex: 0,
          toStepIndex: 0,
          comment: 'Application submitted for official departmental processing.',
          timestamp: new Date().toISOString()
        }
      ]
    };

    store.applications.unshift(newApp);

    // Notify next approver (Step 0)
    const firstStep = config.chain[0];
    if (firstStep.role === 'dept_chairman') {
      store.teacherNotifications.unshift({
        id: `notif-app-${Date.now()}`,
        title: `New Application Received: ${config.title}`,
        titleBn: `নতুন আবেদন জমা পড়েছে: ${config.titleBn}`,
        message: `${actor.fullName} (${actor.studentId || 'JSTU2026001'}) submitted ${config.title} (${appNumber}). Awaiting your scrutiny.`,
        messageBn: `${actor.fullName} কর্তৃক ${config.titleBn} (${appNumber}) জমা দেওয়া হয়েছে। আপনার সিদ্ধান্তের অপেক্ষায়।`,
        category: 'academic',
        timestamp: new Date().toISOString(),
        read: false,
        link: '/chairman'
      });
    }

    this.storeManager.saveStore(store);
    return newApp;
  }

  /**
   * The State Machine Transition method.
   * transition(applicationId, action, actor, comment?)
   * 
   * Strict enforcement of:
   * 1. Actor role
   * 2. Department scope
   * 3. Current step in the chain
   * 4. No self-approval (student cannot approve own application)
   * 5. Terminal states immutability (APPROVED, REJECTED)
   * 6. Mandatory reason on REJECT and RETURN_FOR_CORRECTION
   * 
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public async transition(
    applicationId: string,
    action: WorkflowAction,
    actor: WorkflowActor,
    comment?: string
  ): Promise<ApplicationTransitionResult> {
    const store = this.storeManager.getStore();
    const app = store.applications.find(
      (a) =>
        a.id.toLowerCase() === applicationId.toLowerCase() ||
        a.applicationNumber.toLowerCase() === applicationId.toLowerCase()
    );

    if (!app) {
      throw new Error(`Application "${applicationId}" not found in system.`);
    }

    const prevStatus = app.status;
    const prevStepIndex = app.currentStepIndex;

    // RULE 1: Terminal states are immutable
    if (prevStatus === 'APPROVED' || prevStatus === 'REJECTED') {
      throw new WorkflowPermissionError(
        `Application ${app.applicationNumber} is in terminal state "${prevStatus}". Further actions are strictly prohibited.`
      );
    }

    // RULE 2: No self-approval (Student cannot approve or reject own application)
    if (
      (action === 'APPROVE' || action === 'REJECT' || action === 'RETURN_FOR_CORRECTION') &&
      (actor.uid === app.studentUid || actor.email.toLowerCase() === app.studentEmail.toLowerCase())
    ) {
      throw new WorkflowPermissionError(
        'Self-action prohibited: Students cannot approve, reject, or return their own applications.'
      );
    }

    let nextStatus: ApplicationStatus = prevStatus;
    let nextStepIndex = prevStepIndex;

    switch (action) {
      case 'APPROVE': {
        // Must be in UNDER_REVIEW
        if (prevStatus !== 'UNDER_REVIEW') {
          throw new WorkflowValidationError(
            `Illegal State Transition: Cannot APPROVE application in status "${prevStatus}". Expected "UNDER_REVIEW".`
          );
        }

        const currentStep = app.chain[prevStepIndex];
        if (!currentStep) {
          throw new WorkflowValidationError('Workflow chain has no current active step.');
        }

        // Role verification
        if (actor.role !== currentStep.role && actor.role !== 'super_admin') {
          throw new WorkflowPermissionError(
            `Unauthorized approver: Current step requires "${currentStep.role}". User role "${actor.role}" is denied.`
          );
        }

        // Scope verification (e.g. Chairman department match)
        if (currentStep.departmentScoped && actor.role !== 'super_admin') {
          const actorDept = (actor.departmentId || '').toUpperCase();
          const appDept = (app.studentDepartment || '').toUpperCase();
          if (actorDept !== appDept) {
            throw new WorkflowPermissionError(
              `Department Scope Violation: Chairman of department "${actorDept}" cannot act on applications from "${appDept}".`
            );
          }
        }

        // Advance to next step or reach APPROVED terminal state
        if (prevStepIndex + 1 >= app.chain.length) {
          nextStatus = 'APPROVED';
          nextStepIndex = app.chain.length; // finished
          app.completedAt = new Date().toISOString();

          // Notify student of final approval
          store.studentNotifications.unshift({
            id: `s-notif-app-appr-${Date.now()}`,
            title: `Application Approved: ${app.title}`,
            titleBn: `আবেদন অনুমোদিত: ${app.titleBn}`,
            message: `Your application (${app.applicationNumber}) has completed all approval stages and is fully APPROVED.`,
            messageBn: `আপনার আবেদনটি (${app.applicationNumber}) সকল পর্যায় অতিক্রম করে চূড়ান্তভাবে অনুমোদিত হয়েছে।`,
            category: 'academic',
            timestamp: new Date().toISOString(),
            read: false,
            link: '/student/applications'
          });
        } else {
          nextStepIndex = prevStepIndex + 1;
          nextStatus = 'UNDER_REVIEW';

          // Notify next step approver
          const nextStep = app.chain[nextStepIndex];
          store.studentNotifications.unshift({
            id: `s-notif-app-step-${Date.now()}`,
            title: `Application Endorsed: ${app.title}`,
            titleBn: `আবেদন পরবর্তী ধাপে প্রেরিত: ${app.titleBn}`,
            message: `${currentStep.title} has endorsed your application (${app.applicationNumber}). Forwarded to ${nextStep.title}.`,
            messageBn: `${currentStep.titleBn} আপনার আবেদনটি (${app.applicationNumber}) অনুমোদন করেছেন এবং ${nextStep.titleBn}-এর নিকট প্রেরণ করেছেন।`,
            category: 'academic',
            timestamp: new Date().toISOString(),
            read: false,
            link: '/student/applications'
          });
        }
        break;
      }

      case 'REJECT': {
        // Mandatory reason check
        if (!comment || comment.trim().length < 5) {
          throw new WorkflowValidationError(
            'Mandatory Rejection Reason: A clear explanation (minimum 5 characters) must be provided when rejecting an application.'
          );
        }

        const currentStep = app.chain[prevStepIndex];
        if (!currentStep) {
          throw new WorkflowValidationError('No active step to reject.');
        }

        if (actor.role !== currentStep.role && actor.role !== 'super_admin') {
          throw new WorkflowPermissionError(
            `Unauthorized: Only the current step approver (${currentStep.role}) can reject. User role "${actor.role}" is denied.`
          );
        }

        if (currentStep.departmentScoped && actor.role !== 'super_admin') {
          const actorDept = (actor.departmentId || '').toUpperCase();
          const appDept = (app.studentDepartment || '').toUpperCase();
          if (actorDept !== appDept) {
            throw new WorkflowPermissionError(
              `Department Scope Violation: Chairman of "${actorDept}" cannot reject applications from "${appDept}".`
            );
          }
        }

        nextStatus = 'REJECTED';
        app.rejectionReason = comment.trim();
        app.completedAt = new Date().toISOString();

        // Notify student of rejection
        store.studentNotifications.unshift({
          id: `s-notif-app-rej-${Date.now()}`,
          title: `Application Rejected: ${app.title}`,
          titleBn: `আবেদন প্রত্যাখ্যাত: ${app.titleBn}`,
          message: `Your application (${app.applicationNumber}) was rejected by ${currentStep.title}. Reason: "${comment.trim()}"`,
          messageBn: `আপনার আবেদনটি (${app.applicationNumber}) ${currentStep.titleBn} কর্তৃক বাতিল করা হয়েছে। কারণ: "${comment.trim()}"`,
          category: 'academic',
          timestamp: new Date().toISOString(),
          read: false,
          link: '/student/applications'
        });
        break;
      }

      case 'RETURN_FOR_CORRECTION': {
        // Mandatory comment check
        if (!comment || comment.trim().length < 5) {
          throw new WorkflowValidationError(
            'Mandatory Review Note: A clear explanation (minimum 5 characters) is required when returning an application for correction.'
          );
        }

        const currentStep = app.chain[prevStepIndex];
        if (!currentStep) {
          throw new WorkflowValidationError('No active step to return.');
        }

        if (actor.role !== currentStep.role && actor.role !== 'super_admin') {
          throw new WorkflowPermissionError(
            `Unauthorized: Only the current step approver (${currentStep.role}) can return for correction.`
          );
        }

        if (currentStep.departmentScoped && actor.role !== 'super_admin') {
          const actorDept = (actor.departmentId || '').toUpperCase();
          const appDept = (app.studentDepartment || '').toUpperCase();
          if (actorDept !== appDept) {
            throw new WorkflowPermissionError(
              `Department Scope Violation: Chairman of "${actorDept}" cannot return applications from "${appDept}".`
            );
          }
        }

        nextStatus = 'RETURNED_FOR_CORRECTION';
        app.returnComment = comment.trim();

        // Notify student of return
        store.studentNotifications.unshift({
          id: `s-notif-app-ret-${Date.now()}`,
          title: `Application Returned for Correction: ${app.title}`,
          titleBn: `আবেদন সংশোধনের জন্য ফেরত: ${app.titleBn}`,
          message: `${currentStep.title} returned application (${app.applicationNumber}). Review note: "${comment.trim()}". Please revise and resubmit.`,
          messageBn: `${currentStep.titleBn} আপনার আবেদনটি (${app.applicationNumber}) ফেরত পাঠিয়েছেন। মন্তব্য: "${comment.trim()}"। সংশোধন করে পুনরায় জমা দিন।`,
          category: 'academic',
          timestamp: new Date().toISOString(),
          read: false,
          link: '/student/applications'
        });
        break;
      }

      case 'RESUBMIT': {
        // Only student owner can resubmit from RETURNED_FOR_CORRECTION
        if (actor.uid !== app.studentUid && actor.role !== 'super_admin') {
          throw new WorkflowPermissionError(
            'Unauthorized: Only the applicant student can resubmit this application.'
          );
        }

        if (prevStatus !== 'RETURNED_FOR_CORRECTION') {
          throw new WorkflowValidationError(
            `Illegal State Transition: Cannot RESUBMIT application in status "${prevStatus}". Expected "RETURNED_FOR_CORRECTION".`
          );
        }

        nextStatus = 'UNDER_REVIEW';
        app.returnComment = undefined;

        // Notify current step approver that corrections are completed
        const currentStep = app.chain[prevStepIndex];
        if (currentStep.role === 'dept_chairman') {
          store.teacherNotifications.unshift({
            id: `notif-app-resub-${Date.now()}`,
            title: `Application Resubmitted: ${app.title}`,
            titleBn: `আবেদন পুনরায় দাখিল: ${app.titleBn}`,
            message: `${actor.fullName} resubmitted ${app.title} (${app.applicationNumber}) after making corrections.`,
            messageBn: `${actor.fullName} সংশোধন শেষে ${app.titleBn} (${app.applicationNumber}) পুনরায় জমা দিয়েছেন।`,
            category: 'academic',
            timestamp: new Date().toISOString(),
            read: false,
            link: '/chairman'
          });
        }
        break;
      }

      default:
        throw new WorkflowValidationError(`Unrecognized action "${action}".`);
    }

    // Apply state change
    app.status = nextStatus;
    app.currentStepIndex = nextStepIndex;
    app.updatedAt = new Date().toISOString();

    // Append-only audit trail
    const auditEntry: ApplicationAuditEntry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      applicationId: app.id,
      applicationNumber: app.applicationNumber,
      actorUid: actor.uid,
      actorName: actor.fullName,
      actorEmail: actor.email,
      role: actor.role,
      action,
      fromStatus: prevStatus,
      toStatus: nextStatus,
      fromStepIndex: prevStepIndex,
      toStepIndex: nextStepIndex,
      comment: comment?.trim() || undefined,
      timestamp: new Date().toISOString()
    };

    app.auditTrail.push(auditEntry);

    this.storeManager.saveStore(store);

    return {
      success: true,
      application: app,
      previousStatus: prevStatus,
      newStatus: nextStatus,
      auditEntry,
      message: `Successfully executed ${action} on ${app.applicationNumber}. Status: ${nextStatus}.`
    };
  }
}

let workflowServiceInstance: ApplicationWorkflowService | null = null;
export function getApplicationWorkflowService(): ApplicationWorkflowService {
  if (!workflowServiceInstance) {
    workflowServiceInstance = new ApplicationWorkflowService();
  }
  return workflowServiceInstance;
}
