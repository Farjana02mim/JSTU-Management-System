import React from 'react';
import { Printer, ArrowLeft, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { ControllerSheetDetail } from '../../services/controller';
import { UGC_GRADE_SCALE } from '../../config/grading';

interface PrintableTabulationSheetProps {
  detail: ControllerSheetDetail;
  onBack?: () => void;
}

export const PrintableTabulationSheet: React.FC<PrintableTabulationSheetProps> = ({
  detail,
  onBack
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen text-[#0F172A] p-4 sm:p-8">
      {/* On-screen Print Controls (hidden during print) */}
      <div className="print:hidden mb-6 flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              {isBn ? 'ফিরে যান' : 'Back to Detail'}
            </Button>
          )}
          <span className="text-xs font-semibold text-slate-600">
            {isBn ? 'অফিসিয়াল প্রিন্ট / পিডিএফ ভিউ' : 'Official Printable Result Tabulation Sheet'}
          </span>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handlePrint}
          leftIcon={<Printer className="w-4 h-4" />}
        >
          {isBn ? 'প্রিন্ট করুন / পিডিএফ সেভ করুন' : 'Print / Save as PDF'}
        </Button>
      </div>

      {/* Official JSTU Printable Document Container */}
      <div className="max-w-4xl mx-auto border border-slate-300 print:border-none p-6 sm:p-8 bg-white shadow-xs print:shadow-none space-y-6">
        {/* Institutional Header */}
        <div className="text-center space-y-1.5 border-b-2 border-slate-800 pb-4">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900 font-serif">
              Jamalpur Science and Technology University
            </h1>
          </div>
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-widest font-serif">
            Office of the Controller of Examinations &bull; Jamalpur-2012, Bangladesh
          </p>
          <div className="pt-2">
            <span className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-widest bg-slate-900 text-white rounded print:text-black print:bg-transparent print:border print:border-black">
              Official Tabulation Sheet (Marks & Grade Ledger)
            </span>
          </div>
        </div>

        {/* Course & Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-slate-300 p-3 bg-slate-50/50 print:bg-transparent rounded-lg">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Course Code</span>
            <span className="font-mono font-black text-sm text-[#1E3A8A]">{detail.courseCode}</span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Course Title</span>
            <span className="font-bold text-slate-900">{detail.courseTitle}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Credits</span>
            <span className="font-mono font-bold text-slate-900">{detail.credits.toFixed(1)}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Department</span>
            <span className="font-bold text-slate-900">{detail.department}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Semester</span>
            <span className="font-semibold text-slate-900">{detail.semester}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Status</span>
            <span className="font-mono font-bold text-emerald-700 uppercase">{detail.status}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Tabulation Version</span>
            <span className="font-mono font-bold text-slate-900">v{detail.currentVersion}</span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Course Instructor</span>
            <span className="font-semibold text-slate-900">{detail.instructorName}</span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Publication Date</span>
            <span className="font-mono text-slate-800">
              {detail.publishedAt ? new Date(detail.publishedAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        {/* Tabulation Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 print:bg-slate-200 text-slate-900 font-bold uppercase text-[10px] border-b border-slate-300">
                <th className="py-2 px-2.5 border-r border-slate-300 w-10 text-center">SL</th>
                <th className="py-2 px-3 border-r border-slate-300">Student ID</th>
                <th className="py-2 px-3 border-r border-slate-300">Student Name</th>
                <th className="py-2 px-2 border-r border-slate-300 text-center">Attn (10)</th>
                <th className="py-2 px-2 border-r border-slate-300 text-center">CT (20)</th>
                <th className="py-2 px-2 border-r border-slate-300 text-center">Mid (20)</th>
                <th className="py-2 px-2 border-r border-slate-300 text-center">Final (50)</th>
                <th className="py-2 px-2.5 border-r border-slate-300 text-center font-extrabold">Total (100)</th>
                <th className="py-2 px-2 border-r border-slate-300 text-center">LG</th>
                <th className="py-2 px-2.5 text-right font-extrabold">GP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {detail.enrolledStudents.map((st, idx) => {
                const entry = detail.entries[st.studentId];
                if (!entry) return null;

                return (
                  <tr key={st.studentId} className="hover:bg-slate-50">
                    <td className="py-1.5 px-2.5 border-r border-slate-300 text-center font-mono text-slate-500 text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-1.5 px-3 border-r border-slate-300 font-mono font-bold text-slate-900">
                      {st.studentId}
                    </td>
                    <td className="py-1.5 px-3 border-r border-slate-300 font-medium text-slate-800">
                      {st.name}
                    </td>
                    <td className="py-1.5 px-2 border-r border-slate-300 text-center font-mono">
                      {entry.attendance}
                    </td>
                    <td className="py-1.5 px-2 border-r border-slate-300 text-center font-mono">
                      {entry.classTests}
                    </td>
                    <td className="py-1.5 px-2 border-r border-slate-300 text-center font-mono">
                      {entry.midterm}
                    </td>
                    <td className="py-1.5 px-2 border-r border-slate-300 text-center font-mono">
                      {entry.finalExam ?? '—'}
                    </td>
                    <td className="py-1.5 px-2.5 border-r border-slate-300 text-center font-mono font-extrabold text-slate-900">
                      {entry.total}
                    </td>
                    <td className="py-1.5 px-2 border-r border-slate-300 text-center font-mono font-bold">
                      <span className={entry.letterGrade === 'F' ? 'text-red-600' : 'text-slate-900'}>
                        {entry.letterGrade}
                      </span>
                    </td>
                    <td className="py-1.5 px-2.5 text-right font-mono font-bold text-slate-900">
                      {entry.gradePoint.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Statistics & Grading Standard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="border border-slate-300 p-3 rounded space-y-1">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block">
              Cohort Summary Statistics
            </span>
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div>Total Enrolled: <span className="font-mono font-bold">{detail.statistics.enrolledCount}</span></div>
              <div>Passed: <span className="font-mono font-bold text-emerald-700">{detail.statistics.passedCount}</span></div>
              <div>Failed: <span className="font-mono font-bold text-red-700">{detail.statistics.failedCount}</span></div>
              <div>Class Average: <span className="font-mono font-bold">{detail.statistics.averageMarks}</span></div>
              <div>Highest Marks: <span className="font-mono font-bold">{detail.statistics.highestMarks}</span></div>
              <div>Lowest Marks: <span className="font-mono font-bold">{detail.statistics.lowestMarks}</span></div>
            </div>
          </div>

          <div className="border border-slate-300 p-3 rounded space-y-1">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block">
              Grading Standard Key (UGC Standard)
            </span>
            <div className="text-[10px] text-slate-600 leading-tight space-y-0.5">
              <span>80%+: A+ (4.00) &bull; 75-79%: A (3.75) &bull; 70-74%: A- (3.50) &bull; 65-69%: B+ (3.25)</span>
              <br />
              <span>60-64%: B (3.00) &bull; 55-59%: B- (2.75) &bull; 50-54%: C+ (2.50) &bull; 45-49%: C (2.25)</span>
              <br />
              <span>40-44%: D (2.00) &bull; &lt;40%: F (0.00)</span>
            </div>
          </div>
        </div>

        {/* Official Signatures Row */}
        <div className="pt-12 sm:pt-16 grid grid-cols-3 gap-6 text-center text-xs">
          <div className="border-t border-slate-800 pt-1.5 space-y-0.5">
            <p className="font-bold text-slate-900">{detail.instructorName}</p>
            <p className="text-[10px] text-slate-500 uppercase">Course Teacher / Examiner</p>
          </div>
          <div className="border-t border-slate-800 pt-1.5 space-y-0.5">
            <p className="font-bold text-slate-900">Prof. Dr. Chairman CSE</p>
            <p className="text-[10px] text-slate-500 uppercase">Chairman, Dept. Exam Committee</p>
          </div>
          <div className="border-t border-slate-800 pt-1.5 space-y-0.5">
            <p className="font-bold text-slate-900">Dr. Md. Mokhlesur Rahman</p>
            <p className="text-[10px] text-slate-500 uppercase">Controller of Examinations</p>
          </div>
        </div>

        {/* Footer Security Note */}
        <div className="text-[10px] text-slate-400 text-center pt-4 border-t border-slate-200">
          This document is generated by the JSTU Smart Paperless Campus ERP. Any correction after publication requires authorized version snapshot approval.
        </div>
      </div>
    </div>
  );
};
