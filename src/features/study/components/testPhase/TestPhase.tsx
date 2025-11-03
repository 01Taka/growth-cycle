import React, { useState } from 'react';
import { Stack } from '@mantine/core';
import { SingleTimer } from '@/shared/hooks/multi-timer/multi-timer-types';
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
  mainTimer: SingleTimer;
  theme: SubjectColorMap;
}

export const TestPhase: React.FC<TestPhaseProps> = ({ problems, header, mainTimer, theme }) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

  const currentProblem = problems[currentProblemIndex];
  const selfEvaluations = problems.map((problem) => problem.selfEvaluation);
  const totalProblemsNumber = problems.length;

  return (
    <Stack align="center" w={'100%'}>
      <StudyHeader {...header} />
      <StudyTimer timer={mainTimer} sectionColor={theme.border} buttonColor={theme.accent} />
      <Stack align="center" w={'90%'}>
        <TestProblemCard
          problem={currentProblem}
          totalProblemsNumber={totalProblemsNumber}
          theme={theme}
          onSelectSelfEvaluation={() => {}}
          onNextProblem={() =>
            setCurrentProblemIndex((prev) => Math.min(prev + 1, totalProblemsNumber - 1))
          }
          onBackProblem={() => setCurrentProblemIndex((prev) => Math.max(prev - 1, 0))}
        />
        <TestStateGrid
          selfEvaluations={selfEvaluations}
          totalProblemsNumber={totalProblemsNumber}
          currentProblemIndex={currentProblemIndex}
          onClick={(index) => setCurrentProblemIndex(index)}
        />
        <TestProblemsList
          problems={dummyProblems}
          currentProblemIndex={currentProblemIndex}
          theme={theme}
          onClick={(problem) => setCurrentProblemIndex(problem.problemIndex)}
        />
      </Stack>
    </Stack>
  );
};
