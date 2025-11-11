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
  onFinish: () => void;
}

export const ReviewPhase: React.FC<ReviewPhaseProps> = ({ records, theme, onFinish }) => {
  const sortedRecords = useMemo(() => sortLearningRecord(records), [records]);

  return (
    <Box style={{ position: 'relative' }}>
      <Stack w={'100%'} align="center" justify="center" mb={120}>
        {sortedRecords.map((record, index) => (
          <Box key={index} w={'95%'}>
            <RecordReviewCard record={record} />
          </Box>
        ))}
      </Stack>
      <Button
        h={64}
        color={theme.accent}
        size={rem(20)}
        style={{
          ...sharedStyle.button,
          position: 'fixed',
          bottom: 5,
          right: 5,
          left: 5,
          color: theme.text,
        }}
        onClick={onFinish}
      >
        見直し完了
        <IconCircleCheck />
      </Button>
    </Box>
  );
};
