// HomeReviewCard.tsx
import React from 'react';
import { Card } from '@mantine/core';
import { COLORS, REVIEW_LABELS } from '@/features/home/constants/review-constants';
import { ReviewSectionCycleListProps } from '@/features/home/types/review-section-types';
import { HomeReviewCardHeader } from './HomeReviewCardHeader';
import { HomeReviewTabs } from './tab/HomeReviewTabs';

interface HomeReviewCardProps {
  listProps: ReviewSectionCycleListProps;
  remainingTaskCount: number;
  totalTaskCount: number;
}

export const HomeReviewCard: React.FC<HomeReviewCardProps> = ({
  listProps,
  remainingTaskCount,
  totalTaskCount,
}) => {
  const progressCount = totalTaskCount - remainingTaskCount;
  const progressString = REVIEW_LABELS.getProgressPillLabel(progressCount, totalTaskCount);

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="lg"
      bg={COLORS.cardBg}
      style={{ margin: '10px', border: `3px solid ${COLORS.cardBorder}` }}
    >
      {/* --- ヘッダーと進捗表示 --- */}
      <HomeReviewCardHeader remainingTasks={remainingTaskCount} progressString={progressString} />

      <HomeReviewTabs listProps={listProps} />
    </Card>
  );
};
