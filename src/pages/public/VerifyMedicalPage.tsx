import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { NeutralUniversityLogo } from '../../components/common/NeutralUniversityLogo';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Search,
  ArrowLeft,
  Building2,
  Calendar,
  AlertCircle,
  FileCheck2,
  UserCheck
} from 'lucide-react';

const RATE_LIMIT_KEY = 'jstu_medical_cert_verify_rate_limit';
const MAX_REQUESTS_PER_MINUTE = 10;
const WINDOW_MS = 60 * 1000;

export const VerifyMedicalPage: React.FC = () => {
  const { id: urlId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [inputId, setInputId] = useState(urlId || '');
  const [searchedId, setSearchedId] = useState<string>(urlId || '');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'VALID' | 'SUPERSEDED' | 'REVOKED' | 'NOT_FOUND';
    maskedName?: string;
    restPeriod?: {
      startDate: string;
      endDate: string;
      days: number;
    };
    issueDate?: string;
    centerName: string;
    verificationId?: string;
    canonicalHash?: string;
    supersededReason?: string;
    revocationReason?: string;
  } | null>(null);

  const [verificationTime, setVerificationTime] = useState<string>('');
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [rateLimitSecondsLeft, setRateLimitSecondsLeft] = useState(0);

  const storeManager = SharedDataStoreManager.getInstance();

  // Rate Limiting check: 10 queries per minute
  const checkRateLimit = (): boolean => {
    try {
      const now = Date.now();
      const raw = localStorage.getItem(RATE_LIMIT_KEY);
      let timestamps: number[] = raw ? JSON.parse(raw) : [];
      timestamps = timestamps.filter((t) => now - t < WINDOW_MS);

      if (timestamps.length >= MAX_REQUESTS_PER_MINUTE) {
        const oldest = timestamps[0];
        const waitMs = WINDOW_MS - (now - oldest);
        setRateLimitSecondsLeft(Math.max(1, Math.ceil(waitMs / 1000)));
        setRateLimitExceeded(true);
        return false;
      }

      timestamps.push(now);
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps));
      setRateLimitExceeded(false);
      return true;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (rateLimitExceeded && rateLimitSecondsLeft > 0) {
      timer = setInterval(() => {
        setRateLimitSecondsLeft((prev) => {
          if (prev <= 1) {
            setRateLimitExceeded(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [rateLimitExceeded, rateLimitSecondsLeft]);

  useEffect(() => {
    if (urlId) {
      const trimmed = urlId.trim();
      setSearchedId(trimmed);
      setInputId(trimmed);

      if (!checkRateLimit()) {
        setVerificationResult(null);
        return;
      }

      const result = storeManager.verifyMedicalCertificate(trimmed);
      setVerificationResult(result);
      setVerificationTime(new Date().toLocaleString());
    } else {
      setVerificationResult(null);
    }
  }, [urlId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputId.trim()) return;
    navigate(`/verify-medical/${encodeURIComponent(inputId.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/verify"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1E3A8A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? 'সনদ যাচাইকরণে ফেরত' : 'Back to Document Verification'}</span>
          </Link>
          <div className="text-[11px] font-mono text-slate-600 font-bold bg-white px-2.5 py-1 rounded-md border border-[#E2E8F0]">
            MEDICAL REGISTRY
          </div>
        </div>

        {/* Header Institution Emblem */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm border border-[#E2E8F0]">
            <NeutralUniversityLogo size={52} />
          </div>
          <h1 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight uppercase">
            Jamalpur Science &amp; Technology University
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            {isBn
              ? 'মেডিকেল রেস্ট সার্টিফিকেট পাবলিক ভেরিফিকেশন রেজিস্ট্রি'
              : 'Medical Rest Certificate Public Verification Registry'}
          </p>
        </div>

        {/* Mandatory Safety Notice */}
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-center text-xs font-bold text-amber-900 shadow-sm flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>DEMO - not an official medical certificate • University Prototype</span>
        </div>

        {/* Verification Input Box */}
        <Card className="p-4 bg-white border border-[#E2E8F0] shadow-sm">
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-bold text-[#0F172A]">
              {isBn ? '১২৮-বিট ভেরিফিকেশন আইডি প্রদান করুন:' : 'Enter 128-Bit Verification ID:'}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  placeholder={isBn ? 'সার্টিফিকেট আইডি বা টোকেন লিখুন...' : 'e.g., a1b2c3d4e5f60718293a4b5c6d7e8f90'}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] font-mono placeholder:text-slate-600"
                />
              </div>
              <Button type="submit" variant="primary" size="sm" className="shrink-0 bg-[#1E3A8A] hover:bg-[#1E40AF]">
                {isBn ? 'যাচাই করুন' : 'Verify'}
              </Button>
            </div>
            <p className="text-[11px] text-slate-600">
              {isBn
                ? 'সুরক্ষার সুবিধার্থে প্রতি মিনিটে সর্বোচ্চ ১০টি অনুসন্ধান অনুমোদিত।'
                : 'Protected by simulated rate limiting (maximum 10 queries per minute).'}
            </p>
          </form>
        </Card>

        {/* Rate limit notification */}
        {rateLimitExceeded && (
          <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-bold">
                {isBn ? 'অনুরোধের সীমা অতিক্রম করেছে' : 'Rate Limit Exceeded'}
              </p>
              <p className="mt-1">
                {isBn
                  ? `নিরাপত্তার স্বার্থে প্রতি মিনিটে সর্বোচ্চ ১০টি অনুরোধ অনুমোদিত। অনুগ্রহ করে ${rateLimitSecondsLeft} সেকেন্ড অপেক্ষা করুন।`
                  : `For security reasons, verification is limited to 10 queries per minute. Please retry in ${rateLimitSecondsLeft}s.`}
              </p>
            </div>
          </div>
        )}

        {/* Verification Result Card */}
        {verificationResult && !rateLimitExceeded && (
          <Card className="p-6 bg-white border border-[#E2E8F0] shadow-sm space-y-5">
            {/* Status 1: VALID */}
            {verificationResult.status === 'VALID' && (
              <div className="text-center space-y-2 pb-4 border-b border-[#E2E8F0]">
                <div className="inline-flex p-3 rounded-full bg-emerald-50 text-[#166534] border border-emerald-200">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h2 className="text-lg font-black text-[#166534] uppercase tracking-wide">
                  {isBn ? 'বৈধ মেডিকেল সার্টিফিকেট' : 'VALID MEDICAL CERTIFICATE'}
                </h2>
                <Badge variant="success">
                  {isBn ? 'সক্রিয় ও বৈধ প্রাতিষ্ঠানিক রেকর্ড' : 'AUTHENTIC ACTIVE CERTIFICATE'}
                </Badge>
              </div>
            )}

            {/* Status 2: SUPERSEDED */}
            {verificationResult.status === 'SUPERSEDED' && (
              <div className="text-center space-y-2 pb-4 border-b border-[#E2E8F0]">
                <div className="inline-flex p-3 rounded-full bg-amber-50 text-[#92400E] border border-amber-200">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <h2 className="text-lg font-black text-[#92400E] uppercase tracking-wide">
                  {isBn ? 'প্রতিস্থাপিত সার্টিফিকেট (SUPERSEDED)' : 'SUPERSEDED CERTIFICATE'}
                </h2>
                <Badge variant="warning">
                  {isBn ? 'সংশোধিত নতুন সংস্করণ দ্বারা প্রতিস্থাপিত' : 'SUPERSEDED BY NEWER VERSION'}
                </Badge>
                {verificationResult.supersededReason && (
                  <p className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-left mt-2">
                    <strong>{isBn ? 'প্রতিস্থাপনের কারণ: ' : 'Superseding Reason: '}</strong>
                    {verificationResult.supersededReason}
                  </p>
                )}
              </div>
            )}

            {/* Status 3: REVOKED */}
            {verificationResult.status === 'REVOKED' && (
              <div className="text-center space-y-2 pb-4 border-b border-[#E2E8F0]">
                <div className="inline-flex p-3 rounded-full bg-red-50 text-[#991B1B] border border-red-200">
                  <ShieldAlert className="w-10 h-10" />
                </div>
                <h2 className="text-lg font-black text-[#991B1B] uppercase tracking-wide">
                  {isBn ? 'বাতিলকৃত সার্টিফিকেট (REVOKED)' : 'REVOKED CERTIFICATE'}
                </h2>
                <Badge variant="danger">
                  {isBn ? 'এই সার্টিফিকেটটি বিশ্ববিদ্যালয় কর্তৃক বাতিল' : 'OFFICIALLY REVOKED'}
                </Badge>
                {verificationResult.revocationReason && (
                  <p className="text-xs text-red-900 bg-red-50 p-2.5 rounded-lg border border-red-200 text-left mt-2">
                    <strong>{isBn ? 'বাতিলের কারণ: ' : 'Revocation Reason: '}</strong>
                    {verificationResult.revocationReason}
                  </p>
                )}
              </div>
            )}

            {/* Status 4: NOT FOUND */}
            {verificationResult.status === 'NOT_FOUND' && (
              <div className="text-center space-y-2 pb-4 border-b border-[#E2E8F0]">
                <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-600 border border-[#E2E8F0]">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <h2 className="text-lg font-black text-[#0F172A] uppercase tracking-wide">
                  {isBn ? 'সার্টিফিকেট পাওয়া যায়নি' : 'CERTIFICATE NOT FOUND'}
                </h2>
                <Badge variant="neutral">
                  {isBn ? 'অজ্ঞাত বা ভুল ভেরিফিকেশন আইডি' : 'UNRECOGNIZED IDENTIFIER'}
                </Badge>
                <p className="text-xs text-slate-600 max-w-sm mx-auto pt-2">
                  {isBn
                    ? 'প্রদত্ত আইডির বিপরীতে বিশ্ববিদ্যালয়ের মেডিকেল রেজিস্ট্রি লেজারে কোনো সনদ পাওয়া যায়নি।'
                    : 'No medical rest certificate matched this verification identifier in the institutional registry.'}
                </p>
              </div>
            )}

            {/* Attributes Table — STRICT PRIVACY: Masked Name, Rest Dates, Issue Date, Center Name ONLY */}
            {verificationResult.status !== 'NOT_FOUND' && (
              <div className="space-y-3 pt-2">
                {verificationResult.maskedName && (
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="flex items-center gap-2 text-slate-600">
                      <UserCheck className="w-4 h-4 text-slate-600" />
                      <span>{isBn ? 'শিক্ষার্থীর নাম (মাস্কড):' : 'Patient Name (Masked):'}</span>
                    </span>
                    <span className="font-bold text-[#0F172A] font-mono">{verificationResult.maskedName}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="flex items-center gap-2 text-slate-600">
                    <Building2 className="w-4 h-4 text-slate-600" />
                    <span>{isBn ? 'ইস্যুকারী প্রতিষ্ঠান:' : 'Issuing Center:'}</span>
                  </span>
                  <span className="font-bold text-[#0F172A]">{verificationResult.centerName}</span>
                </div>

                {verificationResult.restPeriod && (
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      <span>{isBn ? 'অনুমোদিত ছুটির মেয়াদ:' : 'Certified Rest Period:'}</span>
                    </span>
                    <span className="font-bold text-[#0F172A]">
                      {verificationResult.restPeriod.startDate} &rarr; {verificationResult.restPeriod.endDate} ({verificationResult.restPeriod.days} {isBn ? 'দিন' : 'days'})
                    </span>
                  </div>
                )}

                {verificationResult.issueDate && (
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="flex items-center gap-2 text-slate-600">
                      <FileCheck2 className="w-4 h-4 text-slate-600" />
                      <span>{isBn ? 'ইস্যু তারিখ:' : 'Issue Date:'}</span>
                    </span>
                    <span className="font-bold text-[#0F172A] font-mono">{verificationResult.issueDate}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-600" />
                    <span>{isBn ? 'যাচাই সময়:' : 'Verification Timestamp:'}</span>
                  </span>
                  <span className="font-mono text-slate-600">{verificationTime}</span>
                </div>

                {/* Privacy Safeguard Note */}
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                  <strong>{isBn ? 'গোপনীয়তা নীতি: ' : 'Privacy Shield: '}</strong>
                  {isBn
                    ? 'শিক্ষার্থীর স্বাস্থ্য সুরক্ষার স্বার্থে এই পাবলিক পেজে কোনো ডায়াগনোসিস বা উপসর্গের তথ্য প্রকাশ করা হয় না। শুধুমাত্র অনুমোদিত বিশ্রামের দিন ও সনদের সত্যতা যাচাইযোগ্য।'
                    : 'To uphold student privacy, no diagnosis or medical symptoms are disclosed on this registry. Only certified rest dates and authenticity status are exposed.'}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-600 space-y-1">
          <p>Jamalpur Science &amp; Technology University • Medical Center</p>
          <p>Prototype / Student Project • Not an official university certificate</p>
        </div>
      </div>
    </div>
  );
};
