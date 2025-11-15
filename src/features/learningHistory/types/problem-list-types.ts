export interface ProblemListItemData {
  id: string;
  problemIndex: number;
  textbookName: string;
  unitName: string;
  categoryName: string;
  problemNumber: number;
  dueDateText: string;
  correctnessRate: number; // 0.0 ~ 1.0
  isUrgent: boolean;
}
