import React from 'react';
import { Stack } from '@mantine/core';
import { ScoringStatus, TestProblemAttemptResult } from '../../types/problem-types';
import { ScoringItem } from './ScoringItem';

interface ScoringListProps {
  problems: TestProblemAttemptResult[];
  scoringStatusMap: Record<number, ScoringStatus>;
  onScoreChange: (problem: TestProblemAttemptResult, scoringStatus: ScoringStatus) => void;
}

export const ScoringList: React.FC<ScoringListProps> = ({
  problems,
  scoringStatusMap,
  onScoreChange,
}) => {
  return (
    <Stack>
      {problems.map((problem, index) => (
        <ScoringItem
          key={index}
          problem={problem}
          scoringStatus={scoringStatusMap[problem.problemIndex] ?? 'unrated'}
          onScoreChange={(scoringStatus) => onScoreChange(problem, scoringStatus)}
        />
      ))}
    </Stack>
  );
};
