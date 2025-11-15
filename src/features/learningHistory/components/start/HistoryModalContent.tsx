import React from 'react';
import { LearningCycleProblem } from '@/shared/data/documents/learning-cycle/learning-cycle-support';

type HistoryDetailModalTabType = 'recommended' | 'all' | 'custom';
interface HistoryModalContentProps {
  problems: LearningCycleProblem[];
  selectedProblemIdSet: Set<string>;
  onChangeTab: (type: HistoryDetailModalTabType) => {};
}

export const HistoryModalContent: React.FC<HistoryModalContentProps> = ({
  problems,
  selectedProblemIdSet,
}) => {
  return <div></div>;
};
