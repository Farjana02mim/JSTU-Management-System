import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Trophy,
  HeartPulse,
  Bus,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { SEOHead } from '../../../components/common/SEOHead';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { useLanguage } from '../../../contexts/LanguageContext';

export const StudentLifeHubPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const sections = [
    {
      id: 'halls',
      title: 'Residential Halls',
      titleBn: 'আবাসিক হল ও ছাত্রাবাস',
      desc: 'Explore 3 state-of-the-art halls, amenities, dining mess, and apply online for hall seat allocation.',
      descBn: '৩টি আধুনিক আবাসিক হল, ডাইনিং মেস এবং অনলাইনে সিট বরাদ্দের পূর্ণাঙ্গ আবেদন প্রক্রিয়া।',
      to: '/student-life/halls',
      icon: <Building2 className="w-6 h-6 text-blue-600" />,
      badge: '3 Halls (1,600+ Beds)',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'clubs',
      title: 'Student Clubs & Societies',
      titleBn: 'ছাত্র সংগঠন ও সহশিক্ষা ক্লাব',
      desc: 'Join 8+ active clubs: Computer Club, Robotics, Debating Society, Badhan Blood Donors, and Cultural Society.',
      descBn: 'কম্পিউটার ক্লাব, রোবোটিক্স, ডিবেটিং সোসাইটি ও বাঁধন রক্তদানসহ ৮টির বেশি সক্রিয় ছাত্র সংগঠন।',
      to: '/student-life/clubs',
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      badge: '8 Active Clubs',
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      id: 'sports',
      title: 'Sports & Gymnasium',
      titleBn: 'খেলাধুলা ও শরীরচর্চা কমপ্লেক্স',
      desc: 'Central Stadium, indoor gymnasium, synthetic floodlit courts, inter-department cricket and football tournaments.',
      descBn: 'আন্তর্জাতিক মানের কেন্দ্রীয় মাঠ, শীতাতপ নিয়ন্ত্রিত জিমনেসিয়াম ও বার্ষিক আন্তঃবিভাগ টুর্নামেন্ট।',
      to: '/student-life/sports',
      icon: <Trophy className="w-6 h-6 text-amber-600" />,
      badge: '4 Facilities & Leagues',
      color: 'bg-amber-50 border-amber-200'
    },
    {
      id: 'medical',
      title: 'University Medical Center',
      titleBn: 'বিশ্ববিদ্যালয় মেডিকেল সেন্টার',
      desc: '24/7 emergency ambulance hotline, free physician consultations, medicine dispensary, and mental health counseling.',
      descBn: '২৪/৭ সার্বক্ষণিক অ্যাম্বুলেন্স, বিনামূল্যে ওষুধ বিতরণ ও দক্ষ চিকিৎসক পরিষদ।',
      to: '/student-life/medical',
      icon: <HeartPulse className="w-6 h-6 text-rose-600" />,
      badge: '24/7 Ambulance Hotline',
      color: 'bg-rose-50 border-rose-200'
    },
    {
      id: 'transport',
      title: 'Campus Bus Fleet',
      titleBn: 'ক্যাম্পাস পরিবহন ও বাস সার্ভিস',
      desc: 'Daily bus schedules connecting Jamalpur City, Railway Station, Melandaha, and Sherpur with downloadable timetable.',
      descBn: 'জামালপুর রেলস্টেশন ও পার্শ্ববর্তী এলাকা সংযোগকারী বিশ্ববিদ্যালয়ের নিয়মিত বাস শিডিউল।',
      to: '/student-life/transport',
      icon: <Bus className="w-6 h-6 text-teal-600" />,
      badge: '4 Daily Routes',
      color: 'bg-teal-50 border-teal-200'
    },
    {
      id: 'alumni',
      title: 'Alumni Association (JSTUAA)',
      titleBn: 'অ্যালামনাই অ্যাসোসিয়েশন',
      desc: 'Connect with 3,200+ graduates thriving at Google, Microsoft, Bangladesh Civil Service, and global research institutions.',
      descBn: 'বিশ্বখ্যাত প্রযুক্তি প্রতিষ্ঠান ও সিভিল সার্ভিসে কর্মরত সাবেক শিক্ষার্থীদের সমৃদ্ধ ডিরেক্টরি।',
      to: '/student-life/alumni',
      icon: <GraduationCap className="w-6 h-6 text-purple-600" />,
      badge: '3,200+ Global Graduates',
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <SEOHead
        title={isBn ? 'শিক্ষার্থী জীবন ও ক্যাম্পাস সুযোগ-সুবিধা | জেএসটিইউ' : 'Student Life & Campus Community | JSTU'}
        description={
          isBn
            ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের আবাসন, সহশিক্ষা কার্যক্রম, খেলাধুলা, স্বাস্থ্যসেবা ও পরিবহন সুবিধা।'
            : 'Explore student life at JSTU: residential halls, student clubs, athletics, medical center, bus fleet, and alumni network.'
        }
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#0A2540] via-[#1E3A8A] to-[#0A2540] text-white py-14 px-4 sm:px-8 border-b border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-amber-300 text-xs font-semibold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? 'ক্যাম্পাস সম্প্রদায় ও ছাত্রজীবন' : 'Vibrant Campus Community'}</span>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {isBn ? 'শিক্ষার্থী জীবন ও ক্যাম্পাস পরিবেশ' : 'Student Life & Campus Experience'}
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              {isBn
                ? 'শিক্ষার পাশাপাশি ব্যক্তিত্ব, নেতৃত্ব ও সৃজনশীলতার বিকাশ। আধুনিক আবাসিক হল, আন্তর্জাতিক মানের খেলাধুলা, ২৪/৭ চিকিৎসা ও সহশিক্ষা ক্লাবের সমন্বয়ে পূর্ণাঙ্গ ক্যাম্পাস জীবন।'
                : 'Life at JSTU extends far beyond lecture halls. Discover safe residential living, competitive sports, creative clubs, emergency healthcare, and lifelong alumni bonds.'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((sec) => (
            <Link key={sec.id} to={sec.to} className="group">
              <Card
                padding="lg"
                className="h-full flex flex-col justify-between hover:border-[#1E3A8A] hover:shadow-lg transition-all border border-slate-200 group-hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className={`w-12 h-12 rounded-2xl ${sec.color} flex items-center justify-center border shadow-2xs`}>
                      {sec.icon}
                    </div>
                    <Badge variant="primary">{sec.badge}</Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
                      {isBn ? sec.titleBn : sec.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {isBn ? sec.descBn : sec.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1E3A8A] group-hover:underline">
                  <span>{isBn ? 'বিস্তারিত দেখুন ও প্রবেশ করুন' : 'Explore Section'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
