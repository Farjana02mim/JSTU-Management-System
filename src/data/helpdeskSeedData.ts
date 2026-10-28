import { HelpdeskTicket } from '../types/helpdesk';

export const initialHelpdeskTickets: HelpdeskTicket[] = [
  {
    id: 'ticket-hd-001',
    referenceNumber: 'HD-2026-10492',
    category: 'Academic',
    priority: 'Medium',
    status: 'In progress',
    subject: 'Course Prerequisite Waiver Request for CSE-3205',
    description:
      'I am requesting a formal waiver for the prerequisite requirement for CSE-3205 (Compiler Design). I completed the equivalent credit during academic transfer credit evaluation.',
    isAnonymous: false,
    submitterUid: 'demo_student_01',
    submitterName: 'Tanvir Ahmed',
    submitterEmail: 'student.demo@jstu.ac.bd',
    submitterStudentId: 'JSTU2026001',
    submitterRole: 'student',
    submitterPhone: '+880 1812-987654',
    assignedOffice: 'Academic Council / Dean Office',
    assignedStaffName: 'Prof. Dr. Chairman CSE',
    attachments: [
      {
        name: 'transcript_prerequisite_eval.pdf',
        size: 245000,
        type: 'application/pdf',
        uploadedAt: '2026-10-25T10:15:00Z'
      }
    ],
    replies: [
      {
        id: 'reply-001-1',
        authorType: 'staff',
        authorName: 'Academic Office',
        authorRole: 'Officer',
        message:
          'Your transfer syllabus is currently under scrutiny by the Departmental Academic Committee. Please allow up to 48 hours.',
        createdAt: '2026-10-25T14:30:00Z',
        isInternalNote: false
      },
      {
        id: 'reply-001-2',
        authorType: 'staff',
        authorName: 'Staff Note',
        authorRole: 'Registrar Staff',
        message:
          'Internal: Dean approved in principle pending confirmation from Course Teacher Dr. Shahadat.',
        createdAt: '2026-10-26T09:00:00Z',
        isInternalNote: true
      }
    ],
    createdAt: '2026-10-25T10:15:00Z',
    updatedAt: '2026-10-26T09:00:00Z',
    slaHours: 48,
    slaDeadline: '2026-10-27T10:15:00Z'
  },
  {
    id: 'ticket-hd-002',
    referenceNumber: 'HD-2026-10815',
    category: 'Exam',
    priority: 'Urgent',
    status: 'Open',
    subject: 'Admit Card Photo Inverted on Semester Final Slip',
    description:
      'My admit card for the upcoming 6th semester final exam downloaded from the portal has a misaligned avatar thumbnail. The exam starts next week and invigilators require a clear photo.',
    isAnonymous: false,
    submitterUid: 'demo_student_02',
    submitterName: 'Sadia Afrin',
    submitterEmail: 'sadia.2026002@jstu.ac.bd',
    submitterStudentId: 'JSTU2026002',
    submitterRole: 'student',
    assignedOffice: 'Exam Controller Office',
    assignedStaffName: 'Exam Controller Admin',
    attachments: [
      {
        name: 'admit_card_preview.png',
        size: 180000,
        type: 'image/png',
        uploadedAt: '2026-10-27T08:30:00Z'
      }
    ],
    replies: [
      {
        id: 'reply-002-1',
        authorType: 'system',
        authorName: 'System Ledger',
        message: 'Ticket received and routed to Exam Controller Office with Urgent SLA (12 hours).',
        createdAt: '2026-10-27T08:30:00Z',
        isInternalNote: false
      }
    ],
    createdAt: '2026-10-27T08:30:00Z',
    updatedAt: '2026-10-27T08:30:00Z',
    slaHours: 12,
    slaDeadline: '2026-10-27T20:30:00Z'
  },
  {
    id: 'ticket-hd-003',
    referenceNumber: 'HD-2026-10234',
    category: 'Fee',
    priority: 'Low',
    status: 'Resolved',
    subject: 'Sonali Bank e-Pay Voucher Clearance Discrepancy',
    description:
      'Paid semester tuition fee of BDT 4,500 via Sonali Bank on Oct 18. The portal still showed "Pending Verification" until today.',
    isAnonymous: false,
    submitterUid: 'demo_student_01',
    submitterName: 'Tanvir Ahmed',
    submitterEmail: 'student.demo@jstu.ac.bd',
    submitterStudentId: 'JSTU2026001',
    submitterRole: 'student',
    assignedOffice: 'Accounts & Finance Office',
    assignedStaffName: 'Accounts Officer',
    attachments: [
      {
        name: 'bank_deposit_slip.pdf',
        size: 420000,
        type: 'application/pdf',
        uploadedAt: '2026-10-19T11:00:00Z'
      }
    ],
    replies: [
      {
        id: 'reply-003-1',
        authorType: 'staff',
        authorName: 'Accounts Officer',
        authorRole: 'Accounts Officer',
        message:
          'Bank transaction reference verified against branch scroll sheet #118. Payment status is now marked PAID in the student portal ledger.',
        createdAt: '2026-10-20T16:00:00Z',
        isInternalNote: false
      }
    ],
    createdAt: '2026-10-19T11:00:00Z',
    updatedAt: '2026-10-20T16:00:00Z',
    resolvedAt: '2026-10-20T16:00:00Z',
    slaHours: 72,
    slaDeadline: '2026-10-22T11:00:00Z'
  },
  {
    id: 'ticket-hd-004',
    referenceNumber: 'HD-2026-10901',
    category: 'Hostel',
    priority: 'Medium',
    status: 'Open',
    subject: 'Shahid Rafiq Hall Room 304 Ceiling Fan Regulator Damaged',
    description:
      'The ceiling fan speed regulator in room 304 has sparked and stopped functioning. Requesting replacement by hall electrical maintenance.',
    isAnonymous: false,
    submitterUid: 'demo_student_03',
    submitterName: 'Mahmudur Rahman',
    submitterEmail: 'mahmud.2026003@jstu.ac.bd',
    submitterStudentId: 'JSTU2026003',
    submitterRole: 'student',
    assignedOffice: 'Hall / Hostel Administration',
    replies: [],
    createdAt: '2026-10-27T14:00:00Z',
    updatedAt: '2026-10-27T14:00:00Z',
    slaHours: 48,
    slaDeadline: '2026-10-29T14:00:00Z'
  },
  {
    id: 'ticket-hd-005',
    referenceNumber: 'HD-2026-10650',
    category: 'IT',
    priority: 'High',
    status: 'In progress',
    subject: 'Eduroam WiFi Certificate Handshake Failing on Linux',
    description:
      'University eduroam profile with TTLS/PAP credentials fails to complete 802.1x handshake in Faculty Building 2 Computer Lab.',
    isAnonymous: false,
    submitterUid: 'demo_teacher_01',
    submitterName: 'Dr. Shahadat Hossain',
    submitterEmail: 'teacher.demo@jstu.ac.bd',
    submitterRole: 'teacher',
    assignedOffice: 'IT Cell',
    assignedStaffName: 'Network Administrator',
    replies: [
      {
        id: 'reply-005-1',
        authorType: 'staff',
        authorName: 'IT Cell Support',
        authorRole: 'Network Engineer',
        message:
          'Radius server intermediate certificate has been updated. Please download the revised root CA certificate from the downloads repository.',
        createdAt: '2026-10-26T15:20:00Z',
        isInternalNote: false
      }
    ],
    createdAt: '2026-10-26T12:00:00Z',
    updatedAt: '2026-10-26T15:20:00Z',
    slaHours: 24,
    slaDeadline: '2026-10-27T12:00:00Z'
  },
  {
    id: 'ticket-hd-006',
    referenceNumber: 'HD-2026-10118',
    category: 'Harassment/Complaint',
    priority: 'Urgent',
    status: 'In progress',
    subject: 'Confidential: Intimidation & Disruption Incident in Academic Building Corridor',
    description:
      'Reporting an incident of intimidation and aggressive verbal harassment outside classroom 302 on Tuesday afternoon around 4:30 PM. Requesting proctorial patrol and review of CCTV footage near stairs.',
    // CRITICAL: ANONYMOUS TICKET - Submitter identity MUST NOT be stored
    isAnonymous: true,
    submitterUid: undefined,
    submitterName: undefined,
    submitterEmail: undefined,
    submitterStudentId: undefined,
    submitterRole: undefined,
    submitterPhone: undefined,
    assignedOffice: 'Anti-Harassment & Grievance Cell',
    assignedStaffName: 'Grievance Committee Secretary',
    replies: [
      {
        id: 'reply-006-1',
        authorType: 'staff',
        authorName: 'Staff Note',
        authorRole: 'Committee Member',
        message:
          'Internal: CCTV footage for Academic Building 3rd floor west stairwell requested from security office.',
        createdAt: '2026-10-25T11:00:00Z',
        isInternalNote: true
      },
      {
        id: 'reply-006-2',
        authorType: 'staff',
        authorName: 'Anti-Harassment & Grievance Cell',
        authorRole: 'Grievance Officer',
        message:
          'Your report is being actively reviewed by the committee with maximum confidentiality. Proctorial security patrols in that corridor have been heightened immediately.',
        createdAt: '2026-10-25T11:30:00Z',
        isInternalNote: false
      }
    ],
    createdAt: '2026-10-25T09:00:00Z',
    updatedAt: '2026-10-25T11:30:00Z',
    slaHours: 12,
    slaDeadline: '2026-10-25T21:00:00Z'
  },
  {
    id: 'ticket-hd-007',
    referenceNumber: 'HD-2026-10022',
    category: 'Other',
    priority: 'Low',
    status: 'Closed',
    subject: 'Lost Blue Notebook Found at Central Library 2nd Floor',
    description:
      'Deposited a blue spiral notebook with handwritten physics lecture notes at the circulation desk.',
    isAnonymous: false,
    submitterUid: 'demo_student_06',
    submitterName: 'Fahmida Haque',
    submitterEmail: 'fahmida.2026006@jstu.ac.bd',
    submitterStudentId: 'JSTU2026006',
    submitterRole: 'student',
    assignedOffice: 'General Administration',
    replies: [
      {
        id: 'reply-007-1',
        authorType: 'staff',
        authorName: 'Helpdesk Staff',
        authorRole: 'Helpdesk Staff',
        message: 'Owner claimed the notebook today at 2:00 PM. Thank you for handing it in.',
        createdAt: '2026-10-24T14:30:00Z',
        isInternalNote: false
      }
    ],
    createdAt: '2026-10-24T09:00:00Z',
    updatedAt: '2026-10-24T14:30:00Z',
    closedAt: '2026-10-24T14:30:00Z',
    slaHours: 72,
    slaDeadline: '2026-10-27T09:00:00Z'
  }
];
