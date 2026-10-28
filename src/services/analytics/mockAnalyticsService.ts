/**
 * JSTU Smart Campus — Mock Analytics Service
 *
 * Provides real-time aggregations from SharedDataStoreManager for both
 * university-wide Admin and department-scoped Chairman dashboards.
 *
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */

import {
  AnalyticsService,
  DashboardAnalyticsData,
  AnalyticsStatCards,
  StudentsPerDepartmentItem,
  ApplicationStatusBreakdownItem,
  AttendancePerDepartmentItem,
  GradeDistributionItem,
  FeeComparisonData,
  ApplicationsPerMonthItem,
  ActivityFeedItem
} from './types';
import { SharedDataStoreManager, SharedStoreData } from '../shared/sharedDataStore';
import { departmentsData } from '../../data/seedData';
import { Notice, NoticeCategory } from '../../types';

export class MockAnalyticsService implements AnalyticsService {
  private storeManager: SharedDataStoreManager;

  constructor() {
    this.storeManager = SharedDataStoreManager.getInstance();
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async getAdminAnalytics(): Promise<DashboardAnalyticsData> {
    const store = this.storeManager.getStore();
    return this.buildAnalyticsData(store, false);
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async getDepartmentAnalytics(departmentId: string = 'CSE'): Promise<DashboardAnalyticsData> {
    const store = this.storeManager.getStore();
    return this.buildAnalyticsData(store, true, departmentId.toUpperCase());
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  public async publishNotice(noticeData: {
    title: string;
    titleBn: string;
    category: NoticeCategory;
    summary: string;
    summaryBn: string;
    body: string;
    bodyBn: string;
    department?: string;
    departmentBn?: string;
    isImportant?: boolean;
    publisherRole: string;
  }): Promise<{ success: boolean; noticeId: string }> {
    const store = this.storeManager.getStore();
    const noticeId = `not-${Date.now()}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const refNum = `JSTU/${noticeData.department || 'ADMIN'}/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`;

    const newNotice: Notice = {
      id: noticeId,
      title: noticeData.title,
      titleBn: noticeData.titleBn,
      category: noticeData.category,
      publishDate: dateStr,
      publishDateBn: dateStr,
      summary: noticeData.summary,
      summaryBn: noticeData.summaryBn,
      body: noticeData.body,
      bodyBn: noticeData.bodyBn,
      department: noticeData.department || 'General Administration',
      departmentBn: noticeData.departmentBn || 'সাধারণ প্রশাসন',
      referenceNumber: refNum,
      status: 'published',
      isImportant: noticeData.isImportant ?? false
    };

    if (!store.notices) {
      store.notices = [];
    }
    store.notices.unshift(newNotice);
    this.storeManager.saveStore(store);

    return { success: true, noticeId };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  private buildAnalyticsData(
    store: SharedStoreData,
    isDepartmentScoped: boolean,
    deptId?: string
  ): DashboardAnalyticsData {
    const targetDept = (deptId || 'CSE').toUpperCase();
    const deptMeta = departmentsData.find(
      (d) => d.code.toUpperCase() === targetDept || d.id.toUpperCase() === targetDept
    );

    // 1. Stat Cards
    const statCards = this.calculateStatCards(store, isDepartmentScoped, targetDept, deptMeta);

    // 2. Students per Department / Cohorts
    const studentsPerDepartment = this.calculateStudentsDistribution(store, isDepartmentScoped, targetDept);

    // 3. Application Status Breakdown
    const applicationStatusBreakdown = this.calculateApplicationBreakdown(store, isDepartmentScoped, targetDept);

    // 4. Average Attendance
    const averageAttendance = this.calculateAttendance(store, isDepartmentScoped, targetDept);

    // 5. Result Grade Distribution
    const gradeDistribution = this.calculateGradeDistribution(store, isDepartmentScoped, targetDept);

    // 6. Fee Collected vs Due
    const feeComparison = this.calculateFeeComparison(store, isDepartmentScoped, targetDept);

    // 7. Applications per Month
    const applicationsPerMonth = this.calculateApplicationsPerMonth(store, isDepartmentScoped, targetDept);

    // 8. Recent Activity Feed (Role, Action, Time — NO PERSONAL DATA)
    const recentActivities = this.collectRecentActivities(store, isDepartmentScoped, targetDept);

    return {
      isDemoData: true,
      departmentScoped: isDepartmentScoped,
      departmentId: isDepartmentScoped ? targetDept : undefined,
      departmentName: isDepartmentScoped ? (deptMeta?.name || `Department of ${targetDept}`) : 'Jamalpur Science & Technology University',
      departmentNameBn: isDepartmentScoped ? (deptMeta?.nameBn || `${targetDept} বিভাগ`) : 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়',
      statCards,
      studentsPerDepartment,
      applicationStatusBreakdown,
      averageAttendance,
      gradeDistribution,
      feeComparison,
      applicationsPerMonth,
      recentActivities
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  private calculateStatCards(
    store: SharedStoreData,
    isDepartmentScoped: boolean,
    targetDept: string,
    deptMeta?: (typeof departmentsData)[number]
  ): AnalyticsStatCards {
    if (isDepartmentScoped) {
      const deptStudents = deptMeta?.stats.studentCount || 220;
      const deptFaculty = deptMeta?.stats.facultyCount || 14;

      const pendingApps = (store.applications || []).filter(
        (a) =>
          (a.studentDepartment || '').toUpperCase() === targetDept &&
          (a.status === 'UNDER_REVIEW' || a.status === 'DRAFT' || a.status === ('SUBMITTED' as any))
      ).length;

      const pendingReqs = (store.accountRequests || []).filter(
        (r) => (r.department || '').toUpperCase() === targetDept && r.status === 'PENDING'
      ).length;

      const docsIssued = (store.digitalDocuments || []).filter(
        (d) => (d.studentDepartment || '').toUpperCase() === targetDept && d.status === 'VALID'
      ).length;

      return {
        totalStudents: deptStudents,
        totalTeachers: deptFaculty,
        totalDepartments: 1,
        departmentCode: targetDept,
        pendingApplications: pendingApps,
        pendingAccountRequests: pendingReqs,
        documentsIssued: docsIssued
      };
    }

    // University-wide Admin Stats
    const totalStudents = departmentsData.reduce((acc, d) => acc + (d.stats.studentCount || 0), 0) || 1250;
    const totalTeachers = departmentsData.reduce((acc, d) => acc + (d.stats.facultyCount || 0), 0) || 74;
    const totalDepartments = departmentsData.length || 7;

    const pendingApplications = (store.applications || []).filter(
      (a) => a.status === 'UNDER_REVIEW' || a.status === 'DRAFT' || a.status === ('SUBMITTED' as any)
    ).length;

    const pendingAccountRequests = (store.accountRequests || []).filter(
      (r) => r.status === 'PENDING'
    ).length;

    const documentsIssued = (store.digitalDocuments || []).filter(
      (d) => d.status === 'VALID'
    ).length;

    return {
      totalStudents,
      totalTeachers,
      totalDepartments,
      pendingApplications,
      pendingAccountRequests,
      documentsIssued
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  private calculateStudentsDistribution(
    _store: SharedStoreData,
    isDepartmentScoped: boolean,
    targetDept: string
  ): StudentsPerDepartmentItem[] {
    if (isDepartmentScoped) {
      // For department chairman: show cohort distribution by academic batch
      return [
        { department: 'Batch 2022-2023 (4th Year)', departmentBn: 'ব্যাচ ২০২২-২০২৩ (৪র্থ বর্ষ)', students: 54, facultyCount: 4, color: '#3B82F6' },
        { department: 'Batch 2023-2024 (3rd Year)', departmentBn: 'ব্যাচ ২০২৩-২০২৪ (৩য় বর্ষ)', students: 58, facultyCount: 4, color: '#1E3A8A' },
        { department: 'Batch 2024-2025 (2nd Year)', departmentBn: 'ব্যাচ ২০২৪-২০২৫ (২য় বর্ষ)', students: 55, facultyCount: 3, color: '#059669' },
        { department: 'Batch 2025-2026 (1st Year)', departmentBn: 'ব্যাচ ২০২৫-২০২৬ (১ম বর্ষ)', students: 53, facultyCount: 3, color: '#D97706' }
      ];
    }

    // Admin view: 7 official JSTU departments
    const defaultColors: Record<string, string> = {
      CSE: '#1E3A8A',
      EEE: '#2563EB',
      MATH: '#059669',
      FISH: '#0D9488',
      GEOL: '#D97706',
      MGMT: '#7C3AED',
      SW: '#DB2777'
    };

    return departmentsData.map((d) => ({
      department: d.code,
      departmentBn: d.nameBn.replace(' বিভাগ', ''),
      students: d.stats.studentCount || 150,
      facultyCount: d.stats.facultyCount || 10,
      color: defaultColors[d.code] || '#1E3A8A'
    }));
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  private calculateApplicationBreakdown(
    store: SharedStoreData,
    isDepartmentScoped: boolean,
    targetDept: string
  ): ApplicationStatusBreakdownItem[] {
    const apps = isDepartmentScoped
      ? (store.applications || []).filter((a) => (a.studentDepartment || '').toUpperCase() === targetDept)
      : (store.applications || []);

    let pending = 0;
    let approved = 0;
    let rejected = 0;

    for (const a of apps) {
      if (a.status === 'APPROVED' || a.status === ('COMPLETED' as any)) {
        approved++;
      } else if (a.status === 'REJECTED') {
        rejected++;
      } else {
        pending++;
      }
    }

    // Ensure baseline demo visual representation if small sample
    if (apps.length <= 2) {
      if (isDepartmentScoped) {
        pending = Math.max(pending, 3);
        approved = Math.max(approved, 9);
        rejected = Math.max(rejected, 1);
      } else {
        pending = Math.max(pending, 8);
        approved = Math.max(approved, 24);
        rejected = Math.max(rejected, 4);
      }
    }

    const total = pending + approved + rejected || 1;

    return [
      {
        status: 'PENDING',
        label: 'Pending Review',
        labelBn: 'বিচারাধীন আবেদন',
        count: pending,
        percentage: Math.round((pending / total) * 100),
        color: '#F59E0B' // Amber
      },
      {
        status: 'APPROVED',
        label: 'Approved & Issued',
        labelBn: 'অনুমোদিত ও ইস্যুকৃত',
        count: approved,
        percentage: Math.round((approved / total) * 100),
        color: '#10B981' // Emerald
      },
      {
        status: 'REJECTED',
        label: 'Rejected / Returned',
        labelBn: 'প্রত্যাখ্যাত / ফেরত',
        count: rejected,
        percentage: Math.round((rejected / total) * 100),
        color: '#EF4444' // Rose/Red
      }
    ];
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  private calculateAttendance(
    _store: SharedStoreData,
    isDepartmentScoped: boolean,
    _targetDept: string
  ): AttendancePerDepartmentItem[] {
    if (isDepartmentScoped) {
      // Chairman view: courses in their department
      return [
        { department: 'CSE-3201', departmentBn: 'সিএসই-৩২০১', courseCode: 'CSE-3201', courseTitle: 'Compiler Design', averageAttendance: 88.4 },
        { department: 'CSE-3203', departmentBn: 'সিএসই-৩২০৩', courseCode: 'CSE-3203', courseTitle: 'Computer Networks', averageAttendance: 82.5 },
        { department: 'CSE-3205', departmentBn: 'সিএসই-৩২০৫', courseCode: 'CSE-3205', courseTitle: 'Software Engineering', averageAttendance: 85.0 },
        { department: 'CSE-3207', departmentBn: 'সিএসই-৩২০৭', courseCode: 'CSE-3207', courseTitle: 'Artificial Intelligence', averageAttendance: 84.2 },
        { department: 'CSE-1101', departmentBn: 'সিএসই-১১০১', courseCode: 'CSE-1101', courseTitle: 'Structured Programming', averageAttendance: 91.0 }
      ];
    }

    // Admin view: average attendance across all 7 departments
    return [
      { department: 'CSE', departmentBn: 'সিএসই', averageAttendance: 86.5 },
      { department: 'EEE', departmentBn: 'ইইই', averageAttendance: 82.3 },
      { department: 'MATH', departmentBn: 'গণিত', averageAttendance: 88.7 },
      { department: 'FISH', departmentBn: 'মৎস্য', averageAttendance: 79.5 },
      { department: 'GEOL', departmentBn: 'ভূতত্ত্ব', averageAttendance: 83.8 },
      { department: 'MGMT', departmentBn: 'ব্যবস্থাপনা', averageAttendance: 81.4 },
      { department: 'SW', departmentBn: 'সমাজকর্ম', averageAttendance: 85.2 }
    ];
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  private calculateGradeDistribution(
    store: SharedStoreData,
    isDepartmentScoped: boolean,
    targetDept: string
  ): GradeDistributionItem[] {
    const gradesCount: Record<string, number> = {
      'A+': 0, 'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 'B-': 0, 'C+': 0, 'C': 0, 'D': 0, 'F': 0
    };

    const gpaMap: Record<string, number> = {
      'A+': 4.00, 'A': 3.75, 'A-': 3.50, 'B+': 3.25, 'B': 3.00, 'B-': 2.75, 'C+': 2.50, 'C': 2.25, 'D': 2.00, 'F': 0.00
    };

    const gradeColors: Record<string, string> = {
      'A+': '#059669', // Deep Emerald
      'A': '#10B981',  // Emerald
      'A-': '#34D399', // Mint
      'B+': '#2563EB', // Blue
      'B': '#3B82F6',  // Light Blue
      'B-': '#60A5FA', // Sky Blue
      'C+': '#F59E0B', // Amber
      'C': '#FBBF24',  // Light Amber
      'D': '#F97316',  // Orange
      'F': '#EF4444'   // Red
    };

    // Tally from courses marksSheet entries
    for (const course of store.courses || []) {
      if (isDepartmentScoped && (course.department || '').toUpperCase() !== targetDept) {
        continue;
      }
      if (course.marksSheet && course.marksSheet.entries) {
        for (const entry of Object.values(course.marksSheet.entries)) {
          if (entry.letterGrade && gradesCount[entry.letterGrade] !== undefined) {
            gradesCount[entry.letterGrade]++;
          }
        }
      }
    }

    // If initial course entries are small, enrich with realistic cohort proportions
    let totalComputed = Object.values(gradesCount).reduce((a, b) => a + b, 0);
    if (totalComputed < 10) {
      if (isDepartmentScoped) {
        gradesCount['A+'] = 14;
        gradesCount['A'] = 22;
        gradesCount['A-'] = 18;
        gradesCount['B+'] = 12;
        gradesCount['B'] = 8;
        gradesCount['B-'] = 5;
        gradesCount['C+'] = 3;
        gradesCount['C'] = 2;
        gradesCount['D'] = 1;
        gradesCount['F'] = 1;
      } else {
        gradesCount['A+'] = 58;
        gradesCount['A'] = 94;
        gradesCount['A-'] = 76;
        gradesCount['B+'] = 52;
        gradesCount['B'] = 34;
        gradesCount['B-'] = 20;
        gradesCount['C+'] = 12;
        gradesCount['C'] = 8;
        gradesCount['D'] = 4;
        gradesCount['F'] = 3;
      }
      totalComputed = Object.values(gradesCount).reduce((a, b) => a + b, 0);
    }

    return Object.keys(gradesCount).map((grade) => {
      const count = gradesCount[grade];
      return {
        grade,
        count,
        percentage: Math.round((count / (totalComputed || 1)) * 100),
        gpa: gpaMap[grade] || 0.0,
        color: gradeColors[grade] || '#64748B'
      };
    });
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  private calculateFeeComparison(
    _store: SharedStoreData,
    isDepartmentScoped: boolean,
    _targetDept: string
  ): FeeComparisonData {
    if (isDepartmentScoped) {
      const totalPayable = 2100000;
      const totalCollected = 1720000;
      const totalDue = totalPayable - totalCollected;

      return {
        totalCollected,
        totalDue,
        totalPayable,
        collectionRate: Math.round((totalCollected / totalPayable) * 100),
        categories: [
          { category: 'Semester Tuition', categoryBn: 'সেমিস্টার টিউশন ফি', collected: 980000, due: 180000 },
          { category: 'Laboratory & Computing', categoryBn: 'ল্যাবরেটরি ও কম্পিউটার ফি', collected: 360000, due: 70000 },
          { category: 'Examination Fee', categoryBn: 'পরীক্ষা ফি', collected: 260000, due: 80000 },
          { category: 'Department Seminar & Library', categoryBn: 'বিভাগীয় সেমিনার ও লাইব্রেরি ফি', collected: 120000, due: 50000 }
        ]
      };
    }

    const totalPayable = 11800000;
    const totalCollected = 9450000;
    const totalDue = totalPayable - totalCollected;

    return {
      totalCollected,
      totalDue,
      totalPayable,
      collectionRate: Math.round((totalCollected / totalPayable) * 100),
      categories: [
        { category: 'Tuition Fees', categoryBn: 'টিউশন ফি', collected: 5200000, due: 1100000 },
        { category: 'Examination Fees', categoryBn: 'পরীক্ষা ফি', collected: 2100000, due: 550000 },
        { category: 'Laboratory Fees', categoryBn: 'ল্যাবরেটরি ফি', collected: 1250000, due: 400000 },
        { category: 'Residential & Hall Fees', categoryBn: 'হল ও আবাসন ফি', collected: 600000, due: 180000 },
        { category: 'Registration & Misc', categoryBn: 'রেজিস্ট্রেশন ও অন্যান্য ফি', collected: 300000, due: 120000 }
      ]
    };
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  private calculateApplicationsPerMonth(
    _store: SharedStoreData,
    isDepartmentScoped: boolean,
    _targetDept: string
  ): ApplicationsPerMonthItem[] {
    if (isDepartmentScoped) {
      return [
        { month: 'May', monthBn: 'মে', count: 8, approved: 7, pending: 0, rejected: 1 },
        { month: 'Jun', monthBn: 'জুন', count: 12, approved: 10, pending: 1, rejected: 1 },
        { month: 'Jul', monthBn: 'জুলাই', count: 9, approved: 8, pending: 1, rejected: 0 },
        { month: 'Aug', monthBn: 'আগস্ট', count: 16, approved: 13, pending: 2, rejected: 1 },
        { month: 'Sep', monthBn: 'সেপ্টেম্বর', count: 24, approved: 19, pending: 3, rejected: 2 },
        { month: 'Oct', monthBn: 'অক্টোবর', count: 14, approved: 9, pending: 4, rejected: 1 }
      ];
    }

    return [
      { month: 'May', monthBn: 'মে', count: 32, approved: 28, pending: 2, rejected: 2 },
      { month: 'Jun', monthBn: 'জুন', count: 48, approved: 41, pending: 4, rejected: 3 },
      { month: 'Jul', monthBn: 'জুলাই', count: 36, approved: 31, pending: 3, rejected: 2 },
      { month: 'Aug', monthBn: 'আগস্ট', count: 64, approved: 52, pending: 8, rejected: 4 },
      { month: 'Sep', monthBn: 'সেপ্টেম্বর', count: 88, approved: 72, pending: 11, rejected: 5 },
      { month: 'Oct', monthBn: 'অক্টোবর', count: 56, approved: 38, pending: 14, rejected: 4 }
    ];
  }

  // Real enforcement must move to Firestore rules / Cloud Functions.
  // CRITICAL: ROLE, ACTION, TIME ONLY — NO PERSONAL DATA (NO NAMES, EMAILS, PHONES, STUDENT IDS)
  private collectRecentActivities(
    store: SharedStoreData,
    isDepartmentScoped: boolean,
    targetDept: string
  ): ActivityFeedItem[] {
    const rawEvents: {
      id: string;
      role: string;
      roleBn: string;
      action: string;
      actionBn: string;
      timestamp: string;
      statusType: 'success' | 'warning' | 'info' | 'neutral';
    }[] = [];

    // 1. Collect from Applications Audit Trail
    for (const app of store.applications || []) {
      if (isDepartmentScoped && (app.studentDepartment || '').toUpperCase() !== targetDept) {
        continue;
      }
      for (const entry of app.auditTrail || []) {
        let actionDesc = 'Submitted paperless application';
        let actionDescBn = 'পেপারলেস আবেদন দাখিল করেছেন';
        let statusType: 'success' | 'warning' | 'info' | 'neutral' = 'info';

        if (entry.action === 'APPROVE') {
          actionDesc = `Endorsed ${app.type.replace('_', ' ')} application`;
          actionDescBn = `${app.type.replace('_', ' ')} আবেদন অনুমোদন করেছেন`;
          statusType = 'success';
        } else if (entry.action === 'REJECT') {
          actionDesc = `Returned ${app.type.replace('_', ' ')} application`;
          actionDescBn = `${app.type.replace('_', ' ')} আবেদন ফেরত বা বাতিল করেছেন`;
          statusType = 'warning';
        } else if (entry.action === 'SUBMIT') {
          actionDesc = `Submitted ${app.type.replace('_', ' ')} request`;
          actionDescBn = `${app.type.replace('_', ' ')} আবেদন জমা দিয়েছেন`;
          statusType = 'info';
        }

        rawEvents.push({
          id: entry.id || `app-audit-${Math.random()}`,
          role: entry.role || 'user',
          roleBn: this.getRoleBn(entry.role || 'user'),
          action: actionDesc,
          actionBn: actionDescBn,
          timestamp: entry.timestamp || new Date().toISOString(),
          statusType
        });
      }
    }

    // 2. Collect from Course Marks Audit Trail
    for (const course of store.courses || []) {
      if (isDepartmentScoped && (course.department || '').toUpperCase() !== targetDept) {
        continue;
      }
      if (course.marksSheet && course.marksSheet.auditTrail) {
        for (const entry of course.marksSheet.auditTrail) {
          let actionDesc = `Updated marks sheet for ${course.code}`;
          let actionDescBn = `${course.code} এর নম্বর শিট হালনাগাদ করেছেন`;
          let statusType: 'success' | 'warning' | 'info' | 'neutral' = 'neutral';

          if (entry.action === 'SUBMIT') {
            actionDesc = `Submitted tabulation sheet for ${course.code}`;
            actionDescBn = `${course.code} এর ট্যাবুলেশন শিট দাখিল করেছেন`;
            statusType = 'info';
          } else if (entry.action === 'VERIFY') {
            actionDesc = `Verified & endorsed tabulation for ${course.code}`;
            actionDescBn = `${course.code} এর মার্কস শিট যাচাই ও অনুমোদন করেছেন`;
            statusType = 'success';
          } else if (entry.action === 'PUBLISH') {
            actionDesc = `Published official results for ${course.code}`;
            actionDescBn = `${course.code} এর চূড়ান্ত ফল প্রকাশ করেছেন`;
            statusType = 'success';
          } else if (entry.action === 'RETURN_TO_TEACHER') {
            actionDesc = `Requested tabulation revision for ${course.code}`;
            actionDescBn = `${course.code} এর মার্কস সংশোধনের জন্য ফেরত দিয়েছেন`;
            statusType = 'warning';
          }

          rawEvents.push({
            id: entry.id || `course-audit-${Math.random()}`,
            role: entry.role || 'teacher',
            roleBn: this.getRoleBn(entry.role || 'teacher'),
            action: actionDesc,
            actionBn: actionDescBn,
            timestamp: entry.timestamp || new Date().toISOString(),
            statusType
          });
        }
      }
    }

    // 3. Collect from Account Requests (NO PERSONAL NAMES OR EMAILS)
    for (const req of store.accountRequests || []) {
      if (isDepartmentScoped && (req.department || '').toUpperCase() !== targetDept) {
        continue;
      }
      if (req.status === 'APPROVED' && req.reviewedAt) {
        rawEvents.push({
          id: `req-appr-${req.id}`,
          role: 'admin',
          roleBn: 'প্রশাসক',
          action: 'Approved student account registration',
          actionBn: 'শিক্ষার্থী একাউন্ট নিবন্ধন অনুমোদন করেছেন',
          timestamp: req.reviewedAt,
          statusType: 'success'
        });
      } else if (req.status === 'REJECTED' && req.reviewedAt) {
        rawEvents.push({
          id: `req-rej-${req.id}`,
          role: 'admin',
          roleBn: 'প্রশাসক',
          action: 'Reviewed and rejected student registration request',
          actionBn: 'শিক্ষার্থী নিবন্ধন আবেদন বাতিল করেছেন',
          timestamp: req.reviewedAt,
          statusType: 'warning'
        });
      } else {
        rawEvents.push({
          id: `req-sub-${req.id}`,
          role: 'student',
          roleBn: 'শিক্ষার্থী',
          action: 'Submitted institutional account request',
          actionBn: 'প্রাতিষ্ঠানিক অ্যাকাউন্ট অনুরোধ দাখিল করেছেন',
          timestamp: req.createdAt,
          statusType: 'info'
        });
      }
    }

    // Add baseline realistic audit events if few items
    if (rawEvents.length < 5) {
      const now = Date.now();
      rawEvents.push(
        {
          id: 'ev-seed-1',
          role: 'teacher',
          roleBn: 'শিক্ষক',
          action: 'Saved continuous assessment marks draft',
          actionBn: 'ধারাবাহিক মূল্যায়নের মার্কস ড্রাফট সংরক্ষণ করেছেন',
          timestamp: new Date(now - 1000 * 60 * 25).toISOString(),
          statusType: 'info'
        },
        {
          id: 'ev-seed-2',
          role: 'dept_chairman',
          roleBn: 'বিভাগীয় চেয়ারম্যান',
          action: 'Signed and approved digital testimonial certificate',
          actionBn: 'ডিজিটাল প্রশংসাপত্র অনুমোদন ও স্বাক্ষর করেছেন',
          timestamp: new Date(now - 1000 * 60 * 85).toISOString(),
          statusType: 'success'
        },
        {
          id: 'ev-seed-3',
          role: 'admin',
          roleBn: 'প্রশাসক',
          action: 'Verified institutional identity request',
          actionBn: 'প্রাতিষ্ঠানিক পরিচিতি যাচাই সম্পন্ন করেছেন',
          timestamp: new Date(now - 1000 * 60 * 190).toISOString(),
          statusType: 'success'
        },
        {
          id: 'ev-seed-4',
          role: 'exam_controller',
          roleBn: 'পরীক্ষা নিয়ন্ত্রক',
          action: 'Validated semester grade sheet tabulation',
          actionBn: 'সেমিস্টার গ্রেড শিট ট্যাবুলেশন যাচাই করেছেন',
          timestamp: new Date(now - 1000 * 60 * 310).toISOString(),
          statusType: 'success'
        },
        {
          id: 'ev-seed-5',
          role: 'student',
          roleBn: 'শিক্ষার্থী',
          action: 'Completed semester online fee settlement',
          actionBn: 'সেমিস্টার ফি অনলাইন পরিশোধ সম্পন্ন করেছেন',
          timestamp: new Date(now - 1000 * 60 * 420).toISOString(),
          statusType: 'info'
        }
      );
    }

    // Sort descending by timestamp
    rawEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Format relative time
    return rawEvents.slice(0, 10).map((e) => {
      const diffMs = Date.now() - new Date(e.timestamp).getTime();
      const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let timeAgo = `${diffMins}m ago`;
      let timeAgoBn = `${this.toBanglaNum(diffMins)} মিনিট আগে`;

      if (diffDays > 0) {
        timeAgo = `${diffDays}d ago`;
        timeAgoBn = `${this.toBanglaNum(diffDays)} দিন আগে`;
      } else if (diffHours > 0) {
        timeAgo = `${diffHours}h ago`;
        timeAgoBn = `${this.toBanglaNum(diffHours)} ঘণ্টা আগে`;
      }

      return {
        id: e.id,
        role: e.role,
        roleBn: e.roleBn,
        action: e.action,
        actionBn: e.actionBn,
        timestamp: e.timestamp,
        timeAgo,
        timeAgoBn,
        statusType: e.statusType
      };
    });
  }

  private getRoleBn(role: string): string {
    const roleMap: Record<string, string> = {
      admin: 'প্রশাসক',
      super_admin: 'সুপার অ্যাডমিন',
      dept_chairman: 'বিভাগীয় চেয়ারম্যান',
      teacher: 'শিক্ষক',
      student: 'শিক্ষার্থী',
      registrar: 'রেজিস্ট্রার',
      exam_controller: 'পরীক্ষা নিয়ন্ত্রক',
      account_officer: 'হিসাব কর্মকর্তা',
      library_officer: 'লাইব্রেরি কর্মকর্তা'
    };
    return roleMap[role] || role;
  }

  private toBanglaNum(num: number): string {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/\d/g, (d) => bnDigits[Number(d)]);
  }
}
