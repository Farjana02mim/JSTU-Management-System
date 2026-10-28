import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  ShieldCheck,
  Building2,
  Bell,
  GraduationCap,
  HelpCircle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../contexts/LanguageContext';

export const NotFoundPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-24 space-y-10 bg-white text-center">
      <SEOHead
        title={isBn ? 'পৃষ্ঠাটি পাওয়া যায়নি (৪০৪)' : '404 - Page Not Found'}
        description="The requested university page, circular, or document could not be located in the JSTU portal."
      />

      {/* Hero Badge & Error Title */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <span>HTTP 404 • Resource Not Located</span>
        </div>

        <h1 className="text-6xl sm:text-8xl font-black font-mono text-[#1E3A8A] tracking-tighter">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          {isBn ? 'অনুরোধকৃত পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' : 'Page Not Found or Relocated'}
        </h2>

        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
          {isBn
            ? 'আপনি যে ঠিকানাটি খুঁজছেন তা স্থানান্তরিত হয়েছে, মেয়াদ উত্তীর্ণ হয়েছে অথবা ইউআরএলটি টাইপ করতে ভুল হয়েছে।'
            : 'The document, circular, or departmental section you requested may have been archived, restructured, or an outdated URL was entered.'}
        </p>
      </div>

      {/* Quick Search on 404 */}
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? 'বিজ্ঞপ্তি, বিভাগ বা তথ্য খুঁজুন...' : 'Search campus notices or pages...'}
            className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none transition shadow-2xs"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-3 py-1.5 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-xs rounded-lg transition"
          >
            {isBn ? 'খুঁজুন' : 'Search'}
          </button>
        </form>
      </div>

      {/* Suggested Popular Hubs */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          {isBn ? 'জনপ্রিয় ও প্রয়োজনীয় বিভাগসমূহ' : 'Recommended University Destinations'}
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
          <Link
            to="/"
            className="p-3 rounded-xl border border-slate-200 hover:border-[#1E3A8A] hover:bg-blue-50/50 transition flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-[#1E3A8A]">Home</p>
              <p className="text-[10px] text-slate-500">Main portal</p>
            </div>
          </Link>

          <Link
            to="/notices"
            className="p-3 rounded-xl border border-slate-200 hover:border-[#1E3A8A] hover:bg-amber-50/50 transition flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-[#1E3A8A]">Notices</p>
              <p className="text-[10px] text-slate-500">All circulars</p>
            </div>
          </Link>

          <Link
            to="/academics"
            className="p-3 rounded-xl border border-slate-200 hover:border-[#1E3A8A] hover:bg-indigo-50/50 transition flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-[#1E3A8A]">Academics</p>
              <p className="text-[10px] text-slate-500">7 Departments</p>
            </div>
          </Link>

          <Link
            to="/admission"
            className="p-3 rounded-xl border border-slate-200 hover:border-[#1E3A8A] hover:bg-purple-50/50 transition flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-[#1E3A8A]">Admissions</p>
              <p className="text-[10px] text-slate-500">Undergrad 2026</p>
            </div>
          </Link>

          <Link
            to="/verify"
            className="p-3 rounded-xl border border-slate-200 hover:border-[#1E3A8A] hover:bg-emerald-50/50 transition flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-[#1E3A8A]">QR Verify</p>
              <p className="text-[10px] text-slate-500">Credentials ledger</p>
            </div>
          </Link>

          <Link
            to="/contact"
            className="p-3 rounded-xl border border-slate-200 hover:border-[#1E3A8A] hover:bg-sky-50/50 transition flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-[#1E3A8A]">Helpdesk</p>
              <p className="text-[10px] text-slate-500">Contact & Support</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RotateCcw className="w-4 h-4" />}
          onClick={() => window.history.back()}
        >
          {isBn ? 'পূর্ববর্তী পাতায় ফিরুন' : 'Go Back'}
        </Button>
        <Link to="/">
          <Button variant="primary" size="sm" leftIcon={<Home className="w-4 h-4" />}>
            {isBn ? 'মূলপাতায় যান' : 'Go to Homepage'}
          </Button>
        </Link>
      </div>
    </div>
  );
};
