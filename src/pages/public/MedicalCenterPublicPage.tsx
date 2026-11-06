import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  PhoneCall,
  Clock,
  Calendar,
  Stethoscope,
  Pill,
  Ambulance,
  Activity,
  HeartHandshake,
  ShieldCheck,
  MapPin,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Info,
  CheckCircle2
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  initialMedicalDoctorsData,
  initialMedicalServicesData,
  initialMedicalDutyRoster,
  initialEmergencyContacts,
  initialMedicalHealthTips,
  initialMedicalFaqs
} from '../../data/studentLifeSeedData';

type TabSection = 'overview' | 'services' | 'doctors' | 'hours' | 'emergency' | 'ambulance' | 'health-tips' | 'faq' | 'contact';

export const MedicalCenterPublicPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<TabSection>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const doctors = initialMedicalDoctorsData;
  const services = initialMedicalServicesData;
  const dutyShifts = initialMedicalDutyRoster;
  const emergencyContacts = initialEmergencyContacts;
  const healthTips = initialMedicalHealthTips;
  const faqs = initialMedicalFaqs;

  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6 text-[#1E3A8A]" />;
      case 'Ambulance':
        return <Ambulance className="w-6 h-6 text-red-600" />;
      case 'Pill':
        return <Pill className="w-6 h-6 text-emerald-600" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-blue-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-amber-600" />;
      default:
        return <HeartPulse className="w-6 h-6 text-[#1E3A8A]" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={isBn ? 'মেডিকেল সেন্টার - জেএসটিইউ' : 'Medical Center - JSTU'}
        description={
          isBn
            ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় মেডিকেল সেন্টার: বিনামূল্যে চিকিৎসা পরামর্শ, ওষুধ বিতরণ, জরুরি অ্যাম্বুলেন্স সেবা ও স্বাস্থ্য তথ্য।'
            : 'Jamalpur Science & Technology University Medical Center: Free consultation, essential dispensary, 24/7 ambulance, duty roster and student wellness.'
        }
      />

      {/* -------------------------------------------------------------
          1. MANDATORY SAFETY DISCLAIMER BANNER
         ------------------------------------------------------------- */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs sm:text-sm text-amber-900 font-medium">
            <span className="font-bold uppercase tracking-wide mr-1.5 bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded text-[11px]">
              {isBn ? 'গুরুত্বপূর্ণ বিজ্ঞপ্তি' : 'Safety Notice'}
            </span>
            {isBn
              ? 'ডেমো প্রোটোটাইপ। এটি কোনো চিকিৎসা উপদেশ নয়। জরুরি প্রয়োজনে বিশ্ববিদ্যালয়ের মেডিকেল সেন্টারে সরাসরি যোগাযোগ করুন অথবা জরুরি সেবা নম্বরে কল করুন।'
              : 'Demo only. This is not medical advice. In an emergency contact the university medical center or call local emergency services.'}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          2. HERO SECTION
         ------------------------------------------------------------- */}
      <section className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-[#1E3A8A]">
                <HeartPulse className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>{isBn ? 'ক্যাম্পাস স্বাস্থ্য সেবা' : 'Campus Health & Medical Services'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                {isBn ? 'জেএসটিইউ মেডিকেল সেন্টার' : 'JSTU Medical Center'}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
                {isBn
                  ? 'বিশ্ববিদ্যালয়ের সকল শিক্ষার্থী, শিক্ষক, কর্মকর্তা ও কর্মচারীদের জন্য প্রাথমিক চিকিৎসা, জরুরি অ্যাম্বুলেন্স, মানসিক স্বাস্থ্য পরামর্শ ও ডিসপেনসারি সেবা।'
                  : 'Comprehensive primary healthcare, free essential dispensary, emergency triage, on-call ambulance, and psychological counseling for the JSTU campus community.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to={user ? '/student/medical' : '/login'}>
                  <Button
                    variant="primary"
                    size="md"
                    className="font-bold"
                    leftIcon={<Calendar className="w-4 h-4 text-amber-300" />}
                  >
                    {isBn ? 'অনলাইন অ্যাপয়েন্টমেন্ট নিন' : 'Book Online Appointment'}
                  </Button>
                </Link>

                <a href="#emergency" onClick={() => setActiveTab('emergency')}>
                  <Button
                    variant="danger"
                    size="md"
                    className="font-bold"
                    leftIcon={<PhoneCall className="w-4 h-4" />}
                  >
                    {isBn ? 'জরুরি যোগাযোগ ও অ্যাম্বুলেন্স' : 'Emergency & Ambulance'}
                  </Button>
                </a>
              </div>
            </div>

            {/* Quick Stat Cards */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs text-center">
                <span className="text-2xl font-bold text-[#1E3A8A]">100%</span>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {isBn ? 'শিক্ষার্থীদের জন্য বিনামূল্যে' : 'Free for Students'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs text-center">
                <span className="text-2xl font-bold text-red-600">24/7</span>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {isBn ? 'অন-কল জরুরি সাড়াদান' : 'On-Call Emergency'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs text-center">
                <span className="text-2xl font-bold text-emerald-600">85+</span>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {isBn ? 'প্রয়োজনীয় ওষুধ মজুদ' : 'Dispensary Medicines'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs text-center">
                <span className="text-2xl font-bold text-[#0F172A]">2</span>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {isBn ? 'লাইফ-সাপোর্ট অ্যাম্বুলেন্স' : 'Equipped Ambulances'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          3. TABBED SECTION CONTROLS (RESPONSIVE)
         ------------------------------------------------------------- */}
      <div className="sticky top-16 z-20 bg-white border-b border-[#E2E8F0] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs sm:text-sm font-semibold whitespace-nowrap">
            {[
              { id: 'overview', labelEn: 'Overview', labelBn: 'সারসংক্ষেপ' },
              { id: 'services', labelEn: 'Services', labelBn: 'চিকিৎসা সেবাসমূহ' },
              { id: 'doctors', labelEn: 'Doctors & Duty Roster', labelBn: 'ডাক্তার ও ডিউটি রোস্টার' },
              { id: 'hours', labelEn: 'Opening Hours', labelBn: 'সেবার সময়সূচি' },
              { id: 'emergency', labelEn: 'Emergency Contacts', labelBn: 'জরুরি যোগাযোগ' },
              { id: 'ambulance', labelEn: 'Ambulance', labelBn: 'অ্যাম্বুলেন্স সেবা' },
              { id: 'health-tips', labelEn: 'Health Tips', labelBn: 'স্বাস্থ্য সচেতনতা' },
              { id: 'faq', labelEn: 'FAQ', labelBn: 'সাধারণ জিজ্ঞাসা' },
              { id: 'contact', labelEn: 'Contact', labelBn: 'যোগাযোগ' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabSection)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#1E3A8A] hover:bg-[#F8FAFC]'
                }`}
              >
                {isBn ? tab.labelBn : tab.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          4. TAB CONTENTS
         ------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                  {isBn ? 'ক্যাম্পাস স্বাস্থ্য ও প্রাথমিক চিকিৎসা কেন্দ্র' : 'Campus Health & Primary Care Center'}
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {isBn
                    ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় মেডিকেল সেন্টার শিক্ষার্থীদের শারীরিক ও মানসিক সুস্থতা নিশ্চিত করতে সার্বক্ষণিক নিয়োজিত। অভিজ্ঞ নিবন্ধিত চিকিৎসক, নার্সিং টিম এবং ডিসপেনসারি ফার্মাসিস্ট সমন্বয়ে কেন্দ্রটি পরিচালিত হয়।'
                    : 'The JSTU Medical Center is dedicated to supporting the physical, preventive, and emotional well-being of undergraduate and postgraduate scholars, research fellows, and staff members across all academic faculties.'}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {isBn
                    ? 'জরুরি প্রাথমিক চিকিৎসা, সাধারণ রোগ নিরাময়, ডায়াবেটিস ও রক্তচাপ নিয়মিত নিরীক্ষণ এবং গুরুতর রোগীদের দ্রুত জেলা সদর হাসপাতালে রেফার করার সমন্বিত ব্যবস্থা রয়েছে।'
                    : 'Equipped with digital triage, outpatient examination rooms, emergency observation beds, free diagnostic screening, and direct dispatch links with Jamalpur General Hospital.'}
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-[#E2E8F0] font-medium">
                    ✓ {isBn ? 'ডিজিটাল প্রেসক্রিপশন রেকর্ড' : 'Digital Prescription Records'}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-[#E2E8F0] font-medium">
                    ✓ {isBn ? 'গোপনীয় মানসিক পরামর্শ' : 'Confidential Psychotherapy'}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-[#E2E8F0] font-medium">
                    ✓ {isBn ? '২৪/৭ অন-কল অ্যাম্বুলেন্স' : '24/7 On-Call Ambulance'}
                  </span>
                </div>
              </div>

              {/* Highlights Card */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-[#0F172A]">
                  {isBn ? 'মেডিকেল সেন্টারের প্রধান সুবিধাসমূহ' : 'Key Medical Facilities'}
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>{isBn ? '৪ শয্যাবিশিষ্ট প্রাথমিক জরুরি অবজারভেশন ওয়ার্ড' : '4-Bed Emergency Observation Ward'}:</strong>{' '}
                      {isBn ? 'জরুরি স্যালাইন ও অক্সিজেন সেবা সম্বলিত।' : 'Equipped with continuous oxygen flow and vital monitors.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>{isBn ? 'বিনামূল্যে ওষুধ ডিসপেনসারি' : 'Free Essential Medicine Dispensary'}:</strong>{' '}
                      {isBn ? 'প্রেসক্রিপশন অনুযায়ী প্রয়োজনীয় ওষুধ সরবরাহ।' : 'Supplying over 85 government-subsidized medications.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>{isBn ? 'কাউন্সিলিং ও মেন্টাল ওয়েলনেস সেল' : 'Student Mental Wellness Cell'}:</strong>{' '}
                      {isBn ? 'পড়াশোনার চাপ ও বিষণ্ণতা দূরীকরণে অভিজ্ঞ কাউন্সিলর।' : 'Certified psychologist available for academic stress guidance.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>{isBn ? 'স্বয়ংক্রিয় অনলাইন অ্যাপয়েন্টমেন্ট' : 'Digital Appointment Engine'}:</strong>{' '}
                      {isBn ? 'পোর্টাল থেকে সুবিধাজনক সময়ে সরাসরি স্লট বুকিং।' : 'Students and staff select conflict-free roster slots online.'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Service Cards Row */}
            <div className="pt-6">
              <h3 className="text-lg font-bold text-[#0F172A] mb-4">
                {isBn ? 'জরুরি ও সাধারণ সেবাসমূহ' : 'Available Campus Medical Services'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {services.slice(0, 3).map((srv) => (
                  <Card key={srv.id} className="p-5 border border-[#E2E8F0] hover:border-[#1E3A8A]/40 transition-colors">
                    <div className="p-2.5 bg-blue-50/60 rounded-xl w-fit mb-3">
                      {renderServiceIcon(srv.iconName)}
                    </div>
                    <h4 className="font-bold text-sm text-[#0F172A]">{isBn ? srv.titleBn : srv.title}</h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {isBn ? srv.descriptionBn : srv.description}
                    </p>
                    <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {srv.fee}
                      </span>
                      <span className="text-slate-500 font-mono">{srv.availability}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {isBn ? 'চিকিৎসা ও ডায়াগনস্টিক সেবাসমূহ' : 'Clinical & Diagnostic Services'}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  {isBn
                    ? 'বিশ্ববিদ্যালয় মঞ্জুরি কমিশনের স্বাস্থ্য বিধিমালার আওতায় প্রদত্ত সকল সেবা।'
                    : 'Offered under university welfare regulations with computerized patient registries.'}
                </p>
              </div>

              <Link to={user ? '/student/medical' : '/login'}>
                <Button variant="primary" size="sm" className="font-bold">
                  {isBn ? 'অ্যাপয়েন্টমেন্ট বুকিং' : 'Book Consultation'}
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv) => (
                <Card key={srv.id} className="p-6 border border-[#E2E8F0] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50/70 rounded-xl w-fit">
                      {renderServiceIcon(srv.iconName)}
                    </div>
                    <h3 className="font-bold text-base text-[#0F172A]">{isBn ? srv.titleBn : srv.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isBn ? srv.descriptionBn : srv.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#E2E8F0] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{isBn ? 'ফি' : 'Fee'}:</span>
                      <span className="font-bold text-emerald-700">{srv.fee}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{isBn ? 'সময়সূচি' : 'Schedule'}:</span>
                      <span className="font-medium text-slate-700">{srv.availability}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB: DOCTORS & DUTY ROSTER */}
        {activeTab === 'doctors' && (
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {isBn ? 'চিকিৎসক প্যানেল ও কর্তব্যরত রোস্টার' : 'Medical Officers & Duty Roster'}
                </h2>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                  [REPLACE WITH REAL CONTENT]
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {isBn
                  ? 'কর্তব্যরত চিকিৎসকদের ডিগ্রি, চেম্বার ও নিয়মিত উপস্থিতির সময়সূচি (ডেমো রেকর্ড)।'
                  : 'Physician specialties, clinic rooms, and weekly schedule shifts for outpatient consultations.'}
              </p>
            </div>

            {/* Doctors Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((doc) => (
                <Card key={doc.id} className="p-6 border border-[#E2E8F0] space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-[#0F172A]">{isBn ? doc.nameBn : doc.name}</h3>
                        <span className="text-[9px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          [REPLACE]
                        </span>
                      </div>
                      <p className="text-xs text-[#1E3A8A] font-semibold">
                        {isBn ? doc.designationBn : doc.designation}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">{doc.degrees}</p>
                    </div>

                    <Badge variant={doc.availableToday ? 'success' : 'neutral'}>
                      {doc.availableToday ? (isBn ? 'আজ উপস্থিত' : 'On Duty Today') : (isBn ? 'ছুটি / অন-কল' : 'Off Duty')}
                    </Badge>
                  </div>

                  <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{isBn ? 'বিশেষজ্ঞতা' : 'Specialty'}:</span>
                      <span className="font-semibold text-slate-800 text-right">{doc.specialty}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{isBn ? 'কক্ষ নম্বর' : 'Room'}:</span>
                      <span className="font-mono text-slate-800">{doc.roomNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{isBn ? 'ডিউটির সময়' : 'Hours'}:</span>
                      <span className="font-mono text-slate-800">{doc.dutyTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{isBn ? 'ফোন / হটলাইন' : 'Phone'}:</span>
                      <span className="font-mono text-slate-800">{doc.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-wrap gap-1">
                      {(isBn ? doc.dutyDaysBn : doc.dutyDays).map((day) => (
                        <span key={day} className="text-[10px] bg-blue-50 text-[#1E3A8A] px-2 py-0.5 rounded font-medium">
                          {day}
                        </span>
                      ))}
                    </div>

                    <Link to={user ? '/student/medical' : '/login'}>
                      <Button variant="outline" size="sm" className="font-bold text-xs">
                        {isBn ? 'অ্যাপয়েন্টমেন্ট নিন' : 'Book Slot'}
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {/* Duty Roster Weekly Matrix */}
            <div className="mt-8 bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#0F172A]">
                    {isBn ? 'সাপ্তাহিক ডিউটি শিফট তালিকা' : 'Weekly Duty Shift Roster'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn
                      ? 'অনলাইন অ্যাপয়েন্টমেন্ট বুকিংয়ের জন্য সক্রিয় সময়সূচি।'
                      : 'Active duty slots synchronized with the student & staff booking engine.'}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  [REPLACE WITH REAL CONTENT]
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F8FAFC] text-slate-600 uppercase text-[10px] tracking-wider border-b border-[#E2E8F0]">
                    <tr>
                      <th className="py-2.5 px-3">{isBn ? 'বার' : 'Day'}</th>
                      <th className="py-2.5 px-3">{isBn ? 'চিকিৎসক' : 'Doctor'}</th>
                      <th className="py-2.5 px-3">{isBn ? 'বিশেষজ্ঞতা' : 'Specialty'}</th>
                      <th className="py-2.5 px-3">{isBn ? 'সময় স্লট' : 'Time Slot'}</th>
                      <th className="py-2.5 px-3">{isBn ? 'কক্ষ' : 'Room'}</th>
                      <th className="py-2.5 px-3 text-right">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {dutyShifts.map((shift) => (
                      <tr key={shift.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-[#0F172A]">{shift.dayOfWeek}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{shift.doctorName}</td>
                        <td className="py-2.5 px-3 text-slate-600">{shift.doctorSpecialty}</td>
                        <td className="py-2.5 px-3 font-mono font-medium text-[#1E3A8A]">{shift.timeSlot}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{shift.roomNumber}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {isBn ? 'সক্রিয়' : 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: OPENING HOURS */}
        {activeTab === 'hours' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#0F172A]">
                {isBn ? 'মেডিকেল সেন্টারের সেবার সময়সূচি' : 'Operating Hours & Service Schedule'}
              </h2>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                [REPLACE WITH REAL CONTENT]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 border border-[#E2E8F0] space-y-3">
                <div className="p-2.5 bg-blue-50 rounded-xl w-fit text-[#1E3A8A]">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#0F172A]">
                  {isBn ? 'সাধারণ বহির্বিভাগ (OPD)' : 'Outpatient Department (OPD)'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isBn
                    ? 'রবিবার থেকে বৃহস্পতিবার: সকাল ৮:৩০ - দুপুর ২:৩০ [REPLACE WITH REAL CONTENT]'
                    : 'Sunday to Thursday: 8:30 AM - 2:30 PM [REPLACE WITH REAL CONTENT]'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {isBn
                    ? 'সাধারণ শারীরিক পরীক্ষা, রক্তচাপ ও প্রাথমিক প্রেসক্রিপশন প্রদান।'
                    : 'Walk-in consults, digital referrals, vital assessments, and routine triage.'}
                </p>
              </Card>

              <Card className="p-6 border border-[#E2E8F0] space-y-3">
                <div className="p-2.5 bg-emerald-50 rounded-xl w-fit text-emerald-700">
                  <Pill className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#0F172A]">
                  {isBn ? 'ওষুধ ডিসপেনসারি ফার্মেসি' : 'Essential Dispensary'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isBn
                    ? 'রবিবার থেকে বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৪:০০ [REPLACE WITH REAL CONTENT]'
                    : 'Sunday to Thursday: 9:00 AM - 4:00 PM [REPLACE WITH REAL CONTENT]'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {isBn
                    ? 'প্রেসক্রিপশন প্রদর্শন সাপেক্ষে বিনামূল্যে জরুরি ওষুধ সংগ্রহ।'
                    : 'Free medicine collection upon presenting official digital prescription.'}
                </p>
              </Card>

              <Card className="p-6 border border-[#E2E8F0] space-y-3">
                <div className="p-2.5 bg-red-50 rounded-xl w-fit text-red-600">
                  <Ambulance className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#0F172A]">
                  {isBn ? 'জরুরি অ্যাম্বুলেন্স ও অন-কল ডাক্তার' : '24/7 On-Call Emergency'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-bold text-red-700">
                  {isBn ? 'সার্বক্ষণিক ২৪ ঘণ্টা / ৭ দিন [REPLACE WITH REAL CONTENT]' : '24 Hours Daily / 7 Days [REPLACE WITH REAL CONTENT]'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {isBn
                    ? 'রাতে ও ছুটির দিনে অন-কল ডিউটি ডাক্তার ও ড্রাইভার স্ট্যান্ডবাই থাকে।'
                    : 'Paramedic driver and on-call resident officer available around the clock.'}
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* TAB: EMERGENCY CONTACTS */}
        {activeTab === 'emergency' && (
          <div className="space-y-6" id="emergency">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#0F172A]">
                {isBn ? 'জরুরি চিকিৎসা হেল্পলাইন ও হটলাইন' : 'Emergency Contacts & Medical Hotlines'}
              </h2>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                [REPLACE WITH REAL CONTENT]
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {isBn
                ? 'যেকোনো জরুরি স্বাস্থ্য সংকটে তাৎক্ষণিক যোগাযোগের সরকারি ও প্রাতিষ্ঠানিক নম্বরসমূহ।'
                : 'Direct lines for critical assistance, emergency ambulance transfer, and medical desk dispatch.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyContacts.map((contact) => (
                <Card key={contact.id} className="p-6 border border-[#E2E8F0] space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-[#0F172A]">{isBn ? contact.titleBn : contact.title}</h3>
                      <p className="text-xs text-slate-600">{isBn ? contact.descriptionBn : contact.description}</p>
                    </div>
                    {contact.isAmbulance && (
                      <span className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0">
                        <Ambulance className="w-5 h-5" />
                      </span>
                    )}
                  </div>

                  <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">
                        {isBn ? 'হটলাইন নম্বর' : 'Helpline Number'}:
                      </span>
                      <span className="text-base font-bold font-mono text-red-700 tracking-wide">
                        {contact.number}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-600 bg-white border border-[#E2E8F0] px-2.5 py-1 rounded">
                      {isBn ? contact.availableHoursBn : contact.availableHours}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB: AMBULANCE */}
        {activeTab === 'ambulance' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#0F172A]">
                {isBn ? 'বিশ্ববিদ্যালয় অ্যাম্বুলেন্স সেবা' : 'University Emergency Ambulance Service'}
              </h2>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                [REPLACE WITH REAL CONTENT]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-slate-600 text-sm leading-relaxed">
                  {isBn
                    ? 'জেএসটিইউ ক্যাম্পাসে জরুরি স্বাস্থ্য সংকট, দুর্ঘটনা বা গুরুতর অসুস্থ রোগীর তাৎক্ষণিক চিকিৎসার জন্য সার্বক্ষণিক ২টি আধুনিক অ্যাম্বুলেন্স স্ট্যান্ডবাই থাকে।'
                    : 'The JSTU Medical Center maintains two dedicated life-support ambulances on 24/7 alert for prompt emergency transport and patient transfers to Jamalpur 250-Bed General Hospital or Mymensingh Medical College Hospital.'}
                </p>

                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4" />
                    {isBn ? '২৪/৭ অ্যাম্বুলেন্স হটলাইন' : '24/7 Ambulance Dispatch Desk'}
                  </span>
                  <div className="text-lg font-mono font-extrabold text-red-900">
                    +880 1700-000010 <span className="text-xs text-red-700 font-sans">[REPLACE WITH REAL CONTENT]</span>
                  </div>
                  <p className="text-xs text-red-800">
                    {isBn
                      ? 'কল করার সময় রোগীর সুনির্দিষ্ট অবস্থান (হল, কক্ষ নম্বর বা ভবন) পরিষ্কারভাবে উল্লেখ করুন।'
                      : 'State the patient location clearly (Hall Name, Room Number, or Academic Complex).'}
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <p><strong>{isBn ? 'ক্যাম্পাসের ভেতরে' : 'Campus Transit'}:</strong> {isBn ? 'সম্পূর্ণ বিনামূল্যে।' : '100% Free of cost for students and staff.'}</p>
                  <p><strong>{isBn ? 'হাসপাতালে রেফারেল' : 'Hospital Transfer'}:</strong> {isBn ? 'জামালপুর জেলা হাসপাতালে সরকারি ভর্তুকিযুক্ত জ্বালানি খরচে স্থানান্তর।' : 'Subsidized emergency referral to regional tertiary centers.'}</p>
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-3">
                <h3 className="font-bold text-sm text-[#0F172A]">
                  {isBn ? 'অ্যাম্বুলেন্সের জরুরি সরঞ্জাম' : 'On-Board Life-Support Equipment'}
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isBn ? 'হাই-ফ্লো অক্সিজেন সিলিন্ডার ও ফেস মাস্ক' : 'High-flow oxygen cylinders with regulation valves'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isBn ? 'হুইলচেয়ার ও ফোল্ডেবল স্পাইনাল স্ট্রেচার' : 'Foldable multi-position spinal stretcher'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isBn ? 'জরুরি ফার্স্ট এইড ও ট্রমাকিট' : 'Emergency trauma resuscitation & dressing kit'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isBn ? 'বিপি ও গ্লুকোমিটার মনিটরিং সেট' : 'Portable blood pressure & vital glucometer units'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB: HEALTH TIPS */}
        {activeTab === 'health-tips' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                {isBn ? 'শিক্ষার্থী ও শিক্ষক স্বাস্থ্য সচেতনতা তথ্য' : 'Student & Campus Wellness Guidelines'}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                {isBn
                  ? 'মৌসুমী রোগ প্রতিরোধ, কম্পিউটার ক্লান্তি ও মানসিক চাপ নিরসনে তথ্যমূলক নির্দেশিকা।'
                  : 'Educational preventive health notes. Strictly non-diagnostic information for campus life.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {healthTips.map((tip) => (
                <Card key={tip.id} className="p-6 border border-[#E2E8F0] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded">
                        {isBn ? tip.categoryBn : tip.category}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">{tip.readTime}</span>
                    </div>

                    <h3 className="font-bold text-sm text-[#0F172A] leading-snug">
                      {isBn ? tip.titleBn : tip.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {isBn ? tip.summaryBn : tip.summary}
                    </p>

                    <ul className="space-y-2 pt-2 border-t border-[#E2E8F0] text-xs text-slate-700">
                      {(isBn ? tip.contentBn : tip.content).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#1E3A8A] font-bold shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-[11px] text-slate-500 italic">
                    {isBn ? 'তথ্যসূত্র: জেএসটিইউ স্বাস্থ্য সচেতনতা সেল' : 'Source: JSTU Health Advisory Cell'}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB: FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                {isBn ? 'মেডিকেল সেন্টার সম্পর্কিত সচরাচর জিজ্ঞাসা' : 'Frequently Asked Questions (FAQ)'}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                {isBn
                  ? 'চিকিৎসা গ্রহণ, অ্যাপয়েন্টমেন্ট এবং ডিসপেনসারি সম্পর্কিত প্রয়োজনীয় উত্তর।'
                  : 'Common questions regarding student eligibility, emergency triage, and prescription dispensaries.'}
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full text-left p-4 font-bold text-sm text-[#0F172A] hover:bg-[#F8FAFC] transition-colors flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span>{isBn ? faq.qBn : faq.qEn}</span>
                    <span className="text-[#1E3A8A] text-lg font-mono">
                      {expandedFaq === idx ? '−' : '+'}
                    </span>
                  </button>

                  {expandedFaq === idx && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-[#F8FAFC]/50">
                      {isBn ? faq.aBn : faq.aEn}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CONTACT */}
        {activeTab === 'contact' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#0F172A]">
                {isBn ? 'মেডিকেল সেন্টারের অবস্থান ও যোগাযোগ' : 'Location & Administrative Contact'}
              </h2>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                [REPLACE WITH REAL CONTENT]
              </span>
            </div>

            <Card className="p-6 border border-[#E2E8F0] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700">
                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 block">{isBn ? 'ঠিকানা' : 'Physical Address'}:</span>
                  <p className="font-medium text-slate-800">
                    {isBn
                      ? 'মেডিকেল কমপ্লেক্স ভবন, প্রশাসনিক ভবনের পূর্ব পার্শ্বে, স্থায়ী ক্যাম্পাস, জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়, জামালপুর-২০১২।'
                      : 'Medical Complex Building, East of Central Administrative Building, Permanent Campus, Jamalpur-2012, Bangladesh.'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 block">{isBn ? 'ইমেইল যোগাযোগ' : 'Official Email'}:</span>
                  <p className="font-mono text-slate-800">medical.center@jstu.ac.bd [REPLACE]</p>
                  <p className="font-mono text-slate-800">chief.medical@jstu.ac.bd [REPLACE]</p>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 block">{isBn ? 'টেলিফোন / ডেস্ক' : 'Helpdesk Phone'}:</span>
                  <p className="font-mono text-slate-800">+880 1700-000001 [REPLACE WITH REAL CONTENT]</p>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 block">{isBn ? 'অনলাইন সেবা পোর্টাল' : 'Online Booking'}:</span>
                  <Link to="/student/medical" className="text-[#1E3A8A] font-semibold hover:underline">
                    /student/medical →
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};
