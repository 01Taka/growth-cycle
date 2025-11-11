import React, { useMemo, useState } from 'react';
import { IconClockHour3, IconSquareCheck } from '@tabler/icons-react';
import { Card, CardSection, Flex, Pill, rem, Stack, Tabs, Text } from '@mantine/core';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { ReviewLearningCycleItem } from './ReviewLearningCycleItem';

// --- 定数と型定義の再エクスポート (可読性の向上) ---

interface DateGroupedCycles {
  todayReviewCycles: LearningCycleDocument[];
  todayReviewedCycles: LearningCycleDocument[];
}

interface HomeReviewCardProps {
  groupedCycles: Record<number, DateGroupedCycles>;
  todayReviewCyclesCount: number;
  todayReviewedCyclesCount: number;
  onStartReview: (reviewCycle: LearningCycleDocument) => void;
}

// --- スタイル定義 (コンポーネント外で定義) ---
const COLORS = {
  // 変更なし: 全体の背景色。より白くするとモダンになるが、トーンを維持
  cardBg: '#F5F0E6', // 👈 変更: 背景を少し明るくし、コントラストを改善
  pillBg: '#ffb84e',

  // 変更なし: カードの枠線。アクセントとして機能
  cardBorder: '#EA8E00',

  // 変更: メインのアクセントカラー（復習予定、アクティブタブ）。より鮮やかで目立つ色に
  orangeButton: '#ed8e00', // 👈 変更: アクセント色をより鮮明なオレンジに (元: #f8b449)

  // 変更: 一般的な文字色や非アクティブな色。コントラストを上げるため、より濃い色に
  textDark: '#2B2B2B', // 👈 変更: 暗い文字色をより濃くし、背景との視認性を向上 (元: #454545)

  // 変更なし: 完了を示す色
  completedGreen: '#4CAF50', // 👈 変更: 一般的なグリーンカラーで視認性を向上 (元: 'green')
};

const STRINGS = {
  headerTitle: '🗓️ 今日の復習',
  remainingTasksLabel: '残りタスク:',
  noReviewData: '復習予定のデータがありません。',
  noReviewedData: '復習済みのデータがありません。',
  noTabsData: '表示する復習データがありません。',
};

// --- ヘルパー関数: 日付差を日本語のラベルに変換 (修正済み) ---
const getDateLabel = (dayDiff: number): string => {
  if (dayDiff === 0) return '今日';
  if (dayDiff === 1) return '昨日';
  if (dayDiff === -1) return '明日';
  if (dayDiff > 0) return `${dayDiff}日前`; // 正の値は過去
  return `${Math.abs(dayDiff)}日後`; // 負の値は未来
};

export const HomeReviewCard: React.FC<HomeReviewCardProps> = ({
  groupedCycles,
  todayReviewCyclesCount,
  todayReviewedCyclesCount,
  onStartReview,
}) => {
  // groupedCyclesのキーをソートし、string[]として保持 (ソートロジック修正済み)
  const dateKeys = useMemo(
    () =>
      Object.keys(groupedCycles)
        .map(Number)
        .sort((a, b) => {
          // 1. 0（今日）を最優先
          if (a === 0) return -1;
          if (b === 0) return 1;

          // 2. 正の値（過去）を小さい順（新しい順: 1日前, 2日前...）に並べる
          if (a > 0 && b > 0) return a - b;

          // 3. 負の値（未来）を大きい順（近い順: 明日(-1), 明後日(-2)...）に並べる
          if (a < 0 && b < 0) return b - a;

          // 4. 正の値 vs 負の値: 正の値（過去）を優先
          if (a > 0) return -1;
          return 1;
        })
        .map(String),
    [groupedCycles]
  );

  // 初回のアクティブタブを設定
  const [activeTab, setActiveTab] = useState<string | null>(
    dateKeys.length > 0 ? dateKeys[0] : null
  );

  const remainingTasks = todayReviewCyclesCount;
  const totalTasks = todayReviewCyclesCount + todayReviewedCyclesCount;
  const progressString = `${todayReviewedCyclesCount} / ${totalTasks}`;

  // 🔨 統合ヘルパー関数: 復習アイテムのレンダリング
  const renderReviewItems = (key: string, isCompleted: boolean): React.ReactNode => {
    const dayDiff = parseInt(key);
    const cycleData = groupedCycles[dayDiff];

    if (!cycleData) {
      return (
        <Text c="dimmed" p="md">
          {isCompleted ? STRINGS.noReviewedData : STRINGS.noReviewData}
        </Text>
      );
    }

    const cycles = isCompleted ? cycleData.todayReviewedCycles : cycleData.todayReviewCycles;

    if (cycles.length === 0) {
      return (
        <Text c="dimmed" p="md">
          {isCompleted ? STRINGS.noReviewedData : STRINGS.noReviewData}
        </Text>
      );
    }

    return cycles.map((cycle, index) => (
      <ReviewLearningCycleItem
        key={`${isCompleted ? 'reviewed' : 'review'}-${key}-${index}`}
        isCompleted={isCompleted}
        plantShape={cycle.plantShape}
        subject={cycle.subject}
        unitNames={cycle.units.map((unit) => unit.name)}
        problemCount={cycle.problems.length}
        // testDurationMsを分に変換
        testDurationMin={Math.floor((cycle.testDurationMs || 0) / 60000)}
        onStartReview={() => onStartReview(cycle)}
      />
    ));
  };

  const currentCycleData = activeTab ? groupedCycles[parseInt(activeTab)] : null;
  const reviewCount = currentCycleData?.todayReviewCycles.length || 0;
  const reviewedCount = currentCycleData?.todayReviewedCycles.length || 0;

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="lg"
      bg={COLORS.cardBg}
      style={{ margin: '10px', border: `3px solid ${COLORS.cardBorder}` }}
    >
      {/* --- ヘッダーと進捗表示 --- */}
      <CardSection p="md">
        <Stack gap="xs">
          <Text fw={700} size="xl" c={COLORS.textDark}>
            {STRINGS.headerTitle}
          </Text>
          <Flex justify="space-between" align="center">
            <Text fw={600} size="md" c={COLORS.textDark}>
              {STRINGS.remainingTasksLabel}
              <Text span c={COLORS.orangeButton} size="xl" fw={700} ml={5}>
                {remainingTasks}
              </Text>
            </Text>
            <Pill size="md" radius="xl" variant="filled" bg={COLORS.pillBg} color={COLORS.textDark}>
              進捗: {progressString}
            </Pill>
          </Flex>
        </Stack>
      </CardSection>

      {/* --- タブとコンテンツ --- */}
      <Tabs color={COLORS.orangeButton} value={activeTab} onChange={setActiveTab} variant="outline">
        <Tabs.List grow>
          {dateKeys.map((key) => {
            const dayDiff = parseInt(key);
            const dataForDay = groupedCycles[dayDiff];

            // データが存在しない日（キー）をスキップ
            if (!dataForDay) return null;

            const total =
              dataForDay.todayReviewCycles.length + dataForDay.todayReviewedCycles.length;

            if (total === 0) return null;

            return (
              <Tabs.Tab
                key={key}
                value={key}
                fw={600}
                style={
                  activeTab === key
                    ? {
                        backgroundColor: COLORS.orangeButton, // アクティブ時の背景色
                        color: COLORS.cardBg, // アクティブ時の文字色（背景色に合わせて反転）
                        borderRadius: '4px 4px 0 0', // 角丸の調整
                      }
                    : {}
                }
                c={activeTab === key ? COLORS.cardBg : COLORS.textDark} // 文字色を制御
              >
                {getDateLabel(dayDiff)} ({total})
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
                  復習予定 ({reviewCount})
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
                  復習済み ({reviewedCount})
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
    </Card>
  );
};
