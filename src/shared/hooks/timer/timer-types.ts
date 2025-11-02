import { RefObject } from 'react';

/**
 * @typedef {object} TimerState
 * @property {number} startTime - タイマーが開始または再開されたUnixタイムスタンプ (ミリ秒)。
 * @property {number} stoppedAt - タイマーが最後に停止されたUnixタイムスタンプ (ミリ秒)。タイマーが実行中の場合は0。
 * @property {boolean} isRunning - タイマーが現在実行中であるかどうかのフラグ。
 */
export interface TimerState {
  startTime: number;
  stoppedAt: number;
  isRunning: boolean;
}

/**
 * @typedef {object} FullTimerState
 * @property {TimerState} ... - TimerState の全プロパティ。
 * @property {number} expectedDuration - タイマーの合計持続時間 (ミリ秒)。
 */
export type FullTimerState = TimerState & {
  expectedDuration: number;
};

/**
 * @interface UseTimerLogicArgs
 * @property {number} startTime - 現在のタイマーの開始時間 (Unixタイムスタンプ、ミリ秒)。
 * @property {number} stoppedAt - 現在のタイマーの停止時間 (Unixタイムスタンプ、ミリ秒)。実行中の場合は0。
 * @property {boolean} isRunning - 現在のタイマーが実行中であるかどうかのフラグ。
 * @property {number} expectedDuration - タイマーの期待される合計持続時間 (ミリ秒)。
 * @property {(() => number)} [getNow] - 現在のUnixタイムスタンプ (ミリ秒) を返す関数。
 * @property {(newState: TimerState) => void} onStateChange - タイマーの状態が変更されたときに呼び出されるコールバック関数。
 * @property {number} [intervalMs] - 残り時間を更新するインターバル (ミリ秒)。useRemainingTime に渡されます。デフォルトは 1000ms。
 */
export interface UseTimerLogicArgs {
  startTime: number;
  stoppedAt: number;
  isRunning: boolean;
  expectedDuration: number;
  intervalMs?: number;
  getNow?: () => number;
  onTimerEnd?: () => void;
  onStateChange: (newState: TimerState) => void;
}

export interface UseTimerLogicResult {
  remainingTime: number;
  elapsedTime: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  remainingTimeRef: RefObject<number>;
}

/**
 * @interface UseRemainingTimeArgs
 * @property {boolean} isRunning - タイマーが現在実行中であるかどうかのフラグ。
 * @property {number} stoppedAt - タイマーが最後に停止されたUnixタイムスタンプ (ミリ秒)。
 * @property {number} expectedEndAt - タイマーが終了する予定のUnixタイムスタンプ (startTime + expectedDuration)。
 * @property {number} expectedDuration - タイマーの期待される合計持続時間 (ミリ秒)。
 * @property {(() => number)} [getNow] - 現在のUnixタイムスタンプ (ミリ秒) を返す関数。
 * @property {number} [intervalMs] - 残り時間を更新するインターバル (ミリ秒)。デフォルトは 1000ms。
 */
export interface UseRemainingTimeArgs {
  isRunning: boolean;
  stoppedAt: number;
  expectedEndAt: number;
  expectedDuration: number;
  getNow?: () => number;
  intervalMs?: number;
}

// 永続化プロバイダーのインターフェース
export interface TimerPersistenceProvider {
  load: () => FullTimerState | null | Promise<FullTimerState | null>;
  save: (state: FullTimerState) => void | Promise<void>;
}

export interface UseTimerStateArgs {
  /**
   * タイマーの初期状態。永続化データが存在しない場合に使用されます。
   */
  initialState?: Partial<FullTimerState>;
  /**
   * 状態の永続化と復元を行うプロバイダー (オプショナル)。
   */
  persistenceProvider?: TimerPersistenceProvider;
}

/**
 * @typedef {object} UseTimerStateResult
 * @property {TimerState} currentState - 現在の TimerState。
 * @property {boolean} isLoaded - 永続化データのロードが完了したかどうかのフラグ。
 */
export interface UseTimerStateResult extends UseTimerLogicArgs {
  currentState: TimerState;
  isLoaded: boolean;
  setExpectedDuration: (newDuration: number) => void;
}

export type UseTimerArgs = UseTimerStateArgs &
  Pick<UseTimerLogicArgs, 'getNow' | 'intervalMs' | 'onTimerEnd'>;
export type UseTimerResult = UseTimerLogicResult & UseTimerStateResult;
