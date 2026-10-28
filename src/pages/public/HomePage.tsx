import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Bell,
  Calendar,
  UserCheck,
  BookOpen,
  Quote,
  Newspaper,
  FlaskConical,
  Camera,
  ArrowRight,
  Sparkles,
  Laptop,
  ShieldCheck,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { SectionHeader } from '../../components/common/SectionHeader';
import { StatCard } from '../../components/common/StatCard';
import { NoticeItem } from '../../components/common/NoticeItem';
import { DepartmentCard } from '../../components/common/DepartmentCard';
import { Accordion, AccordionItem } from '../../components/common/Accordion';
import { Modal } from '../../components/common/Modal';
import { BannerSlider } from '../../components/home/BannerSlider';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  noticesSeedData,
  eventsData,
  departmentsData,
  universityStats,
  faqItemsData,
  universityNewsData,
  photoGalleryData,
  universityAuthoritiesData,
  researchClustersData
} from '../../data/seedData';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [activePortalModal, setActivePortalModal] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof photoGalleryData)[0] | null>(null);

  const store = SharedDataStoreManager.getInstance().getStore();
  const allNotices = store.managedNotices && store.managedNotices.length > 0 ? store.managedNotices : noticesSeedData;

  // Filter public published notices from CMS store
  const latestNotices = allNotices
    .filter((n) => n.status === 'published')
    .slice(0, 4);

  // Managed news
  const allNews = store.managedNews && store.managedNews.length > 0 ? store.managedNews : universityNewsData;
  const latestNews = allNews
    .filter((n: any) => n.status === 'published' || !n.status)
    .slice(0, 3);

  // Managed events
  const allEvents = store.managedEvents && store.managedEvents.length > 0 ? store.managedEvents : eventsData;
  const latestEvents = allEvents
    .filter((e: any) => e.status === 'published' || !e.status)
    .slice(0, 3);

  // Managed departments
  const allDepartments = store.managedDepartments && store.managedDepartments.length > 0 ? store.managedDepartments : departmentsData;

  // Managed gallery
  const allGallery = store.managedGallery && store.managedGallery.length > 0 ? store.managedGallery : photoGalleryData;
  const publishedGallery = allGallery
    .filter((g: any) => g.status === 'published' || !g.status)
    .slice(0, 6);

  // Find statutory VC (reading from CMS store if updated)
  const managedVc = store.managedVcMessage;
  const seedVc = universityAuthoritiesData.find((a) => a.roleKey === 'vc');
  const viceChancellor =
    managedVc && managedVc.status === 'published'
      ? {
          ...(seedVc || {}),
          name: managedVc.vcName,
          nameBn: managedVc.vcNameBn,
          designation: managedVc.designation,
          designationBn: managedVc.designationBn,
          avatarUrl: managedVc.avatarUrl,
          speech: managedVc.speech,
          speechBn: managedVc.speechBn
        }
      : seedVc;

  return (
    <div className="space-y-16 lg:space-y-20 pb-20 bg-white">
      <SEOHead
        title={isBn ? 'মূলপাতা' : 'Home'}
        description={t('home.heroSubtitle')}
      />

      {/* 1. Hero Banner Slider with Clean Frame & Neutral Imagery */}
      <BannerSlider onOpenPortalModal={(type) => setActivePortalModal(type)} />

      {/* 2. Quick-Link Cards: Admission, Notices, Academic Calendar, Student Portal, Library */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Quick-Link 1: Admission */}
          <Link
            to="/admission"
            className="group p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#1E3A8A] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center mb-3 group-hover:bg-[#1E3A8A] group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                {isBn ? 'ভর্তি তথ্য' : 'Admissions'}
              </span>
              <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors">
                {isBn ? 'ভর্তি কার্যক্রম ২০২৬' : 'Undergraduate 2026'}
              </h3>
            </div>
          </Link>

          {/* Quick-Link 2: Notices */}
          <Link
            to="/notices"
            className="group p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#1E3A8A] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                {isBn ? 'বিজ্ঞপ্তি বোর্ড' : 'Circulars'}
              </span>
              <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors">
                {isBn ? 'অফিসিয়াল নোটিশ' : 'Notice Board'}
              </h3>
            </div>
          </Link>

          {/* Quick-Link 3: Academic Calendar */}
          <Link
            to="/events"
            className="group p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#1E3A8A] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                {isBn ? 'ক্যালেন্ডার' : 'Schedules'}
              </span>
              <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors">
                {isBn ? 'একাডেমিক ক্যালেন্ডার' : 'Academic Calendar'}
              </h3>
            </div>
          </Link>

          {/* Quick-Link 4: Student Portal */}
          <Link
            to="/login"
            className="group p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#1E3A8A] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-3 group-hover:bg-purple-700 group-hover:text-white transition-colors">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                {isBn ? 'একক লগইন' : 'Identity SSO'}
              </span>
              <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors">
                {isBn ? 'শিক্ষার্থী পোর্টাল' : 'Student Portal'}
              </h3>
            </div>
          </Link>

          {/* Quick-Link 5: Central Library */}
          <Link
            to="/about?tab=campus"
            className="group p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#1E3A8A] hover:shadow-md transition-all flex flex-col justify-between col-span-2 sm:col-span-1"
          >
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-3 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                {isBn ? 'ই-রিসোর্স' : 'E-Catalog'}
              </span>
              <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors">
                {isBn ? 'কেন্দ্রীয় লাইব্রেরি' : 'Central Library'}
              </h3>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Vice Chancellor Message Card */}
      {/* [REPLACE WITH REAL CONTENT] Placeholder institutional message and executive portrait */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* VC Portrait with neutral attire and framing */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={viceChancellor?.avatarUrl || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80'}
                  alt="Vice Chancellor portrait"
                  referrerPolicy="no-referrer"
                  className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl object-cover border-4 border-white shadow-md"
                />
                <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center shadow-md">
                  <Quote className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
                  {isBn ? viceChancellor?.nameBn : viceChancellor?.name}
                </h3>
                <p className="text-xs text-[#1E3A8A] font-semibold">
                  {isBn ? viceChancellor?.roleTitleBn : viceChancellor?.roleTitle}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Jamalpur Science &amp; Technology University
                </p>
              </div>
            </div>

            {/* Message Excerpt & Call to Action */}
            <div className="lg:col-span-8 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                  {isBn ? 'উপাচার্যের বাণী' : 'Leadership Perspective'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  {isBn ? 'জ্ঞান, বিজ্ঞান ও প্রযুক্তিগত উদ্ভাবনের প্রতিশ্রুতি' : 'A Commitment to Science, Rigor & Societal Impact'}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed italic border-l-4 border-[#1E3A8A] pl-4 py-1">
                &ldquo;{isBn ? viceChancellor?.speechBn : viceChancellor?.speech}&rdquo;
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/about?tab=vc-message">
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    {isBn ? 'সম্পূর্ণ বাণী পড়ুন' : 'Read Full Vice Chancellor Message'}
                  </Button>
                </Link>
                <Link to="/about?tab=authorities">
                  <Button variant="outline" size="sm">
                    {isBn ? 'বিশ্ববিদ্যালয় কর্তৃপক্ষবৃন্দ' : 'Statutory Authorities'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. University At A Glance Stats (Explicitly marked as Demo data) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <SectionHeader
          kicker={isBn ? 'এক নজরে জেএসটিইউ' : 'Institutional Growth'}
          title={t('home.statsTitle')}
          subtitle={t('home.statsDisclaimer')}
          align="center"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {universityStats.map((st) => (
            <StatCard
              key={st.id}
              label={isBn ? st.labelBn : st.label}
              value={isBn ? st.valueBn : st.value}
              description={isBn ? st.descriptionBn : st.description}
              isDemo={true}
            />
          ))}
        </div>
      </section>

      {/* 5. Main Information Section: Latest Circulars, Campus News & Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Latest Official Notices (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A] block">
                  {isBn ? 'প্রশাসনিক ও একাডেমিক বিজ্ঞপ্তি' : 'Official Circulars'}
                </span>
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {t('home.latestNoticesTitle')}
                </h2>
              </div>
              <Link
                to="/notices"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A8A] hover:underline"
              >
                <span>{t('actions.viewAll')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[#E2E8F0] bg-white border border-[#E2E8F0] rounded-2xl shadow-xs">
              {latestNotices.map((notice) => (
                <NoticeItem key={notice.id} notice={notice} />
              ))}
            </div>
          </div>

          {/* Middle: University News & Press Releases (4 Cols) */}
          {/* [REPLACE WITH REAL CONTENT] Official university press releases */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A] block">
                  {isBn ? 'সংবাদ ও গণমাধ্যম' : 'Press Releases'}
                </span>
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {isBn ? 'ক্যাম্পাস সংবাদ' : 'University News'}
                </h2>
              </div>
              <Link
                to="/news"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A8A] hover:underline"
              >
                <span>{t('actions.viewAll')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {latestNews.map((news: any) => (
                <Card key={news.id} padding="sm" className="space-y-2 group hover:border-[#1E3A8A] transition-all">
                  <div className="flex gap-3 items-start">
                    <img
                      src={news.imageUrl}
                      alt={isBn ? news.titleBn : news.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-20 h-16 rounded-lg object-cover shrink-0 border border-[#E2E8F0]"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <span className="font-semibold text-[#1E3A8A]">
                          {isBn ? news.categoryBn : news.category}
                        </span>
                        <span>·</span>
                        <span>{isBn ? news.dateBn : news.date}</span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] line-clamp-2 group-hover:text-[#1E3A8A] transition-colors">
                        {isBn ? news.titleBn : news.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {isBn ? news.summaryBn : news.summary}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Right: Upcoming Academic Milestones & Events (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A] block">
                  {isBn ? 'ক্যালেন্ডার' : 'Milestones'}
                </span>
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {t('home.upcomingEventsTitle')}
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {latestEvents.map((evt: any) => (
                <Card key={evt.id} padding="sm" className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    <span className="font-semibold text-[#0F172A]">
                      {evt.date}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{evt.category}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] leading-snug">
                    {isBn ? evt.titleBn : evt.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {isBn ? evt.descriptionBn : evt.description}
                  </p>
                </Card>
              ))}

              <Link
                to="/events"
                className="block text-center py-2 px-3 text-xs font-semibold text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-xl transition-colors"
              >
                {isBn ? 'সকল ইভেন্ট দেখুন' : 'Explore All Events'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Academic Structure: 6 Faculties & 7 Accredited Departments Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <SectionHeader
          kicker={isBn ? 'একাডেমিক কাঠামো' : 'Disciplines & Degrees'}
          title={t('home.academicStructureTitle')}
          subtitle={t('home.academicStructureSubtitle')}
          action={
            <Link to="/academics">
              <Button variant="outline" size="sm">
                {isBn ? 'সকল অনুষদ দেখুন' : 'Explore All Faculties'}
              </Button>
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allDepartments.map((dept: any) => (
            <DepartmentCard key={dept.id} department={dept} />
          ))}
        </div>
      </section>

      {/* 7. Research Highlights Section */}
      {/* [REPLACE WITH REAL CONTENT] Institutional research grants & peer-reviewed research clusters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <SectionHeader
          kicker={isBn ? 'গবেষণা ও উদ্ভাবন' : 'Scientific Inquiry'}
          title={isBn ? 'গবেষণা হাইলাইটস ও আন্তঃবিভাগীয় প্রকল্প' : 'Featured Research Clusters & Scientific Inquiry'}
          subtitle={
            isBn
              ? 'কৃত্রিম বুদ্ধিমত্তা, নবায়নযোগ্য শক্তি ও নদী অববাহিকা বাস্তুতন্ত্রের উপর জাতীয় গবেষণা প্রকল্প।'
              : 'Pioneering multidisciplinary research advancing local regional sustainability and technological frontiers.'
          }
          action={
            <Link to="/research">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                {isBn ? 'গবেষণা পোর্টাল' : 'Research Portal'}
              </Button>
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {researchClustersData.map((cluster) => (
            <Card key={cluster.id} padding="lg" className="space-y-4 hover:border-[#1E3A8A] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {cluster.leadDepartment}
                  </span>
                  <h3 className="text-base font-bold text-[#0F172A] mt-0.5">
                    {isBn ? cluster.titleBn : cluster.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isBn ? cluster.descriptionBn : cluster.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-[#1E3A8A]">
                  {cluster.ongoingProjects} {isBn ? 'চলমান প্রকল্প' : 'Ongoing Projects'}
                </span>
                <span className="font-mono text-slate-500">
                  {cluster.publicationsCount} {isBn ? 'প্রকাশনা' : 'Publications'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 8. Photo Gallery Strip */}
      {/* [REPLACE WITH REAL CONTENT] Verified university campus photography showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <SectionHeader
          kicker={isBn ? 'ক্যাম্পাস স্থিরচিত্র' : 'Visual Showcase'}
          title={isBn ? 'ক্যাম্পাস ফটো গ্যালারি' : 'Campus Photo Gallery'}
          subtitle={
            isBn
              ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের ৫০ একর প্রাকৃতিক চত্বর ও আধুনিক অ্যাকাডেমিক অবকাঠামো।'
              : 'A glimpse of student life, architectural facilities, and botanical spaces across our 50-acre green campus.'
          }
          align="center"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {publishedGallery.map((photo: any) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative rounded-xl overflow-hidden border border-[#E2E8F0] aspect-4/3 cursor-pointer hover:shadow-md transition-all"
            >
              <img
                src={photo.imageUrl}
                alt={isBn ? photo.titleBn : photo.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                <span className="text-[10px] font-semibold text-sky-300 uppercase tracking-wider truncate">
                  {isBn ? photo.categoryBn : photo.category}
                </span>
                <p className="text-xs font-bold text-white truncate">
                  {isBn ? photo.titleBn : photo.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-6">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:border-[#1E3A8A] text-xs font-bold text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-50 transition"
          >
            <Camera className="w-4 h-4" />
            <span>{isBn ? 'সম্পূর্ণ ফটো অ্যালবাম ও গ্যালারি দেখুন' : 'Explore Full Photo Gallery & Albums'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 9. Digital Services Section (Paperless University Pillars) */}
      <section className="bg-[#F8FAFC] py-16 border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <SectionHeader
            kicker={isBn ? 'স্মার্ট ও পেপারলেস সেবা' : 'Core Architecture'}
            title={t('home.digitalServicesTitle')}
            subtitle={t('home.digitalServicesSubtitle')}
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">
                {t('digitalServices.s1Title')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('digitalServices.s1Desc')}
              </p>
            </Card>

            <Card className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">
                {t('digitalServices.s2Title')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('digitalServices.s2Desc')}
              </p>
            </Card>

            <Card className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">
                {t('digitalServices.s3Title')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('digitalServices.s3Desc')}
              </p>
              <Link
                to="/verify"
                className="text-xs font-semibold text-[#1E3A8A] inline-flex items-center gap-1 pt-1"
              >
                <span>{isBn ? 'যাচাই পৃষ্ঠা খুলুন' : 'Open Verification'}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </Card>

            <Card className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">
                {t('digitalServices.s4Title')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('digitalServices.s4Desc')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 10. FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8">
        <SectionHeader
          kicker="FAQ"
          title={t('home.faqTitle')}
          subtitle={
            isBn
              ? 'জেএসটিইউ স্মার্ট ক্যাম্পাস সিস্টেম সম্পর্কিত সাধারণ তথ্যাবলী।'
              : 'Everything you need to know about JSTU paperless digital administration.'
          }
          align="center"
        />

        <Card padding="lg">
          <Accordion>
            {faqItemsData.map((faq, index) => (
              <AccordionItem
                key={index}
                id={`faq-${index}`}
                title={isBn ? faq.questionBn : faq.question}
                defaultOpen={index === 0}
              >
                <p>{isBn ? faq.answerBn : faq.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </section>

      {/* 11. CTA Section: Clean White Card with Subtle Light Neutral Border */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-8 sm:p-12 shadow-xs">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
              {isBn ? 'জেএসটিইউ স্মার্ট ক্যাম্পাস' : 'Paperless University Governance'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('home.ctaSubtitle')}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/verify">
                <Button variant="primary">
                  {t('actions.verifyNow')}
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  {t('nav.contact')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modal: Photo Lightbox Preview */}
      <Modal
        isOpen={selectedPhoto !== null}
        onClose={() => setSelectedPhoto(null)}
        title={selectedPhoto ? (isBn ? selectedPhoto.titleBn : selectedPhoto.title) : ''}
        description={selectedPhoto ? (isBn ? selectedPhoto.categoryBn : selectedPhoto.category) : ''}
      >
        {selectedPhoto && (
          <div className="space-y-4">
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.title}
              referrerPolicy="no-referrer"
              className="w-full h-64 sm:h-80 object-cover rounded-xl border border-[#E2E8F0]"
            />
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isBn ? selectedPhoto.captionBn : selectedPhoto.caption}
            </p>
            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => setSelectedPhoto(null)}>
                {isBn ? 'বন্ধ করুন' : 'Close Preview'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Informational Portal Notice */}
      <Modal
        isOpen={activePortalModal !== null}
        onClose={() => setActivePortalModal(null)}
        title={
          activePortalModal === 'student'
            ? (isBn ? 'শিক্ষার্থী পোর্টাল' : 'Student Portal')
            : (isBn ? 'শিক্ষক ও প্রশাসনিক পোর্টাল' : 'Teacher & Staff Portal')
        }
        description={
          isBn
            ? 'সেন্ট্রাল আইডেন্টিটি প্রোভাইডারের মাধ্যমে লগইন করুন।'
            : 'Access via Central Identity Single Sign-On.'
        }
      >
        <div className="space-y-4 text-xs text-slate-600">
          <p>
            {isBn
              ? 'জেএসটিইউ স্মার্ট ক্যাম্পাসে পাবলিক সাইনআপ বন্ধ রাখা হয়েছে। সকল শিক্ষার্থী ও শিক্ষকের পরিচয়পত্র ও টু-ফ্যাক্টর নিরাপত্তা (MFA) রেজিস্ট্রি অফিস কর্তৃক জারি করা হয়।'
              : 'Public self-signup is disabled at JSTU. Accounts are provisioned with verified Firebase Custom Claims and staff MFA.'}
          </p>
          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={() => setActivePortalModal(null)}>
              {isBn ? 'বুঝেছি' : 'Understood'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
