import {
  DepartmentInfo,
  FacultyInfo,
  OfficeInfo,
  Notice,
  UniversityEvent,
  UniversityStat,
  ResearchCluster,
  CareerOpening,
  FAQItem,
  UniversityNewsItem,
  PhotoGalleryItem,
  UniversityAuthority,
  CitizensCharterService
} from '../types';

// NOTE: Real JSTU photos should be added once available. Using neutral campus and education imagery with no text, logos, or real people for demo prototype.
export const campusImages = {
  hero: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80',
  researchLab: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80',
  library: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80',
  academicCouncil: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
  adminFlag: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80',
  aerialCampus: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
  campusNight: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1600&q=80',
  ceremonyMou: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80'
};

export interface BannerSlide {
  id: string;
  image: string;
  badge: string;
  badgeBn: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  tag: string;
  tagBn: string;
}

export const bannerSlidesData: BannerSlide[] = [
  {
    id: 'slide-1',
    image: campusImages.adminFlag,
    badge: 'Govt. Public University · Est. 2012',
    badgeBn: 'সরকারি পাবলিক বিশ্ববিদ্যালয় · প্রতিষ্ঠা ২০১২',
    title: 'Building a Smarter, Digital & Paperless University',
    titleBn: 'স্মার্ট, ডিজিটাল ও কাগজবিহীন বিশ্ববিদ্যালয় বিনির্মাণে',
    subtitle: 'Jamalpur Science & Technology University (JSTU) is pioneering paperless academic administration, tamper-proof examinations, and cryptographic verification.',
    subtitleBn: 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (জেএসটিইউ) উচ্চশিক্ষায় পেপারলেস প্রশাসন, সম্পূর্ণ সুরক্ষিত ডিজিটাল ফলাফল এবং স্বয়ংক্রিয় সেবা নিশ্চিত করছে।',
    tag: 'Academic & Administrative Complex',
    tagBn: 'একাডেমিক ও প্রশাসনিক ভবন'
  },
  {
    id: 'slide-2',
    image: campusImages.aerialCampus,
    badge: '50-Acre Scenic Green Campus',
    badgeBn: '৫০ একর সবুজ ক্যাম্পাস ও আধুনিক পরিকাঠামো',
    title: 'Excellence in Science, Engineering & Applied Research',
    titleBn: 'বিজ্ঞান, প্রকৌশল ও প্রায়োগিক গবেষণায় অনন্য উৎকর্ষ',
    subtitle: 'Explore our state-of-the-art pavilions, high-speed campus fiber network, and modern laboratories at Jamalpur-2012, Bangladesh.',
    subtitleBn: 'ব্রহ্মপুত্র নদীর অববাহিকায় জামালপুর-২০১২ তে অবস্থিত জেএসটিইউ-এর আধুনিক ল্যাবরেটরি ও সবুজ ক্যাম্পাস।',
    tag: 'Scenic Campus Grounds & Walkway',
    tagBn: 'সবুজ ক্যাম্পাস ও বৃক্ষ শোভিত ওয়াকওয়ে'
  },
  {
    id: 'slide-3',
    image: campusImages.library,
    badge: 'Central Library & Digital Commons',
    badgeBn: 'কেন্দ্রীয় গ্রন্থাগার ও ডিজিটাল রিসোর্স',
    title: 'Expanding Horizons Through Scholarly Research & Learning',
    titleBn: 'গবেষণা ও জ্ঞানার্জনের আধুনিক দিগন্ত',
    subtitle: 'Extensive e-journal repositories, automated circulation systems, and dedicated research study cubicles for faculty and students.',
    subtitleBn: 'অনলাইন ই-রিসোর্স, স্বয়ংক্রিয় লাইব্রেরি ক্যাটালগ এবং শিক্ষক-শিক্ষার্থীদের জন্য নিবিড় অধ্যয়ন সুবিধা।',
    tag: 'Central Library & Learning Resources',
    tagBn: 'কেন্দ্রীয় গ্রন্থাগার ও জ্ঞান চর্চা কেন্দ্র'
  },
  {
    id: 'slide-4',
    image: campusImages.campusNight,
    badge: 'Vibrant Campus Life & Heritage',
    badgeBn: 'উজ্জ্বল উৎসব ও সাংস্কৃতিক ঐতিহ্য',
    title: 'Fostering Leadership, Innovation & Cultural Pride',
    titleBn: 'উদ্ভাবন, নেতৃত্ব ও সাংস্কৃতিক সমৃদ্ধি',
    subtitle: 'A vibrant scholarly community celebrating national milestones, scientific Olympiads, and student innovations.',
    subtitleBn: 'জাতীয় দিবস, বিজ্ঞান অলিম্পিয়াড এবং শিক্ষার্থী উদ্ভাবনে মুখরিত জেএসটিইউ পরিবার।',
    tag: 'Campus Architecture & Evening Study Grounds',
    tagBn: 'বিশ্ববিদ্যালয় ক্যাম্পাস ও শান্ত সান্ধ্য চত্বর'
  }
];

export { facultiesData, departmentsData } from './academicsSeedData';


export const officesData: OfficeInfo[] = [
  {
    id: 'registrar',
    name: 'Office of the Registrar',
    nameBn: 'রেজিস্ট্রার দপ্তর',
    officerInCharge: 'Md. Abdul Mannan',
    designation: 'Registrar (Acting)',
    email: 'registrar@jstu.ac.bd',
    phone: '+880 29977 12340',
    location: 'Administrative Building (1st Floor), JSTU Campus',
    responsibilities: [
      'Central academic admissions & student enrollment records',
      'Syndicate & Academic Council secretariat management',
      'Staff recruitment, appointments, and service records',
      'Official university gazettes, circulars, and public notices'
    ],
    responsibilitiesBn: [
      'কেন্দ্রীয় একাডেমিক ভর্তি ও শিক্ষার্থী রেজিস্ট্রেশন সংরক্ষণ',
      'সিন্ডিকেট ও একাডেমিক কাউন্সিলের দাপ্তরিক কার্যক্রম পরিচালনা',
      'শিক্ষক-কর্মকর্তা নিয়োগ ও সার্ভিস বুক রক্ষণাবেক্ষণ',
      'বিশ্ববিদ্যালয়ের কেন্দ্রীয় আদেশ ও প্রজ্ঞাপন জারি'
    ]
  },
  {
    id: 'exam-controller',
    name: 'Office of the Controller of Examinations',
    nameBn: 'পরীক্ষা নিয়ন্ত্রক দপ্তর',
    officerInCharge: 'Dr. Md. Mokhlesur Rahman',
    designation: 'Controller of Examinations',
    email: 'controller@jstu.ac.bd',
    phone: '+880 29977 12341',
    location: 'Administrative Building (2nd Floor), JSTU Campus',
    responsibilities: [
      'Semester final examination schedules and hall coordination',
      'Scrutiny of departmental marks, SGPA and CGPA computation',
      'Publication of official university examination results',
      'Issuance of cryptographically signed transcripts & certificates'
    ],
    responsibilitiesBn: [
      'সেমিস্টার ফাইনাল পরীক্ষার রুটিন ও আসন বিন্যাস সমন্বয়',
      'বিভাগীয় মার্কশিট যাচাই, এসজিপিএ এবং সিজিপিএ হিসাব',
      'অফিসিয়াল সেমিস্টার পরীক্ষার ফলাফল প্রকাশ',
      'ডিজিটাল কিউআর সম্বলিত সনদ ও ট্রান্সক্রিপ্ট ইস্যু'
    ]
  },
  {
    id: 'library',
    name: 'Central Library',
    nameBn: 'কেন্দ্রীয় গ্রন্থাগার',
    officerInCharge: 'Syed Nurul Huda',
    designation: 'Librarian',
    email: 'library@jstu.ac.bd',
    phone: '+880 29977 12342',
    location: 'Library Building (Ground & 1st Floor)',
    responsibilities: [
      'Cataloging of physical monographs, journals, and textbooks',
      'Digital institutional repository and IEEE/ACM/JSTOR e-access',
      'Student book borrowing cards and RFID circulation',
      'Automated digital no-dues clearance verification'
    ],
    responsibilitiesBn: [
      'পুস্তক ও জার্নাল ক্যাটালগিং ও সংগ্রহ সংরক্ষণ',
      'ই-রিসোর্স ও আন্তর্জাতিক গবেষণাপত্রের ডিজিটাল এক্সেস',
      'শিক্ষার্থী বই ইস্যু ও আরএফআইডি ব্যবস্থাপনা',
      'কাগজবিহীন অনলাইন লাইব্রেরি ছাড়পত্র অনুমোদন'
    ]
  },
  {
    id: 'proctor',
    name: 'Office of the Proctor',
    nameBn: 'প্রক্টর অফিস',
    officerInCharge: 'Prof. Dr. Zahirul Haque',
    designation: 'Proctor',
    email: 'proctor@jstu.ac.bd',
    phone: '+880 29977 12343',
    location: 'Administrative Building (Ground Floor)',
    responsibilities: [
      'Campus safety, security, and discipline enforcement',
      'Anti-ragging committee operations and grievance redressal',
      'Coordination of university protocol and guest security',
      'Student conduct and campus identification verification'
    ],
    responsibilitiesBn: [
      'ক্যাম্পাসের সার্বিক নিরাপত্তা ও শৃঙ্খলা নিশ্চিতকরণ',
      'র‍্যাগিং প্রতিরোধ ও শিক্ষার্থী অনুযোগ নিষ্পত্তি',
      'বিশ্ববিদ্যালয়ের আনুষ্ঠানিক শৃঙ্খলা বজায় রাখা',
      'আইডি কার্ড পরিধান ও আচরণবিধি তদারকি'
    ]
  },
  {
    id: 'accounts',
    name: 'Office of the Account & Finance',
    nameBn: 'হিসাব ও অর্থ দপ্তর',
    officerInCharge: 'A. K. M. Saiful Islam',
    designation: 'Director (Finance & Accounts)',
    email: 'accounts@jstu.ac.bd',
    phone: '+880 29977 12344',
    location: 'Administrative Building (1st Floor)',
    responsibilities: [
      'Student semester tuition and exam fee collection & ledger',
      'University annual budget preparation and UGC fund execution',
      'Staff payroll, provident fund, and vendor disbursements',
      'Instant online financial clearance verification for graduates'
    ],
    responsibilitiesBn: [
      'শিক্ষার্থীদের সেমিস্টার ও পরীক্ষার ফি হিসাব রক্ষণ',
      'বার্ষিক বাজেট প্রণয়ন এবং ইউজিসি অনুদান বাস্তবায়ন',
      'কর্মকর্তা-কর্মচারীদের বেতন-ভাতা প্রদান',
      'ডিজিটাল আর্থিক ছাড়পত্র তাৎক্ষণিক যাচাই'
    ]
  },
  {
    id: 'ict-cell',
    name: 'ICT Cell',
    nameBn: 'আইসিটি সেল',
    officerInCharge: 'Engr. Mahbub Alam',
    designation: 'System Analyst & In-charge',
    email: 'ictcell@jstu.ac.bd',
    phone: '+880 29977 12345',
    location: 'Academic Building 1 (Level 4)',
    responsibilities: [
      'JSTU Smart Campus architecture, database & cloud services',
      'Campus-wide high-speed fiber optical network & WiFi access',
      'Institutional email domain & cybersecurity management',
      'Continuous software updates and user access provisioning'
    ],
    responsibilitiesBn: [
      'জেএসটিইউ স্মার্ট ক্যাম্পাস প্ল্যাটফর্ম ও ডাটাবেজ পরিচালনা',
      'ক্যাম্পাস অপটিক্যাল ফাইবার ও ব্রডব্যান্ড নেটওয়ার্ক রক্ষণাবেক্ষণ',
      'প্রাতিষ্ঠানিক ইমেইল ও সাইবার নিরাপত্তা সুরক্ষা',
      'সিস্টেম আপগ্রেডেশন ও ইউজার অ্যাক্সেস ম্যানেজমেন্ট'
    ]
  },
  {
    id: 'iqac',
    name: 'Institutional Quality Assurance Cell (IQAC)',
    nameBn: 'ইনস্টিটিউশনাল কোয়ালিটি অ্যাসিউরেন্স সেল (আইকিউএসি)',
    officerInCharge: 'Prof. Dr. Shamsul Huda',
    designation: 'Director',
    email: 'iqac@jstu.ac.bd',
    phone: '+880 29977 12346',
    location: 'Academic Building 2 (Level 3)',
    responsibilities: [
      'Outcome-based education (OBE) curriculum accreditation',
      'Faculty pedagogical development workshops and evaluations',
      'Departmental self-assessment reports and peer-reviews',
      'University national and international ranking strategies'
    ],
    responsibilitiesBn: [
      'আউটকাম-বেসড শিক্ষা (ওবিই) কারিকুলাম উন্নয়ন',
      'শিক্ষকদের পেডাগজিক্যাল কর্মশালা ও প্রশিক্ষণ পরিচালনা',
      'বিভাগীয় গুণগত মান যাচাই ও সেলফ-অ্যাসেসমেন্ট',
      'বিশ্ববিদ্যালয়ের উচ্চশিক্ষা র‍্যাংকিং উন্নয়ন পরিকল্পনা'
    ]
  },
  {
    id: 'medical',
    name: 'University Medical Center',
    nameBn: 'বিশ্ববিদ্যালয় মেডিকেল সেন্টার',
    officerInCharge: 'Dr. Shahina Akter',
    designation: 'Chief Medical Officer',
    email: 'medical@jstu.ac.bd',
    phone: '+880 29977 12347',
    location: 'Medical Center Building (Beside Shahid Hall)',
    responsibilities: [
      '24/7 emergency medical primary care for students & staff',
      'Routine diagnostic consultation and essential medicine supply',
      'Campus ambulance dispatch and hospital referral support',
      'Annual student health screenings and vaccination drives'
    ],
    responsibilitiesBn: [
      'শিক্ষার্থী ও শিক্ষক-কর্মকর্তাদের সার্বক্ষণিক প্রাথমিক চিকিৎসা সেবা',
      'বিনামূল্যে প্রয়োজনীয় ওষুধ ও প্রেসক্রিপশন প্রদান',
      'জরুরি অ্যাম্বুলেন্স সেবা ও রেফারেল সহায়তা',
      'ক্যাম্পাসব্যাপী স্বাস্থ্য সচেতনতা ও টিকা প্রদান কর্মসূচি'
    ]
  }
];

export const noticesSeedData: Notice[] = [
  {
    id: 'not-2026-001',
    title: 'Adoption of JSTU Smart Campus Digital System for Semester Final Examinations',
    titleBn: 'সেমিস্টার ফাইনাল পরীক্ষার মার্কস ও ট্যাবুলেশনে জেএসটিইউ স্মার্ট ক্যাম্পাস প্ল্যাটফর্ম চালুকরণ',
    category: 'Academic',
    publishDate: '2026-10-02',
    publishDateBn: '২ অক্টোবর ২০২৬',
    summary: 'All academic departments are notified to submit continuous assessment (30%) and semester final marks (70%) through the new paperless portal.',
    summaryBn: 'সকল শিক্ষাদান বিভাগকে কন্টিনিউয়াস অ্যাসেসমেন্ট (৩০%) ও সেমিস্টার ফাইনাল নম্বর (৭০%) পেপারলেস পোর্টালের মাধ্যমে জমা দিতে নির্দেশ দেওয়া হচ্ছে।',
    body: 'In accordance with the Academic Council Resolution No. 42/2026, Jamalpur Science & Technology University has formally inaugurated the JSTU Smart Campus portal. Faculty members are requested to complete marks entry within 14 working days of exam completion. Printed manual tabulation sheets are henceforth replaced with cryptographically verified digital records.',
    bodyBn: 'একাডেমিক কাউন্সিলের ৪২/২০২৬ নম্বর সিদ্ধান্ত মোতাবেক জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ে আনুষ্ঠানিকভাবে স্মার্ট ক্যাম্পাস পোর্টাল চালু করা হলো। পরীক্ষা শেষ হওয়ার ১৪ কার্যদিবসের মধ্যে শিক্ষকদের সফটওয়্যারে নম্বর এন্ট্রি সম্পন্ন করতে হবে। প্রচলিত কাগুজে ট্যাবুলেশন শিট সম্পূর্ণ রহিত করে ডিজিটাল ভেরিফিকেশন ব্যবস্থা কার্যকর করা হলো।',
    department: 'Controller of Examinations',
    departmentBn: 'পরীক্ষা নিয়ন্ত্রক দপ্তর',
    referenceNumber: 'JSTU/COE/2026/184',
    attachmentUrl: '#',
    status: 'published',
    isImportant: true
  },
  {
    id: 'not-2026-002',
    title: 'Undergraduate Admission Schedule for Academic Session 2026-2027',
    titleBn: '২০২৬-২০২৭ শিক্ষাবর্ষে স্নাতক প্রথম বর্ষে ভর্তি সংক্রান্ত প্রাথমিক বিজ্ঞপ্তি',
    category: 'Admission',
    publishDate: '2026-09-28',
    publishDateBn: '২৮ সেপ্টেম্বর ২০২৬',
    summary: 'Preliminary admission guidelines for the GST cluster examination qualified candidates seeking admission into JSTU.',
    summaryBn: 'গুচ্ছ ভর্তি পরীক্ষায় উত্তীর্ণ শিক্ষার্থীদের মধ্য হতে জেএসটিইউ-এর ৬টি অনুষদের ৭টি বিভাগে ভর্তির প্রাথমিক নিয়মাবলী।',
    body: 'Prospective students are informed that online admission application for 2026-2027 session will commence through the JSTU Admission Portal. Detailed quota distribution, unit-wise seat capacity, and subject eligibility criteria are published in the official prospectus.',
    bodyBn: '২০২৬-২০২৭ শিক্ষাবর্ষে স্নাতক প্রথম বর্ষে ভর্তির অনলাইন আবেদন জেএসটিইউ এডমিশন পোর্টালের মাধ্যমে শুরু হবে। ইউনিটভিত্তিক আসন বিন্যাস, কোটা ও বিষয়ভিত্তিক শর্তাবলী প্রসপেক্টাসে উল্লেখ করা হয়েছে।',
    department: 'Registrar Office',
    departmentBn: 'রেজিস্ট্রার দপ্তর',
    referenceNumber: 'JSTU/REG/ADM/2026/092',
    status: 'published',
    isImportant: true
  },
  {
    id: 'not-2026-003',
    title: 'Routine for Fall Semester 2026 Final Examination',
    titleBn: 'ফল সেমিস্টার ২০২৬ চূড়ান্ত পরীক্ষার সময়সূচি প্রকাশ',
    category: 'Exam',
    publishDate: '2026-09-22',
    publishDateBn: '২২ সেপ্টেম্বর ২০২৬',
    summary: 'Official semester final examination schedule for CSE, EEE, Mathematics, and Fisheries departments.',
    summaryBn: 'সিএসই, ইইই, গণিত এবং ফিশারিজ বিভাগের সেমিস্টার ফাইনাল পরীক্ষার রুটিন প্রকাশ।',
    body: 'The Fall Semester 2026 Final Examinations will commence on October 25, 2026. Students must verify digital payment clearances and print computer-generated admit cards from the Student Portal.',
    bodyBn: 'ফল সেমিস্টার ২০২৬ চূড়ান্ত পরীক্ষা আগামী ২৫ অক্টোবর ২০২৬ তারিখ থেকে শুরু হবে। শিক্ষার্থীদের নিজ নিজ শিক্ষার্থী পোর্টাল থেকে বকেয়া পরিশোধপূর্বক ডিজিটাল প্রবেশপত্র সংগ্রহ করতে হবে।',
    department: 'Controller of Examinations',
    departmentBn: 'পরীক্ষা নিয়ন্ত্রক দপ্তর',
    referenceNumber: 'JSTU/COE/EXAM/2026/301',
    status: 'published'
  },
  {
    id: 'not-2026-004',
    title: 'Prime Minister Gold Medal & Merit Scholarship Nominations',
    titleBn: 'প্রধানমন্ত্রী স্বর্ণপদক ও অভ্যন্তরীণ মেধা বৃত্তি সংক্রান্ত তথ্য আহবান',
    category: 'Scholarship',
    publishDate: '2026-09-15',
    publishDateBn: '১৫ সেপ্টেম্বর ২০২৬',
    summary: 'Nominations invited from each faculty for students securing top CGPA in the graduating batches.',
    summaryBn: 'উচ্চ সিজিপিএ অর্জনকারী স্নাতক সম্পন্ন শিক্ষার্থীদের তালিকা প্রস্তুত ও জমাদানের জন্য অনুষদের ডিনদের প্রতি আহবান।',
    body: 'Deans of all six faculties are requested to forward verified CGPA records for the graduating session through the JSTU automated registrar clearance system by October 10, 2026.',
    bodyBn: 'সকল অনুষদের ডিন মহোদয়কে আগামী ১০ অক্টোবর ২০২৬-এর মধ্যে স্মার্ট ক্যাম্পাস পোর্টালের মাধ্যমে যাচিত তথ্য রেজিস্ট্রার দপ্তরে পাঠানোর জন্য অনুরোধ করা হলো।',
    department: 'Registrar Office',
    departmentBn: 'রেজিস্ট্রার দপ্তর',
    referenceNumber: 'JSTU/REG/SCH/2026/044',
    status: 'published'
  },
  {
    id: 'not-2026-005',
    title: 'Mandatory Implementation of Multi-Factor Authentication (MFA) for University Staff',
    titleBn: 'কর্মকর্তা ও শিক্ষকবৃন্দের আইডিতে টু-ফ্যাক্টর অথেনটিকেশন (MFA) সক্রিয়করণ সংক্রান্ত আদেশ',
    category: 'Administration',
    publishDate: '2026-09-10',
    publishDateBn: '১০ সেপ্টেম্বর ২০২৬',
    summary: 'ICT Cell cybersecurity advisory mandating SMS/TOTP two-factor authentication for all academic staff.',
    summaryBn: 'বিশ্ববিদ্যালয়ের সাইবার নিরাপত্তা বৃদ্ধিতে সকল শিক্ষক ও প্রশাসনিক কর্মকর্তার জন্য এমএফএ বাধ্যতামূলক করা হলো।',
    body: 'To protect academic grade integrity and confidential university archives, all faculty and administrative personnel are required to complete MFA setup upon their next portal sign-in.',
    bodyBn: 'একাডেমিক গ্রেড সুরক্ষায় এবং অননুমোদিত অ্যাক্সেস প্রতিরোধে প্রত্যেক শিক্ষক ও কর্মকর্তার পোর্টালে দ্বি-স্তর বিশিষ্ট নিরাপত্তা নিশ্চিত করা হচ্ছে।',
    department: 'ICT Cell',
    departmentBn: 'আইসিটি সেল',
    referenceNumber: 'JSTU/ICT/SEC/2026/015',
    status: 'published'
  },
  {
    id: 'not-2026-006',
    title: 'Campus Weather Advisory: Heavy Monsoon Alert for Jamalpur District',
    titleBn: 'আবহাওয়া সংক্রান্ত জরুরি সতর্কবার্তা ও ক্লাস পরিচালনা নির্দেশিকা',
    category: 'Emergency',
    publishDate: '2026-09-02',
    publishDateBn: '২ সেপ্টেম্বর ২০২৬',
    summary: 'Safety protocol for campus commuters in view of waterlogging warnings in Jamalpur Sadar.',
    summaryBn: 'জামালপুর সদর ও পার্শ্ববর্তী এলাকায় অতিবৃষ্টিতে সতর্কতা অবলম্বন ও অনলাইন ক্লাস সমন্বয় নির্দেশিকা।',
    body: 'Due to severe monsoon precipitation, campus bus shuttle schedules are adjusted. All laboratory work scheduled after 4:00 PM shall be conducted under strict safety measures.',
    bodyBn: 'ভারী বর্ষণে যাতায়াত ঝুঁকি এড়াতে পরিবহন সময়সূচি পুনর্বিন্যাস করা হয়েছে। সার্বিক সহযোগিতায় প্রক্টর অফিসে যোগাযোগ করুন।',
    department: 'Office of the Proctor',
    departmentBn: 'প্রক্টর অফিস',
    referenceNumber: 'JSTU/PROC/EMG/2026/008',
    status: 'published'
  }
];

export const universityStats: UniversityStat[] = [
  {
    id: 'faculties',
    label: 'Faculties',
    labelBn: 'অনুষদ',
    value: '6',
    valueBn: '৬টি',
    description: 'Specialized academic disciplines',
    descriptionBn: 'উচ্চশিক্ষা ও বিশেষায়িত শাখা'
  },
  {
    id: 'departments',
    label: 'Departments',
    labelBn: 'শিক্ষা বিভাগ',
    value: '7',
    valueBn: '৭টি',
    description: 'Accredited degree-granting units',
    descriptionBn: 'স্নাতক ও স্নাতকোত্তর বিভাগ'
  },
  {
    id: 'students',
    label: 'Enrolled Students',
    labelBn: 'অধ্যয়নরত শিক্ষার্থী',
    value: '1,200+',
    valueBn: '১,২০০+',
    description: 'Undergraduate & Graduate scholars (Demo)',
    descriptionBn: 'স্নাতক ও গবেষক শিক্ষার্থী (ডেমো)'
  },
  {
    id: 'facultyMembers',
    label: 'Faculty & Researchers',
    labelBn: 'শিক্ষক ও গবেষক',
    value: '80+',
    valueBn: '৮০+',
    description: 'Doctoral scholars & educators',
    descriptionBn: 'পিএইচডি ও অভিজ্ঞ শিক্ষক'
  },
  {
    id: 'digitalClearance',
    label: 'Paperless Efficiency',
    labelBn: 'ডিজিটাল পেপারলেস অর্জন',
    value: '100%',
    valueBn: '১০০%',
    description: 'E-transcripts & multi-office clearance',
    descriptionBn: 'অনলাইন মার্কশিট ও সনদ যাচাই'
  },
  {
    id: 'campusArea',
    label: 'Campus Acreage',
    labelBn: 'ক্যাম্পাস আয়তন',
    value: '50 Acres',
    valueBn: '৫০ একর',
    description: 'Lush scientific campus at Jamalpur-2012',
    descriptionBn: 'জামালপুর-২০১২ আধুনিক ক্যাম্পাস'
  }
];

export const eventsData: UniversityEvent[] = [
  {
    id: 'evt-01',
    title: 'International Conference on Smart Computing & Applied Technologies (ICSCAT 2026)',
    titleBn: 'স্মার্ট কম্পিউটিং ও ফলিত প্রযুক্তি বিষয়ক আন্তর্জাতিক সম্মেলন ২০২৬',
    date: '2026-11-14',
    time: '09:00 AM - 05:00 PM',
    timeBn: 'সকাল ৯:০০ - বিকাল ৫:০০',
    location: 'JSTU Central Auditorium & Virtual Rooms',
    locationBn: 'জেএসটিইউ কেন্দ্রীয় অডিটোরিয়াম ও ভার্চুয়াল রুম',
    category: 'Conference',
    description: 'Flagship academic symposium uniting international computing researchers, IEEE fellows, and tech innovators in Jamalpur.',
    descriptionBn: 'বিশ্ববিখ্যাত গবেষক ও প্রযুক্তিবিদদের সমন্বয়ে জেএসটিইউ আয়োজিত আন্তর্জাতিক গবেষণা সম্মেলন।',
    organizer: 'Faculty of Engineering & CSE Dept'
  },
  {
    id: 'evt-02',
    title: 'Hands-on Workshop: Outcome-Based Education (OBE) & Digital Rubrics',
    titleBn: 'কর্মশালা: আউটকাম-বেসড শিক্ষা (ওবিই) ও ডিজিটাল গ্রেডিং মূল্যায়ন',
    date: '2026-10-20',
    time: '10:00 AM - 01:30 PM',
    timeBn: 'সকাল ১০:০০ - দুপুর ১:৩০',
    location: 'IQAC Seminar Hall, Level 3',
    locationBn: 'আইকিউএসি সেমিনার হল, লেভেল ৩',
    category: 'Workshop',
    description: 'Professional development session for JSTU faculty members on automated grade mapping and continuous evaluation.',
    descriptionBn: 'শিক্ষকদের জন্য ওবিই মূল্যায়ন পদ্ধতি ও পোর্টালের স্বয়ংক্রিয় মার্কস ম্যাপিং বিষয়ক প্রশিক্ষণ।',
    organizer: 'Institutional Quality Assurance Cell (IQAC)'
  },
  {
    id: 'evt-03',
    title: 'Brahmaputra Riverine Basin Conservation Forum',
    titleBn: 'ব্রহ্মপুত্র অববাহিকা পরিবেশ ও মৎস্য সংরক্ষণ আলোচনা',
    date: '2026-11-05',
    time: '11:00 AM - 03:00 PM',
    timeBn: 'সকাল ১১:০০ - দুপুর ৩:০০',
    location: 'Senate Hall, Administrative Building',
    locationBn: 'সিনেট হল, প্রশাসনিক ভবন',
    category: 'Seminar',
    description: 'Interdisciplinary ecological forum examining river sedimentation, indigenous fish breeding, and flood resilient agriculture.',
    descriptionBn: 'নদীর পলি প্রবাহ, দেশীয় মাছের প্রজনন এবং টেকসই জলবায়ু সহনশীল কৃষি বিষয়ক বিশেষ সেমিনার।',
    organizer: 'Faculty of Agriculture & Fisheries Dept'
  }
];

export const researchClustersData: ResearchCluster[] = [
  {
    id: 'cluster-ai',
    title: 'Intelligent Systems & Edge Computing',
    titleBn: 'ইন্টেলিজেন্ট সিস্টেম ও এজ কম্পিউটিং',
    leadDepartment: 'Computer Science & Engineering',
    leadFaculty: 'Faculty of Engineering',
    description: 'Focusing on low-resource Bangla NLP, automated medical image segmentation, precision agriculture sensors, and privacy-preserving federated machine learning.',
    descriptionBn: 'বাংলা প্রাকৃতিক ভাষা প্রক্রিয়াকরণ (NLP), টেলিমেডিসিন ইমেজ বিশ্লেষণ এবং সেন্সর প্রযুক্তিতে গবেষণা।',
    ongoingProjects: 8,
    publicationsCount: 34
  },
  {
    id: 'cluster-energy',
    title: 'Renewable Microgrids & Smart Power',
    titleBn: 'নবায়নযোগ্য মাইক্রোগ্রিড ও আধুনিক বিদ্যুৎ প্রযুক্তি',
    leadDepartment: 'Electrical & Electronic Engineering',
    leadFaculty: 'Faculty of Engineering',
    description: 'Developing high-efficiency solar inverters, battery management systems for electric rural transport, and automated fault diagnosis in grid nodes.',
    descriptionBn: 'সৌর বিদ্যুৎ ইনভার্টার, গ্রামীণ পরিবহন ব্যাটারি সিস্টেম ও গ্রিড সুরক্ষা নিয়ে কাজ করছে।',
    ongoingProjects: 6,
    publicationsCount: 22
  },
  {
    id: 'cluster-aquatic',
    title: 'Aquatic Biodiversity & Riverine Ecology',
    titleBn: 'জলজ জীববৈচিত্র্য ও নদী অববাহিকা বাস্তুতন্ত্র',
    leadDepartment: 'Fisheries & Geology',
    leadFaculty: 'Faculty of Agriculture & Life Science',
    description: 'Documenting fish genomics of the Old Brahmaputra, assessing arsenic in groundwater aquifers, and developing non-toxic fish feeds.',
    descriptionBn: 'ব্রহ্মপুত্র নদীর মাছের জিনোম সিকোয়েন্সিং, ভূগর্ভস্থ আর্সেনিক ম্যাপিং ও পরিবেশবান্ধব খাদ্য উদ্ভাবন।',
    ongoingProjects: 5,
    publicationsCount: 19
  }
];

export const careerOpeningsData: CareerOpening[] = [
  {
    id: 'car-2026-01',
    title: 'Professor / Associate Professor (Computer Science & Engineering)',
    titleBn: 'অধ্যাপক / সহযোগী অধ্যাপক (সিএসই বিভাগ)',
    type: 'Faculty',
    departmentOrOffice: 'Department of CSE',
    deadline: '2026-11-15',
    deadlineBn: '১৫ নভেম্বর ২০২৬',
    circularNo: 'JSTU/REG/EST-1/2026/04',
    vacancyCount: 2,
    status: 'Open'
  },
  {
    id: 'car-2026-02',
    title: 'Lecturer in Mathematics (Pure / Applied Mathematics)',
    titleBn: 'প্রভাষক (গণিত বিভাগ)',
    type: 'Faculty',
    departmentOrOffice: 'Department of Mathematics',
    deadline: '2026-11-15',
    deadlineBn: '১৫ নভেম্বর ২০২৬',
    circularNo: 'JSTU/REG/EST-1/2026/05',
    vacancyCount: 2,
    status: 'Open'
  },
  {
    id: 'car-2026-03',
    title: 'Network & Security Engineer (ICT Cell)',
    titleBn: 'নেটওয়ার্ক অ্যান্ড সিকিউরিটি ইঞ্জিনিয়ার (আইসিটি সেল)',
    type: 'Officer',
    departmentOrOffice: 'ICT Cell',
    deadline: '2026-11-05',
    deadlineBn: '৫ নভেম্বর ২০২৬',
    circularNo: 'JSTU/REG/EST-2/2026/12',
    vacancyCount: 1,
    status: 'Open'
  }
];

export const faqItemsData: FAQItem[] = [
  {
    question: 'How does JSTU Smart Campus ensure paperless university governance?',
    questionBn: 'জেএসটিইউ স্মার্ট ক্যাম্পাস কীভাবে কাগজবিহীন বিশ্ববিদ্যালয় প্রশাসন নিশ্চিত করে?',
    answer: 'All routine administrative workflows—including semester course registration, continuous marks entry, departmental scrutiny, graduation clearances, and degree requests—are executed digitally with immutable server-authoritative audit logs and state machines.',
    answerBn: 'সেমিস্টার কোর্স নিবন্ধন, পরীক্ষা মার্কস এন্ট্রি, ফলাফল যাচাই, চার স্তরের ছাড়পত্র এবং সনদপত্র অনুমোদন সম্পূর্ণ অনলাইনে সংরক্ষিত ও সার্ভার-সাইড ভ্যালিডেশনে পরিচালিত হয়।',
    category: 'General'
  },
  {
    question: 'How can an employer or overseas university verify a JSTU certificate or transcript?',
    questionBn: 'কোনো প্রতিষ্ঠান কীভাবে জেএসটিইউ-এর সনদ বা গ্রেডশিট অনলাইনে যাচাই করতে পারবে?',
    answer: 'Every official document issued by JSTU contains an individual cryptographic QR code and unique document ID. Anyone can visit https://jstu.ac.bd/verify and enter the document ID or scan the QR code to view authenticated minimal public proof without delay.',
    answerBn: 'প্রত্যেক মূল সনদে একটি অনন্য কিউআর কোড থাকে। https://jstu.ac.bd/verify লিংকে গিয়ে কোডটি প্রবেশ করিয়ে অথবা কিউআর স্ক্যান করে মুহূর্তের মধ্যে প্রাতিষ্ঠানিক সত্যতা নিশ্চিত করা যায়।',
    category: 'Verification'
  },
  {
    question: 'What is the grading policy followed at JSTU?',
    questionBn: 'জেএসটিইউ-তে গ্রেডিং নীতি কীভাবে নির্ধারিত হয়?',
    answer: 'JSTU follows the standardized 4.00-scale GPA/CGPA system recommended by the University Grants Commission (UGC) of Bangladesh. Continuous assessment carries 30% and the semester final examination carries 70% of total marks.',
    answerBn: 'বিশ্ববিদ্যালয় মঞ্জুরি কমিশন (ইউজিসি)-এর ৪.০০ স্কেল অনুসরণ করা হয়। যেখানে ক্লাস টেস্ট/উপস্থিতি (৩০%) এবং সেমিস্টার ফাইনাল পরীক্ষা (৭০%) হিসেবে মূল্যায়িত হয়।',
    category: 'Security'
  }
];

// ============================================================================
// University News & Press Releases
// /* [REPLACE WITH REAL CONTENT] Official University Press Releases & Announcements */
// ============================================================================
export const universityNewsData: UniversityNewsItem[] = [
  {
    id: 'news-1',
    title: 'JSTU Deploys Campus-Wide High-Speed Fiber Backbone & Cloud Infrastructure',
    titleBn: 'জেএসটিইউ ক্যাম্পাসে উচ্চগতির অপটিক্যাল ফাইবার ব্যাকবোন ও ক্লাউড অবকাঠামো চালু',
    category: 'Campus Technology',
    categoryBn: 'ক্যাম্পাস প্রযুক্তি',
    date: '2026-10-04',
    dateBn: '৪ অক্টোবর ২০২৬',
    summary: 'The ICT Cell has successfully commissioned high-speed optical fiber connectivity connecting all 7 academic departments, administrative buildings, and laboratories.',
    summaryBn: 'আইসিটি সেলের উদ্যোগে সকল একাডেমিক বিভাগ, প্রশাসনিক ভবন ও ল্যাবরেটরিকে যুক্ত করে উচ্চগতির অপটিক্যাল ফাইবার সংযোগ নেটওয়ার্ক সক্রিয় করা হয়েছে।',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read',
    readTimeBn: '৩ মিনিট পড়া'
  },
  {
    id: 'news-2',
    title: 'Research Grant Awarded for Brahmaputra River Basin Aquatic Ecology Project',
    titleBn: 'ব্রহ্মপুত্র নদীর অববাহিকায় জলজ বাস্তুতন্ত্র গবেষণায় জাতীয় গবেষণা অনুদান অর্জন',
    category: 'Scientific Research',
    categoryBn: 'বৈজ্ঞানিক গবেষণা',
    date: '2026-09-28',
    dateBn: '২৮ সেপ্টেম্বর ২০২৬',
    summary: 'Faculty members from Fisheries and Environmental Sciences have secured a collaborative grant to study seasonal biodiversity trends along the Old Brahmaputra riverbed.',
    summaryBn: 'ফিশারিজ ও পরিবেশ বিজ্ঞান বিভাগের যৌথ গবেষক দল পুরাতন ব্রহ্মপুত্র নদী অববাহিকার জীববৈচিত্র্য সংরক্ষণে জাতীয় গবেষণা অনুদান লাভ করেছে।',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    readTimeBn: '৪ মিনিট পড়া'
  },
  {
    id: 'news-3',
    title: 'Central Digital Library Expands E-Journal Access with Over 50,000 Peer-Reviewed Titles',
    titleBn: 'জেএসটিইউ কেন্দ্রীয় ডিজিটাল লাইব্রেরিতে ৫০,০০০ এর অধিক আন্তর্জাতিক ই-জার্নাল সংযোজন',
    category: 'Academic Resources',
    categoryBn: 'একাডেমিক সম্পদ',
    date: '2026-09-15',
    dateBn: '১৫ সেপ্টেম্বর ২০২৬',
    summary: 'Researchers and students can now access premier international scientific publishers directly via institutional authentication and remote proxy access.',
    summaryBn: 'শিক্ষক-শিক্ষার্থীরা এখন প্রাতিষ্ঠানিক প্রক্সি ও দূরবর্তী অ্যাকাউন্টের মাধ্যমে বিশ্বমানের বিজ্ঞান সাময়িকী সরাসরি পাঠ ও ডাউনলোড করতে পারছেন।',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    readTime: '2 min read',
    readTimeBn: '২ মিনিট পড়া'
  },
  {
    id: 'news-4',
    title: 'National Robotics & Coding Hackathon 2026 Scheduled at JSTU Auditorium',
    titleBn: 'জেএসটিইউ অডিটোরিয়ামে জাতীয় রোবটিক্স ও কোডিং হ্যাকাথন ২০২৬ আয়োজিত হতে যাচ্ছে',
    category: 'Innovation & Youth',
    categoryBn: 'উদ্ভাবন ও যুব নেতৃত্ব',
    date: '2026-08-30',
    dateBn: '৩০ আগস্ট ২০২৬',
    summary: 'Undergraduate engineering teams from across the nation will converge on Jamalpur to develop AI-driven public service automation solutions.',
    summaryBn: 'সারাদেশের স্নাতক প্রকৌশল শিক্ষার্থীদের অংশগ্রহণে কৃত্রিম বুদ্ধিমত্তা ও জনসেবা স্বয়ংক্রিয়করণের ওপর তিন দিনব্যাপী হ্যাকাথন অনুষ্ঠিত হবে।',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read',
    readTimeBn: '৩ মিনিট পড়া'
  }
];

// ============================================================================
// Campus Photo Gallery Strip
// /* [REPLACE WITH REAL CONTENT] Campus Photographic Showcase (Use verified JSTU campus photos) */
// ============================================================================
export const photoGalleryData: PhotoGalleryItem[] = [
  {
    id: 'gallery-1',
    title: 'Academic & Administrative Complex',
    titleBn: 'একাডেমিক ও প্রশাসনিক ভবন কমপ্লেক্স',
    category: 'Architecture',
    categoryBn: 'স্থাপত্য',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    caption: 'Modern multistoried academic building housing departmental classrooms and administrative suites.',
    captionBn: 'আধুনিক বহুতল একাডেমিক ভবন যেখানে শ্রেণিকক্ষ ও প্রশাসনিক দপ্তরসমূহ অবস্থিত।'
  },
  {
    id: 'gallery-2',
    title: 'Central Library Study Commons',
    titleBn: 'কেন্দ্রীয় গ্রন্থাগার স্টাডি রিডিং হল',
    category: 'Academic Facility',
    categoryBn: 'শিক্ষা সুবিধা',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    caption: 'Spacious, well-lit reading commons with specialized digital catalog access and private research desks.',
    captionBn: 'ডিজিটাল ক্যাটালগ ও গবেষকদের নিরব অধ্যয়নের জন্য সুপরিসর পাঠকক্ষ।'
  },
  {
    id: 'gallery-3',
    title: 'Computer Science & Software Engineering Labs',
    titleBn: 'কম্পিউটার সায়েন্স ও সফটওয়্যার ল্যাবরেটরি',
    category: 'Laboratory',
    categoryBn: 'গবেষণাগার',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    caption: 'Equipped with gigabit connectivity, AI workstations, and high-performance server clusters.',
    captionBn: 'উচ্চগতির গিগাবিট নেটওয়ার্ক ও আধুনিক ওয়ার্কস্টেশন সম্বলিত ল্যাবরেটরি।'
  },
  {
    id: 'gallery-4',
    title: 'Scenic Campus Walkway & Green Landscape',
    titleBn: 'সবুজ ক্যাম্পাস চত্বর ও মনোরম ওয়াকওয়ে',
    category: 'Campus Grounds',
    categoryBn: 'প্রাকৃতিক প্রাঙ্গণ',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    caption: 'Pedestrian-friendly green botanical pathways connecting academic zones and student recreation.',
    captionBn: '৫০ একর সবুজ ক্যাম্পাস ও বৃক্ষশোভিত পরিবেশবান্ধব ওয়াকওয়ে।'
  },
  {
    id: 'gallery-5',
    title: 'Applied Science & Analytical Instrumentation',
    titleBn: 'ফলিত বিজ্ঞান ও রাসায়নিক অ্যানালাইটিক্যাল ল্যাব',
    category: 'Research Facility',
    categoryBn: 'গবেষণা সুবিধা',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    caption: 'Precision laboratory glassware and analytical spectroscopy instrumentation.',
    captionBn: 'উন্নত গবেষণার জন্য আধুনিক যন্ত্রপাতি ও ল্যাবরেটরি সুবিধা।'
  },
  {
    id: 'gallery-6',
    title: 'Evening Academic Quadrangles & Pavilions',
    titleBn: 'সান্ধ্য ক্যাম্পাস চত্বর ও আলোকোজ্জ্বল প্রাঙ্গণ',
    category: 'Campus Grounds',
    categoryBn: 'ক্যাম্পাস দৃশ্য',
    imageUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1200&q=80',
    caption: 'Serene evening atmosphere encouraging collaborative student study circles.',
    captionBn: 'শিক্ষার্থীদের জ্ঞানচর্চা ও মুক্ত আলোচনার জন্য মনোরম সান্ধ্য চত্বর।'
  }
];

// ============================================================================
// University Leadership & Statutory Authorities
// /* [REPLACE WITH REAL CONTENT] Placeholder institutional authorities - replace with gazetted university officers */
// ============================================================================
export const universityAuthoritiesData: UniversityAuthority[] = [
  {
    id: 'auth-vc',
    roleKey: 'vc',
    roleTitle: 'Vice Chancellor',
    roleTitleBn: 'উপাচার্য',
    name: 'Prof. Dr. [REPLACE WITH REAL NAME]',
    nameBn: 'অধ্যাপক ড. [প্রকৃত নাম প্রদান করুন]',
    designation: 'Vice Chancellor, Jamalpur Science & Technology University',
    designationBn: 'উপাচার্য, জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়',
    email: 'vc@jstu.ac.bd',
    phone: '+880 29977 12340',
    officeLocation: 'Vice Chancellor Suite, Level 4, Administrative Building',
    officeLocationBn: 'উপাচার্য কার্যালয়, ৪র্থ তলা, প্রশাসনিক ভবন',
    avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    profileBio: 'Distinguished academician and researcher with over three decades of leadership in higher education, curriculum reform, and science policy in Bangladesh.',
    profileBioBn: 'তিন দশকের অভিজ্ঞতাসম্পন্ন শিক্ষাবিদ ও গবেষক, যিনি উচ্চশিক্ষা রূপান্তর, গবেষণা নীতি ও বিশ্ববিদ্যালয় প্রশাসনে নেতৃত্ব দিয়ে আসছেন।',
    speech: 'Welcome to Jamalpur Science & Technology University. As a premier public institution of higher learning, JSTU is dedicated to fostering frontier scientific inquiry, ethical leadership, and paperless administrative efficiency. Our commitment is to prepare students to solve critical global and regional challenges with knowledge, technological competence, and integrity.',
    speechBn: 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ে আপনাকে স্বাগতম। একটি আধুনিক সরকারি বিজ্ঞান বিশ্ববিদ্যালয় হিসেবে জেএসটিইউ আন্তর্জাতিক মানের শিক্ষা, উদ্ভাবনী গবেষণা ও সম্পূর্ণ পেপারলেস প্রশাসনিক সেবায় অঙ্গীকারবদ্ধ। আমাদের লক্ষ্য এমন দক্ষ গ্র্যাজুয়েট তৈরি করা যারা সততা, মানবিক মূল্যবোধ ও বিজ্ঞানমনস্কতায় সমাজ ও দেশের সেবায় নিয়োজিত থাকবে।'
  },
  {
    id: 'auth-provc',
    roleKey: 'provc',
    roleTitle: 'Pro-Vice Chancellor',
    roleTitleBn: 'উপ-উপাচার্য',
    name: 'Prof. Dr. [REPLACE WITH REAL NAME]',
    nameBn: 'অধ্যাপক ড. [প্রকৃত নাম প্রদান করুন]',
    designation: 'Pro-Vice Chancellor (Academic), JSTU',
    designationBn: 'উপ-উপাচার্য (একাডেমিক), জেএসটিইউ',
    email: 'provc@jstu.ac.bd',
    phone: '+880 29977 12341',
    officeLocation: 'Pro-VC Office, Level 4, Administrative Building',
    officeLocationBn: 'উপ-উপাচার্য কার্যালয়, ৪র্থ তলা, প্রশাসনিক ভবন',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    profileBio: 'Leading researcher in applied engineering and accreditation standards, overseeing academic affairs, syllabus modernization, and interdisciplinary collaboration.',
    profileBioBn: 'ফলিত প্রকৌশল বিশেষজ্ঞ, যিনি বিশ্ববিদ্যালয়ের একাডেমিক মান নিশ্চিতকরণ, আধুনিক কারিকুলাম ও আন্তঃবিভাগীয় গবেষণা সমন্বয়ে নেতৃত্ব দেন।'
  },
  {
    id: 'auth-treasurer',
    roleKey: 'treasurer',
    roleTitle: 'Treasurer',
    roleTitleBn: 'ট্রেজারার',
    name: 'Prof. [REPLACE WITH REAL NAME]',
    nameBn: 'অধ্যাপক [প্রকৃত নাম প্রদান করুন]',
    designation: 'Treasurer, JSTU',
    designationBn: 'ট্রেজারার, জেএসটিইউ',
    email: 'treasurer@jstu.ac.bd',
    phone: '+880 29977 12342',
    officeLocation: 'Treasurer Office, Level 3, Administrative Building',
    officeLocationBn: 'ট্রেজারার কার্যালয়, ৩য় তলা, প্রশাসনিক ভবন',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    profileBio: 'Financial scholar and administrator overseeing statutory budget management, development project allocations, and UGC fiscal governance.',
    profileBioBn: 'আর্থিক নীতি ও বাজেট ব্যবস্থাপনা বিশেষজ্ঞ, যিনি প্রাতিষ্ঠানিক উন্নয়ন তহবিল এবং স্বচ্ছ নিরীক্ষা কার্যক্রমে দায়িত্বরত।'
  },
  {
    id: 'auth-registrar',
    roleKey: 'registrar',
    roleTitle: 'Registrar',
    roleTitleBn: 'রেজিস্ট্রার',
    name: '[REPLACE WITH REAL NAME]',
    nameBn: '[প্রকৃত নাম প্রদান করুন]',
    designation: 'Registrar (In-Charge), JSTU',
    designationBn: 'রেজিস্ট্রার (ভারপ্রাপ্ত), জেএসটিইউ',
    email: 'registrar@jstu.ac.bd',
    phone: '+880 29977 12343',
    officeLocation: 'Registrar Directorate, Level 2, Administrative Building',
    officeLocationBn: 'রেজিস্ট্রার দপ্তর, ২য় তলা, প্রশাসনিক ভবন',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    profileBio: 'Senior statutory administrator leading university secretarial affairs, academic records, digital verification ledger, and personnel management.',
    profileBioBn: 'বিশ্ববিদ্যালয়ের কেন্দ্রীয় প্রশাসনিক রেকর্ড, একাডেমিক কাউন্সিল সচিবালয় ও ডিজিটাল সেবা পরিচালনায় দায়িত্বরত কর্মকর্তা।'
  }
];

// ============================================================================
// Citizen's Charter (নাগরিক সনদ) - Service Delivery Standards
// /* [REPLACE WITH REAL CONTENT] Official Citizen's Charter Service Schedules */
// ============================================================================
export const citizensCharterData: CitizensCharterService[] = [
  {
    slNo: 1,
    serviceName: 'Official Academic Transcript (Provisional & Final)',
    serviceNameBn: 'অফিসিয়াল একাডেমিক ট্রান্সক্রিপ্ট প্রদান',
    serviceType: 'Academic Certification',
    serviceTypeBn: 'একাডেমিক সনদ সেবা',
    responsibleOffice: 'Office of the Controller of Examinations',
    responsibleOfficeBn: 'পরীক্ষা নিয়ন্ত্রক দপ্তর',
    deliveryTime: '3-5 Working Days',
    deliveryTimeBn: '৩-৫ কর্মদিবস',
    feeAmount: 'BDT 500 (Regular) / BDT 1000 (Urgent)',
    feeAmountBn: '৫০০ টাকা (নিয়মিত) / ১০০০ টাকা (জরুরি)',
    procedure: 'Online portal request -> Department scrutiny -> Accounts clearance -> Digital signature -> Collect with QR verification',
    procedureBn: 'অনলাইন পোর্টালে আবেদন -> বিভাগীয় যাচাই -> হিসাব ছাড়পত্র -> ডিজিটাল স্বাক্ষর -> কিউআর কোডসহ সরবরাহ'
  },
  {
    slNo: 2,
    serviceName: 'Provisional Degree Certificate',
    serviceNameBn: 'সাময়িক সনদপত্র (Provisional Certificate) প্রদান',
    serviceType: 'Degree Issue',
    serviceTypeBn: 'ডিগ্রি প্রদান সেবা',
    responsibleOffice: 'Office of the Controller of Examinations',
    responsibleOfficeBn: 'পরীক্ষা নিয়ন্ত্রক দপ্তর',
    deliveryTime: '5-7 Working Days',
    deliveryTimeBn: '৫-৭ কর্মদিবস',
    feeAmount: 'BDT 800',
    feeAmountBn: '৮০০ টাকা',
    procedure: 'Submit four-stage digital clearance -> Exam controller audit -> Signed cryptographic generation',
    procedureBn: 'অনলাইনে চার স্তরের ছাড়পত্র প্রদান -> কন্ট্রোলার অডিট -> সুরক্ষিত ডিজিটাল সনদ তৈরি'
  },
  {
    slNo: 3,
    serviceName: 'Character & Conduct Testimonial',
    serviceNameBn: 'প্রশংসাপত্র (Testimonial) প্রদান',
    serviceType: 'Departmental Certification',
    serviceTypeBn: 'বিভাগীয় প্রত্যয়ন',
    responsibleOffice: 'Respective Department Office / Chairman',
    responsibleOfficeBn: 'সংশ্লিষ্ট বিভাগীয় চেয়ারম্যানের কার্যালয়',
    deliveryTime: '2-3 Working Days',
    deliveryTimeBn: '২-৩ কর্মদিবস',
    feeAmount: 'BDT 200',
    feeAmountBn: '২০০ টাকা',
    procedure: 'Submit application via Student Portal -> Chairman digital approval -> QR verified certificate issued',
    procedureBn: 'শিক্ষার্থী পোর্টালে আবেদন -> চেয়ারম্যানের ডিজিটাল অনুমোদন -> কিউআর প্রত্যয়ন ডাউনলোড'
  },
  {
    slNo: 4,
    serviceName: 'Semester Final Admit Card Generation',
    serviceNameBn: 'সেমিস্টার ফাইনাল পরীক্ষার প্রবেশপত্র সংগ্রহ',
    serviceType: 'Examination Access',
    serviceTypeBn: 'পরীক্ষা সংক্রান্ত',
    responsibleOffice: 'Controller of Examinations & Respective Departments',
    responsibleOfficeBn: 'পরীক্ষা নিয়ন্ত্রক দপ্তর ও বিভাগসমূহ',
    deliveryTime: 'Instant (Automated Online Download)',
    deliveryTimeBn: 'তাত্ক্ষণিক (স্বয়ংক্রিয় অনলাইন ডাউনলোড)',
    feeAmount: 'No additional fee (included in semester exam fee)',
    feeAmountBn: 'কোনো অতিরিক্ত ফি নেই (সেমিস্টার ফির অন্তর্ভুক্ত)',
    procedure: 'Complete fee payment & 75% attendance criteria -> Download PDF admit card from Student Portal',
    procedureBn: 'ফি পরিশোধ ও ৭৫% উপস্থিতি সম্পন্ন সাপেক্ষে শিক্ষার্থী পোর্টাল থেকে তাৎক্ষণিক প্রিন্ট'
  },
  {
    slNo: 5,
    serviceName: 'Student Identity Card Replacement (Lost/Damaged)',
    serviceNameBn: 'শিক্ষার্থী পরিচয়পত্র পুনঃইস্যু (হারানো/নষ্ট)',
    serviceType: 'Identity Services',
    serviceTypeBn: 'পরিচয়পত্র সেবা',
    responsibleOffice: 'Office of the Registrar',
    responsibleOfficeBn: 'রেজিস্ট্রার দপ্তর',
    deliveryTime: '5 Working Days',
    deliveryTimeBn: '৫ কর্মদিবস',
    feeAmount: 'BDT 300',
    feeAmountBn: '৩০০ টাকা',
    procedure: 'Police GD record upload -> Online fee payment -> Biometric smart ID card reprinted',
    procedureBn: 'থানার জিডি কপি আপলোড -> অনলাইন ফি পরিশোধ -> নতুন আইডি কার্ড ইস্যু'
  },
  {
    slNo: 6,
    serviceName: 'Online Document Verification for Employers/Embassies',
    serviceNameBn: 'চাকরিদাতা বা দূতাবাস কর্তৃক অনলাইন সনদ যাচাইকরণ',
    serviceType: 'Public Integrity Ledger',
    serviceTypeBn: 'পাবলিক ভেরিফিকেশন',
    responsibleOffice: 'ICT Cell & Registrar Office',
    responsibleOfficeBn: 'আইসিটি সেল ও রেজিস্ট্রার দপ্তর',
    deliveryTime: 'Instant (24/7 Real-Time Online Portal)',
    deliveryTimeBn: 'তাত্ক্ষণিক (২৪/৭ রিয়েল-টাইম অনলাইন)',
    feeAmount: 'Free (Public Security Registry)',
    feeAmountBn: 'বিনামূল্যে (পাবলিক রেজিস্ট্রি সেবা)',
    procedure: 'Visit https://jstu.ac.bd/verify -> Enter 32-character Document ID or scan QR code',
    procedureBn: 'https://jstu.ac.bd/verify লিংকে প্রবেশ -> ৩২ অক্ষরের আইডি অথবা কিউআর কোড স্ক্যান'
  },
  {
    slNo: 7,
    serviceName: 'Course Syllabus Attestation for Credit Transfer / Overseas Study',
    serviceNameBn: 'বিদেশে উচ্চশিক্ষার জন্য কোর্স সিলেবাস সত্যায়ন',
    serviceType: 'Academic Attestation',
    serviceTypeBn: 'একাডেমিক সত্যায়ন',
    responsibleOffice: 'Respective Department & Academic Council Secretariat',
    responsibleOfficeBn: 'সংশ্লিষ্ট বিভাগ ও একাডেমিক কাউন্সিল সচিবালয়',
    deliveryTime: '4 Working Days',
    deliveryTimeBn: '৪ কর্মদিবস',
    feeAmount: 'BDT 500 per syllabus',
    feeAmountBn: '৫০০ টাকা (প্রতি সিলেবাস)',
    procedure: 'Apply through Student Portal -> Department verifies course curriculum code -> Official sealed PDF generated',
    procedureBn: 'পোর্টালের মাধ্যমে আবেদন -> বিভাগ কর্তৃক সিলেবাস যাচাই -> সিলমোহরযুক্ত অফিসিয়াল কপি প্রদান'
  },
  {
    slNo: 8,
    serviceName: 'University Migration Certificate',
    serviceNameBn: 'বিশ্ববিদ্যালয় মাইগ্রেশন সনদপত্র প্রদান',
    serviceType: 'Registration Services',
    serviceTypeBn: 'রেজিস্ট্রেশন সেবা',
    responsibleOffice: 'Office of the Registrar',
    responsibleOfficeBn: 'রেজিস্ট্রার দপ্তর',
    deliveryTime: '5-7 Working Days',
    deliveryTimeBn: '৫-৭ কর্মদিবস',
    feeAmount: 'BDT 500',
    feeAmountBn: '৫০০ টাকা',
    procedure: 'Institutional clearance -> Surrender original registration card -> Collect official migration paper',
    procedureBn: 'প্রাতিষ্ঠানিক ছাড়পত্র -> রেজিস্ট্রেশন কার্ড জমা -> মাইগ্রেশন সনদ সংগ্রহ'
  }
];

// ============================================================================
// University Governance Organogram Structure
// /* [REPLACE WITH REAL CONTENT] Statutory University Governance Organogram */
// ============================================================================
export const organogramData = {
  chancellor: {
    title: 'Chancellor',
    titleBn: 'চ্যান্সেলর',
    holder: 'Hon’ble President of the People’s Republic of Bangladesh',
    holderBn: 'গণপ্রজাতন্ত্রী বাংলাদেশের মহামান্য রাষ্ট্রপতি',
    description: 'Supreme statutory head of the University under the Jamalpur Science & Technology University Act.',
    descriptionBn: 'বিশ্ববিদ্যালয় আইনের অধীনে সর্বোচ্চ বিধিবদ্ধ প্রধান।'
  },
  chiefExecutive: {
    title: 'Vice Chancellor',
    titleBn: 'উপাচার্য',
    holder: 'Prof. Dr. [REPLACE WITH REAL NAME]',
    holderBn: 'অধ্যাপক ড. [প্রকৃত নাম প্রদান করুন]',
    description: 'Principal academic and executive officer of the university.',
    descriptionBn: 'বিশ্ববিদ্যালয়ের প্রধান নির্বাহী ও একাডেমিক কর্মকর্তা।'
  },
  statutoryBodies: [
    {
      title: 'Syndicate',
      titleBn: 'সিন্ডিকেট',
      role: 'Highest Executive Body',
      roleBn: 'সর্বোচ্চ নির্বাহী পর্ষদ',
      desc: 'Formulates university statutes, sanctions senior appointments, approves annual budget, and governs property.',
      descBn: 'আইন প্রণয়ন, নিয়োগ অনুমোদন, বার্ষিক বাজেট ও নীতি নির্ধারণী সর্বোচ্চ কর্তৃপক্ষ।'
    },
    {
      title: 'Academic Council',
      titleBn: 'একাডেমিক কাউন্সিল',
      role: 'Principal Academic Authority',
      roleBn: 'প্রধান একাডেমিক কর্তৃপক্ষ',
      desc: 'Controls teaching, curricula, examinations, degree conferral, and research standards across all faculties.',
      descBn: 'পাঠ্যক্রম, পরীক্ষা, ডিগ্রি প্রদান ও গবেষণার মান নিয়ন্ত্রক সর্বোচ্চ পর্ষদ।'
    },
    {
      title: 'Finance Committee',
      titleBn: 'অর্থ কমিটি',
      role: 'Fiscal Governance',
      roleBn: 'আর্থিক ব্যবস্থাপনা',
      desc: 'Oversees financial standing, audits, and presents the annual university budget for Syndicate sanction.',
      descBn: 'আর্থিক হিসাব নিরীক্ষা ও বার্ষিক বাজেট প্রস্তাব প্রণয়নকারী কমিটি।'
    },
    {
      title: 'Planning & Development Committee',
      titleBn: 'পরিকল্পনা ও উন্নয়ন কমিটি',
      role: 'Campus Expansion',
      roleBn: 'অবকাঠামো উন্নয়ন',
      desc: 'Directs physical master planning, research pavilions, architectural expansion, and procurement.',
      descBn: 'ক্যাম্পাসের মাস্টারপ্ল্যান ও অবকাঠামোগত উন্নয়ন প্রকল্প বাস্তবায়ন।'
    }
  ],
  academicWings: [
    { faculty: 'Faculty of Engineering', depts: ['CSE', 'EEE', 'SW'] },
    { faculty: 'Faculty of Science', depts: ['Mathematics', 'Geology & Mining'] },
    { faculty: 'Faculty of Agriculture & Life Science', depts: ['Fisheries'] },
    { faculty: 'Faculty of Business Studies', depts: ['Management'] }
  ]
};

