import '@mantine/core/styles.css';

import { ErrorBoundary } from 'react-error-boundary';
import { MantineProvider } from '@mantine/core';
import CustomErrorFallback from './features/error/CustomErrorFallback';
import { Router } from './Router';
import { useParticlesEngine } from './shared/hooks/useParticlesEngine';
import { SoundPermissionModal } from './shared/sound/SoundPermissionModal';
import { theme } from './theme';

export default function App() {
  useParticlesEngine();

  return (
    <MantineProvider theme={theme}>
      <ErrorBoundary FallbackComponent={CustomErrorFallback} onReset={() => {}}>
        <SoundPermissionModal />
        <Router />
      </ErrorBoundary>
    </MantineProvider>
  );
}
