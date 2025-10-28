// IndividualRangeFormItem.tsx

import React, { useMemo } from 'react';
import { Box } from '@mantine/core';
import {
  IndividualRangeFormHandlers,
  IndividualRangeFormValue,
  OnFinishEditModeArgs,
} from '../shared-types';
import { DisplayModeView } from './DisplayModeView';
import { EditModeView } from './EditModeView';

/**
 * IndividualRangeFormItem コンポーネントのプロパティ
 */
interface IndividualRangeFormItemProps {
  isEditMode: boolean;
  maxProblemNumber: number;
  units: string[];
  categories: string[];
  isNewUnit: boolean;
  isNewCategory: boolean;
  onExpansionMaxProblemNumber: () => void;
  onStartEditMode: () => void;
  onFinishEditMode: (args: OnFinishEditModeArgs) => void;
  value: IndividualRangeFormValue;
  handlers: IndividualRangeFormHandlers;
}

export const IndividualRangeFormItem: React.FC<IndividualRangeFormItemProps> = React.memo(
  (props) => {
    const {
      isEditMode,
      handlers,
      maxProblemNumber,
      value,
      onStartEditMode,
      onExpansionMaxProblemNumber,
    } = props;

    // HandlersをEditModeViewに渡すためのエイリアス
    const editModeHandlers = useMemo(
      () => ({
        onUnitChange: handlers.onUnitChange,
        onUnitSubmit: handlers.onUnitSubmit,
        onCategoryChange: handlers.onCategoryChange,
        onCategorySubmit: handlers.onCategorySubmit,
        onChangeProblemNumber: handlers.onChangeProblemNumber,
        onRemove: handlers.onRemove,
      }),
      [handlers]
    );

    return (
      <Box>
        {isEditMode ? (
          <EditModeView {...props} {...editModeHandlers} />
        ) : (
          <DisplayModeView
            maxProblemNumber={maxProblemNumber}
            value={value}
            onStartEditMode={onStartEditMode}
            onChangeProblemNumber={handlers.onChangeProblemNumber}
            onExpansionMaxProblemNumber={onExpansionMaxProblemNumber}
            onRemove={handlers.onRemove}
          />
        )}
      </Box>
    );
  }
);
