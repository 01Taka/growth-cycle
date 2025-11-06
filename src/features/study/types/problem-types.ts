import { Timestamp } from 'firebase/firestore';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';

// 学習問題の識別情報（問題の特定に使うキー）
export interface LearningProblemKey {
  unitName: string;
  categoryName: string;
  problemNumber: number;
  problemIndex: number;
}

// 問題に対する一回の試行の詳細情報（自己評価と所要時間を含む）
export interface ProblemAttemptDetail extends LearningProblemKey {
  selfEvaluation: TestSelfEvaluation;
  timeSpentMs: number;
}

// 問題の採点状態
export type ProblemScoringStatus = 'correct' | 'incorrect' | 'unrated';

// 問題に対する最終的な試行結果（採点情報を含む）
export interface ProblemAttemptResult extends ProblemAttemptDetail {
  scoringStatus: ProblemScoringStatus;
}

// 特定の問題への一回の試行ログ（履歴）
export interface AttemptLog {
  attemptAt: Timestamp;
  selfEvaluation: TestSelfEvaluation;
  timeSpentMs: number;
  scoringStatus: ProblemScoringStatus;
}

export interface EmptyAttemptLog {
  attemptAt: null;
  selfEvaluation: 'empty';
  timeSpentMs: null;
  scoringStatus: 'empty';
}

// 特定の問題に対する学習の記録全体（識別情報と試行履歴のリストを含む）
export interface ProblemLearningRecord extends LearningProblemKey {
  attempts: AttemptLog[];
}
