import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Users,
  Search,
  Filter,
  Building2,
  MapPin,
  ExternalLink,
  Mail,
  Phone,
  Plus,
  CheckCircle2,
  Sparkles,
  Globe,
  Briefcase,
  Heart,
  DollarSign,
  ShieldCheck,
  Shield,
  Eye,
  EyeOff,
  Award,
  Calendar,
  Clock,
  Send,
  Download,
  Printer,
  ChevronRight,
  Info,
  Check,
  FileText
} from 'lucide-react';
import { SEOHead } from '../../../components/common/SEOHead';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Badge } from '../../../components/common/Badge';
import { useLanguage } from '../../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../../services/shared/sharedDataStore';
import {
  AlumnusProfile,
  AlumniJobPost,
  AlumniDonation,
  DonationCause,
  AlumniPrivacySettings,
  OrganizationType
} from '../../../types/alumni';

export const AlumniPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const storeManager = SharedDataStoreManager.getInstance();

  // Active sub-navigation tab
  const [activeTab, setActiveTab] = useState<'directory' | 'stories' | 'jobs' | 'giving'>('directory');

  // Directory state
  const [alumniProfiles, setAlumniProfiles] = useState<AlumnusProfile[]>(() => storeManager.getAlumniProfiles());
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedBatch, setSelectedBatch] = useState<string>('All');
  const [selectedOrgType, setSelectedOrgType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Alumnus detail modal
  const [selectedAlumnus, setSelectedAlumnus] = useState<AlumnusProfile | null>(null);

  // Registration Modal state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [regForm, setRegForm] = useState({
    fullName: '',
    fullNameBn: '',
    studentId: '',
    department: 'Computer Science & Engineering',
    departmentCode: 'CSE',
    batch: '1st Batch (2012-13)',
    graduationYear: 2017,
    degree: 'B.Sc. (Engg.) in CSE',
    email: '',
    phone: '',
    currentCompany: '',
    designation: '',
    organizationType: 'Tech' as OrganizationType,
    country: 'Bangladesh',
    city: 'Dhaka',
    linkedinUrl: '',
    privacy: {
      showEmail: true,
      showPhone: false,
      showCurrentCompany: true,
      showDesignation: true,
      showCityCountry: true,
      showLinkedin: true
    } as AlumniPrivacySettings
  });

  // Job Board state
  const [jobPosts, setJobPosts] = useState<AlumniJobPost[]>(() => storeManager.getAlumniJobs());
  const [selectedJob, setSelectedJob] = useState<AlumniJobPost | null>(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [jobDeptFilter, setJobDeptFilter] = useState('All');
  const [jobSearchQuery, setJobSearchQuery] = useState('');

  const [newJobForm, setNewJobForm] = useState({
    title: '',
    company: '',
    location: 'Dhaka / Hybrid',
    jobType: 'Full-time' as const,
    departmentTarget: 'CSE',
    experienceLevel: 'Entry-level' as const,
    description: '',
    requirements: '',
    salaryRange: '৳40,000 - ৳60,000 / month',
    postedByAlumnusName: '',
    postedByAlumnusBatch: '1st Batch (2012-13)',
    postedByAlumnusDesignation: '',
    contactEmail: '',
    applyUrl: ''
  });

  // Donation state
  const [donations, setDonations] = useState<AlumniDonation[]>(() => storeManager.getAlumniDonations());
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [selectedCause, setSelectedCause] = useState<DonationCause>('student_scholarships');
  const [donationAmount, setDonationAmount] = useState<number>(5000);
  const [customAmountInput, setCustomAmountInput] = useState<string>('5000');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorBatch, setDonorBatch] = useState('1st Batch (2012-13)');
  const [donorDept, setDonorDept] = useState('CSE');
  const [donorMessage, setDonorMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentGatewayOpen, setPaymentGatewayOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Card'>('bKash');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedDonationReceipt, setCompletedDonationReceipt] = useState<AlumniDonation | null>(null);

  const departments = ['All', 'CSE', 'EEE', 'MATH', 'FISH', 'GEOL', 'MGMT', 'SOCW'];
  const batches = [
    'All',
    '1st Batch (2012-13)',
    '2nd Batch (2013-14)',
    '3rd Batch (2014-15)',
    '4th Batch (2015-16)',
    '5th Batch (2016-17)',
    '6th Batch (2017-18)',
    '7th Batch (2018-19)'
  ];
  const orgTypes = ['All', 'Tech', 'Civil Service', 'Academia & Research', 'Financial & Banking', 'Multinational', 'Entrepreneurship'];

  // Filtered alumni
  const filteredAlumni = useMemo(() => {
    return alumniProfiles.filter((a) => {
      const matchDept = selectedDept === 'All' || a.departmentCode === selectedDept;
      const matchBatch = selectedBatch === 'All' || a.batch === selectedBatch;
      const matchOrg = selectedOrgType === 'All' || a.organizationType === selectedOrgType;
      const matchSearch =
        searchQuery.trim() === '' ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.currentPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.country.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchBatch && matchOrg && matchSearch;
    });
  }, [alumniProfiles, selectedDept, selectedBatch, selectedOrgType, searchQuery]);

  // Spotlight alumni
  const spotlightAlumni = useMemo(() => {
    return alumniProfiles.filter((a) => a.isSpotlight);
  }, [alumniProfiles]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobPosts.filter((j) => {
      const matchDept = jobDeptFilter === 'All' || j.departmentTarget.includes(jobDeptFilter) || j.departmentTarget.includes('All');
      const matchSearch =
        jobSearchQuery.trim() === '' ||
        j.title.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
        j.company.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
        j.location.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
        j.postedByAlumnusName.toLowerCase().includes(jobSearchQuery.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [jobPosts, jobDeptFilter, jobSearchQuery]);

  // Submit Alumni Registration Request
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.fullName || !regForm.studentId || !regForm.email) return;

    storeManager.submitAlumniRegistration({
      fullName: regForm.fullName.trim(),
      fullNameBn: regForm.fullNameBn.trim() || undefined,
      studentId: regForm.studentId.trim(),
      department: regForm.department,
      departmentCode: regForm.departmentCode,
      batch: regForm.batch,
      graduationYear: Number(regForm.graduationYear),
      degree: regForm.degree,
      email: regForm.email.trim(),
      phone: regForm.phone.trim(),
      currentCompany: regForm.currentCompany.trim(),
      designation: regForm.designation.trim(),
      organizationType: regForm.organizationType,
      country: regForm.country.trim(),
      city: regForm.city.trim(),
      linkedinUrl: regForm.linkedinUrl.trim() || undefined,
      privacy: regForm.privacy
    });

    setFeedback(
      isBn
        ? `ধন্যবাদ! ${regForm.fullName}-এর নিবন্ধন আবেদন জমা হয়েছে। প্রশাসনিক অনুমোদনের পর ডিরেক্টরিতে প্রকাশিত হবে।`
        : `Registration request submitted for ${regForm.fullName}! An admin will review and verify your record before it appears in the public directory.`
    );
    setIsRegisterModalOpen(false);
  };

  // Submit Job Post
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobForm.title || !newJobForm.company || !newJobForm.contactEmail) return;

    const reqArray = newJobForm.requirements
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const created = storeManager.createAlumniJob({
      title: newJobForm.title,
      company: newJobForm.company,
      location: newJobForm.location,
      jobType: newJobForm.jobType,
      departmentTarget: [newJobForm.departmentTarget],
      experienceLevel: newJobForm.experienceLevel,
      description: newJobForm.description || 'Alumni referral opportunity for JSTU graduates.',
      requirements: reqArray.length > 0 ? reqArray : ['Relevant degree from JSTU', 'Strong fundamental skills'],
      salaryRange: newJobForm.salaryRange,
      postedByAlumnusId: 'user-alumnus',
      postedByAlumnusName: newJobForm.postedByAlumnusName || 'Alumnus Member',
      postedByAlumnusBatch: newJobForm.postedByAlumnusBatch,
      postedByAlumnusDesignation: newJobForm.postedByAlumnusDesignation || 'Lead Engineer',
      contactEmail: newJobForm.contactEmail,
      applyUrl: newJobForm.applyUrl || undefined,
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
    });

    setJobPosts(storeManager.getAlumniJobs());
    setIsPostJobModalOpen(false);
    setFeedback(
      isBn
        ? `চাকরির বিজ্ঞপ্তি "${created.title}" সফলভাবে পোস্ট করা হয়েছে!`
        : `Job posting "${created.title}" published successfully on the Alumni Board!`
    );
  };

  // Process Mock Donation Payment
  const handleCompleteDonation = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const causeTitles: Record<DonationCause, { en: string; bn: string }> = {
        student_scholarships: {
          en: 'Underprivileged Student Semester Tuition Endowment',
          bn: 'অসচ্ছল শিক্ষার্থীদের সেমিস্টার ফি অনুদান তহবিল'
        },
        campus_greenery: {
          en: 'Botanical Garden & Campus Tree Plantation Project',
          bn: 'বোটানিক্যাল গার্ডেন ও ক্যাম্পাস বৃক্ষরোপণ কর্মসূচি'
        },
        robotics_lab: {
          en: 'High-Performance Computing & Robotics Equipment Fund',
          bn: 'উচ্চক্ষমতাসম্পন্ন কম্পিউটিং ও রোবোটিক্স ল্যাব উন্নয়ন'
        },
        hall_student_welfare: {
          en: 'Residential Halls Student Emergency Welfare Fund',
          bn: 'আবাসিক হল ছাত্রকল্যাণ ও জরুরি সেবা তহবিল'
        },
        medical_emergency_fund: {
          en: 'Student Emergency Medical & Healthcare Aid',
          bn: 'শিক্ষার্থী জরুরি চিকিৎসা সহায়তা তহবিল'
        }
      };

      const titleObj = causeTitles[selectedCause];

      const donation = storeManager.createAlumniDonation({
        donorName: isAnonymous ? 'Anonymous Alumnus' : donorName || 'Generous Donor',
        donorEmail: donorEmail || 'donor@alumni.jstu.ac.bd',
        donorPhone: donorPhone || '+880 1700 000000',
        isAlumnus: true,
        alumnusBatch: donorBatch,
        alumnusDept: donorDept,
        cause: selectedCause,
        causeTitle: titleObj.en,
        causeTitleBn: titleObj.bn,
        amount: Number(donationAmount) || 5000,
        paymentMethod: selectedPaymentMethod,
        transactionId: `${selectedPaymentMethod.toUpperCase()}${Math.floor(100000 + Math.random() * 900000)}JSTU`,
        message: donorMessage || 'Glad to give back to my beloved alma mater.',
        isAnonymous
      });

      setDonations(storeManager.getAlumniDonations());
      setIsProcessingPayment(false);
      setPaymentGatewayOpen(false);
      setIsDonationModalOpen(false);
      setCompletedDonationReceipt(donation);
    }, 1200);
  };

  const totalDonationsAmount = useMemo(() => {
    return donations.reduce((sum, d) => sum + d.amount, 0);
  }, [donations]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <SEOHead
        title={isBn ? 'অ্যালামনাই নেটওয়ার্ক ও গ্র্যাজুয়েট ডিরেক্টরি | জেএসটিইউ' : 'Alumni Network & Graduate Directory | JSTU'}
        description={
          isBn
            ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের সাবেক শিক্ষার্থীদের ডিরেক্টরি, ক্যারিয়ার গল্প, জব বোর্ড এবং অ্যালামনাই অনুদান তহবিল।'
            : 'JSTU Alumni Association: directory with privacy controls, career spotlights, alumni job board, and university endowment.'
        }
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#07192C] via-[#0A2540] to-[#1E3A8A] text-white py-12 px-4 sm:px-8 border-b border-blue-900 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-amber-300 text-xs font-semibold border border-blue-400/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{isBn ? 'জেএসটিইউ অ্যালামনাই অ্যাসোসিয়েশন' : 'JSTU Alumni Association (JSTUAA)'}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2.5 py-1 rounded-lg">
                ESTD. 2017 &bull; 8 DEPARTMENTS &bull; 3,200+ GRADUATES
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {isBn ? 'সাবেক শিক্ষার্থী ও অ্যালামনাই নেটওয়ার্ক' : 'Alumni Network & Graduate Directory'}
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mt-1.5 leading-relaxed">
                {isBn
                  ? 'গুগল, মেটা, বাংলাদেশ সিভিল সার্ভিস, বহুজাতিক প্রতিষ্ঠান ও বিশ্বখ্যাত বিশ্ববিদ্যালয়ে কর্মরত জেএসটিইউ-এর গর্বিত গ্র্যাজুয়েটদের মেলবন্ধন।'
                  : 'Connecting alumni shaping technology, public policy, academia, and global enterprises. Empowering future graduates through mentorship, jobs, and giving back.'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDonationModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs font-semibold"
                leftIcon={<Heart className="w-4 h-4 text-rose-400" />}
              >
                {isBn ? 'অ্যালামনাই অনুদান' : 'Give Back / Donate'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsRegisterModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-sm text-xs"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                {isBn ? 'অ্যালামনাই নিবন্ধন' : 'Register as Alumnus'}
              </Button>
            </div>
          </div>

          {/* Sub-navigation tabs */}
          <div className="flex border-b border-blue-900/60 pt-4 gap-2 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('directory')}
              className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'directory'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isBn ? 'গ্র্যাজুয়েট ডিরেক্টরি' : 'Alumni Directory'}</span>
              <span className="ml-1 text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                {alumniProfiles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('stories')}
              className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'stories'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isBn ? 'সফলতার গল্প' : 'Success Stories'}</span>
              <span className="ml-1 text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                {spotlightAlumni.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'jobs'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>{isBn ? 'অ্যালামনাই জব বোর্ড' : 'Alumni Job Board'}</span>
              <span className="ml-1 text-[10px] bg-emerald-500/40 text-emerald-200 px-1.5 py-0.2 rounded-full font-bold">
                {jobPosts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('giving')}
              className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'giving'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>{isBn ? 'অ্যালামনাই অনুদান ও তহবিল' : 'Alumni Giving & Endowment'}</span>
              <span className="ml-1 text-[10px] bg-rose-500/30 text-rose-200 px-1.5 py-0.2 rounded-full font-bold">
                ৳{(totalDonationsAmount / 1000).toFixed(0)}k
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 space-y-6">
        {/* Global Feedback Banner */}
        {feedback && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600 font-bold">
              &times;
            </button>
          </div>
        )}

        {/* TAB 1: ALUMNI DIRECTORY (WITH PRIVACY CONTROLS) */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            {/* Privacy notice banner */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>{isBn ? 'গোপনীয়তা রক্ষা নীতি:' : 'Directory Privacy Discipline:'}</strong>{' '}
                  {isBn
                    ? 'প্রত্যেক সদস্যের নির্বাচিত সেটিংস অনুযায়ী কেবলমাত্র অনুমোদিত তথ্যসমূহ প্রদর্শিত হয়। লুকায়িত তথ্য সংরক্ষিত থাকে।'
                    : 'Each alumnus profile strictly respects granular privacy settings. Fields marked private by the graduate are redacted or concealed.'}
                </span>
              </div>
              <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-1 rounded border border-blue-200 shrink-0">
                100% Privacy Respected
              </span>
            </div>

            {/* Search & Filters */}
            <Card padding="md" className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-5 relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={isBn ? 'নাম, কোম্পানি, পদবী বা শহর দিয়ে খুঁজুন...' : 'Search by name, organization, designation, city...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                  >
                    <option value="All">{isBn ? 'সকল বিভাগ (All Departments)' : 'All Departments'}</option>
                    {departments.filter((d) => d !== 'All').map((d) => (
                      <option key={d} value={d}>
                        {d} Department
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                  >
                    {batches.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <select
                    value={selectedOrgType}
                    onChange={(e) => setSelectedOrgType(e.target.value)}
                    className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                  >
                    {orgTypes.map((ot) => (
                      <option key={ot} value={ot}>
                        {ot === 'All' ? 'All Sectors' : ot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Alumni Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAlumni.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl space-y-2">
                  <Users className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">
                    {isBn ? 'কোনো অ্যালামনাই প্রোফাইল পাওয়া যায়নি' : 'No alumni profiles match the selected filters'}
                  </p>
                  <p className="text-xs text-slate-400">Try adjusting your search criteria or department filter.</p>
                </div>
              ) : (
                filteredAlumni.map((alum) => {
                  const p = alum.privacy;

                  return (
                    <Card
                      key={alum.id}
                      padding="md"
                      className="bg-white border-slate-200 hover:border-blue-400 transition shadow-2xs flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Top identity row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-blue-100 text-[#1E3A8A] font-extrabold flex items-center justify-center text-sm border border-blue-200 shrink-0">
                              {alum.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-bold text-sm text-slate-900">
                                  {isBn ? alum.nameBn : alum.name}
                                </h3>
                                {alum.isApproved && (
                                  <span title="Verified JSTU Alumnus">
                                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono block">
                                {alum.batch} &bull; {alum.departmentCode}
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {alum.organizationType}
                          </span>
                        </div>

                        {/* Professional Information (Privacy Checked) */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                          {/* Designation */}
                          <div className="flex items-start gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              {p.showDesignation ? (
                                <span className="font-semibold text-slate-800">
                                  {isBn && alum.currentPositionBn ? alum.currentPositionBn : alum.currentPosition}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic flex items-center gap-1 text-[11px]">
                                  <EyeOff className="w-3 h-3" /> Position concealed
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Company / Organization */}
                          <div className="flex items-start gap-2">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              {p.showCurrentCompany ? (
                                <span className="text-slate-600 font-medium truncate block">
                                  {alum.organization}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic flex items-center gap-1 text-[11px]">
                                  <EyeOff className="w-3 h-3" /> Employer hidden
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              {p.showCityCountry ? (
                                <span className="text-slate-500 text-[11px]">
                                  {alum.city}, {alum.country}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic text-[11px]">Location hidden</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions & Contact (Privacy checked) */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {p.showEmail && alum.email ? (
                            <a
                              href={`mailto:${alum.email}`}
                              className="text-slate-500 hover:text-blue-600 p-1.5 rounded hover:bg-slate-50"
                              title={alum.email}
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span className="text-slate-300 p-1.5" title="Email private">
                              <EyeOff className="w-3.5 h-3.5" />
                            </span>
                          )}

                          {p.showPhone && alum.phone && (
                            <a
                              href={`tel:${alum.phone}`}
                              className="text-slate-500 hover:text-emerald-600 p-1.5 rounded hover:bg-slate-50"
                              title={alum.phone}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {p.showLinkedin && alum.linkedinUrl && (
                            <a
                              href={alum.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-500 hover:text-blue-700 p-1.5 rounded hover:bg-slate-50"
                              title="LinkedIn Profile"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAlumnus(alum)}
                          className="text-blue-700 text-[11px] font-semibold"
                        >
                          {isBn ? 'প্রোফাইল দেখুন' : 'View Profile'}
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SUCCESS STORIES & SPOTLIGHT */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{isBn ? 'জেএসটিইউ অ্যালামনাই স্পটলাইট ও অনুপ্রেরণাদায়ী যাত্রা' : 'Alumni Spotlight & Inspirational Journeys'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'আন্তর্জাতিক প্রযুক্তি প্রতিষ্ঠান, সিভিল সার্ভিস, গবেষণা ও উদ্যোক্তা হিসেবে বিশ্ববিদ্যালয়ের মুখ উজ্জ্বলকারী গ্র্যাজুয়েটদের গল্প।'
                  : 'Featuring notable achievements, insights, and advice from JSTU graduates leading research, public service, and global innovations.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {spotlightAlumni.map((alum) => (
                <Card key={alum.id} padding="lg" className="bg-white border-slate-200 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0A2540] to-blue-600 text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
                        {alum.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900">
                          {isBn ? alum.nameBn : alum.name}
                        </h3>
                        <p className="text-xs text-blue-700 font-semibold">{alum.currentPosition}</p>
                        <p className="text-[11px] text-slate-400">{alum.organization}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
                      <p className="text-xs text-blue-900 italic font-medium leading-relaxed">
                        &ldquo;{isBn && alum.spotlightQuoteBn ? alum.spotlightQuoteBn : alum.spotlightQuote}&rdquo;
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isBn && alum.spotlightStoryBn ? alum.spotlightStoryBn : alum.spotlightStory}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-slate-400">
                      {alum.degree} &bull; {alum.graduatedYear}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAlumnus(alum)}
                      className="text-xs"
                    >
                      Read Full Story
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ALUMNI JOB BOARD */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>{isBn ? 'জেএসটিইউ অ্যালামনাই ক্যারিয়ার ও জব বোর্ড' : 'Alumni Job Board & Career Opportunities'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn
                    ? 'জেএসটিইউ সাবেক শিক্ষার্থীদের দ্বারা পোস্টকৃত সরাসরি নিয়োগ ও রেফারেল সুযোগ।'
                    : 'Exclusive career opportunities, direct referrals, and internships posted by JSTU alumni for fellow graduates and seniors.'}
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsPostJobModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold self-start sm:self-auto shrink-0"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                {isBn ? 'চাকরির বিজ্ঞপ্তি দিন' : 'Post Job Opening'}
              </Button>
            </div>

            {/* Filter row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-8 relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={isBn ? 'পদবী, কোম্পানি বা অবস্থান দিয়ে খুঁজুন...' : 'Search by job title, company, location, or alumni name...'}
                  value={jobSearchQuery}
                  onChange={(e) => setJobSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={jobDeptFilter}
                  onChange={(e) => setJobDeptFilter(e.target.value)}
                  className="w-full py-2 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                >
                  <option value="All">{isBn ? 'সকল বিভাগীয় নিয়োগ' : 'All Target Departments'}</option>
                  <option value="CSE">CSE Target</option>
                  <option value="EEE">EEE Target</option>
                  <option value="MATH">Mathematics Target</option>
                  <option value="FISH">Fisheries Target</option>
                </select>
              </div>
            </div>

            {/* Job listings list */}
            <div className="space-y-3">
              {filteredJobs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl space-y-2">
                  <Briefcase className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">No active job posts matching your criteria</p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    padding="md"
                    className="bg-white border-slate-200 hover:border-blue-400 transition shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-slate-900">{job.title}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                            {job.jobType}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {job.experienceLevel}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-slate-700">{job.company}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                          </span>
                          {job.salaryRange && (
                            <>
                              <span>&bull;</span>
                              <span className="font-mono text-emerald-700 font-semibold">{job.salaryRange}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedJob(job)}
                          className="text-xs"
                        >
                          View Details
                        </Button>
                        <a
                          href={job.applyUrl || `mailto:${job.contactEmail}?subject=Application for ${job.title} (JSTU Alumni Referral)`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-500 text-xs">
                            Apply via Alumni
                          </Button>
                        </a>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <div>
                        Referred by: <strong className="text-slate-600">{job.postedByAlumnusName}</strong> ({job.postedByAlumnusBatch})
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ALUMNI GIVING & ENDOWMENT */}
        {activeTab === 'giving' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Endowment Impact Card */}
              <div className="md:col-span-2 space-y-6">
                <Card padding="lg" className="bg-white border-slate-200 space-y-5">
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-rose-600 font-bold flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5" /> JSTU Alumni Giving & Permanent Endowment
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">
                      {isBn ? 'আপনার প্রিয় ক্যাম্পাসে ইতিবাচক পরিবর্তন আনুন' : 'Leave a Lasting Legacy for Current & Future Students'}
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isBn
                        ? 'অ্যালামনাই অনুদানের ১০০% সরাসরি শিক্ষার্থীদের মেধা ও অসচ্ছলতা বৃত্তি, অত্যাধুনিক ল্যাব যন্ত্রপাতি ক্রয় এবং আবাসিক হল উন্নয়নে ব্যয় হয়।'
                        : 'Every contribution directly funds student scholarships, research hardware, emergency medical aids, and campus sustainability. Transparently audited with instant receipts.'}
                    </p>
                  </div>

                  {/* Impact Causes Showcase */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Key Priority Causes for 2026:
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-blue-600" />
                          Student Scholarship Fund
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Covers semester tuition & stipends for 50+ students in financial distress.
                        </p>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '74%' }}></div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">৳1,480,000 / ৳2,000,000 Goal</span>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          Robotics & AI Innovation Lab
                        </div>
                        <p className="text-[11px] text-slate-500">
                          GPU compute clusters and sensors for senior undergraduate capstone projects.
                        </p>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                          <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '58%' }}></div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">৳870,000 / ৳1,500,000 Goal</span>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Globe className="w-4 h-4 text-emerald-600" />
                          Green Campus Tree Drive
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Planting 2,500 native trees and solar-powered campus pathway lighting.
                        </p>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                          <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">৳425,000 / ৳500,000 Goal</span>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Heart className="w-4 h-4 text-rose-600" />
                          Student Emergency Medical Aid
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Immediate 24/7 financial support for hospitalized campus residents.
                        </p>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                          <div className="bg-rose-600 h-1.5 rounded-full" style={{ width: '62%' }}></div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">৳310,000 / ৳500,000 Goal</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => setIsDonationModalOpen(true)}
                      className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                      leftIcon={<Heart className="w-4 h-4" />}
                    >
                      Make a Contribution Now (Mock Payment)
                    </Button>
                  </div>
                </Card>

                {/* Recent Donor Wall */}
                <Card padding="md" className="bg-white border-slate-200 space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center justify-between">
                    <span>Recent Donor Honor Roll</span>
                    <span className="font-mono text-slate-400 font-normal">Audited Ledger</span>
                  </h3>

                  <div className="divide-y divide-slate-100 text-xs">
                    {donations.map((d) => (
                      <div key={d.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-900">
                            {d.isAnonymous ? 'Anonymous Alumnus' : d.donorName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {d.causeTitle} &bull; {d.alumnusBatch}
                          </div>
                          {d.message && (
                            <p className="text-[10px] text-slate-400 italic mt-0.5">&ldquo;{d.message}&rdquo;</p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-emerald-600">
                            ৳{d.amount.toLocaleString('en-US')}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">{d.receiptNo}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right Column: Endowment Fast Facts */}
              <div className="space-y-4">
                <Card padding="md" className="bg-white border-slate-200 space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Giving Transparency
                  </h3>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Zero administrative overhead; 100% funds target causes.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Instant digital receipt with official university verification seal.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Donor name can remain anonymous upon request.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Quarterly impact reports sent to all contributing alumni.</span>
                    </div>
                  </div>
                </Card>

                <div className="p-4 bg-gradient-to-br from-blue-900 to-[#0A2540] text-white rounded-2xl space-y-3 shadow-sm">
                  <div className="text-xs font-mono uppercase text-amber-300 font-bold">Total Endowment Pool</div>
                  <div className="text-3xl font-black font-mono">৳{totalDonationsAmount.toLocaleString('en-US')}</div>
                  <p className="text-[11px] text-blue-200">
                    Raised across {donations.length} alumni transactions this academic session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: VIEW ALUMNUS PROFILE MODAL */}
      <Modal
        isOpen={!!selectedAlumnus}
        onClose={() => setSelectedAlumnus(null)}
        title={isBn ? 'অ্যালামনাই সদস্য প্রোফাইল' : 'Alumnus Member Profile'}
        size="md"
      >
        {selectedAlumnus && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-[#1E3A8A] font-extrabold flex items-center justify-center text-base border border-blue-200 shrink-0">
                {selectedAlumnus.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{selectedAlumnus.name}</h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  {selectedAlumnus.degree} &bull; {selectedAlumnus.batch}
                </p>
                <p className="text-[11px] text-blue-700 font-semibold">{selectedAlumnus.departmentName}</p>
              </div>
            </div>

            <div className="space-y-2.5 p-3 bg-white border border-slate-200 rounded-xl">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current Role</span>
                  <span className="font-bold text-slate-800">
                    {selectedAlumnus.privacy.showDesignation ? selectedAlumnus.currentPosition : 'Concealed by member'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Company / Org</span>
                  <span className="font-bold text-slate-800">
                    {selectedAlumnus.privacy.showCurrentCompany ? selectedAlumnus.organization : 'Hidden by member'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location</span>
                  <span className="text-slate-700">
                    {selectedAlumnus.privacy.showCityCountry
                      ? `${selectedAlumnus.city}, ${selectedAlumnus.country}`
                      : 'Private'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Sector</span>
                  <span className="text-slate-700">{selectedAlumnus.organizationType}</span>
                </div>
              </div>

              {selectedAlumnus.privacy.showEmail && selectedAlumnus.email && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Verified Email</span>
                  <a href={`mailto:${selectedAlumnus.email}`} className="text-blue-600 hover:underline font-mono">
                    {selectedAlumnus.email}
                  </a>
                </div>
              )}

              {selectedAlumnus.privacy.showLinkedin && selectedAlumnus.linkedinUrl && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">LinkedIn Profile</span>
                  <a
                    href={selectedAlumnus.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    <span>{selectedAlumnus.linkedinUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {selectedAlumnus.spotlightStory && (
              <div className="p-3 bg-blue-50/70 rounded-xl space-y-1">
                <span className="font-bold text-blue-900 block text-xs">Career Journey:</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">{selectedAlumnus.spotlightStory}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedAlumnus(null)}>
                Close Window
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 2: REGISTER AS ALUMNUS (WITH PRIVACY TOGGLES) */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title={isBn ? 'নতুন অ্যালামনাই নিবন্ধন আবেদন' : 'Alumni Registration Request (Admin Verified)'}
        size="lg"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center gap-2 text-blue-800">
            <Info className="w-4 h-4 shrink-0 text-blue-600" />
            <span>
              All registration submissions are verified against graduation registrar records by the JSTU Alumni Relations Cell before becoming visible.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Full Name (English) *</label>
              <input
                type="text"
                required
                value={regForm.fullName}
                onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                placeholder="e.g. Shakil Mahmud"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Student Roll / ID *</label>
              <input
                type="text"
                required
                value={regForm.studentId}
                onChange={(e) => setRegForm({ ...regForm, studentId: e.target.value })}
                placeholder="e.g. JSTU1601025"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Department *</label>
              <select
                value={regForm.departmentCode}
                onChange={(e) => {
                  const code = e.target.value;
                  const nameMap: Record<string, string> = {
                    CSE: 'Computer Science & Engineering',
                    EEE: 'Electrical & Electronic Engineering',
                    MATH: 'Mathematics',
                    FISH: 'Fisheries & Marine Bioscience',
                    GEOL: 'Geology & Mining',
                    MGMT: 'Management Studies',
                    SOCW: 'Social Work'
                  };
                  setRegForm({
                    ...regForm,
                    departmentCode: code,
                    department: nameMap[code] || 'Engineering'
                  });
                }}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="CSE">CSE</option>
                <option value="EEE">EEE</option>
                <option value="MATH">Mathematics</option>
                <option value="FISH">Fisheries</option>
                <option value="GEOL">Geology</option>
                <option value="MGMT">Management</option>
                <option value="SOCW">Social Work</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Batch *</label>
              <select
                value={regForm.batch}
                onChange={(e) => setRegForm({ ...regForm, batch: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                {batches.filter((b) => b !== 'All').map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Graduation Year *</label>
              <input
                type="number"
                min="2016"
                max="2026"
                required
                value={regForm.graduationYear}
                onChange={(e) => setRegForm({ ...regForm, graduationYear: Number(e.target.value) })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Email Address *</label>
              <input
                type="email"
                required
                value={regForm.email}
                onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                placeholder="name@company.com"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Phone Number</label>
              <input
                type="text"
                value={regForm.phone}
                onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                placeholder="+880 1700 000000"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Current Employer / Company *</label>
              <input
                type="text"
                required
                value={regForm.currentCompany}
                onChange={(e) => setRegForm({ ...regForm, currentCompany: e.target.value })}
                placeholder="e.g. Grameenphone / Ministry of ICT"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Designation / Role *</label>
              <input
                type="text"
                required
                value={regForm.designation}
                onChange={(e) => setRegForm({ ...regForm, designation: e.target.value })}
                placeholder="e.g. Assistant Director / Senior Engineer"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Sector *</label>
              <select
                value={regForm.organizationType}
                onChange={(e) => setRegForm({ ...regForm, organizationType: e.target.value as OrganizationType })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="Tech">Tech & Software</option>
                <option value="Civil Service">Civil Service / Govt</option>
                <option value="Academia & Research">Academia & Research</option>
                <option value="Financial & Banking">Financial & Banking</option>
                <option value="Multinational">Multinational</option>
                <option value="Entrepreneurship">Entrepreneurship</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Country</label>
              <input
                type="text"
                value={regForm.country}
                onChange={(e) => setRegForm({ ...regForm, country: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">City</label>
              <input
                type="text"
                value={regForm.city}
                onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">LinkedIn Profile URL</label>
              <input
                type="url"
                value={regForm.linkedinUrl}
                onChange={(e) => setRegForm({ ...regForm, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Granular Privacy Controls */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-600" />
                Directory Privacy Controls (Choose what to show publicly):
              </span>
              <span className="text-[10px] font-normal text-slate-500">Unchecked fields are concealed</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regForm.privacy.showEmail}
                  onChange={(e) =>
                    setRegForm({
                      ...regForm,
                      privacy: { ...regForm.privacy, showEmail: e.target.checked }
                    })
                  }
                  className="rounded text-blue-600"
                />
                <span>Show Email</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regForm.privacy.showPhone}
                  onChange={(e) =>
                    setRegForm({
                      ...regForm,
                      privacy: { ...regForm.privacy, showPhone: e.target.checked }
                    })
                  }
                  className="rounded text-blue-600"
                />
                <span>Show Phone</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regForm.privacy.showCurrentCompany}
                  onChange={(e) =>
                    setRegForm({
                      ...regForm,
                      privacy: { ...regForm.privacy, showCurrentCompany: e.target.checked }
                    })
                  }
                  className="rounded text-blue-600"
                />
                <span>Show Employer</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regForm.privacy.showDesignation}
                  onChange={(e) =>
                    setRegForm({
                      ...regForm,
                      privacy: { ...regForm.privacy, showDesignation: e.target.checked }
                    })
                  }
                  className="rounded text-blue-600"
                />
                <span>Show Designation</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regForm.privacy.showCityCountry}
                  onChange={(e) =>
                    setRegForm({
                      ...regForm,
                      privacy: { ...regForm.privacy, showCityCountry: e.target.checked }
                    })
                  }
                  className="rounded text-blue-600"
                />
                <span>Show City & Country</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regForm.privacy.showLinkedin}
                  onChange={(e) =>
                    setRegForm({
                      ...regForm,
                      privacy: { ...regForm.privacy, showLinkedin: e.target.checked }
                    })
                  }
                  className="rounded text-blue-600"
                />
                <span>Show LinkedIn</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsRegisterModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-blue-600 hover:bg-blue-500">
              Submit for Admin Verification
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: POST JOB OPENING */}
      <Modal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        title={isBn ? 'নতুন চাকরির বিজ্ঞপ্তি পোস্ট করুন' : 'Post Alumni Job Opportunity'}
        size="lg"
      >
        <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Job Title *</label>
              <input
                type="text"
                required
                value={newJobForm.title}
                onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                placeholder="e.g. Junior Systems Engineer"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Hiring Company *</label>
              <input
                type="text"
                required
                value={newJobForm.company}
                onChange={(e) => setNewJobForm({ ...newJobForm, company: e.target.value })}
                placeholder="e.g. Optima Telecom Ltd."
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Work Type</label>
              <select
                value={newJobForm.jobType}
                onChange={(e) => setNewJobForm({ ...newJobForm, jobType: e.target.value as any })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Experience Level</label>
              <select
                value={newJobForm.experienceLevel}
                onChange={(e) => setNewJobForm({ ...newJobForm, experienceLevel: e.target.value as any })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="Entry-level">Entry-level (Fresh Grad)</option>
                <option value="Mid-level">Mid-level (1-3 Years)</option>
                <option value="Senior">Senior (4+ Years)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Target Department</label>
              <select
                value={newJobForm.departmentTarget}
                onChange={(e) => setNewJobForm({ ...newJobForm, departmentTarget: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="CSE">CSE</option>
                <option value="EEE">EEE</option>
                <option value="MATH">Mathematics</option>
                <option value="FISH">Fisheries</option>
                <option value="MGMT">Management</option>
                <option value="All">All Disciplines</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Location</label>
              <input
                type="text"
                value={newJobForm.location}
                onChange={(e) => setNewJobForm({ ...newJobForm, location: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Salary Range</label>
              <input
                type="text"
                value={newJobForm.salaryRange}
                onChange={(e) => setNewJobForm({ ...newJobForm, salaryRange: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Short Description & Scope</label>
            <textarea
              rows={2}
              value={newJobForm.description}
              onChange={(e) => setNewJobForm({ ...newJobForm, description: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Requirements (One per line)</label>
            <textarea
              rows={3}
              value={newJobForm.requirements}
              onChange={(e) => setNewJobForm({ ...newJobForm, requirements: e.target.value })}
              placeholder="e.g. B.Sc. in CSE from JSTU&#10;Proficiency in React and Node&#10;Problem solving skills"
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Contact / CV Submission Email *</label>
              <input
                type="email"
                required
                value={newJobForm.contactEmail}
                onChange={(e) => setNewJobForm({ ...newJobForm, contactEmail: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">External Apply Link (Optional)</label>
              <input
                type="url"
                value={newJobForm.applyUrl}
                onChange={(e) => setNewJobForm({ ...newJobForm, applyUrl: e.target.value })}
                placeholder="https://company.com/jobs/..."
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsPostJobModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-blue-600 hover:bg-blue-500">
              Publish to Job Board
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 4: JOB DETAILS MODAL */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob ? selectedJob.title : 'Job Details'}
        size="md"
      >
        {selectedJob && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{selectedJob.company}</span>
                <span className="font-mono text-emerald-700 font-bold">{selectedJob.salaryRange}</span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                <span>{selectedJob.location}</span> &bull; <span>{selectedJob.jobType}</span> &bull;{' '}
                <span>{selectedJob.experienceLevel}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-800">Job Description:</span>
              <p className="text-slate-600 leading-relaxed">{selectedJob.description}</p>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-800">Key Requirements:</span>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                {selectedJob.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl space-y-1">
              <span className="font-bold text-blue-900">Alumni Referral Notice:</span>
              <p className="text-blue-800 text-[11px]">
                Posted by <strong>{selectedJob.postedByAlumnusName}</strong> ({selectedJob.postedByAlumnusBatch}).
                Mention JSTU Alumni Network referral in your cover letter.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setSelectedJob(null)}>
                Close
              </Button>
              <a
                href={selectedJob.applyUrl || `mailto:${selectedJob.contactEmail}?subject=Application for ${selectedJob.title} (JSTU Alumni Referral)`}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-500">
                  Apply Now
                </Button>
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 5: ALUMNI DONATION & ENDOWMENT (MOCK PAYMENT) */}
      <Modal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        title={isBn ? 'জেএসটিইউ অ্যালামনাই তহবিল অনুদান (মক পেমেন্ট)' : 'JSTU Alumni Giving & Endowment Contribution'}
        size="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800">1. Select Target Cause / Project *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'student_scholarships', label: 'Student Scholarship Endowment', desc: 'Semester tuition aid' },
                { id: 'robotics_lab', label: 'Robotics & AI Lab Fund', desc: 'Hardware & GPU servers' },
                { id: 'campus_greenery', label: 'Green Campus & Tree Plantation', desc: 'Botanical garden trees' },
                { id: 'hall_student_welfare', label: 'Residential Halls Student Welfare', desc: 'Emergency crisis aid' }
              ].map((cause) => (
                <div
                  key={cause.id}
                  onClick={() => setSelectedCause(cause.id as DonationCause)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    selectedCause === cause.id
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="font-bold">{cause.label}</div>
                  <div className="text-[11px] text-slate-500">{cause.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-800">2. Contribution Amount (BDT) *</label>
            <div className="flex items-center gap-2 flex-wrap">
              {[1000, 2500, 5000, 10000, 25000, 50000].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => {
                    setDonationAmount(amt);
                    setCustomAmountInput(amt.toString());
                  }}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition ${
                    donationAmount === amt
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  ৳{amt.toLocaleString('en-US')}
                </button>
              ))}
            </div>

            <div className="pt-1.5">
              <input
                type="number"
                min="100"
                step="500"
                value={customAmountInput}
                onChange={(e) => {
                  setCustomAmountInput(e.target.value);
                  setDonationAmount(Number(e.target.value));
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Or enter custom amount in BDT..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Donor Name</label>
              <input
                type="text"
                disabled={isAnonymous}
                value={isAnonymous ? 'Anonymous Alumnus' : donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Your full name"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Email Address (for receipt)</label>
              <input
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="donor@company.com"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Alumnus Batch</label>
              <select
                value={donorBatch}
                onChange={(e) => setDonorBatch(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                {batches.filter((b) => b !== 'All').map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Encouragement Message (Optional)</label>
              <input
                type="text"
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                placeholder="e.g. Keep inspiring juniors!"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="anon-check"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded text-blue-600"
            />
            <label htmlFor="anon-check" className="text-xs text-slate-700 cursor-pointer">
              Hide my identity on the public donor wall (Make donation anonymous)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setIsDonationModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsDonationModalOpen(false);
                setPaymentGatewayOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 font-bold"
              leftIcon={<DollarSign className="w-4 h-4" />}
            >
              Proceed to Mock Payment (৳{donationAmount.toLocaleString('en-US')})
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL 6: MOCK PAYMENT GATEWAY */}
      <Modal
        isOpen={paymentGatewayOpen}
        onClose={() => setPaymentGatewayOpen(false)}
        title="JSTU Secure Online Payment Gateway (Simulator)"
        size="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Payable Amount</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                ৳{donationAmount.toLocaleString('en-US')} BDT
              </span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-1 rounded font-mono">DEMO SANDBOX</span>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-slate-700">Select Payment Method:</label>
            <div className="grid grid-cols-4 gap-2">
              {(['bKash', 'Nagad', 'Rocket', 'Card'] as const).map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setSelectedPaymentMethod(method)}
                  className={`p-2 rounded-lg border text-center font-bold text-xs transition ${
                    selectedPaymentMethod === method
                      ? 'border-blue-600 bg-blue-50 text-blue-800'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Simulated Payment Channel</span>
            </div>
            <p className="text-[11px] text-amber-700">
              This is a test gateway. No real money will be charged. Clicking &ldquo;Confirm Payment&rdquo; will generate an official digital endowment receipt.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              disabled={isProcessingPayment}
              onClick={() => setPaymentGatewayOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={isProcessingPayment}
              onClick={handleCompleteDonation}
              className="bg-emerald-600 hover:bg-emerald-500 font-bold"
            >
              {isProcessingPayment ? 'Processing...' : `Confirm Payment of ৳${donationAmount.toLocaleString('en-US')}`}
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL 7: OFFICIAL DONATION RECEIPT */}
      <Modal
        isOpen={!!completedDonationReceipt}
        onClose={() => setCompletedDonationReceipt(null)}
        title="Official JSTU Endowment Receipt"
        size="md"
      >
        {completedDonationReceipt && (
          <div className="space-y-4 text-xs">
            {/* Printable Receipt Card */}
            <div className="p-5 bg-white border-2 border-slate-200 rounded-2xl shadow-sm space-y-4 font-sans text-slate-800">
              {/* Header */}
              <div className="text-center border-b border-slate-200 pb-3 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                  GOVERNMENT OF THE PEOPLE’S REPUBLIC OF BANGLADESH
                </span>
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                  Jamalpur Science & Technology University
                </h3>
                <p className="text-[11px] text-slate-500">
                  Office of Alumni Relations & University Endowment &bull; Receipt Voucher
                </p>
              </div>

              {/* Receipt details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">RECEIPT NO</span>
                  <span className="font-mono font-bold text-blue-700">{completedDonationReceipt.receiptNo}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono block">TRANSACTION ID</span>
                  <span className="font-mono font-bold text-slate-800">{completedDonationReceipt.transactionId}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Donor Name:</span>
                  <span className="font-bold text-slate-900">{completedDonationReceipt.donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Cause:</span>
                  <span className="font-semibold text-slate-800 text-right">{completedDonationReceipt.causeTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Gateway:</span>
                  <span className="font-mono text-slate-700">{completedDonationReceipt.paymentMethod} (Verified)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-mono text-slate-700">
                    {new Date(completedDonationReceipt.donatedAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                  <span className="font-bold text-slate-900">Amount Received:</span>
                  <span className="font-mono font-extrabold text-emerald-700">
                    ৳{completedDonationReceipt.amount.toLocaleString('en-US')} BDT
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2">
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Officially Endorsed & Audited
                </span>
                <span>Registrar Seal Valid</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="text-xs"
                leftIcon={<Printer className="w-3.5 h-3.5" />}
              >
                Print Receipt
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCompletedDonationReceipt(null)}
                className="bg-blue-600 hover:bg-blue-500 text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
