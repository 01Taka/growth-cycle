import React from 'react';
import { IconClock, IconRefresh } from '@tabler/icons-react';
import { Badge, Flex, MantineColor, Progress, rem, Stack, Text } from '@mantine/core';
import { PROBLEM_LIST_TEXTS } from '@/features/learningHistory/constants/problem-list-constants';
import { ProblemListItemData } from '@/features/learningHistory/types/problem-list-types';

interface ActionInfoProps {
  problem: ProblemListItemData;
}

/**
 * SM2の品質評価に基づいて、バッジの色とアイコンを決定
 */
const getUrgencyPillProps = (
  lastAttemptSM2Quality: number
): { color: MantineColor; icon: React.ReactNode; text: string } => {
  const isNeedReview = lastAttemptSM2Quality < 3;
  if (isNeedReview) {
    return {
      color: 'red',
      icon: <IconRefresh size={14} />,
      text: PROBLEM_LIST_TEXTS.alertNeedReview,
    };
  }
  return {
    color: 'green',
    icon: <IconClock size={14} />,
    text: PROBLEM_LIST_TEXTS.alertDueSoon,
  };
};

/**
 * 正解率に基づいて進捗バーの色を決定
 */
const getCorrectnessColor = (rate: number): MantineColor => {
  if (rate < 0.5) return 'red';
  if (rate < 0.8) return 'yellow';
  return 'green';
};

/**
 * 残り日数に基づいてテキストの色を決定
 */
const getDaysDifferenceTextColor = (
  daysDifference: number,
  lastAttemptSM2Quality: number
): MantineColor => {
  const isNeedReview = lastAttemptSM2Quality < 3;

  if (daysDifference < 0) {
    return 'red';
  }

  if (isNeedReview) {
    return 'red';
  }

  return 'gray.6';
};

export const ActionInfo: React.FC<ActionInfoProps> = ({ problem }) => {
  const { correctnessRate, differenceFromNextAttempt, lastAttemptSM2Quality } = problem;

  const urgencyProps = getUrgencyPillProps(lastAttemptSM2Quality);
  const ratePercent = Math.round(correctnessRate * 100);
  const daysDifference = Math.floor(differenceFromNextAttempt / (24 * 60 * 60 * 100));
  const daysColor = getDaysDifferenceTextColor(daysDifference, lastAttemptSM2Quality);

  return (
    <Stack gap={5} align="flex-end" w={rem(100)}>
      {/* 緊急度Pill */}
      <Badge
        color={urgencyProps.color}
        size="md"
        variant="filled"
        radius="xl"
        leftSection={urgencyProps.icon}
        w="fit-content"
        style={{ minWidth: rem(55) }}
      >
        {urgencyProps.text}
      </Badge>

      {/* 残り日数表示 */}
      <Flex align="end" gap={1}>
        <Text size="xs" fw={700} c={daysColor}>
          {PROBLEM_LIST_TEXTS.daysDifferenceLabel}
        </Text>
        <Text size="md" fw={700} c={daysColor}>
          {Math.abs(daysDifference)}
          {PROBLEM_LIST_TEXTS.daysUnit}
        </Text>
        <Text size="xs" fw={700} c={daysColor}>
          {PROBLEM_LIST_TEXTS.getDaysDifferenceUnit(daysDifference)}
        </Text>
      </Flex>

      {/* 正解率 */}
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
  );
};
