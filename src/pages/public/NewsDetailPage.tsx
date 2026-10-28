import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Tag,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { SafeMarkdown } from '../../components/common/SafeMarkdown';
import { useLanguage } from '../../contexts/LanguageContext';
import { newsArticlesData } from '../../data/publicSectionsSeedData';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [copiedLink, setCopiedLink] = useState(false);

  const store = SharedDataStoreManager.getInstance().getStore();
  const allArticles = store.managedNews && store.managedNews.length > 0 ? store.managedNews : newsArticlesData;
  const article: any = allArticles.find((a: any) => a.id === id);

  if (!article || (article.status && article.status !== 'published')) {
    return <Navigate to="/news" replace />;
  }

  const relatedArticles = allArticles
    .filter((a: any) => a.id !== article.id && a.status === 'published')
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-10 bg-white animate-fadeIn">
      <SEOHead
        title={isBn ? article.titleBn : article.title}
        description={article.summary}
      />

      <Breadcrumb
        items={[
          { label: isBn ? 'সংবাদ' : 'News', to: '/news' },
          { label: isBn ? article.categoryBn : article.category }
        ]}
      />

      {/* Back button */}
      <div>
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1E3A8A] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBn ? 'সকল সংবাদে ফিরে যান' : 'Back to All News'}</span>
        </Link>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-[#1E3A8A] text-xs font-bold uppercase tracking-wider">
            {isBn ? article.categoryBn : article.category}
          </span>
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{isBn ? article.dateBn : article.date}</span>
          </span>
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{isBn ? article.readTimeBn : article.readTime}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
          {isBn ? article.titleBn : article.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed border-l-4 border-[#1E3A8A] pl-4 italic">
          {isBn ? article.summaryBn : article.summary}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-b border-slate-200 pb-4">
          <span className="flex items-center gap-1.5 font-medium">
            <User className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>{article.author}</span>
          </span>
          <div className="flex items-center gap-2">
            {copiedLink && (
              <span className="text-xs text-emerald-600 font-semibold animate-fadeIn">
                {isBn ? 'লিংক কপি করা হয়েছে!' : 'Link copied to clipboard!'}
              </span>
            )}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: article.title, url: window.location.href }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 3000);
                }
              }}
              className="flex items-center gap-1.5 text-slate-500 hover:text-[#1E3A8A] cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isBn ? 'শেয়ার' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Hero Photo */}
      <div className="rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-xs">
        <img
          src={article.imageUrl}
          alt={isBn ? article.titleBn : article.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-72 sm:h-[420px] object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="p-3 bg-slate-50 text-[11px] text-slate-500 text-center border-t border-slate-200">
          Official University Photo &bull; JSTU Public Relations Archive /* [REPLACE WITH REAL CONTENT] */
        </div>
      </div>

      {/* Article Body */}
      <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
        {(() => {
          const raw = isBn ? (article.contentBn || article.content) : article.content;
          const text = Array.isArray(raw) ? raw.join('\n\n') : String(raw || '');
          return <SafeMarkdown content={text} />;
        })()}
      </div>

      {/* Tags Strip */}
      <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-[#E2E8F0]">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" />
          <span>Tags:</span>
        </span>
        {article.tags && article.tags.map((tag: string) => (
          <span
            key={tag}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Related Articles */}
      <div className="space-y-4 pt-10 border-t border-[#E2E8F0]">
        <h3 className="text-xl font-bold text-[#0F172A]">
          {isBn ? 'সম্পর্কিত অন্যান্য সংবাদ' : 'Related Stories'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {relatedArticles.map((rel) => (
            <Card key={rel.id} className="p-4 border border-[#E2E8F0] bg-white space-y-2 hover:shadow-xs transition">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E3A8A]">
                {isBn ? rel.categoryBn : rel.category}
              </span>
              <h4 className="text-xs font-bold text-[#0F172A] line-clamp-2">
                <Link to={`/news/${rel.id}`} className="hover:text-[#1E3A8A]">
                  {isBn ? rel.titleBn : rel.title}
                </Link>
              </h4>
              <span className="text-[10px] text-slate-400 block font-mono">
                {isBn ? rel.dateBn : rel.date}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
