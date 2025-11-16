import React from 'react';
import { Group, rem, Text } from '@mantine/core';
import { CYCLE_LIST_ITEM_TEXTS } from '../../constants/history-item-constants';

interface WaitingReviewBannerProps {
  differenceToNextFixedReview: number | null;
}

export const WaitingReviewBanner: React.FC<WaitingReviewBannerProps> = ({
  differenceToNextFixedReview,
}) => {
  return (
    <Group
      w="100%"
      bg="#FF8C00"
      align="center"
      justify="center"
      h={rem(24)}
      style={{ borderRadius: rem(10), minHeight: rem(20) }}
    >
      <Text fw={700} c="#FFFFFF">
        {differenceToNextFixedReview === 0
          ? CYCLE_LIST_ITEM_TEXTS.fixedReviewToday
          : CYCLE_LIST_ITEM_TEXTS.waitingForReview(differenceToNextFixedReview ?? 0)}
      </Text>
    </Group>
  );
};
