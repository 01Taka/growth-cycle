import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';

export interface CycleListItemAggregatedSection {
  value: number;
  stage: 0 | 1 | 2 | 3 | 4 | 5 | number;
  color: string;
  description: string;
  striped: boolean;
}

export interface CycleItemBaseData {
  cycleId: string;
  plant: Plant;
  subject: Subject;
  unitNames: string[];
  textbookId: string;
  textbookName: string;
  differenceFromLastAttempt: number;
  differenceToNextFixedReview: number | null;
  isWaitingFixedReview: boolean;
}

export interface CycleItemData extends CycleItemBaseData {
  fixation: number;
  aggregatedSections: CycleListItemAggregatedSection[];
  actionColor: string;

  testTargetProblemCount: number;
  estimatedTestTimeMin: number;
}
