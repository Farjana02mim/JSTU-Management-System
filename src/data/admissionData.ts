import {
  AdmissionProgramOffering,
  AdmissionFeeItem,
  AdmissionImportantDate,
  AdmissionFaqItem,
  AdmissionApplication
} from '../types/admission';

// ============================================================================
// Admission Static & Seed Data
// /* [REPLACE WITH REAL CONTENT] Official JSTU Undergraduate & Postgraduate Admission Tables */
// ============================================================================

export const admissionProgramsData: AdmissionProgramOffering[] = [
  // CSE
  {
    id: 'prog_ug_cse',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    departmentNameBn: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং',
    facultyName: 'Faculty of Engineering & Technology',
    facultyNameBn: 'প্রকৌশল ও প্রযুক্তি অনুষদ',
    unit: 'UNIT_A',
    degreeName: 'B.Sc. (Engg.) in Computer Science & Engineering',
    degreeLevel: 'Undergraduate',
    durationYears: 4,
    totalSemesters: 8,
    regularSeats: 50,
    quotaSeats: 5,
    minHscGpa: 3.5,
    minCombinedGpa: 8.0,
    requiredHscSubjects: ['Mathematics (Min A-)', 'Physics (Min A-)', 'Chemistry (Min B)']
  },
  {
    id: 'prog_pg_cse',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    departmentNameBn: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং',
    facultyName: 'Faculty of Engineering & Technology',
    facultyNameBn: 'প্রকৌশল ও প্রযুক্তি অনুষদ',
    unit: 'UNIT_A',
    degreeName: 'M.Sc. (Engg.) in Computer Science & Engineering',
    degreeLevel: 'Postgraduate',
    durationYears: 1.5,
    totalSemesters: 3,
    regularSeats: 25,
    quotaSeats: 2,
    minHscGpa: 3.0,
    minCombinedGpa: 7.0,
    requiredHscSubjects: ['B.Sc. in CSE or equivalent (Min CGPA 3.00/4.00)']
  },

  // EEE
  {
    id: 'prog_ug_eee',
    departmentCode: 'EEE',
    departmentName: 'Electrical & Electronic Engineering',
    departmentNameBn: 'ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং',
    facultyName: 'Faculty of Engineering & Technology',
    facultyNameBn: 'প্রকৌশল ও প্রযুক্তি অনুষদ',
    unit: 'UNIT_A',
    degreeName: 'B.Sc. (Engg.) in Electrical & Electronic Engineering',
    degreeLevel: 'Undergraduate',
    durationYears: 4,
    totalSemesters: 8,
    regularSeats: 50,
    quotaSeats: 5,
    minHscGpa: 3.5,
    minCombinedGpa: 8.0,
    requiredHscSubjects: ['Mathematics (Min A-)', 'Physics (Min A-)', 'Chemistry (Min B)']
  },
  {
    id: 'prog_pg_eee',
    departmentCode: 'EEE',
    departmentName: 'Electrical & Electronic Engineering',
    departmentNameBn: 'ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং',
    facultyName: 'Faculty of Engineering & Technology',
    facultyNameBn: 'প্রকৌশল ও প্রযুক্তি অনুষদ',
    unit: 'UNIT_A',
    degreeName: 'M.Sc. (Engg.) in Electrical & Electronic Engineering',
    degreeLevel: 'Postgraduate',
    durationYears: 1.5,
    totalSemesters: 3,
    regularSeats: 20,
    quotaSeats: 2,
    minHscGpa: 3.0,
    minCombinedGpa: 7.0,
    requiredHscSubjects: ['B.Sc. in EEE/ECE or equivalent (Min CGPA 3.00/4.00)']
  },

  // Mathematics
  {
    id: 'prog_ug_math',
    departmentCode: 'MATH',
    departmentName: 'Mathematics',
    departmentNameBn: 'গণিত বিভাগ',
    facultyName: 'Faculty of Science',
    facultyNameBn: 'বিজ্ঞান অনুষদ',
    unit: 'UNIT_A',
    degreeName: 'B.Sc. (Honours) in Mathematics',
    degreeLevel: 'Undergraduate',
    durationYears: 4,
    totalSemesters: 8,
    regularSeats: 50,
    quotaSeats: 5,
    minHscGpa: 3.25,
    minCombinedGpa: 7.5,
    requiredHscSubjects: ['Higher Mathematics (Min A-)', 'Physics (Min B)']
  },
  {
    id: 'prog_pg_math',
    departmentCode: 'MATH',
    departmentName: 'Mathematics',
    departmentNameBn: 'গণিত বিভাগ',
    facultyName: 'Faculty of Science',
    facultyNameBn: 'বিজ্ঞান অনুষদ',
    unit: 'UNIT_A',
    degreeName: 'M.Sc. in Applied Mathematics',
    degreeLevel: 'Postgraduate',
    durationYears: 1,
    totalSemesters: 2,
    regularSeats: 30,
    quotaSeats: 2,
    minHscGpa: 3.0,
    minCombinedGpa: 6.5,
    requiredHscSubjects: ['B.Sc. (Hons) in Mathematics/Applied Math']
  },

  // Fisheries
  {
    id: 'prog_ug_fish',
    departmentCode: 'FISH',
    departmentName: 'Fisheries & Marine Bioscience',
    departmentNameBn: 'ফিশারিজ অ্যান্ড মেরিন বায়োসায়েন্স',
    facultyName: 'Faculty of Biological Science & Technology',
    facultyNameBn: 'জীববিজ্ঞান ও প্রযুক্তি অনুষদ',
    unit: 'UNIT_A',
    degreeName: 'B.Sc. (Honours) in Fisheries & Aquaculture',
    degreeLevel: 'Undergraduate',
    durationYears: 4,
    totalSemesters: 8,
    regularSeats: 45,
    quotaSeats: 4,
    minHscGpa: 3.25,
    minCombinedGpa: 7.5,
    requiredHscSubjects: ['Biology (Min A-)', 'Chemistry (Min B)', 'Physics (Min B)']
  },
  {
    id: 'prog_pg_fish',
    departmentCode: 'FISH',
    departmentName: 'Fisheries & Marine Bioscience',
    departmentNameBn: 'ফিশারিজ অ্যান্ড মেরিন বায়োসায়েন্স',
    facultyName: 'Faculty of Biological Science & Technology',
    facultyNameBn: 'জীববিজ্ঞান ও প্রযুক্তি অনুষদ',
    unit: 'UNIT_A',
    degreeName: 'M.Sc. in Marine Fishery Ecology',
    degreeLevel: 'Postgraduate',
    durationYears: 1.5,
    totalSemesters: 3,
    regularSeats: 20,
    quotaSeats: 2,
    minHscGpa: 3.0,
    minCombinedGpa: 7.0,
    requiredHscSubjects: ['B.Sc. in Fisheries, Zoology, or Bio-science']
  },

  // Geology
  {
    id: 'prog_ug_geol',
    departmentCode: 'GEOL',
    departmentName: 'Petroleum & Mining Engineering / Geology',
    departmentNameBn: 'পেট্রোলিয়াম অ্যান্ড মাইনিং ইঞ্জিনিয়ারিং / ভূতত্ত্ব',
    facultyName: 'Faculty of Applied Science & Technology',
    facultyNameBn: 'ফলিত বিজ্ঞান ও প্রযুক্তি অনুষদ',
    unit: 'UNIT_A',
    degreeName: 'B.Sc. (Engg.) in Petroleum & Mining Geoscience',
    degreeLevel: 'Undergraduate',
    durationYears: 4,
    totalSemesters: 8,
    regularSeats: 40,
    quotaSeats: 4,
    minHscGpa: 3.25,
    minCombinedGpa: 7.5,
    requiredHscSubjects: ['Physics (Min A-)', 'Chemistry (Min A-)', 'Mathematics (Min B)']
  },

  // Management
  {
    id: 'prog_ug_mgmt',
    departmentCode: 'MGMT',
    departmentName: 'Management Studies',
    departmentNameBn: 'ব্যবস্থাপনা বিভাগ',
    facultyName: 'Faculty of Business Studies',
    facultyNameBn: 'ব্যবসায় শিক্ষা অনুষদ',
    unit: 'UNIT_C',
    degreeName: 'Bachelor of Business Administration (BBA)',
    degreeLevel: 'Undergraduate',
    durationYears: 4,
    totalSemesters: 8,
    regularSeats: 60,
    quotaSeats: 5,
    minHscGpa: 3.0,
    minCombinedGpa: 7.0,
    requiredHscSubjects: ['Accounting or Business Org or Economics (Min B)', 'English (Min B)']
  },
  {
    id: 'prog_pg_mgmt',
    departmentCode: 'MGMT',
    departmentName: 'Management Studies',
    departmentNameBn: 'ব্যবস্থাপনা বিভাগ',
    facultyName: 'Faculty of Business Studies',
    facultyNameBn: 'ব্যবসায় শিক্ষা অনুষদ',
    unit: 'UNIT_C',
    degreeName: 'Master of Business Administration (MBA)',
    degreeLevel: 'Postgraduate',
    durationYears: 1.5,
    totalSemesters: 3,
    regularSeats: 40,
    quotaSeats: 3,
    minHscGpa: 2.75,
    minCombinedGpa: 6.5,
    requiredHscSubjects: ['Graduation in any discipline with min 2nd Class / CGPA 2.75']
  },

  // Social Work
  {
    id: 'prog_ug_sw',
    departmentCode: 'SW',
    departmentName: 'Social Work',
    departmentNameBn: 'সমাজকর্ম বিভাগ',
    facultyName: 'Faculty of Arts & Social Sciences',
    facultyNameBn: 'কলা ও সমাজবিজ্ঞান অনুষদ',
    unit: 'UNIT_B',
    degreeName: 'Bachelor of Social Sciences (BSS Honours)',
    degreeLevel: 'Undergraduate',
    durationYears: 4,
    totalSemesters: 8,
    regularSeats: 50,
    quotaSeats: 5,
    minHscGpa: 3.0,
    minCombinedGpa: 6.5,
    requiredHscSubjects: ['English (Min B)', 'Social Studies, Civics or Economics (Min B)']
  },
  {
    id: 'prog_pg_sw',
    departmentCode: 'SW',
    departmentName: 'Social Work',
    departmentNameBn: 'সমাজকর্ম বিভাগ',
    facultyName: 'Faculty of Arts & Social Sciences',
    facultyNameBn: 'কলা ও সমাজবিজ্ঞান অনুষদ',
    unit: 'UNIT_B',
    degreeName: 'Master of Social Sciences (MSS)',
    degreeLevel: 'Postgraduate',
    durationYears: 1,
    totalSemesters: 2,
    regularSeats: 35,
    quotaSeats: 2,
    minHscGpa: 2.75,
    minCombinedGpa: 6.0,
    requiredHscSubjects: ['BSS/BA Honours in Social Science discipline']
  }
];

export const admissionFeesData: AdmissionFeeItem[] = [
  {
    category: 'Application Processing Fee (Per Unit)',
    categoryBn: 'ইউনিট প্রতি আবেদন ফি',
    amount: 1200,
    frequency: 'One-time (during online application)',
    frequencyBn: 'এককালীন (অনলাইন আবেদনের সময়)',
    description: 'Includes test processing, center allocation, and admit card processing.',
    descriptionBn: 'পরীক্ষা ব্যবস্থাপনা, কেন্দ্র নির্ধারণ ও প্রবেশপত্র প্রসেসিং অন্তর্ভুক্ত।'
  },
  {
    category: 'Admission & Registration Fee',
    categoryBn: 'ভর্তি ও রেজিস্ট্রেশন ফি',
    amount: 6500,
    frequency: 'One-time (upon final selection)',
    frequencyBn: 'এককালীন (চূড়ান্ত ভর্তির সময়)',
    description: 'Registration, central orientation, digital smart ID card, and health insurance fund.',
    descriptionBn: 'রেজিস্ট্রেশন, কেন্দ্রীয় ওরিয়েন্টেশন, স্মার্ট আইডি কার্ড এবং স্বাস্থ্যবীমা তহবিল।'
  },
  {
    category: 'Semester Tuition & Academic Fee',
    categoryBn: 'সেমিস্টার টিউশন ও একাডেমিক ফি',
    amount: 4200,
    frequency: 'Per Semester (6 months)',
    frequencyBn: 'প্রতি সেমিস্টার (৬ মাস পর পর)',
    description: 'Standard course credits, lecture notes, academic guidance, and departmental facilities.',
    descriptionBn: 'কোর্স ক্রেডিট, লেকচার নোটস, একাডেমিক গাইডেন্স ও বিভাগীয় সুবিধা।'
  },
  {
    category: 'Laboratory & Computing Facilities Fee',
    categoryBn: 'ল্যাবরেটরি ও কম্পিউটার ফ্যাসিলিটি ফি',
    amount: 2500,
    frequency: 'Per Semester (For Engg/Science)',
    frequencyBn: 'প্রতি সেমিস্টার (প্রকৌশল ও বিজ্ঞানের জন্য)',
    description: 'Specialized lab consumables, high-performance computing, and hardware testing kits.',
    descriptionBn: 'বিশেষায়িত ল্যাব উপাদান, উচ্চক্ষমতার কম্পিউটিং ও হার্ডওয়্যার কিটস।'
  },
  {
    category: 'Library & Online Journal Portal Fee',
    categoryBn: 'লাইব্রেরি ও অনলাইন জার্নাল পোর্টাল ফি',
    amount: 800,
    frequency: 'Per Semester',
    frequencyBn: 'প্রতি সেমিস্টার',
    description: 'Access to Central Library physical stacks, IEEE Xplore, ScienceDirect, and JSTOR.',
    descriptionBn: 'কেন্দ্রীয় লাইব্রেরির বই, আইইইই এক্সপ্লোর, সায়েন্সডাইরেক্ট এবং জেস্টোর এক্সেস।'
  },
  {
    category: 'Residential Hall Caution Deposit (Refundable)',
    categoryBn: 'আবাসিক হল জামানত (ফেরতযোগ্য)',
    amount: 3000,
    frequency: 'One-time (upon room allotment)',
    frequencyBn: 'এককালীন (সিট বরাদ্দের সময়)',
    description: 'Security deposit refundable upon degree completion and hall clearance.',
    descriptionBn: 'ডিগ্রি সম্পন্ন ও হল ছাড়ার পর সম্পূর্ণ ফেরতযোগ্য নিরাপত্তা জামানত।'
  }
];

export const admissionDatesData: AdmissionImportantDate[] = [
  {
    event: 'Online Application Portal Opens',
    eventBn: 'অনলাইন আবেদন পোর্টাল উন্মুক্ত',
    dateStr: 'November 01, 2026 (10:00 AM)',
    dateStrBn: '০১ নভেম্বর, ২০২৬ (সকাল ১০:০০)',
    status: 'completed',
    badge: 'Started'
  },
  {
    event: 'Application Submission Deadline',
    eventBn: 'আবেদন জমা দেওয়ার শেষ তারিখ',
    dateStr: 'December 10, 2026 (11:59 PM)',
    dateStrBn: '১০ ডিসেম্বর, ২০২৬ (রাত ১১:৫৯)',
    status: 'ongoing',
    badge: 'Active Now'
  },
  {
    event: 'Scrutiny & Primary Shortlist Announcement',
    eventBn: 'আবেদন বাছাই ও প্রাথমিক তালিকা প্রকাশ',
    dateStr: 'December 20, 2026 (04:00 PM)',
    dateStrBn: '২০ ডিসেম্বর, ২০২৬ (বিকাল ০৪:০০)',
    status: 'upcoming',
    badge: 'Scheduled'
  },
  {
    event: 'Admit Card Download Window',
    eventBn: 'প্রবেশপত্র ডাউনলোডের সময়সীমা',
    dateStr: 'December 22, 2026 - January 05, 2027',
    dateStrBn: '২২ ডিসেম্বর, ২০২৬ - ০৫ জানুয়ারি, ২০২৭',
    status: 'upcoming',
    badge: 'QR Admit'
  },
  {
    event: 'Admission Examination (Unit A - Science & Engg)',
    eventBn: 'ভর্তি পরীক্ষা (ইউনিট এ - বিজ্ঞান ও প্রকৌশল)',
    dateStr: 'January 08, 2027 (10:00 AM - 11:30 AM)',
    dateStrBn: '০৮ জানুয়ারি, ২০২৭ (সকাল ১০:০০ - ১১:৩০)',
    status: 'upcoming',
    badge: 'Test Day'
  },
  {
    event: 'Admission Examination (Unit B & Unit C)',
    eventBn: 'ভর্তি পরীক্ষা (ইউনিট বি ও ইউনিট সি)',
    dateStr: 'January 09, 2027 (03:00 PM - 04:30 PM)',
    dateStrBn: '০৯ জানুয়ারি, ২০২৭ (বিকাল ০৩:০০ - ০৪:৩০)',
    status: 'upcoming',
    badge: 'Test Day'
  },
  {
    event: 'Publication of Merit & Waiting Lists',
    eventBn: 'মেধাতালিকা ও অপেক্ষমাণ তালিকা প্রকাশ',
    dateStr: 'January 18, 2027 (06:00 PM)',
    dateStrBn: '১৮ জানুয়ারি, ২০২৭ (সন্ধ্যা ০৬:০০)',
    status: 'upcoming',
    badge: 'Results'
  },
  {
    event: 'Physical Document Verification & Viva',
    eventBn: 'সরাসরি সনদপত্র যাচাই ও মৌখিক পরীক্ষা',
    dateStr: 'January 25 - January 30, 2027',
    dateStrBn: '২৫ জানুয়ারি - ৩০ জানুয়ারি, ২০২৭',
    status: 'upcoming',
    badge: 'In-Person'
  },
  {
    event: 'Commencement of 1st Semester Classes',
    eventBn: 'স্নাতক প্রথম বর্ষের ক্লাস শুরু',
    dateStr: 'February 15, 2027',
    dateStrBn: '১৫ ফেব্রুয়ারি, ২০২৭',
    status: 'upcoming',
    badge: 'Orientation'
  }
];

export const admissionFaqData: AdmissionFaqItem[] = [
  {
    category: 'general',
    question: 'Can I apply to multiple units simultaneously?',
    questionBn: 'আমি কি একসাথে একাধিক ইউনিটে আবেদন করতে পারব?',
    answer:
      'Yes. If you fulfill the minimum SSC and HSC GPA criteria for each corresponding unit (e.g. Science background students applying to both Unit A and Unit C), you can submit separate applications for each unit using the same applicant profile and contact credentials.',
    answerBn:
      'হ্যাঁ। যদি আপনি সংশ্লিষ্ট ইউনিটের ন্যূনতম এসএসসি ও এইচএসসি জিপিএ শর্ত পূরণ করেন (যেমন বিজ্ঞান শাখার শিক্ষার্থী ইউনিট এ এবং ইউনিট সি উভয়টিতে), তবে একই যোগাযোগের তথ্য ব্যবহার করে আলাদাভাবে প্রতিটি ইউনিটে আবেদন করতে পারবেন।'
  },
  {
    category: 'eligibility',
    question: 'Is second-time admission allowed at JSTU?',
    questionBn: 'জেএসটিইউ-তে কি দ্বিতীয়বার (সেকেন্ড টাইম) ভর্তি পরীক্ষা দেওয়ার সুযোগ আছে?',
    answer:
      'Yes. Candidates who passed HSC/equivalent in either 2024 or 2025 are eligible to apply. There is no mark deduction for second-time examinees across undergraduate faculties.',
    answerBn:
      'হ্যাঁ। ২০২৪ অথবা ২০২৫ সালে এইচএসসি/সমমান উত্তীর্ণ প্রার্থীরা আবেদন করতে পারবেন। স্নাতক প্রথম বর্ষে দ্বিতীয়বার অংশগ্রহণকারীদের ক্ষেত্রে কোনো নম্বর কর্তন করা হয় না।'
  },
  {
    category: 'documents',
    question: 'What are the required photo and signature dimensions and file types?',
    questionBn: 'ছবি ও স্বাক্ষরের সাইজ এবং ফরম্যাট কী হতে হবে?',
    answer:
      'Applicant photo must be a recent color passport-sized portrait (JPEG/PNG format, maximum file size 2MB). Applicant signature must be on plain white paper scanned or photographed clearly (JPEG/PNG format, maximum 1MB). Transcripts can be uploaded as PDF or clear image files up to 3MB.',
    answerBn:
      'ছবি হতে হবে সাম্প্রতিক রঙিন পাসপোর্ট সাইজের পোট্রেট (জেপিজি/পিএনজি, সর্বোচ্চ ২ মেগাবাইট)। স্বাক্ষর হতে হবে সাদা কাগজে স্পষ্ট কালো কালিতে (জেপিজি/পিএনজি, সর্বোচ্চ ১ মেগাবাইট)। সনদ বা মার্কশিট সর্বোচ্চ ৩ মেগাবাইট পর্যন্ত পিডিএফ বা স্পষ্ট ছবি আকারে আপলোড করা যাবে।'
  },
  {
    category: 'general',
    question: 'How do I retrieve my application reference number or check status?',
    questionBn: 'আবেদনের রেফারেন্স নম্বর হারিয়ে গেলে বা স্ট্যাটাস দেখতে কী করতে হবে?',
    answer:
      'You can check your live application status anytime under the "Check Status" tab by entering your Reference Number and registered Email Address. For privacy and data protection, a generic response is displayed if the credentials do not match.',
    answerBn:
      'আপনি যেকোনো সময় "আবেদন স্ট্যাটাস" ট্যাবে গিয়ে আপনার রেফারেন্স নম্বর ও নিবন্ধিত ইমেইল ঠিকানা দিয়ে তাৎক্ষণিক অবস্থা যাচাই করতে পারবেন। সুরক্ষার স্বার্থে ভুল তথ্য দিলে জেনেরিক সতর্কবার্তা প্রদর্শন করা হয়।'
  },
  {
    category: 'eligibility',
    question: 'What special quota categories are available?',
    questionBn: 'ভর্তিতে কী কী বিশেষ কোটা সুবিধা রয়েছে?',
    answer:
      'JSTU accommodates Freedom Fighter Quota (children/grand-children of martyred or certified freedom fighters), Tribal/Ethnic Minority Quota, Persons with Disability (Physically Challenged) Quota, and JSTU Internal Ward Quota. Relevant government gazette or authorized medical certificates must be uploaded during submission.',
    answerBn:
      'জেএসটিইউ-তে মুক্তিযোদ্ধা কোটা, ক্ষুদ্র নৃ-গোষ্ঠী কোটা, শারীরিক প্রতিবন্ধী কোটা এবং বিশ্ববিদ্যালয় পোষ্য কোটা সংরক্ষিত রয়েছে। আবেদনের সময় সংশ্লিষ্ট সরকারি গেজেট বা উপযুক্ত সনদপত্র আপলোড করা বাধ্যতামূলক।'
  },
  {
    category: 'exam',
    question: 'How is the Admit Card generated and verified?',
    questionBn: 'প্রবেশপত্র কীভাবে তৈরি এবং যাচাই করা হবে?',
    answer:
      'Once an applicant is shortlisted and assigned an examination center, a high-resolution Admit Card PDF featuring a cryptographically verifiable QR code is generated. Candidates must print this on A4 paper and present it along with the original HSC registration card at the examination hall.',
    answerBn:
      'আবেদন বাছাই সম্পন্ন হলে কিউআর কোড সংবলিত প্রবেশপত্র প্রস্তুত হয়। প্রার্থীরা এ৪ কাগজে রঙিন প্রিন্ট নিয়ে মূল এইচএসসি রেজিস্ট্রেশন কার্ডসহ পরীক্ষার হলে উপস্থিত হবেন।'
  }
];

export const initialAdmissionApplications: AdmissionApplication[] = [
  {
    id: 'app_seed_01',
    referenceNumber: 'JSTU-ADM-2026-784912',
    status: 'SHORTLISTED',
    submittedAt: '2026-11-05T10:15:00Z',
    updatedAt: '2026-11-08T14:30:00Z',
    personalInfo: {
      fullName: 'Tahmidur Rahman Chowdhury',
      fullNameBn: 'তাহমিদুর রহমান চৌধুরী',
      fatherName: 'Dr. Motiur Rahman Chowdhury',
      fatherNameBn: 'ড. মতিউর রহমান চৌধুরী',
      motherName: 'Nasrin Sultana',
      motherNameBn: 'নাসরিন সুলতানা',
      dateOfBirth: '2006-03-14',
      gender: 'MALE',
      bloodGroup: 'B+',
      religion: 'Islam',
      nationalIdOrBirthCert: '20061928374619283',
      phone: '01711223344',
      email: 'tahmid.rahman@gmail.com',
      presentAddress: 'House 42, Road 11, Sector 4, Uttara, Dhaka 1230',
      permanentAddress: 'Village: Gopinathpur, Upazila: Sadar, Jashore',
      quota: 'NONE'
    },
    academicInfo: {
      sscBoard: 'Dhaka',
      sscRoll: '104829',
      sscReg: '1810482910',
      sscPassingYear: 2022,
      sscGpa: 5.0,
      sscGroup: 'Science',
      hscBoard: 'Dhaka',
      hscRoll: '302918',
      hscReg: '1810482910',
      hscPassingYear: 2024,
      hscGpa: 5.0,
      hscGroup: 'Science',
      hscMathGrade: 'A+',
      hscPhysicsGrade: 'A+',
      hscChemistryGrade: 'A+',
      hscEnglishGrade: 'A+',
      hscBiologyGrade: 'A'
    },
    programChoice: {
      unit: 'UNIT_A',
      firstChoiceDept: 'CSE',
      secondChoiceDept: 'EEE',
      thirdChoiceDept: 'MATH'
    },
    documents: {
      applicantPhoto: {
        fileName: 'tahmid_photo.jpg',
        fileSize: 450230,
        fileType: 'image/jpeg',
        uploadDate: '2026-11-05T10:10:00Z'
      },
      applicantSignature: {
        fileName: 'tahmid_signature.png',
        fileSize: 120400,
        fileType: 'image/png',
        uploadDate: '2026-11-05T10:11:00Z'
      },
      sscTranscript: {
        fileName: 'ssc_transcript_2022.pdf',
        fileSize: 1120000,
        fileType: 'application/pdf',
        uploadDate: '2026-11-05T10:12:00Z'
      },
      hscTranscript: {
        fileName: 'hsc_transcript_2024.pdf',
        fileSize: 1250000,
        fileType: 'application/pdf',
        uploadDate: '2026-11-05T10:13:00Z'
      }
    },
    testRollNumber: 'A-10492',
    examVenue: 'Faculty of Engineering Building, Room 302, Academic Block A',
    examDate: 'January 08, 2027',
    examTime: '10:00 AM - 11:30 AM',
    reviewedAt: '2026-11-08T14:30:00Z',
    reviewedBy: 'Md. Abdul Mannan (Registrar)',
    admitCardIssued: true,
    admitCardIssuedAt: '2026-11-08T14:35:00Z',
    notes: ['Candidate fulfilled all A+ requirements in Math and Physics. Assigned to Room 302.']
  },
  {
    id: 'app_seed_02',
    referenceNumber: 'JSTU-ADM-2026-784913',
    status: 'APPROVED',
    submittedAt: '2026-11-06T11:20:00Z',
    updatedAt: '2026-11-10T09:15:00Z',
    personalInfo: {
      fullName: 'Sumaiya Binte Faruk',
      fullNameBn: 'সুমাইয়া বিনতে ফারুক',
      fatherName: 'Faruk Ahmed',
      fatherNameBn: 'ফারুক আহমেদ',
      motherName: 'Farhana Parvin',
      motherNameBn: 'ফারহানা পারভীন',
      dateOfBirth: '2005-11-22',
      gender: 'FEMALE',
      bloodGroup: 'O+',
      religion: 'Islam',
      nationalIdOrBirthCert: '20054719283746192',
      phone: '01819876543',
      email: 'sumaiya.faruk@gmail.com',
      presentAddress: 'Chittagong City Corporation, Nasirabad, Chattogram',
      permanentAddress: 'Village: Madhupur, Upazila: Sitakunda, Chattogram',
      quota: 'NONE'
    },
    academicInfo: {
      sscBoard: 'Chattogram',
      sscRoll: '109823',
      sscReg: '1810982301',
      sscPassingYear: 2022,
      sscGpa: 5.0,
      sscGroup: 'Science',
      hscBoard: 'Chattogram',
      hscRoll: '304812',
      hscReg: '1810982301',
      hscPassingYear: 2024,
      hscGpa: 4.92,
      hscGroup: 'Science',
      hscMathGrade: 'A+',
      hscPhysicsGrade: 'A',
      hscChemistryGrade: 'A+',
      hscEnglishGrade: 'A+',
      hscBiologyGrade: 'A+'
    },
    programChoice: {
      unit: 'UNIT_A',
      firstChoiceDept: 'FISH',
      secondChoiceDept: 'CSE',
      thirdChoiceDept: 'GEOL'
    },
    documents: {
      applicantPhoto: {
        fileName: 'sumaiya_portrait.jpg',
        fileSize: 390100,
        fileType: 'image/jpeg',
        uploadDate: '2026-11-06T11:15:00Z'
      },
      applicantSignature: {
        fileName: 'sumaiya_sign.png',
        fileSize: 98000,
        fileType: 'image/png',
        uploadDate: '2026-11-06T11:16:00Z'
      },
      sscTranscript: {
        fileName: 'ssc_chattogram.pdf',
        fileSize: 980000,
        fileType: 'application/pdf',
        uploadDate: '2026-11-06T11:17:00Z'
      },
      hscTranscript: {
        fileName: 'hsc_chattogram.pdf',
        fileSize: 1100000,
        fileType: 'application/pdf',
        uploadDate: '2026-11-06T11:18:00Z'
      }
    },
    testRollNumber: 'A-10515',
    examVenue: 'Faculty of Biological Science Building, Hall 1, Academic Block B',
    examDate: 'January 08, 2027',
    examTime: '10:00 AM - 11:30 AM',
    reviewedAt: '2026-11-10T09:15:00Z',
    reviewedBy: 'Md. Abdul Mannan (Registrar)',
    admitCardIssued: true,
    admitCardIssuedAt: '2026-11-10T09:20:00Z',
    notes: ['Merit list top quartile. Verified biology high honors for Fisheries program.']
  },
  {
    id: 'app_seed_03',
    referenceNumber: 'JSTU-ADM-2026-784914',
    status: 'SUBMITTED',
    submittedAt: '2026-11-07T15:45:00Z',
    updatedAt: '2026-11-07T15:45:00Z',
    personalInfo: {
      fullName: 'Abrar Shahriar Kabir',
      fullNameBn: 'আবরার শাহরিয়ার কবির',
      fatherName: 'Humayun Kabir',
      fatherNameBn: 'হুমায়ূন কবির',
      motherName: 'Shahnaz Parveen',
      motherNameBn: 'শাহনাজ পারভীন',
      dateOfBirth: '2006-07-19',
      gender: 'MALE',
      bloodGroup: 'A+',
      religion: 'Islam',
      nationalIdOrBirthCert: '20062618294019283',
      phone: '01912345678',
      email: 'abrar.shahriar@gmail.com',
      presentAddress: '23/B Dhanmondi R/A, Dhaka 1205',
      permanentAddress: 'Village: Shailkupa, Jhenaidah',
      quota: 'NONE'
    },
    academicInfo: {
      sscBoard: 'Dhaka',
      sscRoll: '102938',
      sscReg: '1810293847',
      sscPassingYear: 2022,
      sscGpa: 5.0,
      sscGroup: 'Science',
      hscBoard: 'Dhaka',
      hscRoll: '301928',
      hscReg: '1810293847',
      hscPassingYear: 2024,
      hscGpa: 4.85,
      hscGroup: 'Science',
      hscMathGrade: 'A',
      hscPhysicsGrade: 'A+',
      hscChemistryGrade: 'A',
      hscEnglishGrade: 'A+',
      hscBiologyGrade: 'A-'
    },
    programChoice: {
      unit: 'UNIT_A',
      firstChoiceDept: 'EEE',
      secondChoiceDept: 'CSE',
      thirdChoiceDept: 'MATH'
    },
    documents: {
      applicantPhoto: {
        fileName: 'abrar_pic.jpg',
        fileSize: 420000,
        fileType: 'image/jpeg',
        uploadDate: '2026-11-07T15:40:00Z'
      },
      applicantSignature: {
        fileName: 'abrar_sign.jpg',
        fileSize: 110000,
        fileType: 'image/jpeg',
        uploadDate: '2026-11-07T15:41:00Z'
      },
      sscTranscript: {
        fileName: 'ssc_abrar.pdf',
        fileSize: 1040000,
        fileType: 'application/pdf',
        uploadDate: '2026-11-07T15:42:00Z'
      },
      hscTranscript: {
        fileName: 'hsc_abrar.pdf',
        fileSize: 1150000,
        fileType: 'application/pdf',
        uploadDate: '2026-11-07T15:43:00Z'
      }
    },
    notes: ['Application received via online payment gateway. Pending registrar document scrutiny.']
  },
  {
    id: 'app_seed_04',
    referenceNumber: 'JSTU-ADM-2026-784915',
    status: 'SUBMITTED',
    submittedAt: '2026-11-07T18:10:00Z',
    updatedAt: '2026-11-07T18:10:00Z',
    personalInfo: {
      fullName: 'Nusrat Jahan Mim',
      fullNameBn: 'নুসরাত জাহান মীম',
      fatherName: 'Mominul Islam',
      fatherNameBn: 'মমিনুল ইসলাম',
      motherName: 'Rina Begum',
      motherNameBn: 'রীনা বেগম',
      dateOfBirth: '2005-09-08',
      gender: 'FEMALE',
      bloodGroup: 'AB+',
      religion: 'Islam',
      nationalIdOrBirthCert: '20059182736451928',
      phone: '01678123456',
      email: 'nusrat.mim@gmail.com',
      presentAddress: 'KDA Avenue, Sonadanga, Khulna',
      permanentAddress: 'Village: Keshabpur, Jashore',
      quota: 'FREEDOM_FIGHTER'
    },
    academicInfo: {
      sscBoard: 'Jashore',
      sscRoll: '108472',
      sscReg: '1810847291',
      sscPassingYear: 2022,
      sscGpa: 4.89,
      sscGroup: 'Commerce',
      hscBoard: 'Jashore',
      hscRoll: '307481',
      hscReg: '1810847291',
      hscPassingYear: 2024,
      hscGpa: 4.75,
      hscGroup: 'Commerce',
      hscEnglishGrade: 'A'
    },
    programChoice: {
      unit: 'UNIT_C',
      firstChoiceDept: 'MGMT',
      secondChoiceDept: 'MGMT',
      thirdChoiceDept: 'MGMT'
    },
    documents: {
      applicantPhoto: {
        fileName: 'nusrat_photo.png',
        fileSize: 310000,
        fileType: 'image/png',
        uploadDate: '2026-11-07T18:05:00Z'
      },
      applicantSignature: {
        fileName: 'nusrat_signature.png',
        fileSize: 85000,
        fileType: 'image/png',
        uploadDate: '2026-11-07T18:06:00Z'
      },
      sscTranscript: {
        fileName: 'ssc_jashore_mim.pdf',
        fileSize: 950000,
        fileType: 'application/pdf',
        uploadDate: '2026-11-07T18:07:00Z'
      },
      hscTranscript: {
        fileName: 'hsc_jashore_mim.pdf',
        fileSize: 1020000,
        fileType: 'application/pdf',
        uploadDate: '2026-11-07T18:08:00Z'
      },
      quotaCertificate: {
        fileName: 'freedom_fighter_certificate_gazette.pdf',
        fileSize: 1450000,
        fileType: 'application/pdf',
        uploadDate: '2026-11-07T18:09:00Z'
      }
    },
    notes: ['Applied under Freedom Fighter Quota with Liberation War Affairs Ministry certificate.']
  },
  {
    id: 'app_seed_05',
    referenceNumber: 'JSTU-ADM-2026-784916',
    status: 'UNDER_REVIEW',
    submittedAt: '2026-11-06T14:30:00Z',
    updatedAt: '2026-11-08T16:00:00Z',
    personalInfo: {
      fullName: 'Joy Chakma',
      fullNameBn: 'জয় চাকমা',
      fatherName: 'Subir Chakma',
      fatherNameBn: 'সুধীর চাকমা',
      motherName: 'Rita Dewan',
      motherNameBn: 'রীতা দেওয়ান',
      dateOfBirth: '2006-01-25',
      gender: 'MALE',
      bloodGroup: 'B+',
      religion: 'Buddhism',
      nationalIdOrBirthCert: '20068472910384729',
      phone: '01515234567',
      email: 'joy.chakma@gmail.com',
      presentAddress: 'College Gate, Rangamati Sadar, Rangamati',
      permanentAddress: 'Village: Kutukchhari, Rangamati',
      quota: 'TRIBAL_ETHNIC'
    },
    academicInfo: {
      sscBoard: 'Chattogram',
      sscRoll: '105829',
      sscReg: '1810582910',
      sscPassingYear: 2022,
      sscGpa: 4.67,
      sscGroup: 'Humanities',
      hscBoard: 'Chattogram',
      hscRoll: '305928',
      hscReg: '1810582910',
      hscPassingYear: 2024,
      hscGpa: 4.5,
      hscGroup: 'Humanities',
      hscEnglishGrade: 'A-'
    },
    programChoice: {
      unit: 'UNIT_B',
      firstChoiceDept: 'SW',
      secondChoiceDept: 'SW',
      thirdChoiceDept: 'SW'
    },
    documents: {
      applicantPhoto: {
        fileName: 'joy_chakma_photo.jpg',
        fileSize: 340000,
        fileType: 'image/jpeg',
        uploadDate: '2026-11-06T14:25:00Z'
      },
      applicantSignature: {
        fileName: 'joy_signature.jpg',
        fileSize: 92000,
        fileType: 'image/jpeg',
        uploadDate: '2026-11-06T14:26:00Z'
      },
      sscTranscript: {
        fileName: 'ssc_transcript_joy.pdf',
        fileSize: 890000,
        fileType: 'application/pdf',
        uploadDate: '2026-11-06T14:27:00Z'
      },
      hscTranscript: {
        fileName: 'hsc_transcript_joy.pdf',
        fileSize: 940000,
        fileType: 'application/pdf',
        uploadDate: '2026-11-06T14:28:00Z'
      },
      quotaCertificate: {
        fileName: 'circle_chief_tribal_certificate.pdf',
        fileSize: 1300000,
        fileType: 'application/pdf',
        uploadDate: '2026-11-06T14:29:00Z'
      }
    },
    reviewedAt: '2026-11-08T16:00:00Z',
    reviewedBy: 'Academic Registrar Admin',
    notes: ['Tribal circle chief authentication certificate in review.']
  },
  {
    id: 'app_seed_06',
    referenceNumber: 'JSTU-ADM-2026-784917',
    status: 'REJECTED',
    submittedAt: '2026-11-05T08:00:00Z',
    updatedAt: '2026-11-07T11:00:00Z',
    personalInfo: {
      fullName: 'Riyazul Karim',
      fullNameBn: 'রিয়াজুল করিম',
      fatherName: 'Nazmul Karim',
      motherName: 'Rabeya Khatun',
      dateOfBirth: '2005-04-10',
      gender: 'MALE',
      bloodGroup: 'AB+',
      religion: 'Islam',
      nationalIdOrBirthCert: '20051928374610293',
      phone: '01722334455',
      email: 'riyazul.karim@gmail.com',
      presentAddress: 'Monihar, Jashore',
      permanentAddress: 'Monihar, Jashore',
      quota: 'NONE'
    },
    academicInfo: {
      sscBoard: 'Jashore',
      sscRoll: '102948',
      sscReg: '1810294812',
      sscPassingYear: 2021,
      sscGpa: 3.2,
      sscGroup: 'Science',
      hscBoard: 'Jashore',
      hscRoll: '302948',
      hscReg: '1810294812',
      hscPassingYear: 2023,
      hscGpa: 2.85,
      hscGroup: 'Science',
      hscMathGrade: 'C',
      hscPhysicsGrade: 'D',
      hscEnglishGrade: 'B'
    },
    programChoice: {
      unit: 'UNIT_A',
      firstChoiceDept: 'CSE',
      secondChoiceDept: 'EEE',
      thirdChoiceDept: 'MATH'
    },
    documents: {
      applicantPhoto: {
        fileName: 'riyazul.jpg',
        fileSize: 280000,
        fileType: 'image/jpeg',
        uploadDate: '2026-11-05T07:55:00Z'
      },
      applicantSignature: {
        fileName: 'sign.jpg',
        fileSize: 80000,
        fileType: 'image/jpeg',
        uploadDate: '2026-11-05T07:56:00Z'
      },
      sscTranscript: {
        fileName: 'ssc.pdf',
        fileSize: 600000,
        fileType: 'application/pdf',
        uploadDate: '2026-11-05T07:57:00Z'
      },
      hscTranscript: {
        fileName: 'hsc.pdf',
        fileSize: 620000,
        fileType: 'application/pdf',
        uploadDate: '2026-11-05T07:58:00Z'
      }
    },
    reviewedAt: '2026-11-07T11:00:00Z',
    reviewedBy: 'Md. Abdul Mannan (Registrar)',
    rejectionReason:
      'Did not satisfy minimum GPA criteria for Unit A (Engineering & Science): Combined GPA was 6.05 against the mandatory minimum 8.00 threshold, and HSC Physics grade was D.',
    notes: ['Disqualified on GPA threshold check.']
  }
];
