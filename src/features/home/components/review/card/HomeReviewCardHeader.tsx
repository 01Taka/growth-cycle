// HomeReviewCardHeader.tsx
import React from 'react';
import { CardSection, Flex, Pill, Stack, Text } from '@mantine/core';
import { COLORS, REVIEW_LABELS } from '@/features/home/constants/review-constants';

interface HomeReviewCardHeaderProps {
  remainingTasks: number;
  progressString: string;
}

export const HomeReviewCardHeader: React.FC<HomeReviewCardHeaderProps> = ({
  remainingTasks,
  progressString,
}) => (
  <CardSection p="md">
    <Stack gap="xs">
      <Text fw={700} size="xl" c={COLORS.textDark}>
        {REVIEW_LABELS.headerTitle}
      </Text>
      <Flex justify="space-between" align="center">
        <Text fw={600} size="md" c={COLORS.textDark}>
          {REVIEW_LABELS.remainingTasksLabel}
          <Text span c={COLORS.orangeButton} size="xl" fw={700} ml={5}>
            {remainingTasks}
          </Text>
        </Text>
        <Pill size="md" radius="xl" variant="filled" bg={COLORS.pillBg} color={COLORS.textDark}>
          {progressString}
        </Pill>
      </Flex>
    </Stack>
  </CardSection>
);
