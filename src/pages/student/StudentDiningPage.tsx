import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Printer,
  X,
  Send,
  Shield,
  HelpCircle,
  AlertTriangle,
  FileCheck,
  Star,
  Info,
  QrCode
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import {
  HallId,
  DailyMealMenu,
  MealOnOffSetting,
  GuestMealRequest,
  MealType,
  DishSuggestion,
  ComplaintCategory,
  StudentDiningBilling
} from '../../types/hallDining';
import { isMealAllowedForHall } from '../../config/hallDiningConfig';

export const StudentDiningPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const store = SharedDataStoreManager.getInstance();

  const studentId = profile?.studentId || (user as any)?.studentId || 'JSTU2026001';
  const studentName = profile?.fullName || user?.displayName || 'Tanvir Ahmed';

  // Student dining profile
  const diningProfile = store.getStudentDiningProfile(studentId);
  const hallId = diningProfile.hallId;
  const hallOverview = store.getHallDiningOverview(hallId);
  const cutoffHour = hallOverview.cutoffHour || 20;

  // Active tab inside student portal
  const [activeTab, setActiveTab] = useState<'meals' | 'billing' | 'guest' | 'feedback' | 'complaints'>('meals');

  // Menus
  const todayMenu = store.getTodayMealMenu(hallId);

  // Meal On/Off dates: tomorrow + next 3 days
  const [upcomingDates, setUpcomingDates] = useState<Array<{ dateStr: string; displayStr: string; isTomorrow: boolean }>>([]);
  const [mealSettings, setMealSettings] = useState<Record<string, { breakfast: boolean; lunch: boolean; dinner: boolean }>>({});
  const [mealToggleMessage, setMealToggleMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Billing & Payment
  const [billings, setBillings] = useState<StudentDiningBilling[]>([]);
  const [selectedBillForPay, setSelectedBillForPay] = useState<StudentDiningBilling | null>(null);
  const [payGateway, setPayGateway] = useState<'bKash' | 'Nagad' | 'DBBL'>('bKash');
  const [activeReceipt, setActiveReceipt] = useState<StudentDiningBilling | null>(null);

  // Guest Meal Request state
  const [guestRequests, setGuestRequests] = useState<GuestMealRequest[]>([]);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [guestDate, setGuestDate] = useState('');
  const [guestMealType, setGuestMealType] = useState<MealType>('dinner');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [guestReason, setGuestReason] = useState('');

  // Rating & Feedback state
  const [ratingMealType, setRatingMealType] = useState<MealType>('dinner');
  const [starCount, setStarCount] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSuccessMsg, setRatingSuccessMsg] = useState<string | null>(null);

  // Dish Suggestion state
  const [suggestions, setSuggestions] = useState<DishSuggestion[]>([]);
  const [dishNameInput, setDishNameInput] = useState('');
  const [dishDescInput, setDishDescInput] = useState('');
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [suggestionSuccess, setSuggestionSuccess] = useState<string | null>(null);

  // Complaint state
  const [complaintCategory, setComplaintCategory] = useState<ComplaintCategory>('food_quality');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintPhotoUrl, setComplaintPhotoUrl] = useState('');
  const [isAnonymousComplaint, setIsAnonymousComplaint] = useState(false);
  const [submittedComplaintRef, setSubmittedComplaintRef] = useState<string | null>(null);
  const [complaintError, setComplaintError] = useState<string | null>(null);

  // Load dates and settings
  const refreshMealData = () => {
    const list: Array<{ dateStr: string; displayStr: string; isTomorrow: boolean }> = [];
    const settingsMap: Record<string, { breakfast: boolean; lunch: boolean; dinner: boolean }> = {};

    const existingSettings = store.getStudentMealOnOff(studentId, hallId);

    for (let i = 1; i <= 4; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const displayStr = d.toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      list.push({ dateStr, displayStr, isTomorrow: i === 1 });

      const found = existingSettings.find((s) => s.dateStr === dateStr);
      if (found) {
        settingsMap[dateStr] = { breakfast: found.breakfast, lunch: found.lunch, dinner: found.dinner };
      } else {
        // Default meals ON
        settingsMap[dateStr] = { breakfast: true, lunch: true, dinner: true };
      }
    }

    setUpcomingDates(list);
    setMealSettings(settingsMap);
  };

  const refreshAll = () => {
    refreshMealData();
    setBillings(store.getStudentDiningBillings(studentId));
    setGuestRequests(
      (store.getStore().diningGuestMealRequests || []).filter((r) => r.studentId === studentId)
    );
    setSuggestions(store.getDishSuggestions(hallId));
  };

  useEffect(() => {
    refreshAll();
  }, [studentId, hallId]);

  // Handle meal on/off toggle
  const handleToggleMeal = (dateStr: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    setMealToggleMessage(null);
    const current = mealSettings[dateStr] || { breakfast: true, lunch: true, dinner: true };
    const nextVal = !current[mealType];

    const result = store.setStudentMealOnOff({
      studentId,
      studentName,
      hallId,
      dateStr,
      breakfast: mealType === 'breakfast' ? nextVal : current.breakfast,
      lunch: mealType === 'lunch' ? nextVal : current.lunch,
      dinner: mealType === 'dinner' ? nextVal : current.dinner
    });

    if (result.success) {
      setMealSettings((prev) => ({
        ...prev,
        [dateStr]: {
          ...prev[dateStr],
          [mealType]: nextVal
        }
      }));
      setMealToggleMessage({
        text: isBn ? 'মিলের স্ট্যাটাস সফলভাবে সংরক্ষিত হয়েছে।' : 'Meal preference updated successfully.',
        isError: false
      });
    } else {
      setMealToggleMessage({
        text: result.message || (isBn ? 'কাট-অফ সময় পেরিয়ে গেছে।' : 'Cutoff time has passed.'),
        isError: true
      });
    }
  };

  // Pay bill
  const handlePayBill = (bill: StudentDiningBilling) => {
    setSelectedBillForPay(bill);
  };

  const handleConfirmPayment = () => {
    if (!selectedBillForPay) return;
    const res = store.payStudentDiningBill(studentId, selectedBillForPay.id, `${payGateway} (Demo Gateway)`);
    if (res.success && res.bill) {
      setActiveReceipt(res.bill);
      setSelectedBillForPay(null);
      setBillings(store.getStudentDiningBillings(studentId));
    }
  };

  // Submit guest meal
  const handleSubmitGuestMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestDate) return;

    store.submitGuestMealRequest({
      studentId,
      studentName,
      hallId,
      date: guestDate,
      mealType: guestMealType,
      guestCount,
      reason: guestReason || '[REPLACE WITH REAL CONTENT]'
    });

    setGuestModalOpen(false);
    setGuestDate('');
    setGuestReason('');
    setGuestRequests(
      (store.getStore().diningGuestMealRequests || []).filter((r) => r.studentId === studentId)
    );
  };

  // Submit Rating
  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    setRatingSuccessMsg(null);
    const todayStr = new Date().toISOString().split('T')[0];

    const res = store.submitMealRating({
      studentId,
      hallId,
      date: todayStr,
      mealType: ratingMealType,
      rating: starCount,
      comment: ratingComment
    });

    if (res.success) {
      setRatingSuccessMsg(isBn ? 'আপনার মূল্যবান রেটিং গৃহীত হয়েছে!' : 'Your meal rating was recorded!');
      setRatingComment('');
    } else {
      setRatingSuccessMsg(res.message || (isBn ? 'আপনি ইতিমধ্যে রেটিং দিয়েছেন।' : 'Rating already submitted.'));
    }
  };

  // Submit Dish Suggestion
  const handleSubmitSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestionError(null);
    setSuggestionSuccess(null);

    const res = store.submitDishSuggestion({
      studentId,
      hallId,
      dishName: dishNameInput,
      description: dishDescInput
    });

    if (res.success) {
      setSuggestionSuccess(isBn ? 'মেনু পরামর্শ সফলভাবে জমা হয়েছে!' : 'Dish suggestion submitted for voting!');
      setDishNameInput('');
      setDishDescInput('');
      setSuggestions(store.getDishSuggestions(hallId));
    } else {
      setSuggestionError(res.message || (isBn ? 'পরামর্শ জমা দেওয়া যায়নি।' : 'Failed to submit suggestion.'));
    }
  };

  // Vote on Dish Suggestion
  const handleVote = (suggestionId: string) => {
    const res = store.voteDishSuggestion(studentId, suggestionId);
    if (res.success) {
      setSuggestions(store.getDishSuggestions(hallId));
    }
  };

  // Submit Complaint
  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    setComplaintError(null);
    setSubmittedComplaintRef(null);

    if (!complaintDesc.trim()) {
      setComplaintError(isBn ? 'অনুগ্রহ করে বিস্তারিত লিখুন।' : 'Please describe the issue.');
      return;
    }

    const newComp = store.submitDiningComplaint({
      hallId,
      category: complaintCategory,
      description: complaintDesc,
      photoUrl: complaintPhotoUrl.trim() || undefined,
      isAnonymous: isAnonymousComplaint,
      studentId,
      studentName
    });

    setSubmittedComplaintRef(newComp.referenceNumber);
    setComplaintDesc('');
    setComplaintPhotoUrl('');
  };

  return (
    <DashboardLayout portalTitle={isBn ? 'হল ডাইনিং পোর্টাল' : 'Hall Dining Portal'}>
      <div className="space-y-6">
      {/* 1. Header Banner & Resident Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              <Utensils className="w-4 h-4" />
              <span>{isBn ? 'হল ডাইনিং ও মেস সার্ভিস' : 'Hall Dining & Mess Service'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {isBn ? 'শিক্ষার্থী ডাইনিং ব্যবস্থাপনা' : 'Student Dining Portal'}
            </h1>
          </div>

          {/* Assigned Hall & Dining Room Card and Token CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/dining/token"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>{isBn ? 'আমার মিল টোকেন কিউআর' : 'My Meal Token QR'}</span>
            </Link>

            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-xs">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-800">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">{isBn ? diningProfile.hallNameBn : diningProfile.hallName}</div>
                <div className="text-slate-500">{isBn ? diningProfile.diningRoomNameBn : diningProfile.diningRoomName}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Disclaimer notice */}
        <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              {isBn
                ? 'কাট-অফ সময়: প্রতিদিন রাত ৮:০০ টার মধ্যে পরবর্তী দিনের মিল বন্ধ না করলে চার্জ গণ্য হবে।'
                : `Cutoff rule: Modifications for the next day must be set before ${cutoffHour % 12 || 12}:00 PM today.`}
            </span>
          </div>
          <span className="font-mono font-bold text-[11px] text-blue-700">
            [REPLACE WITH REAL CONTENT]
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-5">
          {[
            { id: 'meals', label: 'Meal On/Off & Menu', labelBn: 'মিল অন/অফ ও মেনু', icon: Utensils },
            { id: 'billing', label: 'Monthly Mess Bill', labelBn: 'মাসিক মেস বিল', icon: CreditCard },
            { id: 'guest', label: 'Guest Meals', labelBn: 'মেহমান মিল', icon: Users },
            { id: 'feedback', label: 'Ratings & Dish Votes', labelBn: 'মতামত ও খাদ্য পছন্দ', icon: ThumbsUp },
            { id: 'complaints', label: 'Quality & Hygiene Box', labelBn: 'মান ও পরিচ্ছন্নতা অভিযোগ', icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
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

      {/* 2. TAB: MEAL ON/OFF & TODAY'S MENU */}
      {activeTab === 'meals' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left (2 Cols): Meal on/off controls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {isBn ? 'আগামী দিনগুলোর মিল অন/অফ নির্ধারণ' : 'Daily Meal On/Off Settings'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isBn ? 'খাবারের অপচয় রোধে অনুপস্থিত থাকলে মিল বন্ধ রাখুন' : 'Toggle OFF if you do not plan to eat'}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                  {isBn ? 'কাটঅফ: রাত ৮:০০ টা' : 'Cutoff: 8:00 PM'}
                </span>
              </div>

              {mealToggleMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    mealToggleMessage.isError
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {mealToggleMessage.isError ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span>{mealToggleMessage.text}</span>
                </div>
              )}

              <div className="space-y-3">
                {upcomingDates.map((item) => {
                  const s = mealSettings[item.dateStr] || { breakfast: true, lunch: true, dinner: true };
                  return (
                    <div
                      key={item.dateStr}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{item.displayStr}</span>
                          {item.isTomorrow && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {isBn ? 'আগামীকাল' : 'Tomorrow'}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.dateStr}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Breakfast button (only for halls offering breakfast) */}
                        {isMealAllowedForHall(hallId, 'breakfast') && (
                          <button
                            type="button"
                            onClick={() => handleToggleMeal(item.dateStr, 'breakfast')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              s.breakfast
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {isBn ? 'নাস্তা' : 'Breakfast'}: {s.breakfast ? 'ON' : 'OFF'}
                          </button>
                        )}

                        {/* Lunch button */}
                        <button
                          type="button"
                          onClick={() => handleToggleMeal(item.dateStr, 'lunch')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            s.lunch
                              ? 'bg-amber-600 text-white shadow-2xs'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {isBn ? 'দুপুর' : 'Lunch'}: {s.lunch ? 'ON' : 'OFF'}
                        </button>

                        {/* Dinner button */}
                        <button
                          type="button"
                          onClick={() => handleToggleMeal(item.dateStr, 'dinner')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            s.dinner
                              ? 'bg-blue-700 text-white shadow-2xs'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {isBn ? 'রাত' : 'Dinner'}: {s.dinner ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Col: Today's Featured Menu & Quick Rules */}
          <div className="space-y-6">
            {todayMenu && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{isBn ? 'আজকের মেনু' : "Today's Menu"}</span>
                  </h3>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    {isBn ? todayMenu.dayOfWeekBn : todayMenu.dayOfWeek}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {isMealAllowedForHall(hallId, 'breakfast') && (
                    <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                      <span className="text-[11px] font-bold uppercase text-blue-800">
                        {isBn ? 'সকালের নাস্তা' : 'Breakfast'}
                      </span>
                      <p className="text-slate-700 mt-1">
                        {(isBn ? todayMenu.breakfast.itemsBn : todayMenu.breakfast.items).join(', ')}
                      </p>
                    </div>
                  )}

                  <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100">
                    <span className="text-[11px] font-bold uppercase text-amber-800">
                      {isBn ? 'দুপুরের খাবার' : 'Lunch'}
                    </span>
                    <p className="text-slate-700 mt-1">
                      {(isBn ? todayMenu.lunch.itemsBn : todayMenu.lunch.items).join(', ')}
                    </p>
                  </div>

                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                    <span className="text-[11px] font-bold uppercase text-emerald-800">
                      {isBn ? 'নৈশভোজ' : 'Dinner'}
                    </span>
                    <p className="text-slate-700 mt-1">
                      {(isBn ? todayMenu.dinner.itemsBn : todayMenu.dinner.items).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Rules Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs text-slate-600">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                {isBn ? 'জরুরি নির্দেশনা' : 'Quick Guidelines'}
              </h3>
              <p>
                {isBn
                  ? 'কাউন্টারে ডিজিটাল আইডি কার্ড প্রদর্শন করে খাবার গ্রহণ নিশ্চিত করুন।'
                  : 'Present your digital student ID at the dining counter for meal verification.'}
              </p>
              <p>
                {isBn
                  ? 'অপচয় রোধ করুন এবং কোনো সমস্যা থাকলে অভিযোগ বাক্সে জানান।'
                  : 'Avoid food wastage. For quality complaints, submit a ticket in the Quality box.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: MONTHLY BILLING & RECEIPT */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isBn ? 'মাসিক মেস বিল ও পেমেন্ট হিস্ট্রি' : 'Monthly Mess Bills & Payment'}
              </h2>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'বাজার খরচ ও মিল কাউন্টের ওপর ভিত্তি করে স্বয়ংক্রিয় হিসাব'
                  : 'Automated meal-rate accounting based on collective mess expenditures'}
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              // Real enforcement must move to Firestore rules / Cloud Functions.
            </span>
          </div>

          <div className="space-y-4">
            {billings.map((bill) => (
              <div
                key={bill.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">{bill.month}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        bill.paymentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {bill.paymentStatus === 'PAID' ? (isBn ? 'পরিশোধিত' : 'Paid') : (isBn ? 'বকেয়া' : 'Unpaid')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-500 block text-[11px]">{isBn ? 'মোট মিল' : 'Total Meals'}</span>
                      <strong className="text-slate-900">{bill.totalMeals}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">{isBn ? 'মিল রেট' : 'Meal Rate'}</span>
                      <strong className="text-slate-900">BDT {bill.mealRate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">{isBn ? 'মোট প্রদেয়' : 'Total Due'}</span>
                      <strong className="text-blue-700 font-mono text-sm">BDT {bill.totalDue}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">{isBn ? 'রশিদ নম্বর' : 'Receipt No'}</span>
                      <span className="font-mono text-slate-700">{bill.receiptNumber || '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {bill.paymentStatus === 'UNPAID' ? (
                    <button
                      type="button"
                      onClick={() => handlePayBill(bill)}
                      className="px-4 py-2.5 bg-[#1E3A8A] text-white text-xs font-bold rounded-xl hover:bg-blue-900 transition-colors cursor-pointer shadow-xs"
                    >
                      {isBn ? 'অনলাইনে পরিশোধ করুন (মক)' : 'Pay Now (Mock)'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveReceipt(bill)}
                      className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{isBn ? 'রশিদ দেখুন' : 'View Receipt'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB: GUEST MEALS */}
      {activeTab === 'guest' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isBn ? 'মেহমান মিল আবেদন ও অনুমতি' : 'Guest Meal Booking & Approvals'}
              </h2>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'মেহমান বা প্রজেক্ট দলের জন্য ডাইনিং ম্যানেজারের অনুমোদন সাপেক্ষে মিল গ্রহণ'
                  : 'Request guest meal tokens with mandatory manager approval at least 12 hours prior'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setGuestModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] text-white text-xs font-bold rounded-xl hover:bg-blue-900 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{isBn ? 'নতুন মেহমান মিল আবেদন' : 'Request Guest Meal'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {guestRequests.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                {isBn ? 'কোনো মেহমান মিল আবেদন পাওয়া যায়নি।' : 'No guest meal requests found.'}
              </div>
            ) : (
              guestRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{req.date}</span>
                      <span className="uppercase text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                        {req.mealType}
                      </span>
                      <span className="font-semibold text-slate-600">
                        ({req.guestCount} {isBn ? 'জন মেহমান' : 'guests'})
                      </span>
                    </div>
                    <p className="text-slate-600">{req.reason}</p>
                    {req.reviewNotes && (
                      <div className="text-[11px] text-blue-700 font-medium">
                        {isBn ? 'ম্যানেজার নোট:' : 'Manager Note:'} {req.reviewNotes}
                      </div>
                    )}
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${
                      req.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : req.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. TAB: FEEDBACK & DISH SUGGESTIONS */}
      {activeTab === 'feedback' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Meal Rating Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{isBn ? 'আজকের খাবারের রেটিং দিন' : 'Rate Today’s Meal'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn ? 'প্রতি মিলে সর্বোচ্চ একটি রেটিং গ্রহণযোগ্য (১-৫ স্টার)' : 'One review per meal per day'}
              </p>
            </div>

            {ratingSuccessMsg && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{ratingSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitRating} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isBn ? 'মিল নির্বাচন করুন' : 'Select Meal'}
                </label>
                <div className="flex gap-2">
                  {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setRatingMealType(m)}
                      className={`flex-1 py-2 rounded-xl font-bold uppercase transition-colors cursor-pointer ${
                        ratingMealType === m
                          ? 'bg-[#1E3A8A] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isBn ? 'রেটিং (১-৫)' : 'Rating (1 to 5 Stars)'}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarCount(star)}
                      className="p-2 transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= starCount ? 'text-amber-500 fill-amber-500' : 'text-slate-500'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isBn ? 'মতামত বা মন্তব্য' : 'Comment'}
                </label>
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder={isBn ? 'খাবারের মান বা স্বাদ সম্পর্কে লিখুন...' : 'Write constructive feedback...'}
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1E3A8A] text-white font-bold rounded-xl hover:bg-blue-900 transition-colors cursor-pointer"
              >
                {isBn ? 'রেটিং জমা দিন' : 'Submit Review'}
              </button>
            </form>
          </div>

          {/* Right: Dish Suggestions & Community Voting */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'মেনুতে নতুন খাবারের প্রস্তাবনা ও ভোট' : 'Dish Suggestions & Student Votes'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn
                  ? 'সপ্তাহে সর্বোচ্চ ৩টি প্রস্তাবনা। নাম গোপন রেখে কেবল ভোট সংখ্যা দেখানো হয়।'
                  : 'Max 3 suggestions per week. Author identity is strictly anonymous.'}
              </p>
            </div>

            {suggestionSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs">
                {suggestionSuccess}
              </div>
            )}
            {suggestionError && (
              <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs">
                {suggestionError}
              </div>
            )}

            {/* Submit Suggestion Form */}
            <form onSubmit={handleSubmitSuggestion} className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isBn ? 'প্রস্তাবিত খাবার (সর্বোচ্চ ২০০ অক্ষর)' : 'Suggested Dish Name (max 200 chars)'}
                </label>
                <input
                  type="text"
                  maxLength={200}
                  value={dishNameInput}
                  onChange={(e) => setDishNameInput(e.target.value)}
                  placeholder={isBn ? 'যেমন: রবিবার সকালে চোলার ডাল ও লুচি' : 'e.g., Kachchi Biryani on Feast Night'}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="text-right text-[10px] text-slate-500 mt-0.5">
                  {dishNameInput.length} / 200
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={dishDescInput}
                  onChange={(e) => setDishDescInput(e.target.value)}
                  placeholder={isBn ? 'সংক্ষিপ্ত কারণ বা বিবরণ (ঐচ্ছিক)' : 'Brief reason or note (optional)'}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                {isBn ? 'প্রস্তাব জমা দিন' : 'Suggest Dish'}
              </button>
            </form>

            {/* Suggestions list */}
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {suggestions.map((sugg) => {
                const hasVoted = sugg.votedStudentIds?.includes(studentId);
                return (
                  <div
                    key={sugg.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-3 text-xs shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{sugg.dishName}</span>
                        {sugg.status === 'ACCEPTED' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {isBn ? 'গৃহীত' : 'Accepted'}
                          </span>
                        )}
                        {sugg.status === 'DECLINED' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                            {isBn ? 'বাতিল' : 'Declined'}
                          </span>
                        )}
                      </div>
                      {sugg.description && <p className="text-slate-600">{sugg.description}</p>}
                      {sugg.reviewReason && (
                        <div className="text-[11px] text-blue-700 font-medium">
                          {isBn ? 'ম্যানেজার প্রতিক্রিয়া:' : 'Manager Note:'} {sugg.reviewReason}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleVote(sugg.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        hasVoted
                          ? 'bg-blue-50 text-blue-700 border border-blue-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-blue-700' : ''}`} />
                      <span>{sugg.voteCount}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB: COMPLAINTS BOX */}
      {activeTab === 'complaints' && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-600" />
              <span>{isBn ? 'খাবারের মান ও পরিচ্ছন্নতা সংক্রান্ত অভিযোগ বাক্স' : 'Quality & Hygiene Complaint Box'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isBn
                ? 'ডাইনিংয়ের যেকোনো সমস্যা সরাসরি হল ডাইনিং ম্যানেজার ও প্রোভোস্টের দৃষ্টিগোচরে আনুন।'
                : 'Submit complaints directly to the dining manager and provost oversight queue.'}
            </p>
          </div>

          {submittedComplaintRef && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{isBn ? 'অভিযোগ সফলভাবে লিপিবদ্ধ হয়েছে!' : 'Complaint Submitted Successfully!'}</span>
              </div>
              <p className="text-emerald-900">
                {isBn ? 'আপনার ট্র্যাকিং রেফারেন্স নম্বর: ' : 'Your Tracking Reference Number: '}
                <strong className="font-mono text-sm bg-white px-2 py-0.5 rounded border border-emerald-300">
                  {submittedComplaintRef}
                </strong>
              </p>
              <p className="text-emerald-800 text-[11px]">
                {isBn
                  ? 'এই নম্বরটি সংরক্ষণ করুন। পাবলিক ডাইনিং পৃষ্ঠায় অথবা এখানে স্ট্যাটাস ট্র্যাক করতে পারবেন।'
                  : 'Save this reference number to track investigation status.'}
              </p>
            </div>
          )}

          {complaintError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{complaintError}</span>
            </div>
          )}

          <form onSubmit={handleSubmitComplaint} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {isBn ? 'অভিযোগের ধরন / ক্যাটাগরি' : 'Category'}
              </label>
              <select
                value={complaintCategory}
                onChange={(e) => setComplaintCategory(e.target.value as ComplaintCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="food_quality">{isBn ? 'খাবারের মান / স্বাদ' : 'Food Quality & Taste'}</option>
                <option value="hygiene">{isBn ? 'পরিচ্ছন্নতা ও স্বাস্থ্যবিধি' : 'Hygiene & Cleanliness'}</option>
                <option value="portion_size">{isBn ? 'খাবারের পরিমাণ' : 'Portion Size'}</option>
                <option value="staff_behavior">{isBn ? 'কাউন্টার স্টাফের আচরণ' : 'Staff Behavior'}</option>
                <option value="timing">{isBn ? 'সময়সূচি সংক্রান্ত' : 'Meal Timings'}</option>
                <option value="other">{isBn ? 'অন্যান্য' : 'Other'}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {isBn ? 'অভিযোগের বিস্তারিত বিবরণ' : 'Detailed Description'}
              </label>
              <textarea
                value={complaintDesc}
                onChange={(e) => setComplaintDesc(e.target.value)}
                placeholder={isBn ? 'ঘটনার তারিখ, সময় ও সুনির্দিষ্ট সমস্যা উল্লেখ করুন...' : 'Describe the exact incident, date, and problem...'}
                rows={4}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {isBn ? 'প্রমাণস্বরূপ ছবির ইউআরএল (ঐচ্ছিক)' : 'Photo Proof URL (Optional)'}
              </label>
              <input
                type="url"
                value={complaintPhotoUrl}
                onChange={(e) => setComplaintPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Anonymous Toggle */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">
                  {isBn ? 'বেনামী (Anonymous) অভিযোগ হিসেবে পাঠান' : 'Submit as Anonymous'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isBn
                    ? 'আপনার নাম বা আইডি ডাটাবেজে সংরক্ষণ করা হবে না।'
                    : 'Your name and student ID will not be recorded in the complaint ticket.'}
                </div>
              </div>
              <input
                type="checkbox"
                checked={isAnonymousComplaint}
                onChange={(e) => setIsAnonymousComplaint(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1E3A8A] text-white font-bold rounded-xl hover:bg-blue-900 transition-colors cursor-pointer shadow-sm"
            >
              {isBn ? 'অভিযোগ জমা দিন' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      )}

      {/* Guest Meal Request Modal */}
      {guestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                {isBn ? 'মেহমান মিল আবেদন ফরম' : 'Request Guest Meal'}
              </h3>
              <button
                type="button"
                onClick={() => setGuestModalOpen(false)}
                className="text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitGuestMeal} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isBn ? 'তারিখ' : 'Date'}
                </label>
                <input
                  type="date"
                  required
                  value={guestDate}
                  onChange={(e) => setGuestDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isBn ? 'মিলের সময়' : 'Meal Type'}
                </label>
                <select
                  value={guestMealType}
                  onChange={(e) => setGuestMealType(e.target.value as MealType)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="breakfast">{isBn ? 'সকালের নাস্তা' : 'Breakfast'}</option>
                  <option value="lunch">{isBn ? 'দুপুরের খাবার' : 'Lunch'}</option>
                  <option value="dinner">{isBn ? 'নৈশভোজ' : 'Dinner'}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isBn ? 'মেহমান সংখ্যা' : 'Guest Count'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isBn ? 'আবেদনের কারণ' : 'Reason'}
                </label>
                <input
                  type="text"
                  required
                  value={guestReason}
                  onChange={(e) => setGuestReason(e.target.value)}
                  placeholder="e.g. Family member visiting campus [REPLACE WITH REAL CONTENT]"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGuestModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded-xl cursor-pointer"
                >
                  {isBn ? 'আবেদন পাঠান' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Flow Modal */}
      {selectedBillForPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                {isBn ? 'মেস বিল পরিশোধ (মক গেটওয়ে)' : 'Pay Mess Bill (Mock Gateway)'}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedBillForPay(null)}
                className="text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">{isBn ? 'মাস:' : 'Month:'}</span>
                <span className="font-bold text-slate-900">{selectedBillForPay.month}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isBn ? 'মোট মিল:' : 'Total Meals:'}</span>
                <span className="font-bold text-slate-900">{selectedBillForPay.totalMeals}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-700 font-bold">{isBn ? 'পরিশোধযোগ্য অর্থ:' : 'Amount Due:'}</span>
                <span className="font-bold text-blue-700 font-mono text-sm">BDT {selectedBillForPay.totalDue}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isBn ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Select Payment Method'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['bKash', 'Nagad', 'DBBL'] as const).map((gw) => (
                  <button
                    key={gw}
                    type="button"
                    onClick={() => setPayGateway(gw)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      payGateway === gw
                        ? 'bg-blue-50 border-blue-600 text-blue-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {gw}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-500">
              * {isBn ? 'এটি একটি ডেমো পেমেন্ট গেটওয়ে। কোনো প্রকৃত অর্থ কাটা হবে না।' : 'This is a demo payment flow. No actual money will be charged.'}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBillForPay(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="flex-1 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded-xl cursor-pointer"
              >
                {isBn ? 'নিশ্চিত করুন' : 'Confirm Pay'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {isBn ? 'ডাইনিং মেস পেমেন্ট রশিদ' : 'Official Mess Bill Receipt'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="space-y-4 border border-slate-200 p-5 rounded-2xl bg-slate-50/50 text-xs">
              <div className="text-center pb-3 border-b border-slate-200 space-y-0.5">
                <div className="font-extrabold text-sm text-slate-900">
                  JAMALPUR SCIENCE & TECHNOLOGY UNIVERSITY
                </div>
                <div className="text-slate-500 font-medium">{diningProfile.hallName} - Dining Mess Office</div>
                <div className="text-[11px] font-mono text-emerald-700 font-bold uppercase mt-1">
                  PAYMENT VERIFIED (DEMO)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-600">
                <div>
                  <span className="text-slate-500 block text-[11px]">{isBn ? 'শিক্ষার্থীর নাম' : 'Student Name'}</span>
                  <strong className="text-slate-900">{activeReceipt.studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">{isBn ? 'আইডি' : 'Student ID'}</span>
                  <strong className="text-slate-900 font-mono">{activeReceipt.studentId}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">{isBn ? 'মাস' : 'Month'}</span>
                  <strong className="text-slate-900">{activeReceipt.month}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">{isBn ? 'রশিদ নম্বর' : 'Receipt No'}</span>
                  <strong className="text-slate-900 font-mono">{activeReceipt.receiptNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">{isBn ? 'পেমেন্ট মেথড' : 'Payment Method'}</span>
                  <span>{activeReceipt.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">{isBn ? 'পরিশোধের সময়' : 'Paid At'}</span>
                  <span className="font-mono">{new Date(activeReceipt.paidAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-900">{isBn ? 'মোট পরিশোধিত অর্থ:' : 'Total Amount Paid:'}</span>
                <span className="font-black text-blue-700 font-mono text-base">BDT {activeReceipt.totalDue}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <Printer className="w-4 h-4" />
                <span>{isBn ? 'প্রিন্ট করুন' : 'Print Receipt'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="flex-1 py-2.5 bg-[#1E3A8A] text-white font-bold rounded-xl hover:bg-blue-900 transition-colors cursor-pointer text-xs"
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
};
