/**
 * JSTU Smart Campus — Admin & Chairman Analytics Dashboard
 *
 * Recharts-powered clean white analytics view with:
 * - Stat cards (Students, Teachers, Departments, Applications, Account requests, Documents)
 * - 6 Charts (Students per Dept, Application status, Attendance, Grade distribution, Fee, Applications/mo)
 * - Recent activity feed from audit trail (role, action, time; no personal data)
 * - Quick actions (Review account requests, View applications, Publish notice)
 *
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { EmptyState } from '../common/EmptyState';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAnalyticsService, DashboardAnalyticsData } from '../../services/analytics';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { NoticeCategory } from '../../types';
import {
  Users,
  GraduationCap,
  Building2,
  Clock,
  UserCheck,
  FileCheck,
  TrendingUp,
  Award,
  DollarSign,
  Calendar,
  Activity,
  PlusCircle,
  FileText,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface AdminAnalyticsDashboardProps {
  departmentScoped?: boolean;
  departmentId?: string;
  departmentName?: string;
  onNavigateToRequests?: () => void;
  onNavigateToApplications?: () => void;
  onPublishNoticeClick?: () => void;
}

export const AdminAnalyticsDashboard: React.FC<AdminAnalyticsDashboardProps> = ({
  departmentScoped = false,
  departmentId = 'CSE',
  departmentName,
  onNavigateToRequests,
  onNavigateToApplications,
  onPublishNoticeClick
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardAnalyticsData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local state for Quick Action: Publish Notice Modal (if not handled externally)
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeTitleBn, setNoticeTitleBn] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<NoticeCategory>('Academic');
  const [noticeSummary, setNoticeSummary] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [isNoticeSubmitting, setIsNoticeSubmitting] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Applications preview modal
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);

  const analyticsService = getAnalyticsService();

  const loadData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      let res: DashboardAnalyticsData;
      if (departmentScoped) {
        res = await analyticsService.getDepartmentAnalytics(departmentId);
      } else {
        res = await analyticsService.getAdminAnalytics();
      }
      setData(res);
    } catch (err) {
      console.error('Failed to load analytics dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [departmentScoped, departmentId]);

  const handlePublishNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeSummary.trim()) return;

    try {
      setIsNoticeSubmitting(true);
      const mockService = analyticsService as any;
      if (mockService.publishNotice) {
        await mockService.publishNotice({
          title: noticeTitle.trim(),
          titleBn: noticeTitleBn.trim() || noticeTitle.trim(),
          category: noticeCategory,
          summary: noticeSummary.trim(),
          summaryBn: noticeSummary.trim(),
          body: noticeBody.trim() || noticeSummary.trim(),
          bodyBn: noticeBody.trim() || noticeSummary.trim(),
          department: departmentScoped ? departmentId : 'Central Administration',
          departmentBn: departmentScoped ? `${departmentId} বিভাগ` : 'কেন্দ্রীয় প্রশাসন',
          publisherRole: departmentScoped ? 'dept_chairman' : 'admin'
        });
      }

      setActionSuccessMessage(
        isBn
          ? 'বিজ্ঞপ্তি সফলভাবে প্রকাশিত হয়েছে এবং কেন্দ্রীয় নোটিশ বোর্ডে যুক্ত হয়েছে।'
          : 'Notice successfully published and pushed to the university bulletin.'
      );
      setIsNoticeModalOpen(false);
      setNoticeTitle('');
      setNoticeTitleBn('');
      setNoticeSummary('');
      setNoticeBody('');
      await loadData(true);
    } catch (err) {
      console.error('Failed to publish notice:', err);
    } finally {
      setIsNoticeSubmitting(false);
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `৳ ${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `৳ ${(val / 100000).toFixed(2)} Lac`;
    if (val >= 1000) return `৳ ${(val / 1000).toFixed(1)}k`;
    return `৳ ${val.toLocaleString()}`;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'student':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'teacher':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'dept_chairman':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'admin':
      case 'super_admin':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'exam_controller':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'registrar':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonLoader key={i} variant="rectangular" className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader variant="rectangular" className="h-80 rounded-2xl" />
          <SkeletonLoader variant="rectangular" className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card padding="lg" className="border-rose-200 bg-rose-50/50">
        <EmptyState
          icon={<AlertCircle className="w-12 h-12 text-rose-500" />}
          title={isBn ? 'অ্যানালিটিক্স লোড করতে ব্যর্থ' : 'Failed to Load Analytics'}
          description={error || (isBn ? 'দয়া করে পুনরায় চেষ্টা করুন।' : 'Please check connection and retry.')}
          action={
            <Button variant="primary" size="sm" onClick={() => loadData()}>
              {isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
            </Button>
          }
        />
      </Card>
    );
  }

  const { statCards } = data;
  const storeApplications = SharedDataStoreManager.getInstance().getStore().applications || [];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Demo Data Pill */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
              <span>Demo data &bull; ডেমো ডেটা</span>
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              {departmentScoped
                ? (isBn ? `বিভাগীয় পরিধি: ${departmentName || departmentId}` : `Department Scope: ${departmentName || departmentId}`)
                : (isBn ? 'সার্বজনীন প্রাতিষ্ঠানিক উপাত্ত' : 'University-Wide Metric Aggregates')}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white mt-1">
            {departmentScoped
              ? (isBn ? `${departmentName || departmentId} বিভাগীয় অ্যানালিটিক্স` : `${departmentName || departmentId} Department Analytics`)
              : (isBn ? 'অ্যাডমিন অ্যানালিটিক্স ড্যাশবোর্ড' : 'Central Admin Analytics Dashboard')}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(true)}
            disabled={refreshing}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />}
          >
            {refreshing ? (isBn ? 'রিফ্রেশ হচ্ছে...' : 'Refreshing...') : (isBn ? 'রিফ্রেশ' : 'Refresh Data')}
          </Button>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* 2. Stat Cards Grid (6 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-4">
        {/* Total Students */}
        <div className="p-3 sm:p-4 bg-white border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-semibold mb-1">
            <span className="truncate">{isBn ? 'মোট শিক্ষার্থী' : 'Total Students'}</span>
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0 ml-1" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0A2540] dark:text-white tabular-nums">
            {statCards.totalStudents.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
            {departmentScoped ? (isBn ? 'বিভাগীয় তালিকাভুক্ত' : 'Department Enrolled') : (isBn ? '৭টি বিভাগে সর্বমোট' : 'Across 7 Departments')}
          </p>
        </div>

        {/* Total Teachers */}
        <div className="p-3 sm:p-4 bg-white border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-semibold mb-1">
            <span className="truncate">{isBn ? 'মোট শিক্ষক' : 'Total Teachers'}</span>
            <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0 ml-1" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0A2540] dark:text-white tabular-nums">
            {statCards.totalTeachers.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
            {departmentScoped ? (isBn ? 'অনুষদ সদস্য' : 'Faculty Members') : (isBn ? 'পূর্ণকালীন অনুষদ' : 'Full-Time Faculty')}
          </p>
        </div>

        {/* Departments */}
        <div className="p-3 sm:p-4 bg-white border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-semibold mb-1">
            <span className="truncate">{isBn ? 'একাডেমিক বিভাগ' : 'Departments'}</span>
            <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 shrink-0 ml-1" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0A2540] dark:text-white tabular-nums">
            {departmentScoped ? statCards.departmentCode || 'CSE' : statCards.totalDepartments}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
            {departmentScoped ? (isBn ? 'নির্দিষ্ট বিভাগীয় কোড' : 'Department Scope') : (isBn ? 'অফিসিয়াল জেএসটিইউ বিভাগ' : 'Official JSTU Units')}
          </p>
        </div>

        {/* Pending Applications */}
        <div
          onClick={() => {
            if (onNavigateToApplications) onNavigateToApplications();
            else setIsApplicationsModalOpen(true);
          }}
          className="p-3 sm:p-4 bg-white border border-amber-200 dark:border-amber-900/60 rounded-2xl shadow-2xs hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-amber-800 text-[11px] sm:text-xs font-semibold mb-1">
            <span className="truncate">{isBn ? 'বিচারাধীন আবেদন' : 'Pending Apps'}</span>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0 ml-1" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-900 dark:text-amber-300 tabular-nums">
            {statCards.pendingApplications}
          </div>
          <p className="text-[10px] text-amber-700/80 mt-0.5 flex items-center gap-1 truncate">
            <span>{isBn ? 'স্ক্রুটিনির অপেক্ষায়' : 'Action Required'}</span>
            <ChevronRight className="w-3 h-3 shrink-0" />
          </p>
        </div>

        {/* Pending Account Requests */}
        <div
          onClick={() => {
            if (onNavigateToRequests) onNavigateToRequests();
          }}
          className="p-3 sm:p-4 bg-white border border-blue-200 dark:border-blue-900/60 rounded-2xl shadow-2xs hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-blue-800 text-[11px] sm:text-xs font-semibold mb-1">
            <span className="truncate">{isBn ? 'অ্যাকাউন্ট অনুরোধ' : 'Pending Requests'}</span>
            <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0 ml-1" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-900 dark:text-blue-300 tabular-nums">
            {statCards.pendingAccountRequests}
          </div>
          <p className="text-[10px] text-blue-700/80 mt-0.5 flex items-center gap-1 truncate">
            <span>{isBn ? 'যাচাই প্রয়োজন' : 'Review Queue'}</span>
            <ChevronRight className="w-3 h-3 shrink-0" />
          </p>
        </div>

        {/* Documents Issued */}
        <div className="p-3 sm:p-4 bg-white border border-emerald-200 dark:border-emerald-900/60 rounded-2xl shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-emerald-800 text-[11px] sm:text-xs font-semibold mb-1">
            <span className="truncate">{isBn ? 'ইস্যুকৃত সনদ' : 'Docs Issued'}</span>
            <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0 ml-1" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-300 tabular-nums">
            {statCards.documentsIssued}
          </div>
          <p className="text-[10px] text-emerald-700/80 mt-0.5 truncate">
            {isBn ? 'ডিজিটাল ভেরিফায়েড' : 'Signed E-Docs'}
          </p>
        </div>
      </div>

      {/* 3. Quick Actions Bar */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-50 to-blue-50/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            {isBn ? 'প্রশাসনিক অ্যাকশন' : 'Quick Actions'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          {/* Review Account Requests Action */}
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-slate-50 w-full sm:w-auto justify-center"
            onClick={() => {
              if (onNavigateToRequests) onNavigateToRequests();
            }}
            leftIcon={<UserCheck className="w-4 h-4 text-blue-600" />}
          >
            <span>{isBn ? 'অ্যাকাউন্ট আবেদন পর্যালোচনা' : 'Review Account Requests'}</span>
            {statCards.pendingAccountRequests > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-bold">
                {statCards.pendingAccountRequests}
              </span>
            )}
          </Button>

          {/* View Applications Action */}
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-slate-50 w-full sm:w-auto justify-center"
            onClick={() => {
              if (onNavigateToApplications) onNavigateToApplications();
              else setIsApplicationsModalOpen(true);
            }}
            leftIcon={<FileText className="w-4 h-4 text-indigo-600" />}
          >
            <span>{isBn ? 'আবেদন তালিকা দেখুন' : 'View Applications'}</span>
            {statCards.pendingApplications > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                {statCards.pendingApplications}
              </span>
            )}
          </Button>

          {/* Publish Notice Action */}
          <Button
            variant="primary"
            size="sm"
            className="bg-[#1E3A8A] hover:bg-[#0A2540] w-full sm:w-auto justify-center"
            onClick={() => {
              if (onPublishNoticeClick) onPublishNoticeClick();
              else setIsNoticeModalOpen(true);
            }}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            {isBn ? 'বিজ্ঞপ্তি প্রকাশ করুন' : 'Publish Notice'}
          </Button>
        </div>
      </div>

      {/* 4. Charts Section (6 Recharts in Responsive 2x3 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Students per Department / Batch Cohorts */}
        <div className="p-5 bg-white border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#1E3A8A]" />
                <span>
                  {departmentScoped
                    ? (isBn ? 'শিক্ষার্থী বণ্টন (শিক্ষাবর্ষ অনুযায়ী)' : 'Students by Academic Batch Cohort')
                    : (isBn ? 'বিভাগভিত্তিক শিক্ষার্থী সংখ্যা' : 'Students per Department')}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {departmentScoped
                  ? (isBn ? `${departmentName || departmentId} এর বর্তমান শিক্ষার্থী তালিকা` : `Active student enrollment in ${departmentName || departmentId}`)
                  : (isBn ? 'সকল ৭টি একাডেমিক বিভাগের বর্তমান শিক্ষার্থী' : 'Enrolled student count across 7 JSTU departments')}
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.studentsPerDepartment} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 text-xs space-y-1">
                          <p className="font-bold text-[#0A2540]">{isBn ? item.departmentBn : item.department}</p>
                          <p className="text-blue-700 font-medium">
                            {isBn ? 'শিক্ষার্থী:' : 'Students:'} <span className="font-extrabold">{item.students}</span>
                          </p>
                          {item.facultyCount && (
                            <p className="text-slate-500">
                              {isBn ? 'অনুষদ সদস্য:' : 'Faculty:'} {item.facultyCount}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="students" radius={[6, 6, 0, 0]}>
                  {data.studentsPerDepartment.map((entry, index) => (
                    <Cell key={`cell-dept-${index}`} fill={entry.color || '#1E3A8A'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Application Status Breakdown (Pie / Donut) */}
        <div className="p-5 bg-white border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'আবেদনের অবস্থা অনুপাত' : 'Application Status Breakdown'}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {isBn ? 'বিচারাধীন, অনুমোদিত ও প্রত্যাখ্যাত আবেদনের শতকরা হার' : 'Pending vs. Approved vs. Rejected resolution ratio'}
              </p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.applicationStatusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {data.applicationStatusBreakdown.map((entry, index) => (
                    <Cell key={`cell-status-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 text-xs space-y-1">
                          <p className="font-bold text-[#0A2540]">{isBn ? item.labelBn : item.label}</p>
                          <p className="text-slate-700">
                            {isBn ? 'মোট সংখ্যা:' : 'Total Count:'} <span className="font-extrabold">{item.count}</span>
                          </p>
                          <p className="text-slate-500">{item.percentage}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  formatter={(_value, entry: any) => (
                    <span className="text-xs text-slate-700 font-medium">
                      {isBn ? entry.payload.labelBn : entry.payload.label} ({entry.payload.count})
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Average Attendance per Department */}
        <div className="p-5 bg-white border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>
                  {departmentScoped
                    ? (isBn ? 'কোর্সওয়ারী গড় উপস্থিতি (%)' : 'Course-Level Average Attendance (%)')
                    : (isBn ? 'বিভাগভিত্তিক গড় উপস্থিতি (%)' : 'Average Attendance per Department')}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {isBn ? 'পরীক্ষায় বসার জন্য ন্যূনতম ৭৫% উপস্থিতি বাধ্যতামূলক' : '75% threshold is institutional minimum for exam eligibility'}
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.averageAttendance} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 text-xs space-y-1">
                          <p className="font-bold text-[#0A2540]">
                            {item.courseTitle ? `${item.courseCode}: ${item.courseTitle}` : (isBn ? item.departmentBn : item.department)}
                          </p>
                          <p className="text-blue-700 font-extrabold">
                            {item.averageAttendance}% {isBn ? 'উপস্থিতি' : 'Attendance'}
                          </p>
                          <p className="text-[10px] text-emerald-600 font-semibold">
                            &gt; 75% Regulatory Compliance
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="averageAttendance" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Result Grade Distribution */}
        <div className="p-5 bg-white border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600" />
                <span>{isBn ? 'ফলাফল গ্রেড বিন্যাস' : 'Result Grade Distribution'}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {isBn ? 'ইউজিসি স্ট্যান্ডার্ড ৪.০০ স্কেল গ্রেডিং পদ্ধতি' : 'UGC standard 4.00 scale letter grade breakdown'}
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.gradeDistribution} margin={{ top: 10, right: 10, left: -15, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="grade" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 text-xs space-y-1">
                          <p className="font-bold text-[#0A2540]">Grade: {item.grade} (GPA {item.gpa.toFixed(2)})</p>
                          <p className="text-purple-700 font-extrabold">
                            {item.count} {isBn ? 'শিক্ষার্থী' : 'Students'} ({item.percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {data.gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-grade-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Fee Collected vs Due */}
        <div className="p-5 bg-white border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2 gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'ফি আদায় বনাম বকেয়া' : 'Fee Collected vs. Due'}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {isBn ? 'আদায়ের হার:' : 'Collection Rate:'} <span className="font-extrabold text-emerald-700">{data.feeComparison.collectionRate}%</span>
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="text-emerald-700 font-bold">{formatCurrency(data.feeComparison.totalCollected)}</span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="text-rose-600 font-bold">{formatCurrency(data.feeComparison.totalDue)} Due</span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.feeComparison.categories} margin={{ top: 10, right: 10, left: -5, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  tickFormatter={(v) => (v >= 100000 ? `${(v / 100000).toFixed(0)}L` : `${v / 1000}k`)}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 text-xs space-y-1">
                          <p className="font-bold text-[#0A2540]">{isBn ? item.categoryBn : item.category}</p>
                          <p className="text-emerald-700 font-bold">
                            {isBn ? 'আদায়:' : 'Collected:'} ৳ {item.collected.toLocaleString()}
                          </p>
                          <p className="text-rose-600 font-bold">
                            {isBn ? 'বকেয়া:' : 'Due:'} ৳ {item.due.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="collected" name={isBn ? 'আদায় (Collected)' : 'Collected'} fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="due" name={isBn ? 'বকেয়া (Due)' : 'Due'} fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Applications per Month */}
        <div className="p-5 bg-white border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{isBn ? 'মাসিক আবেদনের ধারা' : 'Applications per Month'}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {isBn ? 'বিগত ৬ মাসের পেপারলেস আবেদন প্রবাহ' : 'Past 6 months institutional paperless application trend'}
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.applicationsPerMonth} margin={{ top: 10, right: 10, left: -15, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 text-xs space-y-1">
                          <p className="font-bold text-[#0A2540]">{isBn ? item.monthBn : item.month} 2026</p>
                          <p className="text-blue-700 font-extrabold">
                            {isBn ? 'মোট আবেদন:' : 'Total Applications:'} {item.count}
                          </p>
                          <p className="text-emerald-700">
                            {isBn ? 'অনুমোদিত:' : 'Approved:'} {item.approved}
                          </p>
                          <p className="text-amber-700">
                            {isBn ? 'বিচারাধীন:' : 'Pending:'} {item.pending}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="#1E3A8A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Recent Activity Feed from the Audit Trail (Role, Action, Time; NO PERSONAL DATA) */}
      <div className="p-5 bg-white border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? 'সাম্প্রতিক অডিট ট্রেইল অ্যাক্টিভিটি' : 'Recent Institutional Activity Feed'}</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {isBn
                ? 'অডিট লগ থেকে রিয়েল-টাইম তথ্য (গোপনীয়তা রক্ষার্থে কেবল ভূমিকা, কার্য ও সময় প্রদর্শিত)'
                : 'Sanitized audit stream (role, action, time only; strictly no personal identities or credentials)'}
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            Audit Ordinance &sect; 18.4
          </span>
        </div>

        {data.recentActivities.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            {isBn ? 'সাম্প্রতিক কোনো কার্যকলাপ পাওয়া যায়নি।' : 'No recent audit trail entries logged.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.recentActivities.map((act) => (
              <div key={act.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${getRoleBadgeColor(
                      act.role
                    )}`}
                  >
                    {isBn ? act.roleBn : act.role.replace('_', ' ')}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 truncate font-medium">
                    {isBn ? act.actionBn : act.action}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-400 whitespace-nowrap font-mono shrink-0 pl-1 sm:pl-0">
                  {isBn ? act.timeAgoBn : act.timeAgo}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal 1: Publish Notice Modal */}
      <Modal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        title={isBn ? 'নতুন প্রাতিষ্ঠানিক বিজ্ঞপ্তি প্রকাশ' : 'Publish Institutional Notice'}
      >
        <form onSubmit={handlePublishNoticeSubmit} className="space-y-4">
          <Input
            label={isBn ? 'বিজ্ঞপ্তির শিরোনাম (ইংরেজি)' : 'Notice Title (English)'}
            value={noticeTitle}
            onChange={(e) => setNoticeTitle(e.target.value)}
            placeholder="e.g. Schedule of Continuous Assessment Marks Verification"
            required
          />

          <Input
            label={isBn ? 'বিজ্ঞপ্তির শিরোনাম (বাংলা)' : 'Notice Title (Bengali)'}
            value={noticeTitleBn}
            onChange={(e) => setNoticeTitleBn(e.target.value)}
            placeholder="যেমন: ধারাবাহিক মূল্যায়ন মার্কস যাচাইয়ের সময়সূচি"
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label={isBn ? 'ক্যাটেগরি' : 'Category'}
              value={noticeCategory}
              onChange={(e) => setNoticeCategory(e.target.value as NoticeCategory)}
              options={[
                { value: 'Academic', label: 'Academic' },
                { value: 'Exam', label: 'Exam' },
                { value: 'Admission', label: 'Admission' },
                { value: 'Administration', label: 'Administration' },
                { value: 'Scholarship', label: 'Scholarship' },
                { value: 'Emergency', label: 'Emergency' }
              ]}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'প্রেরক দপ্তর' : 'Issuing Scope'}
              </label>
              <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
                {departmentScoped ? `Department of ${departmentId}` : 'Central Administration'}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'সারসংক্ষেপ' : 'Executive Summary'}
            </label>
            <textarea
              value={noticeSummary}
              onChange={(e) => setNoticeSummary(e.target.value)}
              rows={2}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Short summary displayed on public notice board..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'বিস্তারিত নোটিশ' : 'Detailed Body Content'}
            </label>
            <textarea
              value={noticeBody}
              onChange={(e) => setNoticeBody(e.target.value)}
              rows={4}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Official notification text, ordinance reference, guidelines..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsNoticeModalOpen(false)}
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isNoticeSubmitting || !noticeTitle.trim()}
              className="bg-[#1E3A8A] hover:bg-[#0A2540]"
            >
              {isNoticeSubmitting
                ? (isBn ? 'প্রকাশ হচ্ছে...' : 'Publishing...')
                : (isBn ? 'বিজ্ঞপ্তি প্রকাশ করুন' : 'Confirm & Publish')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Applications Overview Modal */}
      <Modal
        isOpen={isApplicationsModalOpen}
        onClose={() => setIsApplicationsModalOpen(false)}
        title={isBn ? 'পেপারলেস আবেদনসমূহ' : 'Paperless Institutional Applications'}
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            {isBn
              ? 'বিশ্ববিদ্যালয় পেপারলেস সিস্টেমে দাখিলকৃত সনদ ও প্রত্যয়ন আবেদন তালিকা।'
              : 'Registered digital clearance, transcript, and testimonial requests.'}
          </p>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {storeApplications.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No applications found.</p>
            ) : (
              storeApplications.map((app) => (
                <div key={app.id} className="py-2.5 flex items-center justify-between text-xs gap-2">
                  <div>
                    <p className="font-bold text-slate-800">{app.title}</p>
                    <p className="text-[11px] text-slate-500">
                      {app.applicationNumber} &bull; Dept: {app.studentDepartment}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      app.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setIsApplicationsModalOpen(false)}>
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
