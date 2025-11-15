import React from 'react';
import { Card } from '@mantine/core';
import { LearningCycleProblem } from '@/shared/data/documents/learning-cycle/learning-cycle-support';

interface HistoryModalProblemCardProps {
  problem: LearningCycleProblem;
  onClick: () => void;
}

export const HistoryModalProblemCard: React.FC<HistoryModalProblemCardProps> = ({
  problem,
  onClick,
}) => {
  return <Card></Card>;
};
