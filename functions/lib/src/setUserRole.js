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
exports.setUserRole = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const zod_1 = require("zod");
const types_1 = require("./types");
const audit_1 = require("./audit");
const SetUserRoleSchema = zod_1.z.object({
    targetUid: zod_1.z.string().min(1),
    newRole: zod_1.z.enum([
        'super_admin',
        'admin',
        'registrar',
        'exam_controller',
        'dept_chairman',
        'teacher',
        'student',
        'account_officer',
        'library_officer'
    ]),
    departmentId: zod_1.z.string().optional()
});
exports.setUserRole = (0, https_1.onCall)({
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
            details: { attemptedAction: 'setUserRole' }
        });
        throw new https_1.HttpsError('permission-denied', 'Only administrators can update roles.');
    }
    const parsed = SetUserRoleSchema.safeParse(request.data);
    if (!parsed.success) {
        throw new https_1.HttpsError('invalid-argument', parsed.error.issues[0]?.message || 'Invalid input data');
    }
    const { targetUid, newRole, departmentId } = parsed.data;
    // Prevent modifying own role directly
    if (callerUid === targetUid) {
        throw new https_1.HttpsError('invalid-argument', 'Administrators cannot modify their own role.');
    }
    const auth = admin.auth();
    const db = admin.firestore();
    // Fetch target user's existing claims
    let targetUser;
    try {
        targetUser = await auth.getUser(targetUid);
    }
    catch {
        throw new https_1.HttpsError('not-found', 'Target user does not exist.');
    }
    const currentClaims = targetUser.customClaims || {};
    const oldRole = currentClaims.role || 'student';
    // Role Hierarchy Gate:
    // Only super_admin may manage admin roles.
    if (callerRole === 'admin') {
        if (newRole === 'super_admin' || newRole === 'admin') {
            throw new https_1.HttpsError('permission-denied', 'Admins cannot assign admin or super_admin roles.');
        }
        if (types_1.ROLE_HIERARCHY[oldRole] >= types_1.ROLE_HIERARCHY['admin']) {
            throw new https_1.HttpsError('permission-denied', 'Admins cannot modify accounts with rank equal to or above their own.');
        }
    }
    // Set updated Custom Claims
    const updatedClaims = {
        ...currentClaims,
        role: newRole,
        departmentId: departmentId || currentClaims.departmentId || null,
        deptId: departmentId || currentClaims.deptId || null,
        mfaEnforced: types_1.STAFF_ROLES.includes(newRole)
    };
    await auth.setCustomUserClaims(targetUid, updatedClaims);
    // Revoke target user's refresh tokens so client must re-fetch claims
    await auth.revokeRefreshTokens(targetUid);
    // Update Firestore users/{targetUid} document
    await db.collection('users').doc(targetUid).update({
        role: newRole,
        departmentId: updatedClaims.departmentId,
        deptId: updatedClaims.deptId,
        isMfaEnforced: updatedClaims.mfaEnforced,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    // Write to auditLogs
    await (0, audit_1.writeAuditLog)(callerUid, 'ROLE_CHANGED', {
        actorEmail: callerClaims.email,
        actorRole: callerRole,
        targetUid,
        targetEmail: targetUser.email,
        details: { oldRole, newRole, departmentId }
    });
    return {
        success: true,
        message: `Role for ${targetUser.email} updated to ${newRole}. Session tokens revoked.`
    };
});
//# sourceMappingURL=setUserRole.js.map