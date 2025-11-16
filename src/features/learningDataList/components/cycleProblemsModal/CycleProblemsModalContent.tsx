import React from 'react';
import { Button, Group, Stack, Tabs } from '@mantine/core';
import { ProblemList } from '@/features/learningDataList/components/problemList/ProblemList';
import {
  CYCLE_PROBLEMS_MODAL_TABS,
  CYCLE_PROBLEMS_MODAL_TEXT,
} from '../../constants/cycle-problems-modal-constants';
import { CycleProblemsModalTabType } from '../../types/cycle-problems-modal-types';
import { ProblemListItemData } from '../../types/problem-list-types';

interface CycleProblemsModalContentProps {
  problems: ProblemListItemData[];
  selectedProblemIdSet: Set<string>;
  problemIndexMap: Record<string, number>;
  activeTab: CycleProblemsModalTabType;
  onChangeTab: (type: CycleProblemsModalTabType) => void;
  onToggleSelect: (id: string, problem: ProblemListItemData) => void;
  onClearCustomSelect: () => void;
}

export const CycleProblemsModalContent: React.FC<CycleProblemsModalContentProps> = ({
  problems,
  selectedProblemIdSet,
  problemIndexMap,
  activeTab,
  onChangeTab,
  onToggleSelect,
  onClearCustomSelect,
}) => {
  const handleTabChange = (value: string | null) => {
    if (value) {
      onChangeTab(value as CycleProblemsModalTabType);
    }
  };

  const isCustomTabActive = activeTab === 'custom';
  const hasCustomSelections = selectedProblemIdSet.size > 0;

  return (
    <Stack gap="md" style={{ padding: '10px' }}>
      <Tabs value={activeTab} onChange={handleTabChange} variant="pills" defaultValue="custom">
        <Group justify="space-between" align="center" mb="sm">
          <Tabs.List>
            {/* 💡 定数配列をマップして Tabs.Tab を生成 */}
            {CYCLE_PROBLEMS_MODAL_TABS.map((tab) => (
              <Tabs.Tab key={tab.value} value={tab.value}>
                {tab.label}
                {/* カスタムタブがアクティブで、選択がある場合にのみ数を表示 */}
                {tab.value === activeTab && (
                  <span style={{ marginLeft: '2px' }}>
                    {CYCLE_PROBLEMS_MODAL_TEXT.selectionCountSeparator}
                    {selectedProblemIdSet.size}
                    {CYCLE_PROBLEMS_MODAL_TEXT.selectionCountCloser}
                  </span>
                )}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {/* 🗑️ すべて選択を解除ボタン (テキスト定数を使用) */}
          {isCustomTabActive && hasCustomSelections && (
            <Button
              variant="light"
              color="red"
              size="xs"
              onClick={onClearCustomSelect}
              leftSection={<span style={{ fontSize: '1.2em' }}>❌</span>}
            >
              {CYCLE_PROBLEMS_MODAL_TEXT.clearButton}
            </Button>
          )}
        </Group>

        <ProblemList
          problems={problems}
          selectedProblemIdSet={selectedProblemIdSet}
          problemIndexMap={problemIndexMap}
          onToggleSelect={onToggleSelect}
        />
      </Tabs>
    </Stack>
  );
};
