import { useCallback, useMemo, useState } from 'react';
import { CycleProblemsModalTabType } from '../types/cycle-problems-modal-types';
import { ProblemListItemData } from '../types/problem-list-types';

interface ModalData {
  textbookId: string;
  cycleId: string;
}

export const useCycleProblemsModal = (
  problems: ProblemListItemData[],
  recommendedTestMap: Record<string, Record<string, ProblemListItemData>>
) => {
  const [openedModalData, setOpenedModalData] = useState<null | ModalData>(null);
  const [tab, setTab] = useState<CycleProblemsModalTabType>('recommended');
  const [customSelectedProblemIdSet, setCustomSelectedProblemIdSet] = useState<Set<string>>(
    new Set()
  );

  const recommendedProblemIdSet: Set<string> = useMemo(() => {
    if (openedModalData && openedModalData.cycleId in recommendedTestMap) {
      const tests = recommendedTestMap[openedModalData.cycleId];
      const keys = Object.values(tests).map((test) => test.key);
      return new Set(keys);
    }
    return new Set();
  }, [openedModalData, recommendedTestMap]);

  const displayingProblems = useMemo(() => {
    if (!openedModalData) return [];
    const filterProblems = problems.filter(
      (problem) => problem.textbookId === openedModalData.textbookId
    );
    return filterProblems.sort((a, b) => a.problemIndexInTextbook - b.problemIndexInTextbook);
  }, [problems, openedModalData]);

  const problemIdSet = useMemo(() => {
    const problemIds = displayingProblems.map((problem) => problem.key);
    return new Set(problemIds);
  }, [displayingProblems]);

  const selectedProblemIdSet = useMemo(() => {
    switch (tab) {
      case 'recommended':
        return recommendedProblemIdSet;
      case 'all':
        return problemIdSet;
      case 'custom':
        return customSelectedProblemIdSet;
    }
  }, [tab, customSelectedProblemIdSet, problemIdSet, recommendedProblemIdSet]);

  const problemIndexMap = useMemo(() => {
    const result: Record<string, number> = {};
    let count = 0;

    for (const problem of displayingProblems) {
      if (selectedProblemIdSet.has(problem.key)) {
        result[problem.key] = count;
        count++;
      }
    }

    return result;
  }, [displayingProblems, selectedProblemIdSet]);

  const onToggleSelect = useCallback(
    (id: string) => {
      setCustomSelectedProblemIdSet((prevSet) => {
        let newSet: Set<string>;
        if (tab === 'custom') {
          newSet = new Set(prevSet);
        } else {
          // 'recommended' または 'all' の問題をベースにする
          newSet = new Set(selectedProblemIdSet);
          // タブを 'custom' に変更する
          setTab('custom');
        }

        // ID の選択状態を反転
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }

        return newSet;
      });
    },
    [tab, selectedProblemIdSet]
  );

  const onChangeTab = useCallback((tab: CycleProblemsModalTabType) => {
    setTab(tab);
  }, []);

  const onClearCustomSelect = useCallback(() => {
    setCustomSelectedProblemIdSet(new Set());
  }, []);

  return {
    displayingProblems,
    activeTab: tab,
    openedModal: openedModalData !== null,
    problemIndexMap,
    selectedProblemIdSet,
    onToggleSelect,
    onChangeTab,
    onClose: () => setOpenedModalData(null),
    onOpen: (textbookId: string, cycleId: string) => setOpenedModalData({ textbookId, cycleId }),
    onClearCustomSelect,
  };
};
