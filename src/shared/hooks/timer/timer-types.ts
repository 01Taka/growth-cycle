import { RefObject } from 'react';

// === 共通定義 ===

export interface TimerState {
  expectedDuration: number;
  startTime: number;
  stoppedAt: number;
  isRunning: boolean;
}

export interface TimerStateHandler {
  onStateChange: (newState: Partial<TimerState>) => void;
  setExpectedDuration: (newDuration: number) => void;
}

export interface TimerConfig {
  getNow?: () => number;
  intervalMs?: number;
  onTimerEnd?: () => void;
  timerEndAction?: 'stop' | 'reset' | 'ignore';
}

// === ロジックと状態管理のインターフェース ===

export interface UseTimerLogicArgs
  extends TimerState,
    Pick<TimerStateHandler, 'onStateChange'>,
    TimerConfig {}

export interface UseTimerLogicResult {
  remainingTime: number;
  elapsedTime: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  remainingTimeRef: RefObject<number>;
}

export interface UseRemainingTimeArgs {
  isRunning: boolean;
  stoppedAt: number;
  expectedEndAt: number;
  expectedDuration: number;
  getNow?: () => number;
  intervalMs?: number;
}

export interface TimerPersistenceProvider {
  load: () => TimerState | null | Promise<TimerState | null>;
  save: (state: TimerState) => void | Promise<void>;
}

export interface UseTimerStateArgs {
  initialState?: Partial<TimerState>;
  persistenceProvider?: TimerPersistenceProvider;
}

export interface UseTimerStateResult extends TimerState, TimerStateHandler {
  isLoaded: boolean;
}

// === メイン Hook UseTimer のインターフェース ===

export type UseTimerArgs = UseTimerStateArgs &
  TimerConfig & {
    isDecreaseProgress?: boolean;
  };

export type UseTimerResult = UseTimerLogicResult &
  UseTimerStateResult & {
    progress: number;
    switchState: () => void;
  };
