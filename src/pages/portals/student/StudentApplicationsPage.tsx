import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Modal } from '../../../components/common/Modal';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { WorkflowStepper } from '../../../components/workflow/WorkflowStepper';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  WORKFLOW_CONFIGS,
  ApplicationType,
  WorkflowDefinition
} from '../../../config/workflows';
import {
  getApplicationWorkflowService,
  PaperlessApplication,
  ApplicationAttachment
} from '../../../services/workflow';
import {
  getDigitalDocumentService,
  downloadDocumentPdf,
  DigitalDocument
} from '../../../services/documents';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Upload,
  Calendar,
  Send,
  Eye,
  RotateCcw,
  History,
  FileCheck,
  Search,
  Filter,
  Download,
  Award
} from 'lucide-react';

export const StudentApplicationsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<PaperlessApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<PaperlessApplication | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // New Application Modal State
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ApplicationType>('transcript');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [attachment, setAttachment] = useState<ApplicationAttachment | undefined>(undefined);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Resubmit Modal State
  const [resubmitModalOpen, setResubmitModalOpen] = useState(false);
  const [resubmitting, setResubmitting] = useState(false);

  const [downloadingAppId, setDownloadingAppId] = useState<string | null>(null);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const workflowService = getApplicationWorkflowService();
  const activeConfig: WorkflowDefinition = WORKFLOW_CONFIGS[selectedType];

  const loadApplications = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const studentId = profile?.studentId || 'JSTU2026001';
      const list = await workflowService.getStudentApplications(studentId);
      setApplications(list);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadIssuedDoc = async (app: PaperlessApplication) => {
    try {
      setDownloadingAppId(app.id);
      const docService = getDigitalDocumentService();
      let doc = await docService.getDocument(app.id);
      if (!doc) {
        const actor = {
          uid: user?.uid || 'demo_student_01',
          email: user?.email || 'student.demo@jstu.ac.bd',
          fullName: profile?.fullName || 'Tanvir Ahmed',
          role: 'student',
          studentId: profile?.studentId || 'JSTU2026001',
          departmentId: profile?.departmentId || 'CSE'
        };
        doc = await docService.issueDocument(app.id, actor);
      }
      await downloadDocumentPdf(doc);
    } catch (err: unknown) {
      console.error('Error downloading document:', err);
      alert('Failed to generate document PDF: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setDownloadingAppId(null);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [user]);

  // Handle Attachment Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachmentError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setAttachmentError('Only official PDF documents are accepted.');
      return;
    }

    const maxSize = activeConfig.maxAttachmentSizeBytes || 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setAttachmentError(`File size exceeds ${(maxSize / (1024 * 1024)).toFixed(0)}MB limit.`);
      return;
    }

    setAttachment({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    });
  };

  // Dynamic Zod Validation based on config
  const validateForm = () => {
    const errors: Record<string, string> = {};

    activeConfig.fields.forEach((field) => {
      const val = formData[field.name];
      if (field.required && (!val || String(val).trim().length === 0)) {
        errors[field.name] = `${field.label} is required.`;
      }
    });

    if (activeConfig.attachmentRequired && !attachment) {
      setAttachmentError('A supporting PDF document is mandatory for this application.');
      return false;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit New Application
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const actor = {
        uid: user?.uid || 'demo_student_01',
        email: user?.email || 'student.demo@jstu.ac.bd',
        fullName: profile?.fullName || 'Tanvir Ahmed',
        fullNameBn: profile?.fullNameBn || 'তানভীর আহমেদ',
        role: 'student',
        studentId: profile?.studentId || 'JSTU2026001',
        departmentId: profile?.departmentId || 'CSE'
      };

      const newApp = await workflowService.submitApplication(
        selectedType,
        formData,
        actor,
        attachment
      );

      setSuccessMsg(
        isBn
          ? `আপনার আবেদন (${newApp.applicationNumber}) সফলভাবে জমা হয়েছে এবং বিভাগীয় পর্যালোচনায় প্রেরণ করা হয়েছে।`
          : `Application (${newApp.applicationNumber}) submitted successfully! Forwarded to Department Chairman.`
      );

      setNewModalOpen(false);
      setFormData({});
      setAttachment(undefined);
      await loadApplications();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Resubmit Application after Correction
  const handleResubmit = async () => {
    if (!selectedApp) return;
    setResubmitting(true);
    try {
      const actor = {
        uid: user?.uid || 'demo_student_01',
        email: user?.email || 'student.demo@jstu.ac.bd',
        fullName: profile?.fullName || 'Tanvir Ahmed',
        role: 'student',
        studentId: profile?.studentId || 'JSTU2026001',
        departmentId: profile?.departmentId || 'CSE'
      };

      await workflowService.transition(selectedApp.id, 'RESUBMIT', actor);

      setSuccessMsg(
        isBn
          ? `আবেদনটি (${selectedApp.applicationNumber}) সংশোধনের পর পুনরায় জমা দেওয়া হয়েছে।`
          : `Application (${selectedApp.applicationNumber}) successfully resubmitted!`
      );
      setResubmitModalOpen(false);
      setDetailModalOpen(false);
      await loadApplications();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Resubmission failed.');
    } finally {
      setResubmitting(false);
    }
  };

  return (
    <DashboardLayout portalTitle={isBn ? 'পেপারলেস আবেদনপত্র' : 'Paperless Applications'}>
      <div className="space-y-6">
        {/* Top Header Banner */}
        <div className="p-6 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] text-white rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
              Official University Paperless Secretariat &bull; End-to-End Tracking
            </span>
            <h1 className="text-2xl font-black tracking-tight">
              {isBn ? 'বিশ্ববিদ্যালয় আবেদনপত্র ও ছাড়পত্র হাব' : 'Student Applications & Clearances Hub'}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              {isBn
                ? 'ট্রান্সক্রিপ্ট, সনদপত্র, প্রশংসাপত্র, ছুটির আবেদন ও বিভাগীয় ছাড়পত্রের ডিজিটাল কার্যপ্রণালী ট্র্যাকার।'
                : 'Request transcripts, certificates, testimonials, leave, and clearances with multi-tiered institutional sign-offs.'}
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setFormData({});
              setFormErrors({});
              setAttachment(undefined);
              setNewModalOpen(true);
            }}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold border-none"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {isBn ? 'নতুন আবেদন জমা দিন' : 'Submit New Application'}
          </Button>
        </div>

        {/* Global Notifications */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-slate-400 hover:text-slate-600 text-xs">
              &times;
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-slate-400 hover:text-slate-600 text-xs">
              &times;
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonLoader key={i} variant="rectangular" className="h-44 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Applications List */}
        {!loading && applications.length === 0 && (
          <Card padding="lg" className="text-center py-12">
            <EmptyState
              icon={<FileText className="w-8 h-8 text-slate-400" />}
              title={isBn ? 'কোনো আবেদন জমা দেওয়া হয়নি' : 'No Applications Submitted'}
              description={
                isBn
                  ? 'আপনার কোনো চলমান বা সংরক্ষিত আবেদন নেই। নতুন আবেদন করতে উপরের বাটনে ক্লিক করুন।'
                  : 'You have not submitted any academic requests yet. Click above to start a new application.'
              }
            />
          </Card>
        )}

        {!loading && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((app) => {
              const isApproved = app.status === 'APPROVED';
              const isRejected = app.status === 'REJECTED';
              const isReturned = app.status === 'RETURNED_FOR_CORRECTION';

              return (
                <Card
                  key={app.id}
                  padding="lg"
                  className="bg-white border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1] transition-all space-y-4"
                >
                  {/* Top Meta Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#F1F5F9] pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {app.applicationNumber}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                            isApproved
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : isRejected
                              ? 'bg-red-50 text-red-800 border border-red-200'
                              : isReturned
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {isApproved && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {isRejected && <X className="w-3 h-3 text-red-600" />}
                          {isReturned && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                          {!isApproved && !isRejected && !isReturned && (
                            <Clock className="w-3 h-3 text-blue-600" />
                          )}
                          <span>{app.status}</span>
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-[#0F172A] mt-1">
                        {isBn ? app.titleBn : app.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Submitted: {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                      {app.status === 'APPROVED' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleDownloadIssuedDoc(app)}
                          isLoading={downloadingAppId === app.id}
                          leftIcon={<Download className="w-3.5 h-3.5" />}
                        >
                          {isBn ? 'সনদ ডাউনলোড' : 'Download Document'}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApp(app);
                          setDetailModalOpen(true);
                        }}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        {isBn ? 'অগ্রগতি ট্র্যাকার' : 'View Progress'}
                      </Button>
                    </div>
                  </div>

                  {/* Visual Stepper */}
                  <div className="py-2">
                    <WorkflowStepper
                      chain={app.chain}
                      currentStepIndex={app.currentStepIndex}
                      status={app.status}
                      rejectionReason={app.rejectionReason}
                      returnComment={app.returnComment}
                    />
                  </div>

                  {/* Resubmit CTA if returned */}
                  {isReturned && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <span className="text-amber-900 font-medium">
                        {isBn
                          ? 'পর্যালোচনাকারী কর্তৃক আবেদনটি সংশোধনের জন্য ফেরত দেওয়া হয়েছে। প্রয়োজনীয় তথ্য পরিমার্জন করে পুনরায় জমা দিন।'
                          : 'Approver requested corrections. Revise details and resubmit to resume chain processing.'}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedApp(app);
                          setResubmitModalOpen(true);
                        }}
                        leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                      >
                        {isBn ? 'পুনরায় দাখিল করুন' : 'Resubmit Now'}
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Modal 1: New Application Form */}
        <Modal
          isOpen={newModalOpen}
          onClose={() => setNewModalOpen(false)}
          title={isBn ? 'নতুন প্রাতিষ্ঠানিক আবেদন দাখিল' : 'Submit Institutional Application'}
          size="lg"
        >
          <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
            {/* Step 1: Select Type */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                {isBn ? 'আবেদনের ধরন নির্বাচন করুন:' : 'Select Application Type:'}
              </label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value as ApplicationType);
                  setFormData({});
                  setFormErrors({});
                  setAttachment(undefined);
                }}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
              >
                {Object.values(WORKFLOW_CONFIGS).map((cfg) => (
                  <option key={cfg.type} value={cfg.type}>
                    {cfg.title}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 italic">
                {isBn ? activeConfig.descriptionBn : activeConfig.description}
              </p>
            </div>

            {/* Approval Chain Preview */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {isBn ? 'অনুমোদন কার্যপ্রণালী ধাপসমূহ:' : 'Designated Approval Chain:'}
              </span>
              <div className="flex items-center gap-2 flex-wrap font-mono text-[11px] text-slate-700">
                <span className="font-bold text-blue-700">Student</span>
                {activeConfig.chain.map((c, idx) => (
                  <React.Fragment key={idx}>
                    <span>&rarr;</span>
                    <span className="font-bold text-slate-800">{c.title}</span>
                  </React.Fragment>
                ))}
                <span>&rarr;</span>
                <span className="font-bold text-emerald-700">APPROVED</span>
              </div>
            </div>

            {/* Dynamic Type-Specific Fields */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              {activeConfig.fields.map((field) => (
                <div key={field.name} className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    {isBn ? field.labelBn : field.label}{' '}
                    {field.required && <span className="text-red-600">*</span>}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                    >
                      <option value="">{isBn ? '-- নির্বাচন করুন --' : '-- Select Option --'}</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {isBn ? opt.labelBn : opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                    />
                  )}

                  {formErrors[field.name] && (
                    <p className="text-[11px] text-red-600 font-medium">{formErrors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Supporting PDF Attachment Upload */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="block font-bold text-slate-700 flex items-center justify-between">
                <span>
                  {isBn ? 'সহায়ক সংযুক্তি (পিডিএফ নথি):' : 'Supporting Attachment (PDF Document):'}
                  {activeConfig.attachmentRequired && <span className="text-red-600"> *</span>}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Max: 5MB &bull; PDF only</span>
              </label>

              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{attachment ? (isBn ? 'ফাইল পরিবর্তন করুন' : 'Change File') : (isBn ? 'ফাইল নির্বাচন করুন' : 'Choose PDF')}</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {attachment && (
                  <span className="font-mono text-[11px] text-emerald-700 font-bold truncate max-w-xs">
                    {attachment.name} ({(attachment.size / 1024).toFixed(0)} KB)
                  </span>
                )}
              </div>

              {attachmentError && (
                <p className="text-[11px] text-red-600 font-medium">{attachmentError}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setNewModalOpen(false)}
                disabled={submitting}
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={submitting}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                {isBn ? 'দাখিল করুন' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal 2: Application Detail & Audit Timeline */}
        {selectedApp && (
          <Modal
            isOpen={detailModalOpen}
            onClose={() => setDetailModalOpen(false)}
            title={`${selectedApp.applicationNumber}: ${selectedApp.title}`}
            size="lg"
          >
            <div className="space-y-6 text-xs">
              {/* Stepper Display */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <WorkflowStepper
                  chain={selectedApp.chain}
                  currentStepIndex={selectedApp.currentStepIndex}
                  status={selectedApp.status}
                  rejectionReason={selectedApp.rejectionReason}
                  returnComment={selectedApp.returnComment}
                />
              </div>

              {/* Application Form Payload */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  {isBn ? 'দাখিলকৃত তথ্যাবলি' : 'Application Submission Details'}
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
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Attachment</span>
                      <span className="font-mono text-emerald-700 font-bold">{selectedApp.attachment.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Append-Only Audit History */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isBn ? 'অডিট হিস্টোরি ও ট্রেইল' : 'Sequential Append-Only Audit Trail'}</span>
                </h3>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-56 overflow-y-auto">
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

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                {selectedApp.status === 'APPROVED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleDownloadIssuedDoc(selectedApp)}
                    isLoading={downloadingAppId === selectedApp.id}
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                  >
                    {isBn ? 'অফিসিয়াল সনদ ডাউনলোড' : 'Download Official Document'}
                  </Button>
                )}
                {selectedApp.status === 'RETURNED_FOR_CORRECTION' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setResubmitModalOpen(true);
                    }}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  >
                    {isBn ? 'সংশোধিত আবেদন দাখিল' : 'Resubmit Corrected Application'}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setDetailModalOpen(false)}>
                  {isBn ? 'বন্ধ করুন' : 'Close'}
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal 3: Resubmit Confirmation */}
        {selectedApp && (
          <Modal
            isOpen={resubmitModalOpen}
            onClose={() => setResubmitModalOpen(false)}
            title={isBn ? 'আবেদন পুনরায় দাখিল নিশ্চিতকরণ' : 'Confirm Application Resubmission'}
            size="md"
          >
            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                You are about to resubmit <strong>{selectedApp.applicationNumber}</strong> ({selectedApp.title}) following your revisions. It will resume processing at the current approval tier.
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button variant="outline" size="sm" onClick={() => setResubmitModalOpen(false)}>
                  {isBn ? 'বাতিল' : 'Cancel'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleResubmit}
                  isLoading={resubmitting}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  {isBn ? 'নিশ্চিত করুন' : 'Confirm Resubmission'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};
