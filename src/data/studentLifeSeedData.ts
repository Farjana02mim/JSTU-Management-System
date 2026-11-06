import {
  ResidentialHall,
  HallSeatApplication,
  StudentClub,
  ClubMembershipApplication,
  SportsFacility,
  SportsTournament,
  SportsBooking,
  MedicalDoctor,
  MedicalService,
  MedicalAppointment,
  MedicalDutyShift,
  MedicalHealthTip,
  EmergencyContact,
  TransportRoute,
  Alumnus,
  AlumniRegistrationRequest,
  MedicalVisitRecord,
  PatientRecordAccessLog,
  MedicalRestCertificate
} from '../types/studentLife';

export const initialHallsData: ResidentialHall[] = [
  {
    id: 'hall-bb',
    name: 'Bangabandhu Sheikh Mujibur Rahman Hall',
    nameBn: 'বঙ্গবন্ধু শেখ মুজিবুর রহমান হল',
    type: 'male',
    established: 2013,
    location: 'North Campus, Beside Central Lake',
    locationBn: 'উত্তর ক্যাম্পাস, কেন্দ্রীয় লেকের পাশে',
    provost: {
      name: 'Prof. Dr. Md. Rafiqul Islam',
      nameBn: 'অধ্যাপক ড. মো. রফিকুল ইসলাম',
      designation: 'Professor, Dept. of CSE & Provost',
      email: 'provost.bsmrhall@jstu.ac.bd',
      phone: '+880 1711-209988',
      officeRoom: 'Block A, Room 102'
    },
    capacity: 650,
    currentResidents: 612,
    roomTypes: [
      { name: '4-Seater Standard Room', nameBn: '৪-আসন বিশিষ্ট সাধারণ কক্ষ', capacity: 4, feePerMonth: 350, availableBeds: 24, totalBeds: 520 },
      { name: '2-Seater Senior/M.Sc Room', nameBn: '২-আসন বিশিষ্ট মাস্টার্স কক্ষ', capacity: 2, feePerMonth: 600, availableBeds: 10, totalBeds: 90 },
      { name: 'Single Research Scholar Room', nameBn: 'একক গবেষক কক্ষ', capacity: 1, feePerMonth: 1200, availableBeds: 4, totalBeds: 40 }
    ],
    amenities: [
      'High-Speed Wi-Fi (Gigabit Fiber)',
      'Modern Dining Mess (Subsidized Food)',
      '24/7 Reading Room with AC',
      'Table Tennis & Carrom Indoor Zone',
      'Hall Mosque & Prayer Hall',
      'Gymnasium & Fitness Corner',
      'RO Clean Drinking Water Filters on Each Floor',
      'CCTV Surveillance & Guarded Access'
    ],
    amenitiesBn: [
      'উচ্চগতির ওয়াই-ফাই (গিগাবিট ফাইবার)',
      'আধুনিক ডাইনিং মেস (ভর্তুকিযুক্ত খাবার)',
      '২৪/৭ শীতাতপ নিয়ন্ত্রিত পাঠকক্ষ',
      'টেবিল টেনিস ও ক্যারম ইনডোর জোন',
      'হল মসজিদ ও সুপরিসর অজুখানা',
      'জিমনেসিয়াম ও ফিটনেস কর্নার',
      'প্রতি ফ্লোরে আরও বিশুদ্ধ ফিল্টার পানি',
      'সিসিটিভি নজরদারি ও ২৪ ঘণ্টা নিরাপত্তা'
    ],
    diningFeePerMonth: 2800,
    messManager: 'Md. Al-Amin Talukder',
    messContact: '+880 1723-456789',
    description: 'Premier residential facility for undergraduate and postgraduate male students, featuring spacious courtyard, ventilated balconies, dedicated reading halls, and regular inter-block sports tournaments.',
    descriptionBn: 'স্নাতক ও স্নাতকোত্তর ছাত্রদের প্রধান আবাসিক হল। সবুজ চত্বর, আধুনিক ডাইনিং ও সার্বক্ষণিক ওয়াই-ফাই সুবিধার মনোরম পরিবেশ।',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
    rules: [
      'Entry gate closes strictly at 10:30 PM (permission required for late research work).',
      'Smoking, narcotics, and ragging are strictly forbidden with zero-tolerance expulsion.',
      'Visitors are allowed in guest parlor only between 4:00 PM and 7:00 PM.',
      'Electrical appliances exceeding 500W require special hall warden permit.'
    ],
    rulesBn: [
      'রাত ১০:৩০ টায় হলের প্রধান ফটক বন্ধ হয় (গবেষণার কাজে অনুমতি সাপেক্ষে ব্যতিক্রম)।',
      'ধূমপান, মাদক ও র‍্যাগিং সম্পূর্ণ নিষিদ্ধ এবং তাৎক্ষণিক বহিষ্কারযোগ্য অপরাধ।',
      'অতিথিদের শুধুমাত্র বিকেল ৪:০০ থেকে সন্ধ্যা ৭:০০ পর্যন্ত অতিথি কক্ষে সাক্ষাৎ অনুমোদিত।'
    ]
  },
  {
    id: 'hall-sfm',
    name: 'Sheikh Fazilatunnesa Mujib Hall',
    nameBn: 'শেখ ফজিলাতুন্নেছা মুজিব হল',
    type: 'female',
    established: 2014,
    location: 'South Campus, Botanical Garden Road',
    locationBn: 'দক্ষিণ ক্যাম্পাস, বোটানিক্যাল গার্ডেন রোড',
    provost: {
      name: 'Dr. Tahmina Akter',
      nameBn: 'ড. তাহমিনা আক্তার',
      designation: 'Associate Professor, Dept. of Mathematics & Provost',
      email: 'provost.sfmhall@jstu.ac.bd',
      phone: '+880 1714-887766',
      officeRoom: 'Main Administrative Wing, Room 101'
    },
    capacity: 550,
    currentResidents: 520,
    roomTypes: [
      { name: '4-Seater Standard Room', nameBn: '৪-আসন বিশিষ্ট সাধারণ কক্ষ', capacity: 4, feePerMonth: 350, availableBeds: 18, totalBeds: 440 },
      { name: '2-Seater Senior/M.Sc Room', nameBn: '২-আসন বিশিষ্ট মাস্টার্স কক্ষ', capacity: 2, feePerMonth: 600, availableBeds: 8, totalBeds: 80 },
      { name: 'Single Scholar Room', nameBn: 'একক গবেষক কক্ষ', capacity: 1, feePerMonth: 1200, availableBeds: 4, totalBeds: 30 }
    ],
    amenities: [
      '24/7 Multi-Tier Lady Guard Security & Biometric Turnstiles',
      'Spacious Dining Hall with Hygienic Kitchen',
      'Air-Conditioned Quiet Study Room',
      'Lush Inner Garden & Badminton Court',
      'Laundry & Utility Area with Washing Points',
      'Medical First Aid Room & Emergency Van Callout',
      'High-Speed Wi-Fi on Every Wing',
      'Common Television Lounge and Cultural Rehearsal Room'
    ],
    amenitiesBn: [
      '২৪/৭ মহিলা নিরাপত্তা প্রহরী ও বায়োমেট্রিক গেট নিরাপত্তা',
      'স্বাস্থ্যসম্মত কিচেন ও সুবিশাল ডাইনিং মেস',
      'শীতাতপ নিয়ন্ত্রিত নিরিবিলি রিডিং রুম',
      'অভ্যন্তরীণ ফুলের বাগান ও ব্যাডমিন্টন কোর্ট',
      'লন্ড্রি ও আধুনিক ইউটিলিটি ওয়াশিং পয়েন্ট',
      'প্রাথমিক চিকিৎসা কক্ষ ও সার্বক্ষণিক অ্যাম্বুলেন্স সংযোগ',
      'সকল উইংয়ে নিরবচ্ছিন্ন ওয়াই-ফাই নেটওয়ার্ক',
      'টিভি লাউঞ্জ ও সাংস্কৃতিক মহড়া কক্ষ'
    ],
    diningFeePerMonth: 2700,
    messManager: 'Mrs. Rokeya Begum',
    messContact: '+880 1734-998877',
    description: 'Safe, comfortable, and modern residential sanctuary for female students with high security, lush internal garden, dedicated reading facilities, and student welfare council.',
    descriptionBn: 'ছাত্রীদের জন্য নিরাপদ ও শান্তিময় আবাসন। অত্যাধুনিক নিরাপত্তা ব্যবস্থা, নিরিবিলি পড়াশোনার পরিবেশ ও সার্বিক কল্যাণ ব্যবস্থাপনা।',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    rules: [
      'Hall entrance closes at 8:00 PM (written intimation needed for academic lab/fieldwork).',
      'Only registered guardians with valid identity card may visit in visiting hours.',
      'Cleanliness of rooms and balconies is inspected by house tutors on fortnightly basis.'
    ],
    rulesBn: [
      'রাত ৮:০০ টায় হলের গেট বন্ধ হয় (ল্যাব বা ফিল্ডওয়ার্কের ক্ষেত্রে পূর্বানুমতি বাধ্যতামূলক)।',
      'হলে নিবন্ধিত অভিভাবকগণ পরিচয়পত্র প্রদর্শনপূর্বক নির্ধারিত সময়ে দেখা করতে পারবেন।',
      'কক্ষের পরিষ্কার-পরিচ্ছন্নতা নিয়মিত হাউজ টিউটর কর্তৃক পর্যবেক্ষণ করা হয়।'
    ]
  },
  {
    id: 'hall-maw',
    name: 'Dr. M. A. Wazed Miah Hall',
    nameBn: 'ড. এম. এ. ওয়াজেদ মিয়া হল',
    type: 'male',
    established: 2021,
    location: 'East Wing, Science Complex Boulevard',
    locationBn: 'পূর্ব উইং, সায়েন্স কমপ্লেক্স বুলেভার্ড',
    provost: {
      name: 'Dr. Md. Enamul Kabir',
      nameBn: 'ড. মো. এনামুল কবির',
      designation: 'Associate Professor, Dept. of EEE & Provost',
      email: 'provost.wazedhall@jstu.ac.bd',
      phone: '+880 1712-334455',
      officeRoom: 'Ground Floor Provost Complex'
    },
    capacity: 400,
    currentResidents: 360,
    roomTypes: [
      { name: '4-Seater Deluxe Room', nameBn: '৪-আসন বিশিষ্ট ডিলাক্স কক্ষ', capacity: 4, feePerMonth: 400, availableBeds: 28, totalBeds: 320 },
      { name: '2-Seater Senior Room', nameBn: '২-আসন বিশিষ্ট সিনিয়র কক্ষ', capacity: 2, feePerMonth: 700, availableBeds: 12, totalBeds: 80 }
    ],
    amenities: [
      'Eco-Friendly Solar-Powered Hot Water Facility',
      'Central High-Speed Fiber Optic Wi-Fi',
      'Smart Card Access Control',
      'Modern Gymnasium with Cardio & Weights',
      'Automated Mess Billing & Token Kiosk',
      'Conference & Debate Hall with Projector',
      'Elevator / Lift Service (6 Floors)'
    ],
    amenitiesBn: [
      'পরিবেশবান্ধব সৌরবিদ্যুৎ ও সোলার হট ওয়াটার সুবিধা',
      'সেন্ট্রাল হাই-স্পিড ফাইবার অপটিক ইন্টারনেট',
      'স্মার্ট কার্ড ও বায়োমেট্রিক প্রবেশাধিকার',
      'কার্ডিও ও আধুনিক সরঞ্জামসমৃদ্ধ জিমনেসিয়াম',
      'ডিজিটাল মেস টোকেন ও স্বয়ংক্রিয় বিলিং কিয়স্ক',
      'প্রজেক্টরযুক্ত কনফারেন্স ও বিতর্ক রুম',
      '৬ তলা বিশিষ্ট আধুনিক লিফট সুবিধা'
    ],
    diningFeePerMonth: 2900,
    messManager: 'Md. Tariqul Islam',
    messContact: '+880 1715-667788',
    description: 'State-of-the-art newly constructed residential hall for science and engineering students equipped with lifts, solar panels, and smart facilities.',
    descriptionBn: 'বিজ্ঞান ও প্রকৌশল শিক্ষার্থীদের জন্য নবনির্মিত অত্যাধুনিক আবাসিক হল। লিফট, সোলার প্যানেল ও ডিজিটাল সুবিধা সম্বলিত।',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    rules: [
      'Zero tolerance for anti-social conduct or damaging hall electronics.',
      'Main gate closes at 10:30 PM sharp.'
    ],
    rulesBn: [
      'হলের সম্পদ ও ইলেকট্রনিক্স ক্ষতিসাধন বা বিশৃঙ্খলা সৃষ্টির বিরুদ্ধে জিরো টলারেন্স নীতি।',
      'রাত ১০:৩০ টায় প্রধান ফটক বন্ধ হয়।'
    ]
  }
];

export const initialHallApplicationsData: HallSeatApplication[] = [
  {
    id: 'hall-app-01',
    referenceId: 'JSTU-HALL-2026-0042',
    hallId: 'hall-bb',
    hallName: 'Bangabandhu Sheikh Mujibur Rahman Hall',
    hallNameBn: 'বঙ্গবন্ধু শেখ মুজিবুর রহমান হল',
    studentId: 'JSTU2026001',
    studentName: 'Tanvir Ahmed',
    rollNumber: '2026001',
    department: 'Computer Science & Engineering',
    session: '2022-2023',
    currentSemester: 'Year 3 Term 1',
    cgpa: 3.84,
    gender: 'male',
    homeDistrict: 'Patuakhali',
    distanceKm: 340,
    guardianAnnualIncome: 180000,
    preferredRoomType: '4-Seater Standard Room',
    emergencyContact: '+880 1711-998877',
    reason: 'Residing in distant southern coastal district (Patuakhali, >340km). Need hall accommodation to maintain consistent academic performance and lab work.',
    status: 'allocated',
    allocatedRoomNumber: '308',
    allocatedBedNumber: 'Bed-B',
    appliedAt: '2026-09-15T10:00:00Z',
    reviewedAt: '2026-09-22T14:30:00Z',
    remarks: 'Approved based on merit (CGPA 3.84) and distant district criteria.'
  },
  {
    id: 'hall-app-02',
    referenceId: 'JSTU-HALL-2026-0089',
    hallId: 'hall-sfm',
    hallName: 'Sheikh Fazilatunnesa Mujib Hall',
    hallNameBn: 'শেখ ফজিলাতুন্নেছা মুজিব হল',
    studentId: 'JSTU2026002',
    studentName: 'Sadia Afrin',
    rollNumber: '2026002',
    department: 'Computer Science & Engineering',
    session: '2022-2023',
    currentSemester: 'Year 3 Term 1',
    cgpa: 3.92,
    gender: 'female',
    homeDistrict: 'Cox’s Bazar',
    distanceKm: 460,
    guardianAnnualIncome: 210000,
    preferredRoomType: '4-Seater Standard Room',
    emergencyContact: '+880 1715-443322',
    reason: 'Permanent address in Cox’s Bazar. Daily travel is impossible.',
    status: 'allocated',
    allocatedRoomNumber: '214',
    allocatedBedNumber: 'Bed-A',
    appliedAt: '2026-09-12T11:20:00Z',
    reviewedAt: '2026-09-19T09:15:00Z',
    remarks: 'Priority allocation: high CGPA and furthest geographical distance.'
  },
  {
    id: 'hall-app-03',
    referenceId: 'JSTU-HALL-2026-0112',
    hallId: 'hall-maw',
    hallName: 'Dr. M. A. Wazed Miah Hall',
    hallNameBn: 'ড. এম. এ. ওয়াজেদ মিয়া হল',
    studentId: 'JSTU2026005',
    studentName: 'Arif Faisal',
    rollNumber: '2026005',
    department: 'Computer Science & Engineering',
    session: '2022-2023',
    currentSemester: 'Year 3 Term 1',
    cgpa: 3.65,
    gender: 'male',
    homeDistrict: 'Bogura',
    distanceKm: 145,
    guardianAnnualIncome: 240000,
    preferredRoomType: '4-Seater Deluxe Room',
    emergencyContact: '+880 1729-112233',
    reason: 'Requires hall residence for final year project and hardware lab access.',
    status: 'under_review',
    appliedAt: '2026-10-02T16:00:00Z'
  }
];

export const initialClubsData: StudentClub[] = [
  {
    id: 'club-cse',
    code: 'JSTUCC',
    name: 'JSTU Computer Club',
    nameBn: 'জেএসটিইউ কম্পিউটার ক্লাব',
    category: 'technology',
    establishedYear: 2013,
    motto: 'Coding Tomorrow’s Bangladesh',
    mottoBn: 'আগামীর প্রযুক্তির বাংলাদেশ বিনির্মাণে',
    president: 'Tanvir Ahmed (CSE 6th Sem)',
    generalSecretary: 'Sadia Afrin (CSE 6th Sem)',
    advisor: 'Dr. Shahadat Hossain',
    advisorDept: 'Dept. of Computer Science & Engineering',
    memberCount: 420,
    weeklyMeetingTime: 'Every Thursday, 4:30 PM',
    roomLocation: 'Student Activity Center (SAC), Room 204',
    email: 'computerclub@jstu.ac.bd',
    phone: '+880 1711-223344',
    badgeColor: 'bg-blue-600',
    description: 'Organizes intra-university competitive programming camps, national hackathons, web development bootcamps, and open-source contributions.',
    descriptionBn: 'প্রোগ্রামিং ক্যাম্প, জাতীয় হ্যাকাথন, ওয়েব ডেভেলপমেন্ট ও কৃত্রিম বুদ্ধিমত্তা বিষয়ক কর্মশালা আয়োজনের অগ্রদূত।',
    activities: [
      'Weekly Problem Solving & ICPC Mentorship Sessions',
      'Annual JSTU Inter-University Hackathon',
      'AI & Machine Learning Crash Course for Undergrads',
      'Cybersecurity & Capture the Flag (CTF) Drills'
    ],
    activitiesBn: [
      'সাপ্তাহিক প্রোগ্রামিং কনটেস্ট ও আইসিপিসি মেন্টরশিপ',
      'বার্ষিক জেএসটিইউ আন্তঃবিশ্ববিদ্যালয় হ্যাকাথন',
      'এআই ও মেশিন লার্নিং বুটক্যাম্প',
      'সাইবার সিকিউরিটি ও সিটিএফ প্র্যাকটিস সেশন'
    ],
    upcomingEvents: [
      { title: 'JSTU National Programming Contest 2026', titleBn: 'জাতীয় প্রোগ্রামিং প্রতিযোগিতা ২০২৬', date: '2026-11-20', venue: 'Central Lab 1 & 2' },
      { title: 'Full-Stack React & Cloud Workshop', titleBn: 'ফুল-স্ট্যাক রিঅ্যাক্ট ও ক্লাউড কর্মশালা', date: '2026-10-28', venue: 'Auditorium' }
    ]
  },
  {
    id: 'club-robotics',
    code: 'JSTURC',
    name: 'JSTU Robotics & Automation Club',
    nameBn: 'জেএসটিইউ রোবোটিক্স অ্যান্ড অটোমেশন ক্লাব',
    category: 'technology',
    establishedYear: 2015,
    motto: 'Innovate, Fabricate, Automate',
    mottoBn: 'উদ্ভাবন, নির্মাণ ও স্বয়ংক্রিয়তা',
    president: 'Md. Rakibul Hasan (EEE)',
    generalSecretary: 'Tanmoy Sen (CSE)',
    advisor: 'Dr. Md. Enamul Kabir',
    advisorDept: 'Dept. of EEE',
    memberCount: 260,
    weeklyMeetingTime: 'Every Sunday, 5:00 PM',
    roomLocation: 'Robotics Innovation Lab, Academic Bldg 2',
    email: 'robotics@jstu.ac.bd',
    phone: '+880 1718-445566',
    badgeColor: 'bg-indigo-600',
    description: 'Pioneering student-led robotics research, autonomous drones, Line Follower Robot (LFR) contests, and IoT environmental monitoring devices for agriculture.',
    descriptionBn: 'রোবটিক্স, ড্রোন প্রযুক্তি, স্বয়ংক্রিয় রোবট এবং কৃষি-আইওটি যন্ত্র উদ্ভাবনে নিবেদিত সংগঠন।',
    activities: [
      'Microcontroller (ESP32, STM32, Arduino) Hardware Workshops',
      '3D Printing & CAD Design for Drone Chassis',
      'Agricultural Drone & Soil Sensor Prototyping'
    ],
    activitiesBn: [
      'মাইক্রোকন্ট্রোলার ও সেন্সর ইন্টারফেসিং কর্মশালা',
      'থ্রিডি প্রিন্টিং ও রোবট ক্যাড মডেলিং',
      'স্মার্ট কৃষি ড্রোন ও সেচ সেন্সর উদ্ভাবন'
    ],
    upcomingEvents: [
      { title: 'BattleBots Arena & LFR Sprint 2026', titleBn: 'ব্যাটলবটস ও এলএফআর স্প্রিন্ট ২০২৬', date: '2026-11-15', venue: 'SAC Open Courtyard' }
    ]
  },
  {
    id: 'club-debate',
    code: 'JSTUDS',
    name: 'JSTU Debating Society',
    nameBn: 'জেএসটিইউ ডিবেটিং সোসাইটি',
    category: 'debate',
    establishedYear: 2014,
    motto: 'Logic Over Loudness, Truth in Reason',
    mottoBn: 'যুক্তির শাণিত শক্তিতে সত্যের অনুসন্ধান',
    president: 'Fahmida Haque (CSE)',
    generalSecretary: 'Sabbir Rahman (BBA)',
    advisor: 'Dr. Nazmul Huda',
    advisorDept: 'Dept. of Management',
    memberCount: 310,
    weeklyMeetingTime: 'Every Monday & Wednesday, 5:00 PM',
    roomLocation: 'SAC Room 201 (Debate Chamber)',
    email: 'debate@jstu.ac.bd',
    phone: '+880 1719-778899',
    badgeColor: 'bg-emerald-600',
    description: 'Championship-winning debate club active in Parliamentary Debate, Barowari, and Asian Parliamentary formats in both Bangla and English.',
    descriptionBn: 'বাংলা ও ইংরেজি সংসদীয় বিতর্ক, বারোয়ারি বিতর্ক এবং জাতীয় বিতর্ক উৎসবের নিয়মিত চ্যাম্পিয়ন সংগঠন।',
    activities: [
      'Public Speaking and Critical Thinking Workshops',
      'Bilingual Parliamentary Debate League',
      'Inter-Department Debate Championship'
    ],
    activitiesBn: [
      'বক্তৃতা কলা ও বিশ্লেষণাত্মক চিন্তার প্রশিক্ষণ',
      'দ্বিভাষিক সংসদীয় বিতর্ক প্রতিযোগিতা',
      'আন্তঃবিভাগীয় বিতর্ক উৎসব'
    ],
    upcomingEvents: [
      { title: 'National Inter-University Debate Festival', titleBn: 'জাতীয় আন্তঃবিশ্ববিদ্যালয় বিতর্ক উৎসব', date: '2026-12-05', venue: 'Central Auditorium' }
    ]
  },
  {
    id: 'club-badhan',
    code: 'BADHAN',
    name: 'Badhan (JSTU Blood Donors Unit)',
    nameBn: 'বাঁধন (জেএসটিইউ স্বেচ্ছায় রক্তদাতাদের সংগঠন)',
    category: 'service',
    establishedYear: 2013,
    motto: 'One Bag of Blood, A Precious Life Saved',
    mottoBn: 'এক ব্যাগ রক্ত, একটি সুন্দর জীবন',
    president: 'Mahmudur Rahman',
    generalSecretary: 'Kamrul Hasan',
    advisor: 'Dr. M. R. Karim (Chief Medical Officer)',
    advisorDept: 'University Medical Center',
    memberCount: 580,
    weeklyMeetingTime: 'Daily Blood Helpline Operates 24/7',
    roomLocation: 'Medical Center Annex, Ground Floor',
    email: 'badhan@jstu.ac.bd',
    phone: '+880 1710-123456',
    badgeColor: 'bg-rose-600',
    description: 'Voluntary blood donors network maintaining a real-time donor directory for Jamalpur General Hospital, Melandaha, and surrounding healthcare facilities.',
    descriptionBn: 'জামালপুর জেলা ও পার্শ্ববর্তী অঞ্চলের রোগীদের জন্য ২৪ ঘণ্টা বিনামূল্যে জরুরি রক্তের ব্যবস্থা নিশ্চিতকারী সংগঠন।',
    activities: [
      '24/7 Emergency Blood Donor Dispatching',
      'Free Blood Grouping Camps for Freshers & School Children',
      'Thalassemia Awareness Drives & Voluntary Camps'
    ],
    activitiesBn: [
      'জরুরি প্রয়োজনে ২৪ ঘণ্টা রক্তদাতা সমন্বয়',
      'বিনামূল্যে রক্তের গ্রুপ নির্ণয় কর্মসূচি',
      'থ্যালাসেমিয়া সচেতনতা ও নিয়মিত রক্তদান ক্যাম্পেইন'
    ],
    upcomingEvents: [
      { title: 'Grand Blood Grouping Camp for Freshers', titleBn: 'নবীন শিক্ষার্থীদের ফ্রি ব্লাড গ্রুপিং ক্যাম্প', date: '2026-10-30', venue: 'Admin Building Foyer' }
    ]
  },
  {
    id: 'club-cultural',
    code: 'SURJOTORUN',
    name: 'Surjo Torun Cultural Society',
    nameBn: 'সূর্য তরুণ সাংস্কৃতিক সংসদ',
    category: 'cultural',
    establishedYear: 2013,
    motto: 'Preserving Bengali Heritage & Arts',
    mottoBn: 'বাঙালির শিল্প-সংস্কৃতির অন্বেষণে',
    president: 'Anika Tabassum',
    generalSecretary: 'Rajib Roy',
    advisor: 'Prof. Dr. Shamim Ara Begum',
    advisorDept: 'Dept. of Mathematics',
    memberCount: 390,
    weeklyMeetingTime: 'Tuesday & Friday, 5:30 PM',
    roomLocation: 'SAC Rehearsal Hall, 1st Floor',
    email: 'cultural@jstu.ac.bd',
    phone: '+880 1713-556677',
    badgeColor: 'bg-amber-600',
    description: 'Celebrates Pohela Boishakh, Ekushey February, Victory Day, drama productions, folk song festivals, and classical instrumental recitals.',
    descriptionBn: 'নাটক, সংগীত, নৃত্য ও ঐতিহ্যবাহী বাংলা উৎসবসমূহের বর্ণাঢ্য আয়োজক।',
    activities: [
      'Rabindra-Nazrul-Lalon Song Evenings',
      'Annual Theater Production & Street Drama',
      'Pohela Boishakh Mangal Shobhajatra Organization'
    ],
    activitiesBn: [
      'রবীন্দ্র, নজরুল ও লালন সংগীত সন্ধ্যা',
      'বার্ষিক পথনাটক ও মঞ্চনাটক প্রদর্শনী',
      'পহেলা বৈশাখ মঙ্গল শোভাযাত্রা আয়োজন'
    ],
    upcomingEvents: [
      { title: 'Autumn Cultural Night & Folk Festival', titleBn: 'শরৎ সাংস্কৃতিক সন্ধ্যা ও লোকজ উৎসব', date: '2026-11-08', venue: 'Open Air Amphitheatre' }
    ]
  },
  {
    id: 'club-scout',
    code: 'JSTURS',
    name: 'JSTU Rover Scout Group',
    nameBn: 'জেএসটিইউ রোভার স্কাউট গ্রুপ',
    category: 'service',
    establishedYear: 2014,
    motto: 'Service to Humanity, Discipline in Action',
    mottoBn: 'সেবা ও শৃঙ্খলায় দেশসেবা',
    president: 'Dr. Md. Kabir Hossain',
    generalSecretary: 'Md. Shakil Ahmed',
    advisor: 'Md. Abdul Mannan (Registrar)',
    advisorDept: 'Office of Registrar',
    memberCount: 220,
    weeklyMeetingTime: 'Every Saturday, 8:00 AM',
    roomLocation: 'Scout Den, East Field Pavilion',
    email: 'roverscout@jstu.ac.bd',
    phone: '+880 1716-889900',
    badgeColor: 'bg-teal-600',
    description: 'Instills leadership, campcraft, flood disaster response, convocation ceremonial order, and community tree plantation programs.',
    descriptionBn: 'দুর্যোগ ব্যবস্থাপনা, বৃক্ষরোপণ, সমাবর্তন শৃঙ্খলা ও স্কাউটিং প্রশিক্ষণ সংগঠন।',
    activities: [
      'Annual Rover Moot & Survival Camping',
      'Disaster Relief & Flood Medical Aid Missions',
      'Campus Cleanliness & Afforestation Drives'
    ],
    activitiesBn: [
      'বার্ষিক রোভার মুট ও সারভাইভাল ক্যাম্প',
      'বন্যা ও দুর্যোগে ত্রাণ বিতরণ কার্যক্রম',
      'ক্যাম্পাস পরিচ্ছন্নতা ও বৃক্ষরোপণ অভিযান'
    ],
    upcomingEvents: [
      { title: 'Winter Rover Camp & Training Camp 2026', titleBn: 'শীতকালীন রোভার ক্যাম্প ২০২৬', date: '2026-12-18', venue: 'Central Playground Campsite' }
    ]
  },
  {
    id: 'club-photo',
    code: 'JSTUPC',
    name: 'JSTU Photography Club',
    nameBn: 'জেএসটিইউ ফটোগ্রাফি ক্লাব',
    category: 'cultural',
    establishedYear: 2016,
    motto: 'Capturing Moments, Creating History',
    mottoBn: 'দৃশ্যের অন্তরালে অনুভূতির স্পন্দন',
    president: 'Mehedi Hasan',
    generalSecretary: 'Sumaiya Akter',
    advisor: 'Dr. Farhana Yasmin',
    advisorDept: 'Dept. of Fisheries',
    memberCount: 240,
    weeklyMeetingTime: 'Every Monday, 4:00 PM',
    roomLocation: 'SAC Darkroom & Media Lab 102',
    email: 'photo@jstu.ac.bd',
    phone: '+880 1714-332211',
    badgeColor: 'bg-purple-600',
    description: 'Promotes visual storytelling, wildlife photography of the Brahmaputra wetlands, campus photo walks, and national photo exhibitions.',
    descriptionBn: 'আলোকচিত্র প্রদর্শনী, ফটোওয়াক, ক্যামেরা কর্মশালা ও ক্যাম্পাস ডকুমেন্টেশনের সংগঠন।',
    activities: [
      'Photowalks to Brahmaputra Riverbanks & Garo Hills',
      'DSLR and Drone Cinematography Masterclasses',
      'Annual National Photo Exhibition with Cash Prizes'
    ],
    activitiesBn: [
      'নদী তীরবর্তী অঞ্চলে ফটোওয়াক ও ওয়াইল্ডলাইফ ফটোগ্রাফি',
      'ডিএসএলআর ও ড্রোন সিনেমাটোগ্রাফি কর্মশালা',
      'জাতীয় আলোকচিত্র প্রদর্শনী ও প্রতিযোগিতা'
    ],
    upcomingEvents: [
      { title: 'Through the Lens: National Photo Expo 2026', titleBn: 'জাতীয় আলোকচিত্র প্রদর্শনী ২০২৬', date: '2026-11-25', venue: 'University Gallery Hall' }
    ]
  },
  {
    id: 'club-sports',
    code: 'JSTUSC',
    name: 'JSTU Sports & Athletics Club',
    nameBn: 'জেএসটিইউ স্পোর্টস অ্যান্ড অ্যাথলেটিকস ক্লাব',
    category: 'sports',
    establishedYear: 2013,
    motto: 'Strength, Sportsmanship, Victory',
    mottoBn: 'শক্তিমত্তা, খেলোয়াড়সুলভ মনোভাব ও বিজয়',
    president: 'Rashedul Islam',
    generalSecretary: 'Arif Faisal',
    advisor: 'Director of Physical Education',
    advisorDept: 'Physical Education Office',
    memberCount: 450,
    weeklyMeetingTime: 'Daily Practice, 4:00 PM - 6:30 PM',
    roomLocation: 'Gymnasium Pavilion Office',
    email: 'sportsclub@jstu.ac.bd',
    phone: '+880 1717-990011',
    badgeColor: 'bg-orange-600',
    description: 'Coordinates university cricket, football, volleyball, badminton, athletics, chess leagues, and represents JSTU at National University Games.',
    descriptionBn: 'বিশ্ববিদ্যালয়ের ক্রিকেট, ফুটবল, ভলিবল ও অ্যাথলেটিকস দলের সমন্বয়ক।',
    activities: [
      'Inter-Department Cricket & Football Tournaments',
      'Night Badminton Fest under Floodlights',
      'Fitness Training, Marathon & Table Tennis League'
    ],
    activitiesBn: [
      'আন্তঃবিভাগ ক্রিকেট ও ফুটবল টুর্নামেন্ট',
      'ফ্লাডলাইট নাইট ব্যাডমিন্টন ফেস্ট',
      'ফিটনেস ট্রেনিং, ম্যারাথন ও টেবিল টেনিস লিগ'
    ],
    upcomingEvents: [
      { title: 'Vice Chancellor Gold Cup Football 2026', titleBn: 'উপাচার্য গোল্ডকাপ ফুটবল ২০২৬', date: '2026-11-10', venue: 'Central Stadium' }
    ]
  }
];

export const initialSportsFacilitiesData: SportsFacility[] = [
  {
    id: 'fac-playground',
    name: 'Central Stadium & Cricket/Football Ground',
    nameBn: 'কেন্দ্রীয় স্টেডিয়াম ও ক্রিকেট/ফুটবল মাঠ',
    type: 'outdoor',
    capacity: '8,000 Spectators with Gallery',
    operatingHours: '6:00 AM - 6:30 PM (Daily)',
    supervisor: 'Md. Shahidul Alam (Physical Director)',
    supervisorPhone: '+880 1711-889977',
    amenities: ['Natural Turf Grass', '400m Running Track', 'Pavilion with Changing Rooms', 'LED Digital Scoreboard'],
    amenitiesBn: ['প্রাকৃতিক ঘাসের মাঠ', '৪০০ মিটার রানিং ট্র্যাক', 'চেঞ্জিং রুমযুক্ত প্যাভিলিয়ন', 'ডিজিটাল স্কোরবোর্ড'],
    equipmentAvailable: ['Cricket Kits', 'Leather Balls', 'Match Footballs', 'Corner Flags', 'Athletics Hurdles'],
    bookingAllowed: true,
    description: 'Full-sized standard turf field used for annual inter-department tournaments, athletics meet, and district university sports.',
    descriptionBn: 'আন্তর্জাতিক মানের আউটডোর স্টেডিয়াম ও রানিং ট্র্যাক। ক্রিকেট, ফুটবল ও বার্ষিক ক্রীড়া প্রতিযোগিতার প্রধান ভেন্যু।'
  },
  {
    id: 'fac-gym',
    name: 'Multipurpose Indoor Gymnasium',
    nameBn: 'মাল্টিপারপাস ইনডোর জিমনেসিয়াম',
    type: 'gym',
    capacity: '50 Athletes simultaneously',
    operatingHours: 'Morning: 6:30 AM - 9:00 AM | Evening: 4:00 PM - 8:30 PM',
    supervisor: 'Kawsar Mahmud (Fitness Instructor)',
    supervisorPhone: '+880 1715-665544',
    amenities: ['Commercial Treadmills', 'Smith Machines & Free Weights', 'AC Air Circulation', 'Rubber Shock Absorbing Flooring'],
    amenitiesBn: ['ট্রেডমিল ও কার্ডিও জোন', 'ফ্রি ওয়েটস ও স্মিথ মেশিন', 'শীতাতপ নিয়ন্ত্রণ ব্যবস্থা', 'রাবার অ্যান্টি-শক ফ্লোরিং'],
    equipmentAvailable: ['Dumbbells (2.5kg - 35kg)', 'Olympic Barbells', 'Resistance Bands', 'Yoga Mats'],
    bookingAllowed: true,
    description: 'Modern indoor gym with dedicated hours for male and female students and faculty members.',
    descriptionBn: 'শারীরিক সক্ষমতা ও ফিটনেস বৃদ্ধির জন্য আধুনিক সরঞ্জাম সজ্জিত ইনডোর জিম।'
  },
  {
    id: 'fac-badminton',
    name: 'Floodlit Synthetic Badminton & Volleyball Courts',
    nameBn: 'ফ্লাডলাইট সিন্থেটিক ব্যাডমিন্টন ও ভলিবল কোর্ট',
    type: 'court',
    capacity: '4 Simultaneous Match Courts',
    operatingHours: '4:00 PM - 10:00 PM',
    supervisor: 'Nurul Amin',
    supervisorPhone: '+880 1718-221100',
    amenities: ['Synthetic Anti-Slip Surface', 'Night LED Floodlight Towers', 'Court Side Seating Benches'],
    amenitiesBn: ['অ্যান্টি-স্লিপ সিন্থেটিক কোর্ট', 'নাইট এলইডি ফ্লাডলাইট টাওয়ার', 'দর্শকদের বসার সুব্যবস্থা'],
    equipmentAvailable: ['Yonex Rackets', 'Shuttlecocks', 'Adjustable Nets', 'Volleyballs'],
    bookingAllowed: true,
    description: 'Four tournament-standard synthetic outdoor courts with night illumination for year-round evening play.',
    descriptionBn: 'রাতের খেলার উপযোগী ফ্লাডলাইটযুক্ত সিন্থেটিক ব্যাডমিন্টন ও ভলিবল কোর্ট।'
  },
  {
    id: 'fac-tabletennis',
    name: 'Central Table Tennis & Chess Lounge',
    nameBn: 'সেন্ট্রাল টেবিল টেনিস ও দাবা লাউঞ্জ',
    type: 'indoor',
    capacity: '30 Players',
    operatingHours: '9:00 AM - 8:00 PM',
    supervisor: 'Kamal Pasha',
    supervisorPhone: '+880 1712-445566',
    amenities: ['Stiga Tournament TT Tables', 'Tournament Chess Clocks', 'Air Conditioned'],
    amenitiesBn: ['স্টিগা টুর্নামেন্ট টিটি টেবিল', 'ডিজিটাল দাবা ঘড়ি ও বোর্ড', 'শীতাতপ নিয়ন্ত্রিত'],
    equipmentAvailable: ['TT Paddles & Balls', 'FIDE Standard Chess Sets'],
    bookingAllowed: true,
    description: 'Indoor recreational space inside the Student Activity Center for quick breaks and tournament training.',
    descriptionBn: 'ইনডোর টেবিল টেনিস ও দাবা খেলার শান্ত মনোরম পরিবেশ।'
  }
];

export const initialSportsTournamentsData: SportsTournament[] = [
  {
    id: 'tour-01',
    title: 'Inter-Department Cricket Championship 2026',
    titleBn: 'আন্তঃবিভাগ ক্রিকেট চ্যাম্পিয়নশিপ ২০২৬',
    sport: 'Cricket',
    status: 'ongoing',
    date: '2026-10-15 to 2026-10-28',
    venue: 'Central Stadium',
    venueBn: 'কেন্দ্রীয় স্টেডিয়াম',
    participatingTeams: 7,
    highlights: 'CSE defeated EEE by 18 runs in the semifinal; Fisheries vs Management semi-final on Saturday.'
  },
  {
    id: 'tour-02',
    title: 'Vice Chancellor Football Cup 2025',
    titleBn: 'উপাচার্য ফুটবল কাপ ২০২৫',
    sport: 'Football',
    status: 'concluded',
    date: '2025-11-10',
    venue: 'Central Stadium',
    venueBn: 'কেন্দ্রীয় স্টেডিয়াম',
    participatingTeams: 8,
    champion: 'Dept. of Computer Science & Engineering (CSE)',
    runnerUp: 'Dept. of Geology & Mining Engineering (GEOL)',
    highlights: 'Thrilling 2-1 victory with extra-time goal in front of 4,000 cheering students.'
  },
  {
    id: 'tour-03',
    title: 'Annual Winter Badminton Tournament 2026',
    titleBn: 'বার্ষিক শীতকালীন ব্যাডমিন্টন টুর্নামেন্ট ২০২৬',
    sport: 'Badminton',
    status: 'upcoming',
    date: '2026-11-18 to 2026-11-22',
    venue: 'Floodlit Synthetic Courts',
    venueBn: 'ফ্লাডলাইট সিন্থেটিক কোর্ট',
    participatingTeams: 16
  }
];

export const initialMedicalDoctorsData: MedicalDoctor[] = [
  {
    id: 'doc-01',
    name: 'Chief Medical Officer [REPLACE WITH REAL CONTENT]',
    nameBn: 'প্রধান চিকিৎসা কর্মকর্তা [REPLACE WITH REAL CONTENT]',
    designation: 'Chief Medical Officer',
    designationBn: 'প্রধান চিকিৎসা কর্মকর্তা',
    degrees: 'MBBS, BCS (Health) [REPLACE WITH REAL CONTENT]',
    specialty: 'Internal Medicine & Emergency Critical Care',
    roomNumber: 'Room 101, Medical Center',
    dutyDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    dutyDaysBn: ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার'],
    dutyTime: '8:30 AM - 2:30 PM [REPLACE WITH REAL CONTENT]',
    phone: '+880 1700-000001 [REPLACE WITH REAL CONTENT]',
    availableToday: true
  },
  {
    id: 'doc-02',
    name: 'Senior Medical Officer [REPLACE WITH REAL CONTENT]',
    nameBn: 'সিনিয়র চিকিৎসা কর্মকর্তা [REPLACE WITH REAL CONTENT]',
    designation: 'Senior Medical Officer',
    designationBn: 'সিনিয়র চিকিৎসা কর্মকর্তা',
    degrees: 'MBBS, DGO, CCD [REPLACE WITH REAL CONTENT]',
    specialty: 'Women’s Health, Diabetology & Family Medicine',
    roomNumber: 'Room 103, Medical Center',
    dutyDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'],
    dutyDaysBn: ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার'],
    dutyTime: '9:00 AM - 3:00 PM [REPLACE WITH REAL CONTENT]',
    phone: '+880 1700-000002 [REPLACE WITH REAL CONTENT]',
    availableToday: true
  },
  {
    id: 'doc-03',
    name: 'Duty Dental Surgeon [REPLACE WITH REAL CONTENT]',
    nameBn: 'কর্তব্যরত ডেন্টাল সার্জন [REPLACE WITH REAL CONTENT]',
    designation: 'Medical Officer (Dental)',
    designationBn: 'চিকিৎসা কর্মকর্তা (ডেন্টাল)',
    degrees: 'BDS, PGT [REPLACE WITH REAL CONTENT]',
    specialty: 'Dental Surgery & Oral Health Care',
    roomNumber: 'Dental Clinic, Room 105',
    dutyDays: ['Monday', 'Wednesday', 'Thursday'],
    dutyDaysBn: ['সোমবার', 'বুধবার', 'বৃহস্পতিবার'],
    dutyTime: '9:00 AM - 2:00 PM [REPLACE WITH REAL CONTENT]',
    phone: '+880 1700-000003 [REPLACE WITH REAL CONTENT]',
    availableToday: false
  },
  {
    id: 'doc-04',
    name: 'Clinical Counselor [REPLACE WITH REAL CONTENT]',
    nameBn: 'ক্লিনিক্যাল কাউন্সিলর [REPLACE WITH REAL CONTENT]',
    designation: 'Student Mental Health & Clinical Counselor',
    designationBn: 'ক্লিনিক্যাল সাইকোলজিস্ট ও কাউন্সিলর',
    degrees: 'B.Sc (Hons), M.Sc in Clinical Psychology [REPLACE WITH REAL CONTENT]',
    specialty: 'Mental Well-being, Exam Anxiety & Psychotherapy',
    roomNumber: 'Counseling Cell, Room 202',
    dutyDays: ['Sunday', 'Tuesday', 'Thursday'],
    dutyDaysBn: ['রবিবার', 'মঙ্গলবার', 'বৃহস্পতিবার'],
    dutyTime: '10:00 AM - 4:00 PM [REPLACE WITH REAL CONTENT]',
    phone: '+880 1700-000004 [REPLACE WITH REAL CONTENT]',
    availableToday: true
  }
];

export const initialMedicalServicesData: MedicalService[] = [
  {
    id: 'med-srv-01',
    title: 'Free General Consultation',
    titleBn: 'বিনামূল্যে সাধারণ চিকিৎসা পরামর্শ',
    description: 'Experienced registered physicians examine students, faculty, and university staff with digital prescription records.',
    descriptionBn: 'অভিজ্ঞ চিকিৎসক কর্তৃক সার্বিক স্বাস্থ্য পরীক্ষা ও প্রেসক্রিপশন সেবা।',
    fee: '100% Free for Students',
    availability: 'Daily 8:30 AM - 5:00 PM',
    iconName: 'Stethoscope'
  },
  {
    id: 'med-srv-02',
    title: '24/7 Emergency Ambulance Service',
    titleBn: '২৪/৭ জরুরি অ্যাম্বুলেন্স সেবা',
    description: 'Two university life-support ambulances with oxygen cylinders and stretcher dispatch for emergency hospital transfers.',
    descriptionBn: 'অক্সিজেন ও প্রাথমিক জরুরি সুবিধাযুক্ত ২টি অ্যাম্বুলেন্স ২৪ ঘণ্টা প্রস্তুত।',
    fee: 'Campus Free | Hospital Transfer Subsidized',
    availability: '24 Hours / 7 Days a Week',
    iconName: 'Ambulance'
  },
  {
    id: 'med-srv-03',
    title: 'Free Essential Medicine Dispensary',
    titleBn: 'বিনামূল্যে প্রয়োজনীয় ওষুধ বিতরণ',
    description: 'Official dispensary provides essential basic medicines and first-aid supplies on presentation of digital prescription.',
    descriptionBn: 'প্রেসক্রিপশন অনুযায়ী প্রয়োজনীয় জরুরি ও প্রাথমিক ওষুধ বিনামূল্যে প্রদান।',
    fee: '100% Free for Students',
    availability: 'Daily 9:00 AM - 4:00 PM',
    iconName: 'Pill'
  },
  {
    id: 'med-srv-04',
    title: 'Pathology & Diagnostic Screening',
    titleBn: 'প্যাথলজি ও রোগনির্ণয় স্ক্রিনিং',
    description: 'Blood sugar test, CBC, rapid dengue / malaria screen, and basic screening for university community members.',
    descriptionBn: 'রক্তের সিবিসি, ব্লাড সুগার, ডেঙ্গু ও ইউরিন পরীক্ষার স্বয়ংক্রিয় ল্যাব।',
    fee: 'Subsidized / Free for Enrolled Students',
    availability: 'Morning 9:00 AM - 1:00 PM',
    iconName: 'Activity'
  },
  {
    id: 'med-srv-05',
    title: 'Mental Health & Stress Counseling',
    titleBn: 'মানসিক স্বাস্থ্য ও স্ট্রেস কাউন্সিলিং',
    description: 'Strictly confidential, empathetic psychotherapy sessions for academic stress, depression, anxiety, and wellness.',
    descriptionBn: 'পড়াশোনার চাপ, বিষণ্ণতা ও ব্যক্তিগত সংকট দূরীকরণে গোপনীয় মানসিক স্বাস্থ্য পরামর্শ।',
    fee: '100% Free & Confidential',
    availability: 'Sun, Tue, Thu by Appointment',
    iconName: 'HeartHandshake'
  }
];

export const initialMedicalDutyRoster: MedicalDutyShift[] = [
  {
    id: 'shift-01',
    doctorId: 'doc-01',
    doctorName: 'Chief Medical Officer [REPLACE WITH REAL CONTENT]',
    doctorSpecialty: 'Internal Medicine & Emergency Critical Care',
    dayOfWeek: 'Sunday',
    timeSlot: '09:00 AM - 09:30 AM',
    roomNumber: 'Room 101',
    maxPatients: 1,
    isActive: true
  },
  {
    id: 'shift-02',
    doctorId: 'doc-01',
    doctorName: 'Chief Medical Officer [REPLACE WITH REAL CONTENT]',
    doctorSpecialty: 'Internal Medicine & Emergency Critical Care',
    dayOfWeek: 'Sunday',
    timeSlot: '09:30 AM - 10:00 AM',
    roomNumber: 'Room 101',
    maxPatients: 1,
    isActive: true
  },
  {
    id: 'shift-03',
    doctorId: 'doc-01',
    doctorName: 'Chief Medical Officer [REPLACE WITH REAL CONTENT]',
    doctorSpecialty: 'Internal Medicine & Emergency Critical Care',
    dayOfWeek: 'Sunday',
    timeSlot: '10:00 AM - 10:30 AM',
    roomNumber: 'Room 101',
    maxPatients: 1,
    isActive: true
  },
  {
    id: 'shift-04',
    doctorId: 'doc-02',
    doctorName: 'Senior Medical Officer [REPLACE WITH REAL CONTENT]',
    doctorSpecialty: 'Women’s Health, Diabetology & Family Medicine',
    dayOfWeek: 'Sunday',
    timeSlot: '11:00 AM - 11:30 AM',
    roomNumber: 'Room 103',
    maxPatients: 1,
    isActive: true
  },
  {
    id: 'shift-05',
    doctorId: 'doc-02',
    doctorName: 'Senior Medical Officer [REPLACE WITH REAL CONTENT]',
    doctorSpecialty: 'Women’s Health, Diabetology & Family Medicine',
    dayOfWeek: 'Monday',
    timeSlot: '09:30 AM - 10:00 AM',
    roomNumber: 'Room 103',
    maxPatients: 1,
    isActive: true
  },
  {
    id: 'shift-06',
    doctorId: 'doc-03',
    doctorName: 'Duty Dental Surgeon [REPLACE WITH REAL CONTENT]',
    doctorSpecialty: 'Dental Surgery & Oral Health Care',
    dayOfWeek: 'Monday',
    timeSlot: '10:00 AM - 10:30 AM',
    roomNumber: 'Room 105',
    maxPatients: 1,
    isActive: true
  },
  {
    id: 'shift-07',
    doctorId: 'doc-01',
    doctorName: 'Chief Medical Officer [REPLACE WITH REAL CONTENT]',
    doctorSpecialty: 'Internal Medicine & Emergency Critical Care',
    dayOfWeek: 'Tuesday',
    timeSlot: '09:00 AM - 09:30 AM',
    roomNumber: 'Room 101',
    maxPatients: 1,
    isActive: true
  },
  {
    id: 'shift-08',
    doctorId: 'doc-04',
    doctorName: 'Clinical Counselor [REPLACE WITH REAL CONTENT]',
    doctorSpecialty: 'Mental Well-being, Exam Anxiety & Psychotherapy',
    dayOfWeek: 'Tuesday',
    timeSlot: '10:30 AM - 11:30 AM',
    roomNumber: 'Room 202',
    maxPatients: 1,
    isActive: true
  },
  {
    id: 'shift-09',
    doctorId: 'doc-01',
    doctorName: 'Chief Medical Officer [REPLACE WITH REAL CONTENT]',
    doctorSpecialty: 'Internal Medicine & Emergency Critical Care',
    dayOfWeek: 'Wednesday',
    timeSlot: '11:30 AM - 12:00 PM',
    roomNumber: 'Room 101',
    maxPatients: 1,
    isActive: true
  },
  {
    id: 'shift-10',
    doctorId: 'doc-03',
    doctorName: 'Duty Dental Surgeon [REPLACE WITH REAL CONTENT]',
    doctorSpecialty: 'Dental Surgery & Oral Health Care',
    dayOfWeek: 'Wednesday',
    timeSlot: '10:30 AM - 11:00 AM',
    roomNumber: 'Room 105',
    maxPatients: 1,
    isActive: true
  },
  {
    id: 'shift-11',
    doctorId: 'doc-01',
    doctorName: 'Chief Medical Officer [REPLACE WITH REAL CONTENT]',
    doctorSpecialty: 'Internal Medicine & Emergency Critical Care',
    dayOfWeek: 'Thursday',
    timeSlot: '09:30 AM - 10:00 AM',
    roomNumber: 'Room 101',
    maxPatients: 1,
    isActive: true
  },
  {
    id: 'shift-12',
    doctorId: 'doc-04',
    doctorName: 'Clinical Counselor [REPLACE WITH REAL CONTENT]',
    doctorSpecialty: 'Mental Well-being, Exam Anxiety & Psychotherapy',
    dayOfWeek: 'Thursday',
    timeSlot: '11:00 AM - 12:00 PM',
    roomNumber: 'Room 202',
    maxPatients: 1,
    isActive: true
  }
];

export const initialEmergencyContacts: EmergencyContact[] = [
  {
    id: 'emg-01',
    title: 'University Ambulance Duty [REPLACE WITH REAL CONTENT]',
    titleBn: 'বিশ্ববিদ্যালয় অ্যাম্বুলেন্স জরুরি ডিউটি [REPLACE WITH REAL CONTENT]',
    number: '+880 1700-000010 [REPLACE WITH REAL CONTENT]',
    availableHours: '24 Hours / 7 Days [REPLACE WITH REAL CONTENT]',
    availableHoursBn: '২৪ ঘণ্টা / ৭ দিন [REPLACE WITH REAL CONTENT]',
    description: 'On-campus emergency patient transfer and critical paramedic dispatch.',
    descriptionBn: 'ক্যাম্পাস অভ্যন্তরে জরুরি রোগী পরিবহন ও দ্রুত সাড়াদান।',
    iconName: 'Ambulance',
    isAmbulance: true
  },
  {
    id: 'emg-02',
    title: 'Medical Center Emergency Desk [REPLACE WITH REAL CONTENT]',
    titleBn: 'মেডিকেল সেন্টার জরুরি ডেস্ক [REPLACE WITH REAL CONTENT]',
    number: '+880 1700-000011 [REPLACE WITH REAL CONTENT]',
    availableHours: '24/7 Hotline [REPLACE WITH REAL CONTENT]',
    availableHoursBn: '২৪/৭ হটলাইন [REPLACE WITH REAL CONTENT]',
    description: 'Duty medical officer on-call room and triage coordination desk.',
    descriptionBn: 'অন-কল ডিউটি ডাক্তার ও প্রাথমিক চিকিৎসা সমন্বয় কেন্দ্র।',
    iconName: 'PhoneCall'
  },
  {
    id: 'emg-03',
    title: 'Jamalpur 250-Bed General Hospital [REPLACE WITH REAL CONTENT]',
    titleBn: 'জামালপুর ২৫০ শয্যা জেনারেল হাসপাতাল [REPLACE WITH REAL CONTENT]',
    number: '+880 1700-000012 [REPLACE WITH REAL CONTENT]',
    availableHours: '24 Hours Emergency Ward [REPLACE WITH REAL CONTENT]',
    availableHoursBn: '২৪ ঘণ্টা জরুরি বিভাগ [REPLACE WITH REAL CONTENT]',
    description: 'District referral hospital located 4.5 km from JSTU permanent campus.',
    descriptionBn: 'জেএসটিইউ স্থায়ী ক্যাম্পাস থেকে ৪.৫ কিমি দূরে অবস্থিত জেলা রেফারাল হাসপাতাল।',
    iconName: 'ShieldCheck'
  },
  {
    id: 'emg-04',
    title: 'National Emergency Service (Bangladesh)',
    titleBn: 'জাতীয় জরুরি সেবা (বাংলাদেশ)',
    number: '999',
    availableHours: '24/7 Toll-Free',
    availableHoursBn: '২৪/৭ টোল-ফ্রি',
    description: 'Police, Fire Service, and Government Ambulance dispatch center.',
    descriptionBn: 'পুলিশ, ফায়ার সার্ভিস ও সরকারি অ্যাম্বুলেন্স প্রেরণ কেন্দ্র।',
    iconName: 'AlertCircle'
  }
];

export const initialMedicalHealthTips: MedicalHealthTip[] = [
  {
    id: 'tip-01',
    title: 'Dengue & Seasonal Viral Fever Prevention on Campus',
    titleBn: 'ক্যাম্পাসে ডেঙ্গু ও মৌসুমী ভাইরাস জ্বর প্রতিরোধ',
    category: 'Preventive Health',
    categoryBn: 'প্রতিরোধমূলক স্বাস্থ্য',
    readTime: '2 min read',
    summary: 'Essential environmental hygiene steps to prevent mosquito breeding in dormitories and academic halls.',
    summaryBn: 'আবাসিক হল ও একাডেমিক প্রাঙ্গণে মশার বিস্তার রোধে প্রয়োজনীয় সতর্কতা।',
    content: [
      'Inspect dorm rooms and balconies twice weekly to ensure no standing water accumulates in plastic containers or potted plants.',
      'Use bed nets (mosquito nets) while sleeping during daytime and evening hours.',
      'Maintain adequate hydration with clean water, coconut water, and oral rehydration solution (ORS).',
      'Report any persistent fever to the Medical Center promptly for screening rather than self-medicating with over-the-counter painkillers.'
    ],
    contentBn: [
      'হল ও মেসের রুম বা বারান্দায় কোনো পাত্রে যাতে পানি জমে না থাকে তা নিয়মিত পরীক্ষা করুন।',
      'দিনের বেলা বা রাতে ঘুমানোর সময় সর্বদা মশারি ব্যবহার করুন।',
      'পর্যাপ্ত পরিমাণে বিশুদ্ধ পানি, ওরস্যালাইন ও তরল খাবার গ্রহণ করুন।',
      'জ্বর হলে ফার্মেসি থেকে নিজের ইচ্ছামতো ব্যথানাশক ওষুধ না খেয়ে মেডিকেল সেন্টারে পরামর্শ নিন।'
    ]
  },
  {
    id: 'tip-02',
    title: 'Ergonomics & Eye Strain Management for Programmers',
    titleBn: 'কম্পিউটার স্ক্রিন ক্লান্তি ও চোখের যত্ন',
    category: 'Student Wellness',
    categoryBn: 'শিক্ষার্থী সুস্থতা',
    readTime: '3 min read',
    summary: 'Guidelines to mitigate neck stiffness, repetitive strain, and digital eye strain during continuous coding or study sessions.',
    summaryBn: 'দীর্ঘ সময় কম্পিউটারে কোডিং বা পড়াশোনায় চোখের চাপ ও পিঠের ব্যথা প্রতিরোধের কৌশল।',
    content: [
      'Follow the 20-20-20 rule: Every 20 minutes, look at an object 20 feet away for at least 20 seconds.',
      'Position the top of your monitor at or slightly below eye level to maintain a neutral neck posture.',
      'Take regular micro-breaks to stretch shoulders, wrists, and lower back.',
      'Ensure ambient room lighting matches display brightness to minimize pupillary fatigue.'
    ],
    contentBn: [
      '২০-২০-২০ নিয়ম মেনে চলুন: প্রতি ২০ মিনিট পর পর ২০ ফুট দূরের বস্তুর দিকে ২০ সেকেন্ড তাকান।',
      'মনিটরের ওপরের অংশ চোখের সমান বা কিছুটা নিচে রাখুন যেন ঘাড় সোজা থাকে।',
      'পড়া বা কোডিংয়ের মাঝে মাঝে উঠে হাঁটাচলা ও কব্জির হালকা ব্যায়াম করুন।',
      'অন্ধকার ঘরে উজ্জ্বল স্ক্রিন ব্যবহার পরিহার করুন।'
    ]
  },
  {
    id: 'tip-03',
    title: 'Managing Academic Stress and Sleep Hygiene During Exams',
    titleBn: 'পরীক্ষার সময় মানসিক চাপ ও স্বাস্থ্যকর ঘুমের অভ্যাস',
    category: 'Mental Wellness',
    categoryBn: 'মানসিক সুস্থতা',
    readTime: '3 min read',
    summary: 'Non-pharmacological sleep hygiene techniques to enhance cognitive consolidation during midterm and final assessments.',
    summaryBn: 'পরীক্ষার প্রস্তুতিতে মস্তিষ্কের কার্যক্ষমতা ও সুস্থ ঘুমের জন্য প্রয়োজনীয় পরামর্শ।',
    content: [
      'Aim for 7 to 8 hours of consistent nocturnal sleep; all-night cramming reduces information retention and reaction times.',
      'Avoid high-dose caffeine or energy drinks within 6 hours of bedtime.',
      'Practice 5 minutes of deep diaphragmatic breathing if feeling acute panic or overwhelmed.',
      'University clinical counselors are available for confidential sessions at Counseling Cell Room 202.'
    ],
    contentBn: [
      'পরীক্ষার আগের রাতে কমপক্ষে ৭-৮ ঘণ্টা ঘুমান; রাত জাগলে স্মৃতিশক্তি হ্রাস পায়।',
      'ঘুমানোর ৬ ঘণ্টা পূর্বে চা, কফি বা এনার্জি ড্রিংক গ্রহণ করা থেকে বিরত থাকুন।',
      'উদ্বেগ কমাতে দিনে কয়েকবার গভীর শ্বাস-প্রশ্বাসের ব্যায়াম করুন।',
      'প্রয়োজনে বিশ্ববিদ্যালয়ের কাউন্সিলিং সেলে অভিজ্ঞ কাউন্সিলরের সাথে কথা বলুন।'
    ]
  }
];

export const initialMedicalFaqs = [
  {
    qEn: 'Who is eligible to receive free treatment at the JSTU Medical Center?',
    qBn: 'জেএসটিইউ মেডিকেল সেন্টারে কারা বিনামূল্যে চিকিৎসা সেবা পাওয়ার যোগ্য?',
    aEn: 'All regularly enrolled undergraduate and postgraduate students, registered teachers, administrative officers, and staff members of Jamalpur Science & Technology University are entitled to consultations and dispensary services upon presenting their institutional digital ID.',
    aBn: 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের সকল নিয়মিত শিক্ষার্থী, শিক্ষক, কর্মকর্তা ও কর্মচারীবৃন্দ তাদের প্রাতিষ্ঠানিক ডিজিটাল আইডি প্রদর্শন করে বিনামূল্যে পরামর্শ ও ডিসপেনসারি সেবা গ্রহণ করতে পারেন।'
  },
  {
    qEn: 'What are the regular opening hours and emergency duty schedules?',
    qBn: 'মেডিকেল সেন্টারের নিয়মিত সেবা ও জরুরি ডিউটির সময়সূচি কী?',
    aEn: 'Regular outpatient consultation runs from 8:30 AM to 5:00 PM on university workdays. An on-call medical officer and ambulance crew remain on emergency standby 24 hours daily, 7 days a week [REPLACE WITH REAL CONTENT].',
    aBn: 'কর্মদিবসে সকাল ৮:৩০ থেকে বিকাল ৫:০০ পর্যন্ত সাধারণ সেবা চালু থাকে। এছাড়া জরুরি প্রয়োজনে ২৪/৭ অন-কল ডাক্তার ও অ্যাম্বুলেন্স সেবা সার্বক্ষণিক প্রস্তুত থাকে [REPLACE WITH REAL CONTENT]।'
  },
  {
    qEn: 'How can I book an appointment online?',
    qBn: 'অনলাইনে কীভাবে ডাক্তারের অ্যাপয়েন্টমেন্ট নেওয়া যায়?',
    aEn: 'Log in to your Student or Staff portal and navigate to Medical Center -> Book Appointment. Choose your preferred doctor or "Any Available", pick an open slot from the duty roster, write a brief reason (max 300 characters), and submit. You will instantly receive a reference number.',
    aBn: 'স্টুডেন্ট বা স্টাফ পোর্টালে লগইন করে মেডিকেল সেন্টার -> অ্যাপয়েন্টমেন্ট পেজে যান। আপনার পছন্দের ডাক্তার বা "যেকোনো ডাক্তার" নির্বাচন করে ডিউটি রোস্টার থেকে ফাঁকা স্লট বেছে নিন এবং কারণ লিখে আবেদন জমা দিন।'
  },
  {
    qEn: 'What medications are available in the dispensary?',
    qBn: 'ডিসপেনসারিতে কী ধরনের ওষুধ পাওয়া যায়?',
    aEn: 'The dispensary stocks essential oral rehydration salts, fever and pain relievers, antibiotics, antihistamines, antacids, inhalers, eye/ear drops, and emergency wound dressing kits supplied under government university grants.',
    aBn: 'ডিসপেনসারিতে ওরস্যালাইন, প্যারাসিটামল, অ্যান্টিহিস্টামিন, গ্যাস্ট্রিকের ওষুধ, অ্যান্টিবায়োটিক এবং জরুরি ড্রেসিং সরঞ্জাম বিনামূল্যে সরবরাহ করা হয়।'
  }
];

export const initialMedicalAppointments: MedicalAppointment[] = [
  {
    id: 'med-apt-00',
    referenceNumber: 'JSTU-MED-2026-1040',
    tokenNumber: 1,
    patientUid: 'demo_student_01',
    patientName: 'Tanvir Ahmed',
    patientRole: 'student',
    patientId: 'JSTU2026001',
    department: 'Computer Science & Engineering',
    phone: '+880 1711-234567',
    doctorId: 'doc-01',
    doctorName: 'Chief Medical Officer [REPLACE WITH REAL CONTENT]',
    doctorSpecialty: 'Internal Medicine & Emergency Critical Care',
    appointmentDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    timeSlot: '09:00 AM - 09:30 AM',
    reason: 'Initial consultation for seasonal rhinitis and eye irritation.',
    status: 'Completed',
    bookedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    auditTrail: [
      {
        id: 'aud-00a',
        actorUid: 'demo_student_01',
        actorRole: 'student',
        action: 'REQUESTED',
        timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
        note: 'Appointment booked online'
      },
      {
        id: 'aud-00b',
        actorUid: 'demo_medical_01',
        actorRole: 'medical_officer',
        action: 'CONFIRMED',
        timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
        note: 'Duty doctor confirmed slot'
      },
      {
        id: 'aud-00c',
        actorUid: 'demo_medical_01',
        actorRole: 'medical_officer',
        action: 'COMPLETED',
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
        note: 'Consultation completed and visit record finalized'
      }
    ]
  },
  {
    id: 'med-apt-01',
    referenceNumber: 'JSTU-MED-2026-1041',
    tokenNumber: 2,
    patientUid: 'demo_student_01',
    patientName: 'Tanvir Ahmed',
    patientRole: 'student',
    patientId: 'JSTU2026001',
    department: 'Computer Science & Engineering',
    phone: '+880 1711-234567',
    doctorId: 'doc-01',
    doctorName: 'Chief Medical Officer [REPLACE WITH REAL CONTENT]',
    doctorSpecialty: 'Internal Medicine & Emergency Critical Care',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '09:00 AM - 09:30 AM',
    reason: 'Follow-up consultation for mild seasonal allergy and routine blood pressure checkup.',
    status: 'Confirmed',
    bookedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    auditTrail: [
      {
        id: 'aud-01',
        actorUid: 'demo_student_01',
        actorRole: 'student',
        action: 'REQUESTED',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        note: 'Appointment booked online'
      },
      {
        id: 'aud-02',
        actorUid: 'demo_medical_01',
        actorRole: 'medical_officer',
        action: 'CONFIRMED',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        note: 'Duty doctor confirmed slot'
      }
    ]
  },
  {
    id: 'med-apt-02',
    referenceNumber: 'JSTU-MED-2026-1042',
    tokenNumber: 2,
    patientUid: 'demo_student_01',
    patientName: 'Tanvir Ahmed',
    patientRole: 'student',
    patientId: 'JSTU2026001',
    department: 'Computer Science & Engineering',
    phone: '+880 1711-234567',
    doctorId: 'doc-04',
    doctorName: 'Clinical Counselor [REPLACE WITH REAL CONTENT]',
    doctorSpecialty: 'Mental Well-being, Exam Anxiety & Psychotherapy',
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '10:30 AM - 11:30 AM',
    reason: 'Discussion regarding semester project stress and academic concentration strategies.',
    status: 'Requested',
    bookedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    auditTrail: [
      {
        id: 'aud-03',
        actorUid: 'demo_student_01',
        actorRole: 'student',
        action: 'REQUESTED',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        note: 'Appointment requested'
      }
    ]
  }
];

export const initialTransportRoutesData: TransportRoute[] = [
  {
    id: 'route-01',
    routeCode: 'ROUTE-01',
    routeName: 'Jamalpur City Center & Railway Station Express',
    routeNameBn: 'জামালপুর শহর ও রেলস্টেশন এক্সপ্রেস',
    busNumber: 'JSTU BUS-01 (Ashirbad)',
    driverName: 'Md. Dulal Mia',
    driverPhone: '+880 1711-334411',
    supervisorName: 'Abdur Rashid',
    supervisorPhone: '+880 1712-556622',
    capacity: 52,
    activeStatus: 'on_schedule',
    stoppages: [
      { stopName: 'Jamalpur Railway Station', stopNameBn: 'জামালপুর রেলওয়ে স্টেশন', morningUp: '07:15 AM', noonUp: '12:30 PM', afternoonDown: '02:30 PM', eveningDown: '05:30 PM' },
      { stopName: 'Doyamoyee Mor', stopNameBn: 'দয়াময়ী মোড়', morningUp: '07:25 AM', noonUp: '12:40 PM', afternoonDown: '02:40 PM', eveningDown: '05:40 PM' },
      { stopName: 'Bongobondhu Chattar', stopNameBn: 'বঙ্গবন্ধু চত্বর', morningUp: '07:35 AM', noonUp: '12:50 PM', afternoonDown: '02:50 PM', eveningDown: '05:50 PM' },
      { stopName: 'Gatepar Crossing', stopNameBn: 'গেটপাড় ক্রসিং', morningUp: '07:45 AM', noonUp: '01:00 PM', afternoonDown: '03:00 PM', eveningDown: '06:00 PM' },
      { stopName: 'Beltia Mor', stopNameBn: 'বেলটিয়া মোড়', morningUp: '07:55 AM', noonUp: '01:10 PM', afternoonDown: '03:10 PM', eveningDown: '06:10 PM' },
      { stopName: 'JSTU Main Campus', stopNameBn: 'জেএসটিইউ মূল ক্যাম্পাস', morningUp: '08:15 AM', noonUp: '01:30 PM', afternoonDown: '03:30 PM', eveningDown: '06:30 PM' }
    ]
  },
  {
    id: 'route-02',
    routeCode: 'ROUTE-02',
    routeName: 'Melandaha Upazila & College Mor Route',
    routeNameBn: 'মেলান্দহ উপজেলা ও কলেজ মোড় রুট',
    busNumber: 'JSTU BUS-02 (Shopno)',
    driverName: 'Md. Moniruzzaman',
    driverPhone: '+880 1713-778833',
    supervisorName: 'Shahidul Islam',
    supervisorPhone: '+880 1714-990044',
    capacity: 52,
    activeStatus: 'on_schedule',
    stoppages: [
      { stopName: 'Melandaha Bazar Mor', stopNameBn: 'মেলান্দহ বাজার মোড়', morningUp: '07:20 AM', noonUp: '12:35 PM', afternoonDown: '02:45 PM', eveningDown: '05:35 PM' },
      { stopName: 'Umacharan High School Gate', stopNameBn: 'উমাচরণ হাই স্কুল গেট', morningUp: '07:30 AM', noonUp: '12:45 PM', afternoonDown: '02:55 PM', eveningDown: '05:45 PM' },
      { stopName: 'Aditmari Bridge', stopNameBn: 'আদিতমারী ব্রিজ', morningUp: '07:45 AM', noonUp: '01:00 PM', afternoonDown: '03:10 PM', eveningDown: '06:00 PM' },
      { stopName: 'JSTU Main Campus', stopNameBn: 'জেএসটিইউ মূল ক্যাম্পাস', morningUp: '08:10 AM', noonUp: '01:25 PM', afternoonDown: '03:30 PM', eveningDown: '06:25 PM' }
    ]
  },
  {
    id: 'route-03',
    routeCode: 'ROUTE-03',
    routeName: 'Sherpur Bridge & Nandina Bypass',
    routeNameBn: 'শেরপুর ব্রিজ ও নান্দিনা বাইপাস',
    busNumber: 'JSTU BUS-03 (Uddipon)',
    driverName: 'Anwar Hossain',
    driverPhone: '+880 1715-112255',
    supervisorName: 'Harun-ur-Rashid',
    supervisorPhone: '+880 1716-334466',
    capacity: 48,
    activeStatus: 'on_schedule',
    stoppages: [
      { stopName: 'Brahmaputra Bridge Point', stopNameBn: 'ব্রহ্মপুত্র ব্রিজ পয়েন্ট', morningUp: '07:05 AM', noonUp: '12:20 PM', afternoonDown: '02:30 PM', eveningDown: '05:20 PM' },
      { stopName: 'Nandina Bazar Stand', stopNameBn: 'নান্দিনা বাজার স্ট্যান্ড', morningUp: '07:25 AM', noonUp: '12:40 PM', afternoonDown: '02:50 PM', eveningDown: '05:40 PM' },
      { stopName: 'Narundi Mor', stopNameBn: 'নরুন্দি মোড়', morningUp: '07:45 AM', noonUp: '01:00 PM', afternoonDown: '03:10 PM', eveningDown: '06:00 PM' },
      { stopName: 'JSTU Main Campus', stopNameBn: 'জেএসটিইউ মূল ক্যাম্পাস', morningUp: '08:20 AM', noonUp: '01:35 PM', afternoonDown: '03:40 PM', eveningDown: '06:30 PM' }
    ]
  },
  {
    id: 'route-04',
    routeCode: 'ROUTE-04',
    routeName: 'Staff & Faculty Executive Shuttle',
    routeNameBn: 'শিক্ষক-কর্মকর্তা এক্সিকিউটিভ শাটল',
    busNumber: 'JSTU MINIBUS-01 (Chiroshobuj)',
    driverName: 'Sujon Mia',
    driverPhone: '+880 1717-556677',
    supervisorName: 'Nazim Uddin',
    supervisorPhone: '+880 1718-778888',
    capacity: 32,
    activeStatus: 'on_schedule',
    stoppages: [
      { stopName: 'Officers Club Jamalpur', stopNameBn: 'অফিসার্স ক্লাব জামালপুর', morningUp: '07:45 AM', noonUp: '01:15 PM', afternoonDown: '03:15 PM', eveningDown: '05:45 PM' },
      { stopName: 'Circuit House Mor', stopNameBn: 'সার্কিট হাউস মোড়', morningUp: '07:55 AM', noonUp: '01:25 PM', afternoonDown: '03:25 PM', eveningDown: '05:55 PM' },
      { stopName: 'JSTU Administrative Building', stopNameBn: 'জেএসটিইউ প্রশাসনিক ভবন', morningUp: '08:25 AM', noonUp: '01:55 PM', afternoonDown: '03:55 PM', eveningDown: '06:25 PM' }
    ]
  }
];

export const initialAlumniData: Alumnus[] = [
  {
    id: 'alm-01',
    name: 'S. M. Raihanul Islam',
    nameBn: 'এস. এম. রায়হানুল ইসলাম',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    batch: '1st Batch (2012-13)',
    graduatedYear: 2017,
    currentPosition: 'Senior Software Engineer',
    currentPositionBn: 'সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার',
    organization: 'Google Cloud (Singapore)',
    organizationType: 'Tech',
    country: 'Singapore',
    city: 'Singapore',
    linkedinUrl: 'https://linkedin.com/in/demo-raihanul-jstu',
    email: 'raihanul.islam@alumni.jstu.ac.bd',
    quote: 'JSTU gave us strong algorithmic foundations and a culture of perseverance that propelled our international tech careers.',
    quoteBn: 'জেএসটিইউ-এর নিবিড় ল্যাব প্র্যাকটিস ও শিক্ষকবৃন্দের উৎসাহই আজ বিশ্বমঞ্চে কাজ করার ভিত তৈরি করে দিয়েছে।',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'alm-02',
    name: 'Sabrina Mostofa',
    nameBn: 'সাবরিনা মোস্তফা',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    batch: '2nd Batch (2013-14)',
    graduatedYear: 2018,
    currentPosition: 'Assistant Commissioner (Executive Magistrate)',
    currentPositionBn: 'সহকারী কমিশনার (নির্বাহী ম্যাজিস্ট্রেট)',
    organization: 'Bangladesh Civil Service (BCS 39th Batch)',
    organizationType: 'Civil Service',
    country: 'Bangladesh',
    city: 'Dhaka',
    linkedinUrl: 'https://linkedin.com/in/demo-sabrina-jstu',
    email: 'sabrina.bcs@alumni.jstu.ac.bd',
    quote: 'The analytical rigor and leadership values learned at JSTU Debating Society directly shaped my public administration journey.',
    quoteBn: 'জেএসটিইউ ডিবেটিং সোসাইটির যুক্তিনিষ্ঠ শিক্ষা আমার সিভিল সার্ভিস নেতৃত্বে সবচেয়ে বড় অনুপ্রেরণা।',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'alm-03',
    name: 'Dr. Khandaker Ashiqur Rahman',
    nameBn: 'ড. খন্দকার আশিকুর রহমান',
    departmentCode: 'EEE',
    departmentName: 'Electrical & Electronic Engineering',
    batch: '1st Batch (2012-13)',
    graduatedYear: 2017,
    currentPosition: 'Postdoctoral Research Fellow in Quantum Photonics',
    currentPositionBn: 'পোস্টডক্টরাল রিসার্চ ফেলো',
    organization: 'Technical University of Munich (TUM)',
    organizationType: 'Academia & Research',
    country: 'Germany',
    city: 'Munich',
    linkedinUrl: 'https://linkedin.com/in/demo-ashiqur-jstu',
    email: 'ashiqur.tum@alumni.jstu.ac.bd',
    quote: 'From our undergraduate laboratories beside the Brahmaputra to the quantum research labs in Germany, JSTU was where curiosity ignited.',
    quoteBn: 'ব্রহ্মপুত্রের তীরে জেএসটিইউ-এর ল্যাবরেটরি থেকেই বিজ্ঞানের অপার জগতে পদার্পণ করার অনুপ্রেরণা পাই।',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'alm-04',
    name: 'Farzana Sharmin Liza',
    nameBn: 'ফারজানা শারমিন লিজা',
    departmentCode: 'FISH',
    departmentName: 'Fisheries & Marine Resources',
    batch: '3rd Batch (2014-15)',
    graduatedYear: 2019,
    currentPosition: 'Senior Aquaculturist & Breeding Specialist',
    currentPositionBn: 'সিনিয়র অ্যাকুয়াকালচার স্পেশালিস্ট',
    organization: 'CP Bangladesh Co. Ltd.',
    organizationType: 'Multinational',
    country: 'Bangladesh',
    city: 'Mymensingh',
    linkedinUrl: 'https://linkedin.com/in/demo-farzana-jstu',
    email: 'farzana.cp@alumni.jstu.ac.bd',
    quote: 'The hands-on field trials in Jamalpur wetland nurseries gave me the competitive edge in commercial aquaculture management.',
    quoteBn: 'জেএসটিইউ মৎস্য বিভাগের বাস্তবিক হ্যাচারি প্রশিক্ষণ আমাকে দেশের শীর্ষ মৎস্য শিল্পে সাফল্য এনে দিয়েছে।',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'alm-05',
    name: 'Md. Nazmul Karim',
    nameBn: 'মো. নাজমুল করিম',
    departmentCode: 'MATH',
    departmentName: 'Mathematics & Statistics',
    batch: '2nd Batch (2013-14)',
    graduatedYear: 2018,
    currentPosition: 'Lead Data Scientist & Quantitative Analyst',
    currentPositionBn: 'লিড ডাটা সায়েন্টিস্ট',
    organization: 'bKash Limited',
    organizationType: 'Financial & Banking',
    country: 'Bangladesh',
    city: 'Dhaka',
    linkedinUrl: 'https://linkedin.com/in/demo-nazmul-jstu',
    email: 'nazmul.bkash@alumni.jstu.ac.bd',
    quote: 'Pure mathematics trained my mind for large-scale predictive modeling and financial risk scoring.',
    quoteBn: 'গণিতের গভীর সমীকরণই আজ ফিনটেক ও ডাটা সায়েন্সের জটিল সমাধান বের করতে সহায়তা করছে।',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'alm-06',
    name: 'Shahriar Bin Zaman',
    nameBn: 'শাহরিয়ার বিন জামান',
    departmentCode: 'GEOL',
    departmentName: 'Geology & Mining Engineering',
    batch: '1st Batch (2012-13)',
    graduatedYear: 2017,
    currentPosition: 'Assistant Director (Geological Mapping)',
    currentPositionBn: 'সহকারী পরিচালক (ভূতাত্ত্বিক জরিপ)',
    organization: 'Geological Survey of Bangladesh (GSB)',
    organizationType: 'Civil Service',
    country: 'Bangladesh',
    city: 'Dhaka',
    linkedinUrl: 'https://linkedin.com/in/demo-shahriar-jstu',
    email: 'shahriar.gsb@alumni.jstu.ac.bd',
    quote: 'Field trips to the northern tertiary hills during my undergraduate years at JSTU forged my career in mineral exploration.',
    quoteBn: 'জেএসটিইউ ভূতত্ত্ব বিভাগের ফিল্ডওয়ার্কের অভিজ্ঞতা দেশের ভূ-সম্পদ উন্নয়নে ভূমিকা রাখতে সাহায্য করছে।',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'alm-07',
    name: 'Tahmina Chowdhury',
    nameBn: 'তাহমিনা চৌধুরী',
    departmentCode: 'MGMT',
    departmentName: 'Management & Business Studies',
    batch: '4th Batch (2015-16)',
    graduatedYear: 2020,
    currentPosition: 'Founder & Managing Director',
    currentPositionBn: 'প্রতিষ্ঠাতা ও ব্যবস্থাপনা পরিচালক',
    organization: 'Brahmaputra Agro-Tech Ventures',
    organizationType: 'Entrepreneurship',
    country: 'Bangladesh',
    city: 'Jamalpur',
    linkedinUrl: 'https://linkedin.com/in/demo-tahmina-jstu',
    email: 'tahmina@brahmaputraagro.com',
    quote: 'JSTU ignited my dream to build agro-processing jobs right here in greater Mymensingh-Jamalpur region.',
    quoteBn: 'আমাদের এই অঞ্চলের কৃষিভিত্তিক পণ্যের মূল্য সংযোজন ও কর্মসংস্থান সৃষ্টিতেই আমার আনন্দ।',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'alm-08',
    name: 'Mahbubur Rahman Rony',
    nameBn: 'মাহবুবুর রহমান রনি',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    batch: '3rd Batch (2014-15)',
    graduatedYear: 2019,
    currentPosition: 'Solutions Architect & Tech Lead',
    currentPositionBn: 'সল্যুশনস আর্কিটেক্ট',
    organization: 'Brain Station 23',
    organizationType: 'Tech',
    country: 'Bangladesh',
    city: 'Dhaka',
    linkedinUrl: 'https://linkedin.com/in/demo-mahbub-jstu',
    email: 'mahbub.rony@brainstation-23.com',
    quote: 'Team collaboration in programming contests formed bonds that still flourish across the Bangladeshi IT ecosystem.',
    quoteBn: 'জেএসটিইউ-এর প্রোগ্রামিং ক্লাবের দলীয় চেতনা আজ বড় বড় সফটওয়্যার প্রজেক্ট সফল করতে সহায়তা করে।',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80'
  }
];

export const initialAlumniRegistrationsData: AlumniRegistrationRequest[] = [
  {
    id: 'alm-reg-01',
    fullName: 'Jahirul Islam',
    studentId: 'JSTU1401025',
    department: 'Computer Science & Engineering',
    batch: '3rd Batch (2014-15)',
    graduationYear: 2019,
    email: 'jahirul.islam@example.com',
    phone: '+880 1711-445566',
    currentCompany: 'Therap (BD) Ltd.',
    designation: 'Senior Software Engineer',
    country: 'Bangladesh',
    city: 'Dhaka',
    linkedinUrl: 'https://linkedin.com/in/demo-jahirul',
    status: 'verified',
    appliedAt: '2026-09-10T12:00:00Z'
  }
];

// M2 Initial Visit Records (Demo mode only - visibly marked DEMO)
// Real enforcement must move to Firestore rules / Cloud Functions.
// Real health data needs encryption, strict access rules, a legal basis and university approval, and must not be stored in a browser-only demo.
export const initialMedicalVisitRecords: MedicalVisitRecord[] = [
  {
    id: 'med-rec-01',
    appointmentId: 'med-apt-00',
    appointmentRef: 'JSTU-MED-2026-1040',
    verificationToken: 'med_tok_demo_882914',
    verificationStatus: 'VALID',
    patientUid: 'demo_student_01',
    patientName: 'Tanvir Ahmed',
    patientId: 'JSTU2026001',
    patientRole: 'student',
    patientDepartment: 'Computer Science & Engineering',
    doctorId: 'doc-01',
    doctorName: 'Chief Medical Officer [REPLACE WITH REAL CONTENT]',
    doctorSpecialty: 'Internal Medicine & Emergency Critical Care',
    visitDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    complaint: 'Sneezing, nasal congestion, and mild eye itching for 3 days.',
    observation: 'Mild nasal mucosal edema, clear discharge. Throat clear. BP 118/76 mmHg, Pulse 74 bpm.',
    advice: 'Avoid cold beverages and dusty environments. Practice steam inhalation twice daily.',
    followUpDate: new Date(Date.now() + 86400000 * 9).toISOString().split('T')[0],
    sickRestDays: 2,
    prescriptionItems: [
      {
        id: 'rx-01',
        medicine: 'Tab. Fexofenadine Hydrochloride 120mg',
        dose: '1 tablet once daily (at bedtime)',
        duration: '5 days',
        instructions: 'After dinner with water'
      },
      {
        id: 'rx-02',
        medicine: 'Normal Saline 0.9% Nasal Drops',
        dose: '2 drops in each nostril',
        duration: '5 days',
        instructions: 'Three times daily before meals'
      }
    ],
    status: 'FINALIZED',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    finalizedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    addenda: []
  }
];

export const initialPatientRecordAccessLogs: PatientRecordAccessLog[] = [
  {
    id: 'med-acc-01',
    patientUid: 'demo_student_01',
    accessedByUid: 'demo_medical_01',
    accessedByName: 'Duty Medical Officer [REPLACE WITH REAL CONTENT]',
    accessedByRole: 'medical_officer',
    accessedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

// M3: Initial Medical Rest Certificates (Fictional demo data - NO diagnosis or health details)
// Real enforcement must move to Firestore rules / Cloud Functions.
// Real signing must happen server-side with a key in a secret manager.
// The registry must live in a database with rules exposing only the minimal verification fields publicly.
export const initialMedicalRestCertificates: MedicalRestCertificate[] = [
  {
    id: 'cert-med-2026-001',
    verificationId: 'a1b2c3d4e5f60718293a4b5c6d7e8f90',
    canonicalHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    visitRecordId: 'med-rec-01',
    appointmentId: 'med-apt-00',
    appointmentRef: 'JSTU-MED-2026-1040',
    patientUid: 'demo_student_01',
    patientName: 'Tanvir Ahmed',
    patientId: 'JSTU2026001',
    patientDepartment: 'Computer Science & Engineering',
    centerName: 'JSTU Medical Center',
    doctorRole: 'Medical Officer',
    doctorUid: 'demo_medical_01',
    doctorName: 'Chief Medical Officer [REPLACE WITH REAL CONTENT]',
    restStartDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    restEndDate: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    restDays: 2,
    status: 'VALID',
    version: 1,
    issuedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    auditTrail: [
      {
        id: 'aud-cert-01',
        actorUid: 'demo_medical_01',
        actorRole: 'medical_officer',
        action: 'ISSUED',
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
        reason: 'Rest certificate issued following consultation'
      }
    ]
  }
];
