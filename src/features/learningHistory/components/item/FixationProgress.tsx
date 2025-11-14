import React from 'react';
import { Box, Flex, Progress, rem, Text, Tooltip } from '@mantine/core';
import { UTIL_STYLES } from '@/shared/styles/shared-styles';
import { LEARNING_HISTORY_ITEM_TEXTS } from '../../constants/history-item-constants';
import { AggregatedSection } from '../../types/learning-history-types';

interface FixationProgressProps {
  fixation: number;
  aggregatedSections: AggregatedSection[];
}

export const FixationProgress: React.FC<FixationProgressProps> = ({
  fixation,
  aggregatedSections,
}) => {
  return (
    <Box w="100%" pos="relative">
      <Progress.Root
        size="xl"
        radius="lg"
        h={rem(20)}
        style={{ position: 'relative', overflow: 'visible' }}
      >
        <>
          {aggregatedSections.map((section, index) => (
            <Tooltip
              key={index}
              label={`${section.description} (${Math.round(section.value)}%)`}
              withArrow
            >
              <Progress.Section
                value={section.value}
                color={section.color}
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  color: '#333',
                  fontWeight: 500,
                }}
                striped={section.striped}
                animated={section.striped}
              />
            </Tooltip>
          ))}
        </>
      </Progress.Root>
      <Flex
        align="center"
        gap={5}
        style={{
          ...UTIL_STYLES.absoluteCenter,
        }}
      >
        <Text fw={600} c="#333" size="md">
          {LEARNING_HISTORY_ITEM_TEXTS.fixationLabel}
        </Text>
        <Text fw={700} c="#333" size="xl">
          {LEARNING_HISTORY_ITEM_TEXTS.percentage(fixation)}
        </Text>
      </Flex>
    </Box>
  );
};
