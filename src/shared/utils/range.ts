/**
 * 1. range(): Pythonのrange()に似た数値ジェネレータ関数。
 * 大きな連番でもメモリ効率が良いです。
 *
 * @param start - 開始値 (または終了値のみ指定する場合の終了値)
 * @param [stop] - 終了値 (排他的)
 * @param [step=1] - ステップ (増分)
 * @returns number型の値を返すGenerator
 */
export function* range(start: number, stop?: number, step: number = 1): Generator<number> {
  // 引数の調整: range(n) の形式の場合、startを0に設定
  if (stop === undefined) {
    stop = start;
    start = 0;
  }

  // エラーチェック
  if (step === 0 || isNaN(step)) {
    throw new Error('Step cannot be zero or NaN.');
  }

  // 増減の方向を決定
  const isPositive = step > 0;
  let current = start;

  // 連番の生成
  while (isPositive ? current < stop : current > stop) {
    yield current;
    current += step;
  }
}

/**
 * 2. rangeAsStringArray(): 数値ジェネレータ (range) を利用し、
 * 生成された連番を文字列化して配列として返します。
 *
 * @param start - 開始値 (または終了値のみ指定する場合の終了値)
 * @param [stop] - 終了値 (排他的)
 * @param [step=1] - ステップ (増分)
 * @returns string[] 型の配列
 */
export function rangeAsStringArray(start: number, stop?: number, step: number = 1): string[] {
  // rangeジェネレータを実行し、スプレッド構文で数値配列を作成
  const numberArray: number[] = [...range(start, stop, step)];

  // mapメソッドで全ての要素を文字列に変換
  return numberArray.map((n) => String(n));
  // あるいは: return numberArray.map(n => n.toString());
}
