// HomeReviewTabs.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { IconClockHour3, IconSquareCheck } from '@tabler/icons-react';
import { CardSection, rem, Stack, Tabs, Text } from '@mantine/core';
import { COLORS, STRINGS } from '@/features/home/constants/review-constants';
import { LearningHistoryItem } from '@/features/learningHistory/components/item/LearningHistoryItem';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';

interface HomeReviewTabsProps {
  displayGroupKeys: string[];
  groupedTodayReviewCycles: Record<string, LearningCycleDocument[]>;
  groupedTodayReviewedCycles: Record<string, LearningCycleDocument[]>;
  onSelectReviewTarget: (cycle: LearningCycleDocument | null) => void;
}

// ヘルパー関数: 日付差を日本語のラベルに変換
const getDateLabel = (dayDiffKey: string): string => {
  const dayDiff = parseInt(dayDiffKey, 10);
  if (dayDiff === 0) return '今日';
  if (dayDiff === 1) return '昨日';
  if (dayDiff === -1) return '明日';
  if (dayDiff > 0) return `${dayDiff}日前`;
  return `${Math.abs(dayDiff)}日後`;
};

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

  // displayGroupKeysが更新された際に、アクティブタブを設定
  useEffect(() => {
    if (displayGroupKeys.length > 0 && activeTab === null) {
      setActiveTab(displayGroupKeys[0]);
    }
  }, [displayGroupKeys, activeTab]);

  // タブ内の (合計数) の計算
  const getTabTotalCount = useCallback(
    (key: string) => {
      return (
        (groupedTodayReviewCycles[key]?.length || 0) +
        (groupedTodayReviewedCycles[key]?.length || 0)
      );
    },
    [groupedTodayReviewCycles, groupedTodayReviewedCycles]
  );

  // 復習アイテムのレンダリング
  const renderReviewItems = useCallback(
    (key: string, isCompleted: boolean): React.ReactNode => {
      const cycles = isCompleted ? groupedTodayReviewedCycles[key] : groupedTodayReviewCycles[key];

      if (!cycles || cycles.length === 0) {
        return (
          <Text c="dimmed" p="md">
            {isCompleted ? STRINGS.noReviewedData : STRINGS.noReviewData}
          </Text>
        );
      }

      return cycles.map((cycle, index) => (
        <LearningHistoryItem
          key={`${isCompleted ? 'reviewed' : 'review'}-${key}-${index}`}
          plant={cycle.plant}
          subject={cycle.subject}
          textbookName={cycle.textbookName}
          unitNames={cycle.units.map((unit) => unit.name)}
          actionColor="orange"
          differenceFromLastAttempt={-parseInt(key)}
          testTargetProblemCount={cycle.problems.length}
          estimatedTestTimeMin={Math.floor((cycle.testDurationMs || 0) / 60000)}
          openedDetail={displayDetailCycleId === cycle.id}
          toggleOpenedDetail={() =>
            setDisplayDetailCycleId((prev) => (prev === cycle.id ? null : cycle.id))
          }
          onStartReview={() => {
            if (!isCompleted) {
              onSelectReviewTarget(cycle);
            }
          }}
          // 固定データ
          differenceToNextFixedReview={0}
          isWaitingFixedReview
          fixation={0}
          aggregatedSections={[]}
        />
      ));
    },
    [
      displayDetailCycleId,
      groupedTodayReviewCycles,
      groupedTodayReviewedCycles,
      onSelectReviewTarget,
    ]
  );

  return (
    <Tabs color={COLORS.orangeButton} value={activeTab} onChange={setActiveTab} variant="outline">
      <Tabs.List grow>
        {displayGroupKeys.map((key) => {
          const total = getTabTotalCount(key);
          if (total === 0) return null;

          return (
            <Tabs.Tab
              key={key}
              value={key}
              fw={600}
              style={
                activeTab === key
                  ? {
                      backgroundColor: COLORS.orangeButton,
                      color: COLORS.cardBg,
                      borderRadius: '4px 4px 0 0',
                    }
                  : {}
              }
              c={activeTab === key ? COLORS.cardBg : COLORS.textDark}
            >
              {getDateLabel(key)} ({total})
            </Tabs.Tab>
          );
        })}
      </Tabs.List>

      <CardSection mt="md" p="md">
        {activeTab ? (
          <Stack gap="lg">
            {/* 復習予定 (Review) */}
            <Stack gap="xs">
              <Text
                size="lg"
                fw={700}
                c={COLORS.orangeButton}
                style={{
                  borderLeft: `4px solid ${COLORS.orangeButton}`,
                  paddingLeft: rem(8),
                }}
              >
                <IconClockHour3 style={{ verticalAlign: 'middle', marginRight: rem(4) }} />
                復習予定 ({groupedTodayReviewCycles[activeTab]?.length || 0})
              </Text>
              <Stack gap="xs">{renderReviewItems(activeTab, false)}</Stack>
            </Stack>

            {/* 復習済み (Reviewed) */}
            <Stack gap="xs">
              <Text
                size="lg"
                fw={700}
                c={COLORS.completedGreen}
                style={{
                  borderLeft: `4px solid ${COLORS.completedGreen}`,
                  paddingLeft: rem(8),
                }}
              >
                <IconSquareCheck style={{ verticalAlign: 'middle', marginRight: rem(4) }} />
                復習済み ({groupedTodayReviewedCycles[activeTab]?.length || 0})
              </Text>
              <Stack gap="xs">{renderReviewItems(activeTab, true)}</Stack>
            </Stack>
          </Stack>
        ) : (
          <Text c="dimmed" p="md" ta="center">
            {STRINGS.noTabsData}
          </Text>
        )}
      </CardSection>
    </Tabs>
  );
};
