import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { Accordion, AccordionItem } from '../../../components/common/Accordion';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getStudentDataService, SemesterResult } from '../../../services/student';
import { calculateCGPA } from '../../../utils/gpaCalculator';
import { Award, Download, AlertCircle, RefreshCw, CheckCircle2, ChevronDown } from 'lucide-react';

export const StudentResultsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [results, setResults] = useState<SemesterResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const studentService = getStudentDataService();
      // Safe: user.uid is from the verified session, not taken from the URL
      const studentUid = user?.uid || 'demo_student_uid';
      const list = await studentService.getResults(studentUid);
      setResults(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load semester results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, [user]);

  // Compute overall CGPA across all published courses / semesters
  const allPublishedCourses = results.flatMap((sem) =>
    sem.courses.filter((c) => !c.isPending && c.gradePoint !== undefined)
  );

  const totalEarnedCredits = allPublishedCourses.reduce(
    (acc, c) => (c.gradePoint && c.gradePoint > 0 ? acc + c.credits : acc),
    0
  );

  const totalAttemptedCredits = allPublishedCourses.reduce((acc, c) => acc + c.credits, 0);

  const computedCgpa =
    totalAttemptedCredits > 0
      ? Math.round(
          (allPublishedCourses.reduce((sum, c) => sum + c.credits * (c.gradePoint || 0), 0) /
            totalAttemptedCredits) *
            100
        ) / 100
      : 0.00;

  return (
    <DashboardLayout portalTitle={isBn ? 'ফলাফল ও গ্রেডশিট' : 'Academic Results & CGPA'}>
      <div className="space-y-6">
        {/* Top Summary Banner */}
        <div className="p-6 bg-gradient-to-r from-[#0F172A] to-[#1E3A8A] text-white rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
              Official UGC 4.00 Grading Scale &bull; Verified Records
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight">
              {isBn ? 'সেমিস্টারভিত্তিক ফলাফল বিবরণী' : 'Cumulative Semester Grade Ledger'}
            </h1>
            <p className="text-xs text-slate-300">
              {isBn
                ? `শিক্ষার্থী: ${profile?.fullNameBn || user?.displayName} (আইডি: JSTU2026001)`
                : `Student: ${profile?.fullName || user?.displayName} (Student ID: JSTU2026001)`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl text-center border border-white/20">
              <span className="text-[10px] text-slate-300 uppercase block font-semibold">
                {isBn ? 'অর্জিত ক্রেডিট' : 'Earned Credits'}
              </span>
              <span className="text-2xl font-extrabold font-mono">{totalEarnedCredits.toFixed(1)}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs px-5 py-2 rounded-xl text-center border border-white/20">
              <span className="text-[10px] text-amber-300 uppercase block font-semibold">
                {isBn ? 'কিউমুলেটিভ সিজিপিএ' : 'Cumulative CGPA'}
              </span>
              <span className="text-3xl font-extrabold font-mono text-amber-300">
                {computedCgpa.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonLoader key={i} variant="rectangular" className="h-48 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card padding="lg" className="border-red-200 bg-red-50 text-center py-8 space-y-3">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h2 className="text-sm font-bold text-red-900">{isBn ? 'ফলাফল লোড ব্যর্থ' : 'Unable to load results'}</h2>
            <p className="text-xs text-red-700">{error}</p>
            <Button variant="outline" size="sm" onClick={loadResults} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              {isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
            </Button>
          </Card>
        )}

        {/* Results List */}
        {!loading && !error && results.length > 0 && (
          <div className="space-y-6">
            {results.map((sem) => (
              <Card key={sem.semesterNumber} padding="lg" className="bg-white border-[#E2E8F0] shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                  <div>
                    <h2 className="text-base font-bold text-[#0F172A]">
                      {isBn ? sem.semesterNameBn : sem.semesterName}
                    </h2>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Session: {sem.session} &bull; Total Credits: {sem.totalCredits.toFixed(1)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-50 text-[#1E3A8A] border border-blue-200 rounded-lg text-xs font-mono font-bold">
                      SGPA: {sem.sgpa.toFixed(2)}
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Published</span>
                    </span>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Course Code</th>
                        <th className="py-2.5 px-3">Course Title</th>
                        <th className="py-2.5 px-3 text-center">Credits</th>
                        <th className="py-2.5 px-3 text-center">Marks</th>
                        <th className="py-2.5 px-3 text-center">Letter Grade</th>
                        <th className="py-2.5 px-3 text-right">Grade Point</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9] font-medium text-slate-700">
                      {sem.courses.map((course) => {
                        const isPending = course.isPending || course.marks === undefined;

                        return (
                          <tr key={course.code} className="hover:bg-[#F8FAFC]">
                            <td className="py-2.5 px-3 font-mono font-bold text-[#1E3A8A]">
                              {course.code}
                            </td>
                            <td className="py-2.5 px-3">
                              {isBn ? course.titleBn : course.title}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono">
                              {course.credits.toFixed(1)}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono">
                              {isPending ? (
                                <span className="text-slate-400 italic font-sans text-[11px]">—</span>
                              ) : (
                                course.marks
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {isPending ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                  {isBn ? 'ফলাফল প্রক্রিয়াধীন' : 'Result pending'}
                                </span>
                              ) : (
                                <span
                                  className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                                    course.letterGrade === 'A+'
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : course.letterGrade === 'A' || course.letterGrade === 'A-'
                                      ? 'bg-blue-50 text-[#1E3A8A]'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {course.letterGrade}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-[#0F172A]">
                              {isPending ? (
                                <span className="text-slate-400 italic font-sans text-[11px]">—</span>
                              ) : (
                                (course.gradePoint ?? 0).toFixed(2)
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            ))}

            {/* UGC Grading Standard Chart Accordion */}
            <Accordion>
              <AccordionItem id="ugc-chart" title={isBn ? 'ইউজিসি স্ট্যান্ডার্ড ৪.০০ গ্রেডিং স্কেল বিবরণী' : 'UGC Standard 4.00 Grading Scale Reference'}>
                <div className="text-xs space-y-2 pt-2 text-slate-600">
                  <p>
                    Jamalpur Science & Technology University strictly adopts the uniform grading system prescribed by the University Grants Commission of Bangladesh (UGC):
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-1">
                    <div className="p-2 bg-white border border-[#E2E8F0] rounded">80% and above: A+ (4.00)</div>
                    <div className="p-2 bg-white border border-[#E2E8F0] rounded">75% to 79%: A (3.75)</div>
                    <div className="p-2 bg-white border border-[#E2E8F0] rounded">70% to 74%: A- (3.50)</div>
                    <div className="p-2 bg-white border border-[#E2E8F0] rounded">65% to 69%: B+ (3.25)</div>
                    <div className="p-2 bg-white border border-[#E2E8F0] rounded">60% to 64%: B (3.00)</div>
                    <div className="p-2 bg-white border border-[#E2E8F0] rounded">55% to 59%: B- (2.75)</div>
                    <div className="p-2 bg-white border border-[#E2E8F0] rounded">50% to 54%: C+ (2.50)</div>
                    <div className="p-2 bg-white border border-[#E2E8F0] rounded">45% to 49%: C (2.25)</div>
                    <div className="p-2 bg-white border border-[#E2E8F0] rounded">40% to 44%: D (2.00)</div>
                    <div className="p-2 bg-white border border-[#E2E8F0] rounded text-red-600">Below 40%: F (0.00)</div>
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentResultsPage;
