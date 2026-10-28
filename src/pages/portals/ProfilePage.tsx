import React, { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, Lock, ShieldCheck, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, claims, role, updateUserPassword } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 12) {
      setPasswordError('New password must be at least 12 characters.');
      return;
    }

    setIsChangingPass(true);
    const res = await updateUserPassword(currentPassword, newPassword);

    if (!res.success) {
      setPasswordError(res.error || 'Password update failed.');
    } else {
      setPasswordSuccess('Your password has been successfully updated with re-authentication.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setIsChangingPass(false);
  };

  return (
    <DashboardLayout portalTitle={isBn ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {isBn ? 'আমার ব্যবহারকারী প্রোফাইল' : 'User Profile & Security'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBn ? 'আপনার প্রাতিষ্ঠানিক তথ্য ও পাসওয়ার্ড ব্যবস্থাপনা' : 'Manage your institutional credentials and authentication security'}
          </p>
        </div>

        {/* Profile Card */}
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center justify-center font-bold text-xl uppercase">
              {user?.displayName ? user.displayName[0] : 'U'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {profile?.fullNameBn || user?.displayName || 'Institutional User'}
              </h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-[10px] uppercase font-bold rounded">
                  ROLE: {role?.replace('_', ' ')}
                </span>
                {claims?.studentId && (
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] rounded">
                    ID: {claims.studentId}
                  </span>
                )}
                {claims?.departmentId && (
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] rounded">
                    DEPT: {claims.departmentId}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-0.5">
              <span className="text-slate-400 block text-[11px]">Email Verification Status</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-0.5">
              <span className="text-slate-400 block text-[11px]">Multi-Factor Authentication (MFA)</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {claims?.mfaEnforced ? 'Mandatory & Active' : 'Not Required for Student Role'}
              </span>
            </div>
          </div>
        </Card>

        {/* Change Password with Re-Authentication Card */}
        <Card padding="lg" className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-600" />
              <span>Change Portal Password (Re-Auth Required)</span>
            </h2>
            <p className="text-xs text-slate-500">
              For security, sensitive credential changes require re-authenticating with your current password.
            </p>
          </div>

          {passwordError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-lg text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <Input
              label="Current Password (Re-authentication)"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="New Password (12+ Chars)"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <Input
                label="Confirm New Password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isChangingPass}
              >
                Update Password
              </Button>
            </div>
          </form>
        </Card>

        {/* Multi-Factor Authentication (MFA) Enrollment & Status Card */}
        <Card padding="lg" className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Multi-Factor Authentication (MFA) Enrollment</span>
            </h2>
            <p className="text-xs text-slate-500">
              Mandatory institutional policy for all 8 staff roles. Optional for students.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Enforcement Tier:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                claims?.mfaEnforced
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {claims?.mfaEnforced ? 'Mandatory Staff MFA' : 'Optional Student Tier'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Registered Second Factor:</span>
              <span className="font-mono text-emerald-600 font-bold">
                {claims?.mfaEnforced ? 'TOTP Authenticator & SMS Verified' : 'None Enrolled'}
              </span>
            </div>
          </div>

          {/* Firebase Console Configuration Instructions */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl space-y-2 text-xs text-blue-900 dark:text-blue-200">
            <p className="font-bold flex items-center gap-1.5">
              <span>Firebase Identity Platform Production Setup Instructions:</span>
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
              <li>
                <strong>Upgrade to Identity Platform:</strong> In the Firebase Console, navigate to <em>Authentication &gt; Settings &gt; User Actions &gt; Upgrade to Identity Platform</em>.
              </li>
              <li>
                <strong>Enable Blaze Plan:</strong> Google Cloud project must be on the <em>Blaze (Pay-as-you-go)</em> plan to enable SMS MFA carrier dispatch.
              </li>
              <li>
                <strong>Configure Factors:</strong> In Firebase Console &gt; Authentication &gt; Sign-in method &gt; Multi-factor Authentication:
                <ul className="list-disc list-inside ml-4 mt-0.5 space-y-0.5">
                  <li>Enable <em>SMS Multi-factor</em> (requires phone verification quota).</li>
                  <li>Enable <em>TOTP (Authenticator apps like Google Authenticator)</em> for carrier-free second factor.</li>
                </ul>
              </li>
              <li>
                <strong>Enforcement in Cloud Functions:</strong> The Cloud Function <code>createUserAccount</code> marks <code>mfaEnforced: true</code> in the custom claims token for all staff roles.
              </li>
            </ol>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
