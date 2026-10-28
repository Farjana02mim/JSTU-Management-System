import React from 'react';
import { Shield, Check, KeyRound } from 'lucide-react';
import { DEMO_ACCOUNTS, DEMO_PASSWORD, DemoAccount } from '../../services/demoAccounts';
import { useLanguage } from '../../contexts/LanguageContext';

interface DevDemoAccountsProps {
  currentEmail: string;
  onSelect: (email: string, pass: string) => void;
}

export const DevDemoAccounts: React.FC<DevDemoAccountsProps> = ({ currentEmail, onSelect }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Role display label mapping
  const getRoleLabel = (role: string): { en: string; bn: string } => {
    switch (role) {
      case 'admin':
        return { en: 'Admin', bn: 'এডমিন' };
      case 'student':
        return { en: 'Student', bn: 'শিক্ষার্থী' };
      case 'teacher':
        return { en: 'Teacher', bn: 'শিক্ষক' };
      case 'dept_chairman':
        return { en: 'Chairman', bn: 'বিভাগীয় প্রধান' };
      case 'exam_controller':
        return { en: 'Exam Controller', bn: 'পরীক্ষা নিয়ন্ত্রক' };
      case 'registrar':
        return { en: 'Registrar', bn: 'রেজিস্ট্রার' };
      case 'account_officer':
        return { en: 'Accounts', bn: 'হিসাব কর্মকর্তা' };
      case 'library_officer':
        return { en: 'Library', bn: 'লাইব্রেরিয়ান' };
      case 'super_admin':
        return { en: 'Super Admin', bn: 'প্রধান প্রশাসক' };
      default:
        return { en: role.replace('_', ' '), bn: role };
    }
  };

  return (
    <div className="p-4 bg-slate-50/90 border border-slate-200 rounded-2xl space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-700 shrink-0" />
          <h2 className="text-xs font-bold text-slate-800 tracking-tight">
            {isBn ? 'ডেমো অ্যাকাউন্টস' : 'Demo accounts'}
          </h2>
        </div>
        <span className="text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
          {isBn ? 'মক সার্ভিস' : 'Demo Mode'}
        </span>
      </div>

      <p className="text-[11px] text-slate-500 leading-tight">
        {isBn
          ? 'যেকোনো রোলে ক্লিক করে ইমেইল ও পাসওয়ার্ড পূরণ করুন, এরপর "সাইন ইন করুন" চাপুন।'
          : 'Click a role below to fill email and password, then press "Sign In".'}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {DEMO_ACCOUNTS.map((acc: DemoAccount) => {
          const isSelected = currentEmail.trim().toLowerCase() === acc.email.toLowerCase();
          const roleLabel = getRoleLabel(acc.role);

          return (
            <button
              key={acc.uid}
              type="button"
              onClick={() => onSelect(acc.email, acc.password || DEMO_PASSWORD)}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-1 group relative ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/80 text-blue-950 ring-1 ring-blue-500 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 text-slate-800 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-xs tracking-tight text-slate-900 group-hover:text-blue-700">
                  {isBn ? roleLabel.bn : roleLabel.en}
                </span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                )}
              </div>

              <div className="text-[10px] text-slate-500 truncate font-mono w-full">
                {acc.email}
              </div>

              <div className="flex items-center justify-between text-[9px] pt-1 border-t border-slate-100 w-full mt-0.5">
                <span className="text-slate-400 truncate max-w-[70%]">
                  {isBn ? acc.fullNameBn : acc.fullName}
                </span>
                <span className={`px-1 py-0.5 rounded font-medium ${
                  acc.isMfaEnforced
                    ? 'text-amber-700 bg-amber-50'
                    : 'text-emerald-700 bg-emerald-50'
                }`}>
                  {acc.isMfaEnforced ? 'MFA: 123456' : 'No MFA'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <KeyRound className="w-3 h-3 text-slate-400" />
          <span>Password for all: <code className="font-mono text-slate-600 bg-slate-100 px-1 py-0.5 rounded">JSTU#Smart2026!</code></span>
        </span>
        <span className="italic">
          {isBn ? 'সরাসরি লগইন হয় না' : 'Fill only, press Sign In'}
        </span>
      </div>
    </div>
  );
};

export default DevDemoAccounts;
