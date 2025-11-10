import { useEffect, useRef } from 'react';

/**
 * 渡されたデータとローカルストレージの値を監視し、いずれかが変更されたときにコールバックを実行するカスタムフック
 *
 * @param key - localStorageに保存するためのキー
 * @param data - 監視対象の現在のデータ
 * @param onChange - ローカルストレージまたはdataの値が変更されたときに実行するコールバック
 * (currentData: T | undefined, localData: string | null)
 * 現在のデータとローカルストレージの生の値（string | null）を渡します。
 */
export function useSyncedLocalStorage<T>(
  key: string,
  data: T,
  onChange: (currentData: T, localData: string | null) => void
): void {
  const dataRef = useRef(data);
  const onChangeRef = useRef(onChange);

  // 1. data, key, onChange の最新値を ref に格納
  useEffect(() => {
    dataRef.current = data;
    onChangeRef.current = onChange;
  }, [data, key, onChange]);

  // 2. data の変更を監視し、ローカルストレージに保存
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // data が変わったらローカルストレージに保存
    try {
      const stringifiedData = JSON.stringify(data);
      const localData = window.localStorage.getItem(key);

      // ローカルストレージの値を取得
      // 変更前にローカルストレージに保存されていた値を取得（保存前の値）
      const previousLocalData = window.localStorage.getItem(key);

      // ローカルストレージに保存（現在の data の値）
      window.localStorage.setItem(key, stringifiedData);

      // data が変更されたので、コールバックを呼ぶ
      // コールバックには、現在の data の値と、ローカルストレージに保存する直前の値を渡すこともできますが、
      // ここではローカルストレージの「最新の値」をコールバックに渡します。
      onChangeRef.current(data, previousLocalData);
    } catch (error) {
      console.warn(`Error handling localStorage key "${key}":`, error);
      // エラー発生時もコールバックを呼ぶか、エラー情報を渡すかはユースケースによりますが、
      // 今回は単に保存処理が失敗したとみなし、エラーはコンソールに出力するだけに留めます。
    }
  }, [key, data]); // data の変更を監視

  // 3. ローカルストレージの外部からの変更を監視（storageイベント）
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (event: StorageEvent) => {
      // 監視対象のキーが変更された場合
      if (event.key === key) {
        // コールバックを実行
        // 現在の data の値と、ローカルストレージの新しい生の値 (event.newValue) を渡す
        onChangeRef.current(dataRef.current, event.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]); // key が変わったときにイベントリスナーを再設定
}
