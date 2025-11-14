import React from 'react';
import { Stack, Text } from '@mantine/core';
import { PlantWithEffect } from '@/features/plants/components/PlantWithEffect';
import { ReviewedCycleItemProps } from '@/shared/types/subject-types';

export const ReviewedCycleItem: React.FC<ReviewedCycleItemProps> = ({
  plant,
  subject,
  textbookName,
}) => {
  return (
    <Stack>
      <PlantWithEffect plant={plant} subject={subject} />
      <Text>{textbookName}</Text>
    </Stack>
  );
};
