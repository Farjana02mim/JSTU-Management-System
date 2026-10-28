import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../../services/shared/sharedDataStore';
import {
  ContentSectionKey,
  ContentStatus,
  ManagedNoticeItem,
  ManagedNewsItem,
  ManagedEventItem,
  ManagedGalleryItem,
  ManagedDownloadItem,
  ManagedDepartmentItem,
  ManagedFacultyItem,
  ManagedVcMessageItem,
  ManagedStaticPageItem
} from '../../../types/contentManagement';
import { ContentItemCard } from '../../../components/admin/content/ContentItemCard';
import { ContentEditorModal } from '../../../components/admin/content/ContentEditorModal';
import { ContentPreviewModal } from '../../../components/admin/content/ContentPreviewModal';
import { ContentAuditTrailTab } from '../../../components/admin/content/ContentAuditTrailTab';
import { SafeMarkdown } from '../../../components/common/SafeMarkdown';
import {
  Bell,
  Newspaper,
  Calendar,
  Image as ImageIcon,
  Download,
  Building2,
  Users,
  Quote,
  FileText,
  History,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Archive,
  ShieldCheck,
  ShieldAlert,
  Lock,
  ExternalLink,
  Sparkles,
  Filter,
  RefreshCw
} from 'lucide-react';

export const ContentManagementPage: React.FC = () => {
  const { user, claims, role, profile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const isSuperAdmin = role === 'super_admin';
  const isAdmin = role === 'admin';
  const isChairman = role === 'dept_chairman';

  // Role permissions
  const canPublish = isSuperAdmin || isAdmin;
  const userDept = (claims?.departmentId || claims?.deptId || profile?.departmentId || 'CSE').toUpperCase();

  // Active section tab
  const [activeTab, setActiveTab] = useState<ContentSectionKey | 'audit_trail'>('notices');

  // Search & Filter within active section
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ContentStatus>('all');

  // Modals state
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<any | null>(null);
  const [selectedItemForPreview, setSelectedItemForPreview] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // Trigger state refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const store = SharedDataStoreManager.getInstance().getStore();

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Check if current user can edit a specific item
  const canEditItem = (section: ContentSectionKey, item: any): boolean => {
    if (canPublish) return true; // Admins can edit everything
    if (isChairman) {
      if (section === 'departments') {
        const itemCode = (item.code || item.id || '').toUpperCase();
        return itemCode === userDept;
      }
      if (section === 'faculty') {
        const itemDept = (item.departmentId || '').toUpperCase();
        return itemDept === userDept;
      }
      // Chairman cannot edit global sections
      return false;
    }
    return false;
  };

  // Check if current user can create an item in this section
  const canCreateInSection = (section: ContentSectionKey): boolean => {
    if (canPublish) return true;
    if (isChairman) {
      // Chairman can add faculty to their department
      return section === 'faculty';
    }
    return false;
  };

  // Active items list based on active tab and filtering
  const currentSectionData = useMemo(() => {
    let rawList: any[] = [];
    switch (activeTab) {
      case 'notices':
        rawList = store.managedNotices || [];
        break;
      case 'news':
        rawList = store.managedNews || [];
        break;
      case 'events':
        rawList = store.managedEvents || [];
        break;
      case 'gallery':
        rawList = store.managedGallery || [];
        break;
      case 'downloads':
        rawList = store.managedDownloads || [];
        break;
      case 'departments':
        rawList = store.managedDepartments || [];
        break;
      case 'faculty':
        rawList = store.managedFaculty || [];
        break;
      case 'static_pages':
        rawList = store.managedStaticPages || [];
        break;
      default:
        rawList = [];
    }

    return rawList.filter((item) => {
      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const title = (item.title || item.name || item.code || '').toLowerCase();
        const titleBn = (item.titleBn || item.nameBn || '').toLowerCase();
        const desc = (item.summary || item.body || item.overview || '').toLowerCase();
        if (!title.includes(q) && !titleBn.includes(q) && !desc.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [activeTab, statusFilter, searchQuery, store, refreshTrigger]);

  const handleOpenCreate = () => {
    setSelectedItemForEdit(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setSelectedItemForEdit(item);
    setEditorOpen(true);
  };

  const handleOpenPreview = (item: any) => {
    setSelectedItemForPreview(item);
    setPreviewOpen(true);
  };

  const handleSaveItem = (savedItem: any) => {
    if (activeTab === 'audit_trail') return;
    const actor = {
      uid: user?.uid || 'admin_uid',
      name: profile?.fullName || user?.displayName || 'CMS Administrator',
      email: user?.email || 'admin@jstu.ac.bd',
      role: role || 'admin',
      department: userDept
    };

    SharedDataStoreManager.getInstance().saveManagedItem(activeTab, savedItem, actor);
    setRefreshTrigger((prev) => prev + 1);
    showToast(`Successfully saved "${savedItem.title || savedItem.name || 'item'}"!`);
  };

  const handleQuickStatusChange = (item: any, newStatus: ContentStatus) => {
    if (activeTab === 'audit_trail') return;
    if (!canPublish) {
      showToast('Publishing requires Admin or Super Admin authorization.', 'info');
      return;
    }

    const actor = {
      uid: user?.uid || 'admin_uid',
      name: profile?.fullName || user?.displayName || 'CMS Administrator',
      email: user?.email || 'admin@jstu.ac.bd',
      role: role || 'admin',
      department: userDept
    };

    const updated = { ...item, status: newStatus };
    SharedDataStoreManager.getInstance().saveManagedItem(activeTab, updated, actor, newStatus === 'published' ? 'PUBLISHED' : 'ARCHIVED');
    setRefreshTrigger((prev) => prev + 1);
    showToast(`Status updated to "${newStatus.toUpperCase()}"!`);
  };

  const handleDeleteItem = (item: any) => {
    if (activeTab === 'audit_trail') return;
    if (!confirm(`Are you sure you want to delete "${item.title || item.name || 'this item'}"?`)) {
      return;
    }

    const actor = {
      uid: user?.uid || 'admin_uid',
      name: profile?.fullName || user?.displayName || 'CMS Administrator',
      email: user?.email || 'admin@jstu.ac.bd',
      role: role || 'admin',
      department: userDept
    };

    SharedDataStoreManager.getInstance().deleteManagedItem(activeTab, item.id, actor);
    setRefreshTrigger((prev) => prev + 1);
    showToast(`Deleted "${item.title || item.name || 'item'}" successfully.`);
  };

  // Counts for each tab badge
  const tabCounts = {
    notices: store.managedNotices?.length || 0,
    news: store.managedNews?.length || 0,
    events: store.managedEvents?.length || 0,
    gallery: store.managedGallery?.length || 0,
    downloads: store.managedDownloads?.length || 0,
    departments: store.managedDepartments?.length || 0,
    faculty: store.managedFaculty?.length || 0,
    static_pages: store.managedStaticPages?.length || 0,
    audit_trail: store.contentAuditTrail?.length || 0
  };

  return (
    <DashboardLayout portalTitle={isBn ? 'ওয়েবসাইট কন্টেন্ট ম্যানেজমেন্ট' : 'Website Content Management'}>
      <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 py-4">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{toastMessage.text}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  {isSuperAdmin
                    ? 'Super Administrator (Full Publishing Access)'
                    : isAdmin
                    ? 'Admin (Content Publishing Access)'
                    : `Department Head (${userDept} Scoped Access)`}
                </span>
                <span className="text-xs text-emerald-200/80">Paperless Public Website Control</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {isBn ? 'ওয়েবসাইট কন্টেন্ট ম্যানেজমেন্ট সিস্টেম' : 'University Content Management Area'}
              </h1>
              <p className="text-emerald-100/90 text-xs sm:text-sm max-w-3xl leading-relaxed">
                Edit notices, news, events, media gallery, official downloads, academic departments, faculty profiles, Vice Chancellor address, and static institutional pages without touching code.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
              <Link
                to="/"
                target="_blank"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors border border-white/20 flex items-center gap-1.5 shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Public Site
              </Link>

              {activeTab !== 'audit_trail' && activeTab !== 'vc_message' && canCreateInSection(activeTab) && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleOpenCreate}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold gap-1.5 shadow-md text-xs"
                >
                  <Plus className="w-4 h-4" /> Create {activeTab.slice(0, -1)}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Chairman Scope Alert Banner */}
        {isChairman && (
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-start gap-3 text-xs text-indigo-900 shadow-2xs">
            <Building2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-indigo-950 mb-0.5">
                Department Scoped Access: {userDept} Department
              </p>
              <p className="text-indigo-800 leading-relaxed">
                As Department Chairman, you have delegated authority to edit your department's academic overview and faculty profiles. University-wide publishing and central sections (Notices, News, VC Message, Downloads) are managed by Central Administration. Any updates you submit are safely preserved as Draft for review.
              </p>
            </div>
          </div>
        )}

        {/* Section Navigation Tabs */}
        <div className="border-b border-slate-200 overflow-x-auto scrollbar-none">
          <nav className="flex space-x-1 sm:space-x-2 min-w-max pb-1">
            <button
              onClick={() => setActiveTab('notices')}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'notices'
                  ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              Notices ({tabCounts.notices})
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'news'
                  ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              News ({tabCounts.news})
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'events'
                  ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Events ({tabCounts.events})
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'gallery'
                  ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Gallery ({tabCounts.gallery})
            </button>

            <button
              onClick={() => setActiveTab('downloads')}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'downloads'
                  ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Downloads ({tabCounts.downloads})
            </button>

            <button
              onClick={() => setActiveTab('departments')}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'departments'
                  ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Departments ({tabCounts.departments})
            </button>

            <button
              onClick={() => setActiveTab('faculty')}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'faculty'
                  ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Faculty Profiles ({tabCounts.faculty})
            </button>

            <button
              onClick={() => setActiveTab('vc_message')}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'vc_message'
                  ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Quote className="w-3.5 h-3.5" />
              VC Message
            </button>

            <button
              onClick={() => setActiveTab('static_pages')}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'static_pages'
                  ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Static Pages ({tabCounts.static_pages})
            </button>

            <button
              onClick={() => setActiveTab('audit_trail')}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'audit_trail'
                  ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Audit Trail ({tabCounts.audit_trail})
            </button>
          </nav>
        </div>

        {/* Tab 10: Audit Trail Tab View */}
        {activeTab === 'audit_trail' ? (
          <ContentAuditTrailTab entries={store.contentAuditTrail || []} />
        ) : activeTab === 'vc_message' ? (
          /* Tab 8: VC Message View */
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Status: {store.managedVcMessage?.status.toUpperCase() || 'PUBLISHED'}
                  </span>
                  <span className="text-xs text-slate-400">
                    Updated: {new Date(store.managedVcMessage?.updatedAt || '').toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {store.managedVcMessage?.title || 'Message from the Vice Chancellor'}
                </h2>
                <p className="text-xs text-slate-500">
                  Official welcome address displayed on the university About page and institutional portal.
                </p>
              </div>

              {canPublish && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setSelectedItemForEdit(store.managedVcMessage);
                    setEditorOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
                >
                  Edit VC Message
                </Button>
              )}
            </div>

            {/* VC Message Card Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-slate-100 pb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-emerald-600 shrink-0 shadow-sm">
                  <img
                    src={store.managedVcMessage?.avatarUrl}
                    alt={store.managedVcMessage?.vcName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">{store.managedVcMessage?.vcName}</h3>
                  <p className="text-xs font-semibold text-emerald-700">{store.managedVcMessage?.designation}</p>
                  <p className="text-xs text-slate-500">{store.managedVcMessage?.officeLocation}</p>
                  <p className="text-xs text-slate-400 font-mono">{store.managedVcMessage?.email}</p>
                </div>
              </div>

              {store.managedVcMessage?.quote && (
                <div className="p-4 bg-emerald-50/70 border-l-4 border-emerald-600 rounded-r-lg italic text-slate-700 text-sm">
                  "{store.managedVcMessage.quote}"
                </div>
              )}

              <div className="prose prose-slate max-w-none text-sm text-slate-700">
                <SafeMarkdown content={store.managedVcMessage?.speech || ''} />
              </div>
            </div>
          </div>
        ) : (
          /* Standard Section Tab View */
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <Card className="p-4 bg-slate-50/70 border-slate-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${activeTab.replace('_', ' ')}...`}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
                  />
                </div>

                {/* Status Filter Buttons */}
                <div className="flex items-center gap-1.5 self-start sm:self-center">
                  <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Status:
                  </span>
                  {(['all', 'published', 'draft', 'archived'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        statusFilter === st
                          ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* List of Content Items */}
            {currentSectionData.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-semibold text-slate-700 text-sm">
                  No {activeTab.replace('_', ' ')} items found
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No records match the current search or status filter criteria.'
                    : `No content items have been added to ${activeTab.replace('_', ' ')} yet.`}
                </p>
                {canCreateInSection(activeTab) && (
                  <Button size="sm" variant="primary" onClick={handleOpenCreate} className="text-xs">
                    <Plus className="w-3.5 h-3.5" /> Create First Item
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {currentSectionData.map((item) => (
                  <ContentItemCard
                    key={item.id}
                    item={item}
                    section={activeTab}
                    canPublish={canPublish}
                    canEdit={canEditItem(activeTab, item)}
                    onEdit={handleOpenEdit}
                    onPreview={handleOpenPreview}
                    onQuickStatusChange={(it, st) => handleQuickStatusChange(it, st)}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Editor Modal */}
        {editorOpen && (
          <ContentEditorModal
            isOpen={editorOpen}
            onClose={() => setEditorOpen(false)}
            section={activeTab === 'audit_trail' ? 'notices' : activeTab}
            initialItem={selectedItemForEdit}
            canPublish={canPublish}
            userRole={role || 'admin'}
            userDepartment={userDept}
            onSave={handleSaveItem}
          />
        )}

        {/* Preview Modal */}
        {previewOpen && (
          <ContentPreviewModal
            isOpen={previewOpen}
            onClose={() => setPreviewOpen(false)}
            section={activeTab === 'audit_trail' ? 'notices' : activeTab}
            item={selectedItemForPreview}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
