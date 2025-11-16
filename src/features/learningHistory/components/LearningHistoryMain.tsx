import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mantine/core';
import { LearningCycleList } from '@/features/learningDataList/components/cycleList/LearningCycleList';
import { CycleProblemsModal } from '@/features/learningDataList/components/cycleProblemsModal/CycleProblemsModal';
import { useCycleList } from '@/features/learningDataList/hooks/useCycleList';
import { useCycleProblemsModal } from '@/features/learningDataList/hooks/useCycleProblemsModal';
import { useProblemList } from '@/features/learningDataList/hooks/useProblemList';
import { useRecommendedTest } from '@/features/learningDataList/hooks/useRecommendedTest';
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

  const { problems, problemsMap } = useProblemList(learningCycles);

  const { recommendedTestMap, recommendedTestOverviewMap } = useRecommendedTest(
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
  } = useCycleList(learningCycles, problemsMap, recommendedTestOverviewMap);

  const modalProps = useCycleProblemsModal(problems, recommendedTestMap);

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
        onStartReview={(item) => {
          if (item?.cycleId) {
            navigate(`/study?cycleId=${item.cycleId}&phase=test`);
          }
        }}
        onCheckAndSelectProblems={(item) => modalProps.onOpen(item.textbookId, item.cycleId)}
      />

      <CycleProblemsModal {...modalProps} />
    </Stack>
  );
};
