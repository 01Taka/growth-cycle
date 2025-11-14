import React from 'react';
import { Button, Flex, Stack, Text } from '@mantine/core';
import { LEARNING_HISTORY_ITEM_TEXTS } from '../../constants/history-item-constants';

interface DetailSectionProps {
  testTargetProblemCount: number;
  estimatedTestTimeMin: number;
  actionColor: string;
  onStartReview: () => void;
}

export const DetailSection: React.FC<DetailSectionProps> = ({
  testTargetProblemCount,
  estimatedTestTimeMin,
  actionColor,
  onStartReview,
}) => {
  return (
    <Flex
      mt="md"
      p="md"
      bg="#F8F8F8"
      style={{
        borderRadius: '8px',
      }}
      align="center"
      justify="space-between"
    >
      <Stack gap={3}>
        <Text size="md" fw={700} c="#333">
          {LEARNING_HISTORY_ITEM_TEXTS.problemCountLabel}
          <Text span fw={700} c={actionColor}>
            {testTargetProblemCount}
          </Text>
          {LEARNING_HISTORY_ITEM_TEXTS.problemCountUnit}
        </Text>
        <Text size="md" fw={700} c="#333">
          {LEARNING_HISTORY_ITEM_TEXTS.estimatedTimeLabel}
          <Text span fw={700} c="#555">
            {estimatedTestTimeMin}
          </Text>
          {LEARNING_HISTORY_ITEM_TEXTS.estimatedTimeUnit}
        </Text>
      </Stack>

      <Button
        size="md"
        w="45%"
        bg={actionColor}
        c="white"
        style={{ transition: 'background-color 0.2s' }}
        onClick={onStartReview}
      >
        {LEARNING_HISTORY_ITEM_TEXTS.startReviewButton}
      </Button>
    </Flex>
  );
};
