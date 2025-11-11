import React, { useMemo, useState } from 'react';
import { Modal, Stack } from '@mantine/core';
import {
  IndividualProblemRange,
  OnFinishEditModeArgs,
} from '../../shared/components-types/shared-test-range-types';
import { StartStudyFormSelectButton } from '../../shared/StartStudyFormSelectButton';
import { UseIndividualRangeFormItemsReturn } from '../../shared/useIndividualRangeFormItems';
import { useStudyFormTheme } from '../../shared/useStudyFormTheme';
import { EnteredTestRangeDisplay } from './EnteredTestRangeDisplay';
import { IndividualRangeForm } from './individualRangeForm/IndividualRangeForm';

interface TestRangeFormProps {
  formItemsHook: UseIndividualRangeFormItemsReturn;
  units: string[];
  categories: string[];
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
  formItemsHook,
  units = [],
  categories = [],
  onCreateNewUnit,
  onCreateNewCategories,
}) => {
  const [opened, setOpened] = useState(false);

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
  const getTheme = useStudyFormTheme();

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

  return (
    <Stack w={'100%'} align="center">
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
    </Stack>
  );
};
