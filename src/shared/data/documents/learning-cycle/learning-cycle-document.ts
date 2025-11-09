import { Timestamp } from 'firebase/firestore';
import z from 'zod';
import { SubjectSchema } from '@/shared/types/subject-types';
import {
  CategoryDetailSchema,
  ProblemDetailSchema,
  TestModeSchema,
  TestSessionSchema,
  UnitDetailSchema,
} from './learning-cycle-support';

export const firestoreTimestampSchema = z.instanceof(Timestamp);

export const LearningCycleSchema = z
  .object({
    // --- クライアントからの入力データ ---
    textbookId: z.string().min(1).describe('i18n:cycle.textbook_id'),
    testMode: TestModeSchema.describe('i18n:test_mode.mode'),
    learningDurationMs: z.number().int().min(0).describe('i18n:cycle.learning_duration_ms'),
    testDurationMs: z.number().int().min(0).describe('i18n:cycle.test_duration_ms'),
    problems: z.array(ProblemDetailSchema).min(1).describe('i18n:cycle.problems'),
    isReviewTarget: z.boolean().describe('i18n:cycle.is_review_target'),

    // --- サーバーが初期設定/管理するデータ ---
    textbookName: z.string().min(1).describe('i18n:cycle.textbook_name'),
    subject: SubjectSchema.describe('i18n:cycle.subject'),
    cycleStartAt: firestoreTimestampSchema.describe('i18n:cycle.cycle_start_at'),
    units: z.array(UnitDetailSchema).min(1).describe('i18n:cycle.units'),
    categories: z.array(CategoryDetailSchema).min(1).describe('i18n:cycle.categories'),

    // --- 使用するごとに更新されるデータ ---
    sessions: z.array(TestSessionSchema).describe('i18n:cycle.sessions'),
    nextReviewAt: firestoreTimestampSchema.describe('i18n:cycle.next_review_at'),
    latestAttemptedAt: firestoreTimestampSchema.describe('i18n:cycle.latest_attempted_at'),
  })
  .describe('i18n:cycle.full_document_schema');

export type LearningCycle = z.infer<typeof LearningCycleSchema>;
