import { ImportPlantsType } from '@/shared/types/plant-shared-types';
import { Subject } from '@/shared/types/study-shared-types';

export interface PlantImagesContextValue {
  getPlantImagesBySubject: (subject: Subject, type: ImportPlantsType) => Promise<string[]>;
}
