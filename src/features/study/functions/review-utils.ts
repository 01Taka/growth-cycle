// import { ProblemLearningRecord } from '../types/problem-types';
// import { determineFinalReviewNecessity } from './calculate-review-necessity';

// // ソート基準を表す型を定義
// export type SortType = 'index' | 'necessity';

// export const sortLearningRecord = (
//   records: readonly ProblemLearningRecord[],
//   sortType: SortType = 'necessity'
// ) => {
//   // ソート処理をカプセル化する関数
//   const sortFunction = (a: ProblemLearningRecord, b: ProblemLearningRecord) => {
//     if (sortType === 'necessity') {
//       // 1. レビュー必要性 (necessity) で降順ソート
//       const aNecessity = determineFinalReviewNecessity(a.attempts).reviewNecessity;
//       const bNecessity = determineFinalReviewNecessity(b.attempts).reviewNecessity;

//       // 必要性 (necessity) が異なる場合はその差でソート (b - a で降順)
//       if (bNecessity !== aNecessity) {
//         return bNecessity - aNecessity;
//       }

//       // 2. 必要性 (necessity) が同じ場合は、problemIndex で昇順ソート
//       // problemIndex は通常、問題の作成順序などを表すため、昇順 (a - b) が自然です
//       return a.problemIndex - b.problemIndex;
//     } else if (sortType === 'index') {
//       // problemIndex で昇順ソート
//       return a.problemIndex - b.problemIndex;
//     }

//     // 予期せぬ sortType の場合は変更を加えない (あるいは必要に応じてエラーを投げる)
//     return 0;
//   };

//   return records.slice().sort(sortFunction);
// }; | DEL |
