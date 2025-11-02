export type SoundMap = { [key: string]: string };

export type SoundSequenceItem = {
  key: string;
  interval?: number;
  repeat?: number;
  volume?: number; // 個別音量設定を追加
};

export interface SoundState {
  isGloballyInitialized: boolean;
  isPermissionDenied: boolean;
  hasPendingSounds: boolean;
  audioMap: { [key: string]: HTMLAudioElement };
  pendingSounds: SoundMap;

  globalVolume: number; // グローバル音量を追加
  activeAbortController: AbortController | null; // シーケンス停止用

  addPendingSound: (key: string, path: string) => void;
  initializeAllSounds: () => Promise<void>;
  playSound: (key: string, volume?: number) => void; // volume引数を追加
  setPermissionDenied: (denied: boolean) => void;

  // playLoopをplaySequenceに統合するか、またはplaySequenceと同じロジックにする
  playLoop: (key: string, count: number, interval?: number, volume?: number) => void;

  // AbortControllerを使用して安全に停止できるようにする
  playSequence: (sequence: SoundSequenceItem[], signal?: AbortSignal) => Promise<void>;
  stopAllSoundSequences: () => void;

  setGlobalVolume: (volume: number) => void; // グローバル音量設定関数
}
