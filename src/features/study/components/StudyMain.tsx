import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Stack, TextInput } from '@mantine/core';
import { LocalStorageMultiTimerPersistenceProvider } from '@/shared/hooks/multi-timer/localStoragePersistenceProvider';
import { useLearningCycleStore } from '@/shared/stores/useLearningCycleStore';
import { useTextbookStore } from '@/shared/stores/useTextbookStore';
import { convertLearningCycleToAttempts, transformData } from '../functions/transform-data';
import { useStudyLogic } from '../hooks/useStudyLogic';
import { LearningProblemBase } from '../types/problem-types';
import { ParticleOverlay } from './ParticleOverlay';
import { ReviewPhase } from './reviewPhase/ReviewPhase';
import { ScoringPhase } from './scoringPhase/ScoringPhase';
import { StudyLoadingOrError } from './StudyLoadingOrError';
import { StudyPhase } from './studyPhase/StudyPhase';
import { TestPhase } from './testPhase/TestPhase';

const PERSISTENCE_KEY = 'multiTimer';
type Phase = 'study' | 'test' | 'scoring' | 'review';

interface StudyMainProps {}

export const StudyMain: React.FC<StudyMainProps> = ({}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cycleId = searchParams.get('cycleId');

  const [phase, setPhase] = useState<Phase>('scoring');

  // --- Zustand Store Data ---
  const {
    activeLearningCycle,
    getLearningCycleById,
    isLoading: isLoadingCycle,
    error: cycleError,
  } = useLearningCycleStore((state) => state);
  const learningCycle = activeLearningCycle.data;
  const isFoundCycle = activeLearningCycle.isFound;

  const {
    activeTextbook,
    getTextbookById,
    isLoading: isLoadingTextbook,
    error: textbookError,
  } = useTextbookStore((state) => state);
  const textbook = activeTextbook.data;
  const isFoundTextbook = activeTextbook.isFound;

  // 💡 統合されたローディング状態
  const overallLoading = isLoadingCycle || isLoadingTextbook;

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (!cycleId) return;

    // 1. 学習サイクルデータのフェッチ
    const fetchCycleData = async () => {
      // 既にアクティブなIDと一致する場合は再フェッチをスキップ
      if (activeLearningCycle.id === cycleId && activeLearningCycle.isFound) return;

      const result = await getLearningCycleById(cycleId);

      // 2. サイクルデータが取得できたら、関連付けられた教科書IDを使って教科書データをフェッチ
      if (result.isFound && result.data && result.data.textbookId) {
        // 教科書データが既にアクティブなIDと一致する場合は再フェッチをスキップ
        if (activeTextbook.id === result.data.textbookId && activeTextbook.isFound) return;

        await getTextbookById(result.data.textbookId);
      }
    };

    fetchCycleData();
    // cycleId, getLearningCycleById, activeLearningCycle.id, activeLearningCycle.isFound は必須
    // 依存配列にactiveTextbookを含めると無限ループの原因になりやすいため、fetchCycleData内で直接チェック
  }, [cycleId, getLearningCycleById, getTextbookById]);

  // --- Data Preparation (useMemo/Memoized values) ---

  // 💡 データが揃っているか確認し、揃っていない場合は空の配列を使用
  const attemptingProblems: LearningProblemBase[] = useMemo(
    () => (learningCycle ? transformData(learningCycle) : []),
    [learningCycle]
  );

  const pastAttemptedResults = useMemo(
    () => (learningCycle ? convertLearningCycleToAttempts(learningCycle) : []),
    [learningCycle]
  );

  const isDataReady = isFoundCycle && isFoundTextbook && !!learningCycle && !!textbook;

  // --- useStudyLogic ---
  const timerProvider = useMemo(
    () => new LocalStorageMultiTimerPersistenceProvider(PERSISTENCE_KEY),
    []
  );

  const studyLogicProps = useStudyLogic({
    studyDuration: isDataReady ? learningCycle.learningDurationMs : 0,
    testDuration: isDataReady ? learningCycle.testDurationMs : 0,
    attemptingProblems: isDataReady ? attemptingProblems : [],
    pastAttemptedResults: isDataReady ? pastAttemptedResults : [],
    header: {
      textbookName: textbook?.name ?? 'Loading...',
      units: (learningCycle?.units ?? []).map((unit) => unit.name),
      subject: textbook?.subject ?? 'japanese',
    },
    timerProvider,
  });

  // 💡 studyLogicProps の展開 (データ準備ができたかどうかに関わらず常に展開)
  const {
    subject,
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
    resetAll,
    changeCurrentTestProblem,
    handleSwitchTimerRunning,
  } = studyLogicProps;

  const [newExpectedDuration, setNewExpectedDuration] = useState(0.1);

  // --- Render Logic ---

  // 💡 ロード中/エラーの場合は専用コンポーネントを表示
  if (!isDataReady) {
    return (
      <StudyLoadingOrError
        isLoading={overallLoading}
        cycleId={cycleId}
        isCycleFound={isFoundCycle}
        isTextbookFound={isFoundTextbook}
        cycleError={cycleError}
        textbookError={textbookError}
      />
    );
  }

  // 💡 データが揃った後のフェーズレンダリング
  const renderPhase = () => {
    switch (phase) {
      case 'study':
        // ... (StudyPhase のレンダリングロジックは変更なし)
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
        // ... (ScoringPhase のレンダリングロジックは変更なし)
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
        </Stack>
      </Stack>
    </>
  );
};
