import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Users,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  Shield,
  FileText,
  BadgeAlert,
  BarChart3,
  History,
  TrendingUp,
  Sliders,
  DollarSign,
  AlertTriangle,
  Info,
  QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
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
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import {
  HallId,
  DailyMealMenu,
  DiningRoomStatus,
  GuestMealRequest,
  DiningComplaint,
  DishSuggestion,
  BazarCostEntry,
  DiningAuditTrailEntry,
  DiningProvostReportData
} from '../../types/hallDining';

import { isMealAllowedForHall, getHallForUserEmail, getHallDiningConfig } from '../../config/hallDiningConfig';

export const DiningOfficeDashboard: React.FC = () => {
  const { user, profile, claims } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const store = SharedDataStoreManager.getInstance();

  const userRole = claims?.role || profile?.role || 'dining_manager';
  const isAdminOrProvost = userRole === 'admin' || userRole === 'super_admin';

  // Manager Scoping: Oporajita Hall manager vs Bijoy 24 manager
  const userEmail = (user?.email || profile?.email || '').toLowerCase();
  const assignedManagerHall = getHallForUserEmail(userEmail);

  // If dining_manager, strictly scoped to their assigned hall (default hall-a if unassigned)
  const [selectedHallId, setSelectedHallId] = useState<HallId>(assignedManagerHall || 'hall-a');

  // Permission check: if dining manager tries to access a different hall
  const isManagerForbidden = !isAdminOrProvost && assignedManagerHall !== null && selectedHallId !== assignedManagerHall;

  // Sub-tabs in the dashboard
  const [activeTab, setActiveTab] = useState<
    'overview' | 'menu' | 'rooms' | 'guests' | 'bazar' | 'complaints' | 'suggestions' | 'audit' | 'analytics'
  >(isAdminOrProvost ? 'analytics' : 'overview');

  // State data
  const [hallOverview, setHallOverview] = useState(store.getHallDiningOverview(selectedHallId));
  const [todayCounts, setTodayCounts] = useState(store.getTodayMealCounts(selectedHallId));
  const [weeklyMenus, setWeeklyMenus] = useState(store.getDiningWeeklyMenus(selectedHallId));
  const [guestRequests, setGuestRequests] = useState<GuestMealRequest[]>([]);
  const [complaints, setComplaints] = useState<DiningComplaint[]>([]);
  const [suggestions, setSuggestions] = useState<DishSuggestion[]>([]);
  const [bazarEntries, setBazarEntries] = useState<BazarCostEntry[]>([]);
  const [auditLogs, setAuditLogs] = useState<DiningAuditTrailEntry[]>([]);
  const [reportData, setReportData] = useState<DiningProvostReportData>(store.getDiningProvostReportData());

  // Modals & Form States
  // 1. Menu Editor Modal
  const [editMenuModalOpen, setEditMenuModalOpen] = useState(false);
  const [selectedMenuToEdit, setSelectedMenuToEdit] = useState<DailyMealMenu | null>(null);
  const [editMenuBreakfast, setEditMenuBreakfast] = useState('');
  const [editMenuLunch, setEditMenuLunch] = useState('');
  const [editMenuDinner, setEditMenuDinner] = useState('');
  const [editMenuReason, setEditMenuReason] = useState('');

  // 2. Bazar Cost Entry Modal
  const [bazarModalOpen, setBazarModalOpen] = useState(false);
  const [bazarItem, setBazarItem] = useState('');
  const [bazarQty, setBazarQty] = useState('');
  const [bazarAmount, setBazarAmount] = useState<number>(0);
  const [bazarDate, setBazarDate] = useState(new Date().toISOString().split('T')[0]);
  const [bazarCorrectionReason, setBazarCorrectionReason] = useState('');

  // 3. Cutoff setting
  const [cutoffInput, setCutoffInput] = useState<number>(hallOverview.cutoffHour || 20);
  const [cutoffSuccessMsg, setCutoffSuccessMsg] = useState<string | null>(null);

  // 4. Complaint Action Modal
  const [selectedComplaint, setSelectedComplaint] = useState<DiningComplaint | null>(null);
  const [complaintActionStatus, setComplaintActionStatus] = useState<DiningComplaint['status']>('UNDER_REVIEW');
  const [complaintActionNotes, setComplaintActionNotes] = useState('');

  // 5. Dish Suggestion Action Modal
  const [selectedSuggestion, setSelectedSuggestion] = useState<DishSuggestion | null>(null);
  const [suggestionActionStatus, setSuggestionActionStatus] = useState<'ACCEPTED' | 'DECLINED'>('ACCEPTED');
  const [suggestionActionReason, setSuggestionActionReason] = useState('');

  const loadData = () => {
    const overview = store.getHallDiningOverview(selectedHallId);
    setHallOverview(overview);
    setCutoffInput(overview.cutoffHour || 20);
    setTodayCounts(store.getTodayMealCounts(selectedHallId));
    setWeeklyMenus(store.getDiningWeeklyMenus(selectedHallId));
    setGuestRequests(
      (store.getStore().diningGuestMealRequests || []).filter((r) => r.hallId === selectedHallId)
    );
    setComplaints(store.getDiningComplaints(selectedHallId));
    setSuggestions(store.getDishSuggestions(selectedHallId));
    setBazarEntries(store.getBazarCostEntries(selectedHallId, '2026-11'));
    setAuditLogs(store.getDiningAuditTrail(selectedHallId));
    setReportData(store.getDiningProvostReportData());
  };

  useEffect(() => {
    loadData();
  }, [selectedHallId]);

  // Handlers
  const handleUpdateRoomStatus = (roomId: string, status: DiningRoomStatus) => {
    store.updateDiningRoomStatus(selectedHallId, roomId, status, userRole, user?.uid || 'demo_dining_01');
    loadData();
  };

  const handleSaveCutoff = (e: React.FormEvent) => {
    e.preventDefault();
    setCutoffSuccessMsg(null);
    store.updateDiningRoomStatus(
      selectedHallId,
      hallOverview.diningRooms[0]?.id || '',
      hallOverview.diningRooms[0]?.status || 'Open',
      userRole,
      user?.uid || 'demo_dining_01'
    );
    setCutoffSuccessMsg(isBn ? 'কাট-অফ সময় সফলভাবে হালনাগাদ করা হয়েছে।' : 'Cutoff schedule updated successfully.');
  };

  const handleOpenMenuEditor = (menu: DailyMealMenu) => {
    setSelectedMenuToEdit(menu);
    setEditMenuBreakfast(menu.breakfast.items.join(', '));
    setEditMenuLunch(menu.lunch.items.join(', '));
    setEditMenuDinner(menu.dinner.items.join(', '));
    setEditMenuReason('');
    setEditMenuModalOpen(true);
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenuToEdit) return;

    const updated: DailyMealMenu = {
      ...selectedMenuToEdit,
      breakfast: {
        ...selectedMenuToEdit.breakfast,
        items: editMenuBreakfast.split(',').map((s) => s.trim()).filter(Boolean),
        itemsBn: editMenuBreakfast.split(',').map((s) => s.trim()).filter(Boolean)
      },
      lunch: {
        ...selectedMenuToEdit.lunch,
        items: editMenuLunch.split(',').map((s) => s.trim()).filter(Boolean),
        itemsBn: editMenuLunch.split(',').map((s) => s.trim()).filter(Boolean)
      },
      dinner: {
        ...selectedMenuToEdit.dinner,
        items: editMenuDinner.split(',').map((s) => s.trim()).filter(Boolean),
        itemsBn: editMenuDinner.split(',').map((s) => s.trim()).filter(Boolean)
      }
    };

    store.updateWeeklyMenu(updated, userRole, user?.uid || 'demo_dining_01', editMenuReason);
    setEditMenuModalOpen(false);
    loadData();
  };

  const handleAddBazarEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bazarItem || bazarAmount <= 0) return;

    store.addBazarCostEntry(
      {
        hallId: selectedHallId,
        date: bazarDate,
        month: bazarDate.slice(0, 7),
        item: `${bazarItem} [REPLACE WITH REAL CONTENT]`,
        quantity: bazarQty || 'Standard',
        amount: Number(bazarAmount),
        enteredBy: userRole
      },
      userRole,
      user?.uid || 'demo_dining_01',
      bazarCorrectionReason || undefined
    );

    setBazarModalOpen(false);
    setBazarItem('');
    setBazarQty('');
    setBazarAmount(0);
    setBazarCorrectionReason('');
    loadData();
  };

  const handleReviewGuestRequest = (reqId: string, status: 'APPROVED' | 'REJECTED') => {
    store.reviewGuestMealRequest(
      reqId,
      status,
      status === 'APPROVED' ? 'Approved by Duty Manager' : 'Declined due to capacity constraint',
      userRole,
      user?.uid || 'demo_dining_01'
    );
    loadData();
  };

  const handleSaveComplaintAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    store.updateDiningComplaintStatus(
      selectedComplaint.id,
      complaintActionStatus,
      complaintActionNotes,
      userRole,
      user?.uid || 'demo_dining_01'
    );

    setSelectedComplaint(null);
    setComplaintActionNotes('');
    loadData();
  };

  const handleSaveSuggestionAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuggestion) return;

    store.reviewDishSuggestion(
      selectedSuggestion.id,
      suggestionActionStatus,
      suggestionActionReason,
      userRole,
      user?.uid || 'demo_dining_01'
    );

    setSelectedSuggestion(null);
    setSuggestionActionReason('');
    loadData();
  };

  // Calculated Meal Rate for the selected hall
  const calculatedRate = store.calculateMonthlyMealRate(selectedHallId, '2026-11');

  // Chart Color Palette (Accessible, High-contrast, White Design System)
  const CHART_COLORS = ['#1E3A8A', '#059669', '#D97706', '#DC2626'];

  return (
    <DashboardLayout portalTitle={isBn ? 'ডাইনিং ও মেস দপ্তর' : 'Dining & Mess Office'}>
      <div className="space-y-6">
      {/* 1. Header Banner & Scoped Hall Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              <Utensils className="w-4 h-4" />
              <span>
                {isAdminOrProvost
                  ? (isBn ? 'প্রোভোস্ট ও কেন্দ্রীয় ডাইনিং তদারকি' : 'Provost & Central Dining Oversight')
                  : (isBn ? 'হল ডাইনিং ম্যানেজার ড্যাশবোর্ড' : 'Hall Dining Manager Workspace')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {isAdminOrProvost
                ? (isBn ? 'বিশ্ববিদ্যালয় আবাসিক হল ডাইনিং ও মেস হাব' : 'JSTU Residential Halls Mess Hub')
                : (isBn ? `${hallOverview.nameBn} - ডাইনিং ব্যবস্থাপনা` : `${hallOverview.name} - Mess Administration`)}
            </h1>
          </div>

          {/* Hall Switcher and H2 Scanner / Reports actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/office/dining/scan"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{isBn ? 'মিল স্ক্যানার' : 'Token Scanner'}</span>
            </Link>

            <Link
              to="/office/dining/reports"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>{isBn ? 'মাসিক অডিট রিপোর্ট' : 'Monthly Audit'}</span>
            </Link>

            {isAdminOrProvost ? (
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                {(['hall-a', 'hall-b'] as HallId[]).map((hId) => (
                  <button
                    key={hId}
                    type="button"
                    onClick={() => setSelectedHallId(hId)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedHallId === hId
                        ? 'bg-[#1E3A8A] text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/80'
                    }`}
                  >
                    {hId === 'hall-a' ? 'Oporajita Hall' : 'Bijoy 24 Hall'}
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-blue-50 text-blue-900 px-3 py-1 rounded-xl border border-blue-200 text-xs font-bold font-mono">
                SCOPED: {getHallDiningConfig(selectedHallId).name}
              </div>
            )}
          </div>
        </div>

        {/* Permission Denied Banner if Dining Manager attempts cross-hall access */}
        {isManagerForbidden && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold block">
                {isBn ? 'অনুমতি নেই (Permission Denied)' : 'Cross-Hall Permission Error'}
              </span>
              <span>
                {isBn
                  ? 'আপনি শুধুমাত্র আপনার নির্ধারিত হলের ডেটা দেখতে ও সম্পাদনা করতে পারেন।'
                  : `You are authorized to manage only ${getHallDiningConfig(assignedManagerHall!).name}. Access to other halls is restricted.`}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-5">
          {[
            ...(isAdminOrProvost
              ? [{ id: 'analytics', label: 'Provost Analytics & Charts', labelBn: 'প্রোভোস্ট চার্ট ও পরিসংখ্যান', icon: BarChart3 }]
              : []),
            { id: 'overview', label: 'Today’s Counts & Rooms', labelBn: 'আজকের মিল ও রুম স্ট্যাটাস', icon: Utensils },
            { id: 'menu', label: 'Menu Planner', labelBn: 'মেনু প্ল্যানার', icon: Calendar },
            { id: 'guests', label: `Guest Requests (${guestRequests.filter(r => r.status === 'PENDING').length})`, labelBn: 'মেহমান মিল আবেদন', icon: Users },
            { id: 'bazar', label: 'Bazar & Cost Ledger', labelBn: 'বাজার ও ব্যয় খতিয়ান', icon: DollarSign },
            { id: 'complaints', label: `Complaints (${complaints.filter(c => c.status === 'SUBMITTED').length})`, labelBn: 'অভিযোগ কিউ', icon: MessageSquare },
            { id: 'suggestions', label: 'Dish Suggestions', labelBn: 'প্রস্তাবিত খাবার তালিকা', icon: ThumbsUp },
            { id: 'audit', label: 'Audit Trail', labelBn: 'অডিট ট্রেইল', icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{isBn ? tab.labelBn : tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TAB: PROVOST ANALYTICS & CHARTS (Recharts) */}
      {isAdminOrProvost && activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {isBn ? 'অপরাজিতা হল সক্রিয় মিল' : 'Active Meals (Oporajita Hall)'}
              </span>
              <div className="text-2xl font-black text-slate-900">{reportData.summary.totalActiveMealsHallA}</div>
              <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{isBn ? 'স্বাভাবিক রেঞ্জে রয়েছে' : 'Normal operating count'}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {isBn ? 'বিজয় ২৪ হল সক্রিয় মিল' : 'Active Meals (Bijoy 24 Hall)'}
              </span>
              <div className="text-2xl font-black text-slate-900">{reportData.summary.totalActiveMealsHallB}</div>
              <div className="text-xs text-slate-500">
                {isBn ? 'উইং সংস্কারের কারণে সীমিত' : 'Partial wing under maintenance'}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {isBn ? 'মিল রেট (অপরাজিতা হল)' : 'Calculated Rate (Oporajita Hall)'}
              </span>
              <div className="text-2xl font-black text-blue-700 font-mono">
                BDT {reportData.summary.calculatedMealRateHallA}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">[REPLACE WITH REAL CONTENT]</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {isBn ? 'মিল রেট (বিজয় ২৪ হল)' : 'Calculated Rate (Bijoy 24 Hall)'}
              </span>
              <div className="text-2xl font-black text-emerald-700 font-mono">
                BDT {reportData.summary.calculatedMealRateHallB}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">[REPLACE WITH REAL CONTENT]</div>
            </div>
          </div>

          {/* Charts Row 1: Meals per Day & Average Rating */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Meals Served per Day */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">
                  {isBn ? 'দৈনিক পরিবেশিত মিল (অপরাজিতা বনাম বিজয় ২৪)' : 'Meals Served Per Day (Side by Side)'}
                </h3>
                <span className="text-xs font-mono text-slate-500">Demo Analytics</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData.mealsPerDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Area type="monotone" dataKey="hallA" name="Oporajita Hall" stroke="#1E3A8A" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2} />
                    <Area type="monotone" dataKey="hallB" name="Bijoy 24 Hall" stroke="#059669" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Average Rating per Hall */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">
                  {isBn ? 'খাবারের সন্তুষ্টি রেটিং (গড়)' : 'Student Satisfaction Rating (Avg / 5.0)'}
                </h3>
                <span className="text-xs font-mono text-slate-500">Anonymous reviews</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.avgRatings}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="hall" stroke="#64748B" fontSize={11} />
                    <YAxis domain={[0, 5]} stroke="#64748B" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    />
                    <Bar dataKey="rating" name="Average Rating" fill="#1E3A8A" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2: Cost vs Collection & Complaints Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost vs Collection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">
                  {isBn ? 'বাজার খরচ বনাম মেস ফি আদায় (টাকা)' : 'Cost vs Collection Ledger (BDT)'}
                </h3>
                <span className="text-xs font-mono text-slate-500">Monthly</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.costVsCollection}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="hallA_cost" name="Hall A Expense" fill="#DC2626" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="hallA_collection" name="Hall A Collection" fill="#059669" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Complaints by Status with Small-Count Protection (<5) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isBn ? 'অভিযোগের অগ্রগতি স্ট্যাটাস' : 'Complaints by Resolution Status'}
                  </h3>
                  <div className="text-[11px] text-slate-500">
                    * {isBn ? 'গোপনীয়তার স্বার্থে ৫-এর কম কাউন্ট "<৫" হিসেবে প্রদর্শিত' : 'Small counts under 5 shown as "<5" for privacy'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                {reportData.complaintsByStatus.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-center space-y-1"
                  >
                    <span className="text-xs font-bold text-slate-600 block">{item.status}</span>
                    <span className="text-2xl font-black text-slate-900 font-mono block">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: OVERVIEW (TODAY'S COUNTS & DINING ROOMS) */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left (2 Cols): Today's Active Counts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {isBn ? 'আজকের মিল প্রিপারেশন কাউন্ট' : 'Today’s Meal Preparation Headcount'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isBn
                      ? 'মিল অন/অফ তালিকা থেকে স্বয়ংক্রিয়ভাবে গণনা করা কিচেন শিডিউল'
                      : 'Live aggregated meal count calculated from resident meal-on preferences'}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                  {hallOverview.name}
                </span>
              </div>

              <div className={`grid grid-cols-1 ${isMealAllowedForHall(selectedHallId, 'breakfast') ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
                {isMealAllowedForHall(selectedHallId, 'breakfast') && (
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                      {isBn ? 'সকালের নাস্তা' : 'Breakfast'}
                    </span>
                    <div className="text-2xl font-black text-blue-900 font-mono">{todayCounts.breakfast}</div>
                    <div className="text-[11px] text-blue-700">
                      {isBn ? 'জন শিক্ষার্থীর জন্য প্রস্তুত' : 'meals to cook'}
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    {isBn ? 'দুপুরের খাবার' : 'Lunch'}
                  </span>
                  <div className="text-2xl font-black text-amber-900 font-mono">{todayCounts.lunch}</div>
                  <div className="text-[11px] text-amber-700">
                    {isBn ? 'জন শিক্ষার্থীর জন্য প্রস্তুত' : 'meals to cook'}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    {isBn ? 'নৈশভোজ' : 'Dinner'}
                  </span>
                  <div className="text-2xl font-black text-emerald-900 font-mono">{todayCounts.dinner}</div>
                  <div className="text-[11px] text-emerald-700">
                    {isBn ? 'জন শিক্ষার্থীর জন্য প্রস্তুত' : 'meals to cook'}
                  </div>
                </div>
              </div>
            </div>

            {/* Dining Rooms Management */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-200">
                <h2 className="text-base font-bold text-slate-900">
                  {isBn ? 'ডাইনিং রুম স্ট্যাটাস ও নিয়ন্ত্রণ' : 'Dining Room Operations & Status'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isBn ? 'রক্ষণাবেক্ষণ বা সংস্কার কাজের সময় স্ট্যাটাস পরিবর্তন করুন' : 'Toggle room status (Open, Closed, Maintenance)'}
                </p>
              </div>

              <div className="space-y-3">
                {hallOverview.diningRooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 text-sm">{isBn ? room.nameBn : room.name}</strong>
                        <span className="text-slate-500 font-mono">({room.capacity} seats)</span>
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        {isBn ? 'দায়িত্বরত:' : 'Duty Manager:'} {room.managerRole}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {(['Open', 'Closed', 'Under maintenance'] as DiningRoomStatus[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleUpdateRoomStatus(room.id, st)}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                            room.status === st
                              ? st === 'Open'
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : st === 'Under maintenance'
                                ? 'bg-amber-600 text-white shadow-2xs'
                                : 'bg-rose-600 text-white shadow-2xs'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Cutoff Schedule Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-700" />
                  <span>{isBn ? 'মিল অন/অফ কাট-অফ সময়' : 'Cutoff Schedule'}</span>
                </h3>
              </div>

              {cutoffSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{cutoffSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveCutoff} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isBn ? 'দৈনিক কাট-অফ আওয়ার (২৪ ঘণ্টা ফরম্যাট)' : 'Daily Cutoff Hour (24h format)'}
                  </label>
                  <input
                    type="number"
                    min={12}
                    max={23}
                    value={cutoffInput}
                    onChange={(e) => setCutoffInput(parseInt(e.target.value) || 20)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                  <div className="text-[11px] text-slate-500 mt-1">
                    {isBn
                      ? `বর্তমান সময়সূচি: রাত ${cutoffInput % 12 || 12}:০০ টা (পূর্বের দিন)`
                      : `Current cutoff: ${cutoffInput % 12 || 12}:00 PM the previous day`}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#1E3A8A] text-white font-bold rounded-xl hover:bg-blue-900 transition-colors cursor-pointer"
                >
                  {isBn ? 'কাট-অফ সময় সংরক্ষণ' : 'Save Cutoff Setting'}
                </button>
              </form>
            </div>

            {/* Calculated Monthly Meal Rate Card */}
            <div className="bg-linear-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-sm space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                {isBn ? 'চলতি মাসের হিসাবকৃত মিল রেট' : 'Current Month Calculated Rate'}
              </span>
              <div className="text-3xl font-black font-mono text-emerald-400">
                BDT {calculatedRate.calculatedRate}
              </div>
              <div className="text-xs text-blue-100 space-y-1 pt-2 border-t border-white/10">
                <div className="flex justify-between">
                  <span>{isBn ? 'মোট বাজার ব্যয়:' : 'Total Bazar Spend:'}</span>
                  <span className="font-mono">BDT {calculatedRate.totalCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isBn ? 'মোট মিল হিসাব:' : 'Total Served Meals:'}</span>
                  <span className="font-mono">{calculatedRate.totalMeals}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: MENU PLANNER */}
      {activeTab === 'menu' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isBn ? 'সাপ্তাহিক ডাইনিং মেনু প্ল্যানার' : 'Weekly Dining Menu Planner'}
              </h2>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'মেনু সম্পাদনা বা প্রকাশনার সময় স্বয়ংক্রিয় ভার্সন এবং অডিট হিস্ট্রি তৈরি হয়'
                  : 'Menus are append-only; changes increment version and require a reason'}
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              // Real enforcement must move to Firestore rules / Cloud Functions.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyMenus.map((menu) => (
              <div
                key={menu.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-sm">
                      {isBn ? menu.dayOfWeekBn : menu.dayOfWeek}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                      v{menu.version || 1}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                    {menu.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {isMealAllowedForHall(selectedHallId, 'breakfast') && (
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">Breakfast:</span>
                      <p className="text-slate-700 line-clamp-1">{menu.breakfast.items.join(', ')}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Lunch:</span>
                    <p className="text-slate-700 line-clamp-1">{menu.lunch.items.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Dinner:</span>
                    <p className="text-slate-700 line-clamp-1">{menu.dinner.items.join(', ')}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenMenuEditor(menu)}
                  className="w-full mt-2 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {isBn ? 'মেনু সম্পাদন ও প্রকাশ' : 'Edit & Publish Version'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB: GUEST REQUESTS */}
      {activeTab === 'guests' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">
              {isBn ? 'মেহমান মিল আবেদন অনুমোদন কিউ' : 'Guest Meal Review & Approvals'}
            </h2>
            <p className="text-xs text-slate-500">
              {isBn ? 'শিক্ষার্থীদের মেহমান মিল অনুমোদন বা বাতিল করুন' : 'Approve or decline guest meal tokens'}
            </p>
          </div>

          <div className="space-y-3">
            {guestRequests.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                {isBn ? 'কোনো মেহমান মিল আবেদন নেই।' : 'No guest meal requests.'}
              </div>
            ) : (
              guestRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 text-sm">{req.studentName}</strong>
                      <span className="font-mono text-slate-500">({req.studentId})</span>
                      <span className="font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded">
                        {req.mealType}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      {isBn ? 'তারিখ:' : 'Date:'} <strong className="text-slate-800">{req.date}</strong> |{' '}
                      {isBn ? 'মেহমান:' : 'Guests:'} <strong className="text-slate-800">{req.guestCount}</strong>
                    </div>
                    <p className="text-slate-500 italic">"{req.reason}"</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status === 'PENDING' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleReviewGuestRequest(req.id, 'APPROVED')}
                          className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                          {isBn ? 'অনুমোদন' : 'Approve'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReviewGuestRequest(req.id, 'REJECTED')}
                          className="px-3.5 py-1.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors cursor-pointer"
                        >
                          {isBn ? 'বাতিল' : 'Decline'}
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 6. TAB: BAZAR & COST LEDGER */}
      {activeTab === 'bazar' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isBn ? 'বাজার খরচ এন্ট্রি ও অডিট খতিয়ান' : 'Bazar Expenditure & Cost Ledger'}
              </h2>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'দৈনিক চাল, ডাল, মাছ, মাংস ও সবজি ক্রয়ের হিসাব যা দিয়ে মিল রেট নির্ধারিত হয়'
                  : 'Append-only daily expenditure entries with mandatory reason for corrections'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setBazarModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] text-white text-xs font-bold rounded-xl hover:bg-blue-900 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? 'নতুন বাজার এন্ট্রি' : 'Add Bazar Cost Entry'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Item Description</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3 text-right">Amount (BDT)</th>
                  <th className="p-3">Entered By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {bazarEntries.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono">{b.date}</td>
                    <td className="p-3 font-semibold text-slate-900">{b.item}</td>
                    <td className="p-3 font-mono">{b.quantity}</td>
                    <td className="p-3 text-right font-bold font-mono text-slate-900">
                      BDT {b.amount.toLocaleString()}
                    </td>
                    <td className="p-3 font-mono text-slate-500">{b.enteredBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. TAB: COMPLAINTS QUEUE */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">
              {isBn ? 'খাবারের মান ও পরিচ্ছন্নতা অভিযোগ কিউ' : 'Quality & Hygiene Complaint Queue'}
            </h2>
            <p className="text-xs text-slate-500">
              {isBn ? 'শিক্ষার্থীদের অভিযোগ পর্যালোচনা এবং তদন্তের পর নিষ্পত্তি' : 'Investigate and resolve student dining complaints'}
            </p>
          </div>

          <div className="space-y-3">
            {complaints.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                {isBn ? 'কোনো অভিযোগ জমা নেই।' : 'No complaints reported.'}
              </div>
            ) : (
              complaints.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700">{c.referenceNumber}</span>
                      <span className="uppercase text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                        {c.category}
                      </span>
                      {c.isAnonymous ? (
                        <span className="text-[10px] font-bold text-slate-500 italic">
                          ({isBn ? 'বেনামী অভিযোগ' : 'Anonymous'})
                        </span>
                      ) : (
                        <span className="text-slate-600 font-medium">
                          {c.studentName} ({c.studentId})
                        </span>
                      )}
                    </div>
                    <p className="text-slate-800">{c.description}</p>
                    {c.resolutionNotes && (
                      <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        <strong>{isBn ? 'গৃহীত ব্যবস্থা:' : 'Action Taken:'}</strong> {c.resolutionNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                        c.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'UNDER_REVIEW'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedComplaint(c);
                        setComplaintActionStatus(c.status);
                        setComplaintActionNotes(c.resolutionNotes || '');
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                    >
                      {isBn ? 'ব্যবস্থা নিন' : 'Action'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 8. TAB: DISH SUGGESTIONS RANKED BY VOTES */}
      {activeTab === 'suggestions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">
              {isBn ? 'শিক্ষার্থীদের প্রস্তাবিত খাবার (ভোটের ক্রমানুসারে)' : 'Dish Suggestions Ranked by Student Votes'}
            </h2>
            <p className="text-xs text-slate-500">
              {isBn ? 'জনপ্রিয় খাবারগুলো গ্রহণ বা কারণ দর্শিয়ে বাতিল করুন' : 'Accept popular dishes for future menus or decline with a reason'}
            </p>
          </div>

          <div className="space-y-3">
            {suggestions.map((sugg) => (
              <div
                key={sugg.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{sugg.dishName}</span>
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {sugg.voteCount} {isBn ? 'ভোট' : 'votes'}
                    </span>
                    {sugg.status === 'ACCEPTED' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {isBn ? 'অনুমোদিত' : 'Accepted'}
                      </span>
                    )}
                    {sugg.status === 'DECLINED' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {isBn ? 'বাতিল' : 'Declined'}
                      </span>
                    )}
                  </div>
                  {sugg.description && <p className="text-slate-600">{sugg.description}</p>}
                  {sugg.reviewReason && (
                    <div className="text-[11px] text-blue-700 font-medium">
                      {isBn ? 'ম্যানেজার মন্তব্য:' : 'Manager Feedback:'} {sugg.reviewReason}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSuggestion(sugg);
                      setSuggestionActionStatus('ACCEPTED');
                      setSuggestionActionReason(sugg.reviewReason || '');
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    {isBn ? 'গ্রহণ করুন' : 'Accept'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSuggestion(sugg);
                      setSuggestionActionStatus('DECLINED');
                      setSuggestionActionReason(sugg.reviewReason || '');
                    }}
                    className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {isBn ? 'বাতিল করুন' : 'Decline'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. TAB: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">
              {isBn ? 'ডাইনিং ও মেস কার্যক্রম অডিট ট্রেইল' : 'Dining Operations Audit Trail'}
            </h2>
            <p className="text-xs text-slate-500">
              {isBn ? 'মেনু প্রকাশ, বাজার খরচ এবং স্ট্যাটাস পরিবর্তনের অপরিবর্তনীয় লগ' : 'Append-only immutable record of all staff operations'}
            </p>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-800 text-[11px] bg-blue-50 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-800 mt-1">{log.details}</p>
                </div>
                <span className="text-slate-500 font-mono text-[11px] shrink-0">By: {log.actorRole}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Edit Menu Modal */}
      {editMenuModalOpen && selectedMenuToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-200">
              Edit Menu - {selectedMenuToEdit.dayOfWeek} (v{(selectedMenuToEdit.version || 1) + 1})
            </h3>

            <form onSubmit={handleSaveMenu} className="space-y-3 text-xs">
              {isMealAllowedForHall(selectedHallId, 'breakfast') && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Breakfast Items (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={editMenuBreakfast}
                    onChange={(e) => setEditMenuBreakfast(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Lunch Items (comma separated)</label>
                <input
                  type="text"
                  required
                  value={editMenuLunch}
                  onChange={(e) => setEditMenuLunch(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Dinner Items (comma separated)</label>
                <input
                  type="text"
                  required
                  value={editMenuDinner}
                  onChange={(e) => setEditMenuDinner(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mandatory Change Reason</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seasonal fish availability [REPLACE WITH REAL CONTENT]"
                  value={editMenuReason}
                  onChange={(e) => setEditMenuReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditMenuModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded-xl cursor-pointer"
                >
                  Publish New Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Bazar Entry Modal */}
      {bazarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-200">
              Record Bazar Expenditure
            </h3>

            <form onSubmit={handleAddBazarEntry} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Miniket Rice, Broiler Chicken [REPLACE WITH REAL CONTENT]"
                  value={bazarItem}
                  onChange={(e) => setBazarItem(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Quantity</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 200 kg, 50 Litres"
                  value={bazarQty}
                  onChange={(e) => setBazarQty(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Amount (BDT)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={bazarAmount}
                  onChange={(e) => setBazarAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={bazarDate}
                  onChange={(e) => setBazarDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Correction Reason (if modifying)</label>
                <input
                  type="text"
                  placeholder="Optional reason for entry adjustment"
                  value={bazarCorrectionReason}
                  onChange={(e) => setBazarCorrectionReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBazarModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Complaint Action Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-200">
              Update Complaint: {selectedComplaint.referenceNumber}
            </h3>

            <form onSubmit={handleSaveComplaintAction} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Status</label>
                <select
                  value={complaintActionStatus}
                  onChange={(e) => setComplaintActionStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="DISMISSED">Dismissed</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Resolution / Action Notes</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the corrective actions taken..."
                  value={complaintActionNotes}
                  onChange={(e) => setComplaintActionNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Dish Suggestion Action Modal */}
      {selectedSuggestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-200">
              Review Suggestion: "{selectedSuggestion.dishName}"
            </h3>

            <form onSubmit={handleSaveSuggestionAction} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Decision</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSuggestionActionStatus('ACCEPTED')}
                    className={`flex-1 py-2 rounded-xl font-bold cursor-pointer ${
                      suggestionActionStatus === 'ACCEPTED'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuggestionActionStatus('DECLINED')}
                    className={`flex-1 py-2 rounded-xl font-bold cursor-pointer ${
                      suggestionActionStatus === 'DECLINED'
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Decline
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mandatory Reason</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State reason for accepting or declining..."
                  value={suggestionActionReason}
                  onChange={(e) => setSuggestionActionReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSuggestion(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
};
