import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Modal } from '../../../components/common/Modal';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../../services/shared/sharedDataStore';
import { EvaluationWindow, EvaluationCriteriaRating } from '../../../types/evaluation';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  BookOpen,
  Send,
  EyeOff,
  Sparkles
} from 'lucide-react';

interface EnrolledCourseItem {
  code: string;
  title: string;
  titleBn: string;
  departmentId: string;
  teacherId: string;
  teacherName: string;
  teacherDesignation: string;
}

export const StudentEvaluationsPage: React.FC = () => {
  const { user, profile, claims } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const storeManager = SharedDataStoreManager.getInstance();
  const studentId = claims?.studentId || (profile as { studentId?: string })?.studentId || 'JSTU2026001';

  const [activeWindow, setActiveWindow] = useState<EvaluationWindow | null>(null);
  const [windows, setWindows] = useState<EvaluationWindow[]>([]);
  const [selectedWindowId, setSelectedWindowId] = useState<string>('');
  const [submissionStatus, setSubmissionStatus] = useState<Record<string, boolean>>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Modal evaluation state
  const [activeCourse, setActiveCourse] = useState<EnrolledCourseItem | null>(null);
  const [ratings, setRatings] = useState<EvaluationCriteriaRating>({
    preparation: 5,
    punctuality: 5,
    engagement: 5,
    practicals: 5,
    fairness: 5,
    overall: 5
  });
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Student's semester courses
  const enrolledCourses: EnrolledCourseItem[] = [
    {
      code: 'CSE-3201',
      title: 'Compiler Design & Construction',
      titleBn: 'কম্পাইলার ডিজাইন ও কনস্ট্রাকশন',
      departmentId: 'CSE',
      teacherId: 'teacher_shahadat',
      teacherName: 'Dr. Shahadat Hossain',
      teacherDesignation: 'Associate Professor'
    },
    {
      code: 'CSE-3205',
      title: 'Software Engineering & Design Patterns',
      titleBn: 'সফটওয়্যার ইঞ্জিনিয়ারিং ও ডিজাইন প্যাটার্নস',
      departmentId: 'CSE',
      teacherId: 'teacher_shahadat',
      teacherName: 'Dr. Shahadat Hossain',
      teacherDesignation: 'Associate Professor'
    },
    {
      code: 'CSE-1101',
      title: 'Introduction to Computer Science & Problem Solving',
      titleBn: 'কম্পিউটার বিজ্ঞান পরিচিতি ও সমস্যা সমাধান',
      departmentId: 'CSE',
      teacherId: 'teacher_shahadat',
      teacherName: 'Dr. Shahadat Hossain',
      teacherDesignation: 'Associate Professor'
    }
  ];

  const loadEvaluations = () => {
    const allWindows = storeManager.getEvaluationWindows();
    setWindows(allWindows);
    const active = storeManager.getActiveEvaluationWindow();
    setActiveWindow(active || null);

    const windowId = selectedWindowId || active?.id || (allWindows[0]?.id ?? '');
    setSelectedWindowId(windowId);

    // Compute status map for enrolled courses
    const statusMap: Record<string, boolean> = {};
    enrolledCourses.forEach((course) => {
      statusMap[course.code] = storeManager.hasStudentSubmittedCourse(windowId, course.code, studentId);
    });
    setSubmissionStatus(statusMap);
  };

  useEffect(() => {
    loadEvaluations();
  }, [selectedWindowId, studentId]);

  const handleOpenModal = (course: EnrolledCourseItem) => {
    setActiveCourse(course);
    setRatings({
      preparation: 5,
      punctuality: 5,
      engagement: 5,
      practicals: 5,
      fairness: 5,
      overall: 5
    });
    setComment('');
  };

  const handleCloseModal = () => {
    setActiveCourse(null);
  };

  const handleSubmitEvaluation = () => {
    if (!activeCourse || !selectedWindowId) return;

    setIsSubmitting(true);
    try {
      const res = storeManager.submitAnonymousEvaluation({
        windowId: selectedWindowId,
        courseCode: activeCourse.code,
        courseTitle: activeCourse.title,
        departmentId: activeCourse.departmentId,
        teacherId: activeCourse.teacherId,
        teacherName: activeCourse.teacherName,
        studentId, // Detached ledger check
        ratings,
        comment: comment.trim() || undefined
      });

      if (res.success) {
        setSuccessToast(
          isBn
            ? `${activeCourse.code} কোর্সের জন্য আপনার মূল্যায়ন সম্পূর্ণ বেনামে সফলভাবে জমা হয়েছে!`
            : `Your evaluation for ${activeCourse.code} was submitted completely anonymously!`
        );
        handleCloseModal();
        loadEvaluations();
        setTimeout(() => setSuccessToast(null), 5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const criteriaLabels = [
    {
      key: 'preparation' as keyof EvaluationCriteriaRating,
      title: 'Course Preparation & Clarity',
      titleBn: 'কোর্স প্রস্তুতি ও বিষয়বস্তুর স্পষ্টতা',
      desc: 'Instructor is well prepared with syllabus and delivers concepts systematically.'
    },
    {
      key: 'punctuality' as keyof EvaluationCriteriaRating,
      title: 'Punctuality & Routine Adherence',
      titleBn: 'সময়ানুবর্তিতা ও সময়সূচি মেনে চলা',
      desc: 'Instructor starts and finishes classes on time, maintaining scheduled routine.'
    },
    {
      key: 'engagement' as keyof EvaluationCriteriaRating,
      title: 'Student Engagement & Interaction',
      titleBn: 'শিক্ষার্থীদের অংশগ্রহণ ও ক্লাসে মিথস্ক্রিয়া',
      desc: 'Encourages questions, fosters critical thinking, and creates an inclusive environment.'
    },
    {
      key: 'practicals' as keyof EvaluationCriteriaRating,
      title: 'Practical, Lab & Assignment Relevance',
      titleBn: 'ল্যাব ও ব্যবহারিক অ্যাসাইনমেন্টের প্রাসঙ্গিকতা',
      desc: 'Provides meaningful assignments, hands-on lab guidance, and timely reviews.'
    },
    {
      key: 'fairness' as keyof EvaluationCriteriaRating,
      title: 'Fairness & Transparency in Assessment',
      titleBn: 'মূল্যায়নে ন্যায়পরায়ণতা ও স্বচ্ছতা',
      desc: 'Fair grading in exams, quizzes, and constructive feedback on performance.'
    },
    {
      key: 'overall' as keyof EvaluationCriteriaRating,
      title: 'Overall Teaching Effectiveness',
      titleBn: 'সার্বিক পাঠদান কার্যকারিতা',
      desc: 'Overall satisfaction with teaching quality and contribution to academic growth.'
    }
  ];

  const currentWindowObj = windows.find((w) => w.id === selectedWindowId) || activeWindow;

  return (
    <DashboardLayout portalTitle={isBn ? 'শিক্ষার্থী পোর্টাল' : 'Student Portal'}>
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Header Banner */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 bg-[#EBF5FF] text-[#006A4E] rounded-md">
                  <Star className="w-5 h-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                  {isBn ? 'কোর্স ও শিক্ষক মূল্যায়ন' : 'Course & Teacher Evaluation'}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#475569]">
                {isBn
                  ? 'আইকিউএসি (IQAC) পরিচালিত গোপনীয় ও সম্পূর্ণ বেনামী ফিডব্যাক ব্যবস্থা।'
                  : 'IQAC-administered anonymous academic evaluation to enhance educational quality.'}
              </p>
            </div>

            {/* Window selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="window-select" className="text-xs font-semibold text-[#475569] shrink-0">
                {isBn ? 'সেমিস্টার সেশন:' : 'Window:'}
              </label>
              <select
                id="window-select"
                aria-label="Evaluation Window Selector"
                value={selectedWindowId}
                onChange={(e) => setSelectedWindowId(e.target.value)}
                className="px-3 py-1.5 text-xs sm:text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[#0F172A] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#006A4E]"
              >
                {windows.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.semester} ({w.academicSession}) - {w.status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Privacy & Anonymity Guarantee Notice */}
          <div className="mt-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3.5 sm:p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#006A4E] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm space-y-1 text-[#334155]">
              <div className="font-semibold text-[#0F172A] flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-[#006A4E]" />
                {isBn ? 'সম্পূর্ণ বেনামী ও সুরক্ষিত সিস্টেম' : '100% Anonymous & Cryptographically Detached'}
              </div>
              <p>
                {isBn
                  ? 'আপনার কোনো পরিচয় (নাম, আইডি, ইমেইল বা আইপি) উত্তরের সাথে জমা হয় না। একই ছাত্র একাধিকবার যাতে ফর্ম জমা না দেয় তা নিশ্চিত করার জন্য শুধু একটি পৃথক লিজারে এককালীন ফ্ল্যাগ চিহ্নিত হয়। শিক্ষকরা কেবলমাত্র উইন্ডো সমাপ্ত হওয়ার পর এবং ন্যূনতম ৫টি মূল্যায়ন থাকলে গড় ফলাফল দেখতে পান।'
                  : 'Your student identity is NEVER stored with your ratings or written remarks. A separate one-time token prevents duplicate submissions without linking back to responses. Faculty members only view aggregated averages once the window closes with at least 5 responses.'}
              </p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successToast && (
          <div className="bg-[#EBF5FF] border border-[#006A4E]/30 text-[#006A4E] px-4 py-3 rounded-lg flex items-center justify-between text-sm font-medium animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-xs underline hover:opacity-80 cursor-pointer ml-3"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Window Status Banner */}
        {currentWindowObj && (
          <div
            className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              currentWindowObj.status === 'Open'
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 shrink-0" />
              <div>
                <span className="font-semibold text-sm">
                  {currentWindowObj.semester} ({currentWindowObj.academicSession})
                </span>
                <span className="mx-2 text-xs opacity-60">|</span>
                <span className="text-xs">
                  {isBn ? 'সময়সীমা:' : 'Closing Date:'}{' '}
                  {new Date(currentWindowObj.endDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <Badge variant={currentWindowObj.status === 'Open' ? 'success' : 'neutral'}>
              {currentWindowObj.status === 'Open' ? (isBn ? 'উইন্ডো উন্মুক্ত' : 'Window Active') : (isBn ? 'উইন্ডো সমাপ্ত' : 'Window Closed')}
            </Badge>
          </div>
        )}

        {/* Courses Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#006A4E]" />
              {isBn ? 'চলতি সেমিস্টারের তালিকাভুক্ত কোর্সসমূহ' : 'Courses Available for Evaluation'}
            </h2>
            <span className="text-xs text-[#64748B]">
              {Object.values(submissionStatus).filter(Boolean).length} / {enrolledCourses.length}{' '}
              {isBn ? 'সম্পন্ন' : 'completed'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCourses.map((course) => {
              const isSubmitted = !!submissionStatus[course.code];
              const isWindowOpen = currentWindowObj?.status === 'Open';

              return (
                <Card
                  key={course.code}
                  className="p-5 border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#334155]">
                          {course.code}
                        </span>
                        <h3 className="text-base font-bold text-[#0F172A] mt-1">
                          {isBn ? course.titleBn : course.title}
                        </h3>
                      </div>
                      {isSubmitted ? (
                        <Badge variant="success" className="shrink-0 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isBn ? 'মূল্যায়ন সম্পন্ন' : 'Evaluated'}
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="shrink-0 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {isBn ? 'অপেক্ষমাণ' : 'Pending'}
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-[#475569] bg-[#F8FAFC] p-2.5 rounded-lg border border-[#F1F5F9]">
                      <div className="font-medium text-[#0F172A]">{course.teacherName}</div>
                      <div className="text-[11px] text-[#64748B]">{course.teacherDesignation} • Department of {course.departmentId}</div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                    {isSubmitted ? (
                      <div className="text-xs text-[#006A4E] font-medium flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{isBn ? 'গোপন মতামত রেকর্ড করা হয়েছে' : 'Submitted anonymously'}</span>
                      </div>
                    ) : isWindowOpen ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenModal(course)}
                        className="w-full sm:w-auto ml-auto"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                        {isBn ? 'মূল্যায়ন শুরু করুন' : 'Evaluate Instructor'}
                      </Button>
                    ) : (
                      <span className="text-xs text-[#64748B] italic">
                        {isBn ? 'মূল্যায়ন উইন্ডো সমাপ্ত' : 'Window has closed'}
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Evaluation Modal */}
        {activeCourse && (
          <Modal
            isOpen={!!activeCourse}
            onClose={handleCloseModal}
            title={
              isBn
                ? `${activeCourse.code}: গোপনীয় কোর্স মূল্যায়ন`
                : `${activeCourse.code}: Confidential Course Evaluation`
            }
            maxWidth="xl"
          >
            <div className="space-y-6 max-h-[75vh] overflow-y-auto px-1">
              {/* Teacher and anonymity disclaimer */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#006A4E] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1 text-[#475569]">
                  <p className="font-semibold text-[#0F172A]">
                    {activeCourse.teacherName} ({activeCourse.teacherDesignation})
                  </p>
                  <p>
                    {isBn
                      ? 'এই মূল্যায়ন সম্পূর্ণ বেনামী। শিক্ষকদের জন্য আপনার নাম বা পরিচয় সম্পূর্ণ অপ্রকাশিত থাকবে।'
                      : 'Please provide honest, constructive feedback. The instructor only sees aggregate averages once the window closes.'}
                  </p>
                </div>
              </div>

              {/* 6 Criteria Scales (1 - 5) */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  {isBn ? 'রেটিং মানদণ্ড (১ থেকে ৫ স্কেল)' : 'Evaluation Criteria (1 to 5 Stars)'}
                </h4>

                {criteriaLabels.map((item, idx) => (
                  <div
                    key={item.key}
                    className="p-3.5 bg-white border border-[#E2E8F0] rounded-lg hover:border-[#CBD5E1] transition-colors space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <span className="text-xs font-bold text-[#0F172A]">
                          {idx + 1}. {isBn ? item.titleBn : item.title}
                        </span>
                        <p className="text-[11px] text-[#64748B] mt-0.5">{item.desc}</p>
                      </div>

                      {/* 1-5 Star Selection Buttons */}
                      <div className="flex items-center gap-1 self-start sm:self-center mt-2 sm:mt-0">
                        {[1, 2, 3, 4, 5].map((starValue) => {
                          const isSelected = ratings[item.key] >= starValue;
                          return (
                            <button
                              key={starValue}
                              type="button"
                              onClick={() =>
                                setRatings((prev) => ({
                                  ...prev,
                                  [item.key]: starValue
                                }))
                              }
                              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                isSelected
                                  ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                                  : 'text-slate-300 hover:text-slate-400 bg-slate-50'
                              }`}
                              title={`${starValue} of 5`}
                              aria-label={`Rate ${starValue} out of 5 for ${item.title}`}
                            >
                              <Star
                                className="w-4 h-4"
                                fill={isSelected ? 'currentColor' : 'none'}
                              />
                            </button>
                          );
                        })}
                        <span className="text-xs font-bold text-[#0F172A] w-6 text-center ml-1">
                          {ratings[item.key]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Qualitative Comment Box */}
              <div className="space-y-1.5">
                <label
                  htmlFor="eval-comment"
                  className="block text-xs font-bold text-[#0F172A]"
                >
                  {isBn
                    ? 'গঠনমূলক মন্তব্য ও পরামর্শ (ঐচ্ছিক)'
                    : 'Constructive Comments & Suggestions (Optional)'}
                </label>
                <textarea
                  id="eval-comment"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    isBn
                      ? 'শিক্ষকের শিক্ষাদান আরও উন্নত করতে গঠনমূলক মন্তব্য লিখুন (ব্যক্তিগত তথ্য উল্লেখ করবেন না)...'
                      : 'Share constructive feedback to help the instructor improve teaching methodologies (do not mention your personal identity)...'
                  }
                  className="w-full text-xs sm:text-sm p-3 border border-[#CBD5E1] rounded-lg bg-white text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#006A4E]"
                />
                <p className="text-[11px] text-[#64748B]">
                  {isBn
                    ? 'মন্তব্যে আপনার নাম, রোল বা রোল সম্পর্কিত তথ্য উল্লেখ করা থেকে বিরত থাকুন।'
                    : 'Remember that instructors view these comments verbatim. Do not include identifiable self-references.'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmitEvaluation}
                  disabled={isSubmitting}
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {isSubmitting
                    ? isBn
                      ? 'জমা হচ্ছে...'
                      : 'Submitting...'
                    : isBn
                    ? 'বেনামে মূল্যায়ন জমা দিন'
                    : 'Submit Anonymous Evaluation'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};
