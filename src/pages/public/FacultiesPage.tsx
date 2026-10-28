import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  ArrowRight,
  Calendar,
  Clock,
  AlertCircle,
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  facultiesData,
  departmentsData,
  NEUTRAL_AVATAR
} from '../../data/academicsSeedData';

export const FacultiesPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate real component data mount
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => setIsLoading(false), 200);
  };

  const filteredFaculties = facultiesData.filter((f) => {
    const q = searchQuery.toLowerCase();
    const matchesName =
      f.name.toLowerCase().includes(q) ||
      f.nameBn.includes(searchQuery) ||
      f.description.toLowerCase().includes(q) ||
      f.descriptionBn.includes(searchQuery);
    const matchesDept = f.departmentCodes.some((code) =>
      code.toLowerCase().includes(q)
    );
    return matchesName || matchesDept;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 bg-white">
      <SEOHead
        title={isBn ? '৬টি অনুষদ ও বিভাগসমূহ' : 'Academic Faculties & Departments | JSTU'}
        description="Official list of the 6 statutory faculties and 7 academic departments of Jamalpur Science & Technology University."
      />

      <Breadcrumb
        items={[
          { label: isBn ? 'একাডেমিক' : 'Academics', to: '/academics' },
          { label: isBn ? 'অনুষদসমূহ' : 'Faculties' }
        ]}
      />

      {/* Institutional Placeholder Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 sm:p-4 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">
            [REPLACE WITH REAL CONTENT] Notice on Academic Listings
          </p>
          <p className="text-amber-800">
            {isBn
              ? 'এই পৃষ্ঠার সকল ডিন পরিচিতি, পাঠ্যক্রম এবং বিভাগীয় কাঠামো খসড়া ডেমো হিসেবে প্রস্তুত করা হয়েছে। গ্যাজেট প্রকাশের পর মূল তথ্য প্রতিস্থাপিত হবে।'
              : 'All faculty leadership names, curricular specifications, and structures shown are design placeholders pending official gazette confirmation.'}
          </p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="font-mono text-[#1E3A8A] font-bold text-sm bg-[#EFF6FF] px-2.5 py-1 rounded-md">
            Statutory Structure
          </span>
          <span>·</span>
          <span>{isBn ? '৬টি অনুষদ' : '6 Academic Faculties'}</span>
          <span>·</span>
          <span>{isBn ? '৭টি ডিগ্রি প্রদানকারী বিভাগ' : '7 Academic Departments'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          {isBn ? 'জেএসটিইউ-এর ৬টি অ্যাকাডেমিক অনুষদ' : 'Statutory Academic Faculties'}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-4xl leading-relaxed">
          {isBn
            ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় আইনের অধীনে গঠিত ৬টি অনুষদের তত্ত্বাবধানে আউটকাম-বেসড এডুকেশন (OBE) কাঠামো অনুসারে চার বছর মেয়াদী স্নাতক এবং স্নাতকোত্তর ডিগ্রি কার্যক্রম পরিচালিত হয়।'
            : 'Explore the 6 statutory faculties encompassing computational technologies, engineering sciences, riverine agriculture, earth resources, business strategy, and human development.'}
        </p>

        {/* Quick Action Navigation */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link to="/academics/calendar">
            <Button size="sm" variant="primary" leftIcon={<Calendar className="w-3.5 h-3.5" />}>
              {isBn ? 'একাডেমিক ক্যালেন্ডার' : 'Academic Calendar'}
            </Button>
          </Link>
          <Link to="/academics/routine">
            <Button size="sm" variant="outline" leftIcon={<Clock className="w-3.5 h-3.5" />}>
              {isBn ? 'ক্লাস রুটিন' : 'Class Routine'}
            </Button>
          </Link>
          <Link to="/admission">
            <Button size="sm" variant="outline" leftIcon={<GraduationCap className="w-3.5 h-3.5" />}>
              {isBn ? 'ভর্তি তথ্য' : 'Admission Guidelines'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-[#E2E8F0]">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
            {isBn ? 'অনুষদ ও অন্তর্ভুক্ত বিভাগ' : 'Faculty Clusters & Departments'}
          </h2>
          <span className="text-xs text-slate-500">
            {isBn ? 'অনুষদের নাম বা বিভাগ কোড দিয়ে ফিল্টার করুন' : 'Filter by faculty title or departmental code'}
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={isBn ? 'অনুষদ বা বিভাগ খুঁজুন...' : 'Search faculties or codes...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#1E3A8A] bg-white text-slate-800"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl border border-[#E2E8F0] space-y-4">
              <SkeletonLoader variant="text" className="h-6 w-1/3" />
              <SkeletonLoader variant="text" className="h-4 w-3/4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <SkeletonLoader variant="rectangular" className="h-24 rounded-xl" />
                <SkeletonLoader variant="rectangular" className="h-24 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && hasError && (
        <Card padding="lg" className="text-center py-12 space-y-4 border-red-200">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              {isBn ? 'অনুষদের তথ্য লোড করতে সমস্যা হয়েছে' : 'Failed to Load Faculty Data'}
            </h3>
            <p className="text-xs text-slate-500">
              {isBn
                ? 'অনুরোধটি সম্পন্ন করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।'
                : 'Unable to communicate with the academic registry. Please retry.'}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={handleRetry}
          >
            {isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
          </Button>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !hasError && filteredFaculties.length === 0 && (
        <EmptyState
          title={isBn ? 'কোনো অনুষদ পাওয়া যায়নি' : 'No Faculties Found'}
          description={
            isBn
              ? 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো অনুষদ নেই।'
              : 'No faculties match your search query. Try another keyword.'
          }
          actionLabel={isBn ? 'অনুসন্ধান রিসেট করুন' : 'Reset Search'}
          onAction={() => setSearchQuery('')}
        />
      )}

      {/* Faculties Cards List */}
      {!isLoading && !hasError && filteredFaculties.length > 0 && (
        <div className="space-y-8">
          {filteredFaculties.map((faculty, fIndex) => {
            // Find departments belonging to this faculty
            const facultyDepts = departmentsData.filter((d) =>
              faculty.departmentCodes.includes(d.code)
            );

            return (
              <Card
                key={faculty.id}
                padding="lg"
                className="space-y-6 border border-[#E2E8F0] hover:border-[#1E3A8A] transition-all"
              >
                {/* Faculty Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#E2E8F0] pb-5">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#1E3A8A] bg-[#EFF6FF] px-2.5 py-0.5 rounded-md">
                        Faculty {fIndex + 1}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-semibold text-slate-500">
                        {faculty.departmentCodes.join(', ')}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                      {isBn ? faculty.nameBn : faculty.name}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                      {isBn ? faculty.descriptionBn : faculty.description}
                    </p>
                  </div>

                  {/* Dean Profile Card with Neutral Avatar */}
                  <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] flex items-center gap-3 shrink-0 max-w-sm">
                    <img
                      src={NEUTRAL_AVATAR}
                      alt="Neutral Avatar"
                      className="w-12 h-12 rounded-xl object-cover bg-white border border-[#E2E8F0] shrink-0"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {isBn ? 'অনুষদের ডিন' : 'Faculty Dean'}
                      </span>
                      <p className="text-xs font-bold text-[#0F172A] truncate">
                        {isBn ? faculty.deanNameBn : faculty.deanName}
                      </p>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded inline-block">
                        [REPLACE WITH REAL CONTENT]
                      </span>
                    </div>
                  </div>
                </div>

                {/* Departments Under This Faculty */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {isBn ? 'অন্তর্ভুক্ত বিভাগসমূহ:' : 'Academic Departments in this Faculty:'}
                    </h3>
                    <span className="text-xs text-slate-400">
                      {facultyDepts.length} {isBn ? 'টি বিভাগ' : 'Departments'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {facultyDepts.map((dept) => (
                      <div
                        key={dept.id}
                        className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#1E3A8A] bg-white transition-all flex flex-col justify-between space-y-3 group"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[#1E3A8A] bg-[#EFF6FF] px-2 py-0.5 rounded">
                              {dept.code}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {isBn ? `প্রতিষ্ঠা: ${dept.established}` : `Est. ${dept.established}`}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm sm:text-base text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors">
                            {isBn ? dept.nameBn : dept.name}
                          </h4>

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {isBn ? dept.overviewBn : dept.overview}
                          </p>

                          {/* Degrees Offered */}
                          <div className="pt-1 flex flex-wrap gap-1">
                            {(isBn ? dept.degreesOfferedBn : dept.degreesOffered).map((d, dIdx) => (
                              <span
                                key={dIdx}
                                className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Link to Department Detail Page */}
                        <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">
                            {isBn ? 'চেয়ারম্যান:' : 'Chairman:'}{' '}
                            <strong className="text-slate-800 font-normal">
                              {dept.headOfDepartment.name.split(' ')[0]}...
                            </strong>
                          </span>

                          <Link
                            to={`/academics/department/${dept.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3A8A] hover:text-[#172554] group-hover:translate-x-0.5 transition-all"
                          >
                            <span>{isBn ? 'বিভাগ দেখুন' : 'Explore Department'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
