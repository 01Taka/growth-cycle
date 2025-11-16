import { useMemo } from 'react';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { safeArrayToRecord } from '@/shared/utils/object/object-utils';
import { createProblemListItems } from '../functions/problemList/create-problem-list-items';
import { mapProblemIndexToGroupKey } from '../functions/problemList/problem-list-key-utils';
import { ProblemListItemData } from '../types/problem-list-types';

export const useProblemList = (
  learningCycles: LearningCycleDocument[],
  problemsFilter?: (problem: ProblemListItemData) => boolean
) => {
  const problems = useMemo(() => {
    if (learningCycles.length > 0) {
      const problems = createProblemListItems(learningCycles);
      const filteredProblems = problemsFilter
        ? problems.filter((problem) => problemsFilter(problem))
        : problems;

      return filteredProblems.sort();
    }
    return [];
  }, [learningCycles, problemsFilter]);

  const problemsMap = useMemo(() => safeArrayToRecord(problems, 'key'), [problems]);

  const learningCycleMap = useMemo(() => {
    return safeArrayToRecord(learningCycles, 'id');
  }, [learningCycles]);

  const learningCycleKeySetMap: Record<string, Set<string>> = useMemo(() => {
    const entries = Object.entries(learningCycleMap).map(([cycleId, cycle]) => {
      const keyMap = mapProblemIndexToGroupKey(cycle);
      const keySet = new Set(Object.values(keyMap));
      return [cycleId, keySet];
    });
    return Object.fromEntries(entries);
  }, [learningCycleMap]);

  return { problems, problemsMap, learningCycleKeySetMap };
};
