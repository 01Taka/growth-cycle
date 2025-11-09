import { Subject } from '@/shared/types/subject-types';

export interface DynamicItem {
  id: string;
  text: string;
}

export interface CreateTextbookForm {
  subject: Subject;
  name: string;
  units: DynamicItem[];
  categories: DynamicItem[];
}
