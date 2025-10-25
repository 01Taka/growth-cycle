import { ReactNode } from 'react';
import { CounterProvider } from './features/counter/context/CounterContext';
import { PlantImagesProvider } from './features/plants/context/PlantImagesContext';

export const applyProviders = (children: ReactNode) => {
  return (
    <>
      <CounterProvider>
        <PlantImagesProvider>{children}</PlantImagesProvider>
      </CounterProvider>
    </>
  );
};
