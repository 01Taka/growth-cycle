import { useCallback, useMemo, useState } from 'react';
import { CycleProblemsModalTabType } from '../types/cycle-problems-modal-types';
import { ProblemListItemData } from '../types/problem-list-types';

const isRecommended = (problem: ProblemListItemData) => {
  return problem.lastAttemptSM2Quality < 3 || problem.differenceFromNextAttempt <= 0;
};

export const useCycleProblemsModal = (problems: ProblemListItemData[]) => {
  const [openedModal, setOpenedModal] = useState(false);
  const [tab, setTab] = useState<CycleProblemsModalTabType>('recommended');
  const [customSelectedProblemIdSet, setCustomSelectedProblemIdSet] = useState<Set<string>>(
    new Set()
  );

  const problemIdSet = useMemo(() => {
    const problemIds = problems.map((problem) => problem.key);
    return new Set(problemIds);
  }, [problems]);

  const recommendedProblemIdSet = useMemo(() => {
    const problemIds = problems
      .filter((problem) => isRecommended(problem))
      .map((problem) => problem.key);
    return new Set(problemIds);
  }, [problems]);

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

    for (const problem of problems) {
      if (selectedProblemIdSet.has(problem.key)) {
        result[problem.key] = count;
        count++;
      }
    }

    return result;
  }, [problems, selectedProblemIdSet]);

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
    activeTab: tab,
    openedModal,
    problems,
    problemIndexMap,
    selectedProblemIdSet,
    onToggleSelect,
    onChangeTab,
    onClose: () => setOpenedModal(false),
    onOpen: () => setOpenedModal(true),
    onClearCustomSelect,
  };
};
