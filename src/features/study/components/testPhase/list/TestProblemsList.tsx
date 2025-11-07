import React from 'react';
import { Box, Grid, Stack, Text } from '@mantine/core';
import { LearningProblemBase } from '@/features/study/types/problem-types';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { TestProblemsItem } from './TestProblemsItem';

interface TestProblemsListProps {
  problems: LearningProblemBase[];
  elapsedTimeMap: Record<number, number>;
  selfEvaluationMap: Record<number, TestSelfEvaluation>;
  currentProblemIndex: number;
  theme: SubjectColorMap;
  onClick: (problem: LearningProblemBase) => void;
}

export const TestProblemsList: React.FC<TestProblemsListProps> = ({
  problems,
  elapsedTimeMap,
  selfEvaluationMap,
  currentProblemIndex,
  theme,
  onClick,
}) => {
  // Gridの列幅を定義します（画面幅に応じて変わるレスポンシブ対応）
  const colSizes = {
    // base (モバイル): 合計12列
    // md (デスクトップ/タブレット): 合計12列
    index: { base: 1, md: 1 }, // 問題インデックス
    unit: { base: 3, md: 2 }, // ユニット名
    category: { base: 3, md: 2 }, // カテゴリー名
    number: { base: 1, md: 2 }, // 問題番号
    time: { base: 1, md: 2 }, // 所要時間
    eval: { base: 3, md: 3 }, // 自己評価
  };

  return (
    <Box w={'100%'}>
      {/* 1. ヘッダー行 (Grid) */}
      <Grid
        gutter="xs"
        align="center"
        style={{
          color: theme.text,
          fontWeight: 'bold',
          borderBottom: `2px solid ${theme.border}`,
          paddingBottom: 4,
        }}
      >
        <Grid.Col span={colSizes.index}>
          <Text size="sm">No.</Text>
        </Grid.Col>
        <Grid.Col span={colSizes.unit}>
          <Text size="sm">ユニット</Text>
        </Grid.Col>
        <Grid.Col span={colSizes.category}>
          <Text size="sm">カテゴリ</Text>
        </Grid.Col>
        <Grid.Col span={colSizes.number} ta="center">
          <Text size="sm">問題</Text>
        </Grid.Col>
        <Grid.Col span={colSizes.time} ta="center">
          <Text size="sm">時間</Text>
        </Grid.Col>
        <Grid.Col span={colSizes.eval} ta="center">
          <Text size="sm">評価</Text>
        </Grid.Col>
      </Grid>

      {/* 2. データ行 (Stack内にTestProblemsItemを配置) */}
      <Stack gap={0}>
        {problems.map((problem, index) => (
          // Gridの列幅定義をPropsとして渡す
          <TestProblemsItem
            key={index}
            problem={problem}
            elapsedTimeMs={elapsedTimeMap[problem.problemIndex]}
            selfEvaluation={selfEvaluationMap[problem.problemIndex] ?? 'unrated'}
            isCurrent={problem.problemIndex === currentProblemIndex}
            colSizes={colSizes}
            theme={theme}
            onClick={() => onClick(problem)}
          />
        ))}
      </Stack>
    </Box>
  );
};
