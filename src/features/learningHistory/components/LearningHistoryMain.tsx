import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Stack } from '@mantine/core';
import { generateDummyLearningCycles } from '@/features/home/utils/learning-cycle-dummy';
import { useLearningCycleStore } from '@/shared/stores/useLearningCycleStore';
import { filterItems, sortItems } from '../functions/sort-and-filter';
import { transformCycleToItemData } from '../functions/transform-cycle-item';
import { HistorySortType } from '../types/learning-history-types';
import { LearningHistoryHeader } from './LearningHistoryHeader';
import { LearningHistoryItem } from './LearningHistoryItem';

interface LearningHistoryMainProps {}

// メインコンポーネントはデータの取得、変換、状態管理、レンダリングを担う
export const LearningHistoryMain: React.FC<LearningHistoryMainProps> = ({}) => {
  const { learningCycles: _, fetchLearningCycles } = useLearningCycleStore();

  // ダミーデータの生成 (useMemoを使用して不要な再計算を防ぐ)
  const learningCycles = useMemo(() => {
    // 実際にFirestoreから取得する際は、この行を削除します
    return [...generateDummyLearningCycles(20)];
  }, []);

  useEffect(() => {
    // 実際のデータフェッチ
    fetchLearningCycles();
  }, [fetchLearningCycles]);

  // --- ステート管理 ---
  // 詳細表示の開閉状態を管理
  const [openedDetailId, setOpenedDetailId] = useState<string | null>(null);
  // 💡 ソート基準
  const [sortBy, setSortBy] = useState<HistorySortType>('fixation');
  // 💡 教科フィルター
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);

  // onCheckDetailアクションの定義
  const handleCheckDetail = useCallback((cycleId: string) => {
    setOpenedDetailId((prevId) => (prevId === cycleId ? null : cycleId));
  }, []);

  // --- データ変換とメモ化 ---

  // 1. 全学習サイクルのデータ変換結果をメモ化（パフォーマンス対策）
  const memoizedItemData = useMemo(() => {
    return learningCycles.map((cycle) => ({
      cycleId: cycle.id,
      data: transformCycleToItemData(cycle),
    }));
  }, [learningCycles]);

  // 💡 ヘッダーに渡すための教科名のリスト
  const learningCycleSubjects = useMemo(() => {
    return learningCycles.map((cycle) => cycle.subject);
  }, [learningCycles]);

  // 2. フィルタリングとソートのロジック
  const filteredAndSortedItemData = useMemo(() => {
    // A. フィルタリング（教科）
    const filteredData = filterItems(memoizedItemData, subjectFilter); // B. ソート（並べ替え）
    const finalData = sortItems(filteredData, sortBy);
    return finalData;
  }, [memoizedItemData, subjectFilter, sortBy]);

  return (
    <Stack gap="xl" align="center" w="100%" p="md">
      <LearningHistoryHeader
        learningCycleSubjects={learningCycleSubjects}
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* リストの表示 */}
      <Stack gap="xs" align="center" w="100%">
        {filteredAndSortedItemData.map(({ cycleId, data }, index) => {
          const openedDetail =
            openedDetailId === cycleId || (openedDetailId === null && index === 0);

          return (
            <Box w={'95%'} key={cycleId}>
              <LearningHistoryItem
                {...data}
                openedDetail={openedDetail}
                toggleOpenedDetail={() => handleCheckDetail(cycleId)}
                onStartReview={() => {}}
              />
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};
