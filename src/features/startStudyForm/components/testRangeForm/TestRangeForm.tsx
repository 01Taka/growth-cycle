import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from '@mantine/core';
import { useIndividualRangeFormItems } from '../../hooks/useIndividualRangeFormItems';
import {
  IndividualProblemRange,
  IndividualRangeFormValue,
  OnFinishEditModeArgs,
} from '../../shared/shared-test-range-types';
import { useTheme } from '../../shared/useTheme';
import { StartStudyFormSelectButton } from '../shared/StartStudyFormSelectButton';
import { EnteredTestRangeDisplay } from './EnteredTestRangeDisplay';
import { IndividualRangeForm } from './individualRangeForm/IndividualRangeForm';

interface TestRangeFormProps {
  units: string[];
  categories: string[];
  onChange: (value: IndividualRangeFormValue[]) => void;
  onCreateNewUnit: (value: string) => void;
  onCreateNewCategories: (category: string) => void;
}

function smallestPowerOfTwo(n: number): number {
  if (n <= 0) {
    return 1;
  }
  const exponent = Math.ceil(Math.log2(n));
  return Math.pow(2, exponent);
}

export const TestRangeForm: React.FC<TestRangeFormProps> = ({
  units,
  categories,
  onChange,
  onCreateNewUnit,
  onCreateNewCategories,
}) => {
  const [opened, setOpened] = useState(false);
  const formItemsHook = useIndividualRangeFormItems();

  // 2. sharedSetting の管理を親で行う
  const sharedSetting = React.useMemo(
    () => ({
      units: units,
      categories: categories,
    }),
    [units, categories]
  );

  // 3. onCreateNewItem (旧 handelCreateNewItem) のロジックを親で行う
  const handleCreateNewItem = React.useCallback(
    (args: OnFinishEditModeArgs) => {
      if (args.isNewUnit && args.value.unit) {
        onCreateNewUnit(args.value.unit);
      }
      if (args.isNewCategory && args.value.category) {
        onCreateNewCategories(args.value.category);
      }
    },
    [onCreateNewUnit, onCreateNewCategories]
  );
  const getTheme = useTheme();

  const filledProblems = useMemo(
    () =>
      formItemsHook.formItemValues
        .filter((value) => !!value.unit && !!value.category)
        .map((problem, index) => ({
          ...problem,
          problemIndex: index + 1,
        })) as IndividualProblemRange[],
    [formItemsHook.formItemValues]
  );

  useEffect(() => {
    onChange(formItemsHook.formItemValues);
  }, [formItemsHook.formItemValues, onChange]);

  return (
    <>
      <StartStudyFormSelectButton
        label="テスト範囲を入力"
        theme={getTheme('yellow')}
        explanations={['今回のゴールを決めてから勉強に取り組もう！']}
        onClick={() => setOpened(true)}
        style={{ width: '70%' }}
      />
      <EnteredTestRangeDisplay filledProblems={filledProblems} />
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <IndividualRangeForm
          {...formItemsHook}
          sharedSetting={sharedSetting}
          onCreateNewItem={handleCreateNewItem}
          initialMaxProblemNumber={smallestPowerOfTwo(128)}
        />
      </Modal>
    </>
  );
};
