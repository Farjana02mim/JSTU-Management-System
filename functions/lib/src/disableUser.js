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
exports.disableUser = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const zod_1 = require("zod");
const types_1 = require("./types");
const audit_1 = require("./audit");
const DisableUserSchema = zod_1.z.object({
    targetUid: zod_1.z.string().min(1),
    reason: zod_1.z.string().min(3).max(500)
});
exports.disableUser = (0, https_1.onCall)({
    enforceAppCheck: true,
    region: 'asia-east1'
}, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated.');
    }
    const callerUid = request.auth.uid;
    const callerClaims = request.auth.token;
    const callerRole = callerClaims.role || 'student';
    if (callerRole !== 'admin' && callerRole !== 'super_admin') {
        await (0, audit_1.writeAuditLog)(callerUid, 'UNAUTHORIZED_ACCESS_ATTEMPT', {
            actorEmail: callerClaims.email,
            actorRole: callerRole,
            details: { attemptedAction: 'disableUser' }
        });
        throw new https_1.HttpsError('permission-denied', 'Only administrators can deactivate accounts.');
    }
    const parsed = DisableUserSchema.safeParse(request.data);
    if (!parsed.success) {
        throw new https_1.HttpsError('invalid-argument', parsed.error.issues[0]?.message || 'Invalid input data');
    }
    const { targetUid, reason } = parsed.data;
    if (callerUid === targetUid) {
        throw new https_1.HttpsError('invalid-argument', 'Administrators cannot deactivate their own account.');
    }
    const auth = admin.auth();
    const db = admin.firestore();
    let targetUser;
    try {
        targetUser = await auth.getUser(targetUid);
    }
    catch {
        throw new https_1.HttpsError('not-found', 'Target user does not exist.');
    }
    const targetRole = targetUser.customClaims?.role || 'student';
    // Hierarchy check: admin cannot disable super_admin or admin
    if (callerRole === 'admin' && types_1.ROLE_HIERARCHY[targetRole] >= types_1.ROLE_HIERARCHY['admin']) {
        throw new https_1.HttpsError('permission-denied', 'Admins cannot disable accounts of equal or higher rank.');
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
    await (0, audit_1.writeAuditLog)(callerUid, 'ACCOUNT_DISABLED', {
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
});
//# sourceMappingURL=disableUser.js.map