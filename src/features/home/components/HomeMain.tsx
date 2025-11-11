import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePlantShapeWithConfigLoad } from '@/features/plants/functions/plant-utils';
import { useLearningCycleStore } from '@/shared/stores/useLearningCycleStore';
import {
  convertLearningCyclesToReviewItemMap,
  createReviewCountGetter,
  createReviewItemGetter,
  filterTodayLearningCycles,
} from '../functions/convert-learning-cycle';
import { generateMultipleLearningCycles } from '../utils/learning-cycle-dummy';
import { HomeReviewCard } from './review/HomeReviewCard';
import { GrowthPresentation } from './startStudy/GrowthPresentation';

interface HomeMainProps {}

export const HomeMain: React.FC<HomeMainProps> = ({}) => {
  const { fetchLearningCycles } = useLearningCycleStore((state) => state);

  const learningCycles = useMemo(() => generateMultipleLearningCycles(10), []);

  useEffect(() => {
    fetchLearningCycles();
  }, [fetchLearningCycles]);

  const reviewPropsMap = useMemo(
    () => convertLearningCyclesToReviewItemMap(learningCycles),
    [learningCycles]
  );

  useEffect(() => {
    const generate = async () => {
      const plant = await generatePlantShapeWithConfigLoad('science');
      console.log(plant);
    };
    for (let index = 0; index < 10; index++) {
      generate();
    }
  }, []);

  const navigate = useNavigate();

  const todayCycles = filterTodayLearningCycles(learningCycles);
  const learnings = todayCycles.map((cycle) => ({ subject: cycle.subject }));
  const getItem = createReviewItemGetter(reviewPropsMap);
  const getCount = createReviewCountGetter(reviewPropsMap);

  return (
    <div>
      <HomeReviewCard
        totalYesterdayReviewNum={getCount(-1).total}
        completedYesterdayReviewNum={getCount(-1).completed}
        totalLastWeekReviewNum={getCount(-7).total}
        completedLastWeekReviewNum={getCount(-7).completed}
        yesterdayItems={getItem(-1)}
        lastWeekItems={getItem(-7)}
      />
      <GrowthPresentation learnings={learnings} onStartStudy={() => navigate('/textbooks')} />
    </div>
  );
};
