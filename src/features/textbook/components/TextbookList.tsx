import React from 'react';
import { Stack } from '@mantine/core';
import { TextbookDocument } from '@/shared/data/documents/textbook/textbook-document';
import { getDaysDifference } from '@/shared/utils/datetime/datetime-compare-utils';
import { TextbookItem } from './textbookItem/TextbookItem';

interface TextbookListProps {
  textbookItems: TextbookDocument[];
  transformScale: number;
  plantSizeRatio: number;
  displayPlant?: boolean;
  onClick: (item: TextbookDocument) => void;
}

export const TextbookList: React.FC<TextbookListProps> = ({
  textbookItems,
  displayPlant = true,
  transformScale,
  plantSizeRatio,
  onClick,
}) => {
  return (
    <Stack style={{ maxWidth: '90%', margin: '0 auto' }}>
      {textbookItems.map((item, index) => (
        <TextbookItem
          key={index}
          widthPer={90}
          transformScale={transformScale}
          plantSizeRatio={plantSizeRatio}
          displayPlant={displayPlant}
          onClick={() => onClick(item)}
          textbookName={item.name}
          daysSinceLastAttempt={
            item.lastAttemptedAt ? getDaysDifference(item.lastAttemptedAt) : null
          }
          maxSize={50}
          {...item}
        />
      ))}
    </Stack>
  );
};
