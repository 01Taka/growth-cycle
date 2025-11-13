import { z } from 'zod';
import { PlantSchema } from '@/shared/types/plant-shared-types';
import { SubjectSchema } from '@/shared/types/subject-types';
import { IDBDocumentSchema } from '../../idb/idb-types';
import {
  CategoryDetailSchema,
  LearningCycleSessionSchema,
  ProblemDetailSchema,
  TestModeSchema,
  UnitDetailSchema,
} from './learning-cycle-support';

// 現在のタイムスタンプを生成するヘルパー関数
const nowTimestamp = () => Date.now();
// Dateオブジェクトをタイムスタンプに変換する変換処理を持つスキーマ
const TimestampSchema = z.coerce.date().transform((date) => date.getTime());

export const LearningCycleSchema = z
  .object({
    // --- クライアントからの入力データ (通常、入力必須なのでdefaultは設定しない) ---
    textbookId: z.string().min(1).describe('i18n:cycle.textbook_id'),
    testMode: TestModeSchema.describe('i18n:test_mode.mode'),
    learningDurationMs: z.number().int().min(0).describe('i18n:cycle.learning_duration_ms'),
    testDurationMs: z.number().int().min(0).describe('i18n:cycle.test_duration_ms'),
    problems: z.array(ProblemDetailSchema).min(1).describe('i18n:cycle.problems'),
    isReviewTarget: z.boolean().describe('i18n:cycle.is_review_target'),

    // --- サーバーが初期設定/管理するデータ ---
    textbookName: z.string().min(1).default('').describe('i18n:cycle.textbook_name'),
    subject: SubjectSchema.describe('i18n:cycle.subject'),
    cycleStartAt: TimestampSchema.default(nowTimestamp).describe('i18n:cycle.cycle_start_at'),
    units: z.array(UnitDetailSchema).default([]).describe('i18n:cycle.units'),
    categories: z.array(CategoryDetailSchema).default([]).describe('i18n:cycle.categories'),

    // --- 使用するごとに更新されるデータ ---
    sessions: z.array(LearningCycleSessionSchema).default([]).describe('i18n:cycle.sessions'),
    fixedReviewDates: z.array(z.iso.date()).default([]),
    latestAttemptedAt: TimestampSchema.default(nowTimestamp).describe(
      'i18n:cycle.latest_attempted_at'
    ),
    plant: PlantSchema,

    // 不要データ (optionalかつnullableなのでdefaultは必須ではないが、明示的にnullをデフォルトとする)
    nextReviewDate: z.iso.date().nullable().optional().describe('i18n:cycle.next_review_at'),
  })
  .describe('i18n:cycle.full_document_schema');

export const LearningCycleDocumentSchema = LearningCycleSchema.and(IDBDocumentSchema);

export type LearningCycle = z.infer<typeof LearningCycleSchema>;
export type LearningCycleDocument = z.infer<typeof LearningCycleDocumentSchema>;
