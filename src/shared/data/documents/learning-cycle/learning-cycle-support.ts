import { z } from 'zod';
import { SubjectSchema } from '@/shared/types/subject-types';

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

// ------------------------------------------------------------
// セッションと結果の構造
// ------------------------------------------------------------

export const ProblemScoringStatusSchema = z.union([
  z.literal('correct'),
  z.literal('incorrect'),
  z.literal('unrated'),
]);

export type ProblemScoringStatus = z.infer<typeof ProblemScoringStatusSchema>;

export const TestResultSchema = z
  .object({
    problemIndex: z.number().int().min(0).describe('i18n:result.problem_index'),
    selfEvaluation: TestSelfEvaluationSchema.describe('i18n:result.self_evaluation'),
    scoringStatus: ProblemScoringStatusSchema.describe('i18n:result.is_correct'),
    timeTakenMs: z.number().int().min(0).describe('i18n:result.time_taken_ms'),
  })
  .describe('i18n:result.test_result');

export type TestResult = z.infer<typeof TestResultSchema>;

export const TestSessionSchema = z
  .object({
    attemptedAt: z.number().describe('i18n:session.attempted_at'),
    results: z.array(TestResultSchema).describe('i18n:session.results_list'),
  })
  .describe('i18n:session.test_session');

export type TestSession = z.infer<typeof TestSessionSchema>;

export const ProblemDetailSchema = z
  .object({
    index: z.number().int().min(0).describe('i18n:problem.index'),
    unitId: z.string().min(1).describe('i18n:shared.unit_id'),
    categoryId: z.string().min(1).describe('i18n:shared.category_id'),
    problemNumber: z.number().int().min(1).describe('i18n:problem.number'),
  })
  .describe('i18n:problem.detail');

export type ProblemDetail = z.infer<typeof ProblemDetailSchema>;
