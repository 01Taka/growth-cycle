// ============================================
// HomeReviewTabs.tsx (メインコンポーネント)
// ============================================
import React, { useCallback } from 'react';
import { CardSection, Tabs, Text } from '@mantine/core';
import { COLORS, REVIEW_LABELS } from '@/features/home/constants/review-constants';
import { ReviewSectionCycleListProps } from '@/features/home/types/review-section-types';
import { ReviewTab } from './ReviewTab';
import { ReviewTabContent } from './ReviewTabContent';

interface HomeReviewTabsProps {
  listProps: ReviewSectionCycleListProps;
}

export const HomeReviewTabs: React.FC<HomeReviewTabsProps> = ({ listProps }) => {
  const getTabTotalCount = useCallback(
    (key: string) => {
      return listProps.groupCycleCountMap[key] || 0;
    },
    [listProps.groupCycleCountMap]
  );

  return (
    <Tabs
      color={COLORS.orangeButton}
      value={listProps.currentDisplayGroupKey}
      onChange={listProps.setCurrentDisplayGroupKey}
      variant="outline"
    >
      <Tabs.List grow>
        {listProps.displayGroupKeys.map((key) => {
          const total = getTabTotalCount(key);
          if (total === 0) return null;

          return (
            <ReviewTab
              key={key}
              tabKey={key}
              totalCount={total}
              isActive={listProps.currentDisplayGroupKey === key}
            />
          );
        })}
      </Tabs.List>

      <CardSection mt="md" p="md">
        {listProps.currentDisplayGroupKey ? (
          <ReviewTabContent listProps={listProps} />
        ) : (
          <Text c="dimmed" p="md" ta="center">
            {REVIEW_LABELS.noTabsData}
          </Text>
        )}
      </CardSection>
    </Tabs>
  );
};
