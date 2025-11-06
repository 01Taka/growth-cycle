import React from 'react';
import { Box, Stack } from '@mantine/core';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { ProblemLearningRecord } from '../../types/problem-types';
import { RecordReviewCard } from './RecordReviewCard';

interface ReviewPhaseProps {
  records: ProblemLearningRecord[];
  theme: SubjectColorMap;
}

export const ReviewPhase: React.FC<ReviewPhaseProps> = ({ records, theme }) => {
  return (
    <Stack w={'100%'} align="center" justify="center">
      {records.map((record, index) => (
        <Box w={'95%'}>
          <RecordReviewCard key={index} record={record} />
        </Box>
      ))}
    </Stack>
  );
};
