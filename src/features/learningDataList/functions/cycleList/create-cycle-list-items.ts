import { getColorByRatio } from '@/features/learningDataList/functions/cycleList/cycle-list-color-utils';
import {
  LearningCycle,
  LearningCycleDocument,
} from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { getDaysDifference } from '@/shared/utils/datetime/datetime-compare-utils';
import { CycleItemBaseData, CycleItemData, TestOverviewInfo } from '../../types/cycle-list-types';
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

/**
 * 指定されたキーで問題をフィルタリングし、その結果を使ってサイクルの集計データ (CycleItemData) を生成します。
 *
 * @param filterProblemKeys フィルタリングに使用する問題キーの配列またはSet
 * @param problemsMap すべての問題アイテムを含むマップ
 * @param targetCycle 対象となる学習サイクルドキュメント
 * @param testData テストの概要情報
 * @returns フィルタリングされた問題に基づく集計データ (CycleItemData)
 */
export const createFilteredCycleItemData = (
  filterProblemKeys: string[] | Set<string>,
  problemsMap: Record<string, ProblemListItemData>,
  targetCycle: LearningCycleDocument,
  testData: TestOverviewInfo
): CycleItemData => {
  // 1. キーのフィルタリングと問題アイテムの取得 (元の filterProblemListItems のロジック)
  const keys = Array.isArray(filterProblemKeys) ? filterProblemKeys : Array.from(filterProblemKeys);
  const items = keys.map((key) => problemsMap[key]);

  // 型述語を使用して、確実に ProblemListItemData[] を取得
  const targetProblems: ProblemListItemData[] = items.filter(
    (item): item is ProblemListItemData => item !== undefined
  );

  // 2. サイクルアイテムデータの計算と生成 (元の createCycleListItems のロジック)
  const baseData = createCycleItemBaseData(targetCycle);

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
