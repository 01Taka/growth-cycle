import { z } from 'zod';

// ------------------------------------------------------------
// 共有型とスキーマ (study-shared-types.ts に相当)
// ------------------------------------------------------------

/**
 * テストモードの種別を定義します。
 */
export const TestModeSchema = z
  .union([z.literal('memory'), z.literal('skill')])
  .describe('i18n:test_mode.mode');

export type TestMode = z.infer<typeof TestModeSchema>;

/**
 * テスト実施後の自己評価を定義します。
 */
export const TestSelfEvaluationSchema = z
  .union([
    z.literal('notSure'),
    z.literal('imperfect'),
    z.literal('confident'),
    z.literal('unrated'),
  ])
  .describe('i18n:evaluation.self_evaluation');

export type TestSelfEvaluation = z.infer<typeof TestSelfEvaluationSchema>;

export const ProblemNumberFormatSchema = z.union([
  z.literal('number'),
  z.literal('alphabet'),
  z.literal('katakana'),
]);

export type ProblemNumberFormat = z.infer<typeof ProblemNumberFormatSchema>;

/**
 * ユニット（単元）のIDと名前を保持します。
 */
export const UnitDetailSchema = z
  .object({
    id: z.string().describe('i18n:shared.unit_id'),
    name: z.string().describe('i18n:shared.unit_name'),
  })
  .describe('i18n:shared.unit_detail');

export interface UnitDetail extends z.infer<typeof UnitDetailSchema> {}

/**
 * カテゴリのIDと名前を保持します。
 */
export const CategoryDetailSchema = z
  .object({
    id: z.string().describe('i18n:shared.category_id'),
    name: z.string().describe('i18n:shared.category_name'),
    timePerProblem: z.number(),
    problemNumberFormat: ProblemNumberFormatSchema,
  })
  .describe('i18n:shared.category_detail');

export interface CategoryDetail extends z.infer<typeof CategoryDetailSchema> {}

export const StructuredIdSchema = z.string().regex(
  // 正規表現:
  // [英数字]+_[英数字]+_[英数字]+_[0-9]+
  // - 各セグメントは1文字以上の英数字 (a-z, A-Z, 0-9) を想定
  // - 最後の problemIndex は1桁以上の数字を想定
  // - 全体は ^ (文字列の先頭) から $ (文字列の末尾) まで完全に一致する必要がある
  /^[a-zA-Z0-9]+_[a-zA-Z0-9]+_[a-zA-Z0-9]+_[0-9]+$/,
  { message: 'structuredIdの形式が不正です。形式: textId_unitId_categoryId_problemIndex' }
);

// 型の推論 (省略可能ですが便利です)
export type StructuredId = z.infer<typeof StructuredIdSchema>;

// ------------------------------------------------------------
// セッションと結果の構造
// ------------------------------------------------------------

export const ProblemScoringStatusSchema = z.union([
  z.literal('correct'),
  z.literal('incorrect'),
  z.literal('unrated'),
]);

export type ProblemScoringStatus = z.infer<typeof ProblemScoringStatusSchema>;

export const LearningCycleTestResultSchema = z
  .object({
    structuredId: StructuredIdSchema,
    problemIndex: z.number().int().min(0).describe('i18n:result.problem_index'),
    selfEvaluation: TestSelfEvaluationSchema.describe('i18n:result.self_evaluation'),
    scoringStatus: ProblemScoringStatusSchema.describe('i18n:result.is_correct'),
    timeSpentMs: z.number().int().min(0).describe('i18n:result.time_taken_ms'),
  })
  .describe('i18n:result.test_result');

export type LearningCycleTestResult = z.infer<typeof LearningCycleTestResultSchema>;

export const LearningCycleSessionSchema = z
  .object({
    gainedXp: z.number().min(0).default(0),
    isFixedReviewSession: z.boolean().default(false),
    attemptedAt: z.number().describe('i18n:session.attempted_at'),
    results: z.array(LearningCycleTestResultSchema).describe('i18n:session.results_list'),
  })
  .describe('i18n:session.test_session');

export type LearningCycleSession = z.infer<typeof LearningCycleSessionSchema>;

export const LearningCycleProblemSchema = z
  .object({
    structuredId: StructuredIdSchema,
    problemIndex: z
      .number()
      .int()
      .min(0)
      .default(Number.MAX_SAFE_INTEGER)
      .describe('i18n:problem.index'),
    unitId: z.string().min(1).nullable().describe('i18n:shared.unit_id'),
    categoryId: z.string().min(1).nullable().describe('i18n:shared.category_id'),
    problemNumber: z.number().int().min(1).describe('i18n:problem.number'),
    // 削除したフィールド
    index: z.number().optional(),
  })
  .describe('i18n:problem.detail')
  .transform((data) => {
    const problemIndexValue = data.index !== undefined ? data.index : (data as any).problemIndex;
    delete data.index;
    return {
      ...data,
      problemIndex: problemIndexValue as number,
    };
  });

export type LearningCycleProblem = z.infer<typeof LearningCycleProblemSchema>;
