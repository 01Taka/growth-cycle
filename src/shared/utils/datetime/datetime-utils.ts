import { addDays, format } from 'date-fns';
import { adjustDateForBoundary } from './boundary-utils';

/**
 * 現在の日付に指定された日数を足した後の日付を 'YYYY-MM-DD' 形式で返します。
 *
 * @param daysToAdd 現在の日付に足す日数（整数）
 * @returns 処理後の日付の文字列（'YYYY-MM-DD'形式）
 */
export function getDateAfterDays(
  daysToAdd: number,
  timestamp: string | number | Date = Date.now()
): string {
  // 1. addDaysで現在の日付に日数を加算
  const now = adjustDateForBoundary(timestamp);
  const newDate = addDays(now, daysToAdd);

  // date-fnsでは 'YYYY-MM-DD' の代わりに 'yyyy-MM-dd' を使用します
  return format(newDate, 'yyyy-MM-dd');
}
