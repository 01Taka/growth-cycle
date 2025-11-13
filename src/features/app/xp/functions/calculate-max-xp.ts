import { WEIGHTS, XP_CORRECTNESS_WEIGHTS } from '../constants/ex-weights';
import { PLANT_GROWTH_PX_MAP } from '../constants/plant-growth-xp';
import { calculateXPLearningTime, calculateXPPlantGrowth } from './calculateXP';

/**
 * 経験値 (XP) の理論上の最大値を計算する関数。
 * 提供された定数ファイルと計算ロジックに基づき、各XP要素の最大値を合計する。
 *
 * @returns 計算された最大XP
 */
export function calculateMaxXP(): number {
  // 1. XP_時間 (勉強時間) の最大値
  // learningDurationMsの最大値: MAX_LEANING_DURATION_MS (3時間 = 180分)
  const maxLearningDurationMs = WEIGHTS.MAX_LEANING_DURATION_MS;
  const baseXpLearningTime = calculateXPLearningTime(maxLearningDurationMs);
  const maxXP_LearningTime = baseXpLearningTime * WEIGHTS.W_LEARNING_TIME; // 180 * 5.0 = 900.0

  // 2. XP_正答率 (成果と効率) の最大値
  // - correctRate (正答率) は 1.0 (100%)
  // - 過去の平均正答率 avgCorrectRatePast は 0.0 のとき、成長ボーナスは最大
  // - 高得点ボーナス (correctRate >= 0.9) は 100% のため適用
  // - 俊足解答ボーナス (speedMultiplier) は最大

  // A. ベースXP: 1.0 * W_BASE (100) = 100
  const xpBaseMax = 1.0 * XP_CORRECTNESS_WEIGHTS.W_BASE; // 100

  // B. 成績ボーナス: 正答率1.0で高得点ボーナスが適用される
  const maxBonusScore = XP_CORRECTNESS_WEIGHTS.W_HIGH_SCORE; // 25

  // C. 俊足解答ボーナス: maxMultiplier = 1.0 + MAX_QUICK_ANSWER_BONUS
  const maxSpeedMultiplier =
    XP_CORRECTNESS_WEIGHTS.MIN_MULTIPLIER_BASE + XP_CORRECTNESS_WEIGHTS.MAX_QUICK_ANSWER_BONUS; // 1.0 + 0.2 = 1.2

  // D. 最終計算: (ベースXP + ボーナス) * 倍率 * 重み
  // (100 + 25) * 1.2 * W_CORRECTNESS (5.0)
  const maxXP_Correctness =
    (xpBaseMax + maxBonusScore) * maxSpeedMultiplier * WEIGHTS.W_CORRECTNESS;
  // 125 * 1.2 * 5.0 = 750.0

  // 3. XP_質 (自己評価と労力) の最大値
  // - baseQualityScore (calculateQualityScore): 理想的な条件 (correct & confident, timeRatio=TIME_SCORE_MAX=2.0)
  //   - 1問あたりの最大スコア: MAX_SCORE_PER_PROBLEM (1.5)
  //   - 質スコアの最大値は 1.0 に正規化される (理想: totalProblems * 1.5 / totalProblems * 1.5 = 1.0)
  const maxBaseQualityScore = 1.0;

  // - effortDurationScore (労力倍率): totalTestTimeSpendMin を無限大に近い値としたとき 1.0 に漸近する
  const maxEffortDurationScore = 1.0;

  // - 最終計算: ベーススコア * 労力スコア * 最終重み
  // 1.0 * 1.0 * W_QUALITY (1000.0)
  const maxXP_Quality = maxBaseQualityScore * maxEffortDurationScore * WEIGHTS.W_QUALITY; // 1000.0

  // 4. XP_成長 (プラント成長) の最大値
  // PLANT_GROWTH_PX_MAP の値の中で最大のもの
  const maxPlantStage = Math.max(...Object.keys(PLANT_GROWTH_PX_MAP).map(Number));
  const maxXP_PlantGrowth = calculateXPPlantGrowth(maxPlantStage); // 1000.0

  // 5. 合計XP
  const floatMaxXP = maxXP_LearningTime + maxXP_Correctness + maxXP_Quality + maxXP_PlantGrowth;

  return floatMaxXP;
}

// 実行例
// const MAX_XP = calculateMaxXP();
// console.log(`理論上の最大XP: ${MAX_XP}`);
