import React, { useMemo } from 'react';
import {
  convertLearningCyclesToReviewItemMap,
  createReviewCountGetter,
  createReviewItemGetter,
} from '../functions/convert-learning-cycle';
import { dummyLearningCycle, dummyLearningCycles } from '../utils/learning-cycle-dummy';
import { HomeReviewCard } from './review/HomeReviewCard';

interface HomeMainProps {}

export const HomeMain: React.FC<HomeMainProps> = ({}) => {
  const reviewPropsMap = useMemo(
    () => convertLearningCyclesToReviewItemMap(dummyLearningCycles),
    [dummyLearningCycle]
  );

  const getItem = createReviewItemGetter(reviewPropsMap);
  const getCount = createReviewCountGetter(reviewPropsMap);

  return (
    <div>
      {
        <HomeReviewCard
          totalYesterdayReviewNum={getCount(-1).total}
          completedYesterdayReviewNum={getCount(-1).completed}
          totalLastWeekReviewNum={getCount(-7).total}
          completedLastWeekReviewNum={getCount(-7).completed}
          yesterdayItems={getItem(-1)}
          lastWeekItems={getItem(-7)}
        />
      }
    </div>
  );
};
