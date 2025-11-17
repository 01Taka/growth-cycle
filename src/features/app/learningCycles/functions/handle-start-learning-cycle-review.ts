import { readOrCreateLocalUser } from '../../curd-user';
import {
  setUserCurrentActiveLearningCycle,
  unsetUserCurrentActiveLearningCycle,
} from './curd-learning-cycle-utils';

export const handleStartLearningCycleReview = async (
  learningCycleId: string,
  // nullの場合すべて
  attemptingProblemStructuredIds: string[] | null,
  // nullの場合デフォルト値
  testDurationMs: number | Record<string, number> | null
) => {
  const user = await readOrCreateLocalUser();
  if (user.currentActiveLearningCycle !== null) {
    await unsetUserCurrentActiveLearningCycle();
    console.error('セッションがある状態で開始しようとしたため強制終了しました。');
  }

  await setUserCurrentActiveLearningCycle(
    learningCycleId,
    attemptingProblemStructuredIds,
    testDurationMs
  );
};
