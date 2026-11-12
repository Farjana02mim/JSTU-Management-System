import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  History,
  ShieldCheck,
  AlertCircle,
  Sliders,
  Calendar,
  Layers,
  ChevronRight,
  Info,
  Archive,
  BarChart3,
  Stethoscope
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import {
  MedicalStockItem,
  MedicalStockBatch,
  MedicalStockCategory,
  MedicalStockLedgerEntry,
  MedicalStockAlertSummary
} from '../../types/studentLife';

// Security Notes:
// Real enforcement must move to Firestore rules / Cloud Functions.
// Real stock changes must be done by server-side transactions so quantities cannot be altered from the browser.

export const MedicalStockPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { user, profile } = useAuth();
  const storeManager = SharedDataStoreManager.getInstance();

  const [stockItems, setStockItems] = useState<MedicalStockItem[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<MedicalStockLedgerEntry[]>([]);
  const [alerts, setAlerts] = useState<MedicalStockAlertSummary>({
    lowStockCount: 0,
    expiringCount: 0,
    expiredCount: 0,
    alerts: []
  });

  const [activeTab, setActiveTab] = useState<'inventory' | 'ledger' | 'alerts'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [ledgerActionFilter, setLedgerActionFilter] = useState<string>('all');

  // Modals state
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isDispenseModalOpen, setIsDispenseModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isDamagedModalOpen, setIsDamagedModalOpen] = useState(false);

  // Selected item / batch for actions
  const [selectedItemForAction, setSelectedItemForAction] = useState<MedicalStockItem | null>(null);
  const [selectedBatchForAction, setSelectedBatchForAction] = useState<MedicalStockBatch | null>(null);

  // Form States
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [receiveForm, setReceiveForm] = useState({
    itemId: 'new',
    name: '',
    nameBn: '',
    category: 'tablet' as MedicalStockCategory,
    unit: 'strips',
    reorderLevel: 20,
    batchNumber: '',
    expiryDate: '',
    quantity: '' as number | string,
    storageNote: '',
    reason: ''
  });

  const [dispenseForm, setDispenseForm] = useState({
    itemId: '',
    quantity: '' as number | string,
    anonymousVisitRef: '',
    reason: ''
  });

  const [adjustForm, setAdjustForm] = useState({
    newQuantity: '' as number | string,
    reason: ''
  });

  const [damagedForm, setDamagedForm] = useState({
    quantity: '' as number | string,
    type: 'DAMAGED' as 'EXPIRED' | 'DAMAGED',
    reason: ''
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const reloadData = () => {
    setStockItems(storeManager.getMedicalStockItems());
    setLedgerEntries(storeManager.getMedicalStockLedger());
    setAlerts(storeManager.getMedicalStockAlerts());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Compute unexpired quantity helper
  const getUnexpiredQuantity = (item: MedicalStockItem) => {
    return (item.batches || []).reduce((sum, b) => {
      if (b.expiryDate >= todayStr && b.quantity > 0) {
        return sum + b.quantity;
      }
      return sum;
    }, 0);
  };

  // Filtered stock items
  const filteredStockItems = useMemo(() => {
    return stockItems.filter((item) => {
      const unexpiredQty = getUnexpiredQuantity(item);
      const isLowStock = unexpiredQty <= item.reorderLevel;
      const hasExpiringBatch = (item.batches || []).some((b) => {
        if (b.quantity <= 0) return false;
        const days = Math.ceil((new Date(b.expiryDate).getTime() - Date.now()) / 86400000);
        return days >= 0 && days <= 30;
      });
      const hasExpiredBatch = (item.batches || []).some((b) => b.expiryDate < todayStr && b.quantity > 0);

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatusFilter === 'low_stock' && !isLowStock) return false;
      if (selectedStatusFilter === 'expiring_soon' && !hasExpiringBatch) return false;
      if (selectedStatusFilter === 'expired' && !hasExpiredBatch) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q) || item.nameBn.toLowerCase().includes(q);
        const matchesBatch = (item.batches || []).some((b) => b.batchNumber.toLowerCase().includes(q));
        const matchesStorage = item.storageNote.toLowerCase().includes(q);
        if (!matchesName && !matchesBatch && !matchesStorage) return false;
      }

      return true;
    });
  }, [stockItems, selectedCategory, selectedStatusFilter, searchQuery, todayStr]);

  // Filtered ledger
  const filteredLedger = useMemo(() => {
    return ledgerEntries.filter((entry) => {
      if (ledgerActionFilter !== 'all' && entry.action !== ledgerActionFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          entry.itemName.toLowerCase().includes(q) ||
          entry.batchNumber.toLowerCase().includes(q) ||
          entry.reason.toLowerCase().includes(q) ||
          (entry.anonymousVisitRef && entry.anonymousVisitRef.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [ledgerEntries, ledgerActionFilter, searchQuery]);

  // Handle Receive Stock submit
  const handleReceiveStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const qty = Number(receiveForm.quantity);
    if (!receiveForm.batchNumber.trim()) {
      setFormError(isBn ? 'ব্যাচ নম্বর আবশ্যক।' : 'Batch number is required.');
      return;
    }
    if (!receiveForm.expiryDate) {
      setFormError(isBn ? 'মেয়াদোত্তীর্ণের তারিখ আবশ্যক।' : 'Expiry date is required.');
      return;
    }
    if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      setFormError(isBn ? 'সঠিক ধনাত্মক সংখ্যা উল্লেখ করুন।' : 'Quantity must be a positive integer.');
      return;
    }
    if (!receiveForm.reason.trim()) {
      setFormError(isBn ? 'প্রাপ্তির কারণ বা চালান নম্বর আবশ্যক।' : 'Reason or consignment note is mandatory.');
      return;
    }

    const actorUid = profile?.uid || user?.uid || 'demo_medical_01';
    const actorRole = profile?.role || 'medical_officer';

    const result = storeManager.addMedicalStock(
      {
        itemId: receiveForm.itemId !== 'new' ? receiveForm.itemId : undefined,
        name: receiveForm.name,
        nameBn: receiveForm.nameBn,
        category: receiveForm.category,
        unit: receiveForm.unit,
        reorderLevel: Number(receiveForm.reorderLevel),
        batchNumber: receiveForm.batchNumber,
        expiryDate: receiveForm.expiryDate,
        quantity: qty,
        storageNote: receiveForm.storageNote,
        reason: receiveForm.reason
      },
      actorUid,
      actorRole
    );

    if (result.success) {
      setFormSuccess(isBn ? 'মজুদ সফলভাবে যুক্ত হয়েছে।' : 'Stock received successfully and logged to audit ledger.');
      reloadData();
      setTimeout(() => {
        setIsReceiveModalOpen(false);
        setFormSuccess('');
      }, 1200);
    } else {
      setFormError(result.error || 'Failed to receive stock.');
    }
  };

  // Handle Dispense Stock submit
  const handleDispenseStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const qty = Number(dispenseForm.quantity);
    if (!dispenseForm.itemId) {
      setFormError(isBn ? 'ওষুধ বা পণ্য নির্বাচন করুন।' : 'Please select an item.');
      return;
    }
    if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      setFormError(isBn ? 'সঠিক বিতরণ সংখ্যা উল্লেখ করুন।' : 'Dispense quantity must be a positive integer.');
      return;
    }
    if (!dispenseForm.anonymousVisitRef.trim()) {
      setFormError(
        isBn
          ? 'বেনামী ভিজিট রেফারেন্স আবশ্যক (রোগীর পরিচয় কখনোই প্রকাশ করা যাবে না)।'
          : 'Anonymous visit reference is required (patient identity is never linked).'
      );
      return;
    }

    const actorUid = profile?.uid || user?.uid || 'demo_medical_01';
    const actorRole = profile?.role || 'medical_officer';

    const result = storeManager.dispenseMedicalStock(
      {
        itemId: dispenseForm.itemId,
        quantity: qty,
        anonymousVisitRef: dispenseForm.anonymousVisitRef,
        reason: dispenseForm.reason || 'Dispensed per finalized clinical prescription (FEFO)'
      },
      actorUid,
      actorRole
    );

    if (result.success) {
      const batchesList = (result.dispensedBatches || [])
        .map((b) => `${b.batchNumber} (${b.quantity})`)
        .join(', ');
      setFormSuccess(
        isBn
          ? `সফলভাবে বিতরণ সম্পন্ন (FEFO ব্যাচ: ${batchesList})। লেজারে রেকর্ড সংরক্ষণ হয়েছে।`
          : `Dispensed successfully (FEFO batches: ${batchesList}). Recorded to append-only ledger.`
      );
      reloadData();
      setTimeout(() => {
        setIsDispenseModalOpen(false);
        setFormSuccess('');
      }, 1500);
    } else {
      setFormError(result.error || 'Dispense failed.');
    }
  };

  // Handle Adjust Stock submit
  const handleAdjustStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForAction || !selectedBatchForAction) return;
    setFormError('');
    setFormSuccess('');

    const newQty = Number(adjustForm.newQuantity);
    if (isNaN(newQty) || newQty < 0 || !Number.isInteger(newQty)) {
      setFormError(isBn ? 'সংখ্যা ০ বা তার বেশি পূর্ণসংখ্যা হতে হবে।' : 'New quantity must be 0 or greater.');
      return;
    }
    if (!adjustForm.reason.trim()) {
      setFormError(isBn ? 'সংশোধনের কারণ উল্লেখ বাধ্যতামূলক।' : 'Mandatory adjustment reason required.');
      return;
    }

    const actorUid = profile?.uid || user?.uid || 'demo_medical_01';
    const actorRole = profile?.role || 'medical_officer';

    const result = storeManager.adjustMedicalStock(
      {
        itemId: selectedItemForAction.id,
        batchNumber: selectedBatchForAction.batchNumber,
        newQuantity: newQty,
        reason: adjustForm.reason
      },
      actorUid,
      actorRole
    );

    if (result.success) {
      setFormSuccess(isBn ? 'মজুদ সংশোধন সম্পন্ন ও লেজারে লিপিবদ্ধ।' : 'Stock adjustment recorded to immutable ledger.');
      reloadData();
      setTimeout(() => {
        setIsAdjustModalOpen(false);
        setFormSuccess('');
      }, 1200);
    } else {
      setFormError(result.error || 'Adjustment failed.');
    }
  };

  // Handle Mark Expired/Damaged submit
  const handleDamagedStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForAction || !selectedBatchForAction) return;
    setFormError('');
    setFormSuccess('');

    const qty = Number(damagedForm.quantity);
    if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      setFormError(isBn ? 'সঠিক সংখ্যা উল্লেখ করুন।' : 'Quantity must be a positive integer.');
      return;
    }
    if (!damagedForm.reason.trim()) {
      setFormError(isBn ? 'অপসারণ বা ক্ষতির কারণ উল্লেখ বাধ্যতামূলক।' : 'Mandatory incident/disposal reason required.');
      return;
    }

    const actorUid = profile?.uid || user?.uid || 'demo_medical_01';
    const actorRole = profile?.role || 'medical_officer';

    const result = storeManager.markStockExpiredOrDamaged(
      {
        itemId: selectedItemForAction.id,
        batchNumber: selectedBatchForAction.batchNumber,
        quantity: qty,
        type: damagedForm.type,
        reason: damagedForm.reason
      },
      actorUid,
      actorRole
    );

    if (result.success) {
      setFormSuccess(
        isBn
          ? `${damagedForm.type === 'EXPIRED' ? 'মেয়াদোত্তীর্ণ' : 'ক্ষতিগ্রস্ত'} পণ্য অপসারিত ও লেজারে লিপিবদ্ধ।`
          : `Item written off as ${damagedForm.type} and logged to append-only ledger.`
      );
      reloadData();
      setTimeout(() => {
        setIsDamagedModalOpen(false);
        setFormSuccess('');
      }, 1200);
    } else {
      setFormError(result.error || 'Action failed.');
    }
  };

  return (
    <div className="space-y-6">
      <SEOHead
        title={isBn ? 'ফার্মেসি ও ওষুধ মজুদ - জেএসটিইউ' : 'Pharmacy & Medicine Stock - JSTU'}
        description="JSTU Medical Center Central Pharmacy, Stock Management, FEFO Dispensing, and Append-Only Inventory Ledger."
      />

      {/* 1. Header with Top Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-[#1E3A8A]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              {isBn ? 'ফার্মেসি ও ওষুধ মজুদ ব্যবস্থাপনা' : 'Pharmacy & Medical Stock'}
            </h1>
            <span className="px-2 py-0.5 bg-blue-100 text-[#1E3A8A] font-extrabold text-[10px] rounded-full uppercase tracking-wider">
              M4 Demo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isBn
              ? 'এফইএফও (FEFO) নিয়মে ওষুধ বিতরণ, ব্যাচ মেয়াদ ট্র্যাকিং ও অপরিবর্তনীয় লেজার অডিট।'
              : 'FEFO-based dispensary, batch expiry control, low stock alerts, and append-only ledger.'}
          </p>
        </div>

        {/* Portal Section Links */}
        <div className="flex items-center gap-2 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0] shrink-0">
          <Link
            to="/office/medical"
            className="px-3 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-[#0F172A] transition-colors flex items-center gap-1.5"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>{isBn ? 'পরামর্শ ও রোস্টার' : 'Consultations'}</span>
          </Link>
          <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white text-[#1E3A8A] shadow-xs border border-slate-200 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>{isBn ? 'ফার্মেসি ও স্টক' : 'Pharmacy & Stock'}</span>
          </span>
          <Link
            to="/office/medical/reports"
            className="px-3 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-[#0F172A] transition-colors flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{isBn ? 'রিপোর্ট ও পরিসংখ্যান' : 'Reports & Stats'}</span>
          </Link>
        </div>
      </div>

      {/* 2. Stock Health KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 border border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{isBn ? 'মোট তালিকাভুক্ত ওষুধ' : 'Catalog Items'}</span>
            <Layers className="w-4 h-4 text-[#1E3A8A]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0F172A]">{stockItems.length}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">{isBn ? 'সক্রিয় ক্যাটাগরি ৫টি' : 'Across 5 categories'}</span>
        </Card>

        <Card className="p-4 border border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{isBn ? 'স্বল্প মজুদ সতর্কতা' : 'Low Stock Alert'}</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className={`mt-2 text-2xl font-bold ${alerts.lowStockCount > 0 ? 'text-amber-600' : 'text-[#0F172A]'}`}>
            {alerts.lowStockCount}
          </div>
          <span className="text-[11px] text-amber-800 font-medium mt-1 block">
            {isBn ? 'রিঅর্ডার লেভেলের নিচে' : 'At or below reorder level'}
          </span>
        </Card>

        <Card className="p-4 border border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{isBn ? 'আসন্ন মেয়াদোত্তীর্ণ (<৩০ দিন)' : 'Expiring <30 Days'}</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className={`mt-2 text-2xl font-bold ${alerts.expiringCount > 0 ? 'text-blue-700' : 'text-[#0F172A]'}`}>
            {alerts.expiringCount}
          </div>
          <span className="text-[11px] text-blue-700 font-medium mt-1 block">
            {isBn ? 'দ্রুত বিতরণ অগ্রাধিকার' : 'FEFO priority allocation'}
          </span>
        </Card>

        <Card className="p-4 border border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{isBn ? 'মেয়াদোত্তীর্ণ ব্যাচ' : 'Expired Batches'}</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className={`mt-2 text-2xl font-bold ${alerts.expiredCount > 0 ? 'text-red-600' : 'text-[#0F172A]'}`}>
            {alerts.expiredCount}
          </div>
          <span className="text-[11px] text-red-700 font-medium mt-1 block">
            {isBn ? 'বিতরণ সম্পূর্ণ নিষিদ্ধ' : 'Dispensing strictly blocked'}
          </span>
        </Card>
      </div>

      {/* 3. Alerts Banner if active alerts exist */}
      {alerts.alerts.length > 0 && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-950 font-bold text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{isBn ? 'সক্রিয় ফার্মেসি সতর্কতা নোটিফিকেশন:' : 'Active Pharmacy Stock Alerts:'}</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {alerts.alerts.map((al, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  al.type === 'EXPIRED'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : al.type === 'LOW_STOCK'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-blue-100 text-blue-900 border border-blue-200'
                }`}
                title={al.details}
              >
                <span>
                  {al.type === 'EXPIRED' ? '⛔' : al.type === 'LOW_STOCK' ? '⚠️' : '⏳'}
                </span>
                <span>{al.itemName.replace(/\[.*?\]/g, '').trim()}</span>
                {al.batchNumber && <span className="font-mono text-[10px] opacity-80">({al.batchNumber})</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. Controls & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b sm:border-b-0 border-[#E2E8F0] pb-2 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-100'
            }`}
          >
            {isBn ? 'ওষুধ মজুদ তালিকা' : 'Stock Inventory'} ({filteredStockItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ledger'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-100'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{isBn ? 'লেজার ও অডিট ট্রেইল' : 'Stock Ledger'}</span>
            <span className="font-mono text-[10px] opacity-80">({ledgerEntries.length})</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDispenseForm({
                itemId: stockItems[0]?.id || '',
                quantity: 1,
                anonymousVisitRef: `JSTU-MED-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                reason: ''
              });
              setIsDispenseModalOpen(true);
            }}
            className="text-xs font-bold border-blue-300 text-[#1E3A8A] hover:bg-blue-50"
            leftIcon={<ArrowDownRight className="w-3.5 h-3.5 text-blue-700" />}
          >
            {isBn ? 'প্রেসক্রিপশন বিতরণ (FEFO)' : 'Dispense Medicine'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setReceiveForm({
                itemId: 'new',
                name: '',
                nameBn: '',
                category: 'tablet',
                unit: 'strips',
                reorderLevel: 20,
                batchNumber: `BATCH-${Date.now().toString().slice(-6)}`,
                expiryDate: new Date(Date.now() + 86400000 * 365).toISOString().split('T')[0],
                quantity: '',
                storageNote: 'Central Dispensary Cabinet',
                reason: 'Routine quarterly procurement consignment'
              });
              setIsReceiveModalOpen(true);
            }}
            className="bg-[#1E3A8A] hover:bg-blue-900 text-xs font-bold"
            leftIcon={<Plus className="w-3.5 h-3.5 text-white" />}
          >
            {isBn ? '+ নতুন চালান গ্রহণ' : '+ Receive Stock'}
          </Button>
        </div>
      </div>

      {/* 5. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'inventory'
                ? (isBn ? 'ওষুধের নাম, ব্যাচ নম্বর বা ক্যাবিনেট সার্চ করুন...' : 'Search medicine name, batch number, or shelf...')
                : (isBn ? 'লেজার ট্রানজেকশন, কারণ বা ভিজিট রেফারেন্স খুঁজুন...' : 'Search ledger entries, reason, or visit reference...')
            }
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          />
        </div>

        {activeTab === 'inventory' ? (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs p-2 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            >
              <option value="all">{isBn ? 'সব ক্যাটাগরি' : 'All Categories'}</option>
              <option value="tablet">{isBn ? 'ট্যাবলেট (Tablet)' : 'Tablet'}</option>
              <option value="syrup">{isBn ? 'সিরাপ / ড্রপ (Syrup)' : 'Syrup / Drops'}</option>
              <option value="injection">{isBn ? 'ইনজেকশন (Injection)' : 'Injection'}</option>
              <option value="first_aid">{isBn ? 'প্রাথমিক চিকিৎসা (First Aid)' : 'First Aid'}</option>
              <option value="consumable">{isBn ? 'ব্যবহার্য সামগ্রী (Consumables)' : 'Consumables'}</option>
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="text-xs p-2 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            >
              <option value="all">{isBn ? 'সব স্ট্যাটাস' : 'All Statuses'}</option>
              <option value="low_stock">{isBn ? '⚠️ স্বল্প মজুদ (Low Stock)' : '⚠️ Low Stock'}</option>
              <option value="expiring_soon">{isBn ? '⏳ দ্রুত মেয়াদোত্তীর্ণ (<৩০ দিন)' : '⏳ Expiring Soon'}</option>
              <option value="expired">{isBn ? '⛔ মেয়াদোত্তীর্ণ ব্যাচ (Expired)' : '⛔ Expired'}</option>
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={ledgerActionFilter}
              onChange={(e) => setLedgerActionFilter(e.target.value)}
              className="text-xs p-2 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            >
              <option value="all">{isBn ? 'সব মুভমেন্ট অ্যাকশন' : 'All Ledger Actions'}</option>
              <option value="RECEIVE">{isBn ? 'RECEIVE (চালান গ্রহণ)' : 'RECEIVE'}</option>
              <option value="DISPENSE">{isBn ? 'DISPENSE (বিতরণ)' : 'DISPENSE'}</option>
              <option value="ADJUSTMENT">{isBn ? 'ADJUSTMENT (সংশোধন)' : 'ADJUSTMENT'}</option>
              <option value="EXPIRED">{isBn ? 'EXPIRED (মেয়াদোত্তীর্ণ অপসারিত)' : 'EXPIRED'}</option>
              <option value="DAMAGED">{isBn ? 'DAMAGED (ক্ষতিগ্রস্ত অপসারিত)' : 'DAMAGED'}</option>
            </select>
          </div>
        )}
      </div>

      {/* 6. TAB 1: INVENTORY TABLE */}
      {activeTab === 'inventory' && (
        <Card className="border border-[#E2E8F0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#0F172A]">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3">{isBn ? 'ওষুধের বিবরণ' : 'Item Particulars'}</th>
                  <th className="p-3">{isBn ? 'ক্যাটাগরি' : 'Category'}</th>
                  <th className="p-3">{isBn ? 'কার্যকর মজুদ' : 'Usable Stock'}</th>
                  <th className="p-3">{isBn ? 'রিঅর্ডার সীমা' : 'Reorder'}</th>
                  <th className="p-3">{isBn ? 'ব্যাচ ও মেয়াদ বিশ্লেষণ (FEFO)' : 'Batches & FEFO Expiry'}</th>
                  <th className="p-3 text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredStockItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      {isBn ? 'কোনো ওষুধ বা মজুদ পাওয়া যায়নি।' : 'No medical stock items match your filter.'}
                    </td>
                  </tr>
                ) : (
                  filteredStockItems.map((item) => {
                    const unexpiredQty = getUnexpiredQuantity(item);
                    const isLow = unexpiredQty <= item.reorderLevel;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-[#0F172A]">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span>{item.nameBn}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-600">{item.storageNote}</span>
                          </div>
                        </td>

                        <td className="p-3">
                          <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            {item.category.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="p-3 font-mono">
                          <span className={`font-bold text-sm ${isLow ? 'text-amber-600' : 'text-emerald-700'}`}>
                            {unexpiredQty}
                          </span>{' '}
                          <span className="text-slate-500 text-[11px]">{item.unit}</span>
                          {isLow && (
                            <span className="ml-1.5 px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[10px] rounded font-bold">
                              Low
                            </span>
                          )}
                        </td>

                        <td className="p-3 font-mono text-slate-600">
                          {item.reorderLevel} {item.unit}
                        </td>

                        <td className="p-3">
                          <div className="space-y-1.5">
                            {item.batches.map((batch) => {
                              const isExp = batch.expiryDate < todayStr;
                              const daysLeft = Math.ceil(
                                (new Date(batch.expiryDate).getTime() - Date.now()) / 86400000
                              );
                              const isExpSoon = !isExp && daysLeft <= 30;

                              return (
                                <div
                                  key={batch.id}
                                  className={`flex items-center justify-between gap-3 text-[11px] p-1.5 rounded-lg border ${
                                    isExp
                                      ? 'bg-red-50 border-red-200 text-red-900'
                                      : isExpSoon
                                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                                      : 'bg-white border-slate-200 text-slate-800'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold">{batch.batchNumber}:</span>
                                    <span className="font-mono">{batch.quantity} {item.unit}</span>
                                    <span className="text-[10px] text-slate-500">
                                      ({batch.expiryDate}
                                      {isExp ? ' - EXPIRED' : isExpSoon ? ` - ${daysLeft}d left` : ''})
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedItemForAction(item);
                                        setSelectedBatchForAction(batch);
                                        setAdjustForm({
                                          newQuantity: batch.quantity,
                                          reason: 'Physical count audit reconciliation'
                                        });
                                        setIsAdjustModalOpen(true);
                                      }}
                                      className="px-1.5 py-0.5 text-[10px] font-bold text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-100 rounded transition-colors"
                                    >
                                      {isBn ? 'সংশোধন' : 'Adjust'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedItemForAction(item);
                                        setSelectedBatchForAction(batch);
                                        setDamagedForm({
                                          quantity: batch.quantity,
                                          type: isExp ? 'EXPIRED' : 'DAMAGED',
                                          reason: isExp ? 'Batch expired past threshold' : 'Packaging seal damaged'
                                        });
                                        setIsDamagedModalOpen(true);
                                      }}
                                      className="px-1.5 py-0.5 text-[10px] font-bold text-red-700 hover:text-red-900 hover:bg-red-100 rounded transition-colors"
                                    >
                                      {isExp ? (isBn ? 'মেয়াদোত্তীর্ণ অপসারন' : 'Write-Off Expired') : (isBn ? 'ক্ষতিগ্রস্ত' : 'Damaged')}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>

                        <td className="p-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setReceiveForm({
                                itemId: item.id,
                                name: item.name,
                                nameBn: item.nameBn,
                                category: item.category,
                                unit: item.unit,
                                reorderLevel: item.reorderLevel,
                                batchNumber: `B-${Date.now().toString().slice(-4)}`,
                                expiryDate: new Date(Date.now() + 86400000 * 365).toISOString().split('T')[0],
                                quantity: '',
                                storageNote: item.storageNote,
                                reason: 'Consignment replenishment receipt'
                              });
                              setIsReceiveModalOpen(true);
                            }}
                            className="text-xs font-bold"
                          >
                            + {isBn ? 'স্টক যোগ' : 'Add Batch'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 7. TAB 2: APPEND-ONLY STOCK MOVEMENT LEDGER */}
      {activeTab === 'ledger' && (
        <Card className="border border-[#E2E8F0] overflow-hidden">
          <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                {isBn
                  ? 'অপরিবর্তনীয় অডিট লেজার: কোনো এন্ট্রি মুছে ফেলা বা সম্পাদনা সম্ভব নয়।'
                  : 'Append-Only Stock Ledger: No entry editing or deletion; corrections are recorded as new audit entries.'}
              </span>
            </div>
            <span className="font-mono text-slate-500 text-[11px]">{filteredLedger.length} events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#0F172A]">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3">{isBn ? 'সময়কাল' : 'Timestamp'}</th>
                  <th className="p-3">{isBn ? 'অ্যাকশন' : 'Action'}</th>
                  <th className="p-3">{isBn ? 'ওষুধ ও ব্যাচ' : 'Item & Batch'}</th>
                  <th className="p-3">{isBn ? 'পরিমাণ পরিবর্তন' : 'Change'}</th>
                  <th className="p-3">{isBn ? 'ব্যালেন্স' : 'Balance After'}</th>
                  <th className="p-3">{isBn ? 'কারণ / বিবরণ' : 'Audit Reason'}</th>
                  <th className="p-3">{isBn ? 'বেনামী ভিজিট রেফারেন্স' : 'Anonymous Visit Ref'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      {isBn ? 'কোনো লেজার এন্ট্রি পাওয়া যায়নি।' : 'No ledger movements found.'}
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map((entry) => {
                    const isPositive = entry.quantityChange > 0;
                    return (
                      <tr key={entry.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {new Date(entry.timestamp).toLocaleString()}
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                              entry.action === 'RECEIVE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : entry.action === 'DISPENSE'
                                ? 'bg-blue-100 text-blue-800'
                                : entry.action === 'ADJUSTMENT'
                                ? 'bg-purple-100 text-purple-800'
                                : entry.action === 'EXPIRED'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {entry.action}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="font-bold text-[#0F172A]">{entry.itemName}</div>
                          <div className="font-mono text-[10px] text-slate-500">Batch: {entry.batchNumber}</div>
                        </td>

                        <td className="p-3 font-mono font-bold">
                          <span className={isPositive ? 'text-emerald-700' : 'text-red-600'}>
                            {isPositive ? `+${entry.quantityChange}` : entry.quantityChange}
                          </span>
                        </td>

                        <td className="p-3 font-mono text-slate-700 font-semibold">
                          {entry.balanceAfter}
                        </td>

                        <td className="p-3 text-slate-700 max-w-xs">
                          {entry.reason}
                        </td>

                        <td className="p-3 font-mono text-[11px] text-[#1E3A8A]">
                          {entry.anonymousVisitRef ? (
                            <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {entry.anonymousVisitRef}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 8. MODAL 1: RECEIVE STOCK */}
      {isReceiveModalOpen && (
        <Modal
          isOpen={isReceiveModalOpen}
          onClose={() => setIsReceiveModalOpen(false)}
          title={isBn ? 'নতুন চালান বা স্টক গ্রহণ' : 'Receive New Stock Consignment'}
        >
          <form onSubmit={handleReceiveStockSubmit} className="space-y-4 text-xs">
            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                {formSuccess}
              </div>
            )}

            <div>
              <label className="font-bold text-[#0F172A] block mb-1">
                {isBn ? 'ওষুধ বা আইটেম নির্বাচন' : 'Target Item'} *
              </label>
              <select
                value={receiveForm.itemId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'new') {
                    setReceiveForm((prev) => ({ ...prev, itemId: 'new', name: '', nameBn: '' }));
                  } else {
                    const found = stockItems.find((it) => it.id === val);
                    if (found) {
                      setReceiveForm((prev) => ({
                        ...prev,
                        itemId: found.id,
                        name: found.name,
                        nameBn: found.nameBn,
                        category: found.category,
                        unit: found.unit,
                        reorderLevel: found.reorderLevel,
                        storageNote: found.storageNote
                      }));
                    }
                  }
                }}
                className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              >
                <option value="new">+ {isBn ? 'নতুন ওষুধ যোগ করুন' : 'Add New Medicine / Consumable'}</option>
                {stockItems.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.name} ({it.unit})
                  </option>
                ))}
              </select>
            </div>

            {receiveForm.itemId === 'new' && (
              <>
                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">
                    {isBn ? 'ওষুধের নাম (ইংরেজি)' : 'Item Name (English)'} *
                  </label>
                  <input
                    type="text"
                    value={receiveForm.name}
                    onChange={(e) => setReceiveForm({ ...receiveForm, name: e.target.value })}
                    placeholder="e.g. Tab. Cetirizine 10mg [REPLACE WITH REAL CONTENT]"
                    className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#0F172A] block mb-1">{isBn ? 'ক্যাটাগরি' : 'Category'} *</label>
                    <select
                      value={receiveForm.category}
                      onChange={(e) =>
                        setReceiveForm({ ...receiveForm, category: e.target.value as MedicalStockCategory })
                      }
                      className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A]"
                    >
                      <option value="tablet">Tablet</option>
                      <option value="syrup">Syrup / Drops</option>
                      <option value="injection">Injection</option>
                      <option value="first_aid">First Aid</option>
                      <option value="consumable">Consumable</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#0F172A] block mb-1">{isBn ? 'পরিমাপ ইউনিট' : 'Unit'} *</label>
                    <input
                      type="text"
                      value={receiveForm.unit}
                      onChange={(e) => setReceiveForm({ ...receiveForm, unit: e.target.value })}
                      placeholder="e.g. strips, bottles, ampoules"
                      className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A]"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">
                  {isBn ? 'ব্যাচ নম্বর' : 'Batch Number'} *
                </label>
                <input
                  type="text"
                  value={receiveForm.batchNumber}
                  onChange={(e) => setReceiveForm({ ...receiveForm, batchNumber: e.target.value })}
                  placeholder="e.g. B2026-X8"
                  className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">
                  {isBn ? 'মেয়াদোত্তীর্ণের তারিখ' : 'Expiry Date'} *
                </label>
                <input
                  type="date"
                  value={receiveForm.expiryDate}
                  onChange={(e) => setReceiveForm({ ...receiveForm, expiryDate: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">
                  {isBn ? 'গ্রহণের পরিমাণ' : 'Quantity Received'} *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={receiveForm.quantity}
                  onChange={(e) => setReceiveForm({ ...receiveForm, quantity: e.target.value })}
                  placeholder="e.g. 100"
                  className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">
                  {isBn ? 'স্টোরেজ রুম / সেলফ' : 'Storage Note'}
                </label>
                <input
                  type="text"
                  value={receiveForm.storageNote}
                  onChange={(e) => setReceiveForm({ ...receiveForm, storageNote: e.target.value })}
                  placeholder="e.g. Room 104, Shelf A1"
                  className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#0F172A] block mb-1">
                {isBn ? 'প্রাপ্তির কারণ / চালান রেফারেন্স' : 'Mandatory Reason / Receipt Note'} *
              </label>
              <textarea
                rows={2}
                value={receiveForm.reason}
                onChange={(e) => setReceiveForm({ ...receiveForm, reason: e.target.value })}
                placeholder="e.g. Central University tender procurement consignment #PO-2026-88"
                className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A]"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsReceiveModalOpen(false)}>
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button variant="primary" size="sm" type="submit" className="bg-[#1E3A8A] hover:bg-blue-900">
                {isBn ? 'চালান নিশ্চিত করুন' : 'Confirm & Log to Ledger'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 9. MODAL 2: DISPENSE MEDICINE */}
      {isDispenseModalOpen && (
        <Modal
          isOpen={isDispenseModalOpen}
          onClose={() => setIsDispenseModalOpen(false)}
          title={isBn ? 'প্রেসক্রিপশন অনুযায়ী ওষুধ বিতরণ (FEFO)' : 'Dispense Prescription Item (FEFO)'}
        >
          <form onSubmit={handleDispenseStockSubmit} className="space-y-4 text-xs">
            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                {formSuccess}
              </div>
            )}

            <div>
              <label className="font-bold text-[#0F172A] block mb-1">
                {isBn ? 'বিতরণের জন্য ওষুধ নির্বাচন' : 'Select Item'} *
              </label>
              <select
                value={dispenseForm.itemId}
                onChange={(e) => setDispenseForm({ ...dispenseForm, itemId: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                required
              >
                <option value="">{isBn ? '-- ওষুধ নির্বাচন করুন --' : '-- Select Medicine --'}</option>
                {stockItems.map((it) => {
                  const unexpired = getUnexpiredQuantity(it);
                  return (
                    <option key={it.id} value={it.id} disabled={unexpired <= 0}>
                      {it.name} (Available: {unexpired} {it.unit})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">
                  {isBn ? 'বিতরণের পরিমাণ' : 'Quantity to Dispense'} *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={dispenseForm.quantity}
                  onChange={(e) => setDispenseForm({ ...dispenseForm, quantity: e.target.value })}
                  placeholder="e.g. 5"
                  className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">
                  {isBn ? 'বেনামী ভিজিট রেফারেন্স' : 'Anonymous Visit Ref'} *
                </label>
                <input
                  type="text"
                  value={dispenseForm.anonymousVisitRef}
                  onChange={(e) => setDispenseForm({ ...dispenseForm, anonymousVisitRef: e.target.value })}
                  placeholder="e.g. JSTU-MED-2026-1040"
                  className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] font-mono"
                  required
                />
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {isBn ? 'রোগীর কোনো নাম বা আইডি যুক্ত হবে না।' : 'Strict privacy: Never includes patient names or IDs.'}
                </span>
              </div>
            </div>

            {/* FEFO Batch Preview */}
            {dispenseForm.itemId && (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1 text-[11px] text-blue-900">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                  <span>{isBn ? 'FEFO অ্যালগরিদম সক্রিয়:' : 'FEFO Policy Active:'}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {isBn
                    ? 'সর্বপ্রথম মেয়াদ শেষ হওয়ার ব্যাচ থেকে স্বয়ংক্রিয়ভাবে স্টক কাটা হবে। মেয়াদোত্তীর্ণ ব্যাচ সম্পূর্ণভাবে ব্লক করা হবে।'
                    : 'System automatically deducts from earliest-expiring unexpired batch. Expired batches cannot be dispensed.'}
                </p>
              </div>
            )}

            <div>
              <label className="font-bold text-[#0F172A] block mb-1">
                {isBn ? 'বিতরণের মন্তব্য (ঐচ্ছিক)' : 'Dispensing Notes'}
              </label>
              <input
                type="text"
                value={dispenseForm.reason}
                onChange={(e) => setDispenseForm({ ...dispenseForm, reason: e.target.value })}
                placeholder="e.g. Dispensed 5 strips for acute outpatient triage"
                className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsDispenseModalOpen(false)}>
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button variant="primary" size="sm" type="submit" className="bg-[#1E3A8A] hover:bg-blue-900">
                {isBn ? 'বিতরণ নিশ্চিত করুন' : 'Confirm Dispensing'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 10. MODAL 3: ADJUST STOCK */}
      {isAdjustModalOpen && selectedItemForAction && selectedBatchForAction && (
        <Modal
          isOpen={isAdjustModalOpen}
          onClose={() => setIsAdjustModalOpen(false)}
          title={isBn ? 'মজুদ সংশোধন ও পুনর্মিলন' : 'Reconcile / Adjust Batch Stock'}
        >
          <form onSubmit={handleAdjustStockSubmit} className="space-y-4 text-xs">
            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                {formSuccess}
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-[#0F172A]">{selectedItemForAction.name}</div>
              <div className="text-[11px] text-slate-600 flex items-center gap-3">
                <span>Batch: <strong className="font-mono">{selectedBatchForAction.batchNumber}</strong></span>
                <span>Current Recorded: <strong className="font-mono">{selectedBatchForAction.quantity} {selectedItemForAction.unit}</strong></span>
              </div>
            </div>

            <div>
              <label className="font-bold text-[#0F172A] block mb-1">
                {isBn ? 'ভৌত গণনাকৃত নতুন পরিমাণ' : 'New Physical Count Quantity'} *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={adjustForm.newQuantity}
                onChange={(e) => setAdjustForm({ ...adjustForm, newQuantity: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] font-mono"
                required
              />
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {isBn ? 'পরিমাণ কখনোই ০ এর নিচে যেতে পারবে না।' : 'Quantity can never drop below zero.'}
              </span>
            </div>

            <div>
              <label className="font-bold text-[#0F172A] block mb-1">
                {isBn ? 'সংশোধনের কারণ (বাধ্যতামূলক)' : 'Mandatory Adjustment Reason'} *
              </label>
              <textarea
                rows={2}
                value={adjustForm.reason}
                onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                placeholder="e.g. Physical inventory count discrepancy audit reconciliation"
                className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A]"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsAdjustModalOpen(false)}>
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button variant="primary" size="sm" type="submit" className="bg-[#1E3A8A] hover:bg-blue-900">
                {isBn ? 'সংশোধন সংরক্ষণ করুন' : 'Save Adjustment'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 11. MODAL 4: MARK EXPIRED / DAMAGED */}
      {isDamagedModalOpen && selectedItemForAction && selectedBatchForAction && (
        <Modal
          isOpen={isDamagedModalOpen}
          onClose={() => setIsDamagedModalOpen(false)}
          title={isBn ? 'মেয়াদোত্তীর্ণ বা ক্ষতিগ্রস্ত স্টক অপসারণ' : 'Write-Off Expired / Damaged Stock'}
        >
          <form onSubmit={handleDamagedStockSubmit} className="space-y-4 text-xs">
            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                {formSuccess}
              </div>
            )}

            <div className="p-3 bg-red-50/50 rounded-xl border border-red-200 space-y-1">
              <div className="font-bold text-[#0F172A]">{selectedItemForAction.name}</div>
              <div className="text-[11px] text-slate-700 flex items-center gap-3">
                <span>Batch: <strong className="font-mono">{selectedBatchForAction.batchNumber}</strong></span>
                <span>Current Batch Qty: <strong className="font-mono">{selectedBatchForAction.quantity}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">
                  {isBn ? 'অপসারণের ধরন' : 'Action Type'} *
                </label>
                <select
                  value={damagedForm.type}
                  onChange={(e) => setDamagedForm({ ...damagedForm, type: e.target.value as 'EXPIRED' | 'DAMAGED' })}
                  className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A]"
                >
                  <option value="EXPIRED">{isBn ? 'মেয়াদোত্তীর্ণ (Expired)' : 'Expired'}</option>
                  <option value="DAMAGED">{isBn ? 'ক্ষতিগ্রস্ত (Damaged)' : 'Damaged / Broken'}</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">
                  {isBn ? 'অপসারণের পরিমাণ' : 'Quantity to Write-Off'} *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedBatchForAction.quantity}
                  step="1"
                  value={damagedForm.quantity}
                  onChange={(e) => setDamagedForm({ ...damagedForm, quantity: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#0F172A] block mb-1">
                {isBn ? 'অপসারণের কারণ / ডিসপোজাল নোট' : 'Disposal / Incident Reason'} *
              </label>
              <textarea
                rows={2}
                value={damagedForm.reason}
                onChange={(e) => setDamagedForm({ ...damagedForm, reason: e.target.value })}
                placeholder="e.g. Broken vial during transit or batch passed expiration threshold"
                className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A]"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsDamagedModalOpen(false)}>
                {isBn ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button variant="danger" size="sm" type="submit">
                {isBn ? 'অপসারণ নিশ্চিত করুন' : 'Confirm Write-Off'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
