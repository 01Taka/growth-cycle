import { differenceColorGrades, ratioBorders } from '../constants/difference-colors';
import { DifferenceGrade } from '../types/learning-history-types';

/**
 * 日数の差に基づいてDifferenceGradeオブジェクトを取得する関数
 * @param daysDifference 振り返り日との日数の差 (絶対値)
 * @returns 該当するDifferenceGradeオブジェクト、見つからない場合はnull
 */
export function getGradeByDifference(daysDifference: number): DifferenceGrade | null {
  const foundGrade = differenceColorGrades.find(
    (grade) => daysDifference <= grade.maxDifferenceDays
  );

  // 見つかった場合はそのDifferenceGradeオブジェクトを返し、見つからない場合はnullを返す
  return foundGrade || null;
}

// 既存のgetColorByDifference関数（参考として再掲）
/**
 * 日数の差に基づいてグラデーションカラーを取得する関数
 * @param daysDifference 振り返り日との日数の差 (絶対値)
 * @returns 該当するカラーコード
 */
export function getColorByDifference(daysDifference: number): string {
  const foundGrade = getGradeByDifference(daysDifference);
  return foundGrade ? foundGrade.color : '#FFFFFF';
}

/**
 * 0から1の割合に基づいて、simpleRatioBordersとdifferenceColorGradesから対応する色を決定し返します。
 *
 * @param {number} ratio - 0.0から1.0の間の値（割合）。
 * @returns {string} 対応する色名（例: 'red', 'green'）。
 */
export function getColorByRatio(ratio: number) {
  // 割合を0から1の間にクリップ
  const clippedRatio = Math.max(0, Math.min(1, ratio)); // 1. simpleRatioBorders を逆順にソートし、ratio >= border を満たす最初の要素を探す。
  // 逆順にすることで、最も近い上位の境界値（より大きなボーダー）から順に確認できる。

  const matchingBorder = [...ratioBorders]
    .sort((a, b) => b.border - a.border) // borderで降順にソート (0.9, 0.7, 0.5, ...)
    .find((item) => clippedRatio >= item.border); // 2. 一致するボーダーが見つかれば、その grade に対応する色を differenceColorGrades から検索する。

  if (matchingBorder) {
    const targetGrade = matchingBorder.grade;

    const colorMatch = differenceColorGrades.find((gradeItem) => gradeItem.grade === targetGrade);

    if (colorMatch) {
      return colorMatch.color;
    }
  } // 範囲外または一致するGradeが見つからなかった場合（通常は発生しない想定）

  return 'gray';
}
