import React from 'react';
import { IconCircleCheck } from '@tabler/icons-react';
import { Box, Button, rem, Stack } from '@mantine/core';
import {
  GroupedByIndexTestResult,
  GroupedByIndexTestResultProblem,
} from '@/features/app/learningCycles/types/expand-learning-cycle-types';
import { ReviewNecessityResultWithGroup } from '@/features/app/review-necessity/types/review-necessity-types';
import { sharedStyle } from '@/shared/styles/shared-styles';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { range } from '@/shared/utils/range';
import { RecordReviewCard } from './RecordReviewCard';

interface ReviewPhaseProps {
  groupedTestResults: GroupedByIndexTestResult[];
  theme: SubjectColorMap;
  onFinish: () => void;
}

interface CardDisplayData {
  problems: GroupedByIndexTestResultProblem[];
  higherLevelNecessity: ReviewNecessityResultWithGroup;
  groupedTestResult: GroupedByIndexTestResult;
}

export const ReviewPhase: React.FC<ReviewPhaseProps> = ({
  groupedTestResults,
  theme,
  onFinish,
}) => {
  const processedResults: CardDisplayData[] = groupedTestResults.map((groupedTestResult) => {
    // 試行データ（problems）の準備
    const problems = [...range(2, -1, -1)].map(
      (order) =>
        groupedTestResult.resultsMapByAttemptOrder[order] ?? {
          attemptAt: Date.now(),
          timeSpentMs: 0,
          scoringStatus: 'unrated',
          selfEvaluation: 'unrated',
          necessity: {
            isUnrated: true,
            isGroup: false,
            level: -1,
            reason: 'fullyUnrated',
            alternativeLevel: 0,
          },
        }
    );

    const lastProblem = problems[problems.length - 1];

    // 最高レベルの必要度（higherLevelNecessity）の決定
    const higherLevelNecessity = lastProblem.necessity
      ? lastProblem.necessity.level >= groupedTestResult.groupNecessity.level
        ? lastProblem.necessity
        : groupedTestResult.groupNecessity
      : groupedTestResult.groupNecessity;

    return {
      problems,
      higherLevelNecessity,
      groupedTestResult,
    };
  });

  // 例: higherLevelNecessityのレベルで降順にソート（最も見直しが必要なものを上にする）
  const sortedResults = processedResults.sort(
    (a, b) => b.higherLevelNecessity.level - a.higherLevelNecessity.level
  );

  return (
    <Box style={{ position: 'relative' }}>
      <Stack w={'100%'} align="center" justify="center" mb={120}>
        {sortedResults.map((data, index) => (
          <Box key={index} w={'95%'}>
            <RecordReviewCard
              groupedTestResult={data.groupedTestResult}
              problems={data.problems}
              higherLevelNecessity={data.higherLevelNecessity}
            />
          </Box>
        ))}
      </Stack>
      <Button
        h={64}
        color={theme.accent}
        size={rem(20)}
        style={{
          ...sharedStyle.button,
          position: 'fixed',
          bottom: 5,
          right: 5,
          left: 5,
          color: theme.text,
        }}
        onClick={onFinish}
      >
        見直し完了
        <IconCircleCheck />
      </Button>
    </Box>
  );
};
