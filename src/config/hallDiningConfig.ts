import { HallId, MealType } from '../types/hallDining';

export interface HallDiningConfig {
  hallId: HallId;
  name: string;
  nameBn: string;
  allowedMeals: MealType[]; // e.g. ['lunch', 'dinner'] or ['breakfast', 'lunch', 'dinner']
  allowedMealLabels: Array<'Breakfast' | 'Lunch' | 'Dinner'>;
  managerEmail: string;
  provostTitle: string;
  provostTitleBn: string;
}

export const HALL_DINING_CONFIG: Record<HallId, HallDiningConfig> = {
  'hall-a': {
    hallId: 'hall-a',
    name: 'Oporajita Hall',
    nameBn: 'অপরাজিতা হল',
    allowedMeals: ['lunch', 'dinner'],
    allowedMealLabels: ['Lunch', 'Dinner'],
    managerEmail: 'dining.oporajita.demo@jstu.ac.bd',
    provostTitle: 'Provost, Oporajita Hall [REPLACE WITH REAL CONTENT]',
    provostTitleBn: 'প্রাধ্যক্ষ, অপরাজিতা হল [REPLACE WITH REAL CONTENT]'
  },
  'hall-b': {
    hallId: 'hall-b',
    name: 'Bijoy 24 Hall',
    nameBn: 'বিজয় ২৪ হল',
    allowedMeals: ['breakfast', 'lunch', 'dinner'],
    allowedMealLabels: ['Breakfast', 'Lunch', 'Dinner'],
    managerEmail: 'dining.bijoy24.demo@jstu.ac.bd',
    provostTitle: 'Provost, Bijoy 24 Hall [REPLACE WITH REAL CONTENT]',
    provostTitleBn: 'প্রাধ্যক্ষ, বিজয় ২৪ হল [REPLACE WITH REAL CONTENT]'
  }
};

export function getHallDiningConfig(hallId: HallId): HallDiningConfig {
  return HALL_DINING_CONFIG[hallId] || HALL_DINING_CONFIG['hall-a'];
}

export function isMealAllowedForHall(hallId: HallId, mealType: MealType | 'Breakfast' | 'Lunch' | 'Dinner'): boolean {
  const cfg = getHallDiningConfig(hallId);
  const normalized = mealType.toLowerCase() as MealType;
  return cfg.allowedMeals.includes(normalized);
}

export function getHallForUserEmail(email?: string): HallId | null {
  if (!email) return null;
  const clean = email.toLowerCase().trim();
  if (clean === 'dining.oporajita.demo@jstu.ac.bd') return 'hall-a';
  if (clean === 'dining.bijoy24.demo@jstu.ac.bd') return 'hall-b';
  if (clean === 'student2.demo@jstu.ac.bd') return 'hall-b';
  if (clean === 'student.demo@jstu.ac.bd') return 'hall-a';
  return null;
}
