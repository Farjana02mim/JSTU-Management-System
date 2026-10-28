/**
 * JSTU Smart Campus — Marks & Assessment Calculation Utility
 * Compliant with UGC & JSTU Academic Ordinance rules.
 * 
 * Continuous Assessment (50%):
 * - Attendance: Max 10 marks
 * - Class Tests / Quizzes (CT): Max 20 marks
 * - Midterm Exam: Max 20 marks
 * 
 * Semester Final Examination (50%):
 * - Written Exam: Max 50 marks
 * 
 * Total: Max 100 marks
 */

import { marksToGrade, GradeResult } from './gpaCalculator';

export interface MarksBreakdownInput {
  attendance: number;
  classTests: number;
  midterm: number;
  finalExam?: number;
}

export interface MarksValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ComputedStudentMarks {
  attendance: number;
  classTests: number;
  midterm: number;
  finalExam: number;
  totalMarks: number;
  letterGrade: GradeResult['letterGrade'];
  gradePoint: number;
}

export const MARKS_LIMITS = {
  attendance: { min: 0, max: 10 },
  classTests: { min: 0, max: 20 },
  midterm: { min: 0, max: 20 },
  finalExam: { min: 0, max: 50 },
  total: { min: 0, max: 100 }
} as const;

/**
 * Validates individual marks fields against institutional ceilings.
 */
export function validateMarksInput(input: Partial<MarksBreakdownInput>): MarksValidationResult {
  const errors: Record<string, string> = {};

  if (input.attendance !== undefined) {
    if (isNaN(input.attendance) || input.attendance < MARKS_LIMITS.attendance.min || input.attendance > MARKS_LIMITS.attendance.max) {
      errors.attendance = `Attendance marks must be between ${MARKS_LIMITS.attendance.min} and ${MARKS_LIMITS.attendance.max}.`;
    }
  }

  if (input.classTests !== undefined) {
    if (isNaN(input.classTests) || input.classTests < MARKS_LIMITS.classTests.min || input.classTests > MARKS_LIMITS.classTests.max) {
      errors.classTests = `Class test marks must be between ${MARKS_LIMITS.classTests.min} and ${MARKS_LIMITS.classTests.max}.`;
    }
  }

  if (input.midterm !== undefined) {
    if (isNaN(input.midterm) || input.midterm < MARKS_LIMITS.midterm.min || input.midterm > MARKS_LIMITS.midterm.max) {
      errors.midterm = `Midterm marks must be between ${MARKS_LIMITS.midterm.min} and ${MARKS_LIMITS.midterm.max}.`;
    }
  }

  if (input.finalExam !== undefined) {
    if (isNaN(input.finalExam) || input.finalExam < MARKS_LIMITS.finalExam.min || input.finalExam > MARKS_LIMITS.finalExam.max) {
      errors.finalExam = `Semester final marks must be between ${MARKS_LIMITS.finalExam.min} and ${MARKS_LIMITS.finalExam.max}.`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Pure function: calculates continuous, final, total marks and letter grade.
 */
export function computeTotalMarks(input: MarksBreakdownInput): ComputedStudentMarks {
  const attendance = Math.max(0, Math.min(MARKS_LIMITS.attendance.max, Number(input.attendance) || 0));
  const classTests = Math.max(0, Math.min(MARKS_LIMITS.classTests.max, Number(input.classTests) || 0));
  const midterm = Math.max(0, Math.min(MARKS_LIMITS.midterm.max, Number(input.midterm) || 0));
  const finalExam = Math.max(0, Math.min(MARKS_LIMITS.finalExam.max, Number(input.finalExam) || 0));

  const totalRaw = attendance + classTests + midterm + finalExam;
  const totalMarks = Math.round(totalRaw * 10) / 10;
  const gradeResult = marksToGrade(totalMarks);

  return {
    attendance,
    classTests,
    midterm,
    finalExam,
    totalMarks,
    letterGrade: gradeResult.letterGrade,
    gradePoint: gradeResult.gradePoint
  };
}

/**
 * Pure function: calculates attendance percentage and returns status.
 */
export function calculateAttendanceMetrics(attended: number, total: number): {
  percentage: number;
  status: 'safe' | 'warning' | 'critical';
} {
  if (total <= 0) {
    return { percentage: 100, status: 'safe' };
  }

  const rawPercent = (attended / total) * 100;
  const percentage = Math.round(rawPercent * 10) / 10;

  let status: 'safe' | 'warning' | 'critical' = 'safe';
  if (percentage < 60) {
    status = 'critical';
  } else if (percentage < 75) {
    status = 'warning';
  }

  return { percentage, status };
}
