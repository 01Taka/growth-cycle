import { MantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { NecessityColorSet, ReviewNecessityColors } from '../constants/review-necessity-constants';

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
}

/**
 * 🎨 ReviewNecessityScoresの各レベルに対応する色情報を現在のテーマに基づいて取得するカスタムフック
 *
 * @param {ReviewNecessityScores} scores 確認必要度の計算結果
 * @returns {NecessityColors} 各スコアレベルに対応する色とラベルのセット
 */
export const useReviewNecessityColors = (scores: ReviewNecessityScores): NecessityColors => {
  const colorScheme: MantineColorScheme = useComputedColorScheme();
  const colorsByTheme = ReviewNecessityColors[colorScheme];

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

  // すべてのキーの色情報を取得して返す
  return {
    reviewNecessity: getColorsForLevel(scores.reviewNecessity),
    latestAttemptNecessity: getColorsForLevel(scores.latestAttemptNecessity),
    recentWeightedNecessity: getColorsForLevel(scores.recentWeightedNecessity),
  };
};
