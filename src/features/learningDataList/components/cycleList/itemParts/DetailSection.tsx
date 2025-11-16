import React from 'react';
import { Button, Flex, Stack, Text } from '@mantine/core';
import { CYCLE_LIST_ITEM_TEXTS } from '@/features/learningDataList/constants/cycle-list-item-constants';

interface DetailSectionProps {
  testTargetProblemCount: number;
  estimatedTestTimeMin: number;
  actionColor: string;
  onStartReview: () => void;
  onCheckAndSelectProblems: () => void;
}

export const DetailSection: React.FC<DetailSectionProps> = ({
  testTargetProblemCount,
  estimatedTestTimeMin,
  actionColor,
  onStartReview,
  onCheckAndSelectProblems,
}) => {
  return (
    // 全体を垂直方向に並べるStackに変更
    <Stack mt="md" p="md" bg="#F8F8F8" style={{ borderRadius: '8px' }} gap="md">
      {/* 1. 詳細情報セクション (表示されるのは「おすすめ」の問題数と時間のみ) */}
      <Flex align="center" justify="space-between">
        <Stack gap={3}>
          {/* 問題数 */}
          <Text size="md" fw={700} c="#333">
            {CYCLE_LIST_ITEM_TEXTS.problemCountLabel}
            <Text span fw={700} c={actionColor}>
              {testTargetProblemCount}
            </Text>
            {CYCLE_LIST_ITEM_TEXTS.problemCountUnit}
          </Text>
          {/* 推定時間 */}
          <Text size="md" fw={700} c="#333">
            {CYCLE_LIST_ITEM_TEXTS.estimatedTimeLabel}
            <Text span fw={700} c="#555">
              {estimatedTestTimeMin}
            </Text>
            {CYCLE_LIST_ITEM_TEXTS.estimatedTimeUnit}
          </Text>
        </Stack>
      </Flex>

      {/* 2. アクションボタンセクション（縦並びの2つ） */}
      <Stack gap="xs">
        {/* 1. おすすめで学習開始 (プライマリ) */}
        <Button
          size="md"
          w="100%"
          bg={actionColor} // メインカラーで強調
          c="white"
          onClick={onStartReview}
        >
          {CYCLE_LIST_ITEM_TEXTS.startRecommendedButton}
        </Button>

        {/* 2. 問題を確認 / 他の問題も (セカンダリ) */}
        <Button
          size="md"
          w="100%"
          variant="outline" // アウトラインで控えめに
          color={actionColor} // 色は合わせて関連性を示す
          onClick={onCheckAndSelectProblems}
        >
          {CYCLE_LIST_ITEM_TEXTS.checkAndSelectButton}
        </Button>
      </Stack>
    </Stack>
  );
};
