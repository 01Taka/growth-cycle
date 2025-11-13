import { calculateReviewNecessity } from '../../review-necessity/functions/calc-necessity';
import { XP_QUALITY_WEIGHTS } from '../constants/ex-weights';
import { XPSession } from './calculateXP';

/**
 * 集中時間の効果量スコアを計算する (0.0 から 1.0 に正規化)。
 * (時間が長くなるほど増加率は鈍化し、最大効用時間で 1.0 に頭打ちになる)
 * @param totalTestTimeSpendMin - テストの合計所要時間 (分)
 * @returns 0.0 から 1.0 の正規化された時間集中度スコア (効果量)
 */
function calculateNormalizedEffortScore(totalTestTimeSpendMin: number): number {
  const MAX_MULTIPLIER = XP_QUALITY_WEIGHTS.EFFORT_MAX_MULTIPLIER;
  const K = XP_QUALITY_WEIGHTS.EFFORT_K;

  // 1. 最大ボーナス値 (B_max) を計算
  const MAX_BONUS = MAX_MULTIPLIER - 1.0;

  // 所要時間がゼロまたは負の場合、または最大ボーナスが設定されていない場合は、スコア0.0
  if (totalTestTimeSpendMin <= 0 || MAX_BONUS <= 0) {
    return 0.0;
  }

  // 2. 現在の時間ボーナス部分 (totalTestTimeSpendMin^k) を計算
  const currentBonus = Math.pow(totalTestTimeSpendMin, K);

  // 3. 正規化: (現在のボーナス / 最大ボーナス) にて 0.0〜1.0 に変換
  // これにより、最大ボーナスを超えた値は 1.0 にクリップされる (頭打ち)
  const normalizedScore = currentBonus / MAX_BONUS;

  // 4. 最終的に 1.0 を超えないことを保証
  return Math.min(1.0, normalizedScore);
}

/**
 * 勉強の質スコア (qualityScore) を計算する。
 * (これは労力倍率を乗じる前のベーススコアであり、0.0から1.0に正規化される)
 */
export function calculateQualityScore({
  session,
  totalProblems,
  totalTestTimeSpendMs,
}: {
  session: XPSession;
  totalProblems: number;
  totalTestTimeSpendMs: number;
}): number {
  if (totalProblems === 0) return XP_QUALITY_WEIGHTS.ZERO_PROBLEMS_QUALITY_SCORE;

  const timeThresholdMs =
    totalTestTimeSpendMs > 0 && totalProblems > 0
      ? totalTestTimeSpendMs / totalProblems
      : XP_QUALITY_WEIGHTS.DEFAULT_TIME_THRESHOLD_MS;

  let integratedQualityScoreSum = 0;

  for (const result of session.results) {
    let score = 0;

    // 1. 時間因子
    const timeRatio = timeThresholdMs / result.timeSpentMs;
    let timeScore = Math.min(
      XP_QUALITY_WEIGHTS.TIME_SCORE_MAX,
      Math.max(XP_QUALITY_WEIGHTS.TIME_SCORE_MIN, timeRatio)
    );

    // 2. 結果と自己評価に基づく最終調整
    const status = result.scoringStatus;
    const selfEval = result.selfEvaluation;

    const { reason } = calculateReviewNecessity(selfEval, status);

    if (reason === 'understood') {
      score = timeScore + XP_QUALITY_WEIGHTS.IDEAL_BONUS_ADDITION;
    } else if (reason === 'uncertainCorrect') {
      score = timeScore * XP_QUALITY_WEIGHTS.LUCKY_GUESS_MULTIPLIER;
    } else if (reason === 'imperfectCorrect' || reason === 'mistakeImperfect') {
      score = timeScore * XP_QUALITY_WEIGHTS.IMPERFECT_MULTIPLIER;
    } else if (reason === 'overconfidenceError') {
      score = timeScore * XP_QUALITY_WEIGHTS.OVERCONFIDENCE_MULTIPLIER;
    } else if (reason === 'mistakeNotSure') {
      score = timeScore * XP_QUALITY_WEIGHTS.HONEST_MISTAKE_MULTIPLIER;
    } else {
      score = timeScore * XP_QUALITY_WEIGHTS.UNRATED_MULTIPLIER;
    }

    if (status === 'correct' && selfEval === 'confident') {
      score = timeScore + XP_QUALITY_WEIGHTS.IDEAL_BONUS_ADDITION;
    } else if (status === 'correct' && selfEval !== 'confident') {
      score = timeScore * XP_QUALITY_WEIGHTS.LUCKY_GUESS_MULTIPLIER;
    } else if (status === 'incorrect' && selfEval === 'confident') {
      score = timeScore * XP_QUALITY_WEIGHTS.OVERCONFIDENCE_MULTIPLIER;
    } else if (status === 'incorrect' && selfEval !== 'confident') {
      score = timeScore * XP_QUALITY_WEIGHTS.HONEST_MISTAKE_MULTIPLIER;
    }

    // 統合スコアを MIN_INTEGRATED_SCORE から MAX_SCORE_PER_PROBLEM の間に正規化
    integratedQualityScoreSum += Math.min(
      XP_QUALITY_WEIGHTS.MAX_SCORE_PER_PROBLEM,
      Math.max(XP_QUALITY_WEIGHTS.MIN_INTEGRATED_SCORE, score)
    );
  }

  // 最終的な統合質スコア (0から1に正規化)
  const finalQualityScore =
    integratedQualityScoreSum / (totalProblems * XP_QUALITY_WEIGHTS.MAX_SCORE_PER_PROBLEM);

  // 最終的に 1.0 を超えないように保証 (ここは 1.0 のままで問題ありません)
  return Math.min(1.0, finalQualityScore);
}

/**
 * 最終的な XP_質 (baseXpQuality) を計算する。
 * (ベーススコアに最終的な重みと労力倍率を乗じる)
 * * @param baseQualityScore - calculateQualityScore から得られた 0.0-1.0 のベーススコア
 * @param totalTestTimeSpendMin - テストの合計所要時間 (分)
 * @returns 計算された baseXpQuality
 */
export function calculateXPQuality({
  session,
  totalProblems,
  totalTestTimeSpendMs,
  totalTestTimeSpendMin,
}: {
  session: XPSession;
  totalProblems: number;
  totalTestTimeSpendMs: number;
  totalTestTimeSpendMin: number;
}) {
  const baseQualityScore = calculateQualityScore({ session, totalProblems, totalTestTimeSpendMs });
  // 1. 労力倍率を計算
  const effortDurationScore = calculateNormalizedEffortScore(totalTestTimeSpendMin);

  // 2. 最終 XP の計算
  // ベーススコア * 最終重み * 労力倍率
  const baseXpQuality = baseQualityScore * effortDurationScore;

  return {
    baseXpQuality,
    qualityScore: baseQualityScore,
    qualityEffortDurationScore: effortDurationScore,
  };
}
