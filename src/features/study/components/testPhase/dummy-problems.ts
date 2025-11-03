import { StudyProblem } from '../../types/problem-types';

// --- ダミーデータ ---
export const dummyProblems: StudyProblem[] = [
  {
    unitName: '線形代数I',
    categoryName: '行列式',
    problemNumber: 15,
    problemIndex: 0,
    selfEvaluation: 'confident', // 確信あり
    timeMs: 125000, // 2分5秒
  },
  {
    unitName: '微分積分II',
    categoryName: '偏微分',
    problemNumber: 3,
    problemIndex: 1,
    selfEvaluation: 'imperfect', // 不完全、間違っているかも
    timeMs: 340000, // 5分40秒
  },
  {
    unitName: '統計学基礎',
    categoryName: '確率分布',
    problemNumber: 8,
    problemIndex: 2,
    selfEvaluation: 'notSure', // よくわからない
    timeMs: 45000, // 45秒
  },
  {
    unitName: '離散数学',
    categoryName: 'グラフ理論',
    problemNumber: 22,
    problemIndex: 3,
    selfEvaluation: 'confident',
    timeMs: 210000, // 3分30秒
  },
  {
    unitName: '情報科学入門',
    categoryName: 'アルゴリズム',
    problemNumber: 1,
    problemIndex: 4,
    selfEvaluation: 'unrated', // 未評価
    timeMs: null, // 時間計測なし
  },
];
