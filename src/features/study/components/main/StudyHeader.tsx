import React from 'react';
import { Flex, Pill, rem, Stack, Text } from '@mantine/core';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/subject-types';

interface StudyHeaderProps {
  subject: Subject;
  textbookName: string;
  units: string[];
}

export const StudyHeader: React.FC<StudyHeaderProps> = ({ subject, textbookName, units }) => {
  const theme = useSubjectColorMap(subject);

  return (
    <Stack align="center">
      <Text size={rem(20)} style={{ color: theme.accent }} fw={500}>
        {subject.toLocaleUpperCase()}
      </Text>
      <Text size={rem(25)} fw={700} style={{ color: theme.text }}>
        {textbookName}
      </Text>
      <Flex gap={8}>
        {units.map((unit, index) => (
          <Pill
            key={index}
            size="lg"
            styles={{ label: { color: theme.text }, root: { background: theme.bgChip } }}
          >
            {unit}
          </Pill>
        ))}
      </Flex>
    </Stack>
  );
};
