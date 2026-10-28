import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Eye,
  ShieldCheck,
  UserCheck,
  QrCode,
  FileText,
  AlertCircle,
  GraduationCap,
  Calendar,
  Building2,
  MapPin,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  AdmissionApplication,
  AdmissionApplicationStatus,
  AdmissionUnit
} from '../../types/admission';
import { getAdmissionService } from '../../services/admission/admissionService';

export const AdmissionApplicationsManagementTab: React.FC<{
  reviewerRole?: 'admin' | 'registrar' | 'super_admin';
  reviewerDisplayName?: string;
}> = ({
  reviewerRole = 'registrar',
  reviewerDisplayName = 'Academic Registrar'
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [unitFilter, setUnitFilter] = useState('all');
  const [quotaFilter, setQuotaFilter] = useState('all');

  // Detail Modal State
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Shortlist Modal State
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [appToShortlist, setAppToShortlist] = useState<AdmissionApplication | null>(null);
  const [rollInput, setRollInput] = useState('');
  const [venueInput, setVenueInput] = useState('');
  const [dateInput, setDateInput] = useState('January 08, 2027');
  const [timeInput, setTimeInput] = useState('10:00 AM - 11:30 AM');

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [appToReject, setAppToReject] = useState<AdmissionApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // PDF Generation State
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const loadData = () => {
    const service = getAdmissionService();
    const list = service.getAllApplications({
      status: statusFilter,
      unit: unitFilter,
      quota: quotaFilter,
      search: searchQuery
    });
    setApplications(list);
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, unitFilter, quotaFilter, searchQuery]);

  // Actions
  const handleOpenShortlist = (app: AdmissionApplication) => {
    setAppToShortlist(app);
    const unitPrefix = app.programChoice.unit === 'UNIT_A' ? 'A' : app.programChoice.unit === 'UNIT_B' ? 'B' : 'C';
    setRollInput(app.testRollNumber || `${unitPrefix}-${Math.floor(10000 + Math.random() * 90000)}`);
    setVenueInput(
      app.examVenue ||
        (app.programChoice.unit === 'UNIT_A'
          ? 'Faculty of Engineering Complex, Room 302, Academic Block A'
          : 'Central Academic Complex, Lecture Hall 1')
    );
    setDateInput(app.examDate || 'January 08, 2027');
    setTimeInput(app.examTime || '10:00 AM - 11:30 AM');
    setShortlistModalOpen(true);
  };

  const handleConfirmShortlist = () => {
    if (!appToShortlist) return;
    try {
      const service = getAdmissionService();
      const updated = service.shortlistApplication(
        appToShortlist.id,
        rollInput,
        venueInput,
        dateInput,
        timeInput,
        reviewerDisplayName
      );
      setShortlistModalOpen(false);
      setAppToShortlist(null);
      loadData();
      setFeedbackSuccess(
        isBn
          ? `আবেদন (${updated.referenceNumber}) সফলভাবে শর্টলিস্ট করা হয়েছে ও প্রবেশপত্র ইস্যু হয়েছে (রোল: ${updated.testRollNumber})।`
          : `Application (${updated.referenceNumber}) shortlisted and Admit Card issued with Roll: ${updated.testRollNumber}.`
      );
      setTimeout(() => setFeedbackSuccess(null), 4000);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleApprove = (app: AdmissionApplication) => {
    try {
      const service = getAdmissionService();
      const updated = service.approveApplication(app.id, reviewerDisplayName);
      loadData();
      if (selectedApp?.id === app.id) setSelectedApp(updated);
      setFeedbackSuccess(
        isBn
          ? `আবেদন (${updated.referenceNumber}) চূড়ান্তভাবে অনুমোদিত হয়েছে।`
          : `Application (${updated.referenceNumber}) officially approved and merit seat confirmed.`
      );
      setTimeout(() => setFeedbackSuccess(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenReject = (app: AdmissionApplication) => {
    setAppToReject(app);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!appToReject) return;
    if (!rejectionReason.trim()) return;

    try {
      const service = getAdmissionService();
      const updated = service.rejectApplication(
        appToReject.id,
        rejectionReason.trim(),
        reviewerDisplayName
      );
      setRejectModalOpen(false);
      setAppToReject(null);
      loadData();
      if (selectedApp?.id === appToReject.id) setSelectedApp(updated);
      setFeedbackSuccess(
        isBn
          ? `আবেদন (${updated.referenceNumber}) বাতিল করা হয়েছে।`
          : `Application (${updated.referenceNumber}) rejected with scrutiny remarks.`
      );
      setTimeout(() => setFeedbackSuccess(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrintAdmitCard = async (app: AdmissionApplication) => {
    try {
      setGeneratingPdfId(app.id);
      const service = getAdmissionService();
      await service.generateAdmitCardPdf(app);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPdfId(null);
    }
  };

  // Metrics
  const allApps = getAdmissionService().getAllApplications();
  const totalCount = allApps.length;
  const submittedCount = allApps.filter((a) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length;
  const shortlistedCount = allApps.filter((a) => a.status === 'SHORTLISTED').length;
  const approvedCount = allApps.filter((a) => a.status === 'APPROVED').length;
  const rejectedCount = allApps.filter((a) => a.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="p-4 border border-[#E2E8F0] bg-white">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
            {isBn ? 'মোট আবেদন' : 'Total Applications'}
          </span>
          <span className="text-2xl font-black text-[#0F172A] mt-1 block">
            {totalCount}
          </span>
        </Card>

        <Card className="p-4 border border-blue-200 bg-blue-50/40">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide block">
            {isBn ? 'যাচাইয়ের অপেক্ষায়' : 'Pending Scrutiny'}
          </span>
          <span className="text-2xl font-black text-[#1E3A8A] mt-1 block">
            {submittedCount}
          </span>
        </Card>

        <Card className="p-4 border border-emerald-200 bg-emerald-50/40">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide block">
            {isBn ? 'শর্টলিস্ট ও প্রবেশপত্র' : 'Shortlisted / Pass'}
          </span>
          <span className="text-2xl font-black text-emerald-800 mt-1 block">
            {shortlistedCount}
          </span>
        </Card>

        <Card className="p-4 border border-green-200 bg-green-50/40">
          <span className="text-[11px] font-bold text-green-700 uppercase tracking-wide block">
            {isBn ? 'চূড়ান্ত অনুমোদিত' : 'Approved / Admitted'}
          </span>
          <span className="text-2xl font-black text-green-800 mt-1 block">
            {approvedCount}
          </span>
        </Card>

        <Card className="p-4 border border-red-200 bg-red-50/40 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-red-700 uppercase tracking-wide block">
            {isBn ? 'বাতিলকৃত' : 'Disqualified'}
          </span>
          <span className="text-2xl font-black text-red-800 mt-1 block">
            {rejectedCount}
          </span>
        </Card>
      </div>

      {/* Global Feedback Alert */}
      {feedbackSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{feedbackSuccess}</span>
          </div>
          <button
            onClick={() => setFeedbackSuccess(null)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <Card className="p-4 border border-[#E2E8F0] bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative sm:col-span-1">
            <Input
              placeholder={isBn ? 'রেফারেন্স, নাম বা রোল দিয়ে খুঁজুন...' : 'Search ref no, name, email, roll...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select
            label=""
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: isBn ? 'সকল স্ট্যাটাস' : 'All Statuses' },
              { value: 'SUBMITTED', label: isBn ? 'দাখিলকৃত (Submitted)' : 'Submitted' },
              { value: 'UNDER_REVIEW', label: isBn ? 'বিবেচনাধীন (Under Review)' : 'Under Review' },
              { value: 'SHORTLISTED', label: isBn ? 'শর্টলিস্টেড (Shortlisted)' : 'Shortlisted' },
              { value: 'APPROVED', label: isBn ? 'অনুমোদিত (Approved)' : 'Approved' },
              { value: 'REJECTED', label: isBn ? 'বাতিলকৃত (Rejected)' : 'Rejected' }
            ]}
          />

          <Select
            label=""
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            options={[
              { value: 'all', label: isBn ? 'সকল ইউনিট' : 'All Units' },
              { value: 'UNIT_A', label: 'Unit A (Science & Engg)' },
              { value: 'UNIT_B', label: 'Unit B (Social Sciences)' },
              { value: 'UNIT_C', label: 'Unit C (Business Studies)' }
            ]}
          />

          <Select
            label=""
            value={quotaFilter}
            onChange={(e) => setQuotaFilter(e.target.value)}
            options={[
              { value: 'all', label: isBn ? 'সকল কোটা' : 'All Quota Categories' },
              { value: 'NONE', label: 'General (No Quota)' },
              { value: 'FREEDOM_FIGHTER', label: 'Freedom Fighter (5%)' },
              { value: 'TRIBAL_ETHNIC', label: 'Tribal / Ethnic (2%)' },
              { value: 'DISABILITY', label: 'Disability (1%)' },
              { value: 'WARD', label: 'Internal Ward' }
            ]}
          />
        </div>
      </Card>

      {/* Applications Table */}
      <div className="overflow-x-auto bg-white border border-[#E2E8F0] rounded-2xl shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] text-slate-700 border-b border-[#E2E8F0] font-semibold">
            <tr>
              <th className="py-3.5 px-4">Ref Number</th>
              <th className="py-3.5 px-4">Applicant & Contact</th>
              <th className="py-3.5 px-4">Unit & 1st Choice</th>
              <th className="py-3.5 px-4 text-center">HSC / SSC GPA</th>
              <th className="py-3.5 px-4">Quota</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Workflow Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-slate-600">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  {isBn ? 'কোনো আবেদন পাওয়া যায়নি।' : 'No admission applications match the selected criteria.'}
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[#1E3A8A] block">
                      {app.referenceNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </span>
                    {app.testRollNumber && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-bold font-mono">
                        Roll: {app.testRollNumber}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#0F172A] block">
                      {app.personalInfo.fullName}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate block max-w-[180px]">
                      {app.personalInfo.email}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      {app.personalInfo.phone}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-slate-100 text-slate-700 block w-fit mb-1">
                      {app.programChoice.unit.replace('_', ' ')}
                    </span>
                    <span className="font-bold text-[#0F172A]">
                      1st: {app.programChoice.firstChoiceDept}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      (2nd: {app.programChoice.secondChoiceDept}, 3rd: {app.programChoice.thirdChoiceDept})
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-emerald-700 block">
                      HSC: {app.academicInfo.hscGpa.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      SSC: {app.academicInfo.sscGpa.toFixed(2)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        app.personalInfo.quota === 'NONE'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {app.personalInfo.quota.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {app.status === 'SUBMITTED' && (
                      <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                        Submitted
                      </span>
                    )}
                    {app.status === 'UNDER_REVIEW' && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Under Review
                      </span>
                    )}
                    {app.status === 'SHORTLISTED' && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Shortlisted
                      </span>
                    )}
                    {app.status === 'APPROVED' && (
                      <span className="px-2.5 py-1 rounded-full bg-green-600 text-white text-[10px] font-bold">
                        Approved
                      </span>
                    )}
                    {app.status === 'REJECTED' && (
                      <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                        Rejected
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Details */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedApp(app);
                          setIsDetailModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                        title="View Full Application File"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Shortlist Action */}
                      {app.status !== 'SHORTLISTED' && app.status !== 'APPROVED' && (
                        <button
                          type="button"
                          onClick={() => handleOpenShortlist(app)}
                          className="px-2 py-1 rounded-lg bg-[#1E3A8A] text-white hover:bg-blue-800 text-[11px] font-bold transition cursor-pointer"
                          title="Shortlist and Issue Admit Pass"
                        >
                          Shortlist
                        </button>
                      )}

                      {/* Approve Action */}
                      {app.status !== 'APPROVED' && (
                        <button
                          type="button"
                          onClick={() => handleApprove(app)}
                          className="p-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                          title="Approve Final Admission"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Reject Action */}
                      {app.status !== 'REJECTED' && (
                        <button
                          type="button"
                          onClick={() => handleOpenReject(app)}
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Reject / Disqualify Application"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Print Admit Card PDF */}
                      {(app.status === 'SHORTLISTED' || app.status === 'APPROVED') && (
                        <button
                          type="button"
                          onClick={() => handlePrintAdmitCard(app)}
                          disabled={generatingPdfId === app.id}
                          className="p-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-900 transition cursor-pointer"
                          title="Download Printable Admit Card PDF with QR"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Application File: ${selectedApp.referenceNumber}`}
          description={`${selectedApp.personalInfo.fullName} (${selectedApp.personalInfo.fullNameBn})`}
        >
          <div className="space-y-6 text-xs max-h-[75vh] overflow-y-auto pr-1">
            {/* Status & Reviewer Pill */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block">{isBn ? 'বর্তমান স্ট্যাটাস:' : 'Current Status:'}</span>
                <span className="font-bold text-sm text-[#0F172A]">{selectedApp.status}</span>
              </div>
              {selectedApp.testRollNumber && (
                <div>
                  <span className="text-slate-400 block">Assigned Roll:</span>
                  <span className="font-mono font-bold text-sm text-[#1E3A8A]">{selectedApp.testRollNumber}</span>
                </div>
              )}
              {selectedApp.reviewedBy && (
                <div>
                  <span className="text-slate-400 block">Reviewed By:</span>
                  <span className="font-medium text-slate-700">{selectedApp.reviewedBy}</span>
                </div>
              )}
            </div>

            {/* Personal Details */}
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-[#1E3A8A]">Personal & Contact Credentials</h4>
              <div className="grid grid-cols-2 gap-3 p-3 bg-white border rounded-xl">
                <div>Father: <strong className="text-slate-900">{selectedApp.personalInfo.fatherName}</strong></div>
                <div>Mother: <strong className="text-slate-900">{selectedApp.personalInfo.motherName}</strong></div>
                <div>DOB: <strong className="text-slate-900">{selectedApp.personalInfo.dateOfBirth}</strong></div>
                <div>Gender: <strong className="text-slate-900">{selectedApp.personalInfo.gender}</strong></div>
                <div>Phone: <strong className="text-slate-900">{selectedApp.personalInfo.phone}</strong></div>
                <div>Email: <strong className="text-slate-900">{selectedApp.personalInfo.email}</strong></div>
                <div>NID/Birth: <strong className="text-slate-900">{selectedApp.personalInfo.nationalIdOrBirthCert}</strong></div>
                <div>Quota: <strong className="text-[#1E3A8A]">{selectedApp.personalInfo.quota}</strong></div>
                <div className="col-span-2">Address: <span className="text-slate-700">{selectedApp.personalInfo.presentAddress}</span></div>
              </div>
            </div>

            {/* Academic Marks */}
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-[#1E3A8A]">Academic Records & Grades</h4>
              <div className="grid grid-cols-2 gap-3 p-3 bg-white border rounded-xl">
                <div>
                  SSC: <strong>{selectedApp.academicInfo.sscBoard} (Roll: {selectedApp.academicInfo.sscRoll})</strong>
                  <span className="block text-emerald-700 font-bold">GPA: {selectedApp.academicInfo.sscGpa.toFixed(2)} ({selectedApp.academicInfo.sscPassingYear})</span>
                </div>
                <div>
                  HSC: <strong>{selectedApp.academicInfo.hscBoard} (Roll: {selectedApp.academicInfo.hscRoll})</strong>
                  <span className="block text-emerald-700 font-bold">GPA: {selectedApp.academicInfo.hscGpa.toFixed(2)} ({selectedApp.academicInfo.hscPassingYear})</span>
                </div>
                <div className="col-span-2 border-t pt-2 text-[11px] text-slate-600">
                  HSC Subjects: Math ({selectedApp.academicInfo.hscMathGrade || 'N/A'}), Physics ({selectedApp.academicInfo.hscPhysicsGrade || 'N/A'}), Chem ({selectedApp.academicInfo.hscChemistryGrade || 'N/A'}), Eng ({selectedApp.academicInfo.hscEnglishGrade || 'N/A'})
                </div>
              </div>
            </div>

            {/* Uploaded Documents List */}
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-[#1E3A8A]">Uploaded Documents</h4>
              <div className="space-y-1.5">
                {Object.entries(selectedApp.documents).map(([k, doc]) => (
                  <div key={k} className="p-2.5 bg-slate-50 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#1E3A8A]" />
                      <div>
                        <strong className="capitalize text-slate-800">{k.replace(/([A-Z])/g, ' $1')}:</strong>{' '}
                        <span className="text-slate-600">{doc.fileName}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {(doc.fileSize / 1024).toFixed(0)} KB &bull; Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rejection Remark if any */}
            {selectedApp.rejectionReason && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900">
                <strong>Rejection Reason:</strong>
                <p className="mt-1">{selectedApp.rejectionReason}</p>
              </div>
            )}

            {/* Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePrintAdmitCard(selectedApp)}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Download Admit Card (PDF)
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {selectedApp.status !== 'APPROVED' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleApprove(selectedApp)}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Approve
                  </Button>
                )}
                {selectedApp.status !== 'REJECTED' && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleOpenReject(selectedApp);
                    }}
                    leftIcon={<XCircle className="w-3.5 h-3.5" />}
                  >
                    Reject
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Shortlist Modal */}
      {appToShortlist && (
        <Modal
          isOpen={shortlistModalOpen}
          onClose={() => setShortlistModalOpen(false)}
          title={`Shortlist & Issue Admit Pass: ${appToShortlist.referenceNumber}`}
          description={`Applicant: ${appToShortlist.personalInfo.fullName} | Unit: ${appToShortlist.programChoice.unit}`}
        >
          <div className="space-y-4 text-xs">
            <Input
              label="Assigned Test Roll Number"
              required
              value={rollInput}
              onChange={(e) => setRollInput(e.target.value)}
            />
            <Input
              label="Examination Hall / Room & Building"
              required
              value={venueInput}
              onChange={(e) => setVenueInput(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Examination Date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
              />
              <Input
                label="Reporting & Exam Time"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
              />
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
              This action will mark the application as <strong>SHORTLISTED</strong> and generate the cryptographically verifiable QR Admit Card for candidate download.
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShortlistModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmShortlist}>
                Confirm Shortlist & Issue Admit
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {appToReject && (
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title={`Reject Application: ${appToReject.referenceNumber}`}
          description={`Candidate: ${appToReject.personalInfo.fullName}`}
        >
          <div className="space-y-4 text-xs">
            <label className="block font-semibold text-slate-700">
              Official Scrutiny Rejection Note (Visible to Applicant) *
            </label>
            <textarea
              rows={3}
              required
              className="w-full p-3 border rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="e.g. HSC Math grade minimum threshold not met, or missing clear transcript attachment..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmReject}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
