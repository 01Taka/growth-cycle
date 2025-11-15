import { calculateSM2Quality } from '@/features/app/sm2/functions/calculate-sm2-quality';
import { calculateSM2State } from '@/features/app/sm2/functions/calculate-sm2-state';
import { SM2State } from '@/features/app/sm2/types/sm2-types';
import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  CategoryDetail,
  LearningCycleProblem,
  LearningCycleTestResult,
  UnitDetail,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { safeArrayToRecord } from '@/shared/utils/object/object-utils';

const DEFAULT_UNIT_ID = 'unitId';
const DEFAULT_CATEGORY_ID = 'categoryId';
const KEY_SEPARATOR = '_';

/**
 * 問題グループ化のためのキーを生成します。
 * 形式: `${cycle.textbookId}${KEY_SEPARATOR}${problem.unitId}${KEY_SEPARATOR}${problem.categoryId}${KEY_SEPARATOR}${problem.problemNumber}`
 */
const generateKey = (cycle: LearningCycle, problem: LearningCycleProblem) => {
  return `${cycle.textbookId}${KEY_SEPARATOR}${problem.unitId ?? DEFAULT_UNIT_ID}${KEY_SEPARATOR}${problem.categoryId ?? DEFAULT_CATEGORY_ID}${KEY_SEPARATOR}${problem.problemNumber}`;
};

/**
 * 問題グループ化のためのキーから、指定した階層以降を削除して返します。
 * キーの形式: `${textbookId}_${unitId}_${categoryId}_${problemNumber}`
 *
 * @param key generateKeyで生成されたキー文字列
 * @param levelsToKeep 保持したい要素の数 (例: 1 = textbookIdのみ, 2 = textbookId_unitId, 3 = textbookId_unitId_categoryId)
 * @returns 削除後のキー文字列
 */
const truncateKey = (key: string, levelsToKeep: number): string => {
  // KEY_SEPARATOR でキーを分割
  const parts = key.split(KEY_SEPARATOR);
  const truncatedParts = parts.slice(0, levelsToKeep);
  // KEY_SEPARATOR で結合
  return truncatedParts.join(KEY_SEPARATOR);
};

/**
 * LearningCycle内の問題インデックスと、問題グループ化キーの対応マップを作成します。
 * @param cycle LearningCycle単体オブジェクト
 * @returns problemIndexをキー、問題グループ化キーを値とするオブジェクト
 */
export const mapProblemIndexToGroupKey = (cycle: LearningCycle): Record<string, string> => {
  const problemKeyMap: Record<string, string> = {};

  cycle.problems.forEach((problem: LearningCycleProblem) => {
    // 1. problemIndexをキーとして取得
    const index = problem.problemIndex;

    // 2. 問題グループ化に使用される一意なキーを作成
    const groupKey = generateKey(cycle, problem);

    // 3. マップに格納
    problemKeyMap[index] = groupKey;
  });

  return problemKeyMap;
};

interface ProblemBase {
  key: string;
  textbookId: string;
  unitId: string;
  categoryId: string;
  problemNumber: number;
}

/**
 * 全ての学習サイクルから、問題のメタデータを抽出し、グループキーをキーとするマップを作成します。
 *
 * @param learningCycles 学習サイクルの配列
 * @returns グループキーをキー、ProblemBaseを値とするオブジェクト
 */
export const mapGroupKeyToProblemBase = (
  learningCycles: LearningCycle[]
): Record<string, ProblemBase> => {
  const problemBaseMap: Record<string, ProblemBase> = {};

  learningCycles.forEach((cycle) => {
    cycle.problems.forEach((problem) => {
      // groupingResultsByProblemと同じロジックでキーを作成
      const key = generateKey(cycle, problem);

      // 同じ問題が複数のサイクルに現れる場合があるが、ProblemBase情報は同じはず
      if (!problemBaseMap[key]) {
        problemBaseMap[key] = {
          key: key,
          textbookId: cycle.textbookId,
          unitId: problem.unitId ?? DEFAULT_UNIT_ID,
          categoryId: problem.categoryId ?? DEFAULT_CATEGORY_ID,
          problemNumber: problem.problemNumber,
        };
      }
    });
  });

  return problemBaseMap;
};

type ResultWithAttemptedAt = LearningCycleTestResult & { attemptedAt: number };

/**
 * 学習サイクル内の全てのテスト結果を、問題の一意なキーでグループ化します。
 *
 * @param learningCycles 学習サイクルの配列
 * @returns 問題キーをキーとし、結果の配列を値とするオブジェクト
 */
export const groupResultsByProblemWithAttemptAt = (
  learningCycles: LearningCycle[]
): Record<string, ResultWithAttemptedAt[]> => {
  // 最終的なグループ化された結果を保持するマップ。
  const resultsMap: Record<string, ResultWithAttemptedAt[]> = {};

  learningCycles.forEach((cycle) => {
    // サイクル内の問題をインデックスでルックアップできるようにマップ化
    const problemMap: Record<string, LearningCycleProblem> = safeArrayToRecord(
      cycle.problems,
      'problemIndex' // 問題オブジェクト内のインデックスキーを使用
    );

    cycle.sessions.forEach((session) => {
      session.results.forEach((result) => {
        const problem = problemMap[result.problemIndex];

        if (!problem) return; // 問題が見つからない場合はスキップ
        // 問題を一意に識別するキーを作成

        const key = generateKey(cycle, problem); // 結果配列に現在のresultを追加（初期化と追加を同時に行う）

        if (resultsMap[key]) {
          resultsMap[key].push({ ...result, attemptedAt: session.attemptedAt });
        } else {
          resultsMap[key] = [{ ...result, attemptedAt: session.attemptedAt }];
        }
      });
    });
  });

  return resultsMap;
};

export const calculateAvgTimeMap = (
  resultsByProblemKey: Record<string, ResultWithAttemptedAt[]>,
  levelsToKeep: number = 3
): Record<string, number> => {
  // 1. カテゴリ/ユニットレベルで時間とカウントを集計
  const totals = Object.entries(resultsByProblemKey).reduce(
    (acc, [problemKey, results]) => {
      const categoryKey = truncateKey(problemKey, levelsToKeep);
      const categoryTotal = acc[categoryKey] || { totalTime: 0, count: 0 };

      results.forEach((result) => {
        categoryTotal.totalTime += result.timeSpentMs;
        categoryTotal.count += 1;
      });

      acc[categoryKey] = categoryTotal;
      return acc;
    },
    {} as Record<string, { totalTime: number; count: number }>
  );

  // 2. 平均時間を計算
  const avgTimeMap: Record<string, number> = {};
  for (const [key, { totalTime, count }] of Object.entries(totals)) {
    avgTimeMap[key] = count > 0 ? totalTime / count : 0;
  }

  return avgTimeMap;
};

export type ProblemSM2CalculationResult = SM2State & {
  /**
   * 最後にこの問題に解答したときのタイムスタンプ (ミリ秒)。
   * (結果のデータからソートして取得された値)
   */
  lastAttemptedAt: number;

  /**
   * SM-2の間隔に基づいて次に復習を推奨するタイムスタンプ (ミリ秒)。
   * 計算式: lastAttemptedAt + interval * 24 * 60 * 60 * 1000
   */
  nextAttemptTimestamp: number;

  /**
   * 次の復習推奨時刻と現在の時刻 (now) との差分 (ミリ秒)。
   * 計算式: nextAttemptTimestamp - now
   * (値が負の場合、復習期限を過ぎています)
   */
  differenceFromNextAttempt: number;

  lastAttemptSM2Quality: number;
};

/**
 * 個別の問題に対するSM-2の状態、タイミング、および最新の品質スコアを計算します。
 *
 * @param data 問題の全履歴 (試行時間付き)
 * @param avgTime 問題が属するカテゴリ/ユニットの平均解答時間 (ミリ秒)
 * @param now 現在の時刻 (ミリ秒)
 * @returns 計算されたProblemSM2CalculationResultオブジェクト
 */
const calculateProblemSM2Result = (
  data: ResultWithAttemptedAt[],
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
    ...sm2State,
    lastAttemptedAt,
    nextAttemptTimestamp,
    differenceFromNextAttempt,
    lastAttemptSM2Quality,
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
    const newKey = truncateKey(key, levelsToKeep);

    // 平均時間を取得
    const avgTime = avgTimeMap[newKey] ?? 0; // 平均時間が存在しない場合は安全に0とする

    // 個別計算関数を呼び出す
    const result = calculateProblemSM2Result(data, avgTime, now);

    return [key, result];
  });

  // 4. マップに変換して返す
  return Object.fromEntries(resultEntries);
};

/**
 * 複数のLearningCycleから、全ての一意なユニットIDをキーとするユニットマップを作成します。
 *
 * @param learningCycles 学習サイクルの配列
 * @returns ユニットIDをキー、ユニット情報を値とするRecord
 */
export const createUnitMap = (learningCycles: LearningCycle[]): Record<string, UnitDetail> => {
  return learningCycles.reduce(
    (acc, cycle) => {
      cycle.units.forEach((unit) => {
        // 既にキーが存在する場合はスキップ（最初に見つけたものを採用）
        if (!acc[unit.id]) {
          acc[unit.id] = unit;
        }
      });
      return acc;
    },
    {} as Record<string, UnitDetail>
  );
};

/**
 * 複数のLearningCycleから、全ての一意なカテゴリIDをキーとするカテゴリマップを作成します。
 *
 * @param learningCycles 学習サイクルの配列
 * @returns カテゴリIDをキー、カテゴリ情報を値とするRecord
 */
export const createCategoryMap = (
  learningCycles: LearningCycle[]
): Record<string, CategoryDetail> => {
  return learningCycles.reduce(
    (acc, cycle) => {
      cycle.categories.forEach((category) => {
        // 既にキーが存在する場合はスキップ（最初に見つけたものを採用）
        if (!acc[category.id]) {
          acc[category.id] = category;
        }
      });
      return acc;
    },
    {} as Record<string, CategoryDetail>
  );
};

export const createTextbookNameMap = (learningCycles: LearningCycle[]): Record<string, string> => {
  return learningCycles.reduce(
    (acc, cycle) => {
      if (!acc[cycle.textbookId]) {
        acc[cycle.textbookId] = cycle.textbookName;
      }
      return acc;
    },
    {} as Record<string, string>
  );
};
