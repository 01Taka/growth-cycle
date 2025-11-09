import {
  CategoryDetail,
  ProblemNumberFormat,
  UnitDetail,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { RangeFormData } from './form-types';

interface NewUnit extends UnitDetail {
  isNew: boolean;
}

interface NewCategory extends CategoryDetail {
  isNew: boolean;
}

interface ProcessedData {
  units: NewUnit[];
  categories: NewCategory[];
}

// 新規IDを生成するための関数の型定義
type NewIdGenerator = (type: 'unit' | 'category', counter: number) => string;

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
export function processTestData(
  testRange: RangeFormData[],
  units: UnitDetail[],
  categories: CategoryDetail[],
  defaultTimePerProblem: number,
  defaultProblemFormat: ProblemNumberFormat,
  generateNewId: NewIdGenerator
): ProcessedData {
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

  let unitCounter = 1;
  let categoryCounter = 1;

  // 3. testRangeを反復処理し、統合リストを作成
  testRange.forEach((item) => {
    // --- ユニット (Unit) の処理 ---
    if (!processedUnitNames.has(item.unitName)) {
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
          name: item.unitName,
          // 外部関数でIDを生成
          id: generateNewId('unit', unitCounter++),
          isNew: true,
        });
      }
    }

    // --- カテゴリ (Category) の処理 ---
    if (!processedCategoryNames.has(item.categoryName)) {
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
          id: generateNewId('category', categoryCounter++),
          timePerProblem: item.timePerProblemForCategory ?? defaultTimePerProblem,
          problemNumberFormat: item.problemNumberFormatForCategory ?? defaultProblemFormat,
          isNew: true,
        });
      }
    }
  });

  return { units: newUnits, categories: newCategories };
}
