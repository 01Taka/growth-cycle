import {
  ProblemScoringStatus,
  TestSelfEvaluation,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { DEFAULT_SM2_STATE, SM2_SCHEDULER_PARAMS } from '../constants/sm2-schedule-constants';
import { SM2State } from '../types/sm2-types';
import { calculateSM2Quality } from './calculate-sm2-quality';

/**
 * SM-2のQualityスコアに基づいて、SM-2の状態 (I, EF, n) を更新します。
 */
export function updateSM2State(currentState: SM2State, qualityScore: number): SM2State {
  const p = SM2_SCHEDULER_PARAMS;
  let { interval: I, easeFactor: EF, repetitions: n } = currentState;

  if (qualityScore >= 3) {
    if (n === 0) {
      I = p.FIRST_INTERVAL;
    } else if (n === 1) {
      I = p.SECOND_INTERVAL;
    } else {
      I = Math.round(I * EF);
    }

    n += 1;

    const qDiff = 5 - qualityScore;
    EF =
      EF +
      (p.EF_ADJUSTMENT_COEFFICIENT_A -
        qDiff * (p.EF_ADJUSTMENT_COEFFICIENT_B + qDiff * p.EF_ADJUSTMENT_COEFFICIENT_C));

    if (EF < p.MIN_EF) EF = p.MIN_EF;
  } else {
    n = p.RESET_REPETITIONS;
    I = p.RESET_INTERVAL;
  }

  return { interval: I, easeFactor: EF, repetitions: n };
}

interface AttemptHistoryItem {
  attemptedAt: number;
  selfEvaluation: TestSelfEvaluation;
  scoringStatus: ProblemScoringStatus;
  timeSpentMs: number;
  [key: string]: any;
}

export const calculateSM2State = (
  sortedItems: AttemptHistoryItem[],
  baseTimeMs: number
): SM2State => {
  let currentState = DEFAULT_SM2_STATE;

  for (const attempt of sortedItems) {
    // a. Qualityスコアを計算
    const qualityScore = calculateSM2Quality(
      attempt.selfEvaluation as TestSelfEvaluation,
      attempt.scoringStatus as ProblemScoringStatus,
      attempt.timeSpentMs,
      baseTimeMs
    );
    // b. SM-2の状態を更新
    currentState = updateSM2State(currentState, qualityScore);
    // c. 最終解答時間を更新
  }

  return currentState;
};
