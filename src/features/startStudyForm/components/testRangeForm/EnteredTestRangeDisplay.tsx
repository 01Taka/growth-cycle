import React, { useMemo } from 'react';
import { rem, Stack } from '@mantine/core';
import { IndividualProblemRange } from '../../shared/shared-test-range-types';
import { EnteredTestRangeDisplayItem } from './EnteredTestRangeDisplayItem';
import { UnitBoundarySeparator } from './UnitBoundarySeparator';

export interface EnteredTestRangeDisplayItemProps {
  problem: IndividualProblemRange;
  prevUnit?: string;
  colorIndex: number; // 交互に適用する色のインデックス (0 or 1)
}

interface EnteredTestRangeDisplayProps {
  filledProblems: IndividualProblemRange[];
}

export const EnteredTestRangeDisplay: React.FC<EnteredTestRangeDisplayProps> = ({
  filledProblems,
}) => {
  // ユニットの区切りと色のインデックスを計算する
  const itemsWithColorInfo = useMemo(() => {
    let currentColorIndex = 0;

    return filledProblems.map((problem, index) => {
      const prevProblem = filledProblems[index - 1];
      const prevUnit = prevProblem?.unit;

      const isUnitBoundary = index === 0 || problem.unit !== prevUnit;

      if (isUnitBoundary && index !== 0) {
        // ユニットが切り替わった場合、色を反転させる
        currentColorIndex = 1 - currentColorIndex;
      }

      return {
        problem,
        prevUnit,
        isUnitBoundary,
        colorIndex: currentColorIndex,
      };
    });
  }, [filledProblems]);

  return (
    <Stack gap="xs" mah={rem(500)} style={{ overflowY: 'auto' }}>
      {itemsWithColorInfo.map((item, index) => (
        <React.Fragment key={item.problem.id}>
          {/* 💡 ユニットが切り替わった場合に区切りコンポーネントを挿入 */}
          {item.isUnitBoundary && (
            <UnitBoundarySeparator unit={item.problem.unit} isFirst={index === 0} />
          )}

          <EnteredTestRangeDisplayItem
            problem={item.problem}
            prevUnit={item.prevUnit}
            colorIndex={item.colorIndex}
          />
        </React.Fragment>
      ))}
    </Stack>
  );
};
