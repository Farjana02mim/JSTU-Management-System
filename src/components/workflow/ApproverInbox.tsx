import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { WorkflowStepper } from '../workflow/WorkflowStepper';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  getApplicationWorkflowService,
  PaperlessApplication,
  WorkflowActor
} from '../../services/workflow';
import {
  Inbox,
  CheckCircle2,
  AlertTriangle,
  X,
  RotateCcw,
  Clock,
  Send,
  Eye,
  History,
  Search,
  Filter,
  FileCheck
} from 'lucide-react';

const reasonSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(5, { message: 'Must be at least 5 characters long.' })
    .max(500, { message: 'Cannot exceed 500 characters.' })
});

interface ApproverInboxProps {
  actor: WorkflowActor;
  portalTitle: string;
}

export const ApproverInbox: React.FC<ApproverInboxProps> = ({ actor, portalTitle }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<PaperlessApplication[]>([]);
  const [counts, setCounts] = useState({ pendingCount: 0, approvedCount: 0, rejectedCount: 0, returnedCount: 0 });
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'all' | 'APPROVED' | 'REJECTED' | 'RETURNED_FOR_CORRECTION'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedApp, setSelectedApp] = useState<PaperlessApplication | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);

  const [actionComment, setActionComment] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const workflowService = getApplicationWorkflowService();

  const loadData = async () => {
    try {
      setLoading(true);
      setFeedbackError(null);
      const [list, c] = await Promise.all([
        workflowService.getApproverInbox(actor, statusFilter),
        workflowService.getApproverCounts(actor)
      ]);
      setItems(list);
      setCounts(c);
    } catch (err: unknown) {
      setFeedbackError(err instanceof Error ? err.message : 'Failed to load inbox.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [actor, statusFilter]);

  const handleApprove = async () => {
    if (!selectedApp) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await workflowService.transition(
        selectedApp.id,
        'APPROVE',
        actor,
        actionComment.trim() || undefined
      );

      setFeedbackSuccess(
        isBn
          ? `আবেদন (${selectedApp.applicationNumber}) সফলভাবে অনুমোদন করা হয়েছে।`
          : `Application (${selectedApp.applicationNumber}) approved successfully.`
      );
      setApproveConfirmOpen(false);
      setDetailModalOpen(false);
      setActionComment('');
      await loadData();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Approval failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    const val = reasonSchema.safeParse({ comment: actionComment });
    if (!val.success) {
      setActionError(val.error.issues[0]?.message || 'Mandatory rejection reason required.');
      return;
    }

    setActionLoading(true);
    setActionError(null);
    try {
      await workflowService.transition(
        selectedApp.id,
        'REJECT',
        actor,
        actionComment.trim()
      );

      setFeedbackSuccess(
        isBn
          ? `আবেদন (${selectedApp.applicationNumber}) বাতিল করা হয়েছে। কারণ নথিভুক্ত হয়েছে।`
          : `Application (${selectedApp.applicationNumber}) rejected. Rejection reason logged.`
      );
      setRejectModalOpen(false);
      setDetailModalOpen(false);
      setActionComment('');
      await loadData();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Rejection failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!selectedApp) return;
    const val = reasonSchema.safeParse({ comment: actionComment });
    if (!val.success) {
      setActionError(val.error.issues[0]?.message || 'Mandatory review note required.');
      return;
    }

    setActionLoading(true);
    setActionError(null);
    try {
      await workflowService.transition(
        selectedApp.id,
        'RETURN_FOR_CORRECTION',
        actor,
        actionComment.trim()
      );

      setFeedbackSuccess(
        isBn
          ? `আবেদন (${selectedApp.applicationNumber}) সংশোধনের জন্য শিক্ষার্থীর নিকট ফেরত পাঠানো হয়েছে।`
          : `Application (${selectedApp.applicationNumber}) returned to student for correction.`
      );
      setReturnModalOpen(false);
      setDetailModalOpen(false);
      setActionComment('');
      await loadData();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Return failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredItems = items.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.applicationNumber.toLowerCase().includes(q) ||
      app.title.toLowerCase().includes(q) ||
      app.studentName.toLowerCase().includes(q) ||
      app.studentId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card padding="md" className="border-l-4 border-l-amber-500 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {isBn ? 'অপেক্ষমাণ আবেদন' : 'Pending Inbox'}
          </span>
          <div className="text-3xl font-black text-amber-600 font-mono">
            {counts.pendingCount}
          </div>
          <p className="text-[11px] text-slate-400">
            {isBn ? 'আপনার সিদ্ধান্তের অপেক্ষায়' : 'Action required by your office'}
          </p>
        </Card>

        <Card padding="md" className="border-l-4 border-l-emerald-600 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {isBn ? 'অনুমোদিত' : 'Approved'}
          </span>
          <div className="text-3xl font-black text-emerald-600 font-mono">
            {counts.approvedCount}
          </div>
          <p className="text-[11px] text-slate-400">
            {isBn ? 'চূড়ান্ত অনুমোদিত' : 'Completed chain'}
          </p>
        </Card>

        <Card padding="md" className="border-l-4 border-l-purple-600 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {isBn ? 'সংশোধনে প্রেরিত' : 'Returned'}
          </span>
          <div className="text-3xl font-black text-purple-600 font-mono">
            {counts.returnedCount}
          </div>
          <p className="text-[11px] text-slate-400">
            {isBn ? 'শিক্ষার্থী পর্যায়ে সংশোধন' : 'Pending revision'}
          </p>
        </Card>

        <Card padding="md" className="border-l-4 border-l-red-600 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {isBn ? 'বাতিলকৃত' : 'Rejected'}
          </span>
          <div className="text-3xl font-black text-red-600 font-mono">
            {counts.rejectedCount}
          </div>
          <p className="text-[11px] text-slate-400">
            {isBn ? 'অনুমোদন অযোগ্য' : 'Terminated'}
          </p>
        </Card>
      </div>

      {/* Global Alerts */}
      {feedbackSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackSuccess}</span>
          </div>
          <button onClick={() => setFeedbackSuccess(null)} className="text-slate-400 hover:text-slate-600 text-xs">
            &times;
          </button>
        </div>
      )}

      {feedbackError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{feedbackError}</span>
          </div>
          <button onClick={() => setFeedbackError(null)} className="text-slate-400 hover:text-slate-600 text-xs">
            &times;
          </button>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <Card padding="md" className="bg-white border-[#E2E8F0] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'আবেদন নম্বর, শিক্ষার্থী বা শিরোনাম খুঁজুন...' : 'Search application number, student, title...'}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              {isBn ? 'স্ট্যাটাস:' : 'Status:'}
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
            >
              <option value="PENDING">{isBn ? 'আমার টেবিলে অপেক্ষমাণ (Pending)' : 'Action Required (Pending)'}</option>
              <option value="all">{isBn ? 'সকল আবেদন' : 'All Applications'}</option>
              <option value="APPROVED">{isBn ? 'APPROVED (অনুমোদিত)' : 'APPROVED'}</option>
              <option value="RETURNED_FOR_CORRECTION">{isBn ? 'RETURNED (ফেরত)' : 'RETURNED'}</option>
              <option value="REJECTED">{isBn ? 'REJECTED (বাতিল)' : 'REJECTED'}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Inbox Items Table */}
      <Card padding="none" className="bg-white border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <Inbox className="w-4 h-4 text-[#1E3A8A]" />
            <span>{isBn ? `${portalTitle} ইনবক্স` : `${portalTitle} Application Queue`}</span>
          </h2>
          <span className="text-xs font-mono font-bold text-slate-500">
            {filteredItems.length} Records
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<Inbox className="w-8 h-8 text-slate-400" />}
              title={isBn ? 'ইনবক্স ফাঁকা' : 'No Applications In Queue'}
              description={
                isBn
                  ? 'আপনার দপ্তরে কোনো নতুন আবেদন অনুমোদনের অপেক্ষায় নেই।'
                  : 'All applications have been processed or no matching records found.'
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Application #</th>
                  <th className="py-3 px-3">Type & Title</th>
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3 text-center">Current Tier</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] font-medium text-slate-700">
                {filteredItems.map((app) => {
                  const currentStep = app.chain[app.currentStepIndex];
                  const isCurrentApprover =
                    currentStep &&
                    (actor.role === currentStep.role || actor.role === 'super_admin') &&
                    (!currentStep.departmentScoped ||
                      (actor.departmentId || '').toUpperCase() === (app.studentDepartment || '').toUpperCase() ||
                      actor.role === 'super_admin') &&
                    app.status === 'UNDER_REVIEW';

                  return (
                    <tr key={app.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-4 font-mono font-bold text-[#1E3A8A]">
                        {app.applicationNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{app.title}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">{app.type}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800">{app.studentName}</span>
                        <span className="text-[11px] text-slate-400 block font-mono">
                          {app.studentId} &bull; {app.studentDepartment}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {currentStep ? currentStep.title : 'Completed'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : app.status === 'REJECTED'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : app.status === 'RETURNED_FOR_CORRECTION'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px] font-mono">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant={isCurrentApprover ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setSelectedApp(app);
                            setActionComment('');
                            setActionError(null);
                            setDetailModalOpen(true);
                          }}
                          leftIcon={isCurrentApprover ? <FileCheck className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        >
                          {isCurrentApprover ? (isBn ? 'কার্যক্রম গ্রহণ' : 'Take Action') : (isBn ? 'বিস্তারিত' : 'View Detail')}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Application Detail & Action Modal */}
      {selectedApp && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={`${selectedApp.applicationNumber}: ${selectedApp.title}`}
          size="lg"
        >
          <div className="space-y-6 text-xs">
            {/* Stepper Progress */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <WorkflowStepper
                chain={selectedApp.chain}
                currentStepIndex={selectedApp.currentStepIndex}
                status={selectedApp.status}
                rejectionReason={selectedApp.rejectionReason}
                returnComment={selectedApp.returnComment}
              />
            </div>

            {/* Applicant Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Student</span>
                <span className="font-bold text-slate-800">{selectedApp.studentName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">ID & Dept</span>
                <span className="font-mono font-bold text-slate-800">{selectedApp.studentId} ({selectedApp.studentDepartment})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Email</span>
                <span className="font-mono text-slate-700">{selectedApp.studentEmail}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Submitted Date</span>
                <span className="font-mono text-slate-700">{new Date(selectedApp.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Form Payload */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Application Details & Form Submission
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 border border-slate-200 rounded-xl">
                {Object.entries(selectedApp.formData).map(([k, v]) => (
                  <div key={k} className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">{k}</span>
                    <span className="font-medium text-slate-800">{String(v)}</span>
                  </div>
                ))}
                {selectedApp.attachment && (
                  <div className="col-span-2 pt-2 border-t border-slate-100 space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Attached PDF Document</span>
                    <span className="font-mono text-emerald-700 font-bold">{selectedApp.attachment.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Audit History */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>Append-Only Audit Trail</span>
              </h3>
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {selectedApp.auditTrail.map((audit) => (
                  <div key={audit.id} className="p-3 text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#1E3A8A]">{audit.action}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(audit.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-600">
                      {audit.actorName} ({audit.role}) &bull; {audit.fromStatus} &rarr; <strong>{audit.toStatus}</strong>
                    </p>
                    {audit.comment && (
                      <p className="text-slate-700 italic bg-slate-50 p-1.5 rounded text-[11px]">
                        "{audit.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar (if current approver) */}
            {selectedApp.status === 'UNDER_REVIEW' &&
              selectedApp.chain[selectedApp.currentStepIndex]?.role === actor.role && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 pt-3">
                  <span className="font-bold text-slate-700">Official Action on this Step:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActionComment('');
                        setActionError(null);
                        setReturnModalOpen(true);
                      }}
                      leftIcon={<RotateCcw className="w-3.5 h-3.5 text-amber-600" />}
                    >
                      {isBn ? 'সংশোধনে ফেরত' : 'Return for Correction'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActionComment('');
                        setActionError(null);
                        setRejectModalOpen(true);
                      }}
                      leftIcon={<X className="w-3.5 h-3.5 text-red-600" />}
                    >
                      {isBn ? 'বাতিল' : 'Reject'}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setActionComment('');
                        setActionError(null);
                        setApproveConfirmOpen(true);
                      }}
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      {isBn ? 'অনুমোদন করুন' : 'Approve Step'}
                    </Button>
                  </div>
                </div>
              )}
          </div>
        </Modal>
      )}

      {/* Modal: Approve Step Confirmation */}
      {selectedApp && (
        <Modal
          isOpen={approveConfirmOpen}
          onClose={() => setApproveConfirmOpen(false)}
          title={`Approve: ${selectedApp.applicationNumber}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-700">
              You are endorsing / approving <strong>{selectedApp.title}</strong> on behalf of <strong>{actor.fullName} ({actor.role})</strong>.
            </p>

            {actionError && <div className="p-2.5 bg-red-50 text-red-700 rounded-lg">{actionError}</div>}

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">
                Endorsement Remark / Comment (Optional):
              </label>
              <textarea
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                rows={2}
                placeholder="Optional sign-off comment for audit trail..."
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button variant="outline" size="sm" onClick={() => setApproveConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleApprove} isLoading={actionLoading}>
                Confirm Approval
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Reject Confirmation */}
      {selectedApp && (
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title={`Reject Application: ${selectedApp.applicationNumber}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>
                Rejecting terminates the workflow permanently. A mandatory reason is required.
              </span>
            </div>

            {actionError && <div className="p-2.5 bg-red-50 text-red-700 rounded-lg">{actionError}</div>}

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">
                Mandatory Rejection Reason (Min 5 characters):
              </label>
              <textarea
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                rows={3}
                placeholder="State the institutional basis for rejecting this application..."
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button variant="outline" size="sm" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleReject} isLoading={actionLoading}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Return For Correction */}
      {selectedApp && (
        <Modal
          isOpen={returnModalOpen}
          onClose={() => setReturnModalOpen(false)}
          title={`Return for Correction: ${selectedApp.applicationNumber}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                This will return the application to the student. They will receive your review comment and be prompted to revise and resubmit.
              </span>
            </div>

            {actionError && <div className="p-2.5 bg-red-50 text-red-700 rounded-lg">{actionError}</div>}

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">
                Mandatory Correction Guidance (Min 5 characters):
              </label>
              <textarea
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                rows={3}
                placeholder="Specify missing documents, inaccurate dates, or required revisions..."
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button variant="outline" size="sm" onClick={() => setReturnModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleReturn} isLoading={actionLoading}>
                Confirm Return
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
