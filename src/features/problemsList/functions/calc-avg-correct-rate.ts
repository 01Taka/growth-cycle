import { calculateReviewNecessity } from '@/features/app/review-necessity/functions/calc-necessity';
import { ProblemListItemData } from '@/features/learningHistory/types/problem-list-types';
import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  CategoryDetail,
  LearningCycleTestResult,
  UnitDetail,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import {
  createCategoryMap,
  createTextbookNameMap,
  createUnitMap,
  groupResultsByProblemWithAttemptAt,
  mapGroupKeyToMS2State,
  mapGroupKeyToProblemBase,
} from './cycles-to-map';

type ScoringStatus = 'unrated' | 'correct' | 'incorrect';

// デフォルトの正誤判定関数
const defaultGetScoringStatus = (result: LearningCycleTestResult): ScoringStatus => {
  // LearningCycleTestResultにscoringStatusプロパティがあることを前提とする
  const necessity = calculateReviewNecessity(result.selfEvaluation, result.scoringStatus);
  if (necessity.level === -1) return 'unrated';
  return necessity.level > 1 ? 'incorrect' : 'correct';
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

// 最終的なデータ構造を作成する関数（例）
export const createProblemDataArray = (
  learningCycles: LearningCycle[],
  unitMapData?: Record<string, UnitDetail>,
  categoryMapData?: Record<string, CategoryDetail>
): ProblemListItemData[] => {
  const unitMap = unitMapData ?? createUnitMap(learningCycles);
  const categoryMap = categoryMapData ?? createCategoryMap(learningCycles);
  const textbookNameMap = createTextbookNameMap(learningCycles);

  // 1. グループ化
  const groupedResults = groupResultsByProblemWithAttemptAt(learningCycles);

  // 2. 正解率計算
  const avgRates = calculateAvgCorrectRate(groupedResults);

  const problemBaseMap = mapGroupKeyToProblemBase(learningCycles);
  const sm2StateMap = mapGroupKeyToMS2State(learningCycles);

  return Object.values(problemBaseMap).map((problem) => {
    return {
      ...problem,
      ...sm2StateMap[problem.key],
      textbookName: textbookNameMap[problem.textbookId],
      unit: unitMap[problem.unitId],
      unitName: unitMap[problem.unitId]?.name ?? '',
      category: categoryMap[problem.categoryId],
      categoryName: categoryMap[problem.categoryId]?.name ?? '',
      correctnessRate: avgRates[problem.key],
    };
  });
};
