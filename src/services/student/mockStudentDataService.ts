/**
 * JSTU Smart Campus — Mock Student Data Service
 * 
 * Refactored to read/write from SharedDataStoreManager (localStorage single source of truth).
 * Cross-role state updates from Teacher portal are immediately visible here.
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */

import {
  StudentDataService,
  StudentDashboardData,
  CourseItem,
  CourseDetail,
  AttendanceCourse,
  SemesterResult,
  ClassScheduleItem,
  AssignmentItem,
  FeeBreakdown,
  StudentNotification,
  StudentProfileData
} from './types';
import { SharedDataStoreManager, SharedCourse } from '../shared/sharedDataStore';
import { calculateSGPA } from '../../utils/gpaCalculator';
import { calculateAttendanceMetrics } from '../../utils/marksCalculator';

export class MockStudentDataService implements StudentDataService {
  private storeManager = SharedDataStoreManager.getInstance();

  private getStudentId(): string {
    return 'JSTU2026001';
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getDashboardData(_studentUid: string): Promise<StudentDashboardData> {
    const store = this.storeManager.getStore();
    const studentId = this.getStudentId();
    const profile = store.students[studentId] || Object.values(store.students)[0];

    // Compute dynamic attendance across 6th semester courses
    let totalClasses = 0;
    let attendedClasses = 0;

    store.courses.forEach((c) => {
      const isEnrolled = c.enrolledStudents.some((st) => st.studentId === studentId);
      if (isEnrolled) {
        c.attendanceSessions.forEach((sess) => {
          totalClasses++;
          const rec = sess.records.find((r) => r.studentId === studentId);
          if (rec && rec.status === 'present') {
            attendedClasses++;
          }
        });
      }
    });

    const overallAttendance = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 85;

    // Count pending assignments
    let pendingAssignments = 0;
    store.assignments.forEach((asg) => {
      const mySub = asg.submissions.find((s) => s.studentId === studentId);
      if (!mySub || mySub.status === 'submitted') {
        if (!mySub) pendingAssignments++;
      }
    });

    const unpaidFeesCount = store.feeBreakdown.invoices.filter((i) => i.status === 'unpaid').length;
    const unreadNotifications = store.studentNotifications.filter((n) => !n.read).length;

    const todayClasses = [
      {
        id: 'tc-1',
        courseCode: 'CSE-3201',
        courseTitle: 'Compiler Design',
        courseTitleBn: 'কম্পাইলার ডিজাইন',
        timeSlot: '09:00 AM - 10:20 AM',
        room: 'Academic Bldg 2, Room 402',
        instructor: 'Dr. Shahadat Hossain',
        status: 'completed' as const
      },
      {
        id: 'tc-2',
        courseCode: 'CSE-3203',
        courseTitle: 'Computer Networks',
        courseTitleBn: 'কম্পিউটার নেটওয়ার্কস',
        timeSlot: '10:30 AM - 11:50 AM',
        room: 'Academic Bldg 2, Room 402',
        instructor: 'Dr. Syeda Fatima',
        status: 'ongoing' as const
      },
      {
        id: 'tc-3',
        courseCode: 'CSE-3205',
        courseTitle: 'Software Engineering',
        courseTitleBn: 'সফটওয়্যার ইঞ্জিনিয়ারিং',
        timeSlot: '10:30 AM - 11:50 AM',
        room: 'Academic Bldg 2, Room 402',
        instructor: 'Dr. Shahadat Hossain',
        status: 'upcoming' as const
      }
    ];

    const departmentNotices = [
      {
        id: 'dn-1',
        title: 'CSE Department 6th Semester Midterm Examination Schedule',
        titleBn: 'সিএসই বিভাগের ৬ষ্ঠ সেমিস্টার মিডটার্ম পরীক্ষার সময়সূচি',
        date: '2026-10-03',
        category: 'Exam',
        isImportant: true
      },
      {
        id: 'dn-2',
        title: 'Software Project Lab Submission Guidelines (CSE-3205)',
        titleBn: 'সফটওয়্যার প্রজেক্ট ল্যাব জমা দেওয়ার নির্দেশিকা',
        date: '2026-09-30',
        category: 'Academic'
      },
      {
        id: 'dn-3',
        title: 'Special ACM-ICPC Practice Contest Registration',
        titleBn: 'বিশেষ এসিএম-আইসিপিসি প্রোগ্রামিং প্রতিযোগিতা নিবন্ধন',
        date: '2026-09-25',
        category: 'Workshop'
      }
    ];

    const quickActions = [
      { title: 'My Routine', titleBn: 'ক্লাস রুটিন', to: '/student/routine', icon: 'Clock' },
      { title: 'Pay Dues', titleBn: 'ফি পরিশোধ', to: '/student/fees', icon: 'CreditCard' },
      { title: 'Upload Assignment', titleBn: 'অ্যাসাইনমেন্ট', to: '/student/assignments', icon: 'Upload' },
      { title: 'Semester Grades', titleBn: 'ফলাফল', to: '/student/results', icon: 'Award' }
    ];

    return {
      stats: {
        cgpa: profile.cgpa,
        completedCredits: profile.creditsEarned,
        currentSemesterCredits: 15.0,
        overallAttendanceRate: overallAttendance,
        pendingAssignmentsCount: pendingAssignments,
        unpaidFeesCount,
        unreadNotificationsCount: unreadNotifications
      },
      todayClasses,
      departmentNotices,
      quickActions
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getCourses(_studentUid: string): Promise<CourseItem[]> {
    const store = this.storeManager.getStore();
    const studentId = this.getStudentId();

    return store.courses
      .filter((c) => c.enrolledStudents.some((st) => st.studentId === studentId))
      .map((c) => {
        let attended = 0;
        const total = c.attendanceSessions.length;
        c.attendanceSessions.forEach((s) => {
          const r = s.records.find((rec) => rec.studentId === studentId);
          if (r && r.status === 'present') attended++;
        });
        const metrics = calculateAttendanceMetrics(attended, total);

        return {
          id: c.id,
          code: c.code,
          title: c.title,
          titleBn: c.titleBn,
          credits: c.credits,
          semester: c.semester,
          department: c.department,
          instructor: c.instructor,
          instructorEmail: c.instructorEmail,
          attendancePercentage: metrics.percentage
        };
      });
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getCourseDetail(_studentUid: string, courseCode: string): Promise<CourseDetail | null> {
    const store = this.storeManager.getStore();
    const studentId = this.getStudentId();

    const c = store.courses.find(
      (course) => course.code.toLowerCase() === courseCode.toLowerCase() || course.id.toLowerCase() === courseCode.toLowerCase()
    );

    if (!c) return null;

    let attended = 0;
    const total = c.attendanceSessions.length;
    c.attendanceSessions.forEach((s) => {
      const r = s.records.find((rec) => rec.studentId === studentId);
      if (r && r.status === 'present') attended++;
    });
    const metrics = calculateAttendanceMetrics(attended, total);

    // Only display continuous assessment and final exam breakdown if published or for ongoing continuous work
    const isSheetPublished = c.marksSheet.status === 'PUBLISHED';
    const markEntry = c.marksSheet.entries[studentId];

    return {
      id: c.id,
      code: c.code,
      title: c.title,
      titleBn: c.titleBn,
      credits: c.credits,
      semester: c.semester,
      department: c.department,
      instructor: c.instructor,
      instructorEmail: c.instructorEmail,
      attendancePercentage: metrics.percentage,
      syllabusOverview: c.syllabusOverview,
      syllabusOverviewBn: c.syllabusOverviewBn,
      materials: c.materials,
      announcements: c.announcements,
      attendanceBreakdown: {
        totalClasses: total,
        attendedClasses: attended,
        percentage: metrics.percentage
      },
      marksBreakdown: isSheetPublished && markEntry
        ? {
            classAttendance: markEntry.attendance,
            quizzes: markEntry.classTests,
            midterm: markEntry.midterm,
            semesterFinal: markEntry.finalExam,
            totalEstimated: markEntry.total,
            letterGrade: markEntry.letterGrade
          }
        : {
            classAttendance: markEntry?.attendance ?? 0,
            quizzes: markEntry?.classTests ?? 0,
            midterm: markEntry?.midterm ?? 0,
            semesterFinal: undefined,
            totalEstimated: 0,
            letterGrade: undefined
          }
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getAttendance(_studentUid: string): Promise<AttendanceCourse[]> {
    const store = this.storeManager.getStore();
    const studentId = this.getStudentId();

    return store.courses
      .filter((c) => c.enrolledStudents.some((st) => st.studentId === studentId))
      .map((c) => {
        let attended = 0;
        const total = c.attendanceSessions.length;
        c.attendanceSessions.forEach((s) => {
          const r = s.records.find((rec) => rec.studentId === studentId);
          if (r && r.status === 'present') attended++;
        });

        const metrics = calculateAttendanceMetrics(attended, total);

        return {
          code: c.code,
          title: c.title,
          titleBn: c.titleBn,
          credits: c.credits,
          attended,
          total,
          percentage: metrics.percentage,
          status: metrics.status
        };
      });
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getResults(_studentUid: string): Promise<SemesterResult[]> {
    const store = this.storeManager.getStore();
    const studentId = this.getStudentId();

    // 1. Build dynamically for 6th Semester from store.courses taking Tanvir
    const sixthSemCourses = store.courses.filter(
      (c) => c.enrolledStudents.some((st) => st.studentId === studentId) && c.semester.includes('6th')
    );

    const dynamic6thRecords = sixthSemCourses.map((c) => {
      const isPublished = c.marksSheet.status === 'PUBLISHED';
      const entry = c.marksSheet.entries[studentId];

      if (isPublished && entry) {
        return {
          code: c.code,
          title: c.title,
          titleBn: c.titleBn,
          credits: c.credits,
          marks: entry.total,
          letterGrade: entry.letterGrade,
          gradePoint: entry.gradePoint,
          status: 'PUBLISHED' as const,
          isPending: false
        };
      }

      return {
        code: c.code,
        title: c.title,
        titleBn: c.titleBn,
        credits: c.credits,
        marks: undefined,
        letterGrade: undefined,
        gradePoint: undefined,
        status: (c.marksSheet.status || 'PENDING') as any,
        isPending: true
      };
    });

    const published6thOnly = dynamic6thRecords.filter((r) => !r.isPending && r.gradePoint !== undefined);
    const earnedCredits6th = published6thOnly.reduce((sum, r) => (r.gradePoint! > 0 ? sum + r.credits : sum), 0);
    const totalCredits6th = dynamic6thRecords.reduce((sum, r) => sum + r.credits, 0);

    const sgpa6th = published6thOnly.length > 0
      ? calculateSGPA(published6thOnly.map((r) => ({ credits: r.credits, gradePoint: r.gradePoint! })))
      : 0.00;

    const sixthSemesterResult: SemesterResult = {
      semesterNumber: 6,
      semesterName: '6th Semester (3rd Year 2nd Term)',
      semesterNameBn: '৬ষ্ঠ সেমিস্টার (৩য় বর্ষ ২য় টার্ম)',
      session: '2025-2026',
      status: published6thOnly.length === dynamic6thRecords.length && dynamic6thRecords.length > 0 ? 'published' : 'in_progress',
      totalCredits: totalCredits6th,
      earnedCredits: earnedCredits6th,
      sgpa: sgpa6th,
      cumulativeCgpa: 0,
      courses: dynamic6thRecords
    };

    // Combine historic 1st semester with current 6th semester
    const allResults = [...store.results, sixthSemesterResult];

    // Compute cumulative CGPA progression
    let accumulatedCredits = 0;
    let accumulatedWeighted = 0;

    return allResults.map((sem) => {
      const publishedCourses = sem.courses.filter((c) => !c.isPending && c.gradePoint !== undefined);
      const semSgpa = publishedCourses.length > 0
        ? calculateSGPA(publishedCourses.map((c) => ({ credits: c.credits, gradePoint: c.gradePoint! })))
        : 0.00;

      publishedCourses.forEach((c) => {
        accumulatedCredits += c.credits;
        accumulatedWeighted += c.credits * (c.gradePoint || 0);
      });

      const runningCgpa = accumulatedCredits > 0
        ? Math.round((accumulatedWeighted / accumulatedCredits) * 100) / 100
        : semSgpa;

      return {
        ...sem,
        sgpa: semSgpa,
        cumulativeCgpa: runningCgpa
      };
    });
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getClassRoutine(_studentUid: string): Promise<Record<string, ClassScheduleItem[]>> {
    const store = this.storeManager.getStore();
    return store.routine;
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getAssignments(_studentUid: string): Promise<AssignmentItem[]> {
    const store = this.storeManager.getStore();
    const studentId = this.getStudentId();

    return store.assignments.map((asg) => {
      const sub = asg.submissions.find((s) => s.studentId === studentId);
      return {
        id: asg.id,
        courseCode: asg.courseCode,
        courseTitle: asg.courseTitle,
        title: asg.title,
        description: asg.description,
        dueDate: asg.dueDate,
        maxMarks: asg.maxMarks,
        status: sub ? sub.status : 'pending',
        submittedAt: sub?.submittedAt,
        fileName: sub?.fileName,
        fileSize: sub?.fileSize,
        fileUrl: sub?.fileUrl,
        score: sub?.score,
        feedback: sub?.feedback
      };
    });
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async submitAssignment(
    _studentUid: string,
    assignmentId: string,
    file: { name: string; size: number }
  ): Promise<{ success: boolean; message: string }> {
    const store = this.storeManager.getStore();
    const studentId = this.getStudentId();
    const asg = store.assignments.find((a) => a.id === assignmentId);

    if (!asg) {
      throw new Error('Assignment not found.');
    }

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);

    const existingSubIndex = asg.submissions.findIndex((s) => s.studentId === studentId);
    const subRecord = {
      id: existingSubIndex >= 0 ? asg.submissions[existingSubIndex].id : `sub-${Date.now()}`,
      assignmentId,
      studentId,
      studentName: 'Tanvir Ahmed',
      studentEmail: 'student.demo@jstu.ac.bd',
      submittedAt: new Date().toISOString(),
      fileName: file.name,
      fileSize: `${sizeInMb} MB`,
      fileUrl: '#',
      status: 'submitted' as const
    };

    if (existingSubIndex >= 0) {
      asg.submissions[existingSubIndex] = subRecord;
    } else {
      asg.submissions.push(subRecord);
    }

    // Cross-role notification to teacher!
    store.teacherNotifications.unshift({
      id: `t-notif-sub-${Date.now()}`,
      title: `Assignment Submitted: ${asg.courseCode}`,
      titleBn: `অ্যাসাইনমেন্ট জমা পড়েছে: ${asg.courseCode}`,
      message: `Tanvir Ahmed submitted file for "${asg.title}".`,
      messageBn: `তানভীর আহমেদ "${asg.title}" এর সমাধান জমা দিয়েছেন।`,
      category: 'submission',
      timestamp: new Date().toISOString(),
      read: false,
      link: '/teacher/assignments'
    });

    this.storeManager.saveStore(store);
    return { success: true, message: `Assignment "${asg.title}" submitted successfully.` };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getFees(_studentUid: string): Promise<FeeBreakdown> {
    const store = this.storeManager.getStore();
    return store.feeBreakdown;
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async payFee(
    _studentUid: string,
    invoiceId: string,
    method: string
  ): Promise<{ success: boolean; transactionId: string; message: string }> {
    const store = this.storeManager.getStore();
    const inv = store.feeBreakdown.invoices.find((i) => i.id === invoiceId);
    if (!inv) {
      throw new Error('Invoice not found');
    }

    const txId = `TXN-${method.toUpperCase()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    inv.status = 'paid';
    inv.paidAt = new Date().toISOString();
    inv.paymentMethod = method;
    inv.transactionId = txId;

    store.feeBreakdown.totalPaid += inv.amount;
    store.feeBreakdown.totalDue = Math.max(0, store.feeBreakdown.totalDue - inv.amount);

    this.storeManager.saveStore(store);

    return {
      success: true,
      transactionId: txId,
      message: `Payment of ৳${inv.amount.toLocaleString()} confirmed via ${method}. Transaction ID: ${txId}`
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getNotifications(_studentUid: string): Promise<StudentNotification[]> {
    const store = this.storeManager.getStore();
    return store.studentNotifications;
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async markNotificationRead(_studentUid: string, notificationId: string): Promise<void> {
    const store = this.storeManager.getStore();
    const notif = store.studentNotifications.find((n) => n.id === notificationId);
    if (notif) {
      notif.read = true;
      this.storeManager.saveStore(store);
    }
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getProfile(_studentUid: string): Promise<StudentProfileData> {
    const store = this.storeManager.getStore();
    return store.students[this.getStudentId()] || Object.values(store.students)[0];
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  resetDemoData(): void {
    this.storeManager.resetStore();
  }
}
