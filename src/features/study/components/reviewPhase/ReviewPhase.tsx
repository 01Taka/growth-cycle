import React, { useMemo } from 'react';
import { IconCircleCheck } from '@tabler/icons-react';
import { Box, Button, rem, Stack } from '@mantine/core';
import { sharedStyle } from '@/shared/styles/shared-styles';
import { SubjectColorMap } from '@/shared/theme/subjectColorType';
import { sortLearningRecord } from '../../functions/review-utils';
import { ProblemLearningRecord } from '../../types/problem-types';
import { RecordReviewCard } from './RecordReviewCard';

interface ReviewPhaseProps {
  records: ProblemLearningRecord[];
  theme: SubjectColorMap;
}

export const ReviewPhase: React.FC<ReviewPhaseProps> = ({ records, theme }) => {
  const sortedRecords = useMemo(() => sortLearningRecord(records), [records]);

  return (
    <Box style={{ position: 'relative' }}>
      <Stack w={'100%'} align="center" justify="center">
        {sortedRecords.map((record, index) => (
          <Box w={'95%'}>
            <RecordReviewCard key={index} record={record} />
          </Box>
        ))}
      </Stack>
      <Button
        w={'100%'}
        h={64}
        color={theme.accent}
        size={rem(20)}
        style={{
          ...sharedStyle.button,
          position: 'fixed',
          bottom: 0,
          right: 0,
          left: 0,
          color: theme.text,
        }}
      >
        見直し完了
        <IconCircleCheck />
      </Button>
    </Box>
  );
};
