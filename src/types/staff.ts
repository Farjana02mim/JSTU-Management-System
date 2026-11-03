/**
 * JSTU Smart Campus — Staff & Faculty Area Types
 * 
 * Supports teachers and administrative officers:
 * - Leave applications (casual, medical, study) with dynamic balance
 * - Approval chain: Chairman -> Registrar (reusing workflow engine)
 * - Internal Notice Board
 * - Service Requests (IT, lab, logistics, maintenance)
 * - University Staff Directory
 */

export type StaffLeaveType = 'casual' | 'medical' | 'study';

export interface StaffLeaveBalance {
  userId: string;
  staffId: string;
  staffName: string;
  staffNameBn?: string;
  designation: string;
  departmentOrOffice: string;
  role: 'teacher' | 'officer' | 'dept_chairman' | 'registrar';
  
  // Casual Leave (CL) - Standard 20 days/year
  casualTotal: number;
  casualUsed: number;
  casualRemaining: number;

  // Medical / Earned Leave (ML) - Standard 30 days/year
  medicalTotal: number;
  medicalUsed: number;
  medicalRemaining: number;

  // Study & Higher Research Leave (SL) - Measured in months (up to 36 months / 3 years)
  studyTotalMonths: number;
  studyUsedMonths: number;
  studyRemainingMonths: number;
}

export interface StaffLeaveApplicationRecord {
  id: string; // matches PaperlessApplication id
  applicationNumber: string; // e.g. JSTU-APP-2026-902142
  staffId: string;
  staffName: string;
  staffNameBn?: string;
  designation: string;
  departmentOrOffice: string;
  leaveType: StaffLeaveType;
  startDate: string;
  endDate: string;
  daysRequested: number;
  reason: string;
  actingStaff: string; // Substitute colleague
  attachmentUrl?: string;
  attachmentName?: string;
  status: 'PENDING_CHAIRMAN' | 'PENDING_REGISTRAR' | 'APPROVED' | 'REJECTED' | 'RETURNED';
  currentStepIndex: number; // 0 for Chairman, 1 for Registrar
  submittedAt: string;
  chairmanReviewedAt?: string;
  chairmanComment?: string;
  registrarReviewedAt?: string;
  registrarComment?: string;
}

export type StaffNoticeCategory =
  | 'Administrative'
  | 'Academic & Exam'
  | 'Welfare & Finance'
  | 'Research & Training'
  | 'Syndicate & Governance';

export type StaffNoticePriority = 'Urgent' | 'Routine' | 'Info';

export interface StaffNotice {
  id: string;
  refNo: string; // e.g. JSTU/REG/EST-2026/041
  title: string;
  titleBn: string;
  category: StaffNoticeCategory;
  priority: StaffNoticePriority;
  publishDate: string;
  issuedBy: string;
  issuedByBn: string;
  summary: string;
  summaryBn: string;
  body: string;
  bodyBn?: string;
  attachmentName?: string;
  attachmentSize?: string;
}

export type ServiceRequestCategory =
  | 'IT & Smart Classroom'
  | 'Lab Maintenance & Equipment'
  | 'Transport Requisition'
  | 'Office Supplies & Logistics'
  | 'Estate & Facilities';

export type ServiceRequestPriority = 'Routine' | 'High' | 'Emergency';

export type ServiceRequestStatus =
  | 'SUBMITTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED';

export interface StaffServiceRequest {
  id: string; // e.g. JSTU-SR-2026-104
  staffId: string;
  staffName: string;
  departmentOrOffice: string;
  category: ServiceRequestCategory;
  title: string;
  description: string;
  location: string; // e.g. Academic Building 2, Room 402
  priority: ServiceRequestPriority;
  status: ServiceRequestStatus;
  assignedTo?: string;
  submittedAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface StaffDirectoryMember {
  id: string;
  name: string;
  nameBn: string;
  designation: string;
  designationBn: string;
  type: 'faculty' | 'officer' | 'technical';
  facultyOrDivision: string; // e.g. "Faculty of Engineering & Technology" or "Administrative Division"
  departmentOrOffice: string; // e.g. "Computer Science & Engineering" or "Office of the Registrar"
  email: string;
  phone: string;
  room: string;
  officeLocation: string;
  specialization?: string;
  joiningYear: number;
  status: 'Active' | 'On Leave' | 'On Deputation';
}
