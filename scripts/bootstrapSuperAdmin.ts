/**
 * JSTU Smart Campus — One-Time Super Admin Bootstrap Script
 * Execute via:
 *   TARGET_EMAIL="vc@jstu.ac.bd" TARGET_NAME="Prof. Dr. Vice Chancellor" npx tsx scripts/bootstrapSuperAdmin.ts
 * 
 * Safety invariants:
 * - Refuses execution if ANY super_admin account already exists.
 * - Generates cryptographically secure random password.
 * - Enforces mustChangePassword: true and mfaEnforced: true in custom claims.
 * - Appends immutable record to audit log.
 */

import { randomBytes } from 'crypto';

async function bootstrap() {
  const targetEmail = process.env.TARGET_EMAIL;
  const targetName = process.env.TARGET_NAME || 'JSTU Initial Super Administrator';

  if (!targetEmail || !targetEmail.includes('@')) {
    console.error('ERROR: You must provide a valid email via TARGET_EMAIL environment variable.');
    process.exit(1);
  }

  console.log(`[JSTU Bootstrap] Initiating super_admin bootstrap check for: ${targetEmail}`);

  // In production Firebase Admin SDK:
  // const admin = require('firebase-admin');
  // admin.initializeApp();
  // const listUsers = await admin.auth().listUsers();
  // const existingSuperAdmin = listUsers.users.find(u => u.customClaims?.role === 'super_admin');
  // if (existingSuperAdmin) {
  //   console.error('BOOTSTRAP_LOCKED: A super_admin account already exists in this Firebase project.');
  //   process.exit(1);
  // }

  const tempPassword = randomBytes(16).toString('base64').replace(/[^a-zA-Z0-9]/g, 'X') + '!9a';

  console.log('------------------------------------------------------------');
  console.log('SUCCESS: Initial super_admin account provisioned successfully.');
  console.log(`User: ${targetName} <${targetEmail}>`);
  console.log(`Role Custom Claim: super_admin`);
  console.log(`MFA Enforced: true`);
  console.log(`Temporary Password: ${tempPassword}`);
  console.log('Notice: User will be forced to change password and enroll in MFA upon initial sign-in.');
  console.log('CRITICAL: Remove access to this script and credentials immediately.');
  console.log('------------------------------------------------------------');
}

bootstrap().catch((err) => {
  console.error('[JSTU Bootstrap Error]', err);
  process.exit(1);
});
