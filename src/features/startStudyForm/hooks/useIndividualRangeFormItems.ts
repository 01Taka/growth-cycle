// useIndividualRangeFormItems.ts

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'; // 👈 useRef, useEffect をインポート

// 既存の型定義をインポート
import {
  IndividualRangeFormHandlers,
  IndividualRangeFormValue,
} from '../shared/shared-test-range-types';

// ---------------------------
// 1. 状態管理の型定義
// ---------------------------
export type FormItemState = IndividualRangeFormValue[];

export interface UseIndividualRangeFormItemsReturn {
  formItemValues: FormItemState;
  isLastItemFilled: boolean;
  getItemProps: (index: number) => {
    value: IndividualRangeFormValue;
    handlers: IndividualRangeFormHandlers;
  };
  setFormItemValues: React.Dispatch<React.SetStateAction<FormItemState>>;
  appendEmptyItem: () => void;
}

const createEmptyFormItem = (
  id: number,
  defaultValue: Partial<IndividualRangeFormValue> = {}
): IndividualRangeFormValue => ({
  id,
  unit: defaultValue.unit ?? '',
  category: defaultValue.category ?? '',
  problemNumber: defaultValue.problemNumber ?? 1,
});

// ---------------------------
// 2. カスタムフックの実装 (useRefを導入)
// ---------------------------

export const useIndividualRangeFormItems = (
  initialValues: FormItemState = [createEmptyFormItem(0)]
): UseIndividualRangeFormItemsReturn => {
  const idNumber = useRef(1);

  const [formItemValues, setFormItemValues] = useState<FormItemState>(initialValues);

  const formItemValuesRef = useRef(formItemValues);

  useEffect(() => {
    formItemValuesRef.current = formItemValues;
  }, [formItemValues]);

  const isLastItemFilled = useMemo(() => {
    if (formItemValues.length === 0) {
      return false;
    }
    const lastItem = formItemValues[formItemValues.length - 1];

    return !!lastItem.unit && !!lastItem.category;
  }, [formItemValues]);

  // -------------------------
  // 補助関数: 新しい空の要素を追加
  // -------------------------
  const appendEmptyItem = useCallback(() => {
    idNumber.current += 1;
    const lastItem = formItemValuesRef.current[formItemValuesRef.current.length - 1];
    setFormItemValues((prevValues) => [
      ...prevValues,
      createEmptyFormItem(idNumber.current, {
        ...lastItem,
        problemNumber: lastItem.problemNumber ? lastItem.problemNumber + 1 : undefined,
      }),
    ]);
  }, []);

  // -------------------------
  // 補助関数: 要素の値を更新
  // -------------------------
  const updateItemValue = useCallback(
    (index: number, key: keyof IndividualRangeFormValue, newValue: any) => {
      setFormItemValues((prevValues) => {
        const newValues = [...prevValues];
        if (!newValues[index]) {
          console.warn(`Index ${index} is out of bounds for form item values.`);
          return prevValues;
        }

        const isLastItem = index === newValues.length - 1;

        // 値の更新
        newValues[index] = {
          ...newValues[index],
          [key]: newValue,
        };

        // 自動追加ロジック:
        if (isLastItem && newValues[index].unit && newValues[index].category) {
          idNumber.current += 1;
          return [
            ...newValues,
            createEmptyFormItem(idNumber.current, {
              unit: newValues[index].unit,
              category: newValues[index].category,
              problemNumber: newValues[index].problemNumber
                ? newValues[index].problemNumber + 1
                : undefined,
            }),
          ];
        }

        return newValues;
      });
    },
    []
  );

  // -------------------------
  // 補助関数: 要素の削除
  // -------------------------
  const removeItem = useCallback((index: number) => {
    setFormItemValues((prevValues) => {
      if (prevValues.length === 1) {
        idNumber.current += 1;
        return [createEmptyFormItem(idNumber.current)];
      }
      return prevValues.filter((_, i) => i !== index);
    });
  }, []);

  // -------------------------
  // getItemProps のロジック (依存配列を変更)
  // -------------------------
  const getItemProps = useCallback(
    (index: number) => {
      // Handlersの生成
      const handlers: IndividualRangeFormHandlers & { onRemove: () => void } = {
        onUnitChange: (value: string) => updateItemValue(index, 'unit', value),
        onUnitSubmit: (value: string) => updateItemValue(index, 'unit', value),
        onCategoryChange: (value: string) => updateItemValue(index, 'category', value),
        onCategorySubmit: (value: string) => updateItemValue(index, 'category', value),
        onChangeProblemNumber: (value: number) => updateItemValue(index, 'problemNumber', value),
        onRemove: () => removeItem(index),
      };

      return {
        // 💡 formItemValuesRef.current から値を取得する
        value: formItemValuesRef.current[index] || createEmptyFormItem(0),
        handlers: handlers,
      };
    },
    [updateItemValue, removeItem] // 👈 formItemValues への依存を解消！
  );

  return useMemo(
    () => ({
      formItemValues,
      isLastItemFilled,
      setFormItemValues,
      getItemProps,
      appendEmptyItem,
    }),
    [formItemValues, getItemProps]
  );
};
