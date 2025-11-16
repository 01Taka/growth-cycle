import { SM2State } from '@/features/app/sm2/types/sm2-types';
import {
  CategoryDetail,
  LearningCycleTestResult,
  UnitDetail,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';

export type CycleResultWithAttemptedAt = LearningCycleTestResult & { attemptedAt: number };

export interface ProblemBase {
  key: string;
  textbookId: string;
  unitId: string;
  categoryId: string;
  problemNumber: number;
  problemIndexInTextbook: number;
}

export type ProblemSM2CalculationResult = {
  sm2State: SM2State;
  /**
   * 最後にこの問題に解答したときのタイムスタンプ (ミリ秒)。
   * (結果のデータからソートして取得された値)
   */
  lastAttemptedAt: number;

  /**
   * SM-2の間隔に基づいて次に復習を推奨するタイムスタンプ (ミリ秒)。
   * 計算式: lastAttemptedAt + interval * 24 * 60 * 60 * 1000
   */
  nextAttemptTimestamp: number;

  /**
   * 次の復習推奨時刻と現在の時刻 (now) との差分 (ミリ秒)。
   * 計算式: nextAttemptTimestamp - now
   * (値が負の場合、復習期限を過ぎています)
   */
  differenceFromNextAttempt: number;

  lastAttemptSM2Quality: number;

  avgTime: number;
};

export interface ProblemListItemData {
  key: string;
  textbookId: string;
  textbookName: string;
  problemIndexInTextbook: number;
  unitId: string;
  unit: UnitDetail;
  unitName: string;
  categoryId: string;
  category: CategoryDetail;
  categoryName: string;
  problemNumber: number;
  correctnessRate: number;
  sm2State: SM2State;
  avgTime: number;
  nextAttemptTimestamp: number;
  differenceFromNextAttempt: number;
  lastAttemptSM2Quality: number;
  reviewRecommendationStage: number;
}
