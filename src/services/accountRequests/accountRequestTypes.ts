import { z } from 'zod';
import { AccountRequestRole, AccountRequestStatus, AccountRequest, SimulatedEmailLog, ActivationToken } from '../shared/sharedDataStore';

export type { AccountRequestRole, AccountRequestStatus, AccountRequest, SimulatedEmailLog, ActivationToken };

export const JSTU_DEPARTMENT_CODES = [
  'CSE',
  'EEE',
  'MATH',
  'FISH',
  'GEOL',
  'MGMT',
  'SW'
] as const;

export const JSTU_DEPARTMENTS_META = [
  { code: 'CSE', name: 'Computer Science & Engineering', nameBn: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং' },
  { code: 'EEE', name: 'Electrical & Electronic Engineering', nameBn: 'ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং' },
  { code: 'MATH', name: 'Mathematics', nameBn: 'গণিত' },
  { code: 'FISH', name: 'Fisheries', nameBn: 'মৎস্য বিজ্ঞান' },
  { code: 'GEOL', name: 'Geology', nameBn: 'ভূতত্ত্ব' },
  { code: 'MGMT', name: 'Management', nameBn: 'ব্যবস্থাপনা' },
  { code: 'SW', name: 'Social Work', nameBn: 'সমাজকর্ম' }
] as const;

export const JSTU_SESSIONS = [
  '2025-2026',
  '2024-2025',
  '2023-2024',
  '2022-2023',
  '2021-2022',
  '2020-2021'
] as const;

/**
 * Zod validation schema for Student Account Request submission.
 * NO password field and NO role field (role is always student).
 *
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */
export const accountRequestSchema = z
  .object({
    fullName: z
      .string()
      .min(3, { message: 'Full name must be at least 3 characters long.' })
      .max(100, { message: 'Full name cannot exceed 100 characters.' })
      .trim(),
    department: z
      .string()
      .min(2, { message: 'Please select one of the 7 JSTU academic departments.' })
      .refine(
        (val) =>
          JSTU_DEPARTMENT_CODES.includes(val as any) ||
          JSTU_DEPARTMENTS_META.some((d) => d.name.toLowerCase() === val.toLowerCase() || d.code.toLowerCase() === val.toLowerCase()),
        { message: 'Invalid department: must be one of the 7 official JSTU departments (CSE, EEE, MATH, FISH, GEOL, MGMT, SW).' }
      )
      .transform((val) => {
        const found = JSTU_DEPARTMENTS_META.find(
          (d) => d.name.toLowerCase() === val.toLowerCase() || d.code.toLowerCase() === val.toLowerCase()
        );
        return found ? found.code : val.toUpperCase();
      }),
    session: z
      .string()
      .min(4, { message: 'Academic session/batch is required (e.g. 2023-2024).' })
      .max(20, { message: 'Session cannot exceed 20 characters.' })
      .trim(),
    studentId: z
      .string()
      .min(3, { message: 'Student ID or admission roll number is required (minimum 3 characters).' })
      .max(30, { message: 'Student ID or admission roll cannot exceed 30 characters.' })
      .regex(/^[A-Za-z0-9\-_]+$/, {
        message: 'Student ID / roll can only contain letters, numbers, hyphens, and underscores.'
      })
      .trim(),
    email: z
      .string()
      .email({ message: 'Please enter a valid institutional or personal email address.' })
      .max(100, { message: 'Email cannot exceed 100 characters.' })
      .toLowerCase()
      .trim(),
    phone: z
      .string()
      .max(20, { message: 'Phone number cannot exceed 20 characters.' })
      .optional()
      .refine((val) => !val || /^[0-9+\-\s()]{7,20}$/.test(val), {
        message: 'Please enter a valid phone number or leave it blank.'
      }),
    note: z
      .string()
      .min(5, { message: 'Please provide a short explanation or note (minimum 5 characters).' })
      .max(500, { message: 'Note cannot exceed 500 characters.' })
      .trim(),
    // Anti-bot honeypot field
    website: z.string().max(100).optional(),
    // Invariant: Role cannot be set by the form (any attempt to pass role fails or is rejected)
    role: z
      .any()
      .optional()
      .refine((val) => val === undefined, {
        message: 'Role cannot be set by the form; role is always fixed to student.'
      })
  });

export type AccountRequestFormData = z.infer<typeof accountRequestSchema>;

/**
 * Zod validation schema for Status Check.
 * Takes reference number and email.
 *
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */
export const statusCheckSchema = z.object({
  referenceNumber: z
    .string()
    .min(5, { message: 'Reference number is required.' })
    .max(50, { message: 'Reference number cannot exceed 50 characters.' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .max(100, { message: 'Email cannot exceed 100 characters.' })
    .toLowerCase()
    .trim(),
  website: z.string().max(100).optional()
});

export type AccountRequestStatusCheckData = z.infer<typeof statusCheckSchema>;

export interface AccountRequestSubmissionResult {
  success: boolean;
  referenceNumber: string;
  message: string;
  isDuplicateSuppressed?: boolean;
}

export interface AccountRequestStatusCheckResult {
  found: boolean;
  status?: AccountRequestStatus;
  message?: string;
}

export interface AccountRequestFilterOptions {
  status?: AccountRequestStatus | 'ALL';
  department?: string | 'ALL';
  session?: string | 'ALL';
  searchQuery?: string;
}
