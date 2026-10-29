import { Scholarship } from '../types/scholarship';

export const INITIAL_DEMO_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'sch-need-cum-merit-2026',
    title: 'JSTU Institutional Need-Cum-Merit Financial Aid Stipend',
    titleBn: 'জেএসটিইউ প্রাতিষ্ঠানিক অসচ্ছল মেধাবী শিক্ষাবৃত্তি',
    category: 'Need-Based',
    description: 'Semester tuition and stipend grant for high-performing undergraduate students facing documented financial constraints.',
    descriptionBn: 'আর্থিক অসচ্ছল কিন্তু নিয়মিত ভালো ফলাফলকারী শিক্ষার্থীদের জন্য সেমিস্টারকালীন এককালীন বৃত্তি ও ফি মওকুফ সুবিধা।',
    amount: 20000,
    amountFormatted: '৳20,000 / semester',
    amountFormattedBn: '৳২০,০০০ / সেমিস্টার',
    eligibility: [
      'Minimum CGPA 3.20 in the last completed semester',
      'Annual household income below ৳250,000 (certified by local administrative authority)',
      'No active academic probation or disciplinary record',
      'Minimum 75% class attendance in enrolled courses'
    ],
    eligibilityBn: [
      'পূর্ববর্তী সেমিস্টারে ন্যূনতম সিজিপিএ ৩.২০',
      'পরিবারের বার্ষিক আয় সর্বোচ্চ ২,৫০,০০০ টাকার নিচে (প্রত্যয়নপত্র আবশ্যক)',
      'কোনো একাডেমিক বা শৃঙ্খলাভঙ্গের অভিযোগ থাকা চলবে না',
      'ক্লাসে ন্যূনতম ৭৫% উপস্থিতি নিশ্চিত হতে হবে'
    ],
    minimumCgpa: 3.20,
    maxFamilyIncome: 250000,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    slots: 5,
    status: 'UNDER_REVIEW',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sch-vc-merit-2026',
    title: "Vice-Chancellor's Academic Distinction Merit Fellowship",
    titleBn: 'উপাচার্য একাডেমিক এক্সিলেন্স মেধা ফেলোশিপ',
    category: 'Merit',
    description: 'Premier competitive award recognizing the top scholarly achievers across engineering, science, and social sciences faculties.',
    descriptionBn: 'অনুষদভিত্তিক সর্বোচ্চ একাডেমিক ফলাফল অর্জনকারী মেধাবী শিক্ষার্থীদের জন্য উপাচার্য সম্মাননা ফেলোশিপ।',
    amount: 30000,
    amountFormatted: '৳30,000 / semester',
    amountFormattedBn: '৳৩০,০০০ / সেমিস্টার',
    eligibility: [
      'Minimum cumulative CGPA 3.75 without any semester retakes',
      'Top 5% rank in the respective departmental cohort',
      'Active participation in university co-curricular or research projects',
      'Endorsement from Departmental Academic Committee'
    ],
    eligibilityBn: [
      'ধারাবাহিক ন্যূনতম সিজিপিএ ৩.৭৫ (কোনো রিটেক থাকা যাবে না)',
      'বিভাগে শীর্ষ ৫% মেধা তালিকায় অবস্থান',
      'সহশিক্ষা বা গবেষণা কার্যক্রমে ইতিবাচক সংশ্লিষ্টতা',
      'বিভাগীয় একাডেমিক কমিটির অনুমোদন'
    ],
    minimumCgpa: 3.75,
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    slots: 3,
    status: 'OPEN',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sch-bangabandhu-fellowship',
    title: 'Bangabandhu Higher Education Research & Talent Grant',
    titleBn: 'বঙ্গবন্ধু উচ্চশিক্ষা গবেষণা ও মেধা অনুদান',
    category: 'Special',
    description: 'Prestigious endowment for undergraduate capstone research, publications, and innovation initiatives at JSTU.',
    descriptionBn: 'স্নাতক পর্যায়ের উদ্ভাবনী থিসিস ও গবেষণামূলক কাজের জন্য বিশেষ অনুদান।',
    amount: 50000,
    amountFormatted: '৳50,000 / year',
    amountFormattedBn: '৳৫০,০০০ / বাৎসরিক',
    eligibility: [
      'Enrolled 3rd or 4th year student conducting supervised research',
      'Minimum CGPA 3.60',
      'Peer-reviewed conference or journal paper draft submission'
    ],
    eligibilityBn: [
      'স্নাতক ৩য় বা ৪র্থ বর্ষের গবেষণারত শিক্ষার্থী',
      'ন্যূনতম সিজিপিএ ৩.৬০',
      'প্রকল্প বা গবেষণা প্রস্তাবনা দাখিল'
    ],
    minimumCgpa: 3.60,
    deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    slots: 2,
    status: 'PUBLISHED',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    publishedRecipients: [
      {
        studentId: 'JSTU2026002',
        studentName: 'Sadia Afrin',
        studentNameBn: 'সাদিয়া আফরিন',
        department: 'Computer Science & Engineering',
        cgpa: 3.92,
        rank: 1,
        awardAmount: '৳50,000'
      },
      {
        studentId: 'JSTU2026003',
        studentName: 'Mahmudur Rahman',
        studentNameBn: 'মাহমুদুর রহমান',
        department: 'Electrical & Electronic Engineering',
        cgpa: 3.88,
        rank: 2,
        awardAmount: '৳50,000'
      }
    ],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sch-jamalpur-district-quota',
    title: 'Greater Jamalpur Endowed Regional Talent Scholarship',
    titleBn: 'বৃহত্তর জামালপুর জেলা মেধা ও উন্নয়ন ট্রাস্ট বৃত্তি',
    category: 'District-Quota',
    description: 'Endowment established by the Jamalpur District Development Forum for students from local educational institutions.',
    descriptionBn: 'জামালপুর জেলার স্থায়ী বাসিন্দাদের জন্য জেলা কল্যাণ ট্রাস্ট পরিচালিত শিক্ষাবৃত্তি।',
    amount: 15000,
    amountFormatted: '৳15,000 / semester',
    amountFormattedBn: '৳১৫,০০০ / সেমিস্টার',
    eligibility: [
      'Permanent domicile in Jamalpur or Mymensingh administrative division',
      'SSC & HSC completed from Jamalpur regional colleges/schools',
      'Minimum CGPA 3.30'
    ],
    eligibilityBn: [
      'জামালপুর বা ময়মনসিংহ বিভাগের স্থায়ী বাসিন্দা',
      'জামালপুর অঞ্চলের প্রতিষ্ঠান থেকে এসএসসি ও এইচএসসি উত্তীর্ণ',
      'ন্যূনতম সিজিপিএ ৩.৩০'
    ],
    minimumCgpa: 3.30,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    slots: 8,
    status: 'OPEN',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const INITIAL_DEMO_SCHOLARSHIP_APPLICATIONS = [
  {
    id: 'app-sch-001',
    applicationNumber: 'JSTU-APP-2026-880101',
    type: 'scholarship' as const,
    title: 'Merit Scholarship / Tuition Stipend Application',
    titleBn: 'মেধাবৃত্তি ও শিক্ষাবৃত্তি আবেদন',
    applicantUid: 'demo_student_01',
    applicantName: 'Tanvir Ahmed',
    applicantNameBn: 'তানভীর আহমেদ',
    applicantEmail: 'student.demo@jstu.ac.bd',
    studentId: 'JSTU2026001',
    department: 'CSE',
    status: 'UNDER_REVIEW' as const,
    currentStepIndex: 1, // Endorsed by Chairman, now with Scholarship Committee / Admin
    payload: {
      scholarshipId: 'sch-need-cum-merit-2026',
      scholarshipType: 'Need-Based Financial Aid',
      scholarshipTitle: 'JSTU Institutional Need-Cum-Merit Financial Aid Stipend',
      cgpa: 3.82,
      annualIncome: 180000,
      fatherOccupation: 'Small Trader',
      familyMembers: 5,
      reason: 'Living in university hall with limited family financial backing. High GPA maintained across all terms.'
    },
    attachments: [
      {
        name: 'Ward_Commissioner_Income_Certificate.pdf',
        size: 1450000,
        type: 'application/pdf',
        uploadedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        name: '5th_Semester_Official_GradeSheet.pdf',
        size: 1250000,
        type: 'application/pdf',
        uploadedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    auditTrail: [
      {
        id: 'aud-sch-1',
        applicationId: 'app-sch-001',
        applicationNumber: 'JSTU-APP-2026-880101',
        actorUid: 'demo_student_01',
        actorName: 'Tanvir Ahmed',
        actorEmail: 'student.demo@jstu.ac.bd',
        role: 'student',
        action: 'SUBMIT' as const,
        fromStatus: 'DRAFT' as const,
        toStatus: 'SUBMITTED' as const,
        fromStepIndex: 0,
        toStepIndex: 0,
        comment: 'Application submitted with income certificate and grade transcript.',
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'aud-sch-2',
        applicationId: 'app-sch-001',
        applicationNumber: 'JSTU-APP-2026-880101',
        actorUid: 'demo_chairman_01',
        actorName: 'Prof. Dr. Chairman CSE',
        actorEmail: 'chairman.demo@jstu.ac.bd',
        role: 'dept_chairman',
        action: 'APPROVE' as const,
        fromStatus: 'SUBMITTED' as const,
        toStatus: 'UNDER_REVIEW' as const,
        fromStepIndex: 0,
        toStepIndex: 1,
        comment: 'Recommended and verified by Department Chairman. Student academic track record and conduct are exemplary.',
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    submittedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'app-sch-002',
    applicationNumber: 'JSTU-APP-2026-880102',
    type: 'scholarship' as const,
    title: 'Merit Scholarship / Tuition Stipend Application',
    titleBn: 'মেধাবৃত্তি ও শিক্ষাবৃত্তি আবেদন',
    applicantUid: 'demo_st_02',
    applicantName: 'Sadia Afrin',
    applicantNameBn: 'সাদিয়া আফরিন',
    applicantEmail: 'sadia.2026002@jstu.ac.bd',
    studentId: 'JSTU2026002',
    department: 'CSE',
    status: 'UNDER_REVIEW' as const,
    currentStepIndex: 1,
    payload: {
      scholarshipId: 'sch-need-cum-merit-2026',
      scholarshipType: 'Need-Based Financial Aid',
      scholarshipTitle: 'JSTU Institutional Need-Cum-Merit Financial Aid Stipend',
      cgpa: 3.91,
      annualIncome: 220000,
      fatherOccupation: 'Retired School Teacher',
      familyMembers: 4,
      reason: 'Top cohort student pursuing advanced software engineering research.'
    },
    attachments: [
      {
        name: 'Income_Certificate_Sadia.pdf',
        size: 980000,
        type: 'application/pdf',
        uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    auditTrail: [],
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'app-sch-003',
    applicationNumber: 'JSTU-APP-2026-880103',
    type: 'scholarship' as const,
    title: 'Merit Scholarship / Tuition Stipend Application',
    titleBn: 'মেধাবৃত্তি ও শিক্ষাবৃত্তি আবেদন',
    applicantUid: 'demo_st_03',
    applicantName: 'Mahmudur Rahman',
    applicantNameBn: 'মাহমুদুর রহমান',
    applicantEmail: 'mahmud.2026003@jstu.ac.bd',
    studentId: 'JSTU2026003',
    department: 'CSE',
    status: 'UNDER_REVIEW' as const,
    currentStepIndex: 1,
    payload: {
      scholarshipId: 'sch-need-cum-merit-2026',
      scholarshipType: 'Need-Based Financial Aid',
      scholarshipTitle: 'JSTU Institutional Need-Cum-Merit Financial Aid Stipend',
      cgpa: 3.65,
      annualIncome: 110000,
      fatherOccupation: 'Farmer / Agriculture',
      familyMembers: 6,
      reason: 'Acute financial difficulty with rural agricultural background. Consistent academic diligence.'
    },
    attachments: [
      {
        name: 'UP_Chairman_Income_Doc.pdf',
        size: 1100000,
        type: 'application/pdf',
        uploadedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    auditTrail: [],
    submittedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'app-sch-004',
    applicationNumber: 'JSTU-APP-2026-880104',
    type: 'scholarship' as const,
    title: 'Merit Scholarship / Tuition Stipend Application',
    titleBn: 'মেধাবৃত্তি ও শিক্ষাবৃত্তি আবেদন',
    applicantUid: 'demo_st_04',
    applicantName: 'Nusrat Jahan',
    applicantNameBn: 'নুসরাত জাহান',
    applicantEmail: 'nusrat.2026004@jstu.ac.bd',
    studentId: 'JSTU2026004',
    department: 'CSE',
    status: 'UNDER_REVIEW' as const,
    currentStepIndex: 1,
    payload: {
      scholarshipId: 'sch-need-cum-merit-2026',
      scholarshipType: 'Need-Based Financial Aid',
      scholarshipTitle: 'JSTU Institutional Need-Cum-Merit Financial Aid Stipend',
      cgpa: 3.78,
      annualIncome: 140000,
      fatherOccupation: 'Non-government clerk',
      familyMembers: 5,
      reason: 'Strong academic dedication with demonstrated need for semester laboratory books and fees.'
    },
    attachments: [],
    auditTrail: [],
    submittedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'app-sch-005',
    applicationNumber: 'JSTU-APP-2026-880105',
    type: 'scholarship' as const,
    title: 'Merit Scholarship / Tuition Stipend Application',
    titleBn: 'মেধাবৃত্তি ও শিক্ষাবৃত্তি আবেদন',
    applicantUid: 'demo_st_05',
    applicantName: 'Arif Faisal',
    applicantNameBn: 'আরিফ ফয়সাল',
    applicantEmail: 'arif.2026005@jstu.ac.bd',
    studentId: 'JSTU2026005',
    department: 'EEE',
    status: 'UNDER_REVIEW' as const,
    currentStepIndex: 1,
    payload: {
      scholarshipId: 'sch-need-cum-merit-2026',
      scholarshipType: 'Need-Based Financial Aid',
      scholarshipTitle: 'JSTU Institutional Need-Cum-Merit Financial Aid Stipend',
      cgpa: 3.55,
      annualIncome: 95000,
      fatherOccupation: 'Daily wage worker',
      familyMembers: 6,
      reason: 'First in family to attend university. Extremely constrained family income.'
    },
    attachments: [],
    auditTrail: [],
    submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'app-sch-006',
    applicationNumber: 'JSTU-APP-2026-880106',
    type: 'scholarship' as const,
    title: 'Merit Scholarship / Tuition Stipend Application',
    titleBn: 'মেধাবৃত্তি ও শিক্ষাবৃত্তি আবেদন',
    applicantUid: 'demo_st_06',
    applicantName: 'Fahmida Haque',
    applicantNameBn: 'ফাহমিদা হক',
    applicantEmail: 'fahmida.2026006@jstu.ac.bd',
    studentId: 'JSTU2026006',
    department: 'CSE',
    status: 'UNDER_REVIEW' as const,
    currentStepIndex: 1,
    payload: {
      scholarshipId: 'sch-need-cum-merit-2026',
      scholarshipType: 'Need-Based Financial Aid',
      scholarshipTitle: 'JSTU Institutional Need-Cum-Merit Financial Aid Stipend',
      cgpa: 3.86,
      annualIncome: 195000,
      fatherOccupation: 'Private tutor',
      familyMembers: 4,
      reason: 'Consistently on Dean honor roll. Living in student hall.'
    },
    attachments: [],
    auditTrail: [],
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  }
];
