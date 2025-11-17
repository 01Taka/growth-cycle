import { useMemo } from 'react';
import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { safeArrayToRecord } from '@/shared/utils/object/object-utils';
import {
  getRecommendedTestData,
  getTestOverviewMap,
} from '../functions/cycleList/test-problems-utils';
import {
  calculateAvgTimeMap,
  groupResultsByProblemWithAttemptAt,
} from '../functions/problemList/cycles-to-map';
import { RecommendationJudgeFunction } from '../types/cycle-list-types';
import { ProblemListItemData } from '../types/problem-list-types';

export const useRecommendedTest = (
  learningCycles: LearningCycleDocument[],
  problems: ProblemListItemData[],
  isRecommendedJudge?: RecommendationJudgeFunction
) => {
  const problemMap = useMemo(() => {
    return safeArrayToRecord(problems, 'key');
  }, [problems]);

  const isRecommendedGetter = useMemo(() => {
    return isRecommendedJudge ?? ((stage: number, _item: ProblemListItemData) => stage === 0);
  }, [isRecommendedJudge]);

  const recommendedTestMap = useMemo(() => {
    return getRecommendedTestData(learningCycles, problemMap, isRecommendedGetter);
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
