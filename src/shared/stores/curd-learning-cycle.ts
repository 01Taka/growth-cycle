import { generateIdbCollectionPath } from '@/shared/data/idb/generate-path';
import { IDB_PATH } from '@/shared/data/idb/idb-path';
import { idbStore } from '@/shared/data/idb/idb-store';
import {
  LearningCycleDocument,
  LearningCycleDocumentSchema,
} from '../data/documents/learning-cycle/learning-cycle-document';

export const getLearningCycles = async () => {
  const LearningCyclePath = generateIdbCollectionPath(IDB_PATH.learningCycles, '');

  const learningCycles = await idbStore.getCollection<LearningCycleDocument>(LearningCyclePath);

  const parsedCycles = learningCycles.map((cycle) => LearningCycleDocumentSchema.parse(cycle));

  return parsedCycles;
};
