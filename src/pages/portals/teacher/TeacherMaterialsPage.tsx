import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  Plus,
  Trash2,
  Download,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { z } from 'zod';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  getTeacherDataService,
  TeacherCourseSummary
} from '../../../services/teacher';

const materialSchema = z.object({
  courseCode: z.string().min(1, 'Course is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  fileType: z.enum(['pdf', 'slide', 'doc']),
  fileSize: z.string().nonempty('File size is required')
});

export const TeacherMaterialsPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<TeacherCourseSummary[]>([]);
  const [materialsByCourse, setMaterialsByCourse] = useState<{ courseCode: string; courseTitle: string; materials: any[] }[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState('');
  const [materialTitle, setMaterialTitle] = useState('');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      const [courseList, mats] = await Promise.all([
        service.getAssignedCourses(teacherEmail),
        service.getMaterials(teacherEmail)
      ]);
      setCourses(courseList);
      setMaterialsByCourse(mats);
      if (courseList.length > 0 && !selectedCourseCode) {
        setSelectedCourseCode(courseList[0].code);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF documents (.pdf) are permitted.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the institutional 10 MB limit.');
      return;
    }

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setFileInfo({ name: file.name, size: `${sizeMb} MB` });
    if (!materialTitle) {
      setMaterialTitle(file.name.replace(/\.pdf$/i, ''));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = materialSchema.safeParse({
      courseCode: selectedCourseCode,
      title: materialTitle,
      fileType: 'pdf',
      fileSize: fileInfo?.size || '1.8 MB'
    });

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    if (!fileInfo) {
      setError('Please select a valid PDF file.');
      return;
    }

    try {
      setUploading(true);
      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      await service.addMaterial(teacherEmail, {
        courseCode: selectedCourseCode,
        title: materialTitle,
        fileType: 'pdf',
        fileSize: fileInfo.size,
        fileName: fileInfo.name
      });

      setModalOpen(false);
      setMaterialTitle('');
      setFileInfo(null);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to add material.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (courseCode: string, materialId: string) => {
    if (!confirm(isBn ? 'আপনি কি নিশ্চিত যে এই ম্যাটেরিয়ালটি মুছে ফেলতে চান?' : 'Are you sure you want to remove this material?')) {
      return;
    }
    try {
      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      await service.deleteMaterial(teacherEmail, courseCode, materialId);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete material.');
    }
  };

  const filteredGroups = materialsByCourse.filter((g) =>
    selectedFilter === 'all' ? true : g.courseCode === selectedFilter
  );

  return (
    <DashboardLayout portalTitle={isBn ? 'কোর্স ম্যাটেরিয়ালস' : 'Course Materials'}>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#1E3A8A]" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                  {isBn ? 'কোর্স রিসোর্স ও ম্যাটেরিয়াল রিপোজিটরি' : 'Course Materials & Handouts Repository'}
                </h1>
              </div>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'আপনার নির্ধারিত কোর্সের জন্য লেকচার নোটস, স্লাইড এবং ল্যাব ম্যানুয়াল আপলোড করুন। ফাইল যুক্ত হলে শিক্ষার্থীদের কাছে তাৎক্ষণিক নোটিফিকেশন পৌঁছে যায়।'
                  : 'Upload syllabus handouts, slide decks and lab manuals. Files added here are instantly available to students in their course views.'}
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setModalOpen(true)}
              className="text-xs font-semibold shrink-0"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              {isBn ? 'ম্যাটেরিয়াল আপলোড' : 'Add Material'}
            </Button>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-[#F1F5F9] text-xs">
            <span className="text-slate-500 font-semibold">{isBn ? 'কোর্স ফিল্টার:' : 'Filter by Course:'}</span>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="text-xs p-1.5 border border-[#CBD5E1] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] font-semibold"
            >
              <option value="all">{isBn ? 'সকল নির্ধারিত কোর্স' : 'All Assigned Courses'}</option>
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Materials by Course Sections */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <SkeletonLoader key={i} variant="rectangular" className="h-44 rounded-xl" />
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <EmptyState
            title={isBn ? 'কোনো ম্যাটেরিয়াল নেই' : 'No Materials Found'}
            description={isBn ? 'শিক্ষার্থীদের জন্য প্রথম হ্যান্ডআউট বা স্লাইড আপলোড করুন।' : 'Upload lecture notes or manuals to get started.'}
            actionLabel={isBn ? 'আপলোড করুন' : 'Upload Material'}
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <div className="space-y-6">
            {filteredGroups.map((group) => (
              <div key={group.courseCode} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-blue-50 text-[#1E3A8A] rounded border border-blue-200">
                    {group.courseCode}
                  </span>
                  <h3 className="text-sm font-bold text-[#0F172A]">{group.courseTitle}</h3>
                  <span className="text-xs text-slate-400">({group.materials.length} files)</span>
                </div>

                {group.materials.length === 0 ? (
                  <Card padding="md" className="text-center py-6 text-xs text-slate-400 border-[#E2E8F0] shadow-2xs">
                    {isBn ? 'এই কোর্সে এখনও কোনো ফাইল আপলোড করা হয়নি।' : 'No files uploaded for this course yet.'}
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.materials.map((mat: any) => (
                      <Card key={mat.id} padding="md" className="border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <div className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-200 shrink-0 mt-0.5">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-[#0F172A] line-clamp-2 leading-snug">
                                {mat.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 flex items-center gap-2">
                                <span>{mat.fileSize}</span>
                                <span>&bull;</span>
                                <span>{mat.uploadDate}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => alert(`Simulated download for: ${mat.title}`)}
                              className="p-1 text-slate-400 hover:text-[#1E3A8A] rounded cursor-pointer"
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(group.courseCode, mat.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Add Material */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isBn ? 'লেকচার ম্যাটেরিয়াল আপলোড' : 'Upload Lecture Material'}
        description={isBn ? 'শিক্ষার্থীদের অধ্যয়নের জন্য পিডিএফ ফাইল আপলোড করুন (সর্বোচ্চ ১০ মেগাবাইট)।' : 'Upload PDF handouts or slides (max 10 MB per file).'}
      >
        <form onSubmit={handleUpload} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'কোর্স নির্বাচন' : 'Select Course'}
            </label>
            <select
              value={selectedCourseCode}
              onChange={(e) => setSelectedCourseCode(e.target.value)}
              className="w-full text-xs p-2.5 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] bg-white font-semibold"
              required
            >
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}: {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'ফাইল নির্বাচন করুন (কেবলমাত্র পিডিএফ)' : 'Select PDF File (.pdf only)'}
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#CBD5E1] file:text-xs file:font-semibold file:bg-white file:text-[#1E3A8A] hover:file:bg-slate-50 cursor-pointer"
            />
            {fileInfo && (
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                Selected: {fileInfo.name} ({fileInfo.size})
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'ম্যাটেরিয়ালের শিরোনাম' : 'Material Title'}
            </label>
            <Input
              type="text"
              value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
              placeholder="e.g. Chapter 3: LR Parsers & Conflict Resolution"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              {isBn ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={uploading}>
              {uploading ? (isBn ? 'আপলোড হচ্ছে...' : 'Uploading...') : (isBn ? 'আপলোড করুন' : 'Confirm Upload')}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
