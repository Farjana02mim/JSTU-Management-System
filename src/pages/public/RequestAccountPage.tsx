import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  Mail,
  Phone,
  FileText,
  BadgeInfo,
  Clock,
  ArrowLeft,
  Copy,
  Check,
  Search,
  GraduationCap,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { UniversityLogo } from '../../components/common/UniversityLogo';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  AccountRequestService,
  JSTU_DEPARTMENTS_META,
  JSTU_SESSIONS,
  AccountRequestStatus
} from '../../services/accountRequests';

export const RequestAccountPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [activeView, setActiveView] = useState<'form' | 'status'>('form');

  // Form State (Student only)
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [session, setSession] = useState('2023-2024');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot trap field

  // Status Check State
  const [statusCheckRef, setStatusCheckRef] = useState('');
  const [statusCheckEmail, setStatusCheckEmail] = useState('');
  const [statusCheckHoneypot, setStatusCheckHoneypot] = useState('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusCheckResult, setStatusCheckResult] = useState<{
    found: boolean;
    status?: AccountRequestStatus;
    message?: string;
  } | null>(null);
  const [statusCheckError, setStatusCheckError] = useState<string | null>(null);

  // Submission State
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{
    referenceNumber: string;
    message: string;
  } | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError(null);

    // Client-side validation checks
    const errors: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 3) {
      errors.fullName = isBn
        ? 'পূর্ণ নাম কমপক্ষে ৩ অক্ষরের হতে হবে।'
        : 'Full name must be at least 3 characters long.';
    }
    if (!studentId.trim() || studentId.trim().length < 3) {
      errors.studentId = isBn
        ? 'শিক্ষার্থী আইডি বা ভর্তি রোল নম্বর আবশ্যক (কমপক্ষে ৩ অক্ষর)।'
        : 'Student ID or admission roll number is required (min 3 characters).';
    }
    if (!email.trim() || !email.includes('@')) {
      errors.email = isBn
        ? 'সঠিক প্রাতিষ্ঠানিক বা ব্যক্তিগত ইমেইল লিখুন।'
        : 'Please enter a valid email address.';
    }
    if (!note.trim() || note.trim().length < 5) {
      errors.note = isBn
        ? 'অনুগ্রহ করে সংক্ষিপ্ত বিবরণ লিখুন (কমপক্ষে ৫ অক্ষর)।'
        : 'Please provide a short explanation (minimum 5 characters).';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await AccountRequestService.submitRequest({
        fullName: fullName.trim(),
        department,
        session,
        studentId: studentId.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        note: note.trim(),
        website: honeypot
      });

      setSubmittedResult({
        referenceNumber: res.referenceNumber,
        message: res.message
      });

      // Also pre-fill the status check inputs
      setStatusCheckRef(res.referenceNumber);
      setStatusCheckEmail(email.trim());
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      if (errMsg.includes('RATE_LIMIT_EXCEEDED')) {
        setServerError(
          isBn
            ? 'অতিরিক্ত অনুরোধ করা হয়েছে। আপনি প্রতি ঘণ্টায় সর্বোচ্চ ৩টি অনুরোধ করতে পারবেন।'
            : 'Rate limit exceeded: You can submit at most 3 account requests per hour. Please wait before trying again.'
        );
      } else if (errMsg.includes('BOT_DETECTED')) {
        setServerError(
          isBn
            ? 'স্বয়ংক্রিয় বটের সন্দেহজনক কার্যকলাপ শনাক্ত হয়েছে।'
            : 'Automated submission blocked by security defense.'
        );
      } else if (errMsg.includes('VALIDATION_ERROR:')) {
        setServerError(errMsg.replace('VALIDATION_ERROR: ', ''));
      } else {
        setServerError(errMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusCheckError(null);
    setStatusCheckResult(null);

    if (!statusCheckRef.trim() || !statusCheckEmail.trim()) {
      setStatusCheckError(
        isBn
          ? 'অনুগ্রহ করে রেফারেন্স নম্বর এবং ইমেইল দুটোই প্রদান করুন।'
          : 'Please provide both reference number and email address.'
      );
      return;
    }

    setIsCheckingStatus(true);

    try {
      const result = await AccountRequestService.checkRequestStatus({
        referenceNumber: statusCheckRef.trim(),
        email: statusCheckEmail.trim(),
        website: statusCheckHoneypot
      });
      setStatusCheckResult(result);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Status check failed.';
      if (errMsg.includes('RATE_LIMIT_EXCEEDED')) {
        setStatusCheckError(
          isBn
            ? 'অবস্থা যাচাইয়ের সীমা অতিক্রান্ত। আপনি প্রতি ঘণ্টায় সর্বোচ্চ ১০ বার যাচাই করতে পারবেন।'
            : 'Rate limit exceeded: You can perform at most 10 status checks per hour.'
        );
      } else if (errMsg.includes('BOT_DETECTED')) {
        setStatusCheckError(
          isBn
            ? 'স্বয়ংক্রিয় অনুরোধ শনাক্ত হয়েছে।'
            : 'Automated check blocked by honeypot defense.'
        );
      } else {
        setStatusCheckError(errMsg);
      }
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleResetForm = () => {
    setFullName('');
    setDepartment('CSE');
    setSession('2023-2024');
    setStudentId('');
    setEmail('');
    setPhone('');
    setNote('');
    setHoneypot('');
    setFieldErrors({});
    setServerError(null);
    setSubmittedResult(null);
  };

  const getStatusBadge = (status?: AccountRequestStatus) => {
    switch (status) {
      case 'PENDING':
        return {
          label: isBn ? 'অপেক্ষমাণ (যাচাই চলছে)' : 'PENDING VERIFICATION',
          bg: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300',
          desc: isBn
            ? 'আপনার আবেদনটি রেজিস্ট্রার দপ্তরে বিশ্ববিদ্যালয় রেকর্ডের সাথে যাচাইয়ের অপেক্ষায় রয়েছে।'
            : 'Your request is currently awaiting verification against university admission records.'
        };
      case 'APPROVED':
        return {
          label: isBn ? 'অনুমোদিত' : 'APPROVED',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300',
          desc: isBn
            ? 'আপনার আবেদনটি অনুমোদিত হয়েছে এবং অ্যাক্টিভেশন ও পাসওয়ার্ড নির্ধারণের লিংক ইমেইলে পাঠানো হয়েছে।'
            : 'Your request has been approved and the set-password activation step has been dispatched to your email.'
        };
      case 'REJECTED':
        return {
          label: isBn ? 'প্রত্যাখ্যাত' : 'REJECTED',
          bg: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/50 dark:text-red-300',
          desc: isBn
            ? 'আপনার তথ্যের সাথে বিশ্ববিদ্যালয় রেকর্ডের মিল পাওয়া যায়নি। বিস্তারিত জানতে রেজিস্ট্রার দপ্তরে যোগাযোগ করুন।'
            : 'Your request could not be verified against institutional records. Please contact the registrar office.'
        };
      case 'MORE_INFO_REQUESTED':
        return {
          label: isBn ? 'অতিরিক্ত তথ্য প্রয়োজন' : 'MORE INFO REQUESTED',
          bg: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/50 dark:text-sky-300',
          desc: isBn
            ? 'রেজিস্ট্রার দপ্তর থেকে অতিরিক্ত তথ্য চাওয়া হয়েছে। বিস্তারিত জানতে আপনার ইমেইল চেক করুন।'
            : 'The registrar office has requested additional information. Please check your email for reviewer instructions.'
        };
      default:
        return {
          label: isBn ? 'অজ্ঞাত' : 'UNKNOWN',
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          desc: ''
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={isBn ? 'শিক্ষার্থী অ্যাকাউন্ট আবেদন | জেএসটিইউ' : 'Request Student Account | JSTU'}
        description="Submit an official request for a student portal account at Jamalpur Science & Technology University."
      />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Breadcrumb
            items={[
              { label: isBn ? 'লগইন' : 'Login', to: '/login' },
              { label: isBn ? 'অ্যাকাউন্ট আবেদন' : 'Request Account' }
            ]}
          />
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-[#1E3A8A] hover:text-[#0A2540] font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isBn ? 'লগইন পাতায় ফিরে যান' : 'Back to Login'}</span>
          </Link>
        </div>

        {/* University Header Banner */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <UniversityLogo className="w-16 h-16 shrink-0" />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EFF6FF] text-[#1E3A8A] border border-[#BFDBFE]">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{isBn ? 'নতুন শিক্ষার্থী অ্যাকাউন্ট আবেদন' : 'New Student Account Registration'}</span>
              <span className="ml-1 text-[10px] bg-[#1E3A8A] text-white px-1.5 py-0.5 rounded font-mono">DEMO MODE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              {isBn
                ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (জেএসটিইউ)'
                : 'Jamalpur Science & Technology University'}
            </h1>
            <p className="text-xs text-slate-500 max-w-xl">
              {isBn
                ? 'নবীন ও অধ্যায়নরত শিক্ষার্থীদের জন্য স্বয়ংক্রিয় পোর্টাল অ্যাকাউন্ট অনুরোধ। পূরণকৃত তথ্য রেজিস্ট্রার দপ্তরের নথির সাথে যাচাইয়ের পর অ্যাক্টিভেশন সম্পন্ন হবে।'
                : 'Official portal access request for enrolled JSTU undergraduate & graduate students. All requests undergo verification by the Office of the Registrar before credential activation.'}
            </p>
          </div>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex border-b border-[#E2E8F0] gap-2">
          <button
            onClick={() => setActiveView('form')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 border-b-2 ${
              activeView === 'form'
                ? 'text-[#1E3A8A] border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700 border-transparent'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{isBn ? 'নতুন আবেদন জমা দিন' : 'New Account Request'}</span>
          </button>

          <button
            onClick={() => setActiveView('status')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 border-b-2 ${
              activeView === 'status'
                ? 'text-[#1E3A8A] border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700 border-transparent'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>{isBn ? 'আবেদনের অবস্থা যাচাই করুন' : 'Check Request Status'}</span>
          </button>
        </div>

        {/* Global Error Banner */}
        {serverError && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-800 dark:text-red-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">{isBn ? 'অনুরোধ ব্যর্থ হয়েছে' : 'Submission Error'}</p>
              <p>{serverError}</p>
            </div>
          </div>
        )}

        {/* View 1: Student Account Request Form */}
        {activeView === 'form' && (
          <>
            {submittedResult ? (
              /* Success Confirmation Card */
              <Card padding="lg" className="space-y-6 bg-white border border-[#E2E8F0] shadow-xs">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-lg font-bold text-[#0F172A]">
                    {isBn ? 'অ্যাকাউন্ট আবেদন সফলভাবে গৃহীত হয়েছে' : 'Account Request Submitted Successfully'}
                  </h2>
                  <p className="text-xs text-slate-600 max-w-lg mx-auto">
                    {submittedResult.message}
                  </p>
                </div>

                {/* Reference Number Box */}
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {isBn ? 'আপনার ট্র্যাকিং রেফারেন্স নম্বর' : 'Your Application Reference Number'}
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl sm:text-2xl font-black font-mono text-[#1E3A8A] tracking-wider">
                      {submittedResult.referenceNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyRef(submittedResult.referenceNumber)}
                      className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1 transition"
                      title="Copy Reference"
                    >
                      {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span className="text-[11px] font-semibold">{copiedRef ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'কপি' : 'Copy')}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isBn
                      ? 'ভবিষ্যতে আপনার আবেদনের অগ্রগতি জানতে এই রেফারেন্স নম্বরটি সংরক্ষণ করুন।'
                      : 'Please save this reference number to check your verification status anytime.'}
                  </p>
                </div>

                {/* Embedded Status Check Box */}
                <div className="p-4 border border-[#BFDBFE] bg-[#EFF6FF] rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A8A]">
                    <Search className="w-4 h-4 text-[#1E3A8A]" />
                    <span>{isBn ? 'অবস্থা এখনই পরীক্ষা করুন' : 'Check Status Now'}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {isBn
                      ? 'রেজিস্ট্রার দপ্তরের যাচাই সম্পন্ন হলে আপনি সরাসরি এখানে অবস্থা দেখতে পাবেন।'
                      : 'You can check your status below or switch to the "Check Request Status" tab anytime.'}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveView('status')}
                    className="w-full justify-center bg-white"
                    leftIcon={<Search className="w-3.5 h-3.5" />}
                  >
                    {isBn ? 'অবস্থা যাচাই ট্যাবে যান' : 'Go to Status Check Box'}
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0]">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleResetForm}
                    className="w-full sm:w-auto"
                  >
                    {isBn ? 'আরেকটি আবেদন করুন' : 'Submit Another Request'}
                  </Button>

                  <Link to="/login" className="w-full sm:w-auto">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      {isBn ? 'লগইন পাতায় যান' : 'Return to Login'}
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              /* Request Submission Form */
              <Card padding="lg" className="space-y-6 bg-white border border-[#E2E8F0] shadow-xs">
                {/* Security and Privacy Notice */}
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                    <ShieldAlert className="w-4 h-4 text-[#1E3A8A]" />
                    <span>{isBn ? 'নিরাপত্তা ও নীতি নির্দেশিকা' : 'Student Verification & Security Policy'}</span>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                    <li>
                      {isBn
                        ? 'এই ফর্মটি শুধুমাত্র শিক্ষার্থীদের জন্য প্রযোজ্য (শিক্ষক ও প্রশাসনিক অ্যাকাউন্ট সরাসরি দপ্তর কর্তৃক প্রদত্ত হয়)।'
                        : 'This form is strictly for student account requests. Faculty & staff credentials are provided directly by administration.'}
                    </li>
                    <li>
                      {isBn
                        ? 'কোনো পাসওয়ার্ড এই ফর্মে গ্রহণ করা হয় না। রেজিস্ট্রার দপ্তর অনুমোদন দিলে ইমেইলে নিরাপদ পাসওয়ার্ড নির্ধারণ লিংক প্রেরণ করা হবে।'
                        : 'No password is collected here. Upon registrar approval, a cryptographic activation link will be issued.'}
                    </li>
                    <li>
                      {isBn
                        ? 'প্রতি ঘণ্টায় সর্বোচ্চ ৩টি আবেদন করা যাবে। আবেদনকারীকে স্বয়ংক্রিয় বটের হাত থেকে সুরক্ষিত রাখতে বিশেষ যাচাই ব্যবস্থা রয়েছে।'
                        : 'Submissions are rate-limited to 3 per hour to protect institutional infrastructure against automated abuse.'}
                    </li>
                  </ul>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot field (hidden from legitimate users, triggers immediate reject if filled by bot) */}
                  <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                    <label htmlFor="hp_website">Leave this field blank</label>
                    <input
                      id="hp_website"
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'শিক্ষার্থীর পূর্ণ নাম *' : 'Student Full Name *'}
                    </label>
                    <Input
                      type="text"
                      required
                      maxLength={100}
                      placeholder={isBn ? 'যেমন: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      error={fieldErrors.fullName}
                      leftIcon={<UserCheck className="w-4 h-4" />}
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {isBn ? 'বিশ্ববিদ্যালয় ভর্তি নথির হুবহু নাম লিখুন (৩-১০০ অক্ষর)' : 'Must match university admission records (3-100 characters)'}
                    </span>
                  </div>

                  {/* Academic Department (7 JSTU Departments) & Session */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isBn ? 'বিভাগ (জেএসটিইউ ৭টি বিভাগ) *' : 'Academic Department (7 JSTU Depts) *'}
                      </label>
                      <Select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        options={JSTU_DEPARTMENTS_META.map((d) => ({
                          value: d.code,
                          label: `${d.code} - ${isBn ? d.nameBn : d.name}`
                        }))}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isBn ? 'শিক্ষাবর্ষ / সেশন *' : 'Academic Session / Batch *'}
                      </label>
                      <Select
                        value={session}
                        onChange={(e) => setSession(e.target.value)}
                        options={JSTU_SESSIONS.map((s) => ({
                          value: s,
                          label: `${s} ${isBn ? 'সেশন' : 'Session'}`
                        }))}
                      />
                    </div>
                  </div>

                  {/* Student ID / Roll & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isBn ? 'শিক্ষার্থী আইডি বা ভর্তি রোল *' : 'Student ID or Admission Roll *'}
                      </label>
                      <Input
                        type="text"
                        required
                        maxLength={30}
                        placeholder={isBn ? 'যেমন: JSTU2026045' : 'e.g. JSTU2026045'}
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        error={fieldErrors.studentId}
                        leftIcon={<Building2 className="w-4 h-4" />}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isBn ? 'ইমেইল ঠিকানা *' : 'Institutional / Personal Email *'}
                      </label>
                      <Input
                        type="email"
                        required
                        maxLength={100}
                        placeholder="student@jstu.ac.bd"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={fieldErrors.email}
                        leftIcon={<Mail className="w-4 h-4" />}
                      />
                    </div>
                  </div>

                  {/* Contact Phone (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'মোবাইল নম্বর (ঐচ্ছিক)' : 'Contact Phone (Optional)'}
                    </label>
                    <Input
                      type="tel"
                      maxLength={20}
                      placeholder="+880 1712-345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      error={fieldErrors.phone}
                      leftIcon={<Phone className="w-4 h-4" />}
                    />
                  </div>

                  {/* Short Note */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'সংক্ষিপ্ত বিবরণ বা আবেদনের কারণ *' : 'Short Note / Purpose *'}
                    </label>
                    <textarea
                      required
                      rows={3}
                      maxLength={500}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={
                        isBn
                          ? 'যেমন: নবীন শিক্ষার্থী হিসেবে ক্লাস রুটিন, নোটিশ ও ফলাফল দেখার জন্য পোর্টাল অ্যাকাউন্ট প্রয়োজন।'
                          : 'e.g. Newly admitted student requesting student portal account to access class routine and notices.'
                      }
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>{fieldErrors.note && <span className="text-red-500">{fieldErrors.note}</span>}</span>
                      <span>{note.length} / 500 characters</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full justify-center py-2.5"
                      isLoading={isSubmitting}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      {isBn ? 'আবেদন জমা দিন' : 'Submit Student Account Request'}
                    </Button>
                    <p className="text-[11px] text-center text-slate-500 mt-2">
                      {isBn
                        ? 'আবেদন জমা দিলে একটি ট্র্যাকিং রেফারেন্স নম্বর পাবেন। প্রতি ঘণ্টায় সর্বোচ্চ ৩টি অনুরোধ অনুমোদিত।'
                        : 'Simulated rate limit applies: max 3 requests per hour. A unique JSTU-REQ reference will be generated.'}
                    </p>
                  </div>
                </form>
              </Card>
            )}
          </>
        )}

        {/* View 2: Check Status Box */}
        {activeView === 'status' && (
          <Card padding="lg" className="space-y-6 bg-white border border-[#E2E8F0] shadow-xs">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Search className="w-4 h-4 text-[#1E3A8A]" />
                <span>{isBn ? 'আবেদনের বর্তমান অবস্থা যাচাই' : 'Check Request Verification Status'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'আপনার রেফারেন্স নম্বর এবং নিবন্ধিত ইমেইল প্রদান করুন। গোপনীয়তা রক্ষার স্বার্থে কেবলমাত্র বর্তমান অবস্থা প্রদর্শিত হবে।'
                  : 'Enter your Reference Number and Email. For privacy, only the verification status is returned.'}
              </p>
            </div>

            {/* Privacy / Abuse Protection Info */}
            <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-[11px] text-[#1E3A8A] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#1E3A8A] shrink-0 mt-0.5" />
              <span>
                {isBn
                  ? 'নিরাপত্তা নীতি: ভুল তথ্য দিলে জেনেরিক "পাওয়া যায়নি" বার্তা আসবে। প্রতি ঘণ্টায় সর্বোচ্চ ১০টি অনুসন্ধান অনুমোদিত।'
                  : 'Security policy: Invalid combinations yield a generic not-found message. Max 10 checks per hour.'}
              </span>
            </div>

            {statusCheckError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{statusCheckError}</span>
              </div>
            )}

            <form onSubmit={handleStatusCheck} className="space-y-4">
              {/* Anti-bot honeypot */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <input
                  type="text"
                  name="check_website"
                  tabIndex={-1}
                  value={statusCheckHoneypot}
                  onChange={(e) => setStatusCheckHoneypot(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'রেফারেন্স নম্বর *' : 'Reference Number *'}
                </label>
                <Input
                  type="text"
                  required
                  maxLength={50}
                  placeholder="JSTU-REQ-2026-XXXXXX"
                  value={statusCheckRef}
                  onChange={(e) => setStatusCheckRef(e.target.value)}
                  leftIcon={<FileText className="w-4 h-4" />}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'নিবন্ধিত ইমেইল ঠিকানা *' : 'Registered Email Address *'}
                </label>
                <Input
                  type="email"
                  required
                  maxLength={100}
                  placeholder="student@jstu.ac.bd"
                  value={statusCheckEmail}
                  onChange={(e) => setStatusCheckEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center"
                isLoading={isCheckingStatus}
                leftIcon={<Search className="w-3.5 h-3.5" />}
              >
                {isBn ? 'অবস্থা পরীক্ষা করুন' : 'Check Status'}
              </Button>
            </form>

            {/* Status Result Display */}
            {statusCheckResult && (
              <div className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-3">
                {statusCheckResult.found && statusCheckResult.status ? (
                  (() => {
                    const badge = getStatusBadge(statusCheckResult.status);
                    return (
                      <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600">
                            {isBn ? 'বর্তমান অবস্থা:' : 'Current Status:'}
                          </span>
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 pt-1">
                          {badge.desc}
                        </p>
                      </div>
                    );
                  })()
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{isBn ? 'কোনো তথ্য পাওয়া যায়নি' : 'No Request Found'}</p>
                      <p className="text-[11px] mt-0.5">{statusCheckResult.message}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default RequestAccountPage;
