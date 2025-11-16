import { useEffect, useMemo, useState } from 'react';
import { createFilteredCycleItemData } from '@/features/learningDataList/functions/cycleList/create-cycle-list-items';
import { getTestOverviewMap } from '@/features/learningDataList/functions/cycleList/test-problems-utils';
import { mapProblemIndexToGroupKey } from '@/features/learningDataList/functions/problemList/problem-list-key-utils';
import { useCycleList } from '@/features/learningDataList/hooks/useCycleList';
import { useCycleProblemsModal } from '@/features/learningDataList/hooks/useCycleProblemsModal';
import { useProblemList } from '@/features/learningDataList/hooks/useProblemList';
import { useRecommendedTest } from '@/features/learningDataList/hooks/useRecommendedTest';
import { CycleItemData } from '@/features/learningDataList/types/cycle-list-types';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { filterObjectKeys } from '@/shared/utils/object/object-utils';
import { groupingByDifferenceFromStartDate } from '../functions/filter-learning-cycle';
import { ReviewSectionCycleListProps } from '../types/review-section-types';

/**
 * Record<string, T[]>の配列を受け取り、同じキーの配列の長さを合算した
 * Record<string, number> を返します。
 *
 * @param dataArray Record<string, T[]>の配列
 * @returns 各キーに対応する配列の長さの合計
 */
function getAggregatedArrayLengths<T>(...dataArray: Record<string, T[]>[]): Record<string, number> {
  const aggregatedLengths: Record<string, number> = {};

  // 1. dataArray内の各Record<string, T[]>オブジェクトを反復処理します
  for (const dataRecord of dataArray) {
    // 2. そのオブジェクト内の各キーと値（配列）を反復処理します
    for (const key in dataRecord) {
      if (Object.prototype.hasOwnProperty.call(dataRecord, key)) {
        const arrayValue = dataRecord[key];

        // 配列であることを確認（any[]として受け取るため）
        if (Array.isArray(arrayValue)) {
          const length = arrayValue.length;

          // 3. 長さを合算します。
          // キーがまだ存在しない場合は0として初期化し、現在の長さを加算します。
          aggregatedLengths[key] = (aggregatedLengths[key] || 0) + length;
        }
      }
    }
  }

  return aggregatedLengths;
}

export const useCycleListForHome = (
  allLearningCycles: LearningCycleDocument[],
  todayReviewCycles: LearningCycleDocument[],
  todayReviewedCycles: LearningCycleDocument[]
) => {
  const [currentDisplayGroupKey, setCurrentDisplayGroupKey] = useState<string | null>(null);

  const groupedTodayReviewCycles = useMemo(
    () => groupingByDifferenceFromStartDate(todayReviewCycles),
    [todayReviewCycles]
  );

  const groupedTodayReviewedCycles = useMemo(
    () => groupingByDifferenceFromStartDate(todayReviewedCycles),
    [todayReviewedCycles]
  );

  const uniqueStrDifferencesFromCycleStart = useMemo(() => {
    const allKeys = new Set([
      ...Object.keys(groupedTodayReviewCycles),
      ...Object.keys(groupedTodayReviewedCycles),
    ]);
    return Array.from(allKeys).sort((a, b) => Number(a) - Number(b));
  }, [groupedTodayReviewCycles, groupedTodayReviewedCycles]);

  useEffect(() => {
    setCurrentDisplayGroupKey((prev) => {
      if (prev === null && uniqueStrDifferencesFromCycleStart.length > 0) {
        return uniqueStrDifferencesFromCycleStart[0];
      }
      return prev;
    });
  }, [uniqueStrDifferencesFromCycleStart]);

  const { problems, problemsMap, learningCycleKeySetMap } = useProblemList(allLearningCycles);

  const { recommendedTestMap, recommendedTestOverviewMap, avgTimeMap } = useRecommendedTest(
    allLearningCycles,
    problems
  );

  const { openedDetailItemId, onToggleOpenedDetail } = useCycleList(
    learningCycleKeySetMap,
    allLearningCycles,
    problemsMap,
    recommendedTestOverviewMap
  );

  const allTestOverviewMap = useMemo(() => {
    const allTestMap = Object.fromEntries(
      allLearningCycles.map((cycle) => {
        const keys = mapProblemIndexToGroupKey(cycle);
        const data = filterObjectKeys(problemsMap, Object.values(keys));
        return [cycle.id, data];
      })
    );
    return getTestOverviewMap(allTestMap, avgTimeMap);
  }, [allLearningCycles, problemsMap, avgTimeMap]);

  const modalProps = useCycleProblemsModal(
    learningCycleKeySetMap,
    problems,
    recommendedTestMap,
    'all'
  );

  const listProps: ReviewSectionCycleListProps = useMemo(() => {
    const reviewCycles = currentDisplayGroupKey
      ? (groupedTodayReviewCycles[currentDisplayGroupKey] ?? [])
      : [];

    const reviewedCycles = currentDisplayGroupKey
      ? (groupedTodayReviewedCycles[currentDisplayGroupKey] ?? [])
      : [];

    const reviewCycleItems = reviewCycles.map((cycle) =>
      createFilteredCycleItemData(
        learningCycleKeySetMap[cycle.id] ?? [],
        problemsMap,
        cycle,
        allTestOverviewMap[cycle.id]
      )
    );

    const reviewedCycleItems = reviewedCycles.map((cycle) =>
      createFilteredCycleItemData(
        learningCycleKeySetMap[cycle.id] ?? [],
        problemsMap,
        cycle,
        allTestOverviewMap[cycle.id]
      )
    );

    return {
      reviewCycleItems,
      reviewedCycleItems,
      openedDetailId: openedDetailItemId,
      displayGroupKeys: uniqueStrDifferencesFromCycleStart,
      groupCycleCountMap: getAggregatedArrayLengths(
        groupedTodayReviewCycles,
        groupedTodayReviewedCycles
      ),
      currentDisplayGroupKey,
      setCurrentDisplayGroupKey,
      toggleOpenedDetail: (item) => onToggleOpenedDetail(item.cycleId),
      onStartReview: (item: CycleItemData) => {},
      onCheckAndSelectProblems: (item: CycleItemData) =>
        modalProps.onOpen(item.textbookId, item.cycleId),
    };
  }, [
    modalProps.onOpen,
    uniqueStrDifferencesFromCycleStart,
    currentDisplayGroupKey,
    openedDetailItemId,
    onToggleOpenedDetail,
    setCurrentDisplayGroupKey,
  ]);

  return {
    listProps,
    modalProps,
  };
};
