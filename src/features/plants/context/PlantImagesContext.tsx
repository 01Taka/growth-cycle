import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { ImportPlantsType } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';
import { plantImageLoader } from '../functions/import-plants';
import { PlantImagesContextValue } from './PlantImagesContextType';

const defaultContextValue: PlantImagesContextValue = {
  // 初期値（Providerなしで呼び出された場合にエラーをスロー）
  getPlantImageByIndexPromise: () => {
    throw new Error('getPlantImageByIndexPromise must be called within a PlantImagesProvider');
  },
  getPlantImageByIndexFromCache: () => {
    throw new Error('getPlantImageByIndexPromise must be called within a PlantImagesProvider');
  },
  getPlantImagesBySubjectPromise: () => {
    throw new Error('getPlantImagesBySubjectPromise must be called within a PlantImagesProvider');
  },
  getPlantImageCountPromise: () => {
    throw new Error('getPlantImageCountPromise must be called within a PlantImagesProvider');
  },
  getPlantImageCountFromCache: () => {
    throw new Error('getPlantImageCountFromCache must be called within a PlantImagesProvider');
  },
};

export const PlantImagesContext = createContext<PlantImagesContextValue>(defaultContextValue);

export const PlantImagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value: PlantImagesContextValue = useMemo(() => {
    const getImages = (subject: Subject, type: ImportPlantsType) => {
      return plantImageLoader.getPlantImagesBySubject(subject, type);
    };

    const getImageByIndex = (subject: Subject, type: ImportPlantsType, index: number) => {
      return plantImageLoader.getPlantImageByIndex(subject, type, index);
    };

    const getImageByIndexFromCache = (subject: Subject, type: ImportPlantsType, index: number) => {
      return plantImageLoader.getPlantImageByIndexFromCache(subject, type, index);
    };

    const getCount = (subject: Subject, type: ImportPlantsType) => {
      return plantImageLoader.getPlantImageCount(subject, type);
    };

    const getCountByCache = (subject: Subject, type: ImportPlantsType) => {
      return plantImageLoader.getPlantImageCountFromCache(subject, type);
    };

    return {
      getPlantImageByIndexPromise: getImageByIndex,
      getPlantImageByIndexFromCache: getImageByIndexFromCache,
      getPlantImagesBySubjectPromise: getImages,
      getPlantImageCountPromise: getCount,
      getPlantImageCountFromCache: getCountByCache,
    };
  }, []);

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
