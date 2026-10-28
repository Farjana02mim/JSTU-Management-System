"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordLoginFailure = exports.preLoginCheck = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const zod_1 = require("zod");
const crypto = __importStar(require("crypto"));
const audit_1 = require("./audit");
const PreLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email()
});
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
function hashEmail(email) {
    return crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}
/**
 * Server-side brute-force lock keyed by email.
 * Evaluates login attempts in the private `loginAttempts` collection.
 * Uses strictly generic responses to prevent user/email enumeration.
 */
exports.preLoginCheck = (0, https_1.onCall)({
    enforceAppCheck: true,
    region: 'asia-east1'
}, async (request) => {
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
        const count = data.failedCount || 0;
        const lastAttempt = data.lastAttemptMs ? Number(data.lastAttemptMs) : 0;
        // If within lockout window and exceeded threshold
        if (count >= MAX_FAILED_ATTEMPTS && now - lastAttempt < LOCKOUT_WINDOW_MS) {
            await (0, audit_1.writeAuditLog)('system_throttler', 'BRUTE_FORCE_SUSPECTED', {
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
});
/**
 * Helper to record failed login attempts server-side.
 */
exports.recordLoginFailure = (0, https_1.onCall)({
    enforceAppCheck: true,
    region: 'asia-east1'
}, async (request) => {
    const parsed = PreLoginSchema.safeParse(request.data);
    if (!parsed.success)
        return { ok: false };
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
            count = (data.failedCount || 0) + 1;
        }
    }
    await attemptDocRef.set({
        failedCount: count,
        lastAttemptMs: now,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    await (0, audit_1.writeAuditLog)('system_auth', 'LOGIN_FAILURE', {
        targetEmail: email,
        details: { attemptCount: count },
        ipAddress: request.rawRequest.ip || 'unknown'
    });
    return { ok: true };
});
//# sourceMappingURL=preLoginCheck.js.map