import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  FileText,
  BadgeCheck,
  ShieldAlert,
  HelpCircle,
  CheckSquare,
  Square,
  Send,
  Calendar,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Modal } from '../common/Modal';
import { UserRole } from '../../types/auth';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  AccountRequestService,
  AccountRequest,
  AccountRequestStatus,
  JSTU_DEPARTMENT_CODES,
  JSTU_SESSIONS,
  SimulatedEmailLog
} from '../../services/accountRequests';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';

interface AdminAccountRequestsTabProps {
  actorUid: string;
  actorRole: UserRole;
  actorDisplayName?: string;
  onAccountApproved?: () => void;
  onNotification?: (msg: { type: 'success' | 'error'; text: string }) => void;
}

export const AdminAccountRequestsTab: React.FC<AdminAccountRequestsTabProps> = ({
  actorUid,
  actorRole,
  actorDisplayName,
  onAccountApproved,
  onNotification
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Requests state
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [sessionFilter, setSessionFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedDetail, setSelectedDetail] = useState<AccountRequest | null>(null);
  const [verificationChecked, setVerificationChecked] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [moreInfoModalOpen, setMoreInfoModalOpen] = useState(false);
  const [moreInfoComment, setMoreInfoComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Simulated email inspection
  const [emailLogs, setEmailLogs] = useState<SimulatedEmailLog[]>([]);

  const loadRequests = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const data = await AccountRequestService.getAccountRequests(actorRole, {
        status: statusFilter as any,
        department: departmentFilter as any,
        session: sessionFilter as any,
        searchQuery
      });
      setRequests(data);
      setEmailLogs(AccountRequestService.getSimulatedEmailLogs());
    } catch (err) {
      console.error(err);
      setActionError(err instanceof Error ? err.message : 'Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [actorRole, statusFilter, departmentFilter, sessionFilter, searchQuery]);

  // Check if a request matches an existing user account in the store
  const checkExistingAccountMatch = (req: AccountRequest) => {
    const store = SharedDataStoreManager.getInstance().getStore();
    const normalizedEmail = req.email.toLowerCase().trim();
    const normalizedId = req.studentId.trim();

    const matchedStudent = Object.values(store.students).find(
      (s) => s.email.toLowerCase() === normalizedEmail || s.studentId === normalizedId
    );
    const matchedTeacher =
      store.teacherProfile &&
      (store.teacherProfile.email.toLowerCase() === normalizedEmail ||
        store.teacherProfile.employeeId === normalizedId);

    if (matchedStudent) {
      return {
        matched: true,
        type: 'Student',
        name: matchedStudent.fullName,
        studentId: matchedStudent.studentId,
        email: matchedStudent.email
      };
    }
    if (matchedTeacher) {
      return {
        matched: true,
        type: 'Faculty',
        name: store.teacherProfile.fullName,
        studentId: store.teacherProfile.employeeId,
        email: store.teacherProfile.email
      };
    }
    return { matched: false };
  };

  const handleApprove = async () => {
    if (!selectedDetail) return;
    if (!verificationChecked) {
      setActionError(
        isBn
          ? 'অনুমোদনের পূর্বে "Student ID verified against university records" বক্সে টিক দেওয়া বাধ্যতামূলক।'
          : 'You must check the verification checklist before approval can proceed.'
      );
      return;
    }

    setIsProcessing(true);
    setActionError(null);

    try {
      const res = await AccountRequestService.approveRequest(
        selectedDetail.id,
        {
          uid: actorUid,
          role: actorRole,
          displayName: actorDisplayName
        },
        true
      );

      onNotification?.({
        type: 'success',
        text: res.message
      });

      await loadRequests();
      const updatedEmails = AccountRequestService.getSimulatedEmailLogs();
      setEmailLogs(updatedEmails);

      const store = SharedDataStoreManager.getInstance().getStore();
      const updatedReq = store.accountRequests.find((r) => r.id === selectedDetail.id);
      if (updatedReq) {
        setSelectedDetail(updatedReq);
      } else {
        setSelectedDetail(null);
      }
      setVerificationChecked(false);
      onAccountApproved?.();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to approve request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedDetail) return;
    if (!rejectionReason.trim() || rejectionReason.trim().length < 5) {
      setActionError(
        isBn
          ? 'প্রত্যাখ্যানের কারণ কমপক্ষে ৫ অক্ষরের হতে হবে।'
          : 'A rejection reason of at least 5 characters is mandatory.'
      );
      return;
    }

    setIsProcessing(true);
    setActionError(null);

    try {
      const res = await AccountRequestService.rejectRequest(
        selectedDetail.id,
        rejectionReason.trim(),
        {
          uid: actorUid,
          role: actorRole,
          displayName: actorDisplayName
        }
      );

      onNotification?.({
        type: 'success',
        text: res.message
      });

      setRejectionModalOpen(false);
      setSelectedDetail(null);
      setRejectionReason('');
      await loadRequests();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to reject request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestMoreInfo = async () => {
    if (!selectedDetail) return;
    if (!moreInfoComment.trim() || moreInfoComment.trim().length < 5) {
      setActionError(
        isBn
          ? 'অতিরিক্ত তথ্যের নির্দেশনা কমপক্ষে ৫ অক্ষরের হতে হবে।'
          : 'Instructions of at least 5 characters are mandatory when requesting more information.'
      );
      return;
    }

    setIsProcessing(true);
    setActionError(null);

    try {
      const res = await AccountRequestService.requestMoreInfo(
        selectedDetail.id,
        moreInfoComment.trim(),
        {
          uid: actorUid,
          role: actorRole,
          displayName: actorDisplayName
        }
      );

      onNotification?.({
        type: 'success',
        text: res.message
      });

      setMoreInfoModalOpen(false);
      setSelectedDetail(null);
      setMoreInfoComment('');
      await loadRequests();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to request more info');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: AccountRequestStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <Clock className="w-3 h-3" />
            <span>{isBn ? 'অপেক্ষমাণ' : 'PENDING'}</span>
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isBn ? 'অনুমোদিত' : 'APPROVED'}</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900">
            <XCircle className="w-3 h-3" />
            <span>{isBn ? 'প্রত্যাখ্যাত' : 'REJECTED'}</span>
          </span>
        );
      case 'MORE_INFO_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-900">
            <HelpCircle className="w-3 h-3" />
            <span>{isBn ? 'তথ্য চাওয়া হয়েছে' : 'MORE INFO'}</span>
          </span>
        );
    }
  };

  const existingMatchInfo = selectedDetail ? checkExistingAccountMatch(selectedDetail) : null;
  const relatedEmails = selectedDetail
    ? emailLogs.filter((e) => e.referenceNumber === selectedDetail.referenceNumber || e.recipientEmail === selectedDetail.email)
    : [];

  return (
    <Card padding="md" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>{isBn ? 'শিক্ষার্থী অ্যাকাউন্ট আবেদন রেজিস্ট্রি' : 'Student Account Requests & Verification'}</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 px-2 py-0.5 rounded-full font-mono font-bold">
              STUDENT ROLE ONLY
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBn
              ? 'বিশ্ববিদ্যালয় নথির সাথে যাচাই সাপেক্ষে নবীন শিক্ষার্থীদের পোর্টাল অ্যাকাউন্ট অনুমোদন করুন। অনুমোদন দিলে স্বয়ংক্রিয় সেট-পাসওয়ার্ড লিংক প্রেরিত হবে।'
              : 'Review submitted credentials against official university admission records. Approving provisions student accounts via createUserAccount.'}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadRequests}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          {isBn ? 'রিফ্রেশ' : 'Refresh'}
        </Button>
      </div>

      {actionError && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-800 dark:text-red-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-slate-400 hover:text-slate-600 font-bold">
            &times;
          </button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
            {isBn ? 'অনুসন্ধান' : 'Search'}
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder={isBn ? 'নাম, আইডি, ইমেইল বা রেফ...' : 'Name, ID, email or ref...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
            {isBn ? 'অবস্থা ফিল্টার' : 'Status Filter'}
          </label>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: isBn ? 'সকল অবস্থা (All)' : 'All Statuses' },
              { value: 'PENDING', label: isBn ? 'অপেক্ষমাণ (Pending)' : 'Pending Verification' },
              { value: 'APPROVED', label: isBn ? 'অনুমোদিত (Approved)' : 'Approved' },
              { value: 'REJECTED', label: isBn ? 'প্রত্যাখ্যাত (Rejected)' : 'Rejected' },
              { value: 'MORE_INFO_REQUESTED', label: isBn ? 'অতিরিক্ত তথ্য চাওয়া (More Info)' : 'More Info Requested' }
            ]}
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
            {isBn ? 'বিভাগ ফিল্টার (৭টি বিভাগ)' : 'Department Filter (7 Depts)'}
          </label>
          <Select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            options={[
              { value: 'ALL', label: isBn ? 'সকল বিভাগ (All Departments)' : 'All Departments' },
              ...JSTU_DEPARTMENT_CODES.map((code) => ({
                value: code,
                label: `${code} Department`
              }))
            ]}
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
            {isBn ? 'সেশন ফিল্টার' : 'Session / Batch Filter'}
          </label>
          <Select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            options={[
              { value: 'ALL', label: isBn ? 'সকল সেশন (All Sessions)' : 'All Sessions' },
              ...JSTU_SESSIONS.map((sess) => ({
                value: sess,
                label: `${sess} Batch`
              }))
            ]}
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-2.5 px-3">{isBn ? 'রেফারেন্স ও তারিখ' : 'Reference & Date'}</th>
              <th className="py-2.5 px-3">{isBn ? 'শিক্ষার্থী ও আইডি' : 'Student & ID'}</th>
              <th className="py-2.5 px-3">{isBn ? 'বিভাগ ও সেশন' : 'Dept & Session'}</th>
              <th className="py-2.5 px-3">{isBn ? 'ইমেইল ও যোগাযোগ' : 'Email & Contact'}</th>
              <th className="py-2.5 px-3">{isBn ? 'অবস্থা' : 'Status'}</th>
              <th className="py-2.5 px-3 text-right">{isBn ? 'পদক্ষেপ' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <UserCheck className="w-8 h-8 text-slate-400 stroke-[1.5]" />
                    <p className="font-medium">
                      {isBn ? 'কোনো অ্যাকাউন্ট আবেদন পাওয়া যায়নি' : 'No account requests found.'}
                    </p>
                    <p className="text-[11px]">
                      {isBn
                        ? 'ফিল্টার পরিবর্তন করে পুনরায় দেখুন।'
                        : 'Adjust the filters or search query to find student account requests.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  {/* Reference & Date */}
                  <td className="py-2.5 px-3">
                    <div className="font-mono font-bold text-blue-700 dark:text-blue-400">
                      {req.referenceNumber}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(req.createdAt).toLocaleDateString()} &bull;{' '}
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  {/* Student & ID */}
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{req.fullName}</div>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      ID: {req.studentId}
                    </div>
                  </td>

                  {/* Dept & Session */}
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{req.department}</span>
                    <div className="text-[11px] text-slate-500">{req.session || '2023-2024'}</div>
                  </td>

                  {/* Email & Phone */}
                  <td className="py-2.5 px-3">
                    <div className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">{req.email}</div>
                    {req.phone && <div className="text-[10px] text-slate-400">{req.phone}</div>}
                  </td>

                  {/* Status Badge */}
                  <td className="py-2.5 px-3">{getStatusBadge(req.status)}</td>

                  {/* Actions */}
                  <td className="py-2.5 px-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDetail(req);
                        setVerificationChecked(false);
                      }}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      {isBn ? 'বিস্তারিত / পর্যালোচনা' : 'Review'}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail & Review Modal */}
      {selectedDetail && (
        <Modal
          isOpen={!!selectedDetail}
          onClose={() => {
            setSelectedDetail(null);
            setVerificationChecked(false);
          }}
          title={isBn ? 'শিক্ষার্থী অ্যাকাউন্ট আবেদন পর্যালোচনা' : 'Review Student Account Request'}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            {/* Existing User Account Collision Warning Banner */}
            {existingMatchInfo?.matched && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    {isBn
                      ? 'সতর্কতা: বিদ্যমান অ্যাকাউন্টের সাথে মিল রয়েছে (স্বয়ংক্রিয় মার্জ করবেন না)'
                      : 'Warning: Existing Account Collision Detected (Do Not Auto-Merge)'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {isBn
                    ? `বিশ্ববিদ্যালয় ডাটাবেজে এই আইডি (${existingMatchInfo.studentId}) বা ইমেইল (${existingMatchInfo.email})-এর একজন নিবন্ধিত ${existingMatchInfo.type} (${existingMatchInfo.name}) ইতিমধ্যে বিদ্যমান রয়েছে। চূড়ান্ত অনুমোদনের পূর্বে মূল রেজিস্ট্রি খাতা পরীক্ষা করুন।`
                    : `A registered ${existingMatchInfo.type} profile (${existingMatchInfo.name}, ID: ${existingMatchInfo.studentId}, Email: ${existingMatchInfo.email}) already exists in the system database. Verify credentials against university registrar ledger before proceeding.`}
                </p>
              </div>
            )}

            {/* Applicant Summary Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Reference Number</span>
                <p className="font-mono font-bold text-blue-700 dark:text-blue-400 text-sm">
                  {selectedDetail.referenceNumber}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Application Status</span>
                <div>{getStatusBadge(selectedDetail.status)}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Student Full Name</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{selectedDetail.fullName}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Student ID / Roll</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedDetail.studentId}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Academic Department</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedDetail.department}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Session / Batch</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedDetail.session || '2023-2024'}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Email Address</span>
                <p className="font-mono text-slate-700 dark:text-slate-300">{selectedDetail.email}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Contact Phone</span>
                <p className="text-slate-700 dark:text-slate-300">{selectedDetail.phone || 'Not provided'}</p>
              </div>
            </div>

            {/* Applicant's Note */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Student Explanation / Note</span>
              <p className="text-slate-700 dark:text-slate-300 italic whitespace-pre-wrap">
                "{selectedDetail.note}"
              </p>
            </div>

            {/* Rejection / More Info History if available */}
            {selectedDetail.rejectionReason && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-red-900 dark:text-red-300 space-y-1">
                <span className="text-[10px] uppercase font-bold text-red-600">Rejection Reason</span>
                <p>{selectedDetail.rejectionReason}</p>
              </div>
            )}

            {selectedDetail.adminComment && (
              <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 rounded-xl text-sky-900 dark:text-sky-300 space-y-1">
                <span className="text-[10px] uppercase font-bold text-sky-600">Reviewer Note / Request For Info</span>
                <p>{selectedDetail.adminComment}</p>
              </div>
            )}

            {/* Mandatory Verification Checklist */}
            {selectedDetail.status !== 'APPROVED' && (
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 border-2 border-blue-200 dark:border-blue-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200">
                  <BadgeCheck className="w-4 h-4 text-blue-600" />
                  <span>{isBn ? 'বাধ্যতামূলক যাচাইকরণ চেকলিস্ট' : 'Mandatory Verification Checklist'}</span>
                </div>
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={verificationChecked}
                    onChange={(e) => setVerificationChecked(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {isBn
                      ? 'বিশ্ববিদ্যালয় নথিপত্রের সাথে শিক্ষার্থীর আইডি ও তথ্য যাচাই করা হয়েছে (Student ID verified against university records)'
                      : 'Student ID verified against university records'}
                  </span>
                </label>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-6">
                  {isBn
                    ? 'অনুমোদন নিশ্চিত করার আগে এই বক্সে টিক দেওয়া বাধ্যতামূলক। অনুমোদনের মাধ্যমে createUserAccount ক্লাউড ফাংশনের মাধ্যমে শুধুমাত্র student রোল প্রস্তুত হবে।'
                    : 'The admin must tick this verification box before Approve is enabled. Approving executes createUserAccount strictly for student role.'}
                </p>
              </div>
            )}

            {/* Related Simulated Emails */}
            {relatedEmails.length > 0 && (
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isBn ? 'সিমুলেটেড ইমেইল লগ' : 'Simulated Email Notification Log'}</span>
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono">
                    DEMO SIMULATION
                  </span>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {relatedEmails.map((log) => {
                    const tokenLinkMatch = log.body.match(/(\/set-password\?token=[a-zA-Z0-9_-]+)/);
                    return (
                      <div
                        key={log.id}
                        className="text-[11px] p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2"
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                          <span>{log.subject}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed font-mono">
                          {log.body}
                        </p>
                        {tokenLinkMatch && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2 bg-blue-50/60 dark:bg-blue-950/20 p-2 rounded">
                            <div className="truncate">
                              <span className="text-[10px] font-semibold text-blue-900 dark:text-blue-200 block">
                                {isBn ? 'সক্রিয়করণ লিংক (ডেমো):' : 'Activation Link:'}
                              </span>
                              <span className="text-[10px] font-mono text-blue-700 dark:text-blue-300 truncate block">
                                {tokenLinkMatch[1]}
                              </span>
                            </div>
                            <Link
                              to={tokenLinkMatch[1]}
                              className="px-2.5 py-1 text-[11px] bg-blue-600 hover:bg-blue-700 text-white font-medium rounded inline-flex items-center gap-1 shrink-0 transition-colors shadow-xs"
                            >
                              <span>{isBn ? 'লিংক খুলুন' : 'Open Link'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedDetail(null);
                  setVerificationChecked(false);
                }}
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </Button>

              <div className="flex flex-wrap items-center gap-2">
                {selectedDetail.status !== 'APPROVED' && (
                  <>
                    {/* Request More Info Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMoreInfoModalOpen(true)}
                      leftIcon={<HelpCircle className="w-3.5 h-3.5 text-sky-600" />}
                    >
                      {isBn ? 'অতিরিক্ত তথ্য চান' : 'Request More Info'}
                    </Button>

                    {/* Reject Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRejectionModalOpen(true)}
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 border-red-200 dark:border-red-800"
                      leftIcon={<XCircle className="w-3.5 h-3.5 text-red-600" />}
                    >
                      {isBn ? 'প্রত্যাখ্যান করুন' : 'Reject'}
                    </Button>

                    {/* Approve Button (Disabled until verification is ticked) */}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleApprove}
                      disabled={!verificationChecked || isProcessing}
                      isLoading={isProcessing}
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      {isBn ? 'শিক্ষার্থী অনুমোদন করুন' : 'Approve (Student Only)'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Modal with Mandatory Reason */}
      {rejectionModalOpen && selectedDetail && (
        <Modal
          isOpen={rejectionModalOpen}
          onClose={() => setRejectionModalOpen(false)}
          title={isBn ? 'আবেদন প্রত্যাখ্যানের কারণ' : 'Mandatory Rejection Reason'}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-400">
              {isBn
                ? 'আবেদনটি প্রত্যাখ্যান করার কারণ লিখুন। এটি শিক্ষার্থীর ট্র্যাকিং লগ ও সিমুলেটেড ইমেইলে সংরক্ষিত হবে।'
                : `Please provide a mandatory reason for rejecting request ${selectedDetail.referenceNumber}. This reason will be logged in the immutable audit trail and dispatched to the student.`}
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'প্রত্যাখ্যানের কারণ (কমপক্ষে ৫ অক্ষর) *' : 'Rejection Reason (Minimum 5 characters) *'}
              </label>
              <textarea
                required
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={
                  isBn
                    ? 'যেমন: প্রদত্ত রোল নম্বর বিশ্ববিদ্যালয় বর্তমান সেশনের ভর্তি তালিকার সাথে মিল নেই।'
                    : 'e.g. Student ID does not match current admission register for CSE 2023-2024 batch.'
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Button variant="secondary" size="sm" onClick={() => setRejectionModalOpen(false)}>
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleReject}
                isLoading={isProcessing}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isBn ? 'প্রত্যাখ্যান নিশ্চিত করুন' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Request More Info Modal with Mandatory Comment */}
      {moreInfoModalOpen && selectedDetail && (
        <Modal
          isOpen={moreInfoModalOpen}
          onClose={() => setMoreInfoModalOpen(false)}
          title={isBn ? 'অতিরিক্ত তথ্য চাওয়ার নির্দেশনা' : 'Request More Information'}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-400">
              {isBn
                ? 'শিক্ষার্থীর কাছে প্রয়োজনীয় তথ্যের বিবরণ লিখুন (যেমন: সঠিক ভর্তি রোল বা বিভাগ সংক্রান্ত স্পষ্টীকরণ)।'
                : `Specify what additional information or documents are needed for request ${selectedDetail.referenceNumber}.`}
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'রেজিস্ট্রার মন্তব্য বা নির্দেশনা (কমপক্ষে ৫ অক্ষর) *' : 'Reviewer Comment / Instructions (Min 5 chars) *'}
              </label>
              <textarea
                required
                rows={3}
                value={moreInfoComment}
                onChange={(e) => setMoreInfoComment(e.target.value)}
                placeholder={
                  isBn
                    ? 'যেমন: অনুগ্রহ করে আপনার মূল ভর্তি প্রশংসাপত্রের কপি নিয়ে সরাসরি রেজিস্ট্রার শাখায় যোগাযোগ করুন।'
                    : 'e.g. Please clarify your admission roll number or contact the academic office with your enrollment voucher.'
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Button variant="secondary" size="sm" onClick={() => setMoreInfoModalOpen(false)}>
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleRequestMoreInfo}
                isLoading={isProcessing}
                className="bg-sky-600 hover:bg-sky-700 text-white"
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                {isBn ? 'তথ্য চেয়ে পাঠান' : 'Send Request'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
};

export default AdminAccountRequestsTab;
