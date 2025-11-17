// import { LearningCycleProblem } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
// import { ProblemFilter, ScheduledProblem } from '../types/sm2-types';
// import { ProblemForgottenStatusRecord, ProblemScheduleRecord } from './calculate-sm2-schedule';

// /**
//  * 問題に復習スケジュール情報を付加します。
//  * * @param problems LearningCycleProblemの配列
//  * @param scheduleRecord calculateSM2ReviewScheduleForCycleの結果
//  * @param forgottenStatusRecord calculateForgottenStatusForCycleの結果
//  * @returns 復習スケジュール情報が付加されたScheduledProblemの配列
//  */
// export function attachScheduleInfoToProblems(
//   problems: LearningCycleProblem[],
//   scheduleRecord: ProblemScheduleRecord,
//   forgottenStatusRecord: ProblemForgottenStatusRecord,
//   nowMs = Date.now()
// ): ScheduledProblem[] {
//   const MS_PER_DAY = 24 * 60 * 60 * 1000;

//   return problems.map((problem) => {
//     const nextReviewDateMs = scheduleRecord[problem.problemIndex];
//     const wasForgotten = forgottenStatusRecord[problem.problemIndex] ?? false; // 履歴がなければ false

//     let relativeReviewDays: number | null;

//     if (nextReviewDateMs === null || nextReviewDateMs === undefined) {
//       // スケジュール未登録または履歴なし
//       relativeReviewDays = null;
//     } else {
//       // 復習予定日と現在の時刻の差を日数で計算
//       const diffMs = nextReviewDateMs - nowMs;
//       relativeReviewDays = Math.floor(diffMs / MS_PER_DAY);
//     }

//     return {
//       ...problem,
//       relativeReviewDays,
//       wasForgotten,
//     } as ScheduledProblem;
//   });
// }

// /**
//  * ScheduledProblemの配列を以下の優先度でソートします。
//  * 1. wasForgotten: trueが優先 (忘却リスクが高い)
//  * 2. relativeReviewDays: 小さい値（過去/期限切れが優先）が優先
//  * 3. problemIndex: 小さい値が優先 (最終的な安定性のため)
//  *
//  * @param scheduledProblems 復習情報が付加された問題の配列
//  * @returns ソートされたScheduledProblemの配列
//  */
// export function sortScheduledProblems(scheduledProblems: ScheduledProblem[]): ScheduledProblem[] {
//   // 元の配列を変更しないようコピー
//   return [...scheduledProblems].sort((a, b) => {
//     // 1. wasForgotten の比較 (true = 1, false = 0)
//     // b.wasForgotten - a.wasForgotten で true（1）が前に来る
//     const forgottenDiff = (b.wasForgotten ? 1 : 0) - (a.wasForgotten ? 1 : 0);
//     if (forgottenDiff !== 0) return forgottenDiff;

//     // 2. relativeReviewDays の比較 (小さい値が優先)
//     if (a.relativeReviewDays !== null || b.relativeReviewDays !== null) {
//       if (a.relativeReviewDays === null) return 1;
//       if (b.relativeReviewDays === null) return -1;
//       const reviewDayDiff = a.relativeReviewDays - b.relativeReviewDays;
//       if (reviewDayDiff !== 0) return reviewDayDiff;
//     }

//     // 3. problemIndex の比較 (小さい値が優先)
//     return a.problemIndex - b.problemIndex;
//   });
// }

// /**
//  * 復習スケジュール情報が付加された問題の配列をフィルタリングします。
//  *
//  * @param scheduledProblems 復習情報が付加された問題の配列
//  * @param filter フィルタリング条件
//  * @returns フィルタリングされたScheduledProblemの配列
//  */
// export function filterScheduledProblems(
//   scheduledProblems: ScheduledProblem[],
//   filter: ProblemFilter
// ): ScheduledProblem[] {
//   const { minDays, maxDays, filterForgottenStatus } = filter;

//   return scheduledProblems.filter((problem) => {
//     // スケジュール未登録 (null) は常に除外
//     if (problem.relativeReviewDays === null) return false;

//     // 1. 復習予定日の範囲によるフィルタリング
//     let isDayInRange = true;

//     // 最小値フィルタ
//     if (minDays !== undefined && problem.relativeReviewDays < minDays) {
//       isDayInRange = false;
//     }
//     // 最大値フィルタ
//     if (maxDays !== undefined && problem.relativeReviewDays > maxDays) {
//       isDayInRange = false;
//     }

//     if (!isDayInRange) return false;

//     // 2. 忘却フラグによるフィルタリング
//     if (filterForgottenStatus !== undefined) {
//       if (problem.wasForgotten !== filterForgottenStatus) {
//         return false;
//       }
//     }

//     return true;
//   });
// } |DEL|
