import React from 'react';
import { Box, Stack } from '@mantine/core';
import { ProblemAttemptDetail, ProblemScoringStatus } from '../../types/problem-types';
import { ScoringItem } from './ScoringItem';

interface ScoringListProps {
  problems: ProblemAttemptDetail[];
  scoringStatusMap: Record<number, ProblemScoringStatus>;
  bottomMargin?: number | string;
  onScoreChange: (problem: ProblemAttemptDetail, scoringStatus: ProblemScoringStatus) => void;
}

export const ScoringList: React.FC<ScoringListProps> = ({
  problems,
  scoringStatusMap,
  bottomMargin,
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
      <Box m={bottomMargin} />
    </Stack>
  );
};
