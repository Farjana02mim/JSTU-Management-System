import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { SkeletonLoader } from '../../../components/common/SkeletonLoader';
import { EmptyState } from '../../../components/common/EmptyState';
import { UniversityLogo } from '../../../components/common/UniversityLogo';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getStudentDataService, FeeBreakdown, FeeInvoiceItem } from '../../../services/student';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Building,
  Smartphone
} from 'lucide-react';

export const StudentFeesPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [feeData, setFeeData] = useState<FeeBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pay modal state
  const [payModalInvoice, setPayModalInvoice] = useState<FeeInvoiceItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'DBBL Nexus'>('bKash');
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [paySuccessMsg, setPaySuccessMsg] = useState<string | null>(null);

  // Receipt modal state
  const [receiptInvoice, setReceiptInvoice] = useState<FeeInvoiceItem | null>(null);

  const loadFees = async () => {
    setLoading(true);
    setError(null);
    try {
      const studentService = getStudentDataService();
      // Safe: user.uid is from the verified session, not taken from the URL
      const studentUid = user?.uid || 'demo_student_uid';
      const data = await studentService.getFees(studentUid);
      setFeeData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load fee records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, [user]);

  const handlePayNow = async () => {
    if (!payModalInvoice) return;
    setIsProcessingPay(true);
    try {
      const studentService = getStudentDataService();
      const studentUid = user?.uid || 'demo_student_uid';
      const res = await studentService.payFee(studentUid, payModalInvoice.id, paymentMethod);
      setPaySuccessMsg(res.message);
      await loadFees();
      setTimeout(() => {
        setPayModalInvoice(null);
        setPaySuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Payment failed');
    } finally {
      setIsProcessingPay(false);
    }
  };

  return (
    <DashboardLayout portalTitle={isBn ? 'ফি ও পেমেন্ট' : 'Fees & Accounts'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">
              {isBn ? 'সেমিস্টার ফি ও পেমেন্ট হিসেব' : 'Semester Fees & Payment Ledger'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn
                ? 'জেএসটিইউ অ্যাকাউন্টস শাখা — ডিজিটাল ফি ম্যানেজমেন্ট সিস্টেম।'
                : 'JSTU Accounts & Finance Section — Digital Student Billing.'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
            {isBn ? 'শিক্ষার্থী আইডি: JSTU2026001' : 'Student ID: JSTU2026001'}
          </span>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <SkeletonLoader key={i} variant="rectangular" className="h-28 w-full rounded-2xl" />
              ))}
            </div>
            <SkeletonLoader variant="rectangular" className="h-48 w-full rounded-2xl" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <Card padding="lg" className="border-red-200 bg-red-50 text-center py-8 space-y-3">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h2 className="text-sm font-bold text-red-900">{isBn ? 'ফি হিসেব লোড ব্যর্থ' : 'Unable to load fees'}</h2>
            <p className="text-xs text-red-700">{error}</p>
            <Button variant="outline" size="sm" onClick={loadFees} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              {isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
            </Button>
          </Card>
        )}

        {/* Financial Content */}
        {!loading && !error && feeData && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">{isBn ? 'মোট নির্ধারিত ফি' : 'Total Billed Amount'}</span>
                <div className="text-2xl font-extrabold text-[#0F172A] font-mono tabular-nums">
                  ৳{feeData.totalPayable.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400">{feeData.currentSemester}</p>
              </Card>

              <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">{isBn ? 'পরিশোধিত ফি' : 'Total Amount Paid'}</span>
                <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
                  ৳{feeData.totalPaid.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-600 font-medium">{isBn ? 'যাচাইকৃত ব্যাংক রসিদ' : 'Verified Transactions'}</p>
              </Card>

              <Card padding="md" className="space-y-1 bg-white border-[#E2E8F0] shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">{isBn ? 'বর্তমান বকেয়া' : 'Outstanding Balance'}</span>
                <div className={`text-2xl font-extrabold font-mono tabular-nums ${feeData.totalDue > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                  ৳{feeData.totalDue.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400">
                  {feeData.totalDue > 0 ? (isBn ? 'পরিশোধের শেষ সময়: ২০ অক্টোবর ২০২৬' : 'Due Date: 20 Oct 2026') : (isBn ? 'সকল ফি পরিশোধিত' : 'Zero Balance')}
                </p>
              </Card>
            </div>

            {/* Invoices List */}
            <Card padding="lg" className="bg-white border-[#E2E8F0] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <h2 className="text-base font-bold text-[#0F172A]">
                  {isBn ? 'ইনভয়েস তালিকা ও লেনদেন' : 'Invoices & Receipts'}
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {feeData.invoices.length} {isBn ? 'টি ইনভয়েস' : 'Invoices'}
                </span>
              </div>

              <div className="space-y-3">
                {feeData.invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 bg-white border border-[#E2E8F0] rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded">
                          {inv.invoiceNumber}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {inv.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#0F172A]">
                        {isBn ? inv.titleBn : inv.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {inv.status === 'paid' ? (
                          <>
                            Paid via <strong>{inv.paymentMethod}</strong> &bull; Txn: {inv.transactionId}
                          </>
                        ) : (
                          <>Payable before: {inv.dueDate}</>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-base font-extrabold font-mono text-[#0F172A] block">
                          ৳{inv.amount.toLocaleString()}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            inv.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>

                      {inv.status === 'paid' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReceiptInvoice(inv)}
                          leftIcon={<Printer className="w-3.5 h-3.5" />}
                        >
                          {isBn ? 'রসিদ' : 'Receipt'}
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setPayModalInvoice(inv)}
                          leftIcon={<CreditCard className="w-3.5 h-3.5" />}
                        >
                          {isBn ? 'ফি প্রদান' : 'Pay Now'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Mock Pay Now Flow Modal */}
        {payModalInvoice && (
          <Modal
            isOpen={true}
            onClose={() => setPayModalInvoice(null)}
            title={isBn ? 'অনলাইন ফি পেমেন্ট' : 'Institutional Online Payment'}
            description={`Invoice: ${payModalInvoice.invoiceNumber} — ${payModalInvoice.title}`}
          >
            <div className="space-y-4 text-xs">
              {paySuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{paySuccessMsg}</span>
                </div>
              )}

              <div className="p-4 bg-slate-50 border border-[#E2E8F0] rounded-xl flex items-center justify-between">
                <span className="font-semibold text-slate-600">{isBn ? 'পরিশোধের পরিমাণ' : 'Payable Amount'}:</span>
                <span className="text-xl font-bold font-mono text-[#1E3A8A]">৳{payModalInvoice.amount.toLocaleString()}</span>
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700">
                  {isBn ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Select Payment Gateway'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bKash', 'Nagad', 'DBBL Nexus'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                        paymentMethod === method
                          ? 'border-[#1E3A8A] bg-blue-50/50 text-[#1E3A8A]'
                          : 'border-[#E2E8F0] bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 mx-auto mb-1 text-slate-500" />
                      <span>{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-[#1E3A8A] space-y-0.5">
                <p className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Demo Gateway Sandbox:</span>
                </p>
                <p className="text-slate-600">
                  This mock flow simulates university bank reconciliation and generates a cryptographic transaction ID without charging actual money.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPayModalInvoice(null)}
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isProcessingPay}
                  onClick={handlePayNow}
                >
                  {isBn ? `৳${payModalInvoice.amount} প্রদান নিশ্চিত করুন` : `Confirm Payment (৳${payModalInvoice.amount})`}
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Digital Receipt View Modal */}
        {receiptInvoice && (
          <Modal
            isOpen={true}
            onClose={() => setReceiptInvoice(null)}
            title={isBn ? 'অফিসিয়াল পেমেন্ট রসিদ' : 'Official Payment Receipt'}
          >
            <div className="space-y-4 text-xs bg-white p-2">
              <div className="border border-[#E2E8F0] rounded-2xl p-6 space-y-4 relative overflow-hidden bg-white shadow-xs">
                {/* Official Watermark / Seal Header */}
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <div className="flex items-center gap-3">
                    <UniversityLogo size={40} />
                    <div>
                      <h3 className="font-extrabold text-sm text-[#0F172A] leading-tight">
                        Jamalpur Science & Technology University
                      </h3>
                      <p className="text-[10px] text-slate-500">Accounts & Finance Section &bull; Jamalpur-2012</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block">RECEIPT VOUCHER</span>
                    <span className="font-mono font-bold text-xs text-[#1E3A8A]">{receiptInvoice.invoiceNumber}</span>
                  </div>
                </div>

                {/* Student Details */}
                <div className="grid grid-cols-2 gap-2 text-[11px] py-1">
                  <div>
                    <span className="text-slate-400 block">Student Name:</span>
                    <span className="font-bold text-[#0F172A]">{profile?.fullName || user?.displayName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Student ID:</span>
                    <span className="font-bold font-mono text-[#0F172A]">JSTU2026001</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Department:</span>
                    <span className="font-bold text-[#0F172A]">Computer Science & Engineering</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Session / Semester:</span>
                    <span className="font-bold text-[#0F172A]">2023-2024 &bull; 6th Semester</span>
                  </div>
                </div>

                {/* Payment Line Item Table */}
                <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-bold text-slate-500">
                      <tr>
                        <th className="py-2 px-3">Description</th>
                        <th className="py-2 px-3 text-right">Amount (BDT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      <tr>
                        <td className="py-2 px-3">{receiptInvoice.title}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">৳{receiptInvoice.amount.toLocaleString()}</td>
                      </tr>
                      <tr className="bg-[#F8FAFC] font-bold">
                        <td className="py-2 px-3">Total Paid</td>
                        <td className="py-2 px-3 text-right font-mono text-emerald-600">৳{receiptInvoice.amount.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Audit & Transaction Footer */}
                <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-mono">
                  <div>
                    <p>Transaction ID: {receiptInvoice.transactionId || 'TXN-LOCAL-09281'}</p>
                    <p>Method: {receiptInvoice.paymentMethod || 'Online Gateway'}</p>
                  </div>
                  <div className="text-right">
                    <p>Status: VERIFIED & CLEARED</p>
                    <p>Timestamp: {receiptInvoice.paidAt ? new Date(receiptInvoice.paidAt).toLocaleDateString() : 'Paid'}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                >
                  {isBn ? 'প্রিন্ট রসিদ' : 'Print Receipt'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setReceiptInvoice(null)}
                >
                  {isBn ? 'বন্ধ করুন' : 'Close'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentFeesPage;
