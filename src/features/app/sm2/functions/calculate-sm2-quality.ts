import {
  ProblemScoringStatus,
  TestSelfEvaluation,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { calculateReviewNecessity } from '../../review-necessity/functions/calc-necessity';
import {
  ReviewNecessityResult,
  ReviewNecessityStage,
} from '../../review-necessity/types/review-necessity-types';
import { SM2_QUALITY_MAP, SM2_TIME_PARAMS } from '../constants/sm2-constants';

/**
 * 時間によるQualityスコア調整を行う。
 */
function adjustQualityByTime(baseQuality: number, timeSpentMs: number, refTimeMs: number): number {
  const p = SM2_TIME_PARAMS;

  // Quality 2以下 (Level 2/3) or refTimeが無効 → 調整スキップ
  if (baseQuality <= 2 || refTimeMs <= 0) return baseQuality;

  const timeRatio = Math.min(timeSpentMs / refTimeMs, p.TIME_RATIO_LIMIT);
  let adjustment = 0;

  // Q5 (Level 0) または Q4 (Level 1) に応じて遅延閾値を動的に選択
  const slowThreshold = baseQuality === 5 ? p.SLOW_THRESHOLD_Q5 : p.SLOW_THRESHOLD_Q4;

  // 速い場合の調整
  if (timeRatio < p.FAST_THRESHOLD) adjustment = p.ADJUSTMENT_STEP;
  // 遅い場合の調整 (動的閾値を使用)
  else if (timeRatio >= slowThreshold) adjustment = -p.ADJUSTMENT_STEP;

  // Quality 5 (Level 0) の場合は速さによる加点を無効化
  if (baseQuality === 5 && adjustment > 0) adjustment = 0;

  const adjusted = baseQuality + adjustment;
  // 上限/下限のキャップを適用
  return Math.max(p.MIN_QUALITY_AFTER_ADJ, Math.min(p.MAX_QUALITY_AFTER_ADJ, adjusted));
}

/**
 * ユーザーの自己評価＋解答時間からSM-2 Qualityスコア(0〜5)を推定。
 */
export function calculateSM2Quality(
  selfEvaluation: TestSelfEvaluation,
  scoringStatus: ProblemScoringStatus,
  timeSpentMs: number,
  refTimeMs: number
): number {
  // --- 入力検証 ---
  if (timeSpentMs < 0 || refTimeMs < 0) {
    // throw new Error('Invalid input: timeSpentMs and refTimeMs must be non-negative.');
    console.error('Invalid input: timeSpentMs and refTimeMs must be non-negative.');
    return 0; // エラー時は最も厳しいスコア (0) を返す
  }

  // --- 復習必要度レベル算出 ---
  const necessityResult: ReviewNecessityResult = calculateReviewNecessity(
    selfEvaluation,
    scoringStatus
  );
  const level: ReviewNecessityStage =
    necessityResult.level === -1 ? necessityResult.alternativeLevel : necessityResult.level;

  // Mapから基本Qualityを取得。存在しない場合は0をデフォルトとする。
  const baseQuality = SM2_QUALITY_MAP[level] ?? 0;

  // --- 時間補正を適用 ---
  return adjustQualityByTime(baseQuality, timeSpentMs, refTimeMs);
}
