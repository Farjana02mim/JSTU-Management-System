import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import {
  HelpdeskTicket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  AssignedOffice,
  TicketReply
} from '../../types/helpdesk';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  HelpCircle,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lock,
  MessageSquare,
  ShieldAlert,
  EyeOff,
  User,
  ArrowRight,
  ExternalLink,
  Send,
  Building2,
  FileText,
  Download
} from 'lucide-react';

interface HelpdeskQueueManagementProps {
  actorDisplayName?: string;
  defaultOfficeFilter?: AssignedOffice | 'all';
  onNotification?: (msg: { type: 'success' | 'error'; text: string }) => void;
}

const ALL_OFFICES: AssignedOffice[] = [
  'IT Cell',
  'Office of the Registrar',
  'Exam Controller Office',
  'Accounts & Finance Office',
  'Proctor Office',
  'Hall / Hostel Administration',
  'Academic Council / Dean Office',
  'Anti-Harassment & Grievance Cell',
  'General Administration'
];

export const HelpdeskQueueManagement: React.FC<HelpdeskQueueManagementProps> = ({
  actorDisplayName = 'Support Staff',
  defaultOfficeFilter = 'all',
  onNotification
}) => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const storeManager = SharedDataStoreManager.getInstance();

  const [tickets, setTickets] = useState<HelpdeskTicket[]>(() => storeManager.getHelpdeskTickets());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | TicketCategory>('all');
  const [officeFilter, setOfficeFilter] = useState<'all' | AssignedOffice>(defaultOfficeFilter);

  // Selected Ticket for Drawer / Modal
  const [selectedTicket, setSelectedTicket] = useState<HelpdeskTicket | null>(null);
  const [replyTab, setReplyTab] = useState<'public' | 'internal'>('public');
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // State changes inside modal
  const [pendingStatus, setPendingStatus] = useState<TicketStatus>('Open');
  const [pendingOffice, setPendingOffice] = useState<AssignedOffice>('General Administration');
  const [pendingStaff, setPendingStaff] = useState('');

  const refreshTickets = () => {
    const list = storeManager.getHelpdeskTickets();
    setTickets([...list]);
    if (selectedTicket) {
      const refreshed = list.find((t) => t.id === selectedTicket.id);
      if (refreshed) {
        setSelectedTicket(refreshed);
        setPendingStatus(refreshed.status);
        setPendingOffice(refreshed.assignedOffice);
        setPendingStaff(refreshed.assignedStaffName || '');
      }
    }
  };

  const handleOpenDetail = (ticket: HelpdeskTicket) => {
    setSelectedTicket(ticket);
    setPendingStatus(ticket.status);
    setPendingOffice(ticket.assignedOffice);
    setPendingStaff(ticket.assignedStaffName || '');
    setReplyMessage('');
    setReplyTab('public');
  };

  // SLA Time Helper
  const getSlaIndicator = (ticket: HelpdeskTicket) => {
    if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
      return {
        label: 'Resolved',
        color: 'text-slate-500 bg-slate-100 border-slate-200',
        isOverdue: false
      };
    }

    const now = new Date().getTime();
    const deadline = new Date(ticket.slaDeadline).getTime();
    const diffMs = deadline - now;
    const diffHours = Math.round(diffMs / (3600 * 1000));

    if (diffMs <= 0) {
      const overdueHours = Math.abs(diffHours);
      return {
        label: `Overdue by ${overdueHours}h`,
        color: 'text-red-700 bg-red-50 border-red-200 font-bold',
        isOverdue: true
      };
    }

    if (diffHours <= 6) {
      return {
        label: `Urgent: ${diffHours}h left`,
        color: 'text-amber-700 bg-amber-50 border-amber-200 font-bold',
        isOverdue: false
      };
    }

    return {
      label: `${diffHours}h remaining`,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      isOverdue: false
    };
  };

  // Apply status or office assignment update
  const handleUpdateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const actor = {
      name: profile?.fullName || actorDisplayName || 'Support Staff',
      role: 'staff'
    };

    const updated = storeManager.updateTicketStatus(
      selectedTicket.id,
      pendingStatus,
      pendingOffice,
      pendingStaff.trim() || undefined,
      actor
    );

    if (updated) {
      refreshTickets();
      onNotification?.({
        type: 'success',
        text: `Ticket #${selectedTicket.referenceNumber} updated to "${pendingStatus}" (${pendingOffice}).`
      });
    }
  };

  // Submit Reply (Public or Internal Note)
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    setIsSubmittingReply(true);
    try {
      const isInternal = replyTab === 'internal';
      const authorName = profile?.fullName || actorDisplayName || 'Support Officer';

      const updated = storeManager.addTicketReply(selectedTicket.id, {
        authorType: 'staff',
        authorName: isInternal ? `${authorName} (Internal Note)` : authorName,
        authorRole: 'Helpdesk Staff',
        message: replyMessage.trim(),
        isInternalNote: isInternal
      });

      if (updated) {
        setReplyMessage('');
        refreshTickets();
        onNotification?.({
          type: 'success',
          text: isInternal
            ? 'Internal note recorded.'
            : 'Public response dispatched to submitter.'
        });
      }
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Filtered Tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesOffice = officeFilter === 'all' || t.assignedOffice === officeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.referenceNumber.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.assignedOffice.toLowerCase().includes(q) ||
      (!t.isAnonymous && t.submitterName?.toLowerCase().includes(q)) ||
      (!t.isAnonymous && t.submitterStudentId?.toLowerCase().includes(q));

    return matchesStatus && matchesCategory && matchesOffice && matchesSearch;
  });

  // Metrics
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;
  const urgentCount = tickets.filter((t) => t.priority === 'Urgent' && t.status !== 'Resolved' && t.status !== 'Closed').length;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="p-3 border border-slate-200 bg-white">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Total Tickets</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{totalCount}</div>
        </Card>
        <Card className="p-3 border border-blue-200 bg-blue-50/50">
          <div className="text-[11px] font-bold text-blue-700 uppercase flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Open</span>
          </div>
          <div className="text-xl font-extrabold text-blue-800 mt-1">{openCount}</div>
        </Card>
        <Card className="p-3 border border-amber-200 bg-amber-50/50">
          <div className="text-[11px] font-bold text-amber-700 uppercase flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>In Progress</span>
          </div>
          <div className="text-xl font-extrabold text-amber-800 mt-1">{inProgressCount}</div>
        </Card>
        <Card className="p-3 border border-emerald-200 bg-emerald-50/50">
          <div className="text-[11px] font-bold text-emerald-700 uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Resolved</span>
          </div>
          <div className="text-xl font-extrabold text-emerald-800 mt-1">{resolvedCount}</div>
        </Card>
        <Card className="p-3 border border-red-200 bg-red-50/50">
          <div className="text-[11px] font-bold text-red-700 uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Urgent Active</span>
          </div>
          <div className="text-xl font-extrabold text-red-800 mt-1">{urgentCount}</div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ref, subject, or office..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            >
              <option value="all">All Categories</option>
              <option value="Academic">Academic</option>
              <option value="Exam">Exam</option>
              <option value="Fee">Fee</option>
              <option value="Hostel">Hostel</option>
              <option value="IT">IT</option>
              <option value="Harassment/Complaint">Harassment/Complaint</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={officeFilter}
              onChange={(e) => setOfficeFilter(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            >
              <option value="all">All Offices</option>
              {ALL_OFFICES.map((off) => (
                <option key={off} value={off}>
                  {off}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Ticket Queue Table */}
      <Card className="border border-slate-200 overflow-hidden bg-white">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Helpdesk Ticket Queue
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Review support tickets, route to university divisions, and enforce service level agreements.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Showing {filteredTickets.length} of {totalCount} tickets
          </span>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs">
            No helpdesk tickets match the current search or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Ticket Ref &amp; Subject</th>
                  <th className="py-3 px-4">Category &amp; Office</th>
                  <th className="py-3 px-4">Submitter</th>
                  <th className="py-3 px-4">Priority &amp; SLA</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((ticket) => {
                  const sla = getSlaIndicator(ticket);
                  return (
                    <tr key={ticket.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Ref & Subject */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-mono font-bold text-[#1E3A8A]">
                          {ticket.referenceNumber}
                        </div>
                        <div className="font-semibold text-slate-800 truncate" title={ticket.subject}>
                          {ticket.subject}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Logged: {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Category & Office */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {ticket.category}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate" title={ticket.assignedOffice}>
                          {ticket.assignedOffice}
                        </span>
                      </td>

                      {/* Submitter */}
                      <td className="py-3 px-4">
                        {ticket.isAnonymous ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold">
                            <EyeOff className="w-3 h-3 text-blue-600 shrink-0" />
                            <span>Anonymous</span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-semibold text-slate-800 block">
                              {ticket.submitterName || 'Campus User'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono block">
                              {ticket.submitterStudentId || ticket.submitterRole || 'Staff/User'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Priority & SLA */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ticket.priority === 'Urgent'
                                ? 'bg-red-100 text-red-800'
                                : ticket.priority === 'High'
                                ? 'bg-orange-100 text-orange-800'
                                : ticket.priority === 'Medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {ticket.priority}
                          </span>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border ${sla.color}`}>
                          <Clock className="w-2.5 h-2.5 shrink-0" />
                          <span>{sla.label}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {ticket.status === 'Open' && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            OPEN
                          </span>
                        )}
                        {ticket.status === 'In progress' && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            IN PROGRESS
                          </span>
                        )}
                        {ticket.status === 'Resolved' && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            RESOLVED
                          </span>
                        )}
                        {ticket.status === 'Closed' && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            CLOSED
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDetail(ticket)}
                          className="text-xs font-semibold"
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* TICKET DETAIL & MANAGEMENT MODAL */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Manage Ticket: ${selectedTicket.referenceNumber}`}
          maxWidth="xl"
        >
          <div className="space-y-5 text-xs max-h-[80vh] overflow-y-auto pr-1">
            {/* Top Overview Strip */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-[#1E3A8A]">
                    {selectedTicket.referenceNumber}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedTicket.subject}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      selectedTicket.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedTicket.status === 'In progress'
                        ? 'bg-amber-100 text-amber-800'
                        : selectedTicket.status === 'Closed'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {selectedTicket.status}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    SLA: {selectedTicket.slaHours}h Target
                  </span>
                </div>
              </div>

              {/* Submitter Info Strip */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                {selectedTicket.isAnonymous ? (
                  <div className="flex items-center gap-2 text-blue-900">
                    <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-bold text-xs block">
                        ANONYMOUS SUBMISSION (IDENTITY PROTECTED)
                      </span>
                      <p className="text-[11px] text-blue-800">
                        Submitter identity was omitted during creation and is not recorded in the database.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Submitter Name</span>
                      <span className="font-bold text-slate-900">{selectedTicket.submitterName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">ID / Role</span>
                      <span className="font-semibold text-slate-800">{selectedTicket.submitterStudentId || selectedTicket.submitterRole}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Email</span>
                      <span className="text-slate-700 truncate block">{selectedTicket.submitterEmail || 'N/A'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                  Issue Description
                </span>
                <p className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Attachments if any */}
              {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                    Submitted Attachments
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedTicket.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <FileText className="w-4 h-4 text-[#1E3A8A]" />
                        <span className="font-medium text-slate-800">{att.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({(att.size / 1024).toFixed(1)} KB)
                        </span>
                        {att.dataUrl && (
                          <a
                            href={att.dataUrl}
                            download={att.name}
                            className="text-[#1E3A8A] hover:underline flex items-center gap-0.5 ml-1 font-bold"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Status & Office Assignment Form */}
            <form onSubmit={handleUpdateAssignment} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Workflow Actions: Status &amp; Office Assignment
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Ticket Status</label>
                  <select
                    value={pendingStatus}
                    onChange={(e) => setPendingStatus(e.target.value as TicketStatus)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-semibold"
                  >
                    <option value="Open">Open</option>
                    <option value="In progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Assigned Office</label>
                  <select
                    value={pendingOffice}
                    onChange={(e) => setPendingOffice(e.target.value as AssignedOffice)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-semibold"
                  >
                    {ALL_OFFICES.map((off) => (
                      <option key={off} value={off}>
                        {off}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Assigned Staff Name</label>
                  <input
                    type="text"
                    value={pendingStaff}
                    onChange={(e) => setPendingStaff(e.target.value)}
                    placeholder="e.g. Engr. Shafiqul"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" size="sm" variant="secondary">
                  Update Assignment &amp; Status
                </Button>
              </div>
            </form>

            {/* Conversation History & Reply Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Timeline &amp; Communication Thread
                </h4>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setReplyTab('public')}
                    className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                      replyTab === 'public'
                        ? 'bg-white text-[#1E3A8A] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Public Reply (User Visible)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyTab('internal')}
                    className={`px-3 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                      replyTab === 'internal'
                        ? 'bg-amber-100 text-amber-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>Internal Note (Staff Only)</span>
                  </button>
                </div>
              </div>

              {/* Message List */}
              <div className="space-y-2 max-h-60 overflow-y-auto p-1">
                {selectedTicket.replies.length === 0 ? (
                  <p className="text-center text-slate-400 py-4 text-xs">
                    No replies or notes recorded yet.
                  </p>
                ) : (
                  selectedTicket.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-3 rounded-xl border text-xs ${
                        reply.isInternalNote
                          ? 'bg-amber-50 border-amber-200 text-amber-950'
                          : reply.authorType === 'staff'
                          ? 'bg-blue-50/70 border-blue-200 text-slate-800'
                          : reply.authorType === 'system'
                          ? 'bg-slate-50 border-slate-200 text-slate-600'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          {reply.isInternalNote && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900 text-[10px] font-bold">
                              <Lock className="w-2.5 h-2.5" />
                              <span>INTERNAL NOTE</span>
                            </span>
                          )}
                          <span>{reply.authorName}</span>
                          {reply.authorRole && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({reply.authorRole})
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-2 pt-2">
                <div className="relative">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={2}
                    placeholder={
                      replyTab === 'internal'
                        ? 'Write an internal coordination note (visible only to university staff)...'
                        : 'Write a response visible to the user on their ticket tracking screen...'
                    }
                    className={`w-full p-2.5 border rounded-lg text-xs focus:outline-none focus:ring-2 ${
                      replyTab === 'internal'
                        ? 'border-amber-300 bg-amber-50/30 focus:ring-amber-500'
                        : 'border-slate-300 bg-white focus:ring-[#1E3A8A]'
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {replyTab === 'internal'
                      ? '🔒 Internal note is permanently concealed from submitters.'
                      : '💬 Dispatches public message to ticket thread and sends user notification.'}
                  </span>
                  <Button
                    type="submit"
                    size="sm"
                    variant="primary"
                    isLoading={isSubmittingReply}
                    className="text-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{replyTab === 'internal' ? 'Save Internal Note' : 'Send Public Reply'}</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
