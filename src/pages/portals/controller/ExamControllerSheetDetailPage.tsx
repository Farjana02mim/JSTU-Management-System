import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Modal } from '../../../components/common/Modal';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { ReAuthConfirmationModal } from '../../../components/common/ReAuthConfirmationModal';
import { PrintableTabulationSheet } from '../../../components/marks/PrintableTabulationSheet';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  getExamControllerDataService,
  ControllerSheetDetail
} from '../../../services/controller';
import {
  MarksCorrectionRequest,
  MarksSheetVersionSnapshot
} from '../../../services/marks/lifecycleTypes';
import {
  Award,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Printer,
  ShieldCheck,
  Layers,
  Building2,
  User,
  Calendar,
  BookOpen,
  Info,
  Check,
  X,
  Send,
  History,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

const returnCommentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(5, { message: 'Return note must be at least 5 characters long.' })
    .max(500, { message: 'Return note cannot exceed 500 characters.' })
});

const rejectCorrectionSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, { message: 'Rejection reason must be at least 5 characters long.' })
});

export const ExamControllerSheetDetailPage: React.FC = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<ControllerSheetDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'roster' | 'corrections' | 'versions' | 'history'>('roster');
  const [printableMode, setPrintableMode] = useState(false);

  // Modals
  const [publishReAuthOpen, setPublishReAuthOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnComment, setReturnComment] = useState('');
  const [returnError, setReturnError] = useState<string | null>(null);

  // Correction Action Modals
  const [selectedCorrection, setSelectedCorrection] = useState<MarksCorrectionRequest | null>(null);
  const [approveReAuthOpen, setApproveReAuthOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);

  const controllerService = getExamControllerDataService();

  const loadDetail = async () => {
    if (!courseCode) return;
    try {
      setLoading(true);
      setActionErrorMsg(null);
      const res = await controllerService.getSheetDetail(courseCode);
      setDetail(res);
    } catch (err: unknown) {
      setActionErrorMsg(err instanceof Error ? err.message : 'Failed to load sheet detail.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [courseCode]);

  // Execute Official Publication
  const handlePublishConfirm = async () => {
    if (!detail) return;
    setActionLoading(true);
    try {
      const actor = {
        uid: user?.uid || 'demo_controller_01',
        email: user?.email || 'controller.demo@jstu.ac.bd',
        fullName: profile?.fullName || 'Dr. Md. Mokhlesur Rahman',
        role: 'exam_controller',
        officeId: 'EXAM_CONTROLLER'
      };

      const result = await controllerService.publishSheet(detail.courseCode, actor);
      setActionSuccessMsg(
        isBn
          ? `${detail.courseCode} কোর্সের ফলাফল আনুষ্ঠানিকভাবে প্রকাশ করা হয়েছে। সকল শিক্ষার্থী তাদের পোর্টালে ফলাফল দেখতে পাবেন।`
          : `Official result for ${detail.courseCode} PUBLISHED! Results are now permanently live for students.`
      );
      await loadDetail();
    } catch (err: unknown) {
      setActionErrorMsg(err instanceof Error ? err.message : 'Publication failed.');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Return to Chairman
  const handleReturnToChairman = async () => {
    if (!detail) return;
    const val = returnCommentSchema.safeParse({ comment: returnComment });
    if (!val.success) {
      setReturnError(val.error.issues[0]?.message || 'Invalid return note');
      return;
    }

    setActionLoading(true);
    setReturnError(null);
    try {
      const actor = {
        uid: user?.uid || 'demo_controller_01',
        email: user?.email || 'controller.demo@jstu.ac.bd',
        fullName: profile?.fullName || 'Dr. Md. Mokhlesur Rahman',
        role: 'exam_controller',
        officeId: 'EXAM_CONTROLLER'
      };

      await controllerService.returnSheet(detail.courseCode, returnComment, actor);
      setReturnModalOpen(false);
      setReturnComment('');
      setActionSuccessMsg(
        isBn
          ? `ফলাফল শিটটি বিভাগীয় চেয়ারম্যানের কাছে ফেরত পাঠানো হয়েছে। মন্তব্য নথিভুক্ত হয়েছে।`
          : `Result sheet successfully returned to Dept. Chairman with review note.`
      );
      await loadDetail();
    } catch (err: unknown) {
      setReturnError(err instanceof Error ? err.message : 'Return failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Approve Correction
  const handleApproveCorrectionConfirm = async () => {
    if (!detail || !selectedCorrection) return;
    setActionLoading(true);
    try {
      const actor = {
        uid: user?.uid || 'demo_controller_01',
        email: user?.email || 'controller.demo@jstu.ac.bd',
        fullName: profile?.fullName || 'Dr. Md. Mokhlesur Rahman',
        role: 'exam_controller',
        officeId: 'EXAM_CONTROLLER'
      };

      const res = await controllerService.approveCorrection(
        detail.courseCode,
        selectedCorrection.id,
        actor,
        'Officially approved by Controller of Examinations.'
      );

      setActionSuccessMsg(
        isBn
          ? `সংশোধন অনুমোদিত হয়েছে! নতুন সংস্করণ (v${res.newVersion}) তৈরি হয়েছে এবং শিক্ষার্থী ফলাফল হালনাগাদ হয়েছে।`
          : `Correction approved! New version v${res.newVersion} generated. Prior version safely preserved in history.`
      );
      setSelectedCorrection(null);
      await loadDetail();
    } catch (err: unknown) {
      setActionErrorMsg(err instanceof Error ? err.message : 'Approval failed.');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Reject Correction
  const handleRejectCorrection = async () => {
    if (!detail || !selectedCorrection) return;
    const val = rejectCorrectionSchema.safeParse({ reason: rejectionReason });
    if (!val.success) {
      setRejectionError(val.error.issues[0]?.message || 'Invalid rejection reason.');
      return;
    }

    setActionLoading(true);
    setRejectionError(null);
    try {
      const actor = {
        uid: user?.uid || 'demo_controller_01',
        email: user?.email || 'controller.demo@jstu.ac.bd',
        fullName: profile?.fullName || 'Dr. Md. Mokhlesur Rahman',
        role: 'exam_controller',
        officeId: 'EXAM_CONTROLLER'
      };

      await controllerService.rejectCorrection(
        detail.courseCode,
        selectedCorrection.id,
        actor,
        rejectionReason
      );

      setRejectModalOpen(false);
      setRejectionReason('');
      setSelectedCorrection(null);
      setActionSuccessMsg(
        isBn ? 'সংশোধন আবেদনটি বাতিল করা হয়েছে।' : 'Correction request rejected.'
      );
      await loadDetail();
    } catch (err: unknown) {
      setRejectionError(err instanceof Error ? err.message : 'Rejection failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (printableMode && detail) {
    return <PrintableTabulationSheet detail={detail} onBack={() => setPrintableMode(false)} />;
  }

  if (loading) {
    return (
      <DashboardLayout portalTitle={isBn ? 'পরীক্ষা নিয়ন্ত্রক দপ্তর' : 'Office of Exam Controller'}>
        <div className="space-y-6">
          <SkeletonLoader variant="rectangular" className="h-28 rounded-2xl" />
          <SkeletonLoader variant="rectangular" className="h-96 rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (!detail) {
    return (
      <DashboardLayout portalTitle={isBn ? 'পরীক্ষা নিয়ন্ত্রক দপ্তর' : 'Office of Exam Controller'}>
        <Card padding="lg" className="text-center py-12 space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">
            {isBn ? 'কোর্স বা মার্কস শিট পাওয়া যায়নি' : 'Marks Sheet Not Found'}
          </h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/office/exam_controller')}>
            {isBn ? 'রেজিস্টারে ফিরুন' : 'Back to Register'}
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  const isVerified = detail.status === 'VERIFIED';
  const isPublished = detail.status === 'PUBLISHED';
  const pendingCorrections = detail.corrections.filter((c) => c.status === 'PENDING');

  return (
    <DashboardLayout portalTitle={isBn ? 'পরীক্ষা নিয়ন্ত্রক দপ্তর' : 'Office of Exam Controller'}>
      <div className="space-y-6">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/office/exam_controller"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1E3A8A]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? 'ফলাফল রেজিস্টারে ফিরুন' : 'Back to Results Register'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPrintableMode(true)}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              {isBn ? 'মুদ্রণ / পিডিএফ ভিউ' : 'Printable Tabulation Sheet'}
            </Button>

            {isVerified && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReturnComment('');
                    setReturnError(null);
                    setReturnModalOpen(true);
                  }}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5 text-red-600" />}
                >
                  {isBn ? 'চেয়ারম্যানের কাছে ফেরত' : 'Return to Chairman'}
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setPublishReAuthOpen(true)}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  {isBn ? 'ফলাফল প্রকাশ করুন' : 'Publish Result'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Action Messages */}
        {actionSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg(null)} className="text-slate-400 hover:text-slate-600 text-xs">
              &times;
            </button>
          </div>
        )}

        {actionErrorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{actionErrorMsg}</span>
            </div>
            <button onClick={() => setActionErrorMsg(null)} className="text-slate-400 hover:text-slate-600 text-xs">
              &times;
            </button>
          </div>
        )}

        {/* Sheet Overview Card */}
        <Card padding="lg" className="bg-white border-[#E2E8F0] shadow-2xs space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {detail.courseCode}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1 ${
                    isPublished
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : isVerified
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {isPublished && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  {isVerified && <Clock className="w-3 h-3 text-amber-600" />}
                  <span>{detail.status}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                  v{detail.currentVersion}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                {isBn ? detail.courseTitleBn : detail.courseTitle}
              </h1>
              <p className="text-xs text-slate-500">
                Department of {detail.department} &bull; {detail.semester} &bull; Credits: {detail.credits.toFixed(1)} &bull; Instructor: {detail.instructorName}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Enrolled</span>
                <span className="text-xl font-black font-mono text-slate-800">{detail.statistics.enrolledCount}</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center">
                <span className="text-[10px] text-emerald-700 uppercase font-bold block">Passed</span>
                <span className="text-xl font-black font-mono text-emerald-700">{detail.statistics.passedCount}</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl text-center">
                <span className="text-[10px] text-blue-700 uppercase font-bold block">Average</span>
                <span className="text-xl font-black font-mono text-[#1E3A8A]">{detail.statistics.averageMarks}</span>
              </div>
            </div>
          </div>

          {/* Verification Status Banner */}
          {isVerified && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>{isBn ? 'চেয়ারম্যানের অনুমোদন সম্পন্ন:' : 'Department Scrutiny Complete:'}</strong>{' '}
                  {isBn
                    ? 'এই শিটটি প্রকাশনা ও স্থায়ী সনদের জন্য প্রস্তুত।'
                    : 'Verified by CSE Chairman. Ready for publication.'}
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setPublishReAuthOpen(true)}
                leftIcon={<Send className="w-3 h-3" />}
              >
                {isBn ? 'এখনই প্রকাশ করুন' : 'Publish Now'}
              </Button>
            </div>
          )}

          {isPublished && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>{isBn ? 'ফলাফল আনুষ্ঠানিকভাবে প্রকাশিত:' : 'Officially Published & Immutable:'}</strong>{' '}
                {isBn
                  ? 'এই শিট সরাসরি সম্পাদনা অযোগ্য। যেকোনো পরিবর্তনের জন্য সংস্করণ অনুমোদন প্রয়োজন।'
                  : 'Direct modifications locked. Post-publication corrections create snapshot versions.'}
              </span>
            </div>
          )}
        </Card>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E2E8F0] gap-4">
          <button
            onClick={() => setActiveTab('roster')}
            className={`pb-3 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'roster'
                ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{isBn ? 'মার্কস তালিকা' : 'Student Tabulation Marks'}</span>
          </button>

          <button
            onClick={() => setActiveTab('corrections')}
            className={`pb-3 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'corrections'
                ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isBn ? 'সংশোধন আবেদন' : 'Correction Requests'}</span>
            {pendingCorrections.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700 font-bold">
                {pendingCorrections.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('versions')}
            className={`pb-3 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'versions'
                ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isBn ? 'সংস্করণ ইতিহাস' : 'Version Snapshots'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold">
              v{detail.currentVersion}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{isBn ? 'অডিট হিস্ট্রি' : 'Append-Only Audit Trail'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold">
              {detail.auditTrail.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'roster' && (
          <Card padding="none" className="bg-white border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-2 text-center">Attn (10)</th>
                    <th className="py-2.5 px-2 text-center">CT (20)</th>
                    <th className="py-2.5 px-2 text-center">Mid (20)</th>
                    <th className="py-2.5 px-2 text-center">Final (50)</th>
                    <th className="py-2.5 px-2 text-center font-extrabold">Total (100)</th>
                    <th className="py-2.5 px-2 text-center">Grade</th>
                    <th className="py-2.5 px-3 text-right">GP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] font-medium text-slate-700">
                  {detail.enrolledStudents.map((st) => {
                    const entry = detail.entries[st.studentId];
                    if (!entry) return null;

                    return (
                      <tr key={st.studentId} className="hover:bg-[#F8FAFC]">
                        <td className="py-2 px-3 font-mono font-bold text-[#1E3A8A]">
                          {st.studentId}
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-semibold text-slate-900 block">{st.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{st.email}</span>
                        </td>
                        <td className="py-2 px-2 text-center font-mono">{entry.attendance}</td>
                        <td className="py-2 px-2 text-center font-mono">{entry.classTests}</td>
                        <td className="py-2 px-2 text-center font-mono">{entry.midterm}</td>
                        <td className="py-2 px-2 text-center font-mono">{entry.finalExam ?? '—'}</td>
                        <td className="py-2 px-2 text-center font-mono font-extrabold text-[#0F172A]">
                          {entry.total}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                              entry.letterGrade === 'A+'
                                ? 'bg-emerald-50 text-emerald-700'
                                : entry.letterGrade === 'A' || entry.letterGrade === 'A-'
                                ? 'bg-blue-50 text-[#1E3A8A]'
                                : entry.letterGrade === 'F'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {entry.letterGrade}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-[#0F172A]">
                          {entry.gradePoint.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Tab 2: Corrections */}
        {activeTab === 'corrections' && (
          <div className="space-y-4">
            {detail.corrections.length === 0 ? (
              <Card padding="lg" className="text-center py-12">
                <EmptyState
                  icon={<RotateCcw className="w-8 h-8 text-slate-400" />}
                  title={isBn ? 'কোনো সংশোধন আবেদন নেই' : 'No Correction Requests'}
                  description={
                    isBn
                      ? 'প্রকাশিত ফলাফলে শিক্ষক বা চেয়ারম্যান কর্তৃক কোনো নম্বর সংশোধনের প্রস্তাব জমা পড়েনি।'
                      : 'No grade corrections have been requested for this published sheet.'
                  }
                />
              </Card>
            ) : (
              detail.corrections.map((corr) => {
                const isPending = corr.status === 'PENDING';

                return (
                  <Card key={corr.id} padding="md" className="bg-white border-[#E2E8F0] shadow-2xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F1F5F9] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#1E3A8A]">
                          Request #{corr.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            corr.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : corr.status === 'REJECTED'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {corr.status}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Target Version: v{corr.versionNumber}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono">
                        Requested: {new Date(corr.requestedAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Student</span>
                        <span className="font-bold text-slate-800">{corr.studentName} ({corr.studentId})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Field & Change</span>
                        <span className="font-mono font-bold text-[#1E3A8A]">
                          {corr.field}: {corr.originalValue} &rarr; <span className="text-emerald-600">{corr.newValue}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Requester</span>
                        <span className="text-slate-700">{corr.requesterName} ({corr.requesterRole})</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Justification Reason:
                      </span>
                      <p className="text-slate-700 italic">"{corr.reason}"</p>
                    </div>

                    {corr.reviewComment && (
                      <div className="p-2.5 bg-blue-50/50 rounded-lg text-xs space-y-0.5 border border-blue-100">
                        <span className="text-[10px] font-bold text-[#1E3A8A] uppercase">
                          Controller Decision Note ({corr.approverName}):
                        </span>
                        <p className="text-slate-700">{corr.reviewComment}</p>
                      </div>
                    )}

                    {isPending && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCorrection(corr);
                            setRejectionReason('');
                            setRejectionError(null);
                            setRejectModalOpen(true);
                          }}
                          leftIcon={<X className="w-3.5 h-3.5 text-red-600" />}
                        >
                          {isBn ? 'প্রত্যাখ্যান' : 'Reject'}
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedCorrection(corr);
                            setApproveReAuthOpen(true);
                          }}
                          leftIcon={<Check className="w-3.5 h-3.5" />}
                        >
                          {isBn ? 'অনুমোদন ও নতুন সংস্করণ তৈরি' : 'Approve & Bump Version'}
                        </Button>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Tab 3: Versions */}
        {activeTab === 'versions' && (
          <div className="space-y-4">
            <Card padding="md" className="bg-emerald-50/50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <p className="font-bold">
                {isBn ? 'স্থায়ী সংস্করণ ইতিহাস' : 'Institutional Immutability Guarantee'}
              </p>
              <p className="text-slate-600">
                {isBn
                  ? `বর্তমান সক্রিয় সংস্করণ: v${detail.currentVersion}। পূর্ববর্তী সংস্করণসমূহ অপরিবর্তিত থাকে এবং প্রতিটি অডিট রেকর্ড সংরক্ষণ করা হয়।`
                  : `Active published version is v${detail.currentVersion}. Prior versions are permanently snapshotted and cannot be overwritten or purged.`}
              </p>
            </Card>

            {detail.versions.length === 0 ? (
              <Card padding="lg" className="text-center py-8 text-xs text-slate-500">
                {isBn ? 'এটি এই শিটের মূল ও প্রাথমিক সংস্করণ (v1)। কোনো সংশোধিত স্ন্যাপশট এখনও নেই।' : 'Original published version v1. No prior historical revisions recorded.'}
              </Card>
            ) : (
              detail.versions.map((v) => (
                <Card key={v.versionNumber} padding="md" className="space-y-2">
                  <div className="flex items-center justify-between text-xs border-b pb-2">
                    <span className="font-mono font-bold text-slate-800">
                      Version Snapshot v{v.versionNumber}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Created: {new Date(v.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{v.createdReason}</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Approved by: {v.approvedBy} &bull; Student Records in Snapshot: {Object.keys(v.entries).length}
                  </p>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Append-Only History */}
        {activeTab === 'history' && (
          <Card padding="none" className="bg-white border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0]">
              <h2 className="text-sm font-bold text-slate-800">
                {isBn ? 'অনুক্রমিক অডিট লগ (শুধুমাত্র সংযোজনযোগ্য)' : 'Sequential Append-Only Audit History'}
              </h2>
            </div>
            <div className="divide-y divide-[#F1F5F9]">
              {detail.auditTrail.map((audit) => (
                <div key={audit.id} className="p-4 hover:bg-[#F8FAFC] text-xs space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1E3A8A]">{audit.action}</span>
                      <span className="text-[11px] text-slate-400">
                        {audit.fromStatus} &rarr; <span className="font-bold text-slate-700">{audit.toStatus}</span>
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(audit.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    <strong>{audit.actorName}</strong> ({audit.role}) &bull; <span className="font-mono text-[11px]">{audit.actorEmail}</span>
                  </div>
                  {audit.comment && (
                    <p className="text-slate-700 italic bg-slate-50 p-2 rounded text-[11px]">
                      "{audit.comment}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Re-Auth Confirmation Dialog for PUBLISH */}
        <ReAuthConfirmationModal
          isOpen={publishReAuthOpen}
          onClose={() => setPublishReAuthOpen(false)}
          onConfirm={handlePublishConfirm}
          title="Publish Official Examination Result"
          titleBn="অফিসিয়াল ফলাফল প্রকাশ ও সিজিপিএ কার্যকর"
          actionDescription={`You are about to officially PUBLISH the marks sheet for ${detail.courseCode}. Once published, results are live for students and become strictly immutable.`}
          actionDescriptionBn={`${detail.courseCode} কোর্সের ফলাফল প্রকাশ করা হচ্ছে। প্রকাশের পর ফলাফল স্থায়ী হবে এবং শিক্ষার্থীদের পোর্টাল ও সিজিপিএ-তে দৃশ্যমান হবে।`}
          courseCode={detail.courseCode}
          confirmButtonText="Authenticate & Publish Result"
          confirmButtonTextBn="পাসওয়ার্ড যাচাই ও ফলাফল প্রকাশ করুন"
          variant="primary"
        />

        {/* Re-Auth Confirmation Dialog for APPROVE CORRECTION */}
        {selectedCorrection && (
          <ReAuthConfirmationModal
            isOpen={approveReAuthOpen}
            onClose={() => {
              setApproveReAuthOpen(false);
              setSelectedCorrection(null);
            }}
            onConfirm={handleApproveCorrectionConfirm}
            title={`Approve Correction on ${detail.courseCode}`}
            titleBn={`${detail.courseCode} কোর্সে সংশোধন অনুমোদন`}
            actionDescription={`Approving correction #${selectedCorrection.id} for student ${selectedCorrection.studentId} (${selectedCorrection.field}: ${selectedCorrection.originalValue} -> ${selectedCorrection.newValue}). This bumps the sheet to Version v${selectedCorrection.versionNumber} and preserves prior versions.`}
            actionDescriptionBn={`শিক্ষার্থী ${selectedCorrection.studentId}-এর ${selectedCorrection.field} সংশোধন অনুমোদন করা হচ্ছে। সংস্করণ বৃদ্ধি পাবে এবং পুরাতন সংস্করণ অপরিবর্তিত থাকবে।`}
            courseCode={detail.courseCode}
            confirmButtonText="Authenticate & Approve Correction"
            confirmButtonTextBn="অনুমোদন করুন ও নতুন সংস্করণ সংরক্ষণ করুন"
            variant="primary"
          />
        )}

        {/* Return to Chairman Modal */}
        <Modal
          isOpen={returnModalOpen}
          onClose={() => setReturnModalOpen(false)}
          title={isBn ? 'চেয়ারম্যানের কাছে মার্কস শিট ফেরত' : 'Return Tabulation Sheet to Dept. Chairman'}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                {isBn
                  ? 'এই শিটটি VERIFIED থেকে পুনরায় SUBMITTED স্ট্যাটাসে ফিরে যাবে। বিভাগীয় চেয়ারম্যানের কাছে নোটিফিকেশন পৌঁছাবে।'
                  : 'The sheet will transition from VERIFIED back to SUBMITTED for departmental re-examination. A mandatory comment is required.'}
              </span>
            </div>

            {returnError && (
              <div className="p-2.5 bg-red-50 text-red-700 rounded-lg">{returnError}</div>
            )}

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">
                {isBn ? 'প্রত্যাবর্তনের কারণ ও মন্তব্য (বাধ্যতামূলক):' : 'Mandatory Review / Return Comment:'}
              </label>
              <textarea
                value={returnComment}
                onChange={(e) => setReturnComment(e.target.value)}
                rows={3}
                placeholder="Explain discrepancies or required adjustments (min 5 characters)..."
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button variant="outline" size="sm" onClick={() => setReturnModalOpen(false)}>
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleReturnToChairman}
                isLoading={actionLoading}
              >
                {isBn ? 'ফেরত পাঠান' : 'Confirm Return'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Reject Correction Modal */}
        {selectedCorrection && (
          <Modal
            isOpen={rejectModalOpen}
            onClose={() => {
              setRejectModalOpen(false);
              setSelectedCorrection(null);
            }}
            title={isBn ? 'সংশোধন আবেদন প্রত্যাখ্যান' : 'Reject Correction Request'}
            size="md"
          >
            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Rejecting correction for student <strong>{selectedCorrection.studentId}</strong> on {detail.courseCode}.
              </p>

              {rejectionError && (
                <div className="p-2.5 bg-red-50 text-red-700 rounded-lg">{rejectionError}</div>
              )}

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {isBn ? 'প্রত্যাখ্যানের কারণ (বাধ্যতামূলক):' : 'Rejection Reason:'}
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  placeholder="Provide rationale for rejecting this correction request..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRejectModalOpen(false);
                    setSelectedCorrection(null);
                  }}
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleRejectCorrection}
                  isLoading={actionLoading}
                >
                  {isBn ? 'প্রত্যাখ্যান নিশ্চিত করুন' : 'Confirm Rejection'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};
