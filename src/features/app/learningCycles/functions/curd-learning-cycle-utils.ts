import { getSortedProblemKeys } from '@/features/learningDataList/functions/problemList/problem-list-key-utils';
import {
  LearningCycleDocument,
  LearningCycleDocumentSchema,
} from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  TextbookDocument,
  TextbookDocumentSchema,
} from '@/shared/data/documents/textbook/textbook-document';
import { ActiveLearningCycle } from '@/shared/data/documents/user/user-support';
import { generateIdbPath } from '@/shared/data/idb/generate-path';
import { IDB_PATH } from '@/shared/data/idb/idb-path';
import { idbStore } from '@/shared/data/idb/idb-store';
import { readOrCreateLocalUser, updateLocalUser } from '../../curd-user';

const getTestDuration = (
  learningCycle: { testDurationMs: number },
  problemKeys: string[],
  testDurationMs: number | Record<string, number> | null
) => {
  if (testDurationMs === null) return learningCycle.testDurationMs;
  if (typeof testDurationMs === 'number') return testDurationMs;
  return problemKeys.reduce((total, key) => total + (testDurationMs[key] ?? 0), 0);
};

export const setUserCurrentActiveLearningCycle = async (
  learningCycleId: string,
  // nullの場合すべて
  attemptingProblemKeys: string[] | null,
  // nullの場合デフォルト値
  testDurationMs: number | Record<string, number> | null,
  sessionStartedAt = Date.now()
) => {
  const user = await readOrCreateLocalUser();
  if (user.currentActiveLearningCycle !== null) {
    throw new Error(
      `There is an active cycle, please finish it first. ${user.currentActiveLearningCycle.id}`
    );
  }

  // nullの場合エラーがスローされる
  const learningCycle = await fetchLearningCycle(learningCycleId);

  const keys =
    attemptingProblemKeys !== null
      ? getSortedProblemKeys(learningCycle, { filterProblemKeys: attemptingProblemKeys })
      : getSortedProblemKeys(learningCycle); // attemptingProblemKeysがない場合はフィルターせずにすべて返す

  const actualTestDurationMs = getTestDuration(learningCycle, keys, testDurationMs);
  const activeLearningCycle: ActiveLearningCycle = {
    ...learningCycle,
    attemptingProblemKeys: keys,
    actualTestDurationMs,
    sessionStartedAt,
  };
  await updateLocalUser({ currentActiveLearningCycle: activeLearningCycle });
};

export const unsetUserCurrentActiveLearningCycle = async () => {
  const user = await readOrCreateLocalUser();
  if (!user.currentActiveLearningCycle) {
    throw new Error('There are currently no active cycles');
  }
  await updateLocalUser({ currentActiveLearningCycle: null });
};

export const fetchCurrentActiveCycleAndTextbook = async () => {
  const user = await readOrCreateLocalUser();
  if (!user.currentActiveLearningCycle) {
    throw new Error('There are currently no active cycles');
  }

  const { textbookId, id: learningCycleId } = user.currentActiveLearningCycle;

  const textbookPath = generateIdbPath(IDB_PATH.textbooks, textbookId);
  const learningCyclePath = generateIdbPath(IDB_PATH.learningCycles, learningCycleId);

  // 2. データ取得と存在チェックの強化
  const textbookData = await idbStore.get<TextbookDocument>(textbookPath);
  if (!textbookData) {
    throw new Error(`Textbook document not found for ID: ${textbookId}`);
  }

  const learningCycleData = await idbStore.get<LearningCycleDocument>(learningCyclePath);
  if (!learningCycleData) {
    throw new Error(`LearningCycle document not found for ID: ${learningCycleId}`);
  }

  const textbook = TextbookDocumentSchema.parse(textbookData);
  const learningCycle = LearningCycleDocumentSchema.parse(learningCycleData);

  return { textbook, learningCycle };
};

export const fetchLearningCycle = async (learningCycleId: string) => {
  const learningCyclePath = generateIdbPath(IDB_PATH.learningCycles, learningCycleId);
  const learningCycleData = await idbStore.get<LearningCycleDocument>(learningCyclePath);
  if (!learningCycleData) {
    throw new Error(`LearningCycle document not found for ID: ${learningCycleId}`);
  }
  const learningCycle = LearningCycleDocumentSchema.parse(learningCycleData);
  return learningCycle;
};
