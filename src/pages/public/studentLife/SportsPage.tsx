import React, { useState } from 'react';
import {
  Trophy,
  Dumbbell,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Plus,
  Users,
  Award,
  Shield,
  Activity,
  Flame
} from 'lucide-react';
import { SEOHead } from '../../../components/common/SEOHead';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Badge } from '../../../components/common/Badge';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import {
  initialSportsFacilitiesData,
  initialSportsTournamentsData
} from '../../../data/studentLifeSeedData';
import { SportsFacility, SportsTournament, SportsBooking } from '../../../types/studentLife';
import { SharedDataStoreManager } from '../../../services/shared/sharedDataStore';

export const SportsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { profile } = useAuth();
  const storeManager = SharedDataStoreManager.getInstance();

  const [facilities] = useState<SportsFacility[]>(initialSportsFacilitiesData);
  const [tournaments] = useState<SportsTournament[]>(initialSportsTournamentsData);

  // Booking Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<SportsFacility>(initialSportsFacilitiesData[0]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [bookingForm, setBookingForm] = useState({
    studentName: profile?.fullName || 'Tanvir Ahmed',
    rollNumber: profile?.studentId || '2026001',
    bookingDate: new Date().toISOString().split('T')[0],
    timeSlot: '4:30 PM - 6:00 PM',
    sportItem: 'Badminton Court 1 & Yonex Rackets',
    purpose: 'Inter-batch practice match'
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    storeManager.submitSportsBooking({
      facilityId: selectedFacility.id,
      facilityName: selectedFacility.name,
      studentId: profile?.studentId || 'JSTU2026001',
      studentName: bookingForm.studentName,
      rollNumber: bookingForm.rollNumber,
      bookingDate: bookingForm.bookingDate,
      timeSlot: bookingForm.timeSlot,
      sportItem: bookingForm.sportItem,
      purpose: bookingForm.purpose
    });

    setFeedback(`Slot confirmed for ${selectedFacility.name} on ${bookingForm.bookingDate} (${bookingForm.timeSlot})! Token issued.`);
    setIsBookingModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <SEOHead
        title={isBn ? 'খেলাধুলা ও শরীরচর্চা কেন্দ্র | জেএসটিইউ' : 'Sports Complex & Physical Education | JSTU'}
        description={
          isBn
            ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের কেন্দ্রীয় খেলার মাঠ, মাল্টিপারপাস জিমনেসিয়াম, আন্তঃবিভাগ টুর্নামেন্ট ও সরঞ্জাম বুকিং।'
            : 'JSTU Sports Complex, Gymnasium, tournament fixtures, athletic grounds, and student equipment booking.'
        }
      />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0A2540] via-[#1E3A8A] to-[#0A2540] text-white py-12 px-4 sm:px-8 border-b border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-amber-300 text-xs font-semibold border border-blue-400/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>{isBn ? 'শারীরিক শিক্ষা ও ক্রীড়া পরিষদ' : 'Directorate of Physical Education'}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {isBn ? 'খেলাধুলা ও শরীরচর্চা কমপ্লেক্স' : 'Sports Complex & Physical Fitness'}
              </h1>
              <p className="text-sm sm:text-base text-blue-100 max-w-2xl mt-1 leading-relaxed">
                {isBn
                  ? 'আন্তর্জাতিক মানের কেন্দ্রীয় মাঠ, শীতাতপ নিয়ন্ত্রিত জিমনেসিয়াম, ফ্লাডলাইট ব্যাডমিন্টন কোর্ট এবং বার্ষিক টুর্নামেন্ট।'
                  : 'Central Stadium, indoor gymnasium, synthetic courts, and vibrant inter-department sports leagues throughout the year.'}
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold self-start md:self-auto shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>{isBn ? 'মাঠ / সরঞ্জাম বুক করুন' : 'Book Facility / Ground'}</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
        {feedback && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
              &times;
            </button>
          </div>
        )}

        {/* Facilities Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-[#1E3A8A]" />
              <span>{isBn ? 'ক্যাম্পাস ক্রীড়া সুবিধাসমূহ' : 'Sports Facilities & Infrastructure'}</span>
            </h2>
            <span className="text-xs text-slate-500">Free access for all registered students</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {facilities.map((fac) => (
              <Card
                key={fac.id}
                padding="md"
                className="flex flex-col justify-between hover:shadow-md transition-shadow border border-slate-200 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{isBn ? fac.nameBn : fac.name}</h3>
                      <p className="text-xs text-[#1E3A8A] font-medium mt-0.5">{fac.operatingHours}</p>
                    </div>
                    <Badge variant="primary">{fac.type.toUpperCase()}</Badge>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isBn ? fac.descriptionBn : fac.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Capacity</span>
                      <span className="font-semibold text-slate-800">{fac.capacity}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Supervisor</span>
                      <span className="font-semibold text-slate-800">{fac.supervisor}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Available Gear
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {fac.equipmentAvailable.map((eq, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">Supervisor: {fac.supervisorPhone}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFacility(fac);
                      setIsBookingModalOpen(true);
                    }}
                    className="text-xs"
                  >
                    <span>Book Practice Slot</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Tournaments Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>{isBn ? 'বিশ্ববিদ্যালয় টুর্নামেন্ট ও বার্ষিক ক্রীড়া প্রতিযোগিতা' : 'Tournaments & Athletic Competitions'}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tournaments.map((t) => (
              <Card
                key={t.id}
                padding="md"
                className="space-y-3 border-l-4 border-l-amber-500 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold">
                      {t.sport.toUpperCase()}
                    </span>
                    <Badge
                      variant={
                        t.status === 'ongoing' ? 'danger' : t.status === 'upcoming' ? 'warning' : 'success'
                      }
                    >
                      {t.status.toUpperCase()}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {isBn ? t.titleBn : t.title}
                  </h3>

                  <div className="text-xs text-slate-500 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.date}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isBn ? t.venueBn : t.venue}</span>
                    </p>
                  </div>

                  {t.highlights && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                      &quot;{t.highlights}&quot;
                    </p>
                  )}

                  {t.champion && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-0.5 text-amber-900">
                      <div className="font-bold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>Champion: {t.champion}</span>
                      </div>
                      {t.runnerUp && (
                        <div className="text-[11px] text-amber-800">Runner-up: {t.runnerUp}</div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      {isBookingModalOpen && (
        <Modal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          title={`Reserve Sports Facility: ${selectedFacility.name}`}
          size="md"
        >
          <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Facility</label>
              <select
                value={selectedFacility.id}
                onChange={(e) => {
                  const f = facilities.find((item) => item.id === e.target.value);
                  if (f) setSelectedFacility(f);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.name} ({fac.operatingHours})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={bookingForm.studentName}
                  onChange={(e) => setBookingForm({ ...bookingForm, studentName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Roll / ID</label>
                <input
                  type="text"
                  required
                  value={bookingForm.rollNumber}
                  onChange={(e) => setBookingForm({ ...bookingForm, rollNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reservation Date</label>
                <input
                  type="date"
                  required
                  value={bookingForm.bookingDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                <select
                  value={bookingForm.timeSlot}
                  onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="6:30 AM - 8:00 AM">Morning 6:30 AM - 8:00 AM</option>
                  <option value="4:00 PM - 5:30 PM">Afternoon 4:00 PM - 5:30 PM</option>
                  <option value="5:30 PM - 7:00 PM">Evening 5:30 PM - 7:00 PM</option>
                  <option value="7:00 PM - 8:30 PM">Night Floodlight 7:00 PM - 8:30 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Equipment / Gear Needed</label>
              <input
                type="text"
                value={bookingForm.sportItem}
                onChange={(e) => setBookingForm({ ...bookingForm, sportItem: e.target.value })}
                placeholder="e.g. Cricket kit, 2 leather balls, volleyball nets..."
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Purpose / Match Description</label>
              <textarea
                rows={2}
                value={bookingForm.purpose}
                onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Confirm Reservation Slot
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
