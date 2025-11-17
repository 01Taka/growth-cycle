import {
  StructuredId,
  StructuredIdSchema,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';

export const DEFAULT_UNIT_ID = 'unitId';
export const DEFAULT_CATEGORY_ID = 'categoryId';
export const KEY_SEPARATOR = '_';

/**
 * 問題グループ化のためのキーを生成します。
 * 形式: `${cycle.textbookId}${KEY_SEPARATOR}${problem.unitId}${KEY_SEPARATOR}${problem.categoryId}${KEY_SEPARATOR}${problem.problemNumber}`
 */
export const generateProblemStructuredId = (
  learningCycle: { textbookId: string },
  problem: {
    unitId: string | null;
    categoryId: string | null;
    problemNumber: string | number;
  }
): StructuredId => {
  const id = `${learningCycle.textbookId}${KEY_SEPARATOR}${problem.unitId ?? DEFAULT_UNIT_ID}${KEY_SEPARATOR}${problem.categoryId ?? DEFAULT_CATEGORY_ID}${KEY_SEPARATOR}${problem.problemNumber}`;
  return StructuredIdSchema.parse(id);
};

/**
 * 直接問題グループ化のためのキーを生成します。
 */
export const generateProblemStructuredIdDirect = (keys: {
  textbookId: string;
  unitId: string | null;
  categoryId: string | null;
  problemNumber: string | number;
}): StructuredId => {
  return `${keys.textbookId}${KEY_SEPARATOR}${keys.unitId ?? DEFAULT_UNIT_ID}${KEY_SEPARATOR}${keys.categoryId ?? DEFAULT_CATEGORY_ID}${KEY_SEPARATOR}${keys.problemNumber}`;
};

/**
 * 問題グループ化のためのキーから、指定した階層以降を削除して返します。
 * キーの形式: `${textbookId}_${unitId}_${categoryId}_${problemNumber}`
 *
 * @param id generateIdで生成されたキー文字列
 * @param levelsToKeep 保持したい要素の数 (例: 1 = textbookIdのみ, 2 = textbookId_unitId, 3 = textbookId_unitId_categoryId)
 * @returns 削除後のキー文字列
 */
export const truncateProblemStructuredId = (id: string, levelsToKeep: number): string => {
  // KEY_SEPARATOR でキーを分割
  StructuredIdSchema.parse(id);
  const parts = id.split(KEY_SEPARATOR);
  const truncatedParts = parts.slice(0, levelsToKeep);
  // KEY_SEPARATOR で結合
  return truncatedParts.join(KEY_SEPARATOR);
};
