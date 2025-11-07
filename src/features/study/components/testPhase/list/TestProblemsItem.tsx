import React from 'react';
import { Flex, Grid, rem, Text } from '@mantine/core';
import { useSelfEvaluationColors } from '@/features/study/hooks/useSelfEvaluationColors';
import { LearningProblemBase } from '@/features/study/types/problem-types';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';

type ResponsiveSpan =
  | {
      base?: number;
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    }
  | number;

interface TestProblemsItemProps {
  problem: LearningProblemBase;
  elapsedTimeMs: number | null;
  selfEvaluation: TestSelfEvaluation;
  isCurrent: boolean;
  // Gridの列幅を受け取る型をResponsiveSpanに変更
  colSizes: {
    index: ResponsiveSpan;
    unit: ResponsiveSpan;
    category: ResponsiveSpan;
    number: ResponsiveSpan;
    time: ResponsiveSpan;
    eval: ResponsiveSpan;
  };
  theme: SubjectColorMap;
  onClick: () => void;
}

// TestProblemsItemをGridの1行として定義
export const TestProblemsItem: React.FC<TestProblemsItemProps> = ({
  problem,
  selfEvaluation,
  elapsedTimeMs,
  isCurrent,
  colSizes,
  theme,
  onClick,
}) => {
  const { unitName, categoryName, problemNumber, problemIndex } = problem;
  const getColor = useSelfEvaluationColors();
  const selfEvaluationTheme = getColor(selfEvaluation);
  const timeText = elapsedTimeMs ? `${Math.floor(elapsedTimeMs / 60000)}m` : '--';

  return (
    // Gridコンテナ: 1行を表現
    <Grid
      gutter="xs"
      align="center"
      p="xs"
      style={{
        color: theme.text,
        borderBottom: `1px solid ${theme.border}`,
        backgroundColor: isCurrent ? theme.bgCard : 'white', // 例として青みがかった薄い色
        fontWeight: isCurrent ? 'bold' : 'normal',
      }}
      onClick={onClick}
    >
      {/* 1. 問題インデックス (No.) - spanにオブジェクトを渡す */}
      <Grid.Col span={colSizes.index}>
        <Text size="sm">{problemIndex}</Text>
      </Grid.Col>

      {/* 2. ユニット名 */}
      <Grid.Col span={colSizes.unit}>
        <Text size="sm" truncate="end">
          {unitName}
        </Text>
      </Grid.Col>

      {/* 3. カテゴリー名 */}
      <Grid.Col span={colSizes.category}>
        <Text size="sm" truncate="end">
          {categoryName}
        </Text>
      </Grid.Col>

      {/* 4. 問題番号 */}
      <Grid.Col span={colSizes.number} ta="center">
        <Text size="sm">{problemNumber}</Text>
      </Grid.Col>

      {/* 5. 所要時間 - timeMsの表示を分:秒形式に戻します */}
      <Grid.Col span={colSizes.time} ta="center">
        <Text size="sm">{timeText}</Text>
      </Grid.Col>

      {/* 6. 自己評価 */}
      <Grid.Col span={colSizes.eval}>
        <Flex miw={rem(84)} w={'100%'} justify="center">
          <Text
            size="sm"
            style={{
              backgroundColor: selfEvaluationTheme.background,
              borderRadius: 15,
              width: '100%',
              margin: '0px 8px',
              textAlign: 'center',
              // モバイルでの評価の可読性を上げるため、paddingを追加
              padding: '2px 0',
              whiteSpace: 'nowrap',
            }}
          >
            {selfEvaluationTheme.label}
          </Text>
        </Flex>
      </Grid.Col>
    </Grid>
  );
};
