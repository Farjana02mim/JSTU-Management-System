import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import { UserRole, ROLE_HIERARCHY, STAFF_ROLES } from './types';
import { writeAuditLog } from './audit';

const CreateUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2).max(100),
  role: z.enum([
    'super_admin',
    'admin',
    'registrar',
    'exam_controller',
    'dept_chairman',
    'teacher',
    'student',
    'account_officer',
    'library_officer'
  ]),
  departmentId: z.string().optional(),
  officeId: z.string().optional(),
  studentId: z.string().optional()
}).refine((data) => {
  if (data.role === 'student' && (!data.studentId || data.studentId.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: 'studentId is required when provisioning student accounts',
  path: ['studentId']
});

export const createUserAccount = onCall(
  {
    enforceAppCheck: true,
    region: 'asia-east1'
  },
  async (request) => {
    // 1. Authenticated Gate
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated.');
    }

    const callerUid = request.auth.uid;
    const callerClaims = request.auth.token;
    const callerRole = (callerClaims.role as UserRole) || 'student';

    // 2. Privilege Gate
    if (callerRole !== 'admin' && callerRole !== 'super_admin') {
      await writeAuditLog(callerUid, 'UNAUTHORIZED_ACCESS_ATTEMPT', {
        actorEmail: callerClaims.email,
        actorRole: callerRole,
        details: { attemptedAction: 'createUserAccount' }
      });
      throw new HttpsError('permission-denied', 'Only administrators can provision institutional accounts.');
    }

    // 3. Payload Validation with Zod
    const parsed = CreateUserSchema.safeParse(request.data);
    if (!parsed.success) {
      throw new HttpsError('invalid-argument', parsed.error.issues[0]?.message || 'Invalid input data');
    }

    const { email, fullName, role, departmentId, officeId, studentId } = parsed.data;

    // 4. Role Hierarchy Enforcement:
    // Only super_admin can create admin or super_admin accounts.
    if (callerRole === 'admin') {
      if (role === 'admin' || role === 'super_admin') {
        await writeAuditLog(callerUid, 'UNAUTHORIZED_ACCESS_ATTEMPT', {
          actorEmail: callerClaims.email,
          actorRole: callerRole,
          details: { error: 'ELEVATION_ATTEMPT: Admin attempted to create administrative tier' }
        });
        throw new HttpsError('permission-denied', 'Admins cannot provision admin or super_admin accounts.');
      }

      if (ROLE_HIERARCHY[role] >= ROLE_HIERARCHY['admin']) {
        throw new HttpsError('permission-denied', 'Cannot assign roles equal to or higher than caller authority.');
      }
    }

    const auth = admin.auth();
    const db = admin.firestore();

    try {
      // 5. Create user in Firebase Authentication
      const tempPassword = Math.random().toString(36).slice(-10) + 'A1!x';
      const userRecord = await auth.createUser({
        email,
        displayName: fullName,
        emailVerified: true,
        password: tempPassword
      });

      // 6. Set verified Custom Claims (ONLY done here, never by client)
      const claims = {
        role,
        departmentId: departmentId || null,
        deptId: departmentId || null,
        officeId: officeId || null,
        studentId: role === 'student' ? studentId : null,
        mfaEnforced: STAFF_ROLES.includes(role),
        disabled: false,
        mustChangePassword: true
      };

      await auth.setCustomUserClaims(userRecord.uid, claims);

      // 7. Create users/{uid} document in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email,
        fullName,
        role,
        departmentId: departmentId || null,
        deptId: departmentId || null,
        officeId: officeId || null,
        studentId: studentId || null,
        isMfaEnforced: claims.mfaEnforced,
        disabled: false,
        mustChangePassword: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // 8. Write Immutable Audit Log
      await writeAuditLog(callerUid, 'ACCOUNT_CREATED', {
        actorEmail: callerClaims.email,
        actorRole: callerRole,
        targetUid: userRecord.uid,
        targetEmail: email,
        details: { assignedRole: role, departmentId, studentId }
      });

      // 9. Generate password reset link for user onboarding
      const resetLink = await auth.generatePasswordResetLink(email);

      return {
        uid: userRecord.uid,
        message: `Account created for ${email}. Setup link generated.`,
        resetLink
      };
    } catch (err: any) {
      if (err.code === 'auth/email-already-exists') {
        throw new HttpsError('already-exists', 'An account with this institutional email already exists.');
      }
      throw new HttpsError('internal', err.message || 'Failed to create user account');
    }
  }
);
