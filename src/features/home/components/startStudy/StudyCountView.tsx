import React from 'react';
import { Flex, rem, Text } from '@mantine/core';
import { Subject } from '@/shared/types/study-shared-types';
import { StudyPlant } from './StudyPlant';

interface StudyCountViewProps {
  learnings: { subject: Subject }[];
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
          <StudyPlant
            key={index}
            subject={learnings[index]?.subject ?? null}
            type="bud"
            index={0}
          />
        ))}
      </Flex>
    </Flex>
  );
};
