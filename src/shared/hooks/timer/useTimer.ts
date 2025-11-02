import { useCallback, useMemo } from 'react';
import { UseTimerArgs, UseTimerResult } from './timer-types';
import { useTimerLogic } from './useTimerLogic';
import { useTimerState } from './useTimerState';

/**
 * タイマーの状態管理、永続化、およびロジック計算を統合した単一のカスタムフック。
 *
 * @param {UseTimerArgs} args - 初期状態、永続化プロバイダー、インターバルなどの設定。
 * @returns {UseTimerResult} タイマーの操作関数、状態、および時間情報。
 */
export const useTimer = (args: UseTimerArgs): UseTimerResult => {
  // 1. 状態管理と永続化を行う useTimerState を呼び出し
  // useTimerState は onStateChange と FullTimerState の要素を返す
  const timerState = useTimerState(args);

  // 2. タイマーのロジック計算と操作関数を提供する useTimerLogic を呼び出し
  const timerLogic = useTimerLogic({
    ...args,
    ...timerState,
  });

  const switchState = useCallback(
    () => (timerLogic.isRunning ? timerLogic.stop() : timerLogic.start()),
    [timerLogic.isRunning, timerLogic.stop, timerLogic.start]
  );

  const progress = useMemo(() => {
    if (timerLogic.elapsedTime <= 0 || timerState.expectedDuration <= 0) {
      return args.isDecreaseProgress ? 1 : 0;
    }
    const progress = Math.min(timerLogic.elapsedTime / timerState.expectedDuration, 1);
    return args.isDecreaseProgress ? 1 - progress : progress;
  }, [timerLogic.elapsedTime, timerState.expectedDuration, args.isDecreaseProgress]);

  // 3. 必要な結果を結合して返す
  return {
    ...timerState,
    ...timerLogic,
    progress,
    switchState,
  };
};
