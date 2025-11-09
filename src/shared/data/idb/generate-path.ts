// 必要な定数と関数はそのまま
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

// ヘルパー関数の定義
/**
 * 文字列または文字列配列をFirestoreセグメントの配列に変換し、基本チェックを行うヘルパー関数。
 * @param segments パスのセグメント。
 * @returns フィルタリングされたセグメントの配列。
 */
function processSegments(segments: string[] | string): string[] {
  return Array.isArray(segments)
    ? segments.filter((s) => s.length > 0)
    : segments.split('/').filter((s) => s.length > 0);
}

/**
 * Firestoreスタイルのドキュメントパスを生成し、構造の正当性を検証する汎用関数。
 * パスは常に [固定部分] / [ID] / [固定部分] / [ID] ... の順に結合される。
 *
 * @param fixedSegments パスの奇数番目のセグメント（コレクション名部分）。
 * @param idSegments パスの偶数番目のセグメント（ドキュメントID部分）。
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
  const ids = processSegments(idSegments);
  const fixed = processSegments(fixedSegments);

  // 2. 最終セグメントのID自動生成処理
  const finalIds = [...ids];
  let finalFixed = [...fixed];

  // autoIdLastSegment=trueの場合、fixedSegmentsの最後に新しいドキュメントIDを追加するスペースがあることを要求
  if (autoIdLastSegment) {
    if (fixed.length === ids.length + 1) {
      finalIds.push(generateFirestoreId());
    } else {
      throw new Error(
        'Cannot use autoIdLastSegment=true. The number of fixed segments must be exactly one more than the number of ID segments to append an auto ID.'
      );
    }
  }

  // 3. IDの数と固定部分の数の最終チェック (ドキュメントパスは fixed.length = finalIds.length で終わる必要がある)
  if (finalFixed.length !== finalIds.length) {
    throw new Error(
      `Invalid document path structure. Final fixed segments (${finalFixed.length}) must equal final ID segments (${finalIds.length}).`
    );
  }

  // 4. パスの結合
  const segments: string[] = [];
  for (let i = 0; i < finalFixed.length; i++) {
    // 奇数番目 (コレクション名)
    segments.push(finalFixed[i]);
    // 偶数番目 (ドキュメントID)
    segments.push(finalIds[i]);
  }

  return segments.join('/');
}

/**
 * Firestoreスタイルのコレクションパスを生成し、構造の正当性を検証する関数。
 * パスは常に [固定部分] / [ID] / [固定部分] / [ID] ... / [固定部分] の順に結合される。
 *
 * @param fixedSegments パスの奇数番目のセグメント（コレクション名部分）。
 * @param idSegments パスの偶数番目のセグメント（ドキュメントID部分）。
 * @returns 生成されたFirestore形式のパス文字列。
 * @throws {Error} パスの構造が正しくない場合。
 */
export function generateIdbCollectionPath(
  fixedSegments: string[] | string,
  idSegments: string[] | string
): string {
  // 1. セグメントの配列化
  const ids = processSegments(idSegments);
  const fixed = processSegments(fixedSegments);

  // 2. 構造チェック: コレクションパスは常に fixed.length = ids.length + 1 で終わる必要がある
  if (fixed.length !== ids.length + 1) {
    throw new Error(
      `Invalid collection path structure. Fixed segments (${fixed.length}) must be exactly one more than ID segments (${ids.length}).`
    );
  }

  // 3. パスの結合
  const segments: string[] = [];
  // fixedの長さはidsより1つ長い
  for (let i = 0; i < ids.length; i++) {
    // 奇数番目 (コレクション名)
    segments.push(fixed[i]);
    // 偶数番目 (ドキュメントID)
    segments.push(ids[i]);
  }
  // 最後の固定セグメント（コレクション名）を追加
  segments.push(fixed[fixed.length - 1]);

  return segments.join('/');
}
