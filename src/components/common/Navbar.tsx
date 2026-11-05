import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  Globe,
  ShieldCheck,
  Search,
  HelpCircle,
  Briefcase,
  Bell,
  User,
  LogOut,
  ArrowRight,
  BookOpen,
  Calendar,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { UniversityLogo } from './UniversityLogo';
import { GlobalSearchModal } from './GlobalSearchModal';
import { Button } from './Button';
import { departmentsData, facultiesData, noticesSeedData, eventsData } from '../../data/seedData';

type MegaMenuKey = 'about' | 'academics' | 'admission' | 'campus-life' | 'media';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [activeMegaMenu, setActiveMegaMenu] = useState<MegaMenuKey | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isBn = language === 'bn';

  // Global keyboard shortcut for universal search (Cmd+K / Ctrl+K) & Escape to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setActiveMegaMenu(null);
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
    setUserMenuOpen(false);
    setMobileAccordion(null);
  }, [location.pathname]);

  // Handle outside click to close mega menu and user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hover handlers with debounce to prevent accidental closes
  const handleMouseEnter = (menuKey: MegaMenuKey) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMegaMenu(menuKey);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 180);
  };

  const toggleMobileAccordion = (key: string) => {
    setMobileAccordion((prev) => (prev === key ? null : key));
  };

  const getDashboardUrl = () => {
    switch (role) {
      case 'student':
        return '/student';
      case 'teacher':
        return '/teacher';
      case 'dept_chairman':
        return '/chairman';
      case 'exam_controller':
        return '/controller';
      case 'registrar':
        return '/registrar';
      case 'admin':
      case 'super_admin':
        return '/admin';
      case 'library_officer':
        return '/office/library';
      case 'account_officer':
        return '/office/accounts';
      default:
        return '/student';
    }
  };

  const latestNotice = noticesSeedData[0];
  const latestEvent = eventsData[0];

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-40 w-full bg-white transition-all duration-200 ${
        scrolled
          ? 'shadow-[0_4px_12px_rgba(0,0,0,0.06)] border-b border-[#E2E8F0]'
          : 'border-b border-[#E2E8F0]'
      }`}
    >
      {/* -------------------------------------------------------------
          1. TOP UTILITY BAR (SMALL)
          Verify, Helpdesk, Staff Area, Notification Bell, Language, User Menu
         ------------------------------------------------------------- */}
      <div className="bg-[#F8FAFC] text-slate-600 text-xs py-1.5 px-4 sm:px-8 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: University Name & Charter */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-[#0F172A] truncate hidden sm:inline">
              {isBn ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়' : 'Jamalpur Science & Technology University (JSTU)'}
            </span>
            <span className="text-slate-600 hidden md:inline">·</span>
            <span className="text-[#B45309] font-mono text-[10px] sm:text-[11px] font-bold shrink-0">
              Jamalpur-2012
            </span>
          </div>

          {/* Right: Utility Links, Notification Bell, Language, User Menu */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
            <Link
              to="/verify"
              className="hidden sm:inline-flex items-center gap-1 text-slate-600 hover:text-[#1E3A8A] font-medium transition-colors text-[11px]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{isBn ? 'সনদ যাচাই' : 'Verify'}</span>
            </Link>

            <span className="text-slate-600 hidden sm:inline">|</span>

            <Link
              to="/helpdesk"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-[#1E3A8A] font-medium transition-colors text-[11px]"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span className="hidden xs:inline">{isBn ? 'হেল্পডেস্ক' : 'Helpdesk'}</span>
            </Link>

            <span className="text-slate-600">|</span>

            <Link
              to="/staff"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-[#1E3A8A] font-semibold transition-colors text-[11px]"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{isBn ? 'স্টাফ কর্নার' : 'Staff Area'}</span>
            </Link>

            <span className="text-slate-600">|</span>

            {/* Notification Bell (Shown always or when user logged in) */}
            {user ? (
              <Link
                to={role === 'student' ? '/student/notifications' : getDashboardUrl()}
                className="relative p-1 text-slate-600 hover:text-[#1E3A8A] transition-colors rounded-md hover:bg-slate-100"
                title={isBn ? 'বিজ্ঞপ্তি' : 'Notifications'}
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute 0.5 top-0.5 right-0.5 w-1.5 h-1.5 bg-[#B45309] rounded-full" />
              </Link>
            ) : null}

            {user ? <span className="text-slate-600">|</span> : null}

            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0] hover:border-[#1E3A8A] text-slate-700 hover:text-[#1E3A8A] transition-colors cursor-pointer font-bold text-[11px] shrink-0 shadow-2xs"
              aria-label="Toggle language between English and Bangla"
            >
              <Globe className="w-3 h-3 text-[#1E3A8A]" />
              <span>{isBn ? 'EN' : 'বাং'}</span>
            </button>

            {/* User Dropdown when logged in */}
            {user && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 pl-2 pr-1.5 py-0.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A] font-semibold text-[11px] hover:bg-[#DBEAFE] transition-colors cursor-pointer"
                  aria-expanded={userMenuOpen}
                >
                  <User className="w-3 h-3" />
                  <span className="max-w-[80px] sm:max-w-[120px] truncate">{user.email?.split('@')[0]}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1.5 z-50 text-xs animate-in fade-in-50 duration-150">
                    <div className="px-3 py-1.5 border-b border-[#E2E8F0]">
                      <p className="font-bold text-[#0F172A] truncate">{user.displayName || user.email}</p>
                      <p className="text-[10px] text-slate-600 uppercase font-mono">{role}</p>
                    </div>

                    <Link
                      to={getDashboardUrl()}
                      className="flex items-center gap-2 px-3 py-2 text-[#334155] hover:bg-[#F8FAFC] hover:text-[#1E3A8A] font-medium"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#1E3A8A]" />
                      <span>{isBn ? 'আমার ড্যাশবোর্ড' : 'My Dashboard'}</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 font-medium cursor-pointer border-t border-[#E2E8F0] mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{isBn ? 'লগআউট' : 'Sign Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          2. MAIN NAVIGATION BAR
          Logo (Left), Top-Level Mega Menu Items (Middle), Search & Login (Right)
          Everything fits on ONE row at 1366px (white-space: nowrap)
         ------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark (Home via Logo) */}
        <Link
          to="/"
          className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none"
          title="JSTU Smart Campus - Home"
        >
          <UniversityLogo size={36} className="shrink-0 transition-transform group-hover:scale-105" />
          <div className="flex flex-col min-w-0">
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#0F172A] leading-tight whitespace-nowrap">
              JSTU <span className="text-[#1E3A8A] font-semibold">Smart Campus</span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-600 tracking-wide font-medium truncate">
              {isBn ? 'কাগজবিহীন বিশ্ববিদ্যালয়' : 'Paperless University System'}
            </span>
          </div>
        </Link>

        {/* Middle: Top-Level Navigation Items (Desktop Mega Menu >= 1100px) */}
        <nav
          className="hidden min-[1100px]:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-[#334155] whitespace-nowrap"
          aria-label="Main Navigation"
        >
          {/* Item 1: About (Mega Menu) */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('about')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`flex items-center gap-1 px-3 py-5 transition-colors cursor-pointer border-b-2 ${
                activeMegaMenu === 'about'
                  ? 'border-[#1E3A8A] text-[#1E3A8A]'
                  : 'border-transparent hover:text-[#1E3A8A]'
              }`}
              aria-expanded={activeMegaMenu === 'about'}
              onFocus={() => handleMouseEnter('about')}
            >
              <span>{isBn ? 'পরিচিতি' : 'About'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMegaMenu === 'about' ? 'rotate-180 text-[#1E3A8A]' : 'text-slate-600'}`} />
            </button>
          </div>

          {/* Item 2: Academics (Mega Menu) */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('academics')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`flex items-center gap-1 px-3 py-5 transition-colors cursor-pointer border-b-2 ${
                activeMegaMenu === 'academics'
                  ? 'border-[#1E3A8A] text-[#1E3A8A]'
                  : 'border-transparent hover:text-[#1E3A8A]'
              }`}
              aria-expanded={activeMegaMenu === 'academics'}
              onFocus={() => handleMouseEnter('academics')}
            >
              <span>{isBn ? 'শিক্ষা ও বিভাগ' : 'Academics'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMegaMenu === 'academics' ? 'rotate-180 text-[#1E3A8A]' : 'text-slate-600'}`} />
            </button>
          </div>

          {/* Item 3: Admission (Mega Menu) */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('admission')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`flex items-center gap-1 px-3 py-5 transition-colors cursor-pointer border-b-2 ${
                activeMegaMenu === 'admission'
                  ? 'border-[#1E3A8A] text-[#1E3A8A]'
                  : 'border-transparent hover:text-[#1E3A8A]'
              }`}
              aria-expanded={activeMegaMenu === 'admission'}
              onFocus={() => handleMouseEnter('admission')}
            >
              <span>{isBn ? 'ভর্তি' : 'Admission'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMegaMenu === 'admission' ? 'rotate-180 text-[#1E3A8A]' : 'text-slate-600'}`} />
            </button>
          </div>

          {/* Item 4: Notices (Plain Link without panel) */}
          <Link
            to="/notices"
            className="px-3 py-5 hover:text-[#1E3A8A] transition-colors border-b-2 border-transparent"
          >
            {isBn ? 'বিজ্ঞপ্তি' : 'Notices'}
          </Link>

          {/* Item 5: Campus Life (Mega Menu) */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('campus-life')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`flex items-center gap-1 px-3 py-5 transition-colors cursor-pointer border-b-2 ${
                activeMegaMenu === 'campus-life'
                  ? 'border-[#1E3A8A] text-[#1E3A8A]'
                  : 'border-transparent hover:text-[#1E3A8A]'
              }`}
              aria-expanded={activeMegaMenu === 'campus-life'}
              onFocus={() => handleMouseEnter('campus-life')}
            >
              <span>{isBn ? 'ক্যাম্পাস জীবন' : 'Campus Life'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMegaMenu === 'campus-life' ? 'rotate-180 text-[#1E3A8A]' : 'text-slate-600'}`} />
            </button>
          </div>

          {/* Item 6: Media & Resources (Mega Menu) */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('media')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`flex items-center gap-1 px-3 py-5 transition-colors cursor-pointer border-b-2 ${
                activeMegaMenu === 'media'
                  ? 'border-[#1E3A8A] text-[#1E3A8A]'
                  : 'border-transparent hover:text-[#1E3A8A]'
              }`}
              aria-expanded={activeMegaMenu === 'media'}
              onFocus={() => handleMouseEnter('media')}
            >
              <span>{isBn ? 'মিডিয়া ও তথ্য' : 'Media & Resources'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMegaMenu === 'media' ? 'rotate-180 text-[#1E3A8A]' : 'text-slate-600'}`} />
            </button>
          </div>

          {/* Item 7: Contact (Plain Link without panel) */}
          <Link
            to="/contact"
            className="px-3 py-5 hover:text-[#1E3A8A] transition-colors border-b-2 border-transparent"
          >
            {isBn ? 'যোগাযোগ' : 'Contact'}
          </Link>
        </nav>

        {/* Right: Search Icon + Portal / Login Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Universal Search Button */}
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-700 hover:text-[#1E3A8A] hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl transition-colors cursor-pointer text-xs font-semibold shadow-2xs"
            title="Search JSTU (Ctrl + K)"
            aria-label="Universal Search"
          >
            <Search className="w-4 h-4 text-[#1E3A8A]" />
            <span className="hidden sm:inline text-xs">{isBn ? 'খুঁজুন' : 'Search'}</span>
            <kbd className="hidden lg:inline text-[10px] font-mono text-slate-600 bg-slate-100 px-1 py-0.5 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Login or My Portal CTA Button */}
          {user ? (
            <Link to={getDashboardUrl()}>
              <Button
                variant="primary"
                size="sm"
                className="whitespace-nowrap font-bold"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {isBn ? 'আমার পোর্টাল' : 'My Portal'}
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button
                variant="primary"
                size="sm"
                className="whitespace-nowrap font-bold"
                leftIcon={<Lock className="w-3.5 h-3.5 text-amber-300" />}
              >
                {isBn ? 'পোর্টাল সাইন ইন' : 'Portal Login'}
              </Button>
            </Link>
          )}

          {/* Mobile Hamburger Button (visible below 1100px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="min-[1100px]:hidden p-2 rounded-xl text-[#0F172A] hover:bg-[#F8FAFC] border border-[#E2E8F0] transition-colors cursor-pointer"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          3. FULL-WIDTH MEGA MENU PANELS DIRECTLY UNDER NAVBAR
          Animation: short fade/slide, prefers-reduced-motion respected
         ------------------------------------------------------------- */}
      {activeMegaMenu && (
        <div
          className="hidden min-[1100px]:block absolute left-0 right-0 top-full w-full bg-white border-b border-[#E2E8F0] shadow-xl z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150"
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-7">
            {/* PANEL: ABOUT */}
            {activeMegaMenu === 'about' && (
              <div className="grid grid-cols-4 gap-8">
                {/* Col 1: Overview */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0] pb-2">
                    {isBn ? 'বিশ্ববিদ্যালয় পরিচিতি' : 'Overview'}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link to="/about" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'সংক্ষিপ্ত ইতিহাস ও সনদ' : 'History & Act'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/about#mission" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'লক্ষ্য ও উদ্দেশ্য' : 'Vision & Mission'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/about#vc-message" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'উপাচার্যের বাণী' : 'VC Message'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/about#authorities" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'কর্তৃপক্ষ ও প্রশাসন' : 'Authorities & Officers'}</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 2: Administration */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0] pb-2">
                    {isBn ? 'প্রশাসনিক দপ্তর' : 'Administration'}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link to="/about#offices" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'প্রশাসনিক দপ্তরসমূহ' : 'Offices & Sections'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/about#governance" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'শাসন কাঠামো (অর্গানোগ্রাম)' : 'Statutory Organogram'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/about#charter" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'সিটিজেন চার্টার' : "Citizen's Charter"}</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 3: Campus */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0] pb-2">
                    {isBn ? 'ক্যাম্পাস ও যোগাযোগ' : 'Campus & Contact'}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link to="/about#campus-map" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'ক্যাম্পাস পরিক্রমা ও মানচিত্র' : 'Campus Tour & Map'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'যোগাযোগ ডিরেক্টরি' : 'Contact Directory'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/staff" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'শিক্ষক ও কর্মকর্তা ডিরেক্টরি' : 'Faculty & Staff Directory'}</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 4: Featured Card */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E3A8A] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded inline-block">
                      {isBn ? 'প্রতিষ্ঠানিক বার্তা' : 'Statutory Notice'}
                    </span>
                    <h5 className="text-xs font-bold text-[#0F172A] leading-snug">
                      {isBn ? 'জেএসটিইউ এক নজরে' : 'Jamalpur Science & Technology University'}
                    </h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {isBn
                        ? '৫০ একরের সবুজ ক্যাম্পাসে ৬টি অনুষদ এবং ৭টি বিভাগে উচ্চশিক্ষা ও গবেষণার সমন্বয়।'
                        : 'Pioneering scientific education, applied engineering, and paperless digital administration in Bangladesh.'}
                    </p>
                  </div>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3A8A] hover:underline pt-3"
                  >
                    <span>{isBn ? 'বিস্তারিত জানুন' : 'Learn More'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* PANEL: ACADEMICS */}
            {activeMegaMenu === 'academics' && (
              <div className="grid grid-cols-4 gap-8">
                {/* Col 1: Faculties (the 6) */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0] pb-2">
                    {isBn ? 'অনুষদসমূহ (৬টি)' : 'Faculties (6)'}
                  </h4>
                  <ul className="space-y-1.5 text-xs">
                    {facultiesData.map((fac) => (
                      <li key={fac.id}>
                        <Link
                          to={`/faculties/${fac.id}`}
                          className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-0.5 transition-colors font-medium truncate"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                          <span className="truncate">{isBn ? fac.nameBn : fac.name}</span>
                        </Link>
                      </li>
                    ))}
                    <li className="pt-1">
                      <Link to="/faculties" className="text-[11px] font-bold text-[#1E3A8A] hover:underline">
                        {isBn ? 'সব অনুষদ দেখুন →' : 'View All Faculties →'}
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 2: Departments (the 7) */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0] pb-2">
                    {isBn ? 'বিভাগসমূহ (৭টি)' : 'Departments (7)'}
                  </h4>
                  <ul className="space-y-1.5 text-xs">
                    {departmentsData.map((dept) => (
                      <li key={dept.id}>
                        <Link
                          to={`/departments/${dept.id}`}
                          className="group flex items-center justify-between text-[#334155] hover:text-[#1E3A8A] py-0.5 transition-colors font-medium"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                            <span className="truncate">{isBn ? dept.nameBn : dept.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-600 shrink-0 ml-1">
                            {dept.code}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Col 3: Programs and Resources */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0] pb-2">
                    {isBn ? 'শিক্ষা সম্পদ ও সময়সূচি' : 'Programs & Resources'}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link to="/academics/calendar" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'একাডেমিক ক্যালেন্ডার' : 'Academic Calendar'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/academics/routine" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'ক্লাস রুটিন ও কক্ষ বরাদ্দ' : 'Class Routine'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/research" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'গবেষণা ও প্রকাশনা সেল' : 'Research Cell'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/research#journal" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'জেএসটিইউ জার্নাল' : 'JSTU Journal of Science'}</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 4: Featured Academic Card */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block">
                      {isBn ? 'চলতি সেমিস্টার' : 'Active Semester'}
                    </span>
                    <h5 className="text-xs font-bold text-[#0F172A] leading-snug">
                      {isBn ? 'স্প্রিং সেমিস্টার ২০২৬' : 'Spring 2026 Academic Schedule'}
                    </h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {isBn
                        ? 'ক্লাস রুটিন ও পরীক্ষার ক্যালেন্ডার অনলাইনে হালনাগাদ করা হয়েছে।'
                        : 'Download verified class schedules and semester final examination timetables.'}
                    </p>
                  </div>
                  <Link
                    to="/academics/calendar"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3A8A] hover:underline pt-3"
                  >
                    <span>{isBn ? 'ক্যালেন্ডার দেখুন' : 'View Calendar'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* PANEL: ADMISSION */}
            {activeMegaMenu === 'admission' && (
              <div className="grid grid-cols-4 gap-8">
                {/* Col 1: Programs & Eligibility */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0] pb-2">
                    {isBn ? 'প্রোগ্রাম ও যোগ্যতা' : 'Programs & Criteria'}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link to="/admission#programs" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'স্নাতক ও স্নাতকোত্তর প্রোগ্রাম' : 'Undergraduate Programs'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admission#eligibility" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'আবেদনের ন্যূনতম যোগ্যতা' : 'Eligibility Criteria'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admission#quotas" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'কোটা ও আসন বিন্যাস' : 'Seat Matrix & Quotas'}</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 2: Apply & Status */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0] pb-2">
                    {isBn ? 'আবেদন ও যাচাই' : 'Apply & Status'}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link to="/admission#apply" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'অনলাইন ভর্তি আবেদন' : 'Apply Online'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/request-account" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'আবেদন অবস্থা যাচাই' : 'Admission Request Status'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/scholarships" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'বৃত্তি ও আর্থিক সহায়তা' : 'Scholarships & Aid'}</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 3: Fees & FAQs */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0] pb-2">
                    {isBn ? 'ফি ও সহায়িকা' : 'Fees & Guidance'}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link to="/admission#fees" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'ভর্তি ও টিউশন ফি' : 'Fee Structure'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admission#faq" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'ভর্তি সম্পর্কিত প্রশ্নোত্তর' : 'Admission FAQ'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/helpdesk" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'ভর্তি হেল্পডেস্ক' : 'Admission Helpdesk'}</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 4: Featured Admission Card */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E3A8A] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded inline-block">
                      {isBn ? 'ভর্তি কার্যক্রম' : 'Undergraduate 2026'}
                    </span>
                    <h5 className="text-xs font-bold text-[#0F172A] leading-snug">
                      {isBn ? 'স্নাতক ভর্তি সার্কুলার ২০২৬' : 'GST Cluster Admission 2026'}
                    </h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {isBn
                        ? 'গুচ্ছভুক্ত বিশ্ববিদ্যালয়সমূহের ভর্তি নির্দেশিকা ও বিভাগভিত্তিক শর্তাবলী দেখুন।'
                        : 'Review department subject criteria, quota documentation, and online application portal.'}
                    </p>
                  </div>
                  <Link
                    to="/admission"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3A8A] hover:underline pt-3"
                  >
                    <span>{isBn ? 'আবেদন শুরু করুন' : 'Apply Online'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* PANEL: CAMPUS LIFE */}
            {activeMegaMenu === 'campus-life' && (
              <div className="grid grid-cols-4 gap-8">
                {/* Col 1: Residence & Facilities */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0] pb-2">
                    {isBn ? 'আবাসন ও সেবা' : 'Living & Health'}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link to="/student-life/halls" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'আবাসিক হলসমূহ' : 'Residential Halls'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/student-life/medical" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'মেডিকেল সেন্টার' : 'Medical Center'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/student-life/transport" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'পরিবহন ও বাস শিডিউল' : 'Campus Transport'}</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 2: Learning & Recreation */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0] pb-2">
                    {isBn ? 'শিক্ষা ও খেলাধুলা' : 'Recreation & Learning'}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link to="/library" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'কেন্দ্রীয় লাইব্রেরি' : 'Central Library'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/student-life/clubs" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'ক্লাব ও সাংস্কৃতিক সমিতি' : 'Clubs & Societies'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/student-life/sports" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'শারীরিক শিক্ষা ও ক্রীড়া' : 'Sports & Gymnasium'}</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 3: Graduate & Community */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0] pb-2">
                    {isBn ? 'অ্যালামনাই ও সমাবর্তন' : 'Alumni & Convocation'}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link to="/student-life/alumni" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'অ্যালামনাই নেটওয়ার্ক' : 'Alumni Association'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/convocation" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'বিশ্ববিদ্যালয় সমাবর্তন' : 'Convocation Portal'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/student-life" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'শিক্ষার্থী জীবন হাব' : 'Student Life Hub'}</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 4: Featured Campus Card */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded inline-block">
                      {isBn ? 'ক্যাম্পাস হাব' : 'Campus Hub'}
                    </span>
                    <h5 className="text-xs font-bold text-[#0F172A] leading-snug">
                      {isBn ? '৫০ একর সবুজ ক্যাম্পাস' : '50-Acre Scenic Green Campus'}
                    </h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {isBn
                        ? 'আধুনিক সেন্ট্রাল লাইব্রেরি, আবাসিক হল এবং খেলাধুলার আন্তর্জাতিক মানসম্পন্ন পরিকাঠামো।'
                        : 'Explore digital library access, sports complexes, student associations, and medical facilities.'}
                    </p>
                  </div>
                  <Link
                    to="/student-life"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3A8A] hover:underline pt-3"
                  >
                    <span>{isBn ? 'ক্যাম্পাস হাব দেখুন' : 'Explore Campus Life'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* PANEL: MEDIA & RESOURCES */}
            {activeMegaMenu === 'media' && (
              <div className="grid grid-cols-4 gap-8">
                {/* Col 1: News & Events */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0] pb-2">
                    {isBn ? 'সংবাদ ও আয়োজন' : 'News & Events'}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link to="/news" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'বিশ্ববিদ্যালয় সংবাদ' : 'University News'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/events" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'আসন্ন ইভেন্ট ও সেমিনার' : 'Campus Events'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/gallery" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'আলোকচিত্র গ্যালারি' : 'Photo Gallery'}</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 2: Publications & Downloads */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0] pb-2">
                    {isBn ? 'ডাউনলোড ও ফর্ম' : 'Downloads & Forms'}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link to="/downloads" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'অফিসিয়াল ফর্ম ও ডাউনলোড' : 'Forms & Documents'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/notices" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'বিজ্ঞপ্তি ও সার্কুলার' : 'Notices & Circulars'}</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 3: Career & Tenders */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0] pb-2">
                    {isBn ? 'ক্যারিয়ার ও টেন্ডার' : 'Career & Tenders'}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link to="/career" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'চাকরির নিয়োগ বিজ্ঞপ্তি' : 'Career Opportunities'}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/career#tenders" className="group flex items-center gap-2 text-[#334155] hover:text-[#1E3A8A] py-1 transition-colors font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1E3A8A] transition-colors shrink-0" />
                        <span>{isBn ? 'ই-টেন্ডার বিজ্ঞপ্তি' : 'Tender Notices'}</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 4: Featured Media Card */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E3A8A] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded inline-block">
                      {isBn ? 'সর্বশেষ সংবাদ' : 'Latest News'}
                    </span>
                    <h5 className="text-xs font-bold text-[#0F172A] leading-snug line-clamp-2">
                      {latestNotice ? (isBn ? latestNotice.titleBn || latestNotice.title : latestNotice.title) : 'University Circular'}
                    </h5>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-mono">
                      <Calendar className="w-3 h-3 text-[#1E3A8A]" />
                      <span>{latestNotice ? (isBn ? latestNotice.publishDateBn : latestNotice.publishDate) : 'Recent'}</span>
                    </div>
                  </div>
                  <Link
                    to="/notices"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3A8A] hover:underline pt-3"
                  >
                    <span>{isBn ? 'বিজ্ঞপ্তি দেখুন' : 'Read Notice'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          4. MOBILE DRAWER (BELOW 1100PX)
          Full-height drawer, search at top, accordions, login at bottom
         ------------------------------------------------------------- */}
      {mobileMenuOpen && (
        <div className="min-[1100px]:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Mobile Drawer Header */}
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <UniversityLogo size={32} />
                <span className="font-bold text-[#0F172A] text-sm">JSTU Smart Campus</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer"
                aria-label="Close Mobile Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-slate-600 text-xs font-medium cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#1E3A8A]" />
                  <span>{isBn ? 'পোর্টালে অনুসন্ধান করুন...' : 'Search portal courses, notices...'}</span>
                </span>
                <kbd className="text-[10px] font-mono bg-white border border-[#E2E8F0] px-1 py-0.5 rounded">⌘K</kbd>
              </button>

              {/* Accordion List */}
              <div className="divide-y divide-[#E2E8F0] border-y border-[#E2E8F0] text-sm">
                {/* 1. About */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => toggleMobileAccordion('about')}
                    className="w-full flex items-center justify-between py-2.5 font-bold text-[#0F172A] text-left cursor-pointer"
                  >
                    <span>{isBn ? 'পরিচিতি' : 'About'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'about' ? 'rotate-180 text-[#1E3A8A]' : 'text-slate-600'}`} />
                  </button>
                  {mobileAccordion === 'about' && (
                    <div className="pl-3 pb-2 space-y-2 text-xs text-[#334155]">
                      <Link to="/about" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'সংক্ষিপ্ত ইতিহাস' : 'History & Acts'}</Link>
                      <Link to="/about#mission" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'লক্ষ্য ও উদ্দেশ্য' : 'Vision & Mission'}</Link>
                      <Link to="/about#vc-message" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'উপাচার্যের বাণী' : 'VC Message'}</Link>
                      <Link to="/about#authorities" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'কর্তৃপক্ষ ও প্রশাসন' : 'Authorities'}</Link>
                      <Link to="/about#governance" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'শাসন কাঠামো' : 'Organogram'}</Link>
                      <Link to="/about#charter" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'সিটিজেন চার্টার' : "Citizen's Charter"}</Link>
                    </div>
                  )}
                </div>

                {/* 2. Academics */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => toggleMobileAccordion('academics')}
                    className="w-full flex items-center justify-between py-2.5 font-bold text-[#0F172A] text-left cursor-pointer"
                  >
                    <span>{isBn ? 'শিক্ষা ও বিভাগ' : 'Academics'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'academics' ? 'rotate-180 text-[#1E3A8A]' : 'text-slate-600'}`} />
                  </button>
                  {mobileAccordion === 'academics' && (
                    <div className="pl-3 pb-2 space-y-2 text-xs text-[#334155]">
                      <div className="font-semibold text-slate-500 uppercase text-[10px] pt-1">{isBn ? 'অনুষদসমূহ' : 'Faculties'}</div>
                      {facultiesData.map((f) => (
                        <Link key={f.id} to={`/faculties/${f.id}`} className="block py-0.5 hover:text-[#1E3A8A]">{isBn ? f.nameBn : f.name}</Link>
                      ))}
                      <div className="font-semibold text-slate-500 uppercase text-[10px] pt-2">{isBn ? 'রুটিন ও ক্যালেন্ডার' : 'Schedules'}</div>
                      <Link to="/academics/calendar" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'একাডেমিক ক্যালেন্ডার' : 'Academic Calendar'}</Link>
                      <Link to="/academics/routine" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'ক্লাস রুটিন' : 'Class Routine'}</Link>
                      <Link to="/research" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'গবেষণা সেল' : 'Research Cell'}</Link>
                    </div>
                  )}
                </div>

                {/* 3. Admission */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => toggleMobileAccordion('admission')}
                    className="w-full flex items-center justify-between py-2.5 font-bold text-[#0F172A] text-left cursor-pointer"
                  >
                    <span>{isBn ? 'ভর্তি' : 'Admission'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'admission' ? 'rotate-180 text-[#1E3A8A]' : 'text-slate-600'}`} />
                  </button>
                  {mobileAccordion === 'admission' && (
                    <div className="pl-3 pb-2 space-y-2 text-xs text-[#334155]">
                      <Link to="/admission#programs" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'স্নাতক প্রোগ্রাম' : 'Undergraduate Programs'}</Link>
                      <Link to="/admission#eligibility" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'আবেদনের যোগ্যতা' : 'Eligibility'}</Link>
                      <Link to="/admission#apply" className="block py-1 hover:text-[#1E3A8A] font-semibold text-[#1E3A8A]">{isBn ? 'অনলাইনে আবেদন' : 'Apply Online'}</Link>
                      <Link to="/request-account" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'আবেদনের অবস্থা' : 'Application Status'}</Link>
                      <Link to="/scholarships" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'বৃত্তি ও সহায়তা' : 'Scholarships & Aid'}</Link>
                    </div>
                  )}
                </div>

                {/* 4. Notices (Direct link) */}
                <div className="py-2.5">
                  <Link to="/notices" className="block font-bold text-[#0F172A] hover:text-[#1E3A8A]">
                    {isBn ? 'বিজ্ঞপ্তি' : 'Notices'}
                  </Link>
                </div>

                {/* 5. Campus Life */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => toggleMobileAccordion('campus')}
                    className="w-full flex items-center justify-between py-2.5 font-bold text-[#0F172A] text-left cursor-pointer"
                  >
                    <span>{isBn ? 'ক্যাম্পাস জীবন' : 'Campus Life'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'campus' ? 'rotate-180 text-[#1E3A8A]' : 'text-slate-600'}`} />
                  </button>
                  {mobileAccordion === 'campus' && (
                    <div className="pl-3 pb-2 space-y-2 text-xs text-[#334155]">
                      <Link to="/library" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'সেন্ট্রাল লাইব্রেরি' : 'Central Library'}</Link>
                      <Link to="/student-life/halls" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'আবাসিক হল' : 'Residential Halls'}</Link>
                      <Link to="/student-life/clubs" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'ক্লাব ও সমিতি' : 'Clubs & Societies'}</Link>
                      <Link to="/student-life/sports" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'খেলাধুলা' : 'Sports'}</Link>
                      <Link to="/student-life/medical" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'মেডিকেল সেন্টার' : 'Medical Center'}</Link>
                      <Link to="/student-life/transport" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'পরিবহন শিডিউল' : 'Campus Transport'}</Link>
                      <Link to="/student-life/alumni" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'অ্যালামনাই' : 'Alumni Association'}</Link>
                      <Link to="/convocation" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'সমাবর্তন' : 'Convocation'}</Link>
                    </div>
                  )}
                </div>

                {/* 6. Media & Resources */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => toggleMobileAccordion('media')}
                    className="w-full flex items-center justify-between py-2.5 font-bold text-[#0F172A] text-left cursor-pointer"
                  >
                    <span>{isBn ? 'মিডিয়া ও তথ্য' : 'Media & Resources'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'media' ? 'rotate-180 text-[#1E3A8A]' : 'text-slate-600'}`} />
                  </button>
                  {mobileAccordion === 'media' && (
                    <div className="pl-3 pb-2 space-y-2 text-xs text-[#334155]">
                      <Link to="/news" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'সংবাদ' : 'News'}</Link>
                      <Link to="/events" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'ইভেন্ট' : 'Events'}</Link>
                      <Link to="/gallery" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'গ্যালারি' : 'Photo Gallery'}</Link>
                      <Link to="/downloads" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'ডাউনলোড' : 'Downloads'}</Link>
                      <Link to="/career" className="block py-1 hover:text-[#1E3A8A]">{isBn ? 'ক্যারিয়ার' : 'Career'}</Link>
                    </div>
                  )}
                </div>

                {/* 7. Contact (Direct link) */}
                <div className="py-2.5">
                  <Link to="/contact" className="block font-bold text-[#0F172A] hover:text-[#1E3A8A]">
                    {isBn ? 'যোগাযোগ' : 'Contact'}
                  </Link>
                </div>
              </div>

              {/* Mobile Quick Utilities */}
              <div className="space-y-1.5 pt-2 text-xs">
                <Link
                  to="/verify"
                  className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC] text-slate-700 hover:text-[#1E3A8A]"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
                    <span>{isBn ? 'অনলাইন সনদ যাচাই' : 'Verify E-Document'}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </Link>

                <Link
                  to="/helpdesk"
                  className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC] text-slate-700 hover:text-[#1E3A8A]"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#1E3A8A]" />
                    <span>{isBn ? 'হেল্পডেস্ক ও অভিযোগ' : 'Helpdesk & Support'}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </Link>

                <Link
                  to="/staff"
                  className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC] text-slate-700 hover:text-[#1E3A8A]"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#1E3A8A]" />
                    <span>{isBn ? 'স্টাফ কর্নার ও ছুটির আবেদন' : 'Staff Area & Leave'}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </Link>
              </div>
            </div>

            {/* Mobile Drawer Bottom Actions */}
            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-2.5">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-slate-600 truncate">{user.email}</span>
                    <span className="font-mono text-[10px] bg-blue-100 text-[#1E3A8A] px-1.5 py-0.5 rounded font-bold">{role}</span>
                  </div>
                  <Link to={getDashboardUrl()} className="block">
                    <Button variant="primary" size="md" className="w-full font-bold">
                      {isBn ? 'ড্যাশবোর্ডে প্রবেশ করুন' : 'Go to Dashboard'}
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link to="/login" className="block">
                  <Button variant="primary" size="md" className="w-full font-bold" leftIcon={<Lock className="w-4 h-4 text-amber-300" />}>
                    {isBn ? 'পোর্টাল সাইন ইন' : 'Institutional Portal Login'}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Universal Search Modal (Cmd+K) */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </header>
  );
};

export default Navbar;
