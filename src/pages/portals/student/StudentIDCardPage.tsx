import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../../services/shared/sharedDataStore';
import {
  StudentIDCard,
  generateIdCardQrDataUrl,
  generateIdCardPdf,
  downloadIdCardPng,
  getVerificationUrl
} from '../../../services/idCard/idCardService';
import { NeutralUniversityLogo } from '../../../components/common/NeutralUniversityLogo';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import {
  CreditCard,
  Download,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Copy,
  Info,
  UserCheck
} from 'lucide-react';

export const StudentIDCardPage: React.FC = () => {
  const { profile, claims } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const storeManager = SharedDataStoreManager.getInstance();
  const allCards = storeManager.getIdCards();

  // Selected student card (default to logged-in student or first in seed)
  const defaultStudentId = claims?.studentId || (profile as { studentId?: string })?.studentId || 'JSTU2026001';
  const [selectedStudentId, setSelectedStudentId] = useState(defaultStudentId);
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active student card object
  const card: StudentIDCard =
    allCards.find(
      (c) => c.studentId.toLowerCase() === selectedStudentId.toLowerCase()
    ) ||
    allCards[0] || {
      id: 'card-fallback',
      studentId: defaultStudentId,
      name: 'Tanvir Ahmed',
      nameBn: 'তানভীর আহমেদ',
      department: 'Computer Science & Engineering',
      departmentBn: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং',
      faculty: 'Faculty of Engineering & Technology',
      facultyBn: 'প্রকৌশল ও প্রযুক্তি অনুষদ',
      session: '2022-2023',
      bloodGroup: 'B+',
      issueDate: '2023-01-15',
      validUntil: '2027-06-30',
      status: 'Active',
      verificationToken: 'tok_tanvir_jstu_7a8f9b',
      hallName: 'Shahid Rafiq Hall',
      hallNameBn: 'শহীদ রফিক হল',
      emergencyContact: '+880 1812-987654',
      gender: 'male',
      avatarSeed: 'tanvir_ahmed',
      updatedAt: '2026-01-15T10:00:00Z'
    };

  // Generate QR Code URL whenever token changes
  useEffect(() => {
    let isMounted = true;
    generateIdCardQrDataUrl(card.verificationToken)
      .then((url) => {
        if (isMounted) setQrCodeUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
      });
    return () => {
      isMounted = false;
    };
  }, [card.verificationToken]);

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const doc = await generateIdCardPdf(card);
      doc.save(`jstu_student_id_${card.studentId}.pdf`);
    } catch (err) {
      console.error('PDF generation failed', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadPng = async (side: 'front' | 'back' | 'both') => {
    try {
      setIsGeneratingPng(true);
      await downloadIdCardPng(card, side);
    } catch (err) {
      console.error('PNG download failed', err);
    } finally {
      setIsGeneratingPng(false);
    }
  };

  const handleCopyVerificationUrl = () => {
    const url = getVerificationUrl(card.verificationToken);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <DashboardLayout portalTitle="Student Portal">
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#0F172A] text-white p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold mb-3 border border-white/20">
                <CreditCard className="w-3.5 h-3.5 text-blue-200" />
                <span>{isBn ? 'ডিজিটাল আইডি কার্ড' : 'Digital Student ID Card'}</span>
                <span className="text-amber-300 ml-1 font-bold">DEMO</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                {isBn ? 'স্মার্ট ক্যাম্পাস ডিজিটাল স্টুডেন্ট আইডি' : 'Smart Campus Digital Student ID'}
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1">
                {isBn
                  ? 'আপনার প্রাতিষ্ঠানিক ডিজিটাল আইডি কার্ড প্রদর্শন, কিউআর কোড ভেরিফিকেশন এবং পিডিএফ/পিএনজি ডাউনলোড করুন।'
                  : 'View official campus identification, verify cryptographic credentials via QR, and export to PDF or PNG.'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isGeneratingPdf ? (isBn ? 'তৈরি হচ্ছে...' : 'Generating PDF...') : (isBn ? 'পিডিএফ ডাউনলোড' : 'Download PDF')}</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDownloadPng('both')}
                disabled={isGeneratingPng}
                className="bg-white text-[#1E3A8A] hover:bg-blue-50 text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isGeneratingPng ? (isBn ? 'ডাউনলোড হচ্ছে...' : 'Exporting...') : (isBn ? 'পিএনজি ছবি ডাউনলোড' : 'Download PNG')}</span>
              </Button>
            </div>
          </div>

          {/* Background watermark badge */}
          <div className="absolute right-3 -bottom-6 opacity-10 pointer-events-none select-none text-right font-black text-7xl text-white">
            DEMO ID
          </div>
        </div>

        {/* Demo Student Profile Switcher (Helpful for testing different statuses) */}
        <Card className="p-4 bg-slate-50 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#1E3A8A]" />
              <span className="text-xs font-bold text-slate-700">
                {isBn ? 'ডেমো শিক্ষার্থী পরিবর্তন করুন (বিভিন্ন স্ট্যাটাস টেস্টের জন্য):' : 'Demo Student Switcher (Test different card statuses):'}
              </span>
            </div>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            >
              {allCards.map((c) => (
                <option key={c.studentId} value={c.studentId}>
                  {c.studentId} — {c.name} ({c.status})
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Demo Watermark Notice Bar */}
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">
              {isBn
                ? 'ডেমো ডেটা — এটি প্রাতিষ্ঠানিক আনুষ্ঠানিক আইডি নয় (DEMO - not an official ID)।'
                : 'DEMO - not an official ID. Strictly for evaluation & verification simulation.'}
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold bg-amber-200/80 px-2 py-0.5 rounded text-amber-900 shrink-0">
            [DEMO MODE]
          </span>
        </div>

        {/* Status Alert if Lost or Revoked */}
        {card.status === 'Lost' && (
          <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-xl text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {isBn ? 'কার্ডটি হারানো হিসেবে নথিভুক্ত' : 'Card Flagged as Lost'}
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                {card.statusReason || (isBn ? 'এই কার্ডটি হারানো রিপোর্ট করা হয়েছে। গেট ও লাইব্রেরি অ্যাক্সেস সাময়িক স্থগিত।' : 'This card has been reported lost. Physical access and automated turnstiles will reject this token.')}
              </p>
            </div>
          </div>
        )}

        {card.status === 'Revoked' && (
          <div className="p-4 bg-red-50 border-2 border-red-500 rounded-xl text-red-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-800">
                {isBn ? 'রেজিস্ট্রার দপ্তর কর্তৃক কার্ড বাতিল' : 'Card Revoked by Registrar'}
              </h3>
              <p className="text-xs text-red-700 mt-0.5">
                {card.statusReason || (isBn ? 'রেজিস্ট্রার দপ্তরের প্রশাসনিক আদেশে এই আইডি কার্ডটির অনুমোদন বাতিল করা হয়েছে।' : 'Institutional authorization revoked by the Office of the Registrar. Please contact the Registrar.')}
              </p>
            </div>
          </div>
        )}

        {card.status === 'Expired' && (
          <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl text-slate-700 flex items-start gap-3">
            <Clock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {isBn ? 'আইডি কার্ডের মেয়াদ উত্তীর্ণ' : 'Card Expired'}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {card.statusReason || (isBn ? `কার্ডটির মেয়াদ ${card.validUntil} তারিখে শেষ হয়েছে।` : `This credential validity expired on ${card.validUntil}.`)}
              </p>
            </div>
          </div>
        )}

        {/* Main Content Grid: ID Card Display & Interactive Side Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: The Physical ID Card Card Container */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Front / Back Switcher Buttons */}
            <div className="flex items-center gap-2 mb-4 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveSide('front')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeSide === 'front'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isBn ? 'সামনের অংশ (Front)' : 'Front Side'}
              </button>
              <button
                onClick={() => setActiveSide('back')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeSide === 'back'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isBn ? 'পেছনের অংশ (Back)' : 'Back Side'}
              </button>
              <button
                onClick={() => setActiveSide((prev) => (prev === 'front' ? 'back' : 'front'))}
                title="Flip Card"
                className="p-1.5 text-slate-500 hover:text-[#1E3A8A] transition-colors rounded-lg hover:bg-slate-200"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* THE ID CARD (Standard ID-1 proportions 85.6mm x 54mm, responsive max width) */}
            <div className="w-full max-w-[430px] aspect-[85.6/54] min-h-[270px] relative rounded-2xl shadow-xl border-2 border-slate-800 bg-white overflow-hidden transition-all duration-300 flex flex-col select-none">
              {/* Card Watermark Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden">
                <span className="text-red-600/15 font-black text-2xl sm:text-3xl rotate-[-25deg] tracking-widest whitespace-nowrap uppercase">
                  DEMO - not an official ID
                </span>
              </div>

              {activeSide === 'front' ? (
                /* FRONT SIDE */
                <div className="flex-1 flex flex-col justify-between">
                  {/* Card Header */}
                  <div className="bg-[#1E3A8A] text-white px-3.5 py-2.5 flex items-center gap-2.5 border-b border-blue-900 relative">
                    <NeutralUniversityLogo size={36} className="shrink-0 drop-shadow" />
                    <div className="leading-tight flex-1">
                      <div className="text-[11px] font-black tracking-wide uppercase">
                        JAMALPUR SCIENCE &amp; TECH UNIVERSITY
                      </div>
                      <div className="text-[9px] text-blue-200 font-medium">
                        জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়
                      </div>
                    </div>
                    {/* Status Pill */}
                    <div className="shrink-0">
                      {card.status === 'Active' && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 uppercase">
                          ACTIVE
                        </span>
                      )}
                      {card.status === 'Lost' && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 uppercase">
                          LOST
                        </span>
                      )}
                      {card.status === 'Revoked' && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500/30 text-red-300 border border-red-400/50 uppercase">
                          REVOKED
                        </span>
                      )}
                      {card.status === 'Expired' && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-500/30 text-slate-300 border border-slate-400/40 uppercase">
                          EXPIRED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 flex-1 flex gap-3 relative z-10">
                    {/* Neutral Avatar */}
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-24 sm:w-24 sm:h-28 bg-slate-100 border border-slate-300 rounded-lg flex flex-col items-center justify-center p-2 text-slate-400 shadow-inner relative overflow-hidden">
                        <svg className="w-14 h-14 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <span className="text-[8px] font-bold text-slate-500 tracking-wider mt-1 uppercase">
                          Neutral Avatar
                        </span>
                      </div>
                      <span className="text-[9px] font-extrabold text-red-600 mt-1">
                        BLOOD: {card.bloodGroup}
                      </span>
                    </div>

                    {/* Student Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <h2 className="text-sm sm:text-base font-black text-slate-900 leading-snug truncate">
                          {card.name}
                        </h2>
                        <p className="text-[11px] font-medium text-slate-600 truncate -mt-0.5">
                          {card.nameBn}
                        </p>
                      </div>

                      <div className="space-y-0.5 text-[10px] sm:text-[11px] text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-bold uppercase text-[9px] sm:text-[10px] w-14 shrink-0">
                            ID No:
                          </span>
                          <span className="font-extrabold font-mono text-[#1E3A8A]">
                            {card.studentId}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-slate-500 font-bold uppercase text-[9px] sm:text-[10px] w-14 shrink-0">
                            Dept:
                          </span>
                          <span className="font-semibold text-slate-800 truncate" title={card.department}>
                            {card.department}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-bold uppercase text-[9px] sm:text-[10px] w-14 shrink-0">
                            Session:
                          </span>
                          <span className="font-semibold text-slate-800">
                            {card.session}
                          </span>
                        </div>
                      </div>

                      {/* Small QR thumbnail on front */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-[9px] font-bold text-slate-500">
                          VALID THRU: <span className="text-slate-800">{card.validUntil}</span>
                        </span>
                        {qrCodeUrl && (
                          <div className="w-10 h-10 border border-slate-200 rounded p-0.5 bg-white">
                            <img src={qrCodeUrl} alt="Verification QR" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Stripe */}
                  <div className="bg-slate-100 px-3 py-1 flex items-center justify-between border-t border-slate-200 text-[9px] text-slate-600 font-bold">
                    <span>JSTU STUDENT IDENTITY CARD</span>
                    <span className="text-red-600 font-extrabold">DEMO - NOT AN OFFICIAL ID</span>
                  </div>
                </div>
              ) : (
                /* BACK SIDE */
                <div className="flex-1 flex flex-col justify-between">
                  {/* Back Header */}
                  <div className="bg-[#0F172A] text-white px-3.5 py-2 text-center border-b border-slate-800">
                    <span className="text-[10px] font-black tracking-wider uppercase">
                      TERMS &amp; RESIDENTIAL RECORD
                    </span>
                  </div>

                  {/* Back Body */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between text-[10px] text-slate-700 relative z-10">
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">
                          Residential Hall:
                        </span>
                        <span className="font-semibold text-slate-900 block truncate">
                          {card.hallName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">
                          Emergency Contact:
                        </span>
                        <span className="font-semibold text-slate-900 block font-mono">
                          {card.emergencyContact}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">
                          Date of Issue:
                        </span>
                        <span className="font-semibold text-slate-900 block">
                          {card.issueDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">
                          Campus Address:
                        </span>
                        <span className="font-semibold text-slate-900 block">
                          Jamalpur-2000, BD
                        </span>
                      </div>
                    </div>

                    {/* Disclaimer text */}
                    <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[8.5px] leading-tight text-slate-600">
                      1. This card is non-transferable property of JSTU.<br />
                      2. If found, please return to the Office of the Registrar.<br />
                      3. Scan front QR code to verify validity on official campus portal.
                    </div>

                    {/* Barcode & Signature */}
                    <div className="flex items-end justify-between pt-1 border-t border-slate-200">
                      <div>
                        {/* Simulated Barcode */}
                        <div className="h-6 w-32 flex items-stretch gap-[1.5px] bg-slate-900 p-0.5 rounded">
                          {[3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 3, 2, 4, 1, 2, 1, 3].map((w, i) => (
                            <span key={i} className="bg-white inline-block flex-1" style={{ opacity: w % 2 === 0 ? 0 : 1 }} />
                          ))}
                        </div>
                        <span className="text-[8px] font-mono text-slate-500 font-bold block mt-0.5">
                          {card.studentId}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="text-[9px] font-script italic font-bold text-[#1E3A8A]">
                          Prof. Md. Abdul Mannan
                        </div>
                        <div className="text-[8px] font-bold uppercase tracking-wider text-slate-500 border-t border-slate-400 pt-0.5">
                          Registrar, JSTU
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back Bottom */}
                  <div className="bg-red-50 px-3 py-1 flex items-center justify-between border-t border-red-200 text-[9px] text-red-700 font-extrabold">
                    <span>JAMALPUR SCIENCE &amp; TECH UNIVERSITY</span>
                    <span>DEMO - NOT AN OFFICIAL ID</span>
                  </div>
                </div>
              )}
            </div>

            {/* Side toggle tip */}
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              {isBn
                ? 'আইডি কার্ডের অপর পিঠ দেখতে বাটনে ক্লিক করুন বা ফ্লিপ অপশন ব্যবহার করুন।'
                : 'Click Front / Back buttons to inspect both sides of the digital credential.'}
            </p>
          </div>

          {/* RIGHT: QR Code Verification Panel & Export Controls */}
          <div className="lg:col-span-5 space-y-4">
            {/* QR Code Card */}
            <Card className="p-5 border border-slate-200 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {isBn ? 'পাবলিক কিউআর কোড যাচাইকরণ' : 'Cryptographic Public QR Code'}
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Large QR Display */}
                <div className="w-32 h-32 sm:w-36 sm:h-36 bg-slate-50 border-2 border-slate-200 rounded-xl p-2 flex items-center justify-center shrink-0">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="Student Verification QR"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">Loading QR...</span>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-slate-600 leading-relaxed">
                    {isBn
                      ? 'এই কিউআর কোডে কোনো ব্যক্তিগত তথ্য নেই। এটি কেবল একটি র‍্যান্ডম সিকিউর টোকেনসহ ভেরিফিকেশন ইউআরএল এনকোড করে।'
                      : 'Encodes ONLY the public verification URL with a random cryptographic token. No personal details are stored inside the barcode.'}
                  </p>

                  <div className="p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[10px] text-slate-700 break-all">
                    {getVerificationUrl(card.verificationToken)}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyVerificationUrl}
                      className="text-xs flex items-center gap-1.5"
                    >
                      {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'ইউআরএল কপি' : 'Copy URL')}</span>
                    </Button>

                    <Link
                      to={`/verify-id/${card.verificationToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1E3A8A] bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <span>{isBn ? 'পাবলিক পেজ দেখুন' : 'Test Public Verify'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </Card>

            {/* Export and Download Actions */}
            <Card className="p-5 border border-slate-200 bg-white space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {isBn ? 'কার্ড ডাউনলোড ও সংরক্ষণ' : 'Download & Archival Options'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Button
                  variant="primary"
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="w-full text-xs justify-center flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isGeneratingPdf ? 'Generating...' : 'Official PDF Document'}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleDownloadPng('front')}
                  disabled={isGeneratingPng}
                  className="w-full text-xs justify-center flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Front PNG</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleDownloadPng('back')}
                  disabled={isGeneratingPng}
                  className="w-full text-xs justify-center flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Back PNG</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleDownloadPng('both')}
                  disabled={isGeneratingPng}
                  className="w-full text-xs justify-center flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Combined PNG</span>
                </Button>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  {isBn
                    ? 'পিডিএফ ফাইলে সামনের ও পেছনের অংশসহ অফিসিয়াল ওয়াটারমার্ক অন্তর্ভুক্ত থাকে।'
                    : 'PDF output is scaled to standard ISO A4 paper with security watermarks.'}
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
