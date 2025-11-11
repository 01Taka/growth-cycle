import React from 'react';
import { Flex, rem, Text } from '@mantine/core';
import { Plant } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { StudyPlant } from './StudyPlant';

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
        {[...Array(maxLearningNum).keys()].map((index) => (
          <StudyPlant key={index} learning={learnings[index] ?? null} />
        ))}
      </Flex>
    </Flex>
  );
};
