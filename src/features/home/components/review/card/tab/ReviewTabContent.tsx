import React, { useState } from 'react';
import { Stack } from '@mantine/core';
import { ReviewSectionCycleListProps } from '@/features/home/types/review-section-types';
import { ReviewSection } from './ReviewSection';

interface ReviewTabContentProps {
  listProps: ReviewSectionCycleListProps;
}

export const ReviewTabContent: React.FC<ReviewTabContentProps> = ({ listProps }) => {
  const [openedCompletedSection, setOpenedCompletedSection] = useState(false);
  return (
    <Stack gap="lg">
      <ReviewSection
        title="reviewPlanned"
        listProps={{ ...listProps, cycleListItems: listProps.reviewCycleItems }}
      />

      <ReviewSection
        title="reviewCompleted"
        listProps={{ ...listProps, cycleListItems: listProps.reviewedCycleItems }}
        isSectionOpen={openedCompletedSection}
        onToggleSection={() => setOpenedCompletedSection((prev) => !prev)}
      />
    </Stack>
  );
};
