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
  'plant',
] as const;

// 1. ZodのPickオブジェクトを、Mapped TypeとUtility Typeを使って型レベルで正確に生成
//    これにより、Object.fromEntries()を避け、型が正確に推論されるようにします。
type StaticPickKeys = (typeof STATIC_KEYS)[number]; // -> 'textbookId' | 'testMode' | ...
type StaticPickObject = {
  [K in StaticPickKeys]: true;
};
// Static スキーマで必要なキーを定義
export const StaticLearningCycleDataSchema = LearningCycleSchema.pick({
  textbookId: true,
  testMode: true,
  learningDurationMs: true,
  testDurationMs: true,
  problems: true,
  isReviewTarget: true,
  textbookName: true,
  subject: true,
  cycleStartAt: true,
  units: true,
  categories: true,
  plant: true,
} as const satisfies StaticPickObject).extend({
  // satisfies を使うことで、キーがSTATIC_KEYSと一致することを保証
  id: z.string(),
  path: z.string(),
});

export type StaticLearningCycleData = z.infer<typeof StaticLearningCycleDataSchema>;
