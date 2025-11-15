import React from 'react';
import { Stack } from '@mantine/core';
import { ProblemListItemData } from '../../learningHistory/types/problem-list-types';
import { ProblemListItem } from './ProblemListItem';

interface ProblemListProps {
  problems: ProblemListItemData[];
  selectedProblemIds: string[];
  onToggleSelect: (id: string, problem: ProblemListItemData) => void;
}

export const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  selectedProblemIds,
  onToggleSelect,
}) => {
  return (
    <Stack gap={2}>
      {problems.map((problem) => (
        <ProblemListItem
          key={problem.key}
          problem={problem}
          problemIndex={5}
          isSelected={selectedProblemIds.includes(problem.key)}
          onToggleSelect={() => onToggleSelect(problem.key, problem)}
        />
      ))}
    </Stack>
  );
};
