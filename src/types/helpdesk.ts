export type TicketCategory =
  | 'Academic'
  | 'Exam'
  | 'Fee'
  | 'Hostel'
  | 'IT'
  | 'Harassment/Complaint'
  | 'Other';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TicketStatus = 'Open' | 'In progress' | 'Resolved' | 'Closed';

export type AssignedOffice =
  | 'IT Cell'
  | 'Office of the Registrar'
  | 'Exam Controller Office'
  | 'Accounts & Finance Office'
  | 'Proctor Office'
  | 'Hall / Hostel Administration'
  | 'Academic Council / Dean Office'
  | 'Anti-Harassment & Grievance Cell'
  | 'General Administration';

export interface TicketAttachment {
  name: string;
  size: number; // in bytes
  type: string; // mime type
  dataUrl?: string; // base64 preview if available
  uploadedAt: string;
}

export interface TicketReply {
  id: string;
  authorType: 'submitter' | 'staff' | 'system';
  authorName: string;
  authorRole?: string;
  message: string;
  createdAt: string;
  isInternalNote: boolean; // if true, NEVER displayed to submitter or public
}

export interface HelpdeskTicket {
  id: string;
  referenceNumber: string; // e.g. "HD-2026-89412"
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  description: string;

  // Anonymous protection:
  // If isAnonymous is true, submitter details MUST NEVER be stored.
  isAnonymous: boolean;
  submitterUid?: string;
  submitterName?: string;
  submitterEmail?: string;
  submitterStudentId?: string;
  submitterRole?: 'student' | 'teacher' | 'staff' | 'alumni' | 'other';
  submitterPhone?: string;

  assignedOffice: AssignedOffice;
  assignedStaffName?: string;

  attachments?: TicketAttachment[];
  replies: TicketReply[];

  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;

  // SLA Calculation
  slaHours: number;
  slaDeadline: string; // ISO date string
}
