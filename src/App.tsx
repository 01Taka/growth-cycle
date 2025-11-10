import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { useParticlesEngine } from './shared/hooks/useParticlesEngine';
import { SoundPermissionModal } from './shared/sound/SoundPermissionModal';
import { useAppSounds } from './shared/sound/useAppSounds';
import { theme } from './theme';

export default function App() {
  useParticlesEngine();
  // useAppSounds();

  return (
    <MantineProvider theme={theme}>
      <SoundPermissionModal />
      <Router />
    </MantineProvider>
  );
}
