import { LearningCycle } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import {
  CategoryDetail,
  UnitDetail,
} from '@/shared/data/documents/learning-cycle/learning-cycle-support';
import { ProblemListItemData } from '../../types/problem-list-types';
import { calcReviewRecommendationStage } from '../utils/calc-review-recommendation';
import { calculateAvgCorrectRate } from './calc-avg-correct-rate';
import { mapGroupKeyToMS2State } from './calc-sm2-data-map';
import {
  createCategoryMap,
  createTextbookNameMap,
  createUnitMap,
  groupResultsByProblemWithAttemptAt,
  mapGroupKeyToProblemBase,
} from './cycles-to-map';

// 最終的なデータ構造を作成する関数
export const createProblemListItems = (
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
    const sm2State = sm2StateMap[problem.key];
    const reviewRecommendationStage = calcReviewRecommendationStage(
      sm2State.differenceFromNextAttempt,
      sm2State.lastAttemptSM2Quality
    );

    return {
      ...problem,
      ...sm2State,
      textbookName: textbookNameMap[problem.textbookId],
      unit: unitMap[problem.unitId],
      unitName: unitMap[problem.unitId]?.name ?? '',
      category: categoryMap[problem.categoryId],
      categoryName: categoryMap[problem.categoryId]?.name ?? '',
      correctnessRate: avgRates[problem.key],
      reviewRecommendationStage,
    };
  });
};
