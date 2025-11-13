// src/features/learning-history/hooks/useAggregatedSections.ts

import { useMemo } from 'react';
import { getGradeByDifference } from '../functions/history-grade-color-utils'; // 適切なパスに修正してください
import { AggregatedSection, DifferenceGrade } from '../types/learning-history-types'; // 適切なパスに修正してください

/**
 * 復習からの経過日数に基づいて、学習履歴のProgressバー用セクションデータを計算するカスタムフック
 * @param dateDifferencesFromReview - 各問題の復習からの経過日数の配列
 * @param totalProblemCount - 総問題数
 * @returns AggregatedSection[] - Progressバーに表示するための集約されたセクションデータの配列
 */
export const useAggregatedSections = (dateDifferencesFromReview: number[]): AggregatedSection[] => {
  // 1問題あたりの値 (パーセンテージ) を計算
  const valuePerSection =
    dateDifferencesFromReview.length > 0 ? 100 / dateDifferencesFromReview.length : 0;

  // aggregatedSections の計算を useMemo でメモ化する
  const aggregatedSections: AggregatedSection[] = useMemo(() => {
    if (valuePerSection === 0) return [];

    // Mapを使って、各Gradeごとに値 (value) を集計する
    const gradeMap = new Map<number, { value: number; gradeInfo: DifferenceGrade }>();

    dateDifferencesFromReview.forEach((diff) => {
      const grade = getGradeByDifference(diff);

      if (!grade) return;

      const current = gradeMap.get(grade.grade) || { value: 0, gradeInfo: grade };
      current.value += valuePerSection;
      gradeMap.set(grade.grade, current);
    });

    // Mapの値を配列に変換し、降順（grade: 5 -> 1）でソートする
    const sectionsArray = Array.from(gradeMap.values())
      .sort((a, b) => b.gradeInfo.grade - a.gradeInfo.grade)
      .map((item) => ({
        value: item.value,
        color: item.gradeInfo.color,
        description: item.gradeInfo.description,
        striped: item.gradeInfo.grade === 1, // grade 1 のみストライプにする
        grade: item.gradeInfo.grade,
      }));

    return sectionsArray;
  }, [dateDifferencesFromReview, valuePerSection]); // 依存配列

  return aggregatedSections;
};
