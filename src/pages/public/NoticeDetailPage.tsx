import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  Download,
  Share2,
  Printer,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { EmptyState } from '../../components/common/EmptyState';
import { SafeMarkdown } from '../../components/common/SafeMarkdown';
import { useLanguage } from '../../contexts/LanguageContext';
import { noticesSeedData } from '../../data/seedData';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';

export const NoticeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const store = SharedDataStoreManager.getInstance().getStore();
  const allNotices = store.managedNotices && store.managedNotices.length > 0 ? store.managedNotices : noticesSeedData;
  const notice = allNotices.find((n) => n.id === id);

  // Security check: only documents with status 'published' are accessible to the public
  if (!notice || notice.status !== 'published') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 bg-white">
        <EmptyState
          icon={<AlertTriangle className="w-8 h-8 text-amber-500" />}
          title={isBn ? 'বিজ্ঞপ্তিটি পাওয়া যায়নি বা অপ্রকাশিত' : 'Notice Not Found or Unpublished'}
          description={
            isBn
              ? 'নিরাপত্তা নীতিমালা অনুযায়ী কেবলমাত্র প্রকাশিত (published) বিজ্ঞপ্তিসমূহ সর্বসাধারণের জন্য উন্মুক্ত।'
              : 'In accordance with security rules, only notices with published status are publicly accessible.'
          }
          actionLabel={isBn ? 'সকল বিজ্ঞপ্তিতে ফিরে যান' : 'Back to Notices'}
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  const title = isBn ? notice.titleBn : notice.title;
  const body = isBn ? notice.bodyBn : notice.body;
  const date = isBn ? notice.publishDateBn : notice.publishDate;
  const dept = isBn ? (notice.departmentBn || '') : (notice.department || '');

  const relatedNotices = allNotices
    .filter((n) => n.status === 'published' && n.id !== notice.id && n.category === notice.category)
    .slice(0, 3);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 bg-white">
      <SEOHead
        title={title}
        description={isBn ? notice.summaryBn : notice.summary}
      />

      <Breadcrumb
        items={[
          { label: isBn ? 'বিজ্ঞপ্তি' : 'Notices', to: '/notices' },
          { label: notice.referenceNumber || notice.id }
        ]}
      />

      {/* Main Notice Article */}
      <article className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs p-6 sm:p-10 space-y-6">
        {/* Notice Meta Header */}
        <div className="space-y-3 border-b border-[#E2E8F0] pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-[#1E3A8A]">
              {notice.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>{date}</span>
            {dept && (
              <>
                <span aria-hidden="true">·</span>
                <span>{dept}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-500 text-[11px]">
              Ref: {notice.referenceNumber}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-snug">
            {title}
          </h1>
        </div>

        {/* Notice Text Content */}
        <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700">
          <SafeMarkdown content={body} />
        </div>

        {/* Institutional Sign-off Block */}
        <div className="pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p className="font-semibold text-[#0F172A]">By Order of Vice Chancellor</p>
            <p>Office of the Registrar &bull; JSTU</p>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-700 font-mono text-[11px] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digital Ledger Verified</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
          <Link to="/notices">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              {isBn ? 'বিজ্ঞপ্তি তালিকায় ফিরে যান' : 'Back to Notices'}
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
              {isBn ? 'প্রিন্ট' : 'Print'}
            </Button>
            {notice.attachmentUrl && (
              <a href={notice.attachmentUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                  {isBn ? 'সংযুক্তি ডাউনলোড' : 'Download PDF'}
                </Button>
              </a>
            )}
          </div>
        </div>
      </article>

      {/* Related Notices in same category */}
      {relatedNotices.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-[#0F172A]">
            {isBn ? 'একই বিভাগের অন্যান্য বিজ্ঞপ্তি' : 'Related Notices in this Category'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedNotices.map((rel) => (
              <Card key={rel.id} padding="sm" className="space-y-2">
                <span className="text-[11px] font-mono text-slate-400">{rel.publishDate}</span>
                <h3 className="text-xs font-bold text-[#0F172A] line-clamp-2">
                  <Link to={`/notices/${rel.id}`} className="hover:text-[#1E3A8A]">
                    {isBn ? rel.titleBn : rel.title}
                  </Link>
                </h3>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
