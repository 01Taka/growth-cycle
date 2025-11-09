import { IDBPDatabase, openDB } from 'idb';
import { DB_NAME, DB_VERSION, SINGLE_STORE_NAME } from './idb-configs';
import { DocumentBase } from './idb-types';
import { getDocumentId, isDocumentPath } from './idb-utils';

/**
 * IndexedDBをFirestore風のCRUD操作で扱うクラス (最終修正版)
 * クラス自体はジェネリック型を持たず、メソッドが型を受け取ることで、
 * 単一のインスタンスで複数型のドキュメントを扱えるようにします。
 */
export class IDBStore {
  private static instance: IDBStore | null = null;
  private dbPromise: Promise<IDBPDatabase>;

  private constructor() {
    this.dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains(SINGLE_STORE_NAME)) {
            const store = db.createObjectStore(SINGLE_STORE_NAME, { keyPath: 'id' });
            store.createIndex('pathIndex', 'path', { unique: true });
          }
        }
      },
    });
  }

  /**
   * IDBStoreの共有インスタンスを取得するための静的メソッド (ジェネリック型なし)
   */
  public static getInstance(): IDBStore {
    if (!IDBStore.instance) {
      IDBStore.instance = new IDBStore();
    }
    return IDBStore.instance;
  }

  // --- CRUD 操作 (ジェネリック型をメソッドに追加) ---

  /**
   * 新しいドキュメントをコレクションに追加します。
   * @param path ドキュメントパス
   * @param data 追加するドキュメントデータ (型 T を使用)
   * @returns ドキュメントID
   */
  public async add<T extends DocumentBase>(
    path: string,
    data: Omit<T, 'id' | 'path'>
  ): Promise<string> {
    const db = await this.dbPromise;

    if (!isDocumentPath(path)) {
      throw new Error(
        `'add' requires a document path (e.g., 'users/new-doc-id'). Collection path ('${path}') is invalid for this operation.`
      );
    }

    const docId = getDocumentId(path);

    const document: T = {
      ...data,
      id: docId,
      path: path,
    } as T;

    await db.put(SINGLE_STORE_NAME, document);
    return docId;
  }

  /**
   * 単一のドキュメントを取得します。
   * @returns ドキュメントデータ (型 T を返す)
   */
  public async get<T extends DocumentBase>(path: string): Promise<T | null> {
    const db = await this.dbPromise;

    if (!isDocumentPath(path)) {
      throw new Error(`'get' requires a document path (e.g., 'users/alice').`);
    }

    // getFromIndexの戻り値が unknown になるため、T | null にキャストして返す
    const doc = await db.getFromIndex(SINGLE_STORE_NAME, 'pathIndex', path);

    return (doc || null) as T | null;
  }

  /**
   * 既存のドキュメントの特定のフィールドを更新します。
   */
  public async update<T extends DocumentBase>(
    path: string,
    updates: Partial<Omit<T, 'id' | 'path'>>
  ): Promise<boolean> {
    const db = await this.dbPromise;

    if (!isDocumentPath(path)) {
      throw new Error(`'update' requires a document path (e.g., 'users/alice').`);
    }

    // 既存ドキュメントを取得 (Tとして取得)
    const existingDoc = (await db.getFromIndex(SINGLE_STORE_NAME, 'pathIndex', path)) as T;

    if (!existingDoc) {
      return false;
    }

    const updatedDocument: T = {
      ...existingDoc,
      ...updates,
      id: existingDoc.id,
      path: existingDoc.path,
    };

    await db.put(SINGLE_STORE_NAME, updatedDocument);
    return true;
  }

  /**
   * 単一のドキュメントを削除します。
   */
  public async delete(path: string): Promise<void> {
    const db = await this.dbPromise;

    if (!isDocumentPath(path)) {
      throw new Error(`'delete' requires a document path (e.g., 'users/alice').`);
    }

    const docId = getDocumentId(path);
    await db.delete(SINGLE_STORE_NAME, docId);
  }

  /**
   * コレクション内のすべてのドキュメントを取得します。
   * @returns ドキュメントの配列 (型 T[] を返す)
   */
  public async getCollection<T extends DocumentBase>(collectionPath: string): Promise<T[]> {
    const db = await this.dbPromise;

    if (isDocumentPath(collectionPath)) {
      throw new Error(
        `'getCollection' requires a collection path (e.g., 'users'), but a document path ('${collectionPath}') was provided.`
      );
    }

    // getAllの戻り値は T[] とは限らないため、T[] にキャストする
    const allDocs = (await db.getAll(SINGLE_STORE_NAME)) as T[];

    const prefix = `${collectionPath}/`;
    const directChildren = allDocs.filter(
      (doc) =>
        doc.path.startsWith(prefix) &&
        // direct children (例: 'users/alice' は 'users/' の子) のみを抽出
        doc.path.split('/').length === collectionPath.split('/').length + 2
    );

    return directChildren;
  }
}

export const idbStore = IDBStore.getInstance();
