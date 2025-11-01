import { ImportPlantsType } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/subject-types';

export interface PlantImagesContextValue {
  getPlantImageByIndexPromise: (
    subject: Subject,
    type: ImportPlantsType,
    index: number
  ) => Promise<string>;
  getPlantImageByIndexFromCache: (
    subject: Subject,
    type: ImportPlantsType,
    index: number
  ) => string | null;
  getPlantImagesBySubjectPromise: (subject: Subject, type: ImportPlantsType) => Promise<string[]>;
  getPlantImageCountPromise: (subject: Subject, type: ImportPlantsType) => Promise<number>;
  getPlantImageCountFromCache: (subject: Subject, type: ImportPlantsType) => number | null;
}
