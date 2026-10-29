export type EvaluationWindowStatus = 'Open' | 'Closed';

export interface EvaluationWindow {
  id: string; // e.g. "win-fall-2026"
  title: string;
  titleBn: string;
  semester: string; // e.g. "Fall 2026 (6th Semester)"
  semesterName?: string; // alias
  academicSession: string; // e.g. "2023-2024"
  status: EvaluationWindowStatus;
  startDate: string;
  endDate: string;
  startsAt?: string; // alias
  closesAt?: string; // alias
  createdBy: string;
  createdAt: string;
  closedAt?: string;
}

export interface EvaluationCriteriaRating {
  preparation: number; // 1-5 (Course Preparation & Conceptual Clarity)
  punctuality: number; // 1-5 (Punctuality & Routine Adherence)
  engagement: number; // 1-5 (Student Engagement & Question Handling)
  practicals: number; // 1-5 (Assignments, Quizzes & Lab Relevance)
  fairness: number; // 1-5 (Fairness & Transparency in Assessment)
  overall: number; // 1-5 (Overall Teacher Effectiveness)
}

/**
 * Anonymous Course Evaluation Response
 * CRITICAL: "store no student identity with the answers, only a one-time 'has submitted' flag"
 * Absolutely no student ID, name, email, IP, or user UID stored here!
 */
export interface AnonymousCourseEvaluation {
  id: string;
  windowId: string;
  courseCode: string;
  courseTitle: string;
  courseTitleBn?: string;
  departmentId: string; // 'CSE', 'EEE', 'MATH', etc.
  departmentName?: string;
  teacherId: string; // e.g. 'demo_teacher_01'
  teacherName: string;
  teacherNameBn?: string;
  ratings: EvaluationCriteriaRating;
  averageScore: number;
  comment?: string;
  submittedAt: string;
}

/**
 * One-time detached submission flag record.
 * Stored separately from answers to ensure the student cannot be tied to their ratings.
 */
export interface EvaluationSubmissionRecord {
  windowId: string;
  courseCode: string;
  studentId: string; // e.g. 'JSTU2026001'
  submittedAt: string;
}

export interface CourseEvaluationSummary {
  courseCode: string;
  courseTitle: string;
  departmentId: string;
  teacherId: string;
  teacherName: string;
  totalResponses: number;
  windowStatus: EvaluationWindowStatus;
  isThresholdMet: boolean; // >= 5 responses
  isAccessibleToTeacher: boolean; // windowStatus === 'Closed' && totalResponses >= 5
  overallAverage: number;
  criteriaAverages: {
    preparation: number;
    punctuality: number;
    engagement: number;
    practicals: number;
    fairness: number;
    overall: number;
  };
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  comments: string[];
}
