import React, { useState } from 'react';
import { Button, Flex, Stack } from '@mantine/core';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/subject-types';
import { useStudyTimer } from '../hooks/useStudyTimer';
import { ParticleOverlay } from './ParticleOverlay';
import { dummyProblems } from './testPhase/dummy-problems';
import { TestPhase } from './testPhase/TestPhase';

interface StudyMainProps {}

export const StudyMain: React.FC<StudyMainProps> = ({}) => {
  const problems = [...dummyProblems, ...dummyProblems, ...dummyProblems];
  const subject: Subject = 'japanese';
  const theme = useSubjectColorMap(subject);
  const {
    studyTimer,
    testTimer,
    currentTestProblemIndex,
    currentActiveProblemTimer,
    elapsedTimeMap,
    isFinishTestTimer,
    changeCurrentTestProblem,
    handleSwitchTimerRunning,
    resetAll,
  } = useStudyTimer(problems.length);

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
          isReadyTest={studyTimer.remainingTime <= 0}
          header={{ subject: subject, textbookName: '論読', units: ['unitA', 'unitB'] }}
          plant={{
            subject: subject,
            type: 'adult',
            imageIndex: Date.now() % 17,
          }}
          timer={studyTimer}
          theme={theme}
          switchState={studyTimer.switchState}
        /> */}

        <TestPhase
          problems={problems}
          header={{ subject: subject, textbookName: '論読', units: ['unitA', 'unitB'] }}
          isFinishTestTimer={isFinishTestTimer}
          mainTimer={testTimer}
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
          <Button onClick={testTimer.start}>start</Button>
          <Button onClick={testTimer.stop}>stop</Button>
          <Button onClick={testTimer.reset}>reset</Button>
          <Button onClick={resetAll}>resetAll</Button>
          {/* <TextInput
            type="number"
            value={newExpectedDuration}
            onChange={(e) => setNewExpectedDuration(Number(e.target.value))}
          /> */}
          <Button onClick={() => testTimer.onDurationChange(0.2 * 60 * 1000)}>更新</Button>
        </Flex>
      </Stack>
    </>
  );
};
