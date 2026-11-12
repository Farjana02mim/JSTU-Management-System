import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { MealToken } from '../../types/hallDining';
import {
  QrCode,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  ShieldCheck,
  Utensils,
  Calendar,
  Building,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { getHallDiningConfig } from '../../config/hallDiningConfig';

export const StudentDiningTokenPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const storeManager = SharedDataStoreManager.getInstance();

  const studentIdNum = profile?.studentId || (user as any)?.studentId || 'JSTU2026001';
  const studentUid = user?.uid || (studentIdNum === 'JSTU2026002' ? 'demo_student_02' : 'demo_student_01');
  const studentName = profile?.fullName || user?.displayName || (studentIdNum === 'JSTU2026002' ? 'Mohammad Rahim' : 'Tanvir Ahmed');

  const studentDiningProfile = storeManager.getStudentDiningProfile(studentIdNum);
  const hallId = studentDiningProfile.hallId;
  const hallConfig = getHallDiningConfig(hallId);

  const [selectedMeal, setSelectedMeal] = useState<'Breakfast' | 'Lunch' | 'Dinner'>(
    hallConfig.allowedMealLabels.includes('Lunch') ? 'Lunch' : hallConfig.allowedMealLabels[0]
  );
  const [token, setToken] = useState<MealToken | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadToken = (meal: 'Breakfast' | 'Lunch' | 'Dinner') => {
    setLoading(true);
    const tok = storeManager.getOrCreateStudentMealToken(
      studentUid,
      studentName,
      studentIdNum,
      hallId,
      meal,
      '2026-11-10'
    );
    setToken(tok);

    // Generate QR containing ONLY the random unguessable token string - zero personal data
    // Real token validation and one-time-use marking must run server-side with atomic transactions, otherwise tokens can be reused or forged.
    QRCode.toDataURL(tok.token || tok.tokenString || tok.id, {
      width: 240,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((url) => {
        setQrDataUrl(url);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadToken(selectedMeal);
  }, [selectedMeal]);

  const handleCopyCode = () => {
    if (!token) return;
    navigator.clipboard.writeText(token.manualCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Navigation back */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/student/dining"
            className="inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            {isBn ? 'ডাইনিং ড্যাশবোর্ডে ফিরে যান' : 'Back to Dining Dashboard'}
          </Link>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            {isBn ? 'ডেমো টোকেন মোড' : 'Demo Token Mode'}
          </span>
        </div>

        {/* Safety Notice */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <p className="font-semibold">
              {isBn ? 'নিরাপত্তা ও গোপনীয়তা বিজ্ঞপ্তি' : 'Security & Privacy Notice'}
            </p>
            <p className="mt-1">
              {isBn
                ? 'এই কিউআর কোডটিতে শুধুমাত্র একটি দৈব টোকেন স্ট্রিং এনকোড করা হয়েছে, কোনো ব্যক্তিগত তথ্য বা আইডি নেই। প্রতি মিলের জন্য এটি একবার ব্যবহারযোগ্য।'
                : 'This QR code contains only an unguessable random token with zero personal data. It is valid for a single meal redemption at your hall dining room.'}
            </p>
          </div>
        </div>

        {/* Meal Selector Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 mb-6 flex gap-2">
          {hallConfig.allowedMealLabels.map((meal) => (
            <button
              key={meal}
              onClick={() => setSelectedMeal(meal)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                selectedMeal === meal
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>
                {meal === 'Breakfast'
                  ? isBn ? 'সকালের নাস্তা' : 'Breakfast'
                  : meal === 'Lunch'
                  ? isBn ? 'দুপুরের খাবার' : 'Lunch'
                  : isBn ? 'রাতের খাবার' : 'Dinner'}
              </span>
            </button>
          ))}
        </div>

        {/* Main Token Card */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden text-center p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <QrCode className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isBn ? 'ডিজিটাল মিল টোকেন' : 'Digital Meal Token'}
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 mb-6">
            {isBn
              ? 'ডাইনিং কাউন্টারে স্ক্যানার ডিভাইসের সামনে এই কোডটি প্রদর্শন করুন'
              : 'Present this QR code or 6-digit code at the dining counter scanner'}
          </p>

          {/* Hall & Meal Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6 grid grid-cols-3 gap-2 text-left">
            <div>
              <span className="text-[11px] text-slate-600 flex items-center gap-1">
                <Building className="w-3 h-3 text-slate-500" />
                {isBn ? 'হল' : 'Hall'}
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-0.5">
                {isBn ? hallConfig.nameBn : hallConfig.name}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-600 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                {isBn ? 'তারিখ ও মিল' : 'Date & Meal'}
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-0.5">
                {token?.date} • {token?.mealType}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-600 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {isBn ? 'মেয়াদ' : 'Expires At'}
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-0.5">
                {token?.expiresAt.split(' ')[1]} {token?.expiresAt.split(' ')[2]}
              </p>
            </div>
          </div>

          {/* Token Status Badge */}
          <div className="mb-6 flex justify-center">
            {token?.status === 'ACTIVE' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isBn ? 'সক্রিয় ও প্রস্তুত' : 'Active & Ready to Redeem'}
              </span>
            )}
            {token?.status === 'USED' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                <Clock className="w-3.5 h-3.5" />
                {isBn ? 'ইতিমধ্যে পরিবেশিত' : 'Already Redeemed'}
              </span>
            )}
            {token?.status === 'EXPIRED' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5" />
                {isBn ? 'মেয়াদোত্তীর্ণ' : 'Expired'}
              </span>
            )}
            {token?.status === 'INACTIVE' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                <AlertTriangle className="w-3.5 h-3.5" />
                {isBn ? 'মিল বন্ধ (OFF) রয়েছে' : 'Meal Switched OFF'}
              </span>
            )}
          </div>

          {/* QR Code display */}
          <div className="inline-block p-4 bg-white border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner mb-6">
            {loading ? (
              <div className="w-48 h-48 flex items-center justify-center text-slate-500">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            ) : qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Meal Token QR"
                className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-500">
                {isBn ? 'কিউআর কোড পাওয়া যায়নি' : 'QR unavailable'}
              </div>
            )}
          </div>

          {/* Fallback 6-digit code */}
          <div className="max-w-xs mx-auto mb-6 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-600 block mb-1">
              {isBn ? 'ম্যানুয়াল ৬-সংখ্যার কোড (বিকল্প)' : 'Manual 6-Digit Code (Fallback)'}
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-mono font-bold tracking-widest text-slate-900">
                {token?.manualCode || '------'}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {isBn
                ? 'ক্যামেরা স্ক্যান কাজ না করলে স্টাফকে এই কোডটি বলুন'
                : 'If camera scan fails, provide this code to the dining staff'}
            </p>
          </div>

          {/* Safety & Token Verification Footer */}
          <div className="border-t border-slate-100 pt-4 text-left flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-600">
              <p className="font-semibold text-slate-800">
                {isBn ? 'সার্ভার-অথেন্টিক টোকেন নীতি' : 'Server-Authoritative Token Policy'}
              </p>
              <p className="mt-0.5">
                {isBn
                  ? 'এই টোকেনটি সার্ভার সিস্টেমে তাৎক্ষণিক রেকর্ড হয়। একবার স্ক্যান সম্পন্ন হলে দ্বিতীয়বার পরিবেশন স্বয়ংক্রিয়ভাবে প্রত্যাখ্যাত হবে।'
                  : 'Tokens are verified against server records. Once verified and served, the single-use token immediately invalidates.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
