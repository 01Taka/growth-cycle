import { Timestamp } from 'firebase/firestore';
import { getDaysDifference } from '@/shared/utils/datetime/datetime-compare-utils';
import { AttemptLog, ProblemLearningRecord } from '../types/problem-types';

/**
 * 学習記録のattemptsから、直前（末尾）から最大 number 個のログを取得し、
 * 不足分は先頭（小さいインデックス）を null で埋めて、固定長 number の配列を返します。
 * * @param record 問題学習記録オブジェクト
 * @param number 取得したいログの最大数（固定長）
 * @returns number個のログの配列（不足分はnullで後詰め）
 */
export const getJustBeforeLogs = (
  record: ProblemLearningRecord,
  number: number = 3
): (AttemptLog | null)[] => {
  const attempts = record.attempts;

  // 1. 直前 (末尾) の最大 number 個の要素を取得
  // slice(-number) で末尾から number 個の要素を取得します。
  const justBeforeLogs = attempts.slice(-number);

  // 2. 不足している要素数（nullで埋める数）を計算
  const paddingCount = number - justBeforeLogs.length;

  // 3. null で埋める配列を作成
  // Array(n).fill(null) で n 個の null の配列を作成します。
  const nullPadding = Array(paddingCount).fill(null);

  // 4. nullで埋めた配列と取得したログを結合し、固定長 number の配列を返します
  // nullPadding が先頭に来るため「後ろ詰め」（小さいインデックスにnull）になります。
  return [...nullPadding, ...justBeforeLogs] as (AttemptLog | null)[];
};
/**
 * Firestore Timestampを「n日前」または「今日」の形式に変換する（日単位のみ）
 * @param firestoreTimestamp 変換したいFirestoreのTimestampオブジェクト
 * @returns 「n日前」または「今日」の表記文字列
 */
export const formatTimestampToDaysAgo = (firestoreTimestamp: Timestamp): string => {
  // 1. TimestampをJavaScriptのDateオブジェクトに変換
  const pastDate: Date = firestoreTimestamp.toDate();
  const daysAgo = getDaysDifference(pastDate);
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
