import React, { useState } from 'react';
import {
  HeartPulse,
  PhoneCall,
  Clock,
  Calendar,
  UserCheck,
  Stethoscope,
  Pill,
  Ambulance,
  Activity,
  HeartHandshake,
  CheckCircle2,
  Plus,
  ShieldCheck,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { SEOHead } from '../../../components/common/SEOHead';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Badge } from '../../../components/common/Badge';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import {
  initialMedicalDoctorsData,
  initialMedicalServicesData
} from '../../../data/studentLifeSeedData';
import { MedicalDoctor, MedicalService, MedicalAppointment } from '../../../types/studentLife';
import { SharedDataStoreManager } from '../../../services/shared/sharedDataStore';

export const MedicalCenterPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { profile } = useAuth();
  const storeManager = SharedDataStoreManager.getInstance();

  const [doctors] = useState<MedicalDoctor[]>(initialMedicalDoctorsData);
  const [services] = useState<MedicalService[]>(initialMedicalServicesData);

  // Appointment Modal
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<MedicalDoctor>(initialMedicalDoctorsData[0]);
  const [issuedAppointment, setIssuedAppointment] = useState<MedicalAppointment | null>(null);

  const [appointmentForm, setAppointmentForm] = useState({
    studentName: profile?.fullName || 'Tanvir Ahmed',
    studentRoll: profile?.studentId || '2026001',
    phone: '+880 1711-234567',
    appointmentDate: new Date().toISOString().split('T')[0],
    preferredTimeSlot: '10:00 AM - 11:30 AM',
    symptoms: 'Mild fever, sore throat and headache for 2 days.'
  });

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newApt = storeManager.submitMedicalAppointment({
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      studentId: profile?.studentId || 'JSTU2026001',
      studentName: appointmentForm.studentName,
      studentRoll: appointmentForm.studentRoll,
      phone: appointmentForm.phone,
      appointmentDate: appointmentForm.appointmentDate,
      preferredTimeSlot: appointmentForm.preferredTimeSlot,
      symptoms: appointmentForm.symptoms
    });

    setIssuedAppointment(newApt);
    setIsAppointmentModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <SEOHead
        title={isBn ? 'বিশ্ববিদ্যালয় মেডিকেল সেন্টার ও স্বাস্থ্যসেবা | জেএসটিইউ' : 'University Medical Center & Health Services | JSTU'}
        description={
          isBn
            ? '২৪/৭ জরুরি অ্যাম্বুলেন্স, বিনামূল্যে চিকিৎসা পরামর্শ, ওষুধ বিতরণ ও মানসিক স্বাস্থ্য কাউন্সিলিং।'
            : 'JSTU University Medical Center, 24/7 ambulance dispatch, free physician consultations, medicine dispensary, and student mental health counseling.'
        }
      />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0A2540] via-[#1E3A8A] to-[#0A2540] text-white py-12 px-4 sm:px-8 border-b border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-rose-300 text-xs font-semibold border border-blue-400/30">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>{isBn ? 'বিশ্ববিদ্যালয় স্বাস্থ্য ও চিকিৎসা সেবা' : 'University Healthcare Directorate'}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {isBn ? 'বিশ্ববিদ্যালয় মেডিকেল সেন্টার' : 'University Medical Center'}
              </h1>
              <p className="text-sm sm:text-base text-blue-100 max-w-2xl mt-1 leading-relaxed">
                {isBn
                  ? 'সকল শিক্ষার্থী, শিক্ষক ও কর্মকর্তা-কর্মচারীদের জন্য সার্বক্ষণিক স্বাস্থ্যসেবা, বিনামূল্যে প্রেসক্রিপশন ওষুধ এবং সার্বক্ষণিক অ্যাম্বুলেন্স সার্ভিস।'
                  : 'Providing 24/7 primary healthcare, diagnostic evaluations, free medicine dispensary, mental health therapy, and rapid emergency hospital transfer.'}
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsAppointmentModalOpen(true)}
              className="bg-rose-500 hover:bg-rose-400 text-white font-bold self-start md:self-auto shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>{isBn ? 'ডাক্তার অ্যাপয়েন্টমেন্ট নিন' : 'Book Doctor Appointment'}</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
        {/* 24/7 Ambulance Emergency Callout Bar */}
        <div className="p-5 bg-gradient-to-r from-rose-600 to-rose-800 text-white rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Ambulance className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-rose-200">
                24/7 Rapid Emergency Response &bull; Oxygen & Stretcher Equipped
              </span>
              <h3 className="text-lg font-bold">University Emergency Ambulance Hotline</h3>
              <p className="text-xs text-rose-100">
                Direct dispatch to Jamalpur General Hospital & Specialist Centers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <a
              href="tel:+8801711234567"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white text-rose-700 font-extrabold text-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>+880 1711-234567</span>
            </a>
            <a
              href="tel:+8801712987654"
              className="hidden sm:inline-flex px-3 py-2.5 rounded-xl bg-rose-900/60 border border-white/20 text-white font-semibold text-xs hover:bg-rose-900 transition-colors"
            >
              <span>Alt: +880 1712-987654</span>
            </a>
          </div>
        </div>

        {/* Issued Appointment Banner */}
        {issuedAppointment && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Appointment Confirmed! Token #{issuedAppointment.tokenNumber}</strong> for{' '}
                {issuedAppointment.doctorName} on {issuedAppointment.appointmentDate} (
                {issuedAppointment.preferredTimeSlot}). Please report to Medical Center counter with student ID.
              </div>
            </div>
            <button onClick={() => setIssuedAppointment(null)} className="text-slate-400 hover:text-slate-600">
              &times;
            </button>
          </div>
        )}

        {/* Services Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#1E3A8A]" />
              <span>{isBn ? 'মেডিকেল সেবা ও সুবিধাসমূহ' : 'Medical Services & Healthcare Facilities'}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((srv) => (
              <Card key={srv.id} padding="md" className="space-y-3 hover:shadow-md transition-shadow border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{isBn ? srv.titleBn : srv.title}</h3>
                  <span className="text-[11px] font-semibold text-emerald-600 block mt-0.5">{srv.fee}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isBn ? srv.descriptionBn : srv.description}
                </p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                  {srv.availability}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Doctors Directory */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#1E3A8A]" />
              <span>{isBn ? 'চিকিৎসক পরিষদ ও ডিউটি রোস্টার' : 'Medical Officers & Duty Roster'}</span>
            </h2>
            <span className="text-xs text-slate-500">Regular Consultation: 8:30 AM - 3:00 PM</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctors.map((doc) => (
              <Card
                key={doc.id}
                padding="md"
                className="flex flex-col justify-between hover:shadow-md transition-shadow border border-slate-200 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{isBn ? doc.nameBn : doc.name}</h3>
                      <p className="text-xs text-[#1E3A8A] font-semibold">{isBn ? doc.designationBn : doc.designation}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{doc.degrees}</p>
                    </div>

                    <Badge variant={doc.availableToday ? 'success' : 'neutral'}>
                      {doc.availableToday ? 'ON DUTY TODAY' : 'DUTY ROSTER'}
                    </Badge>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Specialty:</span>
                      <span className="font-semibold text-slate-800">{doc.specialty}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Chamber:</span>
                      <span className="font-medium text-slate-700">{doc.roomNumber}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                      <span className="text-slate-500">Duty Time:</span>
                      <span className="font-mono text-[#1E3A8A] font-bold">{doc.dutyTime}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Weekly Schedule</span>
                    <div className="flex flex-wrap gap-1">
                      {doc.dutyDays.map((day) => (
                        <span key={day} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">Emergency: {doc.phone}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setIsAppointmentModalOpen(true);
                    }}
                    className="text-xs"
                  >
                    <span>Book Appointment</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* APPOINTMENT MODAL */}
      {isAppointmentModalOpen && (
        <Modal
          isOpen={isAppointmentModalOpen}
          onClose={() => setIsAppointmentModalOpen(false)}
          title={`Book Consultation: ${selectedDoctor.name}`}
          size="md"
        >
          <form onSubmit={handleAppointmentSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px]">
              Consultations and medications are 100% free for registered JSTU students. Please bring your student ID card when visiting the doctor.
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Attending Physician</label>
              <select
                value={selectedDoctor.id}
                onChange={(e) => {
                  const d = doctors.find((item) => item.id === e.target.value);
                  if (d) setSelectedDoctor(d);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} - {doc.specialty} ({doc.roomNumber})
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
                  value={appointmentForm.studentName}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, studentName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Roll / ID</label>
                <input
                  type="text"
                  required
                  value={appointmentForm.studentRoll}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, studentRoll: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Consultation Date</label>
                <input
                  type="date"
                  required
                  value={appointmentForm.appointmentDate}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, appointmentDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Time Slot</label>
                <select
                  value={appointmentForm.preferredTimeSlot}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, preferredTimeSlot: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="9:00 AM - 10:30 AM">Morning 9:00 AM - 10:30 AM</option>
                  <option value="10:30 AM - 12:00 PM">Morning 10:30 AM - 12:00 PM</option>
                  <option value="12:00 PM - 01:30 PM">Noon 12:00 PM - 01:30 PM</option>
                  <option value="02:00 PM - 03:30 PM">Afternoon 02:00 PM - 03:30 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                required
                value={appointmentForm.phone}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Symptoms / Health Issue</label>
              <textarea
                rows={2}
                required
                value={appointmentForm.symptoms}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, symptoms: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsAppointmentModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Confirm & Issue Token
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
