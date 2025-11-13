import React, { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Flex, Pill, Stack } from '@mantine/core';
import { TotalXPModal } from '@/features/xp/components/TotalXPModal';
import { XpIconPill } from '@/features/xp/components/XpIconPill';
import { calculateTotalXPWithLearningCycle } from '@/features/xp/functions/calculateXP';
import { XPResults } from '@/features/xp/types/xp-types';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { useLearningCycleStore } from '@/shared/stores/useLearningCycleStore';
import useUserStore from '@/shared/stores/useUserStore';
import {
  filterLearningCycles,
  groupCyclesByAllDateDifferences,
} from '../functions/filter-learning-cycle';
import { HomeReviewCard } from './review/HomeReviewCard';
import { GrowthPresentation } from './startStudy/GrowthPresentation';

interface HomeMainProps {}

export const HomeMain: React.FC<HomeMainProps> = ({}) => {
  const navigate = useNavigate();

  const { user, fetchUser } = useUserStore((state) => state);
  const { learningCycles: learningCycles, fetchLearningCycles } = useLearningCycleStore(
    (state) => state
  );

  const totalGainedXp = user?.totalGainedXp ?? 0;

  const [searchParams, setSearchParams] = useSearchParams();
  const resultCycleId = searchParams.get('resultCycleId');

  // const learningCycles = useMemo(() => generateMultipleLearningCycles(5), []);

  useEffect(() => {
    fetchLearningCycles();
  }, [fetchLearningCycles]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const { todayReviewCycles, todayReviewedCycles, todayStartedCycles } = useMemo(
    () => filterLearningCycles(learningCycles),
    [learningCycles]
  );

  const groupedCycles = useMemo(
    () => groupCyclesByAllDateDifferences({ todayReviewCycles, todayReviewedCycles }),
    [todayReviewCycles, todayReviewedCycles]
  );

  const learnings = todayStartedCycles.map((cycle) => ({
    subject: cycle.subject,
    plant: cycle.plant,
  }));

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

  return (
    <Stack gap={0}>
      <Flex w={'100%'} justify="end">
        <XpIconPill totalGainedXp={totalGainedXp} />
      </Flex>
      <HomeReviewCard
        groupedCycles={groupedCycles}
        todayReviewCyclesCount={todayReviewCycles.length}
        todayReviewedCyclesCount={todayReviewedCycles.length}
        onStartReview={handleStartReview}
      />
      <GrowthPresentation learnings={learnings} onStartStudy={() => navigate('/textbooks')} />
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
