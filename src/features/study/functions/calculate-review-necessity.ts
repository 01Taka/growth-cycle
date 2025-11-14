// import { calculateReviewNecessity } from '@/features/app/review-necessity/functions/calc-necessity';
// import { LearningCycleTestResult } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
// import {
//   FinalReviewNecessityResult,
//   LatestAttemptNecessityResult,
//   RecentWeightedNecessityReason,
//   RecentWeightedNecessityResult,
// } from '../types/problem-types';

// /**
//  * 💡 ロジック 1: 直近の一つの自己評価と正誤による確認必要度 (0-3) を算出
//  * @param {LearningCycleTestResult | null} latestAttempt 最新の試行ログ
//  * @param {number} defaultNecessity ログがない場合のデフォルト値 (未使用だが引数としては残す)
//  * @returns {LatestAttemptNecessityResult} 算出された確認必要度と理由
//  */
// export function calculateReviewNecessityFromLatestAttempt(
//   latestAttempt: LearningCycleTestResult | null
// ): LatestAttemptNecessityResult {
//   if (!latestAttempt) {
//     // 試行ログがない場合
//     return { level: 0, reason: 'noAttempt' };
//   }

//   const { selfEvaluation, scoringStatus } = latestAttempt;
//   const { level, reason, alternativeLevel } = calculateReviewNecessity(
//     selfEvaluation,
//     scoringStatus
//   );

//   if (level === -1) {
//     return {
//       level: alternativeLevel,
//       reason: 'noAttempt',
//     };
//   }

//   if (reason === 'mistakeImperfect' || reason === 'mistakeNotSure') {
//     return { level, reason: 'definiteMistake' };
//   }

//   return { level, reason: reason };
// }

// /**
//  * 💡 ロジック 2 (改善版): 直近2回の試行における「自己評価に基づく確認必要度」が
//  * 「2以上（復習必要性が高い）」であったかどうかに重みを付けて算出 (最大 3)
//  *
//  * @param {LearningCycleTestResult | null} latestAttempt 最新の試行
//  * @param {LearningCycleTestResult | null} secondLatestAttempt 2番目に新しい試行
//  * @param {object} options オプション
//  * @returns {RecentWeightedNecessityResult} 算出された重み付きの確認必要度と理由
//  */
// function calculateWeightedReviewNecessity(
//   latestAttempt: LearningCycleTestResult | null,
//   secondLatestAttempt: LearningCycleTestResult | null,
//   options?: {
//     defaultNecessity?: number;
//     latestAttemptWeight?: number;
//     secondAttemptWeight?: number;
//   }
// ): RecentWeightedNecessityResult {
//   const opt = {
//     // デフォルト値
//     defaultNecessity: 0,
//     latestAttemptWeight: 2,
//     secondAttemptWeight: 1,
//     ...(options || {}),
//   };

//   // 判定基準: ロジック1の結果が 2以上（復習必要性が高い）であったかどうか
//   const HIGH_NECESSITY_THRESHOLD = 2;

//   // 1. 最新の試行の確認必要度を算出
//   const latestResult = calculateReviewNecessityFromLatestAttempt(latestAttempt);
//   const isLatestHighNecessity = latestResult.level >= HIGH_NECESSITY_THRESHOLD;

//   // 2. 2番目の試行の確認必要度を算出
//   const secondResult = calculateReviewNecessityFromLatestAttempt(secondLatestAttempt);
//   const isSecondHighNecessity = secondResult.level >= HIGH_NECESSITY_THRESHOLD;

//   // スコア計算
//   const latestNecessityScore = isLatestHighNecessity
//     ? opt.latestAttemptWeight
//     : opt.defaultNecessity;
//   const secondNecessityScore = isSecondHighNecessity
//     ? opt.secondAttemptWeight
//     : opt.defaultNecessity;

//   // 合計値は最大 3 (2 + 1)
//   const level = latestNecessityScore + secondNecessityScore;

//   // 理由の決定
//   let reason: RecentWeightedNecessityReason;
//   if (isLatestHighNecessity && isSecondHighNecessity) {
//     reason = 'consecutiveMistake'; // 3: 連続で復習必要性が高い
//   } else if (isLatestHighNecessity) {
//     reason = 'latestHighNecessity'; // 2: 最新の試行で復習必要性が高い
//   } else if (isSecondHighNecessity) {
//     reason = 'previousHighNecessity'; // 1: 2番目の試行で復習必要性が高い
//   } else {
//     reason = 'none'; // 0: どちらも復習必要性が高くない、または試行なし
//   }

//   return { level, reason };
// }

// /**
//  * 🎯 メイン関数: 2つのロジックで算出された値のうち、大きい方を使用して最終的な確認必要度を決定
//  * @param {LearningCycleTestResult[]} attempts 試行履歴のリスト (末尾が最新)
//  * @returns {FinalReviewNecessityResult} 最終的な確認必要度を含むオブジェクト
//  */
// export function determineFinalReviewNecessity(
//   attempts: (LearningCycleTestResult | null)[]
// ): FinalReviewNecessityResult {
//   // 最新の試行を取得 (配列の末尾が最新)
//   const latestAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null;

//   // 直近二つ目の試行 (2番目に新しい試行)
//   const secondLatestAttempt = attempts.length > 1 ? attempts[attempts.length - 2] : null;

//   // --- 1. ロジック1で算出 ---
//   // 直近の一つの自己評価と正誤による算出 (最大3)
//   const latestAttemptNecessity = calculateReviewNecessityFromLatestAttempt(latestAttempt);

//   // --- 2. ロジック2で算出 ---
//   // 直近の二つの自己評価と正誤による重み付き算出 (最大3)
//   const recentWeightedNecessity = calculateWeightedReviewNecessity(
//     latestAttempt,
//     secondLatestAttempt
//   );

//   // より値が大きい方を使用して最終的な確認必要度を決定
//   // 結果は 0-3 の範囲であることが保証される (各ロジックの最大値が3のため)
//   const reviewNecessity = Math.max(latestAttemptNecessity.level, recentWeightedNecessity.level);

//   // 結果を返す
//   return {
//     reviewNecessity: Math.min(reviewNecessity, 3), // 念のため最大値を3に制限
//     latestAttemptNecessity,
//     recentWeightedNecessity,
//   };
// } | DEL |
