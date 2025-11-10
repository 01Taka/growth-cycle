import React from 'react';
import { IconPencil } from '@tabler/icons-react';
import { Box, Button, Card, Divider, Flex, Stack, Text } from '@mantine/core';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { SingleTimerData } from '@/shared/hooks/multi-timer/multi-timer-types';
import { sharedStyle } from '@/shared/styles/shared-styles';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { Subject } from '@/shared/types/subject-types';
import { LearningProblemBase } from '../../types/problem-types';
import { StudyHeader } from '../main/StudyHeader';
import { StudyTimer } from '../studyPhase/StudyTimer';
import { TestProblemCard } from './card/TestProblemCard';
import { TestStateGrid } from './grid/TestStateGrid';
import { TestProblemsList } from './list/TestProblemsList';

interface TestPhaseProps {
  problems: LearningProblemBase[];
  header: {
    subject: Subject;
    textbookName: string;
    units: string[];
  };
  isFinishTestTimer: boolean;
  mainTimer: SingleTimerData;
  currentTimerElapsedTime: number | null;
  elapsedTimeMap: Record<number, number>;
  selfEvaluationMap: Record<number, TestSelfEvaluation>;
  theme: SubjectColorMap;
  currentProblemIndex: number;
  switchTimerRunning: () => void;
  changeCurrentTestProblem: (newIndex: number | null, type: 'set' | 'increment') => void;
  onSelectSelfEvaluation: (index: number, evaluation: TestSelfEvaluation) => void;
  onStartScoring: () => void;
}

export const TestPhase: React.FC<TestPhaseProps> = ({
  problems,
  header,
  isFinishTestTimer,
  mainTimer,
  currentTimerElapsedTime,
  elapsedTimeMap,
  selfEvaluationMap,
  theme,
  currentProblemIndex,
  changeCurrentTestProblem,
  switchTimerRunning,
  onSelectSelfEvaluation,
  onStartScoring,
}) => {
  const currentProblem: LearningProblemBase | null = (problems[currentProblemIndex] ??
    null) as LearningProblemBase | null;

  const selfEvaluations = problems.map(
    (problem) => selfEvaluationMap[problem.problemIndex] ?? 'unrated'
  );
  const totalProblemsNumber = problems.length;
  const isProblemUnrated =
    (currentProblem ? (selfEvaluationMap[currentProblem.problemIndex] ?? 'unrated') : 'unrated') ===
    'unrated';

  if (!currentProblem) {
    return <Text>問題が見つかりません</Text>;
  }

  return (
    <Stack align="center" w={'100%'}>
      <Flex gap={10} justify="space-around" align="center">
        <StudyHeader {...header} />
        <StudyTimer
          size={'sm'}
          title="残り時間"
          timer={mainTimer}
          sectionColor={theme.border}
          buttonColor={theme.accent}
          switchState={switchTimerRunning}
        />
      </Flex>
      <Stack align="center" w={'90%'}>
        {isFinishTestTimer && (
          <Button
            size="xl"
            style={{
              ...sharedStyle.button,
              color: theme.text,
              backgroundColor: theme.bgCard,
              border: `2px solid ${theme.border}`,
              width: '100%',
              marginTop: 50,
              marginBottom: 80,
            }}
            onClick={onStartScoring}
          >
            テストを採点する
            <IconPencil />
          </Button>
        )}
        <TestProblemCard
          problem={currentProblem}
          selfEvaluation={selfEvaluationMap[currentProblem.problemIndex] ?? 'unrated'}
          currentElapsedTime={currentTimerElapsedTime}
          totalProblemsNumber={totalProblemsNumber}
          isAutoSlide={isProblemUnrated}
          theme={theme}
          onSelectSelfEvaluation={(evaluation) => {
            onSelectSelfEvaluation(currentProblem.problemIndex, evaluation);
            if (isProblemUnrated) {
              changeCurrentTestProblem(1, 'increment');
            }
          }}
          onNextProblem={() => changeCurrentTestProblem(1, 'increment')}
          onBackProblem={() => changeCurrentTestProblem(-1, 'increment')}
        />
        <Card
          w={'100%'}
          shadow="md"
          style={{
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bgCard,
            borderRadius: 16,
          }}
        >
          <Stack gap={5}>
            <Text style={{ color: theme.text }}>進行状況</Text>
            <Divider mb={5} color={theme.border} />
            <TestStateGrid
              selfEvaluations={selfEvaluations}
              totalProblemsNumber={totalProblemsNumber}
              currentProblemIndex={currentProblemIndex}
              onClick={(index) => changeCurrentTestProblem(index, 'set')}
            />
          </Stack>
        </Card>

        <Card
          w={'100%'}
          shadow="md"
          style={{
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bgCard,
            borderRadius: 16,
          }}
        >
          <Stack gap={5}>
            <Text style={{ color: theme.text }}>問題リスト {`(タップして移動)`}</Text>
            <Divider mb={5} color={theme.border} />
            <Box
              w={'100%'}
              mah={500}
              style={{ borderColor: theme.bgChip, overflowY: 'auto', overflowX: 'hidden' }}
            >
              <TestProblemsList
                problems={problems}
                elapsedTimeMap={elapsedTimeMap}
                selfEvaluationMap={selfEvaluationMap}
                currentProblemIndex={currentProblemIndex}
                theme={theme}
                onClick={(problem) => changeCurrentTestProblem(problem.problemIndex, 'set')}
              />
            </Box>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
};
