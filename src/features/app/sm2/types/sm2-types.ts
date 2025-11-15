import { LearningCycleProblem } from '@/shared/data/documents/learning-cycle/learning-cycle-support';

/**
 * SM-2アルゴリズムの状態を定義します。
 */
export type SM2State = {
  interval: number; // I: 次の復習までの間隔 (日数)
  easeFactor: number; // EF: 易しさ係数
  repetitions: number; // n: 正解の連続回数
};

/**
 * 復習スケジュール情報が付加された問題オブジェクトの型
 */
export type ScheduledProblem = LearningCycleProblem & {
  /**
   * 次の復習までの残り日数（今日が 0）。過去の場合は負の値。
   * null の場合はスケジュール未登録 (学習履歴なし)。
   */
  relativeReviewDays: number | null;
  /**
   * 直前の復習でq < 3 (忘却/リセット) だったかどうか。
   */
  wasForgotten: boolean;
};

/**
 * 復習予定日の範囲と忘却フラグの状態
 */
export type ProblemFilter = {
  /** 取得する復習予定日の最小値（日数）。例えば 0 なら今日以降。 */
  minDays?: number;
  /** 取得する復習予定日の最大値（日数）。例えば 7 なら今日から7日後まで。 */
  maxDays?: number;
  /** * 忘却フラグ (wasForgotten) の状態。
   * - true: 最後に間違えた問題のみ
   * - false: 最後に間違えなかった問題のみ
   * - undefined (または null): どちらでも
   */
  filterForgottenStatus?: boolean;
};
