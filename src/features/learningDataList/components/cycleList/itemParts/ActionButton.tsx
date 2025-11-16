import React from 'react';
import { IconRun } from '@tabler/icons-react';
import { ActionIcon, Flex, rem, Stack, Text } from '@mantine/core';
import { CYCLE_LIST_ITEM_TEXTS } from '../../constants/history-item-constants';

interface ActionButtonProps {
  openedDetail: boolean;
  actionColor: string;
  bgColor: string;
  testTargetProblemCount: number;
  estimatedTestTimeMin: number;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  openedDetail,
  actionColor,
  bgColor,
  testTargetProblemCount,
  estimatedTestTimeMin,
}) => {
  return (
    <Stack align="end" gap={4} w={80} style={{ flexShrink: 0 }}>
      <ActionIcon
        bg={openedDetail ? actionColor : bgColor}
        c={openedDetail ? bgColor : 'gray'}
        size={rem(40)}
        radius="xl"
        aria-label={CYCLE_LIST_ITEM_TEXTS.actionIconAriaLabel}
        style={{
          border: `3px solid ${actionColor}`,
        }}
      >
        <IconRun size={26} />
      </ActionIcon>
      <Flex justify="end" gap={1}>
        <Text>
          {CYCLE_LIST_ITEM_TEXTS.testTimeLabel(testTargetProblemCount, estimatedTestTimeMin).count}
        </Text>
        <Text>{CYCLE_LIST_ITEM_TEXTS.timeSeparator}</Text>
        <Text>
          {CYCLE_LIST_ITEM_TEXTS.testTimeLabel(testTargetProblemCount, estimatedTestTimeMin).time}
        </Text>
      </Flex>
    </Stack>
  );
};
