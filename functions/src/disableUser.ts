import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import { UserRole, ROLE_HIERARCHY } from './types';
import { writeAuditLog } from './audit';

const DisableUserSchema = z.object({
  targetUid: z.string().min(1),
  reason: z.string().min(3).max(500)
});

export const disableUser = onCall(
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
        details: { attemptedAction: 'disableUser' }
      });
      throw new HttpsError('permission-denied', 'Only administrators can deactivate accounts.');
    }

    const parsed = DisableUserSchema.safeParse(request.data);
    if (!parsed.success) {
      throw new HttpsError('invalid-argument', parsed.error.issues[0]?.message || 'Invalid input data');
    }

    const { targetUid, reason } = parsed.data;

    if (callerUid === targetUid) {
      throw new HttpsError('invalid-argument', 'Administrators cannot deactivate their own account.');
    }

    const auth = admin.auth();
    const db = admin.firestore();

    let targetUser: admin.auth.UserRecord;
    try {
      targetUser = await auth.getUser(targetUid);
    } catch {
      throw new HttpsError('not-found', 'Target user does not exist.');
    }

    const targetRole = (targetUser.customClaims?.role as UserRole) || 'student';

    // Hierarchy check: admin cannot disable super_admin or admin
    if (callerRole === 'admin' && ROLE_HIERARCHY[targetRole] >= ROLE_HIERARCHY['admin']) {
      throw new HttpsError('permission-denied', 'Admins cannot disable accounts of equal or higher rank.');
    }

    // 1. Disable in Firebase Auth
    await auth.updateUser(targetUid, { disabled: true });

    // 2. Set claim disabled: true
    const currentClaims = targetUser.customClaims || {};
    await auth.setCustomUserClaims(targetUid, {
      ...currentClaims,
      disabled: true
    });

    // 3. Immediately revoke all refresh tokens
    await auth.revokeRefreshTokens(targetUid);

    // 4. Update Firestore doc
    await db.collection('users').doc(targetUid).update({
      disabled: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // 5. Append to auditLogs
    await writeAuditLog(callerUid, 'ACCOUNT_DISABLED', {
      actorEmail: callerClaims.email,
      actorRole: callerRole,
      targetUid,
      targetEmail: targetUser.email,
      details: { reason, targetRole }
    });

    return {
      success: true,
      message: `Account ${targetUser.email} has been deactivated and tokens revoked.`
    };
  }
);
