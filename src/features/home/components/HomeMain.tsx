import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TotalXPModal } from '@/features/xp/components/TotalXPModal';
import { calculateMaxTotalXP } from '@/features/xp/functions/calculate-max-xp';
import { calculateTotalXP } from '@/features/xp/functions/calculateXP';
import { XPResults } from '@/features/xp/types/xp-types';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { useLearningCycleStore } from '@/shared/stores/useLearningCycleStore';
import {
  filterLearningCycles,
  groupCyclesByAllDateDifferences,
} from '../functions/filter-learning-cycle';
import { HomeReviewCard } from './review/HomeReviewCard';
import { GrowthPresentation } from './startStudy/GrowthPresentation';

interface HomeMainProps {}

export const HomeMain: React.FC<HomeMainProps> = ({}) => {
  const navigate = useNavigate();
  const { learningCycles: learningCycles, fetchLearningCycles } = useLearningCycleStore(
    (state) => state
  );

  // const learningCycles = useMemo(() => generateMultipleLearningCycles(5), []);

  useEffect(() => {
    fetchLearningCycles();
  }, [fetchLearningCycles]);

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

  const learningCycle = learningCycles[0];

  const xpResults = useMemo(
    () =>
      learningCycle
        ? (calculateTotalXP({
            sessions: learningCycle.sessions,
            testDurationMs: learningCycle.testDurationMs,
            learningDurationMs: learningCycle.learningDurationMs,
            nextPlantStage: learningCycle.plant.currentStage,
          }) as XPResults)
        : null,
    [learningCycle]
  );

  return (
    <div>
      <HomeReviewCard
        groupedCycles={groupedCycles}
        todayReviewCyclesCount={todayReviewCycles.length}
        todayReviewedCyclesCount={todayReviewedCycles.length}
        onStartReview={handleStartReview}
      />
      <GrowthPresentation learnings={learnings} onStartStudy={() => navigate('/textbooks')} />
      {xpResults && <TotalXPModal opened onClose={() => {}} results={xpResults} />}
    </div>
  );
};
