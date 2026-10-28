import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  CheckSquare,
  Award,
  ArrowLeft,
  FileText,
  Upload,
  Megaphone,
  Trash2,
  Download,
  AlertTriangle,
  ShieldAlert,
  Plus,
  Calendar,
  Layers,
  FileCheck
} from 'lucide-react';
import { z } from 'zod';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  getTeacherDataService,
  TeacherCourseDetail,
  TeacherPermissionError
} from '../../../services/teacher';

const materialSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  fileType: z.enum(['pdf', 'slide', 'doc']),
  fileSize: z.string().nonempty('File size is required')
});

const announcementSchema = z.object({
  title: z.string().min(4, 'Title must be at least 4 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters')
});

export const TeacherCourseDetailPage: React.FC = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<TeacherCourseDetail | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [genericError, setGenericError] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<'students' | 'materials' | 'announcements'>('students');

  // Modals
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialFile, setMaterialFile] = useState<{ name: string; size: string } | null>(null);
  const [materialError, setMaterialError] = useState<string | null>(null);
  const [savingMaterial, setSavingMaterial] = useState(false);

  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementError, setAnnouncementError] = useState<string | null>(null);
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);

  const loadCourseDetail = async () => {
    if (!courseCode) return;
    try {
      setLoading(true);
      setPermissionError(null);
      setGenericError(null);
      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      const detail = await service.getCourseDetail(teacherEmail, courseCode);
      setCourse(detail);
    } catch (err: any) {
      if (err instanceof TeacherPermissionError || err.name === 'TeacherPermissionError') {
        setPermissionError(err.message);
      } else {
        setGenericError(err.message || 'Failed to load course details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseDetail();
  }, [courseCode, user]);

  // Handle Material Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaterialError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setMaterialError('Only PDF document files (.pdf) are permitted.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMaterialError('File size exceeds the 10 MB limit.');
      return;
    }

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setMaterialFile({ name: file.name, size: `${sizeMb} MB` });
    if (!materialTitle) {
      setMaterialTitle(file.name.replace(/\.pdf$/i, ''));
    }
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setMaterialError(null);

    const validation = materialSchema.safeParse({
      title: materialTitle,
      fileType: 'pdf',
      fileSize: materialFile?.size || '1.8 MB'
    });

    if (!validation.success) {
      setMaterialError(validation.error.issues[0].message);
      return;
    }

    if (!materialFile) {
      setMaterialError('Please select a PDF file to upload.');
      return;
    }

    try {
      setSavingMaterial(true);
      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      await service.addMaterial(teacherEmail, {
        courseCode: course!.code,
        title: materialTitle,
        fileType: 'pdf',
        fileSize: materialFile.size,
        fileName: materialFile.name
      });

      setMaterialModalOpen(false);
      setMaterialTitle('');
      setMaterialFile(null);
      await loadCourseDetail();
    } catch (err: any) {
      setMaterialError(err.message || 'Failed to upload material.');
    } finally {
      setSavingMaterial(false);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm(isBn ? 'আপনি কি নিশ্চিত যে এই ম্যাটেরিয়ালটি মুছে ফেলতে চান?' : 'Are you sure you want to remove this material?')) {
      return;
    }
    try {
      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      await service.deleteMaterial(teacherEmail, course!.code, materialId);
      await loadCourseDetail();
    } catch (err: any) {
      alert(err.message || 'Failed to delete material.');
    }
  };

  // Handle Announcement Publication
  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnnouncementError(null);

    const validation = announcementSchema.safeParse({
      title: announcementTitle,
      content: announcementContent
    });

    if (!validation.success) {
      setAnnouncementError(validation.error.issues[0].message);
      return;
    }

    try {
      setSavingAnnouncement(true);
      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      await service.publishAnnouncement(teacherEmail, {
        courseCode: course!.code,
        title: announcementTitle,
        content: announcementContent
      });

      setAnnouncementModalOpen(false);
      setAnnouncementTitle('');
      setAnnouncementContent('');
      await loadCourseDetail();
    } catch (err: any) {
      setAnnouncementError(err.message || 'Failed to publish announcement.');
    } finally {
      setSavingAnnouncement(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout portalTitle={isBn ? 'শিক্ষক পোর্টাল' : 'Faculty Portal'}>
        <div className="space-y-6">
          <SkeletonLoader variant="rectangular" className="h-40 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <SkeletonLoader key={i} variant="rectangular" className="h-24 rounded-xl" />
            ))}
          </div>
          <SkeletonLoader variant="rectangular" className="h-96 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  // Explicit Permission Error Display
  if (permissionError) {
    return (
      <DashboardLayout portalTitle={isBn ? 'অননুমোদিত কোর্স' : 'Unauthorized Course'}>
        <div className="max-w-2xl mx-auto py-12 space-y-6">
          <Card padding="lg" className="border-red-200 bg-red-50/50 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto border border-red-200">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-red-950">
                {isBn ? 'অনুমতি ত্রুটি: অননুমোদিত কোর্স অ্যাক্সেস' : 'Access Denied: Unassigned Course'}
              </h2>
              <p className="text-xs text-red-800 leading-relaxed font-mono p-3 bg-red-100/70 rounded-lg border border-red-200">
                {permissionError}
              </p>
            </div>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              {isBn
                ? 'বিশ্ববিদ্যালয় নিরাপত্তা নীতি অনুযায়ী শিক্ষকরা শুধুমাত্র বিভাগীয় চেয়ারম্যান কর্তৃক তাদের নির্ধারিত কোর্সে প্রবেশাধিকার রাখেন।'
                : 'Under JSTU academic security governance, instructors are restricted from viewing or altering records of courses assigned to other faculty.'}
            </p>
            <div className="pt-2">
              <Link to="/teacher/courses">
                <Button variant="primary" size="md">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {isBn ? 'আমার নির্ধারিত কোর্সে ফিরে যান' : 'Back to My Assigned Courses'}
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (genericError || !course) {
    return (
      <DashboardLayout portalTitle={isBn ? 'শিক্ষক পোর্টাল' : 'Faculty Portal'}>
        <EmptyState
          title={isBn ? 'কোর্স তথ্য পাওয়া যায়নি' : 'Course Not Found'}
          description={genericError || 'Unable to locate course record.'}
          actionLabel={isBn ? 'কোর্স তালিকায় ফিরুন' : 'Back to Courses'}
          onAction={() => navigate('/teacher/courses')}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout portalTitle={isBn ? 'শিক্ষক পোর্টাল' : 'Faculty Portal'}>
      <div className="space-y-6">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/teacher/courses"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1E3A8A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isBn ? 'সকল কোর্সে ফিরুন' : 'Back to Courses'}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to={`/teacher/attendance/${course.code}`}>
              <Button variant="outline" size="sm" className="text-xs">
                <CheckSquare className="w-3.5 h-3.5 mr-1 text-[#1E3A8A]" />
                {isBn ? 'উপস্থিতি গ্রহণ' : 'Take Attendance'}
              </Button>
            </Link>
            <Link to={`/teacher/marks/${course.code}`}>
              <Button variant="primary" size="sm" className="text-xs">
                <Award className="w-3.5 h-3.5 mr-1" />
                {isBn ? 'মার্কস এন্ট্রি' : 'Marks Entry'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Course Header Banner */}
        <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-mono font-bold bg-blue-50 text-[#1E3A8A] border border-blue-200 rounded-md">
                  {course.code}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {course.credits.toFixed(1)} Credits &bull; {isBn ? course.semesterBn : course.semester}
                </span>
                <span
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-md uppercase font-mono ${
                    course.marksSheet.status === 'SUBMITTED'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  Marks: {course.marksSheet.status}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                {isBn ? course.titleBn : course.title}
              </h1>
              <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
                {isBn ? course.syllabusOverviewBn : course.syllabusOverview}
              </p>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#F1F5F9]">
            <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                {isBn ? 'নিবন্ধিত শিক্ষার্থী' : 'Enrolled Students'}
              </span>
              <span className="text-lg font-bold text-[#0F172A] tabular-nums">
                {course.enrolledStudents.length}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                {isBn ? 'মোট ক্লাস অনুষ্ঠিত' : 'Total Sessions Held'}
              </span>
              <span className="text-lg font-bold text-[#0F172A] tabular-nums">
                {course.attendanceSessionsCount}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                {isBn ? 'গড় ক্লাসের উপস্থিতি' : 'Class Avg. Attendance'}
              </span>
              <span className="text-lg font-bold text-[#0F172A] tabular-nums">
                {course.averageAttendancePercentage}%
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                {isBn ? 'শেয়ারকৃত ম্যাটেরিয়ালস' : 'Lecture Materials'}
              </span>
              <span className="text-lg font-bold text-[#0F172A] tabular-nums">
                {course.materials.length} files
              </span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'students'
                ? 'bg-[#1E3A8A] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isBn ? 'নিবন্ধিত শিক্ষার্থী' : 'Enrolled Students'}</span>
            <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">
              {course.enrolledStudents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'materials'
                ? 'bg-[#1E3A8A] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isBn ? 'লেকচার ম্যাটেরিয়ালস' : 'Course Materials'}</span>
            <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">
              {course.materials.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'announcements'
                ? 'bg-[#1E3A8A] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>{isBn ? 'কোর্স নোটিশ' : 'Announcements'}</span>
            <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">
              {course.announcements.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Enrolled Students Table */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{isBn ? 'শিক্ষার্থীদের উপস্থিতি ও মার্কস সারাংশ' : 'Student Attendance and Evaluation Summary'}</span>
              <span className="text-[11px] text-slate-400">
                {isBn ? '৭৫% এর কম উপস্থিতি সতর্কীকরণ নির্দেশক' : '<75% attendance triggers institutional warning'}
              </span>
            </div>

            <Card padding="none" className="border-[#E2E8F0] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-slate-500 uppercase text-[10px] font-semibold border-b border-[#E2E8F0]">
                    <tr>
                      <th className="py-3 px-4">{isBn ? 'রোল' : 'Roll'}</th>
                      <th className="py-3 px-4">{isBn ? 'শিক্ষার্থীর নাম ও আইডি' : 'Student Name & ID'}</th>
                      <th className="py-3 px-4 text-center">{isBn ? 'উপস্থিতি' : 'Attended'}</th>
                      <th className="py-3 px-4 text-center">{isBn ? 'উপস্থিতি হার' : 'Attendance %'}</th>
                      <th className="py-3 px-4 text-center">{isBn ? 'স্টেটাস' : 'Status'}</th>
                      <th className="py-3 px-4 text-right">{isBn ? 'ধারাবাহিক মূল্যায়ন' : 'Continuous Total'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {course.enrolledStudents.map((st) => (
                      <tr key={st.studentId} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-600">{st.rollNumber}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#0F172A]">{isBn ? st.nameBn : st.name}</div>
                          <div className="text-[10px] font-mono text-slate-400">{st.studentId}</div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono tabular-nums">
                          {st.attendedClasses} / {st.totalClasses}
                        </td>
                        <td className="py-3 px-4 text-center font-bold font-mono tabular-nums">
                          <span
                            className={
                              st.attendancePercentage >= 75
                                ? 'text-emerald-700'
                                : st.attendancePercentage >= 60
                                ? 'text-amber-700'
                                : 'text-red-700'
                            }
                          >
                            {st.attendancePercentage}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              st.attendanceStatus === 'safe'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : st.attendanceStatus === 'warning'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}
                          >
                            {st.attendanceStatus === 'safe'
                              ? 'Eligible (>=75%)'
                              : st.attendanceStatus === 'warning'
                              ? 'Warning (60-74%)'
                              : 'Non-Collegiate (<60%)'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#0F172A] tabular-nums">
                          {st.currentTotalMarks > 0 ? (
                            <span>
                              {st.currentTotalMarks} / 100 ({st.letterGrade})
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Materials List */}
        {activeTab === 'materials' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {isBn ? 'কোর্সের পাঠ্য নির্দেশিকা ও লেকচার ফাইল' : 'Course Lecture Slides & PDF Handouts'}
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setMaterialModalOpen(true)}
                className="text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                {isBn ? 'নতুন ফাইল যুক্ত করুন' : 'Add Material'}
              </Button>
            </div>

            {course.materials.length === 0 ? (
              <EmptyState
                title={isBn ? 'কোনো ম্যাটেরিয়াল নেই' : 'No Materials Uploaded'}
                description={isBn ? 'শিক্ষার্থীদের জন্য লেকচার স্লাইড বা পিডিএফ হ্যান্ডআউট যোগ করুন।' : 'Upload lecture notes, lab manuals or slides for enrolled students.'}
                actionLabel={isBn ? 'ম্যাটেরিয়াল যুক্ত করুন' : 'Upload Material'}
                onAction={() => setMaterialModalOpen(true)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.materials.map((mat) => (
                  <Card key={mat.id} padding="md" className="border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-red-50 text-red-600 rounded-lg border border-red-200 shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-[#0F172A] leading-snug">{mat.title}</h4>
                          <p className="text-[10px] text-slate-400 flex items-center gap-2">
                            <span>{mat.fileSize}</span>
                            <span>&bull;</span>
                            <span>Uploaded {mat.uploadDate}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => alert(`Simulated download for: ${mat.title}`)}
                          className="p-1.5 text-slate-500 hover:text-[#1E3A8A] hover:bg-slate-100 rounded-md transition-colors"
                          title="Download file"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMaterial(mat.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete material"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Announcements */}
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {isBn ? 'কোর্স নোটিশবোর্ড (শিক্ষার্থী পোর্টালে সরাসরি দৃশ্যমান)' : 'Course Announcements (Immediately visible in Student Portal)'}
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setAnnouncementModalOpen(true)}
                className="text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                {isBn ? 'বিজ্ঞপ্তি প্রকাশ করুন' : 'Post Announcement'}
              </Button>
            </div>

            {course.announcements.length === 0 ? (
              <EmptyState
                title={isBn ? 'কোনো নোটিশ নেই' : 'No Announcements Posted'}
                description={isBn ? 'কুইজ, মিডটার্ম বা ল্যাব ক্লাস সম্পর্কিত কোনো নোটিশ এখনও প্রকাশ করা হয়নি।' : 'Post notices regarding quizzes, exams, or schedule adjustments.'}
                actionLabel={isBn ? 'বিজ্ঞপ্তি দিন' : 'Post Notice'}
                onAction={() => setAnnouncementModalOpen(true)}
              />
            ) : (
              <div className="space-y-3">
                {course.announcements.map((ann) => (
                  <Card key={ann.id} padding="md" className="border-[#E2E8F0] shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0F172A] text-sm">{ann.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{ann.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                    <div className="text-[10px] text-slate-400 font-semibold pt-1">
                      Posted by: {ann.author}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Add Material */}
      <Modal
        isOpen={materialModalOpen}
        onClose={() => setMaterialModalOpen(false)}
        title={isBn ? 'কোর্স ম্যাটেরিয়াল যুক্ত করুন' : 'Add Course Material'}
        description={isBn ? 'শিক্ষার্থীদের অধ্যয়নের জন্য পিডিএফ ফাইল আপলোড করুন (সর্বোচ্চ ১০ মেগাবাইট)।' : 'Upload lecture notes, slides or assignment templates in PDF format (max 10 MB).'}
      >
        <form onSubmit={handleSaveMaterial} className="space-y-4 text-xs">
          {materialError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs">
              {materialError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'ফাইল নির্বাচন করুন (কেবলমাত্র পিডিএফ)' : 'Select PDF File (.pdf only)'}
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#CBD5E1] file:text-xs file:font-semibold file:bg-white file:text-[#1E3A8A] hover:file:bg-slate-50 cursor-pointer"
            />
            {materialFile && (
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                Selected: {materialFile.name} ({materialFile.size})
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'ম্যাটেরিয়ালের শিরোনাম' : 'Material Title'}
            </label>
            <Input
              type="text"
              value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
              placeholder="e.g. Lecture 04: Top-Down Parsing Handout"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setMaterialModalOpen(false)}>
              {isBn ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={savingMaterial}>
              {savingMaterial ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Uploading...') : (isBn ? 'সংরক্ষণ করুন' : 'Confirm Upload')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Publish Announcement */}
      <Modal
        isOpen={announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
        title={isBn ? 'নতুন কোর্স নোটিশ প্রকাশ' : 'Publish Course Announcement'}
        description={isBn ? 'এই নোটিশটি সরাসরি সকল নিবন্ধিত শিক্ষার্থীর কোর্স পোর্টালে যুক্ত হবে।' : 'This announcement will appear on the course dashboard and send notifications to enrolled students.'}
      >
        <form onSubmit={handlePublishAnnouncement} className="space-y-4 text-xs">
          {announcementError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs">
              {announcementError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'নোটিশের শিরোনাম' : 'Announcement Title'}
            </label>
            <Input
              type="text"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              placeholder="e.g. Midterm Examination Syllabus & Guidelines"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'নোটিশের বিস্তারিত বিবরণ' : 'Detailed Content'}
            </label>
            <textarea
              value={announcementContent}
              onChange={(e) => setAnnouncementContent(e.target.value)}
              rows={4}
              placeholder="Type announcement details here..."
              className="w-full text-xs p-2.5 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] bg-white resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setAnnouncementModalOpen(false)}>
              {isBn ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={savingAnnouncement}>
              {savingAnnouncement ? (isBn ? 'প্রকাশ হচ্ছে...' : 'Publishing...') : (isBn ? 'প্রকাশ করুন' : 'Publish Now')}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
