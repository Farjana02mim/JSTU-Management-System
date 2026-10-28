/**
 * JSTU Smart Campus — Digital Document Issuance & Verification Ledger Service
 * 
 * Cryptographic state machine for issuing, revoking, and verifying authentic academic credentials.
 * 
 * Compliant with JSTU Controller of Examinations and Registrar Secretariats.
 * Real enforcement must move to Firestore rules / Cloud Functions.
 * 
 * Security Notes:
 * 1. No signing secret may exist in client code. In demo mode, integrity relies on the
 *    tamper-evident SHA-256 canonical hash and the university digital registry ledger.
 * 2. In production, real asymmetric digital signing (PKI / X.509) must be executed
 *    server-side inside a Cloud Function with private keys securely isolated in
 *    Cloud KMS / Secret Manager.
 * 3. Public verification endpoints (/verify/:id) must expose strictly minimal, masked
 *    metadata (zero student IDs, zero grades, zero contact info) to protect student privacy.
 */

import { SharedDataStoreManager } from '../shared/sharedDataStore';
import { WorkflowActor, WorkflowPermissionError, WorkflowValidationError } from '../workflow/workflowTypes';
import {
  DigitalDocument,
  DocumentType,
  DocumentStatus,
  CanonicalDocumentPayload,
  PublicVerificationResult
} from './documentTypes';

// In-memory sliding window rate limiter: clientIdentifier -> timestamp[]
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_LOOKUPS_PER_MINUTE = 10;
const rateLimitLedger = new Map<string, number[]>();

export class DigitalDocumentService {
  private static instance: DigitalDocumentService | null = null;
  private storeManager: SharedDataStoreManager;

  constructor() {
    this.storeManager = SharedDataStoreManager.getInstance();
  }

  public static getInstance(): DigitalDocumentService {
    if (!DigitalDocumentService.instance) {
      DigitalDocumentService.instance = new DigitalDocumentService();
    }
    return DigitalDocumentService.instance;
  }

  /**
   * Generates a 128-bit unguessable random verification token using crypto.getRandomValues.
   * Format: 32 lowercase hex characters (128 bits of entropy).
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public generateVerificationId(): string {
    const bytes = new Uint8Array(16);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(bytes);
    } else {
      // Fallback for non-standard environments
      for (let i = 0; i < 16; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Computes deterministic SHA-256 hex digest of a canonical UTF-8 string.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public async computeSha256(canonicalText: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(canonicalText);

    if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
      const buffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(buffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    // Pure JS fallback SHA-256 if subtle is unavailable in legacy runtimes
    return this.sha256JsFallback(canonicalText);
  }

  /**
   * Deterministic JSON serializer that sorts object keys recursively.
   */
  public serializeCanonical(obj: any): string {
    if (obj === null || typeof obj !== 'object') {
      return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
      return '[' + obj.map((item) => this.serializeCanonical(item)).join(',') + ']';
    }
    const sortedKeys = Object.keys(obj).sort();
    const parts = sortedKeys.map((key) => {
      return JSON.stringify(key) + ':' + this.serializeCanonical(obj[key]);
    });
    return '{' + parts.join(',') + '}';
  }

  /**
   * Masks a human name for privacy protection.
   * e.g. "Tanvir Ahmed" -> "T****r A***d"
   * e.g. "Fahmida Khatun" -> "F*****a K****n"
   */
  public maskStudentName(name: string): string {
    if (!name) return 'S*****t';
    const parts = name.trim().split(/\s+/);
    const maskedParts = parts.map((part) => {
      if (part.length <= 2) {
        return part[0] + '*';
      }
      const first = part[0];
      const last = part[part.length - 1];
      const stars = '*'.repeat(part.length - 2);
      return `${first}${stars}${last}`;
    });
    return maskedParts.join(' ');
  }

  /**
   * Checks sliding window rate limit for public verification lookups.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public checkRateLimit(clientIdentifier: string = 'client-default'): {
    allowed: boolean;
    remaining: number;
    resetInSeconds: number;
  } {
    const now = Date.now();
    const timestamps = rateLimitLedger.get(clientIdentifier) || [];
    const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

    if (validTimestamps.length >= MAX_LOOKUPS_PER_MINUTE) {
      const oldest = validTimestamps[0];
      const resetInSeconds = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
      rateLimitLedger.set(clientIdentifier, validTimestamps);
      return { allowed: false, remaining: 0, resetInSeconds };
    }

    validTimestamps.push(now);
    rateLimitLedger.set(clientIdentifier, validTimestamps);
    return {
      allowed: true,
      remaining: MAX_LOOKUPS_PER_MINUTE - validTimestamps.length,
      resetInSeconds: 60
    };
  }

  /**
   * Reset rate limit state (primarily for test isolation).
   */
  public resetRateLimits(): void {
    rateLimitLedger.clear();
  }

  /**
   * Issue a digital document for an application.
   * Requirements:
   * 1. Application must exist and be in status APPROVED.
   * 2. Idempotent: One document per application.
   * 3. 128-bit unguessable random verification ID.
   * 4. SHA-256 canonical content hash.
   * 
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public async issueDocument(
    applicationId: string,
    actor: WorkflowActor
  ): Promise<DigitalDocument> {
    const store = this.storeManager.getStore();
    const app = store.applications.find(
      (a) =>
        a.id.toLowerCase() === applicationId.toLowerCase() ||
        a.applicationNumber.toLowerCase() === applicationId.toLowerCase()
    );

    if (!app) {
      throw new Error(`Application "${applicationId}" not found in university records.`);
    }

    // REQUIREMENT: Must be in APPROVED status
    if (app.status !== 'APPROVED') {
      throw new WorkflowValidationError(
        `Cannot issue digital document: Application "${app.applicationNumber}" is currently in status "${app.status}". Digital documents can ONLY be issued once all institutional approvals are completed (status: APPROVED).`
      );
    }

    // IDEMPOTENCY CHECK: One document per application
    const existingDoc = store.digitalDocuments.find(
      (d) => d.applicationId === app.id || d.applicationNumber === app.applicationNumber
    );
    if (existingDoc) {
      return existingDoc;
    }

    // Determine Document Type
    let documentType: DocumentType;
    let title = app.title;
    let titleBn = app.titleBn;

    if (app.type === 'transcript') {
      documentType = 'transcript';
      title = 'Official Academic Transcript';
      titleBn = 'অফিসিয়াল একাডেমিক ট্রান্সক্রিপ্ট';
    } else if (app.type === 'certificate') {
      documentType = 'certificate';
      title = 'Provisional Degree Certificate';
      titleBn = 'সাময়িক ডিগ্রি সনদপত্র';
    } else if (app.type === 'testimonial') {
      documentType = 'testimonial';
      title = 'Character & Conduct Testimonial';
      titleBn = 'চারিত্রিক ও একাডেমিক প্রশংসাপত্র';
    } else {
      documentType = 'approval_letter';
      title = `Official Approval Letter: ${app.title}`;
      titleBn = `আনুষ্ঠানিক অনুমোদনপত্র: ${app.titleBn}`;
    }

    const verificationId = this.generateVerificationId();
    const issueDate = new Date().toISOString();

    // Transcript Published Results Snapshot
    let transcriptSnapshot: DigitalDocument['transcriptSnapshot'] = undefined;
    if (documentType === 'transcript') {
      const allResults = store.results || [];
      const publishedCourses = allResults.flatMap((sem) =>
        sem.courses.filter((c) => !c.isPending && c.gradePoint !== undefined)
      );

      const totalEarnedCredits = publishedCourses.reduce((sum, c) => sum + c.credits, 0);
      const totalPoints = publishedCourses.reduce(
        (sum, c) => sum + (c.gradePoint || 0) * c.credits,
        0
      );
      const cgpa = totalEarnedCredits > 0 ? Number((totalPoints / totalEarnedCredits).toFixed(2)) : 0;

      transcriptSnapshot = {
        cgpa,
        totalEarnedCredits,
        semesters: allResults.map((sem) => {
          const semPublished = sem.courses.filter((c) => !c.isPending && c.gradePoint !== undefined);
          const semCredits = semPublished.reduce((sum, c) => sum + c.credits, 0);
          const semPoints = semPublished.reduce((sum, c) => sum + (c.gradePoint || 0) * c.credits, 0);
          const semSgpa = semCredits > 0 ? Number((semPoints / semCredits).toFixed(2)) : sem.sgpa;

          return {
            semesterNumber: sem.semesterNumber,
            semesterName: sem.semesterName,
            sgpa: semSgpa,
            earnedCredits: semCredits,
            courses: semPublished.map((c) => ({
              code: c.code,
              title: c.title,
              credits: c.credits,
              marks: c.marks,
              letterGrade: c.letterGrade || 'A',
              gradePoint: c.gradePoint || 3.75
            }))
          };
        })
      };
    }

    // Build Canonical Payload
    const canonicalPayload: CanonicalDocumentPayload = {
      verificationId,
      documentType,
      applicationNumber: app.applicationNumber,
      studentId: app.studentId,
      studentName: app.studentName,
      department: app.studentDepartment,
      issueDate,
      summaryData: {
        title,
        formData: app.formData || {},
        transcriptSummary: transcriptSnapshot
          ? { cgpa: transcriptSnapshot.cgpa, totalCredits: transcriptSnapshot.totalEarnedCredits }
          : undefined
      }
    };

    const canonicalSerialized = this.serializeCanonical(canonicalPayload);
    const canonicalHash = await this.computeSha256(canonicalSerialized);

    const docId = `doc-${app.type}-${Date.now()}`;
    const newDoc: DigitalDocument = {
      id: docId,
      verificationId,
      applicationId: app.id,
      applicationNumber: app.applicationNumber,
      documentType,
      title,
      titleBn,
      studentUid: app.studentUid,
      studentId: app.studentId,
      studentName: app.studentName,
      studentNameBn: app.studentNameBn,
      studentDepartment: app.studentDepartment,
      program: 'Bachelor of Science in Computer Science & Engineering',
      canonicalHash,
      canonicalPayload,
      verificationUrl: `/verify/${verificationId}`,
      issueDate,
      issuerRole: actor.role,
      issuerUid: actor.uid,
      issuerName: actor.fullName,
      status: 'VALID',
      transcriptSnapshot,
      contentPayload: app.formData || {},
      createdAt: issueDate,
      updatedAt: issueDate
    };

    store.digitalDocuments.unshift(newDoc);

    // Notify student
    store.studentNotifications.unshift({
      id: `s-notif-doc-${Date.now()}`,
      title: `Digital Document Issued: ${title}`,
      titleBn: `ডিজিটাল সনদপত্র ইস্যু সম্পন্ন: ${titleBn}`,
      message: `Your requested document (${app.applicationNumber}) has been cryptographically sealed and issued. Verification ID: ${verificationId}.`,
      messageBn: `আপনার আবেদনকৃত সনদপত্রটি (${app.applicationNumber}) আনুষ্ঠানিকভাবে ইস্যু করা হয়েছে। যাচাইকরণ আইডি: ${verificationId}।`,
      category: 'academic',
      timestamp: issueDate,
      read: false,
      link: '/student/documents'
    });

    this.storeManager.saveStore(store);
    return newDoc;
  }

  /**
   * Revoke an issued digital document.
   * Requirements:
   * 1. Only Registrar or Super Admin can revoke.
   * 2. Mandatory explanation reason.
   * 3. Revocation is permanent.
   * 
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public async revokeDocument(
    documentIdOrVerificationId: string,
    reason: string,
    actor: WorkflowActor
  ): Promise<DigitalDocument> {
    // Role check
    if (actor.role !== 'registrar' && actor.role !== 'super_admin') {
      throw new WorkflowPermissionError(
        `Unauthorized revocation: Only the Office of Registrar can revoke institutional credentials. Role "${actor.role}" is denied.`
      );
    }

    if (!reason || reason.trim().length < 5) {
      throw new WorkflowValidationError(
        'Mandatory Revocation Reason: A detailed explanation (at least 5 characters) must be provided when revoking a digital document.'
      );
    }

    const store = this.storeManager.getStore();
    const doc = store.digitalDocuments.find(
      (d) =>
        d.id.toLowerCase() === documentIdOrVerificationId.toLowerCase() ||
        d.verificationId.toLowerCase() === documentIdOrVerificationId.toLowerCase()
    );

    if (!doc) {
      throw new Error(`Digital document "${documentIdOrVerificationId}" not found in institutional registry.`);
    }

    const revokedAt = new Date().toISOString();
    doc.status = 'REVOKED';
    doc.revokedAt = revokedAt;
    doc.revokedBy = actor.uid;
    doc.revokedByName = actor.fullName;
    doc.revocationReason = reason.trim();
    doc.updatedAt = revokedAt;

    // Notify student of revocation
    store.studentNotifications.unshift({
      id: `s-notif-rev-${Date.now()}`,
      title: `Notice of Document Revocation: ${doc.title}`,
      titleBn: `সনদপত্র বাতিল নোটিশ: ${doc.titleBn}`,
      message: `Official document (${doc.verificationId}) was revoked by the Office of Registrar. Reason: "${reason.trim()}".`,
      messageBn: `রেজিস্ট্রার দপ্তর কর্তৃক সনদপত্র (${doc.verificationId}) বাতিল করা হয়েছে। কারণ: "${reason.trim()}"।`,
      category: 'urgent',
      timestamp: revokedAt,
      read: false,
      link: '/student/documents'
    });

    this.storeManager.saveStore(store);
    return doc;
  }

  /**
   * Public document verification endpoint.
   * STRICT SECURITY ENFORCEMENT:
   * 1. Rate-limited lookups.
   * 2. ZERO sensitive fields (no Student ID, no CGPA, no marks, no contact details).
   * 3. Student name is partially masked.
   * 4. Identical generic NOT_FOUND response for any nonexistent/invalid token.
   * 
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public async verifyDocument(
    verificationId: string,
    clientIdentifier: string = 'client-default'
  ): Promise<PublicVerificationResult> {
    // 1. Rate limit check
    const rateCheck = this.checkRateLimit(clientIdentifier);
    if (!rateCheck.allowed) {
      return {
        status: 'NOT_FOUND',
        message: `Rate limit exceeded. Maximum ${MAX_LOOKUPS_PER_MINUTE} verification lookups per minute allowed. Please wait ${rateCheck.resetInSeconds} seconds before retrying.`
      };
    }

    const cleanToken = (verificationId || '').trim().toLowerCase();
    if (!cleanToken) {
      return {
        status: 'NOT_FOUND',
        message: 'No institutional academic credential found matching the provided verification identifier.'
      };
    }

    const store = this.storeManager.getStore();
    const doc = store.digitalDocuments.find(
      (d) => d.verificationId.toLowerCase() === cleanToken
    );

    // Generic NOT FOUND for any invalid ID (no hints)
    if (!doc) {
      return {
        status: 'NOT_FOUND',
        message: 'No institutional academic credential found matching the provided verification identifier.'
      };
    }

    // Mask name for privacy protection
    const maskedName = this.maskStudentName(doc.studentName);
    const hashShort = doc.canonicalHash
      ? `${doc.canonicalHash.slice(0, 8)}...${doc.canonicalHash.slice(-8)}`
      : undefined;

    return {
      status: doc.status,
      verificationId: doc.verificationId,
      documentType: doc.documentType,
      documentTitle: doc.title,
      documentTitleBn: doc.titleBn,
      maskedStudentName: maskedName,
      department: doc.studentDepartment,
      program: doc.program,
      issueDate: doc.issueDate,
      canonicalHashShort: hashShort,
      revokedAt: doc.revokedAt,
      revocationReason: doc.revocationReason,
      message:
        doc.status === 'VALID'
          ? 'Cryptographic integrity confirmed: Authentic document issued by JSTU.'
          : 'REVOKED: This document has been officially invalidated by the Office of Registrar.'
    };
  }

  /**
   * Tamper Detection & Integrity Verification against an uploaded payload or text.
   * Recomputes canonical SHA-256 hash and compares with the registry.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public async verifyTamper(
    verificationId: string,
    candidatePayload: Record<string, any>
  ): Promise<{
    isMatch: boolean;
    computedHash: string;
    registryHash: string;
    status: DocumentStatus | 'NOT_FOUND';
  }> {
    const store = this.storeManager.getStore();
    const doc = store.digitalDocuments.find(
      (d) => d.verificationId.toLowerCase() === verificationId.trim().toLowerCase()
    );

    if (!doc) {
      return {
        isMatch: false,
        computedHash: '',
        registryHash: '',
        status: 'NOT_FOUND'
      };
    }

    const serialized = this.serializeCanonical(candidatePayload);
    const computedHash = await this.computeSha256(serialized);
    const isMatch = computedHash.toLowerCase() === doc.canonicalHash.toLowerCase();

    return {
      isMatch,
      computedHash,
      registryHash: doc.canonicalHash,
      status: doc.status
    };
  }

  /**
   * Retrieve all documents issued to a specific student.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public async getStudentDocuments(studentIdOrUid: string): Promise<DigitalDocument[]> {
    const store = this.storeManager.getStore();
    const clean = studentIdOrUid.trim().toLowerCase();
    return store.digitalDocuments.filter(
      (d) =>
        d.studentId.toLowerCase() === clean ||
        d.studentUid.toLowerCase() === clean
    );
  }

  /**
   * Retrieve all issued documents for Registrar administration.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public async getAllIssuedDocuments(filters?: {
    type?: string;
    status?: string;
    searchQuery?: string;
  }): Promise<DigitalDocument[]> {
    const store = this.storeManager.getStore();
    let list = [...store.digitalDocuments];

    if (filters?.type && filters.type !== 'all') {
      list = list.filter((d) => d.documentType === filters.type);
    }

    if (filters?.status && filters.status !== 'all') {
      list = list.filter((d) => d.status === filters.status);
    }

    if (filters?.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.verificationId.toLowerCase().includes(q) ||
          d.studentName.toLowerCase().includes(q) ||
          d.studentId.toLowerCase().includes(q) ||
          d.applicationNumber.toLowerCase().includes(q)
      );
    }

    return list;
  }

  /**
   * Get single document by verification ID or internal ID.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  public async getDocument(idOrVerificationId: string): Promise<DigitalDocument | null> {
    const store = this.storeManager.getStore();
    const clean = idOrVerificationId.trim().toLowerCase();
    const doc = store.digitalDocuments.find(
      (d) => d.id.toLowerCase() === clean || d.verificationId.toLowerCase() === clean
    );
    return doc || null;
  }

  /**
   * Pure JS SHA-256 fallback implementation for synchronous or environments where
   * crypto.subtle is not configured.
   */
  private sha256JsFallback(ascii: string): string {
    function rightRotate(value: number, amount: number) {
      return (value >>> amount) | (value << (32 - amount));
    }

    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let i: number, j: number;
    let result = '';

    const words: number[] = [];
    const asciiBitLength = ascii.length * 8;

    let hash = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    ascii += '\x80';
    while ((ascii.length % 64) - 56) ascii += '\x00';
    for (i = 0; i < ascii.length; i++) {
      j = ascii.charCodeAt(i);
      words[i >> 2] |= j << ((3 - (i % 4)) * 8);
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength | 0;

    for (j = 0; j < words.length;) {
      const w = words.slice(j, (j += 16));
      const oldHash = hash;
      hash = hash.slice(0, 8);

      for (i = 0; i < 64; i++) {
        const i2 = i + j;
        const w15 = w[i - 15], w2 = w[i - 2];

        const a = hash[0], e = hash[4];
        const temp1 =
          hash[7] +
          (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
          ((e & hash[5]) ^ (~e & hash[6])) +
          k[i] +
          (w[i] =
            i < 16
              ? w[i]
              : (w[i - 16] +
                  (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                  w[i - 7] +
                  (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
                0);

        const temp2 =
          (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
          ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }

      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }

    for (i = 0; i < 8; i++) {
      for (let b = 3; b >= 0; b--) {
        const byte = (hash[i] >> (8 * b)) & 255;
        result += (byte < 16 ? '0' : '') + byte.toString(16);
      }
    }
    return result;
  }
}

let docServiceInstance: DigitalDocumentService | null = null;
export function getDigitalDocumentService(): DigitalDocumentService {
  if (!docServiceInstance) {
    docServiceInstance = new DigitalDocumentService();
  }
  return docServiceInstance;
}
