// 仮定: 既存の関数をインポート

/**
 * 時間によるQualityスコア補正に関するパラメータ群。
 * Level 0とLevel 1で異なる遅延閾値を定義します。
 */
export const SM2_TIME_PARAMS = {
  FAST_THRESHOLD: 0.7, // 基準時間の70%未満 → 速い
  SLOW_THRESHOLD_Q5: 1.0, // Level 0 (Q5) の減点閾値: 基準時間以上
  SLOW_THRESHOLD_Q4: 1.3, // Level 1 (Q4) の減点閾値: 基準時間の130%以上
  ADJUSTMENT_STEP: 1, // 調整幅 (±1)
  MIN_QUALITY_AFTER_ADJ: 3, // 調整後の最小値
  MAX_QUALITY_AFTER_ADJ: 5, // 調整後の最大値
  TIME_RATIO_LIMIT: 5.0, // timeRatioの上限 (5倍)
};

/**
 * 復習必要度レベル → SM-2 Qualityスコア対応表。
 */
export const SM2_QUALITY_MAP = new Map<ReviewNecessityStage, number>([
  [0, 5], // 理解済み (Level 0)
  [1, 4], // 不完全正解 (Level 1)
  [2, 2], // 不安定/部分忘却 (Level 2)
  [3, 0], // 忘却 (Level 3)
]);

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
  const baseQuality = SM2_QUALITY_MAP.get(level) ?? 0;

  // --- 時間補正を適用 ---
  return adjustQualityByTime(baseQuality, timeSpentMs, refTimeMs);
}

// --------------------------------------------------------------------------------
// ⚠️ 実行用ダミーデータと既存関数の定義 (このファイル内では実際には動作しないが、ロジックを示す)
// --------------------------------------------------------------------------------

// 既存の型定義をダミーで作成
type ProblemScoringStatus = 'correct' | 'incorrect' | 'unrated';
type TestSelfEvaluation = 'confident' | 'imperfect' | 'notSure' | 'unrated';
type ReviewNecessityStage = 0 | 1 | 2 | 3;
type EvaluatedLabel =
  | 'overconfidenceError'
  | 'mistakeNotSure'
  | 'mistakeImperfect'
  | 'uncertainCorrect'
  | 'imperfectCorrect'
  | 'understood';
type UnratedLabel =
  | 'fullyUnrated'
  | 'scoreUnratedConfident'
  | 'scoreUnratedImperfect'
  | 'scoreUnratedNotSure'
  | 'selfUnratedCorrect'
  | 'selfUnratedIncorrect';
type EvaluatedResult = {
  level: ReviewNecessityStage;
  reason: EvaluatedLabel;
  alternativeLevel: ReviewNecessityStage;
};
type UnratedResult = { level: -1; reason: UnratedLabel; alternativeLevel: ReviewNecessityStage };
type ReviewNecessityResult = EvaluatedResult | UnratedResult;

// 既存の calculateReviewNecessity 関数 (ここではダミーロジックを簡略化)
function calculateReviewNecessity(
  selfEvaluation: TestSelfEvaluation,
  scoringStatus: ProblemScoringStatus
): ReviewNecessityResult {
  // 完全に評価済みのケース (ロジック4) のみを簡略化して再現
  if (scoringStatus === 'correct') {
    if (selfEvaluation === 'confident')
      return { level: 0, reason: 'understood', alternativeLevel: 0 } as EvaluatedResult;
    if (selfEvaluation === 'imperfect')
      return { level: 1, reason: 'imperfectCorrect', alternativeLevel: 1 } as EvaluatedResult;
    if (selfEvaluation === 'notSure')
      return { level: 2, reason: 'uncertainCorrect', alternativeLevel: 2 } as EvaluatedResult;
  }
  if (scoringStatus === 'incorrect') {
    if (selfEvaluation === 'confident')
      return { level: 3, reason: 'overconfidenceError', alternativeLevel: 3 } as EvaluatedResult;
    if (selfEvaluation === 'imperfect')
      return { level: 2, reason: 'mistakeImperfect', alternativeLevel: 2 } as EvaluatedResult;
    if (selfEvaluation === 'notSure')
      return { level: 2, reason: 'mistakeNotSure', alternativeLevel: 2 } as EvaluatedResult;
  }
  // 未評価のケースはここでは全てレベル3/Quality 0と見なす (簡略化のため)
  return { level: 3, reason: 'overconfidenceError', alternativeLevel: 3 } as EvaluatedResult;
}
