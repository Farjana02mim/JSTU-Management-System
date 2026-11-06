export type HallType = 'male' | 'female';

export interface HallRoomType {
  name: string;
  nameBn: string;
  capacity: number; // e.g. 4 beds
  feePerMonth: number;
  availableBeds: number;
  totalBeds: number;
}

export interface ResidentialHall {
  id: string; // 'hall-bb' | 'hall-sfm' | 'hall-maw'
  name: string;
  nameBn: string;
  type: HallType;
  established: number;
  location: string;
  locationBn: string;
  provost: {
    name: string;
    nameBn: string;
    designation: string;
    email: string;
    phone: string;
    officeRoom: string;
  };
  capacity: number;
  currentResidents: number;
  roomTypes: HallRoomType[];
  amenities: string[];
  amenitiesBn: string[];
  diningFeePerMonth: number;
  messManager: string;
  messContact: string;
  description: string;
  descriptionBn: string;
  image: string;
  rules: string[];
  rulesBn: string[];
}

export type HallApplicationStatus = 'submitted' | 'under_review' | 'allocated' | 'waiting_list' | 'rejected';

export interface HallSeatApplication {
  id: string;
  referenceId: string; // e.g. "JSTU-HALL-2026-XXXX"
  hallId: string;
  hallName: string;
  hallNameBn: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  session: string;
  currentSemester: string;
  cgpa: number;
  gender: 'male' | 'female';
  homeDistrict: string;
  distanceKm: number;
  guardianAnnualIncome: number;
  preferredRoomType: string;
  emergencyContact: string;
  reason: string;
  status: HallApplicationStatus;
  allocatedRoomNumber?: string;
  allocatedBedNumber?: string;
  appliedAt: string; // ISO
  reviewedAt?: string;
  remarks?: string;
}

export interface StudentClub {
  id: string;
  name: string;
  nameBn: string;
  code: string;
  category: 'technology' | 'cultural' | 'service' | 'debate' | 'sports' | 'academic';
  establishedYear: number;
  motto: string;
  mottoBn: string;
  president: string;
  generalSecretary: string;
  advisor: string;
  advisorDept: string;
  memberCount: number;
  weeklyMeetingTime: string;
  roomLocation: string;
  email: string;
  phone: string;
  badgeColor: string;
  description: string;
  descriptionBn: string;
  activities: string[];
  activitiesBn: string[];
  upcomingEvents: {
    title: string;
    titleBn: string;
    date: string;
    venue: string;
  }[];
}

export interface ClubMembershipApplication {
  id: string;
  clubId: string;
  clubName: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  email: string;
  phone: string;
  session: string;
  interestRole: string;
  skills: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

export interface SportsFacility {
  id: string;
  name: string;
  nameBn: string;
  type: 'outdoor' | 'indoor' | 'gym' | 'court';
  capacity: string;
  operatingHours: string;
  supervisor: string;
  supervisorPhone: string;
  amenities: string[];
  amenitiesBn: string[];
  equipmentAvailable: string[];
  bookingAllowed: boolean;
  description: string;
  descriptionBn: string;
}

export interface SportsTournament {
  id: string;
  title: string;
  titleBn: string;
  sport: 'Cricket' | 'Football' | 'Badminton' | 'Volleyball' | 'Table Tennis' | 'Chess';
  status: 'upcoming' | 'ongoing' | 'concluded';
  date: string;
  venue: string;
  venueBn: string;
  participatingTeams: number;
  champion?: string;
  runnerUp?: string;
  highlights?: string;
}

export interface SportsBooking {
  id: string;
  facilityId: string;
  facilityName: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  bookingDate: string; // YYYY-MM-DD
  timeSlot: string;
  sportItem: string;
  purpose: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookedAt: string;
}

export interface MedicalDoctor {
  id: string;
  name: string;
  nameBn: string;
  designation: string;
  designationBn: string;
  degrees: string;
  specialty: string;
  roomNumber: string;
  dutyDays: string[];
  dutyDaysBn: string[];
  dutyTime: string;
  phone: string;
  availableToday: boolean;
}

export interface MedicalService {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  fee: string;
  availability: string;
  iconName: string;
}

export type MedicalAppointmentStatus = 'Requested' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-show';

export interface MedicalDutyShift {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  dayOfWeek: string; // 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday'
  timeSlot: string; // e.g. "09:00 AM - 09:30 AM"
  roomNumber: string;
  maxPatients: number;
  isActive: boolean;
}

export interface MedicalAppointmentAuditEntry {
  id: string;
  actorUid: string;
  actorRole: string;
  action: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NOSHOW' | 'RESCHEDULED';
  timestamp: string;
  note?: string; // Administrative only, strictly no health details
}

export interface MedicalAppointment {
  id: string;
  referenceNumber: string; // e.g. "JSTU-MED-2026-1042"
  tokenNumber: number;
  patientUid: string;
  patientName: string;
  patientRole: string; // 'student' | 'teacher' | 'staff'
  patientId: string; // Student ID or Employee ID
  department: string;
  phone: string;
  doctorId: string; // 'doc-01' or 'any'
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:00 AM - 09:30 AM"
  reason: string; // Short reason with 300 character limit
  status: MedicalAppointmentStatus;
  bookedAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
  auditTrail: MedicalAppointmentAuditEntry[];
}

export interface MedicalHealthTip {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  categoryBn: string;
  readTime: string;
  summary: string;
  summaryBn: string;
  content: string[];
  contentBn: string[];
}

export interface PrescriptionItem {
  id: string;
  medicine: string;
  dose: string;
  duration: string;
  instructions: string;
}

export type VisitNoteStatus = 'DRAFT' | 'FINALIZED';

export interface MedicalVisitAddendum {
  id: string;
  createdAt: string;
  createdByUid: string;
  createdByName: string;
  reason: string;
  correctionNotes: string;
}

export interface MedicalVisitRecord {
  id: string;
  appointmentId: string;
  appointmentRef: string;
  verificationToken: string;
  verificationStatus: 'VALID' | 'REVOKED';
  patientUid: string;
  patientName: string;
  patientId: string;
  patientRole: string;
  patientDepartment: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  visitDate: string;
  complaint: string;
  observation: string;
  advice: string;
  followUpDate?: string;
  sickRestDays?: number;
  prescriptionItems: PrescriptionItem[];
  status: VisitNoteStatus;
  createdAt: string;
  finalizedAt?: string;
  updatedAt: string;
  addenda: MedicalVisitAddendum[];
}

export interface PatientRecordAccessLog {
  id: string;
  patientUid: string;
  accessedByUid: string;
  accessedByName: string;
  accessedByRole: string;
  accessedAt: string;
}

// M3: Medical Rest Certificate
// Real enforcement must move to Firestore rules / Cloud Functions.
// Real signing must happen server-side with a key in a secret manager.
// The registry must live in a database with rules exposing only the minimal verification fields publicly.
export type MedicalCertificateStatus = 'VALID' | 'SUPERSEDED' | 'REVOKED';

export interface MedicalCertificateAuditEntry {
  id: string;
  actorUid: string;
  actorRole: string;
  action: 'ISSUED' | 'SUPERSEDED' | 'REVOKED';
  timestamp: string;
  reason?: string; // Administrative only, strictly no health details
}

export interface MedicalRestCertificate {
  id: string; // e.g. "cert-med-2026-001"
  verificationId: string; // 128-bit random hex string (crypto.getRandomValues)
  canonicalHash: string; // SHA-256 hash of canonical content
  visitRecordId: string; // Linked finalized visit note
  appointmentId: string;
  appointmentRef: string;
  patientUid: string;
  patientName: string;
  patientId: string; // studentId or roll
  patientDepartment: string;
  centerName: string; // "JSTU Medical Center"
  doctorRole: string; // "Medical Officer"
  doctorUid: string;
  doctorName: string;
  restStartDate: string; // YYYY-MM-DD
  restEndDate: string; // YYYY-MM-DD
  restDays: number;
  status: MedicalCertificateStatus;
  version: number;
  previousVersionId?: string;
  supersededById?: string;
  supersededReason?: string;
  revokedAt?: string;
  revocationReason?: string;
  revokedByUid?: string;
  revokedByRole?: string;
  issuedAt: string;
  updatedAt: string;
  auditTrail: MedicalCertificateAuditEntry[];
}

export interface EmergencyContact {
  id: string;
  title: string;
  titleBn: string;
  number: string;
  availableHours: string;
  availableHoursBn: string;
  description: string;
  descriptionBn: string;
  iconName: string;
  isAmbulance?: boolean;
}

export interface TransportStop {
  stopName: string;
  stopNameBn: string;
  morningUp: string;
  noonUp: string;
  afternoonDown: string;
  eveningDown: string;
}

export interface TransportRoute {
  id: string;
  routeCode: string;
  routeName: string;
  routeNameBn: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  supervisorName: string;
  supervisorPhone: string;
  capacity: number;
  stoppages: TransportStop[];
  activeStatus: 'on_schedule' | 'delayed' | 'maintenance';
}

export interface Alumnus {
  id: string;
  name: string;
  nameBn: string;
  departmentCode: string; // 'CSE', 'EEE', etc.
  departmentName: string;
  batch: string; // e.g. "1st Batch (2012-13)"
  graduatedYear: number;
  currentPosition: string;
  currentPositionBn: string;
  organization: string;
  organizationType: 'Tech' | 'Civil Service' | 'Academia & Research' | 'Financial & Banking' | 'Multinational' | 'Entrepreneurship';
  country: string;
  city: string;
  linkedinUrl?: string;
  email?: string;
  quote?: string;
  quoteBn?: string;
  avatar: string;
}

export interface AlumniRegistrationRequest {
  id: string;
  fullName: string;
  studentId: string;
  department: string;
  batch: string;
  graduationYear: number;
  email: string;
  phone: string;
  currentCompany: string;
  designation: string;
  country: string;
  city: string;
  linkedinUrl: string;
  status: 'submitted' | 'verified' | 'rejected';
  appliedAt: string;
}
