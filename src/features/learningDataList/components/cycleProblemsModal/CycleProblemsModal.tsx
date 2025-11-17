import React from 'react';
import { Button, Modal, Stack } from '@mantine/core';
import { CycleProblemsModalTabType } from '../../types/cycle-problems-modal-types';
import { ProblemListItemData } from '../../types/problem-list-types';
import { CycleProblemsModalContent } from './CycleProblemsModalContent';

interface CycleProblemsModalProps {
  openedModal: boolean;
  displayingProblems: ProblemListItemData[];
  selectedProblemIdSet: Set<string>;
  problemIndexMap: Record<string, number>;
  activeTab: CycleProblemsModalTabType;
  problemCount: number;
  testDurationMs: number;
  onChangeTab: (type: CycleProblemsModalTabType) => void;
  onToggleSelect: (id: string, problem: ProblemListItemData) => void;
  onClose: () => void;
  onClearCustomSelect: () => void;
  onStartReview: () => void;
}

export const CycleProblemsModal: React.FC<CycleProblemsModalProps> = ({
  openedModal,
  displayingProblems,
  selectedProblemIdSet,
  problemIndexMap,
  activeTab,
  problemCount,
  testDurationMs,
  onChangeTab,
  onToggleSelect,
  onClose,
  onClearCustomSelect,
  onStartReview,
}) => {
  return (
    <Modal opened={openedModal} onClose={onClose} h={'100vh'} style={{ position: 'relative' }}>
      <Stack w={'100%'} mih={'100vh'} pb={50}>
        <CycleProblemsModalContent
          problems={displayingProblems}
          selectedProblemIdSet={selectedProblemIdSet}
          problemIndexMap={problemIndexMap}
          activeTab={activeTab}
          onChangeTab={onChangeTab}
          onToggleSelect={onToggleSelect}
          onClearCustomSelect={onClearCustomSelect}
        />
        <Button
          size="xl"
          radius={'lg'}
          style={{ position: 'sticky', bottom: 5 }}
          disabled={problemCount === 0}
          color="orange"
          onClick={onStartReview}
        >
          学習開始 （{problemCount}問 / {Math.floor(testDurationMs / 60000)}分）
        </Button>
      </Stack>
    </Modal>
  );
};
