import { z } from 'zod';
import { StaticLearningCycleDataSchema } from '../learning-cycle/learning-cycle-derived';

export const ActiveLearningCycleSchema = StaticLearningCycleDataSchema.and(
  z.object({
    attemptingProblemKeys: z.array(z.string()),
    actualTestDurationMs: z.number().int().min(0),
    sessionStartedAt: z.number().int().min(0),
  })
);

export type ActiveLearningCycle = z.infer<typeof ActiveLearningCycleSchema>;
