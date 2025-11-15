import React, { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Flex, Stack } from '@mantine/core';
import { TotalXPModal } from '@/features/app/xp/components/TotalXPModal';
import { XpIconPill } from '@/features/app/xp/components/XpIconPill';
import { calculateTotalXPWithLearningCycle } from '@/features/app/xp/functions/calculateXP';
import { XPResults } from '@/features/app/xp/types/xp-types';

import '@/features/problemsList/functions/calc-avg-correct-rate';

import { ProblemList } from '@/features/problemsList/components/ProblemList';
import { createProblemDataArray } from '@/features/problemsList/functions/calc-avg-correct-rate';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { useLearningCycleStore } from '@/shared/stores/useLearningCycleStore';
import useUserStore from '@/shared/stores/useUserStore';
import {
  filterLearningCycles,
  groupingByDifferenceFromStartDate,
} from '../functions/filter-learning-cycle';
import { HomeReviewCard } from './review/card/HomeReviewCard';
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

  const groupedTodayReviewCycles = useMemo(
    () => groupingByDifferenceFromStartDate(todayReviewCycles),
    [todayReviewCycles]
  );

  const groupedTodayReviewedCycles = useMemo(
    () => groupingByDifferenceFromStartDate(todayReviewedCycles),
    [todayReviewedCycles]
  );

  const groupKeys = useMemo(() => {
    const allKeys = new Set([
      ...Object.keys(groupedTodayReviewCycles),
      ...Object.keys(groupedTodayReviewedCycles),
    ]);
    return Array.from(allKeys).sort((a, b) => Number(a) - Number(b));
  }, [groupedTodayReviewCycles, groupedTodayReviewedCycles]);

  const learnings = todayStartedCycles.map((cycle) => ({
    subject: cycle.subject,
    plant: cycle.plant,
  }));

  const handleStartReview = (cycle: LearningCycleDocument | null) => {
    if (cycle) {
      navigate(`/study?cycleId=${cycle.id}&phase=test`);
    }
  };

  const problems = useMemo(() => {
    if (learningCycles.length > 0) {
      const problems = createProblemDataArray(learningCycles);
      return problems.sort((a, b) => a.nextAttemptTimestamp - b.nextAttemptTimestamp);
    }
    return [];
  }, [learningCycles]);

  console.log(problems);

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
        displayGroupKeys={groupKeys}
        groupedTodayReviewCycles={groupedTodayReviewCycles}
        groupedTodayReviewedCycles={groupedTodayReviewedCycles}
        todayReviewCyclesCount={todayReviewCycles.length}
        todayReviewedCyclesCount={todayReviewedCycles.length}
        onStartReview={handleStartReview}
      />

      <GrowthPresentation learnings={learnings} onStartStudy={() => navigate('/textbooks')} />

      <ProblemList problems={problems} selectedProblemIds={[]} onToggleSelect={() => {}} />

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
