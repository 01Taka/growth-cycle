import {
  DEFAULT_CATEGORY_ID,
  DEFAULT_UNIT_ID,
  generateProblemStructuredId,
  truncateProblemStructuredId,
} from '@/features/app/learningCycles/functions/problem-structured-id';
import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  CategoryDetail,
  LearningCycleProblem,
  UnitDetail,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { safeArrayToRecord } from '@/shared/utils/object/object-utils';
import { CycleResultWithAttemptedAt, ProblemBase } from '../../types/problem-list-types';

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
      const key = generateProblemStructuredId(cycle, problem);

      // 同じ問題が複数のサイクルに現れる場合があるが、ProblemBase情報は同じはず
      if (!problemBaseMap[key]) {
        problemBaseMap[key] = {
          key: key,
          textbookId: cycle.textbookId,
          unitId: problem.unitId ?? DEFAULT_UNIT_ID,
          categoryId: problem.categoryId ?? DEFAULT_CATEGORY_ID,
          problemNumber: problem.problemNumber,
          problemIndexInTextbook: problem.problemIndex,
        };
      }
    });
  });

  return problemBaseMap;
};

/**
 * 学習サイクル内の全てのテスト結果を、問題の一意なキーでグループ化します。
 *
 * @param learningCycles 学習サイクルの配列
 * @returns 問題キーをキーとし、結果の配列を値とするオブジェクト
 */
export const groupResultsByProblemWithAttemptAt = (
  learningCycles: LearningCycle[]
): Record<string, CycleResultWithAttemptedAt[]> => {
  // 最終的なグループ化された結果を保持するマップ。
  const resultsMap: Record<string, CycleResultWithAttemptedAt[]> = {};

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

        const key = generateProblemStructuredId(cycle, problem); // 結果配列に現在のresultを追加（初期化と追加を同時に行う）

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
  resultsByProblemKey: Record<string, CycleResultWithAttemptedAt[]>,
  levelsToKeep: number = 3
): Record<string, number> => {
  // 1. カテゴリ/ユニットレベルで時間とカウントを集計
  const totals = Object.entries(resultsByProblemKey).reduce(
    (acc, [problemKey, results]) => {
      const categoryKey = truncateProblemStructuredId(problemKey, levelsToKeep);
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
