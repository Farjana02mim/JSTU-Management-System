import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { CourseEvaluationSummary, EvaluationWindow } from '../../types/evaluation';
import {
  Star,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  Eye,
  BarChart2,
  MessageSquare,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface ChairmanDepartmentEvaluationsProps {
  departmentId: string;
}

export const ChairmanDepartmentEvaluations: React.FC<ChairmanDepartmentEvaluationsProps> = ({
  departmentId
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const storeManager = SharedDataStoreManager.getInstance();

  const [windows, setWindows] = useState<EvaluationWindow[]>([]);
  const [selectedWindowId, setSelectedWindowId] = useState<string>('');
  const [summaries, setSummaries] = useState<CourseEvaluationSummary[]>([]);
  const [activeCourseModal, setActiveCourseModal] = useState<CourseEvaluationSummary | null>(null);

  useEffect(() => {
    const allWindows = storeManager.getEvaluationWindows();
    setWindows(allWindows);

    // Prefer closed window to show historical results, fallback to first
    const closedWindow = allWindows.find((w) => w.status === 'Closed');
    const defaultWindowId = closedWindow ? closedWindow.id : allWindows[0]?.id || '';
    setSelectedWindowId(defaultWindowId);
  }, []);

  useEffect(() => {
    if (!selectedWindowId) return;
    const deptSummaries = storeManager.getDepartmentEvaluationSummaries(selectedWindowId, departmentId);
    setSummaries(deptSummaries);
  }, [selectedWindowId, departmentId]);

  const activeWindow = windows.find((w) => w.id === selectedWindowId);

  // Aggregate departmental metrics
  const totalSubmissions = summaries.reduce((acc, curr) => acc + curr.totalResponses, 0);
  const eligibleCourses = summaries.filter((s) => s.windowStatus === 'Closed' && s.isThresholdMet);
  const deptAverage = eligibleCourses.length > 0
    ? eligibleCourses.reduce((acc, curr) => acc + curr.overallAverage, 0) / eligibleCourses.length
    : 0;

  const criteriaLabels = [
    { key: 'preparation', title: 'Preparation & Syllabus Coverage', titleBn: 'কোর্স প্রস্তুতি ও স্পষ্টতা' },
    { key: 'punctuality', title: 'Punctuality & Routine', titleBn: 'সময়ানুবর্তিতা' },
    { key: 'engagement', title: 'Student Engagement', titleBn: 'শিক্ষার্থীদের অংশগ্রহণ' },
    { key: 'practicals', title: 'Lab & Assignments', titleBn: 'ল্যাব ও ব্যবহারিক' },
    { key: 'fairness', title: 'Fairness in Grading', titleBn: 'মূল্যায়নে ন্যায়পরায়ণতা' },
    { key: 'overall', title: 'Overall Effectiveness', titleBn: 'সার্বিক কার্যকারিতা' }
  ];

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#006A4E]" />
            <h2 className="text-lg font-bold text-[#0F172A]">
              {isBn
                ? `বিভাগীয় কোর্স ও শিক্ষক মূল্যায়ন সারসংক্ষেপ (${departmentId.toUpperCase()})`
                : `Departmental Evaluation Summaries (${departmentId.toUpperCase()})`}
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            {isBn
              ? 'বিভাগের পাঠদান মানোন্নয়নের জন্য আইকিউএসি সংকলিত পরিসংখ্যান।'
              : 'IQAC departmental pedagogical oversight and course quality metrics.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="dept-eval-window" className="text-xs font-semibold text-[#475569] shrink-0">
            {isBn ? 'সেমিস্টার সেশন:' : 'Window:'}
          </label>
          <select
            id="dept-eval-window"
            aria-label="Department Evaluation Window"
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
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border border-[#E2E8F0] bg-white">
          <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
            {isBn ? 'বিভাগীয় গড় স্কোর' : 'Department Average'}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F172A]">
              {deptAverage > 0 ? deptAverage.toFixed(2) : '—'}
            </span>
            <span className="text-xs text-[#64748B]">/ 5.00</span>
          </div>
          <div className="mt-1 text-[11px] text-[#64748B]">
            {isBn ? 'কোরাম উত্তীর্ণ কোর্সসমূহের ভিত্তিতে' : 'Across courses meeting threshold'}
          </div>
        </Card>

        <Card className="p-4 border border-[#E2E8F0] bg-white">
          <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
            {isBn ? 'মোট শিক্ষার্থী প্রতিক্রিয়া' : 'Department Submissions'}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F172A]">{totalSubmissions}</span>
            <span className="text-xs text-[#64748B]">{isBn ? 'প্রতিক্রিয়া' : 'responses'}</span>
          </div>
          <div className="mt-1 text-[11px] text-[#64748B]">
            {summaries.length} {isBn ? 'টি কোর্সে সর্বমোট' : 'courses monitored'}
          </div>
        </Card>

        <Card className="p-4 border border-[#E2E8F0] bg-white">
          <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
            {isBn ? 'উইন্ডোর স্থিতি' : 'Window Status'}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={activeWindow?.status === 'Open' ? 'warning' : 'neutral'}>
              {activeWindow?.status === 'Open'
                ? isBn ? 'উইন্ডো উন্মুক্ত (চলমান)' : 'Window Active'
                : isBn ? 'উইন্ডো সমাপ্ত (ফলাফল প্রস্তুত)' : 'Window Closed'}
            </Badge>
          </div>
          <div className="mt-1 text-[11px] text-[#64748B]">
            {activeWindow?.status === 'Open'
              ? isBn ? 'শিক্ষার্থীরা মূল্যায়ন জমা দিচ্ছে' : 'Accepting student responses'
              : isBn ? 'আইকিউএসি দ্বারা অনুমোদিত' : 'Unsealed for review'}
          </div>
        </Card>
      </div>

      {/* Courses Table */}
      <Card className="overflow-hidden border border-[#E2E8F0] bg-white">
        <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
          <h3 className="font-bold text-[#0F172A] text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#006A4E]" />
            {isBn ? 'কোর্স ও শিক্ষকভিত্তিক মূল্যায়ন তালিকা' : 'Courses Monitored in Department'}
          </h3>
          <span className="text-xs text-[#64748B]">
            {summaries.length} {isBn ? 'টি কোর্স' : 'courses'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#475569] uppercase font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-3">{isBn ? 'কোর্স কোড ও শিরোনাম' : 'Course'}</th>
                <th className="px-4 py-3">{isBn ? 'দায়িত্বপ্রাপ্ত শিক্ষক' : 'Instructor'}</th>
                <th className="px-4 py-3 text-center">{isBn ? 'প্রতিক্রিয়া' : 'Responses'}</th>
                <th className="px-4 py-3 text-center">{isBn ? 'গড় রেটিং' : 'Average Score'}</th>
                <th className="px-4 py-3 text-center">{isBn ? 'কোরাম ও স্ট্যাটাস' : 'Status'}</th>
                <th className="px-4 py-3 text-right">{isBn ? 'পদক্ষেপ' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {summaries.map((item) => {
                const isOpen = item.windowStatus === 'Open';
                const isProtected = !isOpen && !item.isThresholdMet;
                const isReady = !isOpen && item.isThresholdMet;

                return (
                  <tr key={item.courseCode} className="hover:bg-[#F8FAFC]/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#0F172A]">{item.courseCode}</div>
                      <div className="text-[11px] text-[#64748B] truncate max-w-xs">{item.courseTitle}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#1E293B]">{item.teacherName}</div>
                      <div className="text-[11px] text-[#64748B]">Dept of {item.departmentId}</div>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-semibold text-[#0F172A]">
                      {item.totalResponses}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isOpen ? (
                        <span className="text-[11px] text-amber-600 font-medium flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" /> {isBn ? 'চলমান' : 'Sealed'}
                        </span>
                      ) : isProtected ? (
                        <span className="text-[11px] text-slate-500 font-medium">
                          {isBn ? 'সুরক্ষিত (< ৫)' : '< 5 Threshold'}
                        </span>
                      ) : (
                        <div className="inline-flex items-center gap-1 font-bold text-[#006A4E]">
                          <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                          <span>{item.overallAverage.toFixed(2)}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isOpen ? (
                        <Badge variant="warning">{isBn ? 'উইন্ডো উন্মুক্ত' : 'In Progress'}</Badge>
                      ) : isProtected ? (
                        <Badge variant="neutral">{isBn ? 'কোরাম অপূর্ণ' : 'Below Quorum'}</Badge>
                      ) : (
                        <Badge variant="success">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {isBn ? 'ফলাফল উন্মুক্ত' : 'Completed'}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isReady ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveCourseModal(item)}
                          className="h-7 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          {isBn ? 'সারসংক্ষেপ' : 'View Summary'}
                        </Button>
                      ) : (
                        <span className="text-[11px] text-[#94A3B8] italic">
                          {isOpen ? (isBn ? 'সিলবদ্ধ' : 'Sealed') : (isBn ? 'সুরক্ষিত' : 'Locked')}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Course Drilldown Modal for Chairman */}
      {activeCourseModal && (
        <Modal
          isOpen={!!activeCourseModal}
          onClose={() => setActiveCourseModal(null)}
          title={`${activeCourseModal.courseCode}: ${isBn ? 'মূল্যায়ন সারসংক্ষেপ' : 'Evaluation Overview'}`}
          maxWidth="lg"
        >
          <div className="space-y-5 max-h-[75vh] overflow-y-auto px-1">
            <div className="flex items-center justify-between bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
              <div>
                <h4 className="font-bold text-sm text-[#0F172A]">{activeCourseModal.courseTitle}</h4>
                <p className="text-xs text-[#64748B]">Instructor: {activeCourseModal.teacherName}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-[#006A4E]">{activeCourseModal.overallAverage.toFixed(2)} / 5.00</div>
                <div className="text-[11px] text-[#64748B]">{activeCourseModal.totalResponses} respondents</div>
              </div>
            </div>

            {/* Criteria breakdown */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                {isBn ? 'মানদণ্ডভিত্তিক গড় রেটিং' : 'Criteria Averages'}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {criteriaLabels.map((crit) => {
                  const score = activeCourseModal.criteriaAverages[crit.key as keyof typeof activeCourseModal.criteriaAverages] || 0;
                  return (
                    <div key={crit.key} className="p-3 bg-white border border-[#E2E8F0] rounded-lg">
                      <div className="text-xs text-[#64748B]">{isBn ? crit.titleBn : crit.title}</div>
                      <div className="mt-1 flex items-baseline justify-between">
                        <span className="font-bold text-sm text-[#0F172A]">{score.toFixed(2)}</span>
                        <span className="text-[11px] text-[#94A3B8]">/ 5.0</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Qualitative Feedback */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                {isBn ? 'শিক্ষার্থীদের বেনামী মন্তব্য' : 'Anonymous Student Comments'} ({activeCourseModal.comments.length})
              </h5>
              {activeCourseModal.comments.length === 0 ? (
                <p className="text-xs text-[#64748B] italic">No written comments submitted.</p>
              ) : (
                <div className="space-y-2">
                  {activeCourseModal.comments.map((cm, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#334155] italic"
                    >
                      “{cm}”
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setActiveCourseModal(null)}>
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
