/**
 * カラーコード (HEX, RGB, RGBA) をRGBA形式に変換し、新しい透明度を適用します。
 * @param colorStr 変換するカラーコード文字列（例: "#ff0000", "rgb(255, 0, 0)", "rgba(255, 0, 0, 0.5)"）
 * @param newAlpha 適用する新しい透明度 (0.0 から 1.0 の間)。省略またはnullの場合、元の透明度を維持（HEX/RGBの場合は1.0）します。
 * @returns 調整された透明度を持つRGBA形式の文字列（例: "rgba(255, 0, 0, 0.8)"）
 * @throws 無効なカラーコードが入力された場合にエラーをスローします。
 */
export function toRGBA(colorStr: string, newAlpha?: number | null): string {
  const color = colorStr.trim().toLowerCase().replace(/\s/g, '');

  // 1. HEX形式の処理（例: #fff, #ffffff, #ff000080）
  if (color.startsWith('#')) {
    const { r, g, b, a } = hexToRgba(color);
    const finalAlpha = newAlpha === undefined || newAlpha === null ? a : clampAlpha(newAlpha);
    return `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
  }
  // 2. RGBAまたはRGB形式の処理（例: rgb(255,0,0), rgba(255,0,0,0.5)）
  else if (color.startsWith('rgb')) {
    const { r, g, b, a } = rgbOrRgbaToRgba(color);
    const finalAlpha = newAlpha === undefined || newAlpha === null ? a : clampAlpha(newAlpha);
    return `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
  }

  // 3. その他（無効な入力）
  throw new Error(`Invalid color string format: ${colorStr}`);
}

/**
 * 3桁、4桁、6桁、8桁のHEXコードをRGBAオブジェクトに変換します。
 */
function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
  hex = hex.replace(shorthandRegex, (_, r, g, b, a) => {
    // 3桁または4桁を6桁または8桁に展開
    return r + r + g + g + b + b + (a ? a + a : '');
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);

  if (!result) {
    throw new Error(`Invalid HEX color: ${hex}`);
  }

  let a = result[4] ? parseInt(result[4], 16) / 255 : 1; // 8桁の場合、最後の2桁がアルファ値

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: clampAlpha(a),
  };
}

/**
 * rgb() または rgba() 形式の文字列をRGBAオブジェクトに変換します。
 */
function rgbOrRgbaToRgba(rgbStr: string): { r: number; g: number; b: number; a: number } {
  const match = rgbStr.match(/^rgba?\((\d+),(\d+),(\d+),?([\d.]+)?\)$/i);

  if (!match) {
    throw new Error(`Invalid RGB/RGBA color: ${rgbStr}`);
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  // 4番目の値があればアルファ値、なければ1.0
  const a = match[4] ? parseFloat(match[4]) : 1;

  // RGB値の範囲チェック (0-255) は簡略化のため省略

  return {
    r: r,
    g: g,
    b: b,
    a: clampAlpha(a),
  };
}

/**
 * アルファ値を 0.0 から 1.0 の範囲に制限します。
 */
function clampAlpha(alpha: number): number {
  return Math.min(1, Math.max(0, alpha));
}
