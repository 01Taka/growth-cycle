import { ZodError } from 'zod';
import { Textbook, TextbookSchema } from '@/shared/data/documents/textbook/textbook-document';
import { generateFirestoreId, generateIdbPath } from '@/shared/data/idb/generate-path';
import { IDB_PATH } from '@/shared/data/idb/idb-path';
import { idbStore } from '@/shared/data/idb/idb-store';
import { CreateTextbookForm } from './create-textbook-form-types';

// 処理結果を格納するための型を定義します
export type TextbookResult =
  | { success: true; message: string; data: Textbook }
  | { success: false; message: string; error: unknown };

/**
 * 配列から重複する要素を削除し、一意な要素のみの配列を返します。
 * また、各要素に一意な`idbId`を付与します。
 * @param array 重複を含む元の配列
 * @returns 重複が削除され、`idbId`が付与された新しい配列
 */
function assignId<T extends Record<string, any>>(array: T[]): (T & { idbId: string })[] {
  const values = [...new Set(array)];
  return values.map((value) => ({ ...value, idbId: generateFirestoreId() }));
}

/**
 * 教科書の作成、バリデーション、IndexedDBへの保存を行います。
 * `text`が空文字列のユニットおよびカテゴリーは除外されます。
 * 成功または失敗のフラグとメッセージを含む結果オブジェクトを返します。
 * @param form 作成フォームのデータ
 * @returns 処理結果を示すオブジェクト (TextbookResult)
 */
export const handleCreateTextbook = async (form: CreateTextbookForm): Promise<TextbookResult> => {
  try {
    const textbookPath = generateIdbPath(IDB_PATH.textbooks, '', true); // 1. 空文字のユニットとカテゴリーをフィルタリングしてから、教科書オブジェクトの生成
    // textが空文字のユニットを除外

    const filteredUnits = form.units.filter((unit) => unit.text.trim() !== ''); // textが空文字のカテゴリーを除外
    const filteredCategories = form.categories.filter((category) => category.text.trim() !== '');

    const textbook: Textbook = {
      name: form.name,
      subject: form.subject, // フィルタリングされた配列に対してassignIdを適用
      units: assignId(filteredUnits).map((unit) => ({ name: unit.text, id: unit.idbId })), // フィルタリングされた配列に対してassignIdを適用
      categories: assignId(filteredCategories).map((category) => ({
        name: category.text,
        id: category.idbId,
        timePerProblem: 0,
        problemNumberFormat: 'number',
      })),
      lastAttemptedAt: null,
      totalPlants: 0,
      plants: [],
    }; // 2. バリデーションの実行 (ZodErrorを投げる可能性あり)

    TextbookSchema.parse(textbook); // 3. IndexedDBへの追加 (IDB操作のエラーを投げる可能性あり)

    await idbStore.add(textbookPath, textbook);

    console.log('Textbook created successfully:', textbook.name);
    return {
      success: true,
      message: `${textbook.name}の教科書を作成し、データベースに保存しました。`,
      data: textbook,
    };
  } catch (error) {
    let errorMessage: string;

    if (error instanceof ZodError) {
      // スキーマバリデーションエラー
      const firstIssue = error.issues[0];
      errorMessage = `入力データの検証に失敗しました。${firstIssue.path.join('.')} の値を確認してください。詳細: ${firstIssue.message}`;
      console.error('Textbook Validation Error:', error.issues);
    } else if (error instanceof Error) {
      // IndexedDB操作エラーやその他のErrorオブジェクト
      errorMessage = `教科書の保存中にエラーが発生しました。詳細: ${error.message}`;
      console.error('Operation Error:', error);
    } else {
      // 予期せぬ不明なエラー
      errorMessage = '予期せぬエラーが発生し、教科書を保存できませんでした。';
      console.error('Unknown Error:', error);
    }

    return {
      success: false,
      message: errorMessage,
      error: error,
    };
  }
};
