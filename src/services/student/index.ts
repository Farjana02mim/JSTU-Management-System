import { StudentDataService } from './types';
import { MockStudentDataService } from './mockStudentDataService';

let serviceInstance: StudentDataService | null = null;

export function getStudentDataService(): StudentDataService {
  if (!serviceInstance) {
    serviceInstance = new MockStudentDataService();
  }
  return serviceInstance;
}

export * from './types';
