import { useMemo } from 'react';
import {
  LearningCycle,
  LearningCycleDocument,
} from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { safeArrayToRecord } from '@/shared/utils/object/object-utils';
import {
  getRecommendedTestData,
  getTestOverviewMap,
} from '../functions/cycleList/test-problems-utils';
import {
  calculateAvgTimeMap,
  groupResultsByProblemWithAttemptAt,
} from '../functions/problemList/cycles-to-map';
import { ProblemListItemData } from '../types/problem-list-types';

export const useRecommendedTest = (
  learningCycles: LearningCycleDocument[],
  problems: ProblemListItemData[]
) => {
  const problemMap = useMemo(() => {
    return safeArrayToRecord(problems, 'key');
  }, [problems]);

  const recommendedTestMap = useMemo(() => {
    return getRecommendedTestData(learningCycles, problemMap);
  }, [learningCycles, problemMap]);

  const avgTimeMap = useMemo(() => {
    const group = groupResultsByProblemWithAttemptAt(learningCycles);
    return calculateAvgTimeMap(group, 4);
  }, [learningCycles]);

  const recommendedTestOverviewMap = useMemo(() => {
    return getTestOverviewMap(recommendedTestMap, avgTimeMap);
  }, [recommendedTestMap, avgTimeMap]);

  return { problemMap, recommendedTestMap, avgTimeMap, recommendedTestOverviewMap };
};
