/**
 * JSTU Smart Campus — Digital Document & Cryptographic Ledger Types
 * 
 * Compliant with JSTU Academic Regulations and Public Verification Standards.
 * Real enforcement must move to Firestore rules / Cloud Functions.
 * 
 * Security Note:
 * No signing secret may exist in client code. In demo mode, integrity relies on the
 * tamper-evident SHA-256 hash and the university digital registry ledger.
 * In production, real digital signing must be performed server-side
 * (Cloud Function with an asymmetric private key stored in Cloud KMS / Secret Manager),
 * and the registry must live in Firestore with rules that expose only minimal verification fields publicly.
 */

import { ApplicationType } from '../../config/workflows';

export type DocumentType =
  | 'transcript'
  | 'certificate'
  | 'testimonial'
  | 'approval_letter';

export type DocumentStatus = 'VALID' | 'REVOKED';

export interface CanonicalDocumentPayload {
  verificationId: string;
  documentType: DocumentType;
  applicationNumber: string;
  studentId: string;
  studentName: string;
  department: string;
  issueDate: string;
  summaryData: Record<string, any>;
}

export interface DigitalDocument {
  id: string; // Internal ID, e.g. doc-123
  verificationId: string; // Unguessable 128-bit random hex/uuid token (crypto.getRandomValues)
  applicationId: string;
  applicationNumber: string;
  documentType: DocumentType;
  title: string;
  titleBn: string;

  // Student info
  studentUid: string;
  studentId: string;
  studentName: string;
  studentNameBn?: string;
  studentDepartment: string;
  program: string;

  // Cryptographic & Integrity Metadata
  canonicalHash: string; // SHA-256 hex string
  canonicalPayload: CanonicalDocumentPayload;
  verificationUrl: string;

  // Issuance Metadata
  issueDate: string; // ISO date string
  issuerRole: string;
  issuerUid: string;
  issuerName: string;

  // Revocation Metadata
  status: DocumentStatus;
  revokedAt?: string;
  revokedBy?: string;
  revokedByName?: string;
  revocationReason?: string;

  // Published Results Snapshot (for transcript)
  transcriptSnapshot?: {
    cgpa: number;
    totalEarnedCredits: number;
    semesters: {
      semesterNumber: number;
      semesterName: string;
      sgpa: number;
      earnedCredits: number;
      courses: {
        code: string;
        title: string;
        credits: number;
        marks?: number;
        letterGrade: string;
        gradePoint: number;
      }[];
    }[];
  };

  // Specific content snapshot (for certificates, testimonials, approval letters)
  contentPayload: Record<string, any>;

  createdAt: string;
  updatedAt: string;
}

/**
 * Publicly exposed verification data.
 * STRICT SECURITY REQUIREMENT:
 * Never expose student ID, CGPA, marks, contact info or sensitive metadata.
 */
export interface PublicVerificationResult {
  status: 'VALID' | 'REVOKED' | 'NOT_FOUND';
  verificationId?: string;
  documentType?: DocumentType;
  documentTitle?: string;
  documentTitleBn?: string;
  maskedStudentName?: string; // e.g. "T****r A***d"
  department?: string;
  program?: string;
  issueDate?: string;
  canonicalHashShort?: string; // e.g. "a1b2c3d4...ef01"

  // Revocation details (if revoked)
  revokedAt?: string;
  revocationReason?: string;

  // Tamper Check Info
  tamperCheck?: {
    computedHash: string;
    registryHash: string;
    isMatch: boolean;
  };

  message?: string;
}
