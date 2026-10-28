import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Tabs } from '../../../components/common/Tabs';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getStudentDataService, CourseDetail } from '../../../services/student';
import {
  BookOpen,
  ArrowLeft,
  FileText,
  Download,
  Bell,
  CheckCircle2,
  Award,
  User,
  Mail,
  AlertTriangle,
  Clock
} from 'lucide-react';

export const StudentCourseDetailPage: React.FC = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('materials');

  useEffect(() => {
    const loadDetail = async () => {
      if (!courseCode) return;
      setLoading(true);
      setError(null);
      try {
        const studentService = getStudentDataService();
        // Safe: user.uid is from the verified session, not taken from the URL
        const studentUid = user?.uid || 'demo_student_uid';
        const detail = await studentService.getCourseDetail(studentUid, courseCode);
        if (!detail) {
          setError(`Course ${courseCode} not found in current enrollment.`);
        } else {
          setCourse(detail);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [courseCode, user]);

  return (
    <DashboardLayout portalTitle={course ? `${course.code}` : 'Course Detail'}>
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          to="/student/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1E3A8A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isBn ? 'সকল কোর্সে ফিরে যান' : 'Back to Enrolled Courses'}</span>
        </Link>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            <SkeletonLoader variant="rectangular" className="h-40 w-full rounded-2xl" />
            <SkeletonLoader variant="rectangular" className="h-64 w-full rounded-2xl" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <Card padding="lg" className="border-red-200 bg-red-50 text-center py-8 space-y-3">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
            <h2 className="text-sm font-bold text-red-900">{isBn ? 'কোর্স পাওয়া যায়নি' : 'Course Not Found'}</h2>
            <p className="text-xs text-red-700">{error}</p>
            <Link to="/student/courses">
              <Button variant="outline" size="sm">
                {isBn ? 'কোর্স তালিকায় ফিরুন' : 'Back to Courses'}
              </Button>
            </Link>
          </Card>
        )}

        {/* Detail View */}
        {!loading && !error && course && (
          <div className="space-y-6">
            {/* Course Header Banner */}
            <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-[#1E3A8A] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {course.code}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {course.credits.toFixed(1)} {isBn ? 'ক্রেডিট' : 'Credits'} &bull; {course.semester}
                    </span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                    {isBn ? course.titleBn : course.title}
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {isBn ? 'উপস্থিতি' : 'Attendance'}
                    </span>
                    <span
                      className={`text-lg font-mono font-bold ${
                        course.attendancePercentage >= 75
                          ? 'text-emerald-600'
                          : course.attendancePercentage >= 60
                          ? 'text-amber-600'
                          : 'text-red-600'
                      }`}
                    >
                      {course.attendancePercentage}%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                {isBn ? course.syllabusOverviewBn : course.syllabusOverview}
              </p>

              <div className="pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{course.instructorEmail}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-[#E2E8F0] flex gap-6 text-xs font-bold">
              <button
                onClick={() => setActiveTab('materials')}
                className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'materials'
                    ? 'border-[#1E3A8A] text-[#1E3A8A]'
                    : 'border-transparent text-slate-500 hover:text-[#0F172A]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{isBn ? 'কোর্স মেটেরিয়ালস ও লেকচার' : 'Materials & PDFs'}</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded-full text-[10px] font-mono">
                  {course.materials.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('announcements')}
                className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'announcements'
                    ? 'border-[#1E3A8A] text-[#1E3A8A]'
                    : 'border-transparent text-slate-500 hover:text-[#0F172A]'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>{isBn ? 'ঘোষণা ও নোটিশ' : 'Announcements'}</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded-full text-[10px] font-mono">
                  {course.announcements.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'attendance'
                    ? 'border-[#1E3A8A] text-[#1E3A8A]'
                    : 'border-transparent text-slate-500 hover:text-[#0F172A]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isBn ? 'উপস্থিতি হিসেব' : 'Attendance'}</span>
              </button>

              <button
                onClick={() => setActiveTab('marks')}
                className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'marks'
                    ? 'border-[#1E3A8A] text-[#1E3A8A]'
                    : 'border-transparent text-slate-500 hover:text-[#0F172A]'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>{isBn ? 'ধারাবাহিক মূল্যায়ন ও মার্কস' : 'Continuous Marks'}</span>
              </button>
            </div>

            {/* Tab 1: Materials */}
            {activeTab === 'materials' && (
              <div className="space-y-3">
                {course.materials.length === 0 ? (
                  <EmptyState
                    title={isBn ? 'কোনো মেটেরিয়াল আপলোড করা হয়নি' : 'No materials available'}
                    description={isBn ? 'শিক্ষক লেকচার স্লাইড দিলে এখানে দেখতে পাবেন।' : 'Lecture notes and slides will appear here.'}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.materials.map((mat) => (
                      <div
                        key={mat.id}
                        className="p-4 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#0F172A] leading-snug line-clamp-1">
                              {mat.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {mat.fileSize} &bull; {isBn ? 'আপলোড:' : 'Uploaded:'} {mat.uploadDate}
                            </p>
                          </div>
                        </div>

                        <a
                          href={mat.downloadUrl}
                          download={mat.title}
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Demo download triggered for: ${mat.title}`);
                          }}
                          className="p-2 text-slate-500 hover:text-[#1E3A8A] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Announcements */}
            {activeTab === 'announcements' && (
              <div className="space-y-3">
                {course.announcements.length === 0 ? (
                  <EmptyState
                    title={isBn ? 'কোনো ঘোষণা নেই' : 'No announcements'}
                    description={isBn ? 'শিক্ষকের পক্ষ থেকে কোনো জরুরি ঘোষণা নেই।' : 'No course announcements posted yet.'}
                  />
                ) : (
                  course.announcements.map((ann) => (
                    <Card key={ann.id} padding="md" className="space-y-2 bg-white border-[#E2E8F0]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#0F172A]">{ann.title}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{ann.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                      <p className="text-[10px] text-slate-400 italic">Posted by {ann.author}</p>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Attendance Breakdown */}
            {activeTab === 'attendance' && (
              <Card padding="lg" className="bg-white border-[#E2E8F0] space-y-4">
                <h3 className="text-sm font-bold text-[#0F172A]">
                  {isBn ? 'ক্লাস উপস্থিতি বিস্তারিত' : 'Attendance Record for Current Term'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center space-y-1">
                    <span className="text-xs text-slate-500 font-medium">{isBn ? 'মোট ক্লাস' : 'Total Classes Conducted'}</span>
                    <div className="text-2xl font-extrabold text-[#0F172A] font-mono">
                      {course.attendanceBreakdown.totalClasses}
                    </div>
                  </div>

                  <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center space-y-1">
                    <span className="text-xs text-slate-500 font-medium">{isBn ? 'উপস্থিতির সংখ্যা' : 'Classes Attended'}</span>
                    <div className="text-2xl font-extrabold text-emerald-600 font-mono">
                      {course.attendanceBreakdown.attendedClasses}
                    </div>
                  </div>

                  <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center space-y-1">
                    <span className="text-xs text-slate-500 font-medium">{isBn ? 'শতাংশ' : 'Percentage'}</span>
                    <div className="text-2xl font-extrabold text-[#1E3A8A] font-mono">
                      {course.attendanceBreakdown.percentage}%
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#1E3A8A] space-y-1">
                  <p className="font-bold">Institutional Attendance Policy (JSTU Regulations):</p>
                  <p className="text-slate-600">
                    &bull; <strong>75% or higher:</strong> Collegiate (Eligible for final examination without fine).<br />
                    &bull; <strong>60% to 74%:</strong> Non-collegiate (Requires special Dean approval and non-collegiate fee).<br />
                    &bull; <strong>Below 60%:</strong> Discollegiate (Barred from sitting in final exam; must repeat the course).
                  </p>
                </div>
              </Card>
            )}

            {/* Tab 4: Continuous Marks */}
            {activeTab === 'marks' && (
              <Card padding="lg" className="bg-white border-[#E2E8F0] space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">
                      {isBn ? 'ধারাবাহিক মূল্যায়ন ও মার্কস বিবরণী' : 'Continuous Assessment Marks'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Evaluated server-side. Semester final examination marks will be published after exam controller verification.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
                    In Progress
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                    <span className="text-slate-500 font-medium">{isBn ? 'উপস্থিতি (১০)' : 'Attendance (10)'}</span>
                    <div className="text-lg font-bold text-[#0F172A] font-mono">
                      {course.marksBreakdown.classAttendance.toFixed(1)} / 10
                    </div>
                  </div>

                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                    <span className="text-slate-500 font-medium">{isBn ? 'কুইজ / টেস্ট (২০)' : 'Quizzes (20)'}</span>
                    <div className="text-lg font-bold text-[#0F172A] font-mono">
                      {course.marksBreakdown.quizzes.toFixed(1)} / 20
                    </div>
                  </div>

                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                    <span className="text-slate-500 font-medium">{isBn ? 'মিডটার্ম পরীক্ষা (৩০)' : 'Midterm Exam (30)'}</span>
                    <div className="text-lg font-bold text-[#0F172A] font-mono">
                      {course.marksBreakdown.midterm.toFixed(1)} / 30
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-1">
                    <span className="text-[#1E3A8A] font-bold">{isBn ? 'মোট মূল্যায়ন (৬০)' : 'Total Assessment (60)'}</span>
                    <div className="text-lg font-bold text-[#1E3A8A] font-mono">
                      {course.marksBreakdown.totalEstimated.toFixed(1)} / 60
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentCourseDetailPage;
