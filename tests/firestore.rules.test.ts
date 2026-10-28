import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import * as fs from 'fs';
import * as path from 'path';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const PROJECT_ID = 'jstu-smart-campus-test';

describe('JSTU Smart Campus — Firestore Security Rules Audit', () => {
  let testEnv: RulesTestEnvironment;

  beforeAll(async () => {
    const rulesPath = path.resolve(__dirname, '../firestore.rules');
    const rules = fs.readFileSync(rulesPath, 'utf8');

    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules,
        host: '127.0.0.1',
        port: 8080
      }
    });
  });

  afterAll(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    if (testEnv) {
      await testEnv.clearFirestore();

      // Seed initial data using admin context (bypasses rules)
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'users', 'student_1'), {
          uid: 'student_1',
          email: 'student1@jstu.ac.bd',
          fullName: 'Tanvir Ahmed',
          role: 'student',
          deptId: 'CSE',
          departmentId: 'CSE',
          studentId: 'JSTU2026001',
          isMfaEnforced: false,
          disabled: false
        });

        await setDoc(doc(adminDb, 'users', 'student_2'), {
          uid: 'student_2',
          email: 'student2@jstu.ac.bd',
          fullName: 'Nusrat Jahan',
          role: 'student',
          deptId: 'EEE',
          departmentId: 'EEE',
          studentId: 'JSTU2026002',
          isMfaEnforced: false,
          disabled: false
        });

        await setDoc(doc(adminDb, 'auditLogs', 'log_existing'), {
          actorUid: 'system',
          action: 'ACCOUNT_CREATED',
          targetUid: 'student_1'
        });
      });
    }
  });

  // -------------------------------------------------------------
  // Test 1: Student writes own role
  // -------------------------------------------------------------
  it('1. MUST FAIL: Student attempts to elevate privilege by updating own role to admin', async () => {
    const studentContext = testEnv.authenticatedContext('student_1', {
      role: 'student',
      deptId: 'CSE'
    });
    const db = studentContext.firestore();

    const studentRef = doc(db, 'users', 'student_1');
    await assertFails(
      updateDoc(studentRef, {
        role: 'admin'
      })
    );
  });

  // -------------------------------------------------------------
  // Test 2: Teacher calls createUserAccount (client writing users doc)
  // -------------------------------------------------------------
  it('2. MUST FAIL: Teacher attempts to create a new user document directly from client SDK', async () => {
    const teacherContext = testEnv.authenticatedContext('teacher_1', {
      role: 'teacher',
      deptId: 'CSE'
    });
    const db = teacherContext.firestore();

    const newUserRef = doc(db, 'users', 'student_new');
    await assertFails(
      setDoc(newUserRef, {
        uid: 'student_new',
        email: 'newstudent@jstu.ac.bd',
        role: 'student',
        deptId: 'CSE'
      })
    );
  });

  // -------------------------------------------------------------
  // Test 3: Admin creates super_admin
  // -------------------------------------------------------------
  it('3. MUST FAIL: Admin attempts to create or elevate a user to super_admin from client', async () => {
    const adminContext = testEnv.authenticatedContext('admin_1', {
      role: 'admin'
    });
    const db = adminContext.firestore();

    // Client user creation is completely forbidden (allow create: if false)
    const superAdminRef = doc(db, 'users', 'super_admin_target');
    await assertFails(
      setDoc(superAdminRef, {
        uid: 'super_admin_target',
        email: 'attacker@jstu.ac.bd',
        role: 'super_admin'
      })
    );
  });

  // -------------------------------------------------------------
  // Test 4: Disabled user reads data
  // -------------------------------------------------------------
  it('4. MUST FAIL: Deactivated user (token claim disabled: true) attempts to read records', async () => {
    const disabledContext = testEnv.authenticatedContext('student_1', {
      role: 'student',
      deptId: 'CSE',
      disabled: true
    });
    const db = disabledContext.firestore();

    const studentRef = doc(db, 'users', 'student_1');
    await assertFails(getDoc(studentRef));
  });

  // -------------------------------------------------------------
  // Test 5: Unauthenticated read of users/{uid}
  // -------------------------------------------------------------
  it('5. MUST FAIL: Unauthenticated visitor attempts to inspect student profile', async () => {
    const unauthContext = testEnv.unauthenticatedContext();
    const db = unauthContext.firestore();

    const studentRef = doc(db, 'users', 'student_1');
    await assertFails(getDoc(studentRef));
  });

  // -------------------------------------------------------------
  // Test 6: User reads another profile
  // -------------------------------------------------------------
  it('6. MUST FAIL: Student 1 attempts to snoop Student 2 profile', async () => {
    const student1Context = testEnv.authenticatedContext('student_1', {
      role: 'student',
      deptId: 'CSE'
    });
    const db = student1Context.firestore();

    const otherStudentRef = doc(db, 'users', 'student_2');
    await assertFails(getDoc(otherStudentRef));
  });

  // -------------------------------------------------------------
  // Test 7: Client touches auditLogs (read or write)
  // -------------------------------------------------------------
  it('7. MUST FAIL: Any client SDK (even super_admin) attempts to read or write auditLogs directly', async () => {
    const superAdminContext = testEnv.authenticatedContext('super_admin_1', {
      role: 'super_admin'
    });
    const db = superAdminContext.firestore();

    const auditRef = doc(db, 'auditLogs', 'log_existing');
    // Direct client read MUST FAIL
    await assertFails(getDoc(auditRef));

    // Direct client write MUST FAIL
    await assertFails(
      setDoc(doc(db, 'auditLogs', 'tampered_log'), {
        actorUid: 'malicious',
        action: 'ROLE_CHANGED'
      })
    );
  });

  // -------------------------------------------------------------
  // Positive Control: Student reads own profile
  // -------------------------------------------------------------
  it('8. POSITIVE CONTROL: Student can read their own profile', async () => {
    const studentContext = testEnv.authenticatedContext('student_1', {
      role: 'student',
      deptId: 'CSE'
    });
    const db = studentContext.firestore();

    const ownRef = doc(db, 'users', 'student_1');
    await assertSucceeds(getDoc(ownRef));
  });
});
