import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'muted' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }[padding];

  const variantClasses = {
    default: 'bg-white border border-[#E2E8F0] shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] rounded-2xl',
    muted: 'bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl',
    interactive:
      'bg-white border border-[#E2E8F0] shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] hover:border-slate-300 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] transition-all rounded-2xl cursor-pointer'
  }[variant];

  return (
    <div className={`${variantClasses} ${paddingClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};
