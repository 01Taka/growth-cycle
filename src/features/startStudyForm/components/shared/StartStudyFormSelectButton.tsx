import React from 'react';
import { Button, Stack, Text } from '@mantine/core';
import { sharedStyle } from '@/shared/styles/shared-styles';
import { Theme } from '../../shared/theme';

interface StartStudyFormSelectButtonProps {
  label: string;
  explanations: string[];
  theme: Theme;
  disabled?: boolean;
  onClick: () => void;
}

export const StartStudyFormSelectButton: React.FC<StartStudyFormSelectButtonProps> = ({
  label,
  explanations,
  theme,
  disabled = false,
  onClick,
}) => {
  return (
    <Button
      w={'50%'}
      h={'100%'}
      style={{
        ...(disabled ? sharedStyle.disabledButton : sharedStyle.button),
        backgroundColor: theme.bg,
        border: `2px solid ${theme.border}`,
      }}
      onClick={onClick}
    >
      <Stack gap={5} align="center" justify="center">
        <Text size="lg" style={{ fontWeight: 'bold', color: theme.text }}>
          {label}
        </Text>
        <Stack gap={0}>
          {explanations.map((explanation, index) => (
            <Text key={index} style={{ color: theme.textSub, whiteSpace: 'break-spaces' }}>
              ・{explanation}
            </Text>
          ))}
        </Stack>
      </Stack>
    </Button>
  );
};
