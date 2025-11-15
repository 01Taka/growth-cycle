import React from 'react';
import { Flex, Pill, Stack, Text } from '@mantine/core';

interface TextbookInfoProps {
  textbookName: string;
  unitNames: string[];
  textColor: string;
  chipBgColor: string;
  borderColor: string;
}

export const TextbookInfo: React.FC<TextbookInfoProps> = ({
  textbookName,
  unitNames,
  textColor,
  chipBgColor,
  borderColor,
}) => {
  return (
    <Stack flex={1} gap={4} justify="space-around" h="100%" miw={0} mt={10}>
      <Text
        size="md"
        fw={600}
        c={textColor}
        style={{
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {textbookName}
      </Text>
      <Flex
        gap={4}
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {unitNames.map((unit, index) => (
          <Pill
            key={index}
            size="sm"
            styles={{
              label: { color: textColor, padding: '0 8px', fontWeight: 700 },
              root: {
                backgroundColor: chipBgColor,
                height: 20,
                border: `1px solid ${borderColor}`,
              },
            }}
          >
            {unit}
          </Pill>
        ))}
      </Flex>
    </Stack>
  );
};
