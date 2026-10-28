import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  GraduationCap,
  FlaskConical,
  Award,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Users,
  Building2,
  BookOpen,
  Bell,
  Clock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Download,
  Search,
  Filter,
  Layers,
  AlertCircle,
  RefreshCw,
  Tag
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  departmentsData,
  departmentFacultyMembers,
  departmentPrograms,
  departmentCourses,
  departmentLabs,
  departmentResearchProjects,
  departmentNotices,
  NEUTRAL_AVATAR
} from '../../data/academicsSeedData';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';

type DeptTab =
  | 'overview'
  | 'programs'
  | 'faculty'
  | 'courses'
  | 'labs'
  | 'research'
  | 'notices'
  | 'contact';

export const DepartmentDetailPage: React.FC = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Tab state
  const tabParam = searchParams.get('tab') as DeptTab | null;
  const initialTab =
    tabParam &&
    ['overview', 'programs', 'faculty', 'courses', 'labs', 'research', 'notices', 'contact'].includes(
      tabParam
    )
      ? tabParam
      : tabParam === ('syllabus' as any)
      ? 'courses'
      : 'overview';

  const [activeTab, setActiveTab] = useState<DeptTab>(initialTab);

  // Courses filter state
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [courseSearch, setCourseSearch] = useState('');

  // Faculty search
  const [facultySearch, setFacultySearch] = useState('');

  // Notice modal
  const [selectedNotice, setSelectedNotice] = useState<any | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [deptId]);

  useEffect(() => {
    if (
      tabParam &&
      ['overview', 'programs', 'faculty', 'courses', 'labs', 'research', 'notices', 'contact'].includes(
        tabParam
      )
    ) {
      setActiveTab(tabParam);
    } else if (tabParam === ('syllabus' as any)) {
      setActiveTab('courses');
    }
  }, [tabParam]);

  const handleTabChange = (tab: DeptTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Find department by ID or Code
  const store = SharedDataStoreManager.getInstance().getStore();
  const allDepartments =
    store.managedDepartments && store.managedDepartments.length > 0
      ? store.managedDepartments
      : departmentsData;
  const allFaculty =
    store.managedFaculty && store.managedFaculty.length > 0
      ? store.managedFaculty
      : departmentFacultyMembers;

  const normalizedDeptId = deptId?.toLowerCase().replace('dept-', '') || '';
  const department = allDepartments.find(
    (d: any) =>
      d.id.toLowerCase() === normalizedDeptId ||
      d.code.toLowerCase() === normalizedDeptId ||
      (normalizedDeptId === 'math' && d.id === 'mathematics') ||
      (normalizedDeptId === 'sw' && d.id === 'social-work') ||
      (normalizedDeptId === 'fish' && d.id === 'fisheries') ||
      (normalizedDeptId === 'geol' && d.id === 'geology') ||
      (normalizedDeptId === 'mgmt' && d.id === 'management')
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8 bg-white">
        <SkeletonLoader variant="rectangular" className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonLoader key={i} variant="rectangular" className="h-24 rounded-xl" />
          ))}
        </div>
        <SkeletonLoader variant="rectangular" className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!department || hasError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 bg-white space-y-6">
        <EmptyState
          title={isBn ? 'বিভাগটি খুঁজে পাওয়া যায়নি' : 'Department Not Found'}
          description={
            isBn
              ? 'অনুরোধকৃত শিক্ষা বিভাগটি জেএসটিইউ-এর রেজিস্ট্রিতে তালিকাভুক্ত নেই।'
              : 'The requested academic department could not be located in the university registry.'
          }
          actionLabel={isBn ? 'সকল বিভাগে ফিরে যান' : 'Back to Academics'}
          onAction={() => (window.location.href = '/academics')}
        />
        <div className="text-center">
          <Link to="/faculties">
            <Button size="sm" variant="outline">
              {isBn ? 'অনুষদ পেজে যান' : 'View Faculties Page'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const deptKey = department.id.toLowerCase();

  // Filter department assets
  const facultyList = allFaculty.filter(
    (f: any) =>
      f.departmentId.toLowerCase() === deptKey &&
      (f.status === 'published' || !f.status)
  );

  const filteredFaculty = facultyList.filter(
    (f: any) =>
      f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
      (f.nameBn && f.nameBn.includes(facultySearch)) ||
      (f.researchInterests &&
        f.researchInterests.some((r: string) =>
          r.toLowerCase().includes(facultySearch.toLowerCase())
        ))
  );

  const programsList = departmentPrograms.filter((p) => p.departmentId === deptKey);
  const coursesList = departmentCourses.filter((c) => c.departmentId === deptKey);

  const filteredCourses = coursesList.filter((c) => {
    const matchesSemester =
      selectedSemester === 'all' ||
      (c.year - 1) * 2 + c.semester === selectedSemester ||
      c.semester === selectedSemester;
    const matchesQuery =
      c.courseCode.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.courseTitle.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.courseTitleBn.includes(courseSearch);
    return matchesSemester && matchesQuery;
  });

  const labsList = departmentLabs.filter((l) => l.departmentId === deptKey);
  const researchList = departmentResearchProjects.filter((r) => r.departmentId === deptKey);
  const noticesList = departmentNotices.filter((n) => n.departmentId === deptKey);

  const name = isBn ? department.nameBn : department.name;
  const faculty = isBn ? department.facultyBn : department.faculty;
  const overview = isBn ? department.overviewBn : department.overview;

  const tabsConfig: { id: DeptTab; labelEn: string; labelBn: string; count?: number }[] = [
    { id: 'overview', labelEn: 'Overview', labelBn: 'পরিচিতি' },
    { id: 'programs', labelEn: 'Programs (BSc/MSc)', labelBn: 'ডিগ্রি প্রোগ্রাম', count: programsList.length },
    { id: 'faculty', labelEn: 'Faculty Members', labelBn: 'শিক্ষকমণ্ডলী', count: facultyList.length },
    { id: 'courses', labelEn: 'Courses by Semester', labelBn: 'সেমিস্টারভিত্তিক কোর্সসমূহ', count: coursesList.length },
    { id: 'labs', labelEn: 'Laboratories', labelBn: 'গবেষণাগার ও ল্যাব', count: labsList.length },
    { id: 'research', labelEn: 'Research', labelBn: 'গবেষণা প্রকল্প', count: researchList.length },
    { id: 'notices', labelEn: 'Notices', labelBn: 'বিভাগীয় নোটিশ', count: noticesList.length },
    { id: 'contact', labelEn: 'Contact', labelBn: 'যোগাযোগ' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 bg-white">
      <SEOHead
        title={`${department.code} - ${name} | JSTU`}
        description={overview}
      />

      <Breadcrumb
        items={[
          { label: isBn ? 'একাডেমিক' : 'Academics', to: '/academics' },
          { label: isBn ? 'অনুষদ' : 'Faculties', to: '/faculties' },
          { label: department.code }
        ]}
      />

      {/* Institutional Notice Indicator */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>[REPLACE WITH REAL CONTENT]</strong> {isBn ? 'বিভাগীয় তথ্যাবলী ও শিক্ষকমণ্ডলী খসড়া রূপরেখা অনুযায়ী প্রদর্শিত।' : 'Departmental curricular and faculty listings are structural placeholders.'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded shrink-0">
          Dept ID: {department.id}
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="font-mono text-[#1E3A8A] font-bold text-sm bg-[#EFF6FF] px-2.5 py-1 rounded-md">
            {department.code}
          </span>
          <span>·</span>
          <span className="uppercase tracking-wider">{faculty}</span>
          <span>·</span>
          <span>{isBn ? `প্রতিষ্ঠা: ${department.established}` : `Est. ${department.established}`}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          {name}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-4xl leading-relaxed">
          {overview}
        </p>

        {/* Quick Nav to Class Routine & Academic Calendar */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link to="/academics/routine">
            <Button size="sm" variant="outline" leftIcon={<Clock className="w-3.5 h-3.5" />}>
              {isBn ? 'ক্লাস রুটিন দেখুন' : 'Class Routine'}
            </Button>
          </Link>
          <Link to="/academics/calendar">
            <Button size="sm" variant="outline" leftIcon={<Calendar className="w-3.5 h-3.5" />}>
              {isBn ? 'একাডেমিক ক্যালেন্ডার' : 'Academic Calendar'}
            </Button>
          </Link>
          <Link to="/admission">
            <Button size="sm" variant="primary" leftIcon={<GraduationCap className="w-3.5 h-3.5" />}>
              {isBn ? 'ভর্তি নির্দেশিকা' : 'Admission Guidelines'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Department Key Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label={isBn ? 'অনুষদ সদস্য' : 'Faculty Members'}
          value={department.stats.facultyCount.toString()}
          isDemo={false}
        />
        <StatCard
          label={isBn ? 'অধ্যয়নরত শিক্ষার্থী' : 'Enrolled Students'}
          value={department.stats.studentCount.toString()}
          isDemo={true}
        />
        <StatCard
          label={isBn ? 'বিশেষায়িত ল্যাব' : 'Specialized Labs'}
          value={department.stats.labCount.toString()}
          isDemo={false}
        />
        <StatCard
          label={isBn ? 'গ্র্যাজুয়েট অ্যালামনাই' : 'Graduate Alumni'}
          value={`${department.stats.alumniCount}+`}
          isDemo={true}
        />
      </div>

      {/* Department Tabs Bar */}
      <div className="border-b border-[#E2E8F0] overflow-x-auto scrollbar-none">
        <div className="flex gap-2 min-w-max pb-2">
          {tabsConfig.map((tab) => {
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-[#F8FAFC] text-slate-600 hover:bg-[#EFF6FF] hover:text-[#1E3A8A] border border-[#E2E8F0]'
                }`}
              >
                <span>{isBn ? tab.labelBn : tab.labelEn}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isCurrent
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: OVERVIEW */}
      {/* ===================================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-10">
          {/* Welcome & Department Leadership */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card padding="lg" className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                  {isBn ? 'বিভাগীয় পরিচিতি ও লক্ষ্য' : 'Vision & Academic Mandate'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                  {isBn ? 'উৎকর্ষ ও প্রায়োগিক শিক্ষার অঙ্গীকার' : 'Excellence in Rigorous & Applied Pedagogy'}
                </h2>
                <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                  <p>{overview}</p>
                  <p>
                    {isBn
                      ? 'জেএসটিইউ-এর এই বিভাগ শিক্ষার্থীদের আধুনিক গবেষণাগার, সেমিনার লাইব্রেরি এবং প্রজেক্ট ওয়ার্কের মাধ্যমে চতুর্থ শিল্প বিপ্লবের জন্য প্রস্তুত করে তোলে।'
                      : 'Equipped with dedicated computational and physical facilities, the department fosters industry-standard technical competencies and ethical responsibility.'}
                  </p>
                </div>

                {/* Key Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-1">
                    <span className="font-bold text-xs text-[#0F172A] flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#1E3A8A]" />
                      <span>{isBn ? 'ওবিই পাঠ্যক্রম' : 'OBE Framework'}</span>
                    </span>
                    <p className="text-[11px] text-slate-500">
                      {isBn ? 'ফলাফল-ভিত্তিক পাঠদান পদ্ধতি' : 'Outcome-Based Education aligned with international standards.'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-1">
                    <span className="font-bold text-xs text-[#0F172A] flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5 text-[#1E3A8A]" />
                      <span>{isBn ? 'প্রায়োগিক গবেষণা' : 'Applied Research'}</span>
                    </span>
                    <p className="text-[11px] text-slate-500">
                      {isBn ? 'সরাসরি ল্যাব ও প্রজেক্ট কাজ' : 'Rigorous laboratory sessions and capstone field explorations.'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Degrees Offered Summary */}
              <Card padding="lg" className="space-y-3">
                <h3 className="text-base font-bold text-[#0F172A]">
                  {isBn ? 'প্রদেয় ডিগ্রি ও শিক্ষাক্রম' : 'Accredited Academic Degrees'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {((isBn ? department.degreesOfferedBn : department.degreesOffered) || []).map((deg, di) => (
                    <div
                      key={di}
                      className="p-3 rounded-xl border border-[#E2E8F0] bg-slate-50 flex items-center gap-3"
                    >
                      <GraduationCap className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#0F172A] block truncate">{deg}</span>
                        <span className="text-[10px] text-slate-500 font-mono">[REPLACE WITH REAL CONTENT]</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Department Head Card with Neutral Avatar */}
            <div className="space-y-6">
              <Card padding="lg" className="space-y-4 border-t-4 border-t-[#1E3A8A]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                  {isBn ? 'বিভাগীয় প্রধানের বার্তা' : 'Head of Department Desk'}
                </span>

                <div className="flex items-center gap-4">
                  <img
                    src={NEUTRAL_AVATAR}
                    alt="Chairman Neutral Avatar"
                    className="w-16 h-16 rounded-2xl object-cover bg-slate-50 border border-[#E2E8F0] shrink-0"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-[#0F172A] truncate">
                      {department.headOfDepartment.name}
                    </h3>
                    <p className="text-xs text-[#1E3A8A] font-medium">
                      {department.headOfDepartment.designation}
                    </p>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded inline-block">
                      [REPLACE WITH REAL CONTENT]
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-slate-200 pl-3">
                  {isBn
                    ? '“জেএসটিইউ-এর এই বিভাগে শিক্ষার্থীদের মানবিক মূল্যবোধ এবং আধুনিক প্রযুক্তিগত দক্ষতায় গড়ে তোলা আমাদের অন্যতম ব্রত।”'
                    : '"We are committed to nurturing ethical leadership, rigorous technical curiosity, and societal impact across all academic endeavours."'}
                </p>

                <div className="space-y-2 pt-2 border-t border-[#E2E8F0] text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px] truncate">{department.headOfDepartment.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Academic Complex, Floor 4 [REPLACE]</span>
                  </div>
                </div>
              </Card>

              {/* Research Areas Card */}
              <Card padding="md" className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  {isBn ? 'প্রধান গবেষণার বিষয়সমূহ' : 'Departmental Research Focus'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {department.researchAreas.map((ra, ri) => (
                    <span
                      key={ri}
                      className="px-2.5 py-1 text-xs bg-slate-100 text-slate-700 rounded-lg font-medium"
                    >
                      {ra}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: PROGRAMS (BSc / MSc) */}
      {/* ===================================================================== */}
      {activeTab === 'programs' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                {isBn ? 'ডিগ্রি পাঠ্যক্রম' : 'Academic Degrees'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                {isBn ? 'স্নাতক ও স্নাতকোত্তর শিক্ষাক্রম' : 'Offered Academic Degree Programs'}
              </h2>
            </div>
          </div>

          {programsList.length === 0 ? (
            <EmptyState
              title={isBn ? 'কোনো প্রোগ্রাম পাওয়া যায়নি' : 'No Programs Found'}
              description={isBn ? 'এই বিভাগের জন্য প্রোগ্রাম তালিকা শীঘ্রই যুক্ত করা হবে।' : 'Programs for this department are being synchronized.'}
            />
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {programsList.map((prog) => (
                <Card key={prog.id} padding="lg" className="space-y-6 border-l-4 border-l-[#1E3A8A]">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#E2E8F0] pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#1E3A8A] bg-[#EFF6FF] px-2 py-0.5 rounded-md">
                          {isBn ? prog.degreeTypeBn : prog.degreeType}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-medium text-slate-500">
                          {isBn ? prog.durationBn : prog.duration}
                        </span>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          [REPLACE]
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                        {isBn ? prog.titleBn : prog.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Link to={`/academics/program/${prog.id}`}>
                        <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                          {isBn ? 'সিলেবাস ও কাঠামো দেখুন' : 'View Program Curriculum'}
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {isBn ? prog.overviewBn : prog.overview}
                  </p>

                  {/* Program Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] text-xs">
                    <div>
                      <span className="text-slate-500 block">{isBn ? 'মোট ক্রেডিট:' : 'Total Credits:'}</span>
                      <strong className="text-base text-[#0F172A] font-mono">{prog.totalCredits}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{isBn ? 'মোট সেমিস্টার:' : 'Total Semesters:'}</span>
                      <strong className="text-base text-[#0F172A] font-mono">{prog.totalSemesters}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{isBn ? 'বার্ষিক আসন সংখ্যা:' : 'Total Seats:'}</span>
                      <strong className="text-base text-[#0F172A] font-mono">{prog.seatCount}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{isBn ? 'ভর্তি সেশন:' : 'Intake Season:'}</span>
                      <strong className="text-xs text-[#0F172A]">{isBn ? prog.intakeSeasonBn : prog.intakeSeason}</strong>
                    </div>
                  </div>

                  {/* Admission Eligibility & Career Prospects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                        {isBn ? 'ভর্তির যোগ্যতা ও শর্তাবলী' : 'Admission Eligibility'}
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {(isBn ? prog.admissionEligibilityBn : prog.admissionEligibility).map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                        {isBn ? 'কর্মসংস্থান ও ক্যারিয়ার সম্ভাবনা' : 'Career Prospects'}
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {(isBn ? prog.careerProspectsBn : prog.careerProspects).map((career, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-2">
                            <ArrowRight className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0 mt-0.5" />
                            <span>{career}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: FACULTY MEMBERS */}
      {/* ===================================================================== */}
      {activeTab === 'faculty' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                {isBn ? 'অনুষদ সদস্যবৃন্দ' : 'Departmental Faculty'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                {isBn ? 'সম্মানিত শিক্ষকমণ্ডলী' : 'Distinguished Faculty Members'}
              </h2>
            </div>

            {/* Filter Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder={isBn ? 'শিক্ষক বা গবেষণার বিষয় খুঁজুন...' : 'Search teacher or research area...'}
                value={facultySearch}
                onChange={(e) => setFacultySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          {filteredFaculty.length === 0 ? (
            <EmptyState
              title={isBn ? 'কোনো শিক্ষক পাওয়া যায়নি' : 'No Faculty Members Found'}
              description={isBn ? 'আপনার অনুসন্ধানের সাথে মিল পাওয়া যায়নি।' : 'No faculty members matching the search query.'}
              actionLabel={isBn ? 'অনুসন্ধান রিসেট করুন' : 'Reset Search'}
              onAction={() => setFacultySearch('')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFaculty.map((member) => (
                <Card
                  key={member.id}
                  padding="lg"
                  className={`space-y-4 hover:border-[#1E3A8A] transition-all flex flex-col justify-between bg-white ${
                    member.isChairman ? 'border-t-4 border-t-[#1E3A8A]' : ''
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      {/* Neutral Vector Avatar - Zero Real Photos */}
                      <img
                        src={NEUTRAL_AVATAR}
                        alt="Neutral Avatar"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-slate-50 border-2 border-[#E2E8F0] shadow-2xs shrink-0"
                      />
                      <div className="space-y-1 min-w-0 flex-1">
                        {member.isChairman && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm inline-block">
                            {isBn ? 'বিভাগীয় চেয়ারম্যান' : 'Head of Department'}
                          </span>
                        )}
                        <h3 className="text-base font-bold text-[#0F172A] truncate">
                          {isBn ? member.nameBn : member.name}
                        </h3>
                        <p className="text-xs font-medium text-[#1E3A8A]">
                          {isBn ? member.designationBn : member.designation}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{isBn ? member.roomBn : member.room}</span>
                        </p>
                      </div>
                    </div>

                    {/* Educational Degrees */}
                    <div className="space-y-1 text-xs text-slate-600 border-t border-[#E2E8F0] pt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {isBn ? 'শিক্ষাগত যোগ্যতা' : 'Academic Credentials'}
                      </span>
                      <ul className="space-y-0.5">
                        {(isBn ? member.degreesBn : member.degrees).map((deg, di) => (
                          <li key={di} className="truncate text-slate-700">
                            • {deg}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Research Interests */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {isBn ? 'গবেষণার আগ্রহের বিষয়' : 'Research Interests'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(isBn ? member.researchInterestsBn : member.researchInterests).map((ri, rii) => (
                          <span
                            key={rii}
                            className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-md"
                          >
                            {ri}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact Info Footer */}
                  <div className="pt-3 border-t border-[#E2E8F0] text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      <a href={`mailto:${member.email}`} className="hover:text-[#1E3A8A] truncate max-w-[180px]">
                        {member.email}
                      </a>
                    </div>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
                      [REPLACE]
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: COURSES BY SEMESTER */}
      {/* ===================================================================== */}
      {activeTab === 'courses' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                {isBn ? 'কোর্স সিলেবাস' : 'Course Matrix'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                {isBn ? 'সেমিস্টারভিত্তিক পাঠ্যসূচি' : 'Courses by Semester'}
              </h2>
            </div>

            {/* Course Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder={isBn ? 'কোর্স কোড বা শিরোনাম...' : 'Search course code or title...'}
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          {/* Semester Selector Bar */}
          <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              {isBn ? 'সেমিস্টার নির্বাচন করুন:' : 'Select Semester:'}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              <button
                onClick={() => setSelectedSemester('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                  selectedSemester === 'all'
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-[#E2E8F0]'
                }`}
              >
                {isBn ? 'সকল সেমিস্টার' : 'All Semesters'}
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSemester(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                    selectedSemester === s
                      ? 'bg-[#1E3A8A] text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-[#E2E8F0]'
                  }`}
                >
                  {isBn ? `সেমিস্টার ${s}` : `Semester ${s}`}
                </button>
              ))}
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <EmptyState
              title={isBn ? 'কোনো কোর্স পাওয়া যায়নি' : 'No Courses Found'}
              description={isBn ? 'নির্বাচিত সেমিস্টারে কোনো কোর্স তালিকাভুক্ত নেই।' : 'No courses match the semester or search filter.'}
              actionLabel={isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
              onAction={() => {
                setSelectedSemester('all');
                setCourseSearch('');
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  padding="md"
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#1E3A8A] transition-all bg-white"
                >
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-[#1E3A8A] bg-[#EFF6FF] px-2.5 py-0.5 rounded">
                        {course.courseCode}
                      </span>
                      <span>·</span>
                      <span className="text-slate-500 font-medium">
                        {isBn ? course.semesterLabelBn : course.semesterLabel}
                      </span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
                        [REPLACE]
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0F172A]">
                      {isBn ? course.courseTitleBn : course.courseTitle}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isBn ? course.descriptionBn : course.description}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E2E8F0]">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-sm ${
                        course.type === 'Lab'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isBn ? course.typeBn : course.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#0F172A]">
                      {course.credits.toFixed(1)} {isBn ? 'ক্রেডিট' : 'Credits'}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: LABORATORIES */}
      {/* ===================================================================== */}
      {activeTab === 'labs' && (
        <div className="space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
              {isBn ? 'পরীক্ষাগার ও পরিকাঠামো' : 'Practical Facilities'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {isBn ? 'বিশেষায়িত গবেষণাগার ও ল্যাব' : 'Departmental Laboratories'}
            </h2>
          </div>

          {labsList.length === 0 ? (
            <EmptyState
              title={isBn ? 'কোনো ল্যাব তালিকাভুক্ত নেই' : 'No Laboratories Listed'}
              description={isBn ? 'এই বিভাগের ল্যাবরেটরি বিবরণ চূড়ান্তকরণ প্রক্রিয়াধীন।' : 'Laboratory specifications for this department are being compiled.'}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {labsList.map((lab) => (
                <Card key={lab.id} padding="lg" className="space-y-4 hover:border-[#1E3A8A] transition-all bg-white">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E3A8A] bg-[#EFF6FF] px-2 py-0.5 rounded">
                        Lab Capacity: {lab.capacity} Seats
                      </span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        [REPLACE]
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A]">
                      {isBn ? lab.nameBn : lab.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{isBn ? lab.locationBn : lab.location}</span>
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isBn ? lab.descriptionBn : lab.description}
                  </p>

                  {/* Key Equipment */}
                  <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {isBn ? 'প্রধান যন্ত্রপাতি ও সফটওয়্যার:' : 'Major Equipment & Hardware:'}
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {(isBn ? lab.keyEquipmentBn : lab.keyEquipment).map((eq, eqIdx) => (
                        <li key={eqIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{eq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500">
                    <span>{isBn ? 'ল্যাব ইন-চার্জ:' : 'Lab In-Charge:'} <strong>{isBn ? lab.labInChargeBn : lab.labInCharge}</strong></span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 6: RESEARCH */}
      {/* ===================================================================== */}
      {activeTab === 'research' && (
        <div className="space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
              {isBn ? 'গবেষণা ও প্রকাশনা' : 'Scholarly Innovation'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {isBn ? 'বিভাগীয় গবেষণা প্রকল্প' : 'Active & Completed Research Projects'}
            </h2>
          </div>

          {researchList.length === 0 ? (
            <EmptyState
              title={isBn ? 'কোনো গবেষণা প্রকল্প পাওয়া যায়নি' : 'No Research Projects Found'}
              description={isBn ? 'গবেষণা তালিকা প্রস্তুত করা হচ্ছে।' : 'Research documentation is being processed.'}
            />
          ) : (
            <div className="space-y-4">
              {researchList.map((project) => (
                <Card key={project.id} padding="lg" className="space-y-3 hover:border-[#1E3A8A] transition-all bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        project.status === 'Ongoing'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isBn ? project.statusBn : project.status}
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      [REPLACE WITH REAL CONTENT]
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
                    {isBn ? project.titleBn : project.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isBn ? project.descriptionBn : project.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600 border-t border-[#E2E8F0]">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        {isBn ? 'প্রধান গবেষক:' : 'Principal Investigator:'}
                      </span>
                      <strong className="text-slate-800">{isBn ? project.principalInvestigatorBn : project.principalInvestigator}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        {isBn ? 'তহবিল সংস্থা:' : 'Funding Agency:'}
                      </span>
                      <strong className="text-slate-800">{isBn ? project.fundingAgencyBn : project.fundingAgency}</strong>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 7: NOTICES */}
      {/* ===================================================================== */}
      {activeTab === 'notices' && (
        <div className="space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
              {isBn ? 'বিভাগীয় নোটিশ বোর্ড' : 'Official Announcements'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {isBn ? `${department.code} বিভাগের নোটিশসমূহ` : `${department.code} Departmental Notices`}
            </h2>
          </div>

          {noticesList.length === 0 ? (
            <EmptyState
              title={isBn ? 'কোনো নোটিশ নেই' : 'No Departmental Notices'}
              description={isBn ? 'এই মুহূর্তে এই বিভাগে কোনো সক্রিয় নোটিশ নেই।' : 'No active notices currently published for this department.'}
            />
          ) : (
            <div className="space-y-4">
              {noticesList.map((notice) => (
                <Card
                  key={notice.id}
                  padding="md"
                  className="space-y-2 hover:border-[#1E3A8A] transition-all bg-white"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{isBn ? notice.dateBn : notice.date}</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                        {isBn ? notice.categoryBn : notice.category}
                      </span>
                      {notice.isImportant && (
                        <span className="bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded text-[10px]">
                          {isBn ? 'জরুরি' : 'Urgent'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
                      [REPLACE]
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0F172A]">
                    {isBn ? notice.titleBn : notice.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isBn ? notice.contentBn : notice.content}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 8: CONTACT */}
      {/* ===================================================================== */}
      {activeTab === 'contact' && (
        <div className="space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
              {isBn ? 'যোগাযোগ ও অবস্থান' : 'Inquiries & Location'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {isBn ? `${name} - যোগাযোগ দপ্তর` : `Contact ${name}`}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card padding="lg" className="space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">
                {isBn ? 'বিভাগীয় কার্যালয়' : 'Departmental Office'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isBn
                  ? 'জেএসটিইউ মূল ক্যাম্পাসের নির্ধারিত একাডেমিক কমপ্লেক্সে অফিস চলাকালীন (সকাল ৯:০০ টা হতে বিকাল ৫:০০ টা, রবিবার হতে বৃহস্পতিবার) যোগাযোগ করা যাবে।'
                  : 'Located within the permanent university campus grounds. Office hours are Sunday through Thursday, 09:00 AM to 05:00 PM.'}
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#1E3A8A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#0F172A]">Location:</strong>
                    <span>Academic Complex, Jamalpur Science & Technology University, Jamalpur-2012</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#1E3A8A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#0F172A]">Email:</strong>
                    <span className="font-mono">{department.headOfDepartment.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#1E3A8A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#0F172A]">Office Phone:</strong>
                    <span>+880 29977 12000 (Ext. {department.code}) [REPLACE]</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card padding="lg" className="space-y-4 bg-slate-50">
              <h3 className="text-base font-bold text-[#0F172A]">
                {isBn ? 'শিক্ষার্থী পরামর্শ ও সেবা' : 'Student Advising & Inquiries'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isBn
                  ? 'কোর্স রেজিস্ট্রেশন, ট্রান্সক্রিপ্ট সত্যায়ন বা ভর্তি সংক্রান্ত তথ্যের জন্য বিভাগীয় কোঅর্ডিনেটরের সাথে যোগাযোগের নির্দেশ দেওয়া যাচ্ছে।'
                  : 'For curriculum advising, credit waiver assessments, or recommendation inquiries, contact the respective faculty advisor.'}
              </p>

              <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] space-y-1 text-xs">
                <span className="font-bold text-[#1E3A8A] block">Notice:</span>
                <span className="text-slate-500">
                  [REPLACE WITH REAL CONTENT] Official departmental phone lines and physical desk appointments are subject to administrative gazette confirmation.
                </span>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
