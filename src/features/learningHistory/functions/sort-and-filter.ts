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
 * 2つの要素を比較し、differenceToNextFixedReviewプロパティに基づいてソート順序を決定します。
 * differenceToNextFixedReviewが設定されている要素が先に、値が小さいものが先に並びます。
 *
 * @param {Object} a - 比較対象の最初の要素
 * @param {Object} b - 比較対象の2番目の要素
 * @returns {number} - 負の数: aがbより先に並ぶ, 0: 順序は変わらない, 正の数: bがaより先に並ぶ
 */
const compareByDifference = (a: LearningItem, b: LearningItem) => {
  const diffA = a.data.differenceToNextFixedReview;
  const diffB = b.data.differenceToNextFixedReview;

  // 1. aにのみ値があり、bに値がない場合: aをbより後に並べる (differenceが設定されているものを優先)
  if (diffA !== null && !diffB) {
    return 1;
  }

  // 2. bにのみ値があり、aに値がない場合: aをbより先に並べる (differenceが設定されているものを優先)
  if (!diffA && diffB !== null) {
    return -1;
  }

  // 3. 両方に値があり、かつ値が異なる場合: 値が小さい方を先に並べる
  if (diffA !== null && diffB !== null && diffA !== diffB) {
    return diffA - diffB;
  }

  // 4. その他の場合 (両方に値がないか、値が等しい場合): 順序を変更しない
  return 0;
};

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
    // --- 定着度 (fixation) ソート ---
    if (sortBy === 'fixation') {
      const sort = compareByDifference(a, b);
      if (sort) return sort;

      if (a.data.fixation !== b.data.fixation) {
        // 定着度 (昇順): 小さい値 (定着度が低い) を先頭に
        return a.data.fixation - b.data.fixation;
      }

      return b.data.differenceFromLastAttempt - a.data.differenceFromLastAttempt;
    }

    // --- 最終取り組み日 (lastAttempt) ソート ---
    if (sortBy.startsWith('lastAttempt')) {
      const sort = compareByDifference(a, b);
      if (sort) return sort;

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
