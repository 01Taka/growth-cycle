// 💡 vitest のインポートを削除 (Storybook環境では不要)
import { CounterContextValue, UseCounterStorageHook } from '../../context/CounterContextTypes';

// useCounterStorageフックのモックを生成するヘルパー
// 戻り値は、元のフックのシグネチャ (UseCounterStorageHook) に合うように実装する
export const createMockUseCounterStorage = (
  initialCount: number,
  setCountMock: (incrementAmount: number) => void
): UseCounterStorageHook => {
  const mockHook = ((_key: string, _initialValue: number) => {
    return [initialCount, setCountMock] as [number, (incrementAmount: number) => void];
  }) as UseCounterStorageHook; // 型キャストでシグネチャを保証
  return mockHook;
};

/**
 * テストで使用するCounterContextのモック値を生成するヘルパー関数
 * @returns ContextValue
 */
export const createMockCounterContextValue = (
  initialCount: number,
  setCountMock: (incrementAmount: number) => void
): CounterContextValue => {
  return {
    useCounterStorage: createMockUseCounterStorage(initialCount, setCountMock),
  };
};
