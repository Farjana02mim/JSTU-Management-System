import {
  ManagedNoticeItem,
  ManagedNewsItem,
  ManagedEventItem,
  ManagedGalleryItem,
  ManagedDownloadItem,
  ManagedDepartmentItem,
  ManagedFacultyItem,
  ManagedVcMessageItem,
  ManagedStaticPageItem,
  ContentAuditEntry
} from '../types/contentManagement';
import { noticesSeedData, departmentsData, universityAuthoritiesData } from './seedData';
import {
  newsArticlesData,
  universityEventsData,
  galleryPhotosData,
  downloadsCatalogData
} from './publicSectionsSeedData';
import { departmentFacultyMembers } from './academicsSeedData';

export const initialManagedNotices: ManagedNoticeItem[] = noticesSeedData.map((n, idx) => ({
  id: n.id,
  title: n.title,
  titleBn: n.titleBn,
  category: n.category,
  publishDate: n.publishDate,
  publishDateBn: n.publishDateBn,
  summary: n.summary,
  summaryBn: n.summaryBn,
  body: n.body,
  bodyBn: n.bodyBn,
  department: n.department,
  departmentBn: n.departmentBn,
  referenceNumber: n.referenceNumber,
  attachmentUrl: n.attachmentUrl,
  isImportant: n.isImportant,
  status: idx < 8 ? 'published' : idx === 8 ? 'draft' : 'archived',
  updatedAt: n.publishDate || '2026-10-01T09:00:00Z',
  updatedBy: 'ICT Registrar'
}));

export const initialManagedNews: ManagedNewsItem[] = newsArticlesData.map((item, idx) => ({
  id: item.id,
  title: item.title,
  titleBn: item.titleBn,
  category: item.category,
  categoryBn: item.categoryBn,
  date: item.date,
  dateBn: item.dateBn,
  summary: item.summary,
  summaryBn: item.summaryBn,
  content: Array.isArray(item.content) ? item.content.join('\n\n') : String(item.content),
  contentBn: Array.isArray(item.contentBn) ? item.contentBn.join('\n\n') : String(item.contentBn),
  imageUrl: item.imageUrl,
  author: item.author,
  readTime: item.readTime,
  readTimeBn: item.readTimeBn,
  tags: item.tags,
  featured: item.featured,
  status: idx < 6 ? 'published' : idx === 6 ? 'draft' : 'archived',
  updatedAt: item.date || '2026-10-01T10:00:00Z',
  updatedBy: 'PR & Information Office'
}));

export const initialManagedEvents: ManagedEventItem[] = universityEventsData.map((evt, idx) => ({
  id: evt.id,
  title: evt.title,
  titleBn: evt.titleBn,
  category: evt.category,
  categoryBn: evt.categoryBn,
  date: evt.date,
  dateBn: evt.dateBn,
  time: evt.time,
  timeBn: evt.timeBn,
  venue: evt.venue,
  venueBn: evt.venueBn,
  organizer: evt.organizer,
  organizerBn: evt.organizerBn,
  summary: evt.summary,
  summaryBn: evt.summaryBn,
  description: evt.description || evt.summary,
  descriptionBn: evt.descriptionBn || evt.summaryBn,
  imageUrl: evt.imageUrl,
  eventStatus: evt.status,
  chiefGuest: evt.chiefGuest,
  chiefGuestBn: evt.chiefGuestBn,
  registrationUrl: evt.registrationUrl,
  status: idx < 6 ? 'published' : 'draft',
  updatedAt: evt.date || '2026-10-01T10:00:00Z',
  updatedBy: 'Student Welfare Directorate'
}));

export const initialManagedGallery: ManagedGalleryItem[] = galleryPhotosData.map((g, idx) => ({
  id: g.id,
  title: g.title,
  titleBn: g.titleBn,
  category: g.category,
  categoryBn: g.categoryBn,
  album: g.album,
  albumBn: g.albumBn,
  imageUrl: g.imageUrl,
  caption: g.caption,
  captionBn: g.captionBn,
  date: g.date,
  status: idx < 8 ? 'published' : 'draft',
  updatedAt: g.date || '2026-09-15T12:00:00Z',
  updatedBy: 'Campus Media Cell'
}));

export const initialManagedDownloads: ManagedDownloadItem[] = downloadsCatalogData.map((d, idx) => ({
  id: d.id,
  title: d.title,
  titleBn: d.titleBn,
  category: d.category,
  categoryLabel: d.categoryLabel,
  categoryLabelBn: d.categoryLabelBn,
  fileType: d.fileType,
  fileSize: d.fileSize,
  publishedDate: d.publishedDate,
  publishedDateBn: d.publishedDateBn,
  refNumber: d.refNumber,
  description: d.description,
  descriptionBn: d.descriptionBn,
  status: idx < 8 ? 'published' : 'draft',
  updatedAt: d.publishedDate || '2026-09-10T08:00:00Z',
  updatedBy: 'Registrar Publication Branch'
}));

export const initialManagedDepartments: ManagedDepartmentItem[] = departmentsData.map((dept) => ({
  id: dept.id.toLowerCase(),
  code: dept.code.toUpperCase(),
  name: dept.name,
  nameBn: dept.nameBn,
  faculty: dept.faculty,
  facultyBn: dept.facultyBn,
  established: dept.established,
  degreesOffered: dept.degreesOffered,
  degreesOfferedBn: dept.degreesOfferedBn,
  overview: dept.overview,
  overviewBn: dept.overviewBn,
  mission: 'To produce socially committed, technologically agile graduates through rigorous hands-on curriculum and research innovation.',
  missionBn: 'হাতে-কলমে শিক্ষা ও গবেষণার মাধ্যমে দক্ষ ও দায়িত্বশীল গ্র্যাজুয়েট তৈরি করা।',
  vision: 'To emerge as a premier national center of applied technological innovation, research incubation, and academic excellence by 2030.',
  visionBn: '২০৩০ সালের মধ্যে প্রায়োগিক প্রযুক্তি উদ্ভাবন ও একাডেমিক উৎকর্ষে জাতীয় শীর্ষ কেন্দ্র হিসেবে প্রতিষ্ঠিত হওয়া।',
  contactEmail: `${dept.id.toLowerCase()}@jstu.ac.bd`,
  contactPhone: '+880 29977 12350',
  location: 'Academic Complex, JSTU Campus, Jamalpur-2012',
  locationBn: 'একাডেমিক কমপ্লেক্স, জেএসটিইউ ক্যাম্পাস, জামালপুর-২০১২',
  facilities: dept.facilities || ['Central Computing Hub', 'IoT Prototyping Laboratory', 'Departmental Seminar Library'],
  researchAreas: dept.researchAreas || ['Applied AI', 'Wireless Networks', 'Embedded Systems'],
  bannerUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
  stats: dept.stats,
  headOfDepartment: dept.headOfDepartment,
  status: 'published',
  updatedAt: '2026-10-01T00:00:00Z',
  updatedBy: 'Academic Council'
}));

export const initialManagedFaculty: ManagedFacultyItem[] = departmentFacultyMembers.map((fac, idx) => ({
  id: fac.id,
  departmentId: fac.departmentId.toLowerCase(),
  name: fac.name,
  nameBn: fac.nameBn,
  designation: fac.designation,
  designationBn: fac.designationBn,
  email: fac.email,
  phone: fac.phone,
  room: fac.room,
  roomBn: fac.roomBn,
  avatarUrl: fac.avatarUrl,
  degrees: fac.degrees,
  degreesBn: fac.degreesBn,
  researchInterests: fac.researchInterests,
  researchInterestsBn: fac.researchInterestsBn,
  bio: `Distinguished faculty member in the Department of ${fac.departmentId.toUpperCase()} with active publications and student supervision. Specializing in ${fac.researchInterests.join(', ')}.`,
  bioBn: `${fac.departmentId.toUpperCase()} বিভাগের সম্মানিত শিক্ষক। গবেষণা ক্ষেত্র: ${fac.researchInterestsBn.join(', ')}।`,
  isChairman: fac.isChairman,
  publications: [
    'A Comparative Study on Bangla NLP Transformers, IEEE Access 2025.',
    'Scalable Cloud Architecture for Public Universities, ACM Computing Surveys 2024.'
  ],
  status: 'published',
  updatedAt: '2026-10-01T00:00:00Z',
  updatedBy: 'Department Chairman'
}));

const vcAuthority = universityAuthoritiesData.find((a) => a.roleKey === 'vc');

export const initialManagedVcMessage: ManagedVcMessageItem = {
  id: 'vc_message',
  title: 'Message from the Vice Chancellor',
  titleBn: 'উপাচার্যের বাণী',
  vcName: vcAuthority?.name || 'Prof. Dr. [REPLACE WITH REAL NAME]',
  vcNameBn: vcAuthority?.nameBn || 'অধ্যাপক ড. [প্রকৃত নাম প্রদান করুন]',
  designation: vcAuthority?.designation || 'Vice Chancellor, Jamalpur Science & Technology University',
  designationBn: vcAuthority?.designationBn || 'উপাচার্য, জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়',
  email: vcAuthority?.email || 'vc@jstu.ac.bd',
  phone: vcAuthority?.phone || '+880 29977 12340',
  officeLocation: vcAuthority?.officeLocation || 'Vice Chancellor Suite, Level 4, Administrative Building',
  officeLocationBn: vcAuthority?.officeLocationBn || 'উপাচার্য কার্যালয়, ৪র্থ তলা, প্রশাসনিক ভবন',
  avatarUrl: vcAuthority?.avatarUrl || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
  speech: `## Welcome to Jamalpur Science & Technology University (JSTU)

It gives me immense pride to welcome scholars, students, and visitors to the official institutional portal of **Jamalpur Science & Technology University**.

Situated along the historic banks of the Brahmaputra River in Jamalpur, Bangladesh, JSTU was established by parliament with a resolute mission: **to democratize cutting-edge STEM education, pioneer applied scientific investigations, and develop ethical, future-ready technological leaders.**

### Strategic Pillars of JSTU
1. **Paperless Governance:** 100% digitalized marks scrutiny, student fee clearance, and credential verifications.
2. **Industry-Aligned Curriculum:** Problem-based computing, smart aquaculture, geological exploration, and sustainable engineering.
3. **High-Speed Campus Infrastructure:** Dedicated optical fiber backbone, smart lecture halls, and automated central library commons.

> "True education is not merely the accumulation of facts, but the training of the mind to think critically and serve society with unshakeable integrity."

We warmly invite students, researchers, and global partners to collaborate with JSTU as we build a smarter, equitable Bangladesh.`,
  speechBn: `## জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ে (জেএসটিইউ) স্বাগতম

ঐতিহাসিক পুরাতন ব্রহ্মপুত্র নদের অববাহিকায় জামালপুর-২০১২ তে অবস্থিত জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (জেএসটিইউ)-এর প্রাতিষ্ঠানিক পোর্টালে আপনাদের সবাইকে আন্তরিক অভিনন্দন ও স্বাগতম।

একটি আধুনিক সরকারি উচ্চশিক্ষা ও গবেষণা প্রতিষ্ঠান হিসেবে জেএসটিইউ আন্তর্জাতিক মানের শিক্ষা, উদ্ভাবনী প্রায়োগিক বিজ্ঞান এবং সম্পূর্ণ পেপারলেস প্রশাসনিক কার্যক্রমে অঙ্গীকারবদ্ধ।

### জেএসটিইউ-এর কৌশলগত অগ্রাধিকার
১. **পেপারলেস স্মার্ট প্রশাসন:** ফলাফল নিরীক্ষণ, শিক্ষার্থীদের ফি ও সনদপত্র সম্পূর্ণ ডিজিটাল ব্যবস্থাপনায় পরিচালনা।
২. **আন্তর্জাতিক কারিকুলাম:** সময়োপযোগী সিএসই, ইইই, ফিশারিজ ও জিওলজি কারিকুলাম।
৩. **আধুনিক ক্যাম্পাস অবকাঠামো:** সার্বক্ষণিক অপটিক্যাল ফাইবার নেটওয়ার্ক, আধুনিক ল্যাব ও ডিজিটাল লাইব্রেরি রিসোর্স।

আমরা দেশ-বিদেশের গবেষক ও অংশীদারদের প্রতি আহ্বান জানাই একটি সমৃদ্ধ ও প্রযুক্তি-নির্ভর ভবিষ্যৎ নির্মাণে জেএসটিইউ-এর পাশে থাকার জন্য।`,
  quote: 'Fostering Scientific Rigor, Digital Integrity, and Transformative Higher Education.',
  quoteBn: 'বিজ্ঞানমনস্কতা, ডিজিটাল শুদ্ধাচার ও সমাজ রূপান্তরের আধুনিক উচ্চশিক্ষা।',
  status: 'published',
  updatedAt: '2026-10-01T08:00:00Z',
  updatedBy: 'super_admin'
};

export const initialManagedStaticPages: ManagedStaticPageItem[] = [
  {
    id: 'static-about',
    slug: 'about-us',
    title: 'About Jamalpur Science & Technology University',
    titleBn: 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় পরিচিতি',
    category: 'About',
    content: `## Institutional Overview

Jamalpur Science & Technology University (JSTU) was established under the Government Act with permanent grounds spanning over **65 acres** in Jamalpur-2012, Bangladesh.

### Core Objectives
- Imparting advanced higher education in engineering, computational sciences, and applied sciences.
- Providing specialized technological incubators for agro-industrial and riverine ecological advancement.
- Fostering public integrity and paperless governance for all institutional administrative operations.

### Key Campus Highlights
- **Location:** Old Brahmaputra Basin, Jamalpur-2012, Dhaka Division, Bangladesh.
- **Academic Programs:** 7 Undergraduate B.Sc. (Engg.) & M.Sc. degrees.
- **Fiber Backbone:** 10Gbps optical network covering student halls and laboratory pavilions.`,
    contentBn: `## প্রাতিষ্ঠানিক পরিচিতি

জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (জেএসটিইউ) গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের বিশেষ আইনবলে প্রতিষ্ঠিত একটি স্বনামধন্য সরকারি বিশ্ববিদ্যালয়।

### মূল লক্ষ্য ও উদ্দেশ্য
- প্রকৌশল, কম্পিউটার বিজ্ঞান ও ফলিত গবেষণায় যুগোপযোগী উচ্চশিক্ষা প্রদান।
- কৃষি, পরিবেশ ও ব্রহ্মপুত্র নদী অববাহিকার উন্নয়নমূলক গবেষণায় নেতৃত্ব দেওয়া।
- সম্পূর্ণ পেপারলেস ডিজিটাল ক্যাম্পাসের মাধ্যমে ছাত্রবান্ধব প্রশাসনিক সেবা নিশ্চিত করা।`,
    status: 'published',
    updatedAt: '2026-10-01T08:00:00Z',
    updatedBy: 'super_admin'
  },
  {
    id: 'static-code-conduct',
    slug: 'code-of-conduct',
    title: 'University Code of Conduct & Academic Integrity',
    titleBn: 'বিশ্ববিদ্যালয় আচরণবিধি ও একাডেমিক সততা নীতি',
    category: 'Policy',
    content: `## JSTU Code of Conduct & Ethics

All enrolled students, researchers, faculty, and administrative staff members are expected to maintain the highest levels of scholarly integrity and civil decorum.

### Student Conduct Directives
1. **Attendance:** A minimum of 75% attendance in theoretical and lab sessions is mandatory for semester final examination eligibility.
2. **Zero Tolerance for Ragging:** Campus and residential halls operate under strict zero-tolerance policies against harassment or bullying.
3. **Examination Ethics:** Plagiarism in code assignments or unauthorized materials in exam halls results in disciplinary committee review.

For complaints and confidential grievances, reach out directly to the Proctorial Body at \`proctor@jstu.ac.bd\`.`,
    contentBn: `## জেএসটিইউ আচরণবিধি ও নৈতিক নীতিমালা

সকল শিক্ষার্থী, গবেষক, শিক্ষক এবং কর্মকর্তা-কর্মচারীকে বিশ্ববিদ্যালয়ের নিয়মশৃঙ্খলা ও শিষ্টাচার কঠোরভাবে মেনে চলার নির্দেশনা দেওয়া হচ্ছে।

১. **উপস্থিতি:** সেমিস্টার ফাইনাল পরীক্ষায় অংশ নিতে ন্যূনতম ৭৫% উপস্থিতি বাধ্যতামূলক।
২. **র‌্যাগিং মুক্ত ক্যাম্পাস:** ক্যাম্পাস ও আবাসিক হলে যেকোনো ধরনের হেনস্তার বিরুদ্ধে শূন্য সহনশীলতা নীতি প্রযোজ্য।
৩. **পরীক্ষায় সততা:** অ্যাসাইনমেন্ট ও পরীক্ষায় অসদুপায় বা নকল সম্পূর্ণ নিষিদ্ধ।`,
    status: 'published',
    updatedAt: '2026-09-20T10:00:00Z',
    updatedBy: 'admin'
  },
  {
    id: 'static-vision-mission',
    slug: 'vision-and-mission',
    title: 'Vision, Mission and Strategic Roadmaps 2030',
    titleBn: 'ভিশন, মিশন ও কৌশলগত মহাপরিকল্পনা ২০৩০',
    category: 'Institutional',
    content: `## Vision & Mission 2030

### Our Vision
To be recognized regionally and globally as a top-tier science and technology research university known for innovative engineering solutions, sustainable environmental stewardship, and exemplary digital governance.

### Strategic Priorities
- Establishing 5 Advanced Research Centers (AI, Renewable Energy, Aquatic Genomics, IoT, Material Sciences).
- Fully automated student lifecycle from admissions to verifiable digital degrees.
- 100% residential accommodation for male and female undergraduate scholars.`,
    contentBn: `## ভিশন ও মিশন ২০৩০

### আমাদের ভিশন
প্রকৌশল উদ্ভাবন, পরিবেশবান্ধব গবেষণা এবং অনুকরণীয় ডিজিটাল প্রশাসনে আন্তর্জাতিক মানের বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় হিসেবে প্রতিষ্ঠিত হওয়া।`,
    status: 'published',
    updatedAt: '2026-09-15T10:00:00Z',
    updatedBy: 'super_admin'
  }
];

export const initialContentAuditTrail: ContentAuditEntry[] = [
  {
    id: 'audit-001',
    contentId: 'vc_message',
    contentType: 'vc_message',
    contentTitle: 'Vice Chancellor Message Address',
    action: 'PUBLISHED',
    actorUid: 'demo_superadmin_01',
    actorName: 'Prof. Dr. Vice Chancellor',
    actorEmail: 'superadmin.demo@jstu.ac.bd',
    actorRole: 'super_admin',
    timestamp: '2026-10-01T08:00:00Z',
    changesSummary: 'Published official semester inaugural speech with safe markdown blocks.',
    previousStatus: 'draft',
    newStatus: 'published'
  },
  {
    id: 'audit-002',
    contentId: 'news-1',
    contentType: 'news',
    contentTitle: 'JSTU Deploys Campus-Wide High-Speed Fiber Backbone',
    action: 'PUBLISHED',
    actorUid: 'demo_admin_01',
    actorName: 'Engr. Mahbub Alam (ICT Cell)',
    actorEmail: 'admin.demo@jstu.ac.bd',
    actorRole: 'admin',
    timestamp: '2026-10-04T11:30:00Z',
    changesSummary: 'Commissioned campus fiber news article with validated banner photo.',
    previousStatus: 'draft',
    newStatus: 'published'
  },
  {
    id: 'audit-003',
    contentId: 'fac-cse-01',
    contentType: 'faculty',
    contentTitle: 'Dr. Shahadat Hossain - CSE Chairman Profile',
    action: 'UPDATED',
    actorUid: 'demo_chairman_01',
    actorName: 'Prof. Dr. Chairman CSE',
    actorEmail: 'chairman.demo@jstu.ac.bd',
    actorRole: 'dept_chairman',
    actorDepartment: 'CSE',
    timestamp: '2026-10-05T09:15:00Z',
    changesSummary: 'Updated research interests to include Bangla Natural Language Processing.',
    previousStatus: 'published',
    newStatus: 'published'
  }
];
