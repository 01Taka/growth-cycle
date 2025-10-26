import React from 'react';
import { MantineSize, Pill } from '@mantine/core';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/study-shared-types';

interface UnitPillProps {
  subject: Subject;
  unitName: string;
  size?: MantineSize;
  borderThickness?: number;
}

export const UnitPill: React.FC<UnitPillProps> = ({
  subject,
  unitName,
  size = 'md',
  borderThickness = 2,
}) => {
  const theme = useSubjectColorMap(subject);
  return (
    <Pill
      color={theme.text}
      bg={theme.bgChip}
      size={size}
      style={{ border: `${borderThickness}px solid ${theme.border}` }}
    >
      {unitName}
    </Pill>
  );
};
