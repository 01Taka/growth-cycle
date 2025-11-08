import React from 'react';
import { Stack } from '@mantine/core';
import { TextbookItemProps } from './shared-props-types';
import { TextbookItem } from './textbookItem/TextbookItem';

interface TextbookListProps {
  textbookItems: TextbookItemProps[];
  sizeRatio: number;
  displayPlant?: boolean;
  onClick: (item: TextbookItemProps) => void;
}

export const TextbookList: React.FC<TextbookListProps> = ({
  textbookItems,
  displayPlant = true,
  sizeRatio,
  onClick,
}) => {
  return (
    <Stack style={{ maxWidth: '90%', margin: '0 auto' }}>
      {textbookItems.map((item, index) => (
        <TextbookItem
          key={index}
          widthPer={90}
          sizeRatio={sizeRatio}
          displayPlant={displayPlant}
          onClick={() => onClick(item)}
          {...item}
        />
      ))}
    </Stack>
  );
};
