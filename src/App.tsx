import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { useParticlesEngine } from './shared/hooks/useParticlesEngine';
import { theme } from './theme';

export default function App() {
  useParticlesEngine();

  return (
    <MantineProvider theme={theme}>
      <Router />
    </MantineProvider>
  );
}
