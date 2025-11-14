import { z } from 'zod';
import { Plant } from './plant-shared-types';
import { Subject } from './subject-types';

export const SubjectSchema = z.union([
  z.literal('japanese'),
  z.literal('math'),
  z.literal('science'),
  z.literal('socialStudies'),
  z.literal('english'),
]);

export type Subject = z.infer<typeof SubjectSchema>;
export interface ReviewedCycleItemProps {
  plant: Plant;
  subject: Subject;
  textbookName: string;
}
