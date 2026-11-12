/**
 * Hall Dining Management Types
 * JSTU Smart Campus - Demo Mode Only
 * 
 * SAFETY RULES:
 * - Demo data only. Two demo halls: "Hall A (Demo)" and "Hall B (Demo)".
 * - Never invent real hall names, provost names, phone numbers, prices or timings;
 *   mark every such value "[REPLACE WITH REAL CONTENT]" on screen and in code.
 * - Prices and charges are demo numbers. Payments are mock only.
 * - Real enforcement must move to Firestore rules / Cloud Functions.
 */

export type HallId = 'hall-a' | 'hall-b';

export type DiningRoomStatus = 'Open' | 'Closed' | 'Under maintenance';

export interface DiningRoom {
  id: string; // e.g. "hall-a-room-1"
  roomNumber: string;
  name: string;
  nameBn: string;
  capacity: number;
  status: DiningRoomStatus;
  managerRole: string; // "Dining Manager (Duty)" - role only, no real names!
  mealTimes: {
    breakfast?: string; // "[REPLACE WITH REAL CONTENT]" (optional for halls without breakfast)
    lunch: string;     // "[REPLACE WITH REAL CONTENT]"
    dinner: string;    // "[REPLACE WITH REAL CONTENT]"
  };
}

export interface DiningNotice {
  id: string;
  title: string;
  titleBn: string;
  date: string;
  category: 'schedule' | 'menu' | 'maintenance' | 'payment';
  content: string;
  contentBn: string;
}

export interface DiningRule {
  id: string;
  ruleEn: string;
  ruleBn: string;
}

export interface HallDiningOverview {
  id: HallId;
  name: string; // "Hall A (Demo)"
  nameBn: string; // "হল এ (ডেমো)"
  provostTitle: string; // "Provost, Hall A [REPLACE WITH REAL CONTENT]"
  contactPhone: string; // "+880 1700-000000 [REPLACE WITH REAL CONTENT]"
  contactEmail: string; // "hall-a.dining@jstu.ac.bd [REPLACE WITH REAL CONTENT]"
  diningRooms: DiningRoom[];
  mealRates: {
    breakfastRate: number; // Demo rate
    lunchRate: number;
    dinnerRate: number;
    monthlyEstimatedRate: number;
  };
  cutoffHour: number; // 20 for 8:00 PM the day before
  notices: DiningNotice[];
  rules: DiningRule[];
}

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export type AllergenTag = 'egg' | 'milk' | 'fish' | 'nuts' | 'gluten';

export interface DishItemDetail {
  name: string;
  nameBn: string;
  calories?: string; // e.g. "210 kcal [REPLACE WITH REAL CONTENT]"
  protein?: string;  // e.g. "14g [REPLACE WITH REAL CONTENT]"
  allergens?: AllergenTag[];
}

export interface MealCourses {
  items: string[];
  itemsBn: string[];
  calorieEst?: string;
  dishes?: DishItemDetail[];
}

export type MenuStatus = 'DRAFT' | 'PUBLISHED';

export interface DailyMealMenu {
  id: string; // e.g. "menu-hall-a-mon"
  hallId: HallId;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  dayOfWeekBn: string;
  dateStr?: string; // Optional specific date YYYY-MM-DD
  isSpecialMeal?: boolean;
  specialMealTitle?: string;
  specialMealTitleBn?: string;
  breakfast: MealCourses;
  lunch: MealCourses;
  dinner: MealCourses;
  status: MenuStatus;
  publishedAt?: string;
  publishedBy?: string;
  version: number;
  changeReason?: string;
}

export interface MealOnOffSetting {
  id: string;
  studentId: string;
  studentName: string;
  hallId: HallId;
  dateStr: string; // YYYY-MM-DD
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  updatedAt: string;
}

export type GuestMealStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface GuestMealRequest {
  id: string;
  studentId: string;
  studentName: string;
  hallId: HallId;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  guestCount: number;
  reason: string;
  status: GuestMealStatus;
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface MealRatingFeedback {
  id: string;
  studentId: string;
  hallId: HallId;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export type SuggestionStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface DishSuggestion {
  id: string;
  studentId: string; // Internal only, NEVER displayed publicly
  hallId: HallId;
  dishName: string; // max 200 characters
  description?: string;
  voteCount: number;
  votedStudentIds: string[]; // prevent multiple votes per student
  status: SuggestionStatus;
  reviewReason?: string;
  createdAt: string;
}

export type ComplaintCategory =
  | 'food_quality'
  | 'hygiene'
  | 'portion_size'
  | 'staff_behavior'
  | 'timing'
  | 'other';

export type ComplaintStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';

export interface DiningComplaint {
  id: string;
  referenceNumber: string; // e.g. "DC-2026-0842"
  hallId: HallId;
  category: ComplaintCategory;
  description: string;
  photoUrl?: string;
  isAnonymous: boolean;
  studentId?: string; // empty if anonymous
  studentName?: string; // empty if anonymous
  status: ComplaintStatus;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BazarCostEntry {
  id: string;
  hallId: HallId;
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  item: string;
  quantity: string;
  amount: number; // Demo BDT
  enteredBy: string;
  enteredAt: string;
  version: number;
  correctionReason?: string;
}

export type PaymentStatus = 'PAID' | 'UNPAID';

export interface StudentDiningBilling {
  id: string;
  studentId: string;
  studentName: string;
  hallId: HallId;
  diningRoomId: string;
  month: string; // e.g. "November 2026"
  totalMeals: number;
  breakfastCount: number;
  lunchCount: number;
  dinnerCount: number;
  mealRate: number; // calculated rate
  totalDue: number;
  paymentStatus: PaymentStatus;
  paidAt?: string;
  receiptNumber?: string;
  paymentMethod?: string;
}

export type DiningAuditAction =
  | 'MENU_PUBLISH'
  | 'COST_ENTRY'
  | 'RATE_CHANGE'
  | 'COMPLAINT_STATUS'
  | 'GUEST_MEAL_REVIEW'
  | 'SUGGESTION_REVIEW'
  | 'ROOM_STATUS_CHANGE'
  | 'CUTOFF_SETTING_CHANGE'
  | 'TOKEN_SCAN'
  | 'TOKEN_OVERRIDE'
  | 'SPECIAL_MEAL_CREATE'
  | 'MONTH_AUDITED';

export interface DiningAuditTrailEntry {
  id: string;
  timestamp: string;
  actorRole: string;
  actorUid: string;
  hallId: HallId;
  action: DiningAuditAction;
  details: string;
}

export interface MealToken {
  id: string;
  token: string; // crypto.getRandomValues unguessable hex, never contains personal data
  tokenString?: string; // alias
  manualCode: string; // 6-digit numeric fallback
  studentId: string; // server/store only, not in public QR
  studentUid?: string;
  studentName?: string;
  studentIdNumber?: string;
  maskedStudentName: string; // e.g. "F*****a K****r"
  hallId: HallId;
  dateStr: string; // YYYY-MM-DD
  date?: string; // alias
  mealType: MealType;
  expiresAt: string; // ISO timestamp or string
  isUsed: boolean;
  isSwitchedOn?: boolean;
  status?: 'ACTIVE' | 'USED' | 'EXPIRED' | 'INACTIVE';
  usedAt?: string;
  scanCounter?: number;
  servedCounter?: string;
  isManualOverride?: boolean;
  overrideReason?: string;
  overrideBy?: string;
}

export type TokenVerificationStatus =
  | 'VALID'
  | 'ALREADY_USED'
  | 'EXPIRED'
  | 'WRONG_HALL'
  | 'NOT_SWITCHED_ON'
  | 'NOT_FOUND';

export interface TokenVerificationResult {
  status: TokenVerificationStatus;
  mealType?: MealType;
  hallId?: HallId;
  maskedName?: string;
  maskedStudentName?: string;
  message: string;
  messageBn: string;
  token?: MealToken;
  verifiedAt: string;
}

export interface SpecialMealEvent {
  id: string;
  hallId: HallId;
  title: string;
  titleBn: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  description?: string;
  descriptionBn?: string;
  menuDescription?: string;
  menuDescriptionBn?: string;
  dishes?: DishItemDetail[];
  extraCharge: number; // Demo number BDT
  extraChargeBDT?: number;
  signupMode?: 'REQUIRED' | 'AUTOMATIC';
  isMandatory?: boolean;
  signupCutoff?: string;
  cutoffTime?: string;
  cutoffHour?: number;
  registeredStudentIds?: string[];
  optedOutStudentIds?: string[];
  participantUids?: string[];
  optOutUids?: string[];
  createdAt: string;
  createdBy?: string;
}

export interface MonthlyAuditStatus {
  id?: string;
  month: string; // YYYY-MM
  hallId: HallId;
  isAudited: boolean;
  auditedAt?: string;
  auditedBy?: string;
  auditNotes?: string;
  notes?: string;
}

export interface MonthlyAuditReportRecord {
  month: string; // e.g. "November 2026" or "2026-11"
  monthKey?: string; // "2026-11"
  hallId: HallId;
  totalMealsServed: number;
  totalMealsPlanned?: number;
  plannedMeals?: number | string;
  foodWastageEstimate?: string; // e.g. "3.2% (24 uncollected meals)"
  foodWastageEstimateKg?: number;
  averageRating: number;
  totalCost?: number;
  totalBazarCostBDT?: number;
  totalCollection?: number;
  totalCollectionBDT?: number;
  calculatedMealRate?: number;
  calculatedMealRateBDT?: number;
  totalComplaints?: number;
  complaintsSummary?: {
    submitted: number | string;
    underReview: number | string;
    resolved: number | string;
    dismissed: number | string;
  };
  complaintsByStatus?: Array<{ status: string; count: number | string }>;
  acceptedSuggestionsCount: number | string;
  dailyBreakdown?: Array<{
    date: string;
    mealsServed: number;
    plannedMeals: number;
    costBDT: number;
  }>;
  isAudited: boolean;
  auditedAt?: string;
  auditedBy?: string;
}

export interface DiningProvostReportData {
  mealsPerDay: Array<{ date: string; hallA: number; hallB: number }>;
  avgRatings: Array<{ hall: string; rating: number; totalRatings: number }>;
  costVsCollection: Array<{
    month: string;
    hallA_cost: number;
    hallA_collection: number;
    hallB_cost: number;
    hallB_collection: number;
  }>;
  complaintsByStatus: Array<{ status: string; count: number | string }>;
  summary: {
    totalActiveMealsHallA: number;
    totalActiveMealsHallB: number;
    calculatedMealRateHallA: number;
    calculatedMealRateHallB: number;
  };
}
