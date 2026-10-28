import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { ApproverInbox } from '../../../components/workflow/ApproverInbox';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Modal } from '../../../components/common/Modal';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { WorkflowActor } from '../../../services/workflow';
import {
  getDigitalDocumentService,
  DigitalDocument,
  downloadDocumentPdf
} from '../../../services/documents';
import {
  Inbox,
  Award,
  Search,
  Filter,
  Download,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  RefreshCw,
  Lock,
  FileText,
  UserCheck,
  GraduationCap,
  CreditCard
} from 'lucide-react';
import { AdminAccountRequestsTab } from '../../../components/admin/AdminAccountRequestsTab';
import { AdmissionApplicationsManagementTab } from '../../../components/admin/AdmissionApplicationsManagementTab';
import { RegistrarIdCardsTab } from '../../../components/admin/RegistrarIdCardsTab';

const revokeSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, { message: 'Revocation reason must be at least 5 characters long.' })
    .max(500, { message: 'Reason cannot exceed 500 characters.' }),
  confirmationText: z
    .string()
    .trim()
    .refine((val) => val.toUpperCase() === 'REVOKE', {
      message: 'You must type "REVOKE" to confirm permanent invalidation.'
    })
});

export const RegistrarDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [activeTab, setActiveTab] = useState<'applications' | 'admissions' | 'documents' | 'requests' | 'id-cards'>('applications');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<DigitalDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Revoke Modal State
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [selectedDocToRevoke, setSelectedDocToRevoke] = useState<DigitalDocument | null>(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [revokeConfirmText, setRevokeConfirmText] = useState('');
  const [revokeErrors, setRevokeErrors] = useState<Record<string, string>>({});
  const [revoking, setRevoking] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const actor: WorkflowActor = {
    uid: user?.uid || 'demo_registrar_01',
    email: user?.email || 'registrar.demo@jstu.ac.bd',
    fullName: profile?.fullName || 'Md. Abdul Mannan',
    fullNameBn: profile?.fullNameBn || 'মো. আবদুল মান্নান',
    role: 'registrar',
    officeId: 'REGISTRAR'
  };

  const docService = getDigitalDocumentService();

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setFeedbackError(null);
      const list = await docService.getAllIssuedDocuments({
        type: typeFilter,
        status: statusFilter,
        searchQuery
      });
      setDocuments(list);
    } catch (err: unknown) {
      setFeedbackError(err instanceof Error ? err.message : 'Failed to load document ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'documents') {
      loadDocuments();
    }
  }, [activeTab, statusFilter, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDocuments();
  };

  const handleDownload = async (doc: DigitalDocument) => {
    try {
      setDownloadingId(doc.id);
      await downloadDocumentPdf(doc);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to generate document PDF.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleRevokeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocToRevoke) return;

    setRevokeErrors({});
    const validation = revokeSchema.safeParse({
      reason: revokeReason,
      confirmationText: revokeConfirmText
    });

    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const path = String(issue.path[0]);
        errMap[path] = issue.message;
      });
      setRevokeErrors(errMap);
      return;
    }

    try {
      setRevoking(true);
      await docService.revokeDocument(
        selectedDocToRevoke.verificationId,
        revokeReason.trim(),
        actor
      );

      setFeedbackSuccess(
        isBn
          ? `সনদপত্র (${selectedDocToRevoke.verificationId}) সফলভাবে বাতিল করা হয়েছে।`
          : `Successfully revoked document (${selectedDocToRevoke.verificationId}). Public registry updated.`
      );
      setRevokeModalOpen(false);
      setSelectedDocToRevoke(null);
      setRevokeReason('');
      setRevokeConfirmText('');
      await loadDocuments();
    } catch (err: unknown) {
      setRevokeErrors({
        general: err instanceof Error ? err.message : 'Failed to revoke document.'
      });
    } finally {
      setRevoking(false);
    }
  };

  const validCount = documents.filter((d) => d.status === 'VALID').length;
  const revokedCount = documents.filter((d) => d.status === 'REVOKED').length;

  return (
    <DashboardLayout portalTitle={isBn ? 'রেজিস্ট্রার দপ্তর' : 'Office of Registrar'}>
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-6 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] text-white rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-300/30">
              Registrar Secretariat &bull; Academic Discharge & Credentials
            </span>
            <h1 className="text-2xl font-black tracking-tight">
              {isBn ? 'রেজিস্ট্রার দপ্তর — পেপারলেস ও ডিজিটাল সনদ পোর্টাল' : 'Office of Registrar Portal'}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              {isBn
                ? `কর্মকর্তা: ${profile?.fullNameBn || 'মো. আবদুল মান্নান'} (রেজিস্ট্রার)। পেপারলেস আবেদন অনুমোদন এবং ডিজিটাল সনদ ও ট্রান্সক্রিপ্ট রেজিস্ট্রি নিয়ন্ত্রণ।`
                : `Officer: ${profile?.fullName || 'Md. Abdul Mannan'} (Registrar). Process final institutional approvals and manage cryptographic document registry.`}
            </p>
          </div>
        </div>

        {/* Global Feedback */}
        {feedbackSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{feedbackSuccess}</span>
            </div>
            <button onClick={() => setFeedbackSuccess(null)} className="text-slate-400 hover:text-slate-600 text-xs">
              &times;
            </button>
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex border-b border-[#E2E8F0] gap-4">
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'applications'
                ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>{isBn ? 'পেপারলেস আবেদন ইনবক্স' : 'Applications Inbox'}</span>
          </button>

          <button
            onClick={() => setActiveTab('admissions')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'admissions'
                ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{isBn ? 'ভর্তি আবেদন রেজিস্ট্রি' : 'Admission Applications'}</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'documents'
                ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{isBn ? 'ইস্যুকৃত ডিজিটাল সনদ রেজিস্টার' : 'Issued Documents Register'}</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{isBn ? 'অ্যাকাউন্ট আবেদন রেজিস্ট্রি' : 'Account Requests'}</span>
          </button>

          <button
            onClick={() => setActiveTab('id-cards')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'id-cards'
                ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{isBn ? 'ডিজিটাল আইডি কার্ড' : 'Digital ID Cards'}</span>
          </button>
        </div>

        {/* Tab: Digital ID Cards */}
        {activeTab === 'id-cards' && (
          <RegistrarIdCardsTab
            actorDisplayName={profile?.fullName || 'Md. Abdul Mannan (Registrar)'}
            onNotification={(msg) => {
              if (msg.type === 'success') {
                setFeedbackSuccess(msg.text);
              } else {
                setFeedbackError(msg.text);
              }
            }}
          />
        )}

        {/* Tab 1: Approver Inbox */}
        {activeTab === 'applications' && (
          <ApproverInbox actor={actor} portalTitle="Registrar" />
        )}

        {/* Tab: Admission Applications */}
        {activeTab === 'admissions' && (
          <AdmissionApplicationsManagementTab
            reviewerRole="registrar"
            reviewerDisplayName={profile?.fullName || 'Md. Abdul Mannan (Registrar)'}
          />
        )}

        {/* Tab 2: Account Requests */}
        {activeTab === 'requests' && (
          <AdminAccountRequestsTab
            actorUid={user?.uid || 'demo_registrar_01'}
            actorRole="registrar"
            actorDisplayName={profile?.fullName || 'Md. Abdul Mannan (Registrar)'}
            onAccountApproved={() => {
              setFeedbackSuccess(
                isBn
                  ? 'শিক্ষার্থী অ্যাকাউন্ট সফলভাবে অনুমোদিত হয়েছে।'
                  : 'Student account provisioned and activation email dispatched.'
              );
            }}
            onNotification={(msg) => {
              if (msg.type === 'success') {
                setFeedbackSuccess(msg.text);
              } else {
                setFeedbackError(msg.text);
              }
            }}
          />
        )}

        {/* Tab 2: Issued Documents Register */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card padding="md" className="border-l-4 border-l-blue-600 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {isBn ? 'মোট ইস্যুকৃত সনদ' : 'Total Issued Documents'}
                </span>
                <div className="text-3xl font-black text-blue-900 font-mono">
                  {documents.length}
                </div>
                <p className="text-[11px] text-slate-400">
                  {isBn ? 'সকল বিভাগের নিবন্ধিত সনদপত্র' : 'All sealed university credentials'}
                </p>
              </Card>

              <Card padding="md" className="border-l-4 border-l-emerald-600 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {isBn ? 'বৈধ ও সক্রিয় সনদ' : 'Active & Valid'}
                </span>
                <div className="text-3xl font-black text-emerald-600 font-mono">
                  {validCount}
                </div>
                <p className="text-[11px] text-slate-400">
                  {isBn ? 'পাবলিক ভেরিফিকেশনে সক্রিয়' : 'Accessible on public ledger'}
                </p>
              </Card>

              <Card padding="md" className="border-l-4 border-l-rose-600 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {isBn ? 'বাতিলকৃত সনদ' : 'Revoked Credentials'}
                </span>
                <div className="text-3xl font-black text-rose-600 font-mono">
                  {revokedCount}
                </div>
                <p className="text-[11px] text-slate-400">
                  {isBn ? 'স্থায়ীভাবে বাতিল ঘোষিত' : 'Permanently invalidated by Registrar'}
                </p>
              </Card>
            </div>

            {/* Filter & Search Toolbar */}
            <Card padding="md" className="bg-white border-[#E2E8F0] shadow-sm space-y-3">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isBn ? 'শিক্ষার্থীর নাম, আইডি, আবেদন নম্বর বা ভেরিফিকেশন টোকেন খুঁজুন...' : 'Search student, ID, app number, verification token...'}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                    {isBn ? 'ধরন:' : 'Type:'}
                  </span>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="all">{isBn ? 'সকল ধরন' : 'All Types'}</option>
                    <option value="transcript">Transcript</option>
                    <option value="certificate">Certificate</option>
                    <option value="testimonial">Testimonial</option>
                    <option value="approval_letter">Approval Letter</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                    {isBn ? 'স্ট্যাটাস:' : 'Status:'}
                  </span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="all">{isBn ? 'সকল স্ট্যাটাস' : 'All Statuses'}</option>
                    <option value="VALID">VALID</option>
                    <option value="REVOKED">REVOKED</option>
                  </select>
                </div>

                <Button type="submit" variant="primary" size="sm" leftIcon={<Filter className="w-3.5 h-3.5" />}>
                  {isBn ? 'ফিল্টার' : 'Filter'}
                </Button>
              </form>
            </Card>

            {/* Documents Table */}
            <Card padding="none" className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    {isBn ? 'কেন্দ্রীয় ডিজিটাল সনদ রেজিস্টার' : 'Central Digital Credential Register'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isBn
                      ? 'জেএসটিইউ ক্রিপ্টোগ্রাফিক সনদপত্র তালিকা ও রেজিস্ট্রি ট্র্যাকার।'
                      : 'Audit and manage tamper-evident university academic records.'}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {documents.length} Records
                </span>
              </div>

              {loading ? (
                <div className="p-6 space-y-3">
                  <SkeletonLoader variant="rectangular" className="h-12 w-full" />
                  <SkeletonLoader variant="rectangular" className="h-12 w-full" />
                  <SkeletonLoader variant="rectangular" className="h-12 w-full" />
                </div>
              ) : documents.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    icon={<Award className="w-8 h-8 text-slate-400" />}
                    title={isBn ? 'কোনো সনদ রেকর্ড পাওয়া যায়নি' : 'No documents matched'}
                    description={isBn ? 'আপনার সার্চ বা ফিল্টার শর্তাবলী পরিবর্তন করে চেষ্টা করুন।' : 'Try adjusting search query or filters.'}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Document Title & Type</th>
                        <th className="py-3 px-3">Student & Dept</th>
                        <th className="py-3 px-3 font-mono">Verification Token</th>
                        <th className="py-3 px-3 text-center">Issued Date</th>
                        <th className="py-3 px-3 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9] font-medium text-slate-700">
                      {documents.map((doc) => {
                        const isValid = doc.status === 'VALID';

                        return (
                          <tr key={doc.id} className="hover:bg-[#F8FAFC]">
                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-900 block">
                                {isBn ? doc.titleBn : doc.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                App: {doc.applicationNumber}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <span className="font-semibold text-slate-900 block">
                                {doc.studentName}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {doc.studentId} &bull; {doc.studentDepartment}
                              </span>
                            </td>

                            <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                              <span className="block truncate max-w-[140px]" title={doc.verificationId}>
                                {doc.verificationId}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-center text-slate-500">
                              {new Date(doc.issueDate).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>

                            <td className="py-3 px-3 text-center">
                              <Badge variant={isValid ? 'success' : 'danger'}>
                                {doc.status}
                              </Badge>
                            </td>

                            <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownload(doc)}
                                isLoading={downloadingId === doc.id}
                                leftIcon={<Download className="w-3 h-3" />}
                                title="Download PDF"
                              >
                                PDF
                              </Button>

                              <Link
                                to={`/verify/${doc.verificationId}`}
                                target="_blank"
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                title="Verify Public URL"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Verify</span>
                              </Link>

                              {isValid && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedDocToRevoke(doc);
                                    setRevokeReason('');
                                    setRevokeConfirmText('');
                                    setRevokeErrors({});
                                    setRevokeModalOpen(true);
                                  }}
                                  className="text-rose-700 hover:bg-rose-50 border-rose-200"
                                  leftIcon={<ShieldAlert className="w-3 h-3" />}
                                >
                                  {isBn ? 'বাতিল' : 'Revoke'}
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Revocation Confirmation Modal */}
        {selectedDocToRevoke && (
          <Modal
            isOpen={revokeModalOpen}
            onClose={() => setRevokeModalOpen(false)}
            title={isBn ? 'সনদপত্র স্থায়ী বাতিলের নোটিশ' : 'Permanent Document Revocation'}
            maxWidth="md"
          >
            <form onSubmit={handleRevokeSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-900">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">
                    {isBn ? 'সতর্কতা: এই পদক্ষেপটি স্থায়ী ও অপরিবর্তনীয়' : 'Caution: Permanent Cryptographic Invalidation'}
                  </p>
                  <p className="text-rose-800 text-[11px] leading-relaxed">
                    {isBn
                      ? `সনদ (${selectedDocToRevoke.verificationId}) বাতিল হলে তা পাবলিক ভেরিফিকেশনে তাৎক্ষণিকভাবে REVOKED হিসেবে প্রদর্শিত হবে।`
                      : `Revoking this document permanently marks it as REVOKED on the public verification ledger. All issued copies become invalid.`}
                  </p>
                </div>
              </div>

              {revokeErrors.general && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {revokeErrors.general}
                </div>
              )}

              {/* Target Document Summary */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Document:</span>
                  <span className="font-bold text-slate-800">{selectedDocToRevoke.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedDocToRevoke.studentName} ({selectedDocToRevoke.studentId})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verification Token:</span>
                  <span className="font-mono text-slate-700">{selectedDocToRevoke.verificationId}</span>
                </div>
              </div>

              {/* Mandatory Reason */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {isBn ? 'বাতিলের সুনির্দিষ্ট কারণ (বাধ্যতামূলক):' : 'Mandatory Revocation Reason:'}
                </label>
                <textarea
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  rows={3}
                  placeholder="e.g. Disciplinary suspension, data entry discrepancy, court order, duplicate parchment..."
                  className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white ${
                    revokeErrors.reason ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {revokeErrors.reason && (
                  <p className="text-[11px] text-rose-600 font-semibold">{revokeErrors.reason}</p>
                )}
              </div>

              {/* Re-Auth / Typed Confirmation */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {isBn
                    ? 'নিশ্চিতকরণ: টাইপ করুন "REVOKE"'
                    : 'Confirmation: Type "REVOKE" to authorize:'}
                </label>
                <input
                  type="text"
                  value={revokeConfirmText}
                  onChange={(e) => setRevokeConfirmText(e.target.value)}
                  placeholder="Type REVOKE"
                  className={`w-full p-2 border font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white ${
                    revokeErrors.confirmationText ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {revokeErrors.confirmationText && (
                  <p className="text-[11px] text-rose-600 font-semibold">{revokeErrors.confirmationText}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRevokeModalOpen(false)}
                  disabled={revoking}
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  isLoading={revoking}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                  leftIcon={<ShieldAlert className="w-3.5 h-3.5" />}
                >
                  {isBn ? 'স্থায়ীভাবে বাতিল করুন' : 'Confirm Permanent Revocation'}
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RegistrarDashboard;
