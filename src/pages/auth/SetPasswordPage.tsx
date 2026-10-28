import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight, UserCheck, KeyRound } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { UniversityLogo } from '../../components/common/UniversityLogo';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { AccountRequestService } from '../../services/accountRequests';
import { ActivationToken } from '../../services/shared/sharedDataStore';

const BLOCKED_PASSWORDS = [
  'password12345',
  '123456789012',
  'adminadmin123',
  'jstupassword1',
  'qwertyuiopas',
  'bangladesh2026',
  'welcome123456'
];

export const SetPasswordPage: React.FC = () => {
  const { user, updateUserPassword, claims } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get('token');

  // Token activation mode vs Authenticated password change mode
  const isTokenMode = !!tokenParam;

  const [tokenInfo, setTokenInfo] = useState<ActivationToken | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isVerifyingToken, setIsVerifyingToken] = useState<boolean>(isTokenMode);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate token on mount if in token mode
  useEffect(() => {
    if (isTokenMode && tokenParam) {
      setIsVerifyingToken(true);
      const validation = AccountRequestService.validateActivationToken(tokenParam);
      if (validation.valid && validation.tokenInfo) {
        setTokenInfo(validation.tokenInfo);
        setTokenError(null);
      } else {
        setTokenInfo(null);
        // Generic error message requirement
        setTokenError(
          isBn
            ? 'পাসওয়ার্ড নির্ধারণের লিংকটি অবৈধ বা মেয়াদোত্তীর্ণ। অনুগ্রহ করে রেজিস্ট্রারের সাথে যোগাযোগ করুন বা নতুন অ্যাকাউন্টের অনুরোধ করুন।'
            : 'Invalid, expired, or already used activation link. Please contact the registrar or request a new account.'
        );
      }
      setIsVerifyingToken(false);
    } else if (!user) {
      // Not logged in and no token provided
      setTokenError(
        isBn
          ? 'পাসওয়ার্ড নির্ধারণের লিংকটি অবৈধ বা মেয়াদোত্তীর্ণ। অনুগ্রহ করে রেজিস্ট্রারের সাথে যোগাযোগ করুন বা নতুন অ্যাকাউন্টের অনুরোধ করুন।'
          : 'Invalid, expired, or already used activation link. Please contact the registrar or request a new account.'
      );
    }
  }, [isTokenMode, tokenParam, user, isBn]);

  // Strong password checks
  const isLengthValid = newPassword.length >= 12;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isNotCommon = !BLOCKED_PASSWORDS.includes(newPassword.toLowerCase());
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isFormValid =
    isLengthValid &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSpecial &&
    isNotCommon &&
    passwordsMatch &&
    (isTokenMode ? true : currentPassword.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError(isBn ? 'পাসওয়ার্ড দুটি মেলেনি।' : 'Passwords do not match.');
      return;
    }

    if (!isNotCommon) {
      setError(
        isBn
          ? 'এই পাসওয়ার্ডটি অত্যন্ত সাধারণ। অনুগ্রহ করে একটি ভিন্ন ও জটিল পাসওয়ার্ড নির্বাচন করুন।'
          : 'This password is too common and easily guessed. Please choose a more unique phrase.'
      );
      return;
    }

    if (!isLengthValid || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setError(
        isBn
          ? 'দয়া করে সকল পাসওয়ার্ড জটিলতা নীতি পূরণ করুন (১২+ অক্ষর, বড় ও ছোট হাতের অক্ষর, সংখ্যা ও প্রতীক)।'
          : 'Please satisfy all password complexity rules (12+ chars, mixed case, numbers & symbols).'
      );
      return;
    }

    setIsLoading(true);

    if (isTokenMode && tokenParam) {
      // Flow 1: Token-based set-password activation step
      try {
        const result = await AccountRequestService.setPasswordWithToken(tokenParam, newPassword);
        setIsLoading(false);
        if (result.success) {
          setSuccess(true);
          // Requirement: redirect to /login on success
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 1500);
        } else {
          setError(result.message || 'Failed to set password.');
        }
      } catch (err) {
        setIsLoading(false);
        setError(err instanceof Error ? err.message : 'Failed to set password.');
      }
    } else {
      // Flow 2: Authenticated user mustChangePassword flow
      const result = await updateUserPassword(currentPassword, newPassword);

      if (!result.success) {
        setError(result.error || 'Failed to update password.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setSuccess(true);

      setTimeout(() => {
        if (claims?.role === 'student') navigate('/student', { replace: true });
        else if (claims?.role === 'teacher') navigate('/teacher', { replace: true });
        else if (claims?.role === 'dept_chairman') navigate('/chairman', { replace: true });
        else if (claims?.role === 'admin' || claims?.role === 'super_admin') navigate('/admin', { replace: true });
        else if (claims?.role) navigate(`/office/${claims.role}`, { replace: true });
        else navigate('/', { replace: true });
      }, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <SEOHead
        title={isBn ? 'পাসওয়ার্ড নির্ধারণ ও নীতি' : 'Institutional Password Setup'}
        description="Set your institutional portal password adhering to JSTU security policies."
      />

      <div className="text-center space-y-2">
        <UniversityLogo size={48} className="mx-auto" />
        <h1 className="text-2xl font-bold text-[#0F172A]">
          {isBn ? 'পাসওয়ার্ড নির্ধারণ' : 'Institutional Password Setup'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBn
            ? 'প্রথমবার অ্যাকাউন্টে ১২+ ক্যারেক্টার বিশিষ্ট শক্তিশালী প্রাতিষ্ঠানিক পাসওয়ার্ড নির্ধারণ বাধ্যতামূলক।'
            : 'JSTU security rules mandate setting a strong password (12+ chars) on initial account activation.'}
        </p>
      </div>

      <Card padding="lg" className="space-y-4 border-[#E2E8F0] shadow-xs bg-white">
        {/* Token Verification Loading */}
        {isVerifyingToken && (
          <div className="py-8 text-center space-y-2">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">
              {isBn ? 'অ্যাক্টিভেশন টোকেন যাচাই করা হচ্ছে...' : 'Verifying activation link...'}
            </p>
          </div>
        )}

        {/* Invalid or Expired Token Error State */}
        {!isVerifyingToken && tokenError && (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2 text-center">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
              <h3 className="font-bold text-sm text-red-900">
                {isBn ? 'লিংকটি কার্যকর নয়' : 'Invalid Activation Link'}
              </h3>
              <p className="text-xs text-red-700 leading-relaxed">
                {tokenError}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link to="/login" className="block">
                <Button variant="primary" size="md" className="w-full">
                  {isBn ? 'লগইন পাতায় ফিরে যান' : 'Back to Login'}
                </Button>
              </Link>
              <Link to="/request-account" className="block">
                <Button variant="outline" size="md" className="w-full">
                  {isBn ? 'অ্যাকাউন্ট আবেদন করুন' : 'Request Student Account'}
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Success State */}
        {!isVerifyingToken && !tokenError && success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-center text-xs text-emerald-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm">
              {isBn ? 'পাসওয়ার্ড সফলভাবে নির্ধারিত হয়েছে!' : 'Password Set Successfully!'}
            </h3>
            <p>
              {isTokenMode
                ? (isBn ? 'আপনাকে লগইন পেজে নিয়ে যাওয়া হচ্ছে...' : 'Redirecting you to the login page...')
                : (isBn ? 'আপনাকে স্বয়ংক্রিয়ভাবে ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...' : 'Redirecting you to your authorized dashboard...')}
            </p>
          </div>
        )}

        {/* Active Set Password Form */}
        {!isVerifyingToken && !tokenError && !success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Token Info Banner */}
            {isTokenMode && tokenInfo && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-blue-950">
                  <KeyRound className="w-3.5 h-3.5 text-blue-700" />
                  <span>{isBn ? 'অ্যাকাউন্ট ভেরিফিকেশন সম্পন্ন' : 'Account Activation'}</span>
                </div>
                <div className="text-[11px] text-blue-800 space-y-0.5 font-mono">
                  <div>Ref: {tokenInfo.referenceNumber}</div>
                  <div>Email: {tokenInfo.email}</div>
                </div>
              </div>
            )}

            {/* Current password (only if authenticated flow without token) */}
            {!isTokenMode && (
              <Input
                label={isBn ? 'বর্তমান পাসওয়ার্ড' : 'Current Temporary Password'}
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />
            )}

            <Input
              label={isBn ? 'নতুন পাসওয়ার্ড (কমপক্ষে ১২ অক্ষর)' : 'New Strong Password (Min 12 chars)'}
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              placeholder="••••••••••••"
            />

            <Input
              label={isBn ? 'নতুন পাসওয়ার্ড পুনরায় লিখুন' : 'Confirm New Password'}
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              placeholder="••••••••••••"
            />

            {/* Password Policy Checklist */}
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[11px] space-y-1 text-slate-600">
              <span className="font-semibold block text-[#0F172A]">
                {isBn ? 'প্রাতিষ্ঠানিক পাসওয়ার্ড নীতি (১২+ অক্ষর):' : 'Institutional Password Policy (12+ Chars):'}
              </span>
              <div className="grid grid-cols-2 gap-1 pt-1">
                <span className={isLengthValid ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                  • 12+ Characters
                </span>
                <span className={hasUpper && hasLower ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                  • Uppercase & Lowercase
                </span>
                <span className={hasNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                  • At least 1 number
                </span>
                <span className={hasSpecial ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                  • At least 1 symbol
                </span>
              </div>
              {newPassword.length > 0 && !isNotCommon && (
                <div className="text-red-600 font-medium pt-1">
                  ⚠ {isBn ? 'সাধারণ পাসওয়ার্ড গ্রহণযোগ্য নয়' : 'Common password patterns blocked'}
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              disabled={!isFormValid}
              className="w-full"
            >
              {isBn ? 'পাসওয়ার্ড নিশ্চিত ও সংরক্ষণ করুন' : 'Confirm & Save Password'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
