import { z } from 'zod';
import { SubjectSchema } from '@/shared/types/subject-types';
import { IDBDocumentSchema } from '../../idb/idb-types';
import { CategoryDetailSchema, UnitDetailSchema } from '../learning-cycle/learning-cycle-support';

export const TextbookPlantSchema = z.object({
  plantIndex: z.number().int().min(0),
  positionX: z.number().min(0).max(1),
  size: z.number(),
});

export const TextbookSchema = z.object({
  name: z.string().min(1).max(64),
  subject: SubjectSchema,
  units: z.array(UnitDetailSchema),
  categories: z.array(CategoryDetailSchema),
  totalPlants: z.number().int().min(0),
  lastAttemptedAt: z.number().int().nullable(),
  plants: z.array(TextbookPlantSchema),
});

export const TextbookDocumentSchema = TextbookSchema.and(IDBDocumentSchema);

export type Textbook = z.infer<typeof TextbookSchema>;
export type TextbookDocument = z.infer<typeof TextbookDocumentSchema>;
