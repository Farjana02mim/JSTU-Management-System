import React, { useState, useMemo } from 'react';
import {
  Download,
  FileText,
  Search,
  Filter,
  FileCheck2,
  Calendar,
  Sparkles,
  CheckCircle2,
  FolderDown,
  Info
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useLanguage } from '../../contexts/LanguageContext';
import { downloadsCatalogData } from '../../data/publicSectionsSeedData';
import { DownloadCategory, UniversityDownloadItem } from '../../types/publicSections';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';

export const DownloadsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadSuccessItem, setDownloadSuccessItem] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: 'All Downloads', labelBn: 'সকল ডাউনলোড' },
    { key: 'academic_forms', label: 'Academic Forms', labelBn: 'একাডেমিক ফরম' },
    { key: 'ordinances', label: 'Ordinances & Statutes', labelBn: 'সংবিধি ও অর্ডিন্যান্স' },
    { key: 'financial_forms', label: 'Financial & Accounts', labelBn: 'অর্থ ও হিসাব সংক্রান্ত' },
    { key: 'circulars', label: 'Circulars & Orders', labelBn: 'সার্কুলার ও অফিস আদেশ' },
    { key: 'research_forms', label: 'Research & Grants', labelBn: 'গবেষণা ও অনুদান' }
  ];

  const allPublishedDownloads = useMemo(() => {
    const store = SharedDataStoreManager.getInstance().getStore();
    const source = store.managedDownloads && store.managedDownloads.length > 0 ? store.managedDownloads : downloadsCatalogData;
    return source.filter((item: any) => item.status === 'published' || !item.status);
  }, []);

  const filteredDownloads = allPublishedDownloads.filter((item: any) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (isBn ? item.titleBn : item.title).toLowerCase().includes(q);
      const matchRef = item.refNumber.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchTitle && !matchRef && !matchDesc) return false;
    }
    return true;
  });

  const handleTriggerDownload = (item: UniversityDownloadItem) => {
    // Generate a downloadable text/binary mock blob for testing
    const content = `JASHORE SMART TECHNOLOGICAL UNIVERSITY (JSTU)\nOfficial Document: ${item.title}\nReference: ${item.refNumber}\nCategory: ${item.categoryLabel}\nPublished Date: ${item.publishedDate}\n/* [REPLACE WITH REAL CONTENT] Official Document Repository */\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.refNumber.replace(/[\/\\]/g, '_')}_document.${item.fileType.toLowerCase() === 'docx' ? 'docx' : 'pdf'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessItem(item.title);
    setTimeout(() => setDownloadSuccessItem(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12 bg-white">
      <SEOHead
        title={isBn ? 'ডাউনলোড ফরম ও অর্ডিন্যান্স' : 'Downloads, Forms & Ordinances'}
        description="Official academic forms, semester examination applications, university ordinances, and grant templates at JSTU."
      />

      <Breadcrumb items={[{ label: isBn ? 'ডাউনলোড' : 'Downloads Hub' }]} />

      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
          {isBn ? 'প্রাতিষ্ঠানিক নথি ও ফরম পোর্টাল' : 'Official Document Repository'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          {isBn ? 'ডাউনলোড কর্নার ও ফরমসমূহ' : 'Downloads, Forms & Regulations'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {isBn
            ? 'শিক্ষার্থী, শিক্ষক ও সাধারণ নাগরিকদের প্রয়োজনীয় সকল একাডেমিক আবেদন ফরম, সরকারি বিধিমালা, সিন্ডিকেট সংবিধি ও সার্কুলার।'
            : 'Access official examination forms, clearance applications, research proposal templates, and gazetted university statutes.'}
        </p>
      </div>

      {/* Download Alert */}
      {downloadSuccessItem && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isBn
                ? `নথিটি সফলভাবে ডাউনলোড হয়েছে: "${downloadSuccessItem}"`
                : `Document successfully downloaded: "${downloadSuccessItem}"`}
            </span>
          </div>
          <button
            onClick={() => setDownloadSuccessItem(null)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Toolbar: Category Pills & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
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
              placeholder={isBn ? 'ফরমের নাম বা নম্বর দিয়ে খুঁজুন...' : 'Search by form title or ref code...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {/* Downloads Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {isBn
              ? `মোট ${filteredDownloads.length}টি নথি প্রদর্শিত হচ্ছে`
              : `Showing ${filteredDownloads.length} downloadable documents`}
          </span>
        </div>

        {filteredDownloads.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <FolderDown className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              {isBn ? 'কোনো নথি খুঁজে পাওয়া যায়নি' : 'No downloadable forms match your search'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Search'}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white border border-[#E2E8F0] rounded-2xl shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-slate-700 border-b border-[#E2E8F0] font-semibold">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Document Title & Description</th>
                  <th className="py-3.5 px-4 sm:px-6">Category</th>
                  <th className="py-3.5 px-4 sm:px-6">Reference No</th>
                  <th className="py-3.5 px-4 sm:px-6">File Info</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-slate-600">
                {filteredDownloads.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 sm:px-6 max-w-md">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 text-[#1E3A8A] rounded-xl shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-[#0F172A] text-sm block leading-snug">
                            {isBn ? item.titleBn : item.title}
                          </span>
                          <span className="text-xs text-slate-500 mt-1 block leading-relaxed">
                            {isBn ? item.descriptionBn : item.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium whitespace-nowrap text-[11px]">
                        {isBn ? item.categoryLabelBn : item.categoryLabel}
                      </span>
                    </td>

                    <td className="py-4 px-4 sm:px-6 font-mono font-bold text-[#1E3A8A] text-xs">
                      {item.refNumber}
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-red-50 text-red-700 border border-red-200">
                        {item.fileType}
                      </span>
                      <span className="text-slate-400 text-xs ml-2">{item.fileSize}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {isBn ? item.publishedDateBn : item.publishedDate}
                      </span>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleTriggerDownload(item)}
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                      >
                        {isBn ? 'ডাউনলোড' : 'Download'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
