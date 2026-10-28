import {
  UniversityNewsArticle,
  UniversityEventItem,
  UniversityGalleryImage,
  UniversityDownloadItem,
  CareerTenderItem,
  ResearchPublication,
  JournalIssue,
  ResearchGrantScheme
} from '../types/publicSections';

// ============================================================================
// Public Sections Seed Data
// /* [REPLACE WITH REAL CONTENT] Official JSTU Institutional Database */
// ============================================================================

export const newsArticlesData: UniversityNewsArticle[] = [
  {
    id: 'news-1',
    title: 'JSTU Deploys Campus-Wide High-Speed Fiber Backbone & Cloud Infrastructure',
    titleBn: 'জেএসটিইউ ক্যাম্পাসে উচ্চগতির অপটিক্যাল ফাইবার ব্যাকবোন ও ক্লাউড অবকাঠামো চালু',
    category: 'Technology',
    categoryBn: 'প্রযুক্তি',
    date: '2026-10-04',
    dateBn: '৪ অক্টোবর ২০২৬',
    summary: 'The ICT Cell has successfully commissioned 10Gbps optical fiber connectivity connecting all 7 academic departments, administrative buildings, and laboratories.',
    summaryBn: 'আইসিটি সেলের উদ্যোগে সকল একাডেমিক বিভাগ, প্রশাসনিক ভবন ও ল্যাবরেটরিকে যুক্ত করে ১০ গিগাবিট অপটিক্যাল ফাইবার নেটওয়ার্ক সক্রিয় করা হয়েছে।',
    content: [
      'The Information and Communication Technology (ICT) Cell of JSTU has accomplished a major technological milestone by commissioning a resilient 10-Gigabit optical fiber backbone across the entire permanent campus.',
      'Under this expansion, all departmental computer labs, faculty rooms, smart classrooms, and residential halls have been provisioned with seamless gigabit Ethernet endpoints and Wi-Fi 6 coverage.',
      'Vice Chancellor Prof. Dr. [REPLACE VC NAME] inaugurated the central server room, highlighting that the modernized private cloud environment will host student records, continuous marks verification, and automated paperless clearance workflows with zero downtime.'
    ],
    contentBn: [
      'জেএসটিইউ আইসিটি সেল স্থায়ী ক্যাম্পাসে একটি আধুনিক ১০-গিগাবিট অপটিক্যাল ফাইবার ব্যাকবোন নেটওয়ার্ক সফলভাবে চালু করেছে।',
      'এই অবকাঠামোর আওতায় প্রতিটি বিভাগের কম্পিউটার ল্যাব, শ্রেণিকক্ষ, শিক্ষক লাউঞ্জ ও আবাসিক হলসমূহে ওয়াই-ফাই ৬ কভারেজ নিশ্চিত করা হয়েছে।',
      'উপাচার্য মহোদয় কেন্দ্রীয় সার্ভার রুমের উদ্বোধনকালে জানান, এই আধুনিক ক্লাউড অবকাঠামোর মাধ্যমে বিশ্ববিদ্যালয়ের পেপারলেস সেবা ও ডিজিটাল ট্রান্সক্রিপ্ট কার্যক্রম আরও দ্রুত পরিচালিত হবে।'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    author: 'Public Relations & ICT Directorate',
    readTime: '3 min read',
    readTimeBn: '৩ মিনিট পড়া',
    tags: ['Network', 'ICT', 'Infrastructure', 'Campus Tech'],
    featured: true
  },
  {
    id: 'news-2',
    title: 'National Research Grant Awarded for Brahmaputra River Basin Aquatic Ecology Project',
    titleBn: 'ব্রহ্মপুত্র নদীর অববাহিকায় জলজ বাস্তুতন্ত্র গবেষণায় জাতীয় গবেষণা অনুদান অর্জন',
    category: 'Research',
    categoryBn: 'গবেষণা',
    date: '2026-09-28',
    dateBn: '২৮ সেপ্টেম্বর ২০২৬',
    summary: 'Faculty members from Fisheries and Environmental Sciences have secured a collaborative BDT 4.5 million grant to study seasonal biodiversity trends along the Old Brahmaputra riverbed.',
    summaryBn: 'ফিশারিজ ও পরিবেশ বিজ্ঞান বিভাগের যৌথ গবেষক দল পুরাতন ব্রহ্মপুত্র নদী অববাহিকার জীববৈচিত্র্য সংরক্ষণে ৪৫ লাখ টাকার জাতীয় গবেষণা অনুদান লাভ করেছে।',
    content: [
      'A multi-disciplinary research team comprising faculty members from the Department of Fisheries & Marine Bioscience and the Department of Geology has been awarded a prestigious competitive research grant by the Ministry of Science and Technology.',
      'The three-year project, titled "Biomonitoring and Sustainable Aquaculture Governance in the Old Brahmaputra Basin," will establish seasonal water quality benchmarks, assess microplastic contamination in freshwater fish species, and develop community breeding protocols for endangered indigenous carps.',
      'Principal Investigator Dr. [REPLACE PI NAME] noted that findings will be openly shared with regional fisheries officers and local riverine communities.'
    ],
    contentBn: [
      'বিজ্ঞান ও প্রযুক্তি মন্ত্রণালয় কর্তৃক জেএসটিইউ ফিশারিজ ও ভূতত্ত্ব বিভাগের যৌথ গবেষক দলকে পুরাতন ব্রহ্মপুত্র নদী অববাহিকার জীববৈচিত্র্য নিয়ে গবেষণার জন্য অনুদান প্রদান করা হয়েছে।',
      'তিন বছর মেয়াদী এই প্রকল্পে নদীর পানির গুণমান, দেশীয় বিলুপ্তপ্রায় মাছের সংরক্ষণ এবং ক্ষুদ্র প্লাস্টিক কণার প্রভাব মূল্যায়ন করা হবে।',
      'প্রধান গবেষক জানান, গবেষণার ফলাফল আঞ্চলিক মৎস্য কর্মকর্তা ও স্থানীয় জেলেদের সাথে যৌথভাবে বাস্তবায়ন করা হবে।'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    author: 'Research & Innovation Cell',
    readTime: '4 min read',
    readTimeBn: '৪ মিনিট পড়া',
    tags: ['Fisheries', 'Ecology', 'Grant', 'Aquaculture'],
    featured: true
  },
  {
    id: 'news-3',
    title: 'Central Digital Library Expands E-Journal Access with Over 50,000 Peer-Reviewed Titles',
    titleBn: 'জেএসটিইউ কেন্দ্রীয় ডিজিটাল লাইব্রেরিতে ৫০,০০০ এর অধিক আন্তর্জাতিক ই-জার্নাল সংযোজন',
    category: 'Academic',
    categoryBn: 'একাডেমিক',
    date: '2026-09-15',
    dateBn: '১৫ সেপ্টেম্বর ২০২৬',
    summary: 'Researchers and students can now access premier international scientific publishers directly via institutional authentication and remote proxy access.',
    summaryBn: 'শিক্ষক-শিক্ষার্থীরা এখন প্রাতিষ্ঠানিক প্রক্সি ও দূরবর্তী অ্যাকাউন্টের মাধ্যমে বিশ্বমানের বিজ্ঞান সাময়িকী সরাসরি পাঠ ও ডাউনলোড করতে পারছেন।',
    content: [
      'The Central Library of JSTU has signed subscription consortia with international academic publishers, providing unhindered full-text access to IEEE Xplore, ScienceDirect, SpringerLink, and JSTOR.',
      'Both on-campus IP ranges and off-campus federated Single Sign-On (SSO) credentials will allow scholars to search literature, export citations, and download research monographs without paywalls.',
      'Chief Librarian [REPLACE LIBRARIAN NAME] mentioned that specialized bibliographic training workshops will commence next week for undergraduate final-year thesis students.'
    ],
    contentBn: [
      'জেএসটিইউ কেন্দ্রীয় লাইব্রেরি আইইইই এক্সপ্লোর, সায়েন্সডাইরেক্ট, স্প্রিঙ্গারলিংক এবং জেস্টোর কনসোর্টিয়ামে যুক্ত হয়েছে।',
      'ক্যাম্পাসের ওয়াই-ফাই নেটওয়ার্কের পাশাপাশি বাড়ি থেকেও প্রাতিষ্ঠানিক অ্যাকাউন্টের মাধ্যমে আন্তর্জাতিক গবেষণাপত্র ডাউনলোড করা যাবে।',
      'গ্রন্থাগারিক জানান, থিসিসরত স্নাতক ও স্নাতকোত্তর শিক্ষার্থীদের জন্য বিনামূল্যে রেফারেন্স ম্যানেজমেন্ট বিষয়ক কর্মশালা শুরু হতে যাচ্ছে।'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    author: 'Central Library Directorate',
    readTime: '2 min read',
    readTimeBn: '২ মিনিট পড়া',
    tags: ['Library', 'Journals', 'IEEE', 'Scholarship']
  },
  {
    id: 'news-4',
    title: 'National Robotics & Coding Hackathon 2026 Scheduled at JSTU Auditorium',
    titleBn: 'জেএসটিইউ অডিটোরিয়ামে জাতীয় রোবটিক্স ও কোডিং হ্যাকাথন ২০২৬ আয়োজিত হতে যাচ্ছে',
    category: 'Achievements',
    categoryBn: 'অর্জন ও প্রতিযোগিতা',
    date: '2026-08-30',
    dateBn: '৩০ আগস্ট ২০২৬',
    summary: 'Undergraduate engineering teams from across the nation will converge on Jamalpur to develop AI-driven public service automation solutions.',
    summaryBn: 'সারাদেশের স্নাতক প্রকৌশল শিক্ষার্থীদের অংশগ্রহণে কৃত্রিম বুদ্ধিমত্তা ও জনসেবা স্বয়ংক্রিয়করণের ওপর তিন দিনব্যাপী হ্যাকাথন অনুষ্ঠিত হবে।',
    content: [
      'The Department of Computer Science & Engineering in association with the JSTU Robotics Club is hosting the National Robotics & Coding Hackathon from November 20 to 22, 2026.',
      'Teams will tackle problem statements in three tracks: Autonomous Agricultural Drones, Embedded Disaster Early Warning Systems, and Natural Language Interfaces for Citizen Services.',
      'A prize pool of BDT 300,000 alongside industry incubation sponsorships will be awarded by leading national software and engineering conglomerates.'
    ],
    contentBn: [
      'কম্পিউটার সায়েন্স বিভাগ ও জেএসটিইউ রোবটিক্স ক্লাবের উদ্যোগে ২০-২২ নভেম্বর জাতীয় পর্যায়ের হ্যাকাথন অনুষ্ঠিত হতে যাচ্ছে।',
      'কৃষি ড্রোন, দুর্যোগ পূর্বাভাস ব্যবস্থা এবং বাংলা এনএলপি জনসেবা নিয়ে শিক্ষার্থীরা তাদের উদ্ভাবন প্রদর্শন করবেন।',
      'শীর্ষ বিজয়ী দলগুলোর জন্য ৩ লাখ টাকার আর্থিক পুরস্কার এবং শীর্ষস্থানীয় প্রযুক্তি প্রতিষ্ঠানে ইন্টার্নশিপের সুযোগ রয়েছে।'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    author: 'Department of CSE & Student Affairs',
    readTime: '3 min read',
    readTimeBn: '৩ মিনিট পড়া',
    tags: ['Robotics', 'Hackathon', 'CSE', 'Competition']
  },
  {
    id: 'news-5',
    title: 'Vice Chancellor Inaugurates New Multipurpose Sports Arena and Gymnasium',
    titleBn: 'উপাচার্য মহোদয় কর্তৃক আধুনিক বহুমুখী ক্রীড়া কমপ্লেক্স ও জিমনেসিয়াম উদ্বোধন',
    category: 'Campus Life',
    categoryBn: 'ক্যাম্পাস জীবন',
    date: '2026-08-14',
    dateBn: '১৪ আগস্ট ২০২৬',
    summary: 'State-of-the-art indoor badminton courts, table tennis arenas, and fitness amenities unveiled for students and faculty.',
    summaryBn: 'শিক্ষার্থী ও শিক্ষকদের শারীরিক সুস্থতা নিশ্চিতে ইনডোর ব্যাডমিন্টন কোর্ট, টেবিল টেনিস ও আধুনিক জিমনেসিয়াম চালু।',
    content: [
      'In a vibrant ceremony attended by departmental chairpersons and student representatives, the Vice Chancellor unveiled the newly built JSTU Central Gymnasium and Sports Complex.',
      'The facility features maple-wood indoor courts, hydraulic fitness machines, dedicated female fitness suites, and solar heating.',
      'Annual intra-university tournaments in cricket, football, and volleyball will commence next month across the newly leveled central sports grounds.'
    ],
    contentBn: [
      'বিশ্ববিদ্যালয়ের কেন্দ্রীয় প্রাঙ্গণে নবনির্মিত আধুনিক জিমনেসিয়াম ও ইনডোর স্পোর্টস কমপ্লেক্স আনুষ্ঠানিকভাবে উদ্বোধন করা হয়েছে।',
      'কমপ্লেক্সে মানসম্মত ইনডোর কোর্ট, ফিটনেস সরঞ্জাম এবং ছাত্রীদের জন্য পৃথক জিম সুবিধা রাখা হয়েছে।',
      'আগামী মাস থেকে ক্যাম্পাসের কেন্দ্রীয় মাঠে বার্ষিক আন্তঃবিভাগীয় ক্রিকেট ও ফুটবল টুর্নামেন্ট শুরু হবে।'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    author: 'Directorate of Physical Education',
    readTime: '2 min read',
    readTimeBn: '২ মিনিট পড়া',
    tags: ['Sports', 'Gym', 'Student Life', 'Health']
  },
  {
    id: 'news-6',
    title: 'University Syndicate Approves Paperless Administrative Governance Regulations 2026',
    titleBn: 'বিশ্ববিদ্যালয় সিন্ডিকেট কর্তৃক পেপারলেস প্রশাসনিক পরিচালনা বিধিমালা ২০২৬ অনুমোদিত',
    category: 'Administrative',
    categoryBn: 'প্রশাসনিক',
    date: '2026-07-25',
    dateBn: '২৫ জুলাই ২০২৬',
    summary: 'Syndicate enacts digital clearance procedures, automated e-noting, and cryptographic transcripts across all statutory offices.',
    summaryBn: 'সিন্ডিকেট সভায় ডিজিটাল ছাড়পত্র, অনলাইন ই-নথিপত্র এবং কিউআর কোডযুক্ত সনদপত্র প্রদানের প্রাতিষ্ঠানিক অনুমোদন।',
    content: [
      'In its 42nd regular statutory meeting, the JSTU Syndicate officially approved the University Paperless Governance Protocol 2026.',
      'The directive mandates that all departmental course clearances, library discharge certificates, and degree application workflows must be processed via the centralized portal.',
      'The Registrar noted that students will no longer be required to collect physical signatures across offices, shortening graduation transcript issuance from three weeks to 48 hours.'
    ],
    contentBn: [
      'জেএসটিইউ সিন্ডিকেটের ৪২তম সভায় পেপারলেস গভর্নেন্স প্রটোকল ২০২৬ সর্বসম্মতিক্রমে অনুমোদিত হয়েছে।',
      'এর ফলে বিভাগীয় ছাড়পত্র, লাইব্রেরি ক্লিয়ারেন্স ও সনদ প্রাপ্তির জন্য শিক্ষার্থীদের আর সশরীরে বিভিন্ন দপ্তরে ঘুরতে হবে না।',
      'রেজিস্ট্রার মহোদয় জানান, ডিজিটাল অনুমোদনের মাধ্যমে সনদপত্র পাওয়ার সময়সীমা ৩ সপ্তাহ থেকে কমিয়ে ৪৮ ঘণ্টায় নামিয়ে আনা সম্ভব হয়েছে।'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    author: 'Office of the Registrar',
    readTime: '3 min read',
    readTimeBn: '৩ মিনিট পড়া',
    tags: ['Syndicate', 'Paperless', 'Governance', 'Administration']
  }
];

export const universityEventsData: UniversityEventItem[] = [
  {
    id: 'evt-1',
    title: 'International Conference on Intelligent Computing & Delta Sustainability (ICICDS 2026)',
    titleBn: 'আন্তর্জাতিক বুদ্ধিমান কম্পিউটিং ও বদ্বীপ টেকসই উন্নয়ন সম্মেলন ২০২৬',
    category: 'Conference',
    categoryBn: 'সম্মেলন',
    date: '2026-11-12',
    dateBn: '১২ নভেম্বর ২০২৬',
    time: '09:00 AM - 05:30 PM',
    timeBn: 'সকাল ০৯:০০ - বিকাল ০৫:৩০',
    venue: 'Central Auditorium & Conference Center, Academic Block A',
    venueBn: 'কেন্দ্রীয় অডিটোরিয়াম ও কনফারেন্স সেন্টার, একাডেমিক ভবন এ',
    organizer: 'Faculty of Engineering & Technology',
    organizerBn: 'প্রকৌশল ও প্রযুক্তি অনুষদ',
    summary: 'Flagship academic convention hosting researchers from 12 countries discussing applied artificial intelligence, river engineering, and microgrids.',
    summaryBn: '১২টি দেশের গবেষকদের অংশগ্রহণে এআই, নদী প্রকৌশল ও নবায়নযোগ্য শক্তি বিষয়ক ফ্ল্যাগশিপ আন্তর্জাতিক সম্মেলন।',
    description: 'ICICDS 2026 brings together prominent global academicians, industry engineers, and policymakers to showcase peer-reviewed discoveries in intelligent edge computing and river basin conservation. Accepted papers will be submitted for inclusion in IEEE Xplore.',
    descriptionBn: 'দেশ-বিদেশের গবেষকদের উপস্থিতিতে অনুষ্ঠিতব্য এই সম্মেলনে নির্বাচিত গবেষণা প্রবন্ধসমূহ আইইইই এক্সপ্লোরে প্রকাশিত হবে।',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming',
    chiefGuest: 'Minister of Science & Technology, Government of Bangladesh',
    chiefGuestBn: 'মাননীয় বিজ্ঞান ও প্রযুক্তি মন্ত্রী, গণপ্রজাতন্ত্রী বাংলাদেশ সরকার',
    agenda: [
      { time: '09:00 AM', activity: 'Registration & Welcome Kit Handover' },
      { time: '10:00 AM', activity: 'Inaugural Ceremony & Vice Chancellor Keynote' },
      { time: '11:30 AM', activity: 'Technical Session Track A: AI & Computer Vision' },
      { time: '02:00 PM', activity: 'Technical Session Track B: Delta Hydrology & Fisheries' },
      { time: '04:30 PM', activity: 'Best Paper Award & Concluding Remarks' }
    ]
  },
  {
    id: 'evt-2',
    title: 'Workshop on High-Performance Deep Learning with GPU Acceleration',
    titleBn: 'জিপিইউ ত্বরান্বিত হাই-পারফরম্যান্স ডিপ লার্নিং বিষয়ক কর্মশালা',
    category: 'Workshop',
    categoryBn: 'কর্মশালা',
    date: '2026-10-25',
    dateBn: '২৫ অক্টোবর ২০২৬',
    time: '10:00 AM - 04:00 PM',
    timeBn: 'সকাল ১০:০০ - বিকাল ০৪:০০',
    venue: 'CSE Advanced Simulation Lab, Room 402',
    venueBn: 'সিএসই অ্যাডভান্সড সিমুলেশন ল্যাব, রুম ৪০২',
    organizer: 'Department of Computer Science & Engineering',
    organizerBn: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং বিভাগ',
    summary: 'Hands-on pedagogical lab training on distributed PyTorch training, tensor parallelism, and low-latency inference on server GPUs.',
    summaryBn: 'ডিপ লার্নিং মডেল প্রশিক্ষণ ও ক্লাউড জিপিইউ ব্যবহারের ওপর ব্যবহারিক ল্যাব প্রশিক্ষণ কর্মশালা।',
    description: 'An intensive technical workshop designed for thesis students and junior faculty members exploring transformer model fine-tuning, quantization, and CUDA memory optimization.',
    descriptionBn: 'থিসিস শিক্ষার্থী ও তরুণ গবেষকদের জন্য ট্রান্সফরমার মডেল টিউনিং ও প্যারালাল কম্পিউটিং বিষয়ক কর্মশালা।',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming'
  },
  {
    id: 'evt-3',
    title: 'Symposium on River Sedimentation & Indigenous Fish Species Preservation',
    titleBn: 'নদী পলি প্রবাহ ও দেশীয় মাছের প্রজাতি সংরক্ষণ বিষয়ক সিম্পোজিয়াম',
    category: 'Seminar',
    categoryBn: 'সেমিনার',
    date: '2026-10-18',
    dateBn: '১৮ অক্টোবর ২০২৬',
    time: '11:00 AM - 03:00 PM',
    timeBn: 'সকাল ১১:০০ - দুপুর ০৩:০০',
    venue: 'Senate Hall, Administrative Building',
    venueBn: 'সিনেট হল, প্রশাসনিক ভবন',
    organizer: 'Faculty of Agriculture & Fisheries Dept',
    organizerBn: 'কৃষি অনুষদ ও ফিশারিজ বিভাগ',
    summary: 'Interdisciplinary ecological forum examining river sedimentation, indigenous fish breeding, and flood-resilient aquaculture.',
    summaryBn: 'নদীর পলি প্রবাহ ও দেশীয় প্রজাতির মাছের কৃত্রিম প্রজনন বিষয়ক পরিবেশ গবেষকদের সিম্পোজিয়াম।',
    description: 'Regional aquaculture officers, river basin geologists, and environmental scientists convene to outline community hatcheries and sediment management strategies.',
    descriptionBn: 'নদী রক্ষা ও মৎস্য সম্পদ বৃদ্ধির জন্য আধুনিক বৈজ্ঞানিক পদ্ধতির রূপরেখা প্রণয়ন।',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming'
  },
  {
    id: 'evt-4',
    title: 'University Career Fair & Industry-Academia Networking 2026',
    titleBn: 'বিশ্ববিদ্যালয় ক্যারিয়ার মেলা ও শিল্প-শিক্ষা সংযোগ ২০২৬',
    category: 'Seminar',
    categoryBn: 'ক্যারিয়ার সেমিনার',
    date: '2026-11-28',
    dateBn: '২৮ নভেম্বর ২০২৬',
    time: '10:00 AM - 05:00 PM',
    timeBn: 'সকাল ১০:০০ - বিকাল ০৫:০০',
    venue: 'University Central Plaza & Ground Floor Foyer',
    venueBn: 'কেন্দ্রীয় চত্বর ও গ্রাউন্ড ফ্লোর ফোয়ার',
    organizer: 'JSTU Career Guidance & Placement Cell',
    organizerBn: 'ক্যারিয়ার গাইডেন্স ও প্লেসমেন্ট সেল',
    summary: 'Over 25 corporate enterprises, software hubs, and engineering companies conducting on-spot interviews and career grooming sessions.',
    summaryBn: '২৫টিরও বেশি শীর্ষস্থানীয় প্রযুক্তি ও করপোরেট প্রতিষ্ঠানের অংশগ্রহণে অন-স্পট ইন্টারভিউ ও দিকনির্দেশনামূলক মেলা।',
    description: 'Bridging the transition from graduation to employment through resume evaluation, mock technical interviews, and corporate recruitment booths.',
    descriptionBn: 'শিক্ষার্থীদের চাকরি বাজারে প্রবেশের জন্য জীবনবৃত্তান্ত পরীক্ষণ ও সরাসরি ইন্টারভিউয়ের সুযোগ।',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming'
  },
  {
    id: 'evt-5',
    title: 'Annual Cultural Festival & Bengali Spring Celebration (Basanta Utsab)',
    titleBn: 'বার্ষিক সাংস্কৃতিক উৎসব ও বসন্ত বরণ ১৪৩৩',
    category: 'Cultural',
    categoryBn: 'সাংস্কৃতিক',
    date: '2027-02-14',
    dateBn: '১৪ ফেব্রুয়ারি ২০২৭',
    time: '08:30 AM - 09:00 PM',
    timeBn: 'সকাল ০৮:৩০ - রাত ০৯:০০',
    venue: 'University Muktamancha (Open Amphitheater)',
    venueBn: 'বিশ্ববিদ্যালয় উন্মুক্ত মুক্তমঞ্চ',
    organizer: 'JSTU Cultural Committee & Student Union',
    organizerBn: 'সাংস্কৃতিক কমিটি ও ছাত্র সংসদ',
    summary: 'A day of folk music, classical dance, theatrical recitals, and traditional food stalls celebrating the arrival of spring.',
    summaryBn: 'বসন্ত বরণ উপলক্ষে দিনব্যাপী সঙ্গীতানুষ্ঠান, আবৃত্তি, নাটক ও ঐতিহ্যবাহী পিঠা উৎসব।',
    description: 'Students and faculties join in vibrant traditional attire celebrating cultural heritage with musical performances and artistic exhibits.',
    descriptionBn: 'বাঙালির চিরায়ত সংস্কৃতি উদযাপনে শিক্ষার্থীদের অংশগ্রহণে বর্ণাঢ্য পরিবেশনা।',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming'
  },
  {
    id: 'evt-6',
    title: 'National Victory Day Observance & Memorial Marathon',
    titleBn: 'মহান বিজয় দিবস উদযাপন ও স্মৃতি ম্যারাথন',
    category: 'National',
    categoryBn: 'জাতীয় দিবস',
    date: '2026-12-16',
    dateBn: '১৬ ডিসেম্বর ২০২৬',
    time: '06:30 AM - 01:00 PM',
    timeBn: 'সকাল ০৬:৩০ - দুপুর ০১:০০',
    venue: 'Campus Shahid Minar & Central Parade Ground',
    venueBn: 'ক্যাম্পাস শহীদ মিনার ও কেন্দ্রীয় প্যারেড গ্রাউন্ড',
    organizer: 'National Days Observance Committee',
    organizerBn: 'জাতীয় দিবস উদযাপন কমিটি',
    summary: 'Floral wreath offering at sunrise, patriotic songs, academic discussions on the 1971 Liberation War, and campus run.',
    summaryBn: 'সূর্যোদয়ের সাথে শহীদ বেদীতে পুষ্পস্তবক অর্পণ, জাতীয় সঙ্গীত পরিবেশন ও মুক্ত আলোচনা।',
    description: 'Honoring the immortal martyrs of the Liberation War with solemn respect, documentary screening, and student exhibitions.',
    descriptionBn: 'বীর শহীদদের স্মরণে বিশেষ আলোচনা ও মুক্তিযুদ্ধ ভিত্তিক তথ্যচিত্র প্রদর্শনী।',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming'
  }
];

export const galleryPhotosData: UniversityGalleryImage[] = [
  {
    id: 'gal-1',
    title: 'Academic & Administrative Complex Exterior',
    titleBn: 'একাডেমিক ও প্রশাসনিক ভবন কমপ্লেক্স',
    category: 'Architecture',
    categoryBn: 'স্থাপত্য',
    album: 'Campus Architecture',
    albumBn: 'ক্যাম্পাস স্থাপত্য',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80',
    caption: 'Modern multistoried academic building housing departmental classrooms and administrative suites.',
    captionBn: 'আধুনিক বহুতল একাডেমিক ভবন যেখানে শ্রেণিকক্ষ ও প্রশাসনিক দপ্তরসমূহ অবস্থিত।',
    date: '2026-09-10'
  },
  {
    id: 'gal-2',
    title: 'Central Library Study Commons',
    titleBn: 'কেন্দ্রীয় গ্রন্থাগার স্টাডি রিডিং হল',
    category: 'Laboratories',
    categoryBn: 'একাডেমিক সুবিধা',
    album: 'Academic Facilities',
    albumBn: 'শিক্ষা সুবিধা',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80',
    caption: 'Spacious, well-lit reading commons with specialized digital catalog access and private research desks.',
    captionBn: 'ডিজিটাল ক্যাটালগ ও গবেষকদের নিরব অধ্যয়নের জন্য সুপরিসর পাঠকক্ষ।',
    date: '2026-08-22'
  },
  {
    id: 'gal-3',
    title: 'Computer Science & Software Engineering Labs',
    titleBn: 'কম্পিউটার সায়েন্স ও সফটওয়্যার ল্যাবরেটরি',
    category: 'Laboratories',
    categoryBn: 'গবেষণাগার',
    album: 'Academic Facilities',
    albumBn: 'ল্যাবরেটরি ও বিজ্ঞানাগার',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
    caption: 'Equipped with gigabit connectivity, AI workstations, and high-performance server clusters.',
    captionBn: 'উচ্চগতির গিগাবিট নেটওয়ার্ক ও আধুনিক ওয়ার্কস্টেশন সম্বলিত ল্যাবরেটরি।',
    date: '2026-08-15'
  },
  {
    id: 'gal-4',
    title: 'Scenic Campus Walkway & Green Landscape',
    titleBn: 'সবুজ ক্যাম্পাস চত্বর ও মনোরম ওয়াকওয়ে',
    category: 'Campus Grounds',
    categoryBn: 'ক্যাম্পাস প্রাঙ্গণ',
    album: 'Campus Grounds',
    albumBn: 'প্রাকৃতিক প্রাঙ্গণ',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
    caption: 'Pedestrian-friendly green botanical pathways connecting academic zones and student recreation.',
    captionBn: '৫০ একর সবুজ ক্যাম্পাস ও বৃক্ষশোভিত পরিবেশবান্ধব ওয়াকওয়ে।',
    date: '2026-07-30'
  },
  {
    id: 'gal-5',
    title: 'Applied Science Analytical Chemical Spectroscopy',
    titleBn: 'ফলিত বিজ্ঞান ও রাসায়নিক অ্যানালাইটিক্যাল ল্যাব',
    category: 'Laboratories',
    categoryBn: 'গবেষণাগার',
    album: 'Academic Facilities',
    albumBn: 'ল্যাবরেটরি ও বিজ্ঞানাগার',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80',
    caption: 'Precision laboratory glassware and analytical spectroscopy instrumentation.',
    captionBn: 'উন্নত গবেষণার জন্য আধুনিক যন্ত্রপাতি ও ল্যাবরেটরি সুবিধা।',
    date: '2026-07-12'
  },
  {
    id: 'gal-6',
    title: 'Evening Academic Quadrangles & Pavilions',
    titleBn: 'সান্ধ্য ক্যাম্পাস চত্বর ও আলোকোজ্জ্বল প্রাঙ্গণ',
    category: 'Campus Grounds',
    categoryBn: 'ক্যাম্পাস প্রাঙ্গণ',
    album: 'Campus Grounds',
    albumBn: 'প্রাকৃতিক প্রাঙ্গণ',
    imageUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1600&q=80',
    caption: 'Serene evening atmosphere encouraging collaborative student study circles.',
    captionBn: 'শিক্ষার্থীদের জ্ঞানচর্চা ও মুক্ত আলোচনার জন্য মনোরম সান্ধ্য চত্বর।',
    date: '2026-06-25'
  },
  {
    id: 'gal-7',
    title: 'Convocation Ceremony Procession & Graduates',
    titleBn: 'সমাবর্তন শোভাযাত্রা ও গ্র্যাজুয়েটবৃন্দ',
    category: 'Events & Convocations',
    categoryBn: 'সমাবর্তন ও অনুষ্ঠান',
    album: 'Events & Milestones',
    albumBn: 'গুরুত্বপূর্ণ অনুষ্ঠানমালা',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    caption: 'Graduates donning ceremonial robes during academic commencement.',
    captionBn: 'ডিগ্রি অর্জনকারী শিক্ষার্থীদের সমাবর্তন গাউন ও টুপি পরিধানের স্মৃতিময় মুহূর্ত।',
    date: '2026-05-18'
  },
  {
    id: 'gal-8',
    title: 'Student Innovation Club & Hardware Prototyping',
    titleBn: 'শিক্ষার্থী উদ্ভাবনী দল ও হার্ডওয়্যার প্রোটোটাইপ',
    category: 'Student Life',
    categoryBn: 'শিক্ষার্থী জীবন',
    album: 'Student Life',
    albumBn: 'ক্যাম্পাস জীবন',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
    caption: 'Multidisciplinary engineering students building smart IoT hardware modules.',
    captionBn: 'ইন্টারনেট অব থিংস ও রোবটিক্স প্রজেক্টে শিক্ষার্থীদের দলগত কার্যক্রম।',
    date: '2026-04-10'
  }
];

export const downloadsCatalogData: UniversityDownloadItem[] = [
  {
    id: 'dl-1',
    title: 'Undergraduate Semester Final Examination Form (All Faculties)',
    titleBn: 'স্নাতক সেমিস্টার ফাইনাল পরীক্ষার আবেদন ফরম (সকল অনুষদ)',
    category: 'academic_forms',
    categoryLabel: 'Academic Forms',
    categoryLabelBn: 'একাডেমিক ফরম',
    fileType: 'PDF',
    fileSize: '340 KB',
    publishedDate: '2026-09-01',
    publishedDateBn: '১ সেপ্টেম্বর ২০২৬',
    refNumber: 'JSTU/COE/EXM/2026/01',
    description: 'Mandatory form for students applying to appear for semester end examinations.',
    descriptionBn: 'সেমিস্টার সমাপনী পরীক্ষার প্রবেশপত্র প্রাপ্তির জন্য আবশ্যক আবেদন ফরম।'
  },
  {
    id: 'dl-2',
    title: 'Provisional Certificate & Official Academic Transcript Request Form',
    titleBn: 'সাময়িক সনদপত্র ও অফিসিয়াল একাডেমিক গ্রেডশিট উত্তোলন ফরম',
    category: 'academic_forms',
    categoryLabel: 'Academic Forms',
    categoryLabelBn: 'একাডেমিক ফরম',
    fileType: 'PDF',
    fileSize: '410 KB',
    publishedDate: '2026-08-15',
    publishedDateBn: '১৫ আগস্ট ২০২৬',
    refNumber: 'JSTU/REG/DOC/2026/09',
    description: 'Required application for graduated students requesting digital and physical transcripts.',
    descriptionBn: 'উত্তীর্ণ শিক্ষার্থীদের সনদপত্র ও গ্রেডশিট প্রাপ্তির জন্য আবেদন ফরম।'
  },
  {
    id: 'dl-3',
    title: 'First Statues & Academic Ordinances of JSTU (Gazetted Act 2021)',
    titleBn: 'জেএসটিইউ প্রথম সংবিধি ও একাডেমিক অর্ডিন্যান্স (গেজেটভুক্ত আইন ২০২১)',
    category: 'ordinances',
    categoryLabel: 'Ordinances & Statutes',
    categoryLabelBn: 'সংবিধি ও অর্ডিন্যান্স',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    publishedDate: '2026-01-10',
    publishedDateBn: '১০ জানুয়ারি ২০২৬',
    refNumber: 'ACT-NO-28/2021',
    description: 'Official statutory legislation defining university powers, Syndicate bylaws, and disciplinary rules.',
    descriptionBn: 'বিশ্ববিদ্যালয় আইন, সিন্ডিকেট ক্ষমতা এবং একাডেমিক শৃঙ্খলামূলক বিধিমালা।'
  },
  {
    id: 'dl-4',
    title: 'Standard Operating Procedure for Paperless Departmental Clearance',
    titleBn: 'পেপারলেস বিভাগীয় ছাড়পত্র ও ডিজিটাল নো-অবজেকশন এসওপি',
    category: 'ordinances',
    categoryLabel: 'Ordinances & Statutes',
    categoryLabelBn: 'সংবিধি ও অর্ডিন্যান্স',
    fileType: 'PDF',
    fileSize: '580 KB',
    publishedDate: '2026-07-28',
    publishedDateBn: '২৮ জুলাই ২০২৬',
    refNumber: 'JSTU/REG/SOP/2026/03',
    description: 'Executive guidelines governing automated 4-tier clearance verification.',
    descriptionBn: 'অনলাইন ৪-স্তরের ডিজিটাল ছাড়পত্র কার্যক্রমের আনুষ্ঠানিক নির্দেশিকা।'
  },
  {
    id: 'dl-5',
    title: 'Faculty & Officer Medical Reimbursement Claim Form',
    titleBn: 'শিক্ষক ও কর্মকর্তাদের চিকিৎসা অনুদান ও বিল সমন্বয় ফরম',
    category: 'financial_forms',
    categoryLabel: 'Financial & Accounts Forms',
    categoryLabelBn: 'অর্থ ও হিসাব সংক্রান্ত ফরম',
    fileType: 'DOCX',
    fileSize: '190 KB',
    publishedDate: '2026-06-12',
    publishedDateBn: '১২ জুন ২০২৬',
    refNumber: 'JSTU/ACC/MED/2026/04',
    description: 'Claim form for medical treatment expenditures under the institutional health scheme.',
    descriptionBn: 'বিশ্ববিদ্যালয় স্বাস্থ্য তহবিলের আওতায় চিকিৎসা ব্যয়ের আর্থিক দাবি ফরম।'
  },
  {
    id: 'dl-6',
    title: 'Teacher TA/DA Bill & Conference Travel Grant Voucher',
    titleBn: 'শিক্ষক ভ্রমণ ভাতা (টিএ/ডিএ) ও কনফারেন্স গ্রান্ট ভাউচার',
    category: 'financial_forms',
    categoryLabel: 'Financial & Accounts Forms',
    categoryLabelBn: 'অর্থ ও হিসাব সংক্রান্ত ফরম',
    fileType: 'DOCX',
    fileSize: '220 KB',
    publishedDate: '2026-05-30',
    publishedDateBn: '৩০ মে ২০২৬',
    refNumber: 'JSTU/ACC/TRAV/2026/11',
    description: 'Voucher for institutional conference travel allowances and per diem claims.',
    descriptionBn: 'সম্মেলন ও প্রাতিষ্ঠানিক ভ্রমণে অংশগ্রহণকারীদের ভ্রমণ ভাতা বিল ফরম।'
  },
  {
    id: 'dl-7',
    title: 'Annual Research Grant Application Template (RIC Grant 2026-2027)',
    titleBn: 'বার্ষিক গবেষণা অনুদান আবেদন ফরম্যাট (আরআইসি গ্রান্ট ২০২৬-২০২৭)',
    category: 'research_forms',
    categoryLabel: 'Research Grant Forms',
    categoryLabelBn: 'গবেষণা অনুদান ফরম',
    fileType: 'DOCX',
    fileSize: '510 KB',
    publishedDate: '2026-08-01',
    publishedDateBn: '১ আগস্ট ২০২৬',
    refNumber: 'JSTU/RIC/PROP/2026/02',
    description: 'Standardized project proposal template including budget justification and milestone Gantt chart.',
    descriptionBn: 'গবেষণা প্রস্তাবনা, বাজেট বিশ্লেষণ এবং মাইলফলক সম্বলিত মানসম্মত আবেদন ফরম্যাট।'
  },
  {
    id: 'dl-8',
    title: 'University Ethical Review Board (ERB) Protocol Clearance Form',
    titleBn: 'বিশ্ববিদ্যালয় এথিক্যাল রিভিউ বোর্ড (ইআরবি) প্রটোকল ক্লিয়ারেন্স ফরম',
    category: 'research_forms',
    categoryLabel: 'Research Grant Forms',
    categoryLabelBn: 'গবেষণা অনুদান ফরম',
    fileType: 'PDF',
    fileSize: '390 KB',
    publishedDate: '2026-07-15',
    publishedDateBn: '১৫ জুলাই ২০২৬',
    refNumber: 'JSTU/RIC/ERB/2026/01',
    description: 'Mandatory ethical clearance checklist for investigations involving human participants or biological samples.',
    descriptionBn: 'মানব ও প্রাণীদেহে গবেষণায় নৈতিক অনুমোদন পাওয়ার আবশ্যকীয় ফরম।'
  },
  {
    id: 'dl-9',
    title: 'Official Circular: Revised Semester Calendar & Vacation Schedule 2026',
    titleBn: 'অফিসিয়াল সার্কুলার: সংশোধিত সেমিস্টার বর্ষপঞ্জি ও অবকাশসূচি ২০২৬',
    category: 'circulars',
    categoryLabel: 'Circulars & Notices',
    categoryLabelBn: 'সার্কুলার ও অফিস আদেশ',
    fileType: 'PDF',
    fileSize: '480 KB',
    publishedDate: '2026-09-20',
    publishedDateBn: '২০ সেপ্টেম্বর ২০২৬',
    refNumber: 'JSTU/REG/CIR/2026/45',
    description: 'Registrar office notification announcing updated semester examination and break dates.',
    descriptionBn: 'রেজিস্ট্রার দপ্তর থেকে প্রকাশিত চূড়ান্ত সেমিস্টার ও ছুটির সময়সূচি।'
  }
];

export const careerAndTendersData: CareerTenderItem[] = [
  // 1. Job Opening
  {
    id: 'job-1',
    opportunityType: 'job',
    title: 'Professor / Associate Professor (Computer Science & Engineering)',
    titleBn: 'অধ্যাপক / সহযোগী অধ্যাপক (সিএসই বিভাগ)',
    category: 'Faculty',
    categoryBn: 'শিক্ষক',
    refNumber: 'JSTU/REG/EST-1/2026/04',
    departmentOrOffice: 'Department of CSE',
    departmentOrOfficeBn: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং বিভাগ',
    publishDate: '2026-09-15',
    publishDateBn: '১৫ সেপ্টেম্বর ২০২৬',
    deadline: '2026-11-15',
    deadlineBn: '১৫ নভেম্বর ২০২৬',
    status: 'active',
    vacancies: 2,
    eligibilitySummary: 'Ph.D. in CSE/IT from an accredited university with minimum 12 years of active university teaching/research experience and at least 15 peer-reviewed publications.',
    eligibilitySummaryBn: 'স্বীকৃত বিশ্ববিদ্যালয় থেকে সিএসই/আইটি বিষয়ে পিএইচডি ডিগ্রি, ন্যূনতম ১২ বছরের শিক্ষকতার অভিজ্ঞতা এবং কমপক্ষে ১৫টি আন্তর্জাতিক প্রকাশনা।',
    fullRequirements: [
      'Four-year B.Sc. (Engg.) and M.Sc. in CSE with First Class or equivalent CGPA.',
      'Ph.D. in Computer Science or relevant specialization.',
      'Minimum 12 years of active university teaching experience, of which 5 years as Associate Professor.',
      'At least 15 indexed journal research papers (Scopus/IEEE/WoS).'
    ],
    pdfAttachments: [
      {
        title: 'Official Recruitment Circular (Bengali & English)',
        titleBn: 'মূল নিয়োগ বিজ্ঞপ্তি',
        fileSize: '850 KB',
        fileName: 'JSTU_Recruitment_Circular_2026_04.pdf'
      },
      {
        title: 'Prescribed Faculty Application Form Template',
        titleBn: 'নির্ধারিত শিক্ষক আবেদন ফরম',
        fileSize: '420 KB',
        fileName: 'JSTU_Faculty_Application_Form.pdf'
      }
    ]
  },
  // 2. Job Opening
  {
    id: 'job-2',
    opportunityType: 'job',
    title: 'Lecturer in Mathematics (Pure / Applied Mathematics)',
    titleBn: 'প্রভাষক (গণিত বিভাগ)',
    category: 'Faculty',
    categoryBn: 'শিক্ষক',
    refNumber: 'JSTU/REG/EST-1/2026/05',
    departmentOrOffice: 'Department of Mathematics',
    departmentOrOfficeBn: 'গণিত বিভাগ',
    publishDate: '2026-09-15',
    publishDateBn: '১৫ সেপ্টেম্বর ২০২৬',
    deadline: '2026-11-15',
    deadlineBn: '১৫ নভেম্বর ২০২৬',
    status: 'active',
    vacancies: 2,
    eligibilitySummary: 'B.Sc. (Honours) and M.Sc. in Mathematics with minimum CGPA 3.60/4.00 or First Class in both examinations with strong analytical foundation.',
    eligibilitySummaryBn: 'গণিত বিষয়ে স্নাতক (সম্মান) ও স্নাতকোত্তর পরীক্ষায় ন্যূনতম সিজিপিএ ৩.৬০ অথবা প্রথম শ্রেণি সমমান।',
    fullRequirements: [
      'Four-year B.Sc. (Honours) in Mathematics with minimum CGPA 3.60.',
      'M.Sc. in Pure or Applied Mathematics with minimum CGPA 3.60.',
      'Minimum GPA 4.50 out of 5.00 in both SSC and HSC examinations.',
      'Preference will be given to candidates with high-impact publications.'
    ],
    pdfAttachments: [
      {
        title: 'Official Circular Notification',
        titleBn: 'অফিসিয়াল সার্কুলার বিজ্ঞপ্তি',
        fileSize: '720 KB',
        fileName: 'JSTU_Recruitment_Circular_2026_05.pdf'
      }
    ]
  },
  // 3. Job Opening
  {
    id: 'job-3',
    opportunityType: 'job',
    title: 'Network & Cloud Security Engineer (ICT Cell)',
    titleBn: 'নেটওয়ার্ক অ্যান্ড ক্লাউড সিকিউরিটি ইঞ্জিনিয়ার (আইসিটি সেল)',
    category: 'Officer',
    categoryBn: 'কর্মকর্তা',
    refNumber: 'JSTU/REG/EST-2/2026/12',
    departmentOrOffice: 'ICT Cell, Administrative Secretariat',
    departmentOrOfficeBn: 'আইসিটি সেল, প্রশাসনিক সচিবালয়',
    publishDate: '2026-09-20',
    publishDateBn: '২০ সেপ্টেম্বর ২০২৬',
    deadline: '2026-11-05',
    deadlineBn: '৫ নভেম্বর ২০২৬',
    status: 'active',
    vacancies: 1,
    eligibilitySummary: 'B.Sc. in CSE/EEE with CCNP or equivalent certification and minimum 3 years hands-on experience in enterprise routing, VLANs, and firewall administration.',
    eligibilitySummaryBn: 'সিএসই/ইইই বিষয়ে বিএসসি এবং সিসিএনপি সার্টিফিকেটসহ এন্টারপ্রাইজ রাউটিং ও ফায়ারওয়াল পরিচালনায় ৩ বছরের অভিজ্ঞতা।',
    pdfAttachments: [
      {
        title: 'Officer Position Circular & Terms',
        titleBn: 'কর্মকর্তা নিয়োগ বিজ্ঞপ্তি ও শর্তাবলী',
        fileSize: '540 KB',
        fileName: 'JSTU_Officer_Circular_12.pdf'
      }
    ]
  },
  // 4. Tender Item
  {
    id: 'tnd-1',
    opportunityType: 'tender',
    title: 'Supply, Installation & Commissioning of Advanced Scientific Laboratory Equipment for Department of EEE',
    titleBn: 'ইইই বিভাগের জন্য আধুনিক বৈজ্ঞানিক ল্যাবরেটরি যন্ত্রপাতি সরবরাহ ও স্থাপন',
    category: 'Procurement Goods',
    categoryBn: 'পণ্য ক্রয় ও সরবরাহ',
    refNumber: 'JSTU/P&D/TEND/EEE-LAB/2026/08',
    departmentOrOffice: 'Planning & Development Directorate',
    departmentOrOfficeBn: 'পরিকল্পনা ও উন্নয়ন দপ্তর',
    publishDate: '2026-09-25',
    publishDateBn: '২৫ সেপ্টেম্বর ২০২৬',
    deadline: '2026-10-30',
    deadlineBn: '৩০ অক্টোবর ২০২৬',
    status: 'active',
    budgetBDT: '৳ 8,500,000',
    eligibilitySummary: 'Enlisted domestic and international scientific instrument vendors with minimum 5 years specialized supply record and valid trade, tax, and VAT registrations.',
    eligibilitySummaryBn: 'নবায়নকৃত ট্রেড লাইসেন্স, টিআইএন এবং ভ্যাট নিবন্ধনসহ বৈজ্ঞানিক যন্ত্রপাতি সরবরাহে ৫ বছরের অভিজ্ঞতাসম্পন্ন প্রতিষ্ঠান।',
    fullRequirements: [
      'Documentary proof of completing similar contracts valued at BDT 5,000,000 within the last 3 years.',
      'Authorized manufacturer authorization letter for all digital oscilloscopes, spectrum analyzers, and PCB rapid prototyping machines.',
      'Tender security deposit of BDT 170,000 in the form of Bank Draft / Pay Order in favor of Registrar, JSTU.'
    ],
    pdfAttachments: [
      {
        title: 'Tender Schedule & Technical Specifications Package',
        titleBn: 'টেন্ডার শিডিউল ও কারিগরি বিবরণী',
        fileSize: '1.8 MB',
        fileName: 'Tender_Document_EEE_LAB_2026_08.pdf'
      }
    ]
  },
  // 5. Tender Item
  {
    id: 'tnd-2',
    opportunityType: 'tender',
    title: 'Construction of 500-Seat Residential Hall Dining Extension & Solar Water Heating Infrastructure',
    titleBn: 'আবাসিক হলের ডাইনিং সম্প্রসারণ ও সৌর পানি গরমকরণ ব্যবস্থা নির্মাণ',
    category: 'Works',
    categoryBn: 'পূর্ত কাজ (Works)',
    refNumber: 'JSTU/ENG/CIVIL/HALL-01/2026/02',
    departmentOrOffice: 'Office of the Chief Engineer',
    departmentOrOfficeBn: 'প্রধান প্রকৌশলীর দপ্তর',
    publishDate: '2026-09-18',
    publishDateBn: '১৮ সেপ্টেম্বর ২০২৬',
    deadline: '2026-11-08',
    deadlineBn: '৮ নভেম্বর ২০২৬',
    status: 'active',
    budgetBDT: '৳ 14,200,000',
    eligibilitySummary: 'Government registered Class-1 civil construction contractors with proven completion certificates in reinforced concrete public infrastructure.',
    eligibilitySummaryBn: '১ম শ্রেণির সরকারি নিবন্ধিত নির্মাণ ঠিকাদারী প্রতিষ্ঠান যাদের বহুতল আরসিসি অবকাঠামো নির্মাণে পূর্ব অভিজ্ঞতা রয়েছে।',
    pdfAttachments: [
      {
        title: 'Civil Engineering Tender Package & Bill of Quantities (BOQ)',
        titleBn: 'পূর্ত কাজের টেন্ডার প্যাকেজ ও বিওকিউ',
        fileSize: '2.5 MB',
        fileName: 'Tender_BOQ_Civil_Hall_01.pdf'
      }
    ]
  },
  // 6. Tender Item
  {
    id: 'tnd-3',
    opportunityType: 'tender',
    title: 'Lease Tender for Operating Campus Central Cafeteria & Student Snack Corners (Session 2026-2027)',
    titleBn: 'ক্যাম্পাস কেন্দ্রীয় ক্যাফেটেরিয়া ও স্ন্যাক কর্নার পরিচালনার ইজারা দরপত্র (২০২৬-২০২৭)',
    category: 'Services',
    categoryBn: 'সেবা ও ইজারা',
    refNumber: 'JSTU/ESTAB/LEASE/CAF-2026/01',
    departmentOrOffice: 'Estate & General Administration Branch',
    departmentOrOfficeBn: 'এস্টেট ও সাধারণ প্রশাসন শাখা',
    publishDate: '2026-10-01',
    publishDateBn: '১ অক্টোবর ২০২৬',
    deadline: '2026-10-28',
    deadlineBn: '২৮ অক্টোবর ২০২৬',
    status: 'active',
    budgetBDT: '৳ 600,000 (Annual Base Reserve)',
    eligibilitySummary: 'Experienced professional catering firms with verified food safety sanitary certificates and institutional dining management credentials.',
    eligibilitySummaryBn: 'খাদ্য নিরাপত্তা সনদসহ বিশ্ববিদ্যালয় বা প্রাতিষ্ঠানিক ক্যাফেটেরিয়া পরিচালনায় অভিজ্ঞ ক্যাটারিং প্রতিষ্ঠান।',
    pdfAttachments: [
      {
        title: 'Cafeteria Lease Terms & Food Quality Schedule',
        titleBn: 'ক্যাফেটেরিয়া ইজারা শর্তাবলী ও খাবারের মান বিবরণী',
        fileSize: '650 KB',
        fileName: 'Cafeteria_Lease_Terms_2026.pdf'
      }
    ]
  }
];

export const researchPublicationsData: ResearchPublication[] = [
  {
    id: 'pub-1',
    title: 'Federated Edge Learning for Low-Resource Bengali Dialectal Speech Recognition',
    authors: ['Md. Tariqul Islam', 'Nahid Hassan', 'Prof. Dr. [REPLACE VC]'],
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    journalName: 'IEEE Transactions on Audio, Speech, and Language Processing',
    year: 2026,
    doi: '10.1109/TASLP.2026.3190482',
    indexedIn: 'IEEE Xplore',
    abstract: 'We present a privacy-preserving federated acoustic modeling framework designed for diverse regional Bengali dialects across delta districts. Our model yields a 14.2% relative word error rate reduction under limited bandwidth constraints.',
    citations: 28,
    pdfAvailable: true
  },
  {
    id: 'pub-2',
    title: 'Integrated Microgrid Architecture for Flood-Prone Rural Riverine Communities',
    authors: ['Farhana Yasmin', 'Dr. [REPLACE EEE HEAD]', 'Kazi Al-Amin'],
    departmentCode: 'EEE',
    departmentName: 'Electrical & Electronic Engineering',
    journalName: 'Applied Energy (Elsevier)',
    year: 2026,
    doi: '10.1016/j.apenergy.2026.119284',
    indexedIn: 'Elsevier',
    abstract: 'This paper designs an elevated floating solar-battery microgrid topology deployed during seasonal flooding in chars of the Old Brahmaputra. Field simulations prove continuous power resilience with 99.4% availability.',
    citations: 34,
    pdfAvailable: true
  },
  {
    id: 'pub-3',
    title: 'Spatial-Temporal Distribution of Trace Metals in Old Brahmaputra Estuarine Biota',
    authors: ['Dr. [REPLACE FISH HEAD]', 'Sadia Jahan', 'A. K. M. Mahbubur Rahman'],
    departmentCode: 'FISH',
    departmentName: 'Fisheries & Marine Bioscience',
    journalName: 'Marine Pollution Bulletin',
    year: 2025,
    doi: '10.1016/j.marpolbul.2025.114920',
    indexedIn: 'Scopus',
    abstract: 'A comprehensive investigation measuring cadmium, arsenic, and lead bioaccumulation across commercial carp and prawn species during monsoonal discharge cycles.',
    citations: 42,
    pdfAvailable: true
  },
  {
    id: 'pub-4',
    title: 'Hydrogeochemical Characterization of Holocene Aquifers in Greater Mymensingh-Jamalpur Delta',
    authors: ['Tanvir Ahmed', 'Dr. [REPLACE GEOL HEAD]'],
    departmentCode: 'GEOL',
    departmentName: 'Geology & Petroleum Engineering',
    journalName: 'Journal of Hydrology (Elsevier)',
    year: 2025,
    doi: '10.1016/j.jhydrol.2025.130981',
    indexedIn: 'Elsevier',
    abstract: 'Utilizing isotope hydrology and multi-electrode resistivity tomography to delineate safe drinking water Pleistocene aquifers beneath contaminated shallow layers.',
    citations: 19,
    pdfAvailable: true
  },
  {
    id: 'pub-5',
    title: 'Nonlinear Solitary Wave Solutions for High-Order Dispersive Evolution Equations',
    authors: ['Dr. [REPLACE MATH HEAD]', 'M. M. Rahman'],
    departmentCode: 'MATH',
    departmentName: 'Mathematics',
    journalName: 'Chaos, Solitons & Fractals (Elsevier)',
    year: 2026,
    doi: '10.1016/j.chaos.2026.112849',
    indexedIn: 'Elsevier',
    abstract: 'Applying extended bilinear Hirota methods and bifurcation theory to construct explicit rogue wave and breather solutions for nonlinear optical systems.',
    citations: 15,
    pdfAvailable: true
  },
  {
    id: 'pub-6',
    title: 'Digital Microfinance Inclusion and Women Entrepreneurship in Northern Rural Bangladesh',
    authors: ['Nusrat Jahan', 'Dr. [REPLACE MGMT HEAD]'],
    departmentCode: 'MGMT',
    departmentName: 'Management Studies',
    journalName: 'World Development Perspectives (Elsevier)',
    year: 2025,
    doi: '10.1016/j.wdp.2025.100492',
    indexedIn: 'Scopus',
    abstract: 'Empirical structural equation modeling analyzing the socio-economic empowerment of female smallholder entrepreneurs utilizing digital mobile financial wallets.',
    citations: 23,
    pdfAvailable: true
  },
  {
    id: 'pub-7',
    title: 'Community-Based Climate Adaptation Protocols among Char Dwellers: A Social Work Perspective',
    authors: ['Shamim Ara', 'Dr. [REPLACE SW HEAD]'],
    departmentCode: 'SW',
    departmentName: 'Social Work',
    journalName: 'International Social Work (Sage)',
    year: 2026,
    doi: '10.1177/0020872826118491',
    indexedIn: 'Scopus',
    abstract: 'Examining grassroots mutual-aid kinship networks and institutional disaster mitigation interventions during recurrent riverbank erosion disasters.',
    citations: 11,
    pdfAvailable: true
  }
];

export const jstuJournalData: JournalIssue = {
  volume: 'Vol. 12',
  issue: 'Issue 2 (July-December 2026)',
  year: 2026,
  month: 'December',
  coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  issnPrint: '2709-4189',
  issnOnline: '2709-4197',
  editorInChief: 'Prof. Dr. [REPLACE EDITOR-IN-CHIEF NAME]',
  editorialBoardCount: 18,
  publishedArticlesCount: 12,
  editorialBoard: [
    {
      name: 'Prof. Dr. [REPLACE VC]',
      designation: 'Patron & Vice Chancellor',
      institution: 'JSTU'
    },
    {
      name: 'Prof. Dr. [REPLACE EDITOR]',
      designation: 'Editor-in-Chief',
      institution: 'Faculty of Engineering, JSTU'
    },
    {
      name: 'Dr. Md. Tariqul Islam',
      designation: 'Executive Editor',
      institution: 'Department of CSE, JSTU'
    },
    {
      name: 'Prof. Dr. M. Shamsul Haque',
      designation: 'Associate Editor (Bio-Sciences)',
      institution: 'Department of Fisheries, JSTU'
    },
    {
      name: 'Prof. Dr. Elizabeth Thorne',
      designation: 'International Editorial Member',
      institution: 'University of Cambridge, UK'
    },
    {
      name: 'Prof. Dr. Kenji Sato',
      designation: 'International Editorial Member',
      institution: 'Tokyo Institute of Technology, Japan'
    }
  ]
};

export const researchGrantsData: ResearchGrantScheme[] = [
  {
    id: 'grant-1',
    title: 'JSTU Internal Annual Faculty Research Grant 2026-2027',
    titleBn: 'জেএসটিইউ অভ্যন্তরীণ বার্ষিক শিক্ষক গবেষণা অনুদান ২০২৬-২০২৭',
    fundingBody: 'University Grants Commission (UGC) & JSTU Revenue Fund',
    fundingBodyBn: 'বিশ্ববিদ্যালয় মঞ্জুরি কমিশন (ইউজিসি) ও জেএসটিইউ রাজস্ব তহবিল',
    grantRange: 'BDT 200,000 to 500,000 per project',
    grantRangeBn: 'প্রকল্প প্রতি ২,০০,০০০ থেকে ৫,০০,০০০ টাকা',
    deadline: 'November 30, 2026',
    deadlineBn: '৩০ নভেম্বর ২০২৬',
    description: 'Competitive annual seed funding awarded to full-time faculty investigators for basic and applied scientific inquiries.',
    descriptionBn: 'মৌলিক ও ফলিত বিজ্ঞান গবেষণার জন্য বিশ্ববিদ্যালয়ের নিয়মিত শিক্ষকদের জন্য প্রতিযোগিতামূলক সিড ফান্ডিং।'
  },
  {
    id: 'grant-2',
    title: 'Special Research Grant on Delta Resilience & Local Innovation',
    titleBn: 'বদ্বীপ সহনশীলতা ও স্থানীয় উদ্ভাবন বিষয়ক বিশেষ গবেষণা অনুদান',
    fundingBody: 'Ministry of Science & Technology, Government of Bangladesh',
    fundingBodyBn: 'বিজ্ঞান ও প্রযুক্তি মন্ত্রণালয়, গণপ্রজাতন্ত্রী বাংলাদেশ সরকার',
    grantRange: 'BDT 500,000 to 1,500,000 per consortium',
    grantRangeBn: 'কনসোর্টিয়াম প্রতি ৫,০০,০০০ থেকে ১৫,০০,০০০ টাকা',
    deadline: 'December 15, 2026',
    deadlineBn: '১৫ ডিসেম্বর ২০২৬',
    description: 'Targeted funding for research teams addressing regional flood mitigation, riverine sustainable aquaculture, and renewable clean power.',
    descriptionBn: 'আঞ্চলিক বন্যা ব্যবস্থাপনা, নদী অববাহিকার টেকসই মৎস্য চাষ এবং নবায়নযোগ্য জ্বালানি প্রকল্পের জন্য বিশেষ অনুদান।'
  }
];
