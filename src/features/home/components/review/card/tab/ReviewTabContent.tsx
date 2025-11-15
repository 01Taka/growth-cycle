import React, { useState } from 'react';
import { Stack } from '@mantine/core';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { ReviewSection } from './ReviewSection';

interface ReviewTabContentProps {
  tabKey: string;
  reviewCycles: LearningCycleDocument[];
  reviewedCycles: LearningCycleDocument[];
  displayDetailCycleId: string | null;
  onToggleDetail: (cycleId: string) => void;
  onSelectReviewTarget: (cycle: LearningCycleDocument | null) => void;
}

export const ReviewTabContent: React.FC<ReviewTabContentProps> = ({
  tabKey,
  reviewCycles,
  reviewedCycles,
  displayDetailCycleId,
  onToggleDetail,
  onSelectReviewTarget,
}) => {
  const [openedCompletedSection, setOpenedCompletedSection] = useState(false);
  return (
    <Stack gap="lg">
      <ReviewSection
        title="reviewPlanned"
        cycles={reviewCycles}
        tabKey={tabKey}
        isCompleted={false}
        displayDetailCycleId={displayDetailCycleId}
        onToggleDetail={onToggleDetail}
        onSelectReviewTarget={onSelectReviewTarget}
      />

      <ReviewSection
        title="reviewCompleted"
        cycles={reviewedCycles}
        tabKey={tabKey}
        isCompleted={true}
        displayDetailCycleId={displayDetailCycleId}
        onToggleDetail={onToggleDetail}
        onSelectReviewTarget={onSelectReviewTarget}
        isSectionOpen={openedCompletedSection}
        onToggleSection={() => setOpenedCompletedSection((prev) => !prev)}
      />
    </Stack>
  );
};
