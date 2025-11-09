// // pseudo-firestore.ts

// /**
//  * ローカルストレージをバックエンドとして使用し、
//  * Firestoreの非同期操作をシミュレートするクラス。
//  */
// export class PseudoFirestore {
//   private readonly storageKeyPrefix = 'pseudo_db_';

//   /**
//    * ドキュメントの完全なストレージキーを生成します。
//    * 例: 'users/alice' -> 'pseudo_db_users_alice'
//    */
//   private getStorageKey(path: string): string {
//     return this.storageKeyPrefix + path.replace(/\//g, '_');
//   }

//   /**
//    * 任意のパスのドキュメントデータを取得します。
//    * @param path コレクションとドキュメントIDを含むパス (例: 'master_data/units')
//    * @returns ドキュメントデータ (存在しない場合は null)
//    */
//   public async get<T>(path: string): Promise<T | null> {
//     await this.simulateLatency(); // ネットワーク遅延を模倣

//     const key = this.getStorageKey(path);
//     const storedData = localStorage.getItem(key);

//     if (storedData) {
//       try {
//         return JSON.parse(storedData) as T;
//       } catch (e) {
//         console.error(`PseudoFirestore: Error parsing data for ${path}`, e);
//         return null;
//       }
//     }
//     return null;
//   }

//   /**
//    * ドキュメントのデータを設定（上書き）します。
//    * @param path コレクションとドキュメントIDを含むパス
//    * @param data 設定するデータ
//    */
//   public async set(path: string, data: any): Promise<void> {
//     await this.simulateLatency();

//     const key = this.getStorageKey(path);
//     localStorage.setItem(key, JSON.stringify(data));
//   }

//   /**
//    * ドキュメントのフィールドを更新します (ここでは、単純化のため set と同じ動作)。
//    * 実際はトランザクションや部分更新のロジックが必要ですが、ここでは簡略化。
//    * @param path コレクションとドキュメントIDを含むパス
//    * @param data 更新するデータ
//    */
//   public async update(path: string, data: any): Promise<void> {
//     // 既存データを取得し、マージするロジックを実装可能だが、ここでは set で代用
//     await this.set(path, data);
//   }

//   /**
//    * 擬似的なネットワーク遅延を追加します。
//    */
//   async simulateLatency(): Promise<void> {
//     const delay = Math.random() * 50 + 50; // 50msから100msの遅延
//     return new Promise((resolve) => setTimeout(resolve, delay));
//   }
// }

// // ------------------------------------------------------------
// // ユーティリティと初期化
// // ------------------------------------------------------------

// /**
//  * 疑似Firestoreインスタンス
//  */
// export const pseudoDb = new PseudoFirestore();

// /**
//  * 疑似DBをモックマスタデータで初期化する関数。
//  * アプリケーション起動時やテストのセットアップ時に一度呼び出します。
//  * @param masterData Masterデータのオブジェクト（例: MOCK_UNIT_MASTER_DOCUMENT）
//  */
// export async function initializePseudoDb(
//   mockTextbookData: Record<string, any>,
//   mockUnitMaster: { units: any[] },
//   mockCategoryMaster: { categories: any[] }
// ): Promise<void> {
//   console.log('Initializing Pseudo Firestore with master data...');

//   // ユニットマスタの初期化
//   await pseudoDb.set('master_data/units', mockUnitMaster);

//   // カテゴリーマスタの初期化
//   await pseudoDb.set('master_data/categories', mockCategoryMaster);

//   // テキストブックマスタの初期化（各テキストブックIDをドキュメントとして保存）
//   for (const id in mockTextbookData) {
//     if (Object.prototype.hasOwnProperty.call(mockTextbookData, id)) {
//       await pseudoDb.set(`textbooks/${id}`, mockTextbookData[id]);
//     }
//   }

//   console.log('Pseudo Firestore initialization complete.');
// }

// /**
//  * すべての疑似データをクリアする関数（テスト用）
//  */
// export function clearPseudoDb(): void {
//   for (let i = 0; i < localStorage.length; i++) {
//     const key = localStorage.key(i);
//     if (key && key.startsWith(pseudoDb['storageKeyPrefix'])) {
//       localStorage.removeItem(key);
//     }
//   }
//   console.log('Pseudo Firestore cleared.');
// }| DEL |
