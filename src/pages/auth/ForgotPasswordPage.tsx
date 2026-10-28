import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { UniversityLogo } from '../../components/common/UniversityLogo';
import { useLanguage } from '../../contexts/LanguageContext';

export const ForgotPasswordPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      // In production Firebase, sendPasswordResetEmail is called or handled via Cloud Function
      // Simulated timeout with generic anti-enumeration response
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <SEOHead
        title={isBn ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Reset Password'}
        description="Reset your JSTU institutional portal credentials."
      />

      <div className="text-center space-y-2">
        <UniversityLogo size={48} className="mx-auto" />
        <h1 className="text-2xl font-bold text-[#0F172A]">
          {isBn ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Password Recovery'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBn
            ? 'আপনার প্রাতিষ্ঠানিক ইমেইল আইডি প্রবেশ করান।'
            : 'Enter your institutional email address to request password assistance.'}
        </p>
      </div>

      <Card padding="lg" className="space-y-4 border-[#E2E8F0] shadow-xs bg-white">
        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-800">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? 'অনুরোধ নিবন্ধিত হয়েছে' : 'Request Registered'}</span>
            </div>
            {/* Anti-User Enumeration Generic Notice */}
            <p className="leading-relaxed">
              {isBn
                ? 'যদি এই ইমেইলটি জেএসটিইউ সিস্টেমে নিবন্ধিত থাকে, তবে একটি সুরক্ষিত পাসওয়ার্ড রিসেট নির্দেশিকা পাঠানো হয়েছে।'
                : 'If an active account is associated with this institutional email, password reset instructions have been dispatched.'}
            </p>
            <div className="pt-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="w-full">
                  {isBn ? 'লগইন পৃষ্ঠায় ফিরে যান' : 'Back to Login'}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={isBn ? 'প্রাতিষ্ঠানিক ইমেইল' : 'Institutional Email'}
              type="email"
              required
              placeholder="e.g. user@jstu.ac.bd"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
            >
              {isBn ? 'রিসেট লিংক পাঠান' : 'Dispatch Reset Link'}
            </Button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs text-[#1E3A8A] hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isBn ? 'লগইন পাতায় ফিরে যান' : 'Return to Login'}</span>
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
