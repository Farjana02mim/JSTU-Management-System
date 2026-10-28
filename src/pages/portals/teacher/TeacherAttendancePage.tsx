import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckSquare,
  Square,
  Users,
  Calendar,
  Save,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart2,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  getTeacherDataService,
  TeacherCourseSummary,
  CourseAttendanceReport
} from '../../../services/teacher';

export const TeacherAttendancePage: React.FC = () => {
  const { courseCode: routeCourseCode } = useParams<{ courseCode?: string }>();
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courses, setCourses] = useState<TeacherCourseSummary[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [sessionTopic, setSessionTopic] = useState('');

  // Attendance Sheet state
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [isExistingRecord, setIsExistingRecord] = useState(false);
  const [studentRecords, setStudentRecords] = useState<{
    studentId: string;
    rollNumber: string;
    name: string;
    nameBn: string;
    status: 'present' | 'absent';
  }[]>([]);

  // Active view: 'take' or 'report'
  const [viewMode, setViewMode] = useState<'take' | 'report'>('take');
  const [report, setReport] = useState<CourseAttendanceReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Load courses assigned to teacher
  useEffect(() => {
    let isMounted = true;
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const service = getTeacherDataService();
        const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
        const list = await service.getAssignedCourses(teacherEmail);
        if (isMounted) {
          setCourses(list);
          if (routeCourseCode) {
            setSelectedCourse(routeCourseCode);
          } else if (list.length > 0) {
            setSelectedCourse(list[0].code);
          }
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load assigned courses.');
      } finally {
        if (isMounted) setLoadingCourses(false);
      }
    };

    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, [user, routeCourseCode]);

  // 2. Load attendance sheet when course or date changes
  const loadSheet = async () => {
    if (!selectedCourse || !selectedDate) return;
    try {
      setLoadingSheet(true);
      setError(null);
      setSaveSuccessMsg(null);
      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      const sheet = await service.getAttendanceSheet(teacherEmail, selectedCourse, selectedDate);

      setStudentRecords(sheet.students);
      if (sheet.existingSession) {
        setIsExistingRecord(true);
        setSessionTopic(sheet.existingSession.topic || '');
      } else {
        setIsExistingRecord(false);
        setSessionTopic('Lecture & Discussion');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load attendance session.');
    } finally {
      setLoadingSheet(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'take') {
      loadSheet();
    } else {
      loadReport();
    }
  }, [selectedCourse, selectedDate, viewMode]);

  // 3. Load attendance report
  const loadReport = async () => {
    if (!selectedCourse) return;
    try {
      setLoadingReport(true);
      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      const rep = await service.getAttendanceReport(teacherEmail, selectedCourse);
      setReport(rep);
    } catch (err: any) {
      setError(err.message || 'Failed to load attendance report.');
    } finally {
      setLoadingReport(false);
    }
  };

  // Toggle single student
  const toggleStudentStatus = (studentId: string) => {
    setStudentRecords((prev) =>
      prev.map((s) =>
        s.studentId === studentId
          ? { ...s, status: s.status === 'present' ? 'absent' : 'present' }
          : s
      )
    );
  };

  // Bulk actions
  const markAll = (status: 'present' | 'absent') => {
    setStudentRecords((prev) => prev.map((s) => ({ ...s, status })));
  };

  // Save attendance
  const handleSaveAttendance = async () => {
    if (!selectedCourse || !selectedDate) return;
    try {
      setSaving(true);
      setError(null);
      setSaveSuccessMsg(null);

      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      const res = await service.saveAttendance(teacherEmail, {
        courseCode: selectedCourse,
        date: selectedDate,
        topic: sessionTopic,
        records: studentRecords.map((s) => ({
          studentId: s.studentId,
          status: s.status
        }))
      });

      setSaveSuccessMsg(res.message);
      setIsExistingRecord(true);
    } catch (err: any) {
      setError(err.message || 'Failed to record attendance.');
    } finally {
      setSaving(false);
    }
  };

  // Metrics
  const presentCount = studentRecords.filter((s) => s.status === 'present').length;
  const absentCount = studentRecords.length - presentCount;
  const percentage = studentRecords.length > 0 ? Math.round((presentCount / studentRecords.length) * 100) : 0;

  if (loadingCourses) {
    return (
      <DashboardLayout portalTitle={isBn ? 'শিক্ষক পোর্টাল' : 'Faculty Portal'}>
        <div className="space-y-6">
          <SkeletonLoader variant="rectangular" className="h-28 rounded-2xl" />
          <SkeletonLoader variant="rectangular" className="h-96 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout portalTitle={isBn ? 'উপস্থিতি গ্রহণ' : 'Take Attendance'}>
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-[#1E3A8A]" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                  {isBn ? 'দৈনিক উপস্থিতি ও হাজিরা খাতা' : 'Class Attendance & Digital Register'}
                </h1>
              </div>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'কোর্স ও তারিখ নির্বাচন করে শিক্ষার্থীদের উপস্থিতি রেকর্ড করুন। সংরক্ষিত তথ্য সাথে সাথে শিক্ষার্থী পোর্টালে আপডেট হবে।'
                  : 'Select an assigned course and session date to record attendance. Real-time changes immediately update student attendance percentages.'}
              </p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
              <button
                onClick={() => setViewMode('take')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'take' ? 'bg-white text-[#1E3A8A] shadow-2xs' : 'text-slate-600'
                }`}
              >
                {isBn ? 'হাজিরা গ্রহণ' : 'Take Attendance'}
              </button>
              <button
                onClick={() => setViewMode('report')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'report' ? 'bg-white text-[#1E3A8A] shadow-2xs' : 'text-slate-600'
                }`}
              >
                {isBn ? 'উপস্থিতি প্রতিবেদন' : 'Attendance Report'}
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#F1F5F9]">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                {isBn ? 'কোর্স নির্বাচন করুন' : 'Select Course'}
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full text-xs p-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] bg-white font-semibold"
              >
                {courses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}: {c.title}
                  </option>
                ))}
              </select>
            </div>

            {viewMode === 'take' && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    {isBn ? 'ক্লাসের তারিখ' : 'Session Date'}
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full text-xs p-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    {isBn ? 'লেকচারের বিষয় (ঐচ্ছিক)' : 'Lecture Topic (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                    placeholder="e.g. Lexical Analyzer with Flex"
                    className="w-full text-xs p-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] bg-white"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Existing Session Alert (Duplicate Prevention) */}
        {isExistingRecord && viewMode === 'take' && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {isBn
                  ? `${selectedDate} তারিখে ${selectedCourse} কোর্সের হাজিরা ইতিপূর্বে রেকর্ড করা হয়েছে। আপনি বিদ্যমান রেকর্ড সম্পাদন করছেন।`
                  : `Attendance for ${selectedCourse} on ${selectedDate} was previously recorded. You are editing the existing session.`}
              </span>
            </div>
            <span className="px-2 py-0.5 font-mono text-[10px] font-bold bg-amber-200 text-amber-900 rounded">
              EDIT MODE
            </span>
          </div>
        )}

        {/* Success / Error Messages */}
        {saveSuccessMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-900">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* VIEW MODE 1: TAKE ATTENDANCE */}
        {viewMode === 'take' && (
          <div className="space-y-4">
            {/* Live Count Bar & Bulk Actions */}
            <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700">
                    {presentCount} {isBn ? 'উপস্থিত' : 'Present'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs font-semibold text-slate-700">
                    {absentCount} {isBn ? 'অনুপস্থিত' : 'Absent'}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#1E3A8A] font-mono">
                  ({percentage}%)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAll('present')}
                  className="text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  {isBn ? 'সবাইকে উপস্থিত করুন' : 'Mark All Present'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAll('absent')}
                  className="text-xs"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1 text-red-600" />
                  {isBn ? 'সবাইকে অনুপস্থিত করুন' : 'Mark All Absent'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveAttendance}
                  disabled={saving || studentRecords.length === 0}
                  className="text-xs"
                >
                  <Save className="w-3.5 h-3.5 mr-1" />
                  {saving
                    ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...')
                    : (isBn ? 'হাজিরা সংরক্ষণ' : 'Save Attendance')}
                </Button>
              </div>
            </div>

            {/* Students Table */}
            {loadingSheet ? (
              <SkeletonLoader variant="rectangular" className="h-80 rounded-xl" />
            ) : studentRecords.length === 0 ? (
              <EmptyState
                title={isBn ? 'কোনো শিক্ষার্থী পাওয়া যায়নি' : 'No Students Enrolled'}
                description={isBn ? 'এই কোর্সে এখনও কোনো শিক্ষার্থী নিবন্ধিত হয়নি।' : 'No student enrollments found for this course.'}
              />
            ) : (
              <Card padding="none" className="border-[#E2E8F0] shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-slate-500 uppercase text-[10px] font-semibold border-b border-[#E2E8F0]">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">{isBn ? 'হাজিরা' : 'Status'}</th>
                      <th className="py-3 px-4 w-16">{isBn ? 'রোল' : 'Roll'}</th>
                      <th className="py-3 px-4">{isBn ? 'শিক্ষার্থীর নাম' : 'Student Name'}</th>
                      <th className="py-3 px-4 font-mono">{isBn ? 'স্টুডেন্ট আইডি' : 'Student ID'}</th>
                      <th className="py-3 px-4 text-right">{isBn ? 'পদক্ষেপ' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {studentRecords.map((st) => (
                      <tr
                        key={st.studentId}
                        onClick={() => toggleStudentStatus(st.studentId)}
                        className={`cursor-pointer transition-colors ${
                          st.status === 'present' ? 'hover:bg-emerald-50/40' : 'bg-red-50/20 hover:bg-red-50/40'
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            className="p-1 rounded hover:bg-slate-200 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStudentStatus(st.studentId);
                            }}
                          >
                            {st.status === 'present' ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-600">{st.rollNumber}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#0F172A]">{isBn ? st.nameBn : st.name}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">{st.studentId}</td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-md uppercase font-mono ${
                              st.status === 'present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {st.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
          </div>
        )}

        {/* VIEW MODE 2: ATTENDANCE REPORT */}
        {viewMode === 'report' && (
          <div className="space-y-4">
            {loadingReport ? (
              <SkeletonLoader variant="rectangular" className="h-80 rounded-xl" />
            ) : !report ? (
              <EmptyState
                title={isBn ? 'প্রতিবেদন পাওয়া যায়নি' : 'Report Unavailable'}
                description={isBn ? 'এই কোর্সের উপস্থিতির কোনো তথ্য এখনও সংরক্ষিত হয়নি।' : 'No attendance logs have been recorded for this course.'}
              />
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {isBn
                      ? `মোট অনুষ্ঠিত ক্লাসের সংখ্যা: ${report.totalSessions}`
                      : `Total recorded lecture sessions: ${report.totalSessions}`}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isBn ? 'ইউজিসি মানদণ্ডে ৭৫% বাধ্যতামূলক' : 'UGC standard: >=75% mandatory for finals'}
                  </span>
                </div>

                <Card padding="none" className="border-[#E2E8F0] shadow-2xs overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] text-slate-500 uppercase text-[10px] font-semibold border-b border-[#E2E8F0]">
                      <tr>
                        <th className="py-3 px-4">{isBn ? 'শিক্ষার্থী' : 'Student'}</th>
                        <th className="py-3 px-4 text-center">{isBn ? 'উপস্থিত' : 'Attended'}</th>
                        <th className="py-3 px-4 text-center">{isBn ? 'মোট ক্লাস' : 'Total Sessions'}</th>
                        <th className="py-3 px-4 text-center">{isBn ? 'শতকরা হার' : 'Percentage'}</th>
                        <th className="py-3 px-4 text-right">{isBn ? 'যোগ্যতা নির্দেশক' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {report.studentSummaries.map((st) => (
                        <tr key={st.studentId} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#0F172A]">{isBn ? st.nameBn : st.name}</div>
                            <div className="text-[10px] font-mono text-slate-400">{st.studentId}</div>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700">
                            {st.attended}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-slate-500">
                            {st.total}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-extrabold text-sm">
                            <span
                              className={
                                st.percentage >= 75
                                  ? 'text-emerald-700'
                                  : st.percentage >= 60
                                  ? 'text-amber-700'
                                  : 'text-red-700'
                              }
                            >
                              {st.percentage}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                st.status === 'safe'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : st.status === 'warning'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : 'bg-red-50 text-red-800 border border-red-200'
                              }`}
                            >
                              {st.status === 'safe'
                                ? 'Regular (>=75%)'
                                : st.status === 'warning'
                                ? 'Collegiate (60-74%)'
                                : 'Non-Collegiate (<60%)'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
