// hooks/useTimerState.ts (実装部分 - 修正と追加)
import { useCallback, useEffect, useState } from 'react';
import { TimerState, UseTimerStateArgs, UseTimerStateResult } from './timer-types';

const defaultInitialState: TimerState = {
  expectedDuration: 0,
  startTime: 0,
  stoppedAt: 0,
  isRunning: false,
};

/**
 * useTimer の状態管理と永続化を担うフック。
 * 非同期な永続化プロバイダーに対応し、ロード状態を管理します。
 *
 * @param {UseTimerStateArgs} args - 期間、初期状態、永続化プロバイダーなどを含む引数。
 * @returns {UseTimerStateResult} useTimer に渡す引数と現在の状態、ロード完了フラグを含むオブジェクト。
 */
export const useTimerState = (args: UseTimerStateArgs): UseTimerStateResult => {
  const { initialState = {}, persistenceProvider } = args;

  // 1. ロード状態と内部状態の管理
  const [isLoaded, setIsLoaded] = useState(false);

  const initialFullState: TimerState = {
    ...defaultInitialState,
    ...initialState,
  };

  const [fullState, setFullState] = useState<TimerState>(initialFullState);

  // 2. 非同期ロード処理
  useEffect(() => {
    if (!persistenceProvider) {
      setIsLoaded(true);
      return;
    }

    let isMounted = true;

    const loadState = async () => {
      try {
        const persisted = await persistenceProvider.load();
        if (isMounted && persisted) {
          setFullState((prev) => ({
            ...prev,
            ...persisted,
          }));
        }
      } catch (e) {
        console.error('Failed to load timer state:', e);
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    loadState();

    return () => {
      isMounted = false;
    };
  }, [persistenceProvider]);

  // 3. onStateChange コールバックの定義
  const onStateChange = useCallback(
    (newState: Partial<TimerState>) => {
      setFullState((prev) => {
        const newFullState: TimerState = {
          ...prev,
          ...newState,
        };

        // 非同期保存
        try {
          // setFullState のコールバック内で最新の newFullState を保存
          persistenceProvider?.save(newFullState);
        } catch (error) {
          console.error('Failed to save timer state (onStateChange):', error);
        }

        return newFullState;
      });
    },
    [persistenceProvider]
  );

  // 4. expectedDuration を更新するためのセッター関数の定義
  const setExpectedDuration = useCallback(
    (newDuration: number) => {
      setFullState((prev) => {
        const newState: TimerState = {
          ...prev,
          expectedDuration: newDuration,
        };

        // 非同期保存
        try {
          persistenceProvider?.save(newState);
        } catch (error) {
          console.error('Failed to save timer state (setExpectedDuration):', error);
        }

        return newState;
      });
    },
    [persistenceProvider] // persistenceProvider のみに依存
  );

  // 5. useTimer に渡すための引数オブジェクトを構築
  const useTimerArgs: UseTimerStateResult = {
    startTime: fullState.startTime,
    stoppedAt: fullState.stoppedAt,
    isRunning: fullState.isRunning,
    expectedDuration: fullState.expectedDuration,

    isLoaded,

    onStateChange,
    setExpectedDuration,
  };

  return useTimerArgs;
};
