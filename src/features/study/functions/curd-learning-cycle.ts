import {
  LearningCycle,
  LearningCycleDocument,
  LearningCycleDocumentSchema,
  LearningCycleSchema,
} from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  TestResult,
  TestSession,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import {
  Textbook,
  TextbookDocument,
  TextbookDocumentSchema,
  TextbookSchema,
} from '@/shared/data/documents/textbook/textbook-document';
import { generateIdbPath } from '@/shared/data/idb/generate-path';
import { IDB_PATH } from '@/shared/data/idb/idb-path';
import { idbStore } from '@/shared/data/idb/idb-store';
import { Plant, PLANT_MAX_STAGE, PlantSchema } from '@/shared/types/plant-shared-types';
import { getDateAfterDaysBoundary } from '@/shared/utils/datetime/datetime-utils';
import { ProblemAttemptResult } from '../types/problem-types';

/**
 * オブジェクトの配列内で指定されたIDを持つオブジェクトを検索し、
 * 見つかった場合は置き換えデータで置換し、見つからなかった場合は末尾に追加した新しい配列を返します。
 *
 * @template T 配列内のオブジェクトの型。idフィールドを持つことが期待されます。
 * @param array 対象となるオブジェクトの配列。
 * @param id 検索対象となるオブジェクトのID。
 * @param replacementData 置き換えまたは追加する新しいオブジェクトデータ。
 * @returns 処理後の新しいオブジェクト配列。
 */
function replaceOrAddObject<T extends { id: any }>(array: T[], id: any, replacementData: T): T[] {
  // 配列内で指定されたIDを持つオブジェクトのインデックスを検索
  const index = array.findIndex((item) => item.id === id);

  if (index !== -1) {
    // 🔍 IDが見つかった場合：その位置でオブジェクトを置き換える
    // スプレッド構文 (...) を使用して、元の配列を変更せず、新しい配列を生成します。
    return [
      ...array.slice(0, index), // 0からインデックス直前まで
      replacementData, // 置き換えデータ
      ...array.slice(index + 1), // インデックスの次から末尾まで
    ];
  } else {
    // ➕ IDが見つからなかった場合：置き換えデータを配列の末尾に追加する
    return [...array, replacementData];
  }
}

const problemsToTestResults = (problems: ProblemAttemptResult[]): TestResult[] => {
  // 現在は構造が同じなのでそのまま返すだけでよい
  return problems;
};

export const handleRecordSession = async (
  textbookId: string,
  learningCycleId: string,
  problems: ProblemAttemptResult[]
) => {
  // 1. 入力値の基本チェック
  if (!textbookId) {
    throw new Error('textbookId must not be empty.');
  }
  if (!learningCycleId) {
    throw new Error('learningCycleId must not be empty.');
  }
  if (!problems || problems.length === 0) {
    throw new Error('problems array must not be empty.');
  }

  const textbookPath = generateIdbPath(IDB_PATH.textbooks, textbookId);
  const learningCyclePath = generateIdbPath(IDB_PATH.learningCycles, learningCycleId);

  // 2. データ取得と存在チェックの強化
  const textbook = await idbStore.get<TextbookDocument>(textbookPath);
  if (!textbook) {
    throw new Error(`Textbook document not found for ID: ${textbookId}`);
  }

  const learningCycle = await idbStore.get<LearningCycleDocument>(learningCyclePath);
  if (!learningCycle) {
    throw new Error(`LearningCycle document not found for ID: ${learningCycleId}`);
  }

  try {
    // 3. 取得データのスキーマバリデーション
    TextbookDocumentSchema.parse(textbook);
    LearningCycleDocumentSchema.parse(learningCycle);
  } catch (error) {
    // ZodErrorなど、パースエラーの具体的なハンドリング
    // if (error instanceof ZodError) {
    //   throw new Error(`Schema validation failed for retrieved document: ${error.issues.map(i => i.message).join(', ')}`);
    // }
    throw new Error(
      `Document schema validation failed during retrieval. Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  const existingSessions = learningCycle.sessions;
  const now = Date.now();

  const newPlant: Plant = {
    ...learningCycle.plant,
    currentStage: Math.min(learningCycle.plant.currentStage + 1, PLANT_MAX_STAGE),
    lastGrownAt:
      learningCycle.plant.currentStage === PLANT_MAX_STAGE ? learningCycle.plant.lastGrownAt : now,
  };

  try {
    PlantSchema.parse(newPlant);
  } catch (error) {
    throw new Error(
      `Plant schema validation failed during retrieval. Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  const newSession: TestSession = {
    attemptedAt: now,
    results: problemsToTestResults(problems),
  };

  const updatedTextbook: Partial<Textbook> = {
    lastAttemptedAt: now,
    plants: replaceOrAddObject(textbook.plants ?? [], newPlant.id, newPlant),
  };

  // 4. 次回復習日の計算（lastAttemptedAtは今回のセッション時刻nowを使用）

  const updatedLearningCycle: Partial<LearningCycle> = {
    sessions: [...existingSessions, newSession],
    latestAttemptedAt: now,
    plant: newPlant,
  };

  try {
    // 5. 更新データのスキーマバリデーション
    TextbookSchema.partial().parse(updatedTextbook);
    LearningCycleSchema.partial().parse(updatedLearningCycle);
  } catch (error) {
    // 更新データのスキーマエラーはDB書き込み前に捕捉
    throw new Error(
      `Updated document schema validation failed. Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // 6. DB更新
  await idbStore.update<Textbook>(textbookPath, updatedTextbook);
  await idbStore.update<LearningCycle>(learningCyclePath, updatedLearningCycle);
};
