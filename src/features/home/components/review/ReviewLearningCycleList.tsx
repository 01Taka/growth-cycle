import React from 'react';
import { Stack } from '@mantine/core';
import { ReviewLearningCycleItem } from './ReviewLearningCycleItem';

interface ReviewLearningCycleListProps {}

export const ReviewLearningCycleList: React.FC<ReviewLearningCycleListProps> = ({}) => {
  // const random = getDeterministicRandom(learningCycle.textbookId, 0);
  // const maxIndex = 16;
  // const plantIndex = Math.floor(random * (maxIndex + 1));

  return (
    <Stack>
      <ReviewLearningCycleItem
        isAchieved={false}
        plantIndex={1}
        subject="japanese"
        unitNames={['物質の成分と構成元素', '数と式']}
        testDurationMin={10}
      />
      <ReviewLearningCycleItem
        isAchieved={true}
        plantIndex={3}
        subject="english"
        unitNames={['物質の成分と構成元素', '数と式']}
        testDurationMin={10}
      />
      <ReviewLearningCycleItem
        isAchieved={true}
        plantIndex={3}
        subject="science"
        unitNames={['物質の成分と構成元素', '数と式']}
        testDurationMin={10}
      />
    </Stack>
  );
};
