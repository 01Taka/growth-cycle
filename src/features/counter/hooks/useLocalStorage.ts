import { useCallback, useState } from 'react';

// ローカルストレージからの読み込みと書き込みを抽象化
export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  // SSR (サーバーサイドレンダリング) 環境など、windowが存在しない環境を考慮
  const isClient = typeof window !== 'undefined';

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isClient) {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        // 値をStateに保存
        setStoredValue(value);

        // localStorageに書き込み (副作用)
        if (isClient) {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error('Error writing to localStorage', error);
      }
    },
    [key, isClient]
  );

  return [storedValue, setValue];
};
