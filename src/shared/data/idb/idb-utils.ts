/**
 * pathからドキュメントIDを取得する
 * 例: 'users/alice' -> 'alice'
 * 例: 'cities/tokyo/restaurants/sushi-bar' -> 'sushi-bar'
 * @param path Firestore形式のパス文字列
 * @returns ドキュメントID
 */
export function getDocumentId(path: string): string {
  const parts = path.split('/');
  if (parts.length % 2 === 0) {
    return parts[parts.length - 1];
  }
  throw new Error(
    `Invalid document path format: ${path}. Document path must have an even number of segments (collection/document).`
  );
}

/**
 * pathがコレクションパスかドキュメントパスかをチェックする
 * @param path Firestore形式のパス文字列
 */
export function isDocumentPath(path: string): boolean {
  return path.split('/').length % 2 === 0;
}
