import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { ConvocationRegistration } from '../../types/convocation';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  GraduationCap,
  Award,
  MapPin,
  Clock
} from 'lucide-react';

export const VerifyConvocationPage: React.FC = () => {
  const { token: urlToken } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [inputToken, setInputToken] = useState(urlToken || '');
  const [queriedReg, setQueriedReg] = useState<ConvocationRegistration | null | undefined>(undefined);
  const [verificationTime, setVerificationTime] = useState<string>('');

  const storeManager = SharedDataStoreManager.getInstance();

  useEffect(() => {
    if (urlToken) {
      const trimmed = urlToken.trim();
      setInputToken(trimmed);
      const found = storeManager.getConvocationRegistrationByToken(trimmed);
      setQueriedReg(found || null);
      setVerificationTime(new Date().toLocaleString());
    } else {
      setQueriedReg(undefined);
    }
  }, [urlToken]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputToken.trim()) return;
    navigate(`/verify-convocation/${encodeURIComponent(inputToken.trim())}`);
  };

  // Mask name for privacy: "Tanvir Ahmed" -> "T****r A***d"
  const maskGraduateName = (name: string): string => {
    return name
      .split(' ')
      .map((part) => {
        if (part.length <= 2) return part;
        return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
      })
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/convocation"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? 'সমাবর্তন পোর্টালে ফিরুন' : 'Back to Convocation Portal'}</span>
          </Link>
          <span className="text-[10px] font-mono text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded">
            QR VERIFICATION
          </span>
        </div>

        {/* Verification Card */}
        <Card padding="lg" className="bg-white border-slate-200 shadow-sm space-y-5">
          <div className="text-center space-y-2 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#0A2540] text-white flex items-center justify-center font-extrabold text-xl shadow-xs">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold block">
                JAMALPUR SCIENCE & TECHNOLOGY UNIVERSITY
              </span>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {isBn ? 'সমাবর্তন প্রবেশপত্র যাচাই' : 'Convocation Pass QR Verification'}
              </h1>
              <p className="text-xs text-slate-500">
                Official digital token verification registry for JSTU 2nd Convocation 2026
              </p>
            </div>
          </div>

          {/* Search Box if no token or querying another */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. CNV-2026-SECURE-990141"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="flex-1 p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Button variant="primary" size="sm" type="submit" className="bg-blue-600 hover:bg-blue-500">
              Verify
            </Button>
          </form>

          {/* Result view */}
          {queriedReg === undefined ? (
            <p className="text-xs text-slate-600 text-center py-4">
              Enter or scan a valid convocation pass token to verify its authenticity.
            </p>
          ) : queriedReg === null ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center space-y-2">
              <ShieldAlert className="w-8 h-8 text-red-600 mx-auto" />
              <div className="font-bold text-red-900 text-sm">Pass Not Recognized</div>
              <p className="text-xs text-red-700">
                The token &ldquo;{urlToken}&rdquo; does not match any registered convocation pass in the official records.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Validation Badge */}
              <div
                className={`p-4 rounded-2xl border text-center space-y-1 ${
                  queriedReg.approvalStatus === 'APPROVED' && queriedReg.paymentStatus === 'PAID'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="inline-flex items-center gap-1.5 font-bold text-sm">
                  {queriedReg.approvalStatus === 'APPROVED' && queriedReg.paymentStatus === 'PAID' ? (
                    <>
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>VALID OFFICIAL ENTRY PASS</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5 text-amber-600" />
                      <span>PASS PENDING PAYMENT / APPROVAL</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] opacity-80">
                  Verified against Registrar Office Ledger at {verificationTime}
                </p>
              </div>

              {/* Graduate Record */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Graduate Name:</span>
                  <span className="font-bold text-slate-900">{maskGraduateName(queriedReg.graduateName)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Degree Conferred:</span>
                  <span className="font-semibold text-slate-800">{queriedReg.degree}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-800">{queriedReg.department}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Assigned Arena Seat:</span>
                  <span className="font-bold text-blue-700">{queriedReg.assignedSeat || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Gown Kit Status:</span>
                  <span className="font-mono text-emerald-700 font-bold">
                    {queriedReg.assignedGownKitId || 'Kit Assigned'} (Size: {queriedReg.gownSize})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Accompanying Guests:</span>
                  <span className="font-semibold text-slate-800">{queriedReg.guestCount} Guest Pass(es)</span>
                </div>
              </div>

              <div className="text-[10px] text-center text-slate-600 font-mono">
                Security Token: {queriedReg.passToken} &bull; Registration: {queriedReg.registrationNumber}
              </div>
            </div>
          )}
        </Card>

        {/* Footer Notice */}
        <div className="text-center text-[11px] text-slate-600">
          Jamalpur Science & Technology University &bull; Office of the Registrar
        </div>
      </div>
    </div>
  );
};
