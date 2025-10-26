import React, { useState } from 'react';
import {
  Card,
  CardSection,
  Flex,
  Pill,
  Stack,
  Tabs, // 👈 Tabs コンポーネントをインポート
  Text,
} from '@mantine/core';
import { ReviewLearningCycleItem } from './ReviewLearningCycleItem';
import { ReviewLearningCycleItemProps } from './shared-types';

// Tabの切り替えで使用する識別子
type ReviewPeriod = 'yesterday' | 'lastWeek';

interface HomeReviewCardProps {
  totalYesterdayReviewNum: number;
  totalLastWeekReviewNum: number;
  completedYesterdayReviewNum: number;
  completedLastWeekReviewNum: number;
  yesterdayItems: ReviewLearningCycleItemProps[];
  lastWeekItems: ReviewLearningCycleItemProps[];
}

export const HomeReviewCard: React.FC<HomeReviewCardProps> = ({
  totalYesterdayReviewNum,
  totalLastWeekReviewNum,
  completedYesterdayReviewNum,
  completedLastWeekReviewNum,
  yesterdayItems,
  lastWeekItems,
}) => {
  // 選択されているタブの状態を管理するためのstateを定義
  // 初期値は 'yesterday' (昨日の復習) に設定
  const [activeTab, setActiveTab] = useState<ReviewPeriod>('yesterday');

  // Styles for the main card and header elements
  const cardBgColor = '#fdf8ee'; // Light beige/tan for the main card
  const orangeButtonColor = '#f8b449'; // The specific orange tone for the buttons

  // 現在選択されているタブに基づいて表示するアイテムリストを決定
  const itemsToDisplay = activeTab === 'yesterday' ? yesterdayItems : lastWeekItems;

  // 現在の合計残りタスク数
  const remainingTasks =
    totalLastWeekReviewNum +
    totalYesterdayReviewNum -
    (completedYesterdayReviewNum + completedLastWeekReviewNum);

  // -------------------------------------------------------------
  // タブの切り替え時に呼び出される関数 (ボタンのクリックハンドラとして流用)
  const handleTabChange = (value: string | null) => {
    // Mantine TabsのonChangeはstring | nullを返す
    // ここでは 'yesterday' または 'lastWeek' の値であることを保証
    if (value === 'yesterday' || value === 'lastWeek') {
      setActiveTab(value);
    }
  };
  // -------------------------------------------------------------

  return (
    <Card shadow="sm" padding="md" radius="lg" bg={cardBgColor} style={{ margin: '10px' }}>
      <CardSection withBorder={false} p="md">
        <Stack>
          {/* Header Section: 今日の復習 and 残り N タスク */}
          <Flex justify="space-between" align="center">
            <Text size="xl" fw={700} style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: 8 }}>📚</span>
              今日の復習
            </Text>
            <Pill
              size="lg"
              radius="xl"
              bg="#8c775d" // Darker brown/grey background for the pill
              c="white" // White text color
              style={{ fontWeight: 700 }}
            >
              残り {remainingTasks} タスク
            </Pill>
          </Flex>

          {/* ------------------------------------------------------------- */}
          {/* Review Tabs Section: 昨日の復習 and 先週の復習 */}
          <Tabs
            value={activeTab} // 現在のstateと連携
            onChange={handleTabChange} // タブ切り替え時にstateを更新
            color={orangeButtonColor} // タブのアクティブカラー
            variant="pills" // Pill型のタブスタイル
            radius="md"
            defaultValue="yesterday"
          >
            {/* Tab.List: タブのヘッダー部分 */}
            <Tabs.List grow>
              {/* Tab for '昨日の復習' */}
              <Tabs.Tab
                value="yesterday"
                size="lg"
                style={{
                  height: 'auto',
                  padding: '10px 15px',
                  whiteSpace: 'normal',
                  lineHeight: 1.2,
                  // アクティブでないタブの背景色を調整 (オプション)
                  backgroundColor: activeTab === 'yesterday' ? orangeButtonColor : 'white',
                  color: activeTab === 'yesterday' ? 'white' : 'black',
                }}
              >
                昨日の復習 {completedYesterdayReviewNum} / {totalYesterdayReviewNum}
              </Tabs.Tab>

              {/* Tab for '先週の復習' */}
              <Tabs.Tab
                value="lastWeek"
                size="lg"
                style={{
                  height: 'auto',
                  padding: '10px 15px',
                  whiteSpace: 'normal',
                  lineHeight: 1.2,
                  // アクティブでないタブの背景色を調整 (オプション)
                  backgroundColor: activeTab === 'lastWeek' ? orangeButtonColor : 'white',
                  color: activeTab === 'lastWeek' ? 'white' : 'black',
                }}
              >
                先週の復習 {completedLastWeekReviewNum} / {totalLastWeekReviewNum}
              </Tabs.Tab>
            </Tabs.List>

            {/* Tab.Panel: タブの中身部分 */}
            <Tabs.Panel value="yesterday" pt="md">
              {/* 昨日のアイテムリスト */}
              <Stack style={{ width: '100%' }}>
                {yesterdayItems.map((item, index) => (
                  <ReviewLearningCycleItem key={index} {...item} />
                ))}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="lastWeek" pt="md">
              {/* 先週のアイテムリスト */}
              <Stack style={{ width: '100%' }}>
                {lastWeekItems.map((item, index) => (
                  <ReviewLearningCycleItem key={index} {...item} />
                ))}
              </Stack>
            </Tabs.Panel>
          </Tabs>
          {/* ------------------------------------------------------------- */}
        </Stack>
      </CardSection>
    </Card>
  );
};
