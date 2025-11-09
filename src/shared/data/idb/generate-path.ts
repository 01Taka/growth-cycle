// 必要な定数と関数を再掲
const ALPHANUMERIC_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH = 20;

export function generateFirestoreId(): string {
  let id = '';
  for (let i = 0; i < ID_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * ALPHANUMERIC_CHARS.length);
    id += ALPHANUMERIC_CHARS.charAt(randomIndex);
  }
  return id;
}

/**
 * Firestoreスタイルのパスを生成し、構造の正当性を検証する汎用関数。
 * パスは常に [固定部分] / [ID] / [固定部分] / [ID] ... の順に結合される。
 *
 * @param fixedSegments パスの奇数番目のセグメント（コレクション名部分）。
 * 文字列配列 ('users', 'posts') または '/'で区切られた文字列 ('users/posts')。
 * @param idSegments パスの偶数番目のセグメント（ドキュメントID部分）。
 * 文字列配列 ('user_id', 'post_id') または '/'で区切られた文字列 ('user_id/post_id')。
 * @param autoIdLastSegment 最後のIDセグメントに自動ID (Firestore形式の20文字) を使用するかどうか。
 * @returns 生成されたFirestore形式のパス文字列。
 * @throws {Error} パスの構造が正しくない場合。
 */
export function generateIdbPath(
  fixedSegments: string[] | string,
  idSegments: string[] | string,
  autoIdLastSegment: boolean = false
): string {
  // 1. セグメントの配列化
  const ids = Array.isArray(idSegments)
    ? idSegments.filter((s) => s.length > 0)
    : idSegments.split('/').filter((s) => s.length > 0);

  const fixed = Array.isArray(fixedSegments)
    ? fixedSegments.filter((s) => s.length > 0)
    : fixedSegments.split('/').filter((s) => s.length > 0);

  // 2. 構造チェック
  if (fixed.length < ids.length || fixed.length > ids.length + 1) {
    throw new Error(
      `Invalid path structure. Fixed segments (${fixed.length}) must be equal to or one more than ID segments (${ids.length}).`
    );
  }

  // 3. 最終セグメントのID自動生成処理
  const finalIds = [...ids];
  if (autoIdLastSegment) {
    if (fixed.length === ids.length + 1) {
      finalIds.push(generateFirestoreId());
    } else {
      throw new Error(
        'Cannot use autoIdLastSegment=true. The number of ID segments must be exactly one less than the number of fixed segments to append an auto ID.'
      );
    }
  }

  // 4. IDの数と固定部分の数の最終チェック
  if (fixed.length !== finalIds.length) {
    throw new Error(
      `Mismatched segment count. Final fixed segments (${fixed.length}) must equal final ID segments (${finalIds.length}).`
    );
  }

  // 5. パスの結合
  const segments: string[] = [];
  for (let i = 0; i < fixed.length; i++) {
    // 奇数番目 (コレクション名)
    segments.push(fixed[i]);

    // 偶数番目 (ドキュメントID)
    segments.push(finalIds[i]);
  }

  return segments.join('/');
}
