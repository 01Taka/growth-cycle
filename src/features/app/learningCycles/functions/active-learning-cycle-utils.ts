import { mapGroupKeyToProblem } from '@/features/learningDataList/functions/problemList/problem-list-key-utils';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { ActiveLearningCycle } from '@/shared/data/documents/user/user-support';
import { filterObjectKeys } from '@/shared/utils/object/object-utils';

export const createPseudoLearningCycleDocument = (activeLearningCycle: ActiveLearningCycle) => {
  const keyProblemMap = mapGroupKeyToProblem(activeLearningCycle);
  const filterProblemMap = filterObjectKeys(
    keyProblemMap,
    activeLearningCycle.attemptingProblemStructuredIds
  );

  const learningCycle: LearningCycleDocument = {
    ...activeLearningCycle,
    latestAttemptedAt: activeLearningCycle.sessionStartedAt,
    testDurationMs: activeLearningCycle.actualTestDurationMs,
    problems: Object.values(filterProblemMap),
    sessions: [],
    fixedReviewDates: [],
  };
  return learningCycle;
};
