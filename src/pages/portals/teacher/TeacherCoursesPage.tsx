import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  CheckSquare,
  Award,
  ArrowRight,
  ShieldAlert,
  Search,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getTeacherDataService, TeacherCourseSummary } from '../../../services/teacher';

export const TeacherCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<TeacherCourseSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const service = getTeacherDataService();
        const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
        const list = await service.getAssignedCourses(teacherEmail);
        if (isMounted) setCourses(list);
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to fetch assigned courses.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const filteredCourses = courses.filter((c) =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.semester.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout portalTitle={isBn ? 'শিক্ষক পোর্টাল' : 'Faculty Portal'}>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#1E3A8A]" />
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                {isBn ? 'আমার নির্ধারিত কোর্সসমূহ' : 'Assigned Teaching Courses'}
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              {isBn
                ? 'সিএসই বিভাগের চেয়ারম্যান কর্তৃক অনুমোদিত কোর্সসমূহ। প্রাতিষ্ঠানিক নীতি অনুযায়ী আপনি কেবল আপনার নির্ধারিত কোর্সের তথ্য দেখতে ও সম্পাদন করতে পারবেন।'
                : 'Courses assigned by the Department Chairman. Institutional policy restricts access strictly to assigned courses.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={isBn ? 'কোর্স খুঁজুন...' : 'Search courses...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] w-48 sm:w-60 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Security Rule Explanation Banner */}
        <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
          <ShieldAlert className="w-4 h-4 text-[#1E3A8A] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Role-Based Access Enforcement:</span>{' '}
            {isBn
              ? 'অন্যান্য কোর্স (যেমন CSE-3203 বা CSE-3207) এ প্রবেশের চেষ্টা করলে সিস্টেম নিরাপত্তা নিয়ম অনুযায়ী অনুমতি ত্রুটি প্রদর্শিত হবে।'
              : 'Attempting to access non-assigned courses (e.g. CSE-3203 or CSE-3207) will be denied with permission errors enforced at the service level.'}
          </div>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <SkeletonLoader key={i} variant="rectangular" className="h-64 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            title={isBn ? 'কোর্স লোড করা যায়নি' : 'Unable to Load Courses'}
            description={error}
            actionLabel={isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
            onAction={() => window.location.reload()}
          />
        ) : filteredCourses.length === 0 ? (
          <EmptyState
            title={isBn ? 'কোনো কোর্স পাওয়া যায়নি' : 'No Courses Found'}
            description={isBn ? 'আপনার খোঁজার সাথে মিল রেখে কোনো কোর্স নেই।' : 'No courses match your search criteria.'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                padding="none"
                className="border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between overflow-hidden"
              >
                {/* Card Header Top */}
                <div className="p-5 border-b border-[#F1F5F9] bg-[#F8FAFC]/50 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 text-xs font-mono font-bold bg-white text-[#1E3A8A] border border-[#CBD5E1] rounded-md shadow-2xs">
                      {course.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {course.credits.toFixed(1)} Credits
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A] leading-snug">
                    {isBn ? course.titleBn : course.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isBn ? course.semesterBn : course.semester}</span>
                  </div>
                </div>

                {/* Card Metrics Body */}
                <div className="p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-[#E2E8F0]">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        {isBn ? 'নিবন্ধিত শিক্ষার্থী' : 'Enrolled'}
                      </span>
                      <span className="text-base font-bold text-[#0F172A] tabular-nums">
                        {course.enrolledCount} Students
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-[#E2E8F0]">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        {isBn ? 'গড় উপস্থিতি' : 'Avg. Attendance'}
                      </span>
                      <span className="text-base font-bold text-[#0F172A] tabular-nums">
                        {course.averageAttendanceRate}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500">{isBn ? 'মার্কস এন্ট্রি স্টেটাস:' : 'Marks Status:'}</span>
                    <span
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-md uppercase font-mono ${
                        course.marksStatus === 'SUBMITTED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {course.marksStatus}
                    </span>
                  </div>

                  {course.pendingSubmissionsCount > 0 && (
                    <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-center justify-between">
                      <span>{isBn ? 'খাতা মূল্যায়ন বাকি:' : 'Pending evaluations:'}</span>
                      <span className="font-bold">{course.pendingSubmissionsCount} submissions</span>
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-slate-50/80 border-t border-[#E2E8F0] grid grid-cols-3 gap-2">
                  <Link to={`/teacher/courses/${course.code}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs py-1.5 font-semibold">
                      {isBn ? 'বিস্তারিত' : 'Details'}
                    </Button>
                  </Link>
                  <Link to={`/teacher/attendance/${course.code}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs py-1.5 font-semibold">
                      <CheckSquare className="w-3.5 h-3.5 mr-1 text-[#1E3A8A]" />
                      {isBn ? 'উপস্থিতি' : 'Attend'}
                    </Button>
                  </Link>
                  <Link to={`/teacher/marks/${course.code}`} className="w-full">
                    <Button variant="primary" size="sm" className="w-full text-xs py-1.5 font-semibold">
                      <Award className="w-3.5 h-3.5 mr-1" />
                      {isBn ? 'মার্কস' : 'Marks'}
                    </Button>
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
