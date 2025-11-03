import React from 'react';
import { Flex, Stack } from '@mantine/core';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { SingleTimerData } from '@/shared/hooks/multi-timer/multi-timer-types';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { ImportPlantsType } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { StudyProblem } from '../../types/problem-types';
import { StudyHeader } from '../studyPhase/StudyHeader';
import { StudyTimer } from '../studyPhase/StudyTimer';
import { TestProblemCard } from './card/TestProblemCard';
import { dummyProblems } from './dummy-problems';
import { TestStateGrid } from './grid/TestStateGrid';
import { TestProblemsList } from './list/TestProblemsList';

interface TestPhaseProps {
  problems: StudyProblem[];
  header: {
    subject: Subject;
    textbookName: string;
    units: string[];
  };
  plant: {
    subject: Subject;
    type: ImportPlantsType;
    imageIndex: number;
  };
  mainTimer: SingleTimerData;
  currentTimerElapsedTime: number | null;
  elapsedTimeMap: Record<number, number>;
  selfEvaluationMap: Record<number, TestSelfEvaluation>;
  theme: SubjectColorMap;
  currentProblemIndex: number;
  switchTimerRunning: () => void;
  changeCurrentTestProblem: (newIndex: number | null, type: 'set' | 'increment') => void;
  onSelectSelfEvaluation: (index: number, evaluation: TestSelfEvaluation) => void;
}

export const TestPhase: React.FC<TestPhaseProps> = ({
  problems,
  header,
  mainTimer,
  currentTimerElapsedTime,
  elapsedTimeMap,
  selfEvaluationMap,
  theme,
  currentProblemIndex,
  changeCurrentTestProblem,
  switchTimerRunning,
  onSelectSelfEvaluation,
}) => {
  const currentProblem = problems[currentProblemIndex];
  const selfEvaluations = problems.map(
    (problem) => selfEvaluationMap[problem.problemIndex] ?? 'unrated'
  );
  const totalProblemsNumber = problems.length;

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
        <TestProblemCard
          problem={currentProblem}
          selfEvaluation={selfEvaluationMap[currentProblem.problemIndex] ?? 'unrated'}
          currentElapsedTime={currentTimerElapsedTime}
          totalProblemsNumber={totalProblemsNumber}
          theme={theme}
          onSelectSelfEvaluation={(evaluation) => {
            onSelectSelfEvaluation(currentProblem.problemIndex, evaluation);
            changeCurrentTestProblem(1, 'increment');
          }}
          onNextProblem={() => changeCurrentTestProblem(1, 'increment')}
          onBackProblem={() => changeCurrentTestProblem(-1, 'increment')}
        />
        <TestStateGrid
          selfEvaluations={selfEvaluations}
          totalProblemsNumber={totalProblemsNumber}
          currentProblemIndex={currentProblemIndex}
          onClick={(index) => changeCurrentTestProblem(index, 'set')}
        />
        <TestProblemsList
          problems={dummyProblems}
          elapsedTimeMap={elapsedTimeMap}
          selfEvaluationMap={selfEvaluationMap}
          currentProblemIndex={currentProblemIndex}
          theme={theme}
          onClick={(problem) => changeCurrentTestProblem(problem.problemIndex, 'set')}
        />
      </Stack>
    </Stack>
  );
};
