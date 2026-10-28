import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  RefreshCw,
  Tag
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { useLanguage } from '../../contexts/LanguageContext';
import { academicCalendarEvents } from '../../data/academicsSeedData';

export const AcademicCalendarPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // View state: 'month' | 'list'
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

  // Month navigation: 2026 (0 = Jan, 11 = Dec)
  const [currentMonth, setCurrentMonth] = useState<number>(0); // January 2026 default
  const currentYear = 2026;

  // Selected day in month view for event details
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(18); // Default to Jan 18 (Classes start)

  // List filters
  const [selectedTerm, setSelectedTerm] = useState<'All' | 'Spring 2026' | 'Fall 2026'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(timer);
  }, []);

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const daysOfWeekEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysOfWeekBn = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

  // Calculate calendar grid days for currentMonth (0-11) of 2026
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Helper to format date string YYYY-MM-DD
  const formatIsoDate = (year: number, month: number, day: number) => {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    return `${year}-${mStr}-${dStr}`;
  };

  // Find events occurring on a particular date or in range
  const getEventsForDate = (year: number, month: number, day: number) => {
    const dateStr = formatIsoDate(year, month, day);
    return academicCalendarEvents.filter((evt) => {
      if (evt.date === dateStr) return true;
      if (evt.endDate && evt.date <= dateStr && evt.endDate >= dateStr) return true;
      return false;
    });
  };

  // Events in currently selected day of month
  const selectedDayEvents = selectedDayNumber
    ? getEventsForDate(currentYear, currentMonth, selectedDayNumber)
    : [];

  // Filtered events for list view
  const filteredEvents = academicCalendarEvents.filter((evt) => {
    const matchesTerm = selectedTerm === 'All' || evt.term === selectedTerm;
    const matchesCat = selectedCategory === 'All' || evt.category === selectedCategory;
    const matchesQuery =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.titleBn.includes(searchQuery) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.descriptionBn.includes(searchQuery);
    return matchesTerm && matchesCat && matchesQuery;
  });

  const categories = [
    'All',
    'Registration',
    'Classes',
    'Midterm',
    'Final Exam',
    'Recess',
    'Holiday',
    'Convocation'
  ];

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    setSelectedDayNumber(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    setSelectedDayNumber(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Registration':
        return 'bg-blue-500 text-white';
      case 'Classes':
        return 'bg-emerald-500 text-white';
      case 'Midterm':
        return 'bg-amber-500 text-white';
      case 'Final Exam':
        return 'bg-rose-500 text-white';
      case 'Recess':
        return 'bg-indigo-500 text-white';
      case 'Holiday':
        return 'bg-purple-500 text-white';
      case 'Convocation':
        return 'bg-yellow-500 text-slate-900';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 bg-white">
      <SEOHead
        title={isBn ? 'একাডেমিক ক্যালেন্ডার ২০২৬' : 'Academic Calendar 2026 | JSTU'}
        description="Official interactive academic calendar for Spring and Fall semesters 2026 at Jamalpur Science & Technology University."
      />

      <Breadcrumb
        items={[
          { label: isBn ? 'একাডেমিক' : 'Academics', to: '/academics' },
          { label: isBn ? 'একাডেমিক ক্যালেন্ডার' : 'Academic Calendar' }
        ]}
      />

      {/* Institutional Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>[REPLACE WITH REAL CONTENT]</strong> {isBn ? 'একাডেমিক ক্যালেন্ডারের সময়সূচি ও পরীক্ষার তারিখ খসড়া রূপরেখা অনুযায়ী প্রদর্শিত।' : 'Academic calendar milestone dates and examination weeks are design prototypes.'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded shrink-0">
          Gazette Pending
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="font-mono text-[#1E3A8A] font-bold text-sm bg-[#EFF6FF] px-2.5 py-1 rounded-md">
            Session 2026
          </span>
          <span>·</span>
          <span>{isBn ? 'স্প্রিং ও ফল সেমিস্টার' : 'Spring & Fall Semester Schedules'}</span>
          <span>·</span>
          <span>{isBn ? 'অনুমোদিত: একাডেমিক কাউন্সিল' : 'Approved by Academic Council'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          {isBn ? 'জেএসটিইউ একাডেমিক ক্যালেন্ডার ২০২৬' : 'JSTU Academic Calendar 2026'}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-4xl leading-relaxed">
          {isBn
            ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের স্নাতক ও স্নাতকোত্তর শিক্ষাবর্ষের সেমিস্টার রেজিস্ট্রেশন, পাঠদান, মিডটার্ম ও চূড়ান্ত পরীক্ষার সময়সূচি।'
            : 'Explore scheduled statutory academic milestones including course advising, term commencement, midterm examinations, recesses, and terminal assessments.'}
        </p>

        {/* Action Controls & PDF Download */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="#download-calendar"
            onClick={(e) => {
              e.preventDefault();
              const content = `JAMALPUR SCIENCE & TECHNOLOGY UNIVERSITY (JSTU)\nOfficial Academic Calendar 2026\n/* [REPLACE WITH REAL CONTENT] Gazette verified calendar PDF */\nSpring 2026 Term: January - June 2026\nFall 2026 Term: July - December 2026\n`;
              const blob = new Blob([content], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'JSTU_Academic_Calendar_2026.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-[#1E3A8A] text-white hover:bg-[#172554] transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isBn ? 'ক্যালেন্ডার ডাউনলোড (PDF)' : 'Download Calendar (PDF)'}</span>
          </a>
          <Link to="/academics/routine">
            <Button size="sm" variant="outline" leftIcon={<Clock className="w-3.5 h-3.5" />}>
              {isBn ? 'সাপ্তাহিক ক্লাস রুটিন' : 'Class Routine'}
            </Button>
          </Link>
        </div>
      </div>

      {/* View Switcher Bar: Month View vs List of Important Dates */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              viewMode === 'month'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-[#E2E8F0]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{isBn ? 'মাসিক ভিউ (Month View)' : 'Month View Grid'}</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-[#E2E8F0]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>{isBn ? 'গুরুত্বপূর্ণ তারিখের তালিকা' : 'Important Dates List'}</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          {viewMode === 'month'
            ? isBn ? 'যেকোনো দিনে ক্লিক করে ইভেন্ট বিবরণ দেখুন' : 'Click on any highlighted day to inspect milestones'
            : isBn ? `${filteredEvents.length} টি নির্ধারিত ইভেন্ট` : `${filteredEvents.length} scheduled calendar milestones`}
        </span>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6">
          <SkeletonLoader variant="rectangular" className="h-96 w-full rounded-2xl" />
        </div>
      )}

      {/* Error Fallback */}
      {!isLoading && hasError && (
        <Card padding="lg" className="text-center py-10 space-y-3 border-red-200">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-sm font-bold text-slate-800">
            {isBn ? 'ক্যালেন্ডার লোড করা সম্ভব হয়নি' : 'Failed to load calendar events'}
          </p>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => {
              setIsLoading(true);
              setHasError(false);
              setTimeout(() => setIsLoading(false), 150);
            }}
          >
            {isBn ? 'পুনরায় চেষ্টা' : 'Retry'}
          </Button>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* 1. MONTH VIEW */}
      {/* ===================================================================== */}
      {!isLoading && !hasError && viewMode === 'month' && (
        <div className="space-y-6">
          {/* Month Navigation Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                aria-label="Previous Month"
                className="p-2 rounded-xl border border-[#E2E8F0] hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="min-w-[180px] text-center sm:text-left">
                <h2 className="text-xl font-extrabold text-[#0F172A]">
                  {isBn ? monthNamesBn[currentMonth] : monthNamesEn[currentMonth]} {currentYear}
                </h2>
                <span className="text-xs text-slate-500">
                  {currentMonth < 6 ? (isBn ? 'স্প্রিং সেমিস্টার' : 'Spring Semester') : (isBn ? 'ফল সেমিস্টার' : 'Fall Semester')}
                </span>
              </div>

              <button
                onClick={handleNextMonth}
                aria-label="Next Month"
                className="p-2 rounded-xl border border-[#E2E8F0] hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Month Selector Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">{isBn ? 'মাস নির্বাচন:' : 'Jump to:'}</span>
              <select
                value={currentMonth}
                onChange={(e) => {
                  setCurrentMonth(Number(e.target.value));
                  setSelectedDayNumber(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#E2E8F0] bg-white text-slate-800 focus:outline-none focus:border-[#1E3A8A]"
              >
                {monthNamesEn.map((m, idx) => (
                  <option key={idx} value={idx}>
                    {isBn ? monthNamesBn[idx] : m} 2026
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Calendar Grid & Selected Day Inspector (Split Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* The 7-Column Calendar Grid */}
            <div className="lg:col-span-2 border border-[#E2E8F0] rounded-2xl p-4 bg-white shadow-2xs space-y-2">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-500 pb-2 border-b border-[#E2E8F0]">
                {(isBn ? daysOfWeekBn : daysOfWeekEn).map((d, di) => (
                  <div key={di} className={di === 5 || di === 6 ? 'text-amber-700' : ''}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Days Matrix */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-1">
                {/* Empty cells before month begins */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[64px] sm:min-h-[80px] rounded-xl bg-slate-50/50 p-1" />
                ))}

                {/* Days of current month */}
                {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((dayNum) => {
                  const dayEvents = getEventsForDate(currentYear, currentMonth, dayNum);
                  const isSelected = selectedDayNumber === dayNum;
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedDayNumber(dayNum)}
                      className={`min-h-[64px] sm:min-h-[80px] p-1.5 sm:p-2 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#1E3A8A] bg-[#EFF6FF] ring-2 ring-[#1E3A8A]/30'
                          : hasEvents
                          ? 'border-slate-300 bg-white hover:bg-slate-50 shadow-2xs'
                          : 'border-[#F1F5F9] bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`text-xs font-bold font-mono ${
                            isSelected
                              ? 'text-[#1E3A8A]'
                              : hasEvents
                              ? 'text-[#0F172A]'
                              : 'text-slate-400'
                          }`}
                        >
                          {dayNum}
                        </span>
                        {hasEvents && (
                          <span className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
                        )}
                      </div>

                      {/* Event Snippets */}
                      <div className="space-y-0.5 w-full overflow-hidden">
                        {dayEvents.slice(0, 1).map((e) => (
                          <div
                            key={e.id}
                            className={`text-[9px] sm:text-[10px] font-semibold px-1 py-0.5 rounded truncate ${getCategoryColor(
                              e.category
                            )}`}
                          >
                            {isBn ? e.titleBn : e.title}
                          </div>
                        ))}
                        {dayEvents.length > 1 && (
                          <span className="text-[9px] text-slate-500 font-bold block truncate">
                            +{dayEvents.length - 1} more
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Day Inspector Panel */}
            <div className="space-y-4">
              <Card padding="lg" className="space-y-4 bg-slate-50 border border-[#E2E8F0]">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {isBn ? 'নির্বাচিত তারিখ' : 'Selected Date'}
                    </span>
                    <h3 className="text-base font-bold text-[#0F172A]">
                      {selectedDayNumber !== null
                        ? `${selectedDayNumber} ${isBn ? monthNamesBn[currentMonth] : monthNamesEn[currentMonth]} ${currentYear}`
                        : isBn ? 'তারিখ নির্বাচন করুন' : 'Select a date'}
                    </h3>
                  </div>
                  <CalendarIcon className="w-5 h-5 text-[#1E3A8A]" />
                </div>

                {selectedDayNumber === null ? (
                  <p className="text-xs text-slate-500 italic py-6 text-center">
                    {isBn ? 'ক্যালেন্ডার গ্রিড থেকে কোনো দিনে ক্লিক করুন।' : 'Click on any day in the calendar grid to inspect events.'}
                  </p>
                ) : selectedDayEvents.length === 0 ? (
                  <div className="text-center py-6 space-y-1">
                    <p className="text-xs font-bold text-slate-700">
                      {isBn ? 'এই দিনে কোনো নির্ধারিত ইভেন্ট নেই' : 'No Scheduled Events on this Day'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {isBn ? 'নিয়মিত ক্লাস বা প্রশাসনিক কার্যক্রম যথারীতি চলবে।' : 'Regular classes or administrative hours continue as scheduled.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${getCategoryColor(
                              evt.category
                            )}`}
                          >
                            {isBn ? evt.categoryBn : evt.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {isBn ? evt.termBn : evt.term}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-[#0F172A]">
                          {isBn ? evt.titleBn : evt.title}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {isBn ? evt.descriptionBn : evt.description}
                        </p>

                        <div className="pt-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded inline-block font-mono">
                          [REPLACE WITH REAL CONTENT]
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Monthly Overview Snapshot */}
              <Card padding="md" className="space-y-2 text-xs bg-white">
                <span className="font-bold text-[#0F172A] block">
                  {isBn ? 'মাসিক সারসংক্ষেপ:' : 'Month Milestone Snapshot:'}
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {isBn
                    ? `এই মাসে মোট ${getEventsForDate(currentYear, currentMonth, 1).length + 2}টি প্রাতিষ্ঠানিক কার্যক্রম ও সরকারি ছুটির দিন রয়েছে।`
                    : `Academic operations and examinations in this calendar period are administered by the Office of the Controller of Examinations.`}
                </p>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. LIST OF IMPORTANT DATES */}
      {/* ===================================================================== */}
      {!isLoading && !hasError && viewMode === 'list' && (
        <div className="space-y-6">
          {/* Term & Category Filter Ribbon */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-[#E2E8F0] space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Term Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 shrink-0">
                  {isBn ? 'সেমিস্টার সেশন:' : 'Academic Term:'}
                </span>
                {(['All', 'Spring 2026', 'Fall 2026'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTerm(t)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      selectedTerm === t
                        ? 'bg-[#1E3A8A] text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-[#E2E8F0]'
                    }`}
                  >
                    {t === 'All' ? (isBn ? 'সকল সেশন' : 'All Terms') : t}
                  </button>
                ))}
              </div>

              {/* Search box */}
              <div className="relative w-full md:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={isBn ? 'ইভেন্ট বা তারিখ খুঁজুন...' : 'Search milestone or date...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#1E3A8A] bg-white text-slate-800"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
              <span className="text-xs font-bold text-slate-500 mr-1 shrink-0">
                {isBn ? 'ক্যাটাগরি:' : 'Category:'}
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-slate-800 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-[#E2E8F0]'
                  }`}
                >
                  {cat === 'All' ? (isBn ? 'সকল' : 'All') : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline List */}
          {filteredEvents.length === 0 ? (
            <EmptyState
              title={isBn ? 'কোনো ইভেন্ট পাওয়া যায়নি' : 'No Events Found'}
              description={isBn ? 'আপনার নির্বাচিত ফিল্টারের জন্য কোনো মাইলফলক নেই।' : 'No calendar events match the current criteria.'}
              actionLabel={isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
              onAction={() => {
                setSelectedTerm('All');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((evt) => (
                <Card
                  key={evt.id}
                  padding="md"
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#1E3A8A] transition-all bg-white"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#1E3A8A] flex flex-col items-center justify-center shrink-0 border border-[#DBEAFE]">
                      <CalendarIcon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono font-bold text-[#1E3A8A]">
                          {isBn ? evt.dateBn : evt.date}
                          {evt.endDate && ` – ${isBn ? evt.endDateBn : evt.endDate}`}
                        </span>
                        <span>·</span>
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">
                          {isBn ? evt.categoryBn : evt.category}
                        </span>
                        <span>·</span>
                        <span className="text-slate-400">{isBn ? evt.termBn : evt.term}</span>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
                          [REPLACE]
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#0F172A]">
                        {isBn ? evt.titleBn : evt.title}
                      </h3>

                      <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                        {isBn ? evt.descriptionBn : evt.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Statutory Rules & Exam Policies Note */}
      <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] text-xs text-slate-600 space-y-1">
        <p className="font-bold text-[#0F172A]">
          {isBn ? 'একাডেমিক ক্যালেন্ডার নিয়মাবলী:' : 'Academic Regulation Advisory:'}
        </p>
        <p>
          [REPLACE WITH REAL CONTENT] {isBn
            ? 'সেমিস্টার ফাইনাল পরীক্ষায় অংশ নেওয়ার জন্য ন্যূনতম ৭৫% ক্লাস উপস্থিতি বাধ্যতামূলক। অনিবার্য কারণে পরীক্ষার সময়সূচি পরিবর্তনের ক্ষমতা পরীক্ষা নিয়ন্ত্রক দপ্তর সংরক্ষণ করে।'
            : 'A minimum of 75% class attendance is mandatory to appear in semester terminal examinations. The Office of the Controller of Examinations reserves the right to revise schedules under unavoidable campus circumstances.'}
        </p>
      </div>
    </div>
  );
};
