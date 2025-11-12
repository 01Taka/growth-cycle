// 2. XP算出の重み定数 (W: Weight)
export const WEIGHTS = {
  // 基本のXP要素の重み (維持)
  W_TIME: 5.0, // 勉強時間 (分) あたりのXP
  W_CORRECTNESS: 200.0, // 正答率 (0-1) のXP重み
  W_TEST_EFFORT: 5.0, // テスト総所要時間 (分) あたりのXP
  W_QUALITY: 500.0, // 勉強の質スコア (0-1) のXP重み
  TEXT_EFFORT_BONUS_WEIGHTS: {
    W_TIME_BONUS_MAX: 0.2,
    BONUS_CAP_RATIO: 0.8,
  },
  MAX_LEANING_DURATION_MS: 3 * 60 * 60 * 1000, // 勉強時間の最大値(最大3時間)
  MAX_TEST_DURATION_MS: 3 * 60 * 60 * 1000, // テスト時間の最大値(最大3時間)

  // 統合質スコア (Integrated Quality Score) の調整定数
  QUALITY_WEIGHTS: {
    // 1. 時間因子の評価範囲
    TIME_SCORE_MAX: 2.0, // timeRatio の最大許容値
    TIME_SCORE_MIN: 0.5, // timeRatio の最小許容値

    // 2. 結果と自己評価に基づく最終調整 (加算・乗算係数)
    // A. 理想形: 正解 + 自信あり
    IDEAL_BONUS_ADDITION: 0.5,

    // B. 偶然/不完全な正解: 正解 + 自信なし/中
    LUCKY_GUESS_MULTIPLIER: 0.7,

    // C. 最も非効率: 不正解 + 自信あり (過信)
    OVERCONFIDENCE_MULTIPLIER: 0.3,

    // D. 正直な不正解: 不正解 + 自信なし/中
    HONEST_MISTAKE_MULTIPLIER: 0.5,

    // 3. 正規化のための最大値
    MAX_SCORE_PER_PROBLEM: 1.5, // 1問題あたりの最大スコア (理想形: timeScore(1.0) + bonus(0.5))
  },
};
