// // 1. ユーティリティ関数の定義

// import { LearningCycleClientData } from '@/shared/data/documents/learning-cycle/learning-cycle-derived';
// import { expandRangeToNumbers } from '../range/range-utils';
// import { StartStudyFormValues } from './form-types';

// // 2. 変換関数の定義
// /**
//  * StartStudyFormValuesをLearningCycleClientDataに変換します。
//  * expandRangeToNumbersユーティリティ関数を利用して問題番号の配列を生成します。
//  */
// export function convertToLearningCycleClientData(
//   formData: StartStudyFormValues,
//   textbookId: string
// ): LearningCycleClientData | null {
//   if (formData.testMode === null) {
//     console.error('testMode is null and cannot be converted.');
//     return null;
//   }

//   const minutesToMs = (minutes: number | null): number => {
//     return (minutes ?? 0) * 60 * 1000;
//   };

//   const problems: LearningCycleClientData['problems'] = [];
//   let problemIndex = 0;

//   // testRangeをループしてproblems配列を生成します
//   for (const rangeGroup of formData.testRange) {
//     for (const range of rangeGroup.ranges) {
//       // ⭐ ここでユーティリティ関数を利用して問題番号の配列を取得します
//       const problemNumbers = expandRangeToNumbers(range.start, range.end);

//       for (const problemNumber of problemNumbers) {
//         problems.push({
//           index: problemIndex++, // 通し番号
//           unitId: '',
//           categoryId: '',
//           problemNumber: problemNumber, // 展開された問題番号
//         });
//       }
//     }
//   }

//   // 変換後のオブジェクトを構築
//   const learningCycleData: LearningCycleClientData = {
//     testMode: formData.testMode,
//     textbookId: textbookId,
//     learningDurationMs: minutesToMs(formData.studyTimeMin),
//     testDurationMs: minutesToMs(formData.testTimeMin),
//     problems: problems,
//     isReviewTarget: true,
//   };

//   return learningCycleData;
// } |DEL|
