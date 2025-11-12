import {
  ProblemScoringStatus, // 'correct', 'incorrect', 'unrated'
  TestSelfEvaluation, // 'confident', 'imperfect', 'notSure', 'unrated'
} from '../data/documents/learning-cycle/learning-cycle-support';

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

/**
 * 復習の必要度を計算します。
 * すべての入力の組み合わせに対して一意のラベルを返します。
 *
 * @param selfEvaluation ユーザーの自己評価
 * @param scoringStatus 問題の採点ステータス
 * @returns 復習レベルと理由 (alternativeLevelを必ず含む)
 */
export function calculateReviewNecessity(
  selfEvaluation: TestSelfEvaluation,
  scoringStatus: ProblemScoringStatus
): ReviewNecessityResult {
  // --- 1. 完全未評価のケース ('unrated' + 'unrated') ---
  if (scoringStatus === 'unrated' && selfEvaluation === 'unrated') {
    return {
      level: -1,
      reason: 'fullyUnrated',
      alternativeLevel: 0, // 採点結果がないため、最も安全なレベル（0）を代替とする
    } as UnratedResult;
  }
  // --- 2. 採点結果が未評価のケース (scoringStatus === 'unrated', selfEvaluation !== 'unrated') ---
  else if (scoringStatus === 'unrated') {
    let reason: UnratedLabel;
    switch (selfEvaluation) {
      case 'confident':
        reason = 'scoreUnratedConfident';
        break;
      case 'imperfect':
        reason = 'scoreUnratedImperfect';
        break;
      case 'notSure':
        reason = 'scoreUnratedNotSure';
        break;
      case 'unrated': // TypeScriptのフロー解析を満足させるために必要だが、論理的には到達しない
        reason = 'fullyUnrated';
        break;
    }
    return {
      level: -1,
      reason: reason,
      alternativeLevel: 0, // 採点結果がないため、代替は0
    } as UnratedResult;
  }
  // --- 3. 自己評価が未評価のケース (selfEvaluation === 'unrated', scoringStatus !== 'unrated') ---
  else if (selfEvaluation === 'unrated') {
    const isCorrect = scoringStatus === 'correct';
    const alternativeLevel = isCorrect ? 0 : 2;
    const reason = isCorrect ? 'selfUnratedCorrect' : 'selfUnratedIncorrect';

    return {
      level: -1,
      reason: reason as UnratedLabel,
      alternativeLevel: alternativeLevel as ReviewNecessityStage,
    } as UnratedResult;
  }
  // --- 4. 完全評価済みのケース (レベル 0-3) ---
  else {
    let level: ReviewNecessityStage;
    let reason: EvaluatedLabel;

    if (scoringStatus === 'correct') {
      // ✅ 正解のとき:
      switch (selfEvaluation) {
        case 'confident':
          level = 0;
          reason = 'understood';
          break;
        case 'imperfect':
          level = 1;
          reason = 'imperfectCorrect';
          break;
        case 'notSure':
          level = 2;
          reason = 'uncertainCorrect';
          break;
        default:
          // throw new Error("Unexpected state in evaluated block.");
          level = 0;
          reason = 'understood';
          break;
      }
    } else {
      // scoringStatus === 'incorrect' (❌ 間違いのとき):
      switch (selfEvaluation) {
        case 'confident':
          level = 3;
          reason = 'overconfidenceError'; // 最優先
          break;
        case 'imperfect':
          level = 2;
          reason = 'mistakeImperfect';
          break;
        case 'notSure':
          level = 2;
          reason = 'mistakeNotSure';
          break;
        default:
          // throw new Error("Unexpected state in evaluated block.");
          level = 2;
          reason = 'mistakeNotSure';
          break;
      }
    }

    return {
      level: level,
      reason: reason,
      alternativeLevel: level, // level (0-3) と alternativeLevel を同期
    } as EvaluatedResult;
  }
}
