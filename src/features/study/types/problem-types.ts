import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';

// 問題の配列の型定義（ユーザー提供のものから抽出）
export type StudyProblem = {
  unitName: string;
  categoryName: string;
  problemNumber: number;
  problemIndex: number;
};

export type TestProblemAttemptResult = {
  unitName: string;
  categoryName: string;
  problemNumber: number;
  problemIndex: number;
  selfEvaluation: TestSelfEvaluation;
  timeSpentMs: number;
};

export type ScoringStatus = 'correct' | 'incorrect' | 'unrated';
