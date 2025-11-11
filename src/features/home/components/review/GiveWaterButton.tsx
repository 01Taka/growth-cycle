import React from 'react';
import { IoIosWater, IoMdCheckmark } from 'react-icons/io';
import { ActionIcon, Stack, Text } from '@mantine/core';

interface GiveWaterButtonProps {
  label: string;
  labelColor: string;
  isCompleted: boolean;
  color: string;
  bgColor: string;
  borderColor?: string;
  onClick: () => void;
}

export const GiveWaterButton: React.FC<GiveWaterButtonProps> = ({
  label,
  labelColor,
  isCompleted,
  color,
  bgColor,
  borderColor,
  onClick,
}) => {
  return (
    <Stack gap={0} align="center" justify="center" onClick={onClick}>
      <Text size="sm" style={{ color: labelColor }}>
        {label}
      </Text>
      <ActionIcon
        bg={bgColor}
        style={{ border: borderColor ? `2px solid ${borderColor}` : undefined }}
        variant="filled"
        size="xl"
        radius="xl"
        aria-label="復習開始"
      >
        {isCompleted ? (
          <IoMdCheckmark color={color} size={30} fontWeight="bold" />
        ) : (
          <IoIosWater color={color} size={24} />
        )}
      </ActionIcon>
    </Stack>
  );
};
