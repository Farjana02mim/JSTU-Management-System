import React, { useState } from 'react';
import {
  FileCheck2,
  ShieldCheck,
  Search,
  Building,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Input } from '../../components/common/Input';
import { useLanguage } from '../../contexts/LanguageContext';
import { officesData } from '../../data/seedData';

export const AdministrationPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [searchTerm, setSearchTerm] = useState('');

  const filteredOffices = officesData.filter((office) => {
    const term = searchTerm.toLowerCase();
    return (
      office.name.toLowerCase().includes(term) ||
      office.nameBn.toLowerCase().includes(term) ||
      office.officerInCharge.toLowerCase().includes(term) ||
      office.designation.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12 bg-white">
      <SEOHead
        title={isBn ? 'প্রশাসন ও দপ্তরসমূহ' : 'Administration & Offices'}
        description="Administrative structure, statutory bodies, and official offices of Jamalpur Science & Technology University."
      />

      <Breadcrumb items={[{ label: isBn ? 'প্রশাসন' : 'Administration' }]} />

      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
          {isBn ? 'প্রশাসনিক নেতৃত্ব ও দপ্তর' : 'University Governance'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          {isBn ? 'প্রশাসন ও বিশ্ববিদ্যালয় দপ্তরসমূহ' : 'Administration & University Offices'}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {isBn
            ? 'জেএসটিইউ স্মার্ট ক্যাম্পাস ব্যবস্থার মাধ্যমে পরিচালিত ৮টি প্রশাসনিক ও একাডেমিক সহায়তা দপ্তরের তালিকা ও দায়িত্বসমূহ।'
            : 'Statutory offices and administrative secretariats responsible for executing smart academic, financial, and digital governance at JSTU.'}
        </p>
      </div>

      {/* Key Administrative Leadership Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-l-4 border-l-[#1E3A8A] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
              {isBn ? 'কেন্দ্রীয় রেজিস্ট্রার' : 'Office of the Registrar'}
            </span>
            <FileCheck2 className="w-5 h-5 text-[#1E3A8A]" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">Md. Abdul Mannan</h2>
          <p className="text-xs text-slate-500 font-semibold">Registrar (Acting) &bull; JSTU</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Responsible for central admissions, syndicate affairs, academic council resolutions, and personnel management.
          </p>
          <div className="text-xs text-slate-600 pt-2 flex flex-col gap-1 border-t border-[#E2E8F0]">
            <span>registrar@jstu.ac.bd</span>
            <span>Administrative Building (1st Floor)</span>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-[#B45309] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
              {isBn ? 'পরীক্ষা নিয়ন্ত্রক' : 'Controller of Examinations'}
            </span>
            <ShieldCheck className="w-5 h-5 text-[#B45309]" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">Dr. Md. Mokhlesur Rahman</h2>
          <p className="text-xs text-slate-500 font-semibold">Controller of Examinations &bull; JSTU</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Responsible for examination schedules, tabulation sheet scrutiny, SGPA/CGPA result publication, and certificates.
          </p>
          <div className="text-xs text-slate-600 pt-2 flex flex-col gap-1 border-t border-[#E2E8F0]">
            <span>controller@jstu.ac.bd</span>
            <span>Administrative Building (2nd Floor)</span>
          </div>
        </Card>
      </div>

      {/* Search & All 8 Offices List */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">
              {isBn ? '৮টি বিশ্ববিদ্যালয দপ্তর' : 'All 8 University Administrative Offices'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Contact, officer-in-charge, and operational roles
            </p>
          </div>
          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder={isBn ? 'দপ্তর অনুসন্ধান করুন...' : 'Search offices...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOffices.map((office) => (
            <Card key={office.id} className="p-6 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    {isBn ? office.nameBn : office.name}
                  </h3>
                  <p className="text-xs text-[#1E3A8A] font-semibold mt-0.5">
                    {office.designation}: {office.officerInCharge}
                  </p>
                </div>
                <div className="p-2 bg-[#F1F5F9] rounded-xl text-slate-600 shrink-0">
                  <Building className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {isBn ? office.responsibilitiesBn : office.responsibilities}
              </p>

              <div className="pt-3 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
                  <span className="truncate">{office.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
                  <span>{office.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
                  <span className="truncate">{office.location}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
