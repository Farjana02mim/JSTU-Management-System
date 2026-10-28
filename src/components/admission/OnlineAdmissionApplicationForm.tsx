import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  ListOrdered,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Save,
  ArrowRight,
  ArrowLeft,
  Copy,
  Trash2,
  Calendar,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  AdmissionPersonalInfo,
  AdmissionAcademicInfo,
  AdmissionProgramChoice,
  AdmissionUploadedDocuments,
  AdmissionDocumentMeta,
  personalInfoSchema,
  academicInfoSchema,
  programChoiceSchema,
  AdmissionApplication
} from '../../types/admission';
import { getAdmissionService } from '../../services/admission/admissionService';

const DRAFT_STORAGE_KEY = 'jstu_admission_form_draft_v1';

interface DraftData {
  step: number;
  personalInfo: Partial<AdmissionPersonalInfo>;
  academicInfo: Partial<AdmissionAcademicInfo>;
  programChoice: Partial<AdmissionProgramChoice>;
  lastSavedAt: string;
}

export const OnlineAdmissionApplicationForm: React.FC<{
  onCheckStatusRequest?: (refNo: string, email: string) => void;
}> = ({ onCheckStatusRequest }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [draftSavedMessage, setDraftSavedMessage] = useState<string | null>(null);
  const [hasDraftLoaded, setHasDraftLoaded] = useState(false);

  // Form State
  const [personalInfo, setPersonalInfo] = useState<Partial<AdmissionPersonalInfo>>({
    fullName: '',
    fullNameBn: '',
    fatherName: '',
    fatherNameBn: '',
    motherName: '',
    motherNameBn: '',
    dateOfBirth: '',
    gender: 'MALE',
    bloodGroup: 'B+',
    religion: 'Islam',
    nationalIdOrBirthCert: '',
    phone: '',
    email: '',
    presentAddress: '',
    permanentAddress: '',
    quota: 'NONE'
  });

  const [academicInfo, setAcademicInfo] = useState<Partial<AdmissionAcademicInfo>>({
    sscBoard: 'Dhaka',
    sscRoll: '',
    sscReg: '',
    sscPassingYear: 2022,
    sscGpa: 5.0,
    sscGroup: 'Science',
    hscBoard: 'Dhaka',
    hscRoll: '',
    hscReg: '',
    hscPassingYear: 2024,
    hscGpa: 5.0,
    hscGroup: 'Science',
    hscMathGrade: 'A+',
    hscPhysicsGrade: 'A+',
    hscChemistryGrade: 'A',
    hscEnglishGrade: 'A+',
    hscBiologyGrade: 'A'
  });

  const [programChoice, setProgramChoice] = useState<Partial<AdmissionProgramChoice>>({
    unit: 'UNIT_A',
    firstChoiceDept: 'CSE',
    secondChoiceDept: 'EEE',
    thirdChoiceDept: 'MATH'
  });

  const [documents, setDocuments] = useState<AdmissionUploadedDocuments>({});
  const [docErrors, setDocErrors] = useState<Record<string, string>>({});

  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const storedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (storedDraft) {
        const parsed: DraftData = JSON.parse(storedDraft);
        if (parsed.personalInfo) setPersonalInfo(parsed.personalInfo);
        if (parsed.academicInfo) setAcademicInfo(parsed.academicInfo);
        if (parsed.programChoice) setProgramChoice(parsed.programChoice);
        if (parsed.step && parsed.step >= 1 && parsed.step <= 5) {
          setCurrentStep(parsed.step);
        }
        setHasDraftLoaded(true);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save draft helper
  const handleSaveDraft = (manual = true) => {
    try {
      const draft: DraftData = {
        step: currentStep,
        personalInfo,
        academicInfo,
        programChoice,
        lastSavedAt: new Date().toLocaleTimeString()
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      if (manual) {
        setDraftSavedMessage(
          isBn
            ? `খসড়া সফলভাবে সংরক্ষিত হয়েছে (${draft.lastSavedAt})। আপনি যেকোনো সময় ফিরে এসে এটি পূরণ করতে পারেন।`
            : `Draft saved successfully at ${draft.lastSavedAt}. You can resume anytime on this device.`
        );
        setTimeout(() => setDraftSavedMessage(null), 4000);
      }
    } catch {
      // ignore
    }
  };

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasDraftLoaded(false);
      setCurrentStep(1);
      setPersonalInfo({
        fullName: '',
        fullNameBn: '',
        fatherName: '',
        motherName: '',
        dateOfBirth: '',
        gender: 'MALE',
        bloodGroup: 'B+',
        religion: 'Islam',
        nationalIdOrBirthCert: '',
        phone: '',
        email: '',
        presentAddress: '',
        permanentAddress: '',
        quota: 'NONE'
      });
      setAcademicInfo({
        sscBoard: 'Dhaka',
        sscRoll: '',
        sscReg: '',
        sscPassingYear: 2022,
        sscGpa: 5.0,
        sscGroup: 'Science',
        hscBoard: 'Dhaka',
        hscRoll: '',
        hscReg: '',
        hscPassingYear: 2024,
        hscGpa: 5.0,
        hscGroup: 'Science',
        hscMathGrade: 'A+',
        hscPhysicsGrade: 'A+',
        hscChemistryGrade: 'A',
        hscEnglishGrade: 'A+',
        hscBiologyGrade: 'A'
      });
      setProgramChoice({
        unit: 'UNIT_A',
        firstChoiceDept: 'CSE',
        secondChoiceDept: 'EEE',
        thirdChoiceDept: 'MATH'
      });
      setDocuments({});
      setFormErrors({});
      setDraftSavedMessage(isBn ? 'খসড়া মুছে ফেলা হয়েছে।' : 'Draft cleared.');
      setTimeout(() => setDraftSavedMessage(null), 3000);
    } catch {
      // ignore
    }
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    setFormErrors({});
    const res = personalInfoSchema.safeParse(personalInfo);
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((issue) => {
        errs[String(issue.path[0])] = issue.message;
      });
      setFormErrors(errs);
      return false;
    }
    return true;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    setFormErrors({});
    const res = academicInfoSchema.safeParse(academicInfo);
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((issue) => {
        errs[String(issue.path[0])] = issue.message;
      });
      setFormErrors(errs);
      return false;
    }
    return true;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    setFormErrors({});
    const res = programChoiceSchema.safeParse(programChoice);
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((issue) => {
        errs[String(issue.path[0])] = issue.message;
      });
      setFormErrors(errs);
      return false;
    }
    return true;
  };

  // Step 4 Validation
  const validateStep4 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!documents.applicantPhoto) {
      errs.applicantPhoto = isBn ? 'আবেদনকারীর ছবি আপলোড করা আবশ্যক।' : 'Applicant photo is required.';
    }
    if (!documents.applicantSignature) {
      errs.applicantSignature = isBn ? 'আবেদনকারীর স্বাক্ষর আপলোড করা আবশ্যক।' : 'Applicant signature is required.';
    }
    if (!documents.sscTranscript) {
      errs.sscTranscript = isBn ? 'এসএসসি মার্কশিট/সনদ আপলোড করা আবশ্যক।' : 'SSC Transcript/Certificate is required.';
    }
    if (!documents.hscTranscript) {
      errs.hscTranscript = isBn ? 'এইচএসসি মার্কশিট/সনদ আপলোড করা আবশ্যক।' : 'HSC Transcript/Certificate is required.';
    }
    if (personalInfo.quota && personalInfo.quota !== 'NONE' && !documents.quotaCertificate) {
      errs.quotaCertificate = isBn
        ? 'নির্বাচিত কোটার সপক্ষে সরকারি সনদপত্র আপলোড করা আবশ্যক।'
        : 'Official Quota Certificate is required for the selected quota category.';
    }

    setDocErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step Navigation
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
    } else if (currentStep === 3) {
      if (!validateStep3()) return;
    } else if (currentStep === 4) {
      if (!validateStep4()) return;
    }

    handleSaveDraft(false);
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const handlePrevStep = () => {
    setFormErrors({});
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Document Upload Handler with Strict File Validation
  const handleFileUpload = (
    docKey: keyof AdmissionUploadedDocuments,
    file: File | null,
    allowedTypes: string[],
    maxSizeBytes: number
  ) => {
    setDocErrors((prev) => ({ ...prev, [docKey]: '' }));
    if (!file) return;

    // Check MIME type or extension
    const isValidType =
      allowedTypes.includes(file.type) ||
      (allowedTypes.includes('application/pdf') && file.name.toLowerCase().endsWith('.pdf')) ||
      (allowedTypes.includes('image/jpeg') && (file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg'))) ||
      (allowedTypes.includes('image/png') && file.name.toLowerCase().endsWith('.png'));

    if (!isValidType) {
      const allowedStr = allowedTypes.map((t) => t.replace('image/', '.').replace('application/', '.')).join(', ');
      setDocErrors((prev) => ({
        ...prev,
        [docKey]: isBn
          ? `ভুল ফাইল ফরম্যাট! কেবল ${allowedStr} ফাইল অনুমোদিত।`
          : `Invalid file format! Only ${allowedStr} files are accepted.`
      }));
      return;
    }

    // Check File Size
    if (file.size > maxSizeBytes) {
      const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
      setDocErrors((prev) => ({
        ...prev,
        [docKey]: isBn
          ? `ফাইলের আকার খুব বড়! সর্বোচ্চ ${maxMb}MB অনুমোদিত (বর্তমান আকার: ${(file.size / (1024 * 1024)).toFixed(2)}MB)।`
          : `File size exceeds maximum limit of ${maxMb}MB (Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB).`
      }));
      return;
    }

    // Read preview data URL for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const docMeta: AdmissionDocumentMeta = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadDate: new Date().toISOString(),
          dataUrl: reader.result as string
        };
        setDocuments((prev) => ({ ...prev, [docKey]: docMeta }));
      };
      reader.readAsDataURL(file);
    } else {
      const docMeta: AdmissionDocumentMeta = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadDate: new Date().toISOString()
      };
      setDocuments((prev) => ({ ...prev, [docKey]: docMeta }));
    }
  };

  const handleRemoveDoc = (docKey: keyof AdmissionUploadedDocuments) => {
    setDocuments((prev) => {
      const copy = { ...prev };
      delete copy[docKey];
      return copy;
    });
  };

  // Final Form Submit
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!declarationAccepted) {
      setFormErrors({
        declaration: isBn
          ? 'আপনাকে অবশ্যই তথ্যের সত্যতার ঘোষণাটি সম্মতি প্রদান করতে হবে।'
          : 'You must confirm the truthfulness declaration before submitting.'
      });
      return;
    }

    if (!validateStep1() || !validateStep2() || !validateStep3() || !validateStep4()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const service = getAdmissionService();
      const newApp = service.submitApplication({
        personalInfo: personalInfo as AdmissionPersonalInfo,
        academicInfo: academicInfo as AdmissionAcademicInfo,
        programChoice: programChoice as AdmissionProgramChoice,
        documents
      });

      // Clear draft
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setSubmittedApp(newApp);
    } catch (err: unknown) {
      setFormErrors({
        submit: err instanceof Error ? err.message : 'Submission failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (submittedApp?.referenceNumber) {
      navigator.clipboard.writeText(submittedApp.referenceNumber);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  // If submitted successfully, show Confirmation Screen
  if (submittedApp) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
        <Card className="p-8 sm:p-12 border-2 border-emerald-500 bg-white text-center space-y-6 shadow-md">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold">
              {isBn ? 'আবেদন সফলভাবে গৃহীত হয়েছে' : 'Application Successfully Submitted'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              {isBn ? 'অনলাইন ভর্তি আবেদন সম্পন্ন!' : 'Online Application Confirmed!'}
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              {isBn
                ? `অভিনন্দন ${submittedApp.personalInfo.fullName}! আপনার আবেদনটি সেন্ট্রাল অ্যাডমিশন ডাটাবেজে সংরক্ষিত হয়েছে। নিচের রেফারেন্স নম্বরটি সংরক্ষণ করুন।`
                : `Congratulations, ${submittedApp.personalInfo.fullName}! Your application has been logged into the JSTU Central Admissions system. Please preserve your unique reference number.`}
            </p>
          </div>

          {/* Reference Box */}
          <div className="p-6 bg-slate-50 border-2 border-dashed border-[#1E3A8A]/40 rounded-2xl max-w-md mx-auto space-y-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isBn ? 'আপনার স্থায়ী রেফারেন্স নম্বর' : 'Your Application Reference Number'}
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-black text-[#1E3A8A] tracking-wider">
                {submittedApp.referenceNumber}
              </span>
              <button
                onClick={handleCopyRef}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                title="Copy reference number"
              >
                {copiedRef ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-600" />
                )}
              </button>
            </div>
            {copiedRef && (
              <p className="text-xs text-emerald-600 font-medium">
                {isBn ? 'ক্লিপবোর্ডে কপি করা হয়েছে!' : 'Copied to clipboard!'}
              </p>
            )}
          </div>

          {/* Summary Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left border-y border-[#E2E8F0] py-4 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block">{isBn ? 'ইউনিট:' : 'Unit:'}</span>
              <span className="font-bold text-[#0F172A]">
                {submittedApp.programChoice.unit.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">{isBn ? '১ম পছন্দ:' : '1st Choice:'}</span>
              <span className="font-bold text-[#0F172A]">
                {submittedApp.programChoice.firstChoiceDept}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">{isBn ? 'এইচএসসি জিপিএ:' : 'HSC GPA:'}</span>
              <span className="font-bold text-[#0F172A]">
                {submittedApp.academicInfo.hscGpa.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">{isBn ? 'নিবন্ধিত ইমেইল:' : 'Email:'}</span>
              <span className="font-bold text-[#0F172A] truncate block">
                {submittedApp.personalInfo.email}
              </span>
            </div>
          </div>

          {/* Next Steps info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-left text-xs text-blue-900 space-y-1.5 leading-relaxed">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
              <span>{isBn ? 'পরবর্তী করণীয়:' : 'What happens next?'}</span>
            </p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>
                {isBn
                  ? 'রেজিস্ট্রার দপ্তর আপনার আপলোডকৃত এসএসসি ও এইচএসসি সনদপত্র স্ক্রুটিনি সম্পন্ন করবে।'
                  : 'The Registrar secretariat will scrutinize your uploaded SSC & HSC transcripts.'}
              </li>
              <li>
                {isBn
                  ? 'প্রাথমিক বাছাই সম্পন্ন হলে আপনার কিউআর কোড সংবলিত প্রবেশপত্র ডাউনলোডের জন্য প্রস্তুত হবে।'
                  : 'Once shortlisted, your QR-verified Admit Card will be available for download.'}
              </li>
              <li>
                {isBn
                  ? 'যেকোনো সময় "আবেদন স্ট্যাটাস দেখুন" ট্যাবে রেফারেন্স নম্বর ও ইমেইল দিয়ে স্ট্যাটাস চেক করতে পারবেন।'
                  : 'You can check your status anytime under the "Check Status" tab using this Reference Number and registered Email.'}
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (onCheckStatusRequest) {
                  onCheckStatusRequest(submittedApp.referenceNumber, submittedApp.personalInfo.email);
                }
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isBn ? 'আবেদনের স্ট্যাটাস দেখুন' : 'Check Application Status Now'}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setSubmittedApp(null);
                setCurrentStep(1);
              }}
            >
              {isBn ? 'নতুন আরেকটি আবেদন করুন' : 'Submit Another Application'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Draft Notification / Resume Notice */}
      {draftSavedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{draftSavedMessage}</span>
          </div>
          <button
            onClick={() => setDraftSavedMessage(null)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Form Progress Stepper */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {[
            { step: 1, label: isBn ? 'ব্যক্তিগত তথ্য' : 'Personal Info', icon: User },
            { step: 2, label: isBn ? 'একাডেমিক তথ্য' : 'Academic Records', icon: GraduationCap },
            { step: 3, label: isBn ? 'পছন্দক্রম' : 'Program Choice', icon: ListOrdered },
            { step: 4, label: isBn ? 'সনদপত্র আপলোড' : 'Document Upload', icon: Upload },
            { step: 5, label: isBn ? 'পর্যালোচনা ও দাখিল' : 'Review & Submit', icon: CheckCircle2 }
          ].map((s) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;

            return (
              <div
                key={s.step}
                className={`flex items-center gap-2.5 min-w-fit px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  isCurrent
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-50 text-slate-400 border border-slate-100'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isCurrent
                      ? 'bg-white text-[#1E3A8A]'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : s.step}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Multi-Step Form Card */}
      <Card className="p-6 sm:p-10 border border-[#E2E8F0] bg-white shadow-xs">
        <form onSubmit={handleFinalSubmit} className="space-y-8">
          {/* STEP 1: Personal & Contact Information */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#E2E8F0] pb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                    <User className="w-5 h-5 text-[#1E3A8A]" />
                    <span>{isBn ? '১. ব্যক্তিগত ও যোগাযোগের তথ্য' : '1. Personal & Contact Information'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn
                      ? 'জাতীয় পরিচয়পত্র অথবা জন্ম নিবন্ধন সনদ অনুযায়ী নির্ভুলভাবে পূরণ করুন।'
                      : 'Ensure details match your National ID or Official Birth Registration Certificate.'}
                  </p>
                </div>
                {hasDraftLoaded && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearDraft}
                    leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
                  >
                    {isBn ? 'খসড়া মুছুন' : 'Clear Saved Draft'}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <Input
                  label={isBn ? 'পূর্ণ নাম (ইংরেজি বড় অক্ষরে)' : 'Full Name in English (Capital Letters)'}
                  required
                  placeholder="MD. TAHMIDUR RAHMAN"
                  value={personalInfo.fullName || ''}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({ ...prev, fullName: e.target.value.toUpperCase() }))
                  }
                  error={formErrors.fullName}
                />

                <Input
                  label={isBn ? 'পূর্ণ নাম (বাংলায়)' : 'Full Name in Bengali'}
                  required
                  placeholder="মো. তাহমিদুর রহমান"
                  value={personalInfo.fullNameBn || ''}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({ ...prev, fullNameBn: e.target.value }))
                  }
                  error={formErrors.fullNameBn}
                />

                <Input
                  label={isBn ? "পিতার নাম (ইংরেজি)" : "Father's Name (English)"}
                  required
                  placeholder="MOTIUR RAHMAN"
                  value={personalInfo.fatherName || ''}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({ ...prev, fatherName: e.target.value }))
                  }
                  error={formErrors.fatherName}
                />

                <Input
                  label={isBn ? "মাতার নাম (ইংরেজি)" : "Mother's Name (English)"}
                  required
                  placeholder="NASRIN SULTANA"
                  value={personalInfo.motherName || ''}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({ ...prev, motherName: e.target.value }))
                  }
                  error={formErrors.motherName}
                />

                <Input
                  label={isBn ? 'জন্ম তারিখ' : 'Date of Birth'}
                  type="date"
                  required
                  value={personalInfo.dateOfBirth || ''}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({ ...prev, dateOfBirth: e.target.value }))
                  }
                  error={formErrors.dateOfBirth}
                />

                <Select
                  label={isBn ? 'লিঙ্গ' : 'Gender'}
                  value={personalInfo.gender || 'MALE'}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({
                      ...prev,
                      gender: e.target.value as 'MALE' | 'FEMALE' | 'OTHER'
                    }))
                  }
                  options={[
                    { value: 'MALE', label: isBn ? 'পুরুষ (Male)' : 'Male' },
                    { value: 'FEMALE', label: isBn ? 'মহিলা (Female)' : 'Female' },
                    { value: 'OTHER', label: isBn ? 'অন্যান্য (Other)' : 'Other' }
                  ]}
                />

                <Select
                  label={isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}
                  value={personalInfo.bloodGroup || 'B+'}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({ ...prev, bloodGroup: e.target.value }))
                  }
                  options={[
                    { value: 'A+', label: 'A+' },
                    { value: 'A-', label: 'A-' },
                    { value: 'B+', label: 'B+' },
                    { value: 'B-', label: 'B-' },
                    { value: 'AB+', label: 'AB+' },
                    { value: 'AB-', label: 'AB-' },
                    { value: 'O+', label: 'O+' },
                    { value: 'O-', label: 'O-' }
                  ]}
                />

                <Input
                  label={isBn ? 'ধর্ম' : 'Religion'}
                  required
                  placeholder="Islam, Hinduism, Buddhism, Christianity..."
                  value={personalInfo.religion || ''}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({ ...prev, religion: e.target.value }))
                  }
                  error={formErrors.religion}
                />

                <Input
                  label={isBn ? 'জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নম্বর' : 'National ID or Birth Cert No.'}
                  required
                  placeholder="20061928374619283"
                  value={personalInfo.nationalIdOrBirthCert || ''}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({
                      ...prev,
                      nationalIdOrBirthCert: e.target.value.trim()
                    }))
                  }
                  error={formErrors.nationalIdOrBirthCert}
                />

                <Input
                  label={isBn ? 'মোবাইল নম্বর (+৮৮০)' : 'Mobile Phone (+880)'}
                  required
                  placeholder="01712345678"
                  value={personalInfo.phone || ''}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({ ...prev, phone: e.target.value.trim() }))
                  }
                  error={formErrors.phone}
                />

                <Input
                  label={isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}
                  type="email"
                  required
                  placeholder="applicant@gmail.com"
                  value={personalInfo.email || ''}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({ ...prev, email: e.target.value.trim() }))
                  }
                  error={formErrors.email}
                />

                <Select
                  label={isBn ? 'বিশেষ কোটা ক্যাটাগরি' : 'Special Quota Category'}
                  value={personalInfo.quota || 'NONE'}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({
                      ...prev,
                      quota: e.target.value as any
                    }))
                  }
                  options={[
                    { value: 'NONE', label: isBn ? 'কোনো কোটা নেই (সাধারণ)' : 'General (No Quota)' },
                    {
                      value: 'FREEDOM_FIGHTER',
                      label: isBn ? 'মুক্তিযোদ্ধা কোটা (সন্তান/নাতি-নাতনি)' : 'Freedom Fighter Quota (5%)'
                    },
                    {
                      value: 'TRIBAL_ETHNIC',
                      label: isBn ? 'ক্ষুদ্র নৃ-গোষ্ঠী কোটা' : 'Tribal / Ethnic Minority (2%)'
                    },
                    {
                      value: 'DISABILITY',
                      label: isBn ? 'শারীরিক প্রতিবন্ধী কোটা' : 'Persons with Disability (1%)'
                    },
                    {
                      value: 'WARD',
                      label: isBn ? 'বিশ্ববিদ্যালয় পোষ্য কোটা' : 'JSTU Internal Ward Quota'
                    }
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
                <Input
                  label={isBn ? 'বর্তমান ঠিকানা' : 'Present Address'}
                  required
                  placeholder="House, Road, Thana/Upazila, District, Post Code"
                  value={personalInfo.presentAddress || ''}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({ ...prev, presentAddress: e.target.value }))
                  }
                  error={formErrors.presentAddress}
                />

                <Input
                  label={isBn ? 'স্থায়ী ঠিকানা' : 'Permanent Address'}
                  required
                  placeholder="Village, Post Office, Upazila, District"
                  value={personalInfo.permanentAddress || ''}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({ ...prev, permanentAddress: e.target.value }))
                  }
                  error={formErrors.permanentAddress}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Academic Qualifications */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#E2E8F0] pb-4">
                <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#1E3A8A]" />
                  <span>{isBn ? '২. পূর্বতন একাডেমিক ফলাফল ও রোল' : '2. Academic Records (SSC & HSC)'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn
                    ? 'মাধ্যমিক ও উচ্চ মাধ্যমিক পরীক্ষার তথ্য এবং প্রাপ্ত গ্রেড পয়েন্ট উল্লেখ করুন।'
                    : 'Input verified board credentials and individual science/business subject grades.'}
                </p>
              </div>

              {/* SSC Box */}
              <div className="p-5 bg-slate-50 border border-[#E2E8F0] rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-[#1E3A8A] uppercase tracking-wide">
                  {isBn ? 'এসএসসি / সমমান পরীক্ষা' : 'Secondary School Certificate (SSC / Equivalent)'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select
                    label={isBn ? 'শিক্ষা বোর্ড' : 'Education Board'}
                    value={academicInfo.sscBoard || 'Dhaka'}
                    onChange={(e) =>
                      setAcademicInfo((prev) => ({ ...prev, sscBoard: e.target.value }))
                    }
                    options={[
                      { value: 'Dhaka', label: 'Dhaka' },
                      { value: 'Jashore', label: 'Jashore' },
                      { value: 'Chattogram', label: 'Chattogram' },
                      { value: 'Rajshahi', label: 'Rajshahi' },
                      { value: 'Cumilla', label: 'Cumilla' },
                      { value: 'Barishal', label: 'Barishal' },
                      { value: 'Sylhet', label: 'Sylhet' },
                      { value: 'Dinajpur', label: 'Dinajpur' },
                      { value: 'Mymensingh', label: 'Mymensingh' },
                      { value: 'Madrasah', label: 'Madrasah' },
                      { value: 'Technical', label: 'Technical' }
                    ]}
                  />

                  <Input
                    label={isBn ? 'এসএসসি রোল নম্বর' : 'SSC Roll No.'}
                    required
                    placeholder="104829"
                    value={academicInfo.sscRoll || ''}
                    onChange={(e) =>
                      setAcademicInfo((prev) => ({ ...prev, sscRoll: e.target.value.trim() }))
                    }
                    error={formErrors.sscRoll}
                  />

                  <Input
                    label={isBn ? 'রেজিস্ট্রেশন নম্বর' : 'SSC Registration No.'}
                    required
                    placeholder="1810482910"
                    value={academicInfo.sscReg || ''}
                    onChange={(e) =>
                      setAcademicInfo((prev) => ({ ...prev, sscReg: e.target.value.trim() }))
                    }
                    error={formErrors.sscReg}
                  />

                  <Select
                    label={isBn ? 'পাসের সন' : 'Passing Year'}
                    value={String(academicInfo.sscPassingYear || 2022)}
                    onChange={(e) =>
                      setAcademicInfo((prev) => ({ ...prev, sscPassingYear: Number(e.target.value) }))
                    }
                    options={[
                      { value: '2024', label: '2024' },
                      { value: '2023', label: '2023' },
                      { value: '2022', label: '2022' },
                      { value: '2021', label: '2021' },
                      { value: '2020', label: '2020' }
                    ]}
                  />

                  <Input
                    label={isBn ? 'প্রাপ্ত জিপিএ (৫.০০ স্কেলে)' : 'SSC GPA (Scale 5.00)'}
                    type="number"
                    step="0.01"
                    min="2.5"
                    max="5.0"
                    required
                    placeholder="5.00"
                    value={String(academicInfo.sscGpa ?? 5.0)}
                    onChange={(e) =>
                      setAcademicInfo((prev) => ({ ...prev, sscGpa: parseFloat(e.target.value) }))
                    }
                    error={formErrors.sscGpa}
                  />

                  <Select
                    label={isBn ? 'শাখা' : 'Group'}
                    value={academicInfo.sscGroup || 'Science'}
                    onChange={(e) =>
                      setAcademicInfo((prev) => ({ ...prev, sscGroup: e.target.value }))
                    }
                    options={[
                      { value: 'Science', label: isBn ? 'বিজ্ঞান (Science)' : 'Science' },
                      { value: 'Humanities', label: isBn ? 'মানবিক (Humanities)' : 'Humanities' },
                      { value: 'Commerce', label: isBn ? 'ব্যবসায় শিক্ষা (Commerce)' : 'Commerce' }
                    ]}
                  />
                </div>
              </div>

              {/* HSC Box */}
              <div className="p-5 bg-slate-50 border border-[#E2E8F0] rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-[#1E3A8A] uppercase tracking-wide">
                  {isBn ? 'এইচএসসি / সমমান পরীক্ষা' : 'Higher Secondary Certificate (HSC / Equivalent)'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select
                    label={isBn ? 'শিক্ষা বোর্ড' : 'Education Board'}
                    value={academicInfo.hscBoard || 'Dhaka'}
                    onChange={(e) =>
                      setAcademicInfo((prev) => ({ ...prev, hscBoard: e.target.value }))
                    }
                    options={[
                      { value: 'Dhaka', label: 'Dhaka' },
                      { value: 'Jashore', label: 'Jashore' },
                      { value: 'Chattogram', label: 'Chattogram' },
                      { value: 'Rajshahi', label: 'Rajshahi' },
                      { value: 'Cumilla', label: 'Cumilla' },
                      { value: 'Barishal', label: 'Barishal' },
                      { value: 'Sylhet', label: 'Sylhet' },
                      { value: 'Dinajpur', label: 'Dinajpur' },
                      { value: 'Mymensingh', label: 'Mymensingh' },
                      { value: 'Madrasah', label: 'Madrasah' },
                      { value: 'Technical', label: 'Technical' }
                    ]}
                  />

                  <Input
                    label={isBn ? 'এইচএসসি রোল নম্বর' : 'HSC Roll No.'}
                    required
                    placeholder="302918"
                    value={academicInfo.hscRoll || ''}
                    onChange={(e) =>
                      setAcademicInfo((prev) => ({ ...prev, hscRoll: e.target.value.trim() }))
                    }
                    error={formErrors.hscRoll}
                  />

                  <Input
                    label={isBn ? 'রেজিস্ট্রেশন নম্বর' : 'HSC Registration No.'}
                    required
                    placeholder="1810482910"
                    value={academicInfo.hscReg || ''}
                    onChange={(e) =>
                      setAcademicInfo((prev) => ({ ...prev, hscReg: e.target.value.trim() }))
                    }
                    error={formErrors.hscReg}
                  />

                  <Select
                    label={isBn ? 'পাসের সন' : 'Passing Year'}
                    value={String(academicInfo.hscPassingYear || 2024)}
                    onChange={(e) =>
                      setAcademicInfo((prev) => ({ ...prev, hscPassingYear: Number(e.target.value) }))
                    }
                    options={[
                      { value: '2025', label: '2025' },
                      { value: '2024', label: '2024' },
                      { value: '2023', label: '2023' },
                      { value: '2022', label: '2022' }
                    ]}
                  />

                  <Input
                    label={isBn ? 'প্রাপ্ত জিপিএ (৫.০০ স্কেলে)' : 'HSC GPA (Scale 5.00)'}
                    type="number"
                    step="0.01"
                    min="2.5"
                    max="5.0"
                    required
                    placeholder="5.00"
                    value={String(academicInfo.hscGpa ?? 5.0)}
                    onChange={(e) =>
                      setAcademicInfo((prev) => ({ ...prev, hscGpa: parseFloat(e.target.value) }))
                    }
                    error={formErrors.hscGpa}
                  />

                  <Select
                    label={isBn ? 'শাখা' : 'Group'}
                    value={academicInfo.hscGroup || 'Science'}
                    onChange={(e) =>
                      setAcademicInfo((prev) => ({ ...prev, hscGroup: e.target.value }))
                    }
                    options={[
                      { value: 'Science', label: isBn ? 'বিজ্ঞান (Science)' : 'Science' },
                      { value: 'Humanities', label: isBn ? 'মানবিক (Humanities)' : 'Humanities' },
                      { value: 'Commerce', label: isBn ? 'ব্যবসায় শিক্ষা (Commerce)' : 'Commerce' }
                    ]}
                  />
                </div>

                {/* Specific Subject Grades */}
                <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">
                    {isBn ? 'এইচএসসি নির্দিষ্ট বিষয়ভিত্তিক গ্রেড:' : 'HSC Individual Subject Grades:'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <Select
                      label="Higher Math"
                      value={academicInfo.hscMathGrade || 'A+'}
                      onChange={(e) =>
                        setAcademicInfo((prev) => ({ ...prev, hscMathGrade: e.target.value }))
                      }
                      options={[
                        { value: 'A+', label: 'A+' },
                        { value: 'A', label: 'A' },
                        { value: 'A-', label: 'A-' },
                        { value: 'B', label: 'B' },
                        { value: 'C', label: 'C' },
                        { value: 'N/A', label: 'N/A' }
                      ]}
                    />
                    <Select
                      label="Physics"
                      value={academicInfo.hscPhysicsGrade || 'A+'}
                      onChange={(e) =>
                        setAcademicInfo((prev) => ({ ...prev, hscPhysicsGrade: e.target.value }))
                      }
                      options={[
                        { value: 'A+', label: 'A+' },
                        { value: 'A', label: 'A' },
                        { value: 'A-', label: 'A-' },
                        { value: 'B', label: 'B' },
                        { value: 'C', label: 'C' },
                        { value: 'N/A', label: 'N/A' }
                      ]}
                    />
                    <Select
                      label="Chemistry"
                      value={academicInfo.hscChemistryGrade || 'A'}
                      onChange={(e) =>
                        setAcademicInfo((prev) => ({ ...prev, hscChemistryGrade: e.target.value }))
                      }
                      options={[
                        { value: 'A+', label: 'A+' },
                        { value: 'A', label: 'A' },
                        { value: 'A-', label: 'A-' },
                        { value: 'B', label: 'B' },
                        { value: 'C', label: 'C' },
                        { value: 'N/A', label: 'N/A' }
                      ]}
                    />
                    <Select
                      label="English"
                      value={academicInfo.hscEnglishGrade || 'A+'}
                      onChange={(e) =>
                        setAcademicInfo((prev) => ({ ...prev, hscEnglishGrade: e.target.value }))
                      }
                      options={[
                        { value: 'A+', label: 'A+' },
                        { value: 'A', label: 'A' },
                        { value: 'A-', label: 'A-' },
                        { value: 'B', label: 'B' },
                        { value: 'C', label: 'C' }
                      ]}
                    />
                    <Select
                      label="Biology"
                      value={academicInfo.hscBiologyGrade || 'A'}
                      onChange={(e) =>
                        setAcademicInfo((prev) => ({ ...prev, hscBiologyGrade: e.target.value }))
                      }
                      options={[
                        { value: 'A+', label: 'A+' },
                        { value: 'A', label: 'A' },
                        { value: 'A-', label: 'A-' },
                        { value: 'B', label: 'B' },
                        { value: 'C', label: 'C' },
                        { value: 'N/A', label: 'N/A' }
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Program & Unit Choice */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#E2E8F0] pb-4">
                <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-[#1E3A8A]" />
                  <span>{isBn ? '৩. ইউনিট ও বিভাগভিত্তিক পছন্দক্রম' : '3. Unit & Department Choice Priority'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn
                    ? 'আবেদনযোগ্য ইউনিট নির্বাচন করে পছন্দের ৩টি ভিন্ন বিভাগ অগ্রাধিকার অনুযায়ী সাজান।'
                    : 'Select your admission unit and rank 3 distinct departments in order of preference.'}
                </p>
              </div>

              {/* Unit Choice Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    unit: 'UNIT_A' as const,
                    title: 'Unit A (Science & Engg)',
                    titleBn: 'ইউনিট এ (বিজ্ঞান ও প্রযুক্তি)',
                    desc: 'CSE, EEE, Mathematics, Fisheries, Geology',
                    color: 'border-blue-500 bg-blue-50/50'
                  },
                  {
                    unit: 'UNIT_B' as const,
                    title: 'Unit B (Social Sciences)',
                    titleBn: 'ইউনিট বি (কলা ও সমাজবিজ্ঞান)',
                    desc: 'Department of Social Work (BSS)',
                    color: 'border-emerald-500 bg-emerald-50/50'
                  },
                  {
                    unit: 'UNIT_C' as const,
                    title: 'Unit C (Business Studies)',
                    titleBn: 'ইউনিট সি (ব্যবসায় শিক্ষা)',
                    desc: 'Management Studies (BBA)',
                    color: 'border-amber-500 bg-amber-50/50'
                  }
                ].map((u) => {
                  const isSelected = programChoice.unit === u.unit;
                  return (
                    <button
                      key={u.unit}
                      type="button"
                      onClick={() => {
                        setProgramChoice((prev) => ({
                          ...prev,
                          unit: u.unit,
                          firstChoiceDept: u.unit === 'UNIT_A' ? 'CSE' : u.unit === 'UNIT_B' ? 'SW' : 'MGMT',
                          secondChoiceDept: u.unit === 'UNIT_A' ? 'EEE' : u.unit === 'UNIT_B' ? 'SW' : 'MGMT',
                          thirdChoiceDept: u.unit === 'UNIT_A' ? 'MATH' : u.unit === 'UNIT_B' ? 'SW' : 'MGMT'
                        }));
                      }}
                      className={`p-5 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? `${u.color} ring-2 ring-blue-500/30`
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-[#1E3A8A]">
                            {u.unit}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white text-[10px]'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && '✓'}
                          </div>
                        </div>
                        <h4 className="text-sm font-bold text-[#0F172A] mt-2">
                          {isBn ? u.titleBn : u.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">{u.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Priority Dropdowns */}
              <div className="p-6 bg-slate-50 border border-[#E2E8F0] rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-[#0F172A]">
                  {isBn ? 'বিভাগ নির্বাচন অগ্রাধিকার ক্রম:' : 'Department Preference Ranking:'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select
                    label={isBn ? '১ম পছন্দ (First Choice)' : '1st Choice Department'}
                    value={programChoice.firstChoiceDept || 'CSE'}
                    onChange={(e) =>
                      setProgramChoice((prev) => ({ ...prev, firstChoiceDept: e.target.value }))
                    }
                    options={
                      programChoice.unit === 'UNIT_A'
                        ? [
                            { value: 'CSE', label: 'Computer Science & Engineering (CSE)' },
                            { value: 'EEE', label: 'Electrical & Electronic Engineering (EEE)' },
                            { value: 'MATH', label: 'Mathematics (MATH)' },
                            { value: 'FISH', label: 'Fisheries & Marine Bioscience (FISH)' },
                            { value: 'GEOL', label: 'Geology & Petroleum Engineering (GEOL)' }
                          ]
                        : programChoice.unit === 'UNIT_B'
                        ? [{ value: 'SW', label: 'Department of Social Work (SW)' }]
                        : [{ value: 'MGMT', label: 'Management Studies (BBA)' }]
                    }
                  />

                  <Select
                    label={isBn ? '২য় পছন্দ (Second Choice)' : '2nd Choice Department'}
                    value={programChoice.secondChoiceDept || 'EEE'}
                    onChange={(e) =>
                      setProgramChoice((prev) => ({ ...prev, secondChoiceDept: e.target.value }))
                    }
                    options={
                      programChoice.unit === 'UNIT_A'
                        ? [
                            { value: 'EEE', label: 'Electrical & Electronic Engineering (EEE)' },
                            { value: 'CSE', label: 'Computer Science & Engineering (CSE)' },
                            { value: 'MATH', label: 'Mathematics (MATH)' },
                            { value: 'FISH', label: 'Fisheries & Marine Bioscience (FISH)' },
                            { value: 'GEOL', label: 'Geology & Petroleum Engineering (GEOL)' }
                          ]
                        : programChoice.unit === 'UNIT_B'
                        ? [{ value: 'SW', label: 'Department of Social Work (SW)' }]
                        : [{ value: 'MGMT', label: 'Management Studies (BBA)' }]
                    }
                    error={formErrors.secondChoiceDept}
                  />

                  <Select
                    label={isBn ? '৩য় পছন্দ (Third Choice)' : '3rd Choice Department'}
                    value={programChoice.thirdChoiceDept || 'MATH'}
                    onChange={(e) =>
                      setProgramChoice((prev) => ({ ...prev, thirdChoiceDept: e.target.value }))
                    }
                    options={
                      programChoice.unit === 'UNIT_A'
                        ? [
                            { value: 'MATH', label: 'Mathematics (MATH)' },
                            { value: 'CSE', label: 'Computer Science & Engineering (CSE)' },
                            { value: 'EEE', label: 'Electrical & Electronic Engineering (EEE)' },
                            { value: 'FISH', label: 'Fisheries & Marine Bioscience (FISH)' },
                            { value: 'GEOL', label: 'Geology & Petroleum Engineering (GEOL)' }
                          ]
                        : programChoice.unit === 'UNIT_B'
                        ? [{ value: 'SW', label: 'Department of Social Work (SW)' }]
                        : [{ value: 'MGMT', label: 'Management Studies (BBA)' }]
                    }
                  />
                </div>

                {programChoice.unit === 'UNIT_A' &&
                  (programChoice.firstChoiceDept === programChoice.secondChoiceDept ||
                    programChoice.firstChoiceDept === programChoice.thirdChoiceDept ||
                    programChoice.secondChoiceDept === programChoice.thirdChoiceDept) && (
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        {isBn
                          ? 'সতর্কতা: অনুগ্রহ করে ১ম, ২য় ও ৩য় পছন্দের জন্য ৩টি আলাদা বিভাগ বেছে নিন।'
                          : 'Please ensure you select three distinct departments in priority order.'}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* STEP 4: Document Upload with PDF/Image Validation */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#E2E8F0] pb-4">
                <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#1E3A8A]" />
                  <span>{isBn ? '৪. প্রয়োজনীয় সনদপত্র ও ছবি আপলোড' : '4. Document Upload & File Verification'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn
                    ? 'ছবি এবং স্বাক্ষরের জন্য জেপিজি/পিএনজি এবং সনদপত্রের জন্য পিডিএফ অথবা স্পষ্ট ছবি গ্রহণযোগ্য।'
                    : 'Strict validation enforced: Photo (max 2MB), Signature (max 1MB), Transcripts (PDF/Image max 3MB).'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Applicant Photo */}
                <div className="p-5 border border-[#E2E8F0] rounded-2xl bg-white space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#0F172A] block">
                        {isBn ? 'আবেদনকারীর ছবি *' : "Applicant's Passport Photo *"}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {isBn ? 'JPEG / PNG, সর্বোচ্চ ২ মেগাবাইট' : 'JPEG or PNG only, max 2MB'}
                      </span>
                    </div>
                    {documents.applicantPhoto && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                        Uploaded
                      </span>
                    )}
                  </div>

                  {documents.applicantPhoto ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      {documents.applicantPhoto.dataUrl ? (
                        <img
                          src={documents.applicantPhoto.dataUrl}
                          alt="Applicant"
                          className="w-14 h-14 rounded-lg object-cover border border-slate-300"
                        />
                      ) : (
                        <FileText className="w-10 h-10 text-slate-400" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {documents.applicantPhoto.fileName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {(documents.applicantPhoto.fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc('applicantPhoto')}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-[#1E3A8A] rounded-xl p-6 cursor-pointer bg-slate-50 hover:bg-blue-50/20 transition">
                        <Upload className="w-6 h-6 text-slate-400 mb-2" />
                        <span className="text-xs font-medium text-slate-600">
                          {isBn ? 'ছবি নির্বাচন করতে ক্লিক করুন' : 'Click to upload color portrait'}
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(
                              'applicantPhoto',
                              e.target.files?.[0] || null,
                              ['image/jpeg', 'image/png'],
                              2 * 1024 * 1024
                            )
                          }
                        />
                      </label>
                    </div>
                  )}
                  {docErrors.applicantPhoto && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{docErrors.applicantPhoto}</span>
                    </p>
                  )}
                </div>

                {/* 2. Applicant Signature */}
                <div className="p-5 border border-[#E2E8F0] rounded-2xl bg-white space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#0F172A] block">
                        {isBn ? 'আবেদনকারীর স্বাক্ষর *' : "Applicant's Signature *"}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {isBn ? 'সাদা কাগজে স্পষ্ট কালো কালিতে (JPEG/PNG, সর্বোচ্চ ১MB)' : 'Black ink on white paper (JPEG/PNG, max 1MB)'}
                      </span>
                    </div>
                    {documents.applicantSignature && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                        Uploaded
                      </span>
                    )}
                  </div>

                  {documents.applicantSignature ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      {documents.applicantSignature.dataUrl ? (
                        <img
                          src={documents.applicantSignature.dataUrl}
                          alt="Signature"
                          className="w-20 h-10 object-contain bg-white border border-slate-300 rounded p-1"
                        />
                      ) : (
                        <FileText className="w-8 h-8 text-slate-400" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {documents.applicantSignature.fileName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {(documents.applicantSignature.fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc('applicantSignature')}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-[#1E3A8A] rounded-xl p-6 cursor-pointer bg-slate-50 hover:bg-blue-50/20 transition">
                        <Upload className="w-6 h-6 text-slate-400 mb-2" />
                        <span className="text-xs font-medium text-slate-600">
                          {isBn ? 'স্বাক্ষর ফাইল নির্বাচন করুন' : 'Click to upload scanned signature'}
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(
                              'applicantSignature',
                              e.target.files?.[0] || null,
                              ['image/jpeg', 'image/png'],
                              1 * 1024 * 1024
                            )
                          }
                        />
                      </label>
                    </div>
                  )}
                  {docErrors.applicantSignature && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{docErrors.applicantSignature}</span>
                    </p>
                  )}
                </div>

                {/* 3. SSC Transcript */}
                <div className="p-5 border border-[#E2E8F0] rounded-2xl bg-white space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#0F172A] block">
                        {isBn ? 'এসএসসি মার্কশিট / সনদপত্র *' : 'SSC Transcript / Certificate *'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {isBn ? 'PDF অথবা স্পষ্ট JPEG/PNG ছবি, সর্বোচ্চ ৩MB' : 'PDF or clear JPEG/PNG, max 3MB'}
                      </span>
                    </div>
                    {documents.sscTranscript && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                        Uploaded
                      </span>
                    )}
                  </div>

                  {documents.sscTranscript ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <FileText className="w-8 h-8 text-[#1E3A8A]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {documents.sscTranscript.fileName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {(documents.sscTranscript.fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc('sscTranscript')}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-[#1E3A8A] rounded-xl p-6 cursor-pointer bg-slate-50 hover:bg-blue-50/20 transition">
                        <Upload className="w-6 h-6 text-slate-400 mb-2" />
                        <span className="text-xs font-medium text-slate-600">
                          {isBn ? 'এসএসসি সনদ/মার্কশিট ফাইল বেছে নিন' : 'Upload SSC transcript or marksheet'}
                        </span>
                        <input
                          type="file"
                          accept="application/pdf,image/jpeg,image/png"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(
                              'sscTranscript',
                              e.target.files?.[0] || null,
                              ['application/pdf', 'image/jpeg', 'image/png'],
                              3 * 1024 * 1024
                            )
                          }
                        />
                      </label>
                    </div>
                  )}
                  {docErrors.sscTranscript && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{docErrors.sscTranscript}</span>
                    </p>
                  )}
                </div>

                {/* 4. HSC Transcript */}
                <div className="p-5 border border-[#E2E8F0] rounded-2xl bg-white space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#0F172A] block">
                        {isBn ? 'এইচএসসি মার্কশিট / সনদপত্র *' : 'HSC Transcript / Certificate *'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {isBn ? 'PDF অথবা স্পষ্ট JPEG/PNG ছবি, সর্বোচ্চ ৩MB' : 'PDF or clear JPEG/PNG, max 3MB'}
                      </span>
                    </div>
                    {documents.hscTranscript && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                        Uploaded
                      </span>
                    )}
                  </div>

                  {documents.hscTranscript ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <FileText className="w-8 h-8 text-[#1E3A8A]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {documents.hscTranscript.fileName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {(documents.hscTranscript.fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc('hscTranscript')}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-[#1E3A8A] rounded-xl p-6 cursor-pointer bg-slate-50 hover:bg-blue-50/20 transition">
                        <Upload className="w-6 h-6 text-slate-400 mb-2" />
                        <span className="text-xs font-medium text-slate-600">
                          {isBn ? 'এইচএসসি সনদ/মার্কশিট ফাইল বেছে নিন' : 'Upload HSC transcript or marksheet'}
                        </span>
                        <input
                          type="file"
                          accept="application/pdf,image/jpeg,image/png"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(
                              'hscTranscript',
                              e.target.files?.[0] || null,
                              ['application/pdf', 'image/jpeg', 'image/png'],
                              3 * 1024 * 1024
                            )
                          }
                        />
                      </label>
                    </div>
                  )}
                  {docErrors.hscTranscript && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{docErrors.hscTranscript}</span>
                    </p>
                  )}
                </div>

                {/* 5. Quota Certificate (Conditional) */}
                {personalInfo.quota && personalInfo.quota !== 'NONE' && (
                  <div className="md:col-span-2 p-5 border border-amber-200 bg-amber-50/30 rounded-2xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-amber-900 block">
                          {isBn ? 'কোটার প্রমাণপত্র (গেজেট / সনদ) *' : 'Quota Verification Certificate *'}
                        </span>
                        <span className="text-[11px] text-amber-700">
                          {isBn
                            ? `নির্বাচিত কোটা: ${personalInfo.quota}। সরকারি গেজেট বা উপযুক্ত মেডিকেল সনদ আপলোড করুন (PDF/Image max 3MB)।`
                            : `Selected Quota: ${personalInfo.quota}. Upload official government gazette or certified certificate.`}
                        </span>
                      </div>
                      {documents.quotaCertificate && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                          Uploaded
                        </span>
                      )}
                    </div>

                    {documents.quotaCertificate ? (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-amber-300">
                        <FileText className="w-8 h-8 text-amber-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {documents.quotaCertificate.fileName}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {(documents.quotaCertificate.fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc('quotaCertificate')}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-xl p-6 cursor-pointer bg-white transition">
                          <Upload className="w-6 h-6 text-amber-500 mb-2" />
                          <span className="text-xs font-medium text-amber-900">
                            {isBn ? 'কোটা সনদ ফাইল আপলোড করুন' : 'Upload official quota certificate'}
                          </span>
                          <input
                            type="file"
                            accept="application/pdf,image/jpeg,image/png"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(
                                'quotaCertificate',
                                e.target.files?.[0] || null,
                                ['application/pdf', 'image/jpeg', 'image/png'],
                                3 * 1024 * 1024
                              )
                            }
                          />
                        </label>
                      </div>
                    )}
                    {docErrors.quotaCertificate && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{docErrors.quotaCertificate}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Review & Final Submission */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#E2E8F0] pb-4">
                <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{isBn ? '৫. আবেদনের সামগ্রিক পর্যালোচনা ও নিশ্চিতকরণ' : '5. Review & Final Application Submission'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn
                    ? 'আবেদন দাখিলের পূর্বে সকল তথ্য সাবধানতার সাথে যাচাই করে নিন। জমাদানের পর তথ্য সংশোধন করা যাবে না।'
                    : 'Carefully verify your personal profile, credentials, and subject priorities before final submission.'}
                </p>
              </div>

              {/* Review Sections */}
              <div className="space-y-4">
                {/* 1. Personal Summary */}
                <div className="p-5 bg-slate-50 border border-[#E2E8F0] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-[#1E3A8A] uppercase">
                      {isBn ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-[#1E3A8A] hover:underline font-semibold cursor-pointer"
                    >
                      {isBn ? 'সম্পাদনা' : 'Edit'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400 block">{isBn ? 'নাম:' : 'Name:'}</span>
                      <span className="font-bold">{personalInfo.fullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isBn ? 'বাংলায় নাম:' : 'Name (Bn):'}</span>
                      <span className="font-bold">{personalInfo.fullNameBn}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isBn ? 'মোবাইল:' : 'Phone:'}</span>
                      <span className="font-bold">{personalInfo.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isBn ? 'ইমেইল:' : 'Email:'}</span>
                      <span className="font-bold truncate block">{personalInfo.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isBn ? 'জন্ম তারিখ:' : 'DOB:'}</span>
                      <span className="font-bold">{personalInfo.dateOfBirth}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isBn ? 'লিঙ্গ:' : 'Gender:'}</span>
                      <span className="font-bold">{personalInfo.gender}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isBn ? 'রক্তের গ্রুপ:' : 'Blood Group:'}</span>
                      <span className="font-bold">{personalInfo.bloodGroup}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isBn ? 'কোটা:' : 'Quota:'}</span>
                      <span className="font-bold text-[#1E3A8A]">
                        {personalInfo.quota?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Academic Summary */}
                <div className="p-5 bg-slate-50 border border-[#E2E8F0] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-[#1E3A8A] uppercase">
                      {isBn ? 'একাডেমিক ফলাফল' : 'Academic Credentials'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs text-[#1E3A8A] hover:underline font-semibold cursor-pointer"
                    >
                      {isBn ? 'সম্পাদনা' : 'Edit'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400 block">SSC Board & Roll:</span>
                      <span className="font-bold">
                        {academicInfo.sscBoard} - {academicInfo.sscRoll}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">SSC GPA & Year:</span>
                      <span className="font-bold text-emerald-700">
                        {academicInfo.sscGpa} ({academicInfo.sscPassingYear})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">HSC Board & Roll:</span>
                      <span className="font-bold">
                        {academicInfo.hscBoard} - {academicInfo.hscRoll}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">HSC GPA & Year:</span>
                      <span className="font-bold text-emerald-700">
                        {academicInfo.hscGpa} ({academicInfo.hscPassingYear})
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Program & Unit Priority */}
                <div className="p-5 bg-slate-50 border border-[#E2E8F0] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-[#1E3A8A] uppercase">
                      {isBn ? 'আবেদনের ইউনিট ও বিভাগ' : 'Unit & Department Choices'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs text-[#1E3A8A] hover:underline font-semibold cursor-pointer"
                    >
                      {isBn ? 'সম্পাদনা' : 'Edit'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400 block">{isBn ? 'ইউনিট:' : 'Unit:'}</span>
                      <span className="font-bold text-[#1E3A8A]">
                        {programChoice.unit?.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isBn ? '১ম পছন্দ:' : '1st Choice:'}</span>
                      <span className="font-bold">{programChoice.firstChoiceDept}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isBn ? '২য় পছন্দ:' : '2nd Choice:'}</span>
                      <span className="font-bold">{programChoice.secondChoiceDept}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isBn ? '৩য় পছন্দ:' : '3rd Choice:'}</span>
                      <span className="font-bold">{programChoice.thirdChoiceDept}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Uploaded Documents Check */}
                <div className="p-5 bg-slate-50 border border-[#E2E8F0] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-[#1E3A8A] uppercase">
                      {isBn ? 'আপলোডকৃত ফাইলসমূহ' : 'Uploaded Documents Verified'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="text-xs text-[#1E3A8A] hover:underline font-semibold cursor-pointer"
                    >
                      {isBn ? 'সম্পাদনা' : 'Edit'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {documents.applicantPhoto && (
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Photo ({documents.applicantPhoto.fileName})</span>
                      </span>
                    )}
                    {documents.applicantSignature && (
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Signature ({documents.applicantSignature.fileName})</span>
                      </span>
                    )}
                    {documents.sscTranscript && (
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>SSC ({documents.sscTranscript.fileName})</span>
                      </span>
                    )}
                    {documents.hscTranscript && (
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>HSC ({documents.hscTranscript.fileName})</span>
                      </span>
                    )}
                    {documents.quotaCertificate && (
                      <span className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-amber-800 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Quota ({documents.quotaCertificate.fileName})</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Truthfulness Declaration Checkbox */}
              <div className="p-5 border-2 border-[#1E3A8A]/30 bg-blue-50/40 rounded-2xl space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={declarationAccepted}
                    onChange={(e) => {
                      setDeclarationAccepted(e.target.checked);
                      if (e.target.checked) {
                        setFormErrors((prev) => {
                          const c = { ...prev };
                          delete c.declaration;
                          return c;
                        });
                      }
                    }}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-[#1E3A8A] focus:ring-[#1E3A8A]"
                  />
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-[#0F172A] block mb-0.5">
                      {isBn ? 'সত্যতা ঘোষণা ও অঙ্গীকারনামা (Mandatory Declaration)' : 'Declaration & Commitment of Truthfulness'}
                    </span>
                    {isBn
                      ? 'আমি ঘোষণা করছি যে, এই আবেদনে প্রদত্ত সকল তথ্য ও সংযোজিত সনদপত্র সম্পূর্ণ সত্য ও নির্ভুল। ভবিষ্যতে কোনো অসঙ্গতি বা অসত্য তথ্য প্রমাণিত হলে বিশ্ববিদ্যালয় কর্তৃপক্ষ আমার আবেদন ও ভর্তি সরাসরি বাতিল করার এবং যেকোনো আইনগত ব্যবস্থা গ্রহণের পূর্ণ অধিকার সংরক্ষণ করে।'
                      : 'I hereby solemnly declare that all statements made and documents uploaded in this application are true, complete, and authentic. I understand that any false statement or misrepresentation will disqualify my application and render any subsequent admission void.'}
                  </div>
                </label>
                {formErrors.declaration && (
                  <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.declaration}</span>
                  </p>
                )}
              </div>

              {formErrors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>{formErrors.submit}</span>
                </div>
              )}
            </div>
          )}

          {/* Form Actions Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-[#E2E8F0]">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handlePrevStep}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  {isBn ? 'পূর্ববর্তী ধাপ' : 'Back'}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => handleSaveDraft(true)}
                leftIcon={<Save className="w-4 h-4 text-slate-500" />}
              >
                {isBn ? 'খসড়া সংরক্ষণ করুন' : 'Save Draft'}
              </Button>

              {currentStep < 5 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleNextStep}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {isBn ? 'পরবর্তী ধাপ' : 'Continue'}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  leftIcon={<ShieldCheck className="w-4 h-4" />}
                >
                  {isSubmitting
                    ? isBn
                      ? 'দাখিল হচ্ছে...'
                      : 'Submitting...'
                    : isBn
                    ? 'আবেদন চূড়ান্তভাবে দাখিল করুন'
                    : 'Submit Final Application'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};
