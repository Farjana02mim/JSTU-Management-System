import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  ArrowRight,
  Download,
  Building2,
  FileText,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  departmentsData,
  departmentPrograms,
  departmentCourses
} from '../../data/academicsSeedData';

export const ProgramDetailPage: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [programId]);

  const program = departmentPrograms.find(
    (p) => p.id.toLowerCase() === programId?.toLowerCase()
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8 bg-white">
        <SkeletonLoader variant="rectangular" className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonLoader key={i} variant="rectangular" className="h-24 rounded-xl" />
          ))}
        </div>
        <SkeletonLoader variant="rectangular" className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!program || hasError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 bg-white space-y-4">
        <EmptyState
          title={isBn ? 'প্রোগ্রামটি খুঁজে পাওয়া যায়নি' : 'Program Not Found'}
          description={
            isBn
              ? 'অনুরোধকৃত শিক্ষাক্রমটি বিশ্ববিদ্যালয়ের ডাটাবেজে নেই।'
              : 'The requested degree program could not be located in the academic catalog.'
          }
          actionLabel={isBn ? 'একাডেমিক পেজে ফিরে যান' : 'Back to Academics'}
          onAction={() => (window.location.href = '/academics')}
        />
        <div className="text-center">
          <Link to="/faculties">
            <Button size="sm" variant="outline">
              {isBn ? 'অনুষদ পেজে যান' : 'View Faculties Page'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const department = departmentsData.find((d) => d.id === program.departmentId);
  const courses = departmentCourses.filter((c) => c.programId === program.id);

  // Group courses by semester
  const semestersGrouped: { [key: number]: typeof courses } = {};
  for (let s = 1; s <= program.totalSemesters; s++) {
    semestersGrouped[s] = courses.filter((c) => {
      const courseSem = (c.year - 1) * 2 + c.semester;
      return courseSem === s || c.semester === s;
    });
  }

  const title = isBn ? program.titleBn : program.title;
  const overview = isBn ? program.overviewBn : program.overview;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 bg-white">
      <SEOHead
        title={`${title} | JSTU`}
        description={overview}
      />

      <Breadcrumb
        items={[
          { label: isBn ? 'একাডেমিক' : 'Academics', to: '/academics' },
          {
            label: department?.code || 'Department',
            to: `/academics/department/${program.departmentId}`
          },
          { label: isBn ? program.degreeTypeBn : program.degreeType }
        ]}
      />

      {/* Institutional Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>[REPLACE WITH REAL CONTENT]</strong> {isBn ? 'পাঠ্যক্রমের ক্রেডিট ও সেমিস্টার রূপরেখা খসড়া প্রোটোটাইপ হিসেবে প্রদর্শিত।' : 'Curricular specification, credits, and syllabus structure are design prototypes.'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded shrink-0">
          Program: {program.id}
        </span>
      </div>

      {/* Program Header */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="font-mono text-[#1E3A8A] font-bold text-sm bg-[#EFF6FF] px-2.5 py-1 rounded-md">
            {isBn ? program.degreeTypeBn : program.degreeType}
          </span>
          <span>·</span>
          <span>{department?.name}</span>
          <span>·</span>
          <span>{isBn ? program.durationBn : program.duration}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          {title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-4xl leading-relaxed">
          {overview}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link to="/admission">
            <Button size="sm" variant="primary" leftIcon={<GraduationCap className="w-3.5 h-3.5" />}>
              {isBn ? 'ভর্তি আবেদন নির্দেশিকা' : 'Admission Requirements'}
            </Button>
          </Link>
          <Link to={`/academics/department/${program.departmentId}?tab=faculty`}>
            <Button size="sm" variant="outline">
              {isBn ? 'বিভাগীয় শিক্ষকবৃন্দ' : 'Department Faculty'}
            </Button>
          </Link>
          <a
            href="#download-curriculum"
            onClick={(e) => {
              e.preventDefault();
              const content = `JAMALPUR SCIENCE & TECHNOLOGY UNIVERSITY (JSTU)\nCurriculum & Syllabus Booklet: ${program.title}\nTotal Credits: ${program.totalCredits}\nDuration: ${program.duration}\n/* [REPLACE WITH REAL CONTENT] Official gazetted curriculum */\n`;
              const blob = new Blob([content], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${program.id}_Curriculum_Booklet.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] transition-colors border border-[#E2E8F0]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isBn ? 'সিলেবাস বুকলেট ডাউনলোড' : 'Download Curriculum Booklet (PDF)'}</span>
          </a>
        </div>
      </div>

      {/* Key Program Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
        <div>
          <span className="text-xs text-slate-500 block">{isBn ? 'মোট ক্রেডিট:' : 'Total Credits Required:'}</span>
          <strong className="text-xl text-[#0F172A] font-mono">{program.totalCredits} Credits</strong>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">{isBn ? 'মোট সেমিস্টার:' : 'Total Semesters:'}</span>
          <strong className="text-xl text-[#0F172A] font-mono">{program.totalSemesters} Semesters</strong>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">{isBn ? 'বার্ষিক আসন:' : 'Intake Capacity:'}</span>
          <strong className="text-xl text-[#0F172A] font-mono">{program.seatCount} Seats</strong>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">{isBn ? 'ভর্তি সেশন:' : 'Intake Season:'}</span>
          <strong className="text-base text-[#0F172A]">{isBn ? program.intakeSeasonBn : program.intakeSeason}</strong>
        </div>
      </div>

      {/* 2-Column: Eligibility & Career Prospects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card padding="lg" className="space-y-4 border-t-4 border-t-[#1E3A8A]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{isBn ? 'ভর্তির যোগ্যতা ও পূর্বশর্ত' : 'Admission Eligibility & Criteria'}</span>
            </h2>
            <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
              [REPLACE]
            </span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {(isBn ? program.admissionEligibilityBn : program.admissionEligibility).map((req, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-[#1E3A8A] font-bold">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card padding="lg" className="space-y-4 border-t-4 border-t-[#B45309]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#B45309]" />
              <span>{isBn ? 'স্নাতকদের কর্মসংস্থান ও ক্যারিয়ার' : 'Career Prospects & Industry Demand'}</span>
            </h2>
            <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
              [REPLACE]
            </span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {(isBn ? program.careerProspectsBn : program.careerProspects).map((cp, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <ArrowRight className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                <span>{cp}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Curriculum Highlights */}
      <Card padding="lg" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0F172A]">
            {isBn ? 'শিক্ষাক্রমের বিশেষ বৈশিষ্ট্যসমূহ' : 'Curriculum Structure & Academic Highlights'}
          </h2>
          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
            [REPLACE WITH REAL CONTENT]
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
          {(isBn ? program.curriculumHighlightsBn : program.curriculumHighlights).map((hl, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0]">
              <span className="font-bold text-[#1E3A8A] block mb-1">OBE Pillar {i + 1}</span>
              <span>{hl}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Semester by Semester Course Structure */}
      <div className="space-y-6">
        <div className="border-b border-[#E2E8F0] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">
              {isBn ? 'সেমিস্টারভিত্তিক কোর্স কাঠামো' : 'Semester-by-Semester Course Outline'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isBn
                ? 'স্নাতক সমাপনের জন্য নির্ধারিত তাত্ত্বিক, ল্যাব ও ক্যাপস্টোন কোর্সসমূহ।'
                : 'Core modules, engineering sessionals, and thesis projects required for degree conferral.'}
            </p>
          </div>
          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-1 rounded font-mono">
            [REPLACE WITH REAL CONTENT]
          </span>
        </div>

        {courses.length === 0 ? (
          <EmptyState
            title={isBn ? 'কোর্স তালিকা প্রস্তুত করা হচ্ছে' : 'Course Matrix Being Finalized'}
            description={isBn ? 'এই প্রোগ্রামের বিস্তারিত কোর্স তালিকা শীঘ্রই প্রদর্শিত হবে।' : 'Course list for this degree program is being updated.'}
          />
        ) : (
          <div className="space-y-4">
            {Array.from({ length: program.totalSemesters }, (_, idx) => idx + 1).map((semNum) => {
              const semCourses = semestersGrouped[semNum] || [];
              if (semCourses.length === 0) return null;

              const totalSemCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);

              return (
                <div key={semNum} className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-white shadow-xs">
                  <div className="bg-[#F8FAFC] px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#0F172A]">
                      {isBn ? `সেমিস্টার ${semNum}` : `Semester ${semNum}`}
                    </h3>
                    <span className="text-xs font-mono font-semibold text-[#1E3A8A]">
                      {totalSemCredits.toFixed(1)} {isBn ? 'ক্রেডিট' : 'Credits'}
                    </span>
                  </div>

                  <div className="divide-y divide-[#E2E8F0]">
                    {semCourses.map((c) => (
                      <div key={c.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#1E3A8A]">
                              {c.courseCode}
                            </span>
                            <span className="text-xs font-semibold text-[#0F172A]">
                              {isBn ? c.courseTitleBn : c.courseTitle}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                            {isBn ? c.descriptionBn : c.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${
                              c.type === 'Lab'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isBn ? c.typeBn : c.type}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#0F172A]">
                            {c.credits.toFixed(1)} Cr
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
