import { useCallback, useEffect, useState } from 'react';
import TestSound from './testSound.mp3';
import { useSoundPlayer } from './useSoundPlayer';
import { useSoundStore } from './useSoundStore';

export const useSoundPermissionModal = () => {
  const hasPendingSounds = useSoundStore((state) => state.hasPendingSounds);
  const initializeAllSounds = useSoundStore((state) => state.initializeAllSounds);
  const setPermissionDenied = useSoundStore((state) => state.setPermissionDenied);
  const setGlobalVolume = useSoundStore((state) => state.setGlobalVolume);
  const playOnUserGesture = useSoundPlayer().playOnUserGesture;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // hasPendingSoundsの状態が変更されたらモーダルの表示・非表示を切り替える
  useEffect(() => {
    setOpen((prev) => prev || hasPendingSounds);
  }, [hasPendingSounds]);

  const handleAllowSound = useCallback(async () => {
    setLoading(true);
    try {
      await initializeAllSounds();
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }, [initializeAllSounds]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleDenySound = useCallback(() => {
    setPermissionDenied(true);
    setOpen(false);
  }, [setPermissionDenied]);

  const playTestSound = useCallback(() => {
    playOnUserGesture('testSound', TestSound);
  }, [playOnUserGesture]);

  return {
    open,
    loading,
    playTestSound,
    setGlobalVolume,
    handleAllowSound,
    handleClose,
    handleDenySound,
  };
};
