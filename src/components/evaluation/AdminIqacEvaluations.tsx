import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { useLanguage } from '../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { EvaluationWindow } from '../../types/evaluation';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import {
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Lock,
  Unlock,
  ShieldCheck,
  TrendingUp,
  Users,
  Building2,
  Star
} from 'lucide-react';

const DEPT_COLORS: Record<string, string> = {
  CSE: '#006A4E',
  EEE: '#0284C7',
  MATH: '#7C3AED',
  FISH: '#059669',
  GEOL: '#D97706',
  MGT: '#EA580C',
  SOC: '#DB2777'
};

export const AdminIqacEvaluations: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const storeManager = SharedDataStoreManager.getInstance();

  const [windows, setWindows] = useState<EvaluationWindow[]>([]);
  const [selectedWindowId, setSelectedWindowId] = useState<string>('');
  const [analytics, setAnalytics] = useState<ReturnType<typeof storeManager.getUniversityEvaluationAnalytics> | null>(null);

  // New window modal
  const [isWindowModalOpen, setIsWindowModalOpen] = useState(false);
  const [newSemesterName, setNewSemesterName] = useState('Fall 2026 (July - Dec)');
  const [newAcademicSession, setNewAcademicSession] = useState('2024-2025');
  const [newClosesAt, setNewClosesAt] = useState('2026-12-15');

  const refreshData = () => {
    const allWindows = storeManager.getEvaluationWindows();
    setWindows(allWindows);

    const winId = selectedWindowId || allWindows[0]?.id || '';
    if (!selectedWindowId && winId) {
      setSelectedWindowId(winId);
    }

    if (winId) {
      const stats = storeManager.getUniversityEvaluationAnalytics(winId);
      setAnalytics(stats);
    }
  };

  useEffect(() => {
    refreshData();
  }, [selectedWindowId]);

  const activeWindow = windows.find((w) => w.id === selectedWindowId);

  const handleOpenNewWindow = () => {
    if (!newSemesterName.trim() || !newAcademicSession.trim() || !newClosesAt) return;

    storeManager.openEvaluationWindow({
      semester: newSemesterName.trim(),
      academicSession: newAcademicSession.trim(),
      startDate: new Date().toISOString(),
      endDate: new Date(newClosesAt).toISOString()
    });

    setIsWindowModalOpen(false);
    refreshData();
  };

  const handleCloseActiveWindow = (winId: string) => {
    if (window.confirm(isBn ? 'আপনি কি নিশ্চিত যে এই মূল্যায়ন উইন্ডোটি বন্ধ করতে চান? এর ফলে শিক্ষকরা ফলাফল দেখতে পাবেন।' : 'Are you sure you want to close this evaluation window? Teachers will now be able to view aggregate results for courses with ≥ 5 responses.')) {
      storeManager.closeEvaluationWindow(winId);
      refreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Window Operations */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-[#EBF5FF] text-[#006A4E] rounded-md">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#0F172A]">
              {isBn ? 'আইকিউএসি কোর্স ও শিক্ষক মূল্যায়ন ড্যাশবোর্ড' : 'IQAC University-Wide Teaching Evaluation Analytics'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#475569]">
            {isBn
              ? 'বিশ্ববিদ্যালয়ব্যাপী পাঠদান মূল্যায়ন, অনুষদ বিশ্লেষণ ও প্রাতিষ্ঠানিক উইন্ডো ব্যবস্থাপনা।'
              : 'Institutional Quality Assurance Cell (IQAC) evaluation windows, department benchmarks, and student feedback analytics.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <label htmlFor="iqac-window-select" className="text-xs font-semibold text-[#475569] shrink-0">
              {isBn ? 'সেশন:' : 'Session:'}
            </label>
            <select
              id="iqac-window-select"
              aria-label="Evaluation Session Selector"
              value={selectedWindowId}
              onChange={(e) => setSelectedWindowId(e.target.value)}
              className="px-3 py-1.5 text-xs sm:text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[#0F172A] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#006A4E]"
            >
              {windows.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.semester} ({w.academicSession}) — {w.status}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsWindowModalOpen(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {isBn ? 'নতুন উইন্ডো খুলুন' : 'Open New Window'}
          </Button>
        </div>
      </div>

      {/* Active Window Management Card */}
      {activeWindow && (
        <Card className="p-4 sm:p-5 border border-[#E2E8F0] bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#0F172A]">
                  {activeWindow.semester} ({activeWindow.academicSession})
                </span>
                <Badge variant={activeWindow.status === 'Open' ? 'success' : 'neutral'}>
                  {activeWindow.status === 'Open' ? (isBn ? 'উন্মুক্ত (সক্রিয়)' : 'Active Open') : (isBn ? 'সমাপ্ত' : 'Closed')}
                </Badge>
              </div>
              <p className="text-xs text-[#64748B]">
                {isBn ? 'শুরু:' : 'Opened:'} {new Date(activeWindow.startDate).toLocaleDateString()} •{' '}
                {isBn ? 'সমাপ্তি:' : 'Closing:'} {new Date(activeWindow.endDate).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {activeWindow.status === 'Open' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCloseActiveWindow(activeWindow.id)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 text-xs"
                >
                  <Lock className="w-3.5 h-3.5 mr-1.5" />
                  {isBn ? 'উইন্ডো বন্ধ করুন (ফলাফল প্রকাশ)' : 'Close Window & Publish Results'}
                </Button>
              ) : (
                <div className="text-xs text-[#006A4E] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isBn ? 'ফলাফল শিক্ষকদের নিকট দৃশ্যমান (≥৫)' : 'Aggregates Unsealed for Teachers (≥5)'}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* University Metric Summary Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 border border-[#E2E8F0] bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                {isBn ? 'বিশ্ববিদ্যালয় সার্বিক গড়' : 'University Overall Rating'}
              </span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#0F172A]">
                {analytics.overallAverage.toFixed(2)}
              </span>
              <span className="text-xs text-[#64748B]">/ 5.00</span>
            </div>
            <div className="mt-2">
              <Badge variant="success">IQAC Benchmark Standard</Badge>
            </div>
          </Card>

          <Card className="p-5 border border-[#E2E8F0] bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                {isBn ? 'মোট সংগৃহীত মূল্যায়ন' : 'Total Anonymous Evaluations'}
              </span>
              <div className="p-2 bg-emerald-50 text-[#006A4E] rounded-lg">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#0F172A]">
                {analytics.totalEvaluations}
              </span>
              <span className="text-xs text-[#64748B]">{isBn ? 'টি প্রতিক্রিয়া' : 'submissions'}</span>
            </div>
            <div className="mt-2">
              <Badge variant="neutral">Across 7 Academic Departments</Badge>
            </div>
          </Card>

          <Card className="p-5 border border-[#E2E8F0] bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                {isBn ? 'গোপনীয়তা ও তথ্য নিরাপত্তা' : 'Anonymity Ledger Status'}
              </span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-base font-bold text-[#0F172A] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#006A4E]" />
                Zero Student Linkage
              </span>
              <p className="text-xs text-[#64748B] mt-1">
                {isBn
                  ? 'উত্তরের সাথে কোনো আইডি বা পরিচয় সংরক্ষিত হয় না।'
                  : 'Detached submission flag with unlinked answers.'}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* RECHARTS SECTION */}
      {analytics && (
        <div className="space-y-6">
          {/* Chart 1: Department Comparisons */}
          <Card className="p-6 border border-[#E2E8F0] bg-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
              <div>
                <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#006A4E]" />
                  {isBn ? 'বিভাগভিত্তিক গড় মূল্যায়ন স্কোর' : 'Departmental Average Ratings Comparison'}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {isBn
                    ? '৭টি একাডেমিক বিভাগের গড় স্কোর (১.০ থেকে ৫.০ স্কেল)'
                    : 'Average score across CSE, EEE, MATH, FISH, GEOL, MGT, SOC'}
                </p>
              </div>
              <span className="text-xs font-mono text-[#64748B]">Scale: 0 - 5.0</span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.departmentComparison} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="department"
                    tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tick={{ fill: '#64748B', fontSize: 11 }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: '#F8FAFC' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-[#CBD5E1] p-2.5 rounded-lg shadow-md text-xs">
                            <div className="font-bold text-[#0F172A]">Department of {data.department}</div>
                            <div className="text-[#006A4E] font-semibold mt-1">Average: {data.average} / 5.00</div>
                            <div className="text-[#64748B] text-[11px]">{data.evaluationsCount} student evaluations</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="average" radius={[6, 6, 0, 0]}>
                    {analytics.departmentComparison.map((entry) => (
                      <Cell
                        key={`cell-${entry.department}`}
                        fill={DEPT_COLORS[entry.department] || '#006A4E'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Grid of Chart 2 (Criteria Breakdown) and Chart 3 (Rating Distribution) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 2: 6 Criteria Averages */}
            <Card className="p-6 border border-[#E2E8F0] bg-white space-y-4">
              <div className="border-b border-[#F1F5F9] pb-3">
                <h3 className="font-bold text-[#0F172A]">
                  {isBn ? 'মানদণ্ডভিত্তিক প্রাতিষ্ঠানিক বিশ্লেষণ' : 'Criteria-Level Benchmark Scores'}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {isBn ? '৬টি মূল্যায়িত উপাদানের সার্বিক গড়' : 'University-wide aggregate across 6 pedagogical dimensions'}
                </p>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={analytics.criteriaBreakdown}
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis
                      type="number"
                      domain={[0, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tick={{ fill: '#64748B', fontSize: 11 }}
                      axisLine={{ stroke: '#CBD5E1' }}
                      tickLine={false}
                    />
                    <YAxis
                      dataKey="criteria"
                      type="category"
                      width={120}
                      tick={{ fill: '#334155', fontSize: 11 }}
                      axisLine={{ stroke: '#CBD5E1' }}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: '#F8FAFC' }}
                      formatter={(val: unknown) => [`${typeof val === 'number' ? val.toFixed(2) : String(val)} / 5.00`, 'Score']}
                    />
                    <Bar dataKey="score" fill="#006A4E" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Chart 3: Rating Distribution */}
            <Card className="p-6 border border-[#E2E8F0] bg-white space-y-4">
              <div className="border-b border-[#F1F5F9] pb-3">
                <h3 className="font-bold text-[#0F172A]">
                  {isBn ? 'স্টার রেটিং বণ্টন' : 'Rating Score Frequency (1 to 5 Stars)'}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {isBn ? 'শিক্ষার্থীদের প্রদত্ত তারকার সামগ্রিক বিন্যাস' : 'Aggregate frequency of ratings across all courses'}
                </p>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.ratingDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                      dataKey="rating"
                      tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
                      axisLine={{ stroke: '#CBD5E1' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748B', fontSize: 11 }}
                      axisLine={{ stroke: '#CBD5E1' }}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: '#F8FAFC' }}
                      formatter={(val: unknown) => [String(val), 'Submissions']}
                    />
                    <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modal: Open New Evaluation Window */}
      {isWindowModalOpen && (
        <Modal
          isOpen={isWindowModalOpen}
          onClose={() => setIsWindowModalOpen(false)}
          title={isBn ? 'নতুন মূল্যায়ন উইন্ডো খুলুন (আইকিউএসি)' : 'Open New Evaluation Window (IQAC)'}
          maxWidth="md"
        >
          <div className="space-y-4 pt-1">
            <div className="text-xs text-[#475569] bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
              {isBn
                ? 'একটি নতুন সেমিস্টারের জন্য মূল্যায়ন উইন্ডো সক্রিয় করুন। নির্ধারিত সময়সীমা পর্যন্ত শিক্ষার্থীরা বেনামে তাদের শিক্ষকদের মূল্যায়ন প্রদান করতে পারবে।'
                : 'Activate an evaluation window for a semester. Students will be able to submit anonymous evaluations until the closing deadline.'}
            </div>

            <Input
              label={isBn ? 'সেমিস্টারের নাম' : 'Semester Window Title'}
              value={newSemesterName}
              onChange={(e) => setNewSemesterName(e.target.value)}
              placeholder="e.g., Fall 2026 (July - Dec)"
              required
            />

            <Input
              label={isBn ? 'শিক্ষাবর্ষ / সেশন' : 'Academic Session'}
              value={newAcademicSession}
              onChange={(e) => setNewAcademicSession(e.target.value)}
              placeholder="e.g., 2024-2025"
              required
            />

            <div>
              <label htmlFor="modal-closes-at" className="block text-xs font-semibold text-[#0F172A] mb-1">
                {isBn ? 'মূল্যায়ন সমাপ্তির সময়সীমা' : 'Evaluation Closing Date'}
              </label>
              <input
                id="modal-closes-at"
                aria-label="Evaluation Closing Date"
                type="date"
                value={newClosesAt}
                onChange={(e) => setNewClosesAt(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-[#CBD5E1] rounded-lg bg-white text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#006A4E]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <Button variant="outline" size="sm" onClick={() => setIsWindowModalOpen(false)}>
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button variant="primary" size="sm" onClick={handleOpenNewWindow}>
                <Unlock className="w-3.5 h-3.5 mr-1.5" />
                {isBn ? 'উইন্ডো সক্রিয় করুন' : 'Activate Window'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
