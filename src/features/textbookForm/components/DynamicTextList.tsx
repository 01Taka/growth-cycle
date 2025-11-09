import React, { CSSProperties, useCallback } from 'react';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import {
  __InputStylesNames,
  ActionIcon,
  ActionIconProps,
  ActionIconStylesNames,
  Box,
  Button,
  ButtonProps,
  ButtonStylesNames,
  Group,
  MantineStyleProp,
  MantineTheme,
  rem,
  Stack,
  Text,
  TextInput,
  TextInputProps,
} from '@mantine/core';

// ----------------------------------------------------
// 💡 新しい共有型定義 (親コンポーネントも使用する型)
// ----------------------------------------------------
export interface ListItem {
  id: string; // Reactのkeyとしても使用される一意のID
  text: string;
}

// ----------------------------------------------------
// 💡 ID衝突回避機能付きのID生成関数（デフォルト実装）
// ----------------------------------------------------

/** 既存のIDセットを保持するSet */
// 注意: このSetはコンポーネントの外部にあり、モジュールがロードされるたびにリセットされるため、
// アプリ全体での厳密な一意性を保証するものではありませんが、同一セッション内の衝突は回避できます。
const existingIds = new Set<string>();

/**
 * 新しい一意のIDを生成するデフォルト関数。
 * @returns {string} 新しい一意のID
 */
export const defaultCreateId = (): string => {
  let newId: string;
  do {
    // 衝突テストのため短めのIDを使用
    newId = Math.random().toString(36).substring(2, 9);
  } while (existingIds.has(newId));

  existingIds.add(newId); // 新しいIDをセットに追加
  // 必要に応じて、古いIDを定期的に削除するロジックを追加しても良い
  return newId;
};

type ButtonStyles =
  | Partial<Record<ButtonStylesNames, CSSProperties>>
  | ((
      theme: MantineTheme,
      props: ButtonProps,
      ctx: unknown
    ) => Partial<Record<ButtonStylesNames, CSSProperties>>);

type TextInputStyles =
  | Partial<Record<__InputStylesNames, CSSProperties>>
  | ((
      theme: MantineTheme,
      props: TextInputProps,
      ctx: unknown
    ) => Partial<Record<__InputStylesNames, CSSProperties>>);

type IconStyles =
  | Partial<Record<ActionIconStylesNames, CSSProperties>>
  | ((
      theme: MantineTheme,
      props: ActionIconProps,
      ctx: unknown
    ) => Partial<Record<ActionIconStylesNames, CSSProperties>>);

type Styles = {
  label: MantineStyleProp;
  empty: MantineStyleProp;
  addGroup: MantineStyleProp;
  addButton: ButtonStyles;
  fieldStack: MantineStyleProp;
  fieldGroup: MantineStyleProp;
  textInput: TextInputStyles;
  deleteAction: IconStyles;
};

// ----------------------------------------------------
// 💡 コンポーネントのProps型定義
// ----------------------------------------------------
interface DynamicTextListProps {
  label?: string;
  /** 親から渡される現在の値 (ListItemの配列) */
  value?: ListItem[];
  /** 値が変更されたときに呼び出されるコールバック関数 (ListItemの配列を返す) */
  onChange?: (values: ListItem[]) => void;
  /** 入力フィールドのプレースホルダーテキスト */
  placeholder?: string;
  /** リストが空の場合に表示するテキスト */
  emptyText?: string;
  /**
   * 項目IDを生成するためのカスタム関数。
   * 渡されない場合はデフォルトの`defaultCreateId`が使用されます。
   */
  createId?: () => string;
  styles?: Partial<Styles>;
}

export const DynamicTextList: React.FC<DynamicTextListProps> = ({
  label,
  value,
  onChange,
  placeholder = 'テキストを入力',
  emptyText = 'まだ入力項目がありません',
  createId = defaultCreateId,
  styles,
}) => {
  // valueが存在しない場合は空の配列を使用
  const items = value ?? [];

  // ----------------------------------------------------
  // 💡 変更通知ヘルパー (今回は内部状態の変換が不要)
  // ----------------------------------------------------
  const notifyChange = useCallback(
    (newItems: ListItem[]) => {
      // 親に新しいListItem[]をそのまま通知
      onChange?.(newItems);
    },
    [onChange]
  );

  // ----------------------------------------------------
  // 💡 リスト操作ロジック
  // ----------------------------------------------------

  // 項目を追加する処理
  const addItem = useCallback(() => {
    // PropsのcreateId関数を使用して新しいIDを生成
    const newItem: ListItem = { id: createId(), text: '' };
    const newItems = [...items, newItem];
    notifyChange(newItems);
  }, [items, notifyChange, createId]);

  // 項目を削除する処理
  // keyの安定性を活かすため、IDで項目を特定して削除するように変更
  const removeItem = useCallback(
    (idToRemove: string) => {
      // IDに基づいてListItem[]から削除
      const newItems = items.filter((item) => item.id !== idToRemove);
      notifyChange(newItems);
    },
    [items, notifyChange]
  );

  // テキスト入力が変更されたときの処理
  // keyの安定性を活かすため、IDで項目を特定して更新するように変更
  const handleTextChange = useCallback(
    (idToChange: string, newText: string) => {
      // IDに基づいてListItem[]のtextを更新
      const newItems = items.map((item) =>
        item.id === idToChange ? { ...item, text: newText } : item
      );
      notifyChange(newItems);
    },
    [items, notifyChange]
  );

  // ----------------------------------------------------
  // 💡 JSX要素のレンダリング
  // ----------------------------------------------------

  const fields = items.map((item) => (
    // item.idをkeyに使用
    <Group key={item.id} align="center" wrap="nowrap" style={styles?.fieldGroup}>
      <TextInput
        placeholder={placeholder}
        // Propsのvalue（items）を直接使用
        value={item.text}
        // 変更はitem.idを渡してhandleTextChange経由で親に通知
        onChange={(event) => handleTextChange(item.id, event.currentTarget.value)}
        style={{ flexGrow: 1 }}
        styles={styles?.textInput}
      />

      <ActionIcon
        color="red"
        variant="light"
        onClick={() => removeItem(item.id)} // item.idを渡して削除
        aria-label={`Remove item with ID ${item.id}`}
        styles={styles?.deleteAction}
      >
        <IconTrash size={18} />
      </ActionIcon>
    </Group>
  ));

  return (
    <Box>
      {label && (
        <Text style={{ fontSize: rem(14), fontWeight: 500, ...styles?.label }}>{label}</Text>
      )}
      {/* 入力フィールドのリスト */}
      {fields.length > 0 ? (
        <Stack style={{ marginTop: 5, gap: 'sm', ...styles?.fieldStack }}>{fields}</Stack>
      ) : (
        <Text py="md" style={styles?.empty}>
          {emptyText}
        </Text>
      )}

      {/* 追加ボタン */}
      <Group style={{ marginTop: 16, ...styles?.addGroup }}>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={addItem}
          variant="default"
          size="sm"
          styles={styles?.addButton}
        >
          項目を追加
        </Button>
      </Group>
    </Box>
  );
};
