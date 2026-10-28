import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  GraduationCap,
  BookOpen,
  Award,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  RefreshCw
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { DepartmentCard } from '../../components/common/DepartmentCard';
import { Tabs } from '../../components/common/Tabs';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { useLanguage } from '../../contexts/LanguageContext';
import { facultiesData, departmentsData, NEUTRAL_AVATAR } from '../../data/academicsSeedData';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';

export const AcademicsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeFacultyTab, setActiveFacultyTab] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(timer);
  }, []);

  const store = SharedDataStoreManager.getInstance().getStore();
  const allDepartments =
    store.managedDepartments && store.managedDepartments.length > 0
      ? store.managedDepartments
      : departmentsData;

  const facultyTabs = [
    { id: 'all', label: isBn ? 'সকল অনুষদ' : 'All Faculties' },
    ...facultiesData.map((f) => ({
      id: f.id,
      label: isBn ? f.nameBn : f.name
    }))
  ];

  const filteredDepartments =
    activeFacultyTab === 'all'
      ? allDepartments
      : allDepartments.filter((d: any) => {
          const facultyObj = facultiesData.find((f) => f.id === activeFacultyTab);
          return facultyObj ? facultyObj.departmentCodes.includes(d.code) : true;
        });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12 bg-white">
      <SEOHead
        title={isBn ? 'একাডেমিক কার্যক্রম ও অনুষদ' : 'Academics & Faculties | JSTU'}
        description="Explore 6 faculties, 7 academic departments, class routines, and academic calendar at Jamalpur Science & Technology University."
      />

      <Breadcrumb items={[{ label: isBn ? 'একাডেমিক' : 'Academics' }]} />

      {/* Institutional Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">
            [REPLACE WITH REAL CONTENT] Notice: Academic Architecture Prototype
          </p>
          <p className="text-amber-800">
            {isBn
              ? 'জেএসটিইউ-এর সকল অনুষদ কাঠামো, ডিগ্রি কারিকুলাম ও শিক্ষকমণ্ডলীর তালিকা খসড়া হিসেবে সাজানো হয়েছে। চূড়ান্ত সরকারি গ্যাজেট অনুযায়ী মূল তথ্য হালনাগাদ হবে।'
              : 'All statutory faculty listings, curricula, and departmental programs are structural placeholders pending gazetted publication.'}
          </p>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
          {isBn ? 'উচ্চশিক্ষা ও পাঠ্যক্রম রূপরেখা' : 'Degree Programs & Faculties'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          {isBn ? 'অনুষদ ও শিক্ষা বিভাগসমূহ' : 'Faculties & Academic Departments'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-4xl leading-relaxed">
          {isBn
            ? 'জেএসটিইউ-এর ৬টি অনুষদের অধীনে ৭টি বিশেষায়িত শিক্ষা বিভাগে ৪ বছর মেয়াদী স্নাতক (ইঞ্জিনিয়ারিং/অনার্স) ও স্নাতকোত্তর ডিগ্রি প্রদান করা হয়। আউটকাম-বেসড এডুকেশন (OBE) কাঠামো মেনে পরিচালিত আধুনিক শিক্ষাক্রম।'
            : 'JSTU offers accredited undergraduate and postgraduate programs across 6 statutory faculties and 7 departments, strictly adhering to the UGC 4.00-scale semester grading framework and international Washington Accord benchmarks.'}
        </p>

        {/* Action Quick Links */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link to="/faculties">
            <Button size="sm" variant="primary" leftIcon={<Building2 className="w-3.5 h-3.5" />}>
              {isBn ? '৬টি অনুষদের বিস্তারিত' : 'Explore 6 Faculties'}
            </Button>
          </Link>
          <Link to="/academics/calendar">
            <Button size="sm" variant="outline" leftIcon={<Calendar className="w-3.5 h-3.5" />}>
              {isBn ? 'একাডেমিক ক্যালেন্ডার ২০২৬' : 'Academic Calendar 2026'}
            </Button>
          </Link>
          <Link to="/academics/routine">
            <Button size="sm" variant="outline" leftIcon={<Clock className="w-3.5 h-3.5" />}>
              {isBn ? 'সাপ্তাহিক ক্লাস রুটিন' : 'Class Routine'}
            </Button>
          </Link>
          <Link to="/admission">
            <Button size="sm" variant="outline" leftIcon={<GraduationCap className="w-3.5 h-3.5" />}>
              {isBn ? 'ভর্তি তথ্য' : 'Admission Portal'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-[#E2E8F0] text-xs">
        <div>
          <span className="text-slate-500 block">{isBn ? 'একাডেমিক অনুষদ:' : 'Academic Faculties:'}</span>
          <strong className="text-lg text-[#0F172A] font-mono">6 Faculties</strong>
        </div>
        <div>
          <span className="text-slate-500 block">{isBn ? 'ডিগ্রি প্রদানকারী বিভাগ:' : 'Academic Departments:'}</span>
          <strong className="text-lg text-[#0F172A] font-mono">7 Departments</strong>
        </div>
        <div>
          <span className="text-slate-500 block">{isBn ? 'ডিগ্রি সিস্টেম:' : 'Curriculum Framework:'}</span>
          <strong className="text-lg text-[#0F172A] font-mono">OBE 4.00 CGPA</strong>
        </div>
        <div>
          <span className="text-slate-500 block">{isBn ? 'সেমিস্টার পদ্ধতি:' : 'Academic Structure:'}</span>
          <strong className="text-lg text-[#0F172A] font-mono">2 Terms / Year</strong>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6">
          <SkeletonLoader variant="rectangular" className="h-64 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonLoader key={i} variant="rectangular" className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {!isLoading && hasError && (
        <Card padding="lg" className="text-center py-10 space-y-3 border-red-200">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-sm font-bold text-slate-800">
            {isBn ? 'একাডেমিক তথ্য লোড করা যায়নি' : 'Unable to load academic directory'}
          </p>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => {
              setIsLoading(true);
              setHasError(false);
              setTimeout(() => setIsLoading(false), 150);
            }}
          >
            {isBn ? 'পুনরায় চেষ্টা' : 'Retry'}
          </Button>
        </Card>
      )}

      {/* Faculties Cards Grid */}
      {!isLoading && !hasError && (
        <div className="space-y-6">
          <div className="border-b border-[#E2E8F0] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">
                {isBn ? '৬টি অ্যাকাডেমিক অনুষদ' : 'The 6 Statutory Academic Faculties'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn ? 'অনুষদের ডিন ও অন্তর্ভুক্ত বিভাগসমূহের বিবরণ' : 'Faculty leadership and departmental clusters'}
              </p>
            </div>
            <Link to="/faculties">
              <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                {isBn ? 'সকল অনুষদ বিস্তারিত' : 'View Full Faculties Page'}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facultiesData.map((faculty) => {
              const depts = departmentsData.filter((d) =>
                faculty.departmentCodes.includes(d.code)
              );

              return (
                <Card
                  key={faculty.id}
                  className="p-6 space-y-4 flex flex-col justify-between hover:border-[#1E3A8A] transition-all bg-white"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#1E3A8A] bg-[#EFF6FF] px-2 py-0.5 rounded-md">
                        {faculty.departmentCodes.join(' · ')}
                      </span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
                        [REPLACE]
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0F172A]">
                      {isBn ? faculty.nameBn : faculty.name}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {isBn ? faculty.descriptionBn : faculty.description}
                    </p>

                    {/* Departments clickable badges */}
                    <div className="pt-1 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {isBn ? 'বিভাগসমূহ:' : 'Departments:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {depts.map((dept) => (
                          <Link
                            key={dept.id}
                            to={`/academics/department/${dept.id}`}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-[#EFF6FF] text-slate-700 hover:text-[#1E3A8A] border border-[#E2E8F0] font-medium transition-colors"
                          >
                            <span className="font-mono font-bold text-[11px] text-[#1E3A8A]">{dept.code}</span>
                            <span className="truncate max-w-[120px]">{isBn ? dept.nameBn.split(' ')[0] : dept.name.replace('Department of ', '')}</span>
                            <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E2E8F0] text-xs text-slate-500 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={NEUTRAL_AVATAR}
                        alt="Dean"
                        className="w-6 h-6 rounded-full border border-slate-200"
                      />
                      <span className="text-[11px] truncate max-w-[170px]">
                        {isBn ? faculty.deanNameBn.split('[')[0] : faculty.deanName.split('[')[0]}
                      </span>
                    </div>
                    <Link
                      to="/faculties"
                      className="text-xs font-semibold text-[#1E3A8A] hover:underline"
                    >
                      {isBn ? 'অনুষদ পেজ →' : 'Details →'}
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Filterable Departments List */}
      {!isLoading && !hasError && (
        <div className="space-y-6">
          <div className="border-b border-[#E2E8F0] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">
                {isBn ? '৭টি ডিগ্রি প্রদানকারী বিভাগ' : 'The 7 Academic Departments'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn
                  ? 'অনুষদ অনুযায়ী ফিল্টার করে সংশ্লিষ্ট বিভাগের সম্পূর্ণ বিবরণ দেখুন'
                  : 'Select faculty filter to view corresponding academic departments'}
              </p>
            </div>
          </div>

          <Tabs
            tabs={facultyTabs}
            activeTab={activeFacultyTab}
            onChange={(id) => setActiveFacultyTab(id)}
          />

          {filteredDepartments.length === 0 ? (
            <EmptyState
              title={isBn ? 'কোনো বিভাগ পাওয়া যায়নি' : 'No Departments Found'}
              description={isBn ? 'নির্বাচিত অনুষদে কোনো বিভাগ নেই।' : 'No departments under the selected faculty.'}
              actionLabel={isBn ? 'সকল বিভাগ দেখুন' : 'Show All Departments'}
              onAction={() => setActiveFacultyTab('all')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {filteredDepartments.map((dept) => (
                <DepartmentCard key={dept.id} department={dept as any} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
