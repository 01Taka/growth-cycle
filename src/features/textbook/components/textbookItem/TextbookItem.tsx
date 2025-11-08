import React from 'react';
import { Stack } from '@mantine/core';
import { TextbookItemProps } from '../shared-props-types';
import { TextbookContents } from './TextbookContents';
import TextbookPlants from './TextbookPlants';

export const TextbookItem: React.FC<
  TextbookItemProps & {
    widthPer: number;
    sizeRatio: number;
    displayPlant: boolean;
    onClick: () => void;
  }
> = ({
  subject,
  textbookName,
  totalPlants,
  daysSinceLastAttempt,
  plants,
  maxSize,
  widthPer,
  sizeRatio,
  displayPlant,
  onClick,
}) => {
  return (
    <Stack gap={-1}>
      <TextbookPlants
        subject={subject}
        plants={plants}
        maxSize={maxSize}
        widthPer={widthPer}
        displayPlant={displayPlant}
        sizeRatio={sizeRatio}
      />

      <TextbookContents
        subject={subject}
        textbookName={textbookName}
        totalPlants={totalPlants}
        daysSinceLastAttempt={daysSinceLastAttempt}
        onClick={onClick}
      />
    </Stack>
  );
};
