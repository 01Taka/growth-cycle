import {
  ProblemScoringStatus,
  TestSelfEvaluation,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';

export interface LearningProblemKey {
  unitName: string;
  categoryName: string;
  problemNumber: number;
  problemIndex: number;
}

// 学習問題の識別情報（問題の特定に使うキー）
export interface LearningProblemBase extends LearningProblemKey {
  attemptAt: number;
}

// 問題に対する一回の試行の詳細情報（自己評価と所要時間を含む）
export interface ProblemAttemptDetail extends LearningProblemBase {
  selfEvaluation: TestSelfEvaluation;
  timeSpentMs: number;
}

// 問題の採点状態

// 問題に対する最終的な試行結果（採点情報を含む）
export type ProblemAttemptResult = ProblemAttemptDetail & { scoringStatus: ProblemScoringStatus };

// 特定の問題への一回の試行ログ（履歴）
export interface AttemptLog {
  attemptAt: number;
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

// カラーセットの型定義
export interface NecessityColorSet {
  background: string;
  text: string;
  border: string;
  accent: string;
  reverseText: string;
  label: string;
}

/**
 * 確認必要度の理由（ロジック2：直近2回の試行による重み付け）
 */
export type RecentWeightedNecessityReason =
  | 'consecutiveMistake' // 3: 直近2回とも高必要性（2以上）
  | 'latestHighNecessity' // 2: 最新の試行のみ高必要性（2以上）
  | 'previousHighNecessity' // 1: 2番目の試行のみ高必要性（2以上）
  | 'none'; // 0: どちらも低必要性（1以下）またはデータなし

/**
 * 確認必要度の理由（ロジック1：最新の試行による算出）
 */
export type LatestAttemptNecessityReason =
  | 'overconfidenceError' // 3: 間違い + 確信あり
  | 'definiteMistake' // 2: 間違い + 確信なし/未評価
  | 'uncertainCorrect' // 2: 正解 + 不安
  | 'imperfectCorrect' // 1: 正解 + 不完全
  | 'understood' // 0: 正解 + 確信あり/未評価 または未評価
  | 'noAttempt'; // 0: 試行ログなし

/**
 * ロジック1の算出結果オブジェクト
 */
export type LatestAttemptNecessityResult = {
  level: number; // 0-3
  reason: LatestAttemptNecessityReason;
};

/**
 * ロジック2の算出結果オブジェクト
 */
export type RecentWeightedNecessityResult = {
  level: number; // 0-3
  reason: RecentWeightedNecessityReason;
};

/**
 * 最終的な確認必要度を決定する関数の返却オブジェクト
 */
export type FinalReviewNecessityResult = {
  reviewNecessity: number; // 0-3 (最終結果)
  latestAttemptNecessity: LatestAttemptNecessityResult;
  recentWeightedNecessity: RecentWeightedNecessityResult;
};

export interface ReviewNecessityResult {
  reviewNecessity: { level: number; theme: NecessityColorSet; label: string };
  latestAttemptNecessity: LatestAttemptNecessityResult & {
    theme: NecessityColorSet;
    reasonLabel: string;
    label: string;
  };
  recentWeightedNecessity: RecentWeightedNecessityResult & {
    theme: NecessityColorSet;
    reasonLabel: string;
    label: string;
  };
  getNecessityColor: (attempt: AttemptLog | null) => NecessityColorSet;
}
