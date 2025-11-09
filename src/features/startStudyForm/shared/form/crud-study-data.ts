import { generateIdbPath } from '@/shared/data/idb/generate-path';

export const curdStudyData = () => {
  const learningCyclePath = generateIdbPath(IDB_PATH.learningCycles, '', true);
  console.log(learningCyclePath);
};
