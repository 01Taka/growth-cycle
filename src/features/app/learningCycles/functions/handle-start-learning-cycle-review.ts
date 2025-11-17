import { setUserCurrentActiveLearningCycle } from './curd-learning-cycle-utils';

export const handleStartLearningCycleReview = async (
  learningCycleId: string,
  // nullの場合すべて
  attemptingProblemStructuredIds: string[] | null,
  // nullの場合デフォルト値
  testDurationMs: number | Record<string, number> | null
) => {
  await setUserCurrentActiveLearningCycle(
    learningCycleId,
    attemptingProblemStructuredIds,
    testDurationMs
  );
};
