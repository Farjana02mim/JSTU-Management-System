import { UserRole, UserCustomClaims, UserProfile, AuditLogEntry, ROLE_HIERARCHY, STAFF_ROLES } from '../../types/auth';

/**
 * Server-Side Cloud Functions Engine (Node.js / Firebase Admin Simulation)
 * 
 * In production deployment, these functions execute on Google Cloud Functions using `firebase-admin`.
 * All role mutations, user provisioning, and audit logs happen strictly inside these functions.
 * Client Firestore SDK cannot write roles, department IDs, or audit logs directly.
 */

// In-memory or persisted emulator store for auth & claims
const usersStore: Map<string, UserProfile> = new Map();
const customClaimsStore: Map<string, UserCustomClaims> = new Map();
const auditLogsStore: AuditLogEntry[] = [];
const revokedTokens: Set<string> = new Set();
const authFailuresMap: Map<string, { count: number; lastAttempt: number }> = new Map();

// Helper to write append-only audit logs (Accessible only to server-side code)
export function writeAuditLog(
  actorUid: string,
  action: AuditLogEntry['action'],
  targetUid?: string,
  targetEmail?: string,
  details?: Record<string, unknown>,
  ipAddress = '127.0.0.1'
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    actorUid,
    action,
    targetUid,
    targetEmail,
    details,
    ipAddress,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server-Environment',
    timestamp: new Date().toISOString()
  };

  auditLogsStore.push(entry);
  return entry;
}

/**
 * 1. createUserAccount
 * Callable by super_admin or admin
 * Security rules:
 * - Admin cannot create super_admin or admin
 * - Admin cannot create roles equal to or higher than their own
 * - Sets custom claims {role, departmentId, studentId, mustChangePassword: true}
 * - Creates minimal users/{uid} document
 */
export interface CreateUserParams {
  callerClaims: UserCustomClaims;
  callerUid: string;
  email: string;
  fullName: string;
  role: UserRole;
  departmentId?: string;
  officeId?: string;
  studentId?: string;
}

export async function createUserAccount(params: CreateUserParams): Promise<{ uid: string; message: string }> {
  const { callerClaims, callerUid, email, fullName, role, departmentId, officeId, studentId } = params;

  // 1. Authorization Gate
  if (!callerClaims || (callerClaims.role !== 'admin' && callerClaims.role !== 'super_admin')) {
    writeAuditLog(callerUid, 'LOGIN_FAILURE', undefined, email, { error: 'PERMISSION_DENIED: Only admin or super_admin may call createUserAccount' });
    throw new Error('PERMISSION_DENIED: Insufficient permissions to provision users.');
  }

  // 2. Hierarchy Gate: Only super_admin may assign admin-level roles.
  // An admin cannot create or promote someone to super_admin or to a role above or equal to their own.
  if (callerClaims.role === 'admin') {
    if (role === 'super_admin' || role === 'admin') {
      writeAuditLog(callerUid, 'ROLE_CHANGED', undefined, email, { error: 'ELEVATION_ATTEMPT: Admin attempted to create admin or super_admin' });
      throw new Error('PERMISSION_DENIED: Admins cannot create super_admin or admin accounts.');
    }
    if (ROLE_HIERARCHY[role] >= ROLE_HIERARCHY['admin']) {
      throw new Error('PERMISSION_DENIED: Cannot assign a role equal to or above caller privilege.');
    }
  }

  // 3. Student ID requirement
  if (role === 'student' && !studentId) {
    throw new Error('VALIDATION_ERROR: Student accounts must specify a valid studentId (e.g. JSTU2026001).');
  }

  // 4. Generate Auth User & Custom Claims
  const uid = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const claims: UserCustomClaims = {
    role,
    departmentId,
    deptId: departmentId,
    officeId,
    studentId: role === 'student' ? studentId : undefined,
    mfaEnforced: STAFF_ROLES.includes(role),
    disabled: false,
    mustChangePassword: true
  };

  customClaimsStore.set(uid, claims);

  // 5. Minimal users/{uid} profile
  const profile: UserProfile = {
    uid,
    email,
    fullName,
    role,
    departmentId,
    officeId,
    studentId,
    isMfaEnforced: claims.mfaEnforced || false,
    mustChangePassword: true,
    disabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  usersStore.set(uid, profile);

  // 6. Append-only Audit Log
  writeAuditLog(callerUid, 'ACCOUNT_CREATED', uid, email, {
    assignedRole: role,
    departmentId,
    studentId
  });

  return {
    uid,
    message: `Account provisioned successfully for ${email}. Set-password link generated.`
  };
}

/**
 * 2. setUserRole
 * Callable by super_admin (or admin for lower tiers)
 */
export async function setUserRole(
  callerUid: string,
  callerClaims: UserCustomClaims,
  targetUid: string,
  newRole: UserRole,
  departmentId?: string
): Promise<{ success: boolean; message: string }> {
  // Authorization Gate
  if (!callerClaims || (callerClaims.role !== 'admin' && callerClaims.role !== 'super_admin')) {
    throw new Error('PERMISSION_DENIED: Caller not authorized to modify roles.');
  }

  // Hierarchy Gate: Only super_admin may assign admin-level roles
  if (callerClaims.role === 'admin') {
    if (newRole === 'super_admin' || newRole === 'admin') {
      throw new Error('PERMISSION_DENIED: Admin cannot assign admin or super_admin roles.');
    }
    const currentTarget = customClaimsStore.get(targetUid);
    if (currentTarget && ROLE_HIERARCHY[currentTarget.role] >= ROLE_HIERARCHY['admin']) {
      throw new Error('PERMISSION_DENIED: Admin cannot mutate accounts with equal or higher rank.');
    }
  }

  const existingClaims = customClaimsStore.get(targetUid) || { role: 'student' };
  const updatedClaims: UserCustomClaims = {
    ...existingClaims,
    role: newRole,
    departmentId: departmentId || existingClaims.departmentId,
    deptId: departmentId || existingClaims.departmentId,
    mfaEnforced: STAFF_ROLES.includes(newRole)
  };

  customClaimsStore.set(targetUid, updatedClaims);

  // Update profile
  const profile = usersStore.get(targetUid);
  if (profile) {
    profile.role = newRole;
    profile.departmentId = updatedClaims.departmentId;
    profile.isMfaEnforced = updatedClaims.mfaEnforced || false;
    profile.updatedAt = new Date().toISOString();
  }

  // Revoke token so client refreshes immediately
  revokedTokens.add(targetUid);

  writeAuditLog(callerUid, 'ROLE_CHANGED', targetUid, profile?.email, {
    oldRole: existingClaims.role,
    newRole
  });

  return { success: true, message: `Role for ${targetUid} changed to ${newRole}. Token revoked.` };
}

/**
 * 3. disableUser
 * Disables account and revokes refresh tokens
 */
export async function disableUser(
  callerUid: string,
  callerClaims: UserCustomClaims,
  targetUid: string,
  reason: string
): Promise<{ success: boolean }> {
  if (!callerClaims || (callerClaims.role !== 'admin' && callerClaims.role !== 'super_admin')) {
    throw new Error('PERMISSION_DENIED: Insufficient permissions to disable account.');
  }

  const profile = usersStore.get(targetUid);
  if (profile) {
    profile.disabled = true;
    profile.updatedAt = new Date().toISOString();
  }

  const claims = customClaimsStore.get(targetUid);
  if (claims) {
    claims.disabled = true;
  }

  // Revoke refresh token
  revokedTokens.add(targetUid);

  writeAuditLog(callerUid, 'ACCOUNT_DISABLED', targetUid, profile?.email, { reason });

  return { success: true };
}

/**
 * 4. getAuditLogs
 * Read-only, accessible EXCLUSIVELY to super_admin via Cloud Function
 */
export async function getAuditLogs(
  callerUid: string,
  callerClaims: UserCustomClaims
): Promise<AuditLogEntry[]> {
  if (!callerClaims || callerClaims.role !== 'super_admin') {
    writeAuditLog(callerUid, 'LOGIN_FAILURE', undefined, undefined, { error: 'UNAUTHORIZED_AUDIT_LOG_READ_ATTEMPT' });
    throw new Error('PERMISSION_DENIED: Audit logs may only be accessed by super_admin.');
  }

  return [...auditLogsStore].reverse(); // Newest first
}

/**
 * 5. Brute Force Throttling & Audit Failure Tracker
 */
export function recordAuthAttempt(email: string, success: boolean, ip = '127.0.0.1'): { blocked: boolean; message?: string } {
  const now = Date.now();
  const record = authFailuresMap.get(email) || { count: 0, lastAttempt: now };

  if (success) {
    authFailuresMap.delete(email);
    writeAuditLog('system', 'LOGIN_SUCCESS', undefined, email, {}, ip);
    return { blocked: false };
  }

  // Check if blocked (5 failures in 15 mins)
  if (now - record.lastAttempt > 15 * 60 * 1000) {
    record.count = 1;
  } else {
    record.count += 1;
  }
  record.lastAttempt = now;
  authFailuresMap.set(email, record);

  writeAuditLog('system', 'LOGIN_FAILURE', undefined, email, { attemptCount: record.count }, ip);

  if (record.count >= 5) {
    writeAuditLog('system', 'BRUTE_FORCE_SUSPECTED', undefined, email, { totalFailedAttempts: record.count }, ip);
    return { blocked: true, message: 'Too many failed login attempts. Please wait 15 minutes before retrying.' };
  }

  return { blocked: false };
}

// Check if user session was revoked
export function clearAuthLockout(email?: string): void {
  if (email) {
    authFailuresMap.delete(email);
  } else {
    authFailuresMap.clear();
  }
}

export function isSessionRevoked(uid: string): boolean {
  return revokedTokens.has(uid);
}

export function clearRevocation(uid: string): void {
  revokedTokens.delete(uid);
}

export function getUserClaims(uid: string): UserCustomClaims | undefined {
  return customClaimsStore.get(uid);
}

export function getUserProfile(uid: string): UserProfile | undefined {
  return usersStore.get(uid);
}

export function seedBackendUser(profile: UserProfile, claims: UserCustomClaims) {
  usersStore.set(profile.uid, profile);
  customClaimsStore.set(profile.uid, claims);
}

/**
 * 6. getAllUsers
 * Read-only, callable by admin / super_admin to inspect provisioned claims and profiles
 */
export async function getAllUsers(
  callerUid: string,
  callerClaims: UserCustomClaims
): Promise<{ profile: UserProfile; claims: UserCustomClaims }[]> {
  if (!callerClaims || (callerClaims.role !== 'admin' && callerClaims.role !== 'super_admin')) {
    throw new Error('PERMISSION_DENIED: Only administrators can inspect institutional accounts.');
  }

  const list: { profile: UserProfile; claims: UserCustomClaims }[] = [];
  usersStore.forEach((profile, uid) => {
    const claims = customClaimsStore.get(uid) || { role: profile.role };
    list.push({ profile, claims });
  });

  return list;
}

/**
 * 7. enableUser
 * Re-enables account and clears token revocation
 */
export async function enableUser(
  callerUid: string,
  callerClaims: UserCustomClaims,
  targetUid: string
): Promise<{ success: boolean }> {
  if (!callerClaims || (callerClaims.role !== 'admin' && callerClaims.role !== 'super_admin')) {
    throw new Error('PERMISSION_DENIED: Insufficient permissions to enable account.');
  }

  const profile = usersStore.get(targetUid);
  if (profile) {
    profile.disabled = false;
    profile.updatedAt = new Date().toISOString();
  }

  const claims = customClaimsStore.get(targetUid);
  if (claims) {
    claims.disabled = false;
  }

  revokedTokens.delete(targetUid);

  writeAuditLog(callerUid, 'ACCOUNT_CREATED', targetUid, profile?.email, { action: 'ACCOUNT_RE_ENABLED' });

  return { success: true };
}

// User credentials and password storage for demo mode
const userPasswordsStore: Map<string, string> = new Map();

/**
 * Sets password for a user in demo backend engine (keyed by uid and email).
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */
export function setUserPassword(key: string, pass: string): void {
  userPasswordsStore.set(key.toLowerCase(), pass);
}

/**
 * Gets stored password for a user in demo backend engine.
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */
export function getUserPassword(key: string): string | undefined {
  return userPasswordsStore.get(key.toLowerCase());
}

/**
 * Clears mustChangePassword flag after set-password activation step.
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */
export function clearUserMustChangePassword(uid: string): void {
  const claims = customClaimsStore.get(uid);
  if (claims) {
    claims.mustChangePassword = false;
  }
  const profile = usersStore.get(uid);
  if (profile) {
    profile.mustChangePassword = false;
    profile.updatedAt = new Date().toISOString();
  }
}

/**
 * Finds user profile by email in mock usersStore.
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */
export function getUserProfileByEmail(email: string): UserProfile | undefined {
  const normalized = email.toLowerCase().trim();
  for (const profile of usersStore.values()) {
    if (profile.email.toLowerCase().trim() === normalized) {
      return profile;
    }
  }
  return undefined;
}
