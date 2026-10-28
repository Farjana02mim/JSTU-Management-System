import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { NoticeItem } from '../../components/common/NoticeItem';
import { EmptyState } from '../../components/common/EmptyState';
import { useLanguage } from '../../contexts/LanguageContext';
import { NoticeCategory } from '../../types';
import { noticesSeedData } from '../../data/seedData';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';

const CATEGORIES: Array<NoticeCategory | 'All'> = [
  'All',
  'Academic',
  'Exam',
  'Admission',
  'Scholarship',
  'Administration',
  'Emergency'
];

export const NoticesPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter ONLY published status (security requirement) from managed content
  const publishedNotices = useMemo(() => {
    const store = SharedDataStoreManager.getInstance().getStore();
    const source = store.managedNotices && store.managedNotices.length > 0 ? store.managedNotices : noticesSeedData;
    return source.filter((n) => n.status === 'published');
  }, []);

  const filteredNotices = useMemo(() => {
    return publishedNotices.filter((notice) => {
      const matchesCategory =
        selectedCategory === 'All' || notice.category === selectedCategory;

      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        term === '' ||
        notice.title.toLowerCase().includes(term) ||
        notice.titleBn.toLowerCase().includes(term) ||
        notice.referenceNumber.toLowerCase().includes(term) ||
        (notice.department && notice.department.toLowerCase().includes(term)) ||
        notice.summary.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [publishedNotices, selectedCategory, searchTerm]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage) || 1;
  const paginatedNotices = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCategoryChange = (cat: NoticeCategory | 'All') => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 bg-white">
      <SEOHead
        title={isBn ? 'বিশ্ববিদ্যালয় নোটিশ ও বিজ্ঞপ্তি' : 'University Notices & Circulars'}
        description="Official published circulars, exam schedules, and administrative orders of JSTU."
      />

      <Breadcrumb items={[{ label: isBn ? 'বিজ্ঞপ্তি' : 'Notices' }]} />

      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
          {isBn ? 'দাপ্তরিক ও একাডেমিক নোটিশ' : 'Official Circular Repository'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          {isBn ? 'বিশ্ববিদ্যালয়ের নোটিশ বোর্ড' : 'University Notices'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {isBn
            ? 'রেজিস্ট্রার, পরীক্ষা নিয়ন্ত্রক দপ্তর ও বিভাগসমূহ কর্তৃক জারিকৃত অফিসিয়াল সার্কুলার ও প্রজ্ঞাপনসমূহ।'
            : 'Access authenticated administrative circulars, semester exam schedules, and policy orders issued by JSTU authorities.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="w-full md:w-80">
            <Input
              type="text"
              placeholder={isBn ? 'বিজ্ঞপ্তি বা রেফারেন্স খুঁজুন...' : 'Search circulars, subject, ref...'}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Category Filter Pills (clean white buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#1E3A8A] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {cat === 'All' ? (isBn ? 'সকল' : 'All') : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Indicators */}
        {(searchTerm || selectedCategory !== 'All') && (
          <div className="flex items-center justify-between text-xs text-slate-500 bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-xl">
            <span>
              {isBn ? 'অনুসন্ধান ফলাফল:' : 'Found:'} <strong>{filteredNotices.length}</strong> {isBn ? 'টি বিজ্ঞপ্তি' : 'notices matching criteria'}
            </span>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-[#1E3A8A] hover:underline font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isBn ? 'ফিল্টার মুছুন' : 'Reset Filters'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Notices List */}
      {paginatedNotices.length > 0 ? (
        <div className="divide-y divide-[#E2E8F0] bg-white border border-[#E2E8F0] rounded-2xl shadow-xs">
          {paginatedNotices.map((notice) => (
            <NoticeItem key={notice.id} notice={notice} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={isBn ? 'কোনো বিজ্ঞপ্তি পাওয়া যায়নি' : 'No Notices Found'}
          description={
            isBn
              ? 'আপনার অনুসন্ধানের সাথে মেলে এমন কোনো প্রকাশিত বিজ্ঞপ্তি পাওয়া যায়নি।'
              : 'There are no published circulars matching the selected filters.'
          }
          actionLabel={isBn ? 'সব বিজ্ঞপ্তি দেখুন' : 'Clear Filters'}
          onAction={handleResetFilters}
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-6 text-xs text-slate-600">
          <div>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredNotices.length} total)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              {isBn ? 'পূর্ববর্তী' : 'Previous'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              {isBn ? 'পরবর্তী' : 'Next'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
