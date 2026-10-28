import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  Building2,
  Download,
  Filter,
  Search,
  BookOpen,
  UserCheck,
  MapPin,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  LayoutGrid,
  List
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { useLanguage } from '../../contexts/LanguageContext';
import { departmentsData, classRoutinesData } from '../../data/academicsSeedData';

export const ClassRoutinePage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Department & Semester Selection
  const [selectedDept, setSelectedDept] = useState<string>('cse');
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>(1);
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [routineLayout, setRoutineLayout] = useState<'grid' | 'cards'>('grid');

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [selectedDept, selectedSemester]);

  const currentDept = departmentsData.find((d) => d.id === selectedDept) || departmentsData[0];

  const daysOfWeek = ['All', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const timetableDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  const timeSlots = [
    { label: '09:00 AM - 10:15 AM', labelBn: '০৯:০০ - ১০:১৫ মি.' },
    { label: '10:30 AM - 11:45 AM', labelBn: '১০:৩০ - ১১:৪৫ মি.' },
    { label: '01:30 PM - 04:30 PM', labelBn: '০১:৩০ - ০৪:৩০ মি.' }
  ];

  const filteredSlots = classRoutinesData.filter((slot) => {
    const matchesDept = slot.departmentId === selectedDept;
    const matchesSem = selectedSemester === 'all' || slot.semester === selectedSemester;
    const matchesDay = selectedDay === 'All' || slot.dayOfWeek === selectedDay;
    const matchesSearch =
      slot.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSem && matchesDay && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 bg-white">
      <SEOHead
        title={isBn ? 'সাপ্তাহিক ক্লাস রুটিন' : 'Class Routine | JSTU'}
        description="Official weekly class schedules and lecture room distribution for all 7 academic departments."
      />

      <Breadcrumb
        items={[
          { label: isBn ? 'একাডেমিক' : 'Academics', to: '/academics' },
          { label: isBn ? 'ক্লাস রুটিন' : 'Class Routine' }
        ]}
      />

      {/* Institutional Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>[REPLACE WITH REAL CONTENT]</strong> {isBn ? 'সকল সেমিস্টারের ক্লাস রুটিন ও কক্ষ বরাদ্দ খসড়া রূপরেখা হিসেবে প্রকাশিত।' : 'Class schedules and room distributions are structural prototypes.'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded shrink-0">
          Timetable 2026
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="font-mono text-[#1E3A8A] font-bold text-sm bg-[#EFF6FF] px-2.5 py-1 rounded-md">
            Routine 2026
          </span>
          <span>·</span>
          <span>{isBn ? 'সাপ্তাহিক ক্লাস শিডিউল' : 'Weekly Class Schedules'}</span>
          <span>·</span>
          <span>{isBn ? 'রবিবার হতে বৃহস্পতিবার' : 'Sunday through Thursday'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          {isBn ? 'বিভাগীয় ক্লাস রুটিন ও লেকচার সময়সূচি' : 'Departmental Class Routine & Timetable'}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-4xl leading-relaxed">
          {isBn
            ? 'জেএসটিইউ-এর সকল বিভাগের সেমিস্টারভিত্তিক ক্লাস, ল্যাবরেটরি ও শিক্ষক কাউন্সেলিং সেশনের সময়সূচি।'
            : 'Access lecture time slots, lab session allocations, instructor names, and room assignments for all 7 academic departments.'}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Download Routine PDF */}
          <a
            href="#download-routine"
            onClick={(e) => {
              e.preventDefault();
              const content = `JAMALPUR SCIENCE & TECHNOLOGY UNIVERSITY (JSTU)\nOfficial Class Routine - ${currentDept?.name}\nSemester: ${selectedSemester}\nAcademic Year: 2026\n/* [REPLACE WITH REAL CONTENT] Departmental verified routine PDF */\n`;
              const blob = new Blob([content], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `JSTU_Class_Routine_${currentDept?.id || selectedDept}_Sem${selectedSemester}.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-[#1E3A8A] text-white hover:bg-[#172554] transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isBn ? 'রুটিন ডাউনলোড (PDF)' : 'Download Routine (PDF)'}</span>
          </a>
          <Link to="/academics/calendar">
            <Button size="sm" variant="outline" leftIcon={<Calendar className="w-3.5 h-3.5" />}>
              {isBn ? 'একাডেমিক ক্যালেন্ডার' : 'Academic Calendar'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Control Ribbon: Department Selector + Semester + Day Filter */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-[#E2E8F0] space-y-5">
        {/* Department Selector */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {isBn ? '১. শিক্ষা বিভাগ নির্বাচন করুন (৭টি বিভাগ):' : '1. Select Academic Department (All 7 Departments):'}
          </span>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {departmentsData.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDept(d.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer shrink-0 ${
                  selectedDept === d.id
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-[#E2E8F0]'
                }`}
              >
                <span className="font-mono mr-1.5 font-bold">{d.code}</span>
                <span>{isBn ? d.nameBn.split(' ')[0] : d.name.replace('Department of ', '')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Semester Selector */}
        <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {isBn ? '২. সেমিস্টার নির্বাচন করুন:' : '2. Select Semester:'}
          </span>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <button
              onClick={() => setSelectedSemester('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0 ${
                selectedSemester === 'all'
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-[#E2E8F0]'
              }`}
            >
              {isBn ? 'সকল সেমিস্টার' : 'All Semesters'}
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0 ${
                  selectedSemester === sem
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-[#E2E8F0]'
                }`}
              >
                {isBn ? `সেমিস্টার ${sem}` : `Semester ${sem}`}
              </button>
            ))}
          </div>
        </div>

        {/* Day Filter & Keyword Search */}
        <div className="pt-2 border-t border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-xs font-bold text-slate-500 mr-1 shrink-0">
              {isBn ? 'দিন:' : 'Day:'}
            </span>
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                  selectedDay === day
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-[#E2E8F0]'
                }`}
              >
                {day === 'All' ? (isBn ? 'সকল দিন' : 'All Days') : day}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder={isBn ? 'কোর্স, শিক্ষক বা কক্ষ...' : 'Search course, instructor...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#1E3A8A] bg-white text-slate-800"
              />
            </div>

            {/* Layout switch */}
            <div className="hidden sm:flex items-center gap-1 border border-[#E2E8F0] p-1 rounded-xl bg-white shrink-0">
              <button
                onClick={() => setRoutineLayout('grid')}
                className={`p-1.5 rounded-lg ${routineLayout === 'grid' ? 'bg-slate-100 text-[#1E3A8A]' : 'text-slate-400'}`}
                title="Timetable Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setRoutineLayout('cards')}
                className={`p-1.5 rounded-lg ${routineLayout === 'cards' ? 'bg-slate-100 text-[#1E3A8A]' : 'text-slate-400'}`}
                title="Cards List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          <SkeletonLoader variant="rectangular" className="h-64 w-full rounded-2xl" />
        </div>
      )}

      {/* Error Fallback */}
      {!isLoading && hasError && (
        <Card padding="lg" className="text-center py-10 space-y-3 border-red-200">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-sm font-bold text-slate-800">
            {isBn ? 'ক্লাস রুটিন লোড করা সম্ভব হয়নি' : 'Failed to load class routine'}
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

      {/* Empty State */}
      {!isLoading && !hasError && filteredSlots.length === 0 && (
        <EmptyState
          title={isBn ? 'কোনো ক্লাস শিডিউল পাওয়া যায়নি' : 'No Class Schedule Found'}
          description={
            isBn
              ? 'নির্বাচিত বিভাগ ও সেমিস্টারের জন্য এই মুহূর্তে কোনো ক্লাস স্লট তালিকাভুক্ত নেই।'
              : 'No scheduled routine slots found for the selected department and semester criteria.'
          }
          actionLabel={isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Routine Filters'}
          onAction={() => {
            setSelectedSemester(1);
            setSelectedDay('All');
            setSearchQuery('');
          }}
        />
      )}

      {/* Timetable Grid View (Desktop & Tablet) */}
      {!isLoading && !hasError && filteredSlots.length > 0 && routineLayout === 'grid' && (
        <div className="space-y-6">
          <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-white shadow-2xs">
            <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#0F172A]">
                  {currentDept?.name} ({currentDept?.code})
                </h3>
                <span className="text-xs text-slate-500">
                  {selectedSemester === 'all'
                    ? isBn ? 'সকল সেমিস্টার' : 'All Semesters'
                    : isBn ? `সেমিস্টার ${selectedSemester} সময়সূচি` : `Semester ${selectedSemester} Schedule`}
                </span>
              </div>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono">
                [REPLACE WITH REAL CONTENT]
              </span>
            </div>

            {/* Timetable Matrix */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E2E8F0] text-slate-600 font-bold">
                    <th className="p-3 w-28 border-r border-[#E2E8F0]">Day</th>
                    {timeSlots.map((ts, idx) => (
                      <th key={idx} className="p-3 border-r border-[#E2E8F0] min-w-[200px]">
                        {isBn ? ts.labelBn : ts.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {timetableDays
                    .filter((d) => selectedDay === 'All' || d === selectedDay)
                    .map((day) => {
                      const daySlots = filteredSlots.filter((s) => s.dayOfWeek === day);

                      return (
                        <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 font-bold text-[#0F172A] border-r border-[#E2E8F0] bg-slate-50/70">
                            {day}
                          </td>

                          {timeSlots.map((ts, tsIdx) => {
                            // Find slots starting in this general window
                            const slotInPeriod = daySlots.find((s) => {
                              if (tsIdx === 0 && (s.startTime.includes('09:00') || s.startTime.includes('08:30'))) return true;
                              if (tsIdx === 1 && (s.startTime.includes('10:30') || s.startTime.includes('11:00') || s.startTime.includes('10:00'))) return true;
                              if (tsIdx === 2 && (s.startTime.includes('01:30') || s.startTime.includes('02:00') || s.startTime.includes('01:00'))) return true;
                              return false;
                            });

                            return (
                              <td key={tsIdx} className="p-2.5 border-r border-[#E2E8F0] align-top">
                                {slotInPeriod ? (
                                  <div className="p-2.5 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] space-y-1 shadow-2xs">
                                    <div className="flex items-center justify-between">
                                      <span className="font-mono font-bold text-[#1E3A8A]">
                                        {slotInPeriod.courseCode}
                                      </span>
                                      <span className="text-[10px] text-slate-500 font-medium">
                                        {slotInPeriod.startTime}
                                      </span>
                                    </div>
                                    <p className="font-semibold text-slate-800 line-clamp-2">
                                      {isBn ? slotInPeriod.courseTitleBn : slotInPeriod.courseTitle}
                                    </p>
                                    <div className="pt-1 text-[11px] text-slate-600 flex items-center justify-between">
                                      <span className="truncate max-w-[120px]">
                                        {isBn ? slotInPeriod.teacherNameBn : slotInPeriod.teacherName}
                                      </span>
                                      <span className="font-mono text-slate-500">
                                        {isBn ? slotInPeriod.roomBn : slotInPeriod.room}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-slate-300 text-[11px] block text-center py-2">
                                    —
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Cards List View (Default on Mobile or when selected) */}
      {!isLoading && !hasError && filteredSlots.length > 0 && routineLayout === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSlots.map((slot) => (
            <Card
              key={slot.id}
              padding="md"
              className="space-y-3 hover:border-[#1E3A8A] transition-all bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#1E3A8A] bg-[#EFF6FF] px-2.5 py-0.5 rounded">
                  {slot.courseCode}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {slot.dayOfWeek}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#0F172A]">
                  {isBn ? slot.courseTitleBn : slot.courseTitle}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {slot.startTime} – {slot.endTime}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] text-xs text-slate-600 flex items-center justify-between">
                <span className="truncate max-w-[180px]">
                  {isBn ? slot.teacherNameBn : slot.teacherName}
                </span>
                <span className="font-mono font-medium text-slate-500">
                  {isBn ? slot.roomBn : slot.room}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Timetable Guidelines */}
      <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] text-xs text-slate-600 space-y-1">
        <p className="font-bold text-[#0F172A]">
          {isBn ? 'ক্লাস উপস্থিতি ও ল্যাব নির্দেশিকা:' : 'Class Schedule Regulations:'}
        </p>
        <p>
          [REPLACE WITH REAL CONTENT] {isBn
            ? 'ক্লাস শুরুর ১০ মিনিট পূর্বে শিক্ষার্থীদের নির্ধারিত লেকচার গ্যালারি বা গবেষণাগারে উপস্থিত থাকতে হবে। বিশেষ প্রয়োজনে চেয়ারম্যান মহোদয়ের অনুমতি সাপেক্ষে মেকআপ ক্লাসের সময় নির্ধারণ করা যাবে।'
            : 'Students are advised to be seated in respective lecture rooms or laboratories 10 minutes prior to session commencement. Makeup lectures must receive written chairman clearance.'}
        </p>
      </div>
    </div>
  );
};
