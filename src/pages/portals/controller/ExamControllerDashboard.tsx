import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Modal } from '../../../components/common/Modal';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { ReAuthConfirmationModal } from '../../../components/common/ReAuthConfirmationModal';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  getExamControllerDataService,
  ExamControllerDashboardData,
  ControllerCourseSheetSummary
} from '../../../services/controller';
import { ApproverInbox } from '../../../components/workflow/ApproverInbox';
import { WorkflowActor } from '../../../services/workflow';
import {
  Award,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  Search,
  Filter,
  Layers,
  FileCheck,
  Building2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Inbox
} from 'lucide-react';

export const ExamControllerDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ExamControllerDashboardData | null>(null);
  const [sheets, setSheets] = useState<ControllerCourseSheetSummary[]>([]);
  const [activeSection, setActiveSection] = useState<'results' | 'applications'>('results');

  const controllerActor: WorkflowActor = {
    uid: user?.uid || 'demo_controller_01',
    email: user?.email || 'controller.demo@jstu.ac.bd',
    fullName: profile?.fullName || 'Dr. Md. Mokhlesur Rahman',
    fullNameBn: profile?.fullNameBn || 'ড. মো. মোখলেসুর রহমান',
    role: 'exam_controller',
    officeId: 'EXAM_CONTROLLER'
  };

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Bulk Publish Modal State
  const [bulkPublishModalOpen, setBulkPublishModalOpen] = useState(false);
  const [bulkPublishDept, setBulkPublishDept] = useState<string>('CSE');
  const [bulkPublishLoading, setBulkPublishLoading] = useState(false);
  const [bulkResultMsg, setBulkResultMsg] = useState<string | null>(null);
  const [bulkErrorMsg, setBulkErrorMsg] = useState<string | null>(null);

  const controllerService = getExamControllerDataService();

  const loadData = async () => {
    try {
      setLoading(true);
      setBulkErrorMsg(null);
      const [dash, list] = await Promise.all([
        controllerService.getDashboard(user?.email || 'controller.demo@jstu.ac.bd'),
        controllerService.getSheets({
          department: selectedDept,
          semester: selectedSemester,
          status: selectedStatus,
          searchQuery
        })
      ]);
      setData(dash);
      setSheets(list);
    } catch (err: unknown) {
      console.error('Failed to load Exam Controller data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDept, selectedSemester, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleBulkPublishConfirm = async () => {
    try {
      setBulkPublishLoading(true);
      setBulkErrorMsg(null);
      const actor = {
        uid: user?.uid || 'demo_controller_01',
        email: user?.email || 'controller.demo@jstu.ac.bd',
        fullName: profile?.fullName || 'Dr. Md. Mokhlesur Rahman',
        role: 'exam_controller',
        officeId: 'EXAM_CONTROLLER'
      };

      const res = await controllerService.bulkPublishDepartment(bulkPublishDept, actor);
      setBulkResultMsg(
        isBn
          ? `${bulkPublishDept} বিভাগের ${res.publishedCourses.length}টি কোর্সের ফলাফল আনুষ্ঠানিকভাবে প্রকাশ করা হয়েছে।`
          : `Successfully bulk-published ${res.publishedCourses.length} courses for Department ${bulkPublishDept} (${res.publishedCourses.join(', ')}).`
      );
      await loadData();
    } catch (err: unknown) {
      setBulkErrorMsg(err instanceof Error ? err.message : 'Failed to bulk publish courses.');
      throw err;
    } finally {
      setBulkPublishLoading(false);
    }
  };

  return (
    <DashboardLayout portalTitle={isBn ? 'পরীক্ষা নিয়ন্ত্রক দপ্তর' : 'Office of Exam Controller'}>
      <div className="space-y-6">
        {/* Top Official Banner */}
        <div className="p-6 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] text-white rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                Official Examination Authority &bull; Central Secretariat
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {isBn ? 'পরীক্ষা নিয়ন্ত্রকের দপ্তর — ফলাফল প্রকাশনা' : 'Controller of Examinations Portal'}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              {isBn
                ? `কর্মকর্তা: ${profile?.fullNameBn || 'ড. মো. মোখলেসুর রহমান'} (পরীক্ষা নিয়ন্ত্রক)। বিভাগীয় চেয়ারম্যানদের অনুমোদিত মার্কস শিট প্রকাশ, প্রত্যাবর্তন এবং আনুষ্ঠানিক ফলাফল রেজিস্টার।`
                : `Officer: ${profile?.fullName || 'Dr. Md. Mokhlesur Rahman'} (Controller of Examinations). Publish, return, and audit university results.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBulkPublishDept('CSE');
                setBulkPublishModalOpen(true);
              }}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              leftIcon={<Layers className="w-4 h-4" />}
            >
              {isBn ? 'বিভাগভিত্তিক একযোগে প্রকাশ' : 'Bulk Publish Department'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              {isBn ? 'রিফ্রেশ' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Global Alert Messages */}
        {bulkResultMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{bulkResultMsg}</span>
            </div>
            <button onClick={() => setBulkResultMsg(null)} className="text-slate-400 hover:text-slate-600 text-xs">
              &times;
            </button>
          </div>
        )}

        {/* Section Switcher Tabs */}
        <div className="flex border-b border-[#E2E8F0] gap-4">
          <button
            onClick={() => setActiveSection('results')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'results'
                ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{isBn ? 'ফলাফল রেজিস্টার' : 'Results Register'}</span>
          </button>

          <button
            onClick={() => setActiveSection('applications')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'applications'
                ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>{isBn ? 'পেপারলেস আবেদন ইনবক্স' : 'Paperless Applications Inbox'}</span>
          </button>
        </div>

        {activeSection === 'applications' ? (
          <ApproverInbox actor={controllerActor} portalTitle="Controller of Examinations" />
        ) : (
          <>
            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <SkeletonLoader key={i} variant="rectangular" className="h-24 rounded-2xl" />
                  ))}
                </div>
                <SkeletonLoader variant="rectangular" className="h-72 rounded-2xl" />
              </div>
            )}

        {/* Metric Cards */}
        {!loading && data && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card padding="md" className="border-l-4 border-l-amber-500 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {isBn ? 'প্রকাশের অপেক্ষায়' : 'Awaiting Publication'}
              </span>
              <div className="text-3xl font-black text-amber-600 font-mono">
                {data.awaitingPublicationCount}
              </div>
              <p className="text-[11px] text-slate-400">
                {isBn ? 'চেয়ারম্যান কর্তৃক অনুমোদিত কোর্স' : 'Sheets verified by Chairman'}
              </p>
            </Card>

            <Card padding="md" className="border-l-4 border-l-emerald-600 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {isBn ? 'প্রকাশিত ফলাফল' : 'Published Results'}
              </span>
              <div className="text-3xl font-black text-emerald-600 font-mono">
                {data.publishedCount}
              </div>
              <p className="text-[11px] text-slate-400">
                {isBn ? 'শিক্ষার্থীদের জন্য সক্রিয়' : 'Live & immutable on Student Portal'}
              </p>
            </Card>

            <Card padding="md" className="border-l-4 border-l-blue-600 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {isBn ? 'বিভাগীয় নিরীক্ষাধীন' : 'Under Verification'}
              </span>
              <div className="text-3xl font-black text-blue-600 font-mono">
                {data.submittedCount}
              </div>
              <p className="text-[11px] text-slate-400">
                {isBn ? 'চেয়ারম্যানের কাছে জমা' : 'Submitted to Department Chairman'}
              </p>
            </Card>

            <Card padding="md" className="border-l-4 border-l-purple-600 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {isBn ? 'সংশোধন আবেদন' : 'Pending Corrections'}
              </span>
              <div className="text-3xl font-black text-purple-600 font-mono">
                {data.pendingCorrectionsCount}
              </div>
              <p className="text-[11px] text-slate-400">
                {isBn ? 'প্রকাশিত শিটের সংশোধন' : 'Requests on published versions'}
              </p>
            </Card>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <Card padding="md" className="bg-white border-[#E2E8F0] shadow-2xs space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'কোর্স কোড, শিরোনাম বা শিক্ষক খুঁজুন...' : 'Search course code, title, instructor...'}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
              />
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                {isBn ? 'বিভাগ:' : 'Dept:'}
              </span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="text-xs p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
              >
                <option value="all">{isBn ? 'সকল বিভাগ' : 'All Departments'}</option>
                <option value="CSE">CSE</option>
                <option value="EEE">EEE</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                {isBn ? 'স্ট্যাটাস:' : 'Status:'}
              </span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
              >
                <option value="all">{isBn ? 'সকল স্ট্যাটাস' : 'All Statuses'}</option>
                <option value="VERIFIED">{isBn ? 'VERIFIED (প্রকাশযোগ্য)' : 'VERIFIED (Awaiting Publish)'}</option>
                <option value="PUBLISHED">{isBn ? 'PUBLISHED (প্রকাশিত)' : 'PUBLISHED (Live)'}</option>
                <option value="SUBMITTED">{isBn ? 'SUBMITTED (চেয়ারম্যানের কাছে)' : 'SUBMITTED'}</option>
                <option value="DRAFT">{isBn ? 'DRAFT (খসড়া)' : 'DRAFT'}</option>
              </select>
            </div>

            <Button type="submit" variant="primary" size="sm" leftIcon={<Filter className="w-3.5 h-3.5" />}>
              {isBn ? 'ফিল্টার' : 'Filter'}
            </Button>
          </form>
        </Card>

        {/* Results Register Table */}
        <Card padding="none" className="bg-white border-[#E2E8F0] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                {isBn ? 'কেন্দ্রীয় ফলাফল রেজিস্টার ও প্রকাশনা তালিকা' : 'Central Results Register & Publication Roster'}
              </h2>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'বিশ্ববিদ্যালয়ের সকল একাডেমিক কোর্সের মার্কস লাইফসাইকেল ট্র্যাকার।'
                  : 'Complete marks tabulation lifecycle registry for Jamalpur Science & Technology University.'}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Showing {sheets.length} Courses
            </span>
          </div>

          {sheets.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<Award className="w-8 h-8 text-slate-400" />}
                title={isBn ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No result sheets matched'}
                description={isBn ? 'আপনার সার্চ বা ফিল্টার শর্তাবলী পরিবর্তন করে চেষ্টা করুন।' : 'Try adjusting your search criteria or status filter.'}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-3">Dept &bull; Semester</th>
                    <th className="py-3 px-3">Instructor</th>
                    <th className="py-3 px-3 text-center">Version</th>
                    <th className="py-3 px-3 text-center">Enrolled</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Corrections</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] font-medium text-slate-700">
                  {sheets.map((sheet) => {
                    const isVerified = sheet.status === 'VERIFIED';
                    const isPublished = sheet.status === 'PUBLISHED';

                    return (
                      <tr key={sheet.courseCode} className="hover:bg-[#F8FAFC]">
                        <td className="py-3 px-4">
                          <Link
                            to={`/office/exam_controller/sheets/${sheet.courseCode}`}
                            className="font-mono font-bold text-[#1E3A8A] hover:underline block"
                          >
                            {sheet.courseCode}
                          </Link>
                          <span className="text-[11px] text-slate-500 block truncate max-w-xs">
                            {isBn ? sheet.courseTitleBn : sheet.courseTitle}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-800">{sheet.department}</span>
                          <span className="text-[11px] text-slate-400 block">{sheet.semester}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-slate-800 font-medium">{sheet.instructorName}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{sheet.instructorEmail}</span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-bold">
                            v{sheet.currentVersion}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono">
                          {sheet.enrolledCount}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              isPublished
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : isVerified
                                ? 'bg-amber-50 text-amber-800 border border-amber-200 font-extrabold'
                                : sheet.status === 'SUBMITTED'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : sheet.status === 'RETURNED_TO_TEACHER'
                                ? 'bg-red-50 text-red-800 border border-red-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isPublished && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {isVerified && <Clock className="w-3 h-3 text-amber-600" />}
                            <span>{sheet.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {sheet.pendingCorrectionsCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 animate-pulse">
                              {sheet.pendingCorrectionsCount} Pending
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">0</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant={isVerified ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => navigate(`/office/exam_controller/sheets/${sheet.courseCode}`)}
                            leftIcon={isVerified ? <Send className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                          >
                            {isVerified
                              ? (isBn ? 'রিভিউ ও প্রকাশ' : 'Review & Publish')
                              : (isBn ? 'বিস্তারিত দেখুন' : 'View Sheet')}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Bulk Publish Department Confirmation Modal */}
        <Modal
          isOpen={bulkPublishModalOpen}
          onClose={() => setBulkPublishModalOpen(false)}
          title={isBn ? 'বিভাগভিত্তিক একযোগে ফলাফল প্রকাশ' : 'Bulk Publish Department Results'}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-amber-900">
                <p className="font-bold">
                  {isBn ? 'সতর্কতা: এটি একটি সংবেদনশীল প্রাতিষ্ঠানিক ধাপ' : 'Institutional Caution: Irreversible Publication'}
                </p>
                <p className="text-amber-800">
                  {isBn
                    ? 'নির্বাচিত বিভাগের সকল VERIFIED কোর্স অবিলম্বে PUBLISHED হিসেবে নিবন্ধিত হবে এবং শিক্ষার্থীদের পোর্টালে সরাসরি দৃশ্যমান হবে।'
                    : 'All VERIFIED marks sheets for this department will transition to PUBLISHED immediately. Results will become live and immutable.'}
                </p>
              </div>
            </div>

            {bulkErrorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {bulkErrorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                {isBn ? 'বিভাগ নির্বাচন করুন:' : 'Select Target Department:'}
              </label>
              <select
                value={bulkPublishDept}
                onChange={(e) => setBulkPublishDept(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white font-bold"
              >
                <option value="CSE">Computer Science & Engineering (CSE)</option>
                <option value="EEE">Electrical & Electronic Engineering (EEE)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkPublishModalOpen(false)}
                disabled={bulkPublishLoading}
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={async () => {
                  await handleBulkPublishConfirm();
                  setBulkPublishModalOpen(false);
                }}
                isLoading={bulkPublishLoading}
              >
                {isBn ? 'নিশ্চিত ও একযোগে প্রকাশ করুন' : 'Confirm Bulk Publish'}
              </Button>
            </div>
          </div>
        </Modal>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
