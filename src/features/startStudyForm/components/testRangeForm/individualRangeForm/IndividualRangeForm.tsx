import React, { useCallback, useState } from 'react';
import { Button, rem, Stack, Text } from '@mantine/core';
import { sharedStyle } from '@/shared/styles/shared-styles';
import {
  IndividualRangeFormHandlers,
  IndividualRangeFormValue,
  OnFinishEditModeArgs,
} from '../../../shared/components-types/shared-test-range-types';
// ----------------------------------------------------
import { IndividualRangeFormItem } from './IndividualRangeFormItem';

interface FormItemHandlersProps {
  value: IndividualRangeFormValue;
  handlers: IndividualRangeFormHandlers;
}

// ----------------------------------------------------
// ✅ Propsの定義を外部依存性を受け取るように拡張
// ----------------------------------------------------
export interface IndividualRangeFormProps {
  formItemValues: IndividualRangeFormValue[];
  isLastItemFilled: boolean;
  getItemProps: (index: number) => FormItemHandlersProps;
  appendEmptyItem: () => void;

  sharedSetting: {
    units: string[];
    categories: string[];
  };

  onCreateNewItem: (args: OnFinishEditModeArgs) => void;

  initialMaxProblemNumber: number;
}

const PROBLEM_NUMBER_LIMIT = 2 ** 20;

// ----------------------------------------------------
// ✅ 親コンポーネントのメモ化
// ----------------------------------------------------
export const IndividualRangeForm: React.FC<IndividualRangeFormProps> = React.memo(
  ({
    formItemValues,
    isLastItemFilled,
    getItemProps,
    appendEmptyItem,
    sharedSetting,
    onCreateNewItem,
    initialMaxProblemNumber,
  }) => {
    const [maxProblemNumber, setMaxProblemNumber] = useState(initialMaxProblemNumber);

    const [editModeIndex, setEditModeIndex] = useState<number | null>(null);

    // -------------------------------------------------
    // ハンドラーのメモ化 (Propsの関数をラップ)
    // -------------------------------------------------
    const handleFinishEditMode = useCallback(
      (index: number, args: OnFinishEditModeArgs) => {
        onCreateNewItem(args);
        setEditModeIndex((prev) => (prev === index ? null : prev));
      },
      [onCreateNewItem]
    );

    const handleStartEditMode = useCallback((index: number) => {
      setEditModeIndex(index);
    }, []);

    const handleExpansionMaxProblemNumber = useCallback(() => {
      setMaxProblemNumber((prev) => Math.min(prev * 2, PROBLEM_NUMBER_LIMIT));
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
        <Button
          disabled={!isLastItemFilled}
          style={{ ...(isLastItemFilled ? sharedStyle.button : sharedStyle.disabledButton) }}
          onClick={appendEmptyItem}
        >
          新しい問題を追加
        </Button>
        {!isLastItemFilled && (
          <Text style={{ color: 'gray', fontSize: rem(15) }}>
            ユニットとカテゴリー埋めてください
          </Text>
        )}
      </Stack>
    );
  }
);
