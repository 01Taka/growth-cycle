import { Subject } from '@/shared/types/study-shared-types';

export interface PlantImagesContextValue {
  getPlantImagesBySubject: (subject: Subject) => Promise<string[]>;
}
