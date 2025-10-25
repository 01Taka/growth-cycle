import { z } from 'zod';

/**
 * テストモードの種別を定義します。
 * 'memory' は勉強した範囲の記憶力（定着度）を測るテストです。
 * 'skill' は範囲外の応用力や知識活用能力（実力）を測るテストです。
 */
export const TestModeSchema = z.union([z.literal('memory'), z.literal('skill')]);

export type TestMode = z.infer<typeof TestModeSchema>;

// --------------------------------------------------

/**
 * テスト実施後の自己評価を定義します。
 */
export const TestSelfEvaluationSchema = z.union([
  z.literal('notSure'),
  z.literal('imperfect'),
  z.literal('confident'),
  z.literal('unrated'),
]);

export type TestSelfEvaluation = z.infer<typeof TestSelfEvaluationSchema>;

// --------------------------------------------------

export const SubjectSchema = z.union([
  z.literal('japanese'),
  z.literal('math'),
  z.literal('science'),
  z.literal('socialStudies'),
  z.literal('english'),
]);

export type Subject = z.infer<typeof SubjectSchema>;

// --------------------------------------------------

/**
 * ユニット（単元）のIDと名前を保持します。冗長性を保つためにStudySettingsに埋め込まれます。
 */
export const UnitDetailSchema = z.object({
  /** ユニットのID */
  id: z.string(),
  /** ユニットの名前 */
  name: z.string(),
});

export interface UnitDetail extends z.infer<typeof UnitDetailSchema> {}

// --------------------------------------------------

/**
 * カテゴリのIDと名前を保持します。冗長性を保つためにStudySettingsに埋め込まれます。
 */
export const CategoryDetailSchema = z.object({
  /** カテゴリのID */
  id: z.string(),
  /** カテゴリの名前 */
  name: z.string(),
});

export interface CategoryDetail extends z.infer<typeof CategoryDetailSchema> {}
