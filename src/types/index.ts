export type Language = 'en' | 'bn';

export type NoticeCategory =
  | 'Academic'
  | 'Exam'
  | 'Admission'
  | 'Scholarship'
  | 'Administration'
  | 'Emergency';

export interface Notice {
  id: string;
  title: string;
  titleBn: string;
  category: NoticeCategory;
  publishDate: string; // ISO format
  publishDateBn: string;
  summary: string;
  summaryBn: string;
  body: string;
  bodyBn: string;
  department?: string;
  departmentBn?: string;
  referenceNumber: string;
  attachmentUrl?: string;
  status: 'published' | 'draft' | 'archived';
  isImportant?: boolean;
}

export interface UniversityEvent {
  id: string;
  title: string;
  titleBn: string;
  date: string;
  time: string;
  timeBn: string;
  location: string;
  locationBn: string;
  category: 'Conference' | 'Workshop' | 'Seminar' | 'Cultural' | 'Sports';
  description: string;
  descriptionBn: string;
  organizer: string;
}

export interface DepartmentInfo {
  id: string; // 'cse', 'eee', etc.
  code: string; // 'CSE'
  name: string;
  nameBn: string;
  faculty: string;
  facultyBn: string;
  established: number;
  degreesOffered: string[];
  degreesOfferedBn: string[];
  headOfDepartment: {
    name: string;
    designation: string;
    email: string;
  };
  overview: string;
  overviewBn: string;
  stats: {
    facultyCount: number;
    studentCount: number;
    labCount: number;
    alumniCount: number;
  };
  researchAreas: string[];
  facilities: string[];
}

export interface FacultyInfo {
  id: string;
  name: string;
  nameBn: string;
  deanName: string;
  deanNameBn: string;
  departmentCodes: string[];
  description: string;
  descriptionBn: string;
}

export interface OfficeInfo {
  id: string;
  name: string;
  nameBn: string;
  officerInCharge: string;
  designation: string;
  email: string;
  phone: string;
  location: string;
  responsibilities: string[];
  responsibilitiesBn: string[];
}

export interface UniversityStat {
  id: string;
  label: string;
  labelBn: string;
  value: string;
  valueBn: string;
  description: string;
  descriptionBn: string;
}

export interface ResearchCluster {
  id: string;
  title: string;
  titleBn: string;
  leadDepartment: string;
  leadFaculty: string;
  description: string;
  descriptionBn: string;
  ongoingProjects: number;
  publicationsCount: number;
}

export interface CareerOpening {
  id: string;
  title: string;
  titleBn: string;
  type: 'Faculty' | 'Officer' | 'Staff';
  departmentOrOffice: string;
  deadline: string;
  deadlineBn: string;
  circularNo: string;
  vacancyCount: number;
  status: 'Open' | 'Closed';
}

export interface FAQItem {
  question: string;
  questionBn: string;
  answer: string;
  answerBn: string;
  category: string;
}

export interface UniversityNewsItem {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  categoryBn: string;
  date: string;
  dateBn: string;
  summary: string;
  summaryBn: string;
  imageUrl: string;
  readTime: string;
  readTimeBn: string;
}

export interface PhotoGalleryItem {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  categoryBn: string;
  imageUrl: string;
  caption: string;
  captionBn: string;
}

export interface UniversityAuthority {
  id: string;
  roleKey: 'vc' | 'provc' | 'treasurer' | 'registrar';
  roleTitle: string;
  roleTitleBn: string;
  name: string;
  nameBn: string;
  designation: string;
  designationBn: string;
  email: string;
  phone: string;
  officeLocation: string;
  officeLocationBn: string;
  avatarUrl: string;
  profileBio: string;
  profileBioBn: string;
  speech?: string;
  speechBn?: string;
}

export interface CitizensCharterService {
  slNo: number;
  serviceName: string;
  serviceNameBn: string;
  serviceType: string;
  serviceTypeBn: string;
  responsibleOffice: string;
  responsibleOfficeBn: string;
  deliveryTime: string;
  deliveryTimeBn: string;
  feeAmount: string;
  feeAmountBn: string;
  procedure: string;
  procedureBn: string;
}
