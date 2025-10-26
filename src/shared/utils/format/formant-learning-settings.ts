import { FormatLearningSettings } from '@/shared/types/format-learning-cycle-types';
import { LearningSettings } from '@/shared/types/learning-cycle-types';

/**
 * LearningSettingsを拡張し、unitMap, categoryMap、
 * problemsにunitNameとcategoryNameを追加します。
 *
 * @param settings 元のLearningSettingsオブジェクト
 * @returns 拡張されたLearningSettingsオブジェクト
 */
export function formatLearningSettings(
  settings: LearningSettings // 新しいプロパティを除外した型（元の型）
): FormatLearningSettings {
  // 1. unitMapとcategoryMapの生成
  const unitMap: Record<string, string> = settings.units.reduce(
    (acc, unit) => {
      acc[unit.id] = unit.name;
      return acc;
    },
    {} as Record<string, string>
  );

  const categoryMap: Record<string, string> = settings.categories.reduce(
    (acc, category) => {
      acc[category.id] = category.name;
      return acc;
    },
    {} as Record<string, string>
  );

  // 2. problemsにunitNameとcategoryNameを追加
  const newProblems = settings.problems.map((problem) => {
    const unitName = unitMap[problem.unitId] || 'Unknown Unit'; // IDに対応する名前を取得。見つからない場合のフォールバックを設定
    const categoryName = categoryMap[problem.categoryId] || 'Unknown Category'; // IDに対応する名前を取得。見つからない場合のフォールバックを設定

    return {
      ...problem,
      unitName,
      categoryName,
    };
  });

  // 3. 新しいプロパティを追加して返す
  return {
    ...settings,
    unitMap,
    categoryMap,
    problems: newProblems,
  };
}
