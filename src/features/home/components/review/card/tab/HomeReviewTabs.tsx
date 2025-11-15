// ============================================
// HomeReviewTabs.tsx (メインコンポーネント)
// ============================================
import React, { useCallback, useEffect, useState } from 'react';
import { CardSection, Stack, Tabs, Text } from '@mantine/core';
import { COLORS, REVIEW_LABELS } from '@/features/home/constants/review-constants';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { ReviewTab } from './ReviewTab';
import { ReviewTabContent } from './ReviewTabContent';

interface HomeReviewTabsProps {
  displayGroupKeys: string[];
  groupedTodayReviewCycles: Record<string, LearningCycleDocument[]>;
  groupedTodayReviewedCycles: Record<string, LearningCycleDocument[]>;
  onSelectReviewTarget: (cycle: LearningCycleDocument | null) => void;
}

export const HomeReviewTabs: React.FC<HomeReviewTabsProps> = ({
  displayGroupKeys,
  groupedTodayReviewCycles,
  groupedTodayReviewedCycles,
  onSelectReviewTarget,
}) => {
  const [activeTab, setActiveTab] = useState<string | null>(
    displayGroupKeys.length > 0 ? displayGroupKeys[0] : null
  );

  const [displayDetailCycleId, setDisplayDetailCycleId] = useState<string | null>(null);

  useEffect(() => {
    if (displayGroupKeys.length > 0 && activeTab === null) {
      setActiveTab(displayGroupKeys[0]);
    }
  }, [displayGroupKeys, activeTab]);

  const getTabTotalCount = useCallback(
    (key: string) => {
      return (
        (groupedTodayReviewCycles[key]?.length || 0) +
        (groupedTodayReviewedCycles[key]?.length || 0)
      );
    },
    [groupedTodayReviewCycles, groupedTodayReviewedCycles]
  );

  const handleToggleDetail = useCallback((cycleId: string) => {
    setDisplayDetailCycleId((prev) => (prev === cycleId ? null : cycleId));
  }, []);

  return (
    <Tabs color={COLORS.orangeButton} value={activeTab} onChange={setActiveTab} variant="outline">
      <Tabs.List grow>
        {displayGroupKeys.map((key) => {
          const total = getTabTotalCount(key);
          if (total === 0) return null;

          return (
            <ReviewTab key={key} tabKey={key} totalCount={total} isActive={activeTab === key} />
          );
        })}
      </Tabs.List>

      <CardSection mt="md" p="md">
        {activeTab ? (
          <ReviewTabContent
            tabKey={activeTab}
            reviewCycles={groupedTodayReviewCycles[activeTab] || []}
            reviewedCycles={groupedTodayReviewedCycles[activeTab] || []}
            displayDetailCycleId={displayDetailCycleId}
            onToggleDetail={handleToggleDetail}
            onSelectReviewTarget={onSelectReviewTarget}
          />
        ) : (
          <Text c="dimmed" p="md" ta="center">
            {REVIEW_LABELS.noTabsData}
          </Text>
        )}
      </CardSection>
    </Tabs>
  );
};
