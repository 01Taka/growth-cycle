import React from 'react';
import { Modal } from '@mantine/core';
import { HistoryDetailModalTabType } from '../../types/learning-history-types';
import { ProblemListItemData } from '../../types/problem-list-types';
import { HistoryModalContent } from './HistoryModalContent';

interface LearningHistoryDetailModalProps {
  opened: boolean;
  problems: ProblemListItemData[];
  selectedProblemIdSet: Set<string>;
  problemIndexMap: Record<string, number>;
  activeTab: HistoryDetailModalTabType;
  onChangeTab: (type: HistoryDetailModalTabType) => void;
  onToggleSelect: (id: string, problem: ProblemListItemData) => void;
  onClose: () => void;
  onClearCustomSelect: () => void;
}

export const LearningHistoryDetailModal: React.FC<LearningHistoryDetailModalProps> = ({
  opened,
  problems,
  selectedProblemIdSet,
  problemIndexMap,
  activeTab,
  onChangeTab,
  onToggleSelect,
  onClose,
  onClearCustomSelect,
}) => {
  return (
    <Modal opened={opened} onClose={onClose}>
      <HistoryModalContent
        problems={problems}
        selectedProblemIdSet={selectedProblemIdSet}
        problemIndexMap={problemIndexMap}
        activeTab={activeTab}
        onChangeTab={onChangeTab}
        onToggleSelect={onToggleSelect}
        onClearCustomSelect={onClearCustomSelect}
      />
    </Modal>
  );
};
