import React from 'react';
import { Flex, rem, Text } from '@mantine/core';
import { PlantWithEffect } from '@/features/plants/components/PlantWithEffect';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';

interface StudyCountViewProps {
  learnings: { subject: Subject; plant: Plant }[];
  maxLearningNum: number;
}

export const StudyCountView: React.FC<StudyCountViewProps> = ({ learnings, maxLearningNum }) => {
  return (
    <Flex gap={30}>
      <Text fw={700} fz={rem(36)} style={{ color: 'white' }}>
        {learnings.length}/{maxLearningNum}
      </Text>
      <Flex gap={10}>
        {[...Array(maxLearningNum).keys()].map((index) => {
          const data = learnings[index];

          if (!data) return <PlantWithEffect key={index} subject={'unselected'} plant={null} />;
          return (
            <PlantWithEffect
              key={data.plant.id}
              subject={data.subject}
              plant={data.plant}
              auraEffect={{ opacity: data.subject === 'math' ? 1 : 0.5, blurRadius: 50 }}
            />
          );
        })}
      </Flex>
    </Flex>
  );
};
