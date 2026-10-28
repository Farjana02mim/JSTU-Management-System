import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Award,
  Save,
  Send,
  Lock,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  getTeacherDataService,
  TeacherCourseSummary,
  CourseMarksSheet,
  StudentMarksRecord
} from '../../../services/teacher';
import {
  MARKS_LIMITS,
  validateMarksInput,
  computeTotalMarks
} from '../../../utils/marksCalculator';

export const TeacherMarksEntryPage: React.FC = () => {
  const { courseCode: routeCourseCode } = useParams<{ courseCode?: string }>();
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courses, setCourses] = useState<TeacherCourseSummary[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const [loadingSheet, setLoadingSheet] = useState(false);
  const [sheet, setSheet] = useState<CourseMarksSheet | null>(null);

  // Local editable rows
  const [editableEntries, setEditableEntries] = useState<
    Record<
      string,
      {
        attendance: string;
        classTests: string;
        midterm: string;
        finalExam: string;
      }
    >
  >({});

  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Fetch assigned courses
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
        if (isMounted) setErrorMsg(err.message || 'Failed to load courses.');
      } finally {
        if (isMounted) setLoadingCourses(false);
      }
    };

    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, [user, routeCourseCode]);

  // 2. Fetch marks sheet for selected course
  const loadMarksSheet = async () => {
    if (!selectedCourse) return;
    try {
      setLoadingSheet(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      const result = await service.getMarksSheet(teacherEmail, selectedCourse);
      setSheet(result);

      // Populate local editable values
      const initialForm: Record<string, { attendance: string; classTests: string; midterm: string; finalExam: string }> = {};
      Object.entries(result.entries).forEach(([studentId, rawEntry]) => {
        const entry = rawEntry as StudentMarksRecord;
        initialForm[studentId] = {
          attendance: String(entry.attendance),
          classTests: String(entry.classTests),
          midterm: String(entry.midterm),
          finalExam: entry.finalExam !== undefined ? String(entry.finalExam) : ''
        };
      });
      setEditableEntries(initialForm);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load marks sheet.');
    } finally {
      setLoadingSheet(false);
    }
  };

  useEffect(() => {
    loadMarksSheet();
  }, [selectedCourse]);

  const handleCellChange = (
    studentId: string,
    field: 'attendance' | 'classTests' | 'midterm' | 'finalExam',
    val: string
  ) => {
    if (sheet?.status === 'SUBMITTED') return; // Locked

    setEditableEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: val
      }
    }));
  };

  const handleSaveDraftOrSubmit = async (submitToChairman: boolean) => {
    if (!selectedCourse) return;
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      // Parse and validate all entries
      const parsedEntries: Record<
        string,
        { attendance: number; classTests: number; midterm: number; finalExam?: number }
      > = {};

      for (const [studentId, row] of Object.entries(editableEntries)) {
        const att = parseFloat(row.attendance) || 0;
        const ct = parseFloat(row.classTests) || 0;
        const mid = parseFloat(row.midterm) || 0;
        const finalVal = row.finalExam.trim() !== '' ? parseFloat(row.finalExam) : undefined;

        const validation = validateMarksInput({
          attendance: att,
          classTests: ct,
          midterm: mid,
          finalExam: finalVal
        });

        if (!validation.isValid) {
          const firstErr = Object.values(validation.errors)[0];
          throw new Error(`Student ${studentId}: ${firstErr}`);
        }

        parsedEntries[studentId] = {
          attendance: att,
          classTests: ct,
          midterm: mid,
          finalExam: finalVal
        };
      }

      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      const res = await service.saveMarks(teacherEmail, {
        courseCode: selectedCourse,
        entries: parsedEntries,
        submitToChairman
      });

      setSheet(res.sheet);
      setSuccessMsg(res.message);
      setSubmitConfirmOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save marks.');
    } finally {
      setSaving(false);
    }
  };

  const isSubmitted = sheet?.status === 'SUBMITTED';

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
    <DashboardLayout portalTitle={isBn ? 'মার্কস এন্ট্রি' : 'Marks Entry'}>
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#1E3A8A]" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                  {isBn ? 'ধারাবাহিক ও ফাইনাল মূল্যায়ন মার্কস এন্ট্রি' : 'Continuous & Final Marks Entry'}
                </h1>
              </div>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'উপস্থিতি (১০), ক্লাস টেস্ট (২০), মিডটার্ম (২০) এবং সেমিস্টার ফাইনাল (৫০)। দাখিল করার পর শিটটি লক হবে এবং চেয়ারম্যানের অনুমোদনের অপেক্ষায় থাকবে।'
                  : 'Attendance (10), Class Tests (20), Midterm (20), Semester Final (50). Upon submission, the marks sheet is permanently locked awaiting Chairman verification.'}
              </p>
            </div>

            {/* Course Selector Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-500">{isBn ? 'কোর্স:' : 'Course:'}</span>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="text-xs p-2 border border-[#CBD5E1] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] font-semibold"
              >
                {courses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}: {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Institutional Ceilings Legend Strip */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#F1F5F9] text-xs text-slate-600">
            <span className="font-bold text-[#0F172A]">{isBn ? 'নম্বর বণ্টন নীতি:' : 'Grading Ceiling Rules:'}</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded font-mono text-[11px]">Attendance: Max 10</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded font-mono text-[11px]">Class Tests: Max 20</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded font-mono text-[11px]">Midterm: Max 20</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded font-mono text-[11px]">Semester Final: Max 50</span>
            <span className="px-2 py-0.5 bg-blue-50 text-[#1E3A8A] font-bold rounded font-mono text-[11px] border border-blue-200">
              Total: 100 (UGC Scale)
            </span>
          </div>
        </div>

        {/* Status Banner */}
        {isSubmitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold">
                  {isBn
                    ? `মার্কস শিট দাখিলকৃত ও লক করা হয়েছে (${new Date(sheet?.submittedAt || '').toLocaleString('bn-BD')})`
                    : `Marks sheet SUBMITTED & LOCKED (${new Date(sheet?.submittedAt || '').toLocaleString()})`}
                </span>
                <p className="text-[11px] text-emerald-800">
                  {isBn
                    ? 'শিটটি বিভাগীয় চেয়ারম্যানের অনুমোদনের অপেক্ষায় রয়েছে। শিক্ষক কোনো পরিবর্তন করতে পারবেন না।'
                    : 'Awaiting Department Chairman verification and Examination Controller authorization. Edits are disabled.'}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-600 text-white rounded-md shadow-2xs">
              SUBMITTED
            </span>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-950">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <span className="font-bold">
                  {isBn ? 'মার্কস শিট ড্রাফট মোডে রয়েছে' : 'Marks Sheet in DRAFT Mode'}
                </span>
                <p className="text-[11px] text-amber-800">
                  {isBn
                    ? 'নম্বর পরিবর্তন করে "ড্রাফট সংরক্ষণ" করুন। চূড়ান্ত হলে "চেয়ারম্যানের নিকট প্রেরণ" বোতাম চাপুন।'
                    : 'Edit marks and save drafts freely. Submit to Chairman once continuous assessment is complete.'}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-amber-500 text-white rounded-md shadow-2xs">
              DRAFT
            </span>
          </div>
        )}

        {/* Success / Error Messages */}
        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-900">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Marks Table */}
        {loadingSheet ? (
          <SkeletonLoader variant="rectangular" className="h-96 rounded-xl" />
        ) : !sheet ? (
          <EmptyState
            title={isBn ? 'মার্কস শিট পাওয়া যায়নি' : 'Marks Sheet Unavailable'}
            description="Unable to load marks sheet records."
          />
        ) : (
          <Card padding="none" className="border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-slate-500 uppercase text-[10px] font-semibold border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3 px-4">{isBn ? 'শিক্ষার্থী' : 'Student Name & ID'}</th>
                    <th className="py-3 px-3 text-center">{isBn ? 'উপস্থিতি (১০)' : 'Attendance (10)'}</th>
                    <th className="py-3 px-3 text-center">{isBn ? 'ক্লাস টেস্ট (২০)' : 'Class Tests (20)'}</th>
                    <th className="py-3 px-3 text-center">{isBn ? 'মিডটার্ম (২০)' : 'Midterm (20)'}</th>
                    <th className="py-3 px-3 text-center">{isBn ? 'ফাইনাল (৫০)' : 'Final Exam (50)'}</th>
                    <th className="py-3 px-4 text-center">{isBn ? 'মোট নম্বর (১০০)' : 'Total (100)'}</th>
                    <th className="py-3 px-4 text-center">{isBn ? 'গ্রেড' : 'Grade'}</th>
                    <th className="py-3 px-4 text-center font-mono">{isBn ? 'জিপিএ' : 'Point'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {Object.entries(sheet.entries).map(([studentId, rawEntry]) => {
                    const entry = rawEntry as StudentMarksRecord;
                    const rowForm = editableEntries[studentId] || {
                      attendance: String(entry.attendance),
                      classTests: String(entry.classTests),
                      midterm: String(entry.midterm),
                      finalExam: entry.finalExam !== undefined ? String(entry.finalExam) : ''
                    };

                    const liveComputed = computeTotalMarks({
                      attendance: parseFloat(rowForm.attendance) || 0,
                      classTests: parseFloat(rowForm.classTests) || 0,
                      midterm: parseFloat(rowForm.midterm) || 0,
                      finalExam: rowForm.finalExam.trim() !== '' ? parseFloat(rowForm.finalExam) : undefined
                    });

                    return (
                      <tr key={studentId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#0F172A]">{studentId}</div>
                          <div className="text-[10px] text-slate-400">Regular Student</div>
                        </td>

                        {/* Attendance Input */}
                        <td className="py-2 px-2 text-center">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max={MARKS_LIMITS.attendance.max}
                            disabled={isSubmitted}
                            value={rowForm.attendance}
                            onChange={(e) => handleCellChange(studentId, 'attendance', e.target.value)}
                            className="w-16 text-center text-xs p-1.5 border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] disabled:bg-slate-100 disabled:text-slate-500 font-mono"
                          />
                        </td>

                        {/* Class Tests Input */}
                        <td className="py-2 px-2 text-center">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max={MARKS_LIMITS.classTests.max}
                            disabled={isSubmitted}
                            value={rowForm.classTests}
                            onChange={(e) => handleCellChange(studentId, 'classTests', e.target.value)}
                            className="w-16 text-center text-xs p-1.5 border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] disabled:bg-slate-100 disabled:text-slate-500 font-mono"
                          />
                        </td>

                        {/* Midterm Input */}
                        <td className="py-2 px-2 text-center">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max={MARKS_LIMITS.midterm.max}
                            disabled={isSubmitted}
                            value={rowForm.midterm}
                            onChange={(e) => handleCellChange(studentId, 'midterm', e.target.value)}
                            className="w-16 text-center text-xs p-1.5 border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] disabled:bg-slate-100 disabled:text-slate-500 font-mono"
                          />
                        </td>

                        {/* Final Exam Input */}
                        <td className="py-2 px-2 text-center">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max={MARKS_LIMITS.finalExam.max}
                            disabled={isSubmitted}
                            placeholder="Optional"
                            value={rowForm.finalExam}
                            onChange={(e) => handleCellChange(studentId, 'finalExam', e.target.value)}
                            className="w-20 text-center text-xs p-1.5 border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] disabled:bg-slate-100 disabled:text-slate-500 font-mono"
                          />
                        </td>

                        {/* Total Display */}
                        <td className="py-3 px-4 text-center font-mono font-bold text-sm text-[#0F172A]">
                          {liveComputed.totalMarks}
                        </td>

                        {/* Letter Grade */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 text-xs font-mono font-bold rounded ${
                              liveComputed.letterGrade === 'A+' || liveComputed.letterGrade === 'A'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : liveComputed.letterGrade === 'F'
                                ? 'bg-red-50 text-red-800 border border-red-200'
                                : 'bg-blue-50 text-[#1E3A8A] border border-blue-200'
                            }`}
                          >
                            {liveComputed.letterGrade}
                          </span>
                        </td>

                        {/* Grade Point */}
                        <td className="py-3 px-4 text-center font-mono font-semibold text-slate-600">
                          {liveComputed.gradePoint.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Action Bar Footer */}
            {!isSubmitted && (
              <div className="p-4 bg-slate-50 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  {isBn
                    ? 'দাখিল করার পূর্বে সকল ফিল্ড সতর্কতার সাথে পরীক্ষা করুন।'
                    : 'Verify all scores. Once submitted, editing will be locked.'}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveDraftOrSubmit(false)}
                    disabled={saving}
                    className="text-xs font-semibold"
                  >
                    <Save className="w-3.5 h-3.5 mr-1" />
                    {saving ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'ড্রাফট হিসেবে সংরক্ষণ' : 'Save Draft')}
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSubmitConfirmOpen(true)}
                    disabled={saving}
                    className="text-xs font-semibold"
                  >
                    <Send className="w-3.5 h-3.5 mr-1" />
                    {isBn ? 'চেয়ারম্যানের কাছে দাখিল করুন' : 'Submit to Chairman'}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Confirmation Modal: Submit to Chairman */}
      <Modal
        isOpen={submitConfirmOpen}
        onClose={() => setSubmitConfirmOpen(false)}
        title={isBn ? 'চেয়ারম্যানের নিকট মার্কস দাখিল নিশ্চিতকরণ' : 'Confirm Submission to Dept. Chairman'}
        description={
          isBn
            ? `আপনি কি নিশ্চিত যে ${selectedCourse} কোর্সের চূড়ান্ত মার্কস শিট দাখিল করতে চান? দাখিলের পর শিটটি লক হয়ে যাবে এবং কোনো নম্বর সম্পাদনা করা যাবে না।`
            : `Are you sure you want to submit the marks sheet for ${selectedCourse}? Once submitted, editing is locked permanently and forwarded for Chairman verification.`
        }
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="p-3 bg-amber-50 text-amber-900 rounded-lg border border-amber-200 text-xs">
            <span className="font-bold">Permanent Action:</span> After submission, any changes require written authorization and Controller approval.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setSubmitConfirmOpen(false)}>
              {isBn ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSaveDraftOrSubmit(true)}
              disabled={saving}
            >
              {saving
                ? (isBn ? 'দাখিল হচ্ছে...' : 'Submitting...')
                : (isBn ? 'দাখিল সম্পন্ন করুন' : 'Confirm Submission')}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
