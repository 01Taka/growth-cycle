/**
 * 32ビット整数の符号なし乗算（JavaScriptの標準的なビット演算は32ビットに丸められる）
 */
function imul(a: number, b: number): number {
  // Math.imulが利用できない環境に備えたフォールバック（TypeScriptでは通常利用可能）
  return Math.imul(a, b);
}

/**
 * 32ビット符号なし整数の乗算と、指定ビット数での左回転 (Rotate Left) を行う
 * @param v 値
 * @param r 回転させるビット数
 * @returns 32ビット符号なし整数
 */
function rotl(v: number, r: number): number {
  return (v << r) | (v >>> (32 - r));
}

/**
 * MurmurHash3のコアとなる32ビットハッシュ関数をベースにした確定論的乱数生成器
 * seedとindexから直接 float [0, 1) を生成します。
 * * @param seedString 乱数生成のシードとなる文字列
 * @param index 取得したい乱数のインデックス（0以上の整数）
 * @returns 0以上1未満のfloat値
 */
export function getDeterministicRandom(seedString: string, index: number = 0): number {
  // 1. 文字列シードを数値に変換（シンプルなハッシュ）
  let h: number = 0;
  for (let i = 0; i < seedString.length; i++) {
    h = imul(16777619, h) ^ seedString.charCodeAt(i);
  }

  // 2. シードとインデックスを結合した値を最終的なハッシュの入力とする
  // MurmurHash3の要素と類似した定数を使用
  let k1 = h >>> 0; // 文字列シードのハッシュ値
  let k2 = index >>> 0; // インデックス値

  // 3. MurmurHash3にヒントを得た混合（ミキシング）操作

  // k1のミキシング
  k1 = imul(k1, 0xcc9e2d51);
  k1 = rotl(k1, 15);
  k1 = imul(k1, 0x1b873593);

  // k2のミキシング
  k2 = imul(k2, 0xcc9e2d51);
  k2 = rotl(k2, 15);
  k2 = imul(k2, 0x1b873593);

  // 4. 最終的なハッシュ値（ハッシュの長さを2と仮定）
  let final_hash = k1 ^ k2;

  // 5. ファイナライズ（fmix32に類似）
  final_hash ^= final_hash >>> 16;
  final_hash = imul(final_hash, 0x85ebca6b);
  final_hash ^= final_hash >>> 13;
  final_hash = imul(final_hash, 0xc2b2ae35);
  final_hash ^= final_hash >>> 16;

  // 6. 32ビット符号なし整数 [0, 2^32-1] を float [0, 1) に変換
  // 2^32 (4294967296) で割る
  return (final_hash >>> 0) / 4294967296;
}
