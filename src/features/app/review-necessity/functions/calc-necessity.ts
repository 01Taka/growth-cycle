import {
  ProblemScoringStatus,
  TestSelfEvaluation,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import {
  EvaluatedLabel,
  EvaluatedResult,
  ReviewNecessityResult,
  ReviewNecessityStage,
  UnratedLabel,
  UnratedResult,
} from '../types/review-necessity-types';

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
