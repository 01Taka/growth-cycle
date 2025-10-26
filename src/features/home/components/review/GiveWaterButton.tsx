import React from 'react';
import { IoIosWater, IoMdCheckmark } from 'react-icons/io';
import { ActionIcon } from '@mantine/core';

interface GiveWaterButtonProps {
  isCompleted: boolean;
  color: string;
  bgColor: string;
  borderColor?: string;
}

export const GiveWaterButton: React.FC<GiveWaterButtonProps> = ({
  isCompleted,
  color,
  bgColor,
  borderColor,
}) => {
  return (
    <ActionIcon
      bg={bgColor}
      style={{ border: borderColor ? `2px solid ${borderColor}` : undefined }}
      variant="filled"
      size="xl"
      radius="xl"
      aria-label="水やり"
    >
      {isCompleted ? (
        <IoMdCheckmark color={color} size={30} fontWeight="bold" />
      ) : (
        <IoIosWater color={color} size={24} />
      )}
    </ActionIcon>
  );
};
