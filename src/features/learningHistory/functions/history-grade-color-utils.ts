import { differenceColorGrades } from '../constants/difference-colors';
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
