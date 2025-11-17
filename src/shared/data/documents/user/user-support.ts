import { z } from 'zod';
import { StaticLearningCycleDataSchema } from '../learning-cycle/learning-cycle-derived';
import { StructuredIdSchema } from '../learning-cycle/learning-cycle-support';

export const ActiveLearningCycleSchema = StaticLearningCycleDataSchema.and(
  z.object({
    attemptingProblemStructuredIds: z.array(StructuredIdSchema),
    actualTestDurationMs: z.number().min(0),
    sessionStartedAt: z.number().int().min(0),
  })
);

export type ActiveLearningCycle = z.infer<typeof ActiveLearningCycleSchema>;
