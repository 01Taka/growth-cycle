import { Timestamp } from 'firebase/firestore';
import { LearningCycleClientData } from '@/shared/data/documents/learning-cycle/learning-cycle-derived';
import {
  CategoryDetail,
  TestMode,
  UnitDetail,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { Creations } from '@/shared/types/creatable-form-items-types';
import { Subject } from '@/shared/types/subject-types';
import { StartStudyFormCreatableItems, StartStudyFormValues } from '../types/form-types';

/**
 * 入力データからTestSessionが空のLearningCycleを構築します。
 *
 * @param textbookId 紐づける問題集のID。
 * @param subject 問題集の科目。
 * @param value テスト設定および時間に関する入力データ。
 * @param creations ユニットとカテゴリの詳細（IDと名前）に関する補助データ。
 * @returns 構築された LearningCycle オブジェクト。
 */
export function createEmptyLearningCycle(
  textbook: {
    id: string;
    subject: Subject;
    name: string;
  },
  value: StartStudyFormValues,
  creations: Creations<StartStudyFormCreatableItems>
): LearningCycleClientData {
  const now = Timestamp.now();

  // unitsとcategoriesのMappingを作成
  const unitMap = new Map<string, string>(); // <ID, Name>
  creations.units?.forEach((u) => unitMap.set(u.value, u.label));

  const categoryMap = new Map<string, string>(); // <ID, Name>
  creations.categories?.forEach((c) => categoryMap.set(c.value, c.label));

  // LearningSettings.unitsの構築
  const learningUnits: UnitDetail[] = value.units
    .map((unitId) => {
      const unitName = unitMap.get(unitId);
      // UnitDetailの型に合わせるため、IDと名前が必須
      return unitName ? { id: unitId, name: unitName } : null;
    })
    .filter((u): u is UnitDetail => u !== null);

  // LearningSettings.categoriesの構築
  // value.testRangeに含まれるカテゴリIDの一意なセットを取得
  const uniqueCategoryIds = Array.from(
    new Set(value.testRange.map((p) => p.category).filter((c): c is string => c !== undefined))
  );
  const learningCategories: CategoryDetail[] = uniqueCategoryIds
    .map((categoryId) => {
      const categoryName = categoryMap.get(categoryId);
      // CategoryDetailの型に合わせるため、IDと名前が必須
      return categoryName ? { id: categoryId, name: categoryName } : null;
    })
    .filter((c): c is CategoryDetail => c !== null);

  // LearningSettings.problemsの構築
  const problems = value.testRange.map((p, index) => ({
    index: index, // LearningCycle内で一意の相対インデックス
    unitId: p.unit ?? 'unknown_unit', // undefinedの可能性を考慮
    categoryId: p.category ?? 'unknown_category', // undefinedの可能性を考慮
    problemNumber: p.problemNumber,
  }));

  // LearningCycleの構築
  const learningCycle: LearningCycleClientData = {
    textbookId: textbook.id,
    testMode: (value.testMode as TestMode) ?? 'memory', // nullの場合のフォールバック
    // studyTimeMinがnullの場合、0msとする
    learningDurationMs: (value.studyTimeMin ?? 0) * 60 * 1000,
    testDurationMs: value.testTimeMin * 60 * 1000,
    problems,
  };

  return learningCycle;
}
