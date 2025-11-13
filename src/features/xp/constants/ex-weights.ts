// 2. XP算出の重み定数 (W: Weight)
export const WEIGHTS = {
  // 基本のXP要素の重み (維持)
  W_LEARNING_TIME: 5.0, // 勉強時間 (分) あたりのXP
  W_CORRECTNESS: 5.0, // 正答率 (0-1) のXP重み
  W_TEST_EFFORT: 5.0, // テスト総所要時間 (分) あたりのXP
  W_QUALITY: 1000.0, // 勉強の質スコア (0-1) のXP重み
  MAX_LEANING_DURATION_MS: 3 * 60 * 60 * 1000, // 勉強時間の最大値(最大3時間)
  MAX_TEST_DURATION_MS: 3 * 60 * 60 * 1000, // テスト時間の最大値(最大3時間)
} as const;

/**
 * XP_正答率 (xpCorrectness) 計算に必要な定数
 * 議論に基づいて設定された初期値を含みます。
 */
export const XP_CORRECTNESS_WEIGHTS = {
  // 1. ベース XP の重み
  W_BASE: 100,

  // 2. 成長ボーナス関連
  MAX_GROWTH_BONUS_SCORE: 20,
  GROWTH_DIFF_CAP: 0.2, // 成長差分の上限 (0.2 = 20%の改善でキャップ)
  MIN_GROWTH_DIFFERENCE: 0, // 成長差分の最小値 (0%改善未満は無視)

  // 3. 高得点ボーナス関連
  HIGH_SCORE_THRESHOLD: 0.9, // 高得点と見なす正答率の閾値 (90%)
  W_HIGH_SCORE: 25, // 高得点ボーナスとして加算する固定値

  // 4. 俊足解答ボーナス関連
  // MAX_QUICK_ANSWER_BONUS は W_TIME_BONUS_MAX と同じ値を使用
  MAX_QUICK_ANSWER_BONUS: 0.2, // QuickAnswerBonus の最大値 (倍率は 1 + 0.2 = 1.2 まで)
  QUICK_ANSWER_CAP_RATIO: 0.8, // 俊足ボーナスの対象となる所要時間の最小割合 (20%の時間削減が上限)
  MIN_MULTIPLIER_BASE: 1.0, // 倍率のベース値 (1.0 + ボーナス)
  MIN_BONUS_VALUE: 0.0, // ボーナスや係数の最小値
} as const;

/**
 * XP_質 (baseXpQuality) 計算に必要な定数
 * qualityScoreの要素と労力倍率のパラメータを含む
 */
export const XP_QUALITY_WEIGHTS = {
  // --- A. qualityScore 関連 ---
  // 時間因子
  TIME_SCORE_MAX: 2.0, // timeRatioのスコア上限
  TIME_SCORE_MIN: 0.1, // timeRatioのスコア下限
  MAX_SCORE_PER_PROBLEM: 1.5, // 1問あたりの統合スコアの上限 (最終正規化に使用)

  // 結果と自己評価による調整
  IDEAL_BONUS_ADDITION: 0.5, // 正解 & 自信あり (理想) の追加ボーナス
  LUCKY_GUESS_MULTIPLIER: 0.7, // 正解 & 自信なし (まぐれ) の乗数
  IMPERFECT_MULTIPLIER: 0.7, // 曖昧を選んだときの乗数
  OVERCONFIDENCE_MULTIPLIER: 0.4, // 不正解 & 自信あり (過信) の乗数
  HONEST_MISTAKE_MULTIPLIER: 0.9, // 不正解 & 自信なし (正直な間違い) の乗数
  UNRATED_MULTIPLIER: 0.5,

  DEFAULT_TIME_THRESHOLD_MS: 30000, // 1問あたりのデフォルトの時間閾値 (ms, totalTestTimeSpendMs/totalProblemsが計算できない場合)
  ZERO_PROBLEMS_QUALITY_SCORE: 0.5, // 問題数がゼロの場合に返すベーススコア
  MIN_INTEGRATED_SCORE: 0.0, // 統合スコアの最小値

  // --- B. 最終 XP 計算 (労力倍率) 関連 ---
  EFFORT_K: 0.7, // 労力倍率の指数 K (0 < k < 1)
  EFFORT_MAX_MULTIPLIER: 16.0, // 労力倍率の上限 (maxTime)
} as const;
