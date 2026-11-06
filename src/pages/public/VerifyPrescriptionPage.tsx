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
  AlertCircle
} from 'lucide-react';

const RATE_LIMIT_KEY = 'jstu_prescription_verify_rate_limit';
const MAX_REQUESTS_PER_MINUTE = 10;
const WINDOW_MS = 60 * 1000;

export const VerifyPrescriptionPage: React.FC = () => {
  const { token: urlToken } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [inputToken, setInputToken] = useState(urlToken || '');
  const [searchedToken, setSearchedToken] = useState<string>(urlToken || '');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'VALID' | 'REVOKED' | 'NOT_FOUND';
    issueDate?: string;
    centerName: string;
  } | null>(null);
  const [verificationTime, setVerificationTime] = useState<string>('');
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [rateLimitSecondsLeft, setRateLimitSecondsLeft] = useState(0);

  const storeManager = SharedDataStoreManager.getInstance();

  // Rate Limiting check: 10 per minute
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
    if (urlToken) {
      const trimmed = urlToken.trim();
      setSearchedToken(trimmed);
      setInputToken(trimmed);

      if (!checkRateLimit()) {
        setVerificationResult(null);
        return;
      }

      const result = storeManager.verifyPrescriptionToken(trimmed);
      setVerificationResult(result);
      setVerificationTime(new Date().toLocaleString());
    } else {
      setVerificationResult(null);
    }
  }, [urlToken]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputToken.trim()) return;
    navigate(`/verify-prescription/${encodeURIComponent(inputToken.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/medical-center"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1E3A8A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? 'মেডিকেল সেন্টারে ফেরত' : 'Back to Medical Center'}</span>
          </Link>
          <div className="text-[11px] font-mono text-slate-600 font-bold bg-white px-2.5 py-1 rounded-md border border-[#E2E8F0]">
            PRESCRIPTION REGISTRY
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
            {isBn ? 'ডিজিটাল প্রেসক্রিপশন ভেরিফিকেশন পোর্টাল' : 'Official Digital Prescription Verification Portal'}
          </p>
        </div>

        {/* Demo Watermark Banner */}
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-center text-xs font-bold text-amber-900 shadow-sm flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>DEMO ONLY — Not an official medical record registry • System Prototype</span>
        </div>

        {/* Verification Input Box */}
        <Card className="p-4 bg-white border border-[#E2E8F0] shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder={isBn ? 'প্রেসক্রিপশন ভেরিফিকেশন টোকেন দিন...' : 'Enter prescription verification token...'}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent font-mono placeholder:text-slate-600"
              />
            </div>
            <Button type="submit" variant="primary" size="sm" className="shrink-0 bg-[#1E3A8A] hover:bg-[#1E40AF]">
              {isBn ? 'যাচাই করুন' : 'Verify'}
            </Button>
          </form>
        </Card>

        {/* Rate limit notice */}
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
            {/* Status Header */}
            {verificationResult.status === 'VALID' && (
              <div className="text-center space-y-2 pb-4 border-b border-[#E2E8F0]">
                <div className="inline-flex p-3 rounded-full bg-emerald-50 text-[#166534] border border-emerald-200">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h2 className="text-lg font-black text-[#166534] uppercase tracking-wide">
                  {isBn ? 'বৈধ প্রেসক্রিপশন' : 'VALID PRESCRIPTION'}
                </h2>
                <Badge variant="success">
                  {isBn ? 'যাচাইকৃত সক্রিয় রেকর্ড' : 'AUTHENTIC ACTIVE RECORD'}
                </Badge>
              </div>
            )}

            {verificationResult.status === 'REVOKED' && (
              <div className="text-center space-y-2 pb-4 border-b border-[#E2E8F0]">
                <div className="inline-flex p-3 rounded-full bg-red-50 text-[#991B1B] border border-red-200">
                  <ShieldAlert className="w-10 h-10" />
                </div>
                <h2 className="text-lg font-black text-[#991B1B] uppercase tracking-wide">
                  {isBn ? 'বাতিলকৃত প্রেসক্রিপশন' : 'REVOKED PRESCRIPTION'}
                </h2>
                <Badge variant="danger">
                  {isBn ? 'এই প্রেসক্রিপশনটি বাতিল করা হয়েছে' : 'PRESCRIPTION RECORD REVOKED'}
                </Badge>
              </div>
            )}

            {verificationResult.status === 'NOT_FOUND' && (
              <div className="text-center space-y-2 pb-4 border-b border-[#E2E8F0]">
                <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-600 border border-[#E2E8F0]">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <h2 className="text-lg font-black text-[#0F172A] uppercase tracking-wide">
                  {isBn ? 'রেকর্ড পাওয়া যায়নি' : 'PRESCRIPTION NOT FOUND'}
                </h2>
                <Badge variant="neutral">
                  {isBn ? 'অজ্ঞাত বা ভুল টোকেন' : 'UNRECOGNIZED TOKEN'}
                </Badge>
                <p className="text-xs text-slate-600 max-w-sm mx-auto pt-2">
                  {isBn
                    ? 'প্রদত্ত টোকেনের বিপরীতে বিশ্ববিদ্যালয়ের মেডিকেল সেন্টারে কোনো রেকর্ড নেই।'
                    : 'No finalized prescription matched this token in the medical registry.'}
                </p>
              </div>
            )}

            {/* Public Attributes — STRICT PRIVACY: Center Name & Issue Date ONLY */}
            {verificationResult.status !== 'NOT_FOUND' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="flex items-center gap-2 text-slate-600">
                    <Building2 className="w-4 h-4 text-slate-600" />
                    <span>{isBn ? 'ইস্যুকারী কেন্দ্র:' : 'Issuing Center:'}</span>
                  </span>
                  <span className="font-bold text-[#0F172A]">{verificationResult.centerName}</span>
                </div>

                {verificationResult.issueDate && (
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      <span>{isBn ? 'ইস্যু তারিখ:' : 'Issue Date:'}</span>
                    </span>
                    <span className="font-bold text-[#0F172A] font-mono">{verificationResult.issueDate}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-600" />
                    <span>{isBn ? 'যাচাই সময়:' : 'Verified At:'}</span>
                  </span>
                  <span className="font-mono text-slate-600">{verificationTime}</span>
                </div>

                {/* Privacy Safeguard Notice */}
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                  <strong>{isBn ? 'গোপনীয়তা বিজ্ঞপ্তি: ' : 'Privacy Protection: '}</strong>
                  {isBn
                    ? 'স্বাস্থ্য সুরক্ষার স্বার্থে এই পাবলিক পেজে রোগীর নাম, উপসর্গ বা ওষুধের বিবরণ প্রদর্শন করা হয় না।'
                    : 'To protect patient privacy, no patient identity or medication details are displayed on this public verification registry.'}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-600 space-y-1">
          <p>Jamalpur Science &amp; Technology University • Medical Center</p>
          <p>Prototype / Student Project • Not the official JSTU portal</p>
        </div>
      </div>
    </div>
  );
};
