import { XP_CORRECTNESS_WEIGHTS } from '../../constants/ex-weights';

/**
 * テストの効率性に基づき、XP_時間に乗じるボーナス係数を算出する。
 */
function calculateQuickAnswerBonus(testDurationMs: number, totalTestTimeSpendMs: number): number {
  const WEIGHTS = XP_CORRECTNESS_WEIGHTS;

  if (testDurationMs <= 0 || totalTestTimeSpendMs <= 0) {
    return WEIGHTS.MIN_BONUS_VALUE;
  }

  // W_TIME_BONUS_MAX (0.2) の代わりに MAX_QUICK_ANSWER_BONUS を使用
  // BONUS_CAP_RATIO (0.8) の代わりに QUICK_ANSWER_CAP_RATIO を使用
  const maxTimeReductionForBonus =
    testDurationMs * (WEIGHTS.MIN_MULTIPLIER_BASE - WEIGHTS.QUICK_ANSWER_CAP_RATIO);

  if (maxTimeReductionForBonus <= 0) {
    return WEIGHTS.MIN_BONUS_VALUE;
  }

  // ハードコーディングされた 0 を定数に置き換え (Math.max(0, ...))
  const actualTimeReduction = Math.max(
    WEIGHTS.MIN_BONUS_VALUE,
    testDurationMs - totalTestTimeSpendMs
  );

  let bonusFactor = WEIGHTS.MIN_BONUS_VALUE;

  if (actualTimeReduction > WEIGHTS.MIN_BONUS_VALUE) {
    // ハードコーディングされた 0 を定数に置き換え
    const effectiveReduction = Math.min(actualTimeReduction, maxTimeReductionForBonus);
    // W_TIME_BONUS_MAX (0.2) の代わりに MAX_QUICK_ANSWER_BONUS を使用
    bonusFactor = (effectiveReduction / maxTimeReductionForBonus) * WEIGHTS.MAX_QUICK_ANSWER_BONUS;
  }

  return bonusFactor;
}

/**
 * 成長ボーナス（xpCorrectness）を計算する。
 * @param correctRate - 今回の正答率 (0.0 - 1.0)
 * @param avgCorrectRatePast - 過去の平均正答率
 * @returns 計算された成長ボーナス (0以上)
 */
function calculateGrowthBonus(correctRate: number, avgCorrectRatePast: number): number {
  const WEIGHTS = XP_CORRECTNESS_WEIGHTS;

  // 1. 成長差分の計算とキャップ
  // 過去との差分を計算し、GROWTH_DIFF_CAPで上限を、MIN_GROWTH_DIFFERENCEで下限(0)を設定
  const growthDifference = Math.min(
    WEIGHTS.GROWTH_DIFF_CAP,
    Math.max(WEIGHTS.MIN_GROWTH_DIFFERENCE, correctRate - avgCorrectRatePast)
  );

  let bonusScore = WEIGHTS.MIN_BONUS_VALUE;

  if (growthDifference > WEIGHTS.MIN_GROWTH_DIFFERENCE) {
    // 2. W_GROWTH を使わず、最大ボーナススコアから線形ボーナスを算出
    // (成長差分 / 最大差分) * 最大ボーナス
    bonusScore = (growthDifference / WEIGHTS.GROWTH_DIFF_CAP) * WEIGHTS.MAX_GROWTH_BONUS_SCORE;
  }

  // 計算された bonusScore は MAX_GROWTH_BONUS_SCORE を超えないことが保証されるため、
  // Math.min による上限設定は省略可能ですが、ロジックをより明確にするために残します。
  return Math.min(bonusScore, WEIGHTS.MAX_GROWTH_BONUS_SCORE);
}

/**
 * 正答率 XP (xpCorrectness) を計算する。
 * (成果、成長、高得点、効率を評価)
 * * @param correctRate - 今回の正答率 (0.0 - 1.0)
 * @param avgCorrectRatePast - 過去の平均正答率 (初回は0.0または平均値など)
 * @param testDurationMs - 制限時間 (ms)
 * @param totalTestTimeSpendMs - テストの合計所要時間 (ms)
 * @returns 計算された xpCorrectness
 */
export function calculateXPCorrectness({
  correctRate,
  avgCorrectRatePast,
  testDurationMs,
  totalTestTimeSpendMs,
}: {
  correctRate: number;
  avgCorrectRatePast: number | null; // 初回の場合はnull
  testDurationMs: number;
  totalTestTimeSpendMs: number;
}) {
  const WEIGHTS = XP_CORRECTNESS_WEIGHTS; // 定数オブジェクトへの参照を短縮

  // 1. ベース XP (成果)
  const xpBase = correctRate * WEIGHTS.W_BASE;

  let bonusScore = 0;
  let correctnessBonusType: 'highScore' | 'growth' | 'none' = 'none'; // ボーナスタイプを初期化

  // 2. 成績ボーナス (排他的)
  if (correctRate >= WEIGHTS.HIGH_SCORE_THRESHOLD) {
    // A. 高得点ボーナス (90%以上)
    bonusScore = WEIGHTS.W_HIGH_SCORE;
    correctnessBonusType = 'highScore';
  } else if (avgCorrectRatePast !== null) {
    // B. 成長ボーナス (初回は適用なし)
    const growthBonus = calculateGrowthBonus(correctRate, avgCorrectRatePast);

    if (growthBonus > WEIGHTS.MIN_BONUS_VALUE) {
      bonusScore = growthBonus;
      correctnessBonusType = 'growth';
    }
  }

  // 3. 俊足解答ボーナス (効率)
  const quickAnswerBonus = calculateQuickAnswerBonus(testDurationMs, totalTestTimeSpendMs);
  const speedMultiplier = WEIGHTS.MIN_MULTIPLIER_BASE + quickAnswerBonus;

  // 4. 最終計算
  // (ベースXP + 成績ボーナス) に効率倍率を乗じる
  const baseXpCorrectness = (xpBase + bonusScore) * speedMultiplier;

  return {
    correctnessXpBase: xpBase,
    correctnessBonusScore: bonusScore,
    correctnessBonusType: correctnessBonusType,
    correctnessSpeedMultiplier: speedMultiplier,
    baseXpCorrectness,
  };
}
