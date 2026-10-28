import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Safeguard: Filter out redundant root home item if passed by caller
  const sanitizedItems = items.filter(
    (item) => item.to !== '/' && !['home', 'মূলপাতা', 'মূল পাতা', 'হোম'].includes(item.label.toLowerCase().trim())
  );

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-1">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{isBn ? 'মূলপাতা' : 'Home'}</span>
          </Link>
        </li>

        {sanitizedItems.map((item, idx) => {
          const isLast = idx === sanitizedItems.length - 1;

          return (
            <li key={idx} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-slate-400" aria-hidden="true" />
              {isLast || !item.to ? (
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors truncate max-w-xs"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
