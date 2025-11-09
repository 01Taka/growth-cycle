import React, { useState } from 'react';
import { IconAlertTriangle, IconChevronDown, IconChevronUp, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Chip,
  Collapse, // 💡 Collapseコンポーネントをインポート
  ComboboxItem,
  Divider,
  Flex,
  Pill,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { CustomCreatableSelect } from '@/shared/components/CustomCreatableSelect';
import { RangeFormCardManagerPropsBase, RangeWithId } from '../../shared/range/range-form-types';
import { useRangeFormColors } from '../../shared/range/useRangeFormColors';

interface RangeFormCardProps extends RangeFormCardManagerPropsBase {
  unitHandler: {
    data: ComboboxItem[] | string[];
    onCreate: (query: string) => void;
  };
  categoryHandler: {
    data: ComboboxItem[] | string[];
    onCreate: (query: string) => void;
  };
  valueMin?: number;
  valueMax?: number;
}

export const RangeFormCard: React.FC<RangeFormCardProps> = ({
  unitForm,
  categoryForm,
  unitHandler,
  categoryHandler,
  hasConflict,
  ranges,
  valueMin = 1,
  valueMax = Number.MAX_SAFE_INTEGER,
  onRemoveRange,
  onAddRange,
  onResolveConflict,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const colors = useRangeFormColors();

  const [rangeStart, setRangeStart] = useState<number | ''>('');
  const [rangeEnd, setRangeEnd] = useState<number | ''>('');
  const [individualValue, setIndividualValue] = useState<string>('');

  const clamp = (value: number | string, min: number = valueMin, max: number = valueMax) => {
    const num = Number(value);
    if (isNaN(num)) return '';
    return Math.min(Math.max(num, min), max);
  };

  const handleAddRangeValue = () => {
    if (rangeStart !== '' && rangeEnd !== '' && rangeStart <= rangeEnd) {
      onAddRange({ start: rangeStart, end: rangeStart !== rangeEnd ? rangeEnd : undefined });
      setRangeStart('');
      setRangeEnd('');
    }
  };

  const handleAddIndividualValue = () => {
    if (individualValue.trim() !== '') {
      const values = individualValue
        .split(',')
        .map((v) => parseInt(v.trim()))
        .filter((num) => !isNaN(num) && num >= valueMin && num <= valueMax);

      values.forEach((num) => {
        onAddRange({ start: num });
      });

      setIndividualValue('');
    }
  };

  const handleRemoveRange = (range: RangeWithId) => {
    if (!isCollapsed) {
      onRemoveRange(range);
    }
  };

  return (
    <Card
      padding="lg"
      radius="md"
      withBorder
      w="100%"
      shadow="md"
      bg={'#fafbe3ff'}
      style={{ border: `2px solid #999c00` }}
    >
      {/* 1. 教科・カテゴリ選択 (トグルボタンと折りたたみサマリーを含む) */}
      <Stack gap="sm">
        {/* 💡 Collapseでラップし、isCollapsedの状態に応じてCustomCreatableTagsInputを表示 */}
        <Flex justify="space-between" gap="lg">
          <Box w={'100%'}>
            <Collapse in={!isCollapsed}>
              <Stack gap="xs">
                <CustomCreatableSelect label="単元 (教科)" {...unitForm} {...unitHandler} />
                <CustomCreatableSelect label="カテゴリ" {...categoryForm} {...categoryHandler} />
              </Stack>
            </Collapse>

            {isCollapsed && (
              <Stack gap="xs">
                <Flex gap="xs" wrap="wrap" align="center">
                  <Text size="md" fw={500}>
                    単元 (教科):
                  </Text>
                  <Text size="lg" fw={700}>
                    {unitForm.value}
                  </Text>
                </Flex>

                <Flex gap="xs" wrap="wrap" align="center">
                  <Text size="md" fw={500}>
                    カテゴリ:
                  </Text>
                  <Text size="lg" fw={700}>
                    {categoryForm.value}
                  </Text>
                </Flex>
              </Stack>
            )}
          </Box>
          <ActionIcon
            mt={5}
            variant="default"
            onClick={() => setIsCollapsed(!isCollapsed)}
            size="lg"
            aria-label={isCollapsed ? '展開' : '折りたたむ'}
          >
            {isCollapsed ? <IconChevronDown size={20} /> : <IconChevronUp size={20} />}
          </ActionIcon>
        </Flex>

        <Divider />

        {/* 2. 現在の範囲指定サマリーと競合解決エリア */}
        <Stack gap="xs">
          <Title order={5}>🔢 現在の問題番号指定</Title>
          {/* 条件チップリスト */}
          <Flex gap="xs" wrap="wrap" maw="100%">
            {ranges.length === 0 ? (
              <Text c="dimmed" size="sm">
                条件が指定されていません。
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
                    <Text>{range.end ? `${range.start}〜${range.end}` : `${range.start}`}</Text>
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
                  競合または連続値の統合が可能です。
                </Text>
              </Flex>
              <Button
                onClick={onResolveConflict}
                style={{ backgroundColor: colors.conflict.button }}
                fullWidth
              >
                競合を解決し、連続値をまとめる
              </Button>
            </Stack>
          )}
        </Stack>

        {/* 💡 範囲追加・個別番号追加セクションをCollapseでラップ */}
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
                ＋ 範囲条件を追加
              </Title>
              <Flex align="center" gap={10}>
                <Flex w={'65%'} gap="xs" align="center" wrap="wrap">
                  <TextInput
                    type="number"
                    placeholder={`開始 (${valueMin})`}
                    value={rangeStart === '' ? '' : rangeStart.toString()}
                    onChange={(e) => setRangeStart(clamp(e.target.value))}
                    min={valueMin}
                    max={valueMax}
                    style={{ flex: 1 }}
                    size="sm"
                  />
                  <Text style={{ color: colors.range.accent }}>〜</Text>
                  <TextInput
                    type="number"
                    placeholder={`終了 (${valueMax})`}
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
                  onClick={handleAddRangeValue}
                  disabled={rangeStart === '' || rangeEnd === '' || rangeStart > rangeEnd}
                  style={{ backgroundColor: colors.range.button, color: colors.range.buttonText }}
                  fullWidth
                  size="sm"
                >
                  範囲を追加
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
                ＋ 個別番号を追加
              </Title>
              <Flex align="center" gap={10}>
                <TextInput
                  w={'65%'}
                  placeholder="例: 1, 5, 10"
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
                  disabled={individualValue.trim() === ''}
                  style={{
                    backgroundColor: colors.individual.button,
                    color: colors.individual.buttonText,
                  }}
                  size="sm"
                >
                  番号を追加
                </Button>
              </Flex>
            </Stack>
          </Stack>
        </Collapse>
      </Stack>
    </Card>
  );
};
