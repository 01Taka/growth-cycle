import { Timestamp } from 'firebase/firestore';
import { Subject } from '@/shared/types/study-shared-types';

export interface ReviewLearningCycleItemProps {
  isCompleted: boolean;
  plantIndex: number;
  subject: Subject;
  unitNames: string[];
  testDurationMin: number;
  cycleStartAt: Timestamp;
}
