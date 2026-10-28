import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Tag,
  ChevronRight,
  Filter
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useLanguage } from '../../contexts/LanguageContext';
import { newsArticlesData } from '../../data/publicSectionsSeedData';
import { NewsCategory } from '../../types/publicSections';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';

export const NewsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: { key: string; label: string; labelBn: string }[] = [
    { key: 'All', label: 'All News', labelBn: 'সকল সংবাদ' },
    { key: 'Technology', label: 'Technology', labelBn: 'প্রযুক্তি' },
    { key: 'Research', label: 'Research', labelBn: 'গবেষণা' },
    { key: 'Academic', label: 'Academic', labelBn: 'একাডেমিক' },
    { key: 'Campus Life', label: 'Campus Life', labelBn: 'ক্যাম্পাস জীবন' },
    { key: 'Achievements', label: 'Achievements', labelBn: 'অর্জন' },
    { key: 'Administrative', label: 'Administrative', labelBn: 'প্রশাসনিক' }
  ];

  const allPublishedNews = useMemo(() => {
    const store = SharedDataStoreManager.getInstance().getStore();
    const source = store.managedNews && store.managedNews.length > 0 ? store.managedNews : newsArticlesData;
    return source.filter((article: any) => article.status === 'published' || !article.status);
  }, []);

  const filteredNews = allPublishedNews.filter((article: any) => {
    if (selectedCategory !== 'All' && article.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (isBn ? article.titleBn : article.title).toLowerCase().includes(q);
      const matchSummary = (isBn ? article.summaryBn : article.summary).toLowerCase().includes(q);
      const matchTag = article.tags ? article.tags.some((t: string) => t.toLowerCase().includes(q)) : false;
      if (!matchTitle && !matchSummary && !matchTag) return false;
    }
    return true;
  });

  const featuredArticle = allPublishedNews.find((a: any) => a.featured) || allPublishedNews[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12 bg-white">
      <SEOHead
        title={isBn ? 'সংবাদ ও প্রেস বিজ্ঞপ্তি' : 'News & Press Releases'}
        description="Official institutional announcements, academic milestones, and campus press releases from JSTU."
      />

      <Breadcrumb items={[{ label: isBn ? 'সংবাদ' : 'News & Media' }]} />

      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
          {isBn ? 'তথ্য ও জনসংযোগ দপ্তর' : 'Public Relations & Media Center'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          {isBn ? 'জেএসটিইউ সংবাদ ও খবরাখবর' : 'University News & Media'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {isBn
            ? 'বিশ্ববিদ্যালয়ের একাডেমিক সাফল্য, বৈজ্ঞানিক আবিষ্কার, অবকাঠামোগত উন্নয়ন ও শিক্ষার্থী কার্যক্রমের সর্বশেষ প্রতিবেদন।'
            : 'Stay updated with official bulletins, scientific discoveries, academic conferences, and student achievements at JSTU.'}
        </p>
      </div>

      {/* Featured Headline Banner */}
      {featuredArticle && !searchQuery && selectedCategory === 'All' && (
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-md border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 h-64 sm:h-96 w-full overflow-hidden">
              <img
                src={featuredArticle.imageUrl}
                alt={featuredArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="lg:col-span-5 p-6 sm:p-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[11px] uppercase tracking-wider">
                  Featured
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {isBn ? featuredArticle.dateBn : featuredArticle.date}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white hover:text-amber-300 transition-colors leading-snug">
                <Link to={`/news/${featuredArticle.id}`}>
                  {isBn ? featuredArticle.titleBn : featuredArticle.title}
                </Link>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                {isBn ? featuredArticle.summaryBn : featuredArticle.summary}
              </p>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isBn ? featuredArticle.readTimeBn : featuredArticle.readTime}</span>
                </span>
                <Link
                  to={`/news/${featuredArticle.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
                >
                  <span>{isBn ? 'সম্পূর্ণ পড়ুন' : 'Read Full Story'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Category Filters Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isBn ? cat.labelBn : cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-72 relative">
            <Input
              placeholder={isBn ? 'সংবাদ খুঁজুন...' : 'Search articles by keyword...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {isBn
              ? `মোট ${filteredNews.length}টি সংবাদ প্রদর্শিত হচ্ছে`
              : `Showing ${filteredNews.length} articles`}
          </span>
        </div>

        {filteredNews.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Newspaper className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              {isBn ? 'কোনো সংবাদ খুঁজে পাওয়া যায়নি' : 'No news articles match your search criteria'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden border border-[#E2E8F0] bg-white flex flex-col justify-between hover:shadow-md transition group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={article.imageUrl}
                      alt={isBn ? article.titleBn : article.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-xs text-[#1E3A8A] font-bold text-[10px] rounded-lg shadow-xs uppercase tracking-wider">
                      {isBn ? article.categoryBn : article.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{isBn ? article.dateBn : article.date}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{isBn ? article.readTimeBn : article.readTime}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors line-clamp-2 leading-snug">
                      <Link to={`/news/${article.id}`}>
                        {isBn ? article.titleBn : article.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {isBn ? article.summaryBn : article.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/news/${article.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3A8A] hover:underline"
                  >
                    <span>{isBn ? 'বিস্তারিত' : 'Read'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
