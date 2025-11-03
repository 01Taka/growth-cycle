import React, { useState } from 'react';
import { Button, Flex, Stack } from '@mantine/core';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/subject-types';
import { useStudyTestPhase } from '../hooks/useStudyTestPhase';
import { ParticleOverlay } from './ParticleOverlay';
import { dummyProblems } from './testPhase/dummy-problems';
import { TestPhase } from './testPhase/TestPhase';

interface StudyMainProps {}

export const StudyMain: React.FC<StudyMainProps> = ({}) => {
  const problems = dummyProblems;
  const subject: Subject = 'english';
  const theme = useSubjectColorMap(subject);
  const {
    mainTimer,
    currentTestProblemIndex,
    currentActiveProblemTimer,
    elapsedTimeMap,
    changeCurrentTestProblem,
    handleSwitchTimerRunning,
    resetAll,
  } = useStudyTestPhase(problems.length);

  const [selfEvaluationMap, setSelfEvaluationMap] = useState<Record<number, TestSelfEvaluation>>(
    {}
  );

  const handleSelfEvaluationMap = (index: number, evaluation: TestSelfEvaluation) => {
    setSelfEvaluationMap((prev) => ({ ...prev, [index]: evaluation }));
  };

  return (
    <>
      <ParticleOverlay color={theme.accent} />
      <Stack w={'100%'} mt={16} style={{ backgroundColor: theme.bgScreen }}>
        {/* <StudyPhase
          isReadyTest={timer.remainingTime <= 0}
          header={{ subject: subject, textbookName: '論読', units: ['unitA', 'unitB'] }}
          plant={{
            subject: subject,
            type: 'adult',
            imageIndex: Date.now() % 17,
          }}
          timer={timer}
          theme={theme}
        /> */}

        <TestPhase
          problems={dummyProblems}
          header={{ subject: subject, textbookName: '論読', units: ['unitA', 'unitB'] }}
          plant={{
            subject: subject,
            type: 'adult',
            imageIndex: Date.now() % 17,
          }}
          mainTimer={mainTimer}
          currentTimerElapsedTime={currentActiveProblemTimer?.elapsedTime ?? null}
          elapsedTimeMap={elapsedTimeMap}
          theme={theme}
          currentProblemIndex={currentTestProblemIndex ?? 0}
          selfEvaluationMap={selfEvaluationMap}
          onSelectSelfEvaluation={handleSelfEvaluationMap}
          changeCurrentTestProblem={changeCurrentTestProblem}
          switchTimerRunning={handleSwitchTimerRunning}
        />

        {/* テスト用 */}
        <Flex>
          <Button onClick={mainTimer.start}>start</Button>
          <Button onClick={mainTimer.stop}>stop</Button>
          <Button onClick={mainTimer.reset}>reset</Button>
          <Button onClick={resetAll}>resetAll</Button>
          {/* <TextInput
            type="number"
            value={newExpectedDuration}
            onChange={(e) => setNewExpectedDuration(Number(e.target.value))}
          /> */}
          <Button onClick={() => mainTimer.onDurationChange(0.2 * 60 * 1000)}>更新</Button>
        </Flex>
      </Stack>
    </>
  );
};
