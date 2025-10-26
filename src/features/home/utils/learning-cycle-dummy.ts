import { Timestamp } from 'firebase/firestore';
import { LearningCycle } from '@/shared/types/learning-cycle-types';

const createMockTimestamp = (offsetMs: number = 0): Timestamp => {
  const now = Date.now() + offsetMs;
  const seconds = Math.floor(now / 1000);
  const nanoseconds = (now % 1000) * 1_000_000;
  const toMillis = () => now;
  return { seconds, nanoseconds, toMillis } as Timestamp;
};

const oneDay = 86400000;

export const dummyLearningCycle: LearningCycle = {
  textbookId: 'math_textbook_001',
  subject: 'math',
  settings: {
    testMode: 'memory',
    learningDurationMs: 3600000, // 1時間
    testDurationMs: 1200000, // 20分

    units: [
      { id: 'unit_01_poly', name: '多項式の計算' },
      { id: 'unit_02_eq', name: '連立方程式' },
    ],
    categories: [
      { id: 'cat_01_basic', name: '基本問題' },
      { id: 'cat_02_app', name: '応用問題' },
    ],

    problems: [
      { index: 0, unitId: 'unit_01_poly', categoryId: 'cat_01_basic', problemNumber: 1 },
      { index: 1, unitId: 'unit_01_poly', categoryId: 'cat_01_basic', problemNumber: 2 },
      { index: 2, unitId: 'unit_01_poly', categoryId: 'cat_02_app', problemNumber: 5 },
      { index: 3, unitId: 'unit_02_eq', categoryId: 'cat_01_basic', problemNumber: 10 },
      { index: 4, unitId: 'unit_02_eq', categoryId: 'cat_01_basic', problemNumber: 11 },
      { index: 5, unitId: 'unit_02_eq', categoryId: 'cat_02_app', problemNumber: 15 },
    ],
  },
  sessions: [
    {
      attemptedAt: createMockTimestamp(-3600000), // 1時間前に実施
      results: [
        { problemIndex: 0, selfEvaluation: 'confident', isCorrect: true, timeTakenMs: 15000 },
        { problemIndex: 1, selfEvaluation: 'imperfect', isCorrect: true, timeTakenMs: 25000 },
        { problemIndex: 2, selfEvaluation: 'notSure', isCorrect: false, timeTakenMs: 60000 },
        { problemIndex: 3, selfEvaluation: 'confident', isCorrect: true, timeTakenMs: 10000 },
        { problemIndex: 4, selfEvaluation: 'unrated', isCorrect: true, timeTakenMs: 18000 },
        { problemIndex: 5, selfEvaluation: 'notSure', isCorrect: false, timeTakenMs: 90000 },
      ],
    },
    {
      attemptedAt: createMockTimestamp(0), // 現在時刻に実施（最新のセッション）
      results: [
        { problemIndex: 0, selfEvaluation: 'confident', isCorrect: true, timeTakenMs: 10000 },
        { problemIndex: 1, selfEvaluation: 'confident', isCorrect: true, timeTakenMs: 15000 },
        { problemIndex: 2, selfEvaluation: 'imperfect', isCorrect: true, timeTakenMs: 45000 }, // 復習で正解
        { problemIndex: 3, selfEvaluation: 'confident', isCorrect: true, timeTakenMs: 8000 },
        { problemIndex: 4, selfEvaluation: 'confident', isCorrect: true, timeTakenMs: 12000 },
        { problemIndex: 5, selfEvaluation: 'imperfect', isCorrect: false, timeTakenMs: 70000 },
      ],
    },
  ],
  nextReviewAt: createMockTimestamp(0),
  latestAttemptedAt: createMockTimestamp(0), // 最新のセッションの時刻
  cycleStartAt: createMockTimestamp(oneDay * -7),
  isReviewTarget: true,
};

export const dummyLearningCycles: LearningCycle[] = [
  // 1. Math Cycle (Similar to the original, but simplified)
  {
    textbookId: 'math_textbook_001',
    subject: 'math',
    settings: {
      testMode: 'memory',
      learningDurationMs: 3600000,
      testDurationMs: 1200000,
      units: [
        { id: 'unit_01_poly', name: '多項式の計算' },
        { id: 'unit_02_eq', name: '連立方程式' },
      ],
      categories: [
        { id: 'cat_01_basic', name: '基本問題' },
        { id: 'cat_02_app', name: '応用問題' },
      ],
      problems: [],
    },
    sessions: [],
    nextReviewAt: createMockTimestamp(0), // 2日後にレビュー予定
    latestAttemptedAt: createMockTimestamp(0),
    cycleStartAt: createMockTimestamp(oneDay * -1),
    isReviewTarget: true,
  },

  // 2. Science Cycle (Different subject and settings)
  {
    textbookId: 'science_textbook_005',
    subject: 'science',
    settings: {
      testMode: 'memory',
      learningDurationMs: 7200000, // 2時間
      testDurationMs: 1800000, // 30分
      units: [
        { id: 'unit_03_chem', name: '化学変化と原子・分子' },
        { id: 'unit_04_bio', name: '細胞と生殖' },
      ],
      categories: [
        { id: 'cat_03_def', name: '定義' },
        { id: 'cat_04_calc', name: '計算' },
      ],
      problems: [],
    },
    sessions: [],
    nextReviewAt: createMockTimestamp(oneDay * -1), // レビュー期限切れ
    latestAttemptedAt: createMockTimestamp(oneDay * -3),
    cycleStartAt: createMockTimestamp(oneDay * -1),
    isReviewTarget: true,
  },

  // 3. History Cycle (Smaller, completed cycle)
  {
    textbookId: 'history_textbook_010',
    subject: 'socialStudies',
    settings: {
      testMode: 'memory',
      learningDurationMs: 1800000, // 30分
      testDurationMs: 600000, // 10分
      units: [{ id: 'unit_05_anc', name: '古代文明' }],
      categories: [{ id: 'cat_05_name', name: '人名・年号' }],
      problems: [],
    },
    sessions: [],
    nextReviewAt: createMockTimestamp(oneDay * 14), // 2週間後
    latestAttemptedAt: createMockTimestamp(oneDay * -5),
    cycleStartAt: createMockTimestamp(oneDay * -1),
    isReviewTarget: true, // もうレビュー対象ではない
  },
];
