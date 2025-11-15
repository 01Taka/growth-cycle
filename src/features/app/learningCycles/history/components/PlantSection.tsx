import React from 'react';
import { Box, MantineStyleProp, Stack, Text } from '@mantine/core';
import { PlantWithEffect } from '@/features/plants/components/PlantWithEffect';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';

interface PlantSectionProps {
  label: string;
  plant: Plant;
  subject: Subject;
  labelStyle?: MantineStyleProp;
}

export const PlantSection: React.FC<PlantSectionProps> = ({
  label,
  plant,
  subject,
  labelStyle,
}) => {
  return (
    <Stack gap={0} h="100%" align="center">
      <Text size="xl" fw={700} style={{ zIndex: 100, position: 'absolute', ...labelStyle }}>
        {label}
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
