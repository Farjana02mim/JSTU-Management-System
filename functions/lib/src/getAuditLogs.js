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
exports.getAuditLogs = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const audit_1 = require("./audit");
exports.getAuditLogs = (0, https_1.onCall)({
    enforceAppCheck: true,
    region: 'asia-east1'
}, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated.');
    }
    const callerUid = request.auth.uid;
    const callerClaims = request.auth.token;
    const callerRole = callerClaims.role || 'student';
    // Strictly restricted to super_admin
    if (callerRole !== 'super_admin') {
        await (0, audit_1.writeAuditLog)(callerUid, 'UNAUTHORIZED_ACCESS_ATTEMPT', {
            actorEmail: callerClaims.email,
            actorRole: callerRole,
            details: { attemptedAction: 'getAuditLogs' }
        });
        throw new https_1.HttpsError('permission-denied', 'Audit logs are accessible exclusively to Super Administrators.');
    }
    const db = admin.firestore();
    const snap = await db.collection('auditLogs').orderBy('timestamp', 'desc').limit(200).get();
    return snap.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : new Date().toISOString()
        };
    });
});
//# sourceMappingURL=getAuditLogs.js.map