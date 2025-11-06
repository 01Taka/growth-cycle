import { AttemptLog, ProblemLearningRecord } from '../types/problem-types';

// 型定義の補足 (仮定)
// type ScoringStatus = 'correct' | 'incorrect' | 'unrated';
// type SelfEvaluation = 'confident' | 'imperfect' | 'notSure' | 'unrated';

/**
 * 💡 ロジック 1: 直近の一つの自己評価と正誤による確認必要度 (0-3) を算出
 * @param {AttemptLog | null} latestAttempt 最新の試行ログ
 * @param {number} defaultNecessity ログがない場合のデフォルト値
 * @returns {number} 算出された確認必要度 (0から3の整数)
 */
export function calculateReviewNecessityFromLatestAttempt(
  latestAttempt: AttemptLog | null,
  defaultNecessity: number = 0
): number {
  if (!latestAttempt) {
    return defaultNecessity;
  }

  const { selfEvaluation, scoringStatus } = latestAttempt;
  let necessity = 0; // 初期値は0

  if (scoringStatus === 'correct') {
    // ✅ 正解のとき:
    switch (selfEvaluation) {
      case 'unrated':
      case 'confident':
        necessity = 0; // 確信あり/未評価なら不要
        break;
      case 'imperfect':
        necessity = 1; // 不完全なら少し必要
        break;
      case 'notSure':
        necessity = 2; // 不安なら復習推奨
        break;
    }
  } else if (scoringStatus === 'incorrect') {
    // ❌ 間違いのとき:
    // 確信があれば3 (なぜ間違えたかの確認推奨), それ以外は2
    necessity = selfEvaluation === 'confident' ? 3 : 2;
  }

  // scoringStatusが 'unrated' の場合は、初期値 0 のまま

  return necessity;
}

// ----------------------------------------------------------------------
/**
 * 💡 ロジック 2 (改善版): 直近2回の試行における「自己評価に基づく確認必要度」が
 * 「2以上（復習必要性が高い）」であったかどうかに重みを付けて算出 (最大 3)
 *
 * @param {AttemptLog | null} latestAttempt 最新の試行
 * @param {AttemptLog | null} secondLatestAttempt 2番目に新しい試行
 * @param {object} options オプション
 * @returns {number} 算出された重み付きの確認必要度 (0から3の整数)
 */
function calculateWeightedReviewNecessity( // 関数名を変更
  latestAttempt: AttemptLog | null,
  secondLatestAttempt: AttemptLog | null,
  options?: {
    defaultNecessity?: number;
    latestAttemptWeight?: number;
    secondAttemptWeight?: number;
  }
): number {
  const opt = {
    // デフォルト値
    defaultNecessity: 0,
    latestAttemptWeight: 2, // 従来の firstNecessityWeight
    secondAttemptWeight: 1, // 従来の secondNecessityWeight
    ...(options || {}),
  };

  // 判定基準: ロジック1の結果が 2以上（復習必要性が高い）であったかどうか
  const HIGH_NECESSITY_THRESHOLD = 2;

  // 1. 最新の試行: 必要度が2以上なら重み latestAttemptWeight (2) を加算
  const isLatestHighNecessity = latestAttempt
    ? calculateReviewNecessityFromLatestAttempt(latestAttempt) >= HIGH_NECESSITY_THRESHOLD
    : false;
  const latestNecessityScore = isLatestHighNecessity
    ? opt.latestAttemptWeight
    : opt.defaultNecessity;

  // 2. 2番目の試行: 必要度が2以上なら重み secondAttemptWeight (1) を加算
  const isSecondHighNecessity = secondLatestAttempt
    ? calculateReviewNecessityFromLatestAttempt(secondLatestAttempt) >= HIGH_NECESSITY_THRESHOLD
    : false;
  const secondNecessityScore = isSecondHighNecessity
    ? opt.secondAttemptWeight
    : opt.defaultNecessity;

  // 合計値は最大 3 (2 + 1)
  const totalNecessity = latestNecessityScore + secondNecessityScore;
  return totalNecessity;
}
// ----------------------------------------------------------------------

/**
 * 🎯 メイン関数: 2つのロジックで算出された値のうち、大きい方を使用して最終的な確認必要度を決定
 * @param {AttemptLog[]} attempts 試行履歴のリスト (末尾が最新)
 * @returns {{ reviewNecessity: number; ... }} 最終的な確認必要度を含むオブジェクト
 */
export function determineFinalReviewNecessity(attempts: (AttemptLog | null)[]): {
  // 関数名を変更
  reviewNecessity: number;
  latestAttemptNecessity: number;
  recentWeightedNecessity: number;
} {
  // 最新の試行を取得 (配列の末尾が最新)
  const latestAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null;

  // 直近二つ目の試行 (2番目に新しい試行)
  const secondLatestAttempt = attempts.length > 1 ? attempts[attempts.length - 2] : null;

  // --- 1. ロジック1で算出 ---
  // 直近の一つの自己評価と正誤による算出 (最大3)
  const latestAttemptNecessity = latestAttempt
    ? calculateReviewNecessityFromLatestAttempt(latestAttempt)
    : 0;

  // --- 2. ロジック2で算出 ---
  // 直近の二つの自己評価と正誤による重み付き算出 (最大3)
  const recentWeightedNecessity = calculateWeightedReviewNecessity(
    latestAttempt,
    secondLatestAttempt
  );

  // より値が大きい方を使用して最終的な確認必要度を決定
  const reviewNecessity = Math.max(latestAttemptNecessity, recentWeightedNecessity);

  // 結果を返す (0-3の範囲であることを保証)
  return {
    reviewNecessity: Math.min(reviewNecessity, 3),
    latestAttemptNecessity,
    recentWeightedNecessity,
  };
}

type RecentWeightedNecessityReason =
  | 'consecutiveMistake' //
  | 'mistake' //
  | 'previousMiss'; //

type LatestAttemptNecessityReason =
  | 'overconfidenceError'
  | 'mistake'
  | 'luckyGuess'
  | 'uncertainCorrect';

type NecessityReasonLabel = RecentWeightedNecessityReason | LatestAttemptNecessityReason;

interface NecessityReason {
  source: 'latestAttempt' | 'recentWeighted';
  reason: NecessityReasonLabel | null;
  level: number;
}
