import React from 'react';
import { IconArrowRight } from '@tabler/icons-react';
import { Button, Stack } from '@mantine/core';
import { sharedStyle } from '@/shared/styles/shared-styles';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { toRGBA } from '@/shared/utils/color/color-convert-utils';

interface StudyActionButtonsProps {
  theme: SubjectColorMap;
  isReadyTest: boolean;
}

export const StudyActionButtons: React.FC<StudyActionButtonsProps> = ({ theme, isReadyTest }) => {
  return (
    <Stack w={'100%'} align="center">
      {isReadyTest && (
        <Button
          size="xl"
          style={{
            ...sharedStyle.button,
            color: theme.text,
            backgroundColor: theme.bgCard,
            border: `2px solid ${theme.border}`,
            width: '70%',
          }}
        >
          テストを始める
        </Button>
      )}

      <Button
        size="md"
        variant={isReadyTest ? 'transparent' : 'outline'}
        color={theme.text}
        fw={500}
        style={{
          ...sharedStyle.button,
          boxShadow: isReadyTest ? undefined : sharedStyle.button.boxShadow,
          width: '70%',
        }}
        styles={{
          root: {
            backgroundColor: isReadyTest ? undefined : toRGBA(theme.bgCard, 0.5),
            border: isReadyTest ? undefined : `2px solid ${theme.border}`,
          },
        }}
      >
        テスト範囲を表示
        <IconArrowRight />
      </Button>
    </Stack>
  );
};
