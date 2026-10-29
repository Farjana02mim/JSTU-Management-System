import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Modal } from '../../../components/common/Modal';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../../services/shared/sharedDataStore';
import { Quiz, StudentQuizAttempt, QuizQuestion } from '../../../types/quiz';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Play,
  RotateCcw,
  ShieldAlert,
  Lock,
  Award,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Send,
  Timer
} from 'lucide-react';

export const StudentQuizzesPage: React.FC = () => {
  const { user, profile, claims } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const storeManager = SharedDataStoreManager.getInstance();
  const studentId = claims?.studentId || (profile as { studentId?: string })?.studentId || 'JSTU2026001';
  const studentName = profile?.fullName || user?.displayName || 'Tanvir Ahmed';

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL');
  const [attemptsMap, setAttemptsMap] = useState<Record<string, StudentQuizAttempt>>({});

  // Active taking state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<StudentQuizAttempt | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Review modal state
  const [reviewingQuiz, setReviewingQuiz] = useState<Quiz | null>(null);
  const [reviewingAttempt, setReviewingAttempt] = useState<StudentQuizAttempt | null>(null);

  const loadData = () => {
    const all = storeManager.getQuizzes();
    setQuizzes(all);

    const map: Record<string, StudentQuizAttempt> = {};
    all.forEach((q) => {
      const att = storeManager.getStudentQuizAttempt(q.id, studentId);
      if (att) map[q.id] = att;
    });
    setAttemptsMap(map);
  };

  useEffect(() => {
    loadData();
  }, [studentId]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!activeQuiz || !currentAttempt || currentAttempt.isSubmitted) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeQuiz, currentAttempt]);

  const handleStartQuiz = (quiz: Quiz) => {
    // Check if attempt exists
    const existing = storeManager.getStudentQuizAttempt(quiz.id, studentId);
    if (existing && existing.isSubmitted) return;

    const attempt = storeManager.startQuizAttempt(quiz.id, studentId, studentName);

    // Shuffle questions if required
    let qs = [...quiz.questions];
    if (quiz.shuffleQuestions) {
      qs = qs.sort(() => Math.sin(Number(quiz.id.slice(-4)) || 0.5) - 0.5);
    }
    setShuffledQuestions(qs);

    // Calculate remaining seconds based on start time and timeLimitMinutes
    const startTime = new Date(attempt.startedAt).getTime();
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const totalAllowedSeconds = quiz.timeLimitMinutes * 60;
    const remaining = Math.max(0, totalAllowedSeconds - elapsedSeconds);

    if (remaining <= 0) {
      // Auto-submit if time already expired
      storeManager.submitQuizAttempt(attempt.id);
      loadData();
      return;
    }

    setSecondsRemaining(remaining);
    setActiveQuiz(quiz);
    setCurrentAttempt(attempt);
    setActiveQuestionIndex(0);
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (!currentAttempt || currentAttempt.isSubmitted) return;

    setAutoSaveStatus('saving');
    storeManager.saveStudentQuizAnswer(currentAttempt.id, questionId, {
      selectedOptionId: optionId
    });

    // Update local state
    setCurrentAttempt((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: {
            ...prev.answers[questionId],
            questionId,
            selectedOptionId: optionId
          }
        }
      };
    });

    setTimeout(() => setAutoSaveStatus('saved'), 350);
  };

  const handleShortAnswerChange = (questionId: string, text: string) => {
    if (!currentAttempt || currentAttempt.isSubmitted) return;

    setAutoSaveStatus('saving');
    storeManager.saveStudentQuizAnswer(currentAttempt.id, questionId, {
      shortAnswerText: text
    });

    setCurrentAttempt((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: {
            ...prev.answers[questionId],
            questionId,
            shortAnswerText: text
          }
        }
      };
    });

    setTimeout(() => setAutoSaveStatus('saved'), 500);
  };

  const handleAutoSubmit = () => {
    if (!currentAttempt) return;
    storeManager.submitQuizAttempt(currentAttempt.id);
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveQuiz(null);
    setCurrentAttempt(null);
    setConfirmSubmitOpen(false);
    loadData();
  };

  const handleManualSubmit = () => {
    if (!currentAttempt) return;
    storeManager.submitQuizAttempt(currentAttempt.id);
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveQuiz(null);
    setCurrentAttempt(null);
    setConfirmSubmitOpen(false);
    loadData();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredQuizzes = quizzes.filter(
    (q) => selectedCourse === 'ALL' || q.courseCode === selectedCourse
  );

  return (
    <DashboardLayout portalTitle={isBn ? 'শিক্ষার্থী পোর্টাল' : 'Student Portal'}>
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Active Quiz Taking Modal/Interface */}
        {activeQuiz && currentAttempt && !currentAttempt.isSubmitted && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
              {/* Top Countdown Bar */}
              <div className="bg-[#0F172A] text-white px-5 py-3.5 flex items-center justify-between gap-3 border-b border-slate-800">
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    {activeQuiz.courseCode} &bull; Timed Online Quiz
                  </div>
                  <h2 className="text-sm sm:text-base font-bold truncate">
                    {isBn ? activeQuiz.titleBn || activeQuiz.title : activeQuiz.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm sm:text-base ${
                      secondsRemaining <= 120
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-slate-800 text-amber-300 border border-slate-700'
                    }`}
                  >
                    <Timer className="w-4 h-4" />
                    <span>{formatTimer(secondsRemaining)}</span>
                  </div>

                  <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                    {autoSaveStatus === 'saving' ? (
                      <span className="text-amber-400">Saving...</span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Saved
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Progress and Question Navigator */}
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between gap-2 overflow-x-auto">
                <div className="flex items-center gap-1.5">
                  {shuffledQuestions.map((q, idx) => {
                    const ans = currentAttempt.answers[q.id];
                    const isAnswered = q.type === 'MCQ' ? !!ans?.selectedOptionId : !!ans?.shortAnswerText?.trim();
                    const isCurrent = idx === activeQuestionIndex;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setActiveQuestionIndex(idx)}
                        className={`w-7 h-7 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          isCurrent
                            ? 'bg-[#006A4E] text-white shadow-xs ring-2 ring-[#006A4E]/30'
                            : isAnswered
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs text-[#64748B] font-medium shrink-0">
                  Question {activeQuestionIndex + 1} of {shuffledQuestions.length}
                </span>
              </div>

              {/* Question Body */}
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {shuffledQuestions[activeQuestionIndex] && (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF5FF] text-[#006A4E] mb-2">
                          {shuffledQuestions[activeQuestionIndex].type === 'MCQ' ? 'Multiple Choice' : 'Short Answer'} &bull; {shuffledQuestions[activeQuestionIndex].points} Marks
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-[#0F172A] leading-relaxed">
                          {isBn && shuffledQuestions[activeQuestionIndex].promptBn
                            ? shuffledQuestions[activeQuestionIndex].promptBn
                            : shuffledQuestions[activeQuestionIndex].prompt}
                        </h3>
                      </div>
                    </div>

                    {/* MCQ Options */}
                    {shuffledQuestions[activeQuestionIndex].type === 'MCQ' && (
                      <div className="space-y-2.5 pt-2">
                        {shuffledQuestions[activeQuestionIndex].options?.map((opt) => {
                          const isSelected =
                            currentAttempt.answers[shuffledQuestions[activeQuestionIndex].id]?.selectedOptionId === opt.id;

                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleSelectOption(shuffledQuestions[activeQuestionIndex].id, opt.id)}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                isSelected
                                  ? 'bg-emerald-50 border-[#006A4E] text-[#006A4E] shadow-2xs ring-1 ring-[#006A4E]'
                                  : 'bg-white border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC]'
                              }`}
                            >
                              <span>{isBn && opt.textBn ? opt.textBn : opt.text}</span>
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                  isSelected ? 'border-[#006A4E] bg-[#006A4E] text-white' : 'border-slate-300'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Short Answer Input */}
                    {shuffledQuestions[activeQuestionIndex].type === 'SHORT_ANSWER' && (
                      <div className="space-y-2 pt-2">
                        <textarea
                          rows={5}
                          value={currentAttempt.answers[shuffledQuestions[activeQuestionIndex].id]?.shortAnswerText || ''}
                          onChange={(e) => handleShortAnswerChange(shuffledQuestions[activeQuestionIndex].id, e.target.value)}
                          placeholder={isBn ? 'আপনার উত্তর এখানে লিখুন...' : 'Type your answer clearly here...'}
                          className="w-full p-3.5 border border-[#CBD5E1] rounded-xl text-xs sm:text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#006A4E]"
                        />
                        <p className="text-[11px] text-[#64748B]">
                          {isBn
                            ? 'আপনার উত্তর লেখার সাথে সাথে স্বয়ংক্রিয়ভাবে সংরক্ষিত হচ্ছে।'
                            : 'Answers are auto-saved in real-time.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Navigation & Submit Bar */}
              <div className="bg-[#F8FAFC] border-t border-slate-200 px-5 py-3.5 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activeQuestionIndex === 0}
                  onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>

                <div className="flex items-center gap-2">
                  {activeQuestionIndex < shuffledQuestions.length - 1 ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveQuestionIndex((prev) => Math.min(shuffledQuestions.length - 1, prev + 1))}
                    >
                      Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setConfirmSubmitOpen(true)}
                      className="bg-emerald-600 hover:bg-emerald-500"
                    >
                      <Send className="w-4 h-4 mr-1.5" /> Submit Quiz
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Confirmation Modal */}
        {confirmSubmitOpen && (
          <Modal
            isOpen={confirmSubmitOpen}
            onClose={() => setConfirmSubmitOpen(false)}
            title={isBn ? 'কুইজ জমা নিশ্চিতকরণ' : 'Submit Quiz Confirmation'}
            maxWidth="md"
          >
            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <p className="font-bold">Are you ready to submit your attempt?</p>
                  <p>
                    {isBn
                      ? 'একবার জমা দিলে আপনি আর কোনো উত্তর পরিবর্তন করতে পারবেন না। এই কুইজে শুধুমাত্র একটি প্রচেষ্টার অনুমতি রয়েছে।'
                      : 'Once submitted, you cannot modify your answers. Only one attempt is permitted for this quiz.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <Button variant="outline" size="sm" onClick={() => setConfirmSubmitOpen(false)}>
                  Continue Quiz
                </Button>
                <Button variant="primary" size="sm" onClick={handleManualSubmit} className="bg-emerald-600 hover:bg-emerald-500">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Yes, Submit Now
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Student Quizzes Header Banner */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 bg-[#EBF5FF] text-[#006A4E] rounded-md">
                  <HelpCircle className="w-5 h-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                  {isBn ? 'অনলাইন কুইজ ও ক্লাস টেস্ট' : 'Online Quizzes & Timed Assessments'}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#475569]">
                {isBn
                  ? 'কোর্স শিক্ষকদের পরিচালিত নির্ধারিত সময়ের মূল্যায়ন ও স্বয়ংক্রিয় গ্রেডিং সিস্টেম।'
                  : 'Continuous assessment quizzes with live countdown timers, auto-grading, and draft tabulation.'}
              </p>
            </div>

            {/* Course Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="course-quiz-filter" className="text-xs font-semibold text-[#475569] shrink-0">
                {isBn ? 'কোর্স:' : 'Course:'}
              </label>
              <select
                id="course-quiz-filter"
                aria-label="Filter quizzes by course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-3 py-1.5 text-xs sm:text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[#0F172A] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#006A4E]"
              >
                <option value="ALL">All Enrolled Courses</option>
                <option value="CSE-3201">CSE-3201 (Compiler Design)</option>
                <option value="CSE-3205">CSE-3205 (Software Engineering)</option>
                <option value="CSE-1101">CSE-1101 (Structured Programming)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quiz Cards Grid */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#006A4E]" />
            {isBn ? 'কুইজ তালিকা' : 'Available & Completed Quizzes'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuizzes.map((quiz) => {
              const attempt = attemptsMap[quiz.id];
              const now = Date.now();
              const isOpen = now >= new Date(quiz.openTime).getTime() && now <= new Date(quiz.closeTime).getTime();
              const isClosed = now > new Date(quiz.closeTime).getTime();

              return (
                <Card
                  key={quiz.id}
                  className="p-5 border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#334155]">
                          {quiz.courseCode}
                        </span>
                        <h3 className="text-base font-bold text-[#0F172A] mt-1">
                          {isBn ? quiz.titleBn || quiz.title : quiz.title}
                        </h3>
                      </div>

                      {attempt?.isSubmitted ? (
                        <Badge variant="success">Completed</Badge>
                      ) : isOpen ? (
                        <Badge variant="warning">Open Now</Badge>
                      ) : isClosed ? (
                        <Badge variant="neutral">Closed</Badge>
                      ) : (
                        <Badge variant="primary">Upcoming</Badge>
                      )}
                    </div>

                    <p className="text-xs text-[#475569] line-clamp-2">
                      {isBn ? quiz.descriptionBn || quiz.description : quiz.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#64748B] bg-[#F8FAFC] p-2.5 rounded-lg border border-[#F1F5F9]">
                      <div>
                        <span className="font-semibold text-[#0F172A]">Time Limit:</span> {quiz.timeLimitMinutes} Mins
                      </div>
                      <div>
                        <span className="font-semibold text-[#0F172A]">Total Marks:</span> {quiz.totalMarks}
                      </div>
                      <div>
                        <span className="font-semibold text-[#0F172A]">Questions:</span> {quiz.questions.length} Items
                      </div>
                      <div>
                        <span className="font-semibold text-[#0F172A]">Closes:</span> {new Date(quiz.closeTime).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                    {attempt?.isSubmitted ? (
                      <div className="flex items-center justify-between w-full">
                        <div className="text-xs text-[#006A4E] font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            Score: {attempt.totalScore ?? attempt.autoScore} / {quiz.totalMarks}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReviewingQuiz(quiz);
                            setReviewingAttempt(attempt);
                          }}
                          className="h-8 text-xs"
                        >
                          Review Answers
                        </Button>
                      </div>
                    ) : isOpen ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStartQuiz(quiz)}
                        className="w-full sm:w-auto ml-auto bg-[#006A4E] hover:bg-[#00523C]"
                      >
                        <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                        {isBn ? 'কুইজ শুরু করুন' : 'Start Timed Quiz'}
                      </Button>
                    ) : (
                      <span className="text-xs text-[#64748B] italic">
                        {isClosed ? 'Window has closed' : 'Not yet open'}
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Review Modal with Answers Secrecy Check */}
        {reviewingQuiz && reviewingAttempt && (
          <Modal
            isOpen={!!reviewingQuiz}
            onClose={() => {
              setReviewingQuiz(null);
              setReviewingAttempt(null);
            }}
            title={`${reviewingQuiz.courseCode}: Quiz Performance Review`}
            maxWidth="xl"
          >
            <div className="space-y-5 max-h-[75vh] overflow-y-auto px-1">
              {/* Score Card Banner */}
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A]">{reviewingQuiz.title}</h4>
                  <p className="text-xs text-[#64748B]">Instructor: {reviewingQuiz.teacherName}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-[#006A4E]">
                    {reviewingAttempt.totalScore ?? reviewingAttempt.autoScore} / {reviewingQuiz.totalMarks}
                  </div>
                  <span className="text-[11px] text-[#64748B]">
                    {reviewingAttempt.isFullyGraded ? 'Final Evaluated Score' : 'MCQ Auto-Score (Pending Short Answer)'}
                  </span>
                </div>
              </div>

              {/* Secrecy Warning if Window is Still Open */}
              {Date.now() <= new Date(reviewingQuiz.closeTime).getTime() ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 space-y-1">
                    <p className="font-bold">Correct Answers Protected During Active Window</p>
                    <p>
                      {isBn
                        ? 'পরীক্ষার সততা নিশ্চিত করতে কুইজ উইন্ডো সমাপ্ত না হওয়া পর্যন্ত সঠিক উত্তর ও ব্যাখ্যা অপ্রকাশিত রাখা হয়েছে।'
                        : 'To uphold academic integrity for other participating students, correct answer keys and detailed explanations are sealed until the quiz window closes on ' +
                          new Date(reviewingQuiz.closeTime).toLocaleString() + '.'}
                    </p>
                  </div>
                </div>
              ) : (
                /* Unsealed Answers & Explanations when Closed */
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Quiz Window Closed — Full Explanations & Correct Keys Unlocked</span>
                  </div>

                  {reviewingQuiz.questions.map((q, idx) => {
                    const ans = reviewingAttempt.answers[q.id];
                    const isMCQ = q.type === 'MCQ';
                    const isCorrect = isMCQ && ans?.selectedOptionId === q.correctOptionId;

                    return (
                      <div
                        key={q.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-xs sm:text-sm text-[#0F172A]">
                            {idx + 1}. {q.prompt}
                          </h5>
                          <span className="text-xs font-bold text-[#64748B] shrink-0">
                            {q.points} Marks
                          </span>
                        </div>

                        {/* MCQ Review */}
                        {isMCQ ? (
                          <div className="space-y-2 pt-1">
                            {q.options?.map((opt) => {
                              const isStudentSelected = ans?.selectedOptionId === opt.id;
                              const isCorrectOption = q.correctOptionId === opt.id;

                              return (
                                <div
                                  key={opt.id}
                                  className={`p-2.5 rounded-lg text-xs flex items-center justify-between border ${
                                    isCorrectOption
                                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                      : isStudentSelected
                                      ? 'bg-rose-50 border-rose-300 text-rose-900 line-through'
                                      : 'bg-slate-50 border-slate-200 text-slate-600'
                                  }`}
                                >
                                  <span>{opt.text}</span>
                                  {isCorrectOption && (
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                      Correct Key
                                    </span>
                                  )}
                                  {isStudentSelected && !isCorrectOption && (
                                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                                      Your Choice
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          /* Short Answer Review */
                          <div className="space-y-2 pt-1 text-xs">
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                              <span className="font-bold text-slate-700">Your Submitted Answer:</span>
                              <p className="mt-1 text-slate-800 italic">
                                {ans?.shortAnswerText || 'No answer submitted.'}
                              </p>
                            </div>

                            {ans?.teacherScore !== undefined && (
                              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-emerald-900">Teacher Evaluation:</span>
                                  <span className="font-bold text-emerald-800">{ans.teacherScore} / {q.points} Marks</span>
                                </div>
                                {ans.teacherFeedback && (
                                  <p className="mt-1 text-emerald-800 italic">“{ans.teacherFeedback}”</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Pedagogical Explanation */}
                        {q.explanation && (
                          <div className="text-[11px] text-slate-600 bg-slate-100/70 p-2.5 rounded-lg border border-slate-200">
                            <span className="font-semibold text-slate-800">Explanation:</span> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setReviewingQuiz(null)}>
                  Close Review
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};
