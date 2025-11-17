import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { LearningCycleSession } from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { WEIGHTS } from '../constants/ex-weights';
import { PLANT_GROWTH_PX_MAP } from '../constants/plant-growth-xp';
import { XPResults } from '../types/xp-types';
import { calculateXPCorrectness } from './correctness';
import { calculateXPQuality } from './quality';

export type XPSession = Pick<LearningCycleSession, 'results' | 'attemptedAt'>;

export const calculateTotalXPWithLearningCycle = (
  learningCycle: LearningCycleDocument,
  newSession?: XPSession,
  nextPlantStage?: number | null | undefined // nullの場合だけ成長しない
) => {
  const sessions =
    newSession && learningCycle.sessions
      ? [...learningCycle.sessions, newSession]
      : (learningCycle.sessions ?? []);
  const learningDurationMs = sessions.length === 1 ? learningCycle.learningDurationMs : 0;

  return calculateTotalXP({
    sessions,
    testDurationMs: learningCycle.testDurationMs,
    learningDurationMs,
    nextPlantStage:
      nextPlantStage === undefined ? learningCycle.plant.currentStage : nextPlantStage,
  });
};

export function calculateTotalXP({
  sessions,
  testDurationMs,
  learningDurationMs,
  nextPlantStage,
}: {
  sessions: XPSession[];
  testDurationMs: number;
  learningDurationMs: number;
  nextPlantStage: number | null; // 成長しない場合null
}): XPResults | null {
  // 🚨 1. sessionsが空のチェック (既存)
  if (!sessions || sessions.length === 0) {
    return null;
  } // あまりにも長い時間が入力されないよう制限 (既存)

  testDurationMs = Math.min(testDurationMs, WEIGHTS.MAX_TEST_DURATION_MS);
  learningDurationMs = Math.min(learningDurationMs, WEIGHTS.MAX_LEANING_DURATION_MS);

  const utilsResult = calculateUtils({
    sessions,
    learningDurationMs,
  });
  // calculateUtilsがnullを返す可能性は現状ありませんが、将来の変更に備えチェックを推奨
  // 現在の実装ではnullを返さないため、このチェックは一旦省略できますが、防御的プログラミングとして有効です。

  const { session, correctRate, totalTestTimeSpendMs, totalTestTimeSpendMin, avgCorrectRatePast } =
    utilsResult;

  const totalProblems = session.results ? session.results.length : 0; // 🚨 3. 最新セッションに問題がない場合のチェック (既存)

  if (totalProblems === 0) {
    return null;
  }

  let totalXP = 0; // --- B. 4つのXP要素の重み付けと合計 ---
  // 1. XP_時間 (勉強時間)

  const baseXpLearningTime = calculateXPLearningTime(learningDurationMs);
  const xpLearningTime = baseXpLearningTime * (WEIGHTS.W_LEARNING_TIME ?? 1); // 🚨 重みのnull/undefinedチェック
  totalXP += xpLearningTime; // 2. XP_正答率 (成果)

  const correctnessCalcResult = calculateXPCorrectness({
    correctRate,
    avgCorrectRatePast,
    testDurationMs,
    totalTestTimeSpendMs,
  }); // 🚨 4. calculateXPCorrectnessの結果および内部プロパティのチェック
  if (!correctnessCalcResult || typeof correctnessCalcResult.baseXpCorrectness !== 'number') {
    // ログ出力やエラー通知などを行う
    console.error('Error: calculateXPCorrectness failed or returned invalid data.');
    return null;
  }
  const xpCorrectness = correctnessCalcResult.baseXpCorrectness * (WEIGHTS.W_CORRECTNESS ?? 1);
  totalXP += xpCorrectness; // 4. XP_質 (自己評価と効率)

  const qualityCalcResult = calculateXPQuality({
    totalTestTimeSpendMin,
    session,
    totalProblems,
    totalTestTimeSpendMs,
  }); // 🚨 5. calculateXPQualityの結果および内部プロパティのチェック
  if (!qualityCalcResult || typeof qualityCalcResult.baseXpQuality !== 'number') {
    // ログ出力やエラー通知などを行う
    console.error('Error: calculateXPQuality failed or returned invalid data.');
    return null;
  }
  const xpQuality = qualityCalcResult.baseXpQuality * (WEIGHTS.W_QUALITY ?? 1);
  totalXP += xpQuality; // 3. XP_成長 (プラント成長)
  // calculateXPPlantGrowthには?? 0による防御的処理が組み込まれている (既存)

  const xpPlantGrowth = calculateXPPlantGrowth(nextPlantStage);
  totalXP += xpPlantGrowth;

  // 🚨 6. 最終結果の構造チェック（Optional: 必須ではないが、防御的）
  if (typeof totalXP !== 'number' || isNaN(totalXP)) {
    console.error('Error: Final totalXP calculation resulted in an invalid number.');
    return null;
  }

  return {
    ...correctnessCalcResult,
    ...qualityCalcResult,
    correctRate,
    xpLearningTime,
    xpCorrectness,
    xpQuality,
    xpPlantGrowth,
    floatTotalXP: totalXP,
    totalXP: Math.floor(totalXP),
  };
}

export function calculateXPLearningTime(learningDurationMs: number) {
  // 分にしたものがそのままxpに
  return learningDurationMs / 60000;
}

export function calculateXPPlantGrowth(nextPlantStage: number | null) {
  return nextPlantStage !== null ? (PLANT_GROWTH_PX_MAP[nextPlantStage] ?? 0) : 0;
}
/**
 * LearningCycleSessionの配列から、平均正解率（パーセンテージ）を計算します。
 * unratedの問題を試行問題数に含め、不正解として扱うかどうかをフラグで制御します。
 *
 * @param sessions LearningCycleSessionの配列
 * @param includeUnratedAsIncorrect unratedの問題を試行問題数に含め、不正解（incorrect）として扱う場合は true
 * @returns 平均正解率（0から100のパーセンテージ）。試行問題がない場合は0を返します。
 */
function calculateAverageCorrectnessRate(
  sessions: XPSession[],
  includeUnratedAsIncorrect: boolean
): number {
  let totalCorrect = 0;
  let totalAttempts = 0;

  // 全セッションを反復処理
  sessions.forEach((session) => {
    // 各セッション内の結果を反復処理
    session.results.forEach((result) => {
      const status = result.scoringStatus;

      if (status === 'correct') {
        // 1. 正解の場合: 試行問題数と正解数の両方をカウント
        totalAttempts++;
        totalCorrect++;
      } else if (status === 'incorrect') {
        // 2. 不正解の場合: 試行問題数のみカウント
        totalAttempts++;
      } else if (status === 'unrated') {
        // 3. 未採点の場合: フラグに基づいて処理
        if (includeUnratedAsIncorrect) {
          // フラグが true の場合、試行問題数に含め、不正解として扱う
          totalAttempts++;
          // totalCorrect はインクリメントしないため、不正解として扱われる
        }
        // フラグが false の場合、totalAttemptsもtotalCorrectもインクリメントしない
      }
    });
  });

  // 試行問題がない場合は、平均正解率は 0%
  if (totalAttempts === 0) {
    return 0;
  }

  // 平均正解率を計算 (正解数 / 試行問題数) * 100
  const correctnessRate = (totalCorrect / totalAttempts) * 100;

  return correctnessRate;
}

function calculateUtils({
  sessions,
  learningDurationMs,
}: {
  sessions: XPSession[];
  learningDurationMs: number;
}) {
  const sortedSessions = sessions.sort((a, b) => a.attemptedAt - b.attemptedAt);
  const initial = sortedSessions.slice(0, -1);
  const session = sortedSessions[sortedSessions.length - 1];

  const avgCorrectRatePast = calculateAverageCorrectnessRate(initial, true);

  const totalProblems = session.results.length;
  // totalProblems === 0 のケースは呼び出し元 (calculateTotalXP) で処理済み

  // --- A. 基本データの集計 ---
  const correctCount = session.results.filter((r) => r.scoringStatus === 'correct').length;
  const totalTestTimeSpendMs = Math.min(
    session.results.reduce((sum, r) => sum + r.timeSpentMs, 0),
    WEIGHTS.MAX_TEST_DURATION_MS
  );

  const learningDurationMin = learningDurationMs / 60000;
  const correctRate = correctCount / totalProblems;
  const totalTestTimeSpendMin = totalTestTimeSpendMs / 60000;

  return {
    session,
    avgCorrectRatePast,
    learningDurationMin,
    correctRate,
    totalTestTimeSpendMs,
    totalTestTimeSpendMin,
  };
}
