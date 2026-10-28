/**
 * JSTU Smart Campus — Analytics Service Factory
 *
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */

import { AnalyticsService } from './types';
import { MockAnalyticsService } from './mockAnalyticsService';

let analyticsServiceInstance: AnalyticsService | null = null;

export function getAnalyticsService(): AnalyticsService {
  if (!analyticsServiceInstance) {
    analyticsServiceInstance = new MockAnalyticsService();
  }
  return analyticsServiceInstance;
}

export * from './types';
