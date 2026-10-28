import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Plus,
  Bookmark,
  Download,
  ExternalLink,
  ShieldCheck,
  User,
  GraduationCap,
  Sparkles,
  Building2,
  Calendar,
  Layers,
  FileText,
  DollarSign,
  ChevronRight,
  Database,
  Eye,
  X,
  Library,
  Cpu,
  BookMarked,
  Archive,
  Globe,
  HardDrive
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';
import { Book, BookCategory, BookBorrowing, BookReservation, PreviousQuestion } from '../../types/library';
import { initialEResourcesData, initialPreviousQuestionsData, initialLibraryStats } from '../../data/librarySeedData';
import { Link } from 'react-router-dom';

const CATEGORIES: BookCategory[] = [
  'Computer Science & Engineering',
  'Electrical & Electronic Engineering',
  'Mathematics & Statistics',
  'Fisheries & Marine Resources',
  'Geology & Mining Engineering',
  'Management & Business Studies',
  'Software Engineering',
  'General Science & Reference',
  'Literature & History'
];

export const LibraryPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { user, profile, role, signIn } = useAuth();
  const storeManager = SharedDataStoreManager.getInstance();

  // Active Store Data state
  const [store, setStore] = useState(() => storeManager.getStore());
  const reloadStore = () => setStore({ ...storeManager.getStore() });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'catalog' | 'student' | 'officer' | 'eresources' | 'questions'>('catalog');

  // Search & Filter state for catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'ebook'>('all');

  // Selected Book for Detail Modal
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Success / Feedback notification message
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Officer Mode Demo Switch (allows testing officer features directly)
  const isOfficer = role === 'library_officer' || role === 'admin' || role === 'super_admin';
  const [officerDemoOverride, setOfficerDemoOverride] = useState(false);
  const canAccessOfficerDesk = isOfficer || officerDemoOverride;

  // Officer Modals
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [newBookForm, setNewBookForm] = useState({
    title: '',
    titleBn: '',
    authors: '',
    isbn: '',
    edition: '1st Edition',
    publisher: '',
    publishedYear: 2024,
    category: 'Computer Science & Engineering' as BookCategory,
    departmentCode: 'CSE',
    callNumber: '',
    shelfLocation: 'Stack Area B, 2nd Floor',
    totalCopies: 5,
    availableCopies: 5,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
    description: '',
    descriptionBn: '',
    tags: '',
    language: 'English' as 'English' | 'Bangla',
    eBookAvailable: false
  });

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueForm, setIssueForm] = useState({
    bookId: '',
    studentId: 'JSTU2026001',
    studentName: 'Tanvir Ahmed',
    studentRoll: '2026001',
    dueDateDays: 21
  });

  // Previous Question filter state
  const [pqDept, setPqDept] = useState<string>('All');
  const [pqYear, setPqYear] = useState<string>('All');
  const [pqSearch, setPqSearch] = useState<string>('');
  const [selectedPq, setSelectedPq] = useState<PreviousQuestion | null>(null);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return store.libraryBooks.filter((book) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.titleBn.includes(searchQuery) ||
        book.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
        book.isbn.includes(searchQuery) ||
        book.callNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;

      const matchesAvailability =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && book.availableCopies > 0) ||
        (availabilityFilter === 'ebook' && book.eBookAvailable);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [store.libraryBooks, searchQuery, selectedCategory, availabilityFilter]);

  // Current logged in student borrowings and reservations
  const currentStudentId = profile?.studentId || 'JSTU2026001';
  const studentBorrowings = useMemo(() => {
    return store.libraryBorrowings.filter((b) => b.studentId === currentStudentId);
  }, [store.libraryBorrowings, currentStudentId]);

  const studentReservations = useMemo(() => {
    return store.libraryReservations.filter((r) => r.studentId === currentStudentId && r.status === 'pending');
  }, [store.libraryReservations, currentStudentId]);

  // Quick switch demo student
  const handleQuickLoginStudent = async () => {
    try {
      await signIn('student.demo@jstu.ac.bd', 'JSTU#Smart2026!');
      setFeedback({ type: 'success', message: 'Logged in as Demo Student (Tanvir Ahmed, Roll 2026001)' });
      reloadStore();
    } catch {
      setFeedback({ type: 'info', message: 'Switched to Demo Student view.' });
    }
  };

  // Quick switch library officer
  const handleQuickLoginOfficer = async () => {
    try {
      await signIn('library.demo@jstu.ac.bd', 'JSTU#Smart2026!');
      setOfficerDemoOverride(true);
      setFeedback({ type: 'success', message: 'Logged in as Central Library Officer (Syed Nurul Huda)' });
      setActiveTab('officer');
      reloadStore();
    } catch {
      setOfficerDemoOverride(true);
      setActiveTab('officer');
      setFeedback({ type: 'info', message: 'Switched to Library Officer Desk mode.' });
    }
  };

  // Reservation handler
  const handleReserve = (book: Book) => {
    const studentName = profile?.fullName || 'Tanvir Ahmed';
    const studentRoll = profile?.studentId || '2026001';
    const res = storeManager.reserveBook({
      bookId: book.id,
      studentId: currentStudentId,
      studentName,
      studentRoll
    });

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      reloadStore();
      setSelectedBook(null);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  // Cancel reservation
  const handleCancelReservation = (reservationId: string) => {
    const ok = storeManager.cancelReservation(reservationId);
    if (ok) {
      setFeedback({ type: 'info', message: 'Reservation cancelled.' });
      reloadStore();
    }
  };

  // Renewal handler
  const handleRenew = (borrowingId: string) => {
    const res = storeManager.renewBorrowing(borrowingId);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      reloadStore();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  // Return book handler (Officer)
  const handleReturnBook = (borrowingId: string) => {
    const res = storeManager.returnBook(borrowingId);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      reloadStore();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  // Issue book handler (Officer)
  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.bookId) {
      setFeedback({ type: 'error', message: 'Please select a book.' });
      return;
    }
    const res = storeManager.issueBook({
      bookId: issueForm.bookId,
      studentId: issueForm.studentId,
      studentName: issueForm.studentName,
      studentRoll: issueForm.studentRoll,
      dueDateDays: Number(issueForm.dueDateDays),
      officerName: profile?.fullName || 'Syed Nurul Huda (Library Officer)'
    });

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setIsIssueModalOpen(false);
      reloadStore();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  // Add book handler (Officer)
  const handleAddBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookForm.title || !newBookForm.isbn) {
      setFeedback({ type: 'error', message: 'Title and ISBN are required.' });
      return;
    }

    const created = storeManager.addBook({
      title: newBookForm.title,
      titleBn: newBookForm.titleBn || newBookForm.title,
      authors: newBookForm.authors.split(',').map((s) => s.trim()),
      isbn: newBookForm.isbn,
      edition: newBookForm.edition,
      publisher: newBookForm.publisher || 'JSTU Academic Press',
      publishedYear: Number(newBookForm.publishedYear),
      category: newBookForm.category,
      departmentCode: newBookForm.departmentCode,
      callNumber: newBookForm.callNumber || '005.1 J47',
      shelfLocation: newBookForm.shelfLocation,
      totalCopies: Number(newBookForm.totalCopies),
      availableCopies: Number(newBookForm.totalCopies),
      coverImage: newBookForm.coverImage,
      description: newBookForm.description,
      descriptionBn: newBookForm.descriptionBn || newBookForm.description,
      tags: newBookForm.tags.split(',').map((s) => s.trim()),
      language: newBookForm.language,
      eBookAvailable: newBookForm.eBookAvailable
    });

    setFeedback({ type: 'success', message: `Book "${created.title}" added to central library catalog!` });
    setIsAddBookModalOpen(false);
    reloadStore();
  };

  // Filter previous questions
  const filteredQuestions = useMemo(() => {
    return initialPreviousQuestionsData.filter((q) => {
      const matchDept = pqDept === 'All' || q.departmentId === pqDept;
      const matchYear = pqYear === 'All' || String(q.year) === pqYear;
      const matchSearch =
        pqSearch.trim() === '' ||
        q.courseCode.toLowerCase().includes(pqSearch.toLowerCase()) ||
        q.courseTitle.toLowerCase().includes(pqSearch.toLowerCase()) ||
        q.semester.toLowerCase().includes(pqSearch.toLowerCase());
      return matchDept && matchYear && matchSearch;
    });
  }, [pqDept, pqYear, pqSearch]);

  // Download Question Paper Mock PDF
  const handleDownloadQuestionPDF = (q: PreviousQuestion) => {
    const formattedQuestions = q.sampleQuestions
      .map((item) => `[${item.section}] ${item.questionNumber}: ${item.text} (${item.marks} Marks)`)
      .join('\n\n');

    const pdfText = `========================================================================
    JAMALPUR SCIENCE & TECHNOLOGY UNIVERSITY (JSTU)
           OFFICE OF THE CONTROLLER OF EXAMINATIONS
========================================================================

Course Code     : ${q.courseCode}
Course Title    : ${q.courseTitle}
Department      : ${q.departmentName}
Academic Year   : ${q.year}
Semester / Term : ${q.semester}
Examination Type: ${q.examType}
Credit Hours    : ${q.credit}
Full Marks      : ${q.fullMarks}
Time Allowed    : ${q.timeAllowed}

INSTRUCTIONS TO CANDIDATES:
1. Answer any FOUR questions from each Section.
2. Figures in the right-hand margin indicate full marks.
3. Programmable calculators and cellular phones are strictly prohibited.

------------------------------------------------------------------------
                             QUESTION PAPER
------------------------------------------------------------------------

${formattedQuestions}

========================================================================
Verified Official Question Archive Record: ${q.id}
Central Library Repository — Jamalpur-2012, Bangladesh
========================================================================`;

    const blob = new Blob([pdfText], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JSTU_${q.courseCode}_${q.year}_${q.semester.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setFeedback({
      type: 'success',
      message: `Downloaded question paper for ${q.courseCode} (${q.year}).`
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <SEOHead
        title={isBn ? 'কেন্দ্রীয় গ্রন্থাগার ও ডিজিটাল আর্কাইভ | জেএসটিইউ' : 'Central Library & Digital Archive | JSTU'}
        description={
          isBn
            ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের কেন্দ্রীয় লাইব্রেরি ক্যাটালগ অনুসন্ধান, বুক রিজার্ভেশন, ই-রিসোর্স ও পূর্ববর্তী পরীক্ষার প্রশ্ন ব্যাংক।'
            : 'JSTU Central Library online catalog search, book reservation, digital e-resources, and previous question archive.'
        }
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#0A2540] via-[#1E3A8A] to-[#0A2540] text-white py-12 px-4 sm:px-8 border-b border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-amber-300 text-xs font-semibold border border-blue-400/30">
                <Library className="w-3.5 h-3.5" />
                <span>{isBn ? 'সেন্ট্রাল লাইব্রেরি অ্যান্ড নলেজ হাব' : 'JSTU Central Library & Knowledge Hub'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {isBn ? 'কেন্দ্রীয় গ্রন্থাগার ও ই-রিসোর্স সেন্টার' : 'Central Library & E-Resource Center'}
              </h1>
              <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
                {isBn
                  ? '৪৮,৫০০+ পাঠ্য ও গবেষণামূলক বই, আন্তর্জাতিক ডাটাবেজ, ওপেন এক্সেস জার্নাল এবং ডিজিটাল পরীক্ষার প্রশ্ন আর্কাইভ।'
                  : 'Search 48,500+ volumes, reserve books, access IEEE/ScienceDirect e-resources, and download previous semester examination question papers.'}
              </p>
            </div>

            {/* Quick Demo Role Switcher Toolbar */}
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-xs space-y-2.5 shrink-0 self-start md:self-auto">
              <div className="flex items-center justify-between gap-3 text-slate-200">
                <span className="font-semibold">{isBn ? 'সক্রিয় অ্যাকাউন্ট মোড:' : 'Active Demo Persona:'}</span>
                <Badge variant={canAccessOfficerDesk ? 'primary' : 'neutral'}>
                  {role ? role.toUpperCase() : 'PUBLIC VISITOR'}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleQuickLoginStudent}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <User className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isBn ? 'ছাত্র মোড (তানভীর)' : 'Student Mode'}</span>
                </button>

                <button
                  onClick={handleQuickLoginOfficer}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isBn ? 'লাইব্রেরি অফিসার ডেস্ক' : 'Officer Desk'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums">
                {initialLibraryStats.totalBooks.toLocaleString()}
              </div>
              <div className="text-[11px] text-blue-200 font-medium">{isBn ? 'মোট মুদ্রিত বই' : 'Printed Volumes'}</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-emerald-300 tabular-nums">
                {store.libraryBooks.length}
              </div>
              <div className="text-[11px] text-blue-200 font-medium">{isBn ? 'ডিজিটাল ক্যাটালগ শিরোনাম' : 'Active Catalog Titles'}</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-sky-300 tabular-nums">
                {initialEResourcesData.length}
              </div>
              <div className="text-[11px] text-blue-200 font-medium">{isBn ? 'আন্তর্জাতিক ই-রিসোর্স' : 'Subscribed E-Databases'}</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-purple-300 tabular-nums">
                {initialPreviousQuestionsData.length}
              </div>
              <div className="text-[11px] text-blue-200 font-medium">{isBn ? 'আর্কাইভ প্রশ্নপত্র' : 'Exam Papers Digitized'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-6">
        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm animate-in fade-in duration-200 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : feedback.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isBn ? 'বই ক্যাটালগ ও সন্ধান' : 'Book Catalog Search'}</span>
          </button>

          <button
            onClick={() => setActiveTab('student')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'student'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{isBn ? 'আমার লাইব্রেরি একাউন্ট' : 'My Borrowings & Reservations'}</span>
            {studentBorrowings.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                {studentBorrowings.length}
              </span>
            )}
          </button>

          {canAccessOfficerDesk && (
            <button
              onClick={() => setActiveTab('officer')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'officer'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isBn ? 'লাইব্রেরি কর্মকর্তা ডেস্ক' : 'Officer Circulation Desk'}</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('eresources')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'eresources'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{isBn ? 'ই-রিসোর্স ও জার্নাল' : 'E-Resources & Databases'}</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>{isBn ? 'পূর্ববর্তী প্রশ্ন ব্যাংক' : 'Previous Questions Archive'}</span>
          </button>
        </div>

        {/* TAB 1: BOOK CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <Card padding="md" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-6 relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isBn
                        ? 'বইয়ের শিরোনাম, লেখক, আইএসবিএন বা কল নম্বর দিয়ে খুঁজুন...'
                        : 'Search by book title, author, ISBN (e.g. 978-0262046305) or call number...'
                    }
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-white text-slate-800 placeholder-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="md:col-span-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-white text-slate-700"
                  >
                    <option value="All">{isBn ? 'সকল বিভাগ ও বিষয়' : 'All Categories'}</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3 flex items-center gap-1.5">
                  <button
                    onClick={() => setAvailabilityFilter('all')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                      availabilityFilter === 'all'
                        ? 'bg-[#1E3A8A] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isBn ? 'সকল' : 'All'}
                  </button>
                  <button
                    onClick={() => setAvailabilityFilter('available')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                      availabilityFilter === 'available'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isBn ? 'সহজলভ্য' : 'Available'}
                  </button>
                  <button
                    onClick={() => setAvailabilityFilter('ebook')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                      availabilityFilter === 'ebook'
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isBn ? 'ই-বুক' : 'E-Book'}
                  </button>
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                <span>
                  {isBn
                    ? `মোট ${filteredBooks.length}টি বই পাওয়া গেছে`
                    : `Showing ${filteredBooks.length} titles matching criteria`}
                </span>
                <span className="font-mono text-[11px]">
                  Dewey Decimal Classification &bull; Library of Congress System
                </span>
              </div>
            </Card>

            {/* Book Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBooks.map((book) => {
                const isAvailable = book.availableCopies > 0;
                return (
                  <Card
                    key={book.id}
                    padding="none"
                    className="overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group border border-slate-200"
                  >
                    <div>
                      {/* Book Cover Header */}
                      <div className="h-44 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/20" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-amber-300">
                            {book.callNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-md ${
                              isAvailable
                                ? 'bg-emerald-500/90 text-white'
                                : 'bg-rose-500/90 text-white'
                            }`}
                          >
                            {isAvailable
                              ? `${book.availableCopies}/${book.totalCopies} Copies Free`
                              : 'Checked Out'}
                          </span>
                        </div>

                        {/* Bottom Tag in image */}
                        <div className="absolute bottom-2 left-3 right-3 text-white">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                            {book.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-slate-900 group-hover:text-[#1E3A8A] transition-colors line-clamp-1 text-sm">
                          {isBn ? book.titleBn : book.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-1">
                          <span className="font-medium text-slate-700">
                            {book.authors.join(', ')}
                          </span>
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-mono">
                            {book.edition}
                          </span>
                          <span className="font-mono text-slate-400">
                            ISBN: {book.isbn.slice(0, 13)}...
                          </span>
                          {book.eBookAvailable && (
                            <span className="px-1.5 py-0.5 bg-sky-100 text-sky-700 font-semibold rounded text-[10px]">
                              E-Book
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 pt-1">
                          {isBn ? book.descriptionBn : book.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-400 truncate">
                        <Building2 className="w-3 h-3 inline mr-1 text-slate-400" />
                        <span>{book.shelfLocation.split('(')[0]}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBook(book)}
                          className="text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>{isBn ? 'বিস্তারিত' : 'Details'}</span>
                        </Button>

                        {isAvailable ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleReserve(book)}
                            className="text-xs"
                          >
                            <Bookmark className="w-3.5 h-3.5 mr-1" />
                            <span>{isBn ? 'সংরক্ষণ' : 'Reserve'}</span>
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleReserve(book)}
                            className="text-xs"
                          >
                            <Bookmark className="w-3.5 h-3.5 mr-1" />
                            <span>{isBn ? 'ওয়েটলিস্ট' : 'Hold Queue'}</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {filteredBooks.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">
                  {isBn ? 'কোনো বই পাওয়া যায়নি' : 'No Books Matching Your Query'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isBn
                    ? 'অনুগ্রহ করে ভিন্ন কোনো কীওয়ার্ড দিয়ে খুঁজুন বা ফিল্টার পরিবর্তন করুন।'
                    : 'Try broadening your search term or select "All Categories".'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setAvailabilityFilter('all');
                  }}
                >
                  {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Search Filters'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STUDENT PORTAL / MY BORROWINGS */}
        {activeTab === 'student' && (
          <div className="space-y-6">
            {/* Student Profile Overview Card */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#1E3A8A] flex items-center justify-center font-bold text-lg">
                  {profile?.fullName ? profile.fullName.charAt(0) : 'T'}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {profile?.fullName || 'Tanvir Ahmed'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    ID: <span className="font-mono font-semibold">{currentStudentId}</span> &bull;{' '}
                    {profile?.departmentId || 'CSE'} 6th Semester &bull; Central Library ID: <span className="font-mono">LIB-2026-904</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="font-bold text-[#1E3A8A] text-sm tabular-nums">
                    {studentBorrowings.filter((b) => b.status === 'active' || b.status === 'overdue').length}/4
                  </div>
                  <div className="text-[10px] text-slate-500">{isBn ? 'ব্যবহৃত লিমিট' : 'Active Loans'}</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="font-bold text-amber-600 text-sm tabular-nums">
                    ৳{studentBorrowings.reduce((sum, b) => sum + (b.fineAmount || 0), 0)}
                  </div>
                  <div className="text-[10px] text-slate-500">{isBn ? 'বকেয়া জরিমানা' : 'Overdue Dues'}</div>
                </div>
              </div>
            </div>

            {/* Active Loans Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1E3A8A]" />
                  <span>{isBn ? 'বর্তমানে ইস্যুকৃত বইসমূহ' : 'Currently Issued Books & Due Dates'}</span>
                </h3>
                <span className="text-xs text-slate-500">
                  {isBn ? 'সর্বোচ্চ ৪টি বই ও ২টি নবায়ন অনুমোদিত' : 'Borrowing limit: 4 books, max 2 renewals'}
                </span>
              </div>

              {studentBorrowings.filter((b) => b.status === 'active' || b.status === 'overdue').length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  {isBn ? 'আপনার কোনো বই বর্তমানে ইস্যু করা নেই।' : 'You have no books currently issued.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentBorrowings
                    .filter((b) => b.status === 'active' || b.status === 'overdue')
                    .map((bor) => {
                      const isOverdue = bor.status === 'overdue';
                      return (
                        <Card
                          key={bor.id}
                          padding="md"
                          className={`space-y-3 border-l-4 ${
                            isOverdue ? 'border-l-rose-500 bg-rose-50/20' : 'border-l-emerald-500'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{bor.bookTitle}</h4>
                              <p className="text-xs font-mono text-slate-500">
                                Call No: {bor.callNumber} &bull; ISBN: {bor.bookIsbn}
                              </p>
                            </div>
                            <Badge variant={isOverdue ? 'danger' : 'success'}>
                              {isOverdue ? 'OVERDUE' : 'ACTIVE'}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            <div>
                              <span className="text-[10px] text-slate-400 block">{isBn ? 'ইস্যুর তারিখ' : 'Issued Date'}</span>
                              <span className="font-medium text-slate-700">{bor.issueDate}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">{isBn ? 'ফেরতের শেষ তারিখ' : 'Due Date'}</span>
                              <span className={`font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-800'}`}>
                                {bor.dueDate}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">{isBn ? 'নবায়ন সংখ্যা' : 'Renewals'}</span>
                              <span className="font-medium text-slate-700">{bor.renewalCount} / 2 used</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">{isBn ? 'জরিমানা' : 'Fine Incurred'}</span>
                              <span className="font-bold text-amber-600">৳{bor.fineAmount} BDT</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-slate-400">
                              Issued By: {bor.issuedBy}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRenew(bor.id)}
                              disabled={bor.renewalCount >= 2}
                              className="text-xs"
                            >
                              <RotateCcw className="w-3.5 h-3.5 mr-1 text-[#1E3A8A]" />
                              <span>{isBn ? 'নবায়ন করুন (+১৪ দিন)' : 'Renew Book (+14d)'}</span>
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                </div>
              )}
            </div>

            {/* My Active Reservations Section */}
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#1E3A8A]" />
                <span>{isBn ? 'আমার অগ্রিম রিজার্ভেশন কিউ' : 'My Active Book Reservations'}</span>
              </h3>

              {studentReservations.length === 0 ? (
                <div className="p-6 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  {isBn ? 'আপনার কোনো সক্রিয় রিজার্ভেশন নেই।' : 'No active reservations pending.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentReservations.map((res) => (
                    <Card key={res.id} padding="md" className="space-y-2 border-l-4 border-l-amber-500">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{res.bookTitle}</h4>
                          <p className="text-xs text-slate-500">
                            Reserved: {new Date(res.reservedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="warning">Queue #{res.priorityPosition}</Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <span>Hold Expiry: {res.expiryDate}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelReservation(res.id)}
                          className="text-rose-600 hover:text-rose-700 text-xs"
                        >
                          Cancel Hold
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Past Borrowing History Table */}
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Archive className="w-4 h-4 text-slate-600" />
                <span>{isBn ? 'পূর্ববর্তী রিডিং ও ফেরত প্রদানের ইতিহাস' : 'Completed Borrowing History'}</span>
              </h3>

              <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Book Title</th>
                      <th className="p-3">Call Number</th>
                      <th className="p-3">Issue Date</th>
                      <th className="p-3">Return Date</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {studentBorrowings
                      .filter((b) => b.status === 'returned')
                      .map((bor) => (
                        <tr key={bor.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-semibold text-slate-900">{bor.bookTitle}</td>
                          <td className="p-3 font-mono text-slate-500">{bor.callNumber}</td>
                          <td className="p-3">{bor.issueDate}</td>
                          <td className="p-3 font-medium text-emerald-700">{bor.returnDate || 'Returned'}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                              RETURNED
                            </span>
                          </td>
                        </tr>
                      ))}
                    {studentBorrowings.filter((b) => b.status === 'returned').length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-400">
                          No previous return history recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OFFICER CIRCULATION DESK */}
        {activeTab === 'officer' && canAccessOfficerDesk && (
          <div className="space-y-6">
            {/* Officer Banner */}
            <div className="p-5 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-200 font-bold">
                  Central Library Circulation Secretariat &bull; Role: {role || 'OFFICER'}
                </span>
                <h2 className="text-xl font-bold mt-1">
                  {isBn ? 'গ্রন্থাগারিক পরিচালন ও লেনদেন ডেস্ক' : 'Circulation Control & Catalog Management Desk'}
                </h2>
                <p className="text-xs text-amber-100 mt-0.5">
                  Issue, return, renew books, manage catalog inventory, and oversee student borrowing quotas.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsIssueModalOpen(true)}
                  className="bg-white text-slate-900 hover:bg-amber-50 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Issue Book</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAddBookModalOpen(true)}
                  className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  <span>Add New Book</span>
                </Button>
              </div>
            </div>

            {/* Officer Circulation Table */}
            <Card padding="md" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Active Circulation Ledger ({store.libraryBorrowings.filter((b) => b.status !== 'returned').length} Active Loans)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Perform 1-click book returns with automated overdue fine calculation.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Student</th>
                      <th className="p-3">Book Title</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Fine</th>
                      <th className="p-3 text-right">Actions</th>
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
                              onClick={() => handleReturnBook(bor.id)}
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
        )}

        {/* TAB 4: E-RESOURCES & DIGITAL DATABASES */}
        {activeTab === 'eresources' && (
          <div className="space-y-6">
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl shadow-sm space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-400/20 text-blue-200 text-xs font-semibold">
                <Database className="w-3.5 h-3.5 text-amber-300" />
                <span>Digital Library Consortium &bull; IP Authenticated</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {isBn ? 'আন্তর্জাতিক ই-জার্নাল ও ডিজিটাল ডাটাবেজ' : 'International E-Journals & Subscribed Databases'}
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
                {isBn
                  ? 'জেএসটিইউ ক্যাম্পাস আইপি নেটওয়ার্ক বা রিমোট ভিপিএন প্রক্সির মাধ্যমে বিশ্বখ্যাত গবেষণাপত্র ও পাবলিকেশনে সম্পূর্ণ বিনামূল্যে অ্যাক্সেস করুন।'
                  : 'Access millions of peer-reviewed journal articles, conference proceedings, and book chapters through campus IP range or remote proxy credentials.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {initialEResourcesData.map((res) => (
                <Card
                  key={res.id}
                  padding="md"
                  className="flex flex-col justify-between hover:shadow-md transition-shadow border border-slate-200 space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <Badge variant="primary">{res.badge}</Badge>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{isBn ? res.titleBn : res.title}</h3>
                      <p className="text-[11px] text-slate-400 font-medium">{res.provider}</p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {isBn ? res.descriptionBn : res.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="text-[11px] text-slate-500 space-y-1">
                      <div>
                        <span className="font-semibold text-slate-700">Access Mode: </span>
                        <span>{res.accessType}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Coverage: </span>
                        <span className="font-mono text-[10px]">{res.coverage}</span>
                      </div>
                    </div>

                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#1E3A8A] text-white hover:bg-[#172554] text-xs font-semibold transition-colors shadow-xs"
                    >
                      <span>{isBn ? 'ডাটাবেজে প্রবেশ করুন' : 'Launch Portal'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PREVIOUS QUESTION ARCHIVE */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            <Card padding="md" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {isBn ? 'পূর্ববর্তী সেমিস্টার পরীক্ষার প্রশ্ন ব্যাংক' : 'Digitized Previous Examination Question Papers'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Filter by faculty, department, year, or course code to preview questions and download official mock exam PDFs.
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Department</label>
                  <select
                    value={pqDept}
                    onChange={(e) => setPqDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700"
                  >
                    <option value="All">All Departments</option>
                    <option value="CSE">Computer Science & Engineering (CSE)</option>
                    <option value="EEE">Electrical & Electronic Engineering (EEE)</option>
                    <option value="MATH">Mathematics & Statistics (MATH)</option>
                    <option value="FISH">Fisheries & Marine Resources (FISH)</option>
                    <option value="GEOL">Geology & Mining Engineering (GEOL)</option>
                    <option value="MGMT">Management & Business Studies (MGMT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Exam Year</label>
                  <select
                    value={pqYear}
                    onChange={(e) => setPqYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700"
                  >
                    <option value="All">All Academic Years</option>
                    <option value="2025">2025 (Latest)</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Course Code / Keyword</label>
                  <input
                    type="text"
                    value={pqSearch}
                    onChange={(e) => setPqSearch(e.target.value)}
                    placeholder="e.g. CSE-311, Algorithms, Calculus..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700"
                  />
                </div>
              </div>
            </Card>

            {/* Questions List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredQuestions.map((q) => (
                <Card
                  key={q.id}
                  padding="md"
                  className="space-y-3 hover:border-[#1E3A8A] transition-colors border border-slate-200 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-[#1E3A8A] font-mono font-bold text-xs">
                        {q.courseCode}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold font-mono">
                          {q.year}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold text-[11px]">
                          {q.semester}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">
                      {isBn ? q.courseTitleBn : q.courseTitle}
                    </h3>
                    <p className="text-xs text-slate-500">{q.departmentName}</p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span>Full Marks: <strong className="text-slate-700">{q.fullMarks}</strong></span>
                      <span>&bull;</span>
                      <span>Time: <strong className="text-slate-700">{q.timeAllowed}</strong></span>
                      <span>&bull;</span>
                      <span>Credit: <strong className="text-slate-700">{q.credit}</strong></span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPq(q)}
                      className="text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>{isBn ? 'প্রশ্ন দেখুন' : 'Preview Questions'}</span>
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleDownloadQuestionPDF(q)}
                      className="text-xs"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      <span>{isBn ? 'পিডিএফ ডাউনলোড' : 'Download PDF'}</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {filteredQuestions.length === 0 && (
              <div className="p-10 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                No past examination question papers matched your current filters.
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: BOOK DETAIL MODAL */}
      {selectedBook && (
        <Modal
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          title={isBn ? selectedBook.titleBn : selectedBook.title}
          size="lg"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-1 rounded-xl overflow-hidden bg-slate-100 shadow-xs border border-slate-200 aspect-[3/4]">
                <img
                  src={selectedBook.coverImage}
                  alt={selectedBook.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="sm:col-span-2 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {isBn ? selectedBook.titleBn : selectedBook.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    By {selectedBook.authors.join(', ')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Call Number</span>
                    <span className="font-mono font-bold text-[#1E3A8A]">{selectedBook.callNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">ISBN</span>
                    <span className="font-mono font-bold text-slate-800">{selectedBook.isbn}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Edition & Publisher</span>
                    <span className="text-slate-700">{selectedBook.edition}, {selectedBook.publisher} ({selectedBook.publishedYear})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Shelf Location</span>
                    <span className="text-slate-700">{selectedBook.shelfLocation}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                    <span className="text-slate-500 block text-[10px]">Total Holding:</span>
                    <span className="font-bold text-[#1E3A8A] text-sm">{selectedBook.totalCopies} Copies</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <span className="text-emerald-700 block text-[10px]">On Shelf Available:</span>
                    <span className="font-bold text-emerald-800 text-sm">{selectedBook.availableCopies} Copies</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Description & Syllabus Coverage</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isBn ? selectedBook.descriptionBn : selectedBook.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {selectedBook.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <Button variant="ghost" size="sm" onClick={() => setSelectedBook(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleReserve(selectedBook)}
              >
                <Bookmark className="w-4 h-4 mr-1.5" />
                <span>{selectedBook.availableCopies > 0 ? 'Reserve Copy' : 'Join Reservation Queue'}</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: PREVIOUS QUESTION PREVIEW */}
      {selectedPq && (
        <Modal
          isOpen={!!selectedPq}
          onClose={() => setSelectedPq(null)}
          title={`${selectedPq.courseCode}: ${selectedPq.courseTitle} (${selectedPq.year})`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block">Semester</span>
                <span className="font-semibold text-slate-800">{selectedPq.semester}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Examination</span>
                <span className="font-semibold text-slate-800">{selectedPq.examType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Full Marks</span>
                <span className="font-bold text-[#1E3A8A]">{selectedPq.fullMarks}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Time Allowed</span>
                <span className="font-semibold text-slate-800">{selectedPq.timeAllowed}</span>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Official Exam Questions</h4>
              {selectedPq.sampleQuestions.map((sq, i) => (
                <div key={i} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1E3A8A]">{sq.section} &bull; Q{sq.questionNumber}</span>
                    <span className="font-mono text-slate-500 font-bold">[{sq.marks} Marks]</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{sq.text}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button variant="ghost" size="sm" onClick={() => setSelectedPq(null)}>
                Close Preview
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  handleDownloadQuestionPDF(selectedPq);
                  setSelectedPq(null);
                }}
              >
                <Download className="w-4 h-4 mr-1.5" />
                <span>Download Official PDF</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3: OFFICER ISSUE BOOK MODAL */}
      {isIssueModalOpen && (
        <Modal
          isOpen={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
          title="Issue Book to Enrolled Student"
          size="md"
        >
          <form onSubmit={handleIssueSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Book from Catalog</label>
              <select
                value={issueForm.bookId}
                onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
                required
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs"
              >
                <option value="">-- Choose Book --</option>
                {store.libraryBooks.map((b) => (
                  <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                    {b.title} ({b.availableCopies} available) [{b.callNumber}]
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student ID / Roll</label>
                <input
                  type="text"
                  value={issueForm.studentId}
                  onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value, studentRoll: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  value={issueForm.studentName}
                  onChange={(e) => setIssueForm({ ...issueForm, studentName: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Loan Duration</label>
              <select
                value={issueForm.dueDateDays}
                onChange={(e) => setIssueForm({ ...issueForm, dueDateDays: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs"
              >
                <option value={14}>14 Days (Standard Undergraduate Loan)</option>
                <option value={21}>21 Days (Extended Research Loan)</option>
                <option value={30}>30 Days (Faculty / Master's Scholar)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsIssueModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Confirm & Issue Book
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 4: OFFICER ADD NEW BOOK MODAL */}
      {isAddBookModalOpen && (
        <Modal
          isOpen={isAddBookModalOpen}
          onClose={() => setIsAddBookModalOpen(false)}
          title="Add New Book to Central Catalog"
          size="lg"
        >
          <form onSubmit={handleAddBookSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Book Title (English)</label>
                <input
                  type="text"
                  required
                  value={newBookForm.title}
                  onChange={(e) => setNewBookForm({ ...newBookForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title (Bangla)</label>
                <input
                  type="text"
                  value={newBookForm.titleBn}
                  onChange={(e) => setNewBookForm({ ...newBookForm, titleBn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Authors (comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thomas Cormen, Charles Leiserson"
                  value={newBookForm.authors}
                  onChange={(e) => setNewBookForm({ ...newBookForm, authors: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ISBN Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 978-0262046305"
                  value={newBookForm.isbn}
                  onChange={(e) => setNewBookForm({ ...newBookForm, isbn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newBookForm.category}
                  onChange={(e) => setNewBookForm({ ...newBookForm, category: e.target.value as BookCategory })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Call Number</label>
                <input
                  type="text"
                  placeholder="e.g. 005.1 C81"
                  value={newBookForm.callNumber}
                  onChange={(e) => setNewBookForm({ ...newBookForm, callNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Copies</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newBookForm.totalCopies}
                  onChange={(e) => setNewBookForm({ ...newBookForm, totalCopies: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Shelf Location</label>
                <input
                  type="text"
                  value={newBookForm.shelfLocation}
                  onChange={(e) => setNewBookForm({ ...newBookForm, shelfLocation: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={newBookForm.coverImage}
                  onChange={(e) => setNewBookForm({ ...newBookForm, coverImage: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description / Summary</label>
              <textarea
                rows={2}
                value={newBookForm.description}
                onChange={(e) => setNewBookForm({ ...newBookForm, description: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddBookModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save & Publish to Catalog
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
