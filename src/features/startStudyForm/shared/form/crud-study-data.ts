import * as z from 'zod';
import { LearningCycleClientData } from '@/shared/data/documents/learning-cycle/learning-cycle-derived';
import {
  LearningCycle,
  LearningCycleSchema,
} from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  Textbook,
  TextbookDocument,
  TextbookSchema,
} from '@/shared/data/documents/textbook/textbook-document';
import { generateFirestoreId, generateIdbPath } from '@/shared/data/idb/generate-path';
import { IDB_PATH } from '@/shared/data/idb/idb-path';
import { idbStore } from '@/shared/data/idb/idb-store';
import { StartStudyFormProblemMetadata } from './form-types';

/**
 * Textbookドキュメントの更新処理
 */
const handleUpdateTextbook = async (
  path: string,
  textbook: TextbookDocument,
  problemMeta: StartStudyFormProblemMetadata
): Promise<void> => {
  const existingUnitIds = new Set(textbook.units.map((unit) => unit.id));
  const existingCategoryIds = new Set(textbook.categories.map((unit) => unit.id));

  // 新規ユニットには新しいIDを生成
  const newUnits = problemMeta.units
    .filter((unit) => !existingUnitIds.has(unit.id))
    .map((unit) => ({ ...unit, id: generateFirestoreId() }));

  // 新規カテゴリには新しいIDを生成
  const newCategories = problemMeta.categories
    .filter((category) => !existingCategoryIds.has(category.id))
    .map((category) => ({ ...category, id: generateFirestoreId() }));

  const newTextbook: Textbook = {
    ...textbook,
    units: [...textbook.units, ...newUnits],
    categories: [...textbook.categories, ...newCategories],
  };

  try {
    // Textbookスキーマのバリデーション
    TextbookSchema.parse(newTextbook);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Textbookバリデーション失敗: ${error}`);
    }
    throw new Error('Textbookバリデーション中に予期せぬエラーが発生しました');
  }

  try {
    // IDBの更新
    await idbStore.update(path, newTextbook);
  } catch (error) {
    throw new Error(`IDBへのTextbook更新に失敗しました (Path: ${path})`);
  }
};

/**
 * 学習データ（LearningCycle）の作成とTextbookデータの更新処理
 */
export const curdStudyData = async (
  clientData: LearningCycleClientData,
  problemMeta: StartStudyFormProblemMetadata,
  nextReviewDate: string
) => {
  const newLearningCyclePath = generateIdbPath(IDB_PATH.learningCycles, '', true);
  const textbookPath = generateIdbPath(IDB_PATH.textbooks, clientData.textbookId);

  let textbook: TextbookDocument | null = null;
  try {
    // IDBからTextbookドキュメントを取得
    textbook = await idbStore.get<TextbookDocument>(textbookPath);
  } catch (error) {
    throw new Error(`IDBからTextbookの取得に失敗しました (Path: ${textbookPath})`);
  }

  if (!textbook) {
    // Textbookが見つからなかった場合のエラー
    throw new Error(
      `指定されたTextbookが見つかりません (ID: ${clientData.textbookId}, Path: ${textbookPath})`
    );
  }

  // Textbookの更新処理
  await handleUpdateTextbook(textbookPath, textbook, problemMeta);

  const now = Date.now();

  const newLearningCycleData: LearningCycle = {
    ...clientData,
    ...problemMeta,
    textbookId: textbook.id,
    textbookName: textbook.name,
    subject: textbook.subject,
    isReviewTarget: true,
    sessions: [],
    cycleStartAt: now,
    latestAttemptedAt: now,
    nextReviewDate,
  };

  try {
    // LearningCycleスキーマのバリデーション
    LearningCycleSchema.parse(newLearningCycleData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`LearningCycleバリデーション失敗: ${error}`);
    }
    throw new Error('LearningCycleバリデーション中に予期せぬエラーが発生しました');
  }

  try {
    // IDBに新しいLearningCycleを追加
    return await idbStore.add(newLearningCyclePath, newLearningCycleData);
  } catch (error) {
    throw new Error(`IDBへのLearningCycle追加に失敗しました (Path: ${newLearningCyclePath})`);
  }
};
