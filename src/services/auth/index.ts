import type { AuthService, UserAdminService, AuditService } from './types';

// Real Firebase is connected if a valid, non-placeholder API key is configured
// and VITE_USE_MOCK is not explicitly set to 'true'.
export const isFirebaseConnected = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'demo-api-key' &&
  import.meta.env.VITE_FIREBASE_API_KEY.trim() !== '' &&
  import.meta.env.VITE_USE_MOCK !== 'true'
);

// In demo mode (mock services) when real Firebase is not connected or VITE_USE_MOCK is true
export const isMockMode = !isFirebaseConnected;

let authServiceInstance: AuthService | null = null;
let userAdminServiceInstance: UserAdminService | null = null;
let auditServiceInstance: AuditService | null = null;

export async function getAuthService(): Promise<AuthService> {
  if (authServiceInstance) return authServiceInstance;

  if (isMockMode) {
    const { MockAuthService } = await import('./mock/mockAuthService');
    authServiceInstance = new MockAuthService();
  } else {
    const { FirebaseAuthService } = await import('./firebase/firebaseAuthService');
    authServiceInstance = new FirebaseAuthService();
  }

  return authServiceInstance;
}

export async function getUserAdminService(): Promise<UserAdminService> {
  if (userAdminServiceInstance) return userAdminServiceInstance;

  if (isMockMode) {
    const { MockUserAdminService } = await import('./mock/mockUserAdminService');
    userAdminServiceInstance = new MockUserAdminService();
  } else {
    const { FirebaseUserAdminService } = await import('./firebase/firebaseUserAdminService');
    userAdminServiceInstance = new FirebaseUserAdminService();
  }

  return userAdminServiceInstance;
}

export async function getAuditService(): Promise<AuditService> {
  if (auditServiceInstance) return auditServiceInstance;

  if (isMockMode) {
    const { MockAuditService } = await import('./mock/mockAuditService');
    auditServiceInstance = new MockAuditService();
  } else {
    const { FirebaseAuditService } = await import('./firebase/firebaseAuditService');
    auditServiceInstance = new FirebaseAuditService();
  }

  return auditServiceInstance;
}
