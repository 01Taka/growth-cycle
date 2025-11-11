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
import { getDateAfterDaysBoundary } from '@/shared/utils/datetime/datetime-utils';
import { ProblemAttemptResult } from '../types/problem-types';

const problemsToTestResults = (problems: ProblemAttemptResult[]): TestResult[] => {
  // 現在は構造が同じなのでそのまま返すだけでよい
  return problems;
};

const getNextReviewDate = (attemptCount: number, lastAttemptedAt: number): string | null => {
  if (attemptCount <= 0) {
    // attemptCountが負の値の場合
    throw new Error(`Invalid attemptCount: ${attemptCount}. attemptCount must be non-negative.`);
  }

  let dateAfter: number | null = null;
  // attemptCount === 1 は初回学習（0日目）後の1回目復習のトリガー
  if (attemptCount === 1) {
    dateAfter = 1; // 1日後
  }
  // attemptCount === 2 は1回目復習後の2回目復習のトリガー
  // 1回目復習から6日後、取り組み日から合計7日後
  else if (attemptCount === 2) {
    // ここは間隔維持のため、前回セッションの日付lastAttemptedAtが重要
    // MVPロジックとして、前回からの間隔(6日)を固定にする
    dateAfter = 6;
  }
  // 3回目以降の復習ロジックはMVPではまだ未定義のため、一旦null

  return dateAfter ? getDateAfterDaysBoundary(dateAfter, lastAttemptedAt) : null;
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
  const nextAttemptCount = existingSessions.length + 1; // 今回の試行回数

  const newSession: TestSession = {
    attemptedAt: now,
    results: problemsToTestResults(problems),
  };

  const updatedTextbook: Partial<Textbook> = {
    lastAttemptedAt: now,
  };

  // 4. 次回復習日の計算（lastAttemptedAtは今回のセッション時刻nowを使用）
  const nextReviewDate = getNextReviewDate(nextAttemptCount, now);

  const updatedLearningCycle: Partial<LearningCycle> = {
    sessions: [...existingSessions, newSession],
    nextReviewDate,
    latestAttemptedAt: now,
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
