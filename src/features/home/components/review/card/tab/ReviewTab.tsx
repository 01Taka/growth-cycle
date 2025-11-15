import React from 'react';
import { Tabs } from '@mantine/core';
import { COLORS, REVIEW_LABELS } from '@/features/home/constants/review-constants';

interface ReviewTabProps {
  tabKey: string;
  totalCount: number;
  isActive: boolean;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({ tabKey, totalCount, isActive }) => {
  return (
    <Tabs.Tab
      value={tabKey}
      fw={600}
      style={
        isActive
          ? {
              backgroundColor: COLORS.orangeButton,
              color: COLORS.cardBg,
              borderRadius: '4px 4px 0 0',
            }
          : {}
      }
      c={isActive ? COLORS.cardBg : COLORS.textDark}
    >
      {REVIEW_LABELS.getDateLabel(tabKey)} ({totalCount})
    </Tabs.Tab>
  );
};
