import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import {
  StaffLeaveType,
  StaffLeaveBalance,
  StaffLeaveApplicationRecord,
  StaffNotice,
  StaffNoticeCategory,
  StaffServiceRequest,
  ServiceRequestCategory,
  ServiceRequestPriority,
  StaffDirectoryMember
} from '../../types/staff';
import {
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Search,
  Filter,
  Users,
  Wrench,
  Bell,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Send,
  Download,
  Eye,
  ArrowRight,
  HelpCircle,
  Plus
} from 'lucide-react';

interface StaffPersona {
  id: string;
  staffId: string;
  name: string;
  nameBn: string;
  designation: string;
  departmentOrOffice: string;
  role: 'teacher' | 'dept_chairman' | 'registrar' | 'officer';
  avatarInitials: string;
}

const DEMO_PERSONAS: StaffPersona[] = [
  {
    id: 'teacher_tariqul_01',
    staffId: 'FAC-CSE-004',
    name: 'Dr. Md. Tariqul Islam',
    nameBn: 'ড. মো. তারিকুল ইসলাম',
    designation: 'Assistant Professor',
    departmentOrOffice: 'Computer Science & Engineering',
    role: 'teacher',
    avatarInitials: 'TI'
  },
  {
    id: 'chairman_nasreen_01',
    staffId: 'FAC-CSE-001',
    name: 'Prof. Dr. Nasreen Akhtar',
    nameBn: 'অধ্যাপক ড. নাসরীন আক্তার',
    designation: 'Chairman & Professor',
    departmentOrOffice: 'Computer Science & Engineering',
    role: 'dept_chairman',
    avatarInitials: 'NA'
  },
  {
    id: 'registrar_mannan_01',
    staffId: 'OFF-REG-001',
    name: 'Md. Abdul Mannan',
    nameBn: 'মো. আবদুল মান্নান',
    designation: 'Registrar',
    departmentOrOffice: 'Office of the Registrar',
    role: 'registrar',
    avatarInitials: 'AM'
  },
  {
    id: 'officer_ayesha_01',
    staffId: 'OFF-REG-003',
    name: 'Ayesha Siddiqua',
    nameBn: 'আয়েশা সিদ্দিকা',
    designation: 'Deputy Registrar (Personnel & HR)',
    departmentOrOffice: 'Office of the Registrar',
    role: 'officer',
    avatarInitials: 'AS'
  }
];

export const StaffPortalPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isBn = language === 'bn';

  // Active persona for interactive testing
  const [activePersona, setActivePersona] = useState<StaffPersona>(DEMO_PERSONAS[0]);

  // Main navigation tab
  const [activeTab, setActiveTab] = useState<'leave' | 'notices' | 'services' | 'directory'>('leave');

  // Data states
  const [leaveBalances, setLeaveBalances] = useState<StaffLeaveBalance[]>([]);
  const [leaveApplications, setLeaveApplications] = useState<StaffLeaveApplicationRecord[]>([]);
  const [notices, setNotices] = useState<StaffNotice[]>([]);
  const [serviceRequests, setServiceRequests] = useState<StaffServiceRequest[]>([]);
  const [directory, setDirectory] = useState<StaffDirectoryMember[]>([]);

  // Feedback banner
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Leave Modal State
  const [applyLeaveModalOpen, setApplyLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<StaffLeaveType>('casual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [daysRequested, setDaysRequested] = useState(1);
  const [actingStaff, setActingStaff] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  // Selected leave app for inspecting audit trail
  const [inspectLeaveApp, setInspectLeaveApp] = useState<StaffLeaveApplicationRecord | null>(null);

  // Approval / Rejection comment modal
  const [reviewActionModal, setReviewActionModal] = useState<{
    open: boolean;
    app: StaffLeaveApplicationRecord | null;
    action: 'approve' | 'reject';
    comment: string;
  }>({
    open: false,
    app: null,
    action: 'approve',
    comment: ''
  });

  // Notice search & filter
  const [noticeSearch, setNoticeSearch] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<string>('ALL');
  const [selectedNotice, setSelectedNotice] = useState<StaffNotice | null>(null);

  // Service Request Modal State
  const [newServiceModalOpen, setNewServiceModalOpen] = useState(false);
  const [serviceCategory, setServiceCategory] = useState<ServiceRequestCategory>('IT & Smart Classroom');
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceLocation, setServiceLocation] = useState('');
  const [servicePriority, setServicePriority] = useState<ServiceRequestPriority>('Routine');

  // Directory search & filter
  const [dirSearch, setDirSearch] = useState('');
  const [dirType, setDirType] = useState<string>('ALL');
  const [dirDept, setDirDept] = useState<string>('ALL');

  const loadData = () => {
    const store = SharedDataStoreManager.getInstance();
    setLeaveBalances(store.getStaffLeaveBalances());
    setLeaveApplications(store.getStaffLeaveApplications());
    setNotices(store.getStaffNotices());
    setServiceRequests(store.getStaffServiceRequests());
    setDirectory(store.getStaffDirectory());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute days difference when start and end dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) {
        setDaysRequested(diffDays);
      } else {
        setDaysRequested(1);
      }
    }
  }, [startDate, endDate]);

  // Current persona balance
  const currentBalance = leaveBalances.find(
    (b) => b.staffId.toLowerCase() === activePersona.staffId.toLowerCase()
  ) || {
    userId: activePersona.staffId,
    staffId: activePersona.staffId,
    staffName: activePersona.name,
    designation: activePersona.designation,
    departmentOrOffice: activePersona.departmentOrOffice,
    role: activePersona.role,
    casualTotal: 20,
    casualUsed: 4,
    casualRemaining: 16,
    medicalTotal: 30,
    medicalUsed: 3,
    medicalRemaining: 27,
    studyTotalMonths: 36,
    studyUsedMonths: 0,
    studyRemainingMonths: 36
  };

  // Pending reviews for Chairman or Registrar
  const pendingApprovalsForPersona = leaveApplications.filter((app) => {
    if (activePersona.role === 'dept_chairman') {
      return app.currentStepIndex === 0 && app.status === 'PENDING_CHAIRMAN';
    }
    if (activePersona.role === 'registrar') {
      return app.currentStepIndex === 1 && app.status === 'PENDING_REGISTRAR';
    }
    return false;
  });

  // Handle leave application submit
  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !actingStaff.trim() || !leaveReason.trim()) {
      setFeedback({
        type: 'error',
        message: isBn ? 'দয়া করে ছুটির সকল প্রয়োজনীয় তথ্য পূরণ করুন।' : 'Please fill all mandatory leave fields.'
      });
      return;
    }

    const store = SharedDataStoreManager.getInstance();
    const result = store.submitStaffLeave({
      staffId: activePersona.staffId,
      staffName: activePersona.name,
      staffNameBn: activePersona.nameBn,
      designation: activePersona.designation,
      departmentOrOffice: activePersona.departmentOrOffice,
      role: activePersona.role === 'dept_chairman' ? 'teacher' : (activePersona.role as 'teacher' | 'officer'),
      leaveType,
      startDate,
      endDate,
      daysRequested,
      reason: leaveReason,
      actingStaff,
      attachmentName: attachmentName ? 'Supporting_Medical_or_Official_Proof.pdf' : undefined
    });

    if (result.success) {
      setFeedback({
        type: 'success',
        message: isBn
          ? `ছুটির আবেদন (${result.applicationNumber}) সফলভাবে জমা হয়েছে। বিভাগীয় প্রধানের পর্যালোচনার জন্য অপেক্ষমাণ।`
          : `Leave application (${result.applicationNumber}) submitted successfully. Awaiting Chairman review.`
      });
      setApplyLeaveModalOpen(false);
      setStartDate('');
      setEndDate('');
      setDaysRequested(1);
      setActingStaff('');
      setLeaveReason('');
      setAttachmentName('');
      loadData();
    } else {
      setFeedback({
        type: 'error',
        message: result.message
      });
    }
  };

  // Handle approval action confirmation
  const handleConfirmReviewAction = () => {
    if (!reviewActionModal.app) return;
    const store = SharedDataStoreManager.getInstance();
    const actorRole = activePersona.role === 'dept_chairman' ? 'dept_chairman' : 'registrar';

    if (reviewActionModal.action === 'approve') {
      const res = store.approveStaffLeaveStep(reviewActionModal.app.id, {
        uid: activePersona.staffId,
        name: activePersona.name,
        role: actorRole,
        comment: reviewActionModal.comment
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          message: isBn ? res.message : res.message
        });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } else {
      const res = store.rejectStaffLeaveStep(reviewActionModal.app.id, {
        uid: activePersona.staffId,
        name: activePersona.name,
        role: actorRole,
        reason: reviewActionModal.comment || 'Academic or official exigencies prevent leave approval at this time.'
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          message: isBn ? 'ছুটির আবেদন বাতিল করা হয়েছে।' : 'Leave application rejected.'
        });
      }
    }

    setReviewActionModal({ open: false, app: null, action: 'approve', comment: '' });
    loadData();
  };

  // Handle service request submission
  const handleServiceRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle.trim() || !serviceDesc.trim() || !serviceLocation.trim()) {
      setFeedback({
        type: 'error',
        message: isBn ? 'অনুগ্রহ করে সার্ভিসের সকল বিবরণ দিন।' : 'Please provide all service request details.'
      });
      return;
    }

    const store = SharedDataStoreManager.getInstance();
    const created = store.submitStaffServiceRequest({
      staffId: activePersona.staffId,
      staffName: activePersona.name,
      departmentOrOffice: activePersona.departmentOrOffice,
      category: serviceCategory,
      title: serviceTitle.trim(),
      description: serviceDesc.trim(),
      location: serviceLocation.trim(),
      priority: servicePriority
    });

    setFeedback({
      type: 'success',
      message: isBn
        ? `সার্ভিস রিকোয়েস্ট (${created.id}) দাখিল করা হয়েছে। সংশ্লিষ্ট টেকনিক্যাল উইং অবগত হয়েছে।`
        : `Service request (${created.id}) logged. Assigned support team notified.`
    });

    setNewServiceModalOpen(false);
    setServiceTitle('');
    setServiceDesc('');
    setServiceLocation('');
    loadData();
  };

  // Filter notices
  const filteredNotices = notices.filter((n) => {
    const matchesCat = noticeCategory === 'ALL' || n.category === noticeCategory;
    const matchesQuery =
      n.title.toLowerCase().includes(noticeSearch.toLowerCase()) ||
      n.refNo.toLowerCase().includes(noticeSearch.toLowerCase()) ||
      n.summary.toLowerCase().includes(noticeSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Filter directory
  const filteredDirectory = directory.filter((m) => {
    const matchesType = dirType === 'ALL' || m.type === dirType;
    const matchesDept = dirDept === 'ALL' || m.departmentOrOffice === dirDept;
    const matchesQuery =
      m.name.toLowerCase().includes(dirSearch.toLowerCase()) ||
      m.designation.toLowerCase().includes(dirSearch.toLowerCase()) ||
      m.departmentOrOffice.toLowerCase().includes(dirSearch.toLowerCase()) ||
      (m.specialization && m.specialization.toLowerCase().includes(dirSearch.toLowerCase())) ||
      m.email.toLowerCase().includes(dirSearch.toLowerCase());
    return matchesType && matchesDept && matchesQuery;
  });

  const allDepts = Array.from(new Set(directory.map((m) => m.departmentOrOffice)));

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] text-white border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-[11px] font-bold tracking-wide uppercase">
                  {isBn ? 'জেএসটিইউ শিক্ষক ও কর্মকর্তা পোর্টাল' : 'JSTU Faculty & Staff Portal'}
                </span>
                <span className="text-slate-400 text-xs">• Paperless Enterprise</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {isBn ? 'কর্মকর্তা ও শিক্ষক সেবা হাব' : 'Staff Services & Leave Management'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                {isBn
                  ? 'নৈমিত্তিক ও গবেষণা ছুটির আবেদন, অনুমোদন চেইন (চেয়ারম্যান → রেজিস্ট্রার), অভ্যন্তরীণ বিজ্ঞপ্তি ও সার্ভিস রিকোয়েস্ট।'
                  : 'Multi-tiered statutory leave approval chain (Chairman -> Registrar), internal notices, logistics requests & staff directory.'}
              </p>
            </div>

            {/* Persona Switcher Bar for Demo Testing */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl shrink-0 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">
                  {isBn ? 'পরীক্ষার জন্য সক্রিয় রোল পরিবর্তন:' : 'Switch Demo Testing Persona:'}
                </span>
                <span className="text-[10px] bg-blue-600 px-1.5 py-0.5 rounded font-mono text-white">
                  {activePersona.role.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {DEMO_PERSONAS.map((persona) => {
                  const isCurrent = persona.id === activePersona.id;
                  return (
                    <button
                      key={persona.id}
                      onClick={() => {
                        setActivePersona(persona);
                        setFeedback(null);
                      }}
                      className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition border flex items-center gap-2 ${
                        isCurrent
                          ? 'bg-blue-600 text-white border-blue-400 font-bold shadow-sm'
                          : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/15'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-900 text-blue-200 font-mono text-[10px] flex items-center justify-center shrink-0">
                        {persona.avatarInitials}
                      </div>
                      <div className="truncate">
                        <div className="truncate font-semibold">{persona.name.split(' ').slice(0, 3).join(' ')}</div>
                        <div className="text-[9px] opacity-80 truncate">{persona.designation}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-xs ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-slate-400 hover:text-slate-600 text-base font-bold ml-4"
            >
              ×
            </button>
          </div>
        )}

        {/* Navigation Tabs Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-1.5 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('leave')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'leave'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{isBn ? 'ছুটির আবেদন ও ব্যালেন্স' : 'Leave & Approval Chain'}</span>
            {pendingApprovalsForPersona.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-black">
                {pendingApprovalsForPersona.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'notices'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>{isBn ? 'অভ্যন্তরীণ নোটিশ বোর্ড' : 'Staff Notice Board'}</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full font-bold">
              {notices.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'services'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>{isBn ? 'সার্ভিস রিকোয়েস্ট' : 'Service Requests'}</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'directory'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isBn ? 'স্টাফ ও ফ্যাকাল্টি ডিরেক্টরি' : 'Staff Directory'}</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
              {directory.length}
            </span>
          </button>
        </div>

        {/* TAB 1: LEAVE APPLICATION & BALANCE */}
        {activeTab === 'leave' && (
          <div className="space-y-6">
            {/* Balance Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card padding="md" className="border-l-4 border-l-blue-600 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isBn ? 'নৈমিত্তিক ছুটি (CL)' : 'Casual Leave (CL)'}
                  </span>
                  <Badge variant="primary">Annual 20d</Badge>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-blue-900 font-mono">
                    {currentBalance.casualRemaining}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    / {currentBalance.casualTotal} days left
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${(currentBalance.casualRemaining / currentBalance.casualTotal) * 100}%` }}
                  />
                </div>
              </Card>

              <Card padding="md" className="border-l-4 border-l-emerald-600 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isBn ? 'চিকিৎসা / অর্জিত ছুটি (ML)' : 'Medical / Earned Leave'}
                  </span>
                  <Badge variant="success">Annual 30d</Badge>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-800 font-mono">
                    {currentBalance.medicalRemaining}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    / {currentBalance.medicalTotal} days left
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${(currentBalance.medicalRemaining / currentBalance.medicalTotal) * 100}%` }}
                  />
                </div>
              </Card>

              <Card padding="md" className="border-l-4 border-l-purple-600 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isBn ? 'উচ্চশিক্ষা ও গবেষণা ছুটি' : 'Study & Research Quota'}
                  </span>
                  <Badge variant="neutral">Max 36m</Badge>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-purple-900 font-mono">
                    {currentBalance.studyRemainingMonths}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    / {currentBalance.studyTotalMonths} months left
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full"
                    style={{ width: `${(currentBalance.studyRemainingMonths / currentBalance.studyTotalMonths) * 100}%` }}
                  />
                </div>
              </Card>

              <Card padding="md" className="border-l-4 border-l-amber-500 bg-white flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isBn ? 'নতুন ছুটির আবেদন' : 'Apply for Leave'}
                  </span>
                  <span className="text-xs text-slate-600 mt-1 block">
                    {isBn ? 'চেয়ারম্যান ও রেজিস্ট্রারের অনুমোদনের জন্য' : 'Submit request to Chairman & Registrar'}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setApplyLeaveModalOpen(true)}
                  className="mt-3 w-full py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {isBn ? 'ছুটির আবেদন ফরম' : 'Apply for Leave'}
                </Button>
              </Card>
            </div>

            {/* Approver Inbox (shown if persona is Chairman or Registrar) */}
            {(activePersona.role === 'dept_chairman' || activePersona.role === 'registrar') && (
              <Card padding="md" className="border-amber-300 bg-amber-50/40 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {isBn ? 'অনুমোদন অপেক্ষমাণ ইনবক্স' : 'Approval Chain Inbox'}
                      </h3>
                      <span className="text-xs text-slate-600">
                        {isBn
                          ? `সক্রিয় পরীক্ষক: ${activePersona.name} (${activePersona.role === 'dept_chairman' ? 'বিভাগীয় প্রধান - ধাপ ১' : 'রেজিস্ট্রার কার্যালয় - ধাপ ২'})`
                          : `Acting as: ${activePersona.name} (${activePersona.role === 'dept_chairman' ? 'Department Chairman — Step 0' : 'Office of the Registrar — Step 1'})`}
                      </span>
                    </div>
                  </div>
                  <Badge variant="warning">
                    {pendingApprovalsForPersona.length} {isBn ? 'টি পর্যালোচনা বাকি' : 'Pending Action'}
                  </Badge>
                </div>

                {pendingApprovalsForPersona.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    {isBn ? 'আপনার অনুমোদনের জন্য কোনো ছুটির আবেদন পেন্ডিং নেই।' : 'No pending leave applications awaiting your review.'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingApprovalsForPersona.map((app) => (
                      <div
                        key={app.id}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{app.staffName}</span>
                            <span className="text-xs text-slate-500 font-mono">({app.staffId})</span>
                            <Badge variant={app.leaveType === 'casual' ? 'primary' : app.leaveType === 'medical' ? 'success' : 'neutral'}>
                              {app.leaveType.toUpperCase()} LEAVE
                            </Badge>
                            <span className="font-mono text-xs font-bold text-blue-900">
                              {app.daysRequested} {app.daysRequested > 1 ? 'days' : 'day'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600">
                            <strong>{app.departmentOrOffice}</strong> • {app.designation}
                          </div>
                          <div className="text-xs text-slate-700 mt-1">
                            <span className="font-semibold text-slate-500">{isBn ? 'কারণ: ' : 'Reason: '}</span>
                            "{app.reason}"
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {isBn ? 'দায়িত্বপ্রাপ্ত বিকল্প সহকর্মী: ' : 'Designated Acting Colleague: '}
                            <strong className="text-slate-700">{app.actingStaff}</strong>
                            {' • '}
                            <span>Dates: {app.startDate} to {app.endDate}</span>
                          </div>
                        </div>

                        {/* Approval Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setInspectLeaveApp(app)}
                            className="text-xs py-1.5 px-3"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            {isBn ? 'বিবরণ' : 'Details'}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() =>
                              setReviewActionModal({
                                open: true,
                                app,
                                action: 'reject',
                                comment: ''
                              })
                            }
                            className="text-xs py-1.5 px-3"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            {isBn ? 'প্রত্যাখ্যান' : 'Reject'}
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() =>
                              setReviewActionModal({
                                open: true,
                                app,
                                action: 'approve',
                                comment: ''
                              })
                            }
                            className="text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            {activePersona.role === 'dept_chairman'
                              ? isBn ? 'সুপারিশ ও ফরোয়ার্ড' : 'Recommend & Forward'
                              : isBn ? 'রেজিস্ট্রার চূড়ান্ত অনুমোদন' : 'Grant Final Approval'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Leave Applications History Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-900" />
                  <span>{isBn ? 'ছুটির আবেদনের ইতিহাস ও ট্র্যাকিং' : 'Leave Records & Multi-Tier Approval Progress'}</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Total {leaveApplications.length} records logged
                </span>
              </div>

              <Card padding="none" className="overflow-hidden border border-slate-200 bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider font-semibold">
                        <th className="py-3 px-4">{isBn ? 'আবেদন নম্বর ও স্টাফ' : 'Application & Staff'}</th>
                        <th className="py-3 px-4">{isBn ? 'ছুটির ধরন ও মেয়াদ' : 'Category & Duration'}</th>
                        <th className="py-3 px-4">{isBn ? 'দায়িত্বপ্রাপ্ত বিকল্প' : 'Acting Substitute'}</th>
                        <th className="py-3 px-4">{isBn ? 'অনুমোদন পর্যায়' : 'Approval Pipeline'}</th>
                        <th className="py-3 px-4">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                        <th className="py-3 px-4 text-right">{isBn ? 'অ্যাকশন' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leaveApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-4">
                            <div className="font-mono font-bold text-blue-900">{app.applicationNumber}</div>
                            <div className="font-semibold text-slate-800">{app.staffName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{app.departmentOrOffice}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold uppercase tracking-wider text-slate-700 block">
                              {app.leaveType} leave
                            </span>
                            <div className="text-[11px] text-slate-600 font-mono">
                              {app.daysRequested} days ({app.startDate} ~ {app.endDate})
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {app.actingStaff}
                          </td>
                          <td className="py-3 px-4">
                            {/* Stepper Chain (Chairman -> Registrar) */}
                            <div className="flex items-center gap-1.5 text-[11px]">
                              {/* Step 1: Chairman */}
                              <span
                                className={`px-2 py-0.5 rounded font-semibold text-[10px] flex items-center gap-1 ${
                                  app.currentStepIndex > 0 || app.status === 'APPROVED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : app.status === 'REJECTED'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {app.currentStepIndex > 0 || app.status === 'APPROVED' ? '✓ ' : ''}Chairman
                              </span>
                              <ChevronRight className="w-3 h-3 text-slate-300" />
                              {/* Step 2: Registrar */}
                              <span
                                className={`px-2 py-0.5 rounded font-semibold text-[10px] flex items-center gap-1 ${
                                  app.status === 'APPROVED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : app.status === 'PENDING_REGISTRAR'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-400'
                                }`}
                              >
                                {app.status === 'APPROVED' ? '✓ ' : ''}Registrar
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                app.status === 'APPROVED'
                                  ? 'success'
                                  : app.status === 'REJECTED'
                                  ? 'danger'
                                  : 'warning'
                              }
                            >
                              {app.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setInspectLeaveApp(app)}
                              className="text-[11px] py-1 px-2.5"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              {isBn ? 'ট্র্যাকিং' : 'Inspect'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: STAFF NOTICE BOARD */}
        {activeTab === 'notices' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <Card padding="md" className="bg-white border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={noticeSearch}
                    onChange={(e) => setNoticeSearch(e.target.value)}
                    placeholder={isBn ? 'বিজ্ঞপ্তির শিরোনাম বা স্মারক নম্বর খুঁজুন...' : 'Search circular title or reference number...'}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value)}
                    className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="ALL">{isBn ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Academic & Exam">Academic & Exam</option>
                    <option value="Welfare & Finance">Welfare & Finance</option>
                    <option value="Research & Training">Research & Training</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Notices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotices.map((n) => (
                <Card
                  key={n.id}
                  padding="md"
                  className="bg-white border-slate-200 hover:border-blue-300 transition shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{n.refNo}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          n.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : n.priority === 'Routine'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {n.priority}
                        </span>
                        <Badge variant="neutral">{n.category}</Badge>
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug">
                      {isBn ? n.titleBn : n.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {isBn ? n.summaryBn : n.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-slate-400">
                      {n.publishDate} • {isBn ? n.issuedByBn : n.issuedBy}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedNotice(n)}
                      className="text-xs py-1 px-3"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      {isBn ? 'সম্পূর্ণ পড়ুন' : 'Read Circular'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SERVICE REQUESTS */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {isBn ? 'ক্যাম্পাস ও লজিস্টিক সার্ভিস রিকোয়েস্ট' : 'Faculty & Staff Logistics Service Requests'}
                </h3>
                <span className="text-xs text-slate-500">
                  {isBn ? 'আইটি, স্মার্ট ক্লাসরুম, মাইক্রোবাস রিকুইজিশন ও অফিস সামগ্রী সহায়তা' : 'IT hardware, smart classroom repairs, microbus requisition & logistics support'}
                </span>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setNewServiceModalOpen(true)}
                className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                {isBn ? 'নতুন সার্ভিস রিকোয়েস্ট' : 'New Service Request'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceRequests.map((req) => (
                <Card
                  key={req.id}
                  padding="md"
                  className="bg-white border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-xs text-blue-900">{req.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        req.priority === 'Emergency'
                          ? 'bg-rose-100 text-rose-800'
                          : req.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {req.priority}
                      </span>
                      <Badge
                        variant={
                          req.status === 'RESOLVED'
                            ? 'success'
                            : req.status === 'IN_PROGRESS'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {req.status}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{req.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{req.description}</p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium">{req.location}</span>
                    </div>
                    {req.assignedTo && (
                      <div className="flex items-center gap-1.5 text-blue-800 text-[11px]">
                        <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Assigned to: <strong>{req.assignedTo}</strong></span>
                      </div>
                    )}
                    {req.resolutionNotes && (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50 p-1.5 rounded mt-1 border border-emerald-200">
                        Resolution: {req.resolutionNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Submitted by {req.staffName}</span>
                    <span className="font-mono">{req.submittedAt}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STAFF DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="space-y-4">
            {/* Filter & Search Toolbar */}
            <Card padding="md" className="bg-white border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={dirSearch}
                    onChange={(e) => setDirSearch(e.target.value)}
                    placeholder={isBn ? 'নাম, পদবি, বিভাগ, স্পেশালাইজেশন বা ইমেইল খুঁজুন...' : 'Search by name, designation, department, email...'}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={dirType}
                    onChange={(e) => setDirType(e.target.value)}
                    className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="ALL">{isBn ? 'সকল ধরন' : 'All Roles'}</option>
                    <option value="faculty">{isBn ? 'শিক্ষক মণ্ডলী (Faculty)' : 'Faculty Members'}</option>
                    <option value="officer">{isBn ? 'কর্মকর্তাবৃন্দ (Officers)' : 'Administrative Officers'}</option>
                    <option value="technical">{isBn ? 'কারিগরি স্টাফ (Technical)' : 'Technical Staff'}</option>
                  </select>

                  <select
                    value={dirDept}
                    onChange={(e) => setDirDept(e.target.value)}
                    className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 max-w-[200px]"
                  >
                    <option value="ALL">{isBn ? 'সকল বিভাগ ও অফিস' : 'All Departments & Offices'}</option>
                    {allDepts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Directory Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDirectory.map((m) => (
                <Card
                  key={m.id}
                  padding="md"
                  className="bg-white border-slate-200 hover:shadow-md transition space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {m.name.split(' ').slice(1, 3).map((w) => w[0]).join('') || 'ST'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-sm text-slate-900 truncate">
                          {isBn ? m.nameBn : m.name}
                        </h4>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                          m.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-blue-900">
                        {isBn ? m.designationBn : m.designation}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {m.departmentOrOffice}
                      </div>
                    </div>
                  </div>

                  {m.specialization && (
                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2">
                      <strong className="text-slate-700">Specialization:</strong> {m.specialization}
                    </p>
                  )}

                  <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <a href={`mailto:${m.email}`} className="text-blue-900 hover:underline truncate">
                        {m.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-[11px]">{m.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[11px] text-slate-500">{m.room}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* APPLY FOR LEAVE MODAL */}
      {applyLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-900" />
                {isBn ? 'ছুটির আবেদন ফরম (শিক্ষক ও কর্মকর্তা)' : 'Faculty & Staff Leave Application'}
              </h3>
              <button
                onClick={() => setApplyLeaveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyLeaveSubmit} className="space-y-3.5 text-xs">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-800 block">Applicant</span>
                  <span className="font-bold text-blue-950 text-sm">{activePersona.name}</span>
                  <span className="text-[11px] text-blue-700 block">{activePersona.designation} • {activePersona.departmentOrOffice}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-blue-800 block">Approval Chain</span>
                  <span className="font-semibold text-blue-950 text-xs">Chairman → Registrar</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isBn ? 'ছুটির ক্যাটাগরি' : 'Leave Category'} *
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as StaffLeaveType)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold"
                >
                  <option value="casual">
                    Casual Leave (CL) — Remaining: {currentBalance.casualRemaining} days
                  </option>
                  <option value="medical">
                    Medical / Earned Leave (ML) — Remaining: {currentBalance.medicalRemaining} days
                  </option>
                  <option value="study">
                    Study & Research Leave (Higher Degrees) — Remaining: {currentBalance.studyRemainingMonths} months
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isBn ? 'শুরুর তারিখ' : 'Start Date'} *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isBn ? 'সমাপ্তির তারিখ' : 'End Date'} *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border flex items-center justify-between">
                <span className="text-slate-600 font-medium">Calculated Duration:</span>
                <span className="font-mono font-bold text-sm text-blue-900">
                  {daysRequested} {daysRequested > 1 ? 'Working Days' : 'Working Day'}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isBn ? 'দায়িত্বপ্রাপ্ত বিকল্প সহকর্মী / কর্মকর্তা' : 'Designated Acting Colleague / Substitute'} *
                </label>
                <input
                  type="text"
                  required
                  value={actingStaff}
                  onChange={(e) => setActingStaff(e.target.value)}
                  placeholder="e.g. Dr. Kamrul Hasan, Assistant Professor, CSE"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isBn ? 'ছুটির সুনির্দিষ্ট কারণ' : 'Detailed Purpose & Justification'} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Provide detailed academic or personal context..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isBn ? 'সহায়ক সংযুক্তি (ঐচ্ছিক)' : 'Supporting Attachment (Optional)'}
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setAttachmentName(e.target.files[0].name);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button size="sm" variant="outline" type="button" onClick={() => setApplyLeaveModalOpen(false)}>
                  {isBn ? 'বাতিল' : 'Cancel'}
                </Button>
                <Button size="sm" variant="primary" type="submit" className="bg-blue-900 hover:bg-blue-800 text-white font-bold">
                  <Send className="w-3.5 h-3.5 mr-1" />
                  {isBn ? 'আবেদন দাখিল করুন' : 'Submit Leave Application'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT LEAVE APPLICATION MODAL */}
      {inspectLeaveApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-900">{inspectLeaveApp.applicationNumber}</span>
                <h3 className="text-base font-bold text-slate-900">
                  {inspectLeaveApp.staffName} — {inspectLeaveApp.leaveType.toUpperCase()} LEAVE
                </h3>
              </div>
              <button onClick={() => setInspectLeaveApp(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                  <span className="font-bold text-slate-800">{inspectLeaveApp.departmentOrOffice}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Designation</span>
                  <span className="font-bold text-slate-800">{inspectLeaveApp.designation}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
                  <span className="font-mono font-bold text-slate-800">
                    {inspectLeaveApp.daysRequested} days ({inspectLeaveApp.startDate} to {inspectLeaveApp.endDate})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Acting Substitute</span>
                  <span className="font-semibold text-slate-800">{inspectLeaveApp.actingStaff}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Reason for Absence</span>
                <p className="bg-slate-50 p-3 rounded-xl border text-slate-700 leading-relaxed">
                  "{inspectLeaveApp.reason}"
                </p>
              </div>

              {/* Multi-step Approval Chain History */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Statutory Approval Chain Status
                </span>

                {/* Step 1: Chairman */}
                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span>Step 0: Department Chairman Recommendation</span>
                      {inspectLeaveApp.currentStepIndex > 0 || inspectLeaveApp.status === 'APPROVED' ? (
                        <Badge variant="success">Recommended</Badge>
                      ) : inspectLeaveApp.status === 'REJECTED' ? (
                        <Badge variant="danger">Rejected</Badge>
                      ) : (
                        <Badge variant="warning">Under Review</Badge>
                      )}
                    </div>
                    {inspectLeaveApp.chairmanComment && (
                      <p className="text-[11px] text-slate-600 mt-1 italic">
                        "{inspectLeaveApp.chairmanComment}"
                      </p>
                    )}
                    {inspectLeaveApp.chairmanReviewedAt && (
                      <span className="text-[10px] text-slate-400 font-mono block mt-1">
                        Reviewed: {inspectLeaveApp.chairmanReviewedAt}
                      </span>
                    )}
                  </div>
                </div>

                {/* Step 2: Registrar */}
                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span>Step 1: Office of the Registrar Final Approval</span>
                      {inspectLeaveApp.status === 'APPROVED' ? (
                        <Badge variant="success">Officially Approved</Badge>
                      ) : inspectLeaveApp.status === 'REJECTED' ? (
                        <Badge variant="danger">Rejected</Badge>
                      ) : (
                        <Badge variant="neutral">Pending Stage 2</Badge>
                      )}
                    </div>
                    {inspectLeaveApp.registrarComment && (
                      <p className="text-[11px] text-slate-600 mt-1 italic">
                        "{inspectLeaveApp.registrarComment}"
                      </p>
                    )}
                    {inspectLeaveApp.registrarReviewedAt && (
                      <span className="text-[10px] text-slate-400 font-mono block mt-1">
                        Reviewed: {inspectLeaveApp.registrarReviewedAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t">
              <Button size="sm" variant="outline" onClick={() => setInspectLeaveApp(null)}>
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* APPROVAL / REJECTION CONFIRMATION MODAL */}
      {reviewActionModal.open && reviewActionModal.app && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className={`text-base font-bold flex items-center gap-2 ${
              reviewActionModal.action === 'approve' ? 'text-emerald-700' : 'text-rose-700'
            }`}>
              {reviewActionModal.action === 'approve' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600" />
              )}
              <span>
                {reviewActionModal.action === 'approve'
                  ? isBn ? 'ছুটির আবেদন অনুমোদন বা সুপারিশ' : 'Confirm Leave Recommendation / Approval'
                  : isBn ? 'ছুটির আবেদন বাতিল' : 'Confirm Leave Rejection'}
              </span>
            </h3>

            <p className="text-slate-600">
              {reviewActionModal.action === 'approve'
                ? `Confirm recommendation/approval for ${reviewActionModal.app.staffName}'s ${reviewActionModal.app.daysRequested}-day ${reviewActionModal.app.leaveType} leave.`
                : `Specify reasons for declining ${reviewActionModal.app.staffName}'s leave request.`}
            </p>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {reviewActionModal.action === 'approve' ? 'Official Endorsement Note / Comment' : 'Reason for Disapproval'}
              </label>
              <textarea
                rows={3}
                value={reviewActionModal.comment}
                onChange={(e) => setReviewActionModal({ ...reviewActionModal, comment: e.target.value })}
                placeholder={reviewActionModal.action === 'approve' ? 'e.g. Recommended for approval without disruption to scheduled classes.' : 'State reason...'}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setReviewActionModal({ open: false, app: null, action: 'approve', comment: '' })}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant={reviewActionModal.action === 'approve' ? 'primary' : 'danger'}
                onClick={handleConfirmReviewAction}
                className={reviewActionModal.action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold' : ''}
              >
                {reviewActionModal.action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* NEW SERVICE REQUEST MODAL */}
      {newServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-900" />
                {isBn ? 'নতুন লজিস্টিক / সার্ভিস রিকোয়েস্ট' : 'Logistics & Service Requisition'}
              </h3>
              <button onClick={() => setNewServiceModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleServiceRequestSubmit} className="space-y-3.5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Service Category *</label>
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value as ServiceRequestCategory)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold"
                >
                  <option value="IT & Smart Classroom">IT & Smart Classroom (Projector, Network, Software)</option>
                  <option value="Lab Maintenance & Equipment">Lab Maintenance & Experimental Equipment</option>
                  <option value="Transport Requisition">Transport Requisition (University Microbus / Bus)</option>
                  <option value="Office Supplies & Logistics">Office Supplies & Logistics (Stationery, Cartridges)</option>
                  <option value="Estate & Facilities">Estate & Facilities (Air Conditioning, Electric, Water)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Request Title *</label>
                <input
                  type="text"
                  required
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  placeholder="e.g. HDMI interface repair in Smart Classroom 402"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Location / Room *</label>
                  <input
                    type="text"
                    required
                    value={serviceLocation}
                    onChange={(e) => setServiceLocation(e.target.value)}
                    placeholder="e.g. Academic Building 2, Lab 403"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Urgency Priority *</label>
                  <select
                    value={servicePriority}
                    onChange={(e) => setServicePriority(e.target.value as ServiceRequestPriority)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="Routine">Routine (Within 48h)</option>
                    <option value="High">High (Within 24h)</option>
                    <option value="Emergency">Emergency (Immediate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="Detail the technical issue, specifications, date requirements, or equipment type..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button size="sm" variant="outline" type="button" onClick={() => setNewServiceModalOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit" className="bg-blue-900 hover:bg-blue-800 text-white font-bold">
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOTICE DETAIL MODAL */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="font-mono text-[11px] font-bold text-slate-400">{selectedNotice.refNo}</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {isBn ? selectedNotice.titleBn : selectedNotice.title}
                </h3>
              </div>
              <button onClick={() => setSelectedNotice(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 text-slate-500 text-[11px]">
              <span>Issued: <strong>{selectedNotice.publishDate}</strong></span>
              <span>•</span>
              <span>By: <strong>{isBn ? selectedNotice.issuedByBn : selectedNotice.issuedBy}</strong></span>
              <span>•</span>
              <Badge variant="neutral">{selectedNotice.category}</Badge>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 space-y-3 leading-relaxed text-xs">
              <p className="font-semibold text-slate-900">{isBn ? selectedNotice.summaryBn : selectedNotice.summary}</p>
              <p className="text-slate-700">{selectedNotice.body}</p>
            </div>

            {selectedNotice.attachmentName && (
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <div>
                    <span className="font-semibold text-slate-900">{selectedNotice.attachmentName}</span>
                    <span className="text-[10px] text-slate-400 block">{selectedNotice.attachmentSize}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert(`Simulated downloading: ${selectedNotice.attachmentName}`)}
                  className="text-xs py-1 px-3"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Download
                </Button>
              </div>
            )}

            <div className="flex items-center justify-end pt-3 border-t">
              <Button size="sm" variant="outline" onClick={() => setSelectedNotice(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
