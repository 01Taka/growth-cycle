import React from 'react';
import { Chip, MantineSize } from '@mantine/core';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/subject-types';

interface FilterChipProps {
  subject: Subject | 'unselected';
  label: string;
  checked: boolean;
  size: MantineSize;
  onClick: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  subject,
  label,
  checked,
  size,
  onClick,
}) => {
  const theme = useSubjectColorMap(subject);

  return (
    <Chip
      size={size}
      checked={checked}
      onClick={onClick}
      variant="filled"
      style={{ padding: '0 1px' }}
      styles={() => ({
        label: {
          // デフォルト（非チェック時）のスタイル
          backgroundColor: checked ? theme.accent : theme.bgCard,
          border: theme.border,
          color: checked ? 'white' : theme.text,
          fontWeight: checked ? 'bold' : 'normal',
        },
      })}
    >
      {label}
    </Chip>
  );
};
