import { RangeData } from '../range/range-form-types';
import { RangeFormData } from './form-types';

/**
 * 範囲配列内のすべての範囲に含まれる整数の合計数を計算します。
 * startとendは両端を含みます。
 * endが省略された場合、その範囲はstartのみ（1つの数）を含みます。
 * @param ranges 範囲オブジェクトの配列
 * @returns 範囲に含まれる整数の総数
 */
function countTotalNumbersInRange(ranges: RangeData[]): number {
  let totalCount = 0;

  for (const range of ranges) {
    const start = range.start;
    // endが指定されていない場合は、startのみを含む範囲（長さ1）と見なす
    const end = range.end !== undefined ? range.end : range.start;

    // 範囲の有効性をチェック（start <= end）
    if (start > end) {
      // エラー処理や警告を出すことも可能ですが、ここでは単純にスキップします
      console.warn(`無効な範囲が検出されました: start (${start}) > end (${end})。`);
      continue;
    }

    // 範囲に含まれる整数の数: end - start + 1
    const rangeLength = end - start + 1;
    totalCount += rangeLength;
  }

  return totalCount;
}

export const countTotalNumbersInRangeForms = (ranges: RangeFormData[]) => {
  return ranges.reduce((acc, rangeValue) => {
    return countTotalNumbersInRange(rangeValue.ranges) + acc;
  }, 0);
};
