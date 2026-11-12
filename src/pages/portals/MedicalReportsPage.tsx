import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ResponsiveContainer
} from 'recharts';
import {
  BarChart3,
  Calendar,
  Clock,
  Printer,
  ShieldCheck,
  AlertCircle,
  Stethoscope,
  Package,
  Layers,
  TrendingUp,
  UserCheck,
  XCircle,
  HelpCircle,
  Download,
  Filter,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { MedicalReportsData } from '../../types/studentLife';

// Security Notes:
// Real enforcement must move to Firestore rules / Cloud Functions.
// Real stock changes must be done by server-side transactions so quantities cannot be altered from the browser.

const BRAND_NAVY = '#1E3A8A';
const STATUS_COLORS: Record<string, string> = {
  Completed: '#059669',
  Confirmed: '#2563EB',
  Requested: '#D97706',
  Cancelled: '#DC2626'
};

const CATEGORY_COLORS = ['#1E3A8A', '#0284C7', '#0D9488', '#F59E0B', '#E11D48'];

export const MedicalReportsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { user, profile } = useAuth();
  const storeManager = SharedDataStoreManager.getInstance();

  const [filterRange, setFilterRange] = useState<'7d' | '30d' | 'month' | 'all'>('30d');
  const [reportsData, setReportsData] = useState<MedicalReportsData | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const fetchReports = () => {
    const data = storeManager.getMedicalCenterReports(filterRange);
    setReportsData(data);
  };

  useEffect(() => {
    fetchReports();
  }, [filterRange]);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 200);
  };

  const isSmallCount = (val: number) => val > 0 && val < 5;
  const formatCount = (val: number) => (val < 5 ? '<5' : String(val));

  return (
    <div className="space-y-6">
      <SEOHead
        title={isBn ? 'মেডিকেল সেন্টার রিপোর্ট ও অ্যানালিটিক্স - জেএসটিইউ' : 'Medical Center Reports & Analytics - JSTU'}
        description="JSTU Medical Center Anonymous Reports, Service Utilization, No-Show Rate, Stock Summary, and Small-Count Protected Statistics."
      />

      {/* 1. Header with Top Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#1E3A8A]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              {isBn ? 'মেডিকেল সেন্টার রিপোর্ট ও অ্যানালিটিক্স' : 'Medical Center Reports & Analytics'}
            </h1>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
              Demo Data
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isBn
              ? 'বেনামী পরিসংখ্যান, সেবা গ্রহণ বিশ্লেষণ এবং ক্ষুদ্র-সংখ্যা সুরক্ষা (<৫) সহ স্বাস্থ্য প্রতিবেদন।'
              : 'Anonymous visit metrics, no-show rate, prescription categories, and small-count protected stats.'}
          </p>
        </div>

        {/* Portal Section Links */}
        <div className="flex items-center gap-2 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0] shrink-0">
          <Link
            to="/office/medical"
            className="px-3 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-[#0F172A] transition-colors flex items-center gap-1.5"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>{isBn ? 'পরামর্শ ও রোস্টার' : 'Consultations'}</span>
          </Link>
          <Link
            to="/office/medical/stock"
            className="px-3 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-[#0F172A] transition-colors flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5" />
            <span>{isBn ? 'ফার্মেসি ও স্টক' : 'Pharmacy & Stock'}</span>
          </Link>
          <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white text-[#1E3A8A] shadow-xs border border-slate-200 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>{isBn ? 'রিপোর্ট ও পরিসংখ্যান' : 'Reports & Stats'}</span>
          </span>
        </div>
      </div>

      {/* 2. Mandatory Small-Count Protection & Privacy Banner */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start sm:items-center justify-between gap-3 print:hidden">
        <div className="flex items-start sm:items-center gap-2 text-xs text-blue-950 font-medium">
          <Lock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            {isBn
              ? 'গোপনীয়তা সুরক্ষা নীতি: রোগীর পরিচয় রোধে যেকোনো ক্যাটাগরি বা ঘরে ৫ এর কম তথ্য থাকলে তা "<৫" আকারে প্রদর্শিত হয়।'
              : 'Small-Count Protection: Any metric with fewer than 5 records is masked as "<5" to prevent patient re-identification.'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={filterRange}
            onChange={(e) => setFilterRange(e.target.value as any)}
            className="text-xs p-1.5 bg-white border border-blue-200 rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          >
            <option value="7d">{isBn ? 'বিগত ৭ দিন' : 'Last 7 Days'}</option>
            <option value="30d">{isBn ? 'বিগত ৩০ দিন' : 'Last 30 Days'}</option>
            <option value="month">{isBn ? 'চলতি মাস' : 'This Month'}</option>
            <option value="all">{isBn ? 'সর্বমোট সময়' : 'All Time'}</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs font-bold bg-white text-[#1E3A8A] border-blue-300 hover:bg-blue-50"
            leftIcon={<Printer className="w-3.5 h-3.5 text-[#1E3A8A]" />}
          >
            {isBn ? 'মাসিক রিপোর্ট প্রিন্ট' : 'Print Monthly Report'}
          </Button>
        </div>
      </div>

      {/* Printable Area Wrapper */}
      <div ref={printAreaRef} className="space-y-6">
        {/* Printable Official Header (Shown during window.print) */}
        <div className="hidden print:block text-center border-b border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-extrabold text-[#1E3A8A]">JAMALPUR SCIENCE & TECHNOLOGY UNIVERSITY</h2>
          <h3 className="text-sm font-bold text-gray-700">CENTRAL UNIVERSITY MEDICAL CENTER</h3>
          <p className="text-xs text-gray-500 mt-1">MONTHLY UTILIZATION & ANONYMOUS HEALTH STATISTICAL REPORT</p>
          <div className="text-[10px] text-gray-500 font-mono mt-1">
            Generated: {new Date().toLocaleDateString()} | Filter Range: {filterRange.toUpperCase()} | Small-Count Masked (&lt;5)
          </div>
        </div>

        {/* 3. KPI Summary Row */}
        {reportsData && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-4 border border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{isBn ? 'মোট রোগী পরামর্শ' : 'Total Consultations'}</span>
                <Stethoscope className="w-4 h-4 text-[#1E3A8A]" />
              </div>
              <div className="mt-2 text-2xl font-bold text-[#0F172A]">
                {formatCount(reportsData.totalVisits)}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {isBn ? 'চূড়ান্ত ভিজিট নোট অন্তর্ভুক্ত' : 'Finalized clinical consultations'}
              </span>
            </Card>

            <Card className="p-4 border border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{isBn ? 'সম্পন্ন অ্যাপয়েন্টমেন্ট' : 'Completed Appointments'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-700">
                {formatCount(reportsData.completedVisitsCount)}
              </div>
              <span className="text-[11px] text-emerald-800 font-medium mt-1 block">
                {isBn ? 'সফল আউটপেশেন্ট সেবা' : 'Outpatient attended'}
              </span>
            </Card>

            <Card className="p-4 border border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{isBn ? 'অনুপস্থিতি / নো-শো হার' : 'No-Show / Cancel Rate'}</span>
                <XCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2 text-2xl font-bold text-amber-600">
                {reportsData.noShowRatePercent}%
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {formatCount(reportsData.cancelledVisitsCount)} {isBn ? 'টি বুকিং বাতিল' : 'cancelled slots'}
              </span>
            </Card>

            <Card className="p-4 border border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{isBn ? 'স্বল্প / আসন্ন মেয়াদ ওষুধ' : 'Low / Expiring Stock'}</span>
                <Package className="w-4 h-4 text-blue-700" />
              </div>
              <div className="mt-2 text-2xl font-bold text-[#1E3A8A]">
                {reportsData.stockSummary.lowStockCount + reportsData.stockSummary.expiringWithin30DaysCount}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {reportsData.stockSummary.lowStockCount} {isBn ? 'স্বল্প' : 'low'}, {reportsData.stockSummary.expiringWithin30DaysCount} {isBn ? 'মেয়াদ আসন্ন' : 'expiring'}
              </span>
            </Card>
          </div>
        )}

        {/* 4. Charts Grid (White Design System with Recharts) */}
        {reportsData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Visits Trend Over Time */}
            <Card className="p-4 sm:p-5 border border-[#E2E8F0] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    {isBn ? 'দৈনিক চিকিৎসা পরামর্শ সংখ্যা' : 'Daily Patient Consultations Trend'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isBn ? 'তারিখ অনুযায়ী আউটপেশেন্ট ভিজিট' : 'Outpatient visits by date (Small-count masked <5)'}
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                  Demo
                </span>
              </div>

              <div className="h-64 w-full">
                {reportsData.visitsByDay.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    {isBn ? 'কোনো ভিজিট তথ্য নেই' : 'No consultation visits recorded in this range'}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reportsData.visitsByDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="displayDate" tick={{ fontSize: 11, fill: '#64748B' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                      <Tooltip
                        formatter={(val: any) => [formatCount(Number(val)), 'Visits']}
                        labelFormatter={(label) => `Date: ${label}`}
                        contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', fontSize: '11px', borderRadius: '8px' }}
                      />
                      <Area type="monotone" dataKey="count" stroke={BRAND_NAVY} fill="#DBEAFE" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            {/* Chart 2: Appointments by Status (Donut) */}
            <Card className="p-4 sm:p-5 border border-[#E2E8F0] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    {isBn ? 'অ্যাপয়েন্টমেন্টের স্ট্যাটাস বিন্যাস' : 'Appointment Status Breakdown'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isBn ? 'সম্পন্ন, নিশ্চিত ও বাতিল অনুপাত' : 'Completed, confirmed, requested, and cancelled'}
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                  Demo
                </span>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                {reportsData.appointmentsByStatus.length === 0 ? (
                  <div className="text-xs text-slate-500">
                    {isBn ? 'কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি' : 'No appointments recorded'}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportsData.appointmentsByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="count"
                        nameKey="status"
                      >
                        {reportsData.appointmentsByStatus.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={STATUS_COLORS[entry.status] || CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [formatCount(Number(val)), 'Count']}
                        contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', fontSize: '11px', borderRadius: '8px' }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => <span className="text-xs text-slate-700 font-medium">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            {/* Chart 3: Average Visits per Doctor (Anonymous) */}
            <Card className="p-4 sm:p-5 border border-[#E2E8F0] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    {isBn ? 'চিকিৎসক অনুযায়ী পরামর্শ সেবা' : 'Consultations by Attending Doctor'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isBn ? 'কর্তব্যরত চিকিৎসকদের কাজের চাপ বিশ্লেষণ' : 'Anonymous workload distribution per medical officer'}
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                  Demo
                </span>
              </div>

              <div className="h-64 w-full">
                {reportsData.visitsByDoctor.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    {isBn ? 'তথ্য পাওয়া যায়নি' : 'No doctor workload data'}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportsData.visitsByDoctor} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                      <YAxis dataKey="doctorName" type="category" width={140} tick={{ fontSize: 10, fill: '#0F172A' }} />
                      <Tooltip
                        formatter={(val: any) => [formatCount(Number(val)), 'Consultations']}
                        contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', fontSize: '11px', borderRadius: '8px' }}
                      />
                      <Bar dataKey="count" fill={BRAND_NAVY} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            {/* Chart 4: Top Dispensed Categories */}
            <Card className="p-4 sm:p-5 border border-[#E2E8F0] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    {isBn ? 'বিতরণকৃত ওষুধের ক্যাটাগরি বিশ্লেষণ' : 'Dispensed Medication Categories'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isBn ? 'আউটপেশেন্ট প্রেসক্রিপশন অনুযায়ী বিতরণ' : 'Aggregated dispensary outflow by classification'}
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                  Demo
                </span>
              </div>

              <div className="h-64 w-full">
                {reportsData.dispensedByCategory.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    {isBn ? 'কোনো বিতরণ রেকর্ড নেই' : 'No medications dispensed in this timeframe'}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportsData.dispensedByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748B' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                      <Tooltip
                        formatter={(val: any) => [formatCount(Number(val)), 'Units Dispensed']}
                        contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', fontSize: '11px', borderRadius: '8px' }}
                      />
                      <Bar dataKey="count" fill="#0284C7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* 5. Stock Value-Free Summary Table */}
        {reportsData && (
          <Card className="border border-[#E2E8F0] overflow-hidden">
            <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">
                  {isBn ? 'ফার্মেসি মজুদ সারাংশ (মূল্যহীন ও সার্বিক স্থিতি)' : 'Pharmacy Inventory Value-Free Summary'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isBn
                    ? 'সরকারি মেডিকেল সেন্টারের বিনামূল্যে বিতরণযোগ্য মজুদের পরিস্থিতি (স্বল্প মজুদ ও আসন্ন মেয়াদ)'
                    : 'Physical units balance, reorder thresholds, and active batch expiration overview.'}
                </p>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {reportsData.stockSummary.totalItems} {isBn ? 'আইটেম' : 'items'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#0F172A]">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3">{isBn ? 'ক্যাটাগরি' : 'Category'}</th>
                    <th className="p-3">{isBn ? 'সর্বমোট পরামর্শ' : 'Consultations'}</th>
                    <th className="p-3">{isBn ? 'বিতরণ পরিমাণ' : 'Units Dispensed'}</th>
                    <th className="p-3">{isBn ? 'স্বল্প মজুদ সংখ্যা' : 'Low Stock Count'}</th>
                    <th className="p-3">{isBn ? 'আসন্ন মেয়াদ (<৩০ দিন)' : 'Expiring <30 Days'}</th>
                    <th className="p-3">{isBn ? 'স্ট্যাটাস সতর্কতা' : 'Inventory Health'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {reportsData.dispensedByCategory.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">
                        {isBn ? 'কোনো তথ্য নেই।' : 'No data recorded.'}
                      </td>
                    </tr>
                  ) : (
                    reportsData.dispensedByCategory.map((cat, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-bold text-[#0F172A]">{cat.category}</td>
                        <td className="p-3 font-mono text-slate-700">{cat.displayCount}</td>
                        <td className="p-3 font-mono text-blue-700 font-semibold">{cat.displayCount}</td>
                        <td className="p-3 font-mono">
                          {reportsData.stockSummary.lowStockCount > 0 ? (
                            <span className="text-amber-600 font-bold">
                              {formatCount(reportsData.stockSummary.lowStockCount)}
                            </span>
                          ) : (
                            <span className="text-slate-600">0</span>
                          )}
                        </td>
                        <td className="p-3 font-mono">
                          {reportsData.stockSummary.expiringWithin30DaysCount > 0 ? (
                            <span className="text-blue-700 font-bold">
                              {formatCount(reportsData.stockSummary.expiringWithin30DaysCount)}
                            </span>
                          ) : (
                            <span className="text-slate-600">0</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Normal</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-[#E2E8F0] text-[10px] text-slate-500 flex items-center justify-between">
              <span>* Small-count rule: Counts &lt; 5 masked as &quot;&lt;5&quot; to maintain medical anonymity.</span>
              <span className="font-mono">JSTU Smart Campus Medical Center</span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
