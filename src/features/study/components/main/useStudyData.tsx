import { JSX, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpandedLearningCycleProblem } from '@/features/app/learningCycles/types/expand-learning-cycle-types';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  ProblemScoringStatus,
  TestSelfEvaluation,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { TextbookDocument } from '@/shared/data/documents/textbook/textbook-document';
import { ActiveLearningCycle } from '@/shared/data/documents/user/user-support';
import { SingleTimerData } from '@/shared/hooks/multi-timer/multi-timer-types';
import { useLearningCycleStore } from '@/shared/stores/useLearningCycleStore';
import { useTextbookStore } from '@/shared/stores/useTextbookStore';
import useUserStore from '@/shared/stores/useUserStore';
import { createPseudoLearningCycleDocument } from '../../../app/learningCycles/functions/active-learning-cycle-utils';
import { handleRecordSession } from '../../functions/curd-learning-cycle';
import { StudyLoadingOrError } from './StudyLoadingOrError';

interface StudyResultData {
  selfEvaluationMap: Record<number, TestSelfEvaluation>;
  scoringStatusMap: Record<number, ProblemScoringStatus>;
  elapsedTimeMap: Record<number, number>;
  studyTimer: SingleTimerData;
  testTimer: SingleTimerData;
  problems?: ExpandedLearningCycleProblem[];
}

// 戻り値の型定義
export interface StudyData {
  pseudoLearningCycleDocument: LearningCycleDocument | null;
  textbook: TextbookDocument | undefined;
  isDataReady: boolean;

  // レンダリングのためのLoading/Errorコンポーネント
  renderLoadingOrError: () => JSX.Element;
  handleFinishLearning: (args: StudyResultData) => Promise<void>;

  learningCycle?: LearningCycleDocument | undefined;
  activeLearningCycle?: ActiveLearningCycle | null;
  cycleId?: string | null;
  isFoundCycle?: boolean;
  isFoundTextbook?: boolean;
  overallLoading?: boolean;
  cycleError?: any;
  textbookError?: any;
}

/**
 * 学習サイクルと教科書のデータをフェッチし、前処理を行うカスタムフック
 */
export const useStudyData = (): StudyData => {
  const navigate = useNavigate();

  // --- Zustand Store Data ---
  const { user, fetchUser } = useUserStore((state) => state);
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const cycleId = user?.currentActiveLearningCycle?.id ?? null;
  const currentActiveLearningCycle = user?.currentActiveLearningCycle ?? null;

  const pseudoLearningCycleDocument = useMemo(() => {
    return currentActiveLearningCycle
      ? createPseudoLearningCycleDocument(currentActiveLearningCycle)
      : null;
  }, [currentActiveLearningCycle]);

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
          await handleRecordSession(
            args.scoringStatusMap,
            args.selfEvaluationMap,
            args.elapsedTimeMap,
            textbook.id,
            learningCycle.id
          );
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
    isDataReady,
    textbook,
    cycleId,
    learningCycle,
    pseudoLearningCycleDocument,
    activeLearningCycle: currentActiveLearningCycle,
    isFoundCycle,
    isFoundTextbook,
    overallLoading,
    cycleError,
    textbookError,
    renderLoadingOrError,
    handleFinishLearning,
  };
};
