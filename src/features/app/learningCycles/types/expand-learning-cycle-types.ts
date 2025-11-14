import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  CategoryDetail,
  LearningCycleProblem,
  LearningCycleSession,
  LearningCycleTestResult,
  UnitDetail,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import {
  GroupReviewNecessityResult,
  ReviewNecessityResult,
  ReviewNecessityResultWithGroup,
} from '../../review-necessity/types/review-necessity-types';

/**
 * 学習サイクル内の問題データに 'unitName' と 'categoryName' を追加した拡張型。
 */
export interface ExpandedLearningCycleProblem extends LearningCycleProblem {
  /** 問題が属するユニットの名前 (unitMapから取得) */
  unit: UnitDetail | null;
  /** 問題が属するカテゴリーの名前 (categoryMapから取得) */
  category: CategoryDetail | null;
  unitName: string;
  categoryName: string;
  latestAttemptedAt: number;
}

export interface ExpandedLearningCycleTestResult extends LearningCycleTestResult {
  /** 対応する問題のユニットID */
  unitId: string | null;
  /** 対応する問題のカテゴリーID */
  categoryId: string | null;
  /** 対応する問題の番号 */
  problemNumber: number;
  unitName: string;
  categoryName: string;
  /** 対応する問題のユニットの名前 (unitMapから取得) */
  unit: UnitDetail | null;
  /** 対応する問題のカテゴリーの名前 (categoryMapから取得) */
  category: CategoryDetail | null;
  attemptAt: number;
  necessity: ReviewNecessityResult;
}

/**
 * 学習サイクル内のセッションデータに拡張された結果リストと結果マップを追加した拡張型。
 */
export interface ExpandedLearningCycleSession extends LearningCycleSession {
  /** 拡張されたテスト結果のリスト */
  results: ExpandedLearningCycleTestResult[];
  /** 'problemIndex' をキーとする拡張されたテスト結果のレコード */
  resultsMap: Record<string, ExpandedLearningCycleTestResult>;
}

/**
 * 学習サイクル全体に拡張プロパティ（拡張された問題、セッション、各種マップ）を追加したメインの拡張型。
 */
export interface ExpandedLearningCycle extends LearningCycle {
  /** 拡張された問題データのリスト */
  problems: ExpandedLearningCycleProblem[];
  /** 拡張されたセッションデータのリスト */
  sessions: ExpandedLearningCycleSession[];
  /** 'index' をキーとする元の問題データのレコード */
  problemMap: Record<string, LearningCycleProblem>;
  /** 'id' をキーとするユニット詳細データのレコード */
  unitMap: Record<string, UnitDetail>;
  /** 'id' をキーとするカテゴリー詳細データのレコード */
  categoryMap: Record<string, CategoryDetail>;
  unitNames: string[];
  categoryNames: string[];
}

export type GroupedByIndexTestResultProblem = ExpandedLearningCycleTestResult & {
  attemptAtOrder: number;
  groupNecessity: GroupReviewNecessityResult;
  higherLevelNecessity: ReviewNecessityResultWithGroup;
};

export interface GroupedByIndexTestResult {
  problemIndex: number;
  category: CategoryDetail | null;
  unit: UnitDetail | null;
  problemNumber: number;
  groupNecessity: GroupReviewNecessityResult;
  results: GroupedByIndexTestResultProblem[];
  resultsMapByAttemptOrder: Record<string, GroupedByIndexTestResultProblem>;
}
