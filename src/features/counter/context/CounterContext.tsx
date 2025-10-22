import React, { createContext, ReactNode, useContext } from 'react';
// 💡 分離したフック本体をインポート
import { useCounterStorage } from '../hooks/useCounterStorage';
import { CounterContextValue } from './CounterContextTypes';

const defaultContextValue: CounterContextValue = {
  // 初期値（Providerなしで呼び出された場合にエラーをスロー）
  useCounterStorage: () => {
    throw new Error('useCounterStorage must be called within a CounterProvider');
  },
};

export const CounterContext = createContext<CounterContextValue>(defaultContextValue);

/**
 * カウンターストレージの依存フックを提供するProviderコンポーネント。
 * アプリケーションのルート近くで使用します。
 */
export const CounterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Context Valueとして、useCounterStorageフックの実際の参照を提供します。
  const value: CounterContextValue = {
    useCounterStorage: useCounterStorage,
  };

  return <CounterContext.Provider value={value}>{children}</CounterContext.Provider>;
};

/**
 * CounterContextの値（フック参照）を取得するためのカスタムフック。
 * Contextの消費を抽象化します。
 * @returns CounterContextValue
 */
export const useCounter = () => {
  const context = useContext(CounterContext);

  // Providerが提供されていない場合のエラーチェック
  if (context === defaultContextValue) {
    throw new Error('useCounter must be used within a CounterProvider');
  }

  return context;
};
