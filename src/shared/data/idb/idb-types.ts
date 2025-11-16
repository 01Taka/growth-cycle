import { z } from 'zod';

export interface DocumentBase {
  id: string; // ドキュメントの一意なID (IndexedDBのキー)
  path: string; // ドキュメントの位置を示すパス (例: 'users/alice', 'cities/tokyo/restaurants/sushi-bar')
  [key: string]: any; // その他のデータ
}

// 20文字の英数字IDを定義するスキーマ
const TwentyCharIdSchema = z
  .string()
  .length(20, { message: '文字列は正確に20文字である必要があります' })
  .regex(/^[a-zA-Z0-9]+$/, { message: '英数字（a-z, A-Z, 0-9）のみ使用できます' });

// 'localUser'というリテラル文字列を定義するスキーマ
const LocalUserLiteralSchema = z.literal('localUser');

// --- IdbIdSchema (変更済み) ---
// 20文字の英数字、または 'localUser' のいずれかを許容
export const IdbIdSchema = z.union([TwentyCharIdSchema, LocalUserLiteralSchema], {
  message: 'IDは20文字の英数字、または「localUser」である必要があります',
});

// --- IdbPathSchema (変更済み) ---
// 任意の文字列 / (20文字の英数字ID または localUser) の形式を検証するスキーマ
export const IdbPathSchema = z.string().regex(
  // 正規表現の解説:
  // ^.+/: 任意の文字列が1文字以上続き、スラッシュ / で終わる
  // (?:[a-zA-Z0-9]{20}|localUser): 20文字の英数字ID または 'localUser' のいずれか
  // $: 文字列の終了
  /^.+\/(?:[a-zA-Z0-9]{20}|localUser)$/,
  { message: '形式は「任意の文字列/(20文字の英数字ID または localUser)」である必要があります' }
);

export const IDBDocumentSchema = z.object({
  id: IdbIdSchema,
  path: IdbPathSchema,
});
