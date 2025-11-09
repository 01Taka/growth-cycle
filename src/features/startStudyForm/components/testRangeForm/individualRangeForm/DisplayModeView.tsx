// components/DisplayModeView.tsx

import React from 'react';
import { IconChevronRight, IconPencil, IconTrash } from '@tabler/icons-react';
import { Box, Divider, Flex, Group, Paper, rem, Text, ThemeIcon } from '@mantine/core'; // Dividerを追加

import {
  IndividualRangeFormHandlers,
  IndividualRangeFormValue,
} from '../../../shared/components-types/shared-test-range-types';
import { ProblemNumberSelect } from './ProblemNumberSelect';

// DisplayModeViewに渡すために必要なプロパティ
interface DisplayModeViewProps {
  maxProblemNumber: number;
  value: IndividualRangeFormValue;
  onRemove: () => void;
  onStartEditMode: () => void;
  onChangeProblemNumber: IndividualRangeFormHandlers['onChangeProblemNumber'];
  onExpansionMaxProblemNumber: () => void;
}

export const DisplayModeView: React.FC<DisplayModeViewProps> = ({
  maxProblemNumber,
  value,
  onRemove,
  onStartEditMode,
  onChangeProblemNumber,
  onExpansionMaxProblemNumber,
}) => {
  return (
    // 全体を一つの大きなPaper（カード）で囲みます
    <Paper
      radius="lg"
      p="md" // パディングを調整
      withBorder
      shadow="md" // 少し強めの影で区切りを強調
      w="100%"
    >
      <Flex direction="column" gap="xs">
        {/* 1. ユニット・カテゴリー表示 & 編集トリガーエリア */}
        {/* クリック可能領域として、ホバーエフェクトを設定 */}
        <Flex
          align="center"
          gap="md"
          wrap="nowrap"
          onClick={onStartEditMode}
          style={{
            cursor: 'pointer',
            padding: '4px 0', // 上下のパディングでクリック範囲を確保
          }}
        >
          {/* 編集アイコン */}
          <ThemeIcon variant="light" size="lg" radius="md" color="indigo" style={{ flexShrink: 0 }}>
            <IconPencil style={{ width: '70%', height: '70%' }} />
          </ThemeIcon>

          {/* テキスト情報 */}
          <Flex direction="column" gap={4} style={{ minWidth: '0', flexGrow: 1 }}>
            <Group gap="xs" wrap="nowrap" align="center">
              <Text size="xs" c="indigo" fw={600} style={{ flexShrink: 0 }}>
                ユニット:
              </Text>
              <Text size="md" truncate style={{ lineHeight: 1.2 }}>
                {value.unit || '未設定 (クリックして編集)'}
              </Text>
            </Group>

            <Group gap="xs" wrap="nowrap" align="center">
              <Text size="xs" c="cyan" fw={600} style={{ flexShrink: 0 }}>
                カテゴリ:
              </Text>
              <Text size="md" fw={700} truncate style={{ lineHeight: 1.2 }}>
                {value.category || '未設定'}
              </Text>
            </Group>
          </Flex>

          {/* 右端の矢印アイコン */}
          <Box style={{ flexShrink: 0 }}>
            <IconChevronRight size={20} color="gray" />
          </Box>
        </Flex>

        {/* 2. 区切り線 */}
        <Divider my="xs" />

        {/* 3. 問題番号選択エリア */}
        <Flex>
          <Flex gap={10} onClick={onRemove}>
            <ThemeIcon variant="light" size="lg" radius="md" color="red" style={{ flexShrink: 0 }}>
              <IconTrash style={{ width: '70%', height: '70%' }} />
            </ThemeIcon>
            <Divider orientation="vertical" />
          </Flex>
          <Group
            flex={1}
            justify="space-between"
            align="center"
            wrap="nowrap"
            style={{ marginLeft: 15 }}
          >
            <Text size="sm" fw={600} c="dimmed">
              問題番号
            </Text>
            <Box style={{ flexShrink: 0, width: '50%' }}>
              <ProblemNumberSelect
                value={value.problemNumber ?? 1}
                maxProblemNumber={maxProblemNumber}
                onChange={onChangeProblemNumber}
                onExpansionMaxProblemNumber={onExpansionMaxProblemNumber}
                styles={{
                  input: {
                    fontSize: rem(15),
                    fontWeight: 700,
                  },
                }}
              />
            </Box>
          </Group>
        </Flex>
      </Flex>
    </Paper>
  );
};
