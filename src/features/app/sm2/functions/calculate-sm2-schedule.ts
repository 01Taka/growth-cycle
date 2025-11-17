// import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
// import {
//   LearningCycleProblem,
//   LearningCycleTestResult,
//   ProblemScoringStatus,
//   TestSelfEvaluation,
// } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
// import { DEFAULT_CATEGORY_ID, DEFAULT_REF_TIME_MS } from '../constants/sm2-constants';
// import { DEFAULT_SM2_STATE, SM2_SCHEDULER_PARAMS } from '../constants/sm2-schedule-constants';
// import { SM2State } from '../types/sm2-types';
// import { calculateSM2Quality } from './calculate-sm2-quality';

// /**
//  * 問題番号 (problemIndex) に対応する次の復習推奨日 (UNIXタイムスタンプ ms) を格納するRecord型。
//  * スコアが計算できなかった場合は、null を格納します。
//  */
// export type ProblemScheduleRecord = Record<number, number | null>;

// // 履歴処理に必要な中間型
// type AttemptHistoryItem = LearningCycleTestResult & { attemptedAt: number };
// type ProblemAttemptHistoryMap = Record<number, AttemptHistoryItem[]>;
// type CategoryRefTimeRecord = Record<string, number>;

// /**
//  * SM-2のQualityスコアに基づいて、SM-2の状態 (I, EF, n) を更新します。
//  * (ロジックは変更なし)
//  */
// export function updateSM2State(currentState: SM2State, qualityScore: number): SM2State {
//   const p = SM2_SCHEDULER_PARAMS;
//   let { interval: I, easeFactor: EF, repetitions: n } = currentState;

//   if (qualityScore >= 3) {
//     if (n === 0) {
//       I = p.FIRST_INTERVAL;
//     } else if (n === 1) {
//       I = p.SECOND_INTERVAL;
//     } else {
//       I = Math.round(I * EF);
//     }

//     n += 1;

//     const qDiff = 5 - qualityScore;
//     EF =
//       EF +
//       (p.EF_ADJUSTMENT_COEFFICIENT_A -
//         qDiff * (p.EF_ADJUSTMENT_COEFFICIENT_B + qDiff * p.EF_ADJUSTMENT_COEFFICIENT_C));

//     if (EF < p.MIN_EF) EF = p.MIN_EF;
//   } else {
//     n = p.RESET_REPETITIONS;
//     I = p.RESET_INTERVAL;
//   }

//   return { interval: I, easeFactor: EF, repetitions: n };
// }

// /**
//  * 更新された間隔 (日数) に基づいて、次の復習推奨日のUNIXタイムスタンプを計算します。
//  * (ロジックは変更なし)
//  */
// function calculateNextReviewDate(intervalDays: number, fromTimestampMs: number): number {
//   const p = SM2_SCHEDULER_PARAMS;
//   const MS_PER_DAY = 24 * 60 * 60 * 1000;

//   if (intervalDays <= 1) {
//     return fromTimestampMs + p.IMMEDIATE_REVIEW_MS;
//   }

//   return fromTimestampMs + intervalDays * MS_PER_DAY;
// }

// // -----------------------------------------------------------
// // 履歴から再計算するために必要なヘルパー関数
// // -----------------------------------------------------------

// /**
//  * 問題インデックスと問題詳細のマッピングを作成し、カテゴリごとの平均時間を集計します。
//  */
// function compileTimeDataAndProblemMap(cycle: LearningCycle): {
//   learningCycleProblemMap: Record<number, LearningCycleProblem>;
//   categoryRefTimeRecord: CategoryRefTimeRecord;
// } {
//   const learningCycleProblemMap: Record<number, LearningCycleProblem> = {};
//   const categoryTimeData: Record<string, { totalTime: number; count: number }> = {};

//   for (const problem of cycle.problems) {
//     learningCycleProblemMap[problem.problemIndex] = problem;
//   }

//   for (const session of cycle.sessions) {
//     for (const result of session.results) {
//       const learningCycleProblem = learningCycleProblemMap[result.problemIndex];

//       // 問題詳細があり、カテゴリIDが設定されている場合のみ集計対象とする
//       if (learningCycleProblem) {
//         const categoryId = learningCycleProblem.categoryId ?? DEFAULT_CATEGORY_ID;

//         if (!categoryTimeData[categoryId]) {
//           categoryTimeData[categoryId] = { totalTime: 0, count: 0 };
//         }

//         categoryTimeData[categoryId].totalTime += result.timeSpentMs;
//         categoryTimeData[categoryId].count += 1;
//       }
//     }
//   }

//   const categoryRefTimeRecord: CategoryRefTimeRecord = {};
//   for (const categoryId in categoryTimeData) {
//     const data = categoryTimeData[categoryId];
//     if (data.count > 0) {
//       categoryRefTimeRecord[categoryId] = Math.round(data.totalTime / data.count);
//     }
//   }

//   return { learningCycleProblemMap, categoryRefTimeRecord };
// }

// /**
//  * 全セッション結果を問題ごとに時系列で集約します。
//  */
// function compileProblemHistory(cycle: LearningCycle): ProblemAttemptHistoryMap {
//   const allAttempts: AttemptHistoryItem[] = [];

//   // 1. 全ての試行にセッションのタイムスタンプを付与してリスト化
//   for (const session of cycle.sessions) {
//     for (const result of session.results) {
//       allAttempts.push({
//         ...result,
//         attemptedAt: session.attemptedAt,
//       } as AttemptHistoryItem);
//     }
//   }

//   // 2. タイムスタンプでソート (時系列順)
//   allAttempts.sort((a, b) => a.attemptedAt - b.attemptedAt);

//   // 3. 問題IDごとにグループ化
//   const historyMap: ProblemAttemptHistoryMap = {};
//   for (const attempt of allAttempts) {
//     const problemIndex = attempt.problemIndex;
//     if (!historyMap[problemIndex]) {
//       historyMap[problemIndex] = [];
//     }
//     historyMap[problemIndex].push(attempt);
//   }
//   return historyMap;
// }

// /**
//  * 問題に設定されたカテゴリIDに基づき、基準時間 (refTimeMs) を取得します。
//  */
// function getRefTimeMsForProblem(
//   problem: LearningCycleProblem,
//   categoryRefTimeRecord: CategoryRefTimeRecord
// ): number {
//   const categoryId = problem.categoryId ?? DEFAULT_CATEGORY_ID;
//   return categoryRefTimeRecord[categoryId] ?? DEFAULT_REF_TIME_MS;
// }

// /**
//  * LearningCycle全体の問題ごとの次の復習推奨日を計算します。
//  *
//  * **重要**: 過去のSM2StateをDBから読み込む代わりに、全履歴を時系列で再計算します。
//  *
//  * @param cycle 処理対象のLearningCycleデータ
//  * @returns 問題番号をキーとし、次の復習推奨日のUNIXタイムスタンプを値とするRecord
//  */
// export function calculateSM2ReviewScheduleForCycle(cycle: LearningCycle): ProblemScheduleRecord {
//   // 1. 基準時間と問題詳細マップの準備 (Quality計算のため)
//   const { categoryRefTimeRecord } = compileTimeDataAndProblemMap(cycle);

//   // 2. 全履歴を問題ごとに時系列で集約
//   const problemHistoryMap = compileProblemHistory(cycle);

//   const scheduleRecord: ProblemScheduleRecord = {};

//   for (const problem of cycle.problems) {
//     const problemIndex = problem.problemIndex;
//     const history = problemHistoryMap[problemIndex];

//     // 履歴がない場合はスキップ (null)
//     if (!history || history.length === 0) {
//       scheduleRecord[problemIndex] = null;
//       continue;
//     }

//     // 3. 基準時間の取得
//     const refTimeMs = getRefTimeMsForProblem(problem, categoryRefTimeRecord);

//     // 4. SM-2の状態を履歴に基づいて逐次更新
//     let currentState = DEFAULT_SM2_STATE;
//     let lastAttemptTime = cycle.cycleStartAt; // 基準となる開始時間

//     for (const attempt of history) {
//       // a. Qualityスコアを計算
//       const qualityScore = calculateSM2Quality(
//         attempt.selfEvaluation as TestSelfEvaluation,
//         attempt.scoringStatus as ProblemScoringStatus,
//         attempt.timeSpentMs,
//         refTimeMs
//       );

//       // b. SM-2の状態を更新
//       currentState = updateSM2State(currentState, qualityScore);

//       // c. 最終解答時間を更新
//       lastAttemptTime = attempt.attemptedAt;
//     }

//     // 5. 最終的な復習日を計算
//     const nextReviewDate = calculateNextReviewDate(currentState.interval, lastAttemptTime);

//     scheduleRecord[problemIndex] = nextReviewDate;
//   }

//   return scheduleRecord;
// }

// // 新しい戻り値の型
// export type ProblemForgottenStatusRecord = Record<number, boolean>;

// /**
//  * LearningCycle全体の問題ごとの最終試行の忘却状態 (q < 3) を計算します。
//  *
//  * @param cycle 処理対象のLearningCycleデータ
//  * @returns 問題番号をキーとし、直前の試行で忘却（q < 3）したかどうかを値とするRecord
//  */
// export function calculateForgottenStatusForCycle(
//   cycle: LearningCycle
// ): ProblemForgottenStatusRecord {
//   // 1. 基準時間と問題詳細マップの準備
//   const { categoryRefTimeRecord } = compileTimeDataAndProblemMap(cycle);
//   // 2. 全履歴を問題ごとに時系列で集約
//   const problemHistoryMap = compileProblemHistory(cycle);

//   const forgottenStatusRecord: ProblemForgottenStatusRecord = {};

//   for (const problem of cycle.problems) {
//     const problemIndex = problem.problemIndex;
//     const history = problemHistoryMap[problemIndex];

//     if (!history || history.length === 0) {
//       forgottenStatusRecord[problemIndex] = false;
//       continue;
//     }

//     // === 🚀 変更点: 最終試行だけを取得 ===
//     const lastAttempt = history[history.length - 1];
//     // ====================================

//     // 3. 基準時間の取得
//     const refTimeMs = getRefTimeMsForProblem(problem, categoryRefTimeRecord);

//     // 4. 最終 Quality スコアを計算 (ループは不要)
//     const lastQualityScore = calculateSM2Quality(
//       lastAttempt.selfEvaluation as TestSelfEvaluation,
//       lastAttempt.scoringStatus as ProblemScoringStatus,
//       lastAttempt.timeSpentMs,
//       refTimeMs
//     );

//     // 5. 最終的なリセット状態を判定
//     forgottenStatusRecord[problemIndex] = lastQualityScore < 3;
//   }

//   return forgottenStatusRecord;
// } |DEL|
