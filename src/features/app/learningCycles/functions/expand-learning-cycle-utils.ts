import { calculateGroupReviewNecessity } from '@/features/app/review-necessity/functions/calc-group-necessity';
import { calculateReviewNecessity } from '@/features/app/review-necessity/functions/calc-necessity';
import {
  GroupReviewNecessityResult,
  ReviewNecessityResultWithGroup,
} from '@/features/app/review-necessity/types/review-necessity-types';
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
import { range } from '@/shared/utils/range';
import {
  ExpandedLearningCycle,
  ExpandedLearningCycleProblem,
  ExpandedLearningCycleSession,
  ExpandedLearningCycleTestResult,
  GroupedByIndexTestResult,
} from '../types/expand-learning-cycle-types';

export const expandLearningCycleProblems = (
  problems: LearningCycleProblem[],
  unitMap: Record<string, UnitDetail>,
  categoryMap: Record<string, CategoryDetail>
): ExpandedLearningCycleProblem[] => {
  return problems.map((problem) => {
    return {
      ...problem,
      unit: problem.unitId ? unitMap[problem.unitId] : null,
      category: problem.categoryId ? categoryMap[problem.categoryId] : null,
    };
  });
};

export const createExpandedLearningCycleTestResults = (
  attemptAt: number,
  learningCycle: LearningCycle | ExpandedLearningCycle,
  selfEvaluationsMap: Record<number, TestSelfEvaluation>,
  scoringStatusMap: Record<number, ProblemScoringStatus>,
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

  return learningCycle.problems.map((problem) => {
    const selfEvaluation = selfEvaluationsMap[problem.index] ?? 'unrated';
    const scoringStatus = scoringStatusMap[problem.index] ?? 'unrated';
    const necessity = calculateReviewNecessity(selfEvaluation, scoringStatus);
    const unit = problem.unitId ? (unitMap[problem.unitId] ?? null) : null;
    const category = problem.categoryId ? (categoryMap[problem.categoryId] ?? null) : null;

    return {
      necessity,
      problemIndex: problem.index,
      attemptAt,
      selfEvaluation,
      scoringStatus,
      timeSpentMs: elapsedTimeMap[problem.index] ?? 0,
      unitId: problem.unitId,
      categoryId: problem.categoryId,
      problemNumber: problem.index,
      unitName: unit?.name ?? '',
      categoryName: category?.name ?? '',
      unit,
      category,
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
  const problemMap = safeArrayToRecord(learningCycle.problems, 'index');
  const unitMap = safeArrayToRecord(learningCycle.units, 'id');
  const categoryMap = safeArrayToRecord(learningCycle.categories, 'id');

  return {
    ...learningCycle,
    problems: expandLearningCycleProblems(learningCycle.problems, unitMap, categoryMap),
    sessions: expandLearningCycleSessions(learningCycle.sessions, problemMap, unitMap, categoryMap),
    problemMap,
    unitMap,
    categoryMap,
    unitNames: learningCycle.units.map((unit) => unit.name),
    categoryNames: learningCycle.categories.map((category) => category.name),
  };
};
/**

 * number (Unix Time) の配列から、それをキー、インデックスを値とするRecordを生成します。

 * 現在時刻を基準に、過去のタイムスタンプは正のインデックス（最近が0）、未来のタイムスタンプは負のインデックス（近い未来が-1）をつけます。

 *

 * @param timestamps number (ミリ秒のUnix Time) の配列

 * @param currentTime 基準となる現在時刻（ミリ秒のUnix Time、デフォルトは実行時の現在時刻）

 * @returns timestamp (number) をキー、インデックス (number) を値とするRecord

 */

const createTimeIndexRecord = (
  timestamps: number[],
  currentTime: number = Date.now()
): Record<number, number> => {
  // 1. 重複を取り除き、一意なタイムスタンプの配列を生成
  const uniqueTimestamps = Array.from(new Set(timestamps));
  // 2. 全てのタイムスタンプを降順にソート (新しいものから古いものへ)
  // これにより、過去 -> 現在 -> 未来 の順に並ぶ
  uniqueTimestamps.sort((a, b) => b - a);
  const indexRecord: Record<number, number> = {};
  let futureIndexCounter = -1; // 未来のタイムスタンプのインデックス用 (-1, -2, ...)

  // 3. 単一ループでインデックスを割り当て
  for (let i = 0; i < uniqueTimestamps.length; i++) {
    const timestamp = uniqueTimestamps[i];
    if (timestamp <= currentTime) {
      // i=0 が最も最近の過去になる (0, 1, ...)
      indexRecord[timestamp] = i;
    } else {
      // -1 が最も近い未来になる (-1, -2, ...)
      indexRecord[timestamp] = futureIndexCounter;
      futureIndexCounter--; // 次の未来のためにデクリメント
    }
  }

  return indexRecord;
};

const createAttemptAtMap = (
  learningCycle: ExpandedLearningCycle,
  additionalResults: ExpandedLearningCycleTestResult[][] = [],
  currentTime?: number
) => {
  const timestamps = [
    ...learningCycle.sessions.map((session) => session.attemptedAt),
    ...additionalResults.flatMap((results) => results.map((result) => result.attemptAt)),
  ];

  return createTimeIndexRecord(timestamps, currentTime);
};

const getGroupNecessity = (
  results: ExpandedLearningCycleTestResult[]
): GroupReviewNecessityResult => {
  const recentResults = results.sort((a, b) => a.attemptAt - b.attemptAt).slice(-2);
  const necessities = recentResults.map((result) => result.necessity);
  return calculateGroupReviewNecessity(necessities);
};

export const groupingTestResultsByIndex = (
  learningCycle: ExpandedLearningCycle,
  additionalResults: ExpandedLearningCycleTestResult[][] = [],
  currentTime?: number
): GroupedByIndexTestResult[] => {
  const totalProblemCount = learningCycle.problems.length;

  // 結果マップの統合処理を簡素化
  const resultMapArray = [
    ...learningCycle.sessions.map((session) => session.resultsMap),
    ...additionalResults.map((results) => safeArrayToRecord(results, 'problemIndex')),
  ];

  const attemptAtMap = createAttemptAtMap(learningCycle, additionalResults, currentTime);

  const groupedProblems = Object.fromEntries(
    [...range(totalProblemCount)].map((index) => {
      const problems: ExpandedLearningCycleTestResult[] = resultMapArray.map(
        (resultMap) => resultMap[index]
      );
      const groupNecessity = getGroupNecessity(problems);

      const expandedProblems = problems.map((problem) => ({
        ...problem,
        attemptAtOrder: attemptAtMap[problem.attemptAt],
        groupNecessity,
        higherLevelNecessity:
          groupNecessity.level > problem.necessity.level ? groupNecessity : problem.necessity,
      }));
      const sortedProblems = expandedProblems.sort((a, b) => a.attemptAtOrder - b.attemptAtOrder);
      return [index, sortedProblems];
    })
  );

  return [...range(totalProblemCount)].map((index) => {
    const sameIndexResults = groupedProblems[index];

    const sampleResult = sameIndexResults[0];
    const resultsMapByAttemptOrder = safeArrayToRecord(sameIndexResults, 'attemptAtOrder');

    return {
      problemIndex: index,
      category: sampleResult.category,
      unit: sampleResult.unit,
      problemNumber: sampleResult.problemNumber,
      groupNecessity: sampleResult.groupNecessity,
      results: sameIndexResults,
      resultsMapByAttemptOrder,
    };
  });
};
