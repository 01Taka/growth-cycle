import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { LearningCycleProblem } from '@/shared/data/documents/learning-cycle/learning-cycle-support';

export const DEFAULT_UNIT_ID = 'unitId';
export const DEFAULT_CATEGORY_ID = 'categoryId';
export const KEY_SEPARATOR = '_';

/**
 * 問題グループ化のためのキーを生成します。
 * 形式: `${cycle.textbookId}${KEY_SEPARATOR}${problem.unitId}${KEY_SEPARATOR}${problem.categoryId}${KEY_SEPARATOR}${problem.problemNumber}`
 */
export const generateProblemListKey = (cycle: LearningCycle, problem: LearningCycleProblem) => {
  return `${cycle.textbookId}${KEY_SEPARATOR}${problem.unitId ?? DEFAULT_UNIT_ID}${KEY_SEPARATOR}${problem.categoryId ?? DEFAULT_CATEGORY_ID}${KEY_SEPARATOR}${problem.problemNumber}`;
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
export const mapProblemIndexToGroupKey = (cycle: LearningCycle): Record<string, string> => {
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
