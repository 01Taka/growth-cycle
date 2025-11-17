import {
  LearningCycle,
  LearningCycleDocument,
} from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { LearningCycleProblem } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { safeArrayToRecord, sortRecordByKeys } from '@/shared/utils/object/object-utils';
import { ProblemListItemData } from '../../types/problem-list-types';

export const DEFAULT_UNIT_ID = 'unitId';
export const DEFAULT_CATEGORY_ID = 'categoryId';
export const KEY_SEPARATOR = '_';

type CycleType = Pick<LearningCycle, 'problems' | 'textbookId'>;

/**
 * 問題グループ化のためのキーを生成します。
 * 形式: `${cycle.textbookId}${KEY_SEPARATOR}${problem.unitId}${KEY_SEPARATOR}${problem.categoryId}${KEY_SEPARATOR}${problem.problemNumber}`
 */
export const generateProblemListKey = (cycle: CycleType, problem: LearningCycleProblem) => {
  return `${cycle.textbookId}${KEY_SEPARATOR}${problem.unitId ?? DEFAULT_UNIT_ID}${KEY_SEPARATOR}${problem.categoryId ?? DEFAULT_CATEGORY_ID}${KEY_SEPARATOR}${problem.problemNumber}`;
};

/**
 * 直接問題グループ化のためのキーを生成します。
 */
export const generateProblemListKeyDirect = (keys: {
  textbookId: string;
  unitId: string;
  categoryId: string;
  problemNumber: string | number;
}) => {
  return `${keys.textbookId}${KEY_SEPARATOR}${keys.unitId ?? DEFAULT_UNIT_ID}${KEY_SEPARATOR}${keys.categoryId ?? DEFAULT_CATEGORY_ID}${KEY_SEPARATOR}${keys.problemNumber}`;
};

/**
 * 問題グループ化のためのキーから、指定した階層以降を削除して返します。
 * キーの形式: `${textbookId}_${unitId}_${categoryId}_${problemNumber}`
 *
 * @param key generateKeyで生成されたキー文字列
 * @param levelsToKeep 保持したい要素の数 (例: 1 = textbookIdのみ, 2 = textbookId_unitId, 3 = textbookId_unitId_categoryId)
 * @returns 削除後のキー文字列
 */
export const truncateProblemListKey = (key: string, levelsToKeep: number): string => {
  // KEY_SEPARATOR でキーを分割
  const parts = key.split(KEY_SEPARATOR);
  const truncatedParts = parts.slice(0, levelsToKeep);
  // KEY_SEPARATOR で結合
  return truncatedParts.join(KEY_SEPARATOR);
};

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
    const groupKey = generateProblemListKey(cycle, problem);

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
    const groupKey = generateProblemListKey(cycle, problem);
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
    const groupKey = generateProblemListKey(cycle, problem);

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
      const key = generateProblemListKey(cycle, problem);
      return problemMap[key]; // undefined の可能性を許容
    });
    return [cycle.id, problemList];
  });

  return Object.fromEntries(entries);
};
