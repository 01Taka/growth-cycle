import {
  CategoryDetail,
  UnitDetail,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';

export interface ProblemListItemData {
  key: string;
  textbookId: string;
  textbookName: string;
  problemIndexInTextbook: number;
  unitId: string;
  unit: UnitDetail;
  unitName: string;
  categoryId: string;
  category: CategoryDetail;
  categoryName: string;
  problemNumber: number;
  correctnessRate: number;
  nextAttemptTimestamp: number;
  differenceFromNextAttempt: number;
  lastAttemptSM2Quality: number;
}
