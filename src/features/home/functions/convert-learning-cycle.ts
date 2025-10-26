import { LearningCycle } from '@/shared/types/learning-cycle-types';
import { getDaysDifference } from '@/shared/utils/datetime/datetime-compare-utils';
import { formatLearningSettings } from '@/shared/utils/format/formant-learning-settings';
import { ReviewLearningCycleItemProps } from '../components/review/shared-types';
import { getDeterministicRandom } from './deterministic-random';

const MAX_PLANT_INDEX = 16;
const MILLISECONDS_PER_MINUTE = 60_000;

/**
 * LearningCycleの配列を、daysDifferenceをキーとしたReviewLearningCycleItemPropsのマップに変換する。
 * @param cycles 処理する学習サイクル（LearningCycle）の配列
 * @returns daysDifferenceをキーとするレビューアイテムのマップ
 */
export const convertLearningCyclesToReviewItemMap = (
  cycles: LearningCycle[]
): Record<number, ReviewLearningCycleItemProps[]> => {
  const reviewItemMap: Record<number, ReviewLearningCycleItemProps[]> = {};

  for (const cycle of cycles) {
    // レビュー対象でないサイクルはスキップ
    if (!cycle.isReviewTarget) {
      continue;
    }

    // 教科書IDに基づいた決定論的な乱数で植物のインデックスを決定
    const random = getDeterministicRandom(cycle.textbookId);
    const plantIndex = Math.floor(random * MAX_PLANT_INDEX);

    const learningSettings = formatLearningSettings(cycle.settings);
    const unitNames = Object.values(learningSettings.unitMap);

    // 最後に学習を試みた日時との差分を計算。0日差なら完了済みとみなす。
    const differenceFromLastAttempted = getDaysDifference(cycle.latestAttemptedAt.toMillis());

    const item: ReviewLearningCycleItemProps = {
      isCompleted: differenceFromLastAttempted === 0,
      plantIndex,
      subject: cycle.subject,
      unitNames,
      testDurationMin: Math.floor(learningSettings.testDurationMs / MILLISECONDS_PER_MINUTE),
      // cycleStartAtをアイテムに追加（二次ソートに使用）
      cycleStartAt: cycle.cycleStartAt,
    };

    // サイクル開始日時との差分をキーとする
    const differenceFromCycleStart = getDaysDifference(cycle.cycleStartAt.toMillis());

    if (reviewItemMap[differenceFromCycleStart]) {
      reviewItemMap[differenceFromCycleStart].push(item);
    } else {
      reviewItemMap[differenceFromCycleStart] = [item];
    }
  }

  return reviewItemMap;
};

interface ReviewCount {
  daysDifference: number;
  total: number;
  completed: number;
  incompleted: number;
}

type GetReviewCount = (daysDifference: number) => ReviewCount;

/**
 * レビューマップから、指定されたdaysDifferenceのレビュー数（合計、完了、未完了）を取得する関数を生成する。
 * @param reviewMap daysDifference をキーとする ReviewLearningCycleItemProps[] のマップ
 * @returns daysDifference を引数に取り、対応するReviewCountを返す関数
 */
export const createReviewCountGetter = (
  reviewMap: Record<number, ReviewLearningCycleItemProps[]>
): GetReviewCount => {
  const counts: Record<number, ReviewCount> = {};

  // マップを事前に集計してキャッシュする
  for (const [key, value] of Object.entries(reviewMap)) {
    const daysDifference = Number(key);
    const completedCount = value.filter((item) => item.isCompleted).length;

    const result: ReviewCount = {
      daysDifference,
      total: value.length,
      completed: completedCount,
      incompleted: value.length - completedCount,
    };
    counts[daysDifference] = result;
  }

  // 取得関数を返す
  return (daysDifference: number): ReviewCount => {
    if (daysDifference in counts) {
      return counts[daysDifference];
    }

    // データがない場合は0で初期化されたオブジェクトを返す
    return {
      daysDifference,
      total: 0,
      completed: 0,
      incompleted: 0,
    };
  };
};

/**
 * daysDifference (number) をキー、ReviewLearningCycleItemProps[] を値とするマップの型定義
 */
type ReviewItemMap = Record<number, ReviewLearningCycleItemProps[]>;

/**
 * daysDifference を引数として、対応する ReviewLearningCycleItemProps[] を返す関数
 */
type ReviewItemGetter = (daysDifference: number) => ReviewLearningCycleItemProps[];

/**
 * レビューアイテムマップを受け取り、 daysDifference に基づいてアイテム配列を取得する関数を返す
 * 取得される配列は、
 * 1. 未完了（isCompleted: false）が先に、完了済み（isCompleted: true）が後に
 * 2. cycleStartAtが遅い（新しい）ものが後に（昇順）
 * の順にソートされる
 *
 * @param reviewMap daysDifference をキーとする ReviewLearningCycleItemProps[] のマップ
 * @returns daysDifference を引数に取り、対応する ReviewLearningCycleItemProps[] を返す関数（ソート済み）
 */
export const createReviewItemGetter = (reviewMap: ReviewItemMap): ReviewItemGetter => {
  /**
   * daysDifference に対応する ReviewLearningCycleItemProps[] を返す
   * マップにキーが存在しない場合は、空の配列 [] を返す
   */
  return (daysDifference: number): ReviewLearningCycleItemProps[] => {
    const key = daysDifference;

    if (key in reviewMap) {
      // マップから取得した配列をコピーし、複合ソートを適用
      return [...reviewMap[key]].sort((a, b) => {
        // 1. Primary Sort: isCompleted (未完了 false(0) を先に, 完了 true(1) を後に)
        const completedA = a.isCompleted ? 1 : 0;
        const completedB = b.isCompleted ? 1 : 0;
        const primarySort = completedA - completedB;

        if (primarySort !== 0) {
          return primarySort;
        }

        // 2. Secondary Sort: cycleStartAt (遅い/新しいものを後に)
        // a.cycleStartAt.toMillis() - b.cycleStartAt.toMillis() は昇順ソート
        // aのタイムスタンプが大きい（新しい）と正の値になり、aがbより後に配置される
        return a.cycleStartAt.toMillis() - b.cycleStartAt.toMillis();
      });
    }

    return [];
  };
};

export const filterTodayLearningCycles = (cycles: LearningCycle[]) => {
  return cycles.filter(
    (cycle) => cycle.isReviewTarget && getDaysDifference(cycle.latestAttemptedAt.toMillis()) === 0
  );
};
