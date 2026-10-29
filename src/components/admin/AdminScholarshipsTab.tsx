import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { useLanguage } from '../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import {
  Scholarship,
  ScholarshipCategory,
  IncomeRuleConfig,
  RankedScholarshipApplicant
} from '../../types/scholarship';
import {
  GraduationCap,
  Award,
  Sliders,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Eye,
  FileText,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Download,
  Send,
  Building,
  RefreshCw,
  Info
} from 'lucide-react';

interface AdminScholarshipsTabProps {
  onNotification?: (msg: { type: 'success' | 'error'; text: string }) => void;
}

export const AdminScholarshipsTab: React.FC<AdminScholarshipsTabProps> = ({ onNotification }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const storeManager = SharedDataStoreManager.getInstance();

  const [scholarships, setScholarships] = useState<Scholarship[]>(() => storeManager.getScholarships());
  const [selectedSchId, setSelectedSchId] = useState<string>(
    scholarships[0]?.id || 'sch-need-cum-merit-2026'
  );

  // Search & Filter
  const [applicantSearch, setApplicantSearch] = useState('');
  const [applicantStatusFilter, setApplicantStatusFilter] = useState<string>('ALL');

  // Configurable ranking rule state
  const [cgpaWeightPercent, setCgpaWeightPercent] = useState<number>(60);
  const [incomeCeiling, setIncomeCeiling] = useState<number>(300000);

  // Derived income weight
  const incomeWeightPercent = 100 - cgpaWeightPercent;

  // Selected applicants to publish
  const [selectedApplicantIds, setSelectedApplicantIds] = useState<string[]>([]);

  // Create Scholarship Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTitleBn, setNewTitleBn] = useState('');
  const [newCategory, setNewCategory] = useState<ScholarshipCategory>('Merit');
  const [newAmount, setNewAmount] = useState<number>(25000);
  const [newSlots, setNewSlots] = useState<number>(5);
  const [newMinCgpa, setNewMinCgpa] = useState<number>(3.5);
  const [newMaxIncome, setNewMaxIncome] = useState<number>(250000);
  const [newDeadline, setNewDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [newDescription, setNewDescription] = useState('');
  const [newEligibilityText, setNewEligibilityText] = useState(
    'Minimum CGPA required\nEnrolled undergraduate student\nNo disciplinary record'
  );

  // Inspect Application Modal State
  const [viewingApplicant, setViewingApplicant] = useState<RankedScholarshipApplicant | null>(null);
  const [applicantDetailModalOpen, setApplicantDetailModalOpen] = useState(false);

  // Publish Modal State
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const activeScholarship = useMemo(() => {
    return scholarships.find((s) => s.id === selectedSchId) || scholarships[0] || null;
  }, [scholarships, selectedSchId]);

  const rankingRule: IncomeRuleConfig = useMemo(() => {
    return {
      cgpaWeight: cgpaWeightPercent / 100,
      incomeWeight: incomeWeightPercent / 100,
      maxIncomeCeiling: incomeCeiling
    };
  }, [cgpaWeightPercent, incomeWeightPercent, incomeCeiling]);

  // Ranked applicants computed dynamically
  const rankedApplicants = useMemo(() => {
    if (!activeScholarship) return [];
    return storeManager.getScholarshipApplicants(activeScholarship.id, rankingRule);
  }, [activeScholarship, rankingRule, scholarships]);

  // Synchronize selection IDs when ranked list updates
  React.useEffect(() => {
    if (activeScholarship?.status === 'PUBLISHED' && activeScholarship.publishedRecipients) {
      // If already published, show published IDs as selected
      const publishedStudentIds = new Set(activeScholarship.publishedRecipients.map((r) => r.studentId));
      const ids = rankedApplicants
        .filter((a) => publishedStudentIds.has(a.studentId))
        .map((a) => a.applicationId);
      setSelectedApplicantIds(ids);
    } else {
      // Default select the top SELECTED applicants
      const defaultSelected = rankedApplicants
        .filter((a) => a.selectionStatus === 'SELECTED')
        .map((a) => a.applicationId);
      setSelectedApplicantIds(defaultSelected);
    }
  }, [activeScholarship, rankedApplicants]);

  const filteredApplicants = useMemo(() => {
    return rankedApplicants.filter((app) => {
      const matchSearch =
        applicantSearch.trim() === '' ||
        app.studentName.toLowerCase().includes(applicantSearch.toLowerCase()) ||
        app.studentId.toLowerCase().includes(applicantSearch.toLowerCase()) ||
        app.department.toLowerCase().includes(applicantSearch.toLowerCase()) ||
        app.applicationNumber.toLowerCase().includes(applicantSearch.toLowerCase());

      const matchStatus =
        applicantStatusFilter === 'ALL' || app.selectionStatus === applicantStatusFilter;

      return matchSearch && matchStatus;
    });
  }, [rankedApplicants, applicantSearch, applicantStatusFilter]);

  const refreshData = () => {
    const list = storeManager.getScholarships();
    setScholarships(list);
  };

  const handleToggleApplicantSelection = (id: string) => {
    if (activeScholarship?.status === 'PUBLISHED') return;
    setSelectedApplicantIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateScholarship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const eligibilityArray = newEligibilityText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const created = storeManager.createScholarship({
      title: newTitle.trim(),
      titleBn: newTitleBn.trim() || newTitle.trim(),
      category: newCategory,
      description: newDescription.trim() || 'Annual competitive institutional scholarship.',
      descriptionBn: 'বার্ষিক প্রতিযোগিতামূলক প্রাতিষ্ঠানিক শিক্ষাবৃত্তি।',
      amount: newAmount,
      amountFormatted: `৳${newAmount.toLocaleString('en-US')} / term`,
      amountFormattedBn: `৳${newAmount.toLocaleString('bn-BD')} / মেয়াদ`,
      eligibility: eligibilityArray,
      eligibilityBn: eligibilityArray,
      minimumCgpa: newMinCgpa,
      maxFamilyIncome: newCategory === 'Need-Based' ? newMaxIncome : undefined,
      deadline: new Date(newDeadline).toISOString(),
      slots: newSlots,
      status: 'OPEN'
    });

    refreshData();
    setSelectedSchId(created.id);
    setCreateModalOpen(false);

    // Reset fields
    setNewTitle('');
    setNewTitleBn('');
    setNewDescription('');

    if (onNotification) {
      onNotification({
        type: 'success',
        text: `New scholarship "${created.title}" successfully launched.`
      });
    }
  };

  const handlePublishResults = () => {
    if (!activeScholarship) return;
    setPublishing(true);

    try {
      const success = storeManager.publishScholarshipResults(
        activeScholarship.id,
        selectedApplicantIds
      );

      if (success) {
        refreshData();
        setPublishModalOpen(false);
        if (onNotification) {
          onNotification({
            type: 'success',
            text: `Scholarship results published! ${selectedApplicantIds.length} applicants approved with official grant awards.`
          });
        }
      }
    } finally {
      setPublishing(false);
    }
  };

  // Get full paperless application record for details modal
  const activePaperlessApp = useMemo(() => {
    if (!viewingApplicant) return null;
    const store = storeManager.getStore();
    return store.applications?.find((a) => a.id === viewingApplicant.applicationId) || null;
  }, [viewingApplicant]);

  const totalFundsAllocated = scholarships.reduce(
    (sum, s) => sum + s.amount * (s.publishedRecipients?.length || s.slots),
    0
  );
  const totalApplications = storeManager
    .getStore()
    .applications?.filter((a) => a.type === 'scholarship').length || 0;
  const publishedSchemes = scholarships.filter((s) => s.status === 'PUBLISHED').length;

  return (
    <div className="space-y-6">
      {/* Demo Notice Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            {isBn
              ? 'ডেমো ডেটা মোড: এটি প্রশাসনিক বৃত্তি ব্যবস্থাপনা সিমুলেটর। ফলাফল প্রকাশনা সরাসরি পেপারলেস ওয়ার্কফ্লোর সাথে সংযুক্ত।'
              : 'DEMO DATA ONLY: Administrative scholarship & grant management simulation with paperless workflow state integration.'}
          </span>
        </div>
        <span className="font-mono text-[10px] bg-amber-200/60 dark:bg-amber-900/60 px-2 py-0.5 rounded font-bold">
          WORKFLOW ENGINE v2.6
        </span>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="space-y-1">
          <span className="text-xs text-slate-500 font-medium">Active Schemes</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {scholarships.length}
          </div>
          <p className="text-[11px] text-slate-400">Institutional Grants</p>
        </Card>

        <Card padding="md" className="space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Applications</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
            {totalApplications}
          </div>
          <p className="text-[11px] text-slate-400">Through Paperless Engine</p>
        </Card>

        <Card padding="md" className="space-y-1">
          <span className="text-xs text-slate-500 font-medium">Published Gazette</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
            {publishedSchemes}
          </div>
          <p className="text-[11px] text-slate-400">Official Recipient Lists</p>
        </Card>

        <Card padding="md" className="space-y-1">
          <span className="text-xs text-slate-500 font-medium">Fund Allocation</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 tabular-nums">
            ৳{(totalFundsAllocated / 1000).toFixed(0)}k
          </div>
          <p className="text-[11px] text-slate-400">BDT Total Endowment</p>
        </Card>
      </div>

      {/* Main Management Control Panel */}
      <Card padding="lg" className="space-y-6">
        {/* Header with Scheme Selector and New Scheme Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>{isBn ? 'বৃত্তি ও অনুদান মূল্যায়ন কনসোল' : 'Scholarship Evaluation & Award Management'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {isBn
                ? 'সিজিপিএ এবং পারিবারিক আয়ের সমন্বিত নিয়মের মাধ্যমে আবেদনকারীদের র‍্যাঙ্ক করুন এবং ফলাফল প্রকাশ করুন।'
                : 'Rank applicants using configurable CGPA and financial need criteria, review endorsements, and publish official award lists.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              {isBn ? 'রিফ্রেশ' : 'Refresh'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              {isBn ? 'নতুন বৃত্তি স্কিম চালু করুন' : 'Create Scholarship Scheme'}
            </Button>
          </div>
        </div>

        {/* Scheme Selector Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {isBn ? 'নির্বাচিত বৃত্তি স্কিম' : 'Select Scholarship Scheme to Evaluate'}
            </label>
            <select
              value={selectedSchId}
              onChange={(e) => setSelectedSchId(e.target.value)}
              className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {scholarships.map((sch) => (
                <option key={sch.id} value={sch.id}>
                  {sch.title} &bull; {sch.amountFormatted} ({sch.status})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {isBn ? 'স্কিমের বর্তমান অবস্থা' : 'Scheme Status'}
            </label>
            <div className="flex items-center gap-2">
              {activeScholarship && (
                <Badge
                  variant={
                    activeScholarship.status === 'PUBLISHED'
                      ? 'success'
                      : activeScholarship.status === 'UNDER_REVIEW'
                      ? 'warning'
                      : activeScholarship.status === 'OPEN'
                      ? 'primary'
                      : 'neutral'
                  }
                  size="md"
                  className="font-bold uppercase tracking-wider"
                >
                  {activeScholarship.status}
                </Badge>
              )}
              {activeScholarship?.publishedAt && (
                <span className="text-[11px] text-slate-400">
                  Published: {new Date(activeScholarship.publishedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Active Scheme Details Summary */}
        {activeScholarship && (
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full">
                    {activeScholarship.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isBn ? activeScholarship.titleBn : activeScholarship.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn ? activeScholarship.descriptionBn : activeScholarship.description}
                </p>
              </div>

              <div className="text-right sm:shrink-0">
                <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {isBn ? activeScholarship.amountFormattedBn : activeScholarship.amountFormatted}
                </div>
                <div className="text-[11px] text-slate-400">
                  {activeScholarship.slots} {isBn ? 'টি পদবী / স্লট' : 'Allocated Slots'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Min CGPA</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {activeScholarship.minimumCgpa.toFixed(2)} / 4.00
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Max Income</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {activeScholarship.maxFamilyIncome
                    ? `৳${activeScholarship.maxFamilyIncome.toLocaleString('en-US')}`
                    : 'No Ceiling'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Deadline</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {new Date(activeScholarship.deadline).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Applicants in Queue
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {rankedApplicants.length} Candidates
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Configurable Dynamic Ranking Engine Controls */}
        <div className="bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-slate-50 dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-800/30 p-5 rounded-2xl border border-blue-100 dark:border-slate-700 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/50 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isBn ? 'ডায়নামিক র‍্যাংকিং অ্যালগরিদম কনফিগারেশন' : 'Configurable Merit & Need Ranking Formula'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {isBn
                    ? 'সরাসরি স্লাইডার টেনে সিজিপিএ ও পারিবারিক আয়ের গুরুত্ব নির্ধারণ করুন। সাথে সাথে আবেদনকারীদের স্কোর পুনর্গণনা হবে।'
                    : 'Adjust weighting sliders in real-time. The composite scores and priority ranks recalculate instantaneously.'}
                </p>
              </div>
            </div>

            <div className="font-mono text-[11px] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-slate-700 text-blue-700 dark:text-blue-300">
              Score = (CGPA &times; {cgpaWeightPercent}%) + (Need &times; {incomeWeightPercent}%)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CGPA Weight Slider */}
            <div className="space-y-2 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Academic CGPA Weight
                </span>
                <span className="font-mono font-bold text-blue-600 text-sm">
                  {cgpaWeightPercent}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={cgpaWeightPercent}
                onChange={(e) => setCgpaWeightPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[10px] text-slate-400">
                Scales student cumulative GPA (0.0 to 4.0) into a 100-point merit index.
              </p>
            </div>

            {/* Income Need Weight Slider (Auto-balanced) */}
            <div className="space-y-2 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Financial Need Weight
                </span>
                <span className="font-mono font-bold text-emerald-600 text-sm">
                  {incomeWeightPercent}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={incomeWeightPercent}
                onChange={(e) => setCgpaWeightPercent(100 - Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <p className="text-[10px] text-slate-400">
                Inverse index prioritizing verified household income deficit under the ceiling.
              </p>
            </div>

            {/* Max Income Ceiling Input */}
            <div className="space-y-2 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Annual Income Ceiling (BDT)
                </span>
                <span className="font-mono font-bold text-purple-600 text-xs">
                  ৳{incomeCeiling.toLocaleString('en-US')}
                </span>
              </div>
              <input
                type="number"
                min="50000"
                max="1000000"
                step="10000"
                value={incomeCeiling}
                onChange={(e) => setIncomeCeiling(Math.max(10000, Number(e.target.value)))}
                className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400">
                Incomes above this threshold receive 0 need points in the scoring model.
              </p>
            </div>
          </div>
        </div>

        {/* Applicant Roster Search and Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={isBn ? 'নাম, আইডি বা বিভাগ দিয়ে খুঁজুন...' : 'Search applicant name, ID, or department...'}
                value={applicantSearch}
                onChange={(e) => setApplicantSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={applicantStatusFilter}
              onChange={(e) => setApplicantStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 focus:outline-none"
            >
              <option value="ALL">{isBn ? 'সকল অবস্থা' : 'All Status'}</option>
              <option value="SELECTED">{isBn ? 'নির্বাচিত' : 'Selected (Top Rank)'}</option>
              <option value="WAITLIST">{isBn ? 'অপেক্ষমাণ' : 'Waitlist'}</option>
              <option value="INELIGIBLE">{isBn ? 'অযোগ্য' : 'Ineligible'}</option>
            </select>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="primary"
              size="sm"
              disabled={selectedApplicantIds.length === 0 || activeScholarship?.status === 'PUBLISHED'}
              onClick={() => setPublishModalOpen(true)}
              className={`font-semibold ${
                activeScholarship?.status === 'PUBLISHED'
                  ? 'bg-slate-400 cursor-not-allowed text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              leftIcon={<Award className="w-4 h-4" />}
            >
              {activeScholarship?.status === 'PUBLISHED'
                ? isBn
                  ? 'ফলাফল ইতিপূর্বে প্রকাশিত হয়েছে'
                  : 'Gazette Results Published'
                : isBn
                ? `ফলাফল প্রকাশ করুন (${selectedApplicantIds.length} জন)`
                : `Publish Awardee List (${selectedApplicantIds.length})`}
            </Button>
          </div>
        </div>

        {/* Applicants Ranking Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedApplicantIds.length > 0 &&
                      selectedApplicantIds.length ===
                        filteredApplicants.filter((a) => a.selectionStatus === 'SELECTED').length
                    }
                    disabled={activeScholarship?.status === 'PUBLISHED'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedApplicantIds(
                          filteredApplicants.map((a) => a.applicationId)
                        );
                      } else {
                        setSelectedApplicantIds([]);
                      }
                    }}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-3 px-3 w-12 text-center">Rank</th>
                <th className="py-3 px-3">Applicant & Student ID</th>
                <th className="py-3 px-3">Dept</th>
                <th className="py-3 px-3 text-right">CGPA</th>
                <th className="py-3 px-3 text-right">Annual Income</th>
                <th className="py-3 px-3 text-right">Composite Score</th>
                <th className="py-3 px-3">Workflow State</th>
                <th className="py-3 px-3 text-center">Selection Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    {isBn
                      ? 'এই স্কিমের জন্য কোনো আবেদনকারী পাওয়া যায়নি।'
                      : 'No applicants found matching the search and filter criteria.'}
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => {
                  const isChecked = selectedApplicantIds.includes(app.applicationId);
                  const isAwarded =
                    activeScholarship?.publishedRecipients?.some((r) => r.studentId === app.studentId);

                  return (
                    <tr
                      key={app.applicationId}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${
                        isChecked ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={activeScholarship?.status === 'PUBLISHED'}
                          onChange={() => handleToggleApplicantSelection(app.applicationId)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                            app.rank === 1
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : app.rank <= (activeScholarship?.slots || 3)
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {app.rank}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {isBn && app.studentNameBn ? app.studentNameBn : app.studentName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {app.studentId} &bull; {app.applicationNumber}
                        </div>
                      </td>

                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                        {app.department}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {app.cgpa.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                        ৳{app.annualIncome.toLocaleString('en-US')}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                          {app.compositeScore.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">/ 100 pts</span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {app.workflowStatus === 'APPROVED' ? (
                            <Badge variant="success" size="sm">
                              APPROVED
                            </Badge>
                          ) : app.currentStepIndex >= 1 ? (
                            <Badge variant="primary" size="sm">
                              CHAIRMAN VERIFIED
                            </Badge>
                          ) : (
                            <Badge variant="neutral" size="sm">
                              SUBMITTED
                            </Badge>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <Badge
                          variant={
                            app.selectionStatus === 'SELECTED'
                              ? 'success'
                              : app.selectionStatus === 'WAITLIST'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                          className="font-bold"
                        >
                          {app.selectionStatus}
                        </Badge>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setViewingApplicant(app);
                            setApplicantDetailModalOpen(true);
                          }}
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                        >
                          {isBn ? 'বিস্তারিত' : 'Details'}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Summary Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
          <div>
            Showing {filteredApplicants.length} applicants &bull;{' '}
            <strong className="text-slate-700 dark:text-slate-300">
              {selectedApplicantIds.length} candidate(s)
            </strong>{' '}
            currently flagged for official award distribution.
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Selected Slot
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Waitlist
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Below CGPA Cutoff
            </span>
          </div>
        </div>
      </Card>

      {/* MODAL 1: Create New Scholarship Scheme */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={isBn ? 'নতুন বৃত্তি বা অনুদান স্কিম তৈরি করুন' : 'Launch New Scholarship / Grant Scheme'}
        size="lg"
      >
        <form onSubmit={handleCreateScholarship} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Scheme Title (English) *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Bangabandhu ICT Research Fellowship"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                স্কিমের নাম (বাংলা)
              </label>
              <input
                type="text"
                value={newTitleBn}
                onChange={(e) => setNewTitleBn(e.target.value)}
                placeholder="যেমন: উপাচার্য মেধা ফেলোশিপ"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Category *</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ScholarshipCategory)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Merit">Merit Academic</option>
                <option value="Need-Based">Need-Based Financial Aid</option>
                <option value="Special">Special Endowment</option>
                <option value="District-Quota">District Quota</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Award Amount (BDT) *
              </label>
              <input
                type="number"
                required
                min="1000"
                step="1000"
                value={newAmount}
                onChange={(e) => setNewAmount(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Number of Slots (Quota) *
              </label>
              <input
                type="number"
                required
                min="1"
                max="100"
                value={newSlots}
                onChange={(e) => setNewSlots(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Minimum CGPA Requirement *
              </label>
              <input
                type="number"
                step="0.05"
                min="2.0"
                max="4.0"
                value={newMinCgpa}
                onChange={(e) => setNewMinCgpa(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Max Income Ceiling (if Need-Based)
              </label>
              <input
                type="number"
                step="10000"
                value={newMaxIncome}
                onChange={(e) => setNewMaxIncome(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Application Deadline *
              </label>
              <input
                type="date"
                required
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Description & Purpose
            </label>
            <textarea
              rows={2}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Outline eligible faculties, funding sources, and institutional aims..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Eligibility Rules (One criterion per line)
            </label>
            <textarea
              rows={3}
              value={newEligibilityText}
              onChange={(e) => setNewEligibilityText(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-blue-600 hover:bg-blue-500">
              Create & Publish to Catalogue
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Inspect Applicant & Workflow Step Trail */}
      <Modal
        isOpen={applicantDetailModalOpen}
        onClose={() => setApplicantDetailModalOpen(false)}
        title={isBn ? 'আবেদনকারী ও ওয়ার্কফ্লো অনুমোদন বিবরণ' : 'Applicant File & Workflow Endorsements'}
        size="lg"
      >
        {viewingApplicant && (
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {viewingApplicant.studentName}
                </h4>
                <div className="text-[11px] text-slate-500 font-mono">
                  ID: {viewingApplicant.studentId} &bull; Dept: {viewingApplicant.department} &bull; App #:{' '}
                  {viewingApplicant.applicationNumber}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold text-blue-600">
                  Rank #{viewingApplicant.rank}
                </div>
                <div className="text-[11px] text-slate-400">
                  Score: {viewingApplicant.compositeScore} pts
                </div>
              </div>
            </div>

            {/* Academic & Financial Data */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">CURRENT CGPA</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {viewingApplicant.cgpa.toFixed(2)} / 4.00
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ANNUAL HOUSEHOLD INCOME</span>
                <span className="font-bold text-emerald-600 text-sm">
                  ৳{viewingApplicant.annualIncome.toLocaleString('en-US')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">SELECTION PRIORITY</span>
                <Badge
                  variant={
                    viewingApplicant.selectionStatus === 'SELECTED'
                      ? 'success'
                      : viewingApplicant.selectionStatus === 'WAITLIST'
                      ? 'warning'
                      : 'danger'
                  }
                  size="sm"
                >
                  {viewingApplicant.selectionStatus}
                </Badge>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">WORKFLOW STAGE</span>
                <Badge variant="primary" size="sm">
                  Step {viewingApplicant.currentStepIndex + 1} of 2
                </Badge>
              </div>
            </div>

            {/* Application Payload details */}
            {activePaperlessApp?.payload && (
              <div className="space-y-1.5 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Applicant Statement & Financial Grounds:
                </span>
                <p className="text-slate-600 dark:text-slate-300 text-xs italic">
                  &ldquo;{activePaperlessApp.payload.reason || 'No statement provided'}&rdquo;
                </p>
                {activePaperlessApp.payload.fatherOccupation && (
                  <p className="text-[11px] text-slate-500">
                    Guardian Occupation: <strong>{activePaperlessApp.payload.fatherOccupation}</strong> &bull;{' '}
                    Family Members: <strong>{activePaperlessApp.payload.familyMembers || 4}</strong>
                  </p>
                )}
              </div>
            )}

            {/* Submitted Document Attachments */}
            {activePaperlessApp?.attachments && activePaperlessApp.attachments.length > 0 && (
              <div className="space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  Uploaded Verification Documents ({activePaperlessApp.attachments.length}):
                </span>
                <div className="space-y-1.5">
                  {activePaperlessApp.attachments.map((att: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded-lg flex items-center justify-between border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-red-500" />
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {att.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {att.size ? `${(att.size / 1024).toFixed(0)} KB` : 'Verified attachment'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Chairman Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paperless Workflow Step Trail (Chairman -> Committee/Admin -> Approved) */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Paperless Multi-Step Audit Trail:
              </span>
              <div className="space-y-2">
                {activePaperlessApp?.auditTrail?.map((audit: any, aIdx: number) => (
                  <div
                    key={aIdx}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border-l-2 border-blue-500 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {audit.actorName} ({audit.role})
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(audit.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 text-[11px]">
                      {audit.comment || 'Application step completed'}
                    </div>
                    <div className="text-[10px] font-mono text-blue-600">
                      Status: {audit.fromStatus} &rarr; {audit.toStatus}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button variant="ghost" size="sm" onClick={() => setApplicantDetailModalOpen(false)}>
                Close Window
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 3: Publish Results Gazette Confirmation */}
      <Modal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        title={isBn ? 'বৃত্তি ফলাফল ও গেজেট প্রকাশনা নিশ্চিতকরণ' : 'Confirm Official Awardee List Publication'}
        size="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1">
            <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Administrative Grant Release Order
            </div>
            <p className="text-amber-700 dark:text-amber-400 text-[11px]">
              Publishing will update the status of the scholarship to{' '}
              <strong className="font-bold">PUBLISHED</strong>, advance all {selectedApplicantIds.length}{' '}
              selected applications to <strong className="font-bold">APPROVED</strong> in the paperless
              workflow, and render the awardee register publicly on the Scholarships portal.
            </p>
          </div>

          <div className="space-y-2 border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800/50">
            <div className="font-bold text-slate-900 dark:text-white">
              Selected Awardees ({selectedApplicantIds.length} Students):
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 text-[11px]">
              {rankedApplicants
                .filter((a) => selectedApplicantIds.includes(a.applicationId))
                .map((a) => (
                  <div
                    key={a.applicationId}
                    className="p-1.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 flex justify-between items-center"
                  >
                    <span>
                      #{a.rank} {a.studentName} ({a.department})
                    </span>
                    <span className="font-mono font-bold text-emerald-600">
                      Score: {a.compositeScore}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={publishing}
              onClick={() => setPublishModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={publishing}
              onClick={handlePublishResults}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
              leftIcon={<Award className="w-4 h-4" />}
            >
              {publishing ? 'Publishing...' : 'Confirm & Publish Gazette'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
