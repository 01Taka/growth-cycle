// useCounterStorageフックの厳密なシグネチャを定義
export type UseCounterStorageHook = (
  key: string,
  initialValue: number
) => [number, (incrementAmount: number) => void];

// Contextで提供される値の構造を定義
// DIパターンを採用しているため、フック関数そのものをContextの値として提供します。
export interface CounterContextValue {
  useCounterStorage: UseCounterStorageHook;
}
