import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { maskName, StudentIDCard } from '../../services/idCard/idCardService';
import { NeutralUniversityLogo } from '../../components/common/NeutralUniversityLogo';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Search,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const VerifyIDPage: React.FC = () => {
  const { token: urlToken } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [inputToken, setInputToken] = useState(urlToken || '');
  const [queriedCard, setQueriedCard] = useState<StudentIDCard | null | undefined>(undefined);
  const [searchedToken, setSearchedToken] = useState<string>(urlToken || '');
  const [verificationTime, setVerificationTime] = useState<string>('');

  const storeManager = SharedDataStoreManager.getInstance();

  useEffect(() => {
    if (urlToken) {
      const trimmed = urlToken.trim();
      setSearchedToken(trimmed);
      setInputToken(trimmed);
      const found = storeManager.getIdCardByToken(trimmed);
      setQueriedCard(found || null);
      setVerificationTime(new Date().toLocaleString());
    } else {
      setQueriedCard(undefined);
    }
  }, [urlToken]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputToken.trim()) return;
    navigate(`/verify-id/${encodeURIComponent(inputToken.trim())}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Top Back Nav */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1E3A8A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? 'বিশ্ববিদ্যালয় মূল পাতায় ফেরত' : 'Back to JSTU Home'}</span>
          </Link>
          <div className="text-[11px] font-mono text-slate-500 font-bold bg-white px-2.5 py-1 rounded-md border border-slate-200">
            SSL / TLS SECURE
          </div>
        </div>

        {/* Header Institution Emblem */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
            <NeutralUniversityLogo size={56} />
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
            Jamalpur Science &amp; Technology University
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {isBn ? 'অফিসিয়াল ডিজিটাল আইডি ভেরিফিকেশন পোর্টাল' : 'Official Public Digital ID Verification Registry'}
          </p>
        </div>

        {/* Demo Watermark Banner (Required) */}
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-center text-xs font-bold text-amber-900 shadow-sm flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>DEMO - not an official ID • For System Evaluation Only</span>
        </div>

        {/* Verification Input Box */}
        <Card className="p-4 bg-white border border-slate-200 shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder={isBn ? 'ভেরিফিকেশন টোকেন লিখুন...' : 'Enter verification token...'}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>
            <Button type="submit" variant="primary" size="sm" className="text-xs shrink-0">
              {isBn ? 'যাচাই করুন' : 'Verify ID'}
            </Button>
          </form>
        </Card>

        {/* VERIFICATION RESULT */}
        {queriedCard === undefined && !searchedToken && (
          <Card className="p-8 text-center bg-white border border-slate-200 text-slate-500 space-y-2">
            <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h2 className="text-sm font-bold text-slate-700">
              {isBn ? 'কিউআর কোড স্ক্যান করুন বা টোকেন লিখুন' : 'Scan a QR Code or Enter Token'}
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isBn
                ? 'আইডি কার্ডের কিউআর কোড স্ক্যান করলে সরাসরি এই ভেরিফিকেশন পাতায় কার্ডের বৈধতা দেখতে পাবেন।'
                : 'Scanning the QR code on a student ID card instantly brings you to this real-time ledger verification view.'}
            </p>
          </Card>
        )}

        {queriedCard === null && searchedToken && (
          <Card className="p-6 bg-red-50 border-2 border-red-200 text-center space-y-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-red-900">
                {isBn ? 'আইডি কার্ড পাওয়া যায়নি' : 'Invalid or Unrecognized Token'}
              </h2>
              <p className="text-xs text-red-700 mt-1 max-w-sm mx-auto">
                {isBn
                  ? `"${searchedToken}" টোকেনটির সাথে কোনো নিবন্ধিত আইডি কার্ডের মিল মেলেনি।`
                  : `No university ID record matches token "${searchedToken}". The credential may be counterfeit or revoked.`}
              </p>
            </div>
          </Card>
        )}

        {queriedCard && (
          <Card className="overflow-hidden bg-white border-2 border-slate-200 shadow-lg">
            {/* Status Header Band */}
            {queriedCard.status === 'Active' && (
              <div className="bg-emerald-600 text-white p-4 flex items-center gap-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-100 shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                    Verification Confirmed
                  </div>
                  <div className="text-sm sm:text-base font-extrabold">
                    {isBn ? 'সক্রিয় আইডি কার্ড (Active Student ID)' : 'Active Official Student ID'}
                  </div>
                </div>
              </div>
            )}

            {queriedCard.status === 'Lost' && (
              <div className="bg-amber-600 text-white p-4 flex items-center gap-3">
                <AlertTriangle className="w-7 h-7 text-amber-100 shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-100">
                    Security Notice
                  </div>
                  <div className="text-sm sm:text-base font-extrabold">
                    {isBn ? 'হারানো কার্ড (Reported Lost)' : 'Card Reported Lost — Inactive'}
                  </div>
                </div>
              </div>
            )}

            {queriedCard.status === 'Revoked' && (
              <div className="bg-red-600 text-white p-4 flex items-center gap-3">
                <ShieldAlert className="w-7 h-7 text-red-100 shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-red-100">
                    Administrative Action
                  </div>
                  <div className="text-sm sm:text-base font-extrabold">
                    {isBn ? 'বাতিলকৃত কার্ড (Revoked by Registrar)' : 'Card Revoked by Registrar'}
                  </div>
                </div>
              </div>
            )}

            {queriedCard.status === 'Expired' && (
              <div className="bg-slate-700 text-white p-4 flex items-center gap-3">
                <Clock className="w-7 h-7 text-slate-300 shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Term Concluded
                  </div>
                  <div className="text-sm sm:text-base font-extrabold">
                    {isBn ? 'মেয়াদ উত্তীর্ণ কার্ড (Expired)' : 'Card Expired — Term Concluded'}
                  </div>
                </div>
              </div>
            )}

            {/* Privacy-Preserving Details (SHOWING ONLY: masked name, department, status) */}
            <div className="p-6 space-y-5">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>
                  {isBn
                    ? 'শিক্ষার্থীর ব্যক্তিগত গোপনীয়তা রক্ষায় শুধুমাত্র মাস্ককৃত নাম, বিভাগ ও স্থিতি প্রদর্শিত হচ্ছে।'
                    : 'To protect student privacy, only masked name, department, and card status are publicly disclosed.'}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {/* 1. Masked Name */}
                <div className="py-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {isBn ? 'শিক্ষার্থীর নাম (মাস্ককৃত)' : 'Student Name (Masked)'}
                  </span>
                  <span className="text-sm sm:text-base font-black font-mono text-slate-900 tracking-wider">
                    {maskName(queriedCard.name)}
                  </span>
                </div>

                {/* 2. Department */}
                <div className="py-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {isBn ? 'বিভাগ' : 'Department'}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 text-right">
                    {isBn ? queriedCard.departmentBn || queriedCard.department : queriedCard.department}
                  </span>
                </div>

                {/* 3. Status */}
                <div className="py-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {isBn ? 'আইডি স্থিতি' : 'Card Status'}
                  </span>
                  <div className="text-right">
                    {queriedCard.status === 'Active' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ACTIVE</span>
                      </span>
                    )}
                    {queriedCard.status === 'Lost' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>LOST</span>
                      </span>
                    )}
                    {queriedCard.status === 'Revoked' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                        <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                        <span>REVOKED</span>
                      </span>
                    )}
                    {queriedCard.status === 'Expired' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300">
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                        <span>EXPIRED</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Token string */}
                <div className="py-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Cryptographic Token:</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    {queriedCard.verificationToken}
                  </span>
                </div>
              </div>

              {/* Status Reason / Note if applicable */}
              {queriedCard.statusReason && queriedCard.status !== 'Active' && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold block text-slate-700 mb-0.5">
                    {isBn ? 'রেজিস্ট্রার দপ্তরের নোট:' : 'Registrar Office Note:'}
                  </span>
                  <p className="text-slate-600 italic">{queriedCard.statusReason}</p>
                </div>
              )}

              {/* Timestamp */}
              <div className="text-[11px] text-slate-400 text-center pt-2">
                Verification performed on {verificationTime || new Date().toLocaleString()}
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
              Office of the Registrar • Jamalpur Science &amp; Technology University
            </div>
          </Card>
        )}
      </div>

      {/* Footer Branding */}
      <footer className="text-center text-xs text-slate-400 pt-10 pb-4">
        &copy; {new Date().getFullYear()} Jamalpur Science &amp; Technology University • Prototype Evaluation Mode
      </footer>
    </div>
  );
};
