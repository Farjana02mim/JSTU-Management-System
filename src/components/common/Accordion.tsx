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
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left font-bold text-[#0F172A] hover:text-[#1E3A8A] transition-colors cursor-pointer group"
      >
        <span className="text-sm sm:text-base pr-4">{title}</span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-slate-600 group-hover:text-[#1E3A8A] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#1E3A8A]' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-sm text-[#334155] leading-relaxed">
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
    <div className={`divide-y divide-slate-200 border-t border-slate-200 ${className}`}>
      {children}
    </div>
  );
};
