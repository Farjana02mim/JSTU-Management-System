import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { StudentIDCard, IDCardStatus } from '../../services/idCard/idCardService';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  CreditCard,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  AlertCircle,
  FileText
} from 'lucide-react';

interface RegistrarIdCardsTabProps {
  actorDisplayName?: string;
  onNotification?: (msg: { type: 'success' | 'error'; text: string }) => void;
}

export const RegistrarIdCardsTab: React.FC<RegistrarIdCardsTabProps> = ({
  actorDisplayName = 'Md. Abdul Mannan (Registrar)',
  onNotification
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const storeManager = SharedDataStoreManager.getInstance();

  const [cards, setCards] = useState<StudentIDCard[]>(() => storeManager.getIdCards());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | IDCardStatus>('all');

  // Status Action Modal State
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [targetCard, setTargetCard] = useState<StudentIDCard | null>(null);
  const [pendingStatus, setPendingStatus] = useState<IDCardStatus>('Lost');
  const [actionReason, setActionReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const refreshCards = () => {
    setCards(storeManager.getIdCards());
  };

  const handleOpenActionModal = (card: StudentIDCard, status: IDCardStatus) => {
    setTargetCard(card);
    setPendingStatus(status);
    setActionReason(
      status === 'Lost'
        ? 'Student reported ID card lost or misplaced on campus.'
        : status === 'Revoked'
        ? 'Administrative order by Office of Registrar pending disciplinary board hearing.'
        : 'Reinstated by Office of Registrar upon physical ID verification.'
    );
    setReasonError('');
    setActionModalOpen(true);
  };

  const handleConfirmStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCard) return;

    if (!actionReason.trim()) {
      setReasonError('Please provide a reason for the record log.');
      return;
    }

    const updated = storeManager.updateIdCardStatus(
      targetCard.id,
      pendingStatus,
      actionReason.trim(),
      actorDisplayName
    );

    if (updated) {
      refreshCards();
      setActionModalOpen(false);
      onNotification?.({
        type: 'success',
        text: isBn
          ? `শিক্ষার্থী ${targetCard.name} (${targetCard.studentId})-এর কার্ড স্ট্যাটাস "${pendingStatus}" এ পরিবর্তিত হয়েছে।`
          : `ID card for ${targetCard.name} (${targetCard.studentId}) updated to status "${pendingStatus}".`
      });
    } else {
      onNotification?.({
        type: 'error',
        text: 'Failed to update ID card status.'
      });
    }
  };

  // Filtered Cards
  const filteredCards = cards.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.studentId.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.nameBn.includes(q) ||
      c.department.toLowerCase().includes(q) ||
      c.verificationToken.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Metric counts
  const totalCount = cards.length;
  const activeCount = cards.filter((c) => c.status === 'Active').length;
  const lostCount = cards.filter((c) => c.status === 'Lost').length;
  const revokedCount = cards.filter((c) => c.status === 'Revoked').length;
  const expiredCount = cards.filter((c) => c.status === 'Expired').length;

  return (
    <div className="space-y-6">
      {/* Demo Notice Banner */}
      <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs flex items-center justify-between gap-3 text-amber-900">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-bold">
            {isBn
              ? 'ডিজিটাল আইডি কার্ড প্রশাসন — ডেমো মোড (DEMO - not an official ID)'
              : 'Digital ID Card Ledger — DEMO - not an official ID'}
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold bg-amber-200/80 px-2 py-0.5 rounded text-amber-900 shrink-0">
          REGISTRAR ACCESS
        </span>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="p-3 border border-slate-200 bg-white">
          <div className="text-[11px] font-bold text-slate-500 uppercase">
            {isBn ? 'মোট আইডি' : 'Total Issued'}
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{totalCount}</div>
        </Card>

        <Card className="p-3 border border-emerald-200 bg-emerald-50/50">
          <div className="text-[11px] font-bold text-emerald-700 uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isBn ? 'সক্রিয় (Active)' : 'Active'}</span>
          </div>
          <div className="text-xl font-extrabold text-emerald-800 mt-1">{activeCount}</div>
        </Card>

        <Card className="p-3 border border-amber-200 bg-amber-50/50">
          <div className="text-[11px] font-bold text-amber-700 uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>{isBn ? 'হারানো (Lost)' : 'Lost'}</span>
          </div>
          <div className="text-xl font-extrabold text-amber-800 mt-1">{lostCount}</div>
        </Card>

        <Card className="p-3 border border-red-200 bg-red-50/50">
          <div className="text-[11px] font-bold text-red-700 uppercase flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            <span>{isBn ? 'বাতিল (Revoked)' : 'Revoked'}</span>
          </div>
          <div className="text-xl font-extrabold text-red-800 mt-1">{revokedCount}</div>
        </Card>

        <Card className="p-3 border border-slate-200 bg-slate-50">
          <div className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{isBn ? 'মেয়াদোত্তীর্ণ (Expired)' : 'Expired'}</span>
          </div>
          <div className="text-xl font-extrabold text-slate-700 mt-1">{expiredCount}</div>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="p-4 bg-white border border-slate-200">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'শিক্ষার্থী আইডি, নাম বা বিভাগ দিয়ে খুঁজুন...' : 'Search by student ID, name, or department...'}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            >
              <option value="all">{isBn ? 'সকল স্ট্যাটাস' : 'All Statuses'}</option>
              <option value="Active">{isBn ? 'সক্রিয় (Active)' : 'Active'}</option>
              <option value="Lost">{isBn ? 'হারানো (Lost)' : 'Lost'}</option>
              <option value="Revoked">{isBn ? 'বাতিলকৃত (Revoked)' : 'Revoked'}</option>
              <option value="Expired">{isBn ? 'মেয়াদোত্তীর্ণ (Expired)' : 'Expired'}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* ID Cards Ledger Table */}
      <Card className="border border-slate-200 overflow-hidden bg-white">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {isBn ? 'স্টুডেন্ট ডিজিটাল আইডি রেজিস্টার' : 'Student Digital ID Cards Ledger'}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isBn
                ? 'রেজিস্ট্রার কর্তৃক যেকোনো কার্ড হারানো (Lost) বা বাতিল (Revoked) ঘোষণা করা যাবে।'
                : 'Manage student credential lifecycles. Flag lost badges or enforce administrative revocation.'}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Showing {filteredCards.length} of {totalCount} records
          </span>
        </div>

        {filteredCards.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            {isBn ? 'কোনো আইডি কার্ডের তথ্য পাওয়া যায়নি।' : 'No ID cards found matching the filters.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student ID &amp; Name</th>
                  <th className="py-3 px-4">Department &amp; Session</th>
                  <th className="py-3 px-4">Blood &amp; Validity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCards.map((card) => (
                  <tr key={card.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 font-mono text-xs text-[#1E3A8A]">
                        {card.studentId}
                      </div>
                      <div className="font-semibold text-slate-800">{card.name}</div>
                      <div className="text-[10px] text-slate-500">{card.nameBn}</div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{card.department}</div>
                      <div className="text-[11px] text-slate-500">Session: {card.session}</div>
                    </td>

                    {/* Blood & Validity */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded text-[11px]">
                        {card.bloodGroup}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Expires: {card.validUntil}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {card.status === 'Active' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>ACTIVE</span>
                        </span>
                      )}
                      {card.status === 'Lost' && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>LOST</span>
                          </span>
                          {card.statusReason && (
                            <div className="text-[10px] text-amber-700 italic max-w-xs mt-0.5 truncate" title={card.statusReason}>
                              {card.statusReason}
                            </div>
                          )}
                        </div>
                      )}
                      {card.status === 'Revoked' && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                            <ShieldAlert className="w-3 h-3 text-red-600" />
                            <span>REVOKED</span>
                          </span>
                          {card.statusReason && (
                            <div className="text-[10px] text-red-700 italic max-w-xs mt-0.5 truncate" title={card.statusReason}>
                              {card.statusReason}
                            </div>
                          )}
                        </div>
                      )}
                      {card.status === 'Expired' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>EXPIRED</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* Public verify link */}
                        <Link
                          to={`/verify-id/${card.verificationToken}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-500 hover:text-[#1E3A8A] hover:bg-slate-100 rounded transition-colors"
                          title="Open public verification page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* Mark Lost */}
                        {card.status !== 'Lost' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenActionModal(card, 'Lost')}
                            className="text-[11px] py-1 px-2 border-amber-300 text-amber-700 hover:bg-amber-50"
                          >
                            Mark Lost
                          </Button>
                        )}

                        {/* Revoke */}
                        {card.status !== 'Revoked' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenActionModal(card, 'Revoked')}
                            className="text-[11px] py-1 px-2 border-red-300 text-red-700 hover:bg-red-50"
                          >
                            Revoke ID
                          </Button>
                        )}

                        {/* Reactivate if Lost or Revoked */}
                        {(card.status === 'Lost' || card.status === 'Revoked') && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleOpenActionModal(card, 'Active')}
                            className="text-[11px] py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Reactivate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Action Modal (Mark Lost / Revoke / Reactivate) */}
      {targetCard && (
        <Modal
          isOpen={actionModalOpen}
          onClose={() => setActionModalOpen(false)}
          title={`Update ID Card Status: ${targetCard.studentId}`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmStatusChange} className="space-y-4 text-xs">
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                pendingStatus === 'Revoked'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : pendingStatus === 'Lost'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              {pendingStatus === 'Revoked' ? (
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              ) : pendingStatus === 'Lost' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">
                  {pendingStatus === 'Revoked'
                    ? 'Confirm Administrative Revocation'
                    : pendingStatus === 'Lost'
                    ? 'Confirm Card Lost Flag'
                    : 'Reactivate Student Identity Card'}
                </p>
                <p className="text-[11px] mt-0.5 opacity-90">
                  {pendingStatus === 'Revoked'
                    ? 'This will immediately invalidate the card on the public verification portal and deny campus access.'
                    : pendingStatus === 'Lost'
                    ? 'This marks the credential as lost. Public verification will show the card as inactive.'
                    : 'This will restore the credential to ACTIVE status on the verification ledger.'}
                </p>
              </div>
            </div>

            {/* Target Card Summary */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-800">
                  {targetCard.name} ({targetCard.studentId})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-semibold text-slate-800">{targetCard.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold text-slate-800">{targetCard.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">New Target Status:</span>
                <span className="font-black text-[#1E3A8A]">{pendingStatus}</span>
              </div>
            </div>

            {/* Reason Input */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">
                {isBn ? 'কারণ বা অফিসিয়াল নোট লিখুন:' : 'Official Note / Reason for Ledger:'}
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => {
                  setActionReason(e.target.value);
                  setReasonError('');
                }}
                rows={3}
                placeholder="e.g. Student reported missing wallet at library, disciplinary order #108..."
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-white text-xs"
              />
              {reasonError && <p className="text-[11px] text-red-600 font-semibold">{reasonError}</p>}
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActionModalOpen(false)}
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                size="sm"
                variant="primary"
                className={
                  pendingStatus === 'Revoked'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : pendingStatus === 'Lost'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }
              >
                {pendingStatus === 'Revoked'
                  ? 'Confirm Revocation'
                  : pendingStatus === 'Lost'
                  ? 'Confirm Flag as Lost'
                  : 'Reactivate Card'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
