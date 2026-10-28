import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getStudentDataService, AssignmentItem } from '../../../services/student';
import { z } from 'zod';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Award,
  AlertTriangle,
  RefreshCw,
  FileCheck,
  AlertCircle
} from 'lucide-react';

// Client-side Zod validation schema
const FileUploadSchema = z.object({
  file: z
    .custom<File>((f) => f instanceof File, 'Please select a file to submit.')
    .refine((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'), {
      message: 'Validation error: Only PDF files (.pdf) are permitted.'
    })
    .refine((f) => f.size <= 5 * 1024 * 1024, {
      message: 'Validation error: File size must be 5 MB or less.'
    })
});

export const StudentAssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Upload modal state
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      const studentService = getStudentDataService();
      // Safe: user.uid is from the verified session, not taken from the URL
      const studentUid = user?.uid || 'demo_student_uid';
      const list = await studentService.getAssignments(studentUid);
      setAssignments(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [user]);

  const handleOpenUpload = (asg: AssignmentItem) => {
    setSelectedAssignment(asg);
    setSelectedFile(null);
    setFormError(null);
    setUploadSuccess(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const result = FileUploadSchema.safeParse({ file });
      if (!result.success) {
        setFormError(result.error.issues[0]?.message || 'Invalid file');
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
      }
    }
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !selectedFile) {
      setFormError('Please select a valid PDF file.');
      return;
    }

    const validation = FileUploadSchema.safeParse({ file: selectedFile });
    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message || 'Validation failed');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const studentService = getStudentDataService();
      const studentUid = user?.uid || 'demo_student_uid';
      const res = await studentService.submitAssignment(studentUid, selectedAssignment.id, {
        name: selectedFile.name,
        size: selectedFile.size
      });

      setUploadSuccess(res.message);
      await loadAssignments();
      setTimeout(() => {
        setSelectedAssignment(null);
        setUploadSuccess(null);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout portalTitle={isBn ? 'অ্যাসাইনমেন্ট পোর্টাল' : 'Assignments & Submissions'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">
              {isBn ? 'কোর্স অ্যাসাইনমেন্ট ও জমা বিবরণী' : 'Course Assignments & Submissions'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn
                ? 'অনলাইন পিডিএফ জমা (সর্বোচ্চ ৫ মেগাবাইট)। যাচাইকৃত টাইমস্ট্যাম্প সংরক্ষিত হবে।'
                : 'Upload digital PDF solutions (Max 5 MB). Verified submission timestamps are logged.'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#1E3A8A] bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
            {assignments.filter((a) => a.status === 'pending').length} {isBn ? 'টি বাকি' : 'Pending Tasks'}
          </span>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonLoader key={i} variant="rectangular" className="h-36 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card padding="lg" className="border-red-200 bg-red-50 text-center py-8 space-y-3">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h2 className="text-sm font-bold text-red-900">
              {isBn ? 'অ্যাসাইনমেন্ট লোড করা যায়নি' : 'Unable to load assignments'}
            </h2>
            <p className="text-xs text-red-700">{error}</p>
            <Button variant="outline" size="sm" onClick={loadAssignments} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              {isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
            </Button>
          </Card>
        )}

        {/* Assignments List */}
        {!loading && !error && (
          <div className="space-y-4">
            {assignments.length === 0 ? (
              <EmptyState
                title={isBn ? 'কোনো অ্যাসাইনমেন্ট নেই' : 'No assignments found'}
                description={isBn ? 'বর্তমানে কোনো অ্যাসাইনমেন্ট জমা দেওয়ার জন্য বাকি নেই।' : 'No tasks assigned.'}
              />
            ) : (
              assignments.map((asg) => {
                const isOverdue = new Date(asg.dueDate).getTime() < Date.now() && asg.status === 'pending';

                return (
                  <Card
                    key={asg.id}
                    padding="lg"
                    className="bg-white border-[#E2E8F0] shadow-2xs hover:border-slate-300 transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-xs text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {asg.courseCode}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{asg.courseTitle}</span>
                        </div>
                        <h2 className="text-base font-bold text-[#0F172A]">{asg.title}</h2>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{asg.description}</p>
                      </div>

                      <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                        {asg.status === 'graded' ? (
                          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5" />
                            <span>Graded: {asg.score} / {asg.maxMarks}</span>
                          </span>
                        ) : asg.status === 'submitted' ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Submitted</span>
                          </span>
                        ) : (
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                              isOverdue
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{isOverdue ? 'Overdue' : 'Pending Submission'}</span>
                          </span>
                        )}

                        <span className="text-[11px] font-mono text-slate-500">
                          Due: {new Date(asg.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Submission / Feedback Details */}
                    {asg.status !== 'pending' && (
                      <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
                        <div className="flex flex-wrap items-center justify-between text-slate-600">
                          <span className="font-semibold flex items-center gap-1.5">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Submitted file: <strong className="font-mono text-slate-800">{asg.fileName}</strong> ({asg.fileSize})</span>
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            Timestamp: {asg.submittedAt ? new Date(asg.submittedAt).toLocaleString() : 'Recorded'}
                          </span>
                        </div>
                        {asg.feedback && (
                          <p className="text-[11px] text-slate-700 pt-1 border-t border-[#E2E8F0] italic">
                            Instructor Feedback: &ldquo;{asg.feedback}&rdquo;
                          </p>
                        )}
                      </div>
                    )}

                    {/* Action */}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Max Marks: {asg.maxMarks} &bull; PDF format strictly enforced
                      </span>

                      {asg.status === 'pending' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenUpload(asg)}
                          leftIcon={<Upload className="w-3.5 h-3.5" />}
                        >
                          {isBn ? 'পিডিএফ জমা দিন' : 'Submit Solution'}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenUpload(asg)}
                          leftIcon={<Upload className="w-3.5 h-3.5" />}
                        >
                          {isBn ? 'পুনরায় জমা দিন' : 'Resubmit Solution'}
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Upload Modal with Zod Validation */}
        {selectedAssignment && (
          <Modal
            isOpen={true}
            onClose={() => setSelectedAssignment(null)}
            title={selectedAssignment.title}
            description={`Course: ${selectedAssignment.courseCode} — ${selectedAssignment.courseTitle}`}
          >
            <form onSubmit={handleSubmitAssignment} className="space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="block font-bold text-slate-700">
                  Select Assignment PDF (Max 5 MB) <span className="text-red-500">*</span>
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#CBD5E1] hover:border-[#1E3A8A] rounded-xl p-6 text-center cursor-pointer bg-[#F8FAFC] transition-colors space-y-2"
                >
                  <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                  {selectedFile ? (
                    <div>
                      <p className="font-bold text-[#0F172A]">{selectedFile.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Ready to submit
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-slate-700">Click to select PDF document</p>
                      <p className="text-[11px] text-slate-400">PDF documents only, up to 5 MB</p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-[#1E3A8A] space-y-0.5">
                <p className="font-bold">Institutional Honor Code:</p>
                <p className="text-slate-600">
                  By submitting, you certify that this assignment represents your own individual work. Submissions are checked for plagiarism.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAssignment(null)}
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting}
                  disabled={!selectedFile}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                >
                  {isBn ? 'জমা নিশ্চিত করুন' : 'Confirm & Submit'}
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAssignmentsPage;
