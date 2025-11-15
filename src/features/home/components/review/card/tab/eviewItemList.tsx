import React from 'react';
import { Text } from '@mantine/core';
import { REVIEW_LABELS } from '@/features/home/constants/review-constants';
import { LearningHistoryItem } from '@/features/learningHistory/components/item/LearningHistoryItem';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';

interface ReviewItemListProps {
  cycles: LearningCycleDocument[];
  tabKey: string;
  isCompleted: boolean;
  displayDetailCycleId: string | null;
  onToggleDetail: (cycleId: string) => void;
  onSelectReviewTarget: (cycle: LearningCycleDocument | null) => void;
}

export const ReviewItemList: React.FC<ReviewItemListProps> = ({
  cycles,
  tabKey,
  isCompleted,
  displayDetailCycleId,
  onToggleDetail,
  onSelectReviewTarget,
}) => {
  if (!cycles || cycles.length === 0) {
    return (
      <Text c="dimmed" p="md">
        {isCompleted ? REVIEW_LABELS.noReviewedData : REVIEW_LABELS.noReviewData}
      </Text>
    );
  }

  return (
    <>
      {cycles.map((cycle, index) => (
        <LearningHistoryItem
          key={`${isCompleted ? 'reviewed' : 'review'}-${tabKey}-${index}`}
          plant={cycle.plant}
          subject={cycle.subject}
          textbookName={cycle.textbookName}
          unitNames={cycle.units.map((unit) => unit.name)}
          actionColor="orange"
          differenceFromLastAttempt={-parseInt(tabKey)}
          testTargetProblemCount={cycle.problems.length}
          estimatedTestTimeMin={Math.floor((cycle.testDurationMs || 0) / 60000)}
          openedDetail={displayDetailCycleId === cycle.id}
          toggleOpenedDetail={() => onToggleDetail(cycle.id)}
          onStartReview={() => {
            if (!isCompleted) {
              onSelectReviewTarget(cycle);
            }
          }}
          onCheckAndSelectProblems={() => {}}
          differenceToNextFixedReview={0}
          isWaitingFixedReview
          fixation={0}
          aggregatedSections={[]}
        />
      ))}
    </>
  );
};
