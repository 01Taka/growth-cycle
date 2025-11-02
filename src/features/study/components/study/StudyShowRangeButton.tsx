import React from 'react';
import { IconArrowRight } from '@tabler/icons-react';
import { Button, rem } from '@mantine/core';
import { sharedStyle } from '@/shared/styles/shared-styles';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { toRGBA } from '@/shared/utils/color/color-convert-utils';

interface StudyShowRangeButtonProps {
  theme: SubjectColorMap;
}

export const StudyShowRangeButton: React.FC<StudyShowRangeButtonProps> = ({ theme }) => {
  return (
    <Button
      size="md"
      variant="outline"
      color={theme.text}
      fw={500}
      style={{ ...sharedStyle.button, borderRadius: rem(16), width: '70%' }}
      styles={{
        root: {
          backgroundColor: toRGBA(theme.bgCard, 0.5),
          border: `2px solid ${theme.border}`,
        },
      }}
    >
      テスト範囲を表示
      <IconArrowRight />
    </Button>
  );
};
