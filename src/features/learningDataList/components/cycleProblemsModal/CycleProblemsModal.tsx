import React from 'react';
import { Modal } from '@mantine/core';
import { CycleProblemsModalTabType } from '../../types/cycle-problems-modal-types';
import { ProblemListItemData } from '../../types/problem-list-types';
import { CycleProblemsModalContent } from './CycleProblemsModalContent';

interface CycleProblemsModalProps {
  openedModal: boolean;
  displayingProblems: ProblemListItemData[];
  selectedProblemIdSet: Set<string>;
  problemIndexMap: Record<string, number>;
  activeTab: CycleProblemsModalTabType;
  onChangeTab: (type: CycleProblemsModalTabType) => void;
  onToggleSelect: (id: string, problem: ProblemListItemData) => void;
  onClose: () => void;
  onClearCustomSelect: () => void;
}

export const CycleProblemsModal: React.FC<CycleProblemsModalProps> = ({
  openedModal,
  displayingProblems,
  selectedProblemIdSet,
  problemIndexMap,
  activeTab,
  onChangeTab,
  onToggleSelect,
  onClose,
  onClearCustomSelect,
}) => {
  return (
    <Modal opened={openedModal} onClose={onClose}>
      <CycleProblemsModalContent
        problems={displayingProblems}
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
