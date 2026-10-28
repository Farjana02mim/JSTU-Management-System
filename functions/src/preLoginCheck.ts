import { onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import * as crypto from 'crypto';
import { writeAuditLog } from './audit';

const PreLoginSchema = z.object({
  email: z.string().email()
});

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function hashEmail(email: string): string {
  return crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

/**
 * Server-side brute-force lock keyed by email.
 * Evaluates login attempts in the private `loginAttempts` collection.
 * Uses strictly generic responses to prevent user/email enumeration.
 */
export const preLoginCheck = onCall(
  {
    enforceAppCheck: true,
    region: 'asia-east1'
  },
  async (request) => {
    const parsed = PreLoginSchema.safeParse(request.data);
    if (!parsed.success) {
      // Generic error response (anti-enumeration)
      return { allowed: false, message: 'Invalid credentials or request.' };
    }

    const email = parsed.data.email.trim().toLowerCase();
    const emailKey = hashEmail(email);
    const db = admin.firestore();
    const attemptDocRef = db.collection('loginAttempts').doc(emailKey);

    const docSnap = await attemptDocRef.get();
    const now = Date.now();

    if (docSnap.exists) {
      const data = docSnap.data() || {};
      const count = (data.failedCount as number) || 0;
      const lastAttempt = data.lastAttemptMs ? Number(data.lastAttemptMs) : 0;

      // If within lockout window and exceeded threshold
      if (count >= MAX_FAILED_ATTEMPTS && now - lastAttempt < LOCKOUT_WINDOW_MS) {
        await writeAuditLog('system_throttler', 'BRUTE_FORCE_SUSPECTED', {
          targetEmail: email,
          details: { failedCount: count, windowRemainingMs: LOCKOUT_WINDOW_MS - (now - lastAttempt) },
          ipAddress: request.rawRequest.ip || 'unknown'
        });

        // Always return generic response to avoid enumeration
        return {
          allowed: false,
          message: 'Too many failed login attempts. For security, please try again in 15 minutes.'
        };
      }
    }

    return { allowed: true };
  }
);

/**
 * Helper to record failed login attempts server-side.
 */
export const recordLoginFailure = onCall(
  {
    enforceAppCheck: true,
    region: 'asia-east1'
  },
  async (request) => {
    const parsed = PreLoginSchema.safeParse(request.data);
    if (!parsed.success) return { ok: false };

    const email = parsed.data.email.trim().toLowerCase();
    const emailKey = hashEmail(email);
    const db = admin.firestore();
    const attemptDocRef = db.collection('loginAttempts').doc(emailKey);

    const docSnap = await attemptDocRef.get();
    const now = Date.now();

    let count = 1;
    if (docSnap.exists) {
      const data = docSnap.data() || {};
      const lastAttempt = data.lastAttemptMs ? Number(data.lastAttemptMs) : 0;
      if (now - lastAttempt < LOCKOUT_WINDOW_MS) {
        count = ((data.failedCount as number) || 0) + 1;
      }
    }

    await attemptDocRef.set({
      failedCount: count,
      lastAttemptMs: now,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await writeAuditLog('system_auth', 'LOGIN_FAILURE', {
      targetEmail: email,
      details: { attemptCount: count },
      ipAddress: request.rawRequest.ip || 'unknown'
    });

    return { ok: true };
  }
);
