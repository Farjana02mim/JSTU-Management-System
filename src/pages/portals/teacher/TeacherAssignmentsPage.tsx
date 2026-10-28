import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ChevronDown,
  Download,
  Award,
  Users
} from 'lucide-react';
import { z } from 'zod';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  getTeacherDataService,
  TeacherCourseSummary
} from '../../../services/teacher';

const createAssignmentSchema = z.object({
  courseCode: z.string().min(1, 'Course is required'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  dueDate: z.string().nonempty('Due date is required'),
  maxMarks: z.number().min(5, 'Max marks must be at least 5').max(100, 'Max marks cannot exceed 100')
});

const gradeSchema = z.object({
  score: z.number().min(0, 'Score cannot be negative'),
  feedback: z.string().optional()
});

export const TeacherAssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<TeacherCourseSummary[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);

  // Create Assignment Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newMaxMarks, setNewMaxMarks] = useState<number>(20);
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Grade Modal
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [gradingAssignment, setGradingAssignment] = useState<any | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<any | null>(null);
  const [gradeScore, setGradeScore] = useState<string>('');
  const [gradeFeedback, setGradeFeedback] = useState<string>('');
  const [gradeError, setGradeError] = useState<string | null>(null);
  const [savingGrade, setSavingGrade] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      const [courseList, asgList] = await Promise.all([
        service.getAssignedCourses(teacherEmail),
        service.getAssignments(teacherEmail)
      ]);
      setCourses(courseList);
      setAssignments(asgList);
      if (courseList.length > 0 && !newCourseCode) {
        setNewCourseCode(courseList[0].code);
      }
      if (asgList.length > 0 && !expandedAssignmentId) {
        setExpandedAssignmentId(asgList[0].id);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    const validation = createAssignmentSchema.safeParse({
      courseCode: newCourseCode,
      title: newTitle,
      description: newDesc,
      dueDate: newDueDate,
      maxMarks: Number(newMaxMarks)
    });

    if (!validation.success) {
      setCreateError(validation.error.issues[0].message);
      return;
    }

    try {
      setCreating(true);
      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      await service.createAssignment(teacherEmail, {
        courseCode: newCourseCode,
        title: newTitle,
        description: newDesc,
        dueDate: newDueDate,
        maxMarks: Number(newMaxMarks)
      });

      setCreateModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      setNewDueDate('');
      setNewMaxMarks(20);
      await loadData();
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create assignment.');
    } finally {
      setCreating(false);
    }
  };

  const openGradeModal = (assignment: any, submission: any) => {
    setGradingAssignment(assignment);
    setGradingSubmission(submission);
    setGradeScore(submission.score !== undefined ? String(submission.score) : '');
    setGradeFeedback(submission.feedback || '');
    setGradeError(null);
    setGradeModalOpen(true);
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setGradeError(null);

    const scoreNum = parseFloat(gradeScore);
    if (isNaN(scoreNum)) {
      setGradeError('Please enter a valid numeric score.');
      return;
    }

    if (scoreNum < 0 || scoreNum > gradingAssignment.maxMarks) {
      setGradeError(`Score must be between 0 and ${gradingAssignment.maxMarks}.`);
      return;
    }

    try {
      setSavingGrade(true);
      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      await service.gradeSubmission(teacherEmail, {
        assignmentId: gradingAssignment.id,
        submissionId: gradingSubmission.id,
        score: scoreNum,
        feedback: gradeFeedback
      });

      setGradeModalOpen(false);
      await loadData();
    } catch (err: any) {
      setGradeError(err.message || 'Failed to save grade.');
    } finally {
      setSavingGrade(false);
    }
  };

  const filteredAssignments = assignments.filter((a) =>
    selectedCourseFilter === 'all' ? true : a.courseCode === selectedCourseFilter
  );

  return (
    <DashboardLayout portalTitle={isBn ? 'অ্যাসাইনমেন্ট ও মূল্যায়ন' : 'Assignments & Grading'}>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1E3A8A]" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                  {isBn ? 'অ্যাসাইনমেন্ট তৈরি ও মূল্যায়ন' : 'Assignments & Evaluation Center'}
                </h1>
              </div>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'নতুন অ্যাসাইনমেন্ট প্রকাশ করুন, শিক্ষার্থীদের জমা দেওয়া পিডিএফ খাতা ডাউনলোড বা পর্যালোচনা করুন এবং নম্বর ও ফিডব্যাক দিন।'
                  : 'Publish new course assignments, inspect student submission PDFs, and assign continuous assessment marks with feedback.'}
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="text-xs font-semibold shrink-0"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              {isBn ? 'নতুন অ্যাসাইনমেন্ট' : 'Create Assignment'}
            </Button>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-3 pt-2 border-t border-[#F1F5F9] text-xs">
            <span className="text-slate-500 font-semibold">{isBn ? 'কোর্স ফিল্টার:' : 'Filter by Course:'}</span>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="text-xs p-1.5 border border-[#CBD5E1] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] font-semibold"
            >
              <option value="all">{isBn ? 'সকল নির্ধারিত কোর্স' : 'All Assigned Courses'}</option>
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Assignments List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <SkeletonLoader key={i} variant="rectangular" className="h-44 rounded-xl" />
            ))}
          </div>
        ) : filteredAssignments.length === 0 ? (
          <EmptyState
            title={isBn ? 'কোনো অ্যাসাইনমেন্ট নেই' : 'No Assignments Found'}
            description={isBn ? 'নতুন অ্যাসাইনমেন্ট তৈরি করে শিক্ষার্থীদের কাছে পাঠান।' : 'Publish an assignment to initiate submissions.'}
            actionLabel={isBn ? 'অ্যাসাইনমেন্ট তৈরি করুন' : 'Create Assignment'}
            onAction={() => setCreateModalOpen(true)}
          />
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((asg) => {
              const isExpanded = expandedAssignmentId === asg.id;
              const pendingCount = asg.submissions.filter((s: any) => s.status === 'submitted').length;
              const gradedCount = asg.submissions.filter((s: any) => s.status === 'graded').length;

              return (
                <Card key={asg.id} padding="none" className="border-[#E2E8F0] shadow-2xs overflow-hidden">
                  {/* Top Bar of Assignment Card */}
                  <div
                    onClick={() => setExpandedAssignmentId(isExpanded ? null : asg.id)}
                    className="p-5 bg-white hover:bg-slate-50/70 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-mono font-bold bg-blue-50 text-[#1E3A8A] rounded border border-blue-200">
                          {asg.courseCode}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold font-mono">
                          Max Marks: {asg.maxMarks}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Due: {new Date(asg.dueDate).toLocaleDateString()}</span>
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">{asg.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{asg.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right text-xs">
                        <div className="font-bold text-[#0F172A]">
                          {asg.submissions.length} {isBn ? 'জমা পড়েছে' : 'Submissions'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          <span className="text-amber-600 font-bold">{pendingCount} pending</span> &bull; {gradedCount} graded
                        </div>
                      </div>

                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expanded Submissions Table */}
                  {isExpanded && (
                    <div className="p-5 border-t border-[#F1F5F9] bg-[#F8FAFC]/50 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">
                          {isBn ? 'শিক্ষার্থীদের জমা দেওয়া খাতার তালিকা' : 'Student Submissions'}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          {isBn ? 'নম্বর প্রদান সাথে সাথে শিক্ষার্থীর গ্রেডবুকে যুক্ত হবে' : 'Grades reflect immediately in student portal'}
                        </span>
                      </div>

                      {asg.submissions.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400 bg-white rounded-lg border border-[#E2E8F0]">
                          {isBn ? 'এখনও কোনো শিক্ষার্থী এই অ্যাসাইনমেন্ট জমা দেয়নি।' : 'No submissions received yet.'}
                        </div>
                      ) : (
                        <div className="overflow-x-auto bg-white rounded-lg border border-[#E2E8F0]">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#F8FAFC] text-slate-500 uppercase text-[10px] font-semibold border-b border-[#E2E8F0]">
                              <tr>
                                <th className="py-2.5 px-3">{isBn ? 'শিক্ষার্থী' : 'Student'}</th>
                                <th className="py-2.5 px-3">{isBn ? 'জমা দেওয়ার সময়' : 'Submitted At'}</th>
                                <th className="py-2.5 px-3">{isBn ? 'ফাইল' : 'File'}</th>
                                <th className="py-2.5 px-3 text-center">{isBn ? 'স্টেটাস' : 'Status'}</th>
                                <th className="py-2.5 px-3 text-center">{isBn ? 'প্রাপ্ত নম্বর' : 'Score'}</th>
                                <th className="py-2.5 px-3 text-right">{isBn ? 'পদক্ষেপ' : 'Action'}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F1F5F9]">
                              {asg.submissions.map((sub: any) => (
                                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="py-2.5 px-3">
                                    <div className="font-bold text-[#0F172A]">{sub.studentName}</div>
                                    <div className="text-[10px] font-mono text-slate-400">{sub.studentId}</div>
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                                    {new Date(sub.submittedAt).toLocaleString()}
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <div className="flex items-center gap-1.5 text-slate-700">
                                      <FileText className="w-3.5 h-3.5 text-red-500" />
                                      <span className="truncate max-w-[140px] text-[11px]">{sub.fileName}</span>
                                      <span className="text-[10px] text-slate-400">({sub.fileSize})</span>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 text-center">
                                    <span
                                      className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                                        sub.status === 'graded'
                                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                                      }`}
                                    >
                                      {sub.status}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-center font-mono font-bold">
                                    {sub.score !== undefined ? (
                                      <span className="text-[#1E3A8A]">
                                        {sub.score} / {asg.maxMarks}
                                      </span>
                                    ) : (
                                      <span className="text-slate-400">-</span>
                                    )}
                                  </td>
                                  <td className="py-2.5 px-3 text-right">
                                    <Button
                                      variant={sub.status === 'graded' ? 'outline' : 'primary'}
                                      size="sm"
                                      onClick={() => openGradeModal(asg, sub)}
                                      className="text-[11px] py-1 px-2.5 font-semibold"
                                    >
                                      <Award className="w-3 h-3 mr-1" />
                                      {sub.status === 'graded'
                                        ? (isBn ? 'সংশোধন' : 'Edit Grade')
                                        : (isBn ? 'নম্বর দিন' : 'Grade')}
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Create Assignment */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={isBn ? 'নতুন অ্যাসাইনমেন্ট তৈরি' : 'Create Course Assignment'}
        description={isBn ? 'অ্যাসাইনমেন্ট তৈরি করলে সংশ্লিষ্ট শিক্ষার্থীদের পোর্টালে সরাসরি বিজ্ঞপ্তি যাবে।' : 'Assignments published will be immediately visible in the student portal.'}
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
          {createError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs">
              {createError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'কোর্স নির্বাচন' : 'Select Course'}
            </label>
            <select
              value={newCourseCode}
              onChange={(e) => setNewCourseCode(e.target.value)}
              className="w-full text-xs p-2.5 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] bg-white font-semibold"
              required
            >
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}: {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'অ্যাসাইনমেন্টের শিরোনাম' : 'Assignment Title'}
            </label>
            <Input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Assignment 03: Syntax Directed Translation Grammar"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'বিস্তারিত নির্দেশিকা' : 'Instructions & Scope'}
            </label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={3}
              placeholder="Specify requirements, constraints, and submission criteria..."
              className="w-full text-xs p-2.5 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] bg-white resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'জমা দেওয়ার শেষ সময়' : 'Submission Due Date'}
              </label>
              <input
                type="datetime-local"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full text-xs p-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] bg-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'সর্বোচ্চ নম্বর' : 'Max Marks'}
              </label>
              <Input
                type="number"
                min={5}
                max={100}
                value={newMaxMarks}
                onChange={(e) => setNewMaxMarks(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setCreateModalOpen(false)}>
              {isBn ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={creating}>
              {creating ? (isBn ? 'তৈরি হচ্ছে...' : 'Creating...') : (isBn ? 'অ্যাসাইনমেন্ট প্রকাশ করুন' : 'Publish Assignment')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Grade Submission */}
      <Modal
        isOpen={gradeModalOpen}
        onClose={() => setGradeModalOpen(false)}
        title={isBn ? 'খাতা মূল্যায়ন ও নম্বর প্রদান' : 'Evaluate & Grade Submission'}
        description={
          gradingSubmission
            ? `Evaluating submission by ${gradingSubmission.studentName} (${gradingSubmission.studentId}) for ${gradingAssignment?.courseCode}.`
            : ''
        }
      >
        <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
          {gradeError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs">
              {gradeError}
            </div>
          )}

          {gradingSubmission && (
            <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-600">Attached Document:</span>
                <button
                  type="button"
                  onClick={() => alert(`Simulated open file: ${gradingSubmission.fileName}`)}
                  className="text-xs text-[#1E3A8A] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Inspect PDF ({gradingSubmission.fileSize})</span>
                </button>
              </div>
              <p className="font-mono text-[11px] text-slate-700">{gradingSubmission.fileName}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? `নম্বর (সর্বোচ্চ: ${gradingAssignment?.maxMarks})` : `Score (Max: ${gradingAssignment?.maxMarks})`}
            </label>
            <Input
              type="number"
              step="0.5"
              min="0"
              max={gradingAssignment?.maxMarks}
              value={gradeScore}
              onChange={(e) => setGradeScore(e.target.value)}
              placeholder={`0 - ${gradingAssignment?.maxMarks}`}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'শিক্ষকের মন্তব্য / ফিডব্যাক' : 'Faculty Feedback & Remarks'}
            </label>
            <textarea
              value={gradeFeedback}
              onChange={(e) => setGradeFeedback(e.target.value)}
              rows={3}
              placeholder="Constructive feedback for the student..."
              className="w-full text-xs p-2.5 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] bg-white resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setGradeModalOpen(false)}>
              {isBn ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={savingGrade}>
              {savingGrade ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'নম্বর সংরক্ষণ করুন' : 'Confirm Grade')}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
