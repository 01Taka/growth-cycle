// --- 1. Firestore Timestampのモック定義 ---

import { Timestamp } from 'firebase/firestore';
import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { TestSession } from '@/shared/data/documents/learning-cycle/learning-cycle-support';

/**
 * FirestoreのTimestamp型を模倣したインターフェース。
 * 実際にはsecondsとnanosecondsを持ち、便利なメソッドも付与します。
 */
interface FirestoreTimestamp {
  readonly seconds: number;
  readonly nanoseconds: number;
  toDate: () => Date;
  toMillis: () => number;
}

type DummyTimestamp = FirestoreTimestamp; // 型エイリアスを更新

// ------------------------------------
// --- 2. ヘルパー関数 ---
// ------------------------------------

/**
 * 指定された配列からランダムな要素を1つ選択します。
 */
function getRandomElement<T>(arr: T[]): T {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * 指定された範囲のランダムな整数を生成します（min, max を含む）。
 */
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 指定された長さのランダムな英数字の文字列を生成します。
 */
function getRandomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * ミリ秒からFirestoreTimestamp型のオブジェクトを作成します。
 */
function createTimestampFromMillis(ms: number): DummyTimestamp {
  const seconds = Math.floor(ms / 1000);
  // nanosecondsはミリ秒の剰余に1,000,000をかけたもの（最大999,000,000）
  const nanoseconds = (ms % 1000) * 1000000;

  return {
    seconds: seconds,
    nanoseconds: nanoseconds,
    // convenience methods
    toDate: () => new Date(seconds * 1000 + Math.floor(nanoseconds / 1000000)),
    toMillis: () => seconds * 1000 + Math.floor(nanoseconds / 1000000),
  };
}

/**
 * 過去n日のランダムなFirestoreTimestampを生成します。
 */
function createRandomFirestoreTimestamp(days = 30): DummyTimestamp {
  const now = Date.now();
  // 1年前
  const daysAgoInMs = now - days * 24 * 60 * 60 * 1000;

  const randomMs = getRandomInt(daysAgoInMs, now);
  return createTimestampFromMillis(randomMs);
}

/**
 * Timestampに指定された日数を加算した新しいTimestampを返します。
 */
function addDaysToTimestamp(ts: DummyTimestamp, days: number): DummyTimestamp {
  const ms = ts.toMillis() + days * 24 * 60 * 60 * 1000;
  return createTimestampFromMillis(ms);
}

// ------------------------------------
// --- 3. ダミーデータ生成関数 ---
// ------------------------------------

/**
 * TestSessionのダミーデータを生成します。
 */
function generateDummyTestSession(problemCount: number): TestSession {
  const attemptedAt = createRandomFirestoreTimestamp();
  const results: TestSession['results'] = [];
  const selfEvaluations: TestSession['results'][number]['selfEvaluation'][] = [
    'notSure',
    'imperfect',
    'confident',
    'unrated',
  ];

  for (let i = 0; i < problemCount; i++) {
    results.push({
      problemIndex: i,
      selfEvaluation: getRandomElement(selfEvaluations),
      isCorrect: Math.random() > 0.4, // 約60%の正答率
      timeTakenMs: getRandomInt(5000, 60000), // 5秒から60秒
    });
  }

  return {
    attemptedAt: attemptedAt,
    results: results,
  };
}

/**
 * LearningCycleのダミーデータを生成します。
 */
export function generateDummyLearningCycle(): LearningCycle {
  const subjects: LearningCycle['subject'][] = [
    'japanese',
    'math',
    'science',
    'socialStudies',
    'english',
  ];
  const subject = getRandomElement(subjects);
  const testModes: LearningCycle['testMode'][] = ['memory', 'skill'];
  const problemCount = getRandomInt(5, 20); // 5から20問
  const sessionCount = getRandomInt(1, 3); // 1から3セッション

  const textbookId = getRandomString(10);
  const unitId = getRandomString(5);
  const categoryId = getRandomString(5);

  const problems: LearningCycle['problems'] = [];
  for (let i = 0; i < problemCount; i++) {
    problems.push({
      index: i,
      unitId: unitId,
      categoryId: categoryId,
      problemNumber: getRandomInt(1, 99),
    });
  }

  const units: LearningCycle['units'] = [
    {
      id: unitId,
      name: `${subject} Unit ${getRandomInt(1, 10)}`,
      subject: subject,
      textbookIds: [textbookId],
    },
  ];

  const categories: LearningCycle['categories'] = [
    {
      id: categoryId,
      name: `Category ${getRandomString(4)}`,
      subject: subject,
      textbookIds: [textbookId],
    },
  ];

  const sessions: LearningCycle['sessions'] = [];
  for (let i = 0; i < sessionCount; i++) {
    sessions.push(generateDummyTestSession(problemCount));
  }

  const cycleStartAt = createRandomFirestoreTimestamp();

  let latestAttemptedAt: DummyTimestamp;
  if (sessions.length > 0) {
    // sessionsの中で最も新しいタイムスタンプを見つける
    const latestMillis = Math.max(...sessions.map((s) => s.attemptedAt.toMillis()));
    latestAttemptedAt = createTimestampFromMillis(latestMillis);
  } else {
    latestAttemptedAt = cycleStartAt;
  }

  // nextReviewAtをlatestAttemptedAtの1〜7日後に設定
  const nextReviewAt = addDaysToTimestamp(latestAttemptedAt, getRandomInt(1, 7));

  return {
    textbookId: textbookId,
    testMode: getRandomElement(testModes),
    learningDurationMs: getRandomInt(300000, 3600000), // 5分〜1時間
    testDurationMs: getRandomInt(60000, 1800000), // 1分〜30分
    problems: problems,
    isReviewTarget: Math.random() > 0.5,
    cycleStartAt: cycleStartAt as Timestamp,
    subject: subject,
    textbookName: `教科書 ${getRandomInt(1, 5)}`,
    units: units,
    categories: categories,
    sessions: sessions,
    nextReviewAt: nextReviewAt as Timestamp,
    latestAttemptedAt: latestAttemptedAt as Timestamp,
  };
}

/**
 * 指定された数のLearningCycleダミーデータを生成します。
 */
export function generateMultipleLearningCycles(count: number): LearningCycle[] {
  const cycles: LearningCycle[] = [];
  for (let i = 0; i < count; i++) {
    cycles.push(generateDummyLearningCycle());
  }
  return cycles;
}
