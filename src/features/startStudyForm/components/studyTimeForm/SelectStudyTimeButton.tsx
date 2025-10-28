import React from 'react';
import { Card, Flex, rem, Stack, Text } from '@mantine/core';
import { SelectStudyTimeButtonProps } from '../../shared/shared-props-types';

export const SelectStudyTimeButton: React.FC<SelectStudyTimeButtonProps> = ({
  label,
  timeMin,
  explanations,
  theme,
}) => {
  return (
    <Card
      shadow="md"
      style={{
        backgroundColor: theme.bg,
        border: `2px solid ${theme.border}`,
        borderRadius: 16,
      }}
      p={7}
    >
      <Flex justify="space-between" p="0 20px">
        <Stack gap={0}>
          <Text style={{ fontSize: rem(21), fontWeight: 'bold', color: theme.text }}>{label}</Text>
          <Text size="lg" style={{ color: theme.text }}>
            {timeMin}分
          </Text>
        </Stack>
        <Stack gap={0}>
          {explanations.map((explanation, index) => (
            <Text key={index} size="lg" style={{ color: theme.textSub }}>
              ・{explanation}
            </Text>
          ))}
        </Stack>
      </Flex>
    </Card>
  );
};
