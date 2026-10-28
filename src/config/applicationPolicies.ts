/**
 * Static Policy Knowledge Base for JSTU Paperless Applications
 * 
 * Real enforcement must move to Firestore rules / Cloud Functions.
 * This file serves as the single source of truth for application prerequisites,
 * requirements, fees, processing timelines, and policy rules.
 */

export interface ApplicationPolicy {
  type: string;
  titleEn: string;
  titleBn: string;
  category: 'academic' | 'administrative' | 'financial';
  approvalChain: string[];
  requiredDocuments: { en: string; bn: string }[];
  fee: {
    amountBdt: number;
    descriptionEn: string;
    descriptionBn: string;
  };
  processingDays: number;
  eligibilityEn: string;
  eligibilityBn: string;
  rulesEn: string[];
  rulesBn: string[];
}

export const APPLICATION_POLICIES: Record<string, ApplicationPolicy> = {
  transcript: {
    type: 'transcript',
    titleEn: 'Official Academic Transcript Request',
    titleBn: 'অফিশিয়াল একাডেমিক ট্রান্সক্রিপ্ট আবেদন',
    category: 'academic',
    approvalChain: ['Student', 'Department Chairman', 'Exam Controller', 'Registrar', 'Approved'],
    requiredDocuments: [
      { en: 'Final/Current semester grade sheet photocopy/digital copy', bn: 'সর্বশেষ সেমিস্টারের গ্রেড শিটের কপি' },
      { en: 'Departmental & Library dues clearance acknowledgment', bn: 'বিভাগীয় ও লাইব্রেরি বকেয়া ছাড়পত্র' },
      { en: 'Valid Student ID card copy', bn: 'বৈধ শিক্ষার্থী পরিচয়পত্রের কপি' }
    ],
    fee: {
      amountBdt: 500,
      descriptionEn: 'BDT 500 (Regular: 5 working days) / BDT 1,000 (Urgent: 2 working days)',
      descriptionBn: '৫০০ টাকা (নিয়মিত: ৫ কার্যদিবস) / ১,০০০ টাকা (জরুরি: ২ কার্যদিবস)'
    },
    processingDays: 5,
    eligibilityEn: 'Enrolled students who have completed at least one semester with published results.',
    eligibilityBn: 'অন্তত এক সেমিস্টার সম্পন্ন ও ফলাফল প্রকাশিত এমন যেকোনো নিয়মিত শিক্ষার্থী।',
    rulesEn: [
      'Only published semester results appear on the official transcript.',
      'All tuition and exam fee balances must be cleared prior to final issue.',
      'Transcripts can be downloaded as cryptographically verifiable PDF once approved by the Registrar.'
    ],
    rulesBn: [
      'অফিশিয়াল ট্রান্সক্রিপ্টে কেবল প্রকাশিত সেমিস্টার ফলাফল প্রতিফলিত হবে।',
      'চূড়ান্ত অনুমোদনের পূর্বে সেমিস্টার ফি ও অন্যান্য বকেয়া পরিশোধ করতে হবে।',
      'রেজিস্ট্রার কর্তৃক অনুমোদনের পর কিউআর কোডযুক্ত ডিজিটাল পিডিএফ ডাউনলোডযোগ্য হবে।'
    ]
  },

  certificate: {
    type: 'certificate',
    titleEn: 'Main Degree / Provisional Certificate Request',
    titleBn: 'মূল সনদ / সাময়িক সনদপত্র আবেদন',
    category: 'academic',
    approvalChain: ['Student', 'Department Chairman', 'Exam Controller', 'Registrar', 'Approved'],
    requiredDocuments: [
      { en: 'All 8 semester published grade sheets', bn: 'সকল ৮টি সেমিস্টারের প্রকাশিত গ্রেড শিট' },
      { en: 'Central Library, Hall, and Accounts final clearance slips', bn: 'কেন্দ্রীয় লাইব্রেরি, আবাসিক হল এবং হিসাব দপ্তরের চূড়ান্ত ছাড়পত্র' },
      { en: 'SSC/HSC educational certificate copies for age verification', bn: 'এসএসসি/এইচএসসি সনদের কপি' }
    ],
    fee: {
      amountBdt: 1000,
      descriptionEn: 'BDT 1,000 (Provisional) / BDT 2,000 (Original Convocation Certificate)',
      descriptionBn: '১,০০০ টাকা (সাময়িক সনদ) / ২,০০০ টাকা (মূল কনভোকেশন সনদ)'
    },
    processingDays: 7,
    eligibilityEn: 'Graduating students who have earned all required degree credits with a minimum CGPA of 2.20.',
    eligibilityBn: 'ডিগ্রির প্রয়োজনীয় সকল ক্রেডিট সম্পন্নকারী এবং ন্যূনতম ২.২০ সিজিপিএ অর্জনকারী স্নাতক শিক্ষার্থী।',
    rulesEn: [
      'Provisional certificates are issued only after exam controller tabulation is finalized.',
      'Requires institutional clearance from Library, Hall, and Accounts.',
      'Revocation occurs immediately if counterfeit or disciplinary violations are proven.'
    ],
    rulesBn: [
      'পরীক্ষা নিয়ন্ত্রক কর্তৃক চূড়ান্ত ট্যাবুলেশন সমাপ্তির পরই সাময়িক সনদ দেওয়া হয়।',
      'লাইব্রেরি, হল ও হিসাব দপ্তরের কোনো বকেয়া থাকা চলবে না।',
      'কোনো অসদুপায় প্রমাণিত হলে সনদ তাৎক্ষণিক বাতিল করা হবে।'
    ]
  },

  testimonial: {
    type: 'testimonial',
    titleEn: 'Academic & Character Testimonial',
    titleBn: 'প্রশংসাপত্র (টেস্টিমোনিয়াল) আবেদন',
    category: 'academic',
    approvalChain: ['Student', 'Department Chairman', 'Registrar', 'Approved'],
    requiredDocuments: [
      { en: 'Latest semester grade report', bn: 'সর্বশেষ সেমিস্টারের গ্রেড রিপোর্ট' },
      { en: 'No-disciplinary-action clearance from the Proctor Office', bn: 'প্রক্টর অফিসের শৃঙ্খলাজনিত ছাড়পত্র' }
    ],
    fee: {
      amountBdt: 200,
      descriptionEn: 'BDT 200 flat processing fee',
      descriptionBn: '২০০ টাকা সার্ভিস চার্জ'
    },
    processingDays: 2,
    eligibilityEn: 'Any current student or alumnus with clean disciplinary records.',
    eligibilityBn: 'শৃঙ্খলাভঙ্গের অভিযোগহীন যেকোনো বর্তমান অথবা প্রাক্তন শিক্ষার্থী।',
    rulesEn: [
      'Must have zero active suspensions or behavioral misconduct reports on record.',
      'Issued with JSTU official digital watermark and tamper-proof verification ID.'
    ],
    rulesBn: [
      'শিক্ষার্থীর বিরুদ্ধে কোনো সক্রিয় বহিষ্কারাদেশ বা অভিযোগ থাকা যাবে না।',
      'ডিজিটাল জলছাপ ও ভেরিফিকেশন লিঙ্কসহ প্রশংসাপত্র প্রস্তুত হবে।'
    ]
  },

  leave: {
    type: 'leave',
    titleEn: 'Student Medical / Emergency Leave Application',
    titleBn: 'ছুটি মঞ্জুরের আবেদন (চিকিৎসাজনিত / জরুরি)',
    category: 'administrative',
    approvalChain: ['Student', 'Department Chairman', 'Approved'],
    requiredDocuments: [
      { en: 'Registered Doctor/Civil Surgeon Medical Certificate (for medical leave)', bn: 'রেজিস্টার্ড চিকিৎসকের ব্যবস্থাপত্র ও সার্টিফিকেট' },
      { en: 'Guardian consent note (for leave exceeding 5 days)', bn: 'অভিভাবকের সম্মতিপত্র (৫ দিনের বেশি হলে)' }
    ],
    fee: {
      amountBdt: 0,
      descriptionEn: 'Free of charge (No fee)',
      descriptionBn: 'বিনামূল্যে (কোনো ফি নেই)'
    },
    processingDays: 1,
    eligibilityEn: 'Any enrolled student experiencing medical illness or family emergency.',
    eligibilityBn: 'চিকিৎসাজনিত অসুস্থতা বা পারিবারিক জরুরি অবস্থায় যেকোনো শিক্ষার্থী।',
    rulesEn: [
      'Medical leave must be submitted within 3 working days of returning to campus.',
      'Total sanctioned leave cannot exceed 25% of total class hours to remain exam eligible (minimum 75% attendance required).'
    ],
    rulesBn: [
      'ছুটি শেষে ক্যাম্পাসে ফেরার ৩ কার্যদিবসের মধ্যে আবেদন সম্পন্ন করতে হবে।',
      'মোট ক্লাসের ২৫%-এর অধিক ছুটি হলে পরীক্ষায় অংশগ্রহণের যোগ্যতা বাতিল হতে পারে।'
    ]
  },

  course_withdrawal: {
    type: 'course_withdrawal',
    titleEn: 'Course Withdrawal / Drop Application',
    titleBn: 'কোর্স প্রত্যাহার (ড্রপ) আবেদন',
    category: 'academic',
    approvalChain: ['Student', 'Department Chairman', 'Exam Controller', 'Approved'],
    requiredDocuments: [
      { en: 'Course advisor endorsement and written recommendation', bn: 'কোর্স উপদেষ্টার সুপারিশ ও মতামত' },
      { en: 'Current semester registration summary', bn: 'চলতি সেমিস্টার রেজিস্ট্রেশন স্লিপ' }
    ],
    fee: {
      amountBdt: 0,
      descriptionEn: 'Free if submitted prior to Week 4 of semester; BDT 500 penalty after Week 4',
      descriptionBn: 'সেমিস্টারের চতুর্থ সপ্তাহের পূর্বে বিনামূল্যে; এরপর ৫০০ টাকা জরিমানা'
    },
    processingDays: 3,
    eligibilityEn: 'Students with course overload or unavoidable scheduling conflict, maintaining minimum 12 credits.',
    eligibilityBn: 'কোর্সের অতিরিক্ত চাপ বা অনিবার্য জটিলতায় ন্যূনতম ১২ ক্রেডিট অবশিষ্ট রেখে আবেদনযোগ্য।',
    rulesEn: [
      'Withdrawn course receives grade "W" on official records without affecting GPA.',
      'Cannot drop below the minimum required credit threshold of 12.0 credits per semester.'
    ],
    rulesBn: [
      'প্রত্যাহারকৃত কোর্সে "W" গ্রেড অন্তর্ভুক্ত হবে এবং তা জিপিএ-তে প্রভাব ফেলবে না।',
      'সেমিস্টারে ন্যূনতম ১২ ক্রেডিটের কম লোড নেওয়া যাবে না।'
    ]
  },

  scholarship: {
    type: 'scholarship',
    titleEn: 'Merit / Need-Based University Scholarship',
    titleBn: 'মেধা / সাধারণ বিশ্ববিদ্যালয় বৃত্তি আবেদন',
    category: 'financial',
    approvalChain: ['Student', 'Department Chairman', 'Registrar', 'Approved'],
    requiredDocuments: [
      { en: 'Official CGPA transcript showing minimum 3.50 (for Merit)', bn: 'ন্যূনতম ৩.৫০ সিজিপিএ সম্বলিত ট্রান্সক্রিপ্ট' },
      { en: 'Upazila Nirbahi Officer (UNO) / Ward Councilor Income Certificate (for Need-Based)', bn: 'ইউএনও / ওয়ার্ড কাউন্সিলর কর্তৃক আয়ের প্রত্যয়নপত্র' },
      { en: 'Bank account statement or details in student’s own name', bn: 'শিক্ষার্থীর নিজস্ব ব্যাংক হিসাবের তথ্য' }
    ],
    fee: {
      amountBdt: 0,
      descriptionEn: 'Free (No application fee)',
      descriptionBn: 'কোনো আবেদন ফি নেই'
    },
    processingDays: 14,
    eligibilityEn: 'Regular students maintaining 80% attendance without any backlog or disciplinary penalty.',
    eligibilityBn: 'কোনো ব্যাকলগবিহীন, ৮০% উপস্থিতি এবং ন্যূনতম ৩.৫০ সিজিপিএ অর্জনকারী নিয়মিত শিক্ষার্থী।',
    rulesEn: [
      'Scholarship grants tuition waiver and BDT 3,000 monthly stipend.',
      'Must maintain clean conduct and not hold concurrent government scholarships.'
    ],
    rulesBn: [
      'বৃত্তিপ্রাপ্তরা টিউশন ফি মওকুফ এবং মাসিক ৩,০০০ টাকা ভাতা পাবেন।',
      'অন্য কোনো সরকারি বৃত্তি একসাথে গ্রহণ করা যাবে না।'
    ]
  },

  clearance: {
    type: 'clearance',
    titleEn: 'Institutional Clearance (Library, Hall, Accounts)',
    titleBn: 'প্রাতিষ্ঠানিক ছাড়পত্র (লাইব্রেরি, হল, হিসাব)',
    category: 'administrative',
    approvalChain: ['Student', 'Department Chairman', 'Registrar', 'Approved'],
    requiredDocuments: [
      { en: 'Central Library returned book confirmation slip', bn: 'লাইব্রেরি বই ফেরত রসিদ' },
      { en: 'Residential Hall provost clearance certificate', bn: 'হল প্রাধ্যক্ষের অনাপত্তিপত্র' },
      { en: 'Bank payment slips for all pending dues', bn: 'সকল বকেয়া পরিশোধের ব্যাংক জমা স্লিপ' }
    ],
    fee: {
      amountBdt: 0,
      descriptionEn: 'Free of charge',
      descriptionBn: 'সম্পূর্ণ বিনামূল্যে'
    },
    processingDays: 3,
    eligibilityEn: 'Graduating students or students withdrawing from university enrollment.',
    eligibilityBn: 'স্নাতক সম্পন্নকারী বা বিশ্ববিদ্যালয় ত্যাগকারী শিক্ষার্থী।',
    rulesEn: [
      'All physical laboratory equipment and borrowed library books must be accounted for.',
      'Required prerequisite prior to receiving the final degree certificate.'
    ],
    rulesBn: [
      'ল্যাবরেটরি সরঞ্জাম ও লাইব্রেরির বই অবশ্যই ফেরত দিতে হবে।',
      'মূল সনদপত্র উত্তোলনের জন্য এই ছাড়পত্র বাধ্যতামূলক।'
    ]
  },

  exam_permission: {
    type: 'exam_permission',
    titleEn: 'Semester Final Special Exam Permission / Admit Clearance',
    titleBn: 'সেমিস্টার ফাইনাল বিশেষ পরীক্ষার অনুমতি / প্রবেশপত্র ছাড়পত্র',
    category: 'academic',
    approvalChain: ['Student', 'Department Chairman', 'Exam Controller', 'Approved'],
    requiredDocuments: [
      { en: 'Departmental attendance verification record (minimum 60% for non-collegiate)', bn: 'বিভাগীয় উপস্থিতি সনদ (নন-কলেজিয়েটের জন্য ন্যূনতম ৬০%)' },
      { en: 'Semester examination fee and non-collegiate fine receipt', bn: 'পরীক্ষার ফি ও নন-কলেজিয়েট ফি পরিশোধ রসিদ' }
    ],
    fee: {
      amountBdt: 500,
      descriptionEn: 'Standard exam fee cleared + BDT 500 non-collegiate fine (if attendance 60-74%)',
      descriptionBn: 'পরীক্ষার নিয়মিত ফি + ৫০০ টাকা নন-কলেজিয়েট জরিমানা (উপস্থিতি ৬০-৭৪% হলে)'
    },
    processingDays: 2,
    eligibilityEn: 'Students with attendance between 60% and 74.9% requiring special syndicate authorization.',
    eligibilityBn: 'উপস্থিতি ৬০% থেকে ৭৪.৯% এর মধ্যে থাকা শিক্ষার্থী (বিশেষ অনুমতি সাপেক্ষে)।',
    rulesEn: [
      'Students with attendance below 60% are strictly dis-collegiate and cannot sit for the examination.',
      'Approved permission unlocks the digital downloadable exam admit card.'
    ],
    rulesBn: [
      '৬০%-এর কম উপস্থিতি থাকলে পরীক্ষা দেওয়ার সুযোগ নেই (ডিস-কলেজিয়েট)।',
      'অনুমোদন পেলে স্বয়ংক্রিয়ভাবে প্রবেশপত্র সক্রিয় হবে।'
    ]
  }
};

/**
 * Helper to query policies by keyword or application type
 */
export function getApplicationPolicy(typeOrKeyword: string): ApplicationPolicy | null {
  const norm = typeOrKeyword.toLowerCase().trim();
  for (const [key, policy] of Object.entries(APPLICATION_POLICIES)) {
    if (
      key === norm ||
      policy.titleEn.toLowerCase().includes(norm) ||
      policy.titleBn.toLowerCase().includes(norm)
    ) {
      return policy;
    }
  }
  return null;
}
