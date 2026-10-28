import React from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  Archive,
  Edit3,
  Eye,
  Trash2,
  Calendar,
  Building2,
  Tag,
  ArrowUpRight,
  ShieldAlert,
  User,
  Image as ImageIcon
} from 'lucide-react';
import { ContentStatus, ContentSectionKey } from '../../../types/contentManagement';
import { Button } from '../../common/Button';

interface ContentItemCardProps {
  item: any;
  section: ContentSectionKey;
  canPublish: boolean;
  canEdit: boolean;
  onEdit: (item: any) => void;
  onPreview: (item: any) => void;
  onQuickStatusChange: (item: any, newStatus: ContentStatus) => void;
  onDelete: (item: any) => void;
}

export const ContentItemCard: React.FC<ContentItemCardProps> = ({
  item,
  section,
  canPublish,
  canEdit,
  onEdit,
  onPreview,
  onQuickStatusChange,
  onDelete
}) => {
  const title = item.title || item.name || item.code || 'Untitled Item';
  const titleBn = item.titleBn || item.nameBn || '';
  const status: ContentStatus = item.status || 'draft';
  const imageUrl = item.imageUrl || item.avatarUrl || item.bannerUrl;

  const getStatusBadge = () => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Published
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> Draft
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <Archive className="w-3 h-3 text-slate-500" /> Archived
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-2xs hover:shadow-xs p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left side: Thumbnail & text details */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {imageUrl ? (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
            <FileText className="w-7 h-7 text-slate-300" />
          </div>
        )}

        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {getStatusBadge()}
            {item.category && (
              <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                {item.category}
              </span>
            )}
            {item.department && (
              <span className="text-[11px] font-medium px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-100 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> {item.department}
              </span>
            )}
            {item.departmentId && (
              <span className="text-[11px] font-medium px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-100 flex items-center gap-1 uppercase">
                <Building2 className="w-3 h-3" /> {item.departmentId}
              </span>
            )}
            {item.isImportant && (
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-rose-100 text-rose-700 rounded border border-rose-200">
                Important
              </span>
            )}
          </div>

          <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
            {title}
          </h3>
          {titleBn && (
            <p className="text-xs text-slate-500 truncate font-bangla">
              {titleBn}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
            {item.publishDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {item.publishDate}
              </span>
            )}
            {item.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {item.date}
              </span>
            )}
            {item.designation && (
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <User className="w-3 h-3" /> {item.designation}
              </span>
            )}
            {item.referenceNumber && (
              <span className="font-mono text-slate-500">Ref: {item.referenceNumber}</span>
            )}
            {item.fileType && (
              <span className="font-mono text-slate-600 uppercase font-semibold">
                {item.fileType} • {item.fileSize}
              </span>
            )}
            {item.updatedAt && (
              <span>Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-end">
        {/* Preview Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPreview(item)}
          className="text-xs gap-1"
        >
          <Eye className="w-3.5 h-3.5" /> Preview
        </Button>

        {/* Edit Button */}
        {canEdit && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(item)}
            className="text-xs gap-1 text-slate-700 hover:text-emerald-700"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Button>
        )}

        {/* Quick Publish / Unpublish (Admin/Super Admin only) */}
        {canPublish ? (
          status === 'published' ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onQuickStatusChange(item, 'archived')}
              className="text-xs gap-1 text-slate-600 hover:text-slate-800"
              title="Archive this content item"
            >
              <Archive className="w-3.5 h-3.5" /> Archive
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onQuickStatusChange(item, 'published')}
              className="text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Publish Live
            </Button>
          )
        ) : (
          <span
            className="text-[11px] text-slate-400 italic px-2"
            title="Only admin and super_admin can publish content live"
          >
            Publishing requires Admin
          </span>
        )}

        {/* Delete (if canEdit) */}
        {canEdit && (
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
            title="Delete this item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
