import React from 'react';
import { Autocomplete, Box, Button, Stack, Text } from '@mantine/core';

// 必要なpropsの型定義
interface AutoFillInputProps {
  /** 既存のオートフィル候補のリスト */
  autoFills: string[];
  /** 現在の入力値 */
  value: string;
  /** 入力値が変更されたときに呼び出されるハンドラ */
  onChange: (value: string) => void;
  /** 新規のオートフィルを作成するときに呼び出されるハンドラ */
  onCreateNewAutoFill: (autoFill: string) => void;
  /** フォームのラベル */
  label?: string;
  /** フォームのプレースホルダー */
  placeholder?: string;
}

const AutoFillInput: React.FC<AutoFillInputProps> = ({
  autoFills,
  value,
  onChange,
  onCreateNewAutoFill,
  label = 'オートフィルテキストフォーム',
  placeholder = '値を入力または選択...',
}) => {
  // 1. 現在の入力値が既存のautoFillsのいずれかと完全に一致しているかをチェック
  const isExactMatch = autoFills.some((fill) => fill === value);

  // 2. 新規作成ボタンを有効にする条件:
  //    - 入力値 (value) が空でない
  //    - 既存のautoFillsのどれとも完全には一致していない
  const isCreateNewEnabled = value.trim().length > 0 && !isExactMatch;

  // 3. Autocompleteの表示データをフィルタリング
  // Autocompleteはdata propで渡された配列を自動でフィルタリングしますが、
  // 独自のフィルタリングが必要な場合はfilter propを使用します。
  // 今回はMantineのデフォルトフィルタリング (部分一致) をそのまま使用します。
  const dataForAutocomplete = autoFills;

  // 4. 新規作成ボタンクリック時のハンドラ
  const handleCreateNew = () => {
    if (isCreateNewEnabled) {
      onCreateNewAutoFill(value);
    }
  };

  return (
    <Stack gap="xs">
      <Autocomplete
        label={label}
        placeholder={placeholder}
        data={dataForAutocomplete}
        value={value}
        onChange={onChange}
        // ドロップダウンに表示される最大オプション数を制限
        limit={10}
        // ドロップダウンが開いている状態でNothing Foundを表示するテキスト
        nonce={
          value.trim().length > 0 && !isExactMatch
            ? '候補なし'
            : value.trim().length > 0
              ? '一致する候補がありません'
              : undefined // 入力がない場合は何も表示しない
        }
      />

      <Box pt="xs">
        <Button
          onClick={handleCreateNew}
          disabled={!isCreateNewEnabled}
          variant="outline"
          color="blue"
          fullWidth
        >
          {`"${value}" を新規作成`}
        </Button>

        {!isCreateNewEnabled && value.trim().length > 0 && (
          <Text size="sm" style={{ color: 'dimgray' }} mt={5}>
            入力値が既存の候補と一致しない場合に新規作成ボタンが有効になります。
          </Text>
        )}
      </Box>
    </Stack>
  );
};

export default AutoFillInput;
