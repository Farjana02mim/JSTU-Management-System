export type GownSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ConvocationEvent {
  id: string;
  edition: string; // e.g. "2nd Convocation 2026"
  editionBn: string;
  date: string; // e.g. "2026-11-28"
  dateFormatted: string;
  dateFormattedBn: string;
  venue: string;
  venueBn: string;
  chiefGuest: string;
  chiefGuestBn: string;
  chancellor: string;
  chancellorBn: string;
  eligibleSessions: string[];
  graduateFee: number;
  guestFee: number;
  maxGuests: number;
  deadline: string;
  gownDistributionStart: string;
  status: 'REGISTRATION_OPEN' | 'UNDER_REVIEW' | 'CLOSED' | 'COMPLETED';
}

export interface ConvocationRegistration {
  id: string;
  registrationNumber: string; // e.g. "JSTU-CONV-2026-1042"
  convocationId: string;
  studentId: string;
  graduateName: string;
  graduateNameBn?: string;
  email: string;
  phone: string;
  department: string;
  departmentCode: string;
  degree: string;
  degreeBn?: string;
  passingSession: string; // e.g. "2019-20"
  passingYear: number;
  cgpa: number;
  gownSize: GownSize;
  guestCount: number;
  guestNames?: string[];
  totalFee: number;
  paymentStatus: 'UNPAID' | 'PAID';
  paymentTxnId?: string;
  paymentMethod?: string;
  paymentDate?: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  passToken: string; // Random token for QR verification
  assignedSeat?: string; // e.g. "Auditorium Main — Zone A, Row 4, Seat 18"
  assignedGownKitId?: string; // e.g. "GW-KIT-CSE-048"
  registeredAt: string;
}
