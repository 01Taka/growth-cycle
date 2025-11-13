export type ReviewNecessityStage = 0 | 1 | 2 | 3;

// --- 評価済み（レベル 0-3）の理由 ---
export type EvaluatedLabel =
  | 'overconfidenceError' // 3: 間違い + 確信あり (Incorrect + Confident)
  | 'mistakeNotSure' // 2: 間違い + 分からない (Incorrect + NotSure)
  | 'mistakeImperfect' // 2: 間違い + 不完全 (Incorrect + Imperfect)
  | 'uncertainCorrect' // 2: 正解 + 分からない (Correct + NotSure)
  | 'imperfectCorrect' // 1: 正解 + 不完全 (Correct + Imperfect)
  | 'understood'; // 0: 正解 + 確信あり (Correct + Confident)

// --- 未評価（レベル -1）の理由 ---
export type UnratedLabel =
  | 'fullyUnrated' // 未採点 + 未評価 (Unrated + Unrated)
  | 'scoreUnratedConfident' // 未採点 + 確信あり (Unrated + Confident)
  | 'scoreUnratedImperfect' // 未採点 + 不完全 (Unrated + Imperfect)
  | 'scoreUnratedNotSure' // 未採点 + 分からない (Unrated + NotSure)
  | 'selfUnratedCorrect' // 正解 + 未評価 (Correct + Unrated)
  | 'selfUnratedIncorrect'; // 間違い + 未評価 (Incorrect + Unrated)

/**
 * 評価済みの結果型 (levelが0〜3のとき)
 */
export type EvaluatedResult = {
  level: ReviewNecessityStage; // 0, 1, 2, 3
  reason: EvaluatedLabel;
  // 評価済みの場合、alternativeLevelはlevelと同じ値になる
  alternativeLevel: ReviewNecessityStage;
};

/**
 * 未評価の結果型 (levelが-1のとき)
 */
export type UnratedResult = {
  level: -1;
  reason: UnratedLabel;
  // 未評価の場合でも、代替レベルは必ず提供される
  alternativeLevel: ReviewNecessityStage;
};

// 最終的な結果型は、評価済みか未評価かのどちらか
export type ReviewNecessityResult = EvaluatedResult | UnratedResult;
