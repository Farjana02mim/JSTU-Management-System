import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { ImageUploadWithValidation } from '../../common/ImageUploadWithValidation';
import { SafeMarkdown } from '../../common/SafeMarkdown';
import {
  Save,
  Eye,
  Edit3,
  Columns,
  Bold,
  Italic,
  Heading,
  List,
  Quote,
  Code,
  Table,
  Link,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';
import { ContentStatus, ContentSectionKey } from '../../../types/contentManagement';

interface ContentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: ContentSectionKey;
  initialItem: any | null;
  canPublish: boolean;
  userRole: string;
  userDepartment?: string;
  onSave: (item: any) => void;
}

export const ContentEditorModal: React.FC<ContentEditorModalProps> = ({
  isOpen,
  onClose,
  section,
  initialItem,
  canPublish,
  userRole,
  userDepartment,
  onSave
}) => {
  const isNew = !initialItem;

  // Form State
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<ContentStatus>('draft');
  const [imageUrl, setImageUrl] = useState('');
  const [body, setBody] = useState('');
  const [bodyBn, setBodyBn] = useState('');
  const [summary, setSummary] = useState('');
  const [summaryBn, setSummaryBn] = useState('');

  // Section specific fields
  const [department, setDepartment] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [author, setAuthor] = useState('');
  const [album, setAlbum] = useState('');
  const [fileType, setFileType] = useState<'PDF' | 'DOCX' | 'ZIP'>('PDF');
  const [fileSize, setFileSize] = useState('1.5 MB');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [room, setRoom] = useState('');
  const [slug, setSlug] = useState('');
  const [vcName, setVcName] = useState('');
  const [quote, setQuote] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  // View mode in editor: 'write' | 'preview' | 'split'
  const [viewMode, setViewMode] = useState<'write' | 'preview' | 'split'>('write');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync state when modal opens or item changes
  useEffect(() => {
    if (initialItem) {
      setTitle(initialItem.title || initialItem.name || initialItem.code || '');
      setTitleBn(initialItem.titleBn || initialItem.nameBn || '');
      setCategory(initialItem.category || '');
      setStatus(initialItem.status || 'draft');
      setImageUrl(initialItem.imageUrl || initialItem.avatarUrl || initialItem.bannerUrl || '');
      setBody(
        initialItem.body ||
          initialItem.content ||
          initialItem.description ||
          initialItem.speech ||
          initialItem.overview ||
          initialItem.bio ||
          ''
      );
      setBodyBn(
        initialItem.bodyBn ||
          initialItem.contentBn ||
          initialItem.descriptionBn ||
          initialItem.speechBn ||
          initialItem.overviewBn ||
          initialItem.bioBn ||
          ''
      );
      setSummary(initialItem.summary || initialItem.quote || '');
      setSummaryBn(initialItem.summaryBn || initialItem.quoteBn || '');

      setDepartment(initialItem.department || '');
      setDepartmentId(initialItem.departmentId || initialItem.code || userDepartment || 'CSE');
      setReferenceNumber(initialItem.referenceNumber || initialItem.refNumber || '');
      setPublishDate(initialItem.publishDate || initialItem.publishedDate || new Date().toISOString().split('T')[0]);
      setDate(initialItem.date || new Date().toISOString().split('T')[0]);
      setTime(initialItem.time || '10:00 AM');
      setVenue(initialItem.venue || 'Campus Auditorium');
      setAuthor(initialItem.author || initialItem.organizer || '');
      setAlbum(initialItem.album || 'Campus Life');
      setFileType(initialItem.fileType || 'PDF');
      setFileSize(initialItem.fileSize || '1.2 MB');
      setDesignation(initialItem.designation || '');
      setEmail(initialItem.email || initialItem.contactEmail || '');
      setPhone(initialItem.phone || initialItem.contactPhone || '');
      setRoom(initialItem.room || '');
      setSlug(initialItem.slug || '');
      setVcName(initialItem.vcName || '');
      setQuote(initialItem.quote || '');
      setIsImportant(Boolean(initialItem.isImportant));
    } else {
      // Defaults for new item
      setTitle('');
      setTitleBn('');
      setCategory(
        section === 'notices'
          ? 'Academic'
          : section === 'news'
          ? 'Campus Life'
          : section === 'events'
          ? 'Seminar'
          : section === 'downloads'
          ? 'academic_forms'
          : 'General'
      );
      setStatus('draft');
      setImageUrl('');
      setBody('');
      setBodyBn('');
      setSummary('');
      setSummaryBn('');
      setDepartment(userDepartment || 'CSE');
      setDepartmentId(userDepartment || 'CSE');
      setReferenceNumber(`JSTU/ADM/2026/${Math.floor(100 + Math.random() * 900)}`);
      const today = new Date().toISOString().split('T')[0];
      setPublishDate(today);
      setDate(today);
      setTime('10:00 AM');
      setVenue('Central Auditorium');
      setAuthor(userDepartment ? `${userDepartment} Department` : 'University Administration');
      setAlbum('Official Gallery');
      setFileType('PDF');
      setFileSize('1.5 MB');
      setDesignation('Assistant Professor');
      setEmail(`${(userDepartment || 'cse').toLowerCase()}@jstu.ac.bd`);
      setPhone('+880 29977 12350');
      setRoom('Room 401');
      setSlug(`page-${Date.now()}`);
      setVcName('Prof. Dr. Vice Chancellor');
      setQuote('');
      setIsImportant(false);
    }
    setValidationError(null);
  }, [initialItem, section, isOpen, userDepartment]);

  // Markdown Toolbar helper to insert markdown snippets
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('cms-markdown-body') as HTMLTextAreaElement | null;
    if (!textarea) {
      setBody((prev) => prev + before + after);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = body.substring(start, end);
    const replacement = before + (selected || 'text') + after;
    const newBody = body.substring(0, start) + replacement + body.substring(end);
    setBody(newBody);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + replacement.length - after.length);
    }, 50);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError('Title / Name is required.');
      return;
    }

    // Role security check: Only admin and super_admin can publish
    let finalStatus = status;
    if (!canPublish && status === 'published') {
      finalStatus = 'draft';
    }

    const payload: any = {
      ...(initialItem || {}),
      id: initialItem?.id || `${section.slice(0, 3)}-${Date.now()}`,
      status: finalStatus,
      updatedAt: new Date().toISOString()
    };

    // Base attributes
    if (section === 'departments') {
      payload.name = title;
      payload.nameBn = titleBn;
      payload.overview = body;
      payload.overviewBn = bodyBn;
      payload.bannerUrl = imageUrl;
      payload.contactEmail = email;
      payload.contactPhone = phone;
    } else if (section === 'faculty') {
      payload.name = title;
      payload.nameBn = titleBn;
      payload.designation = designation;
      payload.departmentId = departmentId.toLowerCase();
      payload.email = email;
      payload.phone = phone;
      payload.room = room;
      payload.avatarUrl = imageUrl;
      payload.bio = body;
      payload.bioBn = bodyBn;
    } else if (section === 'vc_message') {
      payload.title = title;
      payload.titleBn = titleBn;
      payload.vcName = vcName || title;
      payload.speech = body;
      payload.speechBn = bodyBn;
      payload.avatarUrl = imageUrl;
      payload.quote = quote || summary;
      payload.email = email;
      payload.phone = phone;
    } else if (section === 'notices') {
      payload.title = title;
      payload.titleBn = titleBn;
      payload.category = category;
      payload.publishDate = publishDate;
      payload.publishDateBn = publishDate;
      payload.summary = summary;
      payload.summaryBn = summaryBn;
      payload.body = body;
      payload.bodyBn = bodyBn;
      payload.department = department;
      payload.referenceNumber = referenceNumber;
      payload.isImportant = isImportant;
      if (imageUrl) payload.attachmentUrl = imageUrl;
    } else if (section === 'news') {
      payload.title = title;
      payload.titleBn = titleBn;
      payload.category = category;
      payload.date = date;
      payload.dateBn = date;
      payload.summary = summary;
      payload.summaryBn = summaryBn;
      payload.content = body;
      payload.contentBn = bodyBn;
      payload.imageUrl = imageUrl;
      payload.author = author;
      payload.readTime = '3 min read';
      payload.tags = ['Campus', category];
    } else if (section === 'events') {
      payload.title = title;
      payload.titleBn = titleBn;
      payload.category = category;
      payload.date = date;
      payload.dateBn = date;
      payload.time = time;
      payload.venue = venue;
      payload.organizer = author;
      payload.summary = summary;
      payload.description = body;
      payload.descriptionBn = bodyBn;
      payload.imageUrl = imageUrl;
    } else if (section === 'gallery') {
      payload.title = title;
      payload.titleBn = titleBn;
      payload.category = category;
      payload.album = album;
      payload.imageUrl = imageUrl;
      payload.caption = body;
      payload.captionBn = bodyBn;
      payload.date = date;
    } else if (section === 'downloads') {
      payload.title = title;
      payload.titleBn = titleBn;
      payload.category = category;
      payload.fileType = fileType;
      payload.fileSize = fileSize;
      payload.publishedDate = publishDate;
      payload.refNumber = referenceNumber;
      payload.description = body;
      payload.descriptionBn = bodyBn;
    } else if (section === 'static_pages') {
      payload.title = title;
      payload.titleBn = titleBn;
      payload.slug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      payload.category = category || 'About';
      payload.content = body;
      payload.contentBn = bodyBn;
      payload.bannerUrl = imageUrl;
    }

    onSave(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isNew ? 'Create New' : 'Edit'} ${section.replace('_', ' ').toUpperCase()}`}
      size="xl"
    >
      <form onSubmit={handleSave} className="space-y-5 max-h-[78vh] overflow-y-auto pr-1">
        {/* Role permission info banner */}
        {!canPublish && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-800">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Department Head Delegation:</span> You can edit and submit content for your department ({userDepartment || 'CSE'}). Items are saved as <strong>Draft</strong> and will be reviewed and published by University Admin.
            </div>
          </div>
        )}

        {validationError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Top Meta: Titles and Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Title / Heading (English) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual International Science Olympiad 2026"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Publishing Status <span className="text-rose-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ContentStatus)}
              className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-emerald-500 outline-none font-medium"
            >
              <option value="draft">Draft (Private / Work in progress)</option>
              <option value="published" disabled={!canPublish}>
                {canPublish ? 'Published (Live on Public Website)' : 'Published (Restricted to Admin)'}
              </option>
              <option value="archived">Archived (Delisted from Public)</option>
            </select>
          </div>
        </div>

        {/* Bengali Title */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700">
            Title / Heading (বাংলা সংস্করণ)
          </label>
          <input
            type="text"
            value={titleBn}
            onChange={(e) => setTitleBn(e.target.value)}
            placeholder="বাংলা শিরোনাম লিখুন..."
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none font-bangla"
          />
        </div>

        {/* Context Specific Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {section === 'notices' && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Notice Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none"
                >
                  <option value="Academic">Academic</option>
                  <option value="Exam">Exam</option>
                  <option value="Admission">Admission</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="Administration">Administration</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Reference Number</label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Publish Date</label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none"
                />
              </div>
            </>
          )}

          {section === 'news' && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">News Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none"
                >
                  <option value="Academic">Academic</option>
                  <option value="Campus Life">Campus Life</option>
                  <option value="Research">Research</option>
                  <option value="Technology">Technology</option>
                  <option value="Achievements">Achievements</option>
                  <option value="Administrative">Administrative</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Reporter / Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="PR Cell"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">News Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none"
                />
              </div>
            </>
          )}

          {section === 'events' && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Time</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="10:00 AM - 1:00 PM"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Venue</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Auditorium"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none"
                />
              </div>
            </>
          )}

          {section === 'downloads' && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none"
                >
                  <option value="academic_forms">Academic Forms</option>
                  <option value="ordinances">Ordinances & Statutes</option>
                  <option value="financial_forms">Financial Forms</option>
                  <option value="circulars">Circulars & Orders</option>
                  <option value="research_forms">Research & Grants</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">File Type</label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none"
                >
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="ZIP">ZIP</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">File Size</label>
                <input
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="2.4 MB"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none"
                />
              </div>
            </>
          )}

          {section === 'faculty' && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Assistant Professor"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Office Room</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Academic Complex 401"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none"
                />
              </div>
            </>
          )}

          {section === 'static_pages' && (
            <>
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. campus-history"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Policy, About..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none"
                />
              </div>
            </>
          )}

          {section === 'vc_message' && (
            <>
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700">Vice Chancellor Name</label>
                <input
                  type="text"
                  value={vcName}
                  onChange={(e) => setVcName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Key Quote</label>
                <input
                  type="text"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Institutional motto..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Image Upload with Validation */}
        {(section === 'news' ||
          section === 'events' ||
          section === 'gallery' ||
          section === 'faculty' ||
          section === 'departments' ||
          section === 'vc_message') && (
          <ImageUploadWithValidation
            value={imageUrl}
            onChange={setImageUrl}
            label={
              section === 'faculty' || section === 'vc_message'
                ? 'Official Profile Photo'
                : 'Cover Banner / Media Image'
            }
            maxSizeMB={3}
            aspectRatioHint={
              section === 'faculty' ? 'Recommended: 1:1 square portrait' : 'Recommended: 16:9 landscape banner'
            }
          />
        )}

        {/* Short Summary (if applicable) */}
        {(section === 'notices' || section === 'news' || section === 'events') && (
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Brief Summary / Excerpt
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              placeholder="1-2 sentences summarizing this item for search and public cards..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        )}

        {/* Safe Markdown Content Body with Markdown Toolbar & Preview */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <label className="block text-xs font-bold text-slate-800">
                Body Content (Safe Markdown Supported)
              </label>
              <span className="text-[11px] text-slate-400">
                Rendered safely without dangerouslySetInnerHTML
              </span>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('write')}
                className={`px-2.5 py-1 rounded font-medium flex items-center gap-1 transition-colors ${
                  viewMode === 'write' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Write
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-2.5 py-1 rounded font-medium flex items-center gap-1 transition-colors ${
                  viewMode === 'preview' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`hidden sm:flex px-2.5 py-1 rounded font-medium items-center gap-1 transition-colors ${
                  viewMode === 'split' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Columns className="w-3.5 h-3.5" /> Split
              </button>
            </div>
          </div>

          {/* Markdown Formatting Action Toolbar */}
          {(viewMode === 'write' || viewMode === 'split') && (
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600">
              <button
                type="button"
                onClick={() => insertMarkdown('**', '**')}
                className="p-1 hover:bg-white rounded hover:text-slate-900"
                title="Bold (**text**)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('*', '*')}
                className="p-1 hover:bg-white rounded hover:text-slate-900"
                title="Italic (*text*)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('## ')}
                className="p-1 hover:bg-white rounded hover:text-slate-900 font-bold"
                title="Heading 2 (## Heading)"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('### ')}
                className="p-1 hover:bg-white rounded hover:text-slate-900 font-bold"
                title="Heading 3 (### Heading)"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('- ')}
                className="p-1 hover:bg-white rounded hover:text-slate-900"
                title="Bullet List (- item)"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('> ')}
                className="p-1 hover:bg-white rounded hover:text-slate-900"
                title="Blockquote (> quote)"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('`', '`')}
                className="p-1 hover:bg-white rounded hover:text-slate-900 font-mono"
                title="Inline Code (`code`)"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('[Link Title](https://example.com)')}
                className="p-1 hover:bg-white rounded hover:text-slate-900"
                title="Hyperlink"
              >
                <Link className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  insertMarkdown('\n| Column 1 | Column 2 |\n|---|---|\n| Item A | Item B |\n')
                }
                className="p-1 hover:bg-white rounded hover:text-slate-900"
                title="Table Snippet"
              >
                <Table className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Editor Body Input / Preview Container */}
          <div className={`${viewMode === 'split' ? 'grid grid-cols-2 gap-3' : ''}`}>
            {(viewMode === 'write' || viewMode === 'split') && (
              <textarea
                id="cms-markdown-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={viewMode === 'split' ? 10 : 8}
                placeholder="Write formatted content using markdown...&#10;&#10;## Section Heading&#10;Key announcements and institutional details here.&#10;&#10;- Bullet point one&#10;- Bullet point two"
                className="w-full p-3 font-mono text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none leading-relaxed"
              />
            )}

            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md min-h-48 max-h-96 overflow-y-auto">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Safe React Preview (No raw HTML)
                </p>
                {body.trim() ? (
                  <SafeMarkdown content={body} className="text-xs" />
                ) : (
                  <p className="text-slate-400 text-xs italic">
                    Type markdown in the editor to see instant live preview.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bengali Body Version */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700">
            Body Content (বাংলা সংস্করণ / ঐচ্ছিক)
          </label>
          <textarea
            value={bodyBn}
            onChange={(e) => setBodyBn(e.target.value)}
            rows={3}
            placeholder="বাংলা বিস্তারিত বিবরণ বা নোটিশের মূল বক্তব্য..."
            className="w-full p-2.5 text-xs border border-slate-300 rounded-md outline-none font-bangla"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose} size="sm">
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-2xs"
            >
              <Save className="w-4 h-4" />
              {status === 'published' && canPublish
                ? 'Save & Publish Live'
                : 'Save Item'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
