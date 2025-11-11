import { LearningCycleDocument } from '@/shared/data/documents/learning-cycle/learning-cycle-document';
import { getDaysDifference } from '@/shared/utils/datetime/datetime-compare-utils';
import { isToday } from '@/shared/utils/datetime/datetime-utils';

interface FilterOptions {
  todayReview: boolean;
  todayReviewed: boolean;
  todayStarted: boolean;
}

interface FilteredCycles {
  todayReviewCycles: LearningCycleDocument[];
  todayReviewedCycles: LearningCycleDocument[];
  todayStartedCycles: LearningCycleDocument[];
}

interface DateGroupedCycles {
  todayReviewCycles: LearningCycleDocument[];
  todayReviewedCycles: LearningCycleDocument[];
}

export const filterLearningCycles = (
  learningCycles: LearningCycleDocument[],
  includeNotReviewTarget: FilterOptions = {
    todayReview: false,
    todayReviewed: false,
    todayStarted: false,
  }
): FilteredCycles => {
  const initialAccumulator: FilteredCycles = {
    todayReviewCycles: [],
    todayReviewedCycles: [],
    todayStartedCycles: [],
  };

  return learningCycles.reduce((acc, cycle) => {
    const isReviewTarget = cycle.isReviewTarget;

    // ヘルパー関数: レビュー対象外を含めるかどうかを判定
    // includeNotReviewTargetがtrueなら、isReviewTargetの値に関わらず含める (true)
    // includeNotReviewTargetがfalseなら、isReviewTargetがtrueの場合のみ含める
    const shouldInclude = (includeOption: boolean) => includeOption || isReviewTarget;

    // 1. 本日レビュー予定 (Today Review Cycles) の判定
    if (cycle.nextReviewDate && isToday(cycle.nextReviewDate)) {
      if (shouldInclude(includeNotReviewTarget.todayReview)) {
        acc.todayReviewCycles.push(cycle);
      }
    }

    // 2. 本日レビュー済み (Today Reviewed Cycles) の判定
    if (cycle.latestAttemptedAt && isToday(cycle.latestAttemptedAt)) {
      // 初回のときはReviewとみなさないので除外
      if (shouldInclude(includeNotReviewTarget.todayReviewed) && cycle.sessions.length > 1) {
        acc.todayReviewedCycles.push(cycle);
      }
    }

    // 3. 本日開始 (Today Started Cycles) の判定
    if (cycle.cycleStartAt && isToday(cycle.cycleStartAt)) {
      if (shouldInclude(includeNotReviewTarget.todayStarted)) {
        acc.todayStartedCycles.push(cycle);
      }
    }

    return acc;
  }, initialAccumulator);
};

/**
 * 渡されたサイクルを日付の差（日数）に基づいて分類し直します。
 * すべての日付差をキーとして網羅したレコードを返します。
 *
 * @param filteredCycles - 元の Today Review/Reviewed/Started Cycles
 * @returns 日数差をキーとした分類結果のレコード
 */
export const groupCyclesByAllDateDifferences = (
  filteredCycles: Omit<FilteredCycles, 'todayStartedCycles'>
): Record<number, DateGroupedCycles> => {
  const now = Date.now(); // 基準となる「今日」のタイムスタンプ

  // 最終的な結果を格納するオブジェクト
  const result: Record<number, DateGroupedCycles> = {};

  // ヘルパー関数: 特定の日付差の配列を初期化または取得
  const getOrCreateDayGroup = (dayDiff: number): DateGroupedCycles => {
    if (!result[dayDiff]) {
      result[dayDiff] = {
        todayReviewCycles: [],
        todayReviewedCycles: [],
      };
    }
    return result[dayDiff];
  };

  // 1. Today Review Cycles (latestAttemptedAtとの差) を分類
  // 要件: today - latestAttemptedAt = dayDiff
  filteredCycles.todayReviewCycles.forEach((cycle) => {
    if (!cycle.latestAttemptedAt) return;

    // getDaysDifference(timestampB, timestampA) を利用
    const dayDiff = getDaysDifference(now, cycle.latestAttemptedAt);

    getOrCreateDayGroup(dayDiff).todayReviewCycles.push(cycle);
  });

  // 2. Today Reviewed Cycles (nextReviewDateとの差) を分類
  // 要件: nextReviewDate - today = dayDiff
  filteredCycles.todayReviewedCycles.forEach((cycle) => {
    if (!cycle.nextReviewDate) return;

    // getDaysDifference(timestampB, timestampA) を利用
    const dayDiff = getDaysDifference(cycle.nextReviewDate, now);

    getOrCreateDayGroup(dayDiff).todayReviewedCycles.push(cycle);
  });

  return result;
};
