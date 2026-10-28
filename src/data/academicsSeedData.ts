import {
  DepartmentFacultyMember,
  DepartmentProgram,
  DepartmentCourse,
  DepartmentLab,
  DepartmentResearchProject,
  DepartmentNotice,
  AcademicCalendarEvent,
  ClassRoutineSlot
} from '../types/academics';
import { DepartmentInfo, FacultyInfo } from '../types';

// ============================================================================
// Academic Architecture Seed Data for JSTU
// /* [REPLACE WITH REAL CONTENT] Placeholder institutional academic records */
// Notice: All faculty names, programs, courses, lab equipment, and routines are
// structural prototypes pending gazetted publication by the Academic Council.
// ============================================================================

export const NEUTRAL_AVATAR =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20128%20128%22%3E%3Crect%20width%3D%22128%22%20height%3D%22128%22%20rx%3D%2220%22%20fill%3D%22%23F1F5F9%22%2F%3E%3Ccircle%20cx%3D%2264%22%20cy%3D%2248%22%20r%3D%2222%22%20fill%3D%22%2394A3B8%22%2F%3E%3Cpath%20d%3D%22M28%20108c0-20%2016-36%2036-36s36%2016%2036%2036%22%20fill%3D%22%2394A3B8%22%2F%3E%3C%2Fsvg%3E';

// ----------------------------------------------------------------------------
// 1. The 6 Statutory Faculties
// ----------------------------------------------------------------------------
export const facultiesData: FacultyInfo[] = [
  {
    id: 'engineering',
    name: 'Faculty of Engineering',
    nameBn: 'প্রকৌশল অনুষদ',
    deanName: 'Prof. Dr. Placeholder Dean 1 [REPLACE WITH REAL CONTENT]',
    deanNameBn: 'অধ্যাপক ড. অনুষদ ডিন ১ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    departmentCodes: ['CSE', 'EEE'],
    description: '/* [REPLACE WITH REAL CONTENT] */ Pioneering cutting-edge computation, artificial intelligence, electrical networks, and embedded systems education.',
    descriptionBn: '/* [REPLACE WITH REAL CONTENT] */ আধুনিক কম্পিউটেশন, কৃত্রিম বুদ্ধিমত্তা ও তড়িৎ কৌশল গবেষণায় বিশেষায়িত অনুষদ।'
  },
  {
    id: 'science',
    name: 'Faculty of Science',
    nameBn: 'বিজ্ঞান অনুষদ',
    deanName: 'Prof. Dr. Placeholder Dean 2 [REPLACE WITH REAL CONTENT]',
    deanNameBn: 'অধ্যাপক ড. অনুষদ ডিন ২ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    departmentCodes: ['MATH'],
    description: '/* [REPLACE WITH REAL CONTENT] */ Cultivating pure and applied mathematical frameworks, computational modeling, and data sciences.',
    descriptionBn: '/* [REPLACE WITH REAL CONTENT] */ মৌলিক ও ফলিত গণিত, কম্পিউটেশনাল মডেলিং এবং ডেটা সায়েন্সে দক্ষ মানবসম্পদ তৈরিতে নিয়োজিত।'
  },
  {
    id: 'agriculture-life-science',
    name: 'Faculty of Agriculture & Life Science',
    nameBn: 'কৃষি ও জীববিজ্ঞান অনুষদ',
    deanName: 'Prof. Dr. Placeholder Dean 3 [REPLACE WITH REAL CONTENT]',
    deanNameBn: 'অধ্যাপক ড. অনুষদ ডিন ৩ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    departmentCodes: ['FISH'],
    description: '/* [REPLACE WITH REAL CONTENT] */ Advancing sustainable aquaculture, riverine biodiversity research, and aquatic resource conservation in the Brahmaputra basin.',
    descriptionBn: '/* [REPLACE WITH REAL CONTENT] */ টেকসই মৎস্যসম্পদ ব্যবস্থাপনা, নদী অববাহিকার জীববৈচিত্র্য ও জলজ পরিবেশ সুরক্ষায় বিশেষায়িত শিক্ষা।'
  },
  {
    id: 'earth-science',
    name: 'Faculty of Earth Science',
    nameBn: 'ভূ-বিজ্ঞান অনুষদ',
    deanName: 'Prof. Dr. Placeholder Dean 4 [REPLACE WITH REAL CONTENT]',
    deanNameBn: 'অধ্যাপক ড. অনুষদ ডিন ৪ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    departmentCodes: ['GEOL'],
    description: '/* [REPLACE WITH REAL CONTENT] */ Exploring geological formations, hydrogeology, mineral resources, and natural hazard mitigation.',
    descriptionBn: '/* [REPLACE WITH REAL CONTENT] */ ভূ-তাত্ত্বিক জরিপ, ভূ-গর্ভস্থ পানি ব্যবস্থাপনা, খনিজ সম্পদ এবং দুর্যোগ প্রশমনে আধুনিক প্রযুক্তি প্রয়োগ।'
  },
  {
    id: 'business-studies',
    name: 'Faculty of Business Studies',
    nameBn: 'ব্যবসায় শিক্ষা অনুষদ',
    deanName: 'Prof. Dr. Placeholder Dean 5 [REPLACE WITH REAL CONTENT]',
    deanNameBn: 'অধ্যাপক ড. অনুষদ ডিন ৫ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    departmentCodes: ['MGMT'],
    description: '/* [REPLACE WITH REAL CONTENT] */ Equipping future organizational leaders with strategic management, technological entrepreneurship, and financial analytics.',
    descriptionBn: '/* [REPLACE WITH REAL CONTENT] */ কৌশলগত ব্যবস্থাপনা, প্রযুক্তি উদ্যোক্তা এবং প্রাতিষ্ঠানিক উদ্ভাবনে ভবিষ্যৎ নেতৃত্ব গড়ে তুলছে।'
  },
  {
    id: 'social-science',
    name: 'Faculty of Social Science',
    nameBn: 'সামাজিক বিজ্ঞান অনুষদ',
    deanName: 'Prof. Dr. Placeholder Dean 6 [REPLACE WITH REAL CONTENT]',
    deanNameBn: 'অধ্যাপক ড. অনুষদ ডিন ৬ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    departmentCodes: ['SW'],
    description: '/* [REPLACE WITH REAL CONTENT] */ Fostering evidence-based community development, social policy formulation, and human rights advocacy.',
    descriptionBn: '/* [REPLACE WITH REAL CONTENT] */ কমিউনিটি উন্নয়ন, সমাজকল্যাণ নীতি প্রণয়ন এবং মানবিক টেকসই উন্নয়নের গবেষণায় অগ্রণী ভূমিকা।'
  }
];

// ----------------------------------------------------------------------------
// 2. The 7 Academic Departments
// ----------------------------------------------------------------------------
export const departmentsData: DepartmentInfo[] = [
  {
    id: 'cse',
    code: 'CSE',
    name: 'Department of Computer Science & Engineering',
    nameBn: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং বিভাগ',
    faculty: 'Faculty of Engineering',
    facultyBn: 'প্রকৌশল অনুষদ',
    established: 2021,
    degreesOffered: [
      'B.Sc. (Engg.) in CSE [REPLACE WITH REAL CONTENT]',
      'M.Sc. (Engg.) in CSE [REPLACE WITH REAL CONTENT]'
    ],
    degreesOfferedBn: [
      'বি.এস.সি (ইঞ্জিনিয়ারিং) ইন সিএসই [প্রকৃত নাম প্রদান করুন]',
      'এম.এস.সি (ইঞ্জিনিয়ারিং) ইন সিএসই [প্রকৃত নাম প্রদান করুন]'
    ],
    headOfDepartment: {
      name: 'Dr. Placeholder Chairman 1 [REPLACE WITH REAL CONTENT]',
      designation: 'Associate Professor & Chairman [REPLACE WITH REAL CONTENT]',
      email: 'chairman.cse@jstu.ac.bd'
    },
    overview:
      '/* [REPLACE WITH REAL CONTENT] */ The Department of Computer Science & Engineering delivers comprehensive education in computer systems, algorithmic reasoning, software engineering, and artificial intelligence.',
    overviewBn:
      '/* [REPLACE WITH REAL CONTENT] */ কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং বিভাগ উচ্চমানের কম্পিউটার সিস্টেম, সফটওয়্যার প্রকৌশল ও কৃত্রিম বুদ্ধিমত্তা শিক্ষাদানে নিবেদিত।',
    stats: {
      facultyCount: 8,
      studentCount: 240,
      labCount: 4,
      alumniCount: 120
    },
    researchAreas: [
      'Bangla Natural Language Processing [REPLACE]',
      'Cybersecurity & Applied Cryptography [REPLACE]',
      'Distributed Cloud Systems [REPLACE]',
      'Edge Machine Intelligence [REPLACE]'
    ],
    facilities: [
      'High Performance Computing Cluster',
      'Software Engineering Lab',
      'Cybersecurity & Network Drill Lab',
      'Robotics & Embedded Systems Lab'
    ]
  },
  {
    id: 'eee',
    code: 'EEE',
    name: 'Department of Electrical & Electronic Engineering',
    nameBn: 'ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং বিভাগ',
    faculty: 'Faculty of Engineering',
    facultyBn: 'প্রকৌশল অনুষদ',
    established: 2021,
    degreesOffered: [
      'B.Sc. (Engg.) in EEE [REPLACE WITH REAL CONTENT]',
      'M.Sc. (Engg.) in EEE [REPLACE WITH REAL CONTENT]'
    ],
    degreesOfferedBn: [
      'বি.এস.সি (ইঞ্জিনিয়ারিং) ইন ইইই [প্রকৃত নাম প্রদান করুন]',
      'এম.এস.সি (ইঞ্জিনিয়ারিং) ইন ইইই [প্রকৃত নাম প্রদান করুন]'
    ],
    headOfDepartment: {
      name: 'Dr. Placeholder Chairman 2 [REPLACE WITH REAL CONTENT]',
      designation: 'Associate Professor & Chairman [REPLACE WITH REAL CONTENT]',
      email: 'chairman.eee@jstu.ac.bd'
    },
    overview:
      '/* [REPLACE WITH REAL CONTENT] */ The Department of Electrical & Electronic Engineering educates engineers in power grid systems, smart microgrids, semiconductor VLSI design, and telecommunications.',
    overviewBn:
      '/* [REPLACE WITH REAL CONTENT] */ তড়িৎ ও ইলেকট্রনিক কৌশল বিভাগ বিদ্যুৎ গ্রিড, নবায়নযোগ্য শক্তি, ভিএলএসআই সার্কিট ডিজাইন ও টেলিযোগাযোগে দক্ষ প্রকৌশলী তৈরিতে নিয়োজিত।',
    stats: {
      facultyCount: 7,
      studentCount: 220,
      labCount: 4,
      alumniCount: 100
    },
    researchAreas: [
      'Renewable Energy Microgrids [REPLACE]',
      'Semiconductor & Nanotechnology [REPLACE]',
      '5G Wireless Communications [REPLACE]',
      'Power Electronics & Drives [REPLACE]'
    ],
    facilities: [
      'Power Systems & High Voltage Lab',
      'Circuits & Electronics Lab',
      'Microprocessor & Control Lab',
      'Telecommunications Sessional Lab'
    ]
  },
  {
    id: 'mathematics',
    code: 'MATH',
    name: 'Department of Mathematics',
    nameBn: 'গণিত বিভাগ',
    faculty: 'Faculty of Science',
    facultyBn: 'বিজ্ঞান অনুষদ',
    established: 2021,
    degreesOffered: [
      'B.Sc. (Honours) in Mathematics [REPLACE WITH REAL CONTENT]',
      'M.Sc. in Mathematics [REPLACE WITH REAL CONTENT]'
    ],
    degreesOfferedBn: [
      'বি.এস.সি (অনার্স) ইন গণিত [প্রকৃত নাম প্রদান করুন]',
      'এম.এস.সি ইন গণিত [প্রকৃত নাম প্রদান করুন]'
    ],
    headOfDepartment: {
      name: 'Dr. Placeholder Chairman 3 [REPLACE WITH REAL CONTENT]',
      designation: 'Professor & Chairman [REPLACE WITH REAL CONTENT]',
      email: 'chairman.math@jstu.ac.bd'
    },
    overview:
      '/* [REPLACE WITH REAL CONTENT] */ The Department of Mathematics offers rigorous education in pure mathematics, applied computational analysis, differential modeling, and numerical simulations.',
    overviewBn:
      '/* [REPLACE WITH REAL CONTENT] */ গণিত বিভাগ মৌলিক গণিত, ফলিত বিশ্লেষণ, ডিফারেনশিয়াল মডেলিং এবং সংখ্যাত্মক সিমুলেশনে উচ্চতর শিক্ষা ও গবেষণার পরিবেশ প্রদান করে।',
    stats: {
      facultyCount: 6,
      studentCount: 180,
      labCount: 2,
      alumniCount: 85
    },
    researchAreas: [
      'Fluid Dynamics & Magnetohydrodynamics [REPLACE]',
      'Numerical Computation & Modeling [REPLACE]',
      'Differential Equations & Cryptography [REPLACE]'
    ],
    facilities: [
      'Computational Mathematics Lab (MATLAB & Mathematica)',
      'Departmental Seminar Library'
    ]
  },
  {
    id: 'fisheries',
    code: 'FISH',
    name: 'Department of Fisheries',
    nameBn: 'মৎস্যবিজ্ঞান বিভাগ',
    faculty: 'Faculty of Agriculture & Life Science',
    facultyBn: 'কৃষি ও জীববিজ্ঞান অনুষদ',
    established: 2021,
    degreesOffered: [
      'B.Sc. (Honours) in Fisheries [REPLACE WITH REAL CONTENT]',
      'M.Sc. in Fisheries [REPLACE WITH REAL CONTENT]'
    ],
    degreesOfferedBn: [
      'বি.এস.সি (অনার্স) ইন ফিশারিজ [প্রকৃত নাম প্রদান করুন]',
      'এম.এস.সি ইন ফিশারিজ [প্রকৃত নাম প্রদান করুন]'
    ],
    headOfDepartment: {
      name: 'Dr. Placeholder Chairman 4 [REPLACE WITH REAL CONTENT]',
      designation: 'Associate Professor & Chairman [REPLACE WITH REAL CONTENT]',
      email: 'chairman.fish@jstu.ac.bd'
    },
    overview:
      '/* [REPLACE WITH REAL CONTENT] */ The Department of Fisheries trains students in aquaculture technologies, fish biology, disease pathology, riverine conservation, and commercial aqua-resource processing.',
    overviewBn:
      '/* [REPLACE WITH REAL CONTENT] */ মৎস্যবিজ্ঞান বিভাগ আধুনিক মৎস্য চাষ, মাছের রোগতত্ত্ব, নদ-নদীর জীববৈচিত্র্য সংরক্ষণ ও জলজ সম্পদ প্রক্রিয়াজাতকরণে উন্নত শিক্ষা প্রদান করে।',
    stats: {
      facultyCount: 6,
      studentCount: 190,
      labCount: 3,
      alumniCount: 90
    },
    researchAreas: [
      'Riverine Fish Biodiversity & Conservation [REPLACE]',
      'Fish Pathology & Aquatic Biotechnology [REPLACE]',
      'Probiotics in Sustainable Aquaculture [REPLACE]'
    ],
    facilities: [
      'Aquatic Biotechnology & Pathology Lab',
      'Water Quality Analysis Lab',
      'Wet Hatchery & Field Demonstration Ponds'
    ]
  },
  {
    id: 'geology',
    code: 'GEOL',
    name: 'Department of Geology',
    nameBn: 'ভূতত্ত্ব বিভাগ',
    faculty: 'Faculty of Earth Science',
    facultyBn: 'ভূ-বিজ্ঞান অনুষদ',
    established: 2021,
    degreesOffered: [
      'B.Sc. (Honours) in Geology [REPLACE WITH REAL CONTENT]',
      'M.Sc. in Geology [REPLACE WITH REAL CONTENT]'
    ],
    degreesOfferedBn: [
      'বি.এস.সি (অনার্স) ইন ভূতত্ত্ব [প্রকৃত নাম প্রদান করুন]',
      'এম.এস.সি ইন ভূতত্ত্ব [প্রকৃত নাম প্রদান করুন]'
    ],
    headOfDepartment: {
      name: 'Dr. Placeholder Chairman 5 [REPLACE WITH REAL CONTENT]',
      designation: 'Assistant Professor & Chairman [REPLACE WITH REAL CONTENT]',
      email: 'chairman.geol@jstu.ac.bd'
    },
    overview:
      '/* [REPLACE WITH REAL CONTENT] */ The Department of Geology explores earth structure, hydrogeology, mineralogy, petroleum exploration, and satellite remote sensing for environmental risk mitigation.',
    overviewBn:
      '/* [REPLACE WITH REAL CONTENT] */ ভূতত্ত্ব বিভাগ পৃথিবীর গঠন, ভূগর্ভস্থ পানি সম্পদ, খনিজ শিলা, জ্বালানি অনুসন্ধান ও স্যাটেলাইট রিমোট সেন্সিং গবেষণায় বিশেষজ্ঞ তৈরি করে।',
    stats: {
      facultyCount: 5,
      studentCount: 160,
      labCount: 2,
      alumniCount: 70
    },
    researchAreas: [
      'Hydrogeology & Groundwater Aquifer Modeling [REPLACE]',
      'Sedimentary Basin Analysis & Fossil Mapping [REPLACE]',
      'GIS Remote Sensing of Natural Hazards [REPLACE]'
    ],
    facilities: [
      'Petrology & Mineral Identification Lab',
      'GIS & Remote Sensing Computing Lab',
      'Geological Fieldwork Survey Station'
    ]
  },
  {
    id: 'management',
    code: 'MGMT',
    name: 'Department of Management',
    nameBn: 'ব্যবস্থাপনা বিভাগ',
    faculty: 'Faculty of Business Studies',
    facultyBn: 'ব্যবসায় শিক্ষা অনুষদ',
    established: 2021,
    degreesOffered: [
      'Bachelor of Business Administration (BBA) [REPLACE WITH REAL CONTENT]',
      'Master of Business Administration (MBA) [REPLACE WITH REAL CONTENT]'
    ],
    degreesOfferedBn: [
      'ব্যাচেলর অব বিজনেস অ্যাডমিনিস্ট্রেশন (বিবিএ) [প্রকৃত নাম প্রদান করুন]',
      'মাস্টার অব বিজনেস অ্যাডমিনিস্ট্রেশন (এমবিএ) [প্রকৃত নাম প্রদান করুন]'
    ],
    headOfDepartment: {
      name: 'Dr. Placeholder Chairman 6 [REPLACE WITH REAL CONTENT]',
      designation: 'Associate Professor & Chairman [REPLACE WITH REAL CONTENT]',
      email: 'chairman.mgmt@jstu.ac.bd'
    },
    overview:
      '/* [REPLACE WITH REAL CONTENT] */ The Department of Management develops future business leaders with competencies in organizational leadership, supply chain logistics, fintech innovations, and enterprise management.',
    overviewBn:
      '/* [REPLACE WITH REAL CONTENT] */ ব্যবস্থাপনা বিভাগ আধুনিক প্রাতিষ্ঠানিক নেতৃত্ব, সাপ্লাই চেইন ব্যবস্থাপনা, ডিজিটাল ব্যবসা ও করপোরেট সুশাসনে দক্ষ গ্র্যাজুয়েট তৈরি করে।',
    stats: {
      facultyCount: 6,
      studentCount: 210,
      labCount: 2,
      alumniCount: 110
    },
    researchAreas: [
      'Supply Chain Digitization & E-Commerce [REPLACE]',
      'Technological Entrepreneurship in Developing Economies [REPLACE]',
      'Corporate Governance & ESG Compliance [REPLACE]'
    ],
    facilities: [
      'Business Analytics & Simulation Lab',
      'Executive Case Study Seminar Room'
    ]
  },
  {
    id: 'social-work',
    code: 'SW',
    name: 'Department of Social Work',
    nameBn: 'সমাজকর্ম বিভাগ',
    faculty: 'Faculty of Social Science',
    facultyBn: 'সামাজিক বিজ্ঞান অনুষদ',
    established: 2021,
    degreesOffered: [
      'Bachelor of Social Science (BSS) in Social Work [REPLACE WITH REAL CONTENT]',
      'Master of Social Science (MSS) in Social Work [REPLACE WITH REAL CONTENT]'
    ],
    degreesOfferedBn: [
      'ব্যাচেলর অব সোশ্যাল সায়েন্স (বিএসএস) ইন সমাজকর্ম [প্রকৃত নাম প্রদান করুন]',
      'মাস্টার অব সোশ্যাল সায়েন্স (এমএসএস) ইন সমাজকর্ম [প্রকৃত নাম প্রদান করুন]'
    ],
    headOfDepartment: {
      name: 'Dr. Placeholder Chairman 7 [REPLACE WITH REAL CONTENT]',
      designation: 'Associate Professor & Chairman [REPLACE WITH REAL CONTENT]',
      email: 'chairman.sw@jstu.ac.bd'
    },
    overview:
      '/* [REPLACE WITH REAL CONTENT] */ The Department of Social Work trains empathetic practitioners in participatory community development, child and family welfare, psychosocial interventions, and disaster resilience.',
    overviewBn:
      '/* [REPLACE WITH REAL CONTENT] */ সমাজকর্ম বিভাগ তৃণমূল কমিউনিটি উন্নয়ন, শিশু ও পরিবার কল্যাণ, মানসিক স্বাস্থ্য সেবা এবং দুর্যোগ ব্যবস্থাপনায় দক্ষ মানবসম্পদ তৈরিতে অবদান রাখছে।',
    stats: {
      facultyCount: 5,
      studentCount: 175,
      labCount: 2,
      alumniCount: 80
    },
    researchAreas: [
      'Riverine Erosion & Community Resilience [REPLACE]',
      'Child Protection & Social Safety Nets [REPLACE]',
      'Psychosocial Healthcare & Disability Inclusion [REPLACE]'
    ],
    facilities: [
      'Social Research & Data Analytics Lab',
      'Clinical Counseling Practicum Room'
    ]
  }
];

// ----------------------------------------------------------------------------
// 3. Faculty Members Across All 7 Departments
// Strict Rule: Neutral vector avatars only, no real photos, no real names.
// Every record marked with [REPLACE WITH REAL CONTENT].
// ----------------------------------------------------------------------------
export const departmentFacultyMembers: DepartmentFacultyMember[] = [
  // --- CSE Faculty ---
  {
    id: 'fac-cse-01',
    departmentId: 'cse',
    name: 'Dr. Placeholder Member 1 [REPLACE WITH REAL CONTENT]',
    nameBn: 'ড. অনুষদ সদস্য ১ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Associate Professor & Chairman [REPLACE WITH REAL CONTENT]',
    designationBn: 'সহযোগী অধ্যাপক ও চেয়ারম্যান [প্রকৃত তথ্য দিন]',
    email: 'chairman.cse@jstu.ac.bd',
    phone: '+880 29977 00001',
    room: 'Academic Complex, Room 401 [REPLACE]',
    roomBn: 'একাডেমিক কমপ্লেক্স, কক্ষ ৪০১',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['Ph.D. in Computer Science [REPLACE]', 'B.Sc. in CSE [REPLACE]'],
    degreesBn: ['পিএইচডি ইন কম্পিউটার সায়েন্স [প্রকৃত ডিগ্রি]', 'বিএসসি ইন সিএসই [প্রকৃত ডিগ্রি]'],
    researchInterests: ['Bangla NLP [REPLACE]', 'Deep Learning [REPLACE]', 'Edge AI [REPLACE]'],
    researchInterestsBn: ['বাংলা এনএলপি [প্রকৃত বিষয়]', 'ডিপ লার্নিং [প্রকৃত বিষয়]', 'এজ এআই [প্রকৃত বিষয়]'],
    isChairman: true
  },
  {
    id: 'fac-cse-02',
    departmentId: 'cse',
    name: 'Dr. Placeholder Member 2 [REPLACE WITH REAL CONTENT]',
    nameBn: 'ড. অনুষদ সদস্য ২ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Assistant Professor [REPLACE WITH REAL CONTENT]',
    designationBn: 'সহকারী অধ্যাপক [প্রকৃত তথ্য দিন]',
    email: 'teacher2.cse@jstu.ac.bd',
    phone: '+880 29977 00002',
    room: 'Academic Complex, Room 403 [REPLACE]',
    roomBn: 'একাডেমিক কমপ্লেক্স, কক্ষ ৪০৩',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['Ph.D. in Cyber Security [REPLACE]', 'M.Sc. in CSE [REPLACE]'],
    degreesBn: ['পিএইচডি ইন সাইবার সিকিউরিটি [প্রকৃত ডিগ্রি]', 'এমএসসি ইন সিএসই [প্রকৃত ডিগ্রি]'],
    researchInterests: ['Cloud Security [REPLACE]', 'Applied Cryptography [REPLACE]'],
    researchInterestsBn: ['ক্লাউড সিকিউরিটি [প্রকৃত বিষয়]', 'ক্রিপ্টোগ্রাফি [প্রকৃত বিষয়]']
  },
  {
    id: 'fac-cse-03',
    departmentId: 'cse',
    name: 'Placeholder Member 3 [REPLACE WITH REAL CONTENT]',
    nameBn: 'অনুষদ সদস্য ৩ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Assistant Professor [REPLACE WITH REAL CONTENT]',
    designationBn: 'সহকারী অধ্যাপক [প্রকৃত তথ্য দিন]',
    email: 'teacher3.cse@jstu.ac.bd',
    phone: '+880 29977 00003',
    room: 'Academic Complex, Room 405 [REPLACE]',
    roomBn: 'একাডেমিক কমপ্লেক্স, কক্ষ ৪০৫',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['M.Sc. in Software Engineering [REPLACE]', 'B.Sc. in CSE [REPLACE]'],
    degreesBn: ['এমএসসি ইন সফটওয়্যার ইঞ্জিনিয়ারিং [প্রকৃত ডিগ্রি]', 'বিএসসি ইন সিএসই [প্রকৃত ডিগ্রি]'],
    researchInterests: ['Microservices [REPLACE]', 'Software Reliability [REPLACE]'],
    researchInterestsBn: ['মাইক্রোসার্ভিস [প্রকৃত বিষয়]', 'সফটওয়্যার নির্ভরযোগ্যতা [প্রকৃত বিষয়]']
  },
  {
    id: 'fac-cse-04',
    departmentId: 'cse',
    name: 'Placeholder Member 4 [REPLACE WITH REAL CONTENT]',
    nameBn: 'অনুষদ সদস্য ৪ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Lecturer [REPLACE WITH REAL CONTENT]',
    designationBn: 'প্রভাষক [প্রকৃত তথ্য দিন]',
    email: 'teacher4.cse@jstu.ac.bd',
    phone: '+880 29977 00004',
    room: 'Academic Complex, Room 407 [REPLACE]',
    roomBn: 'একাডেমিক কমপ্লেক্স, কক্ষ ৪০৭',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['B.Sc. in CSE [REPLACE]'],
    degreesBn: ['বিএসসি ইন সিএসই [প্রকৃত ডিগ্রি]'],
    researchInterests: ['Computer Vision [REPLACE]', 'Embedded IoT [REPLACE]'],
    researchInterestsBn: ['কম্পিউটার ভিশন [প্রকৃত বিষয়]', 'আইওটি [প্রকৃত বিষয়]']
  },

  // --- EEE Faculty ---
  {
    id: 'fac-eee-01',
    departmentId: 'eee',
    name: 'Dr. Placeholder Member 5 [REPLACE WITH REAL CONTENT]',
    nameBn: 'ড. অনুষদ সদস্য ৫ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Associate Professor & Chairman [REPLACE WITH REAL CONTENT]',
    designationBn: 'সহযোগী অধ্যাপক ও চেয়ারম্যান [প্রকৃত তথ্য দিন]',
    email: 'chairman.eee@jstu.ac.bd',
    phone: '+880 29977 00005',
    room: 'Engineering Pavilion, Room 301 [REPLACE]',
    roomBn: 'ইঞ্জিনিয়ারিং প্যাভিলিয়ন, কক্ষ ৩০১',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['Ph.D. in Power Electronics [REPLACE]', 'B.Sc. in EEE [REPLACE]'],
    degreesBn: ['পিএইচডি ইন পাওয়ার ইলেকট্রনিক্স [প্রকৃত ডিগ্রি]', 'বিএসসি ইন ইইই [প্রকৃত ডিগ্রি]'],
    researchInterests: ['Renewable Microgrids [REPLACE]', 'High-Efficiency Inverters [REPLACE]'],
    researchInterestsBn: ['মাইক্রোগ্রিড [প্রকৃত বিষয়]', 'ইনভার্টার [প্রকৃত বিষয়]'],
    isChairman: true
  },
  {
    id: 'fac-eee-02',
    departmentId: 'eee',
    name: 'Dr. Placeholder Member 6 [REPLACE WITH REAL CONTENT]',
    nameBn: 'ড. অনুষদ সদস্য ৬ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Assistant Professor [REPLACE WITH REAL CONTENT]',
    designationBn: 'সহকারী অধ্যাপক [প্রকৃত তথ্য দিন]',
    email: 'teacher6.eee@jstu.ac.bd',
    phone: '+880 29977 00006',
    room: 'Engineering Pavilion, Room 304 [REPLACE]',
    roomBn: 'ইঞ্জিনিয়ারিং প্যাভিলিয়ন, কক্ষ ৩০৪',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['Ph.D. in Nanotechnology [REPLACE]', 'M.Sc. in EEE [REPLACE]'],
    degreesBn: ['পিএইচডি ইন ন্যানোটেকনোলজি [প্রকৃত ডিগ্রি]', 'এমএসসি ইন ইইই [প্রকৃত ডিগ্রি]'],
    researchInterests: ['Semiconductor Fabrication [REPLACE]', 'VLSI Design [REPLACE]'],
    researchInterestsBn: ['সেমিকন্ডাক্টর ফ্যাব্রিকেশন [প্রকৃত বিষয়]', 'ভিএলএসআই ডিজাইন [প্রকৃত বিষয়]']
  },
  {
    id: 'fac-eee-03',
    departmentId: 'eee',
    name: 'Placeholder Member 7 [REPLACE WITH REAL CONTENT]',
    nameBn: 'অনুষদ সদস্য ৭ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Lecturer [REPLACE WITH REAL CONTENT]',
    designationBn: 'প্রভাষক [প্রকৃত তথ্য দিন]',
    email: 'teacher7.eee@jstu.ac.bd',
    phone: '+880 29977 00007',
    room: 'Engineering Pavilion, Room 306 [REPLACE]',
    roomBn: 'ইঞ্জিনিয়ারিং প্যাভিলিয়ন, কক্ষ ৩০৬',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['B.Sc. in EEE [REPLACE]'],
    degreesBn: ['বিএসসি ইন ইইই [প্রকৃত ডিগ্রি]'],
    researchInterests: ['5G Wireless Communication [REPLACE]', 'Antenna Design [REPLACE]'],
    researchInterestsBn: ['৫জি ওয়্যারলেস [প্রকৃত বিষয়]', 'অ্যান্টেনা ডিজাইন [প্রকৃত বিষয়]']
  },

  // --- Mathematics Faculty ---
  {
    id: 'fac-math-01',
    departmentId: 'mathematics',
    name: 'Dr. Placeholder Member 8 [REPLACE WITH REAL CONTENT]',
    nameBn: 'ড. অনুষদ সদস্য ৮ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Professor & Chairman [REPLACE WITH REAL CONTENT]',
    designationBn: 'অধ্যাপক ও চেয়ারম্যান [প্রকৃত তথ্য দিন]',
    email: 'chairman.math@jstu.ac.bd',
    phone: '+880 29977 00008',
    room: 'Science Complex, Room 201 [REPLACE]',
    roomBn: 'বিজ্ঞান কমপ্লেক্স, কক্ষ ২০১',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['Ph.D. in Applied Mathematics [REPLACE]', 'M.Sc. in Mathematics [REPLACE]'],
    degreesBn: ['পিএইচডি ইন ফলিত গণিত [প্রকৃত ডিগ্রি]', 'এমএসসি ইন গণিত [প্রকৃত ডিগ্রি]'],
    researchInterests: ['Fluid Dynamics [REPLACE]', 'Differential Equations [REPLACE]'],
    researchInterestsBn: ['ফ্লুইড ডায়নামিক্স [প্রকৃত বিষয়]', 'ব্যবকলনীয় সমীকরণ [প্রকৃত বিষয়]'],
    isChairman: true
  },
  {
    id: 'fac-math-02',
    departmentId: 'mathematics',
    name: 'Dr. Placeholder Member 9 [REPLACE WITH REAL CONTENT]',
    nameBn: 'ড. অনুষদ সদস্য ৯ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Assistant Professor [REPLACE WITH REAL CONTENT]',
    designationBn: 'সহকারী অধ্যাপক [প্রকৃত তথ্য দিন]',
    email: 'teacher9.math@jstu.ac.bd',
    phone: '+880 29977 00009',
    room: 'Science Complex, Room 204 [REPLACE]',
    roomBn: 'বিজ্ঞান কমপ্লেক্স, কক্ষ ২০৪',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['Ph.D. in Numerical Analysis [REPLACE]', 'B.Sc. in Mathematics [REPLACE]'],
    degreesBn: ['পিএইচডি ইন নিউমেরিক্যাল অ্যানালাইসিস [প্রকৃত ডিগ্রি]', 'বিএসসি ইন গণিত [প্রকৃত ডিগ্রি]'],
    researchInterests: ['Numerical Simulations [REPLACE]', 'Supercomputing [REPLACE]'],
    researchInterestsBn: ['সিমুলেশন মডেলিং [প্রকৃত বিষয়]', 'সুপারকম্পিউটিং [প্রকৃত বিষয়]']
  },

  // --- Fisheries Faculty ---
  {
    id: 'fac-fish-01',
    departmentId: 'fisheries',
    name: 'Dr. Placeholder Member 10 [REPLACE WITH REAL CONTENT]',
    nameBn: 'ড. অনুষদ সদস্য ১০ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Associate Professor & Chairman [REPLACE WITH REAL CONTENT]',
    designationBn: 'সহযোগী অধ্যাপক ও চেয়ারম্যান [প্রকৃত তথ্য দিন]',
    email: 'chairman.fish@jstu.ac.bd',
    phone: '+880 29977 00010',
    room: 'Life Sciences Block, Room 101 [REPLACE]',
    roomBn: 'লাইফ সায়েন্স ভবন, কক্ষ ১০১',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['Ph.D. in Aquaculture [REPLACE]', 'B.Sc. in Fisheries [REPLACE]'],
    degreesBn: ['পিএইচডি ইন অ্যাকুয়াকালচার [প্রকৃত ডিগ্রি]', 'বিএসসি ইন ফিশারিজ [প্রকৃত ডিগ্রি]'],
    researchInterests: ['Fish Immunology [REPLACE]', 'River Biodiversity [REPLACE]'],
    researchInterestsBn: ['মাছের রোগ প্রতিরোধ [প্রকৃত বিষয়]', 'নদী জীববৈচিত্র্য [প্রকৃত বিষয়]'],
    isChairman: true
  },
  {
    id: 'fac-fish-02',
    departmentId: 'fisheries',
    name: 'Dr. Placeholder Member 11 [REPLACE WITH REAL CONTENT]',
    nameBn: 'ড. অনুষদ সদস্য ১১ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Assistant Professor [REPLACE WITH REAL CONTENT]',
    designationBn: 'সহকারী অধ্যাপক [প্রকৃত তথ্য দিন]',
    email: 'teacher11.fish@jstu.ac.bd',
    phone: '+880 29977 00011',
    room: 'Life Sciences Block, Room 104 [REPLACE]',
    roomBn: 'লাইফ সায়েন্স ভবন, কক্ষ ১০৪',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['Ph.D. in Aquatic Ecology [REPLACE]'],
    degreesBn: ['পিএইচডি ইন অ্যাকোয়াটিক ইকোলজি [প্রকৃত ডিগ্রি]'],
    researchInterests: ['Wetland Conservation [REPLACE]', 'Induced Breeding [REPLACE]'],
    researchInterestsBn: ['জলাভূমি সংরক্ষণ [প্রকৃত বিষয়]', 'প্রণোদিত প্রজনন [প্রকৃত বিষয়]']
  },

  // --- Geology Faculty ---
  {
    id: 'fac-geol-01',
    departmentId: 'geology',
    name: 'Dr. Placeholder Member 12 [REPLACE WITH REAL CONTENT]',
    nameBn: 'ড. অনুষদ সদস্য ১২ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Assistant Professor & Chairman [REPLACE WITH REAL CONTENT]',
    designationBn: 'সহকারী অধ্যাপক ও চেয়ারম্যান [প্রকৃত তথ্য দিন]',
    email: 'chairman.geol@jstu.ac.bd',
    phone: '+880 29977 00012',
    room: 'Earth Science Pavilion, Room 201 [REPLACE]',
    roomBn: 'ভূ-বিজ্ঞান প্যাভিলিয়ন, কক্ষ ২০১',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['Ph.D. in Hydrogeology [REPLACE]', 'M.Sc. in Geology [REPLACE]'],
    degreesBn: ['পিএইচডি ইন হাইড্রোজিওলজি [প্রকৃত ডিগ্রি]', 'এমএসসি ইন ভূতত্ত্ব [প্রকৃত ডিগ্রি]'],
    researchInterests: ['Groundwater Modeling [REPLACE]', 'Sedimentary Basins [REPLACE]'],
    researchInterestsBn: ['পানি স্তর মডেলিং [প্রকৃত বিষয়]', 'পলল অববাহিকা [প্রকৃত বিষয়]'],
    isChairman: true
  },
  {
    id: 'fac-geol-02',
    departmentId: 'geology',
    name: 'Placeholder Member 13 [REPLACE WITH REAL CONTENT]',
    nameBn: 'অনুষদ সদস্য ১৩ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Assistant Professor [REPLACE WITH REAL CONTENT]',
    designationBn: 'সহকারী অধ্যাপক [প্রকৃত তথ্য দিন]',
    email: 'teacher13.geol@jstu.ac.bd',
    phone: '+880 29977 00013',
    room: 'Earth Science Pavilion, Room 203 [REPLACE]',
    roomBn: 'ভূ-বিজ্ঞান প্যাভিলিয়ন, কক্ষ ২০৩',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['M.Sc. in Remote Sensing GIS [REPLACE]', 'B.Sc. in Geology [REPLACE]'],
    degreesBn: ['এমএসসি ইন রিমোট সেন্সিং জিআইএস [প্রকৃত ডিগ্রি]', 'বিএসসি ইন ভূতত্ত্ব [প্রকৃত ডিগ্রি]'],
    researchInterests: ['Geological Hazards [REPLACE]', 'Mineral Exploration [REPLACE]'],
    researchInterestsBn: ['ভূতাত্ত্বিক দুর্যোগ [প্রকৃত বিষয়]', 'খনিজ অনুসন্ধান [প্রকৃত বিষয়]']
  },

  // --- Management Faculty ---
  {
    id: 'fac-mgmt-01',
    departmentId: 'management',
    name: 'Dr. Placeholder Member 14 [REPLACE WITH REAL CONTENT]',
    nameBn: 'ড. অনুষদ সদস্য ১৪ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Associate Professor & Chairman [REPLACE WITH REAL CONTENT]',
    designationBn: 'সহযোগী অধ্যাপক ও চেয়ারম্যান [প্রকৃত তথ্য দিন]',
    email: 'chairman.mgmt@jstu.ac.bd',
    phone: '+880 29977 00014',
    room: 'Business Suite, Room 301 [REPLACE]',
    roomBn: 'ব্যবসায় ভবন, কক্ষ ৩০১',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['Ph.D. in Strategic Management [REPLACE]', 'MBA [REPLACE]'],
    degreesBn: ['পিএইচডি ইন স্ট্র্যাটেজিক ম্যানেজমেন্ট [প্রকৃত ডিগ্রি]', 'এমবিএ [প্রকৃত ডিগ্রি]'],
    researchInterests: ['Supply Chain Digitization [REPLACE]', 'Corporate Governance [REPLACE]'],
    researchInterestsBn: ['সাপ্লাই চেইন [প্রকৃত বিষয়]', 'করপোরেট গভর্ন্যান্স [প্রকৃত বিষয়]'],
    isChairman: true
  },
  {
    id: 'fac-mgmt-02',
    departmentId: 'management',
    name: 'Placeholder Member 15 [REPLACE WITH REAL CONTENT]',
    nameBn: 'অনুষদ সদস্য ১৫ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Assistant Professor [REPLACE WITH REAL CONTENT]',
    designationBn: 'সহকারী অধ্যাপক [প্রকৃত তথ্য দিন]',
    email: 'teacher15.mgmt@jstu.ac.bd',
    phone: '+880 29977 00015',
    room: 'Business Suite, Room 304 [REPLACE]',
    roomBn: 'ব্যবসায় ভবন, কক্ষ ৩০৪',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['MBA in HRM [REPLACE]', 'BBA [REPLACE]'],
    degreesBn: ['এমবিএ ইন এইচআরএম [প্রকৃত ডিগ্রি]', 'বিবিএ [প্রকৃত ডিগ্রি]'],
    researchInterests: ['Organizational Analytics [REPLACE]', 'Talent Economics [REPLACE]'],
    researchInterestsBn: ['সাংগঠনিক অ্যানালিটিক্স [প্রকৃত বিষয়]', 'ট্যালেন্ট ইকোনমিক্স [প্রকৃত বিষয়]']
  },

  // --- Social Work Faculty ---
  {
    id: 'fac-sw-01',
    departmentId: 'social-work',
    name: 'Dr. Placeholder Member 16 [REPLACE WITH REAL CONTENT]',
    nameBn: 'ড. অনুষদ সদস্য ১৬ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Associate Professor & Chairman [REPLACE WITH REAL CONTENT]',
    designationBn: 'সহযোগী অধ্যাপক ও চেয়ারম্যান [প্রকৃত তথ্য দিন]',
    email: 'chairman.sw@jstu.ac.bd',
    phone: '+880 29977 00016',
    room: 'Social Sciences Building, Room 201 [REPLACE]',
    roomBn: 'সামাজিক বিজ্ঞান ভবন, কক্ষ ২০১',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['Ph.D. in Social Policy [REPLACE]', 'MSS in Social Work [REPLACE]'],
    degreesBn: ['পিএইচডি ইন সোশ্যাল পলিসি [প্রকৃত ডিগ্রি]', 'এমএসএস ইন সমাজকর্ম [প্রকৃত ডিগ্রি]'],
    researchInterests: ['Community Resilience [REPLACE]', 'Child Protection [REPLACE]'],
    researchInterestsBn: ['কমিউনিটি উন্নয়ন [প্রকৃত বিষয়]', 'শিশু সুরক্ষা [প্রকৃত বিষয়]'],
    isChairman: true
  },
  {
    id: 'fac-sw-02',
    departmentId: 'social-work',
    name: 'Placeholder Member 17 [REPLACE WITH REAL CONTENT]',
    nameBn: 'অনুষদ সদস্য ১৭ [প্রকৃত নাম প্রতিস্থাপন করুন]',
    designation: 'Lecturer [REPLACE WITH REAL CONTENT]',
    designationBn: 'প্রভাষক [প্রকৃত তথ্য দিন]',
    email: 'teacher17.sw@jstu.ac.bd',
    phone: '+880 29977 00017',
    room: 'Social Sciences Building, Room 205 [REPLACE]',
    roomBn: 'সামাজিক বিজ্ঞান ভবন, কক্ষ ২০৫',
    avatarUrl: NEUTRAL_AVATAR,
    degrees: ['MSS in Clinical Social Work [REPLACE]', 'BSS [REPLACE]'],
    degreesBn: ['এমএসএস ইন ক্লিনিক্যাল সোশ্যাল ওয়ার্ক [প্রকৃত ডিগ্রি]', 'বিএসএস [প্রকৃত ডিগ্রি]'],
    researchInterests: ['Youth Mental Well-being [REPLACE]', 'Disability Rehabilitation [REPLACE]'],
    researchInterestsBn: ['তরুণদের মানসিক স্বাস্থ্য [প্রকৃত বিষয়]', 'প্রতিবন্ধী পুনর্বাসন [প্রকৃত বিষয়]']
  }
];

// ----------------------------------------------------------------------------
// 4. Academic Programs (BSc & MSc across all 7 departments)
// All records marked with [REPLACE WITH REAL CONTENT]
// ----------------------------------------------------------------------------
export const departmentPrograms: DepartmentProgram[] = [
  // CSE
  {
    id: 'prog-cse-bsc',
    departmentId: 'cse',
    title: 'Bachelor of Science (Engineering) in Computer Science & Engineering [REPLACE WITH REAL CONTENT]',
    titleBn: 'ব্যাচেলর অব সায়েন্স (ইঞ্জিনিয়ারিং) ইন কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং [প্রকৃত তথ্য দিন]',
    degreeType: 'BSc',
    degreeTypeBn: 'স্নাতক (ইঞ্জিনিয়ারিং)',
    duration: '4 Academic Years (8 Semesters)',
    durationBn: '৪ শিক্ষাবর্ষ (৮ সেমিস্টার)',
    totalCredits: 160,
    totalSemesters: 8,
    intakeSeason: 'Fall Semester (Annual)',
    intakeSeasonBn: 'ফল সেমিস্টার (বার্ষিক ভর্তি)',
    seatCount: 60,
    overview: '/* [REPLACE WITH REAL CONTENT] */ Four-year outcome-based engineering curriculum covering algorithms, systems architecture, network engineering, and machine intelligence.',
    overviewBn: '/* [REPLACE WITH REAL CONTENT] */ চার বছর মেয়াদী প্রকৌশল প্রোগ্রাম যা অ্যালগরিদম, সফটওয়্যার আর্কিটেকচার ও মেশিন ইন্টেলিজেন্সে বিশেষায়িত।',
    admissionEligibility: [
      'HSC in Science with minimum GPA 4.00 [REPLACE WITH REAL CONTENT]',
      'Minimum grade benchmarks in Physics, Chemistry, and Mathematics [REPLACE]',
      'Selection via National GST Admission Test merit rank [REPLACE]'
    ],
    admissionEligibilityBn: [
      'বিজ্ঞান বিভাগ থেকে উচ্চ মাধ্যমিক ও ন্যূনতম জিপিএ ৪.০০ [প্রকৃত শর্ত দিন]',
      'পদার্থ, রসায়ন ও গণিতে ন্যূনতম গ্রেড থাকতে হবে',
      'জিএসটি গুচ্ছ ভর্তি পরীক্ষার মেধা অনুযায়ী'
    ],
    careerProspects: [
      'Software Development Engineer [REPLACE]',
      'AI & Machine Learning Specialist [REPLACE]',
      'Cybersecurity & Infrastructure Engineer [REPLACE]'
    ],
    careerProspectsBn: [
      'সফটওয়্যার ইঞ্জিনিয়ার [প্রকৃত পেশা]',
      'এআই ও মেশিন লার্নিং বিশেষজ্ঞ',
      'সাইবার সিকিউরিটি স্পেশালিস্ট'
    ],
    curriculumHighlights: [
      'Outcome-Based Education (OBE) aligned with Washington Accord [REPLACE]',
      'Mandatory 6-credit Industrial Internship in Final Year [REPLACE]',
      'Two-semester Senior Capstone Design Project [REPLACE]'
    ],
    curriculumHighlightsBn: [
      'ওয়াশিংটন অ্যাকর্ড মানদণ্ড অনুযায়ী ওবিই কারিকুলাম [প্রকৃত তথ্য দিন]',
      '৮ম সেমিস্টারে ৬ ক্রেডিটের ইন্ডাস্ট্রিয়াল ইন্টার্নশিপ',
      '৭ম ও ৮ম সেমিস্টার জুড়ে পূর্ণাঙ্গ ক্যাপস্টোন প্রজেক্ট'
    ]
  },
  {
    id: 'prog-cse-msc',
    departmentId: 'cse',
    title: 'Master of Science (Engineering) in Computer Science & Engineering [REPLACE WITH REAL CONTENT]',
    titleBn: 'মাস্টার অব সায়েন্স (ইঞ্জিনিয়ারিং) ইন কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং [প্রকৃত তথ্য দিন]',
    degreeType: 'MSc',
    degreeTypeBn: 'স্নাতকোত্তর (ইঞ্জিনিয়ারিং)',
    duration: '1.5 Academic Years (3 Semesters)',
    durationBn: '১.৫ শিক্ষাবর্ষ (৩ সেমিস্টার)',
    totalCredits: 36,
    totalSemesters: 3,
    intakeSeason: 'Spring & Fall Semesters',
    intakeSeasonBn: 'স্প্রিং ও ফল সেমিস্টার',
    seatCount: 25,
    overview: '/* [REPLACE WITH REAL CONTENT] */ Postgraduate research program in advanced artificial intelligence, distributed computing, and cryptographic protocols.',
    overviewBn: '/* [REPLACE WITH REAL CONTENT] */ কৃত্রিম বুদ্ধিমত্তা ও ক্রিপ্টোগ্রাফিতে দেড় বছর মেয়াদী স্নাতকোত্তর গবেষণা ও ডিগ্রি।',
    admissionEligibility: [
      '4-Year B.Sc. (Engg.) in CSE or closely related field [REPLACE WITH REAL CONTENT]',
      'Minimum CGPA 3.00 out of 4.00 [REPLACE]'
    ],
    admissionEligibilityBn: [
      'স্বীকৃত বিশ্ববিদ্যালয় থেকে সিএসইতে ৪ বছর মেয়াদী স্নাতক [প্রকৃত শর্ত দিন]',
      'ন্যূনতম সিজিপিএ ৩.০০ (৪.০০ স্কেলে)'
    ],
    careerProspects: [
      'Lead AI Research Scientist [REPLACE]',
      'University Faculty & Academic Researcher [REPLACE]'
    ],
    careerProspectsBn: [
      'এআই গবেষক ও ডেটা বিজ্ঞানী [প্রকৃত পেশা]',
      'বিশ্ববিদ্যালয় শিক্ষকতা ও গবেষক'
    ],
    curriculumHighlights: [
      '18 Credits coursework + 18 Credits peer-reviewed thesis [REPLACE]'
    ],
    curriculumHighlightsBn: [
      '১৮ ক্রেডিটের কোর্সওয়ার্ক এবং ১৮ ক্রেডিটের গবেষণা থিসিস'
    ]
  },

  // EEE
  {
    id: 'prog-eee-bsc',
    departmentId: 'eee',
    title: 'Bachelor of Science (Engineering) in Electrical & Electronic Engineering [REPLACE WITH REAL CONTENT]',
    titleBn: 'ব্যাচেলর অব সায়েন্স (ইঞ্জিনিয়ারিং) ইন ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং [প্রকৃত তথ্য দিন]',
    degreeType: 'BSc',
    degreeTypeBn: 'স্নাতক (ইঞ্জিনিয়ারিং)',
    duration: '4 Academic Years (8 Semesters)',
    durationBn: '৪ শিক্ষাবর্ষ (৮ সেমিস্টার)',
    totalCredits: 160,
    totalSemesters: 8,
    intakeSeason: 'Fall Semester',
    intakeSeasonBn: 'ফল সেমিস্টার',
    seatCount: 60,
    overview: '/* [REPLACE WITH REAL CONTENT] */ Comprehensive degree program covering power systems, renewable microgrids, semiconductor electronics, and wireless communications.',
    overviewBn: '/* [REPLACE WITH REAL CONTENT] */ বিদ্যুৎ গ্রিড ব্যবস্থা, নবায়নযোগ্য শক্তি, ভিএলএসআই ও টেলিযোগাযোগে চার বছর মেয়াদী স্নাতক।',
    admissionEligibility: [
      'Passed HSC in Science stream with Physics and Math [REPLACE WITH REAL CONTENT]'
    ],
    admissionEligibilityBn: [
      'উচ্চ মাধ্যমিকে বিজ্ঞান বিভাগ হতে পদার্থ ও গণিতসহ উত্তীর্ণ [প্রকৃত শর্ত দিন]'
    ],
    careerProspects: [
      'Power Grid Operations Engineer [REPLACE]',
      'VLSI Semiconductor Engineer [REPLACE]'
    ],
    careerProspectsBn: [
      'পাওয়ার গ্রিড ইঞ্জিনিয়ার [প্রকৃত পেশা]',
      'ভিএলএসআই ডিজাইনার'
    ],
    curriculumHighlights: [
      'Industry-grade power laboratory sessionals and hardware thesis [REPLACE]'
    ],
    curriculumHighlightsBn: [
      'হাতে-কলমে ল্যাব সেশনাল ও হার্ডওয়্যার ক্যাপস্টোন থিসিস'
    ]
  },

  // Mathematics
  {
    id: 'prog-math-bsc',
    departmentId: 'mathematics',
    title: 'Bachelor of Science (Honours) in Mathematics [REPLACE WITH REAL CONTENT]',
    titleBn: 'ব্যাচেলর অব সায়েন্স (অনার্স) ইন গণিত [প্রকৃত তথ্য দিন]',
    degreeType: 'BSc',
    degreeTypeBn: 'স্নাতক (সম্মান)',
    duration: '4 Academic Years (8 Semesters)',
    durationBn: '৪ শিক্ষাবর্ষ (৮ সেমিস্টার)',
    totalCredits: 144,
    totalSemesters: 8,
    intakeSeason: 'Fall Semester',
    intakeSeasonBn: 'ফল সেমিস্টার',
    seatCount: 50,
    overview: '/* [REPLACE WITH REAL CONTENT] */ Rigorous foundational program integrating pure mathematical theory with computational software and numerical simulations.',
    overviewBn: '/* [REPLACE WITH REAL CONTENT] */ মৌলিক গণিত ও কম্পিউটেশনাল ম্যাথমেটিক্সে চার বছর মেয়াদী বিজ্ঞান স্নাতক ডিগ্রি।',
    admissionEligibility: [
      'Passed HSC in Science with Mathematics [REPLACE WITH REAL CONTENT]'
    ],
    admissionEligibilityBn: [
      'উচ্চ মাধ্যমিকে বিজ্ঞান বিভাগ হতে গণিতসহ উত্তীর্ণ [প্রকৃত শর্ত দিন]'
    ],
    careerProspects: [
      'Quantitative Data Analyst [REPLACE]',
      'Cryptographic Algorithm Researcher [REPLACE]'
    ],
    careerProspectsBn: [
      'কোয়ান্টিটেটিভ ডেটা অ্যানালিস্ট [প্রকৃত পেশা]',
      'ক্রিপ্টোগ্রাফিক অ্যালগরিদম গবেষক'
    ],
    curriculumHighlights: [
      'Integrated MATLAB and Python scientific programming coursework [REPLACE]'
    ],
    curriculumHighlightsBn: [
      'ম্যাটল্যাব ও পাইথনের মাধ্যমে কম্পিউটেশনাল প্রোগ্রামিং কোর্স'
    ]
  },

  // Fisheries
  {
    id: 'prog-fish-bsc',
    departmentId: 'fisheries',
    title: 'Bachelor of Science (Honours) in Fisheries [REPLACE WITH REAL CONTENT]',
    titleBn: 'ব্যাচেলর অব সায়েন্স (অনার্স) ইন ফিশারিজ [প্রকৃত তথ্য দিন]',
    degreeType: 'BSc',
    degreeTypeBn: 'স্নাতক (সম্মান)',
    duration: '4 Academic Years (8 Semesters)',
    durationBn: '৪ শিক্ষাবর্ষ (৮ সেমিস্টার)',
    totalCredits: 152,
    totalSemesters: 8,
    intakeSeason: 'Fall Semester',
    intakeSeasonBn: 'ফল সেমিস্টার',
    seatCount: 50,
    overview: '/* [REPLACE WITH REAL CONTENT] */ Multidisciplinary degree in aquaculture engineering, fish pathology, molecular genetics, and aquatic resource conservation.',
    overviewBn: '/* [REPLACE WITH REAL CONTENT] */ মৎস্য চাষ প্রযুক্তি, মাছের রোগতত্ত্ব ও জলজ পরিবেশ সুরক্ষায় চার বছর মেয়াদী স্নাতক।',
    admissionEligibility: [
      'HSC in Science with Biology, Chemistry, and Physics [REPLACE WITH REAL CONTENT]'
    ],
    admissionEligibilityBn: [
      'উচ্চ মাধ্যমিকে জীববিজ্ঞান, রসায়ন ও পদার্থবিজ্ঞানসহ উত্তীর্ণ [প্রকৃত শর্ত দিন]'
    ],
    careerProspects: [
      'Fisheries Officer (BCS Cadre) [REPLACE]',
      'Aquaculture Farm & Hatchery Director [REPLACE]'
    ],
    careerProspectsBn: [
      'বিসিএস মৎস্য ক্যাডার কর্মকর্তা [প্রকৃত পেশা]',
      'হ্যাচারি ও ফার্ম পরিচালক'
    ],
    curriculumHighlights: [
      'Extensive riverine field training along the Brahmaputra basin [REPLACE]'
    ],
    curriculumHighlightsBn: [
      'নদী অববাহিকা ও হ্যাচারিতে মাঠপর্যায়ের প্রায়োগিক প্রশিক্ষণ'
    ]
  },

  // Geology
  {
    id: 'prog-geol-bsc',
    departmentId: 'geology',
    title: 'Bachelor of Science (Honours) in Geology [REPLACE WITH REAL CONTENT]',
    titleBn: 'ব্যাচেলর অব সায়েন্স (অনার্স) ইন ভূতত্ত্ব [প্রকৃত তথ্য দিন]',
    degreeType: 'BSc',
    degreeTypeBn: 'স্নাতক (সম্মান)',
    duration: '4 Academic Years (8 Semesters)',
    durationBn: '৪ শিক্ষাবর্ষ (৮ সেমিস্টার)',
    totalCredits: 148,
    totalSemesters: 8,
    intakeSeason: 'Fall Semester',
    intakeSeasonBn: 'ফল সেমিস্টার',
    seatCount: 45,
    overview: '/* [REPLACE WITH REAL CONTENT] */ Four-year degree covering mineralogy, structural geology, hydrogeology, geophysics, and satellite remote sensing.',
    overviewBn: '/* [REPLACE WITH REAL CONTENT] */ খনিজ সম্পদ, ভূগর্ভস্থ পানি, ভূ-গঠন ও স্যাটেলাইট রিমোট সেন্সিং-এ চার বছর মেয়াদী বিজ্ঞান স্নাতক।',
    admissionEligibility: [
      'HSC in Science with Physics, Chemistry, and Math [REPLACE WITH REAL CONTENT]'
    ],
    admissionEligibilityBn: [
      'উচ্চ মাধ্যমিকে পদার্থ, রসায়ন ও গণিতসহ উত্তীর্ণ [প্রকৃত শর্ত দিন]'
    ],
    careerProspects: [
      'Petroleum & Gas Exploration Geologist [REPLACE]',
      'Hydrogeologist & Groundwater Specialist [REPLACE]'
    ],
    careerProspectsBn: [
      'তেল-গ্যাস অনুসন্ধান ভূ-বিজ্ঞানী [প্রকৃত পেশা]',
      'ভূগর্ভস্থ পানি ব্যবস্থাপনা বিশেষজ্ঞ'
    ],
    curriculumHighlights: [
      'Mandatory annual structural geology field expeditions [REPLACE]'
    ],
    curriculumHighlightsBn: [
      'প্রতি শিক্ষাবর্ষে দেশের বিভিন্ন ভূতাত্ত্বিক অঞ্চলে ফিল্ডওয়ার্ক'
    ]
  },

  // Management
  {
    id: 'prog-mgmt-bba',
    departmentId: 'management',
    title: 'Bachelor of Business Administration (BBA) [REPLACE WITH REAL CONTENT]',
    titleBn: 'ব্যাচেলর অব বিজনেস অ্যাডমিনিস্ট্রেশন (বিবিএ) [প্রকৃত তথ্য দিন]',
    degreeType: 'BBA',
    degreeTypeBn: 'স্নাতক (ব্যবসায় প্রশাসন)',
    duration: '4 Academic Years (8 Semesters)',
    durationBn: '৪ শিক্ষাবর্ষ (৮ সেমিস্টার)',
    totalCredits: 126,
    totalSemesters: 8,
    intakeSeason: 'Fall Semester',
    intakeSeasonBn: 'ফল সেমিস্টার',
    seatCount: 60,
    overview: '/* [REPLACE WITH REAL CONTENT] */ Professional business administration program focusing on enterprise management, strategic supply chains, and fintech analytics.',
    overviewBn: '/* [REPLACE WITH REAL CONTENT] */ প্রাতিষ্ঠানিক ব্যবস্থাপনা, সাপ্লাই চেইন ও ব্যবসায়িক উদ্ভাবনে চার বছর মেয়াদী বিবিএ ডিগ্রি।',
    admissionEligibility: [
      'Passed HSC from Business Studies, Science, or Humanities [REPLACE WITH REAL CONTENT]'
    ],
    admissionEligibilityBn: [
      'ব্যবসায় শিক্ষা, বিজ্ঞান বা মানবিক বিভাগ থেকে উচ্চ মাধ্যমিক উত্তীর্ণ [প্রকৃত শর্ত দিন]'
    ],
    careerProspects: [
      'Operations & Supply Chain Manager [REPLACE]',
      'Corporate Financial Analyst [REPLACE]'
    ],
    careerProspectsBn: [
      'অপারেশনস ও সাপ্লাই চেইন ম্যানেজার [প্রকৃত পেশা]',
      'করপোরেট আর্থিক বিশ্লেষক'
    ],
    curriculumHighlights: [
      'Case study methodology and final semester corporate internship [REPLACE]'
    ],
    curriculumHighlightsBn: [
      'কেস স্টাডি মেথডোলজি ও শেষ সেমিস্টারে করপোরেট ইন্টার্নশিপ'
    ]
  },

  // Social Work
  {
    id: 'prog-sw-bss',
    departmentId: 'social-work',
    title: 'Bachelor of Social Science (BSS) in Social Work [REPLACE WITH REAL CONTENT]',
    titleBn: 'ব্যাচেলর অব সোশ্যাল সায়েন্স (বিএসএস) ইন সমাজকর্ম [প্রকৃত তথ্য দিন]',
    degreeType: 'BSS',
    degreeTypeBn: 'স্নাতক (সামাজিক বিজ্ঞান)',
    duration: '4 Academic Years (8 Semesters)',
    durationBn: '৪ শিক্ষাবর্ষ (৮ সেমিস্টার)',
    totalCredits: 124,
    totalSemesters: 8,
    intakeSeason: 'Fall Semester',
    intakeSeasonBn: 'ফল সেমিস্টার',
    seatCount: 50,
    overview: '/* [REPLACE WITH REAL CONTENT] */ Applied social development program preparing empathetic practitioners in community welfare, psychosocial services, and policy analysis.',
    overviewBn: '/* [REPLACE WITH REAL CONTENT] */ কমিউনিটি উন্নয়ন, শিশু সুরক্ষা, মানসিক স্বাস্থ্য ও দুর্যোগ ব্যবস্থাপনায় চার বছর মেয়াদী স্নাতক।',
    admissionEligibility: [
      'Passed HSC from any recognized academic track [REPLACE WITH REAL CONTENT]'
    ],
    admissionEligibilityBn: [
      'যেকোনো বিভাগ হতে উচ্চ মাধ্যমিক উত্তীর্ণ [প্রকৃত শর্ত দিন]'
    ],
    careerProspects: [
      'Social Welfare Officer (BCS Cadre) [REPLACE]',
      'UN & INGO Community Program Specialist [REPLACE]'
    ],
    careerProspectsBn: [
      'বিসিএস সমাজসেবা কর্মকর্তা [প্রকৃত পেশা]',
      'আন্তর্জাতিক উন্নয়ন সংস্থায় প্রোগ্রাম স্পেশালিস্ট'
    ],
    curriculumHighlights: [
      '60-day supervised field practicum in registered welfare agencies [REPLACE]'
    ],
    curriculumHighlightsBn: [
      '৬০ দিনের বাধ্যতামূলক নিবন্ধিত সংস্থায় ফিল্ডওয়ার্ক প্র্যাকটিকাম'
    ]
  }
];

// ----------------------------------------------------------------------------
// 5. Courses by Semester (Representative semesters across all 7 departments)
// All records marked with [REPLACE WITH REAL CONTENT]
// ----------------------------------------------------------------------------
export const departmentCourses: DepartmentCourse[] = [
  // --- CSE Courses ---
  {
    id: 'cse-c-101',
    departmentId: 'cse',
    programId: 'prog-cse-bsc',
    courseCode: 'CSE 1101',
    courseTitle: 'Structured Programming Language [REPLACE WITH REAL CONTENT]',
    courseTitleBn: 'স্ট্রাকচার্ড প্রোগ্রামিং ল্যাঙ্গুয়েজ [প্রকৃত কোর্স নাম দিন]',
    credits: 3.0,
    type: 'Theory',
    typeBn: 'তাত্ত্বিক',
    year: 1,
    semester: 1,
    semesterLabel: '1st Year, 1st Semester',
    semesterLabelBn: '১ম বর্ষ, ১ম সেমিস্টার',
    description: '/* [REPLACE WITH REAL CONTENT] */ Core principles of imperative programming, modular design, memory management, and algorithm implementation.',
    descriptionBn: 'সি ভাষার মাধ্যমে ভ্যারিয়েবল, লুপ, ফাংশন ও মেমোরি ব্যবস্থাপনার ভিত্তি।'
  },
  {
    id: 'cse-c-102',
    departmentId: 'cse',
    programId: 'prog-cse-bsc',
    courseCode: 'CSE 1102',
    courseTitle: 'Structured Programming Sessional [REPLACE WITH REAL CONTENT]',
    courseTitleBn: 'স্ট্রাকচার্ড প্রোগ্রামিং ল্যাব [প্রকৃত কোর্স নাম দিন]',
    credits: 1.5,
    type: 'Lab',
    typeBn: 'ব্যবহারিক',
    year: 1,
    semester: 1,
    semesterLabel: '1st Year, 1st Semester',
    semesterLabelBn: '১ম বর্ষ, ১ম সেমিস্টার',
    description: '/* [REPLACE WITH REAL CONTENT] */ Practical terminal-based problem solving and algorithm debugging.',
    descriptionBn: 'লিনাক্স পরিবেশে হাতে-কলমে কোডিং ও প্রজেক্ট তৈরি।'
  },
  {
    id: 'cse-c-103',
    departmentId: 'cse',
    programId: 'prog-cse-bsc',
    courseCode: 'MATH 1103',
    courseTitle: 'Differential & Integral Calculus [REPLACE WITH REAL CONTENT]',
    courseTitleBn: 'ক্যালকুলাস ও জ্যামিতি [প্রকৃত কোর্স নাম দিন]',
    credits: 3.0,
    type: 'Theory',
    typeBn: 'তাত্ত্বিক',
    year: 1,
    semester: 1,
    semesterLabel: '1st Year, 1st Semester',
    semesterLabelBn: '১ম বর্ষ, ১ম সেমিস্টার',
    description: '/* [REPLACE WITH REAL CONTENT] */ Fundamental calculus methods applicable to engineering problem sets.',
    descriptionBn: 'সীমা, ব্যবকলন, ইন্টিগ্রাল ও প্রকৌশলে ক্যালকুলাসের প্রয়োগ।'
  },
  {
    id: 'cse-c-201',
    departmentId: 'cse',
    programId: 'prog-cse-bsc',
    courseCode: 'CSE 1201',
    courseTitle: 'Object Oriented Programming [REPLACE WITH REAL CONTENT]',
    courseTitleBn: 'অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিং [প্রকৃত কোর্স নাম দিন]',
    credits: 3.0,
    type: 'Theory',
    typeBn: 'তাত্ত্বিক',
    year: 1,
    semester: 2,
    semesterLabel: '1st Year, 2nd Semester',
    semesterLabelBn: '১ম বর্ষ, ২য় সেমিস্টার',
    description: '/* [REPLACE WITH REAL CONTENT] */ Classes, inheritance, polymorphism, design patterns, and multithreading in Java/C++.',
    descriptionBn: 'ক্লাস, অবজেক্ট, ইনহেরিটেন্স ও পলিমরফিজম।'
  },
  {
    id: 'cse-c-301',
    departmentId: 'cse',
    programId: 'prog-cse-bsc',
    courseCode: 'CSE 2101',
    courseTitle: 'Data Structures & Algorithms [REPLACE WITH REAL CONTENT]',
    courseTitleBn: 'উপাত্ত কাঠামো ও অ্যালগরিদম [প্রকৃত কোর্স নাম দিন]',
    credits: 3.0,
    type: 'Theory',
    typeBn: 'তাত্ত্বিক',
    year: 2,
    semester: 1,
    semesterLabel: '2nd Year, 1st Semester',
    semesterLabelBn: '২য় বর্ষ, ১ম সেমিস্টার',
    description: '/* [REPLACE WITH REAL CONTENT] */ Trees, graphs, dynamic programming, sorting, and computational complexity analysis.',
    descriptionBn: 'ট্রি, গ্রাফ, ডায়নামিক প্রোগ্রামিং ও অ্যালগরিদম বিশ্লেষণ।'
  },

  // --- EEE Courses ---
  {
    id: 'eee-c-101',
    departmentId: 'eee',
    programId: 'prog-eee-bsc',
    courseCode: 'EEE 1101',
    courseTitle: 'Electrical Circuits I [REPLACE WITH REAL CONTENT]',
    courseTitleBn: 'বৈদ্যুতিক বর্তনী ১ [প্রকৃত কোর্স নাম দিন]',
    credits: 3.0,
    type: 'Theory',
    typeBn: 'তাত্ত্বিক',
    year: 1,
    semester: 1,
    semesterLabel: '1st Year, 1st Semester',
    semesterLabelBn: '১ম বর্ষ, ১ম সেমিস্টার',
    description: '/* [REPLACE WITH REAL CONTENT] */ Ohm law, Kirchhoff laws, node/mesh analysis, network theorems, and steady-state DC response.',
    descriptionBn: 'সার্কিট অ্যানালাইসিস, মেশ ও নোড বিশ্লেষণ।'
  },
  {
    id: 'eee-c-102',
    departmentId: 'eee',
    programId: 'prog-eee-bsc',
    courseCode: 'EEE 1102',
    courseTitle: 'Electrical Circuits Sessional [REPLACE WITH REAL CONTENT]',
    courseTitleBn: 'বৈদ্যুতিক বর্তনী ল্যাব [প্রকৃত কোর্স নাম দিন]',
    credits: 1.5,
    type: 'Lab',
    typeBn: 'ব্যবহারিক',
    year: 1,
    semester: 1,
    semesterLabel: '1st Year, 1st Semester',
    semesterLabelBn: '১ম বর্ষ, ১ম সেমিস্টার',
    description: '/* [REPLACE WITH REAL CONTENT] */ Breadboard prototyping, oscilloscope measurements, and circuit verification.',
    descriptionBn: 'হাতে-কলমে সার্কিট সংযোগ ও পরিমাপ।'
  },

  // --- Mathematics Courses ---
  {
    id: 'math-c-101',
    departmentId: 'mathematics',
    programId: 'prog-math-bsc',
    courseCode: 'MATH 1101',
    courseTitle: 'Foundations of Set Theory & Real Analysis [REPLACE WITH REAL CONTENT]',
    courseTitleBn: 'সেট তত্ত্ব ও রিয়েল অ্যানালাইসিস [প্রকৃত কোর্স নাম দিন]',
    credits: 3.0,
    type: 'Theory',
    typeBn: 'তাত্ত্বিক',
    year: 1,
    semester: 1,
    semesterLabel: '1st Year, 1st Semester',
    semesterLabelBn: '১ম বর্ষ, ১ম সেমিস্টার',
    description: '/* [REPLACE WITH REAL CONTENT] */ Axiomatic set theory, metric spaces, sequences, series, and rigorous mathematical proofs.',
    descriptionBn: 'সেট তত্ত্ব ও গাণিতিক প্রমাণের ভিত্তি।'
  },
  {
    id: 'math-c-102',
    departmentId: 'mathematics',
    programId: 'prog-math-bsc',
    courseCode: 'MATH 1102',
    courseTitle: 'Computational Mathematics Lab I [REPLACE WITH REAL CONTENT]',
    courseTitleBn: 'কম্পিউটেশনাল গণিত ল্যাব ১ [প্রকৃত কোর্স নাম দিন]',
    credits: 1.5,
    type: 'Lab',
    typeBn: 'ব্যবহারিক',
    year: 1,
    semester: 1,
    semesterLabel: '1st Year, 1st Semester',
    semesterLabelBn: '১ম বর্ষ, ১ম সেমিস্টার',
    description: '/* [REPLACE WITH REAL CONTENT] */ Introduction to symbolic and numerical computing with MATLAB and Python.',
    descriptionBn: 'ম্যাটল্যাবের মাধ্যমে সংখ্যাত্মক সমাধান।'
  },

  // --- Fisheries Courses ---
  {
    id: 'fish-c-101',
    departmentId: 'fisheries',
    programId: 'prog-fish-bsc',
    courseCode: 'FISH 1101',
    courseTitle: 'Ichthyology & Fish Anatomy [REPLACE WITH REAL CONTENT]',
    courseTitleBn: 'ইকথায়োলজি ও মৎস্য শারীরস্থান [প্রকৃত কোর্স নাম দিন]',
    credits: 3.0,
    type: 'Theory',
    typeBn: 'তাত্ত্বিক',
    year: 1,
    semester: 1,
    semesterLabel: '1st Year, 1st Semester',
    semesterLabelBn: '১ম বর্ষ, ১ম সেমিস্টার',
    description: '/* [REPLACE WITH REAL CONTENT] */ Systematic classification, skeletal anatomy, and physiological adaptation of native freshwater fish.',
    descriptionBn: 'মাছের অঙ্গসংস্থান ও শ্রেণিবিন্যাস।'
  },

  // --- Geology Courses ---
  {
    id: 'geol-c-101',
    departmentId: 'geology',
    programId: 'prog-geol-bsc',
    courseCode: 'GEOL 1101',
    courseTitle: 'Physical Geology & Earth Processes [REPLACE WITH REAL CONTENT]',
    courseTitleBn: 'ভৌত ভূতত্ত্ব ও ভূ-প্রক্রিয়া [প্রকৃত কোর্স নাম দিন]',
    credits: 3.0,
    type: 'Theory',
    typeBn: 'তাত্ত্বিক',
    year: 1,
    semester: 1,
    semesterLabel: '1st Year, 1st Semester',
    semesterLabelBn: '১ম বর্ষ, ১ম সেমিস্টার',
    description: '/* [REPLACE WITH REAL CONTENT] */ Plate tectonics, volcanic mechanisms, weathering, erosion, and rock cycle dynamics.',
    descriptionBn: 'প্লেট টেকটনিক্স ও পৃথিবীর অভ্যন্তরীণ গঠন।'
  },

  // --- Management Courses ---
  {
    id: 'mgmt-c-101',
    departmentId: 'management',
    programId: 'prog-mgmt-bba',
    courseCode: 'MGMT 1101',
    courseTitle: 'Principles of Management [REPLACE WITH REAL CONTENT]',
    courseTitleBn: 'ব্যবস্থাপনার মূলনীতি [প্রকৃত কোর্স নাম দিন]',
    credits: 3.0,
    type: 'Theory',
    typeBn: 'তাত্ত্বিক',
    year: 1,
    semester: 1,
    semesterLabel: '1st Year, 1st Semester',
    semesterLabelBn: '১ম বর্ষ, ১ম সেমিস্টার',
    description: '/* [REPLACE WITH REAL CONTENT] */ Planning, organizing, leading, motivating, and controlling in modern enterprise environments.',
    descriptionBn: 'পরিকল্পনা, সংগঠন ও ব্যবসায়িক নিয়ন্ত্রণ।'
  },

  // --- Social Work Courses ---
  {
    id: 'sw-c-101',
    departmentId: 'social-work',
    programId: 'prog-sw-bss',
    courseCode: 'SW 1101',
    courseTitle: 'Introduction to Social Work [REPLACE WITH REAL CONTENT]',
    courseTitleBn: 'সমাজকর্ম পরিচিতি [প্রকৃত কোর্স নাম দিন]',
    credits: 3.0,
    type: 'Theory',
    typeBn: 'তাত্ত্বিক',
    year: 1,
    semester: 1,
    semesterLabel: '1st Year, 1st Semester',
    semesterLabelBn: '১ম বর্ষ, ১ম সেমিস্টার',
    description: '/* [REPLACE WITH REAL CONTENT] */ Historical evolution of social work, human rights concepts, and community welfare ethics.',
    descriptionBn: 'সমাজকর্মের ইতিহাস, মূল্যবোধ ও পেশাদার ভূমিকা।'
  }
];

// ----------------------------------------------------------------------------
// 6. Department Laboratories (All 7 departments)
// All records marked with [REPLACE WITH REAL CONTENT]
// ----------------------------------------------------------------------------
export const departmentLabs: DepartmentLab[] = [
  // CSE Labs
  {
    id: 'lab-cse-01',
    departmentId: 'cse',
    name: 'Software Engineering & Cloud Computing Lab [REPLACE WITH REAL CONTENT]',
    nameBn: 'সফটওয়্যার ইঞ্জিনিয়ারিং ল্যাব [প্রকৃত তথ্য দিন]',
    location: 'Academic Complex, Room 410 [REPLACE]',
    locationBn: 'একাডেমিক কমপ্লেক্স, কক্ষ ৪১০',
    capacity: 45,
    labInCharge: 'Placeholder Lab In-Charge 1 [REPLACE WITH REAL CONTENT]',
    labInChargeBn: 'ল্যাব ইন-চার্জ ১ [প্রকৃত নাম দিন]',
    keyEquipment: [
      'High-Speed Core i7 Workstations (45 units) [REPLACE]',
      'Dedicated Gigabit Switch and Local Network [REPLACE]'
    ],
    keyEquipmentBn: [
      '৪৫টি উচ্চগতির ওয়ার্কস্টেশন',
      'ডেডিকেটেড গিগাবিট নেটওয়ার্ক সুইচ'
    ],
    description: '/* [REPLACE WITH REAL CONTENT] */ Primary facility for software development, database design, and open-source project building.',
    descriptionBn: 'সফটওয়্যার ডেভেলপমেন্ট ও ডেটাবেজ ল্যাবের জন্য আধুনিক সুযোগ-সুবিধা।',
    imageUrl: ''
  },
  {
    id: 'lab-cse-02',
    departmentId: 'cse',
    name: 'Artificial Intelligence & Robotics Lab [REPLACE WITH REAL CONTENT]',
    nameBn: 'কৃত্রিম বুদ্ধিমত্তা ও রোবটিক্স ল্যাব [প্রকৃত তথ্য দিন]',
    location: 'Academic Complex, Room 412 [REPLACE]',
    locationBn: 'একাডেমিক কমপ্লেক্স, কক্ষ ৪১২',
    capacity: 35,
    labInCharge: 'Placeholder Lab In-Charge 2 [REPLACE WITH REAL CONTENT]',
    labInChargeBn: 'ল্যাব ইন-চার্জ ২ [প্রকৃত নাম দিন]',
    keyEquipment: [
      'GPU Deep Learning Workstations [REPLACE]',
      'Jetson Orin Nano Edge AI Kits [REPLACE]'
    ],
    keyEquipmentBn: [
      'জিপিইউ ডিপ লার্নিং ওয়ার্কস্টেশন',
      'এজ এআই ডেভেলপমেন্ট কিট'
    ],
    description: '/* [REPLACE WITH REAL CONTENT] */ Dedicated to neural network training, computer vision algorithms, and robotic systems.',
    descriptionBn: 'মেশিন লার্নিং ও রোবটিক্স গবেষণায় নিয়োজিত।',
    imageUrl: ''
  },

  // EEE Labs
  {
    id: 'lab-eee-01',
    departmentId: 'eee',
    name: 'Smart Microgrids & Power Systems Lab [REPLACE WITH REAL CONTENT]',
    nameBn: 'স্মার্ট মাইক্রোগ্রিড ও পাওয়ার ল্যাব [প্রকৃত তথ্য দিন]',
    location: 'Engineering Pavilion, Room 310 [REPLACE]',
    locationBn: 'ইঞ্জিনিয়ারিং প্যাভিলিয়ন, কক্ষ ৩১০',
    capacity: 35,
    labInCharge: 'Placeholder Lab In-Charge 3 [REPLACE WITH REAL CONTENT]',
    labInChargeBn: 'ল্যাব ইন-চার্জ ৩ [প্রকৃত নাম দিন]',
    keyEquipment: [
      'Solar Photovoltaic Grid-Tied Inverter Bench [REPLACE]',
      'Digital Storage Oscilloscopes (200 MHz) [REPLACE]'
    ],
    keyEquipmentBn: [
      'সৌর ফটোভোল্টাইক ইনভার্টার বেঞ্চ',
      'ডিজিটাল অসিলোস্কোপ ও অ্যানালাইজার'
    ],
    description: '/* [REPLACE WITH REAL CONTENT] */ Testing facility for rural solar microgrids, power harmonics, and distribution networks.',
    descriptionBn: 'সৌর শক্তি ও গ্রিড ট্রান্সমিশন পরীক্ষার জন্য উন্নত গবেষণাগার।',
    imageUrl: ''
  },

  // Mathematics Lab
  {
    id: 'lab-math-01',
    departmentId: 'mathematics',
    name: 'Computational Mathematics & Modeling Lab [REPLACE WITH REAL CONTENT]',
    nameBn: 'কম্পিউটেশনাল গণিত ল্যাব [প্রকৃত তথ্য দিন]',
    location: 'Science Complex, Room 205 [REPLACE]',
    locationBn: 'বিজ্ঞান কমপ্লেক্স, কক্ষ ২০৫',
    capacity: 40,
    labInCharge: 'Placeholder Lab In-Charge 4 [REPLACE WITH REAL CONTENT]',
    labInChargeBn: 'ল্যাব ইন-চার্জ ৪ [প্রকৃত নাম দিন]',
    keyEquipment: [
      'MATLAB, Mathematica, and Python Computing Stations [REPLACE]',
      'High-throughput mathematical modeling server [REPLACE]'
    ],
    keyEquipmentBn: [
      'ম্যাটল্যাব ও পাইথন কম্পিউটিং স্টেশন',
      'গাণিতিক মডেলিং সার্ভার'
    ],
    description: '/* [REPLACE WITH REAL CONTENT] */ Equipped for numerical simulations, finite element analysis, and differential equation solutions.',
    descriptionBn: 'সংখ্যাত্মক সিমুলেশন ও গাণিতিক অ্যালগরিদমের জন্য বিশেষায়িত ল্যাব।',
    imageUrl: ''
  },

  // Fisheries Lab
  {
    id: 'lab-fish-01',
    departmentId: 'fisheries',
    name: 'Aquatic Biotechnology & Fish Pathology Lab [REPLACE WITH REAL CONTENT]',
    nameBn: 'অ্যাকুয়াটিক বায়োটেকনোলজি ও প্যাথলজি ল্যাব [প্রকৃত তথ্য দিন]',
    location: 'Life Sciences Block, Room 115 [REPLACE]',
    locationBn: 'লাইফ সায়েন্সেস ভবন, কক্ষ ১১৫',
    capacity: 30,
    labInCharge: 'Placeholder Lab In-Charge 5 [REPLACE WITH REAL CONTENT]',
    labInChargeBn: 'ল্যাব ইন-চার্জ ৫ [প্রকৃত নাম দিন]',
    keyEquipment: [
      'Thermal Cycler PCR and Gel Electrophoresis Units [REPLACE]',
      'Fluorescence Digital Microscope [REPLACE]'
    ],
    keyEquipmentBn: [
      'পিসিআর মেশিন ও জেল ইলেক্ট্রোফোরেসিস',
      'ফ্লুরোসেন্স মাইক্রোস্কোপ'
    ],
    description: '/* [REPLACE WITH REAL CONTENT] */ Dedicated to fish gene analysis, pathogen identification, and river water quality monitoring.',
    descriptionBn: 'মাছের জিনোম ও রোগজীবাণু শনাক্তকরণে উন্নত গবেষণাগার।',
    imageUrl: ''
  },

  // Geology Lab
  {
    id: 'lab-geol-01',
    departmentId: 'geology',
    name: 'Petrology & GIS Remote Sensing Lab [REPLACE WITH REAL CONTENT]',
    nameBn: 'পেট্রোলজি ও জিআইএস রিমোট সেন্সিং ল্যাব [প্রকৃত তথ্য দিন]',
    location: 'Earth Sciences Block, Room 215 [REPLACE]',
    locationBn: 'আর্থ সায়েন্স ভবন, কক্ষ ২১৫',
    capacity: 30,
    labInCharge: 'Placeholder Lab In-Charge 6 [REPLACE WITH REAL CONTENT]',
    labInChargeBn: 'ল্যাব ইন-চার্জ ৬ [প্রকৃত নাম দিন]',
    keyEquipment: [
      'Polarizing Petrographic Microscopes [REPLACE]',
      'ArcGIS Pro Satellite Mapping Workstations [REPLACE]'
    ],
    keyEquipmentBn: [
      'পেট্রোগ্রাফিক পোলারাইজিং মাইক্রোস্কোপ',
      'স্যাটেলাইট ইমেজ প্রসেসিং ওয়ার্কস্টেশন'
    ],
    description: '/* [REPLACE WITH REAL CONTENT] */ Rock mineral identification, geological structural mapping, and satellite flood inundation monitoring.',
    descriptionBn: 'খনিজ শিলা বিশ্লেষণ এবং স্যাটেলাইট জিআইএস মানচিত্রায়ন।',
    imageUrl: ''
  },

  // Management Lab
  {
    id: 'lab-mgmt-01',
    departmentId: 'management',
    name: 'Business Analytics & Simulation Lab [REPLACE WITH REAL CONTENT]',
    nameBn: 'বিজনেস অ্যানালিটিক্স ও সিমুলেশন ল্যাব [প্রকৃত তথ্য দিন]',
    location: 'Business Suite, Room 310 [REPLACE]',
    locationBn: 'ব্যবসায় ভবন, কক্ষ ৩১০',
    capacity: 35,
    labInCharge: 'Placeholder Lab In-Charge 7 [REPLACE WITH REAL CONTENT]',
    labInChargeBn: 'ল্যাব ইন-চার্জ ৭ [প্রকৃত নাম দিন]',
    keyEquipment: [
      'Statistical Analytics Software (SPSS, R, Tableau) [REPLACE]',
      'ERP Simulation Modules [REPLACE]'
    ],
    keyEquipmentBn: [
      'এসপিএসএস ও ট্যাবলু অ্যানালিটিক্স সফটওয়্যার',
      'ইআরপি সিমুলেশন মডিউল'
    ],
    description: '/* [REPLACE WITH REAL CONTENT] */ Decision modeling, financial forecasting, and enterprise resource planning simulations.',
    descriptionBn: 'ব্যবসায়িক ডেটা অ্যানালিটিক্স ও ফিনান্সিয়াল ফোরকাস্টিং ল্যাব।',
    imageUrl: ''
  },

  // Social Work Lab
  {
    id: 'lab-sw-01',
    departmentId: 'social-work',
    name: 'Social Research & Counseling Practicum Lab [REPLACE WITH REAL CONTENT]',
    nameBn: 'সামাজিক গবেষণা ও কাউন্সেলিং ল্যাব [প্রকৃত তথ্য দিন]',
    location: 'Social Sciences Building, Room 210 [REPLACE]',
    locationBn: 'সামাজিক বিজ্ঞান ভবন, কক্ষ ২১০',
    capacity: 30,
    labInCharge: 'Placeholder Lab In-Charge 8 [REPLACE WITH REAL CONTENT]',
    labInChargeBn: 'ল্যাব ইন-চার্জ ৮ [প্রকৃত নাম দিন]',
    keyEquipment: [
      'Qualitative Data Analysis Software (NVivo) [REPLACE]',
      'Observation and Counseling Recording Units [REPLACE]'
    ],
    keyEquipmentBn: [
      'এনভিভো গুণগত গবেষণা সফটওয়্যার',
      'কাউন্সেলিং অবজারভেশন ইউনিট'
    ],
    description: '/* [REPLACE WITH REAL CONTENT] */ Qualitative interview coding, participatory rural appraisal modeling, and psychosocial skill training.',
    descriptionBn: 'কমিউনিটি গবেষণা ও সাইকোসোশ্যাল কাউন্সেলিং প্রশিক্ষণ ল্যাব।',
    imageUrl: ''
  }
];

// ----------------------------------------------------------------------------
// 7. Research Projects (All 7 departments)
// All records marked with [REPLACE WITH REAL CONTENT]
// ----------------------------------------------------------------------------
export const departmentResearchProjects: DepartmentResearchProject[] = [
  // CSE Research
  {
    id: 'res-cse-01',
    departmentId: 'cse',
    title: 'Bangla-LLM: Developing Context-Aware Conversational AI for Public Services [REPLACE WITH REAL CONTENT]',
    titleBn: 'বাংলা-এলএলএম: সরকারি সেবায় এআই মডেল উন্নয়ন [প্রকৃত প্রকল্প দিন]',
    principalInvestigator: 'Placeholder Investigator 1 [REPLACE WITH REAL CONTENT]',
    principalInvestigatorBn: 'প্রকল্প গবেষক ১ [প্রকৃত নাম দিন]',
    fundingAgency: 'ICT Division, Government of Bangladesh (Grant BDT 3.5M) [REPLACE]',
    fundingAgencyBn: 'তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ (৩৪.৫ লাখ টাকা অনুদান)',
    status: 'Ongoing',
    statusBn: 'চলমান',
    description: '/* [REPLACE WITH REAL CONTENT] */ Training lightweight transformer models on high-quality Bangla corpora to automate citizen service inquiries.',
    descriptionBn: 'সরকারি নাগরিক সেবা স্বয়ংক্রিয় করার লক্ষ্যে বাংলা এলএলএম মডেল তৈরি ও মূল্যায়ন।',
    publicationsCount: 6
  },
  // EEE Research
  {
    id: 'res-eee-01',
    departmentId: 'eee',
    title: 'Autonomous Solar-Powered Irrigation Microgrids in Riverine Chars [REPLACE WITH REAL CONTENT]',
    titleBn: 'চরে সৌরশক্তি চালিত স্বয়ংক্রিয় সেচ মাইক্রোগ্রিড [প্রকৃত প্রকল্প দিন]',
    principalInvestigator: 'Placeholder Investigator 2 [REPLACE WITH REAL CONTENT]',
    principalInvestigatorBn: 'প্রকল্প গবেষক ২ [প্রকৃত নাম দিন]',
    fundingAgency: 'Infrastructure Development Agency (IDCOL) [REPLACE]',
    fundingAgencyBn: 'ইডকল অনুদান প্রকল্প',
    status: 'Ongoing',
    statusBn: 'চলমান',
    description: '/* [REPLACE WITH REAL CONTENT] */ Optimization of off-grid solar inverters and wireless telemetry in char farmland communities.',
    descriptionBn: 'মাটির আর্দ্রতার সাথে সমন্বয় করে সৌরচালিত সেচ পাম্প পরিচালনা।',
    publicationsCount: 5
  },
  // Mathematics Research
  {
    id: 'res-math-01',
    departmentId: 'mathematics',
    title: 'Magnetohydrodynamic Boundary Layer Flow Over Porous Surfaces [REPLACE WITH REAL CONTENT]',
    titleBn: 'ম্যাগনেটো-হাইড্রোডায়নামিক বাউন্ডারি লেয়ার প্রবাহ বিশ্লেষণ [প্রকৃত প্রকল্প দিন]',
    principalInvestigator: 'Placeholder Investigator 3 [REPLACE WITH REAL CONTENT]',
    principalInvestigatorBn: 'প্রকল্প গবেষক ৩ [প্রকৃত নাম দিন]',
    fundingAgency: 'UGC Research Grant [REPLACE]',
    fundingAgencyBn: 'ইউজিসি গবেষণা অনুদান',
    status: 'Ongoing',
    statusBn: 'চলমান',
    description: '/* [REPLACE WITH REAL CONTENT] */ Numerical finite difference solutions for nonlinear fluid flow equations under thermal radiation.',
    descriptionBn: 'উচ্চতাপীয় ফ্লুইড ফ্লো সমীকরণের সংখ্যাত্মক সমাধান।',
    publicationsCount: 4
  },
  // Fisheries Research
  {
    id: 'res-fish-01',
    departmentId: 'fisheries',
    title: 'Genetic Cataloging of Native Endangered Fish of the Old Brahmaputra [REPLACE WITH REAL CONTENT]',
    titleBn: 'পুরাতন ব্রহ্মপুত্র নদের বিলুপ্তপ্রায় মাছের জেনেটিক ক্যাটালগ [প্রকৃত প্রকল্প দিন]',
    principalInvestigator: 'Placeholder Investigator 4 [REPLACE WITH REAL CONTENT]',
    principalInvestigatorBn: 'প্রকল্প গবেষক ৪ [প্রকৃত নাম দিন]',
    fundingAgency: 'Ministry of Science & Technology [REPLACE]',
    fundingAgencyBn: 'বিজ্ঞান ও প্রযুক্তি মন্ত্রণালয়',
    status: 'Ongoing',
    statusBn: 'চলমান',
    description: '/* [REPLACE WITH REAL CONTENT] */ Cryopreservation and molecular genetic barcoding of threatened native fish species.',
    descriptionBn: 'দেশীয় মাছের জেনেটিক বারকোডিং ও সংরক্ষণ।',
    publicationsCount: 5
  },
  // Geology Research
  {
    id: 'res-geol-01',
    departmentId: 'geology',
    title: 'Hydrogeological Mapping of Deep Aquifers in the Jamalpur-Mymensingh Basin [REPLACE WITH REAL CONTENT]',
    titleBn: 'জামালপুর অববাহিকায় গভীর ভূগর্ভস্থ পানি স্তর ম্যাপিং [প্রকৃত প্রকল্প দিন]',
    principalInvestigator: 'Placeholder Investigator 5 [REPLACE WITH REAL CONTENT]',
    principalInvestigatorBn: 'প্রকল্প গবেষক ৫ [প্রকৃত নাম দিন]',
    fundingAgency: 'Department of Public Health Engineering [REPLACE]',
    fundingAgencyBn: 'জনস্বাস্থ্য প্রকৌশল অধিদপ্তর',
    status: 'Ongoing',
    statusBn: 'চলমান',
    description: '/* [REPLACE WITH REAL CONTENT] */ Delineating arsenic-free drinking water reservoirs using geophysical electrical resistivity tomography.',
    descriptionBn: 'ভূ-তাত্ত্বিক রেজিস্টিভিটির মাধ্যমে নিরাপদ পানির স্তর নির্ধারণ।',
    publicationsCount: 3
  },
  // Management Research
  {
    id: 'res-mgmt-01',
    departmentId: 'management',
    title: 'Digital Supply Chain Adoption in Agri-Business SMEs [REPLACE WITH REAL CONTENT]',
    titleBn: 'কৃষিভিত্তিক ক্ষুদ্র উদ্যোগে ডিজিটাল সাপ্লাই চেইন বাস্তবায়ন [প্রকৃত প্রকল্প দিন]',
    principalInvestigator: 'Placeholder Investigator 6 [REPLACE WITH REAL CONTENT]',
    principalInvestigatorBn: 'প্রকল্প গবেষক ৬ [প্রকৃত নাম দিন]',
    fundingAgency: 'SME Foundation Research Fund [REPLACE]',
    fundingAgencyBn: 'এসএমই ফাউন্ডেশন গবেষণা তহবিল',
    status: 'Ongoing',
    statusBn: 'চলমান',
    description: '/* [REPLACE WITH REAL CONTENT] */ Evaluating barriers to mobile-first logistics tools among agricultural merchants.',
    descriptionBn: 'কৃষি বিপণনে ডিজিটাল লজিস্টিকস প্ল্যাটফর্মের প্রভাব মূল্যায়ন।',
    publicationsCount: 4
  },
  // Social Work Research
  {
    id: 'res-sw-01',
    departmentId: 'social-work',
    title: 'Community-Based Climate Adaptation Along Riverine Chars [REPLACE WITH REAL CONTENT]',
    titleBn: 'নদী ভাঙন এলাকায় কমিউনিটি জলবায়ু অভিযোজন [প্রকৃত প্রকল্প দিন]',
    principalInvestigator: 'Placeholder Investigator 7 [REPLACE WITH REAL CONTENT]',
    principalInvestigatorBn: 'প্রকল্প গবেষক ৭ [প্রকৃত নাম দিন]',
    fundingAgency: 'UNDP Resilience Partnership Grant [REPLACE]',
    fundingAgencyBn: 'ইউএনডিপি রেজিলিয়েন্স পার্টনারশিপ গ্রান্ট',
    status: 'Ongoing',
    statusBn: 'চলমান',
    description: '/* [REPLACE WITH REAL CONTENT] */ Evaluating community safety net mechanisms among displaced families in Northern Bangladesh.',
    descriptionBn: 'জলবায়ু উদ্বাস্তু পরিবারের সামাজিক নিরাপত্তা বেষ্টনী মূল্যায়ন।',
    publicationsCount: 3
  }
];

// ----------------------------------------------------------------------------
// 8. Department Notices (All 7 departments)
// All records marked with [REPLACE WITH REAL CONTENT]
// ----------------------------------------------------------------------------
export const departmentNotices: DepartmentNotice[] = [
  // CSE Notices
  {
    id: 'not-cse-01',
    departmentId: 'cse',
    title: 'Submission Deadline for Final Year Capstone Project Defense [REPLACE WITH REAL CONTENT]',
    titleBn: '৮ম সেমিস্টার ফাইনাল ক্যাপস্টোন প্রজেক্ট ডিফেন্স জমা দেওয়ার শেষ সময় [প্রকৃত নোটিশ দিন]',
    date: '2026-10-15',
    dateBn: '১৫ অক্টোবর ২০২৬',
    category: 'Academic',
    categoryBn: 'একাডেমিক',
    content: '/* [REPLACE WITH REAL CONTENT] */ 4th-year students must submit their complete thesis documentation and source repository links to the department office by November 5, 2026.',
    contentBn: '৪র্থ বর্ষের শিক্ষার্থীদের আগামী ৫ নভেম্বরের মধ্যে প্রজেক্টের চূড়ান্ত রিপোর্ট ও কোড রিপোজিটরি লিংক জমা দিতে হবে।',
    isImportant: true
  },
  // EEE Notices
  {
    id: 'not-eee-01',
    departmentId: 'eee',
    title: 'Mandatory Safety Orientation for High Voltage Laboratory Sessions [REPLACE WITH REAL CONTENT]',
    titleBn: 'হাই ভোল্টেজ ল্যাবরেটরির জন্য বাধ্যতামূলক নিরাপত্তা কর্মশালা [প্রকৃত নোটিশ দিন]',
    date: '2026-10-05',
    dateBn: '৫ অক্টোবর ২০২৬',
    category: 'Academic',
    categoryBn: 'একাডেমিক',
    content: '/* [REPLACE WITH REAL CONTENT] */ 2nd-year EEE students must attend safety instruction in Engineering Pavilion Room 310 before starting transformer experiments.',
    contentBn: '২য় বর্ষের শিক্ষার্থীদের হাই ভোল্টেজ ল্যাব শুরুর পূর্বে নিরাপত্তা কর্মশালায় অংশ নেওয়া বাধ্যতামূলক।'
  },
  // Mathematics Notices
  {
    id: 'not-math-01',
    departmentId: 'mathematics',
    title: 'Special Seminar on Applied Fluid Dynamics and Computational Solvers [REPLACE WITH REAL CONTENT]',
    titleBn: 'ফলিত গণিত ও কম্পিউটেশনাল সলভার বিষয়ক বিশেষ সেমিনার [প্রকৃত নোটিশ দিন]',
    date: '2026-10-08',
    dateBn: '৮ অক্টোবর ২০২৬',
    category: 'Seminar',
    categoryBn: 'সেমিনার',
    content: '/* [REPLACE WITH REAL CONTENT] */ A distinguished seminar will be held on Thursday at Science Complex Room 201. All honours students are requested to attend.',
    contentBn: 'বৃহস্পতিবার বিজ্ঞান কমপ্লেক্সে সেমিনার অনুষ্ঠিত হবে। সংশ্লিষ্ট শিক্ষার্থীদের উপস্থিতি কাম্য।'
  },
  // Fisheries Notices
  {
    id: 'not-fish-01',
    departmentId: 'fisheries',
    title: 'Fieldwork Excursion Schedule for Brahmaputra Hydrology Study [REPLACE WITH REAL CONTENT]',
    titleBn: 'ব্রহ্মপুত্র অববাহিকা ফিল্ডওয়ার্ক এক্সকার্শন সময়সূচি [প্রকৃত নোটিশ দিন]',
    date: '2026-09-30',
    dateBn: '৩০ সেপ্টেম্বর ২০২৬',
    category: 'Academic',
    categoryBn: 'একাডেমিক',
    content: '/* [REPLACE WITH REAL CONTENT] */ 3rd-year students are instructed to collect equipment kits for the water sample collection field study taking place on October 20.',
    contentBn: '২০ অক্টোবর অনুষ্ঠিতব্য পানি নমুনা সংগ্রহ ফিল্ডওয়ার্কের জন্য প্রয়োজনীয় কিট সংগ্রহ করার নির্দেশ দেওয়া হলো।'
  },
  // Geology Notices
  {
    id: 'not-geol-01',
    departmentId: 'geology',
    title: 'Geological Field Mapping Camp Kit Distribution Notice [REPLACE WITH REAL CONTENT]',
    titleBn: 'ভূতাত্ত্বিক ফিল্ড ম্যাপিং ক্যাম্প কিট বিতরণ সংক্রান্ত নোটিশ [প্রকৃত নোটিশ দিন]',
    date: '2026-10-10',
    dateBn: '১০ অক্টোবর ২০২৬',
    category: 'Notice',
    categoryBn: 'নোটিশ',
    content: '/* [REPLACE WITH REAL CONTENT] */ Students enrolled in Geological Fieldwork must collect Brunton compasses and field notebooks from Room 215.',
    contentBn: 'ফিল্ডওয়ার্ক কোর্সের শিক্ষার্থীদের ব্রান্টন কম্পাস ও ফিল্ড নোটবুক সংগ্রহ করার নির্দেশ দেওয়া হলো।'
  },
  // Management Notices
  {
    id: 'not-mgmt-01',
    departmentId: 'management',
    title: 'BBA Corporate Internship Placement Briefing Session [REPLACE WITH REAL CONTENT]',
    titleBn: 'বিবিএ করপোরেট ইন্টার্নশিপ প্লেসমেন্ট ব্রিফিং সেশন [প্রকৃত নোটিশ দিন]',
    date: '2026-10-12',
    dateBn: '১২ অক্টোবর ২০২৬',
    category: 'Academic',
    categoryBn: 'একাডেমিক',
    content: '/* [REPLACE WITH REAL CONTENT] */ Final semester BBA students are requested to attend the corporate internship advising session in Room 310.',
    contentBn: 'চূড়ান্ত সেমিস্টারের শিক্ষার্থীদের ইন্টার্নশিপ ব্রিফিং সেশনে উপস্থিত থাকতে হবে।'
  },
  // Social Work Notices
  {
    id: 'not-sw-01',
    departmentId: 'social-work',
    title: 'Practicum Agency Placement Notification for 4th Year BSS [REPLACE WITH REAL CONTENT]',
    titleBn: '৪র্থ বর্ষ বিএসএস শিক্ষার্থীদের প্র্যাকটিকাম এজেন্সি বরাদ্দ তালিকা [প্রকৃত নোটিশ দিন]',
    date: '2026-10-14',
    dateBn: '১৪ অক্টোবর ২০২৬',
    category: 'Notice',
    categoryBn: 'নোটিশ',
    content: '/* [REPLACE WITH REAL CONTENT] */ The list of allocated welfare agencies for the 60-day mandatory field practicum has been published on the departmental board.',
    contentBn: '৬০ দিনের ফিল্ড প্র্যাকটিকামের জন্য নির্ধারিত এজেন্সির তালিকা বিভাগীয় নোটিশ বোর্ডে প্রকাশ করা হয়েছে।'
  }
];

// ----------------------------------------------------------------------------
// 9. Academic Calendar Events (2026 Milestones for month view & list view)
// All records marked with [REPLACE WITH REAL CONTENT]
// ----------------------------------------------------------------------------
export const academicCalendarEvents: AcademicCalendarEvent[] = [
  {
    id: 'cal-01',
    date: '2026-01-04',
    endDate: '2026-01-15',
    dateBn: '৪ জানুয়ারি ২০২৬',
    endDateBn: '১৫ জানুয়ারি ২০২৬',
    title: 'Spring Semester Online Course Registration & Advising [REPLACE WITH REAL CONTENT]',
    titleBn: 'স্প্রিং সেমিস্টার অনলাইন কোর্স রেজিস্ট্রেশন ও অ্যাডভাইজিং [প্রকৃত তথ্য দিন]',
    category: 'Registration',
    categoryBn: 'রেজিস্ট্রেশন',
    term: 'Spring 2026',
    termBn: 'স্প্রিং ২০২৬',
    description: '/* [REPLACE WITH REAL CONTENT] */ Students complete digital fee payment and submit course selections with faculty advisor sign-off.',
    descriptionBn: 'শিক্ষার্থীরা পোর্টালের মাধ্যমে কোর্স নির্বাচন ও ফি পরিশোধ সম্পন্ন করবে।'
  },
  {
    id: 'cal-02',
    date: '2026-01-18',
    dateBn: '১৮ জানুয়ারি ২০২৬',
    title: 'Commencement of Spring Semester Classes [REPLACE WITH REAL CONTENT]',
    titleBn: 'স্প্রিং সেমিস্টারের ক্লাস শুরু [প্রকৃত তথ্য দিন]',
    category: 'Classes',
    categoryBn: 'ক্লাস শুরু',
    term: 'Spring 2026',
    termBn: 'স্প্রিং ২০২৬',
    description: '/* [REPLACE WITH REAL CONTENT] */ Regular class sessions begin across all 6 faculties according to published departmental class routines.',
    descriptionBn: 'সকল বিভাগে নিয়মিত ক্লাস কার্যক্রম শুরু।'
  },
  {
    id: 'cal-03',
    date: '2026-02-21',
    dateBn: '২১ ফেব্রুয়ারি ২০২৬',
    title: 'International Mother Language Day Observance [REPLACE WITH REAL CONTENT]',
    titleBn: 'আন্তর্জাতিক মাতৃভাষা ও শহীদ দিবস [প্রকৃত তথ্য দিন]',
    category: 'Holiday',
    categoryBn: 'সরকারি ছুটি',
    term: 'Spring 2026',
    termBn: 'স্প্রিং ২০২৬',
    description: '/* [REPLACE WITH REAL CONTENT] */ National holiday, morning rally, and floral tributes at the central Shaheed Minar.',
    descriptionBn: 'জাতীয় শোক ও সরকারি ছুটি, শহীদ মিনারে পুষ্পস্তবক অর্পণ।'
  },
  {
    id: 'cal-04',
    date: '2026-03-08',
    endDate: '2026-03-19',
    dateBn: '৮ মার্চ ২০২৬',
    endDateBn: '১৯ মার্চ ২০২৬',
    title: 'Midterm Examination Period (Spring 2026) [REPLACE WITH REAL CONTENT]',
    titleBn: 'স্প্রিং সেমিস্টার মিডটার্ম পরীক্ষা সপ্তাহ [প্রকৃত তথ্য দিন]',
    category: 'Midterm',
    categoryBn: 'মিডটার্ম পরীক্ষা',
    term: 'Spring 2026',
    termBn: 'স্প্রিং ২০২৬',
    description: '/* [REPLACE WITH REAL CONTENT] */ Midterm written evaluations and continuous assessments freeze.',
    descriptionBn: 'মিডটার্ম পরীক্ষা অনুষ্ঠিত হবে এবং ফলাফল পোর্টালে এন্ট্রি হবে।'
  },
  {
    id: 'cal-05',
    date: '2026-03-26',
    dateBn: '২৬ মার্চ ২০২৬',
    title: 'Independence Day Holiday & National Observance [REPLACE WITH REAL CONTENT]',
    titleBn: 'মহান স্বাধীনতা ও জাতীয় দিবস উদযাপন [প্রকৃত তথ্য দিন]',
    category: 'Holiday',
    categoryBn: 'সরকারি ছুটি',
    term: 'Spring 2026',
    termBn: 'স্প্রিং ২০২৬',
    description: '/* [REPLACE WITH REAL CONTENT] */ University holiday and ceremonial flag-hoisting at the central administrative complex.',
    descriptionBn: 'বিশ্ববিদ্যালয় ক্যাম্পাস ও কেন্দ্রীয় প্লাজায় জাতীয় পতাকা উত্তোলন।'
  },
  {
    id: 'cal-06',
    date: '2026-04-14',
    dateBn: '১৪ এপ্রিল ২০২৬',
    title: 'Pohela Boishakh (Bangla New Year 1433) [REPLACE WITH REAL CONTENT]',
    titleBn: 'পহেলা বৈশাখ (বাংলা নববর্ষ ১৪৩৩) [প্রকৃত তথ্য দিন]',
    category: 'Holiday',
    categoryBn: 'সাংস্কৃতিক ছুটি',
    term: 'Spring 2026',
    termBn: 'স্প্রিং ২০২৬',
    description: '/* [REPLACE WITH REAL CONTENT] */ Traditional Mangal Shobhajatra and cultural festival on campus grounds.',
    descriptionBn: 'বিশ্ববিদ্যালয় ক্যাম্পাসে মঙ্গল শোভাযাত্রা ও সাংস্কৃতিক অনুষ্ঠান।'
  },
  {
    id: 'cal-07',
    date: '2026-05-10',
    endDate: '2026-05-31',
    dateBn: '১০ মে ২০২৬',
    endDateBn: '৩১ মে ২০২৬',
    title: 'Semester Final Examinations (Spring 2026) [REPLACE WITH REAL CONTENT]',
    titleBn: 'স্প্রিং সেমিস্টার ফাইনাল পরীক্ষা [প্রকৃত তথ্য দিন]',
    category: 'Final Exam',
    categoryBn: 'সেমিস্টার ফাইনাল',
    term: 'Spring 2026',
    termBn: 'স্প্রিং ২০২৬',
    description: '/* [REPLACE WITH REAL CONTENT] */ Semester terminal written examinations administered under the Controller of Examinations.',
    descriptionBn: 'পরীক্ষা নিয়ন্ত্রক দপ্তরের অধীনে সেমিস্টার সমাপনী লিখিত পরীক্ষা অনুষ্ঠিত হবে।'
  },
  {
    id: 'cal-08',
    date: '2026-06-01',
    endDate: '2026-06-20',
    dateBn: '১ জুন ২০২৬',
    endDateBn: '২০ জুন ২০২৬',
    title: 'Summer Recess & Examination Evaluation Period [REPLACE WITH REAL CONTENT]',
    titleBn: 'গ্রীষ্মকালীন অবকাশ ও উত্তরপত্র মূল্যায়ন সময় [প্রকৃত তথ্য দিন]',
    category: 'Recess',
    categoryBn: 'ছুটি ও অবকাশ',
    term: 'Spring 2026',
    termBn: 'স্প্রিং ২০২৬',
    description: '/* [REPLACE WITH REAL CONTENT] */ Academic recess for students and faculty evaluation/ledger tabulation window.',
    descriptionBn: 'শিক্ষার্থীদের অবকাশ এবং শিক্ষকদের ফলাফল প্রণয়ন সময়।'
  },
  {
    id: 'cal-09',
    date: '2026-07-05',
    endDate: '2026-07-16',
    dateBn: '৫ জুলাই ২০২৬',
    endDateBn: '১৬ জুলাই ২০২৬',
    title: 'Fall Semester Course Registration & Advising [REPLACE WITH REAL CONTENT]',
    titleBn: 'ফল সেমিস্টার কোর্স রেজিস্ট্রেশন ও অ্যাডভাইজিং [প্রকৃত তথ্য দিন]',
    category: 'Registration',
    categoryBn: 'রেজিস্ট্রেশন',
    term: 'Fall 2026',
    termBn: 'ফল ২০২৬',
    description: '/* [REPLACE WITH REAL CONTENT] */ Fall term registration window opens on the student portal.',
    descriptionBn: 'ফল সেমিস্টারের ভর্তি ও রেজিস্ট্রেশন উইন্ডো উন্মুক্ত হবে।'
  },
  {
    id: 'cal-10',
    date: '2026-07-19',
    dateBn: '১৯ জুলাই ২০২৬',
    title: 'Commencement of Fall Semester Classes [REPLACE WITH REAL CONTENT]',
    titleBn: 'ফল সেমিস্টারের ক্লাস শুরু [প্রকৃত তথ্য দিন]',
    category: 'Classes',
    categoryBn: 'ক্লাস শুরু',
    term: 'Fall 2026',
    termBn: 'ফল ২০২৬',
    description: '/* [REPLACE WITH REAL CONTENT] */ Classes resume across all departments according to published weekly timetables.',
    descriptionBn: 'সকল বিভাগে ফল সেমিস্টারের পাঠদান শুরু।'
  },
  {
    id: 'cal-11',
    date: '2026-09-13',
    endDate: '2026-09-24',
    dateBn: '১৩ সেপ্টেম্বর ২০২৬',
    endDateBn: '২৪ সেপ্টেম্বর ২০২৬',
    title: 'Midterm Examination Period (Fall 2026) [REPLACE WITH REAL CONTENT]',
    titleBn: 'ফল সেমিস্টার মিডটার্ম পরীক্ষা সপ্তাহ [প্রকৃত তথ্য দিন]',
    category: 'Midterm',
    categoryBn: 'মিডটার্ম পরীক্ষা',
    term: 'Fall 2026',
    termBn: 'ফল ২০২৬',
    description: '/* [REPLACE WITH REAL CONTENT] */ Midterm written evaluations across all undergraduate and graduate programs.',
    descriptionBn: 'ফল সেমিস্টারের মিডটার্ম পরীক্ষা অনুষ্ঠিত হবে।'
  },
  {
    id: 'cal-12',
    date: '2026-11-15',
    endDate: '2026-12-06',
    dateBn: '১৫ নভেম্বর ২০২৬',
    endDateBn: '৬ ডিসেম্বর ২০২৬',
    title: 'Semester Final Examinations (Fall 2026) [REPLACE WITH REAL CONTENT]',
    titleBn: 'ফল সেমিস্টার ফাইনাল পরীক্ষা [প্রকৃত তথ্য দিন]',
    category: 'Final Exam',
    categoryBn: 'সেমিস্টার ফাইনাল',
    term: 'Fall 2026',
    termBn: 'ফল ২০২৬',
    description: '/* [REPLACE WITH REAL CONTENT] */ Fall terminal examinations administered under the Office of the Controller of Examinations.',
    descriptionBn: 'পরীক্ষা নিয়ন্ত্রক দপ্তরের অধীনে চূড়ান্ত সেমিস্টার পরীক্ষা।'
  },
  {
    id: 'cal-13',
    date: '2026-12-16',
    dateBn: '১৬ ডিসেম্বর ২০২৬',
    title: 'Victory Day National Observance [REPLACE WITH REAL CONTENT]',
    titleBn: 'মহান বিজয় দিবস [প্রকৃত তথ্য দিন]',
    category: 'Holiday',
    categoryBn: 'সরকারি ছুটি',
    term: 'Fall 2026',
    termBn: 'ফল ২০২৬',
    description: '/* [REPLACE WITH REAL CONTENT] */ National victory day celebrations and memorial wreaths at campus monument.',
    descriptionBn: 'জাতীয় বিজয় দিবস উদযাপন ও শহীদ স্মৃতিস্তম্ভে শ্রদ্ধাঞ্জলি।'
  },
  {
    id: 'cal-14',
    date: '2026-12-24',
    dateBn: '২৪ ডিসেম্বর ২০২৬',
    title: 'Annual University Convocation Ceremony [REPLACE WITH REAL CONTENT]',
    titleBn: 'বার্ষিক সমাবর্তন অনুষ্ঠান [প্রকৃত তথ্য দিন]',
    category: 'Convocation',
    categoryBn: 'সমাবর্তন',
    term: 'Fall 2026',
    termBn: 'ফল ২০২৬',
    description: '/* [REPLACE WITH REAL CONTENT] */ Conferral of degrees to graduating baccalaureate and postgraduate scholars.',
    descriptionBn: 'গ্র্যাজুয়েট শিক্ষার্থীদের আনুষ্ঠানিক ডিগ্রি ও স্বর্ণপদক প্রদান।'
  }
];

// ----------------------------------------------------------------------------
// 10. Class Routine Timetable Slots (Weekly schedule for all 7 departments)
// All records marked with [REPLACE WITH REAL CONTENT]
// ----------------------------------------------------------------------------
export const classRoutinesData: ClassRoutineSlot[] = [
  // --- CSE (Semester 1) ---
  {
    id: 'rout-cse-1-01',
    departmentId: 'cse',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Sunday',
    dayOfWeekBn: 'রবিবার',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    courseCode: 'CSE 1101',
    courseTitle: 'Structured Programming Language [REPLACE]',
    courseTitleBn: 'স্ট্রাকচার্ড প্রোগ্রামিং ল্যাঙ্গুয়েজ',
    teacherName: 'Placeholder Instructor 1 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ১ [প্রকৃত নাম দিন]',
    room: 'Room 401 [REPLACE]',
    roomBn: 'কক্ষ ৪০১'
  },
  {
    id: 'rout-cse-1-02',
    departmentId: 'cse',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Sunday',
    dayOfWeekBn: 'রবিবার',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    courseCode: 'MATH 1103',
    courseTitle: 'Differential Calculus [REPLACE]',
    courseTitleBn: 'ডিফারেনশিয়াল ক্যালকুলাস',
    teacherName: 'Placeholder Instructor 2 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ২ [প্রকৃত নাম দিন]',
    room: 'Room 401 [REPLACE]',
    roomBn: 'কক্ষ ৪০১'
  },
  {
    id: 'rout-cse-1-03',
    departmentId: 'cse',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Monday',
    dayOfWeekBn: 'সোমবার',
    startTime: '01:30 PM',
    endTime: '04:30 PM',
    courseCode: 'CSE 1102',
    courseTitle: 'Structured Programming Lab [REPLACE]',
    courseTitleBn: 'স্ট্রাকচার্ড প্রোগ্রামিং ল্যাব',
    teacherName: 'Placeholder Instructor 1 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ১ [প্রকৃত নাম দিন]',
    room: 'Software Lab 410 [REPLACE]',
    roomBn: 'সফটওয়্যার ল্যাব ৪১০'
  },
  {
    id: 'rout-cse-1-04',
    departmentId: 'cse',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Tuesday',
    dayOfWeekBn: 'মঙ্গলবার',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    courseCode: 'EEE 1105',
    courseTitle: 'Basic Electrical Engineering [REPLACE]',
    courseTitleBn: 'তড়িৎ প্রকৌশল পরিচিতি',
    teacherName: 'Placeholder Instructor 3 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ৩ [প্রকৃত নাম দিন]',
    room: 'Room 402 [REPLACE]',
    roomBn: 'কক্ষ ৪০২'
  },
  {
    id: 'rout-cse-1-05',
    departmentId: 'cse',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Wednesday',
    dayOfWeekBn: 'বুধবার',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    courseCode: 'CSE 1101',
    courseTitle: 'Structured Programming Language [REPLACE]',
    courseTitleBn: 'স্ট্রাকচার্ড প্রোগ্রামিং ল্যাঙ্গুয়েজ',
    teacherName: 'Placeholder Instructor 1 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ১ [প্রকৃত নাম দিন]',
    room: 'Room 401 [REPLACE]',
    roomBn: 'কক্ষ ৪০১'
  },
  {
    id: 'rout-cse-1-06',
    departmentId: 'cse',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Thursday',
    dayOfWeekBn: 'বৃহস্পতিবার',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    courseCode: 'ENG 1107',
    courseTitle: 'Technical English & Communication [REPLACE]',
    courseTitleBn: 'টেকনিক্যাল ইংরেজি ও যোগাযোগ',
    teacherName: 'Placeholder Instructor 4 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ৪ [প্রকৃত নাম দিন]',
    room: 'Room 401 [REPLACE]',
    roomBn: 'কক্ষ ৪০১'
  },

  // --- EEE (Semester 1) ---
  {
    id: 'rout-eee-1-01',
    departmentId: 'eee',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Sunday',
    dayOfWeekBn: 'রবিবার',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    courseCode: 'EEE 1101',
    courseTitle: 'Electrical Circuits I [REPLACE]',
    courseTitleBn: 'বৈদ্যুতিক বর্তনী ১',
    teacherName: 'Placeholder Instructor 5 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ৫ [প্রকৃত নাম দিন]',
    room: 'Pavilion Room 301 [REPLACE]',
    roomBn: 'প্যাভিলিয়ন কক্ষ ৩০১'
  },
  {
    id: 'rout-eee-1-02',
    departmentId: 'eee',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Tuesday',
    dayOfWeekBn: 'মঙ্গলবার',
    startTime: '01:30 PM',
    endTime: '04:30 PM',
    courseCode: 'EEE 1102',
    courseTitle: 'Electrical Circuits Sessional [REPLACE]',
    courseTitleBn: 'বৈদ্যুতিক বর্তনী ল্যাব',
    teacherName: 'Placeholder Instructor 6 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ৬ [প্রকৃত নাম দিন]',
    room: 'Circuits Lab 310 [REPLACE]',
    roomBn: 'সার্কিট ল্যাব ৩১০'
  },
  {
    id: 'rout-eee-1-03',
    departmentId: 'eee',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Thursday',
    dayOfWeekBn: 'বৃহস্পতিবার',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    courseCode: 'MATH 1103',
    courseTitle: 'Engineering Mathematics [REPLACE]',
    courseTitleBn: 'প্রকৌশল গণিত',
    teacherName: 'Placeholder Instructor 2 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ২ [প্রকৃত নাম দিন]',
    room: 'Pavilion Room 301 [REPLACE]',
    roomBn: 'প্যাভিলিয়ন কক্ষ ৩০১'
  },

  // --- Mathematics (Semester 1) ---
  {
    id: 'rout-math-1-01',
    departmentId: 'mathematics',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Sunday',
    dayOfWeekBn: 'রবিবার',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    courseCode: 'MATH 1101',
    courseTitle: 'Foundations of Analysis & Set Theory [REPLACE]',
    courseTitleBn: 'অ্যানালাইসিস ও সেট তত্ত্ব',
    teacherName: 'Placeholder Instructor 7 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ৭ [প্রকৃত নাম দিন]',
    room: 'Science Room 201 [REPLACE]',
    roomBn: 'বিজ্ঞান কক্ষ ২০১'
  },
  {
    id: 'rout-math-1-02',
    departmentId: 'mathematics',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Monday',
    dayOfWeekBn: 'সোমবার',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    courseCode: 'MATH 1102',
    courseTitle: 'Computational Mathematics Lab [REPLACE]',
    courseTitleBn: 'কম্পিউটেশনাল গণিত ল্যাব',
    teacherName: 'Placeholder Instructor 8 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ৮ [প্রকৃত নাম দিন]',
    room: 'Science Lab 205 [REPLACE]',
    roomBn: 'বিজ্ঞান ল্যাব ২০৫'
  },

  // --- Fisheries (Semester 1) ---
  {
    id: 'rout-fish-1-01',
    departmentId: 'fisheries',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Monday',
    dayOfWeekBn: 'সোমবার',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    courseCode: 'FISH 1101',
    courseTitle: 'Ichthyology & Fish Anatomy [REPLACE]',
    courseTitleBn: 'ইকথায়োলজি ও মৎস্য শারীরস্থান',
    teacherName: 'Placeholder Instructor 9 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ৯ [প্রকৃত নাম দিন]',
    room: 'Life Science Room 101 [REPLACE]',
    roomBn: 'লাইফ সায়েন্স কক্ষ ১০১'
  },
  {
    id: 'rout-fish-1-02',
    departmentId: 'fisheries',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Wednesday',
    dayOfWeekBn: 'বুধবার',
    startTime: '01:30 PM',
    endTime: '04:30 PM',
    courseCode: 'FISH 1102',
    courseTitle: 'Fish Anatomy & Dissection Sessional [REPLACE]',
    courseTitleBn: 'মাছের অঙ্গসংস্থান ল্যাব',
    teacherName: 'Placeholder Instructor 9 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ৯ [প্রকৃত নাম দিন]',
    room: 'Life Science Lab 115 [REPLACE]',
    roomBn: 'লাইফ সায়েন্স ল্যাব ১১৫'
  },

  // --- Geology (Semester 1) ---
  {
    id: 'rout-geol-1-01',
    departmentId: 'geology',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Monday',
    dayOfWeekBn: 'সোমবার',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    courseCode: 'GEOL 1101',
    courseTitle: 'Physical Geology & Earth Dynamics [REPLACE]',
    courseTitleBn: 'ভৌত ভূতত্ত্ব ও ভূ-প্রক্রিয়া',
    teacherName: 'Placeholder Instructor 10 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ১০ [প্রকৃত নাম দিন]',
    room: 'Earth Science Room 201 [REPLACE]',
    roomBn: 'আর্থ সায়েন্স কক্ষ ২০১'
  },
  {
    id: 'rout-geol-1-02',
    departmentId: 'geology',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Thursday',
    dayOfWeekBn: 'বৃহস্পতিবার',
    startTime: '01:30 PM',
    endTime: '04:30 PM',
    courseCode: 'GEOL 1102',
    courseTitle: 'Mineral Identification & Optical Microscopy Lab [REPLACE]',
    courseTitleBn: 'খনিজ শিলা বিশ্লেষণ ল্যাব',
    teacherName: 'Placeholder Instructor 11 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ১১ [প্রকৃত নাম দিন]',
    room: 'Earth Science Lab 215 [REPLACE]',
    roomBn: 'আর্থ সায়েন্স ল্যাব ২১৫'
  },

  // --- Management (Semester 1) ---
  {
    id: 'rout-mgmt-1-01',
    departmentId: 'management',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Tuesday',
    dayOfWeekBn: 'মঙ্গলবার',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    courseCode: 'MGMT 1101',
    courseTitle: 'Principles of Management & Organization [REPLACE]',
    courseTitleBn: 'ব্যবস্থাপনার মূলনীতি ও সংগঠন',
    teacherName: 'Placeholder Instructor 12 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ১২ [প্রকৃত নাম দিন]',
    room: 'Business Room 301 [REPLACE]',
    roomBn: 'ব্যবসায় কক্ষ ৩০১'
  },
  {
    id: 'rout-mgmt-1-02',
    departmentId: 'management',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Wednesday',
    dayOfWeekBn: 'বুধবার',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    courseCode: 'BUS 1103',
    courseTitle: 'Business Mathematics & Statistics [REPLACE]',
    courseTitleBn: 'ব্যবসায়িক গণিত ও পরিসংখ্যান',
    teacherName: 'Placeholder Instructor 13 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ১৩ [প্রকৃত নাম দিন]',
    room: 'Business Room 301 [REPLACE]',
    roomBn: 'ব্যবসায় কক্ষ ৩০১'
  },

  // --- Social Work (Semester 1) ---
  {
    id: 'rout-sw-1-01',
    departmentId: 'social-work',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Wednesday',
    dayOfWeekBn: 'বুধবার',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    courseCode: 'SW 1101',
    courseTitle: 'Introduction to Social Work & Social Welfare [REPLACE]',
    courseTitleBn: 'সমাজকর্ম ও সমাজকল্যাণ পরিচিতি',
    teacherName: 'Placeholder Instructor 14 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ১৪ [প্রকৃত নাম দিন]',
    room: 'Social Science Room 201 [REPLACE]',
    roomBn: 'সমাজবিজ্ঞান কক্ষ ২০১'
  },
  {
    id: 'rout-sw-1-02',
    departmentId: 'social-work',
    semester: 1,
    semesterName: '1st Year 1st Semester',
    semesterNameBn: '১ম বর্ষ ১ম সেমিস্টার',
    section: 'A',
    dayOfWeek: 'Thursday',
    dayOfWeekBn: 'বৃহস্পতিবার',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    courseCode: 'SOC 1103',
    courseTitle: 'Bangladesh Society & Social Structure [REPLACE]',
    courseTitleBn: 'বাংলাদেশের সমাজ ও সামাজিক কাঠামো',
    teacherName: 'Placeholder Instructor 15 [REPLACE WITH REAL CONTENT]',
    teacherNameBn: 'প্রশিক্ষক ১৫ [প্রকৃত নাম দিন]',
    room: 'Social Science Room 201 [REPLACE]',
    roomBn: 'সমাজবিজ্ঞান কক্ষ ২০১'
  }
];
