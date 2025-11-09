import React from 'react';
import { Box, Button, Card, Divider, Select, Stack, Text, TextInput } from '@mantine/core';
import { Form, UseFormReturnType } from '@mantine/form';
import { sharedStyle } from '@/shared/styles/shared-styles';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { Subject } from '@/shared/types/subject-types';
import { CreateTextbookForm } from '../shared/form/create-textbook-form-types';
import { DynamicTextList } from './DynamicTextList';
import { StudyHeader } from './StudyHeader';

interface CreateTextFormCardProps {
  form: UseFormReturnType<CreateTextbookForm, (values: CreateTextbookForm) => CreateTextbookForm>;
  unitNames: string[];
  subjects: { value: Subject; label: string }[];
  theme: SubjectColorMap;
  isFilled: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export const CreateTextFormCard: React.FC<CreateTextFormCardProps> = ({
  form,
  unitNames,
  subjects,
  theme,
  isFilled,
  onSubmit,
  isSubmitting,
  errorMessage,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <Box // 固定位置を解除し、全体をラップするBoxとして機能
        style={{
          backgroundColor: theme.bgCard,
          color: theme.text,
          minHeight: '100vh', // 最小高さを設定
        }}
      >
        <Stack
          maw={500}
          mx="auto"
          pt="xl"
          pb={120} // 作成ボタンの高さと余白を考慮してpadding-bottomを設定
          gap="xl"
          w={'90%'}
          style={{ overflowY: 'auto' }}
        >
          {/* 固定ヘッダーを解除し、フォームのタイトルとしてStudyHeaderを配置 */}
          <Box pt="lg">
            <StudyHeader
              subject={form.values.subject}
              textbookName={form.values.name}
              units={unitNames}
              defaultTextNameLabel="テキスト名"
            />
          </Box>

          <Card
            withBorder
            radius="md"
            p="lg"
            shadow="sm"
            style={{
              backgroundColor: theme.bgScreen || 'white',
              border: `2px solid ${theme.border}`,
            }}
          >
            <Stack gap="xs">
              <Text fw={700}>基本情報</Text>
              <Select
                {...form.getInputProps('subject')}
                label="教科"
                data={subjects}
                placeholder="教科を選択"
              />
              <TextInput
                {...form.getInputProps('name')}
                label="テキスト名"
                placeholder="問題集名を入力"
              />
            </Stack>
          </Card>

          <Divider />

          <Card
            withBorder
            radius="md"
            p="lg"
            shadow="sm"
            style={{
              backgroundColor: theme.bgScreen || 'white',
              border: `2px solid ${theme.border}`,
            }}
          >
            <Stack gap={10}>
              <Text size="lg" fw={700}>
                オプション
              </Text>
              <Text size="sm">
                単元や問題の分類をあらかじめ登録できます。勉強を始めるときに簡単に随時追加できます。
              </Text>

              {/* 単元 */}
              <DynamicTextList
                label="単元"
                placeholder="単元を入力"
                {...form.getInputProps('units')}
                // ボタンのスタイルを調整し、メインの作成ボタンと差別化
                styles={{
                  addButton: { root: { backgroundColor: theme.bgChip, color: theme.text } },
                }}
              />
              <Divider my="md" />

              {/* カテゴリー */}
              <DynamicTextList
                label="問題の分類　(基本例題, 発展問題など)"
                placeholder="問題の分類を入力"
                {...form.getInputProps('categories')}
                // ボタンのスタイルを調整
                styles={{
                  addButton: { root: { backgroundColor: theme.bgChip, color: theme.text } },
                }}
              />
            </Stack>
          </Card>
        </Stack>

        {/* 固定フッターボタンエリア */}
        <Box
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 20px', // 上下左右にパディング
            backgroundColor: theme.bgCard, // 背景色
            boxShadow: sharedStyle.button.boxShadow, // 影で浮かせた印象に
            maxWidth: 500, // Stackと同じ最大幅に設定
            margin: '0 auto', // 中央寄せ
          }}
        >
          <Button
            size="xl"
            fullWidth
            style={{
              backgroundColor: isFilled ? theme.accent : theme.disabled,
              color: isFilled ? theme.textRevers : theme.disabledText,
              transition: 'background-color 0.2s',
            }}
            disabled={!isFilled || isSubmitting}
            loading={isSubmitting}
            type="submit"
          >
            {isSubmitting ? '作成中...' : form.values.name || 'テキスト'}を作成        
          </Button>
        </Box>
      </Box>
    </form>
  );
};
