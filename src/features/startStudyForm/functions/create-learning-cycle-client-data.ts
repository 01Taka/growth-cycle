import { Timestamp } from 'firebase/firestore';
import { LearningCycleClientData } from '@/shared/data/documents/learning-cycle/learning-cycle-derived';
import {
  CategoryDetail,
  TestMode,
  UnitDetail,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { Creations } from '@/shared/types/creatable-form-items-types';
import { StartStudyFormCreatableItems, StartStudyFormValues } from '../shared/form/form-types';

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
  textbookId: string,
  value: StartStudyFormValues
): LearningCycleClientData {
  // LearningSettings.problemsの構築
  const problems = value.testRange.map((p, index) => ({
    index: index, // LearningCycle内で一意の相対インデックス
    unitId: p.unit ?? 'unknown_unit', // undefinedの可能性を考慮
    categoryId: p.category ?? 'unknown_category', // undefinedの可能性を考慮
    problemNumber: p.problemNumber,
  }));

  // LearningCycleの構築
  const learningCycle: LearningCycleClientData = {
    textbookId,
    testMode: (value.testMode as TestMode) ?? 'memory', // nullの場合のフォールバック
    // studyTimeMinがnullの場合、0msとする
    learningDurationMs: (value.studyTimeMin ?? 0) * 60 * 1000,
    testDurationMs: value.testTimeMin * 60 * 1000,
    problems,
  };

  return learningCycle;
}
