import z from 'zod';
import { SubjectSchema } from '@/shared/types/subject-types';
import { CategoryDetailSchema, UnitDetailSchema } from '../learning-cycle/learning-cycle-support';

export const TextbookSchema = z.object({
  name: z.string().min(1).max(64),
  subject: SubjectSchema,
  units: z.array(UnitDetailSchema),
  categories: z.array(CategoryDetailSchema),
});

export type Textbook = z.infer<typeof TextbookSchema>;
