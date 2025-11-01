import { ComboboxItem } from '@mantine/core';

export type ItemList = ComboboxItem[] | string[];
export type CreatableItems = ComboboxItem[];

// 内部処理で利用する、全てComboboxItem[]に正規化された型
export type NormalizedItems<T extends Record<string, ItemList>> = Record<keyof T, ComboboxItem[]>;

/**
 * 新しいアイテムのvalueを生成するための関数。
 */
export type GetValueFn<T extends string | number | symbol> = (fieldKey: T, label: string) => string;

export type Creations<T extends Record<string, any>> = Partial<Record<keyof T, CreatableItems>>;
