import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  ShieldCheck,
  BookOpen,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getTeacherDataService, TeacherProfileInfo } from '../../../services/teacher';

export const TeacherProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TeacherProfileInfo | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const service = getTeacherDataService();
        const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
        const data = await service.getProfile(teacherEmail);
        if (isMounted) setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading || !profile) {
    return (
      <DashboardLayout portalTitle={isBn ? 'শিক্ষক প্রোফাইল' : 'Faculty Profile'}>
        <div className="space-y-6">
          <SkeletonLoader variant="rectangular" className="h-44 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonLoader variant="rectangular" className="h-64 rounded-xl" />
            <SkeletonLoader variant="rectangular" className="h-64 rounded-xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout portalTitle={isBn ? 'শিক্ষক প্রোফাইল' : 'Faculty Profile'}>
      <div className="space-y-6">
        {/* Profile Hero Card */}
        <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0F2D59] text-white flex items-center justify-center text-xl font-bold font-mono shadow-sm">
                SH
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {profile.employeeId}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {isBn ? profile.designationBn : profile.designation}
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                  {isBn ? profile.fullNameBn : profile.fullName}
                </h1>
                <p className="text-xs text-slate-500">
                  {isBn ? profile.departmentBn : profile.department}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>MFA Active &bull; Verified Faculty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Contact Details + Assigned Courses & Research */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Institutional Contact Information */}
          <Card padding="md" className="border-[#E2E8F0] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="w-4 h-4 text-[#1E3A8A]" />
              <h2 className="text-sm font-bold text-[#0F172A]">
                {isBn ? 'প্রাতিষ্ঠানিক যোগাযোগ' : 'Institutional Information'}
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">{isBn ? 'ইমেইল' : 'Email Address'}</span>
                <span className="font-mono text-slate-800 font-semibold">{profile.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">{isBn ? 'মোবাইল ফোন' : 'Contact Phone'}</span>
                <span className="font-mono text-slate-800 font-semibold">{profile.phone}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">{isBn ? 'অনুষদ কক্ষ' : 'Faculty Office'}</span>
                <span className="text-slate-800 font-semibold">{profile.room}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">{isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}</span>
                <span className="font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {profile.bloodGroup}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">{isBn ? 'নিরাপত্তা রোল' : 'Institutional Role'}</span>
                <span className="font-mono font-bold text-slate-700 uppercase">TEACHER</span>
              </div>
            </div>
          </Card>

          {/* Assigned Courses & Research */}
          <Card padding="md" className="border-[#E2E8F0] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-4 h-4 text-[#1E3A8A]" />
              <h2 className="text-sm font-bold text-[#0F172A]">
                {isBn ? 'অনুমোদিত কোর্সের দায়িত্ব' : 'Assigned Teaching Load'}
              </h2>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                {isBn ? 'নির্ধারিত কোর্স কোডসমূহ' : 'Current Active Courses'}
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.assignedCourseCodes.map((code) => (
                  <span
                    key={code}
                    className="px-3 py-1 bg-blue-50 text-[#1E3A8A] border border-blue-200 rounded-lg text-xs font-mono font-bold"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                {isBn ? 'গবেষণার ক্ষেত্র' : 'Research Interests & Specialization'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profile.researchAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
