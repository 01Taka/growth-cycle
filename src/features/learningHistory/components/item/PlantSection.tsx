import React from 'react';
import { Box, Stack, Text } from '@mantine/core';
import { PlantWithEffect } from '@/features/plants/components/PlantWithEffect';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { LEARNING_HISTORY_ITEM_TEXTS } from '../../constants/history-item-constants';

interface PlantSectionProps {
  plant: Plant;
  subject: Subject;
  differenceFromLastAttempt: number;
}

export const PlantSection: React.FC<PlantSectionProps> = ({
  plant,
  subject,
  differenceFromLastAttempt,
}) => {
  return (
    <Stack gap={0} h="100%" align="center">
      <Text size="xl" fw={700} style={{ zIndex: 100, position: 'absolute' }}>
        {LEARNING_HISTORY_ITEM_TEXTS.daysAgo(differenceFromLastAttempt)}
      </Text>
      <Box mt={20}>
        <PlantWithEffect
          plant={plant}
          subject={subject}
          auraEffect={{
            blurRadius: 18,
            opacity: 0.5,
          }}
        />
      </Box>
    </Stack>
  );
};
