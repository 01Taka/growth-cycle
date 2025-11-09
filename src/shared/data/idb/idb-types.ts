import z from 'zod';

export interface DocumentBase {
  id: string; // ドキュメントの一意なID (IndexedDBのキー)
  path: string; // ドキュメントの位置を示すパス (例: 'users/alice', 'cities/tokyo/restaurants/sushi-bar')
  [key: string]: any; // その他のデータ
}

export const IdbIdSchema = z
  .string()
  .length(20, { message: '文字列は正確に20文字である必要があります' })
  .regex(/^[a-zA-Z0-9]+$/, { message: '英数字（a-z, A-Z, 0-9）のみ使用できます' });

// 任意の文字列 (パス) / [IDB ID 20文字] の形式を検証するスキーマ
export const IdbPathSchema = z.string().regex(
  // 正規表現の解説:
  // ^: 文字列の開始
  // .*: 任意の文字が0回以上続く (これが「任意の文字列」部分)
  // \/: スラッシュ / の文字そのもの
  // [a-zA-Z0-9]{20}: 英数字が正確に20文字続く (これがIdbIdSchemaの条件部分)
  // $: 文字列の終了
  /^.+\/[a-zA-Z0-9]{20}$/,
  { message: '形式は「任意の文字列/20文字の英数字ID」である必要があります' }
);

export const IDBDocumentSchema = z.object({
  id: IdbIdSchema,
  path: IdbPathSchema,
});
