import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UniversityLogo } from '../components/common/UniversityLogo';
import {
  LayoutDashboard,
  BookOpen,
  Bell,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  Clock,
  CheckCircle2,
  Award,
  Calendar,
  FileText,
  CreditCard,
  RotateCcw,
  Upload,
  Megaphone,
  CheckSquare,
  Inbox
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { getStudentDataService } from '../services/student';
import { getTeacherDataService } from '../services/teacher';
import { AIAssistantChat } from '../components/ai/AIAssistantChat';

export interface DashboardNavSubItem {
  label: string;
  labelBn: string;
  to: string;
  icon: React.ReactNode;
}

export const DashboardLayout: React.FC<{ children: React.ReactNode; portalTitle: string }> = ({
  children,
  portalTitle
}) => {
  const { user, role, signOut, idleTimeRemaining, resetIdleTimer } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const isBn = language === 'bn';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Navigation Items by Role
  const getNavItems = (): DashboardNavSubItem[] => {
    switch (role) {
      case 'student':
        return [
          { label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', to: '/student', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'My Courses', labelBn: 'আমার কোর্স', to: '/student/courses', icon: <BookOpen className="w-4 h-4" /> },
          { label: 'Central Library', labelBn: 'কেন্দ্রীয় লাইব্রেরি', to: '/library', icon: <BookOpen className="w-4 h-4" /> },
          { label: 'Applications', labelBn: 'আবেদনসমূহ', to: '/student/applications', icon: <FileText className="w-4 h-4" /> },
          { label: 'My Documents', labelBn: 'আমার সনদপত্র', to: '/student/documents', icon: <Award className="w-4 h-4" /> },
          { label: 'Digital ID Card', labelBn: 'ডিজিটাল আইডি কার্ড', to: '/student/id-card', icon: <CreditCard className="w-4 h-4" /> },
          { label: 'Attendance', labelBn: 'উপস্থিতি', to: '/student/attendance', icon: <CheckCircle2 className="w-4 h-4" /> },
          { label: 'Results & CGPA', labelBn: 'ফলাফল ও সিজিপিএ', to: '/student/results', icon: <Award className="w-4 h-4" /> },
          { label: 'Class Routine', labelBn: 'ক্লাস রুটিন', to: '/student/routine', icon: <Calendar className="w-4 h-4" /> },
          { label: 'Assignments', labelBn: 'অ্যাসাইনমেন্ট', to: '/student/assignments', icon: <FileText className="w-4 h-4" /> },
          { label: 'Fees & Payments', labelBn: 'ফি ও পেমেন্ট', to: '/student/fees', icon: <CreditCard className="w-4 h-4" /> },
          { label: 'Notifications', labelBn: 'বিজ্ঞপ্তি', to: '/student/notifications', icon: <Bell className="w-4 h-4" /> },
          { label: 'Profile', labelBn: 'প্রোফাইল', to: '/student/profile', icon: <User className="w-4 h-4" /> }
        ];
      case 'teacher':
        return [
          { label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', to: '/teacher', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'My Courses', labelBn: 'আমার কোর্সসমূহ', to: '/teacher/courses', icon: <BookOpen className="w-4 h-4" /> },
          { label: 'Take Attendance', labelBn: 'উপস্থিতি গ্রহণ', to: '/teacher/attendance', icon: <CheckSquare className="w-4 h-4" /> },
          { label: 'Assignments', labelBn: 'অ্যাসাইনমেন্ট', to: '/teacher/assignments', icon: <FileText className="w-4 h-4" /> },
          { label: 'Course Materials', labelBn: 'কোর্স ম্যাটেরিয়ালস', to: '/teacher/materials', icon: <Upload className="w-4 h-4" /> },
          { label: 'Announcements', labelBn: 'বিজ্ঞপ্তি প্রকাশ', to: '/teacher/announcements', icon: <Megaphone className="w-4 h-4" /> },
          { label: 'Marks Entry', labelBn: 'মার্কস এন্ট্রি', to: '/teacher/marks', icon: <Award className="w-4 h-4" /> },
          { label: 'Class Routine', labelBn: 'ক্লাস রুটিন', to: '/teacher/routine', icon: <Calendar className="w-4 h-4" /> },
          { label: 'Profile', labelBn: 'প্রোফাইল', to: '/teacher/profile', icon: <User className="w-4 h-4" /> }
        ];
      case 'dept_chairman':
        return [
          { label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', to: '/chairman', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Department Content', labelBn: 'বিভাগীয় কন্টেন্ট', to: '/admin/content', icon: <FileText className="w-4 h-4" /> },
          { label: 'Marks Scrutiny', labelBn: 'ফলাফল নিরীক্ষণ', to: '/chairman', icon: <Award className="w-4 h-4" /> },
          { label: 'Applications Inbox', labelBn: 'আবেদন ইনবক্স', to: '/chairman', icon: <Inbox className="w-4 h-4" /> }
        ];
      case 'exam_controller':
        return [
          { label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', to: '/office/exam_controller', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Results Register', labelBn: 'ফলাফল রেজিস্টার', to: '/office/exam_controller', icon: <Award className="w-4 h-4" /> },
          { label: 'Applications Inbox', labelBn: 'আবেদন ইনবক্স', to: '/office/exam_controller', icon: <Inbox className="w-4 h-4" /> }
        ];
      case 'registrar':
        return [
          { label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', to: '/office/registrar', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Applications Inbox', labelBn: 'আবেদন ইনবক্স', to: '/office/registrar', icon: <Inbox className="w-4 h-4" /> }
        ];
      case 'admin':
      case 'super_admin':
        return [
          { label: 'Admin Hub', labelBn: 'অ্যাডমিন হাব', to: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Content Management', labelBn: 'ওয়েবসাইট কন্টেন্ট', to: '/admin/content', icon: <FileText className="w-4 h-4" /> },
          { label: 'User Directory', labelBn: 'ব্যবহারকারী তালিকা', to: '/admin#users', icon: <BookOpen className="w-4 h-4" /> },
          { label: 'Security & Audit Logs', labelBn: 'নিরাপত্তা অডিট লগ', to: '/admin#audit-logs', icon: <BookOpen className="w-4 h-4" /> }
        ];
      case 'library_officer':
        return [
          { label: 'Circulation Desk', labelBn: 'সার্কুলেশন ডেস্ক', to: '/office/library_officer', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Central Catalog', labelBn: 'কেন্দ্রীয় ক্যাটালগ', to: '/library', icon: <BookOpen className="w-4 h-4" /> }
        ];
      default:
        return [
          { label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', to: `/office/${role || 'staff'}`, icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Office Tasks', labelBn: 'দাপ্তরিক কাজ', to: `/office/${role || 'staff'}#tasks`, icon: <BookOpen className="w-4 h-4" /> }
        ];
    }
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const handleResetDemoData = () => {
    const studentService = getStudentDataService();
    studentService.resetDemoData();
    setResetConfirmOpen(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0F172A]">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 shadow-2xs">
        {/* Left: Mobile Menu Toggle + Wordmark + Demo Badge */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-[#F8FAFC] rounded-lg cursor-pointer shrink-0"
            aria-label="Toggle navigation sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0 group">
            <UniversityLogo size={34} className="shrink-0" />
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-extrabold text-[#0F172A] leading-tight">
                JSTU <span className="text-[#1E3A8A] font-semibold">{portalTitle}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Jamalpur-2012</span>
            </div>
          </Link>

          {/* Small Demo Mode Badge */}
          <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-50 text-[#1E3A8A] border border-blue-200 rounded-md shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A] animate-pulse" />
            Demo Mode
          </span>
        </div>

        {/* Right: Idle Countdown, Reset Demo Button, Language, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Reset Demo Data button */}
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 border border-[#E2E8F0] hover:border-red-200 rounded-lg transition-colors cursor-pointer"
            title="Reset demo student data to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">{isBn ? 'রিসেট ডেমো' : 'Reset Demo'}</span>
          </button>

          {/* Idle Timeout Countdown */}
          {idleTimeRemaining !== null && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-mono font-bold animate-pulse">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{Math.floor(idleTimeRemaining / 60)}:{(idleTimeRemaining % 60).toString().padStart(2, '0')}</span>
            </div>
          )}

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-[#0F172A] hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg transition-colors cursor-pointer"
          >
            {isBn ? 'EN' : 'বাং'}
          </button>

          {/* Notification Link */}
          <Link
            to="/student/notifications"
            className="p-2 text-slate-600 hover:text-[#0F172A] hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1E3A8A] rounded-full" />
          </Link>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#F8FAFC] border border-[#E2E8F0] transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold text-xs uppercase">
                {user?.displayName ? user.displayName[0] : 'U'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-2 z-50 space-y-1 text-xs">
                <div className="p-2 border-b border-[#E2E8F0]">
                  <p className="font-bold text-[#0F172A] truncate">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-blue-50 text-[#1E3A8A] font-mono text-[10px] uppercase font-bold">
                    {role?.replace('_', ' ')}
                  </span>
                </div>

                <Link
                  to="/student/profile"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-2 text-slate-700 hover:bg-[#F8FAFC] hover:text-[#0F172A] rounded-lg"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{isBn ? 'আমার প্রোফাইল' : 'Profile Settings'}</span>
                </Link>

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    setResetConfirmOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-slate-700 hover:bg-[#F8FAFC] rounded-lg cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isBn ? 'রিসেট ডেমো ডাটা' : 'Reset Demo Data'}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer border-t border-[#E2E8F0] mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isBn ? 'সাইন আউট' : 'Sign Out'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-4 shrink-0">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
              {isBn ? 'মেন্যু নেভিগেশন' : 'Portal Navigation'}
            </span>
            {navItems.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== '/student' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-[#1E3A8A] border border-[#E2E8F0] shadow-2xs'
                      : 'text-slate-600 hover:bg-white/70 hover:text-[#0F172A]'
                  }`}
                >
                  {item.icon}
                  <span>{isBn ? item.labelBn : item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Return to Public Website */}
          <div className="pt-4 border-t border-[#E2E8F0] mt-auto">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-[#0F172A] transition-colors"
            >
              <span>{isBn ? '← পাবলিক ওয়েবসাইটে ফিরে যান' : '← Back to Public Website'}</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Slide-out Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-4/5 max-w-xs bg-white border-r border-[#E2E8F0] p-4 flex flex-col space-y-3 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <span className="font-bold text-xs uppercase text-[#1E3A8A] tracking-wider">
                  {portalTitle}
                </span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.to || (item.to !== '/student' && location.pathname.startsWith(item.to));
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive ? 'bg-[#EFF6FF] text-[#1E3A8A]' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.icon}
                      <span>{isBn ? item.labelBn : item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Content Area (Pure White with bottom padding for mobile bar) */}
        <main className="flex-1 p-4 sm:p-8 bg-white overflow-y-auto pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Student Role) */}
      {role === 'student' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E2E8F0] px-2 py-1.5 flex items-center justify-around text-xs shadow-lg">
          <Link
            to="/student"
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
              location.pathname === '/student' ? 'text-[#1E3A8A] font-bold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[9px]">{isBn ? 'হোম' : 'Home'}</span>
          </Link>
          <Link
            to="/student/courses"
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
              location.pathname.startsWith('/student/courses') ? 'text-[#1E3A8A] font-bold' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-[9px]">{isBn ? 'কোর্স' : 'Courses'}</span>
          </Link>
          <Link
            to="/student/routine"
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
              location.pathname === '/student/routine' ? 'text-[#1E3A8A] font-bold' : 'text-slate-500'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-[9px]">{isBn ? 'রুটিন' : 'Routine'}</span>
          </Link>
          <Link
            to="/student/assignments"
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
              location.pathname === '/student/assignments' ? 'text-[#1E3A8A] font-bold' : 'text-slate-500'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[9px]">{isBn ? 'কাজ' : 'Tasks'}</span>
          </Link>
          <Link
            to="/student/fees"
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
              location.pathname === '/student/fees' ? 'text-[#1E3A8A] font-bold' : 'text-slate-500'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span className="text-[9px]">{isBn ? 'ফি' : 'Fees'}</span>
          </Link>
        </nav>
      )}

      {/* Mobile Bottom Navigation Bar (Teacher Role) */}
      {role === 'teacher' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E2E8F0] px-2 py-1.5 flex items-center justify-around text-xs shadow-lg">
          <Link
            to="/teacher"
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
              location.pathname === '/teacher' ? 'text-[#1E3A8A] font-bold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[9px]">{isBn ? 'হোম' : 'Home'}</span>
          </Link>
          <Link
            to="/teacher/courses"
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
              location.pathname.startsWith('/teacher/courses') ? 'text-[#1E3A8A] font-bold' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-[9px]">{isBn ? 'কোর্স' : 'Courses'}</span>
          </Link>
          <Link
            to="/teacher/attendance"
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
              location.pathname.startsWith('/teacher/attendance') ? 'text-[#1E3A8A] font-bold' : 'text-slate-500'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span className="text-[9px]">{isBn ? 'উপস্থিতি' : 'Attendance'}</span>
          </Link>
          <Link
            to="/teacher/assignments"
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
              location.pathname.startsWith('/teacher/assignments') ? 'text-[#1E3A8A] font-bold' : 'text-slate-500'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[9px]">{isBn ? 'অ্যাসাইনমেন্ট' : 'Tasks'}</span>
          </Link>
          <Link
            to="/teacher/marks"
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
              location.pathname.startsWith('/teacher/marks') ? 'text-[#1E3A8A] font-bold' : 'text-slate-500'
            }`}
          >
            <Award className="w-4 h-4" />
            <span className="text-[9px]">{isBn ? 'মার্কস' : 'Marks'}</span>
          </Link>
        </nav>
      )}

      {/* Mobile Bottom Navigation Bar (Chairman Role) */}
      {role === 'dept_chairman' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E2E8F0] px-4 py-2 flex items-center justify-around text-xs shadow-lg">
          <Link
            to="/chairman"
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
              location.pathname === '/chairman' ? 'text-[#1E3A8A] font-bold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px] font-medium">{isBn ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
          </Link>
          <Link
            to="/chairman"
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
              location.pathname.startsWith('/chairman/sheets') ? 'text-[#1E3A8A] font-bold' : 'text-slate-500'
            }`}
          >
            <Award className="w-4 h-4" />
            <span className="text-[10px] font-medium">{isBn ? 'মার্কস নিরীক্ষণ' : 'Scrutiny'}</span>
          </Link>
        </nav>
      )}

      {/* Reset Demo Data Modal */}
      <Modal
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        title={isBn ? 'ডেমো ডাটা রিসেট নিশ্চিতকরণ' : 'Reset Demo Data'}
        description={
          isBn
            ? 'এটি লোকালস্টোরেজ থেকে সকল পরিবর্তন (জমা দেওয়া অ্যাসাইনমেন্ট, পরিশোধিত ফি) মুছে প্রাথমিক অবস্থায় ফিরিয়ে নেবে।'
            : 'This will reset all modified student state (submitted assignments, fee payments) back to the clean initial demo seed.'
        }
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <p>Are you sure you want to clear simulated local student mutations?</p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setResetConfirmOpen(false)}>
              {isBn ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button variant="primary" size="sm" onClick={handleResetDemoData}>
              {isBn ? 'রিসেট করুন' : 'Confirm Reset'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Idle Warning Modal */}
      <Modal
        isOpen={idleTimeRemaining !== null && idleTimeRemaining <= 300}
        onClose={resetIdleTimer}
        title={isBn ? 'নিষ্ক্রিয় সেশন সতর্কবার্তা' : 'Session Inactivity Warning'}
        description={
          isBn
            ? 'নিরাপত্তা নিয়মানুযায়ী ৩০ মিনিট নিষ্ক্রিয় থাকলে স্বয়ংক্রিয়ভাবে সাইন আউট হয়ে যাবে।'
            : 'For security, your institutional session will expire due to 30 minutes of inactivity.'
        }
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <p>
            You will be automatically logged out in{' '}
            <strong className="font-mono text-red-600 font-bold">
              {idleTimeRemaining ? Math.ceil(idleTimeRemaining) : 0} seconds
            </strong>.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              {isBn ? 'লগআউট' : 'Sign Out Now'}
            </Button>
            <Button variant="primary" size="sm" onClick={resetIdleTimer}>
              {isBn ? 'সেশন চালু রাখুন' : 'Stay Signed In'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Floating AI University Assistant */}
      <AIAssistantChat />
    </div>
  );
};
