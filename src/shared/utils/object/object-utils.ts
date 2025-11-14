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
 * * 元のキーフィールドの値が number や symbol であっても、Recordのキーは常に string に統一されます。
 *
 * @template T オブジェクトの型
 * @param {T[]} array 変換するオブジェクトの配列
 * @param {keyof T} keyField Recordのキーとして使用するフィールド名
 * @returns {Record<string, T>} キーは指定されたフィールドの値の文字列、値は最初に見つかった元のオブジェクト
 */
export function safeArrayToRecord<T extends object>(
  array: T[],
  keyField: keyof T
): Record<string, T> {
  // 戻り値の型を Record<string, T> に合わせるため、Partial<Record<string, T>> を使用
  const resultRecord: Partial<Record<string, T>> = {};

  for (const item of array) {
    // 1. キーフィールドの値を取得 (string | number | symbol など)
    const keyValue = item[keyField];

    // 2. Recordのキーとして使用するために、値を必ず string に変換
    //    null や undefined の可能性を考慮し、安全に文字列化する
    const recordKey = String(keyValue);

    // 3. キーがまだRecordに存在しない場合のみ追加（最初に見つかった要素を保持する）
    if (!(recordKey in resultRecord)) {
      resultRecord[recordKey] = item;
    }

    // キーが既に存在する場合は何もしない (最初に見つかった値が維持される)
  }

  // 4. Partialを外し、完全な Record<string, T> 型として返す
  return resultRecord as Record<string, T>;
}

/**
 * オブジェクトの配列内で指定されたIDを持つオブジェクトを検索し、
 * 見つかった場合は置き換えデータで置換し、見つからなかった場合は末尾に追加した新しい配列を返します。
 *
 * @template T 配列内のオブジェクトの型。idフィールドを持つことが期待されます。
 * @param array 対象となるオブジェクトの配列。
 * @param id 検索対象となるオブジェクトのID。
 * @param replacementData 置き換えまたは追加する新しいオブジェクトデータ。
 * @returns 処理後の新しいオブジェクト配列。
 */
export function replaceOrAddObject<T extends { id: any }>(
  array: T[],
  id: any,
  replacementData: T
): T[] {
  // 配列内で指定されたIDを持つオブジェクトのインデックスを検索
  const index = array.findIndex((item) => item.id === id);

  if (index !== -1) {
    // 🔍 IDが見つかった場合：その位置でオブジェクトを置き換える
    // スプレッド構文 (...) を使用して、元の配列を変更せず、新しい配列を生成します。
    return [
      ...array.slice(0, index), // 0からインデックス直前まで
      replacementData, // 置き換えデータ
      ...array.slice(index + 1), // インデックスの次から末尾まで
    ];
  } else {
    // ➕ IDが見つからなかった場合：置き換えデータを配列の末尾に追加する
    return [...array, replacementData];
  }
}
