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
    neutral: 'text-slate-700 bg-[#F1F5F9] border-[#E2E8F0]',
    primary: 'text-[#1E3A8A] bg-[#EFF6FF] border-[#BFDBFE]',
    success: 'text-[#059669] bg-[#ECFDF5] border-[#A7F3D0]',
    warning: 'text-[#B45309] bg-[#FFFBEB] border-[#FDE68A]',
    danger: 'text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]'
  }[variant];

  const dotColors = {
    neutral: 'bg-slate-400',
    primary: 'bg-[#1E3A8A]',
    success: 'bg-[#059669]',
    warning: 'bg-[#D97706]',
    danger: 'bg-[#DC2626]'
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
