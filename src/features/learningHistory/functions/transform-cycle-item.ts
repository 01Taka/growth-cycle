import { calculateSM2ReviewScheduleForCycle } from '@/features/app/sm2/functions/calculate-sm2-schedule';
import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { getDaysDifference } from '@/shared/utils/datetime/datetime-compare-utils';
import { AggregatedSection, LearningHistoryItemData } from '../types/learning-history-types';
import { getAggregateSections } from './calculate-aggregate-sections';
import { getColorByRatio } from './history-grade-color-utils';

/**
 * 個別の学習サイクルデータから、LearningHistoryItemコンポーネントに必要な
 * すべての計算済みデータを抽出・整形する純粋関数
 * @param cycle 処理対象の学習サイクル
 * @returns LearningHistoryItemに渡すデータオブジェクト (keyを含まない)
 */
export const transformCycleToItemData = (cycle: LearningCycle): LearningHistoryItemData => {
  // 1. SM2復習スケジュールの計算
  const record = calculateSM2ReviewScheduleForCycle(cycle);
  const dates = Object.values(record).map((date) => date);
  // 日付差分（今日との差）を計算
  const dateDiffs = dates.map((date) => getDaysDifference(date));

  const totalProblemCount = dateDiffs.length;

  // 2. 固定復習までの日数の計算
  const differenceToNextFixedReview = Math.min(
    ...cycle.fixedReviewDates.map((date) => {
      const diff = getDaysDifference(date);
      return diff >= 0 ? diff : Number.MAX_SAFE_INTEGER;
    })
  );
  const differenceToNextFixedReviewSafe =
    differenceToNextFixedReview === Number.POSITIVE_INFINITY ? null : differenceToNextFixedReview;

  // 3. 定着度の計算
  const fixation =
    totalProblemCount > 0 ? dateDiffs.filter((diff) => diff > 0).length / totalProblemCount : 0;

  const aggregatedSections: AggregatedSection[] = getAggregateSections(dateDiffs);

  const actionColor = getColorByRatio(fixation);

  return {
    plant: cycle.plant,
    subject: cycle.subject,
    fixation,
    unitNames: cycle.units.map((unit) => unit.name),
    textbookName: cycle.textbookName,
    differenceFromLastAttempt: getDaysDifference(cycle.latestAttemptedAt),
    testTargetProblemCount: totalProblemCount,
    estimatedTestTimeMin: Math.floor(cycle.testDurationMs / 60000) || 15,
    differenceToNextFixedReview: differenceToNextFixedReviewSafe,
    aggregatedSections,
    actionColor,
  };
};
