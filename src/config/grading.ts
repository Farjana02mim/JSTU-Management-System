/**
 * JSTU Smart Campus — Institutional Grading Policy & Grade Scale Configuration
 * 
 * IMPORTANT: This must match JSTU's official academic ordinance and
 * University Grants Commission of Bangladesh (UGC) standard 4.00 grading scale.
 * 
 * UGC Standard Scale:
 * - 80% and above   : A+ (4.00) — Outstanding
 * - 75% to 79%      : A  (3.75) — Excellent
 * - 70% to 74%      : A- (3.50) — Very Good
 * - 65% to 69%      : B+ (3.25) — Good
 * - 60% to 64%      : B  (3.00) — Satisfactory
 * - 55% to 59%      : B- (2.75) — Above Average
 * - 50% to 54%      : C+ (2.50) — Average
 * - 45% to 49%      : C  (2.25) — Below Average
 * - 40% to 44%      : D  (2.00) — Pass
 * - Less than 40%   : F  (0.00) — Fail
 */

export interface GradeScaleTier {
  minMarks: number;
  maxMarks: number;
  letterGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'F';
  gradePoint: number;
  description: string;
  descriptionBn: string;
}

export const UGC_GRADE_SCALE: GradeScaleTier[] = [
  { minMarks: 80, maxMarks: 100, letterGrade: 'A+', gradePoint: 4.00, description: 'Outstanding', descriptionBn: 'অসাধারণ' },
  { minMarks: 75, maxMarks: 79.99, letterGrade: 'A', gradePoint: 3.75, description: 'Excellent', descriptionBn: 'চমৎকার' },
  { minMarks: 70, maxMarks: 74.99, letterGrade: 'A-', gradePoint: 3.50, description: 'Very Good', descriptionBn: 'উত্তম' },
  { minMarks: 65, maxMarks: 69.99, letterGrade: 'B+', gradePoint: 3.25, description: 'Good', descriptionBn: 'ভালো' },
  { minMarks: 60, maxMarks: 64.99, letterGrade: 'B', gradePoint: 3.00, description: 'Satisfactory', descriptionBn: 'সন্তোষজনক' },
  { minMarks: 55, maxMarks: 59.99, letterGrade: 'B-', gradePoint: 2.75, description: 'Above Average', descriptionBn: 'গড়ের চেয়ে ভালো' },
  { minMarks: 50, maxMarks: 54.99, letterGrade: 'C+', gradePoint: 2.50, description: 'Average', descriptionBn: 'গড়পরতা' },
  { minMarks: 45, maxMarks: 49.99, letterGrade: 'C', gradePoint: 2.25, description: 'Below Average', descriptionBn: 'গড়ের নিচে' },
  { minMarks: 40, maxMarks: 44.99, letterGrade: 'D', gradePoint: 2.00, description: 'Pass', descriptionBn: 'উত্তীর্ণ' },
  { minMarks: 0, maxMarks: 39.99, letterGrade: 'F', gradePoint: 0.00, description: 'Fail', descriptionBn: 'অনুত্তীর্ণ' }
];

export interface GradeResult {
  letterGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'F';
  gradePoint: number;
}

export interface CourseScoreInput {
  credits: number;
  gradePoint?: number;
  marks?: number;
  isRetake?: boolean;
}

/**
 * Pure function: maps numeric marks (0-100) to UGC letter grade and grade point.
 * Robust against out-of-range marks and floating-point precision issues.
 */
export function marksToGrade(marks: number): GradeResult {
  if (isNaN(marks)) {
    return { letterGrade: 'F', gradePoint: 0.00 };
  }

  const rounded = Math.round(marks * 10) / 10;

  for (const tier of UGC_GRADE_SCALE) {
    if (rounded >= tier.minMarks && rounded <= tier.maxMarks) {
      return {
        letterGrade: tier.letterGrade,
        gradePoint: tier.gradePoint
      };
    }
  }

  if (rounded >= 80) {
    return { letterGrade: 'A+', gradePoint: 4.00 };
  }

  return { letterGrade: 'F', gradePoint: 0.00 };
}

/**
 * Pure function: computes Semester Grade Point Average (SGPA).
 * SGPA = Sum(Course Credits * Course Grade Point) / Sum(Course Credits)
 * 
 * Edge cases handled:
 * - Empty course array -> 0.00
 * - Zero credits or non-positive credits -> skipped (no divide-by-zero)
 * - F grades -> gradePoint is 0.00, credits still count in denominator as attempted credits
 * - Retakes -> Handled by passing only the effective attempt or isRetake flag
 */
export function calculateSGPA(courses: CourseScoreInput[]): number {
  if (!courses || courses.length === 0) return 0.00;

  let totalCredits = 0;
  let weightedPoints = 0;

  for (const c of courses) {
    if (!c || c.credits <= 0 || isNaN(c.credits)) continue;

    let gp = c.gradePoint;
    if (gp === undefined && c.marks !== undefined) {
      gp = marksToGrade(c.marks).gradePoint;
    }

    if (gp !== undefined && !isNaN(gp)) {
      totalCredits += c.credits;
      weightedPoints += c.credits * gp;
    }
  }

  if (totalCredits === 0) return 0.00;
  const sgpa = weightedPoints / totalCredits;
  return Math.round(sgpa * 100) / 100;
}

/**
 * Pure function: computes Cumulative Grade Point Average (CGPA) across completed semesters.
 * CGPA = Sum(Semester Credits * Semester SGPA) / Sum(Semester Credits)
 * 
 * Edge cases handled:
 * - Empty semester array -> 0.00
 * - Semesters with 0 credits -> ignored safely
 * - Rounded to 2 decimal places
 */
export function calculateCGPA(
  semesters: { credits: number; sgpa: number }[]
): number {
  if (!semesters || semesters.length === 0) return 0.00;

  let totalCredits = 0;
  let weightedTotal = 0;

  for (const sem of semesters) {
    if (!sem || sem.credits <= 0 || isNaN(sem.credits)) continue;
    if (isNaN(sem.sgpa)) continue;

    totalCredits += sem.credits;
    weightedTotal += sem.credits * sem.sgpa;
  }

  if (totalCredits === 0) return 0.00;
  const cgpa = weightedTotal / totalCredits;
  return Math.round(cgpa * 100) / 100;
}

/**
 * Pure function: calculates CGPA directly from a list of courses (e.g. across multiple semesters).
 * Retakes handling: if courses contain duplicates, the highest/latest grade point replaces prior attempt.
 */
export function calculateCumulativeFromCourses(
  courses: Array<{ code: string; credits: number; gradePoint: number; isRetake?: boolean }>
): { cgpa: number; totalEarnedCredits: number; totalAttemptedCredits: number } {
  if (!courses || courses.length === 0) {
    return { cgpa: 0.00, totalEarnedCredits: 0, totalAttemptedCredits: 0 };
  }

  // Map to store latest or highest attempt per course code
  const effectiveCourses = new Map<string, { credits: number; gradePoint: number }>();

  for (const c of courses) {
    if (!c || c.credits <= 0) continue;
    const existing = effectiveCourses.get(c.code);
    if (!existing || c.gradePoint > existing.gradePoint) {
      effectiveCourses.set(c.code, { credits: c.credits, gradePoint: c.gradePoint });
    }
  }

  let attemptedCredits = 0;
  let earnedCredits = 0;
  let weightedPoints = 0;

  effectiveCourses.forEach((item) => {
    attemptedCredits += item.credits;
    if (item.gradePoint > 0.00) {
      earnedCredits += item.credits;
    }
    weightedPoints += item.credits * item.gradePoint;
  });

  const cgpa = attemptedCredits > 0 ? Math.round((weightedPoints / attemptedCredits) * 100) / 100 : 0.00;

  return {
    cgpa,
    totalEarnedCredits: Math.round(earnedCredits * 10) / 10,
    totalAttemptedCredits: Math.round(attemptedCredits * 10) / 10
  };
}
