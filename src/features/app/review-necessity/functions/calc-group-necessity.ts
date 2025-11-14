import { GroupReviewNecessityResult, ReviewNecessityResult } from '../types/review-necessity-types';

// level > 1 は間違いと判断される条件
const IS_WRONG_LEVEL_THRESHOLD = 1;
// 評価レベルの定数
const LEVEL = {
  NO_REVIEW_NEEDED: 0,
  FAILED_SECOND_TO_LAST: 1,
  FAILED_LATEST: 2,
  CONSECUTIVE_MISTAKES: 3,
  INSUFFICIENT_RATED: -1,
} as const;
// 理由の定数
const REASON = {
  CONSECUTIVE_CORRECT: 'consecutiveCorrect',
  FAILED_LATEST: 'failedLatestAttempt',
  FAILED_SECOND_TO_LAST: 'failedSecondToLastAttempt',
  CONSECUTIVE_MISTAKES: 'consecutiveMistakes',
  INSUFFICIENT_RATED: 'insufficientRatedAttempts',
} as const;

/**
 * 渡された結果に基づいて、グループとしてレビューが必要かどうかを計算します。
 * @param sortedResults ソートされた (古いものから新しいものへ) レビューの必要性の結果の配列
 * @returns グループレビューの必要性を示す結果オブジェクト
 */
export const calculateGroupReviewNecessity = (
  sortedResults: ReviewNecessityResult[]
): GroupReviewNecessityResult => {
  // すべての結果に共通する基本の戻り値
  const baseResult: GroupReviewNecessityResult = {
    level: LEVEL.NO_REVIEW_NEEDED,
    alternativeLevel: LEVEL.NO_REVIEW_NEEDED,
    isGroup: true,
    isUnrated: false,
    reason: REASON.CONSECUTIVE_CORRECT,
  };

  // 1. データが足りない場合
  if (sortedResults.length <= 2) {
    return {
      ...baseResult,
      reason: REASON.INSUFFICIENT_RATED,
      level: LEVEL.INSUFFICIENT_RATED,
      isUnrated: true,
    };
  }

  // 3. 結果が2件以上の場合 (直近2件を評価)
  const [r1, r0] = sortedResults.slice(-2); // r1 = 2番目に新しい, r0 = 最新

  const isR0Wrong = r0.level > IS_WRONG_LEVEL_THRESHOLD; // 最新が間違い
  const isR1Wrong = r1.level > IS_WRONG_LEVEL_THRESHOLD; // 2番目に新しいのが間違い

  // 3a. 最新と2番目が両方間違い
  if (isR0Wrong && isR1Wrong) {
    return {
      ...baseResult,
      reason: REASON.CONSECUTIVE_MISTAKES,
      level: LEVEL.CONSECUTIVE_MISTAKES,
      alternativeLevel: LEVEL.CONSECUTIVE_MISTAKES,
    };
  }
  // 3b. 最新のみ間違い
  if (isR0Wrong) {
    return {
      ...baseResult,
      reason: REASON.FAILED_LATEST,
      level: LEVEL.FAILED_LATEST,
      alternativeLevel: LEVEL.FAILED_LATEST,
    };
  }
  // 3c. 2番目のみ間違い
  if (isR1Wrong) {
    return {
      ...baseResult,
      reason: REASON.FAILED_SECOND_TO_LAST,
      level: LEVEL.FAILED_SECOND_TO_LAST,
      alternativeLevel: LEVEL.FAILED_SECOND_TO_LAST,
    };
  }

  // 3d. どちらも間違いではない (level <= 1)
  // かつ、どちらも評価済み (unratedではない) の場合 -> 連続正解
  if (!r1.isUnrated && !r0.isUnrated) {
    return {
      ...baseResult,
      reason: REASON.CONSECUTIVE_CORRECT,
    };
  }

  // 3e. 上記のいずれにも該当しない場合 -> 未評価データを含むためデータ不足
  return {
    ...baseResult,
    reason: REASON.INSUFFICIENT_RATED,
    level: LEVEL.INSUFFICIENT_RATED,
    isUnrated: true,
  };
};
