import React from 'react';
import { LearningHistoryMain } from '@/features/learningHistory/components/LearningHistoryMain';

interface LearningHistoryPageProps {}

export const LearningHistoryPage: React.FC<LearningHistoryPageProps> = ({}) => {
  return (
    <div>
      <LearningHistoryMain />
    </div>
  );
};
