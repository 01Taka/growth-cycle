import { getColorByRatio } from '@/features/learningDataList/functions/cycleList/cycle-list-color-utils';
import {
  LearningCycle,
  LearningCycleDocument,
} from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { LearningCycleProblem } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { getDaysDifference } from '@/shared/utils/datetime/datetime-compare-utils';
import { REVIEW_STAGES } from '../../constants/review-recommendation-stage-constants';
import {
  CycleItemBaseData,
  CycleItemData,
  CycleListItemAggregatedSection,
  TestOverviewInfo,
} from '../../types/cycle-list-types';
import { ProblemListItemData } from '../../types/problem-list-types';
import { mapProblemIndexToGroupKey } from '../problemList/problem-list-key-utils';
import { aggregateReviewStages } from './create-aggregated-section';

const getDifferenceToNextFixedReviewSafe = (cycle: LearningCycle) => {
  const differenceToNextFixedReview = Math.min(
    ...cycle.fixedReviewDates.map((date) => {
      const diff = getDaysDifference(date, Date.now(), false);
      return diff >= 0 ? diff : Number.MAX_SAFE_INTEGER;
    })
  );
  const differenceToNextFixedReviewSafe =
    differenceToNextFixedReview === Number.POSITIVE_INFINITY ? null : differenceToNextFixedReview;
  return differenceToNextFixedReviewSafe;
};

const createCycleItemBaseData = (learningCycle: LearningCycleDocument): CycleItemBaseData => {
  const differenceToNextFixedReviewSafe = getDifferenceToNextFixedReviewSafe(learningCycle);
  const isWaitingFixedReview = differenceToNextFixedReviewSafe !== null;

  return {
    cycleId: learningCycle.id,
    plant: learningCycle.plant,
    subject: learningCycle.subject,
    unitNames: learningCycle.units.map((unit) => unit.name),
    textbookId: learningCycle.textbookId,
    textbookName: learningCycle.textbookName,
    differenceFromLastAttempt: getDaysDifference(learningCycle.latestAttemptedAt),
    differenceToNextFixedReview: differenceToNextFixedReviewSafe,
    isWaitingFixedReview,
  };
};

const calculateFixation = (items: ProblemListItemData[]): number => {
  if (items.length === 0) return 0;
  const correctItem = items.filter((item) => {
    item.reviewRecommendationStage > 0;
  });
  return correctItem.length / items.length;
};

export const createCycleListItems = (
  targetCycle: LearningCycleDocument,
  problemsMap: Record<string, ProblemListItemData>,
  testData: TestOverviewInfo
): CycleItemData => {
  const baseData = createCycleItemBaseData(targetCycle);
  const indexKeyMap = mapProblemIndexToGroupKey(targetCycle);
  const indexProblemMap = Object.fromEntries(
    targetCycle.problems.map((problem) => {
      const index = problem.problemIndex;
      const key = indexKeyMap[index];
      const item = problemsMap[key];
      return [index, item];
    })
  );
  const targetProblems = Object.values(indexProblemMap);
  const fixation = calculateFixation(targetProblems);
  const aggregatedSections = aggregateReviewStages(targetProblems);
  const actionColor = getColorByRatio(fixation);

  return {
    ...baseData,
    testTargetProblemCount: testData.problemCount,
    estimatedTestTimeMin: Math.floor(testData.totalTime / 60000),
    fixation,
    aggregatedSections,
    actionColor,
  };
};
