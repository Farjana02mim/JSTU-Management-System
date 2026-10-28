# JSTU Smart Campus — Architecture & Security Specification (Phase 0)
**Jamalpur Science & Technology University (JSTU), Jamalpur-2012, Bangladesh**

---

## 0. Key Architectural Assumptions
1. **Authentication & Custom Claims**: Firebase Auth custom claims (`role`, `deptId`, `officeId`, `mfaEnforced`) are the single source of truth for authorization in Firestore security rules. Client token claims are set exclusively by Cloud Functions running with admin credentials.
2. **Strict Multi-Factor Authentication (MFA)**: All administrative, academic, and financial staff roles (`super_admin`, `admin`, `registrar`, `exam_controller`, `dept_chairman`, `teacher`, `account_officer`, `library_officer`) require SMS/TOTP MFA enforcement before receiving operational tokens. Students operate with standard authenticated sessions.
3. **No Direct Client Writes to Finalized Records**: Published marks, student CGPAs, generated degrees/transcripts, payment transactions, and audit trails cannot be written or modified directly by client SDKs. All state transitions flow through transactional Cloud Functions.
4. **Grading & GPA System**: Compliant with the UGC (University Grants Commission of Bangladesh) 4.00 standard scale (80%+ = A+ [4.00], 75-79% = A [3.75], etc.). Calculations are strictly evaluated server-side.
5. **Bilingual Localization**: English (primary UI and transcripts) with Bangla (Bengali - bn-BD) language pack for all public verification, forms, notices, and portal views.

---

## 1. Top 10 Threats & Mitigations (STRIDE / University Domain)

| # | Threat Description | Threat Category | Impact | Mitigation Strategy |
|---|--------------------|-----------------|--------|---------------------|
| **T-01** | **Client-Side Role Escalation**<br>Attacker injects claims or writes `{ role: 'admin' }` to their user document in Firestore to access privileged routes. | Elevation of Privilege | Critical | Roles are stored **only** in Firebase Auth Custom Claims, not in client-writable documents. Firestore rules inspect `request.auth.token.role` instead of incoming request payloads or readable doc properties. |
| **T-02** | **Direct Tampering of Marks / Results Post-Submission**<br>Instructor or compromised teacher account attempts to alter marks after grades have been submitted, verified, or published. | Tampering | Critical | **State Machine Enforcement**: Marks collection transitions through `DRAFT` &rarr; `SUBMITTED` &rarr; `VERIFIED` &rarr; `PUBLISHED`. Direct writes are denied when status is not `DRAFT`. Once `PUBLISHED`, Firestore rules forbid any `update` or `delete` from all clients; modifications require an immutable audited re-examination workflow via Controller of Examinations Cloud Function. |
| **T-03** | **Cross-Student Grade & Academic Record Snooping**<br>Student queries Firestore to inspect other students' semester results, transcripts, disciplinary, or medical records. | Information Disclosure | High | Granular Firestore access rule: `match /results/{resultId}` requires `request.auth.uid == resource.data.studentUid` OR caller has custom claims `role in ['exam_controller', 'super_admin']` OR (`role in ['dept_chairman', 'teacher']` AND `token.deptId == resource.data.deptId`). Bulk queries require composite index scoped to `studentUid`. |
| **T-04** | **Bypassing the Multi-Step Administrative Approval Chain**<br>Student or rogue officer submits scholarship, certificate, clearance, or leave request and immediately marks it `APPROVED`. | Elevation of Privilege / Tampering | High | State transitions (`PENDING` &rarr; `DEPT_RECOMMENDED` &rarr; `OFFICE_VERIFIED` &rarr; `APPROVED` &rarr; `ISSUED`) are governed strictly by Cloud Functions. `firestore.rules` block client updates to the `status`, `approvalChain`, and `signatures` fields. |
| **T-05** | **Counterfeit or Forged Transcripts / Provisional Certificates**<br>Malicious actor fabricates a PDF degree certificate or modifies printed student details. | Spoofing / Tampering | Critical | Certificates carry a cryptographically signed QR code resolving to `https://jstu.ac.bd/verify?certId=...`. Server-side certificate rendering uses HMAC-SHA256 digests. Public verification endpoint displays only minimal sanitized metadata (Student Full Name, Degree Title, Graduation Year, Certificate Status) with zero PII (no phone, no national ID, no detailed address). |
| **T-06** | **Unauthorized Public Self-Registration**<br>Spammers or unauthorized outsiders create accounts using public sign-up endpoints. | Spoofing / Denial of Service | High | Firebase Auth public user registration is disabled in Firebase Console. Account provisioning is performed exclusively via admin Cloud Function `adminCreateUser` or batch CSV sync by ICT Cell / Registrar office with domain-restricted email verification. |
| **T-07** | **Tampering or Deletion of Administrative Audit Logs**<br>Compromised administrative account deletes audit trail records to conceal unauthorized marks changes or student fee clearances. | Repudiation | Critical | `/audit_logs` collection rules strictly enforce `allow read: if isSuperAdmin(); allow write: if false;`. All audit logs are written solely via Firebase Admin SDK inside Cloud Functions with Cloud Logging backup. |
| **T-08** | **Inter-Departmental Teacher Interference**<br>A faculty member in Geology attempts to view or update exam evaluation sheets belonging to CSE or EEE. | Information Disclosure / Tampering | High | Firestore security rules evaluate both `request.auth.token.deptId` and course allocation metadata. A teacher may only submit marks for course sections where `request.auth.uid in resource.data.assignedTeacherUids` and `token.deptId == resource.data.deptId`. |
| **T-09** | **Exhaustion & Injection Attacks via Gemini AI APIs**<br>Malicious client spams AI summarization/assistance endpoints or attempts prompt injection to extract student records. | Denial of Service / Info Disclosure | Medium | Gemini API is **never** called directly from the client. Calls occur via authenticated Cloud Functions with rate-limiting, strict Zod payload validation, sanitized prompt templates, and IAM context scoping. |
| **T-10** | **Session Hijacking of Privileged Administrative Personnel**<br>Administrative session token stolen via device theft or local network interception. | Spoofing | High | Mandatory MFA for staff roles, session revocation checks, short-lived tokens (1 hour), HTTP-only secure cookie transport for API endpoints, and Firebase App Check with reCAPTCHA Enterprise enforcement. |

---

## 2. Role &times; Permission Matrix

| Capability / Resource | super_admin | admin | registrar | exam_controller | dept_chairman | teacher | student | account_officer | library_officer |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **User Management (Provision/Deactivate)** | **Full** | **Full** (except super) | Read (Staff/Stud) | Read (Stud) | Read (Dept) | None | None | Read (Stud) | Read (Stud) |
| **Assign Roles & Custom Claims** | **Full** | Yes (Non-super) | None | None | None | None | None | None | None |
| **Course & Curriculum Management** | Read | Read | Read | Read | **Manage Dept** | Read Dept | Read Enrolled | None | None |
| **Course Enrollment / Registration** | Read | Read | Approve Official | Verify | Endorse Dept | Read Assigned | **Submit Self** | Fee Check | None |
| **Enter Marks (Draft / Submit)** | None | None | None | None | Override/Submit | **Assigned Courses** | None | None | None |
| **Verify Departmental Results** | Read | Read | Read | Scrutinize | **Approve Dept** | None | None | None | None |
| **Publish Final Results & GPA** | Read | Read | Read | **Full Authority** | None | None | None | None | None |
| **View Result Sheets (Draft/Unpublished)** | Yes | Yes | None | Yes | Dept Only | Assigned Only | **DENIED** | None | None |
| **View Published Academic Records** | Yes | Yes | Yes | Yes | Dept Only | Dept Courses | **Self Only** | None | None |
| **Issue Certificate & Degree** | Audit | None | Endorse | **Generate/Sign** | Endorse | None | Apply | Clear Fees | Clear Dues |
| **Clearance Processing (No Dues)** | Read | Read | Final Clearance | Read | Academic Clear | None | Apply/Track | **Financial Clear** | **Library Clear** |
| **Student Fee Billing & Payments** | Read | Read | Read | Read | None | None | Pay/View Self | **Full Manage** | None |
| **Library Catalog & Book Issuance** | Read | Read | Read | None | None | Borrow/Read | Borrow/Read | None | **Full Manage** |
| **Medical / Proctorial Records** | Yes | Yes | Read Disciplinary | None | Read Disciplinary | None | View Disciplinary | None | None |
| **Audit Logs Access** | **Full Read** | Read (Limited) | None | None | None | None | None | None | None |

---

## 3. Sitemap & Routes Per Role

### Public Routes (No Auth Required)
- `/` &mdash; JSTU Smart Campus Landing, Mission, Notices, Portal Login Directory
- `/login` &mdash; Institutional Single Sign-On Portal (MFA Prompt for Staff)
- `/verify/certificate/:certId` &mdash; Public Cryptographic Certificate & Degree Verification
- `/verify/transcript/:transcriptId` &mdash; Public Semester Grade Sheet Verification
- `/notices` &mdash; Public University Circulars & Exam Schedules
- `/contact` &mdash; JSTU Campus Directory & Emergency Contacts

### Student Portal (`/portal/student/*`)
- `/portal/student/dashboard` &mdash; Overview: Current Semester, CGPA Card, Dues, Notices
- `/portal/student/academics/courses` &mdash; Enrolled Courses, Syllabus, Class Schedule
- `/portal/student/academics/registration` &mdash; Semester Course Registration Form
- `/portal/student/academics/results` &mdash; Semester Grade Sheets & Cumulative CGPA
- `/portal/student/clearance` &mdash; Digital Multi-Office Clearance Request Tracker
- `/portal/student/certificates` &mdash; Application for Provisional Certificate / Transcript
- `/portal/student/fees` &mdash; Semester Fees, Hall Dues, Online Payment History
- `/portal/student/library` &mdash; Issued Books, Due Dates, Digital Repository Access
- `/portal/student/profile` &mdash; Student Bio-Data, Hall Info, Guardian Contact

### Teacher Portal (`/portal/teacher/*`)
- `/portal/teacher/dashboard` &mdash; Assigned Courses, Pending Mark Submissions, Schedule
- `/portal/teacher/courses` &mdash; Course Syllabus, Student Roster, Attendance Entry
- `/portal/teacher/marks/entry/:courseOfferingId` &mdash; Continuous Assessment & Final Marks (Draft/Submit)
- `/portal/teacher/clearances` &mdash; Departmental Advisor Clearance Sign-Off
- `/portal/teacher/profile` &mdash; Faculty Profile & Office Hours

### Department Chairman Portal (`/portal/dept-chairman/*`)
- `/portal/dept-chairman/dashboard` &mdash; Departmental KPI, Faculty Load, Result Deadlines
- `/portal/dept-chairman/curriculum` &mdash; Syllabus Management & Course Offerings
- `/portal/dept-chairman/course-allocations` &mdash; Assign Teachers to Courses & Exam Committees
- `/portal/dept-chairman/marks/verification` &mdash; Department Examination Scrutiny & Approval
- `/portal/dept-chairman/students` &mdash; Departmental Student Registry & Academic Standing
- `/portal/dept-chairman/clearances` &mdash; Departmental Clearance Endorsements

### Controller of Examinations Portal (`/portal/exam-controller/*`)
- `/portal/exam-controller/dashboard` &mdash; Exam Calendars, Submitted Tabulation Sheets, Status
- `/portal/exam-controller/tabulation` &mdash; Departmental Tabulation Review & Mark Auditing
- `/portal/exam-controller/results/publish` &mdash; Result Committee Final Sign-Off & Mass Publish
- `/portal/exam-controller/certificates/generate` &mdash; Digital Degree/Transcript Batch Issuance
- `/portal/exam-controller/certificates/registry` &mdash; Issued Certificate Ledger & Revocation

### Registrar Portal (`/portal/registrar/*`)
- `/portal/registrar/dashboard` &mdash; University Enrollment Statistics, Clearance Pipelines
- `/portal/registrar/students` &mdash; Central Student Registry, Admitted Batches, Hall Allocations
- `/portal/registrar/staff` &mdash; Faculty & Administrative Staff Directory
- `/portal/registrar/clearances/final` &mdash; Central Clearance Endorsement & Convocation List
- `/portal/registrar/notices/publish` &mdash; University-Wide Gazettes & Order Management

### Account & Finance Portal (`/portal/accounts/*`)
- `/portal/accounts/dashboard` &mdash; Fee Collection Summary, Departmental Dues
- `/portal/accounts/fees/billing` &mdash; Fee Structure Setup (Tuition, Hall, Exam, Retake)
- `/portal/accounts/reconciliation` &mdash; Online Bank Payments Reconciliation
- `/portal/accounts/clearances` &mdash; Financial Dues Audit & Clearance Sign-Off

### Library Portal (`/portal/library/*`)
- `/portal/library/dashboard` &mdash; Circulation Stats, Overdue Books, In-person Scans
- `/portal/library/catalog` &mdash; Book Inventory, ISBN Catalog, E-Resources
- `/portal/library/circulation` &mdash; Issue / Return Processing
- `/portal/library/clearances` &mdash; Library Due Sign-Off

### Administrator & Super Admin Portal (`/portal/admin/*`)
- `/portal/admin/dashboard` &mdash; System Health, User Distribution, Security Metrics
- `/portal/admin/users` &mdash; Institutional User Provisioning, Custom Claims & Role Assignment
- `/portal/admin/audit-logs` &mdash; Append-Only Immutable Security Audit Log Viewer
- `/portal/admin/departments-offices` &mdash; Faculty, Department, and Office Hierarchy Settings
- `/portal/admin/system-settings` &mdash; Academic Session Configuration, Backup & Security Rules

---

## 4. Firestore Collections Schema

### Core Collections:
1. `users/{userId}`: User identity and basic profile.
2. `departments/{deptId}`: Official university department metadata.
3. `academic_sessions/{sessionId}`: e.g. "2025-2026", "2026-2027", current active flags.
4. `courses/{courseId}`: Catalog courses (e.g., CSE-1101 Structured Programming).
5. `course_offerings/{offeringId}`: Course offered in a specific session/semester, assigned teachers.
6. `course_enrollments/{enrollmentId}`: Student registrations for an offering.
7. `marks/{markId}`: Assessment components for a student in a course offering.
8. `semester_results/{resultId}`: Final computed SGPA/CGPA result sheets (Immutable once PUBLISHED).
9. `clearance_requests/{requestId}`: Multi-department clearance workflow state machine.
10. `certificates/{certId}`: Cryptographically generated transcripts and certificates.
11. `fee_invoices/{invoiceId}`: Student fees, billing, and payment records.
12. `library_loans/{loanId}`: Book circulation records and dues.
13. `audit_logs/{logId}`: Append-only immutable administrative audit entries.

---

## 5. firestore.rules (Production Core)

See generated rules file ensuring:
- Strict helper functions checking `request.auth.token.role` and `token.deptId`.
- No client-side write access to `audit_logs`, `certificates`, or published `semester_results`.
- Mark editing allowed only when `status == 'DRAFT'` and teacher is an assigned instructor.
- Clearance workflow state machine transitions strictly controlled.

---

## 6. Cloud Functions List
1. `adminCreateUser`: Creates Firebase Auth user, provisions user document, and sets verified Custom Claims.
2. `adminSetCustomClaims`: Admin/SuperAdmin updates custom claims (role, deptId, officeId) with audit logging.
3. `submitCourseMarks`: Teacher transitions course marks from `DRAFT` to `SUBMITTED`.
4. `verifyDepartmentMarks`: Department Chairman validates and signs marks to `VERIFIED`.
5. `publishSemesterResults`: Exam Controller publishes results, executes server-side SGPA/CGPA computation, locks `marks`, generates `semester_results`.
6. `processClearanceStep`: State machine transition function for multi-office clearance sign-offs.
7. `generateDigitalCertificate`: Generates signed certificate record with SHA-256 hash and verification QR code.
8. `reconcilePayment`: Webhook/transaction verification for student tuition and exam fees.
9. `aiGenerateNoticeSummary`: Gemini-powered administrative notice summarizer and translation tool running strictly server-side.
10. `writeAuditLog`: Internal helper to write immutable audit trail to Firestore and Google Cloud Logging.

---

## 7. 20 Firestore Emulator Test Cases

Documented with expected pass/fail status covering privilege escalation, cross-student privacy, mark lifecycle integrity, and clearance transitions.

---

## 8. Directory & Folder Structure

Complete production modular structure organizing components, contexts, layouts, services, Cloud Functions, and emulator test suites.

---

## 9. Phase-by-Phase Build Plan

Phase 0 &rarr; Phase 1 (Core Infrastructure) &rarr; Phase 2 (Academics & Grading) &rarr; Phase 3 (Clearance & Certificates) &rarr; Phase 4 (Administrative & Finance) &rarr; Phase 5 (Bilingual & Polish).
