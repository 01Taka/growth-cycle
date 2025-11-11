// RangeValueInputArea.tsx

import React from 'react';
import { Button, Collapse, Divider, Flex, Stack, Text, TextInput, Title } from '@mantine/core';
import { sharedStyle } from '@/shared/styles/shared-styles';
import { TEXT_CONTENT } from '../../../shared/range/range-form-config';
import { ColorSet } from '../../../shared/range/range-form-types';

// Props型定義
interface RangeValueInputAreaProps {
  isCollapsed: boolean;
  valueMin: number;
  valueMax: number;
  rangeStart: number | '';
  setRangeStart: (value: number | '') => void;
  rangeEnd: number | '';
  setRangeEnd: (value: number | '') => void;
  individualValue: string;
  setIndividualValue: (value: string) => void;
  onAddRangeValue: () => void;
  handleAddIndividualValue: () => void;
  clamp: (value: number | string, min?: number, max?: number) => number | '';
  colors: ColorSet; // useRangeFormColorsの戻り値の型に置き換えてください
}

export const RangeValueInputArea: React.FC<RangeValueInputAreaProps> = ({
  isCollapsed,
  valueMin,
  valueMax,
  rangeStart,
  setRangeStart,
  rangeEnd,
  setRangeEnd,
  individualValue,
  setIndividualValue,
  onAddRangeValue,
  handleAddIndividualValue,
  clamp,
  colors,
}) => {
  const isDisabledRangeButton = rangeStart === '' || rangeEnd === '' || rangeStart > rangeEnd;
  const isDisabledIndividualButton = individualValue.trim() === '';

  return (
    <Collapse in={!isCollapsed}>
      <Stack gap="lg" w="100%">
        <Divider />
        {/* 3. 範囲条件の追加 */}
        <Stack
          gap="xs"
          p="md"
          style={{
            backgroundColor: colors.range.background,
            color: colors.range.text,
            borderRadius: 6,
          }}
        >
          <Title order={5} style={{ color: colors.range.accent }}>
            {TEXT_CONTENT.RANGE_ADD_TITLE}
          </Title>
          <Flex align="center" gap={10}>
            <Flex w={'65%'} gap="xs" align="center" wrap="wrap">
              <TextInput
                type="number"
                placeholder={TEXT_CONTENT.RANGE_START_PLACEHOLDER(valueMin)}
                value={rangeStart === '' ? '' : rangeStart.toString()}
                onChange={(e) => setRangeStart(clamp(e.target.value))}
                min={valueMin}
                max={valueMax}
                style={{ flex: 1 }}
                size="sm"
              />
              <Text style={{ color: colors.range.accent }}>{TEXT_CONTENT.RANGE_SEPARATOR}</Text>
              <TextInput
                type="number"
                placeholder={TEXT_CONTENT.RANGE_END_PLACEHOLDER(valueMax)}
                value={rangeEnd === '' ? '' : rangeEnd.toString()}
                onChange={(e) => setRangeEnd(clamp(e.target.value))}
                min={valueMin}
                max={valueMax}
                style={{ flex: 1 }}
                size="sm"
              />
            </Flex>
            <Button
              w={'35%'}
              onClick={onAddRangeValue}
              disabled={isDisabledRangeButton}
              style={{
                backgroundColor: isDisabledRangeButton
                  ? colors.disabled.button
                  : colors.range.button,
                color: isDisabledRangeButton ? colors.disabled.buttonText : colors.range.buttonText,
              }}
              fullWidth
              size="sm"
            >
              {TEXT_CONTENT.RANGE_ADD_BUTTON}
            </Button>
          </Flex>
        </Stack>
        {/* 4. 個別番号の追加 */}
        <Stack
          gap="xs"
          p="md"
          style={{
            backgroundColor: colors.individual.background,
            color: colors.individual.text,
            borderRadius: 6,
          }}
        >
          <Title order={5} style={{ color: colors.individual.accent }}>
            {TEXT_CONTENT.INDIVIDUAL_ADD_TITLE}
          </Title>
          <Flex align="center" gap={10}>
            <TextInput
              w={'65%'}
              placeholder={TEXT_CONTENT.INDIVIDUAL_PLACEHOLDER}
              value={individualValue}
              onChange={(e) => setIndividualValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddIndividualValue();
                }
              }}
              size="sm"
            />
            <Button
              w={'35%'}
              onClick={handleAddIndividualValue}
              disabled={isDisabledIndividualButton}
              style={{
                backgroundColor: isDisabledIndividualButton
                  ? colors.disabled.button
                  : colors.individual.button,
                color: isDisabledIndividualButton
                  ? colors.disabled.buttonText
                  : colors.individual.buttonText,
              }}
              size="sm"
            >
              {TEXT_CONTENT.INDIVIDUAL_ADD_BUTTON}
            </Button>
          </Flex>
        </Stack>
      </Stack>
    </Collapse>
  );
};
