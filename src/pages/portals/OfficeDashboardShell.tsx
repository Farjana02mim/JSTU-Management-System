import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FileCheck, ShieldCheck, UserCheck, Award, BookOpen, RotateCcw, Plus, CheckCircle2, ArrowRight } from 'lucide-react';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';

export const OfficeDashboardShell: React.FC = () => {
  const { roleKey } = useParams<{ roleKey: string }>();
  const { user, profile, claims, role } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const storeManager = SharedDataStoreManager.getInstance();

  const [store, setStore] = useState(() => storeManager.getStore());
  const [feedback, setFeedback] = useState<string | null>(null);

  const reloadStore = () => setStore({ ...storeManager.getStore() });

  const officeTitleMap: Record<string, { en: string; bn: string }> = {
    registrar: { en: 'Registrar Portal', bn: 'রেজিস্ট্রার পোর্টাল' },
    exam_controller: { en: 'Controller of Examinations Portal', bn: 'পরীক্ষা নিয়ন্ত্রক পোর্টাল' },
    account_officer: { en: 'Account & Finance Officer Portal', bn: 'হিসাব ও অর্থ কর্মকর্তা পোর্টাল' },
    library_officer: { en: 'Central Library Officer Portal', bn: 'কেন্দ্রীয় গ্রন্থাগার পোর্টাল' }
  };

  const title = (roleKey && officeTitleMap[roleKey]) || { en: 'University Office Portal', bn: 'বিশ্ববিদ্যালয় দপ্তর পোর্টাল' };

  const handleReturn = (borId: string) => {
    const res = storeManager.returnBook(borId);
    if (res.success) {
      setFeedback(res.message);
      reloadStore();
    }
  };

  const handleRenew = (borId: string) => {
    const res = storeManager.renewBorrowing(borId);
    if (res.success) {
      setFeedback(res.message);
      reloadStore();
    }
  };

  const isLibraryRole = roleKey === 'library_officer' || role === 'library_officer';

  return (
    <DashboardLayout portalTitle={isBn ? title.bn : title.en}>
      <div className="space-y-6">
        <div className="p-6 bg-gradient-to-r from-[#0A2540] to-slate-900 text-white rounded-2xl shadow-sm space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Official Office Authority &bull; {roleKey?.toUpperCase()}
              </span>
              <h1 className="text-2xl font-bold mt-1">
                {isBn ? `${title.bn}: ${profile?.fullNameBn || user?.displayName}` : `${title.en}: ${user?.displayName || 'Officer'}`}
              </h1>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Officer MFA Verified &bull; Active</span>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            {isBn
              ? 'জেএসটিইউ কেন্দ্রীয় প্রশাসন ও অটোমেটেড দাপ্তরিক রেকর্ড।'
              : 'JSTU Central Administrative Office & Automated Digital Registry.'}
          </p>
        </div>

        {feedback && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
              &times;
            </button>
          </div>
        )}

        {isLibraryRole ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card padding="md" className="space-y-1">
                <span className="text-xs text-slate-500 font-medium">Catalog Holdings</span>
                <div className="text-2xl font-extrabold text-[#0A2540] tabular-nums">
                  {store.libraryBooks.length} Titles
                </div>
                <p className="text-[11px] text-slate-400">Total Volumes: 48,500+</p>
              </Card>

              <Card padding="md" className="space-y-1">
                <span className="text-xs text-slate-500 font-medium">Active Loans</span>
                <div className="text-2xl font-extrabold text-blue-600 tabular-nums">
                  {store.libraryBorrowings.filter((b) => b.status !== 'returned').length}
                </div>
                <p className="text-[11px] text-slate-400">On Loan to Students</p>
              </Card>

              <Card padding="md" className="space-y-1">
                <span className="text-xs text-slate-500 font-medium">Overdue Accounts</span>
                <div className="text-2xl font-extrabold text-rose-600 tabular-nums">
                  {store.libraryBorrowings.filter((b) => b.status === 'overdue').length}
                </div>
                <p className="text-[11px] text-slate-400">Requiring Notice</p>
              </Card>

              <Card padding="md" className="space-y-1">
                <span className="text-xs text-slate-500 font-medium">Pending Reservations</span>
                <div className="text-2xl font-extrabold text-amber-600 tabular-nums">
                  {store.libraryReservations.filter((r) => r.status === 'pending').length}
                </div>
                <p className="text-[11px] text-slate-400">In Hold Queue</p>
              </Card>
            </div>

            {/* Live Circulation Control Table */}
            <Card padding="md" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Live Book Circulation & Return Registry
                  </h3>
                  <p className="text-xs text-slate-500">
                    Process immediate book returns with automated overdue fine calculation and clearance.
                  </p>
                </div>

                <Link to="/library">
                  <Button variant="primary" size="sm" className="text-xs">
                    <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                    <span>Open Full Library Portal & Catalog</span>
                  </Button>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Borrower Student</th>
                      <th className="p-3">Book Title</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Fine (৳)</th>
                      <th className="p-3 text-right">Officer Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {store.libraryBorrowings
                      .filter((b) => b.status !== 'returned')
                      .map((bor) => (
                        <tr key={bor.id} className="hover:bg-slate-50">
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block">{bor.studentName}</span>
                            <span className="font-mono text-slate-400 text-[10px]">Roll: {bor.studentRoll}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-800 block line-clamp-1">{bor.bookTitle}</span>
                            <span className="font-mono text-slate-400 text-[10px]">{bor.callNumber}</span>
                          </td>
                          <td className="p-3 font-mono">{bor.dueDate}</td>
                          <td className="p-3">
                            <Badge variant={bor.status === 'overdue' ? 'danger' : 'success'}>
                              {bor.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-3 font-bold text-amber-600">
                            ৳{bor.fineAmount}
                          </td>
                          <td className="p-3 text-right space-x-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRenew(bor.id)}
                              disabled={bor.renewalCount >= 2}
                              className="text-xs py-1"
                            >
                              Renew
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleReturn(bor.id)}
                              className="text-xs py-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              Return & Clear
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card padding="md" className="space-y-1">
                <span className="text-xs text-slate-500 font-medium">Pending Clearances</span>
                <div className="text-2xl font-extrabold text-[#0A2540] tabular-nums">7</div>
                <p className="text-[11px] text-slate-400">Applications in Queue</p>
              </Card>

              <Card padding="md" className="space-y-1">
                <span className="text-xs text-slate-500 font-medium">Office Registry</span>
                <div className="text-2xl font-extrabold text-emerald-600 tabular-nums">ACTIVE</div>
                <p className="text-[11px] text-slate-400">Central Ledger Synchronized</p>
              </Card>

              <Card padding="md" className="space-y-1">
                <span className="text-xs text-slate-500 font-medium">Daily Transactions</span>
                <div className="text-2xl font-extrabold text-blue-600 tabular-nums">18</div>
                <p className="text-[11px] text-slate-400">Automated Sign-Offs</p>
              </Card>
            </div>

            <Card padding="lg" className="text-center py-12 space-y-3 bg-white border-dashed border-2">
              <FileCheck className="w-10 h-10 text-blue-600 mx-auto" />
              <h2 className="text-lg font-bold text-slate-800">
                {isBn ? 'দাপ্তরিক কার্যপ্রণালী ও ডিজিটাল সেবা সক্রিয়' : 'State-Machine Office Services Active'}
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Role `{role}` verified. Multi-office clearances and paperless approvals are synchronized with the central university database.
              </p>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
