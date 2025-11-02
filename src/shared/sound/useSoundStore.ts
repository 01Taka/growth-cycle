import { create } from 'zustand';
import { SoundSequenceItem, SoundState } from './sound-types';

// 遅延処理ヘルパー
const delay = (ms: number, signal?: AbortSignal): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error('Aborted'));
      return;
    }

    const timeoutId = setTimeout(resolve, ms);

    if (signal) {
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timeoutId);
          reject(new Error('Aborted'));
        },
        { once: true }
      );
    }
  });
};

export const useSoundStore = create<SoundState>((set, get) => ({
  isGloballyInitialized: false,
  isPermissionDenied: false,
  hasPendingSounds: false,
  audioMap: {},
  pendingSounds: {},

  globalVolume: 1, // 初期音量を1に設定
  activeAbortController: null, // 初期値はnull

  addPendingSound: (key, path) => {
    set((state) => {
      if (state.audioMap[key] || state.pendingSounds[key]) {
        return state;
      }
      return {
        pendingSounds: { ...state.pendingSounds, [key]: path },
        hasPendingSounds: true,
      };
    });
  },

  initializeAllSounds: async () => {
    const { pendingSounds } = get();
    if (Object.keys(pendingSounds).length === 0) {
      set({ hasPendingSounds: false });
      return;
    }

    const newAudioMap: { [key: string]: HTMLAudioElement } = {};
    // ロード完了を待つPromiseの配列
    const loadPromises: Promise<void>[] = [];

    Object.keys(pendingSounds).forEach((key) => {
      const audio = new Audio(pendingSounds[key]);

      // ロード完了を待つリスナーを追加 (oncanplaythrough)
      const loadPromise = new Promise<void>((resolve) => {
        audio.oncanplaythrough = () => resolve();
        audio.onerror = () => {
          console.error(`Failed to load audio for key: ${key}`);
          resolve(); // ロード失敗してもアプリは続行
        };
      });
      loadPromises.push(loadPromise);

      audio.load();
      newAudioMap[key] = audio;
    });

    // 全ての音声のロード完了を待つ (オプション: タイムアウト設定も可能)
    // await Promise.all(loadPromises);

    const firstAudio = Object.values(newAudioMap)[0];
    if (firstAudio) {
      firstAudio.volume = 0;
      try {
        // ユーザーのジェスチャー後にplay()を呼び出し、再生権限を取得
        await firstAudio.play();
        firstAudio.pause();
        // グローバル音量設定を反映
        Object.values(newAudioMap).forEach((audio) => (audio.volume = get().globalVolume));

        set((state) => ({
          isGloballyInitialized: true,
          isPermissionDenied: false,
          hasPendingSounds: false,
          audioMap: { ...state.audioMap, ...newAudioMap },
          pendingSounds: {},
        }));
      } catch (error) {
        console.error('音声の初期化に失敗しました: 自動再生ポリシーが原因かもしれません。', error);
        // ユーザーが拒否した場合や、再生できない場合
        set({ hasPendingSounds: false, isPermissionDenied: true });
      }
    } else {
      set({ hasPendingSounds: false });
    }
  },

  // グローバル音量と個別音量を考慮した再生
  playSound: (key: string, volume?: number) => {
    const { audioMap, globalVolume } = get();
    const audio = audioMap[key];
    if (audio) {
      // グローバル音量と、指定された個別音量の積を適用
      audio.volume = globalVolume * (volume ?? 1);
      audio.currentTime = 0;
      audio.play().catch((error) => {
        // 権限取得後にエラーが発生した場合は警告
        console.warn(`音声ファイル '${key}' の再生に失敗しました:`, error);
      });
    } else {
      console.warn(`キー '${key}' の音声は初期化されていません。`);
    }
  },

  setPermissionDenied: (denied) => {
    set({ isPermissionDenied: denied });
  },

  setGlobalVolume: (volume: number) => {
    // 0から1の範囲にクランプ
    const clampedVolume = Math.max(0, Math.min(1, volume));
    set({ globalVolume: clampedVolume });

    // 既に初期化済みのAudio要素に新しい音量を反映
    const { audioMap } = get();
    Object.values(audioMap).forEach((audio) => {
      // 個別音量を保持しているわけではないので、ここではグローバル音量をそのまま適用
      // より高度な実装では、個別のデフォルト音量を保持する必要があります
      audio.volume = clampedVolume;
    });
  },

  // playLoopを非同期処理で再実装 (より安全で正確なタイミングを実現)
  playLoop: async (key: string, count: number, interval: number = 0, volume?: number) => {
    const { playSequence } = get();

    const sequence: SoundSequenceItem[] = Array(count).fill({
      key: key,
      interval: interval,
      repeat: 1,
      volume: volume,
    });

    // playSequenceを呼び出してループを実行
    try {
      await playSequence(sequence);
    } catch (error) {
      // 中断された場合は無視
      if (error && typeof error === 'object' && 'message' in error && error.message !== 'Aborted') {
        console.error('PlayLoop execution failed:', error);
      }
    }
  },

  // playSequenceの新しい実装 (AbortControllerで停止可能)
  playSequence: async (sequence: SoundSequenceItem[], signal?: AbortSignal) => {
    const { playSound, isGloballyInitialized, isPermissionDenied } = get();

    if (!isGloballyInitialized || isPermissionDenied) {
      console.warn('音声再生が許可されていないか、初期化されていません。');
      return;
    }

    // 外部からsignalが渡されない場合、AbortControllerを新規作成し、ストアに登録
    let controller: AbortController | null = null;
    if (!signal) {
      controller = new AbortController();
      signal = controller.signal;
      set({ activeAbortController: controller });
    }

    try {
      for (const item of sequence) {
        const { key, repeat = 1, interval = 1000, volume } = item;

        for (let i = 0; i < repeat; i++) {
          if (signal.aborted) throw new Error('Aborted'); // 中断チェック

          playSound(key, volume);

          // 最後の再生でなければインターバルを待つ
          if (i < repeat - 1) {
            await delay(interval, signal);
          }
        }
        // シーケンス内のアイテム間の待機が必要な場合はここに追加
      }
    } catch (error) {
      // Abortedエラーは無視
      if (error && typeof error === 'object' && 'message' in error && error.message !== 'Aborted') {
        console.error('Play Sequence failed:', error);
      }
    } finally {
      // シーケンスが完了または中断されたら、ストアのコントローラーをクリア
      if (get().activeAbortController === controller) {
        set({ activeAbortController: null });
      }
    }
  },

  // 停止機能の追加
  stopAllSoundSequences: () => {
    const { activeAbortController } = get();
    if (activeAbortController) {
      activeAbortController.abort();
      set({ activeAbortController: null });
      console.log('アクティブな音声シーケンスを停止しました。');
    } else {
      console.warn('現在アクティブな音声シーケンスはありません。');
    }
  },
}));
