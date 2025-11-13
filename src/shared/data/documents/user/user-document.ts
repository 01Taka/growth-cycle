import { z } from 'zod';
import { IDBDocumentSchema } from '../../idb/idb-types';

export const UserSchema = z.object({
  totalGainedXp: z.number(),
});

export const UserDocumentSchema = UserSchema.and(IDBDocumentSchema);

export type User = z.infer<typeof UserSchema>;
export type UserDocument = z.infer<typeof UserDocumentSchema>;
