import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Bell
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

const announcementSchema = z.object({
  courseCode: z.string().min(1, 'Course selection is required'),
  title: z.string().min(4, 'Title must be at least 4 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters')
});

export const TeacherAnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<TeacherCourseSummary[]>([]);
  const [announcementsByCourse, setAnnouncementsByCourse] = useState<{ courseCode: string; courseTitle: string; announcements: any[] }[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [targetCourse, setTargetCourse] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      const [courseList, anns] = await Promise.all([
        service.getAssignedCourses(teacherEmail),
        service.getAnnouncements(teacherEmail)
      ]);
      setCourses(courseList);
      setAnnouncementsByCourse(anns);
      if (courseList.length > 0 && !targetCourse) {
        setTargetCourse(courseList[0].code);
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

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = announcementSchema.safeParse({
      courseCode: targetCourse,
      title,
      content
    });

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    try {
      setPublishing(true);
      const service = getTeacherDataService();
      const teacherEmail = user?.email || 'teacher.demo@jstu.ac.bd';
      await service.publishAnnouncement(teacherEmail, {
        courseCode: targetCourse,
        title,
        content
      });

      setModalOpen(false);
      setTitle('');
      setContent('');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to publish announcement.');
    } finally {
      setPublishing(false);
    }
  };

  const filteredGroups = announcementsByCourse.filter((g) =>
    selectedFilter === 'all' ? true : g.courseCode === selectedFilter
  );

  return (
    <DashboardLayout portalTitle={isBn ? 'বিজ্ঞপ্তি প্রকাশ' : 'Course Announcements'}>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#1E3A8A]" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                  {isBn ? 'কোর্স নোটিশ ও দিকনির্দেশনা প্রকাশ' : 'Course Announcements & Direct Broadcasts'}
                </h1>
              </div>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'আপনার নির্ধারিত কোর্সের শিক্ষার্থীদের পরীক্ষার প্রস্তুতি, কুইজ তারিখ বা বিশেষ ক্লাসের নোটিশ দিন। এটি সাথে সাথে তাদের শিক্ষার্থী ড্যাশবোর্ডে প্রদর্শিত হবে।'
                  : 'Broadcast updates regarding midterm schedules, quizzes, or lab timing. Announcements reflect instantly in student course views.'}
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setModalOpen(true)}
              className="text-xs font-semibold shrink-0"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              {isBn ? 'বিজ্ঞপ্তি লিখুন' : 'Post Announcement'}
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

        {/* Announcements List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <SkeletonLoader key={i} variant="rectangular" className="h-44 rounded-xl" />
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <EmptyState
            title={isBn ? 'কোনো বিজ্ঞপ্তি পাওয়া যায়নি' : 'No Announcements Found'}
            description={isBn ? 'শিক্ষার্থীদের জন্য প্রথম নোটিশ প্রকাশ করুন।' : 'Broadcast your first announcement.'}
            actionLabel={isBn ? 'বিজ্ঞপ্তি দিন' : 'Post Announcement'}
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
                  <span className="text-xs text-slate-400">({group.announcements.length} posted)</span>
                </div>

                {group.announcements.length === 0 ? (
                  <Card padding="md" className="text-center py-6 text-xs text-slate-400 border-[#E2E8F0] shadow-2xs">
                    {isBn ? 'এই কোর্সে এখনও কোনো নোটিশ প্রকাশ করা হয়নি।' : 'No announcements published for this course yet.'}
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {group.announcements.map((ann: any) => (
                      <Card key={ann.id} padding="md" className="border-[#E2E8F0] shadow-2xs space-y-2 hover:shadow-xs transition-shadow">
                        <div className="flex items-center justify-between text-xs">
                          <h4 className="font-bold text-[#0F172A] text-sm">{ann.title}</h4>
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{ann.date}</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-100">
                          <span>Author: {ann.author}</span>
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {isBn ? 'শিক্ষার্থী পোর্টালে দৃশ্যমান' : 'Live to Students'}
                          </span>
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

      {/* Modal: Publish Announcement */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isBn ? 'কোর্স নোটিশ প্রকাশ করুন' : 'Broadcast Announcement'}
        description={isBn ? 'এই নোটিশটি সংশ্লিষ্ট কোর্সের সকল শিক্ষার্থীর নোটিফিকেশনে পৌঁছে যাবে।' : 'This notice will trigger instant notifications in enrolled student portals.'}
      >
        <form onSubmit={handlePublish} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'কোর্স নির্বাচন' : 'Select Target Course'}
            </label>
            <select
              value={targetCourse}
              onChange={(e) => setTargetCourse(e.target.value)}
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
              {isBn ? 'বিজ্ঞপ্তির শিরোনাম' : 'Notice Title'}
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Schedule for Midterm Examination & Syllabus"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'বিস্তারিত বার্তা' : 'Announcement Message'}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Detailed instructions for students..."
              className="w-full text-xs p-2.5 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] bg-white resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              {isBn ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={publishing}>
              {publishing ? (isBn ? 'প্রকাশ হচ্ছে...' : 'Publishing...') : (isBn ? 'বিজ্ঞপ্তি দিন' : 'Broadcast Now')}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
