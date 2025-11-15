import {
  calculateForgottenStatusForCycle,
  calculateSM2ReviewScheduleForCycle,
} from '@/features/app/sm2/functions/calculate-sm2-schedule';
import {
  attachScheduleInfoToProblems,
  filterScheduledProblems,
  sortScheduledProblems,
} from '@/features/app/sm2/functions/sm2-data-utils';
import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { getDaysDifference } from '@/shared/utils/datetime/datetime-compare-utils';
import {
  AggregatedSection,
  LearningHistoryItemData,
} from '../../app/learningCycles/history/types/learning-history-types';
import { getAggregateSections } from './calculate-aggregate-sections';
import { getColorByRatio } from './history-grade-color-utils';

const getScheduledProblemsFromCycle = (cycle: LearningCycle) => {
  const schedule = calculateSM2ReviewScheduleForCycle(cycle);
  const forgets = calculateForgottenStatusForCycle(cycle);
  const data = attachScheduleInfoToProblems(cycle.problems, schedule, forgets);
  const sortedData = sortScheduledProblems(data);
  const scheduledProblems = filterScheduledProblems(sortedData, {
    maxDays: 0,
    filterForgottenStatus: true,
  });
  const fixation = cycle.problems.length > 0 ? scheduledProblems.length / cycle.problems.length : 0;

  return { scheduledProblems, fixation };
};

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

/**
 * 個別の学習サイクルデータから、LearningHistoryItemコンポーネントに必要な
 * すべての計算済みデータを抽出・整形する純粋関数
 * @param cycle 処理対象の学習サイクル
 * @returns LearningHistoryItemに渡すデータオブジェクト (keyを含まない)
 */
export const transformCycleToItemData = (cycle: LearningCycle): LearningHistoryItemData => {
  // 2. 固定復習までの日数の計算
  const { scheduledProblems, fixation } = getScheduledProblemsFromCycle(cycle);
  const aggregatedSections: AggregatedSection[] = getAggregateSections(
    scheduledProblems
      .filter((data) => data.relativeReviewDays !== null)
      .map((data) => data.relativeReviewDays ?? 0)
  );

  const actionColor = getColorByRatio(fixation);

  const differenceToNextFixedReviewSafe = getDifferenceToNextFixedReviewSafe(cycle);
  const isWaitingFixedReview = differenceToNextFixedReviewSafe !== null;

  return {
    plant: cycle.plant,
    subject: cycle.subject,
    fixation,
    unitNames: cycle.units.map((unit) => unit.name),
    textbookName: cycle.textbookName,
    differenceFromLastAttempt: getDaysDifference(cycle.latestAttemptedAt),
    testTargetProblemCount: scheduledProblems.length,
    estimatedTestTimeMin: Math.floor(cycle.testDurationMs / 60000) || 15,
    differenceToNextFixedReview: differenceToNextFixedReviewSafe,
    aggregatedSections,
    actionColor,
    isWaitingFixedReview,
  };
};
