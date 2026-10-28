import * as admin from 'firebase-admin';

// Initialize Firebase Admin with ambient Google Cloud credentials
if (admin.apps.length === 0) {
  admin.initializeApp();
}

export { createUserAccount } from './createUserAccount';
export { setUserRole } from './setUserRole';
export { disableUser } from './disableUser';
export { preLoginCheck, recordLoginFailure } from './preLoginCheck';
export { getAuditLogs } from './getAuditLogs';
