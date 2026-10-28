import { z } from 'zod';

// ============================================================================
// Admission Domain Models & Zod Schemas
// /* [REPLACE WITH REAL CONTENT] Official JSTU Central Admission Architecture */
// ============================================================================

export type AdmissionUnit = 'UNIT_A' | 'UNIT_B' | 'UNIT_C';

export type AdmissionQuota =
  | 'NONE'
  | 'FREEDOM_FIGHTER'
  | 'TRIBAL_ETHNIC'
  | 'DISABILITY'
  | 'WARD';

export type AdmissionApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'APPROVED'
  | 'REJECTED';

// --- Zod Schemas ---

export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { message: 'Full name in English must be at least 3 characters.' })
    .max(100, { message: 'Full name cannot exceed 100 characters.' }),
  fullNameBn: z
    .string()
    .trim()
    .min(3, { message: 'Full name in Bengali is required.' })
    .max(100, { message: 'Bengali name cannot exceed 100 characters.' }),
  fatherName: z
    .string()
    .trim()
    .min(3, { message: "Father's name is required." })
    .max(100, { message: "Father's name cannot exceed 100 characters." }),
  fatherNameBn: z.string().trim().optional(),
  motherName: z
    .string()
    .trim()
    .min(3, { message: "Mother's name is required." })
    .max(100, { message: "Mother's name cannot exceed 100 characters." }),
  motherNameBn: z.string().trim().optional(),
  dateOfBirth: z
    .string()
    .min(1, { message: 'Date of birth is required.' })
    .refine((dob) => !isNaN(Date.parse(dob)), { message: 'Invalid date format.' }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    error: 'Please select a gender.'
  }),
  bloodGroup: z.string().min(1, { message: 'Please select blood group.' }),
  religion: z.string().min(1, { message: 'Religion is required.' }),
  nationalIdOrBirthCert: z
    .string()
    .trim()
    .min(10, { message: 'NID or Birth Registration Certificate must be at least 10 digits.' })
    .max(20, { message: 'NID/Birth Certificate cannot exceed 20 characters.' }),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+880|01)[3-9]\d{8}$/, {
      message: 'Enter a valid Bangladeshi mobile number (e.g. 01712345678 or +8801712345678).'
    }),
  email: z
    .string()
    .trim()
    .email({ message: 'Enter a valid email address.' }),
  presentAddress: z
    .string()
    .trim()
    .min(10, { message: 'Present address must be at least 10 characters.' }),
  permanentAddress: z
    .string()
    .trim()
    .min(10, { message: 'Permanent address must be at least 10 characters.' }),
  quota: z.enum(['NONE', 'FREEDOM_FIGHTER', 'TRIBAL_ETHNIC', 'DISABILITY', 'WARD'])
});

export const academicInfoSchema = z.object({
  // SSC
  sscBoard: z.string().min(1, { message: 'SSC Board is required.' }),
  sscRoll: z
    .string()
    .trim()
    .regex(/^\d{6,8}$/, { message: 'SSC Roll must be 6 to 8 digits.' }),
  sscReg: z
    .string()
    .trim()
    .regex(/^\d{8,12}$/, { message: 'SSC Registration must be 8 to 12 digits.' }),
  sscPassingYear: z.coerce
    .number()
    .min(2020, { message: 'SSC passing year must be 2020 or later.' })
    .max(2024, { message: 'SSC passing year cannot exceed 2024.' }),
  sscGpa: z.coerce
    .number()
    .min(2.5, { message: 'Minimum SSC GPA requirement is 2.50.' })
    .max(5.0, { message: 'GPA cannot exceed 5.00.' }),
  sscGroup: z.string().min(1, { message: 'SSC Group is required.' }),

  // HSC
  hscBoard: z.string().min(1, { message: 'HSC Board is required.' }),
  hscRoll: z
    .string()
    .trim()
    .regex(/^\d{6,8}$/, { message: 'HSC Roll must be 6 to 8 digits.' }),
  hscReg: z
    .string()
    .trim()
    .regex(/^\d{8,12}$/, { message: 'HSC Registration must be 8 to 12 digits.' }),
  hscPassingYear: z.coerce
    .number()
    .min(2022, { message: 'HSC passing year must be 2022 or later.' })
    .max(2025, { message: 'HSC passing year cannot exceed 2025.' }),
  hscGpa: z.coerce
    .number()
    .min(2.5, { message: 'Minimum HSC GPA requirement is 2.50.' })
    .max(5.0, { message: 'GPA cannot exceed 5.00.' }),
  hscGroup: z.string().min(1, { message: 'HSC Group is required.' }),

  // Subject Grades
  hscMathGrade: z.string().optional(),
  hscPhysicsGrade: z.string().optional(),
  hscChemistryGrade: z.string().optional(),
  hscEnglishGrade: z.string().min(1, { message: 'HSC English grade is required.' }),
  hscBiologyGrade: z.string().optional()
});

export const programChoiceSchema = z
  .object({
    unit: z.enum(['UNIT_A', 'UNIT_B', 'UNIT_C'], {
      error: 'Please select an admission unit.'
    }),
    firstChoiceDept: z.string().min(1, { message: '1st choice department is required.' }),
    secondChoiceDept: z.string().min(1, { message: '2nd choice department is required.' }),
    thirdChoiceDept: z.string().min(1, { message: '3rd choice department is required.' })
  })
  .refine(
    (data) =>
      data.firstChoiceDept !== data.secondChoiceDept &&
      data.firstChoiceDept !== data.thirdChoiceDept &&
      data.secondChoiceDept !== data.thirdChoiceDept,
    {
      message: 'Please choose 3 different departments in priority order.',
      path: ['secondChoiceDept']
    }
  );

export interface AdmissionDocumentMeta {
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  dataUrl?: string; // base64 representation for preview & admit card photo
}

export interface AdmissionUploadedDocuments {
  applicantPhoto?: AdmissionDocumentMeta;
  applicantSignature?: AdmissionDocumentMeta;
  sscTranscript?: AdmissionDocumentMeta;
  hscTranscript?: AdmissionDocumentMeta;
  quotaCertificate?: AdmissionDocumentMeta;
}

export type AdmissionPersonalInfo = z.infer<typeof personalInfoSchema>;
export type AdmissionAcademicInfo = z.infer<typeof academicInfoSchema>;
export type AdmissionProgramChoice = z.infer<typeof programChoiceSchema>;

export interface AdmissionApplication {
  id: string;
  referenceNumber: string; // e.g. JSTU-ADM-2026-784912
  status: AdmissionApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  personalInfo: AdmissionPersonalInfo;
  academicInfo: AdmissionAcademicInfo;
  programChoice: AdmissionProgramChoice;
  documents: AdmissionUploadedDocuments;
  testRollNumber?: string;
  examVenue?: string;
  examDate?: string;
  examTime?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  admitCardIssued?: boolean;
  admitCardIssuedAt?: string;
  notes?: string[];
}

export interface AdmissionProgramOffering {
  id: string;
  departmentCode: string;
  departmentName: string;
  departmentNameBn: string;
  facultyName: string;
  facultyNameBn: string;
  unit: AdmissionUnit;
  degreeName: string;
  degreeLevel: 'Undergraduate' | 'Postgraduate';
  durationYears: number;
  totalSemesters: number;
  regularSeats: number;
  quotaSeats: number;
  minHscGpa: number;
  minCombinedGpa: number;
  requiredHscSubjects: string[];
}

export interface AdmissionFeeItem {
  category: string;
  categoryBn: string;
  amount: number;
  frequency: string;
  frequencyBn: string;
  description: string;
  descriptionBn: string;
}

export interface AdmissionImportantDate {
  event: string;
  eventBn: string;
  dateStr: string;
  dateStrBn: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  badge: string;
}

export interface AdmissionFaqItem {
  question: string;
  questionBn: string;
  answer: string;
  answerBn: string;
  category: 'general' | 'eligibility' | 'documents' | 'exam';
}
