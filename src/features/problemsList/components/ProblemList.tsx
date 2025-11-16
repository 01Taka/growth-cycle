import React from 'react';
import { Stack } from '@mantine/core';
import { ProblemListItemData } from '../../learningHistory/types/problem-list-types';
import { ProblemListItem } from './ProblemListItem';

interface ProblemListProps {
  problems: ProblemListItemData[];
  selectedProblemIdSet: Set<string>;
  problemIndexMap: Record<string, number>;
  onToggleSelect: (id: string, problem: ProblemListItemData) => void;
}

export const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  selectedProblemIdSet,
  problemIndexMap,
  onToggleSelect,
}) => {
  return (
    <Stack gap={2}>
      {problems.map((problem) => (
        <ProblemListItem
          key={problem.key}
          problem={problem}
          problemIndex={problemIndexMap[problem.key]}
          isSelected={selectedProblemIdSet.has(problem.key)}
          onToggleSelect={() => onToggleSelect(problem.key, problem)}
        />
      ))}
    </Stack>
  );
};
