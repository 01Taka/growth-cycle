import React from 'react';
import { Stack } from '@mantine/core';
import { TextbookItemProps } from './shared-props-types';
import { TextbookItem } from './textbookItem/TextbookItem';

interface TextbookListProps {
  textbookItems: TextbookItemProps[];
  displayPlant: boolean;
}

export const TextbookList: React.FC<TextbookListProps> = ({ textbookItems, displayPlant }) => {
  return (
    <Stack style={{ maxWidth: '90%', margin: '0 auto' }}>
      {textbookItems.map((item, index) => (
        <TextbookItem key={index} widthPer={90} displayPlant={displayPlant} {...item} />
      ))}
    </Stack>
  );
};
