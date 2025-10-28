// components/EditModeView.tsx

import React, { useMemo } from 'react';
import { IconChevronLeft, IconX } from '@tabler/icons-react';
import {
  ActionIcon,
  Autocomplete,
  Box,
  Button,
  Flex,
  Paper,
  rem,
  Stack,
  Text,
  Title,
} from '@mantine/core';
// Paper, Titleを追加
import { sharedStyle } from '@/shared/styles/shared-styles'; // 仮定

import { theme } from '@/theme';
import {
  IndividualRangeFormHandlers,
  IndividualRangeFormValue,
  OnFinishEditModeArgs,
} from '../shared-types';
import { ProblemNumberSelect } from './ProblemNumberSelect';

// EditModeViewに渡すために必要なプロパティ
export interface EditModeViewProps {
  maxProblemNumber: number;
  units: string[];
  categories: string[];
  isNewUnit: boolean;
  isNewCategory: boolean;
  value: IndividualRangeFormValue;
  onFinishEditMode: (args: OnFinishEditModeArgs) => void;
  // HandlersをOmitして直接定義
  onUnitChange: IndividualRangeFormHandlers['onUnitChange'];
  onUnitSubmit: IndividualRangeFormHandlers['onUnitSubmit'];
  onCategoryChange: IndividualRangeFormHandlers['onCategoryChange'];
  onCategorySubmit: IndividualRangeFormHandlers['onCategorySubmit'];
  onChangeProblemNumber: IndividualRangeFormHandlers['onChangeProblemNumber'];
  onExpansionMaxProblemNumber: () => void;
}

export const EditModeView: React.FC<EditModeViewProps> = ({
  maxProblemNumber,
  units,
  categories,
  isNewUnit,
  isNewCategory,
  value,
  onFinishEditMode,
  onUnitChange,
  onUnitSubmit,
  onCategoryChange,
  onCategorySubmit,
  onChangeProblemNumber,
  onExpansionMaxProblemNumber,
}) => {
  const hasNewItem = isNewUnit || isNewCategory;

  // 確定ボタンのメッセージ生成ロジック
  const buttonMessage = useMemo(() => {
    const messages: string[] = [];
    if (isNewUnit && value?.unit) {
      messages.push(`🚀 新しいユニット: ${value.unit}`);
    }

    if (isNewCategory && value?.category) {
      messages.push(`✨ 新しいカテゴリー: ${value.category}`);
    }

    if (messages.length === 0) {
      messages.push('新しいユニット・カテゴリーを追加');
    }

    return messages;
  }, [isNewUnit, isNewCategory, value?.unit, value?.category]);

  return (
    <Paper radius="lg" p="xl" withBorder shadow="md">
      {' '}
      {/* Paperで全体を囲み、モダンなカードデザインに */}
      <Flex
        justify="space-between"
        align="start"
        onClick={() => onFinishEditMode({ isNewCategory, isNewUnit, value })}
      >
        <Box w={'20%'} />
        <Title order={3} mb="lg" style={{ textAlign: 'center', color: '#333' }}>
          ✏️ 編集モード
        </Title>
        <Flex w={'20%'} align={'center'} style={{ flexShrink: 0 }}>
          {!hasNewItem && (
            <>
              <IconChevronLeft size={20} color="gray" />
              <Text style={{ color: 'gray' }}>閉じる</Text>
            </>
          )}
        </Flex>
      </Flex>
      <Stack gap="xl">
        {' '}
        {/* gapをxlにして各フォーム間のスペースを広く取り、すっきりとした印象に */}
        <Autocomplete
          label="単元"
          placeholder="値を入力または選択"
          data={units}
          value={value.unit ?? ''}
          onChange={onUnitChange}
          onOptionSubmit={(value) => onUnitSubmit(value)}
          variant="filled" // フォームの背景色を付け、モダンな印象に
          radius="md"
          size="md"
          rightSection={
            value.unit ? (
              <ActionIcon
                size="md"
                color="gray"
                variant="subtle"
                onClick={() => onUnitChange('')}
                aria-label="クリア"
              >
                <IconX style={{ width: 'md', height: 'md' }} stroke={1.5} />
              </ActionIcon>
            ) : null
          }
        />
        <Autocomplete
          label="カテゴリー"
          placeholder="値を入力または選択"
          data={categories}
          value={value.category ?? ''}
          onChange={onCategoryChange}
          onOptionSubmit={(submittedValue) => onCategorySubmit(submittedValue)}
          variant="filled"
          radius="md"
          size="md"
          rightSection={
            value.category ? (
              <ActionIcon
                size="md"
                color="gray"
                variant="subtle"
                onClick={() => onCategoryChange('')}
                aria-label="クリア"
              >
                <IconX style={{ width: 'md', height: 'md' }} stroke={1.5} />
              </ActionIcon>
            ) : null
          }
        />
        {/* ProblemNumberSelectは内部でデザイン調整が必要ですが、ここではそのまま使用 */}
        <ProblemNumberSelect
          label="問題番号"
          value={value.problemNumber ?? 1}
          maxProblemNumber={maxProblemNumber}
          onChange={onChangeProblemNumber}
          onExpansionMaxProblemNumber={onExpansionMaxProblemNumber}
        />
        <Button
          disabled={!hasNewItem}
          h={70} // ボタンの高さを確保
          size="lg"
          radius="lg" // 角を丸く
          variant="gradient" // グラデーションで高級感を演出
          gradient={{ from: 'indigo', to: 'cyan' }} // グラデーションカラー
          style={{
            ...(!hasNewItem ? sharedStyle.disabledButton : sharedStyle.button),
            marginTop: 'md',
          }} // フォームとの間にマージンを追加
          styles={{
            label: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
          }}
          fullWidth
          onClick={() => onFinishEditMode({ isNewCategory, isNewUnit, value })}
        >
          {buttonMessage.map((message, index) => (
            <Text
              key={index}
              size={index === 0 ? 'lg' : 'sm'} // 1行目（確定 or 新規追加メッセージ）を大きく
              style={{
                fontWeight: index === 0 ? 700 : 500,
                whiteSpace: 'pre-wrap',
                textAlign: 'center',
                lineHeight: 1.2,
                color: 'white', // グラデーションボタンに合わせてテキストカラーを白に
              }}
            >
              {message}
            </Text>
          ))}
        </Button>
        <Text style={{ fontSize: rem(15), color: 'gray' }}>
          未登録のユニットやカテゴリーを入力することで、新規登録ができます。
        </Text>
      </Stack>
    </Paper>
  );
};
