export const SINGLE_STORE_NAME = 'growth-cycle-documents';
export const DB_NAME = 'FirestoreStyleDB';
export const DB_VERSION = 1;

export interface DocumentBase {
  id: string; // ドキュメントの一意なID (IndexedDBのキー)
  path: string; // ドキュメントの位置を示すパス (例: 'users/alice', 'cities/tokyo/restaurants/sushi-bar')
  [key: string]: any; // その他のデータ
}
