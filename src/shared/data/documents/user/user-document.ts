import { z } from 'zod';
import { IDBDocumentSchema } from '../../idb/idb-types';
import { ActiveLearningCycleDocumentSchema } from './user-support';

export const UserSchema = z.object({
  totalGainedXp: z.number(),
  currentActiveLearningCycle: ActiveLearningCycleDocumentSchema.nullable().default(null),
});

export const UserDocumentSchema = UserSchema.and(IDBDocumentSchema);

export type User = z.infer<typeof UserSchema>;
export type UserDocument = z.infer<typeof UserDocumentSchema>;
