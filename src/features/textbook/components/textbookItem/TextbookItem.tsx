import React, { lazy } from 'react';
import { Box, Stack } from '@mantine/core';
import { TextbookItemProps } from '../shared-props-types';
import { TextbookContents } from './TextbookContents';
import TextbookPlants from './TextbookPlants';

export const TextbookItem: React.FC<
  TextbookItemProps & { widthPer: number; displayPlant: boolean }
> = ({
  subject,
  textbookName,
  totalPlants,
  daysSinceLastAttempt,
  plants,
  maxSize,
  widthPer,
  displayPlant,
}) => {
  return (
    <Stack gap={-1}>
      <TextbookPlants
        subject={subject}
        plants={plants}
        maxSize={maxSize}
        widthPer={widthPer}
        displayPlant={displayPlant}
      />

      <TextbookContents
        subject={subject}
        textbookName={textbookName}
        totalPlants={totalPlants}
        daysSinceLastAttempt={daysSinceLastAttempt}
      />
    </Stack>
  );
};
