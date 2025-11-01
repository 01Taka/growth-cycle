import { Subject } from '@/shared/types/subject-types';

export interface TextbookPlant {
  plantIndex: number;
  positionX: number; // Value from 0 to 1
  size: number;
}

export interface TextbookItemProps {
  subject: Subject;
  textbookName: string;
  totalPlants: number;
  daysSinceLastAttempt: number;
  plants: TextbookPlant[];
  maxSize: number;
}
