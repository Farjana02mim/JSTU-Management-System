import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getStudentDataService, AttendanceCourse } from '../../../services/student';
import { CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';

export const StudentAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [records, setRecords] = useState<AttendanceCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const studentService = getStudentDataService();
      // Safe: user.uid is from the verified session, not taken from the URL
      const studentUid = user?.uid || 'demo_student_uid';
      const list = await studentService.getAttendance(studentUid);
      setRecords(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [user]);

  // Check if any course is < 75%
  const lowAttendanceCourses = records.filter((r) => r.percentage < 75);

  return (
    <DashboardLayout portalTitle={isBn ? 'ক্লাস উপস্থিতি' : 'Class Attendance'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">
              {isBn ? 'কোর্সওয়ারি উপস্থিতি রিপোর্ট' : 'Course-wise Attendance Overview'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn
                ? 'জেএসটিইউ অর্ডিন্যান্স অনুযায়ী চূড়ান্ত পরীক্ষায় বসার জন্য ন্যূনতম ৭৫% উপস্থিতি বাধ্যতামূলক।'
                : 'JSTU academic regulations require a minimum of 75% attendance to qualify for semester finals.'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
            {isBn ? 'বর্তমান টার্ম: ফল ২০২৬' : 'Current Term: Fall 2026'}
          </span>
        </div>

        {/* Low Attendance Warning Alert */}
        {!loading && lowAttendanceCourses.length > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {isBn
                  ? `সতর্কতা: ${lowAttendanceCourses.length}টি কোর্সে উপস্থিতি ৭৫% এর নিচে রয়েছে!`
                  : `Attention: Low attendance detected in ${lowAttendanceCourses.length} course(s)!`}
              </span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              {isBn
                ? `নিম্নোক্ত কোর্সে আপনার উপস্থিতি ৭৫% এর নিচে রয়েছে: ${lowAttendanceCourses.map((c) => `${c.code} (${c.percentage}%)`).join(', ')}। নন-কলেজিয়েট জরিমানা বা পরীক্ষা বাতিলের ঝুঁকি এড়াতে দ্রুত ক্লাসে নিয়মিত হোন এবং চেয়ারম্যানের সাথে যোগাযোগ করুন।`
                : `You currently hold non-collegiate status in: ${lowAttendanceCourses.map((c) => `${c.code} (${c.percentage}%)`).join(', ')}. Please attend all remaining lecture sessions to reach collegiate standing before exam clearance.`}
            </p>
          </div>
        )}

        {/* Skeletons */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonLoader key={i} variant="rectangular" className="h-20 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <Card padding="lg" className="border-red-200 bg-red-50 text-center py-8 space-y-3">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h2 className="text-sm font-bold text-red-900">
              {isBn ? 'উপস্থিতি তথ্য পাওয়া যায়নি' : 'Unable to load attendance'}
            </h2>
            <p className="text-xs text-red-700">{error}</p>
            <Button variant="outline" size="sm" onClick={loadAttendance} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              {isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
            </Button>
          </Card>
        )}

        {/* Table & Cards */}
        {!loading && !error && records.length > 0 && (
          <div className="space-y-4">
            {/* Status Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <span className="font-bold text-slate-700">{isBn ? 'স্ট্যাটাস নির্দেশিকা:' : 'Status Legend:'}</span>
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>&ge;75% {isBn ? 'কলেজিয়েট (অনুমোদিত)' : 'Collegiate (Eligible)'}</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>60%-74% {isBn ? 'নন-কলেজিয়েট (সতর্কবার্তা)' : 'Non-Collegiate (Warning)'}</span>
              </span>
              <span className="flex items-center gap-1.5 text-red-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>&lt;60% {isBn ? 'ডিসকলেজিয়েট (বাতিলযোগ্য)' : 'Discollegiate (Barred)'}</span>
              </span>
            </div>

            {/* Attendance List */}
            <div className="space-y-3">
              {records.map((c) => {
                let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                let barClass = 'bg-emerald-500';
                let statusLabel = isBn ? 'কলেজিয়েট' : 'Collegiate';

                if (c.percentage < 60) {
                  badgeClass = 'bg-red-50 text-red-700 border-red-200';
                  barClass = 'bg-red-500';
                  statusLabel = isBn ? 'ডিসকলেজিয়েট' : 'Discollegiate';
                } else if (c.percentage < 75) {
                  badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                  barClass = 'bg-amber-500';
                  statusLabel = isBn ? 'নন-কলেজিয়েট' : 'Non-Collegiate';
                }

                return (
                  <Card
                    key={c.code}
                    padding="md"
                    className="bg-white border-[#E2E8F0] shadow-2xs hover:border-slate-300 transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-xs text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {c.code}
                          </span>
                          <h3 className="text-sm font-bold text-[#0F172A]">
                            {isBn ? c.titleBn : c.title}
                          </h3>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {isBn ? 'উপস্থিত:' : 'Attended:'} <strong>{c.attended}</strong> / {c.total} {isBn ? 'ক্লাস' : 'classes conducted'} ({c.credits.toFixed(1)} cr)
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border font-mono ${badgeClass}`}>
                          {c.percentage}% &bull; {statusLabel}
                        </span>

                        <Link
                          to={`/student/courses/${c.code}`}
                          className="p-1.5 text-slate-400 hover:text-[#1E3A8A] rounded-lg hover:bg-slate-50"
                          title="View course attendance breakdown"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barClass}`}
                        style={{ width: `${Math.min(100, c.percentage)}%` }}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendancePage;
