import React from 'react';
import { Stack } from '@mantine/core';
import { ReviewLearningCycleItem } from './ReviewLearningCycleItem';

interface ReviewLearningCycleListProps {}

export const ReviewLearningCycleList: React.FC<ReviewLearningCycleListProps> = ({}) => {
  return (
    <Stack>
      <ReviewLearningCycleItem
        plantIndex={1}
        subject="japanese"
        unitNames={['物質の成分と構成元素', '数と式']}
        testDurationMin={10}
      />
      <ReviewLearningCycleItem
        plantIndex={3}
        subject="english"
        unitNames={['物質の成分と構成元素', '数と式']}
        testDurationMin={10}
      />
    </Stack>
  );
};
