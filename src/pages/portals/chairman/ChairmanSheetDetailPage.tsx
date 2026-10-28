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
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  getChairmanDataService,
  ChairmanSheetDetail,
  ChairmanSheetStatistics
} from '../../../services/chairman';
import {
  MarksAnomaly,
  MarksAuditEntry,
  MarksSheetStatus
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
  Building2,
  User,
  Calendar,
  BookOpen,
  Info,
  Check,
  X
} from 'lucide-react';

// Zod Schema for Mandatory Return Comment Form
const returnCommentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(5, { message: 'Review comment must be at least 5 characters explaining why the marks sheet is returned.' })
    .max(500, { message: 'Comment cannot exceed 500 characters.' })
});

export const ChairmanSheetDetailPage: React.FC = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const { user, profile, claims } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<ChairmanSheetDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'roster' | 'history' | 'context'>('roster');

  // Action Modals State
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnComment, setReturnComment] = useState('');
  const [returnCommentError, setReturnCommentError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);

  const chairmanService = getChairmanDataService();
  const departmentId = claims?.departmentId || 'CSE';

  const loadSheetDetail = async () => {
    if (!courseCode) return;
    try {
      setLoading(true);
      setActionErrorMsg(null);
      const res = await chairmanService.getSheetDetail(
        user?.email || 'chairman.demo@jstu.ac.bd',
        departmentId,
        courseCode
      );
      setDetail(res);
    } catch (err: unknown) {
      console.error('Failed to load sheet detail:', err);
      setActionErrorMsg(err instanceof Error ? err.message : 'Error loading result sheet detail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSheetDetail();
  }, [courseCode, departmentId]);

  // Handler for Verify & Endorse
  const handleVerify = async () => {
    if (!detail) return;
    setActionLoading(true);
    setActionErrorMsg(null);
    try {
      const actor = {
        uid: user?.uid || 'demo_chairman_01',
        email: user?.email || 'chairman.demo@jstu.ac.bd',
        fullName: profile?.fullName || 'Prof. Dr. Chairman CSE',
        role: 'dept_chairman',
        departmentId
      };

      const result = await chairmanService.verifySheet(actor, detail.courseCode);
      setVerifyModalOpen(false);
      setActionSuccessMsg(
        isBn
          ? `${detail.courseCode} কোর্সের মার্কস শিট সফলভাবে অনুমোদিত হয়েছে এবং পরীক্ষা নিয়ন্ত্রক দপ্তরে প্রেরণ করা হয়েছে।`
          : `Marks sheet for ${detail.courseCode} has been verified and officially endorsed to the Exam Controller.`
      );
      // Reload updated sheet
      await loadSheetDetail();
    } catch (err: unknown) {
      console.error('Verification error:', err);
      setActionErrorMsg(err instanceof Error ? err.message : 'Failed to verify marks sheet');
    } finally {
      setActionLoading(false);
    }
  };

  // Handler for Return to Teacher with Zod validation
  const handleReturnToTeacher = async () => {
    if (!detail) return;
    setReturnCommentError(null);

    // Validate with Zod
    const validationResult = returnCommentSchema.safeParse({ comment: returnComment });
    if (!validationResult.success) {
      setReturnCommentError(validationResult.error.issues[0]?.message || 'Invalid comment');
      return;
    }

    setActionLoading(true);
    setActionErrorMsg(null);
    try {
      const actor = {
        uid: user?.uid || 'demo_chairman_01',
        email: user?.email || 'chairman.demo@jstu.ac.bd',
        fullName: profile?.fullName || 'Prof. Dr. Chairman CSE',
        role: 'dept_chairman',
        departmentId
      };

      const result = await chairmanService.returnSheet(actor, detail.courseCode, returnComment.trim());
      setReturnModalOpen(false);
      setReturnComment('');
      setActionSuccessMsg(
        isBn
          ? `${detail.courseCode} কোর্সের মার্কস শিট সংশোধনী নির্দেশনাসহ শিক্ষকের নিকট ফেরত পাঠানো হয়েছে।`
          : `Marks sheet for ${detail.courseCode} has been returned to the course instructor with scrutiny notes.`
      );
      // Reload updated sheet
      await loadSheetDetail();
    } catch (err: unknown) {
      console.error('Return error:', err);
      setActionErrorMsg(err instanceof Error ? err.message : 'Failed to return marks sheet');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: MarksSheetStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
            {isBn ? 'চেয়ারম্যানের অনুমোদনের অপেক্ষায়' : 'Pending Chairman Verification'}
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-900 border border-indigo-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            {isBn ? 'চেয়ারম্যান অনুমোদিত ও প্রেরিত' : 'Verified & Forwarded'}
          </span>
        );
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {isBn ? 'ফলাফল প্রকাশিত' : 'Published by Exam Controller'}
          </span>
        );
      case 'RETURNED_TO_TEACHER':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-900 border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            {isBn ? 'সংশোধনের জন্য ফেরত' : 'Returned for Revision'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {isBn ? 'ড্রাফট (শিক্ষক প্রস্তুত করছেন)' : 'Draft with Instructor'}
          </span>
        );
    }
  };

  const entriesList = detail ? Object.values(detail.entries || {}) : [];

  return (
    <DashboardLayout portalTitle={isBn ? 'ফলাফল শিট স্ক্রুটিনি' : 'Tabulation Scrutiny'}>
      <div className="space-y-6">
        {/* Top Navigation & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/chairman"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#1E3A8A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? 'চেয়ারম্যান ড্যাশবোর্ডে ফিরুন' : 'Back to Chairman Dashboard'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>{isBn ? 'প্রিন্ট ভিউ' : 'Printable Sheet'}</span>
            </Button>
          </div>
        </div>

        {/* Success Alert */}
        {actionSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-sm flex items-start justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">{isBn ? 'সফল হয়েছে' : 'Action Successful'}</h4>
                <p className="text-xs sm:text-sm">{actionSuccessMsg}</p>
              </div>
            </div>
            <button
              onClick={() => setActionSuccessMsg(null)}
              className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Alert */}
        {actionErrorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-sm flex items-start justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">{isBn ? 'অনুমতি বা ভ্যালিডেশন ত্রুটি' : 'Permission / Validation Error'}</h4>
                <p className="text-xs sm:text-sm mt-0.5">{actionErrorMsg}</p>
              </div>
            </div>
            <button
              onClick={() => setActionErrorMsg(null)}
              className="text-rose-700 hover:text-rose-900 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            <SkeletonLoader variant="rectangular" className="h-40" />
            <SkeletonLoader variant="rectangular" className="h-64" />
          </div>
        ) : !detail ? (
          <EmptyState
            icon={<Award className="w-12 h-12 text-slate-300" />}
            title={isBn ? 'ফলাফল শিট পাওয়া যায়নি' : 'Result Sheet Not Found'}
            description={isBn ? 'এই কোর্সের কোনো মার্কস শিট নেই।' : 'No sheet found for the given course code.'}
          />
        ) : (
          <>
            {/* Header Course Card */}
            <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-2xl sm:text-3xl text-[#1E3A8A]">
                      {detail.courseCode}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                      {detail.credits} Credits
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {detail.semester}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-1.5">
                    {isBn ? detail.courseTitleBn : detail.courseTitle}
                  </h1>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(detail.status)}
                  <span className="text-[11px] text-slate-400">
                    {isBn ? 'সর্বশেষ সংরক্ষিত:' : 'Last saved:'} {new Date(detail.lastSavedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Course Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E2E8F0] text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-400 uppercase font-semibold text-[10px]">Course Instructor</span>
                  <p className="font-semibold text-slate-800">{detail.instructorName}</p>
                  <p className="text-slate-500 font-mono text-[11px]">{detail.instructorEmail}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 uppercase font-semibold text-[10px]">Academic Unit</span>
                  <p className="font-semibold text-slate-800">Dept. of {detail.department}</p>
                  <p className="text-slate-500">Jamalpur-2012</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 uppercase font-semibold text-[10px]">Enrollment & Roster</span>
                  <p className="font-semibold text-slate-800">{detail.enrolledStudents.length} Students</p>
                  <p className="text-slate-500">Continuous Assessment (50%) + Final (50%)</p>
                </div>
              </div>

              {/* Return Reason Banner (if returned) */}
              {detail.status === 'RETURNED_TO_TEACHER' && detail.returnComment && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[10px] text-rose-800 block">
                      Returned to Teacher with Scrutiny Notes:
                    </span>
                    <p className="mt-0.5 italic">"{detail.returnComment}"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Anomaly Alerts Banner (If any anomalies detected) */}
            {detail.anomalies.length > 0 && (
              <div className="p-5 bg-amber-50 border border-amber-300 rounded-2xl shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-amber-900 text-sm sm:text-base">
                      {isBn ? 'সতর্কতা: ফলাফল শিটে অসঙ্গতি সনাক্ত হয়েছে' : 'Audit Notice: Tabulation Anomalies Detected'}
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-900">
                    {detail.anomalies.length} {isBn ? 'টি সতর্কতা' : 'Warnings'}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-amber-900 divide-y divide-amber-200/60">
                  {detail.anomalies.map((anom, idx) => (
                    <div key={idx} className="pt-1.5 first:pt-0 flex items-start gap-2">
                      <span className="font-mono text-amber-700 font-bold shrink-0">&bull;</span>
                      <div>
                        <span className="font-semibold">{isBn && anom.messageBn ? anom.messageBn : anom.message}</span>
                        {anom.field && (
                          <span className="ml-2 font-mono text-[10px] bg-amber-200/80 px-1.5 py-0.5 rounded">
                            Field: {anom.field}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-amber-700 italic">
                  {isBn
                    ? 'পরামর্শ: অসঙ্গতি থাকলে শিটটি অনুমোদন না করে কারণ উল্লেখপূর্বক শিক্ষকের নিকট ফেরত পাঠানোর সুপারিশ করা হচ্ছে।'
                    : 'Recommendation: If discrepancies are severe, use "Return to Instructor" with detailed instructions to rectify before verification.'}
                </p>
              </div>
            )}

            {/* Action Bar for Chairman */}
            <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Chairman Actions:
                </span>
                {detail.status === 'SUBMITTED' ? (
                  <span className="text-slate-500">
                    {isBn ? 'শিটটি যাচাই করে অনুমোদন করুন অথবা ফেরত পাঠান' : 'Scrutinize marks and endorse or return with comments'}
                  </span>
                ) : detail.status === 'VERIFIED' ? (
                  <span className="text-indigo-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isBn ? 'অনুমোদন সম্পন্ন। পরীক্ষা নিয়ন্ত্রকের দপ্তরে হস্তান্তরিত।' : 'Verified & forwarded to Office of Controller of Examinations.'}
                  </span>
                ) : (
                  <span className="text-slate-500">
                    {isBn ? 'এই শিটটি বর্তমানে সম্পাদনার পর্যায়ে রয়েছে।' : 'Sheet is currently in preparation mode with instructor.'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {detail.status === 'SUBMITTED' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReturnModalOpen(true)}
                      className="border-rose-300 text-rose-700 hover:bg-rose-50 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{isBn ? 'শিক্ষকের কাছে ফেরত পাঠান' : 'Return to Instructor'}</span>
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setVerifyModalOpen(true)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isBn ? 'অনুমোদন ও অগ্রবর্তী করুন' : 'Verify & Endorse'}</span>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] text-xs sm:text-sm font-semibold">
              <button
                onClick={() => setActiveTab('roster')}
                className={`pb-3 px-4 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'roster'
                    ? 'border-[#1E3A8A] text-[#1E3A8A]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {isBn ? 'ট্যাবুলেশন মার্কস রোস্টার' : 'Tabulation Roster'} ({entriesList.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-3 px-4 transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'border-[#1E3A8A] text-[#1E3A8A]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{isBn ? 'অডিট হিস্টোরি ও ট্রেইল' : 'Audit Trail & History'}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
                  {detail.auditTrail.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('context')}
                className={`pb-3 px-4 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'context'
                    ? 'border-[#1E3A8A] text-[#1E3A8A]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {isBn ? 'কোর্স বিবরণ ও শিক্ষার্থী' : 'Course Context'}
              </button>
            </div>

            {/* Tab 1: Marks Roster */}
            {activeTab === 'roster' && (
              <div className="space-y-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Enrolled</span>
                    <div className="text-xl font-extrabold text-slate-900 tabular-nums">
                      {detail.stats.enrolledCount}
                    </div>
                  </div>
                  <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Passed</span>
                    <div className="text-xl font-extrabold text-emerald-700 tabular-nums">
                      {detail.stats.passedCount}
                    </div>
                  </div>
                  <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Failed (F)</span>
                    <div className="text-xl font-extrabold text-rose-700 tabular-nums">
                      {detail.stats.failedCount}
                    </div>
                  </div>
                  <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Average Marks</span>
                    <div className="text-xl font-extrabold text-blue-900 tabular-nums">
                      {detail.stats.averageMarks}
                    </div>
                  </div>
                  <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Highest Marks</span>
                    <div className="text-xl font-extrabold text-slate-900 tabular-nums">
                      {detail.stats.highestMarks}
                    </div>
                  </div>
                  <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Lowest Marks</span>
                    <div className="text-xl font-extrabold text-slate-900 tabular-nums">
                      {detail.stats.lowestMarks}
                    </div>
                  </div>
                </div>

                {/* Tabulation Table */}
                <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs overflow-hidden">
                  <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
                    <h3 className="font-bold text-[#0F172A] text-sm flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#1E3A8A]" />
                      <span>{isBn ? 'শিক্ষার্থী অনুযায়ী নম্বরের বিস্তারিত বিবরণ' : 'Student Tabulation Sheet Breakdown'}</span>
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">
                      Attendance: 10 &bull; CT: 20 &bull; Midterm: 20 &bull; Final: 50
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F1F5F9] text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-[#E2E8F0]">
                        <tr>
                          <th className="py-3 px-3">Roll</th>
                          <th className="py-3 px-3">Student ID</th>
                          <th className="py-3 px-3">Name</th>
                          <th className="py-3 px-2 text-center">Att. (10)</th>
                          <th className="py-3 px-2 text-center">CT (20)</th>
                          <th className="py-3 px-2 text-center">Mid (20)</th>
                          <th className="py-3 px-2 text-center">Final (50)</th>
                          <th className="py-3 px-3 text-center bg-blue-50/50">Total (100)</th>
                          <th className="py-3 px-2 text-center">Grade</th>
                          <th className="py-3 px-3 text-center">GP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        {detail.enrolledStudents.map((st) => {
                          const entry = detail.entries[st.studentId];
                          const isFailed = entry && (entry.letterGrade === 'F' || entry.total < 40);

                          return (
                            <tr
                              key={st.studentId}
                              className={`hover:bg-slate-50/80 transition-colors ${
                                isFailed ? 'bg-rose-50/30' : ''
                              }`}
                            >
                              <td className="py-3 px-3 font-mono font-bold text-slate-700">
                                {st.rollNumber}
                              </td>
                              <td className="py-3 px-3 font-mono text-slate-600">
                                {st.studentId}
                              </td>
                              <td className="py-3 px-3 font-medium text-slate-900">
                                {isBn ? st.nameBn : st.name}
                              </td>

                              {entry ? (
                                <>
                                  <td className="py-3 px-2 text-center font-mono font-semibold text-slate-800">
                                    {entry.attendance}
                                  </td>
                                  <td className="py-3 px-2 text-center font-mono font-semibold text-slate-800">
                                    {entry.classTests}
                                  </td>
                                  <td className="py-3 px-2 text-center font-mono font-semibold text-slate-800">
                                    {entry.midterm}
                                  </td>
                                  <td className="py-3 px-2 text-center font-mono font-semibold text-slate-800">
                                    {entry.finalExam !== undefined ? entry.finalExam : '-'}
                                  </td>
                                  <td className="py-3 px-3 text-center font-mono font-extrabold text-[#1E3A8A] bg-blue-50/40">
                                    {entry.total}
                                  </td>
                                  <td className="py-3 px-2 text-center">
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                                      entry.letterGrade === 'A+' ? 'bg-emerald-100 text-emerald-900' :
                                      entry.letterGrade === 'F' ? 'bg-rose-100 text-rose-900 font-extrabold' :
                                      'bg-slate-100 text-slate-800'
                                    }`}>
                                      {entry.letterGrade}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                                    {entry.gradePoint.toFixed(2)}
                                  </td>
                                </>
                              ) : (
                                <td colSpan={7} className="py-3 px-3 text-center text-slate-400 italic">
                                  No marks recorded
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Audit Trail & History Panel */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                    <div>
                      <h3 className="font-bold text-[#0F172A] text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#1E3A8A]" />
                        <span>{isBn ? 'অডিট হিস্টোরি ও লাইফসাইকেল ট্রেইল' : 'Append-Only Audit Trail & Lifecycle History'}</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isBn
                          ? 'জেএসটিইউ সুরক্ষা অর্ডিন্যান্স অনুযায়ী সকল লাইফসাইকেল পরিবর্তন অপরিবর্তনীয়ভাবে সংরক্ষণ করা হয়।'
                          : 'Cryptographically ordered log of all state machine events for this result sheet.'}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Append-Only Immutable Log</span>
                    </span>
                  </div>

                  {detail.auditTrail.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No audit transitions recorded yet.
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {detail.auditTrail.map((entry, idx) => (
                        <div key={entry.id || idx} className="relative space-y-1 text-xs">
                          {/* Dot indicator */}
                          <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#1E3A8A] ring-4 ring-white" />

                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{entry.actorName}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                                {entry.role}
                              </span>
                              <span className="text-slate-400 font-mono text-[11px]">&bull; {entry.actorEmail}</span>
                            </div>

                            <span className="text-slate-400 font-mono text-[11px]">
                              {new Date(entry.timestamp).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 pt-1 font-mono">
                            <span className="font-bold text-[#1E3A8A]">{entry.action}</span>
                            <span className="text-slate-400">:</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]">
                              {entry.fromStatus}
                            </span>
                            <span className="text-slate-400">&rarr;</span>
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold text-[11px]">
                              {entry.toStatus}
                            </span>
                          </div>

                          {entry.comment && (
                            <div className="mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 italic">
                              "{entry.comment}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Course Context */}
            {activeTab === 'context' && (
              <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-4">
                <h3 className="font-bold text-sm text-[#0F172A]">{isBn ? 'কোর্স ও শিক্ষক তথ্য' : 'Course & Instructor Metadata'}</h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-900">Syllabus Overview: </span>
                    Comprehensive study of academic ordinance requirements, continuous assessment evaluation, and semester final scrutiny.
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Enrolled Students: </span>
                    {detail.enrolledStudents.length} registered students in Fall 2026.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Verification Confirmation Modal */}
        <Modal
          isOpen={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
          title={isBn ? 'ফলাফল শিট অনুমোদন নিশ্চিতকরণ' : 'Confirm Result Sheet Verification'}
          description={
            isBn
              ? `${detail?.courseCode} কোর্সের মার্কস শিট কি অনুমোদন করবেন? এটি বিভাগীয় অনুমোদন পেয়ে পরীক্ষা নিয়ন্ত্রকের দপ্তরে স্থানান্তরিত হবে।`
              : `Are you sure you want to verify and endorse the tabulation sheet for ${detail?.courseCode}? This will forward the results to the Office of the Controller of Examinations.`
          }
        >
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            {detail && detail.anomalies.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Notice:</span> This sheet contains {detail.anomalies.length} anomaly warnings. Please confirm that you have scrutinized these items.
                </div>
              </div>
            )}

            <p>
              By verifying, you confirm that continuous assessment marks adhere to the UGC 4.00 grading scale and JSTU Academic Ordinance ceilings.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVerifyModalOpen(false)}
                disabled={actionLoading}
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleVerify}
                disabled={actionLoading}
                className="bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                {actionLoading ? (isBn ? 'অনুমোদন হচ্ছে...' : 'Verifying...') : (isBn ? 'অনুমোদন নিশ্চিত করুন' : 'Confirm & Endorse')}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Return to Teacher Modal with Mandatory Comment & Zod Validation */}
        <Modal
          isOpen={returnModalOpen}
          onClose={() => setReturnModalOpen(false)}
          title={isBn ? 'মার্কস শিট সংশোধনের জন্য ফেরত প্রেরণ' : 'Return Marks Sheet for Revision'}
          description={
            isBn
              ? `কোর্স শিক্ষক ${detail?.instructorName}-এর নিকট স্পষ্ট কারণ ও সংশোধনী নির্দেশনাসহ শিটটি ফেরত পাঠান।`
              : `Return the marks sheet for ${detail?.courseCode} to instructor ${detail?.instructorName} with scrutiny revision instructions.`
          }
        >
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                {isBn ? 'সংশোধনী মন্তব্য ও কারণ (বাধ্যতামূলক)' : 'Review Notes & Reason for Return (Mandatory)'}
              </label>
              <textarea
                value={returnComment}
                onChange={(e) => {
                  setReturnComment(e.target.value);
                  if (returnCommentError) setReturnCommentError(null);
                }}
                rows={4}
                placeholder={
                  isBn
                    ? 'যেমন: রোল ৪ এর ক্লাস টেস্ট মার্কস যাচাই করুন এবং উপস্থিতির নম্বর পুনঃনিরীক্ষণ করুন...'
                    : 'e.g., Please reconcile class test marks for roll 04 and verify attendance calculations before resubmission.'
                }
                className={`w-full p-2.5 text-xs rounded-xl border transition-colors ${
                  returnCommentError
                    ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400'
                    : 'border-slate-300 focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]'
                }`}
              />
              {returnCommentError && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  {returnCommentError}
                </p>
              )}
            </div>

            <p className="text-[11px] text-slate-500">
              * The instructor will receive an immediate notification with this note and can modify and re-submit the sheet.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReturnModalOpen(false)}
                disabled={actionLoading}
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleReturnToTeacher}
                disabled={actionLoading}
                className="bg-rose-700 hover:bg-rose-800 text-white"
              >
                {actionLoading ? (isBn ? 'ফেরত পাঠানো হচ্ছে...' : 'Returning...') : (isBn ? 'ফেরত পাঠান' : 'Return to Instructor')}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};
