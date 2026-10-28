import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getStudentDataService, StudentProfileData } from '../../../services/student';
import {
  User,
  GraduationCap,
  Building,
  Mail,
  Phone,
  MapPin,
  Heart,
  Award,
  ShieldCheck,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const studentService = getStudentDataService();
      // Safe: user.uid is from the verified session, not taken from the URL
      const studentUid = user?.uid || 'demo_student_uid';
      const data = await studentService.getProfile(studentUid);
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  return (
    <DashboardLayout portalTitle={isBn ? 'শিক্ষার্থী প্রোফাইল' : 'Student Bio-Data'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-[#E2E8F0] pb-4">
          <h1 className="text-xl font-bold text-[#0F172A]">
            {isBn ? 'প্রাতিষ্ঠানিক শিক্ষার্থী প্রোফাইল' : 'Institutional Student Record'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified academic bio-data & guardian records maintained by Registrar Office.
          </p>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-4">
            <SkeletonLoader variant="rectangular" className="h-44 w-full rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SkeletonLoader variant="rectangular" className="h-64 w-full rounded-2xl" />
              <SkeletonLoader variant="rectangular" className="h-64 w-full rounded-2xl" />
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <Card padding="lg" className="border-red-200 bg-red-50 text-center py-8 space-y-3">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h2 className="text-sm font-bold text-red-900">{isBn ? 'প্রোফাইল লোড ব্যর্থ' : 'Unable to load profile'}</h2>
            <p className="text-xs text-red-700">{error}</p>
            <Button variant="outline" size="sm" onClick={loadProfile} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              {isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
            </Button>
          </Card>
        )}

        {/* Profile Content */}
        {!loading && !error && profile && (
          <div className="space-y-6">
            {/* Top Identity Card */}
            <Card padding="lg" className="bg-white border-[#E2E8F0] shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-extrabold text-2xl border border-blue-100 uppercase">
                    {profile.fullName.charAt(0)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {profile.studentId}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded">
                        Active Regular
                      </span>
                    </div>

                    <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                      {isBn ? profile.fullNameBn : profile.fullName}
                    </h2>

                    <p className="text-xs text-slate-500 font-medium">
                      {isBn ? profile.departmentBn : profile.department} &bull; {isBn ? profile.semesterBn : profile.semester}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Academic Standing</span>
                    <span className="text-xl font-extrabold font-mono text-[#1E3A8A]">
                      CGPA {profile.cgpa.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Two-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1: Academic & University Records */}
              <Card padding="lg" className="bg-white border-[#E2E8F0] shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#1E3A8A]" />
                  <span>{isBn ? 'একাডেমিক তথ্য' : 'Academic Enrollment'}</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-slate-500">{isBn ? 'শিক্ষার্থী আইডি' : 'Student ID'}</span>
                    <span className="font-mono font-bold text-[#0F172A]">{profile.studentId}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-slate-500">{isBn ? 'বিভাগ' : 'Department'}</span>
                    <span className="font-medium text-[#0F172A]">{profile.department}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-slate-500">{isBn ? 'সেশন' : 'Academic Session'}</span>
                    <span className="font-mono text-[#0F172A]">{profile.academicSession}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-slate-500">{isBn ? 'আবাসিক হল' : 'Residential Hall'}</span>
                    <span className="font-medium text-[#0F172A]">{isBn ? profile.hallNameBn : profile.hallName}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-slate-500">{isBn ? 'অনুষদীয় শিক্ষক উপদেষ্টা' : 'Faculty Advisor'}</span>
                    <div className="text-right">
                      <span className="font-medium text-[#0F172A] block">{profile.advisorName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{profile.advisorEmail}</span>
                    </div>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">{isBn ? 'মোট অর্জিত ক্রেডিট' : 'Total Credits Completed'}</span>
                    <span className="font-mono font-bold text-emerald-600">{profile.creditsEarned} Credits</span>
                  </div>
                </div>
              </Card>

              {/* Column 2: Personal & Guardian Information */}
              <Card padding="lg" className="bg-white border-[#E2E8F0] shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#1E3A8A]" />
                  <span>{isBn ? 'ব্যক্তিগত ও অভিভাবকের তথ্য' : 'Personal & Guardian Details'}</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-slate-500">{isBn ? 'প্রাতিষ্ঠানিক ইমেইল' : 'Institutional Email'}</span>
                    <span className="font-mono font-medium text-[#0F172A]">{profile.email}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-slate-500">{isBn ? 'মোবাইল নম্বর' : 'Phone Number'}</span>
                    <span className="font-mono text-[#0F172A]">{profile.phone}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-slate-500">{isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}</span>
                    <span className="font-bold text-red-600">{profile.bloodGroup}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-slate-500">{isBn ? 'অভিভাবকের নাম' : 'Guardian Name'}</span>
                    <span className="font-medium text-[#0F172A]">{profile.guardianName}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="text-slate-500">{isBn ? 'অভিভাবকের ফোন' : 'Guardian Phone'}</span>
                    <span className="font-mono text-[#0F172A]">{profile.guardianPhone}</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">{isBn ? 'স্থায়ী ঠিকানা' : 'Permanent Address'}</span>
                    <span className="font-medium text-[#0F172A] text-right max-w-xs">{isBn ? profile.addressBn : profile.address}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentProfilePage;
