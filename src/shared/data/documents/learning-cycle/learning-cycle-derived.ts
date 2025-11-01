import z from 'zod';
import { LearningCycleSchema } from './learning-cycle-document';

export const LearningCycleClientDataSchema = LearningCycleSchema.pick({
  textbookId: true,
  testMode: true,
  learningDurationMs: true,
  testDurationMs: true,
  problems: true,
}).describe('i18n:cycle.client_input');

export type LearningCycleClientData = z.infer<typeof LearningCycleClientDataSchema>;

export const LearningCycleToUpdateSchema = LearningCycleSchema.pick({
  sessions: true,
  nextReviewAt: true,
  latestAttemptedAt: true,
  isReviewTarget: true,
})
  .partial()
  .describe('i18n:cycle.partial_update');

export type LearningCycleToUpdate = z.infer<typeof LearningCycleToUpdateSchema>;
