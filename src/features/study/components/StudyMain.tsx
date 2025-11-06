import React, { useMemo, useState } from 'react';
import { Button, Flex, Stack, TextInput } from '@mantine/core';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { Subject } from '@/shared/types/subject-types';
import { range } from '@/shared/utils/range';
import { generateDummyRecords } from '../functions/generate-dummy';
import { useStudyTimer } from '../hooks/useStudyTimer';
import { generateDummyTestResults } from './dummy-problems';
import { ParticleOverlay } from './ParticleOverlay';
import { ReviewPhase } from './reviewPhase/ReviewPhase';
import { ScoringPhase } from './scoringPhase/ScoringPhase';
import { StudyPhase } from './studyPhase/StudyPhase';
import { TestPhase } from './testPhase/TestPhase';

interface StudyMainProps {}

export const StudyMain: React.FC<StudyMainProps> = ({}) => {
  const problems = useMemo(() => generateDummyTestResults(10), []);
  const records = useMemo(() => generateDummyRecords(10), []);

  const [subject, setSubject] = useState<Subject>('japanese');

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
      <Stack w={'100%'} mt={16} gap={500} style={{ backgroundColor: theme.bgScreen }}>
        <StudyPhase
          isReadyTest={studyTimer.remainingTime <= 0}
          header={header}
          plant={{
            subject: subject,
            type: 'adult',
            imageIndex: 2,
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

        <ScoringPhase problems={problems} header={header} theme={theme} />

        <ReviewPhase records={records} theme={theme} />

        {/* テスト用 */}
        <Stack>
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
          <Flex>
            {range(5).map((index) => {
              const subjects: Subject[] = [
                'japanese',
                'english',
                'math',
                'science',
                'socialStudies',
              ];
              return <Button onClick={() => setSubject(subjects[index])}>{subjects[index]}</Button>;
            })}
          </Flex>
        </Stack>
      </Stack>
    </>
  );
};
