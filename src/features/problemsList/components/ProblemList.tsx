import React from 'react';
import { Stack } from '@mantine/core';
import { ProblemListItemData } from '../../learningHistory/types/problem-list-types';
import { ProblemListItem } from './ProblemListItem';

interface ProblemListProps {
  problems: ProblemListItemData[];
  selectedProblemIds: string[];
  onToggleSelect: (problem: ProblemListItemData) => {};
}

export const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  selectedProblemIds,
  onToggleSelect,
}) => {
  return (
    <Stack>
      {problems.map((problem) => (
        <ProblemListItem
          key={problem.id}
          problem={problem}
          isSelected={selectedProblemIds.includes(problem.id)}
          onToggleSelect={() => onToggleSelect(problem)}
        />
      ))}
    </Stack>
  );
};
