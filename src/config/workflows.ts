/**
 * JSTU Smart Campus — Paperless Application Workflow Configurations
 * 
 * IMPORTANT: Institutional approval chains and requirements must be confirmed
 * with JSTU Administrative Secretariat, Controller of Examinations, and Office of Registrar.
 * 
 * Application Types:
 * 1. Transcript request
 * 2. Certificate request
 * 3. Testimonial
 * 4. Leave application
 * 5. Course withdrawal
 * 6. Scholarship
 * 7. Clearance
 * 8. Exam permission
 */

export type ApplicationType =
  | 'transcript'
  | 'certificate'
  | 'testimonial'
  | 'leave'
  | 'course_withdrawal'
  | 'scholarship'
  | 'clearance'
  | 'exam_permission';

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'RETURNED_FOR_CORRECTION'
  | 'APPROVED'
  | 'REJECTED';

export type ApproverRole =
  | 'dept_chairman'
  | 'exam_controller'
  | 'registrar'
  | 'account_officer'
  | 'library_officer';

export interface WorkflowStepConfig {
  stepIndex: number;
  role: ApproverRole;
  title: string;
  titleBn: string;
  departmentScoped?: boolean; // e.g. chairman only acts for their department
  officeScoped?: string;      // e.g. 'REGISTRAR', 'EXAM_CONTROLLER'
}

export interface ApplicationFieldConfig {
  name: string;
  label: string;
  labelBn: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'select';
  options?: { value: string; label: string; labelBn: string }[];
  placeholder?: string;
  required: boolean;
  helpText?: string;
  helpTextBn?: string;
}

export interface WorkflowDefinition {
  type: ApplicationType;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  chain: WorkflowStepConfig[];
  fields: ApplicationFieldConfig[];
  attachmentRequired?: boolean;
  allowedAttachmentTypes?: string[];
  maxAttachmentSizeBytes?: number; // e.g. 5MB
}

export const WORKFLOW_CONFIGS: Record<ApplicationType, WorkflowDefinition> = {
  transcript: {
    type: 'transcript',
    title: 'Official Academic Transcript Request',
    titleBn: 'অফিসিয়াল একাডেমিক ট্রান্সক্রিপ্ট আবেদন',
    description: 'Request for official academic grade transcript issued by the Controller of Examinations and verified by Registrar.',
    descriptionBn: 'পরীক্ষা নিয়ন্ত্রক দপ্তর কর্তৃক অফিসিয়াল ট্রান্সক্রিপ্ট উত্তোলনের জন্য আবেদন।',
    chain: [
      { stepIndex: 0, role: 'dept_chairman', title: 'Department Chairman', titleBn: 'বিভাগীয় চেয়ারম্যান', departmentScoped: true },
      { stepIndex: 1, role: 'exam_controller', title: 'Controller of Examinations', titleBn: 'পরীক্ষা নিয়ন্ত্রক', officeScoped: 'EXAM_CONTROLLER' },
      { stepIndex: 2, role: 'registrar', title: 'Registrar', titleBn: 'রেজিস্ট্রার', officeScoped: 'REGISTRAR' }
    ],
    fields: [
      {
        name: 'transcriptType',
        label: 'Transcript Scope',
        labelBn: 'ট্রান্সক্রিপ্টের ধরন',
        type: 'select',
        required: true,
        options: [
          { value: 'complete', label: 'Complete 4-Year Undergraduate Degree Transcript', labelBn: 'সম্পূর্ণ ৪ বছরের স্নাতক ডিগ্রি ট্রান্সক্রিপ্ট' },
          { value: 'partial', label: 'Partial Semester Transcript (Up to completed term)', labelBn: 'আংশিক সেমিস্টার ট্রান্সক্রিপ্ট (সমাপ্ত টার্ম পর্যন্ত)' }
        ]
      },
      {
        name: 'copiesCount',
        label: 'Number of Official Copies',
        labelBn: 'কপির সংখ্যা',
        type: 'number',
        required: true,
        placeholder: 'e.g. 2'
      },
      {
        name: 'purpose',
        label: 'Purpose of Request',
        labelBn: 'আবেদনের উদ্দেশ্য',
        type: 'textarea',
        required: true,
        placeholder: 'e.g. Higher studies application at foreign university / Employment verification...'
      },
      {
        name: 'deliveryMode',
        label: 'Delivery Mode',
        labelBn: 'গ্রহণ পদ্ধতি',
        type: 'select',
        required: true,
        options: [
          { value: 'counter', label: 'Counter Pickup from Controller Office', labelBn: 'পরীক্ষা নিয়ন্ত্রক অফিস কাউন্টার থেকে গ্রহণ' },
          { value: 'postal', label: 'Registered Postal Courier (Bangladesh)', labelBn: 'নিবন্ধিত ডাকযোগে প্রেরণ (বাংলাদেশ)' }
        ]
      }
    ],
    attachmentRequired: false,
    allowedAttachmentTypes: ['application/pdf'],
    maxAttachmentSizeBytes: 5 * 1024 * 1024
  },

  certificate: {
    type: 'certificate',
    title: 'Original / Provisional Degree Certificate',
    titleBn: 'মূল / সাময়িক সনদপত্র উত্তোলন আবেদন',
    description: 'Application for official degree parchment following academic clearance and convocation approval.',
    descriptionBn: 'স্নাতক ডিগ্রি সমাপনান্তে মূল অথবা সাময়িক সনদপত্র উত্তোলনের আবেদন।',
    chain: [
      { stepIndex: 0, role: 'dept_chairman', title: 'Department Chairman', titleBn: 'বিভাগীয় চেয়ারম্যান', departmentScoped: true },
      { stepIndex: 1, role: 'exam_controller', title: 'Controller of Examinations', titleBn: 'পরীক্ষা নিয়ন্ত্রক', officeScoped: 'EXAM_CONTROLLER' },
      { stepIndex: 2, role: 'registrar', title: 'Registrar', titleBn: 'রেজিস্ট্রার', officeScoped: 'REGISTRAR' }
    ],
    fields: [
      {
        name: 'certificateCategory',
        label: 'Certificate Type',
        labelBn: 'সনদের ধরন',
        type: 'select',
        required: true,
        options: [
          { value: 'provisional', label: 'Provisional Certificate', labelBn: 'সাময়িক সনদপত্র' },
          { value: 'original', label: 'Original Degree Parchment', labelBn: 'মূল সনদপত্র' }
        ]
      },
      {
        name: 'passingYear',
        label: 'Passing Session / Year',
        labelBn: 'পাসের সেশন / বছর',
        type: 'text',
        required: true,
        placeholder: 'e.g. 2025-2026'
      },
      {
        name: 'reason',
        label: 'Justification / Purpose',
        labelBn: 'উদ্দেশ্য',
        type: 'textarea',
        required: true,
        placeholder: 'Official reason for certificate issuance...'
      }
    ],
    attachmentRequired: true,
    allowedAttachmentTypes: ['application/pdf'],
    maxAttachmentSizeBytes: 5 * 1024 * 1024
  },

  testimonial: {
    type: 'testimonial',
    title: 'Character & Academic Testimonial',
    titleBn: 'চারিত্রিক ও একাডেমিক প্রশংসাপত্র আবেদন',
    description: 'Official departmental conduct, character, and academic achievement endorsement from Department Chairman.',
    descriptionBn: 'বিভাগীয় প্রধান কর্তৃক চারিত্রিক ও একাডেমিক প্রশংসাপত্র প্রাপ্তির আবেদন।',
    chain: [
      { stepIndex: 0, role: 'dept_chairman', title: 'Department Chairman', titleBn: 'বিভাগীয় চেয়ারম্যান', departmentScoped: true }
    ],
    fields: [
      {
        name: 'purpose',
        label: 'Reason for Testimonial',
        labelBn: 'প্রশংসাপত্র উত্তোলনের কারণ',
        type: 'select',
        required: true,
        options: [
          { value: 'job', label: 'Job / Employment Application', labelBn: 'চাকরির আবেদন' },
          { value: 'internship', label: 'Industrial Attachment / Internship', labelBn: 'ইন্টার্নশিপ / ইন্ডাস্ট্রিয়াল এটাচমেন্ট' },
          { value: 'scholarship', label: 'External Scholarship / Fellowship', labelBn: 'স্কলারশিপ / ফেলোশিপ' },
          { value: 'higher_study', label: 'Post-Graduate Admissions', labelBn: 'উচ্চশিক্ষা ভর্তি' }
        ]
      },
      {
        name: 'extraActivities',
        label: 'Co-curricular / Leadership Achievements',
        labelBn: 'সহশিক্ষা ও নেতৃত্বের বিবরণ (যদি থাকে)',
        type: 'textarea',
        required: false,
        placeholder: 'Programming contest participation, club executive role, IEEE branch lead...'
      }
    ],
    attachmentRequired: false,
    allowedAttachmentTypes: ['application/pdf'],
    maxAttachmentSizeBytes: 5 * 1024 * 1024
  },

  leave: {
    type: 'leave',
    title: 'Student Leave of Absence',
    titleBn: 'ছুটির আবেদন (অনুপস্থিতির ছুটি)',
    description: 'Formal leave request for medical illness, bereavement, or authorized university representation.',
    descriptionBn: 'চিকিৎসা বা পারিবারিক কারণে ক্লাসে অনুপস্থিতির জন্য অগ্রিম বা পরবর্তী ছুটির আবেদন।',
    chain: [
      { stepIndex: 0, role: 'dept_chairman', title: 'Department Chairman', titleBn: 'বিভাগীয় চেয়ারম্যান', departmentScoped: true }
    ],
    fields: [
      {
        name: 'leaveType',
        label: 'Leave Category',
        labelBn: 'ছুটির ধরন',
        type: 'select',
        required: true,
        options: [
          { value: 'medical', label: 'Medical Illness (Sick Leave)', labelBn: 'অসুস্থতাজনিত ছুটি (মেডিকেল)' },
          { value: 'family', label: 'Urgent Family Emergency / Bereavement', labelBn: 'জরুরি পারিবারিক কারণ' },
          { value: 'academic_event', label: 'University Authorized Representation / Sports', labelBn: 'বিশ্ববিদ্যালয় প্রতিনিধি / খেলাধুলা' }
        ]
      },
      {
        name: 'startDate',
        label: 'From Date',
        labelBn: 'শুরুর তারিখ',
        type: 'date',
        required: true
      },
      {
        name: 'endDate',
        label: 'To Date',
        labelBn: 'শেষের তারিখ',
        type: 'date',
        required: true
      },
      {
        name: 'reason',
        label: 'Detailed Reason for Absence',
        labelBn: 'ছুটির বিস্তারিত কারণ',
        type: 'textarea',
        required: true,
        placeholder: 'Explain circumstances and medical diagnosis if applicable...'
      }
    ],
    attachmentRequired: false,
    allowedAttachmentTypes: ['application/pdf'],
    maxAttachmentSizeBytes: 5 * 1024 * 1024
  },

  course_withdrawal: {
    type: 'course_withdrawal',
    title: 'Course Dropping / Withdrawal Request',
    titleBn: 'কোর্স প্রত্যাহার (ড্রপ) আবেদন',
    description: 'Formal application to drop a course before semester deadline as per JSTU academic regulations.',
    descriptionBn: 'সেমিস্টার অর্ডিন্যান্স অনুযায়ী নির্দিষ্ট সময়সীমার মধ্যে কোর্স ড্রপের আবেদন।',
    chain: [
      { stepIndex: 0, role: 'dept_chairman', title: 'Department Chairman', titleBn: 'বিভাগীয় চেয়ারম্যান', departmentScoped: true },
      { stepIndex: 1, role: 'exam_controller', title: 'Controller of Examinations', titleBn: 'পরীক্ষা নিয়ন্ত্রক', officeScoped: 'EXAM_CONTROLLER' }
    ],
    fields: [
      {
        name: 'courseCode',
        label: 'Course to Withdraw',
        labelBn: 'প্রত্যাহারযোগ্য কোর্স',
        type: 'select',
        required: true,
        options: [
          { value: 'CSE-3201', label: 'CSE-3201: Compiler Design (3.0 Cr)', labelBn: 'সিএসই-৩২০১: কম্পাইলার ডিজাইন' },
          { value: 'CSE-3203', label: 'CSE-3203: Computer Networks (3.0 Cr)', labelBn: 'সিএসই-৩২০৩: কম্পিউটার নেটওয়ার্কস' },
          { value: 'CSE-3205', label: 'CSE-3205: Software Engineering (3.0 Cr)', labelBn: 'সিএসই-৩২০৫: সফটওয়্যার ইঞ্জিনিয়ারিং' },
          { value: 'CSE-3207', label: 'CSE-3207: Artificial Intelligence (3.0 Cr)', labelBn: 'সিএসই-৩২০৭: এআই' }
        ]
      },
      {
        name: 'reason',
        label: 'Academic Grounds for Withdrawal',
        labelBn: 'প্রত্যাহারের কারণ',
        type: 'textarea',
        required: true,
        placeholder: 'Credit overload, course prerequisite sequencing, prolonged sickness...'
      }
    ],
    attachmentRequired: false,
    allowedAttachmentTypes: ['application/pdf'],
    maxAttachmentSizeBytes: 5 * 1024 * 1024
  },

  scholarship: {
    type: 'scholarship',
    title: 'Merit Scholarship / Tuition Stipend Application',
    titleBn: 'মেধাবৃত্তি ও শিক্ষাবৃত্তি আবেদন',
    description: 'Institutional scholarship application for academic distinction or financial need allowance.',
    descriptionBn: 'একাডেমিক ফলাফল বা আর্থিক প্রয়োজনে বিশ্ববিদ্যালয়ের অভ্যন্তরীণ শিক্ষাবৃত্তি আবেদন।',
    chain: [
      { stepIndex: 0, role: 'dept_chairman', title: 'Department Chairman', titleBn: 'বিভাগীয় চেয়ারম্যান', departmentScoped: true },
      { stepIndex: 1, role: 'registrar', title: 'Registrar', titleBn: 'রেজিস্ট্রার', officeScoped: 'REGISTRAR' }
    ],
    fields: [
      {
        name: 'scholarshipType',
        label: 'Scholarship Category',
        labelBn: 'বৃত্তির ধরন',
        type: 'select',
        required: true,
        options: [
          { value: 'dean_merit', label: 'Dean Honor / Board Merit Stipend', labelBn: 'ডিনস মেরিট বৃত্তি' },
          { value: 'need_based', label: 'Vice-Chancellor Special Financial Aid', labelBn: 'উপাচার্য বিশেষ আর্থিক সহায়তা' },
          { value: 'freedom_fighter', label: 'Freedom Fighter Ward Stipend', labelBn: 'মুক্তিযোদ্ধা সন্তান ভাতা' }
        ]
      },
      {
        name: 'currentCgpa',
        label: 'Latest Published CGPA',
        labelBn: 'সর্বশেষ সিজিপিএ',
        type: 'text',
        required: true,
        placeholder: 'e.g. 3.82'
      },
      {
        name: 'annualIncome',
        label: 'Guardian Annual Income (BDT)',
        labelBn: 'অভিভাবকের বার্ষিক আয় (টাকা)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 180000'
      },
      {
        name: 'statement',
        label: 'Statement of Need & Merit',
        labelBn: 'বৃত্তির যৌক্তিকতা ও বিবরণ',
        type: 'textarea',
        required: true,
        placeholder: 'Detail your academic background and financial circumstances...'
      }
    ],
    attachmentRequired: true,
    allowedAttachmentTypes: ['application/pdf'],
    maxAttachmentSizeBytes: 5 * 1024 * 1024
  },

  clearance: {
    type: 'clearance',
    title: 'University Paperless Clearance Sign-Off',
    titleBn: 'বিশ্ববিদ্যালয় কেন্দ্রীয় ছাড়পত্র (ক্লিয়ারেন্স)',
    description: 'Comprehensive sign-off chain for final semester graduation, library returns, hall dues, and registrar discharge.',
    descriptionBn: 'গ্র্যাজুয়েশন ও চূড়ান্ত ছাড়পত্রের জন্য বিভাগীয়, গ্রন্থাগার ও কেন্দ্রীয় ছাড়পত্র।',
    chain: [
      { stepIndex: 0, role: 'dept_chairman', title: 'Department Chairman', titleBn: 'বিভাগীয় চেয়ারম্যান', departmentScoped: true },
      { stepIndex: 1, role: 'exam_controller', title: 'Controller of Examinations', titleBn: 'পরীক্ষা নিয়ন্ত্রক', officeScoped: 'EXAM_CONTROLLER' },
      { stepIndex: 2, role: 'registrar', title: 'Registrar', titleBn: 'রেজিস্ট্রার', officeScoped: 'REGISTRAR' }
    ],
    fields: [
      {
        name: 'clearanceReason',
        label: 'Clearance Purpose',
        labelBn: 'ছাড়পত্রের উদ্দেশ্য',
        type: 'select',
        required: true,
        options: [
          { value: 'graduation', label: 'Final Graduation & Degree Awarding', labelBn: 'স্নাতক সমাপন ও ডিগ্রি গ্রহণ' },
          { value: 'migration', label: 'Migration / University Transfer', labelBn: 'মাইগ্রেশন / বিশ্ববিদ্যালয় পরিবর্তন' }
        ]
      },
      {
        name: 'declaration',
        label: 'Student Dues Declaration',
        labelBn: 'বকেয়া সংক্রান্ত ঘোষণা',
        type: 'textarea',
        required: true,
        placeholder: 'Confirm all hall keys, library books, and lab instruments have been deposited...'
      }
    ],
    attachmentRequired: false,
    allowedAttachmentTypes: ['application/pdf'],
    maxAttachmentSizeBytes: 5 * 1024 * 1024
  },

  exam_permission: {
    type: 'exam_permission',
    title: 'Special Semester Final Exam Permission',
    titleBn: 'বিশেষ পরীক্ষা অনুমতিপত্র আবেদন',
    description: 'Permission to sit for final examinations with condoned attendance or special retake accommodations.',
    descriptionBn: 'উপস্থিতির বিশেষ মার্জনা অথবা বিশেষ রিটেক পরীক্ষার অনুমোদনের জন্য আবেদন।',
    chain: [
      { stepIndex: 0, role: 'dept_chairman', title: 'Department Chairman', titleBn: 'বিভাগীয় চেয়ারম্যান', departmentScoped: true },
      { stepIndex: 1, role: 'exam_controller', title: 'Controller of Examinations', titleBn: 'পরীক্ষা নিয়ন্ত্রক', officeScoped: 'EXAM_CONTROLLER' }
    ],
    fields: [
      {
        name: 'examinationTitle',
        label: 'Examination Name & Session',
        labelBn: 'পরীক্ষার নাম ও সেশন',
        type: 'text',
        required: true,
        placeholder: 'e.g. 6th Semester Final Examination (Fall 2026)'
      },
      {
        name: 'permissionReason',
        label: 'Grounds for Special Permission',
        labelBn: 'বিশেষ অনুমতির কারণ',
        type: 'select',
        required: true,
        options: [
          { value: 'attendance_condonation', label: 'Attendance Condonation (Medical grounds 60-74%)', labelBn: 'উপস্থিতির বিশেষ মার্জনা (মেডিকেল কারণ ৬০-৭৪%)' },
          { value: 'special_retake', label: 'Special Retake / Improvement Assessment', labelBn: 'বিশেষ রিটেক / মানোন্নয়ন পরীক্ষা' },
          { value: 'admit_lost', label: 'Duplicate Admit Card Clearance', labelBn: 'ডুপ্লিকেট প্রবেশপত্র ছাড়পত্র' }
        ]
      },
      {
        name: 'justification',
        label: 'Circumstances & Explanations',
        labelBn: 'পরিস্থিতির ব্যাখ্যা',
        type: 'textarea',
        required: true,
        placeholder: 'Provide detailed medical or academic context...'
      }
    ],
    attachmentRequired: false,
    allowedAttachmentTypes: ['application/pdf'],
    maxAttachmentSizeBytes: 5 * 1024 * 1024
  }
};
