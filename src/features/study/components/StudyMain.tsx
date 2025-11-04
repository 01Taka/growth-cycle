import React, { useState } from 'react';
import { Button, Flex, Stack, TextInput } from '@mantine/core';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/subject-types';
import { useStudyTimer } from '../hooks/useStudyTimer';
import { dummyProblems } from './dummy-problems';
import { ParticleOverlay } from './ParticleOverlay';
import { ScoringPhase } from './scoringPhase/ScoringPhase';
import { StudyPhase } from './studyPhase/StudyPhase';
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

  const header = {
    subject: subject,
    textbookName: '論読',
    units: ['unitA', 'unitB'],
  };

  const [newExpectedDuration, setNewExpectedDuration] = useState(1);

  return (
    <>
      <ParticleOverlay color={theme.accent} />
      <Stack w={'100%'} mt={16} gap={50} style={{ backgroundColor: theme.bgScreen }}>
        <StudyPhase
          isReadyTest={studyTimer.remainingTime <= 0}
          header={header}
          plant={{
            subject: subject,
            type: 'adult',
            imageIndex: Date.now() % 17,
          }}
          timer={studyTimer}
          theme={theme}
          switchState={studyTimer.switchState}
        />

        <TestPhase
          problems={problems}
          header={header}
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

        <ScoringPhase header={header} theme={theme} />

        {/* テスト用 */}
        <Flex>
          <Button variant="transparent" onClick={testTimer.start}>
            start
          </Button>
          <Button variant="transparent" onClick={testTimer.stop}>
            stop
          </Button>
          <Button variant="transparent" onClick={testTimer.reset}>
            reset
          </Button>
          <Button variant="transparent" onClick={resetAll}>
            resetAll
          </Button>
          <TextInput
            type="number"
            value={newExpectedDuration}
            onChange={(e) => setNewExpectedDuration(Number(e.target.value))}
          />
          <Button
            variant="transparent"
            onClick={() => testTimer.onDurationChange(newExpectedDuration * 60 * 1000)}
          >
            更新
          </Button>
        </Flex>
      </Stack>
    </>
  );
};
