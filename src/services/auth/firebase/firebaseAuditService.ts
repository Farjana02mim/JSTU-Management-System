import { httpsCallable } from 'firebase/functions';
import { functions } from './firebaseConfig';
import { AuditService } from '../types';
import { AuditLogEntry } from '../../../types/auth';

export class FirebaseAuditService implements AuditService {
  async getAuditLogs(): Promise<AuditLogEntry[]> {
    // Only callable by super_admin via Cloud Function.
    // Clients never read the auditLogs collection directly.
    const fn = httpsCallable<void, AuditLogEntry[]>(functions, 'getAuditLogs');
    const result = await fn();
    return result.data;
  }
}
