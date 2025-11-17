import React from 'react';
import { Box, Stack } from '@mantine/core';
import { ExpandedLearningCycleProblem } from '@/features/app/learningCycles/types/expand-learning-cycle-types';
import {
  ProblemScoringStatus,
  TestSelfEvaluation,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { ScoringItem } from './ScoringItem';

interface ScoringListProps {
  problems: ExpandedLearningCycleProblem[];
  selfEvaluationsMap: Record<string, TestSelfEvaluation>;
  scoringStatusMap: Record<string, ProblemScoringStatus>;
  bottomMargin?: number | string;
  onScoreChange: (
    problem: ExpandedLearningCycleProblem,
    scoringStatus: ProblemScoringStatus
  ) => void;
}

export const ScoringList: React.FC<ScoringListProps> = ({
  problems,
  selfEvaluationsMap,
  scoringStatusMap,
  bottomMargin,
  onScoreChange,
}) => {
  return (
    <Stack gap={4}>
      {problems.map((problem, index) => (
        <ScoringItem
          key={index}
          problem={problem}
          selfEvaluation={selfEvaluationsMap[problem.structuredId] ?? 'unrated'}
          scoringStatus={scoringStatusMap[problem.structuredId] ?? 'unrated'}
          onScoreChange={(scoringStatus) => onScoreChange(problem, scoringStatus)}
        />
      ))}
      <Box m={bottomMargin} />
    </Stack>
  );
};
