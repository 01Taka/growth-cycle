import { DefaultMantineColor } from '@mantine/core';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';

export interface DifferenceGrade {
  grade: number;
  maxDifferenceDays: number;
  color: DefaultMantineColor;
  description: string;
}

export type HistorySortType = 'lastAttempt_desc' | 'lastAttempt_asc' | 'fixation';
