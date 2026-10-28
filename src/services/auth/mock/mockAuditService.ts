import { AuditService } from '../types';
import { AuditLogEntry } from '../../../types/auth';
import { getAuditLogs } from '../../cloudFunctions/backendEngine';

export class MockAuditService implements AuditService {
  async getAuditLogs(): Promise<AuditLogEntry[]> {
    return getAuditLogs('mock_super_admin', { role: 'super_admin' });
  }
}
