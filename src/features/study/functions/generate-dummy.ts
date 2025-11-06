import { Timestamp } from 'firebase/firestore';
import { TestSelfEvaluation } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { AttemptLog, ProblemLearningRecord, ProblemScoringStatus } from '../types/problem-types';

/** 配列からランダムな要素を取得 */
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** 指定範囲のランダムな整数を取得 */
const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** ダミーのTimestampオブジェクトを作成 */
const createDummyTimestamp = (daysAgo: number = 0): Timestamp => {
  const now = Date.now();
  // 過去daysAgo日間のランダムな時刻を設定
  const date = new Date(now - daysAgo * 24 * 60 * 60 * 1000 - getRandomInt(0, 86400000));

  return {
    toDate: () => date,
    toMillis: () => date.getTime(),
  } as Timestamp;
};

// --- AttemptLog生成関数 ---

const selfEvaluations: TestSelfEvaluation[] = ['notSure', 'imperfect', 'confident', 'unrated'];
const scoringStatuses: ProblemScoringStatus[] = ['correct', 'incorrect', 'unrated'];

/** ランダムなAttemptLogを生成 */
const createAttemptLog = (daysAgo: number): AttemptLog => ({
  attemptAt: createDummyTimestamp(daysAgo),
  selfEvaluation: getRandomElement(selfEvaluations),
  // 所要時間: 30秒 (30000ms) から 5分 (300000ms)
  timeSpentMs: getRandomInt(30000, 300000),
  scoringStatus: getRandomElement(scoringStatuses),
});

// --- ProblemLearningRecord生成関数 ---

const units = ['三角関数', '微分積分', '数列と漸化式', '確率統計'];
const categories = ['基礎問題', '応用問題', '定期テスト対策', '発展演習'];

/** ランダムなProblemLearningRecordを生成 */
export const createProblemLearningRecord = (index: number): ProblemLearningRecord => {
  const unitName = getRandomElement(units);
  const categoryName = getRandomElement(categories);
  const problemNumber = getRandomInt(1, 50);
  const problemIndex = index; // ダミーデータごとにユニークなインデックス

  // 試行回数: 1回から5回
  const attemptsCount = getRandomInt(1, 5);
  const attempts: AttemptLog[] = [];

  // 過去の試行ログを生成
  for (let i = 0; i < attemptsCount; i++) {
    // 過去30日間のランダムな日付でログを作成
    const daysAgo = getRandomInt(0, 30);
    attempts.push(createAttemptLog(daysAgo));
  }

  // 試行日時でソート（古い順）
  attempts.sort((a, b) => a.attemptAt.toMillis() - b.attemptAt.toMillis());

  return {
    unitName,
    categoryName,
    problemNumber,
    problemIndex,
    attempts,
  };
};

export const generateDummyRecords = (count: number) => {
  const dummyData: ProblemLearningRecord[] = Array.from({ length: count }, (_, i) =>
    createProblemLearningRecord(i + 1)
  );
  return dummyData;
};
