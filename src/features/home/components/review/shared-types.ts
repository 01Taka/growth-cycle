import { Timestamp } from 'firebase/firestore';
import { Subject } from '@/shared/types/subject-types';

export interface ReviewLearningCycleItemProps {
  isCompleted: boolean;
  plantIndex: number;
  subject: Subject;
  unitNames: string[];
  testDurationMin: number;
  cycleStartAt: Timestamp;
}
