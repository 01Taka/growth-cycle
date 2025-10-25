import React from 'react';
import { PlantImageItem } from '@/features/plants/components/PlantImageItem';
import { LearningCycle } from '@/shared/types/study-log-types';
import { createSeededRandom } from '../../functions/cyrb128';
import { getDeterministicRandom } from '../../functions/deterministic-random';

interface ReviewLearningCycleItemProps {
  learningCycle: LearningCycle;
}

export const ReviewLearningCycleItem: React.FC<ReviewLearningCycleItemProps> = ({
  learningCycle,
}) => {
  const random = getDeterministicRandom(learningCycle.textbookId, 0);
  const maxIndex = 16;
  const plantIndex = Math.floor(random * (maxIndex + 1));

  return (
    <div>
      <PlantImageItem subject={learningCycle.subject} index={plantIndex} width={64} height={64} />
    </div>
  );
};
