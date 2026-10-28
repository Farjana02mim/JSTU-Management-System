import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { GraduationCap, BookOpen, Clock, FileCheck2 } from 'lucide-react';

export const StudentDashboardShell: React.FC = () => {
  const { user, profile, claims } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <DashboardLayout portalTitle={isBn ? 'শিক্ষার্থী ড্যাশবোর্ড' : 'Student Portal'}>
      <div className="space-y-6">
        {/* Welcome Header Card */}
        <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-bold">
                Student ID: {claims?.studentId || 'JSTU2026001'} &bull; Dept: {claims?.departmentId || 'CSE'}
              </span>
              <h1 className="text-2xl font-bold text-[#0F172A] mt-1">
                {isBn ? `স্বাগতম, ${profile?.fullNameBn || user?.displayName}` : `Welcome, ${user?.displayName}`}
              </h1>
            </div>
            <span className="px-2.5 py-1 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-700 rounded-lg text-xs font-mono font-medium">
              Status: Verified Enrolled
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {isBn
              ? 'জেএসটিইউ স্মার্ট ক্যাম্পাস সিস্টেম (ফেজ ২: অথেনটিকেশন ও অ্যাক্সেস কন্ট্রোল শেল সক্রিয়)।'
              : 'JSTU Smart Campus Core (Phase 2: Authentication & RBAC Shell active).'}
          </p>
        </div>

        {/* Empty Dashboard Metric Placeholders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Registered Credits (Current)</span>
            <div className="text-2xl font-extrabold text-[#0F172A] tabular-nums">21.5</div>
            <p className="text-[11px] text-slate-400">Fall Semester 2026</p>
          </Card>

          <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Cumulative CGPA</span>
            <div className="text-2xl font-extrabold text-[#0F172A] tabular-nums">3.84</div>
            <p className="text-[11px] text-slate-400">Scale: 4.00 (UGC Bangladesh)</p>
          </Card>

          <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Digital Clearance Status</span>
            <div className="text-2xl font-extrabold text-emerald-600">CLEAR</div>
            <p className="text-[11px] text-slate-400">Zero Outstanding Dues</p>
          </Card>
        </div>

        {/* Empty Shell Notice */}
        <Card padding="lg" className="border-dashed border-[#CBD5E1] bg-[#F8FAFC] text-center py-12 space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0F172A]">
            {isBn ? 'শিক্ষার্থী পোর্টাল মডিউল (ফেজ ৩ তে সক্রিয় হবে)' : 'Student Portal Modules (Upcoming in Phase 3)'}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {isBn
              ? 'কোর্স রেজিস্ট্রেশন, সিএ ও মিডটার্ম মার্কস প্রদর্শন, পরীক্ষার প্রবেশপত্র ডাউনলোড এবং ডিজিটাল ক্লিয়ারেন্স ফিচারসমূহ পরবর্তী ধাপে যুক্ত করা হবে।'
              : 'Course registration, continuous evaluation marks, semester final exam admit card downloads, and clearance workflow will be introduced in subsequent phases.'}
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
