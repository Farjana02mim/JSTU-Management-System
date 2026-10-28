import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, FileCheck2, Cookie, CheckCircle2, ArrowLeft, Eye } from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { useLanguage } from '../../contexts/LanguageContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-10 bg-white">
      <SEOHead
        title={isBn ? 'গোপনীয়তা ও কুকি নীতিমালা' : 'Privacy & Cookie Notice'}
        description="Official Institutional Privacy Policy and Cookie Notice for Jamalpur Science & Technology University (JSTU) Smart Campus portal."
      />

      <Breadcrumb
        items={[
          { label: isBn ? 'মূলপাতা' : 'Home', to: '/' },
          { label: isBn ? 'গোপনীয়তা ও কুকি নীতি' : 'Privacy & Cookie Notice' }
        ]}
      />

      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1E3A8A] transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBn ? 'মূলপাতায় ফিরে যান' : 'Back to Home'}</span>
        </Link>

        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#1E3A8A] border border-blue-200">
            <Shield className="w-3.5 h-3.5" />
            <span>{isBn ? 'প্রাতিষ্ঠানিক ডেটা সুরক্ষা নীতি' : 'Institutional Data Governance'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            {isBn ? 'গোপনীয়তা ও কুকি ব্যবস্থাপনা নীতিমালা' : 'Privacy & Cookie Governance Notice'}
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            {isBn ? 'কার্যকর তারিখ: ১ অক্টোবর ২০২৬ | সংস্করণ: ২.১' : 'Effective Date: October 1, 2026 | Version 2.1 (Compliant)'}
          </p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-8">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#1E3A8A]" />
            <span>1. Institutional Commitment to Privacy</span>
          </h2>
          <p>
            Jamalpur Science & Technology University (JSTU) values the intellectual privacy, personal security, and scholarly records of all enrolled students, researchers, faculty members, and campus visitors. This notice clarifies how our digital infrastructure collects, protects, and governs confidential student records, marks submissions, and online applications.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#1E3A8A]" />
            <span>2. Categories of Information Processed</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>
              <strong>Academic & Identification Credentials:</strong> Enrolled student ID numbers, national identification/birth registration references, institutional email addresses, and semester marks rosters.
            </li>
            <li>
              <strong>Digital Signature & Verification Data:</strong> Cryptographically hashed clearances, examination tabulations, and official transcript QR verification ledgers.
            </li>
            <li>
              <strong>Service Bookings & Hall Applications:</strong> Residential hall seat allocations, medical clinic appointments, and library reservations.
            </li>
          </ul>
        </section>

        {/* Section 3: Cookies */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <Cookie className="w-5 h-5 text-amber-600" />
            <span>3. Cookie Utilization & Local Storage Policy</span>
          </h2>
          <p>
            The JSTU Smart Campus website utilizes minimal, essential cookies and browser local storage strictly for operational reliability, secure session authentication, and language preference retention:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Card padding="md" className="space-y-2 border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
                Essential Session Cookies
              </span>
              <p className="text-xs text-slate-600">
                Maintains authenticated single sign-on (SSO) tokens, CSRF protection, and role-based permissions (Student, Teacher, Chairman, Controller, Admin). Cannot be disabled.
              </p>
            </Card>

            <Card padding="md" className="space-y-2 border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                User Preferences (LocalStorage)
              </span>
              <p className="text-xs text-slate-600">
                Retains language selection (English / Bangla), high-contrast accessibility toggles, and cookie consent state without tracking across third-party websites.
              </p>
            </Card>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#1E3A8A]" />
            <span>4. Third-Party Disclosures & Commercial Data</span>
          </h2>
          <p>
            JSTU does <strong>never sell, lease, or monetize</strong> student, faculty, or visitor information. Data is never shared with third-party advertising networks. Information is disclosed strictly under legal mandate to the University Grants Commission (UGC) of Bangladesh or statutory law enforcement bodies following official due process.
          </p>
        </section>

        {/* Section 5 */}
        <section className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <h3 className="text-base font-bold text-[#0F172A]">
            Data Protection Officer & Inquiries
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            For inquiries regarding student records, data erasure, or verification ledger corrections, contact the Office of the Registrar and University ICT Center:
          </p>
          <div className="text-xs text-slate-700 space-y-1 font-mono">
            <p>Email: <a href="mailto:privacy@jstu.ac.bd" className="text-[#1E3A8A] underline">privacy@jstu.ac.bd</a> / <a href="mailto:registrar@jstu.ac.bd" className="text-[#1E3A8A] underline">registrar@jstu.ac.bd</a></p>
            <p>Hotline: +880 29977 12345 (Ext. 104)</p>
            <p>Administrative Complex, Level 2, Jamalpur-2012, Bangladesh</p>
          </div>
        </section>
      </div>
    </div>
  );
};
