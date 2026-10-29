import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../../services/shared/sharedDataStore';
import { CourseEvaluationSummary, EvaluationWindow } from '../../../types/evaluation';
import {
  Star,
  Lock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  MessageSquare,
  BarChart3,
  Users,
  Award
} from 'lucide-react';

export const TeacherEvaluationsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const storeManager = SharedDataStoreManager.getInstance();
  const teacherId = 'teacher_shahadat'; // Demo teacher ID

  const [windows, setWindows] = useState<EvaluationWindow[]>([]);
  const [selectedWindowId, setSelectedWindowId] = useState<string>('');
  const [summaries, setSummaries] = useState<CourseEvaluationSummary[]>([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('');

  useEffect(() => {
    const allWindows = storeManager.getEvaluationWindows();
    setWindows(allWindows);

    // Default to a closed window first if available so teacher immediately sees results from past closed semester
    const closedWindow = allWindows.find((w) => w.status === 'Closed');
    const defaultWindowId = closedWindow ? closedWindow.id : allWindows[0]?.id || '';
    setSelectedWindowId(defaultWindowId);
  }, []);

  useEffect(() => {
    if (!selectedWindowId) return;
    const courseSummaries = storeManager.getTeacherEvaluationSummaries(selectedWindowId, teacherId);
    setSummaries(courseSummaries);

    if (courseSummaries.length > 0 && (!selectedCourseCode || !courseSummaries.some((s) => s.courseCode === selectedCourseCode))) {
      setSelectedCourseCode(courseSummaries[0].courseCode);
    }
  }, [selectedWindowId]);

  const activeWindow = windows.find((w) => w.id === selectedWindowId);
  const activeSummary = summaries.find((s) => s.courseCode === selectedCourseCode);

  const criteriaLabels = [
    { key: 'preparation', title: 'Preparation & Syllabus Coverage', titleBn: 'কোর্স প্রস্তুতি ও বিষয়বস্তুর স্পষ্টতা' },
    { key: 'punctuality', title: 'Punctuality & Routine Adherence', titleBn: 'সময়ানুবর্তিতা ও সময়সূচি মেনে চলা' },
    { key: 'engagement', title: 'Student Engagement & Interaction', titleBn: 'শিক্ষার্থীদের ক্লাসে মিথস্ক্রিয়া' },
    { key: 'practicals', title: 'Lab, Practical & Assignments', titleBn: 'ল্যাব ও ব্যবহারিক অ্যাসাইনমেন্ট' },
    { key: 'fairness', title: 'Fairness & Transparency in Grading', titleBn: 'মূল্যায়নে ন্যায়পরায়ণতা ও স্বচ্ছতা' },
    { key: 'overall', title: 'Overall Teaching Effectiveness', titleBn: 'সার্বিক পাঠদান কার্যকারিতা' }
  ];

  return (
    <DashboardLayout portalTitle={isBn ? 'শিক্ষক পোর্টাল' : 'Teacher Portal'}>
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 bg-[#EBF5FF] text-[#006A4E] rounded-md">
                  <Award className="w-5 h-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                  {isBn ? 'শিক্ষক ও কোর্স মূল্যায়ন ফলাফল' : 'Course & Teaching Evaluation Feedback'}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#475569]">
                {isBn
                  ? 'আইকিউএসি (IQAC) মানদণ্ড অনুযায়ী শিক্ষার্থীদের গোপনীয় মূল্যায়নের সারসংক্ষেপ।'
                  : 'Institutional Quality Assurance Cell (IQAC) aggregate pedagogical analytics.'}
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label htmlFor="teacher-window-select" className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                  {isBn ? 'মূল্যায়ন উইন্ডো' : 'Semester Window'}
                </label>
                <select
                  id="teacher-window-select"
                  aria-label="Evaluation Window Selector"
                  value={selectedWindowId}
                  onChange={(e) => setSelectedWindowId(e.target.value)}
                  className="px-3 py-1.5 text-xs sm:text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[#0F172A] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#006A4E]"
                >
                  {windows.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.semester} ({w.academicSession}) — {w.status}
                    </option>
                  ))}
                </select>
              </div>

              {summaries.length > 0 && (
                <div>
                  <label htmlFor="teacher-course-select" className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                    {isBn ? 'কোর্স নির্বাচন' : 'Assigned Course'}
                  </label>
                  <select
                    id="teacher-course-select"
                    aria-label="Assigned Course Selector"
                    value={selectedCourseCode}
                    onChange={(e) => setSelectedCourseCode(e.target.value)}
                    className="px-3 py-1.5 text-xs sm:text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[#0F172A] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#006A4E]"
                  >
                    {summaries.map((s) => (
                      <option key={s.courseCode} value={s.courseCode}>
                        {s.courseCode} ({s.totalResponses} {isBn ? 'মূল্যায়ন' : 'responses'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Institutional Policy Notice */}
          <div className="mt-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3.5 sm:p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#006A4E] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm space-y-1 text-[#334155]">
              <div className="font-semibold text-[#0F172A]">
                {isBn ? 'আইকিউএসি প্রকাশনা ও গোপনীয়তা নীতি' : 'IQAC Transparency & Safeguard Protocol'}
              </div>
              <p>
                {isBn
                  ? 'নীতিমালা অনুযায়ী ফলাফল কেবলমাত্র মূল্যায়ন উইন্ডো সমাপ্ত হওয়ার পর প্রদর্শিত হয় এবং শিক্ষক প্রতি কমপক্ষে ৫ জন শিক্ষার্থীর প্রতিক্রিয়া আবশ্যক।'
                  : 'Faculty members only view aggregate results and qualitative feedback after the window officially closes, and only if at least 5 responses were submitted to protect student anonymity.'}
              </p>
            </div>
          </div>
        </div>

        {/* Evaluation State Handling */}
        {!activeSummary ? (
          <Card className="p-8 text-center border border-[#E2E8F0]">
            <p className="text-sm text-[#64748B]">
              {isBn ? 'এই উইন্ডোতে কোনো কোর্সের তথ্য পাওয়া যায়নি।' : 'No evaluation records found for this semester window.'}
            </p>
          </Card>
        ) : activeSummary.windowStatus === 'Open' ? (
          /* CASE 1: WINDOW IS STILL OPEN */
          <Card className="p-8 sm:p-12 text-center border border-amber-200 bg-amber-50/50 space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-slate-800">
                {isBn ? 'উইন্ডো চলমান — ফলাফল সিলবদ্ধ' : 'Window In Progress — Feedback Sealed'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isBn
                  ? `চলতি ${activeWindow?.semester} সেমিস্টারের মূল্যায়ন উইন্ডো এখনো উন্মুক্ত। শিক্ষক ও কোর্সের জন্য এ পর্যন্ত ${activeSummary.totalResponses} জন শিক্ষার্থী মূল্যায়ন সম্পন্ন করেছে। আইকিউএসি দ্বারা উইন্ডো বন্ধ না হওয়া পর্যন্ত ফলাফল প্রদর্শিত হবে না।`
                  : `The evaluation window for ${activeWindow?.semester} is actively receiving student submissions. Currently ${activeSummary.totalResponses} students have submitted. Aggregates and comments will be automatically unsealed once the window closes.`}
              </p>
            </div>
            <div className="pt-2">
              <Badge variant="warning">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {isBn ? 'উইন্ডো সমাপ্তির অপেক্ষায়' : 'Awaiting Window Closure'}
              </Badge>
            </div>
          </Card>
        ) : !activeSummary.isThresholdMet ? (
          /* CASE 2: WINDOW CLOSED, BUT < 5 RESPONSES */
          <Card className="p-8 sm:p-12 text-center border border-slate-200 bg-slate-50 space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-slate-800">
                {isBn ? 'ন্যূনতম কোরাম অপূর্ণ (< ৫ প্রতিক্রিয়া)' : 'Privacy Threshold Guard (< 5 Responses)'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isBn
                  ? `এই কোর্সে সর্বমোট ${activeSummary.totalResponses}টি প্রতিক্রিয়া জমা পড়েছে। শিক্ষার্থীদের সম্পূর্ণ গোপনীয়তা নিশ্চিত করতে আইকিউএসি নিয়মানুযায়ী ন্যূনতম ৫টি প্রতিক্রিয়া ছাড়া ফলাফল ও মন্তব্য অপ্রকাশিত থাকে।`
                  : `This course received ${activeSummary.totalResponses} student responses. To prevent accidental de-anonymization of students in small cohort submissions, results require a minimum threshold of 5 responses.`}
              </p>
            </div>
            <div className="pt-2">
              <Badge variant="neutral">
                {isBn ? 'গোপনীয়তা রক্ষার্থে সুরক্ষিত' : 'Threshold Protected'}
              </Badge>
            </div>
          </Card>
        ) : (
          /* CASE 3: WINDOW CLOSED AND >= 5 RESPONSES (UNSEALED & ACCESSIBLE) */
          <div className="space-y-6">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-5 border border-[#E2E8F0] bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    {isBn ? 'সার্বিক রেটিং' : 'Overall Rating'}
                  </span>
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#0F172A]">
                    {activeSummary.overallAverage.toFixed(2)}
                  </span>
                  <span className="text-xs text-[#64748B]">/ 5.00</span>
                </div>
                <div className="mt-2">
                  <Badge variant={activeSummary.overallAverage >= 4.0 ? 'success' : 'primary'}>
                    {activeSummary.overallAverage >= 4.5
                      ? isBn ? 'অসাধারণ (Excellent)' : 'Excellent'
                      : activeSummary.overallAverage >= 4.0
                      ? isBn ? 'খুব ভালো (Very Good)' : 'Very Good'
                      : isBn ? 'সন্তোষজনক (Satisfactory)' : 'Satisfactory'}
                  </Badge>
                </div>
              </Card>

              <Card className="p-5 border border-[#E2E8F0] bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    {isBn ? 'শিক্ষার্থী প্রতিক্রিয়া' : 'Total Submissions'}
                  </span>
                  <div className="p-2 bg-blue-50 text-[#006A4E] rounded-lg">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#0F172A]">
                    {activeSummary.totalResponses}
                  </span>
                  <span className="text-xs text-[#64748B]">{isBn ? 'জন শিক্ষার্থী' : 'students'}</span>
                </div>
                <div className="mt-2">
                  <Badge variant="success">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {isBn ? 'কোরাম পূর্ণ (Quorum Met)' : 'Threshold Met (≥ 5)'}
                  </Badge>
                </div>
              </Card>

              <Card className="p-5 border border-[#E2E8F0] bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    {isBn ? 'কোর্স কোড ও বিভাগ' : 'Course & Dept'}
                  </span>
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-bold text-[#0F172A]">{activeSummary.courseCode}</div>
                  <div className="text-xs text-[#64748B] truncate mt-0.5">{activeSummary.courseTitle}</div>
                </div>
                <div className="mt-2">
                  <Badge variant="neutral">Department of {activeSummary.departmentId}</Badge>
                </div>
              </Card>
            </div>

            {/* Criteria Breakdown & Rating Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 6 Criteria Bars (Left 2 cols) */}
              <Card className="lg:col-span-2 p-6 border border-[#E2E8F0] bg-white space-y-4">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                  <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#006A4E]" />
                    {isBn ? 'মানদণ্ডভিত্তিক গড় মূল্যায়ন' : 'Evaluation Criteria Breakdown'}
                  </h3>
                  <span className="text-xs text-[#64748B]">{isBn ? 'সর্বোচ্চ ৫.০০' : 'Scale: 1.0 - 5.0'}</span>
                </div>

                <div className="space-y-4 pt-1">
                  {criteriaLabels.map((crit) => {
                    const score = activeSummary.criteriaAverages[crit.key as keyof typeof activeSummary.criteriaAverages] || 0;
                    const percent = Math.min(100, Math.round((score / 5) * 100));

                    return (
                      <div key={crit.key} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#1E293B]">
                            {isBn ? crit.titleBn : crit.title}
                          </span>
                          <span className="font-bold text-[#0F172A]">{score.toFixed(2)} / 5.0</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              score >= 4.5
                                ? 'bg-[#006A4E]'
                                : score >= 4.0
                                ? 'bg-emerald-500'
                                : score >= 3.0
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Rating Distribution (Right col) */}
              <Card className="p-6 border border-[#E2E8F0] bg-white space-y-4">
                <div className="border-b border-[#F1F5F9] pb-3">
                  <h3 className="font-bold text-[#0F172A]">
                    {isBn ? 'রেটিং বণ্টন' : 'Rating Distribution'}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {isBn ? '১ থেকে ৫ তারকার বিন্যাস' : 'Score frequency across all respondents'}
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = activeSummary.ratingDistribution[star as 1 | 2 | 3 | 4 | 5] || 0;
                    const pct = activeSummary.totalResponses > 0
                      ? Math.round((count / activeSummary.totalResponses) * 100)
                      : 0;

                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-12 font-medium text-[#475569] flex items-center gap-1">
                          {star} <Star className="w-3 h-3 text-amber-500 fill-current" />
                        </span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-[#64748B] font-mono text-[11px]">
                          {count} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Anonymous Student Qualitative Comments */}
            <Card className="p-6 border border-[#E2E8F0] bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                <div>
                  <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#006A4E]" />
                    {isBn ? 'শিক্ষার্থীদের বেনামী গঠনমূলক মন্তব্য' : 'Anonymous Student Feedback & Remarks'}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {isBn
                      ? 'সকল মন্তব্য শিক্ষার্থীদের ব্যক্তিগত পরিচয় বা আইডি ছাড়া সংরক্ষিত।'
                      : 'Verbatim student suggestions. Responses are strictly anonymous.'}
                  </p>
                </div>
                <Badge variant="neutral">
                  {activeSummary.comments.length} {isBn ? 'মন্তব্য' : 'Comments'}
                </Badge>
              </div>

              {activeSummary.comments.length === 0 ? (
                <p className="text-xs text-[#64748B] italic py-4">
                  {isBn ? 'কোনো লিখিত মন্তব্য প্রদান করা হয়নি।' : 'No written feedback submitted for this course.'}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                  {activeSummary.comments.map((cm, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#334155] leading-relaxed relative flex items-start gap-2.5"
                    >
                      <span className="text-[#94A3B8] font-serif text-lg leading-none">“</span>
                      <div className="flex-1 italic">{cm}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
