import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { safeArrayToRecord } from '@/shared/utils/object/object-utils';
import { RecommendationJudgeFunction, TestOverviewInfo } from '../../types/cycle-list-types';
import { ProblemListItemData } from '../../types/problem-list-types';
import { mapProblemIndexToGroupKey } from '../problemList/problem-list-key-utils';
import { calcReviewRecommendationStage } from '../utils/calc-review-recommendation';

export const getRecommendedTestData = (
  learningCycles: LearningCycleDocument[],
  itemMap: Record<string, ProblemListItemData>,
  // 新しい引数：推奨かどうかを判定する関数
  isRecommendedJudge: RecommendationJudgeFunction
): Record<string, Record<string, ProblemListItemData>> => {
  const mapEntries = learningCycles.map((learningCycle) => {
    // 1. learningCycle内のproblemIndexとitemMapのkeyをマッピング
    const keyMap = mapProblemIndexToGroupKey(learningCycle);

    // 2. 各問題についてレコメンドステージを計算し、レコメンドされたアイテムを抽出
    const itemsWithStage = learningCycle.problems.map((problem) => {
      const key = keyMap[problem.problemIndex];
      const item = itemMap[key];
      // itemMapに存在しないキーのデータはスキップする可能性がありますが、
      // 型定義からitemは存在する前提とします。

      const stage = calcReviewRecommendationStage(
        item.differenceFromNextAttempt,
        item.lastAttemptSM2Quality
      );

      const isRecommended = isRecommendedJudge(stage, item);

      return { item, isRecommended };
    });

    // 3. 推奨されたアイテムのみをフィルタリング
    const recommendedItems = itemsWithStage.filter((data) => data.isRecommended);

    // ... (4. 以降は変更なし)

    // 4. 推奨されたアイテムの配列を作成
    const itemArray = recommendedItems.map((data) => data.item);

    // 5. itemArrayを Record<key, item> の形に変換
    const recommendedItemMap = safeArrayToRecord(itemArray, 'key');

    // 6. [learningCycle.id, recommendedItemMap] のペアを返す
    return [learningCycle.id, recommendedItemMap];
  });

  // 7. Object.fromEntriesを使って Record<learningCycleId, Record<key, item>> のオブジェクトを作成し、返す
  const recommendedTestMap = Object.fromEntries(mapEntries);

  return recommendedTestMap;
};

const getTestOverviewInfo = (
  itemsMap: Record<string, ProblemListItemData>,
  avgTimeMap?: Record<string, number>
): TestOverviewInfo => {
  const entries = Object.entries(itemsMap);
  const problemCount = entries.length;

  if (problemCount === 0) {
    return {
      problemCount: 0,
      totalTime: 0,
      avgTime: 0,
    };
  }
  const totalTime = entries.reduce((total, [key, problem]) => {
    const time = avgTimeMap?.[key] ?? problem.avgTime;

    return total + time;
  }, 0); // 初期値を 0 (number) と明示

  return {
    problemCount,
    totalTime,
    avgTime: totalTime / problemCount,
  };
};

/**
 * 学習サイクルごとのレコメンドされた問題のマップを受け取り、
 * それぞれの学習サイクルに対応するテスト概要情報（OverviewInfo）のマップを返します。
 * * @param recommendedTestsMap Record<learningCycleId, Record<key, item>> 形式のデータ
 * @param avgTimeMap 問題キーに対応する平均時間（オプション）
 * @returns Record<learningCycleId, OverviewInfo> 形式の概要情報マップ
 */
export const getTestOverviewMap = (
  recommendedTestsMap: Record<string, Record<string, ProblemListItemData>>,
  avgTimeMap?: Record<string, number>
): Record<string, TestOverviewInfo> => {
  // recommendedTestsMap のエントリを処理
  const overviewEntries = Object.entries(recommendedTestsMap).map(([learningCycleId, itemsMap]) => {
    // itemsMap（Record<key, item>）と avgTimeMap を使って概要情報を取得
    const overview = getTestOverviewInfo(itemsMap, avgTimeMap);

    // [learningCycleId, overview] のペアを返す
    return [learningCycleId, overview];
  });

  // ペアの配列から Record<learningCycleId, OverviewInfo> のオブジェクトを作成して返す
  return Object.fromEntries(overviewEntries);
};
