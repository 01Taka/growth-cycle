import { useCallback, useMemo, useState } from 'react';
import { HistorySortType } from '@/features/learningHistory/types/learning-history-types';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { createCycleListItems } from '../functions/cycleList/create-cycle-list-items';
import { filterCycleItems, sortCycleItems } from '../functions/cycleList/sort-and-filter';
import { TestOverviewInfo } from '../types/cycle-list-types';
import { ProblemListItemData } from '../types/problem-list-types';

export const useCycleList = (
  learningCycles: LearningCycleDocument[],
  problemsMap: Record<string, ProblemListItemData>,
  recommendedTestOverviewMap: Record<string, TestOverviewInfo>
) => {
  // --- ステート管理 ---
  // 詳細表示の開閉状態を管理
  const [openedDetailId, setOpenedDetailId] = useState<string | null>(null);
  // 💡 ソート基準
  const [sortBy, setSortBy] = useState<HistorySortType>('fixation');
  // 💡 教科フィルター
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);

  // onCheckDetailアクションの定義
  const onToggleOpenedDetail = useCallback((cycleId: string) => {
    setOpenedDetailId((prevId) => (prevId === cycleId ? null : cycleId));
  }, []);

  // 1. 全学習サイクルのデータ変換結果をメモ化（パフォーマンス対策）
  const itemsData = useMemo(() => {
    return learningCycles.map((cycle) =>
      createCycleListItems(cycle, problemsMap, recommendedTestOverviewMap[cycle.id])
    );
  }, [learningCycles, problemsMap, recommendedTestOverviewMap]);

  // 2. フィルタリングとソートのロジック
  const filteredAndSortedItemData = useMemo(() => {
    // A. フィルタリング（教科）
    const filteredData = filterCycleItems(itemsData, subjectFilter); // B. ソート（並べ替え）
    const finalData = sortCycleItems(filteredData, sortBy);
    return finalData;
  }, [itemsData, subjectFilter, sortBy]);

  return {
    sortBy,
    subjectFilter,
    openedDetailItemId: openedDetailId,
    cycleListItems: filteredAndSortedItemData,
    setSortBy,
    setSubjectFilter,
    onToggleOpenedDetail,
  };
};
