import { safeArrayToRecord } from '@/shared/utils/object/object-utils';
import { calculateGroupReviewNecessity } from '../../review-necessity/functions/calc-group-necessity';
import { GroupReviewNecessityResult } from '../../review-necessity/types/review-necessity-types';
import {
  ExpandedLearningCycle,
  ExpandedLearningCycleTestResult,
  GroupedByIndexTestResult,
  GroupedByIndexTestResultProblem,
} from '../types/expand-learning-cycle-types';

const createTimeIndexRecord = (
  timestamps: number[],
  currentTime: number = Date.now()
): Record<number, number> => {
  if (!Array.isArray(timestamps)) {
    throw new Error('timestamps should be an array of numbers.');
  }

  const uniqueTimestamps = Array.from(new Set(timestamps));
  uniqueTimestamps.sort((a, b) => b - a); // 降順ソート (新しいものから古いものへ)

  const indexRecord: Record<number, number> = {};
  let futureIndexCounter = -1;

  uniqueTimestamps.forEach((timestamp, i) => {
    if (timestamp <= currentTime) {
      indexRecord[timestamp] = i; // 過去は正のインデックス (0, 1, 2, ...)
    } else {
      indexRecord[timestamp] = futureIndexCounter--; // 未来は負のインデックス (-1, -2, ...)
    }
  });

  return indexRecord;
};

const createAttemptAtMap = (
  learningCycle: ExpandedLearningCycle,
  additionalResults: ExpandedLearningCycleTestResult[][] = [],
  currentTime?: number
): Record<number, number> => {
  const timestamps: number[] = [
    ...(learningCycle.sessions?.map((session) => session.attemptedAt) || []),
    ...(additionalResults?.flatMap((results) => results.map((result) => result.attemptAt)) || []),
  ];

  return createTimeIndexRecord(timestamps, currentTime);
};

const getGroupNecessity = (
  results: ExpandedLearningCycleTestResult[] = []
): GroupReviewNecessityResult => {
  if (!results.length) {
    throw new Error('results should not be empty.');
  }

  // 最近2件の結果を取得し、必要性を計算
  const recentResults = results.sort((a, b) => a.attemptAt - b.attemptAt).slice(-2);
  const necessities = recentResults.map((result) => result.necessity);

  return calculateGroupReviewNecessity(necessities);
};

// --- 新たに抽出・分割された補助関数 ---

/**
 * 学習サイクルと追加結果から、問題インデックスごとに結果を統合・グループ化します。
 */
const getGroupedResultsMap = (
  learningCycle: ExpandedLearningCycle,
  additionalResults: ExpandedLearningCycleTestResult[][]
): Record<number, ExpandedLearningCycleTestResult[]> => {
  // 1. 全ての結果マップを統合
  const resultMapArray = [
    ...(learningCycle.sessions?.map((session) => session.resultsMap) || []),
    ...(additionalResults?.map((results) => safeArrayToRecord(results, 'problemIndex')) || []),
  ];

  // 2. 問題インデックスごとに結果を集約
  const groupedResultsMap = Object.fromEntries(
    learningCycle.problems.map((problem) => {
      const problems: ExpandedLearningCycleTestResult[] = resultMapArray
        .map((resultMap) => resultMap?.[problem.problemIndex])
        .filter(Boolean); // nullやundefinedを除外

      return [problem.problemIndex, problems];
    })
  );

  return groupedResultsMap;
};

/**
 * 特定の問題インデックスの結果配列を、順序付けし、必要性を追加して拡張します。
 */
const expandAndSortProblemResults = (
  problems: ExpandedLearningCycleTestResult[],
  attemptAtMap: Record<number, number>
): GroupedByIndexTestResultProblem[] => {
  if (!problems.length) return [];

  const groupNecessity = getGroupNecessity(problems);

  const expandedProblems: GroupedByIndexTestResultProblem[] = problems.map((problem) => ({
    ...problem,
    attemptAtOrder: attemptAtMap[problem.attemptAt] || 0,
    groupNecessity,
    higherLevelNecessity:
      groupNecessity.level > problem.necessity.level ? groupNecessity : problem.necessity,
  }));

  // 試行順序でソート
  return expandedProblems.sort((a, b) => a.attemptAtOrder - b.attemptAtOrder);
};

/**
 * 問題インデックスごとの結果を最終的な出力形式に整形します（結果がない場合の処理を含む）。
 */
const formatGroupedResult = (
  index: number,
  sameIndexResults: GroupedByIndexTestResultProblem[]
): GroupedByIndexTestResult | null => {
  if (sameIndexResults.length === 0) {
    // 結果がない場合の「空の」オブジェクトを返す
    return {
      problemIndex: -1, // -1 は結果なしを示す
      category: null,
      unit: null,
      problemNumber: -1,
      groupNecessity: {
        isGroup: true,
        isUnrated: true,
        level: -1,
        reason: 'insufficientRatedAttempts',
        alternativeLevel: 0,
      } as GroupReviewNecessityResult,
      results: [],
      resultsMapByAttemptOrder: {},
    } as GroupedByIndexTestResult;
  }

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
};

// --- メイン関数 ---

/**
 * 学習サイクルのテスト結果を問題インデックスごとにグループ化し、
 * 試行順序やグループレビュー必要性の情報を付加します。
 */
export const groupingTestResultsByIndex = (
  learningCycle: ExpandedLearningCycle,
  additionalResults: ExpandedLearningCycleTestResult[][] = [],
  currentTime?: number
): GroupedByIndexTestResult[] => {
  if (!learningCycle || !learningCycle.problems || !Array.isArray(learningCycle.problems)) {
    throw new Error('Invalid learningCycle data.');
  }

  // 1. 全ての試行の順序マップを作成
  const attemptAtMap = createAttemptAtMap(learningCycle, additionalResults, currentTime);

  // 2. 結果を問題インデックスごとに統合・グループ化
  const groupedResultsMap = getGroupedResultsMap(learningCycle, additionalResults);

  // 3. 各問題インデックスの結果を拡張・ソート・整形
  const groupedByIndexResults: GroupedByIndexTestResult[] = learningCycle.problems
    .map((problem) => {
      const problems = groupedResultsMap[problem.problemIndex] || [];

      // 結果の拡張とソート
      const expandedAndSortedResults = expandAndSortProblemResults(problems, attemptAtMap);

      // 最終的な出力形式に整形
      return formatGroupedResult(problem.problemIndex, expandedAndSortedResults);
    })
    .filter(
      (result): result is GroupedByIndexTestResult => result !== null && result.problemIndex !== -1
    );

  return groupedByIndexResults;
};
