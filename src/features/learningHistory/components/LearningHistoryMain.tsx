import React, { useEffect } from 'react';
import { Box, Stack } from '@mantine/core';
import { calculateSM2ReviewScheduleForCycle } from '@/features/app/sm2/functions/calculate-sm2-schedule';
import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { useLearningCycleStore } from '@/shared/stores/useLearningCycleStore';
import { getDaysDifference } from '@/shared/utils/datetime/datetime-compare-utils';
import { range } from '@/shared/utils/range';
import { LearningHistoryItem } from './LearningHistoryItem';

interface LearningHistoryMainProps {}

const handleCycleToItem = (learningCycle: LearningCycle, onCheckDetail: () => void) => {
  return {
    plant: learningCycle.plant,
    subject: learningCycle.subject,
    textbookName: learningCycle.textbookName,
    unitNames: Object.values(learningCycle.units).map((unit) => unit.name),
    problemCount: learningCycle.problems.length,
    testDurationMin: Math.floor(learningCycle.testDurationMs / 60000),
    isCompleted: false,
    onCheckDetail,
  };
};

export const LearningHistoryMain: React.FC<LearningHistoryMainProps> = ({}) => {
  const { learningCycles, fetchLearningCycles } = useLearningCycleStore();

  useEffect(() => {
    fetchLearningCycles();
  }, [fetchLearningCycles]);

  return (
    <Stack gap="xs" align="center">
      {learningCycles.map((cycle) => {
        const record = calculateSM2ReviewScheduleForCycle(cycle);
        const dates = Object.values(record).map((date) => date);
        const sortedDates = dates.sort((a, b) => b - a);
        const dateDiffs = sortedDates.map((date) => getDaysDifference(date));

        const getDifferenceToNextFixedReview = () => {
          const diff = Math.min(
            ...cycle.fixedReviewDates.map((date) => {
              const diff = getDaysDifference(date);
              return diff >= 0 ? diff : Number.MAX_SAFE_INTEGER;
            })
          );
          return diff === Number.POSITIVE_INFINITY ? null : diff;
        };

        const differenceToNextFixedReview = getDifferenceToNextFixedReview();
        const totalProblemCount = dateDiffs.length;
        const fixation = dateDiffs.filter((diff) => diff > 0).length / totalProblemCount;

        return (
          <Box w={'95%'}>
            <LearningHistoryItem
              key={cycle.id}
              plant={cycle.plant}
              subject={cycle.subject}
              fixation={fixation}
              unitNames={cycle.units.map((unit) => unit.name)}
              textbookName={cycle.textbookName}
              differenceFromLastAttempt={getDaysDifference(cycle.latestAttemptedAt)}
              dateDifferencesFromReview={dateDiffs}
              totalProblemCount={totalProblemCount}
              differenceToNextFixedReview={differenceToNextFixedReview}
              onCheckDetail={() => {}}
            />
          </Box>
        );
      })}
    </Stack>
  );
};
