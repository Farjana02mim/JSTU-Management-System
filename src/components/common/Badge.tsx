import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  dot = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    neutral: 'text-[#334155] bg-[#F1F5F9] border-[#E2E8F0]',
    primary: 'text-[#1E40AF] bg-[#DBEAFE] border-[#BFDBFE]',
    success: 'text-[#166534] bg-[#DCFCE7] border-[#BBF7D0]',
    warning: 'text-[#92400E] bg-[#FEF3C7] border-[#FDE68A]',
    danger: 'text-[#991B1B] bg-[#FEE2E2] border-[#FECACA]'
  }[variant];

  const dotColors = {
    neutral: 'bg-slate-600',
    primary: 'bg-[#1E40AF]',
    success: 'bg-[#166534]',
    warning: 'bg-[#92400E]',
    danger: 'bg-[#991B1B]'
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold border rounded-lg ${variantStyles} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors}`} aria-hidden="true" />}
      {children}
    </span>
  );
};
