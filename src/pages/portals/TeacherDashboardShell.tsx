import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { BookOpen, ShieldCheck } from 'lucide-react';

export const TeacherDashboardShell: React.FC = () => {
  const { user, profile, claims } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <DashboardLayout portalTitle={isBn ? 'শিক্ষক পোর্টাল' : 'Faculty Portal'}>
      <div className="space-y-6">
        {/* Welcome Header Card */}
        <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-bold">
                Faculty Member &bull; Dept of {claims?.departmentId || 'CSE'}
              </span>
              <h1 className="text-2xl font-bold text-[#0F172A] mt-1">
                {isBn ? `স্বাগতম, ${profile?.fullNameBn || user?.displayName}` : `Welcome, ${user?.displayName}`}
              </h1>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>MFA Enforced &bull; Verified</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            {isBn
              ? 'জেএসটিইউ শিক্ষক পোর্টাল (ফেজ ২: অথেনটিকেশন ও স্টেট মেশিন অ্যাক্সেস সক্রিয়)।'
              : 'JSTU Faculty Dashboard (Phase 2: Authentication & RBAC Shell active).'}
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Assigned Courses (Current)</span>
            <div className="text-2xl font-extrabold text-[#0F172A] tabular-nums">3</div>
            <p className="text-[11px] text-slate-400">CSE-1101, CSE-2103, CSE-3205</p>
          </Card>

          <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Enrolled Students</span>
            <div className="text-2xl font-extrabold text-[#0F172A] tabular-nums">142</div>
            <p className="text-[11px] text-slate-400">Across 3 Course Sections</p>
          </Card>

          <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Marks Status</span>
            <div className="text-2xl font-extrabold text-[#1E3A8A]">DRAFT</div>
            <p className="text-[11px] text-slate-400">Continuous Assessment Pending</p>
          </Card>
        </div>

        {/* Empty Module Card */}
        <Card padding="lg" className="text-center py-12 space-y-3 bg-[#F8FAFC] border-dashed border-[#CBD5E1]">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0F172A]">
            {isBn ? 'মার্কস এন্ট্রি মডিউল ফেজ ৩-এ প্রস্তুত হচ্ছে' : 'Marks Entry & Assessment Module Scheduled for Phase 3'}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Teacher authorization verified via custom claims. The continuous assessment (30%) and final marks (70%) table with state-machine progression will be integrated next.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};
