import React from 'react';
import { Group, rem, Text } from '@mantine/core';

interface SelectionCheckboxProps {
  isSelected: boolean;
  problemIndex: number;
}

export const SelectionCheckbox: React.FC<SelectionCheckboxProps> = ({
  isSelected,
  problemIndex,
}) => {
  const selectedColor = 'blue';

  return (
    <Group
      align="center"
      justify="center"
      w={isSelected ? rem(45) : rem(30)}
      h={isSelected ? rem(45) : rem(30)}
      ta="center"
      style={{
        borderRadius: rem(6),
        backgroundColor: isSelected ? `var(--mantine-color-${selectedColor}-6)` : 'white',
        border: isSelected ? 'none' : `2px solid var(--mantine-color-gray-4)`,
        transition: 'all 0.15s ease-in-out',
      }}
      display="flex"
    >
      {isSelected && (
        <Text fw={700} size="lg" c="white">
          {problemIndex + 1}
        </Text>
      )}
    </Group>
  );
};
