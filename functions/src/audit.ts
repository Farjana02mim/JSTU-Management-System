import * as admin from 'firebase-admin';

export type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'ACCOUNT_CREATED'
  | 'ROLE_CHANGED'
  | 'ACCOUNT_DISABLED'
  | 'ACCOUNT_ENABLED'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_CHANGED'
  | 'SESSION_REVOKED'
  | 'BRUTE_FORCE_SUSPECTED'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT';

export interface AuditLogRecord {
  actorUid: string;
  actorEmail?: string;
  actorRole?: string;
  action: AuditAction;
  targetUid?: string;
  targetEmail?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: admin.firestore.FieldValue;
}

/**
 * Internal append-only audit log writer.
 * Writes strictly to the "auditLogs" collection.
 * Clients never have read or write access to this collection in firestore.rules.
 */
export async function writeAuditLog(
  actorUid: string,
  action: AuditAction,
  options: {
    actorEmail?: string;
    actorRole?: string;
    targetUid?: string;
    targetEmail?: string;
    details?: Record<string, unknown>;
    ipAddress?: string;
  } = {}
): Promise<string> {
  const db = admin.firestore();
  const entry: AuditLogRecord = {
    actorUid,
    actorEmail: options.actorEmail,
    actorRole: options.actorRole,
    action,
    targetUid: options.targetUid,
    targetEmail: options.targetEmail,
    details: options.details || {},
    ipAddress: options.ipAddress || 'unknown',
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  };

  const docRef = await db.collection('auditLogs').add(entry);
  return docRef.id;
}
