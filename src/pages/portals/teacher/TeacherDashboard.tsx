import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  FileCheck,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Megaphone,
  Upload,
  FileText
} from 'lucide-react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getTeacherDataService, TeacherDashboardData } from '../../../services/teacher';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const service = getTeacherDataService();
        const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
        const result = await service.getDashboardData(teacherEmail);
        if (isMounted) setData(result);
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load faculty dashboard.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout portalTitle={isBn ? 'শিক্ষক পোর্টাল' : 'Faculty Portal'}>
        <div className="space-y-6">
          <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl space-y-3">
            <SkeletonLoader variant="text" className="h-4 w-40" />
            <SkeletonLoader variant="text" className="h-8 w-72" />
            <SkeletonLoader variant="text" className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonLoader key={i} variant="rectangular" className="h-28 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SkeletonLoader variant="rectangular" className="h-64 rounded-xl lg:col-span-2" />
            <SkeletonLoader variant="rectangular" className="h-64 rounded-xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout portalTitle={isBn ? 'শিক্ষক পোর্টাল' : 'Faculty Portal'}>
        <EmptyState
          title={isBn ? 'ড্যাশবোর্ড তথ্য লোড করা যায়নি' : 'Unable to Load Faculty Dashboard'}
          description={error || (isBn ? 'সার্ভার সংযোগে ত্রুটি দেখা দিয়েছে।' : 'A system error occurred.')}
          actionLabel={isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
          onAction={() => window.location.reload()}
        />
      </DashboardLayout>
    );
  }

  const { stats, todayClasses, recentSubmissions, quickActions, notifications } = data;

  return (
    <DashboardLayout portalTitle={isBn ? 'শিক্ষক পোর্টাল' : 'Faculty Portal'}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-bold">
                  {isBn ? 'সহযোগী অধ্যাপক • সিএসই বিভাগ' : 'Associate Professor • Dept of Computer Science & Engineering'}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-50 text-[#1E3A8A] border border-blue-200 rounded-md">
                  Demo Teacher
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1 tracking-tight">
                {isBn ? 'স্বাগতম, ড. শাহাদাত হোসেন' : 'Welcome, Dr. Shahadat Hossain'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>MFA Verified &bull; EMP-CSE-0042</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            {isBn
              ? 'জেএসটিইউ স্মার্ট ক্যাম্পাস শিক্ষক প্যানেল। আপনার নির্ধারিত কোর্সের উপস্থিতি গ্রহণ, অ্যাসাইনমেন্ট মূল্যায়ন এবং ফলাফল এন্ট্রি সরাসরি এখান থেকে পরিচালিত হয়।'
              : 'JSTU Smart Campus Faculty Dashboard. Manage your assigned courses, record class attendance, evaluate student assignment submissions, and enter continuous assessment marks.'}
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-2xs hover:border-[#1E3A8A] transition-colors">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">{isBn ? 'নির্ধারিত কোর্স' : 'Assigned Courses'}</span>
              <BookOpen className="w-4 h-4 text-[#1E3A8A]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0F172A] tabular-nums">
              {stats.assignedCoursesCount}
            </div>
            <p className="text-[11px] text-slate-400">
              {isBn ? 'CSE-3201, CSE-3205, CSE-1101' : 'CSE-3201, CSE-3205, CSE-1101'}
            </p>
          </Card>

          <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-2xs hover:border-[#1E3A8A] transition-colors">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">{isBn ? 'মোট শিক্ষার্থী' : 'Enrolled Students'}</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-[#0F172A] tabular-nums">
              {stats.totalEnrolledStudents}
            </div>
            <p className="text-[11px] text-slate-400">
              {isBn ? '৩টি সেকশন জুড়ে শিক্ষার্থী' : 'Across 3 Course Sections'}
            </p>
          </Card>

          <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-2xs hover:border-[#1E3A8A] transition-colors">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">{isBn ? 'খাতা মূল্যায়ন বাকি' : 'Pending Grading'}</span>
              <FileCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600 tabular-nums">
              {stats.pendingAssignmentsToGrade}
            </div>
            <p className="text-[11px] text-slate-400">
              {isBn ? 'নতুন জমা হওয়া সমাধান' : 'Submissions awaiting review'}
            </p>
          </Card>

          <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-2xs hover:border-[#1E3A8A] transition-colors">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">{isBn ? 'মার্কস শিট ড্রাফট' : 'Marks in Draft'}</span>
              <Award className="w-4 h-4 text-[#1E3A8A]" />
            </div>
            <div className="text-2xl font-extrabold text-[#1E3A8A] tabular-nums">
              {stats.pendingMarksSheetsCount}
            </div>
            <p className="text-[11px] text-slate-400">
              {isBn ? 'চেয়ারম্যানের কাছে দাখিল বাকি' : 'Awaiting final submission'}
            </p>
          </Card>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {quickActions.map((qa, i) => (
            <Link
              key={i}
              to={qa.to}
              className="p-3.5 bg-slate-50 hover:bg-blue-50/60 border border-[#E2E8F0] hover:border-[#1E3A8A] rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-white shadow-2xs border border-[#E2E8F0] flex items-center justify-center text-[#1E3A8A] group-hover:bg-[#1E3A8A] group-hover:text-white transition-colors">
                {qa.icon === 'CheckCircle2' && <CheckCircle2 className="w-4 h-4" />}
                {qa.icon === 'FileText' && <FileText className="w-4 h-4" />}
                {qa.icon === 'Award' && <Award className="w-4 h-4" />}
                {qa.icon === 'Upload' && <Upload className="w-4 h-4" />}
                {qa.icon === 'Calendar' && <Calendar className="w-4 h-4" />}
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-[#1E3A8A]">
                {isBn ? qa.titleBn : qa.title}
              </span>
            </Link>
          ))}
        </div>

        {/* Middle Two-Column Grid: Today's Classes + Pending Grading */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Classes */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1E3A8A]" />
                <h2 className="text-base font-bold text-[#0F172A]">
                  {isBn ? 'আজকের ক্লাসের সময়সূচি' : "Today's Teaching Schedule"}
                </h2>
              </div>
              <Link to="/teacher/routine" className="text-xs font-semibold text-[#1E3A8A] hover:underline flex items-center gap-1">
                {isBn ? 'সম্পূর্ণ রুটিন' : 'Full Timetable'} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {todayClasses.length === 0 ? (
                <Card padding="md" className="text-center py-8 text-slate-500 text-xs">
                  {isBn ? 'আজ আপনার কোনো ক্লাস নির্ধারিত নেই।' : 'No classes scheduled for today.'}
                </Card>
              ) : (
                todayClasses.map((cls) => (
                  <Card key={cls.id} padding="md" className="border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-blue-50 text-[#1E3A8A] rounded border border-blue-200">
                            {cls.courseCode}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {cls.enrolledStudentsCount} {isBn ? 'জন শিক্ষার্থী' : 'Students Enrolled'}
                          </span>
                          {cls.status === 'ongoing' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {isBn ? 'চলমান' : 'Ongoing'}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-[#0F172A]">{cls.courseTitle}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-3">
                          <span>{cls.timeSlot}</span>
                          <span>&bull;</span>
                          <span>{cls.room}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link to={`/teacher/attendance/${cls.courseCode}`}>
                          <Button variant="primary" size="sm" className="text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            {isBn ? 'উপস্থিতি নিন' : 'Take Attendance'}
                          </Button>
                        </Link>
                        <Link to={`/teacher/courses/${cls.courseCode}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            {isBn ? 'কোর্স ভিউ' : 'Course View'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Pending Submissions Ready to Grade */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-600" />
                <h2 className="text-base font-bold text-[#0F172A]">
                  {isBn ? 'মূল্যায়নযোগ্য অ্যাসাইনমেন্ট' : 'Pending Submissions'}
                </h2>
              </div>
              <Link to="/teacher/assignments" className="text-xs font-semibold text-[#1E3A8A] hover:underline">
                {isBn ? 'সকল' : 'View All'}
              </Link>
            </div>

            <Card padding="md" className="border-[#E2E8F0] shadow-2xs divide-y divide-slate-100 p-0">
              {recentSubmissions.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  {isBn ? 'কোনো নতুন অ্যাসাইনমেন্ট জমা বাকি নেই।' : 'No submissions currently awaiting grading.'}
                </div>
              ) : (
                recentSubmissions.map((sub) => (
                  <div key={sub.submissionId} className="p-3.5 space-y-1 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0F172A]">{sub.studentName}</span>
                      <span className="font-mono text-[10px] text-slate-400">{sub.studentId}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">{sub.assignmentTitle}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="px-1.5 py-0.5 font-mono bg-blue-50 text-[#1E3A8A] rounded border border-blue-200">
                        {sub.courseCode}
                      </span>
                      <Link to="/teacher/assignments" className="text-[#1E3A8A] font-bold hover:underline">
                        {isBn ? 'নম্বর দিন' : 'Grade Now &rarr;'}
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </Card>

            {/* Institutional Notification Card */}
            <Card padding="md" className="bg-slate-50 border-[#E2E8F0] shadow-2xs space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                <Megaphone className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>{isBn ? 'বিভাগীয় চেয়ারম্যানের নির্দেশনা' : 'Dept. Chairman Notice'}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isBn
                  ? 'সকল কোর্স শিক্ষককে ১৫ অক্টোবরের মধ্যে ধারাবাহিক মূল্যায়নের মার্কস ড্রাফট সম্পন্ন করে চেয়ারম্যানের কাছে পাঠানোর অনুরোধ করা হলো।'
                  : 'Faculty members are reminded to finalize continuous assessment marks and submit drafts to the Dept. Chairman before 15 October.'}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
