# JSTU Smart Campus — Super Admin Initial Bootstrap Procedure
**Jamalpur Science & Technology University (JSTU), Jamalpur-2012, Bangladesh**

---

## 1. Zero-Trust Bootstrap Principle
To comply with strict institutional security rules:
- **No hardcoded credentials** exist anywhere in the application repository.
- Public account creation is disabled in Firebase Auth.
- Initial super_admin establishment is executed via a one-time server-side CLI script using Firebase Admin SDK credentials in Google Cloud Shell or securely via the Firebase Admin command line.

---

## 2. One-Time Setup Procedure

### Step 1: Access Environment
In Google Cloud Shell or a secure workstation with administrative IAM access to the Firebase project:
```bash
# Set your target Firebase project
gcloud config set project <YOUR_FIREBASE_PROJECT_ID>

# Ensure service account has Firebase Admin privileges
export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"
```

### Step 2: Execute Bootstrap Script
Run the zero-trust bootstrap script, passing the target super_admin email interactively or via environment variable (DO NOT hardcode credentials into files):

```bash
# Interactive execution
TARGET_EMAIL="vc@jstu.ac.bd" TARGET_NAME="Prof. Dr. Vice Chancellor" npx tsx scripts/bootstrapSuperAdmin.ts
```

### Step 3: Script Operations Performed
1. Checks if any user with `role: "super_admin"` already exists in Firebase Auth.
2. If one exists, the script **immediately halts** and exits with an error (`BOOTSTRAP_LOCKED: A super_admin already exists`).
3. If no super_admin exists:
   - Provisions Auth User with `emailVerified: true` and a temporary cryptographically random 16-character secret password.
   - Sets Custom Claims:
     ```json
     {
       "role": "super_admin",
       "mfaEnforced": true,
       "mustChangePassword": true
     }
     ```
   - Provisions minimal `users/{uid}` document in Firestore with `isMfaEnforced: true`.
   - Writes the initial entry to `/auditLogs` (`action: "ACCOUNT_CREATED"`, `actorUid: "system_bootstrap"`).
   - Generates a Firebase password reset/enrollment link printed once to stdout.

---

## 3. Disabling & Locking Down Bootstrap Access
Immediately following execution:

1. **Delete / Revoke Temporary Credentials**:
   ```bash
   rm -f path/to/serviceAccountKey.json
   ```
2. **Remove or Exclude the Script**:
   Ensure `scripts/bootstrapSuperAdmin.ts` is not deployed to production Cloud Functions or Hosting. (Configured in `.gitignore` and `firebase.json` ignore list).
3. **Verify Super Admin Claims**:
   The newly provisioned super_admin must log in, complete SMS/TOTP MFA enrollment, and update their password under the mandatory 12+ character policy.
4. **All Subsequent Accounts**:
   From this point forward, all user accounts (students, faculty, chairmen, registrar, controller, accounts, library, admins) are created exclusively through the authenticated `createUserAccount` Cloud Function.
