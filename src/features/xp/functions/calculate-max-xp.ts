import { WEIGHTS, XP_CORRECTNESS_WEIGHTS, XP_QUALITY_WEIGHTS } from '../constants/ex-weights';
import { PLANT_GROWTH_PX_MAP } from '../constants/plant-growth-xp';

/**
 * XP最大値の結果を格納する型定義
 */
export type MaxXPResults = {
  maxXPLearningTime: number;
  maxXPCorrectness: number;
  maxXPQuality: number;
  maxXPPlantGrowth: number;
  maxTotalXP: number;
};

/**
 * XP_時間 (xpLearningTime) の理論上の最大値を計算する。
 * (MAX_LEANING_DURATION_MS × W_LEARNING_TIME)
 */
function getMaxXPLearningTime(): number {
  const maxLearningDurationMin = WEIGHTS.MAX_LEANING_DURATION_MS / 60000;
  // W_LEARNING_TIME の重みは 5.0
  const maxXP = maxLearningDurationMin * (WEIGHTS.W_LEARNING_TIME ?? 1.0);
  // (3 * 60 * 60 * 1000) / 60000 = 180 (分)
  // 180 * 5.0 = 900.0
  return maxXP;
}

/**
 * XP_正答率 (xpCorrectness) の理論上の最大値を計算する。
 * (正答率1.0, 高得点ボーナス適用, 最大俊足倍率適用)
 */
function getMaxXPCorrectness(): number {
  // 1. ベースXPの最大値 (correctRate = 1.0)
  const maxXpBase = 1.0 * XP_CORRECTNESS_WEIGHTS.W_BASE; // 100

  // 2. 成績ボーナスの最大値
  // 成長ボーナス (MAX_GROWTH_BONUS_SCORE: 20) と
  // 高得点ボーナス (W_HIGH_SCORE: 25) を比較し、大きい方を採用
  // calculateXPCorrectness のロジックでは両者は排他であるため、maxを取る
  const maxBonusScore = Math.max(
    XP_CORRECTNESS_WEIGHTS.W_HIGH_SCORE,
    XP_CORRECTNESS_WEIGHTS.MAX_GROWTH_BONUS_SCORE
  ); // 25

  // 3. 効率倍率の最大値 (俊足解答ボーナスが最大値のとき)
  const maxQuickAnswerBonus = XP_CORRECTNESS_WEIGHTS.MAX_QUICK_ANSWER_BONUS; // 0.2
  const maxSpeedMultiplier = XP_CORRECTNESS_WEIGHTS.MIN_MULTIPLIER_BASE + maxQuickAnswerBonus; // 1.0 + 0.2 = 1.2

  // 4. 最終計算
  // (Max Base XP + Max Bonus Score) * Max Speed Multiplier
  const baseXpCorrectnessMax = (maxXpBase + maxBonusScore) * maxSpeedMultiplier;

  const maxXPCorrectness = baseXpCorrectnessMax * (WEIGHTS.W_CORRECTNESS ?? 1.0);
  return maxXPCorrectness;
}

/**
 * XP_質 (xpQuality) の理論上の最大値を計算する。
 * (qualityScore = 1.0, effortMultiplier = 2.0)
 */
function getMaxXPQuality(): number {
  // EFFORT_MAX_MULTIPLIER (労力倍率の上限) は 2.0
  const { EFFORT_MAX_MULTIPLIER } = XP_QUALITY_WEIGHTS;

  // 1. ベース質スコアの最大値 (1.0) - calculateQualityScoreの結果の最大値
  const baseQualityScoreMax = 1.0;

  // 2. 労力倍率の最大値
  const effortMultiplierMax = EFFORT_MAX_MULTIPLIER; // 2.0

  // 3. baseXpQuality の最大値 (1.0 * 2.0)
  const baseXpQualityMax = baseQualityScoreMax * effortMultiplierMax; // 2.0

  // 4. 最終 XP (baseXpQualityMax * W_QUALITY)
  // W_QUALITY の重みは 500.0
  const maxXPQuality = baseXpQualityMax * (WEIGHTS.W_QUALITY ?? 1.0);
  // 2.0 * 500.0 = 1000.0
  return maxXPQuality;
}

/**
 * XP_成長 (xpPlantGrowth) の理論上の最大値を計算する。
 * (PLANT_GROWTH_PX_MAP の最大値)
 */
function getMaxXPPlantGrowth(): number {
  // PLANT_GROWTH_PX_MAPの値の中から最大値を見つける
  const values = Object.values(PLANT_GROWTH_PX_MAP);
  // 最大値は 1000
  const maxXP = values.length > 0 ? Math.max(...values) : 0;
  return maxXP;
}

// ----------------------------------------------------------------------
// 最終結果をまとめるメイン関数
// ----------------------------------------------------------------------

/**
 * すべてのXP要素の理論上の最大値を計算し、結果をまとめて返す。
 * @returns MaxXPResults 型のオブジェクト
 */
export function calculateMaxTotalXP(): MaxXPResults {
  // 1. 各XPの最大値を計算
  const maxXPLearningTime = getMaxXPLearningTime();
  const maxXPCorrectness = getMaxXPCorrectness();
  const maxXPQuality = getMaxXPQuality();
  const maxXPPlantGrowth = getMaxXPPlantGrowth();

  // 2. 総XPの最大値を計算
  const maxTotalXP = maxXPLearningTime + maxXPCorrectness + maxXPQuality + maxXPPlantGrowth;
  // 900.0 + 52500.0 + 1000.0 + 1000.0 = 55400.0

  // 3. 結果をオブジェクトにまとめて返す
  return {
    maxXPLearningTime,
    maxXPCorrectness,
    maxXPQuality,
    maxXPPlantGrowth,
    maxTotalXP: Math.floor(maxTotalXP), // 最終的な総XPは通常、整数に切り捨てられる
  };
}
