import { useCallback, useEffect } from 'react';
import { UseTimerLogicArgs } from './timer-types';
import useRemainingTime from './useRemainingTime';

/**
 * 内部で状態を持たず、外部から提供されたタイマー状態に基づいて計算を行い、
 * 状態変更のリクエストを外部に伝えるカスタムフック。
 *
 * @param {UseTimerArgs} args - タイマーの状態、期間、およびコールバックを含む引数オブジェクト。
 * @returns {object} タイマーの残り時間、経過時間、実行状態、およびタイマー操作（開始、停止、リセット）のための関数を含むオブジェクト。
 * @property {number} remainingTime - タイマーの残り時間 (ミリ秒)。
 * @property {number} elapsedTime - タイマーの経過時間 (ミリ秒)。
 * @property {boolean} isRunning - タイマーが現在実行中であるかどうかのフラグ。
 * @property {() => void} start - タイマーを開始または再開する関数。
 * @property {() => void} stop - タイマーを停止する関数。また、残り時間が0以下になった場合も自動的に呼び出されます。
 * @property {() => void} reset - タイマーを初期状態にリセットする関数。
 * @property {React.MutableRefObject<number>} remainingTimeRef - 残り時間を参照するためのrefオブジェクト。
 */
export const useTimerLogic = (args: UseTimerLogicArgs) => {
  const {
    startTime,
    stoppedAt,
    isRunning,
    expectedDuration,
    intervalMs,
    onStateChange,
    onTimerEnd,
  } = args;
  const getNow = args.getNow ?? (() => Date.now());

  const expectedEndAt = startTime + expectedDuration;

  const { remainingTime, elapsedTime, remainingTimeRef } = useRemainingTime({
    isRunning,
    stoppedAt,
    expectedEndAt,
    expectedDuration,
    intervalMs,
    getNow,
  });

  /**
   * タイマーを停止する関数
   */
  const stop = useCallback(() => {
    const now = getNow();
    // タイマーが既に停止している場合は状態変更を行わない
    if (!isRunning && stoppedAt > 0) return;

    onStateChange({
      startTime: startTime,
      stoppedAt: now,
      isRunning: false,
    });
  }, [startTime, isRunning, stoppedAt, getNow, onStateChange]);

  /**
   * タイマーを開始または再開する関数
   */
  const start = useCallback(() => {
    const now = getNow();

    // 経過時間を保持しつつ newStartTime を計算
    const newStartTime = isRunning
      ? startTime
      : stoppedAt > 0
        ? now - (stoppedAt - startTime)
        : now;

    onStateChange({
      startTime: newStartTime,
      stoppedAt: 0,
      isRunning: true,
    });
  }, [isRunning, startTime, stoppedAt, getNow, onStateChange]);

  /**
   * タイマーを初期状態にリセットする関数
   */
  const reset = useCallback(() => {
    onStateChange({
      startTime: 0,
      stoppedAt: 0,
      isRunning: false,
    });
  }, [onStateChange]);

  // タイマー終了時の自動停止処理
  useEffect(() => {
    // 実行中かつ残り時間が 0 以下になったら自動的に stop を呼び出す
    if (isRunning && remainingTimeRef.current <= 0) {
      onTimerEnd?.();
    }
  }, [isRunning, remainingTime, stop, remainingTimeRef]);

  return {
    remainingTime,
    elapsedTime,
    isRunning,
    start,
    stop,
    reset,
    remainingTimeRef,
  };
};
