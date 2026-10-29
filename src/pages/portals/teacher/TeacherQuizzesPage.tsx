import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../../services/shared/sharedDataStore';
import { Quiz, StudentQuizAttempt, QuizQuestion, QuizQuestionType } from '../../../types/quiz';
import {
  HelpCircle,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  BarChart3,
  Users,
  Shuffle,
  FileCheck,
  Check,
  Eye,
  BookOpen,
  Calendar,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Sliders,
  Trash2
} from 'lucide-react';

export const TeacherQuizzesPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const storeManager = SharedDataStoreManager.getInstance();
  const teacherId = 'teacher_shahadat';
  const teacherName = profile?.fullName || user?.displayName || 'Dr. Shahadat Hossain';

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [attempts, setAttempts] = useState<StudentQuizAttempt[]>([]);
  const [analytics, setAnalytics] = useState<ReturnType<typeof storeManager.getQuizAnalytics> | null>(null);

  // Sync state
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Grading modal state
  const [gradingAttempt, setGradingAttempt] = useState<StudentQuizAttempt | null>(null);
  const [gradingScores, setGradingScores] = useState<Record<string, number>>({});
  const [gradingFeedbacks, setGradingFeedbacks] = useState<Record<string, string>>({});

  // Create Quiz Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState('CSE-3201');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTimeLimit, setNewTimeLimit] = useState(15);
  const [newOpenTime, setNewOpenTime] = useState(new Date().toISOString().slice(0, 16));
  const [newCloseTime, setNewCloseTime] = useState(
    new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [newShuffle, setNewShuffle] = useState(true);
  const [newQuestions, setNewQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q_new_1',
      type: 'MCQ',
      prompt: 'Which data structure is fundamentally used for bottom-up LR parser implementation?',
      points: 5,
      options: [
        { id: 'opt_1', text: 'Stack' },
        { id: 'opt_2', text: 'Queue' },
        { id: 'opt_3', text: 'Binary Search Tree' },
        { id: 'opt_4', text: 'Min-Heap' }
      ],
      correctOptionId: 'opt_1',
      explanation: 'LR parsers use a shift-reduce stack to maintain grammar symbols and state transitions.'
    },
    {
      id: 'q_new_2',
      type: 'SHORT_ANSWER',
      prompt: 'Explain the purpose of Left Factoring in predictive Top-Down LL(1) grammars.',
      points: 5,
      rubricHint: 'Look for eliminating common prefixes so the parser can deterministically choose productions on a single lookahead.',
      explanation: 'Left factoring eliminates common prefixes from grammar productions to prevent backtracking and allow single token lookahead selection.'
    }
  ]);

  const loadData = () => {
    const list = storeManager.getQuizzes();
    setQuizzes(list);

    const activeId = selectedQuizId || list[0]?.id || '';
    if (!selectedQuizId && activeId) {
      setSelectedQuizId(activeId);
    }

    if (activeId) {
      const atts = storeManager.getQuizAttempts(activeId);
      setAttempts(atts);
      const stats = storeManager.getQuizAnalytics(activeId);
      setAnalytics(stats);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedQuizId]);

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId);

  const handleSyncToContinuousAssessment = () => {
    if (!selectedQuiz) return;
    const res = storeManager.syncQuizToContinuousAssessment(selectedQuiz.id, selectedQuiz.courseCode);
    setSyncFeedback(res.message);
    loadData();
    setTimeout(() => setSyncFeedback(null), 6000);
  };

  const handleOpenGradingModal = (attempt: StudentQuizAttempt) => {
    setGradingAttempt(attempt);
    const initialScores: Record<string, number> = {};
    const initialFeedbacks: Record<string, string> = {};

    selectedQuiz?.questions.forEach((q) => {
      if (q.type === 'SHORT_ANSWER') {
        const ans = attempt.answers[q.id];
        initialScores[q.id] = ans?.teacherScore ?? Math.floor(q.points * 0.75);
        initialFeedbacks[q.id] = ans?.teacherFeedback || '';
      }
    });

    setGradingScores(initialScores);
    setGradingFeedbacks(initialFeedbacks);
  };

  const handleSaveGrading = () => {
    if (!gradingAttempt) return;

    Object.entries(gradingScores).forEach(([qId, score]) => {
      storeManager.gradeShortAnswer(gradingAttempt.id, qId, score, gradingFeedbacks[qId]);
    });

    setGradingAttempt(null);
    loadData();
  };

  const handleCreateQuizSubmit = () => {
    if (!newTitle.trim()) return;

    const totalMarks = newQuestions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);

    storeManager.createQuiz({
      courseCode: newCourseCode,
      courseTitle: newCourseCode === 'CSE-3201' ? 'Compiler Design & Construction' : 'Software Engineering',
      departmentId: 'CSE',
      title: newTitle.trim(),
      description: newDescription.trim() || 'Continuous assessment timed quiz.',
      teacherId,
      teacherName,
      timeLimitMinutes: Number(newTimeLimit) || 15,
      totalMarks,
      openTime: new Date(newOpenTime).toISOString(),
      closeTime: new Date(newCloseTime).toISOString(),
      shuffleQuestions: newShuffle,
      questions: newQuestions
    });

    setCreateModalOpen(false);
    loadData();
  };

  const handleAddQuestion = (type: QuizQuestionType) => {
    const newId = `q_custom_${Date.now()}`;
    if (type === 'MCQ') {
      setNewQuestions((prev) => [
        ...prev,
        {
          id: newId,
          type: 'MCQ',
          prompt: 'New multiple choice question prompt...',
          points: 5,
          options: [
            { id: 'opt_a', text: 'Option A' },
            { id: 'opt_b', text: 'Option B' },
            { id: 'opt_c', text: 'Option C' },
            { id: 'opt_d', text: 'Option D' }
          ],
          correctOptionId: 'opt_a',
          explanation: 'Standard conceptual explanation.'
        }
      ]);
    } else {
      setNewQuestions((prev) => [
        ...prev,
        {
          id: newId,
          type: 'SHORT_ANSWER',
          prompt: 'New short answer analytical question prompt...',
          points: 5,
          rubricHint: 'Evaluation key benchmarks and keywords.',
          explanation: 'Model expected explanation.'
        }
      ]);
    }
  };

  const handleRemoveQuestion = (idx: number) => {
    setNewQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <DashboardLayout portalTitle={isBn ? 'শিক্ষক পোর্টাল' : 'Teacher Portal'}>
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Header Banner */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 bg-[#EBF5FF] text-[#006A4E] rounded-md">
                  <HelpCircle className="w-5 h-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                  {isBn ? 'অনলাইন কুইজ ব্যবস্থাপনা ও মূল্যায়ন' : 'Online Quizzes & Continuous Assessment'}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#475569]">
                {isBn
                  ? 'টাইমড কুইজ তৈরি, এমসিকিউ অটো-গ্রেডিং, শর্ট অ্যানসার স্ক্রুটিনি এবং মার্কস শিটে ড্রাফট সিঙ্ক।'
                  : 'Author timed quizzes, auto-grade MCQs, grade short answers, and sync drafts to continuous assessment.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCreateModalOpen(true)}
                className="bg-[#006A4E] hover:bg-[#00523C] text-xs"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                {isBn ? 'নতুন কুইজ তৈরি করুন' : 'Create New Quiz'}
              </Button>
            </div>
          </div>

          {/* Quiz Selector Row */}
          <div className="mt-5 pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="teacher-quiz-select" className="text-xs font-semibold text-[#64748B] shrink-0">
                {isBn ? 'কুইজ নির্বাচন:' : 'Select Quiz:'}
              </label>
              <select
                id="teacher-quiz-select"
                aria-label="Select Quiz to Manage"
                value={selectedQuizId}
                onChange={(e) => setSelectedQuizId(e.target.value)}
                className="px-3 py-1.5 text-xs sm:text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[#0F172A] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#006A4E]"
              >
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    [{q.courseCode}] {q.title} ({q.questions.length} Qs, {q.totalMarks} Marks)
                  </option>
                ))}
              </select>
            </div>

            {selectedQuiz && (
              <div className="flex items-center gap-2 text-xs">
                <Badge
                  variant={
                    Date.now() <= new Date(selectedQuiz.closeTime).getTime() &&
                    Date.now() >= new Date(selectedQuiz.openTime).getTime()
                      ? 'warning'
                      : Date.now() > new Date(selectedQuiz.closeTime).getTime()
                      ? 'neutral'
                      : 'primary'
                  }
                >
                  {Date.now() <= new Date(selectedQuiz.closeTime).getTime() &&
                  Date.now() >= new Date(selectedQuiz.openTime).getTime()
                    ? 'Active Window (Live)'
                    : Date.now() > new Date(selectedQuiz.closeTime).getTime()
                    ? 'Window Closed'
                    : 'Upcoming'}
                </Badge>
                {selectedQuiz.shuffleQuestions && (
                  <span className="text-[#64748B] flex items-center gap-1 font-mono text-[11px]">
                    <Shuffle className="w-3 h-3 text-[#006A4E]" /> Shuffled
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sync to Continuous Assessment Toast Feedback */}
        {syncFeedback && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-medium animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
            <button
              onClick={() => setSyncFeedback(null)}
              className="text-xs underline hover:opacity-80 cursor-pointer ml-3"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Selected Quiz Details and Analytics */}
        {selectedQuiz && (
          <div className="space-y-6">
            {/* High-Level Result Analytics Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card className="p-4 border border-[#E2E8F0] bg-white">
                <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Average Score
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-[#0F172A]">
                    {analytics?.averageScore ?? 0}
                  </span>
                  <span className="text-xs text-[#64748B]">/ {selectedQuiz.totalMarks}</span>
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">Across submitted student attempts</div>
              </Card>

              <Card className="p-4 border border-[#E2E8F0] bg-white">
                <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Highest / Lowest
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-emerald-700">
                    {analytics?.highestScore ?? 0}
                  </span>
                  <span className="text-xs text-[#64748B]">/ {analytics?.lowestScore ?? 0}</span>
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">Peak and lowest recorded mark</div>
              </Card>

              <Card className="p-4 border border-[#E2E8F0] bg-white">
                <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Submissions
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-[#0F172A]">{attempts.length}</span>
                  <span className="text-xs text-[#64748B]">students</span>
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">Single attempt enforced</div>
              </Card>

              <Card className="p-4 border border-[#E2E8F0] bg-white flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Continuous Assessment
                  </div>
                  <div className="text-xs text-[#0F172A] font-semibold mt-1">Class Tests Column</div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSyncToContinuousAssessment}
                  className="mt-2 text-xs w-full bg-blue-700 hover:bg-blue-600"
                >
                  <FileCheck className="w-3.5 h-3.5 mr-1" /> Sync to CA as DRAFT
                </Button>
              </Card>
            </div>

            {/* Per-Question Difficulty Breakdown */}
            <Card className="p-6 border border-[#E2E8F0] bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                <div>
                  <h3 className="font-bold text-[#0F172A] flex items-center gap-2 text-sm sm:text-base">
                    <BarChart3 className="w-4 h-4 text-[#006A4E]" />
                    Per-Question Difficulty Analysis
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Empirical difficulty based on student correctness rate and rubric mastery
                  </p>
                </div>
                <span className="text-xs text-[#64748B]">
                  {selectedQuiz.questions.length} Items &bull; {selectedQuiz.totalMarks} Total Marks
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {analytics?.questionStats.map((stat, idx) => {
                  return (
                    <div
                      key={stat.questionId}
                      className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#006A4E]">Q{idx + 1} &bull; {stat.type}</span>
                          <span className="font-semibold text-slate-700">{stat.points} Marks</span>
                        </div>
                        <p className="text-xs text-[#0F172A] font-medium line-clamp-2">{stat.prompt}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-500">Success Rate: </span>
                          <span className="font-mono font-bold text-slate-800">{stat.successRate}%</span>
                          <span className="text-[11px] text-slate-400 ml-1">
                            ({stat.correctOrHighScoreCount}/{stat.totalAttempts})
                          </span>
                        </div>

                        <Badge
                          variant={
                            stat.difficultyLabel === 'Easy'
                              ? 'success'
                              : stat.difficultyLabel === 'Moderate'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {stat.difficultyLabel}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Student Submissions & Short Answer Grading Queue */}
            <Card className="overflow-hidden border border-[#E2E8F0] bg-white">
              <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#0F172A] text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#006A4E]" />
                    Student Submissions & Evaluation Queue
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    MCQs are automatically graded. Grade short answers to finalize marks.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#006A4E]">
                  {attempts.length} attempts recorded
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#475569] uppercase font-semibold border-b border-[#E2E8F0]">
                    <tr>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Submitted At</th>
                      <th className="px-4 py-3 text-center">MCQ Auto-Score</th>
                      <th className="px-4 py-3 text-center">Short Answer</th>
                      <th className="px-4 py-3 text-center">Total Score</th>
                      <th className="px-4 py-3 text-center">CA Synced</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {attempts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500 italic">
                          No student submissions recorded for this quiz yet.
                        </td>
                      </tr>
                    ) : (
                      attempts.map((att) => {
                        const hasShortAnswer = selectedQuiz.questions.some((q) => q.type === 'SHORT_ANSWER');

                        return (
                          <tr key={att.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                            <td className="px-4 py-3">
                              <div className="font-bold text-[#0F172A]">{att.studentName}</div>
                              <div className="text-[11px] font-mono text-[#64748B]">{att.studentId}</div>
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {att.submittedAt ? new Date(att.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'In Progress'}
                            </td>
                            <td className="px-4 py-3 text-center font-mono font-bold text-slate-800">
                              {att.autoScore}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {!hasShortAnswer ? (
                                <span className="text-[11px] text-slate-400">—</span>
                              ) : att.isFullyGraded ? (
                                <span className="font-mono font-bold text-emerald-700">
                                  {att.manualScore}
                                </span>
                              ) : (
                                <Badge variant="warning">Needs Grading</Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="font-bold text-sm text-[#006A4E]">
                                {att.totalScore ?? att.autoScore} / {selectedQuiz.totalMarks}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {att.syncedToContinuousAssessment ? (
                                <Badge variant="success">
                                  <Check className="w-3 h-3 mr-1" /> Draft Synced
                                </Badge>
                              ) : (
                                <Badge variant="neutral">Not Synced</Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {hasShortAnswer && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenGradingModal(att)}
                                  className="h-7 text-xs"
                                >
                                  {att.isFullyGraded ? 'Review / Edit' : 'Grade Short Answer'}
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Short Answer Grading Modal */}
        {gradingAttempt && selectedQuiz && (
          <Modal
            isOpen={!!gradingAttempt}
            onClose={() => setGradingAttempt(null)}
            title={`Grade Short Answers: ${gradingAttempt.studentName} (${gradingAttempt.studentId})`}
            maxWidth="lg"
          >
            <div className="space-y-5 max-h-[75vh] overflow-y-auto px-1">
              <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-xs text-[#475569]">
                Review the student's written response, assign points up to the question limit, and write constructive feedback.
              </div>

              {selectedQuiz.questions
                .filter((q) => q.type === 'SHORT_ANSWER')
                .map((q) => {
                  const ans = gradingAttempt.answers[q.id];

                  return (
                    <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-[#006A4E]">Short Answer Question</span>
                          <span className="font-bold text-slate-700">Max Marks: {q.points}</span>
                        </div>
                        <h4 className="font-bold text-sm text-[#0F172A]">{q.prompt}</h4>
                        {q.rubricHint && (
                          <p className="text-[11px] text-slate-500 mt-1 bg-slate-50 p-2 rounded border border-slate-200">
                            <span className="font-semibold">Rubric Guide:</span> {q.rubricHint}
                          </p>
                        )}
                      </div>

                      {/* Student's actual response */}
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                        <span className="font-bold text-slate-700">Student's Submitted Text:</span>
                        <p className="mt-1 text-slate-900 font-mono italic whitespace-pre-wrap">
                          {ans?.shortAnswerText || 'No text submitted.'}
                        </p>
                      </div>

                      {/* Score Input and Teacher Comments */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div>
                          <label
                            htmlFor={`grade-score-${q.id}`}
                            className="block text-xs font-semibold text-slate-700 mb-1"
                          >
                            Awarded Marks (0 - {q.points})
                          </label>
                          <input
                            id={`grade-score-${q.id}`}
                            aria-label={`Awarded Marks for ${q.prompt}`}
                            type="number"
                            min={0}
                            max={q.points}
                            value={gradingScores[q.id] ?? 0}
                            onChange={(e) =>
                              setGradingScores((prev) => ({
                                ...prev,
                                [q.id]: Math.min(q.points, Math.max(0, Number(e.target.value)))
                              }))
                            }
                            className="w-full p-2 text-xs sm:text-sm border border-slate-300 rounded-lg font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor={`grade-feedback-${q.id}`}
                            className="block text-xs font-semibold text-slate-700 mb-1"
                          >
                            Teacher Feedback
                          </label>
                          <input
                            id={`grade-feedback-${q.id}`}
                            aria-label={`Teacher Feedback for ${q.prompt}`}
                            type="text"
                            value={gradingFeedbacks[q.id] || ''}
                            onChange={(e) =>
                              setGradingFeedbacks((prev) => ({
                                ...prev,
                                [q.id]: e.target.value
                              }))
                            }
                            placeholder="e.g. Excellent explanation of regression risks."
                            className="w-full p-2 text-xs sm:text-sm border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setGradingAttempt(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveGrading} className="bg-emerald-600 hover:bg-emerald-500">
                  <Check className="w-4 h-4 mr-1.5" /> Save Evaluation & Update Score
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Create Quiz Modal */}
        {createModalOpen && (
          <Modal
            isOpen={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            title="Create New Online Quiz"
            maxWidth="xl"
          >
            <div className="space-y-5 max-h-[75vh] overflow-y-auto px-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="new-course-select" className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Course
                  </label>
                  <select
                    id="new-course-select"
                    aria-label="Assigned Course"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="CSE-3201">CSE-3201 (Compiler Design)</option>
                    <option value="CSE-3205">CSE-3205 (Software Engineering)</option>
                    <option value="CSE-1101">CSE-1101 (Structured Programming)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="new-time-limit" className="block text-xs font-semibold text-slate-700 mb-1">
                    Time Limit (Minutes)
                  </label>
                  <input
                    id="new-time-limit"
                    aria-label="Time Limit in Minutes"
                    type="number"
                    min={5}
                    max={120}
                    value={newTimeLimit}
                    onChange={(e) => setNewTimeLimit(Number(e.target.value))}
                    className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <Input
                label="Quiz Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Syntax Analysis & Context-Free Grammars"
                required
              />

              <div>
                <label htmlFor="new-description" className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Coverage
                </label>
                <textarea
                  id="new-description"
                  aria-label="Description & Coverage"
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Topics assessed, instructions, and continuous assessment weightage..."
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="new-open-time" className="block text-xs font-semibold text-slate-700 mb-1">
                    Open Time
                  </label>
                  <input
                    id="new-open-time"
                    aria-label="Quiz Open Time"
                    type="datetime-local"
                    value={newOpenTime}
                    onChange={(e) => setNewOpenTime(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="new-close-time" className="block text-xs font-semibold text-slate-700 mb-1">
                    Close Time
                  </label>
                  <input
                    id="new-close-time"
                    aria-label="Quiz Close Time"
                    type="datetime-local"
                    value={newCloseTime}
                    onChange={(e) => setNewCloseTime(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  id="shuffle-toggle"
                  checked={newShuffle}
                  onChange={(e) => setNewShuffle(e.target.checked)}
                  className="w-4 h-4 text-[#006A4E] rounded"
                />
                <label htmlFor="shuffle-toggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Shuffle Question Order for Each Student Session
                </label>
              </div>

              {/* Questions List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                    Questions ({newQuestions.length} Items &bull; Total Marks:{' '}
                    {newQuestions.reduce((s, q) => s + (Number(q.points) || 0), 0)})
                  </h4>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleAddQuestion('MCQ')} className="text-xs">
                      + Add MCQ
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleAddQuestion('SHORT_ANSWER')} className="text-xs">
                      + Add Short Answer
                    </Button>
                  </div>
                </div>

                {newQuestions.map((q, idx) => (
                  <div key={q.id} className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#006A4E]">
                        Q{idx + 1} &bull; {q.type === 'MCQ' ? 'Multiple Choice' : 'Short Answer'}
                      </span>
                      <div className="flex items-center gap-2">
                        <label htmlFor={`question-points-${idx}`} className="text-slate-500">Points:</label>
                        <input
                          id={`question-points-${idx}`}
                          aria-label={`Points for Question ${idx + 1}`}
                          type="number"
                          min={1}
                          max={20}
                          value={q.points}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setNewQuestions((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, points: val } : item))
                            );
                          }}
                          className="w-14 p-1 border rounded text-center font-bold text-xs"
                        />
                        {newQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(idx)}
                            className="text-rose-600 hover:text-rose-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      aria-label={`Prompt for Question ${idx + 1}`}
                      value={q.prompt}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewQuestions((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, prompt: val } : item))
                        );
                      }}
                      className="w-full p-2 border border-slate-300 rounded text-xs"
                      placeholder="Question prompt..."
                    />
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleCreateQuizSubmit} className="bg-[#006A4E] hover:bg-[#00523C]">
                  <Sparkles className="w-4 h-4 mr-1.5" /> Publish Quiz
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};
