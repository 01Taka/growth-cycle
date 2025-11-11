import React from 'react';
import { Stack } from '@mantine/core';
import { TextbookItemProps } from '../shared-props-types';
import { TextbookContents } from './TextbookContents';
import TextbookPlants from './TextbookPlants';

export const TextbookItem: React.FC<
  TextbookItemProps & {
    widthPer: number;
    transformScale: number;
    plantSizeRatio: number;
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
  transformScale,
  plantSizeRatio,
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
        transformScale={transformScale}
        plantSizeRatio={plantSizeRatio}
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
