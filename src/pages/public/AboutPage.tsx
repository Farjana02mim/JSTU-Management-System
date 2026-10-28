import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Compass,
  Award,
  Shield,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Users,
  Building2,
  Scale,
  FileCheck2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  Quote,
  Clock,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  campusImages,
  universityAuthoritiesData,
  citizensCharterData,
  organogramData,
  officesData,
  departmentsData
} from '../../data/seedData';
import { SafeMarkdown } from '../../components/common/SafeMarkdown';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';

type AboutTab =
  | 'history'
  | 'vision'
  | 'vc-message'
  | 'authorities'
  | 'organogram'
  | 'campus'
  | 'charter'
  | 'contact';

export const AboutPage: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab') as AboutTab | null;
  const [activeTab, setActiveTab] = useState<AboutTab>(
    tabParam && [
      'history',
      'vision',
      'vc-message',
      'authorities',
      'organogram',
      'campus',
      'charter',
      'contact'
    ].includes(tabParam)
      ? tabParam
      : 'history'
  );

  const [charterSearch, setCharterSearch] = useState('');

  // Sync tab state when URL param changes
  useEffect(() => {
    if (
      tabParam &&
      [
        'history',
        'vision',
        'vc-message',
        'authorities',
        'organogram',
        'campus',
        'charter',
        'contact'
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: AboutTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const store = SharedDataStoreManager.getInstance().getStore();
  const managedVc = store.managedVcMessage;
  const seedVc = universityAuthoritiesData.find((a) => a.roleKey === 'vc');
  const viceChancellor =
    managedVc && managedVc.status === 'published'
      ? {
          name: managedVc.vcName,
          nameBn: managedVc.vcNameBn,
          designation: managedVc.designation,
          designationBn: managedVc.designationBn,
          avatarUrl: managedVc.avatarUrl,
          email: managedVc.email,
          phone: managedVc.phone,
          officeLocation: managedVc.officeLocation,
          officeLocationBn: managedVc.officeLocationBn,
          speech: managedVc.speech,
          speechBn: managedVc.speechBn,
          quote: managedVc.quote,
          quoteBn: managedVc.quoteBn
        }
      : seedVc;

  // Filter citizens charter services
  const filteredCharter = citizensCharterData.filter((item) => {
    const q = charterSearch.toLowerCase();
    return (
      item.serviceName.toLowerCase().includes(q) ||
      item.serviceNameBn.includes(q) ||
      item.responsibleOffice.toLowerCase().includes(q) ||
      item.responsibleOfficeBn.includes(q)
    );
  });

  const tabTitles: Record<AboutTab, { en: string; bn: string; icon: React.ReactNode }> = {
    history: {
      en: 'History & Heritage',
      bn: 'ইতিহাস ও ঐতিহ্য',
      icon: <Calendar className="w-4 h-4" />
    },
    vision: {
      en: 'Vision & Mission',
      bn: 'রূপকল্প ও অভিলক্ষ্য',
      icon: <Compass className="w-4 h-4" />
    },
    'vc-message': {
      en: "Vice Chancellor's Message",
      bn: 'উপাচার্যের বাণী',
      icon: <Quote className="w-4 h-4" />
    },
    authorities: {
      en: 'Statutory Authorities',
      bn: 'বিশ্ববিদ্যালয় কর্তৃপক্ষ',
      icon: <Users className="w-4 h-4" />
    },
    organogram: {
      en: 'Organogram',
      bn: 'সাংগঠনিক কাঠামো',
      icon: <Layers className="w-4 h-4" />
    },
    campus: {
      en: 'Campus & Facilities',
      bn: 'ক্যাম্পাস ও অবকাঠামো',
      icon: <Building2 className="w-4 h-4" />
    },
    charter: {
      en: "Citizen's Charter",
      bn: 'নাগরিক সনদ',
      icon: <FileCheck2 className="w-4 h-4" />
    },
    contact: {
      en: 'Contact Directory',
      bn: 'যোগাযোগ নির্দেশিকা',
      icon: <Phone className="w-4 h-4" />
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 bg-white">
      <SEOHead
        title={isBn ? `আমাদের সম্পর্কে - ${tabTitles[activeTab].bn}` : `About JSTU - ${tabTitles[activeTab].en}`}
        description="Learn about Jamalpur Science & Technology University, established in 2012 at Jamalpur-2012, Bangladesh."
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: isBn ? 'আমাদের সম্পর্কে' : 'About JSTU', to: '/about' },
          { label: isBn ? tabTitles[activeTab].bn : tabTitles[activeTab].en }
        ]}
      />

      {/* Header Banner */}
      <div className="space-y-3 max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
          {isBn ? 'পরিচিতি ও প্রাতিষ্ঠানিক রূপরেখা' : 'Institutional Profile & Governance'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          {isBn
            ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়'
            : 'Jamalpur Science & Technology University (JSTU)'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {isBn
            ? 'উচ্চশিক্ষা, বিজ্ঞান ও প্রযুক্তিগত গবেষণায় উদ্ভাবন ও উৎকর্ষ সাধনের লক্ষ্যে জামালপুর-২০১২ এ প্রতিষ্ঠিত বাংলাদেশের একটি শীর্ষস্থানীয় পাবলিক বিশ্ববিদ্যালয়।'
            : 'A statutory government public university located at Jamalpur-2012, Bangladesh, dedicated to pioneering technological advancement, scientific inquiry, and smart digital administration.'}
        </p>
      </div>

      {/* Tab Navigation Ribbon */}
      <div className="border-b border-[#E2E8F0] overflow-x-auto scrollbar-none">
        <div className="flex gap-2 min-w-max pb-2">
          {(Object.keys(tabTitles) as AboutTab[]).map((tabKey) => {
            const isCurrent = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => handleTabChange(tabKey)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-[#F8FAFC] text-slate-600 hover:bg-[#EFF6FF] hover:text-[#1E3A8A] border border-[#E2E8F0]'
                }`}
              >
                {tabTitles[tabKey].icon}
                <span>{isBn ? tabTitles[tabKey].bn : tabTitles[tabKey].en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: History & Institutional Heritage */}
      {/* [REPLACE WITH REAL CONTENT] Official history, founding legislation, and gazette records */}
      {activeTab === 'history' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                {isBn ? 'প্রতিষ্ঠার পটভূমি' : 'Founding Background'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                {isBn ? 'বিজ্ঞান ও প্রযুক্তির আলো ছড়াতে জামালপুরে যাত্রা' : 'Pioneering Higher Science in the Northern Basin'}
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  {isBn
                    ? '/* [REPLACE WITH REAL CONTENT] বিশ্ববিদ্যালয়ের আইন ও প্রতিষ্ঠাকালীন বিবরণ */ জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (জেএসটিইউ) ২০১২ সালে গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের জাতীয় সংসদের আইনের মাধ্যমে প্রতিষ্ঠিত হয়। উত্তরাঞ্চলের শিক্ষার্থীদের মানসম্মত বিজ্ঞান, প্রকৌশল ও ফলিত শিক্ষা প্রদানে এ বিশ্ববিদ্যালয় এক অনন্য দিগন্তের সূচনা করে।'
                    : '/* [REPLACE WITH REAL CONTENT] Official University Founding Legislative Acts */ Jamalpur Science & Technology University (JSTU) was established under the statutory University Act enacted by the Parliament of Bangladesh in 2012. It was envisioned as a beacon of high-caliber engineering, scientific discovery, and human development in the historic Brahmaputra riverine plain.'}
                </p>
                <p>
                  {isBn
                    ? 'প্রতিষ্ঠার পর থেকে বিশ্ববিদ্যালয়টি পর্যায়ক্রমে প্রকৌশল, বিজ্ঞান, কৃষি ও ব্যবসায় শিক্ষা অনুষদের মাধ্যমে একাডেমিক কার্যক্রম সম্প্রসারণ করেছে। বর্তমানে ৭টি সক্রিয় বিভাগ এবং ৬টি অনুষদের মাধ্যমে চার বছর মেয়াদী স্নাতক ও স্নাতকোত্তর ডিগ্রি প্রদান করা হচ্ছে।'
                    : 'Since its inception, the institution has progressively expanded into six statutory faculties and seven degree-granting departments, conferring accredited Bachelor of Science and postgraduate degrees under the UGC guidelines.'}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs">
                <img
                  src={campusImages.hero}
                  alt={isBn ? 'জেএসটিইউ একাডেমিক চত্বর' : 'JSTU Academic Complex'}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-72 sm:h-80 object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="p-3 bg-slate-50 border-t border-[#E2E8F0] text-[11px] text-slate-500 text-center">
                  {isBn ? 'ক্যাম্পাস একাডেমিক চত্বর (প্রতীকী চিত্র)' : 'Academic complex and central quadrangle (Neutral illustration)'}
                </div>
              </div>
            </div>
          </div>

          {/* Historical Timeline */}
          {/* [REPLACE WITH REAL CONTENT] Chronological institutional milestones */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#0F172A]">
              {isBn ? 'গুরুত্বপূর্ণ মাইলফলক' : 'Key Historical Milestones'}
            </h3>

            <div className="relative border-l-2 border-[#1E3A8A]/30 ml-4 pl-6 space-y-8">
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#1E3A8A] border-4 border-white shadow-xs" />
                <span className="text-xs font-bold text-[#1E3A8A] font-mono">2012</span>
                <h4 className="text-base font-bold text-[#0F172A] mt-0.5">
                  {isBn ? 'জেএসটিইউ আইন প্রণয়ন ও বিশ্ববিদ্যালয় প্রতিষ্ঠা' : 'Enactment of University Act & Founding'}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  /* [REPLACE WITH REAL CONTENT] */ Gazette notification and statutory sanction for Jamalpur Science &amp; Technology University.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#1E3A8A] border-4 border-white shadow-xs" />
                <span className="text-xs font-bold text-[#1E3A8A] font-mono">2016</span>
                <h4 className="text-base font-bold text-[#0F172A] mt-0.5">
                  {isBn ? 'প্রথম ব্যাচের একাডেমিক কার্যক্রম শুরু' : 'First Undergraduate Batch Academic Induction'}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  /* [REPLACE WITH REAL CONTENT] */ Commenced academic sessions with pioneer departments in Computer Science and Engineering.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#1E3A8A] border-4 border-white shadow-xs" />
                <span className="text-xs font-bold text-[#1E3A8A] font-mono">2020</span>
                <h4 className="text-base font-bold text-[#0F172A] mt-0.5">
                  {isBn ? 'স্থায়ী ক্যাম্পাসে স্থানান্তর ও গবেষণা ল্যাব স্থাপন' : 'Transition to 50-Acre Master Campus'}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  /* [REPLACE WITH REAL CONTENT] */ Expansion of campus pavilions, administrative block, and central science laboratories.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#1E3A8A] border-4 border-white shadow-xs" />
                <span className="text-xs font-bold text-[#1E3A8A] font-mono">2026</span>
                <h4 className="text-base font-bold text-[#0F172A] mt-0.5">
                  {isBn ? 'জেএসটিইউ স্মার্ট ক্যাম্পাস ও পেপারলেস গভর্ন্যান্স চালু' : 'Full Paperless Smart Campus Deployment'}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  /* [REPLACE WITH REAL CONTENT] */ 100% digital clearance, online marks lifecycle, and public QR verification system launched.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Vision & Mission */}
      {/* [REPLACE WITH REAL CONTENT] Statutory Vision, Mission, and Institutional Core Values */}
      {activeTab === 'vision' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="space-y-4 p-8 border-t-4 border-t-[#1E3A8A]">
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#0F172A]">
                {isBn ? 'আমাদের রূপকল্প (Vision)' : 'Our Vision'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isBn
                  ? '/* [REPLACE WITH REAL CONTENT] */ আন্তর্জাতিক মানের বিজ্ঞান ও প্রকৌশল শিক্ষায় উত্তরাঞ্চলে একটি শীর্ষস্থানীয় জ্ঞানভিত্তিক উৎকর্ষ কেন্দ্র হিসেবে গড়ে ওঠা এবং আধুনিক গবেষণার মাধ্যমে জাতীয় ও বৈশ্বিক অগ্রগতিতে অবদান রাখা।'
                  : '/* [REPLACE WITH REAL CONTENT] */ To be a globally recognized center of scientific excellence and technological learning that empowers scholars to solve national challenges through innovation, ethical inquiry, and digital resilience.'}
              </p>
            </Card>

            <Card className="space-y-4 p-8 border-t-4 border-t-[#B45309]">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#B45309] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#0F172A]">
                {isBn ? 'আমাদের অভিলক্ষ্য (Mission)' : 'Our Mission'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isBn
                  ? '/* [REPLACE WITH REAL CONTENT] */ শিক্ষার্থীদের তাত্ত্বিক ও ব্যবহারিক জ্ঞান অর্জনের অনুকূল পরিবেশ প্রদান, বৈজ্ঞানিক গবেষণায় আধুনিক অবকাঠামো নিশ্চিতকরণ এবং নৈতিক মূল্যবোধসম্পন্ন দক্ষ মানবসম্পদ তৈরি।'
                  : '/* [REPLACE WITH REAL CONTENT] */ To deliver high-impact education, foster frontier scientific research, build paperless campus infrastructure, and produce graduates who serve society with competence and integrity.'}
              </p>
            </Card>
          </div>

          {/* Institutional Values */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#0F172A]">
              {isBn ? 'প্রাতিষ্ঠানিক মূলনীতি ও মূল্যবোধ' : 'Core Principles & Values'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card className="space-y-2 p-6">
                <h4 className="font-bold text-[#0F172A]">
                  {isBn ? 'একাডেমিক নিষ্ঠা' : 'Academic Rigor'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Adherence to international accreditation standards, objective grading on a 4.00-scale CGPA system, and continuous curriculum reviews.
                </p>
              </Card>
              <Card className="space-y-2 p-6">
                <h4 className="font-bold text-[#0F172A]">
                  {isBn ? 'স্বচ্ছ প্রশাসন' : 'Digital Governance'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automated paperless clearance, verifiable cryptographic certificates, and zero tolerance for administrative delay.
                </p>
              </Card>
              <Card className="space-y-2 p-6">
                <h4 className="font-bold text-[#0F172A]">
                  {isBn ? 'উদ্ভাবনী গবেষণা' : 'Applied Innovation'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focusing on regional agro-science, renewable energy, and software engineering to address practical developmental challenges.
                </p>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Vice Chancellor's Message */}
      {/* [REPLACE WITH REAL CONTENT] Full official message and formal portrait from the VC */}
      {activeTab === 'vc-message' && (
        <div className="space-y-8">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-[#E2E8F0] pb-8">
              <img
                src={viceChancellor?.avatarUrl || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80'}
                alt={isBn ? `${viceChancellor?.nameBn || 'উপাচার্য'} এর ছবি` : `Portrait of ${viceChancellor?.name || 'Vice Chancellor'}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover border-4 border-white shadow-md shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80';
                }}
              />
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                  {isBn ? 'সর্বোচ্চ নির্বাহী বাণী' : 'Office of the Vice Chancellor'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  {isBn ? viceChancellor?.nameBn : viceChancellor?.name}
                </h2>
                <p className="text-sm font-semibold text-[#1E3A8A]">
                  {isBn ? viceChancellor?.designationBn : viceChancellor?.designation}
                </p>
                <p className="text-xs text-slate-500">
                  {isBn ? viceChancellor?.officeLocationBn : viceChancellor?.officeLocation}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    {viceChancellor?.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    {viceChancellor?.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Official VC Speech Content */}
            <div className="prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
              <p className="font-semibold text-[#0F172A] text-lg">
                {isBn
                  ? 'প্রিয় শিক্ষক, গবেষক, শিক্ষার্থী ও শুভানুধ্যায়ীবৃন্দ,'
                  : 'Distinguished Faculty, Esteemed Researchers, Students, and Guests,'}
              </p>
              <SafeMarkdown content={isBn ? (viceChancellor?.speechBn || viceChancellor?.speech || '') : (viceChancellor?.speech || '')} />
              {!viceChancellor?.speech && (
                <>
                  <p>
                    {isBn
                      ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় একবিংশ শতাব্দীর চতুর্থ শিল্পবিপ্লবের উপযোগী বিজ্ঞানমনস্ক প্রজন্ম গড়ে তোলার সূতিকাগার। আমাদের শিক্ষাক্রম আন্তর্জাতিক মানদণ্ড ও আউটকাম-বেসড এডুকেশন (OBE) কাঠামো মেনে পরিচালিত হচ্ছে।'
                      : 'Jamalpur Science & Technology University stands as a modern beacon for frontier science and ethical engineering in Bangladesh. Our academic curriculum adheres strictly to Outcome-Based Education (OBE) paradigms.'}
                  </p>
                  <p>
                    {isBn
                      ? 'জেএসটিইউ স্মার্ট ক্যাম্পাস সিস্টেম বাস্তবায়নের মাধ্যমে আমরা শতভাগ পেপারলেস একাডেমিক পরিবেশ এবং স্বচ্ছ প্রশাসনিক সেবা নিশ্চিত করেছি।'
                      : 'With the commissioning of the JSTU Smart Campus platform, we have instituted paperless clearances, rapid approvals, and public document validation.'}
                  </p>
                </>
              )}

              <div className="pt-6 border-t border-[#E2E8F0] text-xs text-slate-500">
                <p className="font-bold text-[#0F172A] text-sm">
                  {isBn ? viceChancellor?.nameBn : viceChancellor?.name}
                </p>
                <p>{isBn ? 'উপাচার্য, জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়' : 'Vice Chancellor, Jamalpur Science & Technology University'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Statutory Authorities */}
      {/* [REPLACE WITH REAL CONTENT] VC, Pro-VC, Treasurer, Registrar statutory officer directory */}
      {activeTab === 'authorities' && (
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
              {isBn ? 'প্রশাসনিক নেতৃত্ব' : 'Statutory Executive Officers'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {isBn ? 'বিশ্ববিদ্যালয়ের সম্মানিত কর্তৃপক্ষবৃন্দ' : 'Statutory Authorities of the University'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Under the Jamalpur Science &amp; Technology University Act, statutory leadership directs university administration, fiscal policy, academic councils, and registrarial affairs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {universityAuthoritiesData.map((auth) => (
              <Card key={auth.id} padding="lg" className="space-y-4 hover:border-[#1E3A8A] transition-all">
                <div className="flex items-start gap-4">
                  <img
                    src={auth.avatarUrl}
                    alt={auth.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-2 border-white shadow-sm shrink-0"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E3A8A] bg-[#EFF6FF] px-2 py-0.5 rounded-sm inline-block">
                      {isBn ? auth.roleTitleBn : auth.roleTitle}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#0F172A] truncate">
                      {isBn ? auth.nameBn : auth.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-600">
                      {isBn ? auth.designationBn : auth.designation}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {isBn ? auth.officeLocationBn : auth.officeLocation}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed border-t border-[#E2E8F0] pt-3">
                  {isBn ? auth.profileBioBn : auth.profileBio}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Mail className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    {auth.email}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    {auth.phone}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Organogram */}
      {/* [REPLACE WITH REAL CONTENT] Statutory University Governance Organogram */}
      {activeTab === 'organogram' && (
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
              {isBn ? 'শাসন কাঠামো' : 'Governance Hierarchy'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {isBn ? 'বিশ্ববিদ্যালয়ের সাংগঠনিক রূপরেখা (Organogram)' : 'University Statutory Organogram'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Institutional hierarchy depicting the Chancellor, Vice Chancellor, statutory councils, executive committees, and academic directorates.
            </p>
          </div>

          {/* Organogram Visual Tree */}
          <div className="space-y-6">
            {/* Level 1: Chancellor */}
            <div className="max-w-md mx-auto">
              <Card padding="md" className="text-center bg-[#EFF6FF] border-[#1E3A8A]/30 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E3A8A]">
                  {isBn ? organogramData.chancellor.titleBn : organogramData.chancellor.title}
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">
                  {isBn ? organogramData.chancellor.holderBn : organogramData.chancellor.holder}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBn ? organogramData.chancellor.descriptionBn : organogramData.chancellor.description}
                </p>
              </Card>
            </div>

            <div className="w-0.5 h-6 bg-[#CBD5E1] mx-auto" />

            {/* Level 2: Vice Chancellor */}
            <div className="max-w-md mx-auto">
              <Card padding="md" className="text-center bg-white border-[#1E3A8A] shadow-xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E3A8A]">
                  {isBn ? organogramData.chiefExecutive.titleBn : organogramData.chiefExecutive.title}
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">
                  {isBn ? organogramData.chiefExecutive.holderBn : organogramData.chiefExecutive.holder}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBn ? organogramData.chiefExecutive.descriptionBn : organogramData.chiefExecutive.description}
                </p>
              </Card>
            </div>

            <div className="w-0.5 h-6 bg-[#CBD5E1] mx-auto" />

            {/* Level 3: Statutory Bodies */}
            <div>
              <h3 className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                {isBn ? 'বিধিবদ্ধ পর্ষদ ও কর্তৃপক্ষ' : 'Statutory Councils & Committees'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {organogramData.statutoryBodies.map((body, i) => (
                  <Card key={i} padding="sm" className="space-y-1.5 border-t-2 border-t-[#1E3A8A]">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#1E3A8A]">
                      {isBn ? body.roleBn : body.role}
                    </span>
                    <h4 className="text-sm font-bold text-[#0F172A]">
                      {isBn ? body.titleBn : body.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-snug">
                      {isBn ? body.descBn : body.desc}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Level 4: Academic Wings & Directorates */}
            <div className="pt-4 border-t border-[#E2E8F0]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                {isBn ? 'একাডেমিক অনুষদ ও সংশ্লিষ্ট বিভাগসমূহ' : 'Academic Faculties & Constituent Departments'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {organogramData.academicWings.map((wing, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-2">
                    <h4 className="text-xs font-bold text-[#0F172A]">
                      {wing.faculty}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {wing.depts.map((d, di) => (
                        <span key={di} className="px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-[11px] font-semibold text-slate-700">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Campus & Infrastructure */}
      {/* [REPLACE WITH REAL CONTENT] Master campus description, botanical areas, and research infrastructure */}
      {activeTab === 'campus' && (
        <div className="space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
              {isBn ? 'ক্যাম্পাস রূপরেখা' : 'Physical Environment'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {isBn ? '৫০ একর সবুজ ক্যাম্পাস ও আধুনিক অ্যাকাডেমিক চত্বর' : '50-Acre Master Campus & Research Infrastructure'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Located in the scenic district of Jamalpur, Bangladesh, combining modern architecture with ecological sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card padding="md" className="space-y-3">
              <img
                src={campusImages.hero}
                alt="Academic Complex"
                referrerPolicy="no-referrer"
                className="w-full h-44 object-cover rounded-xl border border-[#E2E8F0]"
              />
              <h3 className="text-base font-bold text-[#0F172A]">
                {isBn ? 'একাডেমিক ও প্রশাসনিক ভবন কমপ্লেক্স' : 'Academic & Administrative Complex'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multistoried modern facility housing departmental seminar libraries, computer clusters, lecture galleries, and administrative suites.
              </p>
            </Card>

            <Card padding="md" className="space-y-3">
              <img
                src={campusImages.library}
                alt="Central Library"
                referrerPolicy="no-referrer"
                className="w-full h-44 object-cover rounded-xl border border-[#E2E8F0]"
              />
              <h3 className="text-base font-bold text-[#0F172A]">
                {isBn ? 'কেন্দ্রীয় ডিজিটাল লাইব্রেরি' : 'Central Digital Library'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Equipped with over 50,000 international e-journal subscriptions, automated RFID checkout, and silent study carrels for researchers.
              </p>
            </Card>

            <Card padding="md" className="space-y-3">
              <img
                src={campusImages.researchLab}
                alt="Science Laboratories"
                referrerPolicy="no-referrer"
                className="w-full h-44 object-cover rounded-xl border border-[#E2E8F0]"
              />
              <h3 className="text-base font-bold text-[#0F172A]">
                {isBn ? 'বিজ্ঞান ও প্রকৌশল গবেষণাগার' : 'Advanced Engineering Labs'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                State-of-the-art laboratory infrastructure supporting AI workstations, microgrid power testbeds, and aquatic biotechnology analysis.
              </p>
            </Card>

            <Card padding="md" className="space-y-3">
              <img
                src={campusImages.aerialCampus}
                alt="Campus Walkways"
                referrerPolicy="no-referrer"
                className="w-full h-44 object-cover rounded-xl border border-[#E2E8F0]"
              />
              <h3 className="text-base font-bold text-[#0F172A]">
                {isBn ? 'সবুজ বোটানিক্যাল প্রাঙ্গণ ও ওয়াকওয়ে' : 'Botanical Corridors & Green Walkways'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pedestrian-only botanical trails connecting student residential zones, recreation lawns, and cafeteria pavilions.
              </p>
            </Card>

            <Card padding="md" className="space-y-3">
              <img
                src={campusImages.adminFlag}
                alt="Central Quadrangle"
                referrerPolicy="no-referrer"
                className="w-full h-44 object-cover rounded-xl border border-[#E2E8F0]"
              />
              <h3 className="text-base font-bold text-[#0F172A]">
                {isBn ? 'কেন্দ্রীয় প্লাজা ও অডিটোরিয়াম' : 'Central Quadrangle & Convocation Stage'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Open-air academic pavilions hosting university convocations, national celebrations, hackathons, and cultural symposiums.
              </p>
            </Card>

            <Card padding="md" className="space-y-3">
              <div className="w-full h-44 rounded-xl bg-slate-100 flex flex-col items-center justify-center p-4 text-center border border-[#E2E8F0]">
                <Building2 className="w-10 h-10 text-[#1E3A8A] mb-2" />
                <h4 className="text-sm font-bold text-[#0F172A]">
                  {isBn ? 'চিকিৎসা কেন্দ্র ও ছাত্রাবাস' : 'Student Halls & Health Center'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  24/7 emergency clinic, on-campus pharmacy, and student residential dormitories.
                </p>
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">
                {isBn ? 'আবাসন ও স্বাস্থ্যসেবা সুবিধা' : 'Residential & Healthcare Services'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Safe residential facilities equipped with fiber broadband, gymnasiums, and clean dining services.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 7: Citizen's Charter (নাগরিক সনদ) */}
      {/* [REPLACE WITH REAL CONTENT] Official Citizen's Charter Service Schedules */}
      {activeTab === 'charter' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                {isBn ? 'জনসেবা মানদণ্ড' : 'Public Service Standards'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                {isBn ? 'নাগরিক সনদ (Citizen’s Charter)' : "Official Citizen's Charter"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Statutory schedule of services, turnaround delivery times, official responsible desks, and transparent fees under RTI.
              </p>
            </div>

            {/* Filter Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder={isBn ? 'সেবা বা দপ্তর খুঁজুন...' : 'Search service or office...'}
                value={charterSearch}
                onChange={(e) => setCharterSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#0F172A] font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">{isBn ? 'সেবার নাম' : 'Service Name'}</th>
                  <th className="py-3 px-4">{isBn ? 'দায়িত্বপ্রাপ্ত দপ্তর' : 'Responsible Office'}</th>
                  <th className="py-3 px-4">{isBn ? 'প্রদানের সময়সীমা' : 'Delivery Time'}</th>
                  <th className="py-3 px-4">{isBn ? 'নির্ধারিত ফি' : 'Prescribed Fee'}</th>
                  <th className="py-3 px-4">{isBn ? 'আবেদনের প্রক্রিয়া' : 'Procedure & Steps'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredCharter.map((s) => (
                  <tr key={s.slNo} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-500">
                      {s.slNo}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0F172A]">
                      {isBn ? s.serviceNameBn : s.serviceName}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {isBn ? s.responsibleOfficeBn : s.responsibleOffice}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                        {isBn ? s.deliveryTimeBn : s.deliveryTime}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#0F172A]">
                      {isBn ? s.feeAmountBn : s.feeAmount}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-500 max-w-xs">
                      {isBn ? s.procedureBn : s.procedure}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>
              {isBn
                ? 'নাগরিক সেবা সংক্রান্ত কোনো অভিযোগের জন্য যোগাযোগ করুন: grievances@jstu.ac.bd'
                : 'For public service appeals or RTI compliance queries, reach our Grievance Redressal Officer: grievances@jstu.ac.bd'}
            </span>
            <Link to="/contact">
              <Button size="sm" variant="outline">
                {isBn ? 'অভিযোগ সেল' : 'Grievance Desk'}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Tab 8: Contact Directory */}
      {/* [REPLACE WITH REAL CONTENT] Statutory contact directory for academic and administrative units */}
      {activeTab === 'contact' && (
        <div className="space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
              {isBn ? 'যোগাযোগ ও অবস্থান' : 'Communication & Locations'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {isBn ? 'জেএসটিইউ প্রাতিষ্ঠানিক যোগাযোগ নির্দেশিকা' : 'Official JSTU Contact Directory'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Direct telephone lines, email addresses, and room locations of university statutory directorates and emergency services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Main Reception */}
            <Card padding="md" className="space-y-3 border-t-2 border-t-[#1E3A8A]">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#1E3A8A]" />
                <h3 className="font-bold text-[#0F172A]">
                  {isBn ? 'কেন্দ্রীয় তথ্য ও হেল্পডেস্ক' : 'Central Helpdesk & Reception'}
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Administrative Building Ground Floor, Jamalpur Sadar, Jamalpur-2012.
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-[#E2E8F0]">
                <p>Phone: <strong className="text-[#0F172A]">+880 29977 12345</strong></p>
                <p>Email: <a href="mailto:info@jstu.ac.bd" className="text-[#1E3A8A] hover:underline">info@jstu.ac.bd</a></p>
              </div>
            </Card>

            {/* Registrar Office */}
            <Card padding="md" className="space-y-3 border-t-2 border-t-[#1E3A8A]">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#1E3A8A]" />
                <h3 className="font-bold text-[#0F172A]">
                  {isBn ? 'রেজিস্ট্রার দপ্তর' : 'Office of the Registrar'}
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Level 2, Administrative Building, JSTU Campus.
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-[#E2E8F0]">
                <p>Phone: <strong className="text-[#0F172A]">+880 29977 12343</strong></p>
                <p>Email: <a href="mailto:registrar@jstu.ac.bd" className="text-[#1E3A8A] hover:underline">registrar@jstu.ac.bd</a></p>
              </div>
            </Card>

            {/* Controller of Examinations */}
            <Card padding="md" className="space-y-3 border-t-2 border-t-[#1E3A8A]">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#1E3A8A]" />
                <h3 className="font-bold text-[#0F172A]">
                  {isBn ? 'পরীক্ষা নিয়ন্ত্রক দপ্তর' : 'Controller of Examinations'}
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Level 3, Administrative Building, JSTU Campus.
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-[#E2E8F0]">
                <p>Phone: <strong className="text-[#0F172A]">+880 29977 12344</strong></p>
                <p>Email: <a href="mailto:controller@jstu.ac.bd" className="text-[#1E3A8A] hover:underline">controller@jstu.ac.bd</a></p>
              </div>
            </Card>

            {/* Emergency Medical */}
            <Card padding="md" className="space-y-3 border-t-2 border-t-rose-600 bg-rose-50/30">
              <div className="flex items-center gap-2 text-rose-700">
                <Phone className="w-4 h-4" />
                <h3 className="font-bold">
                  {isBn ? 'জরুরি মেডিকেল ও অ্যাম্বুলেন্স' : '24/7 Medical & Ambulance'}
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                JSTU Medical Center, Residential Zone West.
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-rose-100">
                <p>Hotline: <strong className="text-rose-700">+880 29977 12399</strong></p>
                <p>Ambulance: <strong className="text-rose-700">+880 1700 000000</strong></p>
              </div>
            </Card>

            {/* Proctorial Office / Campus Security */}
            <Card padding="md" className="space-y-3 border-t-2 border-t-[#1E3A8A]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#1E3A8A]" />
                <h3 className="font-bold text-[#0F172A]">
                  {isBn ? 'প্রক্টর দপ্তর ও নিরাপত্তা সেল' : 'Proctorial & Campus Security'}
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Main Gate Security Pavillion &amp; Level 1 Admin Block.
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-[#E2E8F0]">
                <p>Proctor Hotline: <strong className="text-[#0F172A]">+880 29977 12388</strong></p>
                <p>Email: <a href="mailto:proctor@jstu.ac.bd" className="text-[#1E3A8A] hover:underline">proctor@jstu.ac.bd</a></p>
              </div>
            </Card>

            {/* ICT Cell */}
            <Card padding="md" className="space-y-3 border-t-2 border-t-[#1E3A8A]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
                <h3 className="font-bold text-[#0F172A]">
                  {isBn ? 'আইসিটি সেল ও স্মার্ট ক্যাম্পাস সাপোর্ট' : 'ICT Cell & Portal Support'}
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Computer Center, Level 2, Academic Complex.
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-[#E2E8F0]">
                <p>Support Desk: <strong className="text-[#0F172A]">+880 29977 12366</strong></p>
                <p>Email: <a href="mailto:ictcell@jstu.ac.bd" className="text-[#1E3A8A] hover:underline">ictcell@jstu.ac.bd</a></p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
