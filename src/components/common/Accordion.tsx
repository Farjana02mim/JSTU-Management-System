import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 last:border-b-0">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-900 dark:hover:text-blue-400 transition-colors cursor-pointer group"
      >
        <span className="text-sm sm:text-base pr-4">{title}</span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed animate-in fade-in-50 duration-150">
          {children}
        </div>
      )}
    </div>
  );
};

export const Accordion: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`divide-y divide-slate-200 dark:divide-slate-800 border-t border-slate-200 dark:border-slate-800 ${className}`}>
      {children}
    </div>
  );
};
