import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Shield, Check, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const CookieConsentBanner: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('jstu_cookie_consent');
      if (!consent) {
        // Small delay so it slides in smoothly
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('jstu_cookie_consent', 'accepted_all');
    } catch {}
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem('jstu_cookie_consent', 'essential_only');
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent Notice"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 space-y-4 animate-slideUp text-[#0F172A]"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="text-sm font-bold text-[#0F172A]">
            {isBn ? 'কুকি ও গোপনীয়তা বিজ্ঞপ্তি' : 'Cookie & Institutional Privacy Notice'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isBn
              ? 'জেএসটিইউ পোর্টাল নিরাপদ ব্যবহারকারী অধিবেশন, ভাষা পছন্দ এবং পেপারলেস সেবা পরিচালনার জন্য প্রয়োজনীয় কুকি ব্যবহার করে। কোনো বাণিজ্যিক ট্র্যাকার নেই।'
              : 'JSTU Smart Campus uses essential browser storage to maintain secure role authentication, language preferences, and clearance ledgers. We do not sell or track commercial data.'}
          </p>
        </div>
        <button
          onClick={handleEssentialOnly}
          className="text-slate-400 hover:text-slate-600 p-1"
          aria-label="Dismiss cookie banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
        <Link
          to="/privacy"
          className="text-xs font-semibold text-[#1E3A8A] hover:underline"
        >
          {isBn ? 'নীতিমালা পড়ুন' : 'Read Policy'}
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleEssentialOnly}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition cursor-pointer text-xs"
          >
            {isBn ? 'প্রয়োজনীয় মাত্র' : 'Essential Only'}
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-3 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-blue-900 text-white font-semibold shadow-2xs transition cursor-pointer text-xs"
          >
            {isBn ? 'সম্মত আছি' : 'Accept All'}
          </button>
        </div>
      </div>
    </aside>
  );
};
