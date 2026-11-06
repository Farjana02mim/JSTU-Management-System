import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import {
  HeartPulse,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileText,
  ShieldCheck,
  Search,
  ChevronRight,
  Info,
  Download,
  Eye,
  Lock,
  ExternalLink,
  Award,
  Copy,
  Check,
  Send
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { getApplicationWorkflowService } from '../../services/workflow';
import {
  MedicalAppointment,
  MedicalDutyShift,
  MedicalAppointmentStatus,
  MedicalVisitRecord,
  MedicalRestCertificate
} from '../../types/studentLife';
import { initialMedicalDoctorsData } from '../../data/studentLifeSeedData';

// Zod validation schema with 300 character limit on reason
const appointmentBookingSchema = z.object({
  doctorId: z.string().min(1, 'Please select a doctor or Any Available'),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid date is required'),
  timeSlot: z.string().min(1, 'Please select an available time slot'),
  reason: z
    .string()
    .trim()
    .min(3, 'Please write a brief reason (at least 3 characters)')
    .max(300, 'Reason cannot exceed 300 characters')
});

export const MedicalAppointmentPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { user, profile } = useAuth();
  const storeManager = SharedDataStoreManager.getInstance();

  const [activeTab, setActiveTab] = useState<'book' | 'my-appointments' | 'my-records' | 'my-certificates'>('book');
  const [appointments, setAppointments] = useState<MedicalAppointment[]>([]);
  const [dutyRoster, setDutyRoster] = useState<MedicalDutyShift[]>([]);
  const [healthRecords, setHealthRecords] = useState<MedicalVisitRecord[]>([]);
  const [certificates, setCertificates] = useState<MedicalRestCertificate[]>([]);
  const [accessLogs, setAccessLogs] = useState<Array<{ id: string; role: string; date: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  // M3: Leave Shortcut Modal State
  // Real enforcement must move to Firestore rules / Cloud Functions.
  // Real signing must happen server-side with a key in a secret manager.
  // The registry must live in a database with rules exposing only the minimal verification fields publicly.
  const [selectedCertForLeave, setSelectedCertForLeave] = useState<MedicalRestCertificate | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);
  const [leaveSuccessMsg, setLeaveSuccessMsg] = useState<string | null>(null);
  const [leaveErrorMsg, setLeaveErrorMsg] = useState<string | null>(null);
  const [copyFeedbackId, setCopyFeedbackId] = useState<string | null>(null);

  // Booking Form State
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [formData, setFormData] = useState({
    doctorId: 'any',
    appointmentDate: todayStr,
    timeSlot: '',
    reason: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState<MedicalAppointment | null>(null);

  // Action Modals
  const [selectedAppointment, setSelectedAppointment] = useState<MedicalAppointment | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(todayStr);
  const [rescheduleSlot, setRescheduleSlot] = useState('');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // M2: Health Records Detail & PDF Modals
  const [selectedHealthRecord, setSelectedHealthRecord] = useState<MedicalVisitRecord | null>(null);
  const [isRecordDetailModalOpen, setIsRecordDetailModalOpen] = useState(false);
  const [isAccessLogModalOpen, setIsAccessLogModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Refresh appointments, health records, and certificates for logged-in user
  // Real enforcement must move to Firestore rules / Cloud Functions.
  // Real health data needs encryption, strict access rules, a legal basis and university approval, and must not be stored in a browser-only demo.
  const loadData = () => {
    if (!user) return;
    const userUid = user.uid || 'demo_student_01';
    setAppointments(storeManager.getMedicalAppointmentsForPatient(userUid));
    setDutyRoster(storeManager.getMedicalDutyRoster());
    setHealthRecords(storeManager.getPatientHealthRecords(userUid));
    setCertificates(storeManager.getMedicalRestCertificatesForPatient(userUid));
    setAccessLogs(storeManager.getPatientAccessLogs(userUid));
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Available dates for the next 14 days
  const availableDates = useMemo(() => {
    const dates: { dateStr: string; labelEn: string; labelBn: string; dayOfWeek: string }[] = [];
    const base = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(base.getTime() + i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'long' });
      // Exclude Friday and Saturday (University Weekend)
      if (dayOfWeek !== 'Friday' && dayOfWeek !== 'Saturday') {
        dates.push({
          dateStr,
          dayOfWeek,
          labelEn: `${dateStr} (${dayOfWeek})`,
          labelBn: `${dateStr} (${dayOfWeek === 'Sunday' ? 'রবিবার' : dayOfWeek === 'Monday' ? 'সোমবার' : dayOfWeek === 'Tuesday' ? 'মঙ্গলবার' : dayOfWeek === 'Wednesday' ? 'বুধবার' : 'বৃহস্পতিবার'})`
        });
      }
    }
    return dates;
  }, []);

  // Compute available slots from duty roster for chosen date & doctor (prevent double booking)
  const availableSlots = useMemo(() => {
    const selectedDateObj = new Date(formData.appointmentDate);
    const dayName = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' });

    // Filter roster shifts for that day of week and doctor
    const shiftsForDay = dutyRoster.filter((shift) => {
      const matchDay = shift.dayOfWeek.toLowerCase() === dayName.toLowerCase();
      const matchDoc = formData.doctorId === 'any' || shift.doctorId === formData.doctorId;
      return matchDay && matchDoc && shift.isActive;
    });

    // Check existing booked appointments for that date (Requested or Confirmed)
    const store = storeManager.getStore();
    const existingBookings = (store.medicalAppointments || []).filter(
      (a) =>
        a.appointmentDate === formData.appointmentDate &&
        (a.status === 'Requested' || a.status === 'Confirmed')
    );

    return shiftsForDay.map((shift) => {
      const isOccupied = existingBookings.some(
        (a) =>
          a.timeSlot === shift.timeSlot &&
          (formData.doctorId === 'any' || a.doctorId === shift.doctorId || a.doctorId === 'any')
      );

      return {
        ...shift,
        isOccupied
      };
    });
  }, [dutyRoster, formData.appointmentDate, formData.doctorId, storeManager]);

  // Compute available slots for reschedule modal
  const rescheduleAvailableSlots = useMemo(() => {
    if (!selectedAppointment) return [];
    const selectedDateObj = new Date(rescheduleDate);
    const dayName = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' });

    const shiftsForDay = dutyRoster.filter((shift) => {
      const matchDay = shift.dayOfWeek.toLowerCase() === dayName.toLowerCase();
      const matchDoc =
        selectedAppointment.doctorId === 'any' || shift.doctorId === selectedAppointment.doctorId;
      return matchDay && matchDoc && shift.isActive;
    });

    const store = storeManager.getStore();
    const existingBookings = (store.medicalAppointments || []).filter(
      (a) =>
        a.id !== selectedAppointment.id &&
        a.appointmentDate === rescheduleDate &&
        (a.status === 'Requested' || a.status === 'Confirmed')
    );

    return shiftsForDay.map((shift) => {
      const isOccupied = existingBookings.some(
        (a) =>
          a.timeSlot === shift.timeSlot &&
          (selectedAppointment.doctorId === 'any' ||
            a.doctorId === shift.doctorId ||
            a.doctorId === 'any')
      );
      return {
        ...shift,
        isOccupied
      };
    });
  }, [dutyRoster, rescheduleDate, selectedAppointment, storeManager]);

  // Handle Form Submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setSubmitSuccess(null);

    // Validate with Zod
    const validation = appointmentBookingSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const patientUid = user?.uid || 'demo_student_01';
      const patientName = user?.displayName || profile?.fullName || 'Tanvir Ahmed';
      const patientId = profile?.studentId || 'JSTU2026001';
      const patientRole = profile?.role || 'student';
      const department = profile?.departmentId || 'Computer Science & Engineering';
      const phone = profile?.phoneNumber || '+880 1711-234567';

      let doctorName = 'Any Available Duty Doctor [REPLACE WITH REAL CONTENT]';
      let doctorSpecialty = 'General Outpatient Consultation';

      if (formData.doctorId !== 'any') {
        const found = initialMedicalDoctorsData.find((d) => d.id === formData.doctorId);
        if (found) {
          doctorName = found.name;
          doctorSpecialty = found.specialty;
        }
      }

      const result = storeManager.bookMedicalAppointment({
        patientUid,
        patientName,
        patientRole,
        patientId,
        department,
        phone,
        doctorId: formData.doctorId,
        doctorName,
        doctorSpecialty,
        appointmentDate: formData.appointmentDate,
        timeSlot: formData.timeSlot,
        reason: formData.reason.trim()
      });

      if (!result.success || !result.appointment) {
        setFormErrors({ submit: result.error || 'Failed to book appointment' });
      } else {
        setSubmitSuccess(result.appointment);
        setFormData({
          doctorId: 'any',
          appointmentDate: todayStr,
          timeSlot: '',
          reason: ''
        });
        loadData();
      }
    } catch {
      setFormErrors({ submit: 'An unexpected system error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Cancellation
  const handleConfirmCancel = () => {
    if (!selectedAppointment || !user) return;
    storeManager.cancelMedicalAppointment(
      selectedAppointment.id,
      user.uid || 'demo_student_01',
      profile?.role || 'student',
      cancelReason || undefined
    );
    setIsCancelModalOpen(false);
    setSelectedAppointment(null);
    setCancelReason('');
    loadData();
  };

  // Handle Rescheduling
  const handleConfirmReschedule = () => {
    if (!selectedAppointment || !user || !rescheduleSlot) return;
    const result = storeManager.rescheduleMedicalAppointment(
      selectedAppointment.id,
      rescheduleDate,
      rescheduleSlot,
      user.uid || 'demo_student_01',
      profile?.role || 'student'
    );
    if (result.success) {
      setIsRescheduleModalOpen(false);
      setSelectedAppointment(null);
      setRescheduleSlot('');
      loadData();
    } else {
      alert(result.error || 'Unable to reschedule.');
    }
  };

  // M2: Download Prescription PDF with "DEMO" watermark and QR code
  const handleDownloadPrescriptionPdf = async (record: MedicalVisitRecord) => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // 1. Diagonal Large DEMO Watermark
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(60);
      doc.setTextColor(230, 230, 230);
      doc.text('DEMO ONLY', 35, 140, { angle: 45 });
      doc.text('NOT A REAL RECORD', 15, 200, { angle: 45 });

      // 2. Official Header
      doc.setTextColor(30, 58, 138); // Brand Navy #1E3A8A
      doc.setFontSize(15);
      doc.text('JAMALPUR SCIENCE & TECHNOLOGY UNIVERSITY', 105, 20, { align: 'center' });

      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text('CENTRAL UNIVERSITY MEDICAL CENTER', 105, 27, { align: 'center' });

      doc.setFontSize(9);
      doc.setTextColor(180, 83, 9); // Gold accent
      doc.text('CLINICAL VISIT RECORD & PRESCRIPTION (PROTOTYPE EVALUATION)', 105, 33, { align: 'center' });

      // Thin separator line
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 36, 195, 36);

      // 3. Metadata Table (Patient & Doctor)
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42); // Heading dark #0F172A

      // Left Box: Patient Details
      doc.text('PATIENT PARTICULARS:', 15, 43);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(`Name: ${record.patientName}`, 15, 48);
      doc.text(`ID / Roll: ${record.patientId} (${record.patientRole.toUpperCase()})`, 15, 53);
      doc.text(`Department: ${record.patientDepartment}`, 15, 58);

      // Right Box: Visit & Doctor Details
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('VISIT DETAILS:', 110, 43);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(`Visit Date: ${record.visitDate}`, 110, 48);
      doc.text(`Reference: ${record.appointmentRef}`, 110, 53);
      doc.text(`Attending Doctor: ${record.doctorName}`, 110, 58);
      doc.text(`Specialty: ${record.doctorSpecialty}`, 110, 63);

      doc.line(15, 67, 195, 67);

      // 4. Clinical Notes
      let currentY = 74;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 138);
      doc.text('CHIEF COMPLAINT:', 15, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const splitComplaint = doc.splitTextToSize(record.complaint, 180);
      doc.text(splitComplaint, 15, currentY + 5);
      currentY += 8 + splitComplaint.length * 4;

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 138);
      doc.text('CLINICAL OBSERVATION & VITAL SIGNS:', 15, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const splitObs = doc.splitTextToSize(record.observation, 180);
      doc.text(splitObs, 15, currentY + 5);
      currentY += 8 + splitObs.length * 4;

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 138);
      doc.text('MEDICAL ADVICE & RECOMMENDATIONS:', 15, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const splitAdvice = doc.splitTextToSize(record.advice, 180);
      doc.text(splitAdvice, 15, currentY + 5);
      currentY += 8 + splitAdvice.length * 4;

      if (record.sickRestDays) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(180, 83, 9);
        doc.text(`Recommended Medical Rest: ${record.sickRestDays} day(s)`, 15, currentY);
        currentY += 7;
      }

      if (record.followUpDate) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`Follow-up Consultation Date: ${record.followUpDate}`, 15, currentY);
        currentY += 7;
      }

      doc.line(15, currentY, 195, currentY);
      currentY += 6;

      // 5. Prescribed Medications Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 58, 138);
      doc.text('Rx — PRESCRIBED MEDICATIONS', 15, currentY);
      currentY += 6;

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('MEDICINE NAME', 15, currentY);
      doc.text('DOSE', 85, currentY);
      doc.text('DURATION', 125, currentY);
      doc.text('INSTRUCTIONS', 155, currentY);
      currentY += 3;
      doc.setDrawColor(203, 213, 225);
      doc.line(15, currentY, 195, currentY);
      currentY += 5;

      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);

      record.prescriptionItems.forEach((item, index) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${item.medicine}`, 15, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(item.dose, 85, currentY);
        doc.text(item.duration, 125, currentY);
        doc.text(item.instructions || '—', 155, currentY);
        currentY += 6;
      });

      // 6. Verification QR Code and Token Box
      currentY = Math.max(currentY + 6, 230);
      doc.setDrawColor(226, 232, 240);
      doc.line(15, currentY - 4, 195, currentY - 4);

      // Generate real QR code image
      const origin = window.location.origin || 'http://localhost:3000';
      const verifyUrl = `${origin}/verify-prescription/${record.verificationToken}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 120, margin: 1 });

      doc.addImage(qrDataUrl, 'PNG', 15, currentY, 26, 26);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 138);
      doc.text('OFFICIAL VERIFICATION TOKEN:', 45, currentY + 6);
      doc.setFont('courier', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(record.verificationToken, 45, currentY + 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Scan the QR code or visit /verify-prescription to verify authenticity.', 45, currentY + 17);
      doc.text(`Prescription finalized on ${record.finalizedAt ? new Date(record.finalizedAt).toLocaleString() : record.visitDate}`, 45, currentY + 22);

      // Right Doctor Signature Line
      doc.setDrawColor(148, 163, 184);
      doc.line(140, currentY + 18, 195, currentY + 18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text('Registered Medical Officer', 140, currentY + 22);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text('JSTU Health & Medical Services', 140, currentY + 26);

      // Bottom Safety Disclaimer
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(153, 27, 27); // Danger Red
      doc.text(
        'DEMO PROTOTYPE ONLY — All medical entries are fictional. This document does not constitute real medical advice.',
        105,
        286,
        { align: 'center' }
      );

      // Save PDF
      doc.save(`JSTU-Prescription-${record.appointmentRef}.pdf`);
    } catch (err) {
      console.error('PDF generation error', err);
      alert('Unable to generate PDF prescription. Please retry.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // M3: Download Medical Rest Certificate PDF
  // Neutral header, rest period, QR, short hash, DEMO watermark, NO DIAGNOSIS or health details
  const handleDownloadCertificatePdf = async (cert: MedicalRestCertificate) => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // 1. Watermark
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(40);
      doc.setTextColor(235, 235, 235);
      doc.text('DEMO ONLY', 45, 130, { angle: 45 });
      doc.text('NOT AN OFFICIAL CERTIFICATE', 18, 180, { angle: 45 });

      // 2. Official Header
      doc.setTextColor(30, 58, 138); // #1E3A8A
      doc.setFontSize(15);
      doc.text('JAMALPUR SCIENCE & TECHNOLOGY UNIVERSITY', 105, 25, { align: 'center' });

      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42); // #0F172A
      doc.text('CENTRAL UNIVERSITY MEDICAL CENTER', 105, 32, { align: 'center' });

      doc.setFontSize(10);
      doc.setTextColor(180, 83, 9); // Gold #B45309
      doc.text('OFFICIAL MEDICAL REST CERTIFICATE (PROTOTYPE EVALUATION)', 105, 38, { align: 'center' });

      doc.setDrawColor(226, 232, 240);
      doc.line(20, 42, 190, 42);

      // Status indicator
      doc.setFontSize(10);
      if (cert.status === 'VALID') {
        doc.setTextColor(22, 101, 52);
      } else if (cert.status === 'SUPERSEDED') {
        doc.setTextColor(146, 64, 14);
      } else {
        doc.setTextColor(153, 27, 27);
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`CERTIFICATE STATUS: ${cert.status} (VERSION ${cert.version})`, 105, 50, { align: 'center' });

      // Certificate Body Card
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.rect(20, 56, 170, 78, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text('TO WHOM IT MAY CONCERN', 26, 65);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text(
        `This is to certify that ${cert.patientName} (Student / Member ID: ${cert.patientId}), enrolled in the`,
        26,
        74
      );
      doc.text(
        `Department of ${cert.patientDepartment}, attended the JSTU Medical Center for clinical consultation.`,
        26,
        80
      );

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('AUTHORIZED REST PERIOD (MEDICAL REST LEAVE):', 26, 92);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(11);
      doc.text(
        `From: ${cert.restStartDate}     To: ${cert.restEndDate}     (${cert.restDays} Days Rest)`,
        26,
        100
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(
        'In strict accordance with student privacy guidelines, this certificate contains NO clinical diagnosis',
        26,
        110
      );
      doc.text(
        'or health symptoms. It is issued solely to support official departmental leave requests.',
        26,
        116
      );
      doc.text(
        `Issuing Authority: ${cert.doctorRole} — ${cert.centerName}`,
        26,
        124
      );

      // 3. Cryptographic Verification Block & QR Code
      const origin = window.location.origin || 'http://localhost:3000';
      const verifyUrl = `${origin}/verify-medical/${cert.verificationId}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 120, margin: 1 });

      doc.addImage(qrDataUrl, 'PNG', 20, 146, 30, 30);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 138);
      doc.text('DIGITAL VERIFICATION & AUDIT PROOF', 56, 152);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text('128-bit Verification ID:', 56, 158);
      doc.setFont('courier', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(cert.verificationId, 56, 163);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text('Canonical SHA-256 Hash:', 56, 169);
      doc.setFont('courier', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(cert.canonicalHash, 56, 174);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Scan the QR code or verify online at /verify-medical to inspect status validity.', 56, 180);

      // Sign-off
      doc.setDrawColor(148, 163, 184);
      doc.line(130, 215, 190, 215);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text('Registered Medical Officer', 130, 220);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('JSTU Health & Medical Services', 130, 225);

      // Footer notice
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(153, 27, 27);
      doc.text(
        'DEMO - not an official medical certificate. Student project / prototype evaluation only.',
        105,
        284,
        { align: 'center' }
      );

      doc.save(`JSTU-Medical-Rest-${cert.verificationId.slice(0, 8)}.pdf`);
    } catch (err) {
      console.error('PDF error', err);
      alert('Unable to generate PDF certificate. Please retry.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // M3: Copy verification URL to clipboard
  const handleCopyVerificationLink = (cert: MedicalRestCertificate) => {
    const origin = window.location.origin || 'http://localhost:3000';
    const link = `${origin}/verify-medical/${cert.verificationId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopyFeedbackId(cert.id);
      setTimeout(() => setCopyFeedbackId(null), 3000);
    });
  };

  // M3: Open Medical Leave Modal prefilled with certificate details
  const handleOpenApplyForLeaveModal = (cert: MedicalRestCertificate) => {
    setSelectedCertForLeave(cert);
    setLeaveErrorMsg(null);
    setLeaveSuccessMsg(null);
    setLeaveReason(
      `Medical rest leave as certified by JSTU Medical Center (Certificate #${cert.verificationId.slice(0, 8)}) for the period ${cert.restStartDate} to ${cert.restEndDate}.`
    );
    setIsLeaveModalOpen(true);
  };

  // M3: Submit Medical Leave via Paperless Workflow Service
  const handleSubmitMedicalLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCertForLeave || !user) return;
    setLeaveErrorMsg(null);
    setLeaveSuccessMsg(null);
    setLeaveSubmitting(true);

    try {
      const workflowService = getApplicationWorkflowService();
      const applicantUid = user.uid || 'demo_student_01';
      const studentName = user.displayName || profile?.fullName || 'Tanvir Ahmed';
      const studentId = profile?.studentId || 'JSTU2026001';
      const studentEmail = user.email || 'student.demo@jstu.ac.bd';
      const studentDepartment = profile?.departmentId || 'CSE';

      const app = await workflowService.submitApplication({
        type: 'leave',
        title: `Medical Rest Leave (${selectedCertForLeave.restStartDate} to ${selectedCertForLeave.restEndDate})`,
        titleBn: `চিকিৎসাজনিত ছুটির আবেদন (${selectedCertForLeave.restStartDate} হতে ${selectedCertForLeave.restEndDate})`,
        applicantUid,
        studentName,
        studentId,
        studentEmail,
        studentDepartment,
        formData: {
          leaveType: 'medical',
          startDate: selectedCertForLeave.restStartDate,
          endDate: selectedCertForLeave.restEndDate,
          durationDays: selectedCertForLeave.restDays,
          attachedCertificateId: selectedCertForLeave.verificationId,
          attachedCertificateRef: selectedCertForLeave.id,
          attachedCertificateStatus: selectedCertForLeave.status,
          doctorRole: selectedCertForLeave.doctorRole,
          reason: leaveReason.trim()
        }
      });

      setLeaveSuccessMsg(
        isBn
          ? `ছুটির আবেদন সফলভাবে দাখিল করা হয়েছে (আবেদন নম্বর: ${app.applicationNumber})। বিভাগীয় চেয়ারম্যানের টেবিলে অনুমোদনের জন্য প্রেরিত হয়েছে।`
          : `Medical leave application submitted successfully (Ref: ${app.applicationNumber}). Forwarded to Department Chairman for review.`
      );
    } catch (err: any) {
      setLeaveErrorMsg(err.message || 'Failed to submit leave application.');
    } finally {
      setLeaveSubmitting(false);
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status: MedicalAppointmentStatus) => {
    switch (status) {
      case 'Confirmed':
        return <Badge variant="primary">{isBn ? 'নিশ্চিত' : 'Confirmed'}</Badge>;
      case 'Requested':
        return <Badge variant="warning">{isBn ? 'অপেক্ষমাণ' : 'Requested'}</Badge>;
      case 'Completed':
        return <Badge variant="success">{isBn ? 'সম্পন্ন' : 'Completed'}</Badge>;
      case 'Cancelled':
        return <Badge variant="danger">{isBn ? 'বাতিল' : 'Cancelled'}</Badge>;
      case 'No-show':
        return <Badge variant="neutral">{isBn ? 'অনুপস্থিত' : 'No-show'}</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchStatus =
        statusFilter === 'all' || apt.status.toLowerCase() === statusFilter.toLowerCase();
      const matchSearch =
        searchQuery === '' ||
        apt.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.appointmentDate.includes(searchQuery);
      return matchStatus && matchSearch;
    });
  }, [appointments, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <SEOHead
        title={isBn ? 'চিকিৎসা সেবা ও প্রেসক্রিপশন - জেএসটিইউ' : 'Medical Services & Health Records - JSTU'}
        description="Book doctor consultations, manage appointments, and download verified digital prescriptions."
      />

      {/* -------------------------------------------------------------
          1. MANDATORY SAFETY DISCLAIMER BANNER
         ------------------------------------------------------------- */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
          <span className="font-bold uppercase tracking-wide mr-1.5 bg-amber-200 text-amber-900 px-2 py-0.5 rounded text-[10px]">
            {isBn ? 'সতর্কতা' : 'Notice'}
          </span>
          {isBn
            ? 'ডেমো প্রোটোটাইপ। এটি কোনো চিকিৎসা উপদেশ নয়। জরুরি প্রয়োজনে সরাসরি মেডিকেল সেন্টারে যোগাযোগ করুন বা জরুরি অ্যাম্বুলেন্স নম্বরে (+880 1700-000010) কল করুন।'
            : 'Demo only. This is not medical advice. In an emergency contact the university medical center or call local emergency services (+880 1700-000010).'}
        </div>
      </div>

      {/* -------------------------------------------------------------
          2. HEADER TITLE & TABS
         ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-[#1E3A8A]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              {isBn ? 'মেডিকেল সেন্টার ও প্রেসক্রিপশন পোর্টাল' : 'Medical Center & Health Records'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isBn
              ? 'বিশ্ববিদ্যালয় মেডিকেল সেন্টারের অ্যাপয়েন্টমেন্ট বুকিং, প্রেসক্রিপশন ডাউনলোড ও অডিট ট্র্যাকিং।'
              : 'Book consultation slots, view visit notes, download digital prescriptions, and review access privacy.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('book')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'book'
                ? 'bg-white text-[#1E3A8A] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            {isBn ? 'নতুন অ্যাপয়েন্টমেন্ট নিন' : 'Book Appointment'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my-appointments')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'my-appointments'
                ? 'bg-white text-[#1E3A8A] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            {isBn ? 'আমার অ্যাপয়েন্টমেন্ট' : 'My Appointments'} ({appointments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my-records')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'my-records'
                ? 'bg-white text-[#1E3A8A] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            {isBn ? 'আমার স্বাস্থ্য রেকর্ড' : 'My Health Records'} ({healthRecords.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my-certificates')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'my-certificates'
                ? 'bg-white text-[#1E3A8A] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            {isBn ? 'আমার রেস্ট সনদ' : 'My Certificates'} ({certificates.length})
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          3. TAB 1: BOOK NEW APPOINTMENT (WITH ZOD VALIDATION)
         ------------------------------------------------------------- */}
      {activeTab === 'book' && (
        <div className="max-w-3xl space-y-6">
          {/* Submission Success Alert */}
          {submitSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>
                  {isBn
                    ? 'অ্যাপয়েন্টমেন্ট সফলভাবে অনুরোধ করা হয়েছে!'
                    : 'Appointment Successfully Requested!'}
                </span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {isBn
                  ? `আপনার রেফারেন্স নম্বর:`
                  : `Your tracking reference number is`}{' '}
                <strong className="font-mono bg-emerald-200/60 px-2 py-0.5 rounded text-emerald-950">
                  {submitSuccess.referenceNumber}
                </strong>
                .{' '}
                {isBn
                  ? 'কর্তব্যরত চিকিৎসা কর্মকর্তা এটি নিশ্চিত করলে আপনি নোটিফিকেশন পাবেন।'
                  : 'You will receive a portal notification once the duty officer confirms the slot.'}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab('my-appointments')}
                >
                  {isBn ? 'অ্যাপয়েন্টমেন্ট তালিকা দেখুন' : 'View My Appointments'}
                </Button>
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(null)}
                  className="text-xs text-emerald-800 hover:underline font-semibold"
                >
                  {isBn ? 'নতুন আরেকটি আবেদন করুন' : 'Book Another'}
                </button>
              </div>
            </div>
          )}

          <Card className="p-6 border border-[#E2E8F0] space-y-6 shadow-2xs">
            <div className="border-b border-[#E2E8F0] pb-3">
              <h2 className="text-base font-bold text-[#0F172A]">
                {isBn ? 'চিকিৎসক পরামর্শের জন্য স্লট নির্বাচন' : 'Consultation Slot Selection'}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {isBn
                  ? 'ডাক্তার ও তারিখ অনুযায়ী ফাঁকা স্লট বেছে নিন। ডাবল বুকিং স্বয়ংক্রিয়ভাবে প্রতিরোধ করা হয়।'
                  : 'Select physician and available slot. Double-booking is automatically prevented.'}
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-5">
              {formErrors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formErrors.submit}</span>
                </div>
              )}

              {/* 1. Doctor Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0F172A] block">
                  {isBn ? 'পছন্দের চিকিৎসক নির্বাচন করুন' : 'Select Doctor'} *
                </label>
                <select
                  value={formData.doctorId}
                  onChange={(e) =>
                    setFormData({ ...formData, doctorId: e.target.value, timeSlot: '' })
                  }
                  className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                >
                  <option value="any">
                    {isBn ? 'যেকোনো উপলব্ধ ডাক্তার (Any Available)' : 'Any Available Duty Doctor'}
                  </option>
                  {initialMedicalDoctorsData.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {isBn ? doc.nameBn : doc.name} — {doc.specialty}
                    </option>
                  ))}
                </select>
                {formErrors.doctorId && (
                  <p className="text-[11px] text-red-600">{formErrors.doctorId}</p>
                )}
              </div>

              {/* 2. Date Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0F172A] block">
                  {isBn ? 'পরামর্শের তারিখ' : 'Consultation Date'} *
                </label>
                <select
                  value={formData.appointmentDate}
                  onChange={(e) =>
                    setFormData({ ...formData, appointmentDate: e.target.value, timeSlot: '' })
                  }
                  className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                >
                  {availableDates.map((item) => (
                    <option key={item.dateStr} value={item.dateStr}>
                      {isBn ? item.labelBn : item.labelEn}
                    </option>
                  ))}
                </select>
                {formErrors.appointmentDate && (
                  <p className="text-[11px] text-red-600">{formErrors.appointmentDate}</p>
                )}
              </div>

              {/* 3. Slot Selector (Conflict-free roster shifts) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0F172A]">
                    {isBn ? 'ডিউটি রোস্টার অনুযায়ী উপলব্ধ সময় স্লট' : 'Available Time Slots'} *
                  </label>
                  <span className="text-[11px] text-slate-600">
                    {availableSlots.filter((s) => !s.isOccupied).length} {isBn ? 'টি স্লট খালি' : 'available'}
                  </span>
                </div>

                {availableSlots.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600">
                    {isBn
                      ? 'নির্বাচিত দিনে এই চিকিৎসকের কোনো নির্ধারিত ডিউটি শিফট নেই। অনুগ্রহ করে অন্য দিন নির্বাচন করুন।'
                      : 'No scheduled shifts found for the selected day/doctor. Please choose an alternate date.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {availableSlots.map((slot) => {
                      const isSelected = formData.timeSlot === slot.timeSlot && !slot.isOccupied;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={slot.isOccupied}
                          onClick={() => setFormData({ ...formData, timeSlot: slot.timeSlot })}
                          className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer relative ${
                            slot.isOccupied
                              ? 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed opacity-75'
                              : isSelected
                              ? 'bg-blue-50/80 border-[#1E3A8A] text-[#1E3A8A] font-bold shadow-xs ring-2 ring-[#1E3A8A]/20'
                              : 'bg-white border-[#E2E8F0] text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-mono font-semibold text-xs flex items-center justify-between">
                            <span>{slot.timeSlot}</span>
                            {slot.isOccupied ? (
                              <span className="text-[9px] uppercase tracking-wider text-red-600 bg-red-100 px-1 py-0.5 rounded font-bold">
                                Booked
                              </span>
                            ) : isSelected ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
                            ) : null}
                          </div>
                          <div className="text-[10px] text-slate-600 mt-1 truncate">
                            {slot.doctorName}
                          </div>
                          <div className="text-[10px] text-slate-600 font-mono">
                            {slot.roomNumber}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                {formErrors.timeSlot && (
                  <p className="text-[11px] text-red-600">{formErrors.timeSlot}</p>
                )}
              </div>

              {/* 4. Reason (300 character limit) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0F172A]">
                    {isBn ? 'পরামর্শের সংক্ষিপ্ত কারণ (সর্বোচ্চ ৩০০ অক্ষর)' : 'Brief Reason for Consultation'} *
                  </label>
                  <span className="text-[11px] font-mono text-slate-600">
                    {formData.reason.length}/300
                  </span>
                </div>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder={
                    isBn
                      ? 'সংক্ষেপে আপনার শারীরিক সমস্যা বা কারণ উল্লেখ করুন (যেমন: জ্বর ও কাশি, নিয়মিত স্বাস্থ্য পরীক্ষা)...'
                      : 'Briefly state your consultation reason or symptoms (e.g. fever for 2 days, routine eye strain checkup)...'
                  }
                  rows={3}
                  maxLength={300}
                  className="w-full text-xs p-3 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
                {formErrors.reason && (
                  <p className="text-[11px] text-red-600">{formErrors.reason}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isLoading || !formData.timeSlot}
                  className="w-full sm:w-auto bg-[#1E3A8A] hover:bg-[#1E40AF]"
                >
                  {isLoading
                    ? isBn
                      ? 'জমা হচ্ছে...'
                      : 'Submitting...'
                    : isBn
                    ? 'অ্যাপয়েন্টমেন্ট নিশ্চিতের জন্য পাঠান'
                    : 'Confirm & Book Appointment'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* -------------------------------------------------------------
          4. TAB 2: MY APPOINTMENTS LIST & STATUS
         ------------------------------------------------------------- */}
      {activeTab === 'my-appointments' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'রেফারেন্স বা ডাক্তারের নাম দিয়ে খুঁজুন...' : 'Search by reference or doctor...'}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['all', 'Requested', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-colors cursor-pointer shrink-0 ${
                    statusFilter === status
                      ? 'bg-[#1E3A8A] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-[#F8FAFC] border border-[#E2E8F0]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments Cards / Table */}
          {filteredAppointments.length === 0 ? (
            <Card className="p-12 text-center text-slate-600 space-y-2 border border-[#E2E8F0]">
              <HeartPulse className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                {isBn ? 'কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি' : 'No medical appointments found'}
              </p>
              <p className="text-xs text-slate-600">
                {isBn
                  ? 'নতুন অ্যাপয়েন্টমেন্ট নিতে "Book Appointment" ট্যাবে যান।'
                  : 'Click on the "Book Appointment" tab to request a consultation.'}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredAppointments.map((apt) => (
                <Card
                  key={apt.id}
                  className="p-5 border border-[#E2E8F0] hover:border-slate-300 transition-colors space-y-4 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {apt.referenceNumber}
                      </span>
                      <span className="text-xs text-slate-600">
                        {isBn ? 'বুকিং সময়:' : 'Booked:'} {new Date(apt.bookedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(apt.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
                    <div className="space-y-1">
                      <span className="text-slate-600 font-medium">{isBn ? 'চিকিৎসক' : 'Physician'}:</span>
                      <p className="font-bold text-[#0F172A]">{apt.doctorName}</p>
                      <p className="text-slate-600 text-[11px]">{apt.doctorSpecialty}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-600 font-medium">{isBn ? 'তারিখ ও স্লট' : 'Schedule'}:</span>
                      <p className="font-bold text-[#0F172A] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#1E3A8A]" />
                        {apt.appointmentDate}
                      </p>
                      <p className="font-mono text-slate-600 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                        {apt.timeSlot}
                      </p>
                    </div>

                    <div className="space-y-1 sm:col-span-1">
                      <span className="text-slate-600 font-medium">{isBn ? 'আবেদনের কারণ' : 'Reason'}:</span>
                      <p className="text-slate-800 bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0] text-[11px] leading-relaxed">
                        {apt.reason}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setIsAuditModalOpen(true);
                      }}
                      className="text-xs font-semibold text-[#1E3A8A] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isBn ? 'অডিট ট্রেইল দেখুন' : 'Audit Trail & Details'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Completed appointment: Quick link to health records */}
                      {apt.status === 'Completed' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setActiveTab('my-records')}
                          className="bg-[#1E3A8A] hover:bg-[#1E40AF]"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          {isBn ? 'প্রেসক্রিপশন দেখুন' : 'View Prescription'}
                        </Button>
                      )}

                      {/* Cancel Allowed if Requested or Confirmed */}
                      {(apt.status === 'Requested' || apt.status === 'Confirmed') && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setRescheduleDate(apt.appointmentDate);
                              setRescheduleSlot('');
                              setIsRescheduleModalOpen(true);
                            }}
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            {isBn ? 'সময় পরিবর্তন' : 'Reschedule'}
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setIsCancelModalOpen(true);
                            }}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            {isBn ? 'বাতিল করুন' : 'Cancel'}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          5. TAB 3: MY HEALTH RECORDS & PRESCRIPTIONS (M2)
         ------------------------------------------------------------- */}
      {activeTab === 'my-records' && (
        <div className="space-y-6">
          {/* Header & Access Log Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                {isBn ? 'আমার ব্যক্তিগত স্বাস্থ্য ও প্রেসক্রিপশন রেকর্ড' : 'Personal Clinical & Prescription Records'}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {isBn
                  ? 'কর্তব্যরত চিকিৎসকদের চূড়ান্ত পরামর্শ ও প্রেসক্রিপশন। নিরাপদ কিউআর কোডসহ পিডিএফ ডাউনলোড করুন।'
                  : 'Finalized clinical visit notes and verifiable prescriptions with downloadable PDFs and QR verification.'}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAccessLogModalOpen(true)}
              leftIcon={<Lock className="w-3.5 h-3.5 text-[#1E3A8A]" />}
              className="bg-white"
            >
              {isBn ? 'রেকর্ড অ্যাক্সেস অডিট লগ' : 'Who Accessed My Records'}
            </Button>
          </div>

          {healthRecords.length === 0 ? (
            <Card className="p-12 text-center text-slate-600 space-y-2 border border-[#E2E8F0]">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                {isBn ? 'কোনো চূড়ান্ত স্বাস্থ্য রেকর্ড পাওয়া যায়নি' : 'No finalized health records found'}
              </p>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {isBn
                  ? 'আপনার অ্যাপয়েন্টমেন্ট সম্পন্ন হওয়ার পর ডাক্তার ভিজিট নোট চূড়ান্ত করলে এখানে প্রেসক্রিপশন দৃশ্যমান হবে।'
                  : 'Once an appointment is completed and finalized by the duty medical officer, your prescription will appear here.'}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {healthRecords.map((record) => (
                <Card
                  key={record.id}
                  className="p-5 border border-[#E2E8F0] hover:border-slate-300 transition-colors space-y-4 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-[#1E3A8A] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                        {record.appointmentRef}
                      </span>
                      <span className="text-xs text-slate-600">
                        {isBn ? 'ভিজিট তারিখ:' : 'Visit Date:'} {record.visitDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={record.status === 'FINALIZED' ? 'success' : 'neutral'}>
                        {record.status}
                      </Badge>
                      <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        Token: {record.verificationToken}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-600 font-medium block">{isBn ? 'চিকিৎসক' : 'Physician'}:</span>
                      <p className="font-bold text-[#0F172A]">{record.doctorName}</p>
                      <p className="text-slate-600 text-[11px]">{record.doctorSpecialty}</p>
                    </div>

                    <div>
                      <span className="text-slate-600 font-medium block">{isBn ? 'উপসর্গ ও লক্ষণ' : 'Chief Complaint'}:</span>
                      <p className="text-slate-800 line-clamp-2 text-[11px] leading-relaxed">
                        {record.complaint}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-600 font-medium block">
                        {isBn ? 'প্রেসক্রিপশন আইটেম' : 'Prescription Items'}:
                      </span>
                      <p className="font-bold text-[#0F172A]">
                        {record.prescriptionItems.length} {isBn ? 'টি ওষুধ অন্তর্ভুক্ত' : 'medication(s)'}
                      </p>
                      {record.sickRestDays && (
                        <p className="text-amber-800 text-[11px] font-semibold mt-0.5">
                          {isBn ? `বিশ্রামের সুপারিশ: ${record.sickRestDays} দিন` : `Sick Leave: ${record.sickRestDays} day(s)`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions: View Details & Download PDF */}
                  <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                    <div className="text-[11px] text-amber-800 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                      <span>DEMO - not a real medical record</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedHealthRecord(record);
                          setIsRecordDetailModalOpen(true);
                        }}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        {isBn ? 'বিস্তারিত দেখুন' : 'View Record'}
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        disabled={isGeneratingPdf}
                        onClick={() => handleDownloadPrescriptionPdf(record)}
                        className="bg-[#1E3A8A] hover:bg-[#1E40AF]"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        {isBn ? 'প্রেসক্রিপশন ডাউনলোড (PDF)' : 'Download Prescription (PDF)'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          5. TAB 4: MY MEDICAL REST CERTIFICATES (M3)
         ------------------------------------------------------------- */}
      {activeTab === 'my-certificates' && (
        <div className="space-y-4">
          {/* Privacy & Safety Warning */}
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-semibold text-amber-900 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider">
                DEMO - not an official medical certificate
              </span>
              <span className="text-[10px] font-mono text-amber-800">
                Center: JSTU Medical Center
              </span>
            </div>
            <p className="text-[11px] text-amber-950 font-normal leading-relaxed">
              {isBn
                ? 'আইনগত ও গোপনীয়তার স্বার্থে মেডিকেল রেস্ট সনদে কোনো ক্লিনিক্যাল ডায়াগনসিস বা স্বাস্থ্য বিবরণ থাকে না। শুধুমাত্র নাম, আইডি, কেন্দ্র, অনুমোদিত বিশ্রামের মেয়াদ ও ডাক্তারের ভূমিকা উল্লেখিত থাকে।'
                : 'The certificate and everything derived from it contains NO diagnosis and NO health details. It states only: patient name and ID, the center, rest period (from date, to date, number of days), and the doctor role. The student never has to share the visit note.'}
            </p>
          </div>

          {copyFeedbackId && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isBn ? 'পাবলিক ভেরিফিকেশন লিংক ক্লিপবোর্ডে কপি করা হয়েছে!' : 'Public certificate verification link copied to clipboard!'}
              </span>
            </div>
          )}

          {leaveSuccessMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{leaveSuccessMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setLeaveSuccessMsg(null)}
                className="text-slate-600 hover:text-slate-900 font-bold ml-2"
              >
                &times;
              </button>
            </div>
          )}

          {certificates.length === 0 ? (
            <Card className="p-12 text-center text-slate-600 space-y-2 border border-[#E2E8F0]">
              <Award className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                {isBn ? 'কোনো মেডিকেল রেস্ট সনদ ইস্যু করা হয়নি' : 'No Medical Rest Certificates Issued Yet'}
              </p>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'ডাক্তার অ্যাপয়েন্টমেন্ট সম্পন্ন করে বিশ্রামের দিন সুপারিশ করলে সনদপত্র তৈরি হবে।'
                  : 'Certificates are issued by the medical officer from finalized visit records with prescribed rest days.'}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {certificates.map((cert) => (
                <Card
                  key={cert.id}
                  className="p-5 border border-[#E2E8F0] hover:border-slate-300 transition-colors space-y-4 shadow-2xs bg-white"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[#0F172A] text-xs sm:text-sm">
                            Medical Rest Certificate #{cert.verificationId.slice(0, 8)}
                          </h3>
                          <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-semibold">
                            v{cert.version}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {cert.centerName} &bull; Issued {new Date(cert.issuedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          cert.status === 'VALID'
                            ? 'success'
                            : cert.status === 'SUPERSEDED'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {cert.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Rest Period & Neutral Particulars */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {isBn ? 'অনুমোদিত ছুটির মেয়াদ' : 'Rest Period'}
                      </span>
                      <p className="font-bold text-[#1E3A8A] font-mono text-xs sm:text-sm">
                        {cert.restStartDate} &rarr; {cert.restEndDate}
                      </p>
                      <p className="text-[11px] text-slate-600 font-medium">
                        Total {cert.restDays} Day(s) Medical Rest
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {isBn ? 'ইস্যুকারী কর্তৃপক্ষ' : 'Issuing Authority'}
                      </span>
                      <p className="font-semibold text-slate-900">{cert.doctorRole}</p>
                      <p className="text-[11px] text-slate-600">{cert.centerName}</p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {isBn ? 'ক্রিপ্টোগ্রাফিক প্রুফ' : 'Verification ID & Hash'}
                      </span>
                      <p className="font-mono text-[11px] text-slate-800 truncate" title={cert.verificationId}>
                        ID: {cert.verificationId}
                      </p>
                      <p className="font-mono text-[10px] text-slate-500 truncate" title={cert.canonicalHash}>
                        SHA-256: {cert.canonicalHash.slice(0, 16)}...
                      </p>
                    </div>
                  </div>

                  {/* Superseded / Revocation Banners */}
                  {cert.status === 'SUPERSEDED' && (
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block">Notice: This certificate has been SUPERSEDED by an updated version.</strong>
                        {cert.supersededReason && <span>Reason: {cert.supersededReason}</span>}
                      </div>
                    </div>
                  )}

                  {cert.status === 'REVOKED' && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs rounded-xl flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block">Warning: This certificate has been REVOKED and is invalid for academic leave.</strong>
                        {cert.revocationReason && <span>Reason: {cert.revocationReason}</span>}
                      </div>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      {/* Copy Link */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyVerificationLink(cert)}
                        leftIcon={
                          copyFeedbackId === cert.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )
                        }
                      >
                        {copyFeedbackId === cert.id
                          ? (isBn ? 'লিংক কপি হয়েছে!' : 'Link Copied!')
                          : (isBn ? 'ভেরিফিকেশন লিংক কপি' : 'Copy Verification Link')}
                      </Button>

                      {/* Verify Public */}
                      <Link
                        to={`/verify-medical/${cert.verificationId}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs text-[#1E3A8A] hover:underline font-semibold px-2 py-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{isBn ? 'অনলাইনে যাচাই' : 'Verify Online'}</span>
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Download PDF */}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isGeneratingPdf}
                        onClick={() => handleDownloadCertificatePdf(cert)}
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                      >
                        {isBn ? 'সনদ ডাউনলোড (PDF)' : 'Download Certificate (PDF)'}
                      </Button>

                      {/* Apply for Medical Leave Shortcut */}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenApplyForLeaveModal(cert)}
                        leftIcon={<Send className="w-3.5 h-3.5" />}
                        className="bg-[#1E3A8A] hover:bg-[#1E40AF]"
                      >
                        {isBn ? 'ছুটির আবেদন করুন' : 'Apply for Medical Leave'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          6. M2: HEALTH RECORD DETAIL MODAL
         ------------------------------------------------------------- */}
      {isRecordDetailModalOpen && selectedHealthRecord && (
        <Modal
          isOpen={isRecordDetailModalOpen}
          onClose={() => setIsRecordDetailModalOpen(false)}
          title={isBn ? 'প্রেসক্রিপশন ও স্বাস্থ্য রেকর্ড বিবরণ' : 'Clinical Record & Prescription Details'}
        >
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
            <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-xs font-bold text-amber-900 text-center">
              DEMO - not a real medical record • For System Evaluation
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-600 block">{isBn ? 'চিকিৎসক:' : 'Attending Physician:'}</span>
                <span className="font-bold text-[#0F172A]">{selectedHealthRecord.doctorName}</span>
                <span className="text-[11px] text-slate-600 block">{selectedHealthRecord.doctorSpecialty}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-600 block">{isBn ? 'রেফারেন্স:' : 'Reference:'}</span>
                <span className="font-mono font-bold text-[#1E3A8A]">{selectedHealthRecord.appointmentRef}</span>
                <span className="text-[11px] text-slate-600 block">{selectedHealthRecord.visitDate}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl space-y-1">
                <span className="font-bold text-[#1E3A8A] block">{isBn ? 'উপসর্গ / অভিযোগ:' : 'Chief Complaint:'}</span>
                <p className="text-slate-800 leading-relaxed">{selectedHealthRecord.complaint}</p>
              </div>

              <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl space-y-1">
                <span className="font-bold text-[#1E3A8A] block">{isBn ? 'পর্যবেক্ষণ:' : 'Clinical Observation:'}</span>
                <p className="text-slate-800 leading-relaxed">{selectedHealthRecord.observation}</p>
              </div>

              <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl space-y-1">
                <span className="font-bold text-[#1E3A8A] block">{isBn ? 'চিকিৎসা পরামর্শ:' : 'Medical Advice:'}</span>
                <p className="text-slate-800 leading-relaxed">{selectedHealthRecord.advice}</p>
              </div>

              {selectedHealthRecord.sickRestDays && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                  <strong>{isBn ? 'ছুটি / বিশ্রামের সুপারিশ: ' : 'Sick Leave Recommendation: '}</strong>
                  {selectedHealthRecord.sickRestDays} {isBn ? 'দিন' : 'day(s)'}
                </div>
              )}
            </div>

            {/* Medications Table */}
            <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                {isBn ? 'প্রেসক্রিপশন তালিকা (Rx)' : 'Prescribed Medications (Rx)'}
              </h4>
              <div className="space-y-2">
                {selectedHealthRecord.prescriptionItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0F172A]">
                        {index + 1}. {item.medicine}
                      </span>
                      <span className="font-mono text-[10px] text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded">
                        {item.duration}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-700">
                      <strong>{isBn ? 'মাত্রা: ' : 'Dose: '}</strong>{item.dose}
                    </div>
                    {item.instructions && (
                      <div className="text-[11px] text-slate-600">
                        <strong>{isBn ? 'নির্দেশনা: ' : 'Instructions: '}</strong>{item.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Addenda if present */}
            {selectedHealthRecord.addenda && selectedHealthRecord.addenda.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  {isBn ? 'চিকিৎসক পরিশিষ্ট ও সংশোধন' : 'Clinical Addenda & Corrections'}
                </h4>
                {selectedHealthRecord.addenda.map((ad) => (
                  <div key={ad.id} className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-amber-900 font-bold">
                      <span>Addendum by {ad.createdByName}</span>
                      <span className="font-mono">{new Date(ad.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-800">
                      <strong>Reason: </strong>{ad.reason}
                    </p>
                    <p className="text-slate-800">
                      <strong>Notes: </strong>{ad.correctionNotes}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-between items-center pt-3 border-t border-[#E2E8F0]">
              <Link
                to={`/verify-prescription/${selectedHealthRecord.verificationToken}`}
                target="_blank"
                className="text-xs font-semibold text-[#1E3A8A] hover:underline inline-flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isBn ? 'পাবলিক ভেরিফিকেশন পেজ' : 'Public Verification Page'}</span>
              </Link>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsRecordDetailModalOpen(false)}>
                  {isBn ? 'বন্ধ করুন' : 'Close'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isGeneratingPdf}
                  onClick={() => handleDownloadPrescriptionPdf(selectedHealthRecord)}
                  className="bg-[#1E3A8A] hover:bg-[#1E40AF]"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  {isBn ? 'পিডিএফ ডাউনলোড' : 'Download PDF'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* -------------------------------------------------------------
          7. M2: ACCESS AUDIT LOG MODAL (ROLE AND DATE ONLY)
         ------------------------------------------------------------- */}
      {isAccessLogModalOpen && (
        <Modal
          isOpen={isAccessLogModalOpen}
          onClose={() => setIsAccessLogModalOpen(false)}
          title={isBn ? 'স্বাস্থ্য রেকর্ড অ্যাক্সেস অডিট লগ' : 'Health Record Access Privacy Audit Log'}
        >
          <div className="space-y-4">
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Lock className="w-4 h-4 text-blue-700" />
                <span>{isBn ? 'গোপনীয়তা ও অডিট সুরক্ষা' : 'Strict Patient Privacy Guard'}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {isBn
                  ? 'আপনার স্বাস্থ্য সুরক্ষার স্বার্থে মেডিকেল সেন্টারের ডাক্তার ছাড়া অন্য কারো এই রেকর্ডে প্রবেশাধিকার নেই। প্রতিটি অ্যাক্সেসের ভূমিকা ও সময় নিচে স্থায়ীভাবে সংরক্ষিত রয়েছে।'
                  : 'Only authorized university medical officers examining an active consultation request can open your history. Each access event is recorded below (role and timestamp only).'}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                {isBn ? 'অ্যাক্সেস ইতিহাস (ভূমিকা ও সময়)' : 'Record Access Events (Role & Date only)'}
              </h4>

              {accessLogs.length === 0 ? (
                <p className="text-xs text-slate-600 italic py-4 text-center">
                  {isBn ? 'এখনো কোনো অ্যাক্সেস লগ নেই।' : 'No record access logs recorded yet.'}
                </p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {accessLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg border border-[#E2E8F0] bg-white text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-bold text-[#0F172A]">
                          Role: {log.role}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-600">
                        {new Date(log.date).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsAccessLogModalOpen(false)}>
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* -------------------------------------------------------------
          8. CANCELLATION MODAL
         ------------------------------------------------------------- */}
      {isCancelModalOpen && selectedAppointment && (
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          title={isBn ? 'অ্যাপয়েন্টমেন্ট বাতিল নিশ্চিতকরণ' : 'Confirm Appointment Cancellation'}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-700 leading-relaxed">
              {isBn
                ? 'আপনি কি নিশ্চিত যে আপনি এই অ্যাপয়েন্টমেন্টটি বাতিল করতে চান? বাতিলকৃত স্লট অন্যান্য শিক্ষার্থীদের জন্য উন্মুক্ত হয়ে যাবে।'
                : 'Are you sure you want to cancel this appointment? The slot will immediately become available for other campus members.'}
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] block">
                {isBn ? 'বাতিলের কারণ (ঐচ্ছিক)' : 'Cancellation Reason (Optional)'}
              </label>
              <input
                type="text"
                placeholder={isBn ? 'যেমন: অন্য ক্লাস রয়েছে...' : 'e.g., Schedule conflict with class exam...'}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsCancelModalOpen(false)}>
                {isBn ? 'ফিরে যান' : 'Keep Appointment'}
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmCancel}>
                {isBn ? 'হ্যাঁ, বাতিল করুন' : 'Confirm Cancellation'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* -------------------------------------------------------------
          9. RESCHEDULE MODAL
         ------------------------------------------------------------- */}
      {isRescheduleModalOpen && selectedAppointment && (
        <Modal
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          title={isBn ? 'অ্যাপয়েন্টমেন্ট সময় পরিবর্তন (Reschedule)' : 'Reschedule Medical Appointment'}
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] block">
                {isBn ? 'নতুন তারিখ নির্বাচন করুন' : 'Select New Date'} *
              </label>
              <select
                value={rescheduleDate}
                onChange={(e) => {
                  setRescheduleDate(e.target.value);
                  setRescheduleSlot('');
                }}
                className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-xl"
              >
                {availableDates.map((item) => (
                  <option key={item.dateStr} value={item.dateStr}>
                    {isBn ? item.labelBn : item.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] block">
                {isBn ? 'নতুন সময় স্লট' : 'Select New Slot'} *
              </label>
              {rescheduleAvailableSlots.length === 0 ? (
                <p className="text-xs text-slate-600 italic">
                  {isBn ? 'এই দিনে কোনো স্লট নেই।' : 'No slots available on this date.'}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {rescheduleAvailableSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={slot.isOccupied}
                      onClick={() => setRescheduleSlot(slot.timeSlot)}
                      className={`p-2.5 rounded-lg border text-xs text-left cursor-pointer ${
                        slot.isOccupied
                          ? 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed opacity-75'
                          : rescheduleSlot === slot.timeSlot
                          ? 'bg-blue-50 border-[#1E3A8A] text-[#1E3A8A] font-bold'
                          : 'bg-white border-[#E2E8F0] text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-mono font-semibold">{slot.timeSlot}</div>
                      <div className="text-[10px] text-slate-600 truncate">{slot.doctorName}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsRescheduleModalOpen(false)}>
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!rescheduleSlot}
                onClick={handleConfirmReschedule}
              >
                {isBn ? 'সময় পরিবর্তন নিশ্চিত করুন' : 'Confirm Reschedule'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* -------------------------------------------------------------
          10. AUDIT TRAIL MODAL (STRICTLY NO HEALTH DETAILS)
         ------------------------------------------------------------- */}
      {isAuditModalOpen && selectedAppointment && (
        <Modal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          title={isBn ? 'অ্যাপয়েন্টমেন্ট অডিট ট্রেইল ও বিবরণ' : 'Appointment Audit Trail & History'}
        >
          <div className="space-y-4">
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-600">{isBn ? 'রেফারেন্স:' : 'Reference Number:'}</span>
                <span className="font-mono font-bold text-[#1E3A8A]">{selectedAppointment.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{isBn ? 'স্ট্যাটাস:' : 'Current Status:'}</span>
                {getStatusBadge(selectedAppointment.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{isBn ? 'তারিখ ও সময়:' : 'Slot:'}</span>
                <span className="font-medium text-slate-800">
                  {selectedAppointment.appointmentDate} ({selectedAppointment.timeSlot})
                </span>
              </div>
            </div>

            {/* Audit Log Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                {isBn ? 'স্ট্যাটাস পরিবর্তন ইতিহাস' : 'Status Transition Audit Log'}
              </h4>
              <p className="text-[11px] text-slate-600">
                {isBn
                  ? 'প্রতিটি পরিবর্তনের ভূমিকা, অ্যাকশন ও সময় সংরক্ষিত (স্বাস্থ্য তথ্য মুক্ত)।'
                  : 'Immutable log of administrative transitions. Health symptoms excluded from logs.'}
              </p>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {selectedAppointment.auditTrail.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg border border-[#E2E8F0] bg-white text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-[#0F172A] block">{log.action}</span>
                      <span className="text-[10px] text-slate-600">
                        Role: {log.actorRole} {log.note ? `• ${log.note}` : ''}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsAuditModalOpen(false)}>
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* -------------------------------------------------------------
          11. M3: APPLY FOR MEDICAL LEAVE SHORTCUT MODAL
         ------------------------------------------------------------- */}
      {isLeaveModalOpen && selectedCertForLeave && (
        <Modal
          isOpen={isLeaveModalOpen}
          onClose={() => setIsLeaveModalOpen(false)}
          title={isBn ? 'মেডিকেল ছুটির আবেদন (পেপারলেস ওয়ার্কফ্লো)' : 'Apply for Medical Leave (Workflow Integration)'}
          size="md"
        >
          <form onSubmit={handleSubmitMedicalLeave} className="space-y-4">
            {/* Status alerts */}
            {selectedCertForLeave.status === 'REVOKED' && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block">Warning: This certificate has been REVOKED.</strong>
                  Submitting leave with a revoked certificate is not recommended and will trigger an explicit rejection warning to the approver.
                </div>
              </div>
            )}

            {selectedCertForLeave.status === 'SUPERSEDED' && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block">Notice: This certificate has been SUPERSEDED.</strong>
                  An updated version of this certificate exists. The department approver will be notified of this status.
                </div>
              </div>
            )}

            {leaveErrorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{leaveErrorMsg}</span>
              </div>
            )}

            {/* Pre-filled Reference Box */}
            <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-[#0F172A]">Attached Rest Certificate</span>
                <span className="font-mono text-[10px] text-[#1E3A8A] font-bold">
                  #{selectedCertForLeave.verificationId.slice(0, 8)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                <div>
                  <span className="text-slate-500 block">Leave Period:</span>
                  <span className="font-bold text-[#0F172A] font-mono">
                    {selectedCertForLeave.restStartDate} &rarr; {selectedCertForLeave.restEndDate}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Duration:</span>
                  <span className="font-bold text-[#0F172A] font-mono">{selectedCertForLeave.restDays} Day(s)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Issuing Center:</span>
                  <span className="font-medium text-slate-800">{selectedCertForLeave.centerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Approving Authority:</span>
                  <span className="font-medium text-slate-800">Dept. Chairman</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-200">
                Privacy policy: Department Chairman sees only certificate dates and verification validity. Clinical diagnosis and symptoms are never shared.
              </p>
            </div>

            {/* Leave Application Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] block">
                {isBn ? 'ছুটির আবেদনের মন্তব্য / কারণ' : 'Application Statement / Purpose'} *
              </label>
              <textarea
                rows={3}
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setIsLeaveModalOpen(false)}
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={leaveSubmitting}
                className="bg-[#1E3A8A] hover:bg-[#1E40AF]"
              >
                {leaveSubmitting
                  ? (isBn ? 'দাখিল হচ্ছে...' : 'Submitting Application...')
                  : (isBn ? 'আবেদন জমা দিন' : 'Submit Leave Application')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
