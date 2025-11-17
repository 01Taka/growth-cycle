import { calculateReviewNecessity } from '@/features/app/review-necessity/functions/calc-necessity';
import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  CategoryDetail,
  LearningCycleProblem,
  LearningCycleSession,
  LearningCycleTestResult,
  ProblemScoringStatus,
  TestSelfEvaluation,
  UnitDetail,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { safeArrayToRecord } from '@/shared/utils/object/object-utils';
import {
  ExpandedLearningCycle,
  ExpandedLearningCycleProblem,
  ExpandedLearningCycleSession,
  ExpandedLearningCycleTestResult,
} from '../types/expand-learning-cycle-types';

export const expandLearningCycleProblems = (
  problems: LearningCycleProblem[],
  latestAttemptedAt: number,
  unitMap: Record<string, UnitDetail>,
  categoryMap: Record<string, CategoryDetail>
): ExpandedLearningCycleProblem[] => {
  return problems.map((problem) => {
    const unit = problem.unitId ? unitMap[problem.unitId] : null;
    const category = problem.categoryId ? categoryMap[problem.categoryId] : null;
    return {
      ...problem,
      latestAttemptedAt,
      unit,
      category,
      unitName: unit?.name ?? '',
      categoryName: category?.name ?? '',
    };
  });
};

export const createExpandedLearningCycleTestResultsFromCycle = (
  attemptAt: number,
  learningCycle: LearningCycle | ExpandedLearningCycle,
  selfEvaluationsMap: Record<string, TestSelfEvaluation>,
  scoringStatusMap: Record<string, ProblemScoringStatus>,
  elapsedTimeMap: Record<string, number>
): ExpandedLearningCycleTestResult[] => {
  const unitMap =
    'unitMap' in learningCycle
      ? learningCycle.unitMap
      : safeArrayToRecord(learningCycle.units, 'id');
  const categoryMap =
    'categoryMap' in learningCycle
      ? learningCycle.categoryMap
      : safeArrayToRecord(learningCycle.categories, 'id');

  return createExpandedLearningCycleTestResults(
    learningCycle.problems,
    attemptAt,
    unitMap,
    categoryMap,
    selfEvaluationsMap,
    scoringStatusMap,
    elapsedTimeMap
  );
};

export const createExpandedLearningCycleTestResults = (
  problems: LearningCycleProblem[],
  attemptAt: number,
  unitMap: Record<string, UnitDetail>,
  categoryMap: Record<string, CategoryDetail>,
  selfEvaluationsMap: Record<string, TestSelfEvaluation>,
  scoringStatusMap: Record<string, ProblemScoringStatus>,
  elapsedTimeMap: Record<string, number>
): ExpandedLearningCycleTestResult[] => {
  return problems.map((problem) => {
    const selfEvaluation = selfEvaluationsMap[problem.structuredId] ?? 'unrated';
    const scoringStatus = scoringStatusMap[problem.structuredId] ?? 'unrated';
    const necessity = calculateReviewNecessity(selfEvaluation, scoringStatus);
    const unit = problem.unitId ? (unitMap[problem.unitId] ?? null) : null;
    const category = problem.categoryId ? (categoryMap[problem.categoryId] ?? null) : null;

    return {
      structuredId: problem.structuredId,
      problemIndex: problem.problemIndex,
      unitId: problem.unitId,
      categoryId: problem.categoryId,
      problemNumber: problem.problemNumber,
      unit,
      category,
      unitName: unit?.name ?? '',
      categoryName: category?.name ?? '',
      timeSpentMs: elapsedTimeMap[problem.structuredId] ?? 0,
      necessity,
      attemptAt,
      selfEvaluation,
      scoringStatus,
    };
  });
};

export const expandLearningCycleTestResults = (
  results: LearningCycleTestResult[],
  attemptAt: number,
  problemMap: Record<string, LearningCycleProblem>,
  unitMap: Record<string, UnitDetail>,
  categoryMap: Record<string, CategoryDetail>
): ExpandedLearningCycleTestResult[] => {
  return results.map((result) => {
    const problem = problemMap[result.problemIndex];

    const necessity = calculateReviewNecessity(result.selfEvaluation, result.scoringStatus);

    return {
      ...result,
      necessity,
      attemptAt,
      unitId: problem.unitId,
      categoryId: problem.categoryId,
      problemNumber: problem.problemNumber,
      unit: problem.unitId ? unitMap[problem.unitId] : null,
      category: problem.categoryId ? categoryMap[problem.categoryId] : null,
      unitName: problem.unitId ? (unitMap[problem.unitId]?.name ?? '') : '',
      categoryName: problem.categoryId ? (categoryMap[problem.categoryId]?.name ?? '') : '',
    };
  });
};

export const expandLearningCycleSessions = (
  sessions: LearningCycleSession[],
  problemMap: Record<string, LearningCycleProblem>,
  unitMap: Record<string, UnitDetail>,
  categoryMap: Record<string, CategoryDetail>
): ExpandedLearningCycleSession[] => {
  return sessions.map((session) => {
    const results = expandLearningCycleTestResults(
      session.results,
      session.attemptedAt,
      problemMap,
      unitMap,
      categoryMap
    );
    const resultsMap = safeArrayToRecord(results, 'problemIndex');
    return {
      ...session,
      results,
      resultsMap,
    };
  });
};

export const expandLearningCycle = (learningCycle: LearningCycle): ExpandedLearningCycle => {
  const problemMap = safeArrayToRecord(learningCycle.problems, 'problemIndex');
  const unitMap = safeArrayToRecord(learningCycle.units, 'id');
  const categoryMap = safeArrayToRecord(learningCycle.categories, 'id');

  return {
    ...learningCycle,
    problems: expandLearningCycleProblems(
      learningCycle.problems,
      learningCycle.latestAttemptedAt,
      unitMap,
      categoryMap
    ),
    sessions: expandLearningCycleSessions(learningCycle.sessions, problemMap, unitMap, categoryMap),
    problemMap,
    unitMap,
    categoryMap,
    unitNames: learningCycle.units.map((unit) => unit.name),
    categoryNames: learningCycle.categories.map((category) => category.name),
  };
};
