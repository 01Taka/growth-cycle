import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { ProblemAttemptDetail } from '../types/problem-types';

// --- ダミーデータ ---
// export const dummyProblems: ProblemAttemptDetail[] = [
//   {
//     unitName: '線形代数I',
//     categoryName: '行列式',
//     problemNumber: 15,
//     problemIndex: 0,
//   },
//   {
//     unitName: '微分積分II',
//     categoryName: '偏微分',
//     problemNumber: 3,
//     problemIndex: 1,
//   },
//   {
//     unitName: '統計学基礎',
//     categoryName: '確率分布',
//     problemNumber: 8,
//     problemIndex: 2,
//   },
//   {
//     unitName: '離散数学',
//     categoryName: 'グラフ理論',
//     problemNumber: 22,
//     problemIndex: 3,
//   },
//   {
//     unitName: '情報科学入門',
//     categoryName: 'アルゴリズム',
//     problemNumber: 1,
//     problemIndex: 4,
//   },
// ];

// TestSelfEvaluation の取りうる値の配列
const evaluationOptions: TestSelfEvaluation[] = ['notSure', 'imperfect', 'confident', 'unrated'];

/**
 * 最小値と最大値の間のランダムな整数を生成するヘルパー
 */
const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * TestSelfEvaluation からランダムな値を返すヘルパー
 */
const getRandomSelfEvaluation = (): TestSelfEvaluation => {
  const randomIndex = Math.floor(Math.random() * evaluationOptions.length);
  return evaluationOptions[randomIndex];
};

/**
 * 任意の数の ProblemAttemptDetail のダミーデータを生成する関数
 * @param count 生成したいデータの数
 * @returns ProblemAttemptDetail の配列
 */
export const generateDummyTestResults = (count: number): ProblemAttemptDetail[] => {
  const results: ProblemAttemptDetail[] = [];
  const unitNames = ['Unit A', 'Unit B', 'Unit C', 'Unit D'];
  const categoryNames = ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry'];

  for (let i = 0; i < count; i++) {
    const unitName = unitNames[getRandomInt(0, unitNames.length - 1)];
    const categoryName = categoryNames[getRandomInt(0, categoryNames.length - 1)];
    const problemNumber = getRandomInt(1, 15); // 1から15の間の問題番号
    const timeSpentMs = getRandomInt(10000, 900000); // 10秒(10000ms)から15分(900000ms)

    results.push({
      unitName,
      categoryName,
      problemNumber,
      problemIndex: i,
      selfEvaluation: getRandomSelfEvaluation(),
      timeSpentMs,
    });
  }

  return results;
};
