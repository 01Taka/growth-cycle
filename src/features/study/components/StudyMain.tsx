import React, { useMemo, useState } from 'react';
import { Button, Flex, Stack, TextInput } from '@mantine/core';
import { LocalStorageMultiTimerPersistenceProvider } from '@/shared/hooks/multi-timer/localStoragePersistenceProvider';
import { Subject } from '@/shared/types/subject-types';
import { range } from '@/shared/utils/range';
import {
  createDummyLearningProblemBases,
  generateDummyTestResults,
} from '../functions/generate-dummy';
import { useStudyLogic } from '../hooks/useStudyLogic';
import { ParticleOverlay } from './ParticleOverlay';
import { ReviewPhase } from './reviewPhase/ReviewPhase';
import { ScoringPhase } from './scoringPhase/ScoringPhase';
import { StudyPhase } from './studyPhase/StudyPhase';
import { TestPhase } from './testPhase/TestPhase';

const PERSISTENCE_KEY = 'multiTimer';

interface StudyMainProps {}

export const StudyMain: React.FC<StudyMainProps> = ({}) => {
  // ダミーデータ生成ロジックは、フックの独立性を保つために残す（データ層と仮定）
  const attemptingProblems = useMemo(() => createDummyLearningProblemBases(10), []);
  const problems01 = useMemo(() => generateDummyTestResults(10), []);
  const problems02 = useMemo(() => generateDummyTestResults(10), []);
  const [newExpectedDuration, setNewExpectedDuration] = useState(0.1);
  const timerProvider = useMemo(
    () => new LocalStorageMultiTimerPersistenceProvider(PERSISTENCE_KEY),
    [] // 依存配列は空でOK
  );
  const {
    subject,
    phase,
    header,
    theme,
    problems,
    records,
    selfEvaluationMap,
    scoringStatusMap,
    studyTimer,
    testTimer,
    currentTestProblemIndex,
    currentActiveProblemTimer,
    elapsedTimeMap,
    isFinishTestTimer,
    handleScoreChange,
    handleSelfEvaluationMap,
    setPhase,
    resetAll,
    changeCurrentTestProblem,
    handleSwitchTimerRunning,
  } = useStudyLogic({
    attemptingProblems,
    pastAttemptedResults: [...problems01, ...problems02],
    header: {
      textbookName: 'TEXT_A',
      units: ['UNIT_A'],
      subject: 'english',
    },
    initialPhase: 'study',
    setPhase: () => {},
  });

  const renderPhase = () => {
    switch (phase) {
      case 'study':
        return (
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
            onStartTest={() => setPhase('test')}
            onShowTextRange={() => {}}
          />
        );
      case 'test':
        return (
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
            onStartScoring={() => setPhase('scoring')}
          />
        );
      case 'scoring':
        return (
          <ScoringPhase
            scoringStatusMap={scoringStatusMap}
            problems={problems}
            header={header}
            theme={theme}
            handleScoreChange={handleScoreChange}
            onStartReview={() => setPhase('review')}
          />
        );
      case 'review':
        return <ReviewPhase records={records} theme={theme} />;
      default:
        return null;
    }
  };

  return (
    <>
      <ParticleOverlay color={theme.accent} />
      <Stack w={'100%'} mt={16} gap={500} style={{ backgroundColor: theme.bgScreen }}>
        {renderPhase()}

        {/* --- テスト用 --- */}
        <Stack mt={50}>
          <Button variant="filled" color="blue" onClick={() => setPhase('study')}>
            Go to Study Phase
          </Button>
          <Button variant="filled" color="blue" onClick={() => setPhase('test')}>
            Go to Test Phase
          </Button>
          <Button variant="filled" color="blue" onClick={() => setPhase('scoring')}>
            Go to Scoring Phase
          </Button>
          <Button variant="filled" color="blue" onClick={() => setPhase('review')}>
            Go to Review Phase
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
            onClick={() => {
              testTimer.onDurationChange(newExpectedDuration * 60 * 1000);
              studyTimer.onDurationChange(newExpectedDuration * 60 * 1000);
            }}
          >
            更新
          </Button>
          {/* <Flex>
            {range(5).map((index) => {
              const subjects: Subject[] = [
                'japanese',
                'english',
                'math',
                'science',
                'socialStudies',
              ];
              return (
                <Button key={subjects[index]} onClick={() => setSubject(subjects[index])}>
                  {subjects[index]}
                </Button>
              );
            })}
          </Flex> */}
        </Stack>
      </Stack>
    </>
  );
};
