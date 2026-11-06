import React, { useState, useEffect, useMemo } from 'react';
import {
  HeartPulse,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Search,
  Filter,
  FileText,
  Stethoscope,
  PhoneCall,
  Activity,
  History,
  ShieldAlert,
  ShieldCheck,
  Edit3,
  Award,
  AlertTriangle,
  FileCheck,
  ExternalLink
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import {
  MedicalAppointment,
  MedicalDutyShift,
  MedicalAppointmentStatus,
  MedicalVisitRecord,
  PrescriptionItem,
  VisitNoteStatus,
  MedicalRestCertificate
} from '../../types/studentLife';
import { initialMedicalDoctorsData } from '../../data/studentLifeSeedData';

export const MedicalOfficerDashboard: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { user, profile } = useAuth();
  const storeManager = SharedDataStoreManager.getInstance();

  const [activeTab, setActiveTab] = useState<'queue' | 'all' | 'roster'>('queue');
  const [appointments, setAppointments] = useState<MedicalAppointment[]>([]);
  const [dutyRoster, setDutyRoster] = useState<MedicalDutyShift[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Roster Management Modal
  const [isAddShiftModalOpen, setIsAddShiftModalOpen] = useState(false);
  const [shiftForm, setShiftForm] = useState({
    doctorId: 'doc-01',
    dayOfWeek: 'Sunday',
    timeSlot: '09:00 AM - 09:30 AM',
    roomNumber: 'Room 101',
    maxPatients: 1
  });

  // Action Confirmation State
  const [selectedAppointment, setSelectedAppointment] = useState<MedicalAppointment | null>(null);
  const [actionType, setActionType] = useState<MedicalAppointmentStatus | null>(null);
  const [actionNote, setActionNote] = useState('');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // M2: Visit Note & Prescription State
  // Real enforcement must move to Firestore rules / Cloud Functions.
  // Real health data needs encryption, strict access rules, a legal basis and university approval, and must not be stored in a browser-only demo.
  const [isVisitNoteModalOpen, setIsVisitNoteModalOpen] = useState(false);
  const [activeVisitRecord, setActiveVisitRecord] = useState<MedicalVisitRecord | null>(null);
  const [noteForm, setNoteForm] = useState({
    complaint: '',
    observation: '',
    advice: '',
    followUpDate: '',
    sickRestDays: '' as number | string,
    prescriptionItems: [] as PrescriptionItem[]
  });
  const [noteFormError, setNoteFormError] = useState('');
  const [noteFormSuccess, setNoteFormSuccess] = useState('');

  // M2: Addendum State for finalized notes
  const [isAddendumModalOpen, setIsAddendumModalOpen] = useState(false);
  const [addendumForm, setAddendumForm] = useState({
    reason: '',
    correctionNotes: ''
  });
  const [addendumError, setAddendumError] = useState('');

  // M2: Patient Medical History State (access restricted and logged)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyTarget, setHistoryTarget] = useState<{
    patientUid: string;
    patientName: string;
    patientId: string;
  } | null>(null);
  const [patientHistoryList, setPatientHistoryList] = useState<MedicalVisitRecord[]>([]);
  const [historyError, setHistoryError] = useState('');

  // M3: Rest Certificate Management State
  // Real enforcement must move to Firestore rules / Cloud Functions.
  // Real signing must happen server-side with a key in a secret manager.
  // The registry must live in a database with rules exposing only the minimal verification fields publicly.
  const [activeCertificate, setActiveCertificate] = useState<MedicalRestCertificate | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateForm, setCertificateForm] = useState({
    restStartDate: todayStr,
    restDays: 3,
    supersededReason: ''
  });
  const [certActionLoading, setCertActionLoading] = useState(false);
  const [certError, setCertError] = useState('');
  const [certSuccess, setCertSuccess] = useState('');

  // Revoke modal state
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [revocationReason, setRevocationReason] = useState('');
  const [revokeError, setRevokeError] = useState('');

  // Load appointments
  // Real enforcement must move to Firestore rules / Cloud Functions.
  const loadData = () => {
    const list = storeManager.getMedicalAppointmentsForStaff(user?.uid);
    setAppointments(list);
    setDutyRoster(storeManager.getMedicalDutyRoster());
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Simple statistics counters
  const stats = useMemo(() => {
    const todayList = appointments.filter((a) => a.appointmentDate === todayStr);
    return {
      todayTotal: todayList.length,
      confirmed: todayList.filter((a) => a.status === 'Confirmed').length,
      requested: todayList.filter((a) => a.status === 'Requested').length,
      completed: todayList.filter((a) => a.status === 'Completed').length,
      noShow: todayList.filter((a) => a.status === 'No-show').length,
      cancelled: todayList.filter((a) => a.status === 'Cancelled').length,
      grandTotal: appointments.length
    };
  }, [appointments, todayStr]);

  // Today's Queue List
  const todayQueue = useMemo(() => {
    return appointments.filter((a) => a.appointmentDate === selectedDate);
  }, [appointments, selectedDate]);

  // All Appointments with filter
  const filteredAllAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchStatus = statusFilter === 'all' || apt.status.toLowerCase() === statusFilter.toLowerCase();
      const matchSearch =
        searchQuery === '' ||
        apt.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.appointmentDate.includes(searchQuery);
      return matchStatus && matchSearch;
    });
  }, [appointments, statusFilter, searchQuery]);

  // Handle status update (Confirm, Complete, Cancel, No-show)
  const handleConfirmAction = () => {
    if (!selectedAppointment || !actionType || !user) return;

    storeManager.updateMedicalAppointmentStatus(
      selectedAppointment.id,
      actionType,
      user.uid || 'demo_medical_01',
      profile?.role || 'medical_officer',
      actionNote || undefined
    );

    setIsActionModalOpen(false);
    setSelectedAppointment(null);
    setActionType(null);
    setActionNote('');
    loadData();
  };

  // Open Visit Note Modal for Completed Appointment
  const handleOpenVisitNote = (apt: MedicalAppointment) => {
    setSelectedAppointment(apt);
    setNoteFormError('');
    setNoteFormSuccess('');
    setCertError('');
    setCertSuccess('');

    const existing = storeManager.getVisitNoteByAppointment(apt.id);
    if (existing) {
      setActiveVisitRecord(existing);
      const cert = storeManager.getCertificateByVisitRecordId(existing.id);
      setActiveCertificate(cert);
      setNoteForm({
        complaint: existing.complaint || '',
        observation: existing.observation || '',
        advice: existing.advice || '',
        followUpDate: existing.followUpDate || '',
        sickRestDays: existing.sickRestDays ?? '',
        prescriptionItems: existing.prescriptionItems ? [...existing.prescriptionItems] : []
      });
    } else {
      setActiveVisitRecord(null);
      setActiveCertificate(null);
      setNoteForm({
        complaint: apt.reason || '',
        observation: '',
        advice: '',
        followUpDate: '',
        sickRestDays: '',
        prescriptionItems: [
          {
            id: `rx-${Date.now()}-1`,
            medicine: '',
            dose: '',
            duration: '',
            instructions: ''
          }
        ]
      });
    }
    setIsVisitNoteModalOpen(true);
  };

  // M3: Open Certificate Issue / Supersede Modal
  const handleOpenCertificateModal = () => {
    if (!activeVisitRecord) return;
    setCertError('');
    setCertSuccess('');
    const cert = storeManager.getCertificateByVisitRecordId(activeVisitRecord.id);
    setActiveCertificate(cert);
    setCertificateForm({
      restStartDate: cert ? cert.restStartDate : activeVisitRecord.visitDate,
      restDays: cert ? cert.restDays : (activeVisitRecord.sickRestDays || 3),
      supersededReason: ''
    });
    setIsCertificateModalOpen(true);
  };

  // M3: Submit Issue or Supersede Certificate
  const handleIssueCertificateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVisitRecord || !user) return;
    setCertError('');
    setCertSuccess('');

    const days = Number(certificateForm.restDays);
    if (isNaN(days) || days <= 0 || days > 30) {
      setCertError('Rest period must be between 1 and 30 days.');
      return;
    }

    if (activeCertificate && activeCertificate.status === 'VALID' && !certificateForm.supersededReason.trim()) {
      setCertError('Mandatory reason required for reissuing / superseding an existing certificate.');
      return;
    }

    setCertActionLoading(true);
    try {
      const res = await storeManager.issueMedicalRestCertificate({
        visitRecordId: activeVisitRecord.id,
        appointmentId: activeVisitRecord.appointmentId,
        appointmentRef: activeVisitRecord.appointmentRef,
        patientUid: activeVisitRecord.patientUid,
        patientName: activeVisitRecord.patientName,
        patientId: activeVisitRecord.patientId,
        patientDepartment: activeVisitRecord.patientDepartment,
        doctorUid: user.uid || 'demo_medical_01',
        doctorName: user.displayName || profile?.fullName || 'Duty Medical Officer [REPLACE WITH REAL CONTENT]',
        restStartDate: certificateForm.restStartDate,
        restDays: days,
        supersededReason: certificateForm.supersededReason.trim() || undefined
      });

      if (!res.success || !res.certificate) {
        setCertError(res.error || 'Failed to issue rest certificate.');
      } else {
        setActiveCertificate(res.certificate);
        setCertSuccess(
          res.certificate.version > 1
            ? (isBn ? 'নতুন সংস্করণ ইস্যু করা হয়েছে এবং পূর্ববর্তী সংস্করণ SUPERSEDED হিসেবে চিহ্নিত হয়েছে।' : 'New version issued. Previous version marked as SUPERSEDED.')
            : (isBn ? 'মেডিকেল রেস্ট সার্টিফিকেট সফলভাবে রেজিস্ট্রি ও যাচাইযোগ্য করা হয়েছে।' : 'Medical Rest Certificate issued and cryptographically registered.')
        );
        setIsCertificateModalOpen(false);
      }
    } catch (err: any) {
      setCertError(err.message || 'Error occurred while issuing certificate.');
    } finally {
      setCertActionLoading(false);
    }
  };

  // M3: Open Revoke Modal
  const handleOpenRevokeModal = () => {
    setRevokeError('');
    setRevocationReason('');
    setIsRevokeModalOpen(true);
  };

  // M3: Submit Revocation
  const handleRevokeCertificateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCertificate || !user) return;
    setRevokeError('');

    if (!revocationReason.trim() || revocationReason.trim().length < 5) {
      setRevokeError('A mandatory reason of at least 5 characters is required for revocation.');
      return;
    }

    setCertActionLoading(true);
    try {
      const res = await storeManager.revokeMedicalRestCertificate(
        activeCertificate.id,
        user.uid || 'demo_medical_01',
        profile?.role || 'medical_officer',
        revocationReason.trim()
      );

      if (!res.success || !res.certificate) {
        setRevokeError(res.error || 'Failed to revoke certificate.');
      } else {
        setActiveCertificate(res.certificate);
        setIsRevokeModalOpen(false);
        setCertSuccess(isBn ? 'সার্টিফিকেট সফলভাবে বাতিল (REVOKED) করা হয়েছে।' : 'Certificate status updated to REVOKED.');
      }
    } catch (err: any) {
      setRevokeError(err.message || 'Error occurred while revoking certificate.');
    } finally {
      setCertActionLoading(false);
    }
  };

  // Add prescription item (max 10)
  const handleAddPrescriptionItem = () => {
    if (noteForm.prescriptionItems.length >= 10) {
      setNoteFormError('Maximum of 10 prescription items allowed.');
      return;
    }
    setNoteForm({
      ...noteForm,
      prescriptionItems: [
        ...noteForm.prescriptionItems,
        {
          id: `rx-${Date.now()}-${noteForm.prescriptionItems.length + 1}`,
          medicine: '',
          dose: '',
          duration: '',
          instructions: ''
        }
      ]
    });
  };

  // Remove prescription item
  const handleRemovePrescriptionItem = (id: string) => {
    setNoteForm({
      ...noteForm,
      prescriptionItems: noteForm.prescriptionItems.filter((i) => i.id !== id)
    });
  };

  // Update prescription item field
  const handleUpdatePrescriptionItem = (id: string, field: keyof PrescriptionItem, value: string) => {
    setNoteForm({
      ...noteForm,
      prescriptionItems: noteForm.prescriptionItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  // Save Visit Note (Draft or Finalized)
  const handleSaveVisitNote = (statusToSave: VisitNoteStatus) => {
    if (!selectedAppointment) return;
    setNoteFormError('');
    setNoteFormSuccess('');

    // Validation
    if (noteForm.complaint.trim().length > 500) {
      setNoteFormError('Complaint text cannot exceed 500 characters.');
      return;
    }
    if (noteForm.observation.trim().length > 500) {
      setNoteFormError('Observation text cannot exceed 500 characters.');
      return;
    }
    if (noteForm.advice.trim().length > 500) {
      setNoteFormError('Advice text cannot exceed 500 characters.');
      return;
    }
    if (statusToSave === 'FINALIZED') {
      if (!noteForm.complaint.trim()) {
        setNoteFormError('Please enter chief complaints before finalizing.');
        return;
      }
      if (!noteForm.observation.trim()) {
        setNoteFormError('Please enter clinical observations before finalizing.');
        return;
      }
      if (!noteForm.advice.trim()) {
        setNoteFormError('Please enter clinical advice before finalizing.');
        return;
      }
    }

    // Filter valid prescription items (free text)
    const validItems = noteForm.prescriptionItems.filter((item) => item.medicine.trim() !== '');

    const result = storeManager.saveVisitNote({
      appointmentId: selectedAppointment.id,
      complaint: noteForm.complaint.trim(),
      observation: noteForm.observation.trim(),
      advice: noteForm.advice.trim(),
      followUpDate: noteForm.followUpDate || undefined,
      sickRestDays: noteForm.sickRestDays !== '' ? Number(noteForm.sickRestDays) : undefined,
      prescriptionItems: validItems,
      status: statusToSave,
      doctorUid: user?.uid || 'demo_medical_01',
      doctorName: user?.displayName || profile?.fullName || 'Duty Medical Officer [REPLACE WITH REAL CONTENT]',
      doctorSpecialty: 'Internal Medicine & Emergency Care'
    });

    if (!result.success) {
      setNoteFormError(result.error || 'Failed to save visit note.');
      return;
    }

    if (result.record) {
      setActiveVisitRecord(result.record);
    }
    setNoteFormSuccess(
      statusToSave === 'FINALIZED'
        ? (isBn ? 'প্রেসক্রিপশন সফলভাবে চূড়ান্ত ও রেজিস্টার করা হয়েছে।' : 'Prescription finalized and verified token generated.')
        : (isBn ? 'খসড়া সফলভাবে সংরক্ষিত হয়েছে।' : 'Draft saved successfully.')
    );
    loadData();
  };

  // Open Addendum modal for a finalized record
  const handleOpenAddendum = () => {
    setAddendumError('');
    setAddendumForm({ reason: '', correctionNotes: '' });
    setIsAddendumModalOpen(true);
  };

  // Submit Addendum
  const handleSubmitAddendum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVisitRecord) return;
    setAddendumError('');

    if (!addendumForm.reason.trim()) {
      setAddendumError('Reason for correction addendum is required.');
      return;
    }
    if (!addendumForm.correctionNotes.trim()) {
      setAddendumError('Correction notes are required.');
      return;
    }

    const result = storeManager.addVisitAddendum(activeVisitRecord.id, {
      doctorUid: user?.uid || 'demo_medical_01',
      doctorName: user?.displayName || profile?.fullName || 'Duty Medical Officer [REPLACE WITH REAL CONTENT]',
      reason: addendumForm.reason,
      correctionNotes: addendumForm.correctionNotes
    });

    if (!result.success) {
      setAddendumError(result.error || 'Failed to add addendum.');
      return;
    }

    if (result.record) {
      setActiveVisitRecord({ ...result.record });
    }
    setIsAddendumModalOpen(false);
    loadData();
  };

  // Open Patient History with access check & automatic logging
  const handleOpenPatientHistory = (apt: MedicalAppointment) => {
    setHistoryError('');
    setHistoryTarget({
      patientUid: apt.patientUid,
      patientName: apt.patientName,
      patientId: apt.patientId
    });

    const docUid = user?.uid || 'demo_medical_01';
    const docName = user?.displayName || profile?.fullName || 'Duty Medical Officer [REPLACE WITH REAL CONTENT]';
    const docRole = profile?.role || 'medical_officer';

    const result = storeManager.getDoctorPatientHistory(apt.patientUid, docUid, docName, docRole);
    if (!result.allowed) {
      setHistoryError(result.error || 'Access denied.');
      setPatientHistoryList([]);
    } else {
      setPatientHistoryList(result.records);
    }
    setIsHistoryModalOpen(true);
  };

  // Add Duty Shift
  const handleAddShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = initialMedicalDoctorsData.find((d) => d.id === shiftForm.doctorId);
    const doctorName = doc ? doc.name : 'Chief Medical Officer [REPLACE WITH REAL CONTENT]';
    const doctorSpecialty = doc ? doc.specialty : 'General Consultation';

    storeManager.addDutyRosterShift({
      doctorId: shiftForm.doctorId,
      doctorName,
      doctorSpecialty,
      dayOfWeek: shiftForm.dayOfWeek,
      timeSlot: shiftForm.timeSlot,
      roomNumber: shiftForm.roomNumber,
      maxPatients: shiftForm.maxPatients,
      isActive: true
    });

    setIsAddShiftModalOpen(false);
    loadData();
  };

  // Delete shift
  const handleDeleteShift = (shiftId: string) => {
    storeManager.deleteDutyRosterShift(shiftId);
    loadData();
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

  return (
    <div className="space-y-6">
      <SEOHead
        title={isBn ? 'চিকিৎসা কর্মকর্তা পোর্টাল | জেএসটিইউ' : 'Medical Officer Portal | JSTU'}
        description="JSTU Medical Officer consultation queue, visit notes, digital prescriptions, and duty roster."
      />

      {/* -------------------------------------------------------------
          1. DEMO & PRIVACY DISCLAIMER BANNER (MANDATORY)
         ------------------------------------------------------------- */}
      <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs font-semibold flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
        <div className="leading-relaxed">
          <span className="font-bold uppercase tracking-wider block sm:inline">
            DEMO MODE — All medical records are fictional •
          </span>{' '}
          {isBn
            ? 'এটি ক্লিনিক্যাল রেকর্ডের একটি প্রোটোটাইপ। প্রেসক্রিপশন ও উপসর্গ তথ্য কেবল ডেমো উদ্দেশ্যে ব্যবহৃত।'
            : 'Fictional demo data only. No diagnosis suggestions, no AI, no symptom checker. Free-text entries only.'}
        </div>
      </div>

      {/* -------------------------------------------------------------
          2. HEADER AND PORTAL NAVIGATION TABS
         ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-[#1E3A8A]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              {isBn ? 'চিকিৎসা কর্মকর্তা পোর্টাল ও রোগী কিউ' : 'Medical Officer Portal & Patient Queue'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isBn
              ? 'দৈনিক রোগীর কিউ নিরীক্ষণ, অ্যাপয়েন্টমেন্ট নিশ্চিতকরণ ও সাপ্তাহিক ডিউটি রোস্টার নিয়ন্ত্রণ।'
              : 'Daily consultation triage, appointment confirmation, visit notes, and duty roster shift management.'}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-white text-[#1E3A8A] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            {isBn ? 'আজকের কিউ' : "Today's Queue"} ({stats.todayTotal})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-[#1E3A8A] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            {isBn ? 'সকল অ্যাপয়েন্টমেন্ট' : 'All Appointments'} ({stats.grandTotal})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-white text-[#1E3A8A] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            {isBn ? 'ডিউটি রোস্টার' : 'Duty Roster'} ({dutyRoster.length})
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          3. SIMPLE COUNTERS
         ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="p-4 border border-[#E2E8F0] text-center">
          <span className="text-2xl font-bold text-[#1E3A8A]">{stats.todayTotal}</span>
          <p className="text-xs text-slate-600 font-medium mt-1">
            {isBn ? 'আজকের মোট রোগী' : "Today's Total"}
          </p>
        </Card>

        <Card className="p-4 border border-[#E2E8F0] text-center">
          <span className="text-2xl font-bold text-emerald-600">{stats.confirmed}</span>
          <p className="text-xs text-slate-600 font-medium mt-1">
            {isBn ? 'নিশ্চিত রোগী' : 'Confirmed'}
          </p>
        </Card>

        <Card className="p-4 border border-[#E2E8F0] text-center">
          <span className="text-2xl font-bold text-amber-600">{stats.requested}</span>
          <p className="text-xs text-slate-600 font-medium mt-1">
            {isBn ? 'অনুরোধকৃত (অপেক্ষমাণ)' : 'Pending Request'}
          </p>
        </Card>

        <Card className="p-4 border border-[#E2E8F0] text-center">
          <span className="text-2xl font-bold text-blue-600">{stats.completed}</span>
          <p className="text-xs text-slate-600 font-medium mt-1">
            {isBn ? 'পরামর্শ সম্পন্ন' : 'Completed'}
          </p>
        </Card>

        <Card className="p-4 border border-[#E2E8F0] text-center">
          <span className="text-2xl font-bold text-red-600">{stats.noShow}</span>
          <p className="text-xs text-slate-600 font-medium mt-1">
            {isBn ? 'অনুপস্থিত (No-show)' : 'No-show'}
          </p>
        </Card>
      </div>

      {/* -------------------------------------------------------------
          4. TAB 1: TODAY'S PATIENT QUEUE
         ------------------------------------------------------------- */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1E3A8A]" />
              <span className="text-xs font-bold text-[#0F172A]">
                {isBn ? 'তারিখ অনুযায়ী কিউ দেখুন:' : 'Queue Date:'}
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs p-1.5 bg-white border border-[#E2E8F0] rounded-lg font-mono text-[#0F172A]"
              />
            </div>
            <div className="text-xs text-slate-600 font-medium">
              {todayQueue.length} {isBn ? 'জন রোগী তালিকায় রয়েছে' : 'patient(s) in queue'}
            </div>
          </div>

          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8FAFC] text-slate-600 uppercase text-[10px] tracking-wider border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3 px-3.5">#</th>
                    <th className="py-3 px-3.5">{isBn ? 'রোগীর নাম ও আইডি' : 'Patient Name & ID'}</th>
                    <th className="py-3 px-3.5">{isBn ? 'বিভাগ' : 'Department'}</th>
                    <th className="py-3 px-3.5">{isBn ? 'সময় স্লট' : 'Time Slot'}</th>
                    <th className="py-3 px-3.5">{isBn ? 'কারণ' : 'Reason'}</th>
                    <th className="py-3 px-3.5">{isBn ? 'অবস্থা' : 'Status'}</th>
                    <th className="py-3 px-3.5 text-right">{isBn ? 'পদক্ষেপ' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {todayQueue.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-600">
                        {isBn ? 'নির্বাচিত তারিখে কোনো রোগী নেই।' : 'No patients found for this selected date.'}
                      </td>
                    </tr>
                  ) : (
                    todayQueue.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3.5 font-mono text-slate-600">
                          #{apt.tokenNumber}
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="font-bold text-[#0F172A]">{apt.patientName}</div>
                          <div className="text-[11px] text-slate-600 font-mono">
                            {apt.patientId} • {apt.patientRole}
                          </div>
                        </td>

                        <td className="py-3 px-3.5 text-slate-600">
                          {apt.department}
                        </td>

                        <td className="py-3 px-3.5 font-mono font-semibold text-slate-800">
                          {apt.timeSlot}
                        </td>

                        <td className="py-3 px-3.5 max-w-xs text-slate-700">
                          <p className="line-clamp-2 text-[11px] leading-tight bg-slate-50 p-1.5 rounded border border-slate-200">
                            {apt.reason}
                          </p>
                        </td>

                        <td className="py-3 px-3.5">
                          {getStatusBadge(apt.status)}
                        </td>

                        <td className="py-3 px-3.5 text-right space-x-1 whitespace-nowrap">
                          {/* Patient History link (M2 requirement) */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenPatientHistory(apt)}
                            title={isBn ? 'রোগীর পূর্বের ইতিহাস' : 'Patient History'}
                          >
                            <History className="w-3.5 h-3.5 mr-1" />
                            {isBn ? 'ইতিহাস' : 'History'}
                          </Button>

                          {apt.status === 'Requested' && (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  setSelectedAppointment(apt);
                                  setActionType('Confirmed');
                                  setIsActionModalOpen(true);
                                }}
                              >
                                {isBn ? 'নিশ্চিত' : 'Confirm'}
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  setSelectedAppointment(apt);
                                  setActionType('Cancelled');
                                  setIsActionModalOpen(true);
                                }}
                              >
                                {isBn ? 'বাতিল' : 'Cancel'}
                              </Button>
                            </>
                          )}

                          {apt.status === 'Confirmed' && (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  setSelectedAppointment(apt);
                                  setActionType('Completed');
                                  setIsActionModalOpen(true);
                                }}
                              >
                                {isBn ? 'সম্পন্ন' : 'Completed'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedAppointment(apt);
                                  setActionType('No-show');
                                  setIsActionModalOpen(true);
                                }}
                              >
                                {isBn ? 'অনুপস্থিত' : 'No-show'}
                              </Button>
                            </>
                          )}

                          {/* Completed appointment: Open Visit Note & Prescription (M2) */}
                          {apt.status === 'Completed' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleOpenVisitNote(apt)}
                              className="bg-[#1E3A8A] hover:bg-[#1E40AF]"
                            >
                              <FileText className="w-3.5 h-3.5 mr-1" />
                              {isBn ? 'প্রেসক্রিপশন / নোট' : 'Visit Note / Rx'}
                            </Button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setIsAuditModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-100 rounded cursor-pointer"
                            title="Audit Log"
                          >
                            <Activity className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          5. TAB 2: ALL APPOINTMENTS
         ------------------------------------------------------------- */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'রেফারেন্স, রোগীর নাম বা আইডি দিয়ে খুঁজুন...' : 'Search by reference, patient name or ID...'}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs p-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[#0F172A]"
              >
                <option value="all">{isBn ? 'সকল স্ট্যাটাস' : 'All Statuses'}</option>
                <option value="requested">{isBn ? 'অনুরোধকৃত' : 'Requested'}</option>
                <option value="confirmed">{isBn ? 'নিশ্চিত' : 'Confirmed'}</option>
                <option value="completed">{isBn ? 'সম্পন্ন' : 'Completed'}</option>
                <option value="cancelled">{isBn ? 'বাতিল' : 'Cancelled'}</option>
                <option value="no-show">{isBn ? 'অনুপস্থিত' : 'No-show'}</option>
              </select>
            </div>
          </div>

          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8FAFC] text-slate-600 uppercase text-[10px] tracking-wider border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3 px-3.5">{isBn ? 'রেফারেন্স' : 'Ref #'}</th>
                    <th className="py-3 px-3.5">{isBn ? 'রোগী' : 'Patient'}</th>
                    <th className="py-3 px-3.5">{isBn ? 'চিকিৎসক' : 'Doctor'}</th>
                    <th className="py-3 px-3.5">{isBn ? 'তারিখ ও সময়' : 'Date & Slot'}</th>
                    <th className="py-3 px-3.5">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                    <th className="py-3 px-3.5 text-right">{isBn ? 'পদক্ষেপ' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredAllAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-[#1E3A8A]">
                        {apt.referenceNumber}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-[#0F172A]">{apt.patientName}</div>
                        <div className="text-[10px] text-slate-600 font-mono">
                          {apt.patientId} • {apt.department}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-slate-700">
                        {apt.doctorName}
                      </td>
                      <td className="py-3 px-3.5 text-slate-700 font-mono">
                        {apt.appointmentDate} <span className="text-slate-600">({apt.timeSlot})</span>
                      </td>
                      <td className="py-3 px-3.5">
                        {getStatusBadge(apt.status)}
                      </td>
                      <td className="py-3 px-3.5 text-right space-x-1 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenPatientHistory(apt)}
                          title={isBn ? 'রোগীর পূর্বের ইতিহাস' : 'Patient History'}
                        >
                          <History className="w-3.5 h-3.5 mr-1" />
                          {isBn ? 'ইতিহাস' : 'History'}
                        </Button>

                        {apt.status === 'Completed' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleOpenVisitNote(apt)}
                            className="bg-[#1E3A8A] hover:bg-[#1E40AF]"
                          >
                            <FileText className="w-3.5 h-3.5 mr-1" />
                            {isBn ? 'নোট' : 'Rx Note'}
                          </Button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setIsAuditModalOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-100 rounded cursor-pointer"
                          title="Audit Log"
                        >
                          <Activity className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          6. TAB 3: DUTY ROSTER MANAGEMENT
         ------------------------------------------------------------- */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#0F172A]">
                  {isBn ? 'সাপ্তাহিক চিকিৎসা ডিউটি রোস্টার নিয়ন্ত্রণ' : 'Active Duty Roster Shifts'}
                </h2>
                <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  [REPLACE WITH REAL CONTENT]
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {isBn
                  ? 'এই শিফটসমূহ থেকে শিক্ষার্থীরা সরাসরি অ্যাপয়েন্টমেন্টের স্লট নির্বাচন করতে পারেন।'
                  : 'These roster shifts feed directly into the student and staff appointment slot selector.'}
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddShiftModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              {isBn ? 'নতুন ডিউটি শিফট যোগ করুন' : 'Add Duty Shift'}
            </Button>
          </div>

          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8FAFC] text-slate-600 uppercase text-[10px] tracking-wider border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3 px-3.5">{isBn ? 'বার' : 'Day of Week'}</th>
                    <th className="py-3 px-3.5">{isBn ? 'চিকিৎসক' : 'Doctor & Specialty'}</th>
                    <th className="py-3 px-3.5">{isBn ? 'সময় স্লট' : 'Time Slot'}</th>
                    <th className="py-3 px-3.5">{isBn ? 'চেম্বার' : 'Room'}</th>
                    <th className="py-3 px-3.5">{isBn ? 'ধারণক্ষমতা' : 'Max Patients'}</th>
                    <th className="py-3 px-3.5 text-right">{isBn ? 'মুছুন' : 'Delete'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {dutyRoster.map((shift) => (
                    <tr key={shift.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-[#0F172A]">{shift.dayOfWeek}</td>
                      <td className="py-3 px-3.5">
                        <span className="font-semibold text-slate-800 block">{shift.doctorName}</span>
                        <span className="text-[10px] text-slate-600">{shift.doctorSpecialty}</span>
                      </td>
                      <td className="py-3 px-3.5 font-mono font-medium text-[#1E3A8A]">
                        {shift.timeSlot}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-slate-700">
                        {shift.roomNumber}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-slate-700">
                        {shift.maxPatients}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteShift(shift.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                          title="Delete shift"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          7. M2: VISIT NOTE & DIGITAL PRESCRIPTION MODAL
         ------------------------------------------------------------- */}
      {isVisitNoteModalOpen && selectedAppointment && (
        <Modal
          isOpen={isVisitNoteModalOpen}
          onClose={() => setIsVisitNoteModalOpen(false)}
          title={isBn ? 'ভিজিট নোট ও ডিজিটাল প্রেসক্রিপশন' : 'Visit Note & Digital Prescription'}
        >
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
            {/* Watermark notice */}
            <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-[11px] font-bold text-amber-900 flex items-center justify-between">
              <span>DEMO - not a real medical record</span>
              {activeVisitRecord?.status === 'FINALIZED' && (
                <Badge variant="success">FINALIZED (IMMUTABLE)</Badge>
              )}
            </div>

            {/* Patient Header */}
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-600 block">{isBn ? 'রোগী:' : 'Patient:'}</span>
                <span className="font-bold text-[#0F172A]">{selectedAppointment.patientName}</span>
                <span className="text-[11px] text-slate-600 block font-mono">
                  {selectedAppointment.patientId} • {selectedAppointment.department}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-600 block">{isBn ? 'অ্যাপয়েন্টমেন্ট রেফ:' : 'Appointment Ref:'}</span>
                <span className="font-mono font-bold text-[#1E3A8A]">{selectedAppointment.referenceNumber}</span>
                <span className="text-[11px] text-slate-600 block">
                  {selectedAppointment.appointmentDate} ({selectedAppointment.timeSlot})
                </span>
              </div>
            </div>

            {/* Error & Success Banners */}
            {noteFormError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{noteFormError}</span>
              </div>
            )}
            {noteFormSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{noteFormSuccess}</span>
              </div>
            )}

            {/* Finalized Record Notice */}
            {activeVisitRecord?.status === 'FINALIZED' && (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>{isBn ? 'চূড়ান্ত ও লককৃত রেকর্ড' : 'Finalized & Immutable Record'}</span>
                  </div>
                  <span className="font-mono text-[10px] text-blue-800">
                    Token: {activeVisitRecord.verificationToken}
                  </span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  {isBn
                    ? 'চূড়ান্ত নোট সরাসরি পরিবর্তনযোগ্য নয়। কোনো সংশোধনের প্রয়োজন হলে পরিশিষ্ট (Addendum) যোগ করুন।'
                    : 'A finalized note cannot be edited. If a clinical correction is required, create an addendum.'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenAddendum}
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  className="bg-white"
                >
                  {isBn ? 'সংশোধন পরিশিষ্ট যোগ করুন' : 'Add Correction Addendum'}
                </Button>
              </div>
            )}

            {/* M3: Medical Rest Certificate Management */}
            {activeVisitRecord?.status === 'FINALIZED' && (
              <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-950 font-bold">
                    <Award className="w-4 h-4 text-emerald-700" />
                    <span>{isBn ? 'মেডিকেল রেস্ট সার্টিফিকেট (অফিসিয়াল সনদ)' : 'Medical Rest Certificate (Official)'}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    DEMO - not an official medical certificate
                  </span>
                </div>

                <p className="text-[11px] text-slate-700 leading-relaxed">
                  {isBn
                    ? 'শিক্ষার্থীর গোপনীয়তার স্বার্থে সনদে কোনো ডায়াগনসিস বা স্বাস্থ্য বিবরণ থাকে না। শুধুমাত্র নাম, আইডি, কেন্দ্র, বিশ্রামের মেয়াদ ও ডাক্তারের ভূমিকা দৃশ্যমান থাকে।'
                    : 'Certificate and everything derived from it contains NO diagnosis and NO health details. It states only: patient name and ID, the center (JSTU Medical Center), rest period, and doctor role.'}
                </p>

                {certError && (
                  <div className="p-2 bg-red-50 border border-red-200 text-red-800 text-[11px] rounded-lg">
                    {certError}
                  </div>
                )}
                {certSuccess && (
                  <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] rounded-lg">
                    {certSuccess}
                  </div>
                )}

                {activeCertificate ? (
                  <div className="bg-white p-3 rounded-lg border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          Rest Certificate #{activeCertificate.verificationId.slice(0, 8)}
                        </span>
                        <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          v{activeCertificate.version}
                        </span>
                      </div>
                      <Badge
                        variant={
                          activeCertificate.status === 'VALID'
                            ? 'success'
                            : activeCertificate.status === 'SUPERSEDED'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {activeCertificate.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 font-mono">
                      <div>
                        <span className="text-slate-600 block">Rest Period:</span>
                        <span className="font-bold text-slate-900">
                          {activeCertificate.restStartDate} &rarr; {activeCertificate.restEndDate} ({activeCertificate.restDays} days)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600 block">SHA-256 Short Hash:</span>
                        <span className="text-slate-800">{activeCertificate.canonicalHash.slice(0, 16)}...</span>
                      </div>
                    </div>

                    {activeCertificate.supersededReason && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                        <strong>Superseded Note:</strong> {activeCertificate.supersededReason}
                      </p>
                    )}

                    {activeCertificate.revocationReason && (
                      <p className="text-[11px] text-red-800 bg-red-50 p-1.5 rounded border border-red-200">
                        <strong>Revocation Note:</strong> {activeCertificate.revocationReason}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <a
                        href={`/verify-medical/${activeCertificate.verificationId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#1E3A8A] hover:underline font-semibold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{isBn ? 'পাবলিক ভেরিফিকেশন লিংক' : 'Public Verification View'}</span>
                      </a>

                      <div className="flex items-center gap-1.5">
                        {activeCertificate.status === 'VALID' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleOpenCertificateModal}
                              leftIcon={<Edit3 className="w-3 h-3" />}
                              className="text-[11px]"
                            >
                              {isBn ? 'সংশোধন / নতুন সংস্করণ' : 'Correct & Supersede'}
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={handleOpenRevokeModal}
                              leftIcon={<AlertTriangle className="w-3 h-3" />}
                              className="text-[11px]"
                            >
                              {isBn ? 'বাতিল (Revoke)' : 'Revoke'}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="font-semibold text-slate-800 block">
                        {isBn ? 'কোনো রেস্ট সার্টিফিকেট ইস্যু করা হয়নি' : 'No Rest Certificate Issued Yet'}
                      </span>
                      <span className="text-[11px] text-slate-600">
                        {activeVisitRecord.sickRestDays
                          ? `${isBn ? 'সুপারিশকৃত ছুটির দিন:' : 'Recommended rest period:'} ${activeVisitRecord.sickRestDays} ${isBn ? 'দিন' : 'days'}`
                          : (isBn ? 'প্রেসক্রিপশন অনুযায়ী ছুটির সনদ তৈরি করুন' : 'Generate verifiable rest certificate from this visit')}
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleOpenCertificateModal}
                      leftIcon={<Award className="w-3.5 h-3.5" />}
                      className="bg-emerald-700 hover:bg-emerald-800"
                    >
                      {isBn ? 'সার্টিফিকেট ইস্যু করুন' : 'Issue Rest Certificate'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Clinical Note Fields */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#0F172A]">
                    {isBn ? 'প্রধান উপসর্গ / অভিযোগ (Chief Complaint)' : 'Chief Complaint'} *
                  </label>
                  <span className="text-[10px] font-mono text-slate-600">
                    {noteForm.complaint.length}/500
                  </span>
                </div>
                <textarea
                  value={noteForm.complaint}
                  onChange={(e) => setNoteForm({ ...noteForm, complaint: e.target.value })}
                  disabled={activeVisitRecord?.status === 'FINALIZED'}
                  maxLength={500}
                  rows={2}
                  placeholder={isBn ? 'রোগীর উপসর্গ লিখুন...' : 'Document primary complaint and duration...'}
                  className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#0F172A]">
                    {isBn ? 'ক্লিনিক্যাল পর্যবেক্ষণ ও পরীক্ষা (Clinical Observation)' : 'Clinical Observation'} *
                  </label>
                  <span className="text-[10px] font-mono text-slate-600">
                    {noteForm.observation.length}/500
                  </span>
                </div>
                <textarea
                  value={noteForm.observation}
                  onChange={(e) => setNoteForm({ ...noteForm, observation: e.target.value })}
                  disabled={activeVisitRecord?.status === 'FINALIZED'}
                  maxLength={500}
                  rows={2}
                  placeholder={isBn ? 'রক্তচাপ, পালস বা শারীরিক লক্ষণসমূহ লিখুন...' : 'Vital signs, physical examination findings...'}
                  className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#0F172A]">
                    {isBn ? 'চিকিৎসা পরামর্শ ও নির্দেশনা (Advice)' : 'Medical Advice'} *
                  </label>
                  <span className="text-[10px] font-mono text-slate-600">
                    {noteForm.advice.length}/500
                  </span>
                </div>
                <textarea
                  value={noteForm.advice}
                  onChange={(e) => setNoteForm({ ...noteForm, advice: e.target.value })}
                  disabled={activeVisitRecord?.status === 'FINALIZED'}
                  maxLength={500}
                  rows={2}
                  placeholder={isBn ? 'বিশ্রাম, খাদ্য ও স্বাস্থ্যবিধির পরামর্শ...' : 'Dietary guidance, rest instructions, lifestyle advice...'}
                  className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0F172A] block mb-1">
                    {isBn ? 'পরবর্তী সাক্ষাতের তারিখ (ঐচ্ছিক)' : 'Follow-up Date (Optional)'}
                  </label>
                  <input
                    type="date"
                    value={noteForm.followUpDate}
                    onChange={(e) => setNoteForm({ ...noteForm, followUpDate: e.target.value })}
                    disabled={activeVisitRecord?.status === 'FINALIZED'}
                    className="w-full text-xs p-2 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] disabled:bg-slate-50 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0F172A] block mb-1">
                    {isBn ? 'মেডিকেল ছুটির সুপারিশ (দিন)' : 'Sick / Rest Days (Optional)'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={14}
                    value={noteForm.sickRestDays}
                    onChange={(e) => setNoteForm({ ...noteForm, sickRestDays: e.target.value })}
                    disabled={activeVisitRecord?.status === 'FINALIZED'}
                    placeholder="0"
                    className="w-full text-xs p-2 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] disabled:bg-slate-50 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Prescription Items (Free text, max 10 items) */}
            <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    {isBn ? 'প্রেসক্রিপশন আইটেম (ওষুধ ও নির্দেশনা)' : 'Prescription Items (Free text)'}
                  </h4>
                  <p className="text-[10px] text-slate-600">
                    {isBn
                      ? 'চিকিৎসক কর্তৃক টাইপকৃত নাম ও মাত্রা (সর্বোচ্চ ১০টি)। কোনো এআই বা ডায়াগনস্টিক ইঞ্জিন নেই।'
                      : 'Free text typed by demo doctor. Maximum 10 items. No AI recommendations.'}
                  </p>
                </div>
                {activeVisitRecord?.status !== 'FINALIZED' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddPrescriptionItem}
                    disabled={noteForm.prescriptionItems.length >= 10}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    {isBn ? 'ওষুধ যোগ করুন' : 'Add Medicine'}
                  </Button>
                )}
              </div>

              {noteForm.prescriptionItems.length === 0 ? (
                <p className="text-xs text-slate-600 italic py-2">
                  {isBn ? 'কোনো ওষুধ যোগ করা হয়নি।' : 'No prescription items added.'}
                </p>
              ) : (
                <div className="space-y-2">
                  {noteForm.prescriptionItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1E3A8A] font-mono">Item #{idx + 1}</span>
                        {activeVisitRecord?.status !== 'FINALIZED' && (
                          <button
                            type="button"
                            onClick={() => handleRemovePrescriptionItem(item.id)}
                            className="text-red-600 hover:text-red-800 text-[11px] font-semibold cursor-pointer"
                          >
                            {isBn ? 'মুছুন' : 'Remove'}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder={isBn ? 'ওষুধের নাম (যেমন: Tab. Paracetamol 500mg)' : 'Medicine Name (e.g., Tab. Paracetamol 500mg)'}
                          value={item.medicine}
                          disabled={activeVisitRecord?.status === 'FINALIZED'}
                          onChange={(e) => handleUpdatePrescriptionItem(item.id, 'medicine', e.target.value)}
                          className="text-xs p-1.5 bg-white border border-[#E2E8F0] rounded-md text-[#0F172A] disabled:bg-slate-100 font-medium"
                        />
                        <input
                          type="text"
                          placeholder={isBn ? 'মাত্রা (যেমন: ১টি করে দিনে ৩ বার)' : 'Dose (e.g., 1 tablet 3 times daily)'}
                          value={item.dose}
                          disabled={activeVisitRecord?.status === 'FINALIZED'}
                          onChange={(e) => handleUpdatePrescriptionItem(item.id, 'dose', e.target.value)}
                          className="text-xs p-1.5 bg-white border border-[#E2E8F0] rounded-md text-[#0F172A] disabled:bg-slate-100"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder={isBn ? 'মেয়াদ (যেমন: ৫ দিন)' : 'Duration (e.g., 5 days)'}
                          value={item.duration}
                          disabled={activeVisitRecord?.status === 'FINALIZED'}
                          onChange={(e) => handleUpdatePrescriptionItem(item.id, 'duration', e.target.value)}
                          className="text-xs p-1.5 bg-white border border-[#E2E8F0] rounded-md text-[#0F172A] disabled:bg-slate-100"
                        />
                        <input
                          type="text"
                          placeholder={isBn ? 'সেবনবিধি (যেমন: খাবার পর)' : 'Instructions (e.g., After meals with water)'}
                          value={item.instructions}
                          disabled={activeVisitRecord?.status === 'FINALIZED'}
                          onChange={(e) => handleUpdatePrescriptionItem(item.id, 'instructions', e.target.value)}
                          className="text-xs p-1.5 bg-white border border-[#E2E8F0] rounded-md text-[#0F172A] disabled:bg-slate-100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Display Addenda if any exist */}
            {activeVisitRecord?.addenda && activeVisitRecord.addenda.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  {isBn ? 'পরিশিষ্ট ও সংশোধন ইতিহাস' : 'Addenda & Correction History'}
                </h4>
                <div className="space-y-2">
                  {activeVisitRecord.addenda.map((addendum) => (
                    <div
                      key={addendum.id}
                      className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-amber-900">
                        <span className="font-bold">Addendum by {addendum.createdByName}</span>
                        <span className="font-mono">{new Date(addendum.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-800">
                        <strong className="text-slate-900">{isBn ? 'কারণ: ' : 'Reason: '}</strong>
                        {addendum.reason}
                      </p>
                      <p className="text-slate-800">
                        <strong className="text-slate-900">{isBn ? 'সংশোধন নোট: ' : 'Correction: '}</strong>
                        {addendum.correctionNotes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <Button variant="ghost" size="sm" onClick={() => setIsVisitNoteModalOpen(false)}>
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </Button>

              {activeVisitRecord?.status !== 'FINALIZED' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveVisitNote('DRAFT')}
                  >
                    {isBn ? 'খসড়া সংরক্ষণ' : 'Save as Draft'}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-[#1E3A8A] hover:bg-[#1E40AF]"
                    onClick={() => handleSaveVisitNote('FINALIZED')}
                  >
                    {isBn ? 'চূড়ান্ত ও প্রেসক্রিপশন ইস্যু' : 'Finalize & Issue'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* -------------------------------------------------------------
          8. M2: CORRECTION ADDENDUM MODAL
         ------------------------------------------------------------- */}
      {isAddendumModalOpen && (
        <Modal
          isOpen={isAddendumModalOpen}
          onClose={() => setIsAddendumModalOpen(false)}
          title={isBn ? 'সংশোধন পরিশিষ্ট যোগ করুন' : 'Add Correction Addendum'}
        >
          <form onSubmit={handleSubmitAddendum} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              {isBn
                ? 'আইনগত ও অডিট নীতির কারণে চূড়ান্ত রেকর্ড সরাসরি মুছে ফেলা বা পরিবর্তন করা যায় না। সংশোধনের কারণ ও সঠিক নোট এখানে অন্তর্ভুক্ত করুন।'
                : 'Medical records are immutable once finalized. All modifications must be appended with a verified reason and doctor timestamp.'}
            </p>

            {addendumError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg">
                {addendumError}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">
                {isBn ? 'সংশোধনের কারণ' : 'Reason for Correction'} *
              </label>
              <input
                type="text"
                placeholder={isBn ? 'যেমন: ডোজ সংশোধনের অনুরোধ...' : 'e.g., Dosage clarification after patient re-evaluation...'}
                value={addendumForm.reason}
                onChange={(e) => setAddendumForm({ ...addendumForm, reason: e.target.value })}
                className="w-full text-xs p-2 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">
                {isBn ? 'সংশোধিত ক্লিনিক্যাল বিবরণ' : 'Correction Notes / Clinical Update'} *
              </label>
              <textarea
                rows={3}
                placeholder={isBn ? 'সংশোধিত নির্দেশনা লিখুন...' : 'Document corrected dosage, alternative advice or updated observations...'}
                value={addendumForm.correctionNotes}
                onChange={(e) => setAddendumForm({ ...addendumForm, correctionNotes: e.target.value })}
                className="w-full text-xs p-2 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A]"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddendumModalOpen(false)}>
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button variant="primary" size="sm" type="submit" className="bg-[#1E3A8A]">
                {isBn ? 'পরিশিষ্ট সংরক্ষণ' : 'Save Addendum'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* -------------------------------------------------------------
          9. M2: PATIENT MEDICAL HISTORY MODAL (WITH ACCESS LOGGING)
         ------------------------------------------------------------- */}
      {isHistoryModalOpen && historyTarget && (
        <Modal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          title={isBn ? 'রোগীর পূর্বের চিকিৎসা ইতিহাস' : 'Patient Clinical History'}
        >
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
            <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-[11px] font-bold text-amber-900">
              DEMO - not a real medical record
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs space-y-1">
              <span className="text-slate-600 block">{isBn ? 'রোগী:' : 'Patient:'}</span>
              <p className="font-bold text-[#0F172A]">
                {historyTarget.patientName} ({historyTarget.patientId})
              </p>
              <p className="text-[10px] text-slate-600">
                {isBn
                  ? 'রোগীর গোপনীয়তার স্বার্থে এই রেকর্ডে ডাক্তারের প্রতিটি অ্যাক্সেস অডিট লগে সংরক্ষিত হয়েছে।'
                  : 'Access to this patient medical record was verified and recorded in compliance logs.'}
              </p>
            </div>

            {historyError ? (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg">
                {historyError}
              </div>
            ) : patientHistoryList.length === 0 ? (
              <p className="text-xs text-slate-600 italic py-4 text-center">
                {isBn ? 'এই রোগীর কোনো পূর্ববর্তী চূড়ান্ত ভিজিট রেকর্ড নেই।' : 'No previous visit records found for this patient.'}
              </p>
            ) : (
              <div className="space-y-3">
                {patientHistoryList.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl border border-[#E2E8F0] bg-white space-y-2 text-xs shadow-2xs"
                  >
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                      <div>
                        <span className="font-bold text-[#0F172A] block">{rec.visitDate}</span>
                        <span className="text-[10px] text-slate-600">{rec.doctorName}</span>
                      </div>
                      <Badge variant={rec.status === 'FINALIZED' ? 'success' : 'neutral'}>
                        {rec.status}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-slate-800">
                      <p>
                        <strong className="text-[#0F172A]">{isBn ? 'উপসর্গ: ' : 'Complaint: '}</strong>
                        {rec.complaint}
                      </p>
                      <p>
                        <strong className="text-[#0F172A]">{isBn ? 'পর্যবেক্ষণ: ' : 'Observation: '}</strong>
                        {rec.observation}
                      </p>
                      <p>
                        <strong className="text-[#0F172A]">{isBn ? 'পরামর্শ: ' : 'Advice: '}</strong>
                        {rec.advice}
                      </p>
                    </div>

                    {rec.prescriptionItems && rec.prescriptionItems.length > 0 && (
                      <div className="pt-2 border-t border-[#E2E8F0]">
                        <span className="font-bold text-[11px] text-[#1E3A8A] block mb-1">
                          {isBn ? 'প্রেসক্রিপশন:' : 'Prescribed Medications:'}
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                          {rec.prescriptionItems.map((item) => (
                            <li key={item.id}>
                              <strong>{item.medicine}</strong> — {item.dose} ({item.duration})
                              {item.instructions ? ` • ${item.instructions}` : ''}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsHistoryModalOpen(false)}>
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* -------------------------------------------------------------
          10. STATUS UPDATE CONFIRMATION MODAL
         ------------------------------------------------------------- */}
      {isActionModalOpen && selectedAppointment && actionType && (
        <Modal
          isOpen={isActionModalOpen}
          onClose={() => setIsActionModalOpen(false)}
          title={`${isBn ? 'স্ট্যাটাস আপডেট নিশ্চিতকরণ' : 'Confirm Status Update'}: ${actionType}`}
        >
          <div className="space-y-4">
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1 text-xs">
              <span className="text-slate-600 block">{isBn ? 'রেফারেন্স:' : 'Reference:'}</span>
              <p className="font-mono font-bold text-[#1E3A8A]">{selectedAppointment.referenceNumber}</p>
              <p className="font-semibold text-[#0F172A]">
                {selectedAppointment.patientName} ({selectedAppointment.patientId})
              </p>
              <p className="text-slate-600">
                {selectedAppointment.appointmentDate} at {selectedAppointment.timeSlot}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] block">
                {isBn ? 'প্রশাসনিক মন্তব্য (ঐচ্ছিক)' : 'Administrative Note (Optional)'}
              </label>
              <input
                type="text"
                placeholder={isBn ? 'যেমন: চেম্বারে উপস্থিত হতে বলা হয়েছে...' : 'e.g., Confirmed by duty doctor, patient informed...'}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
              <p className="text-[10px] text-slate-600">
                {isBn
                  ? 'গোপনীয়তার স্বার্থে কোনো স্বাস্থ্য বা প্রেসক্রিপশন তথ্য লিখবেন না।'
                  : 'Notice: Strictly avoid including private health or prescription details.'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsActionModalOpen(false)}>
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmAction}>
                {isBn ? 'আপডেট নিশ্চিত করুন' : `Mark as ${actionType}`}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* -------------------------------------------------------------
          11. ADD ROSTER SHIFT MODAL
         ------------------------------------------------------------- */}
      {isAddShiftModalOpen && (
        <Modal
          isOpen={isAddShiftModalOpen}
          onClose={() => setIsAddShiftModalOpen(false)}
          title={isBn ? 'নতুন ডিউটি রোস্টার শিফট যোগ করুন' : 'Add New Duty Roster Shift'}
        >
          <form onSubmit={handleAddShiftSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] block">
                {isBn ? 'চিকিৎসক' : 'Doctor'} *
              </label>
              <select
                value={shiftForm.doctorId}
                onChange={(e) => setShiftForm({ ...shiftForm, doctorId: e.target.value })}
                className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A]"
              >
                {initialMedicalDoctorsData.map((d) => (
                  <option key={d.id} value={d.id}>
                    {isBn ? d.nameBn : d.name} ({d.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] block">
                {isBn ? 'বার' : 'Day of Week'} *
              </label>
              <select
                value={shiftForm.dayOfWeek}
                onChange={(e) => setShiftForm({ ...shiftForm, dayOfWeek: e.target.value })}
                className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A]"
              >
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] block">
                {isBn ? 'সময় স্লট' : 'Time Slot'} *
              </label>
              <input
                type="text"
                value={shiftForm.timeSlot}
                onChange={(e) => setShiftForm({ ...shiftForm, timeSlot: e.target.value })}
                placeholder="09:00 AM - 09:30 AM"
                className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-xl font-mono text-[#0F172A]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0F172A] block">
                  {isBn ? 'কক্ষ নম্বর' : 'Room Number'} *
                </label>
                <input
                  type="text"
                  value={shiftForm.roomNumber}
                  onChange={(e) => setShiftForm({ ...shiftForm, roomNumber: e.target.value })}
                  placeholder="Room 101"
                  className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-xl font-mono text-[#0F172A]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0F172A] block">
                  {isBn ? 'সর্বোচ্চ রোগী' : 'Max Patients'} *
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={shiftForm.maxPatients}
                  onChange={(e) => setShiftForm({ ...shiftForm, maxPatients: parseInt(e.target.value) || 1 })}
                  className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-xl font-mono text-[#0F172A]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddShiftModalOpen(false)}>
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button variant="primary" size="sm" type="submit">
                {isBn ? 'শিফট যুক্ত করুন' : 'Add Shift'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* -------------------------------------------------------------
          12. AUDIT TRAIL MODAL (IMMUTABLE ADMINISTRATIVE AUDIT)
         ------------------------------------------------------------- */}
      {isAuditModalOpen && selectedAppointment && (
        <Modal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          title={isBn ? 'অ্যাপয়েন্টমেন্ট অডিট বিবরণ' : 'Administrative Audit History'}
        >
          <div className="space-y-4">
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">{isBn ? 'রেফারেন্স:' : 'Reference:'}</span>
                <span className="font-mono font-bold text-[#1E3A8A]">{selectedAppointment.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{isBn ? 'রোগী:' : 'Patient:'}</span>
                <span className="font-semibold text-slate-800">
                  {selectedAppointment.patientName} ({selectedAppointment.patientId})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{isBn ? 'স্ট্যাটাস:' : 'Current Status:'}</span>
                {getStatusBadge(selectedAppointment.status)}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                {isBn ? 'অডিট ট্রেইল লগ' : 'Audit Trail Logs'}
              </h4>
              <p className="text-[11px] text-slate-600">
                {isBn
                  ? 'গোপনীয়তার নীতি অনুযায়ী শুধুমাত্র পরিবর্তনের সময় ও ভূমিকা সংরক্ষিত।'
                  : 'Role, action, and timestamp. Strictly devoid of health/diagnostic notes.'}
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
                        Actor: {log.actorRole} {log.note ? `• ${log.note}` : ''}
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
          13. M3: ISSUE / SUPERSEDE MEDICAL REST CERTIFICATE MODAL
         ------------------------------------------------------------- */}
      {isCertificateModalOpen && activeVisitRecord && (
        <Modal
          isOpen={isCertificateModalOpen}
          onClose={() => setIsCertificateModalOpen(false)}
          title={
            activeCertificate && activeCertificate.status === 'VALID'
              ? (isBn ? 'মেডিকেল রেস্ট সার্টিফিকেট সংশোধন ও নতুন সংস্করণ' : 'Correct & Supersede Medical Rest Certificate')
              : (isBn ? 'মেডিকেল রেস্ট সার্টিফিকেট ইস্যু করুন' : 'Issue Medical Rest Certificate')
          }
        >
          <form onSubmit={handleIssueCertificateSubmit} className="space-y-4">
            <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-[11px] font-bold text-amber-900 flex items-center justify-between">
              <span>DEMO - not an official medical certificate</span>
              <span className="text-[10px] font-mono">Center: JSTU Medical Center</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isBn
                ? 'আইনগত ও গোপনীয়তার নীতি অনুযায়ী সনদে কোনো ডায়াগনসিস বা স্বাস্থ্য বিবরণ থাকে না। এটি শুধুমাত্র শিক্ষার্থীর নাম, আইডি, অনুমোদিত বিশ্রামের মেয়াদ ও ডাক্তারের ভূমিকা প্রকাশ করে।'
                : 'The certificate contains NO diagnosis and NO health details. It states only: patient name and ID, the center, rest period, and the doctor role.'}
            </p>

            {certError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg">
                {certError}
              </div>
            )}

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Patient:</span>
                <span className="font-bold text-[#0F172A]">{activeVisitRecord.patientName} ({activeVisitRecord.patientId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Department:</span>
                <span className="text-slate-800">{activeVisitRecord.patientDepartment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Doctor Role:</span>
                <span className="font-semibold text-[#1E3A8A]">Medical Officer</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#0F172A] block mb-1">
                  {isBn ? 'ছুটি শুরুর তারিখ' : 'Rest Start Date'} *
                </label>
                <input
                  type="date"
                  value={certificateForm.restStartDate}
                  onChange={(e) => setCertificateForm({ ...certificateForm, restStartDate: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-xl font-mono text-[#0F172A]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A] block mb-1">
                  {isBn ? 'ছুটির মেয়াদ (দিন)' : 'Rest Days'} *
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={certificateForm.restDays}
                  onChange={(e) => setCertificateForm({ ...certificateForm, restDays: parseInt(e.target.value) || 1 })}
                  className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-xl font-mono text-[#0F172A]"
                  required
                />
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs flex justify-between items-center font-mono">
              <span className="text-slate-600">Calculated Rest Period:</span>
              <span className="font-bold text-[#1E3A8A]">
                {certificateForm.restStartDate} &rarr;{' '}
                {new Date(
                  new Date(certificateForm.restStartDate).getTime() +
                    (Math.max(1, Number(certificateForm.restDays)) - 1) * 86400000
                )
                  .toISOString()
                  .split('T')[0]}{' '}
                ({certificateForm.restDays} days)
              </span>
            </div>

            {/* If superseding an existing valid certificate, require mandatory reason */}
            {activeCertificate && activeCertificate.status === 'VALID' && (
              <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
                <label className="text-xs font-bold text-amber-900 block">
                  {isBn ? 'পূর্বের সংস্করণ সংশোধনের কারণ (বাধ্যতামূলক)' : 'Mandatory Correction Reason'} *
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    isBn
                      ? 'যেমন: রোগীর ফলো-আপ অনুযায়ী আরও ৩ দিন বিশ্রাম বর্ধিত করা হলো...'
                      : 'e.g., Extension of rest period by 3 days after follow-up re-evaluation...'
                  }
                  value={certificateForm.supersededReason}
                  onChange={(e) => setCertificateForm({ ...certificateForm, supersededReason: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-amber-300 rounded-xl text-[#0F172A]"
                  required
                />
                <p className="text-[10px] text-slate-600">
                  {isBn
                    ? 'পূর্ববর্তী সংস্করণটি SUPERSEDED হিসেবে বজায় থাকবে এবং অডিটে দৃশ্যমান হবে।'
                    : 'The previous version will be marked SUPERSEDED and remain verifiable with this reason.'}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsCertificateModalOpen(false)}>
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={certActionLoading}
                className="bg-emerald-700 hover:bg-emerald-800"
              >
                {certActionLoading
                  ? isBn
                    ? 'প্রক্রিয়াধীন...'
                    : 'Processing...'
                  : activeCertificate && activeCertificate.status === 'VALID'
                  ? isBn
                    ? 'নতুন সংস্করণ ইস্যু করুন'
                    : 'Issue New Version'
                  : isBn
                  ? 'সার্টিফিকেট ইস্যু করুন'
                  : 'Issue Rest Certificate'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* -------------------------------------------------------------
          14. M3: REVOKE MEDICAL REST CERTIFICATE MODAL
         ------------------------------------------------------------- */}
      {isRevokeModalOpen && activeCertificate && (
        <Modal
          isOpen={isRevokeModalOpen}
          onClose={() => setIsRevokeModalOpen(false)}
          title={isBn ? 'সার্টিফিকেট বাতিল নিশ্চিতকরণ (Revoke)' : 'Revoke Medical Rest Certificate'}
        >
          <form onSubmit={handleRevokeCertificateSubmit} className="space-y-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold block">
                  Warning: Revoking marks this certificate permanently invalid!
                </span>
                Any pending or future medical leave applications referencing this certificate will trigger an explicit
                warning to approvers.
              </div>
            </div>

            {revokeError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg">
                {revokeError}
              </div>
            )}

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Verification ID:</span>
                <span className="font-mono font-bold text-[#1E3A8A]">{activeCertificate.verificationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Patient:</span>
                <span className="font-bold text-[#0F172A]">{activeCertificate.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Rest Period:</span>
                <span className="font-mono text-slate-800">
                  {activeCertificate.restStartDate} &rarr; {activeCertificate.restEndDate} ({activeCertificate.restDays} days)
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] block">
                {isBn ? 'বাতিলের সুনির্দিষ্ট কারণ (বাধ্যতামূলক)' : 'Mandatory Reason for Revocation'} *
              </label>
              <textarea
                rows={3}
                placeholder={
                  isBn
                    ? 'বাতিলের প্রাতিষ্ঠানিক কারণ লিখুন (যেমন: ভুল তথ্যের ভিত্তিতে ইস্যু করা হয়েছিলো)...'
                    : 'State the institutional reason (e.g., Issued based on preliminary observation retracted after lab reports)...'
                }
                value={revocationReason}
                onChange={(e) => setRevocationReason(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-red-300 rounded-xl text-[#0F172A] focus:ring-2 focus:ring-red-500"
                required
              />
              <p className="text-[10px] text-slate-600">
                Audit requirement: This reason will be publicly visible upon verifying this token as REVOKED.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsRevokeModalOpen(false)}>
                {isBn ? 'ফিরে যান' : 'Cancel'}
              </Button>
              <Button
                variant="danger"
                size="sm"
                type="submit"
                disabled={certActionLoading}
              >
                {certActionLoading ? 'Revoking...' : isBn ? 'বাতিল নিশ্চিত করুন' : 'Confirm Revocation'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
