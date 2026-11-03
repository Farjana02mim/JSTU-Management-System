import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Award,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Download,
  Printer,
  QrCode,
  DollarSign,
  Users,
  Search,
  ShieldCheck,
  FileText,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  Check,
  X,
  CreditCard,
  UserCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import {
  ConvocationEvent,
  ConvocationRegistration,
  GownSize
} from '../../types/convocation';

export const ConvocationPage: React.FC = () => {
  const { user, profile, claims } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const storeManager = SharedDataStoreManager.getInstance();

  const [event] = useState<ConvocationEvent>(() => storeManager.getConvocationEvent());
  const [registrations, setRegistrations] = useState<ConvocationRegistration[]>(() =>
    storeManager.getConvocationRegistrations()
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'register' | 'status' | 'pass'>('overview');

  // Registration Form State
  const [regForm, setRegForm] = useState({
    studentId: claims?.studentId || 'JSTU2026001',
    graduateName: profile?.fullName || user?.displayName || 'Tanvir Ahmed',
    graduateNameBn: profile?.fullNameBn || 'তানভীর আহমেদ',
    email: user?.email || 'student.demo@jstu.ac.bd',
    phone: '+880 1712 345678',
    department: 'Computer Science & Engineering',
    departmentCode: 'CSE',
    degree: 'B.Sc. (Engg.) in Computer Science & Engineering',
    passingSession: '2019-20',
    passingYear: 2024,
    cgpa: 3.82,
    gownSize: 'L' as GownSize,
    guestCount: 1,
    guestName1: 'Md. Rafiqul Islam (Father)',
    guestName2: ''
  });

  const [registrationFeedback, setRegistrationFeedback] = useState<string | null>(null);

  // Status Search State
  const [statusSearchId, setStatusSearchId] = useState(claims?.studentId || 'JSTU2026001');
  const [searchedReg, setSearchedReg] = useState<ConvocationRegistration | null>(() => {
    return storeManager.getConvocationRegistrationByStudentId('JSTU2026001') || null;
  });

  // Mock Payment Gateway Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [targetPaymentReg, setTargetPaymentReg] = useState<ConvocationRegistration | null>(null);
  const [selectedPayMethod, setSelectedPayMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Card'>('bKash');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Pass View Modal / Print
  const [viewingPassReg, setViewingPassReg] = useState<ConvocationRegistration | null>(null);

  const refreshRegistrations = () => {
    const list = storeManager.getConvocationRegistrations();
    setRegistrations(list);
    if (searchedReg) {
      const updated = list.find((r) => r.id === searchedReg.id);
      if (updated) setSearchedReg(updated);
    }
  };

  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusSearchId.trim()) return;
    const found = registrations.find(
      (r) =>
        r.studentId.toLowerCase() === statusSearchId.trim().toLowerCase() ||
        r.registrationNumber.toLowerCase() === statusSearchId.trim().toLowerCase()
    );
    setSearchedReg(found || null);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.studentId || !regForm.graduateName || !regForm.email) return;

    const guestNames: string[] = [];
    if (regForm.guestCount >= 1 && regForm.guestName1.trim()) guestNames.push(regForm.guestName1.trim());
    if (regForm.guestCount >= 2 && regForm.guestName2.trim()) guestNames.push(regForm.guestName2.trim());

    const totalFee = event.graduateFee + regForm.guestCount * event.guestFee;

    const created = storeManager.createConvocationRegistration({
      convocationId: event.id,
      studentId: regForm.studentId.trim(),
      graduateName: regForm.graduateName.trim(),
      graduateNameBn: regForm.graduateNameBn.trim() || undefined,
      email: regForm.email.trim(),
      phone: regForm.phone.trim(),
      department: regForm.department,
      departmentCode: regForm.departmentCode,
      degree: regForm.degree,
      passingSession: regForm.passingSession,
      passingYear: Number(regForm.passingYear),
      cgpa: Number(regForm.cgpa),
      gownSize: regForm.gownSize,
      guestCount: regForm.guestCount,
      guestNames,
      totalFee
    });

    refreshRegistrations();
    setSearchedReg(created);
    setRegistrationFeedback(
      isBn
        ? `সমাবর্তন আবেদন সফল হয়েছে! রেজিস্ট্রেশন নম্বর: ${created.registrationNumber}। রেজিস্ট্রারের অনুমোদনের পর ফি পরিশোধ করা যাবে।`
        : `Convocation registration submitted successfully! Application No: ${created.registrationNumber}. Please check status once verified by Office of the Registrar.`
    );
    setActiveTab('status');
  };

  const handleOpenPaymentModal = (reg: ConvocationRegistration) => {
    setTargetPaymentReg(reg);
    setPaymentModalOpen(true);
  };

  const handleConfirmMockPayment = () => {
    if (!targetPaymentReg) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      const txnId = `${selectedPayMethod.toUpperCase()}${Math.floor(100000 + Math.random() * 900000)}CONV`;
      storeManager.payConvocationFee(targetPaymentReg.id, selectedPayMethod, txnId);
      refreshRegistrations();
      setIsProcessingPayment(false);
      setPaymentModalOpen(false);

      const updated = storeManager
        .getConvocationRegistrations()
        .find((r) => r.id === targetPaymentReg.id);
      if (updated) {
        setSearchedReg(updated);
        setViewingPassReg(updated);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-800">
      <SEOHead
        title={isBn ? '২য় সমাবর্তন ২০২৬ | জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়' : '2nd Convocation 2026 | JSTU'}
        description={
          isBn
            ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের ২য় সমাবর্তন ২০২৬: গ্র্যাজুয়েট অনলাইন নিবন্ধন, গাউন বরাদ্দ ও প্রবেশপত্র যাচাই।'
            : 'JSTU 2nd Convocation 2026: online graduate registration, registrar verification, fee payment, and digital convocation pass.'
        }
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#07192C] via-[#0A2540] to-[#1E3A8A] text-white py-14 px-4 sm:px-8 border-b border-blue-950 shadow-md">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>{isBn ? 'জেএসটিইউ প্রাতিষ্ঠানিক সমাবর্তন ২০২৬' : 'JSTU 2nd Grand Convocation 2026'}</span>
            </div>

            <span className="text-[11px] font-mono bg-white/10 px-2.5 py-1 rounded text-slate-300">
              REGISTRATION PORTAL &bull; SESSIONS {event.eligibleSessions.join(', ')}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                {isBn ? 'জেএসটিইউ ২য় সমাবর্তন ২০২৬' : 'JSTU 2nd Convocation 2026'}
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mt-2 leading-relaxed">
                {isBn
                  ? 'মহামান্য আচার্য ও রাষ্ট্রপতির উপস্থিতিতে জামালপুর স্থায়ী ক্যাম্পাসে অনুষ্ঠিত হতে যাচ্ছে বিশ্ববিদ্যালয় দ্বিতীয় মহা সমাবর্তন।'
                  : 'Celebrating scholarly distinction and awarding baccalaureate and graduate degrees in the solemn presence of the Chancellor and dignitaries.'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('status')}
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs"
                leftIcon={<Search className="w-4 h-4" />}
              >
                {isBn ? 'আবেদনের অবস্থা' : 'Check Status'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveTab('register')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
                leftIcon={<GraduationCap className="w-4 h-4" />}
              >
                {isBn ? 'অনলাইন নিবন্ধন করুন' : 'Register for Convocation'}
              </Button>
            </div>
          </div>

          {/* Event Quick Meta Strips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-blue-900/60 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Convocation Date</span>
                <span className="font-bold">{event.dateFormatted.split('(')[0]}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Arena Venue</span>
                <span className="font-semibold truncate block max-w-xs">Permanent Campus Grounds</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-300 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Registration Cutoff</span>
                <span className="font-semibold">Nov 15, 2026 (11:59 PM)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-300 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Eligible Batches</span>
                <span className="font-semibold">{event.eligibleSessions.length} Academic Sessions</span>
              </div>
            </div>
          </div>

          {/* Sub-navigation tabs */}
          <div className="flex border-b border-blue-900/70 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'overview'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>{isBn ? 'নির্দেশিকা ও সূচি' : 'Schedule & Guidelines'}</span>
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'register'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{isBn ? 'গ্র্যাজুয়েট নিবন্ধন' : 'Online Registration'}</span>
            </button>

            <button
              onClick={() => setActiveTab('status')}
              className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'status'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{isBn ? 'অবস্থা ও ফি পরিশোধ' : 'Status & Fee Payment'}</span>
            </button>

            <button
              onClick={() => setActiveTab('pass')}
              className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'pass'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>{isBn ? 'সমাবর্তন পাস ও কিট ভাউচার' : 'Convocation Pass & QR'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 space-y-6">
        {/* Global Feedback Banner */}
        {registrationFeedback && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{registrationFeedback}</span>
            </div>
            <button
              onClick={() => setRegistrationFeedback(null)}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              &times;
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW & SCHEDULE */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Event Schedule & Dignitaries */}
              <div className="md:col-span-2 space-y-6">
                <Card padding="lg" className="bg-white border-slate-200 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-blue-700 font-bold tracking-wider">
                      OFFICIAL CONVOCATION NOTIFICATION &bull; JSTU/REG/CONV/2026/01
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">
                      {isBn ? '২য় সমাবর্তন অনুষ্ঠানের সাধারণ নির্দেশনা ও নিয়মাবলী' : 'General Convocation Regulations & Procedure'}
                    </h2>
                  </div>

                  <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                    <p>
                      The 2nd Convocation of Jamalpur Science & Technology University (JSTU) will confer undergraduate degrees upon successful candidates of the academic sessions <strong>2017-18, 2018-19, 2019-20, and 2020-21</strong> who have fulfilled all academic ordinances, completed compulsory internships/theses, and cleared all hall and library accounts.
                    </p>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-500" />
                        Key Event Dignitaries:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-semibold uppercase">Presided by (Chancellor)</span>
                          <span className="font-bold text-slate-800">{event.chancellor}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-semibold uppercase">Convocation Speaker</span>
                          <span className="font-bold text-slate-800">{event.chiefGuest}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Four-Step Registration Timeline */}
                  <div className="pt-2 space-y-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      Convocation Flow for Graduates:
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                          1
                        </div>
                        <div className="font-bold text-slate-900">Online Registration</div>
                        <p className="text-[11px] text-slate-500">Submit degree, CGPA, gown size & guest count.</p>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                          2
                        </div>
                        <div className="font-bold text-slate-900">Registrar Audit</div>
                        <p className="text-[11px] text-slate-500">Graduation clearance verified by Registrar office.</p>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                          3
                        </div>
                        <div className="font-bold text-slate-900">Fee Payment</div>
                        <p className="text-[11px] text-slate-500">Pay ৳3,500 + guest fees through mock portal.</p>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          4
                        </div>
                        <div className="font-bold text-slate-900">Pass & Gown Kit</div>
                        <p className="text-[11px] text-slate-500">Download digital QR pass with assigned seat zone.</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Important Dates Table */}
                <Card padding="md" className="bg-white border-slate-200 space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    Important Schedule & Milestones
                  </h3>

                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="font-medium text-slate-700">Online Registration Portal Closes</span>
                      <span className="font-mono font-bold text-rose-600">November 15, 2026 (11:59 PM)</span>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="font-medium text-slate-700">Registrar Verification & Approval Roster</span>
                      <span className="font-mono font-semibold text-slate-800">November 18, 2026</span>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="font-medium text-slate-700">Academic Gown, Hood & Gift Kit Distribution</span>
                      <span className="font-mono font-semibold text-slate-800">November 25 & 26, 2026 (10 AM - 4 PM)</span>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="font-medium text-slate-700">Mandatory Convocation Rehearsal</span>
                      <span className="font-mono font-semibold text-slate-800">November 27, 2026 (3:00 PM)</span>
                    </div>
                    <div className="py-2.5 flex items-center justify-between bg-amber-50/50 px-2 rounded">
                      <span className="font-bold text-amber-900">Official 2nd Convocation Ceremony</span>
                      <span className="font-mono font-extrabold text-amber-900">November 28, 2026 (10:00 AM)</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Fee Structure & Gown Sizing Sidebar */}
              <div className="space-y-4">
                <Card padding="md" className="bg-white border-slate-200 space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    Convocation Fee Structure
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-slate-800">Single Graduate Fee</div>
                        <span className="text-[10px] text-slate-400">Includes Gown Kit, Hood, Crest & Lunch</span>
                      </div>
                      <span className="font-mono font-bold text-blue-700">৳3,500</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-slate-800">Accompanying Guest Fee</div>
                        <span className="text-[10px] text-slate-400">Per Guest (Max 2 Guests per Graduate)</span>
                      </div>
                      <span className="font-mono font-bold text-blue-700">৳1,000 / guest</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic">
                    Fee payments are processed only after graduation clearance is verified by the Registrar.
                  </p>
                </Card>

                <Card padding="md" className="bg-white border-slate-200 space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    Academic Gown Sizing Chart
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-1.5 px-2">Size</th>
                          <th className="py-1.5 px-2">Height Range</th>
                          <th className="py-1.5 px-2">Chest</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                        <tr>
                          <td className="py-1 px-2 font-bold text-blue-700">S</td>
                          <td className="py-1 px-2">5&apos;0&quot; - 5&apos;3&quot;</td>
                          <td className="py-1 px-2">34&quot; - 36&quot;</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 font-bold text-blue-700">M</td>
                          <td className="py-1 px-2">5&apos;4&quot; - 5&apos;7&quot;</td>
                          <td className="py-1 px-2">36&quot; - 38&quot;</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 font-bold text-blue-700">L</td>
                          <td className="py-1 px-2">5&apos;8&quot; - 5&apos;11&quot;</td>
                          <td className="py-1 px-2">38&quot; - 42&quot;</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 font-bold text-blue-700">XL / XXL</td>
                          <td className="py-1 px-2">6&apos;0&quot;+</td>
                          <td className="py-1 px-2">42&quot;+</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                  <span className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    Registrar Clearance Requirement
                  </span>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    Make sure you have returned all university library books and cleared residential hall dues before the deadline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ONLINE GRADUATE REGISTRATION */}
        {activeTab === 'register' && (
          <Card padding="lg" className="bg-white border-slate-200 max-w-4xl mx-auto space-y-6">
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-blue-700 font-bold">
                JSTU 2ND CONVOCATION &bull; GRADUATE REGISTRATION FORM
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {isBn ? 'গ্র্যাজুয়েট সমাবর্তন নিবন্ধন ফরম' : 'Graduate Convocation Online Registration'}
              </h2>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'আপনার সঠিক একাডেমিক তথ্য, গাউনের মাপ এবং অতিথি সংখ্যা নির্ধারণ করুন। তথ্য যাচাইয়ের জন্য রেজিস্ট্রারের কাছে পাঠানো হবে।'
                  : 'Complete the form with your authentic graduation records. Submissions are verified against Controller of Examinations records.'}
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Student Roll / ID Number *</label>
                  <input
                    type="text"
                    required
                    value={regForm.studentId}
                    onChange={(e) => setRegForm({ ...regForm, studentId: e.target.value })}
                    placeholder="e.g. JSTU2026001"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Graduate Full Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={regForm.graduateName}
                    onChange={(e) => setRegForm({ ...regForm, graduateName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Department *</label>
                  <select
                    value={regForm.departmentCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      const deptNames: Record<string, string> = {
                        CSE: 'Computer Science & Engineering',
                        EEE: 'Electrical & Electronic Engineering',
                        MATH: 'Mathematics',
                        FISH: 'Fisheries & Marine Bioscience',
                        GEOL: 'Geology & Mining',
                        MGMT: 'Management Studies',
                        SOCW: 'Social Work'
                      };
                      setRegForm({
                        ...regForm,
                        departmentCode: code,
                        department: deptNames[code] || 'Engineering'
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="CSE">CSE</option>
                    <option value="EEE">EEE</option>
                    <option value="MATH">Mathematics</option>
                    <option value="FISH">Fisheries</option>
                    <option value="GEOL">Geology</option>
                    <option value="MGMT">Management</option>
                    <option value="SOCW">Social Work</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Academic Session *</label>
                  <select
                    value={regForm.passingSession}
                    onChange={(e) => setRegForm({ ...regForm, passingSession: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  >
                    {event.eligibleSessions.map((ses) => (
                      <option key={ses} value={ses}>{ses}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Published CGPA (4.00 Scale) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="2.00"
                    max="4.00"
                    required
                    value={regForm.cgpa}
                    onChange={(e) => setRegForm({ ...regForm, cgpa: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Mobile Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Gown & Guest Details */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Gown Sizing & Guest Passes Configuration:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Academic Gown & Cap Size *</label>
                    <div className="grid grid-cols-5 gap-2">
                      {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => (
                        <button
                          type="button"
                          key={sz}
                          onClick={() => setRegForm({ ...regForm, gownSize: sz })}
                          className={`p-2 rounded-lg border font-mono font-bold text-xs transition ${
                            regForm.gownSize === sz
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Accompanying Guests (Max 2) *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2].map((cnt) => (
                        <button
                          type="button"
                          key={cnt}
                          onClick={() => setRegForm({ ...regForm, guestCount: cnt })}
                          className={`p-2 rounded-lg border font-bold text-xs transition ${
                            regForm.guestCount === cnt
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {cnt === 0 ? 'No Guests' : `${cnt} Guest${cnt > 1 ? 's' : ''}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {regForm.guestCount >= 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Guest 1 Full Name & Relation *</label>
                      <input
                        type="text"
                        required
                        value={regForm.guestName1}
                        onChange={(e) => setRegForm({ ...regForm, guestName1: e.target.value })}
                        placeholder="e.g. Md. Rafiqul Islam (Father)"
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    {regForm.guestCount >= 2 && (
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Guest 2 Full Name & Relation *</label>
                        <input
                          type="text"
                          required
                          value={regForm.guestName2}
                          onChange={(e) => setRegForm({ ...regForm, guestName2: e.target.value })}
                          placeholder="e.g. Mrs. Hamida Begum (Mother)"
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Total Fee Preview */}
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Calculated Registration Fee:</span>
                    <span className="text-xs text-slate-700">
                      Graduate (৳{event.graduateFee.toLocaleString()}) + {regForm.guestCount} Guest(s) (৳{(regForm.guestCount * event.guestFee).toLocaleString()})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-lg text-blue-700">
                      ৳{(event.graduateFee + regForm.guestCount * event.guestFee).toLocaleString('en-US')} BDT
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="ghost" size="sm" type="button" onClick={() => setActiveTab('overview')}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" className="bg-blue-600 hover:bg-blue-500 font-bold">
                  Submit Convocation Registration
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* TAB 3: CHECK STATUS & PAY FEE */}
        {activeTab === 'status' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card padding="md" className="bg-white border-slate-200 space-y-3">
              <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Search Convocation Registration by Student ID or Application No:</span>
              </h2>

              <form onSubmit={handleSearchStatus} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. JSTU2026001 or JSTU-CONV-2026-1001"
                  value={statusSearchId}
                  onChange={(e) => setStatusSearchId(e.target.value)}
                  className="flex-1 p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Button variant="primary" size="sm" type="submit" className="bg-blue-600 hover:bg-blue-500">
                  Search Record
                </Button>
              </form>
            </Card>

            {searchedReg ? (
              <Card padding="lg" className="bg-white border-slate-200 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {searchedReg.registrationNumber}
                      </span>
                      <Badge
                        variant={
                          searchedReg.approvalStatus === 'APPROVED'
                            ? 'success'
                            : searchedReg.approvalStatus === 'REJECTED'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        Registrar {searchedReg.approvalStatus}
                      </Badge>
                      <Badge
                        variant={searchedReg.paymentStatus === 'PAID' ? 'success' : 'neutral'}
                      >
                        Fee: {searchedReg.paymentStatus}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {searchedReg.graduateName}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Student ID: {searchedReg.studentId} &bull; {searchedReg.department}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-mono">Total Fee</span>
                    <span className="text-xl font-bold font-mono text-slate-900">
                      ৳{searchedReg.totalFee.toLocaleString('en-US')}
                    </span>
                  </div>
                </div>

                {/* Status-specific banners and action triggers */}
                {searchedReg.approvalStatus === 'PENDING' && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-900">
                    <div className="font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" />
                      Pending Registrar Office Verification
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Your registration is currently queued with the Office of the Registrar. Once your academic clearance and degree eligibility are certified, the online fee payment channel will unlock.
                    </p>
                  </div>
                )}

                {searchedReg.approvalStatus === 'APPROVED' && searchedReg.paymentStatus === 'UNPAID' && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3 text-xs">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="font-bold text-blue-950 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Registration Approved by Office of the Registrar!
                        </div>
                        <p className="text-[11px] text-blue-800 mt-0.5">
                          Assigned Seat: <strong>{searchedReg.assignedSeat || 'Allocated Zone A'}</strong> &bull; Gown Kit ID: <strong>{searchedReg.assignedGownKitId || 'Kit Assigned'}</strong>
                        </p>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenPaymentModal(searchedReg)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                        leftIcon={<DollarSign className="w-4 h-4" />}
                      >
                        Pay Convocation Fee (৳{searchedReg.totalFee.toLocaleString('en-US')})
                      </Button>
                    </div>
                  </div>
                )}

                {searchedReg.approvalStatus === 'APPROVED' && searchedReg.paymentStatus === 'PAID' && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Registration Fully Certified & Paid (Ready for Convocation)
                        </div>
                        <p className="text-[11px] text-emerald-800 mt-0.5 font-mono">
                          Payment Txn: {searchedReg.paymentTxnId} &bull; Method: {searchedReg.paymentMethod}
                        </p>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setViewingPassReg(searchedReg);
                          setActiveTab('pass');
                        }}
                        className="bg-blue-700 hover:bg-blue-600 text-white font-bold"
                        leftIcon={<QrCode className="w-4 h-4" />}
                      >
                        View & Download Digital Pass
                      </Button>
                    </div>
                  </div>
                )}

                {/* Breakdown details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Degree</span>
                    <span className="font-bold text-slate-800">{searchedReg.degree}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Gown Size</span>
                    <span className="font-mono font-bold text-slate-800">{searchedReg.gownSize}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Guest Passes</span>
                    <span className="font-bold text-slate-800">{searchedReg.guestCount} Guest(s)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Assigned Seat</span>
                    <span className="font-semibold text-blue-700">{searchedReg.assignedSeat || 'Pending'}</span>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="p-8 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
                No registration found for &ldquo;{statusSearchId}&rdquo;.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CONVOCATION PASS & QR ENTRY PASS */}
        {activeTab === 'pass' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {viewingPassReg || searchedReg?.approvalStatus === 'APPROVED' ? (
              (() => {
                const pass = viewingPassReg || searchedReg!;
                const qrUrl = `/verify-convocation/${pass.passToken}`;

                return (
                  <div className="space-y-4">
                    {/* The Downloadable / Printable Pass Container */}
                    <div
                      id="printable-convocation-pass"
                      className="p-6 sm:p-8 bg-white border-2 border-slate-300 rounded-3xl shadow-md space-y-6 text-slate-800 font-sans"
                    >
                      {/* Pass Top Branding */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-200 pb-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                            J
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                              OFFICIAL CONVOCATION ENTRY PASS &bull; JSTU
                            </span>
                            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                              Jamalpur Science & Technology University
                            </h2>
                            <p className="text-xs text-blue-700 font-bold">
                              2nd Convocation 2026 &bull; Saturday, November 28, 2026
                            </p>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block">PASS TOKEN</span>
                          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                            {pass.passToken}
                          </span>
                        </div>
                      </div>

                      {/* Main Pass Body: Graduate Bio & QR Code */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                        <div className="sm:col-span-8 space-y-3 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-mono block">GRADUATE NAME</span>
                            <h3 className="text-lg font-black text-slate-900">{pass.graduateName}</h3>
                            <span className="text-xs text-slate-500 font-mono">
                              Student ID: <strong>{pass.studentId}</strong> &bull; Registration: <strong>{pass.registrationNumber}</strong>
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-semibold">Degree Conferred</span>
                              <span className="font-bold text-slate-800 block text-xs">{pass.degree}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-semibold">Department & Session</span>
                              <span className="text-slate-700 block text-xs">{pass.department} ({pass.passingSession})</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                            <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl">
                              <span className="text-[10px] text-blue-600 uppercase font-bold block">ASSIGNED ARENA SEAT</span>
                              <span className="font-bold text-xs text-blue-950">
                                {pass.assignedSeat || 'Zone A — Main Hall'}
                              </span>
                            </div>

                            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                              <span className="text-[10px] text-emerald-700 uppercase font-bold block">GOWN KIT VOUCHER</span>
                              <span className="font-bold text-xs text-emerald-950 font-mono">
                                {pass.assignedGownKitId || 'GW-KIT-01'} (Size: {pass.gownSize})
                              </span>
                            </div>
                          </div>

                          {pass.guestCount > 0 && (
                            <div className="pt-2 text-[11px] text-slate-600">
                              <span className="font-bold text-slate-800">Authorized Accompanying Guests ({pass.guestCount}):</span>{' '}
                              {pass.guestNames?.join(', ') || 'Authorized guest passes included'}
                            </div>
                          )}
                        </div>

                        {/* QR Code Column */}
                        <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                          {/* Visual QR Simulator */}
                          <div className="w-32 h-32 bg-white border-2 border-slate-800 p-2 rounded-xl flex flex-col items-center justify-center shadow-xs">
                            <QrCode className="w-24 h-24 text-slate-900" />
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 font-bold">
                            SCAN TO VERIFY
                          </span>
                          <Link
                            to={qrUrl}
                            target="_blank"
                            className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 font-mono"
                          >
                            <span>Verify Pass Online</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>

                      {/* Pass Footer Security Instructions */}
                      <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            {pass.paymentStatus === 'PAID'
                              ? 'Official Registrar Electronic Seal Valid & Paid &bull; Non-Transferable'
                              : 'Fee Payment Pending — Present with Payment Receipt'}
                          </span>
                        </div>
                        <span className="font-mono text-slate-400">DEMO — NOT OFFICIAL JSTU DOCUMENT</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-end gap-3 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.print()}
                        leftIcon={<Printer className="w-4 h-4" />}
                      >
                        Print Entry Ticket
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          alert(`Digital convocation pass downloaded for ${pass.graduateName}!`);
                        }}
                        className="bg-blue-600 hover:bg-blue-500"
                        leftIcon={<Download className="w-4 h-4" />}
                      >
                        Download PDF Pass
                      </Button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="p-8 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl space-y-3">
                <QrCode className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">No active convocation pass ready</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Please search for your Student ID in the &ldquo;Status & Fee Payment&rdquo; tab or complete online registration.
                </p>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('status')}>
                  Check Status
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: MOCK CONVOCATION FEE PAYMENT */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="JSTU Convocation Fee Payment (Sandbox Simulator)"
        size="md"
      >
        {targetPaymentReg && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">Payable Convocation Fee</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  ৳{targetPaymentReg.totalFee.toLocaleString('en-US')} BDT
                </span>
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-1 rounded font-mono">SANDBOX GATEWAY</span>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-700">Select Mobile Banking / Card Channel:</label>
              <div className="grid grid-cols-4 gap-2">
                {(['bKash', 'Nagad', 'Rocket', 'Card'] as const).map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setSelectedPayMethod(method)}
                    className={`p-2 rounded-lg border text-center font-bold text-xs transition ${
                      selectedPayMethod === method
                        ? 'border-blue-600 bg-blue-50 text-blue-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-blue-900">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Registrar Approved Registration
              </div>
              <p className="text-[11px] text-blue-800">
                Payment confirms gown kit voucher ({targetPaymentReg.gownSize}) and releases your digital entry ticket with QR validation.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                disabled={isProcessingPayment}
                onClick={() => setPaymentModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isProcessingPayment}
                onClick={handleConfirmMockPayment}
                className="bg-emerald-600 hover:bg-emerald-500 font-bold"
              >
                {isProcessingPayment ? 'Verifying...' : `Pay ৳${targetPaymentReg.totalFee.toLocaleString('en-US')}`}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
