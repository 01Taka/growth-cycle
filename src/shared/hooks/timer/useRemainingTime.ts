import { useCallback, useEffect, useRef, useState } from 'react';
import { UseRemainingTimeArgs } from './timer-types';

/**
 * 内部で状態を持ち、タイマーの残り時間と経過時間を計算・更新するフック。
 * useTimer から利用される。
 *
 * @param {UseRemainingTimeArgs} args - タイマーの状態、期間、およびコールバックを含む引数オブジェクト。
 * @returns {object} タイマーの残り時間、経過時間、および残り時間を参照するためのrefオブジェクト。
 * @property {number} remainingTime - タイマーの現在の残り時間 (ミリ秒)。
 * @property {number} elapsedTime - タイマーの現在の経過時間 (ミリ秒)。
 * @property {React.MutableRefObject<number>} remainingTimeRef - 残り時間を参照するためのrefオブジェクト。
 */
const useRemainingTime = (args: UseRemainingTimeArgs) => {
  const { isRunning, stoppedAt, expectedEndAt, expectedDuration, intervalMs = 1000 } = args;
  const getNow = useCallback(args.getNow ?? (() => Date.now()), [args.getNow]);

  /**
   * 現在のタイマーの状態に基づいた残り時間を計算する
   */
  const getInitialRemaining = useCallback(() => {
    if (isRunning) {
      // 実行中: 終了予定時刻 - 現在時刻
      return expectedEndAt - getNow();
    } else if (expectedEndAt > 0) {
      // 停止中: 終了予定時刻 - 停止時刻
      return expectedEndAt - stoppedAt;
    }
    // 初期状態
    return expectedDuration;
  }, []);

  const [remainingTimeState, setRemainingTimeState] = useState(getInitialRemaining());
  const remainingTimeRef = useRef<number>(remainingTimeState);

  const elapsedTime = expectedDuration - remainingTimeState;

  // インターバルで remainingTimeState を更新するロジック
  useEffect(() => {
    if (!isRunning || expectedEndAt <= 0) return;

    const updateRemainingTime = () => {
      const diff = expectedEndAt - getNow();

      // State と Ref を更新
      setRemainingTimeState(diff);
      remainingTimeRef.current = diff;
    };

    updateRemainingTime(); // 初回実行
    const interval = setInterval(updateRemainingTime, intervalMs);

    return () => clearInterval(interval);
  }, [isRunning, expectedEndAt, getNow, intervalMs]);

  // タイマーが外部から停止されたとき、remainingTimeState を停止時点の値で固定する
  useEffect(() => {
    if (!isRunning && expectedEndAt > 0) {
      const fixedRemaining = expectedEndAt - stoppedAt;
      setRemainingTimeState(fixedRemaining);
      remainingTimeRef.current = fixedRemaining;
    }
  }, [isRunning, expectedEndAt, stoppedAt]);

  return {
    remainingTime: remainingTimeState,
    elapsedTime,
    remainingTimeRef,
  };
};

export default useRemainingTime;
