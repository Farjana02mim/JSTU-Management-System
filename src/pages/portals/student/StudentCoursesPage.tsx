import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getStudentDataService, CourseItem } from '../../../services/student';
import { BookOpen, User, Mail, ArrowRight, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export const StudentCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const studentService = getStudentDataService();
      // Uses the authenticated student's uid from auth context, NEVER from user-supplied URL
      const studentUid = user?.uid || 'demo_student_uid';
      const list = await studentService.getCourses(studentUid);
      setCourses(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [user]);

  return (
    <DashboardLayout portalTitle={isBn ? 'আমার কোর্সসমূহ' : 'My Enrolled Courses'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">
              {isBn ? 'নিবন্ধিত কোর্সসমূহ — ৬ষ্ঠ সেমিস্টার' : 'Enrolled Courses — 6th Semester'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn
                ? 'ফল ২০২৬ সেশনে নিবন্ধিত সকল তাত্ত্বিক ও ব্যবহারিক কোর্স।'
                : 'Fall 2026 registered theory and laboratory courses.'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#1E3A8A] bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
            {courses.length} {isBn ? 'কোর্স (১৫.০ ক্রেডিট)' : 'Courses (15.0 Credits)'}
          </span>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonLoader key={i} variant="rectangular" className="h-48 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card padding="lg" className="border-red-200 bg-red-50 text-center py-8 space-y-3">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
            <h2 className="text-sm font-bold text-red-900">{isBn ? 'কোর্স লোড করা যায়নি' : 'Unable to load courses'}</h2>
            <p className="text-xs text-red-700">{error}</p>
            <button
              onClick={loadCourses}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-red-300 rounded-lg text-red-800 hover:bg-red-100 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry'}</span>
            </button>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <EmptyState
            title={isBn ? 'কোনো কোর্স পাওয়া যায়নি' : 'No courses found'}
            description={isBn ? 'এই সেমিস্টারে আপনার কোনো কোর্স নথিভুক্ত নেই।' : 'No enrolled courses for the current semester.'}
          />
        )}

        {/* Course Cards Grid */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <Card
                key={course.id}
                padding="lg"
                className="bg-white border-[#E2E8F0] shadow-2xs hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-xs text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {course.code}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 font-mono">
                      {course.credits.toFixed(1)} {isBn ? 'ক্রেডিট' : 'Credits'}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#0F172A] leading-snug">
                      {isBn ? course.titleBn : course.title}
                    </h2>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {course.department} &bull; {course.semester}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F1F5F9] space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{course.instructorEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F1F5F9] mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500 font-medium">{isBn ? 'উপস্থিতি:' : 'Attnd:'}</span>
                    <span
                      className={`font-bold font-mono px-1.5 py-0.5 rounded text-[11px] ${
                        course.attendancePercentage >= 75
                          ? 'bg-emerald-50 text-emerald-700'
                          : course.attendancePercentage >= 60
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {course.attendancePercentage}%
                    </span>
                  </div>

                  <Link
                    to={`/student/courses/${course.code}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3A8A] hover:underline"
                  >
                    <span>{isBn ? 'বিস্তারিত' : 'View Course'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentCoursesPage;
