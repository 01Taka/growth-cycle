import React from 'react';
import { Box, Stack } from '@mantine/core';
import { PlantImageItem } from '@/features/plants/components/PlantImageItem';
import { ImportPlantsType } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { DirtMound } from './DirtMound';

interface StudyPhasePlantDisplayProps {
  subject: Subject;
  type: ImportPlantsType;
  imageIndex: number;
}

export const StudyPhasePlantDisplay: React.FC<StudyPhasePlantDisplayProps> = ({
  subject,
  type,
  imageIndex,
}) => {
  return (
    <Stack align="center" justify="end" gap={0} style={{ position: 'relative', marginTop: 50 }}>
      <PlantImageItem subject={subject} type={type} imageIndex={imageIndex} />
      <DirtMound style={{ position: 'absolute', bottom: -20 }} />
    </Stack>
  );
};
