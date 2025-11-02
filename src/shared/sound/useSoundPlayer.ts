import { useCallback } from 'react';
import { SoundSequenceItem } from './sound-types';
import { useSoundStore } from './useSoundStore';

type SoundMap = { [key: string]: string };

/**
 * カスタムフック: 音声の再生を管理するための機能を提供します。
 *
 * @returns {object}
 * - play: 初期化済みの音声を再生する関数。
 * - playOnUserGesture: ユーザーイベントで音声を即座に再生し、同時に初期化する関数。
 * - registerSound: 音声ファイルを初期化待ちリストに登録する関数。
 * - playLoop: 音声をリピート再生する関数。
 * - playSequence: 音声をシーケンスで再生する関数。
 * - stopSequence: 現在再生中のシーケンスを停止する関数。
 * - setGlobalVolume: 全体の音量を設定する関数。
 * - isGloballyInitialized: アプリ全体の音声が初期化済みかどうかの状態。
 */
export const useSoundPlayer = () => {
  const addPendingSoundFromStore = useSoundStore((state) => state.addPendingSound);
  const initializeAllSoundsFromStore = useSoundStore((state) => state.initializeAllSounds);
  const playSoundFromStore = useSoundStore((state) => state.playSound);
  const playLoopFromStore = useSoundStore((state) => state.playLoop);
  const playSequenceFromStore = useSoundStore((state) => state.playSequence);
  const stopAllSoundSequencesFromStore = useSoundStore((state) => state.stopAllSoundSequences);
  const setGlobalVolumeFromStore = useSoundStore((state) => state.setGlobalVolume);

  const isGloballyInitialized = useSoundStore((state) => state.isGloballyInitialized);
  const isPermissionDenied = useSoundStore((state) => state.isPermissionDenied);
  const audioMap = useSoundStore((state) => state.audioMap);
  const pendingSounds = useSoundStore((state) => state.pendingSounds);

  // registerSoundをメモ化
  const registerSound = useCallback(
    (sounds: SoundMap) => {
      Object.entries(sounds).forEach(([key, path]) => {
        if (!audioMap[key] && !pendingSounds[key]) {
          addPendingSoundFromStore(key, path);
        }
      });
    },
    [addPendingSoundFromStore, audioMap, pendingSounds]
  );

  // playOnUserGestureをメモ化
  const playOnUserGesture = useCallback(
    async (key: string, path: string, volume?: number) => {
      if (isPermissionDenied) {
        console.warn('音声再生は拒否されています。');
        return;
      }

      if (audioMap[key]) {
        playSoundFromStore(key, volume);
        return;
      }

      addPendingSoundFromStore(key, path);
      await initializeAllSoundsFromStore();
      playSoundFromStore(key, volume);
    },
    [
      isPermissionDenied,
      audioMap,
      playSoundFromStore,
      addPendingSoundFromStore,
      initializeAllSoundsFromStore,
    ]
  );

  // playをメモ化
  const play = useCallback(
    (key: string, volume?: number) => {
      if (!isGloballyInitialized) {
        console.warn('音声を再生する前に、アプリ全体の初期化が必要です。');
        return;
      }
      if (isPermissionDenied) {
        console.warn('音声再生は拒否されています。');
        return;
      }
      playSoundFromStore(key, volume);
    },
    [isGloballyInitialized, isPermissionDenied, playSoundFromStore]
  );

  // playLoopをメモ化 (volume引数を追加)
  const playLoop = useCallback(
    (key: string, count: number, interval?: number, volume?: number) => {
      if (!isGloballyInitialized || isPermissionDenied) {
        console.warn('音声再生が許可されていないか、初期化されていません。');
        return;
      }
      playLoopFromStore(key, count, interval, volume);
    },
    [isGloballyInitialized, isPermissionDenied, playLoopFromStore]
  );

  // playSequenceをメモ化
  const playSequence = useCallback(
    (sequence: SoundSequenceItem[]) => {
      if (!isGloballyInitialized || isPermissionDenied) {
        console.warn('音声再生が許可されていないか、初期化されていません。');
        return;
      }
      // playSequenceFromStore内でAbortControllerが作成・管理される
      playSequenceFromStore(sequence);
    },
    [isGloballyInitialized, isPermissionDenied, playSequenceFromStore]
  );

  // stopAllSoundSequencesをメモ化
  const stopSequence = useCallback(() => {
    stopAllSoundSequencesFromStore();
  }, [stopAllSoundSequencesFromStore]);

  // setGlobalVolumeをメモ化
  const setGlobalVolume = useCallback(
    (volume: number) => {
      setGlobalVolumeFromStore(volume);
    },
    [setGlobalVolumeFromStore]
  );

  return {
    play,
    playOnUserGesture,
    registerSound,
    playLoop,
    playSequence,
    stopSequence, // 停止機能を追加
    setGlobalVolume, // 音量設定機能を追加
    isGloballyInitialized,
  };
};
