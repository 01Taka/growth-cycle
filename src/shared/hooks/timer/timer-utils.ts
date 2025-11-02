/**
 * ミリ秒を時間、分、秒、ミリ秒に分割します。
 *
 * @param ms 分割したいミリ秒数
 * @param useAbsolute オプション。trueの場合、msの絶対値で計算します（デフォルト: false）。
 * @returns 時間、分、秒、ミリ秒を含むオブジェクトと、元の値が正であったかを示すフラグ。
 */
export function splitMilliseconds(
  ms: number,
  useAbsolute: boolean = false
): {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  isPositive: boolean;
} {
  const isPositive = ms >= 0;
  const targetMs = useAbsolute ? Math.abs(ms) : ms;

  // 1. 時間を計算
  const hours = Math.floor(targetMs / (1000 * 60 * 60));
  // 残りのミリ秒を計算
  let remainingMs = targetMs % (1000 * 60 * 60);

  // 2. 分を計算
  const minutes = Math.floor(remainingMs / (1000 * 60));
  // 残りのミリ秒を更新
  remainingMs %= 1000 * 60;

  // 3. 秒を計算
  const seconds = Math.floor(remainingMs / 1000);
  // 残りのミリ秒を更新
  remainingMs %= 1000;

  // 4. 最終的なミリ秒（常に 0 から 999 の範囲）
  const milliseconds = remainingMs;

  return {
    hours,
    minutes,
    seconds,
    milliseconds,
    isPositive,
  };
}

/**
 * ミリ秒を時間、分、秒に変換します。
 *
 * @param ms - 変換したいミリ秒数。
 * @param truncate - オプション。trueの場合、結果を切り捨て（整数）で返します（デフォルト: false）。
 * @param useAbsolute - オプション。trueの場合、msの絶対値で計算します（デフォルト: false）。
 * @returns 時間、分、秒を含むオブジェクトと、元の値が正であったかを示すフラグ。
 */
export function convertMs(
  ms: number,
  truncate: boolean = false,
  useAbsolute: boolean = false
): {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  isPositive: boolean;
} {
  const isPositive = ms >= 0;
  const targetMs = useAbsolute ? Math.abs(ms) : ms;

  const MS_IN_HOUR = 1000 * 60 * 60;
  const MS_IN_MINUTE = 1000 * 60;
  const MS_IN_SECOND = 1000;

  // 1. 時間 (Hours) の計算
  let hours = targetMs / MS_IN_HOUR;

  // 2. 分 (Minutes) の計算
  let minutes = targetMs / MS_IN_MINUTE;

  // 3. 秒 (Seconds) の計算
  let seconds = targetMs / MS_IN_SECOND;

  if (truncate) {
    // フラグが true の場合、すべての値を切り捨てる
    hours = Math.floor(hours);
    minutes = Math.floor(minutes);
    seconds = Math.floor(seconds);
  }

  return {
    hours,
    minutes,
    seconds,
    milliseconds: targetMs,
    isPositive,
  };
}

// ---

/**
 * ミリ秒を「分割」および「独立した単位への変換」の両方を行う統合関数です。
 *
 * @param ms - 処理したいミリ秒数。
 * @param truncateConversion - オプション。trueの場合、独立変換の結果を切り捨てます（デフォルト: false）。
 * @param useAbsolute - オプション。trueの場合、msの絶対値で計算します（デフォルト: false）。
 * @returns 分割結果と変換結果の両方を含むオブジェクト。
 */
export function processMilliseconds(
  ms: number,
  truncateConversion: boolean = false,
  useAbsolute: boolean = false
): {
  split: {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    isPositive: boolean;
  };
  conversion: {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    isPositive: boolean;
  };
  isPositive: boolean;
} {
  return {
    split: splitMilliseconds(ms, useAbsolute),
    conversion: convertMs(ms, truncateConversion, useAbsolute),
    isPositive: ms >= 0,
  };
}
