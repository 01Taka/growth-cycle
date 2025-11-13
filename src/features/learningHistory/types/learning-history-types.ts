import { DefaultMantineColor } from '@mantine/core';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';

export interface DifferenceGrade {
  grade: number;
  maxDifferenceDays: number;
  color: DefaultMantineColor;
  description: string;
}

export interface AggregatedSection {
  value: number;
  color: string;
  description: string;
  striped: boolean;
  grade: number;
}

export interface LearningHistoryItemData {
  // keyプロパティはレンダリングする親要素で使うため、ここでは除外します
  plant: Plant;
  subject: Subject;
  fixation: number;
  unitNames: string[];
  textbookName: string;
  differenceFromLastAttempt: number;
  testTargetProblemCount: number;
  estimatedTestTimeMin: number;
  differenceToNextFixedReview: number | null;
  aggregatedSections: AggregatedSection[];
  actionColor: string;
}

export interface LearningItem {
  cycleId: string;
  data: LearningHistoryItemData;
}

export type HistorySortType = 'lastAttempt_desc' | 'lastAttempt_asc' | 'fixation';
