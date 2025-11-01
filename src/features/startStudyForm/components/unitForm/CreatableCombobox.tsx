import React from 'react';
import { IconPlus } from '@tabler/icons-react';
import {
  Button,
  ButtonProps,
  ClassNames,
  Combobox,
  ComboboxProps,
  rem,
  Styles,
  Text,
  TextInput,
  TextInputProps,
  useCombobox,
} from '@mantine/core';

/**
 * @typedef {Object} ComboboxItem
 * @property {string} value - 選択されたときに設定される実際の値
 * @property {string} label - ドロップダウンに表示されるテキスト
 */
type ComboboxItem = {
  value: string;
  label: string;
};

// data propの型定義: オブジェクト配列または文字列配列
type ComboboxData = ComboboxItem[] | string[];

/**
 * 新規作成機能付きオートコンプリート（Combobox）コンポーネントのProps
 * @interface CreatableComboboxProps
 */
interface CreatableComboboxProps {
  /** 既存の選択肢のリスト。ComboboxItem[] または string[] を指定可能。 */
  data: ComboboxData;
  /** 現在の入力値 (label/表示テキスト) */
  value: string;
  /** 入力値が変更されたときに呼び出されるハンドラ (新しい入力値が渡される) */
  onChange: (value: string) => void;
  /** 新規のアイテムを作成するときに呼び出されるハンドラ (新しい入力値が渡される) */
  onCreateNew: (newValue: string) => void;
  /** フォームのラベル */
  label?: string;
  /** フォームのプレースホルダー */
  placeholder?: string;
  /** Mantine Formとの連携用エラーメッセージ。TextInputコンポーネントに渡されます。 */
  error?: React.ReactNode;
  /** ドロップダウンの最大高さ（例: 200） */
  maxDropdownHeight?: number | string;

  /** TextInputコンポーネントの内部要素に適用するカスタムスタイル */
  inputStyles?: TextInputProps['styles'];
  /** TextInputコンポーネントの内部要素に適用するカスタムクラス名 */
  inputClassNames?: TextInputProps['classNames'];

  /** 新規作成ボタンに適用するカスタムスタイル */
  buttonStyles?: ButtonProps['styles'];
  /** 新規作成ボタンに適用するカスタムクラス名 */
  buttonClassNames?: ButtonProps['classNames'];

  /** Comboboxコンポーネント（Dropdownなど）に適用するカスタムスタイル */
  comboboxStyles?: ComboboxProps['styles'];
  /** Comboboxコンポーネント（Dropdownなど）に適用するカスタムクラス名 */
  comboboxClassNames?: ComboboxProps['classNames'];
}

/**
 * 新規作成機能を統合し、柔軟なスタイルカスタマイズに対応した汎用Comboboxコンポーネント。
 * TextInputにデフォルトでモダンなスタイル（variant="filled", radius="md"）を適用。
 * @param {CreatableComboboxProps} props - コンポーネントのプロパティ
 * @returns {React.FC<CreatableComboboxProps>} CreatableComboboxコンポーネント
 */
export const CreatableCombobox: React.FC<CreatableComboboxProps> = ({
  data,
  value,
  onChange,
  onCreateNew,
  label,
  placeholder = '値を入力または選択...',
  error,
  maxDropdownHeight = 250,
  // スタイルProps
  inputStyles,
  inputClassNames,
  buttonStyles,
  buttonClassNames,
  comboboxStyles,
  comboboxClassNames,
}) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const standardizedData: ComboboxItem[] = data.map((item) => {
    if (typeof item === 'string') {
      return { value: item, label: item };
    }
    return item;
  });

  const allLabels = standardizedData.map((item) => item.label);

  const filteredOptions = allLabels.filter((label) =>
    label.toLowerCase().includes(value.trim().toLowerCase())
  );

  const isExactMatch = allLabels.some((label) => label === value.trim());
  const isCreateNewEnabled = value.trim().length > 0 && !isExactMatch;

  const handleCreateNew = () => {
    if (isCreateNewEnabled) {
      onCreateNew(value.trim());
      combobox.closeDropdown();
    }
  };

  const options = filteredOptions.map((label) => {
    return (
      <Combobox.Option value={label} key={label}>
        {label}
      </Combobox.Option>
    );
  });

  const footer = isCreateNewEnabled ? (
    <Combobox.Footer
      p="xs"
      style={{ borderTop: `${rem(1)} solid var(--mantine-color-default-border)` }}
    >
      <Button
        onClick={handleCreateNew}
        leftSection={<IconPlus size={16} />}
        variant="light"
        color="blue"
        fullWidth
        size="sm"
        styles={buttonStyles}
        classNames={buttonClassNames}
      >
        {`"${value}" を新規作成`}
      </Button>
    </Combobox.Footer>
  ) : null;

  const nothingFoundMessage =
    value.trim().length > 0
      ? isExactMatch
        ? '既存の項目と一致しています'
        : '一致する候補がありません'
      : '値を入力して検索または選択';

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        onChange(optionValue);
        combobox.closeDropdown();
      }}
      store={combobox}
      withinPortal={false}
      styles={comboboxStyles as Styles<any>}
      classNames={comboboxClassNames as ClassNames<any>}
    >
      <Combobox.Target>
        <TextInput
          label={label}
          placeholder={placeholder}
          value={value}
          error={error} // Mantine Form連携のためのerror prop
          variant="filled"
          radius="md"
          onChange={(event) => {
            onChange(event.currentTarget.value);
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
          styles={inputStyles}
          classNames={inputClassNames}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options mah={maxDropdownHeight} style={{ overflowY: 'auto' }}>
          {options.length > 0 ? (
            options
          ) : (
            <Combobox.Empty>
              <Text c="dimmed">{nothingFoundMessage}</Text>
            </Combobox.Empty>
          )}
        </Combobox.Options>

        {footer}
      </Combobox.Dropdown>
    </Combobox>
  );
};
