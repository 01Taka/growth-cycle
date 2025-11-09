import { z } from 'zod';
import { SubjectSchema } from '@/shared/types/subject-types';
import { IDBDocumentSchema } from '../../idb/idb-types';
import { CategoryDetailSchema, UnitDetailSchema } from '../learning-cycle/learning-cycle-support';

export const TextbookSchema = z.object({
  name: z.string().min(1).max(64),
  subject: SubjectSchema,
  units: z.array(UnitDetailSchema),
  categories: z.array(CategoryDetailSchema),
});

export const TextbookDocumentSchema = TextbookSchema.and(IDBDocumentSchema);

export type Textbook = z.infer<typeof TextbookSchema>;
export type TextbookDocument = z.infer<typeof TextbookDocumentSchema>;
