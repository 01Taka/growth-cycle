import React from 'react';
import { Button, Card, Flex, Stack, Text } from '@mantine/core';
import { LearningProblemBase } from '@/features/study/types/problem-types';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { formatMilliseconds } from '@/shared/utils/datetime/time-utils';
import { TestSelfEvaluationButtons } from './TestSelfEvaluationButtons';

interface TestProblemCardProps {
  problem: LearningProblemBase;
  selfEvaluation: TestSelfEvaluation;
  currentElapsedTime: number | null;
  totalProblemsNumber: number;
  isAutoSlide: boolean;
  theme: SubjectColorMap;
  onSelectSelfEvaluation: (evaluation: TestSelfEvaluation) => void;
  onNextProblem: () => void;
  onBackProblem: () => void;
}

export const TestProblemCard: React.FC<TestProblemCardProps> = ({
  problem,
  selfEvaluation,
  currentElapsedTime,
  totalProblemsNumber,
  isAutoSlide,
  theme,
  onSelectSelfEvaluation,
  onNextProblem,
  onBackProblem,
}) => {
  const { unitName, categoryName, problemNumber, problemIndex } = problem;
  const selfEvaluations: TestSelfEvaluation[] = ['notSure', 'imperfect', 'confident'];
  const time = currentElapsedTime
    ? formatMilliseconds(currentElapsedTime, { minutesPads: 1 })
    : null;
  const timeText = time ? `${time.conversion.minutes} : ${time.split.seconds}` : '0 : 00';

  return (
    <Card
      w={'100%'}
      shadow="md"
      style={{
        backgroundColor: theme.bgCard,
        border: `2px solid ${theme.border}`,
        borderRadius: 16,
      }}
    >
      <Stack align="center">
        <Flex w={'100%'} justify="space-between" style={{ color: theme.text }}>
          <Text size="lg" fw={700}>
            {unitName} {categoryName} {problemNumber}
          </Text>
          <Text>
            {problemIndex + 1} / {totalProblemsNumber}
          </Text>
        </Flex>
        <Text size="xl" style={{ color: theme.text }}>
          Time: {timeText}
        </Text>
        <TestSelfEvaluationButtons
          selectedSelfEvaluation={selfEvaluation}
          selfEvaluations={selfEvaluations}
          onSelectSelfEvaluation={onSelectSelfEvaluation}
        />
        <Text size="sm" style={{ color: 'GrayText' }}>
          {isAutoSlide ? '自己評価をすると次の問題に移動' : '自己評価を選択'}
        </Text>
        <Flex justify="space-between" w={'100%'}>
          <Button variant="transparent" style={{ color: theme.accent }} onClick={onBackProblem}>
            ＜戻る
          </Button>
          <Button variant="transparent" style={{ color: theme.accent }} onClick={onNextProblem}>
            {isAutoSlide ? 'パス＞' : '次へ＞'}
          </Button>
        </Flex>
      </Stack>
    </Card>
  );
};
