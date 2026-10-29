import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { PublicLayout } from './layouts/PublicLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleGuard } from './components/auth/RoleGuard';
import { SkeletonLoader } from './components/common/SkeletonLoader';

// Public Pages
const HomePage = lazy(() =>
  import('./pages/public/HomePage').then((m) => ({ default: m.HomePage }))
);
const AboutPage = lazy(() =>
  import('./pages/public/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const AdministrationPage = lazy(() =>
  import('./pages/public/AdministrationPage').then((m) => ({ default: m.AdministrationPage }))
);
const AcademicsPage = lazy(() =>
  import('./pages/public/AcademicsPage').then((m) => ({ default: m.AcademicsPage }))
);
const FacultiesPage = lazy(() =>
  import('./pages/public/FacultiesPage').then((m) => ({ default: m.FacultiesPage }))
);
const DepartmentDetailPage = lazy(() =>
  import('./pages/public/DepartmentDetailPage').then((m) => ({ default: m.DepartmentDetailPage }))
);
const ProgramDetailPage = lazy(() =>
  import('./pages/public/ProgramDetailPage').then((m) => ({ default: m.ProgramDetailPage }))
);
const AcademicCalendarPage = lazy(() =>
  import('./pages/public/AcademicCalendarPage').then((m) => ({ default: m.AcademicCalendarPage }))
);
const ClassRoutinePage = lazy(() =>
  import('./pages/public/ClassRoutinePage').then((m) => ({ default: m.ClassRoutinePage }))
);
const AdmissionPage = lazy(() =>
  import('./pages/public/AdmissionPage').then((m) => ({ default: m.AdmissionPage }))
);
const NoticesPage = lazy(() =>
  import('./pages/public/NoticesPage').then((m) => ({ default: m.NoticesPage }))
);
const NoticeDetailPage = lazy(() =>
  import('./pages/public/NoticeDetailPage').then((m) => ({ default: m.NoticeDetailPage }))
);
const EventsPage = lazy(() =>
  import('./pages/public/EventsPage').then((m) => ({ default: m.EventsPage }))
);
const EventDetailPage = lazy(() =>
  import('./pages/public/EventDetailPage').then((m) => ({ default: m.EventDetailPage }))
);
const NewsPage = lazy(() =>
  import('./pages/public/NewsPage').then((m) => ({ default: m.NewsPage }))
);
const NewsDetailPage = lazy(() =>
  import('./pages/public/NewsDetailPage').then((m) => ({ default: m.NewsDetailPage }))
);
const GalleryPage = lazy(() =>
  import('./pages/public/GalleryPage').then((m) => ({ default: m.GalleryPage }))
);
const DownloadsPage = lazy(() =>
  import('./pages/public/DownloadsPage').then((m) => ({ default: m.DownloadsPage }))
);
const ResearchPage = lazy(() =>
  import('./pages/public/ResearchPage').then((m) => ({ default: m.ResearchPage }))
);
const CareerPage = lazy(() =>
  import('./pages/public/CareerPage').then((m) => ({ default: m.CareerPage }))
);
const ContactPage = lazy(() =>
  import('./pages/public/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const LibraryPage = lazy(() =>
  import('./pages/public/LibraryPage').then((m) => ({ default: m.LibraryPage }))
);
const StudentLifeHubPage = lazy(() =>
  import('./pages/public/studentLife/StudentLifeHubPage').then((m) => ({ default: m.StudentLifeHubPage }))
);
const HallsPage = lazy(() =>
  import('./pages/public/studentLife/HallsPage').then((m) => ({ default: m.HallsPage }))
);
const ClubsPage = lazy(() =>
  import('./pages/public/studentLife/ClubsPage').then((m) => ({ default: m.ClubsPage }))
);
const SportsPage = lazy(() =>
  import('./pages/public/studentLife/SportsPage').then((m) => ({ default: m.SportsPage }))
);
const MedicalCenterPage = lazy(() =>
  import('./pages/public/studentLife/MedicalCenterPage').then((m) => ({ default: m.MedicalCenterPage }))
);
const TransportPage = lazy(() =>
  import('./pages/public/studentLife/TransportPage').then((m) => ({ default: m.TransportPage }))
);
const AlumniPage = lazy(() =>
  import('./pages/public/studentLife/AlumniPage').then((m) => ({ default: m.AlumniPage }))
);
const ContentManagementPage = lazy(() =>
  import('./pages/portals/admin/ContentManagementPage').then((m) => ({ default: m.ContentManagementPage }))
);
const VerifyDocumentPage = lazy(() =>
  import('./pages/public/VerifyDocumentPage').then((m) => ({ default: m.VerifyDocumentPage }))
);
const VerifyIDPage = lazy(() =>
  import('./pages/public/VerifyIDPage').then((m) => ({ default: m.VerifyIDPage }))
);
const RequestAccountPage = lazy(() =>
  import('./pages/public/RequestAccountPage').then((m) => ({ default: m.RequestAccountPage }))
);
const HelpdeskPage = lazy(() =>
  import('./pages/public/HelpdeskPage').then((m) => ({ default: m.HelpdeskPage }))
);
const ScholarshipsPage = lazy(() =>
  import('./pages/public/ScholarshipsPage').then((m) => ({ default: m.ScholarshipsPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/public/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);
const StaticPageViewPage = lazy(() =>
  import('./pages/public/StaticPageViewPage').then((m) => ({ default: m.StaticPageViewPage }))
);
const SearchPage = lazy(() =>
  import('./pages/public/SearchPage').then((m) => ({ default: m.SearchPage }))
);
const PrivacyPolicyPage = lazy(() =>
  import('./pages/public/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage }))
);

// Auth Pages
const LoginPage = lazy(() =>
  import('./pages/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const ForgotPasswordPage = lazy(() =>
  import('./pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);
const SetPasswordPage = lazy(() =>
  import('./pages/auth/SetPasswordPage').then((m) => ({ default: m.SetPasswordPage }))
);
const UnauthorizedPage = lazy(() =>
  import('./pages/auth/UnauthorizedPage').then((m) => ({ default: m.UnauthorizedPage }))
);

// Dashboard Shells & Student Portal Pages
const StudentDashboard = lazy(() =>
  import('./pages/portals/student/StudentDashboard').then((m) => ({ default: m.StudentDashboard }))
);
const StudentCoursesPage = lazy(() =>
  import('./pages/portals/student/StudentCoursesPage').then((m) => ({ default: m.StudentCoursesPage }))
);
const StudentCourseDetailPage = lazy(() =>
  import('./pages/portals/student/StudentCourseDetailPage').then((m) => ({ default: m.StudentCourseDetailPage }))
);
const StudentAttendancePage = lazy(() =>
  import('./pages/portals/student/StudentAttendancePage').then((m) => ({ default: m.StudentAttendancePage }))
);
const StudentResultsPage = lazy(() =>
  import('./pages/portals/student/StudentResultsPage').then((m) => ({ default: m.StudentResultsPage }))
);
const StudentRoutinePage = lazy(() =>
  import('./pages/portals/student/StudentRoutinePage').then((m) => ({ default: m.StudentRoutinePage }))
);
const StudentAssignmentsPage = lazy(() =>
  import('./pages/portals/student/StudentAssignmentsPage').then((m) => ({ default: m.StudentAssignmentsPage }))
);
const StudentFeesPage = lazy(() =>
  import('./pages/portals/student/StudentFeesPage').then((m) => ({ default: m.StudentFeesPage }))
);
const StudentNotificationsPage = lazy(() =>
  import('./pages/portals/student/StudentNotificationsPage').then((m) => ({ default: m.StudentNotificationsPage }))
);
const StudentProfilePage = lazy(() =>
  import('./pages/portals/student/StudentProfilePage').then((m) => ({ default: m.StudentProfilePage }))
);
const StudentApplicationsPage = lazy(() =>
  import('./pages/portals/student/StudentApplicationsPage').then((m) => ({ default: m.StudentApplicationsPage }))
);
const StudentDocumentsPage = lazy(() =>
  import('./pages/portals/student/StudentDocumentsPage').then((m) => ({ default: m.StudentDocumentsPage }))
);
const StudentIDCardPage = lazy(() =>
  import('./pages/portals/student/StudentIDCardPage').then((m) => ({ default: m.StudentIDCardPage }))
);
const StudentEvaluationsPage = lazy(() =>
  import('./pages/portals/student/StudentEvaluationsPage').then((m) => ({ default: m.StudentEvaluationsPage }))
);
const StudentQuizzesPage = lazy(() =>
  import('./pages/portals/student/StudentQuizzesPage').then((m) => ({ default: m.StudentQuizzesPage }))
);
const TeacherDashboard = lazy(() =>
  import('./pages/portals/teacher/TeacherDashboard').then((m) => ({ default: m.TeacherDashboard }))
);
const TeacherEvaluationsPage = lazy(() =>
  import('./pages/portals/teacher/TeacherEvaluationsPage').then((m) => ({ default: m.TeacherEvaluationsPage }))
);
const TeacherQuizzesPage = lazy(() =>
  import('./pages/portals/teacher/TeacherQuizzesPage').then((m) => ({ default: m.TeacherQuizzesPage }))
);
const TeacherCoursesPage = lazy(() =>
  import('./pages/portals/teacher/TeacherCoursesPage').then((m) => ({ default: m.TeacherCoursesPage }))
);
const TeacherCourseDetailPage = lazy(() =>
  import('./pages/portals/teacher/TeacherCourseDetailPage').then((m) => ({ default: m.TeacherCourseDetailPage }))
);
const TeacherAttendancePage = lazy(() =>
  import('./pages/portals/teacher/TeacherAttendancePage').then((m) => ({ default: m.TeacherAttendancePage }))
);
const TeacherAssignmentsPage = lazy(() =>
  import('./pages/portals/teacher/TeacherAssignmentsPage').then((m) => ({ default: m.TeacherAssignmentsPage }))
);
const TeacherMaterialsPage = lazy(() =>
  import('./pages/portals/teacher/TeacherMaterialsPage').then((m) => ({ default: m.TeacherMaterialsPage }))
);
const TeacherAnnouncementsPage = lazy(() =>
  import('./pages/portals/teacher/TeacherAnnouncementsPage').then((m) => ({ default: m.TeacherAnnouncementsPage }))
);
const TeacherMarksEntryPage = lazy(() =>
  import('./pages/portals/teacher/TeacherMarksEntryPage').then((m) => ({ default: m.TeacherMarksEntryPage }))
);
const TeacherRoutinePage = lazy(() =>
  import('./pages/portals/teacher/TeacherRoutinePage').then((m) => ({ default: m.TeacherRoutinePage }))
);
const TeacherProfilePage = lazy(() =>
  import('./pages/portals/teacher/TeacherProfilePage').then((m) => ({ default: m.TeacherProfilePage }))
);
const ChairmanDashboard = lazy(() =>
  import('./pages/portals/chairman/ChairmanDashboard').then((m) => ({ default: m.ChairmanDashboard }))
);
const ChairmanSheetDetailPage = lazy(() =>
  import('./pages/portals/chairman/ChairmanSheetDetailPage').then((m) => ({ default: m.ChairmanSheetDetailPage }))
);
const ChairmanDashboardShell = lazy(() =>
  import('./pages/portals/ChairmanDashboardShell').then((m) => ({ default: m.ChairmanDashboardShell }))
);
const ExamControllerDashboard = lazy(() =>
  import('./pages/portals/controller/ExamControllerDashboard').then((m) => ({ default: m.ExamControllerDashboard }))
);
const ExamControllerSheetDetailPage = lazy(() =>
  import('./pages/portals/controller/ExamControllerSheetDetailPage').then((m) => ({ default: m.ExamControllerSheetDetailPage }))
);
const RegistrarDashboard = lazy(() =>
  import('./pages/portals/office/RegistrarDashboard').then((m) => ({ default: m.RegistrarDashboard }))
);
const OfficeDashboardShell = lazy(() =>
  import('./pages/portals/OfficeDashboardShell').then((m) => ({ default: m.OfficeDashboardShell }))
);
const AdminDashboardShell = lazy(() =>
  import('./pages/portals/AdminDashboardShell').then((m) => ({ default: m.AdminDashboardShell }))
);
const ProfilePage = lazy(() =>
  import('./pages/portals/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);

const PageLoader: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-6">
    <SkeletonLoader variant="rectangular" className="h-64 w-full" />
    <div className="space-y-3">
      <SkeletonLoader variant="text" className="h-8 w-2/5" />
      <SkeletonLoader variant="text" className="h-4 w-3/4" />
      <SkeletonLoader variant="text" className="h-4 w-1/2" />
    </div>
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* 1. Public Website Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/administration" element={<AdministrationPage />} />
                  <Route path="/academics" element={<AcademicsPage />} />
                  <Route path="/faculties" element={<FacultiesPage />} />
                  <Route path="/academics/faculties" element={<FacultiesPage />} />
                  <Route path="/academics/calendar" element={<AcademicCalendarPage />} />
                  <Route path="/academic-calendar" element={<AcademicCalendarPage />} />
                  <Route path="/academics/routine" element={<ClassRoutinePage />} />
                  <Route path="/class-routine" element={<ClassRoutinePage />} />
                  <Route path="/academics/department/:deptId" element={<DepartmentDetailPage />} />
                  <Route path="/academics/program/:programId" element={<ProgramDetailPage />} />
                  <Route path="/academics/department/:deptId/program/:programId" element={<ProgramDetailPage />} />
                  <Route path="/admission" element={<AdmissionPage />} />
                  <Route path="/scholarships" element={<ScholarshipsPage />} />
                  <Route path="/notices" element={<NoticesPage />} />
                  <Route path="/notices/:id" element={<NoticeDetailPage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/news/:id" element={<NewsDetailPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/events/:id" element={<EventDetailPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/photo-gallery" element={<GalleryPage />} />
                  <Route path="/downloads" element={<DownloadsPage />} />
                  <Route path="/research" element={<ResearchPage />} />
                  <Route path="/career" element={<CareerPage />} />
                  <Route path="/tenders" element={<CareerPage />} />
                  <Route path="/library" element={<LibraryPage />} />
                  <Route path="/student-life" element={<StudentLifeHubPage />} />
                  <Route path="/student-life/halls" element={<HallsPage />} />
                  <Route path="/halls" element={<HallsPage />} />
                  <Route path="/student-life/clubs" element={<ClubsPage />} />
                  <Route path="/clubs" element={<ClubsPage />} />
                  <Route path="/student-life/sports" element={<SportsPage />} />
                  <Route path="/sports" element={<SportsPage />} />
                  <Route path="/student-life/medical" element={<MedicalCenterPage />} />
                  <Route path="/medical" element={<MedicalCenterPage />} />
                  <Route path="/student-life/transport" element={<TransportPage />} />
                  <Route path="/transport" element={<TransportPage />} />
                  <Route path="/student-life/alumni" element={<AlumniPage />} />
                  <Route path="/alumni" element={<AlumniPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/cookies" element={<PrivacyPolicyPage />} />
                  <Route path="/page/:slug" element={<StaticPageViewPage />} />
                  <Route path="/verify" element={<VerifyDocumentPage />} />
                  <Route path="/verify/:documentId" element={<VerifyDocumentPage />} />
                  <Route path="/verify/:id" element={<VerifyDocumentPage />} />
                  <Route path="/verify-id" element={<VerifyIDPage />} />
                  <Route path="/verify-id/:token" element={<VerifyIDPage />} />
                  <Route path="/helpdesk" element={<HelpdeskPage />} />
                  <Route path="/helpdesk/track" element={<HelpdeskPage />} />

                  {/* 2. Authentication Flow Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/request-account" element={<RequestAccountPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/set-password" element={<SetPasswordPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                </Route>

                {/* 3. Protected Role-Based Dashboard Shells */}
                <Route
                  path="/student"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['student']}>
                        <StudentDashboard />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/courses"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['student']}>
                        <StudentCoursesPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/courses/:courseCode"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['student']}>
                        <StudentCourseDetailPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/attendance"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['student']}>
                        <StudentAttendancePage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/results"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['student']}>
                        <StudentResultsPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/routine"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['student']}>
                        <StudentRoutinePage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/assignments"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['student']}>
                        <StudentAssignmentsPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/fees"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['student']}>
                        <StudentFeesPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/notifications"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['student']}>
                        <StudentNotificationsPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/applications"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['student']}>
                        <StudentApplicationsPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/documents"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['student']}>
                        <StudentDocumentsPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/id-card"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['student']}>
                        <StudentIDCardPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/evaluations"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['student']}>
                        <StudentEvaluationsPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/quizzes"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['student']}>
                        <StudentQuizzesPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/profile"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['student']}>
                        <StudentProfilePage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />

                {/* Teacher Portal Routes */}
                <Route
                  path="/teacher"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['teacher']}>
                        <TeacherDashboard />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/courses"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['teacher']}>
                        <TeacherCoursesPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/courses/:courseCode"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['teacher']}>
                        <TeacherCourseDetailPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/attendance"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['teacher']}>
                        <TeacherAttendancePage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/attendance/:courseCode"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['teacher']}>
                        <TeacherAttendancePage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/assignments"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['teacher']}>
                        <TeacherAssignmentsPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/materials"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['teacher']}>
                        <TeacherMaterialsPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/announcements"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['teacher']}>
                        <TeacherAnnouncementsPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/marks"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['teacher']}>
                        <TeacherMarksEntryPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/marks/:courseCode"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['teacher']}>
                        <TeacherMarksEntryPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/routine"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['teacher']}>
                        <TeacherRoutinePage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/profile"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['teacher']}>
                        <TeacherProfilePage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/evaluations"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['teacher']}>
                        <TeacherEvaluationsPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/quizzes"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['teacher']}>
                        <TeacherQuizzesPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/chairman"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['dept_chairman']}>
                        <ChairmanDashboard />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chairman/sheets"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['dept_chairman']}>
                        <ChairmanDashboard />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chairman/sheets/:courseCode"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['dept_chairman']}>
                        <ChairmanSheetDetailPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />

                {/* Office of Exam Controller Specific Routes */}
                <Route
                  path="/office/exam_controller"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['exam_controller', 'super_admin']}>
                        <ExamControllerDashboard />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/office/exam_controller/sheets/:courseCode"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['exam_controller', 'super_admin']}>
                        <ExamControllerSheetDetailPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />

                {/* Office of Registrar Specific Route */}
                <Route
                  path="/office/registrar"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['registrar', 'super_admin']}>
                        <RegistrarDashboard />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/office/:roleKey"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['registrar', 'exam_controller', 'account_officer', 'library_officer']}>
                        <OfficeDashboardShell />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['admin', 'super_admin']}>
                        <AdminDashboardShell />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/content"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['admin', 'super_admin', 'dept_chairman']}>
                        <ContentManagementPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* 4. 404 Catch-All */}
                <Route element={<PublicLayout />}>
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
