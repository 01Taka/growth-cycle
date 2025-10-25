/**
 * 文字列をシードとして、4つの32ビット整数のハッシュ値を生成する関数 (cyrb128アルゴリズム)
 * @param str シードとして使用する文字列
 * @returns 4要素の32ビット整数配列
 */
function cyrb128(str: string): number[] {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 1013904242);
    h4 = h1 ^ Math.imul(h4 ^ k, 2773480762);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 1013904242);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2773480762);

  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
}

/**
 * 確定論的擬似乱数生成器 (sfc32アルゴリズム)
 * @param a 32ビット整数シード1
 * @param b 32ビット整数シード2
 * @param c 32ビット整数シード3
 * @param d 32ビット整数シード4
 * @returns 乱数生成関数 ([0, 1)のfloatを返す)
 */
function sfc32(a: number, b: number, c: number, d: number): () => number {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296; // 2^32で割って [0, 1) のfloatを返す
  };
}

/**
 * 文字列シードを受け取り、確定論的乱数生成関数 ([0, 1) float) を返す
 * @param seedString 乱数生成のシードとなる文字列
 * @returns 確定論的乱数生成関数
 */
export function createSeededRandom(seedString: string): () => number {
  const seed = cyrb128(seedString);
  return sfc32(seed[0], seed[1], seed[2], seed[3]);
}
