import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  X,
  Bell,
  Newspaper,
  Calendar,
  Building2,
  Users,
  FileText,
  GraduationCap,
  ArrowRight,
  Filter,
  Sparkles
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { EmptyState } from '../../components/common/EmptyState';
import { useLanguage } from '../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { noticesSeedData, departmentsData } from '../../data/seedData';
import {
  newsArticlesData,
  universityEventsData
} from '../../data/publicSectionsSeedData';
import { departmentFacultyMembers } from '../../data/academicsSeedData';
import { initialManagedStaticPages } from '../../data/contentManagementSeedData';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('type') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query, type: activeCategory });
  };

  // Compile full search corpus
  const allSearchItems = useMemo(() => {
    const store = SharedDataStoreManager.getInstance().getStore();
    const list: Array<{
      id: string;
      type: 'notice' | 'news' | 'department' | 'faculty' | 'event' | 'page' | 'portal';
      typeLabel: string;
      typeLabelBn: string;
      title: string;
      titleBn?: string;
      summary: string;
      summaryBn?: string;
      url: string;
      badge?: string;
    }> = [];

    // Notices
    const notices =
      store.managedNotices && store.managedNotices.length > 0
        ? store.managedNotices
        : noticesSeedData;
    notices
      .filter((n) => n.status === 'published' || !n.status)
      .forEach((n) => {
        list.push({
          id: `notice-${n.id}`,
          type: 'notice',
          typeLabel: 'Notice',
          typeLabelBn: 'বিজ্ঞপ্তি',
          title: n.title,
          titleBn: n.titleBn,
          summary: n.summary,
          summaryBn: n.summaryBn || n.summary,
          url: `/notices/${n.id}`,
          badge: `${n.category} • ${n.publishDate}`
        });
      });

    // News
    const news =
      store.managedNews && store.managedNews.length > 0
        ? store.managedNews
        : newsArticlesData;
    news
      .filter((a: any) => a.status === 'published' || !a.status)
      .forEach((a: any) => {
        list.push({
          id: `news-${a.id}`,
          type: 'news',
          typeLabel: 'News',
          typeLabelBn: 'সংবাদ',
          title: a.title,
          titleBn: a.titleBn,
          summary: a.summary,
          summaryBn: a.summaryBn || a.summary,
          url: `/news/${a.id}`,
          badge: `${a.category} • ${a.date}`
        });
      });

    // Departments
    const depts =
      store.managedDepartments && store.managedDepartments.length > 0
        ? store.managedDepartments
        : departmentsData;
    depts.forEach((d: any) => {
      list.push({
        id: `dept-${d.id}`,
        type: 'department',
        typeLabel: 'Department',
        typeLabelBn: 'শিক্ষা বিভাগ',
        title: d.name,
        titleBn: d.nameBn,
        summary: d.overview,
        summaryBn: d.overviewBn || d.overview,
        url: `/academics/department/${d.id}`,
        badge: `${d.code} • Established ${d.established}`
      });
    });

    // Faculty
    const faculty =
      store.managedFaculty && store.managedFaculty.length > 0
        ? store.managedFaculty
        : departmentFacultyMembers;
    faculty
      .filter((f: any) => f.status === 'published' || !f.status)
      .forEach((f: any) => {
        list.push({
          id: `faculty-${f.id}`,
          type: 'faculty',
          typeLabel: 'Faculty',
          typeLabelBn: 'শিক্ষক',
          title: f.name,
          titleBn: f.nameBn,
          summary: `${f.designation} at Department of ${f.departmentId?.toUpperCase() || 'CSE'}. Research interests: ${(f.researchInterests || []).join(', ')}.`,
          summaryBn: `${f.designationBn || f.designation}, ${f.departmentId?.toUpperCase() || 'সিএসই'} বিভাগ।`,
          url: `/academics/department/${f.departmentId?.toLowerCase() || 'cse'}?tab=faculty`,
          badge: f.designation
        });
      });

    // Events
    const events =
      store.managedEvents && store.managedEvents.length > 0
        ? store.managedEvents
        : universityEventsData;
    events
      .filter((e: any) => e.status === 'published' || !e.status)
      .forEach((e: any) => {
        list.push({
          id: `event-${e.id}`,
          type: 'event',
          typeLabel: 'Event',
          typeLabelBn: 'অনুষ্ঠান',
          title: e.title,
          titleBn: e.titleBn,
          summary: `${e.summary} — Organized by ${e.organizer} at ${e.venue}.`,
          summaryBn: `${e.summary} — স্থান: ${e.venueBn || e.venue}`,
          url: `/events/${e.id}`,
          badge: `${e.category} • ${e.date}`
        });
      });

    // Static Pages
    const pages =
      store.managedStaticPages && store.managedStaticPages.length > 0
        ? store.managedStaticPages
        : initialManagedStaticPages;
    pages
      .filter((p) => p.status === 'published')
      .forEach((p) => {
        list.push({
          id: `page-${p.id}`,
          type: 'page',
          typeLabel: 'Page',
          typeLabelBn: 'পেজ',
          title: p.title,
          titleBn: p.titleBn,
          summary: p.content.slice(0, 160) + '...',
          summaryBn: p.contentBn ? p.contentBn.slice(0, 160) + '...' : '',
          url: `/page/${p.slug}`,
          badge: p.category
        });
      });

    return list;
  }, []);

  const results = useMemo(() => {
    let items = allSearchItems;
    if (activeCategory !== 'all') {
      items = items.filter((i) => i.type === activeCategory);
    }
    if (!query.trim()) {
      return items;
    }
    const q = query.toLowerCase().trim();
    return items.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchTitleBn = (item.titleBn || '').toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchSummaryBn = (item.summaryBn || '').toLowerCase().includes(q);
      const matchBadge = (item.badge || '').toLowerCase().includes(q);
      return matchTitle || matchTitleBn || matchSummary || matchSummaryBn || matchBadge;
    });
  }, [allSearchItems, activeCategory, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 bg-white min-h-[70vh]">
      <SEOHead
        title={query ? `${isBn ? 'অনুসন্ধান ফলাফল:' : 'Search Results for:'} "${query}"` : isBn ? 'সার্বজনীন অনুসন্ধান' : 'University Global Search'}
        description="Search notices, faculty directories, academic degree programs, circulars, and events across Jamalpur Science & Technology University."
      />

      <Breadcrumb
        items={[
          { label: isBn ? 'মূলপাতা' : 'Home', to: '/' },
          { label: isBn ? 'অনুসন্ধান' : 'Search' }
        ]}
      />

      {/* Search Header Banner */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 space-y-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
          {isBn ? 'প্রাতিষ্ঠানিক সার্চ ইঞ্জিন' : 'Universal Campus Search'}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          {isBn ? 'জেএসটিইউ তথ্য ও রেকর্ড অনুসন্ধান' : 'Explore JSTU Information & Records'}
        </h1>

        <form onSubmit={handleSearchSubmit} className="max-w-3xl flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isBn ? 'বিজ্ঞপ্তি, সংবাদ, বিভাগ, শিক্ষক বা পেজ খুঁজুন...' : 'Search by keyword (e.g. CSE, Admission, Notice, Syllabus)...'}
              className="w-full pl-11 pr-4 py-3 text-sm sm:text-base border border-slate-300 rounded-xl bg-white shadow-2xs focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSearchParams({});
                }}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-sm rounded-xl shadow-2xs transition-all shrink-0 cursor-pointer"
          >
            {isBn ? 'খুঁজুন' : 'Search'}
          </button>
        </form>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {[
            { key: 'all', label: 'All Results', labelBn: 'সকল ফলাফল' },
            { key: 'notice', label: 'Notices', labelBn: 'বিজ্ঞপ্তি' },
            { key: 'news', label: 'News', labelBn: 'সংবাদ' },
            { key: 'department', label: 'Departments', labelBn: 'শিক্ষা বিভাগ' },
            { key: 'faculty', label: 'Faculty', labelBn: 'শিক্ষক' },
            { key: 'event', label: 'Events', labelBn: 'অনুষ্ঠান' },
            { key: 'page', label: 'Static Pages', labelBn: 'প্রাতিষ্ঠানিক পেজ' }
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => {
                setActiveCategory(cat.key);
                setSearchParams({ q: query, type: cat.key });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-[#1E3A8A] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {isBn ? cat.labelBn : cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
          <span>
            {isBn ? `মোট ${results.length} টি ফলাফল প্রদর্শিত হচ্ছে` : `Showing ${results.length} result(s)`}
            {query && <span> for <strong>"{query}"</strong></span>}
          </span>
          <span className="font-mono text-[11px]">Index v2.0</span>
        </div>

        {results.length === 0 ? (
          <EmptyState
            title={isBn ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No Results Found'}
            description={
              isBn
                ? 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো তথ্য পাওয়া যায়নি। অনুগ্রহ করে কীওয়ার্ড পরিবর্তন করে পুনরায় চেষ্টা করুন।'
                : 'No entries matched your search query. Try broadening your terms or removing category filters.'
            }
            actionLabel={isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
            onAction={() => {
              setQuery('');
              setActiveCategory('all');
              setSearchParams({});
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((item) => {
              const displayTitle = isBn && item.titleBn ? item.titleBn : item.title;
              const displaySummary = isBn && item.summaryBn ? item.summaryBn : item.summary;

              return (
                <Link
                  key={item.id}
                  to={item.url}
                  className="p-5 bg-white border border-[#E2E8F0] hover:border-[#1E3A8A] rounded-xl hover:shadow-xs transition-all flex flex-col justify-between group space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-[#1E3A8A] border border-slate-200">
                        {isBn ? item.typeLabelBn : item.typeLabel}
                      </span>
                      {item.badge && (
                        <span className="text-[11px] text-slate-400 font-mono truncate">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors line-clamp-2">
                      {displayTitle}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {displaySummary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#1E3A8A] font-semibold">
                    <span>{isBn ? 'বিস্তারিত দেখুন' : 'Explore details'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
