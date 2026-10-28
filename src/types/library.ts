export type BookCategory =
  | 'Computer Science & Engineering'
  | 'Electrical & Electronic Engineering'
  | 'Mathematics & Statistics'
  | 'Fisheries & Marine Resources'
  | 'Geology & Mining Engineering'
  | 'Management & Business Studies'
  | 'Software Engineering'
  | 'General Science & Reference'
  | 'Literature & History';

export interface Book {
  id: string;
  title: string;
  titleBn: string;
  authors: string[];
  isbn: string;
  edition: string;
  publisher: string;
  publishedYear: number;
  category: BookCategory;
  departmentCode: string; // 'CSE', 'EEE', 'MATH', etc.
  callNumber: string; // e.g. "005.133 S64C"
  shelfLocation: string; // e.g. "Rack 3B, 2nd Floor, Central Library"
  totalCopies: number;
  availableCopies: number;
  coverImage?: string;
  description: string;
  descriptionBn: string;
  tags: string[];
  language: 'English' | 'Bangla';
  eBookAvailable?: boolean;
}

export type BorrowingStatus = 'active' | 'returned' | 'overdue';

export interface BookBorrowing {
  id: string;
  bookId: string;
  bookTitle: string;
  bookTitleBn?: string;
  bookIsbn: string;
  callNumber: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  status: BorrowingStatus;
  renewalCount: number; // max 2
  fineAmount: number; // in BDT
  finePaid?: boolean;
  issuedBy: string;
  notes?: string;
}

export type ReservationStatus = 'pending' | 'ready_for_pickup' | 'fulfilled' | 'cancelled';

export interface BookReservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookTitleBn?: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  reservedAt: string; // ISO
  expiryDate: string; // YYYY-MM-DD
  status: ReservationStatus;
  priorityPosition: number;
}

export interface EResource {
  id: string;
  title: string;
  titleBn: string;
  type: 'journal' | 'database' | 'ebook' | 'repository' | 'open_access';
  provider: string;
  description: string;
  descriptionBn: string;
  accessType: 'Campus IP & Remote Proxy' | 'Open Access' | 'Institutional Login';
  coverage: string;
  url: string;
  badge: string;
  iconName: string;
}

export interface PreviousQuestion {
  id: string;
  departmentId: string; // e.g. "CSE"
  departmentName: string;
  departmentNameBn: string;
  year: number; // 2025, 2024, 2023, 2022, 2021
  semester: string; // "Year 1 Term 1", "Year 2 Term 2", "Year 3 Term 1", etc.
  examType: 'Final Examination' | 'Midterm Examination' | 'Special Carry Exam';
  courseCode: string;
  courseTitle: string;
  courseTitleBn: string;
  credit: number;
  fullMarks: number;
  timeAllowed: string;
  sampleQuestions: {
    section: string;
    questionNumber: string;
    text: string;
    marks: number;
  }[];
}

export interface LibraryStats {
  totalBooks: number;
  totalTitles: number;
  activeBorrowings: number;
  overdueCount: number;
  dailyFootfall: number;
  digitalJournals: number;
}
