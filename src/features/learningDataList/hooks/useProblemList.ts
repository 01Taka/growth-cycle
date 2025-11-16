import { useMemo } from 'react';
import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { createProblemListItems } from '../functions/problemList/create-problem-list-items';
import { ProblemListItemData } from '../types/problem-list-types';

export const useProblemList = (
  learningCycles: LearningCycle[],
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

  return { problems };
};
