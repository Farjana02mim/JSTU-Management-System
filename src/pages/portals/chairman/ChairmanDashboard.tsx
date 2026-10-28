import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getChairmanDataService, ChairmanDashboardData, ChairmanCourseSheetSummary } from '../../../services/chairman';
import { ApproverInbox } from '../../../components/workflow/ApproverInbox';
import { WorkflowActor } from '../../../services/workflow';
import {
  Building2,
  ShieldCheck,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Filter,
  ArrowRight,
  BookOpen,
  Calendar,
  Users,
  Inbox,
  TrendingUp
} from 'lucide-react';
import { AdminAnalyticsDashboard } from '../../../components/admin/AdminAnalyticsDashboard';

export const ChairmanDashboard: React.FC = () => {
  const { user, profile, claims } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ChairmanDashboardData | null>(null);
  const [activeSection, setActiveSection] = useState<'analytics' | 'marks' | 'applications'>('analytics');
  const [filter, setFilter] = useState<'all' | 'SUBMITTED' | 'VERIFIED' | 'DRAFT'>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const chairmanService = getChairmanDataService();
  const departmentId = claims?.departmentId || 'CSE';

  const chairmanActor: WorkflowActor = {
    uid: user?.uid || 'demo_chairman_01',
    email: user?.email || 'chairman.demo@jstu.ac.bd',
    fullName: profile?.fullName || 'Prof. Dr. Chairman CSE',
    fullNameBn: profile?.fullNameBn || 'অধ্যাপক ড. চেয়ারম্যান সিএসই',
    role: 'dept_chairman',
    departmentId
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await chairmanService.getDashboardData(user?.email || 'chairman.demo@jstu.ac.bd', departmentId);
      setData(res);
    } catch (err: unknown) {
      console.error('Failed to load chairman dashboard data:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [departmentId, user?.email]);

  const filteredSheets = data?.recentSheets.filter((sheet) => {
    if (filter === 'all') return true;
    if (filter === 'DRAFT') return sheet.status === 'DRAFT' || sheet.status === 'RETURNED_TO_TEACHER';
    return sheet.status === filter;
  }) || [];

  const getStatusBadge = (status: ChairmanCourseSheetSummary['status']) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
            {isBn ? 'অনুমোদনের অপেক্ষায়' : 'Pending Verification'}
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-900 border border-indigo-300">
            <CheckCircle2 className="w-3 h-3 text-indigo-600" />
            {isBn ? 'চেয়ারম্যান কর্তৃক অনুমোদিত' : 'Verified & Forwarded'}
          </span>
        );
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {isBn ? 'প্রকাশিত' : 'Published'}
          </span>
        );
      case 'RETURNED_TO_TEACHER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-900 border border-rose-300">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            {isBn ? 'সংশোধনের জন্য ফেরত' : 'Returned for Revision'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
            <FileText className="w-3 h-3 text-slate-500" />
            {isBn ? 'ড্রাফট (শিক্ষক)' : 'Draft with Faculty'}
          </span>
        );
    }
  };

  return (
    <DashboardLayout portalTitle={isBn ? 'বিভাগীয় চেয়ারম্যান পোর্টাল' : 'Department Chairman Portal'}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-bold">
                  Department of {data?.departmentName || departmentId} &bull; {departmentId}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Phase 3C-1
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
                {isBn
                  ? `চেয়ারম্যান, ${profile?.fullNameBn || 'প্রফেসর ড. চেয়ারম্যান সিএসই'}`
                  : `Chairman, ${profile?.fullName || 'Prof. Dr. Chairman CSE'}`}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin/content">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                  leftIcon={<FileText className="w-4 h-4 text-emerald-600" />}
                >
                  {isBn ? 'বিভাগীয় ওয়েবসাইট কন্টেন্ট' : 'Department Web Content'}
                </Button>
              </Link>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Departmental Signer &bull; MFA Verified</span>
              </div>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isBn
              ? 'জেএসটিইউ বিভাগীয় ফলাফল স্ক্রুটিনি সিস্টেম। পরীক্ষা অর্ডিন্যান্স অনুযায়ী শিক্ষকগণের দাখিলকৃত মার্কস শিট নিরীক্ষণ, অসঙ্গতি শনাক্তকরণ ও অনুমোদন করুন।'
              : 'JSTU Departmental Tabulation Scrutiny System. Verify continuous assessment mark sheets, inspect anomaly alerts, and endorse submissions to the Controller of Examinations.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">{isBn ? 'ত্রুটি' : 'Error'}</h4>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Section Switcher Tabs */}
        <div className="flex border-b border-[#E2E8F0] gap-4">
          <button
            onClick={() => setActiveSection('analytics')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'analytics'
                ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{isBn ? 'বিভাগীয় অ্যানালিটিক্স' : 'Department Analytics'}</span>
          </button>

          <button
            onClick={() => setActiveSection('marks')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'marks'
                ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{isBn ? 'ফলাফল শিট স্ক্রুটিনি' : 'Marks Tabulation Scrutiny'}</span>
          </button>

          <button
            onClick={() => setActiveSection('applications')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'applications'
                ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>{isBn ? 'পেপারলেস আবেদন ইনবক্স' : 'Paperless Applications Inbox'}</span>
          </button>
        </div>

        {activeSection === 'analytics' ? (
          <AdminAnalyticsDashboard
            departmentScoped={true}
            departmentId={departmentId}
            departmentName={data?.departmentName || departmentId}
            onNavigateToApplications={() => setActiveSection('applications')}
          />
        ) : activeSection === 'applications' ? (
          <ApproverInbox actor={chairmanActor} portalTitle="Department Chairman" />
        ) : (
          <>
            {/* 4 Metric Cards */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SkeletonLoader variant="rectangular" className="h-28" />
            <SkeletonLoader variant="rectangular" className="h-28" />
            <SkeletonLoader variant="rectangular" className="h-28" />
            <SkeletonLoader variant="rectangular" className="h-28" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pending Verification Card */}
            <div
              onClick={() => setFilter('SUBMITTED')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                filter === 'SUBMITTED'
                  ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/50 shadow-xs'
                  : 'bg-white border-[#E2E8F0] hover:border-amber-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-amber-800 mb-1">
                <span>{isBn ? 'অনুমোদনের অপেক্ষায়' : 'Pending Scrutiny'}</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <div className="text-3xl font-extrabold text-amber-900 tabular-nums">
                {data?.pendingVerificationCount || 0}
              </div>
              <p className="text-[11px] text-amber-700 mt-1">
                {isBn ? 'শিক্ষকগণ জমা দিয়েছেন' : 'Sheets awaiting Chairman action'}
              </p>
            </div>

            {/* Verified Sheets Card */}
            <div
              onClick={() => setFilter('VERIFIED')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                filter === 'VERIFIED'
                  ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-400/50 shadow-xs'
                  : 'bg-white border-[#E2E8F0] hover:border-indigo-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-800 mb-1">
                <span>{isBn ? 'অনুমোদিত শিট' : 'Verified Sheets'}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div className="text-3xl font-extrabold text-indigo-900 tabular-nums">
                {data?.verifiedCount || 0}
              </div>
              <p className="text-[11px] text-indigo-700 mt-1">
                {isBn ? 'পরীক্ষা নিয়ন্ত্রকের অপেক্ষায়' : 'Forwarded to Exam Controller'}
              </p>
            </div>

            {/* Draft with Teachers Card */}
            <div
              onClick={() => setFilter('DRAFT')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                filter === 'DRAFT'
                  ? 'bg-slate-100 border-slate-300 ring-2 ring-slate-400/50 shadow-xs'
                  : 'bg-white border-[#E2E8F0] hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>{isBn ? 'ড্রাফট / সংশোধনাধীন' : 'Drafts / In Revision'}</span>
                <Clock className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="text-3xl font-extrabold text-slate-800 tabular-nums">
                {(data?.draftCount || 0) + (data?.returnedCount || 0)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isBn ? 'শিক্ষক কর্তৃক প্রস্তুত হচ্ছে' : 'With course instructors'}
              </p>
            </div>

            {/* Anomalies Detected Card */}
            <div className="p-5 rounded-2xl border bg-white border-[#E2E8F0] shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>{isBn ? 'সনাক্তকৃত অসঙ্গতি' : 'Integrity Alerts'}</span>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className={`text-3xl font-extrabold tabular-nums ${
                (data?.totalAnomalies || 0) > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {data?.totalAnomalies || 0}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {(data?.totalAnomalies || 0) > 0
                  ? isBn ? 'সীমা বা মোট নম্বরে ত্রুটি' : 'Ceiling or sum discrepancies'
                  : isBn ? 'কোনো অসঙ্গতি নেই' : 'All marks within ordinance bounds'}
              </p>
            </div>
          </div>
        )}

        {/* Tabulation Sheet List Section */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#1E3A8A]" />
                {isBn ? 'বিভাগীয় ফলাফল শিট স্ক্রুটিনি রেজিস্টার' : 'Departmental Result Sheet Register'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn
                  ? `মোট ${data?.totalCourses || 0} টি কোর্সের ফলাফল শিট বিভাগীয় আওতায় অন্তর্ভুক্ত`
                  : `Showing courses under Department of ${departmentId}`}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-medium">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-white text-[#1E3A8A] font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                {isBn ? 'সকল' : 'All'} ({data?.totalCourses || 0})
              </button>
              <button
                onClick={() => setFilter('SUBMITTED')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filter === 'SUBMITTED'
                    ? 'bg-white text-amber-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                {isBn ? 'অনুমোদনের অপেক্ষায়' : 'Pending'} ({data?.pendingVerificationCount || 0})
              </button>
              <button
                onClick={() => setFilter('VERIFIED')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filter === 'VERIFIED'
                    ? 'bg-white text-indigo-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                {isBn ? 'অনুমোদিত' : 'Verified'} ({data?.verifiedCount || 0})
              </button>
              <button
                onClick={() => setFilter('DRAFT')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filter === 'DRAFT'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                {isBn ? 'ড্রাফট' : 'Draft'} ({(data?.draftCount || 0) + (data?.returnedCount || 0)})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              <SkeletonLoader variant="rectangular" className="h-16" />
              <SkeletonLoader variant="rectangular" className="h-16" />
              <SkeletonLoader variant="rectangular" className="h-16" />
            </div>
          ) : filteredSheets.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={<Award className="w-12 h-12 text-slate-300" />}
                title={isBn ? 'কোনো ফলাফল শিট পাওয়া যায়নি' : 'No Result Sheets Found'}
                description={
                  isBn
                    ? 'নির্বাচিত ফিল্টারে এই বিভাগে কোনো মার্কস শিট পাওয়া যায়নি।'
                    : 'No course result sheets currently match the selected scrutiny filter.'
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">{isBn ? 'কোর্স কোড ও নাম' : 'Course & Title'}</th>
                    <th className="py-3 px-4">{isBn ? 'কোর্স শিক্ষক' : 'Instructor'}</th>
                    <th className="py-3 px-4">{isBn ? 'শিক্ষার্থী' : 'Students'}</th>
                    <th className="py-3 px-4">{isBn ? 'অবস্থা' : 'Status'}</th>
                    <th className="py-3 px-4">{isBn ? 'সততা সতর্কতা' : 'Anomaly Alerts'}</th>
                    <th className="py-3 px-4 sm:px-6 text-right">{isBn ? 'পদক্ষেপ' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredSheets.map((sheet) => (
                    <tr
                      key={sheet.courseCode}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/chairman/sheets/${sheet.courseCode}`)}
                    >
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-base text-[#1E3A8A]">
                            {sheet.courseCode}
                          </span>
                          <span className="text-xs text-[#0F172A] font-medium line-clamp-1">
                            {isBn ? sheet.courseTitleBn : sheet.courseTitle}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {sheet.semester} &bull; {sheet.credits} Credits
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">{sheet.instructorName}</span>
                          <span className="text-[11px] text-slate-400">{sheet.instructorEmail}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-slate-700">
                        {sheet.enrolledCount}
                      </td>

                      <td className="py-4 px-4">
                        {getStatusBadge(sheet.status)}
                      </td>

                      <td className="py-4 px-4">
                        {sheet.anomalyCount > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>
                              {sheet.anomalyCount} {isBn ? 'অসঙ্গতি সনাক্ত' : 'Alerts'}
                            </span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{isBn ? 'যাচাইকৃত' : 'Clean'}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <Link
                          to={`/chairman/sheets/${sheet.courseCode}`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                            sheet.status === 'SUBMITTED'
                              ? 'bg-[#1E3A8A] text-white hover:bg-blue-900'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <span>{sheet.status === 'SUBMITTED' ? (isBn ? 'নিরীক্ষণ করুন' : 'Scrutinize') : (isBn ? 'দেখুন' : 'Review')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Audit & Examination Committee Ordinances Callout */}
        <div className="p-6 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-[#0F172A] text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#1E3A8A]" />
              {isBn ? 'বিভাগীয় পরীক্ষা কমিটি সংক্রান্ত নিয়মাবলী' : 'Departmental Examination Scrutiny Guidelines'}
            </h3>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              {isBn
                ? 'জেএসটিইউ অর্ডিন্যান্স অনুযায়ী ধারাবাহিক মূল্যায়নের ৫০ নম্বর (উপস্থিতি ১০, ক্লাস টেস্ট ২০, মিডটার্ম ২০) ও সেমিস্টার ফাইনালের ৫০ নম্বর যাচাই পূর্বক চেয়ারম্যান অনুমোদন করবেন। অনুমোদনের পর শিট স্বয়ংক্রিয়ভাবে পরীক্ষা নিয়ন্ত্রকের দপ্তরে স্থানান্তরিত হয়।'
                : 'Under JSTU Ordinance, Continuous Assessment (50 marks: Attendance 10, CT 20, Midterm 20) and Semester Final (50 marks) must be scrutinized by the Department Chairman before submission to the Exam Controller.'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs shrink-0">
            <span>UGC Scale: 4.00</span>
          </div>
        </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
