import React from 'react';
import { ReviewLearningCycleList } from './review/ReviewLearningCycleList';

interface HomeMainProps {}

export const HomeMain: React.FC<HomeMainProps> = ({}) => {
  return (
    <div>
      <ReviewLearningCycleList />
    </div>
  );
};
