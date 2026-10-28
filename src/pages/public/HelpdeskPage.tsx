import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { HelpdeskTicket, TicketStatus } from '../../types/helpdesk';
import { SubmitTicketModal } from '../../components/helpdesk/SubmitTicketModal';
import { HelpdeskQueueManagement } from '../../components/helpdesk/HelpdeskQueueManagement';
import { NeutralUniversityLogo } from '../../components/common/NeutralUniversityLogo';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  HelpCircle,
  Search,
  PlusCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  MessageSquare,
  EyeOff,
  User,
  ArrowRight,
  FileText,
  Download,
  Send,
  Building2,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const HelpdeskPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, profile, role } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const refParam = searchParams.get('ref') || '';
  const [referenceQuery, setReferenceQuery] = useState(refParam);
  const [activeTicket, setActiveTicket] = useState<HelpdeskTicket | null | undefined>(undefined);
  const [searchedRef, setSearchedRef] = useState(refParam);

  // Modals & Tabs
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [activePortalTab, setActivePortalTab] = useState<'track' | 'queue'>('track');
  const [userFollowUpMessage, setUserFollowUpMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const storeManager = SharedDataStoreManager.getInstance();
  const allTickets = storeManager.getHelpdeskTickets();

  // If user is staff/admin/registrar, default or enable queue tab
  const isStaffRole =
    role && ['admin', 'super_admin', 'registrar', 'dept_chairman', 'exam_controller', 'teacher', 'library_officer'].includes(role);

  // Lookup ticket whenever URL param or search changes
  useEffect(() => {
    if (refParam) {
      setReferenceQuery(refParam);
      setSearchedRef(refParam);
      const found = storeManager.getHelpdeskTicketByRef(refParam);
      setActiveTicket(found || null);
    } else {
      setActiveTicket(undefined);
    }
  }, [refParam]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceQuery.trim()) return;
    setSearchParams({ ref: referenceQuery.trim() });
  };

  const handleSelectQuickTicket = (ref: string) => {
    setSearchParams({ ref });
  };

  const handleUserReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !userFollowUpMessage.trim()) return;

    setIsSubmittingReply(true);
    try {
      const authorName = activeTicket.isAnonymous
        ? 'Submitter (Anonymous)'
        : profile?.fullName || user?.email?.split('@')[0] || 'Ticket Submitter';

      const updated = storeManager.addTicketReply(activeTicket.referenceNumber, {
        authorType: 'submitter',
        authorName,
        message: userFollowUpMessage.trim(),
        isInternalNote: false
      });

      if (updated) {
        setUserFollowUpMessage('');
        setActiveTicket({ ...updated });
      }
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // SLA indicator
  const getSlaInfo = (ticket: HelpdeskTicket) => {
    if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
      return {
        label: 'Resolved within SLA',
        color: 'text-slate-500 bg-slate-100 border-slate-200'
      };
    }
    const diffHours = Math.round((new Date(ticket.slaDeadline).getTime() - Date.now()) / (3600 * 1000));
    if (diffHours <= 0) {
      return {
        label: `SLA Overdue by ${Math.abs(diffHours)}h`,
        color: 'text-red-700 bg-red-50 border-red-200 font-bold'
      };
    }
    return {
      label: `SLA Target: ${diffHours}h remaining`,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    };
  };

  // Tickets belonging to current logged-in user (excluding anonymous)
  const myTickets = allTickets.filter(
    (t) => !t.isAnonymous && (t.submitterUid === user?.uid || (user?.email && t.submitterEmail === user.email))
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-6xl mx-auto">
      {/* Top Breadcrumb & University Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <NeutralUniversityLogo size={48} className="shrink-0 drop-shadow-sm" />
          <div>
            <div className="text-[11px] font-bold text-[#1E3A8A] uppercase tracking-wider">
              {isBn ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়' : 'Jamalpur Science & Technology University'}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isBn ? 'স্মার্ট হেল্পডেস্ক ও অভিযোগ প্রতিকার সেল' : 'Smart Campus Helpdesk & Grievance Portal'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => setSubmitModalOpen(true)}
            className="text-xs flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isBn ? 'নতুন টিকিট দাখিল করুন' : 'Submit Support Ticket'}</span>
          </Button>
        </div>
      </div>

      {/* Mode Switcher: Track vs Staff Queue */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActivePortalTab('track')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activePortalTab === 'track'
                ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>{isBn ? 'টিকিট স্ট্যাটাস ট্র্যাকিং' : 'Track Ticket & Public Portal'}</span>
          </button>

          <button
            onClick={() => setActivePortalTab('queue')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activePortalTab === 'queue'
                ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{isBn ? 'দাপ্তরিক টিকিট কিউ (Staff / Admin)' : 'Staff / Admin Queue'}</span>
            <span className="text-[10px] bg-blue-100 text-[#1E3A8A] px-1.5 py-0.5 rounded-full font-extrabold ml-1">
              {allTickets.filter((t) => t.status === 'Open' || t.status === 'In progress').length}
            </span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
          SLA MONITORED • DEMO MODE
        </span>
      </div>

      {/* TAB 1: TRACK TICKET STATUS & PUBLIC PORTAL */}
      {activePortalTab === 'track' && (
        <div className="space-y-6">
          {/* Tracking Search Card */}
          <Card className="p-6 bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-slate-900">
                {isBn ? 'টিকিট রেফারেন্স নম্বর দিয়ে অগ্রগতি দেখুন' : 'Check Status by Ticket Reference Number'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isBn
                  ? 'আপনার দাখিলকৃত টিকিটের রেফারেন্স নম্বর (যেমন: HD-2026-10492) লিখুন। বেনামী অভিযোগের ক্ষেত্রে পরিচয় সুরক্ষিত থাকে।'
                  : 'Enter your 9-digit Reference Number (e.g. HD-2026-10492) to view real-time department assignment, SLA progress, and replies.'}
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={referenceQuery}
                  onChange={(e) => setReferenceQuery(e.target.value)}
                  placeholder="Enter Reference Number (e.g. HD-2026-10492)..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] font-mono"
                />
              </div>
              <Button type="submit" variant="primary" size="sm" className="text-xs shrink-0">
                {isBn ? 'স্ট্যাটাস দেখুন' : 'Check Status'}
              </Button>
            </form>

            {/* Quick Demo Tickets Switcher */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Test Demo Records:</span>
              <button
                type="button"
                onClick={() => handleSelectQuickTicket('HD-2026-10492')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px]"
              >
                HD-2026-10492 (Academic)
              </button>
              <button
                type="button"
                onClick={() => handleSelectQuickTicket('HD-2026-10815')}
                className="px-2 py-0.5 rounded bg-red-50 hover:bg-red-100 text-red-700 font-mono text-[11px]"
              >
                HD-2026-10815 (Urgent Exam)
              </button>
              <button
                type="button"
                onClick={() => handleSelectQuickTicket('HD-2026-10118')}
                className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-mono text-[11px] font-bold"
              >
                HD-2026-10118 (🔒 Anonymous Complaint)
              </button>
              <button
                type="button"
                onClick={() => handleSelectQuickTicket('HD-2026-10234')}
                className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-mono text-[11px]"
              >
                HD-2026-10234 (Resolved Fee)
              </button>
            </div>
          </Card>

          {/* ACTIVE TICKET STATUS CARD */}
          {activeTicket === null && searchedRef && (
            <Card className="p-8 text-center bg-red-50 border-2 border-red-200 space-y-2">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
              <h3 className="text-sm font-bold text-red-900">
                Ticket Reference Not Found
              </h3>
              <p className="text-xs text-red-700 max-w-md mx-auto">
                No support ticket matches &ldquo;{searchedRef}&rdquo;. Please verify the reference number or submit a new inquiry.
              </p>
            </Card>
          )}

          {activeTicket && (
            <Card className="border border-slate-200 bg-white overflow-hidden shadow-sm">
              {/* Status Header */}
              <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-black text-[#1E3A8A]">
                      {activeTicket.referenceNumber}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-slate-600 uppercase">
                      {activeTicket.category}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        activeTicket.priority === 'Urgent'
                          ? 'bg-red-100 text-red-800'
                          : activeTicket.priority === 'High'
                          ? 'bg-orange-100 text-orange-800'
                          : activeTicket.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {activeTicket.priority} Priority
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {activeTicket.subject}
                  </h2>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Status</span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mt-0.5 ${
                        activeTicket.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : activeTicket.status === 'In progress'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : activeTicket.status === 'Closed'
                          ? 'bg-slate-100 text-slate-700 border border-slate-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {activeTicket.status}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg border text-xs text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">SLA Commitment</span>
                    <span className={`text-[11px] font-semibold ${getSlaInfo(activeTicket).color} px-2 py-0.5 rounded border inline-block mt-0.5`}>
                      {getSlaInfo(activeTicket).label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submitter & Assigned Office Strip */}
              <div className="p-5 border-b border-slate-100 bg-white grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Submitter */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Submitter Identity
                  </span>
                  {activeTicket.isAnonymous ? (
                    <div className="flex items-center gap-2 text-blue-900">
                      <EyeOff className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <span className="font-bold">Anonymous Submitter (Identity Protected)</span>
                        <p className="text-[10px] text-blue-700 mt-0.5">
                          Personal credentials were not recorded. Confidential grievance protocol active.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">
                        {activeTicket.submitterName || 'Campus User'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono block">
                        {activeTicket.submitterStudentId || activeTicket.submitterRole || 'Student/Staff'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Assigned Office */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Assigned University Office
                  </span>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Building2 className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                    <div>
                      <span className="font-bold text-xs block">{activeTicket.assignedOffice}</span>
                      <span className="text-[10px] text-slate-500">
                        Assigned Officer: {activeTicket.assignedStaffName || 'Office Duty Desk'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description & Attachments */}
              <div className="p-5 space-y-4 text-xs border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Issue Description
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {activeTicket.description}
                  </div>
                </div>

                {/* Attachments */}
                {activeTicket.attachments && activeTicket.attachments.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Uploaded Attachments
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeTicket.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
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

              {/* Conversation History (EXCLUDING internal notes) */}
              <div className="p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Official Communication Thread</span>
                </h3>

                {/* Filter out any internal notes for public tracking view */}
                {activeTicket.replies.filter((r) => !r.isInternalNote).length === 0 ? (
                  <p className="text-slate-400 text-xs py-3 text-center bg-slate-50 rounded-xl border border-dashed">
                    No public messages yet. Office staff will post updates as your ticket progresses.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {activeTicket.replies
                      .filter((r) => !r.isInternalNote)
                      .map((reply) => (
                        <div
                          key={reply.id}
                          className={`p-3.5 rounded-xl border text-xs ${
                            reply.authorType === 'staff'
                              ? 'bg-blue-50/60 border-blue-200 text-slate-800'
                              : reply.authorType === 'system'
                              ? 'bg-slate-50 border-slate-200 text-slate-600'
                              : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5 font-bold">
                              {reply.authorType === 'staff' && (
                                <span className="px-1.5 py-0.5 bg-blue-100 text-[#1E3A8A] rounded text-[10px] uppercase font-extrabold">
                                  University Staff
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
                              {new Date(reply.createdAt).toLocaleDateString()}{' '}
                              {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                        </div>
                      ))}
                  </div>
                )}

                {/* Submitter Follow-Up Form */}
                {activeTicket.status !== 'Closed' ? (
                  <form onSubmit={handleUserReply} className="space-y-2 pt-3 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700">
                      Post a Follow-Up Reply or Question:
                    </label>
                    <textarea
                      value={userFollowUpMessage}
                      onChange={(e) => setUserFollowUpMessage(e.target.value)}
                      rows={2}
                      placeholder="Add additional information, answer staff queries, or verify resolution..."
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        size="sm"
                        variant="primary"
                        isLoading={isSubmittingReply}
                        className="text-xs flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reply</span>
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="p-3 bg-slate-100 rounded-xl text-slate-600 text-xs text-center">
                    This ticket has been marked CLOSED. If you still require assistance, please submit a new ticket.
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* MY SUBMITTED TICKETS (Authenticated User) */}
          {user && myTickets.length > 0 && (
            <Card className="p-5 bg-white border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Your Logged Support Tickets
              </h3>
              <div className="divide-y divide-slate-100">
                {myTickets.map((t) => (
                  <div
                    key={t.id}
                    className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-lg transition-colors cursor-pointer"
                    onClick={() => handleSelectQuickTicket(t.referenceNumber)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#1E3A8A]">{t.referenceNumber}</span>
                        <span className="font-semibold text-slate-800">{t.subject}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {t.category} • {t.assignedOffice}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          t.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.status === 'In progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {t.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: STAFF / ADMIN TICKET QUEUE */}
      {activePortalTab === 'queue' && (
        <HelpdeskQueueManagement
          actorDisplayName={profile?.fullName || 'Registrar Duty Desk'}
        />
      )}

      {/* SUBMISSION MODAL */}
      <SubmitTicketModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onTicketCreated={(ticket) => {
          setSearchParams({ ref: ticket.referenceNumber });
          setActivePortalTab('track');
        }}
      />
    </div>
  );
};
