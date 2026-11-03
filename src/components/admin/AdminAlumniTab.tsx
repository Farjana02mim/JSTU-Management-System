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
  AlumnusProfile,
  AlumniRegistrationRequest,
  AlumniDonation
} from '../../types/alumni';
import {
  Users,
  CheckCircle2,
  XCircle,
  Eye,
  DollarSign,
  Search,
  ShieldCheck,
  AlertCircle,
  GraduationCap
} from 'lucide-react';

export const AdminAlumniTab: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isBn = language === 'bn';

  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'directory' | 'donations'>('requests');
  const [requests, setRequests] = useState<AlumniRegistrationRequest[]>([]);
  const [profiles, setProfiles] = useState<AlumnusProfile[]>([]);
  const [donations, setDonations] = useState<AlumniDonation[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  // Selected request for details modal
  const [selectedReq, setSelectedReq] = useState<AlumniRegistrationRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = () => {
    const store = SharedDataStoreManager.getInstance();
    setRequests(store.getAlumniRegistrationRequests());
    setProfiles(store.getAlumniProfiles());
    setDonations(store.getAlumniDonations());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = (reqId: string) => {
    const store = SharedDataStoreManager.getInstance();
    const reviewerName = user?.displayName || 'Central Admin';
    const success = store.approveAlumniRegistration(reqId, reviewerName);
    if (success) {
      setFeedback({
        type: 'success',
        message: isBn ? 'অ্যালামনাই আবেদন সফলভাবে অনুমোদিত এবং ডিরেক্টরিতে অন্তর্ভুক্ত হয়েছে।' : 'Alumni registration approved and added to official directory.'
      });
      loadData();
      if (selectedReq?.id === reqId) {
        setSelectedReq(null);
      }
    } else {
      setFeedback({
        type: 'error',
        message: isBn ? 'অনুমোদন সম্পন্ন করা যায়নি।' : 'Failed to approve request.'
      });
    }
  };

  const handleRejectConfirm = () => {
    if (!selectedReq) return;
    const store = SharedDataStoreManager.getInstance();
    const reviewerName = user?.displayName || 'Central Admin';
    const success = store.rejectAlumniRegistration(selectedReq.id, reviewerName, rejectReason || 'Insufficient academic records');
    if (success) {
      setFeedback({
        type: 'success',
        message: isBn ? 'অ্যালামনাই আবেদন প্রত্যাখ্যাত হয়েছে।' : 'Alumni registration request rejected.'
      });
      setRejectModalOpen(false);
      setRejectReason('');
      setSelectedReq(null);
      loadData();
    }
  };

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const totalDonationAmount = donations.reduce((sum, d) => sum + d.amount, 0);

  // Filter requests
  const filteredRequests = requests.filter(r => {
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filter directory
  const filteredProfiles = profiles.filter(p => {
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.currentPosition.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Metric summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card padding="md" className="border-l-4 border-l-blue-600 bg-white">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {isBn ? 'নিবন্ধিত অ্যালামনাই' : 'Verified Alumni'}
          </span>
          <div className="text-3xl font-black text-slate-800 font-mono mt-1">
            {profiles.length}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {isBn ? 'সক্রিয় ডিরেক্টরি প্রোফাইল' : 'Active directory members'}
          </span>
        </Card>

        <Card padding="md" className="border-l-4 border-l-amber-500 bg-white">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {isBn ? 'অপেক্ষমাণ আবেদন' : 'Pending Requests'}
          </span>
          <div className="text-3xl font-black text-amber-600 font-mono mt-1">
            {pendingCount}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {isBn ? 'অ্যাডমিন যাচাইকরণের অপেক্ষায়' : 'Awaiting administrative verification'}
          </span>
        </Card>

        <Card padding="md" className="border-l-4 border-l-emerald-600 bg-white">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {isBn ? 'মোট অ্যালামনাই অনুদান' : 'Total Alumni Giving'}
          </span>
          <div className="text-3xl font-black text-emerald-600 font-mono mt-1">
            ৳{totalDonationAmount.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {donations.length} {isBn ? 'টি অবদান রেকর্ড' : 'donor contributions logged'}
          </span>
        </Card>

        <Card padding="md" className="border-l-4 border-l-indigo-600 bg-white">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {isBn ? 'উদ্যোগ ও সাফল্য' : 'Spotlight & Impact'}
          </span>
          <div className="text-3xl font-black text-indigo-600 font-mono mt-1">
            {profiles.filter(p => p.isSpotlight).length}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {isBn ? 'ফিচার্ড অ্যালামনাই সাফল্যগাথা' : 'Featured success story spotlights'}
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
            className="text-slate-400 hover:text-slate-600 font-bold ml-4"
          >
            ×
          </button>
        </div>
      )}

      {/* Sub-tabs header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200">
        <div className="flex space-x-2">
          <button
            onClick={() => { setActiveSubTab('requests'); setSearchQuery(''); }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeSubTab === 'requests'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isBn ? 'নিবন্ধন আবেদনসমূহ' : 'Registration Requests'}</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveSubTab('directory'); setSearchQuery(''); }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeSubTab === 'directory'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isBn ? 'অফিসিয়াল ডিরেক্টরি' : 'Alumni Directory'}</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-full font-bold">
              {profiles.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveSubTab('donations'); setSearchQuery(''); }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeSubTab === 'donations'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{isBn ? 'অনুদান ও সহায়তা ফান্ড' : 'Endowment & Giving Ledger'}</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64 pb-2">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? 'অনুসন্ধান করুন...' : 'Search records...'}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Subtab 1: Registration Requests */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">{isBn ? 'স্ট্যাটাস ফিল্টার:' : 'Filter status:'}</span>
              {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-500">
              {isBn ? `${filteredRequests.length}টি আবেদন দৃশ্যমান` : `Showing ${filteredRequests.length} requests`}
            </span>
          </div>

          <Card padding="none" className="overflow-hidden border border-slate-200 shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">{isBn ? 'স্নাতক নাম ও আইডি' : 'Graduate & ID'}</th>
                    <th className="py-3 px-4">{isBn ? 'বিভাগ ও ব্যাচ' : 'Dept & Batch'}</th>
                    <th className="py-3 px-4">{isBn ? 'বর্তমান ভূমিকা' : 'Current Role'}</th>
                    <th className="py-3 px-4">{isBn ? 'জমার তারিখ' : 'Submitted Date'}</th>
                    <th className="py-3 px-4">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                    <th className="py-3 px-4 text-right">{isBn ? 'পদক্ষেপ' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        {isBn ? 'কোনো অ্যালামনাই নিবন্ধন আবেদন পাওয়া যায়নি।' : 'No alumni registration requests matching your filter.'}
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map(req => (
                      <tr key={req.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">{req.fullName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">ID: {req.studentId} • {req.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-700">{req.department}</div>
                          <div className="text-[11px] text-slate-500">
                            {req.degree} ({req.graduationYear}) • Batch: {req.batch}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 font-medium">
                            {req.designation || 'Alumnus'}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {req.currentCompany || 'N/A'} {req.city && req.country ? `• ${req.city}, ${req.country}` : ''}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                          {req.appliedAt}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge
                            variant={
                              req.status === 'APPROVED' ? 'success' :
                              req.status === 'PENDING' ? 'warning' : 'danger'
                            }
                          >
                            {req.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedReq(req)}
                              className="text-[11px] py-1 px-2"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              {isBn ? 'বিবরণ' : 'Inspect'}
                            </Button>
                            {req.status === 'PENDING' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handleApprove(req.id)}
                                  className="text-[11px] py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                  {isBn ? 'অনুমোদন' : 'Approve'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => {
                                    setSelectedReq(req);
                                    setRejectModalOpen(true);
                                  }}
                                  className="text-[11px] py-1 px-2.5"
                                >
                                  <XCircle className="w-3.5 h-3.5 mr-1" />
                                  {isBn ? 'প্রত্যাখ্যান' : 'Reject'}
                                </Button>
                              </>
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
        </div>
      )}

      {/* Subtab 2: Alumni Directory */}
      {activeSubTab === 'directory' && (
        <div className="space-y-4">
          <Card padding="none" className="overflow-hidden border border-slate-200 shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">{isBn ? 'অ্যালামনাই প্রোফাইল' : 'Alumnus Profile'}</th>
                    <th className="py-3 px-4">{isBn ? 'বিভাগ ও ডিগ্রি' : 'Department & Degree'}</th>
                    <th className="py-3 px-4">{isBn ? 'বর্তমান প্রতিষ্ঠান' : 'Company & Role'}</th>
                    <th className="py-3 px-4">{isBn ? 'গোপনীয়তা সেটিংস' : 'Privacy Settings'}</th>
                    <th className="py-3 px-4">{isBn ? 'ফিচার্ড' : 'Spotlight'}</th>
                    <th className="py-3 px-4 text-right">{isBn ? 'স্ট্যাটাস' : 'Verification'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProfiles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        {isBn ? 'কোনো অ্যালামনাই প্রোফাইল খুঁজে পাওয়া যায়নি।' : 'No alumni profiles found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredProfiles.map(prof => (
                      <tr key={prof.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">{prof.name}</div>
                          <div className="text-[11px] text-slate-500">ID: {prof.studentId} • {prof.batch}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-700">{prof.departmentName}</div>
                          <div className="text-[11px] text-slate-500">
                            {prof.degree} • Class of {prof.graduatedYear}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{prof.currentPosition || 'Professional'}</div>
                          <div className="text-[11px] text-slate-500">{prof.organization || 'N/A'}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${prof.privacy.showEmail ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                              Email: {prof.privacy.showEmail ? 'Public' : 'Hidden'}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${prof.privacy.showPhone ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                              Phone: {prof.privacy.showPhone ? 'Public' : 'Hidden'}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${prof.privacy.showCurrentCompany ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                              Job: {prof.privacy.showCurrentCompany ? 'Public' : 'Hidden'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {prof.isSpotlight ? (
                            <Badge variant="success">Featured</Badge>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Standard</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Badge variant="primary">
                            <ShieldCheck className="w-3 h-3 mr-1 inline" />
                            Verified
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Subtab 3: Donations Ledger */}
      {activeSubTab === 'donations' && (
        <div className="space-y-4">
          <Card padding="none" className="overflow-hidden border border-slate-200 shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">{isBn ? 'রসিদ ট্রানজেকশন আইডি' : 'Receipt & TrxID'}</th>
                    <th className="py-3 px-4">{isBn ? 'দাতাগণ' : 'Donor Name & Batch'}</th>
                    <th className="py-3 px-4">{isBn ? 'উদ্দেশ্য / ফান্ড' : 'Purpose / Cause'}</th>
                    <th className="py-3 px-4">{isBn ? 'পেমেন্ট মেথড' : 'Method'}</th>
                    <th className="py-3 px-4">{isBn ? 'তারিখ' : 'Date'}</th>
                    <th className="py-3 px-4 text-right">{isBn ? 'পরিমাণ' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donations.map(don => (
                    <tr key={don.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-blue-900">{don.receiptNo}</div>
                        <div className="text-[10px] text-slate-400">Trx: {don.transactionId}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">
                          {don.isAnonymous ? (
                            <span className="italic text-slate-500">{isBn ? 'বেনামী শুভাকাঙ্ক্ষী' : 'Anonymous Benefactor'}</span>
                          ) : (
                            don.donorName
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {don.alumnusBatch ? `Batch: ${don.alumnusBatch}` : ''} {don.donorEmail ? `• ${don.donorEmail}` : ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-semibold text-[11px]">
                          {don.causeTitle}
                        </span>
                        {don.message && (
                          <div className="text-[11px] text-slate-500 italic mt-0.5 truncate max-w-xs">
                            "{don.message}"
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold uppercase tracking-wider text-slate-600 text-[10px] px-2 py-0.5 bg-slate-100 rounded">
                          {don.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] font-mono">
                        {don.donatedAt}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-emerald-700">
                        ৳{don.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Inspect Modal */}
      {selectedReq && !rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                {isBn ? 'অ্যালামনাই আবেদন বিবরণ' : 'Alumni Registration Details'}
              </h3>
              <button
                onClick={() => setSelectedReq(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{isBn ? 'পূর্ণ নাম' : 'Full Name'}</span>
                  <span className="font-bold text-slate-800">{selectedReq.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{isBn ? 'শিক্ষার্থী আইডি' : 'Student ID'}</span>
                  <span className="font-mono font-bold text-slate-800">{selectedReq.studentId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{isBn ? 'বিভাগ' : 'Department'}</span>
                  <span className="font-semibold text-slate-800">{selectedReq.department}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{isBn ? 'ব্যাচ ও পাস' : 'Batch & Grad Year'}</span>
                  <span className="font-semibold text-slate-800">{selectedReq.batch} ({selectedReq.graduationYear})</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{isBn ? 'কর্মসংস্থান' : 'Employment & Role'}</span>
                <p className="text-slate-800 font-medium">
                  {selectedReq.designation || 'N/A'} at {selectedReq.currentCompany || 'N/A'} ({selectedReq.city ? `${selectedReq.city}, ${selectedReq.country}` : selectedReq.country})
                </p>
              </div>

              {selectedReq.bio && (
                <div className="space-y-1">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{isBn ? 'জীবনবৃত্তান্ত / বায়ো' : 'Bio'}</span>
                  <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border text-[11px] leading-relaxed">
                    {selectedReq.bio}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{isBn ? 'অনুরোধকৃত গোপনীয়তা প্রোফাইল' : 'Requested Privacy Preferences'}</span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                  <div>Show Email: <strong className={selectedReq.privacy.showEmail ? 'text-emerald-600' : 'text-slate-400'}>{selectedReq.privacy.showEmail ? 'YES' : 'NO'}</strong></div>
                  <div>Show Phone: <strong className={selectedReq.privacy.showPhone ? 'text-emerald-600' : 'text-slate-400'}>{selectedReq.privacy.showPhone ? 'YES' : 'NO'}</strong></div>
                  <div>Show Company: <strong className={selectedReq.privacy.showCurrentCompany ? 'text-emerald-600' : 'text-slate-400'}>{selectedReq.privacy.showCurrentCompany ? 'YES' : 'NO'}</strong></div>
                  <div>Show LinkedIn: <strong className={selectedReq.privacy.showLinkedin ? 'text-emerald-600' : 'text-slate-400'}>{selectedReq.privacy.showLinkedin ? 'YES' : 'NO'}</strong></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button size="sm" variant="outline" onClick={() => setSelectedReq(null)}>
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </Button>
              {selectedReq.status === 'PENDING' && (
                <>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setRejectModalOpen(true)}
                  >
                    {isBn ? 'প্রত্যাখ্যান' : 'Reject'}
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleApprove(selectedReq.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {isBn ? 'অনুমোদন দিন' : 'Approve Request'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-rose-700 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              {isBn ? 'আবেদন প্রত্যাখ্যানের কারণ' : 'Reason for Rejection'}
            </h3>
            <p className="text-xs text-slate-600">
              {isBn
                ? `শিক্ষার্থী ${selectedReq.fullName} (${selectedReq.studentId})-এর আবেদন বাতিলের সুনির্দিষ্ট কারণ উল্লেখ করুন:`
                : `Specify why the application for ${selectedReq.fullName} (${selectedReq.studentId}) is being rejected:`}
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={isBn ? 'যেমন: বিশ্ববিদ্যালয়ের রেকর্ড বইয়ের সাথে রেজিস্ট্রেশন নম্বরের গরমিল...' : 'e.g., Degree and session could not be verified in registrar archive...'}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setRejectModalOpen(false)}>
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button size="sm" variant="danger" onClick={handleRejectConfirm}>
                {isBn ? 'প্রত্যাখ্যান নিশ্চিত করুন' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
