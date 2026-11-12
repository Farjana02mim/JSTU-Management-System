import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { HallId, TokenVerificationResult } from '../../types/hallDining';
import {
  QrCode,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Search,
  RefreshCw,
  Building,
  UserCheck,
  RotateCcw,
  Camera,
  Layers,
  FileText
} from 'lucide-react';
import { getHallForUserEmail, getHallDiningConfig } from '../../config/hallDiningConfig';

export const DiningStaffScanPage: React.FC = () => {
  const { user, profile, claims } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const userRole = (claims?.role as string) || (profile?.role as string) || 'dining_manager';
  const isAdminOrProvost = userRole === 'admin' || userRole === 'super_admin';

  const userEmail = (user?.email || profile?.email || '').toLowerCase();
  const assignedManagerHall = getHallForUserEmail(userEmail);

  // Scoped hall: manager can only scan for their own hall
  const [selectedHall, setSelectedHall] = useState<HallId>(assignedManagerHall || 'hall-a');
  const [inputVal, setInputVal] = useState<string>('');
  const [result, setResult] = useState<TokenVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<number>(0);

  // Manual Override State
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideSuccess, setOverrideSuccess] = useState(false);

  const storeManager = SharedDataStoreManager.getInstance();
  const liveCounters = storeManager.getLiveMealCounters(selectedHall, 'Lunch');

  // Simulated rate-limiting on checks (min 400ms between scans to avoid rapid brute-force)
  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    const now = Date.now();
    if (now - lastScanTime < 400) {
      setRateLimitExceeded(true);
      setTimeout(() => setRateLimitExceeded(false), 1500);
      return;
    }
    setLastScanTime(now);

    setIsVerifying(true);
    // Real token validation and one-time-use marking must run server-side with atomic transactions, otherwise tokens can be reused or forged.
    // Real enforcement must move to Firestore rules / Cloud Functions.
    setTimeout(() => {
      const res = storeManager.verifyAndConsumeMealToken(
        inputVal.trim(),
        selectedHall,
        userRole,
        user?.uid || 'demo_manager'
      );
      setResult(res);
      setIsVerifying(false);
    }, 200);
  };

  const handleManualOverride = () => {
    if (!inputVal.trim() || !overrideReason.trim()) return;

    const success = storeManager.overrideMealToken(
      inputVal.trim(),
      selectedHall,
      overrideReason.trim(),
      userRole,
      user?.uid || 'demo_manager'
    );

    if (success) {
      setOverrideSuccess(true);
      setShowOverrideModal(false);
      setResult({
        status: 'VALID',
        hallId: selectedHall,
        mealType: 'lunch',
        maskedStudentName: 'Manual Override Accepted',
        message: `Override applied successfully: "${overrideReason}" recorded in dining audit trail.`,
        messageBn: `ম্যানুয়াল অনুমোদন সফল: ডাইনিং অডিট ট্রেইলে কারণ সংরক্ষিত হয়েছে।`,
        verifiedAt: new Date().toISOString()
      });
    }
  };

  const handleQuickDemoScan = (code: string) => {
    setInputVal(code);
    setIsVerifying(true);
    setTimeout(() => {
      const res = storeManager.verifyAndConsumeMealToken(
        code,
        selectedHall,
        userRole,
        user?.uid || 'demo_manager'
      );
      setResult(res);
      setIsVerifying(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/office/dining"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {isBn ? 'ডাইনিং মিল টোকেন স্ক্যানার' : 'Dining Meal Token Scanner'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                {isBn
                  ? 'কাউন্টার মিল ভেরিফিকেশন ও পরিবেশন রেকর্ড'
                  : 'Counter meal verification & single-use redemption terminal'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/office/dining/reports"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              {isBn ? 'মাসিক অডিট রিপোর্ট' : 'Monthly Audit Reports'}
            </Link>
          </div>
        </div>

        {/* Live Counters Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-600">
                {isBn ? 'প্রত্যাশিত খাবার' : 'Expected Meals'}
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {liveCounters.expected}
              </p>
            </div>
            <span className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <Layers className="w-5 h-5" />
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-emerald-700">
                {isBn ? 'পরিবেশিত (Served)' : 'Served Count'}
              </span>
              <p className="text-2xl font-bold text-emerald-700 mt-1">
                {liveCounters.served}
              </p>
            </div>
            <span className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-amber-700">
                {isBn ? 'অবশিষ্ট (Remaining)' : 'Remaining Meals'}
              </span>
              <p className="text-2xl font-bold text-amber-700 mt-1">
                {liveCounters.remaining}
              </p>
            </div>
            <span className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <Clock className="w-5 h-5" />
            </span>
          </div>
        </div>

        {/* Scanner Control & Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-500" />
              <label htmlFor="hall-scanner-select" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {isBn ? 'স্ক্যানার হল নিয়ন্ত্রণ:' : 'Scanner Hall Location:'}
              </label>
              {isAdminOrProvost ? (
                <select
                  id="hall-scanner-select"
                  aria-label={isBn ? 'স্ক্যানার হল নির্বাচন করুন' : 'Select scanner hall location'}
                  value={selectedHall}
                  onChange={(e) => {
                    setSelectedHall(e.target.value as HallId);
                    setResult(null);
                  }}
                  className="text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="hall-a">Oporajita Hall</option>
                  <option value="hall-b">Bijoy 24 Hall</option>
                </select>
              ) : (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {getHallDiningConfig(selectedHall).name}
                </span>
              )}
            </div>

            <span className="text-xs text-slate-600">
              {isBn ? 'সেশন: দুপুর (১২:৩০ - ০৩:৩০)' : 'Session: Lunch (12:30 PM - 03:30 PM)'}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="mt-5">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {isBn
                ? 'টোকেন স্ট্রিং বা ৬-সংখ্যার কোড প্রবেশ করান'
                : 'Scan QR Code or Enter 6-Digit Fallback Code'}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <QrCode className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={
                    isBn
                      ? 'উদাঃ 492108 বা QR টোকেন স্ট্রিং পেস্ট করুন'
                      : 'e.g. 492108 or paste token hash...'
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying || !inputVal.trim()}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-medium rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
              >
                {isVerifying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>{isBn ? 'যাচাই করুন' : 'Verify'}</span>
              </button>
            </div>
          </form>

          {/* Rate Limit alert */}
          {rateLimitExceeded && (
            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
              <span>
                {isBn
                  ? 'দ্রুত স্ক্যান রোধ করা হয়েছে। অনুগ্রহ করে এক মুহূর্ত অপেক্ষা করুন।'
                  : 'Rate limit active. Please pause briefly between scans.'}
              </span>
            </div>
          )}

          {/* Quick Demo Test Buttons */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
              {isBn ? 'দ্রুত ডেমো টেস্ট কেস (ক্লিক করে পরীক্ষা করুন):' : 'Quick Demo Test Cases (Click to Test):'}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoScan('492108')}
                className="px-2.5 py-1 text-xs rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
              >
                ✓ Valid Token (492108)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoScan('881290')}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              >
                ⟳ Already Used (881290)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoScan('773412')}
                className="px-2.5 py-1 text-xs rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
              >
                ⚠ Expired (773412)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoScan('661904')}
                className="px-2.5 py-1 text-xs rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200"
              >
                ✕ Wrong Hall (661904)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoScan('000000')}
                className="px-2.5 py-1 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
              >
                ? Not Found (000000)
              </button>
            </div>
          </div>
        </div>

        {/* Verification Result Display */}
        {result && (
          <div
            className={`rounded-2xl border p-6 mb-6 shadow-sm transition-all ${
              result.status === 'VALID'
                ? 'bg-emerald-50 border-emerald-200'
                : result.status === 'ALREADY_USED'
                ? 'bg-slate-100 border-slate-300'
                : result.status === 'EXPIRED'
                ? 'bg-amber-50 border-amber-300'
                : result.status === 'WRONG_HALL'
                ? 'bg-rose-50 border-rose-300'
                : result.status === 'NOT_SWITCHED_ON'
                ? 'bg-orange-50 border-orange-300'
                : 'bg-rose-50 border-rose-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white shadow-sm shrink-0">
                  {result.status === 'VALID' && (
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  )}
                  {result.status === 'ALREADY_USED' && (
                    <Clock className="w-8 h-8 text-slate-600" />
                  )}
                  {result.status === 'EXPIRED' && (
                    <AlertTriangle className="w-8 h-8 text-amber-600" />
                  )}
                  {result.status === 'WRONG_HALL' && (
                    <XCircle className="w-8 h-8 text-rose-600" />
                  )}
                  {result.status === 'NOT_SWITCHED_ON' && (
                    <ShieldAlert className="w-8 h-8 text-orange-600" />
                  )}
                  {result.status === 'NOT_FOUND' && (
                    <XCircle className="w-8 h-8 text-rose-600" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        result.status === 'VALID'
                          ? 'bg-emerald-200 text-emerald-900'
                          : result.status === 'ALREADY_USED'
                          ? 'bg-slate-200 text-slate-800'
                          : result.status === 'EXPIRED'
                          ? 'bg-amber-200 text-amber-900'
                          : result.status === 'WRONG_HALL'
                          ? 'bg-rose-200 text-rose-900'
                          : result.status === 'NOT_SWITCHED_ON'
                          ? 'bg-orange-200 text-orange-900'
                          : 'bg-rose-200 text-rose-900'
                      }`}
                    >
                      {result.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="mt-2 text-sm sm:text-base font-medium text-slate-900">
                    {isBn ? result.messageBn : result.message}
                  </p>

                  {result.maskedStudentName && (
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-700 bg-white/70 rounded-xl px-3 py-2 border border-slate-200/50">
                      <span className="font-semibold flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                        {isBn ? 'শিক্ষার্থী (মাস্কড):' : 'Student (Masked):'} {result.maskedStudentName}
                      </span>
                      {result.mealType && (
                        <span>• {isBn ? 'মিল:' : 'Meal:'} {result.mealType}</span>
                      )}
                      {result.hallId && (
                        <span>• {getHallDiningConfig(result.hallId).name}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                {result.status !== 'VALID' && (
                  <button
                    onClick={() => {
                      setOverrideReason('');
                      setShowOverrideModal(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"
                  >
                    {isBn ? 'ম্যানুয়াল ওভাররাইড' : 'Manual Override'}
                  </button>
                )}
                <button
                  onClick={() => {
                    setInputVal('');
                    setResult(null);
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl text-slate-600 hover:bg-slate-200/60"
                >
                  {isBn ? 'নতুন স্ক্যান' : 'Reset'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manual Override Modal */}
        {showOverrideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6">
              <div className="flex items-center gap-2 mb-3 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">
                  {isBn ? 'ম্যানুয়াল খাবার অনুমোদন (ওভাররাইড)' : 'Manual Dining Override'}
                </h3>
              </div>

              <p className="text-xs text-slate-600 mb-4">
                {isBn
                  ? 'এই ক্রিয়াকলাপটি বাধ্যতামূলক অডিট লগে রেকর্ড করা হবে। অনুগ্রহ করে কেন শিক্ষার্থীকে খাবার দেওয়া হচ্ছে তা উল্লেখ করুন (উদাঃ কার্ড হারিয়েছে, শিক্ষক সুপারিশ, নেটওয়ার্ক বিলম্ব)।'
                  : 'This override is logged in the permanent audit trail with your manager identity. State the specific reason for dispensing the meal.'}
              </p>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? 'অনুমোদনের কারণ (বাধ্যতামূলক):' : 'Mandatory Override Reason:'}
                </label>
                <textarea
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder={
                    isBn
                      ? 'উদাঃ শিক্ষার্থীর ফোন ব্যাটারি শেষ, পরিচয়পত্র যাচাই করে খাবার দেওয়া হয়েছে'
                      : 'e.g., Student phone battery dead, verified physical hall card'
                  }
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="button"
                  disabled={!overrideReason.trim()}
                  onClick={handleManualOverride}
                  className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 text-white rounded-xl shadow-sm"
                >
                  {isBn ? 'অনুমোদন ও পরিবেশন' : 'Approve & Serve'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
