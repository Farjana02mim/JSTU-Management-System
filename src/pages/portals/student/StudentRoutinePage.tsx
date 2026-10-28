import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getStudentDataService, ClassScheduleItem } from '../../../services/student';
import { Calendar, Clock, MapPin, User, Printer, RefreshCw, AlertCircle } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'] as const;
type DayName = typeof DAYS[number];

const dayTranslations: Record<DayName, { en: string; bn: string }> = {
  Sunday: { en: 'Sunday', bn: 'রবিবার' },
  Monday: { en: 'Monday', bn: 'সোমবার' },
  Tuesday: { en: 'Tuesday', bn: 'মঙ্গলবার' },
  Wednesday: { en: 'Wednesday', bn: 'বুধবার' },
  Thursday: { en: 'Thursday', bn: 'বৃহস্পতিবার' }
};

export const StudentRoutinePage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [routine, setRoutine] = useState<Record<string, ClassScheduleItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine current day of week
  const todayIndex = new Date().getDay();
  const defaultDay: DayName = todayIndex === 0 ? 'Sunday' : todayIndex === 1 ? 'Monday' : todayIndex === 2 ? 'Tuesday' : todayIndex === 3 ? 'Wednesday' : todayIndex === 4 ? 'Thursday' : 'Sunday';
  const [selectedDay, setSelectedDay] = useState<DayName>(defaultDay);

  const loadRoutine = async () => {
    setLoading(true);
    setError(null);
    try {
      const studentService = getStudentDataService();
      // Safe: user.uid is from the verified session, not taken from the URL
      const studentUid = user?.uid || 'demo_student_uid';
      const data = await studentService.getClassRoutine(studentUid);
      setRoutine(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load class routine');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutine();
  }, [user]);

  const activeClasses = routine[selectedDay] || [];

  return (
    <DashboardLayout portalTitle={isBn ? 'ক্লাস রুটিন' : 'Class Routine'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">
              {isBn ? 'সাপ্তাহিক ক্লাস রুটিন — ৬ষ্ঠ সেমিস্টার (ফল ২০২৬)' : 'Weekly Class Timetable — 6th Semester (Fall 2026)'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Department of Computer Science & Engineering &bull; Effective from 15 September 2026.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            {isBn ? 'প্রিন্ট রুটিন' : 'Print Routine'}
          </Button>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#E2E8F0] pb-3">
          {DAYS.map((day) => {
            const isToday = day === defaultDay;
            const isSelected = day === selectedDay;
            const count = (routine[day] || []).length;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1E3A8A] text-white shadow-2xs'
                    : 'bg-[#F8FAFC] text-slate-600 hover:bg-slate-100 border border-[#E2E8F0]'
                }`}
              >
                <span>{isBn ? dayTranslations[day].bn : dayTranslations[day].en}</span>
                {isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Today" />
                )}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Skeletons */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonLoader key={i} variant="rectangular" className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <Card padding="lg" className="border-red-200 bg-red-50 text-center py-8 space-y-3">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h2 className="text-sm font-bold text-red-900">{isBn ? 'রুটিন লোড করা যায়নি' : 'Unable to load routine'}</h2>
            <p className="text-xs text-red-700">{error}</p>
            <Button variant="outline" size="sm" onClick={loadRoutine} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              {isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
            </Button>
          </Card>
        )}

        {/* Classes List for Selected Day */}
        {!loading && !error && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                {isBn
                  ? `${dayTranslations[selectedDay].bn}-এর মোট নির্ধারিত ক্লাস: ${activeClasses.length}টি`
                  : `Classes scheduled for ${selectedDay}: ${activeClasses.length}`}
              </span>
            </div>

            {activeClasses.length === 0 ? (
              <EmptyState
                title={isBn ? 'এই দিনে কোনো ক্লাস নেই' : `No classes on ${selectedDay}`}
                description={isBn ? 'অন্যান্য দিনের ক্লাস দেখতে উপরের বারে ক্লিক করুন।' : 'No sessions scheduled for this day.'}
              />
            ) : (
              <div className="space-y-3">
                {activeClasses.map((item, index) => (
                  <Card
                    key={item.id}
                    padding="lg"
                    className="bg-white border-[#E2E8F0] shadow-2xs hover:border-slate-300 transition-all flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] flex flex-col items-center justify-center font-mono font-bold text-xs shrink-0 border border-blue-100">
                        <span>#{index + 1}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-xs text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {item.courseCode}
                          </span>
                          <h3 className="text-sm font-bold text-[#0F172A]">{item.courseTitle}</h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.room}</span>
                          </div>
                          <span>&bull;</span>
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.instructor}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-mono text-xs font-bold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-[#1E3A8A]" />
                        <span>{item.timeSlot}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentRoutinePage;
