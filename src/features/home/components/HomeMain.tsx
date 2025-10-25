import React from 'react';
import { PlantImageItem } from '@/features/plants/components/PlantImageItem';

interface HomeMainProps {}

export const HomeMain: React.FC<HomeMainProps> = ({}) => {
  return (
    <div>
      {[...Array(20).keys()].map((index) => (
        <PlantImageItem subject="math" index={index} isLoop />
      ))}

      <h1>HomeMainContent</h1>
    </div>
  );
};
