export type ScholarshipCategory = 'Merit' | 'Need-Based' | 'Special' | 'District-Quota';
export type ScholarshipStatus = 'OPEN' | 'UNDER_REVIEW' | 'PUBLISHED' | 'CLOSED';

export interface Scholarship {
  id: string;
  title: string;
  titleBn: string;
  category: ScholarshipCategory;
  description: string;
  descriptionBn: string;
  amount: number;
  amountFormatted: string;
  amountFormattedBn: string;
  eligibility: string[];
  eligibilityBn: string[];
  minimumCgpa: number;
  maxFamilyIncome?: number; // Annual income ceiling in BDT
  deadline: string; // ISO date
  slots: number; // Max awardee slots
  status: ScholarshipStatus;
  publishedAt?: string;
  publishedRecipients?: {
    studentId: string;
    studentName: string;
    studentNameBn?: string;
    department: string;
    cgpa: number;
    rank: number;
    awardAmount: string;
  }[];
  createdAt: string;
}

export interface IncomeRuleConfig {
  cgpaWeight: number; // e.g. 0.6 (60%)
  incomeWeight: number; // e.g. 0.4 (40%)
  maxIncomeCeiling: number; // e.g. 300000 BDT
}

export interface RankedScholarshipApplicant {
  applicationId: string;
  applicationNumber: string;
  studentId: string;
  studentName: string;
  studentNameBn?: string;
  department: string;
  cgpa: number;
  annualIncome: number;
  appliedDate: string;
  workflowStatus: string;
  currentStepIndex: number;
  compositeScore: number;
  rank: number;
  selectionStatus: 'SELECTED' | 'WAITLIST' | 'INELIGIBLE';
}
