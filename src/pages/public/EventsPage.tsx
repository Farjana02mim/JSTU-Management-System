import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Search,
  Filter,
  Grid,
  List,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  Award,
  Tag
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Modal } from '../../components/common/Modal';
import { useLanguage } from '../../contexts/LanguageContext';
import { universityEventsData } from '../../data/publicSectionsSeedData';
import { UniversityEventItem, EventCategory } from '../../types/publicSections';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';

export const EventsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<UniversityEventItem | null>(null);

  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(10); // 10 = November (0-indexed)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>('2026-11-12');
  const [calendarExported, setCalendarExported] = useState(false);

  const categories: { key: string; label: string; labelBn: string }[] = [
    { key: 'All', label: 'All Events', labelBn: 'সকল অনুষ্ঠান' },
    { key: 'Conference', label: 'Conferences', labelBn: 'সম্মেলন' },
    { key: 'Workshop', label: 'Workshops', labelBn: 'কর্মশালা' },
    { key: 'Seminar', label: 'Seminars', labelBn: 'সেমিনার' },
    { key: 'Cultural', label: 'Cultural & Sports', labelBn: 'সাংস্কৃতিক' },
    { key: 'National', label: 'National Days', labelBn: 'জাতীয় দিবস' }
  ];

  const allPublishedEvents = useMemo(() => {
    const store = SharedDataStoreManager.getInstance().getStore();
    const source = store.managedEvents && store.managedEvents.length > 0 ? store.managedEvents : universityEventsData;
    return source.filter((evt: any) => evt.status === 'published' || !evt.status);
  }, []);

  // Filtering
  const filteredEvents = allPublishedEvents.filter((evt: any) => {
    if (selectedCategory !== 'All' && evt.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (isBn ? evt.titleBn : evt.title).toLowerCase().includes(q);
      const matchVenue = (isBn ? evt.venueBn : evt.venue).toLowerCase().includes(q);
      const matchOrganizer = (isBn ? evt.organizerBn : evt.organizer).toLowerCase().includes(q);
      if (!matchTitle && !matchVenue && !matchOrganizer) return false;
    }
    return true;
  });

  // Calendar calculations
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay(); // 0 = Sun

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((prev) => prev - 1);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((prev) => prev + 1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  };

  const getEventsForDate = (dateStr: string) => {
    return allPublishedEvents.filter((e: any) => e.date === dateStr);
  };

  const selectedDateEvents = selectedCalendarDate
    ? allPublishedEvents.filter((e: any) => e.date === selectedCalendarDate)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12 bg-white">
      <SEOHead
        title={isBn ? 'বিশ্ববিদ্যালয় ইভেন্ট ও ক্যালেন্ডার' : 'Campus Events & Calendar'}
        description="Upcoming academic conferences, workshops, symposiums, and cultural milestones at JSTU."
      />

      <Breadcrumb items={[{ label: isBn ? 'ইভেন্ট ও ক্যালেন্ডার' : 'Events & Calendar' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
            {isBn ? 'একাডেমিক ও সাংস্কৃতিক আয়োজন' : 'Campus Milestone Schedule'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            {isBn ? 'বিশ্ববিদ্যালয়ের অনুষ্ঠান ও ক্যালেন্ডার' : 'University Events & Conferences'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isBn
              ? 'আন্তর্জাতিক গবেষণা সম্মেলন, ফ্যাকাল্টি ডেভেলপমেন্ট কর্মশালা এবং শিক্ষার্থী উৎসবের সময়সূচি।'
              : 'Participate in world-class research symposiums, pedagogical training, and interdisciplinary conventions organized by JSTU faculties.'}
          </p>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-[#1E3A8A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" />
            <span>{isBn ? 'তালিকা ভিউ' : 'List View'}</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-white text-[#1E3A8A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{isBn ? 'ক্যালেন্ডার ভিউ' : 'Calendar View'}</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Categories & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isBn ? cat.labelBn : cat.label}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder={isBn ? 'ইভেন্ট বা স্থান খুঁজুন...' : 'Search events, venues, topics...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              {isBn
                ? `মোট ${filteredEvents.length}টি অনুষ্ঠান পাওয়া গেছে`
                : `Showing ${filteredEvents.length} events`}
            </span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                {isBn ? 'কোনো অনুষ্ঠান খুঁজে পাওয়া যায়নি' : 'No events match your selected criteria'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((evt: any) => {
                const dateObj = new Date(evt.date);
                const monthShort = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                const dayNum = dateObj.getDate();

                return (
                  <Card
                    key={evt.id}
                    className="overflow-hidden border border-[#E2E8F0] bg-white flex flex-col justify-between hover:shadow-md transition group"
                  >
                    <div>
                      {/* Event Banner Image */}
                      <div className="relative h-44 overflow-hidden bg-slate-100">
                        <img
                          src={evt.imageUrl}
                          alt={isBn ? evt.titleBn : evt.title}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs rounded-xl p-2 text-center min-w-[52px] shadow-sm">
                          <span className="text-[10px] font-bold text-red-600 block leading-tight">
                            {monthShort}
                          </span>
                          <span className="text-lg font-black text-slate-900 block leading-tight">
                            {dayNum}
                          </span>
                        </div>

                        <span className="absolute top-3 right-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                          {isBn ? evt.categoryBn : evt.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors leading-snug">
                          {isBn ? evt.titleBn : evt.title}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {isBn ? evt.summaryBn : evt.summary}
                        </p>

                        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
                            <span>{isBn ? evt.timeBn : evt.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
                            <span className="truncate">{isBn ? evt.venueBn : evt.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
                            <span className="truncate">{isBn ? evt.organizerBn : evt.organizer}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {evt.status.toUpperCase()}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setSelectedEvent(evt)}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        {isBn ? 'বিবরণ ও সময়সূচি' : 'View Schedule & Agenda'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Calendar Grid Box */}
            <Card className="lg:col-span-8 p-6 border border-[#E2E8F0] bg-white space-y-6 shadow-xs">
              {/* Month Header Nav */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A]">
                    {isBn ? monthNamesBn[calendarMonth] : monthNames[calendarMonth]} {calendarYear}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {isBn ? 'ইভেন্ট দেখতে যেকোনো তারিখে ক্লিক করুন' : 'Click any highlighted day to inspect scheduled events'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-500 pb-2 border-b border-slate-100">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {/* Empty leading padding days */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-20 sm:h-24 p-1 bg-slate-50/50 rounded-xl" />
                ))}

                {/* Actual Month Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const monthPad = String(calendarMonth + 1).padStart(2, '0');
                  const dayPad = String(day).padStart(2, '0');
                  const dateStr = `${calendarYear}-${monthPad}-${dayPad}`;
                  const dayEvents = getEventsForDate(dateStr);
                  const isSelected = selectedCalendarDate === dateStr;
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => setSelectedCalendarDate(dateStr)}
                      className={`h-20 sm:h-24 p-1.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#1E3A8A] bg-blue-50/70 ring-2 ring-blue-500/20'
                          : hasEvents
                          ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400'
                          : 'border-slate-100 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#1E3A8A] text-white'
                            : hasEvents
                            ? 'text-amber-800 font-black'
                            : 'text-slate-700'
                        }`}
                      >
                        {day}
                      </span>

                      {hasEvents && (
                        <div className="space-y-0.5 overflow-hidden">
                          {dayEvents.map((e: any) => (
                            <span
                              key={e.id}
                              className="block truncate text-[10px] font-semibold bg-[#1E3A8A] text-white px-1.5 py-0.5 rounded"
                            >
                              {isBn ? e.titleBn : e.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Selected Date Detail Drawer */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="p-6 border border-[#E2E8F0] bg-white space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs font-mono uppercase font-bold text-[#1E3A8A]">
                    {selectedCalendarDate ? `Date: ${selectedCalendarDate}` : 'Selected Date'}
                  </span>
                  <h4 className="text-base font-bold text-[#0F172A] mt-1">
                    {isBn ? 'এই তারিখের অনুষ্ঠানসমূহ' : 'Events Scheduled'}
                  </h4>
                </div>

                {selectedDateEvents.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    {isBn
                      ? 'এই তারিখে কোনো নির্ধারিত অনুষ্ঠান নেই।'
                      : 'No institutional events scheduled on this selected date.'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateEvents.map((evt: any) => (
                      <div
                        key={evt.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 hover:border-[#1E3A8A] transition cursor-pointer"
                        onClick={() => setSelectedEvent(evt)}
                      >
                        <span className="px-2 py-0.5 bg-blue-100 text-[#1E3A8A] font-bold text-[10px] rounded uppercase">
                          {isBn ? evt.categoryBn : evt.category}
                        </span>
                        <h5 className="text-xs font-bold text-[#0F172A] leading-snug">
                          {isBn ? evt.titleBn : evt.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {isBn ? evt.summaryBn : evt.summary}
                        </p>
                        <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-[#1E3A8A]" />
                            <span>{evt.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-[#1E3A8A]" />
                            <span className="truncate">{evt.venue}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal with Agenda & Keynote */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={isBn ? selectedEvent.titleBn : selectedEvent.title}
          description={`${selectedEvent.date} &bull; ${selectedEvent.time} &bull; ${selectedEvent.venue}`}
        >
          <div className="space-y-6 text-xs max-h-[75vh] overflow-y-auto pr-1">
            <div className="rounded-xl overflow-hidden h-48 bg-slate-100">
              <img
                src={selectedEvent.imageUrl}
                alt={selectedEvent.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 block">Category:</span>
                <strong className="text-[#1E3A8A]">{selectedEvent.category}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Status:</span>
                <strong className="text-emerald-700">{selectedEvent.status.toUpperCase()}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Venue:</span>
                <span className="text-slate-800 font-semibold">{selectedEvent.venue}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Organizer:</span>
                <span className="text-slate-800 font-semibold">{selectedEvent.organizer}</span>
              </div>
            </div>

            {selectedEvent.chiefGuest && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <strong>Chief Guest / Keynote:</strong>{' '}
                  <span>{isBn ? selectedEvent.chiefGuestBn : selectedEvent.chiefGuest}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-bold text-sm text-[#0F172A]">Event Scope & Overview</h4>
              <p className="text-slate-600 leading-relaxed text-xs">
                {isBn ? selectedEvent.descriptionBn : selectedEvent.description}
              </p>
            </div>

            {/* Agenda Timeline */}
            {selectedEvent.agenda && (
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h4 className="font-bold text-sm text-[#0F172A]">Official Program Agenda</h4>
                <div className="space-y-2">
                  {selectedEvent.agenda.map((slot, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="font-mono font-bold text-[#1E3A8A] shrink-0">
                        {slot.time}
                      </span>
                      <span className="text-slate-700 flex-1">{slot.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {calendarExported && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isBn
                    ? 'অনুষ্ঠানটি ক্যালেন্ডার ফাইলে (.ics) ডাউনলোড হয়েছে।'
                    : 'Event downloaded as .ics calendar invitation.'}
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t">
              <Link
                to={`/events/${selectedEvent.id}`}
                className="text-xs font-bold text-[#1E3A8A] hover:underline flex items-center gap-1"
                onClick={() => setSelectedEvent(null)}
              >
                <span>{isBn ? 'সম্পূর্ণ ইভেন্ট পেজ দেখুন' : 'Open Dedicated Page'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const icsContent = [
                      'BEGIN:VCALENDAR',
                      'VERSION:2.0',
                      'PRODID:-//JSTU//Events//EN',
                      'BEGIN:VEVENT',
                      `SUMMARY:${selectedEvent.title}`,
                      `DESCRIPTION:${selectedEvent.summary}`,
                      `LOCATION:${selectedEvent.venue}`,
                      'STATUS:CONFIRMED',
                      'END:VEVENT',
                      'END:VCALENDAR'
                    ].join('\r\n');
                    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${selectedEvent.id}.ics`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);

                    setCalendarExported(true);
                    setTimeout(() => setCalendarExported(false), 4000);
                  }}
                >
                  {isBn ? 'ক্যালেন্ডারে যোগ করুন' : 'Add to Calendar'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
