import React from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Badge, Flex, Group, MantineColor, Progress, rem, Stack, Text } from '@mantine/core';
import { PROBLEM_LIST_TEXTS } from '../../learningHistory/constants/problem-list-constants';
import { ProblemListItemData } from '../../learningHistory/types/problem-list-types';

// === 型定義 (省略) ===

interface ProblemListItemProps {
  problem: ProblemListItemData;
  isSelected: boolean;
  onToggleSelect: () => void;
}

// === ヘルパー関数 (省略) ===
const getUrgencyPillColor = (isUrgent: boolean): MantineColor => (isUrgent ? 'red' : 'green');
const getCorrectnessColor = (rate: number): MantineColor => {
  if (rate < 0.5) return 'red';
  if (rate < 0.8) return 'yellow';
  return 'green';
};

export const ProblemListItem: React.FC<ProblemListItemProps> = ({
  problem,
  isSelected,
  onToggleSelect,
}) => {
  const {
    problemIndex,
    textbookName,
    unitName,
    categoryName,
    problemNumber,
    isUrgent,
    dueDateText,
    correctnessRate,
  } = problem;

  const ratePercent = Math.round(correctnessRate * 100);

  // 選択時の色設定
  const selectedColor = 'blue';

  return (
    <Flex
      p="lg"
      align="center"
      gap="lg"
      bg={isSelected ? 'blue.0' : 'white'}
      style={{
        borderBottom: `1px solid var(--mantine-color-gray-2)`,
        cursor: 'pointer',
      }}
      onClick={onToggleSelect}
    >
      {/* 1. 選択UI (カスタム選択ボックス) */}
      <Group
        align="center"
        justify="center"
        w={isSelected ? rem(45) : rem(30)} // 選択時 (45px) / 未選択時 (30px)
        h={isSelected ? rem(45) : rem(30)} // 選択時 (45px) / 未選択時 (30px)
        ta="center"
        style={{
          borderRadius: rem(6),
          // 選択状態に基づくスタイル
          backgroundColor: isSelected ? `var(--mantine-color-${selectedColor}-6)` : 'white',
          border: isSelected ? 'none' : `2px solid var(--mantine-color-gray-4)`,
          transition: 'all 0.15s ease-in-out', // 滑らかなアニメーション
        }}
        // 中央揃えのためにFlexを使用
        display="flex"
      >
        {isSelected ? (
          // 選択時: 拡大したボックス内に数字を表示
          <Text fw={700} size="lg" c="white">
            {problemIndex}
          </Text>
        ) : // 未選択時: ボーダー付きの白いボックス (内容は空)
        null}
      </Group>

      {/* 2. 問題識別情報 (垂直に3行にまとめる) */}
      <Stack gap={5} style={{ flexGrow: 1, minWidth: rem(180) }}>
        {/* === 1行目: ユニット名 (最重要) === */}
        <Text size="md" fw={700} lineClamp={1}>
          {unitName}
        </Text>

        {/* === 2行目: テキスト名 (コンテキスト) === */}
        <Badge
          variant="filled"
          size="sm"
          color="gray"
          w="fit-content"
          leftSection={
            PROBLEM_LIST_TEXTS.textbookBadge ? `${PROBLEM_LIST_TEXTS.textbookBadge}:` : undefined
          }
        >
          {textbookName}
        </Badge>

        {/* === 3行目: カテゴリーと問題番号 (詳細位置) === */}
        <Flex gap="md" align="center">
          <Text size="sm" c="dimmed">
            {categoryName}
          </Text>
          <Text size="sm" fw={700} c="dark">
            {PROBLEM_LIST_TEXTS.problemNoPrefix}
            {problemNumber}
          </Text>
        </Flex>
      </Stack>

      {/* 3. アクション情報 (右側: 期限日と正解率) */}
      <Stack gap={5} align="flex-end" w={rem(110)}>
        {/* 右上: 緊急度Pill (視覚的フラグ) */}
        <Badge
          color={getUrgencyPillColor(isUrgent)}
          size="md"
          variant="filled"
          radius="xl"
          leftSection={isUrgent ? <IconAlertTriangle size={14} /> : null}
          w="fit-content"
          style={{ minWidth: rem(55) }}
        >
          {isUrgent ? PROBLEM_LIST_TEXTS.alertUrgent : PROBLEM_LIST_TEXTS.alertDueSoon}
        </Badge>

        {/* その下: dueDateText (具体的な情報) */}
        <Text size="sm" fw={700} c={getUrgencyPillColor(isUrgent)}>
          {dueDateText}
        </Text>

        {/* 正解率 (習熟度) */}
        <Stack gap={2} w="100%" align="flex-end">
          <Text size="sm" c="dimmed">
            {PROBLEM_LIST_TEXTS.correctnessRateLabel} {ratePercent}%
          </Text>
          <Progress
            value={ratePercent}
            size="md"
            w="80%"
            color={getCorrectnessColor(correctnessRate)}
            radius="xl"
          />
        </Stack>
      </Stack>
    </Flex>
  );
};
