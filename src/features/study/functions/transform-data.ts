// import { DEFAULT_LABELS } from '@/shared/constants/document-constants';
// import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
// import { LearningProblemBase } from '../types/problem-types';

// /**
//  * 入力データを問題の試行履歴の配列に変換します。
//  * @param data 変換する入力データオブジェクト
//  * @returns 変換された問題試行の配列
//  */
// export const transformData = (data: LearningCycle): LearningProblemBase[] => {
//   const { problems, units, categories, latestAttemptedAt } = data;
//   const transformedAttempts: LearningProblemBase[] = [];

//   // ユニットとカテゴリのIDと名前のマッピングを効率化のために作成
//   const unitMap = new Map(units.map((unit) => [unit.id, unit.name]));
//   const categoryMap = new Map(categories.map((category) => [category.id, category.name]));

//   problems.map((problem) => {
//     const unitName = unitMap.get(problem.unitId || '') || data.textbookName;
//     const categoryName = categoryMap.get(problem.categoryId || '') || DEFAULT_LABELS.category;

//     transformedAttempts.push({
//       unitName: unitName,
//       categoryName: categoryName,
//       problemNumber: problem.problemNumber,
//       problemIndex: problem.problemIndex,
//       attemptAt: latestAttemptedAt,
//     });
//   });

//   return transformedAttempts;
// };

// // /**
// //  * LearningCycleオブジェクトをProblemAttemptResultの配列に変換します。
// //  * @param cycle 変換するLearningCycleオブジェクト
// //  * @returns すべての問題試行結果を含むProblemAttemptResultの配列
// //  */
// // export const convertLearningCycleToAttempts = (cycle: LearningCycle): ProblemAttemptResult[] => {
// //   const allAttempts: ProblemAttemptResult[] = [];

// //   // 1. マッピングの作成: IDから名前や詳細へ素早くアクセスできるようにする
// //   const unitMap = new Map(cycle.units.map((u) => [u.id, u.name]));
// //   const categoryMap = new Map(cycle.categories.map((c) => [c.id, c.name]));

// //   // problemIndexから問題の詳細情報へのマッピング
// //   const learningCycleProblemMap = new Map(cycle.problems.map((p) => [p.index, p]));

// //   // 2. セッションの反復処理
// //   cycle.sessions.forEach((session) => {
// //     const attemptTime = session.attemptedAt;

// //     // 3. 各セッション内の結果の反復処理
// //     session.results.forEach((result) => {
// //       const learningCycleProblem = learningCycleProblemMap.get(result.problemIndex);

// //       if (learningCycleProblem) {
// //         // 問題の詳細情報を使用して、ユニット名とカテゴリ名を取得
// //         const unitName = unitMap.get(learningCycleProblem.unitId || '') || cycle.textbookName;
// //         const categoryName =
// //           categoryMap.get(learningCycleProblem.categoryId || '') || DEFAULT_LABELS.category;

// //         // 4. ProblemAttemptResultオブジェクトを作成し、配列に追加
// //         allAttempts.push({
// //           scoringStatus: result.scoringStatus,
// //           selfEvaluation: result.selfEvaluation,
// //           timeSpentMs: result.timeSpentMs, // timeTakenMsをtimeSpentMsにマップ
// //           attemptAt: attemptTime,
// //           unitName: unitName,
// //           categoryName: categoryName,
// //           problemNumber: learningCycleProblem.problemNumber,
// //           problemIndex: result.problemIndex,
// //         });
// //       }
// //     });
// //   });

// //   return allAttempts;
// // }; | DEL |
