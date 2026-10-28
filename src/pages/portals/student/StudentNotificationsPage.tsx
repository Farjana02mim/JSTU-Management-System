import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getStudentDataService, StudentNotification } from '../../../services/student';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const StudentNotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const studentService = getStudentDataService();
      // Safe: user.uid is from the verified session, not taken from the URL
      const studentUid = user?.uid || 'demo_student_uid';
      const list = await studentService.getNotifications(studentUid);
      setNotifications(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const studentService = getStudentDataService();
      const studentUid = user?.uid || 'demo_student_uid';
      await studentService.markNotificationRead(studentUid, id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  return (
    <DashboardLayout portalTitle={isBn ? 'বিজ্ঞপ্তি ও নোটিফিকেশন' : 'Student Notifications'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">
              {isBn ? 'নোটিফিকেশন ও অ্যালার্ট' : 'Academic & Administrative Alerts'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn
                ? 'ক্লাস, অ্যাসাইনমেন্ট, পরীক্ষা এবং ফি সংক্রান্ত প্রাতিষ্ঠানিক বার্তা।'
                : 'Direct notices regarding classes, assignments, exams, and accounts.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-white border border-[#E2E8F0] text-slate-600 hover:bg-slate-50'
              }`}
            >
              {isBn ? 'সকল' : 'All'} ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === 'unread'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-white border border-[#E2E8F0] text-slate-600 hover:bg-slate-50'
              }`}
            >
              {isBn ? 'অপঠিত' : 'Unread'} ({notifications.filter((n) => !n.read).length})
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonLoader key={i} variant="rectangular" className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <Card padding="lg" className="border-red-200 bg-red-50 text-center py-8 space-y-3">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h2 className="text-sm font-bold text-red-900">{isBn ? 'নোটিফিকেশন লোড ব্যর্থ' : 'Unable to load notifications'}</h2>
            <p className="text-xs text-red-700">{error}</p>
            <Button variant="outline" size="sm" onClick={loadNotifications} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              {isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
            </Button>
          </Card>
        )}

        {/* Notifications List */}
        {!loading && !error && (
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <EmptyState
                title={isBn ? 'কোনো নোটিফিকেশন নেই' : 'No notifications'}
                description={isBn ? 'আপনার সব নোটিফিকেশন পড়া সম্পন্ন হয়েছে।' : 'You have caught up with all institutional alerts.'}
              />
            ) : (
              filtered.map((item) => (
                <Card
                  key={item.id}
                  padding="md"
                  className={`border transition-all flex flex-wrap items-center justify-between gap-3 ${
                    item.read
                      ? 'bg-white border-[#E2E8F0] shadow-2xs'
                      : 'bg-blue-50/40 border-blue-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        item.category === 'fee'
                          ? 'bg-amber-100 text-amber-700'
                          : item.category === 'exam'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-[#1E3A8A]'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                          {item.category}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-[#0F172A]">
                          {isBn ? item.titleBn : item.title}
                        </h3>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isBn ? item.messageBn : item.message}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.link && (
                      <Link
                        to={item.link}
                        className="px-2.5 py-1 text-xs font-semibold text-[#1E3A8A] hover:bg-blue-100/60 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <span>{isBn ? 'দেখুন' : 'View'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    {!item.read && (
                      <button
                        onClick={() => handleMarkAsRead(item.id)}
                        className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        {isBn ? 'পঠিত চিহ্নিত করুন' : 'Mark as Read'}
                      </button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentNotificationsPage;
