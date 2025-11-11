import React from 'react';
import { Stack } from '@mantine/core';
import { PlantImageItem } from '@/features/plants/components/PlantImageItem';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { DirtMound } from './DirtMound';

interface StudyPhasePlantDisplayProps {
  subject: Subject;
  plant: Plant;
}

export const StudyPhasePlantDisplay: React.FC<StudyPhasePlantDisplayProps> = ({
  subject,
  plant,
}) => {
  return (
    <Stack align="center" justify="end" gap={0} style={{ position: 'relative', marginTop: 50 }}>
      <PlantImageItem subject={subject} plant={plant} />
      <DirtMound style={{ position: 'absolute', bottom: -20 }} />
    </Stack>
  );
};
