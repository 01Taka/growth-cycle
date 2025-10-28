import React, { useCallback, useMemo, useState } from 'react';
import { Button, Stack } from '@mantine/core';
import { sharedStyle } from '@/shared/styles/shared-styles';
import { IndividualRangeFormValue, OnFinishEditModeArgs } from '../shared-types';
// ----------------------------------------------------
import { IndividualRangeFormItem } from './IndividualRangeFormItem';
import { useIndividualRangeFormItems } from './useIndividualRangeFormItems';

interface IndividualRangeFormProps {}

// ----------------------------------------------------
// ✅ 親コンポーネントのメモ化
// ----------------------------------------------------
const IndividualRangeForm: React.FC<IndividualRangeFormProps> = React.memo(() => {
  const [maxProblemNumber, setMaxProblemNumber] = useState(128);

  // useIndividualRangeFormItems は getItemProps が安定するように最適化済み
  const { formItemValues, getItemProps, appendEmptyItem } = useIndividualRangeFormItems();
  const [editModeIndex, setEditModeIndex] = useState<number | null>(null);

  // 変更頻度が低いオブジェクトはメモ化（useMemoは不要だが、定数として扱う）
  const sharedSetting = useMemo(
    () => ({
      units: ['物質の成分と構成元素', 'unitB'],
      categories: ['基本問題', 'cateB'],
    }),
    []
  );

  // ハンドラーのメモ化
  const handelCreateNewItem = useCallback((args: OnFinishEditModeArgs) => {
    // 実際にアイテムを作成するロジック
    console.log(args);
  }, []); // 依存配列が空なので、この関数は常に同じ参照を保つ

  const handleFinishEditMode = useCallback(
    (index: number, args: OnFinishEditModeArgs) => {
      handelCreateNewItem(args);
      // setEditModeIndex の関数更新フォームを使用して、index のクロージャを避ける
      setEditModeIndex((prev) => (prev === index ? null : prev));
    },
    [handelCreateNewItem] // handelCreateNewItem は useCallback で安定
  );

  const handleStartEditMode = useCallback((index: number) => {
    setEditModeIndex(index);
  }, []);

  const handleExpansionMaxProblemNumber = useCallback(() => {
    setMaxProblemNumber((prev) => Math.min(prev * 2, 2 ** 20));
  }, []);

  return (
    <Stack>
      <Stack>
        {formItemValues.map((value, index) => {
          const isNewUnit = !!value.unit && !sharedSetting.units.includes(value.unit);
          const isNewCategory =
            !!value.category && !sharedSetting.categories.includes(value.category);

          const itemProps = getItemProps(index);

          return (
            <IndividualRangeFormItem
              key={value.id}
              isEditMode={isNewUnit || isNewCategory || index === editModeIndex}
              maxProblemNumber={maxProblemNumber}
              onStartEditMode={() => handleStartEditMode(index)}
              onFinishEditMode={(args) => handleFinishEditMode(index, args)}
              onExpansionMaxProblemNumber={handleExpansionMaxProblemNumber}
              {...sharedSetting}
              {...itemProps}
              value={value}
              isNewUnit={isNewUnit}
              isNewCategory={isNewCategory}
            />
          );
        })}
      </Stack>
      <Button style={{ ...sharedStyle.button }} onClick={appendEmptyItem}>
        新しい問題を追加
      </Button>
    </Stack>
  );
});

export { IndividualRangeForm };
