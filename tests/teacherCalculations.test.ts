import { describe, it, expect } from 'vitest';
import {
  computeTotalMarks,
  validateMarksInput,
  calculateAttendanceMetrics,
  MARKS_LIMITS
} from '../src/utils/marksCalculator';
import { marksToGrade } from '../src/utils/gpaCalculator';

describe('Teacher Calculations & Academic Ordinance Rules', () => {
  describe('Attendance Percentage Calculation', () => {
    it('returns 100% and safe when total is 0 or unrecorded', () => {
      const res = calculateAttendanceMetrics(0, 0);
      expect(res.percentage).toBe(100);
      expect(res.status).toBe('safe');
    });

    it('returns safe status when attendance >= 75%', () => {
      const res1 = calculateAttendanceMetrics(22, 25); // 88%
      expect(res1.percentage).toBe(88);
      expect(res1.status).toBe('safe');

      const res2 = calculateAttendanceMetrics(15, 20); // 75%
      expect(res2.percentage).toBe(75);
      expect(res2.status).toBe('safe');
    });

    it('returns warning status when attendance is 60% to 74.9%', () => {
      const res = calculateAttendanceMetrics(18, 25); // 72%
      expect(res.percentage).toBe(72);
      expect(res.status).toBe('warning');

      const resEdge = calculateAttendanceMetrics(12, 20); // 60%
      expect(resEdge.percentage).toBe(60);
      expect(resEdge.status).toBe('warning');
    });

    it('returns critical status when attendance < 60%', () => {
      const res = calculateAttendanceMetrics(11, 20); // 55%
      expect(res.percentage).toBe(55);
      expect(res.status).toBe('critical');

      const resZero = calculateAttendanceMetrics(0, 20); // 0%
      expect(resZero.percentage).toBe(0);
      expect(resZero.status).toBe('critical');
    });
  });

  describe('Marks Total Calculation & Breakdown', () => {
    it('computes total marks out of 100 and applies UGC letter grade', () => {
      const input = {
        attendance: 9.0, // max 10
        classTests: 18.0, // max 20
        midterm: 17.5, // max 20
        finalExam: 42.0 // max 50
      };
      // Total = 9 + 18 + 17.5 + 42 = 86.5 -> A+ (4.00)
      const computed = computeTotalMarks(input);
      expect(computed.totalMarks).toBe(86.5);
      expect(computed.letterGrade).toBe('A+');
      expect(computed.gradePoint).toBe(4.00);
    });

    it('computes grade B+ for score 68.0', () => {
      const input = {
        attendance: 7.0,
        classTests: 14.0,
        midterm: 13.0,
        finalExam: 34.0
      };
      // Total = 7 + 14 + 13 + 34 = 68.0 -> B+ (3.25)
      const computed = computeTotalMarks(input);
      expect(computed.totalMarks).toBe(68.0);
      expect(computed.letterGrade).toBe('B+');
      expect(computed.gradePoint).toBe(3.25);
    });

    it('computes failing grade F (0.00) when total is below 40', () => {
      const input = {
        attendance: 4.0,
        classTests: 8.0,
        midterm: 6.0,
        finalExam: 15.0
      };
      // Total = 33.0 -> F (0.00)
      const computed = computeTotalMarks(input);
      expect(computed.totalMarks).toBe(33.0);
      expect(computed.letterGrade).toBe('F');
      expect(computed.gradePoint).toBe(0.00);
    });
  });

  describe('Marks Validation Rules', () => {
    it('accepts marks within legitimate boundaries', () => {
      const result = validateMarksInput({
        attendance: 10,
        classTests: 20,
        midterm: 20,
        finalExam: 50
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('rejects attendance greater than 10', () => {
      const result = validateMarksInput({ attendance: 10.5 });
      expect(result.isValid).toBe(false);
      expect(result.errors.attendance).toBeDefined();
    });

    it('rejects class tests greater than 20', () => {
      const result = validateMarksInput({ classTests: 21 });
      expect(result.isValid).toBe(false);
      expect(result.errors.classTests).toBeDefined();
    });

    it('rejects midterm marks greater than 20', () => {
      const result = validateMarksInput({ midterm: 25 });
      expect(result.isValid).toBe(false);
      expect(result.errors.midterm).toBeDefined();
    });

    it('rejects final exam marks greater than 50', () => {
      const result = validateMarksInput({ finalExam: 52 });
      expect(result.isValid).toBe(false);
      expect(result.errors.finalExam).toBeDefined();
    });

    it('rejects negative marks values', () => {
      const result = validateMarksInput({ attendance: -1, classTests: -5 });
      expect(result.isValid).toBe(false);
      expect(result.errors.attendance).toBeDefined();
      expect(result.errors.classTests).toBeDefined();
    });
  });

  describe('Teacher Authorization & Unassigned Course Check', () => {
    it('throws TeacherPermissionError when teacher attempts to access an unassigned course', async () => {
      const { MockTeacherDataService } = await import('../src/services/teacher/mockTeacherDataService');
      const { TeacherPermissionError } = await import('../src/services/teacher/types');

      const service = new MockTeacherDataService();
      const teacherEmail = 'teacher.demo@jstu.ac.bd';
      const unassignedCourseCode = 'CSE-3203'; // Computer Networks, assigned to Dr. Fatima

      // Attempting to get course detail for unassigned course must throw TeacherPermissionError
      await expect(service.getCourseDetail(teacherEmail, unassignedCourseCode)).rejects.toThrow(
        TeacherPermissionError
      );

      // Attempting to save attendance for unassigned course must also reject
      await expect(
        service.saveAttendance(teacherEmail, {
          courseCode: unassignedCourseCode,
          date: '2026-10-05',
          records: []
        })
      ).rejects.toThrow(TeacherPermissionError);

      // Attempting to publish announcement for unassigned course must reject
      await expect(
        service.publishAnnouncement(teacherEmail, {
          courseCode: unassignedCourseCode,
          title: 'Unauthorized announcement',
          content: 'Should not succeed'
        })
      ).rejects.toThrow(TeacherPermissionError);
    });

    it('allows access when teacher is assigned to the course', async () => {
      const { MockTeacherDataService } = await import('../src/services/teacher/mockTeacherDataService');

      const service = new MockTeacherDataService();
      const teacherEmail = 'teacher.demo@jstu.ac.bd';
      const assignedCourseCode = 'CSE-3201'; // Compiler Design, assigned to Dr. Shahadat

      const course = await service.getCourseDetail(teacherEmail, assignedCourseCode);
      expect(course).toBeDefined();
      expect(course.code).toBe('CSE-3201');
    });
  });

  describe('Cross-Role Flow (Teacher mutations visible to Student)', () => {
    it('propagates teacher assignment creation to student portal', async () => {
      const { MockTeacherDataService } = await import('../src/services/teacher/mockTeacherDataService');
      const { MockStudentDataService } = await import('../src/services/student/mockStudentDataService');

      const teacherService = new MockTeacherDataService();
      const studentService = new MockStudentDataService();

      const uniqueTitle = `Cross-Role Test Assignment ${Date.now()}`;
      await teacherService.createAssignment('teacher.demo@jstu.ac.bd', {
        courseCode: 'CSE-3201',
        title: uniqueTitle,
        description: 'Test cross-role synchronization',
        dueDate: '2026-10-30T23:59:59Z',
        maxMarks: 25
      });

      const studentAssignments = await studentService.getAssignments('demo_student_uid');
      const found = studentAssignments.find((a) => a.title === uniqueTitle);
      expect(found).toBeDefined();
      expect(found?.maxMarks).toBe(25);
      expect(found?.status).toBe('pending');
    });

    it('propagates teacher assignment grading to student portal', async () => {
      const { MockTeacherDataService } = await import('../src/services/teacher/mockTeacherDataService');
      const { MockStudentDataService } = await import('../src/services/student/mockStudentDataService');

      const teacherService = new MockTeacherDataService();
      const studentService = new MockStudentDataService();

      // Submit assignment as student
      await studentService.submitAssignment('demo_student_uid', 'asg-1', {
        name: 'Tanvir_Compiler_Asg2.pdf',
        size: 1024 * 1024 * 2
      });

      // Grade as teacher
      await teacherService.gradeSubmission('teacher.demo@jstu.ac.bd', {
        assignmentId: 'asg-1',
        submissionId: 'asg-1', // will match the student's submission in asg-1
        score: 19.0,
        feedback: 'Superb lexical grammar implementation.'
      }).catch(async () => {
        // Find actual submission ID
        const assignments = await teacherService.getAssignments('teacher.demo@jstu.ac.bd');
        const asg1 = assignments.find((a) => a.id === 'asg-1');
        const sub = asg1?.submissions.find((s: any) => s.studentId === 'JSTU2026001');
        if (sub) {
          await teacherService.gradeSubmission('teacher.demo@jstu.ac.bd', {
            assignmentId: 'asg-1',
            submissionId: sub.id,
            score: 19.0,
            feedback: 'Superb lexical grammar implementation.'
          });
        }
      });

      const studentAssignments = await studentService.getAssignments('demo_student_uid');
      const asg1Student = studentAssignments.find((a) => a.id === 'asg-1');
      expect(asg1Student?.score).toBe(19.0);
      expect(asg1Student?.feedback).toContain('lexical grammar');
    });

    it('propagates teacher announcement to student course details', async () => {
      const { MockTeacherDataService } = await import('../src/services/teacher/mockTeacherDataService');
      const { MockStudentDataService } = await import('../src/services/student/mockStudentDataService');

      const teacherService = new MockTeacherDataService();
      const studentService = new MockStudentDataService();

      const announcementTitle = `Pop Quiz Notice ${Date.now()}`;
      await teacherService.publishAnnouncement('teacher.demo@jstu.ac.bd', {
        courseCode: 'CSE-3201',
        title: announcementTitle,
        content: 'Be prepared for a surprise quiz next Sunday.'
      });

      const course = await studentService.getCourseDetail('demo_student_uid', 'CSE-3201');
      expect(course?.announcements.some((a) => a.title === announcementTitle)).toBe(true);
    });
  });
});
