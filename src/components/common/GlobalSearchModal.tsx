import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Bell,
  Newspaper,
  Calendar,
  Building2,
  Users,
  FileText,
  ArrowRight,
  Sparkles,
  Command,
  CornerDownLeft,
  ChevronRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { noticesSeedData, departmentsData } from '../../data/seedData';
import {
  newsArticlesData,
  universityEventsData
} from '../../data/publicSectionsSeedData';
import { departmentFacultyMembers } from '../../data/academicsSeedData';
import { initialManagedStaticPages } from '../../data/contentManagementSeedData';

export type SearchCategoryFilter =
  | 'all'
  | 'notices'
  | 'news'
  | 'departments'
  | 'faculty'
  | 'events'
  | 'pages';

export interface SearchResultItem {
  id: string;
  type: 'notice' | 'news' | 'department' | 'faculty' | 'event' | 'page' | 'portal';
  typeLabel: string;
  typeLabelBn: string;
  title: string;
  titleBn?: string;
  subtitle?: string;
  subtitleBn?: string;
  url: string;
  metaBadge?: string;
  category?: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategoryFilter>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Aggregate searchable items from CMS store and seed data
  const allSearchableItems: SearchResultItem[] = useMemo(() => {
    const store = SharedDataStoreManager.getInstance().getStore();
    const results: SearchResultItem[] = [];

    // 1. Notices (only published)
    const notices =
      store.managedNotices && store.managedNotices.length > 0
        ? store.managedNotices
        : noticesSeedData;
    notices
      .filter((n) => n.status === 'published' || !n.status)
      .forEach((n) => {
        results.push({
          id: `notice-${n.id}`,
          type: 'notice',
          typeLabel: 'Notice',
          typeLabelBn: 'বিজ্ঞপ্তি',
          title: n.title,
          titleBn: n.titleBn,
          subtitle: `${n.category} • Ref: ${n.referenceNumber}`,
          subtitleBn: `${n.category} • স্মারক: ${n.referenceNumber}`,
          url: `/notices/${n.id}`,
          metaBadge: n.publishDate,
          category: n.category
        });
      });

    // 2. News (only published)
    const news =
      store.managedNews && store.managedNews.length > 0
        ? store.managedNews
        : newsArticlesData;
    news
      .filter((a: any) => a.status === 'published' || !a.status)
      .forEach((a: any) => {
        results.push({
          id: `news-${a.id}`,
          type: 'news',
          typeLabel: 'News',
          typeLabelBn: 'সংবাদ',
          title: a.title,
          titleBn: a.titleBn,
          subtitle: a.summary,
          subtitleBn: a.summaryBn,
          url: `/news/${a.id}`,
          metaBadge: a.date,
          category: a.category
        });
      });

    // 3. Departments
    const depts =
      store.managedDepartments && store.managedDepartments.length > 0
        ? store.managedDepartments
        : departmentsData;
    depts.forEach((d: any) => {
      results.push({
        id: `dept-${d.id}`,
        type: 'department',
        typeLabel: 'Department',
        typeLabelBn: 'শিক্ষা বিভাগ',
        title: d.name,
        titleBn: d.nameBn,
        subtitle: `${d.code} • ${d.faculty || 'Engineering & Technology'}`,
        subtitleBn: `${d.code} • ${d.facultyBn || 'প্রকৌশল ও প্রযুক্তি অনুষদ'}`,
        url: `/academics/department/${d.id}`,
        metaBadge: d.code,
        category: d.faculty
      });
    });

    // 4. Faculty Members
    const faculty =
      store.managedFaculty && store.managedFaculty.length > 0
        ? store.managedFaculty
        : departmentFacultyMembers;
    faculty
      .filter((f: any) => f.status === 'published' || !f.status)
      .forEach((f: any) => {
        results.push({
          id: `faculty-${f.id}`,
          type: 'faculty',
          typeLabel: 'Faculty',
          typeLabelBn: 'শিক্ষক প্রোফাইল',
          title: f.name,
          titleBn: f.nameBn,
          subtitle: `${f.designation} • Dept. of ${f.departmentId?.toUpperCase() || 'CSE'}`,
          subtitleBn: `${f.designationBn || f.designation} • ${f.departmentId?.toUpperCase() || 'সিএসই'} বিভাগ`,
          url: `/academics/department/${f.departmentId?.toLowerCase() || 'cse'}?tab=faculty`,
          metaBadge: f.designation,
          category: f.departmentId
        });
      });

    // 5. Events
    const events =
      store.managedEvents && store.managedEvents.length > 0
        ? store.managedEvents
        : universityEventsData;
    events
      .filter((e: any) => e.status === 'published' || !e.status)
      .forEach((e: any) => {
        results.push({
          id: `event-${e.id}`,
          type: 'event',
          typeLabel: 'Event',
          typeLabelBn: 'অনুষ্ঠান',
          title: e.title,
          titleBn: e.titleBn,
          subtitle: `${e.date} • ${e.venue}`,
          subtitleBn: `${e.dateBn || e.date} • ${e.venueBn || e.venue}`,
          url: `/events/${e.id}`,
          metaBadge: e.date,
          category: e.category
        });
      });

    // 6. Static Institutional Pages
    const pages =
      store.managedStaticPages && store.managedStaticPages.length > 0
        ? store.managedStaticPages
        : initialManagedStaticPages;
    pages
      .filter((p) => p.status === 'published')
      .forEach((p) => {
        results.push({
          id: `page-${p.id}`,
          type: 'page',
          typeLabel: 'Institutional Page',
          typeLabelBn: 'প্রাতিষ্ঠানিক পৃষ্ঠা',
          title: p.title,
          titleBn: p.titleBn,
          subtitle: `${p.category || 'General'} • /page/${p.slug}`,
          subtitleBn: `${p.category || 'সাধারণ'} • /page/${p.slug}`,
          url: `/page/${p.slug}`,
          metaBadge: p.category,
          category: p.category
        });
      });

    // 7. Core Quick Links & Portals
    const quickLinks: SearchResultItem[] = [
      {
        id: 'portal-admission',
        type: 'portal',
        typeLabel: 'Admissions',
        typeLabelBn: 'ভর্তি কার্যক্রম',
        title: 'Undergraduate Admission 2026',
        titleBn: 'স্নাতক ভর্তি কার্যক্রম ২০২৬',
        subtitle: 'Online applications, eligibility criteria, and circulars',
        subtitleBn: 'অনলাইন আবেদন, যোগ্যতা ও প্রসপেক্টাস',
        url: '/admission',
        metaBadge: 'Admissions'
      },
      {
        id: 'portal-verify',
        type: 'portal',
        typeLabel: 'Security',
        typeLabelBn: 'নিরাপত্তা',
        title: 'Document & Degree Verification',
        titleBn: 'সনদ ও ফলাফল সত্যতা যাচাই',
        subtitle: 'Public QR verification ledger for tamper-proof academic credentials',
        subtitleBn: 'ডিজিটাল কিউআর কোড ভিত্তিক সনদ যাচাইকরণ',
        url: '/verify',
        metaBadge: 'QR Verify'
      },
      {
        id: 'portal-library',
        type: 'portal',
        typeLabel: 'Library',
        typeLabelBn: 'লাইব্রেরি',
        title: 'Central Library Catalog & Digital Repository',
        titleBn: 'কেন্দ্রীয় লাইব্রেরি ক্যাটালগ ও ডিজিটাল রিপোজিটরি',
        subtitle: 'Search books, research papers, and reserve library seats',
        subtitleBn: 'বই অনুসন্ধান ও লাইব্রেরি আসন সংরক্ষণ',
        url: '/library',
        metaBadge: 'Library'
      },
      {
        id: 'portal-calendar',
        type: 'portal',
        typeLabel: 'Academics',
        typeLabelBn: 'একাডেমিক',
        title: 'Academic Calendar 2026',
        titleBn: 'একাডেমিক ক্যালেন্ডার ২০২৬',
        subtitle: 'Semester schedules, exam timelines, and holidays',
        subtitleBn: 'সেমিস্টার সূচি, পরীক্ষা ও ছুটির তালিকা',
        url: '/academics/calendar',
        metaBadge: 'Calendar'
      },
      {
        id: 'portal-halls',
        type: 'portal',
        typeLabel: 'Student Life',
        typeLabelBn: 'ক্যাম্পাস জীবন',
        title: 'Residential Student Halls',
        titleBn: 'আবাসিক হল ও সিট বরাদ্দ',
        subtitle: 'Muktijoddha Hall & Bangamata Hall accommodation applications',
        subtitleBn: 'মুক্তিযোদ্ধা হল ও বঙ্গমাতা হল সিট বরাদ্দ',
        url: '/student-life/halls',
        metaBadge: 'Halls'
      },
      {
        id: 'portal-downloads',
        type: 'portal',
        typeLabel: 'Downloads',
        typeLabelBn: 'ডাউনলোড',
        title: 'Forms, Circulars & Ordinance Downloads',
        titleBn: 'ফরম, সার্কুলার ও অর্ডিন্যান্স ডাউনলোড',
        subtitle: 'Academic forms, scholarship documents, and statutes',
        subtitleBn: 'একাডেমিক ফরম ও বিধিমালার কপি',
        url: '/downloads',
        metaBadge: 'PDF Forms'
      }
    ];

    return [...results, ...quickLinks];
  }, []);

  // Filter items by category & search query
  const filteredResults = useMemo(() => {
    let items = allSearchableItems;

    // Filter by category
    if (activeCategory === 'notices') items = items.filter((i) => i.type === 'notice');
    else if (activeCategory === 'news') items = items.filter((i) => i.type === 'news');
    else if (activeCategory === 'departments') items = items.filter((i) => i.type === 'department');
    else if (activeCategory === 'faculty') items = items.filter((i) => i.type === 'faculty');
    else if (activeCategory === 'events') items = items.filter((i) => i.type === 'event');
    else if (activeCategory === 'pages') items = items.filter((i) => i.type === 'page');

    if (!query.trim()) {
      // Default recommended / top items when search input is empty
      return items.slice(0, 8);
    }

    const q = query.toLowerCase().trim();
    return items.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchTitleBn = (item.titleBn || '').toLowerCase().includes(q);
      const matchSubtitle = (item.subtitle || '').toLowerCase().includes(q);
      const matchSubtitleBn = (item.subtitleBn || '').toLowerCase().includes(q);
      const matchMeta = (item.metaBadge || '').toLowerCase().includes(q);
      return matchTitle || matchTitleBn || matchSubtitle || matchSubtitleBn || matchMeta;
    });
  }, [allSearchableItems, activeCategory, query]);

  // Handle keyboard navigation inside search list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filteredResults.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    onClose();
    navigate(item.url);
  };

  const getTypeIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'notice':
        return <Bell className="w-4 h-4 text-amber-600" />;
      case 'news':
        return <Newspaper className="w-4 h-4 text-blue-600" />;
      case 'department':
        return <Building2 className="w-4 h-4 text-indigo-600" />;
      case 'faculty':
        return <Users className="w-4 h-4 text-emerald-600" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'page':
        return <FileText className="w-4 h-4 text-sky-600" />;
      case 'portal':
        return <GraduationCap className="w-4 h-4 text-[#1E3A8A]" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Universal Site Search"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 md:p-14 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] mt-4 sm:mt-10 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Search Input Field */}
        <div className="relative border-b border-slate-200 flex items-center px-4 py-3 sm:py-4 gap-3 bg-white">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              isBn
                ? 'বিজ্ঞপ্তি, সংবাদ, বিভাগ, শিক্ষক বা পেজ খুঁজুন...'
                : 'Search notices, news, departments, faculty, events, or pages...'
            }
            className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent outline-none font-medium"
            aria-label="Search site content"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            {isBn ? 'ফিল্টার:' : 'Filter:'}
          </span>
          {[
            { key: 'all', label: 'All', labelBn: 'সকল' },
            { key: 'notices', label: 'Notices', labelBn: 'বিজ্ঞপ্তি' },
            { key: 'news', label: 'News', labelBn: 'সংবাদ' },
            { key: 'departments', label: 'Departments', labelBn: 'বিভাগ' },
            { key: 'faculty', label: 'Faculty', labelBn: 'শিক্ষক' },
            { key: 'events', label: 'Events', labelBn: 'ইভেন্ট' },
            { key: 'pages', label: 'Pages', labelBn: 'পেজ' }
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key as SearchCategoryFilter);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                activeCategory === cat.key
                  ? 'bg-[#1E3A8A] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {isBn ? cat.labelBn : cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredResults.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-2">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                {isBn ? `"${query}" এর জন্য কোনো ফলাফল পাওয়া যায়নি` : `No results found for "${query}"`}
              </p>
              <p className="text-xs text-slate-400">
                {isBn
                  ? 'অনুগ্রহ করে বানানের সঠিকতা যাচাই করুন অথবা ভিন্ন কীওয়ার্ড ব্যবহার করুন।'
                  : 'Check for typos or try searching with a more general keyword like "CSE", "Admission", or "Exam".'}
              </p>
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const isSelected = index === selectedIndex;
              const displayTitle = isBn && item.titleBn ? item.titleBn : item.title;
              const displaySubtitle = isBn && item.subtitleBn ? item.subtitleBn : item.subtitle;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/80 border border-blue-200 text-[#1E3A8A]'
                      : 'hover:bg-slate-50 border border-transparent text-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-white shadow-2xs' : 'bg-slate-100'
                      }`}
                    >
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {isBn ? item.typeLabelBn : item.typeLabel}
                        </span>
                        {item.metaBadge && (
                          <span className="text-[10px] font-mono text-slate-400 truncate">
                            {item.metaBadge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">
                        {displayTitle}
                      </h4>
                      {displaySubtitle && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5 max-w-md">
                          {displaySubtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center text-slate-400">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1E3A8A]">
                        <span>{isBn ? 'প্রবেশ করুন' : 'Open'}</span>
                        <CornerDownLeft className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Helper Keyboard Strip */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↓</kbd>
              <span>{isBn ? 'ন্যাভিগেট' : 'Navigate'}</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↵</kbd>
              <span>{isBn ? 'নির্বাচন' : 'Select'}</span>
            </span>
          </div>
          <span className="font-medium text-slate-500">
            {filteredResults.length} {isBn ? 'ফলাফল' : 'results'}
          </span>
        </div>
      </div>
    </div>
  );
};
