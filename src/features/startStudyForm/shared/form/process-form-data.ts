import { range } from '@mantine/hooks';
import {
  CategoryDetail,
  LearningCycleProblem,
  ProblemNumberFormat,
  UnitDetail,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { safeArrayToRecord } from '@/shared/utils/object/object-utils';
import { RangeWithId } from '../range/range-form-types';
import {
  NewCategory,
  NewUnit,
  RangeFormData,
  StartStudyFormNewIdGenerator,
  StartStudyFormProblemMetadata,
} from './form-types';

/**
 * testRangeデータに基づき、既存のunits/categoriesと照合し、新規追加フラグ付きの統合リストを生成します。
 *
 * @param testRange testRangeデータ
 * @param units 既存のユニットリスト
 * @param categories 既存のカテゴリリスト
 * @param defaultTimePerProblem 新規カテゴリに timePerProblemForCategory がない場合のデフォルト時間
 * @param defaultProblemFormat 新規カテゴリに problemNumberFormatForCategory がない場合のデフォルト形式
 * @param generateNewId 新規ユニット/カテゴリの一時IDを生成する関数
 * @returns 新しいユニットとカテゴリのリスト（isNewフラグ付き）
 */
export function processProblemMetadata(
  testRange: RangeFormData[],
  units: UnitDetail[],
  categories: CategoryDetail[],
  defaultTimePerProblem: number,
  defaultProblemFormat: ProblemNumberFormat
): StartStudyFormProblemMetadata {
  // 1. 既存データの名前-IDマップを作成 (検索効率のため)
  const unitMap = new Map<string, UnitDetail>();
  units.forEach((u) => unitMap.set(u.name, u));

  const categoryMap = new Map<string, CategoryDetail>();
  categories.forEach((c) => categoryMap.set(c.name, c));

  // 2. 結果を格納する配列と、処理済み名前を追跡するSet
  const newUnits: NewUnit[] = [];
  const newCategories: NewCategory[] = [];

  const processedUnitNames = new Set<string>();
  const processedCategoryNames = new Set<string>();

  // 3. testRangeを反復処理し、統合リストを作成
  testRange.forEach((item) => {
    // --- ユニット (Unit) の処理 ---
    if (item.unitName && !processedUnitNames.has(item.unitName)) {
      processedUnitNames.add(item.unitName);

      const existingUnit = unitMap.get(item.unitName);

      if (existingUnit) {
        // 既存のユニット
        newUnits.push({
          ...existingUnit,
          isNew: false,
        });
      } else {
        // 新規ユニット
        newUnits.push({
          id: '',
          name: item.unitName,
          isNew: true,
        });
      }
    }

    // --- カテゴリ (Category) の処理 ---
    if (item.categoryName && !processedCategoryNames.has(item.categoryName)) {
      processedCategoryNames.add(item.categoryName);

      const existingCategory = categoryMap.get(item.categoryName);

      if (existingCategory) {
        // 既存のカテゴリ
        newCategories.push({
          ...existingCategory,
          isNew: false,
        });
      } else {
        // 新規カテゴリ (testRangeの情報を優先、なければデフォルト値を使用)
        newCategories.push({
          name: item.categoryName,
          // 外部関数でIDを生成
          id: '',
          timePerProblem: item.timePerProblemForCategory ?? defaultTimePerProblem,
          problemNumberFormat: item.problemNumberFormatForCategory ?? defaultProblemFormat,
          isNew: true,
        });
      }
    }
  });

  return { units: newUnits, categories: newCategories };
}

/**
 * フォームの範囲情報から問題リストと使用されたユニット/カテゴリのメタデータを生成する
 */
export const createProblemsAndUsedMetadata = (
  problemsWithRanges: {
    unitName: string;
    categoryName: string;
    ranges: RangeWithId[];
  }[],
  existingUnits: UnitDetail[],
  existingCategories: CategoryDetail[]
) => {
  const problems: LearningCycleProblem[] = [];
  const usedUnitIds: Set<string> = new Set();
  const usedCategoryIds: Set<string> = new Set();

  const unitMap = safeArrayToRecord(existingUnits, 'name');
  const categoryMap = safeArrayToRecord(existingCategories, 'name');

  let index = 0;
  for (const section of problemsWithRanges) {
    const unit = unitMap[section.unitName] || null;
    const category = categoryMap[section.categoryName] || null;

    if (unit) usedUnitIds.add(unit.id);
    if (category) usedCategoryIds.add(category.id);

    for (const rangeValue of section.ranges) {
      // range関数のendのデフォルト値ロジックを維持
      const end = rangeValue.end ?? rangeValue.start;
      for (const problemNumber of range(rangeValue.start, end)) {
        problems.push({
          index: index++, // indexをインクリメント
          problemNumber,
          unitId: unit ? unit.id : null,
          categoryId: category ? category.id : null,
        });
      }
    }
  }

  const unitIdMap = safeArrayToRecord(existingUnits, 'id');
  const categoryIdMap = safeArrayToRecord(existingCategories, 'id');

  // IDBから取得したTextbookのデータ構造（UnitDetail, CategoryDetail）をそのまま利用
  const usedUnits = Array.from(usedUnitIds).map((id) => unitIdMap[id]);
  const usedCategories = Array.from(usedCategoryIds).map((id) => categoryIdMap[id]);

  // undefinedチェックのガード。
  if (usedUnits.some((u) => !u) || usedCategories.some((c) => !c)) {
    throw new Error('問題メタデータ生成中に使用済みユニットまたはカテゴリの取得に失敗しました。');
  }

  return {
    problems,
    usedUnits: usedUnits as UnitDetail[],
    usedCategories: usedCategories as CategoryDetail[],
  };
};
