import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckSquare,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getTeacherDataService, TeacherRoutineItem } from '../../../services/teacher';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

export const TeacherRoutinePage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(true);
  const [routine, setRoutine] = useState<Record<string, TeacherRoutineItem[]>>({});
  const [selectedDay, setSelectedDay] = useState<string>('Sunday');

  useEffect(() => {
    let isMounted = true;
    const fetchRoutine = async () => {
      try {
        setLoading(true);
        const service = getTeacherDataService();
        const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
        const data = await service.getRoutine(teacherEmail);
        if (isMounted) setRoutine(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRoutine();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const currentDayClasses = routine[selectedDay] || [];

  return (
    <DashboardLayout portalTitle={isBn ? 'ক্লাস রুটিন' : 'Weekly Routine'}>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1E3A8A]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
              {isBn ? 'শিক্ষকের সাপ্তাহিক ক্লাস রুটিন' : 'Faculty Weekly Teaching Timetable'}
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            {isBn
              ? 'সিএসই বিভাগের ফল ২০২৬ শিক্ষাবর্ষের অনুমোদিত সাপ্তাহিক ক্লাস ও ল্যাব সূচি।'
              : 'Approved Fall 2026 academic timetable for Dept. of Computer Science & Engineering.'}
          </p>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold">
          {DAYS_OF_WEEK.map((day) => {
            const count = (routine[day] || []).length;
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1E3A8A] text-white shadow-2xs'
                    : 'bg-white border border-[#E2E8F0] text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{day}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Day Class Cards */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonLoader key={i} variant="rectangular" className="h-32 rounded-xl" />
            ))}
          </div>
        ) : currentDayClasses.length === 0 ? (
          <EmptyState
            title={isBn ? 'এই দিনে কোনো ক্লাস নেই' : `No Classes on ${selectedDay}`}
            description={isBn ? 'এই দিনে কোনো পাঠদান বা ল্যাব সেশন নির্ধারিত নেই।' : 'No teaching sessions scheduled for this day.'}
          />
        ) : (
          <div className="space-y-4">
            {currentDayClasses.map((item) => (
              <Card
                key={item.id}
                padding="md"
                className="border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 text-xs font-mono font-bold bg-blue-50 text-[#1E3A8A] rounded border border-blue-200">
                        {item.courseCode}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#1E3A8A]" />
                        <span>{item.timeSlot}</span>
                      </span>
                      <span className="text-xs text-slate-400">&bull;</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{item.enrolledCount} Students</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0F172A]">{item.courseTitle}</h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.room}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link to={`/teacher/attendance/${item.courseCode}`}>
                      <Button variant="primary" size="sm" className="text-xs font-semibold">
                        <CheckSquare className="w-3.5 h-3.5 mr-1" />
                        {isBn ? 'উপস্থিতি গ্রহণ' : 'Take Attendance'}
                      </Button>
                    </Link>
                    <Link to={`/teacher/courses/${item.courseCode}`}>
                      <Button variant="outline" size="sm" className="text-xs font-semibold">
                        {isBn ? 'কোর্স ভিউ' : 'Course View'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
