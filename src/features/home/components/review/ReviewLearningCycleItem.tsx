import React from 'react';
import { Card, Group, Stack, Text } from '@mantine/core';
import { PlantImageItem } from '@/features/plants/components/PlantImageItem';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/study-shared-types';
import { UnitPill } from './UnitPill';

interface ReviewLearningCycleItemProps {
  plantIndex: number;
  subject: Subject;
  unitNames: string[];
  testDurationMin: number;
}

export const ReviewLearningCycleItem: React.FC<ReviewLearningCycleItemProps> = ({
  plantIndex,
  subject,
  unitNames,
  testDurationMin,
}) => {
  // const random = getDeterministicRandom(learningCycle.textbookId, 0);
  // const maxIndex = 16;
  // const plantIndex = Math.floor(random * (maxIndex + 1));

  const subjectTheme = useSubjectColorMap(subject);

  return (
    <Card bg={subjectTheme.bgCard}>
      <Group>
        <PlantImageItem subject={subject} index={plantIndex} width={45} height={64} />
        <Stack>
          <Group>
            {unitNames.map((unitName) => (
              <UnitPill subject={subject} unitName={unitName} size="lg" />
            ))}
          </Group>
          <Text>目標: {testDurationMin}分</Text>
        </Stack>
      </Group>
    </Card>
  );
};
