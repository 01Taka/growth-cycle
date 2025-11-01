import React, { useMemo, useState } from 'react';
import { Modal } from '@mantine/core';
import { useIndividualRangeFormItems } from '../../hooks/useIndividualRangeFormItems';
import { IndividualProblemRange, OnFinishEditModeArgs } from '../../shared/shared-test-range-types';
import { useTheme } from '../../shared/useTheme';
import { StartStudyFormSelectButton } from '../shared/StartStudyFormSelectButton';
import { EnteredTestRangeDisplay } from './EnteredTestRangeDisplay';
import { IndividualRangeForm } from './individualRangeForm/IndividualRangeForm';

interface TestRangeFormProps {}

function smallestPowerOfTwo(n: number): number {
  if (n <= 0) {
    return 1;
  }
  const exponent = Math.ceil(Math.log2(n));
  return Math.pow(2, exponent);
}

export const TestRangeForm: React.FC<TestRangeFormProps> = ({}) => {
  const [opened, setOpened] = useState(false);
  const formItemsHook = useIndividualRangeFormItems();

  // 2. sharedSetting の管理を親で行う
  const sharedSetting = React.useMemo(
    () => ({
      units: ['物質の成分と構成元素', 'unitB'],
      categories: ['基本問題', 'cateB'],
    }),
    []
  );

  // 3. onCreateNewItem (旧 handelCreateNewItem) のロジックを親で行う
  const handleCreateNewItem = React.useCallback((args: OnFinishEditModeArgs) => {
    console.log('親コンポーネントで新しいアイテムを作成:', args);
    // ここで API コールやグローバルな状態更新を行う
  }, []);
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
