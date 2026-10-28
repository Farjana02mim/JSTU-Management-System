import React, { useState } from 'react';
import {
  Briefcase,
  FileText,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Modal } from '../../components/common/Modal';
import { useLanguage } from '../../contexts/LanguageContext';
import { careerAndTendersData } from '../../data/publicSectionsSeedData';
import { CareerTenderItem, OpportunityType } from '../../types/publicSections';

export const CareerPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [activeTab, setActiveTab] = useState<OpportunityType>('job');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<CareerTenderItem | null>(null);

  const jobCategories = [
    { key: 'all', label: 'All Positions', labelBn: 'সকল পদ' },
    { key: 'Faculty', label: 'Faculty & Teachers', labelBn: 'শিক্ষক নিয়োগ' },
    { key: 'Officer', label: 'Administrative Officers', labelBn: 'কর্মকর্তা নিয়োগ' },
    { key: 'Staff', label: 'Technical & Support Staff', labelBn: 'কর্মচারী নিয়োগ' }
  ];

  const tenderCategories = [
    { key: 'all', label: 'All Tenders', labelBn: 'সকল দরপত্র' },
    { key: 'Procurement Goods', label: 'Goods & Lab Equipment', labelBn: 'যন্ত্রপাতি ও মালামাল' },
    { key: 'Works', label: 'Civil Works & Construction', labelBn: 'পূর্ত ও নির্মাণ কাজ' },
    { key: 'Services', label: 'Services & Leases', labelBn: 'সেবা ও ইজারা' }
  ];

  const activeCategories = activeTab === 'job' ? jobCategories : tenderCategories;

  const filteredItems = careerAndTendersData.filter((item) => {
    if (item.opportunityType !== activeTab) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (isBn ? item.titleBn : item.title).toLowerCase().includes(q);
      const matchRef = item.refNumber.toLowerCase().includes(q);
      const matchDept = item.departmentOrOffice.toLowerCase().includes(q);
      if (!matchTitle && !matchRef && !matchDept) return false;
    }
    return true;
  });

  const handleDownloadAttachment = (fileName: string) => {
    const dummyContent = `JASHORE SMART TECHNOLOGICAL UNIVERSITY\nOfficial Attachment: ${fileName}\n/* [REPLACE WITH REAL CONTENT] Official Attachment */\n`;
    const blob = new Blob([dummyContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12 bg-white">
      <SEOHead
        title={isBn ? 'নিয়োগ ও দরপত্র (ক্যারিয়ার ও টেন্ডার)' : 'Careers & Procurement Tenders'}
        description="Explore faculty appointments, administrative officer vacancies, and competitive public procurement tenders at JSTU."
      />

      <Breadcrumb items={[{ label: isBn ? 'ক্যারিয়ার ও টেন্ডার' : 'Careers & Tenders' }]} />

      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
          {isBn ? 'কর্মসংস্থান ও সরকারি ক্রয় বিজ্ঞপ্তি' : 'Opportunities & Public Procurement'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          {isBn ? 'চাকরির নিয়োগ ও টেন্ডার বিজ্ঞপ্তি' : 'Careers & Tenders Portal'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {isBn
            ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ে শিক্ষক, কর্মকর্তা নিয়োগ এবং সরকারি ক্রয় ও উন্নয়ন কাজের জাতীয় ই-জিপি ও উন্মুক্ত দরপত্র।'
            : 'Join our faculty and administrative corps, or participate in competitive public tenders for institutional laboratory expansion and civil works.'}
        </p>
      </div>

      {/* Top Main Section Switcher Tabs */}
      <div className="flex border-b border-[#E2E8F0] gap-4 sm:gap-8">
        <button
          onClick={() => {
            setActiveTab('job');
            setSelectedCategory('all');
          }}
          className={`pb-4 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'job'
              ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{isBn ? 'চাকরির নিয়োগ বিজ্ঞপ্তি' : 'Career Opportunities & Appointments'}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('tender');
            setSelectedCategory('all');
          }}
          className={`pb-4 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'tender'
              ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isBn ? 'সরকারি ক্রয় ও দরপত্র (Tenders)' : 'Procurement Tenders & E-GP'}</span>
        </button>
      </div>

      {/* Toolbar: Category Filters & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {activeCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isBn ? cat.labelBn : cat.label}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-80">
            <Input
              placeholder={
                activeTab === 'job'
                  ? isBn ? 'পদের নাম বা বিভাগ দিয়ে খুঁজুন...' : 'Search by job title or office...'
                  : isBn ? 'টেন্ডার বা মালামাল খুঁজুন...' : 'Search tenders or packages...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {/* List Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {isBn
              ? `মোট ${filteredItems.length}টি বিজ্ঞপ্তি প্রদর্শিত হচ্ছে`
              : `Showing ${filteredItems.length} open circulars`}
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              {isBn ? 'কোনো বিজ্ঞপ্তি পাওয়া যায়নি' : 'No open opportunities match your search'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="p-6 border border-[#E2E8F0] bg-white hover:border-[#1E3A8A]/50 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E3A8A] font-bold text-[11px]">
                      {isBn ? item.categoryBn : item.category}
                    </span>
                    <span className="font-mono text-slate-500 font-bold">
                      {item.refNumber}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-slate-500">
                      {isBn ? item.departmentOrOfficeBn : item.departmentOrOffice}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug">
                    {isBn ? item.titleBn : item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {isBn ? item.eligibilitySummaryBn : item.eligibilitySummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Published: {isBn ? item.publishDateBn : item.publishDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-red-700 font-bold">
                      <Clock className="w-3.5 h-3.5 text-red-600" />
                      <span>Deadline: {isBn ? item.deadlineBn : item.deadline}</span>
                    </div>

                    {item.vacancies && (
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 text-[11px] font-semibold">
                        Vacancies: {item.vacancies}
                      </span>
                    )}

                    {item.budgetBDT && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded text-[11px] font-bold font-mono border border-emerald-200">
                        Budget: {item.budgetBDT}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex md:flex-col items-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 justify-end">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setSelectedItem(item)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    {isBn ? 'বিস্তারিত দেখুন' : 'View Details'}
                  </Button>

                  {item.pdfAttachments.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAttachment(item.pdfAttachments[0].fileName)}
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                    >
                      {item.opportunityType === 'job' ? 'Circular PDF' : 'Tender BOQ'}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal with Requirements & PDF Attachments */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={isBn ? selectedItem.titleBn : selectedItem.title}
          description={`Reference: ${selectedItem.refNumber} &bull; Deadline: ${selectedItem.deadline}`}
        >
          <div className="space-y-6 text-xs max-h-[75vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 block">Department / Branch:</span>
                <strong className="text-slate-900">{selectedItem.departmentOrOffice}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Application Deadline:</span>
                <strong className="text-red-700 font-mono">{selectedItem.deadline}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Category:</span>
                <strong className="text-[#1E3A8A]">{selectedItem.category}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Status:</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                  {selectedItem.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-sm text-[#0F172A]">
                {selectedItem.opportunityType === 'job'
                  ? 'Educational Qualifications & Eligibility'
                  : 'Scope of Supply & Tender Criteria'}
              </h4>
              <p className="text-slate-600 leading-relaxed text-xs">
                {isBn ? selectedItem.eligibilitySummaryBn : selectedItem.eligibilitySummary}
              </p>
            </div>

            {selectedItem.fullRequirements && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="font-bold text-sm text-[#0F172A]">Detailed Terms & Criteria</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {selectedItem.fullRequirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Official Attachments */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h4 className="font-bold text-sm text-[#0F172A]">Official Downloadable Documents</h4>
              <div className="space-y-2">
                {selectedItem.pdfAttachments.map((att, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#1E3A8A]" />
                      <div>
                        <strong className="text-slate-800 block">{isBn ? att.titleBn : att.title}</strong>
                        <span className="text-slate-400 text-[10px]">{att.fileName} ({att.fileSize})</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAttachment(att.fileName)}
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                    >
                      Download PDF
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
              <strong>Submission Guideline:</strong> Application packets must be submitted to the Registrar office by registered post, courier, or official drop-box before the deadline date.
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
