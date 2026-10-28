import React, { useState } from 'react';
import {
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Utensils,
  Wifi,
  FileText,
  AlertCircle,
  Plus,
  Search,
  ChevronRight,
  Info
} from 'lucide-react';
import { SEOHead } from '../../../components/common/SEOHead';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Badge } from '../../../components/common/Badge';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { initialHallsData } from '../../../data/studentLifeSeedData';
import { ResidentialHall, HallSeatApplication } from '../../../types/studentLife';
import { SharedDataStoreManager } from '../../../services/shared/sharedDataStore';

export const HallsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { profile } = useAuth();
  const storeManager = SharedDataStoreManager.getInstance();

  const [halls] = useState<ResidentialHall[]>(initialHallsData);
  const [selectedHall, setSelectedHall] = useState<ResidentialHall>(initialHallsData[0]);
  const [activeTab, setActiveTab] = useState<'halls' | 'apply' | 'status'>('halls');

  // Application Modal & Form state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<HallSeatApplication | null>(null);

  const [formData, setFormData] = useState({
    hallId: initialHallsData[0].id,
    studentId: profile?.studentId || 'JSTU2026001',
    studentName: profile?.fullName || 'Tanvir Ahmed',
    rollNumber: profile?.studentId || '2026001',
    department: profile?.departmentId || 'Computer Science & Engineering',
    session: '2022-2023',
    currentSemester: 'Year 3 Term 1',
    cgpa: 3.84,
    gender: 'male' as 'male' | 'female',
    homeDistrict: 'Patuakhali',
    distanceKm: 340,
    guardianAnnualIncome: 180000,
    preferredRoomType: '4-Seater Standard Room',
    emergencyContact: '+880 1711-998877',
    reason: 'Permanent address located over 300km from Jamalpur campus. Daily commute is impossible and requires on-campus residency for consistent laboratory work.'
  });

  // Track status search
  const [searchRoll, setSearchRoll] = useState(profile?.studentId || '2026001');
  const store = storeManager.getStore();

  const userApplications = store.hallApplications.filter(
    (app) => app.studentId === (profile?.studentId || 'JSTU2026001') || app.rollNumber === searchRoll
  );

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetHall = halls.find((h) => h.id === formData.hallId) || halls[0];

    const newApp = storeManager.submitHallApplication({
      hallId: targetHall.id,
      hallName: targetHall.name,
      hallNameBn: targetHall.nameBn,
      studentId: formData.studentId,
      studentName: formData.studentName,
      rollNumber: formData.rollNumber,
      department: formData.department,
      session: formData.session,
      currentSemester: formData.currentSemester,
      cgpa: Number(formData.cgpa),
      gender: formData.gender,
      homeDistrict: formData.homeDistrict,
      distanceKm: Number(formData.distanceKm),
      guardianAnnualIncome: Number(formData.guardianAnnualIncome),
      preferredRoomType: formData.preferredRoomType,
      emergencyContact: formData.emergencyContact,
      reason: formData.reason
    });

    setSubmittedApp(newApp);
    setIsApplyModalOpen(false);
    setActiveTab('status');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <SEOHead
        title={isBn ? 'আবাসিক হলসমূহ ও আসন বরাদ্দ | জেএসটিইউ' : 'Residential Halls & Seat Allocation | JSTU'}
        description={
          isBn
            ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের আবাসিক হলসমূহ, সুযোগ-সুবিধা, প্রভোস্টের তথ্য ও অনলাইন সিট আবেদন।'
            : 'JSTU residential halls, room types, amenities, mess facilities, provost administration, and online hall seat application.'
        }
      />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0A2540] via-[#1E3A8A] to-[#0A2540] text-white py-12 px-4 sm:px-8 border-b border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-amber-300 text-xs font-semibold border border-blue-400/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>{isBn ? 'বিশ্ববিদ্যালয় ছাত্রাবাস ও আবাসন' : 'JSTU Student Accommodation'}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {isBn ? 'আবাসিক হল ও আসন আবেদন পোর্টাল' : 'Residential Halls & Seat Allocation'}
              </h1>
              <p className="text-sm sm:text-base text-blue-100 max-w-2xl mt-1 leading-relaxed">
                {isBn
                  ? 'নিরাপদ, শান্তিময় ও শিক্ষার্থীবান্ধব আবাসন ব্যবস্থা। ৩টি আধুনিক হলের সার্বিক তথ্য ও অনলাইন সিট বরাদ্দ আবেদন।'
                  : 'Safe, comfortable, and vibrant residential communities. Explore facilities, room types, mess dining, and apply for hall accommodation online.'}
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsApplyModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold self-start md:self-auto shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>{isBn ? 'নতুন সিটের আবেদন করুন' : 'Apply for Hall Seat'}</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('halls')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'halls'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isBn ? 'হলসমূহের তালিকা ও বিবরণ' : 'Residential Halls Overview'}
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'status'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{isBn ? 'আবেদনের স্থিতি ও বরাদ্দ' : 'Seat Application Status'}</span>
            {userApplications.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-[#1E3A8A] text-[10px] font-bold">
                {userApplications.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: HALLS LIST & DETAIL */}
        {activeTab === 'halls' && (
          <div className="space-y-8">
            {/* Hall Selector Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {halls.map((hall) => {
                const isSelected = selectedHall.id === hall.id;
                return (
                  <button
                    key={hall.id}
                    onClick={() => setSelectedHall(hall)}
                    className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1E3A8A] bg-blue-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                        {hall.type === 'male' ? 'Male Residence' : 'Female Residence'}
                      </span>
                      <Badge variant={hall.type === 'male' ? 'primary' : 'warning'}>
                        {hall.capacity} Beds
                      </Badge>
                    </div>
                    <h3 className="font-bold text-slate-900 mt-2 text-sm sm:text-base leading-snug">
                      {isBn ? hall.nameBn : hall.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{isBn ? hall.locationBn : hall.location}</span>
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Hall Full Card */}
            <Card padding="none" className="overflow-hidden border border-slate-200 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left: Image & Capacity Stats */}
                <div className="lg:col-span-5 relative bg-slate-900 min-h-[300px]">
                  <img
                    src={selectedHall.image}
                    alt={selectedHall.name}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-900 text-xs font-bold uppercase tracking-wider">
                      Est. {selectedHall.established}
                    </span>
                    <h2 className="text-2xl font-black">{isBn ? selectedHall.nameBn : selectedHall.name}</h2>
                    <p className="text-xs text-slate-200">{isBn ? selectedHall.locationBn : selectedHall.location}</p>
                    <div className="flex items-center gap-3 pt-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Total Beds</span>
                        <span className="font-bold text-white text-base">{selectedHall.capacity}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Occupied</span>
                        <span className="font-bold text-emerald-400 text-base">{selectedHall.currentResidents}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Vacant</span>
                        <span className="font-bold text-amber-300 text-base">
                          {selectedHall.capacity - selectedHall.currentResidents}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Hall Details, Room Types, Provost */}
                <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {isBn ? 'হল পরিচিতি ও সার্বিক সুবিধা' : 'Hall Profile & Living Environment'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {isBn ? selectedHall.descriptionBn : selectedHall.description}
                    </p>
                  </div>

                  {/* Room Types & Fees */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      {isBn ? 'কক্ষের ধরন ও মাসিক সিট ভাড়া' : 'Available Room Categories & Subsidized Monthly Rent'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedHall.roomTypes.map((rt) => (
                        <div key={rt.name} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-900 text-xs block">{rt.name}</span>
                          <div className="text-base font-black text-[#1E3A8A]">
                            ৳{rt.feePerMonth} <span className="text-[10px] text-slate-400 font-normal">/ month</span>
                          </div>
                          <span className="text-[11px] text-emerald-600 font-semibold block">
                            {rt.availableBeds} beds available
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      {isBn ? 'হল সুবিধাসমূহ' : 'Hall Amenities & Infrastructure'}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {(isBn ? selectedHall.amenitiesBn : selectedHall.amenities).map((am, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{am}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Provost and Mess Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                    <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1 text-xs">
                      <span className="font-bold text-[#1E3A8A] block">Provost Office</span>
                      <p className="font-semibold text-slate-800">{selectedHall.provost.name}</p>
                      <p className="text-slate-500 text-[11px]">{selectedHall.provost.designation}</p>
                      <div className="pt-1 flex items-center gap-2 text-slate-600">
                        <Phone className="w-3 h-3 text-[#1E3A8A]" />
                        <span>{selectedHall.provost.phone}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1 text-xs">
                      <span className="font-bold text-amber-900 block">Dining Mess Administration</span>
                      <p className="font-semibold text-slate-800">Manager: {selectedHall.messManager}</p>
                      <p className="text-slate-600 text-[11px]">
                        Monthly Meal Charge: <strong>৳{selectedHall.diningFeePerMonth}</strong>
                      </p>
                      <div className="pt-1 flex items-center gap-2 text-slate-600">
                        <Phone className="w-3 h-3 text-amber-700" />
                        <span>{selectedHall.messContact}</span>
                      </div>
                    </div>
                  </div>

                  {/* Apply Action Button */}
                  <div className="pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => {
                        setFormData({ ...formData, hallId: selectedHall.id });
                        setIsApplyModalOpen(true);
                      }}
                      className="w-full sm:w-auto"
                    >
                      <span>Apply for a Seat in {selectedHall.name}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: SEAT APPLICATION STATUS */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            <Card padding="md" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isBn ? 'হল সিট আবেদন ট্র্যাকিং' : 'Hall Seat Allocation Tracking'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter your Student ID or roll number to check your seat allocation status.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchRoll}
                    onChange={(e) => setSearchRoll(e.target.value)}
                    placeholder="e.g. 2026001"
                    className="px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    Search
                  </Button>
                </div>
              </div>

              {userApplications.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  No seat applications found for Roll/ID &quot;{searchRoll}&quot;. Click &quot;Apply for Hall Seat&quot; to submit a new application.
                </div>
              ) : (
                <div className="space-y-4">
                  {userApplications.map((app) => (
                    <Card
                      key={app.id}
                      padding="md"
                      className="space-y-3 border border-slate-200 border-l-4 border-l-[#1E3A8A]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                              {app.referenceId}
                            </span>
                            <Badge
                              variant={
                                app.status === 'allocated'
                                  ? 'success'
                                  : app.status === 'under_review'
                                  ? 'warning'
                                  : 'primary'
                              }
                            >
                              {app.status.toUpperCase().replace('_', ' ')}
                            </Badge>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">{app.hallName}</h4>
                        </div>

                        <div className="text-xs text-slate-500 sm:text-right">
                          <span>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Applicant</span>
                          <span className="font-semibold text-slate-800">{app.studentName} ({app.rollNumber})</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Merit (CGPA)</span>
                          <span className="font-bold text-[#1E3A8A]">{app.cgpa}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Home District</span>
                          <span className="text-slate-800">{app.homeDistrict} ({app.distanceKm} km away)</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Room Preference</span>
                          <span className="text-slate-800">{app.preferredRoomType}</span>
                        </div>
                      </div>

                      {app.status === 'allocated' && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>
                              Seat Allocated! <strong>Room {app.allocatedRoomNumber}</strong>, <strong>{app.allocatedBedNumber}</strong>.
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-700">
                            Collect Hall Key from Provost Office
                          </span>
                        </div>
                      )}

                      {app.remarks && (
                        <p className="text-xs text-slate-500 italic">
                          Provost Note: &quot;{app.remarks}&quot;
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* HALL SEAT APPLICATION MODAL */}
      {isApplyModalOpen && (
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title="Online Hall Seat Application 2026"
          size="lg"
        >
          <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 leading-relaxed text-[11px]">
              Hall seat allocations are granted strictly based on academic merit (CGPA), geographical distance of permanent home address from campus, and guardian financial criteria.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Residential Hall</label>
                <select
                  value={formData.hallId}
                  onChange={(e) => setFormData({ ...formData, hallId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {halls.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.type.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Room Type</label>
                <select
                  value={formData.preferredRoomType}
                  onChange={(e) => setFormData({ ...formData, preferredRoomType: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="4-Seater Standard Room">4-Seater Standard Room (৳350/mo)</option>
                  <option value="2-Seater Senior/M.Sc Room">2-Seater Senior Room (৳600/mo)</option>
                  <option value="Single Research Scholar Room">Single Research Room (৳1200/mo)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Roll / ID</label>
                <input
                  type="text"
                  required
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value, studentId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="2.00"
                  max="4.00"
                  required
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Home District</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Patuakhali, Cox's Bazar..."
                  value={formData.homeDistrict}
                  onChange={(e) => setFormData({ ...formData, homeDistrict: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Distance from Campus (km)</label>
                <input
                  type="number"
                  required
                  value={formData.distanceKm}
                  onChange={(e) => setFormData({ ...formData, distanceKm: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guardian Annual Income (৳)</label>
                <input
                  type="number"
                  required
                  value={formData.guardianAnnualIncome}
                  onChange={(e) => setFormData({ ...formData, guardianAnnualIncome: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reason / Accommodation Justification</label>
              <textarea
                rows={3}
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Submit Hall Application
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
