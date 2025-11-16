import React from 'react';
import { Flex } from '@mantine/core';
import { ProblemListItemData } from '../../learningHistory/types/problem-list-types';
import { ActionInfo } from './item/ActionInfo';
import { ProblemInfo } from './item/ProblemInfo';
import { SelectionCheckbox } from './item/SelectionCheckbox';

interface ProblemListItemProps {
  problem: ProblemListItemData;
  problemIndex: number;
  isSelected: boolean;
  onToggleSelect: () => void;
}

export const ProblemListItem: React.FC<ProblemListItemProps> = ({
  problem,
  problemIndex,
  isSelected,
  onToggleSelect,
}) => {
  return (
    <Flex
      p="sm"
      align="center"
      gap="lg"
      bg={isSelected ? 'blue.0' : 'white'}
      onClick={onToggleSelect}
      style={{ cursor: 'pointer' }}
    >
      <SelectionCheckbox isSelected={isSelected} problemIndex={problemIndex} />
      <ProblemInfo problem={problem} />
      <ActionInfo problem={problem} />
    </Flex>
  );
};
