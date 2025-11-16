import { REVIEW_STAGES } from '../../constants/review-recommendation-stage-constants';
import { CycleListItemAggregatedSection } from '../../types/cycle-list-types';

/**
 * 問題リストから、各見直しステージの件数と割合を計算します。
 *
 * @param reviewItems 各問題のステージ情報を持つオブジェクトの配列
 * @returns ステージ番号をキーとし、件数と割合を持つオブジェクトのRecord
 */
function calculateStagePercentages(
  reviewItems: { reviewRecommendationStage: number; [key: string]: any }[]
): Record<number, { count: number; percentage: number }> {
  const totalItems = reviewItems.length;
  if (totalItems === 0) {
    return {};
  }

  // ステージごとの件数をカウントする
  const stageCounts: Record<number, number> = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  // ステージごとの件数を集計
  for (const item of reviewItems) {
    const stage = item.reviewRecommendationStage;
    // 定義されたステージ範囲外の値が来た場合も集計できるようにする（ただし、0-5のステージを想定）
    stageCounts[stage] = (stageCounts[stage] || 0) + 1;
  }

  const percentageResult: Record<number, { count: number; percentage: number }> = {};

  // カウントした件数から割合を計算
  for (const stage in stageCounts) {
    const stageNumber = Number(stage);
    const count = stageCounts[stage];

    // 件数が0のステージは結果に含めない
    if (count > 0) {
      percentageResult[stageNumber] = {
        count: count,
        percentage: count / totalItems, // 割合 (0.0 ～ 1.0)
      };
    }
  }

  return percentageResult;
}

/**
 * ステージごとの割合データとステージ設定定数を組み合わせて、
 * CycleListItemAggregatedSection の Record を作成します。
 *
 * @param percentages ステージごとの件数と割合を含むオブジェクト
 * @returns ステージ番号をキーとし、CycleListItemAggregatedSection を値とするRecord
 */
function createAggregatedSections(
  percentages: Record<number, { count: number; percentage: number }>
): Record<number, CycleListItemAggregatedSection> {
  // 元のステージ設定を stage をキーにした Map に変換して検索しやすくする
  const stageConfigMap = new Map<number, Omit<CycleListItemAggregatedSection, 'value'>>(
    (REVIEW_STAGES as CycleListItemAggregatedSection[]).map((config) => [config.stage, config])
  );

  const aggregatedResult: Record<number, CycleListItemAggregatedSection> = {};

  for (const stageNumberStr in percentages) {
    const stageNumber = Number(stageNumberStr);
    const { percentage } = percentages[stageNumber];

    const config = stageConfigMap.get(stageNumber);

    if (config) {
      aggregatedResult[stageNumber] = {
        ...config, // color, description, striped, stage をコピー
        value: percentage, // 計算した割合を設定
      };
    }
  }

  return aggregatedResult;
}

const STAGES = [0, 1, 2, 3, 4, 5] as const;

/**
 * @param reviewItems 各問題のステージ情報を持つオブジェクトの配列
 * @returns ステージ番号をキーとし、割合情報を持つ CycleListItemAggregatedSection を値とするRecord
 */
export function aggregateReviewStages(
  reviewItems: { reviewRecommendationStage: number; [key: string]: any }[]
): CycleListItemAggregatedSection[] {
  // 1. ステージごとの割合を計算
  const percentages = calculateStagePercentages(reviewItems);

  // 2. 割合とステージ設定を組み合わせて最終結果を作成
  const sections = createAggregatedSections(percentages);

  return STAGES.map((state) => sections[state]);
}
