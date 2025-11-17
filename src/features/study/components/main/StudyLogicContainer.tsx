import React, { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Stack } from '@mantine/core'; // テスト用UI
import { LocalStorageMultiTimerPersistenceProvider } from '@/shared/hooks/multi-timer/localStoragePersistenceProvider';
import { useStudyLogic } from '../../hooks/useStudyLogic';
import { useSyncedLocalStorage } from '../../hooks/useSyncedLocalStorage';
import { ReviewPhase } from '../reviewPhase/ReviewPhase';
import { ScoringPhase } from '../scoringPhase/ScoringPhase';
import { StudyPhase } from '../studyPhase/StudyPhase';
import { TestPhase } from '../testPhase/TestPhase';
import { ParticleOverlay } from './ParticleOverlay';
import { StudyData } from './useStudyData';

const PERSISTENCE_KEY = 'multiTimer';
type Phase = 'study' | 'test' | 'scoring' | 'review';

const PHASE_KEY = 'phase';

interface StudyLogicContainerProps {
  studyData: StudyData;
  debugTime?: boolean;
}

export const StudyLogicContainer: React.FC<StudyLogicContainerProps> = ({
  studyData,
  debugTime,
}) => {
  const {
    attemptProblemIds,
    pseudoLearningCycleDocument,
    textbook,
    isDataReady,
    handleFinishLearning,
  } = studyData;

  const [searchParams, setSearchParam] = useSearchParams();
  const phaseInUrl = searchParams.get(PHASE_KEY) as Phase | null;
  const phase: Phase =
    phaseInUrl && ['study', 'test', 'scoring', 'review'].includes(phaseInUrl)
      ? phaseInUrl
      : 'study';

  const setPhase = (newPhase: Phase) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(PHASE_KEY, newPhase);
    setSearchParam(newSearchParams);
  };

  useEffect(() => {
    if (studyData.activeLearningCycle?.learningDurationMs === 0 && phase === 'study') {
      setPhase('test');
    }
  }, [studyData.activeLearningCycle?.learningDurationMs, phase, setPhase]);

  // --- useStudyLogic ---
  const timerProvider = useMemo(
    () => new LocalStorageMultiTimerPersistenceProvider(PERSISTENCE_KEY),
    []
  );

  const studyLogicProps = useStudyLogic({
    attemptProblemIds,
    learningCycle: pseudoLearningCycleDocument ?? null,
    studyDuration: debugTime
      ? 2000
      : isDataReady && pseudoLearningCycleDocument
        ? pseudoLearningCycleDocument.learningDurationMs
        : 0,
    testDuration: debugTime
      ? 2000
      : isDataReady && pseudoLearningCycleDocument
        ? pseudoLearningCycleDocument.testDurationMs
        : 0,
    header: {
      textbookName: textbook?.name ?? 'Loading...',
      units: (pseudoLearningCycleDocument?.units ?? []).map((unit) => unit.name),
      subject: textbook?.subject ?? 'japanese',
    },
    timerProvider,
  });

  const {
    header,
    theme,
    selfEvaluationMap,
    scoringStatusMap,
    studyTimer,
    testTimer,
    currentTestProblemIndex,
    currentActiveProblemTimer,
    elapsedTimeMap,
    isAllProblemsEvaluated,
    isFinishTestTimer,
    expandedLearningCycle,
    groupedByIndexTestResults,
    handleScoreChange,
    handleSelfEvaluationMap,
    stopAll,
    resetAll,
    changeCurrentTestProblem,
    handleSwitchTimerRunning,
  } = studyLogicProps;

  const handleResetTimer = useCallback(
    (currentData: string, localData: string | null) => {
      if (localData === null) {
        return;
      }
      if (!localData) {
        resetAll();
        return;
      }

      let parsedLocalData: string;
      try {
        // localData は JSON 文字列なので、パースして中の実際の値を取り出す
        parsedLocalData = JSON.parse(localData);
      } catch (e) {
        // パースに失敗した場合は、そのまま比較してもfalseになるため、異なるものとみなす
        console.error('Failed to parse localData:', e);
        console.log('Comparison result (parse failed):', false);
        return;
      }
      if (currentData !== '' && currentData !== parsedLocalData) {
        resetAll();
      }
    },
    [resetAll]
  );

  useSyncedLocalStorage<string>(
    'currentLearningCycleId',
    studyData.cycleId ?? '',
    handleResetTimer
  );

  const onFinish = useCallback(() => {
    // const isTimerCompleted = studyTimer.remainingTime <= 0 && testTimer.remainingTime <= 0;
    // const isEnteredData =
    //   Object.keys(selfEvaluationMap).length > 0 && Object.keys(scoringStatusMap).length > 0;
    // // ポップアップの表示などに利用
    // const _isCompleted = isEnteredData && isTimerCompleted;

    handleFinishLearning({
      selfEvaluationMap,
      scoringStatusMap,
      elapsedTimeMap,
      studyTimer,
      testTimer,
    });
    resetAll();
  }, [selfEvaluationMap, scoringStatusMap, elapsedTimeMap, studyTimer, testTimer, resetAll]);

  // 💡 データが揃った後のフェーズレンダリング
  const renderPhase = () => {
    switch (phase) {
      case 'study':
        return (
          <StudyPhase
            problems={expandedLearningCycle?.problems ?? []}
            isReadyTest={studyTimer.remainingTime <= 0}
            header={header}
            plant={pseudoLearningCycleDocument?.plant ?? null}
            timer={studyTimer}
            theme={theme}
            switchState={studyTimer.switchState}
            onStartTest={() => setPhase('test')}
          />
        );
      case 'test':
        return (
          <TestPhase
            problems={expandedLearningCycle?.problems ?? []}
            header={header}
            isAllProblemsEvaluated={isAllProblemsEvaluated}
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
            onStartScoring={() => {
              stopAll();
              setPhase('scoring');
            }}
          />
        );
      case 'scoring':
        return (
          <ScoringPhase
            problems={expandedLearningCycle?.problems ?? []}
            scoringStatusMap={scoringStatusMap}
            selfEvaluationsMap={selfEvaluationMap}
            header={header}
            theme={theme}
            handleScoreChange={handleScoreChange}
            onStartReview={() => setPhase('review')}
          />
        );
      case 'review':
        return (
          <ReviewPhase
            groupedTestResults={groupedByIndexTestResults}
            theme={theme}
            onFinish={() => onFinish()}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ParticleOverlay color={theme.accent} />
      <Stack w={'100%'} mt={16} gap={500} style={{ backgroundColor: theme.bgScreen }}>
        {renderPhase()}

        {/* --- テスト用UI --- */}
        {/* <Stack mt={50}>
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
        </Stack> */}
      </Stack>
    </>
  );
};
