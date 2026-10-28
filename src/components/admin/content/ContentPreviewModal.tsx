import React from 'react';
import { Modal } from '../../common/Modal';
import { SafeMarkdown } from '../../common/SafeMarkdown';
import {
  Calendar,
  Building2,
  User,
  Clock,
  CheckCircle2,
  Archive,
  Download,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Tag
} from 'lucide-react';
import { ContentStatus, ContentSectionKey } from '../../../types/contentManagement';

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: ContentSectionKey;
  item: any;
}

export const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({
  isOpen,
  onClose,
  section,
  item
}) => {
  if (!item) return null;

  const title = item.title || item.name || item.code || 'Untitled';
  const titleBn = item.titleBn || item.nameBn || '';
  const status: ContentStatus = item.status || 'draft';
  const imageUrl = item.imageUrl || item.avatarUrl || item.bannerUrl;

  const contentBody =
    item.body ||
    item.content ||
    item.description ||
    item.speech ||
    item.overview ||
    item.bio ||
    '';

  const contentBodyBn =
    item.bodyBn ||
    item.contentBn ||
    item.descriptionBn ||
    item.speechBn ||
    item.overviewBn ||
    item.bioBn ||
    '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Live Website Preview: ${title}`}
      size="xl"
    >
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Banner with status and category */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Section: {section.replace('_', ' ')}
            </span>
            {item.category && (
              <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-medium border border-emerald-100">
                {item.category}
              </span>
            )}
            {item.department && (
              <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-medium border border-indigo-100">
                Dept: {item.department}
              </span>
            )}
          </div>
          <div>
            {status === 'published' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Published (Live on Public Site)
              </span>
            ) : status === 'draft' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                <Clock className="w-3 h-3 text-amber-600" /> Draft (Hidden from Public Site)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                <Archive className="w-3 h-3 text-slate-500" /> Archived
              </span>
            )}
          </div>
        </div>

        {/* Hero image preview */}
        {imageUrl && (
          <div className="rounded-xl overflow-hidden border border-slate-200 max-h-72 bg-slate-100">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Header information */}
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {titleBn && <h2 className="text-lg font-medium text-slate-600 font-bangla">{titleBn}</h2>}

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
            {item.publishDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Published: {item.publishDate}
              </span>
            )}
            {item.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Event Date: {item.date}
              </span>
            )}
            {item.venue && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Venue: {item.venue}
              </span>
            )}
            {item.author && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Author: {item.author}
              </span>
            )}
            {item.designation && (
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <User className="w-3.5 h-3.5 text-slate-400" /> {item.designation}
              </span>
            )}
            {item.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {item.email}
              </span>
            )}
            {item.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {item.phone}
              </span>
            )}
            {item.referenceNumber && (
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                Ref: {item.referenceNumber}
              </span>
            )}
          </div>
        </div>

        {/* Summary if available */}
        {(item.summary || item.quote) && (
          <div className="p-4 bg-emerald-50/50 border-l-4 border-emerald-500 rounded-r-lg text-slate-700 text-sm italic">
            "{item.summary || item.quote}"
          </div>
        )}

        {/* Safe Markdown Content Body */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Formatted Content (Safe React Rendered)
          </h3>
          <div className="prose prose-slate max-w-none text-slate-700">
            <SafeMarkdown content={contentBody} />
          </div>

          {contentBodyBn && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Bengali Version / বাংলা সংস্করণ
              </h4>
              <div className="prose prose-slate max-w-none text-slate-700 font-bangla">
                <SafeMarkdown content={contentBodyBn} />
              </div>
            </div>
          )}
        </div>

        {/* Section specific details */}
        {section === 'downloads' && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-slate-700">Downloadable Document File</p>
              <p className="text-xs text-slate-500">
                Format: {item.fileType} • Size: {item.fileSize}
              </p>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-medium flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" /> Download File ({item.fileType})
            </button>
          </div>
        )}

        {section === 'departments' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="font-semibold text-slate-800 mb-1">Our Mission</p>
              <p className="text-slate-600">{item.mission || 'Continuous academic excellence.'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="font-semibold text-slate-800 mb-1">Our Vision</p>
              <p className="text-slate-600">{item.vision || 'World class engineering institution.'}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
