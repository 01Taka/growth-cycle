import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';

// 問題の配列の型定義（ユーザー提供のものから抽出）
export type StudyProblem = {
  unitName: string;
  categoryName: string;
  problemNumber: number;
  problemIndex: number;
  selfEvaluation: TestSelfEvaluation;
  timeMs: number | null;
};
