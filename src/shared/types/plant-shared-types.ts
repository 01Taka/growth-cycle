import z from 'zod';

export const ImportPlantsTypeSchema = z.union([z.literal('adult'), z.literal('bud')]);

export type ImportPlantsType = z.infer<typeof ImportPlantsTypeSchema>;
