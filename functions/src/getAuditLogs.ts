import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { UserRole } from './types';
import { writeAuditLog } from './audit';

export const getAuditLogs = onCall(
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

    // Strictly restricted to super_admin
    if (callerRole !== 'super_admin') {
      await writeAuditLog(callerUid, 'UNAUTHORIZED_ACCESS_ATTEMPT', {
        actorEmail: callerClaims.email,
        actorRole: callerRole,
        details: { attemptedAction: 'getAuditLogs' }
      });
      throw new HttpsError('permission-denied', 'Audit logs are accessible exclusively to Super Administrators.');
    }

    const db = admin.firestore();
    const snap = await db.collection('auditLogs').orderBy('timestamp', 'desc').limit(200).get();

    return snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : new Date().toISOString()
      };
    });
  }
);
