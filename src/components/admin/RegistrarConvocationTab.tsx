import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  SharedDataStoreManager
} from '../../services/shared/sharedDataStore';
import {
  ConvocationRegistration,
  ConvocationEvent
} from '../../types/convocation';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  CreditCard,
  AlertCircle,
  Calendar,
  MapPin
} from 'lucide-react';

export const RegistrarConvocationTab: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isBn = language === 'bn';

  const [event, setEvent] = useState<ConvocationEvent | null>(null);
  const [registrations, setRegistrations] = useState<ConvocationRegistration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');

  // Modal states
  const [selectedReg, setSelectedReg] = useState<ConvocationRegistration | null>(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [assignedSeat, setAssignedSeat] = useState('');
  const [gownKitVoucher, setGownKitVoucher] = useState('');

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = () => {
    const store = SharedDataStoreManager.getInstance();
    setEvent(store.getConvocationEvent());
    setRegistrations(store.getConvocationRegistrations());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenApproveModal = (reg: ConvocationRegistration) => {
    setSelectedReg(reg);
    // Auto-generate realistic seat and gown kit voucher based on department
    const randomRow = String.fromCharCode(65 + Math.floor(Math.random() * 8));
    const randomSeatNum = Math.floor(Math.random() * 40) + 1;
    const generatedSeat = `Zone ${randomRow} - Row ${Math.floor(Math.random() * 10) + 1} - Seat ${randomSeatNum < 10 ? '0' + randomSeatNum : randomSeatNum}`;
    const generatedKit = `GWN-2026-${reg.departmentCode || reg.department.slice(0, 3).toUpperCase()}-${reg.studentId.slice(-4)}`;

    setAssignedSeat(reg.assignedSeat || generatedSeat);
    setGownKitVoucher(reg.assignedGownKitId || generatedKit);
    setApproveModalOpen(true);
  };

  const handleConfirmApprove = () => {
    if (!selectedReg) return;
    const store = SharedDataStoreManager.getInstance();
    const reviewerName = user?.displayName || 'Office of the Registrar';

    const success = store.approveConvocationRegistration(
      selectedReg.id,
      reviewerName,
      assignedSeat.trim(),
      gownKitVoucher.trim()
    );

    if (success) {
      setFeedback({
        type: 'success',
        message: isBn
          ? `শিক্ষার্থী ${selectedReg.graduateName}-এর সমাবর্তন নিবন্ধন অনুমোদিত হয়েছে এবং আসন (${assignedSeat}) বরাদ্দ করা হয়েছে।`
          : `Registration approved for ${selectedReg.graduateName}. Seat assigned: ${assignedSeat}.`
      });
      setApproveModalOpen(false);
      setSelectedReg(null);
      loadData();
    } else {
      setFeedback({
        type: 'error',
        message: isBn ? 'অনুমোদন সম্পন্ন করা যায়নি।' : 'Failed to approve registration.'
      });
    }
  };

  const handleConfirmReject = () => {
    if (!selectedReg) return;
    const store = SharedDataStoreManager.getInstance();
    const reviewerName = user?.displayName || 'Office of the Registrar';

    const success = store.rejectConvocationRegistration(
      selectedReg.id,
      reviewerName,
      rejectReason || 'Academic dues pending or incomplete graduation clearance'
    );

    if (success) {
      setFeedback({
        type: 'success',
        message: isBn ? 'সমাবর্তন নিবন্ধন বাতিল করা হয়েছে।' : 'Convocation registration rejected.'
      });
      setRejectModalOpen(false);
      setRejectReason('');
      setSelectedReg(null);
      loadData();
    }
  };

  const handleSimulatePayment = (regId: string) => {
    const store = SharedDataStoreManager.getInstance();
    const dummyTrx = `MOCK-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const success = store.payConvocationFee(regId, 'bKash', dummyTrx);
    if (success) {
      setFeedback({
        type: 'success',
        message: isBn ? 'ফি পরিশোধ রেকর্ড হালনাগাদ হয়েছে।' : 'Fee payment recorded successfully.'
      });
      loadData();
      if (selectedReg?.id === regId) {
        setSelectedReg(store.getConvocationRegistrations().find(r => r.id === regId) || null);
      }
    }
  };

  // Metrics
  const totalCount = registrations.length;
  const pendingCount = registrations.filter(r => r.approvalStatus === 'PENDING').length;
  const approvedPaidCount = registrations.filter(r => r.approvalStatus === 'APPROVED' && r.paymentStatus === 'PAID').length;
  const approvedUnpaidCount = registrations.filter(r => r.approvalStatus === 'APPROVED' && r.paymentStatus === 'UNPAID').length;

  // Filter
  const filteredRegs = registrations.filter(r => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PAID' && r.paymentStatus === 'PAID') ||
      (statusFilter === 'UNPAID' && r.paymentStatus === 'UNPAID') ||
      r.approvalStatus === statusFilter;

    const matchesDept = deptFilter === 'ALL' || r.department === deptFilter;

    const matchesSearch =
      r.graduateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.passToken.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDept && matchesSearch;
  });

  const allDepts = Array.from(new Set(registrations.map(r => r.department)));

  return (
    <div className="space-y-6">
      {/* Event banner */}
      {event && (
        <Card padding="md" className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white border-none shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-700/60 text-blue-200 text-xs font-semibold">
                <GraduationCap className="w-3.5 h-3.5" />
                {event.edition}
              </div>
              <h2 className="text-xl font-bold tracking-tight">{isBn ? event.editionBn : event.edition}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-300" />
                  {event.dateFormatted}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-300" />
                  {isBn ? event.venueBn : event.venue}
                </span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-xs space-y-1 shrink-0">
              <div className="text-blue-200 text-[11px] font-semibold">{isBn ? 'নিবন্ধন ফি কাঠামো' : 'Registration Fee'}</div>
              <div className="font-mono font-bold text-base text-white">৳{event.graduateFee.toLocaleString()} (Student)</div>
              <div className="text-[10px] text-blue-200">৳{event.guestFee.toLocaleString()}/guest (Max {event.maxGuests})</div>
            </div>
          </div>
        </Card>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card padding="md" className="border-l-4 border-l-blue-600 bg-white">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {isBn ? 'মোট আবেদন' : 'Total Registered'}
          </span>
          <div className="text-3xl font-black text-slate-800 font-mono mt-1">
            {totalCount}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {isBn ? 'সকল বিভাগের নিবন্ধিত স্নাতক' : 'All eligible graduate submissions'}
          </span>
        </Card>

        <Card padding="md" className="border-l-4 border-l-amber-500 bg-white">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {isBn ? 'অনুমোদনের অপেক্ষায়' : 'Pending Registrar Review'}
          </span>
          <div className="text-3xl font-black text-amber-600 font-mono mt-1">
            {pendingCount}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {isBn ? 'যাচাই ও আসন বরাদ্দ প্রয়োজন' : 'Awaiting clearance & seat assignment'}
          </span>
        </Card>

        <Card padding="md" className="border-l-4 border-l-emerald-600 bg-white">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {isBn ? 'অনুমোদিত ও ফি পরিশোধিত' : 'Cleared & Paid'}
          </span>
          <div className="text-3xl font-black text-emerald-600 font-mono mt-1">
            {approvedPaidCount}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {isBn ? 'পাস ও গাউন কিট উত্তোলনে প্রস্তুত' : 'Pass ready & kit allocation finalized'}
          </span>
        </Card>

        <Card padding="md" className="border-l-4 border-l-indigo-600 bg-white">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {isBn ? 'অনুমোদিত কিন্তু বকেয়া' : 'Approved (Unpaid)'}
          </span>
          <div className="text-3xl font-black text-indigo-600 font-mono mt-1">
            {approvedUnpaidCount}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {isBn ? 'ফি পরিশোধের অপেক্ষায়' : 'Awaiting payment confirmation'}
          </span>
        </Card>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-600 hover:text-slate-600 font-bold ml-4"
          >
            ×
          </button>
        </div>
      )}

      {/* Search and Filter toolbar */}
      <Card padding="md" className="bg-white border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'স্নাতকের নাম, আইডি, ইমেইল বা ভেরিফিকেশন টোকেন খুঁজুন...' : 'Search student, ID, email, verification token...'}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">{isBn ? 'সকল স্ট্যাটাস' : 'All Statuses'}</option>
              <option value="PENDING">{isBn ? 'অপেক্ষমাণ' : 'Pending Approval'}</option>
              <option value="APPROVED">{isBn ? 'অনুমোদিত' : 'Approved'}</option>
              <option value="PAID">{isBn ? 'ফি পরিশোধিত' : 'Paid'}</option>
              <option value="UNPAID">{isBn ? 'বকেয়া' : 'Unpaid'}</option>
              <option value="REJECTED">{isBn ? 'প্রত্যাখ্যাত' : 'Rejected'}</option>
            </select>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">{isBn ? 'সকল বিভাগ' : 'All Departments'}</option>
              {allDepts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none" className="overflow-hidden border border-slate-200 shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">{isBn ? 'স্নাতক ও আইডি' : 'Graduate & ID'}</th>
                <th className="py-3 px-4">{isBn ? 'বিভাগ ও ফলাফল' : 'Dept & CGPA'}</th>
                <th className="py-3 px-4">{isBn ? 'গাউন ও অতিথি' : 'Gown & Guests'}</th>
                <th className="py-3 px-4">{isBn ? 'নিবন্ধন স্ট্যাটাস' : 'Registration'}</th>
                <th className="py-3 px-4">{isBn ? 'ফি পরিশোধ' : 'Payment'}</th>
                <th className="py-3 px-4">{isBn ? 'বরাদ্দকৃত আসন / ভাউচার' : 'Seat / Kit'}</th>
                <th className="py-3 px-4 text-right">{isBn ? 'পদক্ষেপ' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRegs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-600">
                    {isBn ? 'কোনো সমাবর্তন নিবন্ধন পাওয়া যায়নি।' : 'No convocation registrations match the filters.'}
                  </td>
                </tr>
              ) : (
                filteredRegs.map(reg => (
                  <tr key={reg.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{reg.graduateName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {reg.studentId} • {reg.passingSession}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-700">{reg.department}</div>
                      <div className="text-[11px] text-slate-500">
                        {reg.degree} • CGPA: <span className="font-mono font-bold text-slate-700">{reg.cgpa.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-700">
                          Size {reg.gownSize}
                        </span>
                        {reg.guestCount > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold">
                            +{reg.guestCount} guest(s)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          reg.approvalStatus === 'APPROVED' ? 'success' :
                          reg.approvalStatus === 'PENDING' ? 'warning' : 'danger'
                        }
                      >
                        {reg.approvalStatus}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={reg.paymentStatus === 'PAID' ? 'success' : 'warning'}
                      >
                        {reg.paymentStatus}
                      </Badge>
                      <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                        ৳{reg.totalFee.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {reg.assignedSeat ? (
                        <div>
                          <div className="font-bold text-slate-800 text-[11px]">{reg.assignedSeat}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{reg.assignedGownKitId}</div>
                        </div>
                      ) : (
                        <span className="text-slate-600 italic text-[11px]">
                          {isBn ? 'বরাদ্দহীন' : 'Unassigned'}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedReg(reg)}
                          className="text-[11px] py-1 px-2"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          {isBn ? 'বিবরণ' : 'Details'}
                        </Button>

                        {reg.approvalStatus === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleOpenApproveModal(reg)}
                            className="text-[11px] py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            {isBn ? 'অনুমোদন' : 'Approve'}
                          </Button>
                        )}

                        {reg.approvalStatus === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              setSelectedReg(reg);
                              setRejectModalOpen(true);
                            }}
                            className="text-[11px] py-1 px-2"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            {isBn ? 'বাতিল' : 'Reject'}
                          </Button>
                        )}

                        {reg.approvalStatus === 'APPROVED' && reg.paymentStatus === 'UNPAID' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSimulatePayment(reg.id)}
                            className="text-[11px] py-1 px-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                          >
                            <CreditCard className="w-3.5 h-3.5 mr-1" />
                            {isBn ? 'পেমেন্ট মার্ক' : 'Mark Paid'}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Details & Pass Modal */}
      {selectedReg && !approveModalOpen && !rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                {isBn ? 'সমাবর্তন নিবন্ধন রেকর্ড' : 'Convocation Registration Record'}
              </h3>
              <button
                onClick={() => setSelectedReg(null)}
                className="text-slate-600 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Graduate info */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">{isBn ? 'স্নাতকের নাম' : 'Graduate Name'}</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedReg.graduateName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">{isBn ? 'শিক্ষার্থী আইডি' : 'Student ID'}</span>
                  <span className="font-mono font-bold text-slate-900">{selectedReg.studentId}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">{isBn ? 'বিভাগ ও ডিগ্রি' : 'Department & Degree'}</span>
                  <span className="font-semibold text-slate-800">{selectedReg.department} • {selectedReg.degree}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">{isBn ? 'সিজিপিএ ও সেশন' : 'CGPA & Session'}</span>
                  <span className="font-mono font-semibold text-slate-800">CGPA: {selectedReg.cgpa.toFixed(2)} • {selectedReg.passingSession}</span>
                </div>
              </div>

              {/* Gown & guest info */}
              <div className="grid grid-cols-3 gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-800 block">{isBn ? 'গাউন সাইজ' : 'Gown Size'}</span>
                  <span className="font-bold text-blue-900 text-sm">{selectedReg.gownSize}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-800 block">{isBn ? 'অতিথি সংখ্যা' : 'Guest Count'}</span>
                  <span className="font-bold text-blue-900 text-sm">{selectedReg.guestCount} person(s)</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-800 block">{isBn ? 'মোট ফি' : 'Total Payable'}</span>
                  <span className="font-mono font-bold text-blue-900 text-sm">৳{selectedReg.totalFee.toLocaleString()}</span>
                </div>
              </div>

              {/* Status and seat */}
              <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">{isBn ? 'নিবন্ধন স্ট্যাটাস:' : 'Registration Status:'}</span>
                  <Badge variant={selectedReg.approvalStatus === 'APPROVED' ? 'success' : 'warning'}>
                    {selectedReg.approvalStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">{isBn ? 'ফি পরিশোধ স্ট্যাটাস:' : 'Payment Status:'}</span>
                  <Badge variant={selectedReg.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                    {selectedReg.paymentStatus}
                  </Badge>
                </div>
                {selectedReg.assignedSeat && (
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-slate-600 font-semibold">{isBn ? 'বরাদ্দকৃত আসন:' : 'Assigned Seat:'}</span>
                    <span className="font-bold text-blue-900">{selectedReg.assignedSeat}</span>
                  </div>
                )}
                {selectedReg.assignedGownKitId && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">{isBn ? 'গাউন কিট ভাউচার কোড:' : 'Gown Kit Voucher:'}</span>
                    <span className="font-mono font-bold text-slate-800">{selectedReg.assignedGownKitId}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t pt-2">
                  <span>{isBn ? 'ভেরিফিকেশন টোকেন:' : 'Verification Token:'}</span>
                  <span className="font-mono text-slate-600">{selectedReg.passToken}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button size="sm" variant="outline" onClick={() => setSelectedReg(null)}>
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </Button>
              {selectedReg.approvalStatus === 'PENDING' && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleOpenApproveModal(selectedReg)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  {isBn ? 'অনুমোদন দিন' : 'Approve & Assign Seat'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal with Seat Allocation */}
      {approveModalOpen && selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {isBn ? 'সমাবর্তন নিবন্ধন অনুমোদন ও আসন বরাদ্দ' : 'Approve Registration & Allocate Seat'}
            </h3>
            <p className="text-xs text-slate-600">
              {isBn
                ? `${selectedReg.graduateName} (${selectedReg.studentId})-এর জন্য সমাবর্তন অডিটোরিয়ামে আসন ও গাউন কিট টোকেন নির্ধারণ করুন:`
                : `Finalize seat assignment and gown kit allocation voucher for ${selectedReg.graduateName} (${selectedReg.studentId}):`}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isBn ? 'বরাদ্দকৃত আসন নম্বর / জোন' : 'Auditorium Zone & Seat'}
                </label>
                <input
                  type="text"
                  value={assignedSeat}
                  onChange={(e) => setAssignedSeat(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold"
                  placeholder="e.g., Zone B - Row 03 - Seat 14"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isBn ? 'গাউন কিট ভাউচার কোড' : 'Gown Kit Voucher Code'}
                </label>
                <input
                  type="text"
                  value={gownKitVoucher}
                  onChange={(e) => setGownKitVoucher(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono font-bold"
                  placeholder="e.g., GWN-2026-CSE-102"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button size="sm" variant="outline" onClick={() => setApproveModalOpen(false)}>
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleConfirmApprove}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {isBn ? 'অনুমোদন নিশ্চিত করুন' : 'Confirm Approval'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-rose-700 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              {isBn ? 'সমাবর্তন নিবন্ধন বাতিলের কারণ' : 'Reason for Invalidation'}
            </h3>
            <p className="text-xs text-slate-600">
              {isBn
                ? `শিক্ষার্থী ${selectedReg.graduateName} (${selectedReg.studentId})-এর নিবন্ধন বাতিলের কারণ উল্লেখ করুন:`
                : `Specify reason for rejecting ${selectedReg.graduateName}'s convocation application:`}
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={isBn ? 'যেমন: হল ডিউ বকেয়া রয়েছে বা সার্টিফিকেট যাচাইকরণ অসম্পূর্ণ...' : 'e.g., Unresolved hall dues or incomplete academic clearance...'}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setRejectModalOpen(false)}>
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button size="sm" variant="danger" onClick={handleConfirmReject}>
                {isBn ? 'বাতিল নিশ্চিত করুন' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
