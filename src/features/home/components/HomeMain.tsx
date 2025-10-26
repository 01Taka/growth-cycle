import React from 'react';
import { HomeReviewCard } from './review/HomeReviewCard';

interface HomeMainProps {}

export const HomeMain: React.FC<HomeMainProps> = ({}) => {
  return (
    <div>
      <HomeReviewCard />
    </div>
  );
};
