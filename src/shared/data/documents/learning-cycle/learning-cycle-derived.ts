import { z } from 'zod';
import { PlantShapeSchema } from '@/shared/types/plant-shared-types';
import { LearningCycleSchema } from './learning-cycle-document';

export const LearningCycleClientDataSchema = LearningCycleSchema.pick({
  textbookId: true,
  testMode: true,
  learningDurationMs: true,
  testDurationMs: true,
  isReviewTarget: true,
}).describe('i18n:cycle.client_input');

export type LearningCycleClientData = z.infer<typeof LearningCycleClientDataSchema>;

export const LearningCycleToUpdateSchema = LearningCycleSchema.pick({
  sessions: true,
  nextReviewDate: true,
  latestAttemptedAt: true,
  isReviewTarget: true,
})
  .partial()
  .describe('i18n:cycle.partial_update');

export type LearningCycleToUpdate = z.infer<typeof LearningCycleToUpdateSchema>;

// Static スキーマで必要なキーを定義
const STATIC_KEYS = [
  'textbookId',
  'testMode',
  'learningDurationMs',
  'testDurationMs',
  'problems',
  'isReviewTarget',
  'textbookName',
  'subject',
  'cycleStartAt',
  'units',
  'categories',
] as const;

export const StaticLearningCycleDataSchema = LearningCycleSchema.pick({
  ...Object.fromEntries(STATIC_KEYS.map((key) => [key, true])),
} as const).extend({
  id: z.string(),
  path: z.string(),
  plant: PlantShapeSchema,
});

export type StaticLearningCycleData = z.infer<typeof StaticLearningCycleDataSchema>;
