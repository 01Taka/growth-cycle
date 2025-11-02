import { TimerPersistenceProvider, TimerState } from './timer-types';

/**
 * ローカルストレージを使用してタイマーの状態を永続化するプロバイダー。
 */
export class LocalStorageTimerPersistenceProvider implements TimerPersistenceProvider {
  private key: string;

  /**
   * @param {string} key - localStorage に保存するキー。
   */
  constructor(key: string = 'timerState') {
    this.key = key;
  }

  /**
   * ローカルストレージからタイマーの状態をロードします。
   * @returns {TimerState | null} 復元された状態、またはデータがない場合は null。
   */
  load(): TimerState | null {
    try {
      // 1. localStorage から文字列を取得
      const stored = localStorage.getItem(this.key);

      if (!stored) {
        return null;
      }

      // 2. JSON 文字列をオブジェクトにパース
      const state: TimerState = JSON.parse(stored);

      // タイムスタンプが number 型であることを保証するための簡易チェック
      if (typeof state.startTime !== 'number' || typeof state.expectedDuration !== 'number') {
        console.warn('Persisted data format invalid or missing essential fields.');
        return null;
      }

      // 3. ロードした状態を返却
      return state;
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
      // ロードに失敗した場合は null を返し、useTimerStateに初期値を使わせる
      return null;
    }
  }

  /**
   * タイマーの現在の状態をローカルストレージに保存します。
   * @param {TimerState} state - 保存するタイマーの現在の状態。
   */
  save(state: TimerState): void {
    try {
      // 1. 状態オブジェクトを JSON 文字列に変換
      const serialized = JSON.stringify(state);

      // 2. localStorage に保存
      localStorage.setItem(this.key, serialized);
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }
}
