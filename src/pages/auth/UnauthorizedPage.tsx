import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export const UnauthorizedPage: React.FC = () => {
  const { role, user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const location = useLocation();

  const attemptedPath = (location.state as any)?.attemptedPath || 'restricted area';

  const getHomeRoute = () => {
    switch (role) {
      case 'student':
        return '/student';
      case 'teacher':
        return '/teacher';
      case 'dept_chairman':
        return '/chairman';
      case 'registrar':
      case 'exam_controller':
      case 'account_officer':
      case 'library_officer':
        return `/office/${role}`;
      case 'admin':
      case 'super_admin':
        return '/admin';
      default:
        return '/';
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <SEOHead
        title={isBn ? 'অননুমোদিত প্রবেশাধিকার (৪০৩)' : '403 - Access Forbidden'}
        description="Access restricted by JSTU Role-Based Access Control."
      />

      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold">
          HTTP 403 &bull; PERMISSION DENIED
        </span>
        <h1 className="text-2xl font-bold text-[#0F172A]">
          {isBn ? 'প্রবেশাধিকার সংরক্ষিত' : 'Restricted Administrative Area'}
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
          Your active institutional role (<strong className="uppercase font-mono text-slate-700">{role || 'GUEST'}</strong>) does not have authorization to view <code className="bg-[#F1F5F9] border border-[#E2E8F0] px-1 py-0.5 rounded text-[11px]">{attemptedPath}</code>.
        </p>
      </div>

      <Card padding="md" className="text-left text-xs bg-[#F8FAFC] border-[#E2E8F0] space-y-2">
        <p className="font-semibold text-[#0F172A]">
          Security Architecture Guarantee:
        </p>
        <p className="text-slate-600 leading-relaxed">
          Access control at JSTU is verified server-side via Firebase Custom Claims and Firestore Security Rules. Unauthorized client routes cannot read or mutate backend university records.
        </p>
      </Card>

      <div className="flex justify-center gap-3 pt-2">
        <Link to={getHomeRoute()}>
          <Button variant="primary" size="sm" leftIcon={<Home className="w-4 h-4" />}>
            {isBn ? 'আমার ড্যাশবোর্ডে ফিরে যান' : 'Go to My Dashboard'}
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" size="sm">
            {isBn ? 'মূলপাতা' : 'Public Home'}
          </Button>
        </Link>
      </div>
    </div>
  );
};
