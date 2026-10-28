import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Search,
  Filter,
  ExternalLink,
  Award,
  FlaskConical,
  GraduationCap,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  Building2,
  Download,
  Mail,
  ChevronDown,
  Layers
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Modal } from '../../components/common/Modal';
import { useLanguage } from '../../contexts/LanguageContext';
import { researchClustersData, campusImages } from '../../data/seedData';
import {
  researchPublicationsData,
  jstuJournalData,
  researchGrantsData
} from '../../data/publicSectionsSeedData';
import { ResearchPublication, ResearchGrantScheme } from '../../types/publicSections';

export const ResearchPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab') || 'clusters';
  const [activeTab, setActiveTab] = useState<'clusters' | 'publications' | 'journal' | 'ric'>(
    (tabParam as any) || 'clusters'
  );

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t === 'clusters' || t === 'publications' || t === 'journal' || t === 'ric') {
      setActiveTab(t);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'clusters' | 'publications' | 'journal' | 'ric') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Publications filtering
  const [pubSearchQuery, setPubSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

  const filteredPublications = researchPublicationsData.filter((pub) => {
    if (selectedDeptFilter !== 'all' && pub.departmentCode !== selectedDeptFilter) return false;
    if (pubSearchQuery.trim()) {
      const q = pubSearchQuery.toLowerCase().trim();
      const matchTitle = pub.title.toLowerCase().includes(q);
      const matchAuthors = pub.authors.some((a) => a.toLowerCase().includes(q));
      const matchJournal = pub.journalName.toLowerCase().includes(q);
      if (!matchTitle && !matchAuthors && !matchJournal) return false;
    }
    return true;
  });

  // RIC Grants filtering & Modals
  const [grantSearchQuery, setGrantSearchQuery] = useState('');
  const [selectedFundingFilter, setSelectedFundingFilter] = useState('all');
  const [selectedGrant, setSelectedGrant] = useState<ResearchGrantScheme | null>(null);
  const [showManuscriptModal, setShowManuscriptModal] = useState(false);
  const [templateDownloaded, setTemplateDownloaded] = useState(false);

  const filteredGrants = researchGrantsData.filter((grant) => {
    if (selectedFundingFilter !== 'all' && !grant.fundingBody.toLowerCase().includes(selectedFundingFilter.toLowerCase())) {
      return false;
    }
    if (grantSearchQuery.trim()) {
      const q = grantSearchQuery.toLowerCase().trim();
      const matchTitle = (isBn ? grant.titleBn : grant.title).toLowerCase().includes(q);
      const matchDesc = (isBn ? grant.descriptionBn : grant.description).toLowerCase().includes(q);
      const matchBody = grant.fundingBody.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchBody) return false;
    }
    return true;
  });

  const handleDownloadTemplate = () => {
    const content = `JASHORE SMART TECHNOLOGICAL UNIVERSITY (JSTU)\nJSTU Journal of Science and Technology - Official Author Template\nISSN (Print): 2708-4100 | ISSN (Online): 2708-4119\n/* [REPLACE WITH REAL LATEX/WORD TEMPLATE] */\n\nTitle of Manuscript: [Insert Title Here]\nAuthors: [Insert Authors and Department Affiliations]\nCorresponding Email: [author@jstu.ac.bd]\n\nAbstract:\n[Insert 200-250 words abstract outlining objectives, methodology, and key experimental findings]\n\nKeywords: [Keyword 1, Keyword 2, Keyword 3, Keyword 4]\n\n1. Introduction\n...\n2. Materials and Methods\n...\n3. Results and Discussion\n...\n4. Conclusion\n...\nReferences (IEEE style)\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'JSTU_Journal_Template.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTemplateDownloaded(true);
    setTimeout(() => setTemplateDownloaded(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12 bg-white">
      <SEOHead
        title={isBn ? 'গবেষণা, জার্নাল ও প্রকাশনা' : 'Research, JSTU Journal & Publications'}
        description="Explore active research clusters, faculty publications in high-impact journals, the JSTU Journal of Science & Technology, and Research Innovation Cell."
      />

      <Breadcrumb items={[{ label: isBn ? 'গবেষণা' : 'Research & Innovations' }]} />

      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
          {isBn ? 'উদ্ভাবন ও বৈজ্ঞানিক অনুসন্ধান' : 'Scientific Discovery & Innovation'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          {isBn ? 'জেএসটিইউ গবেষণা, জার্নাল ও প্রকাশনা' : 'Research & Academic Journals'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {isBn
            ? 'ফলিত বিজ্ঞান, কৃত্রিম বুদ্ধিমত্তা, নবায়নযোগ্য শক্তি ও জলবায়ু সহনশীলতায় আন্তর্জাতিক মানের গবেষণা এবং বিশ্ববিদ্যালয়ের নিজস্ব পিয়ার-রিভিউড জার্নাল।'
            : 'Fostering multidisciplinary applied research addressing regional delta resilience, artificial intelligence, renewable microgrids, and aquaculture genomics.'}
        </p>
      </div>

      {/* Main Research Tabs */}
      <div className="flex border-b border-[#E2E8F0] gap-4 sm:gap-8 overflow-x-auto">
        <button
          onClick={() => handleTabChange('clusters')}
          className={`pb-4 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'clusters'
              ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>{isBn ? 'গবেষণা ক্লাস্টার ও ল্যাব' : 'Research Clusters & Labs'}</span>
        </button>

        <button
          onClick={() => handleTabChange('publications')}
          className={`pb-4 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'publications'
              ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isBn ? 'শিক্ষক প্রকাশনা তালিকা' : 'Faculty Publications'}</span>
        </button>

        <button
          onClick={() => handleTabChange('journal')}
          className={`pb-4 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'journal'
              ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isBn ? 'জেএসটিইউ জার্নাল' : 'JSTU Journal of Science'}</span>
        </button>

        <button
          onClick={() => handleTabChange('ric')}
          className={`pb-4 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ric'
              ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{isBn ? 'গবেষণা ও উদ্ভাবন সেল (RIC)' : 'Research & Innovation Cell (RIC)'}</span>
        </button>
      </div>

      {/* TAB 1: RESEARCH CLUSTERS & LABS */}
      {activeTab === 'clusters' && (
        <div className="space-y-12 animate-fadeIn">
          {/* Research Lab Hero Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl shadow-xs overflow-hidden">
            <div className="relative h-72 sm:h-96">
              <img
                src={campusImages.researchLab}
                alt="JSTU Advanced Computing and Scientific Research Laboratory"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6 sm:p-10 text-white">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-mono tracking-widest text-amber-300 font-bold">
                    Central Research Infrastructure /* [REPLACE WITH REAL CONTENT] */
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black">
                    Interdisciplinary Computing, Biotech & Sensor Laboratories
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                    Featuring high-performance computing clusters, aquaculture wet hatcheries, environmental spectroscopy benches, and automated microgrid simulators.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Clusters Grid */}
          <div className="space-y-6">
            <div className="border-b border-[#E2E8F0] pb-4">
              <h2 className="text-2xl font-bold text-[#0F172A]">
                {isBn ? 'সক্রিয় গবেষণা ক্লাস্টারসমূহ' : 'Active Interdisciplinary Research Clusters'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isBn
                  ? 'বিভিন্ন অনুষদের গবেষকদের সমন্বয়ে পরিচালিত প্রধান প্রধান গবেষণা ক্ষেত্রসমূহ'
                  : 'Collaborative priority initiatives solving strategic national and ecological challenges.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {researchClustersData.map((cluster) => (
                <Card
                  key={cluster.id}
                  className="p-6 border border-[#E2E8F0] bg-white space-y-4 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded">
                      {cluster.leadDepartment}
                    </span>
                    <h3 className="text-base font-bold text-[#0F172A]">
                      {isBn ? cluster.titleBn : cluster.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isBn ? cluster.descriptionBn : cluster.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div>
                      <strong className="text-slate-900 block font-mono text-sm">
                        {cluster.ongoingProjects}
                      </strong>
                      <span className="text-[10px]">Ongoing Projects</span>
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-mono text-sm">
                        {cluster.publicationsCount}
                      </strong>
                      <span className="text-[10px]">Publications</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FACULTY PUBLICATIONS */}
      {activeTab === 'publications' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Publications Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { key: 'all', label: 'All Departments' },
                { key: 'CSE', label: 'CSE' },
                { key: 'EEE', label: 'EEE' },
                { key: 'MATH', label: 'Mathematics' },
                { key: 'FISH', label: 'Fisheries' },
                { key: 'GEOL', label: 'Geology' },
                { key: 'MGMT', label: 'Management' },
                { key: 'SW', label: 'Social Work' }
              ].map((dept) => (
                <button
                  key={dept.key}
                  onClick={() => setSelectedDeptFilter(dept.key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition cursor-pointer ${
                    selectedDeptFilter === dept.key
                      ? 'bg-[#1E3A8A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {dept.label}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-80">
              <Input
                placeholder="Search publications by author or title..."
                value={pubSearchQuery}
                onChange={(e) => setPubSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Publications List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredPublications.length} peer-reviewed research papers</span>
            </div>

            {filteredPublications.map((pub) => {
              const isExpanded = expandedAbstractId === pub.id;
              return (
                <Card
                  key={pub.id}
                  className="p-6 border border-[#E2E8F0] bg-white space-y-3 hover:border-slate-300 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-50 text-[#1E3A8A]">
                        {pub.departmentCode}
                      </span>
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {pub.indexedIn}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Year {pub.year}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-semibold font-mono">
                      Citations: {pub.citations}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0F172A] leading-snug">
                    {pub.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium">
                    Authors: {pub.authors.join(', ')}
                  </p>

                  <div className="text-xs text-slate-500 italic">
                    Published in: <strong>{pub.journalName}</strong>
                  </div>

                  {/* Expandable Abstract */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-200 animate-fadeIn">
                      <strong className="block text-slate-800 mb-1">Abstract:</strong>
                      {pub.abstract}
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setExpandedAbstractId(isExpanded ? null : pub.id)}
                      className="text-[#1E3A8A] font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Abstract' : 'Read Abstract'}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-400">DOI: {pub.doi}</span>
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#1E3A8A] font-bold hover:underline"
                      >
                        <span>Publisher Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: JSTU JOURNAL OF SCIENCE & TECHNOLOGY */}
      {activeTab === 'journal' && (
        <div className="space-y-12 animate-fadeIn">
          {/* Journal Banner */}
          <div className="p-8 sm:p-12 bg-gradient-to-r from-[#0F172A] to-[#1E3A8A] text-white rounded-3xl shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <span className="px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold font-mono uppercase tracking-wider border border-amber-300/30">
                Official Peer-Reviewed Institutional Periodical
              </span>
              <h2 className="text-2xl sm:text-4xl font-black">
                JSTU Journal of Science and Technology
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                A multidisciplinary international biannual journal published by Jashore Smart Technological University dedicated to original research in engineering, biology, applied mathematics, and environmental geosciences.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-300 pt-2 border-t border-white/10">
                <div>ISSN (Print): <strong>{jstuJournalData.issnPrint}</strong></div>
                <div>ISSN (Online): <strong>{jstuJournalData.issnOnline}</strong></div>
                <div>Current Issue: <strong>{jstuJournalData.volume}, {jstuJournalData.issue}</strong></div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-amber-300" />
              <div className="text-xs">
                <span className="block font-bold">Call for Papers &bull; Vol. 13 No. 1</span>
                <span className="text-slate-300">Submission Deadline: Dec 31, 2026</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="bg-amber-400 text-slate-950 font-bold hover:bg-amber-300"
                onClick={() => setShowManuscriptModal(true)}
              >
                Submit Manuscript
              </Button>
            </div>
          </div>

          {templateDownloaded && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isBn
                  ? 'জেএসটিইউ জার্নাল অথর টেমপ্লেট সফলভাবে ডাউনলোড হয়েছে।'
                  : 'JSTU Journal author manuscript template downloaded successfully (JSTU_Journal_Template.docx).'}
              </span>
            </div>
          )}

          {/* Scope and Editorial Board Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <Card className="p-6 border border-[#E2E8F0] bg-white space-y-4">
                <h3 className="text-lg font-bold text-[#0F172A]">Aims & Publication Scope</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The journal accepts original research papers, short communications, and comprehensive state-of-the-art reviews in:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600">
                  <li>Computer Science, Machine Intelligence, and Edge Network Systems</li>
                  <li>Power Engineering, Renewable Energy, and Smart Grid Infrastructures</li>
                  <li>Aquaculture, Marine Microbiology, and River Basin Bio-Ecology</li>
                  <li>Petroleum Geology, Hydro-Geochemistry, and Delta Sedimentary Modeling</li>
                  <li>Pure & Applied Mathematical Physics and Dynamical Systems</li>
                </ul>
              </Card>

              <Card className="p-6 border border-[#E2E8F0] bg-white space-y-3">
                <h3 className="text-lg font-bold text-[#0F172A]">Author Submission Guidelines</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Manuscripts must be submitted in standard IEEE or Springer two-column LaTeX / MS Word formats. All submissions undergo double-blind peer review by at least two independent international experts.
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                    onClick={handleDownloadTemplate}
                  >
                    Download Author LaTeX/Word Template
                  </Button>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <Card className="p-6 border border-[#E2E8F0] bg-white space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-[#0F172A]">Editorial Advisory Board</h3>
                  <span className="text-xs text-slate-400">Distinguished national and international academics</span>
                </div>

                <div className="space-y-3">
                  {jstuJournalData.editorialBoard.map((member, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl space-y-0.5 text-xs">
                      <strong className="text-slate-900 block">{member.name}</strong>
                      <span className="text-[#1E3A8A] font-semibold block">{member.designation}</span>
                      <span className="text-slate-500 text-[11px] block">{member.institution}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RESEARCH & INNOVATION CELL (RIC) */}
      {activeTab === 'ric' && (
        <div className="space-y-12 animate-fadeIn">
          {/* RIC Vision & Director Message */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-mono font-bold text-[#1E3A8A] uppercase tracking-wider">
                Research & Innovation Cell (RIC) Directorate
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                Fostering Frontier Research, Industry MOUs & National Grants
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The Research & Innovation Cell functions as the central executive statutory body coordinating competitive research grants, patent filing support, inter-university research consortiums, and institutional ethical clearances.
              </p>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
                <strong>Director's Secretariat:</strong>
                <p>Office of the Director (RIC), Room 210, Administrative Building, JSTU Campus.</p>
                <p>Email: <span className="font-mono">ric@jstu.ac.bd</span> &bull; Ext: 1045</p>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-3">
              <h4 className="font-bold text-sm text-[#0F172A]">Key Institutional Mandates</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Annual university revenue research grant administration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Ethical Review Board (ERB) certification protocols.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Intellectual Property (IPR) and Technology Transfer facilitation.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Grant Schemes List */}
          <div className="space-y-6">
            <div className="border-b border-[#E2E8F0] pb-4">
              <h3 className="text-xl font-bold text-[#0F172A]">
                {isBn ? 'সক্রিয় গবেষণা অনুদান কর্মসূচি' : 'Active Research Funding Schemes & Grants'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Competitive institutional grants open for full-time faculty proposals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {researchGrantsData.map((grant) => (
                <Card
                  key={grant.id}
                  className="p-6 border border-[#E2E8F0] bg-white space-y-4 hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1E3A8A] font-bold text-[10px] font-mono">
                      {grant.fundingBody}
                    </span>
                    <span className="text-xs text-red-600 font-bold font-mono">
                      Deadline: {grant.deadline}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#0F172A]">
                    {isBn ? grant.titleBn : grant.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isBn ? grant.descriptionBn : grant.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs flex items-center justify-between">
                    <span className="text-slate-500">Allocation Range:</span>
                    <strong className="text-emerald-700 font-mono">{grant.grantRange}</strong>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => alert(`Application guidelines for ${grant.title} dispatched.`)}
                    >
                      Apply for Grant
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
