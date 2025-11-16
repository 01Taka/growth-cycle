import { z } from 'zod';
import { IDBDocumentSchema } from '../../idb/idb-types';
import { StaticLearningCycleDataSchema } from '../learning-cycle/learning-cycle-derived';

export const ActiveLearningCycleSchema = StaticLearningCycleDataSchema.and(
  z.object({
    attemptingProblemIndexes: z.array(z.number().int().min(0)),
    actualTestDurationMs: z.number().int().min(0),
    sessionStartedAt: z.number().int().min(0),
  })
);

export const ActiveLearningCycleDocumentSchema = ActiveLearningCycleSchema.and(IDBDocumentSchema);

export type ActiveLearningCycle = z.infer<typeof ActiveLearningCycleSchema>;
export type ActiveLearningCycleDocument = z.infer<typeof ActiveLearningCycleDocumentSchema>;
