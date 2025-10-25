import React, { createContext, ReactNode, useContext } from 'react';
import { getPlantImagesBySubject } from '../functions/import-plants';
import { PlantImagesContextValue } from './PlantImagesContextType';

const defaultContextValue: PlantImagesContextValue = {
  // 初期値（Providerなしで呼び出された場合にエラーをスロー）
  getPlantImagesBySubject: () => {
    throw new Error('getPlantImagesBySubject must be called within a PlantImagesProvider');
  },
};

export const PlantImagesContext = createContext<PlantImagesContextValue>(defaultContextValue);

export const PlantImagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value: PlantImagesContextValue = {
    getPlantImagesBySubject: getPlantImagesBySubject,
  };

  return <PlantImagesContext.Provider value={value}>{children}</PlantImagesContext.Provider>;
};

export const usePlantImages = () => {
  const context = useContext(PlantImagesContext);

  // Providerが提供されていない場合のエラーチェック
  if (context === defaultContextValue) {
    throw new Error('usePlantImages must be used within a PlantImagesProvider');
  }

  return context;
};
