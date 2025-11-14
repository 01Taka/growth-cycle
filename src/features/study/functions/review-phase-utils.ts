import { getDaysDifference } from '@/shared/utils/datetime/datetime-compare-utils';

/**
 * Firestore Timestampを「n日前」または「今日」の形式に変換する（日単位のみ）
 * @param timestampMs 変換したいFirestoreのTimestampオブジェクト
 * @returns 「n日前」または「今日」の表記文字列
 */
export const formatMsToDaysAgo = (timestampMs: number): string => {
  const daysAgo = getDaysDifference(timestampMs);
  if (daysAgo > 0) {
    console.error('未来の日付が指定されました');
    return `${daysAgo}日後`;
  }

  if (daysAgo === 0) {
    // 差が0日の場合（今日の日付）
    return '今日';
  } else {
    return `${-daysAgo}日前`;
  }
};
