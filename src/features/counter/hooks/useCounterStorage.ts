import { useCallback, useState } from 'react';

/**
 * 実際のローカルストレージ操作と、インクリメント量を管理するカスタムフック。
 * Contextから独立して再利用可能です。
 *
 * @param key ローカルストレージに保存するためのキー
 * @param initialValue 初回アクセス時またはデータ破損時の基準値
 * @returns [現在の値, 値を更新・保存するセッター関数]
 */
export const useCounterStorage = (
  key: string,
  initialValue: number
): [number, (incrementAmount: number) => void] => {
  const isClient = typeof window !== 'undefined';

  // 1. 状態の初期化とローカルストレージからの読み込み
  const [storedValue, setStoredValue] = useState<number>(() => {
    if (!isClient) return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      // JSON.parse()を使用して読み込み、無効な場合は initialValue を返す
      const value = item ? JSON.parse(item) : initialValue;
      // 読み込んだ値が数値であることを確認
      return typeof value === 'number' ? value : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return initialValue;
    }
  });

  // 2. 値の更新とローカルストレージへの書き込み処理
  const updateAndSaveValue = useCallback(
    (incrementAmount: number) => {
      setStoredValue((prevValue) => {
        const newValue = prevValue + incrementAmount;

        // ローカルストレージへの書き込み
        if (isClient) {
          try {
            window.localStorage.setItem(key, JSON.stringify(newValue));
          } catch (error) {
            console.error('Error writing to localStorage', error);
          }
        }

        return newValue;
      });
    },
    [key, isClient]
  );

  return [storedValue, updateAndSaveValue];
};
