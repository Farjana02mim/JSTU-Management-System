import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  FileCheck,
  RefreshCw,
  Clock,
  Eye,
  FileText,
  Upload,
  AlertCircle
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { useLanguage } from '../../contexts/LanguageContext';
import { getDigitalDocumentService, PublicVerificationResult } from '../../services/documents';

export const VerifyDocumentPage: React.FC = () => {
  const { documentId, id } = useParams<{ documentId?: string; id?: string }>();
  const activeToken = documentId || id || '';
  const navigate = useNavigate();

  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [inputToken, setInputToken] = useState(activeToken);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PublicVerificationResult | null>(null);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

  // Tamper Check Tool State
  const [tamperMode, setTamperMode] = useState(false);
  const [tamperInputHash, setTamperInputHash] = useState('');
  const [tamperCheckResult, setTamperCheckResult] = useState<{
    tested: boolean;
    isMatch: boolean;
    computedHash: string;
    registryHash: string;
  } | null>(null);

  const docService = getDigitalDocumentService();

  const executeVerification = async (token: string) => {
    const clean = token.trim();
    if (!clean) return;

    setLoading(true);
    setRateLimitExceeded(false);
    setRateLimitMessage(null);
    setTamperCheckResult(null);

    try {
      // Simulate real-world network latency (300ms)
      await new Promise((r) => setTimeout(r, 250));

      const res = await docService.verifyDocument(clean, 'public-web-client');
      if (res.message && res.message.includes('Rate limit exceeded')) {
        setRateLimitExceeded(true);
        setRateLimitMessage(res.message);
        setResult(null);
      } else {
        setResult(res);
      }
    } catch (err: unknown) {
      setResult({
        status: 'NOT_FOUND',
        message: 'No institutional academic credential found matching the provided verification identifier.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeToken) {
      setInputToken(activeToken);
      executeVerification(activeToken);
    } else {
      setResult(null);
    }
  }, [activeToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputToken.trim()) {
      navigate(`/verify/${inputToken.trim()}`);
    }
  };

  const handleTamperTest = async () => {
    if (!result || !result.verificationId) return;
    const doc = await docService.getDocument(result.verificationId);
    if (!doc) return;

    const candidate = tamperInputHash.trim();
    const isMatch = candidate.toLowerCase() === doc.canonicalHash.toLowerCase();

    setTamperCheckResult({
      tested: true,
      isMatch,
      computedHash: candidate,
      registryHash: doc.canonicalHash
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 bg-white min-h-[80vh]">
      <SEOHead
        title={isBn ? 'ডিজিটাল সনদ ও কিউআর যাচাইকরণ' : 'Official Academic Document Verification'}
        description="Public cryptographic credential verification portal of Jamalpur Science & Technology University."
      />

      <Breadcrumb
        items={[
          { label: isBn ? 'সনদ ও ফলাফল যাচাই' : 'Document Verification' }
        ]}
      />

      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-[#1E3A8A]">
          <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
          <span>{isBn ? 'জেএসটিইউ কেন্দ্রীয় ডিজিটাল রেজিস্ট্রি' : 'JSTU Central Integrity Registry'}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          {isBn ? 'একাডেমিক সনদ ও ফলাফল যাচাইকরণ' : 'Public Academic Document Verification'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isBn
            ? 'জেএসটিইউ কর্তৃক ইস্যুকৃত ট্রান্সক্রিপ্ট, সনদপত্র বা প্রশংসাপত্রের কিউআর কোড স্ক্যান করুন অথবা ৩২-অক্ষরের ভেরিফিকেশন আইডি নিচে প্রবেশ করান।'
            : 'Verify the authenticity of official transcripts, degree certificates, and conduct testimonials issued by Jamalpur Science & Technology University.'}
        </p>
      </div>

      {/* Search Input Box */}
      <Card padding="md" className="max-w-2xl mx-auto bg-slate-50 border-[#E2E8F0] shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            {isBn ? 'ভেরিফিকেশন টোকেন / আইডি:' : 'Enter 128-Bit Verification Token:'}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="e.g. 7f9c2d1b8e4a3f65021c9b8a7d6e5f41"
                className="w-full pl-9 pr-3 py-2.5 text-xs font-mono border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            >
              {isBn ? 'যাচাই করুন' : 'Verify Document'}
            </Button>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>
              {isBn
                ? 'অননুমোদিত স্ক্যান রোধে প্রতি মিনিটে সর্বোচ্চ ১০টি অনুসন্ধান অনুমোদিত।'
                : 'Protected by automated rate limiting (maximum 10 verification queries per minute).'}
            </span>
          </p>
        </form>
      </Card>

      {/* Rate Limit Alert */}
      {rateLimitExceeded && (
        <Card padding="md" className="max-w-2xl mx-auto border-amber-300 bg-amber-50 text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs text-amber-800">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{isBn ? 'অনুসন্ধান সীমা অতিক্রান্ত' : 'Rate Limit Exceeded'}</span>
          </div>
          <p className="text-xs text-amber-700">{rateLimitMessage}</p>
        </Card>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="max-w-2xl mx-auto space-y-4">
          <SkeletonLoader variant="rectangular" className="h-40 rounded-2xl w-full" />
          <SkeletonLoader variant="rectangular" className="h-48 rounded-2xl w-full" />
        </div>
      )}

      {/* Result Display */}
      {!loading && result && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Status Header Banner */}
          {result.status === 'VALID' && (
            <Card padding="lg" className="border-emerald-200 bg-emerald-50/70 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                      OFFICIALLY VALID & AUTHENTIC
                    </span>
                    <h2 className="text-lg font-bold text-emerald-950 mt-1">
                      {isBn ? 'সনদপত্রটি বিশ্ববিদ্যালয়ের কেন্দ্রীয় সনদে নিবন্ধিত' : 'Authentic JSTU Credential Confirmed'}
                    </h2>
                  </div>
                </div>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {isBn
                  ? 'এই নথিটি জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের কেন্দ্রীয় আর্কাইভে নিবন্ধিত এবং বৈধ।'
                  : 'This academic document matches an active record in the institutional cryptographic registry. All university signatures and endorsements are authentic.'}
              </p>
            </Card>
          )}

          {result.status === 'REVOKED' && (
            <Card padding="lg" className="border-rose-300 bg-rose-50/80 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white">
                      OFFICIALLY REVOKED
                    </span>
                    <h2 className="text-lg font-bold text-rose-950 mt-1">
                      {isBn ? 'সনদপত্রটি আনুষ্ঠানিকভাবে বাতিলকৃত' : 'Document Revocation Notice'}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-white/70 border border-rose-200 rounded-xl space-y-1 text-xs text-rose-900">
                <p className="font-bold">
                  {isBn ? 'বাতিলের কারণ:' : 'Revocation Reason:'} <span className="font-normal text-rose-800">{result.revocationReason || 'Administrative cancellation.'}</span>
                </p>
                {result.revokedAt && (
                  <p className="text-[11px] text-rose-700">
                    {isBn ? 'বাতিলের তারিখ:' : 'Revoked on:'} {new Date(result.revokedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
            </Card>
          )}

          {result.status === 'NOT_FOUND' && (
            <Card padding="lg" className="border-slate-300 bg-slate-50 text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {isBn ? 'কোনো রেকর্ড পাওয়া যায়নি' : 'Document Not Found in Registry'}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {result.message || 'No institutional academic credential found matching the provided verification identifier.'}
              </p>
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 font-mono">
                  Token: {inputToken.slice(0, 16)}...
                </span>
              </div>
            </Card>
          )}

          {/* Minimal Data Verified Table (ONLY if VALID or REVOKED) */}
          {(result.status === 'VALID' || result.status === 'REVOKED') && (
            <Card padding="md" className="bg-white border-[#E2E8F0] shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    {isBn ? 'যাচাইকৃত নথির তথ্যাবলী' : 'Verified Document Metadata'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isBn ? 'পাবলিক ভেরিফিকেশন মানদণ্ড অনুযায়ী প্রদর্শিত।' : 'Published according to public privacy disclosure standards.'}
                  </p>
                </div>
                <Badge variant={result.status === 'VALID' ? 'success' : 'danger'}>
                  {result.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isBn ? 'নথির ধরন' : 'Document Type'}
                  </span>
                  <span className="font-semibold text-slate-900 block">
                    {isBn ? result.documentTitleBn || result.documentTitle : result.documentTitle}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isBn ? 'শিক্ষার্থীর নাম (গোপনীয়তা রক্ষিত)' : 'Student Name (Masked for Privacy)'}
                  </span>
                  <span className="font-mono font-bold text-slate-900 block">
                    {result.maskedStudentName}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isBn ? 'বিভাগ' : 'Department'}
                  </span>
                  <span className="font-medium text-slate-800 block">
                    Department of {result.department}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isBn ? 'ডিগ্রি প্রোগ্রাম' : 'Academic Program'}
                  </span>
                  <span className="font-medium text-slate-800 block">
                    {result.program}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isBn ? 'ইস্যুর তারিখ' : 'Date of Official Issue'}
                  </span>
                  <span className="font-medium text-slate-800 block">
                    {result.issueDate
                      ? new Date(result.issueDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })
                      : '—'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isBn ? 'ক্রিপ্টোগ্রাফিক ডাইজেস্ট' : 'SHA-256 Digest'}
                  </span>
                  <span className="font-mono text-[11px] text-slate-600 block">
                    {result.canonicalHashShort || '—'}
                  </span>
                </div>
              </div>

              {/* Strict Privacy Guarantee Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-600">
                <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-700 block">
                    {isBn ? 'শিক্ষার্থী তথ্য সুরক্ষা নিশ্চয়তা:' : 'Privacy & Security Guarantee:'}
                  </span>
                  <span>
                    {isBn
                      ? 'জেএসটিইউ অর্ডিন্যান্স অনুযায়ী পাবলিক ভেরিফিকেশন পেজে সিজিপিএ, মার্কস, রোল নম্বর বা ব্যক্তিগত যোগাযোগ তথ্য কখনও উন্মুক্ত করা হয় না।'
                      : 'Under JSTU Student Privacy Ordinance, individual GPA, marks tabulation, roll numbers, and contact details are strictly withheld from public verification screens.'}
                  </span>
                </div>
              </div>

              {/* Tamper Detection Expansion Section */}
              <div className="border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setTamperMode(!tamperMode)}
                  className="text-xs font-bold text-[#1E3A8A] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>
                    {tamperMode ? (isBn ? 'টেম্পার চেকার লুকান' : 'Hide Tamper Check Tool') : (isBn ? 'ক্রিপ্টোগ্রাফিক টেম্পার চেক পরীক্ষা করুন' : 'Run Cryptographic Tamper Check')}
                  </span>
                </button>

                {tamperMode && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <p className="text-[11px] text-slate-600">
                      {isBn
                        ? 'পিডিএফ নথির নিচে মুদ্রিত পূর্ণাঙ্গ SHA-256 হ্যাশ পেস্ট করে রেজিস্ট্রি রেকর্ডের সাথে সমতা যাচাই করুন।'
                        : 'Paste the candidate SHA-256 digest printed at the bottom of the PDF to verify exact bit-for-bit registry integrity:'}
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tamperInputHash}
                        onChange={(e) => setTamperInputHash(e.target.value)}
                        placeholder="Paste 64-char SHA-256 hex digest..."
                        className="flex-1 p-2 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleTamperTest}
                        disabled={!tamperInputHash.trim()}
                      >
                        {isBn ? 'চেক করুন' : 'Compare'}
                      </Button>
                    </div>

                    {tamperCheckResult && tamperCheckResult.tested && (
                      <div
                        className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                          tamperCheckResult.isMatch
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}
                      >
                        {tamperCheckResult.isMatch ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>INTEGRITY CONFIRMED: Exact SHA-256 match with university ledger. Document is unaltered.</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                            <span>TAMPER ALERT: SHA-256 mismatch! The candidate digest does not match the sealed registry record.</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyDocumentPage;
