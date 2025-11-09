/**
 * オブジェクトの配列を指定されたフィールドの値に基づいてRecord (プレーンなJSオブジェクト) に変換します。
 * キーとなるフィールドの値に重複がある場合はエラーをスローします。
 *
 * @template T オブジェクトの型
 * @template K Mapのキーとして使用するフィールドの型 (string | number | symbol)
 * @param {T[]} array 変換するオブジェクトの配列
 * @param {keyof T} keyField Recordのキーとして使用するフィールド名
 * @returns {Record<K, T>} キーは指定されたフィールドの値、値は元のオブジェクト
 * @throws {Error} キーとなるフィールドの値に重複がある場合
 */
export function arrayToRecord<T extends object, K extends string | number | symbol>(
  array: T[],
  keyField: keyof T
): Record<K, T> {
  const resultRecord: Partial<Record<K, T>> = {};

  for (const item of array) {
    // キーフィールドの値を取得。Recordのキーとして使用するため、string, number, symbolに限定される。
    const keyValue = item[keyField];

    // Recordのキーとして使用するために型をKにキャスト (string | number | symbol)
    // ここでの型アサーションは、キーとして有効な値が渡されることを開発者が保証することを前提とする
    const recordKey = keyValue as K;

    // キーが既にRecordに存在するかチェック
    // JavaScriptオブジェクトのキーチェックには`hasOwnProperty`または`in`演算子を使用
    if (recordKey in resultRecord) {
      // 重複があった場合はエラーをスロー
      throw new Error(
        `キーフィールド '${String(keyField)}' の値 '${String(keyValue)}' が重複しています。`
      );
    }

    // 重複がなければRecordに追加
    resultRecord[recordKey] = item;
  }

  // Partialを外し、完全なRecord型として返す
  return resultRecord as Record<K, T>;
}

/**
 * オブジェクトの配列を指定されたフィールドの値に基づいてRecord (プレーンなJSオブジェクト) に変換します。
 * キーとなるフィールドの値が重複している場合、最初に見つかった要素がRecordの値として採用されます。
 *
 * @template T オブジェクトの型
 * @template K Recordのキーとして使用するフィールドの型 (string | number | symbol)
 * @param {T[]} array 変換するオブジェクトの配列
 * @param {keyof T} keyField Recordのキーとして使用するフィールド名
 * @returns {Record<K, T>} キーは指定されたフィールドの値、値は最初に見つかった元のオブジェクト
 */
export function safeArrayToRecord<T extends object, K extends string | number | symbol>(
  array: T[],
  keyField: keyof T
): Record<K, T> {
  const resultRecord: Partial<Record<K, T>> = {};

  for (const item of array) {
    // キーフィールドの値を取得
    const keyValue = item[keyField];

    // Recordのキーとして使用するために型をKにキャスト
    const recordKey = keyValue as K;

    // キーがまだRecordに存在しない場合のみ追加（最初に見つかった要素を保持する）
    if (!(recordKey in resultRecord)) {
      resultRecord[recordKey] = item;
    }

    // キーが既に存在する場合は何もしない (最初に見つかった値が維持される)
  }

  // Partialを外し、完全なRecord型として返す
  return resultRecord as Record<K, T>;
}
