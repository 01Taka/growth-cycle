import React from 'react';
import { Stack, Text } from '@mantine/core';
import { Theme } from '../../shared/theme';

interface TestModeSelectButtonProps {
  label: string;
  explanations: string[];
  theme: Theme;
}

export const TestModeSelectButton: React.FC<TestModeSelectButtonProps> = ({
  label,
  explanations,
  theme,
}) => {
  return (
    <Stack
      align="center"
      justify="center"
      w={'50%'}
      style={{
        backgroundColor: theme.bg,
        border: `2px solid ${theme.border}`,
        borderRadius: 12,
        '&:hover': {
          backgroundColor: 'red', // ホバー時に色を変える
          transform: 'scale(1.05)', // 例: 拡大
        },
      }}
    >
      <Text style={{ color: theme.text }}>{label}</Text>
      <Stack>
        {explanations.map((explanation) => (
          <Text style={{ color: theme.textSub }}>・{explanation}</Text>
        ))}
      </Stack>
    </Stack>
  );
};
