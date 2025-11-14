// HomeReviewCardHeader.tsx
import React from 'react';
import { CardSection, Flex, Pill, Stack, Text } from '@mantine/core';
import { COLORS, STRINGS } from '@/features/home/constants/review-constants';

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
);
