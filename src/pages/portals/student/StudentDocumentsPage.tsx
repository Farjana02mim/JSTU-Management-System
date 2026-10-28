import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Modal } from '../../../components/common/Modal';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  getDigitalDocumentService,
  DigitalDocument,
  downloadDocumentPdf
} from '../../../services/documents';
import {
  FileText,
  Download,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  QrCode,
  AlertTriangle,
  Clock,
  Eye,
  Award,
  Lock,
  RefreshCw
} from 'lucide-react';

export const StudentDocumentsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<DigitalDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DigitalDocument | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const docService = getDigitalDocumentService();

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const studentId = profile?.studentId || 'JSTU2026001';
      const list = await docService.getStudentDocuments(studentId);
      setDocuments(list);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [user]);

  const handleDownloadPdf = async (doc: DigitalDocument) => {
    try {
      setDownloadingId(doc.id);
      await downloadDocumentPdf(doc);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate document PDF.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCopyLink = (verificationId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://jstu.ac.bd';
    const url = `${origin}/verify/${verificationId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(verificationId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <DashboardLayout portalTitle={isBn ? 'আমার ডিজিটাল সনদপত্র' : 'My Documents Vault'}>
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-6 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] text-white rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                Official Digital Credential Vault
              </span>
              <span className="text-xs text-slate-300">
                Student ID: {profile?.studentId || 'JSTU2026001'}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {isBn ? 'ডিজিটাল একাডেমিক সনদপত্র ও ট্রান্সক্রিপ্ট' : 'Digital Academic Documents & Vault'}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              {isBn
                ? 'অনুমোদিত আবেদনের প্রেক্ষিতে ইস্যুকৃত অফিসিয়াল সনদ, ট্রান্সক্রিপ্ট ও প্রশংসাপত্র। প্রতিটি নথিতে ক্রিপ্টোগ্রাফিক কিউআর ও ইউনিক ভেরিফিকেশন আইডি সংযুক্ত।'
                : 'Sealed academic credentials issued by JSTU administrative authorities. Each document includes cryptographic integrity hashes and a verification QR.'}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadDocuments}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            {isBn ? 'রিফ্রেশ' : 'Refresh'}
          </Button>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <SkeletonLoader key={i} variant="rectangular" className="h-44 rounded-2xl" />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && documents.length === 0 && (
          <Card padding="lg" className="text-center py-12">
            <EmptyState
              icon={<Award className="w-10 h-10 text-slate-400" />}
              title={isBn ? 'কোনো ইস্যুকৃত সনদ পাওয়া যায়নি' : 'No Digital Documents Issued Yet'}
              description={
                isBn
                  ? 'আপনার আবেদনসমূহ অনুমোদিত হলে এখানে স্বয়ংক্রিয়ভাবে ডিজিটাল সনদপত্র যুক্ত হবে।'
                  : 'Once your official applications (transcript, testimonial, certificate) reach full approval, sealed digital documents will appear in this vault.'
              }
              action={
                <Link to="/student/applications">
                  <Button variant="primary" size="sm">
                    {isBn ? 'নতুন আবেদন করুন' : 'Submit an Application'}
                  </Button>
                </Link>
              }
            />
          </Card>
        )}

        {/* Documents Grid */}
        {!loading && documents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const isValid = doc.status === 'VALID';

              return (
                <Card
                  key={doc.id}
                  padding="md"
                  className="bg-white border-[#E2E8F0] shadow-sm hover:border-[#1E3A8A]/40 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={isValid ? 'success' : 'danger'}>
                            {isValid ? 'AUTHENTIC' : 'REVOKED'}
                          </Badge>
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                            {doc.documentType}
                          </span>
                        </div>
                        <h3 className="text-sm font-extrabold text-[#0F172A] leading-snug">
                          {isBn ? doc.titleBn : doc.title}
                        </h3>
                      </div>

                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">{isBn ? 'আবেদন নম্বর:' : 'Application No:'}</span>
                        <span className="font-mono font-bold text-slate-700">{doc.applicationNumber}</span>
                      </div>

                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">{isBn ? 'ইস্যুর তারিখ:' : 'Issue Date:'}</span>
                        <span className="font-medium text-slate-700">
                          {new Date(doc.issueDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">{isBn ? 'ভেরিফিকেশন আইডি:' : 'Verification ID:'}</span>
                        <span className="font-mono text-[10px] text-slate-600 truncate max-w-[170px]" title={doc.verificationId}>
                          {doc.verificationId}
                        </span>
                      </div>

                      {doc.status === 'REVOKED' && doc.revocationReason && (
                        <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px]">
                          <span className="font-bold">Revoked: </span>
                          <span>{doc.revocationReason}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleDownloadPdf(doc)}
                        isLoading={downloadingId === doc.id}
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                      >
                        {isBn ? 'পিডিএফ ডাউনলোড' : 'Download PDF'}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDoc(doc);
                          setPreviewModalOpen(true);
                        }}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        {isBn ? 'প্রিভিউ' : 'Preview'}
                      </Button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyLink(doc.verificationId)}
                        className="p-1.5 text-slate-500 hover:text-[#1E3A8A] hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                        title="Copy Public Verification Link"
                      >
                        {copiedId === doc.verificationId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span className="text-[11px] hidden sm:inline">
                          {copiedId === doc.verificationId ? 'Copied' : 'Link'}
                        </span>
                      </button>

                      <Link
                        to={`/verify/${doc.verificationId}`}
                        target="_blank"
                        className="p-1.5 text-slate-500 hover:text-[#1E3A8A] hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1"
                        title="View Public Verification Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Document Preview Modal */}
        {selectedDoc && (
          <Modal
            isOpen={previewModalOpen}
            onClose={() => setPreviewModalOpen(false)}
            title={selectedDoc.title}
            maxWidth="lg"
          >
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {selectedDoc.studentName} ({selectedDoc.studentId})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Department of {selectedDoc.studentDepartment} • {selectedDoc.program}
                    </p>
                  </div>
                  <Badge variant={selectedDoc.status === 'VALID' ? 'success' : 'danger'}>
                    {selectedDoc.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Application No:</span>
                    <span className="font-mono font-bold text-slate-800">{selectedDoc.applicationNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date of Issue:</span>
                    <span className="font-medium text-slate-800">
                      {new Date(selectedDoc.issueDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Verification Token (128-bit):</span>
                  <span className="font-mono text-slate-800 break-all">{selectedDoc.verificationId}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">SHA-256 Content Digest:</span>
                  <span className="font-mono text-slate-600 break-all">{selectedDoc.canonicalHash}</span>
                </div>
              </div>

              {/* Watermark note */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Demo Mode: PDF documents bear a "DEMO - NOT AN OFFICIAL DOCUMENT" watermark.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPreviewModalOpen(false)}
                >
                  {isBn ? 'বন্ধ করুন' : 'Close'}
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleDownloadPdf(selectedDoc)}
                  isLoading={downloadingId === selectedDoc.id}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  {isBn ? 'পিডিএফ ডাউনলোড' : 'Download Official PDF'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDocumentsPage;
