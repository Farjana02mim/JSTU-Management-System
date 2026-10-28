// ============================================================================
// Academic Architecture Type Definitions
// /* [REPLACE WITH REAL CONTENT] Official JSTU Academic Faculty & Departmental Schemas */
// ============================================================================

export interface DepartmentFacultyMember {
  id: string;
  departmentId: string;
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
  isChairman?: boolean;
}

export interface DepartmentProgram {
  id: string;
  departmentId: string;
  title: string;
  titleBn: string;
  degreeType: 'BSc' | 'MSc' | 'BBA' | 'MBA' | 'BSS' | 'MSS';
  degreeTypeBn: string;
  duration: string;
  durationBn: string;
  totalCredits: number;
  totalSemesters: number;
  intakeSeason: string;
  intakeSeasonBn: string;
  seatCount: number;
  overview: string;
  overviewBn: string;
  admissionEligibility: string[];
  admissionEligibilityBn: string[];
  careerProspects: string[];
  careerProspectsBn: string[];
  curriculumHighlights: string[];
  curriculumHighlightsBn: string[];
}

export interface DepartmentCourse {
  id: string;
  departmentId: string;
  programId: string;
  courseCode: string;
  courseTitle: string;
  courseTitleBn: string;
  credits: number;
  type: 'Theory' | 'Lab' | 'Project' | 'Thesis' | 'Fieldwork';
  typeBn: string;
  year: number; // 1, 2, 3, 4
  semester: number; // 1, 2
  semesterLabel: string; // e.g. "Year 1, Semester 1 (1st Semester)"
  semesterLabelBn: string;
  prerequisite?: string;
  description: string;
  descriptionBn: string;
}

export interface DepartmentLab {
  id: string;
  departmentId: string;
  name: string;
  nameBn: string;
  location: string;
  locationBn: string;
  capacity: number;
  labInCharge: string;
  labInChargeBn: string;
  keyEquipment: string[];
  keyEquipmentBn: string[];
  description: string;
  descriptionBn: string;
  imageUrl: string;
}

export interface DepartmentResearchProject {
  id: string;
  departmentId: string;
  title: string;
  titleBn: string;
  principalInvestigator: string;
  principalInvestigatorBn: string;
  fundingAgency: string;
  fundingAgencyBn: string;
  status: 'Ongoing' | 'Completed';
  statusBn: string;
  description: string;
  descriptionBn: string;
  publicationsCount: number;
}

export interface DepartmentNotice {
  id: string;
  departmentId: string;
  title: string;
  titleBn: string;
  date: string;
  dateBn: string;
  category: 'Academic' | 'Exam' | 'Seminar' | 'Notice';
  categoryBn: string;
  content: string;
  contentBn: string;
  isImportant?: boolean;
}

export interface AcademicCalendarEvent {
  id: string;
  date: string;
  dateBn: string;
  endDate?: string;
  endDateBn?: string;
  title: string;
  titleBn: string;
  category: 'Registration' | 'Classes' | 'Midterm' | 'Final Exam' | 'Recess' | 'Holiday' | 'Convocation';
  categoryBn: string;
  term: 'Spring 2026' | 'Summer 2026' | 'Fall 2026';
  termBn: string;
  description: string;
  descriptionBn: string;
}

export interface ClassRoutineSlot {
  id: string;
  departmentId: string;
  semester: number; // 1 to 8
  semesterName: string;
  semesterNameBn: string;
  section: string;
  dayOfWeek: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
  dayOfWeekBn: string;
  startTime: string;
  endTime: string;
  courseCode: string;
  courseTitle: string;
  courseTitleBn: string;
  teacherName: string;
  teacherNameBn: string;
  room: string;
  roomBn: string;
}
