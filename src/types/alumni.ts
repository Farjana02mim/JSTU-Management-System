export interface AlumniPrivacySettings {
  showEmail: boolean;
  showPhone: boolean;
  showCurrentCompany: boolean;
  showDesignation: boolean;
  showCityCountry: boolean;
  showLinkedin: boolean;
}

export type OrganizationType =
  | 'Tech'
  | 'Civil Service'
  | 'Academia & Research'
  | 'Financial & Banking'
  | 'Multinational'
  | 'Entrepreneurship'
  | 'Other';

export interface AlumnusProfile {
  id: string;
  name: string;
  nameBn: string;
  studentId: string;
  departmentCode: string; // 'CSE', 'EEE', 'MATH', etc.
  departmentName: string;
  degree: string;
  batch: string; // e.g. "1st Batch (2012-13)"
  graduatedYear: number;
  currentPosition: string;
  currentPositionBn?: string;
  organization: string;
  organizationType: OrganizationType;
  country: string;
  city: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  avatar?: string;
  privacy: AlumniPrivacySettings;
  isApproved: boolean;
  isSpotlight?: boolean;
  spotlightStory?: string;
  spotlightStoryBn?: string;
  spotlightQuote?: string;
  spotlightQuoteBn?: string;
  registeredAt: string;
}

export interface AlumniRegistrationRequest {
  id: string;
  fullName: string;
  fullNameBn?: string;
  studentId: string;
  department: string;
  departmentCode: string;
  batch: string;
  graduationYear: number;
  degree: string;
  email: string;
  phone: string;
  currentCompany: string;
  designation: string;
  organizationType: OrganizationType;
  country: string;
  city: string;
  linkedinUrl?: string;
  bio?: string;
  privacy: AlumniPrivacySettings;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AlumniJobPost {
  id: string;
  title: string;
  titleBn?: string;
  company: string;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Remote' | 'Internship' | 'Contract';
  departmentTarget: string[]; // e.g. ['CSE', 'EEE', 'All']
  experienceLevel: 'Entry-level' | 'Mid-level' | 'Senior' | 'Executive';
  description: string;
  requirements: string[];
  salaryRange?: string;
  postedByAlumnusId: string;
  postedByAlumnusName: string;
  postedByAlumnusBatch: string;
  postedByAlumnusDesignation: string;
  contactEmail: string;
  applyUrl?: string;
  deadline: string;
  status: 'ACTIVE' | 'CLOSED';
  createdAt: string;
}

export type DonationCause =
  | 'student_scholarships'
  | 'campus_greenery'
  | 'robotics_lab'
  | 'hall_student_welfare'
  | 'medical_emergency_fund';

export interface AlumniDonation {
  id: string;
  receiptNo: string; // e.g. "JSTU-DON-2026-1049"
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  isAlumnus: boolean;
  alumnusBatch?: string;
  alumnusDept?: string;
  cause: DonationCause;
  causeTitle: string;
  causeTitleBn?: string;
  amount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Card';
  transactionId: string;
  status: 'COMPLETED';
  message?: string;
  isAnonymous: boolean;
  donatedAt: string;
}
