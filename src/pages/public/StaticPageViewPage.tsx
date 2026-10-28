import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Calendar, User, ArrowLeft, AlertTriangle } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { EmptyState } from '../../components/common/EmptyState';
import { SafeMarkdown } from '../../components/common/SafeMarkdown';
import { useLanguage } from '../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { initialManagedStaticPages } from '../../data/contentManagementSeedData';

export const StaticPageViewPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const store = SharedDataStoreManager.getInstance().getStore();
  const pages =
    store.managedStaticPages && store.managedStaticPages.length > 0
      ? store.managedStaticPages
      : initialManagedStaticPages;

  const page = pages.find((p) => p.slug === slug || p.id === slug);

  if (!page || page.status !== 'published') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 bg-white">
        <EmptyState
          icon={<AlertTriangle className="w-8 h-8 text-amber-500" />}
          title={isBn ? 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি বা অপ্রকাশিত' : 'Page Not Found or Unpublished'}
          description={
            isBn
              ? 'নিরাপত্তা নীতিমালা অনুযায়ী কেবলমাত্র প্রকাশিত (published) পেজসমূহ প্রদর্শিত হয়।'
              : 'In accordance with site rules, only pages with published status are publicly accessible.'
          }
          actionLabel={isBn ? 'মূল পাতায় ফিরে যান' : 'Back to Home'}
          onAction={() => (window.location.href = '/')}
        />
      </div>
    );
  }

  const title = isBn && page.titleBn ? page.titleBn : page.title;
  const content = isBn && page.contentBn ? page.contentBn : page.content;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8 bg-white animate-fadeIn">
      <SEOHead title={title} description={`${title} - Jamalpur Science & Technology University`} />

      <Breadcrumb
        items={[
          { label: isBn ? 'মূল পাতা' : 'Home', to: '/' },
          { label: isBn ? 'তথ্য ও নীতিমালা' : 'Institutional Pages' },
          { label: title }
        ]}
      />

      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1E3A8A] transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBn ? 'মূল পাতায় ফিরে যান' : 'Back to Home'}</span>
        </Link>
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1E3A8A]">
            <FileText className="w-3.5 h-3.5" />
            <span>{page.category || 'General'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            {title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{isBn ? 'হালনাগাদ:' : 'Updated:'} {page.updatedAt.split('T')[0]}</span>
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{isBn ? 'অনুমোদন:' : 'Authorized by:'} {page.updatedBy}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base">
        <SafeMarkdown content={content} />
      </div>
    </div>
  );
};
