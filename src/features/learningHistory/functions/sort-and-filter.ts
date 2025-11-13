import { HistorySortType, LearningItem } from '../types/learning-history-types';

/**
 * データを教科でフィルタリングする純粋関数
 * @param data フィルタリング対象のデータ配列
 * @param subjectFilter フィルタリングする教科名 (nullの場合はフィルタリングしない)
 * @returns フィルタリングされたデータの配列
 */
export function filterItems(data: LearningItem[], subjectFilter: string | null): LearningItem[] {
  if (!subjectFilter) {
    return data;
  }
  // subject.name を確認してフィルタリング
  return data.filter((item) => item.data.subject === subjectFilter);
}

/**
 * データをソート基準に基づいてソートする純粋関数
 * @param data ソート対象のデータ配列
 * @param sortBy ソート基準 ('fixation', 'lastAttempt_desc', 'lastAttempt_asc')
 * @returns ソートされたデータの新しい配列
 */
export function sortItems(data: LearningItem[], sortBy: HistorySortType | null): LearningItem[] {
  if (!sortBy) {
    return data;
  }

  // 元の配列を変更しないようにコピーしてからソート
  return [...data].sort((a, b) => {
    // differenceToNextFixedReview が null かどうかを判定
    const aIsNull = a.data.differenceToNextFixedReview == null;
    const bIsNull = b.data.differenceToNextFixedReview == null;

    // --- 定着度 (fixation) ソート ---
    if (sortBy === 'fixation') {
      // differenceToNextFixedReview が null でないもの (値があるもの) を優先的に前へ
      if (aIsNull && !bIsNull) {
        return 1;
      }
      if (!aIsNull && bIsNull) {
        return -1;
      }
      // 定着度 (昇順): 小さい値 (定着度が低い) を先頭に
      return a.data.fixation - b.data.fixation;
    }

    // --- 最終取り組み日 (lastAttempt) ソート ---
    if (sortBy.startsWith('lastAttempt')) {
      // nullでないデータを優先的に前へ
      if (aIsNull && !bIsNull) return 1;
      if (!aIsNull && bIsNull) return -1;

      let result: number;

      if (sortBy === 'lastAttempt_desc') {
        // 降順: 大きい値 (日数が経っている) を先頭に
        result = b.data.differenceFromLastAttempt - a.data.differenceFromLastAttempt;
      } else {
        // 'lastAttempt_asc'
        // 昇順: 小さい値 (最近取り組んだ) を先頭に
        result = a.data.differenceFromLastAttempt - b.data.differenceFromLastAttempt;
      }

      // 同値の場合は定着度で昇順ソート
      return result !== 0 ? result : a.data.fixation - b.data.fixation;
    }

    return 0;
  });
}
