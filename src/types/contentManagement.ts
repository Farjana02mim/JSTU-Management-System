import { NoticeCategory } from './index';
import { NewsCategory, EventCategory, GalleryCategory, DownloadCategory } from './publicSections';

export type ContentStatus = 'draft' | 'published' | 'archived';

export type ContentSectionKey =
  | 'notices'
  | 'news'
  | 'events'
  | 'gallery'
  | 'downloads'
  | 'departments'
  | 'faculty'
  | 'vc_message'
  | 'static_pages';

export interface ManagedNoticeItem {
  id: string;
  title: string;
  titleBn: string;
  category: NoticeCategory;
  publishDate: string; // ISO / YYYY-MM-DD
  publishDateBn: string;
  summary: string;
  summaryBn: string;
  body: string; // Markdown safe
  bodyBn: string;
  department?: string;
  departmentBn?: string;
  referenceNumber: string;
  attachmentUrl?: string;
  isImportant?: boolean;
  status: ContentStatus;
  updatedAt: string;
  updatedBy?: string;
}

export interface ManagedNewsItem {
  id: string;
  title: string;
  titleBn: string;
  category: NewsCategory;
  categoryBn: string;
  date: string;
  dateBn: string;
  summary: string;
  summaryBn: string;
  content: string; // Markdown safe
  contentBn: string;
  imageUrl: string;
  author: string;
  readTime: string;
  readTimeBn: string;
  tags: string[];
  featured?: boolean;
  status: ContentStatus;
  updatedAt: string;
  updatedBy?: string;
}

export interface ManagedEventItem {
  id: string;
  title: string;
  titleBn: string;
  category: EventCategory;
  categoryBn: string;
  date: string;
  dateBn: string;
  time: string;
  timeBn: string;
  venue: string;
  venueBn: string;
  organizer: string;
  organizerBn: string;
  summary: string;
  summaryBn: string;
  description: string; // Markdown safe
  descriptionBn: string;
  imageUrl: string;
  eventStatus: 'upcoming' | 'ongoing' | 'past';
  chiefGuest?: string;
  chiefGuestBn?: string;
  registrationUrl?: string;
  agenda?: { time: string; activity: string; activityBn?: string; speaker?: string }[];
  status: ContentStatus;
  updatedAt: string;
  updatedBy?: string;
}

export interface ManagedGalleryItem {
  id: string;
  title: string;
  titleBn: string;
  category: GalleryCategory;
  categoryBn: string;
  album: string;
  albumBn: string;
  imageUrl: string;
  caption: string; // Markdown safe
  captionBn: string;
  date: string;
  status: ContentStatus;
  updatedAt: string;
  updatedBy?: string;
}

export interface ManagedDownloadItem {
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
  description: string; // Markdown safe
  descriptionBn: string;
  downloadUrl?: string;
  status: ContentStatus;
  updatedAt: string;
  updatedBy?: string;
}

export interface ManagedDepartmentItem {
  id: string; // 'cse', 'eee', etc.
  code: string; // 'CSE'
  name: string;
  nameBn: string;
  faculty: string;
  facultyBn: string;
  established: number;
  degreesOffered?: string[];
  degreesOfferedBn?: string[];
  overview: string; // Markdown safe
  overviewBn: string;
  mission?: string;
  missionBn?: string;
  vision?: string;
  visionBn?: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  locationBn: string;
  facilities: string[];
  researchAreas: string[];
  bannerUrl?: string;
  stats: {
    facultyCount: number;
    studentCount: number;
    labCount: number;
    alumniCount: number;
  };
  headOfDepartment: {
    name: string;
    designation: string;
    email: string;
  };
  status: ContentStatus;
  updatedAt: string;
  updatedBy?: string;
}

export interface ManagedFacultyItem {
  id: string;
  departmentId: string; // 'cse', 'eee', etc.
  name: string;
  nameBn: string;
  designation: string;
  designationBn: string;
  email: string;
  phone: string;
  room: string;
  roomBn: string;
  avatarUrl: string;
  degrees: string[];
  degreesBn: string[];
  researchInterests: string[];
  researchInterestsBn: string[];
  bio: string; // Markdown safe
  bioBn: string;
  isChairman?: boolean;
  publications?: string[];
  status: ContentStatus;
  updatedAt: string;
  updatedBy?: string;
}

export interface ManagedVcMessageItem {
  id: string; // 'vc_message'
  title: string;
  titleBn: string;
  vcName: string;
  vcNameBn: string;
  designation: string;
  designationBn: string;
  email: string;
  phone: string;
  officeLocation: string;
  officeLocationBn: string;
  avatarUrl: string;
  speech: string; // Markdown safe
  speechBn: string;
  quote: string;
  quoteBn: string;
  status: ContentStatus;
  updatedAt: string;
  updatedBy?: string;
}

export interface ManagedStaticPageItem {
  id: string;
  slug: string;
  title: string;
  titleBn: string;
  category: 'About' | 'Policy' | 'Campus' | 'Institutional';
  content: string; // Markdown safe
  contentBn: string;
  metaDescription?: string;
  bannerUrl?: string;
  status: ContentStatus;
  updatedAt: string;
  updatedBy?: string;
}

export interface ContentAuditEntry {
  id: string;
  contentId: string;
  contentType: ContentSectionKey;
  contentTitle: string;
  action: 'CREATED' | 'UPDATED' | 'PUBLISHED' | 'ARCHIVED' | 'DRAFTED' | 'DELETED';
  actorUid: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  actorDepartment?: string;
  timestamp: string; // ISO
  changesSummary: string;
  previousStatus?: ContentStatus;
  newStatus?: ContentStatus;
}
