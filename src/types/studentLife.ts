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

export interface MedicalAppointment {
  id: string;
  tokenNumber: number;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  phone: string;
  appointmentDate: string;
  preferredTimeSlot: string;
  symptoms: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  bookedAt: string;
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
