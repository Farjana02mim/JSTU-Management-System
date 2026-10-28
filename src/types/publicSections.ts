// ============================================================================
// Public University Modules Types
// /* [REPLACE WITH REAL CONTENT] Official JSTU Public Sections Data Models */
// ============================================================================

export type NewsCategory =
  | 'Academic'
  | 'Campus Life'
  | 'Research'
  | 'Achievements'
  | 'Administrative'
  | 'Technology';

export interface UniversityNewsArticle {
  id: string;
  title: string;
  titleBn: string;
  category: NewsCategory;
  categoryBn: string;
  date: string; // YYYY-MM-DD
  dateBn: string;
  summary: string;
  summaryBn: string;
  content: string[]; // multi-paragraph
  contentBn: string[];
  imageUrl: string;
  author: string;
  readTime: string;
  readTimeBn: string;
  tags: string[];
  featured?: boolean;
}

export type EventCategory =
  | 'Conference'
  | 'Workshop'
  | 'Seminar'
  | 'Cultural'
  | 'National';

export interface UniversityEventItem {
  id: string;
  title: string;
  titleBn: string;
  category: EventCategory;
  categoryBn: string;
  date: string; // YYYY-MM-DD
  dateBn: string;
  time: string;
  timeBn: string;
  venue: string;
  venueBn: string;
  organizer: string;
  organizerBn: string;
  summary: string;
  summaryBn: string;
  description: string;
  descriptionBn: string;
  imageUrl: string;
  status: 'upcoming' | 'ongoing' | 'past';
  chiefGuest?: string;
  chiefGuestBn?: string;
  agenda?: { time: string; activity: string; activityBn?: string; speaker?: string }[];
  registrationUrl?: string;
}

export type GalleryCategory =
  | 'Architecture'
  | 'Laboratories'
  | 'Campus Grounds'
  | 'Events & Convocations'
  | 'Student Life';

export interface UniversityGalleryImage {
  id: string;
  title: string;
  titleBn: string;
  category: GalleryCategory;
  categoryBn: string;
  album: string;
  albumBn: string;
  imageUrl: string;
  caption: string;
  captionBn: string;
  date: string;
}

export type DownloadCategory =
  | 'academic_forms'
  | 'ordinances'
  | 'financial_forms'
  | 'circulars'
  | 'research_forms';

export interface UniversityDownloadItem {
  id: string;
  title: string;
  titleBn: string;
  category: DownloadCategory;
  categoryLabel: string;
  categoryLabelBn: string;
  fileType: 'PDF' | 'DOCX' | 'ZIP';
  fileSize: string;
  publishedDate: string;
  publishedDateBn: string;
  refNumber: string;
  description: string;
  descriptionBn: string;
}

export type OpportunityType = 'job' | 'tender';

export interface CareerTenderItem {
  id: string;
  opportunityType: OpportunityType;
  title: string;
  titleBn: string;
  category: string;
  categoryBn: string;
  refNumber: string;
  departmentOrOffice: string;
  departmentOrOfficeBn: string;
  publishDate: string;
  publishDateBn: string;
  deadline: string;
  deadlineBn: string;
  status: 'active' | 'closed';
  vacancies?: number;
  budgetBDT?: string;
  eligibilitySummary: string;
  eligibilitySummaryBn: string;
  fullRequirements?: string[];
  pdfAttachments: {
    title: string;
    titleBn: string;
    fileSize: string;
    fileName: string;
  }[];
}

export interface ResearchPublication {
  id: string;
  title: string;
  authors: string[];
  departmentCode: string;
  departmentName: string;
  journalName: string;
  year: number;
  doi: string;
  indexedIn: 'IEEE Xplore' | 'Scopus' | 'Springer Nature' | 'Elsevier' | 'ACM';
  abstract: string;
  citations: number;
  pdfAvailable: boolean;
}

export interface JournalIssue {
  volume: string;
  issue: string;
  year: number;
  month: string;
  coverImage: string;
  issnPrint: string;
  issnOnline: string;
  editorInChief: string;
  editorialBoardCount: number;
  publishedArticlesCount: number;
  editorialBoard: { name: string; designation: string; institution: string }[];
}

export interface ResearchGrantScheme {
  id: string;
  title: string;
  titleBn: string;
  fundingBody: string;
  fundingBodyBn: string;
  grantRange: string;
  grantRangeBn: string;
  deadline: string;
  deadlineBn: string;
  description: string;
  descriptionBn: string;
}
