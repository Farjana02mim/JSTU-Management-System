import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export type IDCardStatus = 'Active' | 'Expired' | 'Lost' | 'Revoked';

export interface StudentIDCard {
  id: string;
  studentId: string;
  name: string;
  nameBn: string;
  department: string;
  departmentBn: string;
  faculty: string;
  facultyBn: string;
  session: string;
  bloodGroup: string;
  issueDate: string;
  validUntil: string;
  status: IDCardStatus;
  statusReason?: string;
  verificationToken: string;
  hallName: string;
  hallNameBn: string;
  emergencyContact: string;
  gender: 'male' | 'female' | 'other';
  avatarSeed: string;
  updatedAt: string;
}

/**
 * Masks student name for public privacy-preserving verification.
 * e.g. "Tanvir Ahmed" -> "T****r A***d"
 * "Md. Sakibul Islam" -> "M*. S*****l I***m"
 */
export function maskName(fullName: string): string {
  if (!fullName || typeof fullName !== 'string') return '***';
  return fullName
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (word.length <= 2) {
        return word.charAt(0) + '*';
      }
      const first = word.charAt(0);
      const last = word.charAt(word.length - 1);
      const maskedLen = Math.max(1, word.length - 2);
      return `${first}${'*'.repeat(maskedLen)}${last}`;
    })
    .join(' ');
}

/**
 * Computes the public verification URL for a given ID card token.
 * QR Code MUST encode ONLY this URL.
 */
export function getVerificationUrl(token: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://jstu.ac.bd';
  return `${origin}/verify-id/${token}`;
}

/**
 * Generates QR Code data URL encoding ONLY the verification URL.
 */
export async function generateIdCardQrDataUrl(token: string): Promise<string> {
  const url = getVerificationUrl(token);
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 256,
    color: {
      dark: '#0F172A',
      light: '#FFFFFF'
    }
  });
}

/**
 * Generates an official A4 PDF containing the front and back of the student ID card,
 * with security watermark and registrar instructions.
 */
export async function generateIdCardPdf(card: StudentIDCard): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;

  // Background Watermark: "DEMO - NOT AN OFFICIAL ID"
  doc.saveGraphicsState();
  doc.setTextColor(226, 232, 240); // Slate 200
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('DEMO - NOT AN OFFICIAL ID', 20, 160, { angle: 45 });
  doc.text('FOR DEMO EVALUATION ONLY', 30, 210, { angle: 45 });
  doc.restoreGraphicsState();

  // Document Outer Border
  doc.setDrawColor(30, 58, 138); // Primary navy
  doc.setLineWidth(0.8);
  doc.rect(margin - 4, margin - 4, pageWidth - (margin - 4) * 2, pageHeight - (margin - 4) * 2);
  doc.setLineWidth(0.2);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin - 2, margin - 2, pageWidth - (margin - 2) * 2, pageHeight - (margin - 2) * 2);

  // Header
  let cursorY = margin + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('JAMALPUR SCIENCE & TECHNOLOGY UNIVERSITY', pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Office of the Registrar • Digital Student Identification Record', pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin + 10, cursorY, pageWidth - margin - 10, cursorY);
  cursorY += 8;

  // Notice Banner
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.setDrawColor(245, 158, 11); // Amber 500
  doc.rect(margin, cursorY, pageWidth - margin * 2, 10, 'FD');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(146, 64, 14); // Amber 800
  doc.text('DEMO - NOT AN OFFICIAL ID • FOR PROTOTYPE AND VERIFICATION TESTING ONLY', pageWidth / 2, cursorY + 6.5, { align: 'center' });
  cursorY += 16;

  // Front of Card (Rendered box: standard ratio 85.6mm x 54mm)
  const cardW = 85.6;
  const cardH = 54;
  const cardX = (pageWidth - cardW) / 2;

  // FRONT CARD CONTAINER
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('1. FRONT SIDE', cardX, cursorY - 2);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.4);
  doc.roundedRect(cardX, cursorY, cardW, cardH, 3, 3, 'FD');

  // Top header bar
  doc.setFillColor(30, 58, 138);
  doc.rect(cardX, cursorY, cardW, 11, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('JAMALPUR SCIENCE & TECHNOLOGY UNIVERSITY', cardX + cardW / 2, cursorY + 4.5, { align: 'center' });
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.text('STUDENT IDENTITY CARD', cardX + cardW / 2, cursorY + 8, { align: 'center' });

  // Front Card Body
  const innerY = cursorY + 14;

  // Avatar placeholder box
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(cardX + 4, innerY, 20, 24, 1, 1, 'FD');
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('NEUTRAL', cardX + 14, innerY + 11, { align: 'center' });
  doc.text('AVATAR', cardX + 14, innerY + 14, { align: 'center' });

  // Student Info Column
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(card.name, cardX + 27, innerY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`ID: `, cardX + 27, innerY + 8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(card.studentId, cardX + 33, innerY + 8.5);

  doc.setFont('helvetica', 'normal');
  doc.text(`Dept: `, cardX + 27, innerY + 12.5);
  doc.text(card.department.length > 25 ? card.department.substring(0, 25) + '...' : card.department, cardX + 35, innerY + 12.5);

  doc.text(`Session: `, cardX + 27, innerY + 16.5);
  doc.text(card.session, cardX + 39, innerY + 16.5);

  doc.text(`Blood Group: `, cardX + 27, innerY + 20.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text(card.bloodGroup, cardX + 44, innerY + 20.5);

  // Status chip
  doc.setFontSize(5.5);
  if (card.status === 'Active') {
    doc.setFillColor(220, 252, 231);
    doc.setTextColor(22, 101, 52);
  } else if (card.status === 'Lost') {
    doc.setFillColor(254, 243, 199);
    doc.setTextColor(146, 64, 14);
  } else if (card.status === 'Revoked') {
    doc.setFillColor(254, 226, 226);
    doc.setTextColor(153, 27, 27);
  } else {
    doc.setFillColor(241, 245, 249);
    doc.setTextColor(71, 85, 105);
  }
  doc.roundedRect(cardX + cardW - 19, innerY, 15, 4.5, 1, 1, 'FD');
  doc.text(card.status.toUpperCase(), cardX + cardW - 11.5, innerY + 3.2, { align: 'center' });

  // QR Code on Front
  try {
    const qrDataUrl = await generateIdCardQrDataUrl(card.verificationToken);
    doc.addImage(qrDataUrl, 'PNG', cardX + cardW - 19, innerY + 6.5, 15, 15);
  } catch {
    doc.rect(cardX + cardW - 19, innerY + 6.5, 15, 15);
  }

  // Validity bottom strip on front
  doc.setFillColor(248, 250, 252);
  doc.rect(cardX + 0.5, cursorY + cardH - 6, cardW - 1, 5.5, 'F');
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text(`VALID THRU: ${card.validUntil}`, cardX + 4, cursorY + cardH - 2.5);
  doc.setTextColor(220, 38, 38);
  doc.text('DEMO - NOT AN OFFICIAL ID', cardX + cardW - 4, cursorY + cardH - 2.5, { align: 'right' });

  cursorY += cardH + 12;

  // BACK CARD CONTAINER
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('2. BACK SIDE', cardX, cursorY - 2);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.4);
  doc.roundedRect(cardX, cursorY, cardW, cardH, 3, 3, 'FD');

  // Back Header Bar
  doc.setFillColor(15, 23, 42);
  doc.rect(cardX, cursorY, cardW, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.text('TERMS & RESIDENCE RECORD', cardX + cardW / 2, cursorY + 4.5, { align: 'center' });

  const backInnerY = cursorY + 10;
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Hall: ${card.hallName}`, cardX + 4, backInnerY);
  doc.text(`Emergency: ${card.emergencyContact}`, cardX + 4, backInnerY + 4);
  doc.text(`Issue Date: ${card.issueDate}`, cardX + 4, backInnerY + 8);
  doc.text(`Campus: Jamalpur-2000, Bangladesh`, cardX + 4, backInnerY + 12);

  // Instructions
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(5);
  const termsText = 'This card is non-transferable and remains property of JSTU. If found, please return to the Office of the Registrar. Verify online via QR code.';
  doc.text(doc.splitTextToSize(termsText, cardW - 8), cardX + 4, backInnerY + 18);

  // Simulated Barcode
  doc.setFillColor(15, 23, 42);
  let barX = cardX + 4;
  const barcodeY = backInnerY + 26;
  const bars = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 2, 1, 2, 3, 1, 2, 1, 3, 2];
  bars.forEach((w) => {
    doc.rect(barX, barcodeY, w * 0.5, 6, 'F');
    barX += (w + 1) * 0.5;
  });
  doc.setFontSize(5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text(card.studentId, cardX + 4, barcodeY + 8.5);

  // Signature box
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('___________________', cardX + cardW - 24, barcodeY + 3);
  doc.text('Registrar, JSTU', cardX + cardW - 22, barcodeY + 7);

  // Back bottom watermark strip
  doc.setFillColor(248, 250, 252);
  doc.rect(cardX + 0.5, cursorY + cardH - 5, cardW - 1, 4.5, 'F');
  doc.setFontSize(5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text('DEMO - NOT AN OFFICIAL ID • JSTU ACADEMIC PORTAL', cardX + cardW / 2, cursorY + cardH - 1.8, { align: 'center' });

  // Bottom Page Security Details
  cursorY += cardH + 12;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, cursorY, pageWidth - margin * 2, 28, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Cryptographic Verification Details', margin + 4, cursorY + 6);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Verification URL: ${getVerificationUrl(card.verificationToken)}`, margin + 4, cursorY + 12);
  doc.text(`Unique Token: ${card.verificationToken}`, margin + 4, cursorY + 17);
  doc.text(`Status: ${card.status.toUpperCase()} (Ledger updated: ${card.updatedAt})`, margin + 4, cursorY + 22);

  return doc;
}

/**
 * Renders ID Card onto an HTML canvas and downloads it as a high-resolution PNG image.
 */
export async function downloadIdCardPng(card: StudentIDCard, side: 'front' | 'back' | 'both' = 'front'): Promise<void> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // High-resolution canvas dimensions (ID-1 card size ratio 85.6mm x 54mm @ 300DPI)
  const cardWidth = 1012;
  const cardHeight = 638;

  const totalWidth = side === 'both' ? cardWidth * 2 + 60 : cardWidth;
  const totalHeight = cardHeight + 80;

  canvas.width = totalWidth;
  canvas.height = totalHeight;

  // Background
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  // Top header text
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 24px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('JAMALPUR SCIENCE & TECHNOLOGY UNIVERSITY — DIGITAL ID CARD', totalWidth / 2, 40);

  // QR Code generation
  const qrDataUrl = await generateIdCardQrDataUrl(card.verificationToken);
  const qrImg = new Image();
  await new Promise<void>((resolve, reject) => {
    qrImg.onload = () => resolve();
    qrImg.onerror = reject;
    qrImg.src = qrDataUrl;
  });

  const drawCardFront = (x: number, y: number) => {
    // Card background
    ctx.save();
    ctx.shadowColor = 'rgba(15, 23, 42, 0.15)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, x, y, cardWidth, cardHeight, 24);
    ctx.fill();
    ctx.restore();

    // Card border
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 3;
    roundRect(ctx, x, y, cardWidth, cardHeight, 24);
    ctx.stroke();

    // Header bar
    ctx.save();
    clipRoundedTop(ctx, x, y, cardWidth, 120, 24);
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(x, y, cardWidth, 120);
    ctx.restore();

    // University Title on Front
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = 'bold 26px Inter, system-ui, sans-serif';
    ctx.fillText('JAMALPUR SCIENCE & TECHNOLOGY UNIVERSITY', x + cardWidth / 2, y + 48);
    ctx.font = '16px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#93C5FD';
    ctx.fillText('STUDENT IDENTITY CARD • জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়', x + cardWidth / 2, y + 80);

    // Diagonal Watermark: "DEMO - NOT AN OFFICIAL ID"
    ctx.save();
    ctx.translate(x + cardWidth / 2, y + cardHeight / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.font = 'bold 44px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
    ctx.textAlign = 'center';
    ctx.fillText('DEMO - NOT AN OFFICIAL ID', 0, 0);
    ctx.restore();

    // Neutral Avatar
    const avatarX = x + 40;
    const avatarY = y + 150;
    const avatarW = 220;
    const avatarH = 260;

    ctx.fillStyle = '#F1F5F9';
    roundRect(ctx, avatarX, avatarY, avatarW, avatarH, 16);
    ctx.fill();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Silhouette icon
    ctx.fillStyle = '#94A3B8';
    ctx.beginPath();
    ctx.arc(avatarX + avatarW / 2, avatarY + 95, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(avatarX + avatarW / 2, avatarY + 230, 80, Math.PI, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 13px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.textAlign = 'center';
    ctx.fillText('NEUTRAL AVATAR', avatarX + avatarW / 2, avatarY + 245);

    // Student Details
    const infoX = avatarX + avatarW + 40;
    let lineY = y + 180;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 36px Inter, system-ui, sans-serif';
    ctx.fillText(card.name, infoX, lineY);

    lineY += 34;
    ctx.font = '20px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(card.nameBn, infoX, lineY);

    lineY += 45;
    drawLabelValue(ctx, 'STUDENT ID', card.studentId, infoX, lineY, true);

    lineY += 36;
    drawLabelValue(ctx, 'DEPARTMENT', card.department, infoX, lineY);

    lineY += 36;
    drawLabelValue(ctx, 'ACADEMIC SESSION', card.session, infoX, lineY);

    lineY += 36;
    drawLabelValue(ctx, 'BLOOD GROUP', card.bloodGroup, infoX, lineY, false, '#DC2626');

    // QR Code
    const qrSize = 180;
    const qrX = x + cardWidth - qrSize - 40;
    const qrY = y + 155;
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
    ctx.strokeStyle = '#E2E8F0';
    ctx.strokeRect(qrX, qrY, qrSize, qrSize);

    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.textAlign = 'center';
    ctx.fillText('Scan to Verify', qrX + qrSize / 2, qrY + qrSize + 20);

    // Status Badge
    const badgeW = 120;
    const badgeH = 34;
    const badgeX = qrX + (qrSize - badgeW) / 2;
    const badgeY = qrY + qrSize + 32;

    let bg = '#DCFCE7';
    let fg = '#166534';
    if (card.status === 'Lost') {
      bg = '#FEF3C7';
      fg = '#92400E';
    } else if (card.status === 'Revoked') {
      bg = '#FEE2E2';
      fg = '#991B1B';
    } else if (card.status === 'Expired') {
      bg = '#F1F5F9';
      fg = '#475569';
    }

    ctx.fillStyle = bg;
    roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 17);
    ctx.fill();
    ctx.font = 'bold 15px Inter, system-ui, sans-serif';
    ctx.fillStyle = fg;
    ctx.textAlign = 'center';
    ctx.fillText(card.status.toUpperCase(), badgeX + badgeW / 2, badgeY + 23);

    // Bottom stripe
    ctx.save();
    clipRoundedBottom(ctx, x, y + cardHeight - 60, cardWidth, 60, 24);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(x, y + cardHeight - 60, cardWidth, 60);
    ctx.strokeStyle = '#E2E8F0';
    ctx.beginPath();
    ctx.moveTo(x, y + cardHeight - 60);
    ctx.lineTo(x + cardWidth, y + cardHeight - 60);
    ctx.stroke();
    ctx.restore();

    ctx.font = 'bold 16px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'left';
    ctx.fillText(`VALID THRU: ${card.validUntil}`, x + 40, y + cardHeight - 25);

    ctx.fillStyle = '#DC2626';
    ctx.textAlign = 'right';
    ctx.fillText('DEMO - not an official ID', x + cardWidth - 40, y + cardHeight - 25);
  };

  const drawCardBack = (x: number, y: number) => {
    // Card background
    ctx.save();
    ctx.shadowColor = 'rgba(15, 23, 42, 0.15)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, x, y, cardWidth, cardHeight, 24);
    ctx.fill();
    ctx.restore();

    // Card border
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 3;
    roundRect(ctx, x, y, cardWidth, cardHeight, 24);
    ctx.stroke();

    // Top Header
    ctx.save();
    clipRoundedTop(ctx, x, y, cardWidth, 80, 24);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(x, y, cardWidth, 80);
    ctx.restore();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px Inter, system-ui, sans-serif';
    ctx.fillText('JAMALPUR SCIENCE & TECHNOLOGY UNIVERSITY', x + cardWidth / 2, y + 48);

    // Terms and contact details
    let backY = y + 130;
    ctx.textAlign = 'left';
    drawLabelValue(ctx, 'RESIDENTIAL HALL', card.hallName, x + 50, backY);

    backY += 45;
    drawLabelValue(ctx, 'EMERGENCY CONTACT', card.emergencyContact, x + 50, backY);

    backY += 45;
    drawLabelValue(ctx, 'ISSUED ON', card.issueDate, x + 50, backY);

    backY += 45;
    drawLabelValue(ctx, 'CAMPUS ADDRESS', 'Jamalpur-2000, Bangladesh', x + 50, backY);

    backY += 60;
    ctx.font = '16px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('1. This card is non-transferable and remains property of JSTU.', x + 50, backY);
    ctx.fillText('2. If found, please return to the Office of the Registrar.', x + 50, backY + 26);
    ctx.fillText('3. Immediate reporting required if lost or damaged.', x + 50, backY + 52);

    // Simulated Barcode graphic
    const barcodeY = y + cardHeight - 160;
    ctx.fillStyle = '#0F172A';
    let bx = x + 50;
    const barcodePattern = [3, 2, 5, 2, 3, 6, 2, 4, 2, 5, 3, 2, 6, 3, 2, 4, 5, 2, 3, 2, 5, 4, 2, 6, 3, 2, 5, 3, 2, 4];
    barcodePattern.forEach((w) => {
      ctx.fillRect(bx, barcodeY, w, 55);
      bx += w + 3;
    });

    ctx.font = 'bold 16px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(card.studentId, x + 50, barcodeY + 80);

    // Signature
    ctx.textAlign = 'right';
    ctx.font = '18px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText('Authorized Signature', x + cardWidth - 60, barcodeY + 30);
    ctx.font = 'bold 16px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#1E3A8A';
    ctx.fillText('Registrar, JSTU', x + cardWidth - 60, barcodeY + 56);

    // Bottom Watermark
    ctx.save();
    clipRoundedBottom(ctx, x, y + cardHeight - 50, cardWidth, 50, 24);
    ctx.fillStyle = '#FEF2F2';
    ctx.fillRect(x, y + cardHeight - 50, cardWidth, 50);
    ctx.restore();

    ctx.font = 'bold 16px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#DC2626';
    ctx.textAlign = 'center';
    ctx.fillText('DEMO - not an official ID • For System Evaluation Only', x + cardWidth / 2, y + cardHeight - 18);
  };

  if (side === 'front') {
    drawCardFront(0, 60);
  } else if (side === 'back') {
    drawCardBack(0, 60);
  } else {
    drawCardFront(0, 60);
    drawCardBack(cardWidth + 60, 60);
  }

  // Download Trigger
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `jstu_id_${card.studentId}_${side}.png`;
  link.href = dataUrl;
  link.click();
}

// Canvas utility helpers
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function clipRoundedTop(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.clip();
}

function clipRoundedBottom(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.closePath();
  ctx.clip();
}

function drawLabelValue(
  ctx: CanvasRenderingContext2D,
  label: string,
  value: string,
  x: number,
  y: number,
  boldValue: boolean = false,
  valueColor: string = '#0F172A'
) {
  ctx.font = 'bold 14px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.textAlign = 'left';
  ctx.fillText(label, x, y);

  ctx.font = `${boldValue ? 'bold ' : ''}18px Inter, system-ui, sans-serif`;
  ctx.fillStyle = valueColor;
  ctx.fillText(value, x + 180, y);
}
