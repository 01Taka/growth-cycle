import React from 'react';
import { Button, rem, Stack, Text } from '@mantine/core';
import { sharedStyle } from '@/shared/styles/shared-styles';

export interface StudyTimeSelectButtonProps {
  label: string;
  timeMin: number;
  explanations: string[];
  theme: {
    text: string;
    textSub: string;
    bg: string;
    border: string;
  };
  disabled: boolean;
  onClick: () => void;
}

export const StudyTimeSelectButton: React.FC<StudyTimeSelectButtonProps> = ({
  label,
  timeMin,
  explanations,
  theme,
  disabled,
  onClick,
}) => {
  return (
    <Button
      w={'100%'}
      h={80}
      styles={{
        label: {
          width: '100%',
          padding: '0 20px',
          justifyContent: 'space-between',
        },
      }}
      style={{
        ...(disabled ? sharedStyle.disabledButton : sharedStyle.button),
        backgroundColor: theme.bg,
        border: `2px solid ${theme.border}`,
      }}
      onClick={onClick}
    >
      <Stack gap={0} justify="start">
        <Text style={{ fontSize: rem(21), fontWeight: 'bold', color: theme.text }}>{label}</Text>
        <Text size="lg" style={{ color: theme.text, width: 'fit-content' }}>
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
    </Button>
  );
};
