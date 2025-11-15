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

const generateKey = (cycle: LearningCycle, problem: LearningCycleProblem) => {
  return `${cycle.textbookId}_${problem.unitId ?? DEFAULT_UNIT_ID}_${problem.categoryId ?? DEFAULT_CATEGORY_ID}_${problem.problemNumber}`;
};

/**
 * 学習サイクル内の全てのテスト結果を、問題の一意なキーでグループ化します。
 *
 * @param learningCycles 学習サイクルの配列
 * @returns 問題キーをキーとし、結果の配列を値とするオブジェクト
 */
export const groupingResultsByProblem = (
  learningCycles: LearningCycle[]
): Record<string, LearningCycleTestResult[]> => {
  // 最終的なグループ化された結果を保持するマップ。
  // 値は LearningCycleTestResult の配列のみ
  const resultsMap: Record<string, LearningCycleTestResult[]> = {};

  learningCycles.forEach((cycle) => {
    // サイクル内の問題をインデックスでルックアップできるようにマップ化
    // NOTE: problemIndexをキーとする前提で修正
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
          resultsMap[key].push(result);
        } else {
          resultsMap[key] = [result];
        }
      });
    });
  });

  return resultsMap;
};

type ScoringStatus = 'unrated' | 'correct' | 'incorrect';

// デフォルトの正誤判定関数
const defaultGetScoringStatus = (result: LearningCycleTestResult): ScoringStatus => {
  // LearningCycleTestResultにscoringStatusプロパティがあることを前提とする
  return result.scoringStatus;
};

/**
 * グループ化された問題データに基づき、問題ごとの平均正解率を計算します。
 *
 * @param groupedResults 問題キーをキーとし、関連するテスト結果の配列を値とするオブジェクト
 * @param getScoringStatus スコアリングステータスを取得するためのカスタム関数。指定がない場合はデフォルト関数を使用
 * @returns 問題キーをキーとし、平均正解率 (0.0 から 1.0) を値とするオブジェクト
 */
export const calculateAvgCorrectRate = (
  groupedResults: Record<string, LearningCycleTestResult[]>, // 型を修正
  getScoringStatus: (result: LearningCycleTestResult) => ScoringStatus = defaultGetScoringStatus
): Record<string, number> => {
  const avgCorrectRates: Record<string, number> = {};

  for (const key in groupedResults) {
    if (Object.prototype.hasOwnProperty.call(groupedResults, key)) {
      // 値が LearningCycleTestResult[] に変わったため、変数名を resultsList に変更
      const resultsList = groupedResults[key];

      let correctCount = 0;
      let ratedCount = 0; // 'correct' または 'incorrect' の試行回数 (分母)

      resultsList.forEach((result) => {
        // problemGroup.results から resultsList に変更
        const status = getScoringStatus(result);

        if (status === 'correct') {
          correctCount++;
          ratedCount++;
        } else if (status === 'incorrect') {
          ratedCount++;
        } // 'unrated' の場合は何もせず、カウントに影響を与えない
      }); // 平均正解率を計算

      if (ratedCount > 0) {
        avgCorrectRates[key] = correctCount / ratedCount;
      } else {
        avgCorrectRates[key] = 0.0;
      }
    }
  }

  return avgCorrectRates;
};

/**
 * LearningCycle内の問題インデックスと、問題グループ化キーの対応マップを作成します。
 * * @param cycle LearningCycle単体オブジェクト
 * @returns problemIndexをキー、問題グループ化キーを値とするオブジェクト
 */
export const mapProblemIndexToGroupKey = (cycle: LearningCycle): Record<string, string> => {
  const problemKeyMap: Record<string, string> = {};

  cycle.problems.forEach((problem: LearningCycleProblem) => {
    // 1. problemIndexをキーとして取得
    const index = problem.problemIndex;

    // 2. groupingResultsByProblemで使用される一意なキーを作成
    // 形式: `${cycle.textbookId}_${problem.unitId}_${problem.categoryId}_${problem.problemNumber}`
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

interface ProblemData {
  key: string;
  textbookId: string;
  unitId: string;
  unit: UnitDetail;
  unitName: string;
  categoryId: string;
  category: CategoryDetail;
  categoryName: string;
  problemNumber: number;
  correctnessRate: number;
}

// 最終的なデータ構造を作成する関数（例）
export const createProblemDataArray = (
  learningCycles: LearningCycle[],
  unitMapData?: Record<string, UnitDetail>,
  categoryMapData?: Record<string, CategoryDetail>
): ProblemData[] => {
  const unitMap = unitMapData ?? createUnitMap(learningCycles);
  const categoryMap = categoryMapData ?? createCategoryMap(learningCycles);

  // 1. グループ化
  const groupedResults = groupingResultsByProblem(learningCycles);

  // 2. 正解率計算
  const avgRates = calculateAvgCorrectRate(groupedResults);

  const problemBaseMap = mapGroupKeyToProblemBase(learningCycles);

  return Object.values(problemBaseMap).map((problem) => {
    return {
      ...problem,
      unit: unitMap[problem.unitId],
      unitName: unitMap[problem.unitId].name,
      category: categoryMap[problem.categoryId],
      categoryName: categoryMap[problem.categoryId].name,
      correctnessRate: avgRates[problem.key],
    };
  });
};
