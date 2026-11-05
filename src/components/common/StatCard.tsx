import React from 'react';
import { Card } from './Card';

export interface StatCardProps {
  label: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  isDemo?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  description,
  icon,
  isDemo = true
}) => {
  return (
    <Card className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">
              {label}
            </span>
            {isDemo && (
              <span className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold">
                [Demo]
              </span>
            )}
          </div>
          <div className="text-3xl font-extrabold text-[#0F172A] tabular-nums tracking-tight">
            {value}
          </div>
          {description && (
            <p className="text-xs text-slate-600 pt-1 font-medium">
              {description}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-105 transition-transform">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
