// import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
// import { generateFirestoreId } from '@/shared/data/idb/generate-path';
// import { IDB_PATH } from '@/shared/data/idb/idb-path';
// import { getDateAfterDaysBoundary } from '@/shared/utils/datetime/datetime-utils';

// // ユーティリティ関数: 乱数に応じて要素をランダムに選択
// const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
// // ユーティリティ関数: 指定された範囲内の乱数を生成
// const getRandomInt = (min: number, max: number): number =>
//   Math.floor(Math.random() * (max - min + 1)) + min;

// /**
//  * LearningCycleDocument型のダミーデータを生成する関数
//  * @param problemCount 生成する問題の総数
//  * @param sessionCount 生成するセッション（テスト実施）の数
//  * @returns LearningCycleDocumentオブジェクト
//  */
// export const generateDummyLearningCycle = (
//   problemCount: number = 5,
//   sessionCount: number = 2
// ): LearningCycleDocument => {
//   const subjects: LearningCycleDocument['subject'][] = [
//     'japanese',
//     'math',
//     'science',
//     'socialStudies',
//     'english',
//   ];
//   const testModes: LearningCycleDocument['testMode'][] = ['memory', 'skill'];

//   // --- 固定/基本設定 ---
//   const subject = getRandomElement(subjects);
//   const testMode = getRandomElement(testModes);
//   const now = Date.now();
//   const cycleStartAt = now - 30 * 24 * 60 * 60 * 1000 - getRandomInt(0, 7 * 24 * 60 * 60 * 1000); // 30日〜37日前に開始

//   // --- Unit/Category の定義 ---
//   const units: LearningCycleDocument['units'] = [
//     { id: 'UNIT-A', name: '基礎概念' },
//     { id: 'UNIT-B', name: '応用発展' },
//   ];
//   const categories: LearningCycleDocument['categories'] = [
//     { id: 'CAT-EASY', name: '易', timePerProblem: 20000, problemNumberFormat: 'number' },
//     { id: 'CAT-NORMAL', name: '中', timePerProblem: 45000, problemNumberFormat: 'number' },
//     { id: 'CAT-HARD', name: '難', timePerProblem: 90000, problemNumberFormat: 'alphabet' },
//   ];

//   // --- Problems の生成 ---
//   const problems: LearningCycleDocument['problems'] = Array.from(
//     { length: problemCount },
//     (_, index) => {
//       const unit = getRandomElement(units);
//       const category = getRandomElement(categories);
//       return {
//         index,
//         unitId: unit.id,
//         categoryId: category.id,
//         problemNumber: index + 1,
//       };
//     }
//   );

//   // --- Sessions の生成 ---
//   const sessions: LearningCycleDocument['sessions'] = Array.from(
//     { length: sessionCount },
//     (_, sessionIndex) => {
//       // セッション間の時間を設定
//       const lastAttemptedAt = Math.max(
//         now - getRandomInt(0, 10 * 24 * 60 * 60 * 1000),
//         cycleStartAt
//       );
//       const attemptedAt =
//         cycleStartAt + ((lastAttemptedAt - cycleStartAt) / sessionCount) * (sessionIndex + 1);

//       const results: LearningCycleDocument['sessions'][0]['results'] = problems.map((problem) => {
//         const category = categories.find((c) => c.id === problem.categoryId)!;
//         const avgTime = category.timePerProblem;

//         // ランダムな結果
//         const isCorrect = Math.random() < (problem.categoryId === 'CAT-EASY' ? 0.8 : 0.5); // 易しい問題は正答率高め
//         const selfEvaluation: LearningCycleDocument['sessions'][0]['results'][0]['selfEvaluation'] =
//           getRandomElement(['confident', 'imperfect', 'notSure']);

//         const scoringStatus: LearningCycleDocument['sessions'][0]['results'][0]['scoringStatus'] =
//           getRandomElement(['unrated', 'correct', 'incorrect']);
//         const timeTakenMs = getRandomInt(avgTime * 0.5, avgTime * 1.5);

//         return {
//           problemIndex: problem.index,
//           selfEvaluation: isCorrect ? 'confident' : selfEvaluation, // 正解なら自信ありに偏らせる
//           isCorrect: isCorrect,
//           timeSpentMs: timeTakenMs,
//           scoringStatus,
//         };
//       });

//       return {
//         attemptedAt: attemptedAt,
//         results: results,
//       };
//     }
//   );

//   const latestAttemptedAt =
//     sessions.length > 0 ? sessions[sessions.length - 1].attemptedAt : cycleStartAt;

//   const id = generateFirestoreId();

//   const nextReviewRandom = Math.random();
//   const nextReviewDate = getDateAfterDaysBoundary(
//     nextReviewRandom > 1 / 3 ? 0 : nextReviewRandom > 2 / 3 ? 1 : 7
//   );

//   return {
//     id,
//     path: `${IDB_PATH.learningCycles}/${id}`,
//     textbookId: `TBK-${subject.toUpperCase()}-${getRandomInt(100, 999)}`,
//     testMode: testMode,
//     learningDurationMs: getRandomInt(1, 10) * 3600000, // 1〜10時間
//     testDurationMs: problemCount * 60000, // 問題数 x 1分
//     problems: problems,
//     isReviewTarget: Math.random() > 0.1,
//     textbookName: `${subject.charAt(0).toUpperCase() + subject.slice(1)} ${testMode === 'memory' ? '用語集' : '問題集'}`,
//     subject: subject,
//     cycleStartAt: cycleStartAt,
//     units: units,
//     categories: categories,
//     sessions: sessions,
//     nextReviewDate,
//     latestAttemptedAt: latestAttemptedAt,
//     plant: {
//       seedType: '',
//       size: 0,
//       plantType: '',
//       plantRarity: '',
//       modules: {},
//       id: generateFirestoreId(),
//       currentStage: getRandomInt(0, 2),
//       lastGrownAt: latestAttemptedAt,
//       textbookPositionX: Math.random(),
//     },
//   };
// };

// /**
//  * 複数の LearningCycleDocument のダミーデータを生成する関数
//  * @param count 生成するサイクルの総数
//  * @param problemCount 各サイクルに含める問題の数 (generateDummyLearningCycle に渡される)
//  * @param sessionCount 各サイクルに含めるセッションの数 (generateDummyLearningCycle に渡される)
//  * @returns LearningCycleDocument の配列
//  */
// export const generateMultipleLearningCycles = (
//   count: number,
//   problemCount: number = 5,
//   sessionCount: number = 2
// ): LearningCycleDocument[] => {
//   if (count <= 0) {
//     return [];
//   }

//   const cycles: LearningCycleDocument[] = [];

//   for (let i = 0; i < count; i++) {
//     // 各サイクル生成時、問題数とセッション数を少しランダムに変動させ、よりリアルなデータにする
//     const pCount = Math.max(1, problemCount + getRandomInt(-2, 2)); // 1問未満にならないように
//     const sCount = Math.max(1, sessionCount + getRandomInt(-1, 1)); // 1セッション未満にならないように

//     const cycle = generateDummyLearningCycle(pCount, sCount);
//     cycles.push(cycle);
//   }

//   return cycles;
// }; | DEL |
