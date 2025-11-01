import z from 'zod';

export const SubjectSchema = z.union([
  z.literal('japanese'),
  z.literal('math'),
  z.literal('science'),
  z.literal('socialStudies'),
  z.literal('english'),
]);

export type Subject = z.infer<typeof SubjectSchema>;
