import React from 'react';
import {
  Badge,
  Box,
  Card,
  Divider,
  Flex,
  Group,
  rem,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { EnteredTestRangeDisplayItemProps } from './EnteredTestRangeDisplay';

// Props定義を再確認
type ItemProps = Omit<EnteredTestRangeDisplayItemProps, 'isUnitBoundary'>;

/**
 * 最終的な入力結果（ユニット、カテゴリ、問題番号）を表示するコンポーネント (カテゴリー表示維持・セット強調版)
 * ユニットが連続する場合にのみ省略。カテゴリーは常に表示し、問題番号とセットで確認しやすい配置に。
 * @param {ItemProps} props - 表示する問題情報
 */
export const EnteredTestRangeDisplayItem: React.FC<ItemProps> = ({
  problem,
  prevUnit,
  colorIndex,
}) => {
  const theme = useMantineTheme();

  // ユニットのみが直前のアイテムと一致しているかを判定 (カテゴリーの判定は削除)
  const isUnitSameAsPrev = problem.unit === prevUnit && problem.unit !== '';

  // 背景色の選択
  const bgColor = theme.colors.gray[colorIndex === 0 ? 0 : 1];

  // 中央に表示するユニット情報 (省略ロジック)
  const unitContent = isUnitSameAsPrev ? (
    // 上と同じユニットの場合は省略記号のみを表示
    <Text size="md" c="dimmed" style={{ flexGrow: 1, textAlign: 'left', paddingLeft: 'xs' }}>
      ...
    </Text>
  ) : (
    // ユニットが変わった場合は、情報を強調して表示
    <Stack gap={0} style={{ flexGrow: 1, minWidth: 0 }}>
      <Group gap={4} wrap="nowrap">
        <Text size="xs" c="dimmed" fw={500} style={{ flexShrink: 0 }}>
          U:
        </Text>
        <Text size="md" fw={700} truncate>
          {problem.unit}
        </Text>
      </Group>
    </Stack>
  );

  return (
    <Card
      shadow="xs"
      padding="sm"
      radius="md"
      mih={66}
      withBorder
      style={{
        backgroundColor: bgColor,
        transition: 'box-shadow 0.1s ease',
        '&:hover': { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' },
      }}
    >
      <Group justify="space-between" wrap="nowrap" align="center" gap="sm" style={{ height: 40 }}>
        {' '}
        {/* 高さ制限でコンパクトさを維持 */}
        {/* 左端: problemIndex (順番) */}
        <Stack gap={0} align="center" style={{ flexShrink: 0, minWidth: 35 }}>
          <Text size="xs" c="dimmed" fw={500}>
            No.
          </Text>
          <Badge
            size="md"
            variant="filled"
            color="indigo"
            radius="sm"
            style={{
              minWidth: 30,
              height: 24,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {problem.problemIndex}
          </Badge>
        </Stack>
        <Divider orientation="vertical" />
        {/* 中央左: ユニット情報 (省略されるエリア) */}
        <Box style={{ paddingRight: 'xs', width: '100%', minWidth: 0 }}>
          <Stack gap={0}>
            <Text size="xs" c="dimmed" fw={500} style={{ whiteSpace: 'nowrap' }}>
              ユニット
            </Text>
            <Text size="sm" truncate fw={500} c="dark" style={{ whiteSpace: 'nowrap' }}>
              {problem.unit}
            </Text>
          </Stack>
        </Box>
        <Divider orientation="vertical" />
        {/* 中央右～右端: カテゴリーと問題番号のセットエリア */}
        <Group gap="sm" align="center" wrap="nowrap" miw={160} w={'50%'}>
          {/* カテゴリー表示 */}
          <Box style={{ paddingRight: 'xs', width: '100%' }}>
            <Stack gap={0}>
              <Text size="xs" c="dimmed" fw={500}>
                カテゴリー
              </Text>
              <Text size="sm" truncate fw={500} c="dark">
                {problem.category}
              </Text>
            </Stack>
          </Box>

          <Divider orientation="vertical" />

          {/* 問題番号 (強調エリア) */}
          <Flex direction="column" align="center" style={{ width: 80 }}>
            <Text size="xs" c="dimmed">
              問題
            </Text>
            <Text
              size={problem.problemNumber > 99 ? 'lg' : '2rem'}
              fw={900}
              style={{ lineHeight: 1.0, color: 'red' }}
            >
              {problem.problemNumber}
            </Text>
          </Flex>
        </Group>
      </Group>
    </Card>
  );
};
