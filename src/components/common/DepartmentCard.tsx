import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { DepartmentInfo } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from './Card';

export interface DepartmentCardProps {
  department: DepartmentInfo;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({ department }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const name = isBn ? (department.nameBn || department.name) : (department.name || department.nameBn);
  const faculty = isBn ? (department.facultyBn || department.faculty) : (department.faculty || department.facultyBn);
  const rawDegrees = isBn
    ? (department.degreesOfferedBn || department.degreesOffered)
    : (department.degreesOffered || department.degreesOfferedBn);
  const degrees: string[] = Array.isArray(rawDegrees) && rawDegrees.length > 0
    ? rawDegrees
    : [isBn ? 'বি.এস-সি. (ইঞ্জিনিয়ারিং)' : 'B.Sc. (Engineering)'];

  return (
    <Card variant="interactive" className="flex flex-col justify-between h-full group p-6">
      <div className="space-y-3">
        {/* Unboxed metadata kicker */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-mono font-bold text-blue-700 dark:text-blue-400 text-sm">
            {department.code}
          </span>
          <span className="text-slate-400">{faculty}</span>
        </div>

        {/* Department Name */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">
          {name}
        </h3>

        {/* Degrees */}
        <div className="space-y-1 pt-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {isBn ? 'ডিগ্রিসমূহ:' : 'Programs Offered:'}
          </span>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            {degrees.map((deg, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{deg}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {isBn ? `প্রতিষ্ঠা: ${department.established}` : `Est. ${department.established}`}
        </span>
        <Link
          to={`/academics/department/${department.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform"
        >
          <span>{isBn ? 'বিভাগীয় বিবরণ' : 'Explore Department'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
};
