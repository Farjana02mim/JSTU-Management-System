import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Download,
  Calendar,
  MapPin,
  QrCode,
  ShieldCheck,
  User,
  GraduationCap
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useLanguage } from '../../contexts/LanguageContext';
import { AdmissionApplication } from '../../types/admission';
import { getAdmissionService } from '../../services/admission/admissionService';

export const AdmissionStatusCheck: React.FC<{
  initialRef?: string;
  initialEmail?: string;
}> = ({ initialRef = '', initialEmail = '' }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [referenceNumber, setReferenceNumber] = useState(initialRef);
  const [email, setEmail] = useState(initialEmail);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [application, setApplication] = useState<AdmissionApplication | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.trim() || !email.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setPdfSuccess(false);

    // Simulate short network lookup
    setTimeout(() => {
      const service = getAdmissionService();
      const result = service.getApplicationByReferenceAndEmail(
        referenceNumber.trim(),
        email.trim()
      );

      if (result) {
        setApplication(result);
        setNotFound(false);
      } else {
        setApplication(null);
        setNotFound(true);
      }
      setIsLoading(false);
    }, 400);
  };

  const handleDownloadAdmitCard = async () => {
    if (!application) return;
    try {
      setIsGeneratingPdf(true);
      const service = getAdmissionService();
      await service.generateAdmitCardPdf(application);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Search Header Card */}
      <Card className="p-6 sm:p-10 border border-[#E2E8F0] bg-white shadow-xs">
        <div className="max-w-2xl mx-auto space-y-4 text-center">
          <div className="w-12 h-12 bg-blue-50 text-[#1E3A8A] rounded-2xl flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            {isBn ? 'ভর্তি আবেদন স্ট্যাটাস যাচাই' : 'Track Admission Application Status'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isBn
              ? 'আপনার আবেদনপত্র দাখিলের পর প্রাপ্ত রেফারেন্স নম্বর এবং নিবন্ধিত ইমেইল ঠিকানা প্রদান করুন।'
              : 'Enter your unique JSTU Application Reference Number and registered Email Address.'}
          </p>

          <form onSubmit={handleSearch} className="pt-2 space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isBn ? 'রেফারেন্স নম্বর (যেমন: JSTU-ADM-2026-...)' : 'Application Reference Number'}
                required
                placeholder="JSTU-ADM-2026-784912"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
              />

              <Input
                label={isBn ? 'নিবন্ধিত ইমেইল ঠিকানা' : 'Registered Email Address'}
                type="email"
                required
                placeholder="applicant@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
                leftIcon={<Search className="w-4 h-4" />}
              >
                {isLoading
                  ? isBn
                    ? 'যাচাই করা হচ্ছে...'
                    : 'Searching...'
                  : isBn
                  ? 'স্ট্যাটাস অনুসন্ধান করুন'
                  : 'Check Application Status'}
              </Button>
            </div>
          </form>

          {/* Quick Demo Credentials Hint */}
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 block mb-1">
              {isBn ? 'দ্রুত পরীক্ষামূলক নমুনা ক্রেডেনশিয়াল (Demo Data):' : 'Sample demo credentials to test:'}
            </span>
            <div className="flex flex-wrap justify-center gap-2 text-[11px] text-[#1E3A8A]">
              <button
                type="button"
                onClick={() => {
                  setReferenceNumber('JSTU-ADM-2026-784912');
                  setEmail('tahmid.rahman@gmail.com');
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-mono cursor-pointer"
              >
                JSTU-ADM-2026-784912 (Shortlisted)
              </button>
              <button
                type="button"
                onClick={() => {
                  setReferenceNumber('JSTU-ADM-2026-784913');
                  setEmail('sumaiya.faruk@gmail.com');
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-mono cursor-pointer"
              >
                JSTU-ADM-2026-784913 (Approved)
              </button>
              <button
                type="button"
                onClick={() => {
                  setReferenceNumber('JSTU-ADM-2026-784917');
                  setEmail('riyazul.karim@gmail.com');
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-mono cursor-pointer"
              >
                JSTU-ADM-2026-784917 (Rejected)
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Generic Not Found Response (Crucial Privacy Invariant) */}
      {hasSearched && notFound && (
        <Card className="p-8 border border-red-200 bg-red-50/50 text-center space-y-3 animate-fadeIn">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-red-900">
            {isBn ? 'আবেদন খুঁজে পাওয়া যায়নি' : 'Application Record Not Found'}
          </h3>
          <p className="text-xs text-red-700 max-w-lg mx-auto leading-relaxed">
            {isBn
              ? 'প্রদত্ত রেফারেন্স নম্বর এবং নিবন্ধিত ইমেইল ঠিকানার বিপরীতে কোনো আবেদন পাওয়া যায়নি। অনুগ্রহ করে আপনার তথ্য পুনরায় যাচাই করে চেষ্টা করুন।'
              : 'No application record found matching the provided Reference Number and registered Email Address. Please verify your reference number and registered email address and try again.'}
          </p>
        </Card>
      )}

      {/* Found Application Details */}
      {hasSearched && application && (
        <div className="space-y-6 animate-fadeIn">
          {/* Status Badge & Header */}
          <Card className="p-6 sm:p-8 border border-[#E2E8F0] bg-white shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-slate-500">
                  REF: {application.referenceNumber}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A]">
                  {application.personalInfo.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  {application.personalInfo.fullNameBn} &bull; {application.personalInfo.email}
                </p>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2">
                {application.status === 'SUBMITTED' && (
                  <span className="px-3 py-1.5 rounded-full bg-blue-100 text-[#1E3A8A] text-xs font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Submitted (Awaiting Scrutiny)</span>
                  </span>
                )}
                {application.status === 'UNDER_REVIEW' && (
                  <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Under Review (Registrar Office)</span>
                  </span>
                )}
                {application.status === 'SHORTLISTED' && (
                  <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Shortlisted & Admit Issued</span>
                  </span>
                )}
                {application.status === 'APPROVED' && (
                  <span className="px-3 py-1.5 rounded-full bg-green-600 text-white text-xs font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Officially Approved & Admitted</span>
                  </span>
                )}
                {application.status === 'REJECTED' && (
                  <span className="px-3 py-1.5 rounded-full bg-red-100 text-red-800 text-xs font-bold flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    <span>Disqualified / Rejected</span>
                  </span>
                )}
              </div>
            </div>

            {/* Stage Progress Ribbon */}
            <div className="py-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
                {isBn ? 'ভর্তি প্রক্রিয়ার অগ্রগতি:' : 'Admission Processing Lifecycle:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                {[
                  {
                    step: 1,
                    title: '1. Submission',
                    desc: 'Logged & Paid',
                    done: true
                  },
                  {
                    step: 2,
                    title: '2. Scrutiny',
                    desc: 'Document Audit',
                    done: ['UNDER_REVIEW', 'SHORTLISTED', 'APPROVED'].includes(application.status)
                  },
                  {
                    step: 3,
                    title: '3. Shortlist & Admit',
                    desc: 'Hall Assigned',
                    done: ['SHORTLISTED', 'APPROVED'].includes(application.status)
                  },
                  {
                    step: 4,
                    title: '4. Final Admission',
                    desc: 'Merit Confirmed',
                    done: application.status === 'APPROVED'
                  }
                ].map((s) => (
                  <div
                    key={s.step}
                    className={`p-3 rounded-xl border transition ${
                      s.done
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5 font-bold mb-1">
                      {s.done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 text-[9px] flex items-center justify-center">
                          {s.step}
                        </div>
                      )}
                      <span>{s.title}</span>
                    </div>
                    <span className="text-[11px] block text-slate-500">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ADMIT CARD DOWNLOAD BANNER (If Shortlisted or Approved) */}
            {(application.status === 'SHORTLISTED' || application.status === 'APPROVED') && (
              <div className="p-6 bg-gradient-to-r from-blue-900 to-[#1E3A8A] text-white rounded-2xl shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/40">
                      Admit Card Ready &bull; QR Verified
                    </span>
                    <h4 className="text-lg sm:text-xl font-black">
                      {isBn ? 'আপনার ভর্তি পরীক্ষার প্রবেশপত্র প্রস্তুত!' : 'Your Examination Pass & Admit Card is Ready'}
                    </h4>
                    <p className="text-xs text-slate-200">
                      {isBn
                        ? 'এ৪ সাইজের কাগজে রঙিন প্রিন্ট নিয়ে মূল এইচএসসি রেজিস্ট্রেশন কার্ডসহ পরীক্ষার হলে উপস্থিত হোন।'
                        : 'Print this official Admit Card and bring it along with your original HSC Registration card to the hall.'}
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    size="lg"
                    disabled={isGeneratingPdf}
                    onClick={handleDownloadAdmitCard}
                    leftIcon={<Download className="w-4 h-4" />}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-md cursor-pointer shrink-0"
                  >
                    {isGeneratingPdf
                      ? isBn
                        ? 'প্রবেশপত্র প্রস্তুত হচ্ছে...'
                        : 'Generating PDF...'
                      : isBn
                      ? 'প্রবেশপত্র ডাউনলোড করুন (PDF)'
                      : 'Download Admit Card (PDF)'}
                  </Button>
                </div>

                {pdfSuccess && (
                  <div className="p-2 bg-emerald-500/20 border border-emerald-400 rounded-lg text-xs text-emerald-200 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isBn ? 'প্রবেশপত্র সফলভাবে ডাউনলোড হয়েছে!' : 'Admit Card downloaded successfully!'}</span>
                  </div>
                )}

                {/* Exam Hall Details Pill */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-blue-800 text-slate-200">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-amber-300" />
                    <span>
                      <strong>Roll:</strong> {application.testRollNumber || 'Assigned in hall'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-300" />
                    <span>
                      <strong>Date:</strong> {application.examDate || 'Jan 08, 2027'} ({application.examTime || '10:00 AM'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-300" />
                    <span className="truncate">
                      <strong>Venue:</strong> {application.examVenue || 'Main Academic Complex'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Rejection Remark */}
            {application.status === 'REJECTED' && application.rejectionReason && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span>{isBn ? 'রেজিস্ট্রার দপ্তরের মন্তব্য:' : 'Official Scrutiny Feedback:'}</span>
                </span>
                <p className="pl-5 leading-relaxed">{application.rejectionReason}</p>
              </div>
            )}

            {/* Academic & Program Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 border border-[#E2E8F0] rounded-xl space-y-2 text-xs">
                <span className="font-bold text-[#1E3A8A] flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>{isBn ? 'একাডেমিক ফলাফল' : 'Academic Credentials'}</span>
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block">SSC Board & Roll:</span>
                    <span className="font-semibold">{application.academicInfo.sscBoard} - {application.academicInfo.sscRoll}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">SSC GPA:</span>
                    <span className="font-bold text-emerald-700">{application.academicInfo.sscGpa.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">HSC Board & Roll:</span>
                    <span className="font-semibold">{application.academicInfo.hscBoard} - {application.academicInfo.hscRoll}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">HSC GPA:</span>
                    <span className="font-bold text-emerald-700">{application.academicInfo.hscGpa.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-[#E2E8F0] rounded-xl space-y-2 text-xs">
                <span className="font-bold text-[#1E3A8A] flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>{isBn ? 'পছন্দক্রম ও কোটা' : 'Choice Ranking & Quota'}</span>
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block">Unit:</span>
                    <span className="font-bold text-[#1E3A8A]">{application.programChoice.unit.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Quota:</span>
                    <span className="font-semibold">{application.personalInfo.quota.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">1st Choice Dept:</span>
                    <span className="font-bold">{application.programChoice.firstChoiceDept}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">2nd & 3rd:</span>
                    <span className="font-semibold">{application.programChoice.secondChoiceDept}, {application.programChoice.thirdChoiceDept}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
