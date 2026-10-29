import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ArrowUpRight,
  Globe,
  ExternalLink,
  BookOpen,
  Calendar,
  Building2,
  FileText,
  Search,
  Lock,
  HeartHandshake,
  HelpCircle
} from 'lucide-react';
import { UniversityLogo } from './UniversityLogo';
import { useLanguage } from '../../contexts/LanguageContext';
import { departmentsData, officesData } from '../../data/seedData';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <footer className="bg-[#F8FAFC] text-slate-600 border-t border-[#E2E8F0]" role="contentinfo">
      {/* 1. Upper Brand & Quick Access Strip */}
      <div className="border-b border-[#E2E8F0] bg-white py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <UniversityLogo size={48} className="shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight leading-tight">
                {isBn ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়' : 'Jamalpur Science & Technology University'}
              </h2>
              <p className="text-xs text-[#B45309] font-mono font-semibold mt-0.5">
                Jamalpur-2012, Dhaka Division, Bangladesh &bull; Established by Government Act
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <Link
              to="/verify"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? 'ডিজিটাল সনদ যাচাই' : 'Public QR Verification'}</span>
            </Link>

            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium border border-slate-200"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>{isBn ? 'সার্চ ইঞ্জিন' : 'Search Site'}</span>
            </Link>

            <Link
              to="/helpdesk"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#1E3A8A] hover:bg-blue-100 transition-colors font-semibold border border-blue-200"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{isBn ? 'হেল্পডেস্ক ও অভিযোগ' : 'Helpdesk & Support'}</span>
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1E3A8A] text-white hover:bg-blue-900 transition-colors font-semibold shadow-2xs"
            >
              <span>{isBn ? 'পোর্টাল সাইন ইন' : 'Single Sign-On (SSO)'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Advanced Multi-Column Hierarchical Sitemap */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Column 1: Academics */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-slate-200 pb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{isBn ? 'শিক্ষা ও অনুষদ' : 'Academics'}</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/academics" className="hover:text-[#1E3A8A] transition-colors font-semibold text-[#0F172A]">
                  {isBn ? 'সকল অনুষদ ওভারভিউ' : 'All 6 Faculties'}
                </Link>
              </li>
              {departmentsData.map((d) => (
                <li key={d.id}>
                  <Link
                    to={`/academics/department/${d.id}`}
                    className="hover:text-[#1E3A8A] transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate">{isBn ? d.nameBn : d.name}</span>
                    <span className="font-mono text-[10px] text-slate-400 group-hover:text-[#1E3A8A] shrink-0 ml-1">
                      {d.code}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="pt-1 border-t border-slate-100">
                <Link to="/academics/calendar" className="hover:text-[#1E3A8A] transition-colors flex items-center gap-1">
                  <span>{isBn ? 'একাডেমিক ক্যালেন্ডার' : 'Academic Calendar'}</span>
                </Link>
              </li>
              <li>
                <Link to="/academics/routine" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'ক্লাস রুটিন' : 'Class Routine'}
                </Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'গবেষণা ও প্রকাশনা' : 'Research Clusters'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Admissions & Campus Life */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-slate-200 pb-2 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{isBn ? 'ভর্তি ও ক্যাম্পাস' : 'Admissions & Life'}</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/admission" className="hover:text-[#1E3A8A] transition-colors font-semibold text-[#0F172A]">
                  {isBn ? 'স্নাতক ভর্তি ২০২৬' : 'Undergraduate 2026'}
                </Link>
              </li>
              <li>
                <Link to="/scholarships" className="hover:text-[#1E3A8A] transition-colors font-medium text-[#1E3A8A]">
                  {isBn ? 'বৃত্তি ও আর্থিক সহায়তা' : 'Scholarships & Aid'}
                </Link>
              </li>
              <li>
                <Link to="/student-life" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'শিক্ষার্থী জীবন হাব' : 'Student Life Hub'}
                </Link>
              </li>
              <li>
                <Link to="/student-life/halls" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'আবাসিক হলসমূহ' : 'Residential Halls'}
                </Link>
              </li>
              <li>
                <Link to="/student-life/clubs" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'ক্লাব ও সাংস্কৃতিক সমিতি' : 'Clubs & Societies'}
                </Link>
              </li>
              <li>
                <Link to="/student-life/sports" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'শারীরিক শিক্ষা ও ক্রীড়া' : 'Sports & Gymnasium'}
                </Link>
              </li>
              <li>
                <Link to="/student-life/medical" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'ক্যাম্পাস মেডিকেল সেন্টার' : 'Medical Center'}
                </Link>
              </li>
              <li>
                <Link to="/student-life/transport" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'পরিবহন ও বাস শিডিউল' : 'Campus Shuttle Routes'}
                </Link>
              </li>
              <li>
                <Link to="/student-life/alumni" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'জেএসটিইউ অ্যালামনাই' : 'Alumni Network'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Notices & Information */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-slate-200 pb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{isBn ? 'বিজ্ঞপ্তি ও সংবাদ' : 'Public Records'}</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/notices" className="hover:text-[#1E3A8A] transition-colors font-semibold text-[#0F172A]">
                  {isBn ? 'সকল প্রাতিষ্ঠানিক বিজ্ঞপ্তি' : 'Notices & Circulars'}
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'ক্যাম্পাস সংবাদ ও প্রেস' : 'News & Press Releases'}
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'অনুষ্ঠান ও সেমিনার' : 'Events Calendar'}
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'ক্যাম্পাস ফটো গ্যালারি' : 'Photo Gallery'}
                </Link>
              </li>
              <li>
                <Link to="/downloads" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'ফরম ও অর্ডিন্যান্স ডাউনলোড' : 'Forms & Downloads'}
                </Link>
              </li>
              <li>
                <Link to="/library" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'সেন্ট্রাল লাইব্রেরি ক্যাটালগ' : 'Central Library'}
                </Link>
              </li>
              <li>
                <Link to="/career" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'নিয়োগ ও ক্যারিয়ার' : 'Careers & Tenders'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Administration & Statutory */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-slate-200 pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{isBn ? 'প্রশাসন ও গভর্ন্যান্স' : 'Governance'}</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/about?tab=vc-message" className="hover:text-[#1E3A8A] transition-colors font-semibold text-[#0F172A]">
                  {isBn ? 'উপাচার্যের কার্যালয় ও বাণী' : 'Office of Vice Chancellor'}
                </Link>
              </li>
              <li>
                <Link to="/administration" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'প্রশাসনিক দপ্তরসমূহ' : 'Administrative Offices'}
                </Link>
              </li>
              <li>
                <Link to="/about?tab=authorities" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'সংবিধিবদ্ধ কর্তৃপক্ষ' : 'Statutory Authorities'}
                </Link>
              </li>
              <li>
                <Link to="/about?tab=charter" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'সিটিজেন চার্টার' : "Citizen's Charter"}
                </Link>
              </li>
              <li>
                <Link to="/about?tab=organogram" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'সাংগঠনিক কাঠামো' : 'University Organogram'}
                </Link>
              </li>
              <li>
                <Link to="/page/code-of-conduct" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'আচরণবিধি ও সততা নীতি' : 'Code of Conduct'}
                </Link>
              </li>
              <li>
                <Link to="/page/vision-and-mission" className="hover:text-[#1E3A8A] transition-colors">
                  {isBn ? 'ভিশন ২০৩০ মহাপরিকল্পনা' : 'Vision 2030 Roadmap'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Campus Map & Contact */}
          <div className="space-y-3.5 col-span-2 sm:col-span-1 lg:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-slate-200 pb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{isBn ? 'ঠিকানা ও অবস্থান' : 'Campus Location'}</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-[#0F172A]">
                {isBn ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়' : 'Main Campus Complex'}
              </p>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {isBn ? 'পুরাতন ব্রহ্মপুত্র অববাহিকা, জামালপুর সদর, জামালপুর-২০১২, বাংলাদেশ' : 'Old Brahmaputra Basin, Jamalpur Sadar, Jamalpur-2012, Bangladesh'}
              </p>

              <div className="pt-1 space-y-1 text-[11px]">
                <p>Phone: <a href="tel:+8802997712345" className="hover:text-[#1E3A8A] font-mono">+880 29977 12345</a></p>
                <p>Emergency: <a href="tel:+8802997712399" className="text-rose-600 font-mono font-semibold">+880 29977 12399</a></p>
                <p>Email: <a href="mailto:info@jstu.ac.bd" className="hover:text-[#1E3A8A]">info@jstu.ac.bd</a></p>
              </div>

              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Jamalpur+Science+and+Technology+University"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#1E3A8A] text-[#1E3A8A] font-semibold text-[11px] shadow-2xs hover:bg-blue-50 transition"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isBn ? 'গুগল ম্যাপে দেখুন' : 'Google Maps Location'}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. National Portals Strip */}
      <div className="border-t border-[#E2E8F0] bg-white py-4 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="font-semibold text-slate-700">{isBn ? 'জাতীয় সংযোগ:' : 'National Links:'}</span>
            <a href="https://bangladesh.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E3A8A]">
              National Web Portal
            </a>
            <span>&bull;</span>
            <a href="https://ugc.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E3A8A]">
              University Grants Commission (UGC)
            </a>
            <span>&bull;</span>
            <a href="https://moedu.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E3A8A]">
              Ministry of Education
            </a>
            <span>&bull;</span>
            <a href="https://dpe.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E3A8A]">
              ICT Division Bangladesh
            </a>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <Link to="/privacy" className="hover:text-[#1E3A8A] underline">
              {isBn ? 'গোপনীয়তা ও কুকি নীতি' : 'Privacy & Cookie Notice'}
            </Link>
            <span>&bull;</span>
            <Link to="/contact" className="hover:text-[#1E3A8A] underline">
              {isBn ? 'যোগাযোগ' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Bottom Legal & Compliance Strip */}
      <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] py-4 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Jamalpur Science & Technology University (JSTU). All Rights Reserved.
          </p>

          <div className="flex items-center gap-3">
            <span>UGC &amp; Statutory Charter Compliant</span>
            <span>&bull;</span>
            <span className="font-mono">WCAG 2.1 AA Accessible</span>
            <span>&bull;</span>
            <span className="font-mono text-emerald-700 font-semibold">100% Paperless</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
