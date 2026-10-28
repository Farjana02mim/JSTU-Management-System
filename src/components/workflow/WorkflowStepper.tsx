import React from 'react';
import { Check, Clock, AlertTriangle, X } from 'lucide-react';
import { WorkflowStepConfig } from '../../config/workflows';
import { ApplicationStatus } from '../../services/workflow/workflowTypes';
import { useLanguage } from '../../contexts/LanguageContext';

interface WorkflowStepperProps {
  chain: WorkflowStepConfig[];
  currentStepIndex: number;
  status: ApplicationStatus;
  rejectionReason?: string;
  returnComment?: string;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  chain,
  currentStepIndex,
  status,
  rejectionReason,
  returnComment
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const isApproved = status === 'APPROVED';
  const isRejected = status === 'REJECTED';
  const isReturned = status === 'RETURNED_FOR_CORRECTION';

  return (
    <div className="space-y-4">
      {/* Steps visualization bar */}
      <div className="relative">
        <div className="overflow-hidden">
          <ol className="flex items-center w-full text-xs">
            {chain.map((step, idx) => {
              const isPast = idx < currentStepIndex || isApproved;
              const isCurrent = idx === currentStepIndex && !isApproved && !isRejected && !isReturned;
              const isFailed = idx === currentStepIndex && isRejected;
              const isNeedsCorrection = idx === currentStepIndex && isReturned;

              return (
                <li
                  key={step.stepIndex}
                  className={`flex-1 flex flex-col items-center relative ${
                    idx !== chain.length - 1
                      ? 'after:content-[""] after:w-full after:h-0.5 after:bg-slate-200 after:inline-block after:absolute after:top-4 after:left-1/2'
                      : ''
                  } ${isPast ? 'after:bg-emerald-500' : ''}`}
                >
                  {/* Step Circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-colors ${
                      isPast
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isFailed
                        ? 'bg-red-600 text-white shadow-xs'
                        : isNeedsCorrection
                        ? 'bg-amber-500 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-[#1E3A8A] text-white ring-4 ring-blue-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}
                  >
                    {isPast ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isFailed ? (
                      <X className="w-4 h-4 stroke-[3]" />
                    ) : isNeedsCorrection ? (
                      <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                    ) : isCurrent ? (
                      <Clock className="w-4 h-4 animate-pulse" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  {/* Step Title */}
                  <div className="mt-2 text-center px-1">
                    <span
                      className={`block font-bold text-[11px] leading-tight ${
                        isCurrent
                          ? 'text-[#1E3A8A]'
                          : isPast
                          ? 'text-emerald-700'
                          : isFailed
                          ? 'text-red-700'
                          : isNeedsCorrection
                          ? 'text-amber-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {isBn ? step.titleBn : step.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {isPast
                        ? (isBn ? 'সম্পন্ন' : 'Endorsed')
                        : isFailed
                        ? (isBn ? 'বাতিল' : 'Rejected')
                        : isNeedsCorrection
                        ? (isBn ? 'সংশোধন আবশ্যক' : 'Returned')
                        : isCurrent
                        ? (isBn ? 'চলমান ধাপ' : 'In Review')
                        : (isBn ? 'অপেক্ষমাণ' : 'Pending')}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Contextual Banner for Return or Rejection */}
      {isReturned && returnComment && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{isBn ? 'সংশোধনের নির্দেশিকা:' : 'Correction Notice from Approver:'}</span>
          </div>
          <p className="italic text-slate-700 pl-5">"{returnComment}"</p>
        </div>
      )}

      {isRejected && rejectionReason && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-xl text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-red-800">
            <X className="w-4 h-4 text-red-600 shrink-0" />
            <span>{isBn ? 'প্রত্যাখ্যানের কারণ:' : 'Reason for Rejection:'}</span>
          </div>
          <p className="italic text-slate-700 pl-5">"{rejectionReason}"</p>
        </div>
      )}

      {isApproved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            {isBn
              ? 'এই আবেদনটি সকল প্রাতিষ্ঠানিক ধাপ সফলভাবে অতিক্রম করে অনুমোদিত হয়েছে।'
              : 'All institutional chain sign-offs completed. Application officially APPROVED.'}
          </span>
        </div>
      )}
    </div>
  );
};
