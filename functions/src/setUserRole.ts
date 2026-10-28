import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import { UserRole, ROLE_HIERARCHY, STAFF_ROLES } from './types';
import { writeAuditLog } from './audit';

const SetUserRoleSchema = z.object({
  targetUid: z.string().min(1),
  newRole: z.enum([
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
  departmentId: z.string().optional()
});

export const setUserRole = onCall(
  {
    enforceAppCheck: true,
    region: 'asia-east1'
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated.');
    }

    const callerUid = request.auth.uid;
    const callerClaims = request.auth.token;
    const callerRole = (callerClaims.role as UserRole) || 'student';

    if (callerRole !== 'admin' && callerRole !== 'super_admin') {
      await writeAuditLog(callerUid, 'UNAUTHORIZED_ACCESS_ATTEMPT', {
        actorEmail: callerClaims.email,
        actorRole: callerRole,
        details: { attemptedAction: 'setUserRole' }
      });
      throw new HttpsError('permission-denied', 'Only administrators can update roles.');
    }

    const parsed = SetUserRoleSchema.safeParse(request.data);
    if (!parsed.success) {
      throw new HttpsError('invalid-argument', parsed.error.issues[0]?.message || 'Invalid input data');
    }

    const { targetUid, newRole, departmentId } = parsed.data;

    // Prevent modifying own role directly
    if (callerUid === targetUid) {
      throw new HttpsError('invalid-argument', 'Administrators cannot modify their own role.');
    }

    const auth = admin.auth();
    const db = admin.firestore();

    // Fetch target user's existing claims
    let targetUser: admin.auth.UserRecord;
    try {
      targetUser = await auth.getUser(targetUid);
    } catch {
      throw new HttpsError('not-found', 'Target user does not exist.');
    }

    const currentClaims = targetUser.customClaims || {};
    const oldRole = (currentClaims.role as UserRole) || 'student';

    // Role Hierarchy Gate:
    // Only super_admin may manage admin roles.
    if (callerRole === 'admin') {
      if (newRole === 'super_admin' || newRole === 'admin') {
        throw new HttpsError('permission-denied', 'Admins cannot assign admin or super_admin roles.');
      }
      if (ROLE_HIERARCHY[oldRole] >= ROLE_HIERARCHY['admin']) {
        throw new HttpsError('permission-denied', 'Admins cannot modify accounts with rank equal to or above their own.');
      }
    }

    // Set updated Custom Claims
    const updatedClaims = {
      ...currentClaims,
      role: newRole,
      departmentId: departmentId || currentClaims.departmentId || null,
      deptId: departmentId || currentClaims.deptId || null,
      mfaEnforced: STAFF_ROLES.includes(newRole)
    };

    await auth.setCustomUserClaims(targetUid, updatedClaims);

    // Revoke target user's refresh tokens so client must re-fetch claims
    await auth.revokeRefreshTokens(targetUid);

    // Update Firestore users/{targetUid} document
    await db.collection('users').doc(targetUid).update({
      role: newRole,
      departmentId: updatedClaims.departmentId,
      deptId: updatedClaims.deptId,
      isMfaEnforced: updatedClaims.mfaEnforced,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Write to auditLogs
    await writeAuditLog(callerUid, 'ROLE_CHANGED', {
      actorEmail: callerClaims.email,
      actorRole: callerRole,
      targetUid,
      targetEmail: targetUser.email,
      details: { oldRole, newRole, departmentId }
    });

    return {
      success: true,
      message: `Role for ${targetUser.email} updated to ${newRole}. Session tokens revoked.`
    };
  }
);
