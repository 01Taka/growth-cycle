import { useEffect } from 'react';
import { appSounds } from './app-sounds';
import { useSoundPlayer } from './useSoundPlayer';

/**
 * カスタムフック: アプリ内でよく使う音を自動でストアに登録し、再生機能を提供します。
 *
 * @returns {object}
 * - play: 初期化済みの音声を再生する関数。
 * - playOnUserGesture: ユーザーイベントで音声を即座に再生し、同時に初期化する関数。
 * - isGloballyInitialized: アプリ全体の音声が初期化済みかどうかの状態。
 */
export const useAppSounds = () => {
  const { play, playOnUserGesture, registerSound, isGloballyInitialized } = useSoundPlayer();

  // コンポーネントがマウントされたときに、定義済みの音をストアに登録
  useEffect(() => {
    registerSound(appSounds);
  }, [registerSound]);

  return { play, playOnUserGesture, isGloballyInitialized };
};
