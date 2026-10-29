import {
  EvaluationWindow,
  AnonymousCourseEvaluation,
  EvaluationSubmissionRecord
} from '../types/evaluation';

export const initialEvaluationWindows: EvaluationWindow[] = [
  {
    id: 'win-fall-2026',
    title: 'Fall 2026 Course & Faculty Evaluation Window',
    titleBn: 'ফল ২০২৬ কোর্স ও শিক্ষক মূল্যায়ন উইন্ডো',
    semester: 'Fall 2026 (5th/6th Semester)',
    academicSession: '2023-2024',
    status: 'Closed',
    startDate: '2026-09-01T00:00:00Z',
    endDate: '2026-10-15T23:59:59Z',
    createdBy: 'Institutional Quality Assurance Cell (IQAC)',
    createdAt: '2026-08-25T10:00:00Z',
    closedAt: '2026-10-16T00:00:00Z'
  },
  {
    id: 'win-current-2026',
    title: 'Current Semester Undergraduate Evaluation Window',
    titleBn: 'চলতি সেমিস্টার আন্ডারগ্র্যাজুয়েট মূল্যায়ন উইন্ডো',
    semester: 'Spring/Summer 2026 (6th Semester)',
    academicSession: '2023-2024',
    status: 'Open',
    startDate: '2026-10-20T00:00:00Z',
    endDate: '2026-11-20T23:59:59Z',
    createdBy: 'Institutional Quality Assurance Cell (IQAC)',
    createdAt: '2026-10-18T09:00:00Z'
  }
];

export const initialAnonymousEvaluations: AnonymousCourseEvaluation[] = [
  // --- CSE-3201 (Dr. Shahadat Hossain) in win-fall-2026: 14 responses (>=5 threshold met) ---
  {
    id: 'eval-cse3201-01',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3201',
    courseTitle: 'Operating Systems & System Architecture',
    courseTitleBn: 'অপারেটিং সিস্টেমস ও সিস্টেম আর্কিটেকচার',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 5, punctuality: 5, engagement: 4, practicals: 5, fairness: 5, overall: 5 },
    averageScore: 4.83,
    comment: 'Exceptional explanation of kernel thread scheduling and memory paging. The xv6 lab code walkthroughs made complex operating systems topics intuitive.',
    submittedAt: '2026-09-12T11:20:00Z'
  },
  {
    id: 'eval-cse3201-02',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3201',
    courseTitle: 'Operating Systems & System Architecture',
    courseTitleBn: 'অপারেটিং সিস্টেমস ও সিস্টেম আর্কিটেকচার',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 5, punctuality: 4, engagement: 5, practicals: 4, fairness: 4, overall: 4 },
    averageScore: 4.33,
    comment: 'Punctual and highly responsive during lab hours. Would appreciate more sample questions before midterms.',
    submittedAt: '2026-09-14T14:10:00Z'
  },
  {
    id: 'eval-cse3201-03',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3201',
    courseTitle: 'Operating Systems & System Architecture',
    courseTitleBn: 'অপারেটিং সিস্টেমস ও সিস্টেম আর্কিটেকচার',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 4, punctuality: 5, engagement: 4, practicals: 5, fairness: 5, overall: 5 },
    averageScore: 4.67,
    comment: 'Very fair grading on continuous assessment. The feedback on our shell programming assignment helped identify race conditions.',
    submittedAt: '2026-09-15T09:30:00Z'
  },
  {
    id: 'eval-cse3201-04',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3201',
    courseTitle: 'Operating Systems & System Architecture',
    courseTitleBn: 'অপারেটিং সিস্টেমস ও সিস্টেম আর্কিটেকচার',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 5, punctuality: 5, engagement: 5, practicals: 4, fairness: 4, overall: 5 },
    averageScore: 4.5,
    comment: 'Great balance of theory and Linux kernel implementation exercises.',
    submittedAt: '2026-09-18T16:00:00Z'
  },
  {
    id: 'eval-cse3201-05',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3201',
    courseTitle: 'Operating Systems & System Architecture',
    courseTitleBn: 'অপারেটিং সিস্টেমস ও সিস্টেম আর্কিটেকচার',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 4, punctuality: 4, engagement: 4, practicals: 4, fairness: 5, overall: 4 },
    averageScore: 4.17,
    comment: 'Clear slides and recommended reading bibliography provided on time.',
    submittedAt: '2026-09-20T10:45:00Z'
  },
  {
    id: 'eval-cse3201-06',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3201',
    courseTitle: 'Operating Systems & System Architecture',
    courseTitleBn: 'অপারেটিং সিস্টেমস ও সিস্টেম আর্কিটেকচার',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 5, punctuality: 5, engagement: 5, practicals: 5, fairness: 4, overall: 5 },
    averageScore: 4.83,
    submittedAt: '2026-09-22T13:15:00Z'
  },
  {
    id: 'eval-cse3201-07',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3201',
    courseTitle: 'Operating Systems & System Architecture',
    courseTitleBn: 'অপারেটিং সিস্টেমস ও সিস্টেম আর্কিটেকচার',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 4, punctuality: 5, engagement: 4, practicals: 4, fairness: 5, overall: 4 },
    averageScore: 4.33,
    submittedAt: '2026-09-25T11:00:00Z'
  },
  {
    id: 'eval-cse3201-08',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3201',
    courseTitle: 'Operating Systems & System Architecture',
    courseTitleBn: 'অপারেটিং সিস্টেমস ও সিস্টেম আর্কিটেকচার',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 5, punctuality: 4, engagement: 5, practicals: 5, fairness: 5, overall: 5 },
    averageScore: 4.83,
    comment: 'The virtual memory simulator homework was one of the best computing assignments I have done.',
    submittedAt: '2026-09-28T15:30:00Z'
  },
  {
    id: 'eval-cse3201-09',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3201',
    courseTitle: 'Operating Systems & System Architecture',
    courseTitleBn: 'অপারেটিং সিস্টেমস ও সিস্টেম আর্কিটেকচার',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 4, punctuality: 4, engagement: 4, practicals: 4, fairness: 4, overall: 4 },
    averageScore: 4.0,
    submittedAt: '2026-10-01T12:00:00Z'
  },
  {
    id: 'eval-cse3201-10',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3201',
    courseTitle: 'Operating Systems & System Architecture',
    courseTitleBn: 'অপারেটিং সিস্টেমস ও সিস্টেম আর্কিটেকচার',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 5, punctuality: 5, engagement: 5, practicals: 5, fairness: 5, overall: 5 },
    averageScore: 5.0,
    comment: 'Dr. Shahadat encourages analytical thinking and always clarifies student doubts patiently.',
    submittedAt: '2026-10-04T09:10:00Z'
  },
  {
    id: 'eval-cse3201-11',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3201',
    courseTitle: 'Operating Systems & System Architecture',
    courseTitleBn: 'অপারেটিং সিস্টেমস ও সিস্টেম আর্কিটেকচার',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 5, punctuality: 5, engagement: 4, practicals: 4, fairness: 4, overall: 4 },
    averageScore: 4.33,
    submittedAt: '2026-10-06T14:40:00Z'
  },
  {
    id: 'eval-cse3201-12',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3201',
    courseTitle: 'Operating Systems & System Architecture',
    courseTitleBn: 'অপারেটিং সিস্টেমস ও সিস্টেম আর্কিটেকচার',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 4, punctuality: 4, engagement: 5, practicals: 5, fairness: 4, overall: 5 },
    averageScore: 4.5,
    submittedAt: '2026-10-08T16:20:00Z'
  },
  {
    id: 'eval-cse3201-13',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3201',
    courseTitle: 'Operating Systems & System Architecture',
    courseTitleBn: 'অপারেটিং সিস্টেমস ও সিস্টেম আর্কিটেকচার',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 5, punctuality: 5, engagement: 5, practicals: 4, fairness: 5, overall: 5 },
    averageScore: 4.83,
    comment: 'Excellent professor.',
    submittedAt: '2026-10-10T11:15:00Z'
  },
  {
    id: 'eval-cse3201-14',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3201',
    courseTitle: 'Operating Systems & System Architecture',
    courseTitleBn: 'অপারেটিং সিস্টেমস ও সিস্টেম আর্কিটেকচার',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 5, punctuality: 4, engagement: 4, practicals: 5, fairness: 5, overall: 5 },
    averageScore: 4.67,
    submittedAt: '2026-10-12T10:00:00Z'
  },

  // --- CSE-3205 (Dr. Shahadat Hossain) in win-fall-2026: 11 responses (>=5 threshold met) ---
  {
    id: 'eval-cse3205-01',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3205',
    courseTitle: 'Compiler Design & Construction',
    courseTitleBn: 'কম্পাইলার ডিজাইন ও কনস্ট্রাকশন',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 4, punctuality: 5, engagement: 4, practicals: 4, fairness: 4, overall: 4 },
    averageScore: 4.17,
    comment: 'Lexer and parser generator grammar rules were taught clearly.',
    submittedAt: '2026-09-10T10:00:00Z'
  },
  {
    id: 'eval-cse3205-02',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3205',
    courseTitle: 'Compiler Design & Construction',
    courseTitleBn: 'কম্পাইলার ডিজাইন ও কনস্ট্রাকশন',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 5, punctuality: 4, engagement: 4, practicals: 5, fairness: 4, overall: 4 },
    averageScore: 4.33,
    submittedAt: '2026-09-12T14:00:00Z'
  },
  {
    id: 'eval-cse3205-03',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3205',
    courseTitle: 'Compiler Design & Construction',
    courseTitleBn: 'কম্পাইলার ডিজাইন ও কনস্ট্রাকশন',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 4, punctuality: 4, engagement: 4, practicals: 4, fairness: 4, overall: 4 },
    averageScore: 4.0,
    submittedAt: '2026-09-15T09:00:00Z'
  },
  {
    id: 'eval-cse3205-04',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3205',
    courseTitle: 'Compiler Design & Construction',
    courseTitleBn: 'কম্পাইলার ডিজাইন ও কনস্ট্রাকশন',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 5, punctuality: 5, engagement: 5, practicals: 5, fairness: 4, overall: 5 },
    averageScore: 4.83,
    comment: 'The intermediate code generation project in LLVM was fantastic for career preparation.',
    submittedAt: '2026-09-18T11:00:00Z'
  },
  {
    id: 'eval-cse3205-05',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3205',
    courseTitle: 'Compiler Design & Construction',
    courseTitleBn: 'কম্পাইলার ডিজাইন ও কনস্ট্রাকশন',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 4, punctuality: 4, engagement: 4, practicals: 4, fairness: 4, overall: 4 },
    averageScore: 4.0,
    submittedAt: '2026-09-22T15:00:00Z'
  },
  {
    id: 'eval-cse3205-06',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3205',
    courseTitle: 'Compiler Design & Construction',
    courseTitleBn: 'কম্পাইলার ডিজাইন ও কনস্ট্রাকশন',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 5, punctuality: 4, engagement: 4, practicals: 4, fairness: 5, overall: 4 },
    averageScore: 4.33,
    submittedAt: '2026-09-25T16:00:00Z'
  },
  {
    id: 'eval-cse3205-07',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3205',
    courseTitle: 'Compiler Design & Construction',
    courseTitleBn: 'কম্পাইলার ডিজাইন ও কনস্ট্রাকশন',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 4, punctuality: 5, engagement: 5, practicals: 5, fairness: 4, overall: 5 },
    averageScore: 4.67,
    comment: 'Helpful consultation hours when we were debugging semantic analysis AST visitors.',
    submittedAt: '2026-09-29T10:00:00Z'
  },
  {
    id: 'eval-cse3205-08',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3205',
    courseTitle: 'Compiler Design & Construction',
    courseTitleBn: 'কম্পাইলার ডিজাইন ও কনস্ট্রাকশন',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 4, punctuality: 4, engagement: 4, practicals: 4, fairness: 4, overall: 4 },
    averageScore: 4.0,
    submittedAt: '2026-10-02T13:00:00Z'
  },
  {
    id: 'eval-cse3205-09',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3205',
    courseTitle: 'Compiler Design & Construction',
    courseTitleBn: 'কম্পাইলার ডিজাইন ও কনস্ট্রাকশন',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 5, punctuality: 5, engagement: 4, practicals: 4, fairness: 5, overall: 5 },
    averageScore: 4.67,
    submittedAt: '2026-10-05T14:00:00Z'
  },
  {
    id: 'eval-cse3205-10',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3205',
    courseTitle: 'Compiler Design & Construction',
    courseTitleBn: 'কম্পাইলার ডিজাইন ও কনস্ট্রাকশন',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 4, punctuality: 4, engagement: 4, practicals: 4, fairness: 4, overall: 4 },
    averageScore: 4.0,
    submittedAt: '2026-10-08T15:00:00Z'
  },
  {
    id: 'eval-cse3205-11',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3205',
    courseTitle: 'Compiler Design & Construction',
    courseTitleBn: 'কম্পাইলার ডিজাইন ও কনস্ট্রাকশন',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 5, punctuality: 5, engagement: 5, practicals: 5, fairness: 5, overall: 5 },
    averageScore: 5.0,
    submittedAt: '2026-10-12T16:00:00Z'
  },

  // --- CSE-1101 (Dr. Shahadat Hossain) in win-fall-2026: ONLY 3 responses (< 5 threshold) ---
  // Demonstrates the IQAC privacy threshold rule (< 5 responses = results sealed/protected)
  {
    id: 'eval-cse1101-01',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-1101',
    courseTitle: 'Structured Programming in C',
    courseTitleBn: 'সি প্রোগ্রামিং ফান্ডামেন্টালস',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 5, punctuality: 5, engagement: 4, practicals: 5, fairness: 5, overall: 5 },
    averageScore: 4.83,
    comment: 'Good programming basics.',
    submittedAt: '2026-09-14T09:00:00Z'
  },
  {
    id: 'eval-cse1101-02',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-1101',
    courseTitle: 'Structured Programming in C',
    courseTitleBn: 'সি প্রোগ্রামিং ফান্ডামেন্টালস',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 4, punctuality: 4, engagement: 4, practicals: 4, fairness: 4, overall: 4 },
    averageScore: 4.0,
    submittedAt: '2026-09-18T10:00:00Z'
  },
  {
    id: 'eval-cse1101-03',
    windowId: 'win-fall-2026',
    courseCode: 'CSE-1101',
    courseTitle: 'Structured Programming in C',
    courseTitleBn: 'সি প্রোগ্রামিং ফান্ডামেন্টালস',
    departmentId: 'CSE',
    departmentName: 'Computer Science & Engineering',
    teacherId: 'demo_teacher_01',
    teacherName: 'Dr. Shahadat Hossain',
    teacherNameBn: 'ড. শাহাদাত হোসেন',
    ratings: { preparation: 5, punctuality: 4, engagement: 5, practicals: 4, fairness: 4, overall: 4 },
    averageScore: 4.33,
    submittedAt: '2026-09-22T11:00:00Z'
  },

  // --- Other Departments in win-fall-2026 for rich University-Wide Recharts ---
  // EEE-2101
  ...Array.from({ length: 12 }).map((_, i) => ({
    id: `eval-eee2101-${i + 1}`,
    windowId: 'win-fall-2026',
    courseCode: 'EEE-2101',
    courseTitle: 'Analog Electronics & Semiconductor Devices',
    courseTitleBn: 'অ্যানালগ ইলেকট্রনিক্স ও সেমিকন্ডাক্টর ডিভাইস',
    departmentId: 'EEE',
    departmentName: 'Electrical & Electronic Engineering',
    teacherId: 'prof_eee_01',
    teacherName: 'Dr. Mostafizur Rahman',
    teacherNameBn: 'ড. মোস্তাফিজুর রহমান',
    ratings: {
      preparation: 4 + (i % 2),
      punctuality: 4,
      engagement: 3 + (i % 3),
      practicals: 4 + (i % 2),
      fairness: 4,
      overall: 4 + (i % 2)
    },
    averageScore: 4.25,
    comment: i === 0 ? 'Circuit simulation software was demonstrated thoroughly.' : undefined,
    submittedAt: '2026-09-15T12:00:00Z'
  })),

  // MATH-1101
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `eval-math1101-${i + 1}`,
    windowId: 'win-fall-2026',
    courseCode: 'MATH-1101',
    courseTitle: 'Differential and Integral Calculus',
    courseTitleBn: 'ক্যালকুলাস ও ডিফারেনশিয়াল সমীকরণ',
    departmentId: 'MATH',
    departmentName: 'Mathematics',
    teacherId: 'prof_math_01',
    teacherName: 'Dr. Harun-ur-Rashid',
    teacherNameBn: 'ড. হারুন-উর-রশিদ',
    ratings: {
      preparation: 4,
      punctuality: 5,
      engagement: 4,
      practicals: 3 + (i % 2),
      fairness: 4 + (i % 2),
      overall: 4
    },
    averageScore: 4.1,
    comment: i === 1 ? 'Step by step derivation on whiteboard was very helpful.' : undefined,
    submittedAt: '2026-09-20T10:00:00Z'
  })),

  // FISH-2101
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `eval-fish2101-${i + 1}`,
    windowId: 'win-fall-2026',
    courseCode: 'FISH-2101',
    courseTitle: 'Aquaculture Principles & Water Quality Management',
    courseTitleBn: 'অ্যাকোয়াকালচার নীতিমালা ও জলজ বাস্তুতন্ত্র',
    departmentId: 'FISH',
    departmentName: 'Fisheries & Marine Science',
    teacherId: 'prof_fish_01',
    teacherName: 'Dr. Anowar Hossain',
    teacherNameBn: 'ড. আনোয়ার হোসেন',
    ratings: { preparation: 5, punctuality: 4, engagement: 4, practicals: 5, fairness: 4, overall: 5 },
    averageScore: 4.45,
    submittedAt: '2026-09-22T14:00:00Z'
  })),

  // GEOL-3101
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: `eval-geol3101-${i + 1}`,
    windowId: 'win-fall-2026',
    courseCode: 'GEOL-3101',
    courseTitle: 'Structural Geology & Tectonics of Bengal Basin',
    courseTitleBn: 'স্ট্রাকচারাল ভূতত্ত্ব ও বেঙ্গল বেসিন টেকটোনিক্স',
    departmentId: 'GEOL',
    departmentName: 'Geology & Mining',
    teacherId: 'prof_geol_01',
    teacherName: 'Dr. Farhana Yasmin',
    teacherNameBn: 'ড. ফারহানা ইয়াসমিন',
    ratings: { preparation: 4, punctuality: 5, engagement: 4, practicals: 4, fairness: 5, overall: 4 },
    averageScore: 4.33,
    submittedAt: '2026-09-25T11:00:00Z'
  })),

  // MGT-1101
  ...Array.from({ length: 13 }).map((_, i) => ({
    id: `eval-mgt1101-${i + 1}`,
    windowId: 'win-fall-2026',
    courseCode: 'MGT-1101',
    courseTitle: 'Principles of Management & Organizational Behavior',
    courseTitleBn: 'ব্যবস্থাপনা নীতিমালা ও প্রাতিষ্ঠানিক আচরণ',
    departmentId: 'MGT',
    departmentName: 'Management',
    teacherId: 'prof_mgt_01',
    teacherName: 'Dr. Mizanur Rahman',
    teacherNameBn: 'ড. মিজানুর রহমান',
    ratings: { preparation: 5, punctuality: 5, engagement: 5, practicals: 4, fairness: 4, overall: 5 },
    averageScore: 4.62,
    submittedAt: '2026-09-28T09:00:00Z'
  })),

  // SOC-2101
  ...Array.from({ length: 9 }).map((_, i) => ({
    id: `eval-soc2101-${i + 1}`,
    windowId: 'win-fall-2026',
    courseCode: 'SOC-2101',
    courseTitle: 'Social Policy, Welfare & Community Development',
    courseTitleBn: 'সামাজিক নীতি, কল্যাণ ও সম্প্রদায় উন্নয়ন',
    departmentId: 'SOC',
    departmentName: 'Social Work',
    teacherId: 'prof_soc_01',
    teacherName: 'Dr. Nazma Begum',
    teacherNameBn: 'ড. নাজমা বেগম',
    ratings: { preparation: 5, punctuality: 4, engagement: 5, practicals: 4, fairness: 5, overall: 5 },
    averageScore: 4.55,
    submittedAt: '2026-10-02T13:00:00Z'
  }))
];

/**
 * Separate one-time submission ledger:
 * Contains only (windowId, courseCode, studentId, submittedAt).
 * Deliberately stored detached from the anonymous ratings!
 */
export const initialSubmissionLedger: EvaluationSubmissionRecord[] = [
  // For demo student Tanvir Ahmed (JSTU2026001):
  // win-current-2026: CSE-3205 is already submitted (tests already-submitted state)
  // CSE-3201 and CSE-3207 are unsubmitted (tests live submission flow!)
  {
    windowId: 'win-current-2026',
    courseCode: 'CSE-3205',
    studentId: 'JSTU2026001',
    submittedAt: '2026-10-22T10:00:00Z'
  },
  // In win-fall-2026 (closed window), student submitted all courses
  {
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3201',
    studentId: 'JSTU2026001',
    submittedAt: '2026-09-12T11:20:00Z'
  },
  {
    windowId: 'win-fall-2026',
    courseCode: 'CSE-3205',
    studentId: 'JSTU2026001',
    submittedAt: '2026-09-10T10:00:00Z'
  }
];
