import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  FileText,
  BadgeAlert,
  ChevronRight,
  Info
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { HallId, DailyMealMenu, DiningRoomStatus } from '../../types/hallDining';
import { isMealAllowedForHall, getHallDiningConfig } from '../../config/hallDiningConfig';

export const HallDiningPublicPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const store = SharedDataStoreManager.getInstance();

  const [selectedHallId, setSelectedHallId] = useState<HallId>('hall-a');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [complaintRefInput, setComplaintRefInput] = useState('');
  const [complaintSearchResult, setComplaintSearchResult] = useState<any | null>(null);
  const [hasSearchedComplaint, setHasSearchedComplaint] = useState(false);

  const hallOverviews = store.getHallDiningOverviews();
  const currentHall = hallOverviews[selectedHallId] || hallOverviews['hall-a'];
  const weeklyMenus = store.getDiningWeeklyMenus(selectedHallId);
  const todayMenu = store.getTodayMealMenu(selectedHallId);

  const activeMenu = weeklyMenus.find((m) => m.dayOfWeek === selectedDay) || weeklyMenus[0];
  const specialMeals = store.getSpecialMealEvents(selectedHallId);

  const daysList: Array<{ en: DailyMealMenu['dayOfWeek']; bn: string }> = [
    { en: 'Monday', bn: 'সোমবার' },
    { en: 'Tuesday', bn: 'মঙ্গলবার' },
    { en: 'Wednesday', bn: 'বুধবার' },
    { en: 'Thursday', bn: 'বৃহস্পতিবার' },
    { en: 'Friday', bn: 'শুক্রবার' },
    { en: 'Saturday', bn: 'শনিবার' },
    { en: 'Sunday', bn: 'রবিবার' }
  ];

  const handleSearchComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintRefInput.trim()) return;
    const found = store.checkDiningComplaintStatus(complaintRefInput.trim());
    setComplaintSearchResult(found || null);
    setHasSearchedComplaint(true);
  };

  const getStatusBadge = (status: DiningRoomStatus) => {
    switch (status) {
      case 'Open':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{isBn ? 'খোলা রয়েছে' : 'Open'}</span>
          </span>
        );
      case 'Under maintenance':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>{isBn ? 'সংস্কার কাজ চলছে' : 'Under maintenance'}</span>
          </span>
        );
      case 'Closed':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>{isBn ? 'সাময়িক বন্ধ' : 'Closed'}</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* 1. Header Banner */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700 mb-2">
                <Utensils className="w-4 h-4" />
                <span>{isBn ? 'ক্যাম্পাস জীবন ও আবাসিক হল' : 'Campus Life & Residential Halls'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {isBn ? 'হল ডাইনিং ব্যবস্থাপনা ও খাদ্য সেবা' : 'Hall Dining & Mess Management'}
              </h1>
              <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
                {isBn
                  ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের আবাসিক হলসমূহের পুষ্টিকর দৈনিক খাদ্যতালিকা, ডাইনিং রুমের সময়সূচি এবং স্বচ্ছ মেস ব্যবস্থাপনা।'
                  : 'Nutritious daily meal schedules, dining room timings, weekly menu plans, and transparent mess services for JSTU residential dormitories.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/student/dining"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E3A8A] text-white rounded-xl text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm"
              >
                <span>{isBn ? 'শিক্ষার্থী ডাইনিং পোর্টাল' : 'Student Dining Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                <span>{isBn ? 'স্টাফ লগইন' : 'Staff Login'}</span>
              </Link>
            </div>
          </div>

          {/* Safety Disclaimer Banner */}
          <div className="mt-6 p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">
                {isBn ? 'ডেমো মোড সতর্কতা: ' : 'Demo Mode Notice: '}
              </span>
              <span>
                {isBn
                  ? 'এটি ডেমো সংস্করণ। প্রদর্শিত হল, প্রোভোস্ট, মেস ফি ও সময়সূচির সকল মান কাল্পনিক এবং [REPLACE WITH REAL CONTENT] চিহ্নিত।'
                  : 'This is a student project prototype. All hall details, provost titles, prices, and phone numbers are demo placeholders marked [REPLACE WITH REAL CONTENT].'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hall Selector Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2">
          {(['hall-a', 'hall-b'] as HallId[]).map((hId) => {
            const h = hallOverviews[hId];
            const isSelected = selectedHallId === hId;
            return (
              <button
                key={hId}
                type="button"
                onClick={() => setSelectedHallId(hId)}
                className={`flex-1 min-w-[200px] flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1E3A8A] text-white shadow-sm font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Utensils className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-700'}`} />
                  <div className="text-left">
                    <div className="text-sm leading-tight">{isBn ? h.nameBn : h.name}</div>
                    <div className={`text-[11px] font-normal ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                      {h.diningRooms.length} {isBn ? 'টি ডাইনিং রুম' : 'Dining Rooms'}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {isBn ? 'সক্রিয়' : 'Active'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Dining Rooms & Menus */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Dining Rooms Overview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isBn ? `${currentHall.nameBn}-এর ডাইনিং হলসমূহ` : `Dining Rooms - ${currentHall.name}`}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn ? 'আসন ক্ষমতা, বর্তমান স্ট্যাটাস ও সময়সূচি' : 'Seating capacity, active status & service hours'}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                {currentHall.provostTitle}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentHall.diningRooms.map((room) => (
                <div
                  key={room.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:border-slate-300 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{isBn ? room.nameBn : room.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span>
                          {isBn ? 'ধারণক্ষমতা:' : 'Capacity:'} <strong>{room.capacity}</strong> {isBn ? 'জন' : 'seats'}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(room.status)}
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 text-xs space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {isBn ? 'তত্ত্বাবধায়ক:' : 'Manager:'} <span className="text-slate-700">{room.managerRole}</span>
                    </div>
                    <div className="space-y-1 text-slate-600 font-mono text-[11px]">
                      {isMealAllowedForHall(selectedHallId, 'breakfast') && room.mealTimes.breakfast && (
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-sans">{isBn ? 'সকালের নাস্তা:' : 'Breakfast:'}</span>
                          <span>{room.mealTimes.breakfast}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">{isBn ? 'দুপুরের খাবার:' : 'Lunch:'}</span>
                        <span>{room.mealTimes.lunch}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">{isBn ? 'নৈশভোজ:' : 'Dinner:'}</span>
                        <span>{room.mealTimes.dinner}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Today's Menu Highlight */}
          {todayMenu && (
            <div className="bg-linear-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <h3 className="text-base font-bold text-white">
                    {isBn ? 'আজকের খাবার মেনু' : "Today's Featured Menu"} ({isBn ? todayMenu.dayOfWeekBn : todayMenu.dayOfWeek})
                  </h3>
                </div>
                {todayMenu.isSpecialMeal && (
                  <span className="px-3 py-1 bg-amber-400 text-amber-950 text-xs font-black rounded-full uppercase tracking-wider">
                    {isBn ? 'বিশেষ ভোজ দিবস' : 'Special Feast Meal'}
                  </span>
                )}
              </div>

              <div className={`grid grid-cols-1 ${isMealAllowedForHall(selectedHallId, 'breakfast') ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4 mt-2`}>
                {isMealAllowedForHall(selectedHallId, 'breakfast') && (
                  <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
                    <div className="text-xs uppercase font-extrabold text-blue-200 tracking-wider mb-2">
                      {isBn ? 'সকাল (Breakfast)' : 'Breakfast'}
                    </div>
                    <ul className="text-xs space-y-1 text-white">
                      {(isBn ? todayMenu.breakfast.itemsBn : todayMenu.breakfast.items).map((item, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
                  <div className="text-xs uppercase font-extrabold text-amber-200 tracking-wider mb-2">
                    {isBn ? 'দুপুর (Lunch)' : 'Lunch'}
                  </div>
                  <ul className="text-xs space-y-1 text-white">
                    {(isBn ? todayMenu.lunch.itemsBn : todayMenu.lunch.items).map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
                  <div className="text-xs uppercase font-extrabold text-emerald-200 tracking-wider mb-2">
                    {isBn ? 'রাত (Dinner)' : 'Dinner'}
                  </div>
                  <ul className="text-xs space-y-1 text-white">
                    {(isBn ? todayMenu.dinner.itemsBn : todayMenu.dinner.items).map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Section: Festival & Special Meals Highlights */}
          {specialMeals.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/80 mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-200 text-amber-900 rounded-lg">
                    <Sparkles className="w-5 h-5 text-amber-800" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-amber-950">
                      {isBn ? 'আসন্ন উৎসব ও স্পেশাল মিল ইভেন্ট' : 'Upcoming Festival & Special Feast Meals'}
                    </h3>
                    <p className="text-xs text-amber-900">
                      {isBn ? 'বিশেষ আয়োজন ও ভোজ সূচি' : 'Special feast arrangements & menu notices'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2.5 py-1 rounded-full border border-amber-300">
                  {isBn ? 'স্পেশাল মিল' : 'Feast Day'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specialMeals.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 bg-white rounded-xl border border-amber-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {isBn ? ev.titleBn : ev.title}
                        </h4>
                        <span className="text-xs text-slate-600 font-medium">
                          {ev.date} • {ev.mealType}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {(ev.extraCharge || ev.extraChargeBDT || 0) > 0 ? `+৳${ev.extraCharge || ev.extraChargeBDT}` : (isBn ? 'নিয়মিত রেট' : 'Regular Rate')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {isBn ? ev.descriptionBn : ev.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <span>
                        {isBn ? 'কাট-অফ সময়:' : 'Cutoff:'} <strong>{ev.signupCutoff}</strong>
                      </span>
                      <span className="font-semibold text-blue-800">
                        {ev.isMandatory
                          ? (isBn ? 'স্বয়ংক্রিয় অন্তর্ভুক্তি' : 'Auto-included (Opt-out available)')
                          : (isBn ? 'সাইন-আপ আবশ্যক' : 'Sign-up required')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition & Allergen Disclaimer */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-700">
            <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">
                {isBn ? 'পুষ্টি ও অ্যালার্জেন লেবেল সংক্রান্ত তথ্য:' : 'Nutrition & Allergen Label Notice:'}
              </span>{' '}
              {isBn
                ? 'খাবারের ক্যালোরি ও প্রোটিন মান আনুমানিক ডেমো পরিমাপ ("Approximate values, check with the dining manager")। কোনো অ্যালার্জি বা স্বাস্থ্যগত বিধিনিষেধ থাকলে সরাসরি ডাইনিং ম্যানেজারের সাথে কথা বলুন।'
                : 'Approximate values, check with the dining manager. Nutrition figures and allergen tags are indicative estimates only. No individual health or dietetic advice is provided.'}
            </div>
          </div>

          {/* Section: Weekly Menu Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-700" />
                  <span>{isBn ? 'সাপ্তাহিক রুটিন মেনু' : 'Weekly Menu Planner'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn ? 'প্রতিদিনের ব্রেকফাস্ট, লাঞ্চ ও ডিনারের বিস্তারিত তালিকা' : 'Complete 7-day breakfast, lunch & dinner chart'}
                </p>
              </div>

              {/* Day Selector Pills */}
              <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-xl">
                {daysList.map((d) => (
                  <button
                    key={d.en}
                    type="button"
                    onClick={() => setSelectedDay(d.en)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      selectedDay === d.en
                        ? 'bg-[#1E3A8A] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {isBn ? d.bn : d.en.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {activeMenu ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">
                      {isBn ? activeMenu.dayOfWeekBn : activeMenu.dayOfWeek}
                    </span>
                    {activeMenu.isSpecialMeal && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded">
                        {isBn ? 'বিশেষ ভোজ দিবস' : 'Special Meal'}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    {isBn ? 'অনুমোদিত ও প্রকাশিত মেনু' : 'Published & Verified Menu'}
                  </span>
                </div>

                <div className={`grid grid-cols-1 ${isMealAllowedForHall(selectedHallId, 'breakfast') ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
                  {/* Breakfast Box */}
                  {isMealAllowedForHall(selectedHallId, 'breakfast') && (
                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                          {isBn ? 'সকালের নাস্তা' : 'Breakfast'}
                        </span>
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <ul className="text-xs text-slate-700 space-y-1.5 min-h-[90px]">
                        {(isBn ? activeMenu.breakfast.itemsBn : activeMenu.breakfast.items).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-blue-700 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200 font-mono">
                        {activeMenu.breakfast.calorieEst}
                      </div>
                    </div>
                  )}

                  {/* Lunch Box */}
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                        {isBn ? 'দুপুরের খাবার' : 'Lunch'}
                      </span>
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1.5 min-h-[90px]">
                      {(isBn ? activeMenu.lunch.itemsBn : activeMenu.lunch.items).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200 font-mono">
                      {activeMenu.lunch.calorieEst}
                    </div>
                  </div>

                  {/* Dinner Box */}
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                        {isBn ? 'নৈশভোজ' : 'Dinner'}
                      </span>
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1.5 min-h-[90px]">
                      {(isBn ? activeMenu.dinner.itemsBn : activeMenu.dinner.items).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-700 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200 font-mono">
                      {activeMenu.dinner.calorieEst}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                {isBn ? 'মেনু লোড করা সম্ভব হয়নি।' : 'No menu available for this day.'}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Rates, Cutoff Rules, Notices & Complaint Checker */}
        <div className="space-y-6">
          {/* Meal Rates Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-700" />
              <span>{isBn ? 'মিল রেট ও চার্জ (ডেমো)' : 'Meal Rates (Demo)'}</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600">{isBn ? 'সকালের নাস্তা' : 'Breakfast'}</span>
                <span className="font-bold font-mono text-slate-900">
                  BDT {currentHall.mealRates.breakfastRate} [REPLACE WITH REAL CONTENT]
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600">{isBn ? 'দুপুরের খাবার' : 'Lunch'}</span>
                <span className="font-bold font-mono text-slate-900">
                  BDT {currentHall.mealRates.lunchRate} [REPLACE WITH REAL CONTENT]
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600">{isBn ? 'নৈশভোজ' : 'Dinner'}</span>
                <span className="font-bold font-mono text-slate-900">
                  BDT {currentHall.mealRates.dinnerRate} [REPLACE WITH REAL CONTENT]
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
                <span className="font-semibold">{isBn ? 'আনুমানিক দৈনিক গড়' : 'Daily Est. Mess Rate'}</span>
                <span className="font-bold font-mono">
                  BDT {currentHall.mealRates.monthlyEstimatedRate} [REPLACE WITH REAL CONTENT]
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 leading-normal">
              {isBn
                ? '* মেস রেট সম্পূর্ণ বাজার খরচের ওপর ভিত্তি করে প্রতি মাসের শেষে সমন্বয় করা হয়।'
                : '* Final meal rate is adjusted at month end based on actual bazar purchases.'}
            </div>
          </div>

          {/* Dining Rules Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{isBn ? 'ডাইনিং নিয়মাবলী' : 'Dining Regulations'}</span>
            </h3>

            <ul className="text-xs text-slate-600 space-y-2">
              {currentHall.rules.map((rule) => (
                <li key={rule.id} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isBn ? rule.ruleBn : rule.ruleEn}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Track Complaint Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-700" />
              <span>{isBn ? 'অভিযোগের অগ্রগতি চেক করুন' : 'Track Complaint Status'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {isBn
                ? 'আপনার অভিযোগ ট্র্যাকিং রেফারেন্স নম্বর দিন (যেমন: DC-2026-0842):'
                : 'Enter your complaint reference number (e.g. DC-2026-0842):'}
            </p>

            <form onSubmit={handleSearchComplaint} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={complaintRefInput}
                  onChange={(e) => setComplaintRefInput(e.target.value)}
                  placeholder="DC-2026-XXXX"
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#1E3A8A] text-white text-xs font-bold rounded-xl hover:bg-blue-900 transition-colors cursor-pointer"
                >
                  {isBn ? 'খুঁজুন' : 'Check'}
                </button>
              </div>
            </form>

            {hasSearchedComplaint && (
              <div className="mt-3 p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                {complaintSearchResult ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-700">{complaintSearchResult.referenceNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {complaintSearchResult.status}
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-2">{complaintSearchResult.description}</p>
                    {complaintSearchResult.resolutionNotes && (
                      <div className="pt-2 border-t border-slate-200 text-slate-700">
                        <strong>{isBn ? 'ব্যবস্থা:' : 'Action Taken:'}</strong> {complaintSearchResult.resolutionNotes}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-rose-600 flex items-center gap-1.5">
                    <BadgeAlert className="w-4 h-4 shrink-0" />
                    <span>{isBn ? 'উক্ত নম্বরে কোনো অভিযোগ পাওয়া যায়নি।' : 'No complaint found with this reference.'}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Contact Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-700" />
              <span>{isBn ? 'ডাইনিং ও মেস যোগাযোগ' : 'Mess Office Contact'}</span>
            </h3>

            <div className="text-xs space-y-2 text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-mono">{currentHall.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-mono">{currentHall.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
