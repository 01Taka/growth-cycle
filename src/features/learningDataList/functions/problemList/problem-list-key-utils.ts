import { generateProblemStructuredId } from '@/features/app/learningCycles/functions/problem-structured-id';
import {
  LearningCycle,
  LearningCycleDocument,
} from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { LearningCycleProblem } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { safeArrayToRecord, sortRecordByKeys } from '@/shared/utils/object/object-utils';
import { ProblemListItemData } from '../../types/problem-list-types';

type CycleType = Pick<LearningCycle, 'problems' | 'textbookId'>;

/**
 * LearningCycle内の問題インデックスと、問題グループ化キーの対応マップを作成します。
 * @param cycle LearningCycle単体オブジェクト
 * @returns problemIndexをキー、問題グループ化キーを値とするオブジェクト
 */
export const mapProblemIndexToGroupKey = (cycle: CycleType): Record<string, string> => {
  const problemKeyMap: Record<string, string> = {};

  cycle.problems.forEach((problem: LearningCycleProblem) => {
    // 1. problemIndexをキーとして取得
    const index = problem.problemIndex;

    // 2. 問題グループ化に使用される一意なキーを作成
    const groupKey = generateProblemStructuredId(cycle, problem);

    // 3. マップに格納
    problemKeyMap[index] = groupKey;
  });

  return problemKeyMap;
};

export const getSortedProblemKeys = (
  learningCycle: CycleType,
  option?: {
    filterProblemKeys?: string[]; // この配列に含まれるキーだけ含みます。
  }
) => {
  const keyMap = mapProblemIndexToGroupKey(learningCycle);
  const keys = sortRecordByKeys(keyMap);
  if (!!option?.filterProblemKeys) {
    return keys.filter((key) => option.filterProblemKeys?.includes(key));
  }
  return keys;
};

/**
 * LearningCycle内の問題グループ化キーと、問題インデックスの対応マップを作成します。
 * @param cycle LearningCycle単体オブジェクト
 * @returns 問題グループ化キーをキー、problemを値とするオブジェクト
 */
export const mapGroupKeyToProblem = (cycle: CycleType): Record<string, LearningCycleProblem> => {
  const groupKeyMap: Record<string, LearningCycleProblem> = {};

  cycle.problems.forEach((problem: LearningCycleProblem) => {
    // 1. 問題グループ化に使用される一意なキーを作成
    const groupKey = generateProblemStructuredId(cycle, problem);
    // 3. マップに格納 (groupKeyをキー、indexを値)
    groupKeyMap[groupKey] = problem;
  });

  return groupKeyMap;
};
/**
 * LearningCycle内の問題グループ化キーと、問題インデックスの対応マップを作成します。
 * @param cycle LearningCycle単体オブジェクト
 * @returns 問題グループ化キーをキー、problemIndexを値とするオブジェクト
 */
const mapGroupKeyToProblemIndex = (cycle: CycleType): Record<string, number> => {
  const groupKeyMap: Record<string, number> = {};

  cycle.problems.forEach((problem: LearningCycleProblem) => {
    // 1. 問題グループ化に使用される一意なキーを作成
    const groupKey = generateProblemStructuredId(cycle, problem);

    // 2. problemIndexを値として取得
    const index = problem.problemIndex;

    // 3. マップに格納 (groupKeyをキー、indexを値)
    groupKeyMap[groupKey] = index;
  });

  return groupKeyMap;
};

type ProblemMapByCycle = {
  [cycleId: string]: (ProblemListItemData | undefined)[];
};

const mapCycleIdToProblem = (
  cycles: LearningCycleDocument[],
  problems: ProblemListItemData[]
): ProblemMapByCycle => {
  const problemMap: Record<string, ProblemListItemData> = safeArrayToRecord(problems, 'key');

  const entries: [string, (ProblemListItemData | undefined)[]][] = cycles.map((cycle) => {
    // 内部の処理をより簡潔に記述
    const problemList = cycle.problems.map((problem) => {
      const key = generateProblemStructuredId(cycle, problem);
      return problemMap[key]; // undefined の可能性を許容
    });
    return [cycle.id, problemList];
  });

  return Object.fromEntries(entries);
};
