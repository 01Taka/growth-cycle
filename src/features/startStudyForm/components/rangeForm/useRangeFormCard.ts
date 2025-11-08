import { ReactNode, useCallback } from 'react';
import { UseFormReturnType } from '@mantine/form';
import {
  RangeData,
  RangeFormCardManagerPropsBase,
  RangeFormData,
  RangeWithId,
} from '../../types/range-form-types';
import { checkHasConflict, handleResolveConflict } from './range-utils';

/**
 * 複数のRangeFormCardPropsを管理するためのカスタムフック。
 * Mantine FormのFormData[]型と連携し、カード全体および個別のカード操作を提供します。
 *
 * @param form - MantineのuseFormから得られたformオブジェクト。FormData[]型を管理している必要があります。
 * @returns {getCardProps, addCard, removeCard, getAllCardProps}
 */
export const useRangeFormCardsManager = <TKey extends string>(
  form: UseFormReturnType<Record<TKey, RangeFormData[]>>,
  fieldKey: TKey
) => {
  /**
   * 指定されたインデックスのカードのRangeFormCardManagerPropsを返します。
   * これは内部関数として定義し、再利用のためにメモ化します。
   * @param index - RangeFormData[]配列内の特定のFormDataオブジェクトのインデックス。
   * @returns RangeFormCardManagerPropsBase
   */
  const getCardProps = useCallback(
    (index: number): RangeFormCardManagerPropsBase => {
      const key = String(index);
      // Mantine Formでのフィールドパス
      const unitNamePath = `${fieldKey}.${key}.unitName`;
      const categoryNamePath = `${fieldKey}.${key}.categoryName`;
      const rangesPath = `${fieldKey}.${key}.ranges`;

      // --- フォームデータの値とエラーの取得 ---
      const currentCard = form.values[fieldKey][index];
      const unitValue = currentCard?.unitName || '';
      const categoryValue = currentCard?.categoryName || '';
      const ranges = currentCard?.ranges || [];

      // エラーの型アサーションを整理
      const errors = form.errors;
      const currentCardErrors = errors[index] as Partial<RangeFormData> | undefined;

      const unitError = currentCardErrors?.unitName as ReactNode | undefined;
      const categoryError = currentCardErrors?.categoryName as ReactNode | undefined;

      // --- ranges配列の操作 ---

      const onRemoveRange = (range: RangeWithId) => {
        const indexToRemove = ranges.findIndex((r) => r.id === range.id);
        if (indexToRemove !== -1) {
          form.removeListItem(rangesPath, indexToRemove); // Mantineのヘルパーを使用しない
        }
      };

      const onAddRange = (newRange: RangeData) => {
        const newId = ranges.length > 0 ? Math.max(...ranges.map((r) => r.id)) + 1 : 1;
        const rangeWithId: RangeWithId = { ...newRange, id: newId };
        form.insertListItem(rangesPath, rangeWithId);
      };

      // --- hasConflict と onResolveConflict のモック ---
      const hasConflict = checkHasConflict(ranges);

      const onResolveConflict = () => {
        const newRanges: RangeWithId[] = handleResolveConflict(ranges).map((range, index) => ({
          ...range,
          id: index,
        }));
        (form.setFieldValue as any)(rangesPath, newRanges);
      };

      return {
        unitForm: {
          value: unitValue,
          error: unitError,
          onChange: (value) => {
            console.log(value);

            (form.setFieldValue as any)(unitNamePath, value);
          },
        },
        categoryForm: {
          value: categoryValue,
          error: categoryError,
          onChange: (value) => (form.setFieldValue as any)(categoryNamePath, value),
        },
        hasConflict,
        ranges,
        onRemoveRange,
        onAddRange,
        onResolveConflict,
      };
    },
    [form, fieldKey]
  );

  // --- 配列全体の操作関数 ---

  /**
   * 配列全体に新しいカードを追加します。
   */
  const addCard = useCallback(() => {
    form.insertListItem(fieldKey, { unitName: '', categoryName: '', ranges: [] });
  }, [form, fieldKey]);

  /**
   * 指定されたインデックスのカード全体をフォームから取り除きます。
   * @param index - 削除するカードのインデックス。
   */
  const removeCard = useCallback(
    (index: number) => {
      // Mantine FormのremoveListItemヘルパーを使用して、配列の要素を削除
      form.removeListItem(fieldKey, index);
    },
    [form, fieldKey]
  );

  /**
   * 全カードのプロパティ配列を返します。
   * Reactのレンダリングループ内でmap処理を行う代わりに、この関数を呼び出すことができます。
   * ただし、この関数を呼び出すと、配列の長さ分だけgetCardPropsが実行される点に注意してください。
   */
  const getAllCardProps = useCallback((): RangeFormCardManagerPropsBase[] => {
    return form.values[fieldKey].map((_, index) => getCardProps(index));
  }, [form.values, fieldKey, getCardProps]); // form.valuesの変更時に再計算

  return {
    getCardProps,
    addCard,
    removeCard,
    getAllCardProps,
  };
};
