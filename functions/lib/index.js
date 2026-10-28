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
exports.getAuditLogs = exports.recordLoginFailure = exports.preLoginCheck = exports.disableUser = exports.setUserRole = exports.createUserAccount = void 0;
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin with ambient Google Cloud credentials
if (admin.apps.length === 0) {
    admin.initializeApp();
}
var createUserAccount_1 = require("./createUserAccount");
Object.defineProperty(exports, "createUserAccount", { enumerable: true, get: function () { return createUserAccount_1.createUserAccount; } });
var setUserRole_1 = require("./setUserRole");
Object.defineProperty(exports, "setUserRole", { enumerable: true, get: function () { return setUserRole_1.setUserRole; } });
var disableUser_1 = require("./disableUser");
Object.defineProperty(exports, "disableUser", { enumerable: true, get: function () { return disableUser_1.disableUser; } });
var preLoginCheck_1 = require("./preLoginCheck");
Object.defineProperty(exports, "preLoginCheck", { enumerable: true, get: function () { return preLoginCheck_1.preLoginCheck; } });
Object.defineProperty(exports, "recordLoginFailure", { enumerable: true, get: function () { return preLoginCheck_1.recordLoginFailure; } });
var getAuditLogs_1 = require("./getAuditLogs");
Object.defineProperty(exports, "getAuditLogs", { enumerable: true, get: function () { return getAuditLogs_1.getAuditLogs; } });
//# sourceMappingURL=index.js.map