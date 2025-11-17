import { incrementLocalUserXp, readOrCreateLocalUser } from '@/features/app/curd-user';
import { calculateMaxXP } from '@/features/app/xp/functions/calculate-max-xp';
import { calculateTotalXPWithLearningCycle } from '@/features/app/xp/functions/calculateXP';
import {
  LearningCycle,
  LearningCycleSchema,
} from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  LearningCycleProblem,
  LearningCycleSession,
  LearningCycleSessionSchema,
  LearningCycleTestResult,
  LearningCycleTestResultSchema,
  ProblemScoringStatus,
  TestSelfEvaluation,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { Textbook, TextbookSchema } from '@/shared/data/documents/textbook/textbook-document';
import { generateIdbPath } from '@/shared/data/idb/generate-path';
import { IDB_PATH } from '@/shared/data/idb/idb-path';
import { idbStore } from '@/shared/data/idb/idb-store';
import { Plant, PLANT_MAX_STAGE, PlantSchema } from '@/shared/types/plant-shared-types';
import { containsToday, isToday } from '@/shared/utils/datetime/datetime-utils';
import { arrayToRecord, replaceOrAddObject } from '@/shared/utils/object/object-utils';
import {
  fetchCurrentActiveCycleAndTextbook,
  unsetUserCurrentActiveLearningCycle,
} from './curd-learning-cycle-utils';

const createNewTestResults = (
  attemptedProblemIds: string[],
  problemsMap: Record<string, LearningCycleProblem>,
  selfEvaluationsMap: Record<string, TestSelfEvaluation>,
  scoringStatusMap: Record<string, ProblemScoringStatus>,
  elapsedTimeMap: Record<string, number>
): LearningCycleTestResult[] => {
  const results: LearningCycleTestResult[] = attemptedProblemIds.map((id) => {
    if (!problemsMap[id]) {
      throw new Error(`Problem ID "${id}" not found in problemsMap.`);
    }
    return {
      structuredId: id,
      problemIndex: problemsMap[id].problemIndex,
      selfEvaluation: selfEvaluationsMap[id] || 'unrated',
      scoringStatus: scoringStatusMap[id] || 'unrated',
      timeSpentMs: elapsedTimeMap[id] || 0,
    };
  });
  return results;
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

const createNewPlant = (existingPlant: Plant, now: number) => {
  // 植物情報の更新
  const shouldUpdateLastGrownAt = existingPlant.currentStage < PLANT_MAX_STAGE;
  const newPlant: Plant = {
    ...existingPlant,
    currentStage: Math.min(existingPlant.currentStage + 1, PLANT_MAX_STAGE),
    lastGrownAt: shouldUpdateLastGrownAt ? now : existingPlant.lastGrownAt,
  };

  try {
    return PlantSchema.parse(newPlant);
  } catch (error) {
    throw new Error(
      `Plant schema validation failed during retrieval. Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

const createNewSession = (
  gainedXp: number,
  isFixedReviewSession: boolean,
  attemptedAt: number,
  newResults: LearningCycleTestResult[]
) => {
  const newSession: LearningCycleSession = {
    isFixedReviewSession,
    gainedXp,
    attemptedAt,
    results: newResults,
  };
  return LearningCycleSessionSchema.parse(newSession);
};

export const handleFinishCurrentLearningCycle = async (
  scoringStatusMap: Record<string, ProblemScoringStatus>,
  selfEvaluationsMap: Record<string, TestSelfEvaluation>,
  elapsedTimeMap: Record<string, number>,
  confirmationTextbookId?: string,
  confirmationLearningCycleId?: string
) => {
  const user = await readOrCreateLocalUser();
  if (!user.currentActiveLearningCycle) {
    throw new Error('There are currently no active cycles');
  }
  if (
    confirmationTextbookId &&
    user.currentActiveLearningCycle.textbookId !== confirmationTextbookId
  ) {
    throw new Error('Textbook ID does not match');
  }
  if (
    confirmationLearningCycleId &&
    user.currentActiveLearningCycle.id !== confirmationLearningCycleId
  ) {
    throw new Error('LearningCycle ID does not match');
  }

  const now = Date.now();

  const { textbook, learningCycle, currentActiveLearningCycle } =
    await fetchCurrentActiveCycleAndTextbook();

  const problemMap = arrayToRecord(learningCycle.problems, 'structuredId');

  const newResults = LearningCycleTestResultSchema.array().parse(
    createNewTestResults(
      currentActiveLearningCycle.attemptingProblemStructuredIds,
      problemMap,
      selfEvaluationsMap,
      scoringStatusMap,
      elapsedTimeMap
    )
  );

  const newPlant = createNewPlant(learningCycle.plant, now);

  const xp = calculateTotalXPWithLearningCycle(
    learningCycle,
    { results: newResults, attemptedAt: now },
    newPlant.currentStage
  );
  const gainedXp = xp?.floatTotalXP ?? 0;
  if (gainedXp < 0 || gainedXp > calculateMaxXP()) {
    throw new Error(`XP calculation resulted in an invalid value: ${gainedXp}`);
  }

  const isFixedReviewSession = checkIsFixedReviewSession(learningCycle);

  const newSession = createNewSession(gainedXp, isFixedReviewSession, now, newResults);

  const updatedTextbook: Partial<Textbook> = {
    lastAttemptedAt: now,
    plants: replaceOrAddObject(textbook.plants ?? [], newPlant.id, newPlant),
  };

  // 4. 次回復習日の計算（lastAttemptedAtは今回のセッション時刻nowを使用）

  const updatedLearningCycle: Partial<LearningCycle> = {
    sessions: [...learningCycle.sessions, newSession],
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

  const textbookPath = generateIdbPath(IDB_PATH.textbooks, textbook.id);
  const learningCyclePath = generateIdbPath(IDB_PATH.learningCycles, learningCycle.id);

  // 6. DB更新
  await idbStore.update<Textbook>(textbookPath, updatedTextbook);
  await idbStore.update<LearningCycle>(learningCyclePath, updatedLearningCycle);
  await incrementLocalUserXp(gainedXp);
  await unsetUserCurrentActiveLearningCycle();
};
