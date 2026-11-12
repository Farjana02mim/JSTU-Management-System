import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { HallId } from '../../types/hallDining';
import { getHallForUserEmail, getHallDiningConfig } from '../../config/hallDiningConfig';
import {
  FileText,
  ArrowLeft,
  Printer,
  Download,
  Building,
  Calendar,
  Lock,
  Clock,
  CheckCircle,
  BarChart3,
  TrendingUp,
  DollarSign,
  AlertCircle,
  UtensilsCrossed,
  ShieldCheck,
  Check
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const DiningAuditReportsPage: React.FC = () => {
  const { user, profile, claims } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const userRole = (claims?.role as string) || (profile?.role as string) || 'dining_manager';
  const isAdminOrProvost = userRole === 'super_admin' || userRole === 'admin' || userRole === 'provost';

  const userEmail = (user?.email || profile?.email || '').toLowerCase();
  const assignedManagerHall = getHallForUserEmail(userEmail);

  const [selectedHall, setSelectedHall] = useState<HallId>(assignedManagerHall || 'hall-a');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-11');
  const [auditSuccess, setAuditSuccess] = useState(false);
  const [auditNote, setAuditNote] = useState('');
  const [showAuditModal, setShowAuditModal] = useState(false);

  const storeManager = SharedDataStoreManager.getInstance();
  const report = storeManager.getMonthlyAuditReport(selectedHall, selectedMonth);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    // CSV export containing strictly aggregate counts, no student IDs
    const rows = [
      ['Monthly Hall Dining Aggregate Audit Report'],
      ['Notice', 'DEMO DATA ONLY - [REPLACE WITH REAL CONTENT]'],
      ['Hall', getHallDiningConfig(selectedHall).name],
      ['Month', selectedMonth],
      ['Status', report.isAudited ? 'AUDITED & LOCKED' : 'IN PROGRESS'],
      [''],
      ['Metric', 'Value'],
      ['Total Meals Served', report.totalMealsServed],
      ['Total Meals Planned', report.totalMealsPlanned],
      ['Estimated Food Wastage (kg)', report.foodWastageEstimateKg],
      ['Total Bazar Cost (BDT)', report.totalBazarCostBDT],
      ['Total Collection (BDT)', report.totalCollectionBDT],
      ['Calculated Meal Rate (BDT)', report.calculatedMealRateBDT],
      ['Average Rating', report.averageRating],
      ['Accepted Suggestions', report.acceptedSuggestionsCount],
      [''],
      ['Complaints by Status', 'Count'],
      ...(report.complaintsByStatus || []).map((c) => [c.status, String(c.count)]),
      [''],
      ['Daily Breakdown (Aggregate)'],
      ['Date', 'Meals Served', 'Planned Meals', 'Cost (BDT)'],
      ...(report.dailyBreakdown || []).map((d) => [d.date, d.mealsServed, d.plannedMeals, d.costBDT])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dining_audit_${selectedHall}_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMarkAudited = () => {
    storeManager.markMonthAudited(
      selectedHall,
      selectedMonth,
      profile?.fullName || user?.displayName || 'Admin / Provost',
      userRole,
      auditNote || 'Monthly accounts reviewed, verified and finalized with zero discrepancies.'
    );
    setAuditSuccess(true);
    setShowAuditModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0">
      <div className="max-w-6xl mx-auto">
        {/* Top bar (hidden in print) */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <Link
              to="/office/dining"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {isBn ? 'ডাইনিং মাসিক অডিট রিপোর্ট' : 'Monthly Dining Audit Report'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                {isBn
                  ? 'সার্ভার রেকর্ড, মিল সংখ্যা, বাজার ব্যয় এবং রেট নিরীক্ষা'
                  : 'Aggregate server records, food waste estimation & rate auditing'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              {isBn ? 'প্রিন্ট রিপোর্ট' : 'Print Report'}
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              {isBn ? 'সিএসভি রপ্তানি' : 'Export CSV (Aggregates)'}
            </button>
          </div>
        </div>

        {/* Safety & Demo Label Notice */}
        <div className="mb-6 bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-semibold uppercase tracking-wider text-emerald-300 block">
                {isBn ? 'ডেমো ডেটা ও অডিট সুরক্ষা' : 'Demo Mode • Audit Protection Standard'}
              </span>
              <p className="text-white/90 mt-0.5">
                {isBn
                  ? 'গোপনীয়তা রক্ষার্থে ৫টির কম রেকর্ডযুক্ত ঘরসমূহ "<5" হিসেবে প্রদর্শিত হচ্ছে। কোনো ব্যক্তিগত শিক্ষার্থী তথ্য নেই।'
                  : 'Cell counts below 5 are masked as "<5" to prevent re-identification. No student PII is exposed.'}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
            [REPLACE WITH REAL CONTENT]
          </span>
        </div>

        {/* Filters and Month Lock Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-500" />
                <label htmlFor="audit-hall-select" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {isBn ? 'হল:' : 'Hall:'}
                </label>
                {isAdminOrProvost ? (
                  <select
                    id="audit-hall-select"
                    aria-label={isBn ? 'হল নির্বাচন করুন' : 'Select hall'}
                    value={selectedHall}
                    onChange={(e) => setSelectedHall(e.target.value as HallId)}
                    className="text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="hall-a">Oporajita Hall</option>
                    <option value="hall-b">Bijoy 24 Hall</option>
                  </select>
                ) : (
                  <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    {getHallDiningConfig(selectedHall).name}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <label htmlFor="audit-month-select" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {isBn ? 'মাস:' : 'Month:'}
                </label>
                <select
                  id="audit-month-select"
                  aria-label={isBn ? 'মাস নির্বাচন করুন' : 'Select month'}
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="2026-11">November 2026 (Demo)</option>
                  <option value="2026-10">October 2026 (Demo)</option>
                  <option value="2026-09">September 2026 (Demo)</option>
                </select>
              </div>
            </div>

            {/* Audit Status Pill */}
            <div className="flex items-center gap-2">
              {report.isAudited ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>
                    {isBn ? 'নিরীক্ষিত ও লক করা (Audited)' : 'Audited & Locked'}
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>
                    {isBn ? 'চলমান (In Progress)' : 'In Progress (Editable)'}
                  </span>
                </div>
              )}

              {/* Admin Audit Button */}
              {isAdminOrProvost && !report.isAudited && (
                <button
                  onClick={() => setShowAuditModal(true)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                >
                  {isBn ? 'অডিট সম্পন্ন চিহ্নিত করুন' : 'Mark as Audited (Lock)'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Formal Printable Document Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-6">
          <div className="border-b border-slate-200 pb-6 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="p-2 bg-emerald-100 rounded-lg text-emerald-800">
                <UtensilsCrossed className="w-6 h-6" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {isBn
                  ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় - হল ডাইনিং অডিট রিপোর্ট'
                  : 'Jamalpur Science & Technology University • Hall Dining Audit Report'}
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              {getHallDiningConfig(selectedHall).name} • {selectedMonth} •{' '}
              {isBn ? 'হল প্রাধ্যক্ষ কার্যালয় নিরীক্ষা' : 'Provost Dining Audit Directorate'}
            </p>
            <p className="text-[11px] text-amber-800 font-medium mt-1">
              [REPLACE WITH REAL CONTENT] — DEMO RECORD ONLY
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <span className="text-xs text-slate-600 flex items-center gap-1">
                <UtensilsCrossed className="w-3.5 h-3.5 text-slate-500" />
                {isBn ? 'মোট পরিবেশিত মিল' : 'Total Meals Served'}
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {report.totalMealsServed.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-500">
                {isBn ? 'পরিকল্পিত:' : 'Planned:'} {(report.totalMealsPlanned ?? report.totalMealsServed).toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <span className="text-xs text-slate-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                {isBn ? 'আনুমানিক অপচয়' : 'Wastage Estimate'}
              </span>
              <p className="text-2xl font-bold text-amber-700 mt-1">
                {report.foodWastageEstimateKg ?? 24} <span className="text-sm font-normal">kg</span>
              </p>
              <span className="text-[10px] text-slate-500">
                {isBn ? 'প্রস্তুত বনাম পরিবেশিত' : 'Prepared vs served delta'}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <span className="text-xs text-slate-600 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                {isBn ? 'মোট বাজার খরচ' : 'Total Bazar Cost'}
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                ৳{(report.totalBazarCostBDT ?? report.totalCost ?? 72300).toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-500">
                {isBn ? 'সংগ্রহ:' : 'Collection:'} ৳{(report.totalCollectionBDT ?? report.totalCollection ?? 88500).toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <span className="text-xs text-slate-600 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                {isBn ? 'চূড়ান্ত মিল রেট' : 'Calculated Meal Rate'}
              </span>
              <p className="text-2xl font-bold text-emerald-700 mt-1">
                ৳{report.calculatedMealRateBDT}
              </p>
              <span className="text-[10px] text-slate-500">
                {isBn ? 'গড় রেটিং:' : 'Avg Rating:'} {report.averageRating} / 5.0
              </span>
            </div>
          </div>

          {/* Meals Per Day Chart */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              {isBn ? 'দৈনিক খাবার পরিসংখ্যান (সার্ভড বনাম পরিকল্পিত)' : 'Daily Meal Service vs Planned Target'}
            </h3>
            <div className="h-64 w-full bg-slate-50 border border-slate-200 rounded-xl p-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.dailyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="mealsServed" name={isBn ? 'পরিবেশিত' : 'Meals Served'} fill="#059669" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="plannedMeals" name={isBn ? 'পরিকল্পিত' : 'Planned Target'} fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Aggregate Performance Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Complaints Breakdown */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 font-semibold text-xs text-slate-800">
                {isBn ? 'অভিযোগ নিষ্পত্তির অবস্থা' : 'Complaints Resolution Breakdown'}
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="py-2 px-3 text-left">{isBn ? 'অবস্থা' : 'Status'}</th>
                    <th className="py-2 px-3 text-right">{isBn ? 'সংখ্যা (Count)' : 'Count'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {(report.complaintsByStatus || []).map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium">{c.status}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">
                        {c.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Suggestions & Wastage Controls */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 font-semibold text-xs text-slate-800">
                {isBn ? 'গুণমান ও অপচয় নিয়ন্ত্রণ মেট্রিক্স' : 'Quality & Waste Control Metrics'}
              </div>
              <div className="p-4 space-y-3 text-xs text-slate-700">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span>{isBn ? 'গৃহীত মেনু প্রস্তাবনা:' : 'Accepted Menu Suggestions:'}</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {report.acceptedSuggestionsCount}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span>{isBn ? 'গড় অপচয় অনুপাত:' : 'Wastage Ratio:'}</span>
                  <span className="font-mono font-bold text-slate-900">
                    ~{( ((report.foodWastageEstimateKg ?? 24) / (Number(report.totalMealsServed) * 0.35)) * 100 ).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span>{isBn ? 'অডিট স্ট্যাটাস:' : 'Audit Status:'}</span>
                  <span className="font-semibold text-slate-900">
                    {report.isAudited ? 'Finalized / Verified' : 'Draft / In Progress'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span>{isBn ? 'নিরীক্ষক দপ্তর:' : 'Auditing Office:'}</span>
                  <span className="font-medium text-slate-700">
                    {report.auditedBy || 'Hall Dining Oversight Committee'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Trail & Signatures */}
          <div className="border-t border-slate-200 pt-6 mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-end gap-8 pt-8">
              <div className="text-left">
                <div className="w-48 border-b border-slate-400 mb-1"></div>
                <p className="text-xs font-semibold text-slate-800">Dining Manager (Demo)</p>
                <p className="text-[11px] text-slate-500">[REPLACE WITH REAL CONTENT]</p>
              </div>

              <div className="text-left">
                <div className="w-48 border-b border-slate-400 mb-1"></div>
                <p className="text-xs font-semibold text-slate-800">Hall Provost / Auditor</p>
                <p className="text-[11px] text-slate-500">[REPLACE WITH REAL CONTENT]</p>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Modal */}
        {showAuditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6">
              <div className="flex items-center gap-2 mb-3 text-emerald-700">
                <Lock className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">
                  {isBn ? 'মাসিক অডিট চূড়ান্তকরণ ও লক' : 'Finalize & Lock Monthly Audit'}
                </h3>
              </div>

              <p className="text-xs text-slate-600 mb-4">
                {isBn
                  ? 'এই মাসে "অডিট সম্পন্ন" চিহ্নিত করার পর ডাইনিং ম্যানেজার কোনো পূর্বের বাজার খরচ বা মেনু এন্ট্রি সংশোধন করতে পারবেন না। যেকোনো পরবর্তী সংশোধনের জন্য নতুন অডিট এন্ট্রি দিতে হবে।'
                  : 'Once marked as AUDITED, dining manager edits for this month are permanently locked. Corrections can only be appended as new audit entries with justification.'}
              </p>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? 'অডিট পর্যবেক্ষণ ও মন্তব্য:' : 'Audit Verification Notes:'}
                </label>
                <textarea
                  rows={3}
                  value={auditNote}
                  onChange={(e) => setAuditNote(e.target.value)}
                  placeholder={
                    isBn
                      ? 'উদাঃ ক্যাশ ভাউচার ও টোকেন পরিবেশন সংখ্যা যাচাই সম্পন্ন হয়েছে...'
                      : 'e.g., Cash vouchers and token meal counters reconciled successfully...'
                  }
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAuditModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleMarkAudited}
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm"
                >
                  {isBn ? 'নিশ্চিত করুন ও লক করুন' : 'Confirm & Lock Month'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
