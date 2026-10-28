import React from 'react';

export interface SectionHeaderProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  kicker,
  title,
  subtitle,
  align = 'left',
  action,
  className = ''
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`mb-10 ${
        isCenter ? 'text-center mx-auto max-w-3xl' : 'flex flex-col md:flex-row md:items-end md:justify-between gap-4'
      } ${className}`}
    >
      <div className={isCenter ? '' : 'max-w-2xl'}>
        {kicker && (
          <span className="text-xs font-semibold tracking-wider uppercase text-blue-700 dark:text-blue-400 mb-2 block">
            {kicker}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] dark:text-slate-100 tracking-tight text-balance">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed text-balance">
            {subtitle}
          </p>
        )}
      </div>

      {!isCenter && action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
