import { Subject } from '@/shared/types/subject-types';

export interface Textbook {
  id: string;
  subject: Subject;
  name: string;
  // totalStudyCount: number;
  // latestStudyAt: Timestamp;
}
