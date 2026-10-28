import { describe, it, expect } from 'vitest';
import { marksToGrade, calculateSGPA, calculateCGPA } from '../src/utils/gpaCalculator';

describe('GPA Calculator (UGC 4.00 Standard Scale)', () => {
  describe('marksToGrade', () => {
    it('correctly maps 80%+ to A+ (4.00)', () => {
      expect(marksToGrade(80)).toEqual({ letterGrade: 'A+', gradePoint: 4.00 });
      expect(marksToGrade(95.5)).toEqual({ letterGrade: 'A+', gradePoint: 4.00 });
    });

    it('correctly maps 75-79 to A (3.75)', () => {
      expect(marksToGrade(75)).toEqual({ letterGrade: 'A', gradePoint: 3.75 });
      expect(marksToGrade(79)).toEqual({ letterGrade: 'A', gradePoint: 3.75 });
    });

    it('correctly maps 70-74 to A- (3.50)', () => {
      expect(marksToGrade(72)).toEqual({ letterGrade: 'A-', gradePoint: 3.50 });
    });

    it('correctly maps 65-69 to B+ (3.25)', () => {
      expect(marksToGrade(67)).toEqual({ letterGrade: 'B+', gradePoint: 3.25 });
    });

    it('correctly maps 60-64 to B (3.00)', () => {
      expect(marksToGrade(63)).toEqual({ letterGrade: 'B', gradePoint: 3.00 });
    });

    it('correctly maps 55-59 to B- (2.75)', () => {
      expect(marksToGrade(58)).toEqual({ letterGrade: 'B-', gradePoint: 2.75 });
    });

    it('correctly maps 50-54 to C+ (2.50)', () => {
      expect(marksToGrade(52)).toEqual({ letterGrade: 'C+', gradePoint: 2.50 });
    });

    it('correctly maps 45-49 to C (2.25)', () => {
      expect(marksToGrade(47)).toEqual({ letterGrade: 'C', gradePoint: 2.25 });
    });

    it('correctly maps 40-44 to D (2.00)', () => {
      expect(marksToGrade(40)).toEqual({ letterGrade: 'D', gradePoint: 2.00 });
    });

    it('correctly maps < 40 to F (0.00)', () => {
      expect(marksToGrade(39)).toEqual({ letterGrade: 'F', gradePoint: 0.00 });
      expect(marksToGrade(0)).toEqual({ letterGrade: 'F', gradePoint: 0.00 });
    });
  });

  describe('calculateSGPA', () => {
    it('returns 0 for empty courses array', () => {
      expect(calculateSGPA([])).toBe(0.00);
    });

    it('calculates weighted SGPA correctly', () => {
      const courses = [
        { credits: 3.0, gradePoint: 4.00 }, // 12
        { credits: 3.0, gradePoint: 3.75 }, // 11.25
        { credits: 1.5, gradePoint: 4.00 }, // 6
        { credits: 3.0, gradePoint: 3.50 }  // 10.5
      ];
      // Total credits = 10.5, total points = 39.75 -> SGPA = 3.7857 -> 3.79
      expect(calculateSGPA(courses)).toBe(3.79);
    });

    it('calculates SGPA when raw marks are provided instead of gradePoint', () => {
      const courses = [
        { credits: 3.0, marks: 85 }, // A+ 4.00 -> 12
        { credits: 3.0, marks: 76 }  // A 3.75 -> 11.25
      ];
      // Total credits = 6, total points = 23.25 -> 3.875 -> 3.88
      expect(calculateSGPA(courses)).toBe(3.88);
    });
  });

  describe('calculateCGPA', () => {
    it('calculates cumulative CGPA over multiple semesters', () => {
      const semesters = [
        { credits: 21.0, sgpa: 3.80 },
        { credits: 20.5, sgpa: 3.75 },
        { credits: 21.0, sgpa: 3.90 },
        { credits: 20.0, sgpa: 3.85 },
        { credits: 21.5, sgpa: 3.82 }
      ];
      // Total credits = 104
      // Total = 21*3.8 + 20.5*3.75 + 21*3.9 + 20*3.85 + 21.5*3.82 = 79.8 + 76.875 + 81.9 + 77 + 82.13 = 397.705
      // 397.705 / 104 = 3.824 -> 3.82
      expect(calculateCGPA(semesters)).toBe(3.82);
    });
  });
});
