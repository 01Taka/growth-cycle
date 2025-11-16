import { LearningCycleListProps } from '@/features/learningDataList/components/cycleList/LearningCycleList';
import { CycleItemData } from '@/features/learningDataList/types/cycle-list-types';

export interface ReviewSectionCycleListProps
  extends Omit<LearningCycleListProps, 'cycleListItems'> {
  reviewCycleItems: CycleItemData[];
  reviewedCycleItems: CycleItemData[];
  groupCycleCountMap: Record<string, number>;
  displayGroupKeys: string[];
  currentDisplayGroupKey: string | null;
  setCurrentDisplayGroupKey: (key: string | null) => void;
}
