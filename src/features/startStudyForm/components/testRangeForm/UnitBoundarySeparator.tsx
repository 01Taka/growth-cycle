import React from 'react';
import { Text, useMantineTheme } from '@mantine/core';

interface UnitBoundarySeparatorProps {
  unit: string;
  isFirst: boolean;
}

export const UnitBoundarySeparator: React.FC<UnitBoundarySeparatorProps> = ({ unit, isFirst }) => {
  const theme = useMantineTheme();

  return (
    <Text
      size="sm"
      fw={700}
      c="indigo"
      style={{
        // 最初の要素以外は上にマージンを設けて区切りを強調
        marginTop: isFirst ? 0 : 10,
        paddingLeft: 4,
        // 左側に縦線を入れて視覚的な区切りを強調
        borderLeft: `3px solid ${theme.colors.indigo[6]}`,
      }}
    >
      UNIT: {unit}
    </Text>
  );
};
