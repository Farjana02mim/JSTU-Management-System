import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Search,
  Filter,
  Building2,
  MapPin,
  ExternalLink,
  Mail,
  Plus,
  CheckCircle2,
  Sparkles,
  Globe,
  Briefcase
} from 'lucide-react';
import { SEOHead } from '../../../components/common/SEOHead';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Badge } from '../../../components/common/Badge';
import { useLanguage } from '../../../contexts/LanguageContext';
import { initialAlumniData } from '../../../data/studentLifeSeedData';
import { Alumnus, AlumniRegistrationRequest } from '../../../types/studentLife';
import { SharedDataStoreManager } from '../../../services/shared/sharedDataStore';

export const AlumniPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const storeManager = SharedDataStoreManager.getInstance();

  const [alumni] = useState<Alumnus[]>(initialAlumniData);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedBatch, setSelectedBatch] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Alumni Registration Modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [regForm, setRegForm] = useState({
    fullName: '',
    studentId: '',
    department: 'Computer Science & Engineering',
    batch: '1st Batch (2012-13)',
    graduationYear: 2017,
    email: '',
    phone: '',
    currentCompany: '',
    designation: '',
    country: 'Bangladesh',
    city: 'Dhaka',
    linkedinUrl: ''
  });

  const departments = ['All', 'CSE', 'EEE', 'MATH', 'FISH', 'GEOL', 'MGMT'];
  const batches = ['All', '1st Batch (2012-13)', '2nd Batch (2013-14)', '3rd Batch (2014-15)', '4th Batch (2015-16)'];

  const filteredAlumni = alumni.filter((a) => {
    const matchDept = selectedDept === 'All' || a.departmentCode === selectedDept;
    const matchBatch = selectedBatch === 'All' || a.batch === selectedBatch;
    const matchSearch =
      searchQuery.trim() === '' ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.currentPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchBatch && matchSearch;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.fullName || !regForm.studentId || !regForm.email) {
      return;
    }

    storeManager.submitAlumniRegistration({
      fullName: regForm.fullName,
      studentId: regForm.studentId,
      department: regForm.department,
      batch: regForm.batch,
      graduationYear: Number(regForm.graduationYear),
      email: regForm.email,
      phone: regForm.phone,
      currentCompany: regForm.currentCompany,
      designation: regForm.designation,
      country: regForm.country,
      city: regForm.city,
      linkedinUrl: regForm.linkedinUrl
    });

    setFeedback(`Alumni registration submitted for ${regForm.fullName}! The Alumni Relations Cell will verify your record.`);
    setIsRegisterModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <SEOHead
        title={isBn ? 'অ্যালামনাই অ্যাসোসিয়েশন ও গ্র্যাজুয়েট ডিরেক্টরি | জেএসটিইউ' : 'Alumni Association & Graduate Directory | JSTU'}
        description={
          isBn
            ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের সাবেক শিক্ষার্থীদের ডিরেক্টরি, কর্মসংস্থান ও নতুন অ্যালামনাই নিবন্ধন।'
            : 'JSTU Alumni Association, directory of notable graduates in tech, civil service, academia, and global industries.'
        }
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#0A2540] via-[#1E3A8A] to-[#0A2540] text-white py-12 px-4 sm:px-8 border-b border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-amber-300 text-xs font-semibold border border-blue-400/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{isBn ? 'জেএসটিইউ অ্যালামনাই অ্যাসোসিয়েশন' : 'JSTU Alumni Association (JSTUAA)'}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {isBn ? 'সাবেক শিক্ষার্থী ও অ্যালামনাই ডিরেক্টরি' : 'Alumni Network & Graduate Directory'}
              </h1>
              <p className="text-sm sm:text-base text-blue-100 max-w-2xl mt-1 leading-relaxed">
                {isBn
                  ? 'গুগল, মাইক্রোসফট, বাংলাদেশ সিভিল সার্ভিস ও বিশ্বখ্যাত বিশ্ববিদ্যালয়ে কর্মরত জেএসটিইউ-এর গর্বিত গ্র্যাজুয়েটবৃন্দ।'
                  : 'Connecting over 3,200 alumni shaping global technology, public service, academic research, and entrepreneurship across 24 countries.'}
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsRegisterModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold self-start md:self-auto shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>{isBn ? 'নতুন অ্যালামনাই নিবন্ধন' : 'Register as Alumnus'}</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
        {feedback && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
              &times;
            </button>
          </div>
        )}

        {/* Search & Filter Card */}
        <Card padding="md" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'নাম, কোম্পানি বা পদবি দিয়ে খুঁজুন...' : 'Search by alumni name, organization, title or country...'}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white text-slate-700"
              >
                <option value="All">All Departments</option>
                {departments.filter((d) => d !== 'All').map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white text-slate-700"
              >
                <option value="All">All Graduation Batches</option>
                {batches.filter((b) => b !== 'All').map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Showing {filteredAlumni.length} verified alumni profiles</span>
            <span className="font-mono text-[11px]">Global Chapters: Dhaka, Silicon Valley, Singapore, Munich, London</span>
          </div>
        </Card>

        {/* Alumni Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAlumni.map((a) => (
            <Card
              key={a.id}
              padding="none"
              className="overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow border border-slate-200"
            >
              <div>
                <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                  <img
                    src={a.avatar}
                    alt={a.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-amber-300">
                      {a.departmentCode} &bull; {a.graduatedYear}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200 block">
                      {a.organizationType}
                    </span>
                    <h3 className="font-bold text-sm text-white truncate">{isBn ? a.nameBn : a.name}</h3>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div>
                    <span className="font-bold text-slate-800 text-xs block leading-tight">
                      {isBn ? a.currentPositionBn : a.currentPosition}
                    </span>
                    <span className="text-xs text-[#1E3A8A] font-semibold block mt-0.5">
                      {a.organization}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{a.city}, {a.country}</span>
                  </p>

                  {a.quote && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic line-clamp-3">
                      &quot;{isBn ? a.quoteBn : a.quote}&quot;
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <span className="text-[10px] text-slate-400 font-mono">{a.batch.split('(')[0]}</span>
                {a.linkedinUrl && (
                  <a
                    href={a.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#1E3A8A] hover:underline font-semibold text-xs"
                  >
                    <span>Connect</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ALUMNI REGISTRATION MODAL */}
      {isRegisterModalOpen && (
        <Modal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          title="Alumni Registration & Verification Request"
          size="lg"
        >
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px]">
              Join the official JSTU Alumni Association Directory. Connect with fellow graduates, offer student mentorships, and receive university updates.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. M. Raihanul Islam"
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Graduation Student Roll / ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JSTU1201042"
                  value={regForm.studentId}
                  onChange={(e) => setRegForm({ ...regForm, studentId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={regForm.department}
                  onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Electrical & Electronic Engineering">EEE</option>
                  <option value="Mathematics & Statistics">MATH</option>
                  <option value="Fisheries & Marine Resources">FISH</option>
                  <option value="Geology & Mining Engineering">GEOL</option>
                  <option value="Management & Business Studies">MGMT</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batch</label>
                <select
                  value={regForm.batch}
                  onChange={(e) => setRegForm({ ...regForm, batch: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="1st Batch (2012-13)">1st Batch (2012-13)</option>
                  <option value="2nd Batch (2013-14)">2nd Batch (2013-14)</option>
                  <option value="3rd Batch (2014-15)">3rd Batch (2014-15)</option>
                  <option value="4th Batch (2015-16)">4th Batch (2015-16)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Graduation Year</label>
                <input
                  type="number"
                  min="2016"
                  max="2026"
                  required
                  value={regForm.graduationYear}
                  onChange={(e) => setRegForm({ ...regForm, graduationYear: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Organization / Employer</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, bKash, Bangladesh Civil Service..."
                  value={regForm.currentCompany}
                  onChange={(e) => setRegForm({ ...regForm, currentCompany: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Software Engineer, Executive Magistrate..."
                  value={regForm.designation}
                  onChange={(e) => setRegForm({ ...regForm, designation: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={regForm.city}
                  onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={regForm.country}
                  onChange={(e) => setRegForm({ ...regForm, country: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={regForm.linkedinUrl}
                  onChange={(e) => setRegForm({ ...regForm, linkedinUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsRegisterModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Submit Registration
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
