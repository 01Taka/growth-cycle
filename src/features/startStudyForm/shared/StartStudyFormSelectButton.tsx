import React from 'react';
import { Button, MantineStyleProp, Stack, Text } from '@mantine/core';
import { sharedStyle } from '@/shared/styles/shared-styles';
import { Theme } from './components-constants/study-form-colors';

interface StartStudyFormSelectButtonProps {
  label: string;
  explanations: string[];
  theme: Theme;
  style?: MantineStyleProp;
  disabled?: boolean;
  onClick: () => void;
}

export const StartStudyFormSelectButton: React.FC<StartStudyFormSelectButtonProps> = ({
  label,
  explanations,
  theme,
  style,
  disabled = false,
  onClick,
}) => {
  return (
    <Button
      style={{
        ...(disabled ? sharedStyle.disabledButton : sharedStyle.button),
        backgroundColor: theme.bg,
        border: `2px solid ${theme.border}`,
        width: '50%',
        height: '100%',
        ...style,
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
