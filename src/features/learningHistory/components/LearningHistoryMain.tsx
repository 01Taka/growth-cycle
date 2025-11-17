import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mantine/core';
import { handleStartLearningCycleReview } from '@/features/app/learningCycles/functions/handle-start-learning-cycle-review';
import { LearningCycleList } from '@/features/learningDataList/components/cycleList/LearningCycleList';
import { CycleProblemsModal } from '@/features/learningDataList/components/cycleProblemsModal/CycleProblemsModal';
import { useCycleList } from '@/features/learningDataList/hooks/useCycleList';
import { useCycleProblemsModal } from '@/features/learningDataList/hooks/useCycleProblemsModal';
import { useProblemList } from '@/features/learningDataList/hooks/useProblemList';
import { useRecommendedTest } from '@/features/learningDataList/hooks/useRecommendedTest';
import { CycleItemData } from '@/features/learningDataList/types/cycle-list-types';
import { useLearningCycleStore } from '@/shared/stores/useLearningCycleStore';
import { LearningHistoryHeader } from './LearningHistoryHeader';

interface LearningHistoryMainProps {}

// メインコンポーネントはデータの取得、変換、状態管理、レンダリングを担う
export const LearningHistoryMain: React.FC<LearningHistoryMainProps> = ({}) => {
  const navigate = useNavigate();
  const { learningCycles, fetchLearningCycles } = useLearningCycleStore();

  // // ダミーデータの生成 (useMemoを使用して不要な再計算を防ぐ)
  // const learningCycles = useMemo(() => {
  //   // 実際にFirestoreから取得する際は、この行を削除します
  //   return [...generateDummyLearningCycles(20)];
  // }, []);

  useEffect(() => {
    // 実際のデータフェッチ
    fetchLearningCycles();
  }, [fetchLearningCycles]);

  const { problems, problemsMap, learningCycleKeySetMap } = useProblemList(learningCycles);

  const { recommendedTestMap, recommendedTestOverviewMap, avgTimeMap } = useRecommendedTest(
    learningCycles,
    problems
  );

  const {
    openedDetailItemId,
    sortBy,
    subjectFilter,
    cycleListItems,
    setSortBy,
    setSubjectFilter,
    onToggleOpenedDetail,
  } = useCycleList(learningCycleKeySetMap, learningCycles, problemsMap, recommendedTestOverviewMap);

  const handleStartReviewWithRecommended = useCallback(
    async (item: CycleItemData) => {
      if (item?.cycleId && item.cycleId in recommendedTestMap) {
        try {
          const ids = Object.keys(recommendedTestMap[item.cycleId]);
          if (ids && ids.length > 0) {
            await handleStartLearningCycleReview(item.cycleId, ids, avgTimeMap);
            navigate(`/study?phase=test`);
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    [recommendedTestMap, avgTimeMap]
  );

  const modalProps = useCycleProblemsModal(
    learningCycleKeySetMap,
    problems,
    recommendedTestMap,
    avgTimeMap
  );

  const learningCycleSubjects = useMemo(() => {
    return learningCycles.map((cycle) => cycle.subject);
  }, [learningCycles]);

  return (
    <Stack gap="xl" align="center" w="100%" p="md">
      <LearningHistoryHeader
        learningCycleSubjects={learningCycleSubjects}
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <LearningCycleList
        alwaysOpen
        cycleListItems={cycleListItems}
        openedDetailId={openedDetailItemId}
        toggleOpenedDetail={(item) => onToggleOpenedDetail(item.cycleId)}
        onStartReview={handleStartReviewWithRecommended}
        onCheckAndSelectProblems={(item) => modalProps.onOpen(item.textbookId, item.cycleId)}
      />

      <CycleProblemsModal {...modalProps} />
    </Stack>
  );
};
