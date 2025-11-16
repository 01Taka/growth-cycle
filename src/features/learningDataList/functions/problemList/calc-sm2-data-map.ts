import { calculateSM2Quality } from '@/features/app/sm2/functions/calculate-sm2-quality';
import { calculateSM2State } from '@/features/app/sm2/functions/calculate-sm2-state';
import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  CycleResultWithAttemptedAt,
  ProblemSM2CalculationResult,
} from '../../types/problem-list-types';
import { calculateAvgTimeMap, groupResultsByProblemWithAttemptAt } from './cycles-to-map';
import { truncateProblemListKey } from './problem-list-key-utils';

/**
 * 個別の問題に対するSM-2の状態、タイミング、および最新の品質スコアを計算します。
 *
 * @param data 問題の全履歴 (試行時間付き)
 * @param avgTime 問題が属するカテゴリ/ユニットの平均解答時間 (ミリ秒)
 * @param now 現在の時刻 (ミリ秒)
 * @returns 計算されたProblemSM2CalculationResultオブジェクト
 */
const calculateProblemSM2Result = (
  data: CycleResultWithAttemptedAt[],
  avgTime: number,
  now: number
): ProblemSM2CalculationResult => {
  // 1. データを試行時刻でソート
  const sortedData = data.sort((a, b) => a.attemptedAt - b.attemptedAt);

  // 2. 最新の試行結果を取得
  const lastAttempt = sortedData[sortedData.length - 1];

  // 3. 最新の試行時刻を決定
  const lastAttemptedAt = lastAttempt?.attemptedAt ?? 0;

  // 4. SM-2の状態を計算
  const sm2State = calculateSM2State(sortedData, avgTime);

  // 5. 最新の試行のSM-2品質を計算 (次の状態ではなく、最新の試行自体に対する品質スコア)
  const lastAttemptSM2Quality = lastAttempt
    ? calculateSM2Quality(
        lastAttempt.selfEvaluation,
        lastAttempt.scoringStatus,
        lastAttempt.timeSpentMs,
        avgTime
      )
    : -1; // データがない場合は -1

  // 6. 次の復習推奨時刻を計算
  const nextAttemptTimestamp = lastAttemptedAt + sm2State.interval * 24 * 60 * 60 * 1000;

  // 7. 現在時刻との差分を計算
  const differenceFromNextAttempt = nextAttemptTimestamp - now;

  return {
    sm2State,
    lastAttemptedAt,
    nextAttemptTimestamp,
    differenceFromNextAttempt,
    lastAttemptSM2Quality,
    avgTime,
  };
};

// 依存関数のインポートは省略

export const mapGroupKeyToMS2State = (
  learningCycles: LearningCycle[],
  levelsToKeep: number = 3,
  now = Date.now()
): Record<string, ProblemSM2CalculationResult> => {
  // 1. 全結果を問題キーでグループ化
  const group = groupResultsByProblemWithAttemptAt(learningCycles);

  // 2. カテゴリ/ユニットレベルの平均時間を計算
  const avgTimeMap = calculateAvgTimeMap(group, levelsToKeep);

  // 3. グループ化された結果をループし、新しいヘルパー関数で計算
  const resultEntries = Object.entries(group).map(([key, data]) => {
    // 問題番号を除いたキー (カテゴリ/ユニットキー) を作成
    const newKey = truncateProblemListKey(key, levelsToKeep);

    // 平均時間を取得
    const avgTime = avgTimeMap[newKey] ?? 0; // 平均時間が存在しない場合は安全に0とする

    // 個別計算関数を呼び出す
    const result = calculateProblemSM2Result(data, avgTime, now);

    return [key, result];
  });

  // 4. マップに変換して返す
  return Object.fromEntries(resultEntries);
};
