import React from 'react';
import { Box, Stack } from '@mantine/core';
import { CycleItemData } from '../../types/cycle-list-types';
import { LearningCycleListItem } from './LearningCycleListItem';

export interface LearningCycleListProps {
  cycleListItems: CycleItemData[];
  openedDetailId: string | null;
  alwaysOpen?: boolean;
  toggleOpenedDetail: (item: CycleItemData) => void;
  onStartReview: (item: CycleItemData) => void;
  onCheckAndSelectProblems: (item: CycleItemData) => void;
}

export const LearningCycleList: React.FC<LearningCycleListProps> = ({
  cycleListItems,
  openedDetailId,
  alwaysOpen,
  toggleOpenedDetail,
  onStartReview,
  onCheckAndSelectProblems,
}) => {
  return (
    <Stack gap="xs" align="center" w="100%">
      {cycleListItems.map((item, index) => {
        const openedDetail =
          openedDetailId === item.cycleId ||
          (!!alwaysOpen && openedDetailId === null && index === 0);

        return (
          <Box w={'95%'} key={item.cycleId}>
            <LearningCycleListItem
              {...item}
              openedDetail={openedDetail}
              toggleOpenedDetail={() => toggleOpenedDetail(item)}
              onStartReview={() => onStartReview(item)}
              onCheckAndSelectProblems={() => onCheckAndSelectProblems(item)}
            />
          </Box>
        );
      })}
    </Stack>
  );
};
