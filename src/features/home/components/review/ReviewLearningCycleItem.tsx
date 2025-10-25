import React from 'react';
import { Card } from '@mantine/core';
import { PlantImageItem } from '@/features/plants/components/PlantImageItem';
import { useSubjectColorMap } from '@/shared/hooks/useSubjectColor';
import { LearningCycle } from '@/shared/types/learning-cycle-types';
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

  const subjectTheme = useSubjectColorMap(learningCycle.subject);

  return (
    <Card bg={subjectTheme.bgCard}>
      <PlantImageItem subject={learningCycle.subject} index={plantIndex} width={64} height={64} />
    </Card>
  );
};
