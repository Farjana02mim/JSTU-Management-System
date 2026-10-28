import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  Globe,
  ShieldCheck,
  GraduationCap,
  Search
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { UniversityLogo } from './UniversityLogo';
import { GlobalSearchModal } from './GlobalSearchModal';
import { departmentsData } from '../../data/seedData';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcut for universal search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change or click outside
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isBn = language === 'bn';

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header
      ref={dropdownRef}
      className={`sticky top-0 z-40 w-full transition-all duration-200 bg-white ${
        scrolled
          ? 'shadow-[0_1px_3px_0_rgb(0_0_0/0.05)] border-b border-[#E2E8F0]'
          : 'border-b border-[#E2E8F0]'
      }`}
    >
      {/* Institutional Top Strip: Clean Light Neutral */}
      <div className="bg-[#F8FAFC] text-slate-600 text-xs py-1.5 px-3 sm:px-8 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-[#0F172A] truncate hidden sm:inline">
              {isBn ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়' : 'Jamalpur Science & Technology University (JSTU)'}
            </span>
            <span className="text-slate-300 hidden md:inline">·</span>
            <span className="text-[#B45309] font-mono text-[10px] sm:text-[11px] font-bold truncate">
              Jamalpur-2012
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 text-xs shrink-0">
            <Link
              to="/verify"
              className="flex items-center gap-1 sm:gap-1.5 text-slate-600 hover:text-[#1E3A8A] font-medium transition-colors text-[11px] sm:text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{isBn ? 'সনদ যাচাই' : 'Verify'}</span>
            </Link>
            <span className="text-slate-300">|</span>
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-slate-600 hover:text-[#1E3A8A] transition-colors cursor-pointer font-medium text-[11px] sm:text-xs"
              aria-label="Toggle language between English and Bangla"
            >
              <Globe className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span className="font-semibold">{isBn ? 'EN' : 'বাং'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-8 h-16 sm:h-18 flex items-center justify-between gap-2">
        {/* Brand Wordmark */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 min-w-0 group focus-visible:outline-none">
          <UniversityLogo size={38} className="shrink-0 transition-transform group-hover:scale-105" />
          <div className="flex flex-col min-w-0">
            <span className="text-base sm:text-xl font-extrabold tracking-tight text-[#0F172A] leading-tight truncate">
              JSTU <span className="text-[#1E3A8A] font-semibold">Smart Campus</span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 tracking-wide font-medium truncate">
              {isBn ? 'কাগজবিহীন বিশ্ববিদ্যালয়' : 'Paperless University System'}
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-700">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg hover:text-[#1E3A8A] transition-colors ${
              location.pathname === '/' ? 'text-[#1E3A8A] font-bold bg-[#EFF6FF]' : ''
            }`}
          >
            {t('nav.home')}
          </Link>

          {/* About Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('about')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:text-[#1E3A8A] transition-colors cursor-pointer ${
                location.pathname.startsWith('/about') ? 'text-[#1E3A8A] font-bold bg-[#EFF6FF]' : ''
              }`}
              aria-expanded={activeDropdown === 'about'}
            >
              <span>{t('nav.about')}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'about' ? 'rotate-180 text-[#1E3A8A]' : ''}`} />
            </button>

            {activeDropdown === 'about' && (
              <div className="absolute left-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in-50 duration-150">
                <Link
                  to="/about"
                  onClick={() => setActiveDropdown(null)}
                  className="block px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-[#1E3A8A] border-b border-[#E2E8F0] mb-1"
                >
                  {isBn ? 'বিশ্ববিদ্যালয় পরিচিতি' : 'Institutional Overview'}
                </Link>
                <div className="space-y-0.5 text-xs">
                  <Link
                    to="/about?tab=history"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center px-3 py-2 rounded-xl text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                  >
                    {isBn ? 'ইতিহাস ও ঐতিহ্য' : 'History & Heritage'}
                  </Link>
                  <Link
                    to="/about?tab=vision"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center px-3 py-2 rounded-xl text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                  >
                    {isBn ? 'রূপকল্প ও অভিলক্ষ্য' : 'Vision & Mission'}
                  </Link>
                  <Link
                    to="/about?tab=vc-message"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center px-3 py-2 rounded-xl text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                  >
                    {isBn ? 'উপাচার্যের বাণী' : "Vice Chancellor's Message"}
                  </Link>
                  <Link
                    to="/about?tab=authorities"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center px-3 py-2 rounded-xl text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                  >
                    {isBn ? 'বিশ্ববিদ্যালয় কর্তৃপক্ষ' : 'Statutory Authorities'}
                  </Link>
                  <Link
                    to="/about?tab=organogram"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center px-3 py-2 rounded-xl text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                  >
                    {isBn ? 'সাংগঠনিক কাঠামো' : 'Organogram'}
                  </Link>
                  <Link
                    to="/about?tab=campus"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center px-3 py-2 rounded-xl text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                  >
                    {isBn ? 'ক্যাম্পাস ও অবকাঠামো' : 'Campus & Facilities'}
                  </Link>
                  <Link
                    to="/about?tab=charter"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center px-3 py-2 rounded-xl text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                  >
                    {isBn ? 'নাগরিক সনদ' : "Citizen's Charter"}
                  </Link>
                  <Link
                    to="/about?tab=contact"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center px-3 py-2 rounded-xl text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                  >
                    {isBn ? 'যোগাযোগ নির্দেশিকা' : 'Contact Directory'}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Academics Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('academics')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:text-[#1E3A8A] transition-colors cursor-pointer ${
                location.pathname.startsWith('/academics') ? 'text-[#1E3A8A] font-bold bg-[#EFF6FF]' : ''
              }`}
              aria-expanded={activeDropdown === 'academics'}
            >
              <span>{t('nav.academics')}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'academics' ? 'rotate-180 text-[#1E3A8A]' : ''}`} />
            </button>

            {activeDropdown === 'academics' && (
              <div className="absolute left-0 mt-2 w-72 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in-50 duration-150">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] mb-1 px-1">
                  <Link
                    to="/academics"
                    onClick={() => setActiveDropdown(null)}
                    className="block px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#1E3A8A]"
                  >
                    {isBn ? 'একাডেমিক হাব' : 'Academics'}
                  </Link>
                  <Link
                    to="/faculties"
                    onClick={() => setActiveDropdown(null)}
                    className="block px-2 py-1.5 text-xs font-bold text-[#1E3A8A] hover:underline"
                  >
                    {isBn ? '৬টি অনুষদ →' : '6 Faculties →'}
                  </Link>
                </div>

                <div className="space-y-0.5">
                  {departmentsData.map((dept) => (
                    <Link
                      key={dept.id}
                      to={`/academics/department/${dept.id}`}
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A] transition-colors"
                    >
                      <span className="truncate">{isBn ? dept.nameBn : dept.name}</span>
                      <span className="font-mono text-[10px] text-slate-400 font-semibold">{dept.code}</span>
                    </Link>
                  ))}
                </div>
                <div className="pt-2 border-t border-[#E2E8F0] mt-1 space-y-0.5">
                  <Link
                    to="/academics/calendar"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1E3A8A] hover:bg-[#EFF6FF] transition-colors"
                  >
                    <span>{isBn ? 'একাডেমিক ক্যালেন্ডার ২০২৬' : 'Academic Calendar 2026'}</span>
                    <span className="text-[10px] text-slate-400">PDF</span>
                  </Link>
                  <Link
                    to="/academics/routine"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1E3A8A] hover:bg-[#EFF6FF] transition-colors"
                  >
                    <span>{isBn ? 'সাপ্তাহিক ক্লাস রুটিন' : 'Weekly Class Routine'}</span>
                    <span className="text-[10px] text-slate-400">Timetable</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/administration"
            className={`px-3 py-2 rounded-lg hover:text-[#1E3A8A] transition-colors ${
              location.pathname === '/administration' ? 'text-[#1E3A8A] font-bold bg-[#EFF6FF]' : ''
            }`}
          >
            {t('nav.administration')}
          </Link>

          <Link
            to="/notices"
            className={`px-3 py-2 rounded-lg hover:text-[#1E3A8A] transition-colors ${
              location.pathname.startsWith('/notices') ? 'text-[#1E3A8A] font-bold bg-[#EFF6FF]' : ''
            }`}
          >
            {t('nav.notices')}
          </Link>

          <Link
            to="/admission"
            className={`px-3 py-2 rounded-lg hover:text-[#1E3A8A] transition-colors ${
              location.pathname === '/admission' ? 'text-[#1E3A8A] font-bold bg-[#EFF6FF]' : ''
            }`}
          >
            {t('nav.admission')}
          </Link>

          <Link
            to="/library"
            className={`px-3 py-2 rounded-lg hover:text-[#1E3A8A] transition-colors ${
              location.pathname.startsWith('/library') ? 'text-[#1E3A8A] font-bold bg-[#EFF6FF]' : ''
            }`}
          >
            {isBn ? 'গ্রন্থাগার' : 'Library'}
          </Link>

          {/* Student Life Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('studentlife')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:text-[#1E3A8A] transition-colors cursor-pointer ${
                location.pathname.startsWith('/student-life') ||
                ['/halls', '/clubs', '/sports', '/medical', '/transport', '/alumni'].some((p) =>
                  location.pathname.startsWith(p)
                )
                  ? 'text-[#1E3A8A] font-bold bg-[#EFF6FF]'
                  : ''
              }`}
              aria-expanded={activeDropdown === 'studentlife'}
            >
              <span>{isBn ? 'ছাত্রজীবন' : 'Student Life'}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  activeDropdown === 'studentlife' ? 'rotate-180 text-[#1E3A8A]' : ''
                }`}
              />
            </button>

            {activeDropdown === 'studentlife' && (
              <div className="absolute left-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in-50 duration-150">
                <Link
                  to="/student-life"
                  onClick={() => setActiveDropdown(null)}
                  className="block px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-[#1E3A8A] border-b border-[#E2E8F0] mb-1"
                >
                  {isBn ? 'ক্যাম্পাস সম্প্রদায় ও সুবিধা' : 'Student Life Overview'}
                </Link>
                <Link
                  to="/student-life/halls"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                >
                  {isBn ? 'আবাসিক হল ও সিট আবেদন' : 'Residential Halls & Seats'}
                </Link>
                <Link
                  to="/student-life/clubs"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                >
                  {isBn ? 'ক্লাব ও সহশিক্ষা সংগঠন' : 'Clubs & Student Societies'}
                </Link>
                <Link
                  to="/student-life/sports"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                >
                  {isBn ? 'খেলাধুলা ও শরীরচর্চা' : 'Sports Complex & Gym'}
                </Link>
                <Link
                  to="/student-life/medical"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                >
                  {isBn ? 'মেডিকেল সেন্টার (২৪/৭)' : 'Medical Center (24/7)'}
                </Link>
                <Link
                  to="/student-life/transport"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                >
                  {isBn ? 'ক্যাম্পাস পরিবহন ও বাস' : 'Campus Bus Fleet & Routes'}
                </Link>
                <Link
                  to="/student-life/alumni"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                >
                  {isBn ? 'অ্যালামনাই অ্যাসোসিয়েশন' : 'Alumni Network (JSTUAA)'}
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/research"
            className={`px-3 py-2 rounded-lg hover:text-[#1E3A8A] transition-colors ${
              location.pathname === '/research' ? 'text-[#1E3A8A] font-bold bg-[#EFF6FF]' : ''
            }`}
          >
            {t('nav.research')}
          </Link>

          {/* Resources & Media Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('resources')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:text-[#1E3A8A] transition-colors cursor-pointer ${
                ['/news', '/events', '/gallery', '/downloads', '/career', '/tenders'].some((p) =>
                  location.pathname.startsWith(p)
                )
                  ? 'text-[#1E3A8A] font-bold bg-[#EFF6FF]'
                  : ''
              }`}
              aria-expanded={activeDropdown === 'resources'}
            >
              <span>{isBn ? 'মিডিয়া ও রিসোর্স' : 'Media & Resources'}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  activeDropdown === 'resources' ? 'rotate-180 text-[#1E3A8A]' : ''
                }`}
              />
            </button>

            {activeDropdown === 'resources' && (
              <div className="absolute left-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in-50 duration-150">
                <Link
                  to="/news"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                >
                  {isBn ? 'সংবাদ ও প্রেস বিজ্ঞপ্তি' : 'News & Press Releases'}
                </Link>
                <Link
                  to="/events"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                >
                  {isBn ? 'অনুষ্ঠান ও ক্যালেন্ডার' : 'Events & Calendar'}
                </Link>
                <Link
                  to="/gallery"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                >
                  {isBn ? 'ফটো গ্যালারি' : 'Photo Gallery'}
                </Link>
                <Link
                  to="/downloads"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                >
                  {isBn ? 'ডাউনলোড ও ফরম' : 'Downloads & Forms'}
                </Link>
                <Link
                  to="/career"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
                >
                  {isBn ? 'চাকরি ও টেন্ডার' : 'Careers & Tenders'}
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/contact"
            className={`px-3 py-2 rounded-lg hover:text-[#1E3A8A] transition-colors ${
              location.pathname === '/contact' ? 'text-[#1E3A8A] font-bold bg-[#EFF6FF]' : ''
            }`}
          >
            {t('nav.contact')}
          </Link>
        </nav>

        {/* Action Button: Search & Single Sign-On Portal */}
        <div className="hidden lg:flex items-center gap-2.5">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition cursor-pointer"
            aria-label="Universal Site Search (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xl:inline">{isBn ? 'অনুসন্ধান...' : 'Search...'}</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400 shadow-2xs">
              ⌘K
            </kbd>
          </button>

          <Link to="/login">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#1E3A8A] text-white hover:bg-[#172554] shadow-xs transition-colors cursor-pointer">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>{isBn ? 'প্রাতিষ্ঠানিক পোর্টাল লগইন' : 'Institutional Portal'}</span>
            </button>
          </Link>
        </div>

        {/* Mobile Menu & Search Buttons */}
        <div className="lg:hidden flex items-center gap-1">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="p-2 text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
            aria-label="Open search dialog"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-4 py-4 space-y-3 max-h-[85vh] overflow-y-auto shadow-xl animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1 text-sm font-medium text-slate-700">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              {t('nav.about')}
            </Link>
            <Link
              to="/academics"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              {t('nav.academics')} (7 Departments)
            </Link>
            <Link
              to="/faculties"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 pl-6 text-xs text-slate-600 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              • {isBn ? '৬টি অনুষদ' : '6 Faculties'}
            </Link>
            <Link
              to="/academics/calendar"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 pl-6 text-xs text-slate-600 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              • {isBn ? 'একাডেমিক ক্যালেন্ডার' : 'Academic Calendar'}
            </Link>
            <Link
              to="/academics/routine"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 pl-6 text-xs text-slate-600 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              • {isBn ? 'সাপ্তাহিক ক্লাস রুটিন' : 'Class Routine'}
            </Link>
            <Link
              to="/administration"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              {t('nav.administration')}
            </Link>
            <Link
              to="/notices"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              {t('nav.notices')}
            </Link>
            <Link
              to="/news"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              {isBn ? 'সংবাদ' : 'News'}
            </Link>
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              {isBn ? 'অনুষ্ঠান ও ক্যালেন্ডার' : 'Events & Calendar'}
            </Link>
            <Link
              to="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              {isBn ? 'ফটো গ্যালারি' : 'Photo Gallery'}
            </Link>
            <Link
              to="/downloads"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              {isBn ? 'ডাউনলোড' : 'Downloads'}
            </Link>
            <Link
              to="/admission"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              {t('nav.admission')}
            </Link>
            <Link
              to="/library"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A] font-semibold text-[#1E3A8A]"
            >
              {isBn ? 'কেন্দ্রীয় গ্রন্থাগার ও ই-রিসোর্স' : 'Central Library & E-Resources'}
            </Link>
            <Link
              to="/student-life"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A] font-semibold text-[#1E3A8A]"
            >
              {isBn ? 'শিক্ষার্থী জীবন ও ক্যাম্পাস' : 'Student Life & Campus'}
            </Link>
            <Link
              to="/student-life/halls"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 pl-6 text-xs text-slate-600 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              • {isBn ? 'আবাসিক হল ও সিট আবেদন' : 'Residential Halls & Seats'}
            </Link>
            <Link
              to="/student-life/clubs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 pl-6 text-xs text-slate-600 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              • {isBn ? 'ছাত্র সংগঠন ও ক্লাব' : 'Student Clubs'}
            </Link>
            <Link
              to="/student-life/sports"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 pl-6 text-xs text-slate-600 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              • {isBn ? 'খেলাধুলা ও জিমনেসিয়াম' : 'Sports & Gymnasium'}
            </Link>
            <Link
              to="/student-life/medical"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 pl-6 text-xs text-slate-600 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              • {isBn ? 'মেডিকেল সেন্টার (২৪/৭)' : 'Medical Center (24/7)'}
            </Link>
            <Link
              to="/student-life/transport"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 pl-6 text-xs text-slate-600 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              • {isBn ? 'ক্যাম্পাস পরিবহন ও বাস' : 'Campus Bus Fleet'}
            </Link>
            <Link
              to="/student-life/alumni"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 pl-6 text-xs text-slate-600 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              • {isBn ? 'অ্যালামনাই অ্যাসোসিয়েশন' : 'Alumni Network'}
            </Link>
            <Link
              to="/research"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              {t('nav.research')}
            </Link>
            <Link
              to="/career"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              {isBn ? 'ক্যারিয়ার ও টেন্ডার' : 'Careers & Tenders'}
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] hover:text-[#1E3A8A]"
            >
              {t('nav.contact')}
            </Link>
          </nav>

          <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#1E3A8A] text-white hover:bg-[#172554] shadow-xs text-center"
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>{isBn ? 'পোর্টাল লগইন' : 'Institutional Portal Login'}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Universal Search Modal */}
      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </header>
  );
};
