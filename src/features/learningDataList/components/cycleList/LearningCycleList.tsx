import React from 'react';
import { Box, Stack } from '@mantine/core';
import { LearningCycleListItem } from './LearningCycleListItem';

interface LearningCycleListProps {}

export const LearningCycleList: React.FC<LearningCycleListProps> = ({}) => {
  return (
    <Stack gap="xs" align="center" w="100%">
      {filteredAndSortedItemData.map(({ cycleId, data }, index) => {
        const openedDetail = openedDetailId === cycleId || (openedDetailId === null && index === 0);

        return (
          <Box w={'95%'} key={cycleId}>
            <LearningCycleListItem
              {...data}
              openedDetail={openedDetail}
              toggleOpenedDetail={() => handleCheckDetail(cycleId)}
              onStartReview={() => navigate(`/study?cycleId=${cycleId}&phase=test`)}
              onCheckAndSelectProblems={() => handelOpen(data.textbookId)}
            />
          </Box>
        );
      })}
    </Stack>
  );
};
