import React from 'react';
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react';
import { Box, Button, Chip, Flex, Stack, Text, Title } from '@mantine/core';
import { TEXT_CONTENT } from '../../../shared/range/range-form-config';
import { ColorSet, RangeWithId } from '../../../shared/range/range-form-types';

// Props型定義
interface RangeSummaryAndConflictProps {
  ranges: RangeWithId[];
  hasConflict: boolean;
  isCollapsed: boolean;
  onRemoveRange: (range: RangeWithId) => void;
  onResolveConflict: () => void;
  colors: ColorSet; // useRangeFormColorsの戻り値の型に置き換えてください
}

export const RangeSummaryAndConflict: React.FC<RangeSummaryAndConflictProps> = ({
  ranges,
  hasConflict,
  isCollapsed,
  onRemoveRange,
  onResolveConflict,
  colors,
}) => {
  const handleRemoveRange = (range: RangeWithId) => {
    if (!isCollapsed) {
      onRemoveRange(range);
    }
  };

  return (
    <Stack gap="xs">
      <Title order={5}>{TEXT_CONTENT.RANGE_SUMMARY_TITLE}</Title>
      {/* 条件チップリスト */}
      <Flex gap="xs" wrap="wrap" maw="100%">
        {ranges.length === 0 ? (
          <Text c="dimmed" size="sm">
            {TEXT_CONTENT.RANGE_EMPTY_MESSAGE}
          </Text>
        ) : (
          ranges.map((range) => (
            <Chip
              key={range.id}
              onClick={() => handleRemoveRange(range)}
              disabled={isCollapsed}
              styles={{
                label: {
                  backgroundColor: range.end
                    ? colors.range.background
                    : colors.individual.background,
                  color: range.end ? colors.range.text : colors.individual.text,
                  borderRadius: 16,
                  width: range.end ? (isCollapsed ? 80 : 110) : isCollapsed ? 60 : 80,
                  justifyContent: 'center',
                },
              }}
              variant="filled"
              radius="xl"
            >
              <Flex align="center" justify="space-between" gap={5}>
                {isCollapsed ? (
                  <Box w={5} />
                ) : (
                  <IconTrash
                    size={24}
                    style={{
                      color: range.end ? colors.range.accent : colors.individual.accent,
                    }}
                  />
                )}
                <Text>
                  {range.end
                    ? `${range.start}${TEXT_CONTENT.RANGE_SEPARATOR}${range.end}`
                    : `${range.start}`}
                </Text>
                <Box w={5} />
              </Flex>
            </Chip>
          ))
        )}
      </Flex>

      {/* 競合解決エリア */}
      {hasConflict && !isCollapsed && (
        <Stack
          p="sm"
          mt="md"
          bg={colors.conflict.background}
          style={{ border: `1px solid ${colors.conflict.border}` }}
          gap="sm"
        >
          <Flex align="center" gap="sm">
            <IconAlertTriangle size={24} style={{ color: colors.conflict.accent }} />
            <Text size="sm" fw={600} style={{ color: colors.conflict.accent }}>
              {TEXT_CONTENT.CONFLICT_ALERT_MESSAGE}
            </Text>
          </Flex>
          <Button
            onClick={onResolveConflict}
            style={{ backgroundColor: colors.conflict.button }}
            fullWidth
          >
            {TEXT_CONTENT.CONFLICT_RESOLVE_BUTTON}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};
