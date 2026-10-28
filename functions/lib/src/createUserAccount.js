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
exports.createUserAccount = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const zod_1 = require("zod");
const types_1 = require("./types");
const audit_1 = require("./audit");
const CreateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    fullName: zod_1.z.string().min(2).max(100),
    role: zod_1.z.enum([
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
    departmentId: zod_1.z.string().optional(),
    officeId: zod_1.z.string().optional(),
    studentId: zod_1.z.string().optional()
}).refine((data) => {
    if (data.role === 'student' && (!data.studentId || data.studentId.trim().length === 0)) {
        return false;
    }
    return true;
}, {
    message: 'studentId is required when provisioning student accounts',
    path: ['studentId']
});
exports.createUserAccount = (0, https_1.onCall)({
    enforceAppCheck: true,
    region: 'asia-east1'
}, async (request) => {
    // 1. Authenticated Gate
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated.');
    }
    const callerUid = request.auth.uid;
    const callerClaims = request.auth.token;
    const callerRole = callerClaims.role || 'student';
    // 2. Privilege Gate
    if (callerRole !== 'admin' && callerRole !== 'super_admin') {
        await (0, audit_1.writeAuditLog)(callerUid, 'UNAUTHORIZED_ACCESS_ATTEMPT', {
            actorEmail: callerClaims.email,
            actorRole: callerRole,
            details: { attemptedAction: 'createUserAccount' }
        });
        throw new https_1.HttpsError('permission-denied', 'Only administrators can provision institutional accounts.');
    }
    // 3. Payload Validation with Zod
    const parsed = CreateUserSchema.safeParse(request.data);
    if (!parsed.success) {
        throw new https_1.HttpsError('invalid-argument', parsed.error.issues[0]?.message || 'Invalid input data');
    }
    const { email, fullName, role, departmentId, officeId, studentId } = parsed.data;
    // 4. Role Hierarchy Enforcement:
    // Only super_admin can create admin or super_admin accounts.
    if (callerRole === 'admin') {
        if (role === 'admin' || role === 'super_admin') {
            await (0, audit_1.writeAuditLog)(callerUid, 'UNAUTHORIZED_ACCESS_ATTEMPT', {
                actorEmail: callerClaims.email,
                actorRole: callerRole,
                details: { error: 'ELEVATION_ATTEMPT: Admin attempted to create administrative tier' }
            });
            throw new https_1.HttpsError('permission-denied', 'Admins cannot provision admin or super_admin accounts.');
        }
        if (types_1.ROLE_HIERARCHY[role] >= types_1.ROLE_HIERARCHY['admin']) {
            throw new https_1.HttpsError('permission-denied', 'Cannot assign roles equal to or higher than caller authority.');
        }
    }
    const auth = admin.auth();
    const db = admin.firestore();
    try {
        // 5. Create user in Firebase Authentication
        const tempPassword = Math.random().toString(36).slice(-10) + 'A1!x';
        const userRecord = await auth.createUser({
            email,
            displayName: fullName,
            emailVerified: true,
            password: tempPassword
        });
        // 6. Set verified Custom Claims (ONLY done here, never by client)
        const claims = {
            role,
            departmentId: departmentId || null,
            deptId: departmentId || null,
            officeId: officeId || null,
            studentId: role === 'student' ? studentId : null,
            mfaEnforced: types_1.STAFF_ROLES.includes(role),
            disabled: false,
            mustChangePassword: true
        };
        await auth.setCustomUserClaims(userRecord.uid, claims);
        // 7. Create users/{uid} document in Firestore
        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email,
            fullName,
            role,
            departmentId: departmentId || null,
            deptId: departmentId || null,
            officeId: officeId || null,
            studentId: studentId || null,
            isMfaEnforced: claims.mfaEnforced,
            disabled: false,
            mustChangePassword: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        // 8. Write Immutable Audit Log
        await (0, audit_1.writeAuditLog)(callerUid, 'ACCOUNT_CREATED', {
            actorEmail: callerClaims.email,
            actorRole: callerRole,
            targetUid: userRecord.uid,
            targetEmail: email,
            details: { assignedRole: role, departmentId, studentId }
        });
        // 9. Generate password reset link for user onboarding
        const resetLink = await auth.generatePasswordResetLink(email);
        return {
            uid: userRecord.uid,
            message: `Account created for ${email}. Setup link generated.`,
            resetLink
        };
    }
    catch (err) {
        if (err.code === 'auth/email-already-exists') {
            throw new https_1.HttpsError('already-exists', 'An account with this institutional email already exists.');
        }
        throw new https_1.HttpsError('internal', err.message || 'Failed to create user account');
    }
});
//# sourceMappingURL=createUserAccount.js.map