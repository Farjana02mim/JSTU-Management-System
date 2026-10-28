import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Calendar,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Award,
  Zap,
  Globe
} from 'lucide-react';
import { SEOHead } from '../../../components/common/SEOHead';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Badge } from '../../../components/common/Badge';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { initialClubsData } from '../../../data/studentLifeSeedData';
import { StudentClub, ClubMembershipApplication } from '../../../types/studentLife';
import { SharedDataStoreManager } from '../../../services/shared/sharedDataStore';

export const ClubsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { profile } = useAuth();
  const storeManager = SharedDataStoreManager.getInstance();

  const [clubs] = useState<StudentClub[]>(initialClubsData);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Club for modal join
  const [selectedClub, setSelectedClub] = useState<StudentClub | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [joinForm, setJoinForm] = useState({
    studentName: profile?.fullName || 'Tanvir Ahmed',
    rollNumber: profile?.studentId || '2026001',
    department: profile?.departmentId || 'CSE',
    email: profile?.email || 'student.demo@jstu.ac.bd',
    phone: '+880 1711-234567',
    session: '2022-2023',
    interestRole: 'Active General Member',
    skills: 'React, Python, Problem Solving',
    reason: 'Passionate about representing JSTU in national tournaments and contributing to campus community workshops.'
  });

  const categories = ['All', 'technology', 'debate', 'service', 'cultural', 'sports'];

  const filteredClubs = clubs.filter((c) => {
    const matchCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameBn.includes(searchQuery) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.motto.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClub) return;

    storeManager.submitClubApplication({
      clubId: selectedClub.id,
      clubName: selectedClub.name,
      studentId: profile?.studentId || 'JSTU2026001',
      studentName: joinForm.studentName,
      rollNumber: joinForm.rollNumber,
      department: joinForm.department,
      email: joinForm.email,
      phone: joinForm.phone,
      session: joinForm.session,
      interestRole: joinForm.interestRole,
      skills: joinForm.skills,
      reason: joinForm.reason
    });

    setFeedback(`Membership application submitted to ${selectedClub.name}! The executive committee will contact you.`);
    setIsJoinModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <SEOHead
        title={isBn ? 'ছাত্র সংগঠন ও সহশিক্ষা ক্লাব | জেএসটিইউ' : 'Student Clubs & Co-Curricular Societies | JSTU'}
        description={
          isBn
            ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের কম্পিউটার ক্লাব, রোবোটিক্স, ডিবেটিং সোসাইটি, বাঁধন রক্তদান ইউনিট ও সাংস্কৃতিক সংসদ।'
            : 'JSTU student clubs, societies, robotics, computer club, debating society, rover scouts, blood donors, and membership applications.'
        }
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#0A2540] via-[#1E3A8A] to-[#0A2540] text-white py-12 px-4 sm:px-8 border-b border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-amber-300 text-xs font-semibold border border-blue-400/30">
            <Zap className="w-3.5 h-3.5" />
            <span>{isBn ? 'সহশিক্ষা ও ছাত্র নেতৃত্ব' : 'Co-Curricular & Student Leadership'}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {isBn ? 'ছাত্র সংগঠন ও সহশিক্ষা ক্লাবসমূহ' : 'Student Clubs & Campus Societies'}
              </h1>
              <p className="text-sm sm:text-base text-blue-100 max-w-2xl mt-1 leading-relaxed">
                {isBn
                  ? 'প্রযুক্তি উদ্ভাবন, রক্তদান, জাতীয় বিতর্ক, শিল্পকলা ও রোভার স্কাউটিং— আপনার মেধা ও নেতৃত্বের বিকাশ ঘটান।'
                  : 'Join 8+ active university clubs. Build technological solutions, participate in national competitions, volunteer in social causes, and shape student life.'}
              </p>
            </div>

            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs text-center shrink-0">
              <span className="text-amber-300 font-extrabold text-xl block">8+ Active Clubs</span>
              <span className="text-slate-200">2,500+ Registered Student Members</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
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

        {/* Filter and Search Bar */}
        <Card padding="md" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'ক্লাবের নাম বা বিষয় দিয়ে খুঁজুন...' : 'Search clubs by name, code or keyword...'}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap cursor-pointer transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClubs.map((club) => (
            <Card
              key={club.id}
              padding="lg"
              className="flex flex-col justify-between hover:shadow-md transition-shadow border border-slate-200 space-y-5"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl ${club.badgeColor} text-white flex items-center justify-center font-black text-sm shadow-xs`}
                    >
                      {club.code.slice(0, 4)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {isBn ? club.nameBn : club.name}
                      </h3>
                      <p className="text-xs text-[#1E3A8A] font-semibold italic mt-0.5">
                        &quot;{isBn ? club.mottoBn : club.motto}&quot;
                      </p>
                    </div>
                  </div>

                  <Badge variant="primary">{club.category.toUpperCase()}</Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {isBn ? club.descriptionBn : club.description}
                </p>

                {/* Key Activities */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Core Activities & Focus
                  </h4>
                  <ul className="space-y-1">
                    {(isBn ? club.activitiesBn : club.activities).map((act, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Executive Body & Meeting */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">President:</span>
                    <span className="font-semibold text-slate-800">{club.president}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Faculty Advisor:</span>
                    <span className="font-medium text-slate-700">{club.advisor}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-500">Weekly Meeting:</span>
                    <span className="font-mono text-[#1E3A8A] font-bold">{club.weeklyMeetingTime}</span>
                  </div>
                </div>

                {/* Upcoming Event Banner if any */}
                {club.upcomingEvents.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1 text-amber-900">
                    <div className="flex items-center gap-1 font-bold text-[11px] text-amber-800 uppercase">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>Upcoming Event</span>
                    </div>
                    <p className="font-semibold">{club.upcomingEvents[0].title}</p>
                    <p className="text-[11px] text-amber-700">
                      Date: {club.upcomingEvents[0].date} &bull; Venue: {club.upcomingEvents[0].venue}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-700">{club.memberCount}</span>
                  <span>Registered Members</span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedClub(club);
                    setIsJoinModalOpen(true);
                  }}
                  className="text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Join Club</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* JOIN CLUB MODAL */}
      {selectedClub && isJoinModalOpen && (
        <Modal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          title={`Join ${selectedClub.name} (${selectedClub.code})`}
          size="md"
        >
          <form onSubmit={handleJoinSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px]">
              Apply to become an official member of <strong>{selectedClub.name}</strong>. Free student membership includes access to weekly sessions, mentorship, and certificates.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={joinForm.studentName}
                  onChange={(e) => setJoinForm({ ...joinForm, studentName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Roll / ID</label>
                <input
                  type="text"
                  required
                  value={joinForm.rollNumber}
                  onChange={(e) => setJoinForm({ ...joinForm, rollNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={joinForm.department}
                  onChange={(e) => setJoinForm({ ...joinForm, department: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={joinForm.phone}
                  onChange={(e) => setJoinForm({ ...joinForm, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Skills / Prior Experience</label>
              <input
                type="text"
                placeholder="e.g. Graphic design, debate, python coding..."
                value={joinForm.skills}
                onChange={(e) => setJoinForm({ ...joinForm, skills: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Why do you wish to join this club?</label>
              <textarea
                rows={2}
                required
                value={joinForm.reason}
                onChange={(e) => setJoinForm({ ...joinForm, reason: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsJoinModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Submit Membership Request
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
