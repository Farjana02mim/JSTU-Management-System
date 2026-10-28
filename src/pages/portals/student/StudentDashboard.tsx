import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getStudentDataService, StudentDashboardData } from '../../../services/student';
import {
  GraduationCap,
  BookOpen,
  Clock,
  Award,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileText,
  CreditCard,
  ArrowRight,
  Bell,
  RefreshCw,
  UserCheck
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user, profile, claims } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const studentService = getStudentDataService();
      // Uses the authenticated student's uid from auth context, NEVER from user-supplied URL
      const studentUid = user?.uid || 'demo_student_uid';
      const result = await studentService.getDashboardData(studentUid);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user]);

  return (
    <DashboardLayout portalTitle={isBn ? 'শিক্ষার্থী পোর্টাল' : 'Student Portal'}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-bold">
                  ID: {claims?.studentId || 'JSTU2026001'} &bull; {isBn ? 'সিএসই বিভাগ' : 'Dept of CSE'}
                </span>
                <span className="px-2 py-0.5 bg-blue-50 text-[#1E3A8A] border border-blue-200 text-[10px] font-mono font-bold rounded">
                  {isBn ? '৬ষ্ঠ সেমিস্টার' : '6th Semester'}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#0F172A] mt-1 tracking-tight">
                {isBn
                  ? `স্বাগতম, ${profile?.fullNameBn || user?.displayName || 'শিক্ষার্থী'}`
                  : `Welcome, ${profile?.fullName || user?.displayName || 'Student'}`}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? 'নিয়মিত নিবন্ধিত' : 'Enrolled Regular'}</span>
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            {isBn
              ? 'জেএসটিইউ স্মার্ট ক্যাম্পাস একাডেমিক পোর্টাল — বর্তমান সেশন: ২০২৩-২০২৪।'
              : 'JSTU Smart Paperless Campus Academic Portal — Academic Session 2023-2024.'}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonLoader key={i} variant="rectangular" className="h-28 w-full rounded-xl" />
              ))}
            </div>
            <SkeletonLoader variant="rectangular" className="h-64 w-full rounded-2xl" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card padding="lg" className="border-red-200 bg-red-50 text-center py-8 space-y-3">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
            <h2 className="text-sm font-bold text-red-900">
              {isBn ? 'ডাটা লোড করা যায়নি' : 'Unable to load student metrics'}
            </h2>
            <p className="text-xs text-red-700">{error}</p>
            <Button variant="outline" size="sm" onClick={loadDashboard} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              {isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
            </Button>
          </Card>
        )}

        {/* Data View */}
        {!loading && !error && data && (
          <>
            {/* Top Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-2xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold text-slate-500">
                    {isBn ? 'সিজিপিএ (স্কেল ৪.০০)' : 'Cumulative CGPA'}
                  </span>
                  <Award className="w-4 h-4 text-[#1E3A8A]" />
                </div>
                <div className="text-2xl font-extrabold text-[#0F172A] tabular-nums">
                  {data.stats.cgpa.toFixed(2)}
                </div>
                <p className="text-[11px] text-emerald-600 font-medium">
                  {isBn ? 'প্রথম শ্রেণি / ডিস্টিংকশন' : 'First Class Equivalent'}
                </p>
              </Card>

              <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-2xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold text-slate-500">
                    {isBn ? 'অর্জিত ক্রেডিট' : 'Credits Completed'}
                  </span>
                  <GraduationCap className="w-4 h-4 text-[#1E3A8A]" />
                </div>
                <div className="text-2xl font-extrabold text-[#0F172A] tabular-nums">
                  {data.stats.completedCredits}
                </div>
                <p className="text-[11px] text-slate-400">
                  {isBn ? 'মোট ১৪৪ ক্রেডিটের মধ্যে' : 'Out of 144 Total'}
                </p>
              </Card>

              <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-2xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold text-slate-500">
                    {isBn ? 'গড় উপস্থিতি' : 'Attendance Rate'}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-extrabold text-[#0F172A] tabular-nums">
                  {data.stats.overallAttendanceRate}%
                </div>
                <p className={`text-[11px] font-medium ${data.stats.overallAttendanceRate >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {data.stats.overallAttendanceRate >= 75
                    ? isBn ? 'পরীক্ষার জন্য অনুমোদিত' : 'Eligible for Finals'
                    : isBn ? 'সতর্কতা: ৭৫% এর কম' : 'Warning: Below 75%'}
                </p>
              </Card>

              <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-2xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold text-slate-500">
                    {isBn ? 'বকেয়া কাজ ও ফি' : 'Pending Tasks'}
                  </span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-extrabold text-[#0F172A] tabular-nums">
                  {data.stats.pendingAssignmentsCount + data.stats.unpaidFeesCount}
                </div>
                <p className="text-[11px] text-slate-400">
                  {data.stats.pendingAssignmentsCount} {isBn ? 'অ্যাসাইনমেন্ট' : 'Assignments'}, {data.stats.unpaidFeesCount} {isBn ? 'বকেয়া ফি' : 'Unpaid Fee'}
                </p>
              </Card>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <Link
                to="/student/applications"
                className="p-3 bg-[#F8FAFC] hover:bg-blue-50/60 border border-[#E2E8F0] hover:border-blue-200 rounded-xl transition-all flex items-center gap-3 text-xs font-bold text-slate-700 hover:text-[#1E3A8A]"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E3A8A] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <span>{isBn ? 'পেপারলেস আবেদন' : 'Applications'}</span>
              </Link>

              <Link
                to="/student/routine"
                className="p-3 bg-[#F8FAFC] hover:bg-blue-50/60 border border-[#E2E8F0] hover:border-blue-200 rounded-xl transition-all flex items-center gap-3 text-xs font-bold text-slate-700 hover:text-[#1E3A8A]"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E3A8A] flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <span>{isBn ? 'আজকের রুটিন' : 'Class Routine'}</span>
              </Link>

              <Link
                to="/student/assignments"
                className="p-3 bg-[#F8FAFC] hover:bg-blue-50/60 border border-[#E2E8F0] hover:border-blue-200 rounded-xl transition-all flex items-center gap-3 text-xs font-bold text-slate-700 hover:text-[#1E3A8A]"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E3A8A] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <span>{isBn ? 'অ্যাসাইনমেন্ট জমা' : 'Assignments'}</span>
              </Link>

              <Link
                to="/student/fees"
                className="p-3 bg-[#F8FAFC] hover:bg-blue-50/60 border border-[#E2E8F0] hover:border-blue-200 rounded-xl transition-all flex items-center gap-3 text-xs font-bold text-slate-700 hover:text-[#1E3A8A]"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E3A8A] flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span>{isBn ? 'ফি ও ইনভয়েস' : 'Pay Fees'}</span>
              </Link>

              <Link
                to="/student/results"
                className="p-3 bg-[#F8FAFC] hover:bg-blue-50/60 border border-[#E2E8F0] hover:border-blue-200 rounded-xl transition-all flex items-center gap-3 text-xs font-bold text-slate-700 hover:text-[#1E3A8A]"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E3A8A] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <span>{isBn ? 'গ্রেড শিট' : 'Grade Sheets'}</span>
              </Link>
            </div>

            {/* Main Content Grid: Today's Schedule + Department Notices */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Today's Classes */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1E3A8A]" />
                    <h2 className="text-sm font-bold text-[#0F172A]">
                      {isBn ? 'আজকের ক্লাস শিডিউল' : "Today's Schedule"}
                    </h2>
                  </div>
                  <Link to="/student/routine" className="text-xs text-[#1E3A8A] font-semibold hover:underline flex items-center gap-1">
                    <span>{isBn ? 'সম্পূর্ণ রুটিন' : 'View Full Timetable'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {data.todayClasses.length === 0 ? (
                    <EmptyState
                      title={isBn ? 'আজ কোনো ক্লাস নেই' : 'No classes scheduled today'}
                      description={isBn ? 'আপনার সাপ্তাহিক রুটিন দেখতে সম্পূর্ণ রুটিনে ক্লিক করুন।' : 'Enjoy your study day.'}
                    />
                  ) : (
                    data.todayClasses.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-white border border-[#E2E8F0] rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded">
                              {item.courseCode}
                            </span>
                            <h3 className="text-xs sm:text-sm font-bold text-[#0F172A]">
                              {isBn ? item.courseTitleBn : item.courseTitle}
                            </h3>
                          </div>
                          <p className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>{item.room}</span> &bull; <span>{item.instructor}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {item.timeSlot}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                              item.status === 'ongoing'
                                ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                                : item.status === 'completed'
                                ? 'bg-slate-100 text-slate-500'
                                : 'bg-blue-50 text-[#1E3A8A]'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right 1 Col: Department Notices */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#1E3A8A]" />
                    <h2 className="text-sm font-bold text-[#0F172A]">
                      {isBn ? 'বিভাগীয় নোটিশ (সিএসই)' : 'CSE Department Notices'}
                    </h2>
                  </div>
                  <Link to="/notices" className="text-xs text-[#1E3A8A] font-semibold hover:underline">
                    {isBn ? 'সকল নোটিশ' : 'All Notices'}
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {data.departmentNotices.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 bg-white border border-[#E2E8F0] rounded-xl hover:border-slate-300 transition-colors space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-[#1E3A8A] uppercase">{n.category}</span>
                        <span className="text-slate-400 font-mono">{n.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#0F172A] leading-snug line-clamp-2">
                        {isBn ? n.titleBn : n.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
