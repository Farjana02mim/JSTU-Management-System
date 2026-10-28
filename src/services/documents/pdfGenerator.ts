/**
 * JSTU Smart Campus — Client-Side PDF Document Generator with QR Code
 * 
 * Generates official academic credentials client-side using jsPDF and QRCode.
 * QR Code strictly encodes ONLY the public verification URL (<origin>/verify/<verificationId>).
 * Never encodes private or personal student data.
 * 
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */

import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { DigitalDocument } from './documentTypes';

export async function generateDocumentPdf(docData: DigitalDocument): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;

  // Determine verification URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://jstu.ac.bd';
  const verificationUrl = `${origin}/verify/${docData.verificationId}`;

  // Generate QR Code data URL (encodes ONLY the URL, never personal data)
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 140
  });

  // 1. Watermark in background: "DEMO - NOT AN OFFICIAL DOCUMENT"
  doc.saveGraphicsState();
  doc.setTextColor(225, 225, 230);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  // Rotate and render watermark across center
  // jsPDF supports text rotation via options: { angle: 45 }
  doc.text('DEMO - NOT AN OFFICIAL DOCUMENT', 25, 210, { angle: 45 });
  doc.text('FOR PROTOTYPE VERIFICATION ONLY', 35, 250, { angle: 45 });
  doc.restoreGraphicsState();

  // 2. Official Header Border
  doc.setDrawColor(30, 58, 138); // Navy blue
  doc.setLineWidth(0.8);
  doc.rect(margin - 4, margin - 4, pageWidth - (margin - 4) * 2, pageHeight - (margin - 4) * 2);
  doc.setLineWidth(0.2);
  doc.setDrawColor(203, 213, 225); // Slate 300 inner border
  doc.rect(margin - 2, margin - 2, pageWidth - (margin - 2) * 2, pageHeight - (margin - 2) * 2);

  // 3. Header: University Emblem placeholder & typography
  let cursorY = margin + 6;

  // University Header
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('JAMALPUR SCIENCE & TECHNOLOGY UNIVERSITY', pageWidth / 2, cursorY, { align: 'center' });

  cursorY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('ESTABLISHED UNDER JSTU ACT 2012 • JAMALPUR-2000, BANGLADESH', pageWidth / 2, cursorY, { align: 'center' });

  cursorY += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 58, 138);
  const officeName =
    docData.documentType === 'transcript'
      ? 'OFFICE OF THE CONTROLLER OF EXAMINATIONS'
      : docData.documentType === 'certificate'
      ? 'CENTRAL SECRETARIAT • OFFICE OF THE REGISTRAR'
      : 'ACADEMIC AFFAIRS & STUDENT WELFARE';
  doc.text(officeName, pageWidth / 2, cursorY, { align: 'center' });

  cursorY += 3;
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.6);
  doc.line(margin + 5, cursorY, pageWidth - margin - 5, cursorY);
  cursorY += 7;

  // 4. Document Title Banner
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin + 10, cursorY, pageWidth - (margin + 10) * 2, 10, 2, 2, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(docData.title.toUpperCase(), pageWidth / 2, cursorY + 7, { align: 'center' });
  cursorY += 16;

  // 5. Student Metadata Grid
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, cursorY, pageWidth - margin * 2, 28, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, cursorY, pageWidth - margin * 2, 28, 2, 2, 'S');

  const metaCol1 = margin + 4;
  const metaCol2 = margin + 92;

  doc.setFontSize(8.5);

  // Row 1
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Student Full Name:', metaCol1, cursorY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(docData.studentName, metaCol1 + 32, cursorY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Student Roll / ID:', metaCol2, cursorY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text(docData.studentId, metaCol2 + 28, cursorY + 6);

  // Row 2
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Department:', metaCol1, cursorY + 13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`Department of ${docData.studentDepartment}`, metaCol1 + 32, cursorY + 13);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Application No:', metaCol2, cursorY + 13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(docData.applicationNumber, metaCol2 + 28, cursorY + 13);

  // Row 3
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Degree Program:', metaCol1, cursorY + 20);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(docData.program, metaCol1 + 32, cursorY + 20);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Date of Issue:', metaCol2, cursorY + 20);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const formattedDate = new Date(docData.issueDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  doc.text(formattedDate, metaCol2 + 28, cursorY + 20);

  cursorY += 34;

  // 6. Document Type Specific Body Content
  if (docData.documentType === 'transcript') {
    // Official Academic Transcript Body
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 58, 138);
    doc.text('PUBLISHED SEMESTER TABULATION RECORD', margin, cursorY);
    cursorY += 4;

    const snapshot = docData.transcriptSnapshot;
    if (snapshot && snapshot.semesters.length > 0) {
      for (const sem of snapshot.semesters) {
        if (cursorY > 210) break; // Keep within single page

        doc.setFillColor(241, 245, 249);
        doc.rect(margin, cursorY, pageWidth - margin * 2, 5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        doc.text(
          `${sem.semesterName.toUpperCase()}  •  SGPA: ${sem.sgpa.toFixed(2)}  •  Earned Credits: ${sem.earnedCredits}`,
          margin + 2,
          cursorY + 3.5
        );
        cursorY += 6;

        // Courses Table Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text('Code', margin + 2, cursorY);
        doc.text('Course Title', margin + 22, cursorY);
        doc.text('Credits', margin + 115, cursorY);
        doc.text('Grade', margin + 135, cursorY);
        doc.text('Grade Point', margin + 155, cursorY);
        cursorY += 3.5;

        // Courses Rows
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        for (const c of sem.courses) {
          doc.text(c.code, margin + 2, cursorY);
          const shortTitle = c.title.length > 50 ? c.title.slice(0, 48) + '...' : c.title;
          doc.text(shortTitle, margin + 22, cursorY);
          doc.text(c.credits.toFixed(1), margin + 118, cursorY);
          doc.text(c.letterGrade, margin + 138, cursorY);
          doc.text(c.gradePoint.toFixed(2), margin + 160, cursorY);
          cursorY += 3.5;
        }
        cursorY += 2;
      }

      // Summary Cumulative CGPA Box
      doc.setFillColor(238, 242, 255);
      doc.setDrawColor(199, 210, 254);
      doc.roundedRect(margin, cursorY, pageWidth - margin * 2, 8, 1.5, 1.5, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 58, 138);
      doc.text(
        `CUMULATIVE GRADE POINT AVERAGE (CGPA):  ${snapshot.cgpa.toFixed(2)} / 4.00   |   TOTAL EARNED CREDITS:  ${snapshot.totalEarnedCredits}`,
        pageWidth / 2,
        cursorY + 5.5,
        { align: 'center' }
      );
      cursorY += 12;
    }
  } else if (docData.documentType === 'certificate') {
    // Certificate Body
    cursorY += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    const certText = `This is to formally certify that ${docData.studentName}, bearing Student ID ${docData.studentId}, has satisfactorily fulfilled all prescribed academic curriculum and statutory examination regulations under the Faculty of Engineering and Technology, Jamalpur Science & Technology University.`;
    doc.text(certText, margin, cursorY, { maxWidth: pageWidth - margin * 2, lineHeightFactor: 1.4 });
    cursorY += 20;

    const certText2 = `Having fulfilled all requirements, the candidate is hereby provisionally awarded the degree of ${docData.program} in the department of ${docData.studentDepartment}.`;
    doc.text(certText2, margin, cursorY, { maxWidth: pageWidth - margin * 2, lineHeightFactor: 1.4 });
    cursorY += 24;
  } else if (docData.documentType === 'testimonial') {
    // Testimonial Body
    cursorY += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const testText = `This is to certify that ${docData.studentName}, Son/Daughter of enrolled student records, bearing Student ID ${docData.studentId}, has been a bona fide student in the Department of ${docData.studentDepartment} at Jamalpur Science & Technology University.`;
    doc.text(testText, margin, cursorY, { maxWidth: pageWidth - margin * 2, lineHeightFactor: 1.4 });
    cursorY += 18;

    const testText2 = `During his/her tenure at this University, to the best of my knowledge and institutional records, he/she did not participate in any subversive or anti-disciplinary activities. His/her conduct and moral character have been exemplary. I wish him/her every success in all future educational and professional endeavors.`;
    doc.text(testText2, margin, cursorY, { maxWidth: pageWidth - margin * 2, lineHeightFactor: 1.4 });
    cursorY += 26;
  } else {
    // Approval Letter Body
    cursorY += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const letterText = `This official memorandum confirms that Application (${docData.applicationNumber}) submitted by ${docData.studentName} (${docData.studentId}) for ${docData.title} has completed all institutional approval chains and has been officially SANCTIONED by the competent authority of Jamalpur Science & Technology University.`;
    doc.text(letterText, margin, cursorY, { maxWidth: pageWidth - margin * 2, lineHeightFactor: 1.4 });
    cursorY += 24;
  }

  // 7. Signatures Row
  const sigY = 236;
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.3);

  // Left Signature: Chairman
  doc.line(margin + 5, sigY, margin + 45, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Department Chairman', margin + 10, sigY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Dept. of ' + docData.studentDepartment, margin + 10, sigY + 7);

  // Middle Signature: Controller of Examinations
  doc.line(margin + 60, sigY, margin + 100, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Controller of Examinations', margin + 61, sigY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Examination Secretariat', margin + 61, sigY + 7);

  // Right Signature: Registrar
  doc.line(margin + 115, sigY, margin + 155, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Registrar', margin + 130, sigY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('JSTU Central Administration', margin + 120, sigY + 7);

  // 8. Cryptographic QR Code & Verification Block at Bottom
  const bottomBoxY = 248;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, bottomBoxY, pageWidth - margin * 2, 38, 2, 2, 'FD');

  // Add QR Code (30x30 mm)
  doc.addImage(qrDataUrl, 'PNG', margin + 3, bottomBoxY + 4, 30, 30);

  // Verification Details Text
  const textX = margin + 36;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 58, 138);
  doc.text('OFFICIAL DIGITAL CREDENTIAL VERIFICATION', textX, bottomBoxY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(51, 65, 85);
  doc.text(
    'This academic document is registered in the JSTU Public Integrity Ledger.',
    textX,
    bottomBoxY + 11.5
  );

  doc.setFont('helvetica', 'bold');
  doc.text('Verification Token:', textX, bottomBoxY + 16.5);
  doc.setFont('courier', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(docData.verificationId, textX + 27, bottomBoxY + 16.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Public Verification URL:', textX, bottomBoxY + 21.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(2, 132, 199);
  doc.text(verificationUrl, textX + 33, bottomBoxY + 21.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Integrity Digest (SHA-256):', textX, bottomBoxY + 26.5);
  doc.setFont('courier', 'normal');
  doc.setTextColor(71, 85, 105);
  const hashShort = `${docData.canonicalHash.slice(0, 16)}...${docData.canonicalHash.slice(-16)}`;
  doc.text(hashShort, textX + 37, bottomBoxY + 26.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Notice: Tampering renders this document null and void. Scan QR or verify at https://jstu.ac.bd/verify',
    textX,
    bottomBoxY + 32
  );

  return doc;
}

/**
 * Convenience helper to download or preview the generated PDF in the browser.
 */
export async function downloadDocumentPdf(docData: DigitalDocument): Promise<void> {
  const doc = await generateDocumentPdf(docData);
  const filename = `JSTU-${docData.documentType.toUpperCase()}-${docData.studentId}-${docData.verificationId.slice(0, 8)}.pdf`;
  doc.save(filename);
}
