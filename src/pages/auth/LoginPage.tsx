import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Smartphone
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { UniversityLogo } from '../../components/common/UniversityLogo';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { UserRole } from '../../types/auth';
import { isMockMode } from '../../services/auth';
import { clearAuthLockout } from '../../services/cloudFunctions/backendEngine';
import { DevDemoAccounts } from '../../components/auth/DevDemoAccounts';

export const LoginPage: React.FC = () => {
  const { signIn, completeMfaChallenge, claims, role: currentRole, user, isMfaRequired, isMfaVerified } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  // Clear any stale lockout state on page load in mock mode
  useEffect(() => {
    if (isMockMode) {
      clearAuthLockout();
    }
  }, []);

  // MFA Challenge State
  const [isMfaStep, setIsMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState<string | null>(null);

  // Helper to redirect based on assigned role
  const redirectByRole = (targetRole?: UserRole | null) => {
    const role = targetRole || pendingRole || claims?.role || currentRole || 'student';
    switch (role) {
      case 'student':
        navigate('/student', { replace: true });
        break;
      case 'teacher':
        navigate('/teacher', { replace: true });
        break;
      case 'dept_chairman':
        navigate('/chairman', { replace: true });
        break;
      case 'registrar':
        navigate('/office/registrar', { replace: true });
        break;
      case 'exam_controller':
        navigate('/office/exam_controller', { replace: true });
        break;
      case 'account_officer':
        navigate('/office/account_officer', { replace: true });
        break;
      case 'library_officer':
        navigate('/office/library_officer', { replace: true });
        break;
      case 'admin':
      case 'super_admin':
        navigate('/admin', { replace: true });
        break;
      default:
        navigate('/', { replace: true });
    }
  };

  // Redirect if already authenticated and MFA is complete
  useEffect(() => {
    if (user && (!isMfaRequired || isMfaVerified)) {
      redirectByRole(claims?.role || currentRole);
    }
  }, [user, claims, currentRole, isMfaRequired, isMfaVerified]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await signIn(email.trim(), password);

    if (!result.success) {
      setError(result.error || 'Invalid email or password.');
      setIsLoading(false);
      return;
    }

    if (result.role) {
      setPendingRole(result.role);
    }

    if (result.requireMfa) {
      setIsMfaStep(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      redirectByRole(result.role || claims?.role);
    }
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMfaError(null);
    setIsLoading(true);

    const verified = await completeMfaChallenge(mfaCode);
    if (!verified) {
      setMfaError('Invalid 6-digit verification code. Please check your authenticator or device.');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    redirectByRole(pendingRole || claims?.role || currentRole);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 md:py-16">
      <SEOHead
        title={isBn ? 'লগইন' : 'Institutional Single Sign-On'}
        description="JSTU Smart Campus secure portal login for students, faculty, and administrative staff."
      />

      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: isBn ? 'লগইন' : 'Institutional Login' }
          ]}
        />
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <UniversityLogo size={48} />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            {isBn ? 'জেএসটিইউ স্মার্ট ক্যাম্পাস পোর্টাল' : 'JSTU Smart Campus Portal'}
          </h1>
          <p className="text-xs text-slate-500">
            {isBn
              ? 'নিরাপদ সিঙ্গেল সাইন-অন (এসএসও) ও মাল্টি-ফ্যাক্টর অথেনটিকেশন।'
              : 'Institutional Single Sign-On (SSO) with Multi-Factor Authentication.'}
          </p>
        </div>

        {/* Auth Box */}
        <Card padding="lg" className="border-[#E2E8F0] shadow-sm space-y-5 bg-white">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!isMfaStep ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Input
                label={isBn ? 'প্রাতিষ্ঠানিক ইমেইল' : 'Institutional Email'}
                type="email"
                required
                placeholder="name@jstu.ac.bd"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <div>
                <Input
                  label={isBn ? 'পাসওয়ার্ড' : 'Password'}
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                />
                <div className="flex justify-between items-center mt-1">
                  <Link
                    to="/request-account"
                    className="text-xs text-slate-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    {isBn ? 'নতুন শিক্ষার্থী? অ্যাকাউন্ট আবেদন' : 'New student? Request an account'}
                  </Link>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#1E3A8A] hover:underline font-medium"
                  >
                    {isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isBn ? 'সাইন ইন করুন' : 'Sign In'}
              </Button>

              <div className="text-center pt-2 border-t border-slate-100">
                <Link
                  to="/request-account"
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                >
                  {isBn ? 'নতুন শিক্ষার্থী? অ্যাকাউন্টের আবেদন করুন' : 'New student? Request an account'}
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleMfaVerify} className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Smartphone className="w-4 h-4 text-amber-600" />
                  <span>Mandatory Staff Multi-Factor Authentication</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Enter the 6-digit TOTP / SMS code sent to your verified staff device.
                </p>
              </div>

              {mfaError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  {mfaError}
                </div>
              )}

              <Input
                label="6-Digit Verification Code"
                type="text"
                maxLength={6}
                required
                placeholder="123456"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                leftIcon={<KeyRound className="w-4 h-4" />}
                className="text-center font-mono tracking-widest text-lg"
              />

              <div className="flex justify-between items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMfaStep(false)}
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isLoading}
                  leftIcon={<ShieldCheck className="w-4 h-4 text-amber-300" />}
                >
                  {isBn ? 'যাচাই করুন' : 'Verify & Proceed'}
                </Button>
              </div>
            </form>
          )}

          <div className="pt-2 border-t border-[#E2E8F0] text-center text-xs text-slate-500">
            <p>
              Session timeout: 30 minutes of inactivity &bull; Prototype / Demo mode
            </p>
          </div>
        </Card>

        {/* Demo accounts panel: Shown in demo mode (mock services), never when real Firebase is connected */}
        {isMockMode && (
          <DevDemoAccounts
            currentEmail={email}
            onSelect={(selectedEmail, selectedPass) => {
              setEmail(selectedEmail);
              setPassword(selectedPass);
              setError(null);
            }}
          />
        )}
      </div>
    </div>
  );
};
