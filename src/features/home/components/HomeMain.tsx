import React from 'react';
import { PlantImageItem } from '@/features/plants/components/PlantImageItem';
import { dummyLearningCycle } from '../utils/learning-cycle-dummy';
import { ReviewLearningCycleItem } from './review/ReviewLearningCycleItem';

interface HomeMainProps {}

export const HomeMain: React.FC<HomeMainProps> = ({}) => {
  return (
    <div>
      <ReviewLearningCycleItem learningCycle={dummyLearningCycle} />

      <h1>HomeMainContent</h1>
    </div>
  );
};
