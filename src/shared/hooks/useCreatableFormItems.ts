import { useCallback, useMemo, useState } from 'react';
import { ComboboxItem } from '@mantine/core';

// 共通型
type ItemList = ComboboxItem[] | string[];
type CreatableItems = ComboboxItem[];

// 内部処理で利用する、全てComboboxItem[]に正規化された型
type NormalizedItems<T extends Record<string, ItemList>> = Record<keyof T, ComboboxItem[]>;

/**
 * 新しいアイテムのvalueを生成するための関数。
 */
export type GetValueFn<T extends string | number | symbol> = (fieldKey: T, label: string) => string;

interface UseCreatableFormItemsProps<T extends Record<string, any>> {
  initialCreations?: Partial<Record<keyof T, CreatableItems>>;
  initialExistingItems?: Partial<T>;
  filterLabels?: string[];
  filterValues?: string[];
  getValue?: GetValueFn<keyof T>;
}

interface UseCreatableFormItemsReturn<T extends Record<string, ItemList>> {
  /** 新しく作成されたアイテムのみのレコード (キーが存在しない可能性を考慮し Partial 型) */
  creations: Partial<Record<keyof T, CreatableItems>>;
  /** 新規作成を処理する関数 */
  onCreate: (fieldKey: keyof T, newOption: string | { value?: string; label: string }) => void;
  /** 作成のキャンセルを処理する関数 */
  onCancelCreate: (fieldKey: keyof T, value: string) => void;
  /** 新規作成アイテムと既存アイテムを統合したレコード (ComboboxItem[]に統一) */
  combinedItems: NormalizedItems<T>;
}

/**
 * @mantine/core の ComboboxItem[] へデータを正規化するヘルパー関数。
 * 既に ComboboxItem[] の形式であればそのまま返し、string[] 形式であれば変換する。
 * null/undefined/空文字列の値を安全に処理する。
 */
const normalizeToComboboxItems = (items: unknown): ComboboxItem[] => {
  if (!items || !Array.isArray(items) || items.length === 0) return [];

  // 既に ComboboxItem[] 形式の場合
  if (
    items.every(
      (item) => typeof item === 'object' && item !== null && 'label' in item && 'value' in item
    )
  ) {
    return items as ComboboxItem[];
  }

  // string[] | number[] のケース: ComboboxItem に変換し、空文字列の項目を除外
  return items
    .map((item) => {
      const value = item != null ? item.toString() : '';
      // null や undefined を value/label に設定するのは避ける
      return {
        label: value,
        value: value,
      };
    })
    .filter((item) => item.value !== '');
};

/**
 * フォームで「作成可能」なアイテムの状態を管理するフック。
 * 新規作成アイテムのリスト (creations) と、既存アイテムをマージしたリスト (combinedItems) を提供する。
 */
export function useCreatableFormItems<T extends Record<string, any>>({
  initialCreations = {} as Partial<Record<keyof T, CreatableItems>>,
  initialExistingItems = {} as Partial<T>,
  filterLabels = [],
  filterValues = [],
  // デフォルトのgetValue関数: new_{key}_{label}
  getValue = (_key, label) => label,
}: UseCreatableFormItemsProps<T>): UseCreatableFormItemsReturn<T> {
  // 1. 新規作成されたアイテムの状態管理
  const [creations, setCreations] =
    useState<Partial<Record<keyof T, CreatableItems>>>(initialCreations);

  // 2. 既存アイテムを正規化し、内部構造を統一 (initialExistingItemsに依存)
  const normalizedExistingItems: NormalizedItems<T> = useMemo(() => {
    // initialExistingItems のキーを抽出 (TypeScriptの制約上、アサーションが必要)
    const keys = Object.keys(initialExistingItems) as (keyof T)[];

    return keys.reduce((acc, key) => {
      // 全ての既存アイテムを ComboboxItem[] に変換・正規化
      acc[key] = normalizeToComboboxItems(initialExistingItems[key]);
      return acc;
    }, {} as NormalizedItems<T>);
  }, [initialExistingItems]); // propsが変わったときのみ再計算

  // 3. フィルタリング用のSetをメモ化 (パフォーマンス最適化)
  const filterLabelSet = useMemo(
    () => new Set(filterLabels.map((l) => l.toLowerCase().trim())),
    [filterLabels]
  );
  const filterValueSet = useMemo(() => new Set(filterValues), [filterValues]);

  /**
   * 新しいアイテムを作成リストに追加します。
   */
  const onCreate = useCallback(
    (fieldKey: keyof T, newOption: string | { value?: string; label: string }) => {
      const label = typeof newOption === 'string' ? newOption : newOption.label;
      const normalizedLabel = label.toLowerCase().trim();

      // ラベルによるフィルタリング
      if (filterLabelSet.has(normalizedLabel)) return;

      const newItemValue = getValue(fieldKey, label);
      // Valueによるフィルタリング
      if (filterValueSet.has(newItemValue)) return;

      setCreations((prevCreations) => {
        const currentItems: CreatableItems = (prevCreations[fieldKey] as CreatableItems) || [];
        const existing: ComboboxItem[] = normalizedExistingItems[fieldKey] || [];

        if (currentItems.some((item) => item.value === newItemValue)) {
          return prevCreations;
        }

        // 既存 + 新規作成アイテム全体で重複チェック (ラベルベース)
        const allItemsToCheck = [...existing, ...currentItems];

        const isDuplicate = allItemsToCheck.some((item) => {
          return item.label.toLowerCase().trim() === normalizedLabel;
        });

        if (isDuplicate) return prevCreations;

        // 新しいアイテムをリストの先頭に追加
        const newItem: ComboboxItem = { value: newItemValue, label };

        return {
          ...prevCreations,
          [fieldKey]: [newItem, ...currentItems],
        } as Partial<Record<keyof T, CreatableItems>>;
      });
    },
    // normalizedExistingItemsはinitialExistingItemsが変わらない限り安定
    [getValue, filterLabelSet, filterValueSet, normalizedExistingItems]
  );

  /**
   * 作成リストから指定されたアイテムを削除（キャンセル）します。
   */
  const onCancelCreate = useCallback((fieldKey: keyof T, value: string) => {
    // setCreations関数自体は安定しているため、依存配列は空でOK
    setCreations((prevCreations) => {
      const currentItems: CreatableItems = (prevCreations[fieldKey] as CreatableItems) || [];
      const updatedItems = currentItems.filter((item) => item.value !== value);

      // アイテムが空になった場合、フィールドキー自体を削除してオブジェクトをクリーンに保つ
      if (updatedItems.length === 0) {
        const { [fieldKey]: _, ...rest } = prevCreations;
        return rest as Partial<Record<keyof T, CreatableItems>>;
      }

      return {
        ...prevCreations,
        [fieldKey]: updatedItems,
      } as Partial<Record<keyof T, CreatableItems>>;
    });
  }, []); // setCreations は安定した参照を持つため、依存配列は空

  /**
   * 新規作成アイテムと既存アイテムを統合したリストを計算して返します。
   */
  const combinedItems = useMemo((): NormalizedItems<T> => {
    // 既存と新規作成の全てのフィールドキーを取得
    const allKeys = new Set([
      ...Object.keys(normalizedExistingItems),
      ...Object.keys(creations),
    ]) as Set<keyof T>;

    const result: Partial<NormalizedItems<T>> = {};

    for (const fieldKey of allKeys) {
      const existing: ComboboxItem[] = normalizedExistingItems[fieldKey] || [];
      const newCreations: CreatableItems = (creations[fieldKey] as CreatableItems) || [];

      // 新規作成アイテムを常にリストの先頭に配置
      result[fieldKey] = [...newCreations, ...existing];
    }

    // すべてのキーを網羅し、値が ComboboxItem[] であるため、NormalizedItems<T> にアサーション
    return result as NormalizedItems<T>;
  }, [creations, normalizedExistingItems]); // creations または既存アイテムが変更されたら再計算

  return {
    creations,
    onCreate,
    onCancelCreate,
    combinedItems,
  };
}
