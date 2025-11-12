import { TestSession } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { WEIGHTS } from '../constants/ex-weights';

// --- I. 生XP要素データ型 ---
// 重みをかける前の各XP要素の計算結果を保持する型
interface RawXPFactors {
  learningDurationMin: number;
  testEffortBonus: number;
  correctRate: number; // XP_正答率 (生データ)
  totalTestDurationMin: number; // XP_所要時間 (分)
  qualityScore: number; // XP_質 (生スコア)
}

// --- II. 最終XP計算関数 (重み付けと合算) ---
/**
 * XPの生データに重みを乗じ、最終的な合計XPを計算する。
 */
export function calculateTotalXP({
  session,
  testDurationMs,
  learningDurationMs,
}: {
  session: TestSession;
  testDurationMs: number;
  learningDurationMs: number;
}) {
  // あまりにも長い時間が入力されないよう制限
  testDurationMs = Math.min(testDurationMs, WEIGHTS.MAX_TEST_DURATION_MS);
  learningDurationMs = Math.min(learningDurationMs, WEIGHTS.MAX_LEANING_DURATION_MS);

  const totalProblems = session.results.length;

  if (totalProblems === 0) {
    // 問題がない場合は時間ベースのXPのみを計算
    const learningDurationMin = learningDurationMs / 60000;
    const xpTime = learningDurationMin * WEIGHTS.W_TIME;
    return Math.floor(xpTime);
  }

  // 生XP要素の計算
  const rawFactors = calculateRawXPFactors({ session, testDurationMs, learningDurationMs });

  let totalXP = 0;

  // --- B. 4つのXP要素の重み付けと合計 ---

  // 1. XP_時間 (勉強時間)
  const xpTime = rawFactors.learningDurationMin * WEIGHTS.W_TIME * (1 + rawFactors.testEffortBonus);
  totalXP += xpTime;

  // 2. XP_正答率 (成果)
  const xpCorrectness = rawFactors.correctRate * WEIGHTS.W_CORRECTNESS;
  totalXP += xpCorrectness;

  // 3. XP_所要時間 (テスト努力)
  const xpTestEffort = rawFactors.totalTestDurationMin * WEIGHTS.W_TEST_EFFORT;
  totalXP += xpTestEffort;

  // 4. XP_質 (自己評価と効率)
  const xpQuality = rawFactors.qualityScore * WEIGHTS.W_QUALITY;
  totalXP += xpQuality;

  return {
    correctRate: rawFactors.correctRate,
    qualityScore: rawFactors.qualityScore,
    xpTime,
    testEffortBonus: rawFactors.testEffortBonus,
    xpCorrectness,
    xpTestEffort,
    xpQuality,
    floatTotalXP: totalXP,
    totalXP: Math.floor(totalXP),
  };
}

// --- III. 生XP要素計算関数 (データ集計と係数算出) ---
/**
 * 最終的な重みを乗じる前の、各XP要素の生データを計算する。
 */
function calculateRawXPFactors({
  session,
  testDurationMs,
  learningDurationMs,
}: {
  session: TestSession;
  testDurationMs: number;
  learningDurationMs: number;
}): RawXPFactors {
  const totalProblems = session.results.length;
  // totalProblems === 0 のケースは呼び出し元 (calculateTotalXP) で処理済み

  // --- A. 基本データの集計 ---
  const correctCount = session.results.filter((r) => r.scoringStatus === 'correct').length;
  const totalTestTimeMs = Math.min(
    session.results.reduce((sum, r) => sum + r.timeSpentMs, 0),
    WEIGHTS.MAX_TEST_DURATION_MS
  );

  const learningDurationMin = learningDurationMs / 60000;
  const correctRate = correctCount / totalProblems;
  const totalTestDurationMin = totalTestTimeMs / 60000;

  // --- B. 4つのXP要素の生データの計算 ---

  // 1. XP_時間 (勉強時間) - W_TIMEを乗じて、テスト努力ボーナスを適用
  const testEffortBonus = calculateTestEffortBonus(testDurationMs, totalTestTimeMs);

  // 2. XP_正答率 - 生の正答率 (重みは外で適用)
  // correctRate はそのまま使用

  // 3. XP_所要時間 - テスト所要時間 (分) (重みは外で適用)
  // totalTestDurationMin はそのまま使用

  // 4. XP_質 - 自己評価と効率に基づく生スコア (重みは外で適用)
  const qualityScore = calculateQualityScore({
    session,
    totalProblems,
    totalTestTimeMs,
  });

  return {
    learningDurationMin,
    testEffortBonus,
    correctRate,
    totalTestDurationMin,
    qualityScore,
  };
}

/**
 * テストの効率性に基づき、XP_時間に乗じるボーナス係数を算出する。
 */
function calculateTestEffortBonus(testDurationMs: number, totalTestDurationMs: number): number {
  const W_TIME_BONUS_MAX = WEIGHTS.TEXT_EFFORT_BONUS_WEIGHTS.W_TIME_BONUS_MAX;
  const BONUS_CAP_RATIO = WEIGHTS.TEXT_EFFORT_BONUS_WEIGHTS.BONUS_CAP_RATIO;

  if (testDurationMs <= 0 || totalTestDurationMs <= 0) {
    return 0.0;
  }

  const maxTimeReductionForBonus = testDurationMs * (1 - BONUS_CAP_RATIO);

  if (maxTimeReductionForBonus <= 0) {
    return 0.0;
  }

  const actualTimeReduction = Math.max(0, testDurationMs - totalTestDurationMs);

  let bonusFactor = 0.0;

  if (actualTimeReduction > 0) {
    const effectiveReduction = Math.min(actualTimeReduction, maxTimeReductionForBonus);
    bonusFactor = (effectiveReduction / maxTimeReductionForBonus) * W_TIME_BONUS_MAX;
  }

  return bonusFactor;
}

/**
 * 勉強の質スコア (qualityScore) を計算する。
 */
function calculateQualityScore({
  session,
  totalProblems,
  totalTestTimeMs,
}: {
  session: TestSession;
  totalProblems: number;
  totalTestTimeMs: number;
}): number {
  if (totalProblems === 0) return 0.5;

  const timeThresholdMs =
    totalTestTimeMs > 0 && totalProblems > 0 ? totalTestTimeMs / totalProblems : 30000;

  let integratedQualityScoreSum = 0;

  for (const result of session.results) {
    let score = 0;

    // 1. 時間因子
    const timeRatio = timeThresholdMs / result.timeSpentMs;
    let timeScore = Math.min(
      WEIGHTS.QUALITY_WEIGHTS.TIME_SCORE_MAX,
      Math.max(WEIGHTS.QUALITY_WEIGHTS.TIME_SCORE_MIN, timeRatio)
    );

    // 2. 結果と自己評価に基づく最終調整
    const status = result.scoringStatus;
    const selfEval = result.selfEvaluation;

    if (status === 'correct' && selfEval === 'confident') {
      score = timeScore + WEIGHTS.QUALITY_WEIGHTS.IDEAL_BONUS_ADDITION;
    } else if (status === 'correct' && selfEval !== 'confident') {
      score = timeScore * WEIGHTS.QUALITY_WEIGHTS.LUCKY_GUESS_MULTIPLIER;
    } else if (status === 'incorrect' && selfEval === 'confident') {
      score = timeScore * WEIGHTS.QUALITY_WEIGHTS.OVERCONFIDENCE_MULTIPLIER;
    } else if (status === 'incorrect' && selfEval !== 'confident') {
      score = timeScore * WEIGHTS.QUALITY_WEIGHTS.HONEST_MISTAKE_MULTIPLIER;
    }

    // 統合スコアを 0.0 から 1.5 の間に正規化
    integratedQualityScoreSum += Math.min(
      WEIGHTS.QUALITY_WEIGHTS.MAX_SCORE_PER_PROBLEM,
      Math.max(0.0, score)
    );
  }

  // 最終的な統合質スコア (0から1に正規化)
  const finalQualityScore =
    integratedQualityScoreSum / (totalProblems * WEIGHTS.QUALITY_WEIGHTS.MAX_SCORE_PER_PROBLEM);

  return Math.min(1.0, finalQualityScore); // 最終的に 1.0 を超えないように保証
}
