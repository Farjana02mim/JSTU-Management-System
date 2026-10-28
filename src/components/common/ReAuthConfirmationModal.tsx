import React, { useState } from 'react';
import { z } from 'zod';
import { Modal } from './Modal';
import { Button } from './Button';
import { KeyRound, ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const reAuthSchema = (expectedCode: string) =>
  z.object({
    password: z
      .string()
      .min(1, { message: 'Password is required for security verification.' }),
    courseCodeConfirmation: z
      .string()
      .trim()
      .refine((val) => val.toUpperCase() === expectedCode.toUpperCase(), {
        message: `Must exactly match course code "${expectedCode}".`
      })
  });

interface ReAuthConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  titleBn: string;
  actionDescription: string;
  actionDescriptionBn: string;
  courseCode: string;
  confirmButtonText?: string;
  confirmButtonTextBn?: string;
  variant?: 'danger' | 'primary' | 'success';
}

export const ReAuthConfirmationModal: React.FC<ReAuthConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  titleBn,
  actionDescription,
  actionDescriptionBn,
  courseCode,
  confirmButtonText = 'Confirm & Execute',
  confirmButtonTextBn = 'নিশ্চিত করুন ও কার্যকর করুন',
  variant = 'primary'
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [password, setPassword] = useState('');
  const [typedCode, setTypedCode] = useState('');
  const [errors, setErrors] = useState<{ password?: string; courseCodeConfirmation?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleClose = () => {
    setPassword('');
    setTypedCode('');
    setErrors({});
    setGeneralError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const schema = reAuthSchema(courseCode);
    const result = schema.safeParse({
      password,
      courseCodeConfirmation: typedCode
    });

    if (!result.success) {
      const fieldErrors: { password?: string; courseCodeConfirmation?: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === 'password') fieldErrors.password = issue.message;
        if (issue.path[0] === 'courseCodeConfirmation')
          fieldErrors.courseCodeConfirmation = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await onConfirm();
      handleClose();
    } catch (err: unknown) {
      setGeneralError(err instanceof Error ? err.message : 'Authentication verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isBn ? titleBn : title}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Warning header */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <p className="font-semibold">
              {isBn ? 'সংবেদনশীল প্রাতিষ্ঠানিক অনুমোদন' : 'High-Privilege Examination Action'}
            </p>
            <p className="text-amber-700">
              {isBn ? actionDescriptionBn : actionDescription}
            </p>
          </div>
        </div>

        {generalError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Step 1: Simulated Password Re-Authentication */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
            <span>{isBn ? 'পাসওয়ার্ড নিশ্চিতকরণ (ডেমো রি-অথ)' : 'Re-enter Officer Password'}</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your officer password"
            className={`w-full text-xs p-2.5 border rounded-lg focus:outline-none focus:ring-1 ${
              errors.password
                ? 'border-red-400 focus:ring-red-500 bg-red-50/30'
                : 'border-slate-300 focus:ring-[#1E3A8A] bg-white'
            }`}
          />
          {errors.password && <p className="text-[11px] text-red-600 font-medium">{errors.password}</p>}
        </div>

        {/* Step 2: Typed Course Code Confirmation */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            {isBn ? (
              <>নিশ্চিত করতে হুবহু কোর্স কোড <span className="font-mono text-[#1E3A8A] font-extrabold">{courseCode}</span> টাইপ করুন:</>
            ) : (
              <>Type course code <span className="font-mono text-[#1E3A8A] font-extrabold">{courseCode}</span> to confirm:</>
            )}
          </label>
          <input
            type="text"
            value={typedCode}
            onChange={(e) => setTypedCode(e.target.value.toUpperCase())}
            placeholder={courseCode}
            className={`w-full text-xs font-mono font-bold p-2.5 border rounded-lg focus:outline-none focus:ring-1 uppercase ${
              errors.courseCodeConfirmation
                ? 'border-red-400 focus:ring-red-500 bg-red-50/30'
                : 'border-slate-300 focus:ring-[#1E3A8A] bg-white'
            }`}
          />
          {errors.courseCodeConfirmation && (
            <p className="text-[11px] text-red-600 font-medium">{errors.courseCodeConfirmation}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {isBn ? 'বাতিল' : 'Cancel'}
          </Button>
          <Button
            type="submit"
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="sm"
            isLoading={isSubmitting}
          >
            {isBn ? confirmButtonTextBn : confirmButtonText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
