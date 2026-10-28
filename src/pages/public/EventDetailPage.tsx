import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
  CalendarCheck,
  CheckCircle2,
  Building2,
  Award,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { SafeMarkdown } from '../../components/common/SafeMarkdown';
import { useLanguage } from '../../contexts/LanguageContext';
import { universityEventsData } from '../../data/publicSectionsSeedData';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [reminderAdded, setReminderAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const store = SharedDataStoreManager.getInstance().getStore();
  const allEvents = store.managedEvents && store.managedEvents.length > 0 ? store.managedEvents : universityEventsData;
  const event = allEvents.find((e: any) => e.id === id);

  if (!event || (event.status && event.status !== 'published')) {
    return <Navigate to="/events" replace />;
  }

  const relatedEvents = allEvents
    .filter((e: any) => e.id !== event.id && (e.status === 'published' || !e.status))
    .slice(0, 2);

  const handleDownloadICS = () => {
    // Generate an iCalendar .ics file
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//JSTU//University Events Calendar//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.summary} - Organized by ${event.organizer}`,
      `LOCATION:${event.venue}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.id}_event.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setReminderAdded(true);
    setTimeout(() => setReminderAdded(false), 5000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-10 bg-white animate-fadeIn">
      <SEOHead
        title={isBn ? event.titleBn : event.title}
        description={event.summary}
      />

      <Breadcrumb
        items={[
          { label: isBn ? 'অনুষ্ঠান' : 'Events', to: '/events' },
          { label: isBn ? event.categoryBn : event.category }
        ]}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1E3A8A] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBn ? 'সকল অনুষ্ঠানে ফিরে যান' : 'Back to All Events'}</span>
        </Link>

        <div className="flex items-center gap-2">
          {copiedLink && (
            <span className="text-xs text-emerald-600 font-semibold animate-fadeIn">
              {isBn ? 'লিংক কপি হয়েছে!' : 'Link copied!'}
            </span>
          )}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isBn ? 'শেয়ার' : 'Share'}</span>
          </button>
        </div>
      </div>

      {reminderAdded && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isBn
                ? 'অনুষ্ঠানটি ক্যালেন্ডার ফাইলে (.ics) ডাউনলোড ও সেভ করা হয়েছে।'
                : 'Event calendar invitation (.ics) downloaded. Import it to Google Calendar or Outlook.'}
            </span>
          </div>
          <button
            onClick={() => setReminderAdded(false)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-md">
        <div className="relative h-64 sm:h-96 w-full">
          <img
            src={event.imageUrl}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#1E3A8A] text-white text-xs font-bold uppercase tracking-wider">
                {isBn ? event.categoryBn : event.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                {event.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {isBn ? event.titleBn : event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Quick Info Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Details & Agenda */}
        <div className="lg:col-span-8 space-y-8">
          {/* Summary */}
          <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E3A8A] mb-2">
              {isBn ? 'অনুষ্ঠান সংক্ষেপ' : 'Event Summary'}
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              {isBn ? event.summaryBn : event.summary}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#0F172A]">
              {isBn ? 'বিস্তারিত রূপরেখা ও তাৎপর্য' : 'Scope & Detailed Overview'}
            </h3>
            <div className="text-sm text-slate-600 leading-relaxed">
              <SafeMarkdown content={isBn ? (event.descriptionBn || event.description) : event.description} />
            </div>
          </div>

          {/* Chief Guest / Dignitary */}
          {event.chiefGuest && (
            <Card className="p-6 border border-[#E2E8F0] bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>{isBn ? 'প্রধান অতিথি ও বক্তা' : 'Chief Guest & Keynote Speaker'}</span>
              </div>
              <p className="text-base font-bold text-[#0F172A]">
                {isBn ? (event.chiefGuestBn || event.chiefGuest) : event.chiefGuest}
              </p>
            </Card>
          )}

          {/* Official Agenda */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#0F172A]">
                {isBn ? 'অফিসিয়াল সময়সূচি ও কর্মসূচি' : 'Official Program Agenda'}
              </h3>
              <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden bg-white">
                {event.agenda.map((slot, index) => (
                  <div key={index} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 transition">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs text-[#1E3A8A] bg-blue-50 px-2.5 py-1 rounded-lg">
                        {slot.time}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        {slot.activity}
                      </span>
                    </div>
                    {slot.speaker && (
                      <span className="text-xs text-slate-500 italic">
                        {slot.speaker}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Schedule & Organizer Info Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 border border-[#E2E8F0] bg-white space-y-6 shadow-xs">
            <h3 className="text-base font-bold text-[#0F172A] border-b border-slate-100 pb-3">
              {isBn ? 'সময় ও স্থান সংক্রান্ত তথ্য' : 'Date, Time & Venue'}
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-[#1E3A8A] rounded-xl shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Date</span>
                  <strong className="text-slate-800 text-sm">
                    {isBn ? event.dateBn : event.date}
                  </strong>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-[#1E3A8A] rounded-xl shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Time</span>
                  <strong className="text-slate-800 text-sm">
                    {isBn ? event.timeBn : event.time}
                  </strong>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-[#1E3A8A] rounded-xl shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Venue</span>
                  <strong className="text-slate-800 text-sm">
                    {isBn ? event.venueBn : event.venue}
                  </strong>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-[#1E3A8A] rounded-xl shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Organizer</span>
                  <strong className="text-slate-800 text-sm">
                    {isBn ? event.organizerBn : event.organizer}
                  </strong>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={handleDownloadICS}
                leftIcon={<CalendarCheck className="w-4 h-4" />}
              >
                {isBn ? 'ক্যালেন্ডারে যোগ করুন (.ics)' : 'Add to Calendar (.ics)'}
              </Button>

              <p className="text-[11px] text-slate-400 text-center">
                /* [REPLACE WITH REAL CONTENT] Official JSTU Institutional Event */
              </p>
            </div>
          </Card>

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isBn ? 'অন্যান্য আসন্ন অনুষ্ঠান' : 'Other Upcoming Events'}
              </h4>
              <div className="space-y-3">
                {relatedEvents.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/events/${rel.id}`}
                    className="p-3.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-xl block transition group"
                  >
                    <span className="text-[10px] uppercase font-bold text-[#1E3A8A] block">
                      {isBn ? rel.categoryBn : rel.category} &bull; {rel.date}
                    </span>
                    <h5 className="text-xs font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors mt-1 line-clamp-1">
                      {isBn ? rel.titleBn : rel.title}
                    </h5>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
