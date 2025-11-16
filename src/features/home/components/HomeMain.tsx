import React, { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Flex, Stack } from '@mantine/core';
import { TotalXPModal } from '@/features/app/xp/components/TotalXPModal';
import { XpIconPill } from '@/features/app/xp/components/XpIconPill';
import { calculateTotalXPWithLearningCycle } from '@/features/app/xp/functions/calculateXP';
import { XPResults } from '@/features/app/xp/types/xp-types';

import '@/features/learningDataList/functions/problemList/calc-avg-correct-rate';

import { CycleProblemsModal } from '@/features/learningDataList/components/cycleProblemsModal/CycleProblemsModal';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { useLearningCycleStore } from '@/shared/stores/useLearningCycleStore';
import useUserStore from '@/shared/stores/useUserStore';
import { filterLearningCycles } from '../functions/filter-learning-cycle';
import { useCycleListForHome } from '../hooks/useCycleListForHome';
import { generateDummyLearningCycles } from '../utils/learning-cycle-dummy';
import { HomeReviewCard } from './review/card/HomeReviewCard';
import { GrowthPresentation } from './startStudy/GrowthPresentation';

interface HomeMainProps {}

export const HomeMain: React.FC<HomeMainProps> = ({}) => {
  const navigate = useNavigate();

  const { user, fetchUser } = useUserStore((state) => state);
  const { learningCycles: learningCycles, fetchLearningCycles } = useLearningCycleStore(
    (state) => state
  );

  // ダミーデータの生成 (useMemoを使用して不要な再計算を防ぐ)
  // const learningCycles = useMemo(() => {
  //   // 実際にFirestoreから取得する際は、この行を削除します
  //   return [...generateDummyLearningCycles(3)];
  // }, []);

  const totalGainedXp = user?.totalGainedXp ?? 0;

  const [searchParams, setSearchParams] = useSearchParams();
  const resultCycleId = searchParams.get('resultCycleId');

  useEffect(() => {
    fetchLearningCycles();
  }, [fetchLearningCycles]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleStartReview = (cycle: LearningCycleDocument | null) => {
    if (cycle) {
      navigate(`/study?cycleId=${cycle.id}&phase=test`);
    }
  };

  const resultCycle = useMemo(() => {
    return learningCycles.find((cycle) => cycle.id === resultCycleId);
  }, [resultCycleId, learningCycles]);

  const xpResults = useMemo(
    () => (resultCycle ? (calculateTotalXPWithLearningCycle(resultCycle) as XPResults) : null),
    [resultCycle]
  );

  const handleCloseResultModal = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('resultCycleId');
    setSearchParams(newSearchParams);
  };

  const { todayReviewCycles, todayReviewedCycles, todayStartedCycles } = useMemo(
    () => filterLearningCycles(learningCycles),
    [learningCycles]
  );

  const { listProps, modalProps } = useCycleListForHome(
    learningCycles,
    todayReviewCycles,
    todayReviewedCycles
  );

  const learnings = todayStartedCycles.map((cycle) => ({
    subject: cycle.subject,
    plant: cycle.plant,
  }));

  return (
    <Stack gap={0}>
      <Flex w={'100%'} justify="end">
        <XpIconPill totalGainedXp={totalGainedXp} />
      </Flex>

      <HomeReviewCard
        listProps={listProps}
        remainingTaskCount={listProps.reviewCycleItems.length}
        totalTaskCount={listProps.reviewCycleItems.length + listProps.reviewedCycleItems.length}
      />
      <CycleProblemsModal {...modalProps} />

      <GrowthPresentation learnings={learnings} onStartStudy={() => navigate('/textbooks')} />

      <Card>
        <Button
          fullWidth
          size="xl"
          radius={'lg'}
          color="grape"
          onClick={() => navigate('/history')}
        >
          勉強履歴を見る
        </Button>
      </Card>
      {xpResults && resultCycle && (
        <TotalXPModal
          opened={!!resultCycle}
          onClose={() => handleCloseResultModal()}
          results={xpResults}
          learningCycle={resultCycle}
        />
      )}
    </Stack>
  );
};
