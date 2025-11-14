import { incrementLocalUserXp } from '@/features/app/curd-user';
import { createExpandedLearningCycleTestResultsFromCycle } from '@/features/app/learningCycles/functions/expand-learning-cycle-utils';
import { calculateMaxXP } from '@/features/app/xp/functions/calculate-max-xp';
import { calculateTotalXPWithLearningCycle } from '@/features/app/xp/functions/calculateXP';
import {
  LearningCycle,
  LearningCycleDocument,
  LearningCycleDocumentSchema,
  LearningCycleSchema,
} from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  LearningCycleSession,
  LearningCycleTestResult,
  LearningCycleTestResultSchema,
  ProblemScoringStatus,
  TestSelfEvaluation,
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
import { containsToday, isToday } from '@/shared/utils/datetime/datetime-utils';
import { replaceOrAddObject } from '@/shared/utils/object/object-utils';

const problemsToLearningCycleTestResults = (
  learningCycle: LearningCycle,
  selfEvaluationsMap: Record<number, TestSelfEvaluation>,
  scoringStatusMap: Record<number, ProblemScoringStatus>,
  elapsedTimeMap: Record<number, number>
): LearningCycleTestResult[] => {
  // 現在は構造が同じなのでそのまま返すだけでよい
  return createExpandedLearningCycleTestResultsFromCycle(
    -1,
    learningCycle,
    selfEvaluationsMap,
    scoringStatusMap,
    elapsedTimeMap
  );
};

const checkIsFixedReviewSession = (pastLearningCycle: LearningCycle) => {
  if (containsToday(pastLearningCycle.fixedReviewDates)) {
    const todayAttemptSessions = pastLearningCycle.sessions.filter((session) =>
      isToday(session.attemptedAt)
    );
    return !todayAttemptSessions.find((session) => session.isFixedReviewSession);
  }
  return false;
};

export const handleRecordSession = async (
  textbookId: string,
  learningCycleId: string,
  scoringStatusMap: Record<number, ProblemScoringStatus>,
  selfEvaluationsMap: Record<number, TestSelfEvaluation>,
  elapsedTimeMap: Record<number, number>
) => {
  // 1. 入力値の基本チェック
  if (!textbookId) {
    throw new Error('textbookId must not be empty.');
  }
  if (!learningCycleId) {
    throw new Error('learningCycleId must not be empty.');
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

  const isFixedReviewSession = checkIsFixedReviewSession(learningCycle);
  const results = LearningCycleTestResultSchema.array().parse(
    problemsToLearningCycleTestResults(
      learningCycle,
      selfEvaluationsMap,
      scoringStatusMap,
      elapsedTimeMap
    )
  );
  const newSession: LearningCycleSession = {
    isFixedReviewSession,
    gainedXp: 0,
    attemptedAt: now,
    results,
  };

  const xp = calculateTotalXPWithLearningCycle(learningCycle, newSession, newPlant.currentStage);
  const gainedXp = xp?.floatTotalXP ?? 0;

  if (gainedXp < 0 || gainedXp > calculateMaxXP()) {
    throw new Error('不正なXPです');
  }

  newSession.gainedXp = gainedXp;

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
  await incrementLocalUserXp(gainedXp);
};
