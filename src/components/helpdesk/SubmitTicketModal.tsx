import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import {
  TicketCategory,
  TicketPriority,
  AssignedOffice,
  TicketAttachment,
  HelpdeskTicket
} from '../../types/helpdesk';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import {
  HelpCircle,
  Upload,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Copy,
  FileText,
  X,
  Lock,
  EyeOff
} from 'lucide-react';

interface SubmitTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated?: (ticket: HelpdeskTicket) => void;
  defaultCategory?: TicketCategory;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

export const SubmitTicketModal: React.FC<SubmitTicketModalProps> = ({
  isOpen,
  onClose,
  onTicketCreated,
  defaultCategory = 'Academic'
}) => {
  const { user, profile, claims, role } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [category, setCategory] = useState<TicketCategory>(defaultCategory);
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);

  // Validation & Submission States
  const [fileError, setFileError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<HelpdeskTicket | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const resetForm = () => {
    setCategory(defaultCategory);
    setPriority('Medium');
    setSubject('');
    setDescription('');
    setIsAnonymous(false);
    setAttachments([]);
    setFileError(null);
    setFormErrors({});
    setCreatedTicket(null);
    setCopiedRef(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // 1. MIME type validation
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setFileError(
        isBn
          ? 'শুধুমাত্র পিডিএফ বা ছবি (JPG, PNG, WEBP) ফাইল আপলোড করা যাবে।'
          : 'Invalid file format. Only PDF, JPG, PNG, and WEBP files are allowed.'
      );
      e.target.value = '';
      return;
    }

    // 2. File size validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(
        isBn
          ? 'ফাইলের আকার ৫ মেগাবাইট (5 MB)-এর বেশি হতে পারবে না।'
          : `File size exceeds the 5 MB limit (Uploaded: ${(file.size / (1024 * 1024)).toFixed(2)} MB).`
      );
      e.target.value = '';
      return;
    }

    // Read as Base64 for preview / mock storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const newAttachment: TicketAttachment = {
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: event.target?.result as string,
        uploadedAt: new Date().toISOString()
      };
      setAttachments([newAttachment]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveAttachment = () => {
    setAttachments([]);
    setFileError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!subject.trim()) {
      errors.subject = isBn ? 'বিষয় উল্লেখ করা আবশ্যক।' : 'Subject is required.';
    } else if (subject.trim().length < 5) {
      errors.subject = isBn ? 'বিষয় কমপক্ষে ৫ অক্ষরের হতে হবে।' : 'Subject must be at least 5 characters.';
    }

    if (!description.trim()) {
      errors.description = isBn ? 'বিস্তারিত বর্ণনা আবশ্যক।' : 'Detailed description is required.';
    } else if (description.trim().length < 15) {
      errors.description = isBn
        ? 'বর্ণনা কমপক্ষে ১৫ অক্ষরের হতে হবে যাতে সংশ্লিষ্ট দপ্তর সমাধান করতে পারে।'
        : 'Description must be at least 15 characters to assist office staff.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const storeManager = SharedDataStoreManager.getInstance();

      // Student/Staff identity if NOT anonymous
      const studentId = claims?.studentId || (profile as { studentId?: string })?.studentId;
      const submitterName = profile?.fullName || user?.email?.split('@')[0] || 'Campus User';
      const submitterEmail = user?.email || undefined;
      const submitterRole = (role as any) || 'student';

      const ticket = storeManager.createHelpdeskTicket({
        category,
        priority,
        subject: subject.trim(),
        description: description.trim(),
        isAnonymous,
        // Identity strictly excluded if anonymous
        submitterUid: isAnonymous ? undefined : user?.uid || 'demo_user',
        submitterName: isAnonymous ? undefined : submitterName,
        submitterEmail: isAnonymous ? undefined : submitterEmail,
        submitterStudentId: isAnonymous ? undefined : studentId,
        submitterRole: isAnonymous ? undefined : submitterRole,
        attachments
      });

      setCreatedTicket(ticket);
      onTicketCreated?.(ticket);
    } catch (err) {
      console.error('Failed to submit ticket', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (!createdTicket) return;
    navigator.clipboard.writeText(createdTicket.referenceNumber);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        createdTicket
          ? (isBn ? 'টিকিট সফলভাবে জমা দেওয়া হয়েছে' : 'Ticket Created Successfully')
          : (isBn ? 'নতুন হেল্পডেস্ক টিকিট দাখিল' : 'Submit a Support Ticket')
      }
      maxWidth="lg"
    >
      {createdTicket ? (
        /* SUCCESS CONFIRMATION VIEW */
        <div className="space-y-5 text-xs py-2">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-emerald-900">
              {isBn ? 'আপনার টিকিট সিস্টেমে নথিভুক্ত হয়েছে' : 'Support Ticket Logged in Ledger'}
            </h3>
            <p className="text-emerald-700 text-xs max-w-md mx-auto">
              {isBn
                ? 'সংশ্লিষ্ট দপ্তরে টিকিটটি প্রেরণ করা হয়েছে। আপনার রেফারেন্স নম্বরটি সংরক্ষণ করুন।'
                : 'Your ticket has been dispatched to the assigned university office. Please copy and preserve your Reference Number.'}
            </p>
          </div>

          {/* Reference Number Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block">
                {isBn ? 'টিকিট রেফারেন্স নম্বর' : 'Ticket Reference Number'}
              </span>
              <span className="text-lg font-black font-mono text-[#1E3A8A]">
                {createdTicket.referenceNumber}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyRef}
              className="text-xs flex items-center gap-1.5 shrink-0"
            >
              {copiedRef ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRef ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'নম্বর কপি করুন' : 'Copy Number')}</span>
            </Button>
          </div>

          {/* Ticket Metadata Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
            <div className="p-2.5 bg-slate-50 border rounded-lg">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Category</span>
              <span className="font-bold text-slate-800">{createdTicket.category}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border rounded-lg">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Priority</span>
              <span className="font-bold text-slate-800">{createdTicket.priority}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border rounded-lg">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Assigned Office</span>
              <span className="font-bold text-slate-800 truncate block" title={createdTicket.assignedOffice}>
                {createdTicket.assignedOffice}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border rounded-lg">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">SLA Target</span>
              <span className="font-bold text-slate-800">{createdTicket.slaHours} Hours</span>
            </div>
          </div>

          {createdTicket.isAnonymous && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-xs flex items-start gap-2">
              <EyeOff className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Anonymous Submission Notice</span>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Your identity was completely excluded from the record. You must use Reference Number{' '}
                  <strong className="font-mono">{createdTicket.referenceNumber}</strong> to track progress on the public status page.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="primary" size="sm" onClick={handleClose}>
              {isBn ? 'সম্পন্ন' : 'Done'}
            </Button>
          </div>
        </div>
      ) : (
        /* TICKET CREATION FORM */
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isBn ? 'টিকিট ক্যাটাগরি *' : 'Ticket Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              >
                <option value="Academic">Academic (কোর্স ও সিলেবাস)</option>
                <option value="Exam">Exam (পরীক্ষা ও ফলাফল)</option>
                <option value="Fee">Fee (ফি ও পেমেন্ট)</option>
                <option value="Hostel">Hostel (হল ও আবাসন)</option>
                <option value="IT">IT (নেটওয়ার্ক ও কম্পিউটার)</option>
                <option value="Harassment/Complaint">Harassment/Complaint (অভিযোগ ও সুরক্ষা)</option>
                <option value="Other">Other (অন্যান্য বিষয়)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isBn ? 'জরুরি মাত্রা (Priority) *' : 'Priority Level *'}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              >
                <option value="Low">Low (সাধারণ অনুসন্ধান — ৭২ ঘণ্টা SLA)</option>
                <option value="Medium">Medium (স্ট্যান্ডার্ড — ৪৮ ঘণ্টা SLA)</option>
                <option value="High">High (জরুরি বিষয় — ২৪ ঘণ্টা SLA)</option>
                <option value="Urgent">Urgent (অতি জরুরি / পরীক্ষা — ১২ ঘণ্টা SLA)</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isBn ? 'বিষয় / সংক্ষিপ্ত শিরোনাম *' : 'Subject / Issue Title *'}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setFormErrors((prev) => ({ ...prev, subject: '' }));
              }}
              placeholder={isBn ? 'যেমন: সেমিস্টার ফি ভাউচার পেন্ডিং...' : 'e.g. WiFi authentication failing in Lab 301...'}
              className={`w-full p-2 border rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] ${
                formErrors.subject ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
              }`}
            />
            {formErrors.subject && (
              <p className="text-[11px] text-red-600 font-semibold mt-0.5">{formErrors.subject}</p>
            )}
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isBn ? 'বিস্তারিত বিবরণ ও প্রাসঙ্গিক তথ্য *' : 'Detailed Description & Specifics *'}
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setFormErrors((prev) => ({ ...prev, description: '' }));
              }}
              rows={4}
              placeholder={
                isBn
                  ? 'আপনার সমস্যাটির সুনির্দিষ্ট বিবরণ, স্থান, কোর্স কোড বা সময় উল্লেখ করুন...'
                  : 'Describe the issue clearly, mentioning any specific dates, locations, course codes, or steps to reproduce...'
              }
              className={`w-full p-2.5 border rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] ${
                formErrors.description ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
              }`}
            />
            {formErrors.description && (
              <p className="text-[11px] text-red-600 font-semibold mt-0.5">{formErrors.description}</p>
            )}
          </div>

          {/* Optional PDF / Image Attachment with Size & Type Validation */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isBn ? 'সংযুক্তি (ঐচ্ছিক — পিডিএফ বা ছবি, সর্বোচ্চ ৫ মেগাবাইট):' : 'Attachment (Optional — PDF or Image, Max 5 MB):'}
            </label>

            {attachments.length === 0 ? (
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50 hover:bg-slate-100/70 transition-colors relative cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
                  <Upload className="w-5 h-5 text-[#1E3A8A]" />
                  <span className="font-semibold text-slate-700">
                    {isBn ? 'ফাইল নির্বাচন করুন বা ড্র্যাগ করুন' : 'Click to upload PDF or image'}
                  </span>
                  <span className="text-[10px] text-slate-400">PDF, JPG, PNG, WEBP up to 5 MB</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-slate-800">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                  <span className="font-medium truncate">{attachments[0].name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ({(attachments[0].size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  className="text-slate-400 hover:text-red-600 p-1 rounded"
                  title="Remove attachment"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {fileError && <p className="text-[11px] text-red-600 font-semibold mt-1">{fileError}</p>}
          </div>

          {/* Anonymous Mode Toggle Box */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#1E3A8A] focus:ring-[#1E3A8A]"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isBn ? 'বেনামী দাখিল (Anonymous Mode)' : 'Submit Anonymously (Identity Protected)'}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {isBn
                    ? 'বেনামী মোড সক্রিয় করলে আপনার নাম, শিক্ষার্থী আইডি বা ইমেইল টিকিটের সাথে যুক্ত হবে না। বিশেষত অভিযোগ ও গোপনীয় তদন্তের জন্য সুপারিশকৃত।'
                    : 'When enabled, your name, student ID, and email will NEVER be stored with this ticket. Strongly recommended for sensitive reports or grievances.'}
                </p>
              </div>
            </label>

            {!isAnonymous && (
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Submitting as authenticated user:</span>
                <span className="font-semibold text-slate-700">
                  {profile?.fullName || user?.email || 'Logged In User'}
                </span>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={handleClose}>
              {isBn ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              {isBn ? 'টিকিট দাখিল করুন' : 'Submit Ticket'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
