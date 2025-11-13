import { JSX, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  ProblemScoringStatus,
  TestSelfEvaluation,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { TextbookDocument } from '@/shared/data/documents/textbook/textbook-document';
import { SingleTimerData } from '@/shared/hooks/multi-timer/multi-timer-types';
import { useLearningCycleStore } from '@/shared/stores/useLearningCycleStore';
import { useTextbookStore } from '@/shared/stores/useTextbookStore';
import { handleRecordSession } from '../../functions/curd-learning-cycle';
import { convertLearningCycleToAttempts, transformData } from '../../functions/transform-data';
import { LearningProblemBase, ProblemAttemptResult } from '../../types/problem-types';
import { StudyLoadingOrError } from './StudyLoadingOrError';

const CYCLE_ID_KEY = 'cycleId';

interface StudyResultData {
  problems: ProblemAttemptResult[];
  selfEvaluationMap: Record<number, TestSelfEvaluation>;
  scoringStatusMap: Record<number, ProblemScoringStatus>;
  elapsedTimeMap: Record<number, number>;
  studyTimer: SingleTimerData;
  testTimer: SingleTimerData;
}

// 戻り値の型定義
export interface StudyData {
  cycleId: string | null;
  learningCycle: LearningCycleDocument | undefined;
  textbook: TextbookDocument | undefined;
  isFoundCycle: boolean;
  isFoundTextbook: boolean;
  overallLoading: boolean;
  cycleError: any;
  textbookError: any;
  attemptingProblems: LearningProblemBase[];
  pastAttemptedResults: ProblemAttemptResult[];
  isDataReady: boolean;
  // レンダリングのためのLoading/Errorコンポーネント
  renderLoadingOrError: () => JSX.Element;
  handleFinishLearning: (args: StudyResultData) => Promise<void>;
}

/**
 * 学習サイクルと教科書のデータをフェッチし、前処理を行うカスタムフック
 */
export const useStudyData = (): StudyData => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cycleId = searchParams.get(CYCLE_ID_KEY);

  // --- Zustand Store Data ---
  const {
    activeLearningCycle,
    getLearningCycleById,
    fetchLearningCycles,
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

    const fetchCycleData = async () => {
      // 1. 学習サイクルデータのフェッチ
      if (activeLearningCycle.id !== cycleId || !activeLearningCycle.isFound) {
        const result = await getLearningCycleById(cycleId);

        // 2. サイクルデータが取得できたら、関連付けられた教科書IDを使って教科書データをフェッチ
        if (result.isFound && result.data && result.data.textbookId) {
          if (activeTextbook.id !== result.data.textbookId || !activeTextbook.isFound) {
            await getTextbookById(result.data.textbookId);
          }
        }
      } else if (learningCycle && learningCycle.textbookId) {
        // サイクルデータが既に存在する場合、教科書データが存在するかチェック
        if (activeTextbook.id !== learningCycle.textbookId || !activeTextbook.isFound) {
          await getTextbookById(learningCycle.textbookId);
        }
      }
    };

    fetchCycleData();
  }, [
    cycleId,
    getLearningCycleById,
    getTextbookById,
    activeLearningCycle.id,
    activeLearningCycle.isFound,
    activeTextbook.id,
    activeTextbook.isFound,
    learningCycle,
  ]);

  // --- Data Preparation (useMemo/Memoized values) ---

  const attemptingProblems: LearningProblemBase[] = useMemo(
    () => (learningCycle ? transformData(learningCycle) : []),
    [learningCycle]
  );

  const pastAttemptedResults = useMemo(
    () => (learningCycle ? convertLearningCycleToAttempts(learningCycle) : []),
    [learningCycle]
  );

  const isDataReady = isFoundCycle && isFoundTextbook && !!learningCycle && !!textbook;

  const renderLoadingOrError = () => (
    <StudyLoadingOrError
      isLoading={overallLoading}
      cycleId={cycleId}
      isCycleFound={isFoundCycle}
      isTextbookFound={isFoundTextbook}
      cycleError={cycleError}
      textbookError={textbookError}
    />
  );

  const handleFinishLearning = useCallback(
    async (args: StudyResultData) => {
      if (isDataReady) {
        try {
          await handleRecordSession(textbook.id, learningCycle.id, args.problems);
          await fetchLearningCycles(); // storeのデータを更新する
          navigate(`/?resultCycleId=${learningCycle.id}`);
        } catch (error) {
          console.error(error);
        }
      }
    },
    [
      isDataReady,
      textbook?.id,
      learningCycle?.id,
      navigate,
      fetchLearningCycles,
      handleRecordSession,
    ]
  );

  return {
    cycleId,
    learningCycle,
    textbook,
    isFoundCycle,
    isFoundTextbook,
    overallLoading,
    cycleError,
    textbookError,
    attemptingProblems,
    pastAttemptedResults,
    isDataReady,
    renderLoadingOrError,
    handleFinishLearning,
  };
};
