import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  GraduationCap,
  Calendar,
  FileCheck2,
  DollarSign,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Filter,
  Search,
  Sparkles,
  UserCheck,
  ShieldAlert,
  ChevronDown,
  Building2,
  Clock,
  Download,
  Info
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  admissionProgramsData,
  admissionFeesData,
  admissionDatesData,
  admissionFaqData
} from '../../data/admissionData';
import { OnlineAdmissionApplicationForm } from '../../components/admission/OnlineAdmissionApplicationForm';
import { AdmissionStatusCheck } from '../../components/admission/AdmissionStatusCheck';

export const AdmissionPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab: 'overview' | 'apply' | 'status'
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState<'overview' | 'apply' | 'status'>(
    (initialTab as any) || 'overview'
  );

  // Sync tab with URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'apply' || tabParam === 'status' || tabParam === 'overview') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'overview' | 'apply' | 'status') => {
    setActiveTab(tab);
    setSearchParams({ tab });
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  // Status check initial search credentials
  const [lookupRef, setLookupRef] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');

  const handleJumpToStatusCheck = (refNo: string, email: string) => {
    setLookupRef(refNo);
    setLookupEmail(email);
    handleTabChange('status');
  };

  // Program filters
  const [programLevelFilter, setProgramLevelFilter] = useState<'all' | 'Undergraduate' | 'Postgraduate'>('all');
  const [unitFilter, setUnitFilter] = useState<'all' | 'UNIT_A' | 'UNIT_B' | 'UNIT_C'>('all');

  const filteredPrograms = admissionProgramsData.filter((p) => {
    if (programLevelFilter !== 'all' && p.degreeLevel !== programLevelFilter) return false;
    if (unitFilter !== 'all' && p.unit !== unitFilter) return false;
    return true;
  });

  // FAQ open/close accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12 bg-white">
      <SEOHead
        title={isBn ? 'ভর্তি তথ্য ও অনলাইন আবেদন ২০২৬' : 'Admissions & Online Application 2026-2027'}
        description="Official JSTU Central Undergraduate and Postgraduate Admission portal: program criteria, fees, important dates, multi-step application form, and admit card download."
      />

      <Breadcrumb items={[{ label: isBn ? 'ভর্তি তথ্য' : 'Admissions' }]} />

      {/* Hero Banner Strip */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] text-white p-8 sm:p-12 shadow-sm border border-slate-800">
        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? 'শিক্ষাবর্ষ ২০২৬-২০২৭ • স্নাতক ও স্নাতকোত্তর ভর্তি' : 'Academic Session 2026-2027 • Central Admissions'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {isBn
              ? 'জেএসটিইউ কেন্দ্রীয় ভর্তি ও অনলাইন আবেদন পোর্টাল'
              : 'JSTU Central Admissions & Online Application'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {isBn
              ? 'বিজ্ঞান, প্রকৌশল, ব্যবসায় প্রশাসন ও সমাজবিজ্ঞান অনুষদে আধুনিক বিশ্বমানের উচ্চশিক্ষায় অংশ নিন। অনলাইনে আবেদন ফরম পূরণ করুন এবং কিউআর কোড সংবলিত প্রবেশপত্র সংগ্রহ করুন।'
              : 'Explore undergraduate and postgraduate programs across 7 premier departments. Submit your online application, upload verified credentials, and generate your printable QR Admit Card.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => handleTabChange('apply')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-lg"
            >
              {isBn ? 'অনলাইনে আবেদন করুন' : 'Apply Online Now'}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => handleTabChange('status')}
              leftIcon={<Search className="w-4 h-4" />}
              className="border-white/30 text-white hover:bg-white/10"
            >
              {isBn ? 'আবেদন স্ট্যাটাস ও প্রবেশপত্র' : 'Track Status / Admit Card'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-[#E2E8F0] gap-4 sm:gap-8 overflow-x-auto">
        <button
          onClick={() => handleTabChange('overview')}
          className={`pb-4 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isBn ? 'ভর্তি নির্দেশিকা ও তথ্য' : 'Admission Guidelines & Overview'}</span>
        </button>

        <button
          onClick={() => handleTabChange('apply')}
          className={`pb-4 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'apply'
              ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>{isBn ? 'অনলাইন আবেদন ফরম' : 'Online Application Form'}</span>
        </button>

        <button
          onClick={() => handleTabChange('status')}
          className={`pb-4 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'status'
              ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>{isBn ? 'আবেদন স্ট্যাটাস ও প্রবেশপত্র' : 'Check Application Status'}</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & GUIDELINES */}
      {activeTab === 'overview' && (
        <div className="space-y-16 animate-fadeIn">
          {/* Quick Stats Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-5 border border-[#E2E8F0] bg-[#F8FAFC]">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
                {isBn ? 'মোট অনুষদ ও বিভাগ' : 'Faculties & Depts'}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1 block">
                7 Departments
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">CSE, EEE, MATH, FISH, GEOL, MGMT, SW</span>
            </Card>

            <Card className="p-5 border border-[#E2E8F0] bg-[#F8FAFC]">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
                {isBn ? 'মোট আসন সংখ্যা (Demo)' : 'Total Intake Capacity'}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A] mt-1 block">
                340+ Seats
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Undergrad Regular + Quotas</span>
            </Card>

            <Card className="p-5 border border-[#E2E8F0] bg-[#F8FAFC]">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
                {isBn ? 'আবেদন ফি (প্রতি ইউনিট)' : 'Application Fee'}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#B45309] mt-1 block">
                ৳ 1,200
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">bKash, Nagad, Rocket, Cards</span>
            </Card>

            <Card className="p-5 border border-[#E2E8F0] bg-[#F8FAFC]">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
                {isBn ? 'আবেদনের শেষ সময়' : 'Application Deadline'}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-red-700 mt-1 block">
                Dec 10, 2026
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">11:59 PM BST</span>
            </Card>
          </div>

          {/* SECTION 1: PROGRAMS TABLE */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  {isBn ? 'প্রোগ্রাম ও আসন বিন্যাস' : 'Academic Programs & Intake Capacity'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {isBn
                    ? 'অনুষদ ও বিভাগ অনুযায়ী নিয়মিত এবং কোটা আসন সংখ্যা ও আবশ্যক বিষয়সমূহ'
                    : 'Degree offerings, duration, intake capacity, and prerequisite subject criteria across 7 departments.'}
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <select
                  value={programLevelFilter}
                  onChange={(e) => setProgramLevelFilter(e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 bg-white"
                >
                  <option value="all">{isBn ? 'সকল পর্যায়' : 'All Levels'}</option>
                  <option value="Undergraduate">{isBn ? 'স্নাতক (Undergraduate)' : 'Undergraduate'}</option>
                  <option value="Postgraduate">{isBn ? 'স্নাতকোত্তর (Postgraduate)' : 'Postgraduate'}</option>
                </select>

                <select
                  value={unitFilter}
                  onChange={(e) => setUnitFilter(e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 bg-white"
                >
                  <option value="all">{isBn ? 'সকল ইউনিট' : 'All Units'}</option>
                  <option value="UNIT_A">Unit A (Science & Engg)</option>
                  <option value="UNIT_B">Unit B (Social Sciences)</option>
                  <option value="UNIT_C">Unit C (Business Studies)</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto bg-white border border-[#E2E8F0] rounded-2xl shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#F8FAFC] text-slate-700 border-b border-[#E2E8F0] font-semibold">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Degree & Department</th>
                    <th className="py-3.5 px-4 sm:px-6">Unit</th>
                    <th className="py-3.5 px-4 sm:px-6">Duration</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Regular Seats</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Quota Seats</th>
                    <th className="py-3.5 px-4 sm:px-6">Prerequisites</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-slate-600">
                  {filteredPrograms.map((prog) => (
                    <tr key={prog.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="font-bold text-[#0F172A] block text-sm">
                          {prog.degreeName}
                        </span>
                        <span className="text-xs text-slate-500">
                          {isBn ? prog.departmentNameBn : prog.departmentName} &bull;{' '}
                          <span className="text-[#1E3A8A] font-semibold">{prog.departmentCode}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="px-2 py-1 rounded bg-blue-50 text-[#1E3A8A] font-mono text-xs font-bold">
                          {prog.unit.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        {prog.durationYears} Years ({prog.totalSemesters} Semesters)
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right font-bold text-[#0F172A] tabular-nums">
                        {prog.regularSeats}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right text-slate-500 tabular-nums">
                        {prog.quotaSeats}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-xs text-slate-600">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-800 block">
                            Min HSC: {prog.minHscGpa.toFixed(2)} | Comb: {prog.minCombinedGpa.toFixed(2)}
                          </span>
                          <span className="text-slate-500 block truncate max-w-xs">
                            {prog.requiredHscSubjects.join(', ')}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 2: ELIGIBILITY REQUIREMENTS */}
          <div className="space-y-6">
            <div className="border-b border-[#E2E8F0] pb-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                {isBn ? 'ইউনিটভিত্তিক আবেদনের যোগ্যতা' : 'Eligibility & Admission Criteria'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isBn
                  ? 'বিজ্ঞান, মানবিক, ব্যবসায় শিক্ষা এবং সংরক্ষিত কোটাসমূহের জন্য নির্ধারিত ন্যূনতম শর্তাবলী'
                  : 'Minimum academic thresholds, subject prerequisite requirements, and second-time policy.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Unit A */}
              <Card className="p-6 space-y-4 border-t-4 border-t-blue-600">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    UNIT A (SCIENCE)
                  </span>
                  <span className="text-xs text-slate-400">Engineering & Science</span>
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Faculty of Engineering, Science & Bio-Technology
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Eligible for CSE, EEE, Mathematics, Fisheries & Marine Bioscience, and Geology & Petroleum Engineering.
                </p>
                <div className="space-y-2 pt-2 border-t border-[#E2E8F0] text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Minimum SSC GPA:</span>
                    <strong className="text-slate-900">3.50 (with 4th subject)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum HSC GPA:</span>
                    <strong className="text-slate-900">3.50 (Combined 8.00)</strong>
                  </div>
                  <div className="pt-1">
                    <span className="font-semibold block text-slate-800">Compulsory HSC Subjects:</span>
                    <span className="text-slate-500">Physics, Chemistry, Higher Mathematics, Biology (for Fish).</span>
                  </div>
                </div>
              </Card>

              {/* Unit B */}
              <Card className="p-6 space-y-4 border-t-4 border-t-emerald-600">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    UNIT B (HUMANITIES)
                  </span>
                  <span className="text-xs text-slate-400">Social Sciences</span>
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Faculty of Arts & Social Sciences
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Eligible for Bachelor of Social Sciences (BSS Honours) in the Department of Social Work.
                </p>
                <div className="space-y-2 pt-2 border-t border-[#E2E8F0] text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Minimum SSC GPA:</span>
                    <strong className="text-slate-900">3.00 (with 4th subject)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum HSC GPA:</span>
                    <strong className="text-slate-900">3.00 (Combined 6.50)</strong>
                  </div>
                  <div className="pt-1">
                    <span className="font-semibold block text-slate-800">Prerequisite Subjects:</span>
                    <span className="text-slate-500">English, Social Work, Civics, Economics, or History.</span>
                  </div>
                </div>
              </Card>

              {/* Unit C */}
              <Card className="p-6 space-y-4 border-t-4 border-t-amber-600">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    UNIT C (COMMERCE)
                  </span>
                  <span className="text-xs text-slate-400">Business Studies</span>
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Faculty of Business Studies
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Eligible for Bachelor of Business Administration (BBA) in Management Studies.
                </p>
                <div className="space-y-2 pt-2 border-t border-[#E2E8F0] text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Minimum SSC GPA:</span>
                    <strong className="text-slate-900">3.00 (with 4th subject)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum HSC GPA:</span>
                    <strong className="text-slate-900">3.00 (Combined 7.00)</strong>
                  </div>
                  <div className="pt-1">
                    <span className="font-semibold block text-slate-800">Compulsory HSC Subjects:</span>
                    <span className="text-slate-500">Accounting, Business Organization & Management, or Economics.</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quota & Second-Time Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl space-y-2 text-xs text-blue-950">
                <h4 className="font-bold flex items-center gap-1.5 text-[#1E3A8A]">
                  <Sparkles className="w-4 h-4" />
                  <span>{isBn ? 'দ্বিতীয়বার ভর্তি পরীক্ষা (Second Time Admission)' : 'Second-Time Admission Policy'}</span>
                </h4>
                <p className="leading-relaxed text-blue-900">
                  {isBn
                    ? '২০২৪ এবং ২০২৫ সালে উচ্চ মাধ্যমিক বা সমমান উত্তীর্ণ শিক্ষার্থীরা কোনো নম্বর কর্তন ছাড়াই সকল ইউনিটে আবেদন করার সুযোগ পাবেন।'
                    : 'Candidates who completed HSC in either 2024 or 2025 are eligible. No marks will be deducted for second-time applicants across undergraduate faculties.'}
                </p>
              </div>

              <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs text-amber-950">
                <h4 className="font-bold flex items-center gap-1.5 text-amber-800">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{isBn ? 'সংরক্ষিত কোটা নির্দেশিকা' : 'Quota Policy & Documents'}</span>
                </h4>
                <p className="leading-relaxed text-amber-900">
                  {isBn
                    ? 'মুক্তিযোদ্ধা (৫%), ক্ষুদ্র নৃ-গোষ্ঠী (২%), শারীরিক প্রতিবন্ধী (১%) ও পোষ্য কোটার প্রার্থীদের আবেদনের সময় উপযুক্ত সরকারি প্রত্যয়নপত্র বা গেজেটের কপি আপলোড করতে হবে।'
                    : 'Freedom Fighter (5%), Tribal/Ethnic Minorities (2%), and Persons with Disability (1%) applicants must attach authenticated gazette certificates during form submission.'}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: PROCESS STEPS */}
          <div className="space-y-6">
            <div className="border-b border-[#E2E8F0] pb-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                {isBn ? 'ভর্তি আবেদন প্রক্রিয়া' : 'Step-by-Step Admission Process'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isBn
                  ? 'অনলাইন আবেদন থেকে শুরু করে চূড়ান্ত ক্লাস শুরুর ধারাবাহিক পদক্ষেপসমূহ'
                  : 'From eligibility verification and form submission to admit card download and viva voce.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: isBn ? 'যোগ্যতা যাচাই ও ইউনিট নির্বাচন' : '1. Check Eligibility & Unit',
                  desc: isBn
                    ? 'এসএসসি ও এইচএসসি ফলাফল এবং কাঙ্ক্ষিত অনুষদের ন্যূনতম গ্রেড পয়েন্ট শর্তাবলী মিলিয়ে দেখুন।'
                    : 'Verify your SSC & HSC GPAs against unit thresholds (Unit A, Unit B, or Unit C).'
                },
                {
                  step: '02',
                  title: isBn ? 'অনলাইন আবেদন ও নথি আপলোড' : '2. Online Form & Uploads',
                  desc: isBn
                    ? 'ব্যক্তিগত তথ্য, শিক্ষাগত রেকর্ড পূরণ করে ছবি, স্বাক্ষর ও মার্কশিট আপলোড করুন।'
                    : 'Complete personal details, priority choices, and upload photo, signature, and transcripts.'
                },
                {
                  step: '03',
                  title: isBn ? 'আবেদন ফি ও রেফারেন্স নম্বর' : '3. Processing & Reference No.',
                  desc: isBn
                    ? 'সেন্ট্রাল পেমেন্ট গেটওয়েতে ফি প্রদান করে তাৎক্ষণিক রেফারেন্স নম্বর ও খসড়া স্লিপ সংগ্রহ করুন।'
                    : 'Receive your unique reference number (e.g. JSTU-ADM-2026-XXXX) for status tracking.'
                },
                {
                  step: '04',
                  title: isBn ? 'রেজিস্ট্রার কর্তৃক স্ক্রুটিনি' : '4. Scrutiny by Registrar',
                  desc: isBn
                    ? 'রেজিস্ট্রার দপ্তর আপলোডকৃত সনদসমূহ যাচাই করে প্রাথমিক সংক্ষিপ্ত তালিকা প্রকাশ করবে।'
                    : 'Registrar secretariat verifies board credentials and approves primary candidates.'
                },
                {
                  step: '05',
                  title: isBn ? 'কিউআর প্রবেশপত্র ও পরীক্ষা' : '5. QR Admit Card & Test',
                  desc: isBn
                    ? 'অনলাইন থেকে কিউআর কোড সংবলিত প্রবেশপত্র রঙিন প্রিন্ট নিয়ে নির্ধারিত পরীক্ষা কেন্দ্রে অংশ নিন।'
                    : 'Download verifiable A4 Admit Card PDF with test roll and assigned exam hall.'
                },
                {
                  step: '06',
                  title: isBn ? 'মেধাতালিকা ও চূড়ান্ত ভর্তি' : '6. Merit List, Viva & Classes',
                  desc: isBn
                    ? 'মেধাতালিকা অনুযায়ী ভাইভা ও সনদ প্রদর্শন শেষে বিভাগীয় ওরিয়েন্টেশনের মাধ্যমে ক্লাস শুরু।'
                    : 'Subject allocation based on merit rank, physical viva verification, and orientation.'
                }
              ].map((item) => (
                <Card key={item.step} className="p-6 relative bg-white border border-[#E2E8F0] space-y-3">
                  <span className="text-3xl font-black font-mono text-slate-200">
                    {item.step}
                  </span>
                  <h3 className="text-base font-bold text-[#0F172A]">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* SECTION 4: FEES STRUCTURE TABLE */}
          <div className="space-y-6">
            <div className="border-b border-[#E2E8F0] pb-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                {isBn ? 'ফি ও খরচের বিবরণী' : 'Official Fees & Financial Schedule'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isBn
                  ? 'আবেদন ফি, সেমিস্টার টিউশন ফি, ল্যাব ও আবাসিক হলের সরকারি ফি কাঠামো'
                  : 'Transparent institutional cost breakdown for undergraduate and postgraduate studies.'}
              </p>
            </div>

            <div className="overflow-x-auto bg-white border border-[#E2E8F0] rounded-2xl shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#F8FAFC] text-slate-700 border-b border-[#E2E8F0] font-semibold">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Fee Category</th>
                    <th className="py-3.5 px-4 sm:px-6">Frequency</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Amount (BDT)</th>
                    <th className="py-3.5 px-4 sm:px-6">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-slate-600">
                  {admissionFeesData.map((fee, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4 sm:px-6 font-semibold text-[#0F172A]">
                        {isBn ? fee.categoryBn : fee.category}
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-slate-500">
                        {isBn ? fee.frequencyBn : fee.frequency}
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-right font-bold font-mono text-[#1E3A8A]">
                        ৳ {fee.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-xs text-slate-500">
                        {isBn ? fee.descriptionBn : fee.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 5: IMPORTANT DATES */}
          <div className="space-y-6">
            <div className="border-b border-[#E2E8F0] pb-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                {isBn ? 'ভর্তি পরীক্ষার সময়সূচি' : 'Important Admission Dates & Milestones'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isBn
                  ? 'আবেদন শুরু থেকে ক্লাস শুরুর তারিখ পর্যন্ত সকল গুরুত্বপূর্ণ দিনক্ষণ'
                  : 'Official schedule for the academic year 2026-2027.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {admissionDatesData.map((d, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#0F172A] block">
                      {isBn ? d.eventBn : d.event}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[#1E3A8A]" />
                      <span>{isBn ? d.dateStrBn : d.dateStr}</span>
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                      d.status === 'ongoing'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                        : d.status === 'completed'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {d.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6: ADMISSION FAQ ACCORDION */}
          <div className="space-y-6">
            <div className="border-b border-[#E2E8F0] pb-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                {isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)' : 'Frequently Asked Questions (FAQ)'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isBn
                  ? 'ভর্তি সংক্রান্ত সাধারণ জিজ্ঞাসা ও সমাধান'
                  : 'Common questions regarding units, second-time tests, quota documents, and admit cards.'}
              </p>
            </div>

            <div className="space-y-3">
              {admissionFaqData.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <Card key={idx} className="border border-[#E2E8F0] bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <span className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                        <span>{isBn ? faq.questionBn : faq.question}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isOpen ? 'rotate-180 text-[#1E3A8A]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {isBn ? faq.answerBn : faq.answer}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Bottom Action CTA */}
          <Card className="p-8 sm:p-12 text-center bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 rounded-3xl space-y-4">
            <h3 className="text-2xl font-extrabold text-[#0F172A]">
              {isBn ? 'আজই জেএসটিইউ-তে আপনার আবেদন সম্পন্ন করুন' : 'Ready to Begin Your Academic Journey at JSTU?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              {isBn
                ? 'অনলাইন সিস্টেমে ৫টি ধাপে আপনার আবেদন দাখিল করুন এবং প্রবেশপত্র সংগ্রহ করে পরীক্ষায় অংশগ্রহণের প্রস্তুতি নিন।'
                : 'Fill in your academic profile, choose your preferred departments, upload credentials, and secure your examination pass.'}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleTabChange('apply')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isBn ? 'অনলাইন আবেদন শুরু করুন' : 'Start Online Application'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: ONLINE APPLICATION FORM */}
      {activeTab === 'apply' && (
        <div className="space-y-6">
          <OnlineAdmissionApplicationForm onCheckStatusRequest={handleJumpToStatusCheck} />
        </div>
      )}

      {/* TAB 3: CHECK STATUS */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          <AdmissionStatusCheck initialRef={lookupRef} initialEmail={lookupEmail} />
        </div>
      )}
    </div>
  );
};
