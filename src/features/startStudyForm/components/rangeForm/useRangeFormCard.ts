import { ReactNode, useCallback } from 'react';
import { UseFormReturnType } from '@mantine/form';
import { RangeFormData } from '../../shared/form/form-types';
import {
  RangeData,
  RangeFormCardManagerPropsBase,
  RangeWithId,
} from '../../shared/range/range-form-types';
import { checkHasConflict, handleResolveConflict } from '../../shared/range/range-utils';

/**
 * RangeFormData[]型のフォームデータを管理するためのカスタムフック。
 * 各カードのプロパティ（値、エラー、操作）および配列全体の操作機能を提供します。
 *
 * @param form - MantineのuseFormから得られたフォームオブジェクト。
 * @param fieldKey - フォームデータ内でRangeFormData[]が格納されているキー。
 */
export const useRangeFormCardsManager = <TKey extends string>(
  form: UseFormReturnType<Record<TKey, RangeFormData[]>>,
  fieldKey: TKey
) => {
  // フォームの値とエラーを安全に取得（fieldKeyの存在をチェック）
  const cardsArray = (form.values as Record<TKey, any>)[fieldKey] as RangeFormData[] | undefined;
  const allCardErrors = (form.errors as Record<TKey, any>)[fieldKey] as
    | Partial<RangeFormData>[]
    | undefined;

  /**
   * 指定されたインデックスのカードのプロパティと操作関数を返します。
   * @param index - RangeFormData配列内のカードのインデックス。
   * @returns RangeFormCardManagerPropsBase カード表示に必要なプロパティ。
   */
  const getCardProps = useCallback(
    (index: number): RangeFormCardManagerPropsBase => {
      const key = String(index);

      // Mantine Formのフィールドパス
      const unitNamePath = `${fieldKey}.${key}.unitName`;
      const categoryNamePath = `${fieldKey}.${key}.categoryName`;
      const rangesPath = `${fieldKey}.${key}.ranges`;

      // --- フォームデータの値とエラーの取得 ---
      const currentCard = cardsArray?.[index];
      const unitValue = currentCard?.unitName || '';
      const categoryValue = currentCard?.categoryName || '';
      const ranges = currentCard?.ranges || [];

      // エラーの取得と型キャスト
      const currentCardErrors = allCardErrors?.[index] as Partial<RangeFormData> | undefined;

      const unitError = currentCardErrors?.unitName as ReactNode | undefined;
      const categoryError = currentCardErrors?.categoryName as ReactNode | undefined;

      // --- ranges配列の操作 ---

      /** 範囲を削除します。 */
      const onRemoveRange = (range: RangeWithId) => {
        const indexToRemove = ranges.findIndex((r) => r.id === range.id);
        if (indexToRemove !== -1) {
          form.removeListItem(rangesPath, indexToRemove);
        }
      };

      /** 新しい範囲を追加します。 */
      const onAddRange = (newRange: RangeData) => {
        const newId = ranges.length > 0 ? Math.max(...ranges.map((r) => r.id)) + 1 : 1;
        const rangeWithId: RangeWithId = { ...newRange, id: newId };
        form.insertListItem(rangesPath, rangeWithId);
      };

      // --- 衝突チェックと解決 ---
      const hasConflict = checkHasConflict(ranges);

      /** 範囲の衝突を解決します。 */
      const onResolveConflict = () => {
        // IDを振り直して新しいranges配列を生成
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
    [form, fieldKey, cardsArray, allCardErrors]
  );

  // --- 配列全体の操作関数 ---

  /**
   * 配列全体に空の新しいカードを追加します。
   */
  const addCard = useCallback(() => {
    form.insertListItem(fieldKey, { unitName: '', categoryName: '', ranges: [] });
  }, [form, fieldKey]);

  /**
   * 指定されたインデックスのカード全体をフォームから削除します。
   * @param index - 削除するカードのインデックス。
   */
  const removeCard = useCallback(
    (index: number) => {
      if (!cardsArray) return;
      form.removeListItem(fieldKey, index);
    },
    [form, fieldKey, cardsArray]
  );

  /**
   * 全カードのプロパティ配列を返します。
   * 配列が存在しない場合は空配列を返します。
   */
  const getAllCardProps = useCallback((): RangeFormCardManagerPropsBase[] => {
    if (!cardsArray || !Array.isArray(cardsArray)) {
      return [];
    }
    return cardsArray.map((_, index) => getCardProps(index));
  }, [cardsArray, getCardProps]);

  return {
    getCardProps,
    addCard,
    removeCard,
    getAllCardProps,
  };
};
