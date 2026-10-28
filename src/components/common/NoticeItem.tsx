import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Download } from 'lucide-react';
import { Notice } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

export interface NoticeItemProps {
  notice: Notice;
  compact?: boolean;
}

export const NoticeItem: React.FC<NoticeItemProps> = ({ notice, compact = false }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const title = isBn ? notice.titleBn : notice.title;
  const date = isBn ? notice.publishDateBn : notice.publishDate;
  const dept = isBn ? (notice.departmentBn || '') : (notice.department || '');

  return (
    <article className="group py-4 px-4 sm:px-6 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          {/* Clean unboxed metadata with typographic separators (anti-slop rule) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-blue-700 dark:text-blue-400">{notice.category}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={notice.publishDate}>{date}</time>
            {dept && (
              <>
                <span aria-hidden="true">·</span>
                <span>{dept}</span>
              </>
            )}
            {notice.referenceNumber && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[11px] text-slate-400">{notice.referenceNumber}</span>
              </>
            )}
            {notice.isImportant && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 dark:text-amber-400 font-semibold uppercase text-[10px]">
                  {isBn ? 'জরুরি' : 'Important'}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors leading-snug">
            <Link to={`/notices/${notice.id}`} className="focus-visible:outline-none">
              {title}
            </Link>
          </h3>

          {!compact && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {isBn ? notice.summaryBn : notice.summary}
            </p>
          )}
        </div>

        {/* Action Link */}
        <div className="flex items-center gap-3 shrink-0 pt-1 sm:pt-0">
          <Link
            to={`/notices/${notice.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-900 transition-colors"
          >
            <span>{isBn ? 'বিস্তারিত' : 'Read'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};
