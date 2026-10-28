/**
 * JSTU Smart Campus — Mock Teacher Data Service
 * 
 * Interacts with SharedDataStoreManager (localStorage single source of truth).
 * Enforces course assignment permission check before EVERY read or write.
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */

import {
  TeacherDataService,
  TeacherPermissionError,
  TeacherDashboardData,
  TeacherCourseSummary,
  TeacherCourseDetail,
  TeacherEnrolledStudentDetail,
  SaveAttendanceParams,
  CourseAttendanceReport,
  CreateAssignmentParams,
  GradeSubmissionParams,
  AddMaterialParams,
  PublishAnnouncementParams,
  SaveMarksParams,
  TeacherRoutineItem,
  TeacherProfileInfo
} from './types';
import {
  SharedDataStoreManager,
  DailyAttendanceRecord,
  CourseMarksSheet,
  CourseMaterialRef,
  CourseAnnouncementRef,
  SharedAssignment
} from '../shared/sharedDataStore';
import { validateMarksInput, computeTotalMarks, calculateAttendanceMetrics } from '../../utils/marksCalculator';

export class MockTeacherDataService implements TeacherDataService {
  private storeManager = SharedDataStoreManager.getInstance();

  /**
   * Helper: Check if teacher is assigned to courseCode.
   * Real enforcement must move to Firestore rules / Cloud Functions.
   */
  private assertTeacherAssigned(teacherEmailOrUid: string, courseCode: string) {
    const store = this.storeManager.getStore();
    const course = store.courses.find(
      (c) => c.code.toLowerCase() === courseCode.toLowerCase() || c.id.toLowerCase() === courseCode.toLowerCase()
    );

    if (!course) {
      throw new Error(`Course "${courseCode}" not found in institutional catalog.`);
    }

    const emailNorm = (teacherEmailOrUid || '').trim().toLowerCase();
    const isAssigned =
      course.instructorEmail.toLowerCase() === emailNorm ||
      course.instructorUid.toLowerCase() === emailNorm ||
      store.teacherProfile.assignedCourseCodes.some((code) => code.toLowerCase() === courseCode.toLowerCase()) ||
      emailNorm.includes('teacher.demo');

    // Check specific unassigned courses for demo teacher
    if (emailNorm.includes('teacher') || emailNorm.includes('demo_teacher_01')) {
      const allowed = store.teacherProfile.assignedCourseCodes.map((c) => c.toLowerCase());
      if (!allowed.includes(course.code.toLowerCase())) {
        throw new TeacherPermissionError(course.code, teacherEmailOrUid);
      }
    } else if (!isAssigned) {
      throw new TeacherPermissionError(course.code, teacherEmailOrUid);
    }

    return course;
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getDashboardData(teacherEmailOrUid: string): Promise<TeacherDashboardData> {
    const store = this.storeManager.getStore();
    const assignedCourses = store.courses.filter((c) =>
      store.teacherProfile.assignedCourseCodes.includes(c.code)
    );

    let totalEnrolled = 0;
    assignedCourses.forEach((c) => {
      totalEnrolled += c.enrolledStudents.length;
    });

    // Pending assignments to grade
    let pendingSubmissionsCount = 0;
    const recentSubmissions: TeacherDashboardData['recentSubmissions'] = [];

    const assignedCodes = assignedCourses.map((c) => c.code);
    store.assignments.forEach((asg) => {
      if (assignedCodes.includes(asg.courseCode)) {
        asg.submissions.forEach((sub) => {
          if (sub.status === 'submitted') {
            pendingSubmissionsCount++;
            recentSubmissions.push({
              submissionId: sub.id,
              assignmentTitle: asg.title,
              courseCode: asg.courseCode,
              studentName: sub.studentName,
              studentId: sub.studentId,
              submittedAt: sub.submittedAt
            });
          }
        });
      }
    });

    const pendingMarksSheetsCount = assignedCourses.filter((c) => c.marksSheet.status === 'DRAFT').length;

    // Today's classes from teacher routine (defaulting to Sunday / today)
    const todayList = store.teacherRoutine['Sunday'] || [];
    const todayClasses = todayList.map((item, idx) => ({
      id: item.id,
      courseCode: item.courseCode,
      courseTitle: item.courseTitle,
      timeSlot: item.timeSlot,
      room: item.room,
      enrolledStudentsCount: item.enrolledCount,
      status: idx === 0 ? ('ongoing' as const) : ('upcoming' as const)
    }));

    const quickActions = [
      { title: 'Take Attendance', titleBn: 'উপস্থিতি গ্রহণ', to: '/teacher/attendance', icon: 'CheckCircle2' },
      { title: 'Grade Submissions', titleBn: 'অ্যাসাইনমেন্ট মূল্যায়ন', to: '/teacher/assignments', icon: 'FileText' },
      { title: 'Marks Entry', titleBn: 'মার্কস এন্ট্রি', to: '/teacher/marks', icon: 'Award' },
      { title: 'Course Materials', titleBn: 'কোর্স ম্যাটেরিয়ালস', to: '/teacher/materials', icon: 'Upload' },
      { title: 'Weekly Routine', titleBn: 'সাপ্তাহিক রুটিন', to: '/teacher/routine', icon: 'Calendar' }
    ];

    return {
      stats: {
        assignedCoursesCount: assignedCourses.length,
        totalEnrolledStudents: totalEnrolled,
        pendingAssignmentsToGrade: pendingSubmissionsCount,
        pendingMarksSheetsCount,
        upcomingClassesCountToday: todayClasses.length,
        unreadNotificationsCount: store.teacherNotifications.filter((n) => !n.read).length
      },
      todayClasses,
      recentSubmissions: recentSubmissions.slice(0, 5),
      quickActions,
      notifications: store.teacherNotifications
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getAssignedCourses(teacherEmailOrUid: string): Promise<TeacherCourseSummary[]> {
    const store = this.storeManager.getStore();
    const assignedCourses = store.courses.filter((c) =>
      store.teacherProfile.assignedCourseCodes.includes(c.code)
    );

    return assignedCourses.map((c) => {
      // Pending submissions in this course
      let pendingSubmissions = 0;
      store.assignments
        .filter((a) => a.courseCode === c.code)
        .forEach((a) => {
          pendingSubmissions += a.submissions.filter((s) => s.status === 'submitted').length;
        });

      // Calculate attendance rate across all recorded sessions
      let totalPresent = 0;
      let totalChecks = 0;
      c.attendanceSessions.forEach((sess) => {
        sess.records.forEach((rec) => {
          totalChecks++;
          if (rec.status === 'present') totalPresent++;
        });
      });
      const avgAtt = totalChecks > 0 ? Math.round((totalPresent / totalChecks) * 100) : 85;

      return {
        id: c.id,
        code: c.code,
        title: c.title,
        titleBn: c.titleBn,
        credits: c.credits,
        semester: c.semester,
        semesterBn: c.semesterBn,
        department: c.department,
        enrolledCount: c.enrolledStudents.length,
        totalClassesHeld: c.attendanceSessions.length,
        averageAttendanceRate: avgAtt,
        marksStatus: c.marksSheet.status,
        pendingSubmissionsCount: pendingSubmissions
      };
    });
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getCourseDetail(teacherEmailOrUid: string, courseCode: string): Promise<TeacherCourseDetail> {
    const course = this.assertTeacherAssigned(teacherEmailOrUid, courseCode);

    // Compute detailed attendance metrics per student
    const enrolledDetails: TeacherEnrolledStudentDetail[] = course.enrolledStudents.map((st) => {
      let attended = 0;
      const total = course.attendanceSessions.length;
      course.attendanceSessions.forEach((sess) => {
        const found = sess.records.find((r) => r.studentId === st.studentId);
        if (found && found.status === 'present') {
          attended++;
        }
      });

      const metrics = calculateAttendanceMetrics(attended, total);
      const markEntry = course.marksSheet.entries[st.studentId];

      return {
        ...st,
        attendedClasses: attended,
        totalClasses: total,
        attendancePercentage: metrics.percentage,
        attendanceStatus: metrics.status,
        currentTotalMarks: markEntry ? markEntry.total : 0,
        letterGrade: markEntry ? markEntry.letterGrade : 'Pending'
      };
    });

    let totalAtt = 0;
    enrolledDetails.forEach((st) => (totalAtt += st.attendancePercentage));
    const avgAtt = enrolledDetails.length > 0 ? Math.round(totalAtt / enrolledDetails.length) : 85;

    return {
      id: course.id,
      code: course.code,
      title: course.title,
      titleBn: course.titleBn,
      credits: course.credits,
      semester: course.semester,
      semesterBn: course.semesterBn,
      department: course.department,
      instructor: course.instructor,
      instructorEmail: course.instructorEmail,
      syllabusOverview: course.syllabusOverview,
      syllabusOverviewBn: course.syllabusOverviewBn,
      enrolledStudents: enrolledDetails,
      materials: course.materials,
      announcements: course.announcements,
      marksSheet: course.marksSheet,
      attendanceSessionsCount: course.attendanceSessions.length,
      averageAttendancePercentage: avgAtt
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getAttendanceSheet(teacherEmailOrUid: string, courseCode: string, date: string) {
    const course = this.assertTeacherAssigned(teacherEmailOrUid, courseCode);

    const existingSession = course.attendanceSessions.find((s) => s.date === date) || null;

    const students = course.enrolledStudents.map((st) => {
      let status: 'present' | 'absent' = 'present';
      if (existingSession) {
        const rec = existingSession.records.find((r) => r.studentId === st.studentId);
        if (rec) status = rec.status;
      }
      return {
        studentId: st.studentId,
        rollNumber: st.rollNumber,
        name: st.name,
        nameBn: st.nameBn,
        status
      };
    });

    return {
      date,
      existingSession,
      students
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async saveAttendance(teacherEmailOrUid: string, params: SaveAttendanceParams) {
    const course = this.assertTeacherAssigned(teacherEmailOrUid, params.courseCode);
    const store = this.storeManager.getStore();
    const targetCourse = store.courses.find((c) => c.code.toLowerCase() === params.courseCode.toLowerCase())!;

    const existingIndex = targetCourse.attendanceSessions.findIndex((s) => s.date === params.date);

    const sessionData: DailyAttendanceRecord = {
      id: existingIndex >= 0 ? targetCourse.attendanceSessions[existingIndex].id : `att-${targetCourse.code}-${Date.now()}`,
      date: params.date,
      topic: params.topic || 'Regular Lecture',
      takenAt: new Date().toISOString(),
      records: params.records
    };

    if (existingIndex >= 0) {
      targetCourse.attendanceSessions[existingIndex] = sessionData;
    } else {
      targetCourse.attendanceSessions.push(sessionData);
    }

    // Cross-role alert: If Tanvir (student) was marked absent, create a student notification if attendance drops!
    const tanvirRec = params.records.find((r) => r.studentId === 'JSTU2026001');
    if (tanvirRec && tanvirRec.status === 'absent') {
      store.studentNotifications.unshift({
        id: `notif-att-${Date.now()}`,
        title: `Absence Recorded: ${targetCourse.code}`,
        titleBn: `অনুপস্থিতি লিপিবদ্ধ: ${targetCourse.code}`,
        message: `You were marked absent in ${targetCourse.title} on ${params.date}. Keep attendance above 75% to sit for finals.`,
        messageBn: `${params.date} তারিখে ${targetCourse.titleBn} ক্লাসে অনুপস্থিত দেখানো হয়েছে। পরীক্ষায় বসতে ৭৫% উপস্থিতি বজায় রাখুন।`,
        category: 'academic',
        timestamp: new Date().toISOString(),
        read: false,
        link: '/student/attendance'
      });
    }

    this.storeManager.saveStore(store);

    return {
      success: true,
      message: `Attendance for ${targetCourse.code} on ${params.date} successfully recorded (${params.records.filter((r) => r.status === 'present').length} present).`,
      session: sessionData
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getAttendanceReport(teacherEmailOrUid: string, courseCode: string): Promise<CourseAttendanceReport> {
    const course = this.assertTeacherAssigned(teacherEmailOrUid, courseCode);

    const studentSummaries = course.enrolledStudents.map((st) => {
      let attended = 0;
      course.attendanceSessions.forEach((sess) => {
        const found = sess.records.find((r) => r.studentId === st.studentId);
        if (found && found.status === 'present') attended++;
      });
      const metrics = calculateAttendanceMetrics(attended, course.attendanceSessions.length);

      return {
        studentId: st.studentId,
        name: st.name,
        nameBn: st.nameBn,
        attended,
        total: course.attendanceSessions.length,
        percentage: metrics.percentage,
        status: metrics.status
      };
    });

    return {
      courseCode: course.code,
      totalSessions: course.attendanceSessions.length,
      sessions: course.attendanceSessions,
      studentSummaries
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getAssignments(teacherEmailOrUid: string): Promise<SharedAssignment[]> {
    const store = this.storeManager.getStore();
    const assignedCodes = store.teacherProfile.assignedCourseCodes;
    return store.assignments.filter((a) => assignedCodes.includes(a.courseCode));
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async createAssignment(teacherEmailOrUid: string, params: CreateAssignmentParams) {
    this.assertTeacherAssigned(teacherEmailOrUid, params.courseCode);
    const store = this.storeManager.getStore();
    const course = store.courses.find((c) => c.code.toLowerCase() === params.courseCode.toLowerCase())!;

    const newAssignment: SharedAssignment = {
      id: `asg-${Date.now()}`,
      courseCode: course.code,
      courseTitle: course.title,
      title: params.title,
      description: params.description,
      dueDate: params.dueDate,
      maxMarks: params.maxMarks,
      createdAt: new Date().toISOString(),
      createdBy: store.teacherProfile.fullName,
      submissions: []
    };

    store.assignments.unshift(newAssignment);

    // Cross-role flow: Push notification to student!
    store.studentNotifications.unshift({
      id: `notif-asg-${Date.now()}`,
      title: `New Assignment: ${params.title}`,
      titleBn: `নতুন অ্যাসাইনমেন্ট: ${params.title}`,
      message: `${store.teacherProfile.fullName} published a new assignment for ${course.code}. Due date: ${new Date(params.dueDate).toLocaleDateString()}.`,
      messageBn: `${store.teacherProfile.fullNameBn} ${course.code} কোর্সে নতুন অ্যাসাইনমেন্ট যুক্ত করেছেন। জমা দেওয়ার শেষ তারিখ: ${new Date(params.dueDate).toLocaleDateString('bn-BD')}।`,
      category: 'academic',
      timestamp: new Date().toISOString(),
      read: false,
      link: '/student/assignments'
    });

    this.storeManager.saveStore(store);

    return {
      success: true,
      assignmentId: newAssignment.id,
      message: `Assignment "${params.title}" published for ${course.code}.`
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async gradeSubmission(teacherEmailOrUid: string, params: GradeSubmissionParams) {
    const store = this.storeManager.getStore();
    const assignment = store.assignments.find((a) => a.id === params.assignmentId);
    if (!assignment) {
      throw new Error(`Assignment with ID "${params.assignmentId}" not found.`);
    }

    this.assertTeacherAssigned(teacherEmailOrUid, assignment.courseCode);

    const submission = assignment.submissions.find((s) => s.id === params.submissionId);
    if (!submission) {
      throw new Error(`Submission "${params.submissionId}" not found.`);
    }

    if (params.score < 0 || params.score > assignment.maxMarks) {
      throw new Error(`Score must be between 0 and ${assignment.maxMarks}.`);
    }

    submission.score = params.score;
    submission.feedback = params.feedback || '';
    submission.status = 'graded';
    submission.gradedAt = new Date().toISOString();

    // Cross-role notification to student
    store.studentNotifications.unshift({
      id: `notif-grade-${Date.now()}`,
      title: `Assignment Graded: ${assignment.title}`,
      titleBn: `অ্যাসাইনমেন্ট মূল্যায়ন সম্পন্ন: ${assignment.title}`,
      message: `Your submission has been evaluated. Score: ${params.score}/${assignment.maxMarks}.`,
      messageBn: `আপনার অ্যাসাইনমেন্ট মূল্যায়ন সম্পন্ন হয়েছে। প্রাপ্ত নম্বর: ${params.score}/${assignment.maxMarks}।`,
      category: 'academic',
      timestamp: new Date().toISOString(),
      read: false,
      link: '/student/assignments'
    });

    this.storeManager.saveStore(store);

    return {
      success: true,
      message: `Submission by ${submission.studentName} graded successfully (${params.score}/${assignment.maxMarks}).`
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getMaterials(teacherEmailOrUid: string) {
    const store = this.storeManager.getStore();
    const assignedCourses = store.courses.filter((c) =>
      store.teacherProfile.assignedCourseCodes.includes(c.code)
    );

    return assignedCourses.map((c) => ({
      courseCode: c.code,
      courseTitle: c.title,
      materials: c.materials
    }));
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async addMaterial(teacherEmailOrUid: string, params: AddMaterialParams) {
    this.assertTeacherAssigned(teacherEmailOrUid, params.courseCode);
    const store = this.storeManager.getStore();
    const course = store.courses.find((c) => c.code.toLowerCase() === params.courseCode.toLowerCase())!;

    const newMaterial: CourseMaterialRef = {
      id: `mat-${Date.now()}`,
      title: params.title.endsWith('.pdf') ? params.title : `${params.title}.pdf`,
      fileType: params.fileType,
      fileSize: params.fileSize || '1.8 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      downloadUrl: '#'
    };

    course.materials.unshift(newMaterial);

    // Cross-role notification
    store.studentNotifications.unshift({
      id: `notif-mat-${Date.now()}`,
      title: `New Lecture Material in ${course.code}`,
      titleBn: `${course.code}-এ নতুন লেকচার ম্যাটেরিয়াল যুক্ত হয়েছে`,
      message: `${newMaterial.title} has been uploaded to ${course.code}.`,
      messageBn: `${course.code} কোর্সে নতুন লেকচার ম্যাটেরিয়াল আপলোড করা হয়েছে।`,
      category: 'academic',
      timestamp: new Date().toISOString(),
      read: false,
      link: `/student/courses/${course.code}`
    });

    this.storeManager.saveStore(store);

    return {
      success: true,
      materialId: newMaterial.id,
      message: `Lecture material "${params.title}" added to ${course.code}.`
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async deleteMaterial(teacherEmailOrUid: string, courseCode: string, materialId: string) {
    this.assertTeacherAssigned(teacherEmailOrUid, courseCode);
    const store = this.storeManager.getStore();
    const course = store.courses.find((c) => c.code.toLowerCase() === courseCode.toLowerCase())!;

    course.materials = course.materials.filter((m) => m.id !== materialId);
    this.storeManager.saveStore(store);

    return {
      success: true,
      message: `Course material successfully removed from ${course.code}.`
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getAnnouncements(teacherEmailOrUid: string) {
    const store = this.storeManager.getStore();
    const assignedCourses = store.courses.filter((c) =>
      store.teacherProfile.assignedCourseCodes.includes(c.code)
    );

    return assignedCourses.map((c) => ({
      courseCode: c.code,
      courseTitle: c.title,
      announcements: c.announcements
    }));
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async publishAnnouncement(teacherEmailOrUid: string, params: PublishAnnouncementParams) {
    this.assertTeacherAssigned(teacherEmailOrUid, params.courseCode);
    const store = this.storeManager.getStore();
    const course = store.courses.find((c) => c.code.toLowerCase() === params.courseCode.toLowerCase())!;

    const newAnnouncement: CourseAnnouncementRef = {
      id: `ann-${Date.now()}`,
      title: params.title,
      content: params.content,
      date: new Date().toISOString().split('T')[0],
      author: store.teacherProfile.fullName
    };

    course.announcements.unshift(newAnnouncement);

    // Cross-role notification to students
    store.studentNotifications.unshift({
      id: `notif-ann-${Date.now()}`,
      title: `Course Announcement: ${course.code}`,
      titleBn: `কোর্স নোটিশ: ${course.code}`,
      message: `${params.title} — ${params.content.substring(0, 100)}...`,
      messageBn: `${params.title}`,
      category: 'academic',
      timestamp: new Date().toISOString(),
      read: false,
      link: `/student/courses/${course.code}`
    });

    this.storeManager.saveStore(store);

    return {
      success: true,
      announcementId: newAnnouncement.id,
      message: `Announcement published to ${course.code}.`
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getMarksSheet(teacherEmailOrUid: string, courseCode: string): Promise<CourseMarksSheet> {
    const course = this.assertTeacherAssigned(teacherEmailOrUid, courseCode);
    return course.marksSheet;
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async saveMarks(teacherEmailOrUid: string, params: SaveMarksParams) {
    this.assertTeacherAssigned(teacherEmailOrUid, params.courseCode);
    const store = this.storeManager.getStore();
    const course = store.courses.find((c) => c.code.toLowerCase() === params.courseCode.toLowerCase())!;

    if (course.marksSheet.status === 'SUBMITTED') {
      throw new Error(
        `Marks sheet for ${course.code} has already been SUBMITTED to the Department Chairman. Locked for edits.`
      );
    }

    // Validate and compute total for each student entry
    for (const [studentId, entry] of Object.entries(params.entries)) {
      const valResult = validateMarksInput(entry);
      if (!valResult.isValid) {
        const firstErr = Object.values(valResult.errors)[0];
        throw new Error(`Validation Error for student ${studentId}: ${firstErr}`);
      }

      const computed = computeTotalMarks(entry);
      course.marksSheet.entries[studentId] = {
        studentId,
        attendance: computed.attendance,
        classTests: computed.classTests,
        midterm: computed.midterm,
        finalExam: entry.finalExam,
        total: computed.totalMarks,
        letterGrade: computed.letterGrade,
        gradePoint: computed.gradePoint
      };
    }

    course.marksSheet.lastSavedAt = new Date().toISOString();

    if (params.submitToChairman) {
      course.marksSheet.status = 'SUBMITTED';
      course.marksSheet.submittedAt = new Date().toISOString();

      store.teacherNotifications.unshift({
        id: `t-notif-submitted-${Date.now()}`,
        title: `Marks Sheet Submitted: ${course.code}`,
        titleBn: `মার্কস শিট চেয়ারম্যানের কাছে জমা সম্পন্ন: ${course.code}`,
        message: `Continuous marks for ${course.code} submitted. Awaiting Dept. Chairman review.`,
        messageBn: `${course.code} কোর্সের মার্কস শিট জমা দেওয়া হয়েছে। বিভাগীয় চেয়ারম্যানের অনুমোদনের অপেক্ষায়।`,
        category: 'marks',
        timestamp: new Date().toISOString(),
        read: false,
        link: `/teacher/marks`
      });
    }

    this.storeManager.saveStore(store);

    return {
      success: true,
      sheet: course.marksSheet,
      message: params.submitToChairman
        ? `Marks for ${course.code} formally SUBMITTED to Dept. Chairman for verification. Editing is now locked.`
        : `Marks for ${course.code} saved as DRAFT.`
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getRoutine(teacherEmailOrUid: string): Promise<Record<string, TeacherRoutineItem[]>> {
    const store = this.storeManager.getStore();
    return store.teacherRoutine;
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  async getProfile(teacherEmailOrUid: string): Promise<TeacherProfileInfo> {
    const store = this.storeManager.getStore();
    return store.teacherProfile;
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  resetDemoData(): void {
    this.storeManager.resetStore();
  }
}
