import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Archive,
  PlusCircle,
  FileEdit,
  Trash2,
  User,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { ContentAuditEntry, ContentSectionKey } from '../../../types/contentManagement';
import { Card } from '../../common/Card';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ContentAuditTrailTabProps {
  entries: ContentAuditEntry[];
}

export const ContentAuditTrailTab: React.FC<ContentAuditTrailTabProps> = ({ entries }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (selectedSection !== 'all' && entry.contentType !== selectedSection) {
        return false;
      }
      if (selectedAction !== 'all' && entry.action !== selectedAction) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = entry.contentTitle.toLowerCase().includes(q);
        const matchActor = entry.actorName.toLowerCase().includes(q) || entry.actorEmail.toLowerCase().includes(q);
        const matchSummary = entry.changesSummary.toLowerCase().includes(q);
        if (!matchTitle && !matchActor && !matchSummary) return false;
      }
      return true;
    });
  }, [entries, selectedSection, selectedAction, searchTerm]);

  const getActionBadge = (action: ContentAuditEntry['action']) => {
    switch (action) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Published
          </span>
        );
      case 'DRAFTED':
      case 'CREATED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            <PlusCircle className="w-3 h-3 text-sky-600" /> {action === 'CREATED' ? 'Created' : 'Drafted'}
          </span>
        );
      case 'UPDATED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <FileEdit className="w-3 h-3 text-amber-600" /> Updated
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <Archive className="w-3 h-3 text-slate-500" /> Archived
          </span>
        );
      case 'DELETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <Trash2 className="w-3 h-3 text-rose-600" /> Deleted
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <Card className="p-4 bg-slate-50/70 border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Search Audit Logs</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, editor name, or changes..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Content Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              <option value="all">All Sections</option>
              <option value="notices">Notices</option>
              <option value="news">News Articles</option>
              <option value="events">Events</option>
              <option value="gallery">Gallery Photos</option>
              <option value="downloads">Official Downloads</option>
              <option value="departments">Department Pages</option>
              <option value="faculty">Faculty Profiles</option>
              <option value="vc_message">VC Message</option>
              <option value="static_pages">Static Pages</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Action Type</label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              <option value="all">All Actions</option>
              <option value="PUBLISHED">Published</option>
              <option value="CREATED">Created</option>
              <option value="UPDATED">Updated</option>
              <option value="ARCHIVED">Archived</option>
              <option value="DELETED">Deleted</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Audit List Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-600" />
            <h3 className="font-semibold text-sm text-slate-900">
              Content Modification Audit Trail ({filteredEntries.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">Immutable logging of all editor actions</span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No audit records match the current filters.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                {/* Left: Action, Title, Summary */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {getActionBadge(entry.action)}
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 uppercase border border-slate-200">
                      {entry.contentType.replace('_', ' ')}
                    </span>
                    <h4 className="font-semibold text-sm text-slate-900 truncate">
                      {entry.contentTitle}
                    </h4>
                  </div>
                  <p className="text-slate-600 text-xs">
                    {entry.changesSummary}
                  </p>
                  {(entry.previousStatus || entry.newStatus) && (
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Status transition:</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        {entry.previousStatus || 'none'}
                      </span>
                      <span>→</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-semibold">
                        {entry.newStatus || entry.previousStatus}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Actor & Timestamp */}
                <div className="flex flex-col md:items-end gap-1 text-slate-500 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{entry.actorName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-semibold">
                      {entry.actorRole}
                    </span>
                    {entry.actorDepartment && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded font-semibold">
                        Dept: {entry.actorDepartment}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
