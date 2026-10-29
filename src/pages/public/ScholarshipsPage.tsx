import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { Scholarship, ScholarshipCategory } from '../../types/scholarship';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  GraduationCap,
  HelpCircle,
  Search,
  Sparkles,
  Users,
  DollarSign,
  FileText,
  Upload,
  ArrowRight,
  ShieldCheck,
  Building2,
  ExternalLink
} from 'lucide-react';

export const ScholarshipsPage: React.FC = () => {
  const { user, profile, claims } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const storeManager = SharedDataStoreManager.getInstance();

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Apply modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [targetScholarship, setTargetScholarship] = useState<Scholarship | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [cgpa, setCgpa] = useState('3.82');
  const [annualIncome, setAnnualIncome] = useState('180000');
  const [familyMembers, setFamilyMembers] = useState('5');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [reason, setReason] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  // Published recipients modal
  const [viewingRecipientsSch, setViewingRecipientsSch] = useState<Scholarship | null>(null);

  const loadScholarships = () => {
    const list = storeManager.getScholarships();
    setScholarships(list);
  };

  useEffect(() => {
    loadScholarships();
  }, []);

  useEffect(() => {
    if (user && profile) {
      setApplicantName(profile.fullName || user.displayName || '');
      setStudentId(claims?.studentId || (profile as { studentId?: string })?.studentId || 'JSTU2026001');
      setDepartment(claims?.departmentId || (profile as { department?: string })?.department || 'CSE');
    }
  }, [user, profile, claims]);

  const handleOpenApplyModal = (sch: Scholarship) => {
    setTargetScholarship(sch);
    setSubmissionSuccess(null);
    setAttachedFiles(['Income_Certificate_Ward_Commissioner.pdf', 'Semester_GradeSheet_Transcript.pdf']);
    setApplyModalOpen(true);
  };

  const handleSubmitApplication = () => {
    if (!targetScholarship) return;

    const newAppNumber = `JSTU-APP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const store = storeManager.getStore();
    if (!store.applications) store.applications = [];

    const newApp = {
      id: `app-sch-${Date.now()}`,
      applicationNumber: newAppNumber,
      type: 'scholarship' as const,
      title: 'Merit Scholarship / Tuition Stipend Application',
      titleBn: 'মেধাবৃত্তি ও শিক্ষাবৃত্তি আবেদন',
      applicantUid: user?.uid || 'demo_student_01',
      applicantName: applicantName || 'Tanvir Ahmed',
      applicantNameBn: profile?.fullNameBn || 'তানভীর আহমেদ',
      applicantEmail: user?.email || 'student.demo@jstu.ac.bd',
      studentId: studentId || 'JSTU2026001',
      department: department || 'CSE',
      status: 'SUBMITTED' as const,
      currentStepIndex: 0, // Starts at Chairman endorsement step
      chain: [
        { stepIndex: 0, role: 'dept_chairman' as const, title: 'Department Chairman', titleBn: 'বিভাগীয় চেয়ারম্যান', departmentScoped: true },
        { stepIndex: 1, role: 'registrar' as const, title: 'Scholarship Committee & Admin', titleBn: 'বৃত্তি কমিটি ও প্রশাসন', officeScoped: 'REGISTRAR' }
      ],
      payload: {
        scholarshipId: targetScholarship.id,
        scholarshipType: targetScholarship.category,
        scholarshipTitle: targetScholarship.title,
        cgpa: Number(cgpa) || 3.82,
        annualIncome: Number(annualIncome) || 180000,
        fatherOccupation: fatherOccupation || 'Self-employed',
        familyMembers: Number(familyMembers) || 5,
        reason: reason || 'Application submitted for semester financial grant.'
      },
      attachments: attachedFiles.map((name) => ({
        name,
        size: 1200000,
        type: 'application/pdf',
        uploadedAt: new Date().toISOString()
      })),
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          applicationId: `app-sch-${Date.now()}`,
          applicationNumber: newAppNumber,
          actorUid: user?.uid || 'demo_student_01',
          actorName: applicantName || 'Tanvir Ahmed',
          actorEmail: user?.email || 'student.demo@jstu.ac.bd',
          role: 'student',
          action: 'SUBMIT' as const,
          fromStatus: 'DRAFT' as const,
          toStatus: 'SUBMITTED' as const,
          fromStepIndex: 0,
          toStepIndex: 0,
          comment: 'Online scholarship application submitted with certified income documentation.',
          timestamp: new Date().toISOString()
        }
      ],
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.applications.unshift(newApp);
    storeManager.saveStore(store);

    setSubmissionSuccess(newAppNumber);
  };

  const filteredScholarships = scholarships.filter((s) => {
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-white to-[#F1F5F9] border-b border-[#E2E8F0] pt-10 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#006A4E]">
            <Award className="w-3.5 h-3.5" />
            <span>{isBn ? 'বিশ্ববিদ্যালয় আর্থিক সহায়তা ও বৃত্তি' : 'Institutional Scholarships & Grants'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            {isBn ? 'শিক্ষাবৃত্তি ও ফেলোশিপ প্রোগ্রাম' : 'Scholarships, Grants & Merit Fellowships'}
          </h1>

          <p className="text-xs sm:text-base text-[#475569] max-w-2xl leading-relaxed">
            {isBn
              ? 'জেএসটিইউ শিক্ষার্থীদের মেধা ও আর্থিক সক্ষমতা মূল্যায়নের মাধ্যমে প্রদত্ত প্রাতিষ্ঠানিক সুযোগ-সুবিধা। অনলাইনে আবেদন করুন এবং পেপারলেস ট্র্যাকিংয়ের মাধ্যমে অগ্রগতি পর্যবেক্ষণ করুন।'
              : 'Explore undergraduate endowments, need-cum-merit stipends, and research fellowships. Apply seamlessly online through the institutional paperless workflow.'}
          </p>

          {/* Search & Category Filter Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#94A3B8]" />
              <input
                type="text"
                placeholder={isBn ? 'বৃত্তির নাম বা বিবরণ খুঁজুন...' : 'Search scholarships by title or keywords...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#CBD5E1] rounded-xl text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#006A4E]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['ALL', 'Merit', 'Need-Based', 'Special', 'District-Quota'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#006A4E] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-[#CBD5E1] hover:bg-slate-50'
                  }`}
                >
                  {cat === 'ALL'
                    ? isBn ? 'সকল বৃত্তি' : 'All Grants'
                    : cat === 'Need-Based'
                    ? isBn ? 'অসচ্ছলতা ভিত্তিক' : 'Need-Based'
                    : cat === 'Merit'
                    ? isBn ? 'মেধাভিত্তিক' : 'Merit'
                    : cat === 'Special'
                    ? isBn ? 'বিশেষ ফেলোশিপ' : 'Special'
                    : isBn ? 'জেলা কোটা' : 'District Quota'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <span>
            {filteredScholarships.length} {isBn ? 'টি বৃত্তি পাওয়া গেছে' : 'scholarships found'}
          </span>
          <span className="hidden sm:inline">
            Workflow: Student &rarr; Chairman &rarr; Scholarship Committee &rarr; Approved
          </span>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredScholarships.map((sch) => {
            const isDeadlinePassed = new Date(sch.deadline).getTime() < Date.now();
            const isPublished = sch.status === 'PUBLISHED';
            const isUnderReview = sch.status === 'UNDER_REVIEW';

            return (
              <Card
                key={sch.id}
                className="p-6 border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Top Category Badge and Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#EBF5FF] text-[#006A4E]">
                      {sch.category}
                    </span>

                    <Badge
                      variant={
                        isPublished
                          ? 'success'
                          : isUnderReview
                          ? 'warning'
                          : isDeadlinePassed
                          ? 'neutral'
                          : 'primary'
                      }
                    >
                      {isPublished
                        ? isBn ? 'ফলাফল প্রকাশিত' : 'Recipients Published'
                        : isUnderReview
                        ? isBn ? 'যাচাই বাছাই চলমান' : 'Under Committee Review'
                        : isDeadlinePassed
                        ? isBn ? 'আবেদনের সময় সমাপ্ত' : 'Closed'
                        : isBn ? 'আবেদন চলছে' : 'Accepting Applications'}
                    </Badge>
                  </div>

                  {/* Title and Description */}
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A] leading-snug">
                      {isBn ? sch.titleBn : sch.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] mt-2 leading-relaxed">
                      {isBn ? sch.descriptionBn : sch.description}
                    </p>
                  </div>

                  {/* Financial & Merit Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9] text-xs">
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Award Value</span>
                      <span className="font-extrabold text-[#006A4E] text-sm">
                        {isBn ? sch.amountFormattedBn : sch.amountFormatted}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#64748B] block text-[11px]">Min. CGPA</span>
                      <span className="font-bold text-[#0F172A] text-sm">{sch.minimumCgpa.toFixed(2)}</span>
                    </div>

                    <div>
                      <span className="text-[#64748B] block text-[11px]">Available Slots</span>
                      <span className="font-bold text-[#0F172A] text-sm">{sch.slots} Recipients</span>
                    </div>
                  </div>

                  {/* Eligibility Criteria */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                      {isBn ? 'যোগ্যতার মানদণ্ড' : 'Key Eligibility Criteria'}
                    </h4>
                    <ul className="space-y-1 text-xs text-[#334155]">
                      {(isBn ? sch.eligibilityBn : sch.eligibility).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#006A4E] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {isBn ? 'আবেদনের শেষ তারিখ:' : 'Deadline:'}{' '}
                      {new Date(sch.deadline).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPublished && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingRecipientsSch(sch)}
                        className="text-xs border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      >
                        <Award className="w-3.5 h-3.5 mr-1" />
                        {isBn ? 'ফলাফল দেখুন' : 'View Awardees'}
                      </Button>
                    )}

                    {!isDeadlinePassed && sch.status !== 'CLOSED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenApplyModal(sch)}
                        className="text-xs bg-[#006A4E] hover:bg-[#00523C]"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1" />
                        {isBn ? 'অনলাইনে আবেদন' : 'Apply Online'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Paperless Workflow Assurance Callout */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#006A4E]" />
              <h3 className="font-bold text-base sm:text-lg text-[#0F172A]">
                {isBn ? 'সম্পূর্ণ পেপারলেস ও স্বচ্ছ নির্বাচন প্রক্রিয়া' : 'Transparent & Paperless Endorsement Flow'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              {isBn
                ? 'অনলাইনে আবেদন জমা দেওয়ার পর বিভাগীয় চেয়ারম্যান ও বৃত্তি কমিটি স্বয়ংক্রিয়ভাবে সিজিপিএ ও পারিবারিক আয়ের উপর ভিত্তি করে মেধা তালিকা প্রস্তুত করে। কোনো শারীরিক কাগজপত্র জমা দেওয়ার প্রয়োজন নেই।'
                : 'All scholarship submissions are automatically routed through the institutional paperless workflow engine. Track application progress from Department Chairman review to the University Scholarship Committee.'}
            </p>
          </div>

          <Link to="/student/applications" className="shrink-0">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm font-semibold">
              {isBn ? 'আমার আবেদন ট্র্যাক করুন' : 'Track Existing Applications'}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Online Scholarship Application Modal */}
      {applyModalOpen && targetScholarship && (
        <Modal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          title={isBn ? 'অনলাইন শিক্ষাবৃত্তি আবেদন ফর্ম' : 'Online Scholarship Application'}
          maxWidth="xl"
        >
          <div className="space-y-5 max-h-[75vh] overflow-y-auto px-1">
            {submissionSuccess ? (
              <div className="p-6 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-emerald-950">
                    {isBn ? 'আবেদন সফলভাবে গৃহীত হয়েছে!' : 'Scholarship Application Submitted!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800">
                    Your application has been assigned tracking reference number:
                  </p>
                  <span className="inline-block px-3 py-1 bg-white border border-emerald-300 font-mono font-bold text-sm text-emerald-900 rounded-lg mt-1">
                    {submissionSuccess}
                  </span>
                </div>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Your application has entered Step 1 (Department Chairman Endorsement). You can track status, endorsements, and comments in your student portal.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link to="/student/applications">
                    <Button variant="primary" size="sm" className="bg-[#006A4E]">
                      Go to Paperless Applications Inbox
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => setApplyModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Scholarship Context Info */}
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-1">
                  <div className="text-xs font-bold text-[#006A4E] uppercase tracking-wider">
                    Target Grant: {targetScholarship.category}
                  </div>
                  <h4 className="font-bold text-sm text-[#0F172A]">{targetScholarship.title}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] pt-1">
                    <span>Award: <strong>{targetScholarship.amountFormatted}</strong></span>
                    <span>&bull;</span>
                    <span>Min. CGPA: <strong>{targetScholarship.minimumCgpa.toFixed(2)}</strong></span>
                    <span>&bull;</span>
                    <span>Quota: <strong>{targetScholarship.slots} Awardees</strong></span>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Applicant Full Name"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      required
                    />

                    <Input
                      label="Student ID"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="dept-select-sch" className="block text-xs font-semibold text-slate-700 mb-1">
                        Department
                      </label>
                      <select
                        id="dept-select-sch"
                        aria-label="Department selection"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="CSE">Computer Science & Engineering</option>
                        <option value="EEE">Electrical & Electronic Engineering</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Fisheries">Fisheries & Marine Bioscience</option>
                        <option value="Geology">Geology & Mining</option>
                        <option value="Management">Management Studies</option>
                        <option value="Social Work">Social Work</option>
                      </select>
                    </div>

                    <Input
                      label="Current CGPA"
                      type="number"
                      step="0.01"
                      min="2.00"
                      max="4.00"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      required
                    />

                    <Input
                      label="Annual Family Income (BDT)"
                      type="number"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(e.target.value)}
                      placeholder="e.g. 180000"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Father / Guardian Occupation"
                      value={fatherOccupation}
                      onChange={(e) => setFatherOccupation(e.target.value)}
                      placeholder="e.g. Farmer / Primary School Teacher"
                    />

                    <Input
                      label="Total Dependent Family Members"
                      type="number"
                      value={familyMembers}
                      onChange={(e) => setFamilyMembers(e.target.value)}
                      placeholder="e.g. 5"
                    />
                  </div>

                  <div>
                    <label htmlFor="sch-statement-purpose" className="block text-xs font-semibold text-slate-700 mb-1">
                      Statement of Need & Academic Justification
                    </label>
                    <textarea
                      id="sch-statement-purpose"
                      aria-label="Statement of Need and Justification"
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Briefly state your academic aspirations, family circumstances, and why you should be considered for this grant..."
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg text-[#0F172A]"
                      required
                    />
                  </div>

                  {/* Attached Documents */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Required Attachments (PDF format &bull; Max 5 MB)
                    </label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      {attachedFiles.map((f, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-2 text-slate-800 font-medium">
                            <FileText className="w-4 h-4 text-[#006A4E]" />
                            <span>{f}</span>
                          </div>
                          <Badge variant="success">Attached</Badge>
                        </div>
                      ))}
                      <p className="text-[11px] text-slate-500 italic">
                        Demo Mode: Certified Ward/Union Commissioner Income Document and Official Grade Sheet pre-attached for instant verification.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <Button variant="outline" size="sm" onClick={() => setApplyModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSubmitApplication}
                    className="bg-[#006A4E] hover:bg-[#00523C]"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    Submit Application to Workflow
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Published Recipients Awardee Modal */}
      {viewingRecipientsSch && (
        <Modal
          isOpen={!!viewingRecipientsSch}
          onClose={() => setViewingRecipientsSch(null)}
          title={`${viewingRecipientsSch.title}: Published Awardees`}
          maxWidth="lg"
        >
          <div className="space-y-5 max-h-[75vh] overflow-y-auto px-1">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Official Gazette of Selected Recipients
                </span>
                <h4 className="font-bold text-sm text-emerald-950 mt-0.5">
                  Published: {viewingRecipientsSch.publishedAt ? new Date(viewingRecipientsSch.publishedAt).toLocaleDateString() : 'Recent'}
                </h4>
              </div>
              <Badge variant="success">{viewingRecipientsSch.publishedRecipients?.length || 0} Awardees</Badge>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Student ID</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3 text-center">CGPA</th>
                    <th className="px-4 py-3 text-right">Award Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewingRecipientsSch.publishedRecipients?.map((rec) => (
                    <tr key={rec.studentId} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-[#006A4E]">
                        #{rec.rank}
                      </td>
                      <td className="px-4 py-3 font-bold text-[#0F172A]">{rec.studentName}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{rec.studentId}</td>
                      <td className="px-4 py-3 text-slate-700">{rec.department}</td>
                      <td className="px-4 py-3 text-center font-bold text-slate-800">{rec.cgpa.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-extrabold text-[#006A4E]">{rec.awardAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewingRecipientsSch(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
