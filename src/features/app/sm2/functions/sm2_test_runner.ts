import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  LearningCycleProblem,
  LearningCycleSession,
  LearningCycleTestResult,
  ProblemScoringStatus,
  TestSelfEvaluation,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { calculateSM2ReviewScheduleForCycle } from './calculate-sm2-schedule';

// 状態表示のためにインポート

/**
 * ダミーデータ生成のための定数
 */
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const CYCLE_START_DATE = new Date('2025-01-01T08:00:00Z').getTime(); // サイクル開始日
const CATEGORIES = ['math-basic', 'japanese-kanji', 'english-vocab', 'science-chem'];

// ----------------------------------------------------
// ✅ 新規追加: 問題生成関数
// ----------------------------------------------------

/**
 * 指定された数だけダミーの問題を生成します。
 */
function generateProblems(count: number): LearningCycleProblem[] {
  const problems: LearningCycleProblem[] = [];
  for (let i = 0; i < count; i++) {
    const index = 1000 + i;
    const categoryId = CATEGORIES[i % CATEGORIES.length]; // カテゴリを循環させる
    problems.push({
      problemIndex: index,
      unitId: `unit-${Math.floor(i / 10) + 1}`,
      problemNumber: i % 10,
      isReviewTarget: true,
      categoryId: categoryId,
    } as LearningCycleProblem);
  }
  return problems;
}

// ----------------------------------------------------
// ✅ 新規追加: ランダムセッション生成関数
// ----------------------------------------------------

/**
 * 全ての問題に対してランダムな結果を持つセッションを生成します。
 * 約80%の確率で正解、20%の確率で不正解とします。
 * TestSelfEvaluation: "notSure", "imperfect", "confident" がそれぞれ約1/3の確率で選ばれます。
 */
function generateRandomSession(
  problems: LearningCycleProblem[],
  attemptedAt: number
): LearningCycleSession {
  const results: LearningCycleTestResult[] = problems.map((problem) => {
    // 80%の確率で正解 ('correct')、20%の確率で不正解 ('incorrect')
    const scoringStatus: ProblemScoringStatus = Math.random() < 0.7 ? 'correct' : 'incorrect';

    // 自己評価 (1/3 ずつ均等に選択)
    const rand = Math.random();
    let selfEvaluation: TestSelfEvaluation;

    if (rand < 1 / 3) {
      selfEvaluation = 'notSure' as TestSelfEvaluation;
    } else if (rand < 2 / 3) {
      selfEvaluation = 'imperfect' as TestSelfEvaluation;
    } else {
      selfEvaluation = 'confident' as TestSelfEvaluation;
    }

    // 解答時間 (3000ms ± 1500ms)
    const timeSpentMs = Math.floor(3000 + (Math.random() - 0.5) * 3000);

    return {
      problemIndex: problem.problemIndex,
      timeSpentMs: timeSpentMs,
      selfEvaluation: selfEvaluation,
      scoringStatus: scoringStatus,
    } as LearningCycleTestResult;
  });

  return {
    attemptedAt: attemptedAt,
    results: results,
  } as LearningCycleSession;
}

// ----------------------------------------------------
// ✅ 新規追加: メインのダミーサイクル生成関数
// ----------------------------------------------------

/**
 * 指定されたパラメータでLearningCycleデータ全体を生成します。
 * @param numProblems 生成する問題の数
 * @param numSessions 生成するセッションの数
 * @param intervalDays セッション間の平均間隔 (日数)
 */
function createCustomLearningCycle(
  numProblems: number,
  numSessions: number,
  intervalDays: number
): LearningCycle {
  const problems = generateProblems(numProblems);
  const sessions: LearningCycleSession[] = [];
  let currentTime = CYCLE_START_DATE;

  for (let i = 0; i < numSessions; i++) {
    // 平均間隔の ± 50% でランダムな時間差
    const timeDelta =
      intervalDays * MS_PER_DAY + (Math.random() - 0.5) * intervalDays * 0.5 * MS_PER_DAY;

    if (i > 0) {
      currentTime += Math.floor(timeDelta);
    }

    // 全問題を含むランダムセッションを生成
    sessions.push(generateRandomSession(problems, currentTime));
  }

  return {
    cycleStartAt: CYCLE_START_DATE,
    problems: problems,
    sessions: sessions,
  } as LearningCycle;
}

/**
 * 計算結果の復習推奨日をわかりやすい日付文字列に変換します。
 */
function formatDate(timestampMs: number): string {
  if (timestampMs === -1) return '履歴なし';
  const date = new Date(timestampMs);
  return date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}

/**
 * カスタム設定でSM-2復習スケジュール計算を実行し、結果の概要を表示します。
 */
export function runCustomSM2Test(numProblems: number, numSessions: number, intervalDays: number) {
  console.log('--- 🧪 カスタム SM-2 スケジュール計算テスト実行 ---');
  console.log(
    `[設定] 問題数: ${numProblems}, セッション数: ${numSessions}, 平均間隔: ${intervalDays}日`
  );

  const cycle = createCustomLearningCycle(numProblems, numSessions, intervalDays);
  console.log(`[情報] **サイクル開始日**: ${formatDate(cycle.cycleStartAt)}`);
  console.log(
    `[情報] **最終セッション日**: ${formatDate(cycle.sessions[cycle.sessions.length - 1].attemptedAt)}`
  );

  const totalAttempts = numProblems * numSessions;
  console.log(`[情報] **合計試行回数**: ${totalAttempts}`);

  // 復習推奨日を計算
  const schedule = calculateSM2ReviewScheduleForCycle(cycle);

  // 最終的な計算結果の概要を表示
  console.log('\n--- 📊 問題ごとの復習推奨日の概要 ---');

  const sampleCount = Math.min(numProblems, 5); // 最大5問のサンプルを表示

  for (let i = 0; i < sampleCount; i++) {
    const problem = cycle.problems[i];
    const index = problem.problemIndex;
    const nextDateMs = schedule[index];
    const nextDateStr = formatDate(nextDateMs ?? 0);

    console.log(`  * **問題 ${index}** (${problem.categoryId}): 推奨日: ${nextDateStr}`);
  }

  if (numProblems > sampleCount) {
    console.log(`  ... 他 ${numProblems - sampleCount} 件の問題 ...`);
  }

  // 履歴なしの問題の有無を確認 (このテストケースでは全て履歴を持つはず)
  const noHistoryCount = cycle.problems.filter((p) => schedule[p.problemIndex] === -1).length;
  if (noHistoryCount > 0) {
    console.log(`\n**注**: 履歴なしと判定された問題が ${noHistoryCount} 件あります。`);
  }

  // 基準時間に関するコメント
  console.log('\n--- 💡 補足情報 ---');
  console.log('  * 全ての問題がランダムな結果を持つため、EFは収束せずバラける傾向があります。');
  console.log(
    '  * 復習推奨日 (Next Review Date) は、最終セッション日から **E-Factor x Interval** 日後として計算されます。'
  );
}

// ----------------------------------------------------
// ✅ 実行例: 50問を10セッション、平均3日おきに学習したケース
// ----------------------------------------------------
// runCustomSM2Test(50, 10, 3);
