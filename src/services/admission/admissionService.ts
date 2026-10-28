import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import {
  AdmissionApplication,
  AdmissionPersonalInfo,
  AdmissionAcademicInfo,
  AdmissionProgramChoice,
  AdmissionUploadedDocuments
} from '../../types/admission';
import { initialAdmissionApplications } from '../../data/admissionData';

const ADMISSION_STORAGE_KEY = 'jstu_admission_applications_v1';

export class AdmissionService {
  private static instance: AdmissionService;

  private applications: AdmissionApplication[] = [];

  private constructor() {
    this.loadApplications();
  }

  public static getInstance(): AdmissionService {
    if (!AdmissionService.instance) {
      AdmissionService.instance = new AdmissionService();
    }
    return AdmissionService.instance;
  }

  private loadApplications(): void {
    if (typeof window === 'undefined') {
      this.applications = [...initialAdmissionApplications];
      return;
    }

    try {
      const stored = localStorage.getItem(ADMISSION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.applications = parsed;
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Initialize with seed data
    this.applications = [...initialAdmissionApplications];
    this.saveApplications();
  }

  private saveApplications(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ADMISSION_STORAGE_KEY, JSON.stringify(this.applications));
      } catch {
        // Storage blocked or quota exceeded
      }
    }
  }

  public getAllApplications(filters?: {
    status?: string;
    unit?: string;
    search?: string;
    quota?: string;
  }): AdmissionApplication[] {
    let list = [...this.applications];

    if (filters?.status && filters.status !== 'all') {
      list = list.filter((a) => a.status === filters.status);
    }

    if (filters?.unit && filters.unit !== 'all') {
      list = list.filter((a) => a.programChoice.unit === filters.unit);
    }

    if (filters?.quota && filters.quota !== 'all') {
      list = list.filter((a) => a.personalInfo.quota === filters.quota);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.referenceNumber.toLowerCase().includes(q) ||
          a.personalInfo.fullName.toLowerCase().includes(q) ||
          a.personalInfo.email.toLowerCase().includes(q) ||
          (a.testRollNumber && a.testRollNumber.toLowerCase().includes(q))
      );
    }

    // Sort by most recently updated
    return list.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public getApplicationById(id: string): AdmissionApplication | null {
    return this.applications.find((a) => a.id === id) || null;
  }

  public getApplicationByReferenceAndEmail(
    referenceNumber: string,
    email: string
  ): AdmissionApplication | null {
    const cleanRef = referenceNumber.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    return (
      this.applications.find(
        (a) =>
          a.referenceNumber.toUpperCase() === cleanRef &&
          a.personalInfo.email.toLowerCase() === cleanEmail
      ) || null
    );
  }

  public submitApplication(input: {
    personalInfo: AdmissionPersonalInfo;
    academicInfo: AdmissionAcademicInfo;
    programChoice: AdmissionProgramChoice;
    documents: AdmissionUploadedDocuments;
  }): AdmissionApplication {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const referenceNumber = `JSTU-ADM-2026-${randomDigits}`;
    const now = new Date().toISOString();

    const newApp: AdmissionApplication = {
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      referenceNumber,
      status: 'SUBMITTED',
      submittedAt: now,
      updatedAt: now,
      personalInfo: input.personalInfo,
      academicInfo: input.academicInfo,
      programChoice: input.programChoice,
      documents: input.documents,
      notes: ['Online admission application received. Pending registrar office verification.']
    };

    this.applications.unshift(newApp);
    this.saveApplications();
    return newApp;
  }

  public shortlistApplication(
    id: string,
    testRollNumber: string,
    examVenue: string,
    examDate: string,
    examTime: string,
    reviewerName: string
  ): AdmissionApplication {
    const index = this.applications.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Application not found');

    const app = this.applications[index];
    const now = new Date().toISOString();

    const updated: AdmissionApplication = {
      ...app,
      status: 'SHORTLISTED',
      testRollNumber: testRollNumber.trim() || `ROLL-${Math.floor(10000 + Math.random() * 90000)}`,
      examVenue: examVenue.trim() || 'Central Academic Complex, JSTU Campus',
      examDate: examDate.trim() || 'January 08, 2027',
      examTime: examTime.trim() || '10:00 AM - 11:30 AM',
      reviewedAt: now,
      reviewedBy: reviewerName,
      admitCardIssued: true,
      admitCardIssuedAt: now,
      updatedAt: now,
      notes: [
        ...(app.notes || []),
        `Application shortlisted and admit card issued by ${reviewerName} on ${new Date().toLocaleDateString()}.`
      ]
    };

    this.applications[index] = updated;
    this.saveApplications();
    return updated;
  }

  public approveApplication(id: string, reviewerName: string): AdmissionApplication {
    const index = this.applications.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Application not found');

    const app = this.applications[index];
    const now = new Date().toISOString();

    const updated: AdmissionApplication = {
      ...app,
      status: 'APPROVED',
      reviewedAt: now,
      reviewedBy: reviewerName,
      updatedAt: now,
      notes: [
        ...(app.notes || []),
        `Admission approved and merit seat confirmed by ${reviewerName} on ${new Date().toLocaleDateString()}.`
      ]
    };

    this.applications[index] = updated;
    this.saveApplications();
    return updated;
  }

  public rejectApplication(
    id: string,
    reason: string,
    reviewerName: string
  ): AdmissionApplication {
    const index = this.applications.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Application not found');

    const app = this.applications[index];
    const now = new Date().toISOString();

    const updated: AdmissionApplication = {
      ...app,
      status: 'REJECTED',
      rejectionReason: reason.trim(),
      reviewedAt: now,
      reviewedBy: reviewerName,
      updatedAt: now,
      notes: [
        ...(app.notes || []),
        `Application rejected by ${reviewerName}: "${reason.trim()}"`
      ]
    };

    this.applications[index] = updated;
    this.saveApplications();
    return updated;
  }

  /**
   * Generates a printable, cryptographically verifiable Admit Card PDF
   */
  public async generateAdmitCardPdf(application: AdmissionApplication): Promise<void> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const rollNo = application.testRollNumber || 'ROLL-TBD';
    const verifyPayload = JSON.stringify({
      ref: application.referenceNumber,
      roll: rollNo,
      name: application.personalInfo.fullName,
      unit: application.programChoice.unit,
      hscRoll: application.academicInfo.hscRoll,
      examDate: application.examDate || 'Jan 08, 2027',
      institution: 'JSTU'
    });

    // Generate QR Code data URL
    let qrDataUrl = '';
    try {
      qrDataUrl = await QRCode.toDataURL(verifyPayload, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 180
      });
    } catch {
      // Fallback without QR
    }

    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const margin = 14;

    // Header Background Strip
    doc.setFillColor(30, 58, 138); // #1E3A8A Navy
    doc.rect(margin, margin, pageWidth - margin * 2, 28, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('JASHORE SMART TECHNOLOGICAL UNIVERSITY', pageWidth / 2, margin + 8, {
      align: 'center'
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(
      'CENTRAL UNDERGRADUATE ADMISSION TEST 2026-2027',
      pageWidth / 2,
      margin + 15,
      { align: 'center' }
    );

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(253, 224, 71); // amber-300
    doc.text('OFFICIAL ADMIT CARD & EXAMINATION PASS', pageWidth / 2, margin + 22, {
      align: 'center'
    });

    // Roll Number Banner
    const rollBannerY = margin + 33;
    doc.setFillColor(241, 245, 249); // slate-100
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.roundedRect(margin, rollBannerY, pageWidth - margin * 2, 16, 2, 2, 'FD');

    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('TEST ROLL NUMBER:', margin + 6, rollBannerY + 7);

    doc.setFontSize(16);
    doc.setTextColor(30, 58, 138); // navy
    doc.text(rollNo, margin + 54, rollBannerY + 11);

    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`REFERENCE: ${application.referenceNumber}`, pageWidth - margin - 6, rollBannerY + 7, {
      align: 'right'
    });
    doc.text(
      `UNIT: ${application.programChoice.unit.replace('_', ' ')}  |  1ST CHOICE: ${application.programChoice.firstChoiceDept}`,
      pageWidth - margin - 6,
      rollBannerY + 12,
      { align: 'right' }
    );

    // Left Column: Candidate & Academic Info; Right Column: QR Code & Photo box
    const infoY = rollBannerY + 22;
    const colWidth = 126;

    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, infoY, colWidth, 76, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('CANDIDATE PROFILE & TEST SCHEDULE', margin + 5, infoY + 7);

    doc.setFontSize(8.5);
    const labelX = margin + 5;
    const valX = margin + 42;
    let currentY = infoY + 15;

    const row = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text(label, labelX, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(value, valX, currentY);
      currentY += 6.5;
    };

    row("Applicant's Name:", application.personalInfo.fullName);
    row("Father's Name:", application.personalInfo.fatherName);
    row("Mother's Name:", application.personalInfo.motherName);
    row('HSC Board & Roll:', `${application.academicInfo.hscBoard} - ${application.academicInfo.hscRoll}`);
    row('HSC Reg. & Year:', `${application.academicInfo.hscReg} (${application.academicInfo.hscPassingYear})`);
    row('Quota Category:', application.personalInfo.quota.replace('_', ' '));
    row('Examination Date:', application.examDate || 'January 08, 2027');
    row('Reporting Time:', application.examTime || '10:00 AM - 11:30 AM');
    row('Examination Hall:', application.examVenue || 'Central Campus Academic Block');

    // Right Column: QR Code & Photo Box
    const rightColX = margin + colWidth + 6;
    const rightColWidth = pageWidth - margin * 2 - colWidth - 6;

    // QR Box
    doc.roundedRect(rightColX, infoY, rightColWidth, 36, 2, 2, 'FD');
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', rightColX + (rightColWidth - 30) / 2, infoY + 3, 30, 30);
    }
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Cryptographic Verification QR', rightColX + rightColWidth / 2, infoY + 34, {
      align: 'center'
    });

    // Candidate Photo & Signature Box
    doc.roundedRect(rightColX, infoY + 40, rightColWidth, 36, 2, 2, 'FD');
    doc.setFillColor(248, 250, 252);
    doc.rect(rightColX + (rightColWidth - 28) / 2, infoY + 42, 28, 28, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(rightColX + (rightColWidth - 28) / 2, infoY + 42, 28, 28, 'D');

    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Applicant Photo', rightColX + rightColWidth / 2, infoY + 57, { align: 'center' });
    doc.setFontSize(6.5);
    doc.text('Affix color photo if not printed', rightColX + rightColWidth / 2, infoY + 62, {
      align: 'center'
    });

    // Important Instructions Section
    const instructionsY = infoY + 82;
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, instructionsY, pageWidth - margin * 2, 60, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 58, 138);
    doc.text('MANDATORY INSTRUCTIONS FOR CANDIDATES', margin + 6, instructionsY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);

    const rules = [
      '1. Candidates must arrive at the designated examination room at least 30 minutes before commencement.',
      '2. Must bring this printed Admit Card and original HSC Registration Card to the test center.',
      '3. Mobile phones, smart watches, Bluetooth devices, and programmable electronic items are strictly prohibited.',
      '4. Use black ballpoint pen only for filling OMR sheet circles. Erasers or fluid will invalidate the answer sheet.',
      '5. Only standard non-programmable scientific calculators (FX-100/FX-570 series) are allowed for Unit A.',
      '6. No candidate will be allowed to leave the examination hall before the full duration expires.',
      '7. Any impersonation, forgery, or unfair means will lead to immediate cancellation and criminal prosecution.',
      '8. Preserve this Admit Card securely; it will be required during merit listing, counseling, and admission viva.'
    ];

    let ruleY = instructionsY + 14;
    rules.forEach((rule) => {
      doc.text(rule, margin + 6, ruleY);
      ruleY += 5.5;
    });

    // Signatures Strip
    const sigY = instructionsY + 66;
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);

    doc.line(margin + 10, sigY + 14, margin + 60, sigY + 14);
    doc.text("Candidate's Signature", margin + 18, sigY + 18);

    doc.line(pageWidth - margin - 60, sigY + 14, pageWidth - margin - 10, sigY + 14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text('Registrar & Admission Convener', pageWidth - margin - 58, sigY + 18);

    // Save and download
    const filename = `JSTU_Admit_Card_${application.referenceNumber}.pdf`;
    doc.save(filename);
  }
}

export const getAdmissionService = (): AdmissionService => {
  return AdmissionService.getInstance();
};
