import { TeacherDataService } from './types';
import { MockTeacherDataService } from './mockTeacherDataService';

let teacherServiceInstance: TeacherDataService | null = null;

export function getTeacherDataService(): TeacherDataService {
  if (!teacherServiceInstance) {
    teacherServiceInstance = new MockTeacherDataService();
  }
  return teacherServiceInstance;
}

export * from './types';
