import { MantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { REVIEW_NECESSITY_COLORS } from '../constants/review-necessity-constants';
import { calculateReviewNecessityFromLatestAttempt } from '../functions/calculate-review-necessity';
import { AttemptLog, FinalReviewNecessityResult, NecessityColorSet } from '../types/problem-types';

export interface ReviewNecessityScores {
  reviewNecessity: number;
  latestAttemptNecessity: number;
  recentWeightedNecessity: number;
}

/**
 * 💡 戻り値の型: 各スコアに対応するNecessityColorSetを含むオブジェクト
 */
export interface NecessityColors {
  reviewNecessity: NecessityColorSet;
  latestAttemptNecessity: NecessityColorSet;
  recentWeightedNecessity: NecessityColorSet;
  getNecessityColor: (attempt: AttemptLog | null) => NecessityColorSet;
}

/**
 * 🎨 ReviewNecessityScoresの各レベルに対応する色情報を現在のテーマに基づいて取得するカスタムフック
 *
 * @param {ReviewNecessityScores} scores 確認必要度の計算結果
 * @returns {NecessityColors} 各スコアレベルに対応する色とラベルのセット
 */
export const useReviewNecessityColorsByScores = (
  scores: FinalReviewNecessityResult
): NecessityColors => {
  const colorScheme: MantineColorScheme = useComputedColorScheme();
  const colorsByTheme = REVIEW_NECESSITY_COLORS[colorScheme];

  /**
   * スコアレベルに基づいた色情報を安全に取得するヘルパー関数
   * @param {number} level スコアレベル (0-3)
   * @returns {NecessityColorSet} 対応するカラーセット
   */
  const getColorsForLevel = (level: number): NecessityColorSet => {
    // スコアレベルは 0, 1, 2, 3 のいずれかであることを想定
    const colorSet = colorsByTheme[level];

    if (colorSet) {
      return colorSet;
    }

    // 予期せぬ値の場合（safety fallback）：レベル0の色を返す
    console.warn(`Unexpected reviewNecessity level: ${level}. Returning level 0 colors.`);
    return colorsByTheme[0];
  };

  const getNecessityColor = (attempt: AttemptLog | null) => {
    const colNecessity = attempt
      ? calculateReviewNecessityFromLatestAttempt(attempt)
      : { level: 0 };
    const necessityColor = REVIEW_NECESSITY_COLORS[colorScheme][colNecessity.level];
    return necessityColor;
  };

  // すべてのキーの色情報を取得して返す
  return {
    reviewNecessity: getColorsForLevel(scores.reviewNecessity),
    latestAttemptNecessity: getColorsForLevel(scores.latestAttemptNecessity.level),
    recentWeightedNecessity: getColorsForLevel(scores.recentWeightedNecessity.level),
    getNecessityColor,
  };
};
